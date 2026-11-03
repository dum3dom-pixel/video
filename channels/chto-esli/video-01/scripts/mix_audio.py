"""Mixes narration + human-made music (assets/audio/music) + SFX (assets/audio/sfx) and muxes it into the film.
Usage (from video-01): python -X utf8 scripts/mix_audio.py [film in] [film out]
Part offsets come from the part renders in renders/; SFX times come from spec/timeline-v6*.json + spec/film-v6*-shots.json."""
import json, os, re, subprocess, sys, wave
import numpy as np

SR = 48000
IN = sys.argv[1] if len(sys.argv) > 1 else 'renders/film-v6-full-draft.mp4'
OUT = sys.argv[2] if len(sys.argv) > 2 else 'renders/film-v6-full-sound.mp4'
PARTS = [('a', 'part-v6a-opening.mp4'), ('b', 'part-v6b-epochs1-3.mp4'), ('c', 'part-v6c-epochs4-5.mp4'),
         ('d', 'part-v6d-epoch6.mp4'), ('e', 'part-v6e-finale.mp4')]
db = lambda x: 10 ** (x / 20)
norm = lambda s: re.sub(r'[^а-яa-z0-9]', '', s.lower().replace('ё', 'е'))


def dur(p):
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p],
                                capture_output=True, text=True).stdout)


def load(p, af=None, ss=None, t=None):
    c = ['ffmpeg', '-v', 'error'] + (['-ss', str(ss)] if ss is not None else []) + (['-t', str(t)] if t else []) + ['-i', p]
    c += (['-af', af] if af else []) + ['-f', 'f32le', '-ac', '1', '-ar', str(SR), '-']
    return np.frombuffer(subprocess.run(c, capture_output=True, check=True).stdout, dtype=np.float32).copy()


voice = load(IN)
N = len(voice)
total = N / SR
buf_sfx = np.zeros(N, np.float32)
buf_music = np.zeros(N, np.float32)


def add(buf, a, t):
    i = int(round(t * SR))
    if i >= N or i + len(a) <= 0:
        return
    s = max(0, -i)
    e = min(len(a), N - i)
    buf[i + s:i + e] += a[s:e]


def fade(a, fi=.01, fo=.05):
    a = a.copy()
    n = len(a)
    fi = min(int(fi * SR), n // 2)
    fo = min(int(fo * SR), n // 2)
    if fi:
        a[:fi] *= np.linspace(0, 1, fi)
    if fo:
        a[-fo:] *= np.linspace(1, 0, fo)
    return a


# ---- music: loudness-matched beds with equal-power crossfades (slug, start, end, fade in, fade out) ----
MUSIC = [('twilight-poem', 0, 152, 4, 6), ('leaf-fall', 146, 394, 6, 6), ('back-home', 388, 621, 6, 6),
         ('late-spring', 615, 779, 6, 6), ('piano-improvisation-2', 773, total, 6, 8)]
for slug, t0, t1, fi, fo in MUSIC:
    a = load(f'assets/audio/music/{slug}.mp3', af='loudnorm=I=-23:TP=-3:LRA=7')
    a = a[:int((t1 - t0) * SR)]
    x = np.linspace(0, 1, int(fi * SR))
    y = np.linspace(0, 1, int(fo * SR))
    a[:len(x)] *= np.sin(x * np.pi / 2)
    a[-len(y):] *= np.cos(y * np.pi / 2)
    add(buf_music, a, t0)

# ---- narration activity -> ducking gain (computed at 100 Hz, then interpolated) ----
w = int(.05 * SR)
env = np.sqrt(np.convolve(voice ** 2, np.ones(w) / w, 'same'))
act = (env > db(-50)).astype(np.float32)[::SR // 100]
k = 12
act = np.convolve(act, np.ones(k) / k, 'same')
att = np.exp(-1 / (0.15 * 100))
rel = np.exp(-1 / (0.7 * 100))
g = np.zeros(len(act), np.float32)
cur = 0.
for i, v in enumerate(act):
    cur = att * cur + (1 - att) * v if v > cur else rel * cur + (1 - rel) * v
    g[i] = cur
gfull = np.interp(np.arange(N) / SR, np.arange(len(g)) / 100, g).astype(np.float32)
duck = 1 - 0.5 * np.clip(gfull * 1.4, 0, 1)
music = buf_music * duck

# ---- SFX ----
SFXF = {}


def sfx(slug, s0=0, s1=None, peak=-20, fi=.01, fo=.06):
    key = (slug, s0, s1, peak)
    if key not in SFXF:
        a = load(f'assets/audio/sfx/{slug}.mp3', ss=s0, t=None if s1 is None else s1 - s0)
        SFXF[key] = fade(a / (np.max(np.abs(a)) + 1e-9) * db(peak), fi, fo)
    return SFXF[key]


off = 0
nwipe = 0
WH = ['page-turn-02', 'page-turn-04', 'paper-rustle', 'page-turn-1']
for p, f in PARTS:
    tl = json.load(open(f'spec/timeline-v6{p}.json', encoding='utf-8'))
    shots = json.load(open(f'spec/film-v6{p}-shots.json', encoding='utf-8'))['shots']
    SC = {s['id']: s for s in tl['scenes']}

    def word(sc, stem):
        h = [x for x in tl['words'] if x['scene'] == sc and norm(x['w']).startswith(norm(stem))]
        return h[0]['t'] if h else SC[sc]['start']

    def cue(c):
        if len(c) == 1:
            return SC[c[0]]['start']
        if isinstance(c[1], str):
            return word(c[0], c[1])
        ws = [x for x in tl['words'] if x['scene'] == c[0]]
        return ws[c[1]]['t'] if c[1] < len(ws) else SC[c[0]]['start']

    st = {s['id']: cue(s['cue']) for s in shots}
    for s in shots:  # paper wipe sweep
        if s['in'] == 'wipe' and st[s['id']] > .3:
            nwipe += 1
            add(buf_sfx, sfx(WH[nwipe % 4], peak=-23 - (nwipe % 3) * 2), off + st[s['id']] - .04)

    def ev(t, a):
        add(buf_sfx, a, off + t)

    if p == 'a':
        ev(SC['002']['start'] - 1.2, sfx('door-open-close', 0, 5, -21, .02, .4))
        ev(SC['030']['start'] + SC['030']['speechDur'] - .3, sfx('marker-scribble', 0, .55, -22))
        ev(SC['032']['start'], sfx('marker-scribble', 0, .55, -22))
        ev(SC['033']['start'] + SC['033']['speechDur'] - .2, sfx('marker-scribble', 0, .55, -22))
        ev(st['plan_sheet'], sfx('pencil-writing-long', 5.4, 27, -27, .3, 1.2))
    if p == 'b':
        ev(st['clock'], sfx('clock-ticking', 4, 8.1, -31, .2, .6))
        ev(word('049', 'сколько') - .1, sfx('chalk-write', 0, .5, -22))
        ev(st['rec_keys'], sfx('button-press', 0, .2, -17))
        ev(st['rec_keys'] + .45, sfx('cassette-play-button', 2.3, 3.3, -25))
        ev(word('068', 'звонок') - .2, sfx('phone-ring', 0, 2.2, -26, .01, .3))
    if p == 'c':
        ev(st['flash_papers'], sfx('paper-rustle', peak=-22))
        ev(word('094', 'бумаги'), sfx('page-turn-1', peak=-21))
    if p == 'd':
        ev(word('129', 'звонит') - .1, sfx('phone-ring', 0, 3.2, -26, .01, .4))
    if p == 'e':
        ev(st['player'] + .2, sfx('cassette-insert', 0, 2.4, -25, .02, .3))
        ev(word('147', 'шипение') - .1, sfx('tape-hiss', 5, 9.2, -33, .4, .6))
        ev(st['rec_keys'], sfx('button-press', 0, .2, -17))
        ev(st['rec_keys'] + .45, sfx('cassette-play-button', 2.3, 3.3, -25))
        ev(st['recording'], sfx('tape-hiss', 12, 34, -37, 1.5, 2.0))
    off += dur('renders/' + f)
print('parts end at', round(off, 2), 'film', round(total, 2), 'wipes', nwipe)

mix = voice + music + buf_sfx


def lufs(a):
    r = subprocess.run(['ffmpeg', '-hide_banner', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-af', 'ebur128', '-f', 'null', '-'],
                       input=a.tobytes(), capture_output=True).stderr.decode()
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', r)[-1])


print('LUFS voice', lufs(voice), 'music(ducked)', lufs(music), 'sfx', lufs(buf_sfx), 'mix', lufs(mix))
rms = lambda a: round(20 * np.log10(np.sqrt(np.mean(a ** 2)) + 1e-9), 1)
for tt in (10, 90, 142.2, 300, 774, 840):  # dBFS rms of each stem in a 3 s window
    i = int(tt * SR)
    print(f'  t={tt}: voice {rms(voice[i:i + 3 * SR])} music {rms(music[i:i + 3 * SR])} sfx {rms(buf_sfx[i:i + 3 * SR])}')
tmp = 'renders/_mix.wav'
with wave.open(tmp, 'wb') as f:
    f.setnchannels(1)
    f.setsampwidth(2)
    f.setframerate(SR)
    f.writeframes((np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes())
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', IN, '-i', tmp, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-af',
                'loudnorm=I=-14:TP=-1.5:LRA=11', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', OUT], check=True)
os.remove(tmp)
print('wrote', OUT, round(dur(OUT), 1), 's')
