import React from "react";
import { interpolate, random } from "remotion";
import { easeOut } from "./theme";
import type { Camera } from "./types";

const PUSH = 0.03;
const PUNCH = 0.12;
const PUNCH_FRAMES = 8;
const SHAKE_PX = 4;

/** Per-scene camera move applied to the content container (HUD stays outside). */
export const CameraMove: React.FC<{
  camera?: Camera;
  frame: number;
  frames: number;
  children: React.ReactNode;
}> = ({ camera = "push", frame, frames, children }) => {
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
      const dx = (random(`shake-x-${frame}`) - 0.5) * 2 * SHAKE_PX;
      const dy = (random(`shake-y-${frame}`) - 0.5) * 2 * SHAKE_PX;
      shift = `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px) `;
    }
    transform = `${shift}scale(${scale})`;
  }
  return <div style={{ position: "absolute", inset: 0, transform }}>{children}</div>;
};
