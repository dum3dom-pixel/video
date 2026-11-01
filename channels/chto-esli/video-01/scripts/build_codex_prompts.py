"""Build the full Codex image brief for video 01 (script v5) from one shot table.

Writes:
  ../codex-video-01-prompts.md   shot list overview + one self-contained English prompt per image
  spec/codex-shots.json          the same table for the build scripts

Run from channels/chto-esli/video-01:  python -X utf8 scripts/build_codex_prompts.py
"""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT_MD = ROOT.parent / "codex-video-01-prompts.md"
OUT_JSON = ROOT / "spec" / "codex-shots.json"

# --------------------------------------------------------------------------------------
# Shared blocks. STYLE and EXCLUSIONS come verbatim from codex-pilot-01-hd.md.
# --------------------------------------------------------------------------------------
STYLE = (
    "Style/material: handmade multilayer paper-collage illustration with warm, gently faded family-photo-album colors. "
    "Matte colored paper, clearly visible natural fibers, uneven cut/torn edges and thin cream fiber rims. Separate overlapping "
    "paper layers with soft shallow contact shadows. Flat forms with slight paper-tone variation; faces use small cut-paper shapes "
    "and restrained dark ink-like details in shaded palette colors. No black outlines, photographic skin, smooth vector art, glossy "
    "plastic or 3D rendering. Paper fibers are physical material texture. Do not bake in film grain, noise overlays, a film "
    "vignette, blur, lens effects or transitions: code adds those later."
)

PALETTE = (
    "Full base palette: mustard yellow #D9A441, cream #F1E6CF, brick brown #8C4A32, olive green #7A7F3F, faded teal #5E8C8A, "
    "warm gray #A59B8C. Use only these six base colors with restrained light/shadow variations. Skin and pale fibers are cream; "
    "dark hair and facial details use shaded warm gray and brick brown. No additional pure-white or black flat colors. "
    "Night and evening use the same palette, only darker: mustard lamp light, muted teal window light, no black. "
    "{red_rule}"
)

SHARP = (
    "Sharpness (most important technical requirement): draw this as a finished, high-detail master that will be shown at 1:1 "
    "on a 1920x1080 screen. Every edge is crisp and clean; paper fibers are sharp and visible; faces are built from deliberate "
    "small cut-paper shapes with clear eyes, brows and mouth. The whole frame is equally sharp: no depth-of-field, no soft focus, "
    "no smeared or muddy textures, no painterly mush, no upscaled look. Small background objects are kept simple and large "
    "enough to stay readable; do not draw tiny faces or tiny details that would turn into noise."
)

SHARP_CU = (
    "Close-up master: the subject fills the frame and every detail is drawn at final scale, because the picture will be shown "
    "at 1:1 with no further zoom. Hair strands, eyelashes, paper fibers, cut edges and small parts are individually crisp. "
    "No soft focus, no smoothing, no painterly texture."
)

OUT_WIDE = (
    "Output/composition: one opaque PNG, landscape 16:9, whole picture to the edges, nothing cropped or letterboxed. Use the "
    "largest 16:9 size the tool allows (target 2560x1440; if the tool cannot, keep its maximum, never below 1536x864) and "
    "report the real size. The lowest 20 percent of the height is quiet (floor, table, wall or empty ground): no faces, hands "
    "or key objects there, because subtitles sit on it. Faces and key objects stay above 75 percent of the height. "
    "Never draw guides or labels."
)

OUT_BG = (
    "Output/composition: one opaque PNG, landscape 16:9, an EMPTY set with no people, whole picture to the edges. Use the largest "
    "16:9 size the tool allows (target 2560x1440; never below 1536x864) and report the real size. Eye-level camera, a clear open "
    "floor area in the middle third where characters will later appear, important furniture in the upper 75 percent, the lowest "
    "20 percent calm and quiet. Never draw guides or labels."
)

OUT_SHEET = (
    "Output/composition: one opaque PNG on plain cream paper background, landscape 3:2, 1536x1024 or larger. {layout} "
    "Figures and objects are drawn BIG: together they fill at least 85 percent of the canvas height and most of its width, "
    "with only narrow even margins. No scene, no floor line, no props unless listed, no labels, no captions, no numbers."
)

EXCL = (
    "Strict exclusions: no text, letters, numerals, pseudo-writing, logos, watermarks, signatures, captions, speech bubbles, "
    "arrows, annotation marks, motion lines, impact bursts, sparkles or drawn effects. Book/notebook covers, notebook pages, "
    "paper sheets, calendar pages, cassette labels, newspaper columns, blackboards and phone or monitor screens are completely "
    "blank (newspaper columns are plain gray bands); clock dials have no numerals or ticks, only two plain hands. Geometric "
    "carpet ornament and blanket checks are material patterns, not annotations. No additional people or props beyond those "
    "listed, no modern devices unless listed, no brands, no blood, wounds or weapons. Original fictional characters only. "
    "Scenes are complete finished illustrations; character-sheet views are intact figures, never separated body parts, "
    "puppet rigs or assembly diagrams."
)

# --------------------------------------------------------------------------------------
# Characters: every prompt that shows a person repeats the matching line, so identity does not depend only on attachments.
# --------------------------------------------------------------------------------------
SASHA_CORE = (
    "Sasha: the same face at every age: tousled dark brown hair with one stubborn cowlick on top, large serious dark eyes with "
    "faint shadows under them (a far too grown-up gaze), eyebrows slightly drawn together, a straight small nose, a mouth that "
    "rarely smiles."
)
CHARS = {
    "sasha12": SASHA_CORE + " Age 12 (year 2005): small, thin boy. Home: olive T-shirt with one chest pocket, warm gray trousers, "
               "barefoot or in socks. School: cream shirt, warm gray trousers. Outdoors: olive windbreaker.",
    "sasha15": SASHA_CORE + " Age 15 (year 2008): taller and lanky, longer arms and neck, hair a little longer, same cowlick, "
               "same too-old gaze. Faded teal sweatshirt or cream shirt, warm gray trousers.",
    "sasha19": SASHA_CORE + " Age 18 to 20 (years 2011-2013): lean young man, hair slightly longer, first light shadow on the "
               "jaw. Graduation: an oversized warm gray blazer that is too wide in the shoulders. Otherwise a mustard hoodie.",
    "sasha26": SASHA_CORE + " Age 26 (year 2019): adult man, narrow face, short hair with the cowlick still alive, light stubble, "
               "tired kind eyes. Cream linen shirt with rolled sleeves, warm gray trousers.",
    "sasha31": SASHA_CORE + " Age 31 (year 2024): adult man, lean, hollow-cheeked, a little tired, short hair, light stubble, "
               "gray hoodie.",
    "sasha33": SASHA_CORE + " Age 33 (year 2026): adult man, faint lines at the eyes, short neat hair with the cowlick, no "
               "stubble, calm eyes, teal-gray sweater over a cream shirt.",
    "mama38": "Mama, 38: curly chestnut hair held by a mustard clip, kind tired round face, olive robe with small mustard flowers, "
              "cream apron, teal slippers. Warm, quick, practical.",
    "mama59": "Mama, about 59 (seen only on a phone screen): the same face as Mama but older: gray strands in the curls, shorter "
              "haircut, reading glasses pushed up on the forehead, confused squint.",
    "papa40": "Papa, 40: stocky, slightly heavy, taller than Mama; broad kind tired face; thick chestnut horseshoe moustache; "
              "short dark hair with receding temples; Sasha's nose and brows (by 2008 a few more lines at the eyes, a little gray in the moustache). At home: faded cream sleeveless undershirt under an "
              "open olive-and-mustard plaid shirt, warm gray sweatpants, teal slippers, a plain wedding ring.",
    "kostya17": "Kostya, 17 in 2005 (use for 2005-2009, he is 17 to 21): Sasha's older brother; tousled dark brown wavy hair, easy "
                "half-smile, lanky; warm gray hoodie with rolled sleeves, faded teal jeans, white socks.",
    "kostya25": "Kostya, 25 (year 2013): the same face and wavy dark brown hair as at 17, a little broader, light stubble, proud "
                "cheerful grin; mustard jacket over a cream T-shirt.",
    "kostya38": "Kostya, 38 (year 2026): the same man grown up: completely bald head, warm tired eyes, the same nose and eyebrows "
                "as at 17, light stubble, broader build; olive-and-mustard flannel shirt with rolled sleeves.",
    "ded": "Grandfather Lyosha, about 72: wiry and thin, short gray cropped hair, big ears, gray stubble, round old safety glasses "
           "pushed up on the forehead, worn brown work apron over an olive checked shirt, strong veined hands.",
    "lena": "Lena, 26: soft round face, calm amused eyes, shoulder-length warm light-brown hair, a few freckles, oversized "
            "faded-teal knitted cardigan, hands always wrapped around a big mug even in the heat.",
    "dimka12": "Dimka, 12: classmate; round face, buzz cut, a huge olive sweater, always chewing something, cheerful shrug.",
    "dimka19": "Dimka, 19: the same round face grown up, tall, cheap mustard jacket, holding a plain phone (a flat slab in warm "
               "dark gray with a blank glowing screen).",
    "gena": "Gena, 14: school bully; big, broad, pale crew cut, brick-brown sweatshirt, heavy brow, scowl.",
    "teacher": "Teacher, 55: gray bun, round glasses, olive cardigan, strict but not unkind.",
    "seller": "Market seller, middle-aged woman: fingerless knitted mitts, mustard headscarf; only her hands and arms are visible.",
}

# --------------------------------------------------------------------------------------
# Attachment shorthand (paths relative to video-01/assets/).
# --------------------------------------------------------------------------------------
A = {
    "sasha": "sheets/sasha_sheet_hd.png",
    "sasha_ages": "sheets/sasha_ages_sheet.png",
    "sasha_faces": "sheets/sasha_faces_sheet.png",
    "kostya": "sheets/kostya_sheet_hd.png",
    "kostya38": "sheets/kostya38_sheet.png",
    "mama": "sheets/mama_sheet_hd.png",
    "papa": "sheets/papa_sheet.png",
    "ded": "sheets/ded_sheet.png",
    "lena": "sheets/lena_sheet.png",
    "cast": "sheets/supporting_cast_sheet.png",
    "tape": "sheets/props_tape_sheet-v2.png",
    "misc": "sheets/props_misc_sheet.png",
    "door": "bg/bg_door_wall_hd.png",
    "carpet": "bg/bg_carpet_wall_hd.png",
    "kitchen": "bg/bg_kitchen-v2.png",
    "class": "bg/bg_classroom.png",
    "kroom": "bg/bg_kostya_room.png",
    "yard": "bg/bg_yard.png",
    "garage": "bg/bg_garage.png",
    "terrace": "bg/bg_terrace.png",
    "kitchen2": "bg/bg_kitchen_adult.png",
}

SECTIONS = {
    "SHEETS": "0. Листы персонажей и предметов (делаем первыми)",
    "BG": "0. Задники (пустые комнаты, без людей)",
    "HOOK": "Хук 0:00–0:38",
    "RULES": "Правила 0:38–1:18",
    "E1": "Эпоха 1. День первый 1:18–2:36",
    "E2": "Эпоха 2. Первые месяцы 2:36–4:11",
    "E3": "Эпоха 3. Тополь 4:11–4:41",
    "E3B": "Эпоха 3б. План на 21 год 4:41–5:33",
    "E4": "Эпоха 4. Октябрь 2008 5:33–6:50",
    "E4B": "Эпоха 4б. Пункт седьмой 6:50–7:12",
    "E5": "Эпоха 5. Воскресенья 7:12–8:09",
    "MON": "Монтаж 2011–2015 8:09–8:44",
    "E6": "Эпоха 6. Июль 2019 8:44–9:38",
    "TURN": "Поворот. Март 2024 9:38–10:15",
    "FIN": "Финал. Осень 2026 10:15–11:24",
    "Q": "Вопрос 11:24–11:38",
    "PV": "Превью (две обложки)",
}

SHOTS: list[dict] = []


def S(id, sec, kind, ru, en, chars=(), att=(), red="none", cam="дрейф ≤1.08×", code="", prio="A", file=None, layout=""):
    """kind: sheet | bg | wide | cu."""
    if file is None:
        folder = {"sheet": "sheets", "bg": "bg"}.get(kind, "shots")
        file = f"{folder}/{id}.png"
    SHOTS.append(dict(id=id, sec=sec, kind=kind, ru=ru, en=en, chars=list(chars), att=[A.get(a, f"shots/{a}.png") for a in att],
                      red=red, cam=cam, code=code, prio=prio, file=file, layout=layout))


# ====================================== SHEETS ===========================================
SHEET_LAYOUT = ("Layout: three full-length figures left to right (front view, side view, back view) at identical scale, then one "
                "large head-and-shoulders portrait at the right, as tall as the figures.")
S("sasha_ages_sheet", "SHEETS", "sheet", "Саша в 5 возрастах: 12, 15, 19, 26, 33",
  "Character lineup of Sasha at five ages standing side by side, all front view, same scale reference, neutral standing pose, "
  "arms relaxed: 12 (small boy), 15 (lanky teen), 19 (young man, hair a bit longer), 26 (adult, light stubble), 33 (adult, "
  "calm, no stubble). It must be unmistakably the same person: same eyes, brows, nose and cowlick; only age and clothing change. "
  "Ages 12 and 33 wear what is described; the middle ones wear the clothes described for their age.",
  ["sasha12", "sasha15", "sasha19", "sasha26", "sasha33"], ["sasha"],
  layout="Layout: five full-length front-view figures in one row, left to right in age order 12, 15, 19, 26, 33, every figure "
         "about 85 percent of the canvas height.", code="Единственная опора для взрослого Саши в кадрах", prio="A")
S("sasha_faces_sheet", "SHEETS", "sheet", "Лица Саши крупно: 6 голов (12, 15, 19, 26, 31, 33)",
  "Six large head-and-shoulder portraits of Sasha arranged in a 3x2 grid, front or three-quarter view, same lighting: ages 12, 15, "
  "19, 26, 31, 33 in that order. Same eyes, brows, nose and cowlick in all six; only age marks differ (lanky jaw, stubble, first "
  "lines at the eyes). Neutral serious expression.",
  ["sasha12", "sasha15", "sasha19", "sasha26", "sasha31", "sasha33"], ["sasha"],
  layout="Layout: six head-and-shoulders portraits in a 3 by 2 grid, each portrait filling its cell almost completely.",
  code="Эталон лица для крупных планов", prio="A")
S("kostya38_sheet", "SHEETS", "sheet", "Костя в 38: лысый, лист по образцу листа Кости",
  "Character sheet of Kostya at 38 in the same format as the attached 17-year-old sheet. Calm neutral pose, warm tired eyes, "
  "bald head (smooth shaved scalp with cut-paper highlights), light stubble.",
  ["kostya38"], ["kostya"], layout=SHEET_LAYOUT, code="Финал; контраст с 17-летним Костей из хука", prio="A")
S("ded_sheet", "SHEETS", "sheet", "Дед Лёша, ~72 года",
  "Character sheet of Grandfather Lyosha. Calm neutral pose, hands visible, work apron.",
  ["ded"], ["mama"], layout=SHEET_LAYOUT, prio="A")
S("lena_sheet", "SHEETS", "sheet", "Лена, 26 лет",
  "Character sheet of Lena. Standing pose with both hands holding a big plain mug in front of her chest; the mug is in the front "
  "and side views, and the portrait shows her warm amused look.",
  ["lena"], ["mama"], layout=SHEET_LAYOUT, prio="A")
S("supporting_cast_sheet", "SHEETS", "sheet", "Массовка: Димка 12 и 19, Гена, учительница, продавщица",
  "Lineup of five supporting characters, each a full-length front view at the same scale, neutral pose: Dimka 12, Dimka 19, "
  "Gena 14, the teacher, and the market seller shown only as a pair of hands and arms in knitted mitts holding a stack of "
  "plain cassettes (no face).",
  ["dimka12", "dimka19", "gena", "teacher", "seller"], ["sasha"],
  layout="Layout: five figures in one row, left to right in the order listed, each about 85 percent of the canvas height.",
  prio="A")
S("props_misc_sheet", "SHEETS", "sheet", "Мелкие предметы: паяльник, копилка, смартфон, чашки",
  "Props sheet. (1) A soldering iron with a wooden handle and a thin metal tip, on a small stand. (2) A candy tin used as a "
  "piggy bank, mustard lid with a coin slot, a few coins beside it. (3) A bulky 2005 CRT monitor with a beige-warm-gray tower "
  "case, blank teal-glow screen. (4) A plain 2012 smartphone: flat slab in warm dark gray, blank glowing screen, no logo. "
  "(5) A big plain mug and a smaller mug. (6) An old round alarm-style wall clock with a blank dial and two plain hands.",
  [], [], layout="Layout: six objects in a 3 by 2 grid, each object large in its cell.", prio="A")

# ====================================== BACKGROUNDS ======================================
S("bg_classroom", "BG", "bg", "Класс 2005, пустой",
  "Empty school classroom in 2005, morning light. A big olive-green blackboard filling the back wall (blank), three rows of wooden "
  "desks with chairs, teacher's desk on the left, tall windows on the right with morning light, empty picture frames on the wall.",
  [], ["door"], prio="A")
S("bg_kostya_room", "BG", "bg", "Комната Кости",
  "Empty bedroom of a 17-year-old in 2005 seen from the door: a bed along the left wall, above it two or three posters with "
  "abstract silhouettes only (guitar, profile, star; no text), a desk with a pile of plain cassettes and an old chair, a window with "
  "evening light, socks on the floor. Same wall paper, parquet and woodwork as the attached bedroom.",
  [], ["door"], prio="A")
S("bg_yard", "BG", "bg", "Двор в мае: панельный дом, гаражи, старый тополь",
  "Empty courtyard in May 2006, eye level from the building entrance. A warm gray five-storey panel block with an entrance door and "
  "a bench; on the right a row of brick-brown garages with flat roofs; above them a huge old poplar leaning toward the garages; a "
  "teal-frame bicycle leaning against the poplar trunk; poplar fluff floating in the air.",
  [], ["door"], code="Для e3_bench, e3_fallen и зимней версии", prio="A")
S("bg_garage", "BG", "bg", "Гараж деда: верстак, паяльник, радио",
  "Empty garage interior, daylight through the open door on the left: a heavy wooden workbench along the back wall, tools on a "
  "pegboard, a small old radio on the bench, a three-legged stool, a bicycle upside down on the floor waiting for repair, jars of "
  "screws on a shelf.",
  [], ["door"], prio="A")
S("bg_terrace", "BG", "bg", "Терраса, июль 2019",
  "Empty summer terrace of a country house at a party, hot afternoon: wooden planks floor, a long table with plain paper plates "
  "and cups, folding chairs, strings of plain bulbs, olive vines on the railing, bright mustard light.",
  [], ["door"], prio="A")
S("bg_kitchen_adult", "BG", "bg", "Кухня взрослого Саши (2024 и 2026)",
  "Empty modern flat kitchen: plain cream cupboards, a small table with two chairs, a kettle, a window, a doorway on the right "
  "leading to a dark corridor with a room door. Neat and a bit lonely. Same paper-collage materials as the other kitchen but newer.",
  [], ["kitchen"], prio="A")

# ====================================== HOOK =============================================
S("h_sasha_palm", "HOOK", "wide", "[ладонь на лице] «Ты помнишь следующие двадцать один год»",
  "Morning, the bedroom from the attached background. Sasha sits on the edge of the bed, one palm pressed over his face, the other "
  "hand gripping the blanket. Medium-wide view, the room around him calm and warm.",
  ["sasha12"], ["door", "sasha"], cam="медленный наезд до 1.10×", code="Текст-мысль «Прекрасно…»")
S("h_school_bag", "HOOK", "wide", "[Мысль] «…а в школу всё равно идти»",
  "A school backpack on a chair, a cream school shirt on a hanger beside it, morning window light, a calm bedroom corner. No "
  "people.", [], ["door"], prio="B", code="Мысль подписью, можно заменить p4_sasha")
S("h_cassette_box", "HOOK", "wide", "[коробка кассет] «…ты поставишь брату одну из своих кассет»",
  "Top and slightly side view of an open old shoebox on a kitchen table; in it 21 identical olive cassettes stand tightly in a "
  "row with blank labels. One cassette near the right end is lifted a little higher than the others. The row runs along the long "
  "side of the frame so the camera can travel along it. Warm evening light, a little dust.",
  [], ["tape"], cam="проезд вдоль ряда до «2024», затем врезка CU", code="Годы на наклейках, остановка на «2024»")
S("h_cassette_2024_cu", "HOOK", "cu", "Крупно кассета «2024» (наклейка пустая)",
  "Extreme close-up of one olive cassette, slightly rotated, filling the frame: its blank cream label large and clean, the two "
  "reel windows with detailed reels, the screws and the cut paper edges all visible. Soft warm light.",
  [], ["tape"], code="Год «2024» на наклейке накладывает код, красным", prio="A")
S("h_kostya_hair_cu", "HOOK", "cu", "Крупно: Костя 17 лет, волосы и лицо (вместо зума 2.6×)",
  "Close-up, head and shoulders, Kostya at 17 standing in the open bedroom doorway, the door edge visible at the right. Hair "
  "strands drawn individually, an easy half-smile, morning light from the corridor behind. Identical costume and face to the "
  "attached full shot.",
  ["kostya17"], ["kostya", "door"], cam="без зума; дрейф ≤1.05×", code="Заменяет digital zoom на p2_kostya")
S("h_sasha_eyes_cu", "HOOK", "cu", "Крупно: глаза Саши 12 лет (вместо зума 2.6×)",
  "Extreme close-up of Sasha's face from forehead to chin, filling the frame, eyes wide open, a far too grown-up gaze, faint "
  "shadows under the eyes, slightly drawn brows, hair strands crisp. Soft morning light from the left.",
  ["sasha12"], ["sasha", "sasha_faces"], cam="без зума; дрейф ≤1.05×", code="Заменяет digital zoom на p4_sasha")

# ====================================== RULES ============================================
S("r_paper_desk", "RULES", "wide", "Фон под три правила (текст кладёт код)",
  "A calm background for on-screen text: a wooden desk seen straight from above, a sheet of cream handmade paper in the centre "
  "with torn edges, a pencil and an eraser at the lower left, a mustard torn paper strip at the top left corner. The large "
  "centre of the sheet stays completely empty.",
  [], ["door"], code="«Перезапуска нет» / «Словам не верят» / «Знание тает»; третье правило: текст тает")
S("r_adults_soup", "RULES", "wide", "«Взрослые кивают и просят доесть суп»",
  "Kitchen table: Mama and Papa lean toward Sasha with kind, patient, condescending half-smiles, nodding, while a bowl of soup "
  "steams in front of Sasha, who looks flatly at the viewer. Camera slightly low, kitchen morning light.",
  ["mama38", "papa40", "sasha12"], ["kitchen", "mama", "papa", "sasha"],
  red="the lifebuoy fridge magnet only if the fridge is in frame", code="Лёгкий «кивок» двух бумажных слоёв")

# ====================================== EPOCH 1 ==========================================
RED_KIT = "the lifebuoy fridge magnet only if the fridge is in frame"
S("e1_mama_bread", "E1", "wide", "«Мама режет хлеб и спрашивает, почему ты так смотришь»",
  "Kitchen, morning. Mama cuts a bread loaf at the table and glances back over her shoulder; Sasha sits at the table staring at "
  "her with eyes that are slightly wet. Warm light from the window.",
  ["mama38", "sasha12"], ["kitchen", "mama", "sasha"], red=RED_KIT, cam="медленный наезд до 1.10×")
S("e1_videocall", "E1", "cu", "Воспоминание: «видеосвязь, мама просит включить звук»",
  "Night, close-up: a man's hand (gray sleeve, no face) holds a plain smartphone. On the blank glowing screen Mama at 59 sits too "
  "close to her camera, seen from below at a slight angle, squinting, glasses on her forehead. Cool teal tone, the room dark.",
  ["mama59"], ["mama", "misc"], code="Значок выключенного микрофона, лёгкое «зависание» кадра; тон холоднее")
S("e1_oilcloth", "E1", "cu", "Макро: клеёнка с надорванным краем, ладонь Саши",
  "Macro of a corner of the checked oilcloth with a frayed torn edge, bread crumbs on it, and a child's palm resting on it.",
  ["sasha12"], ["kitchen"], cam="наезд до 1.10×", code="«Клеёнку выбросят через четыре года»")
S("e1_papa_pan", "E1", "wide", "«Папа ест яичницу со сковородки и читает газету. У него усы»",
  "Kitchen. Papa at the table eats fried eggs straight from a cast-iron frying pan and holds an unfolded newspaper in the other "
  "hand (columns are plain gray bands). In the foreground the shoulder and the back of the head of Sasha, who stares at his "
  "moustache. Morning light.",
  ["papa40", "sasha12"], ["kitchen", "papa", "sasha"], red=RED_KIT, cam="наезд на усы до 1.10×, дальше CU")
S("e1_papa_lowers", "E1", "wide", "«Папа медленно опускает газету»",
  "Closer view: Papa has lowered the newspaper and looks over it at Sasha, eyebrows raised, a fork frozen in the air. The "
  "moment of silence is readable in the faces.",
  ["papa40"], ["papa", "e1_papa_pan"], cam="медленный наезд до 1.10×")
S("e1_cocoa", "E1", "wide", "«Ты просишь кофе. Мама ставит перед тобой какао»",
  "Kitchen table: Mama sets a big mug of cocoa in front of Sasha; Sasha looks at the mug with flat, tired disbelief.",
  ["mama38", "sasha12"], ["kitchen", "mama", "sasha"], red=RED_KIT)
S("e1_clock_ten", "E1", "wide", "«Отбой в десять. Тебе тридцать три»",
  "Hallway at evening: a round wall clock with a blank dial and hands showing ten o'clock, below it Sasha in pyjamas with arms "
  "crossed looking up at it with adult resignation.",
  ["sasha12"], ["door", "sasha", "misc"], prio="B", code="Подпись «Отбой в 22:00»; можно заменить ближайшим кадром")
S("e1_school_board", "E1", "wide", "«Сколько будет три пятых плюс две седьмых — ты не знаешь»",
  "Classroom: Sasha stands at the blank blackboard holding a piece of chalk, shoulders slumped; the teacher sits at her desk "
  "watching; the class is seen only from behind. Morning light.",
  ["sasha12", "teacher"], ["class", "sasha", "cast"], code="Дроби и вопросительный знак рисует код, меловым шрифтом")
S("e1_plan_night", "E1", "wide", "«Вечером ты пишешь план. Очень взрослый»",
  "Sasha's bedroom at night: desk, lamp with mustard light, window dark teal. Sasha writes on a paper sheet, frowning in a "
  "grown-up way. Same desk, lamp and window as the attached background.",
  ["sasha12"], ["door", "sasha"], cam="медленный наезд до 1.10×")
S("e1_plan_sheet", "E1", "cu", "Листок «ПЛАН» сверху (пункты пишет код)",
  "Top-down view: a large blank sheet of lined-less paper in the centre under a lamp, a child's hand holding a pencil at its "
  "edge. The sheet fills 70 percent of the frame, its surface completely blank and flat for code-written text.",
  ["sasha12"], ["door"], cam="наезд до 1.10×", code="«ПЛАН», пункты 1…7, «биткоин» на седьмом")
S("e1_lights_out", "E1", "wide", "«Через полчаса мама выключает свет»",
  "Bedroom viewed from the desk toward the door: Mama in the doorway with her hand on the light switch, bright corridor behind "
  "her, shaking her head with a warm smile; Sasha at the desk seen from behind.",
  ["mama38", "sasha12"], ["door", "mama", "sasha"], code="Щелчок выключателя, затемнение")

# ====================================== EPOCH 2 ==========================================
S("e2_try_mama", "E2", "wide", "Попытка 1: маме про телефон без кнопок",
  "Kitchen: Mama stirs a pot with a ladle, half turned and waving Sasha away; Sasha beside her draws a rectangle in the air with "
  "his hands.",
  ["mama38", "sasha12"], ["kitchen", "mama", "sasha"], red=RED_KIT, code="Бумажный смартфон выскакивает и сминается")
S("e2_try_teacher", "E2", "wide", "Попытка 2: учителю про интернет, «Садись, два»",
  "Classroom: the teacher at her desk points firmly at Sasha; Sasha stands by his desk; the whole class has turned to look.",
  ["teacher", "sasha12"], ["class", "cast", "sasha"], code="Бумажная «2» шлёпается в дневник")
S("e2_try_dimka", "E2", "wide", "Попытка 3: Димка «А игры там есть?»",
  "School corridor by a window sill: Dimka, chewing a bun, shrugs happily; Sasha beside him looks tired.",
  ["dimka12", "sasha12"], ["cast", "sasha"], code="—")
S("e2_stairs", "E2", "wide", "[лбом о перила] «держать всё в голове невыносимо, мелочи уже тают»",
  "Evening stairwell of a panel building: Sasha sits on a step and rests his forehead against the painted railing; soft window light.",
  ["sasha12"], ["door", "sasha"], code="Лёгкий «тук» на «стукаешься»")
S("e2_kostya_room", "E2", "wide", "«У Кости есть двухкассетник. «Зачем тебе?» — «Голос записывать»»",
  "Kostya's room: Kostya half reclines on the bed with the twin-deck cassette recorder on his lap, looking at Sasha suspiciously; "
  "Sasha stands in the doorway. The record key of the deck is the only red.",
  ["kostya17", "sasha12"], ["kroom", "kostya", "sasha", "tape"], red="the record key of the deck (one key)")
S("e2_kostya_gives", "E2", "wide", "«Костя долго смотрит и отдаёт магнитофон»",
  "Closer: Kostya sits holding the deck out to Sasha, a long weary look of an older brother; Sasha's hands reach up from below.",
  ["kostya17", "sasha12"], ["kroom", "kostya", "sasha", "tape"], red="the record key of the deck (one key)",
  cam="медленный наезд до 1.10×")
S("e2_market", "E2", "wide", "«Кассета на рынке стоит тридцать пять рублей»",
  "Open-air market stall under an awning, stacks of plain cassettes in boxes. The seller's mitten-covered hands arrange them; "
  "Sasha's palm on the counter holds a few coins and bills (no numbers).",
  ["seller", "sasha12"], ["tape", "cast", "sasha"], code="Бумажный ценник")
S("e2_labels", "E2", "wide", "«Берёшь двадцать одну… подписываешь маминым маркером»",
  "Top-down view of Sasha's desk: a neat row of 21 cassettes with blank labels, one set aside from the rest. A hand holds a "
  "marker above one label. Lamp light.",
  ["sasha12"], ["tape", "door"], cam="проезд по ряду", code="Годы 2006…2025 появляются по одному; «2026» уезжает вбок")
S("e2_rec_keys", "E2", "cu", "Макро: два пальца жмут две кнопки; катушки",
  "Macro of two small fingers pressing two keys at once: the red record key and the key next to it; above them the cassette "
  "window with both reels drawn large and flat.",
  ["sasha12"], ["tape"], red="the record key of the deck", code="Вращение катушек, щелчок «Начинаешь с конца»")
S("e2_recording", "E2", "wide", "«— Привет. Это ты. Только старше. Не выключай»",
  "Night at the desk: Sasha leans to the deck and speaks seriously into it, one hand on its case; lamp light.",
  ["sasha12"], ["door", "sasha", "tape"], red="the record key of the deck", cam="медленный наезд до 1.10×")
S("e2_life_work", "E2", "wide", "«работа» (взрослая жизнь по кассете 2025)",
  "Night office: the back of a man in a warm gray shirt lit by a monitor glow; no face, the screen blank.",
  [], [], code="Счётчик ленты", prio="B")
S("e2_life_bus", "E2", "wide", "«маршрутка»",
  "Minibus interior with a wet window; the back of a man's head by the window; city lights as soft paper circles (flat, not blurred).",
  [], [], prio="B")
S("e2_life_sofa", "E2", "wide", "«сериал перед сном»",
  "Dark room: feet in socks on a sofa, teal glow from a blank TV, a mug on the arm.", [], [], prio="B",
  code="Шипение, зерно сильнее")
S("e2_2024_night", "E2", "wide", "«На кассете 2024 одна минута: брат берёт трубку с первого гудка»",
  "Dark adult bedroom at night: a phone lights up on the bedside table; a man's hand (no face) picks it up on the first ring.",
  [], ["misc"], code="Врезка наклейки «2024», титр «Он ответил»")

# ====================================== EPOCH 3 ==========================================
S("e3_bench", "E3", "wide", "«Костя. В субботу во дворе упадёт тополь… Убери велик»",
  "Courtyard: Kostya on the bench by the entrance laughs with his head thrown back; Sasha beside him, serious, points at the poplar "
  "by the garages; the bicycle stands under the poplar.",
  ["kostya17", "sasha12"], ["yard", "kostya", "sasha"], cam="панорама на тополь до 1.10×", code="Тополиный пух слоем")
S("e3_fallen", "E3", "wide", "«В субботу тополь падает на гаражи»",
  "The same courtyard on Saturday: the poplar lies across the garage roofs with branches and leaves everywhere; the bicycle has "
  "been rolled safely to the entrance; Kostya stands with his mouth open.",
  ["kostya17"], ["yard", "kostya"], code="Встряска, облако пуха")
S("e3_bed_edge", "E3", "wide", "«Вечером Костя садится на край кровати. — Ладно. Что надо?»",
  "Sasha's bedroom in the evening: Kostya sits on the edge of the bed with his elbows on his knees, looking at the floor; Sasha "
  "sits on the pillow facing him.",
  ["kostya17", "sasha12"], ["carpet", "kostya", "sasha"], cam="медленный наезд до 1.10×")

# ====================================== EPOCH 3B =========================================
S("e3b_notebooks", "E3B", "wide", "«Операция «Мелкий»»: две тетради на одном столе",
  "Three-quarter top view of one desk: Sasha's notebook and Kostya's notebook open side by side, both brothers' hands writing, "
  "their elbows nearly touching; lamp light.",
  ["kostya17", "sasha12"], ["door", "kostya", "sasha"], code="Титр «2006 · 13 лет»")
S("e3b_gena", "E3B", "wide", "Гена подходит и идёт обратно",
  "School corridor: Gena, the big bully, has stopped in front of Sasha and is turning away uneasily; Sasha stands straight and "
  "looks back with a calm adult gaze.",
  ["gena", "sasha12"], ["cast", "sasha"], code="—")
S("e3b_fractions_cu", "E3B", "cu", "«Дроби ты тоже победил»",
  "Top-down: an open notebook page, completely blank, a pencil and an eraser, a small proud corner of Sasha's thumb.",
  ["sasha12"], [], prio="B", code="«31/35» рисует код")
S("e3b_library", "E3B", "wide", "Библиотека: самоучитель английского",
  "Library: tall shelves, Sasha at a long table over a thick self-study book with a blank cover and a notebook, lamp light.",
  ["sasha12"], ["sasha"], prio="B")
S("e3b_computer", "E3B", "wide", "Компьютер в зале: час в день",
  "Living room: Sasha sits at a CRT monitor with a blank teal-glow screen, spine straight, staring; a plain wall clock above him.",
  ["sasha12"], ["door", "sasha", "misc"], code="Часы «1 час» наложение")
S("e3b_piggybank", "E3B", "cu", "Копилка из-под конфет и листок ПЛАН, пункт седьмой обведён",
  "Top-down on a table: a candy-tin piggy bank with a few coins beside it, a blank plan sheet next to it; room for one circled "
  "item that code adds.",
  [], ["misc"], code="Обводка пункта 7 — код")

# ====================================== EPOCH 4 ==========================================
S("e4_flash_papers", "E4", "wide", "Флешбек: папа с банковскими бумагами",
  "Kitchen, evening, 2008: Papa at the table with a stack of bank papers (plain gray lines) and car keys, pleased; sepia-tinted "
  "memory mood. Camera straight.",
  ["papa40"], ["kitchen", "papa"], red=RED_KIT, code="Сепия, бумажная бирка «$»")
S("e4_car_taken", "E4", "wide", "«Машину забрали»",
  "Winter courtyard at dusk, the poplar already gone: a plain tow truck takes away a small sedan, Papa in a coat stands with his "
  "hands in pockets.",
  ["papa40"], ["yard", "papa"], code="Стрелка ×1,5")
S("e4_silent_dinner", "E4", "wide", "«Папа год молчал за ужином»",
  "Kitchen supper: Papa looks into his plate, Mama glances at him sideways, Sasha at 15 looks down; quiet yellow light.",
  ["papa40", "mama38", "sasha15"], ["kitchen", "papa", "mama", "sasha_ages"], red=RED_KIT)
S("e4_suitcase", "E4", "wide", "«Через два года родители разъехались»",
  "Hallway: a packed suitcase by the front door; on the hook rack one coat, the second hook empty. No people.",
  [], ["door"], code="—")
S("e4_straight_a", "E4", "wide", "«…три года учился на одни пятёрки»",
  "Sasha at 15 at his desk in daylight with a stack of notebooks, sitting very straight and writing diligently.",
  ["sasha15"], ["door", "sasha_ages"], code="Пятёрки шлёпаются в дневник")
S("e4_warn_kitchen", "E4", "wide", "Сентябрь 2008: «Пап, никогда не бери кредит в долларах»",
  "Kitchen: Sasha at 15 speaks earnestly to Papa; Papa laughs warmly, leaning back with a newspaper on his knee.",
  ["sasha15", "papa40"], ["kitchen", "sasha_ages", "papa"], red=RED_KIT)
S("e4_cassette_night", "E4", "wide", "Ночь, кассета «2008» (кассета отвечает на просьбу)",
  "Night, Sasha at 15 sits at his desk holding one cassette in both hands and looking at it; lamp light.",
  ["sasha15"], ["door", "sasha_ages", "tape"])
S("e4_briefcase", "E4", "wide", "Четверг: «Банк завтра в десять» — папа складывает бумаги",
  "Kitchen, Thursday evening: Papa packs bank papers into a leather briefcase; in the doorway behind him Sasha at 15 stands "
  "with his hands at his sides.",
  ["papa40", "sasha15"], ["kitchen", "papa", "sasha_ages"], red=RED_KIT, code="Титр «Банк завтра в 10:00»")
S("e4_papa_look_cu", "E4", "cu", "Папа долго смотрит на сына: «Ты никогда ни о чём его не просил»",
  "Close-up of Papa's face from the forehead to the chin: moustache in crisp strands, tired eyes slowly softening as he looks "
  "at his son.",
  ["papa40"], ["papa"], cam="без зума", code="Пауза")
S("e4_winter_fork", "E4", "wide", "«Папа откладывает вилку. — Ты откуда знал? — Кассета сказала»",
  "Winter supper: Papa has put down his fork and turned to Sasha with wide eyes; snow outside the window; Sasha at 15 smiles faintly.",
  ["papa40", "sasha15"], ["kitchen", "papa", "sasha_ages"], red=RED_KIT)

# ====================================== EPOCH 4B =========================================
S("e4b_pc_floor", "E4B", "wide", "Системный блок на полу в комнате Кости гудит; мама со счётом за свет",
  "Kostya's room: a beige-gray computer tower on the floor with its side panel open, glowing from inside, a monitor on the desk; "
  "Mama stands in the doorway holding a long paper bill (plain), shaking her head; Kostya and Sasha at 15 beside the tower.",
  ["mama38", "kostya17", "sasha15"], ["kroom", "mama", "kostya", "sasha_ages", "misc"], code="Титр «2009 · 15 лет»; гул")
S("e4b_pc_cu", "E4B", "cu", "Крупно: гудящий блок",
  "Close-up of the open computer tower: a big fan with detailed blades, a gray board, tidy cables, warm glow.", [], ["misc"],
  prio="B", code="Вращение вентилятора")

# ====================================== EPOCH 5 ==========================================
S("e5_garage", "E5", "wide", "Гараж деда: верстак, паяльник, радио",
  "Garage: Grandfather Lyosha at the workbench holds a soldering iron over a small radio; Sasha at 13 stands beside, watching "
  "closely.",
  ["ded", "sasha12"], ["garage", "ded", "sasha"], cam="медленный наезд до 1.10×")
S("e5_burn", "E5", "wide", "«Обжигаешь палец. — Терпи, не маленький»",
  "Garage: Sasha pulls his hand back from the soldering iron, wincing, while Grandfather Lyosha stays calm, one eyebrow raised.",
  ["ded", "sasha12"], ["garage", "ded", "sasha"])
S("e5_sundays", "E5", "wide", "«Почти триста воскресений: радио, велосипед, кран, проводка»",
  "Garage doorway in sunlight: Grandfather Lyosha and Sasha at 15 kneel over an upturned bicycle, tools scattered, both laughing.",
  ["ded", "sasha15"], ["garage", "ded", "sasha_ages"], prio="B", code="Календарные листки летят")
S("e5_spring_2011", "E5", "wide", "«Весна 2011. Паяльник теперь твой»",
  "Garage in spring: Sasha at 18 stands holding the soldering iron on his open palm; the stool by the workbench is empty; soft "
  "light.",
  ["sasha19"], ["garage", "sasha_ages", "misc"], cam="медленный наезд до 1.10×", code="Титр «2011 · 18 лет»")
S("e5_iron_palm_cu", "E5", "cu", "Крупно: паяльник на ладони",
  "Close-up of an open adult palm with a soldering iron lying across it, the wooden handle and the tip crisp; warm light; no face.",
  ["sasha19"], ["misc"], cam="без зума", code="Пауза")
S("e5_night_tape", "E5", "wide", "Ночь: ставишь «2024», слушаешь три раза",
  "Night in Sasha's room: Sasha at 18 sits on the bed with the deck on his knees and listens, lamp off, only teal window light "
  "and the glow of the cassette window.",
  ["sasha19"], ["door", "sasha_ages", "tape"], red="the record key of the deck", cam="медленный наезд до 1.10×")

# ====================================== MONTAGE ==========================================
S("m_graduation", "MON", "wide", "2011 · 18 лет: выпускной, пиджак с папиного плеча",
  "School hall at prom: Sasha at 18 in an oversized blazer stands in a row of graduates; the teacher beside him wipes her eyes; a "
  "soldering iron handle sticks out of his blazer pocket.",
  ["sasha19", "teacher"], ["sasha_ages", "cast"], code="Титр «2011 · 18 лет»")
S("m_dimka_phone", "MON", "wide", "2012 · 19 лет: Димка с первым смартфоном",
  "A shop's steps: Dimka at 19 shouts happily into his phone while holding a plain smartphone; Sasha at 19 stands a few steps "
  "away with a tolerant smile.",
  ["dimka19", "sasha19"], ["cast", "sasha_ages", "misc"], code="Титр «2012 · 19 лет»")
S("m_kostya_car", "MON", "wide", "2013 · 20 лет: Костя за рулём подержанной «девятки»",
  "A hatchback car without brand marks, scratched, at a courtyard: Kostya, happy and proud, leans out of the open driver "
  "window; Sasha at 20 stands on the pavement keeping his mouth shut.",
  ["kostya25", "sasha19"], ["yard", "kostya", "sasha_ages"], code="Титр «2013 · 20 лет»")
S("m_varya_call", "MON", "wide", "2015 · 22 года: звонок из роддома; ты сползаешь по стене",
  "Night: Sasha at 22 slides down a hallway wall with a phone at his ear, eyes shut, an exhale of relief; the phone screen "
  "glows teal.",
  ["sasha19"], ["door", "sasha_ages"], code="Титр «2015 · 22 года»")

# ====================================== EPOCH 6 ==========================================
S("e6_terrace", "E6", "wide", "Июль 2019: тебя знакомят с Леной",
  "Hot party terrace: friends are small distant shapes; in the foreground Sasha at 26 and Lena meet, she holds a big mug with "
  "both hands despite the heat, he smiles uncertainly.",
  ["sasha26", "lena"], ["terrace", "sasha_ages", "lena"], code="Титр «2019 · 26 лет»")
S("e6_lena_cup_cu", "E6", "cu", "Крупно: Лена греет руки о кружку",
  "Close-up of Lena's face and hands wrapped around a big mug, amused eyes looking at the viewer, steam as paper curl "
  "shapes.",
  ["lena"], ["lena"], cam="без зума", code="Реплика про «аллергию на лилии»")
S("e6_dishes", "E6", "wide", "«Будете ругаться из-за немытой посуды»",
  "A small kitchen sink piled with plates and two mugs; a half-seen couple's hands in an argument gesture at the edge of frame.",
  ["sasha26", "lena"], ["kitchen2"], prio="B")
S("e6_station", "E6", "wide", "«Расстанетесь на вокзале»",
  "A quiet railway platform in autumn, two figures far apart seen from behind with a suitcase, leaves on the ground; no faces.",
  ["sasha26", "lena"], [], prio="B", code="Тихий кадр, без реплик")
S("e6_cups", "E6", "wide", "«Но сначала моешь за собой чашку»",
  "Terrace: Sasha at 26 gathers dirty plastic cups from the table and carries them toward the kitchen door; Lena watches him "
  "with raised eyebrows and a smile.",
  ["sasha26", "lena"], ["terrace", "sasha_ages", "lena"])

# ====================================== TURN 2024 ========================================
S("t_night_kitchen", "TURN", "wide", "Март 2024: ночь, телефон тёмный",
  "Cold night kitchen: Sasha at 31 sits at the table, a dark phone in front of him, a low lamp, teal window light; the corridor "
  "door with a thin strip of light in the background.",
  ["sasha31"], ["kitchen2", "sasha_faces"], cam="медленный наезд до 1.10×", code="Титр «2024 · 31 год»; холодный тон")
S("t_old_night", "TURN", "wide", "Первая жизнь: три часа ночи, ты набираешь брата",
  "Flashback in a desaturated cool tone: the same kitchen but empty and lonely, Sasha at 31 with a phone at his ear, an unwashed "
  "cup, nobody else.",
  ["sasha31"], ["kitchen2", "sasha_faces"], code="Бесцветный флешбек")
S("t_light_strip", "TURN", "wide", "«Из-под двери полоска света: там спит Лена»",
  "Corridor: a closed room door with a warm strip of light under it, the dark phone on the kitchen table seen at the end of the corridor.",
  [], ["kitchen2"], cam="наезд до 1.10×")
S("t_realize_cu", "TURN", "cu", "«И тут до тебя доходит»",
  "Close-up of Sasha's face at 31, eyes widening as he realises, cold teal light from the phone on his cheek.",
  ["sasha31"], ["sasha_faces"], cam="без зума", code="Пауза без озвучки")

# ====================================== FINALE 2026 ======================================
S("f_kostya_door", "FIN", "wide", "Осень 2026: Костя (лысый, 38) с коробкой на пороге",
  "Kitchen doorway: Kostya at 38, bald, stands holding the shoebox of cassettes with one arm, a half-smile; Sasha at 33 sits "
  "at the table.",
  ["kostya38", "sasha33"], ["kitchen2", "kostya38", "sasha_ages", "tape"], code="Титр «2026 · 33 года»")
S("f_player", "FIN", "wide", "Ты ставишь «2024»: тишина, шипение, «Он ответил»",
  "Kitchen table: Sasha at 33 inserts a cassette into the twin deck; Kostya sits across the table. The deck's record key is red.",
  ["sasha33", "kostya38"], ["kitchen2", "sasha_ages", "kostya38", "tape"], red="the record key of the deck")
S("f_kostya_frown", "FIN", "wide", "«— Это что? — Ночь, когда ты мне ответил»",
  "Medium close-up of Kostya at 38 frowning in confusion, bald head, eyes searching; Sasha's shoulder in the foreground.",
  ["kostya38"], ["kostya38"], cam="медленный наезд до 1.10×")
S("f_pat", "FIN", "wide", "«— Дурак, — говорит он и хлопает тебя по плечу»",
  "Kostya claps Sasha on the shoulder, both smiling softly, warm window light; the deck between them.",
  ["kostya38", "sasha33"], ["kitchen2", "kostya38", "sasha_ages"], code="Тёплый тон возвращается")
S("f_last_tape", "FIN", "wide", "«Остаётся одна. «2026», детским почерком»",
  "Kostya's hand lifts the last cassette out of the shoebox, towards the viewer; the label is blank (code will add child "
  "handwriting). Warm light.",
  ["kostya38"], ["tape", "kostya38"], cam="наезд до 1.10×", code="Наклейка «2026» детским почерком")
S("f_rec_keys", "FIN", "cu", "«Нажимаешь обе кнопки сразу, как учил брат»",
  "Macro of an adult thumb and finger pressing the red record key and the next key of the deck together; the cassette window "
  "above shows the two reels beginning to turn.",
  ["sasha33"], ["tape"], red="the record key of the deck", cam="без зума", code="Вращение катушек")
S("f_recording", "FIN", "wide", "«…рассказываешь тому пацану, которому некому было сказать»",
  "Kitchen table, warm light: Sasha at 33 speaks into the deck with a gentle serious face; Kostya sits listening with his chin on "
  "his fist.",
  ["sasha33", "kostya38"], ["kitchen2", "sasha_ages", "kostya38", "tape"], red="the record key of the deck",
  cam="медленный наезд до 1.10×", code="Список «папа сбрил усы…» — титрами")

# ====================================== QUESTION + PREVIEWS ==============================
S("q_blank_tape", "Q", "cu", "«Одна кассета, девяносто минут и один человек»",
  "A single blank cassette on a plain cream paper surface, label clean and large, centred, soft warm light.",
  [], ["tape"], code="Вопрос в титре")
S("pv_a_deck", "PV", "wide", "Превью A: двухкассетник, палец на двух кнопках, кассета «2024»",
  "Close hero image: the twin-deck recorder fills most of the frame in three-quarter view, a finger presses two keys at once, a "
  "cassette in the left deck has a large blank label, strong readable silhouette, clean empty space at the right for code text.",
  [], ["tape"], red="the record key of the deck (one key)", cam="статичный", code="Красное «2024» на наклейке и «1 МИНУТА»")
S("pv_b_boy", "PV", "wide", "Превью B: мальчик 12 лет со взрослыми глазами, календарь за спиной",
  "Sasha at 12 in the left half of the frame, a big face with grown-up eyes looking at the viewer; behind him a wall calendar "
  "with a red header and a blank page; clean empty space at the right for code text.",
  ["sasha12"], ["sasha", "sasha_faces", "carpet"], red="the calendar header", cam="статичный",
  code="«МОЛЧАТЬ 21 ГОД»")

# --------------------------------------------------------------------------------------
# Assembly
# --------------------------------------------------------------------------------------
ATT_ROLE = {
    "sheets/": "approved character/props reference (identity, costume and proportions must match)",
    "bg/": "approved set of this scene (keep its architecture, materials, light and object positions)",
    "shots/": "the previous shot of this scene (keep the same room, people and light)",
}


def red_rule(red: str) -> str:
    if red == "none":
        return "There is no red anywhere in this picture."
    return f"The only permitted red is #D92F2B, exclusively on: {red}. No other red anywhere."


def role(path: str) -> str:
    for prefix, text in ATT_ROLE.items():
        if path.startswith(prefix):
            return text
    return "reference"


def prompt(s: dict) -> str:
    parts = []
    kind_text = {"sheet": "a reference sheet", "bg": "an empty background set", "wide": "a finished full scene",
                 "cu": "a close-up master"}[s["kind"]]
    parts.append(f"Asset: {s['file']}, {kind_text}. {s['en']}")
    if s["chars"]:
        parts.append("Characters (identity must match the attached sheets; the text is the fallback):\n"
                     + "\n".join(f"- {CHARS[c]}" for c in s["chars"]))
    if s["att"]:
        parts.append("Attachments:\n" + "\n".join(f"- Input image {i}: {p}, {role(p)}" for i, p in enumerate(s["att"], 1)))
    parts.append(STYLE)
    parts.append(PALETTE.format(red_rule=red_rule(s["red"])))
    parts.append(SHARP_CU if s["kind"] == "cu" else SHARP)
    if s["kind"] == "sheet":
        parts.append(OUT_SHEET.format(layout=s["layout"]))
    elif s["kind"] == "bg":
        parts.append(OUT_BG)
    else:
        parts.append(OUT_WIDE)
    parts.append(EXCL)
    return "\n\n".join(parts)


def main() -> None:
    ids = [s["id"] for s in SHOTS]
    assert len(ids) == len(set(ids)), "duplicate ids"
    for s in SHOTS:
        for c in s["chars"]:
            assert c in CHARS, (s["id"], c)
    lines = ["# ТЗ для Codex: все картинки ролика 01 по сценарию v5 (полные промты)", "",
             "Файл сгенерирован `video-01/scripts/build_codex_prompts.py`; правим таблицу в скрипте, не этот файл. Правила, порядок "
             "работы и приёмка: [codex-video-01-full.md](codex-video-01-full.md). Пути в вложениях относительно `video-01/assets/`.",
             "", "Обозначения: **A** = нужна для основной истории, **B** = запасной кадр (если картинок не хватает, код закрывает "
             "ближайшим). **wide** = целая сцена 16:9, **cu** = крупный план 16:9 (рисуется сразу крупно, зумить его не нужно), "
             "**bg** = пустой задник, **sheet** = лист 3:2.", ""]
    counts = {}
    for key, title in SECTIONS.items():
        group = [s for s in SHOTS if s["sec"] == key]
        if not group:
            continue
        lines += [f"## {title}", "", "| ID | Тип | Приор. | Момент | Вложения | Красный | Камера (код) | Код добавляет |",
                  "|---|---|---|---|---|---|---|---|"]
        for s in group:
            att = ", ".join(Path(p).stem for p in s["att"]) or "—"
            red = "нет" if s["red"] == "none" else s["red"]
            lines.append(f"| `{s['id']}` | {s['kind']} | {s['prio']} | {s['ru']} | {att} | {red} | {s['cam']} | {s['code'] or '—'} |")
            counts[s["kind"]] = counts.get(s["kind"], 0) + 1
        lines.append("")
    lines += ["## Итого", ""] + [f"- {k}: {v}" for k, v in counts.items()]
    lines += [f"- всего картинок: {len(SHOTS)}, из них приоритет A: {sum(s['prio']=='A' for s in SHOTS)}, B: {sum(s['prio']=='B' for s in SHOTS)}", ""]
    lines += ["Уже готовы и повторно не генерируются: `bg/bg_door_wall_hd.png`, `bg/bg_carpet_wall_hd.png`, `shots/p2_kostya_hd.png`, "
              "`shots/p3_calendar_hd.png`, `shots/p4_sasha_hd.png`, листы `sasha_sheet_hd`, `kostya_sheet_hd`, `mama_sheet_hd`, `papa_sheet`, `props_tape_sheet-v2` и кухня `bg_kitchen-v2` (их Codex сделал раньше по старому плану, не перегенерировать; кухня и есть мастер-задник всех кухонных кадров).", "",
              "---", "", "# Полные промты", ""]
    for key, title in SECTIONS.items():
        group = [s for s in SHOTS if s["sec"] == key]
        if not group:
            continue
        lines += [f"## {title}", ""]
        for s in group:
            lines += [f"### {s['id']} → `{s['file']}`", "", f"Момент: {s['ru']}", "", "```text", prompt(s), "```", ""]
    OUT_MD.write_text("\n".join(lines), encoding="utf-8")
    OUT_JSON.write_text(json.dumps({"characters": CHARS, "shots": SHOTS}, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"{len(SHOTS)} images -> {OUT_MD.name}, {OUT_JSON.name}")


if __name__ == "__main__":
    main()
