import { Audio } from "@remotion/media";
import type React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  random,
  Series,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Grain, Osd, Scanlines, TrackingBand, VhsDefs, Vignette } from "./Vhs";

type Move = "in" | "out" | "left" | "right" | "up" | "down";

// [camera move, frames at 30 fps, tracking tear at frame (or null)]. Same cut points as Bratok90.
const SCENES: readonly (readonly [Move, number, number | null])[] = [
  ["in", 98, 52], // 1 street: walks toward camera
  ["out", 30, 0], // 2 sauna
  ["in", 50, null], // 3 feast close-up
  ["left", 75, 0], // 4 mirror
  ["up", 75, null], // 5 phone by the car
  ["right", 60, 0], // 6 escape through the window
  ["down", 150, 90], // 7 church: tilt down to the hands
  ["right", 112, 0], // 8 cortege
];

// Camera move over the still plus a small handheld wobble built from mismatched sines.
const Picture: React.FC<{ src: string; move: Move; duration: number }> = ({ src, move, duration }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, duration], [0, 1], { extrapolateRight: "clamp" });
  const pan = interpolate(t, [0, 1], [-45, 45]);
  const scale = move === "in" ? 1.06 + t * 0.1 : move === "out" ? 1.16 - t * 0.1 : 1.14;
  const x = (move === "left" ? -pan : move === "right" ? pan : 0) + Math.sin(frame * 0.21) * 7 + Math.sin(frame * 0.53) * 3;
  const y = (move === "up" ? -pan : move === "down" ? pan : 0) + Math.sin(frame * 0.17 + 1) * 6 + Math.sin(frame * 0.61) * 2;
  const rot = Math.sin(frame * 0.13) * 0.35;
  return (
    <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${scale})` }}>
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "url(#vhs-rgb) saturate(1.25) contrast(1.1) sepia(0.12) blur(0.7px)",
        }}
      />
    </AbsoluteFill>
  );
};

// Realistic version: one still per scene (public/real/sceneN.png) brought to life by camera + VHS tape look.
export const BratokReal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const flicker = 0.96 + random(`flicker-${frame}`) * 0.06;
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
        <Series>
          {SCENES.map(([move, frames, tear], i) => {
            const src = staticFile(`real/scene${i + 1}.png`);
            return (
              <Series.Sequence key={i} durationInFrames={frames}>
                <Picture src={src} move={move} duration={frames} />
                {tear !== null && (
                  <TrackingBand from={tear} length={tear === 0 ? 9 : 14} height={90}>
                    <Picture src={src} move={move} duration={frames} />
                  </TrackingBand>
                )}
              </Series.Sequence>
            );
          })}
        </Series>
      </AbsoluteFill>
      <Scanlines />
      <Grain />
      <Vignette />
      <Osd date="OCT. 30 1996" startSec={24 * 60 + 7} fps={fps} />
    </AbsoluteFill>
  );
};
