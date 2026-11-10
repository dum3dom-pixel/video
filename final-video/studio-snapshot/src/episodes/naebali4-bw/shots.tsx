import React from 'react';
import { useCurrentFrame } from 'remotion';
import { clamp, easeOut, lerp } from '../../engine/anim';
import { INK, PAPER } from '../../lines/kit';
import { Confetti, Draw, G, Ground, Head, Man, Pop, Sheet, Stamp, Tx } from '../piter-bw/shots';
import { Arrow, Sweat, Tie } from '../abilin-bw/shots';
import { T } from './timing';

// НАЕБАЛИ №4 «Одно яйцо, одна сиська»: вертикальный ЧБ 1080×1920, 13 планов. Моменты внутри плана лежат в timing.ts (gen_timing.py по best_words.json).

/** Чёрные плашки-цензура на человечке: «яйцо» (низ) и «сиська» (грудь, одна сторона). */
const Bars: React.FC<{ x: number; y: number; s: number; t: number; a: number; b: number }> = ({ x, y, s, t, a, b }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke="none">
    {t >= a && <g><rect x={-26} y={-52} width={58} height={38} fill={INK} /><text x={3} y={-24} fontSize={28} fill={PAPER} textAnchor="middle" fontFamily="Neucha, cursive">1</text></g>}
    {t >= b && <g><rect x={-40} y={-152} width={46} height={34} fill={INK} /><text x={-17} y={-127} fontSize={26} fill={PAPER} textAnchor="middle" fontFamily="Neucha, cursive">1</text></g>}
  </g>
);

const Average: React.FC<{ x: number; s: number; t: number; a: number; b: number; mouth?: 'flat' | 'smile' | 'o' }> = ({ x, s, t, a, b, mouth = 'flat' }) => (
  <g>
    <Man x={x} y={G} s={s} mouth={mouth} eyes="dots" la={[-30, 70]} ra={[30, 70]} seed={4} />
    <Bars x={x} y={G} s={s} t={t} a={a} b={b} />
  </g>
);

const Sign: React.FC<{ x: number; y: number; t: number; at: number }> = ({ x, y, t, at }) => (
  <Pop x={x} y={y} t={t} at={at}>
    <path d={`M${x - 250} 400 L${x - 180} ${y - 60} M${x + 250} 400 L${x + 180} ${y - 60}`} strokeWidth={4} />
    <rect x={x - 340} y={y - 60} width={680} height={150} fill={PAPER} strokeWidth={6} />
    <Tx x={x} y={y + 28} size={72} bold={1.4}>СРЕДНИЙ РОССИЯНИН</Tx>
  </Pop>
);

// 1. Средний россиянин: одно яйцо, одна сиська (под цензурой).
export const B1: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.b1.e2}>
      <Head lines={['В СРЕДНЕМ:']} t={t} />
      <Sign x={540} y={560} t={t} at={3} />
      <Ground />
      <Average x={540} s={1.9} t={t} a={T.b1.e1} b={T.b1.e2} />
    </Sheet>
  );
};

// 2. Так же считают зарплату.
export const B2: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.b2.stamp}>
      <Head lines={['ТАК ЖЕ СЧИТАЮТ', 'ТВОЮ ЗАРПЛАТУ']} t={t} />
      <Sign x={540} y={640} t={t} at={0} />
      <Ground />
      <Average x={300} s={1.6} t={t} a={0} b={0} />
      <Pop x={800} y={1250} t={t} at={6}>
        <rect x={660} y={1050} width={300} height={170} fill={PAPER} strokeWidth={5} transform="rotate(5 810 1135)" />
        <Tx x={810} y={1160} size={72} bold={1.2} rot={5}>ЗАРПЛАТА</Tx>
      </Pop>
      <Stamp x={700} y={900} text="В СРЕДНЕМ" t={t} at={T.b2.stamp} size={84} />
    </Sheet>
  );
};

// 3. Росстат, июнь: почти 115 тысяч.
export const B3: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.b3.sum}>
      <Head lines={['РОССТАТ, ИЮНЬ']} t={t} />
      <g transform="translate(540 760)">
        <path d="M-260 -80 L0 -190 L260 -80 Z" fill={INK} />
        {[-190, -95, 0, 95, 190].map((cx) => <rect key={cx} x={cx - 24} y={-70} width={48} height={220} fill={PAPER} />)}
        <rect x={-290} y={150} width={580} height={30} fill={PAPER} />
        <rect x={-320} y={180} width={640} height={34} fill={PAPER} />
        <Tx x={0} y={-100} size={58} fill={PAPER} bold={0.8}>РОССТАТ</Tx>
      </g>
      <Pop x={540} y={1280} t={t} at={T.b3.sum}>
        <rect x={110} y={1100} width={860} height={300} fill={PAPER} strokeWidth={6} />
        <Tx x={540} y={1300} size={180} bold={3}>115 000</Tx>
        <Tx x={540} y={1210} size={52}>средняя зарплата</Tx>
      </Pop>
    </Sheet>
  );
};

// 4. Посмотрел на карту — охуел (экран банкомата).
export const B4: React.FC = () => {
  const t = useCurrentFrame();
  const sh = t >= T.b4.shock;
  return (
    <Sheet hit={T.b4.shock}>
      <Head lines={['ТЫ ПОСМОТРЕЛ', 'НА КАРТУ']} t={t} />
      <Ground />
      <g>
        <rect x={600} y={560} width={380} height={G - 560} fill={PAPER} strokeWidth={6} />
        <rect x={640} y={610} width={300} height={250} fill={INK} />
        <Tx x={790} y={770} size={120} fill={PAPER} bold={1.4}>{sh ? '?!' : '...'}</Tx>
        <rect x={650} y={920} width={280} height={34} fill={INK} />
        {Array.from({ length: 9 }, (_, i) => <rect key={i} x={660 + (i % 3) * 94} y={1000 + Math.floor(i / 3) * 74} width={74} height={54} fill={PAPER} strokeWidth={3} />)}
      </g>
      <Man x={290} y={G} s={1.6} mouth={sh ? 'open' : 'flat'} eyes={sh ? 'wide' : 'dots'} brow={sh ? 'raised' : 'none'} la={[-40, 50]} ra={[sh ? 70 : 40, sh ? -40 : 30]} seed={1} />
      {sh && <Sweat x={210} y={G - 470} t={t} />}
      {sh && [0, 1, 2].map((i) => <path key={i} d={`M${440 + i * 36} ${G - 560 - (i % 2) * 20} v-50`} strokeWidth={8} />)}
    </Sheet>
  );
};

// 5. Это до налога: монета, из которой откусывают 13 %.
export const B5: React.FC = () => {
  const t = useCurrentFrame();
  const k = easeOut(clamp((t - T.b5.bite) / 14));
  const a0 = -23.4;
  const a1 = 23.4;
  const pt = (a: number, r: number) => `${540 + r * Math.cos((a * Math.PI) / 180)} ${900 + r * Math.sin((a * Math.PI) / 180)}`;
  return (
    <Sheet hit={T.b5.bite}>
      <Head lines={['ЭТО ДО НАЛОГА']} t={t} />
      <circle cx={540} cy={900} r={290} fill={PAPER} strokeWidth={7} />
      <circle cx={540} cy={900} r={250} strokeWidth={3} />
      <Tx x={500} y={940} size={140} bold={2.4}>115 000</Tx>
      <g transform={`translate(${k * 130} 0)`}>
        {t >= T.b5.bite && <path d={`M540 900 L${pt(a0 + 0, 290)} A290 290 0 0 1 ${pt(a1, 290)} Z`} fill={INK} strokeWidth={5} />}
        {t >= T.b5.bite && <Tx x={870} y={800} size={80} bold={1.2}>13 %</Tx>}
      </g>
      <Stamp x={540} y={1380} text="ДО НАЛОГА" t={t} at={4} size={104} />
    </Sheet>
  );
};

// 6. Минус налог — уже сотня.
export const B6: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.b6.new}>
      <Head lines={['МИНУС НАЛОГ —', 'СОТНЯ']} t={t} />
      <Tx x={540} y={700} size={160} bold={2.4}>115 000</Tx>
      <Draw t={t} at={T.b6.neg} n={10} strokeWidth={14} d="M160 660 L920 640" />
      <Arrow a={{ x: 540, y: 780 }} b={{ x: 540, y: 960 }} t={t} at={T.b6.neg + 4} n={10} />
      <Pop x={540} y={1180} t={t} at={T.b6.new}>
        <Tx x={540} y={1180} size={230} bold={4}>100 000</Tx>
      </Pop>
      <Ground />
      <Man x={540} y={G} s={1.2} mouth="flat" eyes="up" brow="sad" la={[-40, 50]} ra={[40, 50]} seed={8} />
    </Sheet>
  );
};

// 7. Половина страны получает меньше 75.
export const B7: React.FC = () => {
  const t = useCurrentFrame();
  const top = Array.from({ length: 6 }, (_, i) => ({ x: 110 + i * 172, y: 980 }));
  const bot = Array.from({ length: 6 }, (_, i) => ({ x: 110 + i * 172, y: 1480 }));
  const low = t >= T.b7.half;
  return (
    <Sheet hit={T.b7.half}>
      <Head lines={['ПОЛОВИНА СТРАНЫ', 'ПОЛУЧАЕТ МЕНЬШЕ']} t={t} />
      {top.map((p, i) => <Man key={i} x={p.x} y={p.y} s={0.85} mouth="smile" eyes="dots" seed={i} la={[-22, 60]} ra={[22, 60]} bob />)}
      <Ground y={980 + 14} hatch={false} />
      {bot.map((p, i) => <Man key={i} x={p.x} y={p.y} s={0.85} mouth={low ? 'flat' : 'smile'} eyes="dots" brow={low ? 'sad' : 'none'} seed={i + 6} la={[-22, 60]} ra={[22, 60]} />)}
      <Ground y={1480 + 14} hatch={false} />
      <Draw t={t} at={T.b7.half} n={12} strokeWidth={6} d="M40 1120 H1040" />
      <Pop x={540} y={1120} t={t} at={T.b7.half + 6}>
        <rect x={250} y={1070} width={580} height={100} fill={INK} />
        <Tx x={540} y={1142} size={62} fill={PAPER} bold={1}>около 75 000</Tx>
      </Pop>
    </Sheet>
  );
};

/** Качели: директор слева (тяжёлый), ты справа. */
const Scales: React.FC<{ t: number; dir: number; you: number }> = ({ t, dir, you }) => {
  const ang = -9 * easeOut(clamp((t - dir) / 14));
  return (
    <g>
      <path d={`M540 1430 L430 ${G} H650 Z`} fill={INK} />
      <g transform={`rotate(${ang} 540 1430)`}>
        <path d="M120 1430 H960" strokeWidth={14} />
        <Pop x={290} y={1430} t={t} at={dir}>
          <Man x={290} y={1430} s={1.55} mouth="grin" eyes="dots" la={[-40, 50]} ra={[40, 50]} seed={11} />
          <Tie x={290} y={1430} s={1.55} />
        </Pop>
        <Pop x={820} y={1430} t={t} at={you}>
          <Man x={820} y={1430} s={0.8} mouth="flat" eyes="dots" brow="sad" la={[-26, 70]} ra={[26, 70]} seed={3} />
        </Pop>
      </g>
    </g>
  );
};

// 8. Директор с бонусом и ты.
export const B8: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={Math.min(T.b8.you, 28)}>
      <Head lines={['ДИРЕКТОР С БОНУСОМ', 'И ТЫ']} t={t} />
      <Ground />
      <Scales t={t} dir={T.b8.dir} you={Math.min(T.b8.you, 28)} />
      <Pop x={170} y={880} t={t} at={T.b8.dir + 8}>
        <g strokeWidth={4}>
          <path d="M120 960 Q70 900 100 860 L130 820 H210 L240 860 Q270 900 220 960 Z" fill={INK} />
          <Tx x={170} y={930} size={54} fill={PAPER} bold={1}>$</Tx>
        </g>
      </Pop>
    </Sheet>
  );
};

// 9. В среднем вы оба молодцы: стрелка на «ОК».
export const B9: React.FC = () => {
  const t = useCurrentFrame();
  const n = easeOut(clamp((t - T.b9.needle) / 16));
  const ang = lerp(-80, 0, n);
  return (
    <Sheet hit={T.b9.needle + 16}>
      <Head lines={['В СРЕДНЕМ ВЫ', 'ОБА МОЛОДЦЫ']} t={t} />
      <g transform="translate(540 760)">
        <path d="M-300 0 A300 300 0 0 1 300 0" fill={PAPER} strokeWidth={6} />
        <path d="M-80 -295 A300 300 0 0 1 80 -295 L50 -170 A180 180 0 0 0 -50 -170 Z" fill={INK} stroke="none" />
        <Tx x={0} y={-215} size={50} fill={PAPER} bold={0.8}>ОК</Tx>
        <path d="M-300 0 H300" strokeWidth={6} />
        <g transform={`rotate(${ang} 0 0)`}>
          <path d="M0 0 L0 -250" strokeWidth={9} />
          <circle r={18} fill={INK} />
        </g>
      </g>
      <Ground />
      <Scales t={1000} dir={0} you={0} />
    </Sheet>
  );
};

// 10. Директору премия, тебе статистика.
export const B10: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.b10.bag}>
      <Head lines={['ДИРЕКТОРУ — ПРЕМИЯ', 'ТЕБЕ — СТАТИСТИКА']} t={t} />
      <Ground />
      <Man x={270} y={G} s={1.5} mouth="grin" eyes="dots" la={[-40, 40]} ra={[50, -70]} seed={11} />
      <Tie x={270} y={G} s={1.5} />
      <Pop x={270} y={900} t={t} at={T.b10.bag}>
        <path d="M200 1000 Q140 920 180 870 L215 835 H325 L360 870 Q400 920 340 1000 Z" fill={INK} strokeWidth={4} />
        <Tx x={270} y={960} size={90} fill={PAPER} bold={1.4}>$</Tx>
      </Pop>
      <Confetti t={t} at={T.b10.bag} top={450} n={26} seed={3} />
      <Man x={820} y={G} s={1.15} mouth="flat" eyes="up" brow="sad" la={[-30, 60]} ra={[40, -20]} seed={5} />
      <Pop x={900} y={1000} t={t} at={T.b10.sheet}>
        <rect x={760} y={760} width={290} height={360} fill={PAPER} strokeWidth={5} transform="rotate(6 905 940)" />
        <g transform="rotate(6 905 940)">
          <Tx x={905} y={820} size={46} bold={1}>СТАТИСТИКА</Tx>
          <rect x={790} y={980} width={40} height={80} fill={INK} /><rect x={850} y={930} width={40} height={130} fill={INK} /><rect x={910} y={890} width={40} height={170} fill={INK} /><rect x={970} y={950} width={40} height={110} fill={INK} />
          <path d="M780 1066 H1030" strokeWidth={3} />
        </g>
      </Pop>
    </Sheet>
  );
};

// 11. В вакансиях чаще всего пишут полтинник.
export const B11: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.b11.stamp}>
      <Head lines={['В ВАКАНСИЯХ', 'ЧАЩЕ ВСЕГО']} t={t} />
      {Array.from({ length: 6 }, (_, i) => {
        const x = 300 + (i % 2) * 480;
        const y = 640 + Math.floor(i / 2) * 330;
        return (
          <Pop key={i} x={x} y={y} t={t} at={T.b11.cards + i * 4} n={8}>
            <rect x={x - 220} y={y - 110} width={440} height={250} fill={PAPER} strokeWidth={5} />
            <path d={`M${x - 190} ${y - 60} h200 M${x - 190} ${y - 30} h140`} strokeWidth={3} />
            <Tx x={x} y={y + 90} size={80} bold={1.4}>50 000</Tx>
          </Pop>
        );
      })}
      <Stamp x={540} y={1360} text="ПОЛТИННИК" t={t} at={T.b11.stamp} size={110} />
    </Sheet>
  );
};

// 12. В среднем всё ок (улыбка сквозь слёзы).
export const B12: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.b12.ok}>
      <Head lines={['В СРЕДНЕМ', 'ВСЁ ОК']} t={t} />
      <Ground />
      <Draw t={t} at={4} n={20} strokeWidth={5} d="M40 560 Q540 700 1040 560" />
      <Pop x={540} y={690} t={t} at={T.b12.ok}>
        <rect x={190} y={640} width={700} height={130} fill={PAPER} strokeWidth={6} />
        <Tx x={540} y={730} size={84} bold={1.4}>ВСЁ ХОРОШО!</Tx>
      </Pop>
      <Confetti t={t} at={T.b12.ok} top={480} n={34} seed={9} />
      <Man x={540} y={G} s={1.7} mouth="grin" eyes="dots" la={[-40, 60]} ra={[60, -90]} seed={4} />
      <path d={`M470 ${G - 400} q-6 30 -20 44`} strokeWidth={6} />
      <Sweat x={640} y={G - 470} t={t} />
    </Sheet>
  );
};

// 13. Одно яйцо, одна сиська, 115 тысяч: штамп и плашка «дальше».
export const B13: React.FC = () => {
  const t = useCurrentFrame();
  const at = T.b13.stamp;
  return (
    <Sheet hit={at}>
      <Head lines={['ИТОГО']} t={t} />
      <Ground />
      <Average x={540} s={1.5} t={t} a={T.b13.s1} b={T.b13.s2} mouth="smile" />
      <Pop x={540} y={520} t={t} at={T.b13.n}><Tx x={540} y={560} size={180} bold={3}>115 000</Tx></Pop>
      <Stamp x={540} y={800} text="НАЕБАЛИ №4" t={t} at={at} size={112} />
      {t >= at + 16 && (
        <Pop x={540} y={1030} t={t} at={at + 16}>
          <rect x={130} y={960} width={820} height={120} fill={PAPER} strokeWidth={6} />
          <Tx x={540} y={1042} size={64} bold={1.2}>ДАЛЬШЕ: ШЕСТЬ КВАРТИР</Tx>
        </Pop>
      )}
    </Sheet>
  );
};
