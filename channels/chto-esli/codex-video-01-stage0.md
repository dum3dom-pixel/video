# Этап 0. Листы персонажей и предметов: ролик 01 «Кассеты»

Ты делаешь картинки для ролика. Все правила: [codex-video-01-full.md](codex-video-01-full.md) (прочитай разделы 1, 3, 4 и 7). Ниже промты только этого этапа. Каждый промт самодостаточный: вставляй его целиком в `image_gen`, вложения указаны в блоке Attachments (пути относительно `channels/chto-esli/video-01/assets/`).

Порядок: делай по одному файлу, сверху вниз. Для каждого листа сделай 2 варианта, выбери лучший под именем из заголовка, второй сохрани с суффиксом `-alt`. Существующие файлы не перезаписывай. Фигуры на листах крупные: не меньше 85% высоты холста.

После последнего файла остановись и напиши:
- список файлов и реальный размер каждого;
- что получилось хуже ожидаемого;
- запись в `video-01/generation-log-v5.json` (id, файл, вложения, число проб, размер).
Дальше не иди, жди моего «ок».

## sasha_ages_sheet → `sheets/sasha_ages_sheet.png`

Что это: Саша в 5 возрастах: 12, 15, 19, 26, 33

```text
Asset: sheets/sasha_ages_sheet.png, a reference sheet. Character lineup of Sasha at five ages standing side by side, all front view, same scale reference, neutral standing pose, arms relaxed: 12 (small boy), 15 (lanky teen), 19 (young man, hair a bit longer), 26 (adult, light stubble), 33 (adult, calm, no stubble). It must be unmistakably the same person: same eyes, brows, nose and cowlick; only age and clothing change. Ages 12 and 33 wear what is described; the middle ones wear the clothes described for their age.

Characters (identity must match the attached sheets; the text is the fallback):
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 12 (year 2005): small, thin boy. Home: olive T-shirt with one chest pocket, warm gray trousers, barefoot or in socks. School: cream shirt, warm gray trousers. Outdoors: olive windbreaker.
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 15 (year 2008): taller and lanky, longer arms and neck, hair a little longer, same cowlick, same too-old gaze. Faded teal sweatshirt or cream shirt, warm gray trousers.
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 18 to 20 (years 2011-2013): lean young man, hair slightly longer, first light shadow on the jaw. Graduation: an oversized warm gray blazer that is too wide in the shoulders. Otherwise a mustard hoodie.
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 26 (year 2019): adult man, narrow face, short hair with the cowlick still alive, light stubble, tired kind eyes. Cream linen shirt with rolled sleeves, warm gray trousers.
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 33 (year 2026): adult man, faint lines at the eyes, short neat hair with the cowlick, no stubble, calm eyes, teal-gray sweater over a cream shirt.

Attachments:
- Input image 1: sheets/sasha_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG on plain cream paper background, landscape 3:2, 1536x1024 or larger. Layout: five full-length front-view figures in one row, left to right in age order 12, 15, 19, 26, 33, every figure about 85 percent of the canvas height. Figures and objects are drawn BIG: together they fill at least 85 percent of the canvas height and most of its width, with only narrow even margins. No scene, no floor line, no props unless listed, no labels, no captions, no numbers.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

## sasha_faces_sheet → `sheets/sasha_faces_sheet.png`

Что это: Лица Саши крупно: 6 голов (12, 15, 19, 26, 31, 33)

```text
Asset: sheets/sasha_faces_sheet.png, a reference sheet. Six large head-and-shoulder portraits of Sasha arranged in a 3x2 grid, front or three-quarter view, same lighting: ages 12, 15, 19, 26, 31, 33 in that order. Same eyes, brows, nose and cowlick in all six; only age marks differ (lanky jaw, stubble, first lines at the eyes). Neutral serious expression.

Characters (identity must match the attached sheets; the text is the fallback):
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 12 (year 2005): small, thin boy. Home: olive T-shirt with one chest pocket, warm gray trousers, barefoot or in socks. School: cream shirt, warm gray trousers. Outdoors: olive windbreaker.
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 15 (year 2008): taller and lanky, longer arms and neck, hair a little longer, same cowlick, same too-old gaze. Faded teal sweatshirt or cream shirt, warm gray trousers.
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 18 to 20 (years 2011-2013): lean young man, hair slightly longer, first light shadow on the jaw. Graduation: an oversized warm gray blazer that is too wide in the shoulders. Otherwise a mustard hoodie.
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 26 (year 2019): adult man, narrow face, short hair with the cowlick still alive, light stubble, tired kind eyes. Cream linen shirt with rolled sleeves, warm gray trousers.
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 31 (year 2024): adult man, lean, hollow-cheeked, a little tired, short hair, light stubble, gray hoodie.
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 33 (year 2026): adult man, faint lines at the eyes, short neat hair with the cowlick, no stubble, calm eyes, teal-gray sweater over a cream shirt.

Attachments:
- Input image 1: sheets/sasha_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG on plain cream paper background, landscape 3:2, 1536x1024 or larger. Layout: six head-and-shoulders portraits in a 3 by 2 grid, each portrait filling its cell almost completely. Figures and objects are drawn BIG: together they fill at least 85 percent of the canvas height and most of its width, with only narrow even margins. No scene, no floor line, no props unless listed, no labels, no captions, no numbers.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

## kostya38_sheet → `sheets/kostya38_sheet.png`

Что это: Костя в 38: лысый, лист по образцу листа Кости

```text
Asset: sheets/kostya38_sheet.png, a reference sheet. Character sheet of Kostya at 38 in the same format as the attached 17-year-old sheet. Calm neutral pose, warm tired eyes, bald head (smooth shaved scalp with cut-paper highlights), light stubble.

Characters (identity must match the attached sheets; the text is the fallback):
- Kostya, 38 (year 2026): the same man grown up: completely bald head, warm tired eyes, the same nose and eyebrows as at 17, light stubble, broader build; olive-and-mustard flannel shirt with rolled sleeves.

Attachments:
- Input image 1: sheets/kostya_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG on plain cream paper background, landscape 3:2, 1536x1024 or larger. Layout: three full-length figures left to right (front view, side view, back view) at identical scale, then one large head-and-shoulders portrait at the right, as tall as the figures. Figures and objects are drawn BIG: together they fill at least 85 percent of the canvas height and most of its width, with only narrow even margins. No scene, no floor line, no props unless listed, no labels, no captions, no numbers.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

## papa_sheet → `sheets/papa_sheet.png`

Что это: Папа, 40 лет, усы подковой

```text
Asset: sheets/papa_sheet.png, a reference sheet. Character sheet of Papa, 40. Calm neutral pose. The moustache must be thick, chestnut and horseshoe-shaped: it is a key recognition feature.

Characters (identity must match the attached sheets; the text is the fallback):
- Papa, 40: stocky, slightly heavy, taller than Mama; broad kind tired face; thick chestnut horseshoe moustache; short dark hair with receding temples; Sasha's nose and brows (by 2008 a few more lines at the eyes, a little gray in the moustache). At home: faded cream sleeveless undershirt under an open olive-and-mustard plaid shirt, warm gray sweatpants, teal slippers, a plain wedding ring.

Attachments:
- Input image 1: sheets/mama_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG on plain cream paper background, landscape 3:2, 1536x1024 or larger. Layout: three full-length figures left to right (front view, side view, back view) at identical scale, then one large head-and-shoulders portrait at the right, as tall as the figures. Figures and objects are drawn BIG: together they fill at least 85 percent of the canvas height and most of its width, with only narrow even margins. No scene, no floor line, no props unless listed, no labels, no captions, no numbers.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

## ded_sheet → `sheets/ded_sheet.png`

Что это: Дед Лёша, ~72 года

```text
Asset: sheets/ded_sheet.png, a reference sheet. Character sheet of Grandfather Lyosha. Calm neutral pose, hands visible, work apron.

Characters (identity must match the attached sheets; the text is the fallback):
- Grandfather Lyosha, about 72: wiry and thin, short gray cropped hair, big ears, gray stubble, round old safety glasses pushed up on the forehead, worn brown work apron over an olive checked shirt, strong veined hands.

Attachments:
- Input image 1: sheets/mama_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG on plain cream paper background, landscape 3:2, 1536x1024 or larger. Layout: three full-length figures left to right (front view, side view, back view) at identical scale, then one large head-and-shoulders portrait at the right, as tall as the figures. Figures and objects are drawn BIG: together they fill at least 85 percent of the canvas height and most of its width, with only narrow even margins. No scene, no floor line, no props unless listed, no labels, no captions, no numbers.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

## lena_sheet → `sheets/lena_sheet.png`

Что это: Лена, 26 лет

```text
Asset: sheets/lena_sheet.png, a reference sheet. Character sheet of Lena. Standing pose with both hands holding a big plain mug in front of her chest; the mug is in the front and side views, and the portrait shows her warm amused look.

Characters (identity must match the attached sheets; the text is the fallback):
- Lena, 26: soft round face, calm amused eyes, shoulder-length warm light-brown hair, a few freckles, oversized faded-teal knitted cardigan, hands always wrapped around a big mug even in the heat.

Attachments:
- Input image 1: sheets/mama_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG on plain cream paper background, landscape 3:2, 1536x1024 or larger. Layout: three full-length figures left to right (front view, side view, back view) at identical scale, then one large head-and-shoulders portrait at the right, as tall as the figures. Figures and objects are drawn BIG: together they fill at least 85 percent of the canvas height and most of its width, with only narrow even margins. No scene, no floor line, no props unless listed, no labels, no captions, no numbers.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

## supporting_cast_sheet → `sheets/supporting_cast_sheet.png`

Что это: Массовка: Димка 12 и 19, Гена, учительница, продавщица

```text
Asset: sheets/supporting_cast_sheet.png, a reference sheet. Lineup of five supporting characters, each a full-length front view at the same scale, neutral pose: Dimka 12, Dimka 19, Gena 14, the teacher, and the market seller shown only as a pair of hands and arms in knitted mitts holding a stack of plain cassettes (no face).

Characters (identity must match the attached sheets; the text is the fallback):
- Dimka, 12: classmate; round face, buzz cut, a huge olive sweater, always chewing something, cheerful shrug.
- Dimka, 19: the same round face grown up, tall, cheap mustard jacket, holding a plain phone (a flat slab in warm dark gray with a blank glowing screen).
- Gena, 14: school bully; big, broad, pale crew cut, brick-brown sweatshirt, heavy brow, scowl.
- Teacher, 55: gray bun, round glasses, olive cardigan, strict but not unkind.
- Market seller, middle-aged woman: fingerless knitted mitts, mustard headscarf; only her hands and arms are visible.

Attachments:
- Input image 1: sheets/sasha_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG on plain cream paper background, landscape 3:2, 1536x1024 or larger. Layout: five figures in one row, left to right in the order listed, each about 85 percent of the canvas height. Figures and objects are drawn BIG: together they fill at least 85 percent of the canvas height and most of its width, with only narrow even margins. No scene, no floor line, no props unless listed, no labels, no captions, no numbers.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

## props_tape_sheet → `sheets/props_tape_sheet.png`

Что это: Двухкассетник, кассета, коробка, маркер

```text
Asset: sheets/props_tape_sheet.png, a reference sheet. Props sheet. (1) A twin-deck cassette recorder from 2005, shown front view and three-quarter view: warm gray plastic body, two cassette doors with clear windows and both reels visible, a row of piano-style keys, exactly one key (record) in red #D92F2B and the others warm gray, two round speakers with faded-teal grille cloth, a carry handle on top. (2) One compact cassette front view and side view: olive body, blank cream label, two windows with reels. (3) A mustard cardboard shoebox with its lid beside it. (4) A dark brown felt-tip marker with cap. No letters or logos on anything.

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. The only permitted red is #D92F2B, exclusively on: the record key of the deck (one single key). No other red anywhere.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG on plain cream paper background, landscape 3:2, 1536x1024 or larger. Layout: the deck takes the left half (two views); right half top row cassette front and side; bottom row shoebox with lid and marker. Figures and objects are drawn BIG: together they fill at least 85 percent of the canvas height and most of its width, with only narrow even margins. No scene, no floor line, no props unless listed, no labels, no captions, no numbers.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

## props_misc_sheet → `sheets/props_misc_sheet.png`

Что это: Мелкие предметы: паяльник, копилка, смартфон, чашки

```text
Asset: sheets/props_misc_sheet.png, a reference sheet. Props sheet. (1) A soldering iron with a wooden handle and a thin metal tip, on a small stand. (2) A candy tin used as a piggy bank, mustard lid with a coin slot, a few coins beside it. (3) A bulky 2005 CRT monitor with a beige-warm-gray tower case, blank teal-glow screen. (4) A plain 2012 smartphone: flat slab in warm dark gray, blank glowing screen, no logo. (5) A big plain mug and a smaller mug. (6) An old round alarm-style wall clock with a blank dial and two plain hands.

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG on plain cream paper background, landscape 3:2, 1536x1024 or larger. Layout: six objects in a 3 by 2 grid, each object large in its cell. Figures and objects are drawn BIG: together they fill at least 85 percent of the canvas height and most of its width, with only narrow even margins. No scene, no floor line, no props unless listed, no labels, no captions, no numbers.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```
