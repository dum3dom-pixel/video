import React from 'react';
import { useCurrentFrame } from 'remotion';
import { clamp, easeOut, lerp } from '../../engine/anim';
import { INK, PAPER } from '../../lines/kit';
import { Draw, G, Ground, Head, Man, Pop, Sheet, Stamp, Tx } from '../piter-bw/shots';
import { Arrow, Sweat } from '../abilin-bw/shots';
import { Bag, Bank, Batya, House, Key } from './shots';
import { T } from './timing';

// НАЕБАЛИ №5 (полная версия): новые планы. Старые планы a1–a13 лежат в shots.tsx.

const Tag: React.FC<{ x: number; y: number; w: number; text: string; size?: number; dark?: boolean }> = ({ x, y, w, text, size = 60, dark }) => (
  <g>
    <rect x={x - w / 2} y={y - size} width={w} height={size * 1.5} fill={dark ? INK : PAPER} strokeWidth={5} />
    <Tx x={x} y={y + size * 0.15} size={size} fill={dark ? PAPER : INK} bold={1}>{text}</Tx>
  </g>
);

// Вот Саша, взял три миллиона.
export const C1: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.c1.m}>
      <Head lines={['САША ВЗЯЛ', '3 МИЛЛИОНА']} t={t} />
      <Ground />
      <Man x={330} y={G} s={1.7} mouth="smile" eyes="dots" la={[-30, 60]} ra={[56, -20]} seed={7} />
      <Tx x={330} y={G + 70} size={46} bold={0.8}>САША</Tx>
      <Pop x={760} y={G} t={t} at={T.c1.m}><Bag x={760} y={G} s={2.4} dark label="3 МЛН" ls={50} /></Pop>
    </Sheet>
  );
};

// Платёж почти 48 тысяч в месяц.
export const C2: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.c2.amt}>
      <Head lines={['ПЛАТЁЖ В МЕСЯЦ']} t={t} />
      <rect x={140} y={460} width={800} height={760} fill={PAPER} strokeWidth={6} />
      <rect x={140} y={460} width={800} height={110} fill={INK} />
      <Tx x={540} y={540} size={64} fill={PAPER} bold={1.2}>МЕСЯЦ</Tx>
      {Array.from({ length: 28 }, (_, i) => <rect key={i} x={170 + (i % 7) * 108} y={600 + Math.floor(i / 7) * 120} width={90} height={92} fill={PAPER} strokeWidth={3} />)}
      <Draw t={t} at={4} n={14} strokeWidth={10} d="M170 1200 L260 1150 L700 1080" />
      <Pop x={540} y={1380} t={t} at={T.c2.amt}><Tag x={540} y={1400} w={760} text="≈ 48 000 ₽" size={110} dark /></Pop>
    </Sheet>
  );
};

// Первый платёж: 47,5 тысячи проценты, 167 рублей в квартиру.
export const C3: React.FC = () => {
  const t = useCurrentFrame();
  const a = easeOut(clamp((t - T.c3.int) / 18));
  return (
    <Sheet hit={T.c3.flat}>
      <Head lines={['ПЕРВЫЙ ПЛАТЁЖ']} t={t} />
      <rect x={90} y={600} width={900} height={200} fill={PAPER} strokeWidth={6} />
      <rect x={90} y={600} width={900 * 0.9965 * a} height={200} fill={INK} strokeWidth={6} />
      <Pop x={540} y={900} t={t} at={T.c3.int}><Tx x={540} y={930} size={88} bold={1.6}>47 500 — ПРОЦЕНТЫ</Tx></Pop>
      <Pop x={540} y={1200} t={t} at={T.c3.flat}>
        <House x={270} y={1330} s={1.6} />
        <Tag x={680} y={1280} w={440} text="167 ₽" size={110} />
        <Tx x={680} y={1390} size={54} bold={0.8}>в квартиру</Tx>
      </Pop>
    </Sheet>
  );
};

// Через пять лет отдал 2,86 млн.
export const C4: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.c4.paid}>
      <Head lines={['ЧЕРЕЗ 5 ЛЕТ']} t={t} />
      <Ground />
      <Bank x={800} y={G} s={1.8} />
      <Man x={230} y={G} s={1.5} mouth="flat" eyes="dots" brow="sad" la={[-30, 60]} ra={[70, -10]} seed={7} />
      <Arrow a={{ x: 360, y: 1150 }} b={{ x: 640, y: 1150 }} t={t} at={T.c4.paid} n={12} />
      <Pop x={500} y={1000} t={t} at={T.c4.paid}><Tag x={500} y={950} w={600} text="ОТДАЛ 2,86 МЛН" size={72} dark /></Pop>
    </Sheet>
  );
};

// А долг уменьшился на 16 тысяч.
export const C5: React.FC = () => {
  const t = useCurrentFrame();
  const d = easeOut(clamp((t - T.c5.d) / 12));
  return (
    <Sheet hit={T.c5.d}>
      <Head lines={['А ДОЛГ УМЕНЬШИЛСЯ', 'НА 16 ТЫСЯЧ']} t={t} />
      <rect x={290} y={520} width={500} height={1000} fill={PAPER} strokeWidth={6} />
      <rect x={290} y={520} width={500} height={1000} fill={INK} opacity={0.9} />
      <rect x={290} y={520} width={500} height={Math.max(2, 14 * d)} fill={PAPER} strokeWidth={4} />
      <Tx x={540} y={1050} size={110} fill={PAPER} bold={2}>ДОЛГ</Tx>
      <Pop x={540} y={400} t={t} at={T.c5.d}><Tx x={540} y={470} size={80} bold={1.4}>−16 000</Tx></Pop>
      <Draw t={t} at={T.c5.d} n={8} strokeWidth={8} d="M200 540 L280 524" />
    </Sheet>
  );
};

// Первые годы почти одни проценты, квартиру ещё не начал покупать.
export const C6: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.c6.p}>
      <Head lines={['ПЕРВЫЕ ГОДЫ —', 'ОДНИ ПРОЦЕНТЫ']} t={t} />
      <Ground />
      <Bank x={770} y={G} s={1.6} />
      {[0, 1, 2, 3].map((i) => <Pop key={i} x={420 + i * 20} y={1150} t={t} at={T.c6.p + i * 4}><circle cx={430 + i * 30} cy={1180 - i * 6} r={38} fill={PAPER} strokeWidth={5} /></Pop>)}
      <Arrow a={{ x: 330, y: 1130 }} b={{ x: 580, y: 1130 }} t={t} at={T.c6.p} n={12} />
      <Pop x={200} y={900} t={t} at={T.c6.flat}><House x={200} y={G} s={1.4} ghost /></Pop>
      <Pop x={200} y={1000} t={t} at={T.c6.flat}><Stamp x={240} y={1040} text="ЕЩЁ НЕ НАЧАЛ" t={t} at={T.c6.flat} size={62} /></Pop>
    </Sheet>
  );
};

// Отдаст Саша 17 миллионов за квартиру за 3.
export const C7: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.c7.x}>
      <Head lines={['САША ОТДАСТ 17 МЛН']} t={t} />
      <Ground />
      <Pop x={330} y={G} t={t} at={T.c7.x}><Bag x={330} y={G} s={3.2} dark label="17 МЛН" ls={46} /></Pop>
      <Pop x={820} y={G} t={t} at={T.c7.y}><House x={820} y={G} s={1.5} /></Pop>
      <Pop x={820} y={1000} t={t} at={T.c7.y}><Tx x={820} y={1000} size={72} bold={1.4}>за 3 млн</Tx></Pop>
    </Sheet>
  );
};

// Девятнадцать круглая цифра: октябрьская ставка 18,7, всё равно 5,5 квартиры.
export const C8: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.c8.six}>
      <Head lines={['СТАВКА В ОКТЯБРЕ']} t={t} />
      <Pop x={540} y={700} t={t} at={T.c8.r}><Tag x={540} y={720} w={640} text="18,7 %" size={150} dark /></Pop>
      {Array.from({ length: 6 }, (_, i) => {
        const x = 230 + (i % 3) * 310;
        const y = 1100 + Math.floor(i / 3) * 330;
        return <Pop key={i} x={x} y={y} t={t} at={T.c8.six + i * 4} n={8}><House x={x} y={y} s={1.2} ghost={i === 5} /></Pop>;
      })}
      <Stamp x={540} y={1560} text="ВСЁ РАВНО 5,5" t={t} at={T.c8.six + 24} size={90} />
    </Sheet>
  );
};

// Инфляцию и досрочные не считал, порядок такой.
export const C9: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.c9.ord}>
      <Head lines={['НЕ СЧИТАЛ:']} t={t} />
      <Pop x={540} y={620} t={t} at={4}><Tag x={540} y={620} w={760} text="ИНФЛЯЦИЮ" size={84} /></Pop>
      <Pop x={540} y={860} t={t} at={14}><Tag x={540} y={860} w={860} text="ДОСРОЧНЫЕ ПЛАТЕЖИ" size={72} /></Pop>
      <Ground />
      <Man x={540} y={G} s={1.5} mouth="flat" eyes="up" brow="raised" la={[-55, 30]} ra={[55, 30]} seed={2} />
      <Stamp x={540} y={1130} text="ПОРЯДОК ТАКОЙ" t={t} at={T.c9.ord} size={90} />
    </Sheet>
  );
};

// Ссуда на пятнадцать лет.
export const C10: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.c10.y}>
      <Head lines={['КООПЕРАТИВ:', 'ССУДА НА 15 ЛЕТ']} t={t} />
      <Ground />
      <Batya x={290} s={1.6} la={[-30, 60]} ra={[56, -44]} />
      <Key x={470} y={G - 300} s={0.9} rot={-20} />
      <House x={800} y={G} s={2.2} />
      <Pop x={800} y={800} t={t} at={T.c10.y}><Tx x={800} y={800} size={160} bold={3}>15</Tx><Tx x={800} y={880} size={60} bold={1}>лет</Tx></Pop>
    </Sheet>
  );
};

// Честности ради: первый взнос 30–40 %.
export const C11: React.FC = () => {
  const t = useCurrentFrame();
  const f = easeOut(clamp((t - T.c11.dp) / 18));
  return (
    <Sheet hit={T.c11.dp}>
      <Head lines={['ПЕРВЫЙ ВЗНОС', '30–40 %']} t={t} />
      <Ground />
      <rect x={290} y={650} width={500} height={G - 650} fill={PAPER} strokeWidth={6} />
      <rect x={290} y={G - 380 * f} width={500} height={380 * f} fill={INK} strokeWidth={6} />
      <path d="M260 650 L540 480 L820 650 Z" fill={INK} />
      <Pop x={540} y={1000} t={t} at={T.c11.now}><Stamp x={540} y={1000} text="СРАЗУ" t={t} at={T.c11.now} size={120} /></Pop>
      <Batya x={150} s={1.1} mouth="flat" la={[-30, 60]} ra={[56, -40]} />
    </Sheet>
  );
};

// Только его очередь кончалась ключами, твоя — бумажкой.
export const C12: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.c12.doc}>
      <Head lines={['ЕГО ОЧЕРЕДЬ — КЛЮЧИ', 'ТВОЯ — БУМАЖКА']} t={t} />
      <Ground />
      <path d={`M540 500 V${G}`} strokeWidth={5} strokeDasharray="18 14" />
      <Batya x={270} s={1.5} la={[-30, 60]} ra={[56, -44]} />
      <Pop x={270} y={900} t={t} at={T.c12.key}><Key x={330} y={1000} s={2} rot={-20} /></Pop>
      <Man x={800} y={G} s={1.3} mouth="flat" eyes="up" brow="sad" la={[-40, 50]} ra={[40, 50]} seed={5} />
      <Pop x={800} y={880} t={t} at={T.c12.doc}>
        <rect x={640} y={640} width={320} height={420} fill={PAPER} strokeWidth={5} transform="rotate(4 800 850)" />
        <Tx x={800} y={760} size={40} bold={0.8} rot={4}>ОБЯЗАТЕЛЬСТВА</Tx>
        <Tx x={800} y={820} size={40} bold={0.8} rot={4}>ИСПОЛНЕНЫ</Tx>
        <Draw t={t} at={T.c12.doc + 8} n={8} strokeWidth={6} d="M700 960 q40 -50 80 0 t80 0" />
      </Pop>
    </Sheet>
  );
};

// Смотри не на платёж, а на переплату.
export const C13: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.c13.over}>
      <Head lines={['ЧТО ДЕЛАТЬ?']} t={t} />
      <Pop x={540} y={620} t={t} at={4}>
        <Tag x={540} y={640} w={560} text="ПЛАТЁЖ" size={100} />
        <Draw t={t} at={14} n={8} strokeWidth={12} d="M250 600 L830 590" />
      </Pop>
      <Pop x={540} y={1000} t={t} at={T.c13.over}><Tag x={540} y={1040} w={800} text="ПЕРЕПЛАТА" size={130} dark /></Pop>
      <Arrow a={{ x: 540, y: 740 }} b={{ x: 540, y: 880 }} t={t} at={T.c13.over} n={10} />
      <Ground />
      <Man x={540} y={G} s={1.5} mouth="smile" eyes="wide" brow="raised" la={[-30, 60]} ra={[80, -30]} seed={4} />
    </Sheet>
  );
};

// Банк показывает цифру в месяц, ты считай всё целиком.
export const C14: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.c14.all}>
      <Head lines={['БАНК ПОКАЗЫВАЕТ', 'ЦИФРУ В МЕСЯЦ']} t={t} />
      <Pop x={300} y={800} t={t} at={T.c14.month}><Tag x={300} y={820} w={400} text="48 000/мес" size={64} /></Pop>
      <Pop x={540} y={1250} t={t} at={T.c14.all}>
        <Tag x={540} y={1250} w={940} text="А ТЫ СЧИТАЙ ВСЁ: 17 МЛН" size={72} dark />
      </Pop>
      <Ground />
      <Bank x={850} y={G} s={1.1} />
    </Sheet>
  );
};

// Любой лишний рубль вноси в первые годы.
export const C15: React.FC = () => {
  const t = useCurrentFrame();
  const base = 1300;
  return (
    <Sheet hit={T.c15.early}>
      <Head lines={['ЛИШНИЙ РУБЛЬ —', 'В ПЕРВЫЕ ГОДЫ']} t={t} />
      <path d={`M60 ${base} H1020`} strokeWidth={6} />
      {Array.from({ length: 10 }, (_, i) => {
        const h = 480 - i * 40;
        return <rect key={i} x={70 + i * 95} y={base - h} width={80} height={h} fill={i < 3 ? INK : PAPER} strokeWidth={4} />;
      })}
      <Pop x={240} y={700} t={t} at={T.c15.early}><Tx x={240} y={720} size={56} bold={1}>проценты</Tx></Pop>
      <Arrow a={{ x: 240, y: 620 }} b={{ x: 200, y: base - 560 }} t={t} at={T.c15.early} n={10} />
      <Tx x={540} y={base + 80} size={50} bold={0.8}>30 лет →</Tx>
      <Pop x={800} y={800} t={t} at={T.c15.eat}><Stamp x={780} y={800} text="ЖРУТ БОЛЬШЕ ВСЕГО" t={t} at={T.c15.eat} size={52} /></Pop>
    </Sheet>
  );
};

// В конце уже поздно: банк своё забрал.
export const C16: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.c16.late}>
      <Head lines={['В КОНЦЕ УЖЕ ПОЗДНО']} t={t} />
      <Ground />
      <Bank x={760} y={G} s={2} />
      <Pop x={760} y={900} t={t} at={T.c16.take}><Bag x={500} y={G} s={1.5} dark label="17 МЛН" ls={42} /></Pop>
      <Man x={230} y={G} s={1.5} mouth="flat" eyes="up" brow="sad" la={[-40, 40]} ra={[40, 40]} seed={2} />
      <Sweat x={150} y={G - 400} t={t} />
      <Stamp x={540} y={800} text="БАНК СВОЁ ЗАБРАЛ" t={t} at={T.c16.take} size={78} />
    </Sheet>
  );
};
