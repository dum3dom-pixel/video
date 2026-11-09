# Стиль картинок и ТЗ для Codex: «Давай посчитаем»

Стиль специально отличается от бумажного коллажа Саши, чтобы линейка узнавалась с первого кадра: **научный плакат** — плоская заливка, толстый чернильный контур, кремовая миллиметровка, мало цветов. Codex рисует только плиты без текста; числа, шкалы, подписи и штампы делает код.

## Паспорт стиля

- **Материал:** плоская иллюстрация как в старом учебнике физики или на научном плакате: ровная заливка, толстый тёплый чернильный контур одной толщины, лёгкая печатная зернистость бумаги. Без 3D, глянца, градиентов, фотореализма.
- **Палитра (база):** крем `#F3EBDD`, чернила `#22222A`, жёлтый «краш-тест» `#F2B705`, синий чертёжный `#2E5E8C`, серый `#9AA0A6`, сигнальный красный `#D7362B` (только мелкие детали).
- **Акцент выпуска:** один цвет «субстанции» на ролик (газ, звук, энергия). Задаётся в ТЗ ролика и не встречается больше нигде в кадре.
- **Герой — Испытуемый:** манекен для краш-тестов. Матовое светло-серое тело, сегменты рук и ног с видимыми шарнирами, гладкая овальная голова **без лица**, на висках и на груди жёлто-чёрные круги-мишени из четырёх секторов, руки-«варежки» с четырьмя пальцами. Эмоции только позой.
- **Четыре режима:**
  - БЫТ — обычная русская квартира, двор, подъезд, тёплый дневной или вечерний свет;
  - РАСЧЁТ — Испытуемый или предмет на кремовой миллиметровке с синей сеткой, пусто вокруг;
  - ПОЛЁТ — небо, вид сверху на район, орбита Земли, плоская карта;
  - ПОСЛЕДСТВИЯ — те же быт и двор, но после события: следы, дыра, пустой стул, бланк документа.
- **Формат плит Shorts:** 1440×2560, вертикаль 9:16. Верхние 25 % высоты пустые или спокойные (туда встаёт большое число), нижние 20 % тоже спокойные (интерфейс YouTube).
- **Формат плит длинных роликов:** 2560×1440 (16:9), нижние 20 % спокойные. Листы персонажа 3:2.

## Порядок работы

1. **Лист Испытуемого** (промт 1). Показать мне, сверяем силуэт, мишени, отсутствие лица.
2. **Четыре эталонные плиты**, по одной на режим (промт 2 четыре раза). Утверждённые кладём в `refs/` этой папки и дальше всегда вкладываем как Input image.
3. Плиты конкретного ролика по его списку E из сценария (шаблон промта 2).
4. Каждую генерацию записываем в `generation-log.json` ролика: id, промт, вложения, дата, принято/нет (как в `video-01`).

## Промт 1: лист персонажа

```text
Asset: refs/ispytuemy_sheet.png, character turnaround sheet for an original recurring character called the Test Subject: a generic crash-test dummy who stands in for the viewer.

Character: adult-sized crash-test dummy with a matte light-grey body (#9AA0A6 with slightly lighter highlights), clearly segmented limbs with simple visible hinge joints at shoulders, elbows, hips and knees, a smooth oval head with NO face at all (no eyes, no mouth, no nose, only one thin vertical seam line), yellow-and-black four-quadrant calibration target circles (#F2B705 and #22222A) on both temples and in the center of the chest, simple mitten-like hands with four fingers, plain feet. Friendly, slightly clumsy proportions, never scary, never robotic-menacing.

Sheet layout: seven full-body views of the same character in a clean row-and-grid layout on plain cream background #F3EBDD: front, three-quarter, side, back, sitting on a plain stool, standing with arms spread as if surprised, and floating horizontally as if flying. Same scale and same design in every view. Intact figures only, never separated body parts or assembly diagrams.

Style/material: flat illustration like a vintage school physics textbook or science poster. Even flat fills, one consistent thick warm ink outline (#22222A), subtle printed-paper grain. No 3D rendering, gloss, gradients, photorealism, painterly brushwork.

Palette: cream #F3EBDD, ink #22222A, crash-test yellow #F2B705, blueprint blue #2E5E8C, grey #9AA0A6. No other colors.

Output: one opaque PNG, 3:2 landscape, at least 2400x1600.

Strict exclusions: no text, letters, numerals, labels, arrows, logos, watermarks, signatures, speech bubbles, motion lines or drawn effects. No face of any kind. No blood, wounds, weapons, brands or real people.
```

## Промт 2: шаблон плиты

Заполнить три поля в угловых скобках, остальное не менять. Вкладывать: Input image 1 — лист Испытуемого (если он в кадре), Input image 2 — утверждённая эталонная плита того же режима.

```text
Asset: <id плиты>.png, one complete scene for a vertical science-comedy Short. Mode: <БЫТ / РАСЧЁТ / ПОЛЁТ / ПОСЛЕДСТВИЯ — переведи на английский: HOME / CALCULATION / FLIGHT / AFTERMATH>.

Scene: <что на картинке, по-английски, 1–3 предложения: где, кто, поза, ключевой предмет>.

Character: if the Test Subject appears, he matches Input image 1 exactly: matte grey crash-test dummy, no face, yellow-black target circles on temples and chest, visible hinge joints. Emotion only through pose.

Mode look:
- HOME: an ordinary Russian apartment, courtyard or stairwell, warm natural light, simple believable furniture.
- CALCULATION: the subject or object alone on cream graph paper #F3EBDD with a fine blueprint-blue grid #2E5E8C, lots of empty space around.
- FLIGHT: sky, aerial view of a residential district of panel buildings, or Earth from orbit, drawn as flat poster shapes.
- AFTERMATH: the same home or courtyard after the event, shown only through objects (a hole, an empty chair, scattered papers, a blank form), never through injured bodies.

Style/material: flat illustration like a vintage school physics textbook or science poster, even flat fills, one consistent thick warm ink outline #22222A, subtle printed-paper grain; match the look of Input image 2. No 3D, gloss, gradients, photorealism or painterly brushwork. Do not bake in blur, glow, film grain, vignette, flashes or particles: code adds them later.

Palette: cream #F3EBDD, ink #22222A, crash-test yellow #F2B705, blueprint blue #2E5E8C, grey #9AA0A6, signal red #D7362B only on tiny details. Episode accent <hex и что им окрашено, или "none">.

Output/composition: one opaque PNG, exactly 1440x2560 pixels, portrait 9:16. The top 25 percent of the height stays calm and nearly empty (a big number will be placed there in code). The lowest 20 percent stays calm (platform interface). Main subject in the middle band.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, signs, posters with writing, labels, arrows, speech bubbles, motion lines, impact bursts or sparkles. Books, papers and forms are blank (forms may have empty boxes and lines only). No blood, wounds, bodies, weapons, brands or real people. Original fictional content only.
```

## Чего не делаем

- Не копируем скелета, 3D-комнату с ковром-мишенью и рентген-синий фон из референса: режимы у нас по смыслу те же, выглядят по-своему.
- Не просим Codex рисовать числа и подписи: он их искажает, а у нас они анимируются.
- Не меняем дизайн Испытуемого между роликами. Это наш «ты», его узнают.
