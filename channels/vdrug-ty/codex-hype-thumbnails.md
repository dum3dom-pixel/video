# ТЗ для Codex: три хайповых превью для ролика «Что, если ты вернулся в детство со всеми воспоминаниями?»

Цель: поднять CTR (сейчас 2,4% на 2K показов) и запустить три варианта в Test & Compare. Текущая обложка перегружена деталями и мелкими подписями, биткоин на ней не про сюжет. Новые обложки: один герой, одна сильная эмоция, одна сцена из ролика, текст до трёх слов, высокий контраст. Без биткоина, кассет, календарей и годов.

Текст, плашки, красный акцент и значки кладёт код (Pillow, Arial Narrow Bold, как в `branding-paper-2026-11-04/scripts/finish_pack.py`). В картинки ничего из этого не рисуется. Финал 1280×720, каждый файл меньше 2 МБ, проверка на 170×95 px (лента на телефоне).

Пути вложений: `[ВДРУГ]` = `channels/vdrug-ty/branding-paper-2026-11-04/`, `[АССЕТЫ]` = `channels/chto-esli/video-01/assets/`.

## Что накладывает код

| Превью | Надпись | Красный акцент |
|---|---|---|
| H1 | `БАНК` золотом, под ней `ЗАВТРА` на красной плашке | Плашка `ЗАВТРА` |
| H2 | `3/5 + 2/7 = ?` крупно золотом | Знак `?` |
| H3 | `УБЕРИ ВЕЛИК!` золотом | Красный бейдж `ЧЕРЕЗ 3 ДНЯ` в углу |

Золото и тёмная обводка как в комплекте «Вдруг ты». Высота букв около четверти высоты кадра. Правый нижний угол свободен (там значок длительности YouTube).

## Герой

Для всех трёх: герой из комплекта «Вдруг ты», как на живой обложке и аватаре. Каштановые взъерошенные волосы с высоким вихром, большие серьёзные серо-голубые глаза с лёгкими тенями, оливковая футболка с нагрудным карманом, оранжевые наушники на шее. Это не серебристый Саша из кадров ролика: обложка должна совпадать с каналом.

## Общий блок стиля (вставить в каждый запрос)

```text
Style/material: handmade multilayer paper-collage illustration. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic, manga, anime shading or 3D rendering. Do not bake in film grain, noise overlays, vignette, blur or lens effects.

Thumbnail punch: more saturated and higher contrast than the calm film frames, so it stands out in a small feed. Vivid faded-teal and warm sky/background tones, golden mustard, deep brick, warm cream highlights, strong light-dark separation between the hero and the background. Still matte paper, still one coherent palette.

Base palette: faded teal #5E8C8A (may be pushed brighter), mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, warm gray #A59B8C. The only orange is the hero's headphones. No additional pure white or black flat colors. No red anywhere: the red accent is added by code.

Hero face rule: the hero's face is large, about 35-45% of the frame height, with ONE clear readable emotion, big wide-open serious eyes, eyebrows lifted at the inner ends. The face must read at 170x95 px.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges. Largest 16:9 size the tool allows (target 2560x1440, never below 1536x864), report the real size. Hair and hands stay fully inside the frame. Bottom-right corner stays quiet. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, question marks, pseudo-writing, logos, watermarks, captions, speech bubbles, arrows, coins or currency symbols, cassettes, calendars, drawn effects. Clock faces have plain tick marks and no numerals. Blackboards and paper sheets are completely blank. No blood, wounds or weapons. Original fictional characters only.
```

## H1 · «БАНК ЗАВТРА»

Сохранить как `channels/vdrug-ty/hype-thumbs-2026-11-05/H1_bank_source.png`.

Вложения:
- Input image 1: `[ВДРУГ]references/original-approved.png` (герой).
- Input image 2: `[АССЕТЫ]sheets/papa_sheet.png` (папа).
- Input image 3: `[АССЕТЫ]shots/e4_briefcase-paper-v1.png` (кухня и портфель, композицию не копировать, она новая).
- Input image 4: `[ВДРУГ]raw/T3.png` (палитра и материал; монитор и монету не копировать).

```text
Asset: hype-thumbs-2026-11-05/H1_bank_source.png, a finished full scene, YouTube thumbnail hero image. Composition is new: do not copy input image 3, use it only for the kitchen and briefcase look.

Scene: a late-evening kitchen, warm lamp light on a cream wall. Right half: Sasha's dad from input image 2 (stocky, horseshoe moustache, balding, olive-mustard checked shirt), seen from the side, calmly putting papers into a brown briefcase on the table, not looking at the boy. Above the dad on the wall a big round wall clock with plain tick marks and two hands, no numerals. Left half and foreground: the hero from input image 1, age 12, in the doorway, large in the frame, one arm stretched out toward the dad with an open palm, mouth open in a desperate silent "wait", eyes wide, eyebrows lifted at the inner ends. The hero's face is the clearest, brightest, largest element. Upper left and a strip across the lower middle stay as calm empty paper areas reserved for code text.

[PASTE THE COMMON STYLE BLOCK HERE]
```

## H2 · «3/5 + 2/7 = ?»

Сохранить как `channels/vdrug-ty/hype-thumbs-2026-11-05/H2_fractions_source.png`.

Вложения:
- Input image 1: `[ВДРУГ]references/original-approved.png` (герой).
- Input image 2: `[АССЕТЫ]shots/e1_school_board-paper-v1.png` (класс и доска, композицию не копировать).
- Input image 3: `[ВДРУГ]raw/T3.png` (палитра и материал).

```text
Asset: hype-thumbs-2026-11-05/H2_fractions_source.png, a finished full scene, YouTube thumbnail hero image. Composition is new: use input image 2 only for the classroom look.

Scene: a classroom blackboard fills the right two thirds of the frame, a deep green-teal slate, completely blank and empty, with a chalk tray along the bottom holding one piece of chalk. In front of it, left of centre, large in the frame, the hero from input image 1, age 12, with a tense adult face: big round eyes staring at the board, mouth slightly open, a cut-paper sweat drop on the temple, one hand holding a piece of chalk frozen in the air next to the board. The look says "I know the future, but I do not know this". The left edge of the frame is a plain wall with a hint of a window. The board area is calm and empty on purpose: code puts the fraction there.

[PASTE THE COMMON STYLE BLOCK HERE]
```

## H3 · «УБЕРИ ВЕЛИК!»

Сохранить как `channels/vdrug-ty/hype-thumbs-2026-11-05/H3_poplar_source.png`.

Вложения:
- Input image 1: `[ВДРУГ]references/original-approved.png` (герой).
- Input image 2: `[АССЕТЫ]shots/e3_fallen-distinct-v3.png` (двор, гаражи, тополь; здесь тополь лежит, а нам нужен стоящий и нависающий).
- Input image 3: `[ВДРУГ]raw/T3.png` (палитра и материал).

```text
Asset: hype-thumbs-2026-11-05/H3_poplar_source.png, a finished full scene, YouTube thumbnail hero image. Composition is new: use input image 2 only for the yard and garages look. In this picture the poplar is still standing.

Scene: a dramatic low camera angle in a courtyard. A row of old metal-roofed garages across the middle. A huge old poplar towers over them from the right, leaning visibly and heavily over the garage roofs, its dark crown filling the top of the frame against a bright sky. Under the leaning tree, in front of a garage, a teenager's bicycle stands in plain sight. On the left, large in the frame, the hero from input image 1, age 12, pointing straight up at the tree with one arm, face turned to the camera with wide alarmed eyes, mouth open in a silent warning, eyebrows lifted at the inner ends. The hero's face is the clearest, brightest, largest element. The upper left corner and the sky strip across the top stay calm and empty for code text. A small calm empty paper area stays in the upper right for a code badge.

[PASTE THE COMMON STYLE BLOCK HERE]
```

## Приёмка (для всех трёх)

- Герой узнаётся по `original-approved.png` (каштановый вихор, серьёзные глаза, оливковая футболка, оранжевые наушники), эмоция читается без текста.
- Одна сцена, один главный объект, минимум мелких деталей; сцена соответствует тому, что есть в ролике.
- Нет текста, цифр, знаков вопроса, красного, монет, кассет, календарей, часов с цифрами.
- Читается при размере 170×95 px: лицо, главный объект и пустые зоны под текст на своих местах.
- Размер файлов сообщить в ответе.
- После генерации код накладывает текст по таблице; проверить, что надпись не выходит за поля и не налезает на значок длительности.

## Запуск в Test & Compare

Studio → ролик → Details → обложка → Test & Compare, загрузить H1, H2, H3. Название и описание не менять на время теста. Результаты смотреть через 3–5 дней: тест выбирает по доле времени просмотра, и при малом числе показов победителя может не быть, тогда сравнить CTR в Analytics.
