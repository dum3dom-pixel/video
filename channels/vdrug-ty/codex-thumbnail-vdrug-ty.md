# Codex: главное превью «Вдруг ты проснулся в 2010…»

Актуальная бумажная версия от 4 ноября 2026 по изображению пользователя. [Готовое превью T2](branding-paper-2026-11-04/thumbnails/T2.png) · [галерея](branding-paper-2026-11-04/index.html) · [полный пакет](codex-thumbnails-pack.md).

В отличие от старого документа здесь используется юный каштановолосый бумажный герой из присланного изображения: узкое лицо, карие глаза, оливковая футболка; оранжевые наушники на шее связывают серию. Предыдущая версия сохранена в `branding-paper-2026-11-04/previous-prompts/`.

## Приложить референс

`channels/chto-esli/video-01/assets/thumbnails/2026-11-03/thumbnail_A_v3.png` — лицо, волосы, одежда, материал бумаги и палитра. Открыть его перед генерацией и приложить именно файл. Не копировать надписи и сюжет про биткоин.

## Фактически использованный промпт

```text
Use case: ads-marketing. Create ONE finished illustration, not a sheet, for an original Russian YouTube channel. Handmade layered cut-paper collage matching attached reference: thick matte colored paper, visible fibres, irregular cut edges, many overlapping paper pieces in hair and clothing, soft short inter-layer shadows, expressive stylized face, no ink outlines, no plastic or 3D render, no neon. Palette: deep petrol teal #203F3D, warm cream, kraft tan, olive, amber/orange #E8732C and golden paper. Hero is EXACTLY the brown-haired youthful male from reference: narrow face, huge warm brown eyes, thick eyebrows, tousled pointed chestnut paper hair with prominent cowlick, olive crew-neck T-shirt. Retain his age and recognizable facial construction; no stubble. Add chunky matte ORANGE paper over-ear headphones resting around his NECK as recurring channel identifier. Image 1 is identity, material and layout reference, NOT a request to repeat Bitcoin scene or any existing text. No other character. Absolutely NO text, letters, digits, symbols, logos, watermark or graphs. All wording and symbols will be added later with code. Keep shapes bold and readable at 170px. Landscape exactly 16:9, ideally 2048x1152. A warm cream torn-paper title area occupies upper LEFT x=0-54%, y=0-40%; keep it EMPTY, calm and clean. Hero face and main prop must stay outside title area. Bottom right 12% by 12% has no essential details. Diffuse warm craft-table light, strong tonal separation.
Scene: secret first item on a plan. Hero on RIGHT chest-up, face large at x=73%, y=40%, very startled realization, eyes wide and mouth parted, one hand naturally raised near chin without covering face. On LOWER LEFT, large plain cream rectangular paper sheet, perfectly front-facing, unrotated, at x=7%-45%, y=43%-94%, with absolutely BLANK surface: no list strokes, no marks, no writing. One small orange paper marker alongside it. Sheet will receive plan heading, five lines and orange redaction later by code. Headphones visible, blank upper left title zone.
```

## Надписи и список кодом

| Элемент | Содержание |
|---|---|
| Первая строка заголовка | ПУНКТ |
| Крупная плашка | №1? |
| Уточнение | ПЛАН СЛОМАЛСЯ |
| Лист | ПЛАН, номера 1–5, линии; первая строка замазана оранжевым |

Все буквы и цифры добавлены кодом. Шрифт — Arial Narrow Bold; фон и основная краска `#203F3D`, золотистый `#F5B92E`, замазка `#E8732C`, кремовый текст на малой плашке. Выходные файлы: `branding-paper-2026-11-04/thumbnails/T2.png` и `T2.jpg`, 1280×720. [Проверка в 170 px](branding-paper-2026-11-04/review/T2-170px.png).

Сборка: `python channels/vdrug-ty/branding-paper-2026-11-04/scripts/finish_pack.py`. Генерация — встроенный `image_gen`; исходник `branding-paper-2026-11-04/raw/T2.png`.

Для сравнения готовы T1 (календарь 2010), T3 (биткоин без неподтверждённых сумм) и T6 (тот же план без героя). Результаты CTR не измерялись. Не смешивать в одном сравнении с T4/T5: они про деньги и бессмертие.

