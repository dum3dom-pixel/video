# ТЗ для Codex: пилот 15 секунд, ролик 01 «Помнишь, как будет»

Хук сценария [video-01-script.md](video-01-script.md), сжатый до ~15 секунд. Паспорт и решения: [channel.md](channel.md). Каждый промт ниже **полностью самодостаточный**: копируешь блок целиком в Codex, прикладываешь указанные файлы, жмёшь генерацию. Ничего склеивать не нужно.

## Текст пилота (озвучка ~15–16 с)
> Тебя будит носок. Он прилетает прямо в лицо, а следом голос: «Мелкий, вставай». Голос твоего брата. Только ему здесь семнадцать, и у него ещё есть волосы. На календаре двенадцатое сентября две тысячи пятого. Вчера тебе было тридцать три.

## Что нужно сгенерировать (8 картинок)

| № | Файл | Что это | Прикладывать |
|---|---|---|---|
| 1 | `sheets/sasha_sheet.png` | лист героя Саша | ничего |
| 2 | `sheets/kostya_sheet.png` | лист героя Костя | лист Саши (для родства лиц) |
| 3 | `bg/bg_door_wall.png` | задник 1: комната из кровати, стена с дверью. **Он же кадр p1** | ничего |
| 4 | `bg/bg_carpet_wall.png` | задник 2: кровать под ковром | задник 1 (та же комната) |
| 5 | `shots/p0_sock.png` | вырезка носка (летит кодом) | ничего |
| 6 | `shots/p2_kostya.png` | Костя в дверях | лист Кости + задник 1 |
| 7 | `shots/p3_calendar.png` | отрывной календарь крупно | задник 1 |
| 8 | `shots/p4_sasha.png` | Саша садится в кровати | лист Саши + задник 2 |

Порядок строгий: сначала листы (**покажи мне и жди «ок»**), потом задники, потом остальное. Папка: `channels/chto-esli/video-01/assets/`.

## Какой кадр какой фразе соответствует

| Время | Озвучка | Картинка |
|---|---|---|
| 0–3,5 с | «Тебя будит носок. Он прилетает прямо в лицо» | `bg_door_wall.png` + летящий `p0_sock.png` |
| 3,5–6 с | «а следом голос: Мелкий, вставай» | `p2_kostya.png` |
| 6–11 с | «Голос твоего брата. Только ему здесь семнадцать, и у него ещё есть волосы» | `p2_kostya.png`, медленный наезд в волосы |
| 11–13 с | «На календаре двенадцатое сентября две тысячи пятого» | `p3_calendar.png` + дата кодом |
| 13–16 с | «Вчера тебе было тридцать три» | `p4_sasha.png` |

## Карта комнаты (чтобы кадры сходились)

Одна детская комната, 2005 год, утро. Расположение не менять между кадрами:

- **Стена с дверью** (напротив кровати): справа от центра деревянная дверь, приоткрыта, из коридора тёплый жёлтый свет. **Слева от дверной коробки** на уровне головы на гвозде висит отрывной календарь (пустая страница, красная шапка).
- **Стена с окном** (справа от кровати): окно с выцветше-бирюзовой занавеской, под ним письменный стол с лампой, стопкой тетрадей и стаканом с карандашами.
- **Стена с ковром** (за изголовьем): над кроватью висит большой ковёр с геометрическим орнаментом, кирпичный, оливковый, горчичный, с бахромой.
- Пол: паркет из полосок коричневой бумаги, небольшой круглый оливковый коврик.
- Кровать: клетчатое горчично-кремовое одеяло, плоская подушка.

Красный акцент в пилоте только в двух местах: полоска-шапка календаря и полоска на носке. Больше нигде.

Субтитры код ставит внизу, поэтому нижняя пятая часть каждой картинки без важных деталей (пол, одеяло).

## Общие блоки (уже вставлены в промты ниже, здесь для справки)

- **STYLE** — бумажный коллаж + плёнка, палитра из 6 цветов + один красный, запрет на любой текст и цифры.
- **REF** — «строго держи героев и комнату как на приложенных картинках».
- Промты на английском, потому что генератор картинок лучше понимает английский. Пояснения для тебя на русском.


## Шаг 1. Листы героев (показать мне, ждать «ок»)

### 1. Саша → `sasha_sheet.png`
Прикладывать: ничего.

```
Character design sheet: the same character shown three times side by side, equal size and evenly spaced: front view, side view facing left, back view; standing relaxed, full body with feet visible. Add one smaller head-and-shoulders front portrait at the right edge, big enough to show all face details. Plain cream (#F1E6CF) background, no props, only a soft paper shadow under the feet.
Sasha: an original boy, 12 years old, slim and a little small for his age. Messy dark-brown hair with one stubborn cowlick at the front right. Big serious thoughtful dark eyes with faint grey-brown circles under them, eyebrows slightly drawn together, so the face looks like a tired adult's face on a child's body. Small ears, small straight nose, calm closed mouth. Clothes: a faded olive-green (#7A7F3F) cotton T-shirt with one plain chest pocket, light warm-gray pajama pants, bare feet.
Handmade paper-collage illustration with a warm family-photo-album feel. Every shape is cut from coloured paper with slightly uneven, hand-torn edges and a thin white torn-paper fibre rim. Visible paper fibre texture and soft film grain. Flat paper colours with only slight tonal variation. The scene is built from stacked paper layers (far wall, then furniture and props, then floor, then characters in front); each layer casts a soft drop shadow on the layer below. Subtle warm vignette in the corners.
Palette (use only these): mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C, no red in this picture.
No black outlines: shapes are separated by paper edges and shadows. Faces are simple cut-paper shapes with a few small ink details (eyes, brows, mouth).
Landscape 3:2, 1536x1024 px, a complete finished picture with its own background. Keep everything important inside the central 16:9 band (about 8% safe margin at top and bottom) and keep the lower fifth of the picture free of important details.
STRICTLY NO text, letters, numbers, digits, logos, watermark, speech bubbles, arrows, circles, motion lines, sparkles or any added effects. No blood, wounds or weapons. All characters are original and do not resemble any real person or any existing cartoon.
```

### 2. Костя → `kostya_sheet.png`
Прикладывать: `sasha_sheet.png` (чтобы у братьев были похожие нос и брови).

```
Character design sheet: the same character shown three times side by side, equal size and evenly spaced: front view, side view facing left, back view; standing relaxed, full body with feet visible. Add one smaller head-and-shoulders front portrait at the right edge, big enough to show all face details. Plain cream (#F1E6CF) background, no props, only a soft paper shadow under the feet.
Kostya: an original teenager, 17, Sasha's older brother, tall and lanky (about a head and a half taller than Sasha). Lots of thick wavy dark-brown hair, clearly voluminous and a bit messy (his hair is his proud feature, make it big). The same small straight nose and the same eyebrow shape as Sasha, but with a sleepy half-smile and relaxed eyes. Clothes: a warm gray hoodie with the sleeves pushed up to the elbows, faded teal denim jeans, white socks.
Attached is the sheet of his younger brother Sasha: make Kostya clearly look like his older brother (same nose and eyebrow shape) but with his own hair and clothes, and draw him in exactly the same paper-collage style as Sasha.
Handmade paper-collage illustration with a warm family-photo-album feel. Every shape is cut from coloured paper with slightly uneven, hand-torn edges and a thin white torn-paper fibre rim. Visible paper fibre texture and soft film grain. Flat paper colours with only slight tonal variation. The scene is built from stacked paper layers (far wall, then furniture and props, then floor, then characters in front); each layer casts a soft drop shadow on the layer below. Subtle warm vignette in the corners.
Palette (use only these): mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C, no red in this picture.
No black outlines: shapes are separated by paper edges and shadows. Faces are simple cut-paper shapes with a few small ink details (eyes, brows, mouth).
Landscape 3:2, 1536x1024 px, a complete finished picture with its own background. Keep everything important inside the central 16:9 band (about 8% safe margin at top and bottom) and keep the lower fifth of the picture free of important details.
STRICTLY NO text, letters, numbers, digits, logos, watermark, speech bubbles, arrows, circles, motion lines, sparkles or any added effects. No blood, wounds or weapons. All characters are original and do not resemble any real person or any existing cartoon.
```

## Шаг 2. Задники (комната)

### 3. Задник 1: стена с дверью → `bg_door_wall.png` (он же кадр p1 «Тебя будит носок»)
Прикладывать: ничего.

```
Point-of-view shot from a child's bed in an apartment bedroom of the year 2005, looking toward the opposite wall. The room is empty, no people.
Centre-right: a wooden door, half open (about 40 degrees), with warm yellow light spilling in from the corridor; in the corridor far behind it a coat hook with a plain coat.
To the LEFT of the door frame, at head height: a small paper tear-off wall calendar hanging on a nail. Its page is completely blank (no numbers, no writing), with a thin red (#D92F2B) header strip. This is the only red in the picture.
Right part of the picture: a window with a pale faded teal curtain, the morning sun makes a soft mustard-cream glow on the floor. Under the window: a small wooden writing desk with a metal desk lamp, a pile of exercise books with plain covers and a cup of pencils.
Walls are cream with a subtle brick-brown wallpaper stripe in the lower third. The floor is parquet made from strips of brown paper with a small round olive rug.
At the very bottom edge, cropped: the top of a rumpled mustard-and-cream checked blanket.
Keep the upper third of the picture a calm plain wall area (no objects there except the top of the door frame). Calm quiet morning mood.
Handmade paper-collage illustration with a warm family-photo-album feel. Every shape is cut from coloured paper with slightly uneven, hand-torn edges and a thin white torn-paper fibre rim. Visible paper fibre texture and soft film grain. Flat paper colours with only slight tonal variation. The scene is built from stacked paper layers (far wall, then furniture and props, then floor, then characters in front); each layer casts a soft drop shadow on the layer below. Subtle warm vignette in the corners.
Palette (use only these): mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C, plus ONE accent red #D92F2B used ONLY on the single element named in the prompt, nowhere else.
No black outlines: shapes are separated by paper edges and shadows. Faces are simple cut-paper shapes with a few small ink details (eyes, brows, mouth).
Landscape 3:2, 1536x1024 px, a complete finished picture with its own background. Keep everything important inside the central 16:9 band (about 8% safe margin at top and bottom) and keep the lower fifth of the picture free of important details.
STRICTLY NO text, letters, numbers, digits, logos, watermark, speech bubbles, arrows, circles, motion lines, sparkles or any added effects. No blood, wounds or weapons. All characters are original and do not resemble any real person or any existing cartoon.
```

### 4. Задник 2: кровать под ковром → `bg_carpet_wall.png`
Прикладывать: `bg_door_wall.png` (та же комната, тот же стиль).

```
The same 2005 child's bedroom as in the attached image, now seen from the foot of the bed at chest height, looking at the bed. The bed stands with its headboard against the wall. On that wall directly above the bed hangs a large rectangular wall carpet with a geometric ornament in brick brown, olive green and mustard (ornament only, no letters or numbers) with a fringe at the bottom edge.
The bed is empty: a rumpled mustard-and-cream checked blanket pushed back, one flat cream pillow with a dent in it. Leave the middle of the bed area uncluttered, a character will be placed there later.
On the left: a low bedside shelf with an alarm clock (a plain round face with two hands and NO digits and NO marks) and a stack of comic books with plain blank covers. On the right edge: the edge of the faded teal window curtain and a strip of morning sunlight.
Parquet floor made from paper strips in the lower foreground. No people. No red anywhere in this picture. Wall colours slightly cooler and greyer than the first picture, as in a dream, but the same palette.
Handmade paper-collage illustration with a warm family-photo-album feel. Every shape is cut from coloured paper with slightly uneven, hand-torn edges and a thin white torn-paper fibre rim. Visible paper fibre texture and soft film grain. Flat paper colours with only slight tonal variation. The scene is built from stacked paper layers (far wall, then furniture and props, then floor, then characters in front); each layer casts a soft drop shadow on the layer below. Subtle warm vignette in the corners.
Palette (use only these): mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C, no red in this picture.
No black outlines: shapes are separated by paper edges and shadows. Faces are simple cut-paper shapes with a few small ink details (eyes, brows, mouth).
Landscape 3:2, 1536x1024 px, a complete finished picture with its own background. Keep everything important inside the central 16:9 band (about 8% safe margin at top and bottom) and keep the lower fifth of the picture free of important details.
STRICTLY NO text, letters, numbers, digits, logos, watermark, speech bubbles, arrows, circles, motion lines, sparkles or any added effects. No blood, wounds or weapons. All characters are original and do not resemble any real person or any existing cartoon.
```

## Шаг 3. Предмет и кадры

### 5. Носок → `p0_sock.png`
Прикладывать: ничего. Фон зелёный нарочно (выходит за палитру, я его вырежу).

```
A single rolled-up sock cut from paper, mustard yellow (#D9A441) with one wide red (#D92F2B) stripe around the cuff, slightly crumpled and bent as if frozen mid-flight, three-quarter view, with a torn-paper fibre rim and a soft shadow close to the object. It is a lone object centred on a flat solid bright green (#00B140) background with nothing else in the picture (the green is only for background removal). Paper-collage look, visible paper fibre texture. Landscape 3:2, 1536x1024 px, the sock fills about 45 percent of the width. No text, no letters, no numbers, no effects, no motion lines.
```

### 6. Костя в дверях → `p2_kostya.png`
Прикладывать: `kostya_sheet.png` + `bg_door_wall.png`.

```
Use the attached character sheet image(s) as the strict design reference for every character in the picture: same face shape, hair, eyebrows, nose, body proportions, clothes and colours. Do not redesign them. Change only the pose, the camera angle and the scene.
The attached background image shows the exact room: keep the same furniture, the same positions of the door, window, desk, bed and carpet, the same colours and the same paper-collage style.
Kostya: an original teenager, 17, Sasha's older brother, tall and lanky (about a head and a half taller than Sasha). Lots of thick wavy dark-brown hair, clearly voluminous and a bit messy (his hair is his proud feature, make it big). The same small straight nose and the same eyebrow shape as Sasha, but with a sleepy half-smile and relaxed eyes. Clothes: a warm gray hoodie with the sleeves pushed up to the elbows, faded teal denim jeans, white socks.
Scene: medium shot from inside the bedroom, camera at a child's eye level from the bed, slightly low angle. Kostya stands in the doorway of the wooden door (centre-right of the picture), the door opened wide now, behind him the corridor lit warm yellow. His right arm is still half raised with an open hand, as if he has just thrown something. His head is tilted slightly, he looks toward the camera with a sleepy cheeky half-smile.
At the left edge of the picture the small blank tear-off calendar with the thin red header strip hangs on the wall left of the door frame (the only red in the picture).
Composition: Kostya's head and his big thick hair occupy the upper third of the frame, so the picture can be slowly pushed in on his hair. Keep the lower fifth (floor and rug) free of important details.
Handmade paper-collage illustration with a warm family-photo-album feel. Every shape is cut from coloured paper with slightly uneven, hand-torn edges and a thin white torn-paper fibre rim. Visible paper fibre texture and soft film grain. Flat paper colours with only slight tonal variation. The scene is built from stacked paper layers (far wall, then furniture and props, then floor, then characters in front); each layer casts a soft drop shadow on the layer below. Subtle warm vignette in the corners.
Palette (use only these): mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C, plus ONE accent red #D92F2B used ONLY on the single element named in the prompt, nowhere else.
No black outlines: shapes are separated by paper edges and shadows. Faces are simple cut-paper shapes with a few small ink details (eyes, brows, mouth).
Landscape 3:2, 1536x1024 px, a complete finished picture with its own background. Keep everything important inside the central 16:9 band (about 8% safe margin at top and bottom) and keep the lower fifth of the picture free of important details.
STRICTLY NO text, letters, numbers, digits, logos, watermark, speech bubbles, arrows, circles, motion lines, sparkles or any added effects. No blood, wounds or weapons. All characters are original and do not resemble any real person or any existing cartoon.
```

### 7. Календарь крупно → `p3_calendar.png`
Прикладывать: `bg_door_wall.png` (чтобы календарь и стена совпали).

```
Extreme close-up, straight-on view of the paper tear-off wall calendar from the attached room: it hangs on a nail on the cream wall. The calendar page is a blank white-cream sheet with a clearly visible thin red (#D92F2B) header strip at the top with two small metal binding holes, an empty grid of faint thin pale-gray lines (7 columns, 5 rows) with NO numbers and NO words, and a small torn paper tab at the bottom edge. The page occupies the centre 55 percent of the frame, with a soft paper shadow on the wall. A sliver of the wooden door frame at the right edge and a bit of the brick-brown wallpaper stripe at the bottom. The page itself must stay completely empty: the date will be added later in code. Keep the lower fifth of the picture free of important details.
Handmade paper-collage illustration with a warm family-photo-album feel. Every shape is cut from coloured paper with slightly uneven, hand-torn edges and a thin white torn-paper fibre rim. Visible paper fibre texture and soft film grain. Flat paper colours with only slight tonal variation. The scene is built from stacked paper layers (far wall, then furniture and props, then floor, then characters in front); each layer casts a soft drop shadow on the layer below. Subtle warm vignette in the corners.
Palette (use only these): mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C, plus ONE accent red #D92F2B used ONLY on the single element named in the prompt, nowhere else.
No black outlines: shapes are separated by paper edges and shadows. Faces are simple cut-paper shapes with a few small ink details (eyes, brows, mouth).
Landscape 3:2, 1536x1024 px, a complete finished picture with its own background. Keep everything important inside the central 16:9 band (about 8% safe margin at top and bottom) and keep the lower fifth of the picture free of important details.
STRICTLY NO text, letters, numbers, digits, logos, watermark, speech bubbles, arrows, circles, motion lines, sparkles or any added effects. No blood, wounds or weapons. All characters are original and do not resemble any real person or any existing cartoon.
```

### 8. Саша садится → `p4_sasha.png`
Прикладывать: `sasha_sheet.png` + `bg_carpet_wall.png`.

```
Use the attached character sheet image(s) as the strict design reference for every character in the picture: same face shape, hair, eyebrows, nose, body proportions, clothes and colours. Do not redesign them. Change only the pose, the camera angle and the scene.
The attached background image shows the exact room: keep the same furniture, the same positions of the door, window, desk, bed and carpet, the same colours and the same paper-collage style.
Sasha: an original boy, 12 years old, slim and a little small for his age. Messy dark-brown hair with one stubborn cowlick at the front right. Big serious thoughtful dark eyes with faint grey-brown circles under them, eyebrows slightly drawn together, so the face looks like a tired adult's face on a child's body. Small ears, small straight nose, calm closed mouth. Clothes: a faded olive-green (#7A7F3F) cotton T-shirt with one plain chest pocket, light warm-gray pajama pants, bare feet.
Scene: medium shot, camera at the foot of the bed at chest height. Sasha sits up in the bed, his back against the pillow beneath the wall carpet, the blanket pulled up to his waist, both hands resting on the blanket, shoulders slightly raised. He looks straight at the camera with eyes wide open, brows drawn together, mouth slightly parted: a stunned adult mind in a boy's body. Sasha is centred, his head in the upper-middle of the frame. Keep the lower fifth (blanket and floor) free of important details. No red anywhere in this picture.
Handmade paper-collage illustration with a warm family-photo-album feel. Every shape is cut from coloured paper with slightly uneven, hand-torn edges and a thin white torn-paper fibre rim. Visible paper fibre texture and soft film grain. Flat paper colours with only slight tonal variation. The scene is built from stacked paper layers (far wall, then furniture and props, then floor, then characters in front); each layer casts a soft drop shadow on the layer below. Subtle warm vignette in the corners.
Palette (use only these): mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C, no red in this picture.
No black outlines: shapes are separated by paper edges and shadows. Faces are simple cut-paper shapes with a few small ink details (eyes, brows, mouth).
Landscape 3:2, 1536x1024 px, a complete finished picture with its own background. Keep everything important inside the central 16:9 band (about 8% safe margin at top and bottom) and keep the lower fifth of the picture free of important details.
STRICTLY NO text, letters, numbers, digits, logos, watermark, speech bubbles, arrows, circles, motion lines, sparkles or any added effects. No blood, wounds or weapons. All characters are original and do not resemble any real person or any existing cartoon.
```

## Если Codex ошибся (быстрые правки, дописывать в конец промта)

| Проблема | Что дописать |
|---|---|
| На картинке появились буквы или цифры (часто на календаре, часах, книгах) | `The calendar page, the clock face and all book covers must be completely blank. Remove every letter, digit and symbol from the picture.` |
| Герой «поплыл», не похож на лист | `The character must look exactly like the attached sheet: same face, same hair, same clothes. Redraw him; keep the pose and the room.` |
| Слишком гладко, без бумаги | `Make the paper collage obvious: visible torn white edges on every shape, paper grain, and soft shadows between layers. Flat shapes, no gradients, no 3D render look.` |
| Красного слишком много | `Remove all red except the thin red strip on the calendar header.` |
| Комната другая, чем на заднике | `Keep the room identical to the attached background: same door, window, desk, carpet and bed positions and the same colours.` |
| Важное внизу | `Move the composition up: the lowest fifth of the picture must be only floor or blanket.` |
| Реалистичное лицо вместо бумажного | `Faces must be simple cut-paper shapes with a few small ink details, not realistic, not 3D, not photographic.` |

## Что делает код (в картинки не рисовать)

Полёт носка (`p0_sock.png` вырезается и летит на камеру), дата «12 сентября 2005» на календаре, субтитры по словам, плавные наезды (в волосы Кости на p2), шаговая анимация 12 fps, бумажное зерно и плёночная виньетка, переходы рваной карточкой, звук.

## Чек-лист перед отправкой мне
- [ ] Обе картинки героев в одном бумажном стиле, лица Саши и Кости узнаются, у братьев похожие нос и брови.
- [ ] Нигде нет букв, цифр, стрелок и эффектов (проверь календарь, часы, обложки).
- [ ] Красный есть только на шапке календаря и на носке.
- [ ] Комната на заднике 1 и 2 одна и та же.
- [ ] Нижняя пятая часть каждого кадра без важных деталей.
- [ ] 1536×1024 PNG, имена файлов как в таблице.
