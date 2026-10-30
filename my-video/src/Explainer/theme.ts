import { loadFont } from "@remotion/google-fonts/Montserrat";
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import type { Accent, Line } from "./types";

export const { fontFamily } = loadFont("normal", {
  weights: ["600", "700", "800"],
  subsets: ["cyrillic", "latin"],
});

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const COLORS: Record<Accent, string> = {
  white: "#FFFFFF",
  orange: "#E8732C",
  green: "#6EDB8F",
  red: "#E5484D",
  grey: "#9A9A9A",
};

export const UI = {
  bg: "#000000",
  panel: "#151515",
  panelBorder: "#2a2a2a",
  pill: "#1a1a1a",
  dim: "#3a3a3a",
  dimText: "#666666",
};

export const SIZES: Record<NonNullable<Line["size"]>, number> = {
  xl: 72,
  l: 52,
  m: 38,
  s: 26,
};

export const accent = (c: Accent | undefined, fallback: Accent = "white") =>
  COLORS[c ?? fallback];

/** rgba tint of a hex colour. */
export const tint = (hex: string, alpha: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

export const easeOut = Easing.out(Easing.cubic);

/** 0..1 progress between `start` and `start + dur` frames, eased out. */
export const prog = (frame: number, start: number, dur: number) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

/** Fade + rise-in style, starting at `delay` frames. */
export const appear = (frame: number, delay = 0, dur = 10, rise = 16) => {
  const p = prog(frame, delay, dur);
  return {
    opacity: p,
    transform: `translateY(${(1 - p) * rise}px)`,
  } as const;
};

/** Frames between staggered items (~0.25 s at 30 fps). */
export const STAGGER = 8;

/** Frames to subtract for an element that starts later than its scene. */
export const DelayContext = React.createContext(0);

/** Like useCurrentFrame(), but relative to the element's own start (can be negative before it). */
export const useElementFrame = () => useCurrentFrame() - React.useContext(DelayContext);
