import React from 'react';
import { useCurrentFrame } from 'remotion';
import { clamp, easeOut, lerp } from '../../engine/anim';
import { INK, PAPER } from '../../lines/kit';
import { Draw, G, Ground, Head, Man, Pop, Sheet, Stamp, Tx } from '../piter-bw/shots';
import { Phone } from '../pribavka-bw/shots';
import { T } from './timing';

// «Ссора: требование — уход»: вертикальный ЧБ 1080×1920. Моменты внутри плана (кадры от начала плана) лежат в timing.ts
// и собираются gen_timing.py из best_words.json.

/** Стопка тарелок: n эллипсов с ободком. */
export const Plates: React.FC<{ x: number; y: number; n: number; s?: number; shake?: number }> = ({ x, y, n, s = 1, shake = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} strokeWidth={4 / s}>
    {Array.from({ length: n }, (_, i) => {
      const dx = Math.sin(i * 2.3) * (6 + shake * 10);
      return (
        <g key={i} transform={`translate(${dx} ${-i * 26})`}>
          <ellipse cx={0} cy={-14} rx={112} ry={24} fill={PAPER} />
          <ellipse cx={0} cy={-14} rx={72} ry={12} />
        </g>
      );
    })}
  </g>
);

/** Носок: сапожок с резинкой. */
const Sock: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} strokeWidth={4 / s}>
    <path d="M-40 -150 H40 V-40 Q40 -4 100 12 Q124 20 108 48 H-52 Q-40 40 -40 20 Z" fill={PAPER} />
    <path d="M-40 -118 H40 M-40 -84 H40" strokeWidth={3 / s} />
  </g>
);

/** Будильник с двумя звонками. */
const Alarm: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} strokeWidth={5 / s}>
    <circle cx={0} cy={0} r={74} fill={PAPER} />
    <circle cx={-58} cy={-70} r={24} fill={INK} /><circle cx={58} cy={-70} r={24} fill={INK} />
    <path d="M0 0 V-46 M0 0 L32 14" strokeWidth={7 / s} />
    <circle cx={0} cy={0} r={6} fill={INK} />
  </g>
);

/** Облачко реплики с хвостиком. tail: куда смотрит хвост (-1 влево, 1 вправо). */
export const Bubble: React.FC<{ x: number; y: number; w: number; h: number; tail?: number; children?: React.ReactNode }> = ({ x, y, w, h, tail = 1, children }) => (
  <g strokeWidth={5}>
    <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={44} fill={PAPER} />
    <path d={`M${x + tail * (w / 2 - 80)} ${y + h / 2 - 2} l${tail * 22} 56 l${-tail * 52} -54`} fill={PAPER} />
    {children}
  </g>
);

// 1. «Вы ссоритесь, блядь, вообще не из-за посуды.»
export const S1: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.p1.x}>
      <Head lines={['НЕ ИЗ-ЗА ПОСУДЫ']} t={t} />
      <Ground />
      <Plates x={540} y={G - 6} n={9} s={1.45} shake={clamp(t / 60)} />
      <Man x={170} y={G} s={1.25} mouth="open" eyes="wide" brow="angry" la={[-50, -60]} ra={[30, 40]} seed={1} bob />
      <Man x={910} y={G} s={1.25} flip mouth="flat" eyes="up" brow="angry" la={[-30, 40]} ra={[-30, 60]} seed={2} bob />
      <Draw t={t} at={T.p1.x} n={9} strokeWidth={18} d="M330 720 L750 1440" />
      <Draw t={t} at={T.p1.x + 5} n={9} strokeWidth={18} d="M750 720 L330 1440" />
    </Sheet>
  );
};

// 2. «Посуда, носки, "опять опоздал" — это просто повод. Настоящая ссора про другое.»
export const S2: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.p2.d}>
      <Head lines={['ЭТО ПРОСТО ПОВОД']} t={t} />
      <Pop x={200} y={640} t={t} at={T.p2.a}>
        <Plates x={200} y={700} n={3} s={0.85} />
        <Tx x={380} y={668} size={78} bold={1.4} anchor="start">посуда</Tx>
      </Pop>
      <Pop x={200} y={880} t={t} at={T.p2.b}>
        <Sock x={200} y={1000} s={0.95} />
        <Tx x={380} y={952} size={78} bold={1.4} anchor="start">носки</Tx>
      </Pop>
      <Pop x={200} y={1100} t={t} at={T.p2.c}>
        <Alarm x={200} y={1220} s={1} />
        <Tx x={380} y={1200} size={64} bold={1.2} anchor="start">«опять опоздал»</Tx>
      </Pop>
      <Stamp x={540} y={1500} text="ПРО ДРУГОЕ" t={t} at={T.p2.d} size={96} />
    </Sheet>
  );
};

// 3. «В 1990 году психологи Кристенсен и Хейви описали её на семейных парах.»
export const S3: React.FC = () => {
  const t = useCurrentFrame();
  const year = Math.round(lerp(1980, 1990, easeOut(clamp((t - T.p3.yr) / 22))));
  return (
    <Sheet>
      <Head lines={['1990 ГОД']} t={t} />
      <g transform="translate(540 700)">
        <rect x={-270} y={-190} width={540} height={400} fill={PAPER} strokeWidth={5} />
        <rect x={-270} y={-190} width={540} height={96} fill={INK} />
        <Tx x={0} y={-120} size={62} fill={PAPER} bold={1}>ГОД</Tx>
        {[-170, 170].map((rx) => <path key={rx} d={`M${rx} -214 v52`} strokeWidth={10} />)}
        <Tx x={0} y={110} size={210} bold={2}>{year}</Tx>
      </g>
      <Ground />
      <Man x={270} y={G} s={1.45} mouth="smile" eyes="dots" brow="raised" la={[-26, 70]} ra={[60, -10]} seed={4} bob />
      <Man x={810} y={G} s={1.45} flip mouth="flat" eyes="dots" la={[-26, 70]} ra={[60, -10]} seed={5} bob />
      <Pop x={270} y={1100} t={t} at={T.p3.k}>
        <Tx x={270} y={1120} size={56} bold={1.4}>КРИСТЕНСЕН</Tx>
      </Pop>
      <Pop x={810} y={1100} t={t} at={T.p3.h}>
        <Tx x={810} y={1120} size={56} bold={1.4}>ХЕЙВИ</Tx>
      </Pop>
    </Sheet>
  );
};

// 4. «Назвали "требование — уход".»
export const S4: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.p4.out}>
      <Head lines={['ТРЕБОВАНИЕ', 'УХОД']} t={t} />
      <Ground />
      <Man x={220} y={G} s={1.7} mouth="open" eyes="wide" brow="angry" la={[-26, 70]} ra={[90, -10]} seed={6} bob />
      <Man x={700} y={G} s={1.7} flip mouth="flat" eyes="up" la={[-26, 70]} ra={[-26, 70]} seed={7} bob />
      <Draw t={t} at={T.p4.req} n={14} strokeWidth={10} d="M360 900 H600 M540 850 L600 900 L540 950" />
      <Pop x={480} y={810} t={t} at={T.p4.req + 4}>
        <Tx x={480} y={812} size={64} bold={1.4}>ТРЕБОВАНИЕ</Tx>
      </Pop>
      <Draw t={t} at={T.p4.out} n={12} strokeWidth={10} d="M860 1160 H1030 M980 1110 L1030 1160 L980 1210" />
      <Pop x={900} y={1080} t={t} at={T.p4.out + 4}>
        <Tx x={900} y={1090} size={64} bold={1.4}>УХОД</Tx>
      </Pop>
    </Sheet>
  );
};

// 5. «Вот Артём и Лена. Лена находит в раковине гору тарелок.»
export const S5: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.p5.pl}>
      <Head lines={['ВОТ АРТЁМ И ЛЕНА']} t={t} />
      <Ground />
      <Man x={250} y={G} s={1.6} mouth="flat" eyes="dots" hair="tuft" la={[-26, 70]} ra={[26, 70]} seed={8} bob />
      <Man x={830} y={G} s={1.6} flip mouth="smile" eyes="wide" la={[-26, 70]} ra={[40, 30]} seed={9} bob />
      <Pop x={250} y={1040} t={t} at={T.p5.a}>
        <Tx x={250} y={1050} size={72} bold={1.6}>АРТЁМ</Tx>
      </Pop>
      <Pop x={830} y={1040} t={t} at={T.p5.l}>
        <Tx x={830} y={1050} size={72} bold={1.6}>ЛЕНА</Tx>
      </Pop>
      <Pop x={540} y={1500} t={t} at={T.p5.pl} n={10}>
        <Plates x={540} y={G - 6} n={7} s={1.0} />
      </Pop>
    </Sheet>
  );
};

// 6. «Она начинает говорить. Сначала спокойно.»
export const S6: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['ЛЕНА ГОВОРИТ', 'СПОКОЙНО']} t={t} />
      <Ground />
      <Man x={790} y={G} s={1.9} flip mouth="open" eyes="dots" la={[-26, 70]} ra={[40, 40]} seed={9} bob />
      <Man x={240} y={G} s={1.4} mouth="flat" eyes="dots" hair="tuft" la={[-26, 70]} ra={[26, 70]} seed={8} bob />
      <Pop x={560} y={700} t={t} at={T.p6.say}>
        <Bubble x={560} y={760} w={600} h={190} tail={1}>
          <path d="M300 740 q25 -22 50 0 t50 0 t50 0 t50 0 M300 790 q25 -22 50 0 t50 0 t50 0" strokeWidth={5} />
        </Bubble>
      </Pop>
    </Sheet>
  );
};

// 7. «Артём молчит и смотрит в телефон.»
export const S7: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['АРТЁМ МОЛЧИТ']} t={t} />
      <Ground />
      <Man x={470} y={G} s={1.9} mouth="flat" eyes="up" hair="tuft" la={[-26, 70]} ra={[60, 70]} seed={8} bob />
      <Pop x={690} y={1400} t={t} at={T.p7.ph}>
        <Phone x={690} y={1480} />
      </Pop>
      <Pop x={470} y={620} t={t} at={T.p7.ph + 8}>
        <Bubble x={470} y={680} w={300} h={130} tail={1}>
          <Tx x={470} y={716} size={96} bold={2}>...</Tx>
        </Bubble>
      </Pop>
    </Sheet>
  );
};
