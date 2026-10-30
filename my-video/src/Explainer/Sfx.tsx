import { Audio } from "@remotion/media";
import React from "react";
import { Sequence, staticFile } from "remotion";
import { VERSUS_SLAM_FRAME } from "./elements/charts";
import { BUTTON_PRESS_FRAME } from "./elements/ui";
import { FPS, STAGGER } from "./theme";
import { elementDelayFrames } from "./timing";
import type { Scene, SfxName } from "./types";

type Cue = { name: SfxName; frame: number; volume: number };

/** All sound cues of one scene, frames relative to scene start. */
export const sceneCues = (scene: Scene, index: number, enabled: boolean): Cue[] => {
  const cues: Cue[] = [];
  if (enabled) {
    if (index > 0) cues.push({ name: "whoosh", frame: 0, volume: 0.35 });
    (scene.text?.lines ?? []).forEach((_, i) =>
      cues.push({ name: "pop", frame: i * STAGGER, volume: 0.25 }),
    );
    if (scene.camera === "punch") cues.push({ name: "impact", frame: 0, volume: 0.5 });
    const delay = elementDelayFrames(scene);
    if (scene.element?.type === "button") {
      cues.push({ name: "click", frame: delay + BUTTON_PRESS_FRAME, volume: 0.5 });
    }
    if (scene.element?.type === "versus") {
      cues.push({ name: "impact", frame: delay + VERSUS_SLAM_FRAME, volume: 0.5 });
    }
  }
  for (const c of scene.sfx ?? []) {
    cues.push({ name: c.name, frame: Math.round((c.at ?? 0) * FPS), volume: c.volume ?? 0.4 });
  }
  return cues;
};

export const SceneSfx: React.FC<{ cues: Cue[] }> = ({ cues }) => (
  <>
    {cues.map((c, i) => (
      <Sequence key={i} from={c.frame} layout="none">
        <Audio src={staticFile(`sfx/${c.name}.wav`)} volume={c.volume} />
      </Sequence>
    ))}
  </>
);
