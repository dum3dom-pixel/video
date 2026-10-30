import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { ellipsePoints, InkScale, SketchShape } from "../../BallCity/sketch";
import { Character, Hand } from "../Character";
import { H, Stage, W } from "../Extras";

// Out-of-focus feast: plates, bottles and glasses in warm colours.
const Bokeh: React.FC = () => (
  <>
    {[[110, 260, 190, "#e8a23a"], [980, 330, 150, "#c9552a"], [90, 1480, 170, "#d9822b"], [1000, 1250, 180, "#e8c15a"], [880, 120, 110, "#fff1b0"]].map(([x, y, r, c], i) => (
      <SketchShape key={i} id={`bk${i}`} points={ellipsePoints(Number(x), Number(y), Number(r), Number(r) * 0.8, 20)} seed={`bk${i}`} fill={String(c)} hatch="#fff3c4" gap={14} hatchOpacity={0.5} width={3} passes={1} fillOpacity={0.7} />
    ))}
    <SketchShape id="bt1" points={[[40, 700], [130, 700], [140, 1000], [30, 1000]]} seed="bt1" fill="#6a3a1a" hatch="#e8a23a" gap={12} hatchOpacity={0.5} width={3} passes={1} fillOpacity={0.8} />
    <SketchShape id="bt2" points={[[960, 620], [1050, 620], [1060, 960], [950, 960]]} seed="bt2" fill="#4a5a2a" hatch="#e8c15a" gap={12} hatchOpacity={0.5} width={3} passes={1} fillOpacity={0.8} />
  </>
);

export const Scene3Feast: React.FC = () => {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [0, 19], [1, 1.07]);
  const wob = Math.sin(frame * 0.9) * 9;
  return (
    <Stage bg="#f6d06a">
      <SketchShape id="warm" points={[[0, 0], [W, 0], [W, H], [0, H]]} seed="warm" fill="#f6d06a" hatch="#d4a017" gap={22} hatchOpacity={0.35} outline={false} />
      <g transform={`translate(540 960) scale(${push}) translate(-540 -960)`}>
        <Bokeh />
        <Character outfit="leather" expression="talk" goldChain goldTooth legs={false} armL={{ a: 12, b: -4 }} armR={{ a: 12, b: -4 }} glints={{ tooth: [3, 10, 16], chain: [7] }} headTilt={Math.sin(frame * 0.8) * 3} x={540} y={2290} scale={4.4} />
        {/* foreground ringed hand, big and a little wide-angle */}
        <InkScale.Provider value={1 / Math.sqrt(4.6)}>
          <g transform={`translate(${790 + wob} 1640) rotate(${198 + wob * 1.2}) scale(4.6)`}>
            <SketchShape id="fsleeve" points={[[-42, -20], [42, -20], [60, -420], [-60, -420]]} seed="fsleeve" fill="#2a2a30" hatch="#6a6a78" gap={11} hatchOpacity={0.35} width={4} />
            <Hand uid="fg" rings bling={1.25} glints={[4, 9, 14]} />
          </g>
        </InkScale.Provider>
      </g>
      <rect width={W} height={H} fill="#ffcf4a" opacity={0.12} />
    </Stage>
  );
};
