import { FPS, STAGGER } from "./theme";
import type { ExplainerSpec, Scene, VoiceDurations } from "./types";

const TAIL_SECONDS = 0.4;
const FALLBACK_SECONDS = 3;

export const hasVoiceFile = (scene: Scene, durations: VoiceDurations) =>
  Boolean(scene.voice) && durations[scene.id] !== undefined;

/** duration ?? (voice length + 0.4) ?? 3 */
export const sceneSeconds = (scene: Scene, durations: VoiceDurations) =>
  scene.duration ??
  (hasVoiceFile(scene, durations) ? durations[scene.id] + TAIL_SECONDS : FALLBACK_SECONDS);

export const sceneFrames = (scene: Scene, durations: VoiceDurations) =>
  Math.max(1, Math.round(sceneSeconds(scene, durations) * FPS));

export const totalFrames = (spec: ExplainerSpec, durations: VoiceDurations) =>
  spec.scenes.reduce((sum, s) => sum + sceneFrames(s, durations), 0);

/** Frames the scene element is delayed after scene start (after the text lines stagger in). */
export const elementDelayFrames = (scene: Scene) => {
  const n = scene.text?.lines.length ?? 0;
  return n > 0 ? Math.min(n * STAGGER, 24) + 4 : 4;
};

/** Absolute [start, end) frame ranges where a scene's narration plays. */
export const voiceWindows = (spec: ExplainerSpec, durations: VoiceDurations): [number, number][] => {
  const out: [number, number][] = [];
  let start = 0;
  for (const s of spec.scenes) {
    const frames = sceneFrames(s, durations);
    if (hasVoiceFile(s, durations)) {
      out.push([start, start + Math.min(frames, Math.round(durations[s.id] * FPS))]);
    }
    start += frames;
  }
  return out;
};
