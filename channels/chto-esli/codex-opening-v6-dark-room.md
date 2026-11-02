# ТЗ для Codex: тёмная комната (`bg_room_dark_hd`)

Нужен под 0:00–0:24 в [video-01-opening-v6-plan.md](video-01-opening-v6-plan.md): «Тёмная комната, ковёр на стене, полоска света под дверью. Ты открываешь глаза». Это та же спальня, что `bg_carpet_wall_hd` и `bg_door_wall_hd`, но ночью/перед рассветом, пустая. Запасной вариант без генерации: затемнить дневные фоны кодом (холодный тон, полоска света под дверью слоем). Свежий кадр лучше: свет под дверью и тени нарисованы бумагой, а не наложены.

Сохранить как `bg/bg_room_dark_hd.png`. Красного в кадре нет (красная шапка календаря появляется позже, отдельным кадром).

```text
Asset: bg/bg_room_dark_hd.png, an empty background set. The same bedroom as the attached backgrounds, shown before dawn with the lamp off. The carpet-covered wall and the door wall keep the architecture, furniture positions, parquet and woodwork of the attached sets. The room is dim: muted teal window light falls faintly from the window onto the bed and the floor, and the closed room door has one thin warm mustard strip of light under it, spilling a narrow bright fan across the parquet. The bed is unmade with a checked blanket, a school backpack stands by the desk. Everything else sinks into deep brick-brown and warm gray shadows, but every object stays readable.

Attachments:
- Input image 1: bg/bg_carpet_wall_hd.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: bg/bg_door_wall_hd.png, approved set of this scene (keep its architecture, materials, light and object positions)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation. No black outlines, photographic look, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. No additional pure-white or black flat colors. Night uses the same palette, only darker: mustard strip of light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable.

Output/composition: one opaque PNG, landscape 16:9, an EMPTY set with no people, whole picture to the edges. Use the largest 16:9 size the tool allows (target 2560x1440; never below 1536x864) and report the real size. Eye-level camera from the bed side, the door with its light strip visible in the middle third, a clear open floor area in front of it where characters will later appear, important furniture in the upper 75 percent, the lowest 20 percent calm and quiet. Never draw guides or labels.

Strict exclusions: no people, no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, arrows, motion lines, sparkles or drawn effects. No wall calendar (a calendar is a separate shot), no clock with numerals. Book covers, paper sheets and screens are completely blank. Geometric carpet ornament and blanket checks are material patterns, not annotations. No modern devices, no brands, no blood, wounds or weapons. Scenes are complete finished illustrations.
```

## Приёмка

- Размер 16:9, без белых полей; по возможности 2560×1440.
- Архитектура, ковёр, кровать и дверь совпадают с дневными `bg_carpet_wall_hd` / `bg_door_wall_hd`.
- Полоска света под дверью читается, комната тёмная, но без чёрных заливок; красного нет.
- Нижние 20 % спокойные, людей нет.
