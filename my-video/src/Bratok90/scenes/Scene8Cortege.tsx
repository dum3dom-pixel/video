import type React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { arcPoints, ellipsePoints, Glint, SketchLine, SketchShape, SketchText } from "../../BallCity/sketch";
import { Character, GOLD, GOLD_L } from "../Character";
import { Block, Car, H, Stage, W, Windows } from "../Extras";

// Short horizontal glints on the wet asphalt, re-seeded every frame.
const Reflections: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <g>
      {Array.from({ length: 120 }, (_, i) => {
        const y = 1080 + random(`ry${i}`) * 820;
        const x = random(`rx${i}`) * W + (random(`rj${i}-${frame}`) - 0.5) * 10;
        const len = 30 + random(`rl${i}`) * 140;
        return (
          <line key={i} x1={x} y1={y} x2={x + len} y2={y + (random(`rd${i}-${frame}`) - 0.5) * 3} stroke={i % 4 === 0 ? GOLD_L : i % 3 === 0 ? "#dfeaf2" : "#ffffff"} strokeWidth={3 + random(`rw${i}`) * 3} strokeLinecap="round" opacity={0.35 + random(`ro${i}`) * 0.4} />
        );
      })}
    </g>
  );
};

const Blonde: React.FC = () => (
  <g transform="translate(-75 -262)">
    <SketchShape id="bhair" points={ellipsePoints(0, 6, 56, 66, 16)} seed="bhair" fill="#f2d36a" hatch={GOLD} gap={6} hatchOpacity={0.6} width={3} passes={1} />
    <SketchShape id="bface" points={ellipsePoints(0, 6, 38, 48, 14)} seed="bface" fill="#f3d2b2" width={3} passes={1} />
    <circle cx={-14} cy={-4} r={4} fill="#2b2b2b" />
    <circle cx={14} cy={-4} r={4} fill="#2b2b2b" />
    <SketchLine seed="blips" passes={1} width={5} color="#c8322f" points={arcPoints(0, 20, 12, 7, 10, 170, 6)} />
  </g>
);

const Escort: React.FC<{ readonly x: number }> = ({ x }) => (
  <>
    <SketchShape id={`es${x}`} points={ellipsePoints(x, -262, 40, 52, 12)} seed={`es${x}`} fill="#15151a" width={3} passes={1} />
    <SketchShape id={`eg${x}`} points={[[x - 36, -274], [x + 36, -274], [x + 30, -254], [x - 30, -254]]} seed={`eg${x}`} fill="#000" width={2} passes={1} />
  </>
);

export const Scene8Cortege: React.FC = () => {
  const frame = useCurrentFrame();
  const lead = interpolate(frame, [0, 44], [400, 880]);
  const fade = interpolate(frame, [30, 37], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bounce = (k: number) => Math.sin(frame * 2.3 + k) * 3;
  return (
    <Stage
      overlay={
        <div style={{ position: "absolute", inset: 0, opacity: fade }}>
          <SketchText text="90-е. Классика." from={30} to={999} top={150} size={150} />
        </div>
      }
    >
      <g transform="translate(0 110)">
      <SketchShape id="sky" points={[[0, -120], [W, -120], [W, 900], [0, 900]]} seed="sky" fill="#d6dee4" hatch="#9fb0bf" gap={22} hatchOpacity={0.35} outline={false} />
      <Block id="c1" x={-20} y={440} w={280} h={460} fill="#dcc690" hatch="#a8864a" />
      <Block id="c2" x={280} y={560} w={250} h={340} fill="#b5c4d0" hatch="#6f8ba6" />
      <Block id="c3" x={550} y={380} w={260} h={520} fill="#e0b0a0" hatch="#b06a56" />
      <Block id="c4" x={830} y={500} w={270} h={400} fill="#a9c4a9" hatch="#5f8a64" />
      <Windows uid="cw1" x={20} y={500} cols={3} rows={4} cw={44} ch={60} dx={80} dy={100} fill="#5f6f7e" lit={(r, c) => (r + c) % 3 === 0} />
      <Windows uid="cw3" x={590} y={440} cols={3} rows={4} cw={44} ch={60} dx={80} dy={110} fill="#5f6f7e" lit={(r, c) => (r + c) % 4 === 1} />
      <Windows uid="cw4" x={870} y={560} cols={3} rows={3} cw={44} ch={60} dx={80} dy={100} fill="#5f6f7e" />
      {/* wet street */}
      <SketchShape id="walk" points={[[-10, 880], [W + 10, 880], [W + 10, 950], [-10, 950]]} seed="walk" fill="#c9ccd0" hatch="#8a8f98" gap={16} hatchOpacity={0.4} width={4} />
      <SketchShape id="road" points={[[-10, 950], [W + 10, 950], [W + 10, H + 10], [-10, H + 10]]} seed="road" fill="#7d838e" hatch="#4a505a" gap={14} hatchOpacity={0.4} outline={false} />
      <Reflections />
      {/* two followers (smaller = further away), then the leader */}
      {[{ k: 2, dx: 900, y: 1130, s: 0.6 }, { k: 1, dx: 530, y: 1210, s: 0.76 }].map(({ k, dx, y, s }) => (
        <g key={k}>
          <ellipse cx={lead - dx} cy={y + 18} rx={340 * s} ry={22} fill="#15151a" opacity={0.3} />
          <Car uid={`f${k}`} x={lead - dx} y={y + bounce(k) * 0.5} s={s}>
            <Escort x={-70} />
            <Escort x={60} />
          </Car>
        </g>
      ))}
      <ellipse cx={lead} cy={1318} rx={360} ry={26} fill="#15151a" opacity={0.35} />
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1={lead - 300 + i * 40} y1={1350 + i * 22} x2={lead + 260 - i * 20} y2={1350 + i * 22} stroke="#fff" strokeWidth={4} opacity={0.4} strokeLinecap="round" />
      ))}
      <Car uid="lead" x={lead} y={1300 + bounce(0)} s={0.92}>
        <Blonde />
        <Character outfit="leather" goldChain goldTooth expression="smile" legs={false} x={70} y={-262 + 372 * 0.62} scale={0.62} uid="drv" />
      </Car>
      </g>
      {frame >= 32 ? (
        <SketchLine seed="uline" width={12} color={GOLD} amp={3} points={[[250, 345], [540, 335], [830, 349]]} />
      ) : null}
      {frame >= 33 ? <Glint cx={830} cy={340} from={34} size={60} /> : null}
    </Stage>
  );
};
