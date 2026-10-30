import { Audio } from "@remotion/media";
import type React from "react";
import { AbsoluteFill, interpolate, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Grain, Osd, Scanlines, VhsDefs, Vignette } from "../BratokReal/Vhs";
import { Guards } from "./Guards";
import { Hero } from "./Hero";
import { Street } from "./Street";

// Scene 1 "street" as a semi-realistic drawn animation (pure SVG), with the same VHS look as BratokReal.
export const BratokRealAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const flicker = 0.97 + random(`flicker-${frame}`) * 0.05;
  // Handheld wobble from mismatched sines.
  const x = Math.sin(frame * 0.21) * 5 + Math.sin(frame * 0.53) * 2;
  const y = Math.sin(frame * 0.17 + 1) * 4 + Math.sin(frame * 0.61) * 1.5;
  const rot = Math.sin(frame * 0.13) * 0.3;
  const cam = (frame / 90) * 0.5;
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Audio
        src={staticFile("bratok-audio.m4a")}
        volume={interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
      />
      <VhsDefs shift={4} />
      <AbsoluteFill style={{ filter: `brightness(${flicker})` }}>
        <AbsoluteFill
          style={{
            transform: `translate(${x}px, ${y}px) rotate(${rot}deg) scale(1.04)`,
            filter: "url(#vhs-rgb) saturate(1.15) contrast(1.08) sepia(0.1) blur(0.5px)",
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 1080 1920">
            <Street cam={cam} />
            <Guards />
            <Hero />
          </svg>
        </AbsoluteFill>
      </AbsoluteFill>
      <Scanlines />
      <Grain />
      <Vignette />
      <Osd date="OCT. 30 1996" startSec={24 * 60 + 7} fps={fps} />
    </AbsoluteFill>
  );
};
