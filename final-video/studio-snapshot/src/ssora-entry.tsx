import React from 'react';
import { Composition, registerRoot } from 'remotion';
import './engine/fonts';
import { STUDIO } from './studio.config';
import { ssoraBw as e } from './episodes/ssora-bw';

// Временная точка входа только для «Ссоры»: не зависит от недоделанных эпизодов других сессий.
const common = { width: STUDIO.width, height: STUDIO.height, fps: STUDIO.fps };
registerRoot(() => (
  <>
    <Composition id={e.id} component={e.Main} durationInFrames={Math.max(1, e.total)} {...common} width={e.width} height={e.height} />
    <Composition id={`${e.id}Board`} component={e.Board} durationInFrames={Math.max(1, e.shotCount)} {...common} width={e.width} height={e.height} />
  </>
));
