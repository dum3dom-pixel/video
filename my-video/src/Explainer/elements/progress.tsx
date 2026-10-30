import React from "react";

import { useElementFrame, accent, appear, COLORS, fontFamily, prog, STAGGER, tint, UI } from "../theme";
import type { Element } from "../types";

type Of<T extends Element["type"]> = Extract<Element, { type: T }>;

const popScale = (p: number) => 0.4 + 0.6 * p + 0.18 * Math.sin(Math.PI * p);

export const Reps: React.FC<{ e: Of<"reps"> }> = ({ e }) => {
  const frame = useElementFrame();
  const gap = 14;
  const d = Math.max(24, Math.min(64, Math.floor(880 / e.total) - gap));
  const step = Math.min(5, 40 / e.total);
  return (
    <div style={{ fontFamily, textAlign: "center" }}>
      <div style={{ display: "flex", gap, justifyContent: "center" }}>
        {Array.from({ length: e.total }, (_, i) => {
          const p = prog(frame, i * step, 10);
          const filled = i < e.filled;
          return (
            <div
              key={i}
              style={{
                width: d,
                height: d,
                borderRadius: d,
                boxSizing: "border-box",
                background: filled ? COLORS.white : "transparent",
                border: filled ? "none" : `4px solid ${COLORS.orange}`,
                opacity: p,
                transform: `scale(${popScale(p)})`,
              }}
            />
          );
        })}
      </div>
      {e.caption ? (
        <div
          style={{
            ...appear(frame, e.total * step * 0.7),
            color: COLORS.white,
            fontSize: 38,
            fontWeight: 700,
            marginTop: 40,
          }}
        >
          {e.caption}
        </div>
      ) : null}
    </div>
  );
};

export const Week: React.FC<{ e: Of<"week"> }> = ({ e }) => {
  const frame = useElementFrame();
  const box = 100;
  return (
    <div style={{ fontFamily, display: "flex", gap: 22, justifyContent: "center" }}>
      {e.days.map((day, i) => {
        const checkIdx = e.checked.indexOf(i);
        const p = checkIdx >= 0 ? prog(frame, 10 + checkIdx * 6, 10) : 0;
        return (
          <div key={i} style={{ ...appear(frame, i * 3), textAlign: "center" }}>
            <div style={{ color: COLORS.grey, fontSize: 30, fontWeight: 700, marginBottom: 14 }}>
              {day}
            </div>
            <div
              style={{
                width: box,
                height: box,
                boxSizing: "border-box",
                borderRadius: 18,
                border: `3px solid ${UI.dim}`,
                background: UI.panel,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width={64}
                height={64}
                viewBox="0 0 64 64"
                style={{ opacity: p, transform: `scale(${popScale(p)})` }}
              >
                <path
                  d="M10 34 L26 50 L54 14"
                  fill="none"
                  stroke={COLORS.green}
                  strokeWidth={9}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pathLength={1}
                  strokeDasharray="1 1"
                  strokeDashoffset={1 - p}
                />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const Steps: React.FC<{ e: Of<"steps"> }> = ({ e }) => {
  const frame = useElementFrame();
  const n = e.items.length;
  const gap = 14;
  const w = Math.min(190, Math.floor((900 - gap * (n - 1)) / n));
  const base = 90;
  const inc = Math.min(60, 300 / Math.max(1, n - 1));
  return (
    <div
      style={{
        fontFamily,
        display: "flex",
        gap,
        alignItems: "flex-end",
        justifyContent: "center",
        height: base + inc * (n - 1),
      }}
    >
      {e.items.map((it, i) => {
        const p = prog(frame, i * STAGGER * 1.2, 14);
        const c = it.color ? accent(it.color) : i === n - 1 ? COLORS.red : COLORS.white;
        const isRed = c === COLORS.red;
        return (
          <div
            key={i}
            style={{
              width: w,
              height: (base + inc * i) * p,
              boxSizing: "border-box",
              borderRadius: 14,
              border: `3px solid ${isRed ? c : c === COLORS.white ? "#555" : c}`,
              background: isRed ? tint(COLORS.red, 0.18) : UI.panel,
              overflow: "hidden",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              padding: "14px 8px 0",
              opacity: p,
            }}
          >
            <div
              style={{
                color: c,
                fontSize: 24,
                fontWeight: 700,
                textAlign: "center",
                lineHeight: 1.15,
                opacity: prog(frame, i * STAGGER * 1.2 + 8, 8),
              }}
            >
              {it.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const Levels: React.FC<{ e: Of<"levels"> }> = ({ e }) => {
  const frame = useElementFrame();
  return (
    <div style={{ fontFamily, display: "flex", flexDirection: "column", gap: 18, width: 900 }}>
      {e.items.map((it, i) => {
        const p = prog(frame, i * 10, 12);
        const c = accent(it.color);
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 28,
              padding: "18px 30px",
              borderRadius: 16,
              border: `3px solid ${c}`,
              background: tint(c, 0.08),
              opacity: p,
              transform: `translateX(${(1 - p) * -60}px)`,
            }}
          >
            <div style={{ width: 210, color: c, fontSize: 30, fontWeight: 800, textTransform: "uppercase" }}>
              {it.label}
            </div>
            <div style={{ flex: 1, color: COLORS.white, fontSize: 30, fontWeight: 600, lineHeight: 1.2 }}>
              {it.text}
            </div>
          </div>
        );
      })}
    </div>
  );
};
