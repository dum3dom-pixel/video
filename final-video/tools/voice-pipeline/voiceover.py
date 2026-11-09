r"""Озвучка одной командой: текст -> числа словами -> ударения -> дубли F5 -> сверка -> лучший дубль с громкостью -15 LUFS.
По умолчанию «монолитный» режим: каждое предложение генерируется отдельно, берётся дубль без обрыва в конце (F5 иногда режет последнее слово), стык 0,06 с с плавным затуханием, speed 1.0. --whole: старый режим, весь текст одним проходом, speed 0.9.
venv\Scripts\python.exe voiceover.py texts\piter.txt --name piter
--dry: только подготовить текст. Результат в out\NAME: best.wav, best_words.json (время слов), marked.txt, disputed.txt, report.json.
Ошибки ударений правятся в stress_dict.txt: слово с «+», по одному на строку."""
import argparse, difflib, hashlib, json, msvcrt, os, re, shutil, subprocess, time
import numpy as np, soundfile as sf, librosa
import ctypes, torch
ctypes.windll.kernel32.SetPriorityClass(ctypes.windll.kernel32.GetCurrentProcess(), 0x4000)  # BELOW_NORMAL: система и браузер не лагают, ffmpeg и whisper наследуют
torch.set_num_threads(4)  # по умолчанию 16 потоков на CPU, а считает GPU
from f5_tts.api import F5TTS
from onset_clean import clean_onsets

D = os.path.dirname(os.path.abspath(__file__))
TEXT_PY = os.path.join(D, "venv-text", "Scripts", "python.exe")
TOOLS = os.path.join(D, "text_tools.py")
ENV = dict(os.environ, PYTHONIOENCODING="utf-8", HF_HUB_DISABLE_SYMLINKS_WARNING="1")

ap = argparse.ArgumentParser()
ap.add_argument("script")
ap.add_argument("--name", required=True)
ap.add_argument("--voice", default="friend")
ap.add_argument("--takes", type=int, default=3)
ap.add_argument("--speed", type=float, default=None)
ap.add_argument("--whole", action="store_true")
ap.add_argument("--nfe", type=int, default=64)
ap.add_argument("--dry", action="store_true")
ap.add_argument("--min-words", type=int, default=4, help="предложения не длиннее N слов приклеиваются к предыдущему (0 = не клеить)")
ap.add_argument("--gap", type=float, default=0.26, help="пауза после предложения, с (у референса в среднем 0,25)")
ap.add_argument("--gap-q", type=float, default=0.36, help="пауза после вопроса или восклицания, с")
ap.add_argument("--fade-out", type=float, default=0.025, help="затухание конца фразы, с (0,06 съедало концы слов)")
ap.add_argument("--split-depth", type=float, default=24.0, help="склеенную короткую фразу режем паузой, только если на стыке звук упал минимум на N дБ ниже слова; 0 = не резать вообще")
ap.add_argument("--room", type=float, default=-30.0, help="тихий фон комнаты, дБ относительно голоса (0 = выключен, на стыках цифровая тишина)")
ap.add_argument("--onset-min", type=float, default=0.04, help="убирать низкий гул перед гласной в начале фразы, если он длится не меньше N секунд (0 = не трогать)")
ap.add_argument("--short-speed", type=float, default=1.0, help="скорость для коротких предложений (≤ --short-words слов): F5 сжимает их и съедает конец слова; 1.0 = выключено")
ap.add_argument("--short-words", type=int, default=4)
ap.add_argument("--tries", type=int, default=12, help="сколько сидов пробовать на предложение")
ap.add_argument("--no-asr", action="store_true", help="не проверять распознаванием, что последнее слово предложения прозвучало целиком")
ap.add_argument("--slow", action="append", default=[], help='"фрагмент=скорость": предложение с этим фрагментом читается с другой скоростью (F5 задаёт длину короткой фразы по числу букв и съедает конец слова, например --slow "пл+атье=0.75")')
a = ap.parse_args()
if a.speed is None: a.speed = 0.9 if a.whole else 1.0

out = os.path.join(D, "out", a.name)
subprocess.run([TEXT_PY, TOOLS, "prepare", a.script, out], check=True, env=ENV)
if a.dry:
    raise SystemExit
marked = open(os.path.join(out, "marked.txt"), encoding="utf-8").read().strip()

# Одна озвучка на GPU за раз: два параллельных запуска делят видеокарту пополам и греют её так же. Замок снимается сам при выходе процесса.
os.makedirs(os.path.join(D, "out"), exist_ok=True)
gpu_lock = open(os.path.join(D, "out", "_gpu.lock"), "w")
while True:
    try: msvcrt.locking(gpu_lock.fileno(), msvcrt.LK_NBLCK, 1); break
    except OSError: print("жду GPU: другая озвучка ещё идёт", flush=True); time.sleep(20)

v = os.path.join(D, "voices", a.voice)
# Размеченный образец: в тесте дубли с ним распознавались чище всего.
ref_path = os.path.join(v, "ref_marked.txt")
ref_text = open(ref_path if os.path.exists(ref_path) else os.path.join(v, "ref.txt"), encoding="utf-8").read().strip()
tts = F5TTS(model="F5TTS_v1_Base",
            ckpt_file=os.path.join(D, "model", "F5TTS_v1_Base_v4_winter", "model_212000.safetensors"),
            vocab_file=os.path.join(D, "model", "F5TTS_v1_Base", "vocab.txt"), device="cuda")
wavs = []
SR = 24000
TRIM, NEED = 45, 18.0  # порог обрезки тишины (дБ), нужное затухание конца фразы (дБ)
db = lambda x: 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9)

def sentences(text):
    parts = [x.strip() for x in re.split(r"(?<=[.?!])\s+", text) if x.strip()]
    out_ = []
    for x in parts:  # совсем короткие вставки приклеиваем к предыдущему предложению
        if out_ and len(x.split()) <= a.min_words: out_[-1] += " " + x
        else: out_.append(x)
    return out_

CACHE = os.path.join(D, "out", "_cache")  # готовые генерации по (голос, образец, текст, сид, nfe, speed): дубли take_N пересекаются по сидам, перезапуски почти бесплатны
os.makedirs(CACHE, exist_ok=True)

def infer(text, path, seed):
    sp = next((float(x.rsplit("=", 1)[1]) for x in a.slow if x.rsplit("=", 1)[0] in text), a.speed)
    if sp == a.speed and len(text.split()) <= a.short_words: sp = a.short_speed
    hit = os.path.join(CACHE, hashlib.md5(f"{a.voice}|{ref_text}|{text}|{seed}|{a.nfe}|{sp}".encode()).hexdigest() + ".wav")
    if os.path.exists(hit):
        shutil.copy(hit, path); return
    for _ in range(8):  # GPU могут делить с другими процессами: при сбое ждём и повторяем
        try:
            tts.infer(os.path.join(v, "ref.wav"), ref_text, text, file_wave=path, speed=sp, seed=seed, nfe_step=a.nfe, show_info=lambda *_: None)
            shutil.copy(path, hit); return
        except RuntimeError:
            import torch; torch.cuda.empty_cache(); time.sleep(4)
    raise SystemExit("GPU не отвечает")

asr = None
if not a.whole and not a.no_asr:
    asr = subprocess.Popen([os.path.join(D, "venv-text", "Scripts", "python.exe"), os.path.join(D, "asr_worker.py")], stdin=subprocess.PIPE, stdout=subprocess.PIPE, text=True, encoding="utf-8", env=ENV)
    assert asr.stdout.readline().strip() == "ready"

def heard(path):
    asr.stdin.write(path + "\n"); asr.stdin.flush(); return json.loads(asr.stdout.readline())

lat = lambda t: "".join(re.findall(r"[а-яё0-9 ]", t.lower().replace("+", "").replace("ё", "е")))
def verify(text, y, tag):
    """Последнее слово предложения должно прозвучать: F5 задаёт длину по числу букв и режет конец (платье -> плать, «Вот Лера» -> «Вот»)."""
    if asr is None: return True
    tmp = os.path.join(out, f"_v_{tag}.wav"); sf.write(tmp, y, SR)
    got = lat(heard(tmp)).split(); want = lat(text).split(); os.remove(tmp)
    if not got or not want: return False
    return difflib.SequenceMatcher(None, want[-1], got[-1]).ratio() >= 0.7 and difflib.SequenceMatcher(None, " ".join(want), " ".join(got)).ratio() >= 0.8

for s in range(1, a.takes + 1):
    wav = os.path.join(out, f"take_{s}.wav")
    if a.whole:
        raw = os.path.join(out, f"take_{s}_raw.wav")
        infer(marked, raw, s)
        # F5 оставляет провалы между фразами: ужимаем их до проверки, чтобы время слов совпало с итоговым голосом.
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-af", "silenceremove=stop_periods=-1:stop_duration=0.16:stop_threshold=-32dB:stop_silence=0.14", wav], check=True)
    else:
        sents = sentences(marked)
        parts = []
        for i, l in enumerate(sents):
            best = None
            for sd in range(s, s + a.tries):  # дубли предложения: первый с мягким концом и целым последним словом, иначе лучший по (слово цело, мягкость)
                raw = os.path.join(out, f"take_{s}_s{i}.wav")
                infer(l, raw, sd)
                y, _ = sf.read(raw)
                y, _ = librosa.effects.trim(y, top_db=TRIM)
                drop = db(y) - db(y[-int(0.04 * SR):])
                ok = verify(l, y, f"{s}_{i}")
                if best is None or (ok, drop) > best[0]: best = ((ok, drop), y)
                if ok and drop >= NEED: break
            y = best[1].copy()
            fo, fi = int(a.fade_out * SR), int(0.015 * SR)  # косинусные края: жёсткий вход и выход давали щелчки на стыках; 60 мс съедали концы слов, поэтому короткое
            y[-fo:] *= 0.5 * (1 + np.cos(np.linspace(0, np.pi, fo))); y[:fi] *= 0.5 * (1 - np.cos(np.linspace(0, np.pi, fi)))
            parts.append(y)
            if i < len(sents) - 1:
                q = l.rstrip().rstrip("»\"' ").endswith(("?", "!"))
                parts.append(np.zeros(int(SR * (a.gap_q if q else a.gap))))
            os.remove(raw)
        sf.write(wav, np.concatenate(parts), SR)
    wavs.append(wav)

if asr: asr.stdin.close(); asr.wait()
subprocess.run([TEXT_PY, TOOLS, "check", out] + wavs, check=True, env=ENV)
best = json.load(open(os.path.join(out, "report.json"), encoding="utf-8"))["best"]

# Короткие фразы (≤ --min-words) генерируются слитно с соседней и шли без паузы («Ему не прилетит.» обрывалась сразу). Режем такие места
# по самому тихому месту рядом со стыком слов и вставляем паузу; времена слов сдвигаем на вставленное.
y, _ = sf.read(os.path.join(out, best + ".wav"))
W = json.load(open(os.path.join(out, best + ".json"), encoding="utf-8"))
if not a.whole and a.split_depth > 0:
    cuts = []; skipped = 0
    for k in range(len(W) - 1):
        t = W[k][2].rstrip("»\"' ")
        gap_now = W[k + 1][0] - W[k][1]
        if t.endswith((".", "?", "!")) and gap_now < 0.12:
            lo = max(int(0.03 * SR), int((W[k][1] - 0.06) * SR)); hi = int((W[k + 1][0] + 0.06) * SR)
            if hi - lo < 480: continue
            sm = np.convolve(y[lo:hi] ** 2, np.ones(240) / 240, "same")
            # времена слов от распознавания неточны: режем только там, где на стыке настоящий провал звука, иначе слово рвётся посередине
            ref = 10 * np.log10(np.mean(y[int(W[k][0] * SR):int(W[k][1] * SR)] ** 2) + 1e-12)
            if 10 * np.log10(sm.min() + 1e-12) > ref - a.split_depth: skipped += 1; continue
            cuts.append((k, lo + int(np.argmin(sm)), max(0.0, (a.gap_q if t.endswith(("?", "!")) else a.gap) - max(0.0, gap_now))))
    pieces, prev, shift, shifts = [], 0, 0.0, {}
    cosf = lambda n: 0.5 * (1 + np.cos(np.linspace(0, np.pi, n)))
    for k, c, add in cuts:
        seg = y[prev:c].copy(); fo = min(int(0.012 * SR), len(seg)); seg[-fo:] *= cosf(fo)
        pieces += [seg, np.zeros(int(SR * add))]; prev = c; shift += add; shifts[k + 1] = shift
        y[c:c + int(0.012 * SR)] *= cosf(int(0.012 * SR))[::-1][:len(y[c:c + int(0.012 * SR)])]
    pieces.append(y[prev:]); y = np.concatenate(pieces)
    cur = 0.0
    for j, w in enumerate(W):
        cur = shifts.get(j, cur); w[0] = round(w[0] + cur, 2); w[1] = round(w[1] + cur, 2)
    print(f"паузы вставлены в {len(cuts)} склеенных стыков (пропущено без провала: {skipped}), +{shift:.1f} с")
if not a.whole and a.onset_min > 0:  # низкий гул F5 перед гласной в начале фразы («пуп»)
    y, found = clean_onsets(y, SR, W, min_dur=a.onset_min)
    print(f"гул в начале фразы убран в {len(found)} местах: {found}")
if a.room < 0:  # тихий розовый шум с медленным «дыханием»: между фразами не цифровой ноль, а комната
    rng = np.random.default_rng(1); n = len(y)
    F = np.fft.rfft(rng.standard_normal(n)); f = np.fft.rfftfreq(n, 1 / SR)
    F[1:] /= np.sqrt(f[1:]); F[f < 70] = 0; F *= 1 / (1 + (f / 4500) ** 4)
    bed = np.fft.irfft(F, n)
    wob = np.interp(np.arange(n), np.linspace(0, n, max(2, int(n / SR / 3))), rng.uniform(0.75, 1.25, max(2, int(n / SR / 3))))
    bed *= wob * (np.sqrt(np.mean(y ** 2)) * 10 ** (a.room / 20) / np.sqrt(np.mean((bed * wob) ** 2)))
    y = y + bed
sf.write(os.path.join(out, "best_pre.wav"), y, SR)
json.dump(W, open(os.path.join(out, "best_words.json"), "w", encoding="utf-8"), ensure_ascii=False)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", os.path.join(out, "best_pre.wav"), "-af", "loudnorm=I=-15:TP=-1.5:LRA=11", "-ar", "48000", os.path.join(out, "best.wav")], check=True)
print(best)
