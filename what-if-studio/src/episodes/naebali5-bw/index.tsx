import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { clamp } from '../../engine/anim';
import { H, W } from '../piter-bw/shots';
import * as S from './shots';
import { FADE, PLANS, TOTAL, VOICE_END } from './timing';

// НАЕБАЛИ №5 «Шесть квартир»: вертикальный ЧБ, 13 планов. Границы и моменты внутри планов лежат в timing.ts (final-video/tools/gen_timing.py по best_words.json, 30 fps), склейки жёсткие, голос F5 (клон).
const COMPONENTS: React.FC<{ len: number }>[] = [S.A1, S.A2, S.A3, S.A4, S.A5, S.A6, S.A7, S.A8, S.A9, S.A10, S.A11, S.A12, S.A13];
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
      <Audio src={staticFile('naebali5/voice.wav')} endAt={VOICE_END} />
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

export const naebali5Bw = { id: 'Naebali5Bw', total: TOTAL, shotCount: SHOTS.length, width: W, height: H, Main, Board };
