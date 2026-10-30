# ТЗ для Codex v2: «Наука боя» в стиле референса «серый герой на чёрном + красный акцент»

Заменяет STYLE из `codex-images.md`. Таблицы поз оттуда (guard, hook_1–3, jab, explain и т.д.) берём те же, меняется только STYLE и цвет акцента (красный вместо оранжевого). Анимацию и все надписи, стрелки, кружки, штампы добавляет Claude кодом поверх.

Корень: `C:\Users\daatva\Desktop\video\nauka-toon\assets\img\` (папки `tetsu/`, `gromila/`, `doc/`, `scenes/`).

## Формат
- PNG, **1536×1024**. Важное держать в центральной полосе 16:9 (сверху и снизу по ~8% пустого поля): потом кадрирую до 1920×1080.
- Фон **ровно #000000**. Герой на таком фоне двигается, масштабируется и накладывается слоем (screen), без вырезания.
- Листы персонажей: три вида (спереди, сбоку, сзади), 1536×1024.
- Порядок: 1) три листа → показать, ждать «ок»; 2) 6 сцен хука; 3) остальные позы. К каждой позе прикладывать лист как референс + блок REF.

## STYLE (в каждый промт)
```
Stylized 2D digital cartoon illustration with semi-realistic anatomy, clean confident dark outlines of varying thickness, smooth soft cel shading, subtle muscle definition and highlights.
The whole image is strictly grayscale: skin, hair, clothes and objects are black, white and gray.
The ONLY color in the whole image is flat saturated red (#E02424) on the single element named below.
Pure solid black background (#000000), no floor, no ground shadow, no scenery, no vignette, no gradient.
No text, letters, numbers, speech bubbles, arrows, circles, speed lines, impact effects, watermark.
Characters fully inside the frame, generous empty black margins. Original characters, not resembling any real person or existing cartoon.
No blood, wounds, bruises, broken teeth or weapons.
```

## REF (в каждую позу, не в лист)
```
Use the attached character sheet strictly for this character's design: same face, hair, scar, body proportions and clothes. Keep features exactly the same, change only the pose.
```

## Персонажи (вставлять после STYLE)
**Тэцу** (красное: бинты на кистях)
```
Character: Tetsu, original male boxer, 24 years old, lean wiry athletic build with defined muscles, grayscale skin, short dark undercut hair, sharp focused eyes, thin scar across the left eyebrow, shirtless, dark gray knee-length fight shorts, barefoot, red (#E02424) boxing hand wraps on both hands and wrists.
```
**Громила** (красного нет; вместо строки «ONLY color» писать `This image has NO red or any color, fully black, white and gray.`)
```
Character: Gromila, original huge heavyweight fighter, about 2 meters tall, massive bulky body twice the width of an average man, bald head, thick dark full beard, small narrow eyes, gray sleeveless tank top, dark sweatpants, bare fists.
```
**Док** (красного нет)
```
Character: Doc, original old boxing coach and sports scientist, 65 years old, short gray crew-cut hair, gray stubble, round glasses, wise wrinkled face, whistle on a cord around the neck, zipped old tracksuit jacket, towel over one shoulder, wiry build.
```
Лист (для всех трёх): `Character design sheet: the same character shown three times side by side, front view, side view, back view, standing relaxed, full body.`

## Сцены хука (6 штук → `scenes/`)
В каждой слева или сверху оставить пустую чёрную зону под текст. Персонажей вставлять описаниями выше, прикладывать оба листа.

| Файл | Промт сцены | Красное |
|---|---|---|
| `s1_hook.png` | `Wide shot. Gromila stands on the right facing left, Tetsu on the left facing right, in the middle of a left hook that stops one centimeter before Gromila's chin, Gromila's head slightly turned. Top third of the frame empty black.` | бинты Тэцу |
| `s2_size.png` | `Wide shot. Tetsu and Gromila stand side by side facing the viewer, relaxed. Gromila is clearly a head and a half taller and much wider. Right fifth of the frame empty black.` | бинты Тэцу |
| `s3_punch.png` | `Medium shot, side view. Tetsu's left fist in a hook stops one centimeter before Gromila's jaw. The jawline of Gromila is clearly visible, his head starting to turn. No contact, no injury. Left third empty black.` | линия челюсти Громилы (тонкая красная подсветка контура) |
| `s4_myth.png` | `Medium shot. Gromila proudly flexes both arms showing huge biceps, arrogant grin. Tetsu stands small next to him with crossed arms and a skeptical look. Right half empty black.` | бицепсы Громилы |
| `s5_doc.png` | `Medium shot. Doc stands facing the viewer holding a clipboard and raising one finger, serious look over his glasses. The right half of the frame empty black.` | нет (весь кадр серый) |
| `s6_three.png` | `Medium shot. Gromila on one knee, dazed, one hand on the ground, head slightly bowed. Tetsu stands behind him in a calm guard stance. Top third of the frame empty black.` | бинты Тэцу |

Научный кадр «мозг в черепе» (для сцены 6 и блока «почему»): `Side profile cross-section of a bald bearded heavyweight's head and neck as an anatomical cartoon illustration, skull visible, brain inside it.` Красное: мозг. Без крови.

## Что добавляет Claude поверх (в картинки это НЕ рисовать)
Белые рукописные надписи (шрифт Caveat / Marck Script), красные стрелки от руки с анимацией «дорисовки», кружки и подчёркивания, штамп «МИФ», брызги пота, вспышки удара, тряска и наезд камеры, субтитры, голос и звук.

## Чек-лист
- [ ] Фон ровно #000000, без пола и виньетки.
- [ ] Серая гамма, красный только на указанном элементе.
- [ ] Нет букв, стрелок, эффектов.
- [ ] Герои целиком в кадре, совпадают с листом.
- [ ] Ни крови, ни ран, ни оружия.
- [ ] Пустая зона под текст есть и она чёрная.
