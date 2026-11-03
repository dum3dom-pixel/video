"""Cuts the ElevenLabs narration into script lines, inserts pauses and writes the film timeline.

Usage (from video-01): python -X utf8 scripts/build_v6_timeline.py v6a 0 36
  part  - output name: spec/timeline-<part>.json, assets/master-<part>.wav
  first/last - script line indexes (assets/voice-eleven/lines-v6.json), inclusive
Cut points sit in the middle of the silence between the last word of one line and the first word of the next.
"""
import json, re, subprocess, sys, wave
import numpy as np

part, first, last = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
SR = 44100
TAIL = 0.8
# extra silence (seconds) inserted before a line, on top of the natural gap
EXTRA = {7: .30, 8: .30, 12: .35, 13: .35, 18: .30, 29: .45, 34: .35, 36: .25, 37: .6,
         19: .12, 21: .12, 23: .12, 25: .12, 26: .12, 27: .12, 28: .25}

lines = json.load(open('assets/voice-eleven/lines-v6.json', encoding='utf-8'))
whisper = json.load(open('assets/voice-eleven/whisper-medium.json', encoding='utf-8'))
ww = [{'w': w['w'].strip(), 's': w['s'], 'e': w['e']} for s in whisper['segments'] for w in s['words'] if w['w'].strip()]
starts = [l['start'] for l in lines] + [whisper['duration']]

by_line = []
for i in range(len(lines)):
    a, b = starts[i], starts[i + 1]
    by_line.append([w for w in ww if a - .05 <= w['s'] < b - .05])

pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', 'assets/voice-eleven/vo-v6-full.wav', '-f', 's16le', '-ac', '1', '-ar', str(SR), '-'],
                     capture_output=True, check=True).stdout
audio = np.frombuffer(pcm, dtype=np.int16).astype(np.float32)

def cut_point(i):
    """Boundary before line i in source seconds."""
    if i == 0 or not by_line[i] or not by_line[i - 1]:
        return starts[i] - .03
    gap_a, gap_b = by_line[i - 1][-1]['e'], by_line[i][0]['s']
    return (gap_a + gap_b) / 2 if gap_b - gap_a > .1 else gap_b - .03

cuts = [max(0, cut_point(i)) for i in range(first, last + 1)]
end_src = by_line[last][-1]['e'] + .25 if by_line[last] else starts[last + 1]
cuts.append(end_src)

out = []
t = 0.0
scenes, words = [], []
fade = int(.008 * SR)
for k, i in enumerate(range(first, last + 1)):
    extra = EXTRA.get(i, 0) if i != first else 0
    if extra:
        out.append(np.zeros(int(extra * SR), dtype=np.float32)); t += extra
    seg = audio[int(cuts[k] * SR):int(cuts[k + 1] * SR)].copy()
    seg[:fade] *= np.linspace(0, 1, fade); seg[-fade:] *= np.linspace(1, 0, fade)
    ws = by_line[i]
    shift = t - cuts[k]
    sid = f'{i:03d}'
    if ws:
        a, e = ws[0]['s'] + shift, ws[-1]['e'] + shift
        scenes.append({'id': sid, 'text': lines[i]['text'], 'start': round(a, 3), 'dur': round(len(seg) / SR, 3),
                       'speechDur': round(e - a, 3), 'section': lines[i]['sec'].split(' (')[0]})
        for w in ws:
            words.append({'w': w['w'], 't': round(w['s'] + shift, 3), 'd': round(w['e'] - w['s'], 3), 'scene': sid})
    out.append(seg); t += len(seg) / SR
out.append(np.zeros(int(TAIL * SR), dtype=np.float32)); t += TAIL
total = round(t, 3)

raw = np.concatenate(out)
tmp = f'assets/_master-{part}-raw.wav'
with wave.open(tmp, 'wb') as f:
    f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR)
    f.writeframes(np.clip(raw, -32768, 32767).astype(np.int16).tobytes())
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', tmp, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', '48000', '-ac', '1', f'assets/master-{part}.wav'], check=True)
import os; os.remove(tmp)

json.dump({'voice': 'ElevenLabs Roger; whisper medium word times; pauses inserted', 'rate': 'n/a', 'total': total, 'scenes': scenes,
           'words': words, 'doorAt': 0.0}, open(f'spec/timeline-{part}.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(part, 'lines', first, '-', last, 'total', total, 's', len(scenes), 'scenes', len(words), 'words')
