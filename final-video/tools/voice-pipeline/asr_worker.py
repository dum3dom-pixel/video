"""Служебный: держит faster-whisper в памяти и по строке-пути к wav отвечает строкой с распознанным текстом (запускает voiceover.py в venv-text)."""
import sys, json
from faster_whisper import WhisperModel
model = WhisperModel("medium", device="cpu", compute_type="int8", cpu_threads=4)
print("ready", flush=True)
for line in sys.stdin:
    p = line.strip()
    if not p: continue
    segs, _ = model.transcribe(p, language="ru", beam_size=5, condition_on_previous_text=False, vad_filter=False)
    print(json.dumps(" ".join(s.text.strip() for s in segs), ensure_ascii=False), flush=True)
