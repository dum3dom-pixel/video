"""Adds SFX to the Short's narration (assets/master-<name>.wav) and muxes it into the silent render.
Usage (from video-01): python -X utf8 scripts/mix_short.py short-loop renders/short-loop-draft.mp4 renders/short-loop.mp4
SFX times come from spec/timeline-<name>.json; no music (the channel's other videos have none)."""
import json, os, re, subprocess, sys, wave
import numpy as np

name, VIDEO, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
SR = 48000
db = lambda x: 10 ** (x / 20)
norm = lambda s: re.sub(r'[^а-яa-z0-9]', '', s.lower().replace('ё', 'е'))
tl = json.load(open(f'spec/timeline-{name}.json', encoding='utf-8'))


def load(p, ss=None, t=None):
    c = ['ffmpeg', '-v', 'error'] + (['-ss', str(ss)] if ss is not None else []) + (['-t', str(t)] if t else []) + ['-i', p, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-']
    return np.frombuffer(subprocess.run(c, capture_output=True, check=True).stdout, dtype=np.float32).copy()


voice = load(f'assets/master-{name}.wav')
N = len(voice)
sfxbuf = np.zeros(N, np.float32)


def word(sc, stem):
    h = [w for w in tl['words'] if w['scene'] == sc and norm(w['w']).startswith(norm(stem))]
    return h[0]['t'] if h else [s for s in tl['scenes'] if s['id'] == sc][0]['start']


def ev(t, slug, s0=0, s1=None, peak=-22, fi=.01, fo=.08, lead=True):
    a = load(f'assets/audio/sfx/{slug}.mp3', ss=s0, t=None if s1 is None else s1 - s0)
    if lead:
        i = np.argmax(np.abs(a) > .15 * np.max(np.abs(a)))
        a = a[max(0, i - int(.03 * SR)):]
    a = a / (np.max(np.abs(a)) + 1e-9) * db(peak)
    n = len(a); fi_, fo_ = int(fi * SR), min(int(fo * SR), n // 2)
    a[:fi_] *= np.linspace(0, 1, fi_); a[-fo_:] *= np.linspace(1, 0, fo_)
    i = int(round(max(0, t) * SR))
    e = min(N, i + n)
    if e > i: sfxbuf[i:e] += a[:e - i]


ev(0.0, 'door-open-close', 0, 3, -21, .01, .5)                    # the door opens on the very first frame
ev(word('002', 'двенадцатое') - .05, 'page-turn-04', 0, .6, -27)  # calendar leaf
ev(word('003', 'мама') + .2, 'clock-ticking', 4, 7, -33, .2, .5, lead=False)
ev(word('003', 'пора'), 'pencil-writing-long', 5.4, 9.4, -28, .2, .6, lead=False)
ev(word('004', 'доллар'), 'coin-jar', 0, 1.2, -27)
for stem in ('тополь', 'папин', 'дед', 'костин'):
    ev(word('004', stem) - .02, 'page-turn-1', 0, .35, -29)
ev(word('005', 'седьмой') + .5, 'marker-scribble', 0, .6, -22)
ev(word('006', 'суп') - .1, 'cup-stir', 0, 1.6, -31, .05, .4)
ev(word('007', 'быстрее') - .1, 'pencil-writing-short', 0, 2.6, -28, .1, .5, lead=False)
ev(word('008', 'выключает') + .1, 'light-switch', 0, 1.2, -19)
ev(word('008', 'за') + .1, 'fridge-hum', 3, 3 + (tl['total'] - word('008', 'за')), -39, .8, .05, lead=False)

mix = voice + sfxbuf
tmp = 'renders/_mix-short.wav'
with wave.open(tmp, 'wb') as f:
    f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR)
    f.writeframes((np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes())
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', VIDEO, '-i', tmp, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11',
                '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', OUT], check=True)
os.remove(tmp)
print('wrote', OUT)
