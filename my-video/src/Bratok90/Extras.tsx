import type React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import {
  arcPoints,
  ellipsePoints,
  PAPER,
  PaperGrain,
  rectPoints,
  SketchLine,
  SketchShape,
  type Pt,
} from "../BallCity/sketch";

import { GOLD_L } from "./Character";

export const W = 1080;
export const H = 1920;

// Paper-coloured 9:16 canvas with grain; `overlay` is HTML drawn above the svg.
export const Stage: React.FC<{
  readonly children: React.ReactNode;
  readonly overlay?: React.ReactNode;
  readonly bg?: string;
}> = ({ children, overlay, bg = PAPER }) => (
  <AbsoluteFill style={{ backgroundColor: bg }}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {children}
      <PaperGrain count={260} width={W} height={H} />
    </svg>
    {overlay}
  </AbsoluteFill>
);

// Flat coloured block with hatching and an outline.
export const Block: React.FC<{
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly fill: string;
  readonly hatch: string;
  readonly gap?: number;
  readonly opacity?: number;
  readonly line?: boolean;
}> = ({ id, x, y, w, h, fill, hatch, gap = 14, opacity = 0.5, line = true }) => (
  <SketchShape id={id} points={rectPoints(x, y, w, h)} seed={id} fill={fill} hatch={hatch} gap={gap} hatchOpacity={opacity} outline={line} width={3.5} />
);

// Brick grid drawn as one boiling path.
export const Bricks: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly color: string;
  readonly seed: string;
  readonly bw?: number;
  readonly bh?: number;
  readonly opacity?: number;
}> = ({ x, y, w, h, color, seed, bw = 90, bh = 40, opacity = 0.7 }) => {
  const frame = useCurrentFrame();
  const j = (i: number) => (random(`${seed}-${frame}-${i}`) - 0.5) * 3;
  let d = "";
  let n = 0;
  const seg = (x0: number, y0: number, x1: number, y1: number) => {
    d += `M${(x0 + j(n++)).toFixed(1)} ${(y0 + j(n++)).toFixed(1)}L${(x1 + j(n++)).toFixed(1)} ${(y1 + j(n++)).toFixed(1)}`;
  };
  const rows = Math.ceil(h / bh);
  for (let r = 0; r <= rows; r++) {
    const yy = Math.min(y + r * bh, y + h);
    seg(x, yy, x + w, yy);
    if (r === rows) {
      continue;
    }
    for (let cx = x + (r % 2) * (bw / 2); cx < x + w; cx += bw) {
      if (cx > x) {
        seg(cx, yy, cx, Math.min(yy + bh, y + h));
      }
    }
  }
  return <path d={d} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" opacity={opacity} />;
};

type SilProps = {
  readonly x: number;
  readonly y: number; // feet
  readonly s?: number;
  readonly color: string;
  readonly hatch: string;
  readonly uid: string;
  readonly scarf?: string;
  readonly fur?: boolean;
  readonly hair?: string;
};

// Simple standing person: head, shoulders, long coat. Optional headscarf or fur coat.
export const Silhouette: React.FC<SilProps> = ({ x, y, s = 1, color, hatch, uid, scarf, fur, hair = "#2a2018" }) => {
  const edge = (side: number): Pt[] =>
    fur
      ? Array.from({ length: 9 }, (_, i): Pt => [side * (74 + (i % 2) * 14 + i * 1.5), -285 + i * 36])
      : [[side * 66, -285], [side * 82, -120], [side * 90, 0]];
  const left = edge(-1);
  const right = edge(1);
  const body: Pt[] = [...left, ...[...right].reverse()];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <SketchShape id={`${uid}-body`} points={body} seed={`${uid}b`} fill={color} hatch={hatch} gap={9} hatchOpacity={0.55} width={3.5} passes={1} />
      <SketchShape id={`${uid}-head`} points={ellipsePoints(0, -335, 38, 46, 14)} seed={`${uid}h`} fill="#e3b995" hatch="#c98a60" gap={9} hatchOpacity={0.4} width={3} passes={1} />
      {scarf ? (
        <SketchShape id={`${uid}-scarf`} points={[...arcPoints(0, -335, 46, 54, 160, 380, 10), [40, -285], [-40, -285]]} seed={`${uid}s`} fill={scarf} hatch="#000" gap={8} hatchOpacity={0.3} width={3} passes={1} />
      ) : (
        <SketchShape id={`${uid}-hair`} points={arcPoints(0, -338, 42, 50, 180, 360, 10)} seed={`${uid}hr`} fill={hair} width={3} passes={1} />
      )}
    </g>
  );
};

// Big bodyguard: black suit, white shirt, tie, sunglasses.
export const Guard: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly uid: string; readonly bob?: number }> = ({ x, y, s = 1, uid, bob = 0 }) => (
  <g transform={`translate(${x} ${y + bob}) scale(${s})`}>
    <SketchShape id={`${uid}-legs`} points={[[-85, 0], [85, 0], [78, 220], [8, 220], [0, 40], [-8, 220], [-78, 220]]} seed={`${uid}lg`} fill="#16161b" hatch="#555" gap={10} hatchOpacity={0.4} width={3.5} passes={1} />
    <SketchShape id={`${uid}-body`} points={[[-100, -300], [100, -300], [130, -60], [118, 10], [-118, 10], [-130, -60]]} seed={`${uid}bd`} fill="#17171c" hatch="#666" gap={11} hatchOpacity={0.45} width={4} />
    <SketchShape id={`${uid}-shirt`} points={[[-26, -300], [26, -300], [0, -190]]} seed={`${uid}sh`} fill="#f6f2e8" width={3} passes={1} />
    <SketchShape id={`${uid}-tie`} points={[[-8, -280], [8, -280], [14, -170], [0, -150], [-14, -170]]} seed={`${uid}t`} fill="#7a1830" width={3} passes={1} />
    <SketchShape id={`${uid}-head`} points={ellipsePoints(0, -375, 52, 62, 16)} seed={`${uid}hd`} fill="#e3b995" hatch="#c98a60" gap={9} hatchOpacity={0.4} width={4} passes={1} />
    <SketchShape id={`${uid}-hair`} points={arcPoints(0, -385, 54, 60, 185, 355, 10)} seed={`${uid}hr`} fill="#1a1410" width={3} passes={1} />
    <SketchShape id={`${uid}-glasses`} points={[[-50, -395], [50, -395], [46, -362], [8, -360], [0, -372], [-8, -360], [-46, -362]]} seed={`${uid}gl`} fill="#050507" width={3} passes={1} />
    <SketchLine seed={`${uid}glint`} passes={1} width={3} color="#9aa" points={[[-36, -388], [-22, -388]]} />
    <SketchLine seed={`${uid}mouth`} passes={1} width={4} points={[[-16, -335], [16, -335]]} />
  </g>
);

export const Candle: React.FC<{ readonly x: number; readonly y: number; readonly h?: number; readonly uid: string }> = ({ x, y, h = 90, uid }) => {
  const frame = useCurrentFrame();
  const fl = 0.8 + random(`${uid}-${frame}`) * 0.5;
  const sway = (random(`${uid}-s${frame}`) - 0.5) * 8;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle cx={0} cy={-h - 24} r={44 * fl} fill={GOLD_L} opacity={0.22} />
      <SketchShape id={`${uid}-wax`} points={rectPoints(-10, -h, 20, h)} seed={`${uid}w`} fill="#f6ecd2" hatch="#d9b36a" gap={6} hatchOpacity={0.5} width={2.5} passes={1} amp={1} />
      <SketchShape id={`${uid}-fl`} points={[[sway, -h - 52 * fl], [11, -h - 18], [0, -h - 4], [-11, -h - 18]]} seed={`${uid}f${frame}`} fill="#ff9a1f" width={2.5} passes={1} amp={1} color="#c4510c" />
      <ellipse cx={0} cy={-h - 16} rx={4} ry={9 * fl} fill="#fff3a8" />
    </g>
  );
};

type CarProps = {
  readonly x: number;
  readonly y: number; // ground line
  readonly s?: number;
  readonly uid: string;
  readonly children?: React.ReactNode; // drawn inside the side window
};

export const WINDOW: Pt[] = [[-192, -206], [-144, -328], [108, -328], [182, -206]];

// Long black 90s sedan, side view, heading right.
export const Car: React.FC<CarProps> = ({ x, y, s = 1, uid, children }) => {
  const frame = useCurrentFrame();
  return (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <SketchShape id={`${uid}-body`} points={[[-385, -62], [-388, -150], [-340, -192], [-210, -198], [-150, -340], [115, -340], [205, -198], [320, -190], [380, -140], [388, -66], [340, -44], [-345, -44]]} seed={`${uid}body`} fill="#16161b" hatch="#7a7a8a" gap={13} hatchOpacity={0.4} width={4.5} />
    <SketchShape id={`${uid}-glass`} points={WINDOW} seed={`${uid}glass`} fill="#a9bfd0" hatch="#fff" gap={16} hatchOpacity={0.5} width={3.5} passes={1} />
    <clipPath id={`${uid}-wclip`}>
      <polygon points={WINDOW.map((p) => p.join(",")).join(" ")} />
    </clipPath>
    <g clipPath={`url(#${uid}-wclip)`}>{children}</g>
    <SketchLine seed={`${uid}chrome`} passes={1} width={3.5} color="#cfd3da" points={[[-370, -118], [370, -118]]} />
    <SketchShape id={`${uid}-hl`} points={ellipsePoints(366, -128, 18, 12, 10)} seed={`${uid}hl`} fill="#ffe27a" width={3} passes={1} />
    {[-245, 245].map((wx) => (
      <g key={wx}>
        <SketchShape id={`${uid}-w${wx}`} points={ellipsePoints(wx, -50, 54, 54, 16)} seed={`${uid}w${wx}`} fill="#0c0c10" hatch="#555" gap={8} hatchOpacity={0.5} width={4} />
        <SketchShape id={`${uid}-h${wx}`} points={ellipsePoints(wx, -50, 28, 28, 12)} seed={`${uid}h${wx}`} fill="#c9ced6" hatch="#777" gap={6} hatchOpacity={0.6} width={3} passes={1} />
        <g transform={`translate(${wx} -50) rotate(${frame * 40})`}>
          {[0, 72, 144, 216, 288].map((a) => (
            <line key={a} x1={0} y1={0} x2={Math.cos((a * Math.PI) / 180) * 26} y2={Math.sin((a * Math.PI) / 180) * 26} stroke="#555" strokeWidth={4} strokeLinecap="round" />
          ))}
        </g>
      </g>
    ))}
  </g>
  );
};

export const Blob: React.FC<{ readonly cx: number; readonly cy: number; readonly rx: number; readonly ry: number; readonly fill: string; readonly opacity?: number }> = ({ cx, cy, rx, ry, fill, opacity = 0.3 }) => (
  <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={fill} opacity={opacity} />
);

// Grid of simple window rectangles; `lit` marks which ones glow.
export const Windows: React.FC<{
  readonly uid: string;
  readonly x: number;
  readonly y: number;
  readonly cols: number;
  readonly rows: number;
  readonly cw: number;
  readonly ch: number;
  readonly dx: number;
  readonly dy: number;
  readonly fill: string;
  readonly litFill?: string;
  readonly lit?: (r: number, c: number) => boolean;
}> = ({ uid, x, y, cols, rows, cw, ch, dx, dy, fill, litFill = "#f2c14e", lit }) => (
  <>
    {Array.from({ length: rows * cols }, (_, k) => {
      const r = Math.floor(k / cols);
      const c = k % cols;
      return (
        <SketchShape
          key={k}
          id={`${uid}-w${k}`}
          points={rectPoints(x + c * dx, y + r * dy, cw, ch)}
          seed={`${uid}w${k}`}
          fill={lit?.(r, c) ? litFill : fill}
          passes={1}
          width={3}
          amp={1.2}
        />
      );
    })}
  </>
);
