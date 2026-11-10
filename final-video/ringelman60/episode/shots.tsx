import React from 'react';
import { useCurrentFrame } from 'remotion';
import { clamp, easeOut, lerp } from '../../engine/anim';
import { Clock, INK, PAPER } from '../../lines/kit';
import { Check, Draw, G, Ground, Head, Man, Pop, Sheet, Specs, Stamp, Tash, Tx } from '../piter-bw/shots';
import { T } from './timing';

// «Эффект Рингельмана» на 60 с: вертикальный ЧБ 1080×1920, 26 планов. Моменты внутри плана (кадры от начала плана) лежат в timing.ts,
// их считает final-video/tools/gen_timing.py из best_words.json. Нижние ~350 px занимает интерфейс Reels: там только земля.

const COLS = [155, 405, 655, 905];

const Rope: React.FC<{ y: number; x1: number; x2: number; sag?: number }> = ({ y, x1, x2, sag = 0 }) => (
  <g>
    <path d={`M${x1} ${y} Q${(x1 + x2) / 2} ${y + sag} ${x2} ${y}`} strokeWidth={9} />
    <path d={`M${x1} ${y} Q${(x1 + x2) / 2} ${y + sag} ${x2} ${y}`} strokeWidth={3} stroke={PAPER} strokeDasharray="10 14" />
  </g>
);

const Laptop: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} strokeWidth={3 / s}>
    <rect x={-48} y={-70} width={96} height={64} fill={PAPER} />
    <path d="M-62 0 H62 L50 -8 H-50 Z" fill={INK} />
  </g>
);

type Mood = 'work' | 'idle' | 'ghost';
/** Совещание: два ряда по четыре за столами. mood по каждому: работает, спит или выцвел. */
const Meeting: React.FC<{ t: number; moods: Mood[]; y1?: number; y2?: number; s?: number; lyokha?: number; showAt?: number }> = ({ t, moods, y1 = 1040, y2 = 1420, s = 0.85, lyokha = -1, showAt = 0 }) => (
  <g>
    {moods.map((m, i) => {
      const x = COLS[i % 4];
      const y = i < 4 ? y1 : y2;
      const work = m === 'work';
      return (
        <Pop key={i} x={x} y={y} t={t} at={showAt + i * 3} n={6}>
          <g opacity={m === 'ghost' ? 0.16 : 1}>
            <Man x={x} y={y} s={s} mouth={work ? 'grin' : 'flat'} eyes={work ? 'dots' : 'closed'} hair={i === lyokha ? 'tuft' : 'none'} seed={i} bob={work} la={[-24, 64]} ra={[24, 64]} />
            <rect x={x - 112} y={y - 96 * s} width={224} height={96 * s} fill={PAPER} strokeWidth={4} />
            {work && <Laptop x={x} y={y - 96 * s} s={0.9} />}
            {m === 'idle' && (
              <g>
                <Tx x={x + 60} y={y - 250 * s - Math.sin(t / 6 + i) * 6} size={46}>z</Tx>
                <Tx x={x + 92} y={y - 288 * s - Math.sin(t / 6 + i) * 6} size={64}>Z</Tx>
              </g>
            )}
          </g>
        </Pop>
      );
    })}
  </g>
);

const HALF: Mood[] = ['work', 'work', 'work', 'work', 'idle', 'idle', 'idle', 'idle'];

// 1. Совещание на 8 человек.
export const S1: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['СОВЕЩАНИЕ', 'НА 8 ЧЕЛОВЕК']} t={t} />
      <Clock x={940} y={460} r={56} hour={90 + t * 0.2} min={t * 6} />
      <Meeting t={t} moods={Array(8).fill('work') as Mood[]} />
      <Stamp x={300} y={560} text="8" t={t} at={T.p1.eight} size={120} />
    </Sheet>
  );
};

// 2. Работают четверо.
export const S2: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['РАБОТАЮТ', 'ТОЛЬКО 4']} t={t} />
      <Meeting t={t + 99} moods={HALF.map((m, i) => (i >= 4 && t < T.p2.four ? 'work' : m))} />
      <Stamp x={540} y={640} text="4 ИЗ 8" t={t} at={T.p2.four} size={104} />
    </Sheet>
  );
};

// 3. Остальные сидят.
export const S3: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.p3.x}>
      <Head lines={['ОСТАЛЬНЫЕ', 'ПРОСТО СИДЯТ']} t={t} />
      <Meeting t={t + 99} moods={HALF} />
      <Stamp x={540} y={640} text="СИДЯТ" t={t} at={T.p3.sit} size={104} />
    </Sheet>
  );
};

// 4. Больше ста лет назад: страница журнала 1913 года.
export const S4: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['БОЛЬШЕ 100 ЛЕТ', 'НАЗАД']} t={t} />
      <Pop x={540} y={900} t={t} at={4} n={10}>
        <g transform="rotate(-3 540 900)">
          <rect x={200} y={500} width={680} height={900} fill={PAPER} strokeWidth={6} />
          <path d="M200 560 H880" strokeWidth={4} />
          {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M250 ${1010 + i * 52} h${i === 4 ? 260 : 580}`} strokeWidth={3} />)}
          <Draw t={t} at={14} n={16} strokeWidth={5} d="M250 640 h420 M250 690 h300" />
          <Tx x={540} y={930} size={250} bold={3}>1913</Tx>
        </g>
      </Pop>
      <Stamp x={820} y={1360} text="ЖУРНАЛ" t={t} at={T.p4.hundred} size={72} rot={6} />
    </Sheet>
  );
};

// 5. Рингельман: француз в берете, блокнот, моток каната.
export const S5: React.FC = () => {
  const t = useCurrentFrame();
  const s = 2.1;
  const x = 400;
  return (
    <Sheet>
      <Head lines={['РИНГЕЛЬМАН']} t={t} />
      <Pop x={790} y={560} t={t} at={6}>
        <rect x={560} y={420} width={440} height={150} fill={INK} />
        <rect x={574} y={434} width={412} height={122} stroke={PAPER} strokeWidth={3} />
        <Tx x={780} y={512} size={56} fill={PAPER} bold={1.2}>ФРАНЦУЗ</Tx>
      </Pop>
      <Ground />
      <Man x={x} y={G} s={s} mouth="grin" brow="raised" la={[-70, 10]} ra={[-30, 60]} seed={3} />
      <Specs x={x} y={G} s={s} />
      <Tash x={x} y={G} s={s} />
      <ellipse cx={x + 8 * s} cy={G - 268 * s} rx={64 * s} ry={15 * s} fill={INK} />
      <path d={`M${x + 8 * s} ${G - 281 * s} v${-16 * s}`} strokeWidth={9} />
      <g transform={`rotate(-12 ${x - 223} ${G - 294})`}>
        <rect x={x - 283} y={G - 374} width={120} height={160} fill={PAPER} />
        <path d={`M${x - 265} ${G - 338} h84 M${x - 265} ${G - 308} h84 M${x - 265} ${G - 278} h60`} strokeWidth={2.4} />
      </g>
      {[0, 1, 2, 3].map((i) => <ellipse key={i} cx={810} cy={G - 40 - i * 16} rx={150 - i * 14} ry={34} fill={PAPER} />)}
      <path d={`M960 ${G - 52} q60 -30 40 -90`} strokeWidth={9} />
      <Draw t={t} at={T.p5.rope - 10} n={14} strokeWidth={5} d="M560 700 q120 -40 240 0 t240 0" />
      <Tx x={780} y={790} size={64} bold={1.2}>{t >= T.p5.rope - 6 ? 'канат' : ''}</Tx>
    </Sheet>
  );
};

type PullProps = { xs: number[]; s: number; t: number; ghost?: boolean; base?: number; strain?: boolean };
/** Ряд людей на канате: руки лежат на верёвке на уровне плеч. */
const Pullers: React.FC<PullProps> = ({ xs, s, t, ghost = false, base = G, strain = true }) => {
  const y = base - 140 * s;
  return (
    <g>
      {xs.map((x, i) => (
        <g key={x} opacity={ghost && i % 2 === 1 ? 0.18 : 1}>
          <Man x={x} y={base} s={s} mouth={strain ? 'open' : 'flat'} brow={strain ? 'angry' : 'none'} eyes={strain ? 'closed' : 'dots'} la={[-63, 10]} ra={[63, 10]} seed={i} />
        </g>
      ))}
      <Rope y={y} x1={0} x2={860} sag={Math.sin(t / 4) * 4} />
    </g>
  );
};

const Load: React.FC = () => (
  <g>
    <rect x={860} y={G - 300} width={190} height={300} fill={PAPER} strokeWidth={5} />
    <Tx x={955} y={G - 130} size={56}>ГРУЗ</Tx>
  </g>
);

// 6. Вдвоём каждый на 93 %.
export const S6: React.FC = () => {
  const t = useCurrentFrame();
  const pct = lerp(100, 93, easeOut(clamp((t - T.p6.pct + 4) / 12)));
  return (
    <Sheet hit={T.p6.pct}>
      <Head lines={['ВДВОЁМ: 93 %']} t={t} />
      <Tx x={540} y={560} size={58}>СИЛА КАЖДОГО</Tx>
      <rect x={130} y={600} width={820} height={96} fill={PAPER} strokeWidth={5} />
      <rect x={136} y={606} width={808 * (pct / 100)} height={84} fill={INK} stroke="none" />
      <Tx x={540} y={990} size={270} bold={3}>{Math.round(pct)} %</Tx>
      <Ground />
      <Pullers xs={[250, 600]} s={1.3} t={t} />
      <Load />
    </Sheet>
  );
};

// 7. Втроём на 85 %.
export const S7: React.FC = () => {
  const t = useCurrentFrame();
  const pct = lerp(93, 85, easeOut(clamp((t - T.p7.pct + 6) / 12)));
  return (
    <Sheet hit={T.p7.pct}>
      <Head lines={['ВТРОЁМ: 85 %']} t={t} />
      <Tx x={540} y={560} size={58}>СИЛА КАЖДОГО</Tx>
      <rect x={130} y={600} width={820} height={96} fill={PAPER} strokeWidth={5} />
      <rect x={136} y={606} width={808 * (pct / 100)} height={84} fill={INK} stroke="none" />
      <Tx x={540} y={990} size={270} bold={3}>{Math.round(pct)} %</Tx>
      <Ground />
      <Pullers xs={[160, 430, 700]} s={1.05} t={t} />
      <Load />
    </Sheet>
  );
};

// 8. Восемь тянут как четверо.
export const S8: React.FC = () => {
  const t = useCurrentFrame();
  const xs = [140, 380, 620, 860];
  const g = t >= T.p8.eq - 8;
  return (
    <Sheet hit={T.p8.eq - 8}>
      <Head lines={['8 ЧЕЛОВЕК', 'ТЯНУТ КАК 4']} t={t} />
      <Ground y={1120} hatch={false} />
      <Ground />
      <Pullers xs={xs} s={0.95} t={t} ghost={g} base={1120} />
      <Pullers xs={xs} s={0.95} t={t + 3} ghost={g} />
      <Pop x={540} y={700} t={t} at={T.p8.eq - 8}>
        <Tx x={540} y={760} size={300} bold={4}>8 = 4</Tx>
      </Pop>
    </Sheet>
  );
};

const Blind: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-54} y={-246} width={108} height={26} fill={INK} stroke={INK} strokeWidth={2} />
    <path d="M-54 -236 L-66 -226 M54 -236 L66 -226" strokeWidth={4} />
  </g>
);

/** Человек с повязкой тянет канат; «призраки» сзади нарисованы бледно. */
const BlindPuller: React.FC<{ t: number; at: number; ghosts: number; ghostAlpha?: number }> = ({ t, at, ghosts, ghostAlpha = 0.2 }) => {
  const x = 700;
  const s = 1.2;
  return (
    <g>
      <Rope y={G - 140 * s} x1={0} x2={860} sag={Math.sin(t / 4) * 4} />
      <Man x={x} y={G} s={s} mouth="open" brow="angry" eyes="closed" la={[-63, 10]} ra={[63, 10]} seed={2} />
      {t >= at && <Blind x={x} y={G} s={s} />}
      {[0, 1, 2].slice(0, ghosts).map((i) => (
        <g key={i} opacity={ghostAlpha}>
          <Man x={x - 270 * (i + 1)} y={G} s={s} mouth="open" brow="angry" eyes="closed" la={[-63, 10]} ra={[63, 10]} seed={i + 5} />
        </g>
      ))}
      <Load />
    </g>
  );
};

// 9. В 70-х завязали глаза и сказали: сзади тянут ещё.
export const S9: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['1970-Е: ЗАВЯЗАЛИ', 'ГЛАЗА']} t={t} />
      <Ground />
      <BlindPuller t={t} at={T.p9.eyes} ghosts={t >= T.p9.say ? 3 : 0} />
      <Pop x={400} y={720} t={t} at={T.p9.say}>
        <path d="M110 640 q-24 0 -24 -34 v-70 q0 -34 34 -34 h560 q34 0 34 34 v70 q0 34 -34 34 h-300 l-60 70 v-70 Z" fill={PAPER} />
        <Tx x={400} y={578} size={60} bold={1.2}>за вами тянут</Tx>
        <Tx x={400} y={632} size={60} bold={1.2}>ещё люди</Tx>
      </Pop>
    </Sheet>
  );
};

// 10. Сзади не было никого.
export const S10: React.FC = () => {
  const t = useCurrentFrame();
  const a = 1 - clamp((t - T.p10.none + 6) / 8);
  return (
    <Sheet hit={T.p10.none}>
      <Head lines={['СЗАДИ', 'НЕ БЫЛО НИКОГО']} t={t} />
      <Ground />
      <BlindPuller t={t} at={0} ghosts={a > 0 ? 3 : 0} ghostAlpha={0.2 * a} />
      <Stamp x={330} y={900} text="ПУСТО" t={t} at={T.p10.none} size={120} />
    </Sheet>
  );
};

// 11. Жал на 18 % слабее: два столбика.
export const S11: React.FC = () => {
  const t = useCurrentFrame();
  const h2 = lerp(500, 410, easeOut(clamp((t - T.p11.pct) / 10)));
  return (
    <Sheet hit={T.p11.pct + 8}>
      <Head lines={['НА 18 % СЛАБЕЕ']} t={t} />
      <path d="M130 1360 H950" strokeWidth={5} />
      <rect x={200} y={1360 - 500} width={250} height={500} fill={INK} />
      <rect x={630} y={1360 - h2} width={250} height={h2} fill={PAPER} strokeWidth={5} />
      <Tx x={325} y={1430} size={52}>ОДИН</Tx>
      <Tx x={755} y={1430} size={52}>«С ДРУГИМИ»</Tx>
      <Stamp x={755} y={760} text="−18 %" t={t} at={T.p11.pct + 6} size={110} />
    </Sheet>
  );
};

// 12. Он же был один.
export const S12: React.FC = () => {
  const t = useCurrentFrame();
  const s = 1.6;
  return (
    <Sheet hit={T.p12.one}>
      <Head lines={['А ОН ОДИН']} t={t} />
      <Ground />
      <path d={`M0 ${G - 30} q250 40 430 -4`} strokeWidth={8} />
      <Man x={640} y={G} s={s} mouth="o" brow="raised" eyes="wide" la={[-30, 60]} ra={[30, 60]} seed={4} bob />
      <Blind x={640} y={G} s={s} />
      <Pop x={420} y={760} t={t} at={T.p12.one}>
        <path d="M150 700 q-24 0 -24 -34 v-30 q0 -34 34 -34 h340 q34 0 34 34 v30 q0 34 -34 34 h-120 l-40 60 v-60 Z" fill={PAPER} />
        <Tx x={330} y={668} size={76} bold={1.2}>я один?!</Tx>
      </Pop>
    </Sheet>
  );
};

// 13. Социальная лень.
export const S13: React.FC = () => {
  const t = useCurrentFrame();
  const s = 0.82;
  const xs = [110, 280, 450, 620, 790, 960];
  return (
    <Sheet>
      <Head lines={['СОЦИАЛЬНАЯ ЛЕНЬ']} t={t} />
      <Ground />
      <Man x={xs[0]} y={G} s={s} mouth="open" brow="angry" eyes="closed" la={[-63, 10]} ra={[63, 10]} seed={0} />
      {xs.slice(1).map((x, i) => (
        <Man key={x} x={x} y={G} s={s} mouth={i % 2 ? 'o' : 'flat'} eyes={i % 2 ? 'closed' : 'up'} seed={i + 1} la={[-26, 70]} ra={[26, 70]} />
      ))}
      <Rope y={G - 140 * s} x1={0} x2={1080} sag={Math.sin(t / 4) * 4} />
      {[1, 3].map((i) => (
        <g key={i}>
          <Tx x={xs[i] + 60} y={G - 330 - Math.sin(t / 6 + i) * 8} size={54}>z</Tx>
          <Tx x={xs[i] + 96} y={G - 372 - Math.sin(t / 6 + i) * 8} size={76}>Z</Tx>
        </g>
      ))}
      <Stamp x={540} y={900} text="ЛЕНЬ" t={t} at={T.p13.stamp} size={150} />
    </Sheet>
  );
};

// 14. Мозг решает: нас много, кто-нибудь вытянет.
export const S14: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['МОЗГ РЕШАЕТ']} t={t} />
      <Ground />
      <Man x={330} y={G} s={2.2} mouth="flat" eyes="up" brow="raised" la={[-30, 60]} ra={[30, 60]} seed={6} />
      <Pop x={600} y={900} t={t} at={6}>
        <circle cx={420} cy={1010} r={14} fill={PAPER} />
        <circle cx={470} cy={960} r={22} fill={PAPER} />
        <path d="M250 800 q-34 0 -34 -40 v-100 q0 -44 44 -44 h600 q44 0 44 44 v100 q0 40 -34 40 h-380 l-80 80 v-80 Z" fill={PAPER} />
        <Tx x={560} y={690} size={74} bold={1.2}>нас много —</Tx>
        <Tx x={560} y={770} size={74} bold={1.2}>кто-нибудь вытянет</Tx>
      </Pop>
      {t >= T.p14.someone && <Draw t={t} at={T.p14.someone} n={10} strokeWidth={6} d="M300 790 q260 60 520 0" />}
    </Sheet>
  );
};

/** Ноутбук крупно: на экране плитка с камерой. */
const BigLaptop: React.FC<{ x: number; y: number; t: number; off: number }> = ({ x, y, t, off }) => (
  <g transform={`translate(${x} ${y}) scale(3.2)`} strokeWidth={3 / 3.2}>
    <rect x={-60} y={-98} width={120} height={84} fill={PAPER} />
    <rect x={-52} y={-90} width={104} height={68} />
    <circle cx={0} cy={-62} r={11} />
    <circle cx={0} cy={-62} r={4} fill={INK} />
    {t >= off && <Draw t={t} at={off} n={6} strokeWidth={3} d="M-26 -88 L26 -36" />}
    <path d="M-76 0 H76 L62 -10 H-62 Z" fill={INK} />
  </g>
);

// 15. Лёха на планёрке, камера выключена.
export const S15: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['ЛЁХА НА ПЛАНЁРКЕ']} t={t} />
      <Ground />
      <Man x={290} y={G} s={1.65} mouth="flat" eyes="dots" hair="tuft" la={[-20, 70]} ra={[60, 60]} seed={1} bob />
      <BigLaptop x={760} y={G - 30} t={t} off={T.p15.cam} />
      <Pop x={290} y={1000} t={t} at={8}>
        <rect x={150} y={1010} width={280} height={80} fill={INK} />
        <Tx x={290} y={1070} size={58} fill={PAPER} bold={1.2}>ЛЁХА</Tx>
      </Pop>
      <Stamp x={760} y={780} text="КАМЕРА ВЫКЛ" t={t} at={T.p15.cam} size={64} rot={5} />
    </Sheet>
  );
};

// 16. Спрашивают: кто возьмёт задачу?
export const S16: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['КТО ВОЗЬМЁТ', 'ЗАДАЧУ?']} t={t} />
      <Meeting t={t + 99} moods={Array(8).fill('idle') as Mood[]} y1={1140} y2={1480} s={0.75} lyokha={1} />
      <Pop x={540} y={720} t={t} at={4}>
        <path d="M130 780 q-34 0 -34 -40 v-120 q0 -44 44 -44 h800 q44 0 44 44 v120 q0 40 -34 40 h-300 l-60 80 v-80 Z" fill={PAPER} />
        <Tx x={540} y={700} size={92} bold={1.4}>{t >= T.p16.q ? 'КТО ВОЗЬМЁТ ЗАДАЧУ?' : 'КТО ВОЗЬМЁТ…'}</Tx>
      </Pop>
    </Sheet>
  );
};

// 17. Лёха думает: нас же восемь.
export const S17: React.FC = () => {
  const t = useCurrentFrame();
  const n = Math.min(8, Math.max(0, Math.floor((t - (T.p17.eight - 6)) / 3) + 1));
  return (
    <Sheet>
      <Head lines={['«НАС ЖЕ ВОСЕМЬ»']} t={t} />
      <Ground />
      <Man x={360} y={G} s={2} mouth="flat" eyes="up" brow="sad" hair="tuft" la={[-26, 70]} ra={[26, 70]} seed={1} />
      <circle cx={560} cy={1130} r={14} fill={PAPER} />
      <circle cx={610} cy={1080} r={22} fill={PAPER} />
      <Pop x={700} y={800} t={t} at={4}>
        <ellipse cx={690} cy={800} rx={340} ry={230} fill={PAPER} />
      </Pop>
      {Array.from({ length: n }, (_, i) => {
        const cx = 530 + (i % 4) * 110;
        const cy = 750 + Math.floor(i / 4) * 130;
        return (
          <Pop key={i} x={cx} y={cy} t={t} at={T.p17.eight - 6 + i * 3} n={5}>
            <circle cx={cx} cy={cy} r={38} fill={PAPER} />
            <path d={`M${cx - 14} ${cy + 8} q14 14 28 0`} strokeWidth={3} />
            <path d={`M${cx - 14} ${cy - 8} v2 M${cx + 14} ${cy - 8} v2`} strokeWidth={6} />
          </Pop>
        );
      })}
    </Sheet>
  );
};

// 18. Остальные семь думают так же. Тишина.
export const S18: React.FC = () => {
  const t = useCurrentFrame();
  const pos = [...COLS.map((x) => ({ x, y: 960 })), ...COLS.slice(0, 3).map((x) => ({ x: x + 125, y: 1330 }))];
  return (
    <Sheet hit={T.p18.pizd}>
      <Head lines={['ВСЕ ДУМАЮТ', 'ТАК ЖЕ']} t={t} />
      {pos.map((p, i) => (
        <Pop key={i} x={p.x} y={p.y} t={t} at={i * 4} n={6}>
          <Man x={p.x} y={p.y} s={0.8} mouth="flat" eyes="up" seed={i + 2} la={[-24, 64]} ra={[24, 64]} />
          <ellipse cx={p.x} cy={p.y - 262} rx={84} ry={36} fill={PAPER} strokeWidth={3} />
          <Tx x={p.x} y={p.y - 250} size={32}>кто-нибудь</Tx>
        </Pop>
      ))}
      <Stamp x={540} y={1530} text="ТИШИНА" t={t} at={T.p18.quiet} size={110} />
    </Sheet>
  );
};

const Tick: React.FC<{ x: number; y: number }> = ({ x, y }) => <path d={`M${x} ${y} l10 12 l24 -30`} strokeWidth={5} />;

// 19. Чат на 40 человек: прочитали сорок, ответил ноль.
export const S19: React.FC = () => {
  const t = useCurrentFrame();
  const n = Math.min(40, Math.floor(clamp((t - T.p19.read) / 30) * 40));
  return (
    <Sheet hit={T.p19.zero}>
      <Head lines={['ЧАТ НА 40 ЧЕЛОВЕК']} t={t} />
      <Clock x={125} y={1000} r={80} hour={t * 1.6} min={t * 19} />
      <rect x={250} y={420} width={730} height={1140} rx={70} fill={PAPER} strokeWidth={6} />
      <path d="M250 540 H980" strokeWidth={4} />
      <Tx x={615} y={500} size={50} bold={1}>РАБОЧИЙ ЧАТ · 40</Tx>
      <Pop x={500} y={700} t={t} at={8}>
        <rect x={290} y={590} width={560} height={150} rx={30} fill={PAPER} strokeWidth={4} />
        <Tx x={570} y={655} size={44}>Кто съездит</Tx>
        <Tx x={570} y={708} size={44}>на склад?</Tx>
      </Pop>
      {t >= T.p19.read - 6 && (
        <g>
          <Tick x={310} y={850} />
          <Tick x={338} y={850} />
          <Tx x={400} y={866} size={62} anchor="start">прочитали: {n}</Tx>
        </g>
      )}
      <rect x={290} y={1440} width={650} height={80} rx={40} fill={PAPER} strokeWidth={4} />
      {Math.floor(t / 12) % 2 === 0 && <path d="M330 1462 v36" strokeWidth={4} />}
      <Stamp x={615} y={1130} text="ОТВЕТОВ: 0" t={t} at={T.p19.zero} size={84} />
    </Sheet>
  );
};

const Cup: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r})`} strokeWidth={4}>
    <path d="M-34 -64 H34 L28 0 H-28 Z" fill={PAPER} />
    <path d="M34 -50 q30 4 24 28 q-6 16 -30 14" />
    <path d="M-30 -48 H30" strokeWidth={2.4} />
  </g>
);

// 20. Чашки на общей кухне копятся сами.
export const S20: React.FC = () => {
  const t = useCurrentFrame();
  const at = T.p20.cups - 4;
  const spots = [
    [450, 1380], [540, 1380], [630, 1380], [405, 1318], [495, 1318], [585, 1318], [675, 1318],
    [450, 1256], [540, 1256], [630, 1256], [495, 1194], [585, 1194],
  ];
  const n = Math.min(spots.length, Math.max(0, Math.floor((t - at) / 5) + 1));
  return (
    <Sheet hit={T.p20.suka}>
      <Head lines={['ОБЩАЯ КУХНЯ']} t={t} />
      <rect x={300} y={1180} width={480} height={290} fill={PAPER} strokeWidth={6} />
      <path d="M280 1180 H800 M300 1470 H780" strokeWidth={8} />
      <path d="M850 1180 v-160 q0 -50 -60 -50 h-40 v26" strokeWidth={9} />
      <path d="M740 970 v-0" strokeWidth={9} />
      {spots.slice(0, n).map(([x, y], i) => (
        <Pop key={i} x={x} y={y} t={t} at={at + i * 5} n={5}>
          <Cup x={x} y={y} r={(i % 3) * 6 - 6} />
        </Pop>
      ))}
      <Tx x={540} y={800} size={150} bold={2.6}>{`ЧАШЕК: ${n + 8}`}</Tx>
      <Stamp x={540} y={1600} text="ВИНОВАТЫХ: 0" t={t} at={T.p20.suka + 10} size={64} />
    </Sheet>
  );
};

// 21. Что делать? Дай задачу одному, по имени.
export const S21: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['ЧТО ДЕЛАТЬ?']} t={t} />
      <Ground />
      <Man x={260} y={G} s={1.5} mouth="smile" brow="raised" la={[-20, 70]} ra={[110, -10]} seed={8} />
      <Man x={800} y={G} s={1.5} mouth="open" eyes="wide" hair="tuft" la={[-70, 20]} ra={[26, 70]} seed={1} bob />
      <Pop x={530} y={1000} t={t} at={T.p21.one - 6}>
        <g transform="rotate(-6 530 1000)">
          <rect x={400} y={900} width={260} height={200} fill={PAPER} strokeWidth={5} />
          <Tx x={530} y={980} size={50}>ЗАДАЧА</Tx>
          <Tx x={530} y={1056} size={74} bold={1.6}>ЛЁХА</Tx>
        </g>
      </Pop>
      <Stamp x={540} y={640} text="ОДНОМУ" t={t} at={T.p21.one} size={104} />
    </Sheet>
  );
};

// 22. Не отделу, а Лёхе до пятницы.
export const S22: React.FC = () => {
  const t = useCurrentFrame();
  const days = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ'];
  return (
    <Sheet>
      <Head lines={['НЕ ОТДЕЛУ,', 'А ЛЁХЕ']} t={t} />
      <rect x={110} y={560} width={860} height={560} fill={PAPER} strokeWidth={6} />
      <path d="M110 680 H970" strokeWidth={5} />
      {days.map((d, i) => (
        <g key={d}>
          <Tx x={196 + i * 172} y={650} size={58} bold={1}>{d}</Tx>
          {i > 0 && <path d={`M${110 + i * 172} 560 V1120`} strokeWidth={2.4} />}
        </g>
      ))}
      <Draw t={t} at={T.p22.fri - 4} n={12} strokeWidth={8} d="M880 628 a76 52 0 1 1 -0.1 0" />
      <Pop x={880} y={900} t={t} at={T.p22.fri}>
        <Tx x={796} y={940} size={92} bold={1.4}>ЛЁХА</Tx>
      </Pop>
      <Ground />
      <Man x={300} y={G} s={1.7} mouth="grin" hair="tuft" brow="raised" la={[-20, 70]} ra={[70, -50]} seed={1} bob />
      <Tx x={720} y={1350} size={62} rot={-3}>{t >= T.p22.lyokha ? 'я до пятницы' : ''}</Tx>
    </Sheet>
  );
};

// 23. Когда вклад виден, прятаться негде.
export const S23: React.FC = () => {
  const t = useCurrentFrame();
  const bars = [0.9, 0.7, 1, 0.8];
  const p = clamp((t - T.p23.vis) / 18);
  return (
    <Sheet>
      <Head lines={['ВКЛАД ВИДЕН']} t={t} />
      <Pop x={540} y={620} t={t} at={T.p23.vis - 4}>
        <ellipse cx={540} cy={620} rx={190} ry={110} fill={PAPER} strokeWidth={6} />
        <circle cx={540 + Math.sin(t / 14) * 30} cy={620} r={58} fill={INK} />
        <circle cx={528 + Math.sin(t / 14) * 30} cy={604} r={14} fill={PAPER} stroke="none" />
      </Pop>
      <Ground />
      {COLS.map((x, i) => (
        <g key={x}>
          <Man x={x} y={G} s={0.95} mouth="grin" eyes="dots" seed={i + 3} la={[-24, 70]} ra={[24, 70]} bob />
          <rect x={x - 90} y={G - 340} width={180} height={34} fill={PAPER} strokeWidth={4} />
          <rect x={x - 86} y={G - 336} width={172 * bars[i] * p} height={26} fill={INK} stroke="none" />
        </g>
      ))}
      <Stamp x={540} y={950} text="ПРЯТАТЬСЯ НЕГДЕ" t={t} at={T.p23.none} size={76} />
    </Sheet>
  );
};

// 24. Зови только тех, без кого нельзя.
export const S24: React.FC = () => {
  const t = useCurrentFrame();
  const cut = t >= T.p24.only;
  return (
    <Sheet>
      <Head lines={['ЗОВИ ТОЛЬКО', 'НУЖНЫХ']} t={t} />
      <Meeting t={t + 99} moods={cut ? ['work', 'work', 'work', 'work', 'ghost', 'ghost', 'ghost', 'ghost'] : Array(8).fill('idle') as Mood[]} />
      {cut && COLS.map((x, i) => <Check key={x} x={x - 26} y={880} t={t} at={T.p24.only + 4 + i * 4} s={1.3} />)}
      {cut && COLS.map((x, i) => (
        <Draw key={i} t={t} at={T.p24.only + 2 + i * 3} n={6} strokeWidth={8} d={`M${x - 70} ${1350} l140 140 M${x + 70} ${1350} l-140 140`} />
      ))}
    </Sheet>
  );
};

// 25. Хочешь, чтобы работали восемь?
export const S25: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['ХОЧЕШЬ, ЧТОБЫ', 'РАБОТАЛИ ВОСЕМЬ?']} t={t} />
      <Meeting t={t + 99} moods={Array(8).fill('work') as Mood[]} />
      <Stamp x={540} y={720} text="8?" t={t} at={T.p25.eight} size={150} />
    </Sheet>
  );
};

// 26. Зови четверых.
export const S26: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['ЗОВИ ЧЕТВЕРЫХ']} t={t} />
      <Meeting t={t + 99} moods={['work', 'work', 'work', 'work', 'ghost', 'ghost', 'ghost', 'ghost']} />
      <Pop x={540} y={760} t={t} at={T.p26.stamp - 6}>
        <Tx x={540} y={820} size={260} bold={4}>4 = 8</Tx>
      </Pop>
    </Sheet>
  );
};
