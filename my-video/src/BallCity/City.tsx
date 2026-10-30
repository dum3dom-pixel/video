import type React from "react";
import { Hatch, PAPER, SketchLine, SketchRect } from "./sketch";

export const GROUND_Y = 900;
export const WALL = { x: 890, w: 140, h: 330 };

const BUILDINGS = [
  { x: 20, w: 230, h: 300, color: "#f2c14e" },
  { x: 270, w: 200, h: 430, color: "#2a9d8f" },
  { x: 490, w: 250, h: 360, color: "#f4845f" },
  { x: 760, w: 150, h: 250, color: "#6bb8e8" },
  { x: 1010, w: 220, h: 480, color: "#7bc47f" },
  { x: 1250, w: 250, h: 340, color: "#f4845f" },
  { x: 1520, w: 200, h: 420, color: "#f2c14e" },
  { x: 1740, w: 170, h: 280, color: "#2a9d8f" },
];

const GREY = "#777777";

const Building: React.FC<{
  readonly b: (typeof BUILDINGS)[number];
  readonly i: number;
  readonly colored: boolean;
}> = ({ b, i, colored }) => {
  const layer = colored ? "c" : "g";
  const top = GROUND_Y - b.h;
  const cols = Math.floor((b.w - 40) / 60);
  const rows = Math.floor((b.h - 60) / 70);
  const cellW = (b.w - 40) / cols;
  return (
    <g>
      <Hatch
        id={`${layer}-b${i}`}
        x={b.x}
        y={top}
        w={b.w}
        h={b.h}
        seed={`b${i}`}
        color={colored ? b.color : GREY}
        gap={colored ? 11 : 22}
        width={colored ? 3 : 2}
        opacity={colored ? 0.75 : 0.35}
      />
      <SketchRect x={b.x} y={top} w={b.w} h={b.h} seed={`b${i}`} />
      {i % 3 === 0 ? (
        <SketchLine
          points={[
            [b.x + b.w / 2, top],
            [b.x + b.w / 2, top - 55],
          ]}
          seed={`ant${i}`}
        />
      ) : null}
      {Array.from({ length: rows * cols }, (_, k) => {
        const r = Math.floor(k / cols);
        const c = k % cols;
        const wx = b.x + 20 + c * cellW + (cellW - 34) / 2;
        const lit = colored && (r * 7 + c * 3 + i) % 3 === 0;
        return (
          <SketchRect
            key={k}
            x={wx}
            y={top + 30 + r * 70}
            w={34}
            h={42}
            seed={`w${i}-${k}`}
            passes={1}
            amp={1.5}
            width={2.5}
            fill={lit ? "#ffd166" : PAPER}
            fillOpacity={lit ? 0.9 : 0.8}
          />
        );
      })}
    </g>
  );
};

// Grey or coloured version of the whole city; both share seeds so lines coincide.
export const City: React.FC<{ readonly colored: boolean }> = ({ colored }) => {
  const layer = colored ? "c" : "g";
  const wallTop = GROUND_Y - WALL.h;
  return (
    <g>
      {colored ? (
        <rect
          x={0}
          y={0}
          width={1920}
          height={GROUND_Y}
          fill="#ffe3a3"
          opacity={0.55}
        />
      ) : null}
      {BUILDINGS.map((b, i) => (
        <Building key={i} b={b} i={i} colored={colored} />
      ))}
      <Hatch
        id={`${layer}-ground`}
        x={0}
        y={GROUND_Y}
        w={1920}
        h={180}
        seed="ground"
        color={colored ? "#7bc47f" : GREY}
        gap={colored ? 16 : 26}
        opacity={colored ? 0.6 : 0.3}
      />
      <SketchLine
        points={[
          [-20, GROUND_Y],
          [1940, GROUND_Y],
        ]}
        seed="ground"
        width={4}
      />
      <SketchRect
        x={WALL.x}
        y={wallTop}
        w={WALL.w}
        h={WALL.h}
        seed="wall"
        fill={PAPER}
      />
      <Hatch
        id={`${layer}-wall`}
        x={WALL.x}
        y={wallTop}
        w={WALL.w}
        h={WALL.h}
        seed="wall"
        color={colored ? "#a0522d" : "#555555"}
        gap={9}
        opacity={0.7}
      />
      <SketchRect
        x={WALL.x - 8}
        y={wallTop - 6}
        w={WALL.w + 16}
        h={22}
        seed="wallcap"
        fill={PAPER}
      />
      {Array.from({ length: 6 }, (_, r) => {
        const y = wallTop + (r + 1) * 55;
        return (
          <g key={r}>
            {r < 5 ? (
              <SketchLine
                points={[
                  [WALL.x, y],
                  [WALL.x + WALL.w, y],
                ]}
                seed={`brick${r}`}
                passes={1}
                width={2.5}
              />
            ) : null}
            {(r % 2 ? [35, 100] : [70]).map((dx) => (
              <SketchLine
                key={dx}
                points={[
                  [WALL.x + dx, y - 55],
                  [WALL.x + dx, y],
                ]}
                seed={`tick${r}-${dx}`}
                passes={1}
                width={2.5}
              />
            ))}
          </g>
        );
      })}
    </g>
  );
};
