import React from "react";
import { COLORS, fontFamily, UI } from "./theme";

const D = 46;

export const RankTracker: React.FC<{ rank: number }> = ({ rank }) => (
  <div
    style={{
      position: "absolute",
      top: 44,
      right: 64,
      display: "flex",
      gap: 14,
      fontFamily,
    }}
  >
    {[5, 4, 3, 2, 1].map((n) => {
      const active = n === rank;
      return (
        <div
          key={n}
          style={{
            width: D,
            height: D,
            borderRadius: D,
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            fontWeight: 700,
            background: active ? COLORS.red : "transparent",
            border: active ? `2px solid ${COLORS.red}` : `2px solid ${UI.dim}`,
            color: active ? "#fff" : COLORS.grey,
          }}
        >
          {n}
        </div>
      );
    })}
  </div>
);

export const SectionTag: React.FC<{ text: string }> = ({ text }) => (
  <div
    style={{
      position: "absolute",
      top: 44,
      left: 64,
      height: D,
      padding: "0 24px",
      display: "flex",
      alignItems: "center",
      borderRadius: D,
      background: UI.pill,
      color: "#fff",
      fontFamily,
      fontWeight: 700,
      fontSize: 22,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
    }}
  >
    {text}
  </div>
);
