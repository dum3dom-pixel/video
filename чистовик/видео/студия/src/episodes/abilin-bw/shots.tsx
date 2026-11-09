import React from 'react';
import { useCurrentFrame } from 'remotion';
import { clamp, easeOut, lerp } from '../../engine/anim';
import { Clock, INK, PAPER } from '../../lines/kit';
import { Car, Confetti, Draw, G, Ground, Head, Man, Pop, Sheet, Specs, Stamp, Tash, Tx } from '../piter-bw/shots';
import { T } from './timing';

// «Корпоратив, который никто не хотел» (парадокс Абилина): вертикальный ЧБ 1080×1920, 23 плана.
// Моменты внутри плана (кадры от его начала) лежат в timing.ts, их считает скрипт по best_words.json.

type Pt = { x: number; y: number };

/** Колпак: голова человечка сидит в (x+3s, y-227s), верх головы y-273s. */
const Hat: React.FC<{ x: number; y: number; s?: number; dy?: number }> = ({ x, y, s = 1, dy = 0 }) => (
  <g transform={`translate(${x + 3 * s} ${y - 266 * s + dy}) scale(${s})`} strokeWidth={3 / s}>
    <path d="M-38 0 L2 -96 L42 0 Z" fill={INK} />
    <path d="M-20 -36 H24" stroke={PAPER} strokeWidth={3} />
    <circle cx={2} cy={-102} r={9} fill={PAPER} />
  </g>
);

const Tie: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M-13 -158 L13 -158 L7 -136 L18 -72 L0 -50 L-18 -72 L-7 -136 Z" fill={INK} />
);

const Arrow: React.FC<{ a: Pt; b: Pt; t: number; at: number; n?: number; bend?: number; w?: number }> = ({ a, b, t, at, n = 10, bend = 0, w = 6 }) => {
  const mx = (a.x + b.x) / 2 - (b.y - a.y) * bend;
  const my = (a.y + b.y) / 2 + (b.x - a.x) * bend;
  const ang = Math.atan2(b.y - my, b.x - mx);
  const hl = 34;
  const p1 = { x: b.x - hl * Math.cos(ang - 0.45), y: b.y - hl * Math.sin(ang - 0.45) };
  const p2 = { x: b.x - hl * Math.cos(ang + 0.45), y: b.y - hl * Math.sin(ang + 0.45) };
  return (
    <g>
      <Draw t={t} at={at} n={n} strokeWidth={w} d={`M${a.x} ${a.y} Q${mx} ${my} ${b.x} ${b.y}`} />
      <Draw t={t} at={at + n - 2} n={4} strokeWidth={w} d={`M${p1.x} ${p1.y} L${b.x} ${b.y} L${p2.x} ${p2.y}`} />
    </g>
  );
};

/** Пузырь речи, хвост снизу. tx: x кончика хвоста. */
const Bubble: React.FC<{ x: number; y: number; w: number; h: number; tx?: number; dash?: boolean }> = ({ x, y, w, h, tx, dash }) => {
  const r = 34;
  const bx = (tx ?? x + w / 2) + 12;
  const tip = tx ?? x + w / 2;
  const d = `M${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h} H${bx + 46} L${tip} ${y + h + 62} L${bx} ${y + h} H${x + r} Q${x} ${y + h} ${x} ${y + h - r} V${y + r} Q${x} ${y} ${x + r} ${y} Z`;
  return <path d={d} fill={PAPER} strokeWidth={5} strokeDasharray={dash ? '16 12' : undefined} />;
};

/** Облачко мысли с кружками к голове. */
const Think: React.FC<{ x: number; y: number; w: number; h: number; tailX: number; tailY: number }> = ({ x, y, w, h, tailX, tailY }) => (
  <g strokeWidth={4.5} fill={PAPER}>
    <ellipse cx={x + w / 2} cy={y + h / 2} rx={w / 2} ry={h / 2} />
    <circle cx={lerp(x + w / 2, tailX, 0.55)} cy={lerp(y + h, tailY, 0.5)} r={15} />
    <circle cx={lerp(x + w / 2, tailX, 0.85)} cy={lerp(y + h, tailY, 0.85)} r={9} />
  </g>
);

const Bed: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} strokeWidth={4 / s}>
    <rect x={-56} y={-14} width={112} height={26} fill={PAPER} />
    <path d="M-56 -44 V28 M56 4 V28" />
    <ellipse cx={-34} cy={-26} rx={22} ry={10} fill={PAPER} />
  </g>
);

const Sweat: React.FC<{ x: number; y: number; t: number; k?: number }> = ({ x, y, t, k = 0 }) => (
  <g fill={INK} strokeWidth={2}>
    {[0, 1].map((i) => {
      const u = ((t * 1.8 + i * 17 + k * 9) % 34) / 34;
      return <path key={i} opacity={1 - u} d={`M${x + i * 36} ${y + u * 54} q8 14 0 22 q-8 -8 0 -22 Z`} />;
    })}
  </g>
);

const Phone: React.FC<{ y2?: number }> = ({ y2 = 1560 }) => (
  <g>
    <rect x={140} y={420} width={800} height={y2 - 420} rx={70} fill={PAPER} strokeWidth={6} />
    <path d="M140 540 H940" strokeWidth={4} />
    <Tx x={540} y={500} size={50} bold={1}>ЧАТ ОТДЕЛА</Tx>
  </g>
);

const Msg: React.FC<{ y: number; t: number; at: number }> = ({ y, t, at }) => (
  <Pop x={400} y={y} t={t} at={at}>
    <circle cx={215} cy={y + 55} r={38} fill={INK} />
    <rect x={275} y={y} width={620} height={120} rx={34} fill={PAPER} strokeWidth={4} />
    <Tx x={585} y={y + 76} size={52}>Ну что, в караоке?</Tx>
  </Pop>
);

const row = (n: number, x0: number, dx: number, y: number): Pt[] => Array.from({ length: n }, (_, i) => ({ x: x0 + i * dx, y }));

// 1. Банкетный зал: все в колпаках, лица равнодушные.
const GRID = [155, 405, 655, 905];
export const S1: React.FC = () => {
  const t = useCurrentFrame();
  const s = 0.9;
  return (
    <Sheet hit={T.p1.no}>
      <Head lines={['НИКТО НЕ ХОТЕЛ']} t={t} />
      <Draw t={t} at={4} n={16} strokeWidth={5} d="M40 400 Q540 520 1040 400" />
      <Pop x={540} y={455} t={t} at={14}><Tx x={540} y={470} size={70} bold={1.2}>КОРПОРАТИВ</Tx></Pop>
      {Array.from({ length: 12 }, (_, i) => {
        const x = GRID[i % 4];
        const y = [850, 1200, 1550][Math.floor(i / 4)];
        return (
          <g key={i}>
            <Man x={x} y={y} s={s} mouth="flat" eyes={i % 3 === 0 ? 'up' : 'dots'} seed={i} la={[-26, 70]} ra={[26, 70]} />
            <Hat x={x} y={y} s={s} />
          </g>
        );
      })}
      <Stamp x={540} y={1010} text="НИКТО" t={t} at={T.p1.no} size={120} />
    </Sheet>
  );
};

// 2. Тот, кто придумал, тоже не хотел.
export const S2: React.FC = () => {
  const t = useCurrentFrame();
  const x = 540;
  const s = 1.8;
  return (
    <Sheet hit={T.p2.stamp}>
      <Head lines={['ДАЖЕ ТОТ,', 'КТО ПРИДУМАЛ']} t={t} />
      <Draw t={t} at={2} n={16} strokeWidth={5} d="M40 520 Q540 640 1040 520" />
      <Confetti t={t} at={0} top={450} n={26} seed={4} />
      <Ground />
      <Man x={x} y={G} s={s} mouth="flat" eyes="up" brow="sad" la={[-60, 40]} ra={[60, 40]} seed={2} />
      <Hat x={x} y={G} s={s} />
      <g transform={`rotate(-8 ${x - 210} ${G - 290})`}>
        <rect x={x - 300} y={G - 410} width={190} height={250} fill={PAPER} strokeWidth={4} />
        <Tx x={x - 205} y={G - 345} size={34}>ПРИГЛА-</Tx>
        <Tx x={x - 205} y={G - 305} size={34}>ШЕНИЕ</Tx>
        <path d={`M${x - 280} ${G - 265} h150 M${x - 280} ${G - 235} h150 M${x - 280} ${G - 205} h100`} strokeWidth={2.6} />
      </g>
      <Stamp x={540} y={720} text="ТОЖЕ НЕ ХОТЕЛ" t={t} at={T.p2.stamp} size={80} />
    </Sheet>
  );
};

// 3. Парадокс Абилина, год докручивается до 1974.
export const S3: React.FC = () => {
  const t = useCurrentFrame();
  const y0 = T.p3.year;
  const k = clamp((t - y0) / 18);
  const yr = k <= 0 ? 1968 : Math.min(1974, 1968 + Math.floor(k * 7));
  return (
    <Sheet hit={y0 + 18}>
      <Head lines={['ПАРАДОКС АБИЛИНА']} t={t} />
      <Pop x={540} y={850} t={t} at={4}>
        <rect x={170} y={430} width={740} height={760} fill={PAPER} strokeWidth={6} />
        <rect x={170} y={430} width={740} height={150} fill={INK} />
        <Tx x={540} y={535} size={84} fill={PAPER} bold={1.4}>ГОД</Tx>
        {[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={250 + i * 116} cy={430} r={14} fill={PAPER} />)}
        <Tx x={540} y={900} size={270} bold={4}>{yr}</Tx>
        <path d="M230 1100 H850 M230 1140 H700" strokeWidth={3} />
      </Pop>
      <Pop x={540} y={1400} t={t} at={y0 + 18}>
        <rect x={290} y={1300} width={500} height={150} fill={PAPER} strokeWidth={5} />
        <Tx x={540} y={1390} size={66}>журнал, статья</Tx>
      </Pop>
    </Sheet>
  );
};

// 4. Техас, жара под сорок.
export const S4: React.FC = () => {
  const t = useCurrentFrame();
  const lvl = easeOut(clamp(t / 26));
  const rot = t * 2;
  return (
    <Sheet>
      <Head lines={['ТЕХАС,', 'ЖАРА +40']} t={t} />
      <g transform={`translate(830 640) rotate(${rot})`}>
        {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M0 ${-150 - (i % 2) * 24} V-210`} transform={`rotate(${i * (360 / 14)})`} strokeWidth={6} />)}
      </g>
      <circle cx={830} cy={640} r={124} fill={PAPER} strokeWidth={6} />
      <path d="M770 650 q60 50 120 0" strokeWidth={5} />
      <circle cx={796} cy={620} r={7} fill={INK} stroke="none" />
      <circle cx={864} cy={620} r={7} fill={INK} stroke="none" />
      <rect x={160} y={560} width={80} height={720} rx={40} fill={PAPER} strokeWidth={6} />
      <circle cx={200} cy={1340} r={76} fill={PAPER} strokeWidth={6} />
      <rect x={176} y={1260 - 640 * lvl} width={48} height={90 + 640 * lvl} fill={INK} stroke="none" />
      <circle cx={200} cy={1340} r={56} fill={INK} stroke="none" />
      <Tx x={200} y={500} size={100} bold={2}>+40°</Tx>
      <Ground />
      <Man x={640} y={G} s={1.4} mouth="open" eyes="closed" brow="sad" la={[-40, 50]} ra={[50, -60]} seed={5} />
      <Sweat x={560} y={G - 420} t={t} />
      <path d={`M920 ${G} v-190 M920 ${G - 120} h-46 v-50 M920 ${G - 90} h46 v-40`} strokeWidth={11} />
    </Sheet>
  );
};

// 5. Тесть предлагает съездить в Абилин.
export const S5: React.FC = () => {
  const t = useCurrentFrame();
  const x = 360;
  const s = 1.9;
  return (
    <Sheet hit={T.p5.bub}>
      <Head lines={['ПОЕДЕМ ПОУЖИНАТЬ?']} t={t} />
      <circle cx={820} cy={540} r={100} fill={PAPER} strokeWidth={5} />
      <circle cx={820} cy={540} r={62} strokeWidth={3} />
      <path d="M640 440 V630 M622 440 V500 M658 440 V500 M622 500 Q640 530 658 500" strokeWidth={5} />
      <path d="M1000 440 V630 M1000 440 Q1040 470 1000 540" strokeWidth={5} />
      <Ground />
      <Man x={x} y={G} s={s} mouth="grin" eyes="dots" brow="raised" la={[-50, 30]} ra={[40, -75]} seed={6} />
      <Specs x={x} y={G} s={s} />
      <Tash x={x} y={G} s={s} />
      <Pop x={600} y={820} t={t} at={T.p5.bub}>
        <Bubble x={140} y={700} w={800} h={210} tx={x + 30} />
        <Tx x={540} y={795} size={72} bold={0.8}>Съездим поужинать</Tx>
        <Tx x={540} y={878} size={72} bold={0.8}>в Абилин?</Tx>
      </Pop>
      <Pop x={870} y={1250} t={t} at={T.p5.bub + 18}>
        <path d="M780 1480 V1120 H980 V1480 Z" fill={PAPER} strokeWidth={5} />
        <Tx x={880} y={1210} size={60} bold={1}>АБИЛИН</Tx>
        <Tx x={880} y={1300} size={80} bold={2}>85 КМ</Tx>
      </Pop>
    </Sheet>
  );
};

// 6. Он переживал, что гостям скучно.
export const S6: React.FC = () => {
  const t = useCurrentFrame();
  const g = row(3, 560, 220, G);
  const zz = T.p6.zz;
  return (
    <Sheet>
      <Head lines={['ПЕРЕЖИВАЛ,', 'ЧТО СКУЧНО']} t={t} />
      <Ground />
      <Man x={190} y={G} s={1.45} mouth="o" eyes="dots" brow="sad" la={[-26, 40]} ra={[26, -70]} seed={6} />
      <Specs x={190} y={G} s={1.45} />
      <Tash x={190} y={G} s={1.45} />
      <Pop x={330} y={900} t={t} at={6}>
        <Bubble x={90} y={740} w={470} h={140} tx={200} />
        <Tx x={325} y={830} size={62}>им скучно?</Tx>
      </Pop>
      {g.map((p, i) => (
        <g key={i}>
          <Man x={p.x} y={p.y} s={1.05} mouth="o" eyes="closed" seed={i + 2} la={[-26, 70]} ra={[26, 70]} />
          {t >= zz + i * 5 && (
            <g>
              <Tx x={p.x + 56} y={G - 300 - Math.sin(t / 6 + i) * 8} size={54}>z</Tx>
              <Tx x={p.x + 92} y={G - 342 - Math.sin(t / 6 + i) * 8} size={76}>Z</Tx>
            </g>
          )}
        </g>
      ))}
    </Sheet>
  );
};

// 7. Все отвечают «отличная идея», а думают о кровати.
export const S7: React.FC = () => {
  const t = useCurrentFrame();
  const xs = [150, 400, 650, 900];
  return (
    <Sheet hit={T.p7.ok}>
      <Head lines={['ОТЛИЧНАЯ ИДЕЯ']} t={t} />
      <Ground />
      {xs.map((x, i) => (
        <g key={x}>
          <Man x={x} y={G} s={1.25} mouth="smile" eyes="dots" seed={i + 1} la={[-30, 60]} ra={[30, 60]} bob />
          <Pop x={x} y={900} t={t} at={T.p7.ok + 10 + i * 6}>
            <Think x={x - 105} y={820} w={210} h={150} tailX={x} tailY={1160} />
            <Bed x={x} y={905} s={1.1} />
          </Pop>
        </g>
      ))}
      <Pop x={540} y={600} t={t} at={T.p7.ok}>
        <Bubble x={150} y={470} w={780} h={140} tx={400} />
        <Tx x={540} y={567} size={84} bold={1.2}>Отличная идея!</Tx>
      </Pop>
    </Sheet>
  );
};

// 8. 85 км в машине без кондиционера.
export const S8: React.FC = () => {
  const t = useCurrentFrame();
  const sh = Math.sin(t * 1.3) * 3;
  return (
    <Sheet>
      <Head lines={['85 КМ', 'БЕЗ КОНДИЦИОНЕРА']} t={t} />
      <Draw t={t} at={T.p8.ac} n={10} strokeWidth={14} d="M720 470 L940 690 M940 470 L720 690" />
      <g strokeWidth={5} opacity={t >= T.p8.ac ? 0.55 : 1}>
        {[0, 60, 120].map((a) => <path key={a} d="M830 450 V710" transform={`rotate(${a} 830 580)`} />)}
        {[0, 60, 120, 180, 240, 300].map((a) => <path key={a} d="M830 480 l-18 -22 M830 480 l18 -22" transform={`rotate(${a} 830 580)`} />)}
      </g>
      <Ground />
      <g transform={`translate(540 ${G + sh}) scale(1.7)`}>
        <Car x={0} y={0} s={1} />
        {[[-30, -112], [40, -112]].map(([hx, hy], i) => (
          <g key={i}>
            <circle cx={hx} cy={hy} r={14} fill={PAPER} strokeWidth={2.6} />
            <path d={`M${hx - 6} ${hy - 4} h3 M${hx + 4} ${hy - 4} h3 M${hx - 5} ${hy + 6} h10`} strokeWidth={2.4} />
          </g>
        ))}
      </g>
      {[0, 1, 2, 3].map((i) => {
        const u = ((t * 1.7 + i * 25) % 100) / 100;
        return <path key={i} opacity={1 - u} d={`M${700 + i * 38} ${G - 420 - u * 220} q-18 -18 0 -36 t0 -36`} strokeWidth={4} />;
      })}
      {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${((i * 260 - t * 22) % 1300 + 1300) % 1300 - 100} ${G + 60} h90`} strokeWidth={5} />)}
    </Sheet>
  );
};

// 9. Домой едут злые.
export const S9: React.FC = () => {
  const t = useCurrentFrame();
  const sh = Math.sin(t * 1.3) * 3;
  const spiral = (cx: number, cy: number) => {
    const pts = Array.from({ length: 36 }, (_, k) => {
      const a = k * 0.75;
      const r = 4 + k * 2.1;
      return `${cx + r * Math.cos(a)} ${cy + r * Math.sin(a)}`;
    });
    return `M${pts.join(' L')}`;
  };
  return (
    <Sheet>
      <Head lines={['ДОМОЙ —', 'ЗЛЫЕ']} t={t} />
      <Ground />
      <g transform={`translate(540 ${G + sh}) scale(-1.7 1.7)`}>
        <Car x={0} y={0} s={1} />
        {[[-30, -112], [40, -112]].map(([hx, hy], i) => (
          <g key={i}>
            <circle cx={hx} cy={hy} r={14} fill={PAPER} strokeWidth={2.6} />
            <path d={`M${hx - 8} ${hy - 9} l7 4 M${hx + 8} ${hy - 9} l-7 4 M${hx - 5} ${hy + 6} h10`} strokeWidth={2.4} />
          </g>
        ))}
      </g>
      {[{ x: 330, y: 760 }, { x: 560, y: 650 }, { x: 790, y: 770 }].map((p, i) => (
        <Draw key={i} t={t} at={10 + i * 10} n={22} strokeWidth={5} d={spiral(p.x, p.y)} />
      ))}
      {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${((i * 260 + t * 22) % 1300) - 100} ${G + 60} h90`} strokeWidth={5} />)}
    </Sheet>
  );
};

// 10. Выясняется: ехать не хотел никто.
export const S10: React.FC = () => {
  const t = useCurrentFrame();
  const xs = [150, 400, 650, 900];
  return (
    <Sheet hit={T.p10.stamp}>
      <Head lines={['НЕ ХОТЕЛ', 'НИКТО']} t={t} />
      <Ground />
      {xs.map((x, i) => (
        <g key={x}>
          <Man x={x} y={G} s={1.2} mouth="open" eyes="wide" brow="angry" seed={i + 3} la={[-32, 50]} ra={[i < 3 ? 80 : 40, i < 3 ? -20 : 60]} />
          <Pop x={x} y={950} t={t} at={4 + i * 6}>
            <Bubble x={x - 118} y={830} w={236} h={110} tx={x} />
            <Tx x={x} y={905} size={42}>я не хотел</Tx>
          </Pop>
        </g>
      ))}
      <Stamp x={540} y={640} text="ХОТЕЛ: 0" t={t} at={T.p10.stamp} size={104} />
    </Sheet>
  );
};

// 11. Каждый соглашался, думая, что остальные хотят.
export const S11: React.FC = () => {
  const t = useCurrentFrame();
  const a = T.p11.arr;
  const m = [{ x: 280, y: 1000 }, { x: 800, y: 1000 }, { x: 800, y: 1500 }, { x: 280, y: 1500 }];
  return (
    <Sheet>
      <Head lines={['ДУМАЛ: ОСТАЛЬНЫЕ', 'ХОТЯТ']} t={t} />
      {m.map((p, i) => (
        <Man key={i} x={p.x} y={p.y} s={1.0} mouth="smile" eyes="dots" seed={i + 7} bob la={[-26, 70]} ra={[26, 70]} />
      ))}
      <Arrow a={{ x: 380, y: 840 }} b={{ x: 700, y: 840 }} t={t} at={a} />
      <Arrow a={{ x: 900, y: 1050 }} b={{ x: 900, y: 1260 }} t={t} at={a + 8} />
      <Arrow a={{ x: 700, y: 1360 }} b={{ x: 380, y: 1360 }} t={t} at={a + 16} />
      <Arrow a={{ x: 180, y: 1260 }} b={{ x: 180, y: 1050 }} t={t} at={a + 24} />
      <Pop x={540} y={1200} t={t} at={a + 30}><Tx x={540} y={1225} size={86} bold={1.6}>они хотят?</Tx></Pop>
    </Sheet>
  );
};

// 12. Никто не сказал «я не хочу».
export const S12: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.p12.x}>
      <Head lines={['НИКТО НЕ СКАЗАЛ']} t={t} />
      <Ground />
      <Man x={540} y={G} s={1.7} mouth="flat" eyes="dots" brow="sad" la={[-30, 70]} ra={[30, 70]} seed={4} />
      <Pop x={540} y={800} t={t} at={4}>
        <Bubble x={140} y={560} w={800} h={230} tx={560} dash />
        <Tx x={540} y={705} size={110} bold={1}>я не хочу</Tx>
      </Pop>
      <Draw t={t} at={T.p12.x} n={9} strokeWidth={16} d="M200 590 L880 760" />
      <Draw t={t} at={T.p12.x + 5} n={9} strokeWidth={16} d="M880 590 L200 760" />
    </Sheet>
  );
};

/** Тесть слева, трое гостей справа. back: стрелка от гостей к тестю. */
const Guests: React.FC<{ back?: boolean }> = ({ back }) => {
  const t = useCurrentFrame();
  const g = row(3, 600, 190, G);
  return (
    <>
      <Head lines={back ? ['СОГЛАСИЛИСЬ —', 'ЧТОБЫ НЕ ОБИДЕТЬ'] : ['ПРЕДЛОЖИЛ —', 'ЧТОБЫ НЕ СКУЧАЛИ']} t={t} />
      <Ground />
      <Man x={200} y={G} s={1.5} mouth={back ? 'grin' : 'smile'} eyes="dots" seed={6} la={[-26, 60]} ra={[26, 60]} />
      <Specs x={200} y={G} s={1.5} />
      <Tash x={200} y={G} s={1.5} />
      {g.map((p, i) => (
        <Man key={i} x={p.x} y={p.y} s={1.05} mouth={back ? 'smile' : 'o'} eyes={back ? 'dots' : 'closed'} seed={i + 2} la={[-26, 70]} ra={[26, 70]} bob={back} />
      ))}
      {back ? (
        <Arrow a={{ x: 900, y: 1010 }} b={{ x: 330, y: 960 }} t={t} at={2} n={16} bend={-0.22} />
      ) : (
        <Arrow a={{ x: 330, y: 960 }} b={{ x: 900, y: 1010 }} t={t} at={2} n={16} bend={0.22} />
      )}
      <Pop x={600} y={780} t={t} at={14}>
        <Tx x={600} y={780} size={66} bold={1} rot={-3}>{back ? 'чтобы не обидеть' : 'чтобы не скучали'}</Tx>
      </Pop>
    </>
  );
};
export const S13: React.FC = () => <Sheet><Guests /></Sheet>;
export const S14: React.FC = () => <Sheet><Guests back /></Sheet>;

// 15. Пятница, чат: «ну что, в караоке?»
export const S15: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.p15.msg}>
      <Head lines={['ПЯТНИЦА']} t={t} />
      <Phone />
      <Msg y={640} t={t} at={T.p15.msg} />
      <Stamp x={540} y={1000} text="ПТ" t={t} at={T.p15.cal} size={150} />
      <Clock x={540} y={1280} r={90} hour={t * 1.2} min={t * 14} />
    </Sheet>
  );
};

// 16. Все ставят плюсики, и ты тоже.
export const S16: React.FC = () => {
  const t = useCurrentFrame();
  const p = T.p16.plus;
  const cells = [0, 1, 2, 3, 4, 5].map((i) => ({ x: 300 + (i % 3) * 210, y: 880 + Math.floor(i / 3) * 150 }));
  return (
    <Sheet hit={T.p16.you}>
      <Head lines={['ВСЕ СТАВЯТ ПЛЮС']} t={t} />
      <Phone y2={1260} />
      <Msg y={600} t={t} at={0} />
      {cells.map((c, i) => (
        <Pop key={i} x={c.x} y={c.y} t={t} at={p + i * 5}>
          <rect x={c.x - 80} y={c.y - 55} width={160} height={110} rx={36} fill={PAPER} strokeWidth={4} />
          <Tx x={c.x} y={c.y + 26} size={80} bold={2}>+1</Tx>
        </Pop>
      ))}
      <Ground />
      <Man x={540} y={G} s={0.95} mouth="flat" eyes="up" brow="sad" la={[-40, 20]} ra={[44, -96]} seed={8} />
      <Pop x={880} y={1130} t={t} at={T.p16.you}>
        <rect x={780} y={1085} width={150} height={100} rx={34} fill={INK} />
        <Tx x={855} y={1160} size={72} fill={PAPER} bold={2}>+1</Tx>
      </Pop>
    </Sheet>
  );
};

// 17. Караоке, одиннадцать человек, никто не хочет петь.
export const S17: React.FC = () => {
  const t = useCurrentFrame();
  const crowd = [...row(6, 110, 172, 900), ...row(5, 196, 172, 1200)];
  return (
    <Sheet hit={T.p17.no}>
      <Head lines={['КАРАОКЕ,', '11 ЧЕЛОВЕК']} t={t} />
      <rect x={250} y={420} width={580} height={200} fill={INK} />
      <Tx x={540} y={545} size={92} fill={PAPER} bold={1.4}>КАРАОКЕ</Tx>
      {crowd.map((p, i) => (
        <Man key={i} x={p.x} y={p.y} s={0.75} mouth="flat" eyes={i % 2 ? 'up' : 'dots'} seed={i} la={[-24, 66]} ra={[24, 66]} />
      ))}
      <Ground y={900 + 14} hatch={false} />
      <Ground />
      <path d={`M540 ${G} V1380`} strokeWidth={8} />
      <rect x={510} y={1310} width={60} height={86} rx={28} fill={PAPER} strokeWidth={6} />
      <Stamp x={540} y={1460} text="ПЕТЬ НИКТО" t={t} at={T.p17.no} size={86} />
    </Sheet>
  );
};

// 18. Планёрка: все молчат.
export const S18: React.FC = () => {
  const t = useCurrentFrame();
  const xs = [155, 405, 655, 905];
  const rows = [1020, 1380];
  return (
    <Sheet>
      <Head lines={['ТО ЖЕ —', 'НА ПЛАНЁРКЕ']} t={t} />
      <rect x={200} y={400} width={680} height={290} fill={PAPER} strokeWidth={6} />
      <Draw t={t} at={6} n={22} strokeWidth={5} d="M260 640 L400 560 L520 600 L680 470 L820 500" />
      <Tx x={540} y={470} size={56}>ПЛАН НА КВАРТАЛ</Tx>
      {rows.map((y, r) => (
        <React.Fragment key={y}>
          {xs.map((x, i) => (
            <g key={x}>
              <Man x={x} y={y} s={0.85} mouth="flat" eyes={(i + r) % 2 ? 'up' : 'dots'} seed={i + r * 4} la={[-24, 66]} ra={[24, 66]} />
              <Pop x={x + 60} y={y - 280} t={t} at={T.p18.dots + i * 4 + r * 8}>
                <Tx x={x + 60} y={y - 260} size={70} bold={1}>...</Tx>
              </Pop>
            </g>
          ))}
          <Ground y={y + 14} hatch={false} />
        </React.Fragment>
      ))}
    </Sheet>
  );
};

// 19. Начальник: «раз молчат, значит согласны».
export const S19: React.FC = () => {
  const t = useCurrentFrame();
  const sil = row(3, 640, 150, G);
  return (
    <Sheet hit={T.p19.stamp}>
      <Head lines={['МОЛЧАТ =', 'СОГЛАСНЫ']} t={t} />
      <Ground />
      <Man x={260} y={G} s={1.65} mouth="grin" eyes="dots" brow="raised" la={[-40, 40]} ra={[56, -20]} seed={1} />
      <Tie x={260} y={G} s={1.65} />
      {sil.map((p, i) => (
        <Man key={i} x={p.x} y={p.y} s={0.85} mouth="flat" eyes="up" seed={i + 4} la={[-24, 66]} ra={[24, 66]} />
      ))}
      <Pop x={560} y={780} t={t} at={4}>
        <Think x={190} y={540} w={720} h={250} tailX={290} tailY={1090} />
        <Tx x={550} y={640} size={74}>раз молчат —</Tx>
        <Tx x={550} y={730} size={74}>значит согласны</Tx>
      </Pop>
      <Stamp x={700} y={1130} text="СОГЛАСНЫ" t={t} at={T.p19.stamp} size={88} />
    </Sheet>
  );
};

// 20. Профессор Харви сидел в той машине и написал статью.
export const S20: React.FC = () => {
  const t = useCurrentFrame();
  const sh = Math.sin(t * 1.3) * 2;
  return (
    <Sheet hit={T.p20.paper}>
      <Head lines={['ДЖЕРРИ ХАРВИ', 'БЫЛ В МАШИНЕ']} t={t} />
      <Ground />
      <g transform={`translate(520 ${G + sh}) scale(1.9)`}>
        <Car x={0} y={0} s={1} />
        <g>
          <circle cx={-30} cy={-112} r={14} fill={PAPER} strokeWidth={2.6} />
          <circle cx={-35} cy={-114} r={4.4} strokeWidth={1.6} />
          <circle cx={-25} cy={-114} r={4.4} strokeWidth={1.6} />
          <path d="M-36 -104 h12" strokeWidth={2.2} />
        </g>
        <circle cx={40} cy={-112} r={14} fill={PAPER} strokeWidth={2.6} />
        <path d="M34 -108 h12" strokeWidth={2.2} />
      </g>
      <Arrow a={{ x: 330, y: 1140 }} b={{ x: 440, y: 1330 }} t={t} at={6} n={12} />
      <Tx x={250} y={1000} size={64} bold={1}>профессор</Tx>
      <Tx x={250} y={1075} size={64} bold={1}>Харви</Tx>
      <Pop x={820} y={640} t={t} at={T.p20.paper}>
        <g transform="rotate(6 820 640)">
          <rect x={650} y={430} width={340} height={430} fill={PAPER} strokeWidth={5} />
          <Tx x={820} y={520} size={64} bold={1}>СТАТЬЯ</Tx>
          <path d="M690 580 h260 M690 625 h260 M690 670 h260 M690 715 h260 M690 760 h160" strokeWidth={3} />
        </g>
      </Pop>
    </Sheet>
  );
};

// 21. Вывод Харви: боятся не ошибки, а спорить.
export const S21: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.p21.spor}>
      <Head lines={['ВЫВОД ХАРВИ']} t={t} />
      <Tx x={540} y={470} size={78}>люди боятся не</Tx>
      <Tx x={540} y={640} size={140} bold={2.4}>ошибки</Tx>
      <Draw t={t} at={T.p21.cross} n={9} strokeWidth={14} d="M190 600 L890 590" />
      <Stamp x={560} y={930} text="СПОРИТЬ" t={t} at={T.p21.spor} size={118} />
      <Ground />
      <Man x={540} y={G} s={1.5} mouth="open" eyes="wide" brow="sad" la={[-50, 30]} ra={[50, 30]} seed={9} bob />
      <Sweat x={440} y={G - 440} t={t} />
    </Sheet>
  );
};

// 22. Скажи первым: один встаёт, остальные поднимают руки.
export const S22: React.FC = () => {
  const t = useCurrentFrame();
  const up = t >= T.p22.hands;
  const A = row(4, 190, 240, 1150);
  const B = [150, 340, 740, 930].map((x) => ({ x, y: G }));
  return (
    <Sheet hit={T.p22.hands}>
      <Head lines={['СКАЖИ ПЕРВЫМ']} t={t} />
      {A.map((p, i) => (
        <Man key={i} x={p.x} y={p.y} s={0.8} mouth={up ? 'smile' : 'flat'} eyes="dots" seed={i} la={up ? [-18, -96] : [-24, 66]} ra={up ? [18, -96] : [24, 66]} bob={up} />
      ))}
      <Ground y={1164} hatch={false} />
      <Ground />
      {B.map((p, i) => (
        <Man key={i} x={p.x} y={p.y} s={0.8} mouth={up ? 'smile' : 'flat'} eyes="dots" seed={i + 4} la={up ? [-18, -96] : [-24, 66]} ra={up ? [18, -96] : [24, 66]} bob={up} />
      ))}
      <Man x={540} y={G} s={1.1} mouth="open" eyes="dots" brow="raised" la={[-30, 60]} ra={[34, -104]} seed={9} />
      <Pop x={540} y={720} t={t} at={T.p22.bub}>
        <Bubble x={90} y={440} w={900} h={210} tx={540} />
        <Tx x={540} y={565} size={80} bold={1}>Я не хочу в караоке</Tx>
      </Pop>
    </Sheet>
  );
};

// 23. Поздравляю: корпоратив придумал ты.
export const S23: React.FC = () => {
  const t = useCurrentFrame();
  const at = T.p23.stamp;
  const fall = 1 - easeOut(clamp((t - at + 14) / 14));
  return (
    <Sheet hit={at}>
      <Head lines={['ПОЗДРАВЛЯЮ!']} t={t} />
      <Ground />
      <Man x={540} y={G} s={1.8} mouth="flat" eyes="up" brow="sad" la={[-50, 40]} ra={[50, 40]} seed={2} />
      {t >= at - 14 && <Hat x={540} y={G} s={1.8} dy={-fall * 700} />}
      <Confetti t={t} at={at} top={420} n={40} seed={6} />
      <Stamp x={540} y={800} text="ПРИДУМАЛ ТЫ" t={t} at={at} size={96} />
    </Sheet>
  );
};
