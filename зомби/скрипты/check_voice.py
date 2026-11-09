r"""Проверка дублей голоса: распознаёт каждый дубль и сравнивает с текстом, выбирает лучший по совпадению.
Запуск (системный python, где стоит faster-whisper):
  python check_voice.py C:\Users\daatva\voice-clone\out\story
Ждёт файлы l1_s1.wav ... lN_s3.wav (реплика, seed), тексты берёт из LINES ниже."""
import difflib, re, sys
from faster_whisper import WhisperModel

LINES = [
    "Третий день Игорь молчит. Он боится открыть рот.",
    "Давай посчитаем. Обычный человек говорит шестнадцать тысяч слов в день.",
    "За двадцать лет набегает сто семнадцать миллионов.",
    "Это больше двухсот томов «Войны и мира». Игорь всё это уже сказал.",
    "А сегодня утром всё это прозвучит разом.",
]
folder = sys.argv[1]
model = WhisperModel("medium", device="cpu", compute_type="int8")
norm = lambda s: re.sub(r"[^а-я0-9 ]", "", s.lower().replace("ё", "е"))
for i, text in enumerate(LINES, 1):
    scores = []
    for s in (1, 2, 3):
        seg, _ = model.transcribe(f"{folder}/l{i}_s{s}.wav", language="ru", beam_size=5)
        heard = " ".join(x.text.strip() for x in seg)
        scores.append((difflib.SequenceMatcher(None, norm(text), norm(heard)).ratio(), s, heard))
        print(i, s, round(scores[-1][0], 3), heard)
    print("  лучший дубль:", max(scores, key=lambda x: (x[0], -x[1]))[1], "(при равенстве берётся меньший seed; выбирать всё равно на слух)")
print("Числа распознаются цифрами («16 тысяч»), поэтому ~0,67–0,9 на репликах с числами норма. Ошибка только когда пропали слова.")
