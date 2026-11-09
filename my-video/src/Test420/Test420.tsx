import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { fontFamily } from "../Explainer/theme";
import {
  Blob,
  Book,
  Bubble,
  Calc,
  Calendar,
  Ceiling,
  Clock,
  Cup,
  Door,
  FLOOR,
  Floor,
  Fridge,
  H,
  INK,
  Lamp,
  Notebook,
  PAPER,
  Paper,
  Phone,
  Shelf,
  T,
  Table,
  W,
  Win,
  rnd,
} from "./draw";

export const FPS = 30;
export { W, H };

// Тест формата «рисованный ч/б абсурд + субтитры» (референс — серия MMs03ep08 канала ТО «420»).
export const LINES = [
  { text: "Что, если все твои слова за жизнь прозвучат разом?", dur: 2.6 },
  { text: "Считаем.", dur: 0.42 },
  { text: "Человек говорит около шестнадцати тысяч слов в день.", dur: 2.77 },
  { text: "За двадцать лет — сто семнадцать миллионов.", dur: 2.31 },
  { text: "Больше двухсот томов «Войны и мира».", dur: 1.9 },
];
const PAD = 1.0;
const VOICE_DELAY = 5;
export const starts = LINES.reduce<number[]>((a, l, i) => {
  a.push(i === 0 ? 0 : a[i - 1] + Math.round((LINES[i - 1].dur + PAD) * FPS));
  return a;
}, []);
export const totalFrames = starts[LINES.length - 1] + Math.round((LINES[LINES.length - 1].dur + PAD) * FPS);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const pop = (f: number, at: number, d = 5) => interpolate(f, [at, at + d], [0, 1], clamp);
const spaced = (n: number) => Math.round(n).toLocaleString("ru-RU").replace(/ | /g, " ");

/** Выпрыгивающий пузырь: появляется, плывёт вверх. */
const B: React.FC<{ f: number; at: number; x: number; y: number; text: string; fs?: number; drift?: number; tail?: number }> = ({ f, at, x, y, text, fs = 34, drift = 0.5, tail = 1 }) => {
  const p = pop(f, at);
  if (p <= 0) return null;
  return <Bubble x={x} y={y - (f - at) * drift} text={text} s={0.6 + 0.4 * p} o={p} fs={fs} tail={tail} />;
};

const Counter: React.FC<{ n: number }> = ({ n }) => (
  <g>
    <rect x={1540} y={100} width={320} height={170} rx={10} fill={PAPER} />
    <T x={1700} y={190} size={84}>{spaced(n)}</T>
    <T x={1700} y={246} size={42}>слов в день</T>
  </g>
);

// ---------- 1. Кухня ----------
const S1a: React.FC = () => {
  const f = useCurrentFrame();
  const wave = Math.sin(f / 3) * 14;
  return (
    <>
      <Ceiling />
      <Floor />
      <Door x={80} />
      <Clock x={800} y={200} t={f * 2.5} />
      <Win x={1180} y={120} w={360} h={320} sky="sun" />
      <Fridge x={1640} />
      <Blob x={400} s={1.25} flip hair="bun" glasses seed={2} la={[-50, 10]} ra={[40 + wave, -80]} mouth="grin" bob />
      <Blob x={900} s={1.4} hair="tuft" talk seed={1} la={[-30, 70]} ra={[30, 70]} bob />
      <Table x={560} top={560} w={700} />
      <Lamp x={650} y={560} />
      <Cup x={1100} y={560} f={f} />
      <B f={f} at={6} x={600} y={240} text="и вот я такой…" fs={32} />
      <B f={f} at={16} x={1050} y={290} text="а он мне…" fs={32} />
      <B f={f} at={28} x={760} y={150} text="короче!" fs={32} />
      <g opacity={pop(f, 4)}>
        <T x={640} y={370} size={100} rot={-6}>ТЫ</T>
        <path d="M690 392 Q740 420 808 408 M808 408 l-26 -12 M808 408 l-12 24" />
      </g>
    </>
  );
};

const S1b: React.FC = () => {
  const f = useCurrentFrame();
  const cols = [240, 720, 1200, 1680];
  const heads = ["1 ГОД", "8 ЛЕТ", "35 ЛЕТ", "80 ЛЕТ"];
  return (
    <>
      <Floor />
      <path d="M480 90 V706 M960 90 V706 M1440 90 V706" strokeWidth={2.4} />
      {cols.map((x, i) => (
        <T key={i} x={x} y={150} size={58} o={pop(f, i * 9)}>{heads[i]}</T>
      ))}
      <g opacity={pop(f, 0)}>
        <Blob x={240} s={0.55} talk seed={3} bob la={[-30, 40]} ra={[30, 40]} />
        <circle cx={350} cy={672} r={24} />
        <path d="M330 664 Q350 650 370 664" strokeWidth={2} />
      </g>
      <g opacity={pop(f, 9)}>
        <Blob x={720} s={0.9} hair="tuft" talk seed={4} bob la={[-30, 60]} ra={[40, -60]} />
        <path d="M818 380 V250" strokeWidth={2} />
        <ellipse cx={818} cy={206} rx={34} ry={44} fill={PAPER} />
      </g>
      <g opacity={pop(f, 18)}>
        <Blob x={1200} s={1.3} talk seed={5} bob />
        <rect x={1296} y={626} width={86} height={62} rx={8} fill={PAPER} />
        <path d="M1322 626 v-14 h34 v14" />
      </g>
      <g opacity={pop(f, 27)}>
        <Blob x={1680} s={1.3} hair="grey" cane talk seed={6} bob />
      </g>
      <B f={f} at={4} x={250} y={430} text="агу!" fs={34} drift={0.2} />
      <B f={f} at={13} x={700} y={300} text="мам, смотри!" fs={32} drift={0.2} />
      <B f={f} at={22} x={1190} y={250} text="слушай…" fs={34} drift={0.2} />
      <B f={f} at={31} x={1660} y={250} text="а вот раньше…" fs={32} drift={0.2} />
    </>
  );
};

// ---------- 2. Считаем ----------
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const disp = f < 7 ? "0" : f < 15 ? "16 000" : f < 25 ? "16000×" : "×365";
  return (
    <>
      <Ceiling />
      <Floor />
      <Clock x={1500} y={190} r={64} t={f * 6} />
      <rect x={1180} y={130} width={170} height={130} fill={PAPER} />
      <path d="M1198 230 l30 -50 l24 30 l30 -40 l40 60" strokeWidth={2.4} />
      <Blob x={600} y={720} s={1.5} hair="tuft" pencil mouth="grin" brow="raised" seed={7} la={[40, 72]} ra={[60, 72]} bob />
      <Table x={260} top={600} w={1100} />
      <Notebook x={640} y={540} w={280} h={58} lines={0} />
      <Calc x={1020} y={250} w={250} display={disp} />
      <path d="M700 570 q30 -14 60 0 t60 0" strokeWidth={2.2} />
      <g opacity={pop(f, 10)}>
        <circle cx={740} cy={240} r={32} fill={PAPER} />
        <path d="M728 274 h24 M732 284 h16" />
        <path d="M740 180 v-26 M690 200 l-20 -16 M790 200 l20 -16 M676 240 h-26 M804 240 h26" strokeWidth={2.4} />
      </g>
    </>
  );
};

// ---------- 3. 16 000 слов в день ----------
const WORDS = ["алло!", "ну да", "короче", "слушай", "а он", "прикинь", "ага", "щас", "вообще", "ну…", "слышь", "точно"];
const S3a: React.FC = () => {
  const f = useCurrentFrame();
  const n = interpolate(f, [0, 56], [0, 8000], clamp);
  return (
    <>
      <Ceiling />
      <Floor />
      <Door x={1620} />
      <Clock x={760} y={190} t={f * 14} />
      <Win x={320} y={130} w={320} h={300} sky={f < 28 ? "sun" : "moon"} />
      <Blob x={820} s={1.4} talk seed={8} la={[-30, 70]} ra={[16, -72]} bob />
      <Phone x={918} y={392} rot={10} />
      {WORDS.map((w, i) => {
        const t = f - 3 - i * 4;
        if (t < 0) return null;
        const o = interpolate(t, [0, 5, 34, 44], [0, 1, 1, 0], clamp);
        return <Bubble key={i} x={1000 + t * 9} y={330 + (i % 3) * 70 - t * 0.9 + Math.sin(t / 5) * 10} text={w} fs={30} s={0.8} o={o} />;
      })}
      <Counter n={n} />
    </>
  );
};

const S3b: React.FC = () => {
  const f = useCurrentFrame();
  const heroTalks = Math.floor(f / 14) % 2 === 0;
  const pile = Array.from({ length: 14 }, (_, i) => {
    const row = i < 6 ? 0 : i < 10 ? 1 : i < 13 ? 2 : 3;
    const col = i < 6 ? i : i < 10 ? i - 6 + 0.5 : i < 13 ? i - 10 + 1 : 2.5;
    return { tx: 1450 + col * 72, ty: FLOOR - 24 - row * 46, at: 4 + i * 3.4 };
  });
  return (
    <>
      <Ceiling />
      <Floor />
      <Door x={70} />
      <Clock x={560} y={200} t={30 + f * 3} />
      <Win x={1180} y={130} w={320} h={300} sky="moon" />
      {/* диван */}
      <path d="M440 470 Q440 430 480 430 H1020 Q1060 430 1060 470 V690 H440 Z" fill={PAPER} />
      <path d="M400 540 Q400 500 440 500 Q470 500 470 540 V690 H400 Z M1030 540 Q1030 500 1060 500 Q1100 500 1100 540 V690 H1030 Z" fill={PAPER} />
      <path d="M470 600 H1030" strokeWidth={2.4} />
      <Blob x={640} s={1.25} talk={heroTalks} seed={9} la={[-30, 70]} ra={[50, 20]} bob />
      <Blob x={880} s={1.25} flip hair="bun" glasses talk={!heroTalks} seed={10} la={[-50, 20]} ra={[30, 70]} bob />
      <Lamp x={300} y={560} on />
      <Table x={150} top={560} w={300} />
      {pile.map((p, i) => {
        const t = interpolate(f, [p.at, p.at + 14], [0, 1], clamp);
        if (t <= 0) return null;
        const sx = i % 2 ? 640 : 880;
        const x = sx + (p.tx - sx) * t;
        const y = 300 + (p.ty - 300) * t * t + (1 - t) * -80 * Math.sin(t * Math.PI);
        return (
          <g key={i}>
            <ellipse cx={x} cy={y} rx={34} ry={20} fill={PAPER} />
            <T x={x} y={y + 7} size={20}>бла</T>
          </g>
        );
      })}
      <Counter n={16000} />
    </>
  );
};

// ---------- 4. За двадцать лет ----------
const S4a: React.FC = () => {
  const f = useCurrentFrame();
  const year = 2006 + Math.min(20, Math.floor(f * 0.5));
  const cals: React.ReactNode[] = [];
  for (let row = 0; row < 5; row++) {
    for (let c = 0; c < 8; c++) {
      const i = row * 8 + c;
      if (pop(f, i * 0.9) <= 0) continue;
      cals.push(<Calendar key={i} x={52 + c * 226} y={100 + row * 118} w={130} h={92} seed={i + 1} />);
    }
  }
  const flip = (f % 6) / 6;
  return (
    <>
      {cals}
      <g transform={`translate(760 ${70 + flip * 8})`}>
        <rect x={0} y={0} width={400} height={470} fill={PAPER} strokeWidth={4} />
        <path d="M0 110 H400" />
        <path d="M100 -14 v28 M300 -14 v28" strokeWidth={8} />
        <T x={200} y={92} size={84}>{year}</T>
        {Array.from({ length: 5 }, (_, row) =>
          Array.from({ length: 7 }, (_, c) => <circle key={`${row}${c}`} cx={40 + c * 53} cy={160 + row * 60} r={5} fill={INK} stroke="none" />),
        )}
      </g>
      <g opacity={pop(f, 12)}>
        <rect x={190} y={420} width={420} height={140} fill={PAPER} />
        <T x={400} y={525} size={104} rot={-4}>20 лет</T>
      </g>
    </>
  );
};

const S4b: React.FC = () => {
  const f = useCurrentFrame();
  const eased = 1 - Math.pow(1 - interpolate(f, [2, 44], [0, 1], clamp), 3);
  const v = 16000 + (117_000_000 - 16000) * eased;
  const r = rnd(21);
  const total = interpolate(f, [0, 42], [4, 70], clamp);
  const bubbles: React.ReactNode[] = [];
  for (let i = 0; i < 70; i++) {
    const col = i % 14;
    const row = Math.floor(i / 14);
    const jx = (r() - 0.5) * 24;
    const jy = (r() - 0.5) * 14;
    if (i >= total) continue;
    bubbles.push(
      <g key={i}>
        <ellipse cx={90 + col * 134 + (row % 2) * 60 + jx} cy={FLOOR - 18 - row * 50 + jy} rx={54} ry={26} fill={PAPER} />
        <T x={90 + col * 134 + (row % 2) * 60 + jx} y={FLOOR - 10 - row * 50 + jy} size={24}>бла</T>
      </g>,
    );
  }
  return (
    <>
      <Ceiling />
      <Floor />
      <Door x={70} />
      <Win x={1500} y={130} w={300} h={280} />
      <Blob x={820} s={1.35} hair="grey" mouth="o" eyes="wide" brow="sad" seed={12} la={[-60, -70]} ra={[60, -70]} bob />
      {bubbles}
      <T x={960} y={250} size={170} rot={-3}>{spaced(v)}</T>
      <path d="M470 292 Q960 318 1450 280" strokeWidth={4} opacity={pop(f, 30)} />
    </>
  );
};

// ---------- 5. Двести томов ----------
const S5a: React.FC = () => {
  const f = useCurrentFrame();
  const p = pop(f, 12, 8);
  return (
    <>
      <Shelf x={200} y={100} w={1500} rows={3} rowH={172} seed={4} />
      <path d="M1740 90 V706 M1810 90 V706" strokeWidth={4} />
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} d={`M1740 ${140 + i * 68} H1810`} strokeWidth={3} />
      ))}
      <Blob x={520} s={0.95} eyes="up" mouth="o" brow="raised" seed={13} la={[-30, 70]} ra={[40, -40]} bob />
      <g opacity={p} transform={`translate(${960 - 150 * p} ${140 - 10 * p}) scale(${0.6 + 0.2 * p})`}>
        <Book x={200} y={0} w={380} h={470} />
        <T x={400} y={170} size={64}>ВОЙНА</T>
        <T x={400} y={250} size={52}>и</T>
        <T x={400} y={330} size={64}>МИР</T>
        <path d="M250 80 H530 M250 380 H530" strokeWidth={2.4} />
      </g>
    </>
  );
};

const S5b: React.FC = () => {
  const f = useCurrentFrame();
  const n = Math.min(12, Math.floor(interpolate(f, [0, 28], [0, 12.9], clamp)));
  const r = rnd(8);
  const bookEls = Array.from({ length: n }, (_, i) => {
    const w = 360 + r() * 70;
    return <Book key={i} x={1200 - w / 2 + (r() - 0.5) * 24} y={FLOOR + 16 - (i + 1) * 42} w={w} h={40} />;
  });
  const topY = FLOOR + 16 - 12 * 42;
  return (
    <>
      <Ceiling />
      <Floor />
      <Door x={70} />
      {bookEls}
      <Blob x={640} s={1.25} eyes="up" mouth="o" brow="raised" seed={14} la={[-30, 70]} ra={[8, -78]} bob />
      <g opacity={pop(f, 30)}>
        <Blob x={1200} y={topY + 6} s={0.5} flip talk seed={15} hair="bun" glasses la={[-40, 20]} ra={[40, -60]} bob />
        <Bubble x={1020} y={topY - 160} text="ну ты даёшь" fs={30} />
      </g>
      <g opacity={pop(f, 10)}>
        <T x={1650} y={360} size={170} rot={-6}>200+</T>
        <T x={1650} y={440} size={64} rot={-6}>томов</T>
      </g>
    </>
  );
};

// ---------- сборка ----------
type Cam = { z: [number, number]; x?: [number, number]; origin?: [number, number]; shake?: number };
const SHOTS: { from: number; dur: number; C: React.FC; cam: Cam }[] = [
  { from: 0, dur: 54, C: S1a, cam: { z: [1, 1.06], origin: [900, 400] } },
  { from: 54, dur: 54, C: S1b, cam: { z: [1.04, 1], x: [-20, 20] } },
  { from: 108, dur: 43, C: S2, cam: { z: [1.14, 1], origin: [600, 400] } },
  { from: 151, dur: 56, C: S3a, cam: { z: [1, 1.05], origin: [880, 380] } },
  { from: 207, dur: 57, C: S3b, cam: { z: [1.05, 1], x: [30, -30] } },
  { from: 264, dur: 50, C: S4a, cam: { z: [1, 1.05], origin: [960, 300] } },
  { from: 314, dur: 49, C: S4b, cam: { z: [1, 1.07], origin: [960, 330], shake: 3 } },
  { from: 363, dur: 44, C: S5a, cam: { z: [1.05, 1], x: [-30, 20] } },
  { from: 407, dur: 43, C: S5b, cam: { z: [1, 1.06], origin: [1100, 300] } },
];

const Camera: React.FC<{ cam: Cam; dur: number; children: React.ReactNode }> = ({ cam, dur, children }) => {
  const f = useCurrentFrame();
  const t = f / dur;
  const z = cam.z[0] + (cam.z[1] - cam.z[0]) * t;
  const x = cam.x ? cam.x[0] + (cam.x[1] - cam.x[0]) * t : 0;
  const sh = cam.shake ? (f % 2 ? cam.shake : -cam.shake) : 0;
  const o = cam.origin ?? [W / 2, H / 2];
  return (
    <AbsoluteFill style={{ transform: `translate(${x + sh}px, ${sh / 2}px) scale(${z})`, transformOrigin: `${o[0]}px ${o[1]}px` }}>
      {children}
    </AbsoluteFill>
  );
};

const Caption: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: "absolute", left: 0, right: 0, bottom: 28, display: "flex", justifyContent: "center" }}>
    <span
      style={{
        fontFamily,
        fontWeight: 700,
        fontSize: 44,
        color: "#fff",
        background: "rgba(0,0,0,0.78)",
        padding: "4px 20px",
        borderRadius: 6,
        maxWidth: 1500,
        textAlign: "center",
        lineHeight: 1.25,
      }}
    >
      {text}
    </span>
  </div>
);

export const Test420: React.FC = () => (
  <AbsoluteFill style={{ background: PAPER }}>
    {SHOTS.map(({ from, dur, C, cam }, i) => (
      <Sequence key={i} from={from} durationInFrames={dur}>
        <Camera cam={cam} dur={dur}>
          <Paper>
            <C />
          </Paper>
        </Camera>
      </Sequence>
    ))}
    {LINES.map((l, i) => (
      <Sequence key={`c${i}`} from={starts[i]} durationInFrames={Math.round((l.dur + PAD) * FPS)}>
        <Caption text={l.text} />
        <Sequence from={VOICE_DELAY}>
          <Audio src={staticFile(`test420/t420_${String(i + 1).padStart(3, "0")}.wav`)} />
        </Sequence>
      </Sequence>
    ))}
  </AbsoluteFill>
);
