"""Пишет timing.ts для «Абилина» из голоса: plain.txt (текст, как его читал голос) + best_words.json (время слов, 30 fps).
Запуск: python gen_timing.py  (из этой папки). Слова текста выравниваются с распознанными через difflib."""
import difflib, json, re, sys, os

VC = r"C:\Users\daatva\voice-clone\out\abilin"
FPS = 30
norm = lambda w: re.sub(r"[^а-яё0-9a-z]", "", w.lower().replace("+", "").replace("ё", "е"))

# (id, первое слово плана (с продолжением, чтобы не спутать), {событие: слово внутри плана})
PLANS = [
    ("p1", "твой корпоратив", {"no": "никто"}),
    ("p2", "даже тот", {"stamp": "придумал"}),
    ("p3", "это парадокс", {"year": "семьдесят"}),
    ("p4", "техас", {}),
    ("p5", "тесть предлагает", {"bub": "давайте"}),
    ("p6", "он просто", {"zz": "гостям"}),
    ("p7", "все отвечают", {"ok": "отличная"}),
    ("p8", "восемьдесят пять", {"ac": "кондиционера"}),
    ("p9", "домой возвращаются", {}),
    ("p10", "и выясняется", {"stamp": "никто"}),
    ("p11", "каждый соглашался", {"arr": "думая"}),
    ("p12", "никто не", {"x": "я"}),
    ("p13", "тесть предложил", {}),
    ("p14", "гости согласились", {}),
    ("p15", "теперь пятница", {"cal": "пятница", "msg": "пишут"}),
    ("p16", "ты не", {"plus": "плюсики", "you": "тоже"}),
    ("p17", "в пятницу", {"no": "никто"}),
    ("p18", "то же", {"dots": "планерке"}),
    ("p19", "начальник решает", {"stamp": "согласны"}),
    ("p20", "профессор джерри", {"paper": "статью"}),
    ("p21", "его вывод", {"cross": "ошибки", "spor": "спорить"}),
    ("p22", "скажи первым", {"bub": "чего", "hands": "вдруг"}),
    ("p23", "иначе поздравляю", {"stamp": "придумал"}),
]

plain = open(os.path.join(VC, "plain.txt"), encoding="utf-8").read().split()
rec = json.load(open(os.path.join(VC, "best_words.json"), encoding="utf-8"))
P = [norm(w) for w in plain]
R = [norm(w[2]) for w in rec]

# соответствие индексов текста индексам распознанных слов
sm = difflib.SequenceMatcher(None, P, R, autojunk=False)
m = {}
for a, b, n in sm.get_matching_blocks():
    for k in range(n): m[a + k] = b + k
known = sorted(m)
def rec_idx(i):
    if i in m: return m[i]
    lo = max([k for k in known if k < i], default=None)
    hi = min([k for k in known if k > i], default=None)
    if lo is None: return max(0, m[hi] - (hi - i))
    if hi is None: return min(len(rec) - 1, m[lo] + (i - lo))
    return round(m[lo] + (m[hi] - m[lo]) * (i - lo) / (hi - lo))

starts = []
cur = 0
for pid, first, ev in PLANS:
    ws = [norm(x) for x in first.split()]
    for i in range(cur, len(P) - len(ws) + 1):
        if P[i:i + len(ws)] == ws:
            starts.append(i); cur = i + 1; break
    else:
        sys.exit(f"не найден план {pid}: {first}")
frame = lambda sec: round(sec * FPS)
t0 = [frame(rec[rec_idx(i)][0]) for i in starts]
t0[0] = 0
last_end = rec[-1][1]
voice_end = frame(last_end)
FADE = 15
TOTAL = voice_end + 12
bounds = t0 + [TOTAL]
out = [f"// Сгенерировано gen_timing.py из best_words.json: кадры (30 fps), моменты внутри плана считаются от его начала.",
       f"export const TOTAL = {TOTAL};", f"export const VOICE_END = {voice_end + 2};", f"export const FADE = {FADE};",
       "export const PLANS: [number, number][] = [" + ", ".join(f"[{bounds[i]}, {bounds[i + 1]}]" for i in range(len(PLANS))) + "];",
       "export const T = {"]
for k, (pid, first, ev) in enumerate(PLANS):
    end_i = starts[k + 1] if k + 1 < len(PLANS) else len(P)
    items = []
    for key, word in ev.items():
        for i in range(starts[k], end_i):
            if P[i] == norm(word):
                items.append(f"{key}: {frame(rec[rec_idx(i)][0]) - bounds[k]}"); break
        else:
            sys.exit(f"нет слова {word} в плане {pid}")
    out.append(f"  {pid}: {{ {', '.join(items)} }},")
out.append("};")
open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "timing.ts"), "w", encoding="utf-8").write("\n".join(out) + "\n")
print("\n".join(out))
for k, (pid, first, ev) in enumerate(PLANS):
    print(pid, bounds[k], bounds[k + 1], round((bounds[k + 1] - bounds[k]) / FPS, 1), "с")
