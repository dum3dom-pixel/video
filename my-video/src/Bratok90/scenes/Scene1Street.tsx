import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { arcPoints, SketchLine, SketchShape } from "../../BallCity/sketch";
import { Character, reach } from "../Character";
import { Block, Bricks, Guard, H, Silhouette, Stage, W, Windows } from "../Extras";

const HORIZON = 1100;

const Newspapers: React.FC = () => (
  <g transform="translate(-8 -30) rotate(-8) scale(1.1)">
    <SketchShape id="news" points={[[-40, -8], [40, -8], [40, 120], [-40, 120]]} seed="news" fill="#e9e4d4" hatch="#9a9a9a" gap={9} hatchOpacity={0.35} width={3.5} passes={1} />
    {[18, 40, 62, 84].map((y) => (
      <SketchLine key={y} seed={`nl${y}`} passes={1} width={2.5} amp={0.8} points={[[-28, y], [28, y]]} />
    ))}
  </g>
);

export const Scene1Street: React.FC = () => {
  const frame = useCurrentFrame();
  const phase = (frame * Math.PI) / 3;
  const scale = interpolate(frame, [0, 39], [1.25, 1.5]);
  const baseY = interpolate(frame, [0, 39], [1190, 1275]);
  const bob = -Math.abs(Math.sin(phase)) * 12;
  const wave = interpolate(frame, [24, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const swing = Math.sin(phase) * 9;
  const raised = reach("R", [215 + Math.sin(frame * 1.9) * 22, -395]);
  const armR = { a: 8 - swing + (raised.a - 8 + swing) * wave, b: 6 + (raised.b - 6) * wave };
  const armL = { a: 10, b: -10 };
  return (
    <Stage>
      {/* overcast sky */}
      <SketchShape id="sky" points={[[0, 0], [W, 0], [W, HORIZON], [0, HORIZON]]} seed="sky" fill="#c9cfd4" hatch="#8f99a3" gap={20} hatchOpacity={0.4} outline={false} />
      {[[200, 200, 260], [720, 330, 300], [440, 90, 200]].map(([cx, cy, rx], i) => (
        <SketchLine key={i} seed={`cloud${i}`} passes={1} width={3} color="#7e8892" points={arcPoints(cx, cy, rx, 50, 180, 360, 12)} />
      ))}
      {/* far buildings */}
      <Block id="far1" x={270} y={700} w={370} h={400} fill="#b9c3cc" hatch="#7f8fa0" />
      <Block id="far2" x={760} y={760} w={140} h={340} fill="#c8b9a6" hatch="#9a8466" />
      <Windows uid="fw1" x={300} y={740} cols={5} rows={4} cw={34} ch={46} dx={70} dy={90} fill="#5f6f7e" />
      {/* red brick tower with a pointed top */}
      <SketchShape id="tower" points={[[620, 1100], [620, 540], [770, 540], [770, 1100]]} seed="tower" fill="#b5412f" hatch="#6e1f14" gap={12} hatchOpacity={0.4} width={4} />
      <Bricks x={620} y={540} w={150} h={560} color="#5a1a10" seed="tbr" bw={38} bh={26} opacity={0.5} />
      <SketchShape id="roof" points={[[598, 548], [792, 548], [695, 170]]} seed="roof" fill="#7a2a20" hatch="#3d0d08" gap={9} hatchOpacity={0.5} width={4} />
      <SketchShape id="twin1" points={[[672, 640], [718, 640], [718, 720], [672, 720]]} seed="twin1" fill="#2e3440" width={3} passes={1} />
      <SketchShape id="twin2" points={[[672, 820], [718, 820], [718, 900], [672, 900]]} seed="twin2" fill="#f2c14e" width={3} passes={1} />
      {/* near old buildings */}
      <Block id="left" x={-30} y={380} w={310} h={720} fill="#d9c9a6" hatch="#a58d5c" />
      <Windows uid="lw" x={20} y={440} cols={3} rows={6} cw={52} ch={76} dx={82} dy={110} fill="#4f5f6e" lit={(r, c) => (r + c) % 4 === 1} />
      <Block id="right" x={800} y={300} w={300} h={800} fill="#cdb8a4" hatch="#9a6f4f" />
      <Windows uid="rw" x={835} y={360} cols={3} rows={7} cw={52} ch={76} dx={80} dy={110} fill="#4f5f6e" lit={(r, c) => (r * 2 + c) % 5 === 2} />
      {/* street */}
      <SketchShape id="road" points={[[0, HORIZON], [W, HORIZON], [W, H], [0, H]]} seed="road" fill="#9b9ea4" hatch="#60646c" gap={24} hatchOpacity={0.35} width={4} />
      {[0, W].map((ex, i) => (
        <SketchLine key={i} seed={`curb${i}`} width={4} points={[[540, HORIZON], [ex, H - 1]]} />
      ))}
      <Silhouette uid="pass1" x={150} y={1135} s={0.75} color="#3b4452" hatch="#111" />
      <Silhouette uid="pass2" x={955} y={1150} s={0.62} color="#5b3a3a" hatch="#111" scarf="#d9622b" />
      <Guard uid="g1" x={250} y={1255} s={1.05} bob={Math.sin(phase + 1) * 6} />
      <Guard uid="g2" x={830} y={1255} s={1.05} bob={Math.sin(phase + 4) * 6} />
      <Character outfit="leather" expression="smirk" legs walk={phase} armL={armL} armR={armR} heldL={<Newspapers />} x={540} y={baseY + bob} scale={scale} />
    </Stage>
  );
};
