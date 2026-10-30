import type React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { City, GROUND_Y } from "./City";
import {
  circlePoints,
  GRAPHITE,
  Hatch,
  PAPER,
  PaperGrain,
  SketchLine,
  SketchText,
} from "./sketch";

const RED = "#e63946";
const R = 60; // ball radius
const LAND_X = 1500;
const LAND_FRAME = 84;
const WAVE_FRAMES = 18;

type Hop = {
  readonly from: number;
  readonly to: number;
  readonly x0: number;
  readonly x1: number;
  readonly h: number;
  readonly depth?: number; // squash strength on landing
};

// Each hop is a parabola; the ball squashes right after it lands (= at `from`).
const HOPS: readonly Hop[] = [
  { from: 24, to: 36, x0: -80, x1: 170, h: 120 },
  { from: 36, to: 48, x0: 170, x1: 340, h: 110 },
  { from: 48, to: 60, x0: 340, x1: 520, h: 100 },
  { from: 60, to: LAND_FRAME, x0: 520, x1: LAND_X, h: 520 }, // over the wall
  { from: LAND_FRAME, to: 96, x0: LAND_X, x1: 1560, h: 45, depth: 1.3 },
  { from: 96, to: 102, x0: 1560, x1: 1580, h: 18, depth: 0.5 },
  { from: 108, to: 114, x0: 1580, x1: 1580, h: 80, depth: 0.7 },
  { from: 114, to: 120, x0: 1580, x1: 1580, h: 60, depth: 0.6 },
];

const ballPose = (frame: number) => {
  const hop = HOPS.find((h) => frame >= h.from && frame < h.to);
  if (!hop) {
    const last = [...HOPS].reverse().find((h) => h.to <= frame);
    return { x: last ? last.x1 : -200, lift: 0, sx: 1, sy: 1 };
  }
  const t = (frame - hop.from) / (hop.to - hop.from);
  const squash =
    (hop.depth ?? 1) *
    interpolate(frame - hop.from, [0, 3], [1, 0], {
      extrapolateRight: "clamp",
    });
  const stretch = 0.18 * Math.abs(1 - 2 * t) * (1 - Math.min(squash, 1));
  return {
    x: interpolate(t, [0, 1], [hop.x0, hop.x1]),
    lift: 4 * hop.h * t * (1 - t),
    sx: 1 + 0.32 * squash - stretch * 0.7,
    sy: 1 - 0.38 * squash + stretch,
  };
};

const Ball: React.FC = () => {
  const frame = useCurrentFrame();
  const { x, lift, sx, sy } = ballPose(frame);
  return (
    <g>
      <ellipse
        cx={x}
        cy={GROUND_Y + 6}
        rx={R * (1 - lift / 800) * 1.1}
        ry={9}
        fill={GRAPHITE}
        opacity={0.12}
      />
      <g transform={`translate(${x} ${GROUND_Y - lift}) scale(${sx} ${sy})`}>
        <circle cx={0} cy={-R} r={R} fill={PAPER} />
        <circle cx={0} cy={-R} r={R} fill={RED} opacity={0.2} />
        <Hatch
          id="ball-hatch"
          x={-R}
          y={-2 * R}
          w={2 * R}
          h={2 * R}
          seed="ball"
          color={RED}
          gap={8}
          width={3}
          opacity={0.9}
          clip={<circle cx={0} cy={-R} r={R} />}
        />
        <SketchLine
          points={circlePoints(0, -R, R)}
          seed="ball"
          closed
          amp={2}
        />
      </g>
    </g>
  );
};

// Sketched burst around the ball right after it lands.
const Impact: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < LAND_FRAME || frame > LAND_FRAME + 8) {
    return null;
  }
  const r0 = 100 + (frame - LAND_FRAME) * 6;
  return (
    <g opacity={interpolate(frame, [LAND_FRAME, LAND_FRAME + 8], [1, 0.2])}>
      {Array.from({ length: 7 }, (_, k) => {
        const a = -Math.PI + ((k + 1) * Math.PI) / 8;
        const len = 40 + (k % 3) * 15;
        return (
          <SketchLine
            key={k}
            seed={`impact${k}`}
            passes={1}
            width={4}
            amp={1.5}
            points={[
              [LAND_X + Math.cos(a) * r0, GROUND_Y - R + Math.sin(a) * r0],
              [
                LAND_X + Math.cos(a) * (r0 + len),
                GROUND_Y - R + Math.sin(a) * (r0 + len),
              ],
            ]}
          />
        );
      })}
    </g>
  );
};

export const BallCity: React.FC = () => {
  const frame = useCurrentFrame();
  const radius = interpolate(
    frame,
    [LAND_FRAME, LAND_FRAME + WAVE_FRAMES],
    [0, 2100],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: PAPER }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <City colored={false} />
        {frame >= LAND_FRAME ? (
          <>
            <clipPath id="wave">
              <circle cx={LAND_X} cy={GROUND_Y} r={radius} />
            </clipPath>
            <g clipPath="url(#wave)">
              <rect width={1920} height={1080} fill={PAPER} />
              <City colored />
            </g>
            <g
              opacity={interpolate(
                frame,
                [LAND_FRAME, LAND_FRAME + WAVE_FRAMES + 4],
                [0.9, 0],
                { extrapolateRight: "clamp" },
              )}
            >
              <SketchLine
                points={circlePoints(LAND_X, GROUND_Y, radius, 90)}
                seed="wave"
                closed
                width={5}
                amp={3}
              />
            </g>
          </>
        ) : null}
        <Impact />
        <Ball />
        {frame >= 108 ? (
          <SketchLine
            points={[
              [640, 255],
              [960, 245],
              [1280, 258],
            ]}
            seed="underline"
            color={RED}
            width={6}
            amp={3}
          />
        ) : null}
        <PaperGrain />
      </svg>
      <SketchText text="Город потерял свои цвета…" from={0} to={60} />
      <SketchText text="…но один шарик помнил" from={60} to={108} />
      <SketchText text="Цвет вернулся" from={108} to={120} />
    </AbsoluteFill>
  );
};
