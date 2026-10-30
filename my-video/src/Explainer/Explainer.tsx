import { Audio } from "@remotion/media";
import React from "react";
import { interpolate, Series, staticFile, useCurrentFrame } from "remotion";
import { CameraMove } from "./Camera";
import { CharacterView } from "./Character";
import { ElementView } from "./elements";
import { MusicTrack } from "./Music";
import { RankTracker, SectionTag } from "./RankTracker";
import { SceneSfx, sceneCues } from "./Sfx";
import { Subtitles } from "./Subtitles";
import { TextBlock } from "./Text";
import { DelayContext, HEIGHT, UI, WIDTH } from "./theme";
import { elementDelayFrames, hasVoiceFile, sceneFrames, totalFrames, voiceWindows } from "./timing";
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
  audioSrc: string | null;
  words: VoiceWord[] | null;
}> = ({ scene, index, frames, sfx, audioSrc, words }) => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" });
  const [x0, x1] = contentArea(scene);
  const top = scene.text?.pos === "top";
  const lines = scene.text?.lines ?? [];
  const elementDelay = elementDelayFrames(scene);

  return (
    <div style={{ position: "absolute", inset: 0, background: UI.bg, opacity: fade }}>
      {audioSrc ? <Audio src={audioSrc} /> : null}
      <SceneSfx cues={sceneCues(scene, index, sfx)} />
      <CameraMove camera={scene.camera} frame={frame} frames={frames}>
        {(scene.characters ?? []).map((c, i) => (
          <CharacterView key={i} c={c} />
        ))}
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
      {scene.tag ? <SectionTag text={scene.tag} /> : null}
      {scene.rank ? <RankTracker rank={scene.rank} /> : null}
      {words ? <Subtitles words={words} frame={frame} /> : null}
    </div>
  );
};

export const Explainer: React.FC<ExplainerProps> = ({ spec, voiceDurations, voiceWords }) => (
  <div style={{ position: "absolute", inset: 0, background: UI.bg }}>
    <Series>
      {spec.scenes.map((scene, index) => {
        const frames = sceneFrames(scene, voiceDurations);
        return (
          <Series.Sequence key={scene.id} durationInFrames={frames}>
            <SceneView
              scene={scene}
              index={index}
              frames={frames}
              sfx={spec.sfx === true}
              audioSrc={
                hasVoiceFile(scene, voiceDurations)
                  ? staticFile(`explainer/${spec.id}/voice/${scene.id}.mp3`)
                  : null
              }
              words={spec.subtitles ? (voiceWords?.[scene.id] ?? null) : null}
            />
          </Series.Sequence>
        );
      })}
    </Series>
    {spec.music ? (
      <MusicTrack
        music={spec.music}
        windows={voiceWindows(spec, voiceDurations)}
        totalFrames={totalFrames(spec, voiceDurations)}
      />
    ) : null}
  </div>
);
