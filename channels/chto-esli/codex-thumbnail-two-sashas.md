# Превью ролика 01: два Саши (12 и 33), биткоин только на фоне

Заменяет `codex-thumbnails-silver-sasha.md` (он про серебряного Сашу, мы вернулись к старому, русому). Решение автора: превью в стиле «мелкий и взрослый», слово «биткоин» в тексте не выносим, чтобы не собирать аудиторию, которая ищет про крипту. Монета остаётся только предметом на заднем плане.

## Что нужно от Codex

Одна картинка-основа 16:9 (лучше 2048×1152), без единой буквы, цифры и значка. Все надписи, подписи «12 ЛЕТ» / «33 ГОДА», значок монеты и красный акцент добавляет код.

Вложения (пути от `video-01/assets/`):
1. `sheets/sasha_ages_sheet.png` — личность и материал. Мелкий: первый слева (зелёная футболка с карманом). Взрослый 33: четвёртый (светлая рубашка, лёгкая щетина) или пятый (бирюзовый свитер поверх воротника). Берём бирюзовый свитер, он контрастирует с оранжевой кассетой.
2. `sheets/sasha_faces_sheet.png` — выражения лиц.
3. `thumbnails/2026-11-03/thumbnail_A_v3_source.png` — только как образец раскладки и стиля бумажного коллажа. Не повторять сцену с биткоином крупно.

## Промт (английский, как в предыдущих)

```
Use case: ads-marketing. Create ONE finished illustration, not a sheet, for an original Russian YouTube channel. Handmade layered cut-paper collage matching attached references: thick matte colored paper, visible fibres, irregular cut edges, many overlapping paper pieces in hair and clothing, soft short inter-layer shadows, expressive stylized faces, no ink outlines, no plastic or 3D render, no neon. Palette: mustard #D9A441, cream #F1E6CF, brick #8C4A32, olive #7A7F3F, teal #5E8C8A, warm gray #A59B8C. The SAME hero at two ages, EXACTLY as in the ages sheet: brown tousled paper hair with a cowlick, big warm brown eyes, thick eyebrows. Both must be clearly the same person.
Scene: split-age portrait. LEFT third, smaller and slightly lower: the 12-year-old (olive T-shirt with a chest pocket) sitting at a wooden desk, typing on a beige keyboard at a retro beige CRT monitor, seen from the side/three-quarter, calm and unaware. On the CRT screen, soft and out of focus, one plain amber circular paper disk with a totally BLANK face (no symbol), so code can add an emblem later. RIGHT 55%, large and close, the 33-year-old (teal crew-neck sweater over a cream collar, light stubble): elbow on the desk, one hand against his cheek, worried knowing eyes looking straight at camera, slightly raised eyebrows, hand with natural five fingers. In his other hand, low in the corner, a brick-orange retro audio cassette. Subtle wall clock behind them in muted teal. A warm cream torn-paper title area occupies upper LEFT x=0-52%, y=0-36%; keep it EMPTY. Both faces and the CRT must stay outside the title area. Bottom right 12% by 12% has no essential details. Diffuse warm craft-table light, strong tonal separation, bold shapes readable at 170 px.
Absolutely NO text, letters, digits, symbols, logos, watermark, charts or money. No wounds, no blood. No other character. No headphones.
```

## Что кладёт код (после картинки)

- Заголовок на кремовой плашке сверху слева, две строки максимум, чёрные слова на бумаге. Варианты, от лучшего:
  1. `ВЕРНУЛСЯ В 2005-й?`
  2. `МНЕ 12, А ПОМНЮ ВСЁ`
  3. `Я ЗНАЛ, ЧТО БУДЕТ`
- Подписи на бумажных ярлыках: `12 ЛЕТ` у мелкого, `33 ГОДА` у взрослого.
- Значок монеты на пустом диске на экране. Красный #D92F2B только на одном элементе (ярлык или монета).
- Заголовок на превью не повторяет название ролика.

## Проверка перед публикацией

- Превью уменьшить до 170 px: читаются ли оба лица и подписи.
- Взрослый узнаётся как тот же Саша (цвет волос, форма вихра, глаза).
- Загрузить его вторым вариантом рядом с текущим в Studio (Test & compare) и оставить победителя.
