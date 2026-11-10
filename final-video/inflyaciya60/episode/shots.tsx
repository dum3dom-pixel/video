import React from 'react';
import { useCurrentFrame } from 'remotion';
import { clamp, easeOut, lerp } from '../../engine/anim';
import { Clock, INK, PAPER } from '../../lines/kit';
import { Place } from '../../lines/places';
import { Draw, G, Ground, Head, Man, Pop, Sheet, Stamp, Tx } from '../piter-bw/shots';
import { T } from './timing';

// «Почему всё дорожает, а зарплата нет?» на 60 с: вертикальный ЧБ, 23 плана на готовых локациях (lines/places).
// Моменты внутри планов лежат в timing.ts (T).

const Arrow: React.FC<{ x: number; y: number; h?: number }> = ({ x, y, h = 90 }) => (
  <path d={`M${x} ${y} v${-h} m-24 28 l24 -28 l24 28`} strokeWidth={7} />
);

/** Чек с зубчатым низом и строками-позициями. */
const Receipt: React.FC<{ x: number; y: number; w: number; h: number; title: string; n?: number; t: number; at?: number }> = ({ x, y, w, h, title, n = 10, t, at = 0 }) => {
  const zig = Array.from({ length: Math.floor(w / 30) * 2 }, (_, i) => `l-15 ${i % 2 ? -18 : 18}`).join(' ');
  const gap = (h - 150) / n;
  return (
    <Pop x={x + w / 2} y={y + h / 2} t={t} at={at}>
      <path d={`M${x} ${y} h${w} v${h} ${zig} Z`} fill={PAPER} strokeWidth={5} />
      <Tx x={x + w / 2} y={y + 64} size={52} bold={1}>{title}</Tx>
      {Array.from({ length: n }, (_, i) => (
        <g key={i}>
          <path d={`M${x + 28} ${y + 130 + i * gap} h${w * 0.45}`} strokeWidth={4} />
          <path d={`M${x + w - 28 - w * 0.2} ${y + 130 + i * gap} h${w * 0.2}`} strokeWidth={4} />
        </g>
      ))}
    </Pop>
  );
};

const Loaf: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M-110 0 Q-130 -110 -50 -120 H50 Q130 -110 110 0 Z" fill={PAPER} strokeWidth={6} />
    <path d="M-50 -20 l16 -70 M0 -20 l16 -78 M50 -20 l16 -70" strokeWidth={5} />
  </g>
);
const Milk: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M-65 0 V-150 L-65 -190 L0 -230 L65 -190 V0 Z" fill={PAPER} strokeWidth={6} />
    <path d="M-65 -190 H65 M0 -230 V-190" strokeWidth={4} />
    <Tx x={0} y={-70} size={52} bold={1}>МОЛ</Tx>
  </g>
);
const Canister: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M-80 0 V-170 L-55 -200 H70 L90 -180 V0 Z" fill={PAPER} strokeWidth={6} />
    <path d="M-40 -200 V-232 H20 V-200" strokeWidth={6} />
    <circle cx={5} cy={-98} r={34} />
    <path d="M5 -128 C-12 -100 -8 -80 5 -66 C18 -80 22 -100 5 -128 Z" fill={INK} />
  </g>
);

/** Ценник на верёвочке. */
const PriceTag: React.FC<{ x: number; y: number; text: string; s?: number; rot?: number }> = ({ x, y, text, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-150 -70 H90 L150 0 L90 70 H-150 Z" fill={PAPER} strokeWidth={6} />
    <circle cx={-112} cy={0} r={14} strokeWidth={5} />
    <Tx x={0} y={26} size={86} bold={1.6}>{text}</Tx>
  </g>
);

/** Сумка с продуктами; fill 0–1 — насколько полная. */
const Bag: React.FC<{ x: number; y: number; fill: number; label: string }> = ({ x, y, fill, label }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M-150 0 H150 L120 300 H-120 Z" fill={PAPER} strokeWidth={6} />
    <path d="M-80 0 Q0 -120 80 0" strokeWidth={7} />
    {[0, 1, 2, 3].map((i) => (i / 4 < fill ? <circle key={i} cx={-80 + i * 55} cy={70} r={32} strokeWidth={5} /> : null))}
    {[0, 1, 2].map((i) => (i / 3 < fill ? <rect key={i} x={-90 + i * 66} y={150} width={50} height={90} rx={8} strokeWidth={5} /> : null))}
    <Tx x={0} y={370} size={54} bold={1}>{label}</Tx>
  </g>
);

// 1. Хук: почему всё дорожает, а зарплата нет.
export const S1: React.FC = () => {
  const t = useCurrentFrame();
  const a = T.q1.dor;
  const k = easeOut(clamp((t - a) / 16));
  return (
    <Sheet hit={a}>
      <Head lines={['ВСЁ ДОРОЖАЕТ,', 'А ЗАРПЛАТА?']} t={t} />
      <Place kind="market" v={0} t={t} />
      <Pop x={760} y={720} t={t} at={4}>
        <PriceTag x={760} y={720} text={`${Math.round(lerp(99, 149, k))}`} rot={-6} s={1.15} />
        <Arrow x={760} y={620} h={110} />
      </Pop>
      <Ground />
      <Man x={300} y={G} s={1.5} mouth="o" eyes="wide" brow="sad" la={[-40, 30]} ra={[44, 18]} bob />
      <Stamp x={330} y={960} text="НЕТ" t={t} at={T.q1.net} size={110} />
    </Sheet>
  );
};

// 2. Что происходит с деньгами: монеты тают в кошельке.
export const S2: React.FC = () => {
  const t = useCurrentFrame();
  const a = T.q2.dengi;
  return (
    <Sheet>
      <Head lines={['ЧТО С ТВОИМИ', 'ДЕНЬГАМИ?']} t={t} />
      <Place kind="home-desk" v={0} t={t} />
      <Pop x={760} y={760} t={t} at={6}>
        <path d="M600 700 H920 q30 0 30 30 V880 q0 30 -30 30 H600 q-30 0 -30 -30 V730 q0 -30 30 -30 Z" fill={PAPER} strokeWidth={6} />
        <path d="M900 770 h80 v80 h-80 Z" fill={INK} />
        {[0, 1, 2, 3].map((i) => {
          const gone = clamp((t - (a + 2 + i * 9)) / 10);
          return <circle key={i} cx={650 + i * 62} cy={800} r={26 * (1 - gone)} fill={PAPER} strokeWidth={5} />;
        })}
      </Pop>
      <Ground />
      <Man x={330} y={G} s={1.5} mouth="flat" eyes="dots" brow="sad" la={[-30, 70]} ra={[50, 14]} bob />
    </Sheet>
  );
};

// 3. Причин три, последняя самая неприятная.
export const S3: React.FC = () => {
  const t = useCurrentFrame();
  const e = T.q3;
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

// 4. Цены меняются каждую неделю.
export const S4: React.FC = () => {
  const t = useCurrentFrame();
  const a = T.q4.nedelyu;
  const w = clamp(Math.floor((t - 8) / 24), 0, 3);
  const price = [59, 64, 69, 75][w];
  return (
    <Sheet hit={a}>
      <Head lines={['ЦЕНЫ МЕНЯЮТСЯ', 'КАЖДУЮ НЕДЕЛЮ']} t={t} />
      <Place kind="market" v={1} t={t} />
      <Pop x={330} y={720} t={t} at={4}><PriceTag x={330} y={720} text={`${price}`} s={1.05} rot={5} /></Pop>
      {['нед. 1', 'нед. 2', 'нед. 3', 'нед. 4'].map((d, i) => (
        <g key={d}>
          <rect x={150 + i * 190} y={880} width={170} height={74} rx={10} fill={i <= w ? INK : PAPER} strokeWidth={5} />
          <Tx x={235 + i * 190} y={932} size={42} fill={i <= w ? PAPER : INK}>{d}</Tx>
        </g>
      ))}
      <Ground />
      <Man x={800} y={G} s={1.4} mouth="o" eyes="wide" brow="raised" la={[-30, 78]} ra={[30, 4]} bob />
    </Sheet>
  );
};

// 5. Зарплату повышают раз в год: календарь, одна клетка обведена.
export const S5: React.FC = () => {
  const t = useCurrentFrame();
  const e = T.q5;
  return (
    <Sheet>
      <Head lines={['ЗАРПЛАТУ — РАЗ', 'В ГОД']} t={t} />
      <Place kind="boss" v={0} t={t} />
      <Pop x={300} y={720} t={t} at={4}>
        <rect x={150} y={560} width={300} height={320} rx={14} fill={PAPER} strokeWidth={6} />
        <rect x={150} y={560} width={300} height={64} rx={14} fill={INK} />
        <Tx x={300} y={608} size={44} fill={PAPER}>ГОД</Tx>
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x={172 + (i % 4) * 66} y={650 + Math.floor(i / 4) * 70} width={52} height={52} strokeWidth={4} />
        ))}
      </Pop>
      <Draw t={t} at={e.god} n={10} strokeWidth={8} d="M258 735 a36 36 0 1 1 -0.1 0" />
      <Ground />
      <Man x={700} y={G} s={1.5} mouth="flat" eyes="dots" brow="sad" la={[-30, 70]} ra={[36, 40]} bob />
      <Pop x={800} y={880} t={t} at={e.vobshche}><Tx x={800} y={960} size={190} bold={3}>?</Tx></Pop>
    </Sheet>
  );
};

// 6. Андрей: зарплата та же, восемьдесят тысяч.
export const S6: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.q6.tys}>
      <Head lines={['АНДРЕЙ']} t={t} />
      <Place kind="home-desk" v={1} t={t} />
      <Pop x={300} y={780} t={t} at={6}>
        <rect x={110} y={600} width={380} height={300} rx={12} fill={PAPER} strokeWidth={6} />
        <Tx x={300} y={660} size={46}>ЗАРПЛАТА</Tx>
        <Tx x={300} y={790} size={120} bold={2}>80 000</Tx>
        <Tx x={300} y={860} size={46}>рублей</Tx>
      </Pop>
      <Ground />
      <Man x={760} y={G} s={1.5} mouth="smile" eyes="dots" la={[-30, 70]} ra={[-60, -30]} bob />
    </Sheet>
  );
};

// 7. Хлеб, молоко, бензин подорожали.
export const S7: React.FC = () => {
  const t = useCurrentFrame();
  const e = T.q7;
  return (
    <Sheet hit={e.pod}>
      <Head lines={['С ЯНВАРЯ', 'ПОДОРОЖАЛО']} t={t} />
      <Place kind="market" v={3} t={t} />
      <Pop x={230} y={960} t={t} at={e.bread - 2}><Loaf x={230} y={960} /><Arrow x={230} y={790} h={80} /></Pop>
      <Pop x={540} y={960} t={t} at={e.milk - 2}><Milk x={540} y={960} /><Arrow x={540} y={680} h={80} /></Pop>
      <Pop x={850} y={960} t={t} at={e.fuel - 2}><Canister x={850} y={960} /><Arrow x={850} y={680} h={80} /></Pop>
      <Ground />
      <Man x={540} y={G} s={1.3} mouth="o" eyes="wide" brow="sad" bob />
    </Sheet>
  );
};

// 8. Купить на зарплату можно меньше: пакет январь против ноября.
export const S8: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.q8.less}>
      <Head lines={['80 000 —', 'А КУПИТЬ МЕНЬШЕ']} t={t} />
      <Pop x={290} y={860} t={t} at={4}><Bag x={290} y={700} fill={1} label="ЯНВАРЬ" /></Pop>
      <Pop x={790} y={860} t={t} at={14}><Bag x={790} y={700} fill={0.4} label="НОЯБРЬ" /></Pop>
      <Tx x={540} y={1010} size={120} bold={2}>=</Tx>
      <Ground />
      <Man x={540} y={G} s={1.2} mouth="flat" eyes="dots" brow="sad" bob />
      <Stamp x={790} y={1240} text="МЕНЬШЕ" t={t} at={T.q8.less} size={100} />
    </Sheet>
  );
};

// 9. Официально: семь процентов (учреждение со вывеской).
export const S9: React.FC = () => {
  const t = useCurrentFrame();
  const e = T.q9;
  return (
    <Sheet hit={e.sem}>
      <Head lines={['ОФИЦИАЛЬНО']} t={t} />
      <Place kind="reception" v={0} t={t} />
      <Pop x={540} y={720} t={t} at={4}>
        <rect x={170} y={560} width={740} height={250} rx={16} fill={PAPER} strokeWidth={7} />
        <Tx x={540} y={670} size={96} bold={1.6}>РОССТАТ</Tx>
        <Tx x={540} y={770} size={80} bold={1.4}>цены: +7 % в год</Tx>
      </Pop>
      <Ground />
      <Man x={300} y={G} s={1.4} mouth="smile" eyes="dots" bob />
      <Stamp x={760} y={1010} text="7 %" t={t} at={e.sem} size={140} />
    </Sheet>
  );
};

// 10. Банк России спросил людей: четырнадцать с половиной.
export const S10: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['ОПРОС', 'БАНКА РОССИИ']} t={t} />
      <Place kind="bus-stop" v={0} t={t} />
      <Man x={170} y={G} s={1.3} mouth="smile" eyes="dots" la={[-20, 70]} ra={[46, 20]} />
      <rect x={235} y={G - 300} width={110} height={150} fill={PAPER} strokeWidth={5} transform={`rotate(-10 290 ${G - 225})`} />
      {[470, 640, 810, 960].map((x, i) => (
        <g key={x}>
          <Man x={x} y={G} s={0.85} mouth={i % 2 ? 'o' : 'flat'} eyes={i % 2 ? 'up' : 'dots'} seed={i + 2} bob />
          <Pop x={x} y={G - 290} t={t} at={14 + i * 6}>
            <Tx x={x} y={G - 270} size={72} bold={1.4}>?</Tx>
          </Pop>
        </g>
      ))}
      <Pop x={540} y={760} t={t} at={T.q10.pol} n={8}>
        <path d="M220 600 h640 q40 0 40 40 v150 q0 40 -40 40 h-320 l-60 70 v-70 h-260 q-40 0 -40 -40 v-150 q0 -40 40 -40 Z" fill={PAPER} strokeWidth={6} />
        <Tx x={540} y={740} size={120} bold={2}>14,5 %</Tx>
      </Pop>
    </Sheet>
  );
};

// 11. Своя корзина, а не средняя.
export const S11: React.FC = () => {
  const t = useCurrentFrame();
  const e = T.q11;
  return (
    <Sheet hit={e.svoyu}>
      <Head lines={['НЕ СРЕДНЯЯ', 'А СВОЯ']} t={t} />
      <Place kind="market" v={2} t={t} />
      <Pop x={290} y={780} t={t} at={4}>
        <rect x={110} y={650} width={360} height={140} rx={16} fill={PAPER} strokeWidth={6} />
        <Tx x={290} y={745} size={72} bold={1.4}>СРЕДНЯЯ</Tx>
      </Pop>
      <Draw t={t} at={e.svoyu - 24} n={8} strokeWidth={10} d="M100 640 L480 800" />
      <Draw t={t} at={e.svoyu - 18} n={8} strokeWidth={10} d="M480 640 L100 800" />
      <Pop x={790} y={780} t={t} at={e.svoyu}>
        <rect x={610} y={650} width={360} height={140} rx={16} fill={INK} strokeWidth={6} />
        <Tx x={790} y={745} size={80} bold={1.4} fill={PAPER}>СВОЯ</Tx>
      </Pop>
      <Ground />
      <Man x={540} y={G} s={1.4} mouth="grin" eyes="dots" brow="raised" la={[-30, 78]} ra={[40, 0]} bob />
    </Sheet>
  );
};

// 12. Цены помнишь до копейки.
export const S12: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['ЦЕНУ ПОМНИШЬ', 'ДО КОПЕЙКИ']} t={t} />
      <Place kind="kitchen" v={0} t={t} />
      <Pop x={700} y={760} t={t} at={4}>
        <ellipse cx={700} cy={760} rx={300} ry={150} fill={PAPER} strokeWidth={6} />
        <circle cx={500} cy={940} r={24} fill={PAPER} strokeWidth={5} />
        <circle cx={462} cy={1000} r={14} fill={PAPER} strokeWidth={5} />
        <Tx x={690} y={800} size={130} bold={2}>59,90</Tx>
      </Pop>
      <Draw t={t} at={T.q12.kop} n={8} strokeWidth={8} d="M860 700 a88 66 0 1 1 -0.1 0" />
      <Ground />
      <Man x={360} y={G} s={1.6} mouth="smile" eyes="up" brow="raised" la={[-30, 78]} ra={[40, -10]} bob />
    </Sheet>
  );
};

// 13. Третья причина, самая неприятная.
export const S13: React.FC = () => {
  const t = useCurrentFrame();
  const pulse = 1 + Math.sin(t * 0.25) * 0.03;
  return (
    <Sheet>
      <Head lines={['ТРЕТЬЯ ПРИЧИНА']} t={t} />
      <Pop x={540} y={860} t={t} at={4} n={8}>
        <circle cx={540} cy={860} r={290 * pulse} fill={INK} strokeWidth={8} />
        <Tx x={540} y={990} size={420} bold={4} fill={PAPER}>3</Tx>
      </Pop>
      <Tx x={540} y={1250} size={66}>самая неприятная</Tx>
      <Ground />
      <Man x={540} y={G} s={1.1} mouth="o" eyes="wide" brow="sad" bob />
    </Sheet>
  );
};

// 14. Подорожание запоминаем, подешевение нет.
export const S14: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.q14.net}>
      <Head lines={['ПОДОРОЖАЛО —', 'ПОМНИМ']} t={t} />
      <Pop x={290} y={800} t={t} at={4}>
        <rect x={110} y={560} width={360} height={440} rx={20} fill={PAPER} strokeWidth={6} />
        <Arrow x={290} y={760} h={150} />
        <Tx x={290} y={880} size={60}>подорожало</Tx>
        <Draw t={t} at={14} n={6} strokeWidth={9} d="M200 940 l30 36 l70 -80" />
      </Pop>
      <Pop x={790} y={800} t={t} at={22}>
        <rect x={610} y={560} width={360} height={440} rx={20} fill={PAPER} strokeWidth={6} />
        <path d="M790 640 v150 m-24 -28 l24 28 l24 -28" strokeWidth={7} />
        <Tx x={790} y={880} size={60}>подешевело</Tx>
        <Tx x={790} y={960} size={90} bold={2}>?</Tx>
      </Pop>
      <Ground />
      <Man x={540} y={G} s={1.4} mouth="flat" eyes="up" brow="raised" bob />
      <Stamp x={800} y={1180} text="НЕТ" t={t} at={T.q14.net} size={110} />
    </Sheet>
  );
};

// 15. Хлеб плюс пять рублей, запомнил на год.
export const S15: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.q15.god}>
      <Head lines={['ХЛЕБ +5 ₽ —', 'ПОМНИШЬ ГОД']} t={t} />
      <Place kind="market" v={2} t={t} />
      <Pop x={300} y={940} t={t} at={4}><Loaf x={300} y={940} /><Arrow x={300} y={780} h={80} /></Pop>
      <Pop x={480} y={720} t={t} at={14}><Tx x={480} y={760} size={110} bold={2}>+5 ₽</Tx></Pop>
      <Pop x={800} y={760} t={t} at={T.q15.god} n={8}>
        <rect x={660} y={600} width={280} height={240} rx={14} fill={PAPER} strokeWidth={6} />
        <rect x={660} y={600} width={280} height={60} rx={14} fill={INK} />
        <Tx x={800} y={646} size={42} fill={PAPER}>ГОД</Tx>
        <Tx x={800} y={770} size={110} bold={2}>365</Tx>
      </Pop>
      <Ground />
      <Man x={540} y={G} s={1.4} mouth="o" eyes="wide" brow="angry" bob />
    </Sheet>
  );
};

const Cucumber: React.FC<{ x: number; y: number; rot?: number }> = ({ x, y, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <ellipse cx={0} cy={0} rx={110} ry={42} fill={INK} strokeWidth={6} />
    <path d="M110 0 h26" strokeWidth={9} />
    {[-70, -30, 10, 50, 85].map((k) => <circle key={k} cx={k} cy={k % 40 ? 10 : -10} r={5} fill={PAPER} stroke="none" />)}
  </g>
);

// 16. Огурцы подешевели — забыл через неделю.
export const S16: React.FC = () => {
  const t = useCurrentFrame();
  const a = T.q16.zab;
  const fade = 1 - clamp((t - a) / 18);
  return (
    <Sheet hit={a}>
      <Head lines={['ОГУРЦЫ', 'ПОДЕШЕВЕЛИ']} t={t} />
      <Place kind="market" v={0} t={t} />
      <g opacity={fade}>
        <Pop x={620} y={740} t={t} at={4}>
          <Cucumber x={560} y={760} rot={-8} />
          <Cucumber x={700} y={840} rot={10} />
          <PriceTag x={780} y={640} text="−20" s={0.8} rot={8} />
        </Pop>
      </g>
      <Pop x={540} y={1000} t={t} at={a} n={6}><Tx x={540} y={1060} size={90} bold={2}>…забыл</Tx></Pop>
      <Ground />
      <Man x={260} y={G} s={1.5} mouth="smile" eyes="closed" bob />
    </Sheet>
  );
};

// 17. Возьми чеки за прошлый год.
export const S17: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.q17.chek}>
      <Head lines={['ЧЕКИ ЗА', 'ПРОШЛЫЙ ГОД']} t={t} />
      <Place kind="home-desk" v={2} t={t} />
      <Receipt x={130} y={560} w={230} h={420} title="ЧЕК" n={6} t={t} at={6} />
      <Receipt x={250} y={600} w={230} h={420} title="ЧЕК" n={6} t={t} at={14} />
      <Ground />
      <Man x={760} y={G} s={1.5} mouth="smile" eyes="dots" brow="raised" la={[-30, 70]} ra={[-70, -40]} bob />
    </Sheet>
  );
};

// 18. Десять продуктов, отмечаются галочками.
export const S18: React.FC = () => {
  const t = useCurrentFrame();
  const e = T.q18.ten;
  const n = 10;
  const gap = (640 - 150) / n;
  return (
    <Sheet>
      <Head lines={['ДЕСЯТЬ', 'ПРОДУКТОВ']} t={t} />
      <Place kind="kitchen" v={1} t={t} />
      <Receipt x={560} y={520} w={380} h={640} title="ЧЕК" n={n} t={t} at={4} />
      {Array.from({ length: n }, (_, i) => (
        <Draw key={i} t={t} at={e - 8 + i * 3} n={5} strokeWidth={6} d={`M${590} ${650 + i * gap} l12 14 l26 -34`} />
      ))}
      <Ground />
      <Man x={290} y={G} s={1.5} mouth="smile" eyes="dots" la={[-30, 70]} ra={[60, -10]} bob />
    </Sheet>
  );
};

// 19. Сравни цены: старый и новый чек, это твоя личная инфляция.
export const S19: React.FC = () => {
  const t = useCurrentFrame();
  const n = 10;
  const gap = (900 - 150) / n;
  return (
    <Sheet hit={T.q19.inf}>
      <Head lines={['СРАВНИ ЦЕНЫ']} t={t} />
      <Receipt x={110} y={520} w={330} h={900} title="ГОД НАЗАД" t={t} at={4} />
      <Receipt x={640} y={520} w={330} h={900} title="СЕЙЧАС" t={t} at={10} />
      {Array.from({ length: n }, (_, i) => (
        <Draw key={i} t={t} at={14 + i * 2} n={5} strokeWidth={6} d={`M545 ${650 + i * gap} l12 14 l26 -34`} />
      ))}
      <Stamp x={540} y={1180} text="ТВОЯ ИНФЛЯЦИЯ" t={t} at={T.q19.inf} size={80} />
    </Sheet>
  );
};

// 20. Если выше прибавки — не кажется.
export const S20: React.FC = () => {
  const t = useCurrentFrame();
  const g = easeOut(clamp((t - 6) / 22));
  const base = 1450;
  return (
    <Sheet hit={T.q20.nk}>
      <Head lines={['ИНФЛЯЦИЯ', 'ВЫШЕ ПРИБАВКИ']} t={t} />
      <path d={`M120 ${base} H960`} strokeWidth={6} />
      <rect x={220} y={base - 330 * g} width={260} height={330 * g} fill={PAPER} strokeWidth={6} />
      <rect x={600} y={base - 690 * g} width={260} height={690 * g} fill={INK} strokeWidth={6} />
      <Tx x={350} y={base + 70} size={46}>прибавка</Tx>
      <Tx x={730} y={base + 70} size={46}>твоя инфляция</Tx>
      <Stamp x={540} y={760} text="НЕ КАЖЕТСЯ" t={t} at={T.q20.nk} size={100} />
    </Sheet>
  );
};

// 21. Иди за повышением с цифрами.
export const S21: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['ИДИ ЗА', 'ПОВЫШЕНИЕМ']} t={t} />
      <Place kind="boss" v={1} t={t} />
      <Receipt x={110} y={640} w={210} h={400} title="ЧЕК" n={5} t={t} at={8} />
      <Pop x={340} y={800} t={t} at={16}><Tx x={340} y={860} size={72} bold={1.4}>с цифрами</Tx></Pop>
      <Ground />
      <Man x={620} y={G} s={1.5} mouth="grin" eyes="dots" brow="raised" la={[-30, 78]} ra={[-70, -30]} bob />
    </Sheet>
  );
};

// 22. Цены бегут, зарплата ждёт: автобус «ЦЕНЫ» уезжает, человек у остановки.
export const S22: React.FC = () => {
  const t = useCurrentFrame();
  const a = T.q22.zhdet;
  const go = easeOut(clamp(t / 40)) * 160;
  return (
    <Sheet hit={a}>
      <Head lines={['ЦЕНЫ БЕГУТ,', 'ЗАРПЛАТА ЖДЁТ']} t={t} />
      <Place kind="bus-stop" v={2} t={t} />
      <Pop x={820} y={1440} t={t} at={4}>
        <rect x={670} y={1390} width={300} height={100} rx={14} fill={INK} strokeWidth={6} />
        <Tx x={820} y={1465} size={70} bold={1.4} fill={PAPER}>ЦЕНЫ ➜</Tx>
      </Pop>
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${620 - go * 0.2 - i * 30} ${1380 + i * 50} h${-120 - i * 40}`} strokeWidth={6} />
      ))}
      <Ground />
      <Man x={330} y={G} s={1.5} mouth="flat" eyes="dots" brow="sad" bob />
      <Pop x={330} y={G - 640} t={t} at={a}>
        <Clock x={330} y={G - 640} r={90} hour={0} min={(t * 6) % 360} />
      </Pop>
    </Sheet>
  );
};

// 23. Отправь тому, кто спрашивает «почему всё дорожает».
export const S23: React.FC = () => {
  const t = useCurrentFrame();
  const p = easeOut(clamp((t - T.q23.voprosy) / 40));
  return (
    <Sheet hit={T.q23.voprosy}>
      <Head lines={['ОТПРАВЬ ТОМУ,', 'КТО СПРАШИВАЕТ']} t={t} />
      <Place kind="market" v={1} t={t} />
      <Pop x={540} y={740} t={t} at={6}>
        <path d="M130 600 h620 q40 0 40 40 v150 q0 40 -40 40 h-360 l-70 70 v-70 h-190 q-40 0 -40 -40 v-150 q0 -40 40 -40 Z" fill={PAPER} strokeWidth={6} />
        <Tx x={440} y={720} size={62} bold={1.2}>почему всё</Tx>
        <Tx x={440} y={790} size={62} bold={1.2}>дорожает?</Tx>
      </Pop>
      <g transform={`translate(${lerp(120, 880, p)} ${lerp(1000, 880, p)}) rotate(-12)`} strokeWidth={6}>
        <path d="M-70 0 L70 -40 L30 50 L5 20 Z" fill={PAPER} />
        <path d="M5 20 L70 -40" />
      </g>
      <Ground />
      <Man x={300} y={G} s={1.5} mouth="grin" eyes="dots" brow="raised" la={[-30, 78]} ra={[56, -20]} bob />
    </Sheet>
  );
};
