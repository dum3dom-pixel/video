"""Текст тестового ролика «Сутки без сна» (15 с). 3 сплошных дубля, темп как в story_voice.py."""
import os
from f5_tts.api import F5TTS

D = r"C:\Users\daatva\voice-clone"
OUT = os.path.join(D, "out", "test15")
os.makedirs(OUT, exist_ok=True)
v = os.path.join(D, "voices", "friend")
ref_text = open(os.path.join(v, "ref.txt"), encoding="utf-8").read().strip()
tts = F5TTS(model="F5TTS_v1_Base",
            ckpt_file=os.path.join(D, "model", "F5TTS_v1_Base_v4_winter", "model_212000.safetensors"),
            vocab_file=os.path.join(D, "model", "F5TTS_v1_Base", "vocab.txt"), device="cuda")
# Одним сплошным дублем, без склейки отдельных реплик: иначе между репликами выходят провалы тишины.
TEXT = ("Сутки Костя не спит. Он думает, что просто устал. Давай посчитаем. "
        "Двадцать четыре часа без сна, и мозг работает как у выпившего. "
        "Реакция падает, а он этого не чувствует. Поэтому Костя не заметил красный свет.")
for s in (1, 2, 3):
    tts.infer(os.path.join(v, "ref.wav"), ref_text, TEXT, file_wave=os.path.join(OUT, f"full_s{s}.wav"),
              speed=0.75, seed=s, nfe_step=64, show_info=lambda *_: None)
print("done")
# F5 иногда вставляет внутрь дубля длинную паузу. Укоротить: tighten_pauses.py full_s1.wav tight.wav 0.25
