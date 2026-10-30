# Codex v3: что закинуть и что вставить (готово к копированию)

Каждый блок ниже — отдельный запрос в Codex: сначала прикладываешь файлы из строки «Приложить», потом вставляешь текст из блока целиком. Результат сохранить под указанным именем.

## Порядок
1. Шаг 1: три листа героев. Показать Claude, ждать «ок».
2. Шаг 2: сначала только `s1a_hook_wide` (пробный кадр). Показать Claude: если стиль и герои держатся, делать остальные.
3. К каждому следующему кадру дополнительно прикладывать принятый `s1a_hook_wide.png` и добавлять в конец промта: `Match the paper style, colours and lighting of the attached scene picture.`

## Шаг 1. Листы героев

### tetsu
Приложить: `nauka-toon/assets/img/tetsu/sheet.png` (старый серый лист героя)
Сохранить как: `nauka-frames/assets/sheets/tetsu.png`
```
Handmade paper-collage illustration: every shape is cut from coloured paper with slightly uneven, hand-torn edges and a thin white torn-paper fibre rim; visible paper fibre texture and grain; flat paper colours with only a little tonal variation; each layer casts a soft drop shadow on the layer below, so the scene is built from stacked paper layers (far wall, big round paper disc behind, ring ropes and props, floor, characters in front).
Limited palette: kraft brown, cream, dusty blue, mustard yellow, warm gray. One accent red (#D92F2B) only on Tetsu's boxing hand wraps; nothing else in the picture is red.
No black outlines: shapes are separated by paper edges and shadows. Faces are simple cut-paper shapes with a few ink details.
Landscape 3:2, 1536x1024. Everything important stays inside the central 16:9 band (about 8% empty margin top and bottom).
No text, letters, numbers, logos, watermark, speech bubbles, arrows, circles, motion lines, impact stars or any effects.
No blood, wounds, bruises, broken teeth or weapons. Original characters, not resembling any real person or existing cartoon.

Tetsu, original male boxer, 24, lean wiry athletic build, tan skin, short black undercut hair, sharp focused eyes, thin scar across the left eyebrow, shirtless, mustard-yellow knee-length fight shorts, barefoot, bright red (#D92F2B) boxing hand wraps on both hands.
Character design sheet: the same character shown three times side by side on a plain cream paper background, front view, side view, back view, standing relaxed, full body.
Use the attached gray reference sheet only for this character's face, hair, scar, body proportions and clothes. Redraw the character in the paper-collage style described above.
```

### gromila
Приложить: `nauka-toon/assets/img/gromila/sheet.png` (старый серый лист героя)
Сохранить как: `nauka-frames/assets/sheets/gromila.png`
```
Handmade paper-collage illustration: every shape is cut from coloured paper with slightly uneven, hand-torn edges and a thin white torn-paper fibre rim; visible paper fibre texture and grain; flat paper colours with only a little tonal variation; each layer casts a soft drop shadow on the layer below, so the scene is built from stacked paper layers (far wall, big round paper disc behind, ring ropes and props, floor, characters in front).
Limited palette: kraft brown, cream, dusty blue, mustard yellow, warm gray. No red anywhere in the picture.
No black outlines: shapes are separated by paper edges and shadows. Faces are simple cut-paper shapes with a few ink details.
Landscape 3:2, 1536x1024. Everything important stays inside the central 16:9 band (about 8% empty margin top and bottom).
No text, letters, numbers, logos, watermark, speech bubbles, arrows, circles, motion lines, impact stars or any effects.
No blood, wounds, bruises, broken teeth or weapons. Original characters, not resembling any real person or existing cartoon.

Gromila, original huge heavyweight, about 2 meters tall, massive bulky body twice the width of an average man, bald head, thick dark full beard, small narrow eyes, light-gray sleeveless tank top, navy-blue sweatpants, barefoot, bare fists.
Character design sheet: the same character shown three times side by side on a plain cream paper background, front view, side view, back view, standing relaxed, full body.
Use the attached gray reference sheet only for this character's face, hair, scar, body proportions and clothes. Redraw the character in the paper-collage style described above.
```

### doc
Приложить: `nauka-toon/assets/img/doc/sheet.png` (старый серый лист героя)
Сохранить как: `nauka-frames/assets/sheets/doc.png`
```
Handmade paper-collage illustration: every shape is cut from coloured paper with slightly uneven, hand-torn edges and a thin white torn-paper fibre rim; visible paper fibre texture and grain; flat paper colours with only a little tonal variation; each layer casts a soft drop shadow on the layer below, so the scene is built from stacked paper layers (far wall, big round paper disc behind, ring ropes and props, floor, characters in front).
Limited palette: kraft brown, cream, dusty blue, mustard yellow, warm gray. No red anywhere in the picture.
No black outlines: shapes are separated by paper edges and shadows. Faces are simple cut-paper shapes with a few ink details.
Landscape 3:2, 1536x1024. Everything important stays inside the central 16:9 band (about 8% empty margin top and bottom).
No text, letters, numbers, logos, watermark, speech bubbles, arrows, circles, motion lines, impact stars or any effects.
No blood, wounds, bruises, broken teeth or weapons. Original characters, not resembling any real person or existing cartoon.

Doc, original old boxing coach and sports scientist, 65, short gray crew-cut hair, gray stubble, round glasses, wise wrinkled face, whistle on a cord around the neck, navy zipped tracksuit jacket with white stripes, white towel over one shoulder, wiry build.
Character design sheet: the same character shown three times side by side on a plain cream paper background, front view, side view, back view, standing relaxed, full body.
Use the attached gray reference sheet only for this character's face, hair, scar, body proportions and clothes. Redraw the character in the paper-collage style described above.
```

## Шаг 2. Кадры хука

### s1a_hook_wide (Tetsu + Gromila)
Приложить: `nauka-frames/assets/sheets/tetsu.png`, `nauka-frames/assets/sheets/gromila.png`
Сохранить как: `nauka-frames/assets/shots/s1a_hook_wide.png`
```
Handmade paper-collage illustration: every shape is cut from coloured paper with slightly uneven, hand-torn edges and a thin white torn-paper fibre rim; visible paper fibre texture and grain; flat paper colours with only a little tonal variation; each layer casts a soft drop shadow on the layer below, so the scene is built from stacked paper layers (far wall, big round paper disc behind, ring ropes and props, floor, characters in front).
Limited palette: kraft brown, cream, dusty blue, mustard yellow, warm gray. One accent red (#D92F2B) only on Tetsu's boxing hand wraps; nothing else in the picture is red.
No black outlines: shapes are separated by paper edges and shadows. Faces are simple cut-paper shapes with a few ink details.
Landscape 3:2, 1536x1024. Everything important stays inside the central 16:9 band (about 8% empty margin top and bottom).
No text, letters, numbers, logos, watermark, speech bubbles, arrows, circles, motion lines, impact stars or any effects.
No blood, wounds, bruises, broken teeth or weapons. Original characters, not resembling any real person or existing cartoon.

Use the attached character sheet(s) strictly for each character's design: same face, hair, scar, body proportions, clothes and colours. Keep features exactly the same, change only the pose and the scene.

Tetsu, original male boxer, 24, lean wiry athletic build, tan skin, short black undercut hair, sharp focused eyes, thin scar across the left eyebrow, shirtless, mustard-yellow knee-length fight shorts, barefoot, bright red (#D92F2B) boxing hand wraps on both hands.
Gromila, original huge heavyweight, about 2 meters tall, massive bulky body twice the width of an average man, bald head, thick dark full beard, small narrow eyes, light-gray sleeveless tank top, navy-blue sweatpants, barefoot, bare fists.
Background: a simple boxing gym built from paper layers in cream and dusty blue (wall, big round paper disc behind, ring ropes, floor), no people in the background.
Wide shot in a boxing ring. Tetsu on the left facing right, Gromila on the right facing left. Tetsu is in the middle of a left hook that stops one centimeter before Gromila's chin, Gromila's head slightly turned, calm and surprised. No contact. Keep the top third of the picture calm and empty (plain paper wall) for text.
```

### s1b_hook_hit (Tetsu + Gromila)
Приложить: `nauka-frames/assets/sheets/tetsu.png`, `nauka-frames/assets/sheets/gromila.png`
Сохранить как: `nauka-frames/assets/shots/s1b_hook_hit.png`
```
Handmade paper-collage illustration: every shape is cut from coloured paper with slightly uneven, hand-torn edges and a thin white torn-paper fibre rim; visible paper fibre texture and grain; flat paper colours with only a little tonal variation; each layer casts a soft drop shadow on the layer below, so the scene is built from stacked paper layers (far wall, big round paper disc behind, ring ropes and props, floor, characters in front).
Limited palette: kraft brown, cream, dusty blue, mustard yellow, warm gray. One accent red (#D92F2B) only on Tetsu's boxing hand wraps; nothing else in the picture is red.
No black outlines: shapes are separated by paper edges and shadows. Faces are simple cut-paper shapes with a few ink details.
Landscape 3:2, 1536x1024. Everything important stays inside the central 16:9 band (about 8% empty margin top and bottom).
No text, letters, numbers, logos, watermark, speech bubbles, arrows, circles, motion lines, impact stars or any effects.
No blood, wounds, bruises, broken teeth or weapons. Original characters, not resembling any real person or existing cartoon.

Use the attached character sheet(s) strictly for each character's design: same face, hair, scar, body proportions, clothes and colours. Keep features exactly the same, change only the pose and the scene.

Tetsu, original male boxer, 24, lean wiry athletic build, tan skin, short black undercut hair, sharp focused eyes, thin scar across the left eyebrow, shirtless, mustard-yellow knee-length fight shorts, barefoot, bright red (#D92F2B) boxing hand wraps on both hands.
Gromila, original huge heavyweight, about 2 meters tall, massive bulky body twice the width of an average man, bald head, thick dark full beard, small narrow eyes, light-gray sleeveless tank top, navy-blue sweatpants, barefoot, bare fists.
Background: a simple boxing gym built from paper layers in cream and dusty blue (wall, big round paper disc behind, ring ropes, floor), no people in the background.
Close-up, side view. Tetsu's red-wrapped left fist stops one centimeter before Gromila's bearded jaw. Gromila's head starts to turn, his eyes wide. Only fists, jaw, faces and shoulders visible, tight framing, no contact, no injury. Keep the top quarter calm and empty for text.
```

### s2_size (Tetsu + Gromila)
Приложить: `nauka-frames/assets/sheets/tetsu.png`, `nauka-frames/assets/sheets/gromila.png`
Сохранить как: `nauka-frames/assets/shots/s2_size.png`
```
Handmade paper-collage illustration: every shape is cut from coloured paper with slightly uneven, hand-torn edges and a thin white torn-paper fibre rim; visible paper fibre texture and grain; flat paper colours with only a little tonal variation; each layer casts a soft drop shadow on the layer below, so the scene is built from stacked paper layers (far wall, big round paper disc behind, ring ropes and props, floor, characters in front).
Limited palette: kraft brown, cream, dusty blue, mustard yellow, warm gray. One accent red (#D92F2B) only on Tetsu's boxing hand wraps; nothing else in the picture is red.
No black outlines: shapes are separated by paper edges and shadows. Faces are simple cut-paper shapes with a few ink details.
Landscape 3:2, 1536x1024. Everything important stays inside the central 16:9 band (about 8% empty margin top and bottom).
No text, letters, numbers, logos, watermark, speech bubbles, arrows, circles, motion lines, impact stars or any effects.
No blood, wounds, bruises, broken teeth or weapons. Original characters, not resembling any real person or existing cartoon.

Use the attached character sheet(s) strictly for each character's design: same face, hair, scar, body proportions, clothes and colours. Keep features exactly the same, change only the pose and the scene.

Tetsu, original male boxer, 24, lean wiry athletic build, tan skin, short black undercut hair, sharp focused eyes, thin scar across the left eyebrow, shirtless, mustard-yellow knee-length fight shorts, barefoot, bright red (#D92F2B) boxing hand wraps on both hands.
Gromila, original huge heavyweight, about 2 meters tall, massive bulky body twice the width of an average man, bald head, thick dark full beard, small narrow eyes, light-gray sleeveless tank top, navy-blue sweatpants, barefoot, bare fists.
Background: a simple boxing gym built from paper layers in cream and dusty blue (wall, big round paper disc behind, ring ropes, floor), no people in the background.
Wide shot. Tetsu and Gromila stand side by side facing the viewer, relaxed, full body. Gromila is clearly a head and a half taller and twice as wide as Tetsu. Both full figures fit with margin so the picture can be panned over them. Keep the top quarter calm and empty for text.
```

### s3a_punch (Tetsu + Gromila)
Приложить: `nauka-frames/assets/sheets/tetsu.png`, `nauka-frames/assets/sheets/gromila.png`
Сохранить как: `nauka-frames/assets/shots/s3a_punch.png`
```
Handmade paper-collage illustration: every shape is cut from coloured paper with slightly uneven, hand-torn edges and a thin white torn-paper fibre rim; visible paper fibre texture and grain; flat paper colours with only a little tonal variation; each layer casts a soft drop shadow on the layer below, so the scene is built from stacked paper layers (far wall, big round paper disc behind, ring ropes and props, floor, characters in front).
Limited palette: kraft brown, cream, dusty blue, mustard yellow, warm gray. One accent red (#D92F2B) only on Tetsu's boxing hand wraps; nothing else in the picture is red.
No black outlines: shapes are separated by paper edges and shadows. Faces are simple cut-paper shapes with a few ink details.
Landscape 3:2, 1536x1024. Everything important stays inside the central 16:9 band (about 8% empty margin top and bottom).
No text, letters, numbers, logos, watermark, speech bubbles, arrows, circles, motion lines, impact stars or any effects.
No blood, wounds, bruises, broken teeth or weapons. Original characters, not resembling any real person or existing cartoon.

Use the attached character sheet(s) strictly for each character's design: same face, hair, scar, body proportions, clothes and colours. Keep features exactly the same, change only the pose and the scene.

Tetsu, original male boxer, 24, lean wiry athletic build, tan skin, short black undercut hair, sharp focused eyes, thin scar across the left eyebrow, shirtless, mustard-yellow knee-length fight shorts, barefoot, bright red (#D92F2B) boxing hand wraps on both hands.
Gromila, original huge heavyweight, about 2 meters tall, massive bulky body twice the width of an average man, bald head, thick dark full beard, small narrow eyes, light-gray sleeveless tank top, navy-blue sweatpants, barefoot, bare fists.
Background: a simple boxing gym built from paper layers in cream and dusty blue (wall, big round paper disc behind, ring ropes, floor), no people in the background.
Medium shot, side view. Tetsu throws a left hook, the fist stops one centimeter before Gromila's jaw. The jawline of Gromila is clearly visible, his head just starting to turn. No contact, no injury. Keep the left third and the top calm and empty for text.
```

### s3b_sag (Gromila)
Приложить: `nauka-frames/assets/sheets/gromila.png`
Сохранить как: `nauka-frames/assets/shots/s3b_sag.png`
```
Handmade paper-collage illustration: every shape is cut from coloured paper with slightly uneven, hand-torn edges and a thin white torn-paper fibre rim; visible paper fibre texture and grain; flat paper colours with only a little tonal variation; each layer casts a soft drop shadow on the layer below, so the scene is built from stacked paper layers (far wall, big round paper disc behind, ring ropes and props, floor, characters in front).
Limited palette: kraft brown, cream, dusty blue, mustard yellow, warm gray. No red anywhere in the picture.
No black outlines: shapes are separated by paper edges and shadows. Faces are simple cut-paper shapes with a few ink details.
Landscape 3:2, 1536x1024. Everything important stays inside the central 16:9 band (about 8% empty margin top and bottom).
No text, letters, numbers, logos, watermark, speech bubbles, arrows, circles, motion lines, impact stars or any effects.
No blood, wounds, bruises, broken teeth or weapons. Original characters, not resembling any real person or existing cartoon.

Use the attached character sheet(s) strictly for each character's design: same face, hair, scar, body proportions, clothes and colours. Keep features exactly the same, change only the pose and the scene.

Gromila, original huge heavyweight, about 2 meters tall, massive bulky body twice the width of an average man, bald head, thick dark full beard, small narrow eyes, light-gray sleeveless tank top, navy-blue sweatpants, barefoot, bare fists.
Background: a simple boxing gym built from paper layers in cream and dusty blue (wall, big round paper disc behind, ring ropes, floor), no people in the background.
Medium shot. Gromila sinks down onto both knees, dazed, eyes half closed, arms hanging, head bowed. Tetsu is not in this picture. No injury, no blood. Keep the top third calm and empty for text.
```

### s4_myth (Tetsu + Gromila)
Приложить: `nauka-frames/assets/sheets/tetsu.png`, `nauka-frames/assets/sheets/gromila.png`
Сохранить как: `nauka-frames/assets/shots/s4_myth.png`
```
Handmade paper-collage illustration: every shape is cut from coloured paper with slightly uneven, hand-torn edges and a thin white torn-paper fibre rim; visible paper fibre texture and grain; flat paper colours with only a little tonal variation; each layer casts a soft drop shadow on the layer below, so the scene is built from stacked paper layers (far wall, big round paper disc behind, ring ropes and props, floor, characters in front).
Limited palette: kraft brown, cream, dusty blue, mustard yellow, warm gray. One accent red (#D92F2B) only on Tetsu's boxing hand wraps; nothing else in the picture is red.
No black outlines: shapes are separated by paper edges and shadows. Faces are simple cut-paper shapes with a few ink details.
Landscape 3:2, 1536x1024. Everything important stays inside the central 16:9 band (about 8% empty margin top and bottom).
No text, letters, numbers, logos, watermark, speech bubbles, arrows, circles, motion lines, impact stars or any effects.
No blood, wounds, bruises, broken teeth or weapons. Original characters, not resembling any real person or existing cartoon.

Use the attached character sheet(s) strictly for each character's design: same face, hair, scar, body proportions, clothes and colours. Keep features exactly the same, change only the pose and the scene.

Tetsu, original male boxer, 24, lean wiry athletic build, tan skin, short black undercut hair, sharp focused eyes, thin scar across the left eyebrow, shirtless, mustard-yellow knee-length fight shorts, barefoot, bright red (#D92F2B) boxing hand wraps on both hands.
Gromila, original huge heavyweight, about 2 meters tall, massive bulky body twice the width of an average man, bald head, thick dark full beard, small narrow eyes, light-gray sleeveless tank top, navy-blue sweatpants, barefoot, bare fists.
Background: a simple boxing gym built from paper layers in cream and dusty blue (wall, big round paper disc behind, ring ropes, floor), no people in the background.
Medium shot. Gromila proudly flexes both arms showing huge biceps with an arrogant grin. Tetsu stands small next to him with crossed arms and a skeptical look. Keep the top quarter calm and empty for text.
```

### s5_doc (Doc)
Приложить: `nauka-frames/assets/sheets/doc.png`
Сохранить как: `nauka-frames/assets/shots/s5_doc.png`
```
Handmade paper-collage illustration: every shape is cut from coloured paper with slightly uneven, hand-torn edges and a thin white torn-paper fibre rim; visible paper fibre texture and grain; flat paper colours with only a little tonal variation; each layer casts a soft drop shadow on the layer below, so the scene is built from stacked paper layers (far wall, big round paper disc behind, ring ropes and props, floor, characters in front).
Limited palette: kraft brown, cream, dusty blue, mustard yellow, warm gray. No red anywhere in the picture.
No black outlines: shapes are separated by paper edges and shadows. Faces are simple cut-paper shapes with a few ink details.
Landscape 3:2, 1536x1024. Everything important stays inside the central 16:9 band (about 8% empty margin top and bottom).
No text, letters, numbers, logos, watermark, speech bubbles, arrows, circles, motion lines, impact stars or any effects.
No blood, wounds, bruises, broken teeth or weapons. Original characters, not resembling any real person or existing cartoon.

Use the attached character sheet(s) strictly for each character's design: same face, hair, scar, body proportions, clothes and colours. Keep features exactly the same, change only the pose and the scene.

Doc, original old boxing coach and sports scientist, 65, short gray crew-cut hair, gray stubble, round glasses, wise wrinkled face, whistle on a cord around the neck, navy zipped tracksuit jacket with white stripes, white towel over one shoulder, wiry build.
Background: an old 1970s gym built from paper layers in warm kraft and cream (wall bars, a plain blank paper wall board), no people in the background.
Medium shot. Doc stands on the left facing the viewer, holding a clipboard and raising one finger, serious look over his glasses. Keep the right half of the picture calm and empty for a number board added later.
```

### s6a_three (Tetsu + Gromila)
Приложить: `nauka-frames/assets/sheets/tetsu.png`, `nauka-frames/assets/sheets/gromila.png`
Сохранить как: `nauka-frames/assets/shots/s6a_three.png`
```
Handmade paper-collage illustration: every shape is cut from coloured paper with slightly uneven, hand-torn edges and a thin white torn-paper fibre rim; visible paper fibre texture and grain; flat paper colours with only a little tonal variation; each layer casts a soft drop shadow on the layer below, so the scene is built from stacked paper layers (far wall, big round paper disc behind, ring ropes and props, floor, characters in front).
Limited palette: kraft brown, cream, dusty blue, mustard yellow, warm gray. One accent red (#D92F2B) only on Tetsu's boxing hand wraps; nothing else in the picture is red.
No black outlines: shapes are separated by paper edges and shadows. Faces are simple cut-paper shapes with a few ink details.
Landscape 3:2, 1536x1024. Everything important stays inside the central 16:9 band (about 8% empty margin top and bottom).
No text, letters, numbers, logos, watermark, speech bubbles, arrows, circles, motion lines, impact stars or any effects.
No blood, wounds, bruises, broken teeth or weapons. Original characters, not resembling any real person or existing cartoon.

Use the attached character sheet(s) strictly for each character's design: same face, hair, scar, body proportions, clothes and colours. Keep features exactly the same, change only the pose and the scene.

Tetsu, original male boxer, 24, lean wiry athletic build, tan skin, short black undercut hair, sharp focused eyes, thin scar across the left eyebrow, shirtless, mustard-yellow knee-length fight shorts, barefoot, bright red (#D92F2B) boxing hand wraps on both hands.
Gromila, original huge heavyweight, about 2 meters tall, massive bulky body twice the width of an average man, bald head, thick dark full beard, small narrow eyes, light-gray sleeveless tank top, navy-blue sweatpants, barefoot, bare fists.
Background: a simple boxing gym built from paper layers in cream and dusty blue (wall, big round paper disc behind, ring ropes, floor), no people in the background.
Medium shot. Gromila on one knee, dazed, one hand on the ground, head slightly bowed. Tetsu stands behind him in a calm boxing guard stance. Keep the top third calm and empty for text.
```

### s6b_brain (без героев)
Приложить: ничего (образец стиля: `s1a_hook_wide.png`)
Сохранить как: `nauka-frames/assets/shots/s6b_brain.png`
```
Handmade paper-collage illustration: every shape is cut from coloured paper with slightly uneven, hand-torn edges and a thin white torn-paper fibre rim; visible paper fibre texture and grain; flat paper colours with only a little tonal variation; each layer casts a soft drop shadow on the layer below, so the scene is built from stacked paper layers (far wall, big round paper disc behind, ring ropes and props, floor, characters in front).
Limited palette: kraft brown, cream, dusty blue, mustard yellow, warm gray. One accent red (#D92F2B) only on the brain; nothing else is red.
No black outlines: shapes are separated by paper edges and shadows. Faces are simple cut-paper shapes with a few ink details.
Landscape 3:2, 1536x1024. Everything important stays inside the central 16:9 band (about 8% empty margin top and bottom).
No text, letters, numbers, logos, watermark, speech bubbles, arrows, circles, motion lines, impact stars or any effects.
No blood, wounds, bruises, broken teeth or weapons. Original characters, not resembling any real person or existing cartoon.

Side profile cross-section of a bald bearded heavyweight's head and neck as a paper-collage anatomical illustration: skull shape cut from cream paper, a large brain with clear folds cut from red paper inside it, plain kraft-and-cream paper background. No blood. Keep the top quarter calm and empty for text.
```

## Чек-лист на каждый результат
- Бумажный коллаж: рваные края, белая кромка, тени между слоями, зерно; без чёрных контуров.
- Герои как на листах (лицо, шрам, борода, цвета одежды).
- Нет текста, стрелок, эффектов, крови.
- Красный только там, где указано.
- Есть спокойная зона под текст.
- PNG 1536×1024.
