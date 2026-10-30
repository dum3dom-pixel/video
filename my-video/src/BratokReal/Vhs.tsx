import type React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/VT323";

const { fontFamily } = loadFont();

// Splits the image into R/G/B and shifts red and blue apart (cheap tape chroma bleed).
export const VhsDefs: React.FC<{ shift: number }> = ({ shift }) => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <filter id="vhs-rgb" x="0" y="0" width="100%" height="100%">
      <feColorMatrix in="SourceGraphic" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
      <feOffset in="r" dx={shift} result="r2" />
      <feColorMatrix in="SourceGraphic" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
      <feColorMatrix in="SourceGraphic" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
      <feOffset in="b" dx={-shift} result="b2" />
      <feBlend in="r2" in2="g" mode="screen" result="rg" />
      <feBlend in="rg" in2="b2" mode="screen" />
    </filter>
  </svg>
);

// Per-frame film grain: new turbulence seed every frame.
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.14 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ mixBlendMode: "overlay", opacity }}>
      <svg width="100%" height="100%">
        <filter id={`grain-${frame}`}>
          <feTurbulence type="fractalNoise" baseFrequency={0.85} numOctaves={1} seed={frame} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${frame})`} />
      </svg>
    </AbsoluteFill>
  );
};

export const Scanlines: React.FC = () => (
  <AbsoluteFill
    style={{
      background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0 2px, transparent 2px 5px)",
    }}
  />
);

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.65) 100%)",
    }}
  />
);

// Camcorder on-screen display: blinking PLAY, time and date.
export const Osd: React.FC<{ date: string; startSec: number; fps: number }> = ({
  date,
  startSec,
  fps,
}) => {
  const frame = useCurrentFrame();
  const t = startSec + Math.floor(frame / fps);
  const clock = `AM ${10 + Math.floor(t / 3600)}:${String(Math.floor(t / 60) % 60).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
  const text: React.CSSProperties = {
    fontFamily,
    fontSize: 84,
    color: "#f2f2f2",
    letterSpacing: 4,
    textShadow: "3px 3px 0 rgba(0,0,0,0.6), -2px 0 0 rgba(255,0,60,0.5), 2px 0 0 rgba(0,200,255,0.5)",
    position: "absolute",
  };
  const playOn = Math.floor(frame / (fps / 2)) % 2 === 0;
  return (
    <AbsoluteFill>
      <div style={{ ...text, top: 120, left: 80, opacity: playOn ? 1 : 0, display: "flex", alignItems: "center", gap: 20 }}>
        PLAY
        <div
          style={{
            width: 0,
            height: 0,
            borderTop: "26px solid transparent",
            borderBottom: "26px solid transparent",
            borderLeft: "42px solid #f2f2f2",
          }}
        />
      </div>
      <div style={{ ...text, bottom: 210, left: 80 }}>{clock}</div>
      <div style={{ ...text, bottom: 120, left: 80 }}>{date}</div>
    </AbsoluteFill>
  );
};

// Horizontal tracking tear: a band of the picture slides sideways and brightens.
export const TrackingBand: React.FC<{
  children: React.ReactNode;
  from: number;
  length: number;
  height: number;
}> = ({ children, from, length, height }) => {
  const frame = useCurrentFrame();
  if (frame < from || frame > from + length) return null;
  const y = interpolate(frame, [from, from + length], [1920, -height]);
  const dx = 14 + random(`tear-${frame}`) * 26;
  return (
    <AbsoluteFill style={{ clipPath: `inset(${y}px 0 ${1920 - y - height}px 0)` }}>
      <AbsoluteFill style={{ transform: `translateX(${dx}px)`, filter: "brightness(1.35) saturate(0.6)" }}>
        {children}
      </AbsoluteFill>
      <AbsoluteFill style={{ top: y, height, background: "rgba(255,255,255,0.08)" }} />
    </AbsoluteFill>
  );
};
