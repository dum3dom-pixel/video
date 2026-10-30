"""Mixes voice + sfx + music into assets/master.wav from spec/audio.json (written by build.mjs).
Music ducks under the voice; the result is normalised to -14 LUFS / -1 dBTP with ffmpeg loudnorm."""
import json, subprocess, sys, os
import numpy as np

SR = 44100
spec = json.load(open("spec/audio.json", encoding="utf-8"))
total = spec["total"]
n = int((total + 1) * SR)

def decode(path):
    out = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
    return np.frombuffer(out, dtype=np.float32)

cache = {}
def load(path):
    if path not in cache:
        cache[path] = decode(path)
    return cache[path]

voice = np.zeros(n, dtype=np.float32)
fx = np.zeros(n, dtype=np.float32)
music = np.zeros(n, dtype=np.float32)
vact = np.zeros(n, dtype=np.float32)
for it in spec["items"]:
    a = load(it["src"]) * it["vol"]
    s = int(it["start"] * SR)
    e = min(n, s + len(a))
    if it["id"].startswith("v-"):
        voice[s:e] += a[: e - s]
        vact[s:e] = 1
    elif it["id"].startswith("music"):
        music[s:e] += a[: e - s]
    else:
        fx[s:e] += a[: e - s]

# duck music under speech: smooth the voice-activity mask (0.25 s each way)
k = int(0.25 * SR)
cs = np.concatenate([[0.0], np.cumsum(vact, dtype=np.float64)])
idx = np.arange(n)
lo, hi = np.clip(idx - k // 2, 0, n), np.clip(idx + k // 2, 0, n)
env = ((cs[hi] - cs[lo]) / np.maximum(hi - lo, 1)).astype(np.float32)
music *= 1 - 0.6 * np.clip(env * 1.5, 0, 1)
mix = voice + fx + music
peak = np.abs(mix).max()
if peak > 0.95:
    mix *= 0.95 / peak
raw = "assets/_master_raw.f32"
mix.astype(np.float32).tofile(raw)
subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", raw,
                "-af", "loudnorm=I=-14:TP=-1:LRA=11,aformat=channel_layouts=stereo", "-ar", str(SR), "assets/master.wav"], check=True)
os.remove(raw)
print("master.wav", total, "s")
