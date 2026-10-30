"""Генерирует картинки персонажа для ролика manga-explainer в едином стиле.

  python scripts/explainer_images.py src/Explainer/videos/<id>.json --sheet          # сначала лист персонажа
  python scripts/explainer_images.py src/Explainer/videos/<id>.json [--provider openai|gemini|manual] [--only p1,p2] [--force]

Берёт из спеки `character` (внешность героя + оранжевый элемент одежды) и `poses` ({имя: поза}).
Картинки -> public/explainer/<id>/img/<имя>.png. Лист персонажа (character.png) уходит в модель как референс,
чтобы герой был одинаковым во всех позах. Ключи: $env:OPENAI_API_KEY / $env:GEMINI_API_KEY.
manual (по умолчанию): пишет prompts.md рядом с картинками — генерировать руками в ChatGPT / Gemini.
"""
import argparse
import base64
import json
import os
import sys
import time
from pathlib import Path

import requests

STYLE = (
    "Black and white manga ink illustration, detailed linework and hatching, grayscale skin and hair. "
    "The ONLY color in the whole image is bright orange (#E8732C) on the clothing item named below. "
    "Full body, isolated on a pure solid black background (#000000), no ground shadow, no scenery, "
    "no text, no letters, no watermark, high contrast, generous margins around the figure. Original character."
)
SHEET = "Character design reference: the character standing relaxed, full body, front view, centered."
REF_NOTE = "Use the attached reference image strictly for the character's design (face, hair, body, clothes)."


def build_prompt(spec, pose, has_ref):
    parts = [STYLE, f"Character: {spec['character']}"]
    if has_ref:
        parts.append(REF_NOTE)
    parts.append(f"Pose: {pose}")
    return "\n".join(parts)


def post(url, **kw):
    for attempt in range(3):
        r = requests.post(url, timeout=300, **kw)
        if r.status_code in (429, 500, 502, 503) and attempt < 2:
            time.sleep(10 * (attempt + 1))
            continue
        if not r.ok:
            raise RuntimeError(f"{r.status_code}: {r.text[:500]}")
        return r.json()


def gen_openai(prompt, ref, model):
    headers = {"Authorization": f"Bearer {os.environ['OPENAI_API_KEY']}"}
    data = {"model": model, "prompt": prompt, "size": "1024x1536", "quality": "medium"}
    if ref:
        with open(ref, "rb") as f:
            res = post("https://api.openai.com/v1/images/edits", headers=headers, data=data | {"n": "1"},
                       files=[("image[]", (ref.name, f, "image/png"))])
    else:
        res = post("https://api.openai.com/v1/images/generations", headers=headers, json=data | {"n": 1})
    return base64.b64decode(res["data"][0]["b64_json"])


def gen_gemini(prompt, ref, model):
    parts = [{"text": prompt}]
    if ref:
        parts.append({"inline_data": {"mime_type": "image/png", "data": base64.b64encode(ref.read_bytes()).decode()}})
    body = {
        "contents": [{"parts": parts}],
        "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "2:3"}},
    }
    res = post(f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
               headers={"x-goog-api-key": os.environ["GEMINI_API_KEY"]}, json=body)
    for part in res["candidates"][0]["content"]["parts"]:
        inline = part.get("inlineData") or part.get("inline_data")
        if inline:
            return base64.b64decode(inline["data"])
    raise RuntimeError(f"Gemini не вернул картинку: {json.dumps(res)[:500]}")


PROVIDERS = {"openai": (gen_openai, "gpt-image-1"), "gemini": (gen_gemini, "gemini-2.5-flash-image")}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("spec", type=Path)
    ap.add_argument("--provider", choices=["openai", "gemini", "manual"], default="manual")
    ap.add_argument("--model", help="переопределить модель провайдера")
    ap.add_argument("--sheet", action="store_true", help="сгенерировать только лист персонажа character.png")
    ap.add_argument("--only", help="имена поз через запятую")
    ap.add_argument("--force", action="store_true")
    args = ap.parse_args()

    spec = json.loads(args.spec.read_text(encoding="utf-8"))
    if not spec.get("character") or not spec.get("poses"):
        sys.exit("В спеке нужны поля `character` (описание героя) и `poses` ({имя: поза}).")
    img = Path(__file__).resolve().parent.parent / "public" / "explainer" / spec["id"] / "img"
    img.mkdir(parents=True, exist_ok=True)
    ref = img / "character.png"

    if args.sheet:
        jobs = [("character", SHEET, ref, None)]
    else:
        only = set(args.only.split(",")) if args.only else None
        jobs = [(name, pose, img / f"{name}.png", ref if ref.exists() else None)
                for name, pose in spec["poses"].items()
                if (not only or name in only) and (args.force or not (img / f"{name}.png").exists())]
        if args.provider == "manual" and not ref.exists():
            jobs.insert(0, ("character", SHEET, ref, None))

    if args.provider == "manual":
        lines = ["# Промты для ручной генерации\n",
                 "Генерируй в одном чате ChatGPT / Gemini, вертикально 2:3. Сначала `character`, потом прикладывай его к каждой позе.",
                 f"Сохраняй как `{img}\\<имя>.png`.\n"]
        for name, pose, out, r in jobs:
            lines += [f"## {name} → {out.name}", "```", build_prompt(spec, pose, name != "character"), "```", ""]
        (img / "prompts.md").write_text("\n".join(lines), encoding="utf-8")
        print(f"{len(jobs)} промтов -> {img / 'prompts.md'}")
        return

    fn, default_model = PROVIDERS[args.provider]
    model = args.model or default_model
    failed = []
    for i, (name, pose, out, r) in enumerate(jobs, 1):
        print(f"[{i}/{len(jobs)}] {name} ...", flush=True)
        try:
            out.write_bytes(fn(build_prompt(spec, pose, r is not None), r, model))
        except Exception as e:  # одна упавшая поза не должна ронять весь прогон
            print(f"  ошибка: {e}", file=sys.stderr)
            failed.append(name)
    print(f"готово: {len(jobs) - len(failed)}/{len(jobs)}" + (f", упали: {','.join(failed)}" if failed else ""))


if __name__ == "__main__":
    main()
