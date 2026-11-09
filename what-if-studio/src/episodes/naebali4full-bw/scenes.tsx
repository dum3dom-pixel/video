import React from 'react';
import { useCurrentFrame } from 'remotion';
import { clamp, easeOut, lerp } from '../../engine/anim';
import { INK, PAPER } from '../../lines/kit';
import { Check, Confetti, Draw, G, Ground, Head, Man, Pop, Sheet, Stamp, Tx } from '../piter-bw/shots';
import { Arrow, Bubble, Tie } from '../abilin-bw/shots';
import { T } from './timing';

// НАЕБАЛИ №4 (полная версия): новые планы. Старые планы b1–b13 лежат в shots.tsx.

const Sack: React.FC<{ x: number; y: number; s?: number; label?: string }> = ({ x, y, s = 1, label = '$' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} strokeWidth={4 / s}>
    <path d="M-60 -6 Q-130 -50 -92 -130 Q-70 -170 -34 -190 L-48 -226 L48 -226 L34 -190 Q70 -170 92 -130 Q130 -50 60 -6 Z" fill={INK} />
    <Tx x={0} y={-70} size={64} fill={PAPER} bold={1.2}>{label}</Tx>
  </g>
);

const Tag: React.FC<{ x: number; y: number; w: number; text: string; size?: number; dark?: boolean }> = ({ x, y, w, text, size = 60, dark }) => (
  <g>
    <rect x={x - w / 2} y={y - size} width={w} height={size * 1.5} fill={dark ? INK : PAPER} strokeWidth={5} />
    <Tx x={x} y={y + size * 0.15} size={size} fill={dark ? PAPER : INK} bold={1}>{text}</Tx>
  </g>
);

// Как так? Очень просто.
export const N1: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={20}>
      <Head lines={['КАК ТАК?']} t={t} />
      <Pop x={540} y={900} t={t} at={4}><Tx x={540} y={1100} size={560} bold={9}>?</Tx></Pop>
      <Ground />
      <Man x={540} y={G} s={1.5} mouth="flat" eyes="up" brow="raised" la={[-55, 30]} ra={[55, 30]} seed={2} />
      <Stamp x={540} y={1330} text="ОЧЕНЬ ПРОСТО" t={t} at={26} size={96} />
    </Sheet>
  );
};

// Бар: десять человек и миллиардер.
export const N2: React.FC = () => {
  const t = useCurrentFrame();
  const k = easeOut(clamp((t - T.n2.bil) / 16));
  const rich = t >= T.n2.mil;
  const bx = lerp(1300, 850, k);
  return (
    <Sheet hit={T.n2.bil}>
      <Head lines={['БАР: 10 ЧЕЛОВЕК', 'И МИЛЛИАРДЕР']} t={t} />
      <Ground />
      <rect x={30} y={870} width={560} height={40} fill={INK} />
      {Array.from({ length: 10 }, (_, i) => (
        <Man key={i} x={90 + (i % 5) * 110} y={i < 5 ? 1130 : G} s={0.78} mouth={rich ? 'grin' : 'flat'} eyes="dots" seed={i} la={[-24, 60]} ra={[24, 60]} bob />
      ))}
      {t >= T.n2.bil && (
        <g>
          <Man x={bx} y={G} s={2.0} mouth="grin" eyes="dots" la={[-40, 50]} ra={[40, 50]} seed={11} />
          <Tie x={bx} y={G} s={2.0} />
          <Sack x={bx - 200} y={G} s={1.0} />
        </g>
      )}
      {rich && <Stamp x={540} y={700} text="В СРЕДНЕМ — МИЛЛИОНЕРЫ" t={t} at={T.n2.mil} size={56} />}
    </Sheet>
  );
};

// Твой отдел: 60, 70, 380.
export const N3: React.FC = () => {
  const t = useCurrentFrame();
  const col = [
    { x: 200, at: T.n3.you, v: '60 000', n: 'ТЫ', s: 1.1 },
    { x: 540, at: T.n3.vasya, v: '70 000', n: 'ВАСЯ', s: 1.1 },
    { x: 880, at: T.n3.boss, v: '380 000', n: 'НАЧАЛЬНИК', s: 1.6 },
  ];
  return (
    <Sheet hit={T.n3.you}>
      <Head lines={['ТВОЙ ОТДЕЛ']} t={t} />
      <Ground />
      {col.map((c, i) => (
        <g key={i}>
          <Pop x={c.x} y={G} t={t} at={c.at}>
            <Man x={c.x} y={G} s={c.s} mouth={i === 2 ? 'grin' : 'flat'} eyes="dots" brow={i === 2 ? 'none' : 'sad'} la={[-30, 60]} ra={[30, 60]} seed={i + 3} />
            {i === 2 && <Tie x={c.x} y={G} s={c.s} />}
          </Pop>
          <Pop x={c.x} y={950} t={t} at={c.at + 4}><Tag x={c.x} y={950} w={290} text={c.v} size={i === 2 ? 52 : 56} dark={i === 2} /></Pop>
          <Pop x={c.x} y={G + 70} t={t} at={c.at + 4}><Tx x={c.x} y={G + 70} size={40} bold={0.6}>{c.n}</Tx></Pop>
        </g>
      ))}
    </Sheet>
  );
};

// Средняя по отделу: 170, такой нет ни у кого.
export const N4: React.FC = () => {
  const t = useCurrentFrame();
  const g = easeOut(clamp(t / 18));
  const bars = [{ x: 230, h: 79 }, { x: 540, h: 92 }, { x: 850, h: 500 }];
  const base = 1500;
  return (
    <Sheet hit={T.n4.avg}>
      <Head lines={['СРЕДНЯЯ ПО ОТДЕЛУ']} t={t} />
      {bars.map((b, i) => <rect key={i} x={b.x - 90} y={base - b.h * g} width={180} height={b.h * g} fill={i === 2 ? INK : PAPER} strokeWidth={5} />)}
      <path d={`M60 ${base} H1020`} strokeWidth={6} />
      <Draw t={t} at={T.n4.avg} n={14} strokeWidth={6} d={`M60 ${base - 224} H1020`} />
      <Pop x={300} y={base - 420} t={t} at={T.n4.avg + 6}><Tag x={300} y={base - 420} w={520} text="СРЕДНЯЯ 170 000" size={60} /></Pop>
      <Stamp x={540} y={760} text="СТОЛЬКО НЕ ПОЛУЧАЕТ НИКТО" t={t} at={T.n4.none} size={50} />
    </Sheet>
  );
};

// Теперь по стране: Москва и Крым.
export const N5: React.FC = () => {
  const t = useCurrentFrame();
  const m = easeOut(clamp((t - T.n5.msk) / 22));
  const c = easeOut(clamp((t - T.n5.cr) / 22));
  const base = 1500;
  return (
    <Sheet hit={T.n5.msk}>
      <Head lines={['ТЕПЕРЬ ПО СТРАНЕ']} t={t} />
      <path d={`M60 ${base} H1020`} strokeWidth={6} />
      <rect x={140} y={base - 800 * m} width={300} height={800 * m} fill={INK} strokeWidth={5} />
      <rect x={640} y={base - 240 * c} width={300} height={240 * c} fill={PAPER} strokeWidth={5} />
      {m > 0.9 && <Tx x={290} y={base - 840} size={84} bold={1.6}>~290 000</Tx>}
      {c > 0.9 && <Tx x={790} y={base - 280} size={84} bold={1.6}>86 000</Tx>}
      <Tx x={290} y={base + 70} size={56} bold={1}>МОСКВА</Tx>
      <Tx x={790} y={base + 70} size={56} bold={1}>КРЫМ</Tx>
    </Sheet>
  );
};

// Страна одна, цифра одна, живут по-разному.
export const N6: React.FC = () => {
  const t = useCurrentFrame();
  const split = t >= T.n6.live;
  return (
    <Sheet hit={T.n6.live}>
      <Head lines={['СТРАНА ОДНА', 'ЦИФРА ОДНА']} t={t} />
      <Pop x={270} y={700} t={t} at={T.n6.one}><Tag x={270} y={700} w={420} text="СТРАНА: 1" /></Pop>
      <Pop x={810} y={700} t={t} at={T.n6.num}><Tag x={810} y={700} w={420} text="ЦИФРА: 1" dark /></Pop>
      <Ground />
      <path d={`M540 900 V${G}`} strokeWidth={5} strokeDasharray="18 14" />
      {[0, 1, 2].map((i) => <Man key={i} x={130 + i * 140} y={G} s={1.0} mouth={split ? 'grin' : 'flat'} eyes="dots" seed={i} la={[-24, 60]} ra={[24, 60]} bob />)}
      {[0, 1, 2].map((i) => <Man key={i} x={650 + i * 140} y={G} s={1.0} mouth="flat" eyes="dots" brow={split ? 'sad' : 'none'} seed={i + 5} la={[-24, 60]} ra={[24, 60]} />)}
      {split && <Confetti t={t} at={T.n6.live} top={900} n={16} seed={4} />}
    </Sheet>
  );
};

// Чем богаче верхушка, тем выше средняя.
export const N7: React.FC = () => {
  const t = useCurrentFrame();
  const r = easeOut(clamp((t - T.n7.rich) / 40));
  const base = 1500;
  return (
    <Sheet hit={T.n7.rich}>
      <Head lines={['ЧЕМ БОГАЧЕ ВЕРХУШКА,', 'ТЕМ ВЫШЕ СРЕДНЯЯ']} t={t} />
      <path d={`M60 ${base} H1020`} strokeWidth={6} />
      <rect x={140} y={base - 700 * r - 100} width={300} height={700 * r + 100} fill={INK} strokeWidth={5} />
      <rect x={640} y={base - (300 + 380 * r)} width={300} height={300 + 380 * r} fill={PAPER} strokeWidth={5} />
      <Man x={290} y={base - 700 * r - 100} s={0.9} mouth="grin" eyes="dots" seed={11} la={[-40, 50]} ra={[40, 50]} />
      <Tie x={290} y={base - 700 * r - 100} s={0.9} />
      <Tx x={290} y={base + 70} size={50} bold={1}>ВЕРХУШКА</Tx>
      <Tx x={790} y={base + 70} size={50} bold={1}>СРЕДНЯЯ</Tx>
      <Arrow a={{ x: 540, y: base - 200 }} b={{ x: 540, y: base - 600 }} t={t} at={T.n7.avg} n={14} />
    </Sheet>
  );
};

// Твоя зарплата не менялась, статистика растёт.
export const N8: React.FC = () => {
  const t = useCurrentFrame();
  const g = easeOut(clamp((t - T.n8.up) / 30));
  return (
    <Sheet hit={T.n8.up}>
      <Head lines={['ТВОЯ ЗАРПЛАТА', 'НЕ МЕНЯЛАСЬ']} t={t} />
      <Ground />
      <Pop x={820} y={900} t={t} at={4}>
        <rect x={600} y={650} width={420} height={460} fill={PAPER} strokeWidth={5} />
        <Tx x={810} y={710} size={44} bold={0.8}>СТАТИСТИКА</Tx>
        {[0, 1, 2, 3].map((i) => {
          const h = (90 + i * 60) * (i === 3 ? 1 + g : 1);
          return <rect key={i} x={640 + i * 95} y={1080 - h} width={70} height={h} fill={INK} />;
        })}
      </Pop>
      <Man x={300} y={G} s={1.7} mouth="flat" eyes="up" brow="sad" la={[-40, 50]} ra={[40, 50]} seed={5} />
      <Tag x={300} y={1000} w={340} text="60 000" />
      <Pop x={300} y={1100} t={t} at={T.n8.stay}><Tx x={300} y={1100} size={60} bold={1}>на месте</Tx></Pop>
    </Sheet>
  );
};

// Среднее: всё сложили и поделили.
export const N9: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.n9.add}>
      <Head lines={['СРЕДНЕЕ ЭТО:']} t={t} />
      <Pop x={540} y={700} t={t} at={4}><Tx x={540} y={700} size={110} bold={2}>60 + 70 + 380</Tx></Pop>
      <Pop x={540} y={950} t={t} at={T.n9.add}><Tx x={540} y={950} size={130} bold={2.4}>= 510</Tx></Pop>
      <Pop x={540} y={1200} t={t} at={T.n9.div}><Tx x={540} y={1200} size={130} bold={2.4}>÷ 3 = 170</Tx></Pop>
      <Ground />
      {[0, 1, 2].map((i) => <Pop key={i} x={300 + i * 240} y={G} t={t} at={T.n9.add + i * 3}><Sack x={300 + i * 240} y={G} s={0.8} /></Pop>)}
    </Sheet>
  );
};

// Большие зарплаты тянут вверх, ты внизу.
export const N10: React.FC = () => {
  const t = useCurrentFrame();
  const k = easeOut(clamp((t - T.n10.pull) / 24));
  const fy = lerp(1300, 700, k);
  return (
    <Sheet hit={T.n10.pull}>
      <Head lines={['БОЛЬШИЕ ЗАРПЛАТЫ', 'ТЯНУТ ЕЁ ВВЕРХ']} t={t} />
      <path d="M540 520 V1570" strokeWidth={6} />
      <g transform={`translate(0 ${fy - 700})`}>
        <path d="M540 700 H900 V820 H540 Z" fill={INK} />
        <Tx x={720} y={785} size={48} fill={PAPER} bold={0.8}>СРЕДНЯЯ</Tx>
      </g>
      <Pop x={200} y={760} t={t} at={Math.max(0, T.n10.pull - 6)}><Sack x={200} y={760} s={1.6} label="380" /></Pop>
      <Arrow a={{ x: 260, y: 900 }} b={{ x: 500, y: 760 }} t={t} at={Math.max(0, T.n10.pull - 4)} n={10} bend={0.2} />
      <Ground />
      <Man x={800} y={G} s={1.3} mouth="flat" eyes="up" brow="sad" la={[-40, 40]} ra={[40, 40]} seed={5} />
      <Stamp x={540} y={1180} text="ТЫ ВНИЗУ" t={t} at={T.n10.stay} size={96} />
    </Sheet>
  );
};

// Медиана: лупа.
export const N11: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.n11.med}>
      <Head lines={['ЧЕСТНАЯ ЦИФРА?']} t={t} />
      <Man x={260} y={G} s={1.6} mouth="smile" eyes="wide" brow="raised" la={[-30, 60]} ra={[80, -30]} seed={4} />
      <g transform={`translate(0 ${Math.sin(t / 8) * 8})`}>
        <Draw t={t} at={4} n={14} strokeWidth={14} d="M720 1020 L930 1330" />
        <circle cx={620} cy={860} r={280} fill={PAPER} strokeWidth={12} />
        <Pop x={620} y={860} t={t} at={T.n11.med}><Tx x={620} y={900} size={112} bold={2}>МЕДИАНА</Tx></Pop>
      </g>
      <Ground />
    </Sheet>
  );
};

// Ровно посередине.
export const N12: React.FC = () => {
  const t = useCurrentFrame();
  const base = 1500;
  return (
    <Sheet hit={T.n12.mid}>
      <Head lines={['ЗАРПЛАТА', 'РОВНО ПОСЕРЕДИНЕ']} t={t} />
      {Array.from({ length: 11 }, (_, i) => {
        const h = 120 + i * 70;
        const mid = i === 5 && t >= T.n12.mid;
        return (
          <g key={i}>
            <rect x={40 + i * 90} y={base - h} width={78} height={h} fill={mid ? INK : PAPER} strokeWidth={4} />
            <Man x={79 + i * 90} y={base - h} s={0.42} mouth={i < 5 ? 'flat' : 'smile'} eyes="dots" seed={i} la={[-20, 60]} ra={[20, 60]} />
          </g>
        );
      })}
      <path d={`M30 ${base} H1050`} strokeWidth={6} />
      <Arrow a={{ x: 535, y: 620 }} b={{ x: 535, y: base - 540 }} t={t} at={T.n12.mid} n={10} />
      <Pop x={200} y={700} t={t} at={T.n12.less}><Tx x={200} y={700} size={64} bold={1.2}>меньше</Tx></Pop>
      <Pop x={880} y={700} t={t} at={T.n12.more}><Tx x={880} y={700} size={64} bold={1.2}>больше</Tx></Pop>
    </Sheet>
  );
};

// Проверь себя: больше 75?
export const N13: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.n13.gt}>
      <Head lines={['ПРОВЕРЬ СЕБЯ']} t={t} />
      <Ground />
      <Man x={330} y={G} s={1.8} mouth="smile" eyes="wide" brow="raised" la={[-40, 50]} ra={[40, 50]} seed={9} />
      <Pop x={700} y={640} t={t} at={T.n13.gt}>
        <Bubble x={440} y={520} w={560} h={240} tx={460} />
        <Tx x={720} y={650} size={96} bold={1.6}>&gt; 75 000?</Tx>
      </Pop>
    </Sheet>
  );
};

// Верхняя половина, но ниже средней.
export const N14: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.n14.up}>
      <Head lines={['ВЕРХНЯЯ ПОЛОВИНА,', 'НО НИЖЕ СРЕДНЕЙ']} t={t} />
      <Draw t={t} at={2} n={12} strokeWidth={7} d="M60 700 H1020" />
      <Tx x={540} y={660} size={56} bold={1}>СРЕДНЯЯ 115 000</Tx>
      <Draw t={t} at={6} n={12} strokeWidth={7} d="M60 1230 H1020" />
      <Tx x={540} y={1300} size={56} bold={1}>МЕДИАНА 75 000</Tx>
      <Pop x={540} y={960} t={t} at={T.n14.up}>
        <rect x={380} y={960} width={320} height={20} fill={INK} />
        <Man x={540} y={960} s={0.85} mouth="smile" eyes="dots" la={[-30, 60]} ra={[30, 60]} seed={9} />
      </Pop>
      <Check x={780} y={900} t={t} at={T.n14.up + 4} s={2} />
      <Stamp x={540} y={1500} text="ВСЁ РАВНО НИЖЕ" t={t} at={T.n14.below} size={90} />
    </Sheet>
  );
};

// В новостях: зарплаты растут — у кого?
export const N15: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.n15.tv}>
      <Head lines={['«ЗАРПЛАТЫ РАСТУТ»']} t={t} />
      <Ground />
      <rect x={90} y={620} width={900} height={560} rx={30} fill={PAPER} strokeWidth={7} />
      <rect x={130} y={660} width={820} height={480} rx={16} fill={INK} />
      <Pop x={540} y={900} t={t} at={T.n15.tv}>
        <Tx x={540} y={850} size={96} fill={PAPER} bold={1.4}>ЗАРПЛАТЫ</Tx>
        <Tx x={540} y={980} size={96} fill={PAPER} bold={1.4}>РАСТУТ</Tx>
      </Pop>
      <path d="M400 620 L300 520 M680 620 L780 520" strokeWidth={5} />
      <Man x={300} y={G} s={1.6} mouth="flat" eyes="up" brow="raised" la={[-40, 50]} ra={[70, -60]} seed={5} />
      <Stamp x={760} y={1380} text="У КОГО?" t={t} at={T.n15.q} size={100} />
    </Sheet>
  );
};

// Если у директора, ты ни при чём.
export const N16: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.n16.ni}>
      <Head lines={['ЕСЛИ У ДИРЕКТОРА,', 'ТЫ НИ ПРИ ЧЁМ']} t={t} />
      <Ground />
      <Man x={290} y={G} s={1.6} mouth="grin" eyes="dots" la={[-40, 40]} ra={[50, -70]} seed={11} />
      <Tie x={290} y={G} s={1.6} />
      <Confetti t={t} at={4} top={520} n={26} seed={6} />
      <Pop x={190} y={G} t={t} at={4}><Sack x={120} y={G} s={1.3} /></Pop>
      <Man x={830} y={G} s={1.2} mouth="flat" eyes="up" brow="sad" la={[-60, 20]} ra={[60, 20]} seed={5} />
      <Stamp x={830} y={1000} text="НИ ПРИ ЧЁМ" t={t} at={T.n16.ni} size={72} />
    </Sheet>
  );
};

// Где-то хорошо, где-то очень плохо.
export const N17: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.n17.bad}>
      <Head lines={['В СРЕДНЕМ — ХОРОШО,', 'ЗНАЧИТ ГДЕ-ТО ПЛОХО']} t={t} />
      <rect x={40} y={560} width={1000} height={420} fill={PAPER} strokeWidth={5} />
      <Tx x={540} y={640} size={60} bold={1}>В СРЕДНЕМ: ВСЁ ХОРОШО</Tx>
      <Man x={540} y={980} s={1.0} mouth="grin" eyes="dots" la={[-40, 60]} ra={[60, -50]} seed={4} />
      <Draw t={t} at={4} n={12} strokeWidth={8} d="M540 1000 V1120 M500 1090 L540 1130 L580 1090" />
      <Ground />
      {Array.from({ length: 6 }, (_, i) => (
        <Man key={i} x={130 + i * 164} y={G} s={0.9} mouth="flat" eyes={i % 2 ? 'up' : 'dots'} brow="sad" seed={i + 7} la={[-24, 60]} ra={[24, 60]} />
      ))}
      <Stamp x={540} y={1260} text="ОЧЕНЬ ПЛОХО" t={t} at={T.n17.bad} size={100} />
    </Sheet>
  );
};
