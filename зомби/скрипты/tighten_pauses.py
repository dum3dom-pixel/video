"""Укорачивает паузы внутри сплошного дубля F5-TTS. Паузу ищет по RMS окнами 20 мс (порог -33 дБ): у F5 в паузе шумовой пол,
из-за которого silenceremove срабатывает не всегда.
Запуск: tighten_pauses.py вход.wav выход.wav [макс_пауза_с]; без выхода (-) только печатает паузы."""
import sys
import numpy as np
import soundfile as sf

src, dst = sys.argv[1], sys.argv[2]
keep = float(sys.argv[3]) if len(sys.argv) > 3 else 0.22
a, sr = sf.read(src, dtype="float32")
if a.ndim > 1:
    a = a.mean(axis=1)
hop = int(sr * 0.02)
n = len(a) // hop
rms = np.array([np.sqrt(np.mean(a[i * hop:(i + 1) * hop] ** 2)) for i in range(n)])
quiet = 20 * np.log10(rms + 1e-9) < -33
runs, i = [], 0
while i < n:
    if quiet[i]:
        j = i
        while j < n and quiet[j]:
            j += 1
        if (j - i) * 0.02 > keep:
            runs.append((i, j))
        i = j
    else:
        i += 1
for i, j in runs:
    print(f"{i * 0.02:.2f}-{j * 0.02:.2f} ({(j - i) * 0.02:.2f})")
print("total", round(sum(j - i for i, j in runs) * 0.02, 2), "s in", len(runs), "pauses, duration", round(len(a) / sr, 2))
if dst != "-":
    out, pos, half = [], 0, int(keep * sr / 2)
    fade = int(0.01 * sr)
    for i, j in runs:
        s, e = i * hop, j * hop
        if s == 0 or j >= n:
            continue  # начало и хвост не трогаем: их задаёт сборка дорожки
        head = a[pos:s + half].copy()
        head[-fade:] *= np.linspace(1, 0, fade)
        out.append(head)
        pos = e - half
        a[pos:pos + fade] *= np.linspace(0, 1, fade)
    out.append(a[pos:])
    b = np.concatenate(out)
    sf.write(dst, b, sr)
    print("written", dst, round(len(b) / sr, 2))
