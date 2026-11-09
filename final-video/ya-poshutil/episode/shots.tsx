import React from 'react';
import { useCurrentFrame } from 'remotion';
import { clamp, easeOut, lerp } from '../../engine/anim';
import { INK, PAPER } from '../../lines/kit';
import { Check, Confetti, Draw, G, Ground, Head, Man, Pop, Sheet, Stamp, Tx } from '../piter-bw/shots';
import { T } from './timing';

// «Я просто пошутил»: вертикальный ЧБ 1080×1920. Моменты внутри плана (кадры от начала плана) лежат в timing.ts
// и собираются скриптом из best_words.json. Герои: Дима (хохолок), коллега, Лера (платье, два пучка).

const talk = (t: number): 'open' | 'o' => (t % 10 < 5 ? 'open' : 'o');
const headY = (s: number) => G - 227 * s;

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

/** Стол совещания: передняя панель, герои стоят за ним. */
const Desk: React.FC<{ y?: number }> = ({ y = 1290 }) => (
  <g strokeWidth={5}>
    <rect x={40} y={y} width={1000} height={G - y + 6} fill={PAPER} />
    <path d={`M40 ${y + 34} H1040`} strokeWidth={3} />
    <path d={`M${300} ${y + 60} V${G} M${780} ${y + 60} V${G}`} strokeWidth={3} />
  </g>
);

/** Купол-щит над героем. */
const Dome: React.FC<{ x: number; r: number; t: number; at: number }> = ({ x, r, t, at }) => (
  <g>
    <Draw t={t} at={at} n={16} strokeWidth={8} d={`M${x - r} ${G} A${r} ${r} 0 0 1 ${x + r} ${G}`} />
    <Draw t={t} at={at + 8} n={12} strokeWidth={4} d={`M${x - r + 60} ${G} A${r - 60} ${r - 60} 0 0 1 ${x + r - 60} ${G}`} />
  </g>
);

/** Лера: Man + платье + два пучка. */
const Lera: React.FC<{ x: number; s?: number; t: number; mouth?: 'smile' | 'flat' | 'grin' | 'open' | 'o'; eyes?: 'dots' | 'closed' | 'wide' | 'up'; brow?: 'none' | 'sad' | 'raised'; flip?: boolean; seed?: number; dress?: boolean }> = ({
  x, s = 1.7, t, mouth = 'smile', eyes = 'dots', brow = 'none', flip, seed = 11, dress = true,
}) => {
  const hy = headY(s);
  return (
    <g>
      <Man x={x} y={G} s={s} mouth={mouth} eyes={eyes} brow={brow} flip={flip} seed={seed} la={[-30, 78]} ra={[30, 78]} bob />
      {dress && <path d={`M${x - 46 * s} ${G - 150 * s} L${x - 112 * s} ${G - 8} L${x + 112 * s} ${G - 8} L${x + 46 * s} ${G - 150 * s} Z`} fill={PAPER} strokeWidth={5} />}
      {dress && <path d={`M${x - 50 * s} ${G - 90 * s} H${x + 50 * s}`} strokeWidth={4} />}
      {[-1, 1].map((k) => (
        <path key={k} d={`M${x + k * 40 * s} ${hy - 40 * s} Q${x + k * 84 * s} ${hy + 10 * s} ${x + k * 58 * s} ${hy + 100 * s}`} strokeWidth={9} fill="none" />
      ))}
      <path d={`M${x - 44 * s} ${hy - 22 * s} Q${x} ${hy - 78 * s} ${x + 44 * s} ${hy - 22 * s}`} strokeWidth={8} fill="none" />
    </g>
  );
};

const Heart: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 40 C-70 -10 -50 -70 0 -28 C50 -70 70 -10 0 40 Z" fill={INK} stroke="none" />
);

// 1. «Да я пошутил» — самая удобная фраза в мире.
export const S1: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.p1.conv}>
      <Head lines={['САМАЯ УДОБНАЯ', 'ФРАЗА В МИРЕ']} t={t} />
      <Ground />
      <Man x={330} y={G} s={1.75} mouth="grin" eyes="dots" hair="tuft" la={[-70, -50]} ra={[70, -50]} seed={7} bob />
      <Pop x={640} y={800} t={t} at={T.p1.quote} n={9}>
        <Bub x={640} y={800} w={820} text="Да я пошутил" size={78} />
      </Pop>
      <Stamp x={700} y={1010} text="УДОБНО" t={t} at={T.p1.conv} size={110} />
    </Sheet>
  );
};

// 2. Сказал гадость, добавил «шутка», и ты уже ни при чём.
export const S2: React.FC = () => {
  const t = useCurrentFrame();
  const tag = easeOut(clamp((t - T.p2.tag) / 10));
  return (
    <Sheet hit={T.p2.out}>
      <Head lines={['ДОБАВИЛ «ШУТКА»', 'И ТЫ НИ ПРИ ЧЁМ']} t={t} />
      <Ground />
      <Man x={300} y={G} s={1.7} mouth={talk(t)} eyes="dots" hair="tuft" la={[-26, 70]} ra={[110, -40]} seed={7} bob />
      <Man x={800} y={G} s={1.5} mouth="flat" eyes="dots" brow="sad" seed={3} />
      <Pop x={560} y={640} t={t} at={T.p2.bad} n={9}>
        <Bub x={560} y={640} w={800} text="Ну ты и лузер" size={74} />
      </Pop>
      {t >= T.p2.tag && (
        <g transform={`translate(720 ${lerp(930, 900, tag)}) rotate(-6)`} opacity={tag}>
          <rect x={-190} y={-62} width={380} height={124} fill={INK} />
          <Tx x={0} y={26} size={78} fill={PAPER} bold={1.4}>шутка</Tx>
        </g>
      )}
      <Pop x={540} y={1090} t={t} at={T.p2.out} n={9}>
        <Tx x={290} y={1010} size={62} bold={1.4}>я ни при чём</Tx>
      </Pop>
    </Sheet>
  );
};

// 3. Виноват тот, кто обиделся. Юмора, сука, не понимает.
export const S3: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.p3.st}>
      <Head lines={['ВИНОВАТ ТОТ,', 'КТО ОБИДЕЛСЯ']} t={t} />
      <Ground />
      <Man x={290} y={G} s={1.7} mouth={talk(t)} eyes="dots" hair="tuft" brow="angry" la={[-26, 70]} ra={[130, -10]} seed={7} bob />
      <Man x={810} y={G} s={1.5} mouth="flat" eyes="dots" brow="sad" seed={3} />
      <Pop x={540} y={620} t={t} at={T.p3.ob} n={9}>
        <Tx x={540} y={560} size={86} bold={1.6}>виноват он</Tx>
        <path d="M720 610 L800 1000 M750 950 L800 1012 L836 940" strokeWidth={7} />
      </Pop>
      <Stamp x={360} y={860} text="НЕТ ЮМОРА" t={t} at={T.p3.st} size={96} />
    </Sheet>
  );
};

// 4. Есть теория, почему вообще бывает смешно.
export const S4: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['ПОЧЕМУ', 'БЫВАЕТ СМЕШНО']} t={t} />
      <g strokeWidth={7}>
        <rect x={110} y={450} width={860} height={540} fill={INK} />
        <path d="M200 990 L170 1130 M880 990 L910 1130" />
      </g>
      <Pop x={540} y={620} t={t} at={T.p4.th} n={9}>
        <Tx x={540} y={650} size={130} fill={PAPER} bold={2}>ТЕОРИЯ</Tx>
      </Pop>
      <Pop x={540} y={850} t={t} at={T.p4.fun} n={9}>
        <Tx x={540} y={870} size={84} fill={PAPER} bold={1.6}>почему смешно?</Tx>
      </Pop>
      <Ground />
      <Man x={820} y={G} s={1.5} mouth={talk(t)} eyes="dots" brow="raised" la={[-100, -110]} ra={[26, 70]} seed={5} bob />
    </Sheet>
  );
};

// 5. Психологи Макгроу и Уоррен, 2010 год.
export const S5: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.p5.yr}>
      <Head lines={['МАКГРОУ И УОРРЕН']} t={t} />
      <Ground />
      <Man x={290} y={G} s={1.6} mouth="smile" eyes="dots" hair="tuft" seed={2} bob />
      <Man x={790} y={G} s={1.6} mouth="smile" eyes="dots" flip seed={9} bob />
      <Pop x={290} y={1030} t={t} at={T.p5.mc} n={8}>
        <Tx x={290} y={1030} size={64} bold={1.3}>МАКГРОУ</Tx>
      </Pop>
      <Pop x={790} y={1030} t={t} at={T.p5.wr} n={8}>
        <Tx x={790} y={1030} size={64} bold={1.3}>УОРРЕН</Tx>
      </Pop>
      <Stamp x={540} y={640} text="2010" t={t} at={T.p5.yr} size={200} />
    </Sheet>
  );
};

// 6. Смешно, когда что-то нарушает правила, но при этом безопасно.
export const S6: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['НАРУШЕНИЕ', '+ БЕЗОПАСНО']} t={t} />
      <Pop x={540} y={600} t={t} at={T.p6.rules} n={9}>
        <g strokeWidth={6}>
          <rect x={300} y={470} width={480} height={190} fill={PAPER} />
          <path d="M420 470 L470 560 L430 600 L500 660" strokeWidth={5} />
        </g>
        <Tx x={540} y={590} size={74} bold={1.5}>ПРАВИЛО</Tx>
      </Pop>
      <Pop x={540} y={780} t={t} at={T.p6.rules + 14} n={7}>
        <Tx x={540} y={820} size={110} bold={2}>+</Tx>
      </Pop>
      <Pop x={540} y={1050} t={t} at={T.p6.safe} n={10}>
        <path d="M540 880 L680 930 V1060 Q680 1180 540 1240 Q400 1180 400 1060 V930 Z" fill={PAPER} strokeWidth={7} />
        <Check x={540} y={1070} t={t} at={T.p6.safe + 6} s={1.6} />
      </Pop>
      <Stamp x={540} y={1400} text="= СМЕШНО" t={t} at={T.p6.safe + 20} size={110} />
      <Ground />
    </Sheet>
  );
};

// 7. Они проверяли это в пяти экспериментах.
export const S7: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['ПЯТЬ', 'ЭКСПЕРИМЕНТОВ']} t={t} />
      {[0, 1, 2, 3, 4].map((i) => {
        const x = 121 + i * 172 + 75;
        return (
          <g key={i}>
            <Pop x={x} y={720} t={t} at={T.p7.five + i * 6} n={8}>
              <rect x={x - 75} y={620} width={150} height={200} rx={24} fill={PAPER} strokeWidth={5} />
              <Tx x={x} y={750} size={100} bold={1.8}>{i + 1}</Tx>
            </Pop>
            <Check x={x} y={900} t={t} at={T.p7.five + 14 + i * 6} s={1.3} />
          </g>
        );
      })}
      <Ground />
      <Man x={540} y={G} s={1.6} mouth="smile" eyes="dots" brow="raised" la={[-80, -60]} ra={[80, -60]} seed={5} bob />
    </Sheet>
  );
};

// 8. Теперь вопрос: безопасно для кого?
export const S8: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.p8.who}>
      <Head lines={['БЕЗОПАСНО', 'ДЛЯ КОГО?']} t={t} />
      <Pop x={640} y={800} t={t} at={T.p8.q} n={12}>
        <path d="M640 560 L840 630 V810 Q840 960 640 1040 Q440 960 440 810 V630 Z" fill={PAPER} strokeWidth={8} />
        <Tx x={640} y={880} size={300} bold={4}>?</Tx>
      </Pop>
      <Ground />
      <Man x={250} y={G} s={1.7} mouth="o" eyes="up" brow="raised" la={[-26, 70]} ra={[26, 70]} seed={4} bob />
      <Stamp x={640} y={1330} text="ДЛЯ КОГО?" t={t} at={T.p8.who} size={96} />
    </Sheet>
  );
};

// 9. Вот Дима. Совещание, все за столом.
export const S9: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['СОВЕЩАНИЕ']} t={t} />
      <Pop x={540} y={600} t={t} at={T.p9.mtg} n={9}>
        <rect x={250} y={440} width={580} height={330} fill={PAPER} strokeWidth={6} />
        <path d="M330 700 V600 M430 700 V540 M530 700 V630 M630 700 V500 M730 700 V580" strokeWidth={26} />
      </Pop>
      <Man x={150} y={1330} s={1.05} mouth="flat" eyes="dots" seed={1} />
      <Man x={390} y={1330} s={1.05} mouth="flat" eyes="dots" seed={2} />
      <Man x={700} y={1330} s={1.4} mouth="grin" eyes="dots" hair="tuft" seed={7} bob />
      <Man x={940} y={1330} s={1.05} mouth="flat" eyes="dots" flip seed={4} />
      <Desk />
      <Pop x={700} y={960} t={t} at={T.p9.dima} n={9}>
        <Tx x={700} y={900} size={90} bold={2}>ДИМА</Tx>
        <path d="M700 930 V990" strokeWidth={7} />
      </Pop>
      <Ground />
    </Sheet>
  );
};

// 10. Дима говорит коллеге: «Ну ты и тормоз!»
export const S10: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.p10.brake}>
      <Head lines={['ДИМА ШУТИТ']} t={t} />
      <Ground />
      <Man x={290} y={G} s={1.7} mouth={talk(t)} eyes="dots" hair="tuft" la={[-26, 70]} ra={[120, -30]} seed={7} bob />
      <Man x={810} y={G} s={1.5} mouth="flat" eyes="dots" brow="sad" seed={3} />
      <Pop x={540} y={760} t={t} at={T.p10.say} n={9}>
        <Bub x={540} y={760} w={860} text="Ну ты и тормоз!" size={74} />
      </Pop>
    </Sheet>
  );
};

// 11. Смеётся только Дима.
export const S11: React.FC = () => {
  const t = useCurrentFrame();
  const jump = Math.abs(Math.sin(t / 4)) * 50;
  return (
    <Sheet>
      <Head lines={['СМЕЁТСЯ', 'ТОЛЬКО ДИМА']} t={t} />
      <Man x={120} y={G} s={1.0} mouth="flat" eyes="dots" seed={1} />
      <Man x={960} y={G} s={1.0} mouth="flat" eyes="dots" flip seed={4} />
      <Man x={540} y={G - jump} s={1.9} mouth="grin" eyes="closed" hair="tuft" la={[-70, -70]} ra={[70, -70]} seed={7} />
      <Ground />
      <Pop x={540} y={700} t={t} at={T.p11.laugh} n={9}>
        <Tx x={540} y={720} size={110} bold={2.2} rot={-5}>ХА-ХА-ХА</Tx>
      </Pop>
    </Sheet>
  );
};

// 12. Коллега смотрит в стол.
export const S12: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['КОЛЛЕГА', 'СМОТРИТ В СТОЛ']} t={t} />
      <Man x={540} y={1470} s={2.0} mouth="flat" eyes="dots" brow="sad" seed={3} />
      <Desk y={1290} />
      <Draw t={t} at={T.p12.look} n={14} strokeWidth={6} d="M540 1080 V1250 M505 1215 L540 1256 L575 1215" />
      <Ground />
    </Sheet>
  );
};

// 13. Дима: «Да ладно, я же пошутил».
export const S13: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.p13.joke}>
      <Head lines={['«Я ЖЕ', 'ПОШУТИЛ»']} t={t} />
      <Ground />
      <Man x={320} y={G} s={1.7} mouth={talk(t)} eyes="dots" hair="tuft" la={[-70, -50]} ra={[70, -50]} seed={7} bob />
      <Man x={850} y={G} s={1.3} mouth="flat" eyes="dots" brow="sad" seed={3} />
      <Pop x={540} y={780} t={t} at={T.p13.ladno - 6} n={9}>
        <Bub x={540} y={780} w={940} text="Да ладно, я же пошутил" size={60} />
      </Pop>
      <Stamp x={760} y={1060} text="ШУТКА" t={t} at={T.p13.joke} size={100} />
    </Sheet>
  );
};

// 14. Смотри, как это устроено.
export const S14: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['КАК ЭТО', 'УСТРОЕНО']} t={t} />
      <Man x={540} y={800} s={0.85} mouth="grin" eyes="dots" hair="tuft" seed={7} bob />
      <Draw t={t} at={T.p14.look} n={14} strokeWidth={7} d="M470 840 L270 1020 M300 960 L266 1026 L336 1010" />
      <Draw t={t} at={T.p14.look + 6} n={14} strokeWidth={7} d="M610 840 L810 1020 M780 1010 L814 1026 L784 960" />
      {[270, 810].map((x, i) => (
        <Pop key={x} x={x} y={1200} t={t} at={T.p14.look + 18 + i * 8} n={9}>
          <rect x={x - 170} y={1090} width={340} height={230} rx={20} fill={PAPER} strokeWidth={6} />
          <Tx x={x} y={1250} size={160} bold={3}>?</Tx>
        </Pop>
      ))}
      <Ground />
    </Sheet>
  );
};

/** Группа из трёх зрителей. */
const Trio: React.FC<{ jump?: boolean; t: number; sad?: boolean }> = ({ jump, t, sad }) => (
  <g>
    {[150, 330, 510].map((x, i) => (
      <Man key={x} x={x} y={G - (jump ? Math.abs(Math.sin((t + i * 3) / 4)) * 40 : 0)} s={1.0} mouth={sad ? 'flat' : 'grin'} eyes={sad ? 'dots' : 'closed'} brow={sad ? 'sad' : 'none'}
        la={jump ? [-50, -60] : [-26, 70]} ra={jump ? [50, -60] : [26, 70]} seed={i + 1} />
    ))}
  </g>
);

// 15. Засмеялись — Дима остроумный.
export const S15: React.FC = () => {
  const t = useCurrentFrame();
  const cr = easeOut(clamp((t - T.p15.witty) / 10));
  return (
    <Sheet hit={T.p15.witty}>
      <Head lines={['ЗАСМЕЯЛИСЬ']} t={t} />
      <Ground />
      <Trio jump t={t} />
      <Man x={800} y={G} s={1.6} mouth="grin" eyes="dots" hair="tuft" la={[-26, 70]} ra={[100, -90]} seed={7} bob />
      {t >= T.p15.witty && (
        <g transform={`translate(800 ${headY(1.6) - 100 + (1 - cr) * -60})`} opacity={cr}>
          <path d="M-52 0 L-56 -56 L-26 -24 L0 -66 L26 -24 L56 -56 L52 0 Z" fill={INK} />
        </g>
      )}
      <Stamp x={540} y={800} text="ОСТРОУМНЫЙ" t={t} at={T.p15.witty} size={92} />
    </Sheet>
  );
};

// 16. Обиделись — Дима ни при чём.
export const S16: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.p16.clean}>
      <Head lines={['ОБИДЕЛИСЬ']} t={t} />
      <Ground />
      <Trio sad t={t} />
      <Man x={800} y={G} s={1.6} mouth="smile" eyes="dots" hair="tuft" la={[-70, -40]} ra={[70, -40]} seed={7} bob />
      <Pop x={800} y={headY(1.6) - 70} t={t} at={T.p16.clean} n={9}>
        <ellipse cx={800} cy={headY(1.6) - 100} rx={70} ry={18} strokeWidth={7} />
      </Pop>
      <Stamp x={540} y={800} text="НИ ПРИ ЧЁМ" t={t} at={T.p16.clean} size={100} />
    </Sheet>
  );
};

// 17. Ему не может прилететь. Удобно, блядь.
export const S17: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.p17.st}>
      <Head lines={['ЕМУ НЕ', 'ПРИЛЕТИТ']} t={t} />
      <Ground />
      <Man x={640} y={G} s={1.3} mouth="grin" eyes="dots" hair="tuft" seed={7} bob />
      <Dome x={640} r={410} t={t} at={4} />
      {[0, 1, 2].map((i) => {
        const p = t - T.p17.fly - i * 9;
        if (p < 0) return null;
        const y = 1040 + i * 130;
        const x = p < 14 ? lerp(60, 250, p / 14) : 250 - (p - 14) * 11;
        const yy = p < 14 ? y : y - (p - 14) * 5;
        return <circle key={i} cx={x} cy={yy} r={32} fill={INK} />;
      })}
      <Stamp x={540} y={680} text="УДОБНО" t={t} at={T.p17.st} size={120} />
    </Sheet>
  );
};

// 18. Вот ещё. «Не будь занудой». «Расслабься». «Я же любя».
export const S18: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['ВОТ ЕЩЁ']} t={t} />
      <Pop x={540} y={560} t={t} at={T.p18.a - 4} n={9}>
        <Bub x={540} y={560} w={820} text="Не будь занудой" size={70} />
      </Pop>
      <Pop x={540} y={810} t={t} at={T.p18.b - 4} n={9}>
        <Bub x={540} y={810} w={620} text="Расслабься" size={70} tail="r" />
      </Pop>
      <Pop x={540} y={1050} t={t} at={T.p18.c - 4} n={9}>
        <Bub x={540} y={1050} w={460} text="Я же любя" size={64} />
      </Pop>
      <Ground />
      <Man x={850} y={G} s={1.3} mouth="grin" eyes="dots" hair="tuft" seed={7} bob />
    </Sheet>
  );
};

// 19. Вот Лера. На ней новое платье.
export const S19: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['ВОТ ЛЕРА']} t={t} />
      <Ground />
      <Lera x={540} s={1.7} t={t} dress={t >= T.p19.dress} />
      <Pop x={540} y={760} t={t} at={T.p19.lera} n={9}>
        <Tx x={540} y={720} size={100} bold={2}>ЛЕРА</Tx>
        <path d="M540 750 V820" strokeWidth={7} />
      </Pop>
      <Pop x={820} y={1200} t={t} at={T.p19.dress} n={9}>
        <Tx x={830} y={1130} size={64} bold={1.2}>новое платье</Tx>
        <path d="M770 1160 L690 1260" strokeWidth={6} />
      </Pop>
    </Sheet>
  );
};

// 20. Коллега говорит: «Ты в нём прямо смелая».
export const S20: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.p20.bold}>
      <Head lines={['КОМПЛИМЕНТ?']} t={t} />
      <Ground />
      <Lera x={290} s={1.6} t={t} />
      <Man x={820} y={G} s={1.6} mouth={talk(t)} eyes="dots" flip la={[-26, 70]} ra={[-30, 70]} seed={3} bob />
      <Pop x={560} y={760} t={t} at={T.p20.say} n={9}>
        <Bub x={560} y={760} w={920} text="Ты в нём прямо смелая" size={58} tail="r" />
      </Pop>
      <Stamp x={300} y={1000} text="СМЕЛАЯ?" t={t} at={T.p20.bold} size={96} />
    </Sheet>
  );
};

// 21. Лера улыбается. Внутри уже нет.
export const S21: React.FC = () => {
  const t = useCurrentFrame();
  const broken = t >= T.p21.no;
  return (
    <Sheet hit={T.p21.no}>
      <Head lines={['ВНУТРИ', 'УЖЕ НЕТ']} t={t} />
      <Ground />
      <Lera x={540} s={2.0} t={t} mouth={broken ? 'flat' : 'smile'} eyes={broken ? 'closed' : 'dots'} brow={broken ? 'sad' : 'none'} />
      <Pop x={540} y={1280} t={t} at={T.p21.smile + 10} n={9}>
        <Heart x={540} y={1300} s={1.6} />
      </Pop>
      {broken && <path d="M545 1250 L525 1305 L560 1320 L540 1375" stroke={PAPER} strokeWidth={9} fill="none" />}
    </Sheet>
  );
};

// 22. «Да шучу», — добавляет он.
export const S22: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.p22.joke}>
      <Head lines={['«ДА ШУЧУ»']} t={t} />
      <Ground />
      <Man x={330} y={G} s={1.8} mouth="grin" eyes="dots" la={[-70, -50]} ra={[70, -50]} seed={3} bob />
      <Lera x={880} s={1.2} t={t} mouth="flat" eyes="dots" brow="sad" />
      <Pop x={560} y={760} t={t} at={T.p22.joke - 4} n={9}>
        <Bub x={560} y={760} w={640} text="Да шучу" size={90} />
      </Pop>
    </Sheet>
  );
};

// 23. Каждый раз одно и то же. Безопасно только тому, кто шутит.
export const S23: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.p23.only}>
      <Head lines={['БЕЗОПАСНО', 'ОДНОМУ']} t={t} />
      <Pop x={540} y={540} t={t} at={T.p23.same} n={9}>
        <Tx x={540} y={540} size={72} bold={1.4}>одно и то же</Tx>
      </Pop>
      <Ground />
      <Man x={190} y={G} s={1.5} mouth="flat" eyes="dots" brow="sad" seed={3} />
      <Man x={740} y={G} s={1.2} mouth="grin" eyes="dots" hair="tuft" seed={7} bob />
      <Dome x={740} r={370} t={t} at={T.p23.safe} />
      <Stamp x={540} y={780} text="ТОЛЬКО ШУТНИКУ" t={t} at={T.p23.only} size={72} />
    </Sheet>
  );
};

// 24. Хорошая шутка устроена иначе. Смешно обоим, и никто не сидит и не смотрит в стол.
export const S24: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.p24.both}>
      <Head lines={['СМЕШНО ОБОИМ']} t={t} />
      <Confetti t={t} at={T.p24.both} top={480} n={40} />
      <Man x={320} y={G - Math.abs(Math.sin(t / 4)) * 40} s={1.7} mouth="grin" eyes="closed" hair="tuft" la={[-60, -70]} ra={[60, -70]} seed={7} />
      <Man x={760} y={G - Math.abs(Math.sin(t / 4 + 1.5)) * 40} s={1.6} mouth="grin" eyes="closed" flip la={[-60, -70]} ra={[60, -70]} seed={3} />
      <Ground />
      <Pop x={540} y={620} t={t} at={T.p24.good} n={9}>
        <Tx x={540} y={640} size={80} bold={1.6}>хорошая шутка</Tx>
      </Pop>
      <Stamp x={540} y={850} text="ОБОИМ" t={t} at={T.p24.both} size={120} />
    </Sheet>
  );
};

// 25. Есть простой тест. Разверни шутку на себя.
export const S25: React.FC = () => {
  const t = useCurrentFrame();
  const flipped = t >= T.p25.flip;
  return (
    <Sheet hit={T.p25.flip}>
      <Head lines={['ТЕСТ:', 'РАЗВЕРНИ НА СЕБЯ']} t={t} />
      <Ground />
      <Man x={290} y={G} s={1.6} mouth={flipped ? 'o' : 'grin'} eyes={flipped ? 'wide' : 'dots'} hair="tuft" seed={7} bob />
      <Man x={830} y={G} s={1.4} mouth="flat" eyes="dots" brow="sad" seed={3} />
      <Pop x={560} y={560} t={t} at={T.p25.test} n={9}>
        <Bub x={560} y={560} w={500} text="шутка" size={84} />
      </Pop>
      {!flipped && <Draw t={t} at={T.p25.test + 6} n={14} strokeWidth={9} d="M420 980 H760 M722 948 L762 980 L722 1012" />}
      {flipped && <Draw t={t} at={T.p25.flip} n={16} strokeWidth={9} d="M830 1060 C830 760 330 760 300 1090 M262 1050 L300 1096 L338 1050" />}
    </Sheet>
  );
};

// 26. Скажи то же самое про себя. При всех.
export const S26: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['ПРО СЕБЯ.', 'ПРИ ВСЕХ']} t={t} />
      <Ground />
      {t >= T.p26.all && [130, 300, 780, 950].map((x, i) => (
        <Pop key={x} x={x} y={G - 120} t={t} at={T.p26.all + i * 3} n={7}>
          <Man x={x} y={G} s={0.95} mouth="flat" eyes="wide" flip={i > 1} seed={i + 1} />
        </Pop>
      ))}
      <Man x={540} y={G} s={1.9} mouth={talk(t)} eyes="dots" hair="tuft" la={[-26, 70]} ra={[26, 70]} seed={7} bob />
      <Pop x={540} y={620} t={t} at={T.p26.self - 6} n={9}>
        <Bub x={540} y={620} w={800} text="Ну я и тормоз!" size={78} />
      </Pop>
    </Sheet>
  );
};

// 27. Смешно? Значит, это была шутка.
export const S27: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.p27.yes}>
      <Head lines={['СМЕШНО?', 'ЗНАЧИТ, ШУТКА']} t={t} />
      <Confetti t={t} at={T.p27.yes} top={480} n={40} />
      <Man x={380} y={G - Math.abs(Math.sin(t / 4)) * 36} s={1.9} mouth="grin" eyes="closed" hair="tuft" la={[-60, -70]} ra={[60, -70]} seed={7} />
      <Ground />
      <Check x={810} y={900} t={t} at={T.p27.yes} s={4} />
      <Stamp x={700} y={1200} text="ШУТКА" t={t} at={T.p27.yes + 6} size={110} />
    </Sheet>
  );
};

// 28. Стало неловко, и ты начал объяснять? Хуйня, а не юмор.
export const S28: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.p28.st}>
      <Head lines={['НЕЛОВКО —', 'НЕ ЮМОР']} t={t} />
      <Ground />
      <Man x={540} y={G} s={1.9} mouth="o" eyes="wide" brow="sad" la={[-60, -30]} ra={[60, -30]} seed={3} />
      {t >= T.p28.awk && [0, 1, 2].map((i) => {
        const p = (t - T.p28.awk - i * 7) % 24;
        return <ellipse key={i} cx={430 + i * 110} cy={headY(1.9) - 40 + p * 3} rx={9} ry={15} fill={INK} opacity={1 - p / 30} />;
      })}
      <Pop x={540} y={660} t={t} at={T.p28.expl - 8} n={9}>
        <Tx x={540} y={640} size={66} bold={1.2}>ну это просто…</Tx>
        <Tx x={540} y={730} size={52} bold={1}>ну ты понимаешь…</Tx>
        <Tx x={540} y={810} size={40} bold={0.8}>ну…</Tx>
      </Pop>
      <Stamp x={540} y={960} text="НЕ ЮМОР" t={t} at={T.p28.st} size={110} />
    </Sheet>
  );
};

// 29. А теперь пошути над Димой. Посмотри, как быстро он станет серьёзным.
export const S29: React.FC = () => {
  const t = useCurrentFrame();
  const sr = t >= T.p29.serious - 20;
  return (
    <Sheet>
      <Head lines={['ПОШУТИ', 'НАД ДИМОЙ']} t={t} />
      <Ground />
      <Man x={320} y={G} s={1.7} mouth={sr ? 'flat' : 'grin'} eyes={sr ? 'up' : 'dots'} brow={sr ? 'angry' : 'none'} hair="tuft" seed={7} bob />
      <Man x={830} y={G} s={1.5} mouth={talk(t)} eyes="dots" flip la={[-26, 70]} ra={[-30, 70]} seed={3} bob />
      <Pop x={560} y={760} t={t} at={T.p29.dima - 4} n={9}>
        <Bub x={560} y={760} w={860} text="Ну ты и тормоз!" size={74} tail="r" />
      </Pop>
    </Sheet>
  );
};

// 30. Чувство юмора, нахуй, внезапно кончится.
export const S30: React.FC = () => {
  const t = useCurrentFrame();
  const level = 1 - easeOut(clamp((t - T.p30.end) / 22));
  return (
    <Sheet hit={T.p30.st}>
      <Head lines={['БАТАРЕЙКА', 'ЮМОРА']} t={t} />
      <g strokeWidth={8}>
        <rect x={250} y={500} width={560} height={230} rx={28} fill={PAPER} />
        <rect x={810} y={575} width={40} height={80} rx={10} fill={INK} />
        <rect x={270} y={520} width={Math.max(0, 520 * level)} height={190} rx={18} fill={INK} stroke="none" />
      </g>
      <Ground />
      <Man x={540} y={G} s={1.8} mouth="flat" eyes="up" brow="angry" hair="tuft" seed={7} />
      <Stamp x={540} y={900} text="ЮМОР = 0" t={t} at={T.p30.end} size={110} />
    </Sheet>
  );
};

// 31. Что делать?
export const S31: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet>
      <Head lines={['ЧТО ДЕЛАТЬ?']} t={t} />
      <Ground />
      <Man x={540} y={G} s={1.9} mouth="o" eyes="up" brow="raised" la={[-26, 70]} ra={[20, -120]} seed={4} bob />
      <Pop x={540} y={800} t={t} at={T.p31.do} n={9}>
        <circle cx={540} cy={800} r={80} fill={PAPER} strokeWidth={7} />
        <path d="M500 900 H580 M510 930 H570" strokeWidth={7} />
        <path d="M540 660 V610 M440 700 L400 665 M640 700 L680 665 M420 800 H360 M660 800 H720" strokeWidth={6} />
      </Pop>
    </Sheet>
  );
};

// 32. Если хочется добавить «я пошутил», остановись.
export const S32: React.FC = () => {
  const t = useCurrentFrame();
  const pts = Array.from({ length: 8 }, (_, i) => {
    const a = (Math.PI / 4) * i + Math.PI / 8;
    return `${760 + Math.cos(a) * 150},${700 + Math.sin(a) * 150}`;
  }).join(' ');
  return (
    <Sheet hit={T.p32.stop}>
      <Head lines={['ОСТАНОВИСЬ']} t={t} />
      <Ground />
      <Man x={320} y={G} s={1.8} mouth="open" eyes="dots" hair="tuft" la={[-26, 70]} ra={[50, -160]} seed={7} bob />
      <Pop x={400} y={820} t={t} at={T.p32.add - 10} n={9}>
        <Tx x={400} y={830} size={74} bold={1.4}>…я пошутил</Tx>
        {t >= T.p32.stop && <path d="M210 815 H590" strokeWidth={10} />}
      </Pop>
      <Pop x={760} y={700} t={t} at={T.p32.stop} n={9}>
        <polygon points={pts} fill={INK} stroke={INK} strokeWidth={6} />
        <Tx x={760} y={730} size={80} fill={PAPER} bold={1.6}>СТОП</Tx>
      </Pop>
    </Sheet>
  );
};

// 33. Шутке подпись не нужна. Подпись нужна замечанию, которому нужен запасной выход.
export const S33: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.p33.exit}>
      <Head lines={['ПОДПИСЬ =', 'ЗАПАСНОЙ ВЫХОД']} t={t} />
      <Pop x={300} y={600} t={t} at={T.p33.sign - 8} n={9}>
        <Bub x={300} y={600} w={440} text="Шутка" size={78} />
        <Tx x={300} y={770} size={52} bold={1}>(пошутил)</Tx>
        {t >= T.p33.sign + 6 && <path d="M170 765 H430" strokeWidth={8} />}
      </Pop>
      <Pop x={540} y={1000} t={t} at={T.p33.rem - 6} n={9}>
        <Bub x={540} y={1000} w={780} text="Ты в нём смелая" size={60} />
        <Tx x={540} y={1130} size={52} bold={1}>(пошутил)</Tx>
      </Pop>
      <Pop x={940} y={1350} t={t} at={T.p33.exit} n={9}>
        <rect x={850} y={1230} width={170} height={340} fill={PAPER} strokeWidth={7} />
        <circle cx={990} cy={1410} r={10} fill={INK} />
        <Tx x={935} y={1190} size={46} bold={1}>ВЫХОД</Tx>
      </Pop>
      <Ground />
      <Man x={150} y={G} s={1.2} mouth="smile" eyes="dots" hair="tuft" seed={7} bob />
    </Sheet>
  );
};

// 34. Так что если ты уже сказал «я пошутил», это была не шутка.
export const S34: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={T.p34.no}>
      <Head lines={['ЭТО БЫЛА', 'НЕ ШУТКА']} t={t} />
      <Ground />
      <Man x={540} y={G} s={1.9} mouth="smile" eyes="dots" brow="sad" hair="tuft" la={[-70, -40]} ra={[70, -40]} seed={7} bob />
      <Pop x={540} y={700} t={t} at={T.p34.said - 6} n={9}>
        <Bub x={540} y={700} w={760} text="я пошутил" size={86} />
      </Pop>
      <Stamp x={540} y={960} text="НЕ ШУТКА" t={t} at={T.p34.no} size={120} />
    </Sheet>
  );
};
