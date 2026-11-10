import React from 'react';
import { Clock, INK, PAPER, hand, rnd } from './kit';

// Окружение для вертикальных ЧБ-роликов 1080×1920 (линия земли G = 1570), тот же язык, что у Sheet: контур, белая заливка перекрывает то, что за ним.
// Все предметы стоят основанием в (x, y=G), масштаб s. Глубина как у референса: дальний план тоньше и бледнее (far), средний обычный, ближний чуть жирнее.
// Сцена собирается из <Backdrop kind="street|yard|office"> под героями или из отдельных предметов.
export const ENV_W = 1080;
export const ENV_G = 1570;

const Tx: React.FC<{ x: number; y: number; size: number; children: React.ReactNode; anchor?: 'start' | 'middle' | 'end' }> = ({ x, y, size, children, anchor = 'middle' }) => (
  <text x={x} y={y} fontFamily={hand} fontSize={size} fill={INK} stroke="none" textAnchor={anchor}>{children}</text>
);

/** Окно: рама, переплёт, подоконник; lit штрихуется (свет горит), kind 2 это стекло с бликом. */
const Win: React.FC<{ x: number; y: number; w: number; h: number; lit?: boolean; kind?: 0 | 1 | 2; sw?: number }> = ({ x, y, w, h, lit, kind = 0, sw = 2.4 }) => (
  <g strokeWidth={sw}>
    <rect x={x} y={y} width={w} height={h} fill={PAPER} />
    {kind === 0 && <path d={`M${x + w / 2} ${y} V${y + h} M${x} ${y + h * 0.42} H${x + w}`} strokeWidth={sw * 0.7} />}
    {kind === 1 && <path d={`M${x + w / 2} ${y} V${y + h}`} strokeWidth={sw * 0.7} />}
    {kind === 2 && <path d={`M${x + 6} ${y + h * 0.72} L${x + w * 0.5} ${y + 6} M${x + w * 0.3} ${y + h * 0.8} L${x + w * 0.62} ${y + h * 0.3}`} strokeWidth={sw * 0.55} />}
    {lit && [0, 1, 2, 3].map((i) => <path key={i} d={`M${x + w * 0.1} ${y + h * (0.32 + 0.17 * i)} l${w * 0.3} ${-h * 0.16}`} strokeWidth={1.3} />)}
    <path d={`M${x - 5} ${y + h + 4} H${x + w + 5}`} />
  </g>
);

/** Панельная многоэтажка: швы между панелями, окна с балконами, подъезд с козырьком и ступенями, антенна. */
export const Block: React.FC<{ x: number; y?: number; w?: number; floors?: number; cols?: number; s?: number; seed?: number; antenna?: boolean; sw?: number }> = ({
  x, y = ENV_G, w = 300, floors = 8, cols = 4, s = 1, seed = 1, antenna = true, sw = 3,
}) => {
  const r = rnd(seed);
  const fh = 84, gf = 130, h = gf + floors * fh + 18;
  const cw = w / cols, ww = cw * 0.46, wh = 50;
  const ax = w * 0.18;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} strokeWidth={sw}>
      {antenna && <path d={`M${ax} ${-h} V${-h - 76} M${ax - 24} ${-h - 56} H${ax + 24} M${ax - 15} ${-h - 36} H${ax + 15} M${-w * 0.3} ${-h} v-26 h30 v26`} strokeWidth={sw * 0.7} />}
      <rect x={-w / 2} y={-h} width={w} height={h} fill={PAPER} />
      <rect x={-w / 2 - 8} y={-h - 16} width={w + 16} height={16} fill={PAPER} />
      {Array.from({ length: floors }, (_, i) => <path key={i} d={`M${-w / 2} ${-h + 18 + i * fh} H${w / 2}`} strokeWidth={1.3} opacity={0.55} />)}
      {Array.from({ length: floors }, (_, row) =>
        Array.from({ length: cols }, (_, c) => {
          const x0 = -w / 2 + c * cw + (cw - ww) / 2, y0 = -h + 18 + row * fh + 16;
          const balcony = c % 2 === 0 && r() < 0.28;
          return (
            <g key={`${row}-${c}`}>
              <Win x={x0} y={y0} w={ww} h={wh} lit={r() < 0.2} kind={r() < 0.5 ? 0 : 1} />
              {balcony && <path d={`M${x0 - 12} ${y0 + wh + 6} v20 h${ww + 24} v-20 M${x0 - 12 + (ww + 24) / 3} ${y0 + wh + 6} v20 M${x0 - 12 + (2 * (ww + 24)) / 3} ${y0 + wh + 6} v20`} strokeWidth={2} />}
            </g>
          );
        }),
      )}
      {[-1, 1].map((k) => <Win key={k} x={k * (w * 0.3) - 24} y={-100} w={48} h={40} kind={1} />)}
      <path d={`M-58 -112 H58 L48 -98 H-48 Z`} fill={PAPER} />
      <rect x={-34} y={-96} width={68} height={96} fill={PAPER} />
      <path d={`M0 -96 V0 M-22 -70 h10 M12 -70 h10`} strokeWidth={2} />
      <path d={`M-50 0 V-8 H50 V0`} strokeWidth={2.4} />
    </g>
  );
};

/** Стеклянная башня: частая сетка, блики, рубка на крыше, двойные двери. */
export const Office: React.FC<{ x: number; y?: number; w?: number; floors?: number; s?: number; seed?: number; sw?: number }> = ({ x, y = ENV_G, w = 260, floors = 11, s = 1, seed = 2, sw = 3 }) => {
  const r = rnd(seed);
  const fh = 62, h = floors * fh + 110;
  const n = Math.round(w / 26);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} strokeWidth={sw}>
      <rect x={-w * 0.22} y={-h - 44} width={w * 0.44} height={44} fill={PAPER} />
      <path d={`M${w * 0.1} ${-h - 44} V${-h - 110} M${w * 0.1 - 16} ${-h - 90} H${w * 0.1 + 16}`} strokeWidth={sw * 0.7} />
      <rect x={-w / 2} y={-h} width={w} height={h} fill={PAPER} />
      {Array.from({ length: n - 1 }, (_, i) => <path key={i} d={`M${-w / 2 + ((i + 1) * w) / n} ${-h} V${-110}`} strokeWidth={1.3} opacity={0.6} />)}
      {Array.from({ length: floors }, (_, i) => <path key={i} d={`M${-w / 2} ${-h + (i + 1) * fh - 12} H${w / 2}`} strokeWidth={1.3} opacity={0.6} />)}
      {Array.from({ length: 12 }, (_, i) => {
        const gx = -w / 2 + 8 + r() * (w - 60), gy = -h + 10 + r() * (h - 190);
        return <path key={i} d={`M${gx} ${gy + 28} l22 -28 M${gx + 8} ${gy + 30} l16 -20`} strokeWidth={1.4} />;
      })}
      <path d={`M${-w / 2} -110 H${w / 2}`} strokeWidth={2} />
      <path d={`M-52 -96 H52 V0 H-52 Z M0 -96 V0 M-52 -48 H52`} fill={PAPER} strokeWidth={2.4} />
      <path d={`M-72 -112 H72 V-100 H-72 Z`} fill={PAPER} strokeWidth={2.4} />
    </g>
  );
};

/** Частный дом: двускатная крыша с черепицей, труба с дымом, ставни, крыльцо, чердачное окно. */
export const House: React.FC<{ x: number; y?: number; w?: number; s?: number; t?: number; sw?: number }> = ({ x, y = ENV_G, w = 380, s = 1, t, sw = 3 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} strokeWidth={sw}>
    <rect x={w * 0.2} y={-340} width={46} height={110} fill={PAPER} />
    <path d={`M${w * 0.2 - 6} -340 H${w * 0.2 + 52}`} strokeWidth={sw * 1.2} />
    {t !== undefined && [0, 1, 2].map((i) => {
      const u = ((t * 1.4 + i * 34) % 100) / 100;
      return <path key={i} opacity={1 - u} strokeWidth={2.4} d={`M${w * 0.2 + 23 + Math.sin(u * 7) * 9} ${-356 - u * 130} q-15 -14 0 -28 t0 -28`} />;
    })}
    <rect x={-w / 2} y={-200} width={w} height={200} fill={PAPER} />
    <path d={`M${-w / 2 - 34} -200 L0 -350 L${w / 2 + 34} -200 Z`} fill={PAPER} />
    {[1, 2, 3, 4].map((k) => {
      const half = (w / 2 + 34) * (1 - (k * 30) / 150);
      return <path key={k} d={`M${-half} ${-200 - k * 30} H${half}`} strokeWidth={1.8} strokeDasharray="30 14" opacity={0.75} />;
    })}
    <circle cx={0} cy={-262} r={26} fill={PAPER} />
    <path d={`M0 -288 V-236 M-26 -262 H26`} strokeWidth={sw * 0.6} />
    {[-1, 1].map((k) => (
      <g key={k}>
        <Win x={k * 112 - 36} y={-160} w={72} h={72} kind={0} lit={k > 0} />
        <path d={`M${k * 112 - 72} -164 h26 v80 h-26 Z M${k * 112 + 46} -164 h26 v80 h-26 Z`} fill={PAPER} strokeWidth={2.2} />
        <path d={`M${k * 112 - 66} -150 h14 M${k * 112 - 66} -134 h14 M${k * 112 - 66} -118 h14 M${k * 112 - 66} -102 h14 M${k * 112 + 52} -150 h14 M${k * 112 + 52} -134 h14 M${k * 112 + 52} -118 h14 M${k * 112 + 52} -102 h14`} strokeWidth={1.4} />
      </g>
    ))}
    <rect x={-32} y={-124} width={64} height={124} fill={PAPER} />
    <path d={`M0 -124 V0 M20 -62 h8`} strokeWidth={2.2} />
    <path d={`M-46 0 V-10 H46 V0 M-60 0 V-5 H60`} strokeWidth={2.2} />
    <path d={`M${-w / 2} -16 H${w / 2}`} strokeWidth={1.6} opacity={0.6} />
  </g>
);

/** Магазин: полосатый тент, вывеска, витрина, дверь со стеклом. */
export const Shop: React.FC<{ x: number; y?: number; w?: number; s?: number; sign?: string; sw?: number }> = ({ x, y = ENV_G, w = 380, s = 1, sign = 'МАГАЗИН', sw = 3 }) => {
  const n = 8, d = w / n;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} strokeWidth={sw}>
      <rect x={-w / 2} y={-290} width={w} height={290} fill={PAPER} />
      <rect x={-w / 2 + 30} y={-330} width={w - 60} height={54} fill={PAPER} />
      <Tx x={0} y={-290} size={42}>{sign}</Tx>
      {Array.from({ length: n }, (_, i) => {
        const a = -w / 2 + i * d;
        return <path key={i} d={`M${a} -250 H${a + d} L${a + d + 4} -200 q${-d / 2} 20 ${-d} 0 Z`} fill={i % 2 ? PAPER : INK} strokeWidth={2.4} />;
      })}
      <Win x={-w / 2 + 28} y={-170} w={w * 0.5} h={110} kind={2} />
      <rect x={w * 0.2} y={-172} width={w * 0.24} height={172} fill={PAPER} />
      <path d={`M${w * 0.2 + 12} -156 h${w * 0.24 - 24} v70 h-${w * 0.24 - 24} Z M${w * 0.2 + w * 0.24 - 14} -70 v14`} strokeWidth={2.2} />
      <path d={`M${-w / 2 + 40} -40 h50 M${-w / 2 + 110} -40 h30`} strokeWidth={2} />
    </g>
  );
};

/** Дерево: round это ствол-палка с развилкой и кроной-облаком, bare это голые ветки-палки, pine это ёлка. */
export const Tree: React.FC<{ x: number; y?: number; s?: number; kind?: 'round' | 'bare' | 'pine'; seed?: number; sw?: number }> = ({ x, y = ENV_G, s = 1, kind = 'round', seed = 1, sw = 3 }) => {
  const r = rnd(seed);
  if (kind === 'bare') {
    const seg: string[][] = [[], [], [], [], [], []];
    const grow = (px: number, py: number, a: number, len: number, d: number) => {
      if (d > 5) return;
      const x2 = px + Math.sin(a) * len, y2 = py - Math.cos(a) * len;
      seg[d].push(`M${px} ${py} L${x2} ${y2}`);
      const n = d < 2 ? 2 : r() < 0.35 ? 3 : 2;
      for (let k = 0; k < n; k++) grow(x2, y2, a + (k - (n - 1) / 2) * (0.5 + r() * 0.25) + (r() - 0.5) * 0.2, len * (0.72 + r() * 0.1), d + 1);
    };
    grow(0, 0, 0, 170, 0);
    const ws = [10, 6.5, 4.4, 3, 2.2, 1.6];
    return (
      <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinecap="round">
        {seg.map((p, i) => <path key={i} d={p.join(' ')} strokeWidth={ws[i]} />)}
        <path d="M-26 0 q26 -14 52 0" strokeWidth={2.4} />
      </g>
    );
  }
  if (kind === 'pine') {
    return (
      <g transform={`translate(${x} ${y}) scale(${s})`} strokeWidth={sw}>
        <path d="M-10 0 V-60 M10 0 V-60" />
        {[0, 1, 2, 3].map((i) => {
          const base = -50 - i * 78, wd = 150 - i * 30, top = base - 118 + i * 14;
          return <path key={i} d={`M${-wd} ${base} L${-wd * 0.5} ${base - 16} L${-wd * 0.62} ${base - 34} L0 ${top} L${wd * 0.62} ${base - 34} L${wd * 0.5} ${base - 16} L${wd} ${base} Q0 ${base + 22} ${-wd} ${base} Z`} fill={PAPER} strokeLinejoin="round" />;
        })}
        <path d="M-18 -140 l14 -8 M12 -210 l12 -8 M-12 -270 l10 -6" strokeWidth={1.6} />
      </g>
    );
  }
  const N = 13, cy = -330, rx = 125, ry = 104;
  let d = '';
  for (let i = 0; i < N; i++) {
    const a0 = (i / N) * Math.PI * 2, a1 = ((i + 1) / N) * Math.PI * 2, am = (a0 + a1) / 2;
    const p0 = [Math.cos(a0) * rx, cy + Math.sin(a0) * ry], p1 = [Math.cos(a1) * rx, cy + Math.sin(a1) * ry];
    const c = [Math.cos(am) * rx * 1.22 + (r() - 0.5) * 8, cy + Math.sin(am) * ry * 1.22 + (r() - 0.5) * 8];
    d += `${i === 0 ? `M${p0[0]} ${p0[1]} ` : ''}Q${c[0]} ${c[1]} ${p1[0]} ${p1[1]} `;
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} strokeWidth={sw} strokeLinecap="round">
      <path d="M-20 0 C-18 -80 -12 -150 -9 -240 M20 0 C16 -80 12 -140 9 -240" />
      <path d="M-34 0 q34 -16 68 0" strokeWidth={2.4} />
      <path d={`${d}Z`} fill={PAPER} />
      <path d="M0 -226 L-62 -330 M2 -240 L14 -372 M6 -230 L72 -316 M-30 -290 L-70 -350" strokeWidth={2.4} />
      {Array.from({ length: 16 }, (_, i) => {
        const lx = (r() - 0.5) * rx * 1.5, ly = cy + (r() - 0.5) * ry * 1.4;
        return <path key={i} d={`M${lx} ${ly} q9 -12 20 -2`} strokeWidth={1.6} />;
      })}
    </g>
  );
};

/** Забор. pickets: штакетник с острыми концами; sticks: кривые колья с проволокой. */
export const Fence: React.FC<{ x1: number; x2: number; y?: number; h?: number; kind?: 'pickets' | 'sticks'; seed?: number; sw?: number }> = ({ x1, x2, y = ENV_G, h = 118, kind = 'pickets', seed = 4, sw = 3 }) => {
  const r = rnd(seed);
  const gap = kind === 'pickets' ? 36 : 44;
  const xs: number[] = [];
  for (let px = x1; px <= x2; px += gap) xs.push(px);
  return (
    <g transform={`translate(0 ${y})`} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {kind === 'pickets' ? (
        <>
          <path d={`M${x1} ${-h * 0.28} H${x2} M${x1} ${-h * 0.74} H${x2}`} strokeWidth={4} />
          {xs.map((px) => <path key={px} d={`M${px} 0 V${-h + 16} L${px + 11} ${-h} L${px + 22} ${-h + 16} V0 Z`} fill={PAPER} strokeWidth={2.6} />)}
        </>
      ) : (
        <>
          <path d={`M${x1} ${-h * 0.4} Q${(x1 + x2) / 2} ${-h * 0.25} ${x2} ${-h * 0.4} M${x1} ${-h * 0.8} Q${(x1 + x2) / 2} ${-h * 0.62} ${x2} ${-h * 0.8}`} strokeWidth={1.6} />
          {xs.map((px) => {
            const hh = h * (0.8 + r() * 0.4), tilt = (r() - 0.5) * 14;
            return <path key={px} d={`M${px} 0 L${px + tilt} ${-hh}`} strokeWidth={5 + r() * 2.5} />;
          })}
        </>
      )}
    </g>
  );
};

/** Фонарь: столб с двойной линией, рука, плафон, световой конус штрихами. */
export const Lamp: React.FC<{ x: number; y?: number; s?: number; lit?: boolean; flip?: boolean; sw?: number }> = ({ x, y = ENV_G, s = 1, lit = true, flip, sw = 3 }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`} strokeWidth={sw}>
    <path d="M-7 0 V-390 M7 0 V-390" />
    <path d="M-22 0 L-12 -40 H12 L22 0 Z M-14 -40 V-48 H14 V-40" fill={PAPER} strokeWidth={2.4} />
    <path d="M-7 -390 Q-7 -440 40 -440 H92 M7 -378 Q7 -420 40 -420 H92" />
    <path d="M70 -440 H116 L104 -416 H82 Z" fill={PAPER} />
    {lit && [0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${86 + i * 6} -410 L${86 + (i - 2) * 46} -120`} strokeWidth={1.4} strokeDasharray="22 16" opacity={0.55} />)}
  </g>
);

export const Bench: React.FC<{ x: number; y?: number; s?: number; sw?: number }> = ({ x, y = ENV_G, s = 1, sw = 3 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} strokeWidth={sw}>
    <path d="M-110 -92 H110 M-110 -118 H110 M-110 -144 H110 M-104 -144 V-70 M104 -144 V-70" />
    <path d="M-120 -64 H120 V-48 H-120 Z" fill={PAPER} />
    <path d="M-92 -48 V0 M92 -48 V0" strokeWidth={sw * 1.4} />
  </g>
);

export const Bush: React.FC<{ x: number; y?: number; w?: number; s?: number; seed?: number; sw?: number }> = ({ x, y = ENV_G, w = 190, s = 1, seed = 7, sw = 3 }) => {
  const r = rnd(seed);
  const n = Math.max(3, Math.round(w / 52));
  let d = `M${-w / 2} 0 L${-w / 2} -16 `;
  for (let i = 0; i < n; i++) {
    const a = -w / 2 + (i * w) / n, b = -w / 2 + ((i + 1) * w) / n;
    d += `Q${(a + b) / 2} ${-84 - r() * 44} ${b} -16 `;
  }
  d += `L${w / 2} 0 Z`;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} strokeWidth={sw} strokeLinecap="round">
      <path d={d} fill={PAPER} strokeLinejoin="round" />
      {Array.from({ length: 10 }, (_, i) => {
        const lx = -w * 0.36 + r() * w * 0.72, ly = -26 - r() * 40;
        return <path key={i} d={`M${lx} ${ly} q8 -10 18 -2`} strokeWidth={1.6} />;
      })}
    </g>
  );
};

/** Пучки травы вдоль земли. */
export const Tufts: React.FC<{ y?: number; n?: number; seed?: number; from?: number; to?: number }> = ({ y = ENV_G, n = 18, seed = 9, from = 0, to = ENV_W }) => {
  const r = rnd(seed);
  return (
    <g strokeWidth={2.2} strokeLinecap="round">
      {Array.from({ length: n }, (_, i) => {
        const x = from + r() * (to - from), h = 14 + r() * 16;
        return <path key={i} d={`M${x - 8} ${y} L${x - 6} ${y - h} M${x} ${y} L${x} ${y - h - 6} M${x + 8} ${y} L${x + 6} ${y - h}`} />;
      })}
    </g>
  );
};

export const Bin: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = ENV_G, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} strokeWidth={3}>
    <path d="M-34 -96 L-28 0 H28 L34 -96 Z" fill={PAPER} />
    <path d="M-40 -96 H40 M-12 -96 V-106 H12 V-96 M-14 -76 L-12 -12 M0 -76 V-12 M14 -76 L12 -12" strokeWidth={2} />
  </g>
);

export const Hydrant: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = ENV_G, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} strokeWidth={3}>
    <path d="M-24 0 V-70 Q-24 -96 0 -96 Q24 -96 24 -70 V0 Z" fill={PAPER} />
    <path d="M-34 -40 H34 V-26 H-34 Z M-30 -70 H30 M-10 -96 V-108 H10 V-96" fill={PAPER} strokeWidth={2.4} />
  </g>
);

/** Дорожный знак на столбе. */
export const Sign: React.FC<{ x: number; y?: number; s?: number; kind?: 'stop' | 'round' | 'tri' }> = ({ x, y = ENV_G, s = 1, kind = 'round' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} strokeWidth={3}>
    <path d="M0 0 V-300" strokeWidth={6} />
    {kind === 'tri' ? <path d="M0 -380 L50 -296 H-50 Z" fill={PAPER} strokeLinejoin="round" /> : <circle cx={0} cy={-340} r={46} fill={PAPER} />}
    {kind === 'round' && <path d="M-26 -340 H26" strokeWidth={8} />}
    {kind === 'tri' && <path d="M0 -352 V-322 M0 -312 V-310" strokeWidth={6} />}
    {kind === 'stop' && <Tx x={0} y={-326} size={28}>STOP</Tx>}
  </g>
);

export const Sun: React.FC<{ x: number; y: number; r?: number; t?: number }> = ({ x, y, r = 52, t = 0 }) => (
  <g strokeWidth={3} strokeLinecap="round">
    <circle cx={x} cy={y} r={r} fill={PAPER} />
    {Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2 + t * 0.01, in_ = r + 16, out = r + (i % 2 ? 30 : 42);
      return <path key={i} d={`M${x + Math.cos(a) * in_} ${y + Math.sin(a) * in_} L${x + Math.cos(a) * out} ${y + Math.sin(a) * out}`} />;
    })}
  </g>
);

export const Birds: React.FC<{ x: number; y: number; t?: number; s?: number }> = ({ x, y, t = 0, s = 1 }) => (
  <g transform={`translate(${x + (t * 1.6) % 80} ${y}) scale(${s})`} strokeWidth={2.6} strokeLinecap="round">
    {[[0, 0, 1], [70, 26, 0.8], [130, -8, 0.7]].map(([bx, by, k], i) => {
      const flap = Math.sin((t + i * 5) * 0.45) * 6;
      return <path key={i} d={`M${bx - 22 * k} ${by - 8 * k + flap} Q${bx - 10 * k} ${by - 14 * k} ${bx} ${by} Q${bx + 10 * k} ${by - 14 * k} ${bx + 22 * k} ${by - 8 * k + flap}`} />;
    })}
  </g>
);

/** Линия электропередачи поперёк кадра: столбы и провисающие провода. */
export const PowerLines: React.FC<{ y?: number; sw?: number }> = ({ y = 520, sw = 2 }) => (
  <g strokeWidth={sw} opacity={0.7}>
    {[40, 560, 1080].map((px) => <path key={px} d={`M${px} ${y - 60} V${y + 330} M${px - 40} ${y - 30} H${px + 40} M${px - 28} ${y + 10} H${px + 28}`} />)}
    {[-30, 10].map((o) => <path key={o} d={`M40 ${y + o} Q300 ${y + o + 50} 560 ${y + o} Q820 ${y + o + 50} 1080 ${y + o}`} strokeWidth={sw * 0.7} />)}
  </g>
);

/** Дальний план: ряд зданий тонкой бледной линией. */
export const Skyline: React.FC<{ y?: number; seed?: number; from?: number; to?: number; max?: number; far?: number }> = ({ y = ENV_G, seed = 3, from = -20, to = ENV_W + 20, max = 520, far = 0.5 }) => {
  const r = rnd(seed);
  const items: React.ReactNode[] = [];
  let px = from, i = 0;
  while (px < to) {
    const w = 80 + r() * 90, h = 160 + r() * (max - 160), top = r();
    const cols = Math.max(2, Math.floor(w / 28)), rows = Math.floor((h - 30) / 38);
    items.push(
      <g key={i++}>
        <rect x={px} y={-h} width={w} height={h} fill={PAPER} />
        {top < 0.3 && <path d={`M${px + w / 2} ${-h} V${-h - 50}`} />}
        {top > 0.7 && <path d={`M${px} ${-h} L${px + w / 2} ${-h - 36} L${px + w} ${-h}`} fill={PAPER} />}
        {Array.from({ length: rows }, (_, a) => Array.from({ length: cols }, (_, b) => (
          <rect key={`${a}-${b}`} x={px + 12 + b * ((w - 24) / cols)} y={-h + 20 + a * 38} width={10} height={16} strokeWidth={1.4} fill={r() < 0.18 ? INK : PAPER} />
        )))}
      </g>,
    );
    px += w + r() * 14;
  }
  return <g transform={`translate(0 ${y})`} opacity={far} strokeWidth={2}>{items}</g>;
};

/** Холмы дальним планом. */
export const Hills: React.FC<{ y?: number; far?: number }> = ({ y = ENV_G, far = 0.5 }) => (
  <g opacity={far} strokeWidth={2.2}>
    <path d={`M0 ${y - 120} Q180 ${y - 230} 380 ${y - 140} T760 ${y - 170} T1080 ${y - 110}`} />
    <path d={`M0 ${y - 60} Q260 ${y - 130} 520 ${y - 70} T1080 ${y - 80}`} strokeWidth={1.6} />
  </g>
);

/** Дорога внизу: бордюр, разметка, люк. */
export const Road: React.FC<{ y?: number }> = ({ y = ENV_G }) => (
  <g>
    <path d={`M0 ${y + 60} H${ENV_W}`} strokeWidth={2.2} />
    <path d={`M0 ${y + 176} H${ENV_W}`} strokeWidth={4} strokeDasharray="90 60" />
    <ellipse cx={780} cy={y + 110} rx={46} ry={11} strokeWidth={2.2} />
    <path d={`M742 ${y + 110} H818 M760 ${y + 104} H800 M760 ${y + 116} H800`} strokeWidth={1.4} />
  </g>
);

/** Окно в комнате с видом на город. */
const RoomWindow: React.FC<{ x: number; y: number; w: number; h: number; id: string; seed?: number }> = ({ x, y, w, h, id, seed = 5 }) => (
  <g>
    <clipPath id={id}><rect x={x + 16} y={y + 16} width={w - 32} height={h - 32} /></clipPath>
    <rect x={x} y={y} width={w} height={h} fill={PAPER} strokeWidth={4} />
    <g clipPath={`url(#${id})`}><Skyline y={y + h - 16} seed={seed} from={x} to={x + w} max={h - 60} far={0.7} /></g>
    <rect x={x + 16} y={y + 16} width={w - 32} height={h - 32} strokeWidth={2.4} />
    <path d={`M${x + w / 2} ${y + 16} V${y + h - 16} M${x + 16} ${y + h * 0.44} H${x + w - 16}`} strokeWidth={3} />
    <path d={`M${x - 16} ${y + h + 10} H${x + w + 16} V${y + h + 22} H${x - 16} Z`} fill={PAPER} strokeWidth={3} />
  </g>
);

/** Растение в горшке. */
export const Plant: React.FC<{ x: number; y?: number; s?: number; seed?: number }> = ({ x, y = ENV_G, s = 1, seed = 6 }) => {
  const r = rnd(seed);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} strokeWidth={3} strokeLinecap="round">
      {Array.from({ length: 7 }, (_, i) => {
        const a = -0.9 + i * 0.3 + (r() - 0.5) * 0.1, l = 110 + r() * 70;
        const tx = Math.sin(a) * l, ty = -50 - Math.cos(a) * l;
        return <path key={i} d={`M0 -50 Q${tx * 0.3} ${ty * 0.7} ${tx} ${ty} Q${tx * 0.6 + 14} ${ty * 0.6 + 10} 0 -50 Z`} fill={PAPER} strokeWidth={2.4} />;
      })}
      <path d="M-32 -56 H32 L24 0 H-24 Z" fill={PAPER} />
      <path d="M-34 -56 H34" strokeWidth={4} />
    </g>
  );
};

/** Картина на стене. */
export const Frame: React.FC<{ x: number; y: number; w?: number; h?: number }> = ({ x, y, w = 150, h = 110 }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill={PAPER} strokeWidth={4} />
    <rect x={x + 12} y={y + 12} width={w - 24} height={h - 24} strokeWidth={1.8} />
    <path d={`M${x + 14} ${y + h - 20} L${x + w * 0.38} ${y + h * 0.42} L${x + w * 0.58} ${y + h * 0.7} L${x + w * 0.74} ${y + h * 0.5} L${x + w - 14} ${y + h - 20}`} strokeWidth={2.2} />
    <circle cx={x + w * 0.76} cy={y + h * 0.28} r={9} strokeWidth={2} />
  </g>
);

/** Готовые задники. v меняет расстановку, чтобы соседние сцены не повторяли друг друга; t оживляет дым, птиц, солнце. */
export const Backdrop: React.FC<{ kind: 'street' | 'yard' | 'office'; v?: number; t?: number }> = ({ kind, v = 0, t = 0 }) => {
  const m = v % 2 ? -1 : 1;
  const X = (x: number) => (m > 0 ? x : ENV_W - x);
  const XW = (x: number, w: number) => (m > 0 ? x : ENV_W - x - w);
  if (kind === 'street') {
    return (
      <g>
        <Skyline seed={3 + v} y={ENV_G} max={560} />
        <Cloud2 x={X(210)} y={640} /><Cloud2 x={X(760)} y={520} s={0.8} />
        <Block x={X(70)} floors={9} cols={4} seed={1 + v} />
        <Office x={X(1010)} floors={12} seed={2 + v} />
        <Tree kind={v % 3 === 1 ? 'pine' : 'round'} x={X(285)} s={0.72} seed={3 + v} />
        <Lamp x={X(820)} flip={m < 0} s={0.95} />
        <Road />
        <Tufts n={10} seed={4 + v} />
        <Birds x={X(480)} y={560} t={t} />
      </g>
    );
  }
  if (kind === 'yard') {
    return (
      <g>
        <Hills far={0.5} />
        <Sun x={X(880)} y={520} t={t} />
        <Cloud2 x={X(150)} y={590} /><Cloud2 x={X(520)} y={470} s={0.7} />
        <House x={X(190)} s={0.95} t={t} />
        <Tree kind={v % 3 === 2 ? 'bare' : 'round'} x={X(930)} s={1.05} seed={5 + v} />
        <Fence x1={-10} x2={ENV_W + 10} kind={v % 2 ? 'sticks' : 'pickets'} h={104} seed={v + 2} />
        <Bush x={X(540)} w={170} s={0.8} seed={v + 3} />
        <Tufts n={22} seed={6 + v} />
        <Birds x={X(560)} y={600} t={t} s={0.9} />
      </g>
    );
  }
  return (
    <g>
      <path d={`M0 ${ENV_G - 40} H${ENV_W}`} strokeWidth={2.4} />
      <RoomWindow x={XW(250, 360)} y={620} w={360} h={440} id={`rw${v}`} seed={5 + v} />
      <Clock x={X(840)} y={690} r={58} hour={(10 + v) % 12 * 30} min={(v * 140) % 360} />
      <Frame x={XW(700, 170)} y={860} w={170} h={120} />
      <Plant x={X(990)} s={1} seed={6 + v} />
    </g>
  );
};

/** Облако дальнего плана: тоньше, чем kit.Cloud. */
export const Cloud2: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <path d="M0 0 H170 Q198 -2 192 -26 Q186 -50 156 -46 Q150 -84 108 -78 Q78 -72 74 -48 Q42 -56 24 -38 Q4 -16 0 0 Z" transform={`translate(${x} ${y}) scale(${s})`} fill={PAPER} strokeWidth={2.2} opacity={0.75} />
);
