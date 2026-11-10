import React from 'react';
import { useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut, lerp } from '../../engine/anim';
import { Clock, INK, PAPER } from '../../lines/kit';
import { Place } from '../../lines/places';
import { Draw, G, Ground, Head, Man, Pop, Sheet, Specs, Stamp, Tx } from '../piter-bw/shots';
import { T } from './timing';

// «Социальный джетлаг» на 30 с: вертикальный ЧБ, 13 планов. Моменты внутри планов лежат в timing.ts (T).

/** Самолёт боком, нос вправо. */
const Plane: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} strokeWidth={5 / s}>
    <path d="M-100 0 Q-112 -16 -60 -18 H70 Q130 -16 142 0 Q130 16 70 18 H-60 Q-112 16 -100 0 Z" fill={PAPER} />
    <path d="M-10 -18 L-62 -100 H-30 L56 -18 Z M-10 18 L-62 100 H-30 L56 18 Z" fill={PAPER} />
    <path d="M-96 -6 L-118 -52 H-90 L-56 -18 Z" fill={INK} />
    {[-30, 10, 50].map((cx) => <circle key={cx} cx={cx} cy={-2} r={6} />)}
  </g>
);

/** Будильник с колокольчиками; shake дрожит. */
const Alarm: React.FC<{ x: number; y: number; r?: number; hour: number; min: number; shake?: number }> = ({ x, y, r = 120, hour, min, shake = 0 }) => (
  <g transform={`translate(${x + shake} ${y})`}>
    <circle cx={-r * 0.72} cy={-r * 0.9} r={r * 0.3} fill={INK} />
    <circle cx={r * 0.72} cy={-r * 0.9} r={r * 0.3} fill={INK} />
    <path d={`M${-r * 0.5} ${r * 0.9} l${-r * 0.3} ${r * 0.3} M${r * 0.5} ${r * 0.9} l${r * 0.3} ${r * 0.3}`} strokeWidth={7} />
    <Clock x={0} y={0} r={r} hour={hour} min={min} />
  </g>
);

// 1. Суббота, три часа ночи.
export const S1: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['СУББОТА,', '3:00 НОЧИ']} t={t} />
      <Place kind="bedroom" v={0} t={t} />
      <Pop x={850} y={640} t={t} at={6}>
        <Clock x={850} y={640} r={110} hour={90} min={0} />
      </Pop>
      <Ground />
      <Man x={430} y={G} s={1.55} mouth="o" eyes="wide" la={[-30, 78]} ra={[44, 30]} bob />
      <rect x={512} y={G - 258} width={64} height={104} rx={8} fill={INK} transform={`rotate(10 544 ${G - 206})`} />
      <Stamp x={300} y={1000} text="СБ" t={t} at={T.j1.three} size={96} />
    </Sheet>
  );
};

// 2. Понедельник, семь утра: будильник орёт.
export const S2: React.FC = () => {
  const t = useCurrentFrame();
  const a = T.j2.seven;
  const sh = t >= a - 6 ? Math.sin(t * 2.2) * 9 : 0;
  return (
    <Sheet hit={a}>
      <Head lines={['ПОНЕДЕЛЬНИК,', '7:00']} t={t} />
      <Place kind="bedroom" v={1} t={t} />
      <Alarm x={800} y={700} r={125} hour={210} min={0} shake={sh} />
      {t >= a - 6 && [0, 1, 2].map((i) => <path key={i} d={`M${640 - i * 30} ${620 - i * 40} q-30 10 -40 40`} strokeWidth={6} />)}
      <Ground />
      <Man x={330} y={G} s={1.55} mouth="o" eyes="closed" brow="sad" la={[-50, -10]} ra={[50, 20]} bob />
    </Sheet>
  );
};

// 3. Перелёт, которого не было.
export const S3: React.FC = () => {
  const t = useCurrentFrame();
  const p = easeInOut(clamp(t / 60));
  return (
    <Sheet hit={T.j3.bl}>
      <Head lines={['ПЕРЕЛЁТ,', 'КОТОРОГО НЕ БЫЛО']} t={t} />
      <Draw t={t} at={0} n={40} strokeWidth={5} d="M80 900 Q480 700 960 760" />
      <Plane x={lerp(120, 900, p)} y={lerp(890, 760, p)} s={0.9} rot={-8} />
      <Ground />
      <Man x={330} y={G} s={1.5} mouth="open" eyes="closed" brow="sad" la={[-30, 78]} ra={[30, 78]} bob />
      <Stamp x={700} y={1100} text="НЕ БЫЛО" t={t} at={T.j3.bl} size={104} />
    </Sheet>
  );
};

// 4. Тилль Роннеберг: хронобиолог с графиком суточных часов.
export const S4: React.FC = () => {
  const t = useCurrentFrame();
  const x = 400;
  const s = 1.7;
  return (
    <Sheet>
      <Head lines={['ТИЛЛЬ', 'РОННЕБЕРГ']} t={t} />
      <Ground />
      <Man x={x} y={G} s={s} mouth="smile" eyes="dots" brow="raised" hair="tuft" la={[-70, 10]} ra={[-30, 60]} />
      <Specs x={x} y={G} s={s} />
      <Pop x={820} y={880} t={t} at={8}>
        <rect x={620} y={640} width={360} height={480} fill={PAPER} strokeWidth={6} transform="rotate(5 800 880)" />
        <Draw t={t} at={14} n={20} strokeWidth={6} d="M650 880 q40 -130 80 0 t80 0 t80 0 t80 0" />
        <path d="M650 1010 h300" strokeWidth={3} />
        <Tx x={800} y={730} size={44}>сон</Tx>
      </Pop>
      <Pop x={380} y={1040} t={t} at={22}><Tx x={380} y={1040} size={70} bold={1.2}>хронобиолог</Tx></Pop>
    </Sheet>
  );
};

// 5. Социальный джетлаг: штамп.
export const S5: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.j5.dj}>
      <Head lines={['СОЦИАЛЬНЫЙ', 'ДЖЕТЛАГ']} t={t} />
      <Plane x={380} y={820} s={1.4} rot={-6} />
      <Pop x={820} y={760} t={t} at={6}>
        <Clock x={820} y={760} r={90} hour={t * 3} min={t * 36} />
      </Pop>
      <Ground />
      <Man x={540} y={G} s={1.4} mouth="o" eyes="closed" la={[-30, 78]} ra={[30, 78]} bob />
      <Stamp x={540} y={1050} text="ДЖЕТЛАГ" t={t} at={T.j5.dj} size={118} />
    </Sheet>
  );
};

// 6. Выходные: ложишься позже, две стрелки на часах.
export const S6: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.j6.later}>
      <Head lines={['В ВЫХОДНЫЕ', 'ПОЗЖЕ']} t={t} />
      <Pop x={290} y={800} t={t} at={4}>
        <Clock x={290} y={800} r={140} hour={330} min={0} />
        <Tx x={290} y={1010} size={52} bold={1}>БУДНИ 23:00</Tx>
      </Pop>
      <Pop x={790} y={800} t={t} at={T.j6.later - 8}>
        <Clock x={790} y={800} r={140} hour={90} min={0} />
        <Tx x={790} y={1010} size={52} bold={1}>ВЫХОДНЫЕ 3:00</Tx>
      </Pop>
      <Draw t={t} at={T.j6.later - 6} n={10} strokeWidth={8} d="M470 800 h140 m-34 -30 l34 30 l-34 30" />
      <Ground />
      <Man x={540} y={G} s={1.3} mouth="o" eyes="wide" bob />
    </Sheet>
  );
};

/** Глобус с меридианами. */
const Globe: React.FC<{ x: number; y: number; r: number; spin?: number }> = ({ x, y, r, spin = 0 }) => (
  <g transform={`translate(${x} ${y})`} strokeWidth={5}>
    <circle r={r} fill={PAPER} />
    <ellipse rx={r} ry={r * 0.28} />
    {[0, 1, 2].map((i) => {
      const k = Math.cos(((i * 60 + spin) * Math.PI) / 180);
      return <ellipse key={i} rx={Math.abs(k) * r} ry={r} strokeWidth={3} />;
    })}
  </g>
);

// 7. Сдвиг на два часовых пояса.
export const S7: React.FC = () => {
  const t = useCurrentFrame();
  const a = T.j7.tz;
  return (
    <Sheet hit={a}>
      <Head lines={['СДВИГ НА', 'ДВА ПОЯСА']} t={t} />
      <Globe x={540} y={920} r={300} spin={t * 3} />
      <Draw t={t} at={4} n={20} strokeWidth={7} d="M180 560 Q540 380 900 560" />
      <Plane x={lerp(200, 880, easeOut(clamp(t / 40)))} y={lerp(580, 560, easeOut(clamp(t / 40)))} s={0.6} rot={10} />
      <Stamp x={540} y={1450} text="+2 ЧАСА" t={t} at={a} size={110} />
    </Sheet>
  );
};

// 8. Понедельник: будильник тащит обратно.
export const S8: React.FC = () => {
  const t = useCurrentFrame();
  const pull = Math.sin(t / 3) * 6;
  return (
    <Sheet hit={T.j8.suka}>
      <Head lines={['И ОБРАТНО!']} t={t} />
      <Ground />
      <Alarm x={190} y={G - 190} r={110} hour={210} min={0} shake={Math.sin(t * 2.4) * 5} />
      <path d={`M300 ${G - 170} Q480 ${G - 150 + pull} 620 ${G - 190}`} strokeWidth={7} />
      <Man x={790} y={G} s={1.55} flip mouth="open" eyes="closed" brow="sad" la={[-50, 0]} ra={[50, 0]} bob />
      <path d="M470 1200 h-210 m44 -30 l-44 30 l44 30" strokeWidth={8} />
      <Pop x={540} y={760} t={t} at={T.j8.suka - 4}><Tx x={540} y={780} size={190} bold={3}>ПН!</Tx></Pop>
    </Sheet>
  );
};

// 9. Две трети людей: шестеро из девяти.
export const S9: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['2 ИЗ 3', 'ЛЮДЕЙ']} t={t} />
      {Array.from({ length: 9 }, (_, i) => {
        const x = 220 + (i % 3) * 320;
        const y = 800 + Math.floor(i / 3) * 280;
        const tired = i < 6;
        return (
          <Pop key={i} x={x} y={y} t={t} at={4 + i * 3} n={7}>
            <Man x={x} y={y} s={0.62} mouth={tired ? 'o' : 'smile'} eyes={tired ? 'closed' : 'dots'} brow={tired ? 'sad' : 'none'} seed={i} bob />
            {tired && <Tx x={x + 56} y={y - 170 - Math.sin(t / 6 + i) * 6} size={52}>z</Tx>}
          </Pop>
        );
      })}
      <Tx x={540} y={1530} size={56}>сдвиг от часа и больше</Tx>
    </Sheet>
  );
};

// 10. Понедельник бесит не из-за работы: слово «РАБОТА» перечёркивается.
export const S10: React.FC = () => {
  const t = useCurrentFrame();
  const a = T.j10.nah;
  return (
    <Sheet hit={a}>
      <Head lines={['ПОНЕДЕЛЬНИК', 'БЕСИТ']} t={t} />
      <Place kind="openspace" v={2} t={t} />
      <Pop x={540} y={760} t={t} at={6}>
        <rect x={250} y={600} width={580} height={190} rx={18} fill={PAPER} strokeWidth={6} />
        <Tx x={540} y={725} size={120} bold={1.6}>РАБОТА</Tx>
      </Pop>
      <Draw t={t} at={a} n={7} strokeWidth={11} d="M220 580 L860 810" />
      <Draw t={t} at={a + 5} n={7} strokeWidth={11} d="M860 580 L220 810" />
      <Ground />
      <Man x={540} y={G} s={1.6} mouth="open" eyes="wide" brow="angry" la={[-50, 0]} ra={[50, 0]} bob />
    </Sheet>
  );
};

// 11. Дело в часовых поясах.
export const S11: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['ЧАСОВЫЕ', 'ПОЯСА']} t={t} />
      <Globe x={540} y={860} r={260} spin={t * 2} />
      <Ground />
      <Man x={300} y={G} s={1.5} mouth="grin" eyes="dots" brow="raised" la={[-30, 78]} ra={[60, -10]} bob />
      <Pop x={760} y={1290} t={t} at={22}><Tx x={760} y={1300} size={80} bold={1.4}>вот причина</Tx></Pop>
    </Sheet>
  );
};

// 12. Совет: не больше часа разницы.
export const S12: React.FC = () => {
  const t = useCurrentFrame();
  const g = easeOut(clamp((t - 10) / 24));
  return (
    <Sheet>
      <Head lines={['СОВЕТ']} t={t} />
      <Tx x={110} y={620} size={52} anchor="start">будни</Tx>
      <rect x={110} y={650} width={420} height={96} fill={PAPER} strokeWidth={6} />
      <Tx x={320} y={718} size={54}>8:00</Tx>
      <Tx x={110} y={880} size={52} anchor="start">выходные</Tx>
      <rect x={110} y={910} width={420 + 160 * g} height={96} fill={INK} strokeWidth={6} />
      <Tx x={320} y={978} size={54} fill={PAPER}>8:00</Tx>
      {g > 0.9 && <Tx x={610} y={978} size={54} fill={PAPER}>+1 ч</Tx>}
      <Draw t={t} at={30} n={7} strokeWidth={8} d="M800 900 l22 26 l54 -70" />
      <Stamp x={540} y={1085} text="МАКСИМУМ +1 ЧАС" t={t} at={34} size={64} />
      <Ground />
      <Man x={300} y={G} s={1.4} mouth="smile" eyes="dots" la={[-30, 78]} ra={[50, 0]} bob />
      <Alarm x={760} y={G - 130} r={90} hour={240} min={0} />
    </Sheet>
  );
};

// 13. Финал: каждую неделю летаешь без билета.
export const S13: React.FC = () => {
  const t = useCurrentFrame();
  const a = T.j13.bilet;
  const days = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
  const p = (t / 48) % 1;
  return (
    <Sheet hit={a}>
      <Head lines={['КАЖДУЮ НЕДЕЛЮ']} t={t} />
      {days.map((d, i) => (
        <g key={d}>
          <rect x={90 + i * 130} y={720} width={110} height={130} fill={i >= 5 ? INK : PAPER} strokeWidth={5} />
          <Tx x={145 + i * 130} y={800} size={44} fill={i >= 5 ? PAPER : INK}>{d}</Tx>
        </g>
      ))}
      <Plane x={lerp(120, 960, p)} y={610 - Math.sin(p * Math.PI) * 100} s={0.6} rot={-6} />
      <Ground />
      <Man x={250} y={G} s={1.3} mouth="o" eyes="closed" brow="sad" la={[-30, 78]} ra={[30, 78]} bob />
      <Pop x={760} y={1000} t={t} at={a - 4}>
        <rect x={560} y={900} width={400} height={200} fill={PAPER} strokeWidth={6} transform="rotate(-5 760 1000)" />
        <Tx x={760} y={1020} size={72} bold={1.4}>БИЛЕТ</Tx>
      </Pop>
      <Draw t={t} at={a} n={7} strokeWidth={12} d="M540 890 L980 1110" />
      <Stamp x={640} y={1280} text="БЕЗ БИЛЕТА" t={t} at={a + 8} size={90} />
    </Sheet>
  );
};
