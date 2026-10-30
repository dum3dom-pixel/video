import type React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { ellipsePoints, Glint, SketchLine, SketchShape } from "../../BallCity/sketch";
import { Character, GOLD_L } from "../Character";
import { Block, Bricks, H, Stage, W } from "../Extras";

const SILL = 1000;
const WIN = { x: 330, y: 520, w: 420 };
const MID = WIN.x + WIN.w / 2;

export const Scene6Escape: React.FC = () => {
  const frame = useCurrentFrame();
  const climb = interpolate(frame, [0, 8], [300, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const lower = interpolate(frame, [6, 23], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const sackY = 1100 + lower * 440;
  const sway = Math.sin(frame * 0.9) * 14 * lower;
  return (
    <Stage bg="#0e1632">
      <Block id="wall" x={-10} y={-10} w={W + 20} h={H + 20} fill="#27305a" hatch="#4a5a9a" gap={16} opacity={0.45} line={false} />
      <Bricks x={0} y={0} w={W} h={1700} color="#0f1538" seed="wb" bw={120} bh={50} opacity={0.85} />
      {/* cornice seen from below */}
      <SketchShape id="cornice" points={[[-10, -10], [W + 10, -10], [W + 10, 160], [-10, 230]]} seed="corn" fill="#10163a" hatch="#4a5a9a" gap={12} hatchOpacity={0.5} width={5} />
      <SketchShape id="pipe" points={[[90, 230], [130, 230], [150, 1700], [105, 1700]]} seed="pipe" fill="#3a4470" hatch="#0a0f28" gap={9} hatchOpacity={0.5} width={4} />
      {/* dark neighbour window */}
      <SketchShape id="dwin" points={[[830, 560], [1000, 560], [1000, 900], [830, 900]]} seed="dwin" fill="#080c20" width={5} />
      {/* lit window on the 2nd floor */}
      <circle cx={MID} cy={760} r={380} fill={GOLD_L} opacity={0.07} />
      <SketchShape id="lwin" points={[[WIN.x, WIN.y], [WIN.x + WIN.w, WIN.y], [WIN.x + WIN.w, SILL], [WIN.x, SILL]]} seed="lwin" fill="#ffd36a" hatch="#ff9a2a" gap={11} hatchOpacity={0.55} width={6} />
      <clipPath id="winclip">
        <rect x={WIN.x} y={WIN.y} width={WIN.w} height={SILL - WIN.y} />
      </clipPath>
      <g clipPath="url(#winclip)">
        <g transform={`translate(0 ${climb})`}>
          <Character outfit="blackLeather" legs={false} expression="smirk" armL={{ a: 14, b: -50 }} armR={{ a: 14, b: -50 }} gaze={[0, 6]} headTilt={-6} x={MID} y={SILL + 20} scale={0.62} uid="thief" />
        </g>
        <rect x={WIN.x} y={WIN.y} width={WIN.w} height={SILL - WIN.y} fill="#0a1850" opacity={0.18} />
      </g>
      <SketchShape id="sill" points={[[WIN.x - 50, SILL], [WIN.x + WIN.w + 50, SILL], [WIN.x + WIN.w + 90, SILL + 56], [WIN.x - 90, SILL + 56]]} seed="sill" fill="#4a5488" hatch="#10163a" gap={10} hatchOpacity={0.5} width={5} />
      {/* rope and sack */}
      <SketchLine seed="rope" width={4} color="#c9a46a" points={[[MID + 4, SILL + 20], [MID + 4 + sway, sackY - 50]]} />
      <g transform={`translate(${MID + sway} ${sackY}) rotate(${sway * 0.3})`}>
        <SketchShape id="sack" points={ellipsePoints(0, 40, 72, 88, 14)} seed="sack" fill="#c9a46a" hatch="#6a4a2a" gap={9} hatchOpacity={0.5} width={4} />
        <SketchShape id="sackn" points={[[-22, -40], [22, -40], [16, -8], [-16, -8]]} seed="sackn" fill="#b08a5a" width={4} passes={1} />
        <SketchLine seed="sackt" width={5} points={[[-26, -8], [26, -8]]} />
        <Glint cx={-30} cy={20} from={18} size={44} />
      </g>
      {/* car roof silhouette at the bottom */}
      <SketchShape id="car" points={[[-20, H + 10], [-20, 1790], [200, 1700], [540, 1655], [880, 1700], [1100, 1790], [1100, H + 10]]} seed="car" fill="#050508" hatch="#4a5a8a" gap={16} hatchOpacity={0.4} width={5} />
      <SketchLine seed="carh" width={4} color="#8a9ac8" points={[[220, 1720], [540, 1680], [860, 1720]]} />
    </Stage>
  );
};
