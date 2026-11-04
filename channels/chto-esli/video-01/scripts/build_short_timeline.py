"""Timeline for the looping Short: aligns a narration recording to the script lines and writes spec/timeline-<name>.json
(same scenes/words format as the film) plus assets/master-<name>.wav (trimmed tight so the end flows into the start).

Usage (from video-01):
  python -X utf8 scripts/build_short_timeline.py <name> <script.txt> --tts [voice] [rate]   scratch voice (edge-tts), for timing only
  python -X utf8 scripts/build_short_timeline.py <name> <script.txt> <recording.(wav|mp3)>   the author's real recording
Script lines = non-empty lines of the txt file. Whisper (medium) gives word times; numbers come back as digits and are
expanded into Russian words before the DP match against the script words."""
import asyncio, difflib, json, re, subprocess, sys, wave
import numpy as np

name, script_p, src = sys.argv[1], sys.argv[2], sys.argv[3]
SR = 48000
U = 'ноль один два три четыре пять шесть семь восемь девять'.split()
T10 = 'десять одиннадцать двенадцать тринадцать четырнадцать пятнадцать шестнадцать семнадцать восемнадцать девятнадцать'.split()
TENS = '_ _ двадцать тридцать сорок пятьдесят шестьдесят семьдесят восемьдесят девяносто'.split()
HUN = '_ сто двести триста четыреста пятьсот шестьсот семьсот восемьсот девятьсот'.split()


def num(n):
    if n < 10: return [U[n]]
    if n < 20: return [T10[n - 10]]
    if n < 100: return [TENS[n // 10]] + ([U[n % 10]] if n % 10 else [])
    if n < 1000: return [HUN[n // 100]] + (num(n % 100) if n % 100 else [])
    th = n // 1000
    t = {1: ['тысяча'], 2: ['две', 'тысячи']}.get(th, num(th) + ['тысяч'])
    return t + (num(n % 1000) if n % 1000 else [])


cl = lambda s: re.sub(r'[^а-яa-z0-9]', '', s.lower().replace('ё', 'е'))
sim = lambda a, b: difflib.SequenceMatcher(None, a, b).ratio()
lines = [l.strip() for l in open(script_p, encoding='utf-8') if l.strip()]

if src == '--tts':
    import edge_tts
    voice = sys.argv[4] if len(sys.argv) > 4 else 'ru-RU-DmitryNeural'
    rate = sys.argv[5] if len(sys.argv) > 5 else '+8%'
    src = f'assets/_scratch-{name}.mp3'
    asyncio.run(edge_tts.Communicate(' '.join(lines), voice, rate=rate).save(src))
    print('scratch voice', voice, rate)

raw = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True).stdout, dtype=np.float32).copy()

from faster_whisper import WhisperModel
segs, _ = WhisperModel('medium', device='cpu', compute_type='int8').transcribe(src, language='ru', word_timestamps=True, vad_filter=False)
wh = []
for s in segs:
    for w in s.words:
        t = cl(w.word)
        if not t: continue
        if t.isdigit():
            ws = num(int(t)); n = len(ws)
            for k, x in enumerate(ws): wh.append((w.start + (w.end - w.start) * k / n, w.start + (w.end - w.start) * (k + 1) / n, x))
        else: wh.append((w.start, w.end, t))

toks, own, shown = [], [], []
for i, l in enumerate(lines):
    for x in l.split():
        if cl(x): toks.append(cl(x)); own.append(i); shown.append(x)
n, m = len(toks), len(wh)
MATCH, MIS, GAP = 2.0, -1.2, -1.0
sc = [[0.0] * (m + 1) for _ in range(n + 1)]
bt = [[0] * (m + 1) for _ in range(n + 1)]
for j in range(1, m + 1): sc[0][j] = j * GAP; bt[0][j] = 2
for i in range(1, n + 1): sc[i][0] = i * GAP; bt[i][0] = 1
for i in range(1, n + 1):
    for j in range(1, m + 1):
        s = sim(toks[i - 1], wh[j - 1][2])
        d = sc[i - 1][j - 1] + (MATCH if s >= .75 else MIS); u = sc[i - 1][j] + GAP; l_ = sc[i][j - 1] + GAP
        b = max(d, u, l_); sc[i][j] = b; bt[i][j] = 0 if b == d else (1 if b == u else 2)
i, j, mapped = n, m, {}
while i > 0 and j > 0:
    c = bt[i][j]
    if c == 0:
        if sim(toks[i - 1], wh[j - 1][2]) >= .75: mapped[i - 1] = (wh[j - 1][0], wh[j - 1][1])
        i -= 1; j -= 1
    elif c == 1: i -= 1
    else: j -= 1
print('script words', n, 'whisper words', m, 'mapped', len(mapped))
T = [mapped[k][0] if k in mapped else None for k in range(n)]
for k in range(n):
    if T[k] is None:
        a = max((q for q in range(k) if T[q] is not None), default=None); b = min((q for q in range(k + 1, n) if T[q] is not None), default=None)
        T[k] = (T[a] + (T[b] - T[a]) * (k - a) / (b - a)) if a is not None and b is not None else (T[b] - .2 * (b - k) if b is not None else T[a] + .25 * (k - a))
end_last = mapped[n - 1][1] if (n - 1) in mapped else T[-1] + .35

lead = .05
cut0 = max(0, T[0] - lead)
cut1 = end_last + .06  # the last word flows straight into the first word of the next loop
seg = raw[int(cut0 * SR):int(cut1 * SR)].copy()
f = int(.006 * SR); seg[:f] *= np.linspace(0, 1, f); seg[-f:] *= np.linspace(1, 0, f)
tmp = f'assets/_master-{name}-raw.wav'
with wave.open(tmp, 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(seg, -1, 1) * 32767).astype(np.int16).tobytes())
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', tmp, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', '48000', '-ac', '1', f'assets/master-{name}.wav'], check=True)
import os; os.remove(tmp)
total = round(len(seg) / SR, 3)

scenes, words = [], []
for li, l in enumerate(lines):
    idx = [k for k in range(n) if own[k] == li]
    t0 = T[idx[0]] - cut0; nxt = (T[idx[-1] + 1] - cut0) if idx[-1] + 1 < n else total
    last_end = (mapped[idx[-1]][1] - cut0) if idx[-1] in mapped else min(nxt, T[idx[-1]] - cut0 + .4)
    scenes.append({'id': f'{li:03d}', 'text': l, 'start': round(t0, 3), 'dur': round(nxt - t0, 3), 'speechDur': round(last_end - t0, 3), 'section': 'Short'})
    for q, k in enumerate(idx):
        t = T[k] - cut0; d = (T[k + 1] - cut0 - t) if k + 1 < n else total - t
        words.append({'w': shown[k], 't': round(t, 3), 'd': round(min(d, .7), 3), 'scene': f'{li:03d}'})
json.dump({'voice': 'scratch edge-tts' if 'scratch' in src else 'author recording', 'rate': 'n/a', 'total': total, 'scenes': scenes, 'words': words, 'doorAt': 0.0},
          open(f'spec/timeline-{name}.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(name, 'total', total, 's;', len(scenes), 'scenes;', ' '.join(f"{s['id']}@{s['start']}" for s in scenes))
