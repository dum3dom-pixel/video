"""Builds channels/nauka-boya/script-01-90s.md (script of video 01 cut to 1:30) and channels/nauka-boya/codex-continue-01.md (what Codex continues with).
The six hook scenes are read from spec/hook.json and never changed; the twelve new scenes are listed below.
Run: python -I nauka-frames/scripts/plan_90s.py (from the repo root)."""
import json, math, re

BEAT = 60 / 90
ns = {}
exec(open("nauka-frames/scripts/codex_paste.py", encoding="utf8").read().split("sheets = [")[0], ns)
STYLE, REF, T, G, D, ACC_T, ACC_NONE = (ns[k] for k in ("STYLE", "REF", "T", "G", "D", "ACC_T", "ACC_NONE"))
# Gromila's look was replaced on 2026-10-31 (nauka-frames/spec/gromila-likeness-v2.json); the bald dark-bearded G from codex_paste.py is outdated
G = ("Gromila, huge heavyweight, about 2 meters tall: high rounded forehead, very receding hairline with sparse short light-brown hair at the temples, light-blue eyes, natural light eyebrows, broad rounded face and nose, "
     "dense light-brown / dark-blond full beard with lighter ends, light beige skin, extremely thick muscular neck, rounded huge shoulders and upper arms, massive broad chest and thick waist, "
     "light-gray sleeveless tank top, navy-blue sweatpants, barefoot, bare fists.")
MATCH = "Match the paper style, colours and lighting of the attached scene picture (s1a_hook_wide.png)."

hook = json.load(open("nauka-frames/spec/hook.json", encoding="utf8"))["scenes"]
HOOK_INFO = {
    "hook": ("ВЫРУБАЕТ / НЕ СИЛА УДАРА", "s1a → s1b (жёсткая склейка на «вырубает»)", "вспышка, встряска, лучи"),
    "size": ("ДВА МЕТРА / ТЯЖЕЛОВЕС / ПРОТИВ ПАРНЯ / НА ГОЛОВУ НИЖЕ", "s2_size", "панорама Громила → Тэцу → отъезд"),
    "punch": ("1 БОКОВОЙ / В ПОДБОРОДОК / ОСЕДАЕТ", "s3a → s3b", "дуга и кольцо на челюсти, падение с отскоком"),
    "myth": ("СИЛЬНЕЕ БЬЁШЬ / БЫСТРЕЕ ВЫРУБИШЬ? / МИФ", "s4_myth", "перечёркивание, штамп МИФ"),
    "doc": ("ЭКСПЕРИМЕНТ / 1972 / ?", "s5_doc", "плитки 7-5-7-5 → 1-9-7-2"),
    "three": ("3 ПРИЧИНЫ / И ОТВЕТ… / ПОЧЕМУ УПАЛ БОЛЬШОЙ?", "s6a → s6b", "диски 1-2-3, пролёт в мозг"),
}

# id, beats, voice, on screen, pictures, camera and effects, sound, source
NEW = [
    ("force", 9, "Сила: прямой удар олимпийского боксёра по манекену — около трёхсот пятидесяти килограммов.",
     "СИЛА / плитки «≈350 КГ» / плашка «Walilko, Viano, Bir · BJSM 2005 · 7 боксёров, манекен»", "s7_dummy (новая)",
     "медленный наезд на манекен; плитки цифр встают по слову «трёхсот»", "swipe на карточке, click ×3 на цифрах, impact на последней", "F1"),
    ("turn", 9, "Но решает не сила, а то, что удар делает с головой.",
     "СИЛА перечёркнута красной полосой / стрелки «ТОЛКАЕТ» (прямая) и «ВРАЩАЕТ» (дуга)", "s1b_hook_hit (есть)",
     "наезд на профиль; встряска на «головой»", "swipe, snip на перечёркивании, whoosh на дуге", "—"),
    ("brain", 9, "Причина третья. Мозг плавает в жидкости. Череп повернулся — мозг отстал.",
     "ПРИЧИНА 3 / МОЗГ = ЖЕЛЕ / СДВИГ СЛОЁВ", "s9_jelly_jar (новая) → s6b_brain (есть)",
     "банка с желе качается; на «череп» карточка меняется на разрез головы, встряска и полоски-слои скользят друг по другу", "pop на заголовке, crumple и slap на «отстал»", "—"),
    ("exp72", 13, "В семьдесят втором при повороте головы сотрясение получили все тринадцать обезьян. При толчке — не все.",
     "1972 / 25 ОБЕЗЬЯН / сетка из 25 бумажных кружков / ПОВОРОТ: 13 из 13 / ТОЛЧОК: не все / плашка «Gennarelli, Thibault, Ommaya · SAE 720970»", "s5_doc (есть)",
     "Док слева, справа кружки встают по одному; красные — при повороте; камера держится", "click на каждом кружке (пачками), impact на «все тринадцать»", "F2"),
    ("hypo", 5, "Гипотеза учёных: сознание выключает вращение головы.",
     "РЕШАЕТ ВРАЩЕНИЕ / плашка «гипотеза, а не закон» / стрелка-дуга вокруг головы", "s6b_brain (есть)",
     "наезд, дуга обводит голову по кругу", "whoosh на дуге, pop на плашке", "F3"),
    ("lever", 10, "Причина вторая: подбородок — рычаг. Удар ниже центра головы даёт плечо, и голова вращается.",
     "ПРИЧИНА 2 / РЫЧАГ / пунктир через центр головы / стрелка в центр «ТОЛКАЕТ» / стрелка в подбородок «ВРАЩАЕТ» / скобка «плечо»", "s12_chin_profile (новая)",
     "камера стоит, схема рисуется шагами: центр → толчок → подбородок → дуга", "swipe, snip, pop на стрелках", "F6, поправлено: плечо считается от центра головы"),
    ("side", 5, "Сильнее всего — от бокового.",
     "БОКОВОЙ / плашка «обзор 2022 · бокс»", "s3a_punch (есть)",
     "жёсткая склейка, дуга от кулака к челюсти (как в хуке), слово-удар «бокового» — встряска", "slap, whoosh", "F4"),
    ("unseen", 6, "Но есть удар опаснее — тот, которого не видишь.",
     "УДАР, КОТОРОГО НЕ ВИДИШЬ", "s14_unseen (новая)",
     "наезд на глаза Громилы, лучи в сторону Тэцу", "riser, на «не видишь» — scratch", "—"),
    ("neck", 9, "Причина первая: напряжённая шея снижает скорость головы. Громила удара не ждал.",
     "ПРИЧИНА 1 / ШЕЯ / две бумажные полосы «шея расслаблена — быстрее» и «шея напряжена — медленнее» (без цифр) / плашка «лаборатория · 46 спортсменов · Eckner, AJSM 2014»", "s15_neck_tense (новая)",
     "наезд на шею; полосы выезжают; на «не ждал» — карточка в s14", "click на полосах, pop на заголовке", "F5"),
    ("answer", 11, "Шея расслаблена, боковой пришёл ниже центра — голова провернулась. Вот почему упал именно большой.",
     "ШЕЯ РАССЛАБЛЕНА / НИЖЕ ЦЕНТРА / ГОЛОВА ПРОВЕРНУЛАСЬ / штамп «ОТВЕТ»", "s1b_hook_hit → s3a_punch → s3b_sag (есть)",
     "три быстрые карточки на три фразы, на «упал» — s3b с отскоком и клочками", "impact, crumple, slap на «упал»", "—"),
    ("safe", 9, "Это лабораторные данные, не обещание. После удара по голове — стоп и врач.",
     "ЧЕСТНО: ЛАБОРАТОРИЯ / красный штамп «СТОП · ВРАЧ»", "s17_doc_stop (новая)",
     "камера стоит; штамп падает на «стоп»", "snip, slap на штампе", "канал: медицина только с источником, безопасность не обещаем"),
    ("next", 7, "Следующий разбор: сколько килограммов в ударе. Подпишись.",
     "СЛЕДУЮЩИЙ РАЗБОР / СКОЛЬКО КГ В УДАРЕ? / бумажная плашка «ПОДПИСАТЬСЯ»", "s18_bag_scale (новая)",
     "наезд на стрелку шкалы; последние 0,3 с — спад в тёмный", "swipe, pop", "—"),
]

def words(t):
    return len(re.findall(r"[А-Яа-яЁё]+", t))

rows, t0, n = [], 0.0, 0
for s in hook:
    b = s["beats"]; info = HOOK_INFO[s["id"]]
    rows.append((s["id"], b, t0, s["voice"], info[0], info[1], info[2], "по хук-спеку", "хук, уже собран", True))
    t0 += b * BEAT
for sid, b, voice, screen, pic, cam, sfx, src in NEW:
    rows.append((sid, b, t0, voice, screen, pic, cam, sfx, src, False)); t0 += b * BEAT
total_beats = sum(r[1] for r in rows)
new_beats = sum(r[1] for r in rows if not r[9])
assert total_beats == 135, total_beats

# ---------------- script ----------------
md = ["# Ролик 01 — версия на 1:30", "",
      "Тема и факт-чек — [script-01.md](script-01.md) (пятиминутная версия, не меняется). Здесь тот же ролик, сжатый до 90 секунд: хук из `nauka-frames` без изменений и 12 новых сцен.", "",
      "## Правила версии",
      "- Хук (6 сцен, 0–22 с) собран и принят: текст озвучки, тайминги и картинки не трогаем.",
      "- Сетка 90 BPM: один удар = 0,667 с, 135 ударов = 90,0 с. Хук занимает 33 удара, новые сцены — 102.",
      "- Порядок как в пятиминутной версии: сила → причина 3 (мозг, эксперимент 1972) → причина 2 (рычаг) → причина 1 (шея) → ответ → стоп и врач → следующий разбор.",
      "- Новых фактов нет: всё из факт-чека `script-01.md` (F1–F6), формулировки осторожные там, где он требовал.",
      "- Всё движение — только целой картинкой, как в хуке; бумажные плашки, стрелки, плитки и штампы рисуются кодом.", "",
      "## Таблица сцен", "",
      "| № | id | время, с | удары | голос | на экране | картинка | камера и эффекты | звук | факт |",
      "|---|---|---|---|---|---|---|---|---|---|"]
for i, (sid, b, st, voice, screen, pic, cam, sfx, src, locked) in enumerate(rows, 1):
    md.append(f"| {i} | {sid}{' 🔒' if locked else ''} | {st:.3f}–{st + b * BEAT:.3f} | {b} | {voice} | {screen} | {pic} | {cam} | {sfx} | {src} |")
md += ["", "🔒 — сцена хука, не менять.", "",
       "## Чистый текст озвучки (по сценам, для TTS)", "", "**Хук (готов, не менять):**", ""]
md += [f"{i}. `{r[0]}` — {r[3]}" for i, r in enumerate(rows[:6], 1)]
md += ["", "**Новые сцены:**", ""]
md += [f"{i}. `{r[0]}` — {r[3]}" for i, r in enumerate(rows[6:], 7)]
nw = sum(words(r[3]) for r in rows[6:])
md += ["", "Подряд, как прочитает диктор:", "", " ".join(r[3] for r in rows), "",
       "## Хронометраж",
       f"- Хук: 33 удара = 22,0 с. Новые сцены: {new_beats} ударов = {new_beats * BEAT:.1f} с. Итого {total_beats} ударов = {total_beats * BEAT:.1f} с.",
       f"- Новых слов: {nw}. Оценка озвучки 0,5 с на слово, это запас: по хуку выходит 0,42–0,53 с на слово (Svetlana, +30%).",
       "- Число ударов на сцену — оценка. После озвучки `build.mjs` сам остановится с ошибкой, если сцена короче своего голоса; тогда перераспределяем удары между соседними сценами, суммарно остаётся 102.", "",
       "## Факты и источники (из факт-чека script-01.md, полные тексты статей не открывались)",
       "| код | в ролике | источник | осторожность |", "|---|---|---|---|",
       "| F1 | ≈350 кг, прямой удар | Walilko, Viano, Bir, BJSM 2005: 7 олимпийских боксёров, 18 прямых ударов по манекену Hybrid III, 3427 Н | говорим «по манекену»; «у тяжёлых весов сильнее» из ролика убрали ради времени |",
       "| F2 | 1972, 25 обезьян | Gennarelli, Thibault, Ommaya, SAE 720970 | при повороте сотрясение у всех 13; про толчок говорим только «не все», цифру для толчка в кадре не рисуем, пока не сверен оригинал |",
       "| F3 | вращение выключает сознание | Ommaya, Gennarelli, Brain 1974 | подаём как гипотезу, плашка «гипотеза, а не закон»; оригинал сверить |",
       "| F4 | боковой даёт больше всего вращения | Boroushak, Rahimi, 2022, обзор | без цифр и без «23 исследования» |",
       "| F5 | шея снижает скорость головы | Eckner и др., AJSM 2014, 46 спортсменов, лаборатория | не говорим, что это защищает от сотрясений в бою: не доказано |",
       "| F6 | подбородок — рычаг | школьная механика | плечо считается от центра головы; показать консультанту или найти источник |", "",
       "## Что убрано по сравнению с 5:10",
       "- Подробности про эксперимент: гипотеза уровней (слабый поворот — поверхность, сильный — центр) и «сдвиговая деформация» как термин.",
       "- Цифра 3427 Н, ускорения, «обзор 2022» остался только плашкой.",
       "- Блок «как держать удар» сжат до одной строки на экране и фразы «стоп и врач»; подбородок вниз, руки у лица видны на кадрах, но не озвучены.",
       "- Реплика «Если пока полезно — подпишись» заменена концовкой с тизером следующего разбора.", "",
       "## Что проверить до рендера",
       "1. Озвучка новых сцен: реальная длина против выбранного числа ударов.",
       "2. F2 и F3: сверить формулировки с оригиналами, если будем публиковать.",
       "3. Принять семь новых картинок Codex (см. [codex-continue-01.md](codex-continue-01.md)).",
       "4. Фильтр безопасности канала: без крови, без лежащего человека крупным планом, на экране «стоп · врач»; сцена с обезьянами — только кружки, без изображения животных."]
open("channels/nauka-boya/script-01-90s.md", "w", encoding="utf8").write("\n".join(md) + "\n")

# ---------------- codex brief ----------------
SHOTS = [
    ("s7_dummy", "force", [], ACC_NONE.replace("No red anywhere in the picture.", "One accent red (#D92F2B) only on the silhouette's hand wraps; nothing else in the picture is red."),
     "Medium-wide shot in a sports lab that looks like a boxing gym. On the right, a grey paper crash-test dummy (torso, neck and a blank round head without any face) is mounted on a metal stand with a few thin cables and a small round sensor dot on the head. On the left, a faceless boxer drawn as a solid dark-navy paper silhouette (no face, no skin details, only red hand wraps) throws a straight punch at the dummy's head; the red-wrapped fist stops one centimeter before it. Background: cream wall and one big dusty-blue paper disc behind the dummy. Keep the top third calm and empty for text.",
     "верх чистый под «СИЛА» и плитки; манекен справа, силуэт слева"),
    ("s9_jelly_jar", "brain", [], "One accent red (#D92F2B) only on the jelly; nothing else in the picture is red.",
     "Still life, no people. A big transparent glass jar stands on a kraft-paper table, filled with glossy wobbling red jelly (a soft dome with gentle folds, slightly translucent), a small spoon leans on the jar. Behind it a cream paper wall and one big dusty-blue paper disc. Keep the top third and the left third calm and empty for text.",
     "банка по центру-справа, слева и сверху пусто под заголовок «МОЗГ = ЖЕЛЕ»"),
    ("s12_chin_profile", "lever", ["gromila"], ACC_NONE,
     G + "\nClose-up side view, profile facing right: Gromila's head, neck and upper shoulders, relaxed neutral face, mouth closed, the chin clearly visible and slightly raised. Plain cream paper background with one big soft dusty-blue paper disc behind the head. The head is large and sits in the left-centre of the picture; the right 40% and the top quarter stay calm and empty for diagram overlays added later. No cross-section, no anatomy cut-away, no arrows.",
     "голова слева-по центру, справа 40% и верх чистые под схему рычага"),
    ("s14_unseen", "unseen", ["tetsu", "gromila"], ACC_T,
     T + "\n" + G + "\nWide shot in a boxing ring, boxing gym background built from paper layers in cream and dusty blue. Gromila on the right looks away from Tetsu toward the right edge of the picture and swings a big slow right overhand at nothing, his left guard dropped, eyes on his own swing. Tetsu on the left comes from Gromila's blind side with a short left hook, the red-wrapped glove one centimeter from the jaw, no contact, no injury. Keep the top third calm and empty for text.",
     "верх чистый под «УДАР, КОТОРОГО НЕ ВИДИШЬ»; глаза Громилы читаются"),
    ("s15_neck_tense", "neck", ["tetsu"], ACC_T,
     T + "\nMedium close-up of Tetsu from the chest up, three-quarter view facing right, chin tucked down, shoulders raised, the neck and trapezius muscles clearly tensed and defined, fists up in a boxing guard with red-wrapped hands near the jaw, focused eyes under the brow. Background: cream wall with one big dusty-blue paper disc. Keep the left third and the top quarter calm and empty for diagram bars and text.",
     "слева и сверху пусто: туда встают две бумажные полосы и заголовок"),
    ("s17_doc_stop", "safe", ["doc"], ACC_NONE,
     D + "\nBackground: an old 1970s gym built from paper layers in warm kraft and cream (wall bars, plain wall), no people in the background.\nMedium shot. Doc stands on the left facing the viewer, one palm raised flat toward the viewer in a clear stop gesture, the other hand holds a clipboard against his hip, a caring but serious look over his glasses. Keep the right half calm and empty for a stamp added later. No medical symbols, no crosses, no text.",
     "правая половина чистая под штамп «СТОП · ВРАЧ»"),
    ("s18_bag_scale", "next", [], "One accent red (#D92F2B) only on the gauge needle; nothing else in the picture is red.",
     "Still life in a boxing gym built from paper layers in cream and dusty blue. A heavy punching bag hangs from a chain on the left; on the right a big round paper dial gauge on a stand, like a dynamometer, with tick marks but no numerals and no text, its needle in the upper third. A pair of grey boxing gloves hangs from a hook at the edge. No people. Keep the top third calm and empty for text.",
     "верх чистый, шкала справа: камера наезжает на стрелку"),
]
EXIST = [("s1b_hook_hit", "turn, answer"), ("s3a_punch", "side, answer"), ("s3b_sag", "answer"), ("s5_doc", "exp72"), ("s6b_brain", "brain, hypo")]
cx = ["# Codex: продолжение ролика 01 до 1:30", "",
      "Всё ниже — задание для Codex. Кадры хука уже приняты, трогать их не надо. Нужно сгенерировать **7 новых картинок** для 12 новых сцен; остальные сцены используют уже готовые кадры. Сценарий и текст озвучки — в [script-01-90s.md](script-01-90s.md).", "",
      "## Что уже сделано (не менять)",
      "- Хук 22 с собран и отрендерен: `nauka-frames/out/nauka-frames-hook.mp4`. Голос и тайминги хука не меняем.",
      "- Листы героев в бумажном стиле: `nauka-frames/assets/sheets/{tetsu,gromila,doc}.png`. Девять кадров хука: `nauka-frames/assets/shots/`.",
      "- Громила обновлён 31.10 по принятым примерам (светлая кожа, залысины, светлая борода, голубые глаза; см. `nauka-frames/spec/gromila-likeness-v2.json`). Старого лысого Громилу с тёмной бородой больше не рисуем. Перед генерацией прочитать [SPRITE-STYLE.md](SPRITE-STYLE.md).",
      "- Принятый эталон стиля: `nauka-frames/assets/shots/s1a_hook_wide.png`. Рука Тэцу в хуке прямая, это согласовано: в новых кадрах сохранять тот же силуэт.", "",
      "## Правила (те же, что в v3)",
      "- Бумажный коллаж: рваные края с белой кромкой, тени между слоями, зерно, палитра крафт / крем / пыльно-синий / горчичный / тёплый серый, красный `#D92F2B` только там, где указано в строке «акцент».",
      "- PNG 1536×1024, без текста, цифр, логотипов, стрелок, кругов, эффектов, крови, ран и оружия. Всё важное внутри центральной полосы 16:9.",
      "- Герои строго по листам (лицо, шрам Тэцу, борода Громилы, цвета одежды). Реальных людей не рисуем; боксёр в `s7_dummy` — безликий тёмный силуэт.",
      "- Нокаут не показываем крупным планом лежащего человека; для медицины — только жест «стоп» у Дока, без символов.",
      "- В PowerShell передавать время с десятичной точкой (в прошлый раз запятая ломала список секунд).", "",
      "## Порядок", "1. Первым — только `s14_unseen` (два героя, самый сложный кадр). Показать результат, проверить по чек-листу ниже.",
      "2. Если стиль и герои держатся — остальные шесть. К каждому прикладывать `s1a_hook_wide.png` и добавлять в конец промта строку: `" + MATCH + "`",
      "3. Сохранять под указанными именами в `nauka-frames/assets/shots/`.", "",
      "## Что берём из готового", "", "| кадр | сцены |", "|---|---|"]
cx += [f"| `{n}` | {u} |" for n, u in EXIST]
cx += ["", "## Новые кадры: что приложить и что вставить", ""]
for fn, sc, sh, acc, scene, calm in SHOTS:
    att = ", ".join(f"`nauka-frames/assets/sheets/{s}.png`" for s in sh)
    att = (att + ", " if att else "") + "`nauka-frames/assets/shots/s1a_hook_wide.png`"
    p = STYLE.replace("ACCENT", acc) + "\n\n" + (REF + "\n\n" if sh else "") + scene + "\n\n" + MATCH
    cx += [f"### {fn} (сцена `{sc}`)", f"Приложить: {att}", f"Сохранить как: `nauka-frames/assets/shots/{fn}.png`", f"Спокойная зона: {calm}", "```", p, "```", ""]
cx += ["## Чек-лист на каждый результат",
       "- Бумажный коллаж, рваные края, тени между слоями, без чёрных контуров; тот же материал и свет, что в `s1a_hook_wide.png`.",
       "- Герои как на листах; Громила как на новом листе, с выражением по смыслу сцены (в `s14_unseen` он смотрит мимо, в `s12_chin_profile` спокоен).",
       "- Нет текста, цифр на шкале, стрелок, эффектов, крови, медицинских знаков.",
       "- Красный только в указанном месте. В `s7_dummy`, `s9_jelly_jar` и `s18_bag_scale` красный акцент осознанно стоит не на бинтах Тэцу (как красный мозг в `s6b_brain`), хотя `SPRITE-STYLE.md` разрешает красный только на бинтах: если Codex считает это ошибкой, пусть скажет, не подгоняя молча.",
       "- Есть спокойная зона под надписи и схемы (см. строки «Спокойная зона»).",
       "- PNG 1536×1024.", "",
       "## После генерации: что делает Codex",
       "1. Положить семь PNG в `nauka-frames/assets/shots/`, дописать их промты и референсы в `nauka-frames/spec/image-generation-v3.json` (раздел для новых кадров, как для первых девяти).",
       "2. Закоммитить в `main` одним коммитом с понятным сообщением и запушить, как в прошлый раз. Хук и `nauka-pencil/`, `nauka-toon/` не трогать.",
       "3. Сообщить Claude, что кадры лежат; ничего из пункта «Сборка» ниже без согласования не делать, если на это нет отдельной просьбы.", "",
       "## Сборка (после кадров), чтобы продолжить любому из нас",
       "1. `nauka-frames/spec/hook.json`: дописать 12 сцен (`id`, `beats`, `voice`, `sfx`) из таблицы в `script-01-90s.md`; хук-сцены не менять.",
       "2. `scripts/tts.py` (как для хука): озвучка, получить `spec/words.json` и `spec/voice.json`; проверить, что каждая сцена не короче своего голоса, иначе перераспределить удары (сумма новых сцен остаётся 102).",
       "3. `build.mjs`: добавить имена семи новых кадров в `SHOTS`; `node build.mjs` и `python -I scripts/mix.py`.",
       "4. `engine/frames.js`: сцены `SC.force … SC.next`, добавить их в `ORDER`, `GRAIN_A`, `HITS` (слова-удары по таймкодам озвучки) и `TR` (направление карточки на каждую новую сцену); `ANCH` для новых кадров измерить на готовых картинках.",
       "5. `npx hyperframes check --json`, снимки на словах-ударах и стыках, черновой рендер `--quality draft`, декодированные кадры стыков; затем предпросмотр, и только после одобрения `--quality delivery --output out/nauka-frames-hook-90s.mp4`.",
       "6. Записать итерацию в `nauka-frames/ITERATION.md` (интервал, наблюдение, причина, исправление, перепроверка) и честно перечислить, что не проверено: звук на слух, живое движение.", "",
       "## Что не делаем",
       "- Не менять голос и тайминги хука, не трогать `nauka-pencil/` и `nauka-toon/`.",
       "- Не добавлять новые научные утверждения и цифры, которых нет в `script-01.md`.",
       "- Не делать кукол и анимацию частей тела: движется только целая картинка."]
open("channels/nauka-boya/codex-continue-01.md", "w", encoding="utf8").write("\n".join(cx) + "\n")
print("scenes", len(rows), "beats", total_beats, "=", total_beats * BEAT, "s; new beats", new_beats, "new words", nw)
