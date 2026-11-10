import { makeEpisode } from '../../bw/episode';
import * as S from './shots';
import * as T from './timing';

// «Инфляция 7 %, а кажется 14»: вертикальный ЧБ на 30 с, 14 планов. Границы и моменты планов в timing.ts (final-video/tools/gen_timing.py), сборка общая: src/bw/episode.tsx.
export const inflyaciya30Bw = makeEpisode({ id: 'Inflyaciya30Bw', shots: S, timing: T, audio: 'inflyaciya30/voice.wav' });
