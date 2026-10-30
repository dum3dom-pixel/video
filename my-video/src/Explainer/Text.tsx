import React from "react";
import { useCurrentFrame } from "remotion";
import { accent, appear, fontFamily, SIZES, STAGGER } from "./theme";
import type { Line } from "./types";

export const TextBlock: React.FC<{ lines: Line[] }> = ({ lines }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        textAlign: "center",
        fontFamily,
      }}
    >
      {lines.map((line, i) => {
        const size = line.size ?? "m";
        return (
          <div
            key={i}
            style={{
              ...appear(frame, i * STAGGER),
              color: accent(line.color),
              fontSize: SIZES[size],
              fontWeight: size === "xl" ? 800 : 700,
              lineHeight: 1.18,
              letterSpacing: size === "xl" ? "-0.01em" : undefined,
              whiteSpace: "pre-line",
            }}
          >
            {line.text}
          </div>
        );
      })}
    </div>
  );
};
