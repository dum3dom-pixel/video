// Общие детали ЧБ-роликов: лист, заголовок, человечек, штамп и др. Вынесено из piter-bw/shots.tsx 10.11.2026,
// piter-bw реэкспортирует всё отсюда, так что старые импорты `from '../piter-bw/shots'` работают как раньше.
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { backOut, clamp, easeInOut, easeOut, lerp } from '../engine/anim';
import { BlobProps, Clock, Cloud, INK, PAPER, hand, rnd } from '../lines/kit';

// «Принцип Питера»: вертикальный ЧБ 1080×1920. Подача с заголовком-плашкой на кадр, рисунок сложнее: сцены на всю высоту, толпы, линии дорисовываются, чёрная заливка вместо цвета.
export const W = 1080;
export const H = 1920;
export const G = 1570; // линия земли

/** Лист под вертикаль. hit: кадр удара, на нём сцена вздрагивает. */
export const Sheet: React.FC<{ children: React.ReactNode; hit?: number; seed?: number }> = ({ children, hit, seed = 3 }) => {
  const t = useCurrentFrame();
  const r = rnd(seed);
  const dots = Array.from({ length: 170 }, () => ({ x: r() * W, y: r() * H, l: r() < 0.25 ? 4 + r() * 7 : 0, a: r() * 3 }));
  const zoom = 1 + clamp(t / 120) * 0.025;
  const since = hit === undefined ? -1 : t - hit;
  const dy = since >= 0 && since < 8 ? Math.sin(since * 2.4) * (8 - since) * 2 : 0;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ position: 'absolute' }}>
      <defs>
        <filter id="v-rough" x="-3%" y="-3%" width="106%" height="106%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed={Math.floor(t / 4) % 6} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3.4" />
        </filter>
      </defs>
      <rect width={W} height={H} fill={PAPER} />
      <g stroke={INK} strokeWidth={1.4} fill={INK} opacity={0.75}>
        {dots.map((d, i) => (d.l ? <path key={i} d={`M${d.x} ${d.y} l${d.l} ${-d.a}`} fill="none" /> : <circle key={i} cx={d.x} cy={d.y} r={0.9 + d.a * 0.4} stroke="none" />))}
      </g>
      <g filter="url(#v-rough)" stroke={INK} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <g transform={`translate(${W / 2} ${H / 2 + dy}) scale(${zoom}) translate(${-W / 2} ${-H / 2})`}>{children}</g>
      </g>
    </svg>
  );
};

export const Tx: React.FC<{ x: number; y: number; size?: number; rot?: number; anchor?: 'start' | 'middle' | 'end'; fill?: string; bold?: number; children: React.ReactNode }> = ({
  x, y, size = 48, rot = 0, anchor = 'middle', fill = INK, bold = 0, children,
}) => (
  <text x={x} y={y} fontFamily={hand} fontSize={size} fill={fill} stroke={bold ? fill : 'none'} strokeWidth={bold} textAnchor={anchor} transform={`rotate(${rot} ${x} ${y})`}>
    {children}
  </text>
);

/** Заголовок-плашка: одна мысль на кадр, читается без звука; подчёркивание дорисовывается. */
export const Head: React.FC<{ lines: string[]; t: number; y?: number }> = ({ lines, t, y = 215 }) => {
  const max = Math.max(...lines.map((l) => l.length));
  const fs = Math.min(116, Math.floor(1720 / max));
  const step = fs * 1.14;
  const lastY = y + (lines.length - 1) * step;
  const w = Math.min(900, max * fs * 0.56);
  const p = clamp((t - 2) / 14);
  return (
    <g>
      {lines.map((l, i) => <Tx key={i} x={W / 2} y={y + i * step} size={fs} bold={2.4}>{l}</Tx>)}
      {p > 0 && <path d={`M${W / 2 - w / 2} ${lastY + 30} q${w / 8} -12 ${w / 4} 0 t${w / 4} 0 t${w / 4} 0 t${w / 4} 0`} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} strokeWidth={4} />}
    </g>
  );
};

export const Draw: React.FC<{ d: string; t: number; at?: number; n?: number; strokeWidth?: number }> = ({ d, t, at = 0, n = 12, strokeWidth }) => {
  const p = clamp((t - at) / n);
  if (p <= 0) return null;
  return <path d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} strokeWidth={strokeWidth} />;
};

export const Pop: React.FC<{ x: number; y: number; t: number; at?: number; n?: number; children: React.ReactNode }> = ({ x, y, t, at = 0, n = 9, children }) => {
  if (t < at) return null;
  const s = backOut(clamp((t - at) / n));
  return <g transform={`translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})`}>{children}</g>;
};

export const Ground: React.FC<{ y?: number; seed?: number; hatch?: boolean }> = ({ y = G, seed = 5, hatch = true }) => {
  const r = rnd(seed);
  return (
    <g strokeWidth={2.4}>
      <path d={`M0 ${y} H${W} M0 ${y + 14} H${W}`} />
      {hatch && Array.from({ length: 46 }, (_, i) => {
        const x = r() * W;
        const yy = y + 36 + r() * 280;
        return <path key={i} d={`M${x} ${yy} l${16 + r() * 34} ${-3 + r() * 6}`} strokeWidth={1.8} />;
      })}
    </g>
  );
};

/** Штамп со шлепком. */
export const Stamp: React.FC<{ x: number; y: number; text: string; t: number; at: number; rot?: number; size?: number }> = ({ x, y, text, t, at, rot = -7, size = 92 }) => {
  if (t < at) return null;
  const s = lerp(1.9, 1, easeOut(clamp((t - at) / 5)));
  const w = text.length * size * 0.56 + 70;
  const h = size * 1.5;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} fill={INK} />
      <rect x={-w / 2 + 10} y={-h / 2 + 10} width={w - 20} height={h - 20} stroke={PAPER} strokeWidth={3} />
      <Tx x={0} y={size * 0.34} size={size} fill={PAPER} bold={1.6}>{text}</Tx>
    </g>
  );
};

export const Tie: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M-13 -158 L13 -158 L7 -136 L18 -72 L0 -50 L-18 -72 L-7 -136 Z" fill={INK} />
);

export const HEAD_Y = -227;
export const HEAD_R = 46;
export const TORSO =
  'M-22 -188 C-26 -168 -40 -164 -42 -146 C-46 -110 -48 -60 -46 -18 Q-45 0 -26 0 Q-10 0 -8 -14 L-3 -40 Q0 -46 3 -40 L8 -14 Q10 0 26 0 Q45 0 46 -18 C48 -60 46 -110 42 -146 C40 -164 26 -168 22 -188 Z';

/** Человечек одним контуром: голова, шея, тело и руки сливаются в общий силуэт, линия одной толщины при любом масштабе. */
export const Man: React.FC<BlobProps> = ({ x, y = G, s = 1, flip, mouth = 'smile', eyes = 'dots', brow = 'none', hair = 'none', la = [-30, 78], ra = [30, 78], seed = 0, bob }) => {
  const f = useCurrentFrame();
  const dy = bob ? Math.sin((f + seed * 9) / 7) * 3 : 0;
  const blink = (f + seed * 17) % 100 < 4;
  const lw = 3.6 / s;
  const R = 10.5;
  const SH = -150;
  const fx = 3;
  const arms = ([[-36, la, -1], [36, ra, 1]] as [number, [number, number], number][]).map(([sx, p, side]) => ({
    d: `M${sx} ${SH} Q${sx + p[0] / 2 + side * 14} ${SH + p[1] / 2 + 6} ${sx + p[0]} ${SH + p[1]}`,
    front: Math.abs(sx + p[0]) < 46, // кисть внутри силуэта: такая рука рисуется поверх тела своим контуром
  }));
  const back = arms.filter((a) => !a.front);
  const front = arms.filter((a) => a.front);
  const eye = (ex: number) => {
    if (eyes === 'closed' || blink) return <path d={`M${ex - 6} -232 Q${ex} -227 ${ex + 6} -232`} />;
    if (eyes === 'wide') return <g><circle cx={ex} cy={-233} r={7.5} fill={PAPER} /><circle cx={ex} cy={-233} r={1.8} fill={INK} /></g>;
    if (eyes === 'up') return <circle cx={ex + 2} cy={-238} r={3.4} fill={INK} stroke="none" />;
    return <circle cx={ex} cy={-233} r={3.4} fill={INK} stroke="none" />;
  };
  let mouthEl: React.ReactNode;
  if (mouth === 'smile') mouthEl = <path d={`M${fx - 9} -209 Q${fx} -200 ${fx + 9} -209`} />;
  else if (mouth === 'grin') mouthEl = <path d={`M${fx - 13} -212 Q${fx} -190 ${fx + 13} -212 Z`} fill={PAPER} />;
  else if (mouth === 'open') mouthEl = <ellipse cx={fx} cy={-205} rx={8} ry={10} fill={INK} />;
  else if (mouth === 'o') mouthEl = <circle cx={fx} cy={-205} r={5.5} />;
  else mouthEl = <path d={`M${fx - 9} -206 H${fx + 9}`} />;
  return (
    <g transform={`translate(${x} ${y + dy}) scale(${flip ? -s : s} ${s})`} strokeWidth={lw}>
      <g fill={INK} stroke={INK} strokeWidth={lw * 2}>
        <circle cy={HEAD_Y} r={HEAD_R} />
        <path d={TORSO} />
      </g>
      {back.map((a, i) => <path key={i} d={a.d} fill="none" stroke={INK} strokeWidth={R * 2 + lw * 2} />)}
      <g fill={PAPER} stroke="none">
        <circle cy={HEAD_Y} r={HEAD_R} />
        <path d={TORSO} />
      </g>
      {back.map((a, i) => <path key={i} d={a.d} fill="none" stroke={PAPER} strokeWidth={R * 2} />)}
      {front.map((a, i) => (
        <g key={i} fill="none">
          <path d={a.d} stroke={INK} strokeWidth={R * 2 + lw * 2} />
          <path d={a.d} stroke={PAPER} strokeWidth={R * 2} />
        </g>
      ))}
      {hair === 'tuft' && <path d="M-12 -271 q-8 -18 5 -22 M0 -273 q2 -22 14 -18 M14 -269 q14 -12 18 -2" />}
      {brow === 'angry' && <path d={`M${fx - 24} -250 L${fx - 7} -243 M${fx + 24} -250 L${fx + 7} -243`} />}
      {brow === 'sad' && <path d={`M${fx - 24} -243 L${fx - 7} -250 M${fx + 24} -243 L${fx + 7} -250`} />}
      {brow === 'raised' && <path d={`M${fx - 24} -250 Q${fx - 15} -256 ${fx - 6} -250 M${fx + 7} -246 Q${fx + 15} -250 ${fx + 23} -246`} />}
      {eye(fx - 13)}
      {eye(fx + 13)}
      {mouthEl}
    </g>
  );
};

export const Boss: React.FC<BlobProps> = (p) => (
  <g>
    <Man {...p} />
    <Tie x={p.x} y={p.y ?? G} s={p.s} />
  </g>
);

export const Specs: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} strokeWidth={3 / s}>
    <circle cx={-10} cy={-233} r={13.5} />
    <circle cx={16} cy={-233} r={13.5} />
    <path d="M3.5 -233 H2.5" />
  </g>
);

export const Tash: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M3 -214 Q-11 -223 -27 -209 Q-11 -207 3 -209 Q17 -207 33 -209 Q17 -223 3 -214 Z" fill={INK} />
);

export const Car: React.FC<{ x: number; y: number; s?: number; flip?: boolean }> = ({ x, y, s = 1, flip }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <path d="M-172 -36 Q-174 -78 -132 -86 L-94 -92 L-54 -142 H52 L98 -92 L150 -84 Q178 -78 176 -36 Z" fill={PAPER} />
    <path d="M-44 -132 L-78 -94 H-6 V-132 Z M6 -132 V-94 H80 L46 -132 Z" strokeWidth={2.4} />
    <path d="M152 -66 h20 M-168 -62 h16" strokeWidth={5} />
    {[-104, 108].map((w) => (
      <g key={w}>
        <circle cx={w} cy={-30} r={32} fill={PAPER} />
        <circle cx={w} cy={-30} r={12} />
      </g>
    ))}
  </g>
);

export const Gear: React.FC<{ x: number; y: number; r: number; a: number; n?: number }> = ({ x, y, r, a, n = 10 }) => {
  const pts = Array.from({ length: n * 4 }, (_, i) => {
    const q = (i / (n * 4)) * Math.PI * 2;
    const rr = i % 4 < 2 ? r * 1.2 : r;
    return `${Math.cos(q) * rr} ${Math.sin(q) * rr}`;
  });
  return (
    <g transform={`translate(${x} ${y}) rotate(${a})`}>
      <path d={`M${pts.join(' L')} Z`} fill={PAPER} />
      <circle r={r * 0.34} />
    </g>
  );
};

export const Wrench: React.FC<{ x: number; y: number; a: number; s?: number }> = ({ x, y, a, s = 1 }) => (
  <path transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`} d="M0 0 L0 -84 M-17 -112 L-17 -92 Q0 -74 17 -92 L17 -112" strokeWidth={8} />
);

export const Smoke: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => (
  <g strokeWidth={2.6}>
    {[0, 1, 2].map((i) => {
      const u = ((t * 1.6 + i * 34) % 100) / 100;
      return <path key={i} opacity={1 - u} d={`M${x + Math.sin(u * 7) * 8} ${y - u * 130} q-16 -16 0 -32 t0 -32`} />;
    })}
  </g>
);

export const Confetti: React.FC<{ t: number; at?: number; seed?: number; top?: number; n?: number }> = ({ t, at = 0, seed = 8, top = 380, n = 46 }) => {
  if (t < at) return null;
  const r = rnd(seed);
  return (
    <g strokeWidth={2.4}>
      {Array.from({ length: n }, (_, i) => {
        const x = r() * W;
        const v = 12 + r() * 16;
        const d = r() * 300;
        const a = r() * 360 + (t - at) * 14;
        const ink = r() < 0.5;
        const y = top - d + (t - at) * v;
        if (y > G - 10) return null;
        return <rect key={i} x={-9} y={-6} width={18} height={12} fill={ink ? INK : PAPER} transform={`translate(${x} ${y}) rotate(${a})`} />;
      })}
    </g>
  );
};

export const Check: React.FC<{ x: number; y: number; t: number; at: number; s?: number }> = ({ x, y, t, at, s = 1 }) => (
  <Draw t={t} at={at} n={6} strokeWidth={6} d={`M${x} ${y} l${14 * s} ${16 * s} l${30 * s} ${-40 * s}`} />
);
