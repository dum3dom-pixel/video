r"""F5 начинает некоторые фразы низким гулом 50–80 мс перед гласной («Да», «Дима», «Юмора»): на слух это «пуп» или полустон.
clean_onsets ищет такой гул только в начале фразы, после паузы, убирает из него всё ниже cutoff и плавно вводит остаток. Внутри слов не трогает.
python onset_clean.py in.wav out.wav best_words.json   (16 бит, моно)"""
import json, re, sys, wave
import numpy as np


def first_letter(words, t):
    """Первая буква слова, которое звучит в момент t; words: [[начало, конец, слово], ...]."""
    w = next((x[2] for x in words if x[1] >= t + 0.02), "")
    m = re.search(r"[а-яё]", w.lower())
    return m.group(0) if m else ""


def clean_onsets(y, sr, words, min_dur=0.04, cutoff=300.0, letters="дю"):
    """Возвращает (новый сигнал, список (начало, конец) в секундах). Длина и время слов не меняются.
    letters: только фразы на эти буквы. На «Вот», «Я», «Есть» низкие частоты естественны, и без этого фильтра они тоже попадают под чистку."""
    n, hop = int(0.01 * sr), int(0.005 * sr)
    freq = np.fft.rfftfreq(n, 1 / sr)
    win = np.hanning(n)
    R, L = [], []
    for i in range(0, len(y) - n, hop):
        s = y[i:i + n]
        sp = np.abs(np.fft.rfft(s * win)) ** 2
        R.append(10 * np.log10(np.mean(s ** 2) + 1e-12))
        L.append(sp[freq < cutoff].sum() / (sp.sum() + 1e-12))
    R, L = np.array(R), np.array(L)
    ref = np.percentile(R, 95)
    quiet, loud = ref - 28, ref - 24
    out, found, k = y.copy(), [], 0
    while k < len(R) - 60:
        if not (R[k] > loud and (k == 0 or R[k - 1] <= loud) and (R[max(0, k - 16):max(0, k - 3)] < quiet).all()):  # последние 15 мс перед фразой могут уже нарастать
            k += 1
            continue
        if first_letter(words, k * hop / sr) not in letters:
            k += 20
            continue
        run, start = 0, k  # самый длинный участок гула, начатый в первые 40 мс фразы (допускаются два выпавших кадра)
        for st in range(k, k + 9):
            j, miss, last = st, 0, st - 1
            while j < k + 44 and miss <= 2:
                if L[j] > 0.55: last, miss = j, 0
                else: miss += 1
                j += 1
            if last - st + 1 > run: run, start = last - st + 1, st
        end = start + run
        if run * hop / sr >= min_dur and R[end:end + 16].max() >= R[start:end].mean() + 3:  # дальше должна идти более громкая гласная
            a, b = k * hop, end * hop + n // 2
            pad = int(0.05 * sr)
            lo, hi = max(0, a - pad), min(len(y), b + pad)
            F = np.fft.rfft(y[lo:hi])
            f = np.fft.rfftfreq(hi - lo, 1 / sr)
            F *= np.clip((cutoff * 1.4 - f) / (cutoff * 0.4), 0, 1)  # только низ, с плавным скатом
            low = np.fft.irfft(F, hi - lo)
            r = min(int(0.008 * sr), (b - a) // 2)
            w = np.zeros(hi - lo)
            w[a - lo:b - lo] = 1
            w[b - lo - r:b - lo] = 0.5 * (1 + np.cos(np.linspace(0, np.pi, r)))
            out[lo:hi] -= w * low
            out[a:b] *= 0.25 + 0.75 * 0.5 * (1 - np.cos(np.linspace(0, np.pi, b - a)))
            found.append((round(a / sr, 3), round(b / sr, 3)))
        k = max(end, k) + 20
    return out, found


if __name__ == "__main__":
    w = wave.open(sys.argv[1])
    p = w.getparams()
    y = np.frombuffer(w.readframes(p.nframes), dtype=np.int16).astype(np.float64) / 32768
    w.close()
    y2, found = clean_onsets(y, p.framerate, json.load(open(sys.argv[3], encoding="utf-8")))
    print(found)
    o = wave.open(sys.argv[2], "wb")
    o.setparams(p)
    o.writeframes(np.round(np.clip(y2, -1, 32767 / 32768) * 32768).astype(np.int16).tobytes())
    o.close()
