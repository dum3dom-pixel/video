"""Generate the unchanged pilot narration and a measured scene/word timeline."""
import asyncio
import hashlib
import json
import subprocess
import sys
from pathlib import Path

import imageio_ffmpeg
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
SR = 44100
CHUNKS = [
    ('sock', 'Тебя будит носок. Он прилетает прямо в лицо,', '+0Hz', 0.06),
    ('lead', 'а следом голос:', '+0Hz', 0.10),
    ('brother', 'Мелкий, вставай.', '+8Hz', 0.16),
    ('hair', 'Голос твоего брата. Только ему здесь семнадцать, и у него ещё есть волосы.', '+0Hz', 0.12),
    ('calendar', 'На календаре двенадцатое сентября две тысячи пятого.', '+0Hz', 0.16),
    ('reveal', 'Вчера тебе было тридцать три.', '+0Hz', 0.65),
]


def decode(path):
    r = subprocess.run([FFMPEG, '-v', 'error', '-i', str(path), '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True)
    return np.frombuffer(r.stdout, dtype=np.float32).copy()


async def main():
    folder = ROOT / 'assets' / 'voice'
    folder.mkdir(parents=True, exist_ok=True)
    requests = []
    for sid, text, pitch, gap in CHUNKS:
        key = hashlib.sha256(f'Windows-SAPI-Irina|0|{pitch}|{text}'.encode()).hexdigest()
        path = folder / f'{sid}.wav'
        timing = folder / f'{sid}.json'
        cached = json.loads(timing.read_text(encoding='utf-8-sig')) if timing.exists() else {}
        if not path.exists() or cached.get('key') != key:
            requests.append({'id': sid, 'text': text, 'key': key, 'path': str(path), 'timing': str(timing)})
    request_file = folder / '_windows-request.json'
    request_file.write_text(json.dumps(requests, ensure_ascii=False), encoding='utf-8')
    if requests:
        subprocess.run(['powershell.exe', '-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', str(ROOT/'scripts'/'voice-windows.ps1'), '-RequestPath', str(request_file)], check=True)
    scenes, words, pieces = [], [], []
    cursor = 0.0
    for sid, text, pitch, gap in CHUNKS:
        path = folder / f'{sid}.wav'
        timing_path = folder / f'{sid}.json'
        cached = json.loads(timing_path.read_text(encoding='utf-8-sig'))
        samples = decode(path)
        # Remove only codec silence at the edges. Never time-stretch the voice.
        non_silent = np.flatnonzero(np.abs(samples) > 0.003)
        begin = max(0, int(non_silent[0]) - int(0.035*SR)) if len(non_silent) else 0
        end = min(len(samples), int(non_silent[-1]) + int(0.09*SR)) if len(non_silent) else len(samples)
        audio = samples[begin:end]
        dur = len(audio)/SR
        scenes.append({'id': sid, 'text': text, 'start': round(cursor, 5), 'dur': round(dur + gap, 5), 'speechDur': round(dur, 5)})
        timings = cached['words']
        if isinstance(timings, dict):
            timings = [timings]
        # SAPI reports positions on its native voice clock; map those relative
        # positions to the measured output WAV speech interval (no audio stretch).
        first_t = timings[0]['t'] if timings else 0
        last_tail = max(0.20, min(0.48, len(timings[-1]['w'])*0.055)) if timings else 0.25
        native_span = timings[-1]['t'] - first_t + last_tail if timings else dur
        time_scale = max(0.1, dur-0.10) / max(0.1, native_span)
        for wi, word in enumerate(timings):
            local_t = 0.035 + (word['t']-first_t)*time_scale
            next_t = 0.035 + (timings[wi+1]['t']-first_t)*time_scale if wi+1<len(timings) else dur
            words.append({'w': word['w'], 't': round(cursor+local_t,5), 'd': round(max(0.06,next_t-local_t),5), 'scene': sid})
        pieces.extend([audio, np.zeros(round(gap*SR), dtype=np.float32)])
        cursor += dur + gap
        print(f'{sid}: {dur:.2f}s + {gap:.2f}s pause', flush=True)
    # Fabric-only effects, no stock music or outside copyrighted audio.
    master = np.concatenate(pieces)
    rng = np.random.default_rng(2101)
    sock_scene = scenes[0]
    impact = sock_scene['start'] + sock_scene['speechDur'] - 0.10
    for t, length, vol in [(impact-0.32, 0.25, 0.055), (impact, 0.12, 0.11)]:
        n = round(length*SR)
        noise = rng.normal(0, 1, n)
        noise = np.convolve(noise, np.ones(45)/45, mode='same')
        fx = noise*np.sin(np.linspace(0, np.pi, n))**2*vol
        pos = round(max(0,t)*SR)
        master[pos:pos+n] += fx[:len(master[pos:pos+n])]
    raw = ROOT / 'assets' / '_voice.f32'
    raw.write_bytes(master.astype(np.float32).tobytes())
    subprocess.run([FFMPEG, '-y', '-v', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', str(raw), '-af', 'loudnorm=I=-16:TP=-1.5:LRA=9', '-ar', str(SR), '-ac', '2', str(ROOT/'assets'/'master.wav')], check=True)
    raw.unlink()
    spec = {'voice': 'Microsoft Irina Desktop (Russian, Windows SAPI, draft)', 'rate': '0 (no time stretch)', 'total': round(len(master)/SR, 5), 'scenes': scenes, 'words': words, 'sockImpact': round(impact, 5)}
    (ROOT/'spec').mkdir(exist_ok=True)
    (ROOT/'spec'/'timeline.json').write_text(json.dumps(spec, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'Total measured duration: {spec["total"]:.3f}s', flush=True)


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    asyncio.run(main())
