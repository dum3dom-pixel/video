r"""Заготовка нового эпизода одной командой: timing.ts, index.tsx, пустые сцены, голос в public, запись в реестр.
python final-video\tools\new_episode.py --name jetlag30 --spec final-video\30sec\jetlag30\plans.json [--voice C:\Users\daatva\voice-clone\out\jetlag30] [--tail 54 --fade 10 --lead 0.08]
Готовый shots.tsx не перезаписывается: при повторном запуске (переозвучка) обновятся только timing.ts и voice.wav."""
import argparse, json, os, re, shutil, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
STUDIO = os.path.normpath(os.path.join(HERE, "..", "..", "what-if-studio"))
ap = argparse.ArgumentParser()
ap.add_argument("--name", required=True, help="латиницей, как папка озвучки: jetlag30")
ap.add_argument("--spec", required=True, help="plans.json: [[id, первые слова плана, {событие: слово}], ...]")
ap.add_argument("--voice", help="папка озвучки (по умолчанию C:\\Users\\daatva\\voice-clone\\out\\NAME)")
ap.add_argument("--tail", default="54"); ap.add_argument("--fade", default="10"); ap.add_argument("--lead", default="0.08")
a = ap.parse_args()
if not re.fullmatch(r"[a-z][a-z0-9]*", a.name): sys.exit("--name: только строчная латиница и цифры, например jetlag30")
voice = a.voice or os.path.join(r"C:\Users\daatva\voice-clone\out", a.name)
var, cid = a.name + "Bw", a.name[0].upper() + a.name[1:] + "Bw"
ep = os.path.join(STUDIO, "src", "episodes", a.name + "-bw")
os.makedirs(ep, exist_ok=True)

# 1. Тайминги из озвучки (там же проверка порядка планов).
subprocess.run([sys.executable, os.path.join(HERE, "gen_timing.py"), "--spec", a.spec, "--voice", voice, "--out", os.path.join(ep, "timing.ts"),
                "--tail", a.tail, "--fade", a.fade, "--lead", a.lead], check=True)

# 2. Голос в public.
pub = os.path.join(STUDIO, "public", a.name); os.makedirs(pub, exist_ok=True)
shutil.copy(os.path.join(voice, "best.wav"), os.path.join(pub, "voice.wav"))

# 3. index.tsx и заготовки сцен (сцены только если их ещё нет).
plans = json.load(open(a.spec, encoding="utf-8"))
open(os.path.join(ep, "index.tsx"), "w", encoding="utf-8").write(
    "import { makeEpisode } from '../../bw/episode';\nimport * as S from './shots';\nimport * as T from './timing';\n\n"
    f"// {a.name}: вертикальный ЧБ, {len(plans)} планов. Тайминги в timing.ts (final-video/tools/gen_timing.py), сборка общая: src/bw/episode.tsx.\n"
    f"export const {var} = makeEpisode({{ id: '{cid}', shots: S, timing: T, audio: '{a.name}/voice.wav' }});\n")
shots = os.path.join(ep, "shots.tsx")
if not os.path.exists(shots):
    out = ["import React from 'react';", "import { useCurrentFrame } from 'remotion';", "import { Head, Sheet } from '../../bw/core';",
           "import { T } from './timing';", "", f"// Сцены по plans.json: S1…S{len(plans)}, по одной на план. Время внутри сцены — кадры от её начала, события в T.<план>.", ""]
    for i, (pid, first, ev) in enumerate(plans, 1):
        evs = ", ".join(f"T.{pid}.{k} = «{w}»" for k, w in ev.items())
        out += [f"// {i}. {pid}: «{first} …»" + (f"; {evs}" if evs else ""),
                f"export const S{i}: React.FC = () => {{", "  const t = useCurrentFrame();",
                f"  return <Sheet><Head lines={{['{pid.upper()}']}} t={{t}} /></Sheet>;", "};", ""]
    open(shots, "w", encoding="utf-8").write("\n".join(out))
    print("сцены-заготовки:", shots)
else:
    print("shots.tsx уже есть, не трогаю")

# 4. Реестр.
reg = os.path.join(STUDIO, "src", "episodes", "index.ts")
t = open(reg, encoding="utf-8").read()
if f"from './{a.name}-bw'" not in t:
    t = re.sub(r"(\nexport const EPISODES)", f"\nimport {{ {var} }} from './{a.name}-bw';\\1", t, 1)
    t = re.sub(r"\];\s*$", f", {var}];\n", t, 1)
    open(reg, "w", encoding="utf-8").write(t)
    print("добавлен в реестр:", cid)
print(f"готово: npx remotion render src/index.ts {cid}Board out/{a.name}/b --sequence --image-format=png")
