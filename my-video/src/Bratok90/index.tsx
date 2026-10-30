import { Audio } from "@remotion/media";
import type React from "react";
import { Series, staticFile } from "remotion";
import { Scene1Street } from "./scenes/Scene1Street";
import { Scene2Sauna } from "./scenes/Scene2Sauna";
import { Scene3Feast } from "./scenes/Scene3Feast";
import { Scene4Mirror } from "./scenes/Scene4Mirror";
import { Scene5Phone } from "./scenes/Scene5Phone";
import { Scene6Escape } from "./scenes/Scene6Escape";
import { Scene7Church } from "./scenes/Scene7Church";
import { Scene8Cortege } from "./scenes/Scene8Cortege";

// Hard cuts, 12 fps: 39 + 12 + 20 + 30 + 30 + 24 + 60 + 45 = 260 frames.
const SCENES: readonly (readonly [React.FC, number])[] = [
  [Scene1Street, 39],
  [Scene2Sauna, 12],
  [Scene3Feast, 20],
  [Scene4Mirror, 30],
  [Scene5Phone, 30],
  [Scene6Escape, 24],
  [Scene7Church, 60],
  [Scene8Cortege, 45],
];

// Audio track taken from the reference clip (21.6 s).
export const Bratok90: React.FC = () => (
  <>
    <Audio src={staticFile("bratok-audio.m4a")} />
    <Series>
      {SCENES.map(([Scene, frames], i) => (
        <Series.Sequence key={i} durationInFrames={frames}>
          <Scene />
        </Series.Sequence>
      ))}
    </Series>
  </>
);
