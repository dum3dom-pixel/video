# ТЗ для Codex v3: целостные бумажные кадры хука «Наука боя»

Заменяет v2 для хука. Решение: **стиль бумажный коллаж остаётся, куклы (анимация частями тела) убраны**. Каждый кадр — законченная картинка-аппликация целиком (герои + свой слоёный фон из вырезанной цветной бумаги). Движение делает код: наезды/панорамы по картинке, тряска, смена кадров рваной бумажной карточкой, шаговая анимация 12 fps, вспышки. Надписи, стрелки, кольца, штамп «МИФ» код тоже делает из бумаги (плашки и вырезные буквы). В картинки текст и эффекты НЕ рисовать.

Корень: nauka-frames/assets/ (листы → sheets/, кадры → shots/).

## Формат
- PNG, **1536×1024**, полный кадр с фоном. Важное держать в центральной полосе 16:9 (сверху и снизу ~8% запаса): код кадрирует до 1920×1080 и даёт запас под наезд/панораму.
- В каждом кадре есть **спокойная зона под текст** (указана в таблице): однотонный бумажный фон, без предметов.
- Порядок: 1) три листа героев в бумажном стиле → показать, ждать «ок»; 2) 9 кадров хука; к каждому кадру прикладывать листы нужных героев как референс + блок REF.

## STYLE (в каждый промт)
```
Handmade paper-collage illustration: every shape is cut from coloured paper with slightly uneven, hand-torn edges and a thin white torn-paper fibre rim; visible paper fibre texture and grain; flat paper colours with only a little tonal variation; each layer casts a soft drop shadow on the layer below, so the scene is built from stacked paper layers (far wall/sky, ropes and props, floor, characters in front).
Limited palette: kraft brown, cream, dusty blue, mustard yellow, warm gray, plus one accent red (#D92F2B) used only for the single element named in the prompt. No black outlines: shapes are separated by paper edges and shadows. Faces are simple cut-paper shapes with a few ink details.
Complete finished scene with its own background, landscape 3:2, 1536x1024. Everything important stays inside the central 16:9 band.
No text, letters, numbers, logos, watermark, speech bubbles, arrows, circles, motion lines, impact stars or any effects.
No blood, wounds, bruises, broken teeth or weapons. Original characters, not resembling any real person or existing cartoon.
```

## REF (в каждый кадр)
```
Use the attached character sheet(s) strictly for each character's design: same face, hair, scar, body proportions, clothes and colours. Keep features exactly the same, change only the pose and the scene.
```

## Персонажи (цвета фиксируем)
**Тэцу**: `Tetsu, original male boxer, 24, lean wiry athletic build, tan skin, short black undercut hair, sharp focused eyes, thin scar across the left eyebrow, shirtless, mustard-yellow knee-length fight shorts, barefoot, bright red (#D92F2B) boxing hand wraps on both hands.`
**Громила**: `Gromila, original huge heavyweight, about 2 meters tall, massive bulky body twice the width of an average man, bald head, thick dark full beard, small narrow eyes, light-gray sleeveless tank top, navy-blue sweatpants, barefoot, bare fists.`
**Док**: `Doc, original old boxing coach and sports scientist, 65, short gray crew-cut hair, gray stubble, round glasses, wise wrinkled face, whistle on a cord around the neck, navy zipped tracksuit jacket with white stripes, white towel over one shoulder, wiry build.`
Лист (для всех трёх): `Character design sheet: the same character shown three times side by side, front view, side view, back view, standing relaxed, full body, plain cream background.` Серые листы из nauka-toon приложить как референс лица и пропорций и пересобрать в бумажном стиле.

## Кадры хука (9 штук → `shots/`)
Фон: простой спортзал/ринг из слоёв бумаги в кремово-голубой гамме (стена, круглый диск-«солнце», канаты, пол), без людей на заднем плане.

| Файл | Сцена | Промт кадра | Пустая зона |
|---|---|---|---|
| `s1a_hook_wide.png` | 1 «Здоровяка вырубает…» | `Wide shot in a boxing ring. Tetsu on the left facing right, Gromila on the right facing left, Tetsu in the middle of a left hook that stops one centimeter before Gromila's chin, Gromila's head slightly turned, calm and surprised. No contact.` | верхняя треть |
| `s1b_hook_hit.png` | 1, удар | `Close-up, side view. Tetsu's red-wrapped left fist stops one centimeter before Gromila's bearded jaw. Gromila's head starts to turn, his eyes wide. Only fists, jaw, faces and shoulders visible, tight framing with calm space above, no contact, no injury.` | верхняя четверть |
| `s2_size.png` | 2 размер | `Wide shot. Tetsu and Gromila stand side by side facing the viewer, relaxed, full body. Gromila is clearly a head and a half taller and twice as wide as Tetsu. The whole figures fit with margin so the picture can be panned over them.` | верхняя четверть |
| `s3a_punch.png` | 3 удар в подбородок | `Medium shot, side view. Tetsu throws a left hook, the fist stops one centimeter before Gromila's jaw. The jawline of Gromila is clearly visible, his head just starting to turn. No contact, no injury.` | левая треть |
| `s3b_sag.png` | 3, оседает | `Medium shot. Gromila sinks down onto both knees, dazed, eyes half closed, hands hanging, head bowed. Tetsu is not in this picture. No injury, no blood.` | верхняя треть |
| `s4_myth.png` | 4 миф | `Medium shot. Gromila proudly flexes both arms showing huge biceps with an arrogant grin. Tetsu stands small next to him with crossed arms and a skeptical look.` | верхняя четверть |
| `s5_doc.png` | 5 эксперимент | `Medium shot. Doc stands facing the viewer in an old 1970s gym, holding a clipboard and raising one finger, serious look over his glasses. Retro warm colours, wall bars and an empty blank wall board behind him.` | правая половина |
| `s6a_three.png` | 6 три причины | `Medium shot. Gromila on one knee, dazed, one hand on the ground, head slightly bowed. Tetsu stands behind him in a calm boxing guard stance.` | верхняя треть |
| `s6b_brain.png` | 6, ответ | `Side profile cross-section of a bald bearded heavyweight's head and neck as a cartoon anatomical illustration, skull visible, a big pink brain inside it with clear folds, plain cream background. No blood.` | верх |

## Что добавляет код (в картинки не рисовать)
Бумажные плашки и вырезные буквы, субтитры по словам, стрелки, кольца, скобки-измерения, штамп «МИФ», цифры «1972», вспышки, линии скорости, тряска, наезды/панорамы, смена кадров рваной карточкой, бумажное зерно.

## Чек-лист
- [ ] Один бумажный стиль на все кадры и листы, цвета героев не плывут, видны тени между слоями и рваные края.
- [ ] Герои целиком или осознанно обрезаны, лица узнаются по листам.
- [ ] Нет букв, стрелок, эффектов, крови.
- [ ] Спокойная зона под текст есть.
- [ ] 1536×1024 PNG.
