# ТЗ второй минуты ролика 01: пять изображений

Продолжение [codex-pilot-01.md](codex-pilot-01.md). Раскадровка и озвучка: [video-01-minute-02.md](video-01-minute-02.md). Формат и правила те же, что в пилоте: бумажный коллаж, палитра из шести цветов, красный `#D92F2B` только на названном предмете (здесь это магнит на холодильнике), без текста и цифр, нижняя пятая кадра свободна. Лист мамы 1536×1024, все кадры сцен 16:9, 2560×1440 (целый кадр, без обрезки).

Пути относительны к `channels/chto-esli/video-01/assets/`. Существующие файлы не перезаписывать: пробные версии сохранять рядом с суффиксом.

## Порядок

1. **`mama_sheet`.** Сгенерировать и показать мне. Дальше только после моего «ок» (мама должна быть одинаковой во всех кадрах и в следующих минутах).
2. **`bg_kitchen`.** Задник, показать мне. Вторым ходом после него остальные три можно делать подряд.
3. `k_soup`, `k_sasha_table`, `k_mama_bread`.

Если Codex не принимает вложения, сообщи мне: я перепишу промты 3–5 с описанием героев прямо в тексте.

## Вложения

| № | Файл | Вложения по порядку |
|---|---|---|
| 1 | `sheets/mama_sheet.png` | 1: `sheets/sasha_sheet.png` |
| 2 | `bg/bg_kitchen.png` | 1: `bg/bg_door_wall.png` (только материал и свет) |
| 3 | `shots/k_soup.png` | 1: `sheets/mama_sheet.png`; 2: `bg/bg_kitchen.png` |
| 4 | `shots/k_sasha_table.png` | 1: `sheets/sasha_sheet.png`; 2: `sheets/mama_sheet.png`; 3: `bg/bg_kitchen.png` |
| 5 | `shots/k_mama_bread.png` | 1: `sheets/mama_sheet.png`; 2: `shots/k_sasha_table.png`; 3: `bg/bg_kitchen.png` |

## Карта кухни (камера A)

Условные координаты кухни. Стрелки и подписи в картинки не попадают.

```text
            ЮГ (окно, стол, табуреты)
   З  ┌──────────────────────────────┐  В
   ХОЛ│ холодильник   ОКНО    прилавок│ ПРИЛАВОК
   ИЛЬ│ + магнит      СТОЛ    плита   │ (доска, чайник,
   НИК│                       чайник  │  газовая плита)
      └──────────────────────────────┘
            СЕВЕР: камера A у двери, смотрит на юг
```

Холодильник слева в кадре, окно и стол по центру, прилавок справа. В кадре со столом Саша сидит на ближнем табурете, мама стоит справа у прилавка.

## Промты

Каждый блок копировать целиком. Полные ограничения повторены намеренно.

### 1. Мама → `sheets/mama_sheet.png`

Вложения: Лист Саши `sheets/sasha_sheet.png`: материал, палитра, родство лиц.

```text
Asset: sheets/mama_sheet.png, Mama character design sheet.

Input image 1: sheets/sasha_sheet.png. Use the approved Sasha sheet as paper material, palette, rendering and family-face reference (nose, eyebrow structure). Do NOT depict Sasha.

Composition: three intact full-body views of the SAME woman side by side: front, left-facing profile, back, at equal scale, relaxed standing, complete hands and slippered feet visible. Match the compact layout of the attached Sasha sheet, figures around x=400, 620, 845, their entire silhouettes within y=220..680. Add a smaller front head-and-shoulders portrait around x=1150, y=420 showing eyes, hair clip and the neckline. All artwork, including the portrait and local shadows, must fit within y=200..700, leaving broad cream margins above and below. Uniformly scale intact figures to fit; never crop hair or feet. One unified sheet, no comic panels, view labels, dividers, detached limbs or props. Plain cream #F1E6CF paper background with soft local paper shadows; entire bottom 30 percent empty cream. She is an adult, clearly taller than a 12-year-old boy; do not infer height from the sheet scale.

Mama: an original 38-year-old woman, Sasha's mother, of medium build, with a warm, slightly tired face. Shoulder-length dark chestnut hair (brick-brown and warm-gray paper) pulled back and held by one plain mustard hair clip at the back. Large kind dark eyes, faint smile lines at the corners, the same underlying nose and eyebrow shape as Sasha, small straight nose, a gentle small mouth. Warm cream paper skin. Clothes: a soft housecoat of faded olive-green with a small mustard flower material pattern, a plain cream apron over it, faded teal slippers. No jewelry, no glasses. Preserve age, face, hair and clothing exactly across all pictures.

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. The only permitted red is #D92F2B, exclusively on the small sea-themed fridge magnet when that magnet is visible.

Red rule: no red #D92F2B anywhere. Soft upper-left illumination reveals shallow paper layers, without any room backdrop.

Output/composition: one opaque PNG, exactly 1536x1024 pixels, landscape 3:2. Keep all faces, hair silhouettes, hands, feet and meaningful objects entirely within x=96..1440 and y=128..752. The lowest 20 percent, y=820..1023, contains only unimportant background, floor or blanket, with no faces, hands, feet or significant props. Leave y=753..819 as extra breathing room. The central 16:9 crop keeps x=0..1535, y=80..943; essential action must survive this crop and a mild push-in. These coordinates are instructions; never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. The oilcloth check, curtain trim and floor pattern are material patterns, not annotations. The magnet carries no lettering. No additional people, props, modern devices, brands, blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### 2. Задник: кухня → `bg/bg_kitchen.png`

Вложения: Задник `bg/bg_door_wall.png`: материал, палитра, свет.

```text
Asset: bg/bg_kitchen.png, empty kitchen background and master plate. No people.

Input image 1: bg/bg_door_wall.png. Use only as the paper material, palette, soft cream-mustard morning light and album-grading reference. Do NOT copy the bedroom layout.

Physical room, not screen coordinates: a modest Russian apartment kitchen, September 2005, same family and same warm album grading as the bedroom plates. West wall: one cream-and-warm-gray rounded refrigerator of the early 2000s, with exactly one small round paper magnet at about adult eye height: a sea-themed magnet (a stylized wave and a lifebuoy ring), the ring red #D92F2B and cream, the only red in the picture. South wall: one window with a plain cream curtain trimmed in brick brown, soft mustard-cream morning daylight entering only through it; under the window a wooden kitchen table covered with a mustard-and-cream checked oilcloth that hangs a little over the edges, two plain wooden stools tucked at the near side. East wall: a counter with a blank wooden cutting board (no bread yet), a plain faded-teal kettle and a plain warm-gray gas stove. Lower third of the walls: a muted brick-brown band. Floor: olive-and-cream paper-strip linoleum. No other furniture, decorations, calendar or clock.

Camera A (kitchen master): fixed wide view from the doorway, lens about 1.3 m above the floor, looking south, natural roughly 35 mm-equivalent perspective. Refrigerator screen-left with its magnet clearly visible, window and table centered, counter and stove screen-right. Everything meaningful above 70 percent of the height; bottom fifth only quiet floor. Lock framing, perspective and object positions for all later kitchen shots.

Lighting: dim early morning, soft cream-mustard daylight only through the south window, weaker warm light from the doorway behind the camera. Same exposure and warm album grading as the bedroom; no additional light source or drawn light beam.

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. The only permitted red is #D92F2B, exclusively on the small sea-themed fridge magnet when that magnet is visible.

Red rule: #D92F2B only on the lifebuoy ring of the fridge magnet, nowhere else. One complete finished room illustration.

Output/composition: one opaque PNG, exactly 2560x1440 pixels, landscape 16:9. The whole frame is used, nothing is cropped later. If the tool cannot produce exactly 2560x1440, produce the largest landscape 16:9 image it allows (never smaller than 1920x1080). Keep all faces, hair silhouettes, hands and meaningful objects entirely within x=10 to 94 percent of the width and y=7 to 70 percent of the height. The lowest 20 percent of the height contains only unimportant background, floor or oilcloth, with no faces, hands or significant props; leave the band between 70 and 80 percent as breathing room. Essential action must survive a push-in up to 1.5x. These proportions are instructions; never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. The oilcloth check, curtain trim and floor pattern are material patterns, not annotations. The magnet carries no lettering. No additional people, props, modern devices, brands, blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### 3. Суп и рука → `shots/k_soup.png`

Вложения: `sheets/mama_sheet.png`: рукав и рука; `bg/bg_kitchen.png`: стол, клеёнка, окно, свет.

```text
Asset: shots/k_soup.png, first-person shot at the kitchen table.

Input image 1: sheets/mama_sheet.png. Use only for the housecoat sleeve, her hand and paper material. Do NOT show her face.

Input image 2: bg/bg_kitchen.png. Use for the exact oilcloth, table, window light and wall finish.

Scene: Sasha's point of view, eye level just above the table edge. In the middle-low part of the frame stands a plain cream bowl of mustard-colored soup with one small olive-green leaf on top and a faint paper-cut steam curl, on the mustard-and-cream checked oilcloth. From the upper right, a woman's forearm in the faded olive housecoat sleeve with the small mustard flower pattern and her cream paper hand holding a plain warm-gray spoon extends toward the camera, offering the spoon. Only the forearm and hand are visible: no face, no body, no second person. Behind the table: a simplified cream wall with the brick-brown lower band and a corner of the window with the cream curtain, no clutter. The bowl, hand and spoon above y=752; bottom fifth only quiet oilcloth.

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. The only permitted red is #D92F2B, exclusively on the small sea-themed fridge magnet when that magnet is visible.

Red rule: no red #D92F2B visible (the magnet is out of frame).

Output/composition: one opaque PNG, exactly 2560x1440 pixels, landscape 16:9. The whole frame is used, nothing is cropped later. If the tool cannot produce exactly 2560x1440, produce the largest landscape 16:9 image it allows (never smaller than 1920x1080). Keep all faces, hair silhouettes, hands and meaningful objects entirely within x=10 to 94 percent of the width and y=7 to 70 percent of the height. The lowest 20 percent of the height contains only unimportant background, floor or oilcloth, with no faces, hands or significant props; leave the band between 70 and 80 percent as breathing room. Essential action must survive a push-in up to 1.5x. These proportions are instructions; never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. The oilcloth check, curtain trim and floor pattern are material patterns, not annotations. The magnet carries no lettering. No additional people, props, modern devices, brands, blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### 4. Саша за столом → `shots/k_sasha_table.png`

Вложения: `sheets/sasha_sheet.png`: Саша; `sheets/mama_sheet.png`: мама на заднем плане; `bg/bg_kitchen.png`: точная камера и фон.

```text
Asset: shots/k_sasha_table.png, Sasha at the kitchen table.

Input image 1: sheets/sasha_sheet.png: the hero. Preserve face, cowlick, outfit.

Input image 2: sheets/mama_sheet.png: the mother in the background. Preserve face, hair clip, housecoat, apron.

Input image 3: bg/bg_kitchen.png: exact camera, framing, table, oilcloth, fridge, window and light. Do not move any fixed object.

Sasha: the same original 12-year-old boy as in the attached sheet: slim, small, an unmistakably adult, tired, watchful gaze, messy dark ash-brown hair with one cowlick at his front-right hairline, faint under-eye shadows, slightly drawn-together eyebrows, faded olive-green T-shirt with one chest pocket, light warm-gray pajama pants. Preserve everything.

Mama is described in her sheet: in this picture she is small in the background at the counter on the screen-right, seen in profile, cutting a loaf of bread on the cutting board with a plain knife; she is looking down at the bread and not at the camera.

Scene: use the exact Camera A of bg_kitchen. Sasha sits on the near-side stool at the checked table, centered, facing the camera in a slight three-quarter view, both hands flat on the oilcloth next to an empty plain cream bowl. His expression is calm and tense: jaw set, eyes wide and old, looking slightly past the camera. The refrigerator with its magnet stays screen-left as in the background plate. Faces and hands above y=752; bottom fifth only quiet floor.

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. The only permitted red is #D92F2B, exclusively on the small sea-themed fridge magnet when that magnet is visible.

Red rule: #D92F2B only on the lifebuoy ring of the fridge magnet, nowhere else.

Output/composition: one opaque PNG, exactly 2560x1440 pixels, landscape 16:9. The whole frame is used, nothing is cropped later. If the tool cannot produce exactly 2560x1440, produce the largest landscape 16:9 image it allows (never smaller than 1920x1080). Keep all faces, hair silhouettes, hands and meaningful objects entirely within x=10 to 94 percent of the width and y=7 to 70 percent of the height. The lowest 20 percent of the height contains only unimportant background, floor or oilcloth, with no faces, hands or significant props; leave the band between 70 and 80 percent as breathing room. Essential action must survive a push-in up to 1.5x. These proportions are instructions; never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. The oilcloth check, curtain trim and floor pattern are material patterns, not annotations. The magnet carries no lettering. No additional people, props, modern devices, brands, blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### 5. Мама режет хлеб → `shots/k_mama_bread.png`

Вложения: `sheets/mama_sheet.png`: мама; `shots/k_sasha_table.png`: утверждённая кухня и мама; `bg/bg_kitchen.png`: прилавок, окно, свет.

```text
Asset: shots/k_mama_bread.png, Mama cutting bread, closer.

Input image 1: sheets/mama_sheet.png: the hero of this picture. Preserve face, hair clip, housecoat, apron, age.

Input image 2: shots/k_sasha_table.png: approved kitchen rendering and Mama's look in this scene; keep the same world.

Input image 3: bg/bg_kitchen.png: counter, cutting board, window and light.

Mama: an original 38-year-old woman, Sasha's mother, of medium build, with a warm, slightly tired face. Shoulder-length dark chestnut hair (brick-brown and warm-gray paper) pulled back and held by one plain mustard hair clip at the back. Large kind dark eyes, faint smile lines at the corners, the same underlying nose and eyebrow shape as Sasha, small straight nose, a gentle small mouth. Warm cream paper skin. Clothes: a soft housecoat of faded olive-green with a small mustard flower material pattern, a plain cream apron over it, faded teal slippers. No jewelry, no glasses. Preserve age, face, hair and clothing exactly across all pictures.

Scene: a closer medium shot of Mama at the counter, torso and head, three-quarter view, at the cutting board with a round loaf of bread and a plain knife in her hands. She has just turned her head toward the camera with a light, puzzled, kind look, eyebrows slightly raised, mouth slightly open as if she is about to ask a question. The faded teal kettle and part of the south window with the cream curtain are behind her. Face, hands and bread above y=752; bottom fifth only quiet counter and floor.

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. The only permitted red is #D92F2B, exclusively on the small sea-themed fridge magnet when that magnet is visible.

Red rule: no red #D92F2B visible.

Output/composition: one opaque PNG, exactly 2560x1440 pixels, landscape 16:9. The whole frame is used, nothing is cropped later. If the tool cannot produce exactly 2560x1440, produce the largest landscape 16:9 image it allows (never smaller than 1920x1080). Keep all faces, hair silhouettes, hands and meaningful objects entirely within x=10 to 94 percent of the width and y=7 to 70 percent of the height. The lowest 20 percent of the height contains only unimportant background, floor or oilcloth, with no faces, hands or significant props; leave the band between 70 and 80 percent as breathing room. Essential action must survive a push-in up to 1.5x. These proportions are instructions; never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. The oilcloth check, curtain trim and floor pattern are material patterns, not annotations. The magnet carries no lettering. No additional people, props, modern devices, brands, blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

## Быстрые правки

| Что не так | Что дописать в промт |
|---|---|
| Мама слишком молодая или слишком старая | Her face must read as exactly 38: a few smile lines, no gray hair, no wrinkles beyond that. |
| Мама на кадрах не похожа на лист | Match face shape, hair clip, housecoat flower pattern and apron exactly to input image 1. |
| В кадре текст или цифры на магните | Remove all lettering; the magnet is only a stylized wave and a lifebuoy ring. |
| Красный не только на магните | The only red #D92F2B is the lifebuoy ring on the fridge magnet; make everything else brick, mustard, cream, olive, teal or warm gray. |
| Кухня разная в разных кадрах | Use input image 3 as the exact camera and layout; do not move the fridge, window, table or counter. |
| Нижняя пятая занята | Move faces, hands and key objects up above 70 percent of the height; leave the lowest fifth only floor or oilcloth. |

## Чек-лист приёмки

- [ ] Мама на листе и в кадрах 4–5 узнаётся как один человек (заколка, халат, фартук).
- [ ] В кухонных кадрах холодильник, окно, стол и прилавок на тех же местах.
- [ ] Красный есть только на спасательном круге магнита и нигде больше.
- [ ] Ни в одном кадре нет букв и цифр.
- [ ] В `k_soup` нет лица взрослого, только рука и рукав.
- [ ] Лица, руки и ключевые предметы выше 70% высоты кадра.
- [ ] Лист мамы 1536×1024; кадры сцен 16:9 (2560×1440, не меньше 1920×1080); фон непрозрачный.
