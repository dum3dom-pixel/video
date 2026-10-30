import type React from "react";
import { random, useCurrentFrame } from "remotion";

// Perspective street: eye line (horizon) at y=900, vanishing point in the middle.
const VPX = 540;
const VPY = 900;
const FOC = 1000;
const GROUND = 0.9; // ground plane, in units below the eye line
const sx = (X: number, d: number) => VPX + (X * FOC) / d;
const sy = (Y: number, d: number) => VPY + (Y * FOC) / d;
const P = (X: number, Y: number, d: number) => `${sx(X, d).toFixed(1)},${sy(Y, d).toFixed(1)}`;
const quad = (X: number, y0: number, y1: number, d0: number, d1: number) =>
  `${P(X, y0, d0)} ${P(X, y0, d1)} ${P(X, y1, d1)} ${P(X, y1, d0)}`;

const HAZE: readonly [number, number, number] = [188, 194, 200];
const hex = (c: string): [number, number, number] => [
  parseInt(c.slice(1, 3), 16),
  parseInt(c.slice(3, 5), 16),
  parseInt(c.slice(5, 7), 16),
];
// Colour fades toward the haze colour with distance; shade < 1 darkens.
const tint = (c: string, d: number, shade: number) => {
  const k = Math.min(0.75, d / 26);
  const [r, g, b] = hex(c).map((v, i) => Math.round((v * shade) * (1 - k) + HAZE[i] * k));
  return `rgb(${r},${g},${b})`;
};

type Seg = readonly [number, number, number, string]; // z0, z1, roof height (negative = up), colour
const LEFT: readonly Seg[] = [
  [0.1, 1.6, -2.3, "#c9b995"],
  [1.6, 3.4, -3.1, "#b7b2a4"],
  [3.4, 5.6, -2.5, "#c3a57c"],
  [5.6, 9, -3.4, "#aeb4b8"],
  [9, 14, -2.7, "#cdbd9f"],
  [14, 24, -3.0, "#c7a899"],
  [24, 80, -2.4, "#b7b2a4"],
];
const RIGHT: readonly Seg[] = [
  [0.1, 2.2, -2.9, "#aeb4b8"],
  [2.2, 4.2, -2.4, "#cdbd9f"],
  [4.2, 7, -3.2, "#c7a899"],
  [7, 10.5, -2.6, "#c3a57c"],
  [10.5, 16, -3.3, "#b7b2a4"],
  [16, 28, -2.5, "#c9b995"],
  [28, 80, -2.8, "#aeb4b8"],
];
const FLOOR = 0.7;
const AWNINGS = ["#6e2a2a", "#2f4a3c", "#3a4660", "#7a5a2a"];

const Side: React.FC<{ segs: readonly Seg[]; X: number; cam: number; lit: number; seed: string }> = ({
  segs,
  X,
  cam,
  lit,
  seed,
}) => (
  <g>
    {segs.map(([z0, z1, roof, col], si) => {
      const d0 = Math.max(0.5, z0 + cam);
      const d1 = z1 + cam;
      if (d1 <= 0.5) return null;
      const dm = (d0 + Math.min(d1, 40)) / 2;
      const bay = z0 < 9 ? 0.6 : z0 < 24 ? 1.4 : 3.5;
      const bays: React.ReactNode[] = [];
      for (let k = Math.ceil(z0 / bay); k * bay + bay <= z1 && bays.length < 40; k++) {
        const za = k * bay + bay * 0.2 + cam;
        const zb = k * bay + bay * 0.8 + cam;
        if (zb < 0.5) continue;
        const da = Math.max(0.5, za);
        const rnd = random(`${seed}-${si}-${k}`);
        const wCol = tint(rnd > 0.82 ? "#d9b46a" : rnd > 0.4 ? "#3d4752" : "#566370", dm, lit);
        const frameCol = tint("#e6dcc6", dm, lit);
        for (let f = 0; f < 5; f++) {
          const yB = GROUND - FLOOR * (f + 1);
          const yT = yB - FLOOR;
          // ground floor = shop front, upper floors = windows
          if (f === 0) {
            bays.push(
              <g key={`${k}-s`}>
                <polygon points={quad(X, yB - 0.55, yB - 0.05, da, zb)} fill={tint("#3b2e28", dm, lit)} />
                <polygon points={quad(X, yB - 0.6, yB - 0.46, da, zb)} fill={tint(AWNINGS[(k + si) % 4], dm, lit)} />
              </g>,
            );
          } else {
            bays.push(
              <g key={`${k}-${f}`}>
                <polygon points={quad(X, yT + 0.12, yB - 0.08, da, zb)} fill={frameCol} />
                <polygon points={quad(X, yT + 0.17, yB - 0.13, da + 0.03, zb - 0.03)} fill={wCol} />
              </g>,
            );
          }
        }
      }
      const cornTop = roof;
      return (
        <g key={si}>
          <polygon points={quad(X, roof, GROUND, d0, d1)} fill={tint(col, dm, lit)} />
          {/* floor bands */}
          {[1, 2, 3, 4].map((f) => (
            <polygon
              key={f}
              points={quad(X, GROUND - FLOOR * f - 0.03, GROUND - FLOOR * f + 0.03, d0, d1)}
              fill="rgba(60,50,40,0.25)"
            />
          ))}
          {bays}
          {/* cornice + shadow under it */}
          <polygon points={quad(X, cornTop - 0.08, cornTop + 0.14, d0, d1)} fill={tint("#e2d8c2", dm, lit)} />
          <polygon points={quad(X, cornTop + 0.14, cornTop + 0.26, d0, d1)} fill="rgba(40,36,34,0.3)" />
          {/* dark edge where the building ends */}
          <polygon points={quad(X, roof, GROUND, d0, d0 + 0.04 * d0)} fill="rgba(30,26,24,0.35)" />
        </g>
      );
    })}
  </g>
);

const Tower: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="s-brick" x1={0} y1={0} x2={1} y2={0}>
        <stop offset={0} stopColor="#b25a46" />
        <stop offset={0.55} stopColor="#8e3f31" />
        <stop offset={1} stopColor="#5a261e" />
      </linearGradient>
      <linearGradient id="s-spire" x1={0} y1={0} x2={1} y2={0}>
        <stop offset={0} stopColor="#4d6e5c" />
        <stop offset={0.5} stopColor="#2f4a3c" />
        <stop offset={1} stopColor="#1a2a22" />
      </linearGradient>
      <pattern id="s-bricks" width={16} height={9} patternUnits="userSpaceOnUse">
        <path d="M0,0 H16 M0,4.5 H16 M4,0 V4.5 M12,4.5 V9" stroke="rgba(50,16,12,0.35)" strokeWidth={1} fill="none" />
      </pattern>
    </defs>
    {/* shaft */}
    <rect x={302} y={300} width={126} height={460} fill="url(#s-brick)" />
    <rect x={302} y={300} width={126} height={460} fill="url(#s-bricks)" />
    {[380, 470, 560].map((y) => (
      <path key={y} d={`M345,${y + 50} V${y + 12} Q365,${y - 6} 385,${y + 12} V${y + 50} Z`} fill="#2c1a18" />
    ))}
    <circle cx={365} cy={346} r={26} fill="#e8dfc8" stroke="#4a3228" strokeWidth={3} />
    <path d="M365,346 V328 M365,346 L378,352" stroke="#2a1a14" strokeWidth={3} />
    <path d="M296,292 H434 V308 H296 Z" fill="#d6c7a8" />
    <path d="M296,308 H434" stroke="rgba(40,24,18,0.4)" strokeWidth={4} />
    {/* belfry */}
    <rect x={314} y={236} width={102} height={58} fill="url(#s-brick)" />
    {[330, 354, 378].map((x) => (
      <path key={x} d={`M${x},290 V258 Q${x + 11},244 ${x + 22},258 V290 Z`} fill="#241513" />
    ))}
    {/* spire */}
    <path d="M308,238 H422 L414,252 H316 Z" fill="#3b3a36" />
    <path d="M318,238 L365,62 L412,238 Z" fill="url(#s-spire)" />
    <path d="M365,62 L412,238 L392,238 Z" fill="rgba(0,0,0,0.28)" />
    {[110, 150, 190].map((y) => (
      <path key={y} d={`M${365 - (y - 62) * 0.27},${y} H${365 + (y - 62) * 0.27}`} stroke="rgba(10,20,16,0.45)" strokeWidth={2} />
    ))}
    <path d="M345,200 L358,174 L371,200 Z" fill="#1d2e26" />
    <path d="M365,62 V30 M356,42 H374" stroke="#cdb464" strokeWidth={3} />
    <circle cx={365} cy={58} r={4} fill="#cdb464" />
  </g>
);

const PASSERS: readonly { X: number; d: number; col: string }[] = [
  { X: -0.75, d: 5, col: "#3b3f4a" },
  { X: 0.55, d: 4.6, col: "#5a4a44" },
  { X: 0.95, d: 5.6, col: "#2e3238" },
  { X: -1.15, d: 6.6, col: "#6a6460" },
  { X: 0.15, d: 9, col: "#40444c" },
  { X: -0.3, d: 12, col: "#555a62" },
];

const Passers: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <g filter="url(#s-blur8)">
      {PASSERS.map((p, i) => {
        const x = sx(p.X, p.d + (frame / 90) * 0.4) + Math.sin(frame * 0.2 + i * 2) * 1.5;
        const dd = p.d + (frame / 90) * 0.4;
        const y = sy(GROUND, dd) - Math.abs(Math.sin(frame * 0.22 + i)) * 3;
        const hh = FOC / dd;
        return (
          <g key={i} transform={`translate(${x},${y})`}>
            <ellipse cx={0} cy={-hh * 0.93} rx={hh * 0.09} ry={hh * 0.11} fill="#8a6a58" />
            <path
              d={`M${-hh * 0.15},${-hh * 0.82} Q0,${-hh * 0.88} ${hh * 0.15},${-hh * 0.82} L${hh * 0.17},${-hh * 0.4} L${hh * 0.13},0 H${-hh * 0.13} L${-hh * 0.17},${-hh * 0.4} Z`}
              fill={p.col}
            />
          </g>
        );
      })}
    </g>
  );
};

export const Street: React.FC<{ cam: number }> = ({ cam }) => {
  const frame = useCurrentFrame();
  // Far layers move less than near ones (camera dolly back).
  const farS = 1.03 - (frame / 90) * 0.03;
  const midS = 1.06 - (frame / 90) * 0.08;
  const rails = (X: number) => `${P(X - 0.025, GROUND, 0.5)} ${P(X - 0.025, GROUND, 60)} ${P(X + 0.025, GROUND, 60)} ${P(X + 0.025, GROUND, 0.5)}`;
  const joints: number[] = [];
  for (let k = 0; k < 60; k++) joints.push(((k * 0.7 + cam) % 42) + 0.5);
  return (
    <g>
      <defs>
        {[3, 4, 8].map((b) => (
          <filter key={b} id={`s-blur${b}`} x={-400} y={-400} width={1880} height={2800} filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation={b} />
          </filter>
        ))}
        <linearGradient id="s-sky" x1={0} y1={0} x2={0} y2={1}>
          <stop offset={0} stopColor="#6f7e90" />
          <stop offset={0.5} stopColor="#9aa6b3" />
          <stop offset={1} stopColor="#cfd0cb" />
        </linearGradient>
        <linearGradient id="s-ground" x1={0} y1={0} x2={0} y2={1}>
          <stop offset={0} stopColor="#b2b3b0" />
          <stop offset={0.25} stopColor="#7e7f84" />
          <stop offset={1} stopColor="#3a3a40" />
        </linearGradient>
        <linearGradient id="s-walk" x1={0} y1={0} x2={0} y2={1}>
          <stop offset={0} stopColor="#c8c4ba" />
          <stop offset={1} stopColor="#7d7a74" />
        </linearGradient>
        <linearGradient id="s-sheen" x1={0} y1={0} x2={0} y2={1}>
          <stop offset={0} stopColor="rgba(235,240,250,0)" />
          <stop offset={0.18} stopColor="rgba(235,240,250,0.32)" />
          <stop offset={0.6} stopColor="rgba(235,240,250,0.1)" />
          <stop offset={1} stopColor="rgba(235,240,250,0)" />
        </linearGradient>
        <radialGradient id="s-haze" cx={0.5} cy={0.5} r={0.5}>
          <stop offset={0} stopColor="rgba(222,222,215,0.7)" />
          <stop offset={1} stopColor="rgba(222,222,215,0)" />
        </radialGradient>
      </defs>

      {/* sky and clouds */}
      <g filter="url(#s-blur8)" transform={`translate(${VPX} ${VPY}) scale(${farS}) translate(${-VPX} ${-VPY})`}>
        <rect x={-200} y={-300} width={1480} height={1250} fill="url(#s-sky)" />
        <ellipse cx={420} cy={140} rx={380} ry={60} fill="rgba(235,238,244,0.35)" />
        <ellipse cx={760} cy={260} rx={320} ry={50} fill="rgba(70,82,98,0.3)" />
        <ellipse cx={300} cy={420} rx={300} ry={44} fill="rgba(235,238,244,0.3)" />
        <ellipse cx={880} cy={90} rx={260} ry={40} fill="rgba(225,230,238,0.35)" />
        <ellipse cx={540} cy={640} rx={420} ry={60} fill="rgba(225,225,222,0.35)" />
        <ellipse cx={600} cy={30} rx={400} ry={70} fill="rgba(60,72,88,0.25)" />
      </g>

      {/* brick tower with a green spire */}
      <g filter="url(#s-blur4)" opacity={0.92} transform={`translate(${VPX} ${VPY}) scale(${farS}) translate(${-VPX} ${-VPY})`}>
        <Tower />
        <rect x={290} y={30} width={150} height={730} fill="rgba(185,192,200,0.28)" />
      </g>

      {/* street frontage, slightly out of focus */}
      <g filter="url(#s-blur3)" transform={`translate(${VPX} ${VPY}) scale(${midS}) translate(${-VPX} ${-VPY})`}>
        <Side segs={LEFT} X={-1.4} cam={cam} lit={0.82} seed="L" />
        <Side segs={RIGHT} X={1.4} cam={cam} lit={1} seed="R" />

        {/* road, pavements, rails, wet sheen */}
        <rect x={-400} y={VPY} width={1880} height={1100} fill="url(#s-ground)" />
        <polygon points={`${P(-1.4, GROUND, 0.5)} ${P(-1.4, GROUND, 60)} ${P(-0.95, GROUND, 60)} ${P(-0.95, GROUND, 0.5)}`} fill="url(#s-walk)" />
        <polygon points={`${P(1.4, GROUND, 0.5)} ${P(1.4, GROUND, 60)} ${P(0.95, GROUND, 60)} ${P(0.95, GROUND, 0.5)}`} fill="url(#s-walk)" />
        <polygon points={`${P(-0.95, GROUND, 0.5)} ${P(-0.95, GROUND, 60)} ${P(-0.9, GROUND, 60)} ${P(-0.9, GROUND, 0.5)}`} fill="rgba(235,232,224,0.7)" />
        <polygon points={`${P(0.95, GROUND, 0.5)} ${P(0.95, GROUND, 60)} ${P(0.9, GROUND, 60)} ${P(0.9, GROUND, 0.5)}`} fill="rgba(235,232,224,0.7)" />
        {joints.map((d, i) => (
          <g key={i}>
            <path d={`M${sx(-1.4, d)},${sy(GROUND, d)} L${sx(-0.95, d)},${sy(GROUND, d)}`} stroke="rgba(70,66,60,0.35)" strokeWidth={1 + 8 / d} />
            <path d={`M${sx(1.4, d)},${sy(GROUND, d)} L${sx(0.95, d)},${sy(GROUND, d)}`} stroke="rgba(70,66,60,0.35)" strokeWidth={1 + 8 / d} />
          </g>
        ))}
        <polygon points={rails(-0.3)} fill="rgba(150,155,162,0.45)" />
        <polygon points={rails(0.3)} fill="rgba(150,155,162,0.45)" />
        <polygon points={`${P(-0.5, GROUND, 0.5)} ${P(-0.5, GROUND, 60)} ${P(0.5, GROUND, 60)} ${P(0.5, GROUND, 0.5)}`} fill="url(#s-sheen)" />
        <ellipse cx={VPX} cy={VPY + 12} rx={520} ry={150} fill="url(#s-haze)" />
        <rect x={-400} y={VPY - 70} width={1880} height={90} fill="rgba(205,208,206,0.22)" />
      </g>

      <Passers />
    </g>
  );
};
