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
    ('wake', 'Ты просыпаешься.', {}, 0.22),
    ('enter', 'В комнату заходит брат.', {}, 0.10),
    ('brother', 'Мелкий, вставай.', {'pitch': '+30Hz', 'rate': '+14%'}, 0.10),
    ('hair', 'Только ему здесь семнадцать, а ты помнишь его взрослым мужиком.', {}, 0.12),
    ('calendar', 'На календаре двенадцатое сентября две тысячи пятого.', {}, 0.14),
    ('reveal', 'Вчера тебе было тридцать три.', {}, 0.45),
]
# Second minute (channels/chto-esli/video-01-script-v3.md), one chunk per storyboard beat.
M02_CHUNKS = [
    ('hookA', 'Ты помнишь всё, что случится в следующие двадцать один год. Каждый день, каждое лицо. И все эти годы придётся молчать: двенадцатилетним не верят.', {}, 0.25),
    ('cassettes', 'Через двадцать один год ты поставишь брату одну из своих кассет. И он скажет, что этого никогда не было.', {}, 0.40),
    ('question', 'Что, если ты проснулся в двенадцать лет, помнишь, как всё будет, и никому не можешь об этом сказать?', {}, 0.35),
    ('restart', 'Кнопки «перезапуск» нет. Эти годы ты проживёшь заново, день за днём.', {}, 0.20),
    ('words', 'А слова про будущее не работают. Пока ты ребёнок, любая правда звучит как фантазия. Взрослые кивают и просят доесть суп.', {}, 0.20),
    ('convince', 'Убедить можно только тем, что сбудется. А почти всё, что ты знаешь, сбудется нескоро.', {}, 0.20),
    ('alone', 'Так что двадцать один год ты будешь жить рядом с людьми и знать про них больше, чем они сами.', {}, 0.30),
    ('day1', 'Первый день уходит на то, чтобы не заорать.', {}, 0.15),
    ('kitchen', 'Кухня та же. Клеёнка в клетку, на холодильнике магнит из Анапы.', {}, 0.10),
    ('mama', 'Мама режет хлеб и спрашивает, почему ты так смотришь.', {}, 0.45),
    ('age', 'А ты смотришь, потому что ей тридцать восемь.', {}, 0.80),
]

# Everything after the pilot from video-01-script-v4.md: one chunk per spoken line, characters get their own pitch/voice.
KOSTYA = {'pitch': '+30Hz', 'rate': '+14%'}
PAPA = {'pitch': '-14Hz'}
MAMA = {'voice': 'ru-RU-SvetlanaNeural'}
DED = {'pitch': '-22Hz', 'rate': '+2%'}
KID = {'pitch': '+45Hz', 'rate': '+8%'}
THOUGHT = {'pitch': '-8Hz', 'rate': '+2%'}
LINES = {
    '— Сань, ты чего? Заболел?': [('Сань, ты чего? Заболел?', PAPA)],
    '— Двенадцать лет, а сидит как бухгалтер.': [('Двенадцать лет, а сидит как бухгалтер.', MAMA)],
    '— Зачем тебе?': [('Зачем тебе?', KOSTYA)],
    '— Запись — две кнопки сразу. Сломаешь — купишь новый.': [('Запись — две кнопки сразу. Сломаешь — купишь новый.', KOSTYA)],
    '— Привет. Это ты. Только старше. Не выключай.': [('Привет. Это ты. Только старше. Не выключай.', KID)],
    '— С чего вдруг?': [('С чего вдруг?', KOSTYA)],
    '— Ладно. Что надо?': [('Ладно. Что надо?', KOSTYA)],
    '— Какой кредит? — смеётся папа. — Ты мне ещё про пенсию расскажи.': [('Какой кредит?', PAPA), ('смеётся папа.', {}), ('Ты мне ещё про пенсию расскажи.', PAPA)],
    '— Сань. Ты откуда знал?': [('Сань. Ты откуда знал?', PAPA)],
    '— Чего тебе тут? У тебя друзья, девчонки.': [('Чего тебе тут? У тебя друзья, девчонки.', DED)],
    '— Нашёл на антресолях. Ты что, кассеты двадцать лет хранил?': [('Нашёл на антресолях. Ты что, кассеты двадцать лет хранил?', KOSTYA)],
    '— Это что?': [('Это что?', KOSTYA)],
    '— Ты мне ночью ни разу не звонил.': [('Ты мне ночью ни разу не звонил.', KOSTYA)],
    '— Дурак, — говорит он и хлопает тебя по плечу.': [('Дурак,', KOSTYA), ('говорит он и хлопает тебя по плечу.', {})],
}
YEARS = [
    ('2006, 2007 и дальше, до 2025', 'две тысячи шестой, две тысячи седьмой и дальше, до две тысячи двадцать пятого'),
    ('«2024»', '«две тысячи двадцать четвёртый»'),
    ('«2026»', '«две тысячи двадцать шестой»'),
    ('«2008»', '«две тысячи восьмой»'),
]


def v4_chunks():
    text = (ROOT.parent / 'video-01-script-v4.md').read_text(encoding='utf-8')
    body = text[text.index('Ты помнишь следующие'):text.index('## Нарезки')]
    chunks, section, jump, new_section = [], 'hook', False, False
    for raw in body.splitlines():
        line = raw.strip()
        if not line or line == '---':
            continue
        if line.startswith('## '):
            section, new_section = line[3:].split(' (')[0], True
            continue
        if line.startswith('[') and line.endswith(']') and not line.startswith('[Мысль]'):
            jump = True
            continue
        if line.startswith('[Мысль] '):
            parts = [(line[8:], THOUGHT)]
        elif line.startswith('—'):
            parts = LINES.get(line, [(line.lstrip('— '), {})])
        else:
            parts = [(line, {})]
        for i, (t, kw) in enumerate(parts):
            for a, b in YEARS:
                t = t.replace(a, b)
            assert not any(c.isdigit() for c in t), t
            gap = 0.30 if kw is THOUGHT else 0.15 if line.startswith('—') or t.endswith(':') else 0.22
            if i < len(parts) - 1:
                gap = 0.05
            chunks.append({'text': t, 'kw': kw, 'gap': gap, 'section': section, 'jump': jump if i == 0 else False, 'new': new_section if i == 0 else False})
        jump = new_section = False
    out = []
    for n, c in enumerate(chunks):
        nxt = chunks[n + 1] if n + 1 < len(chunks) else None
        gap = c['gap'] + (0.55 if nxt and nxt['new'] else 0.12 if nxt and nxt['jump'] else 0.0)
        out.append((f'{n:03d}', c['text'], c['kw'], 0.8 if nxt is None else gap, c['section']))
    return out


PART = sys.argv[1] if len(sys.argv) > 1 else 'pilot'
SECTIONS = {}
if PART == 'v4':
    CHUNKS = []
    for sid, text, kw, gap, sec in v4_chunks():
        CHUNKS.append((sid, text, kw, gap))
        SECTIONS[sid] = sec
else:
    CHUNKS = M02_CHUNKS if PART == 'm02' else PILOT_CHUNKS
SUFFIX = {'m02': '-m02', 'v4': '-v4'}.get(PART, '')
RATE = '+12%'


def decode(path):
    r = subprocess.run([FFMPEG, '-v', 'error', '-i', str(path), '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True)
    return np.frombuffer(r.stdout, dtype=np.float32).copy()


async def synth(text, kw, mp3):
    kw = {'rate': RATE, **kw}
    voice = kw.pop('voice', NARRATOR)
    for attempt in range(8):
        try:
            words, data = [], bytearray()
            async for ch in edge_tts.Communicate(text, voice, boundary='WordBoundary', **kw).stream():
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
        scenes.append({'id': sid, 'text': text, 'start': round(cursor, 5), 'dur': round(dur + gap, 5), 'speechDur': round(dur, 5), **({'section': SECTIONS[sid]} if sid in SECTIONS else {})})
        shift = begin / SR
        for w in raw:
            words.append({'w': w['w'], 't': round(cursor + max(0.0, w['t'] - shift), 5), 'd': round(w['d'], 5), 'scene': sid})
        pieces.extend([audio, np.zeros(round(gap * SR), dtype=np.float32)])
        cursor += dur + gap
        print(f'{sid}: {dur:.2f}s + {gap:.2f}s pause, {len(raw)} words', flush=True)
    master = np.concatenate(pieces)
    # The brother opens the door as the second chunk starts; a soft door rustle is synthesised.
    door = next((s['start'] for s in scenes if s['id'] == 'enter'), 0.0)
    rng = np.random.default_rng(2101)
    for t, length, vol in ([(door - 0.08, 0.30, 0.05)] if PART == 'pilot' else []):
        n = round(length * SR)
        noise = np.convolve(rng.normal(0, 1, n), np.ones(45) / 45, mode='same')
        fx = noise * np.sin(np.linspace(0, np.pi, n)) ** 2 * vol
        pos = round(max(0, t) * SR)
        master[pos:pos + n] += fx[:len(master[pos:pos + n])]
    tmp = ROOT / 'assets' / '_voice.f32'
    tmp.write_bytes(master.astype(np.float32).tobytes())
    subprocess.run([FFMPEG, '-y', '-v', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', str(tmp), '-af', 'loudnorm=I=-16:TP=-1.5:LRA=9', '-ar', str(SR), '-ac', '2', str(ROOT / 'assets' / f'master{SUFFIX}.wav')], check=True)
    tmp.unlink()
    spec = {'voice': f'{NARRATOR} (edge-tts, rate {RATE}; brother pitch +30Hz)', 'rate': RATE, 'total': round(len(master) / SR, 5), 'scenes': scenes, 'words': words, 'doorAt': round(door, 5)}
    (ROOT / 'spec' / f'timeline{SUFFIX}.json').write_text(json.dumps(spec, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'Total: {spec["total"]:.3f}s; door at {door:.2f}s', flush=True)


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    asyncio.run(main())
