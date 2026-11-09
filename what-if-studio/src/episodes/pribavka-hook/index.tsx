import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { clamp, easeOut, lerp } from '../../engine/anim';
import { H, W, Confetti, Ground, G, Head, Man, Pop, Sheet, Stamp, Tx } from '../piter-bw/shots';
import { Note, Sack } from '../pribavka-bw/shots';
import { PAPER } from '../../lines/kit';

// Новое начало для «Прибавки» (перезалив): хук «плюс тридцать тысяч → через полгода займёшь до получки → вот почему».
// Планы по словам best_words.json (30 fps): 0 «Тебе дали», 52 «Через полгода», 112 «Вот почему».
const A: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={14}>
      <Head lines={['ТЕБЕ ДАЛИ', '+30 000']} t={t} />
      <Ground />
      <Confetti t={t} at={14} top={420} />
      {[0, 1, 2].map((i) => (
        <Note key={i} x={250 + i * 290} y={lerp(300, 480 + (i % 2) * 90, easeOut(clamp((t - i * 5) / 22)))} rot={-14 + i * 14} s={0.8} />
      ))}
      <Man x={540} y={G} s={1.9} mouth="grin" eyes="wide" hair="tuft" la={[-44, -90]} ra={[44, -90]} seed={5} bob />
      <Stamp x={540} y={780} text="ПРИБАВКА!" t={t} at={14} size={118} />
    </Sheet>
  );
};

const B: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={30}>
      <Head lines={['ЧЕРЕЗ ПОЛГОДА']} t={t} />
      <Ground />
      <Sack x={720} y={G} s={1.7} t={t} />
      <Man x={290} y={G} s={1.75} mouth="o" eyes="wide" brow="sad" la={[-26, 70]} ra={[70, -60]} seed={8} bob />
      <Pop x={540} y={700} t={t} at={22}>
        <path d="M110 560 h640 q34 0 34 34 v80 q0 34 -34 34 h-300 l-60 90 l-30 -90 h-250 q-34 0 -34 -34 v-80 q0 -34 34 -34 Z" fill={PAPER} />
        <Tx x={430} y={655} size={84} bold={1.6}>займи до получки</Tx>
      </Pop>
    </Sheet>
  );
};

const C: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Sheet hit={6}>
      <Head lines={['ВОТ ПОЧЕМУ']} t={t} />
      <Ground />
      <Stamp x={540} y={900} text="КУДА ДЕНЬГИ?" t={t} at={4} size={120} rot={-5} />
      <Man x={540} y={G} s={1.7} mouth="flat" eyes="up" brow="raised" la={[-30, 70]} ra={[70, -70]} seed={3} bob />
    </Sheet>
  );
};

const SHOTS = [{ C: A, a: 0, b: 52 }, { C: B, a: 52, b: 112 }, { C: C, a: 112, b: 136 }];

const Main: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#fff' }}>
    {SHOTS.map((s) => (
      <Sequence key={s.a} from={s.a} durationInFrames={s.b - s.a}><s.C /></Sequence>
    ))}
    <Audio src={staticFile('pribavka_hook/voice.wav')} />
  </AbsoluteFill>
);

const Board: React.FC = () => {
  const s = SHOTS[Math.min(useCurrentFrame(), SHOTS.length - 1)];
  return <AbsoluteFill style={{ backgroundColor: '#fff' }}><Sequence from={-Math.round((s.b - s.a) * 0.8)}><s.C /></Sequence></AbsoluteFill>;
};

export const pribavkaHook = { id: 'PribavkaHook', total: 136, shotCount: SHOTS.length, width: W, height: H, Main, Board };
