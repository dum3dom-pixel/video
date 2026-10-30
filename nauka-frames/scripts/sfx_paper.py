"""Synthesises the paper sound effects (swipe, slap, snip, crumple) into assets/sfx/*.wav. Seeded, so identical on every run."""
import wave, os
import numpy as np

SR = 44100
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "sfx")

def save(name, x):
    x = x / max(1e-9, np.abs(x).max()) * 0.9
    with wave.open(os.path.join(OUT, name + ".wav"), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype("<i2").tobytes())

def lp_var(x, fc):  # one-pole low-pass with a per-sample cutoff
    y = np.zeros_like(x); s = 0.0
    a = 1 - np.exp(-2 * np.pi * fc / SR)
    for i in range(len(x)):
        s += a[i] * (x[i] - s); y[i] = s
    return y

def hp(x, fc):
    a = 1 - np.exp(-2 * np.pi * fc / SR); y = np.zeros_like(x); s = 0.0
    for i in range(len(x)):
        s += a * (x[i] - s); y[i] = x[i] - s
    return y

rng = np.random.default_rng(42)
# swipe: a sheet dragged across the table - noise whose brightness rises, shaped like a short wave
n = int(0.5 * SR); t = np.arange(n) / SR; u = t / 0.5
sw = lp_var(rng.standard_normal(n), 700 + 5200 * u ** 1.5)
sw = hp(sw, 300) * np.sin(np.pi * u) ** 1.6 * (0.8 + 0.4 * rng.random(n))
save("swipe", sw)
# slap: a flat paper hit - low thump plus a short noise crack
n = int(0.3 * SR); t = np.arange(n) / SR
thump = np.sin(2 * np.pi * np.cumsum(95 * np.exp(-t / 0.05)) / SR) * np.exp(-t / 0.07)
crack = lp_var(rng.standard_normal(n), np.full(n, 4500.0)) * np.exp(-t / 0.018)
save("slap", thump * 0.9 + crack * 0.9)
# snip: scissors - two sharp ticks
n = int(0.2 * SR); t = np.arange(n) / SR
tick = lambda t0: np.where(t >= t0, hp(rng.standard_normal(n), 2500) * np.exp(-np.clip(t - t0, 0, None) / 0.006), 0)
save("snip", tick(0.0) + 0.8 * tick(0.07))
# crumple: dense crackles that thin out
n = int(0.6 * SR); y = np.zeros(n)
for _ in range(70):
    p = rng.random() ** 1.8; i = int(p * (n - 2000)); L = int(rng.integers(60, 500))
    y[i:i + L] += hp(rng.standard_normal(L), 1500) * np.exp(-np.arange(L) / (L * 0.3)) * rng.random() * (1 - p * 0.7)
save("crumple", y)
print("ok")
