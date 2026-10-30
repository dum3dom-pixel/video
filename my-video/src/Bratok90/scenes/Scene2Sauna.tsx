import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { arcPoints, ellipsePoints, SketchLine, SketchShape } from "../../BallCity/sketch";
import { Character, GOLD, GOLD_L, reach } from "../Character";
import { Block, Bricks, H, Silhouette, Stage, W } from "../Extras";

const Glass: React.FC = () => (
  <g transform="translate(0 -4) scale(1.5)">
    <SketchShape id="shot" points={[[-14, -4], [14, -4], [23, 64], [-23, 64]]} seed="shot" fill="#e8f3f8" hatch="#9ec3d6" gap={6} hatchOpacity={0.5} width={3} passes={1} />
    <SketchShape id="shot-l" points={[[-13, -2], [13, -2], [18, 30], [-18, 30]]} seed="shotl" fill={GOLD_L} hatch={GOLD} gap={5} hatchOpacity={0.6} outline={false} />
  </g>
);

const Steam: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {[0, 1, 2].map((i) => (
        <SketchLine
          key={i}
          seed={`steam${i}`}
          passes={1}
          width={4}
          color="#ffffff"
          points={Array.from({ length: 8 }, (_, k): [number, number] => [
            190 + i * 55 + Math.sin(k * 0.9 + frame * 0.8 + i) * 22,
            720 - k * 55,
          ])}
        />
      ))}
    </>
  );
};

export const Scene2Sauna: React.FC = () => {
  const frame = useCurrentFrame();
  const hand = interpolate(frame, [0, 11], [0, 1], { extrapolateRight: "clamp" });
  const armR = reach("R", [150 + hand * 70, -110 - hand * 230]);
  return (
    <Stage>
      <Block id="wall" x={0} y={0} w={W} h={H} fill="#d49a5c" hatch="#8a5a2c" gap={16} opacity={0.4} line={false} />
      {Array.from({ length: 11 }, (_, i) => (
        <SketchLine key={i} seed={`plank${i}`} width={3.5} points={[[i * 100 + 10, 0], [i * 100 + 10, H]]} />
      ))}
      {/* brick stove with stones and a glowing door */}
      <Block id="stove" x={30} y={760} w={330} h={720} fill="#b5543a" hatch="#6e2a18" gap={12} opacity={0.45} />
      <Bricks x={30} y={760} w={330} h={720} color="#4a1a10" seed="sb" bw={70} bh={36} opacity={0.5} />
      <SketchShape id="stdoor" points={[[90, 1080], [300, 1080], [300, 1320], [90, 1320]]} seed="stdoor" fill="#1d1612" width={4} />
      <SketchShape id="stglow" points={[[110, 1230], [280, 1230], [280, 1305], [110, 1305]]} seed="stglow" fill="#ff8a2a" hatch="#ffd24a" gap={8} hatchOpacity={0.8} outline={false} />
      {Array.from({ length: 6 }, (_, i) => (
        <SketchShape key={i} id={`stone${i}`} points={ellipsePoints(80 + i * 46, 735 - (i % 2) * 18, 32, 26, 10)} seed={`stone${i}`} fill="#8a8a92" hatch="#4a4a52" gap={8} hatchOpacity={0.5} width={3} passes={1} />
      ))}
      <SketchLine seed="pipe" width={14} color="#555" points={[[195, 700], [195, 300]]} />
      <Steam />
      {/* hanging bucket + shelf on the right */}
      <Block id="shelf" x={720} y={520} w={330} h={26} fill="#a8703a" hatch="#6a4220" />
      <SketchShape id="bucket" points={[[790, 380], [940, 380], [915, 515], [815, 515]]} seed="bucket" fill="#c98a4e" hatch="#6a4220" gap={9} hatchOpacity={0.5} width={4} />
      <SketchLine seed="bucketarc" width={4} points={arcPoints(865, 380, 75, 70, 180, 360, 10)} />
      {/* two women in fur coats */}
      <Silhouette uid="wf1" x={150} y={1530} s={1.3} color="#8a5a3a" hatch="#2a1608" fur hair="#d9a441" />
      <Silhouette uid="wf2" x={930} y={1530} s={1.3} color="#c9c0b0" hatch="#6a5f50" fur hair="#2a1608" />
      <Character outfit="burgundy" goldChain rings expression="smirk" legs={false} armR={armR} armL={{ a: 18, b: -30 }} heldR={<Glass />} x={540} y={1650} scale={1.65} headTilt={-3 + hand * 4} />
      {/* table, fruit bowl, bottle */}
      <SketchShape id="table" points={[[-10, 1480], [W + 10, 1480], [W + 10, H], [-10, H]]} seed="table" fill="#8a5a2c" hatch="#4a2a10" gap={13} hatchOpacity={0.45} width={5} />
      <SketchShape id="cloth" points={[[-10, 1480], [W + 10, 1480], [W + 10, 1540], [-10, 1540]]} seed="cloth" fill="#e9dcc0" hatch="#b9a46a" gap={9} hatchOpacity={0.4} width={4} />
      <SketchShape id="bowl" points={[...arcPoints(300, 1590, 150, 90, 0, 180, 12)]} seed="bowl" fill="#e9e4d4" hatch="#8aa6c0" gap={9} hatchOpacity={0.6} width={4} />
      {[["#d63a3a", 220, 1560], ["#f08a24", 290, 1540], ["#7bc47f", 360, 1560], ["#e84a4a", 255, 1596], ["#f2c14e", 335, 1600], ["#9b3a7a", 400, 1596]].map(([c, x, y], i) => (
        <SketchShape key={i} id={`fruit${i}`} points={ellipsePoints(Number(x), Number(y) - 20, 40, 38, 12)} seed={`fruit${i}`} fill={String(c)} hatch="#000" gap={8} hatchOpacity={0.25} width={3} passes={1} />
      ))}
      <SketchShape id="bottle" points={[[860, 1700], [940, 1700], [945, 1560], [915, 1500], [915, 1440], [885, 1440], [885, 1500], [855, 1560]]} seed="bottle" fill="#3f8a5a" hatch="#1d4a2e" gap={8} hatchOpacity={0.5} width={4} />
      <SketchShape id="label" points={[[865, 1590], [935, 1590], [935, 1650], [865, 1650]]} seed="label" fill={GOLD_L} hatch={GOLD} gap={7} hatchOpacity={0.7} width={3} passes={1} />
      <rect width={W} height={H} fill="#ffa63d" opacity={0.1} />
    </Stage>
  );
};
