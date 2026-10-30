import { createContext, useContext } from "react";
import type React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Caveat";

export type Pt = readonly [number, number];

// Stroke/jitter multiplier so scaled-up groups keep a pencil-sized line (1 = unchanged).
export const InkScale = createContext(1);

export const GRAPHITE = "#2b2b2b";
export const PAPER = "#f4efe4";

const { fontFamily } = loadFont("normal", {
  weights: ["700"],
  subsets: ["cyrillic", "latin"],
});

// Deterministic offset in [-amp, amp]; `frame` in the seed makes lines "boil".
const jit = (seed: string, frame: number, i: number, amp: number) =>
  (random(`${seed}-${frame}-${i}`) - 0.5) * 2 * amp;

export const circlePoints = (cx: number, cy: number, r: number, n = 22): Pt[] =>
  Array.from({ length: n }, (_, i): Pt => {
    const a = (i / n) * Math.PI * 2;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  });

// Subdivides every segment (~1 point per `step` px) and jitters each point.
export const sketchPath = (
  points: readonly Pt[],
  seed: string,
  frame: number,
  amp = 2.2,
  step = 70,
  closed = false,
): string => {
  const pts = closed ? [...points, points[0]] : points;
  let d = "";
  let n = 0;
  const emit = (x: number, y: number) => {
    const px = x + jit(seed, frame, n * 2, amp);
    const py = y + jit(seed, frame, n * 2 + 1, amp);
    d += `${n === 0 ? "M" : "L"}${px.toFixed(1)} ${py.toFixed(1)} `;
    n++;
  };
  pts.forEach((p, i) => {
    if (i === 0) {
      emit(p[0], p[1]);
      return;
    }
    const q = pts[i - 1];
    const parts = Math.max(
      1,
      Math.round(Math.hypot(p[0] - q[0], p[1] - q[1]) / step),
    );
    for (let k = 1; k <= parts; k++) {
      emit(
        q[0] + ((p[0] - q[0]) * k) / parts,
        q[1] + ((p[1] - q[1]) * k) / parts,
      );
    }
  });
  return d;
};

type SketchLineProps = {
  readonly points: readonly Pt[];
  readonly seed: string;
  readonly closed?: boolean;
  readonly color?: string;
  readonly width?: number;
  readonly passes?: number;
  readonly amp?: number;
};

// Pencil stroke: drawn `passes` times with different jitter, broken by small gaps.
export const SketchLine: React.FC<SketchLineProps> = ({
  points,
  seed,
  closed = false,
  color = GRAPHITE,
  width = 3,
  passes = 2,
  amp = 2.2,
}) => {
  const frame = useCurrentFrame();
  const k = useContext(InkScale);
  return (
    <>
      {Array.from({ length: passes }, (_, p) => {
        const s = `${seed}-p${p}`;
        const dash = 90 + random(`${s}-dash`) * 220;
        const gap = 3 + random(`${s}-gap`) * 7;
        return (
          <path
            key={p}
            d={sketchPath(points, s, frame, amp * k, 70, closed)}
            fill="none"
            stroke={color}
            strokeWidth={width * k}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.85}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={random(`${s}-${frame}-off`) * (dash + gap)}
          />
        );
      })}
    </>
  );
};

type SketchRectProps = Omit<SketchLineProps, "points" | "closed"> & {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly fill?: string;
  readonly fillOpacity?: number;
};

export const SketchRect: React.FC<SketchRectProps> = ({
  x,
  y,
  w,
  h,
  fill,
  fillOpacity = 1,
  ...line
}) => (
  <>
    {fill ? (
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={fill}
        opacity={fillOpacity}
      />
    ) : null}
    <SketchLine
      {...line}
      closed
      points={[
        [x, y],
        [x + w, y],
        [x + w, y + h],
        [x, y + h],
      ]}
    />
  </>
);

type HatchProps = {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly color: string;
  readonly seed: string;
  readonly gap?: number;
  readonly width?: number;
  readonly opacity?: number;
  readonly clip?: React.ReactNode; // clip shape, defaults to the bounding rect
};

// Diagonal parallel strokes, jittered every frame and clipped to a shape.
export const Hatch: React.FC<HatchProps> = ({
  id,
  x,
  y,
  w,
  h,
  color,
  seed,
  gap = 12,
  width = 2.5,
  opacity = 0.7,
  clip,
}) => {
  const frame = useCurrentFrame();
  const k = useContext(InkScale);
  let d = "";
  const n = Math.ceil((w + h) / gap);
  for (let i = 0; i < n; i++) {
    const s = `${seed}-h${i}`;
    if (random(`${s}-skip`) < 0.07) continue;
    const x0 = x - h + i * gap;
    const ax = x0 + jit(s, frame, 0, 2.5 * k);
    const ay = y + h + jit(s, frame, 1, 2.5 * k);
    const bx = x0 + h + jit(s, frame, 2, 2.5 * k);
    const by = y + jit(s, frame, 3, 2.5 * k);
    d += `M${ax.toFixed(1)} ${ay.toFixed(1)}L${bx.toFixed(1)} ${by.toFixed(1)}`;
  }
  return (
    <>
      <clipPath id={id}>
        {clip ?? <rect x={x} y={y} width={w} height={h} />}
      </clipPath>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width * k}
        strokeLinecap="round"
        opacity={opacity}
        clipPath={`url(#${id})`}
      />
    </>
  );
};

type SketchTextProps = {
  readonly text: string;
  readonly from: number;
  readonly to: number;
  readonly top?: number;
  readonly size?: number;
  readonly color?: string;
};

// Handwritten text: letters wobble every frame, "written" in left to right.
export const SketchText: React.FC<SketchTextProps> = ({
  text,
  from,
  to,
  top = 50,
  size = 140,
  color = GRAPHITE,
}) => {
  const frame = useCurrentFrame();
  if (frame < from || frame >= to) {
    return null;
  }
  const reveal = interpolate(frame, [from, from + 5], [100, -8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(frame, [to - 3, to], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily,
        fontWeight: 700,
        fontSize: size,
        color,
        opacity,
        whiteSpace: "pre",
      }}
    >
      <span
        style={{
          display: "inline-block",
          clipPath: `inset(-30px ${reveal}% -30px -10px)`,
        }}
      >
        {[...text].map((ch, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              rotate: `${jit(text, frame, i * 2, 2.5)}deg`,
              translate: `0px ${jit(text, frame, i * 2 + 1, 3)}px`,
            }}
          >
            {ch}
          </span>
        ))}
      </span>
    </div>
  );
};

// Faint paper grain, re-seeded every frame.
export const PaperGrain: React.FC<{
  readonly count?: number;
  readonly width?: number;
  readonly height?: number;
}> = ({ count = 280, width = 1920, height = 1080 }) => {
  const frame = useCurrentFrame();
  return (
    <g>
      {Array.from({ length: count }, (_, i) => (
        <circle
          key={i}
          cx={random(`g${frame}-x${i}`) * width}
          cy={random(`g${frame}-y${i}`) * height}
          r={0.8 + random(`g${frame}-r${i}`) * 1.2}
          fill="#5a4a3a"
          opacity={0.05 + random(`g${frame}-o${i}`) * 0.13}
        />
      ))}
    </g>
  );
};

export const rectPoints = (x: number, y: number, w: number, h: number): Pt[] => [
  [x, y],
  [x + w, y],
  [x + w, y + h],
  [x, y + h],
];

export const ellipsePoints = (
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  n = 24,
): Pt[] =>
  Array.from({ length: n }, (_, i): Pt => {
    const a = (i / n) * Math.PI * 2;
    return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry];
  });

// Open arc, angles in degrees clockwise from +x (SVG y points down).
export const arcPoints = (
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  a0: number,
  a1: number,
  n = 12,
): Pt[] =>
  Array.from({ length: n + 1 }, (_, i): Pt => {
    const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
    return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry];
  });

type SketchShapeProps = Omit<SketchLineProps, "points" | "closed"> & {
  readonly id: string; // unique per document: used for the hatch clipPath
  readonly points: readonly Pt[];
  readonly closed?: boolean;
  readonly fill?: string; // flat base colour under the hatching
  readonly fillOpacity?: number;
  readonly hatch?: string; // hatching colour
  readonly gap?: number;
  readonly hatchWidth?: number;
  readonly hatchOpacity?: number;
  readonly outline?: boolean;
};

// Generic filled outline: base colour + clipped hatching + double pencil stroke.
export const SketchShape: React.FC<SketchShapeProps> = ({
  id,
  points,
  closed = true,
  fill,
  fillOpacity = 1,
  hatch,
  gap = 10,
  hatchWidth = 2.5,
  hatchOpacity = 0.6,
  outline = true,
  seed,
  ...line
}) => {
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  const w = Math.max(...xs) - x;
  const h = Math.max(...ys) - y;
  const d = `${points.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ")} Z`;
  return (
    <g>
      {fill ? <path d={d} fill={fill} opacity={fillOpacity} /> : null}
      {hatch ? (
        <Hatch
          id={id}
          x={x}
          y={y}
          w={w}
          h={h}
          color={hatch}
          seed={seed}
          gap={gap}
          width={hatchWidth}
          opacity={hatchOpacity}
          clip={<path d={d} />}
        />
      ) : null}
      {outline ? (
        <SketchLine {...line} seed={seed} points={points} closed={closed} />
      ) : null}
    </g>
  );
};

// Little four-point sparkle that pops (grows and fades) for `dur` frames from `from`.
export const Glint: React.FC<{
  readonly cx: number;
  readonly cy: number;
  readonly from: number;
  readonly size?: number;
  readonly dur?: number;
}> = ({ cx, cy, from, size = 40, dur = 6 }) => {
  const frame = useCurrentFrame();
  const t = (frame - from) / dur;
  if (t < 0 || t > 1) {
    return null;
  }
  const s = Math.sin(Math.PI * t) * size;
  const star = (x: number, y: number, k: number): Pt[] => [
    [x, y - s * k],
    [x + s * k * 0.2, y - s * k * 0.2],
    [x + s * k, y],
    [x + s * k * 0.2, y + s * k * 0.2],
    [x, y + s * k],
    [x - s * k * 0.2, y + s * k * 0.2],
    [x - s * k, y],
    [x - s * k * 0.2, y - s * k * 0.2],
  ];
  return (
    <g>
      <SketchShape
        id={`glint-${from}-${cx.toFixed(0)}-${cy.toFixed(0)}`}
        points={star(cx, cy, 1)}
        seed={`glint${from}${cx}`}
        fill="#fffbe6"
        color="#b8860b"
        width={3}
        passes={1}
        amp={1}
      />
      <SketchShape
        id={`glint2-${from}-${cx.toFixed(0)}-${cy.toFixed(0)}`}
        points={star(cx + s * 0.9, cy - s * 0.8, 0.35)}
        seed={`glintb${from}${cx}`}
        fill="#fffbe6"
        color="#b8860b"
        width={2}
        passes={1}
        amp={0.6}
      />
    </g>
  );
};
