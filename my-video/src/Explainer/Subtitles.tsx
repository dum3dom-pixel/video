import React from "react";
import { COLORS, fontFamily, FPS } from "./theme";
import type { VoiceWord } from "./types";

const WINDOW = 4;
const HOLD = 0.35; // seconds a word stays "active" after it ends, if no next word starts

const shadow = [
  "-3px -3px 0 #000",
  "3px -3px 0 #000",
  "-3px 3px 0 #000",
  "3px 3px 0 #000",
  "0 4px 12px rgba(0,0,0,0.8)",
].join(", ");

/** Word-by-word captions for one scene; `frame` is scene-relative (voice starts at 0). */
export const Subtitles: React.FC<{ words: VoiceWord[]; frame: number }> = ({ words, frame }) => {
  const time = frame / FPS;
  let cur = -1;
  for (let i = 0; i < words.length; i++) {
    if (words[i].t <= time) cur = i;
    else break;
  }
  if (cur < 0) return null;
  const w = words[cur];
  const next = words[cur + 1];
  const end = Math.min(w.t + w.d + HOLD, next ? next.t : Infinity);
  if (time >= end) return null;

  const start = Math.max(0, Math.min(cur - 1, words.length - WINDOW));
  const shown = words.slice(start, start + WINDOW);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 70,
        display: "flex",
        justifyContent: "center",
        gap: "0 0.55em",
        fontFamily,
        fontWeight: 800,
        fontSize: 44,
        lineHeight: 1.2,
        textShadow: shadow,
      }}
    >
      {shown.map((x, i) => {
        const active = start + i === cur;
        return (
          <span
            key={start + i}
            style={{
              display: "inline-block",
              color: active ? COLORS.orange : COLORS.white,
              transform: active ? "scale(1.06)" : undefined,
            }}
          >
            {x.w}
          </span>
        );
      })}
    </div>
  );
};
