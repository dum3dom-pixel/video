# Codex: продолжение ролика 01 до 1:30

Всё ниже — задание для Codex. Кадры хука уже приняты, трогать их не надо. Нужно сгенерировать **7 новых картинок** для 12 новых сцен; остальные сцены используют уже готовые кадры. Сценарий и текст озвучки — в [script-01-90s.md](script-01-90s.md).

## Что уже сделано (не менять)
- Хук 22 с собран и отрендерен: `nauka-frames/out/nauka-frames-hook.mp4`. Голос и тайминги хука не меняем.
- Листы героев в бумажном стиле: `nauka-frames/assets/sheets/{tetsu,gromila,doc}.png`. Девять кадров хука: `nauka-frames/assets/shots/`.
- Громила обновлён 31.10 по принятым примерам (светлая кожа, залысины, светлая борода, голубые глаза; см. `nauka-frames/spec/gromila-likeness-v2.json`). Старого лысого Громилу с тёмной бородой больше не рисуем. Перед генерацией прочитать [SPRITE-STYLE.md](SPRITE-STYLE.md).
- Принятый эталон стиля: `nauka-frames/assets/shots/s1a_hook_wide.png`. Рука Тэцу в хуке прямая, это согласовано: в новых кадрах сохранять тот же силуэт.

## Правила (те же, что в v3)
- Бумажный коллаж: рваные края с белой кромкой, тени между слоями, зерно, палитра крафт / крем / пыльно-синий / горчичный / тёплый серый, красный `#D92F2B` только там, где указано в строке «акцент».
- PNG 1536×1024, без текста, цифр, логотипов, стрелок, кругов, эффектов, крови, ран и оружия. Всё важное внутри центральной полосы 16:9.
- Герои строго по листам (лицо, шрам Тэцу, борода Громилы, цвета одежды). Реальных людей не рисуем; боксёр в `s7_dummy` — безликий тёмный силуэт.
- Нокаут не показываем крупным планом лежащего человека; для медицины — только жест «стоп» у Дока, без символов.
- В PowerShell передавать время с десятичной точкой (в прошлый раз запятая ломала список секунд).

## Порядок
1. Первым — только `s14_unseen` (два героя, самый сложный кадр). Показать результат, проверить по чек-листу ниже.
2. Если стиль и герои держатся — остальные шесть. К каждому прикладывать `s1a_hook_wide.png` и добавлять в конец промта строку: `Match the paper style, colours and lighting of the attached scene picture (s1a_hook_wide.png).`
3. Сохранять под указанными именами в `nauka-frames/assets/shots/`.

## Что берём из готового

| кадр | сцены |
|---|---|
| `s1b_hook_hit` | turn, answer |
| `s3a_punch` | side, answer |
| `s3b_sag` | answer |
| `s5_doc` | exp72 |
| `s6b_brain` | brain, hypo |

## Новые кадры: что приложить и что вставить

### s7_dummy (сцена `force`)
Приложить: `nauka-frames/assets/shots/s1a_hook_wide.png`
Сохранить как: `nauka-frames/assets/shots/s7_dummy.png`
Спокойная зона: верх чистый под «СИЛА» и плитки; манекен справа, силуэт слева
```
Handmade paper-collage illustration: every shape is cut from coloured paper with slightly uneven, hand-torn edges and a thin white torn-paper fibre rim; visible paper fibre texture and grain; flat paper colours with only a little tonal variation; each layer casts a soft drop shadow on the layer below, so the scene is built from stacked paper layers (far wall, big round paper disc behind, ring ropes and props, floor, characters in front).
Limited palette: kraft brown, cream, dusty blue, mustard yellow, warm gray. One accent red (#D92F2B) only on the silhouette's hand wraps; nothing else in the picture is red.
No black outlines: shapes are separated by paper edges and shadows. Faces are simple cut-paper shapes with a few ink details.
Landscape 3:2, 1536x1024. Everything important stays inside the central 16:9 band (about 8% empty margin top and bottom).
No text, letters, numbers, logos, watermark, speech bubbles, arrows, circles, motion lines, impact stars or any effects.
No blood, wounds, bruises, broken teeth or weapons. Original characters, not resembling any real person or existing cartoon.

Medium-wide shot in a sports lab that looks like a boxing gym. On the right, a grey paper crash-test dummy (torso, neck and a blank round head without any face) is mounted on a metal stand with a few thin cables and a small round sensor dot on the head. On the left, a faceless boxer drawn as a solid dark-navy paper silhouette (no face, no skin details, only red hand wraps) throws a straight punch at the dummy's head; the red-wrapped fist stops one centimeter before it. Background: cream wall and one big dusty-blue paper disc behind the dummy. Keep the top third calm and empty for text.

Match the paper style, colours and lighting of the attached scene picture (s1a_hook_wide.png).
```

### s9_jelly_jar (сцена `brain`)
Приложить: `nauka-frames/assets/shots/s1a_hook_wide.png`
Сохранить как: `nauka-frames/assets/shots/s9_jelly_jar.png`
Спокойная зона: банка по центру-справа, слева и сверху пусто под заголовок «МОЗГ = ЖЕЛЕ»
```
Handmade paper-collage illustration: every shape is cut from coloured paper with slightly uneven, hand-torn edges and a thin white torn-paper fibre rim; visible paper fibre texture and grain; flat paper colours with only a little tonal variation; each layer casts a soft drop shadow on the layer below, so the scene is built from stacked paper layers (far wall, big round paper disc behind, ring ropes and props, floor, characters in front).
Limited palette: kraft brown, cream, dusty blue, mustard yellow, warm gray. One accent red (#D92F2B) only on the jelly; nothing else in the picture is red.
No black outlines: shapes are separated by paper edges and shadows. Faces are simple cut-paper shapes with a few ink details.
Landscape 3:2, 1536x1024. Everything important stays inside the central 16:9 band (about 8% empty margin top and bottom).
No text, letters, numbers, logos, watermark, speech bubbles, arrows, circles, motion lines, impact stars or any effects.
No blood, wounds, bruises, broken teeth or weapons. Original characters, not resembling any real person or existing cartoon.

Still life, no people. A big transparent glass jar stands on a kraft-paper table, filled with glossy wobbling red jelly (a soft dome with gentle folds, slightly translucent), a small spoon leans on the jar. Behind it a cream paper wall and one big dusty-blue paper disc. Keep the top third and the left third calm and empty for text.

Match the paper style, colours and lighting of the attached scene picture (s1a_hook_wide.png).
```

### s12_chin_profile (сцена `lever`)
Приложить: `nauka-frames/assets/sheets/gromila.png`, `nauka-frames/assets/shots/s1a_hook_wide.png`
Сохранить как: `nauka-frames/assets/shots/s12_chin_profile.png`
Спокойная зона: голова слева-по центру, справа 40% и верх чистые под схему рычага
```
Handmade paper-collage illustration: every shape is cut from coloured paper with slightly uneven, hand-torn edges and a thin white torn-paper fibre rim; visible paper fibre texture and grain; flat paper colours with only a little tonal variation; each layer casts a soft drop shadow on the layer below, so the scene is built from stacked paper layers (far wall, big round paper disc behind, ring ropes and props, floor, characters in front).
Limited palette: kraft brown, cream, dusty blue, mustard yellow, warm gray. No red anywhere in the picture.
No black outlines: shapes are separated by paper edges and shadows. Faces are simple cut-paper shapes with a few ink details.
Landscape 3:2, 1536x1024. Everything important stays inside the central 16:9 band (about 8% empty margin top and bottom).
No text, letters, numbers, logos, watermark, speech bubbles, arrows, circles, motion lines, impact stars or any effects.
No blood, wounds, bruises, broken teeth or weapons. Original characters, not resembling any real person or existing cartoon.

Use the attached character sheet(s) strictly for each character's design: same face, hair, scar, body proportions, clothes and colours. Keep features exactly the same, change only the pose and the scene.

Gromila, huge heavyweight, about 2 meters tall: high rounded forehead, very receding hairline with sparse short light-brown hair at the temples, light-blue eyes, natural light eyebrows, broad rounded face and nose, dense light-brown / dark-blond full beard with lighter ends, light beige skin, extremely thick muscular neck, rounded huge shoulders and upper arms, massive broad chest and thick waist, light-gray sleeveless tank top, navy-blue sweatpants, barefoot, bare fists.
Close-up side view, profile facing right: Gromila's head, neck and upper shoulders, relaxed neutral face, mouth closed, the chin clearly visible and slightly raised. Plain cream paper background with one big soft dusty-blue paper disc behind the head. The head is large and sits in the left-centre of the picture; the right 40% and the top quarter stay calm and empty for diagram overlays added later. No cross-section, no anatomy cut-away, no arrows.

Match the paper style, colours and lighting of the attached scene picture (s1a_hook_wide.png).
```

### s14_unseen (сцена `unseen`)
Приложить: `nauka-frames/assets/sheets/tetsu.png`, `nauka-frames/assets/sheets/gromila.png`, `nauka-frames/assets/shots/s1a_hook_wide.png`
Сохранить как: `nauka-frames/assets/shots/s14_unseen.png`
Спокойная зона: верх чистый под «УДАР, КОТОРОГО НЕ ВИДИШЬ»; глаза Громилы читаются
```
Handmade paper-collage illustration: every shape is cut from coloured paper with slightly uneven, hand-torn edges and a thin white torn-paper fibre rim; visible paper fibre texture and grain; flat paper colours with only a little tonal variation; each layer casts a soft drop shadow on the layer below, so the scene is built from stacked paper layers (far wall, big round paper disc behind, ring ropes and props, floor, characters in front).
Limited palette: kraft brown, cream, dusty blue, mustard yellow, warm gray. One accent red (#D92F2B) only on Tetsu's boxing hand wraps; nothing else in the picture is red.
No black outlines: shapes are separated by paper edges and shadows. Faces are simple cut-paper shapes with a few ink details.
Landscape 3:2, 1536x1024. Everything important stays inside the central 16:9 band (about 8% empty margin top and bottom).
No text, letters, numbers, logos, watermark, speech bubbles, arrows, circles, motion lines, impact stars or any effects.
No blood, wounds, bruises, broken teeth or weapons. Original characters, not resembling any real person or existing cartoon.

Use the attached character sheet(s) strictly for each character's design: same face, hair, scar, body proportions, clothes and colours. Keep features exactly the same, change only the pose and the scene.

Tetsu, original male boxer, 24, lean wiry athletic build, tan skin, short black undercut hair, sharp focused eyes, thin scar across the left eyebrow, shirtless, mustard-yellow knee-length fight shorts, barefoot, bright red (#D92F2B) boxing hand wraps on both hands.
Gromila, huge heavyweight, about 2 meters tall: high rounded forehead, very receding hairline with sparse short light-brown hair at the temples, light-blue eyes, natural light eyebrows, broad rounded face and nose, dense light-brown / dark-blond full beard with lighter ends, light beige skin, extremely thick muscular neck, rounded huge shoulders and upper arms, massive broad chest and thick waist, light-gray sleeveless tank top, navy-blue sweatpants, barefoot, bare fists.
Wide shot in a boxing ring, boxing gym background built from paper layers in cream and dusty blue. Gromila on the right looks away from Tetsu toward the right edge of the picture and swings a big slow right overhand at nothing, his left guard dropped, eyes on his own swing. Tetsu on the left comes from Gromila's blind side with a short left hook, the red-wrapped glove one centimeter from the jaw, no contact, no injury. Keep the top third calm and empty for text.

Match the paper style, colours and lighting of the attached scene picture (s1a_hook_wide.png).
```

### s15_neck_tense (сцена `neck`)
Приложить: `nauka-frames/assets/sheets/tetsu.png`, `nauka-frames/assets/shots/s1a_hook_wide.png`
Сохранить как: `nauka-frames/assets/shots/s15_neck_tense.png`
Спокойная зона: слева и сверху пусто: туда встают две бумажные полосы и заголовок
```
Handmade paper-collage illustration: every shape is cut from coloured paper with slightly uneven, hand-torn edges and a thin white torn-paper fibre rim; visible paper fibre texture and grain; flat paper colours with only a little tonal variation; each layer casts a soft drop shadow on the layer below, so the scene is built from stacked paper layers (far wall, big round paper disc behind, ring ropes and props, floor, characters in front).
Limited palette: kraft brown, cream, dusty blue, mustard yellow, warm gray. One accent red (#D92F2B) only on Tetsu's boxing hand wraps; nothing else in the picture is red.
No black outlines: shapes are separated by paper edges and shadows. Faces are simple cut-paper shapes with a few ink details.
Landscape 3:2, 1536x1024. Everything important stays inside the central 16:9 band (about 8% empty margin top and bottom).
No text, letters, numbers, logos, watermark, speech bubbles, arrows, circles, motion lines, impact stars or any effects.
No blood, wounds, bruises, broken teeth or weapons. Original characters, not resembling any real person or existing cartoon.

Use the attached character sheet(s) strictly for each character's design: same face, hair, scar, body proportions, clothes and colours. Keep features exactly the same, change only the pose and the scene.

Tetsu, original male boxer, 24, lean wiry athletic build, tan skin, short black undercut hair, sharp focused eyes, thin scar across the left eyebrow, shirtless, mustard-yellow knee-length fight shorts, barefoot, bright red (#D92F2B) boxing hand wraps on both hands.
Medium close-up of Tetsu from the chest up, three-quarter view facing right, chin tucked down, shoulders raised, the neck and trapezius muscles clearly tensed and defined, fists up in a boxing guard with red-wrapped hands near the jaw, focused eyes under the brow. Background: cream wall with one big dusty-blue paper disc. Keep the left third and the top quarter calm and empty for diagram bars and text.

Match the paper style, colours and lighting of the attached scene picture (s1a_hook_wide.png).
```

### s17_doc_stop (сцена `safe`)
Приложить: `nauka-frames/assets/sheets/doc.png`, `nauka-frames/assets/shots/s1a_hook_wide.png`
Сохранить как: `nauka-frames/assets/shots/s17_doc_stop.png`
Спокойная зона: правая половина чистая под штамп «СТОП · ВРАЧ»
```
Handmade paper-collage illustration: every shape is cut from coloured paper with slightly uneven, hand-torn edges and a thin white torn-paper fibre rim; visible paper fibre texture and grain; flat paper colours with only a little tonal variation; each layer casts a soft drop shadow on the layer below, so the scene is built from stacked paper layers (far wall, big round paper disc behind, ring ropes and props, floor, characters in front).
Limited palette: kraft brown, cream, dusty blue, mustard yellow, warm gray. No red anywhere in the picture.
No black outlines: shapes are separated by paper edges and shadows. Faces are simple cut-paper shapes with a few ink details.
Landscape 3:2, 1536x1024. Everything important stays inside the central 16:9 band (about 8% empty margin top and bottom).
No text, letters, numbers, logos, watermark, speech bubbles, arrows, circles, motion lines, impact stars or any effects.
No blood, wounds, bruises, broken teeth or weapons. Original characters, not resembling any real person or existing cartoon.

Use the attached character sheet(s) strictly for each character's design: same face, hair, scar, body proportions, clothes and colours. Keep features exactly the same, change only the pose and the scene.

Doc, original old boxing coach and sports scientist, 65, short gray crew-cut hair, gray stubble, round glasses, wise wrinkled face, whistle on a cord around the neck, navy zipped tracksuit jacket with white stripes, white towel over one shoulder, wiry build.
Background: an old 1970s gym built from paper layers in warm kraft and cream (wall bars, plain wall), no people in the background.
Medium shot. Doc stands on the left facing the viewer, one palm raised flat toward the viewer in a clear stop gesture, the other hand holds a clipboard against his hip, a caring but serious look over his glasses. Keep the right half calm and empty for a stamp added later. No medical symbols, no crosses, no text.

Match the paper style, colours and lighting of the attached scene picture (s1a_hook_wide.png).
```

### s18_bag_scale (сцена `next`)
Приложить: `nauka-frames/assets/shots/s1a_hook_wide.png`
Сохранить как: `nauka-frames/assets/shots/s18_bag_scale.png`
Спокойная зона: верх чистый, шкала справа: камера наезжает на стрелку
```
Handmade paper-collage illustration: every shape is cut from coloured paper with slightly uneven, hand-torn edges and a thin white torn-paper fibre rim; visible paper fibre texture and grain; flat paper colours with only a little tonal variation; each layer casts a soft drop shadow on the layer below, so the scene is built from stacked paper layers (far wall, big round paper disc behind, ring ropes and props, floor, characters in front).
Limited palette: kraft brown, cream, dusty blue, mustard yellow, warm gray. One accent red (#D92F2B) only on the gauge needle; nothing else in the picture is red.
No black outlines: shapes are separated by paper edges and shadows. Faces are simple cut-paper shapes with a few ink details.
Landscape 3:2, 1536x1024. Everything important stays inside the central 16:9 band (about 8% empty margin top and bottom).
No text, letters, numbers, logos, watermark, speech bubbles, arrows, circles, motion lines, impact stars or any effects.
No blood, wounds, bruises, broken teeth or weapons. Original characters, not resembling any real person or existing cartoon.

Still life in a boxing gym built from paper layers in cream and dusty blue. A heavy punching bag hangs from a chain on the left; on the right a big round paper dial gauge on a stand, like a dynamometer, with tick marks but no numerals and no text, its needle in the upper third. A pair of grey boxing gloves hangs from a hook at the edge. No people. Keep the top third calm and empty for text.

Match the paper style, colours and lighting of the attached scene picture (s1a_hook_wide.png).
```

## Чек-лист на каждый результат
- Бумажный коллаж, рваные края, тени между слоями, без чёрных контуров; тот же материал и свет, что в `s1a_hook_wide.png`.
- Герои как на листах; Громила как на новом листе, с выражением по смыслу сцены (в `s14_unseen` он смотрит мимо, в `s12_chin_profile` спокоен).
- Нет текста, цифр на шкале, стрелок, эффектов, крови, медицинских знаков.
- Красный только в указанном месте. В `s7_dummy`, `s9_jelly_jar` и `s18_bag_scale` красный акцент осознанно стоит не на бинтах Тэцу (как красный мозг в `s6b_brain`), хотя `SPRITE-STYLE.md` разрешает красный только на бинтах: если Codex считает это ошибкой, пусть скажет, не подгоняя молча.
- Есть спокойная зона под надписи и схемы (см. строки «Спокойная зона»).
- PNG 1536×1024.

## После генерации: что делает Codex
1. Положить семь PNG в `nauka-frames/assets/shots/`, дописать их промты и референсы в `nauka-frames/spec/image-generation-v3.json` (раздел для новых кадров, как для первых девяти).
2. Закоммитить в `main` одним коммитом с понятным сообщением и запушить, как в прошлый раз. Хук и `nauka-pencil/`, `nauka-toon/` не трогать.
3. Сообщить Claude, что кадры лежат; ничего из пункта «Сборка» ниже без согласования не делать, если на это нет отдельной просьбы.

## Сборка (после кадров), чтобы продолжить любому из нас
1. `nauka-frames/spec/hook.json`: дописать 12 сцен (`id`, `beats`, `voice`, `sfx`) из таблицы в `script-01-90s.md`; хук-сцены не менять.
2. `scripts/tts.py` (как для хука): озвучка, получить `spec/words.json` и `spec/voice.json`; проверить, что каждая сцена не короче своего голоса, иначе перераспределить удары (сумма новых сцен остаётся 102).
3. `build.mjs`: добавить имена семи новых кадров в `SHOTS`; `node build.mjs` и `python -I scripts/mix.py`.
4. `engine/frames.js`: сцены `SC.force … SC.next`, добавить их в `ORDER`, `GRAIN_A`, `HITS` (слова-удары по таймкодам озвучки) и `TR` (направление карточки на каждую новую сцену); `ANCH` для новых кадров измерить на готовых картинках.
5. `npx hyperframes check --json`, снимки на словах-ударах и стыках, черновой рендер `--quality draft`, декодированные кадры стыков; затем предпросмотр, и только после одобрения `--quality delivery --output out/nauka-frames-hook-90s.mp4`.
6. Записать итерацию в `nauka-frames/ITERATION.md` (интервал, наблюдение, причина, исправление, перепроверка) и честно перечислить, что не проверено: звук на слух, живое движение.

## Что не делаем
- Не менять голос и тайминги хука, не трогать `nauka-pencil/` и `nauka-toon/`.
- Не добавлять новые научные утверждения и цифры, которых нет в `script-01.md`.
- Не делать кукол и анимацию частей тела: движется только целая картинка.
