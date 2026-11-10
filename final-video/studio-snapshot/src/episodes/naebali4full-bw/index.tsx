import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { clamp } from '../../engine/anim';
import { H, W } from '../piter-bw/shots';
import * as S from './shots';
import * as X from './scenes';
import { FADE, PLANS, TOTAL, VOICE_END } from './timing';

// НАЕБАЛИ №4 «Одно яйцо, одна сиська»: вертикальный ЧБ, 13 планов. Границы и моменты внутри планов лежат в timing.ts (final-video/tools/gen_timing.py по best_words.json, 30 fps), склейки жёсткие, голос F5 (клон).
const COMPONENTS: React.FC<{ len: number }>[] = [S.B1, S.B2, S.B3, S.B4, S.B5, S.B6, S.B7, X.N1, X.N2, X.N3, X.N4, S.B8, S.B10, S.B9, X.N5, X.N6, X.N7, X.N8, X.N9, X.N10, S.B11, S.B12, X.N11, X.N12, X.N13, X.N14, X.N15, X.N16, X.N17, S.B13];
const SHOTS = PLANS.map(([a, b], i) => ({ C: COMPONENTS[i], a, b }));

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
      <Audio src={staticFile('naebali4full/voice.wav')} endAt={VOICE_END} />
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

export const naebali4FullBw = { id: 'Naebali4FullBw', total: TOTAL, shotCount: SHOTS.length, width: W, height: H, Main, Board };
