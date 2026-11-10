import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { clamp } from '../engine/anim';
import { H, W } from './core';

// Общая сборка вертикального ЧБ-эпизода: планы по timing.ts, жёсткие склейки, белый уход в конце, голос, раскадровка.
// Раньше этот код копировался в index.tsx каждого эпизода; новый эпизод теперь пишет одну строку:
//   export const fooBw = makeEpisode({ id: 'FooBw', shots: S, timing: T, audio: 'foo/voice.wav' });

export type Shot = React.FC<{ len: number }>;
export type Episode = { id: string; total: number; shotCount: number; width?: number; height?: number; Main: React.FC; Board: React.FC };
type Timing = { TOTAL: number; FADE: number; VOICE_END: number; PLANS: [number, number][] };

/** Сцены S1…Sn из модуля shots по номеру; лишние экспорты (детали рисунка) пропускаются. */
export const shotsOf = (mod: Record<string, unknown>): Shot[] =>
  Object.keys(mod)
    .filter((k) => /^S\d+$/.test(k))
    .sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)))
    .map((k) => mod[k] as Shot);

export const makeEpisode = ({ id, shots, timing, audio }: { id: string; shots: Shot[] | Record<string, unknown>; timing: Timing; audio: string }): Episode => {
  const { TOTAL, FADE, VOICE_END, PLANS } = timing;
  const list = Array.isArray(shots) ? shots : shotsOf(shots);
  if (list.length !== PLANS.length) throw new Error(`${id}: сцен ${list.length}, а планов в timing.ts ${PLANS.length}`);
  const SHOTS = PLANS.map(([a, b], i) => ({ C: list[i], a, b }));

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
        <Audio src={staticFile(audio)} endAt={VOICE_END} />
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

  return { id, total: TOTAL, shotCount: SHOTS.length, width: W, height: H, Main, Board };
};
