"""Create faithful 2x neural-upscaled versions of the eight approved images."""
from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path
import sys
import time

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PLAN = ROOT / "spec" / "hd-upscale-plan.json"
LOG = ROOT / "spec" / "hd-upscale-log.json"
CACHE = Path(os.environ["LOCALAPPDATA"]) / "CodexTools" / "fsrcnn"


def digest(path: Path) -> str:
    with path.open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--only", nargs="+", help="Asset IDs from spec/hd-upscale-plan.json")
    parser.add_argument("--replace-managed", action="store_true",
                        help="Replace only outputs whose hashes match this task's existing processing log")
    args = parser.parse_args()
    sys.path.insert(0, str(CACHE / "python"))
    import cv2
    import numpy as np

    model = CACHE / "FSRCNN_x2.pb"
    if not model.is_file() or not hasattr(cv2, "dnn_superres"):
        parser.error("Install FSRCNN_x2.pb and isolated OpenCV contrib in %LOCALAPPDATA%/CodexTools/fsrcnn.")
    sr = cv2.dnn_superres.DnnSuperResImpl_create()
    sr.readModel(str(model))
    sr.setModel("fsrcnn", 2)
    plan = json.loads(PLAN.read_text(encoding="utf-8"))
    assets = plan["assets"]
    if args.only:
        unknown = set(args.only) - {asset["id"] for asset in assets}
        if unknown:
            parser.error("Unknown asset IDs: " + ", ".join(sorted(unknown)))
        assets = [asset for asset in assets if asset["id"] in args.only]
    report = json.loads(LOG.read_text(encoding="utf-8")) if LOG.exists() else {"results": []}
    report.update({
        "date": "2026-11-01",
        "method": "FSRCNN 2x neural super-resolution, then Lanczos downsampling to exact target size",
        "implementation": "OpenCV contrib " + cv2.__version__,
        "model_source": "https://github.com/Saafke/FSRCNN_Tensorflow",
        "model_sha256": digest(model),
        "face_restoration": False,
        "reason": "Selected after visual comparison: Real-ESRGAN oversimplified Kostya's eyes and paper fibers.",
    })
    for asset in assets:
        source = (ROOT / asset["source"]).resolve()
        target = (ROOT / asset["output"]).resolve()
        source.relative_to((ROOT / "assets").resolve())
        target.relative_to((ROOT / "assets").resolve())
        if source == target:
            raise RuntimeError("Source and target must be different.")
        source_hash = digest(source)
        previous = next((item for item in report["results"] if item["id"] == asset["id"]), None)
        if target.exists():
            managed = previous and previous["source_sha256"] == source_hash and previous["output_sha256"] == digest(target)
            if not managed:
                raise FileExistsError("Refusing to overwrite unrecognized output: " + str(target))
            if previous["model"] == "FSRCNN_x2" and previous["model_sha256"] == digest(model):
                print("Already validated: " + asset["id"], flush=True)
                continue
            if not args.replace_managed:
                raise FileExistsError("Use --replace-managed to replace this task's earlier trial: " + str(target))
        with Image.open(source) as original:
            rgb = original.convert("RGB")
            source_size = rgb.size
            bgr = cv2.cvtColor(np.asarray(rgb), cv2.COLOR_RGB2BGR)
        wanted = tuple(asset["target_size"])
        if source_size[0] * wanted[1] != source_size[1] * wanted[0]:
            raise ValueError("Aspect ratio would change: " + asset["id"])
        print("Upscaling " + asset["id"] + " with FSRCNN x2...", flush=True)
        started = time.monotonic()
        upscaled = sr.upsample(bgr)
        native_size = (upscaled.shape[1], upscaled.shape[0])
        if native_size != (source_size[0] * 2, source_size[1] * 2):
            raise RuntimeError("Unexpected neural output dimensions: " + str(native_size))
        final = Image.fromarray(cv2.cvtColor(upscaled, cv2.COLOR_BGR2RGB))
        if final.size != wanted:
            resized = final.resize(wanted, Image.Resampling.LANCZOS)
            final.close()
            final = resized
        pending = target.with_name(target.stem + ".pending.png")
        final.save(pending, format="PNG")
        final.close()
        with Image.open(pending) as verified:
            if verified.size != wanted or verified.mode != "RGB":
                raise RuntimeError("Final output dimensions or mode failed validation.")
            verified.load()
        if digest(source) != source_hash:
            raise RuntimeError("Original changed during processing: " + str(source))
        pending.replace(target)
        record = {
            "id": asset["id"], "source": asset["source"], "output": asset["output"],
            "source_size": list(source_size), "native_size": list(native_size),
            "output_size": list(wanted), "mode": "RGB", "opaque": True,
            "model": "FSRCNN_x2", "model_sha256": digest(model),
            "face_restoration": False, "source_sha256": source_hash,
            "source_unchanged": True, "output_sha256": digest(target),
            "seconds": round(time.monotonic() - started, 1),
            "status": "Dimensions, PNG decoding, opacity and source integrity verified; visual review pending.",
        }
        report["results"] = [item for item in report["results"] if item["id"] != asset["id"]] + [record]
        LOG.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print("Saved " + str(target.relative_to(ROOT)) + " " + str(wanted), flush=True)


if __name__ == "__main__":
    main()
