# ТЗ для Codex: картинки канала «Наука боя» (партия 1)

Скопируй этот файл в Codex целиком. Codex генерирует картинки и сохраняет их по путям ниже. Анимацию, спидлайны, вспышки, стрелки и текст потом добавляет Claude в Remotion.

---

## Задача для Codex

Сгенерируй картинки для анимационного YouTube-канала в стиле манги и сохрани каждую PNG строго по указанному пути и с указанным именем. Корень:

```
C:\Users\daatva\Desktop\video\my-video\public\explainer\nauka-boya\
```

Порядок работы:
1. Сначала **листы персонажей** (`*/sheet.png`). Покажи их мне и жди «ок».
2. Потом позы. **К каждому запросу позы прикладывай лист этого персонажа как референс** и добавляй фразу из блока REF.
3. Каждая картинка: PNG, вертикальная **1024×1536** (позы и листы) или горизонтальная **1536×1024** (научные плиты). Фон **чистый чёрный #000000**: движок кладёт картинку на чёрный экран, серый или градиентный фон будет виден.
4. После генерации проверь картинку по чек-листу в конце. Если не проходит — перегенерируй.

### STYLE — добавлять в КАЖДЫЙ промт
```
Black and white manga ink illustration, detailed linework and hatching, grayscale skin and hair.
The ONLY color in the whole image is bright orange (#E8732C) on the element named below; everything else is strictly black, white and gray.
Isolated on a pure solid black background (#000000), no ground shadow, no scenery, no floor line.
No text, no letters, no numbers, no speech bubbles, no speed lines, no impact effects, no watermark.
High contrast, generous empty margins around the figure, nothing cropped. Original character, does not resemble any real person.
```

### REF — добавлять в каждую позу (не в лист)
```
Use the attached character sheet strictly for this character's design: same face, hair, scar, body proportions and clothes. Keep features exactly the same, change only the pose.
```

### Безопасность (для всех картинок)
Без крови, ран, синяков, выбитых зубов и оружия. Боевые позы — спортивные: стойка, удар по воздуху или по мешку.

---

## 1. Тэцу — главный герой → папка `tetsu/`
Оранжевый элемент: **бинты на обеих кистях** (hand wraps).

**Описание персонажа (вставлять в каждый промт Тэцу):**
```
Character: Tetsu, original male boxer, 24 years old, lean wiry middleweight athletic build with defined muscles,
short dark undercut hair, sharp focused eyes, a thin scar across the left eyebrow, shirtless,
dark gray knee-length fight shorts, barefoot, bright orange (#E8732C) boxing hand wraps on both hands and wrists.
```

| Файл | Поза (вставлять после описания) |
|---|---|
| `sheet.png` | `Character design sheet: the same character shown three times side by side — front view, side view, back view — standing relaxed, full body.` (размер 1536×1024) |
| `guard.png` | `Full body, orthodox boxing stance in 3/4 view facing right, fists up guarding the chin, knees slightly bent, focused look.` |
| `hook_1.png` | `Full body, facing right, start of a left hook: weight loaded on the lead leg, hips beginning to rotate, left elbow raised at shoulder height.` |
| `hook_2.png` | `Full body, facing right, middle of a left hook: torso and hips rotated, lead foot pivoting, left arm bent at 90 degrees swinging horizontally.` |
| `hook_3.png` | `Full body, facing right, end of a left hook: full hip rotation, left fist at the end of the arc at chin height of an imaginary opponent, rear hand guarding the chin.` |
| `jab_1.png` | `Full body, facing right, boxing stance, left fist starting to extend forward.` |
| `jab_2.png` | `Full body, facing right, left arm fully extended in a straight jab, shoulder covering the chin, right hand at the chin.` |
| `fist_closeup.png` | `Extreme close-up of the character's right fist in orange hand wraps punching straight toward the viewer, strong foreshortening, the angry focused face visible behind the fist. Not full body.` |
| `explain.png` | `Full body, facing the viewer, open palm gesture as if explaining something, calm confident half-smile.` |
| `pointing.png` | `Full body, 3/4 view, pointing with the right hand to the left side of the image, looking where he points.` |
| `thinking.png` | `Full body, facing the viewer, hand on chin, skeptical thinking expression.` |
| `shocked.png` | `Full body, facing the viewer, wide eyes and open mouth in surprise, hands slightly raised.` |
| `dodge.png` | `Full body, facing right, slipping a punch: head moved off the center line, knees bent, eyes on the opponent, fists up.` |
| `win.png` | `Full body, facing the viewer, both fists raised overhead in victory, tired but happy.` |
| `bag_1.png` | `Full body, facing right, punching a heavy hanging punching bag with the right hand, bag beginning to swing.` (мешок ч/б, без цвета) |
| `bag_2.png` | `Full body, facing right, returning to guard after punching a heavy hanging punching bag, the bag swinging away.` |

---

## 2. Громила — соперник → папка `gromila/`
Цвета нет. **Вместо STYLE-строки про оранжевый пиши:** `This character has NO orange at all, fully black, white and gray.`

**Описание персонажа:**
```
Character: Gromila, original huge heavyweight fighter, about 2 meters tall, massive bulky body much larger than an average man,
bald head, thick dark full beard, small narrow eyes, gray sleeveless tank top, dark sweatpants, bare fists.
```

| Файл | Поза |
|---|---|
| `sheet.png` | `Character design sheet: front view, side view, back view, standing relaxed, full body.` (1536×1024) |
| `guard.png` | `Full body, facing left, heavy brawler stance, fists low and wide, confident grin.` |
| `laugh.png` | `Full body, facing left, laughing arrogantly, looking down, arms crossed.` |
| `swing.png` | `Full body, facing left, throwing a wide slow overhand punch, off balance, chin exposed.` |
| `stagger_1.png` | `Full body, facing left, head snapped to the side, legs starting to buckle, dazed unfocused eyes. No blood, no injuries.` |
| `stagger_2.png` | `Full body, facing left, dropped to one knee, dazed, one hand on the ground. No blood, no injuries.` |

---

## 3. Док — тренер-учёный → папка `doc/`
Цвета нет (как у Громилы).

**Описание персонажа:**
```
Character: Doc, original old boxing coach and sports scientist, 65 years old, short gray crew-cut hair, gray stubble,
round glasses, wrinkled wise face, whistle on a cord around the neck, old tracksuit jacket zipped up, towel over one shoulder, wiry build.
```

| Файл | Поза |
|---|---|
| `sheet.png` | `Character design sheet: front view, side view, back view, standing relaxed, full body.` (1536×1024) |
| `explain.png` | `Full body, facing the viewer, raising the index finger as if stating an important fact, serious look over the glasses.` |
| `pointing.png` | `Full body, 3/4 view, pointing with a pen to the right side of the image.` |
| `skull_model.png` | `Full body, holding an anatomical human skull model in one hand, looking at it thoughtfully.` |
| `clipboard.png` | `Full body, reading notes on a clipboard, one eyebrow raised.` |

---

## 4. Легенды — безликие силуэты → папка `legends/`
Цвета нет. Лиц не рисуем.
```
Pure black silhouette with a thin bright rim light outline, face completely in shadow with no facial features,
anonymous figure that does not resemble any specific real person, isolated on a pure solid black background, no text.
```

| Файл | Описание |
|---|---|
| `boxer_80s.png` | `Full body silhouette of a short, extremely muscular heavyweight boxer with a thick neck, in a tight peek-a-boo guard, boxing gloves and trunks.` |
| `martial_artist_70s.png` | `Full body silhouette of a very lean, shredded martial artist in a side kung-fu stance, bare feet, one hand forward.` |
| `wrestler.png` | `Full body silhouette of a stocky wrestler in a low wrestling stance, arms forward.` |

---

## 5. Научные плиты → папка `science/` (1536×1024)
Тот же STYLE. Оранжевым — **только смысловой фокус**, указан в каждой строке. Анатомия схематичная, в духе медицинской гравюры в стиле манги, без крови.

| Файл | Описание | Оранжевое |
|---|---|---|
| `head_brain_side.png` | `Side profile cross-section of a human head showing the skull and the brain inside it, clean anatomical manga engraving.` | мозг |
| `brain_shift_1.png` | `Top-down view of a human head cross-section: skull and brain centered, at rest.` | мозг |
| `brain_shift_2.png` | `Same top-down view, the head rotated sharply to one side and the brain lagging behind inside the skull, showing rotation.` | мозг |
| `chin_lever.png` | `Side profile of a man's head and neck, calm face, the chin and jaw line clearly visible.` | подбородок и линия челюсти |
| `fist_xray.png` | `Clenched fist shown half as skin and half as an x-ray of the hand bones.` | костяшки указательного и среднего пальцев |
| `kinetic_chain.png` | `Tetsu (same character design: dark undercut, eyebrow scar, gray shorts) throwing a right cross, his body shown as an anatomical muscle illustration.` | мышцы цепочки: икра, бедро, косые мышцы живота, плечо (бинты в этой картинке ч/б) |
| `size_compare.png` | `Tetsu (lean middleweight) and Gromila (huge bald bearded heavyweight) standing side by side facing each other, full body, showing the big size difference.` | бинты Тэцу |

---

## 6. Превью ролика 01 → папка `thumb/` (1536×1024, потом обрежу до 1280×720)
Тот же STYLE, фон чёрный. Текст и дугу траектории не рисовать — их добавлю сам. Левая треть кадра должна остаться пустой (место под текст).

| Файл | Описание | Оранжевое |
|---|---|---|
| `thumb_lever.png` | `Right two thirds of the frame: large side profile of Gromila's head and thick neck (huge bald bearded man, same design as his sheet), shown as a manga anatomical cut-away revealing the skull and the brain inside, the brain slightly shifted inside the skull. Tetsu's fist in orange hand wraps (same design as his sheet) enters from the left and stops one centimeter before Gromila's chin. Left third of the frame empty black. Dramatic contrast, strong focus on chin and brain. No blood.` | мозг и бинты на кулаке |

---

## Чек-лист каждой картинки (проверь сам до сдачи)
- [ ] Фон ровно чёрный, без виньетки, градиента и пола.
- [ ] Цвет есть только оранжевый и только там, где указано.
- [ ] Нет текста, букв, цифр, спидлайнов и эффектов.
- [ ] Фигура целиком, ничего не обрезано (кроме `fist_closeup`).
- [ ] Персонаж совпадает с листом: лицо, причёска, шрам, одежда.
- [ ] Ни крови, ни ран, ни оружия. Лица легенд не видно.
- [ ] Путь и имя файла точно как в таблице.

Готово, когда все файлы лежат в папках `tetsu/`, `gromila/`, `doc/`, `legends/`, `science/`. Пришли список файлов и превью листов.
