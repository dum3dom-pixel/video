import { Audio } from "@remotion/media";
import React from "react";
import { interpolate, staticFile } from "remotion";
import type { Music } from "./types";

const RAMP = 6; // frames to duck down / back up around narration
const FADE_IN = 10;
const FADE_OUT = 20;

export const MusicTrack: React.FC<{
  music: Music;
  windows: [number, number][]; // absolute frame ranges where narration plays
  totalFrames: number;
}> = ({ music, windows, totalFrames }) => {
  const base = music.volume ?? 0.15;
  const duck = music.duck ?? 0.35;
  const volume = (f: number) => {
    let ducked = 0;
    for (const [s, e] of windows) {
      const d = interpolate(f, [s - RAMP, s, e, e + RAMP], [0, 1, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      ducked = Math.max(ducked, d);
    }
    const fade = Math.min(
      interpolate(f, [0, FADE_IN], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      interpolate(f, [totalFrames - FADE_OUT, totalFrames], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    );
    return base * (1 - ducked * (1 - duck)) * fade;
  };
  return <Audio src={staticFile(music.src)} loop loopVolumeCurveBehavior="extend" volume={volume} />;
};
