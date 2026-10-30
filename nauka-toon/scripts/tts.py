"""Voice for nauka-toon: edge-tts per scene -> assets/voice/<id>.mp3, spec/words.json (word times), spec/voice.json (durations).
Usage (from nauka-toon/): python scripts/tts.py [--force]"""
import asyncio, json, subprocess, sys, hashlib
from pathlib import Path
import edge_tts

ROOT = Path(__file__).resolve().parent.parent
spec = json.loads((ROOT / "spec" / "hook.json").read_text(encoding="utf-8"))
voice, rate = spec["voice"], spec.get("rate", "+0%")
out_dir = ROOT / "assets" / "voice"
out_dir.mkdir(parents=True, exist_ok=True)
hash_path = out_dir / "_hash.json"
hashes = json.loads(hash_path.read_text(encoding="utf-8")) if hash_path.exists() else {}
words_path, dur_path = ROOT / "spec" / "words.json", ROOT / "spec" / "voice.json"
all_words = json.loads(words_path.read_text(encoding="utf-8")) if words_path.exists() else {}
force = "--force" in sys.argv


def probe(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", str(path)],
                         capture_output=True, text=True, check=True).stdout.strip()
    return float(out)


async def synth(text, path):
    try:
        com = edge_tts.Communicate(text, voice, rate=rate, boundary="WordBoundary")
    except TypeError:
        com = edge_tts.Communicate(text, voice, rate=rate)
    words = []
    with open(path, "wb") as f:
        async for ch in com.stream():
            if ch["type"] == "audio":
                f.write(ch["data"])
            elif ch["type"] == "WordBoundary":
                words.append({"t": round(ch["offset"] / 1e7, 3), "d": round(ch["duration"] / 1e7, 3), "w": ch["text"]})
    return words


async def main():
    durs = {}
    for sc in spec["scenes"]:
        sid, text = sc["id"], sc["voice"]
        mp3 = out_dir / f"{sid}.mp3"
        h = hashlib.sha1(f"{voice}|{rate}|{text}".encode("utf-8")).hexdigest()
        if force or not mp3.exists() or hashes.get(sid) != h or not all_words.get(sid):
            all_words[sid] = await synth(text, mp3)
            hashes[sid] = h
        durs[sid] = round(probe(mp3), 3)
        print(f"{sid:<8}{durs[sid]:>6.2f}s  {text}")
    hash_path.write_text(json.dumps(hashes, indent=1), encoding="utf-8")
    words_path.write_text(json.dumps({k: v for k, v in all_words.items() if k in durs}, ensure_ascii=False), encoding="utf-8")
    dur_path.write_text(json.dumps(durs, indent=1), encoding="utf-8")
    print("total", round(sum(durs.values()), 2), "s")

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
asyncio.run(main())
