# Правки и дозаказ кадров: ролик 01 «Кассеты», часть 1

Это короткий файл правок к уже сделанному. Правила и стиль те же: [codex-video-01-full.md](codex-video-01-full.md) (разделы 1, 3, 4 и 7). Каждый промт самодостаточный: вставляй целиком в `image_gen`, вложения в блоке Attachments (пути относительно `channels/chto-esli/video-01/assets/`).


Что нужно: **2 переделки** с новым именем `-v2` (4 новых кадра эпох 1–2 уже пришли из Codex и подключены в монтаж):
- `e1_school_board` (Саша босиком в школе);
- `e2_try_teacher` (у соседа Саши такая же причёска, зритель путает).

Старые файлы не перезаписывай и не удаляй.

Каждый кадр делай в 2 пробах, лучший сохрани под именем из заголовка, вторую пробу не сохраняй. Ничего не перегенерируй сверх этого списка. Запиши в `video-01/generation-log-v5.json` (id, файл, вложения, число проб, реальный размер). После второго кадра остановись, перечисли файлы с размерами и что вышло хуже ожидаемого.

## e1_school_board-v2 → `shots/e1_school_board-v2.png`

Что это: «Сколько будет три пятых плюс две седьмых — ты не знаешь»

```text
Asset: shots/e1_school_board.png, a finished full scene. Classroom: Sasha stands at the blank blackboard holding a piece of chalk, shoulders slumped; the teacher sits at her desk watching; the class is seen only from behind. Morning light.

Correction: REDO of the existing shots/e1_school_board.png (keep that composition, only fix this): in the first version Sasha stands barefoot at school. In this version he wears school shoes (dark brown shoes, gray socks). Everything else stays the same.

Characters (identity must match the attached sheets; the text is the fallback):
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 12 (year 2005): small, thin boy. Home: olive T-shirt with one chest pocket, warm gray trousers, barefoot or in socks. School: cream shirt, warm gray trousers. Outdoors: olive windbreaker.
- Teacher, 55: gray bun, round glasses, olive cardigan, strict but not unkind.

Attachments:
- Input image 1: bg/bg_classroom-v2.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/sasha_ages_sheet.png, approved character/props reference (identity, costume and proportions must match)
- Input image 3: sheets/supporting_cast_sheet.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

## e2_try_teacher-v2 → `shots/e2_try_teacher-v2.png`

Что это: Попытка 2: учителю про интернет, «Садись, два»

```text
Asset: shots/e2_try_teacher.png, a finished full scene. Classroom: the teacher at her desk points firmly at Sasha; Sasha stands by his desk; the whole class has turned to look.

Correction: REDO of the existing shots/e2_try_teacher.png (keep that composition, only fix this): in the first version a child in the front row has tousled brown hair with a cowlick like Sasha's, which confuses the viewer. In this version the seated classmates clearly differ from Sasha: one boy with short light-blond hair, one girl with a ponytail, one boy with short black hair, one girl with a bob. Only Sasha has the tousled brown hair with a cowlick. Sasha wears school shoes.

Characters (identity must match the attached sheets; the text is the fallback):
- Teacher, 55: gray bun, round glasses, olive cardigan, strict but not unkind.
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 12 (year 2005): small, thin boy. Home: olive T-shirt with one chest pocket, warm gray trousers, barefoot or in socks. School: cream shirt, warm gray trousers. Outdoors: olive windbreaker.

Attachments:
- Input image 1: bg/bg_classroom-v2.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/supporting_cast_sheet.png, approved character/props reference (identity, costume and proportions must match)
- Input image 3: sheets/sasha_ages_sheet.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```
