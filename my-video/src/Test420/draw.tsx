import React from "react";
import { loadFont } from "@remotion/google-fonts/Neucha";
import { useCurrentFrame } from "remotion";

export const W = 1920;
export const H = 804; // 2,39:1 как у референса
export const FLOOR = 690;
export const INK = "#1c1c1c";
export const PAPER = "#ffffff";

export const hand = loadFont("normal", { subsets: ["cyrillic", "latin"] }).fontFamily;

export const rnd = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** Тонкая дрожащая линия + пылинки, как в референсе. */
export const Paper: React.FC<{ children: React.ReactNode; specks?: number }> = ({ children, specks = 90 }) => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 4) % 6;
  const r = rnd(11);
  const dots = Array.from({ length: specks }, () => ({ x: r() * W, y: r() * H, l: r() < 0.25 ? 4 + r() * 6 : 0, a: r() * 3 }));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ position: "absolute" }}>
      <defs>
        <filter id="rough" x="-3%" y="-3%" width="106%" height="106%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed={seed} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3.6" />
        </filter>
      </defs>
      <rect width={W} height={H} fill={PAPER} />
      <g stroke={INK} strokeWidth={1.4} fill={INK} opacity={0.75}>
        {dots.map((d, i) =>
          d.l ? (
            <path key={i} d={`M${d.x} ${d.y} l${d.l} ${-d.a}`} fill="none" />
          ) : (
            <circle key={i} cx={d.x} cy={d.y} r={0.9 + d.a * 0.4} stroke="none" />
          ),
        )}
      </g>
      <g filter="url(#rough)" stroke={INK} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" fill="none">
        {children}
      </g>
    </svg>
  );
};

export const T: React.FC<{
  x: number;
  y: number;
  size?: number;
  rot?: number;
  anchor?: "start" | "middle" | "end";
  o?: number;
  children: React.ReactNode;
}> = ({ x, y, size = 60, rot = 0, anchor = "middle", o = 1, children }) => (
  <text
    x={x}
    y={y}
    fontFamily={hand}
    fontSize={size}
    fill={INK}
    stroke="none"
    textAnchor={anchor}
    opacity={o}
    transform={`rotate(${rot} ${x} ${y})`}
  >
    {children}
  </text>
);

/** Колбаска-конечность с обводкой. */
const Limb: React.FC<{ d: string; r?: number }> = ({ d, r = 15 }) => (
  <>
    <path d={d} stroke={INK} strokeWidth={r * 2 + 6.4} />
    <path d={d} stroke={PAPER} strokeWidth={r * 2} />
  </>
);

type Pose = [number, number];
type BlobProps = {
  x: number;
  y?: number;
  s?: number;
  flip?: boolean;
  talk?: boolean;
  mouth?: "smile" | "open" | "o" | "flat" | "grin";
  eyes?: "dots" | "wide" | "closed" | "up";
  brow?: "none" | "angry" | "sad" | "raised";
  hair?: "none" | "tuft" | "grey" | "bun";
  glasses?: boolean;
  la?: Pose;
  ra?: Pose;
  seed?: number;
  bob?: boolean;
  cane?: boolean;
  pencil?: boolean;
};

export const Blob: React.FC<BlobProps> = ({
  x,
  y = FLOOR,
  s = 1,
  flip,
  talk,
  mouth = "smile",
  eyes = "dots",
  brow = "none",
  hair = "none",
  glasses,
  la = [-34, 76],
  ra = [34, 76],
  seed = 0,
  bob,
  cane,
  pencil,
}) => {
  const f = useCurrentFrame();
  const dy = bob ? Math.sin((f + seed * 9) / 7) * 3 : 0;
  const blink = (f + seed * 17) % 100 < 4;
  const arm = (sx: number, p: Pose, side: number) => {
    const ex = sx + p[0];
    const ey = -140 + p[1];
    return `M${sx} -140 Q${sx + p[0] / 2 + side * 16} ${-140 + p[1] / 2 + 8} ${ex} ${ey}`;
  };
  const k = Math.floor((f + seed * 2) / 3) % 4;
  const ry = [3, 11, 6, 13][k];
  let mouthEl: React.ReactNode;
  if (talk) mouthEl = <ellipse cx={0} cy={-190} rx={13} ry={ry} fill={INK} />;
  else if (mouth === "smile") mouthEl = <path d="M-18 -196 Q0 -174 18 -196" />;
  else if (mouth === "grin") mouthEl = <path d="M-22 -198 Q0 -166 22 -198 Z" fill={PAPER} />;
  else if (mouth === "open") mouthEl = <ellipse cx={0} cy={-188} rx={14} ry={16} fill={INK} />;
  else if (mouth === "o") mouthEl = <circle cx={0} cy={-190} r={8} />;
  else mouthEl = <path d="M-14 -192 H14" />;
  const eyeEl = (ex: number) => {
    if (eyes === "closed" || blink) return <path d={`M${ex - 8} -222 Q${ex} -216 ${ex + 8} -222`} />;
    if (eyes === "wide") return <circle cx={ex} cy={-224} r={9} fill={PAPER} />;
    if (eyes === "up") return <circle cx={ex + 3} cy={-228} r={4.5} fill={INK} />;
    return <circle cx={ex} cy={-222} r={4.8} fill={INK} />;
  };
  return (
    <g transform={`translate(${x} ${y + dy}) scale(${flip ? -s : s} ${s})`}>
      {cane && <path d="M92 -10 L92 -110 Q92 -128 108 -128" strokeWidth={5} />}
      <ellipse cx={-28} cy={4} rx={28} ry={11} fill={PAPER} />
      <ellipse cx={28} cy={4} rx={28} ry={11} fill={PAPER} />
      <path d="M-62 0 C-80 -70 -64 -135 -38 -160 L38 -160 C64 -135 80 -70 62 0 Q0 14 -62 0 Z" fill={PAPER} />
      <Limb d={arm(-50, la, -1)} />
      <Limb d={arm(50, ra, 1)} />
      <circle cx={0} cy={-215} r={58} fill={PAPER} />
      {hair === "tuft" && <path d="M-18 -270 q-12 -22 6 -28 M0 -274 q2 -28 18 -22 M20 -268 q18 -16 24 -2" />}
      {hair === "grey" && (
        <path d="M-44 -246 l-16 -12 M-34 -262 l-14 -18 M-14 -272 l-8 -22 M10 -273 l4 -22 M32 -266 l14 -18 M46 -252 l18 -10" strokeWidth={2.6} />
      )}
      {hair === "bun" && <circle cx={0} cy={-290} r={20} fill={PAPER} />}
      {pencil && <path d="M46 -250 l34 -22" strokeWidth={6} />}
      {brow === "angry" && <path d="M-32 -240 L-10 -232 M32 -240 L10 -232" />}
      {brow === "sad" && <path d="M-32 -232 L-10 -240 M32 -232 L10 -240" />}
      {brow === "raised" && <path d="M-32 -242 Q-20 -250 -8 -242 M10 -236 Q20 -240 30 -236" />}
      {eyeEl(-20)}
      {eyeEl(20)}
      {glasses && (
        <>
          <circle cx={-20} cy={-222} r={17} />
          <circle cx={20} cy={-222} r={17} />
          <path d="M-3 -222 H3" />
        </>
      )}
      {mouthEl}
    </g>
  );
};

export const Floor: React.FC<{ y?: number }> = ({ y = FLOOR + 16 }) => <path d={`M0 ${y} H${W} M0 ${y + 14} H${W}`} strokeWidth={2.4} />;

export const Ceiling: React.FC = () => (
  <g strokeWidth={2.6}>
    <path d="M0 52 H540 M600 52 H1180 M1250 52 H1920" />
    <path d="M0 76 H1920" />
  </g>
);

export const Door: React.FC<{ x: number; w?: number; h?: number }> = ({ x, w = 250, h = 380 }) => {
  const y = FLOOR + 16 - h;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={PAPER} />
      <rect x={x + 18} y={y + 18} width={w - 36} height={h - 18} />
      <path d={`M${x + 18} ${y + 70} h-12 M${x + 18} ${y + h - 90} h-12`} strokeWidth={6} />
      <circle cx={x + w - 50} cy={y + h / 2 + 20} r={14} />
    </g>
  );
};

export const Clock: React.FC<{ x: number; y: number; r?: number; t?: number }> = ({ x, y, r = 56, t = 0 }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill={PAPER} />
    <circle cx={x} cy={y} r={r - 7} strokeWidth={1.6} />
    {Array.from({ length: 12 }, (_, i) => {
      const a = (i * Math.PI) / 6;
      return <path key={i} d={`M${x + Math.sin(a) * (r - 14)} ${y - Math.cos(a) * (r - 14)} L${x + Math.sin(a) * (r - 8)} ${y - Math.cos(a) * (r - 8)}`} strokeWidth={2} />;
    })}
    <path d={`M${x} ${y} L${x + Math.sin((t * Math.PI) / 180) * (r - 18)} ${y - Math.cos((t * Math.PI) / 180) * (r - 18)}`} />
    <path d={`M${x} ${y} L${x + Math.sin(((t / 12) * Math.PI) / 180) * (r - 32)} ${y - Math.cos(((t / 12) * Math.PI) / 180) * (r - 32)}`} strokeWidth={4.4} />
  </g>
);

export const Win: React.FC<{ x: number; y: number; w?: number; h?: number; sky?: "none" | "sun" | "moon" }> = ({ x, y, w = 360, h = 330, sky = "none" }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill={PAPER} />
    <rect x={x + 14} y={y + 14} width={w - 28} height={h - 28} strokeWidth={2} />
    <path d={`M${x + w / 2} ${y + 14} V${y + h - 14} M${x + 14} ${y + h / 2} H${x + w - 14}`} />
    {sky === "sun" && (
      <g strokeWidth={2.6}>
        <circle cx={x + w * 0.3} cy={y + h * 0.3} r={34} />
        {Array.from({ length: 10 }, (_, i) => {
          const a = (i * Math.PI) / 5;
          const cx = x + w * 0.3;
          const cy = y + h * 0.3;
          return <path key={i} d={`M${cx + Math.cos(a) * 46} ${cy + Math.sin(a) * 46} l${Math.cos(a) * 18} ${Math.sin(a) * 18}`} />;
        })}
      </g>
    )}
    {sky === "moon" && (
      <g>
        <path d={`M${x + w * 0.28} ${y + h * 0.18} a36 36 0 1 0 30 56 a30 30 0 0 1 -30 -56 Z`} fill={PAPER} />
        {[[0.7, 0.2], [0.78, 0.38], [0.56, 0.12], [0.86, 0.14]].map(([a, b], i) => (
          <path key={i} d={`M${x + w * a - 6} ${y + h * b} h12 M${x + w * a} ${y + h * b - 6} v12`} strokeWidth={2.2} />
        ))}
      </g>
    )}
    <path d={`M${x - 28} ${y - 10} Q${x + 22} ${y + h / 2} ${x - 28} ${y + h + 6} M${x + w + 28} ${y - 10} Q${x + w - 22} ${y + h / 2} ${x + w + 28} ${y + h + 6}`} strokeWidth={4} />
    <path d={`M${x - 14} ${y + h + 14} H${x + w + 14}`} strokeWidth={5} />
  </g>
);

export const Table: React.FC<{ x: number; top: number; w: number }> = ({ x, top, w }) => (
  <g>
    <rect x={x} y={top} width={w} height={22} fill={PAPER} />
    <path d={`M${x + 30} ${top + 22} V${FLOOR + 16} M${x + w - 30} ${top + 22} V${FLOOR + 16}`} strokeWidth={4} />
    <path d={`M${x + 30} ${top + 70} H${x + w - 30}`} strokeWidth={2} />
  </g>
);

export const Lamp: React.FC<{ x: number; y: number; on?: boolean }> = ({ x, y, on }) => (
  <g>
    <path d={`M${x - 36} ${y} H${x + 36}`} />
    <path d={`M${x} ${y} V${y - 70}`} />
    <path d={`M${x - 40} ${y - 70} L${x - 22} ${y - 128} H${x + 22} L${x + 40} ${y - 70} Z`} fill={PAPER} />
    {on && <path d={`M${x - 60} ${y - 40} l-26 8 M${x + 60} ${y - 40} l26 8 M${x} ${y - 146} v-26 M${x - 48} ${y - 134} l-18 -16 M${x + 48} ${y - 134} l18 -16`} strokeWidth={2.4} />}
  </g>
);

export const Cup: React.FC<{ x: number; y: number; f?: number }> = ({ x, y, f = 0 }) => (
  <g>
    <path d={`M${x - 26} ${y - 46} V${y - 6} Q${x - 26} ${y} ${x - 18} ${y} H${x + 18} Q${x + 26} ${y} ${x + 26} ${y - 6} V${y - 46} Z`} fill={PAPER} />
    <path d={`M${x + 26} ${y - 38} Q${x + 48} ${y - 36} ${x + 26} ${y - 14}`} />
    <path d={`M${x - 8} ${y - 58} q-8 -12 0 -22 q8 -10 0 -20 M${x + 8} ${y - 58} q-8 -12 0 -22 q8 -10 0 -20`} strokeWidth={2} transform={`translate(0 ${Math.sin(f / 5) * 3})`} />
  </g>
);

export const Fridge: React.FC<{ x: number; h?: number }> = ({ x, h = 470 }) => {
  const y = FLOOR + 16 - h;
  return (
    <g>
      <rect x={x} y={y} width={190} height={h} fill={PAPER} />
      <path d={`M${x} ${y + h * 0.34} H${x + 190}`} />
      <path d={`M${x + 22} ${y + 28} v70 M${x + 22} ${y + h * 0.34 + 24} v90`} strokeWidth={6} />
      <rect x={x + 90} y={y + h * 0.5} width={44} height={56} strokeWidth={2} />
      <circle cx={x + 150} cy={y + h * 0.62} r={10} />
    </g>
  );
};

export const Shelf: React.FC<{ x: number; y: number; w: number; rows: number; rowH?: number; seed?: number }> = ({ x, y, w, rows, rowH = 170, seed = 3 }) => {
  const r = rnd(seed);
  const out: React.ReactNode[] = [];
  for (let row = 0; row < rows; row++) {
    const base = y + (row + 1) * rowH;
    let cx = x + 14;
    let i = 0;
    while (cx < x + w - 50) {
      const bw = 20 + r() * 20;
      const bh = 100 + r() * (rowH - 120);
      const lean = r() < 0.08;
      out.push(
        <g key={`${row}-${i++}`} transform={lean ? `rotate(7 ${cx + bw} ${base})` : undefined}>
          <rect x={cx} y={base - bh} width={bw} height={bh} fill={PAPER} />
          <path d={`M${cx} ${base - bh + 16} h${bw} M${cx} ${base - 16} h${bw}`} strokeWidth={1.8} />
          {r() < 0.4 && <path d={`M${cx + bw / 2} ${base - bh + 34} v${bh * 0.3}`} strokeWidth={1.8} />}
        </g>,
      );
      cx += bw + 3;
    }
    out.push(<path key={`b${row}`} d={`M${x} ${base} H${x + w}`} strokeWidth={5} />);
  }
  return (
    <g>
      <rect x={x - 10} y={y} width={w + 20} height={rows * rowH + 4} fill="none" strokeWidth={4} />
      {out}
    </g>
  );
};

export const Calendar: React.FC<{ x: number; y: number; w?: number; h?: number; label?: string; seed?: number }> = ({ x, y, w = 150, h = 170, label, seed = 1 }) => {
  const r = rnd(seed);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={PAPER} />
      <path d={`M${x} ${y + 34} H${x + w}`} />
      <path d={`M${x + w * 0.25} ${y - 8} v16 M${x + w * 0.75} ${y - 8} v16`} strokeWidth={5} />
      {label && <T x={x + w / 2} y={y + 28} size={26}>{label}</T>}
      {Array.from({ length: 5 }, (_, row) =>
        Array.from({ length: 7 }, (_, c) => (r() < 0.9 ? <circle key={`${row}${c}`} cx={x + 14 + c * ((w - 28) / 6)} cy={y + 56 + row * ((h - 76) / 4)} r={2.6} fill={INK} stroke="none" /> : null)),
      )}
    </g>
  );
};

export const Bubble: React.FC<{ x: number; y: number; text: string; s?: number; o?: number; fs?: number; tail?: number }> = ({ x, y, text, s = 1, o = 1, fs = 34, tail = 1 }) => {
  const w = Math.max(70, text.length * fs * 0.5 + 46);
  return (
    <g opacity={o} transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse rx={w / 2} ry={fs * 0.95} fill={PAPER} />
      {tail !== 0 && <path d={`M${-w / 6} ${fs * 0.86} l${-14 * tail} 30 l34 -22`} fill={PAPER} />}
      <T x={0} y={fs * 0.34} size={fs}>{text}</T>
    </g>
  );
};

export const Calc: React.FC<{ x: number; y: number; w?: number; display: string }> = ({ x, y, w = 260, display }) => {
  const h = w * 1.35;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={16} fill={PAPER} />
      <rect x={x + 18} y={y + 18} width={w - 36} height={h * 0.2} fill={PAPER} />
      <T x={x + w - 28} y={y + 18 + h * 0.15} size={h * 0.13} anchor="end">{display}</T>
      {Array.from({ length: 4 }, (_, row) =>
        Array.from({ length: 4 }, (_, c) => <rect key={`${row}${c}`} x={x + 20 + c * ((w - 40) / 4)} y={y + h * 0.34 + row * (h * 0.15)} width={(w - 40) / 4 - 10} height={h * 0.15 - 12} rx={6} strokeWidth={2.4} />),
      )}
    </g>
  );
};

export const Notebook: React.FC<{ x: number; y: number; w?: number; h?: number; lines?: number }> = ({ x, y, w = 300, h = 190, lines = 5 }) => (
  <g>
    <path d={`M${x} ${y + h} L${x + 16} ${y} H${x + w} L${x + w - 16} ${y + h} Z`} fill={PAPER} />
    {Array.from({ length: lines }, (_, i) => (
      <path key={i} d={`M${x + 34 + i * 3} ${y + 32 + i * 28} q40 -10 70 0 t70 0 t60 0`} strokeWidth={2.2} />
    ))}
  </g>
);

export const Phone: React.FC<{ x: number; y: number; rot?: number }> = ({ x, y, rot = 0 }) => (
  <g transform={`rotate(${rot} ${x} ${y})`}>
    <rect x={x - 12} y={y - 38} width={24} height={76} rx={10} fill={PAPER} />
    <circle cx={x} cy={y - 24} r={3} fill={INK} />
    <path d={`M${x - 6} ${y + 20} h12`} />
  </g>
);

export const Book: React.FC<{ x: number; y: number; w: number; h: number; title?: string }> = ({ x, y, w, h, title }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill={PAPER} />
    <path d={`M${x + 16} ${y} V${y + h} M${x} ${y + h * 0.12} H${x + w} M${x} ${y + h * 0.88} H${x + w}`} strokeWidth={2} />
    {title && <T x={x + w / 2 + 6} y={y + h * 0.55} size={Math.min(h * 0.34, w * 0.16)}>{title}</T>}
  </g>
);
