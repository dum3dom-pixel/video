import React from 'react';
import { useCurrentFrame } from 'remotion';
import { clamp, easeOut, lerp } from '../../engine/anim';
import { INK, PAPER } from '../../lines/kit';
import { Draw, G, Ground, Head, Man, Pop, Sheet, Stamp, Tash, Tx } from '../piter-bw/shots';
import { Arrow, Bubble, Hat, Sweat, Tie, row } from '../abilin-bw/shots';
import { T } from './timing';

// НАЕБАЛИ №5 «Шесть квартир»: вертикальный ЧБ 1080×1920, 13 планов. Моменты внутри плана лежат в timing.ts (gen_timing.py по best_words.json).

/** Домик: низ по y, ширина 120·s. */
export const House: React.FC<{ x: number; y: number; s?: number; ghost?: boolean }> = ({ x, y, s = 1, ghost }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} strokeWidth={3.4 / s} opacity={ghost ? 0.28 : 1} strokeDasharray={ghost ? '12 10' : undefined}>
    <rect x={-60} y={-92} width={120} height={92} fill={PAPER} />
    <path d="M-78 -92 L0 -156 L78 -92 Z" fill={ghost ? PAPER : INK} />
    <rect x={-14} y={-52} width={28} height={52} fill={PAPER} />
    <rect x={26} y={-72} width={24} height={24} fill={PAPER} />
    <rect x={-50} y={-72} width={24} height={24} fill={PAPER} />
  </g>
);

export const Bank: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} strokeWidth={3.4 / s}>
    <path d="M-150 -170 L0 -250 L150 -170 Z" fill={INK} />
    <rect x={-150} y={-170} width={300} height={16} fill={PAPER} />
    {[-110, -55, 0, 55, 110].map((cx) => <rect key={cx} x={cx - 14} y={-154} width={28} height={124} fill={PAPER} />)}
    <rect x={-166} y={-30} width={332} height={14} fill={PAPER} />
    <rect x={-182} y={-16} width={364} height={16} fill={PAPER} />
    <Tx x={0} y={-190} size={34} fill={PAPER} bold={0.8}>БАНК</Tx>
  </g>
);

export const Bag: React.FC<{ x: number; y: number; s?: number; dark?: boolean; label: string; ls?: number }> = ({ x, y, s = 1, dark, label, ls = 56 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} strokeWidth={4 / s}>
    <path d="M-60 -6 Q-130 -50 -92 -130 Q-70 -170 -34 -190 L-48 -226 L48 -226 L34 -190 Q70 -170 92 -130 Q130 -50 60 -6 Z" fill={dark ? INK : PAPER} />
    <path d="M-34 -190 Q0 -176 34 -190" stroke={dark ? PAPER : INK} />
    <Tx x={0} y={-80} size={ls} fill={dark ? PAPER : INK} bold={1.2}>{label}</Tx>
  </g>
);

export const Key: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} strokeWidth={5 / s}>
    <circle r={22} fill={PAPER} />
    <circle r={7} fill={INK} stroke="none" />
    <path d="M22 0 H110 M88 0 V24 M106 0 V18" />
  </g>
);

/** Батя: усы и хохолок. */
export const Batya: React.FC<{ x: number; s?: number; mouth?: 'smile' | 'grin' | 'open' | 'flat'; la?: [number, number]; ra?: [number, number]; flip?: boolean; y?: number }> = ({ x, y = G, s = 1.5, mouth = 'grin', la = [-30, 70], ra = [30, 70], flip }) => (
  <g>
    <Man x={x} y={y} s={s} mouth={mouth} eyes="dots" hair="tuft" la={la} ra={ra} seed={6} flip={flip} />
    <Tash x={x} y={y} s={s} />
  </g>
);

// 1. Батя купил одну квартиру.
export const A1: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.a1.key}>
      <Head lines={['БАТЯ КУПИЛ', 'ОДНУ']} t={t} />
      <Ground />
      <Batya x={290} s={1.6} la={[-30, 60]} ra={[56, -44]} />
      <Pop x={430} y={G - 300} t={t} at={T.a1.key}><Key x={440} y={G - 304} s={0.9} rot={-20} /></Pop>
      <House x={790} y={G} s={2.4} />
      <Pop x={790} y={760} t={t} at={T.a1.key}><Tx x={790} y={860} size={220} bold={4}>1</Tx></Pop>
    </Sheet>
  );
};

export const Six: React.FC<{ t: number; at: number; stag?: number }> = ({ t, at, stag = 5 }) => (
  <>
    {Array.from({ length: 6 }, (_, i) => {
      const x = 230 + (i % 3) * 310;
      const y = 800 + Math.floor(i / 3) * 360;
      return <Pop key={i} x={x} y={y} t={t} at={at + i * stag} n={8}><House x={x} y={y} s={1.4} /></Pop>;
    })}
  </>
);

// 2. Ты заплатишь почти за шесть.
export const A2: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.a2.h}>
      <Head lines={['ТЫ ЗАПЛАТИШЬ', 'ЗА ШЕСТЬ']} t={t} />
      <Six t={t} at={T.a2.h} />
      <Ground />
      <Man x={540} y={G} s={1.3} mouth="o" eyes="wide" brow="sad" la={[-40, 40]} ra={[40, 40]} seed={2} />
      <Sweat x={450} y={G - 360} t={t} />
    </Sheet>
  );
};

// 3. Считаем: калькулятор, 19 %, 30 лет.
export const A3: React.FC = () => {
  const t = useCurrentFrame();
  const digits = `${Math.floor(((t * 7919) % 90000) + 10000)}`;
  return (
    <Sheet hit={T.a3.y}>
      <Head lines={['СЧИТАЕМ']} t={t} />
      <rect x={170} y={420} width={740} height={1100} rx={50} fill={PAPER} strokeWidth={6} />
      <rect x={220} y={470} width={640} height={210} fill={INK} />
      <Tx x={820} y={650} size={110} fill={PAPER} anchor="end" bold={1}>{t < T.a3.p ? digits : '5,72'}</Tx>
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={230 + (i % 4) * 160} y={1000 + Math.floor(i / 4) * 150} width={130} height={110} rx={22} fill={PAPER} strokeWidth={4} />
      ))}
      <Pop x={540} y={820} t={t} at={T.a3.p}>
        <rect x={220} y={725} width={300} height={190} fill={PAPER} strokeWidth={5} />
        <Tx x={370} y={845} size={110} bold={2}>19 %</Tx>
      </Pop>
      <Pop x={700} y={820} t={t} at={T.a3.y}>
        <rect x={560} y={725} width={300} height={190} fill={PAPER} strokeWidth={5} />
        <Tx x={710} y={845} size={96} bold={2}>30 ЛЕТ</Tx>
      </Pop>
    </Sheet>
  );
};

// 4. Занял миллион, отдал пять семьсот.
export const A4: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.a4.give}>
      <Head lines={['ВЗЯЛ 1 МЛН,', 'ОТДАЛ 5,7 МЛН']} t={t} />
      <Ground />
      <Pop x={260} y={G} t={t} at={T.a4.take}><Bag x={260} y={G} s={1.5} label="1 МЛН" /></Pop>
      <Pop x={770} y={G} t={t} at={T.a4.give}><Bag x={770} y={G} s={2.9} dark label="5,7 МЛН" ls={46} /></Pop>
      <Arrow a={{ x: 360, y: 1130 }} b={{ x: 580, y: 1130 }} t={t} at={T.a4.take + 6} n={12} bend={-0.3} />
    </Sheet>
  );
};

// 5. Одна хата тебе, остальное банку.
export const A5: React.FC = () => {
  const t = useCurrentFrame();
  const x0 = T.a5.x;
  return (
    <Sheet hit={x0}>
      <Head lines={['ОДНА — ТЕБЕ,', 'ПЯТЬ — БАНКУ']} t={t} />
      <Ground />
      <Bank x={540} y={G} s={2.1} />
      {Array.from({ length: 6 }, (_, i) => {
        const x = 150 + i * 156;
        const k = clamp((t - x0 - i) / 12);
        const y = i === 0 ? 800 : lerp(800, 1330, easeOut(k));
        const xx = i === 0 ? x : lerp(x, 540 + (i - 3) * 50, easeOut(k));
        return (
          <g key={i} opacity={i === 0 ? 1 : 1 - clamp((t - x0 - 14) / 6)}>
            <House x={xx} y={y} s={0.74} />
            {i > 0 && t >= x0 + i && k < 0.3 && <Draw t={t} at={x0 + i} n={5} strokeWidth={8} d={`M${x - 50} ${y - 130} L${x + 50} ${y - 10} M${x + 50} ${y - 130} L${x - 50} ${y - 10}`} />}
          </g>
        );
      })}
      <Tx x={150} y={880} size={60} bold={1.2}>ТЕБЕ</Tx>
    </Sheet>
  );
};

// 6. Банк скажет спасибо один раз, в эсэмэс.
export const A6: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.a6.once}>
      <Head lines={['БАНК СКАЖЕТ', 'СПАСИБО']} t={t} />
      <rect x={300} y={460} width={480} height={880} rx={64} fill={PAPER} strokeWidth={6} />
      <path d="M300 560 H780" strokeWidth={4} />
      <Tx x={540} y={530} size={46} bold={1}>SMS · БАНК</Tx>
      <Pop x={540} y={760} t={t} at={T.a6.msg}>
        <rect x={340} y={650} width={400} height={170} rx={36} fill={PAPER} strokeWidth={4} />
        <Tx x={540} y={760} size={78} bold={1.4}>Спасибо!</Tx>
      </Pop>
      <Ground />
      <Bank x={170} y={G} s={0.9} />
      <Man x={880} y={G} s={1.2} mouth="flat" eyes="up" brow="sad" la={[-40, 60]} ra={[30, -60]} seed={3} />
      <Stamp x={540} y={1130} text="1 РАЗ" t={t} at={T.a6.once} size={120} />
    </Sheet>
  );
};

// 7. Батя брал кооператив: 1962 год, полпроцента.
export const A7: React.FC = () => {
  const t = useCurrentFrame();
  const k = clamp((t - T.a7.yr) / 16);
  const yr = k <= 0 ? 1956 : Math.min(1962, 1956 + Math.floor(k * 7));
  return (
    <Sheet hit={T.a7.pct}>
      <Head lines={['КООПЕРАТИВ']} t={t} />
      <Pop x={330} y={800} t={t} at={4}>
        <rect x={80} y={420} width={500} height={540} fill={PAPER} strokeWidth={6} />
        <rect x={80} y={420} width={500} height={110} fill={INK} />
        <Tx x={330} y={500} size={66} fill={PAPER} bold={1.2}>ГОД</Tx>
        {[0, 1, 2, 3].map((i) => <circle key={i} cx={150 + i * 120} cy={420} r={12} fill={PAPER} />)}
        <Tx x={330} y={790} size={190} bold={3}>{yr}</Tx>
      </Pop>
      <Stamp x={700} y={1100} text="0,5 % В ГОД" t={t} at={T.a7.pct} size={92} />
      <Ground />
      <Batya x={850} s={1.5} la={[-30, 60]} ra={[56, -44]} />
      <Key x={980} y={G - 300} s={0.7} rot={-20} />
    </Sheet>
  );
};

// 8. Переплата четыре процента.
export const A8: React.FC = () => {
  const t = useCurrentFrame();
  const g = easeOut(clamp(t / 22));
  return (
    <Sheet hit={T.a8.stamp}>
      <Head lines={['ПЕРЕПЛАТА БАТИ:', '4 %']} t={t} />
      <Ground />
      <rect x={160} y={G - 127 * g} width={280} height={127 * g} fill={PAPER} strokeWidth={5} />
      <rect x={600} y={G - 700 * g} width={280} height={700 * g} fill={INK} strokeWidth={5} />
      <Tx x={300} y={G + 70} size={54} bold={1}>БАТЯ</Tx>
      <Tx x={740} y={G + 70} size={54} bold={1}>ТЫ</Tx>
      {g > 0.9 && (
        <g>
          <Tx x={300} y={G - 170} size={96} bold={2}>×1,04</Tx>
          <Tx x={740} y={G - 740} size={96} bold={2}>×5,72</Tx>
        </g>
      )}
      <Stamp x={380} y={900} text="+4 %" t={t} at={T.a8.stamp} size={130} />
    </Sheet>
  );
};

// 9. Он стоял в очереди.
export const A9: React.FC = () => {
  const t = useCurrentFrame();
  const xs = [90, 240, 390, 540, 690];
  return (
    <Sheet>
      <Head lines={['ОН СТОЯЛ', 'В ОЧЕРЕДИ']} t={t} />
      <Ground />
      <g>
        <rect x={780} y={G - 380} width={260} height={380} fill={PAPER} strokeWidth={5} />
        <rect x={840} y={G - 190} width={80} height={190} fill={PAPER} />
        <path d="M770 -0" />
        <rect x={780} y={G - 450} width={260} height={74} fill={INK} />
        <Tx x={910} y={G - 394} size={56} fill={PAPER} bold={1}>ЖСК</Tx>
      </g>
      {xs.map((x, i) => (
        <Man key={x} x={x} y={G} s={1.0} flip mouth="flat" eyes={i % 2 ? 'up' : 'dots'} seed={i} la={[-26, 70]} ra={[26, 70]} bob />
      ))}
      <Batya x={690} s={1.0} />
      <Tx x={690} y={G - 330} size={50}>батя</Tx>
    </Sheet>
  );
};

// 10. Ты тоже стоишь: очередь в банк на тридцать лет.
export const A10: React.FC = () => {
  const t = useCurrentFrame();
  const rows = [{ y: 880, flip: false }, { y: 1230, flip: true }, { y: 1580, flip: false }];
  return (
    <Sheet hit={T.a10.yrs}>
      <Head lines={['ТЫ ТОЖЕ СТОИШЬ']} t={t} />
      <Bank x={890} y={640} s={0.8} />
      {rows.map((r, ri) => (
        <g key={ri}>
          {Array.from({ length: 7 }, (_, i) => {
            const x = r.flip ? 960 - i * 135 : 90 + i * 135;
            return <Man key={i} x={x} y={r.y} s={0.62} flip={!r.flip} mouth="flat" eyes="dots" seed={i + ri * 7} la={[-24, 66]} ra={[24, 66]} bob />;
          })}
          <path d={`M30 ${r.y + 8} H1050`} strokeWidth={3} />
        </g>
      ))}
      <Stamp x={540} y={440} text="30 ЛЕТ" t={t} at={T.a10.yrs} size={96} />
    </Sheet>
  );
};

// 11. «Надо было раньше думать»: батя у телевизора.
export const A11: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.a11.bub}>
      <Head lines={['НАДО БЫЛО', 'РАНЬШЕ ДУМАТЬ']} t={t} />
      <Ground />
      <rect x={640} y={G - 330} width={340} height={260} rx={24} fill={PAPER} strokeWidth={6} />
      <rect x={668} y={G - 304} width={284} height={208} rx={14} fill={INK} />
      {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M668 ${G - 300 + ((i * 36 + t * 3) % 208)} h284`} stroke={PAPER} strokeWidth={3} />)}
      <path d={`M780 ${G - 330} L720 ${G - 430} M840 ${G - 330} L900 ${G - 430}`} strokeWidth={5} />
      <path d={`M700 ${G - 70} v70 M920 ${G - 70} v70`} strokeWidth={8} />
      <Batya x={310} s={1.8} mouth="open" la={[-40, 40]} ra={[34, -100]} />
      <Pop x={540} y={860} t={t} at={T.a11.bub}>
        <Bubble x={110} y={470} w={860} h={200} tx={340} />
        <Tx x={540} y={565} size={70} bold={1}>надо было</Tx>
        <Tx x={540} y={644} size={70} bold={1}>раньше думать</Tx>
      </Pop>
    </Sheet>
  );
};

// 12. Батя купил одну, ты купил шесть.
export const A12: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.a12.r}>
      <Head lines={['БАТЯ: ОДНА', 'ТЫ: ШЕСТЬ']} t={t} />
      <path d={`M540 440 V${G}`} strokeWidth={5} strokeDasharray="18 14" />
      <Ground />
      <Batya x={270} s={1.3} />
      <Pop x={270} y={900} t={t} at={T.a12.l}><House x={270} y={1000} s={1.7} /></Pop>
      <Man x={810} y={G} s={1.3} mouth="o" eyes="wide" brow="sad" seed={5} la={[-30, 60]} ra={[30, 60]} />
      {Array.from({ length: 6 }, (_, i) => {
        const x = 650 + (i % 3) * 140;
        const y = 760 + Math.floor(i / 3) * 190;
        return <Pop key={i} x={x} y={y} t={t} at={T.a12.r + i * 3} n={7}><House x={x} y={y} s={0.9} /></Pop>;
      })}
    </Sheet>
  );
};

// 13. Живёшь в одной: штамп и плашка «дальше».
export const A13: React.FC = () => {
  const t = useCurrentFrame();
  const at = T.a13.stamp;
  return (
    <Sheet hit={at}>
      <Head lines={['ЖИВЁШЬ В ОДНОЙ']} t={t} />
      <Ground />
      {[0, 1, 2, 3, 4].map((i) => <House key={i} x={150 + i * 195} y={900} s={0.95} ghost />)}
      <House x={540} y={G} s={2.0} />
      <Man x={210} y={G} s={1.5} mouth="flat" eyes="up" brow="sad" la={[-40, 40]} ra={[40, 40]} seed={2} />
      <Stamp x={540} y={800} text="НАЕБАЛИ №5" t={t} at={at} size={112} />
      {t >= at + 8 && (
        <Pop x={540} y={1030} t={t} at={at + 8}>
          <rect x={150} y={970} width={780} height={120} fill={PAPER} strokeWidth={6} />
          <Tx x={540} y={1052} size={64} bold={1.2}>ДАЛЬШЕ: ТВОЙ ИНДЕКС</Tx>
        </Pop>
      )}
    </Sheet>
  );
};
