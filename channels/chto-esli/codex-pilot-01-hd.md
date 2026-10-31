# ТЗ: пять плит пилота в 16:9, Full HD

Зачем: плиты пилота 1536×1024, при зуме до 2,6× картинка мылится. Перегенерируем их в 2560×1440 по утверждённым картинкам, ничего не придумывая заново.

## Как работать

1. Для каждой плиты вложи **одну** картинку из `video-01/assets/hd-refs/` (это утверждённая плита, обрезанная до центрального 16:9, 1536×864) как Input image 1.
2. Вставь промт ниже. Это перерисовка, а не новый кадр: композиция, лица, позы, цвета, свет должны остаться теми же, меняется только чёткость и разрешение.
3. Сохрани результат как `<имя>_hd.png` рядом с оригиналом (`shots/p4_sasha_hd.png` и т.д.). Оригиналы не трогай.
4. Начни с `p4_sasha`: покажи мне, сверим лицо с утверждённым, потом остальные четыре.

Носок (`p0_sock`) не переделываем: он маленький и летит, зума на нём нет. Листы Саши и Кости тоже: в ролик они не попадают.

## Порядок и вложения

| № | Результат | Вложение (Input image 1) | Приоритет |
|---|---|---|---|
| 1 | `shots/p4_sasha_hd.png` | `hd-refs/p4_sasha.png` | самый сильный зум |
| 2 | `shots/p2_kostya_hd.png` | `hd-refs/p2_kostya.png` | зум 2,6–2,7× на волосах |
| 3 | `shots/p3_calendar_hd.png` | `hd-refs/p3_calendar.png` | средний |
| 4 | `bg/bg_door_wall_hd.png` | `hd-refs/bg_door_wall.png` | слабый зум |
| 5 | `bg/bg_carpet_wall_hd.png` | `hd-refs/bg_carpet_wall.png` | слабый зум |

### 1. p4_sasha → `shots/p4_sasha_hd.png`

Вложения: `hd-refs/p4_sasha.png`.

```text
Asset: shots/p4_sasha_hd.png, a higher-resolution re-render of an approved picture: Sasha sitting up in bed, close view; this picture gets the strongest push-in (up to 2.6x), so eyes, eyebrows, lashes, hair strands and shirt fibers must be crisp.

Input image 1: the approved version of this exact picture (already the final 16:9 framing). Re-render it as a sharper master. Keep the composition, camera, every object position, the character's face, hair, expression, pose and clothing, the colors, the lighting and the paper-collage look identical to Input image 1. Do not redesign, reinterpret, restyle, add or remove anything. Change only the level of detail: crisp cut paper edges, clearly visible natural paper fibers, fine ink-like details in eyes and mouth, clean small shapes. Nothing blurred, smoothed or painterly.

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. The only permitted red is #D92F2B, exclusively on a sock cuff stripe or a calendar header when that object is visible.

Output/composition: one opaque PNG, exactly 2560x1440 pixels, landscape 16:9 (if the tool cannot do exactly that, the largest 16:9 it allows, never smaller than 1920x1080). Use exactly the same framing as Input image 1, which is already 16:9: nothing added at the edges, nothing cropped, every object at the same relative position and size. The lowest 20 percent of the height keeps the same quiet content as in Input image 1. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers and calendar pages are completely blank, without grids or ruling. The clock dial has no numerals or ticks; only its two plain hands are allowed. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people, props, modern devices, brands, blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### 2. p2_kostya → `shots/p2_kostya_hd.png`

Вложения: `hd-refs/p2_kostya.png`.

```text
Asset: shots/p2_kostya_hd.png, a higher-resolution re-render of an approved picture: Kostya in the bedroom doorway; the hair is pushed in on (up to 2.7x), so hair strands, face and the door edge must be crisp.

Input image 1: the approved version of this exact picture (already the final 16:9 framing). Re-render it as a sharper master. Keep the composition, camera, every object position, the character's face, hair, expression, pose and clothing, the colors, the lighting and the paper-collage look identical to Input image 1. Do not redesign, reinterpret, restyle, add or remove anything. Change only the level of detail: crisp cut paper edges, clearly visible natural paper fibers, fine ink-like details in eyes and mouth, clean small shapes. Nothing blurred, smoothed or painterly.

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. The only permitted red is #D92F2B, exclusively on a sock cuff stripe or a calendar header when that object is visible.

Output/composition: one opaque PNG, exactly 2560x1440 pixels, landscape 16:9 (if the tool cannot do exactly that, the largest 16:9 it allows, never smaller than 1920x1080). Use exactly the same framing as Input image 1, which is already 16:9: nothing added at the edges, nothing cropped, every object at the same relative position and size. The lowest 20 percent of the height keeps the same quiet content as in Input image 1. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers and calendar pages are completely blank, without grids or ruling. The clock dial has no numerals or ticks; only its two plain hands are allowed. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people, props, modern devices, brands, blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### 3. p3_calendar → `shots/p3_calendar_hd.png`

Вложения: `hd-refs/p3_calendar.png`.

```text
Asset: shots/p3_calendar_hd.png, a higher-resolution re-render of an approved picture: close-up of the wall calendar with a blank page; paper fibers and the torn bottom edge must be crisp. The calendar page stays completely blank.

Input image 1: the approved version of this exact picture (already the final 16:9 framing). Re-render it as a sharper master. Keep the composition, camera, every object position, the character's face, hair, expression, pose and clothing, the colors, the lighting and the paper-collage look identical to Input image 1. Do not redesign, reinterpret, restyle, add or remove anything. Change only the level of detail: crisp cut paper edges, clearly visible natural paper fibers, fine ink-like details in eyes and mouth, clean small shapes. Nothing blurred, smoothed or painterly.

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. The only permitted red is #D92F2B, exclusively on a sock cuff stripe or a calendar header when that object is visible.

Output/composition: one opaque PNG, exactly 2560x1440 pixels, landscape 16:9 (if the tool cannot do exactly that, the largest 16:9 it allows, never smaller than 1920x1080). Use exactly the same framing as Input image 1, which is already 16:9: nothing added at the edges, nothing cropped, every object at the same relative position and size. The lowest 20 percent of the height keeps the same quiet content as in Input image 1. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers and calendar pages are completely blank, without grids or ruling. The clock dial has no numerals or ticks; only its two plain hands are allowed. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people, props, modern devices, brands, blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### 4. bg_door_wall → `bg/bg_door_wall_hd.png`

Вложения: `hd-refs/bg_door_wall.png`.

```text
Asset: bg/bg_door_wall_hd.png, a higher-resolution re-render of an approved picture: empty bedroom wall with the doorway, no people; carpet ornament, door, wall paper fibers must be crisp.

Input image 1: the approved version of this exact picture (already the final 16:9 framing). Re-render it as a sharper master. Keep the composition, camera, every object position, the character's face, hair, expression, pose and clothing, the colors, the lighting and the paper-collage look identical to Input image 1. Do not redesign, reinterpret, restyle, add or remove anything. Change only the level of detail: crisp cut paper edges, clearly visible natural paper fibers, fine ink-like details in eyes and mouth, clean small shapes. Nothing blurred, smoothed or painterly.

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. The only permitted red is #D92F2B, exclusively on a sock cuff stripe or a calendar header when that object is visible.

Output/composition: one opaque PNG, exactly 2560x1440 pixels, landscape 16:9 (if the tool cannot do exactly that, the largest 16:9 it allows, never smaller than 1920x1080). Use exactly the same framing as Input image 1, which is already 16:9: nothing added at the edges, nothing cropped, every object at the same relative position and size. The lowest 20 percent of the height keeps the same quiet content as in Input image 1. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers and calendar pages are completely blank, without grids or ruling. The clock dial has no numerals or ticks; only its two plain hands are allowed. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people, props, modern devices, brands, blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### 5. bg_carpet_wall → `bg/bg_carpet_wall_hd.png`

Вложения: `hd-refs/bg_carpet_wall.png`.

```text
Asset: bg/bg_carpet_wall_hd.png, a higher-resolution re-render of an approved picture: empty bedroom wall with the carpet; ornament edges and paper fibers must be crisp.

Input image 1: the approved version of this exact picture (already the final 16:9 framing). Re-render it as a sharper master. Keep the composition, camera, every object position, the character's face, hair, expression, pose and clothing, the colors, the lighting and the paper-collage look identical to Input image 1. Do not redesign, reinterpret, restyle, add or remove anything. Change only the level of detail: crisp cut paper edges, clearly visible natural paper fibers, fine ink-like details in eyes and mouth, clean small shapes. Nothing blurred, smoothed or painterly.

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. The only permitted red is #D92F2B, exclusively on a sock cuff stripe or a calendar header when that object is visible.

Output/composition: one opaque PNG, exactly 2560x1440 pixels, landscape 16:9 (if the tool cannot do exactly that, the largest 16:9 it allows, never smaller than 1920x1080). Use exactly the same framing as Input image 1, which is already 16:9: nothing added at the edges, nothing cropped, every object at the same relative position and size. The lowest 20 percent of the height keeps the same quiet content as in Input image 1. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers and calendar pages are completely blank, without grids or ruling. The clock dial has no numerals or ticks; only its two plain hands are allowed. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people, props, modern devices, brands, blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

## Чек-лист приёмки

- [ ] Размер 2560×1440 (или самый большой 16:9, не меньше 1920×1080), PNG, фон непрозрачный.
- [ ] Лицо, волосы, одежда и поза те же, что в утверждённой плите (сверяю с оригиналом).
- [ ] Каждый предмет на том же месте, ничего не добавилось на краях.
- [ ] Нет текста и цифр; календарь пустой; красный только на шапке календаря.
- [ ] Бумажная фактура чёткая, не «замыленная».
