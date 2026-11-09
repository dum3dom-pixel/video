import React from 'react';
import { useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut, lerp } from '../../engine/anim';
import { INK, PAPER } from '../../lines/kit';
import { Draw, G, Ground, Head, Man, Pop, Sheet, Specs, Stamp, Tx } from '../piter-bw/shots';
import { Bubble, Plates } from './shots';
import { T } from './timing';

// Сцены 8–31 «Ссоры». Моменты внутри плана (кадры от начала плана) лежат в timing.ts.

const Heart: React.FC<{ x: number; y: number; s?: number; fill?: string }> = ({ x, y, s = 1, fill = PAPER }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 40 C-70 -10 -60 -70 -25 -70 C-10 -70 0 -55 0 -48 C0 -55 10 -70 25 -70 C60 -70 70 -10 0 40 Z" fill={fill} strokeWidth={5 / s} />
);

const Cloud: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M-100 50 C-150 50 -150 -10 -90 -10 C-90 -70 0 -80 30 -35 C80 -70 150 -30 120 20 C170 20 160 50 110 50 Z" fill={PAPER} strokeWidth={5 / s} />
);

const Bolt: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M10 0 L-30 70 L-2 70 L-20 130 L40 50 L12 50 L36 0 Z" fill={INK} strokeWidth={3 / s} />
);

const Cross: React.FC<{ x: number; y: number; r: number; t: number; at: number }> = ({ x, y, r, t, at }) => (
  <>
    <Draw t={t} at={at} n={8} strokeWidth={14} d={`M${x - r} ${y - r} L${x + r} ${y + r}`} />
    <Draw t={t} at={at + 4} n={8} strokeWidth={14} d={`M${x + r} ${y - r} L${x - r} ${y + r}`} />
  </>
);

// 8. Лена слышит в этом: тебе плевать.
export const S8: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.p8.say}>
      <Head lines={['ТЕБЕ ПЛЕВАТЬ?']} t={t} />
      <Ground />
      <Man x={250} y={G} s={1.4} mouth="flat" eyes="up" hair="tuft" la={[-26, 70]} ra={[60, 70]} seed={8} bob />
      <Man x={790} y={G} s={1.9} flip mouth="flat" eyes="wide" brow="sad" la={[-26, 70]} ra={[40, 40]} seed={9} bob />
      <Pop x={640} y={820} t={t} at={T.p8.say}>
        <Bubble x={640} y={820} w={560} h={190} tail={1}>
          <Tx x={640} y={846} size={72} bold={1.4}>ему плевать</Tx>
        </Bubble>
      </Pop>
    </Sheet>
  );
};

// 9. И давит: «Скажи хоть что-нибудь!»
export const S9: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.p9.say}>
      <Head lines={['ЛЕНА ДАВИТ']} t={t} />
      <Ground />
      <Man x={190} y={G} s={1.3} mouth="flat" eyes="up" hair="tuft" la={[-26, 70]} ra={[26, 70]} seed={8} />
      <Man x={760} y={G} s={1.9} flip mouth="open" eyes="wide" brow="angry" la={[-40, -70]} ra={[50, -60]} seed={9} bob />
      <Pop x={520} y={780} t={t} at={T.p9.say}>
        <Bubble x={520} y={800} w={700} h={270} tail={1}>
          <Tx x={520} y={790} size={84} bold={1.8}>Скажи хоть</Tx>
          <Tx x={520} y={890} size={84} bold={1.8}>что-нибудь!</Tx>
        </Bubble>
      </Pop>
      <Draw t={t} at={T.p9.say + 4} n={8} strokeWidth={7} d="M900 1010 l70 -34 M920 1070 l80 0 M900 1130 l70 34" />
    </Sheet>
  );
};

// 10. А Артём слышит другое: сейчас будет хуже.
export const S10: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.p10.th + 12}>
      <Head lines={['СЕЙЧАС БУДЕТ ХУЖЕ']} t={t} />
      <Ground />
      <Man x={540} y={G} s={1.8} mouth="o" eyes="wide" brow="sad" hair="tuft" la={[-40, 20]} ra={[40, 20]} seed={8} bob />
      <Pop x={540} y={760} t={t} at={T.p10.th}>
        <Cloud x={540} y={760} s={2.1} />
      </Pop>
      <Pop x={420} y={880} t={t} at={T.p10.th + 8}><Bolt x={410} y={830} s={1.4} /></Pop>
      <Pop x={660} y={880} t={t} at={T.p10.th + 14}><Bolt x={650} y={830} s={1.4} /></Pop>
    </Sheet>
  );
};

// 11. И замолкает, ещё глубже: человечек сжимается.
export const S11: React.FC = () => {
  const t = useCurrentFrame();
  const k = easeOut(clamp((t - T.p11.sink) / 50));
  return (
    <Sheet>
      <Head lines={['ЗАМОЛКАЕТ ГЛУБЖЕ']} t={t} />
      <Ground />
      <Man x={440} y={G} s={lerp(1.9, 1.0, k)} mouth="flat" eyes="up" hair="tuft" la={[-26, 70]} ra={[26, 70]} seed={8} bob />
      <Draw t={t} at={T.p11.sink} n={14} strokeWidth={10} d="M860 720 V1120 M800 1060 L860 1120 L920 1060" />
      <Pop x={860} y={650} t={t} at={T.p11.sink + 6}>
        <Tx x={860} y={650} size={70} bold={1.4}>глубже</Tx>
      </Pop>
    </Sheet>
  );
};

// 12. Чем громче она, тем тише он.
export const S12: React.FC = () => {
  const t = useCurrentFrame();
  const g = clamp(t / 70);
  const grow = lerp(0.6, 1.5, easeOut(g));
  return (
    <Sheet>
      <Head lines={['ЧЕМ ГРОМЧЕ — ТЕМ ТИШЕ']} t={t} />
      <Ground />
      <Man x={230} y={G} s={1.5} mouth="open" eyes="wide" brow="angry" la={[-40, -70]} ra={[40, -70]} seed={9} bob />
      <Man x={830} y={G} s={lerp(1.7, 0.9, easeOut(g))} flip mouth="flat" eyes="up" hair="tuft" la={[-26, 70]} ra={[-26, 70]} seed={8} />
      <g transform={`translate(380 780) scale(${grow}) translate(-380 -780)`}>
        <Bubble x={380} y={780} w={300} h={140} tail={-1}>
          <Tx x={380} y={815} size={90} bold={2}>!!!</Tx>
        </Bubble>
      </g>
      <Pop x={230} y={1080} t={t} at={T.p12.up}><Tx x={230} y={1085} size={62} bold={1.4}>ГРОМЧЕ</Tx></Pop>
      <Pop x={830} y={1150} t={t} at={T.p12.dn}><Tx x={830} y={1150} size={62} bold={1.4}>ТИШЕ</Tx></Pop>
    </Sheet>
  );
};

// 13. Через десять минут про тарелки никто не помнит.
export const S13: React.FC = () => {
  const t = useCurrentFrame();
  const ang = ((Math.max(0, t - T.p13.cl) * 9) * Math.PI) / 180;
  const fade = lerp(1, 0.15, easeOut(clamp((t - T.p13.fg) / 20)));
  return (
    <Sheet>
      <Head lines={['ПРО ТАРЕЛКИ ЗАБЫЛИ']} t={t} />
      <Pop x={290} y={860} t={t} at={T.p13.cl - 6}>
        <circle cx={290} cy={860} r={160} fill={PAPER} strokeWidth={7} />
        {Array.from({ length: 12 }, (_, i) => {
          const b = (i * 30 * Math.PI) / 180;
          return <path key={i} d={`M${290 + Math.sin(b) * 145} ${860 - Math.cos(b) * 145} L${290 + Math.sin(b) * 125} ${860 - Math.cos(b) * 125}`} strokeWidth={5} />;
        })}
        <path d={`M290 860 L${290 + Math.sin(ang) * 115} ${860 - Math.cos(ang) * 115}`} strokeWidth={10} />
        <circle cx={290} cy={860} r={11} fill={INK} />
        <Tx x={290} y={1100} size={76} bold={1.6}>10 минут</Tx>
      </Pop>
      <Ground />
      <g opacity={fade}>
        <Plates x={780} y={G - 6} n={8} s={1.2} />
      </g>
      <Pop x={780} y={1000} t={t} at={T.p13.fg}>
        <Tx x={780} y={1020} size={260} bold={3}>?</Tx>
      </Pop>
    </Sheet>
  );
};

// 14. Они ссорятся из-за того, как каждый ссорится.
export const S14: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.p14.st}>
      <Head lines={['ССОРА ПРО ССОРУ']} t={t} />
      <Ground />
      <Man x={240} y={G} s={1.6} mouth="open" eyes="wide" brow="angry" la={[-26, 70]} ra={[70, -30]} seed={9} bob />
      <Man x={840} y={G} s={1.6} flip mouth="flat" eyes="up" brow="angry" la={[-26, 70]} ra={[70, -30]} seed={8} bob />
      <Draw t={t} at={2} n={18} strokeWidth={9} d="M360 1000 Q540 880 720 1000 M690 960 L720 1000 L675 1020" />
      <Draw t={t} at={14} n={18} strokeWidth={9} d="M720 1180 Q540 1300 360 1180 M390 1220 L360 1180 L405 1160" />
      <Stamp x={540} y={1090} text="КАК ССОРИМСЯ" t={t} at={T.p14.st} size={58} />
    </Sheet>
  );
};

// 15. Оба хотят как лучше: сердца над головами.
export const S15: React.FC = () => {
  const t = useCurrentFrame();
  const beat = 1 + Math.abs(Math.sin(t / 6)) * 0.12;
  return (
    <Sheet>
      <Head lines={['ОБА ХОТЯТ ОДНОГО']} t={t} />
      <Ground />
      <Man x={270} y={G} s={1.6} mouth="flat" eyes="up" brow="sad" la={[-26, 70]} ra={[26, 70]} seed={9} bob />
      <Man x={810} y={G} s={1.6} flip mouth="flat" eyes="up" brow="sad" hair="tuft" la={[-26, 70]} ra={[26, 70]} seed={8} bob />
      <Pop x={270} y={1000} t={t} at={T.p15.h}><Heart x={270} y={1000} s={1.8 * beat} /></Pop>
      <Pop x={810} y={1000} t={t} at={T.p15.h + 6}><Heart x={810} y={1000} s={1.8 * beat} /></Pop>
      <Stamp x={540} y={720} text="ЧТОБЫ ИХ ПОНЯЛИ" t={t} at={T.p15.u} size={72} />
    </Sheet>
  );
};

// 16. Лена давит, чтобы не потерять. Артём молчит, чтобы не наговорить.
export const S16: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['ДВЕ ПРИЧИНЫ']} t={t} />
      <Ground />
      <Man x={230} y={G} s={1.7} mouth="open" eyes="wide" brow="sad" la={[-26, 70]} ra={[100, -20]} seed={9} bob />
      <Man x={830} y={G} s={1.7} flip mouth="flat" eyes="up" hair="tuft" la={[-26, 70]} ra={[26, 70]} seed={8} bob />
      <Pop x={520} y={1230} t={t} at={T.p16.a}><Heart x={540} y={1230} s={0.8} /></Pop>
      <Pop x={230} y={1020} t={t} at={T.p16.a}>
        <Tx x={250} y={1030} size={56} bold={1.4}>не потерять</Tx>
      </Pop>
      <Pop x={760} y={900} t={t} at={T.p16.b - 14}>
        <Bubble x={760} y={880} w={320} h={140} tail={1}>
          <Tx x={760} y={915} size={90} bold={2}>...</Tx>
        </Bubble>
      </Pop>
      <Cross x={760} y={880} r={70} t={t} at={T.p16.b} />
      <Pop x={830} y={1020} t={t} at={T.p16.b}>
        <Tx x={820} y={1030} size={52} bold={1.4}>не наговорить</Tx>
      </Pop>
    </Sheet>
  );
};

// 17. Давит обычно тот, кто поднял тему.
export const S17: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['ДАВИТ ТОТ,', 'КТО ПОДНЯЛ ТЕМУ']} t={t} />
      <Ground />
      <Man x={290} y={G} s={1.8} mouth="open" eyes="wide" brow="angry" la={[-26, 70]} ra={[60, -60]} seed={9} bob />
      <Man x={830} y={G} s={1.5} flip mouth="flat" eyes="up" hair="tuft" la={[-26, 70]} ra={[-26, 70]} seed={8} bob />
      <Pop x={520} y={1130} t={t} at={T.p17.th}>
        <rect x={400} y={1070} width={240} height={120} fill={PAPER} strokeWidth={6} />
        <Tx x={520} y={1150} size={64} bold={1.6}>ТЕМА</Tx>
      </Pop>
      <Draw t={t} at={T.p17.th + 10} n={12} strokeWidth={9} d="M650 1130 H760 M715 1090 L760 1130 L715 1170" />
    </Sheet>
  );
};

// 18. Роли могут меняться, схема остаётся.
export const S18: React.FC = () => {
  const t = useCurrentFrame();
  const e = easeInOut(clamp((t - T.p18.sw) / 30));
  const swapped = e > 0.5;
  return (
    <Sheet hit={T.p18.st}>
      <Head lines={['РОЛИ МЕНЯЮТСЯ', 'СХЕМА НЕТ']} t={t} />
      <Ground />
      <Man x={lerp(250, 830, e)} y={G} s={1.6} mouth={swapped ? 'flat' : 'open'} eyes={swapped ? 'up' : 'wide'} brow={swapped ? 'none' : 'angry'} la={[-26, 70]} ra={[70, -30]} seed={9} bob />
      <Man x={lerp(830, 250, e)} y={G} s={1.6} flip mouth={swapped ? 'open' : 'flat'} eyes={swapped ? 'wide' : 'up'} brow={swapped ? 'angry' : 'none'} hair="tuft" la={[-26, 70]} ra={[-26, 70]} seed={8} bob />
      <Draw t={t} at={T.p18.sw} n={16} strokeWidth={8} d="M300 1010 Q540 890 780 1010 M740 985 L780 1010 L735 1030" />
      <Draw t={t} at={T.p18.sw + 4} n={16} strokeWidth={8} d="M780 1090 Q540 1210 300 1090 M340 1115 L300 1090 L345 1070" />
      <Stamp x={540} y={820} text="СХЕМА ТА ЖЕ" t={t} at={T.p18.st} size={80} />
    </Sheet>
  );
};

// 19. Родитель: «Нам надо поговорить». Подросток: «Ну что опять?»
export const S19: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['РОДИТЕЛЬ И ПОДРОСТОК']} t={t} />
      <Ground />
      <Man x={230} y={G} s={1.9} mouth="open" eyes="dots" la={[-26, 70]} ra={[50, 20]} seed={9} bob />
      <Man x={800} y={G} s={1.2} flip mouth="flat" eyes="up" hair="tuft" la={[-26, 70]} ra={[-26, 70]} seed={8} bob />
      <Pop x={380} y={800} t={t} at={T.p19.a - 10}>
        <Bubble x={400} y={780} w={600} h={190} tail={-1}>
          <Tx x={400} y={760} size={58} bold={1.2}>Нам надо</Tx>
          <Tx x={400} y={830} size={58} bold={1.2}>поговорить</Tx>
        </Bubble>
      </Pop>
      <Pop x={780} y={1050} t={t} at={T.p19.b - 8}>
        <Bubble x={760} y={1000} w={420} h={150} tail={1}>
          <Tx x={760} y={1035} size={58} bold={1.2}>Ну что опять?</Tx>
        </Bubble>
      </Pop>
    </Sheet>
  );
};

// 20. Подросток уходит в наушники.
export const S20: React.FC = () => {
  const t = useCurrentFrame();
  const s = 1.7;
  const hx = 640;
  const hy = G - 227 * s;
  return (
    <Sheet>
      <Head lines={['УХОДИТ В НАУШНИКИ']} t={t} />
      <Ground />
      <Man x={190} y={G} s={1.5} mouth="open" eyes="dots" la={[-26, 70]} ra={[60, 0]} seed={9} bob />
      <Man x={hx} y={G} s={s} flip mouth="flat" eyes="closed" hair="tuft" la={[-26, 70]} ra={[-26, 70]} seed={8} bob />
      <Pop x={hx} y={hy} t={t} at={T.p20.hp}>
        <path d={`M${hx - 84} ${hy + 6} Q${hx} ${hy - 190} ${hx + 84} ${hy + 6}`} strokeWidth={9} />
        <circle cx={hx - 86} cy={hy + 14} r={30} fill={INK} />
        <circle cx={hx + 86} cy={hy + 14} r={30} fill={INK} />
      </Pop>
    </Sheet>
  );
};

// 21. Знакомо? Ещё бы. Эту связку связывали с недовольством отношениями.
export const S21: React.FC = () => {
  const t = useCurrentFrame();
  const late = t >= T.p21.dn - 10;
  const k = easeOut(clamp((t - T.p21.dn) / 40));
  return (
    <Sheet>
      <Head lines={late ? ['НЕДОВОЛЬСТВО', 'ОТНОШЕНИЯМИ'] : ['ЗНАКОМО?']} t={late ? t - (T.p21.dn - 10) : t} />
      <Ground />
      {!late && (
        <>
          <Man x={540} y={G} s={1.8} mouth="grin" eyes="wide" brow="raised" hair="tuft" la={[-40, -50]} ra={[40, -50]} seed={8} bob />
          <Stamp x={540} y={900} text="ЕЩЁ БЫ" t={t} at={22} size={110} />
        </>
      )}
      {late && (
        <>
          <rect x={200} y={620} width={140} height={700} fill={PAPER} strokeWidth={6} />
          <rect x={200} y={lerp(640, 1180, k)} width={140} height={lerp(680, 140, k)} fill={INK} />
          <Tx x={270} y={1400} size={60} bold={1.2}>довольство</Tx>
          <Draw t={t} at={T.p21.dn} n={20} strokeWidth={10} d="M500 700 L860 1180 M780 1160 L860 1180 L835 1100" />
          <Pop x={760} y={900} t={t} at={T.p21.dn + 10}>
            <Tx x={730} y={840} size={70} bold={1.6}>связь</Tx>
          </Pop>
        </>
      )}
    </Sheet>
  );
};

// 22. Дело не в характере. Дело в схеме.
export const S22: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.p22.sc}>
      <Head lines={['НЕ ХАРАКТЕР, А СХЕМА']} t={t} />
      <Ground />
      <Man x={250} y={G} s={1.6} mouth="flat" eyes="dots" hair="tuft" la={[-26, 70]} ra={[26, 70]} seed={8} bob />
      <Pop x={300} y={800} t={t} at={T.p22.ch - 8}>
        <Tx x={300} y={820} size={84} bold={1.8}>ХАРАКТЕР</Tx>
      </Pop>
      <Cross x={300} y={800} r={60} t={t} at={T.p22.ch} />
      <Draw t={t} at={T.p22.sc} n={14} strokeWidth={9} d="M560 1000 Q700 880 840 1000 M810 960 L840 1000 L795 1015 M840 1060 Q700 1180 560 1060 M590 1100 L560 1060 L605 1045" />
      <Stamp x={700} y={1330} text="СХЕМА" t={t} at={T.p22.sc} size={96} />
    </Sheet>
  );
};

// 23. Психолог Джон Готтман называет это перегрузкой.
export const S23: React.FC = () => {
  const t = useCurrentFrame();
  const k = easeOut(clamp((t - T.p23.ov) / 24));
  const a = lerp(-70, 70, k) * (Math.PI / 180);
  const cx = 770;
  const cy = 980;
  return (
    <Sheet hit={T.p23.ov}>
      <Head lines={['ГОТТМАН: ПЕРЕГРУЗКА']} t={t} />
      <Ground />
      <Man x={270} y={G} s={1.7} mouth="smile" eyes="dots" la={[-26, 70]} ra={[60, 20]} seed={9} bob />
      <Specs x={270} y={G} s={1.7} />
      <Pop x={270} y={1060} t={t} at={T.p23.nm}>
        <Tx x={270} y={1060} size={52} bold={1.4}>ДЖОН ГОТТМАН</Tx>
      </Pop>
      <path d={`M${cx - 190} ${cy} A190 190 0 0 1 ${cx + 190} ${cy} Z`} fill={PAPER} strokeWidth={7} />
      <path d={`M${cx + 70} ${cy - 150} A190 190 0 0 1 ${cx + 190} ${cy} H${cx + 120} A120 120 0 0 0 ${cx + 44} ${cy - 112} Z`} fill={INK} />
      <path d={`M${cx} ${cy} L${cx + Math.sin(a) * 160} ${cy - Math.cos(a) * 160}`} strokeWidth={11} />
      <circle cx={cx} cy={cy} r={16} fill={INK} />
      <Stamp x={cx - 20} y={1180} text="ПЕРЕГРУЗКА" t={t} at={T.p23.ov} size={64} />
    </Sheet>
  );
};

// 24. Когда накрыло, слова не находятся: буквы разлетаются.
export const S24: React.FC = () => {
  const t = useCurrentFrame();
  const letters = ['С', 'Л', 'О', 'В', 'А'];
  return (
    <Sheet>
      <Head lines={['СЛОВА НЕ НАХОДЯТСЯ']} t={t} />
      <Ground />
      <Man x={540} y={G} s={1.9} mouth="o" eyes="wide" brow="sad" la={[-40, 20]} ra={[40, 20]} seed={9} bob />
      {letters.map((c, i) => {
        const u = easeOut(clamp((t - T.p24.w - i * 4) / 40));
        const x = lerp(540, 200 + i * 170, u);
        const y = lerp(900, 520 + (i % 2) * 260, u);
        return (
          <g key={i} opacity={t >= T.p24.w + i * 4 ? 1 : 0}>
            <Tx x={x} y={y} size={120} bold={2.4} rot={(i - 2) * 16 * u}>{c}</Tx>
          </g>
        );
      })}
      <Pop x={540} y={1000} t={t} at={T.p24.w + 22}>
        <Tx x={540} y={1010} size={150} bold={2.6}>?</Tx>
      </Pop>
    </Sheet>
  );
};

// 25. Молчит не тот, кому всё равно: сердце бьётся.
export const S25: React.FC = () => {
  const t = useCurrentFrame();
  const beat = 1 + Math.abs(Math.sin(t / 5)) * 0.18;
  return (
    <Sheet>
      <Head lines={['НЕ ОТ РАВНОДУШИЯ']} t={t} />
      <Ground />
      <Man x={540} y={G} s={1.9} mouth="flat" eyes="up" brow="sad" hair="tuft" la={[-26, 70]} ra={[26, 70]} seed={8} />
      <Pop x={540} y={1330} t={t} at={T.p25.ht}><Heart x={540} y={1340} s={1.5 * beat} fill={INK} /></Pop>
      <Pop x={540} y={760} t={t} at={T.p25.ht - 10}>
        <Tx x={540} y={780} size={80} bold={1.8}>ему не всё равно</Tx>
      </Pop>
    </Sheet>
  );
};

// 26. Молчит тот, кого накрыло.
export const S26: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.p26.st}>
      <Head lines={['ЕГО НАКРЫЛО']} t={t} />
      <Ground />
      <Man x={540} y={G} s={1.6} mouth="o" eyes="wide" brow="sad" hair="tuft" la={[-40, 30]} ra={[40, 30]} seed={8} bob />
      <Cloud x={540} y={560} s={2.2} />
      {Array.from({ length: 6 }, (_, i) => {
        const x = 350 + i * 76;
        const ph = ((t * 7 + i * 41) % 200) / 200;
        const y = 640 + ph * 330;
        return <path key={i} d={`M${x} ${y} l-16 44`} strokeWidth={6} />;
      })}
      <Stamp x={540} y={1010} text="НАКРЫЛО" t={t} at={T.p26.st} size={96} />
    </Sheet>
  );
};

// 27. Перерыв минимум двадцать минут: треть циферблата.
export const S27: React.FC = () => {
  const t = useCurrentFrame();
  const k = easeOut(clamp((t - T.p27.cl) / 30));
  const a = k * 120 * (Math.PI / 180);
  const cx = 540;
  const cy = 900;
  const r = 250;
  const ex = cx + Math.sin(a) * r;
  const ey = cy - Math.cos(a) * r;
  return (
    <Sheet hit={T.p27.cl + 30}>
      <Head lines={['ПЕРЕРЫВ 20 МИНУТ']} t={t} />
      <circle cx={cx} cy={cy} r={r} fill={PAPER} strokeWidth={8} />
      {k > 0 && <path d={`M${cx} ${cy} L${cx} ${cy - r} A${r} ${r} 0 0 1 ${ex} ${ey} Z`} fill={INK} />}
      {Array.from({ length: 12 }, (_, i) => {
        const b = (i * 30 * Math.PI) / 180;
        return <path key={i} d={`M${cx + Math.sin(b) * (r - 6)} ${cy - Math.cos(b) * (r - 6)} L${cx + Math.sin(b) * (r - 30)} ${cy - Math.cos(b) * (r - 30)}`} strokeWidth={6} stroke={i < 4 && k > 0 ? PAPER : INK} />;
      })}
      <circle cx={cx} cy={cy} r={14} fill={PAPER} />
      <Stamp x={540} y={1360} text="20 МИНУТ" t={t} at={T.p27.cl + 14} size={100} />
    </Sheet>
  );
};

// 28. Сказать заранее, что вернёшься. Иначе это не перерыв, а стена.
export const S28: React.FC = () => {
  const t = useCurrentFrame();
  const bricks: string[] = [];
  for (let r = 0; r < 6; r++) for (let c = 0; c < 3; c++) bricks.push(`M${620 + c * 110 + (r % 2) * 55} ${1140 + r * 70} h110 v70 h-110 Z`);
  return (
    <Sheet hit={T.p28.wl}>
      <Head lines={['СКАЖИ, ЧТО ВЕРНЁШЬСЯ']} t={t} />
      <Ground />
      <Man x={260} y={G} s={1.7} mouth="open" eyes="dots" hair="tuft" la={[-26, 70]} ra={[60, -40]} seed={8} bob />
      <Pop x={330} y={800} t={t} at={T.p28.bub}>
        <Bubble x={380} y={820} w={480} h={170} tail={-1}>
          <Tx x={380} y={850} size={78} bold={1.6}>Я вернусь</Tx>
        </Bubble>
      </Pop>
      <Draw t={t} at={T.p28.wl} n={22} strokeWidth={6} d={bricks.join(' ')} />
      <Stamp x={775} y={1000} text="СТЕНА" t={t} at={T.p28.wl + 14} size={88} />
    </Sheet>
  );
};

// 29. Одна фраза: «Мне нужно двадцать минут. Я вернусь». И вернись.
export const S29: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['ОДНА ФРАЗА']} t={t} />
      <Ground />
      <Man x={230} y={G} s={1.8} mouth="open" eyes="dots" hair="tuft" la={[-26, 70]} ra={[60, -40]} seed={8} bob />
      <Pop x={600} y={740} t={t} at={T.p29.a - 6}>
        <Bubble x={590} y={760} w={700} h={330} tail={-1}>
          <Tx x={590} y={730} size={60} bold={1.2}>Мне нужно 20 минут.</Tx>
        </Bubble>
      </Pop>
      <Pop x={590} y={850} t={t} at={T.p29.b - 4}>
        <Tx x={590} y={850} size={96} bold={2.2}>Я вернусь.</Tx>
      </Pop>
      <Draw t={t} at={T.p29.c} n={20} strokeWidth={10} d="M780 1250 Q540 1130 340 1250 M385 1215 L340 1250 L395 1275" />
      <Stamp x={730} y={1400} text="И ВЕРНИСЬ" t={t} at={T.p29.c + 12} size={88} />
    </Sheet>
  );
};

// 30. Тишина с обещанием и тишина без него.
export const S30: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['ДВЕ РАЗНЫЕ ТИШИНЫ']} t={t} />
      <Draw t={t} at={4} n={12} strokeWidth={5} d="M80 1000 H1000" />
      <Pop x={240} y={900} t={t} at={T.p30.a}>
        <Man x={240} y={960} s={0.9} mouth="flat" eyes="dots" hair="tuft" la={[-26, 70]} ra={[26, 70]} seed={8} />
        <Bubble x={440} y={640} w={240} h={110} tail={-1}><Tx x={440} y={672} size={70} bold={1.6}>...</Tx></Bubble>
        <Tx x={700} y={800} size={60} bold={1.4}>с обещанием</Tx>
        <Heart x={900} y={780} s={0.8} />
      </Pop>
      <Pop x={240} y={1500} t={t} at={T.p30.b}>
        <Man x={240} y={1500} s={0.9} flip mouth="flat" eyes="up" hair="tuft" la={[-26, 70]} ra={[26, 70]} seed={8} />
        <Bubble x={440} y={1180} w={240} h={110} tail={-1}><Tx x={440} y={1212} size={70} bold={1.6}>...</Tx></Bubble>
        <Tx x={700} y={1340} size={60} bold={1.4}>без обещания</Tx>
        <Tx x={900} y={1400} size={110} bold={2.4}>?</Tx>
      </Pop>
    </Sheet>
  );
};

// 31. А посуду всё-таки помой.
export const S31: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.p31.st}>
      <Head lines={['ПОСУДУ ПОМОЙ']} t={t} />
      <Ground />
      <Man x={230} y={G} s={1.6} mouth="smile" eyes="dots" hair="tuft" la={[-26, 70]} ra={[70, 30]} seed={8} bob />
      <Man x={850} y={G} s={1.6} flip mouth="smile" eyes="dots" la={[-26, 70]} ra={[70, 30]} seed={9} bob />
      <Plates x={540} y={G - 6} n={9} s={1.3} shake={Math.abs(Math.sin(t / 5)) * 0.4} />
      {Array.from({ length: 8 }, (_, i) => {
        const u = clamp((t - T.p31.st - i * 3) / 40);
        return u > 0 ? <circle key={i} cx={430 + i * 30 + Math.sin(i * 3 + t / 6) * 14} cy={lerp(1150, 780, u)} r={14 + (i % 3) * 8} fill={PAPER} strokeWidth={4} /> : null;
      })}
      <Stamp x={540} y={900} text="ПОМОЙ" t={t} at={T.p31.st} size={120} />
    </Sheet>
  );
};
