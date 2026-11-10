import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { clamp } from '../../engine/anim';
import { H, W } from '../piter-bw/shots';
import * as S1 from './shots';
import * as S2 from './shots2';
import { FADE, PLANS, TOTAL, VOICE_END } from './timing';

// «Голосовое на четыре минуты»: вертикальный ЧБ. Границы и моменты внутри планов лежат в timing.ts
// (генерирует final-video/tools/gen_timing.py по best_words.json, 30 fps), склейки жёсткие, голос F5 (клон).
const COMPONENTS: React.FC<{ len: number }>[] = [
  S1.S1, S1.S2, S1.S3, S1.S4, S1.S5, S1.S6, S1.S7,
  S2.S8, S2.S9, S2.S10, S2.S11, S2.S12, S2.S13, S2.S14, S2.S15, S2.S16, S2.S17, S2.S18, S2.S19, S2.S20,
  S2.S21, S2.S22, S2.S23, S2.S24, S2.S25, S2.S26, S2.S27, S2.S28, S2.S29,
];
const SHOTS = COMPONENTS.map((C, i) => ({ C, a: PLANS[i][0], b: PLANS[i][1] }));

const Main: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: '#fff' }}>
      {SHOTS.map((s) => (
        <Sequence key={s.a} from={s.a} durationInFrames={s.b - s.a}>
          <s.C len={s.b - s.a} />
        </Sequence>
      ))}
      <AbsoluteFill style={{ backgroundColor: '#fff', opacity: clamp((f - (TOTAL - FADE)) / FADE) }} />
      <Audio src={staticFile('golosovoe/voice.wav')} endAt={VOICE_END} />
    </AbsoluteFill>
  );
};

// Раскадровка: по одному кадру на план, на 80 % его длины.
const Board: React.FC = () => {
  const s = SHOTS[Math.min(useCurrentFrame(), SHOTS.length - 1)];
  const len = s.b - s.a;
  return (
    <AbsoluteFill style={{ backgroundColor: '#fff' }}>
      <Sequence from={-Math.round(len * 0.8)}>
        <s.C len={len} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const golosovoeBw = { id: 'GolosovoeBw', total: TOTAL, shotCount: SHOTS.length, width: W, height: H, Main, Board };
