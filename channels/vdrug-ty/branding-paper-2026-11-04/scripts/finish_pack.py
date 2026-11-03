from pathlib import Path
import json
import zipfile
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
FONT = Path('C:/Windows/Fonts/ARIALNB.TTF')
BODY = Path('C:/Windows/Fonts/arial.ttf')
DARK, CREAM, ORANGE, GOLD = '#203F3D', '#F8DFB0', '#E8732C', '#F5B92E'
CAPTIONS = {
    'T1': ('ЭТО СНОВА', '2010?!', 'Я ПОМНЮ БУДУЩЕЕ'),
    'T2': ('ПУНКТ', '№1?', 'ПЛАН СЛОМАЛСЯ'),
    'T3': ('Я ЗНАЛ ПРО', 'БИТКОИН', ''),
    'T4': ('ДЕНЬГИ', 'БЕЗ ЛИМИТА', 'И ВСЁ РАВНО СКУЧНО'),
    'T5': ('ЖИТЬ', 'ВЕЧНО?', '1000 ЛЕТ СПУСТЯ'),
    'T6': ('ПУНКТ', '№1?', 'ПЛАН СЛОМАЛСЯ'),
}
NAMES = {'T1': 'Снова 2010', 'T2': 'Скрытый пункт плана', 'T3': 'Я знал про биткоин',
         'T4': 'Бесконечные деньги', 'T5': 'Бессмертие', 'T6': 'План без героя'}
records = []
text_boxes = []


def fit(text, maximum, width, height=None):
    for size in range(maximum, 5, -1):
        font = ImageFont.truetype(str(FONT), size)
        box = font.getbbox(text)
        if font.getlength(text) <= width and (height is None or box[3] - box[1] <= height):
            return font
    raise ValueError(text)


def put(image, xy, text, font, fill, role):
    draw = ImageDraw.Draw(image)
    box = draw.textbbox(xy, text, font=font, anchor='lt')
    assert 0 <= box[0] < box[2] <= image.width, (role, box)
    assert 0 <= box[1] < box[3] <= image.height, (role, box)
    draw.text(xy, text, font=font, fill=fill, anchor='lt')
    text_boxes.append({'role': role, 'text': text, 'bounds': list(box), 'font_size': font.size})
    return box


def save(image, relative):
    path = ROOT / relative
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.suffix.lower() == '.jpg':
        image.convert('RGB').save(path, quality=94, subsampling=0, optimize=True)
    else:
        image.save(path, optimize=True)
    with Image.open(path) as exported:
        exported.verify()
    records.append({'file': relative, 'size': list(image.size), 'bytes': path.stat().st_size})


def headline(image, key):
    a, b, sub = CAPTIONS[key]
    put(image, (54, 45), a, fit(a, 112, 565, 93), DARK, key + ' headline 1')
    font = fit(b, 140, 557, 108)
    width = round(font.getlength(b))
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((43, 142, 75 + width, 260), radius=7, fill=DARK)
    put(image, (56, 151), b, font, GOLD, key + ' headline 2')
    if sub:
        subfont = fit(sub, 26, 530, 24)
        draw.rounded_rectangle((47, 268, 69 + round(subfont.getlength(sub)), 302), radius=4, fill=DARK)
        put(image, (57, 273), sub, subfont, CREAM, key + ' qualifier')


def plan(image, key, x, y, width, spacing):
    put(image, (x, y), 'ПЛАН', fit('ПЛАН', 55, width, 52), DARK, key + ' page heading')
    draw = ImageDraw.Draw(image)
    start = y + 83
    for i in range(5):
        row_y = start + spacing * i
        put(image, (x, row_y), str(i + 1) + '.', fit(str(i + 1) + '.', 34, 40), DARK, key + ' page index')
        if i == 0:
            draw.rounded_rectangle((x + 48, row_y - 2, x + width, row_y + 27), radius=4, fill=ORANGE)
            draw.line((x + 51, row_y + 7, x + width - 5, row_y + 13), fill='#D96625', width=4)
        else:
            draw.line((x + 50, row_y + 13, x + width - 8 * (i % 2), row_y + 13), fill=DARK, width=4)


def bitcoin(image):
    # Draw a typographic Bitcoin emblem onto the blank generated paper coin.
    layer = Image.new('RGBA', (440, 440))
    draw = ImageDraw.Draw(layer)
    font = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 340)
    draw.text((220, 220), 'B', font=font, fill=DARK, anchor='mm')
    for x in (183, 232):
        draw.rectangle((x, 55, x + 15, 377), fill=DARK)
    layer = layer.rotate(-12, Image.Resampling.BICUBIC)
    layer = layer.resize((126, 126), Image.Resampling.LANCZOS)
    # Coin center measured on T3 raw: (453, 601) on 1672 x 941.
    image.paste(layer, (284, 397), layer)


def export_thumbnails():
    for key in CAPTIONS:
        image = Image.open(ROOT / 'raw' / (key + '.png')).convert('RGB').resize((1280, 720), Image.Resampling.LANCZOS)
        headline(image, key)
        if key == 'T1':
            put(image, (172, 463), '2010', fit('2010', 133, 260), DARK, 'T1 calendar year')
        if key == 'T2':
            plan(image, key, 155, 356, 390, 45)
        if key == 'T3':
            bitcoin(image)
        if key == 'T6':
            plan(image, key, 723, 154, 391, 69)
        save(image, 'thumbnails/' + key + '.png')
        save(image, 'thumbnails/' + key + '.jpg')
        save(image.resize((170, 96), Image.Resampling.LANCZOS), 'review/' + key + '-170px.png')


def export_avatars():
    for key in ('L1', 'L2', 'L3'):
        raw = Image.open(ROOT / 'raw' / (key + '.png')).convert('RGB')
        # Export with slight extra breathing room for the circular crop, without altering artwork.
        avatar = Image.new('RGB', (800, 800), raw.getpixel((8, 8)))
        avatar.paste(ImageOps.contain(raw, (736, 736), Image.Resampling.LANCZOS), (32, 32))
        save(avatar, 'avatars/' + key + '.png')
        circle = avatar.convert('RGBA')
        mask = Image.new('L', (800, 800))
        ImageDraw.Draw(mask).ellipse((0, 0, 799, 799), fill=255)
        circle.putalpha(mask)
        save(circle, 'review/' + key + '-circle.png')
        save(circle.resize((98, 98), Image.Resampling.LANCZOS), 'review/' + key + '-98px.png')


def export_banner():
    image = Image.open(ROOT / 'raw/B1-safe.png').convert('RGB').resize((2560, 1440), Image.Resampling.LANCZOS)
    put(image, (592, 617), 'ВДРУГ ТЫ', fit('ВДРУГ ТЫ', 168, 920, 145), DARK, 'Banner title')
    put(image, (599, 799), 'ОДНО «ЕСЛИ» МЕНЯЕТ ВСЁ', fit('ОДНО «ЕСЛИ» МЕНЯЕТ ВСЁ', 39, 910, 40), DARK, 'Banner tagline')
    save(image, 'banner/B1-2560x1440.png')
    save(image, 'banner/B1-2560x1440.jpg')
    # Central crop is an explicit design review, not a claim about live platform rendering.
    safe = (507, 509, 2053, 932)
    save(image.crop(safe), 'review/banner-center-1546x423.png')
    save(image.crop((0, 509, 2560, 932)), 'review/banner-wide-strip.png')
    marked = image.copy()
    ImageDraw.Draw(marked).rectangle(safe, outline=ORANGE, width=6)
    save(marked.resize((1280, 720), Image.Resampling.LANCZOS), 'review/banner-safe-area.png')
    for item in text_boxes:
        if item['role'].startswith('Banner'):
            x0, y0, x1, y1 = item['bounds']
            assert safe[0] <= x0 < x1 <= safe[2] and safe[1] <= y0 < y1 <= safe[3]


def export_contact_sheet():
    sheet = Image.new('RGB', (1440, 1410), '#F2E7D4')
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.truetype(str(BODY), 24)
    for i, key in enumerate(CAPTIONS):
        x, y = 40 + (i % 2) * 700, 38 + (i // 2) * 416
        im = Image.open(ROOT / ('thumbnails/' + key + '.png')).resize((660, 371), Image.Resampling.LANCZOS)
        sheet.paste(im, (x, y))
        draw.text((x, y + 379), key + ' · ' + NAMES[key], font=font, fill=DARK)
    for i, key in enumerate(('L1', 'L2', 'L3')):
        im = Image.open(ROOT / ('review/' + key + '-98px.png'))
        x = 390 + i * 260
        sheet.paste(im, (x, 1290), im)
        draw.text((x + 115, 1320), key, font=font, fill=DARK)
    save(sheet, 'review/contact-sheet.jpg')


def gallery():
    cards = ''.join(f'<article><h2>{k} · {NAMES[k]}</h2><a href="thumbnails/{k}.png"><img src="thumbnails/{k}.jpg" width="640" height="360"></a><p><a href="thumbnails/{k}.png">PNG</a> · <a href="thumbnails/{k}.jpg">JPG</a></p><img class="small" src="review/{k}-170px.png" width="170" height="96" alt="Проверка в размере 170 px"></article>' for k in CAPTIONS)
    avatars = ''.join(f'<article><h2>{k}</h2><a href="avatars/{k}.png"><img class="avatar" src="review/{k}-circle.png" width="280" height="280"></a><p><img src="review/{k}-98px.png" width="98" height="98" alt="{k} в размере 98 px"></p><a href="avatars/{k}.png">Скачать 800×800</a></article>' for k in ('L1', 'L2', 'L3'))
    html = '''<!doctype html><html lang="ru"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Вдруг ты · бумажный комплект</title><style>body{background:#f3e8d5;color:#203f3d;font:17px/1.5 system-ui;margin:0 auto;padding:32px;max-width:1440px}h1{font-size:clamp(30px,5vw,60px);margin-bottom:10px}h2{font-size:21px}a{color:#865014}img{max-width:100%;height:auto;border-radius:5px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,480px),1fr));gap:26px}article{padding:18px;background:#fff6e5;border-radius:12px}.avatars{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:24px}.avatar{width:280px}.small{width:170px;border-radius:0}.banner{margin-top:32px}</style><h1>ВДРУГ ТЫ</h1><p>6 превью · 3 аватара · баннер. Бумажный коллаж по вашему эталону. 04.11.2026.</p><p><a href="delivery.zip">Скачать комплект ZIP</a> · <a href="prompts.md">Все промпты</a> · <a href="generation-log.json">Журнал генерации</a></p><p>T1–T3 и T6 относятся к ролику про 2010 год. T4–T5 — концепты для других роликов; «1000 лет спустя» — условная ситуация. Победитель теста неизвестен.</p><div class="grid">''' + cards + '</div><h2>Аватары</h2><div class="avatars">' + avatars + '''</div><section class="banner"><h2>Баннер</h2><a href="banner/B1-2560x1440.png"><img src="banner/B1-2560x1440.jpg" width="1280" height="720"></a><p><a href="banner/B1-2560x1440.png">PNG 2560×1440</a> · <a href="banner/B1-2560x1440.jpg">JPG</a></p><h2>Проверка центральной обрезки</h2><img src="review/banner-center-1546x423.png" width="1237" height="338"><p>Заголовок, подпись и герой помещены в центральную область. Внешние предметы декоративные.</p></section></html>'''
    (ROOT / 'index.html').write_text(html, encoding='utf-8')


def main():
    export_thumbnails()
    export_avatars()
    export_banner()
    export_contact_sheet()
    for record in records:
        if record['file'].startswith('thumbnails/'):
            assert record['size'] == [1280, 720]
            assert record['bytes'] < 2_000_000
    (ROOT / 'export-review.json').write_text(json.dumps({
        'date': '2026-11-04', 'exports': records, 'text_boxes': text_boxes,
        'captions': CAPTIONS, 'font': str(FONT),
        'checks': ['All exported images decode', '6 thumbnails at 1280x720; PNG and JPG under 2 MB',
                   '3 avatars at 800x800 plus circular 98px previews', 'Banner at 2560x1440; title/tagline fit central crop',
                   'No unverified Bitcoin prices or returns included'],
        'measurement': 'No CTR measurements or Test & Compare run.'
    }, ensure_ascii=False, indent=2), encoding='utf-8')
    gallery()
    with zipfile.ZipFile(ROOT / 'delivery.zip', 'w', zipfile.ZIP_DEFLATED) as bundle:
        for sub in ('thumbnails', 'avatars', 'banner', 'review', 'scripts', 'raw', 'references'):
            for path in sorted((ROOT / sub).glob('*')):
                if path.is_file() and 'rejected' not in path.name:
                    bundle.write(path, path.relative_to(ROOT))
        for name in ('index.html', 'README.md', 'prompts.md', 'prompts.json', 'generation-log.json', 'export-review.json', 'T6-correction.txt', 'T6-rejected-prompt.txt', 'B1-correction.txt'):
            path = ROOT / name
            if path.exists():
                bundle.write(path, name)
    print(json.dumps({'exports': len(records), 'archive_bytes': (ROOT / 'delivery.zip').stat().st_size,
                      'gallery': str(ROOT / 'index.html')}, ensure_ascii=False))


if __name__ == '__main__':
    main()
