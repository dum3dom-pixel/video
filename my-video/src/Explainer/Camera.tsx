import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { easeOut } from "./theme";
import type { Camera } from "./types";

const PUSH = 0.03;
const PUNCH = 0.12;
const PUNCH_FRAMES = 8;
const SHAKE_PX = 4;

/** Shake offset in px; interpolated between whole frames so fractional (motion blur) samples follow one coherent path. */
const shakeAt = (axis: "x" | "y", frame: number) => {
  const f0 = Math.floor(frame);
  const a = random(`shake-${axis}-${f0}`);
  const b = random(`shake-${axis}-${f0 + 1}`);
  return (a + (b - a) * (frame - f0) - 0.5) * 2 * SHAKE_PX;
};

/** Per-scene camera move applied to the content container (HUD stays outside). */
export const CameraMove: React.FC<{
  camera?: Camera;
  frames: number;
  children: React.ReactNode;
}> = ({ camera = "push", frames, children }) => {
  const frame = useCurrentFrame(); // read here (not passed in) so motion blur can resample it at fractional frames
  let transform: string | undefined;
  if (camera !== "still") {
    const push = 1 + PUSH * Math.min(1, frame / Math.max(1, frames));
    let scale = push;
    if (camera === "punch") {
      const p = interpolate(frame, [0, PUNCH_FRAMES], [0, 1], {
        extrapolateRight: "clamp",
        easing: easeOut,
      });
      scale *= 1 + PUNCH * (1 - p);
    }
    let shift = "";
    if (camera === "shake") {
      const dx = shakeAt("x", frame);
      const dy = shakeAt("y", frame);
      shift = `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px) `;
    }
    transform = `${shift}scale(${scale})`;
  }
  return <div style={{ position: "absolute", inset: 0, transform }}>{children}</div>;
};
