import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { clamp } from '../../engine/anim';
import { H, W } from '../piter-bw/shots';
import * as S from './shots';
import * as S2 from './shots2';
import { FADE, PLANS, TOTAL as FULL_TOTAL, VOICE_END } from './timing';

// «Ссора: требование — уход»: вертикальный ЧБ, голос F5 (клон), склейки жёсткие. Границы планов лежат в timing.ts (gen_timing.py).
// Пока сцен меньше, чем планов, рендерится тест: только нарисованные планы, голос обрезан по концу последнего из них.
const COMPONENTS: React.FC<{ len: number }>[] = [
  S.S1, S.S2, S.S3, S.S4, S.S5, S.S6, S.S7, S2.S8, S2.S9, S2.S10, S2.S11, S2.S12, S2.S13, S2.S14, S2.S15, S2.S16, S2.S17, S2.S18, S2.S19,
  S2.S20, S2.S21, S2.S22, S2.S23, S2.S24, S2.S25, S2.S26, S2.S27, S2.S28, S2.S29, S2.S30, S2.S31,
];
const SHOTS = PLANS.slice(0, COMPONENTS.length).map(([a, b], i) => ({ C: COMPONENTS[i], a, b }));
const PARTIAL = COMPONENTS.length < PLANS.length;
const TOTAL = PARTIAL ? SHOTS[SHOTS.length - 1].b : FULL_TOTAL;

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
      <Audio src={staticFile('ssora/voice.wav')} endAt={PARTIAL ? TOTAL : VOICE_END} />
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

export const ssoraBw = { id: 'SsoraBw', total: TOTAL, shotCount: SHOTS.length, width: W, height: H, Main, Board };
