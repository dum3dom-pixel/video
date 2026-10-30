"""Pencil scratch sound, synthesized (seeded, deterministic): a few quick strokes of filtered noise."""
import numpy as np, wave, sys
sr = 44100
rng = np.random.default_rng(7)
n = int(sr * 1.0)
out = np.zeros(n)
for start, length in [(0.02, 0.2), (0.26, 0.17), (0.48, 0.24), (0.77, 0.15)]:
    m = int(length * sr)
    noise = rng.standard_normal(m)
    # crude high-pass (difference) + a little smoothing: papery hiss
    hp = np.diff(noise, prepend=0)
    sm = np.convolve(hp, np.ones(3) / 3, mode="same")
    env = np.sin(np.linspace(0, np.pi, m)) ** 0.7
    wob = 0.6 + 0.4 * np.sin(np.linspace(0, 14 * np.pi, m))
    a = int(start * sr)
    out[a:a + m] += sm * env * wob
out = out / (np.abs(out).max() + 1e-9) * 0.7
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
    w.writeframes((out * 32767).astype(np.int16).tobytes())
