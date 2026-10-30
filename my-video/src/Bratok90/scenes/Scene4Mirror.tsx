import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { arcPoints, ellipsePoints, Glint, SketchLine, SketchShape, type Pt } from "../../BallCity/sketch";
import { Character, GOLD, GOLD_L, reach } from "../Character";
import { H, Stage, W } from "../Extras";

const CX = 540;
const inner: Pt[] = [[200, 1500], [200, 780], ...arcPoints(CX, 780, 340, 330, 180, 360, 14), [880, 780], [880, 1500]];
const frame1: Pt[] = [[130, 1560], [130, 770], ...arcPoints(CX, 770, 410, 400, 180, 360, 14), [950, 770], [950, 1560]];

const lerpPt = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const clamp01 = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const Scene4Mirror: React.FC = () => {
  const frame = useCurrentFrame();
  const stroke = Math.sin(frame * 2.2) * 14;
  const hairL: Pt = [-78 + stroke, -462 + Math.abs(stroke)];
  const hairR: Pt = [78 - stroke, -462 + Math.abs(stroke)];
  const collarL: Pt = [-50, -218 + Math.sin(frame * 2) * 6];
  const collarR: Pt = [50, -218 - Math.sin(frame * 2) * 6];
  const down = (s: number): Pt => [s * 150, -90];
  const toCollar = clamp01(frame, 12, 16);
  const toDown = clamp01(frame, 22, 26);
  const pick = (hair: Pt, collar: Pt, s: number) => lerpPt(lerpPt(hair, collar, toCollar), down(s), toDown);
  const armL = reach("L", pick(hairL, collarL, -1));
  const armR = reach("R", pick(hairR, collarR, 1));
  const smile = frame >= 24;
  const breathe = Math.sin(frame * 0.5) * 6;
  return (
    <Stage bg="#d9cdb4">
      <SketchShape id="room" points={[[0, 0], [W, 0], [W, H], [0, H]]} seed="room" fill="#b89a74" hatch="#6a4a2a" gap={18} hatchOpacity={0.35} outline={false} />
      {/* carved wooden frame */}
      <SketchShape id="mframe" points={frame1} seed="mframe" fill="#7a4a24" hatch="#3a1c08" gap={9} hatchOpacity={0.5} width={5} />
      {[200, 540, 880].map((x, i) => (
        <SketchLine key={i} seed={`curl${i}`} width={5} color={GOLD} points={arcPoints(x, 440 + (i === 1 ? -20 : 70), 38, 38, 90, 450, 12)} />
      ))}
      {[900, 1100, 1300].map((y) => (
        <g key={y}>
          <SketchLine seed={`cl${y}`} width={5} color={GOLD_L} points={arcPoints(165, y, 22, 22, 0, 330, 10)} />
          <SketchLine seed={`cr${y}`} width={5} color={GOLD_L} points={arcPoints(915, y, 22, 22, 210, 540, 10)} />
        </g>
      ))}
      <SketchShape id="mglass" points={inner} seed="mglass" fill="#c9dbe0" hatch="#ffffff" gap={22} hatchOpacity={0.6} width={4} />
      <clipPath id="mclip">
        <path d={`${inner.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" ")}Z`} />
      </clipPath>
      <g clipPath="url(#mclip)">
        <SketchShape id="mwall" points={[[200, 1180], [880, 1180], [880, 1500], [200, 1500]]} seed="mwall" fill="#b9a583" hatch="#7a6240" gap={14} hatchOpacity={0.4} outline={false} />
        <Character outfit="leather" goldChain expression={smile ? "smile" : "smirk"} goldTooth legs={false} armL={armL} armR={armR} glints={{ tooth: [26], chain: [28] }} headTilt={smile ? 4 : 0} x={CX} y={1590} scale={1.8} uid="mir" />
        <SketchShape id="shine" points={[[260, 1450], [330, 1450], [610, 800], [540, 800]]} seed="shine" fill="#ffffff" fillOpacity={0.14} outline={false} />
      </g>
      <Glint cx={800} cy={760} from={27} size={50} />
      {/* foreground: back of the hero's head and shoulder */}
      <g transform={`translate(0 ${breathe})`}>
        <SketchShape id="back" points={[[-60, 1920], [-60, 1760], [120, 1700], [330, 1710], [470, 1780], [600, 1920]]} seed="back" fill="#1b1b20" hatch="#5a5a68" gap={14} hatchOpacity={0.4} width={5} />
        <SketchShape id="bneck" points={[[140, 1690], [340, 1690], [370, 1800], [110, 1800]]} seed="bneck" fill="#c9987a" hatch="#8a5a3a" gap={7} hatchOpacity={0.5} width={3} passes={1} />
        <SketchShape id="bhead" points={ellipsePoints(240, 1530, 190, 215, 22)} seed="bhead" fill="#17171c" hatch="#6a6a78" gap={9} hatchOpacity={0.45} width={5} />
        <SketchShape id="bear" points={ellipsePoints(440, 1560, 26, 44, 10)} seed="bear" fill="#c9987a" width={3.5} passes={1} />
      </g>
    </Stage>
  );
};
