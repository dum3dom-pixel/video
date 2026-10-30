import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { ellipsePoints, Glint, SketchLine, SketchShape } from "../../BallCity/sketch";
import { Character, GOLD_L, reach } from "../Character";
import { Block, H, Stage, W, Windows } from "../Extras";

// 90s brick phone: the forearm axis (+y) points up when the hand is at the ear.
const Phone: React.FC<{ readonly rot: number }> = ({ rot }) => (
  <g transform={`rotate(${rot}) translate(0 52)`}>
    <SketchShape id="ph" points={[[-22, -50], [22, -50], [24, 110], [-24, 110]]} seed="ph" fill="#1a1a1f" hatch="#6a6a78" gap={9} hatchOpacity={0.4} width={4} passes={1} />
    <SketchShape id="phs" points={[[-14, 70], [14, 70], [14, 98], [-14, 98]]} seed="phs" fill="#9ad08a" width={2.5} passes={1} />
    <SketchLine seed="phant" width={6} points={[[14, 110], [18, 215]]} />
    {[[-9, -30], [9, -30], [-9, -10], [9, -10], [-9, 10], [9, 10]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={4} fill="#e8e8f0" />
    ))}
  </g>
);

const Cash: React.FC<{ readonly rot: number }> = ({ rot }) => (
  <g transform={`rotate(${rot}) translate(0 40) scale(1)`}>
    {[-48, -24, 0, 24, 48].map((a, i) => (
      <g key={a} transform={`rotate(${-a})`}>
        <SketchShape id={`cash${i}`} points={[[-34, 0], [34, 0], [34, 150], [-34, 150]]} seed={`cash${i}`} fill="#a9d6a0" hatch="#2e6a3a" gap={8} hatchOpacity={0.45} width={3} passes={1} amp={1} />
        <SketchShape id={`cashc${i}`} points={ellipsePoints(0, 78, 17, 17, 10)} seed={`cashc${i}`} fill="#d8efcf" width={2.5} passes={1} amp={0.6} />
      </g>
    ))}
  </g>
);

export const Scene5Phone: React.FC = () => {
  const frame = useCurrentFrame();
  const armL = reach("L", [-122, -318 + Math.sin(frame * 1.5) * 4]);
  const armR = reach("R", [232, -190 + Math.sin(frame * 1.2) * 8]);
  const up = interpolate(frame, [23, 27], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Stage bg="#0f1a38">
      <SketchShape id="nsky" points={[[0, 0], [W, 0], [W, H], [0, H]]} seed="nsky" fill="#101c42" hatch="#3a5aa8" gap={14} hatchOpacity={0.5} outline={false} />
      {[[120, 360], [300, 250], [760, 300], [980, 460], [560, 420]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={4} fill="#fff6c8" />
      ))}
      <Block id="nb1" x={-20} y={700} w={330} h={700} fill="#16224a" hatch="#3a4a8a" gap={16} />
      <Windows uid="nw1" x={30} y={750} cols={3} rows={5} cw={44} ch={60} dx={90} dy={115} fill="#0d1432" litFill="#f2c14e" lit={(r, c) => (r + c) % 3 === 0} />
      <Block id="nb2" x={760} y={600} w={340} h={800} fill="#16224a" hatch="#3a4a8a" gap={16} />
      <Windows uid="nw2" x={800} y={660} cols={3} rows={6} cw={44} ch={60} dx={90} dy={115} fill="#0d1432" litFill="#f2c14e" lit={(r, c) => (r * 2 + c) % 4 === 1} />
      {/* street lamp */}
      <circle cx={900} cy={470} r={170} fill={GOLD_L} opacity={0.2} />
      <SketchLine seed="lamp" width={8} points={[[960, 1250], [960, 470], [880, 450]]} />
      <SketchShape id="lampl" points={ellipsePoints(870, 462, 38, 20, 10)} seed="lampl" fill="#fff0a0" width={3} passes={1} />
      <Glint cx={870} cy={455} from={10} size={50} />
      <Glint cx={870} cy={455} from={22} size={46} />
      <Character outfit="leather" goldChain rings goldTooth expression="talk" legs={false} armL={armL} armR={armR} heldL={<Phone rot={180 - (armL.a + armL.b)} />} heldR={<Cash rot={165 + armR.a + armR.b} />} gaze={[4 * up, -6 * up]} headTilt={-4 * up} glints={{ tooth: [6], rightHand: [8, 14, 20] }} x={500} y={1520} scale={1.75} />
      <rect width={W} height={H} fill="#0a1850" opacity={0.28} />
      {/* black car: roof edge on top, door at the bottom */}
      <SketchShape id="roof" points={[[-10, -10], [W + 10, -10], [W + 10, 150], [-10, 250]]} seed="roof" fill="#0a0a0e" hatch="#4a5a8a" gap={15} hatchOpacity={0.4} width={5} />
      <SketchLine seed="roofc" width={5} color="#aab8d8" points={[[0, 262], [W, 160]]} />
      <SketchShape id="door" points={[[-10, 1450], [560, 1420], [W + 10, 1380], [W + 10, H + 10], [-10, H + 10]]} seed="door" fill="#0a0a0e" hatch="#4a5a8a" gap={15} hatchOpacity={0.4} width={5} />
      <SketchLine seed="doorc" width={6} color="#aab8d8" points={[[0, 1466], [560, 1436], [W, 1396]]} />
      <SketchLine seed="doorc2" width={4} color="#5a6a9a" points={[[0, 1700], [W, 1650]]} />
      <SketchShape id="mirror" points={[[880, 1380], [1010, 1340], [1050, 1390], [940, 1430]]} seed="mirror" fill="#0a0a0e" hatch="#4a5a8a" gap={10} hatchOpacity={0.5} width={4} passes={1} />
      <SketchShape id="handle" points={[[640, 1560], [820, 1550], [830, 1590], [650, 1600]]} seed="handle" fill="#c9d2e8" hatch="#5a6a9a" gap={7} hatchOpacity={0.6} width={4} passes={1} />
      <SketchLine seed="seam" width={4} color="#5a6a9a" points={[[220, 1470], [200, 1920]]} />
      <SketchLine seed="refl" width={9} color={GOLD_L} points={[[760, 1760], [980, 1740]]} />
      <Glint cx={300} cy={1445} from={14} size={44} />
    </Stage>
  );
};
