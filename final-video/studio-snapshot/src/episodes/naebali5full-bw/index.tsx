import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { clamp } from '../../engine/anim';
import { H, W } from '../piter-bw/shots';
import * as S from './shots';
import * as X from './scenes';
import { FADE, PLANS, TOTAL, VOICE_END } from './timing';

// НАЕБАЛИ №5 «Шесть квартир»: вертикальный ЧБ, 13 планов. Границы и моменты внутри планов лежат в timing.ts (final-video/tools/gen_timing.py по best_words.json, 30 fps), склейки жёсткие, голос F5 (клон).
const COMPONENTS: React.FC<{ len: number }>[] = [S.A1, S.A2, S.A3, S.A4, S.A5, S.A6, X.C1, X.C2, X.C3, X.C4, X.C5, X.C6, X.C7, X.C8, X.C9, S.A7, X.C10, S.A8, X.C11, S.A9, S.A10, X.C12, S.A11, X.C13, X.C14, X.C15, X.C16, S.A12, S.A13];
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
      <Audio src={staticFile('naebali5full/voice.wav')} endAt={VOICE_END} />
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

export const naebali5FullBw = { id: 'Naebali5FullBw', total: TOTAL, shotCount: SHOTS.length, width: W, height: H, Main, Board };
