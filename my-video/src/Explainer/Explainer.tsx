import { Audio } from "@remotion/media";
import React from "react";
import { TransitionSeries } from "@remotion/transitions";
import { interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CameraMove } from "./Camera";
import { CharacterView } from "./Character";
import { ElementView } from "./elements";
import { ImpactView } from "./Impact";
import { MusicTrack } from "./Music";
import { RankTracker, SectionTag } from "./RankTracker";
import { SceneSfx, sceneCues } from "./Sfx";
import { Subtitles } from "./Subtitles";
import { TextBlock } from "./Text";
import { DelayContext, HEIGHT, UI, WIDTH } from "./theme";
import {
  elementDelayFrames,
  hasVoiceFile,
  LEAK_FRAMES,
  sceneHasLeak,
  sceneMotionBlur,
  sceneStart,
  sceneTransition,
  sequenceFrames,
  totalFrames,
  transitionFramesIn,
  voiceWindows,
} from "./timing";
import { LightLeakOverlay, MotionBlur, presentationFor, transitionTiming } from "./Transitions";
import type { ExplainerSpec, Scene, VoiceDurations, VoiceWord, VoiceWords } from "./types";

export type ExplainerProps = {
  spec: ExplainerSpec;
  voiceDurations: VoiceDurations;
  voiceWords?: VoiceWords;
};

const MARGIN = 60;

/** Horizontal slice [x0, x1] where text/element live, given character placement. */
const contentArea = (scene: Scene): [number, number] => {
  const pos = scene.text?.pos;
  if (pos === "left") return [MARGIN, 960];
  if (pos === "right") return [960, WIDTH - MARGIN];
  if (pos === "center" || pos === "top") return [MARGIN, WIDTH - MARGIN];
  const chars = scene.characters ?? [];
  const left = chars.some((c) => c.pos === "left");
  const right = chars.some((c) => c.pos === "right");
  if (left && right) return [560, 1360];
  if (left) return [860, WIDTH - MARGIN];
  if (right) return [MARGIN, 1060];
  return [MARGIN, WIDTH - MARGIN];
};

const SceneView: React.FC<{
  scene: Scene;
  index: number;
  frames: number;
  sfx: boolean;
  fadeIn: boolean; // 6-frame fade from black; off when a transition brings the scene in
  audioSrc: string | null;
  words: VoiceWord[] | null;
}> = ({ scene, index, frames, sfx, fadeIn, audioSrc, words }) => {
  const frame = useCurrentFrame();
  const fade = fadeIn ? interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" }) : 1;
  const [x0, x1] = contentArea(scene);
  const top = scene.text?.pos === "top";
  const lines = scene.text?.lines ?? [];
  const elementDelay = elementDelayFrames(scene);

  return (
    <div style={{ position: "absolute", inset: 0, background: UI.bg, opacity: fade }}>
      {audioSrc ? <Audio src={audioSrc} /> : null}
      <SceneSfx cues={sceneCues(scene, index, sfx)} />
      <MotionBlur enabled={sceneMotionBlur(scene)}>
        <CameraMove camera={scene.camera} frames={frames}>
          {(scene.characters ?? []).map((c, i) => (
            <CharacterView key={i} c={c} />
          ))}
          {scene.impact ? <ImpactView impact={scene.impact} frame={frame} /> : null}
          <div
            style={{
              position: "absolute",
              left: x0,
              width: x1 - x0,
              top: 0,
              height: HEIGHT,
              boxSizing: "border-box",
              padding: top ? "170px 0 0" : "110px 0 50px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: top ? "flex-start" : "center",
              gap: 48,
            }}
          >
            {lines.length > 0 ? <TextBlock lines={lines} /> : null}
            {scene.element ? (
              <DelayContext.Provider value={elementDelay}>
                <ElementView e={scene.element} />
              </DelayContext.Provider>
            ) : null}
          </div>
        </CameraMove>
      </MotionBlur>
      {scene.tag ? <SectionTag text={scene.tag} /> : null}
      {scene.rank ? <RankTracker rank={scene.rank} /> : null}
      {words ? <Subtitles words={words} frame={frame} /> : null}
    </div>
  );
};

export const Explainer: React.FC<ExplainerProps> = ({ spec, voiceDurations, voiceWords }) => (
  <div style={{ position: "absolute", inset: 0, background: UI.bg }}>
    <TransitionSeries>
      {spec.scenes.flatMap((scene, index) => {
        const frames = sequenceFrames(spec, voiceDurations, index);
        const overlap = transitionFramesIn(spec, voiceDurations, index);
        const presentation = presentationFor(sceneTransition(spec, index));
        const items: React.ReactNode[] = [];
        if (presentation && overlap > 0) {
          items.push(
            <TransitionSeries.Transition
              key={`${scene.id}-in`}
              presentation={presentation}
              timing={transitionTiming(overlap)}
            />,
          );
        }
        items.push(
          <TransitionSeries.Sequence key={scene.id} name={scene.id} durationInFrames={frames}>
            <SceneView
              scene={scene}
              index={index}
              frames={frames}
              sfx={spec.sfx === true}
              fadeIn={overlap === 0}
              audioSrc={
                hasVoiceFile(scene, voiceDurations)
                  ? staticFile(`explainer/${spec.id}/voice/${scene.id}.mp3`)
                  : null
              }
              words={spec.subtitles ? (voiceWords?.[scene.id] ?? null) : null}
            />
          </TransitionSeries.Sequence>,
        );
        return items;
      })}
    </TransitionSeries>
    {/* Light leaks sit above the series, centred on the cut into the scene (a TransitionSeries.Overlay cannot touch a Transition). */}
    {spec.scenes.map((scene, index) => {
      if (!sceneHasLeak(spec, index)) return null;
      const centre = sceneStart(spec, voiceDurations, index) + Math.round(transitionFramesIn(spec, voiceDurations, index) / 2);
      return (
        <Sequence
          key={`${scene.id}-leak`}
          name={`Light leak ${scene.id}`}
          from={Math.max(0, centre - Math.round(LEAK_FRAMES / 2))}
          durationInFrames={LEAK_FRAMES}
        >
          <LightLeakOverlay seed={index} />
        </Sequence>
      );
    })}
    {spec.music ? (
      <MusicTrack
        music={spec.music}
        windows={voiceWindows(spec, voiceDurations)}
        totalFrames={totalFrames(spec, voiceDurations)}
      />
    ) : null}
  </div>
);
