"""Реплики новой версии «Слова» в темпе референса (13,5 симв/с). 3 дубля на реплику."""
import os
from f5_tts.api import F5TTS

D = r"C:\Users\daatva\voice-clone"
OUT = os.path.join(D, "out", "story")
os.makedirs(OUT, exist_ok=True)
v = os.path.join(D, "voices", "friend")
ref_text = open(os.path.join(v, "ref.txt"), encoding="utf-8").read().strip()
tts = F5TTS(model="F5TTS_v1_Base",
            ckpt_file=os.path.join(D, "model", "F5TTS_v1_Base_v4_winter", "model_212000.safetensors"),
            vocab_file=os.path.join(D, "model", "F5TTS_v1_Base", "vocab.txt"), device="cuda")
LINES = [
    "Третий день Игорь молчит. Он боится открыть рот.",
    "Давай посчитаем. Обычный человек говорит шестнадцать тысяч слов в день.",
    "За двадцать лет набегает сто семнадцать миллионов.",
    "Это больше двухсот томов «Войны и мира». Игорь всё это уже сказал.",
    "А сегодня утром всё это прозвучит разом.",
]
for i, t in enumerate(LINES, 1):
    for s in (1, 2, 3):
        tts.infer(os.path.join(v, "ref.wav"), ref_text, t, file_wave=os.path.join(OUT, f"l{i}_s{s}.wav"),
                  speed=0.75, seed=s, nfe_step=64, show_info=lambda *_: None)
print("done")
