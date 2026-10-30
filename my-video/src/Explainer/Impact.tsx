import React from "react";
import { interpolate, random } from "remotion";
import { COLORS, easeOut, FPS, HEIGHT, WIDTH } from "./theme";
import type { Impact } from "./types";

const LINES = 28;
const FLASH_FRAMES = 6;
const BURST_FRAMES = 14;

/** Hit burst: white flash, radial speed lines and an orange ring at (x, y). */
export const ImpactView: React.FC<{ impact: Impact; frame: number }> = ({ impact, frame }) => {
  const f = frame - Math.round((impact.at ?? 0) * FPS);
  if (f < 0 || f > BURST_FRAMES) return null;
  const x = impact.x ?? WIDTH / 2;
  const y = impact.y ?? HEIGHT / 2;
  const p = interpolate(f, [0, BURST_FRAMES], [0, 1], { easing: easeOut });
  const flash = interpolate(f, [0, FLASH_FRAMES], [0.55, 0], { extrapolateRight: "clamp" });
  const fade = 1 - p;

  return (
    <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0 }}>
      <rect width={WIDTH} height={HEIGHT} fill="#fff" opacity={flash} />
      {Array.from({ length: LINES }, (_, i) => {
        const a = (i / LINES) * 2 * Math.PI + random(`a${i}`) * 0.2;
        const r0 = 60 + 260 * p;
        const r1 = r0 + 120 + 260 * random(`l${i}`);
        return (
          <line
            key={i}
            x1={x + Math.cos(a) * r0}
            y1={y + Math.sin(a) * r0}
            x2={x + Math.cos(a) * r1}
            y2={y + Math.sin(a) * r1}
            stroke="#fff"
            strokeWidth={2 + 4 * random(`w${i}`)}
            strokeLinecap="round"
            opacity={fade}
          />
        );
      })}
      <circle cx={x} cy={y} r={30 + 170 * p} fill="none" stroke={COLORS.orange} strokeWidth={10 * fade} opacity={fade} />
    </svg>
  );
};
