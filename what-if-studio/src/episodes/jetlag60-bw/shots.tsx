import React from 'react';
import { useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut, lerp } from '../../engine/anim';
import { Clock, INK, PAPER } from '../../lines/kit';
import { Place } from '../../lines/places';
import { Draw, G, Ground, Head, Man, Pop, Sheet, Specs, Stamp, Tx } from '../piter-bw/shots';
import { T } from './timing';

// «Джетлаг можно словить прямо в кровати» на 60 с: вертикальный ЧБ, 26 планов на готовых локациях (lines/places).
// Моменты внутри планов лежат в timing.ts (T). Часы: hour/min в градусах (7:00 = 210, 23:00 = 330, 3:00 = 90, 12:00 = 0).

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

const Zzz: React.FC<{ x: number; y: number; t: number; at?: number }> = ({ x, y, t, at = 0 }) => (
  <g>
    {[0, 1, 2].map((i) => {
      const k = clamp((t - at - i * 8) / 10);
      if (k <= 0) return null;
      return <Tx key={i} x={x + i * 46} y={y - i * 64 - Math.sin(t / 6 + i) * 6} size={56 + i * 22} bold={1}>z</Tx>;
    })}
  </g>
);

/** Толпа из девяти человечков: первые `tired` уставшие. */
const Crowd: React.FC<{ t: number; tired: number; at?: number }> = ({ t, tired, at = 4 }) => (
  <g>
    {Array.from({ length: 9 }, (_, i) => {
      const x = 220 + (i % 3) * 320;
      const y = 800 + Math.floor(i / 3) * 280;
      const bad = i < tired;
      return (
        <Pop key={i} x={x} y={y} t={t} at={at + i * 3} n={7}>
          <Man x={x} y={y} s={0.62} mouth={bad ? 'o' : 'smile'} eyes={bad ? 'closed' : 'dots'} brow={bad ? 'sad' : 'none'} seed={i} bob />
          {bad && <Tx x={x + 56} y={y - 170 - Math.sin(t / 6 + i) * 6} size={52}>z</Tx>}
        </Pop>
      );
    })}
  </g>
);

// 1. Хук: джетлаг прямо в кровати, самолёт на кровати.
export const S1: React.FC = () => {
  const t = useCurrentFrame();
  const e = T.q1;
  const lift = easeOut(clamp((t - e.krov + 6) / 24));
  return (
    <Sheet hit={e.krov}>
      <Head lines={['ДЖЕТЛАГ', 'В КРОВАТИ']} t={t} />
      <Place kind="bedroom" v={0} t={t} />
      <Plane x={720} y={lerp(1080, 1000, lift) + Math.sin(t / 8) * 6} s={1.05} rot={lerp(0, -9, lift)} />
      <Ground />
      <Man x={250} y={G} s={1.5} mouth="o" eyes="wide" brow="raised" la={[-30, 78]} ra={[44, 30]} bob />
      <Stamp x={330} y={1010} text="В КРОВАТИ" t={t} at={e.krov} size={86} />
    </Sheet>
  );
};

// 2. Причин три, последняя самая неприятная.
export const S2: React.FC = () => {
  const t = useCurrentFrame();
  const e = T.q2;
  const dark = easeOut(clamp((t - e.nepr) / 10));
  return (
    <Sheet hit={e.nepr}>
      <Head lines={['ПРИЧИН ТРИ']} t={t} />
      {[0, 1, 2].map((i) => {
        const x = 220 + i * 320;
        const last = i === 2;
        return (
          <Pop key={i} x={x} y={820} t={t} at={e.tri + i * 10} n={6}>
            <circle cx={x} cy={820} r={130} fill={last && dark > 0.5 ? INK : PAPER} strokeWidth={7} />
            <Tx x={x} y={870} size={170} bold={3} fill={last && dark > 0.5 ? PAPER : INK}>{i + 1}</Tx>
          </Pop>
        );
      })}
      <Tx x={540} y={1130} size={60}>последняя — самая неприятная</Tx>
      <Ground />
      <Man x={540} y={G} s={1.3} mouth="o" eyes="wide" brow="sad" bob />
    </Sheet>
  );
};

// 3. Первая: в будни встаёшь по будильнику.
export const S3: React.FC = () => {
  const t = useCurrentFrame();
  const e = T.q3;
  const sh = t >= e.bud - 6 ? Math.sin(t * 2.2) * 9 : 0;
  return (
    <Sheet hit={e.bud}>
      <Head lines={['БУДНИ:', 'ПО БУДИЛЬНИКУ']} t={t} />
      <Place kind="bedroom" v={1} t={t} />
      <Alarm x={800} y={700} r={125} hour={210} min={0} shake={sh} />
      {t >= e.bud - 6 && [0, 1, 2].map((i) => <path key={i} d={`M${640 - i * 30} ${620 - i * 40} q-30 10 -40 40`} strokeWidth={6} />)}
      <Ground />
      <Man x={330} y={G} s={1.55} mouth="open" eyes="closed" brow="sad" la={[-50, -10]} ra={[50, 20]} bob />
    </Sheet>
  );
};

// 4. В выходные спишь сколько хочется.
export const S4: React.FC = () => {
  const t = useCurrentFrame();
  const e = T.q4;
  return (
    <Sheet hit={e.hochet}>
      <Head lines={['ВЫХОДНЫЕ:', 'СКОЛЬКО ХОЧЕТСЯ']} t={t} />
      <Place kind="bedroom" v={2} t={t} />
      <Pop x={820} y={700} t={t} at={6}>
        <Alarm x={820} y={700} r={95} hour={90} min={0} />
        <Draw t={t} at={e.vyh + 4} n={8} strokeWidth={11} d="M720 600 L920 800" />
        <Draw t={t} at={e.vyh + 9} n={8} strokeWidth={11} d="M920 600 L720 800" />
      </Pop>
      <Ground />
      <Man x={300} y={G} s={1.55} mouth="smile" eyes="closed" la={[-30, 78]} ra={[30, 78]} bob />
      <Zzz x={380} y={G - 380} t={t} at={e.vyh + 6} />
    </Sheet>
  );
};

// 5. Вот Настя.
export const S5: React.FC = () => {
  const t = useCurrentFrame();
  const e = T.q5;
  return (
    <Sheet hit={e.nastya}>
      <Head lines={['ВОТ НАСТЯ']} t={t} />
      <Place kind="home-desk" v={0} t={t} />
      <Ground />
      <Man x={540} y={G} s={1.7} mouth="smile" eyes="dots" hair="tuft" la={[-40, 60]} ra={[60, -30]} bob />
      <Pop x={540} y={1020} t={t} at={e.nastya - 2}><Tx x={540} y={1040} size={130} bold={2}>НАСТЯ</Tx></Pop>
    </Sheet>
  );
};

// 6. Будни: лёг в 23:00, встал в 7:00.
export const S6: React.FC = () => {
  const t = useCurrentFrame();
  const e = T.q6;
  return (
    <Sheet hit={e.sem}>
      <Head lines={['БУДНИ']} t={t} />
      <Pop x={290} y={800} t={t} at={e.odinn - 14}>
        <Clock x={290} y={800} r={150} hour={330} min={0} />
        <Tx x={290} y={1030} size={70} bold={1.2}>ЛЁГ 23:00</Tx>
      </Pop>
      <Pop x={790} y={800} t={t} at={e.sem - 10}>
        <Clock x={790} y={800} r={150} hour={210} min={0} />
        <Tx x={790} y={1030} size={70} bold={1.2}>ВСТАЛ 7:00</Tx>
      </Pop>
      <Draw t={t} at={e.sem - 8} n={10} strokeWidth={8} d="M470 800 h140 m-34 -30 l34 30 l-34 30" />
      <Ground />
      <Man x={540} y={G} s={1.3} mouth="flat" eyes="dots" bob />
    </Sheet>
  );
};

// 7. Выходные: лёг в 3:00, встал в 12:00.
export const S7: React.FC = () => {
  const t = useCurrentFrame();
  const e = T.q7;
  return (
    <Sheet hit={e.pol}>
      <Head lines={['ВЫХОДНЫЕ']} t={t} />
      <Pop x={290} y={800} t={t} at={e.tri - 12}>
        <Clock x={290} y={800} r={150} hour={90} min={0} />
        <Tx x={290} y={1030} size={70} bold={1.2}>ЛЁГ 3:00</Tx>
      </Pop>
      <Pop x={790} y={800} t={t} at={e.pol - 10}>
        <Clock x={790} y={800} r={150} hour={0} min={0} />
        <Tx x={790} y={1030} size={70} bold={1.2}>ВСТАЛ 12:00</Tx>
      </Pop>
      <Draw t={t} at={e.pol - 8} n={10} strokeWidth={8} d="M470 800 h140 m-34 -30 l34 30 l-34 30" />
      <Ground />
      <Man x={540} y={G} s={1.3} mouth="smile" eyes="closed" bob />
      <Zzz x={600} y={G - 340} t={t} at={e.tri + 8} />
    </Sheet>
  );
};

// 8. Часы сдвинулись на четыре часа: два окна сна, второе правее.
export const S8: React.FC = () => {
  const t = useCurrentFrame();
  const e = T.q8;
  const k = easeOut(clamp((t - 8) / 20));
  const shift = easeInOut(clamp((t - (e.chet - 18)) / 22));
  return (
    <Sheet hit={e.chet}>
      <Head lines={['ЧАСЫ СДВИНУЛИСЬ']} t={t} />
      <Tx x={160} y={640} size={52} anchor="start">будни</Tx>
      <rect x={160} y={670} width={480 * k} height={96} fill={PAPER} strokeWidth={6} />
      <Tx x={160} y={880} size={52} anchor="start">выходные</Tx>
      <rect x={160 + 240 * shift} y={910} width={480} height={96} fill={INK} strokeWidth={6} />
      {shift > 0.95 && <Draw t={t} at={e.chet - 2} n={8} strokeWidth={8} d="M160 1070 h240 m-34 -30 l34 30 l-34 30" />}
      <Stamp x={640} y={1230} text="+4 ЧАСА" t={t} at={e.chet} size={120} />
      <Ground />
      <Man x={250} y={G} s={1.3} mouth="o" eyes="wide" brow="sad" bob />
    </Sheet>
  );
};

// 9. Как будто слетала в Новосибирск и вернулась.
export const S9: React.FC = () => {
  const t = useCurrentFrame();
  const e = T.q9;
  const p = easeInOut(clamp(t / 60));
  return (
    <Sheet hit={e.nov}>
      <Head lines={['КАК БУДТО СЛЕТАЛА', 'В НОВОСИБИРСК']} t={t} />
      <Globe x={540} y={980} r={290} spin={t * 3} />
      <Draw t={t} at={4} n={20} strokeWidth={7} d="M170 640 Q540 440 910 640" />
      <Plane x={lerp(200, 880, p)} y={lerp(660, 640, p) - Math.sin(p * Math.PI) * 120} s={0.65} rot={lerp(-20, 22, p)} />
      <Stamp x={540} y={1450} text="НОВОСИБИРСК" t={t} at={e.nov} size={76} />
    </Sheet>
  );
};

// 10. Вторая: это не только Настя.
export const S10: React.FC = () => {
  const t = useCurrentFrame();
  const e = T.q10;
  return (
    <Sheet hit={e.nastya}>
      <Head lines={['НЕ ТОЛЬКО', 'НАСТЯ']} t={t} />
      <Crowd t={t} tired={9} />
      <Stamp x={540} y={1530} text="ТАКИХ МНОГО" t={t} at={e.nastya} size={70} />
    </Sheet>
  );
};

// 11. Тилль Роннеберг изучал сон.
export const S11: React.FC = () => {
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

// 12. У двух третей сдвиг больше часа.
export const S12: React.FC = () => {
  const t = useCurrentFrame();
  const e = T.q12;
  return (
    <Sheet hit={e.chasa}>
      <Head lines={['2 ИЗ 3', 'ЛЮДЕЙ']} t={t} />
      <Crowd t={t} tired={6} />
      <Tx x={540} y={1530} size={56}>сдвиг больше часа</Tx>
    </Sheet>
  );
};

// 13. Социальный джетлаг: штамп.
export const S13: React.FC = () => {
  const t = useCurrentFrame();
  const e = T.q13;
  return (
    <Sheet hit={e.dj}>
      <Head lines={['СОЦИАЛЬНЫЙ', 'ДЖЕТЛАГ']} t={t} />
      <Plane x={380} y={820} s={1.4} rot={-6} />
      <Pop x={820} y={760} t={t} at={6}>
        <Clock x={820} y={760} r={90} hour={t * 3} min={t * 36} />
      </Pop>
      <Ground />
      <Man x={540} y={G} s={1.4} mouth="o" eyes="closed" la={[-30, 78]} ra={[30, 78]} bob />
      <Stamp x={540} y={1050} text="ДЖЕТЛАГ" t={t} at={e.dj} size={118} />
    </Sheet>
  );
};

// 14. Почему в понедельник так плохо?
export const S14: React.FC = () => {
  const t = useCurrentFrame();
  const e = T.q14;
  return (
    <Sheet hit={e.plokho}>
      <Head lines={['ПОНЕДЕЛЬНИК:', 'ПОЧЕМУ ТАК?']} t={t} />
      <Place kind="bus-stop" v={0} t={t} />
      <Pop x={820} y={720} t={t} at={e.pn - 6}><Tx x={820} y={760} size={190} bold={3}>ПН</Tx></Pop>
      <Ground />
      <Man x={330} y={G} s={1.55} mouth="open" eyes="closed" brow="sad" la={[-40, 20]} ra={[44, 10]} bob />
      <Stamp x={400} y={1000} text="ПЛОХО" t={t} at={e.plokho} size={110} />
    </Sheet>
  );
};

// 15. Будильник в семь, а для тела три часа ночи.
export const S15: React.FC = () => {
  const t = useCurrentFrame();
  const e = T.q15;
  return (
    <Sheet hit={e.tri}>
      <Head lines={['7:00 И 3:00']} t={t} />
      <Pop x={290} y={800} t={t} at={e.sem - 14}>
        <Alarm x={290} y={800} r={130} hour={210} min={0} shake={Math.sin(t * 2.4) * 5} />
        <Tx x={290} y={1030} size={64} bold={1.2}>БУДИЛЬНИК</Tx>
      </Pop>
      <Pop x={790} y={800} t={t} at={e.tri - 12}>
        <Clock x={790} y={800} r={140} hour={90} min={0} />
        <Tx x={790} y={1030} size={64} bold={1.2}>ДЛЯ ТЕЛА</Tx>
      </Pop>
      <Ground />
      <Man x={540} y={G} s={1.4} mouth="o" eyes="closed" brow="sad" la={[-30, 78]} ra={[30, 78]} bob />
    </Sheet>
  );
};

// 16. Прилетела — и сразу на работу.
export const S16: React.FC = () => {
  const t = useCurrentFrame();
  const e = T.q16;
  const p = easeOut(clamp(t / 40));
  return (
    <Sheet hit={e.rab}>
      <Head lines={['ПРИЛЕТЕЛА —', 'И НА РАБОТУ']} t={t} />
      <Place kind="openspace" v={2} t={t} />
      <Plane x={lerp(-120, 820, p)} y={lerp(620, 700, p)} s={0.7} rot={lerp(-14, 4, p)} />
      <Ground />
      <Man x={380} y={G} s={1.6} mouth="open" eyes="closed" brow="sad" la={[-40, 20]} ra={[44, 10]} bob />
      <Stamp x={640} y={1180} text="СРАЗУ" t={t} at={e.rab - 6} size={100} />
    </Sheet>
  );
};

// 17. Третья, самая неприятная.
export const S17: React.FC = () => {
  const t = useCurrentFrame();
  const e = T.q17;
  const dark = easeOut(clamp((t - e.nepr) / 10));
  return (
    <Sheet hit={e.nepr}>
      <Head lines={['ТРЕТЬЯ ПРИЧИНА']} t={t} />
      {[0, 1, 2].map((i) => {
        const x = 220 + i * 320;
        const last = i === 2;
        return (
          <g key={i}>
            <circle cx={x} cy={820} r={130} fill={last && dark > 0.5 ? INK : PAPER} strokeWidth={7} />
            <Tx x={x} y={870} size={170} bold={3} fill={last && dark > 0.5 ? PAPER : INK}>{i + 1}</Tx>
          </g>
        );
      })}
      <Stamp x={540} y={1150} text="САМАЯ НЕПРИЯТНАЯ" t={t} at={e.nepr} size={64} />
      <Ground />
      <Man x={540} y={G} s={1.3} mouth="o" eyes="wide" brow="sad" bob />
    </Sheet>
  );
};

// 18. Выходные не лечат, а сдвигают.
export const S18: React.FC = () => {
  const t = useCurrentFrame();
  const e = T.q18;
  const push = easeInOut(clamp((t - e.sdv) / 24));
  return (
    <Sheet hit={e.sdv}>
      <Head lines={['НЕ ЛЕЧАТ,', 'А СДВИГАЮТ']} t={t} />
      <Place kind="hospital" v={0} t={t} />
      <Pop x={300} y={760} t={t} at={6}>
        <rect x={190} y={720} width={220} height={90} rx={45} fill={PAPER} strokeWidth={7} />
        <path d="M300 720 V810" strokeWidth={5} />
        <Draw t={t} at={e.lech} n={7} strokeWidth={12} d="M170 690 L430 840" />
        <Draw t={t} at={e.lech + 4} n={7} strokeWidth={12} d="M430 690 L170 840" />
      </Pop>
      <Pop x={760} y={760} t={t} at={e.lech + 8}>
        <Clock x={760 + 120 * push} y={760} r={110} hour={90 + 120 * push} min={0} />
      </Pop>
      <Ground />
      <Man x={330} y={G} s={1.5} mouth="flat" eyes="dots" brow="sad" la={[-30, 78]} ra={[44, 20]} bob />
    </Sheet>
  );
};

// 19. Выспалась до полудня, в воскресенье не уснёшь.
export const S19: React.FC = () => {
  const t = useCurrentFrame();
  const e = T.q19;
  return (
    <Sheet hit={e.vosk}>
      <Head lines={['ВОСКРЕСЕНЬЕ:', 'НЕ УСНУТЬ']} t={t} />
      <Place kind="bedroom" v={3} t={t} />
      <Pop x={880} y={640} t={t} at={e.pol - 4}>
        <Clock x={880} y={640} r={100} hour={330} min={0} />
        <Tx x={880} y={790} size={54} bold={1}>ВС 23:00</Tx>
      </Pop>
      <Ground />
      <Man x={330} y={G} s={1.55} mouth="flat" eyes="wide" brow="sad" la={[-30, 78]} ra={[44, 30]} bob />
      <Pop x={330} y={G - 430} t={t} at={e.vosk}>
        <Tx x={330} y={G - 430} size={70} bold={1}>не спится</Tx>
      </Pop>
    </Sheet>
  );
};

// 20. И в понедельник всё по новой: неделя по кругу.
export const S20: React.FC = () => {
  const t = useCurrentFrame();
  const days = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
  const p = (t / 48) % 1;
  return (
    <Sheet hit={T.q20.nov}>
      <Head lines={['ВСЁ', 'ПО НОВОЙ']} t={t} />
      {days.map((d, i) => (
        <g key={d}>
          <rect x={90 + i * 130} y={760} width={110} height={130} fill={i >= 5 ? INK : PAPER} strokeWidth={5} />
          <Tx x={145 + i * 130} y={840} size={44} fill={i >= 5 ? PAPER : INK}>{d}</Tx>
        </g>
      ))}
      <Draw t={t} at={4} n={14} strokeWidth={7} d="M900 930 Q540 1050 190 930 m36 -4 l-36 4 l16 -34" />
      <Plane x={lerp(120, 960, p)} y={640 - Math.sin(p * Math.PI) * 100} s={0.6} rot={-6} />
      <Ground />
      <Man x={540} y={G} s={1.3} mouth="o" eyes="closed" brow="sad" la={[-30, 78]} ra={[30, 78]} bob />
    </Sheet>
  );
};

// 21. Что делать: в выходные вставай не позже чем на час позже.
export const S21: React.FC = () => {
  const t = useCurrentFrame();
  const e = T.q21;
  const g = easeOut(clamp((t - 14) / 24));
  return (
    <Sheet>
      <Head lines={['ЧТО ДЕЛАТЬ?', 'СОВЕТ 1']} t={t} />
      <Tx x={110} y={680} size={52} anchor="start">будни</Tx>
      <rect x={110} y={710} width={420} height={96} fill={PAPER} strokeWidth={6} />
      <Tx x={320} y={778} size={54}>7:00</Tx>
      <Tx x={110} y={920} size={52} anchor="start">выходные</Tx>
      <rect x={110} y={950} width={420 + 160 * g} height={96} fill={INK} strokeWidth={6} />
      <Tx x={320} y={1018} size={54} fill={PAPER}>7:00</Tx>
      {g > 0.9 && <Tx x={610} y={1018} size={54} fill={PAPER}>+1 ч</Tx>}
      <Draw t={t} at={e.chas} n={7} strokeWidth={8} d="M800 940 l22 26 l54 -70" />
      <Stamp x={540} y={1160} text="МАКСИМУМ +1 ЧАС" t={t} at={e.chas} size={64} />
      <Ground />
      <Man x={300} y={G} s={1.4} mouth="smile" eyes="dots" la={[-30, 78]} ra={[50, 0]} bob />
      <Alarm x={760} y={G - 130} r={90} hour={210} min={0} />
    </Sheet>
  );
};

// 22. В воскресенье ложись вовремя.
export const S22: React.FC = () => {
  const t = useCurrentFrame();
  const e = T.q22;
  return (
    <Sheet hit={e.vovr}>
      <Head lines={['СОВЕТ 2', 'ЛОЖИСЬ ВОВРЕМЯ']} t={t} />
      <Place kind="bedroom" v={0} t={t} />
      <Pop x={870} y={640} t={t} at={6}>
        <Clock x={870} y={640} r={100} hour={330} min={0} />
      </Pop>
      <Draw t={t} at={e.vovr} n={8} strokeWidth={10} d="M780 790 l36 42 l86 -110" />
      <Ground />
      <Man x={250} y={G} s={1.5} mouth="smile" eyes="closed" la={[-30, 78]} ra={[30, 78]} bob />
      <Zzz x={330} y={G - 380} t={t} at={e.vovr} />
    </Sheet>
  );
};

// 23. Утром выйди на свет: он двигает часы тела.
export const S23: React.FC = () => {
  const t = useCurrentFrame();
  const e = T.q23;
  const back = easeInOut(clamp((t - e.svet) / 30));
  return (
    <Sheet hit={e.svet}>
      <Head lines={['СОВЕТ 3', 'ВЫЙДИ НА СВЕТ']} t={t} />
      <Place kind="park" v={0} t={t} />
      <Pop x={820} y={620} t={t} at={6}>
        <circle cx={820} cy={620} r={90} fill={PAPER} strokeWidth={7} />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * Math.PI) / 6 + t / 40;
          return <path key={i} d={`M${820 + Math.cos(a) * 120} ${620 + Math.sin(a) * 120} L${820 + Math.cos(a) * 175} ${620 + Math.sin(a) * 175}`} strokeWidth={6} />;
        })}
      </Pop>
      <Pop x={300} y={860} t={t} at={e.svet - 6}>
        <Clock x={300} y={860} r={95} hour={lerp(90, 0, back)} min={0} />
      </Pop>
      <Ground />
      <Man x={640} y={G} s={1.6} mouth="grin" eyes="dots" brow="raised" la={[-40, 78]} ra={[60, -120]} bob />
    </Sheet>
  );
};

// 24. Если понедельник бьёт сильнее, чем работа, тебе не кажется.
export const S24: React.FC = () => {
  const t = useCurrentFrame();
  const e = T.q24;
  return (
    <Sheet hit={e.kazh}>
      <Head lines={['ТЕБЕ НЕ', 'КАЖЕТСЯ']} t={t} />
      <Place kind="elevator" v={0} t={t} />
      <Pop x={820} y={720} t={t} at={6}><Tx x={820} y={760} size={190} bold={3}>ПН</Tx></Pop>
      <Ground />
      <Man x={380} y={G} s={1.6} mouth="open" eyes="closed" brow="sad" la={[-40, 20]} ra={[44, 10]} bob />
      <Stamp x={400} y={1020} text="НЕ КАЖЕТСЯ" t={t} at={e.kazh} size={90} />
    </Sheet>
  );
};

// 25. Виновата не работа, а рейс, которого не было.
export const S25: React.FC = () => {
  const t = useCurrentFrame();
  const e = T.q25;
  const p = easeOut(clamp((t - e.reis + 10) / 30));
  return (
    <Sheet hit={e.reis}>
      <Head lines={['ВИНОВАТА', 'НЕ РАБОТА']} t={t} />
      <Place kind="openspace" v={0} t={t} />
      <Pop x={540} y={760} t={t} at={6}>
        <rect x={250} y={600} width={580} height={190} rx={18} fill={PAPER} strokeWidth={6} />
        <Tx x={540} y={725} size={120} bold={1.6}>РАБОТА</Tx>
      </Pop>
      <Draw t={t} at={14} n={7} strokeWidth={11} d="M220 580 L860 810" />
      <Draw t={t} at={19} n={7} strokeWidth={11} d="M860 580 L220 810" />
      <Plane x={lerp(-100, 820, p)} y={1000} s={0.9} rot={-4} />
      <Ground />
      <Man x={300} y={G} s={1.5} mouth="o" eyes="wide" brow="raised" la={[-40, 78]} ra={[60, -10]} bob />
      <Stamp x={700} y={1250} text="РЕЙС" t={t} at={e.reis} size={130} />
    </Sheet>
  );
};

// 26. Отправь тому, кто вечно разбит по понедельникам.
export const S26: React.FC = () => {
  const t = useCurrentFrame();
  const e = T.q26;
  const p = easeOut(clamp((t - e.razbit) / 26));
  return (
    <Sheet hit={e.razbit}>
      <Head lines={['ОТПРАВЬ ТОМУ,', 'КТО ВЕЧНО РАЗБИТ']} t={t} />
      <Place kind="home-desk" v={1} t={t} />
      <Draw t={t} at={4} n={12} strokeWidth={7} d="M360 700 L800 560 L620 840 L560 700 Z" />
      <path d="M560 700 L800 560" strokeWidth={4} />
      <g transform={`translate(${lerp(0, 160, p)} ${lerp(0, -120, p)})`} opacity={1 - p * 0.3}>
        <path d="M-40 0 H40 M24 -16 L40 0 L24 16" transform="translate(300 960)" strokeWidth={8} />
      </g>
      <Ground />
      <Man x={380} y={G} s={1.5} mouth="smile" eyes="dots" la={[-30, 78]} ra={[50, -20]} bob />
      <Stamp x={700} y={1190} text="ОТПРАВЬ" t={t} at={e.razbit - 20} size={100} />
    </Sheet>
  );
};
