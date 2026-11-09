import React from 'react';
import { useCurrentFrame } from 'remotion';
import { clamp, easeOut, lerp } from '../../engine/anim';
import { INK, PAPER } from '../../lines/kit';
import { Check, Confetti, Draw, G, Ground, Head, Man, Pop, Sheet, Stamp, Tx } from '../piter-bw/shots';
import { RecButton, VoiceBubble } from './shots';
import { T } from './timing';

// Вторая половина: сцены на фразы 8–41 (планы p8–p29). Моменты внутри плана лежат в timing.ts.

const talk = (t: number): 'open' | 'o' => (t % 10 < 5 ? 'open' : 'o');

/** Реплика-пузырь с текстом и хвостиком. */
const Bub: React.FC<{ x: number; y: number; w: number; h?: number; text: string; size?: number; tail?: 'l' | 'r' }> = ({ x, y, w, h = 130, text, size = 60, tail = 'l' }) => {
  const sx = tail === 'l' ? -1 : 1;
  return (
    <g transform={`translate(${x} ${y})`} strokeWidth={5}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={44} fill={PAPER} />
      <path d={`M${sx * (w / 2 - 70)} ${h / 2 - 2} L${sx * (w / 2 - 20)} ${h / 2 + 56} L${sx * (w / 2 - 130)} ${h / 2 - 2}`} fill={PAPER} />
      <Tx x={0} y={size * 0.34} size={size} bold={1.1}>{text}</Tx>
    </g>
  );
};

/** Шкала 0–4 минуты, заполняется слева направо. */
const TBar: React.FC<{ y: number; from: number; to: number; t: number; at?: number }> = ({ y, from, to, t, at = 0 }) => {
  const p = lerp(from, to, easeOut(clamp((t - at) / 40)));
  const x0 = 120;
  const w = 840;
  return (
    <g strokeWidth={5}>
      <rect x={x0} y={y - 36} width={w} height={72} rx={36} fill={PAPER} />
      <rect x={x0 + 6} y={y - 30} width={Math.max(0, (w - 12) * p)} height={60} rx={30} fill={INK} stroke="none" />
      {[0, 1, 2, 3, 4].map((i) => <Tx key={i} x={x0 + (w * i) / 4} y={y + 100} size={50} bold={0.8}>{i}</Tx>)}
      {[1, 2, 3].map((i) => <path key={i} d={`M${x0 + (w * i) / 4} ${y - 36} v72`} strokeWidth={3} />)}
    </g>
  );
};

const Heart: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 40 C-70 -10 -50 -70 0 -28 C50 -70 70 -10 0 40 Z" fill={INK} stroke="none" />
);

// 8. Вступление: «Короче, слушай». Завязка: «Тут такая история».
export const S8: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['ВСТУПЛЕНИЕ', 'И ЗАВЯЗКА']} t={t} />
      <Ground />
      <Man x={330} y={G} s={1.7} mouth={talk(t)} eyes="dots" hair="tuft" la={[-26, 70]} ra={[70, -40]} seed={7} bob />
      <Pop x={600} y={600} t={t} at={T.p8.a} n={9}>
        <Bub x={600} y={600} w={760} text="Короче, слушай" size={70} />
      </Pop>
      <Pop x={600} y={860} t={t} at={T.p8.b} n={9}>
        <Bub x={600} y={860} w={860} text="Тут такая история" size={70} />
      </Pop>
    </Sheet>
  );
};

/** Сцена «минута N»: шкала, строки по словам, Макс говорит. */
const Minute: React.FC<{ k: number; head: string[]; rows: { text: string; at: number; size?: number }[] }> = ({ k, head, rows }) => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={head} t={t} />
      <TBar y={600} from={(k - 1) / 4} to={k / 4} t={t} />
      {rows.map((r, i) => (
        <Pop key={i} x={540} y={900 + i * 140} t={t} at={r.at} n={9}>
          <Tx x={540} y={930 + i * 140} size={r.size ?? 92} bold={1.8}>{r.text}</Tx>
        </Pop>
      ))}
      <Ground />
      <Man x={800} y={G} s={1.4} mouth={talk(t)} eyes="dots" hair="tuft" la={[-26, 70]} ra={[26, 70]} seed={7} bob />
    </Sheet>
  );
};

// 9. Первая минута: кто, где и с кем.
export const S9: React.FC = () => <Minute k={1} head={['ПЕРВАЯ МИНУТА']} rows={[{ text: 'КТО', at: T.p9.w }, { text: 'ГДЕ', at: T.p9.g }, { text: 'С КЕМ', at: T.p9.c }]} />;

// 10. Вторая: зачем он вообще это начал.
export const S10: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['ВТОРАЯ МИНУТА']} t={t} />
      <TBar y={600} from={0.25} to={0.5} t={t} />
      <Pop x={540} y={930} t={t} at={T.p10.why} n={9}>
        <Tx x={540} y={950} size={84} bold={1.6}>зачем я это</Tx>
        <Tx x={540} y={1050} size={84} bold={1.6}>вообще начал?</Tx>
      </Pop>
      {[0, 1, 2].map((i) => (
        <Pop key={i} x={150 + i * 70} y={1200 - i * 40} t={t} at={T.p10.s + i * 5} n={7}>
          <Tx x={150 + i * 70} y={1200 - i * 40} size={110} bold={2} rot={-12 + i * 12}>?</Tx>
        </Pop>
      ))}
      <Ground />
      <Man x={800} y={G} s={1.4} mouth="o" eyes="up" brow="sad" hair="tuft" la={[-26, 70]} ra={[26, 70]} seed={7} bob />
    </Sheet>
  );
};

// 11. Третья: «Ладно, это неважно».
export const S11: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.p11.nv}>
      <Head lines={['ТРЕТЬЯ МИНУТА']} t={t} />
      <TBar y={600} from={0.5} to={0.75} t={t} />
      <Pop x={480} y={900} t={t} at={T.p11.ok} n={9}>
        <Bub x={480} y={900} w={800} text="Ладно, это неважно" size={64} />
      </Pop>
      <Stamp x={420} y={1090} text="НЕВАЖНО" t={t} at={T.p11.nv} size={110} />
      <Ground />
      <Man x={800} y={G} s={1.4} mouth={talk(t)} eyes="dots" hair="tuft" la={[-26, 70]} ra={[26, 70]} seed={7} bob />
    </Sheet>
  );
};

// 12. Четвёртая: «В общем, потом расскажу». Потом расскажу?!
export const S12: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.p12.st}>
      <Head lines={['ЧЕТВЁРТАЯ МИНУТА']} t={t} />
      <TBar y={600} from={0.75} to={1} t={t} />
      <Pop x={540} y={880} t={t} at={T.p12.q} n={9}>
        <Bub x={540} y={880} w={900} text="В общем, потом расскажу" size={62} tail="r" />
      </Pop>
      <Ground />
      <Man x={270} y={G} s={1.5} mouth="o" eyes="wide" brow="sad" la={[-40, 20]} ra={[40, -100]} seed={4} bob />
      <Man x={830} y={G} s={1.4} mouth="grin" eyes="dots" hair="tuft" la={[-26, 70]} ra={[26, 70]} seed={7} bob />
      <Stamp x={540} y={1090} text="ПОТОМ РАССКАЖУ?!" t={t} at={T.p12.st} size={78} />
    </Sheet>
  );
};

// 13. Вот ещё жанры. Голосовое с шумом ветра. Слов не разобрать.
export const S13: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['ВОТ ЕЩЁ ЖАНРЫ']} t={t} />
      <Pop x={540} y={430} t={t} at={T.p13.t} n={9}>
        <Tx x={540} y={440} size={72} bold={1.2}>жанр: «с ветром»</Tx>
      </Pop>
      <VoiceBubble x={540} y={800} w={820} t={t} time="1:12" />
      {['M60 700 q140 -60 280 0 t280 0 t280 0 t280 0', 'M0 830 q140 -60 280 0 t280 0 t280 0 t280 0', 'M80 940 q140 -60 280 0 t280 0 t280 0 t280 0'].map((d, i) => (
        <Draw key={i} t={t} at={T.p13.wind + i * 4} n={18} strokeWidth={7} d={d} />
      ))}
      <Pop x={540} y={1160} t={t} at={T.p13.no} n={8}>
        <Tx x={540} y={1180} size={120} bold={2}>???</Tx>
      </Pop>
      <Ground />
      <Man x={300} y={G} s={1.7} mouth="flat" eyes="up" brow="sad" la={[-26, 70]} ra={[40, -120]} seed={3} bob />
    </Sheet>
  );
};

// 14. Голосовое на ходу. Половина — дыхание.
export const S14: React.FC = () => {
  const t = useCurrentFrame();
  const x = lerp(200, 760, clamp(t / 70));
  return (
    <Sheet>
      <Head lines={['НА ХОДУ']} t={t} />
      <VoiceBubble x={540} y={640} w={820} t={t} time="2:05" />
      <Ground />
      <Man x={x} y={G - Math.abs(Math.sin(t / 3)) * 18} s={1.6} mouth="open" eyes="dots" la={[-26, 70]} ra={[40, -110]} seed={5} />
      {Array.from({ length: 5 }, (_, i) => <path key={i} d={`M${100 + i * 160} ${G + 50} h40`} strokeWidth={5} />)}
      <Pop x={540} y={900} t={t} at={T.p14.br} n={9}>
        <Tx x={540} y={920} size={80} bold={1.6}>половина — дыхание</Tx>
      </Pop>
      <Pop x={540} y={1060} t={t} at={T.p14.br + 6} n={9}>
        <Tx x={540} y={1070} size={90} bold={1.6}>х-х-х-х</Tx>
      </Pop>
    </Sheet>
  );
};

// 15. Голосовое, которое начинается с «ой, не то записал». И всё равно отправлено.
export const S15: React.FC = () => {
  const t = useCurrentFrame();
  const fly = easeOut(clamp((t - T.p15.sent) / 14));
  return (
    <Sheet hit={T.p15.sent}>
      <Head lines={['«ОЙ, НЕ ТО', 'ЗАПИСАЛ»']} t={t} />
      <VoiceBubble x={540} y={720} w={820} t={t} time="0:03" />
      <Pop x={540} y={930} t={t} at={T.p15.oi} n={9}>
        <Tx x={540} y={950} size={80} bold={1.6}>«ой, не то записал»</Tx>
      </Pop>
      {t >= T.p15.sent && (
        <g>
          <path d={`M${lerp(300, 780, fly)} 1100 l60 -30 l-30 60 l-12 -26 z`} fill={INK} />
          <Check x={820} y={1080} t={t} at={T.p15.sent + 6} s={2.2} />
        </g>
      )}
      <Ground />
      <Man x={300} y={G} s={1.6} mouth="smile" eyes="up" la={[-70, -10]} ra={[70, -10]} seed={6} bob />
      <Stamp x={760} y={1250} text="ОТПРАВЛЕНО" t={t} at={T.p15.sent + 4} size={80} />
    </Sheet>
  );
};

// 16. Ты только что отдал этому четыре минуты жизни.
export const S16: React.FC = () => {
  const t = useCurrentFrame();
  const u = easeOut(clamp((t - T.p16.gave) / 26));
  const hand = (t - T.p16.four) * 14;
  const cx = lerp(430, 790, u);
  const cy = 1180 - Math.sin(u * Math.PI) * 140;
  return (
    <Sheet hit={T.p16.life}>
      <Head lines={['ЧЕТЫРЕ МИНУТЫ', 'ЖИЗНИ']} t={t} />
      <Ground />
      <Man x={280} y={G} s={1.7} mouth="flat" eyes="dots" la={[-26, 70]} ra={[120, -30]} seed={2} bob />
      <g strokeWidth={5}>
        <rect x={690} y={G - 460} width={250} height={460} rx={34} fill={PAPER} />
        <rect x={712} y={G - 420} width={206} height={340} rx={10} strokeWidth={3} />
      </g>
      {t >= T.p16.gave && u < 1 && (
        <g strokeWidth={6} opacity={1 - clamp((u - 0.8) / 0.2)}>
          <circle cx={cx} cy={cy} r={96} fill={PAPER} />
          <path d={`M${cx} ${cy} l${Math.sin((hand * Math.PI) / 180) * 70} ${-Math.cos((hand * Math.PI) / 180) * 70}`} />
        </g>
      )}
      <Stamp x={540} y={760} text="−4 МИН" t={t} at={T.p16.life} size={130} />
    </Sheet>
  );
};

// 17. А стоишь в метро с телефоном у уха. Киваешь в пустоту. Люди смотрят.
export const S17: React.FC = () => {
  const t = useCurrentFrame();
  const bobY = t >= T.p17.nod ? Math.abs(Math.sin((t - T.p17.nod) / 3)) * 16 : 0;
  return (
    <Sheet>
      <Head lines={['В МЕТРО']} t={t} />
      <path d="M0 560 H1080 M120 560 v90 M540 560 v90 M960 560 v90" strokeWidth={6} />
      <Ground />
      <Man x={190} y={G} s={1.15} flip mouth="flat" eyes="wide" la={[-26, 70]} ra={[26, 70]} seed={8} />
      <Man x={890} y={G} s={1.15} mouth="flat" eyes="wide" la={[-26, 70]} ra={[26, 70]} seed={9} />
      <Man x={540} y={G - bobY} s={1.7} mouth="flat" eyes="dots" la={[-26, 70]} ra={[34, -150]} seed={4} />
      <Pop x={540} y={830} t={t} at={T.p17.metro} n={9}>
        <Tx x={540} y={850} size={80} bold={1.5}>«ага… ага…»</Tx>
      </Pop>
      {t >= T.p17.look && [190, 890].map((px, i) => (
        <g key={i}>
          <Draw t={t} at={T.p17.look} n={10} strokeWidth={5} d={i ? 'M820 1230 L700 1190 M820 1260 L700 1260' : 'M260 1230 L380 1190 M260 1260 L380 1260'} />
          <Pop x={px} y={1050} t={t} at={T.p17.look + 4} n={7}>
            <Tx x={px} y={1060} size={90} bold={1.6}>?</Tx>
          </Pop>
        </g>
      ))}
    </Sheet>
  );
};

// 18. Ответить текстом «ага»? Обидишь.
export const S18: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.p18.ob}>
      <Head lines={['ОТВЕТ: «АГА»']} t={t} />
      <g strokeWidth={5}>
        <rect x={140} y={620} width={800} height={130} rx={36} fill={PAPER} />
        <Tx x={190} y={706} size={66} bold={1} anchor="start">{t >= T.p18.aga ? 'ага' : ''}</Tx>
      </g>
      <Ground />
      <Man x={290} y={G} s={1.6} mouth="smile" eyes="dots" la={[-26, 70]} ra={[70, -50]} seed={3} bob />
      <Man x={800} y={G} s={1.5} mouth="flat" eyes="up" brow="sad" hair="tuft" la={[-26, 70]} ra={[26, 70]} seed={7} />
      <Stamp x={540} y={1000} text="ОБИДА" t={t} at={T.p18.ob} size={120} />
    </Sheet>
  );
};

// 19. Ответить голосовым? Придётся записывать свои четыре минуты. Пиздец, а не выбор.
export const S19: React.FC = () => {
  const t = useCurrentFrame();
  const secs = Math.round(lerp(0, 240, clamp((t - T.p19.rec) / 40)));
  const ss = String(secs % 60).padStart(2, '0');
  return (
    <Sheet hit={T.p19.st}>
      <Head lines={['ОТВЕТИТЬ ГОЛОСОВЫМ?']} t={t} />
      <Pop x={700} y={780} t={t} at={T.p19.rec - 20} n={9}>
        <RecButton x={700} y={780} r={170} />
      </Pop>
      {t >= T.p19.rec && <Tx x={700} y={1100} size={120} bold={2}>{`${Math.floor(secs / 60)}:${ss}`}</Tx>}
      <Ground />
      <Man x={290} y={G} s={1.7} mouth="open" eyes="wide" brow="sad" la={[-26, 70]} ra={[90, -60]} seed={2} bob />
      <Stamp x={740} y={1330} text="НЕТ ВЫБОРА" t={t} at={T.p19.st} size={92} />
    </Sheet>
  );
};

// 20. Включаешь на двойной скорости. Макс звучит, нахуй, как бурундук.
export const S20: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.p20.chip}>
      <Head lines={['ДВОЙНАЯ СКОРОСТЬ']} t={t} />
      <VoiceBubble x={540} y={620} w={820} t={t * 2} time="x2" />
      <Pop x={540} y={1230} t={t} at={T.p20.chip - 4} n={10}>
        <g transform="translate(540 1230)" strokeWidth={6}>
          <path d="M120 40 Q260 -20 230 -150 Q210 -230 150 -170" fill="none" strokeWidth={14} />
          <ellipse cx={0} cy={0} rx={170} ry={120} fill={PAPER} />
          <path d="M-120 -80 Q0 -110 130 -70 M-150 -30 Q0 -60 150 -20 M-150 20 Q0 -10 140 30" strokeWidth={9} />
          <circle cx={-170} cy={-90} r={80} fill={PAPER} />
          <circle cx={-195} cy={-102} r={7} fill={INK} />
          <path d="M-128 -156 l-6 -34 l34 18 M-186 -166 l-10 -32 l30 22" fill="none" />
          <path d="M-60 112 l-10 36 M40 112 l10 36" />
        </g>
      </Pop>
      <Ground />
    </Sheet>
  );
};

// 21. Но ты слушаешь до конца. А Макс уже спрашивает: «Ну как, послушал?»
export const S21: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['ДО КОНЦА']} t={t} />
      <TBar y={560} from={0.7} to={1} t={t} />
      <Check x={900} y={430} t={t} at={T.p21.end} s={2} />
      <Pop x={580} y={900} t={t} at={T.p21.q} n={9}>
        <Bub x={580} y={900} w={900} text="Ну как, послушал?" size={74} tail="r" />
      </Pop>
      <Ground />
      <Man x={270} y={G} s={1.6} mouth="smile" eyes="closed" la={[-26, 70]} ra={[26, 70]} seed={3} bob />
      <Man x={830} y={G} s={1.5} mouth={talk(t)} eyes="wide" hair="tuft" la={[-26, 70]} ra={[26, 70]} seed={7} bob />
    </Sheet>
  );
};

// 22. Теперь странное. Если бы Максу нужно было передать информацию, он бы написал.
export const S22: React.FC = () => {
  const t = useCurrentFrame();
  const arrow = clamp((t - T.p22.wr) / 12);
  return (
    <Sheet>
      <Head lines={['ТЕПЕРЬ СТРАННОЕ']} t={t} />
      <Pop x={540} y={620} t={t} at={T.p22.odd} n={9}>
        <Tx x={540} y={720} size={240} bold={3}>?!</Tx>
      </Pop>
      <Pop x={330} y={1000} t={t} at={T.p22.odd + 10} n={9}>
        <g strokeWidth={6}>
          <rect x={130} y={920} width={400} height={160} rx={20} fill={PAPER} />
          <Tx x={330} y={1016} size={46} bold={1}>ИНФОРМАЦИЯ</Tx>
        </g>
      </Pop>
      {arrow > 0 && <path d={`M520 1000 H${520 + 140 * arrow} M${500 + 140 * arrow} 970 L${530 + 140 * arrow} 1000 L${500 + 140 * arrow} 1030`} strokeWidth={8} fill="none" />}
      <Pop x={820} y={1000} t={t} at={T.p22.wr + 8} n={9}>
        <Bub x={820} y={1000} w={300} h={140} text="текст" size={64} tail="l" />
      </Pop>
      <Ground />
      <Man x={540} y={G} s={1.4} mouth="flat" eyes="up" brow="raised" hair="tuft" la={[-26, 70]} ra={[26, 70]} seed={7} bob />
    </Sheet>
  );
};

// 23. Информация влезает в одну строку: «Встретились, потом расскажу».
export const S23: React.FC = () => {
  const t = useCurrentFrame();
  const full = 'Встретились, потом расскажу';
  const n = Math.floor(clamp((t - T.p23.txt) / 34) * full.length);
  return (
    <Sheet>
      <Head lines={['ВСЁ В ОДНОЙ СТРОКЕ']} t={t} />
      <Pop x={540} y={760} t={t} at={T.p23.line - 6} n={9}>
        <rect x={60} y={690} width={960} height={140} rx={40} fill={PAPER} strokeWidth={5} />
      </Pop>
      <Tx x={110} y={780} size={62} bold={1} anchor="start">{full.slice(0, n)}</Tx>
      <Pop x={540} y={1000} t={t} at={T.p23.txt + 36} n={9}>
        <Tx x={540} y={1010} size={76} bold={1.5}>вот и вся информация</Tx>
      </Pop>
      <Ground />
      <Man x={540} y={G} s={1.5} mouth="smile" eyes="dots" hair="tuft" la={[-26, 70]} ra={[26, 70]} seed={7} bob />
    </Sheet>
  );
};

// 24. А он пересказал тебе весь день. С вздохами. С паузами.
export const S24: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['ВЕСЬ ДЕНЬ']} t={t} />
      <Pop x={540} y={600} t={t} at={T.p24.day} n={9}>
        <g strokeWidth={6}>
          <path d="M120 700 Q540 380 960 700" fill="none" />
          <circle cx={540} cy={500} r={46} fill={PAPER} />
          <path d="M540 420 v-36 M470 440 l-24 -24 M610 440 l24 -24 M450 500 h-36 M630 500 h36" />
        </g>
      </Pop>
      <Pop x={300} y={1010} t={t} at={T.p24.sigh} n={9}>
        <Tx x={300} y={1020} size={92} bold={1.6}>ах-х-х…</Tx>
        <path d="M150 1070 q60 30 120 0 t120 0" strokeWidth={6} fill="none" />
      </Pop>
      <Pop x={780} y={1010} t={t} at={T.p24.pause} n={9}>
        <Tx x={780} y={1020} size={92} bold={1.6}>… … …</Tx>
      </Pop>
      <Ground />
      <Man x={540} y={G} s={1.5} mouth={talk(t)} eyes="dots" hair="tuft" la={[-70, 10]} ra={[70, 10]} seed={7} bob />
    </Sheet>
  );
};

// 25. Потому что ему нужна была не передача данных. Ему нужно было, чтобы кто-то послушал.
export const S25: React.FC = () => {
  const t = useCurrentFrame();
  const strike = clamp((t - T.p25.nd) / 8);
  return (
    <Sheet>
      <Head lines={['НЕ ДАННЫЕ,', 'А КТО-ТО РЯДОМ']} t={t} />
      <Pop x={540} y={620} t={t} at={T.p25.nd - 10} n={9}>
        <Tx x={540} y={640} size={100} bold={1.8}>передача данных</Tx>
        {strike > 0 && <path d={`M170 610 H${170 + 740 * strike}`} strokeWidth={10} />}
      </Pop>
      <Ground />
      <Man x={270} y={G} s={1.6} mouth={talk(t)} eyes="dots" hair="tuft" la={[-26, 70]} ra={[70, -30]} seed={7} bob />
      <Man x={800} y={G} s={1.6} flip mouth="smile" eyes="closed" la={[-26, 70]} ra={[26, 70]} seed={3} bob />
      <Pop x={800} y={1000} t={t} at={T.p25.l} n={10}>
        <Heart x={800} y={1000} s={2.4} />
      </Pop>
    </Sheet>
  );
};

// 26. Голос — это когда человек рядом, пусть даже в телефоне.
export const S26: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['ГОЛОС — ЭТО', 'ЧЕЛОВЕК РЯДОМ']} t={t} />
      <Ground />
      <Man x={290} y={G} s={1.7} mouth="smile" eyes="dots" la={[-26, 70]} ra={[80, 10]} seed={3} bob />
      <Pop x={790} y={G - 260} t={t} at={T.p26.near} n={10}>
        <g strokeWidth={6}>
          <rect x={640} y={G - 560} width={300} height={560} rx={36} fill={PAPER} />
          <rect x={664} y={G - 520} width={252} height={430} rx={10} strokeWidth={3} />
        </g>
        <Man x={790} y={G - 100} s={0.85} mouth={talk(t)} eyes="dots" hair="tuft" la={[-26, 70]} ra={[26, 70]} seed={7} />
      </Pop>
      <Pop x={540} y={700} t={t} at={T.p26.ph} n={9}>
        <Heart x={540} y={700} s={2} />
      </Pop>
    </Sheet>
  );
};

// 27. Что делать? Включи. Хоть на двойной скорости.
export const S27: React.FC = () => {
  const t = useCurrentFrame();
  const ring = clamp((t - T.p27.on) / 24);
  return (
    <Sheet hit={T.p27.on}>
      <Head lines={['ЧТО ДЕЛАТЬ?']} t={t} />
      <VoiceBubble x={540} y={620} w={820} t={t} live={t >= T.p27.on} time="4:00" />
      {t >= T.p27.on && <circle cx={214} cy={620} r={46 + ring * 80} strokeWidth={5} opacity={1 - ring} fill="none" />}
      <Ground />
      <Man x={540} y={G} s={1.6} mouth="smile" eyes="dots" la={[-26, 70]} ra={[26, 70]} seed={3} bob />
      <Stamp x={540} y={860} text="ВКЛЮЧИ" t={t} at={T.p27.on} size={110} />
      <Stamp x={540} y={1040} text="ХОТЬ НА x2" t={t} at={T.p27.x2} size={80} rot={5} />
    </Sheet>
  );
};

// 28. И ответь тоже голосом. Не на четыре минуты, на одну.
export const S28: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.p28.one}>
      <Head lines={['ОТВЕТЬ ГОЛОСОМ']} t={t} />
      <VoiceBubble x={440} y={540} w={760} t={t} live={false} time="4:00" tail="l" />
      <Pop x={700} y={780} t={t} at={T.p28.voice} n={10}>
        <VoiceBubble x={700} y={780} w={460} t={t} time="1:00" tail="r" />
      </Pop>
      <Ground />
      <Man x={290} y={G} s={1.5} mouth="smile" eyes="dots" hair="tuft" la={[-26, 70]} ra={[26, 70]} seed={7} bob />
      <Man x={800} y={G} s={1.6} mouth={talk(t)} eyes="dots" la={[-26, 70]} ra={[26, 70]} seed={3} bob />
      <Stamp x={540} y={1000} text="ОДНА МИНУТА" t={t} at={T.p28.one} size={80} />
    </Sheet>
  );
};

// 29. Это не моноспектакль. Это человек, который хотел с тобой поговорить.
export const S29: React.FC = () => {
  const t = useCurrentFrame();
  const strike = clamp((t - T.p29.no) / 8);
  return (
    <Sheet>
      <Head lines={['ХОТЕЛ ПОГОВОРИТЬ']} t={t} />
      <Pop x={540} y={540} t={t} at={T.p29.no - 12} n={9}>
        <Tx x={540} y={560} size={100} bold={1.8}>моноспектакль</Tx>
        {strike > 0 && <path d={`M190 530 H${190 + 700 * strike}`} strokeWidth={10} />}
      </Pop>
      <Ground />
      <Man x={400} y={G} s={1.7} mouth="smile" eyes="dots" hair="tuft" la={[-26, 70]} ra={[100, -20]} seed={7} bob />
      <Man x={700} y={G} s={1.7} flip mouth="smile" eyes="dots" la={[-26, 70]} ra={[100, -20]} seed={3} bob />
      <Confetti t={t} at={T.p29.talk} top={900} n={26} seed={3} />
      <Pop x={550} y={960} t={t} at={T.p29.man} n={10}>
        <Heart x={550} y={960} s={2.6} />
      </Pop>
    </Sheet>
  );
};
