# Промты для реалистичной версии «Браток 90-х»

Куда класть: `my-video\public\real\scene1.png` … `scene8.png`. Сейчас там лежат заглушки, просто замени их.
Формат: вертикальный 9:16, лучше 1080×1920 или крупнее. Можно .png или .jpg, но в .png с тем же именем.

## Как сделать одного и того же героя во всех сценах
1. Генерируй всё в **одном чате** (ChatGPT) или с одной `--cref`-картинкой (Midjourney).
2. Сначала сгенерируй **лист персонажа**, промт 0 ниже. Выбери удачный вариант.
3. Каждую сцену проси так: «Используй этого же персонажа с картинки выше» + промт сцены.
4. Персонаж **выдуманный**. Не пиши имена актёров и не загружай их фото: и сервисы откажут, и публиковать это нельзя.

Общий хвост стиля уже вписан в каждый промт:
`shot on a 1996 VHS camcorder, natural light, realistic photo, slightly soft focus, film grain, fictional person, not a celebrity`

---

### 0. Лист персонажа
> Character reference sheet of a fictional 1990s Russian "new rich" man, early 30s, short dark slicked-back hair, clean-shaven, smug confident smirk, one gold front tooth. Thick gold chain, big gold signet rings. Front view and three-quarter view, neutral grey background, realistic photo, fictional person, not a celebrity.

### 1. Улица (0.0–3.2 с), камера наезжает
> Vertical 9:16 photo. Overcast day in 1996 Moscow city centre, old pre-revolution buildings and a red brick tower in the background. The same man walks straight toward the camera with a smug smirk, black leather jacket over a paisley shirt, thick gold chain, a stack of newspapers under his arm. Two big bodyguards in black behind him, passers-by around. Shot on a 1996 VHS camcorder, natural light, realistic photo, slightly soft focus, film grain, fictional person, not a celebrity.

### 2. Сауна (3.2–4.2 с), камера отъезжает
> Vertical 9:16 photo. 1990s Russian sauna lounge: wooden log walls, brick stove, warm orange light. The same man sits at a wooden table full of fruit and vodka, raising a shot glass to the camera. He wears a burgundy blazer over a bare chest, thick gold chain. Behind him two women in fur coats, fully dressed. Shot on a 1996 VHS camcorder, warm light, realistic photo, slightly soft focus, film grain, fictional people, not celebrities.

### 3. Застолье (4.2–5.9 с), крупный план, наезд
> Vertical 9:16 photo, wide-angle close-up. Restaurant banquet with warm yellow light. The same man in a burgundy velvet jacket leans close to the lens, talking and gesturing with a hand covered in big gold rings, gold tooth visible in his grin. Two women blurred over his shoulder. Shot on a 1996 VHS camcorder, realistic photo, slightly soft focus, film grain, fictional people, not celebrities.

### 4. Зеркало (5.9–8.4 с), панорама влево
> Vertical 9:16 photo, over-the-shoulder shot into an ornate carved wooden mirror with small warm lights around it. The same man fixes his hair and smiles smugly at his reflection, burgundy blazer, paisley shirt, gold chain. Shot on a 1996 VHS camcorder, realistic photo, slightly soft focus, film grain, fictional person, not a celebrity.

### 5. Телефон у машины (8.4–10.9 с), камера вверх
> Vertical 9:16 photo. Night street, the same man leans out of a black 1990s sedan, talking on a huge brick-shaped cellphone with an antenna, holding a thick wad of cash, glancing up. Black suit, gold chain, street lamps reflecting on the car. Shot on a 1996 VHS camcorder at night, realistic photo, noisy, slightly soft focus, film grain, fictional person, not a celebrity.

### 6. Побег через окно (10.9–12.9 с), панорама вправо
> Vertical 9:16 photo. Night, low angle from behind the roof of a black car, looking up at a brick apartment building. In a lit second-floor window a dark silhouette climbs out and lowers a big sack on a rope. Shot on a 1996 VHS camcorder at night, realistic photo, noisy, film grain.

### 7. Храм (12.9–17.9 с), камера вниз к рукам
> Vertical 9:16 photo. Inside an Orthodox church: golden icons, many thin candles, warm dim light. The same man in a black leather jacket stands among bodyguards in black and old women in headscarves, hands folded on his chest, huge gold rings and bracelets on both hands clearly visible in the lower part of the frame. Shot on a 1996 VHS camcorder, realistic photo, slightly soft focus, film grain, fictional people, not celebrities.

### 8. Кортеж (17.9–21.7 с), панорама вправо
> Vertical 9:16 photo. Daytime, wide wet city avenue after rain. A black 1990s German sedan drives past the camera from left to right, the same man at the wheel with a blonde woman beside him, a convoy of black cars following behind. Reflections on wet asphalt. Shot on a 1996 VHS camcorder, realistic photo, slightly soft focus, film grain, fictional people, not celebrities.

---

После замены картинок пересобери ролик (из папки `my-video`):
```
npx remotion render BratokReal out/BratokReal.mp4
```
