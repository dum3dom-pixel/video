import { makeEpisode } from '../../bw/episode';
import * as S from './shots';
import * as T from './timing';

// «Эффект Рингельмана» на 60 с: вертикальный ЧБ, 26 планов. Границы и моменты планов в timing.ts (final-video/tools/gen_timing.py), сборка общая: src/bw/episode.tsx.
export const ringelman60Bw = makeEpisode({ id: 'Ringelman60Bw', shots: S, timing: T, audio: 'ringelman60/voice.wav' });
