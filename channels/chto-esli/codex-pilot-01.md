# ТЗ пилота 01 «Помнишь, как будет»: восемь изображений

## 1. Текст пилота и порядок генерации

Основа: [сценарий v2](video-01-script.md), [паспорт канала](channel.md) и утверждённый состав прежнего ТЗ. Российская квартира, утро 12 сентября 2005 года. Саше снаружи 12 лет, внутри — память до 33; Косте здесь 17.

Сохраняем существующую сокращённую редакцию озвучки пилота, включая короткую реплику брата. Это уже отдельный фрагмент полного сценария: возвращать пропущенную фразу про завтрак или сокращать другие реплики без согласования нельзя.

> Тебя будит носок. Он прилетает прямо в лицо, а следом голос: «Мелкий, вставай». Голос твоего брата. Только ему здесь семнадцать, и у него ещё есть волосы. На календаре двенадцатое сентября две тысячи пятого. Вчера тебе было тридцать три.

Ориентир — примерно 15 секунд хука. Прежняя раскладка занимает около 16 секунд; это **предварительные тайминги**, не замер голоса. Точную длительность и границы кадров определяет озвучка с естественными паузами. Если чтение длиннее, растягиваем монтаж; текст ради формальных 15 секунд не меняем, голос принудительно не ускоряем.

Порядок производства:

1. Сгенерировать `sheets/sasha_sheet.png` без вложений, затем `sheets/kostya_sheet.png` с листом Саши как единственным референсом.
2. **Показать оба листа пользователю и дождаться явного «ок». До этого не генерировать задники и сцены и не собирать видео на их основе.** Самостоятельная проверка листов не заменяет согласование. Запрос тестовых видео разрешает последующую сборку, но сохраняет этот явно заданный этап.
3. После «ок» сгенерировать и принять задник 1, затем задник 2 с утверждённым задником 1. Сверить план и свет до сцен с героями.
4. Сгенерировать носок, Костю, календарь, Сашу с вложениями из таблицы. Если референс изменён, перепроверить зависимые кадры.
5. После приёмки исходников возможны два тестовых монтажа: А — спокойные наезды и прямые склейки; Б — более быстрый полёт носка и короткие переходы рваной карточкой. Озвучка, реплики, события и порядок в обоих одинаковые; длину определяет голос. Листы героев в монтаж не входят.

Статус теста от 31.10.2026: пользователь явно согласовал [лист Саши](video-01/assets/sheets/sasha_sheet.png) и [лист Кости](video-01/assets/sheets/kostya_sheet.png) и разрешил продолжить к двум видео. Созданы все восемь PNG. Тестовые сборки: [А — спокойная](video-01/renders/pilot-01-calm.mp4), [Б — динамичная](video-01/renders/pilot-01-dynamic.mp4). Фактическая аудиодорожка — 21,223 с, контейнеры — 21,25 с с финальной паузой; слова сохранены, ускорение голоса не применялось. Черновой голос — Microsoft Irina Desktop (русский Windows SAPI), финальный голос канала не утверждён. Фактические промты и референсы: [листы](video-01/generation-log.json), [задники и сцены](video-01/generation-log-scenes.json). Параметры файлов и проверка декодирования сохраняются в [отчёте рендера](video-01/spec/render-review.json); выборочный просмотр кадров не означает попиксельного совпадения всей комнаты.

Все восемь исходников — PNG **1536×1024**, горизонтальный 3:2. Сцены — законченные иллюстрации; листы — целые виды персонажа без разделения на детали куклы. Носок — отдельная вырезка на техническом зелёном, удаляемом перед монтажом.

Для заказа достаточно скопировать один английский блок целиком и приложить файлы его строки таблицы в указанном порядке. Общий STYLE, предыдущие промты и дополнительные референсы не нужны: всё повторено внутри каждого блока. Статичная фактура бумаги в исходнике; анимированное зерно, плёночная виньетка, дата, субтитры, переходы и звук — кодом.

## 2. Файлы и вложения

Пути относительны к `channels/chto-esli/video-01/assets/`. Номера вложений соответствуют `Input image` внутри промтов.

| № | Файл | Назначение | Вложения, по порядку |
|---|---|---|---|
| 1 | `sheets/sasha_sheet.png` | Лист Саши | Нет |
| 2 | `sheets/kostya_sheet.png` | Лист Кости | 1: `sheets/sasha_sheet.png` — родство лиц и единый материал |
| 3 | `bg/bg_door_wall.png` | Задник 1, он же p1: вид от кровати на дверь | Нет |
| 4 | `bg/bg_carpet_wall.png` | Задник 2: кровать под ковром, обратная камера | 1: утверждённый `bg/bg_door_wall.png` — та же физическая комната и свет |
| 5 | `shots/p0_sock.png` | Носок для полёта кодом | Нет |
| 6 | `shots/p2_kostya.png` | Костя в дверях | 1: `sheets/kostya_sheet.png` — герой; 2: `bg/bg_door_wall.png` — точная камера и фон |
| 7 | `shots/p3_calendar.png` | Крупный план календаря | 1: `bg/bg_door_wall.png` — предмет, крепление, стена и соседство двери |
| 8 | `shots/p4_sasha.png` | Саша садится в кровати | 1: `sheets/sasha_sheet.png` — герой; 2: `bg/bg_carpet_wall.png` — точная камера и фон |

p1 использует задник 1: девятую картинку не заказываем. Существующие исходники без запроса не перезаписывать: пробные версии сохранять рядом с суффиксом, затем явно выбрать канонический файл. В производственном журнале сохранять фактический промт, версии вложений и результат.

## 3. Карта комнаты и камеры

Стороны света — постоянные условные координаты комнаты, не ориентация квартиры по солнцу. Схема не в масштабе; стрелки здесь поясняют камеры и **не попадают в картинки**.

```text
                         СЕВЕР: стена с дверью
      +------------------------------------------------+
      |             КАЛЕНДАРЬ   ДВЕРЬ                  |
      |                         петли восточные        |
      |                         внутрь, 40°            |
ЗАПАД |                              ОКНО/занавеска    | ВОСТОК
пустая|          круглый коврик       СТОЛ под окном    |
стена |                              лампа, тетради,   |
      |               B v            карандаши         |
      |            +---------+                         |
      |            | изножье |                         |
      | ПОЛКА      | КРОВАТЬ |                         |
      | часы/книги |   A ^   |                         |
      |            | подушка |                         |
      +------------+изголовье+-------------------------+
                   ЮГ: КОВЁР НАД ИЗГОЛОВЬЕМ
```

Кровать изголовьем у южной стены, ногами к северу. Дверь на северной стене восточнее центра; календарь западнее неё, то есть слева при взгляде с кровати. Правая кромка календаря примерно в 6–7 см от западного косяка, около четверти ширины календаря; этот отступ уточнён по выбранному заднику и сохраняется в крупном плане. Петли двери на восточном косяке (в A справа); дверь открывается внутрь, свободный край движется к югу. Она уже открыта примерно на 40° и остаётся так во всех кадрах. Костя помещается в свободном проёме, не распахивает створку. Свет коридора виден из этой щели; отдельное состояние закрытой двери из ремарки полного сценария в пилот не добавляем.

На восточной боковой стене одно окно с выцветше-бирюзовой занавеской, под ним один письменный стол: выключенная серая металлическая лампа, небольшая стопка тетрадей с пустыми обложками, включая закрытый школьный дневник, стакан с несколькими карандашами. Над изголовьем прямоугольный кирпично-оливково-горчичный ковёр с бахромой без красного. На кровати плоская кремовая подушка и горчично-кремовое клетчатое одеяло.

Низкая полка западнее кровати: круглые часы с пустым циферблатом без цифр и делений, две простые стрелки; небольшая стопка комиксов с пустыми обложками. Эти предметы прежнего ТЗ внесены в общий план, а не появляются впервые у Саши. Между изножьем и дверью маленький круглый оливковый коврик. Паркет из кирпично-коричневых и тёпло-серых бумажных полос, кремовые стены с приглушённой кирпичной полосой в нижней трети. В коридоре простая стена: прежние крючок и пальто исключены. Других предметов не добавлять; находящееся за камерой не переносить в кадр.

Календарь один: вертикальный кремовый отрывной блок примерно 26×34 см, тонкая красная шапка, два серых отверстия переплёта, кремовая подложка, слегка неровный нижний край, один центральный серый гвоздь над блоком. Страница **целиком пустая, без сетки и разлиновки**. Светлые волокна, кожа и носки Кости кремовые: чистый белый не расширяет палитру. Волосы обоих тёмно-русые: тёмные оттенки серого и кирпичного, без нового цвета.

| Камера | Положение | Положение на изображении | Совпадение |
|---|---|---|---|
| A | От кровати у изголовья, объектив около 0,95 м, взгляд на север, перспектива около 35 мм экв. | Дверь справа от центра, календарь сразу слева от неё; окно/стол справа. Ковёр, изголовье, полка за камерой; внизу неважный край одеяла/пол | Задник 1 и p2: одинаковые масштаб, горизонт, перспектива и угол двери |
| B | Чуть севернее изножья, объектив около 1,2 м, взгляд на юг, около 35 мм экв. | Кровать/ковёр в центре; восточные окно/занавеска и видимый край стола теперь слева; западная полка справа. Дверь/календарь за камерой | Задник 2 и p4: меняется только присутствие и поза Саши |
| Деталь A | Приближение к календарю, взгляд остаётся на север | Календарь слева от соседнего дверного косяка, косяк справа; низкая полоса обоев за кадром | p3: тот же предмет на той же северной стене |

Раннее приглушённое утро: кремово-горчичный свет из восточного окна и более слабый тёплый свет коридора. В A и p3 окно освещает справа, в B слева. Лампа выключена. Тёплая альбомная окраска и экспозиция одинаковы; прежнее отдельное «похолодание как во сне» убрано. Межслойные тени мягкие, нарисованных лучей нет.

В каждом исходнике лица, волосы, руки, ступни и значимые предметы внутри **x=96…1440, y=128…752**. Нижние 20%, строки **820…1023**, только спокойный фон, пол или неважное одеяло; строки 753…819 — запас. Целые фигуры листов уменьшаем до этой зоны, ступни не обрезаем. Носок тоже целиком выше неё.

Центральный 16:9 из 1536×1024 — **1536×864, x=0…1535, y=80…943**: по 80 px (7,8125%) убирается сверху и снизу, а не с боков. Нижняя пятая часть кропа начинается примерно с y=771 исходника; запас до y=752 защищает и её. Каждый конечный наезд проверять заново на обрезку и перекрытие субтитрами. Полёт носка на зрителя — намеренный выход за край только в конце броска.

## 4. Предварительный монтаж

В сумме прежние **около 16 секунд**. До записи озвучки длительности не точные; голос и паузы могут сдвинуть все границы. Строки озвучки подряд дословно воспроизводят текст пилота.

| Примерное время | Точная фраза озвучки | Изображение | Действие кода |
|---|---|---|---|
| 0–3,5 с | Тебя будит носок. Он прилетает прямо в лицо, | `bg/bg_door_wall.png` + `shots/p0_sock.png` | Удалить зелёный; полёт от двери на камеру с масштабом/поворотом выше субтитров, в конце частичное перекрытие обзора; шорох и мягкий удар тканью |
| 3,5–6 с | а следом голос: «Мелкий, вставай». | `shots/p2_kostya.png` | Склейка в том же A; реплику брата выделить голосом/интонацией, не анимировать части тела |
| 6–11 с | Голос твоего брата. Только ему здесь семнадцать, и у него ещё есть волосы. | `shots/p2_kostya.png` | Медленный небольшой наезд на голову, сохраняя всю копну; лицо и рука выше субтитров |
| 11–13 с | На календаре двенадцатое сентября две тысячи пятого. | `shots/p3_calendar.png` | Наложить «12 сентября 2005» на пустую страницу с учётом перспективы; двигать дату вместе с кадром, убрать при смене плана |
| 13–16 с | Вчера тебе было тридцать три. | `shots/p4_sasha.png` | Смена на B, осторожный наезд на усталый взрослый взгляд, завершение паузой по голосу; поза уже цельная |

В текущей черновой озвучке измеренные интервалы другие: носок 0–4,219 с; Костя 4,219–14,367 с; календарь 14,367–18,479 с; Саша 18,479–21,25 с. Полные интервалы отдельных реплик и слова находятся в `video-01/spec/timeline.json`. При замене голоса пересчитать границы, не подгонять речь под предварительную таблицу.

Для обеих тестовых версий: ступенчатое движение 12 fps, субтитры в нижней зоне конечного 16:9, анимированное зерно и мягкая плёночная виньетка кодом. Бумажные края и физическая фактура уже в исходниках. Не двигать мебель отдельно, не собирать героя из конечностей. Разница А/Б только в темпе движения и переходах; без новых картинок, реплик и событий.

## 5. Восемь полных английских промтов

Каждый блок копировать целиком. Порядок вложений указан перед ним и внутри. Полные ограничения намеренно повторены; заменять их ссылкой на другой блок нельзя.

### 1. Саша → `sheets/sasha_sheet.png`

Вложения: Нет.

```text
Asset: sheets/sasha_sheet.png, Sasha character design sheet. No input images or attachments; establish the original design.
Composition: three intact full-body views of the SAME boy side by side: front, left-facing profile, back, at equal scale, relaxed standing, complete hands and bare feet visible. Use a compact layout with the figures around x=400, 620, 845, their entire silhouettes within y=220..680. Add a smaller front head-and-shoulders portrait around x=1150, y=420, showing eyes, brows and cowlick. All artwork, including the portrait and local shadows, must fit within y=200..700, leaving broad cream margins above and below. Uniformly scale intact figures to fit; never shorten legs or crop hair or feet. One unified sheet, no comic panels, view labels, dividers, detached limbs or props. Plain cream #F1E6CF paper background with soft local paper shadows; entire bottom 30 percent empty cream.

Sasha: an original 12-year-old boy, slim and slightly small for his age, with a child's body and an unmistakably adult, tired, watchful gaze. Messy dark ash-brown hair (dark russet-blond), made from shaded warm-gray and brick-brown paper, with one stubborn cowlick at his anatomical front-right hairline. Large serious dark eyes, faint gray-brown under-eye shadows, slightly drawn-together eyebrows, small ears, a small straight nose and a small calm mouth. Warm cream paper skin. Clothes: faded olive-green #7A7F3F cotton T-shirt with one plain chest pocket, light warm-gray #A59B8C pajama pants, bare feet. No jewelry, prints, logos, facial hair or accessories. Preserve age, facial proportions, cowlick side, pocket and outfit.

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. The only permitted red is #D92F2B, exclusively on a sock cuff stripe or a calendar header when that object is visible.

Red rule: no sock prop or calendar is present; no red #D92F2B anywhere. Soft upper-left studio-like illumination reveals shallow paper layers, without any room backdrop.

Output/composition: one opaque PNG, exactly 1536x1024 pixels, landscape 3:2. Keep all faces, hair silhouettes, hands, feet and meaningful objects entirely within x=96..1440 and y=128..752. The lowest 20 percent, y=820..1023, contains only unimportant background, floor or blanket, with no faces, hands, feet or significant props. Leave y=753..819 as extra breathing room. The central 16:9 crop keeps x=0..1535, y=80..943; essential action must survive this crop and a mild push-in. These coordinates are instructions; never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers and calendar pages are completely blank, without grids or ruling. The clock dial has no numerals or ticks; only its two plain hands are allowed. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people, props, modern devices, brands, blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### 2. Костя → `sheets/kostya_sheet.png`

Вложения: 1: `sheets/sasha_sheet.png`.

```text
Asset: sheets/kostya_sheet.png, Kostya character design sheet.
Input image 1: sheets/sasha_sheet.png. Use the selected Sasha sheet as the family-face reference (nose, ear and eyebrow structure), paper material, palette and rendering reference. Do NOT depict Sasha. Kostya is his 17-year-old older brother, not an enlarged 12-year-old.
Composition: three intact full-body views of the SAME teenager side by side: front, left-facing profile, back, at equal scale, relaxed standing, complete hands and socked feet visible. Match the compact layout of the attached Sasha sheet, figures around x=400, 620, 845, their entire silhouettes within y=220..680. Add a smaller front head-and-shoulders portrait around x=1150, y=420, with the entire full hair silhouette. All artwork, including the portrait and local shadows, must fit within y=200..700, leaving broad cream margins above and below. Uniformly scale intact figures to fit; never shorten legs or crop hair or feet. One unified sheet, no comic panels, view labels, dividers, detached limbs or props. Plain cream #F1E6CF paper background with soft local shadows. Shared layout fits the canvas; do not infer equal physical heights from the sheet scale. Entire bottom 30 percent empty cream.

Kostya: an original 17-year-old boy, Sasha's older brother, tall and lanky, about one and a half heads taller than the 12-year-old Sasha. A conspicuously full, thick, wavy, slightly messy mop of dark ash-brown hair, made from shaded warm-gray and brick-brown paper; the large hair silhouette is immediately readable. Warm cream paper skin, a small straight nose, small ears, large dark eyes, the same underlying nose and eyebrow shapes as Sasha, but a slightly longer, more mature teenage face. Relaxed eyes and a sleepy cheeky half-smile; no beard, moustache or adult aging. Clothes: plain warm-gray #A59B8C hoodie, sleeves pushed up to the elbows, faded teal #5E8C8A denim jeans, plain cream #F1E6CF socks, no shoes. No prints, logos, jewelry or accessories. Preserve age, family resemblance, full hair silhouette, proportions and outfit.

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. The only permitted red is #D92F2B, exclusively on a sock cuff stripe or a calendar header when that object is visible.

Red rule: no sock prop or calendar is present; worn socks are plain cream, no red #D92F2B anywhere. Match the reference's soft upper-left paper illumination, with no room backdrop.

Output/composition: one opaque PNG, exactly 1536x1024 pixels, landscape 3:2. Keep all faces, hair silhouettes, hands, feet and meaningful objects entirely within x=96..1440 and y=128..752. The lowest 20 percent, y=820..1023, contains only unimportant background, floor or blanket, with no faces, hands, feet or significant props. Leave y=753..819 as extra breathing room. The central 16:9 crop keeps x=0..1535, y=80..943; essential action must survive this crop and a mild push-in. These coordinates are instructions; never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers and calendar pages are completely blank, without grids or ruling. The clock dial has no numerals or ticks; only its two plain hands are allowed. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people, props, modern devices, brands, blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### 3. Задник 1: дверь → `bg/bg_door_wall.png`

Вложения: Нет.

```text
Asset: bg/bg_door_wall.png, empty background 1 and opening shot plate. No input images or attachments. Establish the master north-facing room geometry; no people or flying sock.

Physical room, not screen coordinates: a modest Russian apartment bedroom, September 2005. North wall: one wooden door east of center, one tear-off calendar immediately west of it. Opposite south wall: the single bed's headboard, with a large rectangular geometric wall carpet directly above; the bed extends north. East side wall: one window with a faded teal curtain and one wooden writing desk directly below it. West wall is plain. A low bedside shelf stands west of the bed. One small round olive rug lies between the bed foot and the door. Cream walls have a muted brick-brown horizontal band in their lower third. Parquet consists of brick-brown and warm-gray paper strips. Bed: one flat cream pillow, rumpled mustard-and-cream checked blanket. Wall carpet: brick brown, olive, mustard, with a cream/brick fringe, no red. Desk objects only: one unlit warm-gray metal lamp, a short stack of blank cream/olive exercise books including the closed school diary, one warm-gray cup with a few mustard/olive pencils. Shelf objects only: one warm-gray round alarm clock with a blank cream dial and two plain hands, a short stack of blank cream/olive comic books. No other furniture or decorations. Objects outside the view stay off screen; never move or duplicate them to make them visible.

Door/calendar continuity: the door's hinges are on its east jamb, screen-right looking north from the bed. It opens inward; its free edge swings south. Keep it open about 40 degrees in every shot, also with Kostya; never widen it. Behind it is a plain corridor, no coat or coat hook. The calendar is a portrait cream tear-off pad about 26 cm wide by 34 cm high, centered at adult eye height. Its right edge is about 6 to 7 cm west of the west door jamb (roughly one quarter of the calendar width). It has a thin red #D92F2B header, two small warm-gray binding holes, a cream backing, a slightly uneven lower edge and one central warm-gray nail above it. Its page is completely blank, no grid, ruling, divisions, words, numerals or date. Preserve its shape, attachment and door-side gap.

Camera A: fixed wide view from the bed near the south headboard, lens about 0.95 m above the floor, looking north, natural roughly 35 mm-equivalent perspective. Door center-right; calendar immediately screen-left of the door, not at the extreme edge; east window and desk screen-right. The headboard, wall carpet and bedside shelf are behind this camera, not on the door wall. Only an unimportant cropped blanket edge in the near foreground. Compose the doorway threshold, rug and desk props above y=752; bottom fifth quiet foreground floor/blanket. Lock framing, horizon, perspective, door opening and visible object positions for the empty background and Kostya's scene.

Lighting continuity: the same dim early morning in all room shots, soft cream-mustard daylight entering only through the east-wall window plus weaker warm cream-mustard corridor light through the ajar north door. Desk lamp off. Same exposure and warm album grading; no colder dream treatment, different time of day, additional light source or drawn light beam. Physical lighting stays fixed; its screen direction reverses with the camera.

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. The only permitted red is #D92F2B, exclusively on a sock cuff stripe or a calendar header when that object is visible.

Red rule: #D92F2B only on the calendar's thin header strip, nowhere else. One complete finished room illustration.

Output/composition: one opaque PNG, exactly 1536x1024 pixels, landscape 3:2. Keep all faces, hair silhouettes, hands, feet and meaningful objects entirely within x=96..1440 and y=128..752. The lowest 20 percent, y=820..1023, contains only unimportant background, floor or blanket, with no faces, hands, feet or significant props. Leave y=753..819 as extra breathing room. The central 16:9 crop keeps x=0..1535, y=80..943; essential action must survive this crop and a mild push-in. These coordinates are instructions; never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers and calendar pages are completely blank, without grids or ruling. The clock dial has no numerals or ticks; only its two plain hands are allowed. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people, props, modern devices, brands, blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### 4. Задник 2: ковёр → `bg/bg_carpet_wall.png`

Вложения: 1: утверждённый `bg/bg_door_wall.png`.

```text
Asset: bg/bg_carpet_wall.png, empty background 2.
Input image 1: bg/bg_door_wall.png, the approved master room. Preserve its physical room, wall finish, parquet, bedding, window/curtain, desk objects, palette, material and light. Change to the physically reverse camera below; do not copy screen-left/screen-right positions. Reveal the south headboard wall, which is out of view in the reference, as described; no additional props.

Physical room, not screen coordinates: a modest Russian apartment bedroom, September 2005. North wall: one wooden door east of center, one tear-off calendar immediately west of it. Opposite south wall: the single bed's headboard, with a large rectangular geometric wall carpet directly above; the bed extends north. East side wall: one window with a faded teal curtain and one wooden writing desk directly below it. West wall is plain. A low bedside shelf stands west of the bed. One small round olive rug lies between the bed foot and the door. Cream walls have a muted brick-brown horizontal band in their lower third. Parquet consists of brick-brown and warm-gray paper strips. Bed: one flat cream pillow, rumpled mustard-and-cream checked blanket. Wall carpet: brick brown, olive, mustard, with a cream/brick fringe, no red. Desk objects only: one unlit warm-gray metal lamp, a short stack of blank cream/olive exercise books including the closed school diary, one warm-gray cup with a few mustard/olive pencils. Shelf objects only: one warm-gray round alarm clock with a blank cream dial and two plain hands, a short stack of blank cream/olive comic books. No other furniture or decorations. Objects outside the view stay off screen; never move or duplicate them to make them visible.

Door/calendar continuity: the door's hinges are on its east jamb, screen-right looking north from the bed. It opens inward; its free edge swings south. Keep it open about 40 degrees in every shot, also with Kostya; never widen it. Behind it is a plain corridor, no coat or coat hook. The calendar is a portrait cream tear-off pad about 26 cm wide by 34 cm high, centered at adult eye height. Its right edge is about 6 to 7 cm west of the west door jamb (roughly one quarter of the calendar width). It has a thin red #D92F2B header, two small warm-gray binding holes, a cream backing, a slightly uneven lower edge and one central warm-gray nail above it. Its page is completely blank, no grid, ruling, divisions, words, numerals or date. Preserve its shape, attachment and door-side gap.

Camera B: fixed reverse wide view from just north of the bed foot, lens about 1.2 m above the floor, looking south, natural roughly 35 mm-equivalent perspective. Bed and wall carpet centered. East window/teal curtain and the visible desk edge are now screen-left; shelf west of the bed, with its clock and blank comics, screen-right. North door and calendar are behind this camera; do not put them on the carpet wall. This is a physical reverse view, not a horizontal mirror of Camera A. Meaningful furniture details above y=752, bottom fifth only unimportant blanket/floor. Lock camera, bed, carpet, shelf and curtain geometry between empty background and Sasha's scene.

Lighting continuity: the same dim early morning in all room shots, soft cream-mustard daylight entering only through the east-wall window plus weaker warm cream-mustard corridor light through the ajar north door. Desk lamp off. Same exposure and warm album grading; no colder dream treatment, different time of day, additional light source or drawn light beam. Physical lighting stays fixed; its screen direction reverses with the camera.

Scene: no people. One flat cream pillow with a dent; rumpled checked blanket pushed back, leaving an uncluttered sitting area near the headboard. Shelf and its existing clock/comics screen-right. Show only as much of the east window/curtain and desk screen-left as the fixed reverse camera can physically see. The round rug can be behind this camera; do not bring it forward for display.

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. The only permitted red is #D92F2B, exclusively on a sock cuff stripe or a calendar header when that object is visible.

Red rule: no red #D92F2B visible. Calendar remains on the opposite north wall behind this camera; sock absent. One complete finished room illustration.

Output/composition: one opaque PNG, exactly 1536x1024 pixels, landscape 3:2. Keep all faces, hair silhouettes, hands, feet and meaningful objects entirely within x=96..1440 and y=128..752. The lowest 20 percent, y=820..1023, contains only unimportant background, floor or blanket, with no faces, hands, feet or significant props. Leave y=753..819 as extra breathing room. The central 16:9 crop keeps x=0..1535, y=80..943; essential action must survive this crop and a mild push-in. These coordinates are instructions; never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers and calendar pages are completely blank, without grids or ruling. The clock dial has no numerals or ticks; only its two plain hands are allowed. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people, props, modern devices, brands, blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### 5. Носок → `shots/p0_sock.png`

Вложения: Нет.

```text
Asset: shots/p0_sock.png, one separate paper sock cutout for a code-animated flight. No input images or attachments.
Subject: exactly one mustard #D9A441 sock, loosely rolled, bent and slightly crumpled in three-quarter view, with exactly one wide red #D92F2B cuff stripe. Single intact object, not a pair, not worn. Entire silhouette within about x=420..1116, y=260..680, about 45 percent of image width, generous space around. No person, hand, bed, floor or room.
Technical background exception: perfectly uniform, flat, opaque chroma green #00B140 over the whole canvas. This background is deliberately OUTSIDE the artistic palette and will be removed before editing. Green is not a scene color: no green on the sock, spill, gradients, background texture or vignette. Green right up to the cutout edge; retain cream fibers without a green halo. Only shallow internal contact shadows between the sock's paper layers, no floating cast shadow on the green.

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. The only permitted red is #D92F2B, exclusively on a sock cuff stripe or a calendar header when that object is visible.

Red rule: #D92F2B only on the single sock cuff stripe. Technical background #00B140 is the sole palette exception. Soft upper-left illumination reveals fibers and internal overlaps. No trajectory, blur or impact; code adds flight, scale and rotation.

Output/composition: one opaque PNG, exactly 1536x1024 pixels, landscape 3:2. Keep all faces, hair silhouettes, hands, feet and meaningful objects entirely within x=96..1440 and y=128..752. The lowest 20 percent, y=820..1023, contains only unimportant background, floor or blanket, with no faces, hands, feet or significant props. Leave y=753..819 as extra breathing room. The central 16:9 crop keeps x=0..1535, y=80..943; essential action must survive this crop and a mild push-in. These coordinates are instructions; never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers and calendar pages are completely blank, without grids or ruling. The clock dial has no numerals or ticks; only its two plain hands are allowed. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people, props, modern devices, brands, blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### 6. Костя в дверях → `shots/p2_kostya.png`

Вложения: 1: `sheets/kostya_sheet.png`; 2: `bg/bg_door_wall.png`.

```text
Asset: shots/p2_kostya.png, complete scene of Kostya in the doorway.
Input image 1: sheets/kostya_sheet.png, strict identity reference for face, age, thick hair, proportions, clothes and material; change only pose/expression as specified.
Input image 2: bg/bg_door_wall.png, strict background and Camera A reference. Preserve exact framing, perspective, horizon, geometry, colors, light and about 40-degree door opening. Add Kostya; do not reframe as a different medium shot or open the door farther.

Kostya: an original 17-year-old boy, Sasha's older brother, tall and lanky, about one and a half heads taller than the 12-year-old Sasha. A conspicuously full, thick, wavy, slightly messy mop of dark ash-brown hair, made from shaded warm-gray and brick-brown paper; the large hair silhouette is immediately readable. Warm cream paper skin, a small straight nose, small ears, large dark eyes, the same underlying nose and eyebrow shapes as Sasha, but a slightly longer, more mature teenage face. Relaxed eyes and a sleepy cheeky half-smile; no beard, moustache or adult aging. Clothes: plain warm-gray #A59B8C hoodie, sleeves pushed up to the elbows, faded teal #5E8C8A denim jeans, plain cream #F1E6CF socks, no shoes. No prints, logos, jewelry or accessories. Preserve age, family resemblance, full hair silhouette, proportions and outfit.

Physical room, not screen coordinates: a modest Russian apartment bedroom, September 2005. North wall: one wooden door east of center, one tear-off calendar immediately west of it. Opposite south wall: the single bed's headboard, with a large rectangular geometric wall carpet directly above; the bed extends north. East side wall: one window with a faded teal curtain and one wooden writing desk directly below it. West wall is plain. A low bedside shelf stands west of the bed. One small round olive rug lies between the bed foot and the door. Cream walls have a muted brick-brown horizontal band in their lower third. Parquet consists of brick-brown and warm-gray paper strips. Bed: one flat cream pillow, rumpled mustard-and-cream checked blanket. Wall carpet: brick brown, olive, mustard, with a cream/brick fringe, no red. Desk objects only: one unlit warm-gray metal lamp, a short stack of blank cream/olive exercise books including the closed school diary, one warm-gray cup with a few mustard/olive pencils. Shelf objects only: one warm-gray round alarm clock with a blank cream dial and two plain hands, a short stack of blank cream/olive comic books. No other furniture or decorations. Objects outside the view stay off screen; never move or duplicate them to make them visible.

Door/calendar continuity: the door's hinges are on its east jamb, screen-right looking north from the bed. It opens inward; its free edge swings south. Keep it open about 40 degrees in every shot, also with Kostya; never widen it. Behind it is a plain corridor, no coat or coat hook. The calendar is a portrait cream tear-off pad about 26 cm wide by 34 cm high, centered at adult eye height. Its right edge is about 6 to 7 cm west of the west door jamb (roughly one quarter of the calendar width). It has a thin red #D92F2B header, two small warm-gray binding holes, a cream backing, a slightly uneven lower edge and one central warm-gray nail above it. Its page is completely blank, no grid, ruling, divisions, words, numerals or date. Preserve its shape, attachment and door-side gap.

Camera A: fixed wide view from the bed near the south headboard, lens about 0.95 m above the floor, looking north, natural roughly 35 mm-equivalent perspective. Door center-right; calendar immediately screen-left of the door, not at the extreme edge; east window and desk screen-right. The headboard, wall carpet and bedside shelf are behind this camera, not on the door wall. Only an unimportant cropped blanket edge in the near foreground. Compose the doorway threshold, rug and desk props above y=752; bottom fifth quiet foreground floor/blanket. Lock framing, horizon, perspective, door opening and visible object positions for the empty background and Kostya's scene.

Lighting continuity: the same dim early morning in all room shots, soft cream-mustard daylight entering only through the east-wall window plus weaker warm cream-mustard corridor light through the ajar north door. Desk lamp off. Same exposure and warm album grading; no colder dream treatment, different time of day, additional light source or drawn light beam. Physical lighting stays fixed; its screen direction reverses with the camera.

Action: Kostya stands just inside the doorway at the threshold, fitting the free opening without intersecting door leaf or jamb. Head slightly tilted; he looks toward the bed/camera with a sleepy cheeky half-smile. His anatomical right arm is half raised, elbow bent, empty open hand at chest height, the quiet aftermath of tossing a sock. Whole character inside the safe area, hair about y=230..360, both cream socked feet no lower than y=752. Preserve his whole large hair silhouette for a gentle push-in. No flying sock or Sasha. Calendar fully visible immediately screen-left of the door, not relocated to the extreme image edge. Face, hand and feet above the subtitle zone.

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. The only permitted red is #D92F2B, exclusively on a sock cuff stripe or a calendar header when that object is visible.

Red rule: #D92F2B only on the existing calendar header; worn socks plain cream. One finished scene with its own background, not a transparent puppet or detached character.

Output/composition: one opaque PNG, exactly 1536x1024 pixels, landscape 3:2. Keep all faces, hair silhouettes, hands, feet and meaningful objects entirely within x=96..1440 and y=128..752. The lowest 20 percent, y=820..1023, contains only unimportant background, floor or blanket, with no faces, hands, feet or significant props. Leave y=753..819 as extra breathing room. The central 16:9 crop keeps x=0..1535, y=80..943; essential action must survive this crop and a mild push-in. These coordinates are instructions; never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers and calendar pages are completely blank, without grids or ruling. The clock dial has no numerals or ticks; only its two plain hands are allowed. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people, props, modern devices, brands, blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### 7. Календарь крупно → `shots/p3_calendar.png`

Вложения: 1: `bg/bg_door_wall.png`.

```text
Asset: shots/p3_calendar.png, close-up detail of the master calendar.
Input image 1: bg/bg_door_wall.png. Exact reference for calendar object, attachment, wall finish, neighboring door, paper material and light. A tighter north-facing detail derived from Camera A: bring the view closer to the calendar, do not turn toward another wall or redesign the object.

Door/calendar continuity: the door's hinges are on its east jamb, screen-right looking north from the bed. It opens inward; its free edge swings south. Keep it open about 40 degrees in every shot, also with Kostya; never widen it. Behind it is a plain corridor, no coat or coat hook. The calendar is a portrait cream tear-off pad about 26 cm wide by 34 cm high, centered at adult eye height. Its right edge is about 6 to 7 cm west of the west door jamb (roughly one quarter of the calendar width). It has a thin red #D92F2B header, two small warm-gray binding holes, a cream backing, a slightly uneven lower edge and one central warm-gray nail above it. Its page is completely blank, no grid, ruling, divisions, words, numerals or date. Preserve its shape, attachment and door-side gap.

Lighting continuity: the same dim early morning in all room shots, soft cream-mustard daylight entering only through the east-wall window plus weaker warm cream-mustard corridor light through the ajar north door. Desk lamp off. Same exposure and warm album grading; no colder dream treatment, different time of day, additional light source or drawn light beam. Physical lighting stays fixed; its screen direction reverses with the camera.

Composition: near-frontal north-facing close-up of that same portrait cream tear-off pad on its cream wall, neighboring wooden west door jamb screen-right. Keep its 26:34 physical proportions, thin red header, two small gray binding holes, one central nail immediately above. Pad approximately x=450..802, y=182..666, nail near y=140; neighboring door jamb near x=895. Preserve the roughly 6 to 7 cm physical gap (about one quarter of the calendar width) between calendar right edge and this jamb. Crop the wall naturally; its low brick-brown wallpaper band is below this close-up, never pull it upward. The visible page is a completely blank uninterrupted cream sheet, absolutely no grid, rows, columns, ruling, words, dates, numerals, symbols or pseudo-writing. Clean central page for the date added in code. No desk, carpet, clock, people, furniture or sock in this crop. Bottom fifth only unimportant plain wall and/or jamb continuation, never the calendar. Do not invent new room objects.

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. The only permitted red is #D92F2B, exclusively on a sock cuff stripe or a calendar header when that object is visible.

Red rule: #D92F2B only on the calendar's thin header. East-window side light comes from screen-right, with subdued warm corridor light near the door. One complete finished close-up, not an isolated calendar cutout.

Output/composition: one opaque PNG, exactly 1536x1024 pixels, landscape 3:2. Keep all faces, hair silhouettes, hands, feet and meaningful objects entirely within x=96..1440 and y=128..752. The lowest 20 percent, y=820..1023, contains only unimportant background, floor or blanket, with no faces, hands, feet or significant props. Leave y=753..819 as extra breathing room. The central 16:9 crop keeps x=0..1535, y=80..943; essential action must survive this crop and a mild push-in. These coordinates are instructions; never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers and calendar pages are completely blank, without grids or ruling. The clock dial has no numerals or ticks; only its two plain hands are allowed. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people, props, modern devices, brands, blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### 8. Саша садится → `shots/p4_sasha.png`

Вложения: 1: `sheets/sasha_sheet.png`; 2: `bg/bg_carpet_wall.png`.

```text
Asset: shots/p4_sasha.png, complete scene of Sasha sitting up in bed.
Input image 1: sheets/sasha_sheet.png, strict identity reference for age, adult tired gaze, eyes/brows/face, anatomical front-right cowlick, slim child proportions, outfit and material.
Input image 2: bg/bg_carpet_wall.png, strict Camera B and background reference. Preserve exact framing, horizon, bed/headboard, pillow, carpet motif/fringe, screen-right shelf, screen-left curtain/desk, colors, material and light. Add Sasha without moving furniture or camera.

Sasha: an original 12-year-old boy, slim and slightly small for his age, with a child's body and an unmistakably adult, tired, watchful gaze. Messy dark ash-brown hair (dark russet-blond), made from shaded warm-gray and brick-brown paper, with one stubborn cowlick at his anatomical front-right hairline. Large serious dark eyes, faint gray-brown under-eye shadows, slightly drawn-together eyebrows, small ears, a small straight nose and a small calm mouth. Warm cream paper skin. Clothes: faded olive-green #7A7F3F cotton T-shirt with one plain chest pocket, light warm-gray #A59B8C pajama pants, bare feet. No jewelry, prints, logos, facial hair or accessories. Preserve age, facial proportions, cowlick side, pocket and outfit.

Physical room, not screen coordinates: a modest Russian apartment bedroom, September 2005. North wall: one wooden door east of center, one tear-off calendar immediately west of it. Opposite south wall: the single bed's headboard, with a large rectangular geometric wall carpet directly above; the bed extends north. East side wall: one window with a faded teal curtain and one wooden writing desk directly below it. West wall is plain. A low bedside shelf stands west of the bed. One small round olive rug lies between the bed foot and the door. Cream walls have a muted brick-brown horizontal band in their lower third. Parquet consists of brick-brown and warm-gray paper strips. Bed: one flat cream pillow, rumpled mustard-and-cream checked blanket. Wall carpet: brick brown, olive, mustard, with a cream/brick fringe, no red. Desk objects only: one unlit warm-gray metal lamp, a short stack of blank cream/olive exercise books including the closed school diary, one warm-gray cup with a few mustard/olive pencils. Shelf objects only: one warm-gray round alarm clock with a blank cream dial and two plain hands, a short stack of blank cream/olive comic books. No other furniture or decorations. Objects outside the view stay off screen; never move or duplicate them to make them visible.

Door/calendar continuity: the door's hinges are on its east jamb, screen-right looking north from the bed. It opens inward; its free edge swings south. Keep it open about 40 degrees in every shot, also with Kostya; never widen it. Behind it is a plain corridor, no coat or coat hook. The calendar is a portrait cream tear-off pad about 26 cm wide by 34 cm high, centered at adult eye height. Its right edge is about 6 to 7 cm west of the west door jamb (roughly one quarter of the calendar width). It has a thin red #D92F2B header, two small warm-gray binding holes, a cream backing, a slightly uneven lower edge and one central warm-gray nail above it. Its page is completely blank, no grid, ruling, divisions, words, numerals or date. Preserve its shape, attachment and door-side gap.

Camera B: fixed reverse wide view from just north of the bed foot, lens about 1.2 m above the floor, looking south, natural roughly 35 mm-equivalent perspective. Bed and wall carpet centered. East window/teal curtain and the visible desk edge are now screen-left; shelf west of the bed, with its clock and blank comics, screen-right. North door and calendar are behind this camera; do not put them on the carpet wall. This is a physical reverse view, not a horizontal mirror of Camera A. Meaningful furniture details above y=752, bottom fifth only unimportant blanket/floor. Lock camera, bed, carpet, shelf and curtain geometry between empty background and Sasha's scene.

Lighting continuity: the same dim early morning in all room shots, soft cream-mustard daylight entering only through the east-wall window plus weaker warm cream-mustard corridor light through the ajar north door. Desk lamp off. Same exposure and warm album grading; no colder dream treatment, different time of day, additional light source or drawn light beam. Physical lighting stays fixed; its screen direction reverses with the camera.

Action: Sasha has just sat upright near the headboard, back lightly against the same pillow, shoulders slightly raised. Checked mustard-and-cream blanket covers waist and legs; feet covered, not visible. Both hands rest visibly on top of the blanket around y=600..700. Face centered upper-middle, about x=768, y=370, hair safely below y=180. He looks toward camera/bed foot with wide serious eyes, drawn brows, subtly parted mouth: stunned tired recognition of a 33-year-old mind in a 12-year-old body. Do not physically age his face or turn him into a smiling schoolboy. Existing carpet directly above the headboard and behind him. No Kostya, flying sock or new props; lower foreground only unimportant blanket/floor.

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. The only permitted red is #D92F2B, exclusively on a sock cuff stripe or a calendar header when that object is visible.

Red rule: no red #D92F2B visible. Calendar is on the north wall behind Camera B; sock outside this scene. One finished scene with Sasha integrated into the room, never a puppet sheet or transparent figure.

Output/composition: one opaque PNG, exactly 1536x1024 pixels, landscape 3:2. Keep all faces, hair silhouettes, hands, feet and meaningful objects entirely within x=96..1440 and y=128..752. The lowest 20 percent, y=820..1023, contains only unimportant background, floor or blanket, with no faces, hands, feet or significant props. Leave y=753..819 as extra breathing room. The central 16:9 crop keeps x=0..1535, y=80..943; essential action must survive this crop and a mild push-in. These coordinates are instructions; never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers and calendar pages are completely blank, without grids or ruling. The clock dial has no numerals or ticks; only its two plain hands are allowed. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people, props, modern devices, brands, blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

## 6. Быстрые правки

Применять к нужному исходнику с его исходными вложениями; остальные принятые свойства сохранять. После правки референса перепроверить зависимые кадры.

| Проблема | Правка на английском |
|---|---|
| Саша не похож на лист | `Match Sasha exactly to the attached Sasha sheet: slim 12-year-old, messy dark ash-brown hair with the anatomical front-right cowlick, serious dark eyes with faint under-eye shadows, slightly drawn brows, tired adult gaze. Keep the olive pocket T-shirt, light warm-gray pajama pants, bare feet. Preserve the accepted pose, room, light and safe area; do not physically age his face.` |
| Костя не похож на брата / мало волос | `Match Kostya to the attached Kostya sheet: tall lanky 17-year-old, conspicuously full thick wavy dark ash-brown mop, Sasha's nose and eyebrow structure, relaxed eyes, sleepy half-smile. Keep the warm-gray hoodie with pushed-up sleeves, faded teal jeans, cream socks. Preserve pose, room, light and safe area; no facial hair.` |
| Перепутаны стороны | `Restore the physical room: north door with calendar immediately west of it; south headboard with carpet above; east window and desk; west bedside shelf. Looking north, window/desk are screen-right; looking south, they are screen-left and the shelf is screen-right. Preserve the attached background camera; do not mirror the entire image or relocate objects.` |
| Изменились дверь / календарь | `Match the attached door-wall background: east-jamb hinges, inward-opening door held at about 40 degrees, calendar immediately west of the west jamb with the same gap. Preserve the portrait 26:34 cream pad, thin red header, two binding holes and one central nail. Page entirely blank. Preserve framing, light and all accepted objects.` |
| Свет сменил сторону | `Restore one dim warm early morning: daylight from the physical east window, weaker warm corridor light through the north door, desk lamp off. Window light is screen-right looking north and screen-left looking south. Preserve the approved exposure, album grading and soft paper-layer shadows.` |
| Слишком гладко / объёмно | `Restore matte multilayer paper collage: visible fibers, uneven cut/torn edges, thin cream fiber rims, shallow soft contact shadows. Keep flat forms and the six-color base palette; no glossy 3D surfaces, black outlines, photographic skin, baked film grain or vignette. Preserve identity, geometry and composition.` |
| Лишний красный: листы / обратный ракурс | `Remove all red, including #D92F2B. Neither the red-striped sock prop nor calendar is visible here. Replace accidental red with the appropriate accepted base-palette color; preserve character, room and paper texture.` |
| Лишний красный: дверь / Костя / календарь | `Keep #D92F2B only on the existing calendar's thin header. Remove every other red area using the accepted six-color base palette. Do not add a sock or change the room, character, lighting or framing.` |
| Лишний красный / зелёный ореол у носка | `Keep #D92F2B only on the single cuff stripe of the one mustard sock. Keep the technical background uniformly #00B140 for removal. Remove other red, green spill and any shadow on the green; retain paper fibers and internal contact shadows.` |
| Надписи / сетка / эффекты | `Remove all text, letters, numerals, pseudo-writing, logos, watermarks, arrows and drawn effects. Calendar page entirely blank, no grid or ruling. Book/notebook covers and clock dial blank, no ticks or numerals. Keep only the clock's two plain hands, calendar mounting details and physical carpet/blanket patterns. Preserve the accepted scene.` |
| Важное в зоне субтитров | `Keep faces, hair silhouettes, hands, feet and meaningful objects within x=96..1440, y=128..752 on the 1536x1024 canvas. Leave y=820..1023 as unimportant background/floor/blanket and y=753..819 as breathing room. Scale intact sheet views instead of cropping feet. Preserve identity and perspective; never draw these guides.` |

## 7. Проверяемый чек-лист приёмки

ТЗ можно проверить по тексту; визуальные пункты отмечать только после генерации и просмотра. Наличие промтов не означает доказанного совпадения изображений.

- [ ] Ровно восемь канонических исходников по таблице: реальный PNG-формат и размер 1536×1024, а не только расширение. p1 использует задник 1.
- [ ] Оба листа показаны пользователю, получено явное «ок» до задников и сцен. Зафиксированы фактические промты, результаты и версии референсов.
- [ ] Каждый лист: три целые фигуры и небольшой портрет, все руки/ступни видны, нет разрезания на детали куклы и подписей.
- [ ] Саша на листе и в p4: 12 лет, худой, тёмно-русые растрёпанные волосы с вихром спереди на его правой стороне, сведённые брови, тени под серьёзными глазами, усталый взрослый взгляд, оливковая футболка с карманом, серые пижамные штаны, босиком (в p4 ноги закрыты одеялом).
- [ ] Костя на листе и в p2: 17 лет, высокий худощавый, пышная копна, сходство носа и бровей с Сашей, серая худи с закатанными рукавами, бирюзовые джинсы, кремовые носки, без обуви/бороды.
- [ ] Единый материал: различимые волокна, неровные края, мягкие тени между слоями, тёплая семейная окраска; нет встроенных плёночного зерна, виньетки и эффектов.
- [ ] Одна физическая комната: дверь напротив изголовья, календарь западнее двери, окно/стол на восточной стене, ковёр над изголовьем; полка и мелочи соответствуют общему плану, новых предметов нет.
- [ ] При наложении задник 1/p2 совпадают по углам дверной коробки, календарю, окну, столу, горизонту. Те же восточные петли и угол около 40°; Костя не пересекает створку.
- [ ] При наложении задник 2/p4 совпадают по изголовью, ковру/бахроме, полке, занавеске; окно слева, полка справа, дверь/календарь не перенесены на стену ковра.
- [ ] В p3 тот же блок 26:34, тонкая шапка, два отверстия, один гвоздь, соседний косяк справа с правильным промежутком. Страница совершенно пустая, без сетки и даты.
- [ ] Один момент/свет: окно физически на востоке, лампа выключена; в A свет окна справа, в B слева, без смены температуры и экспозиции.
- [ ] Базовая палитра соблюдена везде; красный #D92F2B только на полоске носка и шапке календаря при их наличии. На листах, заднике 2 и p4 красного нет.
- [ ] p0 — один носок на ровном #00B140 без градиента, зелёного ореола и внешней тени. После удаления фона сохранены волокна/полоска; зелёный не попадает в монтаж.
- [ ] На всех исходниках важное внутри x=96…1440, y=128…752; нижние 20% (y=820…1023) свободны от лиц, рук, ступней и значимых предметов. На листах ноги не обрезаны.
- [ ] Центральный кроп 1536×864 (y=80…943) сохраняет важное действие и свободную нижнюю зону. Конечные положения наездов дополнительно проверены на перекрытие субтитрами.
- [ ] Нет букв, цифр, псевдотекста, логотипов, водяных знаков, стрелок и рисованных эффектов; осмотрены обложки, часы, календарь, одежда. Орнамент ковра и клетка одеяла только рисунок материала.
- [ ] Каждый из восьми промтов самостоятелен с перечисленными вложениями; нет «как выше», невставленного STYLE, пропущенных описаний героя/палитры/света/безопасной зоны.
- [ ] Перед сборкой записана озвучка; её реальная длина/паузы задают монтаж. Реплики сохранены, предварительные 16 секунд не выданы за замер. Дата, субтитры, эффекты и движение добавлены кодом после приёмки изображений.
