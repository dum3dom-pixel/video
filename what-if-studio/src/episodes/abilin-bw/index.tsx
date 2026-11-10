import { makeEpisode } from '../../bw/episode';
import * as S from './shots';
import * as T from './timing';

// «Корпоратив, который никто не хотел» (парадокс Абилина), 60 с: вертикальный ЧБ, 23 плана. Границы и моменты планов в timing.ts (final-video/tools/gen_timing.py), сборка общая: src/bw/episode.tsx.
export const abilinBw = makeEpisode({ id: 'AbilinBw', shots: S, timing: T, audio: 'abilin/voice.wav' });
