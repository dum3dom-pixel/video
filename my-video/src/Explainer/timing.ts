import { FPS, STAGGER } from "./theme";
import type { ExplainerSpec, Scene, Transition, VoiceDurations } from "./types";

const TAIL_SECONDS = 0.4;
const FALLBACK_SECONDS = 3;
const DEFAULT_TRANSITION_FRAMES = 10;
export const LEAK_FRAMES = 24;

export const hasVoiceFile = (scene: Scene, durations: VoiceDurations) =>
  Boolean(scene.voice) && durations[scene.id] !== undefined;

/** duration ?? (voice length + 0.4) ?? 3 */
export const sceneSeconds = (scene: Scene, durations: VoiceDurations) =>
  scene.duration ??
  (hasVoiceFile(scene, durations) ? durations[scene.id] + TAIL_SECONDS : FALLBACK_SECONDS);

export const sceneFrames = (scene: Scene, durations: VoiceDurations) =>
  Math.max(1, Math.round(sceneSeconds(scene, durations) * FPS));

/**
 * Scene i starts where scene i-1's own frames end, and transitions overlap the tail of the previous
 * scene (its sequence is extended by the following transition, see `sequenceFrames`). So scene starts,
 * voice windows, sfx cues and total length are the same as without transitions.
 */
export const totalFrames = (spec: ExplainerSpec, durations: VoiceDurations) =>
  spec.scenes.reduce((sum, s) => sum + sceneFrames(s, durations), 0);

/** Absolute frame where scene `index` starts (its transition / cut point). */
export const sceneStart = (spec: ExplainerSpec, durations: VoiceDurations, index: number) =>
  spec.scenes.slice(0, index).reduce((sum, s) => sum + sceneFrames(s, durations), 0);

/** Transition INTO scene `index`; the first scene has none. */
export const sceneTransition = (spec: ExplainerSpec, index: number): Transition =>
  index === 0 ? "cut" : (spec.scenes[index].transition ?? spec.transition ?? "cut");

/** Overlap frames of the transition into scene `index` (0 = hard cut), capped by both neighbouring scenes. */
export const transitionFramesIn = (spec: ExplainerSpec, durations: VoiceDurations, index: number) => {
  if (sceneTransition(spec, index) === "cut") return 0;
  const want = Math.max(1, Math.round(spec.transitionFrames ?? DEFAULT_TRANSITION_FRAMES));
  const prev = sceneFrames(spec.scenes[index - 1], durations);
  const cur = sceneFrames(spec.scenes[index], durations);
  return Math.min(want, prev, cur);
};

/** Sequence length of scene `index`: its own frames + the transition into the next scene, so narration is never cut off. */
export const sequenceFrames = (spec: ExplainerSpec, durations: VoiceDurations, index: number) =>
  sceneFrames(spec.scenes[index], durations) +
  (index + 1 < spec.scenes.length ? transitionFramesIn(spec, durations, index + 1) : 0);

export const sceneHasLeak = (spec: ExplainerSpec, index: number) =>
  index > 0 && (spec.scenes[index].leak ?? spec.leaks ?? false);

export const sceneMotionBlur = (scene: Scene) =>
  scene.motionBlur ?? (scene.camera === "punch" || scene.camera === "shake");

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
