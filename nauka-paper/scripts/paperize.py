"""Turns the grey character sheets (nauka-toon) into paper-cutout puppet parts.
Per hero: cut the front view out of the black plate, posterise to a few paper tones, add paper grain,
a torn white margin, and split into parts with joint pivots (assets/paper/<hero>/*.png + rig.json).
All noise is seeded (numpy default_rng) so the output is identical on every run.
Run: python scripts/paperize.py [preview]"""
import json, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, ".."))
SHEETS = os.path.normpath(os.path.join(ROOT, "..", "nauka-toon", "assets", "img"))
OUT = os.path.join(ROOT, "assets", "paper")

hexc = lambda s: np.array([int(s[i:i + 2], 16) for i in (1, 3, 5)], dtype=np.float32)
INK = "#2b2622"
RIM = "#f6f1e4"
RAMPS = {  # (upper luminance bound, colour); first entry is the printed ink line
    "skin": [(40, INK), (110, "#8a5532"), (158, "#c28552"), (205, "#dfae78"), (232, "#ecc994"), (256, "#f7e6c2")],
    "mustard": [(22, INK), (58, "#9a6f14"), (82, "#c08a1c"), (108, "#d9a63a"), (256, "#efca70")],
    "gray": [(30, INK), (85, "#5d6066"), (112, "#7d8187"), (140, "#9a9ea3"), (256, "#bcbfc3")],
    "blue": [(22, INK), (58, "#34495c"), (84, "#4b667d"), (110, "#6a89a3"), (256, "#8caac0")],
    "cream": [(60, INK), (150, "#c9bd9c"), (195, "#e3d9bd"), (256, "#f7f0de")],
    "hair": [(40, INK), (120, "#7c776e"), (170, "#a9a398"), (256, "#d8d2c4")],
}
RED = [(150, "#9e1f1f"), (210, "#d02a2a"), (256, "#e43a2f")]


def vnoise(h, w, cell, rng):
    gh, gw = h // cell + 3, w // cell + 3
    g = rng.random((gh, gw)).astype(np.float32)
    a = np.asarray(Image.fromarray(g, "F").resize((gw * cell, gh * cell), Image.BICUBIC), dtype=np.float32)
    return np.clip(a[:h, :w], 0, 1)


def ramp_apply(L, ramp):
    ths = np.array([r[0] for r in ramp])
    cols = np.stack([hexc(r[1]) for r in ramp])
    idx = np.digitize(L, ths)
    return cols[np.clip(idx, 0, len(ramp) - 1)]


def figure_mask(rgb, thr=11):
    """Silhouette of a figure on the pure black plate: threshold, close, fill inner holes (beard, hair, dark clothes)."""
    L = rgb.max(axis=2)
    m = Image.fromarray(((L > thr) * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(9))
    ff = m.copy()
    ImageDraw.floodfill(ff, (0, 0), 128)
    filled = (np.asarray(ff) != 128)
    mm = Image.fromarray((filled * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(9))
    return np.asarray(mm, dtype=np.float32) / 255


def torn(a, rng, base=5.5):
    """Outward torn margin: blurred mask thresholded with a wobbling per-pixel level."""
    h, w = a.shape
    bl = np.asarray(Image.fromarray((a * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(base)), dtype=np.float32) / 255
    thr = 0.11 + 0.20 * vnoise(h, w, 20, rng) + 0.07 * (vnoise(h, w, 3, rng) - 0.5) + 0.03 * (rng.random((h, w)).astype(np.float32) - 0.5)
    return np.clip((bl - thr) / 0.06 + 0.5, 0, 1)


def grain(h, w, rng):
    n = 0.45 * vnoise(h, w, 2, rng) + 0.35 * vnoise(h, w, 7, rng) + 0.20 * vnoise(h, w, 31, rng)
    fib = (rng.random((h, w)).astype(np.float32) - 0.5) * 0.5
    return 1 + 0.16 * (n - 0.5) * 2 + 0.05 * fib


def make_color(rgb, mat, oy=0, ox=0):
    """rgb: HxWx3 float crop. mat: ramp name, or (name_dark, name_light, split) / callable(L, rgb, yy, xx)."""
    L = np.asarray(Image.fromarray(rgb.astype(np.uint8)).convert("L").filter(ImageFilter.GaussianBlur(1.0)), dtype=np.float32)
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    red = ((r - np.maximum(g, b)) > 45) & (r > 90)
    if callable(mat):
        col = mat(L, rgb, oy, ox)
    elif isinstance(mat, tuple):
        dark, light, split = mat
        col = np.where((L > split)[..., None], ramp_apply(L, RAMPS[light]), ramp_apply(L, RAMPS[dark]))
        ink = L < 26
        col = np.where(ink[..., None], hexc(INK), col)
    else:
        col = ramp_apply(L, RAMPS[mat])
    rc = ramp_apply(r, RED)
    return np.where(red[..., None], rc, col)


def build_part(rgb, fig, poly, mat, seed, pad=18, discs=()):
    """Cut `poly` out of the figure, colour it, add grain + torn margin. Returns RGBA array and its offset in the sheet."""
    h, w = fig.shape
    pm = Image.new("L", (w, h), 0)
    dr = ImageDraw.Draw(pm)
    dr.polygon([tuple(p) for p in poly], fill=255)
    for (dx, dy, rr) in discs:
        dr.ellipse([dx - rr, dy - rr, dx + rr, dy + rr], fill=255)
    a = fig * (np.asarray(pm, dtype=np.float32) / 255)
    ys, xs = np.where(a > 0.5)
    x0, x1, y0, y1 = max(xs.min() - pad, 0), min(xs.max() + pad + 1, w), max(ys.min() - pad, 0), min(ys.max() + pad + 1, h)
    a = a[y0:y1, x0:x1]
    crop = rgb[y0:y1, x0:x1]
    rng = np.random.default_rng(seed)
    col = make_color(crop, mat, y0, x0)
    gr = grain(*a.shape, rng)
    fa = np.asarray(Image.fromarray((a * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7)), dtype=np.float32) / 255
    rim = hexc(RIM) * grain(*a.shape, rng)[..., None] * 0.985
    out_rgb = col * gr[..., None] * fa[..., None] + rim * (1 - fa[..., None])
    alpha = torn(a, rng)
    rgba = np.dstack([np.clip(out_rgb, 0, 255), alpha * 255]).astype(np.uint8)
    return rgba, (int(x0), int(y0))


def mirror(poly, cx):
    return [(2 * cx - x, y) for x, y in poly]


def rig_hero(name, sheet, view, mats, parts, seed0):
    rgb = np.asarray(Image.open(os.path.join(SHEETS, name, sheet)).convert("RGB"), dtype=np.float32)
    vx0, vx1 = view
    fig = figure_mask(rgb)
    fig[:, :vx0] = 0
    fig[:, vx1:] = 0
    ys, xs = np.where(fig > 0.5)
    cx = float((xs.min() + xs.max()) / 2)
    out_dir = os.path.join(OUT, name)
    os.makedirs(out_dir, exist_ok=True)
    rig = {"cx": cx, "top": int(ys.min()), "feet": int(ys.max()), "parts": {}}
    for i, (pname, spec) in enumerate(parts.items()):
        poly, pivot, mat = spec["poly"], spec["pivot"], spec["mat"]
        rgba, (ox, oy) = build_part(rgb, fig, poly, mats[mat] if isinstance(mat, str) else mat, seed0 + i, discs=spec.get("discs", ()))
        fn = f"{pname}.png"
        Image.fromarray(rgba, "RGBA").save(os.path.join(out_dir, fn), optimize=True)
        rig["parts"][pname] = {"file": f"assets/paper/{name}/{fn}", "x": ox, "y": oy, "w": rgba.shape[1], "h": rgba.shape[0], "pivot": pivot}
    json.dump(rig, open(os.path.join(out_dir, "rig.json"), "w"), indent=1)
    return rig


# ---------------- Tetsu (front view, cx ~350) ----------------
def tetsu_parts():
    cx = 350
    P = {}
    P["head"] = {"poly": [(296, 100), (404, 100), (406, 250), (388, 272), (312, 272), (294, 250)], "pivot": (350, 258), "mat": "skin"}
    P["torso"] = {"poly": [(262, 255), (438, 255), (452, 300), (444, 442), (256, 442), (248, 300)], "pivot": (350, 440), "mat": "skin"}
    P["pelvis"] = {"poly": [(254, 430), (446, 430), (460, 580), (240, 580)], "pivot": (350, 500), "mat": "mustard"}
    uaL = [(228, 255), (292, 255), (282, 345), (262, 418), (205, 418), (206, 345)]
    faL = [(190, 395), (264, 395), (262, 500), (246, 522), (246, 592), (190, 592)]
    P["upperArmL"] = {"poly": uaL, "pivot": (256, 280), "mat": "skin", "discs": [(256, 280, 40), (233, 404, 34)]}
    P["foreArmL"] = {"poly": faL, "pivot": (233, 404), "mat": "skin", "discs": [(233, 404, 34)]}
    P["upperArmR"] = {"poly": mirror(uaL, cx), "pivot": (2 * cx - 256, 280), "mat": "skin", "discs": [(444, 280, 40), (467, 404, 34)]}
    P["foreArmR"] = {"poly": mirror(faL, cx), "pivot": (2 * cx - 233, 404), "mat": "skin", "discs": [(467, 404, 34)]}
    thL = [(240, 548), (351, 548), (350, 714), (246, 714)]
    shL = [(212, 692), (351, 692), (351, 900), (212, 900)]
    P["thighL"] = {"poly": thL, "pivot": (305, 590), "mat": "legL", "discs": [(294, 702, 42)]}
    P["shinL"] = {"poly": shL, "pivot": (294, 702), "mat": "skin", "discs": [(294, 702, 42)]}
    P["thighR"] = {"poly": mirror(thL, cx), "pivot": (2 * cx - 305, 590), "mat": "legL", "discs": [(406, 702, 42)]}
    P["shinR"] = {"poly": mirror(shL, cx), "pivot": (2 * cx - 294, 702), "mat": "skin", "discs": [(406, 702, 42)]}
    return P


# ---------------- Gromila (front view, cx ~308) ----------------
def gromila_parts():
    cx = 308
    P = {}
    P["head"] = {"poly": [(246, 98), (372, 98), (382, 215), (352, 252), (264, 252), (234, 215)], "pivot": (308, 238), "mat": "skin"}
    P["torso"] = {"poly": [(222, 186), (394, 186), (452, 266), (448, 494), (170, 494), (166, 266)], "pivot": (308, 470), "mat": ("gray", "skin", 152)}
    P["pelvis"] = {"poly": [(176, 460), (440, 460), (488, 650), (128, 650)], "pivot": (308, 560), "mat": "blue"}
    uaL = [(92, 215), (222, 215), (206, 350), (176, 528), (52, 528), (66, 350)]
    faL = [(50, 482), (176, 482), (160, 626), (56, 626)]
    P["upperArmL"] = {"poly": uaL, "pivot": (152, 282), "mat": "skin", "discs": [(152, 282, 78), (118, 508, 58)]}
    P["foreArmL"] = {"poly": faL, "pivot": (118, 508), "mat": "skin", "discs": [(118, 508, 58)]}
    P["upperArmR"] = {"poly": mirror(uaL, cx), "pivot": (2 * cx - 152, 282), "mat": "skin", "discs": [(464, 282, 78), (498, 508, 58)]}
    P["foreArmR"] = {"poly": mirror(faL, cx), "pivot": (2 * cx - 118, 508), "mat": "skin", "discs": [(498, 508, 58)]}
    thL = [(122, 628), (309, 628), (309, 740), (112, 740)]
    shL = [(84, 716), (309, 716), (309, 915), (84, 915)]
    P["thighL"] = {"poly": thL, "pivot": (205, 575), "mat": "blue", "discs": [(192, 728, 66)]}
    P["shinL"] = {"poly": shL, "pivot": (192, 728), "mat": "legG", "discs": [(192, 728, 66)]}
    P["thighR"] = {"poly": mirror(thL, cx), "pivot": (2 * cx - 205, 575), "mat": "blue", "discs": [(424, 728, 66)]}
    P["shinR"] = {"poly": mirror(shL, cx), "pivot": (2 * cx - 192, 728), "mat": "legG", "discs": [(424, 728, 66)]}
    return P


def doc_mat(L, rgb, oy=0, ox=0):
    h, w = L.shape
    dark = ramp_apply(L, RAMPS["blue"])
    light = ramp_apply(L, RAMPS["cream"])
    col = np.where((L > 104)[..., None], light, dark)
    return np.where((L < 36)[..., None], hexc(INK), col)


def main():
    # legs: below the hem the pixels are skin / barefoot, above it clothes; one luminance split per hero is enough
    def below(y, cloth):  # clothes above absolute row y, bare skin below it
        def f(L, rgb, oy, ox):
            yy = (np.arange(L.shape[0]) + oy)[:, None] * np.ones((1, L.shape[1]))
            return np.where((yy > y)[..., None], ramp_apply(L, RAMPS["skin"]), ramp_apply(L, RAMPS[cloth]))
        return f
    t_leg, g_leg = below(642, "mustard"), below(852, "blue")
    tm = {"skin": "skin", "mustard": "mustard", "legL": t_leg}
    gm = {"skin": "skin", "gray": "gray", "blue": "blue", "legG": g_leg}
    tr = rig_hero("tetsu", "sheet.png", (170, 530), tm, tetsu_parts(), 100)
    gr = rig_hero("gromila", "sheet.png", (40, 580), gm, gromila_parts(), 200)
    # Doc: one flat cutout (no rig); head crop kept for a nod
    rgb = np.asarray(Image.open(os.path.join(SHEETS, "doc", "sheet.png")).convert("RGB"), dtype=np.float32)
    fig = figure_mask(rgb)
    fig[:, :150] = 0
    fig[:, 520:] = 0
    ys, xs = np.where(fig > 0.5)
    poly = [(150, 0), (520, 0), (520, 1023), (150, 1023)]
    rgba, (ox, oy) = build_part(rgb, fig, poly, doc_mat, 300)
    os.makedirs(os.path.join(OUT, "doc"), exist_ok=True)
    Image.fromarray(rgba, "RGBA").save(os.path.join(OUT, "doc", "whole.png"), optimize=True)
    json.dump({"cx": float((xs.min() + xs.max()) / 2), "top": int(ys.min()), "feet": int(ys.max()),
               "parts": {"whole": {"file": "assets/paper/doc/whole.png", "x": ox, "y": oy, "w": rgba.shape[1], "h": rgba.shape[0], "pivot": [335, 890]}}},
              open(os.path.join(OUT, "doc", "rig.json"), "w"), indent=1)
    print("tetsu", tr["cx"], tr["top"], tr["feet"], "| gromila", gr["cx"], gr["top"], gr["feet"])
    if len(sys.argv) > 1 and sys.argv[1] == "preview":
        preview()


def preview():
    """Contact sheet of every part on a mid-grey table (for eyeballing the cut)."""
    sheet = Image.new("RGB", (1800, 1000), (96, 112, 128))
    x = 10
    for hero in ("tetsu", "gromila"):
        rig = json.load(open(os.path.join(OUT, hero, "rig.json")))
        for pn in ("shinL", "shinR", "thighL", "thighR", "pelvis", "torso", "upperArmL", "upperArmR", "foreArmL", "foreArmR", "head"):
            p = rig["parts"][pn]
            im = Image.open(os.path.join(ROOT, p["file"]))
            sheet.paste(im, (p["x"] + (0 if hero == "tetsu" else 900) - 100, p["y"] + 10), im)
    sheet.save(os.path.join(ROOT, "out", "_parts_preview.png"))


if __name__ == "__main__":
    main()
