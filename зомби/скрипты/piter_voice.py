"""Текст ролика «Принцип Питера» (30 с, вертикальный ЧБ). 3 сплошных дубля на каждой скорости."""
import os
from f5_tts.api import F5TTS

D = r"C:\Users\daatva\voice-clone"
OUT = os.path.join(D, "out", "piter")
os.makedirs(OUT, exist_ok=True)
v = os.path.join(D, "voices", "friend")
ref_text = open(os.path.join(v, "ref.txt"), encoding="utf-8").read().strip()
tts = F5TTS(model="F5TTS_v1_Base",
            ckpt_file=os.path.join(D, "model", "F5TTS_v1_Base_v4_winter", "model_212000.safetensors"),
            vocab_file=os.path.join(D, "model", "F5TTS_v1_Base", "vocab.txt"), device="cuda")
TEXT = ("Твой начальник не родился идиотом. Его до этого повысили. "
        "Принцип Питера, шестьдесят девятый год. "
        "Вот лучший механик в автосервисе. Чинит всё. Его делают начальником. "
        "И теперь он лезет в каждый мотор, слесари курят, машины стоят. "
        "Выше его уже не поднимут. Так и сидит. "
        "Механика потеряли, идиота получили. И так на каждом этаже. "
        "В две тысячи десятом итальянцы посчитали: повышать наугад выгоднее, чем повышать лучших. "
        "За это им дали Шнобелевку. "
        "Тебя не повышают? Радуйся. Ты ещё не дорос до своего идиота.")
for speed in (0.9,):  # 1.0 даёт 26 с, 0.9 — около 29 с
    for s in (1, 2, 3):
        tts.infer(os.path.join(v, "ref.wav"), ref_text, TEXT, file_wave=os.path.join(OUT, f"full_v{int(speed * 100)}_s{s}.wav"),
                  speed=speed, seed=s, nfe_step=64, show_info=lambda *_: None)
print("done")
