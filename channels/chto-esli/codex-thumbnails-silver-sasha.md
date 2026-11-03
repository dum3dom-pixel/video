# ТЗ для Codex: превью A/B/C с серебряным Сашей

Утверждённый Саша теперь серебристо-пепельный взъерошенный ёжик в бумажном коллаже (`sheets/sasha_sheet-paper-v1.png`), все 71 кадр ролика уже перерисованы под него (коммит `d886af4`). Превью A/B/C остались со старым русым Сашей (листья-пряди каштанового цвета), поэтому выбиваются из ролика. Нужно перегенерировать только картинки-основы; текст, плашки и красный на превью кладёт код после (`scripts/finish_thumbnail_bitcoin_v3.py` и соседние), в картинку ничего не рисуется. Пути вложений относительно `video-01/assets/`.

## Что сделать

Три файла, композиция и кадрирование те же, что в текущих основах, меняется только Саша:

| Превью | Текущая основа (композиция-референс) | Сохранить как |
|---|---|---|
| A «Я знал про биткоин» | `thumbnails/2026-11-03/thumbnail_A_v3_source.png` | `thumbnails/2026-11-03/thumbnail_A_v4_source.png` |
| B «Вчера 33 / Сегодня 12» | `thumbnails/2026-11-03/thumbnail_B_source.png` | `thumbnails/2026-11-03/thumbnail_B_v2_source.png` |
| C «Будущее на кассете?» | `thumbnails/2026-11-03/thumbnail_C_source.png` | `thumbnails/2026-11-03/thumbnail_C_v2_source.png` |

Старые файлы не перезаписывать, оставить как есть для сравнения.

## Саша (должен совпасть с листом, а не с текущей основой)

- Волосы серебристо-пепельные (бледный лавандово-серый), взъерошенный ёжик из острых вырезанных бумажных прядей, как на `sheets/sasha_sheet-paper-v1.png`. Не каштановые, не лиственные пряди.
- Глаза серо-голубые, серьёзные, с лёгкими тенями; брови чуть сведены.
- Возраст 12 лет (на B ещё и 33, взрослый тем же лицом и теми же волосами, как на `shots/t_realize_cu.png`).
- Одежда по умолчанию: оливковая футболка с одним нагрудным карманом; на 33 годах серая толстовка-худи или синий джемпер, как в `shots/f_player.png`.
- Мимика и поза остаются из текущих превью: A удивление с поднятой ладонью, B и C как в текущих основах.

## Вложения

- Input image 1: `sheets/sasha_sheet-paper-v1.png` (identity, костюм, пропорции).
- Input image 2: `sheets/sasha_ages_sheet-paper-v1.png` (возраста 12 и 33).
- Input image 3: основа из таблицы выше для соответствующего превью (композиция, цвет фона, место под текст).

## Промт (подставить в каждый из трёх запросов, описание сцены взять из текущей основы)

```text
Asset: thumbnails/2026-11-03/<имя из таблицы>, a finished full scene, YouTube thumbnail hero image. Keep the composition of input image 3 exactly (framing, background paper shapes, props, empty areas reserved for code text), and replace only the boy.

The boy is Sasha as on input images 1 and 2: pale silver-ash spiky tousled hair made of sharp cut-paper strands, grey-blue serious eyes with faint shadows, eyebrows slightly drawn together, small straight nose, a mouth that rarely smiles. Olive T-shirt with one chest pocket at age 12. His hair is silver-ash, never brown and never leaf-textured.

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Do not bake in film grain, noise overlays, vignette, blur or lens effects.

Base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Silver-ash hair uses a lightened warm gray with a faint lavender tint. No additional pure white or black flat colors. No red anywhere: any red accent is added by code.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges. Largest 16:9 size the tool allows (target 2560x1440, never below 1536x864), report the real size. Hair and hands stay fully inside the frame. Bottom-right corner stays quiet. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, captions, speech bubbles, arrows or drawn effects. Monitor screens, cassette labels and paper sheets are completely blank; the yellow disc on the monitor in A is a plain flat disc without any symbol (code puts the symbol on). No blood, wounds or weapons. Original fictional characters only.
```

## Приёмка

- Волосы серебристо-пепельные на всех трёх, без русого и без листовой фактуры.
- Лицо узнаётся по листу (серьёзный взгляд, сведённые брови); на B Саша 12 и 33 читаются как один человек.
- Композиция и места под текст совпадают с текущими основами.
- Читается при размере 320×180 (контур головы и ладони/кассеты не сливаются с фоном).
- Нет текста, символов, красного, ран. Размер файла сообщить в ответе.
