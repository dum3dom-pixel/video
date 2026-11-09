"""Пишет timing.ts для эпизода из озвучки: plain.txt (текст, как читал голос) + best_words.json (время слов, 30 fps).
python gen_timing.py --spec plans.json --voice voice-clone/out/ТЕМА --out what-if-studio/src/episodes/ТЕМА-bw/timing.ts [--tail 36 --fade 12]
plans.json: [["id", "первые слова плана", {"событие": "слово внутри плана"}], ...]
Слова текста выравниваются с распознанными через difflib. tail: кадров после последнего слова (плашка «дальше»), fade: длина ухода в белое."""
import argparse, difflib, json, os, re, sys

ap = argparse.ArgumentParser()
ap.add_argument("--spec", required=True); ap.add_argument("--voice", required=True); ap.add_argument("--out", required=True)
ap.add_argument("--tail", type=int, default=12); ap.add_argument("--fade", type=int, default=15)
a = ap.parse_args()
FPS = 30
norm = lambda w: re.sub(r"[^а-яё0-9a-z]", "", w.lower().replace("+", "").replace("ё", "е"))
PLANS = json.load(open(a.spec, encoding="utf-8"))
plain = open(os.path.join(a.voice, "plain.txt"), encoding="utf-8").read().split()
rec = json.load(open(os.path.join(a.voice, "best_words.json"), encoding="utf-8"))
P = [norm(w) for w in plain]; R = [norm(w[2]) for w in rec]

m = {}
for i, j, n in difflib.SequenceMatcher(None, P, R, autojunk=False).get_matching_blocks():
    for k in range(n): m[i + k] = j + k
known = sorted(m)
def rec_idx(i):
    if i in m: return m[i]
    lo = max([k for k in known if k < i], default=None); hi = min([k for k in known if k > i], default=None)
    if lo is None: return max(0, m[hi] - (hi - i))
    if hi is None: return min(len(rec) - 1, m[lo] + (i - lo))
    return round(m[lo] + (m[hi] - m[lo]) * (i - lo) / (hi - lo))

starts, cur = [], 0
for pid, first, ev in PLANS:
    ws = [norm(x) for x in first.split()]
    for i in range(cur, len(P) - len(ws) + 1):
        if P[i:i + len(ws)] == ws: starts.append(i); cur = i + 1; break
    else: sys.exit(f"не найден план {pid}: {first}")
fr = lambda s: round(s * FPS)
t0 = [fr(rec[rec_idx(i)][0]) for i in starts]; t0[0] = 0
voice_end = fr(rec[-1][1]); TOTAL = voice_end + a.tail
bounds = t0 + [TOTAL]
out = ["// Сгенерировано final-video/tools/gen_timing.py из best_words.json: кадры (30 fps), моменты внутри плана считаются от его начала.",
       f"export const TOTAL = {TOTAL};", f"export const VOICE_END = {voice_end + 2};", f"export const FADE = {a.fade};",
       "export const PLANS: [number, number][] = [" + ", ".join(f"[{bounds[i]}, {bounds[i + 1]}]" for i in range(len(PLANS))) + "];", "export const T = {"]
for k, (pid, first, ev) in enumerate(PLANS):
    end_i = starts[k + 1] if k + 1 < len(PLANS) else len(P)
    items = []
    for key, word in ev.items():
        for i in range(starts[k], end_i):
            if P[i] == norm(word): items.append(f"{key}: {fr(rec[rec_idx(i)][0]) - bounds[k]}"); break
        else: sys.exit(f"нет слова {word} в плане {pid}")
    out.append(f"  {pid}: {{ {', '.join(items)} }},")
out.append("};")
open(a.out, "w", encoding="utf-8").write("\n".join(out) + "\n")
print(f"TOTAL {TOTAL} кадров = {TOTAL / FPS:.1f} с")
for k, (pid, *_ ) in enumerate(PLANS): print(pid, bounds[k], bounds[k + 1], round((bounds[k + 1] - bounds[k]) / FPS, 1), "с")
