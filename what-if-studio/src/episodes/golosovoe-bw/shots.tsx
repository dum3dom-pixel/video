import React from 'react';
import { useCurrentFrame } from 'remotion';
import { clamp, easeOut, lerp } from '../../engine/anim';
import { INK, PAPER } from '../../lines/kit';
import { Confetti, Draw, G, Ground, Head, Man, Pop, Sheet, Stamp, Tx } from '../piter-bw/shots';
import { T } from './timing';

// «Голосовое на четыре минуты»: вертикальный ЧБ 1080×1920. Моменты внутри плана (кадры от начала плана) лежат в timing.ts
// и собираются скриптом из best_words.json: (время слова − начало плана) × 30.

/** Голосовое сообщение: пузырь с кнопкой «play», дорожкой и временем. Дорожка шевелится. */
export const VoiceBubble: React.FC<{ x: number; y: number; w?: number; t: number; time?: string; tail?: 'l' | 'r'; live?: boolean }> = ({
  x, y, w = 700, t, time = '4:00', tail = 'l', live = true,
}) => {
  const n = Math.max(6, Math.floor((w - 260) / 20));
  const sx = tail === 'l' ? -1 : 1;
  return (
    <g transform={`translate(${x} ${y})`} strokeWidth={5}>
      <rect x={-w / 2} y={-80} width={w} height={160} rx={50} fill={PAPER} />
      <path d={`M${sx * (w / 2 - 70)} 78 L${sx * (w / 2 + 6)} 128 L${sx * (w / 2 - 20)} 70`} fill={PAPER} />
      <circle cx={-w / 2 + 84} cy={0} r={46} fill={INK} />
      <path d={`M${-w / 2 + 72} -24 L${-w / 2 + 72} 24 L${-w / 2 + 108} 0 Z`} fill={PAPER} stroke="none" />
      {Array.from({ length: n }, (_, i) => {
        const base = 14 + Math.abs(Math.sin(i * 1.7) * 30) + Math.abs(Math.sin(i * 0.43) * 14);
        const h = live ? base * (0.78 + 0.22 * Math.sin(t / 3 + i * 0.8)) : base;
        const px = -w / 2 + 160 + i * ((w - 360) / n);
        return <path key={i} d={`M${px} ${-h} V${h}`} strokeWidth={6} strokeLinecap="round" />;
      })}
      <Tx x={w / 2 - 70} y={16} size={46} bold={1}>{time}</Tx>
    </g>
  );
};

/** Микрофон: капсула, дужка, стойка. */
const Mic: React.FC<{ x: number; y: number; s?: number; fill?: string }> = ({ x, y, s = 1, fill = INK }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} strokeWidth={6 / s} fill="none">
    <rect x={-34} y={-110} width={68} height={120} rx={34} fill={fill} stroke={fill === INK ? PAPER : INK} />
    <path d="M-62 -40 Q-62 34 0 34 Q62 34 62 -40" stroke={fill === INK ? PAPER : INK} />
    <path d="M0 34 V74 M-34 74 H34" stroke={fill === INK ? PAPER : INK} />
  </g>
);

/** Круглая кнопка записи с микрофоном внутри. */
export const RecButton: React.FC<{ x: number; y: number; r?: number; press?: number }> = ({ x, y, r = 130, press = 0 }) => {
  const k = 1 - press * 0.1;
  return (
    <g transform={`translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})`}>
      <circle cx={x} cy={y} r={r} fill={INK} strokeWidth={6} />
      <circle cx={x} cy={y} r={r - 14} stroke={PAPER} strokeWidth={3} fill="none" />
      <Mic x={x} y={y + 14} s={r / 190} />
    </g>
  );
};

/** Облако-мысль: круги по дуге и два пузырька к голове. */
const Thought: React.FC<{ x: number; y: number; w?: number; h?: number }> = ({ x, y, w = 760, h = 300 }) => (
  <g strokeWidth={5}>
    <ellipse cx={x} cy={y} rx={w / 2} ry={h / 2} fill={PAPER} />
    {[-0.34, -0.1, 0.18, 0.4].map((k, i) => <circle key={i} cx={x + k * w} cy={y + (i % 2 ? h / 2 - 8 : -h / 2 + 8)} r={h / 3.2} fill={PAPER} stroke="none" />)}
    <circle cx={x - w * 0.22} cy={y + h / 2 + 52} r={22} fill={PAPER} />
    <circle cx={x - w * 0.28} cy={y + h / 2 + 108} r={12} fill={PAPER} />
  </g>
);

// 1. Тебе прислали голосовое на четыре минуты.
export const S1: React.FC = () => {
  const t = useCurrentFrame();
  const slide = easeOut(clamp((t - T.p1.bubble) / 12));
  return (
    <Sheet hit={T.p1.stamp}>
      <Head lines={['ГОЛОСОВОЕ', 'НА ЧЕТЫРЕ МИНУТЫ']} t={t} />
      <Ground />
      <Man x={300} y={G} s={1.7} mouth="flat" eyes="up" brow="sad" la={[-26, 70]} ra={[26, 70]} seed={2} bob />
      {t >= T.p1.bubble && (
        <g transform={`translate(${lerp(500, 0, slide)} 0)`} opacity={slide}>
          <VoiceBubble x={540} y={820} w={780} t={t} time={t >= T.p1.four ? '4:00' : '0:00'} />
        </g>
      )}
      <Pop x={540} y={560} t={t} at={T.p1.bubble + 6} n={9}>
        <path d="M470 560 l-34 -34 M540 540 v-50 M610 560 l34 -34" strokeWidth={7} strokeLinecap="round" />
      </Pop>
      <Stamp x={600} y={1090} text="4:00" t={t} at={T.p1.stamp} size={120} />
    </Sheet>
  );
};

// 2. И ты, блядь, уже знаешь, что там будет.
export const S2: React.FC = () => {
  const t = useCurrentFrame();
  const p = easeOut(clamp((t - T.p2.cloud) / 14));
  return (
    <Sheet>
      <Head lines={['ТЫ УЖЕ ЗНАЕШЬ']} t={t} />
      <Ground />
      <Man x={330} y={G} s={1.8} mouth="flat" eyes="up" brow="raised" la={[-26, 70]} ra={[30, 40]} seed={4} bob />
      <Pop x={620} y={760} t={t} at={T.p2.know} n={12}>
        <Thought x={640} y={800} w={800} h={330} />
        <Tx x={640} y={770} size={72} bold={1.2}>«Короче, слушай…»</Tx>
        <Tx x={640} y={870} size={60} bold={1}>ну и дальше</Tx>
      </Pop>
      {t >= T.p2.cloud && (
        <g opacity={p}>
          {Array.from({ length: 6 }, (_, i) => (
            <path key={i} d={`M${580 + i * 62} 1230 q16 ${-24 - (i % 3) * 14} 32 0`} strokeWidth={5} fill="none" />
          ))}
          <Tx x={770} y={1330} size={64} bold={1}>бла-бла-бла-бла</Tx>
        </g>
      )}
    </Sheet>
  );
};

// 3. Это не сообщение. Это моноспектакль.
export const S3: React.FC = () => {
  const t = useCurrentFrame();
  const open = easeOut(clamp((t - T.p3.mono) / 18));
  const strike = clamp((t - T.p3.msg) / 8);
  return (
    <Sheet hit={T.p3.mono}>
      <Head lines={['МОНОСПЕКТАКЛЬ']} t={t} />
      <Pop x={540} y={500} t={t} at={T.p3.no - 4}>
        <Tx x={540} y={530} size={92} bold={1.6}>сообщение</Tx>
        {strike > 0 && <path d={`M300 ${505} H${300 + 480 * strike}`} strokeWidth={10} />}
      </Pop>
      <g strokeWidth={5}>
        <rect x={150} y={640} width={780} height={760} fill={PAPER} />
        <rect x={190} y={680} width={700} height={680} fill={open > 0.05 ? PAPER : INK} />
        {open > 0.05 && <path d="M540 680 L410 1360 H670 Z" fill={PAPER} strokeDasharray="14 12" />}
      </g>
      {/* занавес раздвигается */}
      <path d={`M190 680 H${lerp(540, 250, open)} Q${lerp(540, 270, open) + 30} 1020 ${lerp(540, 220, open)} 1360 H190 Z`} fill={INK} />
      <path d={`M890 680 H${lerp(540, 830, open)} Q${lerp(540, 810, open) - 30} 1020 ${lerp(540, 860, open)} 1360 H890 Z`} fill={INK} />
      {open > 0.4 && (
        <g>
          <Man x={540} y={1360} s={1.15} mouth="open" eyes="wide" brow="raised" la={[-80, -40]} ra={[80, -40]} seed={6} bob />
          <Pop x={540} y={1120} t={t} at={T.p3.mono + 12} n={7}>
            <path d="M420 1140 q-30 -30 0 -60 M660 1140 q30 -30 0 -60" strokeWidth={6} fill="none" />
          </Pop>
        </g>
      )}
      <Ground />
      <Man x={230} y={G} s={0.95} flip mouth="flat" eyes="up" seed={8} />
      <Man x={850} y={G} s={0.95} mouth="flat" eyes="closed" seed={9} />
      <Stamp x={540} y={1480} text="ОДИН АКТЁР" t={t} at={T.p3.mono + 22} size={74} />
    </Sheet>
  );
};

// 4. Кнопку записи в Вотсап добавили в августе 2013-го.
export const S4: React.FC = () => {
  const t = useCurrentFrame();
  const year = Math.round(lerp(2003, 2013, easeOut(clamp((t - T.p4.year) / 22))));
  return (
    <Sheet hit={T.p4.year + 22}>
      <Head lines={['АВГУСТ 2013']} t={t} />
      <g transform="translate(540 700)">
        <rect x={-270} y={-190} width={540} height={400} fill={PAPER} strokeWidth={5} />
        <rect x={-270} y={-190} width={540} height={96} fill={INK} />
        <Tx x={0} y={-120} size={62} fill={PAPER} bold={1}>АВГУСТ</Tx>
        {[-170, 170].map((rx) => <path key={rx} d={`M${rx} -214 v52`} strokeWidth={10} />)}
        <Tx x={0} y={110} size={210} bold={2}>{year}</Tx>
      </g>
      <Pop x={540} y={1210} t={t} at={T.p4.btn} n={10}>
        <RecButton x={540} y={1210} r={150} press={clamp((t - T.p4.year) / 6) * (t < T.p4.year + 12 ? 1 : 0)} />
        <Tx x={540} y={1440} size={62} bold={1}>новая кнопка</Tx>
      </Pop>
      <Ground />
    </Sheet>
  );
};

// 5. С тех пор жить стало веселее. И дольше.
export const S5: React.FC = () => {
  const t = useCurrentFrame();
  const jump = Math.abs(Math.sin(t / 5)) * 90;
  const w = lerp(420, 900, easeOut(clamp((t - T.p5.long) / 26)));
  return (
    <Sheet hit={T.p5.conf}>
      <Head lines={['ВЕСЕЛЕЕ.', 'И ДОЛЬШЕ']} t={t} />
      <Confetti t={t} at={T.p5.conf} top={520} n={44} />
      <Man x={540} y={G - jump} s={1.6} mouth="grin" eyes="wide" la={[-70, -70]} ra={[70, -70]} seed={5} />
      <Ground />
      <VoiceBubble x={540} y={720} w={w} t={t} time={t >= T.p5.long ? '4:00' : '0:30'} live />
    </Sheet>
  );
};

// 6. Вот Макс. Он хотел написать «ок».
export const S6: React.FC = () => {
  const t = useCurrentFrame();
  const typed = t >= T.p6.ok ? 'ок' : t >= T.p6.ok - 8 ? 'о' : '';
  return (
    <Sheet>
      <Head lines={['ВОТ МАКС']} t={t} />
      <Ground />
      <Man x={330} y={G} s={1.75} mouth="smile" eyes="dots" hair="tuft" la={[-26, 70]} ra={[70, -50]} seed={7} bob />
      <Pop x={820} y={440} t={t} at={T.p6.name} n={9}>
        <Tx x={820} y={450} size={96} bold={2}>МАКС</Tx>
        <path d="M720 500 Q660 540 620 580 M648 530 L618 584 L670 570" strokeWidth={6} fill="none" />
      </Pop>
      <g strokeWidth={5}>
        <rect x={140} y={640} width={800} height={130} rx={36} fill={PAPER} />
        <Tx x={190} y={726} size={66} bold={1} anchor="start">{typed}</Tx>
        {t % 20 < 12 && <path d={`M${190 + typed.length * 36 + 6} 674 V736`} strokeWidth={6} />}
      </g>
      <Pop x={540} y={860} t={t} at={T.p6.ok} n={8}>
        <Tx x={540} y={880} size={70} bold={1.2}>просто «ок»</Tx>
      </Pop>
    </Sheet>
  );
};

// 7. Но нажал на микрофон, сука.
export const S7: React.FC = () => {
  const t = useCurrentFrame();
  const pr = clamp((t - T.p7.press) / 4) * (t < T.p7.press + 10 ? 1 : 0.4);
  const ring = clamp((t - T.p7.press) / 30);
  return (
    <Sheet hit={T.p7.press}>
      <Head lines={['НАЖАЛ НА МИКРОФОН']} t={t} />
      <Ground />
      <Man x={250} y={G} s={1.5} mouth="o" eyes="wide" brow="sad" la={[-26, 70]} ra={[110, -150]} seed={7} />
      {t >= T.p7.press && [0, 1, 2].map((i) => {
        const k = clamp(ring - i * 0.18);
        return k > 0 ? <circle key={i} cx={640} cy={950} r={150 + k * 330} strokeWidth={5} opacity={1 - k} fill="none" /> : null;
      })}
      <RecButton x={640} y={950} r={170} press={pr} />
      <Stamp x={700} y={1330} text="ИДЁТ ЗАПИСЬ" t={t} at={T.p7.stamp} size={92} />
    </Sheet>
  );
};
