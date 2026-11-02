"""Install visually selected identity fixes and rebuild a local before/after gallery.

No drawing, resizing, upscaling or image generation is done by this script.
Only image_gen outputs explicitly marked visually reviewed are eligible.
"""
from __future__ import annotations

import argparse
import hashlib
import html
import json
import shutil
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
REPO = ROOT.parents[2]
SPEC = ROOT / "spec"


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def local(name: str) -> Path:
    path = (ROOT / name).resolve()
    path.relative_to(ROOT)
    return path


def describe(path: Path) -> dict:
    with Image.open(path) as im:
        im.load()
        return {"width": im.width, "height": im.height, "mode": im.mode,
                "opaque": "A" not in im.getbands() or im.getchannel("A").getextrema() == (255, 255),
                "sha256": digest(path)}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--install", action="store_true")
    args = parser.parse_args()
    inventory = json.loads((SPEC / "identity-inventory-before.json").read_text(encoding="utf-8"))
    before_index = {row["file"]: row for row in inventory}
    records = []
    for source in sorted((SPEC / "identity-generation").glob("*.json")):
        record = json.loads(source.read_text(encoding="utf-8"))
        if record.get("record_schema") != "identity-fix-v3":
            continue
        if record.get("visual_review") != "selected":
            continue
        selected = local(record["selected"])
        canonical = local(record["canonical"])
        info = describe(selected)
        if not info["opaque"] or info["width"] < 1536 or info["height"] < 864:
            raise ValueError(f"Invalid generated master: {selected}")
        for ref in record["references"]:
            if not local(ref).is_file():
                raise FileNotFoundError(ref)
        backup = local("assets/identity-review/before/" + record["canonical"].removeprefix("assets/"))
        before = before_index.get(canonical.relative_to(REPO).as_posix())
        if args.install:
            if before:
                if not backup.exists():
                    if digest(canonical) != before["sha256"]:
                        raise ValueError(f"Source changed since audit; refusing replacement: {canonical}")
                    backup.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copy2(canonical, backup)
                if digest(backup) != before["sha256"]:
                    raise ValueError(f"Original backup does not match audit: {backup}")
            elif canonical.exists() and digest(canonical) != info["sha256"]:
                raise FileExistsError(f"Unexpected new canonical asset: {canonical}")
            shutil.copy2(selected, canonical)
        installed = canonical.exists() and digest(canonical) == info["sha256"]
        reference_snapshots = []
        for name in record["references"]:
            path = local(name)
            original = before_index.get(path.relative_to(REPO).as_posix())
            archived = local("assets/identity-review/before/" + name.removeprefix("assets/"))
            if original and digest(path) != original["sha256"] and archived.exists():
                path = archived
                if digest(path) != original["sha256"]:
                    raise ValueError(f"Reference archive changed: {path}")
            reference_snapshots.append({"requested": name, "preserved_file": path.relative_to(ROOT).as_posix(),
                                        "sha256": digest(path)})
        records.append({**record, **info, "installed": installed,
                        "reference_snapshots": reference_snapshots,
                        "before": backup.relative_to(ROOT).as_posix() if backup.exists() else None,
                        "before_info": before,
                        "same_dimensions": not before or (before["width"], before["height"]) == (info["width"], info["height"])})
    priority = {"m_kostya_car": 0, "m_dimka_phone": 1, "kostya17": 2, "kostya25": 3, "lena": 4}
    records.sort(key=lambda r: (priority.get(r["id"], 5), r["id"]))
    expected = {local(r["canonical"]).relative_to(REPO).as_posix() for r in records}
    unrelated = [r["file"] for r in inventory if r["file"] not in expected
                 and digest(REPO / r["file"]) != r["sha256"]]
    if unrelated:
        raise ValueError("Unexpected changes outside selected assets: " + ", ".join(unrelated))
    result = {"date": "2026-11-02", "generator": "built-in image_gen", "api_calls": 0,
              "upscaled": False, "inventory_before_count": len(inventory),
              "selected": len(records), "installed": sum(r["installed"] for r in records),
              "unrelated_source_images_changed": unrelated, "images": records}
    audit_path = SPEC / "identity-audit.json"
    if audit_path.exists():
        result["audit"] = json.loads(audit_path.read_text(encoding="utf-8"))
    (SPEC / "identity-review.json").write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    esc = html.escape
    cards = []
    for record in records:
        before = record["before"]
        old = (f'<figure><figcaption>До</figcaption><a href="{esc(before)}"><img loading="lazy" src="{esc(before)}" alt="До"></a></figure>'
               if before else '<figure class="empty"><figcaption>Новый отдельный эталон</figcaption></figure>')
        new = esc(record["selected"])
        cards.append(f'<article id="{esc(record["id"])}"><h2>{esc(record["title"])}</h2><p>{esc(record["change"])}</p>'
                     f'<div class="pair">{old}<figure><figcaption>После · {record["width"]}×{record["height"]}</figcaption>'
                     f'<a href="{new}"><img loading="lazy" src="{new}" alt="После"></a></figure></div></article>')
    page = '''<!doctype html><html lang="ru"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Герои: до и после</title><style>
*{box-sizing:border-box}body{margin:0;background:#252923;color:#f1e6cf;font:16px/1.5 system-ui,sans-serif}
header,main{max-width:1680px;margin:auto;padding:24px}header{padding-bottom:0}h1{font-size:clamp(26px,4vw,44px);line-height:1.2}
p{max-width:1000px;color:#d1caba}a{color:#e7c072}article{padding:24px 0;border-top:1px solid #596052}h2{margin:0;font-size:23px}
.pair{display:grid;grid-template-columns:1fr 1fr;gap:16px}figure{margin:0}figcaption{margin-bottom:8px;color:#dfc380}
img{width:100%;display:block;background:#e9dfc7}.empty{display:grid;place-items:center;background:#333a30;min-height:160px}
@media(max-width:760px){.pair{grid-template-columns:1fr}header,main{padding:16px}}
</style><header><h1>Разные герои, узнаваемые образы</h1>
<p>Проверка исходных изображений проекта. Саша — худой, угловатое лицо, большие серьёзные глаза и высокий растрёпанный вихор.
Костя — широкое лицо, меньшие глаза, короткие плотные кудри и открытый лоб. Костя в 25 лет — бирюзовая куртка поверх кремовой футболки.
Димка — короткая стрижка и оливковый бомбер. Лена — прямое каре, вытянутое лицо, узкие глаза и веснушки вместо маминых волн.
Картинки ниже открываются в исходном разрешении; оригиналы сохранены. Старые MP4 не заменяются этой галереей.</p>
<p><a href="spec/identity-review.json">Проверки, промпты и референсы</a> · <a href="../CHARACTER-STYLE.md">Актуальные образы</a></p></header><main>'''
    (ROOT / "identity-review.html").write_text(page + "\n".join(cards) + "</main></html>\n", encoding="utf-8")
    print(json.dumps({k: v for k, v in result.items() if k not in {"images", "audit"}}, ensure_ascii=False))


if __name__ == "__main__":
    main()
