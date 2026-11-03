"""Export generated paper-collage thumbnails and add exact Russian typography."""
from pathlib import Path
import json
import shutil

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
GENERATED = Path('C:/Users/DPiunov/.codex/generated_images/01a19e53-fab2-73c2-a0c7-ea90d208128f')
OUT = ROOT / 'assets' / 'thumbnails' / '2026-11-03'
OUT.mkdir(parents=True, exist_ok=True)
FONT = Path('C:/Windows/Fonts/ARIALNB.TTF')
CREAM = '#F1E6CF'
DARK = '#203F3D'
GOLD = '#F5B92E'
SOURCES = {
    'A': 'exec-3acaf987-eb2a-4d4a-8e7d-260b1775b66c.png',
    'B': 'exec-282f49f2-516e-4c62-8b38-831a150320d6.png',
    'C': 'exec-58cea2f2-dfef-4ff3-9a54-553f290f2841.png',
}
HEADLINES = {
    'A': ['Я ЗНАЛ ПРО', 'БИТКОИН'],
    'B': ['ВЧЕРА 33  СЕГОДНЯ 12'],
    'C': ['БУДУЩЕЕ НА', 'КАССЕТЕ?'],
}


def font(size):
    return ImageFont.truetype(str(FONT), size)


def fit(text, max_width, max_size):
    size = max_size
    while font(size).getlength(text) > max_width:
        size -= 1
    return font(size)


def text_top(draw, position, text, face, fill):
    # 'lt' places the actual ink top at y, regardless of ascender metrics.
    draw.text(position, text, font=face, fill=fill, anchor='lt', stroke_width=0)
    x, y = position
    b = draw.textbbox(position, text, font=face, anchor='lt')
    return list(b)


def bitcoin_symbol(image, center=(338, 468), diameter=130):
    # Exact emblem as a typographic overlay; generated circle itself is blank.
    scale = 4
    layer = Image.new('RGBA', (diameter * scale, diameter * scale), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    f = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', int(diameter * 0.83 * scale))
    d.text((diameter * scale / 2, diameter * scale / 2), 'B', font=f,
           anchor='mm', fill=DARK)
    # The two parallel strokes distinguish Bitcoin from a plain letter B.
    for cx in (diameter * 0.43, diameter * 0.55):
        d.rectangle((int(cx * scale), int(diameter * 0.11 * scale),
                     int((cx + diameter * 0.044) * scale), int(diameter * 0.9 * scale)), fill=DARK)
    layer = layer.rotate(-12, Image.Resampling.BICUBIC, expand=False)
    layer = layer.resize((diameter, diameter), Image.Resampling.LANCZOS)
    image.paste(layer, (round(center[0] - diameter / 2), round(center[1] - diameter / 2)), layer)


reviews = []
for variant, filename in SOURCES.items():
    source = GENERATED / filename
    raw = Image.open(source).convert('RGB')
    shutil.copy2(source, OUT / f'thumbnail_{variant}_source.png')
    image = raw.resize((1280, 720), Image.Resampling.LANCZOS)
    draw = ImageDraw.Draw(image)
    boxes = []
    if variant == 'A':
        bitcoin_symbol(image)
        draw = ImageDraw.Draw(image)
        first, second = HEADLINES[variant]
        f1, f2 = fit(first, 590, 116), fit(second, 590, 148)
        boxes.append(text_top(draw, (72, 66), first, f1, DARK))
        box_width = round(f2.getlength(second)) + 30
        draw.rounded_rectangle((58, 162, 58 + box_width, 292), radius=9, fill=DARK)
        boxes.append(text_top(draw, (72, 177), second, f2, GOLD))
    elif variant == 'B':
        heading = HEADLINES[variant][0]
        f = fit(heading, 1120, 116)
        x = round((1280 - f.getlength(heading)) / 2)
        boxes.append(text_top(draw, (x, 83), heading, f, DARK))
    else:
        first, second = HEADLINES[variant]
        f1, f2 = fit(first, 470, 92), fit(second, 470, 112)
        boxes.append(text_top(draw, (68, 176), first, f1, DARK))
        box_width = round(f2.getlength(second)) + 28
        draw.rounded_rectangle((56, 257, 56 + box_width, 373), radius=8, fill=DARK)
        boxes.append(text_top(draw, (68, 271), second, f2, CREAM))

    destination = OUT / f'thumbnail_{variant}.png'
    image.save(destination, optimize=True)
    preview = image.resize((150, 84), Image.Resampling.LANCZOS)
    preview.save(OUT / f'thumbnail_{variant}_150px.png', optimize=True)
    assert Image.open(destination).size == (1280, 720)
    assert destination.stat().st_size < 2_000_000, 'PNG exceeds 2 MB'
    assert all(b[0] >= 64 and b[1] >= 36 and b[2] <= 1216 and b[3] <= 684 for b in boxes)
    reviews.append({
        'variant': variant, 'source': str(source), 'native_size': list(raw.size),
        'file': str(destination.relative_to(ROOT)), 'size': [1280, 720],
        'bytes': destination.stat().st_size, 'headline': HEADLINES[variant],
        'font': str(FONT), 'text_bounds': boxes,
        'small_review': str((OUT / f'thumbnail_{variant}_150px.png').relative_to(ROOT)),
        'export': 'Lanczos downsample only; headline and emblem overlaid in code.',
    })

review_path = ROOT / 'spec' / 'thumbnail-export-review-2026-11-03.json'
review_path.write_text(json.dumps(reviews, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(reviews, ensure_ascii=False, indent=2))
