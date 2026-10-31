"""Builds one-hero plates from the two-hero shot s2_size (interim, until Codex draws real solo pictures).
The wall, ring band, ropes and floor are rebuilt by mirror-tiling the clean strip left of Tetsu, the blue arc is redrawn as a circle
fitted to the visible edge, then the other hero's column is swapped for that background.
Run from the repo root:  python -I nauka-frames/scripts/solo_plates.py"""
import numpy as np
from PIL import Image, ImageFilter

SRC = "nauka-frames/assets/shots/s2_size.png"
im = np.array(Image.open(SRC).convert("RGB")).astype(np.float32)
H, W, _ = im.shape
ARC = np.array([119, 142, 164], np.float32)
CUT = 690  # x of the clean gap between the heroes

# 1. circle fit to the arc edge (top row edge per column + left edge per row), only where nothing but wall and arc are in view
pts = []
near = lambda p: np.abs(p - ARC).sum() < 40
wall = lambda p: p[0] > 215 and p[1] > 205
for x in range(575, 690, 8):
    for y in range(230, 520):
        if near(im[y, x]) and all(near(im[y + k, x]) for k in range(1, 8)) and wall(im[y - 6, x]):
            pts.append((x, y)); break
for y in range(330, 495, 10):
    for x in range(520, 700):
        if near(im[y, x]) and all(near(im[y, x + k]) for k in range(1, 8)) and wall(im[y, x - 6]):
            pts.append((x, y)); break
P = np.array(pts, np.float64)
A = np.c_[2 * P[:, 0], 2 * P[:, 1], np.ones(len(P))]
b = (P ** 2).sum(1)
cx, cy, c0 = np.linalg.lstsq(A, b, rcond=None)[0]
r = float(np.sqrt(c0 + cx * cx + cy * cy))
print("arc points", len(pts), "circle", round(cx), round(cy), round(r))

# 2. clean background: mirror-tile the strip x in [90, 370) (nothing but wall, ring band, ropes and floor on it)
strip = im[:, 90:370]
period = np.concatenate([strip, strip[:, ::-1]], axis=1)
reps = int(np.ceil(W / period.shape[1])) + 1
bg = np.tile(period, (1, reps, 1))[:, :W]
bg = bg.copy()
bg[:, :90] = im[:, :90]
bg[:, 1230:] = im[:, 1230:]
# arc: only above the ring band (the arc is hidden behind the band below y~500)
yy, xx = np.mgrid[0:H, 0:W]
inside = ((xx - cx) ** 2 + (yy - cy) ** 2 < r * r) & (yy < 505)
bg[inside] = ARC

def blend(base, over, x0, x1, feather=48):
    """over replaces base on columns [x0, x1) with soft edges"""
    out = base.copy()
    w = np.ones(W, np.float32)
    w[:x0] = 0; w[x1:] = 0
    for i in range(feather):
        k = (i + 1) / (feather + 1)
        if x0 + i < W: w[x0 + i] = min(w[x0 + i], k)
        if x1 - 1 - i >= 0: w[x1 - 1 - i] = min(w[x1 - 1 - i], k)
    w = w[None, :, None]
    return base * (1 - w) + over * w

# 3. plates: hero stays, the other one's columns become background
tetsu = blend(im, bg, 672, 1230)       # Tetsu alone: Gromila's columns replaced
gromila = blend(im, bg, 90, 720)       # Gromila alone: Tetsu's columns replaced
for name, arr in (("s2b_tetsu_solo", tetsu), ("s2a_gromila_solo", gromila)):
    Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).save(f"nauka-frames/assets/shots/{name}.png")
    print("wrote", name)
