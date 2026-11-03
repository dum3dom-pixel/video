from pathlib import Path
import json
import shutil
from PIL import Image, ImageDraw, ImageFont

root = Path(__file__).resolve().parents[1]
out = root / 'assets/thumbnails/2026-11-03'
source = Path('C:/Users/DPiunov/.codex/generated_images/01a19e53-fab2-73c2-a0c7-ea90d208128f/exec-a45b37ad-8e72-4c69-81d6-53dfbc1ff060.png')
shutil.copy2(source, out / 'thumbnail_A_v2_source.png')
raw = Image.open(source).convert('RGB')
image = raw.resize((1280, 720), Image.Resampling.LANCZOS)
dark, gold = '#203F3D', '#F5B92E'
layer = Image.new('RGBA', (520, 520))
draw = ImageDraw.Draw(layer)
face = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 431)
draw.text((260, 260), 'B', font=face, anchor='mm', fill=dark)
for cx in (0.43, 0.55):
    draw.rectangle((int(cx * 520), 57, int((cx + 0.044) * 520), 468), fill=dark)
layer = layer.rotate(-12, Image.Resampling.BICUBIC).resize((130, 130), Image.Resampling.LANCZOS)
image.paste(layer, (273, 403), layer)
draw = ImageDraw.Draw(image)

def fit(text, max_size):
    for size in range(max_size, 1, -1):
        f = ImageFont.truetype('C:/Windows/Fonts/ARIALNB.TTF', size)
        if f.getlength(text) <= 590:
            return f

first, second = 'В 12 ЗНАЛ', 'БУДУЩЕЕ'
f1, f2 = fit(first, 127), fit(second, 138)
draw.text((72, 66), first, font=f1, fill=dark, anchor='lt')
draw.rounded_rectangle((58, 172, 88 + round(f2.getlength(second)), 316), radius=9, fill=dark)
draw.text((72, 181), second, font=f2, fill=gold, anchor='lt')
dest = out / 'thumbnail_A_v2.png'
image.save(dest, optimize=True)
image.resize((150, 84), Image.Resampling.LANCZOS).save(out / 'thumbnail_A_v2_150px.png')
assert Image.open(dest).size == (1280, 720)
assert dest.stat().st_size < 2_000_000
review = {
    'source': str(source), 'native_size': list(raw.size),
    'file': str(dest.relative_to(root)), 'size': [1280, 720],
    'bytes': dest.stat().st_size, 'headline': [first, second],
    'font': 'Arial Narrow Bold', 'font_sizes': [f1.size, f2.size],
    'change': 'Removed adult portrait with built-in image_gen; new headline and Bitcoin emblem added in code.',
    'story_support': 'Script v5: Sasha wakes age 12 remembering the following 21 years.',
}
(root / 'spec/thumbnail-bitcoin-v2-export-2026-11-03.json').write_text(json.dumps(review, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(review, ensure_ascii=False, indent=2))
