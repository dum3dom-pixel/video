"""Write a one-stage Codex brief (instructions + only that stage's prompts).

Run from channels/chto-esli/video-01:  python -X utf8 scripts/build_codex_stage.py 0
"""
from __future__ import annotations

import sys

import build_codex_prompts as B

STAGES = {
    "0": (["SHEETS"], "Этап 0. Листы персонажей и предметов"),
    "1": (["BG"], "Этап 1. Пустые задники"),
}


def main() -> None:
    key = sys.argv[1] if len(sys.argv) > 1 else "0"
    sections, title = STAGES[key]
    group = [s for s in B.SHOTS if s["sec"] in sections]
    lines = [
        f"# {title}: ролик 01 «Кассеты»", "",
        "Ты делаешь картинки для ролика. Все правила: [codex-video-01-full.md](codex-video-01-full.md) (прочитай разделы 1, 3, 4 и 7). "
        "Ниже промты только этого этапа. Каждый промт самодостаточный: вставляй его целиком в `image_gen`, вложения указаны в блоке "
        "Attachments (пути относительно `channels/chto-esli/video-01/assets/`).", "",
        "Порядок: делай по одному файлу, сверху вниз. Для каждого листа сделай 2 варианта, выбери лучший под именем из заголовка, "
        "второй сохрани с суффиксом `-alt`. Существующие файлы не перезаписывай. Фигуры на листах крупные: не меньше 85% высоты холста.", "",
        "После последнего файла остановись и напиши:", "- список файлов и реальный размер каждого;",
        "- что получилось хуже ожидаемого;", "- запись в `video-01/generation-log-v5.json` (id, файл, вложения, число проб, размер).",
        "Дальше не иди, жди моего «ок».", "",
    ]
    for s in group:
        lines += [f"## {s['id']} → `{s['file']}`", "", f"Что это: {s['ru']}", "", "```text", B.prompt(s), "```", ""]
    out = B.ROOT.parent / f"codex-video-01-stage{key}.md"
    out.write_text("\n".join(lines), encoding="utf-8")
    print(f"{len(group)} prompts -> {out.name}")


if __name__ == "__main__":
    main()
