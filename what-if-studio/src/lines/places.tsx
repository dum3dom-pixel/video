import React from 'react';
import { Clock, INK, PAPER, hand, rnd } from './kit';
import { Bin, Birds, Block, Bush, Bench, Cloud2, ENV_G, ENV_W, Fence, Frame, Hills, Lamp, Plant, Road, Skyline, Sun, Tree, Tufts } from './env';

// Локации для вертикальных ЧБ-роликов 1080×1920: те же правила, что в env.tsx (контур, белая заливка перекрывает то, что за ним, линия земли ENV_G).
// Сцена: <Place kind="openspace" v={0..3} t={кадр}/> после <Head/> и до <Ground/>. v меняет расстановку и зеркалит, t оживляет мелочи.
// Зоны кадра: выше y≈460 заголовок, 700–900 облачко, около 1010 штамп, герой x≈330 или справа. Плотные детали держим по краям, стену под облачком оставляем пустой.

type P = { x: number; y?: number; s?: number; seed?: number; sw?: number; flip?: boolean };
type Rnd = () => number;

const CEIL = 462; // линия потолка
const WALL = ENV_G - 40; // низ стены, предметы дальнего плана стоят на ней

const At: React.FC<P & { children: React.ReactNode }> = ({ x, y = ENV_G, s = 1, flip, sw = 3, children }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`} strokeWidth={sw}>{children}</g>
);

const Tx: React.FC<{ x: number; y: number; size: number; children: React.ReactNode; anchor?: 'start' | 'middle' | 'end' }> = ({ x, y, size, children, anchor = 'middle' }) => (
  <text x={x} y={y} fontFamily={hand} fontSize={size} fill={INK} stroke="none" textAnchor={anchor}>{children}</text>
);

/** Прямоугольник от руки: углы и середины сторон чуть гуляют. */
const rc = (r: Rnd, x: number, y: number, w: number, h: number, a = 1.5) => {
  const j = () => (r() - 0.5) * 2 * a;
  const c = [[x + j(), y + j()], [x + w + j(), y + j()], [x + w + j(), y + h + j()], [x + j(), y + h + j()]];
  const q = (p: number[], n: number[]) => `Q${(p[0] + n[0]) / 2 + j()} ${(p[1] + n[1]) / 2 + j()} ${n[0]} ${n[1]}`;
  return `M${c[0][0]} ${c[0][1]} ${q(c[0], c[1])} ${q(c[1], c[2])} ${q(c[2], c[3])} ${q(c[3], c[0])} Z`;
};

/** Линия от руки. */
const ln = (r: Rnd, x1: number, y1: number, x2: number, y2: number, a = 1.3) => {
  const j = () => (r() - 0.5) * 2 * a;
  return `M${x1} ${y1} Q${(x1 + x2) / 2 + j()} ${(y1 + y2) / 2 + j()} ${x2} ${y2}`;
};

const Far: React.FC<{ o?: number; children: React.ReactNode }> = ({ o = 0.55, children }) => <g opacity={o}>{children}</g>;

/** Пар из кружки, чайника, кофемашины. */
const Steam: React.FC<{ x: number; y: number; t?: number; n?: number; h?: number }> = ({ x, y, t, n = 2, h = 70 }) => {
  if (t === undefined) return null;
  return (
    <g strokeWidth={2}>
      {Array.from({ length: n }, (_, i) => {
        const u = ((t * 1.5 + (i * 100) / n) % 100) / 100;
        return <path key={i} opacity={(1 - u) * 0.8} d={`M${x + (i - (n - 1) / 2) * 15 + Math.sin(u * 7) * 5} ${y - u * h} q-8 -9 0 -18 t0 -18`} />;
      })}
    </g>
  );
};

/** Коробка комнаты: потолок, боковые стены в перспективе, плинтус. Всё бледное, чтобы не спорить с заголовком. */
const Shell: React.FC<{ d?: number }> = ({ d = 92 }) => (
  <g>
    <Far o={0.5}>
      <path d={`M${d} ${CEIL} H${ENV_W - d} M${d} ${CEIL} L0 ${CEIL - d} M${ENV_W - d} ${CEIL} L${ENV_W} ${CEIL - d}`} strokeWidth={2} />
      <path d={`M${d} ${CEIL} V${WALL} M${ENV_W - d} ${CEIL} V${WALL}`} strokeWidth={2} />
    </Far>
    <path d={`M${d} ${WALL} H${ENV_W - d} M${d} ${WALL} L0 ${ENV_G} M${ENV_W - d} ${WALL} L${ENV_W} ${ENV_G}`} strokeWidth={2.4} />
  </g>
);

// ——— Окна и свет ———

/** Окно с видом: город, ночь или деревья; curtain добавляет шторы на карнизе. */
export const RoomWin: React.FC<{ x: number; y: number; w: number; h: number; id: string; view?: 'city' | 'night' | 'trees'; seed?: number; curtain?: boolean; t?: number; sw?: number }> = ({
  x, y, w, h, id, view = 'city', seed = 5, curtain, t = 0, sw = 3,
}) => {
  const sway = Math.sin(t * 0.05) * 4;
  return (
    <g strokeWidth={sw}>
      <clipPath id={id}><rect x={x + 14} y={y + 14} width={w - 28} height={h - 28} /></clipPath>
      <rect x={x} y={y} width={w} height={h} fill={PAPER} />
      <g clipPath={`url(#${id})`}>
        {view === 'city' && <Skyline y={y + h - 14} seed={seed} from={x} to={x + w} max={h * 0.72} far={0.6} />}
        {view === 'night' && (
          <g>
            <Skyline y={y + h - 14} seed={seed} from={x} to={x + w} max={h * 0.5} far={0.55} />
            <path d={`M${x + w * 0.62} ${y + 44} a30 30 0 1 0 26 48 a26 26 0 0 1 -26 -48 Z`} fill={PAPER} strokeWidth={2.4} />
            {[[0.2, 0.12], [0.36, 0.2], [0.82, 0.14], [0.14, 0.3], [0.44, 0.1]].map(([a, b], i) => <path key={i} d={`M${x + w * a - 6} ${y + h * b} h12 M${x + w * a} ${y + h * b - 6} v12`} strokeWidth={1.8} />)}
          </g>
        )}
        {view === 'trees' && (
          <g opacity={0.6} strokeWidth={2.2}>
            <path d={`M${x} ${y + h * 0.72} Q${x + w * 0.3} ${y + h * 0.52} ${x + w * 0.6} ${y + h * 0.68} T${x + w} ${y + h * 0.6}`} />
            {[[0.26, 0.56, 0.15], [0.7, 0.5, 0.19]].map(([a, b, k2], i) => <g key={i}><circle cx={x + w * a} cy={y + h * b} r={Math.min(w, h) * k2} fill={PAPER} /><path d={`M${x + w * a} ${y + h * b + Math.min(w, h) * k2} V${y + h}`} /></g>)}
          </g>
        )}
      </g>
      <rect x={x + 14} y={y + 14} width={w - 28} height={h - 28} strokeWidth={sw * 0.7} />
      <path d={`M${x + w / 2} ${y + 14} V${y + h - 14} M${x + 14} ${y + h * 0.4} H${x + w - 14}`} strokeWidth={sw * 0.85} />
      <path d={`M${x - 14} ${y + h + 8} H${x + w + 14} V${y + h + 20} H${x - 14} Z`} fill={PAPER} strokeWidth={sw * 0.85} />
      {curtain && (
        <g strokeWidth={sw * 0.8}>
          <path d={`M${x - 30} ${y - 22} H${x + w + 30}`} strokeWidth={sw * 1.3} />
          <path d={`M${x - 22} ${y - 20} H${x + w * 0.2} Q${x + w * 0.1 + sway} ${y + h * 0.5} ${x + w * 0.22 + sway} ${y + h + 44} H${x - 22} Z`} fill={PAPER} />
          <path d={`M${x + w + 22} ${y - 20} H${x + w * 0.8} Q${x + w * 0.9 + sway} ${y + h * 0.5} ${x + w * 0.78 + sway} ${y + h + 44} H${x + w + 22} Z`} fill={PAPER} />
          {[0.02, 0.1].map((k) => <path key={k} d={`M${x + w * k} ${y - 16} Q${x + w * k - 5 + sway} ${y + h * 0.5} ${x + w * k + sway} ${y + h + 40}`} strokeWidth={1.4} />)}
          {[0.9, 0.98].map((k) => <path key={k} d={`M${x + w * k} ${y - 16} Q${x + w * k + 5 + sway} ${y + h * 0.5} ${x + w * k + sway} ${y + h + 40}`} strokeWidth={1.4} />)}
        </g>
      )}
    </g>
  );
};

/** Ленточное офисное окно во всю стену. */
export const RibbonWin: React.FC<{ x1: number; x2: number; y: number; h: number; id: string; n?: number; seed?: number }> = ({ x1, x2, y, h, id, n = 6, seed = 3 }) => (
  <Far o={0.6}>
    <g strokeWidth={2}>
      <clipPath id={id}><rect x={x1} y={y} width={x2 - x1} height={h} /></clipPath>
      <rect x={x1} y={y} width={x2 - x1} height={h} fill={PAPER} />
      <g clipPath={`url(#${id})`}><Skyline y={y + h} seed={seed} from={x1} to={x2} max={h * 0.8} far={0.8} /></g>
      {Array.from({ length: n + 1 }, (_, i) => <path key={i} d={`M${x1 + ((x2 - x1) * i) / n} ${y} V${y + h}`} strokeWidth={3} />)}
      <path d={`M${x1 - 8} ${y + h + 6} H${x2 + 8}`} strokeWidth={3} />
    </g>
  </Far>
);

/** Окно с жалюзи: ламели закрывают верх, снизу виден город. */
export const BlindWin: React.FC<{ x: number; y: number; w: number; h: number; id: string; seed?: number; down?: number; sw?: number }> = ({ x, y, w, h, id, seed = 8, down = 0.62, sw = 3 }) => {
  const n = Math.floor((h * down) / 17);
  return (
    <g strokeWidth={sw}>
      <clipPath id={id}><rect x={x + 10} y={y + 10} width={w - 20} height={h - 20} /></clipPath>
      <rect x={x} y={y} width={w} height={h} fill={PAPER} />
      <g clipPath={`url(#${id})`}>
        <Skyline y={y + h - 10} seed={seed} from={x} to={x + w} max={h * 0.34} far={0.55} />
        <rect x={x + 10} y={y + 10} width={w - 20} height={n * 17 + 6} fill={PAPER} stroke="none" />
      </g>
      {Array.from({ length: n }, (_, i) => <path key={i} d={`M${x + 10} ${y + 22 + i * 17} H${x + w - 10}`} strokeWidth={1.3} opacity={0.75} />)}
      <path d={`M${x - 8} ${y} H${x + w + 8} V${y + 12} H${x - 8} Z`} fill={PAPER} />
      <path d={`M${x + w - 26} ${y + 12} V${y + n * 17 + 66}`} strokeWidth={1.4} />
      <circle cx={x + w - 26} cy={y + n * 17 + 72} r={5} fill={PAPER} strokeWidth={1.6} />
      <path d={`M${x + 10} ${y + n * 17 + 18} H${x + w - 10}`} strokeWidth={sw * 0.9} />
    </g>
  );
};

/** Потолочный светильник-панель на двух подвесах. */
export const CeilLight: React.FC<{ x: number; y?: number; w?: number; t?: number; sw?: number }> = ({ x, y = CEIL, w = 210, t = 0, sw = 2.6 }) => {
  const off = Math.floor((t + x) / 9) % 17 === 0;
  return (
    <g transform={`translate(${x} ${y})`} strokeWidth={sw}>
      <path d={`M${-w * 0.32} 0 V34 M${w * 0.32} 0 V34`} strokeWidth={1.6} />
      <path d={`M${-w / 2} 34 H${w / 2} V50 H${-w / 2} Z`} fill={PAPER} />
      {!off && [-0.36, -0.12, 0.12, 0.36].map((k) => <path key={k} d={`M${w * k} 58 L${w * k * 1.2} 96`} strokeWidth={1.4} strokeDasharray="10 8" opacity={0.6} />)}
    </g>
  );
};

/** Подвесной абажур на шнуре; t качает его. */
export const Pendant: React.FC<{ x: number; y?: number; len?: number; t?: number; sw?: number }> = ({ x, y = CEIL, len = 70, t = 0, sw = 3 }) => (
  <g transform={`translate(${x} ${y}) rotate(${Math.sin(t * 0.06) * 1.4})`} strokeWidth={sw}>
    <path d={`M0 0 V${len}`} strokeWidth={1.8} />
    <path d={`M-52 ${len + 62} Q-46 ${len + 8} -13 ${len} H13 Q46 ${len + 8} 52 ${len + 62} Z`} fill={PAPER} />
    <path d={`M-16 ${len + 62} Q0 ${len + 88} 16 ${len + 62}`} fill={PAPER} strokeWidth={2.2} />
    {[-0.9, -0.3, 0.3, 0.9].map((k) => <path key={k} d={`M${k * 34} ${len + 90} L${k * 60} ${len + 136}`} strokeWidth={1.4} strokeDasharray="10 8" opacity={0.55} />)}
  </g>
);

// ——— Офис ———

/** Рабочий стол: тумба, монитор, клавиатура, кружка, бумаги. screen: code, chart или off. */
export const Desk: React.FC<P & { w?: number; t?: number; screen?: 'code' | 'chart' | 'off' }> = ({ x, y, s, seed = 1, sw = 3, flip, w = 320, t, screen = 'code' }) => {
  const r = rnd(seed);
  const top = -160, mx = -w * 0.14, sy = top - 158;
  const rows = Array.from({ length: 5 }, () => 34 + r() * 70);
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d={ln(r, -w / 2 + 18, top, -w / 2 + 18, 0)} /><path d={ln(r, -w / 2 + 32, top, -w / 2 + 32, 0)} />
      <path d={rc(r, w / 2 - 112, top, 98, -top)} fill={PAPER} />
      {[0, 1, 2].map((i) => <path key={i} d={`M${w / 2 - 112} ${top + 8 + (i + 1) * 46} h98 M${w / 2 - 80} ${top + 26 + i * 46} h34`} strokeWidth={sw * 0.7} />)}
      <path d={rc(r, -w / 2, top - 13, w, 14)} fill={PAPER} />
      <path d={`M${mx - 8} ${top - 13} V${top - 48} M${mx + 8} ${top - 13} V${top - 48} M${mx - 36} ${top - 13} Q${mx} ${top - 26} ${mx + 36} ${top - 13}`} strokeWidth={sw * 0.8} />
      <path d={rc(r, mx - 84, sy, 168, 112)} fill={PAPER} />
      <path d={rc(r, mx - 75, sy + 9, 150, 94, 1)} strokeWidth={sw * 0.5} />
      {screen === 'code' && rows.map((l, i) => <path key={i} d={`M${mx - 62 + (i % 3) * 10} ${sy + 24 + i * 16} h${l}`} strokeWidth={sw * 0.55} />)}
      {screen === 'code' && t !== undefined && Math.floor(t / 12) % 2 === 0 && <path d={`M${mx + 40} ${sy + 86} v12`} strokeWidth={sw * 0.9} />}
      {screen === 'chart' && <path d={`M${mx - 60} ${sy + 90} L${mx - 26} ${sy + 62} L${mx + 6} ${sy + 72} L${mx + 56} ${sy + 28} M${mx - 62} ${sy + 22} V${sy + 94} H${mx + 62}`} strokeWidth={sw * 0.7} />}
      <path d={rc(r, mx - 58, top - 23, 116, 10, 0.8)} fill={PAPER} strokeWidth={sw * 0.7} />
      <path d={`M${w * 0.18} ${top - 42} V${top - 15} H${w * 0.28} V${top - 42} Z M${w * 0.28} ${top - 36} q14 8 0 16`} fill={PAPER} strokeWidth={sw * 0.8} />
      <path d={`M${-w / 2 + 12} ${top - 16} l48 -4 l4 3 l-48 4 Z M${-w / 2 + 16} ${top - 21} l48 -4`} fill={PAPER} strokeWidth={sw * 0.6} />
    </At>
  );
};

/** Офисное кресло на колёсах. */
export const OfficeChair: React.FC<P> = ({ x, y, s, seed = 2, sw = 3, flip }) => {
  const r = rnd(seed);
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d={`M0 -40 L-60 -13 M0 -40 L60 -13 M0 -40 L-24 -14 M0 -40 L24 -14`} />
      {[-60, -24, 24, 60].map((k) => <circle key={k} cx={k} cy={-7} r={7} fill={PAPER} strokeWidth={sw * 0.7} />)}
      <path d={`M-5 -40 V-118 M5 -40 V-118`} />
      <path d={`M-44 -262 Q0 -278 44 -262 L38 -142 H-38 Z`} fill={PAPER} />
      <path d={`M-28 -240 Q0 -250 28 -240 M-28 -210 Q0 -218 28 -210 M-28 -180 Q0 -188 28 -180`} strokeWidth={sw * 0.5} opacity={0.7} />
      <path d={rc(r, -56, -136, 112, 20)} fill={PAPER} />
      <path d={`M-64 -176 h20 v42 M64 -176 h-20 v42`} strokeWidth={sw * 0.85} />
    </At>
  );
};

/** Перегородка между столами: ткань, рейка сверху, стикеры. */
export const Partition: React.FC<P & { w?: number; h?: number }> = ({ x, y, s, seed = 3, sw = 3, flip, w = 220, h = 240 }) => {
  const r = rnd(seed);
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d={rc(r, -w / 2, -h, w, h)} fill={PAPER} />
      <path d={`M${-w / 2} ${-h + 12} H${w / 2}`} strokeWidth={sw * 0.8} />
      {Array.from({ length: 10 }, (_, i) => {
        const a = -w / 2 + 12 + r() * (w - 44), b = -h + 34 + r() * (h - 60);
        return <path key={i} d={`M${a} ${b} l18 -5`} strokeWidth={1.2} opacity={0.55} />;
      })}
      {[0, 1, 2].map((i) => {
        const a = -w / 2 + 22 + i * ((w - 60) / 3) + r() * 8, b = -h + 44 + r() * 30;
        return <g key={i}><path d={rc(r, a, b, 38, 38, 1)} fill={PAPER} strokeWidth={sw * 0.6} /><path d={`M${a + 7} ${b + 14} h24 M${a + 7} ${b + 26} h16`} strokeWidth={1.2} /></g>;
      })}
      <path d={`M${-w / 2 - 12} 0 H${-w / 2 + 16} M${w / 2 - 16} 0 H${w / 2 + 12}`} strokeWidth={sw * 1.3} />
    </At>
  );
};

/** Пробковая доска на стене (x, y это левый верхний угол). */
export const CorkBoard: React.FC<{ x: number; y: number; w?: number; h?: number; seed?: number; sw?: number }> = ({ x, y, w = 190, h = 150, seed = 4, sw = 3 }) => {
  const r = rnd(seed);
  const notes = Array.from({ length: 4 }, (_, i) => ({ a: x + 18 + (i % 2) * (w * 0.46) + r() * 12, b: y + 16 + (i > 1 ? h * 0.44 : 0) + r() * 8, rot: (r() - 0.5) * 12 }));
  return (
    <g strokeWidth={sw}>
      <path d={rc(r, x, y, w, h)} fill={PAPER} />
      <path d={rc(r, x + 9, y + 9, w - 18, h - 18, 1)} strokeWidth={sw * 0.5} />
      {notes.map((n, i) => (
        <g key={i} transform={`rotate(${n.rot} ${n.a + 26} ${n.b + 22})`}>
          <rect x={n.a} y={n.b} width={56} height={44} fill={PAPER} strokeWidth={sw * 0.6} />
          <path d={`M${n.a + 9} ${n.b + 18} h36 M${n.a + 9} ${n.b + 30} h24`} strokeWidth={1.2} />
          <circle cx={n.a + 28} cy={n.b + 3} r={3.5} fill={INK} stroke="none" />
        </g>
      ))}
    </g>
  );
};

/** Кулер с бутылью: t пускает пузырьки. */
export const Cooler: React.FC<P & { t?: number }> = ({ x, y, s, seed = 5, sw = 3, flip, t = 0 }) => {
  const r = rnd(seed);
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d={rc(r, -48, -270, 96, 270)} fill={PAPER} />
      <path d={`M-48 -160 H48 M-30 -130 h60 v104 h-60 Z`} strokeWidth={sw * 0.7} />
      <path d={`M-26 -226 h20 v20 h-20 Z M6 -226 h20 v20 h-20 Z M-16 -206 v10 M16 -206 v10`} strokeWidth={sw * 0.7} fill={PAPER} />
      <path d={`M-36 -272 L-42 -300 V-404 Q-42 -432 -14 -432 H14 Q42 -432 42 -404 V-300 L36 -272 Z`} fill={PAPER} />
      <path d={`M-42 -350 H42 M-42 -390 q21 -9 42 0 t42 0`} strokeWidth={sw * 0.6} />
      {[0, 1, 2].map((i) => {
        const u = ((t * 2.2 + i * 33) % 100) / 100;
        return <circle key={i} cx={-18 + i * 18 + Math.sin(u * 8) * 4} cy={-305 - u * 82} r={3 + i} fill={PAPER} strokeWidth={1.4} opacity={1 - u * 0.6} />;
      })}
      <path d={`M48 -250 h24 v84 h-24 M50 -240 h20 M50 -230 h20 M50 -220 h20`} strokeWidth={sw * 0.7} />
    </At>
  );
};

/** Принтер на тумбе. */
export const Printer: React.FC<P> = ({ x, y, s, seed = 6, sw = 3, flip }) => {
  const r = rnd(seed);
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d={rc(r, -82, -130, 164, 130)} fill={PAPER} />
      <path d={`M-82 -66 H82 M-22 -100 h44 M-22 -38 h44`} strokeWidth={sw * 0.75} />
      <path d={`M-40 -232 L-30 -278 H30 L40 -232 Z`} fill={PAPER} strokeWidth={sw * 0.7} />
      <path d={rc(r, -74, -234, 148, 104)} fill={PAPER} />
      <path d={`M-74 -188 H74 M-54 -162 H20 V-142 H-54 Z`} strokeWidth={sw * 0.7} />
      <path d={`M36 -214 h24 v14 h-24 Z`} strokeWidth={sw * 0.6} />
      <circle cx={44} cy={-168} r={5} strokeWidth={sw * 0.6} /><circle cx={60} cy={-168} r={5} strokeWidth={sw * 0.6} />
    </At>
  );
};

/** Стеллаж с папками: h высота, полки заполняются корешками и коробками. */
export const Shelves: React.FC<P & { w?: number; h?: number; n?: number }> = ({ x, y, s, seed = 7, sw = 3, flip, w = 190, h = 440, n = 4 }) => {
  const r = rnd(seed);
  const step = (h - 22) / n;
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d={rc(r, -w / 2, -h, w, h)} fill={PAPER} />
      {Array.from({ length: n }, (_, i) => {
        const base = -i * step - 12;
        const items: React.ReactNode[] = [];
        let px = -w / 2 + 12, k = 0;
        while (px < w / 2 - 34) {
          const box = r() < 0.16;
          const bw = box ? 44 : 13 + r() * 12, bh = step * (box ? 0.46 : 0.58 + r() * 0.26);
          items.push(<path key={k++} d={rc(r, px, base - bh, bw, bh, 0.8)} fill={PAPER} strokeWidth={sw * 0.55} />);
          if (!box) items.push(<path key={k++} d={`M${px + 4} ${base - bh * 0.3} h${bw - 8}`} strokeWidth={1.1} />);
          px += bw + 2 + (r() < 0.1 ? 22 : 0);
        }
        return <g key={i}><path d={`M${-w / 2} ${base} H${w / 2}`} strokeWidth={sw * 0.85} />{items}</g>;
      })}
    </At>
  );
};

// ——— Переговорная ———

/** Длинный стол со стульями за ним; ноутбуки, стаканы и бумаги сверху. */
export const LongTable: React.FC<P & { w?: number }> = ({ x, y, s, seed = 8, sw = 3, flip, w = 600 }) => {
  const r = rnd(seed);
  const n = Math.floor(w / 124);
  const top = -178;
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      {Array.from({ length: n }, (_, i) => {
        const a = -w / 2 + ((i + 0.5) * w) / n;
        return <path key={i} d={`M${a - 42} ${top} L${a - 36} ${top - 92} Q${a} ${top - 110} ${a + 36} ${top - 92} L${a + 42} ${top} Z`} fill={PAPER} strokeWidth={sw * 0.85} />;
      })}
      <path d={rc(r, -w / 2 + 40, top + 14, w - 80, 70)} fill={PAPER} strokeWidth={sw * 0.7} />
      {[-1, 1].map((k) => <path key={k} d={`M${k * (w / 2 - 110)} ${top + 14} L${k * (w / 2 - 92)} 0 H${k * (w / 2 - 158)} L${k * (w / 2 - 140)} ${top + 14} Z`} fill={PAPER} />)}
      <path d={rc(r, -w / 2, top, w, 16)} fill={PAPER} />
      {[-0.3, 0.14].map((k, i) => (
        <g key={i} transform={`translate(${w * k} ${top})`} strokeWidth={sw * 0.75}>
          <path d={`M-44 -1 H44 L38 -7 H-38 Z M-34 -8 L-38 -62 H38 L34 -8`} fill={PAPER} />
          <path d={`M-22 -46 h44 M-22 -32 h30`} strokeWidth={1.3} />
        </g>
      ))}
      <path d={`M${w * 0.34} ${top} l-5 -36 h22 l-5 36 Z M${-w * 0.08} ${top} l-5 -30 h20 l-5 30 Z`} fill={PAPER} strokeWidth={sw * 0.7} />
      <path d={`M${-w * 0.46} ${top - 2} l52 -6 l6 4 l-52 6 Z`} fill={PAPER} strokeWidth={sw * 0.6} />
    </At>
  );
};

/** Экран проектора со слайдом (x, y это левый верхний угол). */
export const ProjScreen: React.FC<{ x: number; y: number; w?: number; h?: number; seed?: number; t?: number; sw?: number }> = ({ x, y, w = 420, h = 210, seed = 9, t = 0, sw = 3 }) => {
  const r = rnd(seed);
  const slide = Math.floor(t / 150) % 2;
  const bars = Array.from({ length: 6 }, () => 18 + r() * 70);
  return (
    <g strokeWidth={sw}>
      <path d={rc(r, x - 12, y, w + 24, 14)} fill={PAPER} />
      <path d={rc(r, x, y + 14, w, h)} fill={PAPER} />
      <path d={`M${x} ${y + 14 + h} h${w}`} strokeWidth={sw * 1.5} />
      <path d={`M${x + w / 2} ${y + 14 + h} v20`} strokeWidth={1.6} /><circle cx={x + w / 2} cy={y + 40 + h} r={5} fill={PAPER} strokeWidth={1.6} />
      <path d={`M${x + 28} ${y + 42} h${w * 0.36} M${x + 28} ${y + 58} h${w * 0.2}`} strokeWidth={sw * 0.7} />
      {slide === 0
        ? bars.map((b, i) => <path key={i} d={rc(r, x + w * 0.46 + i * 34, y + h - b - 12 + 14, 24, b, 0.8)} fill={PAPER} strokeWidth={sw * 0.7} />)
        : <path d={`M${x + w * 0.46} ${y + h - 16} L${x + w * 0.6} ${y + h - 70} L${x + w * 0.72} ${y + h - 48} L${x + w * 0.92} ${y + 50}`} strokeWidth={sw} />}
      <path d={`M${x + 28} ${y + 90} h${w * 0.3} M${x + 28} ${y + 112} h${w * 0.26} M${x + 28} ${y + 134} h${w * 0.3} M${x + 28} ${y + 156} h${w * 0.18}`} strokeWidth={sw * 0.5} opacity={0.75} />
    </g>
  );
};

/** Проектор под потолком. */
export const Projector: React.FC<{ x: number; y?: number; flip?: boolean; sw?: number }> = ({ x, y = CEIL, flip, sw = 3 }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`} strokeWidth={sw}>
    <path d="M-5 0 V36 M5 0 V36 M-22 0 H22" strokeWidth={sw * 0.8} />
    <path d="M-52 36 H46 Q54 36 54 44 V72 Q54 80 46 80 H-52 Z" fill={PAPER} />
    <circle cx={54} cy={58} r={13} fill={PAPER} /><circle cx={54} cy={58} r={6} strokeWidth={sw * 0.6} />
    <path d="M-40 50 h46 M-40 62 h30" strokeWidth={1.4} />
  </g>
);

/** Флипчарт с растущим графиком. */
export const Flipchart: React.FC<P> = ({ x, y, s, seed = 10, sw = 3, flip }) => {
  const r = rnd(seed);
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d={ln(r, -66, -210, -100, 0)} /><path d={ln(r, 66, -210, 100, 0)} /><path d={`M0 -210 L0 -6`} />
      <path d={`M-90 -40 H90`} strokeWidth={sw * 0.7} />
      <path d={rc(r, -96, -470, 192, 262)} fill={PAPER} />
      <path d={`M-110 -206 H110 V-194 H-110 Z`} fill={PAPER} />
      <path d={`M-96 -456 H96 M-74 -470 v-10 h148 v10`} strokeWidth={sw * 0.75} />
      <path d={`M-74 -252 V-420 M-80 -258 H78`} strokeWidth={sw * 0.8} />
      <path d={`M-66 -272 L-30 -310 L4 -294 L66 -402 M46 -396 L66 -402 L66 -380`} strokeWidth={sw * 1.05} />
      <path d={`M-68 -432 h70`} strokeWidth={sw * 0.8} />
    </At>
  );
};

/** Низкий шкаф-буфет: на него ставятся кофеварка и стаканы. */
export const Sideboard: React.FC<P & { w?: number; h?: number; t?: number; coffee?: boolean }> = ({ x, y, s, seed = 11, sw = 3, flip, w = 230, h = 130, t, coffee = true }) => {
  const r = rnd(seed);
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d={`M${-w / 2 + 16} 0 v-14 M${w / 2 - 16} 0 v-14`} />
      <path d={rc(r, -w / 2, -h, w, h - 14)} fill={PAPER} />
      <path d={`M0 ${-h} V-14 M-16 ${-h / 2 - 6} v22 M16 ${-h / 2 - 6} v22`} strokeWidth={sw * 0.75} />
      <path d={`M${-w / 2 - 8} ${-h} H${w / 2 + 8}`} strokeWidth={sw * 1.4} />
      {coffee && (
        <g transform={`translate(${-w * 0.2} ${-h})`} strokeWidth={sw * 0.85}>
          <path d="M-36 0 H40 V-12 H-36 Z M-36 -12 V-134 H40 V-112 H-14 V-12" fill={PAPER} />
          <path d="M-36 -134 Q2 -152 40 -134" fill={PAPER} />
          <path d="M-8 -12 V-56 Q-8 -66 2 -66 H30 V-22 Q30 -12 20 -12 Z" fill={PAPER} />
          <path d="M-8 -46 H30" strokeWidth={1.4} />
          <Steam x={46} y={-136} t={t} n={1} h={50} />
        </g>
      )}
      <path d={`M${w * 0.14} ${-h} l-5 -34 h20 l-5 34 Z M${w * 0.28} ${-h} l-5 -34 h20 l-5 34 Z`} fill={PAPER} strokeWidth={sw * 0.75} />
    </At>
  );
};

// ——— Дом ———

/** Рабочий стол дома: столешница, ящик сбоку. */
export const WorkTable: React.FC<P & { w?: number; h?: number }> = ({ x, y, s, seed = 12, sw = 3, flip, w = 400, h = 170 }) => {
  const r = rnd(seed);
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d={`M${-w / 2 + 18} ${-h} L${-w / 2 + 28} 0 M${-w / 2 + 34} ${-h} L${-w / 2 + 40} 0`} />
      <path d={rc(r, w / 2 - 128, -h, 112, 70)} fill={PAPER} />
      <path d={`M${w / 2 - 94} ${-h + 34} h44`} strokeWidth={sw * 0.8} />
      <path d={`M${w / 2 - 36} ${-h + 70} L${w / 2 - 30} 0 M${w / 2 - 22} ${-h + 70} L${w / 2 - 18} 0`} />
      <path d={rc(r, -w / 2, -h - 14, w, 15)} fill={PAPER} />
    </At>
  );
};

/** Ноутбук с сеткой созвона (x, y это точка на столе); t двигает рамку говорящего. */
export const Laptop: React.FC<P & { t?: number }> = ({ x, y = ENV_G, s, seed = 13, sw = 3, flip, t = 0 }) => {
  const r = rnd(seed);
  const active = Math.floor(t / 40) % 6;
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d={rc(r, -128, -172, 256, 164)} fill={PAPER} />
      <path d={`M-144 0 H144 L134 -9 H-134 Z`} fill={PAPER} />
      {Array.from({ length: 6 }, (_, i) => {
        const cx = -82 + (i % 3) * 82, cy = -130 + (i > 2 ? 72 : 0);
        return (
          <g key={i}>
            <rect x={cx - 38} y={cy - 32} width={76} height={64} strokeWidth={i === active ? sw * 1.1 : sw * 0.45} />
            <circle cx={cx} cy={cy - 8} r={11} strokeWidth={sw * 0.55} fill={PAPER} />
            <path d={`M${cx - 20} ${cy + 26} Q${cx} ${cy - 2} ${cx + 20} ${cy + 26}`} strokeWidth={sw * 0.55} />
          </g>
        );
      })}
    </At>
  );
};

/** Кружка с паром (x, y точка на столе). */
export const Mug: React.FC<P & { t?: number }> = ({ x, y = ENV_G, s, seed = 14, sw = 3, flip, t }) => {
  const r = rnd(seed);
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d={rc(r, -22, -50, 44, 50, 1)} fill={PAPER} />
      <path d="M22 -40 Q44 -36 42 -22 Q38 -8 22 -10" />
      <Steam x={0} y={-58} t={t} />
    </At>
  );
};

/** Настольная лампа на шарнирах (x, y точка на столе). */
export const DeskLamp: React.FC<P> = ({ x, y = ENV_G, s, sw = 3, flip }) => (
  <At x={x} y={y} s={s} sw={sw} flip={flip}>
    <path d="M-40 0 H40 V-10 H-40 Z" fill={PAPER} />
    <path d="M-6 -10 L-56 -130 L48 -212" strokeWidth={sw * 1.3} />
    <circle cx={-56} cy={-130} r={7} fill={PAPER} strokeWidth={sw * 0.7} />
    <path d="M26 -216 L66 -240 L118 -166 L92 -146 Z" fill={PAPER} />
    {[0, 1, 2].map((i) => <path key={i} d={`M${86 + i * 12} ${-138 + i * 6} L${110 + i * 26} ${-84 + i * 8}`} strokeWidth={1.4} strokeDasharray="10 8" opacity={0.6} />)}
  </At>
);

/** Диван: подлокотники, спинка, подушки, плед. */
export const Sofa: React.FC<P & { w?: number }> = ({ x, y, s, seed = 15, sw = 3, flip, w = 370 }) => {
  const r = rnd(seed);
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d={`M${-w / 2 + 24} 0 v-16 M${w / 2 - 24} 0 v-16`} strokeWidth={sw * 1.4} />
      <path d={`M${-w / 2 + 28} -116 V-208 Q${-w / 2 + 28} -232 ${-w / 2 + 54} -232 H${w / 2 - 54} Q${w / 2 - 28} -232 ${w / 2 - 28} -208 V-116 Z`} fill={PAPER} />
      <path d={`M0 -228 V-126`} strokeWidth={sw * 0.7} />
      <path d={rc(r, -w / 2 + 44, -130, w / 2 - 44, 58)} fill={PAPER} /><path d={rc(r, 0, -130, w / 2 - 44, 58)} fill={PAPER} />
      <path d={rc(r, -w / 2 + 34, -74, w - 68, 58)} fill={PAPER} />
      {[-1, 1].map((k) => <path key={k} d={`M${k * (w / 2 - 44)} -16 V-132 Q${k * (w / 2 - 44)} -162 ${k * (w / 2 - 14)} -160 Q${k * (w / 2 + 4)} -158 ${k * (w / 2 + 4)} -130 V-16 Z`} fill={PAPER} />)}
      <path d={`M${w * 0.1} -134 l50 -56 l58 44 l-46 42 Z`} fill={PAPER} strokeWidth={sw * 0.8} />
      <path d={`M${w * 0.1 + 20} -150 l40 28 M${w * 0.1 + 34} -166 l40 28`} strokeWidth={1.4} />
    </At>
  );
};

/** Батарея под окном. */
export const Radiator: React.FC<P & { n?: number; h?: number }> = ({ x, y, s, seed = 16, sw = 3, flip, n = 8, h = 130 }) => {
  const r = rnd(seed);
  const cw = 30;
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      {Array.from({ length: n }, (_, i) => <path key={i} d={rc(r, -(n * cw) / 2 + i * cw, -h, cw - 3, h - 14, 0.8)} fill={PAPER} strokeWidth={sw * 0.85} />)}
      <path d={`M${-(n * cw) / 2 - 18} ${-h + 16} H${-(n * cw) / 2} M${(n * cw) / 2 - 2} ${-h + 16} H${(n * cw) / 2 + 18}`} strokeWidth={sw * 1.3} />
      <path d={`M${-(n * cw) / 2 + 12} -14 V0 M${(n * cw) / 2 - 16} -14 V0`} strokeWidth={sw * 0.9} />
    </At>
  );
};

/** Полка на стене с книгами и горшком (x, y это левый конец полки). */
export const WallShelf: React.FC<{ x: number; y: number; w?: number; seed?: number; sw?: number }> = ({ x, y, w = 240, seed = 17, sw = 3 }) => {
  const r = rnd(seed);
  const items: React.ReactNode[] = [];
  let px = x + 14, k = 0;
  while (px < x + w * 0.66) {
    const bw = 13 + r() * 13, bh = 54 + r() * 44;
    items.push(<path key={k++} d={rc(r, px, y - bh, bw, bh, 0.8)} fill={PAPER} strokeWidth={sw * 0.6} />);
    px += bw + 2;
  }
  return (
    <g strokeWidth={sw}>
      {items}
      <path d={`M${x + w * 0.78} ${y} l-20 -52 h52 l-12 52 Z`} fill={PAPER} strokeWidth={sw * 0.8} />
      <path d={`M${x + w * 0.8} ${y - 52} q-22 -38 -36 -34 M${x + w * 0.82} ${y - 52} q2 -46 14 -52 M${x + w * 0.84} ${y - 52} q24 -30 36 -22`} strokeWidth={sw * 0.8} />
      <path d={`M${x} ${y} H${x + w} M${x + 28} ${y} v18 M${x + w - 28} ${y} v18`} strokeWidth={sw * 1.3} />
    </g>
  );
};

// ——— Кафе ———

/** Барная стойка: столешница, вертикальные рейки, подножка. */
export const Bar: React.FC<P & { w?: number; h?: number }> = ({ x, y, s, seed = 18, sw = 3, flip, w = 620, h = 236 }) => {
  const r = rnd(seed);
  const n = Math.round(w / 34);
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d={rc(r, -w / 2 + 12, -h + 12, w - 24, h - 12)} fill={PAPER} />
      {Array.from({ length: n - 1 }, (_, i) => <path key={i} d={ln(r, -w / 2 + 12 + ((i + 1) * (w - 24)) / n, -h + 26, -w / 2 + 12 + ((i + 1) * (w - 24)) / n, -32)} strokeWidth={1.3} opacity={0.6} />)}
      <path d={rc(r, -w / 2 - 8, -h, w + 16, 16)} fill={PAPER} />
      <path d={`M${-w / 2 + 12} -24 H${w / 2 - 12} M${-w / 2 + 28} -48 H${w / 2 - 28}`} strokeWidth={sw * 0.75} />
    </At>
  );
};

/** Меню на доске с тремя позициями (x, y это левый верхний угол). */
export const MenuBoard: React.FC<{ x: number; y: number; w?: number; h?: number; seed?: number; title?: string; items?: [string, string][]; sw?: number }> = ({
  x, y, w = 340, h = 214, seed = 19, title = 'КОФЕ', items = [['МАЛЫЙ', '150'], ['СРЕДНИЙ', '190'], ['БОЛЬШОЙ', '210']], sw = 3,
}) => {
  const r = rnd(seed);
  return (
    <g strokeWidth={sw}>
      <path d={rc(r, x, y, w, h)} fill={PAPER} />
      <path d={rc(r, x + 10, y + 10, w - 20, h - 20, 1)} strokeWidth={sw * 0.5} />
      <Tx x={x + w / 2} y={y + 52} size={38}>{title}</Tx>
      {items.map(([a, b], i) => {
        const yy = y + 100 + i * 40;
        return (
          <g key={a}>
            <Tx x={x + 30} y={yy} size={30} anchor="start">{a}</Tx>
            <Tx x={x + w - 30} y={yy} size={30} anchor="end">{b}</Tx>
          </g>
        );
      })}
    </g>
  );
};

/** Кофемашина с рожками, манометром, чашками сверху (x, y точка на стойке). */
export const Espresso: React.FC<P & { t?: number }> = ({ x, y = ENV_G, s, seed = 20, sw = 3, flip, t }) => {
  const r = rnd(seed);
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d={rc(r, -112, -14, 224, 14)} fill={PAPER} />
      <path d={`M-104 -14 V-160 H104 V-14 M-104 -60 H104`} fill={PAPER} />
      <path d={rc(r, -104, -160, 208, 60)} fill={PAPER} />
      <circle cx={-66} cy={-130} r={16} fill={PAPER} strokeWidth={sw * 0.7} /><path d="M-66 -130 l9 -8" strokeWidth={sw * 0.6} />
      <path d={`M-30 -142 h96 M-30 -122 h60`} strokeWidth={sw * 0.6} />
      {[-40, 40].map((k) => <g key={k} strokeWidth={sw * 0.85}><path d={`M${k - 24} -100 h48 v14 h-48 Z`} fill={PAPER} /><path d={`M${k + 24} -92 h34`} strokeWidth={sw * 1.5} /><path d={`M${k - 14} -40 h28 l-3 26 h-22 Z`} fill={PAPER} /></g>)}
      <path d={`M104 -96 q24 8 18 56`} strokeWidth={sw * 1.1} />
      {[-70, -28, 14, 56].map((k) => <path key={k} d={`M${k} -160 l-4 -26 h32 l-4 26 Z`} fill={PAPER} strokeWidth={sw * 0.7} />)}
      <Steam x={124} y={-40} t={t} n={2} h={60} />
    </At>
  );
};

/** Стопка стаканов (x, y точка на стойке). */
export const CupStack: React.FC<P & { n?: number }> = ({ x, y = ENV_G, s, sw = 3, flip, n = 6 }) => (
  <At x={x} y={y} s={s} sw={sw} flip={flip}>
    <path d={`M-24 0 L-32 -74 H32 L24 0 Z`} fill={PAPER} />
    {Array.from({ length: n }, (_, i) => <path key={i} d={`M-33 ${-82 - i * 10} H33`} strokeWidth={sw * 0.8} />)}
    <path d={`M-33 ${-82 - (n - 1) * 10} v${(n - 1) * 10 + 8} M33 ${-82 - (n - 1) * 10} v${(n - 1) * 10 + 8}`} strokeWidth={sw * 0.8} />
  </At>
);

/** Витрина с выпечкой (x, y точка на стойке). */
export const PastryCase: React.FC<P> = ({ x, y = ENV_G, s, seed = 21, sw = 3, flip }) => {
  const r = rnd(seed);
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d={`M-96 0 V-112 Q-96 -130 -78 -130 H78 Q96 -130 96 -112 V0 Z`} fill={PAPER} />
      <path d={`M-96 -64 H96`} strokeWidth={sw * 0.75} />
      {[-58, 0, 58].map((k) => <path key={k} d={`M${k - 22} -8 q22 -38 44 0 Z`} fill={PAPER} strokeWidth={sw * 0.75} />)}
      {[-58, 0, 58].map((k) => <path key={k} d={rc(r, k - 20, -92, 40, 26, 1)} fill={PAPER} strokeWidth={sw * 0.75} />)}
      <path d={`M-80 -116 l28 -10 M-68 -104 l16 -6`} strokeWidth={1.4} />
    </At>
  );
};

/** Круглый столик на одной ноге, чашка сверху. */
export const BistroTable: React.FC<P> = ({ x, y, s, seed = 22, sw = 3, flip }) => {
  const r = rnd(seed);
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d={`M-4 -172 V-16 M4 -172 V-16`} />
      <path d={`M-52 0 Q0 -30 52 0`} fill={PAPER} />
      <path d={rc(r, -82, -182, 164, 11)} fill={PAPER} />
      <path d={`M-30 -182 v-26 h34 v26 M4 -202 q16 4 0 16`} fill={PAPER} strokeWidth={sw * 0.8} />
      <path d={`M-42 -183 H16`} strokeWidth={sw * 0.9} />
    </At>
  );
};

/** Гнутый стул в профиль. */
export const BistroChair: React.FC<P> = ({ x, y, s, sw = 3, flip }) => (
  <At x={x} y={y} s={s} sw={sw} flip={flip}>
    <path d="M-44 -116 Q-52 -210 -36 -276 Q-26 -286 -18 -274 Q-30 -200 -24 -116" fill={PAPER} />
    <path d="M-34 -252 q10 2 12 -2 M-34 -226 q10 2 14 -2 M-36 -196 q10 2 14 -2" strokeWidth={sw * 0.5} />
    <path d="M-48 -116 H52 V-102 H-48 Z" fill={PAPER} />
    <path d="M-40 -102 L-52 0 M40 -102 L54 0 M-34 -60 H36" />
  </At>
);

/** Барный табурет. */
export const Stool: React.FC<P> = ({ x, y, s, sw = 3, flip }) => (
  <At x={x} y={y} s={s} sw={sw} flip={flip}>
    <path d="M-30 -164 L-46 0 M30 -164 L46 0 M-38 -70 H38" />
    <path d="M-46 -182 Q0 -196 46 -182 V-164 H-46 Z" fill={PAPER} />
  </At>
);

// ——— Зал ———

/** Гантель (x, y центр рукояти): h размер блина. */
const Dumbbell: React.FC<{ x: number; y: number; h: number; sw: number }> = ({ x, y, h, sw }) => (
  <g strokeWidth={sw}>
    <path d={`M${x - 30} ${y} H${x + 30}`} strokeWidth={sw * 1.6} />
    {[-1, 1].map((k) => <rect key={k} x={x + k * 42 - 12} y={y - h / 2} width={24} height={h} rx={5} fill={PAPER} />)}
  </g>
);

/** Стойка с гантелями в три яруса. */
export const DumbbellRack: React.FC<P & { w?: number }> = ({ x, y, s, seed = 23, sw = 3, flip, w = 340 }) => {
  const r = rnd(seed);
  const n = Math.floor((w - 20) / 112);
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      {[-1, 1].map((k) => <path key={k} d={`M${k * (w / 2 - 12)} -252 L${k * (w / 2 - 12)} 0 M${k * (w / 2 - 44)} 0 H${k * (w / 2 + 24)}`} strokeWidth={sw * 1.5} />)}
      {[0, 1, 2].map((row) => {
        const yy = -46 - row * 82;
        return (
          <g key={row}>
            <path d={ln(r, -w / 2 + 12, yy + 28, w / 2 - 12, yy + 28)} strokeWidth={sw * 1.2} />
            {Array.from({ length: n }, (_, i) => <Dumbbell key={i} x={-w / 2 + 68 + i * 112} y={yy} h={44 - row * 8} sw={sw * 0.85} />)}
          </g>
        );
      })}
    </At>
  );
};

/** Силовая рама со штангой. */
export const SquatRack: React.FC<P> = ({ x, y, s, seed = 24, sw = 3, flip }) => {
  const r = rnd(seed);
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      {[-1, 1].map((k) => (
        <g key={k}>
          <path d={`M${k * 132} 0 V-500 M${k * 112} 0 V-500`} />
          <path d={`M${k * 160} 0 H${k * 84}`} strokeWidth={sw * 1.8} />
          {Array.from({ length: 13 }, (_, i) => <path key={i} d={`M${k * 118} ${-74 - i * 32} h${k * 8}`} strokeWidth={1.8} />)}
          <path d={`M${k * 112} -314 h${k * -18} v-20`} strokeWidth={sw * 1.2} />
        </g>
      ))}
      <path d="M-132 -500 H132 M-132 -486 H132" strokeWidth={sw * 1.1} />
      <path d={ln(r, -214, -340, 214, -340, 0.8)} strokeWidth={sw * 1.5} />
      {[-1, 1].map((k) => [[150, 92], [168, 76], [184, 54]].map(([px, ph], i) => <rect key={`${k}-${i}`} x={k * px - 7} y={-340 - ph / 2} width={14} height={ph} rx={3} fill={PAPER} />))}
    </At>
  );
};

/** Беговая дорожка в профиль: t двигает полотно. */
export const Treadmill: React.FC<P & { t?: number }> = ({ x, y, s, seed = 25, sw = 3, flip, t = 0 }) => {
  const r = rnd(seed);
  const off = (t * 3) % 40;
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d={`M-196 -8 L-190 -46 L164 -66 L176 -10 Z`} fill={PAPER} />
      <circle cx={-172} cy={-28} r={11} fill={PAPER} strokeWidth={sw * 0.7} /><circle cx={154} cy={-40} r={13} fill={PAPER} strokeWidth={sw * 0.7} />
      {Array.from({ length: 8 }, (_, i) => {
        const a = -150 + ((i * 40 + off) % 300);
        return <path key={i} d={`M${a} ${-46 - (a + 190) * 0.055} l8 22`} strokeWidth={1.4} opacity={0.7} />;
      })}
      <path d={ln(r, 148, -66, 186, -282)} strokeWidth={sw * 1.5} /><path d={ln(r, 168, -66, 204, -282)} strokeWidth={sw * 1.5} />
      <path d={`M190 -226 L58 -214 q-16 2 -16 18`} strokeWidth={sw * 1.3} />
      <path d={`M144 -318 L232 -300 L222 -254 L134 -272 Z`} fill={PAPER} />
      <path d={`M150 -304 L216 -290 L211 -268 L145 -282 Z`} strokeWidth={sw * 0.6} />
      <path d={`M158 -296 l44 9`} strokeWidth={1.4} />
    </At>
  );
};

/** Блочный тренажёр: башня, стек грузов, трос, сиденье. */
export const LatMachine: React.FC<P> = ({ x, y, s, seed = 26, sw = 3, flip }) => {
  const r = rnd(seed);
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d={`M36 0 V-510 M122 0 V-510 M-110 -510 H136 M-110 -492 H122 M20 0 H138`} strokeWidth={sw * 1.2} />
      <path d={`M60 -60 V-440 M98 -60 V-440`} strokeWidth={sw * 0.5} />
      {Array.from({ length: 12 }, (_, i) => <g key={i}><path d={rc(r, 48, -74 - i * 16, 62, 14, 0.6)} fill={PAPER} strokeWidth={sw * 0.65} /></g>)}
      <path d={`M79 -270 V-492 H-96 V-400`} strokeWidth={sw * 0.5} />
      <circle cx={-96} cy={-496} r={9} fill={PAPER} strokeWidth={sw * 0.7} />
      <path d={`M-164 -388 Q-96 -412 -28 -388`} strokeWidth={sw * 1.6} />
      <path d={`M-96 -402 V-396`} strokeWidth={sw} />
      <path d={`M36 -108 H-96 M-66 -108 V0 M-104 0 H-30`} strokeWidth={sw * 1.2} />
      <path d={rc(r, -132, -130, 112, 22)} fill={PAPER} />
      <path d={`M-66 -210 V-108`} strokeWidth={sw} />
      <path d={rc(r, -110, -226, 88, 22)} fill={PAPER} />
    </At>
  );
};

/** Зеркало во всю стену: стыки полотен и блики (x, y это левый верхний угол). */
export const GymMirror: React.FC<{ x: number; y: number; w: number; h: number; n?: number; seed?: number; sw?: number }> = ({ x, y, w, h, n = 3, seed = 27, sw = 2 }) => {
  const r = rnd(seed);
  return (
    <Far o={0.5}>
      <g strokeWidth={sw}>
        <path d={rc(r, x, y, w, h)} fill={PAPER} />
        {Array.from({ length: n - 1 }, (_, i) => <path key={i} d={`M${x + ((i + 1) * w) / n} ${y} V${y + h}`} />)}
        {Array.from({ length: n }, (_, i) => {
          const a = x + (i * w) / n + 34;
          return <path key={i} d={`M${a} ${y + 94} l54 -60 M${a + 18} ${y + 110} l34 -38`} strokeWidth={sw * 0.8} />;
        })}
      </g>
    </Far>
  );
};

/** Скамья для жима. */
export const PressBench: React.FC<P> = ({ x, y, s, seed = 28, sw = 3, flip }) => {
  const r = rnd(seed);
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d={rc(r, -150, -116, 300, 26)} fill={PAPER} />
      <path d={`M-110 -90 L-130 0 M-110 -90 L-82 0 M110 -90 L130 0 M110 -90 L82 0 M-152 0 H-60 M60 0 H152`} strokeWidth={sw * 1.2} />
    </At>
  );
};

/** Ряд гирь. */
export const Kettlebells: React.FC<P & { n?: number }> = ({ x, y, s, sw = 3, flip, n = 3 }) => (
  <At x={x} y={y} s={s} sw={sw} flip={flip}>
    {Array.from({ length: n }, (_, i) => {
      const k = 1 - i * 0.16, a = i * 84 - ((n - 1) * 84) / 2;
      return (
        <g key={i} transform={`translate(${a} 0) scale(${k})`}>
          <path d="M-26 -72 Q-34 -112 0 -112 Q34 -112 26 -72 M-15 -72 Q-20 -98 0 -98 Q20 -98 15 -72" fill={PAPER} />
          <circle cx={0} cy={-38} r={38} fill={PAPER} />
        </g>
      );
    })}
  </At>
);

/** Стойка для блинов. */
export const PlateTree: React.FC<P> = ({ x, y, s, sw = 3, flip }) => (
  <At x={x} y={y} s={s} sw={sw} flip={flip}>
    <path d="M-5 0 V-250 M5 0 V-250 M-60 0 H60" strokeWidth={sw * 1.2} />
    {[[-1, 80, 88], [1, 70, 110], [-1, 160, 64], [1, 170, 72]].map(([k, yy, d], i) => (
      <g key={i}>
        <path d={`M0 ${-yy} h${k * 34}`} strokeWidth={sw * 1.2} />
        <rect x={k < 0 ? -30 : 16} y={-yy - d / 2} width={14} height={d} rx={3} fill={PAPER} />
      </g>
    ))}
  </At>
);

/** Шкафчики раздевалки (дальний план). */
export const Lockers: React.FC<P & { n?: number; h?: number }> = ({ x, y, s, seed = 29, sw = 3, flip, n = 4, h = 400 }) => {
  const r = rnd(seed);
  const cw = 66;
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      {Array.from({ length: n }, (_, i) => {
        const a = -(n * cw) / 2 + i * cw;
        return (
          <g key={i}>
            <path d={rc(r, a, -h, cw, h - 14, 1)} fill={PAPER} />
            <path d={`M${a + 16} ${-h + 24} h34 M${a + 16} ${-h + 36} h34 M${a + 16} ${-h + 48} h34`} strokeWidth={sw * 0.5} />
            <circle cx={a + cw - 15} cy={-h * 0.5} r={5} strokeWidth={sw * 0.6} />
          </g>
        );
      })}
      <path d={`M${-(n * cw) / 2 + 8} 0 v-14 M${(n * cw) / 2 - 8} 0 v-14`} />
    </At>
  );
};

// ——— Кухня ———

/** Холодильник с магнитами и запиской. */
export const Frig: React.FC<P> = ({ x, y, s, seed = 30, sw = 3, flip }) => {
  const r = rnd(seed);
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d={rc(r, -88, -452, 176, 438)} fill={PAPER} />
      <path d={`M-88 -318 H88`} />
      <path d={`M-68 -400 v56 M-68 -294 v92`} strokeWidth={sw * 2} />
      <path d={`M-70 -14 v14 M70 -14 v14`} strokeWidth={sw * 1.3} />
      <g transform="rotate(4 20 -220)">
        <path d={rc(r, -14, -270, 76, 92, 1)} fill={PAPER} strokeWidth={sw * 0.7} />
        <path d={`M-2 -244 h52 M-2 -228 h40 M-2 -212 h46 M-2 -196 h26`} strokeWidth={1.3} />
      </g>
      <circle cx={24} cy={-268} r={6} fill={PAPER} strokeWidth={sw * 0.7} />
      <circle cx={38} cy={-384} r={10} fill={PAPER} strokeWidth={sw * 0.7} />
      <path d={`M-10 -374 l12 -22 l12 22 Z`} fill={PAPER} strokeWidth={sw * 0.7} />
    </At>
  );
};

/** Верхние шкафчики (x, y это левый верхний угол). */
export const UpperCabs: React.FC<{ x: number; y: number; w?: number; h?: number; n?: number; seed?: number; sw?: number }> = ({ x, y, w = 430, h = 170, n = 4, seed = 31, sw = 3 }) => {
  const r = rnd(seed);
  const cw = w / n;
  return (
    <g strokeWidth={sw}>
      <path d={rc(r, x - 6, y - 12, w + 12, 12)} fill={PAPER} />
      {Array.from({ length: n }, (_, i) => (
        <g key={i}>
          <path d={rc(r, x + i * cw, y, cw, h, 1)} fill={PAPER} />
          <path d={rc(r, x + i * cw + 12, y + 12, cw - 24, h - 24, 1)} strokeWidth={sw * 0.45} />
          <path d={`M${x + i * cw + (i % 2 ? 22 : cw - 22)} ${y + h - 46} v22`} strokeWidth={sw * 1.3} />
        </g>
      ))}
    </g>
  );
};

/** Кухонная тумба: шкафы, духовка с варочной, мойка, плитка над ней. */
export const Counter: React.FC<P & { w?: number; t?: number; n?: number }> = ({ x, y, s, seed = 32, sw = 3, flip, w = 540, t, n = 4 }) => {
  const r = rnd(seed);
  const h = 196, cw = w / n, stove = n - 2;
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <Far o={0.45}>
        <g strokeWidth={1.5}>
          {[0, 1, 2, 3].map((i) => <path key={i} d={`M${-w / 2} ${-h - 14 - (i + 1) * 58} H${w / 2}`} />)}
          {Array.from({ length: Math.floor(w / 60) }, (_, i) => <path key={i} d={`M${-w / 2 + (i + 1) * 60} ${-h - 14} V${-h - 246}`} />)}
        </g>
      </Far>
      {Array.from({ length: n }, (_, i) => {
        const a = -w / 2 + i * cw;
        if (i === stove) {
          return (
            <g key={i}>
              <path d={rc(r, a, -h, cw, h - 14, 1)} fill={PAPER} />
              <path d={`M${a + 18} ${-h + 56} h${cw - 36} v88 h${-cw + 36} Z`} strokeWidth={sw * 0.8} />
              <path d={`M${a + 22} ${-h + 40} h${cw - 44}`} strokeWidth={sw * 1.4} />
              {[0.2, 0.4, 0.6, 0.8].map((k) => <circle key={k} cx={a + cw * k} cy={-h + 20} r={6} strokeWidth={sw * 0.6} />)}
              <path d={`M${a + 34} ${-h + 116} L${a + 60} ${-h + 86} M${a + 52} ${-h + 124} L${a + 76} ${-h + 96}`} strokeWidth={1.4} />
            </g>
          );
        }
        return (
          <g key={i}>
            <path d={rc(r, a, -h, cw, h - 14, 1)} fill={PAPER} />
            <path d={rc(r, a + 12, -h + 12, cw - 24, h - 38, 1)} strokeWidth={sw * 0.45} />
            <path d={`M${a + (i % 2 ? 24 : cw - 24)} ${-h + 28} v22`} strokeWidth={sw * 1.3} />
          </g>
        );
      })}
      <path d={rc(r, -w / 2 - 8, -h - 14, w + 16, 15)} fill={PAPER} />
      <path d={`M${-w / 2 + 6} -14 H${w / 2 - 6}`} strokeWidth={sw * 1.3} />
      <path d={`M${-w / 2 + cw * 0.3} ${-h - 14} V${-h - 66} Q${-w / 2 + cw * 0.3} ${-h - 86} ${-w / 2 + cw * 0.3 + 22} ${-h - 86} Q${-w / 2 + cw * 0.3 + 44} ${-h - 86} ${-w / 2 + cw * 0.3 + 44} ${-h - 62}`} strokeWidth={sw * 1.3} />
      <path d={`M${-w / 2 + stove * cw + 16} ${-h - 16} h${cw - 32}`} strokeWidth={sw * 1.5} />
      <g transform={`translate(${-w / 2 + stove * cw + cw / 2} ${-h - 18})`}><Kettle x={0} y={0} t={t} sw={sw} /></g>
    </At>
  );
};

/** Чайник (x, y точка на плите): t пускает пар из носика. */
export const Kettle: React.FC<P & { t?: number }> = ({ x, y = ENV_G, s, sw = 3, flip, t }) => (
  <At x={x} y={y} s={s} sw={sw} flip={flip}>
    <path d="M-44 0 Q-54 -56 -22 -74 H22 Q54 -56 44 0 Z" fill={PAPER} />
    <path d="M44 -36 L78 -66 L84 -56 L46 -14" fill={PAPER} strokeWidth={sw * 0.9} />
    <path d="M-30 -74 Q-26 -122 0 -122 Q26 -122 30 -74" strokeWidth={sw * 1.2} />
    <path d="M-14 -76 Q0 -86 14 -76" />
    <Steam x={84} y={-70} t={t} n={2} h={60} />
  </At>
);

/** Вытяжка над плитой. */
export const Hood: React.FC<{ x: number; y: number; sw?: number }> = ({ x, y, sw = 3 }) => (
  <g transform={`translate(${x} ${y})`} strokeWidth={sw}>
    <path d="M-34 0 V-70 H34 V0" fill={PAPER} />
    <path d="M-92 56 L-34 0 H34 L92 56 Z" fill={PAPER} />
    <path d="M-92 56 H92 V68 H-92 Z" fill={PAPER} />
    <path d="M-34 -42 H34" strokeWidth={sw * 0.6} />
  </g>
);

/** Микроволновка (x, y точка на столешнице). */
export const Microwave: React.FC<P> = ({ x, y = ENV_G, s, seed = 33, sw = 3, flip }) => {
  const r = rnd(seed);
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d={rc(r, -84, -106, 168, 104)} fill={PAPER} />
      <path d={rc(r, -72, -94, 104, 80, 1)} strokeWidth={sw * 0.7} />
      <path d={`M-52 -36 l26 -36 M-36 -30 l18 -24`} strokeWidth={1.4} />
      <path d={`M48 -92 h26 v14 h-26 Z M52 -62 h6 M66 -62 h6 M52 -46 h6 M66 -46 h6 M52 -30 h6 M66 -30 h6`} strokeWidth={sw * 0.6} />
    </At>
  );
};

/** Обеденный стол на четырёх ножках с тарелкой и кружкой. */
export const KitchenTable: React.FC<P & { w?: number; t?: number }> = ({ x, y, s, seed = 34, sw = 3, flip, w = 280, t }) => {
  const r = rnd(seed);
  const top = -156;
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      {[-1, 1].map((k) => <path key={k} d={`M${k * (w / 2 - 22)} ${top} L${k * (w / 2 - 14)} 0 M${k * (w / 2 - 38)} ${top} L${k * (w / 2 - 30)} 0`} />)}
      <path d={rc(r, -w / 2 + 16, top + 8, w - 32, 22)} fill={PAPER} strokeWidth={sw * 0.8} />
      <path d={rc(r, -w / 2, top - 12, w, 14)} fill={PAPER} />
      <path d={`M-70 ${top - 14} Q-30 ${top - 34} 10 ${top - 14} Z`} fill={PAPER} strokeWidth={sw * 0.8} />
      <g transform={`translate(${w * 0.28} ${top - 13})`}><Mug x={0} y={0} s={0.8} t={t} sw={sw} /></g>
    </At>
  );
};

/** Стул с рейками на спинке. */
export const KitchenChair: React.FC<P> = ({ x, y, s, sw = 3, flip }) => (
  <At x={x} y={y} s={s} sw={sw} flip={flip}>
    <path d="M-42 -112 L-46 0 M-30 -112 L-32 0 M34 -112 L42 0 M46 -112 L54 0" />
    <path d="M-46 -112 L-52 -286 M-32 -112 L-40 -286 M-54 -280 H-30 M-52 -246 H-34 M-50 -212 H-34 M-48 -176 H-32" strokeWidth={sw * 0.9} />
    <path d="M-52 -124 H58 V-108 H-52 Z" fill={PAPER} />
  </At>
);

/** Банки на столешнице (x, y центр). */
export const Jars: React.FC<P> = ({ x, y = ENV_G, s, sw = 3, flip }) => (
  <At x={x} y={y} s={s} sw={sw} flip={flip}>
    {[[-46, 72], [0, 96], [46, 60]].map(([k, h], i) => (
      <g key={i}>
        <path d={`M${k - 20} 0 V${-h + 8} Q${k - 20} ${-h} ${k - 10} ${-h} H${k + 10} Q${k + 20} ${-h} ${k + 20} ${-h + 8} V0 Z`} fill={PAPER} strokeWidth={sw * 0.85} />
        <path d={`M${k - 16} ${-h - 10} h32 v10 h-32 Z M${k - 12} ${-h * 0.42} h24`} fill={PAPER} strokeWidth={sw * 0.7} />
      </g>
    ))}
  </At>
);

// ——— Кабинет и ресепшн ———

/** Стол начальника: глухая передняя панель, телефон, лампа, стопка бумаг. */
export const BossDesk: React.FC<P & { w?: number }> = ({ x, y, s, seed = 40, sw = 3, flip, w = 460 }) => {
  const r = rnd(seed);
  const top = -176, n = 3, pw = (w - 56) / n;
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d={rc(r, -w / 2 + 10, top, w - 20, -top)} fill={PAPER} />
      {Array.from({ length: n }, (_, i) => <path key={i} d={rc(r, -w / 2 + 24 + i * pw, top + 26, pw - 14, 126, 1)} strokeWidth={sw * 0.5} />)}
      <path d={rc(r, -w / 2 - 14, top - 18, w + 28, 20)} fill={PAPER} />
      <g transform={`translate(${-w * 0.3} ${top - 18})`} strokeWidth={sw * 0.8}>
        <path d="M-34 0 L-26 -26 H26 L34 0 Z M-44 -34 Q0 -56 44 -34 L40 -24 H-40 Z" fill={PAPER} />
        <path d="M-10 -14 h20" strokeWidth={1.4} />
      </g>
      <g transform={`translate(${w * 0.32} ${top - 18})`} strokeWidth={sw * 0.8}>
        <path d="M-5 0 V-78 M-26 0 H26" />
        <path d="M-58 -78 Q0 -118 58 -78 V-68 H-58 Z" fill={PAPER} />
      </g>
      <path d={`M-30 ${top - 19} l90 -4 l5 5 l-90 4 Z M-26 ${top - 25} l90 -4 M-24 ${top - 31} l90 -4`} fill={PAPER} strokeWidth={sw * 0.6} />
    </At>
  );
};

/** Диплом в рамке (x, y это левый верхний угол). */
export const Diploma: React.FC<{ x: number; y: number; w?: number; h?: number; seed?: number; sw?: number }> = ({ x, y, w = 124, h = 164, seed = 41, sw = 3 }) => {
  const r = rnd(seed);
  return (
    <g strokeWidth={sw}>
      <path d={rc(r, x, y, w, h)} fill={PAPER} />
      <path d={rc(r, x + 10, y + 10, w - 20, h - 20, 1)} strokeWidth={sw * 0.45} />
      <path d={`M${x + 30} ${y + 36} h${w - 60} M${x + 24} ${y + 60} h${w - 48} M${x + 24} ${y + 76} h${w - 48} M${x + 24} ${y + 92} h${w - 62}`} strokeWidth={1.5} />
      <circle cx={x + w - 38} cy={y + h - 36} r={13} strokeWidth={sw * 0.6} />
      <path d={`M${x + 24} ${y + h - 30} h34`} strokeWidth={1.5} />
    </g>
  );
};

/** Стойка ресепшн: приступка, монитор со спины, терминал, звонок. */
export const ReceptionDesk: React.FC<P & { w?: number }> = ({ x, y, s, seed = 42, sw = 3, flip, w = 520 }) => {
  const r = rnd(seed);
  const top = -240;
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <g transform={`translate(${-w * 0.2} ${top})`} strokeWidth={sw * 0.85}>
        <path d="M-8 0 V-30 M8 0 V-30 M-34 0 H34" /><path d={rc(r, -74, -124, 148, 96)} fill={PAPER} /><circle cx={0} cy={-76} r={9} strokeWidth={sw * 0.5} />
      </g>
      <g transform={`translate(${w * 0.12} ${top})`} strokeWidth={sw * 0.8}>
        <path d="M-18 0 L-26 -62 H26 L18 0 Z" fill={PAPER} /><path d="M-17 -50 h34 v14 h-34 Z M-12 -24 h4 M-2 -24 h4 M8 -24 h4 M-12 -12 h4 M-2 -12 h4 M8 -12 h4" strokeWidth={1.5} />
      </g>
      <path d={`M${w * 0.32 - 22} ${top} Q${w * 0.32} ${top - 44} ${w * 0.32 + 22} ${top} Z M${w * 0.32} ${top - 34} v-8`} fill={PAPER} strokeWidth={sw * 0.8} />
      <path d={rc(r, -w / 2 + 10, top + 14, w - 20, -top - 14)} fill={PAPER} />
      <path d={rc(r, -w / 2 - 8, top, w + 16, 16)} fill={PAPER} />
      {[0.32, 0.46, 0.6].map((k) => <path key={k} d={`M${-w / 2 + 10} ${top * (1 - k)} H${w / 2 - 10}`} strokeWidth={1.5} opacity={0.6} />)}
      <path d={`M${-w / 2 + 12} -18 H${w / 2 - 12}`} strokeWidth={sw * 0.8} />
    </At>
  );
};

/** Турникет: тумба и планка. */
export const Turnstile: React.FC<P> = ({ x, y, s, seed = 43, sw = 3, flip }) => {
  const r = rnd(seed);
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d={rc(r, -36, -176, 72, 176)} fill={PAPER} />
      <path d="M-36 -146 H36 M-20 -130 h40 v44 h-40 Z" strokeWidth={sw * 0.6} />
      <circle cx={30} cy={-112} r={13} fill={PAPER} />
      <path d="M38 -116 L132 -132 M34 -102 L92 -46" strokeWidth={sw * 1.6} />
      <circle cx={-16} cy={-160} r={4} strokeWidth={1.5} /><circle cx={0} cy={-160} r={4} strokeWidth={1.5} />
    </At>
  );
};

// ——— Двор и площадка ———

/** Качели: t раскачивает сиденье. */
export const Swing: React.FC<P & { t?: number }> = ({ x, y, s, sw = 3, flip, t = 0 }) => {
  const a = Math.sin(t * 0.09) * 9;
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d="M-150 0 L-120 -320 L-90 0 M150 0 L120 -320 L90 0 M-122 -320 H122" strokeWidth={sw * 1.3} />
      <g transform={`rotate(${a} 0 -320)`}>
        <path d="M-34 -320 V-74 M34 -320 V-74" strokeWidth={sw * 0.7} strokeDasharray="10 6" />
        <path d="M-46 -74 H46 V-62 H-46 Z" fill={PAPER} />
      </g>
    </At>
  );
};

/** Горка с лесенкой. */
export const Slide: React.FC<P> = ({ x, y, s, sw = 3, flip }) => (
  <At x={x} y={y} s={s} sw={sw} flip={flip}>
    <path d="M-136 0 L-96 -230 M-104 0 L-66 -230 M-126 -48 H-96 M-118 -100 H-88 M-110 -150 H-80 M-102 -196 H-72" />
    <path d="M-104 -232 H-20 V-218 H-104 Z" fill={PAPER} />
    <path d="M-96 -232 V-300 M-28 -232 V-300 M-96 -300 Q-62 -334 -28 -300" strokeWidth={sw * 1.1} />
    <path d="M-20 -232 C60 -218 60 -60 174 -28 V-6 C40 -40 40 -196 -20 -212 Z" fill={PAPER} />
    <path d="M-30 -232 V0" strokeWidth={sw * 1.2} />
  </At>
);

/** Здание детского сада: большие окна в два этажа, козырёк, крыльцо, часы над входом. */
export const KinderHouse: React.FC<P & { w?: number; t?: number }> = ({ x, y, s, seed = 44, sw = 3, flip, w = 640, t = 0 }) => {
  const r = rnd(seed);
  const h = 400, cols = 6, cw = w / cols;
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d={rc(r, -w / 2, -h, w, h)} fill={PAPER} />
      <path d={rc(r, -w / 2 - 12, -h - 14, w + 24, 16)} fill={PAPER} />
      {[0, 1].map((row) => Array.from({ length: cols }, (_, c) => {
        if (row === 1 && (c === 2 || c === 3)) return null;
        const a = -w / 2 + c * cw + 14, b = -h + 26 + row * 186;
        return (
          <g key={`${row}-${c}`} strokeWidth={sw * 0.7}>
            <path d={rc(r, a, b, cw - 28, 124, 1)} fill={PAPER} />
            <path d={`M${a + (cw - 28) / 2} ${b} v124 M${a} ${b + 50} h${cw - 28}`} strokeWidth={sw * 0.5} />
            {row === 0 && c % 2 === 0 && <path d={`M${a + 14} ${b + 120} q6 -24 12 0 M${a + 30} ${b + 120} q6 -20 12 0`} strokeWidth={1.4} />}
          </g>
        );
      }))}
      <path d="M-104 -196 H104 L92 -176 H-92 Z" fill={PAPER} />
      <path d={rc(r, -66, -176, 132, 164)} fill={PAPER} />
      <path d="M0 -176 V-12 M-16 -96 v22 M16 -96 v22 M-52 -162 h38 v54 h-38 Z M14 -162 h38 v54 h-38 Z" strokeWidth={sw * 0.7} />
      <path d="M-104 -12 H104 V0 H-104 Z" fill={PAPER} />
      <Clock x={0} y={-296} r={44} hour={6 * 30 + 12} min={(144 + t * 0.6) % 360} />
    </At>
  );
};

/** Ворота: два столба и створка из прутьев. */
export const Gate: React.FC<P & { w?: number; h?: number }> = ({ x, y, s, seed = 45, sw = 3, flip, w = 210, h = 170 }) => {
  const r = rnd(seed);
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d={rc(r, -w / 2, -h + 6, w, h - 6)} fill={PAPER} />
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${-w / 2 + ((i + 1) * w) / 10} ${-h + 6} V0`} strokeWidth={sw * 0.7} />)}
      {[-1, 1].map((k) => <path key={k} d={rc(r, k * (w / 2 + 12) - 12, -h - 22, 24, h + 22)} fill={PAPER} />)}
      <circle cx={w / 2 - 22} cy={-h * 0.5} r={7} fill={PAPER} strokeWidth={sw * 0.7} />
    </At>
  );
};

/** Детские шкафчики с картинками и скамейка. */
export const KidLockers: React.FC<P & { n?: number; h?: number }> = ({ x, y, s, seed = 46, sw = 3, flip, n = 6, h = 330 }) => {
  const r = rnd(seed);
  const cw = 90;
  const sign = (cx: number, cy: number, i: number) => {
    const c = i % 4;
    if (c === 0) return <circle cx={cx} cy={cy} r={12} strokeWidth={sw * 0.7} />;
    if (c === 1) return <path d={`M${cx - 13} ${cy + 11} L${cx} ${cy - 13} L${cx + 13} ${cy + 11} Z`} strokeWidth={sw * 0.7} />;
    if (c === 2) return <path d={`M${cx - 12} ${cy - 12} h24 v24 h-24 Z`} strokeWidth={sw * 0.7} />;
    return <path d={`M${cx} ${cy + 13} C${cx - 22} ${cy - 2} ${cx - 12} ${cy - 18} ${cx} ${cy - 6} C${cx + 12} ${cy - 18} ${cx + 22} ${cy - 2} ${cx} ${cy + 13} Z`} strokeWidth={sw * 0.7} />;
  };
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      {Array.from({ length: n }, (_, i) => {
        const a = -(n * cw) / 2 + i * cw;
        return (
          <g key={i}>
            <path d={rc(r, a, -h, cw, h - 14, 1)} fill={PAPER} />
            <path d={`M${a + 28} ${-h + 18} q17 -10 34 0 M${a + 74} ${-h * 0.46} v26`} strokeWidth={sw * 0.8} />
            {sign(a + cw / 2, -h + 56, i)}
          </g>
        );
      })}
      <path d={rc(r, -(n * cw) / 2 - 6, -86, n * cw + 12, 14)} fill={PAPER} />
      <path d={`M${-(n * cw) / 2 + 28} -72 V0 M${(n * cw) / 2 - 28} -72 V0`} strokeWidth={sw * 1.2} />
    </At>
  );
};

/** Детские рисунки на стене: солнце, домик, цветок. */
export const KidDrawings: React.FC<{ x: number; y: number; n?: number; seed?: number; sw?: number }> = ({ x, y, n = 3, seed = 47, sw = 3 }) => {
  const r = rnd(seed);
  return (
    <g strokeWidth={sw}>
      {Array.from({ length: n }, (_, i) => {
        const a = x + i * 158, b = y + r() * 16, rot = (r() - 0.5) * 7;
        return (
          <g key={i} transform={`rotate(${rot} ${a + 66} ${b + 54})`}>
            <path d={rc(r, a, b, 132, 106)} fill={PAPER} />
            {i % 3 === 0 && <g strokeWidth={sw * 0.7}><circle cx={a + 66} cy={b + 54} r={20} />{[0, 1, 2, 3, 4, 5, 6, 7].map((q) => <path key={q} d={`M${a + 66 + Math.cos(q * 0.785) * 27} ${b + 54 + Math.sin(q * 0.785) * 27} L${a + 66 + Math.cos(q * 0.785) * 40} ${b + 54 + Math.sin(q * 0.785) * 40}`} />)}</g>}
            {i % 3 === 1 && <path d={`M${a + 36} ${b + 90} V${b + 52} L${a + 66} ${b + 22} L${a + 96} ${b + 52} V${b + 90} Z M${a + 58} ${b + 90} v-22 h16 v22`} strokeWidth={sw * 0.7} />}
            {i % 3 === 2 && <path d={`M${a + 66} ${b + 96} V${b + 52} M${a + 66} ${b + 42} m-12 0 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0 M${a + 66} ${b + 76} q18 -18 28 -6`} strokeWidth={sw * 0.7} />}
            <circle cx={a + 66} cy={b + 3} r={3.5} fill={INK} stroke="none" />
          </g>
        );
      })}
    </g>
  );
};

// ——— Магазин и кино ———

/** Стеллаж с товаром и ценниками. */
export const StoreShelf: React.FC<P & { w?: number; h?: number; n?: number }> = ({ x, y, s, seed = 48, sw = 3, flip, w = 280, h = 560, n = 5 }) => {
  const r = rnd(seed);
  const step = (h - 40) / n;
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d={rc(r, -w / 2, -h, w, h)} fill={PAPER} />
      {Array.from({ length: n }, (_, i) => {
        const base = -i * step - 24;
        const items: React.ReactNode[] = [];
        let px = -w / 2 + 10, q = 0;
        const kind = i % 3;
        while (px < w / 2 - 40) {
          const bw = kind === 1 ? 26 : 38 + r() * 12, bh = step * (0.5 + r() * 0.24);
          items.push(kind === 1
            ? <path key={q++} d={`M${px} ${base} V${base - bh * 0.7} L${px + 8} ${base - bh} H${px + 18} L${px + 26} ${base - bh * 0.7} V${base} Z`} fill={PAPER} strokeWidth={sw * 0.6} />
            : <path key={q++} d={rc(r, px, base - bh, bw, bh, 0.8)} fill={PAPER} strokeWidth={sw * 0.6} />);
          if (kind !== 1) items.push(<path key={q++} d={`M${px + 7} ${base - bh * 0.55} h${bw - 14}`} strokeWidth={1.2} />);
          px += bw + 4;
        }
        return (
          <g key={i}>
            {items}
            <path d={`M${-w / 2} ${base} H${w / 2}`} strokeWidth={sw * 1.1} />
            {[-0.3, 0.2].map((k) => <path key={k} d={rc(r, w * k, base + 2, 34, 18, 0.5)} fill={PAPER} strokeWidth={sw * 0.5} />)}
          </g>
        );
      })}
    </At>
  );
};

/** Подвесная табличка акции (x это центр, y потолок). */
export const PromoSign: React.FC<{ x: number; y?: number; text: string; w?: number; len?: number; seed?: number; sw?: number; t?: number }> = ({ x, y = CEIL, text, w = 240, len = 44, seed = 49, sw = 3, t = 0 }) => {
  const r = rnd(seed);
  return (
    <g transform={`translate(${x} ${y}) rotate(${Math.sin(t * 0.05) * 1.2})`} strokeWidth={sw}>
      <path d={`M${-w * 0.34} 0 V${len} M${w * 0.34} 0 V${len}`} strokeWidth={1.6} />
      <path d={rc(r, -w / 2, len, w, 104)} fill={PAPER} />
      <path d={rc(r, -w / 2 + 9, len + 9, w - 18, 86, 1)} strokeWidth={sw * 0.5} />
      <Tx x={0} y={len + 72} size={60}>{text}</Tx>
    </g>
  );
};

/** Касса: лента, монитор, терминал. */
export const Checkout: React.FC<P & { w?: number; t?: number }> = ({ x, y, s, seed = 50, sw = 3, flip, w = 380, t = 0 }) => {
  const r = rnd(seed);
  const off = (t * 2) % 34;
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d={rc(r, -w / 2, -172, w, 172)} fill={PAPER} />
      <path d={`M${-w / 2} -130 H${w / 2} M${-w / 2 + 24} -20 H${w / 2 - 24}`} strokeWidth={sw * 0.75} />
      {[-0.28, 0.1].map((k) => <path key={k} d={rc(r, w * k, -112, 90, 76, 1)} strokeWidth={sw * 0.5} />)}
      <path d={rc(r, -w / 2 - 6, -186, w * 0.68, 16)} fill={PAPER} />
      {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${-w / 2 + 6 + i * 34 + off} -186 v14`} strokeWidth={1.3} opacity={0.65} />)}
      <g transform={`translate(${w * 0.32} -172)`} strokeWidth={sw * 0.85}>
        <path d="M-6 0 V-78 M6 0 V-78" /><path d={rc(r, -62, -160, 124, 86)} fill={PAPER} /><path d="M-44 -136 h70 M-44 -116 h46 M-44 -96 h60" strokeWidth={1.4} />
      </g>
      <path d={`M${w * 0.08} -186 l-5 -36 h32 l-5 36 Z`} fill={PAPER} strokeWidth={sw * 0.75} />
    </At>
  );
};

/** Стопка корзин. */
export const BasketStack: React.FC<P & { n?: number }> = ({ x, y, s, sw = 3, flip, n = 5 }) => (
  <At x={x} y={y} s={s} sw={sw} flip={flip}>
    <path d="M-62 -86 L-48 0 H48 L62 -86 Z" fill={PAPER} />
    {[-30, -10, 10, 30].map((k) => <path key={k} d={`M${k * 1.3} -86 L${k} 0`} strokeWidth={1.3} />)}
    <path d="M-56 -56 H56 M-52 -28 H52" strokeWidth={1.3} />
    {Array.from({ length: n }, (_, i) => <path key={i} d={`M-66 ${-92 - i * 11} H66`} strokeWidth={sw * 0.8} />)}
    <path d={`M-48 ${-92 - (n - 1) * 11} Q0 ${-168 - n * 11} 48 ${-92 - (n - 1) * 11}`} strokeWidth={sw * 0.9} />
  </At>
);

/** Ящик с плодами (x, y точка на прилавке). */
export const Crate: React.FC<P & { w?: number }> = ({ x, y = ENV_G, s, seed = 51, sw = 3, flip, w = 150 }) => {
  const r = rnd(seed);
  const n = Math.floor(w / 42);
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      {Array.from({ length: n }, (_, i) => <circle key={i} cx={-w / 2 + 22 + i * ((w - 44) / Math.max(1, n - 1))} cy={-68 - r() * 5} r={20} fill={PAPER} strokeWidth={sw * 0.8} />)}
      <path d={rc(r, -w / 2, -66, w, 66)} fill={PAPER} />
      <path d={`M${-w / 2} -44 H${w / 2} M${-w / 2} -22 H${w / 2}`} strokeWidth={sw * 0.7} />
    </At>
  );
};

/** Уличный прилавок: полосатый тент, столбы, ящики, весы. */
export const Stall: React.FC<P & { w?: number; tag?: string }> = ({ x, y, s, seed = 52, sw = 3, w = 640, tag = '3+1' }) => {
  const r = rnd(seed);
  const n = 10, d = w / n, top = -176;
  return (
    <At x={x} y={y} s={s} sw={sw}>
      <rect x={-w / 2 + 14} y={-470} width={w - 28} height={320} fill={PAPER} stroke="none" />
      {[-1, 1].map((k) => <path key={k} d={`M${k * (w / 2 - 14)} 0 V-470`} strokeWidth={sw * 1.3} />)}
      {Array.from({ length: n }, (_, i) => <path key={i} d={`M${-w / 2 + i * d} -500 H${-w / 2 + (i + 1) * d} L${-w / 2 + (i + 1) * d + 3} -440 q${-d / 2} 18 ${-d} 0 Z`} fill={i % 2 ? PAPER : INK} strokeWidth={sw * 0.8} />)}
      <path d={rc(r, -w / 2 + 6, top + 14, w - 12, -top - 14)} fill={PAPER} />
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${-w / 2 + 6 + ((i + 1) * (w - 12)) / 10} ${top + 22} V-8`} strokeWidth={1.3} opacity={0.55} />)}
      <path d={rc(r, -w / 2, top, w, 16)} fill={PAPER} />
      <Crate x={-w * 0.33} y={top} seed={seed + 1} />
      <Crate x={-w * 0.07} y={top} seed={seed + 2} w={130} />
      <g transform={`translate(${w * 0.32} ${top})`} strokeWidth={sw * 0.85}>
        <path d="M-44 0 V-12 H44 V0 Z M0 -12 V-46 M-52 -46 Q0 -32 52 -46" fill={PAPER} />
        <circle cx={0} cy={-76} r={28} fill={PAPER} /><path d="M0 -76 l14 -14" strokeWidth={sw * 0.7} />
      </g>
      <g transform={`translate(${w * 0.15} ${top})`} strokeWidth={sw * 0.8}>
        <path d="M0 0 V-80" /><path d={rc(r, -38, -130, 76, 54)} fill={PAPER} /><Tx x={0} y={-92} size={36}>{tag}</Tx>
      </g>
    </At>
  );
};

/** Афиша (x, y это левый верхний угол); kind 0 ракета, 1 сердце, 2 призрак. */
export const Poster: React.FC<{ x: number; y: number; w?: number; h?: number; kind?: number; seed?: number; sw?: number }> = ({ x, y, w = 148, h = 212, kind = 0, seed = 53, sw = 3 }) => {
  const r = rnd(seed);
  const cx = x + w / 2, cy = y + h * 0.42;
  return (
    <g strokeWidth={sw}>
      <path d={rc(r, x, y, w, h)} fill={PAPER} />
      <path d={rc(r, x + 9, y + 9, w - 18, h - 18, 1)} strokeWidth={sw * 0.45} />
      {kind % 3 === 0 && <path d={`M${cx} ${cy - 58} Q${cx + 28} ${cy - 22} ${cx + 18} ${cy + 26} H${cx - 18} Q${cx - 28} ${cy - 22} ${cx} ${cy - 58} Z M${cx - 18} ${cy + 8} l-18 28 l20 -6 M${cx + 18} ${cy + 8} l18 28 l-20 -6 M${cx - 8} ${cy + 34} l8 22 l8 -22`} strokeWidth={sw * 0.8} />}
      {kind % 3 === 1 && <path d={`M${cx} ${cy + 44} C${cx - 76} ${cy - 8} ${cx - 44} ${cy - 62} ${cx} ${cy - 22} C${cx + 44} ${cy - 62} ${cx + 76} ${cy - 8} ${cx} ${cy + 44} Z`} strokeWidth={sw * 0.8} />}
      {kind % 3 === 2 && <path d={`M${cx - 36} ${cy + 50} V${cy - 16} Q${cx} ${cy - 76} ${cx + 36} ${cy - 16} V${cy + 50} l-12 -12 l-12 12 l-12 -12 l-12 12 l-12 -12 Z M${cx - 14} ${cy - 18} v8 M${cx + 14} ${cy - 18} v8`} strokeWidth={sw * 0.8} />}
      <path d={`M${x + 26} ${y + h - 48} h${w - 52} M${x + 40} ${y + h - 30} h${w - 80}`} strokeWidth={sw * 0.7} />
    </g>
  );
};

/** Стойка попкорна: аппарат и стаканы трёх размеров. */
export const PopcornCounter: React.FC<P & { w?: number }> = ({ x, y, s, seed = 54, sw = 3, flip, w = 520 }) => {
  const r = rnd(seed);
  const top = -220;
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d={rc(r, -w / 2 + 12, top + 14, w - 24, -top - 14)} fill={PAPER} />
      {[0, 1, 2, 3].map((i) => <path key={i} d={rc(r, -w / 2 + 28 + i * ((w - 56) / 4), top + 40, (w - 56) / 4 - 14, 150, 1)} strokeWidth={sw * 0.45} />)}
      <path d={rc(r, -w / 2 - 8, top, w + 16, 16)} fill={PAPER} />
      <g transform={`translate(${w * 0.26} ${top})`}>
        <path d={rc(r, -100, -216, 200, 216)} fill={PAPER} />
        <path d={`M-100 -176 H100 M-100 -68 H100`} strokeWidth={sw * 0.75} />
        <path d="M-92 -68 q12 -30 28 -14 q10 -26 28 -8 q14 -28 30 -6 q14 -26 30 -4 q14 -24 30 -2 q10 -18 28 -6 V-68 Z" fill={PAPER} strokeWidth={sw * 0.7} />
        <path d="M-64 -210 l14 -28 h100 l14 28" strokeWidth={sw * 0.8} />
        <path d="M-72 -158 l26 -38 M-54 -146 l18 -28" strokeWidth={1.4} />
        <path d="M-60 -44 H60 M-30 -22 h60" strokeWidth={sw * 0.6} />
      </g>
      {[[-0.4, 62, 34], [-0.26, 92, 42], [-0.09, 124, 52]].map(([k, h, d], i) => (
        <g key={i} transform={`translate(${w * k} ${top})`} strokeWidth={sw * 0.85}>
          <path d={`M${-d / 2 - 8} ${-h - 2} q${d / 4} -20 ${d / 2} -6 q${d / 4} -18 ${d / 2} -2 q10 -6 16 8 Z`} fill={PAPER} strokeWidth={sw * 0.7} />
          <path d={`M${-d / 2} 0 L${-d / 2 - 8} ${-h} H${d / 2 + 8} L${d / 2} 0 Z`} fill={PAPER} />
          <path d={`M${-d / 5} 0 L${-d / 4} ${-h} M${d / 5} 0 L${d / 4} ${-h}`} strokeWidth={sw * 0.6} />
        </g>
      ))}
    </At>
  );
};

/** Столбики с канатом от x1 до x2. */
export const Rope: React.FC<{ x1: number; x2: number; y?: number; n?: number; sw?: number }> = ({ x1, x2, y = ENV_G, n = 2, sw = 3 }) => {
  const step = (x2 - x1) / n;
  return (
    <g strokeWidth={sw}>
      {Array.from({ length: n }, (_, i) => <path key={i} d={`M${x1 + i * step} ${y - 138} Q${x1 + i * step + step / 2} ${y - 74} ${x1 + (i + 1) * step} ${y - 138}`} strokeWidth={sw * 1.3} />)}
      {Array.from({ length: n + 1 }, (_, i) => <path key={i} d={`M${x1 + i * step} ${y} V${y - 150} M${x1 + i * step - 26} ${y} H${x1 + i * step + 26}`} strokeWidth={sw * 1.2} />)}
      {Array.from({ length: n + 1 }, (_, i) => <circle key={i} cx={x1 + i * step} cy={y - 158} r={8} fill={PAPER} strokeWidth={sw * 0.8} />)}
    </g>
  );
};

/** Касса кинотеатра: окошко с решёткой, надпись, лоток. */
export const TicketBooth: React.FC<{ x: number; y?: number; s?: number; seed?: number; sw?: number; w?: number }> = ({ x, y = ENV_G, s = 1, seed = 55, sw = 3, w = 340 }) => {
  const r = rnd(seed);
  return (
    <At x={x} y={y} s={s} sw={sw}>
      <path d={rc(r, -w / 2, -500, w, 500)} fill={PAPER} />
      <path d={rc(r, -w / 2 - 12, -560, w + 24, 62)} fill={PAPER} />
      <Tx x={0} y={-512} size={44}>КАССА</Tx>
      <path d={`M-96 -220 V-384 Q0 -460 96 -384 V-220 Z`} fill={PAPER} />
      {[-64, -32, 0, 32, 64].map((k) => <path key={k} d={`M${k} -220 V${-400 + Math.abs(k) * 0.3 - 16}`} strokeWidth={1.5} opacity={0.75} />)}
      <path d="M-124 -218 H124 V-204 H-124 Z" fill={PAPER} />
      <path d="M-46 -218 q46 -30 92 0" fill={PAPER} strokeWidth={sw * 0.8} />
      <path d={rc(r, -w / 2 + 18, -176, w - 36, 150, 1)} strokeWidth={sw * 0.5} />
    </At>
  );
};

// ——— Велопарковка и старый город ———

/** Велосипед в профиль. */
export const Bike: React.FC<P> = ({ x, y, s, sw = 3, flip }) => (
  <At x={x} y={y} s={s} sw={sw} flip={flip}>
    {[-98, 98].map((k) => (
      <g key={k}>
        <circle cx={k} cy={-56} r={56} fill={PAPER} /><circle cx={k} cy={-56} r={47} strokeWidth={sw * 0.5} />
        {[0, 1, 2, 3, 4, 5].map((q) => <path key={q} d={`M${k} -56 L${k + Math.cos(q * 1.05) * 47} ${-56 + Math.sin(q * 1.05) * 47}`} strokeWidth={1.1} opacity={0.7} />)}
      </g>
    ))}
    <path d="M-98 -56 L-40 -150 L58 -150 L-6 -56 Z M-98 -56 H-6 M-40 -150 L-6 -56 M58 -150 L98 -56 M58 -150 L50 -182" strokeWidth={sw * 1.05} />
    <path d="M-40 -150 L-48 -176 M-72 -178 H-26 M32 -184 Q50 -192 78 -180 Q88 -172 76 -164" strokeWidth={sw * 1.2} />
    <circle cx={-6} cy={-56} r={14} fill={PAPER} strokeWidth={sw * 0.8} />
    <path d="M-20 -36 h28 M8 -76 l-14 20" strokeWidth={sw} />
  </At>
);

/** Навес велопарковки на стойках с дугами и велосипедами. */
export const BikeShed: React.FC<P & { w?: number; n?: number }> = ({ x, y, s, sw = 3, flip, w = 640, n = 3 }) => {
  const cn = Math.floor(w / 40);
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      {[-1, 0, 1].map((k) => <path key={k} d={`M${k * (w / 2 - 24) - 5} 0 V-392 M${k * (w / 2 - 24) + 5} 0 V-392`} />)}
      <path d={`M${-w / 2 - 22} -388 L${-w / 2 - 22} -408 L${w / 2 + 22} -444 L${w / 2 + 22} -424 Z`} fill={PAPER} />
      {Array.from({ length: cn }, (_, i) => {
        const a = -w / 2 + (i * w) / cn;
        return <path key={i} d={`M${a} ${-392 - ((a + w / 2) * 36) / w} v-18`} strokeWidth={1.3} opacity={0.65} />;
      })}
      <path d={`M${-w / 2 + 40} -60 H${w / 2 - 40}`} strokeWidth={sw * 1.2} />
      {Array.from({ length: n }, (_, i) => <Bike key={i} x={-w / 2 + (w * (i + 0.5)) / n} y={0} s={0.68} sw={sw} flip={i % 2 === 1} />)}
    </At>
  );
};

/** Низкий дом старого города: зубчатый парапет, арочные окна, балкон, трещины. */
export const OldHouse: React.FC<P & { w?: number; h?: number; door?: boolean }> = ({ x, y, s, seed = 57, sw = 3, flip, w = 320, h = 460, door = true }) => {
  const r = rnd(seed);
  const cols = Math.max(2, Math.floor(w / 110)), cw = w / cols, rows = Math.max(1, Math.floor((h - 220) / 150) + 1);
  const n = Math.floor(w / 34);
  let parapet = `M${-w / 2} ${-h}`;
  for (let i = 0; i < n; i++) parapet += ` v-20 h${w / n / 2} v20 h${w / n / 2}`;
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d={`${parapet} V0 H${-w / 2} Z`} fill={PAPER} />
      <path d={`M${-w / 2} ${-h + 16} H${w / 2}`} strokeWidth={sw * 0.7} />
      {Array.from({ length: rows }, (_, row) => Array.from({ length: cols }, (_, c) => {
        const a = -w / 2 + c * cw + cw / 2, b = -h + 46 + row * 150;
        return (
          <g key={`${row}-${c}`} strokeWidth={sw * 0.8}>
            <path d={`M${a - 26} ${b + 104} V${b + 30} Q${a} ${b - 12} ${a + 26} ${b + 30} V${b + 104} Z`} fill={PAPER} />
            <path d={`M${a} ${b + 12} V${b + 104} M${a - 26} ${b + 56} H${a + 26}`} strokeWidth={sw * 0.5} />
            <path d={`M${a - 38} ${b + 108} H${a + 38}`} strokeWidth={sw * 1.1} />
            {r() < 0.4 && <path d={`M${a - 34} ${b + 108} v22 h68 v-22 M${a - 18} ${b + 108} v22 M${a} ${b + 108} v22 M${a + 18} ${b + 108} v22`} strokeWidth={sw * 0.6} />}
          </g>
        );
      }))}
      {door && <g><path d="M-44 0 V-112 Q0 -176 44 -112 V0 Z" fill={PAPER} /><path d="M0 -146 V0 M-30 -60 h16 M14 -60 h16" strokeWidth={sw * 0.7} /></g>}
      {[0, 1, 2].map((i) => {
        const a = -w / 2 + 16 + r() * (w - 60), b = -h + 40 + r() * (h - 120);
        return <path key={i} d={`M${a} ${b} l14 22 l-8 18 l16 24`} strokeWidth={1.3} opacity={0.7} />;
      })}
    </At>
  );
};

/** Дальний купол с минаретами. */
export const FarDome: React.FC<{ x: number; y?: number; s?: number; sw?: number }> = ({ x, y = ENV_G, s = 1, sw = 2 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} strokeWidth={sw}>
    {[-1, 1].map((k) => <path key={k} d={`M${k * 176} 0 V-430 M${k * 150} 0 V-430 M${k * 182} -430 H${k * 144} L${k * 163} -486 Z M${k * 186} -300 H${k * 140}`} fill={PAPER} />)}
    <path d="M-110 0 V-190 H110 V0 Z" fill={PAPER} />
    <path d="M-92 -190 C-130 -300 -30 -340 0 -392 C30 -340 130 -300 92 -190 Z" fill={PAPER} />
    <path d="M0 -392 V-430 M-44 0 V-96 Q0 -160 44 -96 V0" />
  </g>
);

/** Пальма. */
export const Palm: React.FC<P & { t?: number }> = ({ x, y, s, sw = 3, flip, t = 0 }) => {
  const sway = Math.sin(t * 0.05) * 5;
  const lean = 62;
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d={`M-18 0 Q-6 -220 ${lean - 10} -440 M18 0 Q34 -220 ${lean + 10} -438`} />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => <path key={i} d={`M-8 ${-34 - i * 42} q${16 + i} 8 ${36 - i * 2} 0`} strokeWidth={1.4} />)}
      {[-150, -96, -52, 40, 92, 142].map((ax, i) => {
        const ay = -440 - (i % 2 ? 80 : 30) + Math.abs(ax) * 0.5;
        return <path key={ax} d={`M${lean} -442 Q${lean + ax * 0.6} ${ay - 60 + sway} ${lean + ax} ${ay + 54 + sway} Q${lean + ax * 0.5} ${ay + 6 + sway} ${lean} -432 Z`} fill={PAPER} strokeWidth={sw * 0.85} />;
      })}
    </At>
  );
};

/** Деревянный сарай: дощатые стены, односкатная крыша, щели. */
export const WoodShed: React.FC<P & { w?: number }> = ({ x, y, s, seed = 58, sw = 3, flip, w = 300 }) => {
  const r = rnd(seed);
  const n = Math.round(w / 30);
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d={`M${-w / 2} 0 V-246 L${w / 2} -300 V0 Z`} fill={PAPER} />
      {Array.from({ length: n - 1 }, (_, i) => {
        const a = -w / 2 + ((i + 1) * w) / n;
        return <path key={i} d={ln(r, a, -246 - ((a + w / 2) * 54) / w, a, 0, 2)} strokeWidth={1.7} />;
      })}
      <path d={`M${-w / 2 - 26} -240 L${w / 2 + 26} -306 L${w / 2 + 26} -290 L${-w / 2 - 26} -224 Z`} fill={PAPER} />
      <path d={rc(r, -w * 0.3, -176, w * 0.34, 176)} fill={PAPER} />
      <path d={`M${-w * 0.3} -120 h${w * 0.34} M${-w * 0.3} -44 h${w * 0.34} M${-w * 0.3} -176 l${w * 0.34} 56 M${-w * 0.3} -44 l${w * 0.34} -76`} strokeWidth={sw * 0.7} />
      <path d={rc(r, w * 0.14, -194, 66, 52, 1)} fill={PAPER} strokeWidth={sw * 0.7} />
      <path d={`M${w * 0.14 + 33} -194 v52 M${w * 0.14} -168 h66`} strokeWidth={sw * 0.5} />
    </At>
  );
};

/** Плетёная корзина со змеёй: t покачивает кобру. */
export const SnakeBasket: React.FC<P & { t?: number }> = ({ x, y, s, sw = 3, flip, t = 0 }) => {
  const w = Math.sin(t * 0.14) * 7;
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d={`M0 -90 C${-30 + w} -130 ${34 + w} -170 ${w * 1.4} -224`} strokeWidth={sw * 2.2} />
      <path d={`M${w * 1.4 - 22} -226 Q${w * 1.4} -274 ${w * 1.4 + 22} -226 Q${w * 1.4 + 10} -204 ${w * 1.4} -204 Q${w * 1.4 - 10} -204 ${w * 1.4 - 22} -226 Z`} fill={PAPER} />
      <circle cx={w * 1.4 - 7} cy={-238} r={2.4} fill={INK} stroke="none" /><circle cx={w * 1.4 + 7} cy={-238} r={2.4} fill={INK} stroke="none" />
      <path d="M-60 -88 Q-82 -40 -50 0 H50 Q82 -40 60 -88 Z" fill={PAPER} />
      <path d="M-66 -88 H66" strokeWidth={sw * 1.4} />
      {[-66, -46, -24].map((yy) => <path key={yy} d={`M-68 ${yy} q17 10 34 0 t34 0 t34 0 t34 0`} strokeWidth={1.4} />)}
    </At>
  );
};

// ——— Цех и склад ———

/** Окно цеха: мелкая расстекловка (x1…x2 по стене). */
export const GridWin: React.FC<{ x1: number; x2: number; y: number; h: number; cols?: number; rows?: number; seed?: number; sw?: number }> = ({ x1, x2, y, h, cols = 12, rows = 4, seed = 59, sw = 2.2 }) => {
  const r = rnd(seed);
  const cw = (x2 - x1) / cols, rh = h / rows;
  return (
    <Far o={0.65}>
      <g strokeWidth={sw}>
        <rect x={x1} y={y} width={x2 - x1} height={h} fill={PAPER} />
        {Array.from({ length: cols - 1 }, (_, i) => <path key={i} d={`M${x1 + (i + 1) * cw} ${y} V${y + h}`} strokeWidth={(i + 1) % 4 === 0 ? sw * 1.6 : sw * 0.6} />)}
        {Array.from({ length: rows - 1 }, (_, i) => <path key={i} d={`M${x1} ${y + (i + 1) * rh} H${x2}`} strokeWidth={sw * 0.6} />)}
        {Array.from({ length: 5 }, (_, i) => {
          const a = x1 + Math.floor(r() * cols) * cw, b = y + Math.floor(r() * rows) * rh;
          return <path key={i} d={`M${a + 8} ${b + rh - 8} L${a + cw - 8} ${b + 8}`} strokeWidth={1.3} />;
        })}
      </g>
    </Far>
  );
};

/** Чертёжный стол: наклонная доска с чертежом, рейсшина, подставка. */
export const DraftingTable: React.FC<P> = ({ x, y, s, seed = 60, sw = 3, flip }) => {
  const r = rnd(seed);
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d="M-84 0 L0 -226 L84 0 M-100 0 H-60 M60 0 H100 M-50 -96 H50" strokeWidth={sw * 1.2} />
      <g transform="translate(0 -238) rotate(-16)">
        <path d={rc(r, -170, -100, 340, 200)} fill={PAPER} />
        <path d={rc(r, -146, -80, 292, 160, 1)} strokeWidth={sw * 0.5} />
        <circle cx={-64} cy={-4} r={46} strokeWidth={sw * 0.6} /><circle cx={-64} cy={-4} r={18} strokeWidth={sw * 0.6} />
        <path d="M-126 -4 H0 M-64 -66 V58 M16 -56 h110 v96 h-110 Z M16 -20 h110 M60 -56 v96" strokeWidth={sw * 0.5} />
        <path d="M-184 66 H184 M-184 78 H184" strokeWidth={sw * 0.85} />
      </g>
    </At>
  );
};

/** Токарный станок. */
export const Lathe: React.FC<P & { t?: number }> = ({ x, y, s, seed = 61, sw = 3, flip, t = 0 }) => {
  const r = rnd(seed);
  const spin = (t * 9) % 26;
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      {[-1, 1].map((k) => <path key={k} d={rc(r, k * 150 - 62, -170, 124, 170)} fill={PAPER} />)}
      <path d={`M-212 -104 H-88 M88 -104 H212 M-180 -66 h60 M120 -66 h60`} strokeWidth={sw * 0.7} />
      <path d={rc(r, -226, -196, 452, 28)} fill={PAPER} />
      <path d={rc(r, -218, -326, 130, 130)} fill={PAPER} />
      <circle cx={-190} cy={-288} r={12} strokeWidth={sw * 0.7} /><circle cx={-152} cy={-288} r={12} strokeWidth={sw * 0.7} /><path d="M-204 -240 h96 M-204 -222 h60" strokeWidth={1.5} />
      <path d={rc(r, -88, -300, 34, 78)} fill={PAPER} />
      <path d="M-54 -280 H120 M-54 -242 H120" />
      {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${-48 + i * 26 + spin} -280 l-10 38`} strokeWidth={1.3} opacity={0.65} />)}
      <path d={rc(r, 120, -306, 92, 110)} fill={PAPER} />
      <path d="M212 -256 H246 M246 -278 V-234" strokeWidth={sw * 1.3} />
      <path d="M-14 -196 V-222 H60 V-196 M6 -222 V-234 L20 -242" fill={PAPER} strokeWidth={sw * 0.85} />
    </At>
  );
};

/** Верстак с тисками, шестернёй и ящиками. */
export const Workbench: React.FC<P & { w?: number }> = ({ x, y, s, seed = 62, sw = 3, flip, w = 460 }) => {
  const r = rnd(seed);
  const top = -186;
  const gear = Array.from({ length: 10 }, (_, i) => {
    const a = (i * Math.PI) / 5;
    return `M${Math.cos(a) * 32} ${-46 + Math.sin(a) * 32} L${Math.cos(a) * 44} ${-46 + Math.sin(a) * 44}`;
  }).join(' ');
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      {[-1, 1].map((k) => <path key={k} d={`M${k * (w / 2 - 24)} ${top} V0`} strokeWidth={sw * 2.6} />)}
      <path d={rc(r, w / 2 - 160, top + 16, 124, 110)} fill={PAPER} />
      {[0, 1].map((i) => <path key={i} d={`M${w / 2 - 160} ${top + 16 + (i + 1) * 36} h124`} strokeWidth={sw * 0.75} />)}
      <path d={`M${-w / 2 + 24} -52 H${w / 2 - 24}`} strokeWidth={sw * 1.3} />
      <path d={rc(r, -w / 2, top - 18, w, 20)} fill={PAPER} />
      <g transform={`translate(${-w * 0.3} ${top - 18})`} strokeWidth={sw * 0.9}>
        <path d="M-44 0 V-22 H44 V0 Z M-34 -22 V-66 H-8 V-22 M34 -22 V-58 H8 V-22" fill={PAPER} />
        <path d="M34 -40 H78 M78 -56 V-24" strokeWidth={sw * 1.2} />
      </g>
      <g transform={`translate(${w * 0.16} ${top - 18})`} strokeWidth={sw * 0.9}>
        <circle cx={0} cy={-46} r={34} fill={PAPER} /><circle cx={0} cy={-46} r={11} /><path d={gear} strokeWidth={sw * 1.5} />
      </g>
    </At>
  );
};

/** Перфорированная панель с инструментами (x, y это левый верхний угол). */
export const Pegboard: React.FC<{ x: number; y: number; w?: number; h?: number; seed?: number; sw?: number }> = ({ x, y, w = 240, h = 170, seed = 63, sw = 3 }) => {
  const r = rnd(seed);
  return (
    <g strokeWidth={sw}>
      <path d={rc(r, x, y, w, h)} fill={PAPER} />
      <g transform={`translate(${x + 44} ${y + 26})`} strokeWidth={sw * 0.9}>
        <path d="M-5 0 V116 H5 V0 Z" fill={PAPER} /><path d="M-30 0 H30 V-14 H-30 Z" transform="translate(0 16)" fill={PAPER} />
      </g>
      <g transform={`translate(${x + 112} ${y + 28})`} strokeWidth={sw * 0.9}>
        <path d="M-5 26 V118 H5 V26 M-16 0 L-16 18 Q0 34 16 18 L16 0 L6 0 V12 H-6 V0 Z" fill={PAPER} />
      </g>
      <g transform={`translate(${x + 178} ${y + 24})`} strokeWidth={sw * 0.9}>
        <path d="M-22 0 H22 L18 34 H10 L4 116 H-4 L-10 34 H-18 Z" fill={PAPER} />
        <path d="M-12 12 H12" strokeWidth={1.5} />
      </g>
    </g>
  );
};

/** Паллета. */
const Pallet: React.FC<{ w: number; sw: number }> = ({ w, sw }) => (
  <g strokeWidth={sw * 0.8}>
    <path d={`M${-w / 2} -22 H${w / 2} M${-w / 2} -28 H${w / 2} M${-w / 2} 0 H${w / 2}`} />
    {[-1, 0, 1].map((k) => <path key={k} d={`M${k * (w / 2 - 14) - 12} -24 h24 v24 h-24 Z`} fill={PAPER} />)}
  </g>
);

/** Коробка со скотчем и стрелкой. */
const Box: React.FC<{ x: number; y: number; w: number; h: number; r: Rnd; sw: number }> = ({ x, y, w, h, r, sw }) => (
  <g strokeWidth={sw}>
    <path d={rc(r, x, y, w, h, 1)} fill={PAPER} />
    <path d={`M${x + w / 2 - 9} ${y} v${h * 0.3} h18 v${-h * 0.3}`} strokeWidth={sw * 0.55} />
    <path d={`M${x + 12} ${y + h - 12} v-22 m-6 8 l6 -8 l6 8 M${x + 30} ${y + h - 12} v-22 m-6 8 l6 -8 l6 8`} strokeWidth={sw * 0.5} />
  </g>
);

/** Штабель коробок на паллете. */
export const BoxStack: React.FC<P & { w?: number; rows?: number }> = ({ x, y, s, seed = 64, sw = 3, flip, w = 230, rows = 3 }) => {
  const r = rnd(seed);
  const n = 2, bw = (w - 16) / n, bh = 72;
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <Pallet w={w} sw={sw} />
      {Array.from({ length: rows }, (_, row) => Array.from({ length: row === rows - 1 && seed % 2 ? 1 : n }, (_, c) => (
        <Box key={`${row}-${c}`} x={-w / 2 + 8 + c * bw} y={-30 - (row + 1) * bh} w={bw - 2} h={bh - 2} r={r} sw={sw * 0.85} />
      )))}
    </At>
  );
};

/** Стеллаж склада: рамы с отверстиями, балки, коробки на паллетах. */
export const PalletRack: React.FC<P & { w?: number; h?: number; n?: number }> = ({ x, y, s, seed = 65, sw = 3, flip, w = 300, h = 860, n = 4 }) => {
  const r = rnd(seed);
  const step = (h - 20) / n;
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      {[-1, 1].map((k) => (
        <g key={k}>
          <path d={`M${k * (w / 2)} 0 V${-h} M${k * (w / 2 - 16)} 0 V${-h}`} strokeWidth={sw * 1.1} />
          {Array.from({ length: Math.floor(h / 34) }, (_, i) => <path key={i} d={`M${k * (w / 2 - 8)} ${-16 - i * 34} v8`} strokeWidth={1.5} />)}
        </g>
      ))}
      {Array.from({ length: n }, (_, i) => {
        const base = -i * step;
        const fill = r();
        return (
          <g key={i}>
            {fill > 0.14 && (
              <g transform={`translate(0 ${base - 8})`}>
                <Pallet w={w - 60} sw={sw} />
                <Box x={-(w - 60) / 2 + 6} y={-30 - Math.min(step - 50, 120)} w={(w - 74) / 2} h={Math.min(step - 50, 120)} r={r} sw={sw * 0.85} />
                {fill > 0.45 && <Box x={2} y={-30 - Math.min(step - 50, 120) * 0.76} w={(w - 74) / 2} h={Math.min(step - 50, 120) * 0.76} r={r} sw={sw * 0.85} />}
              </g>
            )}
            {i > 0 && <path d={`M${-w / 2} ${base} H${w / 2} M${-w / 2} ${base + 12} H${w / 2}`} strokeWidth={sw * 1.1} />}
          </g>
        );
      })}
    </At>
  );
};

/** Погрузчик в профиль с коробкой на вилах, без водителя. */
export const Forklift: React.FC<P & { t?: number }> = ({ x, y, s, seed = 66, sw = 3, flip, t = 0 }) => {
  const r = rnd(seed);
  const lift = Math.sin(t * 0.04) * 10;
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d="M126 0 V-404 M146 0 V-404 M120 -404 H152" strokeWidth={sw * 1.2} />
      <g transform={`translate(0 ${lift})`}>
        <path d="M152 -86 V-210 M152 -86 H286 V-78 H146" strokeWidth={sw * 1.2} fill={PAPER} />
        <Box x={166} y={-186} w={112} h={98} r={r} sw={sw * 0.9} />
      </g>
      <path d="M-156 -44 L-156 -142 Q-156 -160 -138 -160 H-50 L-16 -142 H112 V-44 Z" fill={PAPER} />
      <path d="M-156 -142 V-100 H-96 V-142 Z" strokeWidth={sw * 0.7} />
      <path d="M-92 -160 L-92 -312 H52 L92 -144 M-80 -312 H42" strokeWidth={sw * 1.3} />
      <path d="M-60 -142 V-206 Q-60 -216 -50 -216 H-40 V-156 H6 V-142" fill={PAPER} />
      <path d="M50 -142 L34 -214 M12 -220 L54 -210" strokeWidth={sw * 1.2} />
      <circle cx={-96} cy={-40} r={40} fill={PAPER} /><circle cx={-96} cy={-40} r={16} strokeWidth={sw * 0.7} />
      <circle cx={74} cy={-46} r={46} fill={PAPER} /><circle cx={74} cy={-46} r={18} strokeWidth={sw * 0.7} />
    </At>
  );
};

/** Рулонные ворота с ламелями (x, y это левый верхний угол). */
export const RollerDoor: React.FC<{ x: number; y: number; w?: number; h?: number; open?: number; seed?: number; sw?: number }> = ({ x, y, w = 330, h = 430, open = 0.2, seed = 67, sw = 3 }) => {
  const r = rnd(seed);
  const closed = h * (1 - open);
  const n = Math.floor(closed / 26);
  return (
    <g strokeWidth={sw}>
      <path d={rc(r, x - 18, y - 42, w + 36, h + 42)} fill={PAPER} />
      <path d={rc(r, x - 8, y - 32, w + 16, 34, 1)} strokeWidth={sw * 0.7} />
      <path d={rc(r, x, y, w, closed, 1)} fill={PAPER} />
      {Array.from({ length: n }, (_, i) => <path key={i} d={`M${x} ${y + (i + 1) * 26} H${x + w}`} strokeWidth={1.4} opacity={0.7} />)}
      <path d={`M${x + w / 2 - 26} ${y + closed - 12} h52`} strokeWidth={sw * 1.3} />
    </g>
  );
};

/** Провода между двумя столбами по краям кадра: столбы доходят до земли, середина кадра свободна. */
export const Wires: React.FC<{ y?: number; x1?: number; x2?: number; sw?: number }> = ({ y = 540, x1 = 50, x2 = 1030, sw = 2.2 }) => (
  <Far o={0.7}>
    <g strokeWidth={sw}>
      {[x1, x2].map((px) => <path key={px} d={`M${px - 4} ${y - 50} V${ENV_G} M${px + 4} ${y - 50} V${ENV_G} M${px - 44} ${y - 26} H${px + 44} M${px - 32} ${y + 12} H${px + 32}`} />)}
      {[-26, 12].map((o) => <path key={o} d={`M${x1 - 44} ${y + o} Q${(x1 + x2) / 2} ${y + o + 86} ${x2 + 44} ${y + o} M${x1 + 40} ${y + o} Q${(x1 + x2) / 2} ${y + o + 70} ${x2 - 40} ${y + o}`} strokeWidth={sw * 0.65} />)}
    </g>
  </Far>
);

/** Предупреждающий знак на стене. */
export const WarnSign: React.FC<{ x: number; y: number; s?: number; sw?: number }> = ({ x, y, s = 1, sw = 3 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} strokeWidth={sw}>
    <path d="M0 -70 L64 44 H-64 Z" fill={PAPER} strokeLinejoin="round" />
    <path d="M0 -60 L55 38 H-55 Z" strokeWidth={sw * 0.45} />
    <path d="M0 -24 V10" strokeWidth={sw * 2.4} /><circle cx={0} cy={26} r={5} fill={INK} stroke="none" />
  </g>
);

/** Фермы под потолком склада. */
export const Trusses: React.FC<{ y?: number; sw?: number }> = ({ y = 474, sw = 2 }) => {
  const n = 12;
  const cw = ENV_W / n;
  let d = '';
  for (let i = 0; i < n; i++) d += `M${i * cw} ${y + 62} L${(i + 0.5) * cw} ${y} L${(i + 1) * cw} ${y + 62} `;
  return <Far o={0.55}><path d={`M0 ${y} H${ENV_W} M0 ${y + 62} H${ENV_W} ${d}`} strokeWidth={sw} /></Far>;
};

// ——— Ночной офис и чат ———

/** Ленточное окно ночью: заштрихованное небо, луна, дома с редким светом. */
export const NightRibbon: React.FC<{ x1: number; x2: number; y: number; h: number; id: string; n?: number; seed?: number }> = ({ x1, x2, y, h, id, n = 6, seed = 3 }) => (
  <g strokeWidth={2}>
    <clipPath id={id}><rect x={x1} y={y} width={x2 - x1} height={h} /></clipPath>
    <rect x={x1} y={y} width={x2 - x1} height={h} fill={PAPER} />
    <g clipPath={`url(#${id})`}>
      {Array.from({ length: Math.floor((x2 - x1 + h) / 14) }, (_, i) => <path key={i} d={`M${x1 + i * 14} ${y} L${x1 + i * 14 - h} ${y + h}`} strokeWidth={1.3} opacity={0.75} />)}
      <circle cx={x1 + (x2 - x1) * ((seed * 37) % 100) / 100} cy={y + 46} r={26} fill={PAPER} stroke="none" />
      <path d={`M${x1 + (x2 - x1) * ((seed * 37) % 100) / 100 - 6} ${y + 22} a26 26 0 1 0 24 40 a22 22 0 0 1 -24 -40 Z`} fill={PAPER} strokeWidth={2} />
      <Skyline y={y + h} seed={seed} from={x1} to={x2} max={h * 0.62} far={0.9} />
    </g>
    {Array.from({ length: n + 1 }, (_, i) => <path key={i} d={`M${x1 + ((x2 - x1) * i) / n} ${y} V${y + h}`} strokeWidth={3.4} />)}
    <rect x={x1} y={y} width={x2 - x1} height={h} strokeWidth={3} />
  </g>
);

/** Экран мессенджера во весь задник: шапка с аватаркой, пузыри-строчки, поле ввода; t печатает точки. */
export const ChatScreen: React.FC<{ v?: number; t?: number; seed?: number; sw?: number }> = ({ v = 0, t = 0, seed = 68, sw = 3 }) => {
  const r = rnd(seed + v);
  const x = 120, w = 840, top = 476, bot = ENV_G;
  const n = 7;
  const step = (bot - top - 300) / n;
  const m = v % 2 ? -1 : 1;
  const side = (i: number) => (([1, 0, 1, 1, 0, 1, 0] as number[])[(i + (v > 1 ? 2 : 0)) % 7] ? 1 : -1) * m;
  const dots = Math.floor(t / 8) % 3;
  return (
    <g strokeWidth={sw}>
      <rect x={x} y={top} width={w} height={bot - top} rx={56} fill={PAPER} strokeWidth={sw * 1.6} />
      <path d={`M${x} ${top + 118} H${x + w}`} />
      <circle cx={x + 72} cy={top + 66} r={32} fill={PAPER} />
      <circle cx={x + 72} cy={top + 58} r={10} strokeWidth={sw * 0.6} /><path d={`M${x + 52} ${top + 92} Q${x + 72} ${top + 62} ${x + 92} ${top + 92}`} strokeWidth={sw * 0.6} />
      <path d={`M${x + 126} ${top + 52} h190 M${x + 126} ${top + 84} h110`} strokeWidth={sw * 1.2} />
      <Tx x={x + w - 44} y={top + 76} size={38} anchor="end">23:47</Tx>
      {Array.from({ length: n }, (_, i) => {
        const yy = top + 150 + i * step;
        const k = side(i);
        const bw = 180 + r() * 170;
        const a = k > 0 ? x + w - 34 - bw : x + 96;
        const lines = 1 + Math.floor(r() * 2);
        return (
          <g key={i}>
            {k < 0 && <g strokeWidth={sw * 0.7}><circle cx={x + 58} cy={yy + 36} r={22} fill={PAPER} /><circle cx={x + 58} cy={yy + 30} r={7} strokeWidth={sw * 0.5} /><path d={`M${x + 44} ${yy + 54} Q${x + 58} ${yy + 34} ${x + 72} ${yy + 54}`} strokeWidth={sw * 0.5} /></g>}
            <rect x={a} y={yy} width={bw} height={Math.min(step - 18, 62)} rx={22} fill={PAPER} strokeWidth={sw * 0.85} />
            {Array.from({ length: lines }, (_, q) => <path key={q} d={`M${a + 24} ${yy + 22 + q * 18} h${(bw - 48) * (q === lines - 1 ? 0.6 : 0.95)}`} strokeWidth={sw * 0.6} opacity={0.75} />)}
          </g>
        );
      })}
      <rect x={x + 96} y={bot - 142} width={126} height={48} rx={22} fill={PAPER} strokeWidth={sw * 0.85} />
      {[0, 1, 2].map((i) => <circle key={i} cx={x + 132 + i * 28} cy={bot - 118 - (i === dots ? 6 : 0)} r={6} fill={i === dots ? INK : PAPER} strokeWidth={sw * 0.5} />)}
      <rect x={x + 34} y={bot - 74} width={w - 150} height={56} rx={26} strokeWidth={sw * 0.85} />
      <circle cx={x + w - 60} cy={bot - 46} r={28} fill={PAPER} />
      <path d={`M${x + w - 72} ${bot - 58} L${x + w - 44} ${bot - 46} L${x + w - 72} ${bot - 34} Z`} strokeWidth={sw * 0.8} />
    </g>
  );
};

// ——— Коридор, лестница, лифт ———

/** Дверь с номером; num не зеркалится, поэтому у двери нет flip. */
export const Door: React.FC<{ x: number; y?: number; s?: number; seed?: number; sw?: number; num?: string; side?: number }> = ({ x, y = ENV_G, s = 1, seed = 69, sw = 3, num, side = 1 }) => {
  const r = rnd(seed);
  return (
    <At x={x} y={y} s={s} sw={sw}>
      <path d={rc(r, -94, -450, 188, 450)} fill={PAPER} />
      <path d={rc(r, -80, -438, 160, 438)} fill={PAPER} strokeWidth={sw * 0.7} />
      <path d={rc(r, -60, -414, 120, 150, 1)} strokeWidth={sw * 0.45} />
      <path d={rc(r, -60, -232, 120, 200, 1)} strokeWidth={sw * 0.45} />
      <path d={`M${side * 52} -226 h${side * 20}`} strokeWidth={sw * 1.6} />
      <circle cx={side * 60} cy={-204} r={5} fill={PAPER} strokeWidth={sw * 0.6} />
      {num && <g><path d={rc(r, -36, -398, 72, 46, 1)} fill={PAPER} strokeWidth={sw * 0.7} /><Tx x={0} y={-362} size={34}>{num}</Tx></g>}
    </At>
  );
};

/** Огнетушитель на полу. */
export const Extinguisher: React.FC<P> = ({ x, y, s, sw = 3, flip }) => (
  <At x={x} y={y} s={s} sw={sw} flip={flip}>
    <path d="M-30 0 V-128 Q-30 -160 0 -160 Q30 -160 30 -128 V0 Z" fill={PAPER} />
    <path d="M-30 -100 H30 M-30 -46 H30 M-14 -86 h28 M-14 -70 h20" strokeWidth={sw * 0.6} />
    <path d="M-8 -160 V-180 H8 V-160 M8 -176 L44 -186 M0 -180 Q-48 -180 -46 -110 L-52 -86" strokeWidth={sw * 1.1} />
  </At>
);

/** Табличка у потолка: ВЫХОД, ТУАЛЕТ и т.п. (x центр, y потолок). */
export const CeilSign: React.FC<{ x: number; y?: number; text: string; w?: number; sw?: number; seed?: number }> = ({ x, y = CEIL, text, w = 200, sw = 3, seed = 70 }) => {
  const r = rnd(seed);
  return (
    <g transform={`translate(${x} ${y})`} strokeWidth={sw}>
      <path d={`M${-w * 0.3} 0 V34 M${w * 0.3} 0 V34`} strokeWidth={1.6} />
      <path d={rc(r, -w / 2, 34, w, 62)} fill={PAPER} />
      <Tx x={0} y={78} size={36}>{text}</Tx>
    </g>
  );
};

/** Коридор в перспективе к дальней двери: двери по бокам, лампы по центру потолка. */
export const Corridor: React.FC<{ t?: number; seed?: number; n?: number }> = ({ t = 0, seed = 71, n = 3 }) => {
  const r = rnd(seed);
  const near = { l: 0, r: ENV_W, top: 462, bot: ENV_G };
  const far = { l: 430, r: 650, top: 880, bot: 1240 };
  const at = (u: number) => ({ l: near.l + (far.l - near.l) * u, r: near.r + (far.r - near.r) * u, top: near.top + (far.top - near.top) * u, bot: near.bot + (far.bot - near.bot) * u });
  const us = [0.16, 0.46, 0.68];
  return (
    <g>
      <Far o={0.75}>
        <path d={`M${near.l} ${near.top} L${far.l} ${far.top} M${near.r} ${near.top} L${far.r} ${far.top} M${near.l} ${near.bot} L${far.l} ${far.bot} M${near.r} ${near.bot} L${far.r} ${far.bot}`} strokeWidth={2.2} />
        <path d={rc(r, far.l, far.top, far.r - far.l, far.bot - far.top)} fill={PAPER} strokeWidth={2.4} />
        <path d={rc(r, far.l + 56, far.top + 90, far.r - far.l - 112, far.bot - far.top - 90)} fill={PAPER} strokeWidth={2.2} />
        <path d={`M${(far.l + far.r) / 2} ${far.top + 90} V${far.bot}`} strokeWidth={1.6} />
      </Far>
      {us.slice(0, n).flatMap((u, i) => {
        const a = at(u), b = at(u + 0.13);
        const hTop = (p: typeof a) => p.top + (p.bot - p.top) * 0.16;
        return [-1, 1].map((k) => {
          const xa = k < 0 ? a.l : a.r, xb = k < 0 ? b.l : b.r;
          return (
            <g key={`${i}-${k}`} opacity={0.5 + u * 0.3} strokeWidth={2.4}>
              <path d={`M${xa} ${hTop(a)} L${xb} ${hTop(b)} L${xb} ${b.bot} L${xa} ${a.bot} Z`} fill={PAPER} />
              <circle cx={xa + (xb - xa) * 0.82} cy={(hTop(a) + a.bot) / 2 + 12} r={4} strokeWidth={1.6} />
            </g>
          );
        });
      })}
      {[0.1, 0.36, 0.6, 0.8].map((u, i) => {
        const a = at(u), hw = (a.r - a.l) * 0.12, y = a.top;
        const on = Math.floor((t + i * 23) / 11) % 19 !== 0;
        return <path key={u} d={`M${(a.l + a.r) / 2 - hw} ${y} H${(a.l + a.r) / 2 + hw}`} strokeWidth={5 - u * 3} opacity={on ? 0.8 : 0.3} />;
      })}
    </g>
  );
};

/** Лестничный марш с перилами вправо вверх, белая заливка под ним. */
export const Stairs: React.FC<P & { n?: number; d?: number; h?: number; land?: number; rail?: boolean }> = ({ x, y, s, sw = 3, flip, n = 13, d = 46, h = 38, land = 120, rail = true }) => {
  let p = 'M0 0';
  for (let i = 0; i < n; i++) p += ` v${-h} h${d}`;
  const end = n * d, top = -n * h;
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d={`${p} h${land} V0 Z`} fill={PAPER} />
      {rail && (
        <g>
          <path d={`M8 ${-h - 142} L${end + 12} ${top - 142} h${land - 24}`} strokeWidth={sw * 1.7} />
          {Array.from({ length: n }, (_, i) => <path key={i} d={`M${i * d + 14} ${-(i + 1) * h} V${-(i + 1) * h - 142}`} strokeWidth={sw * 0.7} />)}
          {Array.from({ length: Math.floor(land / d) }, (_, i) => <path key={i} d={`M${end + 14 + i * d} ${top} V${top - 142}`} strokeWidth={sw * 0.7} />)}
          <path d={`M8 ${-h} V${-h - 150}`} strokeWidth={sw * 2} />
        </g>
      )}
    </At>
  );
};

/** Почтовые ящики (x, y это левый верхний угол). */
export const Mailboxes: React.FC<{ x: number; y: number; cols?: number; rows?: number; seed?: number; sw?: number }> = ({ x, y, cols = 4, rows = 3, seed = 72, sw = 3 }) => {
  const r = rnd(seed);
  const cw = 54, ch = 46;
  return (
    <g strokeWidth={sw}>
      {Array.from({ length: rows }, (_, a) => Array.from({ length: cols }, (_, b) => {
        const px = x + b * cw, py = y + a * ch;
        return <g key={`${a}-${b}`}><path d={rc(r, px, py, cw, ch, 0.8)} fill={PAPER} strokeWidth={sw * 0.8} /><path d={`M${px + 12} ${py + 14} h30 M${px + 42} ${py + 30} h-6`} strokeWidth={sw * 0.6} /></g>;
      }))}
    </g>
  );
};

/** Лифт снаружи: рама, створки, табло этажей, стрелка; t щёлкает этажи. */
export const ElevatorDoor: React.FC<{ x: number; y?: number; s?: number; seed?: number; sw?: number; t?: number; h?: number; w?: number }> = ({ x, y = ENV_G, s = 1, seed = 73, sw = 3, t = 0, h = 560, w = 300 }) => {
  const r = rnd(seed);
  const floor = (Math.floor(t / 24) % 9) + 1;
  return (
    <At x={x} y={y} s={s} sw={sw}>
      <path d={rc(r, -w / 2 - 26, -h - 26, w + 52, h + 26)} fill={PAPER} />
      <path d={rc(r, -w / 2, -h, w, h)} fill={PAPER} />
      <path d={`M0 ${-h} V0`} strokeWidth={sw * 1.3} />
      {[-1, 1].map((k) => <g key={k}><path d={`M${k * 40} ${-h + 42} l${k * 62} -28 M${k * 60} ${-h + 66} l${k * 40} -18`} strokeWidth={1.4} opacity={0.65} /></g>)}
      <path d={rc(r, -72, -h - 96, 144, 58)} fill={PAPER} />
      <Tx x={-22} y={-h - 52} size={42}>{String(floor)}</Tx>
      <path d={`M26 ${-h - 54} v-26 m-12 12 l12 -12 l12 12`} strokeWidth={sw * 1.05} />
    </At>
  );
};

/** Панель кнопок лифта (x, y это левый верхний угол). */
export const LiftPanel: React.FC<{ x: number; y: number; w?: number; h?: number; rows?: number; seed?: number; sw?: number; t?: number }> = ({ x, y, w = 76, h = 150, rows = 2, seed = 74, sw = 3, t = 0 }) => {
  const r = rnd(seed);
  const on = Math.floor(t / 30) % 2;
  const cy = (i: number) => y + 30 + (i * (h - 60)) / Math.max(1, rows - 1);
  return (
    <g strokeWidth={sw}>
      <path d={rc(r, x, y, w, h)} fill={PAPER} />
      {Array.from({ length: rows }, (_, i) => <g key={i}><circle cx={x + w / 2} cy={cy(i)} r={15} fill={i === on ? INK : PAPER} strokeWidth={sw * 0.8} /></g>)}
    </g>
  );
};

// ——— Остановка, спальня, больница, школа, ресторан ———

/** Павильон остановки: навес, стекло с рекламой, скамья, расписание. */
export const BusShelter: React.FC<P & { w?: number }> = ({ x, y, s, seed = 75, sw = 3, flip, w = 580 }) => {
  const r = rnd(seed);
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      {[-1, 1].map((k) => <path key={k} d={`M${k * (w / 2 - 20) - 5} 0 V-420 M${k * (w / 2 - 20) + 5} 0 V-420`} />)}
      <path d={`M${-w / 2 + 20} -392 H${w / 2 - 20} V-54 H${-w / 2 + 20} Z`} fill={PAPER} strokeWidth={sw * 0.75} />
      {[0, 1, 2].map((i) => <path key={i} d={`M${-w / 2 + 40 + i * 160} -180 l60 -80 M${-w / 2 + 62 + i * 160} -172 l44 -58`} strokeWidth={1.4} opacity={0.6} />)}
      <path d={`M${w * 0.18} -392 V-54 M${-w * 0.18} -392 V-54`} strokeWidth={sw * 0.7} />
      <path d={rc(r, w * 0.2, -360, w * 0.22, 250, 1)} fill={PAPER} strokeWidth={sw * 0.8} />
      <circle cx={w * 0.31} cy={-280} r={36} strokeWidth={sw * 0.6} />
      <path d={`M${w * 0.23} -214 h${w * 0.16} M${w * 0.23} -192 h${w * 0.16} M${w * 0.23} -170 h${w * 0.11} M${w * 0.23} -148 h${w * 0.14}`} strokeWidth={sw * 0.5} />
      <path d={rc(r, -w / 2 - 26, -436, w + 52, 22)} fill={PAPER} />
      <path d={`M${-w * 0.34} -104 H${w * 0.14} V-90 H${-w * 0.34} Z`} fill={PAPER} />
      <path d={`M${-w * 0.28} -90 V0 M${w * 0.08} -90 V0`} strokeWidth={sw * 1.3} />
    </At>
  );
};

/** Столб с номером маршрута. Текст не зеркалится. */
export const BusSign: React.FC<{ x: number; y?: number; s?: number; sw?: number; route?: string; seed?: number }> = ({ x, y = ENV_G, s = 1, sw = 3, route = '12', seed = 76 }) => {
  const r = rnd(seed);
  return (
    <At x={x} y={y} s={s} sw={sw}>
      <path d="M-5 0 V-452 M5 0 V-452" />
      <path d={rc(r, -58, -540, 116, 92)} fill={PAPER} />
      <Tx x={0} y={-480} size={58}>{route}</Tx>
      <path d={rc(r, -34, -432, 68, 116, 1)} fill={PAPER} strokeWidth={sw * 0.75} />
      <path d="M-22 -412 h44 M-22 -394 h44 M-22 -376 h30 M-22 -358 h40" strokeWidth={1.4} />
    </At>
  );
};

/** Автобус в профиль. */
export const Bus: React.FC<P & { w?: number }> = ({ x, y, s, seed = 77, sw = 3, flip, w = 620 }) => {
  const r = rnd(seed);
  const n = 5, cw = (w - 60) / n;
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d={`M${-w / 2} -44 V-290 Q${-w / 2} -316 ${-w / 2 + 26} -316 H${w / 2 - 40} Q${w / 2 - 10} -316 ${w / 2} -280 V-44 Z`} fill={PAPER} />
      {Array.from({ length: n }, (_, i) => <path key={i} d={rc(r, -w / 2 + 20 + i * cw, -288, cw - 12, 104, 1)} fill={PAPER} strokeWidth={sw * 0.75} />)}
      {[1, 3].map((i) => <path key={i} d={`M${-w / 2 + 20 + i * cw} -176 h${cw - 12} v128 h${-cw + 12} Z M${-w / 2 + 14 + i * cw + cw / 2} -176 v128`} fill={PAPER} strokeWidth={sw * 0.75} />)}
      <path d={`M${-w / 2} -136 H${-w / 2 + 20 + cw} M${-w / 2 + 20 + 2 * cw} -136 H${-w / 2 + 14 + 3 * cw} M${-w / 2 + 20 + 4 * cw} -136 H${w / 2}`} strokeWidth={sw * 0.6} />
      {[-0.3, 0.3].map((k) => <g key={k}><circle cx={w * k} cy={-44} r={44} fill={PAPER} /><circle cx={w * k} cy={-44} r={18} strokeWidth={sw * 0.7} /></g>)}
    </At>
  );
};

/** Кровать в профиль: изголовье, матрас, подушка, одеяло. */
export const Bed: React.FC<P & { w?: number }> = ({ x, y, s, seed = 78, sw = 3, flip, w = 480 }) => {
  const r = rnd(seed);
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d={rc(r, w / 2 - 26, -290, 26, 290)} fill={PAPER} />
      <path d={rc(r, -w / 2, -128, 18, 128)} fill={PAPER} />
      <path d={`M${-w / 2 + 44} -60 V0 M${w / 2 - 62} -60 V0`} strokeWidth={sw * 1.4} />
      <path d={rc(r, -w / 2 + 14, -102, w - 40, 42)} fill={PAPER} />
      <path d={`M${w / 2 - 156} -100 Q${w / 2 - 162} -154 ${w / 2 - 96} -158 Q${w / 2 - 32} -158 ${w / 2 - 30} -114 Q${w / 2 - 34} -100 ${w / 2 - 96} -100 Z`} fill={PAPER} />
      <path d={`M${-w / 2 + 14} -92 Q${-w / 2 + 14} -138 ${-w / 2 + 70} -140 H${w / 2 - 196} Q${w / 2 - 172} -140 ${w / 2 - 170} -100 V-58 H${-w / 2 + 14} Z`} fill={PAPER} />
      <path d={`M${w / 2 - 240} -140 Q${w / 2 - 222} -100 ${w / 2 - 240} -58`} strokeWidth={sw * 0.7} />
    </At>
  );
};

/** Тумбочка; будильник сверху показывает t. */
export const Nightstand: React.FC<P & { t?: number }> = ({ x, y, s, seed = 79, sw = 3, flip, t = 0 }) => {
  const r = rnd(seed);
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d={`M-44 0 v-16 M44 0 v-16`} strokeWidth={sw * 1.3} />
      <path d={rc(r, -56, -146, 112, 132)} fill={PAPER} />
      <path d="M-56 -80 H56 M-16 -116 h32 M-16 -50 h32" strokeWidth={sw * 0.8} />
      <g transform="translate(-6 -146)">
        <path d="M-26 0 l-8 8 M26 0 l8 8" transform="translate(0 -8)" strokeWidth={sw * 0.9} />
        <Clock x={0} y={-40} r={36} hour={210 + t * 0.02} min={(t * 0.6) % 360} />
        <path d="M-34 -80 q10 -18 24 -8 M34 -80 q-10 -18 -24 -8" strokeWidth={sw * 1.1} />
      </g>
    </At>
  );
};

/** Шкаф для одежды. */
export const Wardrobe: React.FC<P & { w?: number; h?: number }> = ({ x, y, s, seed = 80, sw = 3, flip, w = 200, h = 580 }) => {
  const r = rnd(seed);
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d={`M${-w / 2 + 16} 0 v-16 M${w / 2 - 16} 0 v-16`} strokeWidth={sw * 1.3} />
      <path d={rc(r, -w / 2, -h, w, h - 14)} fill={PAPER} />
      <path d={rc(r, -w / 2 - 8, -h - 12, w + 16, 14)} fill={PAPER} />
      <path d={`M0 ${-h} V-14 M-14 ${-h * 0.5} v44 M14 ${-h * 0.5} v44`} strokeWidth={sw * 0.9} />
      {[-1, 1].map((k) => <path key={k} d={rc(r, k > 0 ? 14 : -w / 2 + 14, -h + 16, w / 2 - 28, h - 58, 1)} strokeWidth={sw * 0.45} />)}
      <path d={rc(r, -w / 2 + 10, -h - 92, 110, 80, 1)} fill={PAPER} strokeWidth={sw * 0.8} />
      <path d={`M${-w / 2 + 10} ${-h - 62} h110`} strokeWidth={sw * 0.5} />
    </At>
  );
};

/** Медицинская кушетка. */
export const MedCouch: React.FC<P & { w?: number }> = ({ x, y, s, seed = 81, sw = 3, flip, w = 460 }) => {
  const r = rnd(seed);
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d={`M${-w / 2 + 30} -120 V0 M${w / 2 - 30} -120 V0 M${-w / 2 + 30} -62 H${w / 2 - 30}`} strokeWidth={sw * 1.3} />
      <path d={rc(r, -w / 2, -150, w * 0.72, 32)} fill={PAPER} />
      <path d={`M${w * 0.22} -146 L${w / 2} -212 L${w / 2 + 14} -186 L${w * 0.24} -118 Z`} fill={PAPER} />
      <path d={`M${-w / 2 + 40} -152 H${w * 0.1} `} strokeWidth={sw * 0.6} strokeDasharray="14 10" />
    </At>
  );
};

/** Медицинский шкаф с крестом. */
export const MedCabinet: React.FC<P & { w?: number; h?: number }> = ({ x, y, s, seed = 82, sw = 3, flip, w = 180, h = 480 }) => {
  const r = rnd(seed);
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d={rc(r, -w / 2, -h, w, h)} fill={PAPER} />
      <path d={`M${-w / 2 + 12} ${-h + 12} H${w / 2 - 12} V${-h * 0.42} H${-w / 2 + 12} Z M0 ${-h + 12} V${-h * 0.42} M${-w / 2 + 12} ${-h * 0.72} H${w / 2 - 12}`} strokeWidth={sw * 0.7} />
      {[-58, -30, 14, 40].map((k, i) => <path key={k} d={`M${k - 10} ${-h * 0.72} v-42 q0 -14 10 -14 q10 0 10 14 v42`} fill={PAPER} strokeWidth={sw * 0.6} transform={`translate(${i % 2 ? 4 : 0} 0)`} />)}
      <path d={`M0 ${-h * 0.42} V0 M-14 ${-h * 0.28} v30 M14 ${-h * 0.28} v30`} strokeWidth={sw * 0.8} />
      <path d={`M-30 -110 h20 v-20 h20 v20 h20 v20 h-20 v20 h-20 v-20 h-20 Z`} transform="translate(-46 -30) scale(0.6)" strokeWidth={sw * 0.9} />
    </At>
  );
};

/** Стойка капельницы. */
export const IVStand: React.FC<P & { t?: number }> = ({ x, y, s, sw = 3, flip, t = 0 }) => {
  const u = ((t * 2) % 40) / 40;
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d="M0 0 V-480 M-40 -470 H40 M0 -16 L-56 0 M0 -16 L56 0 M0 -16 L-22 4 M0 -16 L22 4" strokeWidth={sw * 1.2} />
      <path d="M26 -470 V-448 M8 -448 H44 V-372 Q44 -358 26 -358 Q8 -358 8 -372 Z" fill={PAPER} strokeWidth={sw * 0.85} />
      <path d="M8 -414 H44" strokeWidth={sw * 0.5} />
      <path d={`M26 -358 V-336 C26 -280 90 -280 80 -210`} strokeWidth={sw * 0.5} strokeDasharray="8 5" />
      <circle cx={26} cy={-356 + u * 18} r={2.8} fill={INK} stroke="none" />
    </At>
  );
};

/** Таблица окулиста (x, y это левый верхний угол). */
export const EyeChart: React.FC<{ x: number; y: number; w?: number; h?: number; seed?: number; sw?: number }> = ({ x, y, w = 130, h = 200, seed = 83, sw = 3 }) => {
  const r = rnd(seed);
  return (
    <g strokeWidth={sw}>
      <path d={rc(r, x, y, w, h)} fill={PAPER} />
      <Tx x={x + w / 2} y={y + 56} size={46}>Ш Б</Tx>
      <Tx x={x + w / 2} y={y + 98} size={32}>М Н К</Tx>
      <Tx x={x + w / 2} y={y + 132} size={24}>Ы М Б Ш</Tx>
      <Tx x={x + w / 2} y={y + 160} size={18}>Б Ы Н К М</Tx>
      <Tx x={x + w / 2} y={y + 182} size={13}>Н К Ш М Ы Б</Tx>
    </g>
  );
};

/** Складная ширма. */
export const FoldScreen: React.FC<P & { n?: number }> = ({ x, y, s, seed = 84, sw = 3, flip, n = 3 }) => {
  const r = rnd(seed);
  const cw = 92, h = 380;
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      {Array.from({ length: n }, (_, i) => {
        const a = -(n * cw) / 2 + i * cw;
        return (
          <g key={i}>
            <path d={rc(r, a, -h, cw, h - 14, 1)} fill={PAPER} />
            <path d={rc(r, a + 10, -h + 12, cw - 20, h - 40, 1)} strokeWidth={sw * 0.45} />
            {[0, 1, 2, 3, 4].map((q) => <path key={q} d={`M${a + 18 + q * 12} ${-h + 16} q7 ${h * 0.4} 0 ${h - 50}`} strokeWidth={1.1} opacity={0.5} />)}
          </g>
        );
      })}
      <path d={`M${-(n * cw) / 2 + 14} -14 v14 M${(n * cw) / 2 - 14} -14 v14`} strokeWidth={sw * 1.3} />
    </At>
  );
};

/** Крест на стене контуром (x, y центр). */
export const WallCross: React.FC<{ x: number; y: number; s?: number; sw?: number }> = ({ x, y, s = 1, sw = 3 }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M-18 -56 h36 v38 h38 v36 h-38 v38 h-36 v-38 h-38 v-36 h38 Z" fill={PAPER} strokeWidth={sw} />
);

/** Больничная койка с поднятым изголовьем и бортиком. */
export const HospitalBed: React.FC<P & { w?: number }> = ({ x, y, s, seed = 85, sw = 3, flip, w = 500 }) => {
  const r = rnd(seed);
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d={`M${-w * 0.34} -120 V-28 M${w * 0.34} -120 V-28 M${-w * 0.34} -72 H${w * 0.34}`} strokeWidth={sw * 1.3} />
      {[-0.34, 0.34].map((k) => <circle key={k} cx={w * k} cy={-14} r={14} fill={PAPER} />)}
      <path d={rc(r, -w / 2, -150, 18, 150 - 30)} fill={PAPER} />
      <path d={`M${-w / 2 + 16} -118 H${w * 0.2} L${w / 2 - 8} -196 L${w / 2 + 12} -176 L${w * 0.24} -84 H${-w / 2 + 16} Z`} fill={PAPER} />
      <path d={`M${w / 2 - 92} -146 Q${w / 2 - 34} -212 ${w / 2 - 2} -176 Q${w / 2 - 4} -148 ${w / 2 - 62} -116 Z`} fill={PAPER} />
      <path d={rc(r, -w * 0.3, -176, w * 0.42, 14)} fill={PAPER} strokeWidth={sw * 0.8} />
      {[-0.24, -0.12, 0, 0.1].map((k) => <path key={k} d={`M${w * k} -162 V-116`} strokeWidth={sw * 0.7} />)}
    </At>
  );
};

/** Школьная доска с надписью мелом (x, y это левый верхний угол). */
export const Blackboard: React.FC<{ x: number; y: number; w?: number; h?: number; text?: string; seed?: number; sw?: number }> = ({ x, y, w = 560, h = 200, text = '2 + 2 = ?', seed = 86, sw = 3 }) => {
  const r = rnd(seed);
  return (
    <g strokeWidth={sw}>
      <path d={rc(r, x, y, w, h)} fill={PAPER} />
      <path d={rc(r, x + 12, y + 12, w - 24, h - 24, 1)} strokeWidth={sw * 0.5} />
      <Tx x={x + w * 0.36} y={y + h * 0.62} size={72}>{text}</Tx>
      <path d={`M${x + w * 0.68} ${y + 56} h${w * 0.24} M${x + w * 0.68} ${y + 90} h${w * 0.18} M${x + w * 0.68} ${y + 124} h${w * 0.22}`} strokeWidth={sw * 0.6} />
      <path d={`M${x + 20} ${y + h} H${x + w - 20} V${y + h + 12} H${x + 20} Z M${x + 60} ${y + h} v-7 h26 v7`} fill={PAPER} strokeWidth={sw * 0.85} />
    </g>
  );
};

/** Парта со скамьёй. */
export const SchoolDesk: React.FC<P> = ({ x, y, s, seed = 87, sw = 3, flip }) => {
  const r = rnd(seed);
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d="M-104 -160 L-100 0 M92 -170 L100 0 M-100 -40 H100" strokeWidth={sw * 1.2} />
      <path d={rc(r, -96, -152, 180, 50, 1)} fill={PAPER} strokeWidth={sw * 0.75} />
      <g transform="rotate(-5 0 -176)"><path d={rc(r, -126, -186, 252, 16)} fill={PAPER} /></g>
      <path d={`M-24 -196 l52 -4 l5 4 l-52 4 Z M-20 -202 l52 -4`} fill={PAPER} strokeWidth={sw * 0.6} />
      <path d="M-186 -102 H-96 V-90 H-186 Z M-176 -90 V0" fill={PAPER} strokeWidth={sw} />
    </At>
  );
};

/** Глобус (x, y точка на столе). */
export const Globe: React.FC<P & { t?: number }> = ({ x, y = ENV_G, s, sw = 3, flip, t = 0 }) => {
  const sh = Math.sin(t * 0.04) * 20;
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d="M-32 0 H32 M0 0 V-22 M-54 -92 A62 62 0 0 0 26 -22" strokeWidth={sw * 1.1} />
      <circle cx={0} cy={-92} r={50} fill={PAPER} />
      <path d={`M-50 -92 H50 M0 -142 Q${-34 + sh} -92 0 -42 M0 -142 Q${34 + sh} -92 0 -42 M-40 -122 H40 M-40 -62 H40`} strokeWidth={1.4} />
    </At>
  );
};

/** Карта на стене (x, y это левый верхний угол). */
export const WallMap: React.FC<{ x: number; y: number; w?: number; h?: number; seed?: number; sw?: number }> = ({ x, y, w = 200, h = 150, seed = 88, sw = 3 }) => {
  const r = rnd(seed);
  return (
    <g strokeWidth={sw}>
      <path d={rc(r, x, y, w, h)} fill={PAPER} />
      <path d={`M${x - 8} ${y} H${x + w + 8} M${x - 8} ${y + h} H${x + w + 8}`} strokeWidth={sw * 1.6} />
      <path d={`M${x + 24} ${y + 60} q18 -38 54 -24 q14 22 -8 48 q-18 18 -34 8 q-20 -8 -12 -32 Z M${x + 108} ${y + 44} q38 -22 66 4 q14 26 -14 40 q-20 24 -36 6 q-26 -18 -16 -50 Z`} strokeWidth={sw * 0.7} />
      <path d={`M${x + 16} ${y + 118} h${w - 32}`} strokeWidth={1.4} />
    </g>
  );
};

/** Стол ресторана со скатертью, свечой, бокалами. */
export const RestTable: React.FC<P & { w?: number; t?: number }> = ({ x, y, s, seed = 89, sw = 3, flip, w = 260, t = 0 }) => {
  const r = rnd(seed);
  const top = -176;
  const flick = Math.sin(t * 0.5) * 2;
  return (
    <At x={x} y={y} s={s} sw={sw} flip={flip}>
      <path d={`M${-w / 2} ${top} Q${-w / 2 - 10} ${top + 80} ${-w / 2 - 6} ${top + 130} q20 -12 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t${w / 2 - 110} 0 Q${w / 2 + 10} ${top + 80} ${w / 2} ${top} Z`} fill={PAPER} />
      {[-0.28, 0, 0.28].map((k) => <path key={k} d={`M${w * k} ${top + 4} Q${w * k + 5} ${top + 70} ${w * k} ${top + 122}`} strokeWidth={1.3} opacity={0.6} />)}
      <path d={`M-14 ${top + 130} V0 M14 ${top + 130} V0 M-58 0 Q0 -20 58 0`} />
      <path d={rc(r, -w / 2 - 8, top - 6, w + 16, 10, 1)} fill={PAPER} strokeWidth={sw * 0.85} />
      <path d={`M-74 ${top - 6} Q-40 ${top - 22} -8 ${top - 6}`} fill={PAPER} strokeWidth={sw * 0.8} />
      <g transform={`translate(${w * 0.3} ${top - 6})`} strokeWidth={sw * 0.7}>
        <path d="M-14 0 H14 M0 0 V-34 M-16 -72 Q-20 -34 0 -34 Q20 -34 16 -72 Z" fill={PAPER} />
      </g>
      <g transform={`translate(${w * 0.08} ${top - 6})`} strokeWidth={sw * 0.8}>
        <path d="M-20 0 H20 M-6 0 V-60 H6 V0" fill={PAPER} />
        <path d={`M0 -64 Q${-10 + flick} -82 0 -100 Q${10 + flick} -82 0 -64 Z`} fill={PAPER} />
      </g>
    </At>
  );
};

/** Винная стойка на стене: сетка ячеек с донцами бутылок (x, y это левый верхний угол). */
export const WineRack: React.FC<{ x: number; y: number; cols?: number; rows?: number; seed?: number; sw?: number }> = ({ x, y, cols = 6, rows = 3, seed = 90, sw = 3 }) => {
  const r = rnd(seed);
  const c = 52;
  return (
    <g strokeWidth={sw}>
      <path d={rc(r, x, y, cols * c, rows * c)} fill={PAPER} />
      {Array.from({ length: cols - 1 }, (_, i) => <path key={i} d={`M${x + (i + 1) * c} ${y} V${y + rows * c}`} strokeWidth={sw * 0.75} />)}
      {Array.from({ length: rows - 1 }, (_, i) => <path key={i} d={`M${x} ${y + (i + 1) * c} H${x + cols * c}`} strokeWidth={sw * 0.75} />)}
      {Array.from({ length: rows }, (_, a) => Array.from({ length: cols }, (_, b) => r() < 0.72 && <g key={`${a}-${b}`}><circle cx={x + b * c + c / 2} cy={y + a * c + c / 2} r={15} strokeWidth={sw * 0.7} /><circle cx={x + b * c + c / 2} cy={y + a * c + c / 2} r={5} strokeWidth={sw * 0.5} /></g>))}
    </g>
  );
};

/** Люстра на цепи: t качает. */
export const Chandelier: React.FC<{ x: number; y?: number; len?: number; t?: number; sw?: number }> = ({ x, y = CEIL, len = 66, t = 0, sw = 3 }) => (
  <g transform={`translate(${x} ${y}) rotate(${Math.sin(t * 0.05) * 1.1})`} strokeWidth={sw}>
    <path d={`M0 0 V${len}`} strokeWidth={sw * 0.7} strokeDasharray="8 5" />
    <path d={`M-96 ${len + 40} Q0 ${len + 96} 96 ${len + 40} M0 ${len} V${len + 68}`} strokeWidth={sw * 1.1} />
    {[-96, -48, 48, 96].map((k) => (
      <g key={k}>
        <path d={`M${k} ${len + (Math.abs(k) > 60 ? 40 : 58)} v-20`} />
        <path d={`M${k - 18} ${len + (Math.abs(k) > 60 ? 22 : 40)} L${k - 11} ${len + (Math.abs(k) > 60 ? -8 : 10)} H${k + 11} L${k + 18} ${len + (Math.abs(k) > 60 ? 22 : 40)} Z`} fill={PAPER} strokeWidth={sw * 0.8} />
      </g>
    ))}
  </g>
);

// ——— Пресет ———

export const PLACES = [
  'openspace', 'meeting', 'home-desk', 'cafe', 'gym', 'kitchen',
  'boss', 'reception', 'park', 'kindergarten', 'market', 'cinema', 'bike-shed', 'cobra-city', 'workshop', 'warehouse', 'night-office', 'phone-chat',
  'hallway', 'stairs', 'elevator', 'bus-stop', 'bedroom', 'hospital', 'school', 'restaurant',
] as const;
export type PlaceKind = (typeof PLACES)[number];

/** Готовые локации: v 0–3 меняет расстановку и зеркалит (чётные как есть, нечётные зеркально), t оживляет мелочи. */
export const Place: React.FC<{ kind: PlaceKind; v?: number; t?: number }> = ({ kind, v = 0, t = 0 }) => {
  const k = ((v % 4) + 4) % 4;
  const m = k % 2 ? -1 : 1;
  const b = k >= 2;
  const fl = m < 0;
  const X = (x: number) => (m > 0 ? x : ENV_W - x);
  const XW = (x: number, w: number) => (m > 0 ? x : ENV_W - x - w);
  const id = `pl-${kind}-${k}`;
  const clockAt = (x: number, y: number, r = 54) => <Clock x={x} y={y} r={r} hour={(9 + k) * 30 + t * 0.02} min={(k * 140 + t * 0.6) % 360} />;

  if (kind === 'openspace') {
    return (
      <g>
        <Shell />
        <RibbonWin x1={150} x2={930} y={536} h={150} id={`${id}-r`} n={b ? 5 : 6} seed={3 + k} />
        {(b ? [270, 540, 810] : [230, 540, 850]).map((px, i) => <CeilLight key={px} x={px} t={t + i * 40} />)}
        <Far o={0.5}>
          {(b ? [205, 400, 595, 790] : [150, 345, 540, 735, 930]).map((px, i) => (
            <g key={px}>
              <Partition x={px + 92} y={WALL} s={0.42} seed={i + 4 + k} sw={2.6} />
              <Desk x={px} y={WALL} s={0.46} seed={i + 9 + k} sw={2.8} screen={i % 2 ? 'chart' : 'code'} t={t} />
            </g>
          ))}
        </Far>
        {b ? (
          <>
            <Shelves x={X(100)} seed={7 + k} flip={fl} h={430} />
            {clockAt(X(100), 1000)}
            <CorkBoard x={XW(866, 190)} y={925} seed={4 + k} />
            <Desk x={X(884)} flip={!fl} seed={11 + k} screen="chart" t={t} />
            <OfficeChair x={X(930)} s={0.72} flip={fl} />
            <Plant x={X(610)} s={0.72} seed={6 + k} />
          </>
        ) : (
          <>
            <CorkBoard x={XW(22, 190)} y={925} seed={4 + k} />
            <Cooler x={X(98)} t={t} flip={fl} s={0.98} />
            {clockAt(X(985), 990)}
            <Desk x={X(892)} flip={fl} seed={12 + k} screen="code" t={t} />
            <OfficeChair x={X(846)} s={0.72} flip={fl} />
            <Printer x={X(610)} s={0.62} flip={fl} seed={6 + k} />
          </>
        )}
      </g>
    );
  }

  if (kind === 'meeting') {
    return (
      <g>
        <Shell />
        <ProjScreen x={XW(b ? 120 : 350, 420)} y={486} t={t} seed={9 + k} />
        <Projector x={X(b ? 780 : 280)} flip={b ? !fl : fl} />
        <BlindWin x={XW(b ? 886 : 22, 170)} y={546} w={170} h={470} id={`${id}-b`} seed={8 + k} />
        {b ? (
          <>
            {clockAt(X(690), 590, 50)}
            <Sideboard x={X(946)} t={t} flip={fl} seed={11 + k} />
            <LongTable x={X(556)} w={640} s={0.92} flip={fl} seed={8 + k} />
            <Flipchart x={X(104)} s={0.98} seed={10 + k} />
          </>
        ) : (
          <>
            {clockAt(X(965), 580, 50)}
            <Sideboard x={X(112)} t={t} flip={fl} seed={11 + k} />
            <LongTable x={X(590)} w={560} s={0.92} flip={fl} seed={8 + k} />
            <Flipchart x={X(972)} s={0.98} seed={10 + k} />
          </>
        )}
      </g>
    );
  }

  if (kind === 'home-desk') {
    const tableX = b ? 566 : 806, top = ENV_G - 184;
    return (
      <g>
        <Shell d={60} />
        <RoomWin x={XW(b ? 40 : 790, 240)} y={510} w={240} h={500} id={`${id}-w`} view={b ? 'trees' : 'city'} seed={5 + k} curtain t={t} />
        <WallShelf x={XW(b ? 780 : 60, 250)} y={656} seed={17 + k} />
        <Pendant x={X(540)} len={46} t={t} />
        {b ? (
          <>
            <Radiator x={X(160)} y={WALL} s={0.94} n={7} seed={16 + k} />
            <Sofa x={X(892)} s={0.9} seed={15 + k} flip={fl} />
            <Frame x={XW(820, 150)} y={960} w={150} h={110} />
          </>
        ) : (
          <>
            <Sofa x={X(142)} s={0.9} seed={15 + k} flip={fl} />
            <Frame x={XW(50, 170)} y={960} w={170} h={120} />
          </>
        )}
        <WorkTable x={X(tableX)} w={b ? 340 : 420} flip={fl} seed={12 + k} />
        <Laptop x={X(tableX + (b ? 8 : 60))} y={top} t={t} seed={13 + k} flip={fl} />
        <Mug x={X(tableX + (b ? -146 : -112))} y={top} t={t} s={0.9} seed={14 + k} flip={fl} />
        {!b && <DeskLamp x={X(tableX - 176)} y={top} s={0.82} flip={fl} />}
      </g>
    );
  }

  if (kind === 'cafe') {
    const barY = ENV_G - 236;
    return (
      <g>
        <Shell d={60} />
        <RoomWin x={XW(b ? 800 : 28, 244)} y={530} w={244} h={560} id={`${id}-w`} view="city" seed={5 + k} />
        <MenuBoard x={XW(b ? 280 : 600, 340)} y={480} seed={19 + k} />
        {b ? (
          <>
            <Pendant x={X(190)} len={32} t={t} /><Pendant x={X(720)} len={72} t={t + 40} />
            <Bar x={X(300)} w={560} flip={fl} seed={18 + k} />
            <Espresso x={X(120)} y={barY} t={t} seed={20 + k} flip={fl} />
            <CupStack x={X(540)} y={barY} flip={fl} />
            <PastryCase x={X(448)} y={barY} flip={fl} s={0.8} seed={21 + k} />
            <BistroTable x={X(790)} seed={22 + k} flip={fl} />
            <BistroChair x={X(674)} flip={fl} s={0.95} />
            <BistroChair x={X(908)} flip={!fl} s={0.95} />
            <Plant x={X(1036)} s={0.68} seed={6 + k} />
          </>
        ) : (
          <>
            <Pendant x={X(510)} len={160} t={t} />
            <Pendant x={X(1000)} len={160} t={t + 40} />
            <Bar x={X(742)} w={620} flip={fl} seed={18 + k} />
            <Espresso x={X(918)} y={barY} t={t} seed={20 + k} flip={fl} />
            <CupStack x={X(766)} y={barY} flip={fl} />
            <PastryCase x={X(604)} y={barY} flip={fl} s={0.84} seed={21 + k} />
            <Stool x={X(544)} s={0.92} flip={fl} />
            <Stool x={X(694)} s={0.92} flip={fl} />
            <BistroTable x={X(152)} seed={22 + k} flip={fl} s={0.98} />
            <BistroChair x={X(54)} flip={fl} s={0.95} />
          </>
        )}
      </g>
    );
  }

  if (kind === 'gym') {
    return (
      <g>
        <Shell d={60} />
        <GymMirror x={XW(b ? 80 : 340, 660)} y={510} w={660} h={WALL - 510} n={b ? 4 : 3} seed={27 + k} />
        {[280, 800].map((px, i) => <CeilLight key={px} x={px} y={CEIL} w={240} t={t + i * 30} />)}
        {b ? (
          <>
            {clockAt(X(965), 590, 50)}
            <Lockers x={X(988)} y={WALL} s={0.72} n={2} seed={29 + k} flip={fl} />
            <SquatRack x={X(752)} s={0.92} seed={24 + k} flip={fl} />
            <PressBench x={X(486)} s={0.7} seed={28 + k} flip={fl} />
            <DumbbellRack x={X(116)} s={0.84} w={290} seed={23 + k} flip={fl} />
          </>
        ) : (
          <>
            {clockAt(X(150), 590, 50)}
            <LatMachine x={X(204)} s={0.95} seed={26 + k} flip={fl} />
            <PlateTree x={X(652)} s={0.62} flip={fl} />
            <DumbbellRack x={X(548)} s={0.62} w={250} seed={23 + k} flip={fl} />
            <Treadmill x={X(828)} s={0.92} t={t} seed={25 + k} flip={fl} />
            <Kettlebells x={X(430)} s={0.7} flip={fl} />
          </>
        )}
      </g>
    );
  }

  if (kind === 'boss') {
    return (
      <g>
        <Shell />
        <BlindWin x={XW(b ? 30 : 590, b ? 190 : 320)} y={b ? 530 : 496} w={b ? 190 : 320} h={b ? 480 : 200} id={`${id}-b`} seed={8 + k} down={b ? 0.62 : 0.5} />
        <Diploma x={XW(b ? 570 : 170, 124)} y={500} seed={41 + k} />
        <Diploma x={XW(b ? 730 : 330, 124)} y={520} seed={45 + k} />
        {b ? (
          <>
            {clockAt(X(910), 600, 50)}
            <Shelves x={X(985)} w={170} h={500} n={5} seed={7 + k} flip={fl} />
            <OfficeChair x={X(640)} s={1.14} flip={fl} seed={2 + k} />
            <BossDesk x={X(640)} w={440} seed={40 + k} flip={fl} />
            <Plant x={X(130)} s={0.92} seed={6 + k} />
          </>
        ) : (
          <>
            {clockAt(X(960), 830, 50)}
            <Shelves x={X(100)} w={180} h={470} n={4} seed={7 + k} flip={fl} />
            <OfficeChair x={X(770)} s={1.14} flip={fl} seed={2 + k} />
            <BossDesk x={X(770)} w={470} seed={40 + k} flip={fl} />
            <Plant x={X(1040)} s={0.72} seed={6 + k} />
          </>
        )}
      </g>
    );
  }

  if (kind === 'reception') {
    const prices: [string, string][] = [['МЕСЯЦ', '3000'], ['ПОЛГОДА', '12000'], ['ГОД', '19900']];
    return (
      <g>
        <Shell d={60} />
        <MenuBoard x={XW(b ? 640 : 610, 340)} y={480} title="ЦЕНЫ" items={prices} seed={19 + k} />
        {clockAt(X(170), 600, 50)}
        <CeilLight x={X(420)} t={t} />
        {b ? (
          <>
            <Frame x={XW(70, 150)} y={930} w={150} h={110} />
            <ReceptionDesk x={X(300)} w={500} seed={42 + k} flip={fl} />
            <Turnstile x={X(640)} s={0.95} seed={43 + k} flip={fl} />
            <Sofa x={X(910)} s={0.68} seed={15 + k} flip={fl} />
          </>
        ) : (
          <>
            <Frame x={XW(60, 150)} y={930} w={150} h={110} />
            <Sofa x={X(130)} s={0.7} seed={15 + k} flip={fl} />
            <Turnstile x={X(462)} s={0.95} seed={43 + k} flip={fl} />
            <ReceptionDesk x={X(826)} w={450} seed={42 + k} flip={fl} />
          </>
        )}
      </g>
    );
  }

  if (kind === 'park') {
    return (
      <g>
        <Hills far={0.5} />
        <Sun x={X(b ? 190 : 870)} y={560} t={t} />
        <Cloud2 x={X(b ? 620 : 240)} y={620} /><Cloud2 x={X(b ? 930 : 560)} y={520} s={0.72} />
        <Far o={0.5}>
          {[120, 330, 540, 730, 940].map((px, i) => <Tree key={px} x={X(px + (k % 3) * 22)} y={ENV_G - 48} s={0.44 + (i % 2) * 0.08} kind={(i + k) % 3 === 2 ? 'pine' : 'round'} seed={i + 4 + k} sw={2.8} />)}
        </Far>
        <path d={`M0 ${ENV_G - 28} H${ENV_W}`} strokeWidth={1.8} strokeDasharray="44 28" opacity={0.6} />
        {b ? (
          <>
            <Swing x={X(590)} s={0.72} t={t} flip={fl} />
            <Slide x={X(850)} s={0.86} flip={fl} />
            <Tree x={X(30)} s={1.1} seed={5 + k} kind="round" />
            <Bench x={X(150)} s={0.74} />
            <Lamp x={X(1040)} s={0.92} flip={!fl} />
          </>
        ) : (
          <>
            <Tree x={X(70)} s={1.08} seed={5 + k} kind="round" />
            <Tree x={X(1020)} s={0.98} seed={8 + k} kind="bare" />
            <Lamp x={X(830)} s={0.92} flip={fl} />
            <Bench x={X(650)} s={0.86} />
            <Bin x={X(510)} s={0.82} />
            <Bush x={X(180)} w={150} s={0.7} seed={3 + k} />
          </>
        )}
        <Tufts n={18} seed={6 + k} />
        <Birds x={X(460)} y={590} t={t} s={0.9} />
      </g>
    );
  }

  if (kind === 'kindergarten') {
    if (b) {
      return (
        <g>
          <Shell d={60} />
          <KidDrawings x={XW(330, 448)} y={510} seed={47 + k} />
          <Clock x={X(180)} y={610} r={72} hour={6 * 30 + 12} min={(144 + t * 0.6) % 360} />
          <RoomWin x={XW(800, 220)} y={500} w={220} h={190} id={`${id}-w`} view="trees" seed={5 + k} />
          <Door x={X(140)} y={WALL} s={0.9} seed={69 + k} side={m} />
          <KidLockers x={X(700)} n={6} seed={46 + k} flip={fl} />
          <Plant x={X(1036)} s={0.66} seed={6 + k} />
        </g>
      );
    }
    return (
      <g>
        <Skyline seed={3 + k} y={ENV_G} max={460} far={0.45} />
        <Cloud2 x={X(180)} y={560} /><Sun x={X(900)} y={540} t={t} />
        <KinderHouse x={X(700)} t={t} seed={44 + k} flip={fl} />
        <Slide x={X(180)} s={0.92} flip={fl} />
        <Bush x={X(350)} w={140} s={0.7} seed={3 + k} />
        <Fence x1={-10} x2={ENV_W + 10} kind="pickets" h={100} seed={k + 2} />
        <Gate x={X(620)} s={0.92} seed={45 + k} flip={fl} />
        <Tufts n={14} seed={6 + k} />
      </g>
    );
  }

  if (kind === 'market') {
    if (b) {
      return (
        <g>
          <Skyline seed={3 + k} y={ENV_G} max={520} far={0.45} />
          <Cloud2 x={X(220)} y={580} />
          <Birds x={X(600)} y={560} t={t} />
          <Stall x={X(710)} w={620} seed={52 + k} />
          <Crate x={X(120)} w={170} seed={51 + k} flip={fl} />
          <Crate x={X(120)} y={ENV_G - 66} w={150} seed={55 + k} flip={fl} />
          <Bin x={X(1050)} s={0.8} />
          <Tufts n={8} seed={6 + k} />
        </g>
      );
    }
    return (
      <g>
        <Shell d={60} />
        {[250, 830].map((px, i) => <CeilLight key={px} x={px} w={230} t={t + i * 30} />)}
        <PromoSign x={X(540)} text="3+1" t={t} seed={49 + k} />
        <Far o={0.5}>
          {[180, 400, 620, 840].map((px, i) => <StoreShelf key={px} x={px} y={WALL} s={0.56} w={210} h={480} n={4} seed={48 + i + k} sw={2.6} />)}
        </Far>
        <StoreShelf x={X(950)} w={260} h={600} seed={53 + k} flip={fl} />
        <Checkout x={X(640)} s={0.86} t={t} seed={50 + k} flip={fl} />
        <BasketStack x={X(90)} flip={fl} />
      </g>
    );
  }

  if (kind === 'cinema') {
    const zal: [string, string][] = [['ЗАЛ 1', '19:30'], ['ЗАЛ 2', '20:15'], ['ЗАЛ 3', '21:00']];
    return (
      <g>
        <Shell d={60} />
        {[0, 1, 2].map((i) => <Poster key={i} x={XW((b ? 500 : 130) + i * 176, 148)} y={482} kind={i + k} seed={53 + i + k} />)}
        {b ? (
          <>
            <TicketBooth x={X(800)} seed={55 + k} />
            <Door x={X(170)} y={WALL} s={0.96} seed={69 + k} num="1" side={m} />
            <Rope x1={X(440) - 60} x2={X(440) + 60} n={1} />
            <Plant x={X(1036)} s={0.62} seed={6 + k} />
          </>
        ) : (
          <>
            <MenuBoard x={XW(700, 320)} y={486} w={320} h={200} title="СЕАНСЫ" items={zal} seed={19 + k} />
            <PopcornCounter x={X(772)} w={520} seed={54 + k} flip={fl} />
            <Rope x1={Math.min(X(60), X(420))} x2={Math.max(X(60), X(420))} n={2} />
          </>
        )}
      </g>
    );
  }

  if (kind === 'bike-shed') {
    return (
      <g>
        <Skyline seed={3 + k} y={ENV_G} max={480} far={0.42} />
        <Far o={0.6}><Block x={X(b ? 880 : 180)} s={0.86} floors={8} cols={4} seed={1 + k} sw={2.4} /></Far>
        <Cloud2 x={X(b ? 200 : 640)} y={560} />
        <Birds x={X(460)} y={600} t={t} s={0.85} />
        <Fence x1={-10} x2={ENV_W + 10} kind="sticks" h={90} seed={k + 3} />
        {b ? (
          <>
            <BikeShed x={X(380)} w={620} flip={fl} />
            <Tree x={X(1000)} s={0.9} seed={5 + k} kind="round" />
            <Bike x={X(860)} s={0.8} flip={fl} />
          </>
        ) : (
          <>
            <Tree x={X(60)} s={0.9} seed={5 + k} kind="bare" />
            <BikeShed x={X(720)} w={620} flip={fl} />
            <Lamp x={X(180)} s={0.9} flip={fl} />
            <Bin x={X(290)} s={0.8} />
          </>
        )}
        <Tufts n={14} seed={6 + k} />
      </g>
    );
  }

  if (kind === 'cobra-city') {
    return (
      <g>
        <Sun x={X(b ? 210 : 850)} y={560} r={64} t={t} />
        <Far o={0.5}>
          <FarDome x={X(b ? 780 : 310)} y={ENV_G - 80} s={0.88} />
          {[60, 300, 560, 820, 1040].map((px, i) => <OldHouse key={px} x={px} y={WALL - 8} s={0.54} w={280 + (i % 2) * 60} h={380 + (i % 3) * 90} seed={57 + i + k} door={false} sw={2.8} />)}
        </Far>
        <Wires y={560} />
        {b ? (
          <>
            <OldHouse x={X(940)} y={ENV_G - 8 * 38} w={300} h={380} seed={61 + k} flip={fl} />
            <Stairs x={X(610)} n={8} land={ENV_W} flip={fl} rail={false} />
            <WoodShed x={X(130)} w={250} seed={58 + k} flip={fl} />
            <SnakeBasket x={X(500)} s={0.86} t={t} flip={fl} />
          </>
        ) : (
          <>
            <Palm x={X(70)} s={1.06} t={t} flip={fl} />
            <OldHouse x={X(910)} w={320} h={470} seed={61 + k} flip={fl} />
            <Stall x={X(590)} w={280} s={0.74} seed={52 + k} tag="1 руп." />
            <SnakeBasket x={X(180)} s={0.9} t={t} flip={fl} />
          </>
        )}
      </g>
    );
  }

  if (kind === 'workshop') {
    return (
      <g>
        <Shell />
        <GridWin x1={150} x2={930} y={516} h={170} cols={b ? 16 : 12} seed={59 + k} />
        <Pendant x={X(b ? 240 : 300)} len={26} t={t} /><Pendant x={X(b ? 800 : 760)} len={26} t={t + 40} />
        {b ? (
          <>
            <Pegboard x={XW(800, 240)} y={925} seed={63 + k} />
            <Shelves x={X(100)} w={180} h={450} n={4} seed={7 + k} flip={fl} />
            <DraftingTable x={X(490)} s={0.92} seed={60 + k} flip={fl} />
            <Workbench x={X(872)} w={380} seed={62 + k} flip={fl} />
          </>
        ) : (
          <>
            <Pegboard x={XW(30, 240)} y={925} seed={63 + k} />
            <DraftingTable x={X(176)} s={0.9} seed={60 + k} flip={fl} />
            <Lathe x={X(800)} t={t} seed={61 + k} flip={fl} />
          </>
        )}
      </g>
    );
  }

  if (kind === 'warehouse') {
    return (
      <g>
        <Shell d={60} />
        <Trusses />
        <Far o={0.45}>
          {[230, 450, 670].map((px, i) => <PalletRack key={px} x={px + (b ? 100 : 0)} y={WALL} s={0.42} w={420} h={900} seed={65 + i + k} sw={3} />)}
        </Far>
        {b ? (
          <>
            <PalletRack x={X(130)} w={250} h={880} seed={70 + k} flip={fl} />
            <RollerDoor x={XW(660, 320)} y={WALL - 430} seed={67 + k} />
            <WarnSign x={X(1000)} y={1030} s={0.9} />
            <BoxStack x={X(520)} rows={2} seed={65 + k} flip={fl} />
            <Forklift x={X(800)} s={0.82} t={t} seed={66 + k} flip={!fl} />
          </>
        ) : (
          <>
            <RollerDoor x={XW(100, 300)} y={WALL - 430} open={0.3} seed={67 + k} />
            <WarnSign x={X(470)} y={1200} s={0.8} />
            <PalletRack x={X(950)} w={250} h={880} seed={70 + k} flip={fl} />
            <Forklift x={X(640)} s={0.82} t={t} seed={66 + k} flip={fl} />
            <BoxStack x={X(120)} rows={3} seed={64 + k} flip={fl} s={0.9} />
          </>
        )}
      </g>
    );
  }

  if (kind === 'night-office') {
    const top = ENV_G - 173;
    return (
      <g>
        <Shell />
        <NightRibbon x1={150} x2={930} y={520} h={170} id={`${id}-r`} n={b ? 5 : 6} seed={3 + k} />
        <Far o={0.45}>
          {(b ? [205, 400, 595, 790] : [150, 345, 540, 735, 930]).map((px, i) => (
            <g key={px}>
              <Partition x={px + 92} y={WALL} s={0.42} seed={i + 4 + k} sw={2.6} />
              <Desk x={px} y={WALL} s={0.46} seed={i + 9 + k} sw={2.8} screen="off" />
            </g>
          ))}
        </Far>
        <Clock x={X(b ? 100 : 985)} y={990} r={54} hour={3 * 30} min={(t * 0.6) % 360} />
        <Desk x={X(b ? 880 : 892)} seed={12 + k} flip={b ? !fl : fl} screen="code" t={t} />
        <DeskLamp x={X(b ? 800 : 985)} y={top} s={0.7} flip={b ? !fl : fl} />
        <Mug x={X(b ? 1022 : 752)} y={top} t={t} s={0.82} seed={14 + k} flip={fl} />
        <OfficeChair x={X(b ? 930 : 846)} s={0.72} flip={fl} />
        {b ? <Shelves x={X(100)} seed={7 + k} flip={fl} h={430} /> : <Cooler x={X(98)} t={t} flip={fl} s={0.98} />}
      </g>
    );
  }

  if (kind === 'phone-chat') {
    return <ChatScreen v={k} t={t} seed={68} />;
  }

  if (kind === 'hallway') {
    if (b) {
      return (
        <g>
          <Corridor t={t} seed={71 + k} />
          <CeilSign x={X(540)} y={520} text="ВЫХОД" seed={70 + k} />
          <Extinguisher x={X(960)} s={0.92} flip={fl} />
          <Plant x={X(120)} s={0.86} seed={6 + k} />
        </g>
      );
    }
    return (
      <g>
        <Shell d={60} />
        {[220, 760].map((px, i) => <CeilLight key={px} x={px} w={200} t={t + i * 30} />)}
        <CeilSign x={X(500)} text="ВЫХОД" seed={70 + k} />
        <path d={`M60 1210 H${ENV_W - 60}`} strokeWidth={2} opacity={0.6} />
        {[['101', 180], ['102', 600], ['103', 920]].map(([num, px], i) => <Door key={String(num)} x={X(px as number)} y={WALL} s={0.94} seed={69 + i + k} num={String(num)} side={i % 2 ? 1 : -1} />)}
        <Extinguisher x={X(760)} s={0.92} flip={fl} />
        <Radiator x={X(400)} y={WALL} s={0.8} n={6} seed={16 + k} />
        <CorkBoard x={XW(330, 190)} y={930} seed={4 + k} />
      </g>
    );
  }

  if (kind === 'stairs') {
    const landY = ENV_G - 9 * 38;
    return (
      <g>
        <Shell d={60} />
        <Tx x={X(b ? 880 : 230)} y={640} size={140}>{String(k + 2)}</Tx>
        <RoomWin x={XW(b ? 330 : 500, 300)} y={490} w={300} h={200} id={`${id}-w`} view="city" seed={5 + k} />
        {b ? (
          <>
            <Door x={X(880)} y={landY} s={0.88} seed={69 + k} num={`${k * 10 + 21}`} side={m} />
            <Stairs x={X(210)} n={9} land={ENV_W} flip={fl} rail={false} />
            <path d={`M${X(210) + m * 8} ${ENV_G - 38 - 142} L${X(210) + m * (9 * 46 + 12)} ${landY - 142} h${m * 110}`} strokeWidth={5} />
            {Array.from({ length: 11 }, (_, i) => <path key={i} d={`M${X(210) + m * (Math.min(i, 9) * 46 + (i > 9 ? 46 : 0) + 14)} ${ENV_G - Math.min(i + 1, 9) * 38} v-142`} strokeWidth={2.1} />)}
            <Mailboxes x={XW(36, 216)} y={980} seed={72 + k} />
          </>
        ) : (
          <>
            <Mailboxes x={XW(90, 216)} y={940} seed={72 + k} />
            <Radiator x={X(180)} y={WALL} s={0.8} n={6} seed={16 + k} />
            <Stairs x={X(450)} n={13} land={160} flip={fl} />
          </>
        )}
      </g>
    );
  }

  if (kind === 'elevator') {
    if (b) {
      return (
        <g>
          <Far o={0.75}>
            <path d={`M90 500 V${WALL} M${ENV_W - 90} 500 V${WALL} M0 462 L90 500 M${ENV_W} 462 L${ENV_W - 90} 500 M0 ${ENV_G} L90 ${WALL} M${ENV_W} ${ENV_G} L${ENV_W - 90} ${WALL} M90 500 H${ENV_W - 90} M90 ${WALL} H${ENV_W - 90}`} strokeWidth={2.2} />
            {[0.25, 0.5, 0.75].map((u) => <path key={u} d={`M${90 + 900 * u} 500 V${WALL}`} strokeWidth={1.5} />)}
          </Far>
          <path d={`M300 488 H780 V512 H300 Z`} fill={PAPER} strokeWidth={3} />
          {[-1.4, -0.5, 0.5, 1.4].map((q) => <path key={q} d={`M${540 + q * 130} 520 v34`} strokeWidth={1.5} strokeDasharray="8 6" opacity={0.6} />)}
          <path d={`M90 1250 H${ENV_W - 90}`} strokeWidth={6} />
          <path d={`M110 1250 v26 M${ENV_W - 110} 1250 v26`} strokeWidth={4} />
          <LiftPanel x={XW(860, 96)} y={930} w={96} h={280} rows={6} t={t} seed={74 + k} />
          <Tx x={X(540)} y={622} size={64}>{String((Math.floor(t / 24) % 9) + 1)}</Tx>
          <GymMirror x={XW(180, 190)} y={640} w={190} h={500} n={1} seed={27 + k} />
          <CorkBoard x={XW(620, 190)} y={1320} w={190} h={130} seed={4 + k} />
        </g>
      );
    }
    return (
      <g>
        <Shell d={60} />
        {[240, 840].map((px, i) => <CeilLight key={px} x={px} w={210} t={t + i * 30} />)}
        {clockAt(X(160), 600, 50)}
        <ElevatorDoor x={X(740)} t={t} seed={73 + k} />
        <LiftPanel x={XW(944, 76)} y={1180} t={t} seed={74 + k} />
        <CorkBoard x={XW(70, 190)} y={930} seed={4 + k} />
        <Plant x={X(120)} s={0.86} seed={6 + k} />
        <Bin x={X(470)} s={0.8} />
      </g>
    );
  }

  if (kind === 'bus-stop') {
    return (
      <g>
        <Skyline seed={3 + k} y={ENV_G} max={520} far={0.42} />
        <Cloud2 x={X(b ? 660 : 170)} y={590} /><Cloud2 x={X(b ? 260 : 700)} y={500} s={0.72} />
        <Wires y={560} />
        <Birds x={X(480)} y={640} t={t} s={0.85} />
        {b ? (
          <>
            <Far o={0.7}><Block x={X(92)} floors={8} cols={3} s={0.74} w={240} seed={1 + k} sw={2.4} /></Far>
            <BusShelter x={X(280)} w={540} seed={75 + k} flip={fl} />
            <Bus x={X(830)} s={0.82} seed={77 + k} flip={fl} />
          </>
        ) : (
          <>
            <Tree x={X(70)} s={0.96} seed={5 + k} kind="round" />
            <Bin x={X(220)} s={0.82} />
            <BusSign x={X(470)} route={String(12 + k)} seed={76 + k} />
            <BusShelter x={X(770)} w={540} seed={75 + k} flip={fl} />
          </>
        )}
        <Road />
        <Tufts n={8} seed={6 + k} from={0} to={420} />
      </g>
    );
  }

  if (kind === 'bedroom') {
    return (
      <g>
        <Shell d={60} />
        <RoomWin x={XW(b ? 40 : 790, 240)} y={510} w={240} h={410} id={`${id}-w`} view="night" seed={5 + k} curtain t={t} />
        <Pendant x={X(540)} len={34} t={t} />
        {b ? (
          <>
            <Frame x={XW(640, 180)} y={930} w={180} h={124} />
            <Wardrobe x={X(960)} seed={80 + k} flip={fl} />
            <Nightstand x={X(170)} t={t} seed={79 + k} flip={fl} />
            <Bed x={X(530)} w={500} seed={78 + k} flip={!fl} />
          </>
        ) : (
          <>
            <Frame x={XW(300, 180)} y={508} w={180} h={124} />
            <Wardrobe x={X(112)} seed={80 + k} flip={fl} />
            <Bed x={X(720)} w={470} seed={78 + k} flip={fl} />
            <Nightstand x={X(1016)} t={t} seed={79 + k} flip={fl} />
          </>
        )}
      </g>
    );
  }

  if (kind === 'hospital') {
    return (
      <g>
        <Shell d={60} />
        <CeilLight x={X(540)} w={260} t={t} />
        <WallCross x={X(b ? 200 : 540)} y={610} s={1.2} />
        {b ? (
          <>
            <BlindWin x={XW(740, 280)} y={500} w={280} h={200} id={`${id}-b`} seed={8 + k} down={0.45} />
            <MedCabinet x={X(975)} w={170} h={470} seed={82 + k} flip={fl} />
            <HospitalBed x={X(640)} w={460} seed={85 + k} flip={!fl} />
            <IVStand x={X(420)} t={t} flip={fl} />
            <Plant x={X(120)} s={0.74} seed={6 + k} />
          </>
        ) : (
          <>
            <EyeChart x={XW(800, 130)} y={500} seed={83 + k} />
            {clockAt(X(240), 590, 48)}
            <MedCabinet x={X(100)} w={180} h={480} seed={82 + k} flip={fl} />
            <FoldScreen x={X(560)} s={0.82} seed={84 + k} flip={fl} />
            <MedCouch x={X(800)} w={420} seed={81 + k} flip={fl} />
            <IVStand x={X(1030)} t={t} flip={!fl} />
          </>
        )}
      </g>
    );
  }

  if (kind === 'school') {
    const near = (b ? [560, 840] : [650, 930]) as number[];
    return (
      <g>
        <Shell d={60} />
        <Blackboard x={XW(b ? 360 : 180, 560)} y={484} seed={86 + k} text={k % 2 ? 'a² + b²' : '2 + 2 = ?'} />
        {clockAt(X(b ? 200 : 900), 600, 50)}
        <WallMap x={XW(b ? 820 : 40, 200)} y={930} seed={88 + k} />
        <Far o={0.5}>
          {[220, 450, 680, 900].map((px, i) => <SchoolDesk key={px} x={px} y={WALL} s={0.58} seed={87 + i + k} sw={2.6} flip={fl} />)}
        </Far>
        {near.map((px, i) => <SchoolDesk key={px} x={X(px)} s={0.96} seed={90 + i + k} flip={fl} />)}
        <WorkTable x={X(b ? 170 : 138)} w={250} h={160} seed={12 + k} flip={fl} />
        <Globe x={X(b ? 110 : 84)} y={ENV_G - 174} s={0.82} t={t} flip={fl} />
        <Mug x={X(b ? 240 : 204)} y={ENV_G - 174} s={0.72} flip={fl} seed={14 + k} />
      </g>
    );
  }

  if (kind === 'restaurant') {
    const menu: [string, string][] = [['СТЕЙК', '1900'], ['ПАСТА', '780'], ['ДЕСЕРТ', '450']];
    return (
      <g>
        <Shell d={60} />
        <Chandelier x={X(b ? 430 : 790)} t={t} />
        <WineRack x={XW(b ? 650 : 130, 312)} y={490} seed={90 + k} />
        {b ? (
          <>
            <RoomWin x={XW(50, 220)} y={520} w={220} h={460} id={`${id}-w`} view="night" seed={5 + k} curtain t={t} />
            <Sideboard x={X(150)} coffee={false} seed={11 + k} flip={fl} />
            <BistroChair x={X(570)} flip={fl} s={1} />
            <BistroChair x={X(910)} flip={!fl} s={1} />
            <RestTable x={X(740)} seed={89 + k} t={t} flip={fl} />
            <Plant x={X(1040)} s={0.66} seed={6 + k} />
          </>
        ) : (
          <>
            <MenuBoard x={XW(800, 240)} y={930} w={240} h={190} title="МЕНЮ" items={menu} seed={21 + k} />
            <Frame x={XW(60, 180)} y={930} w={180} h={130} />
            <Sideboard x={X(112)} coffee={false} seed={11 + k} flip={fl} />
            <BistroChair x={X(650)} flip={fl} s={1} />
            <BistroChair x={X(960)} flip={!fl} s={1} />
            <RestTable x={X(800)} seed={89 + k} t={t} flip={fl} />
          </>
        )}
      </g>
    );
  }

  // kitchen
  const counterX = b ? 646 : 610;
  const counterW = b ? 690 : 560;
  const surf = ENV_G - 210;
  return (
    <g>
      <Shell d={60} />
      <UpperCabs x={XW(b ? 320 : 410, 480)} y={508} w={480} n={b ? 5 : 4} seed={31 + k} />
      <Pendant x={X(b ? 150 : 340)} len={20} t={t} />
      {b ? (
        <>
          <Frig x={X(112)} seed={30 + k} flip={fl} />
          {clockAt(X(150), 980, 44)}
          <Counter x={X(counterX)} w={counterW} n={5} t={t} seed={32 + k} flip={fl} />
          <Microwave x={X(counterX - 250)} y={surf} seed={33 + k} flip={fl} />
          <Jars x={X(counterX + 276)} y={surf} flip={fl} s={0.9} />
          <RoomWin x={XW(846, 190)} y={560} w={190} h={330} id={`${id}-w`} view="night" seed={5 + k} curtain t={t} />
        </>
      ) : (
        <>
          <RoomWin x={XW(52, 230)} y={610} w={230} h={390} id={`${id}-w`} view="night" seed={5 + k} curtain t={t} />
          <KitchenTable x={X(172)} w={232} s={0.94} seed={34 + k} t={t} flip={fl} />
          <Counter x={X(counterX)} w={counterW} t={t} seed={32 + k} flip={fl} />
          <Jars x={X(counterX + 226)} y={surf} flip={fl} s={0.85} />
          <Frig x={X(992)} seed={30 + k} flip={fl} />
        </>
      )}
      {!b && <KitchenChair x={X(46)} s={0.9} flip={fl} />}
    </g>
  );
};
