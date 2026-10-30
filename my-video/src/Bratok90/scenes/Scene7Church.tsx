import type React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { arcPoints, ellipsePoints, Glint, InkScale, SketchLine, SketchShape, type Pt } from "../../BallCity/sketch";
import { Character, GOLD, GOLD_L, reach } from "../Character";
import { Block, Candle, Guard, H, Silhouette, Stage, W } from "../Extras";

// Abstract icon: gold arched frame, dark panel and a gold halo disc (no figure).
const Icon: React.FC<{ readonly uid: string; readonly x: number; readonly y: number; readonly w: number; readonly h: number; readonly panel: string }> = ({ uid, x, y, w, h, panel }) => {
  const r = w / 2;
  const outer: Pt[] = [[x, y + h], [x, y + r], ...arcPoints(x + r, y + r, r, r, 180, 360, 10), [x + w, y + h]];
  const inn: Pt[] = [[x + 14, y + h - 14], [x + 14, y + r], ...arcPoints(x + r, y + r, r - 14, r - 14, 180, 360, 10), [x + w - 14, y + h - 14]];
  return (
    <g>
      <SketchShape id={`${uid}-o`} points={outer} seed={`${uid}o`} fill={GOLD_L} hatch={GOLD} gap={7} hatchOpacity={0.9} width={4} />
      <SketchShape id={`${uid}-i`} points={inn} seed={`${uid}i`} fill={panel} hatch="#000" gap={12} hatchOpacity={0.3} width={3} passes={1} />
      <SketchShape id={`${uid}-h`} points={ellipsePoints(x + r, y + r + 10, r * 0.5, r * 0.5, 16)} seed={`${uid}h`} fill={GOLD_L} hatch={GOLD} gap={5} hatchOpacity={0.9} width={4} passes={1} />
      <SketchLine seed={`${uid}halo`} passes={1} width={4} color="#fff3b0" points={arcPoints(x + r, y + r + 10, r * 0.34, r * 0.34, 200, 300, 6)} />
    </g>
  );
};

const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const ramp = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });

export const Scene7Church: React.FC = () => {
  const frame = useCurrentFrame();
  const camT = interpolate(frame, [34, 59], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const cs = 1 + camT * 1.55;
  const cy = 960 + camT * 135;
  // hero gestures, in character space
  const restL: Pt = [-136, 36];
  const restR: Pt = [136, 36];
  const face: Pt = [72 + Math.sin(frame * 1.6) * 6, -300];
  const chest: Pt = [30, -175];
  const foldR: Pt = [38, -108];
  const foldL: Pt = [-38, -108];
  const tFace = ramp(frame, 10, 14) - ramp(frame, 20, 23);
  const tChest = ramp(frame, 22, 25);
  const tFold = ramp(frame, 33, 37);
  const targetR = lerp(lerp(lerp(restR, face, tFace), chest, tChest), foldR, tFold);
  const targetL = lerp(restL, foldL, tFold);
  const armR = reach("R", targetR);
  const armL = reach("L", targetL);
  const rays = interpolate(frame, [34, 58], [0, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Stage bg="#2a2030">
      <InkScale.Provider value={1 / Math.sqrt(cs)}>
        <g transform={`translate(540 960) scale(${cs}) translate(-540 ${-cy})`}>
          <Block id="cwall" x={-10} y={-10} w={W + 20} h={H + 20} fill="#4a3a46" hatch="#a8845a" gap={16} opacity={0.35} line={false} />
          {/* big central arch with golden light */}
          <SketchShape id="arch" points={[[190, 1400], [190, 760], ...arcPoints(540, 760, 350, 380, 180, 360, 16), [890, 1400]]} seed="arch" fill="#e8c88a" hatch={GOLD} gap={14} hatchOpacity={0.45} width={6} />
          <SketchShape id="arch2" points={[[250, 1400], [250, 770], ...arcPoints(540, 770, 290, 320, 180, 360, 16), [830, 1400]]} seed="arch2" fill="#f6dfaa" hatch={GOLD_L} gap={12} hatchOpacity={0.5} width={4} passes={1} />
          <Icon uid="ic1" x={60} y={520} w={130} h={330} panel="#7a1830" />
          <Icon uid="ic2" x={890} y={520} w={130} h={330} panel="#1f3a5a" />
          <Icon uid="ic3" x={440} y={70} w={200} h={340} panel="#3a2a5a" />
          {/* columns */}
          <SketchShape id="colL" points={[[-10, 0], [90, 0], [100, 1500], [-10, 1500]]} seed="colL" fill="#6a5666" hatch="#2a1c2a" gap={11} hatchOpacity={0.45} width={5} />
          <SketchShape id="colR" points={[[990, 0], [1090, 0], [1090, 1500], [980, 1500]]} seed="colR" fill="#6a5666" hatch="#2a1c2a" gap={11} hatchOpacity={0.45} width={5} />
          <SketchShape id="floor" points={[[-10, 1350], [W + 10, 1350], [W + 10, H + 10], [-10, H + 10]]} seed="floor" fill="#7a5a44" hatch="#3a2418" gap={16} hatchOpacity={0.4} width={5} />
          {[200, 400, 540, 680, 880].map((x, i) => (
            <SketchLine key={i} seed={`tile${i}`} width={3} color="#3a2418" points={[[540 + (x - 540) * 0.35, 1350], [540 + (x - 540) * 2.2, H]]} />
          ))}
          {/* gold rays that grow for the punchline */}
          <g opacity={rays}>
            {Array.from({ length: 16 }, (_, i) => {
              const a = (i / 16) * Math.PI * 2;
              return <SketchLine key={i} seed={`ray${i}`} passes={1} width={7} color={GOLD_L} points={[[540 + Math.cos(a) * 200, 1090 + Math.sin(a) * 200], [540 + Math.cos(a) * 650, 1090 + Math.sin(a) * 650]]} />;
            })}
          </g>
          {/* background crowd: grandmas in headscarves, guards in black */}
          <Silhouette uid="gm1" x={130} y={1420} s={1} color="#4a4a58" hatch="#111" scarf="#3a6aa8" />
          <Silhouette uid="gm2" x={960} y={1430} s={1} color="#5a3a3a" hatch="#111" scarf="#c8422f" />
          <Silhouette uid="gm3" x={280} y={1380} s={0.8} color="#3a4a3a" hatch="#111" scarf="#9aa0a8" />
          <Guard uid="cg1" x={290} y={1190} s={0.85} />
          <Guard uid="cg2" x={800} y={1190} s={0.85} />
          <Character outfit="blackLeather" rings bling={1.7} goldChain expression={frame < 34 ? "smirk" : "smile"} legs armL={armL} armR={armR} headTilt={frame >= 34 ? -3 : 0} glints={{ rightHand: [37, 43, 49], leftHand: [40, 46, 52], chain: [30] }} x={540} y={1260} scale={1.5} />
          {/* candles in the foreground */}
          {[60, 150, 240, 330].map((x, i) => (
            <Candle key={x} uid={`cl${i}`} x={x} y={1800 - (i % 2) * 40} h={110 - i * 8} />
          ))}
          {[740, 830, 920, 1010].map((x, i) => (
            <Candle key={x} uid={`cr${i}`} x={x} y={1790 + (i % 2) * 30} h={90 + i * 8} />
          ))}
          <Glint cx={470} cy={1072} from={50} size={90} />
          <Glint cx={610} cy={1100} from={53} size={110} />
          <Glint cx={540} cy={1030} from={56} size={90} />
        </g>
      </InkScale.Provider>
    </Stage>
  );
};
