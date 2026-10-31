"""Neural narration for the 15-second pilot: edge-tts voice + measured word timeline.

Writes spec/timeline.json in the same shape as scripts/voice.py (the SAPI draft),
so build.mjs and the engine stay unchanged.
"""
import asyncio
import json
import subprocess
import sys
from pathlib import Path

import edge_tts
import imageio_ffmpeg
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
SR = 44100
NARRATOR = 'ru-RU-DmitryNeural'
# id, text, voice kwargs, pause after the chunk
PILOT_CHUNKS = [
    ('sock', 'Тебя будит носок. Он прилетает прямо в лицо,', {}, 0.04),
    ('lead', 'а следом голос:', {}, 0.08),
    ('brother', 'Мелкий, вставай.', {'pitch': '+30Hz', 'rate': '+14%'}, 0.10),
    ('hair', 'Голос твоего брата. Только ему здесь семнадцать, и у него ещё есть волосы.', {}, 0.12),
    ('calendar', 'На календаре двенадцатое сентября две тысячи пятого.', {}, 0.14),
    ('reveal', 'Вчера тебе было тридцать три.', {}, 0.45),
]
# Second minute (channels/chto-esli/video-01-minute-02.md), one chunk per storyboard beat.
M02_CHUNKS = [
    ('hookA', 'Ты помнишь всё, что случится в следующие двадцать один год. Каждый день, каждое лицо. И все эти годы придётся молчать: двенадцатилетним не верят.', {}, 0.25),
    ('question', 'Что, если ты проснулся в двенадцать лет, помнишь, как всё будет, и никому не можешь об этом сказать?', {}, 0.35),
    ('rules', 'Правила простые, и от этого хуже.', {}, 0.20),
    ('forget', 'Ты ничего не забудешь. Ни цен, ни дат, ни лиц. Кнопки «перезапуск» нет.', {}, 0.20),
    ('prove', 'И ты ничего не докажешь. Пока ты ребёнок, твои слова про будущее — фантазия. Взрослые кивают и просят доесть суп.', {}, 0.20),
    ('alone', 'Остаётся одно: двадцать один год жить рядом с людьми, зная про них больше, чем они сами.', {}, 0.30),
    ('day1', 'Первый день уходит на то, чтобы не заорать.', {}, 0.15),
    ('kitchen', 'Кухня та же. Клеёнка в клетку, на холодильнике магнит из Анапы.', {}, 0.10),
    ('mama', 'Мама режет хлеб и спрашивает, почему ты так смотришь.', {}, 0.45),
    ('age', 'А ты смотришь, потому что ей тридцать восемь.', {}, 0.80),
]
PART = sys.argv[1] if len(sys.argv) > 1 else 'pilot'
CHUNKS = M02_CHUNKS if PART == 'm02' else PILOT_CHUNKS
SUFFIX = '-m02' if PART == 'm02' else ''
RATE = '+12%'


def decode(path):
    r = subprocess.run([FFMPEG, '-v', 'error', '-i', str(path), '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True)
    return np.frombuffer(r.stdout, dtype=np.float32).copy()


async def synth(text, kw, mp3):
    kw = {'rate': RATE, **kw}
    for attempt in range(8):
        try:
            words, data = [], bytearray()
            async for ch in edge_tts.Communicate(text, NARRATOR, boundary='WordBoundary', **kw).stream():
                if ch['type'] == 'audio':
                    data += ch['data']
                elif ch['type'] == 'WordBoundary':
                    words.append({'w': ch['text'].strip('.,:;!?— '), 't': ch['offset'] / 1e7, 'd': ch['duration'] / 1e7})
            mp3.write_bytes(bytes(data))
            return words
        except Exception:
            await asyncio.sleep(6 + 6 * attempt)
    raise RuntimeError(f'edge-tts failed for: {text}')


async def main():
    folder = ROOT / 'assets' / 'voice-neural'
    folder.mkdir(parents=True, exist_ok=True)
    scenes, words, pieces = [], [], []
    cursor = 0.0
    for sid, text, kw, gap in CHUNKS:
        mp3 = folder / f'{PART}_{sid}.mp3'
        cache = mp3.with_suffix('.json')
        key = {'text': text, 'kw': kw, 'rate': RATE, 'voice': NARRATOR}
        if mp3.exists() and cache.exists() and json.loads(cache.read_text(encoding='utf-8')).get('key') == key:
            raw = json.loads(cache.read_text(encoding='utf-8'))['words']
        else:
            raw = await synth(text, kw, mp3)
            cache.write_text(json.dumps({'key': key, 'words': raw}, ensure_ascii=False), encoding='utf-8')
            await asyncio.sleep(5.0)
        samples = decode(mp3)
        non_silent = np.flatnonzero(np.abs(samples) > 0.004)
        begin = max(0, int(non_silent[0]) - int(0.03 * SR))
        end = min(len(samples), int(non_silent[-1]) + int(0.08 * SR))
        audio = samples[begin:end]
        dur = len(audio) / SR
        scenes.append({'id': sid, 'text': text, 'start': round(cursor, 5), 'dur': round(dur + gap, 5), 'speechDur': round(dur, 5)})
        shift = begin / SR
        for w in raw:
            words.append({'w': w['w'], 't': round(cursor + max(0.0, w['t'] - shift), 5), 'd': round(w['d'], 5), 'scene': sid})
        pieces.extend([audio, np.zeros(round(gap * SR), dtype=np.float32)])
        cursor += dur + gap
        print(f'{sid}: {dur:.2f}s + {gap:.2f}s pause, {len(raw)} words', flush=True)
    master = np.concatenate(pieces)
    # Sock lands on the last word of the first chunk; fabric rustle and soft thud are synthesised.
    impact = max((w['t'] for w in words if w['scene'] == 'sock'), default=0.0)
    rng = np.random.default_rng(2101)
    for t, length, vol in ([(impact - 0.32, 0.25, 0.055), (impact, 0.12, 0.11)] if PART == 'pilot' else []):
        n = round(length * SR)
        noise = np.convolve(rng.normal(0, 1, n), np.ones(45) / 45, mode='same')
        fx = noise * np.sin(np.linspace(0, np.pi, n)) ** 2 * vol
        pos = round(max(0, t) * SR)
        master[pos:pos + n] += fx[:len(master[pos:pos + n])]
    tmp = ROOT / 'assets' / '_voice.f32'
    tmp.write_bytes(master.astype(np.float32).tobytes())
    subprocess.run([FFMPEG, '-y', '-v', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', str(tmp), '-af', 'loudnorm=I=-16:TP=-1.5:LRA=9', '-ar', str(SR), '-ac', '2', str(ROOT / 'assets' / f'master{SUFFIX}.wav')], check=True)
    tmp.unlink()
    spec = {'voice': f'{NARRATOR} (edge-tts, rate {RATE}; brother pitch +30Hz)', 'rate': RATE, 'total': round(len(master) / SR, 5), 'scenes': scenes, 'words': words, 'sockImpact': round(impact, 5)}
    (ROOT / 'spec' / f'timeline{SUFFIX}.json').write_text(json.dumps(spec, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'Total: {spec["total"]:.3f}s; sock impact {impact:.2f}s', flush=True)


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    asyncio.run(main())
