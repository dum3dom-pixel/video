# ТЗ для Codex: картинка к посту «Предлагай идею» (канал «Вдруг ты»)

Картинка для поста во вкладке «Сообщество»: зрителей просят писать идеи следующих историй «Что, если ты…» в комментариях под постом. Формат квадрат 1:1. Стиль и герой — из бумажного комплекта `branding-paper-2026-11-04/` (бирюзовый фон, кремовые рваные листы, каштановолосый бумажный герой с оранжевыми наушниками). Композицию других каналов не повторять.

Текст, плашки и золотистые буквы кладёт код (Pillow, Arial Narrow Bold, как в `scripts/finish_pack.py`). В картинку ничего не рисуется. Пути вложений относительно `channels/vdrug-ty/branding-paper-2026-11-04/`.

## Что наложит код после генерации

- На пустую кремовую записку: `ЧТО, ЕСЛИ ТЫ…?`
- На нижнюю пустую плашку: `ПИШИ ИДЕЮ ПОД ПОСТОМ`
- Знак вопроса на пустом облачке, если оно останется пустым.

## Вложения

- Input image 1: `references/original-approved.png` (идентичность героя, возраст, оливковая футболка, оранжевые наушники).
- Input image 2: `raw/T3.png` (палитра, материал и бирюзовый фон; композицию, монитор и монету не копировать).

## Сохранить как

`channels/vdrug-ty/community/ideas-post_source.png`

## Промт

```text
Asset: community/ideas-post_source.png, a finished full scene, square social-post hero image inviting viewers to write ideas for the next story. Composition is new; do not copy any existing channel's layout.

Hero: the established paper hero of input image 1, exactly his face, age, tousled chestnut hair with a high cowlick, big serious grey-blue eyes with faint shadows, small straight nose, olive T-shirt with one chest pocket, and the orange headphones around his neck. Expression: curious and inviting, eyebrows slightly drawn together, one eyebrow a little raised, a small half-smile. Pose: three-quarter view, chest-up, placed in the lower right of the frame, one hand pointing down toward the bottom-left corner of the picture, the other hand relaxed. Hair and hands stay fully inside the frame.

Scene: faded teal background as in input image 2, built from overlapping cream torn paper sheets. Upper left: one large blank cream torn-paper note, slightly rotated, with a small piece of paper tape, completely empty, reserved for code text. Around the hero: three small blank paper thought-clouds in mustard, brick brown and olive, different sizes, floating at different heights, completely empty. Bottom: a wide blank mustard paper strip along the lower edge, completely empty, reserved for code text. Top-right area stays quiet. Keep all important content inside the central 85% of the square so a feed crop does not cut it.

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; the face uses small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic, manga or 3D rendering. Do not bake in film grain, noise overlays, vignette, blur or lens effects.

Base palette: faded teal #5E8C8A, mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, warm gray #A59B8C. The only orange is the headphones, exactly as on input image 1. No additional pure white or black flat colors. No red.

Output/composition: one opaque PNG, square 1:1, whole picture to the edges. Largest square size the tool allows (target 2048x2048, never below 1024x1024), report the real size. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, question marks, pseudo-writing, logos, watermarks, captions, speech-bubble text, arrows, comment or app icons, drawn effects. The note, clouds and strip are completely blank. No blood, wounds or weapons. Original fictional character only.
```

## Приёмка

- Герой узнаётся по `original-approved.png` (каштановый вихор, серьёзные глаза, оливковая футболка, оранжевые наушники).
- Записка, три облачка и нижняя плашка полностью пустые.
- Читается при размере 320×320 (контур головы и рука не сливаются с фоном).
- Нет текста, знаков вопроса, красного, чужих символов. Размер файла сообщить в ответе.
- После генерации: наложить текст кодом и проверить, что он не вылезает за центральные 85%.

## Если нужен серебристый Саша из ролика

В комплекте «Вдруг ты» герой каштановый, как на превью, а в самом ролике Саша серебристо-пепельный (`channels/chto-esli/video-01/assets/sheets/sasha_sheet-paper-v1.png`). Для поста в тон комплекту оставь каштанового. Если нужен серебряный, замени Input image 1 на `sasha_sheet-paper-v1.png` и в промте поменяй описание волос на «pale silver-ash spiky tousled hair made of sharp cut-paper strands», убрав наушники.
