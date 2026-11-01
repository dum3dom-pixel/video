# ТЗ для Codex: все картинки ролика 01 по сценарию v5 (полные промты)

Файл сгенерирован `video-01/scripts/build_codex_prompts.py`; правим таблицу в скрипте, не этот файл. Правила, порядок работы и приёмка: [codex-video-01-full.md](codex-video-01-full.md). Пути в вложениях относительно `video-01/assets/`.

Обозначения: **A** = нужна для основной истории, **B** = запасной кадр (если картинок не хватает, код закрывает ближайшим). **wide** = целая сцена 16:9, **cu** = крупный план 16:9 (рисуется сразу крупно, зумить его не нужно), **bg** = пустой задник, **sheet** = лист 3:2.

## 0. Листы персонажей и предметов (делаем первыми)

| ID | Тип | Приор. | Момент | Вложения | Красный | Камера (код) | Код добавляет |
|---|---|---|---|---|---|---|---|
| `sasha_ages_sheet` | sheet | A | Саша в 5 возрастах: 12, 15, 19, 26, 33 | sasha_sheet_hd | нет | дрейф ≤1.08× | Единственная опора для взрослого Саши в кадрах |
| `sasha_faces_sheet` | sheet | A | Лица Саши крупно: 6 голов (12, 15, 19, 26, 31, 33) | sasha_sheet_hd | нет | дрейф ≤1.08× | Эталон лица для крупных планов |
| `kostya38_sheet` | sheet | A | Костя в 38: лысый, лист по образцу листа Кости | kostya_sheet_hd | нет | дрейф ≤1.08× | Финал; контраст с 17-летним Костей из хука |
| `ded_sheet` | sheet | A | Дед Лёша, ~72 года | mama_sheet_hd | нет | дрейф ≤1.08× | — |
| `lena_sheet` | sheet | A | Лена, 26 лет | mama_sheet_hd | нет | дрейф ≤1.08× | — |
| `supporting_cast_sheet` | sheet | A | Массовка: Димка 12 и 19, Гена, учительница, продавщица | sasha_sheet_hd | нет | дрейф ≤1.08× | — |
| `props_misc_sheet` | sheet | A | Мелкие предметы: паяльник, копилка, смартфон, чашки | — | нет | дрейф ≤1.08× | — |

## 0. Задники (пустые комнаты, без людей)

| ID | Тип | Приор. | Момент | Вложения | Красный | Камера (код) | Код добавляет |
|---|---|---|---|---|---|---|---|
| `bg_classroom` | bg | A | Класс 2005, пустой | bg_door_wall_hd | нет | дрейф ≤1.08× | — |
| `bg_kostya_room` | bg | A | Комната Кости | bg_door_wall_hd | нет | дрейф ≤1.08× | — |
| `bg_yard` | bg | A | Двор в мае: панельный дом, гаражи, старый тополь | bg_door_wall_hd | нет | дрейф ≤1.08× | Для e3_bench, e3_fallen и зимней версии |
| `bg_garage` | bg | A | Гараж деда: верстак, паяльник, радио | bg_door_wall_hd | нет | дрейф ≤1.08× | — |
| `bg_terrace` | bg | A | Терраса, июль 2019 | bg_door_wall_hd | нет | дрейф ≤1.08× | — |
| `bg_kitchen_adult` | bg | A | Кухня взрослого Саши (2024 и 2026) | bg_kitchen-v2 | нет | дрейф ≤1.08× | — |

## Хук 0:00–0:38

| ID | Тип | Приор. | Момент | Вложения | Красный | Камера (код) | Код добавляет |
|---|---|---|---|---|---|---|---|
| `h_sasha_palm` | wide | A | [ладонь на лице] «Ты помнишь следующие двадцать один год» | bg_door_wall_hd, sasha_sheet_hd | нет | медленный наезд до 1.10× | Текст-мысль «Прекрасно…» |
| `h_school_bag` | wide | B | [Мысль] «…а в школу всё равно идти» | bg_door_wall_hd | нет | дрейф ≤1.08× | Мысль подписью, можно заменить p4_sasha |
| `h_cassette_box` | wide | A | [коробка кассет] «…ты поставишь брату одну из своих кассет» | props_tape_sheet-v2 | нет | проезд вдоль ряда до «2024», затем врезка CU | Годы на наклейках, остановка на «2024» |
| `h_cassette_2024_cu` | cu | A | Крупно кассета «2024» (наклейка пустая) | props_tape_sheet-v2 | нет | дрейф ≤1.08× | Год «2024» на наклейке накладывает код, красным |
| `h_kostya_hair_cu` | cu | A | Крупно: Костя 17 лет, волосы и лицо (вместо зума 2.6×) | kostya_sheet_hd, bg_door_wall_hd | нет | без зума; дрейф ≤1.05× | Заменяет digital zoom на p2_kostya |
| `h_sasha_eyes_cu` | cu | A | Крупно: глаза Саши 12 лет (вместо зума 2.6×) | sasha_sheet_hd, sasha_faces_sheet | нет | без зума; дрейф ≤1.05× | Заменяет digital zoom на p4_sasha |

## Правила 0:38–1:18

| ID | Тип | Приор. | Момент | Вложения | Красный | Камера (код) | Код добавляет |
|---|---|---|---|---|---|---|---|
| `r_paper_desk` | wide | A | Фон под три правила (текст кладёт код) | bg_door_wall_hd | нет | дрейф ≤1.08× | «Перезапуска нет» / «Словам не верят» / «Знание тает»; третье правило: текст тает |
| `r_adults_soup` | wide | A | «Взрослые кивают и просят доесть суп» | bg_kitchen-v2, mama_sheet_hd, papa_sheet, sasha_sheet_hd | the lifebuoy fridge magnet only if the fridge is in frame | дрейф ≤1.08× | Лёгкий «кивок» двух бумажных слоёв |

## Эпоха 1. День первый 1:18–2:36

| ID | Тип | Приор. | Момент | Вложения | Красный | Камера (код) | Код добавляет |
|---|---|---|---|---|---|---|---|
| `e1_mama_bread` | wide | A | «Мама режет хлеб и спрашивает, почему ты так смотришь» | bg_kitchen-v2, mama_sheet_hd, sasha_sheet_hd | the lifebuoy fridge magnet only if the fridge is in frame | медленный наезд до 1.10× | — |
| `e1_videocall` | cu | A | Воспоминание: «видеосвязь, мама просит включить звук» | mama_sheet_hd, props_misc_sheet | нет | дрейф ≤1.08× | Значок выключенного микрофона, лёгкое «зависание» кадра; тон холоднее |
| `e1_oilcloth` | cu | A | Макро: клеёнка с надорванным краем, ладонь Саши | bg_kitchen-v2 | нет | наезд до 1.10× | «Клеёнку выбросят через четыре года» |
| `e1_papa_pan` | wide | A | «Папа ест яичницу со сковородки и читает газету. У него усы» | bg_kitchen-v2, papa_sheet, sasha_sheet_hd | the lifebuoy fridge magnet only if the fridge is in frame | наезд на усы до 1.10×, дальше CU | — |
| `e1_papa_lowers` | wide | A | «Папа медленно опускает газету» | papa_sheet, e1_papa_pan | нет | медленный наезд до 1.10× | — |
| `e1_cocoa` | wide | A | «Ты просишь кофе. Мама ставит перед тобой какао» | bg_kitchen-v2, mama_sheet_hd, sasha_sheet_hd | the lifebuoy fridge magnet only if the fridge is in frame | дрейф ≤1.08× | — |
| `e1_clock_ten` | wide | B | «Отбой в десять. Тебе тридцать три» | bg_door_wall_hd, sasha_sheet_hd, props_misc_sheet | нет | дрейф ≤1.08× | Подпись «Отбой в 22:00»; можно заменить ближайшим кадром |
| `e1_school_board` | wide | A | «Сколько будет три пятых плюс две седьмых — ты не знаешь» | bg_classroom, sasha_sheet_hd, supporting_cast_sheet | нет | дрейф ≤1.08× | Дроби и вопросительный знак рисует код, меловым шрифтом |
| `e1_plan_night` | wide | A | «Вечером ты пишешь план. Очень взрослый» | bg_door_wall_hd, sasha_sheet_hd | нет | медленный наезд до 1.10× | — |
| `e1_plan_sheet` | cu | A | Листок «ПЛАН» сверху (пункты пишет код) | bg_door_wall_hd | нет | наезд до 1.10× | «ПЛАН», пункты 1…7, «биткоин» на седьмом |
| `e1_lights_out` | wide | A | «Через полчаса мама выключает свет» | bg_door_wall_hd, mama_sheet_hd, sasha_sheet_hd | нет | дрейф ≤1.08× | Щелчок выключателя, затемнение |

## Эпоха 2. Первые месяцы 2:36–4:11

| ID | Тип | Приор. | Момент | Вложения | Красный | Камера (код) | Код добавляет |
|---|---|---|---|---|---|---|---|
| `e2_try_mama` | wide | A | Попытка 1: маме про телефон без кнопок | bg_kitchen-v2, mama_sheet_hd, sasha_sheet_hd | the lifebuoy fridge magnet only if the fridge is in frame | дрейф ≤1.08× | Бумажный смартфон выскакивает и сминается |
| `e2_try_teacher` | wide | A | Попытка 2: учителю про интернет, «Садись, два» | bg_classroom, supporting_cast_sheet, sasha_sheet_hd | нет | дрейф ≤1.08× | Бумажная «2» шлёпается в дневник |
| `e2_try_dimka` | wide | A | Попытка 3: Димка «А игры там есть?» | supporting_cast_sheet, sasha_sheet_hd | нет | дрейф ≤1.08× | — |
| `e2_stairs` | wide | A | [лбом о перила] «держать всё в голове невыносимо, мелочи уже тают» | bg_door_wall_hd, sasha_sheet_hd | нет | дрейф ≤1.08× | Лёгкий «тук» на «стукаешься» |
| `e2_kostya_room` | wide | A | «У Кости есть двухкассетник. «Зачем тебе?» — «Голос записывать»» | bg_kostya_room, kostya_sheet_hd, sasha_sheet_hd, props_tape_sheet-v2 | the record key of the deck (one key) | дрейф ≤1.08× | — |
| `e2_kostya_gives` | wide | A | «Костя долго смотрит и отдаёт магнитофон» | bg_kostya_room, kostya_sheet_hd, sasha_sheet_hd, props_tape_sheet-v2 | the record key of the deck (one key) | медленный наезд до 1.10× | — |
| `e2_market` | wide | A | «Кассета на рынке стоит тридцать пять рублей» | props_tape_sheet-v2, supporting_cast_sheet, sasha_sheet_hd | нет | дрейф ≤1.08× | Бумажный ценник |
| `e2_labels` | wide | A | «Берёшь двадцать одну… подписываешь маминым маркером» | props_tape_sheet-v2, bg_door_wall_hd | нет | проезд по ряду | Годы 2006…2025 появляются по одному; «2026» уезжает вбок |
| `e2_rec_keys` | cu | A | Макро: два пальца жмут две кнопки; катушки | props_tape_sheet-v2 | the record key of the deck | дрейф ≤1.08× | Вращение катушек, щелчок «Начинаешь с конца» |
| `e2_recording` | wide | A | «— Привет. Это ты. Только старше. Не выключай» | bg_door_wall_hd, sasha_sheet_hd, props_tape_sheet-v2 | the record key of the deck | медленный наезд до 1.10× | — |
| `e2_life_work` | wide | B | «работа» (взрослая жизнь по кассете 2025) | — | нет | дрейф ≤1.08× | Счётчик ленты |
| `e2_life_bus` | wide | B | «маршрутка» | — | нет | дрейф ≤1.08× | — |
| `e2_life_sofa` | wide | B | «сериал перед сном» | — | нет | дрейф ≤1.08× | Шипение, зерно сильнее |
| `e2_2024_night` | wide | A | «На кассете 2024 одна минута: брат берёт трубку с первого гудка» | props_misc_sheet | нет | дрейф ≤1.08× | Врезка наклейки «2024», титр «Он ответил» |

## Эпоха 3. Тополь 4:11–4:41

| ID | Тип | Приор. | Момент | Вложения | Красный | Камера (код) | Код добавляет |
|---|---|---|---|---|---|---|---|
| `e3_bench` | wide | A | «Костя. В субботу во дворе упадёт тополь… Убери велик» | bg_yard, kostya_sheet_hd, sasha_sheet_hd | нет | панорама на тополь до 1.10× | Тополиный пух слоем |
| `e3_fallen` | wide | A | «В субботу тополь падает на гаражи» | bg_yard, kostya_sheet_hd | нет | дрейф ≤1.08× | Встряска, облако пуха |
| `e3_bed_edge` | wide | A | «Вечером Костя садится на край кровати. — Ладно. Что надо?» | bg_carpet_wall_hd, kostya_sheet_hd, sasha_sheet_hd | нет | медленный наезд до 1.10× | — |

## Эпоха 3б. План на 21 год 4:41–5:33

| ID | Тип | Приор. | Момент | Вложения | Красный | Камера (код) | Код добавляет |
|---|---|---|---|---|---|---|---|
| `e3b_notebooks` | wide | A | «Операция «Мелкий»»: две тетради на одном столе | bg_door_wall_hd, kostya_sheet_hd, sasha_sheet_hd | нет | дрейф ≤1.08× | Титр «2006 · 13 лет» |
| `e3b_gena` | wide | A | Гена подходит и идёт обратно | supporting_cast_sheet, sasha_sheet_hd | нет | дрейф ≤1.08× | — |
| `e3b_fractions_cu` | cu | B | «Дроби ты тоже победил» | — | нет | дрейф ≤1.08× | «31/35» рисует код |
| `e3b_library` | wide | B | Библиотека: самоучитель английского | sasha_sheet_hd | нет | дрейф ≤1.08× | — |
| `e3b_computer` | wide | A | Компьютер в зале: час в день | bg_door_wall_hd, sasha_sheet_hd, props_misc_sheet | нет | дрейф ≤1.08× | Часы «1 час» наложение |
| `e3b_piggybank` | cu | A | Копилка из-под конфет и листок ПЛАН, пункт седьмой обведён | props_misc_sheet | нет | дрейф ≤1.08× | Обводка пункта 7 — код |

## Эпоха 4. Октябрь 2008 5:33–6:50

| ID | Тип | Приор. | Момент | Вложения | Красный | Камера (код) | Код добавляет |
|---|---|---|---|---|---|---|---|
| `e4_flash_papers` | wide | A | Флешбек: папа с банковскими бумагами | bg_kitchen-v2, papa_sheet | the lifebuoy fridge magnet only if the fridge is in frame | дрейф ≤1.08× | Сепия, бумажная бирка «$» |
| `e4_car_taken` | wide | A | «Машину забрали» | bg_yard, papa_sheet | нет | дрейф ≤1.08× | Стрелка ×1,5 |
| `e4_silent_dinner` | wide | A | «Папа год молчал за ужином» | bg_kitchen-v2, papa_sheet, mama_sheet_hd, sasha_ages_sheet | the lifebuoy fridge magnet only if the fridge is in frame | дрейф ≤1.08× | — |
| `e4_suitcase` | wide | A | «Через два года родители разъехались» | bg_door_wall_hd | нет | дрейф ≤1.08× | — |
| `e4_straight_a` | wide | A | «…три года учился на одни пятёрки» | bg_door_wall_hd, sasha_ages_sheet | нет | дрейф ≤1.08× | Пятёрки шлёпаются в дневник |
| `e4_warn_kitchen` | wide | A | Сентябрь 2008: «Пап, никогда не бери кредит в долларах» | bg_kitchen-v2, sasha_ages_sheet, papa_sheet | the lifebuoy fridge magnet only if the fridge is in frame | дрейф ≤1.08× | — |
| `e4_cassette_night` | wide | A | Ночь, кассета «2008» (кассета отвечает на просьбу) | bg_door_wall_hd, sasha_ages_sheet, props_tape_sheet-v2 | нет | дрейф ≤1.08× | — |
| `e4_briefcase` | wide | A | Четверг: «Банк завтра в десять» — папа складывает бумаги | bg_kitchen-v2, papa_sheet, sasha_ages_sheet | the lifebuoy fridge magnet only if the fridge is in frame | дрейф ≤1.08× | Титр «Банк завтра в 10:00» |
| `e4_papa_look_cu` | cu | A | Папа долго смотрит на сына: «Ты никогда ни о чём его не просил» | papa_sheet | нет | без зума | Пауза |
| `e4_winter_fork` | wide | A | «Папа откладывает вилку. — Ты откуда знал? — Кассета сказала» | bg_kitchen-v2, papa_sheet, sasha_ages_sheet | the lifebuoy fridge magnet only if the fridge is in frame | дрейф ≤1.08× | — |

## Эпоха 4б. Пункт седьмой 6:50–7:12

| ID | Тип | Приор. | Момент | Вложения | Красный | Камера (код) | Код добавляет |
|---|---|---|---|---|---|---|---|
| `e4b_pc_floor` | wide | A | Системный блок на полу в комнате Кости гудит; мама со счётом за свет | bg_kostya_room, mama_sheet_hd, kostya_sheet_hd, sasha_ages_sheet, props_misc_sheet | нет | дрейф ≤1.08× | Титр «2009 · 15 лет»; гул |
| `e4b_pc_cu` | cu | B | Крупно: гудящий блок | props_misc_sheet | нет | дрейф ≤1.08× | Вращение вентилятора |

## Эпоха 5. Воскресенья 7:12–8:09

| ID | Тип | Приор. | Момент | Вложения | Красный | Камера (код) | Код добавляет |
|---|---|---|---|---|---|---|---|
| `e5_garage` | wide | A | Гараж деда: верстак, паяльник, радио | bg_garage, ded_sheet, sasha_sheet_hd | нет | медленный наезд до 1.10× | — |
| `e5_burn` | wide | A | «Обжигаешь палец. — Терпи, не маленький» | bg_garage, ded_sheet, sasha_sheet_hd | нет | дрейф ≤1.08× | — |
| `e5_sundays` | wide | B | «Почти триста воскресений: радио, велосипед, кран, проводка» | bg_garage, ded_sheet, sasha_ages_sheet | нет | дрейф ≤1.08× | Календарные листки летят |
| `e5_spring_2011` | wide | A | «Весна 2011. Паяльник теперь твой» | bg_garage, sasha_ages_sheet, props_misc_sheet | нет | медленный наезд до 1.10× | Титр «2011 · 18 лет» |
| `e5_iron_palm_cu` | cu | A | Крупно: паяльник на ладони | props_misc_sheet | нет | без зума | Пауза |
| `e5_night_tape` | wide | A | Ночь: ставишь «2024», слушаешь три раза | bg_door_wall_hd, sasha_ages_sheet, props_tape_sheet-v2 | the record key of the deck | медленный наезд до 1.10× | — |

## Монтаж 2011–2015 8:09–8:44

| ID | Тип | Приор. | Момент | Вложения | Красный | Камера (код) | Код добавляет |
|---|---|---|---|---|---|---|---|
| `m_graduation` | wide | A | 2011 · 18 лет: выпускной, пиджак с папиного плеча | sasha_ages_sheet, supporting_cast_sheet | нет | дрейф ≤1.08× | Титр «2011 · 18 лет» |
| `m_dimka_phone` | wide | A | 2012 · 19 лет: Димка с первым смартфоном | supporting_cast_sheet, sasha_ages_sheet, props_misc_sheet | нет | дрейф ≤1.08× | Титр «2012 · 19 лет» |
| `m_kostya_car` | wide | A | 2013 · 20 лет: Костя за рулём подержанной «девятки» | bg_yard, kostya_sheet_hd, sasha_ages_sheet | нет | дрейф ≤1.08× | Титр «2013 · 20 лет» |
| `m_varya_call` | wide | A | 2015 · 22 года: звонок из роддома; ты сползаешь по стене | bg_door_wall_hd, sasha_ages_sheet | нет | дрейф ≤1.08× | Титр «2015 · 22 года» |

## Эпоха 6. Июль 2019 8:44–9:38

| ID | Тип | Приор. | Момент | Вложения | Красный | Камера (код) | Код добавляет |
|---|---|---|---|---|---|---|---|
| `e6_terrace` | wide | A | Июль 2019: тебя знакомят с Леной | bg_terrace, sasha_ages_sheet, lena_sheet | нет | дрейф ≤1.08× | Титр «2019 · 26 лет» |
| `e6_lena_cup_cu` | cu | A | Крупно: Лена греет руки о кружку | lena_sheet | нет | без зума | Реплика про «аллергию на лилии» |
| `e6_dishes` | wide | B | «Будете ругаться из-за немытой посуды» | bg_kitchen_adult | нет | дрейф ≤1.08× | — |
| `e6_station` | wide | B | «Расстанетесь на вокзале» | — | нет | дрейф ≤1.08× | Тихий кадр, без реплик |
| `e6_cups` | wide | A | «Но сначала моешь за собой чашку» | bg_terrace, sasha_ages_sheet, lena_sheet | нет | дрейф ≤1.08× | — |

## Поворот. Март 2024 9:38–10:15

| ID | Тип | Приор. | Момент | Вложения | Красный | Камера (код) | Код добавляет |
|---|---|---|---|---|---|---|---|
| `t_night_kitchen` | wide | A | Март 2024: ночь, телефон тёмный | bg_kitchen_adult, sasha_faces_sheet | нет | медленный наезд до 1.10× | Титр «2024 · 31 год»; холодный тон |
| `t_old_night` | wide | A | Первая жизнь: три часа ночи, ты набираешь брата | bg_kitchen_adult, sasha_faces_sheet | нет | дрейф ≤1.08× | Бесцветный флешбек |
| `t_light_strip` | wide | A | «Из-под двери полоска света: там спит Лена» | bg_kitchen_adult | нет | наезд до 1.10× | — |
| `t_realize_cu` | cu | A | «И тут до тебя доходит» | sasha_faces_sheet | нет | без зума | Пауза без озвучки |

## Финал. Осень 2026 10:15–11:24

| ID | Тип | Приор. | Момент | Вложения | Красный | Камера (код) | Код добавляет |
|---|---|---|---|---|---|---|---|
| `f_kostya_door` | wide | A | Осень 2026: Костя (лысый, 38) с коробкой на пороге | bg_kitchen_adult, kostya38_sheet, sasha_ages_sheet, props_tape_sheet-v2 | нет | дрейф ≤1.08× | Титр «2026 · 33 года» |
| `f_player` | wide | A | Ты ставишь «2024»: тишина, шипение, «Он ответил» | bg_kitchen_adult, sasha_ages_sheet, kostya38_sheet, props_tape_sheet-v2 | the record key of the deck | дрейф ≤1.08× | — |
| `f_kostya_frown` | wide | A | «— Это что? — Ночь, когда ты мне ответил» | kostya38_sheet | нет | медленный наезд до 1.10× | — |
| `f_pat` | wide | A | «— Дурак, — говорит он и хлопает тебя по плечу» | bg_kitchen_adult, kostya38_sheet, sasha_ages_sheet | нет | дрейф ≤1.08× | Тёплый тон возвращается |
| `f_last_tape` | wide | A | «Остаётся одна. «2026», детским почерком» | props_tape_sheet-v2, kostya38_sheet | нет | наезд до 1.10× | Наклейка «2026» детским почерком |
| `f_rec_keys` | cu | A | «Нажимаешь обе кнопки сразу, как учил брат» | props_tape_sheet-v2 | the record key of the deck | без зума | Вращение катушек |
| `f_recording` | wide | A | «…рассказываешь тому пацану, которому некому было сказать» | bg_kitchen_adult, sasha_ages_sheet, kostya38_sheet, props_tape_sheet-v2 | the record key of the deck | медленный наезд до 1.10× | Список «папа сбрил усы…» — титрами |

## Вопрос 11:24–11:38

| ID | Тип | Приор. | Момент | Вложения | Красный | Камера (код) | Код добавляет |
|---|---|---|---|---|---|---|---|
| `q_blank_tape` | cu | A | «Одна кассета, девяносто минут и один человек» | props_tape_sheet-v2 | нет | дрейф ≤1.08× | Вопрос в титре |

## Превью (две обложки)

| ID | Тип | Приор. | Момент | Вложения | Красный | Камера (код) | Код добавляет |
|---|---|---|---|---|---|---|---|
| `pv_a_deck` | wide | A | Превью A: двухкассетник, палец на двух кнопках, кассета «2024» | props_tape_sheet-v2 | the record key of the deck (one key) | статичный | Красное «2024» на наклейке и «1 МИНУТА» |
| `pv_b_boy` | wide | A | Превью B: мальчик 12 лет со взрослыми глазами, календарь за спиной | sasha_sheet_hd, sasha_faces_sheet, bg_carpet_wall_hd | the calendar header | статичный | «МОЛЧАТЬ 21 ГОД» |

## Итого

- sheet: 7
- bg: 6
- wide: 67
- cu: 16
- всего картинок: 96, из них приоритет A: 85, B: 11

Уже готовы и повторно не генерируются: `bg/bg_door_wall_hd.png`, `bg/bg_carpet_wall_hd.png`, `shots/p2_kostya_hd.png`, `shots/p3_calendar_hd.png`, `shots/p4_sasha_hd.png`, листы `sasha_sheet_hd`, `kostya_sheet_hd`, `mama_sheet_hd`, `papa_sheet`, `props_tape_sheet-v2` и кухня `bg_kitchen-v2` (их Codex сделал раньше по старому плану, не перегенерировать; кухня и есть мастер-задник всех кухонных кадров).

---

# Полные промты

## 0. Листы персонажей и предметов (делаем первыми)

### sasha_ages_sheet → `sheets/sasha_ages_sheet.png`

Момент: Саша в 5 возрастах: 12, 15, 19, 26, 33

```text
Asset: sheets/sasha_ages_sheet.png, a reference sheet. Character lineup of Sasha at five ages standing side by side, all front view, same scale reference, neutral standing pose, arms relaxed: 12 (small boy), 15 (lanky teen), 19 (young man, hair a bit longer), 26 (adult, light stubble), 33 (adult, calm, no stubble). It must be unmistakably the same person: same eyes, brows, nose and cowlick; only age and clothing change. Ages 12 and 33 wear what is described; the middle ones wear the clothes described for their age.

Characters (identity must match the attached sheets; the text is the fallback):
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 12 (year 2005): small, thin boy. Home: olive T-shirt with one chest pocket, warm gray trousers, barefoot or in socks. School: cream shirt, warm gray trousers. Outdoors: olive windbreaker.
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 15 (year 2008): taller and lanky, longer arms and neck, hair a little longer, same cowlick, same too-old gaze. Faded teal sweatshirt or cream shirt, warm gray trousers.
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 18 to 20 (years 2011-2013): lean young man, hair slightly longer, first light shadow on the jaw. Graduation: an oversized warm gray blazer that is too wide in the shoulders. Otherwise a mustard hoodie.
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 26 (year 2019): adult man, narrow face, short hair with the cowlick still alive, light stubble, tired kind eyes. Cream linen shirt with rolled sleeves, warm gray trousers.
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 33 (year 2026): adult man, faint lines at the eyes, short neat hair with the cowlick, no stubble, calm eyes, teal-gray sweater over a cream shirt.

Attachments:
- Input image 1: sheets/sasha_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG on plain cream paper background, landscape 3:2, 1536x1024 or larger. Layout: five full-length front-view figures in one row, left to right in age order 12, 15, 19, 26, 33, every figure about 85 percent of the canvas height. Figures and objects are drawn BIG: together they fill at least 85 percent of the canvas height and most of its width, with only narrow even margins. No scene, no floor line, no props unless listed, no labels, no captions, no numbers.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### sasha_faces_sheet → `sheets/sasha_faces_sheet.png`

Момент: Лица Саши крупно: 6 голов (12, 15, 19, 26, 31, 33)

```text
Asset: sheets/sasha_faces_sheet.png, a reference sheet. Six large head-and-shoulder portraits of Sasha arranged in a 3x2 grid, front or three-quarter view, same lighting: ages 12, 15, 19, 26, 31, 33 in that order. Same eyes, brows, nose and cowlick in all six; only age marks differ (lanky jaw, stubble, first lines at the eyes). Neutral serious expression.

Characters (identity must match the attached sheets; the text is the fallback):
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 12 (year 2005): small, thin boy. Home: olive T-shirt with one chest pocket, warm gray trousers, barefoot or in socks. School: cream shirt, warm gray trousers. Outdoors: olive windbreaker.
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 15 (year 2008): taller and lanky, longer arms and neck, hair a little longer, same cowlick, same too-old gaze. Faded teal sweatshirt or cream shirt, warm gray trousers.
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 18 to 20 (years 2011-2013): lean young man, hair slightly longer, first light shadow on the jaw. Graduation: an oversized warm gray blazer that is too wide in the shoulders. Otherwise a mustard hoodie.
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 26 (year 2019): adult man, narrow face, short hair with the cowlick still alive, light stubble, tired kind eyes. Cream linen shirt with rolled sleeves, warm gray trousers.
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 31 (year 2024): adult man, lean, hollow-cheeked, a little tired, short hair, light stubble, gray hoodie.
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 33 (year 2026): adult man, faint lines at the eyes, short neat hair with the cowlick, no stubble, calm eyes, teal-gray sweater over a cream shirt.

Attachments:
- Input image 1: sheets/sasha_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG on plain cream paper background, landscape 3:2, 1536x1024 or larger. Layout: six head-and-shoulders portraits in a 3 by 2 grid, each portrait filling its cell almost completely. Figures and objects are drawn BIG: together they fill at least 85 percent of the canvas height and most of its width, with only narrow even margins. No scene, no floor line, no props unless listed, no labels, no captions, no numbers.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### kostya38_sheet → `sheets/kostya38_sheet.png`

Момент: Костя в 38: лысый, лист по образцу листа Кости

```text
Asset: sheets/kostya38_sheet.png, a reference sheet. Character sheet of Kostya at 38 in the same format as the attached 17-year-old sheet. Calm neutral pose, warm tired eyes, bald head (smooth shaved scalp with cut-paper highlights), light stubble.

Characters (identity must match the attached sheets; the text is the fallback):
- Kostya, 38 (year 2026): the same man grown up: completely bald head, warm tired eyes, the same nose and eyebrows as at 17, light stubble, broader build; olive-and-mustard flannel shirt with rolled sleeves.

Attachments:
- Input image 1: sheets/kostya_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG on plain cream paper background, landscape 3:2, 1536x1024 or larger. Layout: three full-length figures left to right (front view, side view, back view) at identical scale, then one large head-and-shoulders portrait at the right, as tall as the figures. Figures and objects are drawn BIG: together they fill at least 85 percent of the canvas height and most of its width, with only narrow even margins. No scene, no floor line, no props unless listed, no labels, no captions, no numbers.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### ded_sheet → `sheets/ded_sheet.png`

Момент: Дед Лёша, ~72 года

```text
Asset: sheets/ded_sheet.png, a reference sheet. Character sheet of Grandfather Lyosha. Calm neutral pose, hands visible, work apron.

Characters (identity must match the attached sheets; the text is the fallback):
- Grandfather Lyosha, about 72: wiry and thin, short gray cropped hair, big ears, gray stubble, round old safety glasses pushed up on the forehead, worn brown work apron over an olive checked shirt, strong veined hands.

Attachments:
- Input image 1: sheets/mama_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG on plain cream paper background, landscape 3:2, 1536x1024 or larger. Layout: three full-length figures left to right (front view, side view, back view) at identical scale, then one large head-and-shoulders portrait at the right, as tall as the figures. Figures and objects are drawn BIG: together they fill at least 85 percent of the canvas height and most of its width, with only narrow even margins. No scene, no floor line, no props unless listed, no labels, no captions, no numbers.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### lena_sheet → `sheets/lena_sheet.png`

Момент: Лена, 26 лет

```text
Asset: sheets/lena_sheet.png, a reference sheet. Character sheet of Lena. Standing pose with both hands holding a big plain mug in front of her chest; the mug is in the front and side views, and the portrait shows her warm amused look.

Characters (identity must match the attached sheets; the text is the fallback):
- Lena, 26: soft round face, calm amused eyes, shoulder-length warm light-brown hair, a few freckles, oversized faded-teal knitted cardigan, hands always wrapped around a big mug even in the heat.

Attachments:
- Input image 1: sheets/mama_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG on plain cream paper background, landscape 3:2, 1536x1024 or larger. Layout: three full-length figures left to right (front view, side view, back view) at identical scale, then one large head-and-shoulders portrait at the right, as tall as the figures. Figures and objects are drawn BIG: together they fill at least 85 percent of the canvas height and most of its width, with only narrow even margins. No scene, no floor line, no props unless listed, no labels, no captions, no numbers.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### supporting_cast_sheet → `sheets/supporting_cast_sheet.png`

Момент: Массовка: Димка 12 и 19, Гена, учительница, продавщица

```text
Asset: sheets/supporting_cast_sheet.png, a reference sheet. Lineup of five supporting characters, each a full-length front view at the same scale, neutral pose: Dimka 12, Dimka 19, Gena 14, the teacher, and the market seller shown only as a pair of hands and arms in knitted mitts holding a stack of plain cassettes (no face).

Characters (identity must match the attached sheets; the text is the fallback):
- Dimka, 12: classmate; round face, buzz cut, a huge olive sweater, always chewing something, cheerful shrug.
- Dimka, 19: the same round face grown up, tall, cheap mustard jacket, holding a plain phone (a flat slab in warm dark gray with a blank glowing screen).
- Gena, 14: school bully; big, broad, pale crew cut, brick-brown sweatshirt, heavy brow, scowl.
- Teacher, 55: gray bun, round glasses, olive cardigan, strict but not unkind.
- Market seller, middle-aged woman: fingerless knitted mitts, mustard headscarf; only her hands and arms are visible.

Attachments:
- Input image 1: sheets/sasha_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG on plain cream paper background, landscape 3:2, 1536x1024 or larger. Layout: five figures in one row, left to right in the order listed, each about 85 percent of the canvas height. Figures and objects are drawn BIG: together they fill at least 85 percent of the canvas height and most of its width, with only narrow even margins. No scene, no floor line, no props unless listed, no labels, no captions, no numbers.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### props_misc_sheet → `sheets/props_misc_sheet.png`

Момент: Мелкие предметы: паяльник, копилка, смартфон, чашки

```text
Asset: sheets/props_misc_sheet.png, a reference sheet. Props sheet. (1) A soldering iron with a wooden handle and a thin metal tip, on a small stand. (2) A candy tin used as a piggy bank, mustard lid with a coin slot, a few coins beside it. (3) A bulky 2005 CRT monitor with a beige-warm-gray tower case, blank teal-glow screen. (4) A plain 2012 smartphone: flat slab in warm dark gray, blank glowing screen, no logo. (5) A big plain mug and a smaller mug. (6) An old round alarm-style wall clock with a blank dial and two plain hands.

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG on plain cream paper background, landscape 3:2, 1536x1024 or larger. Layout: six objects in a 3 by 2 grid, each object large in its cell. Figures and objects are drawn BIG: together they fill at least 85 percent of the canvas height and most of its width, with only narrow even margins. No scene, no floor line, no props unless listed, no labels, no captions, no numbers.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

## 0. Задники (пустые комнаты, без людей)

### bg_classroom → `bg/bg_classroom.png`

Момент: Класс 2005, пустой

```text
Asset: bg/bg_classroom.png, an empty background set. Empty school classroom in 2005, morning light. A big olive-green blackboard filling the back wall (blank), three rows of wooden desks with chairs, teacher's desk on the left, tall windows on the right with morning light, empty picture frames on the wall.

Attachments:
- Input image 1: bg/bg_door_wall_hd.png, approved set of this scene (keep its architecture, materials, light and object positions)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, an EMPTY set with no people, whole picture to the edges. Use the largest 16:9 size the tool allows (target 2560x1440; never below 1536x864) and report the real size. Eye-level camera, a clear open floor area in the middle third where characters will later appear, important furniture in the upper 75 percent, the lowest 20 percent calm and quiet. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### bg_kostya_room → `bg/bg_kostya_room.png`

Момент: Комната Кости

```text
Asset: bg/bg_kostya_room.png, an empty background set. Empty bedroom of a 17-year-old in 2005 seen from the door: a bed along the left wall, above it two or three posters with abstract silhouettes only (guitar, profile, star; no text), a desk with a pile of plain cassettes and an old chair, a window with evening light, socks on the floor. Same wall paper, parquet and woodwork as the attached bedroom.

Attachments:
- Input image 1: bg/bg_door_wall_hd.png, approved set of this scene (keep its architecture, materials, light and object positions)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, an EMPTY set with no people, whole picture to the edges. Use the largest 16:9 size the tool allows (target 2560x1440; never below 1536x864) and report the real size. Eye-level camera, a clear open floor area in the middle third where characters will later appear, important furniture in the upper 75 percent, the lowest 20 percent calm and quiet. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### bg_yard → `bg/bg_yard.png`

Момент: Двор в мае: панельный дом, гаражи, старый тополь

```text
Asset: bg/bg_yard.png, an empty background set. Empty courtyard in May 2006, eye level from the building entrance. A warm gray five-storey panel block with an entrance door and a bench; on the right a row of brick-brown garages with flat roofs; above them a huge old poplar leaning toward the garages; a teal-frame bicycle leaning against the poplar trunk; poplar fluff floating in the air.

Attachments:
- Input image 1: bg/bg_door_wall_hd.png, approved set of this scene (keep its architecture, materials, light and object positions)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, an EMPTY set with no people, whole picture to the edges. Use the largest 16:9 size the tool allows (target 2560x1440; never below 1536x864) and report the real size. Eye-level camera, a clear open floor area in the middle third where characters will later appear, important furniture in the upper 75 percent, the lowest 20 percent calm and quiet. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### bg_garage → `bg/bg_garage.png`

Момент: Гараж деда: верстак, паяльник, радио

```text
Asset: bg/bg_garage.png, an empty background set. Empty garage interior, daylight through the open door on the left: a heavy wooden workbench along the back wall, tools on a pegboard, a small old radio on the bench, a three-legged stool, a bicycle upside down on the floor waiting for repair, jars of screws on a shelf.

Attachments:
- Input image 1: bg/bg_door_wall_hd.png, approved set of this scene (keep its architecture, materials, light and object positions)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, an EMPTY set with no people, whole picture to the edges. Use the largest 16:9 size the tool allows (target 2560x1440; never below 1536x864) and report the real size. Eye-level camera, a clear open floor area in the middle third where characters will later appear, important furniture in the upper 75 percent, the lowest 20 percent calm and quiet. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### bg_terrace → `bg/bg_terrace.png`

Момент: Терраса, июль 2019

```text
Asset: bg/bg_terrace.png, an empty background set. Empty summer terrace of a country house at a party, hot afternoon: wooden planks floor, a long table with plain paper plates and cups, folding chairs, strings of plain bulbs, olive vines on the railing, bright mustard light.

Attachments:
- Input image 1: bg/bg_door_wall_hd.png, approved set of this scene (keep its architecture, materials, light and object positions)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, an EMPTY set with no people, whole picture to the edges. Use the largest 16:9 size the tool allows (target 2560x1440; never below 1536x864) and report the real size. Eye-level camera, a clear open floor area in the middle third where characters will later appear, important furniture in the upper 75 percent, the lowest 20 percent calm and quiet. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### bg_kitchen_adult → `bg/bg_kitchen_adult.png`

Момент: Кухня взрослого Саши (2024 и 2026)

```text
Asset: bg/bg_kitchen_adult.png, an empty background set. Empty modern flat kitchen: plain cream cupboards, a small table with two chairs, a kettle, a window, a doorway on the right leading to a dark corridor with a room door. Neat and a bit lonely. Same paper-collage materials as the other kitchen but newer.

Attachments:
- Input image 1: bg/bg_kitchen-v2.png, approved set of this scene (keep its architecture, materials, light and object positions)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, an EMPTY set with no people, whole picture to the edges. Use the largest 16:9 size the tool allows (target 2560x1440; never below 1536x864) and report the real size. Eye-level camera, a clear open floor area in the middle third where characters will later appear, important furniture in the upper 75 percent, the lowest 20 percent calm and quiet. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

## Хук 0:00–0:38

### h_sasha_palm → `shots/h_sasha_palm.png`

Момент: [ладонь на лице] «Ты помнишь следующие двадцать один год»

```text
Asset: shots/h_sasha_palm.png, a finished full scene. Morning, the bedroom from the attached background. Sasha sits on the edge of the bed, one palm pressed over his face, the other hand gripping the blanket. Medium-wide view, the room around him calm and warm.

Characters (identity must match the attached sheets; the text is the fallback):
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 12 (year 2005): small, thin boy. Home: olive T-shirt with one chest pocket, warm gray trousers, barefoot or in socks. School: cream shirt, warm gray trousers. Outdoors: olive windbreaker.

Attachments:
- Input image 1: bg/bg_door_wall_hd.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/sasha_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### h_school_bag → `shots/h_school_bag.png`

Момент: [Мысль] «…а в школу всё равно идти»

```text
Asset: shots/h_school_bag.png, a finished full scene. A school backpack on a chair, a cream school shirt on a hanger beside it, morning window light, a calm bedroom corner. No people.

Attachments:
- Input image 1: bg/bg_door_wall_hd.png, approved set of this scene (keep its architecture, materials, light and object positions)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### h_cassette_box → `shots/h_cassette_box.png`

Момент: [коробка кассет] «…ты поставишь брату одну из своих кассет»

```text
Asset: shots/h_cassette_box.png, a finished full scene. Top and slightly side view of an open old shoebox on a kitchen table; in it 21 identical olive cassettes stand tightly in a row with blank labels. One cassette near the right end is lifted a little higher than the others. The row runs along the long side of the frame so the camera can travel along it. Warm evening light, a little dust.

Attachments:
- Input image 1: sheets/props_tape_sheet-v2.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### h_cassette_2024_cu → `shots/h_cassette_2024_cu.png`

Момент: Крупно кассета «2024» (наклейка пустая)

```text
Asset: shots/h_cassette_2024_cu.png, a close-up master. Extreme close-up of one olive cassette, slightly rotated, filling the frame: its blank cream label large and clean, the two reel windows with detailed reels, the screws and the cut paper edges all visible. Soft warm light.

Attachments:
- Input image 1: sheets/props_tape_sheet-v2.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Close-up master: the subject fills the frame and every detail is drawn at final scale, because the picture will be shown at 1:1 with no further zoom. Hair strands, eyelashes, paper fibers, cut edges and small parts are individually crisp. No soft focus, no smoothing, no painterly texture.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### h_kostya_hair_cu → `shots/h_kostya_hair_cu.png`

Момент: Крупно: Костя 17 лет, волосы и лицо (вместо зума 2.6×)

```text
Asset: shots/h_kostya_hair_cu.png, a close-up master. Close-up, head and shoulders, Kostya at 17 standing in the open bedroom doorway, the door edge visible at the right. Hair strands drawn individually, an easy half-smile, morning light from the corridor behind. Identical costume and face to the attached full shot.

Characters (identity must match the attached sheets; the text is the fallback):
- Kostya, 17 in 2005 (use for 2005-2009, he is 17 to 21): Sasha's older brother; tousled dark brown wavy hair, easy half-smile, lanky; warm gray hoodie with rolled sleeves, faded teal jeans, white socks.

Attachments:
- Input image 1: sheets/kostya_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)
- Input image 2: bg/bg_door_wall_hd.png, approved set of this scene (keep its architecture, materials, light and object positions)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Close-up master: the subject fills the frame and every detail is drawn at final scale, because the picture will be shown at 1:1 with no further zoom. Hair strands, eyelashes, paper fibers, cut edges and small parts are individually crisp. No soft focus, no smoothing, no painterly texture.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### h_sasha_eyes_cu → `shots/h_sasha_eyes_cu.png`

Момент: Крупно: глаза Саши 12 лет (вместо зума 2.6×)

```text
Asset: shots/h_sasha_eyes_cu.png, a close-up master. Extreme close-up of Sasha's face from forehead to chin, filling the frame, eyes wide open, a far too grown-up gaze, faint shadows under the eyes, slightly drawn brows, hair strands crisp. Soft morning light from the left.

Characters (identity must match the attached sheets; the text is the fallback):
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 12 (year 2005): small, thin boy. Home: olive T-shirt with one chest pocket, warm gray trousers, barefoot or in socks. School: cream shirt, warm gray trousers. Outdoors: olive windbreaker.

Attachments:
- Input image 1: sheets/sasha_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)
- Input image 2: sheets/sasha_faces_sheet.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Close-up master: the subject fills the frame and every detail is drawn at final scale, because the picture will be shown at 1:1 with no further zoom. Hair strands, eyelashes, paper fibers, cut edges and small parts are individually crisp. No soft focus, no smoothing, no painterly texture.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

## Правила 0:38–1:18

### r_paper_desk → `shots/r_paper_desk.png`

Момент: Фон под три правила (текст кладёт код)

```text
Asset: shots/r_paper_desk.png, a finished full scene. A calm background for on-screen text: a wooden desk seen straight from above, a sheet of cream handmade paper in the centre with torn edges, a pencil and an eraser at the lower left, a mustard torn paper strip at the top left corner. The large centre of the sheet stays completely empty.

Attachments:
- Input image 1: bg/bg_door_wall_hd.png, approved set of this scene (keep its architecture, materials, light and object positions)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### r_adults_soup → `shots/r_adults_soup.png`

Момент: «Взрослые кивают и просят доесть суп»

```text
Asset: shots/r_adults_soup.png, a finished full scene. Kitchen table: Mama and Papa lean toward Sasha with kind, patient, condescending half-smiles, nodding, while a bowl of soup steams in front of Sasha, who looks flatly at the viewer. Camera slightly low, kitchen morning light.

Characters (identity must match the attached sheets; the text is the fallback):
- Mama, 38: curly chestnut hair held by a mustard clip, kind tired round face, olive robe with small mustard flowers, cream apron, teal slippers. Warm, quick, practical.
- Papa, 40: stocky, slightly heavy, taller than Mama; broad kind tired face; thick chestnut horseshoe moustache; short dark hair with receding temples; Sasha's nose and brows (by 2008 a few more lines at the eyes, a little gray in the moustache). At home: faded cream sleeveless undershirt under an open olive-and-mustard plaid shirt, warm gray sweatpants, teal slippers, a plain wedding ring.
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 12 (year 2005): small, thin boy. Home: olive T-shirt with one chest pocket, warm gray trousers, barefoot or in socks. School: cream shirt, warm gray trousers. Outdoors: olive windbreaker.

Attachments:
- Input image 1: bg/bg_kitchen-v2.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/mama_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)
- Input image 3: sheets/papa_sheet.png, approved character/props reference (identity, costume and proportions must match)
- Input image 4: sheets/sasha_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. The only permitted red is #D92F2B, exclusively on: the lifebuoy fridge magnet only if the fridge is in frame. No other red anywhere.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

## Эпоха 1. День первый 1:18–2:36

### e1_mama_bread → `shots/e1_mama_bread.png`

Момент: «Мама режет хлеб и спрашивает, почему ты так смотришь»

```text
Asset: shots/e1_mama_bread.png, a finished full scene. Kitchen, morning. Mama cuts a bread loaf at the table and glances back over her shoulder; Sasha sits at the table staring at her with eyes that are slightly wet. Warm light from the window.

Characters (identity must match the attached sheets; the text is the fallback):
- Mama, 38: curly chestnut hair held by a mustard clip, kind tired round face, olive robe with small mustard flowers, cream apron, teal slippers. Warm, quick, practical.
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 12 (year 2005): small, thin boy. Home: olive T-shirt with one chest pocket, warm gray trousers, barefoot or in socks. School: cream shirt, warm gray trousers. Outdoors: olive windbreaker.

Attachments:
- Input image 1: bg/bg_kitchen-v2.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/mama_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)
- Input image 3: sheets/sasha_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. The only permitted red is #D92F2B, exclusively on: the lifebuoy fridge magnet only if the fridge is in frame. No other red anywhere.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e1_videocall → `shots/e1_videocall.png`

Момент: Воспоминание: «видеосвязь, мама просит включить звук»

```text
Asset: shots/e1_videocall.png, a close-up master. Night, close-up: a man's hand (gray sleeve, no face) holds a plain smartphone. On the blank glowing screen Mama at 59 sits too close to her camera, seen from below at a slight angle, squinting, glasses on her forehead. Cool teal tone, the room dark.

Characters (identity must match the attached sheets; the text is the fallback):
- Mama, about 59 (seen only on a phone screen): the same face as Mama but older: gray strands in the curls, shorter haircut, reading glasses pushed up on the forehead, confused squint.

Attachments:
- Input image 1: sheets/mama_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)
- Input image 2: sheets/props_misc_sheet.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Close-up master: the subject fills the frame and every detail is drawn at final scale, because the picture will be shown at 1:1 with no further zoom. Hair strands, eyelashes, paper fibers, cut edges and small parts are individually crisp. No soft focus, no smoothing, no painterly texture.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e1_oilcloth → `shots/e1_oilcloth.png`

Момент: Макро: клеёнка с надорванным краем, ладонь Саши

```text
Asset: shots/e1_oilcloth.png, a close-up master. Macro of a corner of the checked oilcloth with a frayed torn edge, bread crumbs on it, and a child's palm resting on it.

Characters (identity must match the attached sheets; the text is the fallback):
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 12 (year 2005): small, thin boy. Home: olive T-shirt with one chest pocket, warm gray trousers, barefoot or in socks. School: cream shirt, warm gray trousers. Outdoors: olive windbreaker.

Attachments:
- Input image 1: bg/bg_kitchen-v2.png, approved set of this scene (keep its architecture, materials, light and object positions)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Close-up master: the subject fills the frame and every detail is drawn at final scale, because the picture will be shown at 1:1 with no further zoom. Hair strands, eyelashes, paper fibers, cut edges and small parts are individually crisp. No soft focus, no smoothing, no painterly texture.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e1_papa_pan → `shots/e1_papa_pan.png`

Момент: «Папа ест яичницу со сковородки и читает газету. У него усы»

```text
Asset: shots/e1_papa_pan.png, a finished full scene. Kitchen. Papa at the table eats fried eggs straight from a cast-iron frying pan and holds an unfolded newspaper in the other hand (columns are plain gray bands). In the foreground the shoulder and the back of the head of Sasha, who stares at his moustache. Morning light.

Characters (identity must match the attached sheets; the text is the fallback):
- Papa, 40: stocky, slightly heavy, taller than Mama; broad kind tired face; thick chestnut horseshoe moustache; short dark hair with receding temples; Sasha's nose and brows (by 2008 a few more lines at the eyes, a little gray in the moustache). At home: faded cream sleeveless undershirt under an open olive-and-mustard plaid shirt, warm gray sweatpants, teal slippers, a plain wedding ring.
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 12 (year 2005): small, thin boy. Home: olive T-shirt with one chest pocket, warm gray trousers, barefoot or in socks. School: cream shirt, warm gray trousers. Outdoors: olive windbreaker.

Attachments:
- Input image 1: bg/bg_kitchen-v2.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/papa_sheet.png, approved character/props reference (identity, costume and proportions must match)
- Input image 3: sheets/sasha_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. The only permitted red is #D92F2B, exclusively on: the lifebuoy fridge magnet only if the fridge is in frame. No other red anywhere.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e1_papa_lowers → `shots/e1_papa_lowers.png`

Момент: «Папа медленно опускает газету»

```text
Asset: shots/e1_papa_lowers.png, a finished full scene. Closer view: Papa has lowered the newspaper and looks over it at Sasha, eyebrows raised, a fork frozen in the air. The moment of silence is readable in the faces.

Characters (identity must match the attached sheets; the text is the fallback):
- Papa, 40: stocky, slightly heavy, taller than Mama; broad kind tired face; thick chestnut horseshoe moustache; short dark hair with receding temples; Sasha's nose and brows (by 2008 a few more lines at the eyes, a little gray in the moustache). At home: faded cream sleeveless undershirt under an open olive-and-mustard plaid shirt, warm gray sweatpants, teal slippers, a plain wedding ring.

Attachments:
- Input image 1: sheets/papa_sheet.png, approved character/props reference (identity, costume and proportions must match)
- Input image 2: shots/e1_papa_pan.png, the previous shot of this scene (keep the same room, people and light)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e1_cocoa → `shots/e1_cocoa.png`

Момент: «Ты просишь кофе. Мама ставит перед тобой какао»

```text
Asset: shots/e1_cocoa.png, a finished full scene. Kitchen table: Mama sets a big mug of cocoa in front of Sasha; Sasha looks at the mug with flat, tired disbelief.

Characters (identity must match the attached sheets; the text is the fallback):
- Mama, 38: curly chestnut hair held by a mustard clip, kind tired round face, olive robe with small mustard flowers, cream apron, teal slippers. Warm, quick, practical.
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 12 (year 2005): small, thin boy. Home: olive T-shirt with one chest pocket, warm gray trousers, barefoot or in socks. School: cream shirt, warm gray trousers. Outdoors: olive windbreaker.

Attachments:
- Input image 1: bg/bg_kitchen-v2.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/mama_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)
- Input image 3: sheets/sasha_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. The only permitted red is #D92F2B, exclusively on: the lifebuoy fridge magnet only if the fridge is in frame. No other red anywhere.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e1_clock_ten → `shots/e1_clock_ten.png`

Момент: «Отбой в десять. Тебе тридцать три»

```text
Asset: shots/e1_clock_ten.png, a finished full scene. Hallway at evening: a round wall clock with a blank dial and hands showing ten o'clock, below it Sasha in pyjamas with arms crossed looking up at it with adult resignation.

Characters (identity must match the attached sheets; the text is the fallback):
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 12 (year 2005): small, thin boy. Home: olive T-shirt with one chest pocket, warm gray trousers, barefoot or in socks. School: cream shirt, warm gray trousers. Outdoors: olive windbreaker.

Attachments:
- Input image 1: bg/bg_door_wall_hd.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/sasha_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)
- Input image 3: sheets/props_misc_sheet.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e1_school_board → `shots/e1_school_board.png`

Момент: «Сколько будет три пятых плюс две седьмых — ты не знаешь»

```text
Asset: shots/e1_school_board.png, a finished full scene. Classroom: Sasha stands at the blank blackboard holding a piece of chalk, shoulders slumped; the teacher sits at her desk watching; the class is seen only from behind. Morning light.

Characters (identity must match the attached sheets; the text is the fallback):
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 12 (year 2005): small, thin boy. Home: olive T-shirt with one chest pocket, warm gray trousers, barefoot or in socks. School: cream shirt, warm gray trousers. Outdoors: olive windbreaker.
- Teacher, 55: gray bun, round glasses, olive cardigan, strict but not unkind.

Attachments:
- Input image 1: bg/bg_classroom.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/sasha_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)
- Input image 3: sheets/supporting_cast_sheet.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e1_plan_night → `shots/e1_plan_night.png`

Момент: «Вечером ты пишешь план. Очень взрослый»

```text
Asset: shots/e1_plan_night.png, a finished full scene. Sasha's bedroom at night: desk, lamp with mustard light, window dark teal. Sasha writes on a paper sheet, frowning in a grown-up way. Same desk, lamp and window as the attached background.

Characters (identity must match the attached sheets; the text is the fallback):
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 12 (year 2005): small, thin boy. Home: olive T-shirt with one chest pocket, warm gray trousers, barefoot or in socks. School: cream shirt, warm gray trousers. Outdoors: olive windbreaker.

Attachments:
- Input image 1: bg/bg_door_wall_hd.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/sasha_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e1_plan_sheet → `shots/e1_plan_sheet.png`

Момент: Листок «ПЛАН» сверху (пункты пишет код)

```text
Asset: shots/e1_plan_sheet.png, a close-up master. Top-down view: a large blank sheet of lined-less paper in the centre under a lamp, a child's hand holding a pencil at its edge. The sheet fills 70 percent of the frame, its surface completely blank and flat for code-written text.

Characters (identity must match the attached sheets; the text is the fallback):
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 12 (year 2005): small, thin boy. Home: olive T-shirt with one chest pocket, warm gray trousers, barefoot or in socks. School: cream shirt, warm gray trousers. Outdoors: olive windbreaker.

Attachments:
- Input image 1: bg/bg_door_wall_hd.png, approved set of this scene (keep its architecture, materials, light and object positions)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Close-up master: the subject fills the frame and every detail is drawn at final scale, because the picture will be shown at 1:1 with no further zoom. Hair strands, eyelashes, paper fibers, cut edges and small parts are individually crisp. No soft focus, no smoothing, no painterly texture.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e1_lights_out → `shots/e1_lights_out.png`

Момент: «Через полчаса мама выключает свет»

```text
Asset: shots/e1_lights_out.png, a finished full scene. Bedroom viewed from the desk toward the door: Mama in the doorway with her hand on the light switch, bright corridor behind her, shaking her head with a warm smile; Sasha at the desk seen from behind.

Characters (identity must match the attached sheets; the text is the fallback):
- Mama, 38: curly chestnut hair held by a mustard clip, kind tired round face, olive robe with small mustard flowers, cream apron, teal slippers. Warm, quick, practical.
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 12 (year 2005): small, thin boy. Home: olive T-shirt with one chest pocket, warm gray trousers, barefoot or in socks. School: cream shirt, warm gray trousers. Outdoors: olive windbreaker.

Attachments:
- Input image 1: bg/bg_door_wall_hd.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/mama_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)
- Input image 3: sheets/sasha_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

## Эпоха 2. Первые месяцы 2:36–4:11

### e2_try_mama → `shots/e2_try_mama.png`

Момент: Попытка 1: маме про телефон без кнопок

```text
Asset: shots/e2_try_mama.png, a finished full scene. Kitchen: Mama stirs a pot with a ladle, half turned and waving Sasha away; Sasha beside her draws a rectangle in the air with his hands.

Characters (identity must match the attached sheets; the text is the fallback):
- Mama, 38: curly chestnut hair held by a mustard clip, kind tired round face, olive robe with small mustard flowers, cream apron, teal slippers. Warm, quick, practical.
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 12 (year 2005): small, thin boy. Home: olive T-shirt with one chest pocket, warm gray trousers, barefoot or in socks. School: cream shirt, warm gray trousers. Outdoors: olive windbreaker.

Attachments:
- Input image 1: bg/bg_kitchen-v2.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/mama_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)
- Input image 3: sheets/sasha_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. The only permitted red is #D92F2B, exclusively on: the lifebuoy fridge magnet only if the fridge is in frame. No other red anywhere.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e2_try_teacher → `shots/e2_try_teacher.png`

Момент: Попытка 2: учителю про интернет, «Садись, два»

```text
Asset: shots/e2_try_teacher.png, a finished full scene. Classroom: the teacher at her desk points firmly at Sasha; Sasha stands by his desk; the whole class has turned to look.

Characters (identity must match the attached sheets; the text is the fallback):
- Teacher, 55: gray bun, round glasses, olive cardigan, strict but not unkind.
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 12 (year 2005): small, thin boy. Home: olive T-shirt with one chest pocket, warm gray trousers, barefoot or in socks. School: cream shirt, warm gray trousers. Outdoors: olive windbreaker.

Attachments:
- Input image 1: bg/bg_classroom.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/supporting_cast_sheet.png, approved character/props reference (identity, costume and proportions must match)
- Input image 3: sheets/sasha_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e2_try_dimka → `shots/e2_try_dimka.png`

Момент: Попытка 3: Димка «А игры там есть?»

```text
Asset: shots/e2_try_dimka.png, a finished full scene. School corridor by a window sill: Dimka, chewing a bun, shrugs happily; Sasha beside him looks tired.

Characters (identity must match the attached sheets; the text is the fallback):
- Dimka, 12: classmate; round face, buzz cut, a huge olive sweater, always chewing something, cheerful shrug.
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 12 (year 2005): small, thin boy. Home: olive T-shirt with one chest pocket, warm gray trousers, barefoot or in socks. School: cream shirt, warm gray trousers. Outdoors: olive windbreaker.

Attachments:
- Input image 1: sheets/supporting_cast_sheet.png, approved character/props reference (identity, costume and proportions must match)
- Input image 2: sheets/sasha_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e2_stairs → `shots/e2_stairs.png`

Момент: [лбом о перила] «держать всё в голове невыносимо, мелочи уже тают»

```text
Asset: shots/e2_stairs.png, a finished full scene. Evening stairwell of a panel building: Sasha sits on a step and rests his forehead against the painted railing; soft window light.

Characters (identity must match the attached sheets; the text is the fallback):
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 12 (year 2005): small, thin boy. Home: olive T-shirt with one chest pocket, warm gray trousers, barefoot or in socks. School: cream shirt, warm gray trousers. Outdoors: olive windbreaker.

Attachments:
- Input image 1: bg/bg_door_wall_hd.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/sasha_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e2_kostya_room → `shots/e2_kostya_room.png`

Момент: «У Кости есть двухкассетник. «Зачем тебе?» — «Голос записывать»»

```text
Asset: shots/e2_kostya_room.png, a finished full scene. Kostya's room: Kostya half reclines on the bed with the twin-deck cassette recorder on his lap, looking at Sasha suspiciously; Sasha stands in the doorway. The record key of the deck is the only red.

Characters (identity must match the attached sheets; the text is the fallback):
- Kostya, 17 in 2005 (use for 2005-2009, he is 17 to 21): Sasha's older brother; tousled dark brown wavy hair, easy half-smile, lanky; warm gray hoodie with rolled sleeves, faded teal jeans, white socks.
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 12 (year 2005): small, thin boy. Home: olive T-shirt with one chest pocket, warm gray trousers, barefoot or in socks. School: cream shirt, warm gray trousers. Outdoors: olive windbreaker.

Attachments:
- Input image 1: bg/bg_kostya_room.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/kostya_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)
- Input image 3: sheets/sasha_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)
- Input image 4: sheets/props_tape_sheet-v2.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. The only permitted red is #D92F2B, exclusively on: the record key of the deck (one key). No other red anywhere.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e2_kostya_gives → `shots/e2_kostya_gives.png`

Момент: «Костя долго смотрит и отдаёт магнитофон»

```text
Asset: shots/e2_kostya_gives.png, a finished full scene. Closer: Kostya sits holding the deck out to Sasha, a long weary look of an older brother; Sasha's hands reach up from below.

Characters (identity must match the attached sheets; the text is the fallback):
- Kostya, 17 in 2005 (use for 2005-2009, he is 17 to 21): Sasha's older brother; tousled dark brown wavy hair, easy half-smile, lanky; warm gray hoodie with rolled sleeves, faded teal jeans, white socks.
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 12 (year 2005): small, thin boy. Home: olive T-shirt with one chest pocket, warm gray trousers, barefoot or in socks. School: cream shirt, warm gray trousers. Outdoors: olive windbreaker.

Attachments:
- Input image 1: bg/bg_kostya_room.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/kostya_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)
- Input image 3: sheets/sasha_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)
- Input image 4: sheets/props_tape_sheet-v2.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. The only permitted red is #D92F2B, exclusively on: the record key of the deck (one key). No other red anywhere.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e2_market → `shots/e2_market.png`

Момент: «Кассета на рынке стоит тридцать пять рублей»

```text
Asset: shots/e2_market.png, a finished full scene. Open-air market stall under an awning, stacks of plain cassettes in boxes. The seller's mitten-covered hands arrange them; Sasha's palm on the counter holds a few coins and bills (no numbers).

Characters (identity must match the attached sheets; the text is the fallback):
- Market seller, middle-aged woman: fingerless knitted mitts, mustard headscarf; only her hands and arms are visible.
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 12 (year 2005): small, thin boy. Home: olive T-shirt with one chest pocket, warm gray trousers, barefoot or in socks. School: cream shirt, warm gray trousers. Outdoors: olive windbreaker.

Attachments:
- Input image 1: sheets/props_tape_sheet-v2.png, approved character/props reference (identity, costume and proportions must match)
- Input image 2: sheets/supporting_cast_sheet.png, approved character/props reference (identity, costume and proportions must match)
- Input image 3: sheets/sasha_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e2_labels → `shots/e2_labels.png`

Момент: «Берёшь двадцать одну… подписываешь маминым маркером»

```text
Asset: shots/e2_labels.png, a finished full scene. Top-down view of Sasha's desk: a neat row of 21 cassettes with blank labels, one set aside from the rest. A hand holds a marker above one label. Lamp light.

Characters (identity must match the attached sheets; the text is the fallback):
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 12 (year 2005): small, thin boy. Home: olive T-shirt with one chest pocket, warm gray trousers, barefoot or in socks. School: cream shirt, warm gray trousers. Outdoors: olive windbreaker.

Attachments:
- Input image 1: sheets/props_tape_sheet-v2.png, approved character/props reference (identity, costume and proportions must match)
- Input image 2: bg/bg_door_wall_hd.png, approved set of this scene (keep its architecture, materials, light and object positions)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e2_rec_keys → `shots/e2_rec_keys.png`

Момент: Макро: два пальца жмут две кнопки; катушки

```text
Asset: shots/e2_rec_keys.png, a close-up master. Macro of two small fingers pressing two keys at once: the red record key and the key next to it; above them the cassette window with both reels drawn large and flat.

Characters (identity must match the attached sheets; the text is the fallback):
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 12 (year 2005): small, thin boy. Home: olive T-shirt with one chest pocket, warm gray trousers, barefoot or in socks. School: cream shirt, warm gray trousers. Outdoors: olive windbreaker.

Attachments:
- Input image 1: sheets/props_tape_sheet-v2.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. The only permitted red is #D92F2B, exclusively on: the record key of the deck. No other red anywhere.

Close-up master: the subject fills the frame and every detail is drawn at final scale, because the picture will be shown at 1:1 with no further zoom. Hair strands, eyelashes, paper fibers, cut edges and small parts are individually crisp. No soft focus, no smoothing, no painterly texture.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e2_recording → `shots/e2_recording.png`

Момент: «— Привет. Это ты. Только старше. Не выключай»

```text
Asset: shots/e2_recording.png, a finished full scene. Night at the desk: Sasha leans to the deck and speaks seriously into it, one hand on its case; lamp light.

Characters (identity must match the attached sheets; the text is the fallback):
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 12 (year 2005): small, thin boy. Home: olive T-shirt with one chest pocket, warm gray trousers, barefoot or in socks. School: cream shirt, warm gray trousers. Outdoors: olive windbreaker.

Attachments:
- Input image 1: bg/bg_door_wall_hd.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/sasha_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)
- Input image 3: sheets/props_tape_sheet-v2.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. The only permitted red is #D92F2B, exclusively on: the record key of the deck. No other red anywhere.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e2_life_work → `shots/e2_life_work.png`

Момент: «работа» (взрослая жизнь по кассете 2025)

```text
Asset: shots/e2_life_work.png, a finished full scene. Night office: the back of a man in a warm gray shirt lit by a monitor glow; no face, the screen blank.

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e2_life_bus → `shots/e2_life_bus.png`

Момент: «маршрутка»

```text
Asset: shots/e2_life_bus.png, a finished full scene. Minibus interior with a wet window; the back of a man's head by the window; city lights as soft paper circles (flat, not blurred).

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e2_life_sofa → `shots/e2_life_sofa.png`

Момент: «сериал перед сном»

```text
Asset: shots/e2_life_sofa.png, a finished full scene. Dark room: feet in socks on a sofa, teal glow from a blank TV, a mug on the arm.

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e2_2024_night → `shots/e2_2024_night.png`

Момент: «На кассете 2024 одна минута: брат берёт трубку с первого гудка»

```text
Asset: shots/e2_2024_night.png, a finished full scene. Dark adult bedroom at night: a phone lights up on the bedside table; a man's hand (no face) picks it up on the first ring.

Attachments:
- Input image 1: sheets/props_misc_sheet.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

## Эпоха 3. Тополь 4:11–4:41

### e3_bench → `shots/e3_bench.png`

Момент: «Костя. В субботу во дворе упадёт тополь… Убери велик»

```text
Asset: shots/e3_bench.png, a finished full scene. Courtyard: Kostya on the bench by the entrance laughs with his head thrown back; Sasha beside him, serious, points at the poplar by the garages; the bicycle stands under the poplar.

Characters (identity must match the attached sheets; the text is the fallback):
- Kostya, 17 in 2005 (use for 2005-2009, he is 17 to 21): Sasha's older brother; tousled dark brown wavy hair, easy half-smile, lanky; warm gray hoodie with rolled sleeves, faded teal jeans, white socks.
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 12 (year 2005): small, thin boy. Home: olive T-shirt with one chest pocket, warm gray trousers, barefoot or in socks. School: cream shirt, warm gray trousers. Outdoors: olive windbreaker.

Attachments:
- Input image 1: bg/bg_yard.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/kostya_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)
- Input image 3: sheets/sasha_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e3_fallen → `shots/e3_fallen.png`

Момент: «В субботу тополь падает на гаражи»

```text
Asset: shots/e3_fallen.png, a finished full scene. The same courtyard on Saturday: the poplar lies across the garage roofs with branches and leaves everywhere; the bicycle has been rolled safely to the entrance; Kostya stands with his mouth open.

Characters (identity must match the attached sheets; the text is the fallback):
- Kostya, 17 in 2005 (use for 2005-2009, he is 17 to 21): Sasha's older brother; tousled dark brown wavy hair, easy half-smile, lanky; warm gray hoodie with rolled sleeves, faded teal jeans, white socks.

Attachments:
- Input image 1: bg/bg_yard.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/kostya_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e3_bed_edge → `shots/e3_bed_edge.png`

Момент: «Вечером Костя садится на край кровати. — Ладно. Что надо?»

```text
Asset: shots/e3_bed_edge.png, a finished full scene. Sasha's bedroom in the evening: Kostya sits on the edge of the bed with his elbows on his knees, looking at the floor; Sasha sits on the pillow facing him.

Characters (identity must match the attached sheets; the text is the fallback):
- Kostya, 17 in 2005 (use for 2005-2009, he is 17 to 21): Sasha's older brother; tousled dark brown wavy hair, easy half-smile, lanky; warm gray hoodie with rolled sleeves, faded teal jeans, white socks.
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 12 (year 2005): small, thin boy. Home: olive T-shirt with one chest pocket, warm gray trousers, barefoot or in socks. School: cream shirt, warm gray trousers. Outdoors: olive windbreaker.

Attachments:
- Input image 1: bg/bg_carpet_wall_hd.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/kostya_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)
- Input image 3: sheets/sasha_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

## Эпоха 3б. План на 21 год 4:41–5:33

### e3b_notebooks → `shots/e3b_notebooks.png`

Момент: «Операция «Мелкий»»: две тетради на одном столе

```text
Asset: shots/e3b_notebooks.png, a finished full scene. Three-quarter top view of one desk: Sasha's notebook and Kostya's notebook open side by side, both brothers' hands writing, their elbows nearly touching; lamp light.

Characters (identity must match the attached sheets; the text is the fallback):
- Kostya, 17 in 2005 (use for 2005-2009, he is 17 to 21): Sasha's older brother; tousled dark brown wavy hair, easy half-smile, lanky; warm gray hoodie with rolled sleeves, faded teal jeans, white socks.
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 12 (year 2005): small, thin boy. Home: olive T-shirt with one chest pocket, warm gray trousers, barefoot or in socks. School: cream shirt, warm gray trousers. Outdoors: olive windbreaker.

Attachments:
- Input image 1: bg/bg_door_wall_hd.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/kostya_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)
- Input image 3: sheets/sasha_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e3b_gena → `shots/e3b_gena.png`

Момент: Гена подходит и идёт обратно

```text
Asset: shots/e3b_gena.png, a finished full scene. School corridor: Gena, the big bully, has stopped in front of Sasha and is turning away uneasily; Sasha stands straight and looks back with a calm adult gaze.

Characters (identity must match the attached sheets; the text is the fallback):
- Gena, 14: school bully; big, broad, pale crew cut, brick-brown sweatshirt, heavy brow, scowl.
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 12 (year 2005): small, thin boy. Home: olive T-shirt with one chest pocket, warm gray trousers, barefoot or in socks. School: cream shirt, warm gray trousers. Outdoors: olive windbreaker.

Attachments:
- Input image 1: sheets/supporting_cast_sheet.png, approved character/props reference (identity, costume and proportions must match)
- Input image 2: sheets/sasha_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e3b_fractions_cu → `shots/e3b_fractions_cu.png`

Момент: «Дроби ты тоже победил»

```text
Asset: shots/e3b_fractions_cu.png, a close-up master. Top-down: an open notebook page, completely blank, a pencil and an eraser, a small proud corner of Sasha's thumb.

Characters (identity must match the attached sheets; the text is the fallback):
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 12 (year 2005): small, thin boy. Home: olive T-shirt with one chest pocket, warm gray trousers, barefoot or in socks. School: cream shirt, warm gray trousers. Outdoors: olive windbreaker.

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Close-up master: the subject fills the frame and every detail is drawn at final scale, because the picture will be shown at 1:1 with no further zoom. Hair strands, eyelashes, paper fibers, cut edges and small parts are individually crisp. No soft focus, no smoothing, no painterly texture.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e3b_library → `shots/e3b_library.png`

Момент: Библиотека: самоучитель английского

```text
Asset: shots/e3b_library.png, a finished full scene. Library: tall shelves, Sasha at a long table over a thick self-study book with a blank cover and a notebook, lamp light.

Characters (identity must match the attached sheets; the text is the fallback):
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 12 (year 2005): small, thin boy. Home: olive T-shirt with one chest pocket, warm gray trousers, barefoot or in socks. School: cream shirt, warm gray trousers. Outdoors: olive windbreaker.

Attachments:
- Input image 1: sheets/sasha_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e3b_computer → `shots/e3b_computer.png`

Момент: Компьютер в зале: час в день

```text
Asset: shots/e3b_computer.png, a finished full scene. Living room: Sasha sits at a CRT monitor with a blank teal-glow screen, spine straight, staring; a plain wall clock above him.

Characters (identity must match the attached sheets; the text is the fallback):
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 12 (year 2005): small, thin boy. Home: olive T-shirt with one chest pocket, warm gray trousers, barefoot or in socks. School: cream shirt, warm gray trousers. Outdoors: olive windbreaker.

Attachments:
- Input image 1: bg/bg_door_wall_hd.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/sasha_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)
- Input image 3: sheets/props_misc_sheet.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e3b_piggybank → `shots/e3b_piggybank.png`

Момент: Копилка из-под конфет и листок ПЛАН, пункт седьмой обведён

```text
Asset: shots/e3b_piggybank.png, a close-up master. Top-down on a table: a candy-tin piggy bank with a few coins beside it, a blank plan sheet next to it; room for one circled item that code adds.

Attachments:
- Input image 1: sheets/props_misc_sheet.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Close-up master: the subject fills the frame and every detail is drawn at final scale, because the picture will be shown at 1:1 with no further zoom. Hair strands, eyelashes, paper fibers, cut edges and small parts are individually crisp. No soft focus, no smoothing, no painterly texture.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

## Эпоха 4. Октябрь 2008 5:33–6:50

### e4_flash_papers → `shots/e4_flash_papers.png`

Момент: Флешбек: папа с банковскими бумагами

```text
Asset: shots/e4_flash_papers.png, a finished full scene. Kitchen, evening, 2008: Papa at the table with a stack of bank papers (plain gray lines) and car keys, pleased; sepia-tinted memory mood. Camera straight.

Characters (identity must match the attached sheets; the text is the fallback):
- Papa, 40: stocky, slightly heavy, taller than Mama; broad kind tired face; thick chestnut horseshoe moustache; short dark hair with receding temples; Sasha's nose and brows (by 2008 a few more lines at the eyes, a little gray in the moustache). At home: faded cream sleeveless undershirt under an open olive-and-mustard plaid shirt, warm gray sweatpants, teal slippers, a plain wedding ring.

Attachments:
- Input image 1: bg/bg_kitchen-v2.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/papa_sheet.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. The only permitted red is #D92F2B, exclusively on: the lifebuoy fridge magnet only if the fridge is in frame. No other red anywhere.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e4_car_taken → `shots/e4_car_taken.png`

Момент: «Машину забрали»

```text
Asset: shots/e4_car_taken.png, a finished full scene. Winter courtyard at dusk, the poplar already gone: a plain tow truck takes away a small sedan, Papa in a coat stands with his hands in pockets.

Characters (identity must match the attached sheets; the text is the fallback):
- Papa, 40: stocky, slightly heavy, taller than Mama; broad kind tired face; thick chestnut horseshoe moustache; short dark hair with receding temples; Sasha's nose and brows (by 2008 a few more lines at the eyes, a little gray in the moustache). At home: faded cream sleeveless undershirt under an open olive-and-mustard plaid shirt, warm gray sweatpants, teal slippers, a plain wedding ring.

Attachments:
- Input image 1: bg/bg_yard.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/papa_sheet.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e4_silent_dinner → `shots/e4_silent_dinner.png`

Момент: «Папа год молчал за ужином»

```text
Asset: shots/e4_silent_dinner.png, a finished full scene. Kitchen supper: Papa looks into his plate, Mama glances at him sideways, Sasha at 15 looks down; quiet yellow light.

Characters (identity must match the attached sheets; the text is the fallback):
- Papa, 40: stocky, slightly heavy, taller than Mama; broad kind tired face; thick chestnut horseshoe moustache; short dark hair with receding temples; Sasha's nose and brows (by 2008 a few more lines at the eyes, a little gray in the moustache). At home: faded cream sleeveless undershirt under an open olive-and-mustard plaid shirt, warm gray sweatpants, teal slippers, a plain wedding ring.
- Mama, 38: curly chestnut hair held by a mustard clip, kind tired round face, olive robe with small mustard flowers, cream apron, teal slippers. Warm, quick, practical.
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 15 (year 2008): taller and lanky, longer arms and neck, hair a little longer, same cowlick, same too-old gaze. Faded teal sweatshirt or cream shirt, warm gray trousers.

Attachments:
- Input image 1: bg/bg_kitchen-v2.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/papa_sheet.png, approved character/props reference (identity, costume and proportions must match)
- Input image 3: sheets/mama_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)
- Input image 4: sheets/sasha_ages_sheet.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. The only permitted red is #D92F2B, exclusively on: the lifebuoy fridge magnet only if the fridge is in frame. No other red anywhere.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e4_suitcase → `shots/e4_suitcase.png`

Момент: «Через два года родители разъехались»

```text
Asset: shots/e4_suitcase.png, a finished full scene. Hallway: a packed suitcase by the front door; on the hook rack one coat, the second hook empty. No people.

Attachments:
- Input image 1: bg/bg_door_wall_hd.png, approved set of this scene (keep its architecture, materials, light and object positions)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e4_straight_a → `shots/e4_straight_a.png`

Момент: «…три года учился на одни пятёрки»

```text
Asset: shots/e4_straight_a.png, a finished full scene. Sasha at 15 at his desk in daylight with a stack of notebooks, sitting very straight and writing diligently.

Characters (identity must match the attached sheets; the text is the fallback):
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 15 (year 2008): taller and lanky, longer arms and neck, hair a little longer, same cowlick, same too-old gaze. Faded teal sweatshirt or cream shirt, warm gray trousers.

Attachments:
- Input image 1: bg/bg_door_wall_hd.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/sasha_ages_sheet.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e4_warn_kitchen → `shots/e4_warn_kitchen.png`

Момент: Сентябрь 2008: «Пап, никогда не бери кредит в долларах»

```text
Asset: shots/e4_warn_kitchen.png, a finished full scene. Kitchen: Sasha at 15 speaks earnestly to Papa; Papa laughs warmly, leaning back with a newspaper on his knee.

Characters (identity must match the attached sheets; the text is the fallback):
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 15 (year 2008): taller and lanky, longer arms and neck, hair a little longer, same cowlick, same too-old gaze. Faded teal sweatshirt or cream shirt, warm gray trousers.
- Papa, 40: stocky, slightly heavy, taller than Mama; broad kind tired face; thick chestnut horseshoe moustache; short dark hair with receding temples; Sasha's nose and brows (by 2008 a few more lines at the eyes, a little gray in the moustache). At home: faded cream sleeveless undershirt under an open olive-and-mustard plaid shirt, warm gray sweatpants, teal slippers, a plain wedding ring.

Attachments:
- Input image 1: bg/bg_kitchen-v2.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/sasha_ages_sheet.png, approved character/props reference (identity, costume and proportions must match)
- Input image 3: sheets/papa_sheet.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. The only permitted red is #D92F2B, exclusively on: the lifebuoy fridge magnet only if the fridge is in frame. No other red anywhere.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e4_cassette_night → `shots/e4_cassette_night.png`

Момент: Ночь, кассета «2008» (кассета отвечает на просьбу)

```text
Asset: shots/e4_cassette_night.png, a finished full scene. Night, Sasha at 15 sits at his desk holding one cassette in both hands and looking at it; lamp light.

Characters (identity must match the attached sheets; the text is the fallback):
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 15 (year 2008): taller and lanky, longer arms and neck, hair a little longer, same cowlick, same too-old gaze. Faded teal sweatshirt or cream shirt, warm gray trousers.

Attachments:
- Input image 1: bg/bg_door_wall_hd.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/sasha_ages_sheet.png, approved character/props reference (identity, costume and proportions must match)
- Input image 3: sheets/props_tape_sheet-v2.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e4_briefcase → `shots/e4_briefcase.png`

Момент: Четверг: «Банк завтра в десять» — папа складывает бумаги

```text
Asset: shots/e4_briefcase.png, a finished full scene. Kitchen, Thursday evening: Papa packs bank papers into a leather briefcase; in the doorway behind him Sasha at 15 stands with his hands at his sides.

Characters (identity must match the attached sheets; the text is the fallback):
- Papa, 40: stocky, slightly heavy, taller than Mama; broad kind tired face; thick chestnut horseshoe moustache; short dark hair with receding temples; Sasha's nose and brows (by 2008 a few more lines at the eyes, a little gray in the moustache). At home: faded cream sleeveless undershirt under an open olive-and-mustard plaid shirt, warm gray sweatpants, teal slippers, a plain wedding ring.
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 15 (year 2008): taller and lanky, longer arms and neck, hair a little longer, same cowlick, same too-old gaze. Faded teal sweatshirt or cream shirt, warm gray trousers.

Attachments:
- Input image 1: bg/bg_kitchen-v2.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/papa_sheet.png, approved character/props reference (identity, costume and proportions must match)
- Input image 3: sheets/sasha_ages_sheet.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. The only permitted red is #D92F2B, exclusively on: the lifebuoy fridge magnet only if the fridge is in frame. No other red anywhere.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e4_papa_look_cu → `shots/e4_papa_look_cu.png`

Момент: Папа долго смотрит на сына: «Ты никогда ни о чём его не просил»

```text
Asset: shots/e4_papa_look_cu.png, a close-up master. Close-up of Papa's face from the forehead to the chin: moustache in crisp strands, tired eyes slowly softening as he looks at his son.

Characters (identity must match the attached sheets; the text is the fallback):
- Papa, 40: stocky, slightly heavy, taller than Mama; broad kind tired face; thick chestnut horseshoe moustache; short dark hair with receding temples; Sasha's nose and brows (by 2008 a few more lines at the eyes, a little gray in the moustache). At home: faded cream sleeveless undershirt under an open olive-and-mustard plaid shirt, warm gray sweatpants, teal slippers, a plain wedding ring.

Attachments:
- Input image 1: sheets/papa_sheet.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Close-up master: the subject fills the frame and every detail is drawn at final scale, because the picture will be shown at 1:1 with no further zoom. Hair strands, eyelashes, paper fibers, cut edges and small parts are individually crisp. No soft focus, no smoothing, no painterly texture.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e4_winter_fork → `shots/e4_winter_fork.png`

Момент: «Папа откладывает вилку. — Ты откуда знал? — Кассета сказала»

```text
Asset: shots/e4_winter_fork.png, a finished full scene. Winter supper: Papa has put down his fork and turned to Sasha with wide eyes; snow outside the window; Sasha at 15 smiles faintly.

Characters (identity must match the attached sheets; the text is the fallback):
- Papa, 40: stocky, slightly heavy, taller than Mama; broad kind tired face; thick chestnut horseshoe moustache; short dark hair with receding temples; Sasha's nose and brows (by 2008 a few more lines at the eyes, a little gray in the moustache). At home: faded cream sleeveless undershirt under an open olive-and-mustard plaid shirt, warm gray sweatpants, teal slippers, a plain wedding ring.
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 15 (year 2008): taller and lanky, longer arms and neck, hair a little longer, same cowlick, same too-old gaze. Faded teal sweatshirt or cream shirt, warm gray trousers.

Attachments:
- Input image 1: bg/bg_kitchen-v2.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/papa_sheet.png, approved character/props reference (identity, costume and proportions must match)
- Input image 3: sheets/sasha_ages_sheet.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. The only permitted red is #D92F2B, exclusively on: the lifebuoy fridge magnet only if the fridge is in frame. No other red anywhere.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

## Эпоха 4б. Пункт седьмой 6:50–7:12

### e4b_pc_floor → `shots/e4b_pc_floor.png`

Момент: Системный блок на полу в комнате Кости гудит; мама со счётом за свет

```text
Asset: shots/e4b_pc_floor.png, a finished full scene. Kostya's room: a beige-gray computer tower on the floor with its side panel open, glowing from inside, a monitor on the desk; Mama stands in the doorway holding a long paper bill (plain), shaking her head; Kostya and Sasha at 15 beside the tower.

Characters (identity must match the attached sheets; the text is the fallback):
- Mama, 38: curly chestnut hair held by a mustard clip, kind tired round face, olive robe with small mustard flowers, cream apron, teal slippers. Warm, quick, practical.
- Kostya, 17 in 2005 (use for 2005-2009, he is 17 to 21): Sasha's older brother; tousled dark brown wavy hair, easy half-smile, lanky; warm gray hoodie with rolled sleeves, faded teal jeans, white socks.
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 15 (year 2008): taller and lanky, longer arms and neck, hair a little longer, same cowlick, same too-old gaze. Faded teal sweatshirt or cream shirt, warm gray trousers.

Attachments:
- Input image 1: bg/bg_kostya_room.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/mama_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)
- Input image 3: sheets/kostya_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)
- Input image 4: sheets/sasha_ages_sheet.png, approved character/props reference (identity, costume and proportions must match)
- Input image 5: sheets/props_misc_sheet.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e4b_pc_cu → `shots/e4b_pc_cu.png`

Момент: Крупно: гудящий блок

```text
Asset: shots/e4b_pc_cu.png, a close-up master. Close-up of the open computer tower: a big fan with detailed blades, a gray board, tidy cables, warm glow.

Attachments:
- Input image 1: sheets/props_misc_sheet.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Close-up master: the subject fills the frame and every detail is drawn at final scale, because the picture will be shown at 1:1 with no further zoom. Hair strands, eyelashes, paper fibers, cut edges and small parts are individually crisp. No soft focus, no smoothing, no painterly texture.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

## Эпоха 5. Воскресенья 7:12–8:09

### e5_garage → `shots/e5_garage.png`

Момент: Гараж деда: верстак, паяльник, радио

```text
Asset: shots/e5_garage.png, a finished full scene. Garage: Grandfather Lyosha at the workbench holds a soldering iron over a small radio; Sasha at 13 stands beside, watching closely.

Characters (identity must match the attached sheets; the text is the fallback):
- Grandfather Lyosha, about 72: wiry and thin, short gray cropped hair, big ears, gray stubble, round old safety glasses pushed up on the forehead, worn brown work apron over an olive checked shirt, strong veined hands.
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 12 (year 2005): small, thin boy. Home: olive T-shirt with one chest pocket, warm gray trousers, barefoot or in socks. School: cream shirt, warm gray trousers. Outdoors: olive windbreaker.

Attachments:
- Input image 1: bg/bg_garage.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/ded_sheet.png, approved character/props reference (identity, costume and proportions must match)
- Input image 3: sheets/sasha_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e5_burn → `shots/e5_burn.png`

Момент: «Обжигаешь палец. — Терпи, не маленький»

```text
Asset: shots/e5_burn.png, a finished full scene. Garage: Sasha pulls his hand back from the soldering iron, wincing, while Grandfather Lyosha stays calm, one eyebrow raised.

Characters (identity must match the attached sheets; the text is the fallback):
- Grandfather Lyosha, about 72: wiry and thin, short gray cropped hair, big ears, gray stubble, round old safety glasses pushed up on the forehead, worn brown work apron over an olive checked shirt, strong veined hands.
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 12 (year 2005): small, thin boy. Home: olive T-shirt with one chest pocket, warm gray trousers, barefoot or in socks. School: cream shirt, warm gray trousers. Outdoors: olive windbreaker.

Attachments:
- Input image 1: bg/bg_garage.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/ded_sheet.png, approved character/props reference (identity, costume and proportions must match)
- Input image 3: sheets/sasha_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e5_sundays → `shots/e5_sundays.png`

Момент: «Почти триста воскресений: радио, велосипед, кран, проводка»

```text
Asset: shots/e5_sundays.png, a finished full scene. Garage doorway in sunlight: Grandfather Lyosha and Sasha at 15 kneel over an upturned bicycle, tools scattered, both laughing.

Characters (identity must match the attached sheets; the text is the fallback):
- Grandfather Lyosha, about 72: wiry and thin, short gray cropped hair, big ears, gray stubble, round old safety glasses pushed up on the forehead, worn brown work apron over an olive checked shirt, strong veined hands.
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 15 (year 2008): taller and lanky, longer arms and neck, hair a little longer, same cowlick, same too-old gaze. Faded teal sweatshirt or cream shirt, warm gray trousers.

Attachments:
- Input image 1: bg/bg_garage.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/ded_sheet.png, approved character/props reference (identity, costume and proportions must match)
- Input image 3: sheets/sasha_ages_sheet.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e5_spring_2011 → `shots/e5_spring_2011.png`

Момент: «Весна 2011. Паяльник теперь твой»

```text
Asset: shots/e5_spring_2011.png, a finished full scene. Garage in spring: Sasha at 18 stands holding the soldering iron on his open palm; the stool by the workbench is empty; soft light.

Characters (identity must match the attached sheets; the text is the fallback):
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 18 to 20 (years 2011-2013): lean young man, hair slightly longer, first light shadow on the jaw. Graduation: an oversized warm gray blazer that is too wide in the shoulders. Otherwise a mustard hoodie.

Attachments:
- Input image 1: bg/bg_garage.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/sasha_ages_sheet.png, approved character/props reference (identity, costume and proportions must match)
- Input image 3: sheets/props_misc_sheet.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e5_iron_palm_cu → `shots/e5_iron_palm_cu.png`

Момент: Крупно: паяльник на ладони

```text
Asset: shots/e5_iron_palm_cu.png, a close-up master. Close-up of an open adult palm with a soldering iron lying across it, the wooden handle and the tip crisp; warm light; no face.

Characters (identity must match the attached sheets; the text is the fallback):
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 18 to 20 (years 2011-2013): lean young man, hair slightly longer, first light shadow on the jaw. Graduation: an oversized warm gray blazer that is too wide in the shoulders. Otherwise a mustard hoodie.

Attachments:
- Input image 1: sheets/props_misc_sheet.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Close-up master: the subject fills the frame and every detail is drawn at final scale, because the picture will be shown at 1:1 with no further zoom. Hair strands, eyelashes, paper fibers, cut edges and small parts are individually crisp. No soft focus, no smoothing, no painterly texture.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e5_night_tape → `shots/e5_night_tape.png`

Момент: Ночь: ставишь «2024», слушаешь три раза

```text
Asset: shots/e5_night_tape.png, a finished full scene. Night in Sasha's room: Sasha at 18 sits on the bed with the deck on his knees and listens, lamp off, only teal window light and the glow of the cassette window.

Characters (identity must match the attached sheets; the text is the fallback):
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 18 to 20 (years 2011-2013): lean young man, hair slightly longer, first light shadow on the jaw. Graduation: an oversized warm gray blazer that is too wide in the shoulders. Otherwise a mustard hoodie.

Attachments:
- Input image 1: bg/bg_door_wall_hd.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/sasha_ages_sheet.png, approved character/props reference (identity, costume and proportions must match)
- Input image 3: sheets/props_tape_sheet-v2.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. The only permitted red is #D92F2B, exclusively on: the record key of the deck. No other red anywhere.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

## Монтаж 2011–2015 8:09–8:44

### m_graduation → `shots/m_graduation.png`

Момент: 2011 · 18 лет: выпускной, пиджак с папиного плеча

```text
Asset: shots/m_graduation.png, a finished full scene. School hall at prom: Sasha at 18 in an oversized blazer stands in a row of graduates; the teacher beside him wipes her eyes; a soldering iron handle sticks out of his blazer pocket.

Characters (identity must match the attached sheets; the text is the fallback):
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 18 to 20 (years 2011-2013): lean young man, hair slightly longer, first light shadow on the jaw. Graduation: an oversized warm gray blazer that is too wide in the shoulders. Otherwise a mustard hoodie.
- Teacher, 55: gray bun, round glasses, olive cardigan, strict but not unkind.

Attachments:
- Input image 1: sheets/sasha_ages_sheet.png, approved character/props reference (identity, costume and proportions must match)
- Input image 2: sheets/supporting_cast_sheet.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### m_dimka_phone → `shots/m_dimka_phone.png`

Момент: 2012 · 19 лет: Димка с первым смартфоном

```text
Asset: shots/m_dimka_phone.png, a finished full scene. A shop's steps: Dimka at 19 shouts happily into his phone while holding a plain smartphone; Sasha at 19 stands a few steps away with a tolerant smile.

Characters (identity must match the attached sheets; the text is the fallback):
- Dimka, 19: the same round face grown up, tall, cheap mustard jacket, holding a plain phone (a flat slab in warm dark gray with a blank glowing screen).
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 18 to 20 (years 2011-2013): lean young man, hair slightly longer, first light shadow on the jaw. Graduation: an oversized warm gray blazer that is too wide in the shoulders. Otherwise a mustard hoodie.

Attachments:
- Input image 1: sheets/supporting_cast_sheet.png, approved character/props reference (identity, costume and proportions must match)
- Input image 2: sheets/sasha_ages_sheet.png, approved character/props reference (identity, costume and proportions must match)
- Input image 3: sheets/props_misc_sheet.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### m_kostya_car → `shots/m_kostya_car.png`

Момент: 2013 · 20 лет: Костя за рулём подержанной «девятки»

```text
Asset: shots/m_kostya_car.png, a finished full scene. A hatchback car without brand marks, scratched, at a courtyard: Kostya, happy and proud, leans out of the open driver window; Sasha at 20 stands on the pavement keeping his mouth shut.

Characters (identity must match the attached sheets; the text is the fallback):
- Kostya, 25 (year 2013): the same face and wavy dark brown hair as at 17, a little broader, light stubble, proud cheerful grin; mustard jacket over a cream T-shirt.
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 18 to 20 (years 2011-2013): lean young man, hair slightly longer, first light shadow on the jaw. Graduation: an oversized warm gray blazer that is too wide in the shoulders. Otherwise a mustard hoodie.

Attachments:
- Input image 1: bg/bg_yard.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/kostya_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)
- Input image 3: sheets/sasha_ages_sheet.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### m_varya_call → `shots/m_varya_call.png`

Момент: 2015 · 22 года: звонок из роддома; ты сползаешь по стене

```text
Asset: shots/m_varya_call.png, a finished full scene. Night: Sasha at 22 slides down a hallway wall with a phone at his ear, eyes shut, an exhale of relief; the phone screen glows teal.

Characters (identity must match the attached sheets; the text is the fallback):
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 18 to 20 (years 2011-2013): lean young man, hair slightly longer, first light shadow on the jaw. Graduation: an oversized warm gray blazer that is too wide in the shoulders. Otherwise a mustard hoodie.

Attachments:
- Input image 1: bg/bg_door_wall_hd.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/sasha_ages_sheet.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

## Эпоха 6. Июль 2019 8:44–9:38

### e6_terrace → `shots/e6_terrace.png`

Момент: Июль 2019: тебя знакомят с Леной

```text
Asset: shots/e6_terrace.png, a finished full scene. Hot party terrace: friends are small distant shapes; in the foreground Sasha at 26 and Lena meet, she holds a big mug with both hands despite the heat, he smiles uncertainly.

Characters (identity must match the attached sheets; the text is the fallback):
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 26 (year 2019): adult man, narrow face, short hair with the cowlick still alive, light stubble, tired kind eyes. Cream linen shirt with rolled sleeves, warm gray trousers.
- Lena, 26: soft round face, calm amused eyes, shoulder-length warm light-brown hair, a few freckles, oversized faded-teal knitted cardigan, hands always wrapped around a big mug even in the heat.

Attachments:
- Input image 1: bg/bg_terrace.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/sasha_ages_sheet.png, approved character/props reference (identity, costume and proportions must match)
- Input image 3: sheets/lena_sheet.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e6_lena_cup_cu → `shots/e6_lena_cup_cu.png`

Момент: Крупно: Лена греет руки о кружку

```text
Asset: shots/e6_lena_cup_cu.png, a close-up master. Close-up of Lena's face and hands wrapped around a big mug, amused eyes looking at the viewer, steam as paper curl shapes.

Characters (identity must match the attached sheets; the text is the fallback):
- Lena, 26: soft round face, calm amused eyes, shoulder-length warm light-brown hair, a few freckles, oversized faded-teal knitted cardigan, hands always wrapped around a big mug even in the heat.

Attachments:
- Input image 1: sheets/lena_sheet.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Close-up master: the subject fills the frame and every detail is drawn at final scale, because the picture will be shown at 1:1 with no further zoom. Hair strands, eyelashes, paper fibers, cut edges and small parts are individually crisp. No soft focus, no smoothing, no painterly texture.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e6_dishes → `shots/e6_dishes.png`

Момент: «Будете ругаться из-за немытой посуды»

```text
Asset: shots/e6_dishes.png, a finished full scene. A small kitchen sink piled with plates and two mugs; a half-seen couple's hands in an argument gesture at the edge of frame.

Characters (identity must match the attached sheets; the text is the fallback):
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 26 (year 2019): adult man, narrow face, short hair with the cowlick still alive, light stubble, tired kind eyes. Cream linen shirt with rolled sleeves, warm gray trousers.
- Lena, 26: soft round face, calm amused eyes, shoulder-length warm light-brown hair, a few freckles, oversized faded-teal knitted cardigan, hands always wrapped around a big mug even in the heat.

Attachments:
- Input image 1: bg/bg_kitchen_adult.png, approved set of this scene (keep its architecture, materials, light and object positions)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e6_station → `shots/e6_station.png`

Момент: «Расстанетесь на вокзале»

```text
Asset: shots/e6_station.png, a finished full scene. A quiet railway platform in autumn, two figures far apart seen from behind with a suitcase, leaves on the ground; no faces.

Characters (identity must match the attached sheets; the text is the fallback):
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 26 (year 2019): adult man, narrow face, short hair with the cowlick still alive, light stubble, tired kind eyes. Cream linen shirt with rolled sleeves, warm gray trousers.
- Lena, 26: soft round face, calm amused eyes, shoulder-length warm light-brown hair, a few freckles, oversized faded-teal knitted cardigan, hands always wrapped around a big mug even in the heat.

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### e6_cups → `shots/e6_cups.png`

Момент: «Но сначала моешь за собой чашку»

```text
Asset: shots/e6_cups.png, a finished full scene. Terrace: Sasha at 26 gathers dirty plastic cups from the table and carries them toward the kitchen door; Lena watches him with raised eyebrows and a smile.

Characters (identity must match the attached sheets; the text is the fallback):
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 26 (year 2019): adult man, narrow face, short hair with the cowlick still alive, light stubble, tired kind eyes. Cream linen shirt with rolled sleeves, warm gray trousers.
- Lena, 26: soft round face, calm amused eyes, shoulder-length warm light-brown hair, a few freckles, oversized faded-teal knitted cardigan, hands always wrapped around a big mug even in the heat.

Attachments:
- Input image 1: bg/bg_terrace.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/sasha_ages_sheet.png, approved character/props reference (identity, costume and proportions must match)
- Input image 3: sheets/lena_sheet.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

## Поворот. Март 2024 9:38–10:15

### t_night_kitchen → `shots/t_night_kitchen.png`

Момент: Март 2024: ночь, телефон тёмный

```text
Asset: shots/t_night_kitchen.png, a finished full scene. Cold night kitchen: Sasha at 31 sits at the table, a dark phone in front of him, a low lamp, teal window light; the corridor door with a thin strip of light in the background.

Characters (identity must match the attached sheets; the text is the fallback):
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 31 (year 2024): adult man, lean, hollow-cheeked, a little tired, short hair, light stubble, gray hoodie.

Attachments:
- Input image 1: bg/bg_kitchen_adult.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/sasha_faces_sheet.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### t_old_night → `shots/t_old_night.png`

Момент: Первая жизнь: три часа ночи, ты набираешь брата

```text
Asset: shots/t_old_night.png, a finished full scene. Flashback in a desaturated cool tone: the same kitchen but empty and lonely, Sasha at 31 with a phone at his ear, an unwashed cup, nobody else.

Characters (identity must match the attached sheets; the text is the fallback):
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 31 (year 2024): adult man, lean, hollow-cheeked, a little tired, short hair, light stubble, gray hoodie.

Attachments:
- Input image 1: bg/bg_kitchen_adult.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/sasha_faces_sheet.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### t_light_strip → `shots/t_light_strip.png`

Момент: «Из-под двери полоска света: там спит Лена»

```text
Asset: shots/t_light_strip.png, a finished full scene. Corridor: a closed room door with a warm strip of light under it, the dark phone on the kitchen table seen at the end of the corridor.

Attachments:
- Input image 1: bg/bg_kitchen_adult.png, approved set of this scene (keep its architecture, materials, light and object positions)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### t_realize_cu → `shots/t_realize_cu.png`

Момент: «И тут до тебя доходит»

```text
Asset: shots/t_realize_cu.png, a close-up master. Close-up of Sasha's face at 31, eyes widening as he realises, cold teal light from the phone on his cheek.

Characters (identity must match the attached sheets; the text is the fallback):
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 31 (year 2024): adult man, lean, hollow-cheeked, a little tired, short hair, light stubble, gray hoodie.

Attachments:
- Input image 1: sheets/sasha_faces_sheet.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Close-up master: the subject fills the frame and every detail is drawn at final scale, because the picture will be shown at 1:1 with no further zoom. Hair strands, eyelashes, paper fibers, cut edges and small parts are individually crisp. No soft focus, no smoothing, no painterly texture.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

## Финал. Осень 2026 10:15–11:24

### f_kostya_door → `shots/f_kostya_door.png`

Момент: Осень 2026: Костя (лысый, 38) с коробкой на пороге

```text
Asset: shots/f_kostya_door.png, a finished full scene. Kitchen doorway: Kostya at 38, bald, stands holding the shoebox of cassettes with one arm, a half-smile; Sasha at 33 sits at the table.

Characters (identity must match the attached sheets; the text is the fallback):
- Kostya, 38 (year 2026): the same man grown up: completely bald head, warm tired eyes, the same nose and eyebrows as at 17, light stubble, broader build; olive-and-mustard flannel shirt with rolled sleeves.
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 33 (year 2026): adult man, faint lines at the eyes, short neat hair with the cowlick, no stubble, calm eyes, teal-gray sweater over a cream shirt.

Attachments:
- Input image 1: bg/bg_kitchen_adult.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/kostya38_sheet.png, approved character/props reference (identity, costume and proportions must match)
- Input image 3: sheets/sasha_ages_sheet.png, approved character/props reference (identity, costume and proportions must match)
- Input image 4: sheets/props_tape_sheet-v2.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### f_player → `shots/f_player.png`

Момент: Ты ставишь «2024»: тишина, шипение, «Он ответил»

```text
Asset: shots/f_player.png, a finished full scene. Kitchen table: Sasha at 33 inserts a cassette into the twin deck; Kostya sits across the table. The deck's record key is red.

Characters (identity must match the attached sheets; the text is the fallback):
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 33 (year 2026): adult man, faint lines at the eyes, short neat hair with the cowlick, no stubble, calm eyes, teal-gray sweater over a cream shirt.
- Kostya, 38 (year 2026): the same man grown up: completely bald head, warm tired eyes, the same nose and eyebrows as at 17, light stubble, broader build; olive-and-mustard flannel shirt with rolled sleeves.

Attachments:
- Input image 1: bg/bg_kitchen_adult.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/sasha_ages_sheet.png, approved character/props reference (identity, costume and proportions must match)
- Input image 3: sheets/kostya38_sheet.png, approved character/props reference (identity, costume and proportions must match)
- Input image 4: sheets/props_tape_sheet-v2.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. The only permitted red is #D92F2B, exclusively on: the record key of the deck. No other red anywhere.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### f_kostya_frown → `shots/f_kostya_frown.png`

Момент: «— Это что? — Ночь, когда ты мне ответил»

```text
Asset: shots/f_kostya_frown.png, a finished full scene. Medium close-up of Kostya at 38 frowning in confusion, bald head, eyes searching; Sasha's shoulder in the foreground.

Characters (identity must match the attached sheets; the text is the fallback):
- Kostya, 38 (year 2026): the same man grown up: completely bald head, warm tired eyes, the same nose and eyebrows as at 17, light stubble, broader build; olive-and-mustard flannel shirt with rolled sleeves.

Attachments:
- Input image 1: sheets/kostya38_sheet.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### f_pat → `shots/f_pat.png`

Момент: «— Дурак, — говорит он и хлопает тебя по плечу»

```text
Asset: shots/f_pat.png, a finished full scene. Kostya claps Sasha on the shoulder, both smiling softly, warm window light; the deck between them.

Characters (identity must match the attached sheets; the text is the fallback):
- Kostya, 38 (year 2026): the same man grown up: completely bald head, warm tired eyes, the same nose and eyebrows as at 17, light stubble, broader build; olive-and-mustard flannel shirt with rolled sleeves.
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 33 (year 2026): adult man, faint lines at the eyes, short neat hair with the cowlick, no stubble, calm eyes, teal-gray sweater over a cream shirt.

Attachments:
- Input image 1: bg/bg_kitchen_adult.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/kostya38_sheet.png, approved character/props reference (identity, costume and proportions must match)
- Input image 3: sheets/sasha_ages_sheet.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### f_last_tape → `shots/f_last_tape.png`

Момент: «Остаётся одна. «2026», детским почерком»

```text
Asset: shots/f_last_tape.png, a finished full scene. Kostya's hand lifts the last cassette out of the shoebox, towards the viewer; the label is blank (code will add child handwriting). Warm light.

Characters (identity must match the attached sheets; the text is the fallback):
- Kostya, 38 (year 2026): the same man grown up: completely bald head, warm tired eyes, the same nose and eyebrows as at 17, light stubble, broader build; olive-and-mustard flannel shirt with rolled sleeves.

Attachments:
- Input image 1: sheets/props_tape_sheet-v2.png, approved character/props reference (identity, costume and proportions must match)
- Input image 2: sheets/kostya38_sheet.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### f_rec_keys → `shots/f_rec_keys.png`

Момент: «Нажимаешь обе кнопки сразу, как учил брат»

```text
Asset: shots/f_rec_keys.png, a close-up master. Macro of an adult thumb and finger pressing the red record key and the next key of the deck together; the cassette window above shows the two reels beginning to turn.

Characters (identity must match the attached sheets; the text is the fallback):
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 33 (year 2026): adult man, faint lines at the eyes, short neat hair with the cowlick, no stubble, calm eyes, teal-gray sweater over a cream shirt.

Attachments:
- Input image 1: sheets/props_tape_sheet-v2.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. The only permitted red is #D92F2B, exclusively on: the record key of the deck. No other red anywhere.

Close-up master: the subject fills the frame and every detail is drawn at final scale, because the picture will be shown at 1:1 with no further zoom. Hair strands, eyelashes, paper fibers, cut edges and small parts are individually crisp. No soft focus, no smoothing, no painterly texture.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### f_recording → `shots/f_recording.png`

Момент: «…рассказываешь тому пацану, которому некому было сказать»

```text
Asset: shots/f_recording.png, a finished full scene. Kitchen table, warm light: Sasha at 33 speaks into the deck with a gentle serious face; Kostya sits listening with his chin on his fist.

Characters (identity must match the attached sheets; the text is the fallback):
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 33 (year 2026): adult man, faint lines at the eyes, short neat hair with the cowlick, no stubble, calm eyes, teal-gray sweater over a cream shirt.
- Kostya, 38 (year 2026): the same man grown up: completely bald head, warm tired eyes, the same nose and eyebrows as at 17, light stubble, broader build; olive-and-mustard flannel shirt with rolled sleeves.

Attachments:
- Input image 1: bg/bg_kitchen_adult.png, approved set of this scene (keep its architecture, materials, light and object positions)
- Input image 2: sheets/sasha_ages_sheet.png, approved character/props reference (identity, costume and proportions must match)
- Input image 3: sheets/kostya38_sheet.png, approved character/props reference (identity, costume and proportions must match)
- Input image 4: sheets/props_tape_sheet-v2.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. The only permitted red is #D92F2B, exclusively on: the record key of the deck. No other red anywhere.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

## Вопрос 11:24–11:38

### q_blank_tape → `shots/q_blank_tape.png`

Момент: «Одна кассета, девяносто минут и один человек»

```text
Asset: shots/q_blank_tape.png, a close-up master. A single blank cassette on a plain cream paper surface, label clean and large, centred, soft warm light.

Attachments:
- Input image 1: sheets/props_tape_sheet-v2.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. There is no red anywhere in this picture.

Close-up master: the subject fills the frame and every detail is drawn at final scale, because the picture will be shown at 1:1 with no further zoom. Hair strands, eyelashes, paper fibers, cut edges and small parts are individually crisp. No soft focus, no smoothing, no painterly texture.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

## Превью (две обложки)

### pv_a_deck → `shots/pv_a_deck.png`

Момент: Превью A: двухкассетник, палец на двух кнопках, кассета «2024»

```text
Asset: shots/pv_a_deck.png, a finished full scene. Close hero image: the twin-deck recorder fills most of the frame in three-quarter view, a finger presses two keys at once, a cassette in the left deck has a large blank label, strong readable silhouette, clean empty space at the right for code text.

Attachments:
- Input image 1: sheets/props_tape_sheet-v2.png, approved character/props reference (identity, costume and proportions must match)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. The only permitted red is #D92F2B, exclusively on: the record key of the deck (one key). No other red anywhere.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```

### pv_b_boy → `shots/pv_b_boy.png`

Момент: Превью B: мальчик 12 лет со взрослыми глазами, календарь за спиной

```text
Asset: shots/pv_b_boy.png, a finished full scene. Sasha at 12 in the left half of the frame, a big face with grown-up eyes looking at the viewer; behind him a wall calendar with a red header and a blank page; clean empty space at the right for code text.

Characters (identity must match the attached sheets; the text is the fallback):
- Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that rarely smiles. Age 12 (year 2005): small, thin boy. Home: olive T-shirt with one chest pocket, warm gray trousers, barefoot or in socks. School: cream shirt, warm gray trousers. Outdoors: olive windbreaker.

Attachments:
- Input image 1: sheets/sasha_sheet_hd.png, approved character/props reference (identity, costume and proportions must match)
- Input image 2: sheets/sasha_faces_sheet.png, approved character/props reference (identity, costume and proportions must match)
- Input image 3: bg/bg_carpet_wall_hd.png, approved set of this scene (keep its architecture, materials, light and object positions)

Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film vignette, blur, lens effects or transitions: code adds those later.

Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. The only permitted red is #D92F2B, exclusively on: the calendar header. No other red anywhere.

Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large enough to stay readable; do not draw tiny faces or tiny details that would turn into noise.

Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. Never draw guides or labels.

Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, puppet rigs or assembly diagrams.
```
