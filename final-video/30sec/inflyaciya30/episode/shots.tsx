import React from 'react';
import { useCurrentFrame } from 'remotion';
import { clamp, easeOut, lerp } from '../../engine/anim';
import { INK, PAPER } from '../../lines/kit';
import { Draw, G, Ground, Head, Man, Pop, Sheet, Stamp, Tx } from '../piter-bw/shots';
import { T } from './timing';

// «Инфляция 8 %, а кажется, что 20 %» на 30 с: вертикальный ЧБ, 14 планов. Моменты внутри планов лежат в timing.ts (T).

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

// 1. Хук: официально 7 %.
export const S1: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['ОФИЦИАЛЬНО']} t={t} />
      <Pop x={540} y={760} t={t} at={4}>
        <rect x={150} y={500} width={780} height={440} rx={24} fill={PAPER} strokeWidth={6} />
        <Tx x={540} y={800} size={330} bold={3}>7 %</Tx>
        <Tx x={540} y={895} size={54}>рост цен за год</Tx>
      </Pop>
      <Arrow x={880} y={1130} />
      <Ground />
      <Man x={380} y={G} s={1.5} mouth="smile" eyes="dots" bob />
    </Sheet>
  );
};

// 2. «А ты чувствуешь все четырнадцать»: число вырастает на слове.
export const S2: React.FC = () => {
  const t = useCurrentFrame();
  const a = T.p2.f;
  const v = lerp(7, 14, easeOut(clamp((t - (a - 12)) / 12)));
  return (
    <Sheet hit={a}>
      <Head lines={['А ТЫ', 'ЧУВСТВУЕШЬ']} t={t} />
      <rect x={110} y={560} width={860} height={440} rx={24} fill={PAPER} strokeWidth={6} />
      <Tx x={540} y={880} size={400} bold={4}>{Math.round(v)} %</Tx>
      {t >= a && [0, 1, 2, 3].map((i) => <path key={i} d={`M${170 + i * 245} 530 l${i % 2 ? 22 : -22} -48`} strokeWidth={7} />)}
      <Ground />
      <Man x={540} y={G} s={1.5} mouth="open" eyes="wide" brow="angry" la={[-52, -30]} ra={[52, -30]} bob />
    </Sheet>
  );
};

// 3. «И ты не врёшь».
export const S3: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.p3.vr}>
      <Head lines={['И ТЫ', 'НЕ ВРЁШЬ']} t={t} />
      <Tx x={540} y={760} size={240} bold={3}>7 ≠ 14</Tx>
      <Ground />
      <Man x={380} y={G} s={1.6} mouth="grin" eyes="dots" brow="raised" la={[-30, 78]} ra={[40, 4]} bob />
      <Stamp x={700} y={1010} text="НЕ ВРЁШЬ" t={t} at={T.p3.vr} size={104} />
    </Sheet>
  );
};

// 4. Опрос: интервьюер с планшетом, четверо отвечающих.
export const S4: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['ОПРОС ЦБ']} t={t} />
      <Pop x={540} y={720} t={t} at={10}>
        <path d="M120 540 h640 q40 0 40 40 v170 q0 40 -40 40 h-400 l-100 90 v-90 h-140 q-40 0 -40 -40 v-170 q0 -40 40 -40 Z" fill={PAPER} strokeWidth={6} />
        <Tx x={440} y={640} size={66} bold={1.2}>на сколько</Tx>
        <Tx x={440} y={720} size={66} bold={1.2}>выросли цены?</Tx>
      </Pop>
      <Ground />
      <Man x={170} y={G} s={1.3} mouth="smile" eyes="dots" la={[-20, 70]} ra={[46, 20]} />
      <rect x={235} y={G - 300} width={110} height={150} fill={PAPER} strokeWidth={5} transform={`rotate(-10 290 ${G - 225})`} />
      {[470, 640, 810, 960].map((x, i) => (
        <g key={x}>
          <Man x={x} y={G} s={0.85} mouth={i % 2 ? 'o' : 'flat'} eyes={i % 2 ? 'up' : 'dots'} seed={i + 2} bob />
          <Pop x={x} y={G - 290} t={t} at={26 + i * 6}>
            <Tx x={x} y={G - 270} size={72} bold={1.4}>?</Tx>
          </Pop>
        </g>
      ))}
    </Sheet>
  );
};

// 5. Медиана: два столбца, 7 и 14,5.
export const S5: React.FC = () => {
  const t = useCurrentFrame();
  const g = easeOut(clamp((t - 6) / 22));
  const base = 1450;
  const h1 = 340 * g;
  const h2 = 690 * g;
  return (
    <Sheet>
      <Head lines={['МЕДИАНА', 'ОПРОСА']} t={t} />
      <path d={`M120 ${base} H960`} strokeWidth={6} />
      <rect x={220} y={base - h1} width={260} height={h1} fill={PAPER} strokeWidth={6} />
      <rect x={600} y={base - h2} width={260} height={h2} fill={INK} strokeWidth={6} />
      <Pop x={350} y={base - 420} t={t} at={26}><Tx x={350} y={base - 400} size={150} bold={2}>7</Tx></Pop>
      <Pop x={730} y={base - 770} t={t} at={T.p5.pol}><Tx x={730} y={base - 750} size={150} bold={2}>14,5</Tx></Pop>
      <Tx x={350} y={base + 70} size={46}>официально</Tx>
      <Tx x={730} y={base + 70} size={46}>люди говорят</Tx>
    </Sheet>
  );
};

// 6. Почти вдвое: маленький и большой человечек.
export const S6: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.p6.pz}>
      <Head lines={['ПОЧТИ', 'ВДВОЕ']} t={t} />
      <Ground />
      <Man x={290} y={G} s={1.0} mouth="smile" eyes="dots" />
      <Tx x={290} y={G - 340} size={96} bold={2}>7 %</Tx>
      <Pop x={760} y={G} t={t} at={14}>
        <Man x={760} y={G} s={2.0} mouth="open" eyes="wide" brow="angry" la={[-40, 40]} ra={[40, 40]} bob />
        <Tx x={760} y={G - 610} size={120} bold={2}>14,5 %</Tx>
      </Pop>
      <Stamp x={540} y={720} text="ВДВОЕ" t={t} at={T.p6.pz} size={120} />
    </Sheet>
  );
};

// 7. Не средняя корзина: карточка «СРЕДНЯЯ» перечёркивается.
export const S7: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['НЕ СРЕДНЯЯ', 'КОРЗИНА']} t={t} />
      <Pop x={540} y={760} t={t} at={6}>
        <rect x={190} y={560} width={700} height={190} rx={18} fill={PAPER} strokeWidth={6} />
        <Tx x={540} y={680} size={110} bold={1.6}>СРЕДНЯЯ</Tx>
      </Pop>
      <Draw t={t} at={26} n={8} strokeWidth={10} d="M170 540 L910 780" />
      <Draw t={t} at={32} n={8} strokeWidth={10} d="M910 540 L170 780" />
      <Ground />
      <g transform={`translate(190 ${G - 300})`}>
        <path d="M0 0 H560 L505 300 H55 Z" fill={PAPER} strokeWidth={6} />
        <path d="M130 0 Q280 -230 430 0" strokeWidth={7} />
        {[100, 200, 300, 400, 490].map((x) => <path key={x} d={`M${x} 10 L${x - 20 + 40 * (x / 560)} 290`} strokeWidth={3} />)}
        <path d="M30 100 H530 M45 200 H515" strokeWidth={3} />
      </g>
      <Man x={920} y={G} s={1.1} mouth="smile" eyes="dots" brow="raised" bob />
    </Sheet>
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

// 8. Хлеб, молоко, бензин каждую неделю.
export const S8: React.FC = () => {
  const t = useCurrentFrame();
  const e = T.p8;
  const days = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
  return (
    <Sheet>
      <Head lines={['КАЖДУЮ НЕДЕЛЮ']} t={t} />
      <Pop x={230} y={860} t={t} at={e.bread - 2}><Loaf x={230} y={860} /><Arrow x={230} y={700} h={80} /></Pop>
      <Pop x={540} y={860} t={t} at={e.milk - 2}><Milk x={540} y={860} /><Arrow x={540} y={590} h={80} /></Pop>
      <Pop x={850} y={860} t={t} at={e.fuel - 2}><Canister x={850} y={860} /><Arrow x={850} y={590} h={80} /></Pop>
      {days.map((d, i) => {
        const x = 90 + i * 130;
        return (
          <g key={d}>
            <rect x={x} y={1200} width={110} height={150} fill={PAPER} strokeWidth={5} />
            <Tx x={x + 55} y={1250} size={44}>{d}</Tx>
            <Draw t={t} at={14 + i * 6} n={5} strokeWidth={7} d={`M${x + 28} 1305 l16 18 l34 -44`} />
          </g>
        );
      })}
      <Tx x={540} y={1450} size={56}>берёшь снова и снова</Tx>
    </Sheet>
  );
};

// 9. Цену помнишь до копейки.
export const S9: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['ЦЕНУ', 'ПОМНИШЬ']} t={t} />
      <Pop x={620} y={850} t={t} at={4}>
        <ellipse cx={620} cy={850} rx={340} ry={170} fill={PAPER} strokeWidth={6} />
        <circle cx={400} cy={1060} r={26} fill={PAPER} strokeWidth={5} />
        <circle cx={360} cy={1130} r={15} fill={PAPER} strokeWidth={5} />
        <Tx x={600} y={890} size={140} bold={2}>59,90</Tx>
      </Pop>
      <Draw t={t} at={T.p9.kop} n={8} strokeWidth={8} d="M770 800 a88 66 0 1 1 -0.1 0" />
      <Ground />
      <Man x={290} y={G} s={1.7} mouth="smile" eyes="up" brow="raised" la={[-30, 78]} ra={[40, -10]} bob />
    </Sheet>
  );
};

const Fridge: React.FC<{ x: number; y: number; w?: number; h?: number }> = ({ x, y, w = 380, h = 1000 }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={26} fill={PAPER} strokeWidth={6} />
    <path d={`M${x} ${y + h * 0.3} H${x + w}`} strokeWidth={5} />
    <path d={`M${x + w - 50} ${y + 50} v110 M${x + w - 50} ${y + h * 0.3 + 40} v170`} strokeWidth={9} />
    <rect x={x + 60} y={y + 70} width={60} height={60} transform={`rotate(8 ${x + 90} ${y + 100})`} />
  </g>
);

// 10. Холодильник раз в десять лет: десять «годов».
export const S10: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['ХОЛОДИЛЬНИК', 'РАЗ В 10 ЛЕТ']} t={t} />
      <Fridge x={120} y={520} w={360} h={980} />
      <Ground />
      {Array.from({ length: 10 }, (_, i) => {
        const x = 640 + (i % 2) * 190;
        const y = 600 + Math.floor(i / 2) * 170;
        return (
          <Pop key={i} x={x} y={y} t={t} at={4 + i * 4} n={6}>
            <circle cx={x} cy={y} r={64} fill={i === 9 ? INK : PAPER} strokeWidth={5} />
            <Tx x={x} y={y + 16} size={50} fill={i === 9 ? PAPER : INK} bold={1}>{i + 1}</Tx>
          </Pop>
        );
      })}
      <Tx x={790} y={1500} size={48}>годов</Tx>
    </Sheet>
  );
};

// 11. Он тебя не бесит.
export const S11: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['НЕ БЕСИТ']} t={t} />
      <Fridge x={120} y={560} w={360} h={940} />
      <Ground />
      <Man x={750} y={G} s={1.6} mouth="smile" eyes="closed" la={[-30, 78]} ra={[30, 78]} bob />
      <Pop x={760} y={760} t={t} at={14}>
        <path d="M560 640 h400 q30 0 30 30 v110 q0 30 -30 30 h-260 l-60 56 v-56 h-80 q-30 0 -30 -30 v-110 q0 -30 30 -30 Z" fill={PAPER} strokeWidth={5} />
        <Tx x={775} y={745} size={56}>цена? не помню</Tx>
      </Pop>
      <Stamp x={820} y={960} text="ОК" t={t} at={30} size={100} />
    </Sheet>
  );
};

// 12. Своя цифра: вопрос и чек в руках.
export const S12: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['СВОЯ ЦИФРА']} t={t} />
      <Pop x={540} y={900} t={t} at={4}><Tx x={540} y={1060} size={620} bold={5}>?</Tx></Pop>
      <Ground />
      <Man x={300} y={G} s={1.5} mouth="o" eyes="up" brow="raised" la={[-30, 78]} ra={[56, 10]} bob />
    </Sheet>
  );
};

// 13. Старый и новый чек, десять строк сравниваются.
export const S13: React.FC = () => {
  const t = useCurrentFrame();
  const e = T.p13.ten;
  const n = 10;
  const gap = (900 - 150) / n;
  return (
    <Sheet>
      <Head lines={['СТАРЫЙ ЧЕК', 'И НОВЫЙ']} t={t} />
      <Receipt x={110} y={520} w={330} h={900} title="МАЙ" t={t} at={4} />
      <Receipt x={640} y={520} w={330} h={900} title="НОЯБРЬ" t={t} at={12} />
      {Array.from({ length: n }, (_, i) => (
        <Draw key={i} t={t} at={e + i * 2} n={5} strokeWidth={6} d={`M${545} ${650 + i * gap} l12 14 l26 -34`} />
      ))}
    </Sheet>
  );
};

// 14. Финал: официально 7, а твоя в чеке.
export const S14: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.p14.chek}>
      <Head lines={['ТВОЯ', 'В ЧЕКЕ']} t={t} />
      <Pop x={250} y={760} t={t} at={4}>
        <rect x={80} y={560} width={340} height={300} rx={20} fill={PAPER} strokeWidth={6} />
        <Tx x={250} y={760} size={170} bold={2}>7 %</Tx>
      </Pop>
      <Draw t={t} at={12} n={8} strokeWidth={10} d="M60 540 L440 880" />
      <Draw t={t} at={18} n={8} strokeWidth={10} d="M440 540 L60 880" />
      <Receipt x={600} y={520} w={380} h={820} title="ТВОЙ ЧЕК" n={8} t={t} at={10} />
      <Ground />
      <Man x={330} y={G} s={1.5} mouth="grin" eyes="dots" brow="raised" la={[-30, 78]} ra={[64, -6]} bob />
      <Stamp x={730} y={1160} text="В ЧЕКЕ" t={t} at={T.p14.chek} size={120} />
    </Sheet>
  );
};
