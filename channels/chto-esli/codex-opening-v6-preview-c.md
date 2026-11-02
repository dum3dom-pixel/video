# ТЗ для Codex: превью C (`pv_c_plan`)

Третье превью в Test & Compare к A (`pv_a_deck`) и B (`pv_b_boy`): листок с планом, пункт №7 обведён красным. Текст и красную обводку рисует код, картинка остаётся чистой. Пути вложений относительно `video-01/assets/`. Сохранить как `shots/pv_c_plan.png`.

Что кладёт код (в картинку не рисуется):
- семь строк-пунктов плана на листе, почерком из шрифта канала;
- красный маркер `#D92F2B` обводит седьмую строку (единственное красное на превью);
- титр справа: «ПУНКТ №7» (≤ 3 слов, слова заголовка не повторяет).

Запасной вариант без генерации: взять готовый `shots/e1_plan_sheet.png` и сложить на него то же кодом. Свежий кадр лучше тем, что композиция сразу рассчитана на превью (контраст, место под титр, угол в правом нижнем свободен).

```text
Asset: shots/pv_c_plan.png, a finished full scene. Thumbnail hero image: a wooden desk seen straight from above; one large sheet of cream handmade paper with torn edges fills the left and centre of the frame, tilted about five degrees, with a soft contact shadow. The sheet's surface is completely blank and flat, because code writes the plan lines on it. A small child's hand holds a short pencil at the lower left edge of the sheet. Warm mustard lamp light falls from the upper right; an eraser and a few pencil shavings lie on the desk. Strong readable silhouette: the bright cream sheet against a dark brick-brown desk, readable at the size of a postage stamp. The right third of the frame is plain empty desk for code text.

Characters (identity must match the attached sheets; the text is the fallback):
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 12 (year 2005): small, thin boy. Home: olive T-shirt with one chest pocket, warm gray trousers, barefoot or in socks. School: cream shirt, warm gray trousers. Outdoors: olive windbreaker. Only his small hand and the olive sleeve cuff are visible in this picture.

Attachments:
- Input image 1: sheets/sasha_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)
- Input image 2: shots/e1_plan_sheet.png, approved top-down plan scene (keep the desk, lamp light, paper and pencil materials)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture: the red marker is added by code.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The bottom-right corner stays quiet (YouTube places the duration badge there). The sheet and the hand stay inside the left two thirds; the right third is empty desk. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. No lines, ruling, scribbles or circles on the sheet. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

## Приёмка

- Лист чистый: ни линеек, ни каракулей, ни кругов (всё это кладёт код).
- Лист читается как светлое пятно на тёмном столе при размере 320×180.
- Правая треть пустая под титр, правый нижний угол свободен.
- Красного нет, пластыря и ран нет.
