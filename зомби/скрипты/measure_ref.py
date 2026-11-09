r"""Замер референса: длина планов и скорость речи.
Запуск (нужен numpy, есть в venv голоса):
  C:\Users\daatva\voice-clone\venv\Scripts\python.exe -I measure_ref.py ref.mp4 [секунд_для_анализа] [sub.ru.vtt]
План = разница кадра с кадром секунду назад выше порога; плавное растворение тоже считается границей."""
import re, subprocess, sys
import numpy as np

video = sys.argv[1]
limit = float(sys.argv[2]) if len(sys.argv) > 2 else 420
sub = sys.argv[3] if len(sys.argv) > 3 else None
FPS, W, H, TH = 6, 64, 36, 9.0

raw = subprocess.run(
    ["ffmpeg", "-v", "error", "-t", str(limit), "-i", video, "-an", "-vf", f"fps={FPS},scale={W}:{H},format=gray", "-f", "rawvideo", "-"],
    capture_output=True, check=True).stdout
a = np.frombuffer(raw, dtype=np.uint8).reshape(-1, H, W).astype(float)
d = np.abs(a[FPS:] - a[:-FPS]).mean((1, 2))

bounds, i = [], 0
while i < len(d):
    if d[i] > TH:
        j = i
        while j < len(d) and d[j] > TH:
            j += 1
        bounds.append((i + int(np.argmax(d[i:j])) + FPS) / FPS)
        i = j
    else:
        i += 1
L = np.diff(np.r_[0, bounds]) if bounds else np.array([limit])
print(f"анализ {limit:.0f} с: границ {len(bounds)}, план: средний {L.mean():.1f} с, медиана {np.median(L):.1f} с, мин {L.min():.1f}, макс {L.max():.1f}")
print("границы, с:", [round(b, 1) for b in bounds[:30]])

if sub:
    text = []
    for block in open(sub, encoding="utf-8").read().split("\n\n"):
        if re.search(r"\d\d:\d\d:\d\d\.\d+ -->", block):
            for line in block.split("\n")[1:]:
                line = re.sub("<[^>]+>", "", line).strip()
                if line and line not in text[-3:]:
                    text.append(line)
    full = " ".join(text)
    dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", video]))
    print(f"речь: {len(full.split())} слов, {len(full.split()) / (dur / 60):.0f} слов/мин, {len(full) / dur:.1f} симв/с (по всему ролику)")
