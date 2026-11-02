# ТЗ для Codex: один новый кадр под начало v6 (`h_sasha_hands_cu`)

Нужен под строку «Ты смотришь на свои руки. Маленькие. Палец в пластыре.» (0:20 в [video-01-opening-v6-plan.md](video-01-opening-v6-plan.md)). Формат — как в [codex-video-01-prompts.md](codex-video-01-prompts.md): `cu` = крупный план 16:9, рисуется сразу крупно. Пути вложений относительно `video-01/assets/`.

Почему «пластырь», а не «ободранные костяшки»: правила канала запрещают кровь и травмы крупным планом («no blood, wounds or weapons»), а это именно крупный план. Пластырь даёт ту же деталь («ребёнок, у которого вечно что-то разбито») без раны.

Сохранить как `shots/h_sasha_hands_cu.png`. Красного в кадре нет.

```text
Asset: shots/h_sasha_hands_cu.png, a close-up master. Extreme close-up of a twelve-year-old boy's two small hands resting palms-down on a mustard-and-cream checked wool blanket, seen from slightly above and filling the upper-middle of the frame. Thin child fingers, short bitten nails, one small clean cream adhesive bandage wrapped around the index finger of the right hand. Olive T-shirt sleeve cuffs enter from the top edge. The fingers are slightly curled, as if he has just woken up and is studying his own hands. Soft morning light from the left. The lowest part of the frame is only blanket checks.

Characters (identity must match the attached sheets; the text is the fallback):
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 12 (year 2005): small, thin boy. Home: olive T-shirt with one chest pocket, warm gray trousers, barefoot or in socks. School: cream shirt, warm gray trousers. Outdoors: olive windbreaker.

Attachments:
- Input image 1: sheets/sasha_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)
- Input image 2: shots/h_sasha_palm.png, approved scene of this morning (keep the blanket checks, the olive T-shirt, the materials and the light)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Close-up master: the subject fills the frame and every detail is drawn at final scale, because the picture will be shown at 1:1 with no further zoom. Fingers, nails, the bandage edge, paper fibers, cut edges and blanket threads are individually crisp. No soft focus, no smoothing, no painterly texture.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. The bandage is a clean cream strip with no stain. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

## Приёмка

- Размер 16:9, без белых полей; по возможности 2560×1440.
- Ладони выше 75 % высоты, нижние 20 % — только клетка пледа.
- Пластырь чистый, без пятна и крови; красного нет.
- Клетка пледа и рукава совпадают с `h_sasha_palm`.
- Движение кодом: дрейф ≤ 1.05×, без зума.
