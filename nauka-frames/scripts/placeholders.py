"""Temporary stand-ins for the nine Codex shots (assets/shots/*.png, 1536x1024), built from the old gray sheets and background plates.
Only the file names matter to the engine: when Codex shots with the same names are dropped into assets/shots/, they replace these.
Run: python -I scripts/placeholders.py   (reads ../nauka-toon/assets/img, writes assets/shots/)"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT.parent / "nauka-toon" / "assets" / "img"
OUT = ROOT / "assets" / "shots"
OUT.mkdir(parents=True, exist_ok=True)
FONT = str(ROOT / "assets" / "fonts" / "impact.ttf")
W, H = 1536, 1024

def front_view(hero):
    """the first of the three views on the sheet, cut out by threshold + hole fill, as RGBA"""
    im = Image.open(SRC / hero / "sheet.png").convert("RGB")
    a = np.array(im.convert("L"))
    on = (a > 14).sum(0) > 3
    s = e = None
    for x, v in enumerate(on):
        if v and s is None: s = x
        if not v and s is not None and x - s > 40: e = x; break
    box = (max(0, s - 6), 0, min(im.width, e + 6), im.height)
    crop = im.crop(box)
    m = (np.array(crop.convert("L")) > 11).astype(np.uint8) * 255
    mk = Image.fromarray(m).filter(ImageFilter.MaxFilter(7))
    ff = mk.copy(); ImageDraw.floodfill(ff, (0, 0), 128)
    filled = np.array(ff); filled = np.where(filled == 128, 0, 255).astype(np.uint8)
    mk = Image.fromarray(filled).filter(ImageFilter.MinFilter(5)).filter(ImageFilter.GaussianBlur(1))
    rgba = crop.convert("RGBA"); rgba.putalpha(mk)
    return rgba.crop(rgba.getbbox())

def bg(n):
    return Image.open(SRC / "backgrounds" / n).convert("RGB").resize((W, H))

def put(base, fig, cx, feet, h, flip=False, squash=1.0):
    f = fig.resize((int(fig.width * h / fig.height), int(h * squash)), Image.LANCZOS)
    if flip: f = ImageOps.mirror(f)
    sh = Image.new("RGBA", f.size, (0, 0, 0, 0)); sh.putalpha(f.getchannel("A").point(lambda v: v * 0.5))
    base.paste(Image.new("RGB", f.size, (0, 0, 0)), (int(cx - f.width / 2) + 8, int(feet - f.height) + 10), sh.getchannel("A").filter(ImageFilter.GaussianBlur(8)))
    base.paste(f.convert("RGB"), (int(cx - f.width / 2), int(feet - f.height)), f.getchannel("A"))

def tag(im, label):
    d = ImageDraw.Draw(im); f = ImageFont.truetype(FONT, 34)
    d.rectangle([0, H - 54, 560, H], fill=(20, 20, 20)); d.text((14, H - 48), "ЗАГЛУШКА · " + label, font=f, fill=(255, 210, 60))
    return im

T, G, D = front_view("tetsu"), front_view("gromila"), front_view("doc")
GH, TH, DH = 760, 560, 600

def shot(name, base, label):
    tag(base, label).save(OUT / name); print(name)

b = bg("bg1_hook.png"); put(b, G, 1080, 960, GH, flip=True); put(b, T, 620, 960, TH); shot("s1a_hook_wide.png", b, "s1a")
c = b.crop((430, 140, 1330, 705)).resize((W, H), Image.LANCZOS); shot("s1b_hook_hit.png", c, "s1b")
b = bg("bg2_size.png"); put(b, G, 1060, 960, GH); put(b, T, 520, 960, TH); shot("s2_size.png", b, "s2")
b = bg("bg3_punch.png"); put(b, G, 1000, 970, GH + 40, flip=True); put(b, T, 540, 970, TH + 40); shot("s3a_punch.png", b, "s3a")
b = bg("bg3_punch.png"); put(b, G, 880, 980, GH, squash=0.62); shot("s3b_sag.png", b, "s3b")
b = bg("bg4_myth.png"); put(b, G, 1000, 970, GH + 40); put(b, T, 420, 970, TH - 40); shot("s4_myth.png", b, "s4")
b = bg("bg5_doc.png"); put(b, D, 560, 970, DH + 80); shot("s5_doc.png", b, "s5")
b = bg("bg6_three.png"); put(b, T, 520, 940, TH - 60); put(b, G, 930, 980, GH, squash=0.66); shot("s6a_three.png", b, "s6a")
b = Image.new("RGB", (W, H), (231, 214, 178)); d = ImageDraw.Draw(b)
d.ellipse([430, 200, 1100, 760], fill=(236, 150, 160), outline=(30, 20, 20), width=14)
for k in range(6): d.arc([500 + k * 18, 260 + k * 20, 1040 - k * 18, 700 - k * 20], 200, 340, fill=(160, 70, 90), width=10)
shot("s6b_brain.png", b, "s6b мозг")
