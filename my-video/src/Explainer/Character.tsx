import React from "react";
import { getStaticFiles, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { appear, fontFamily, HEIGHT, UI, WIDTH } from "./theme";
import type { Character as CharacterSpec } from "./types";

const Placeholder: React.FC<{ height: number; flip?: boolean; label?: string }> = ({ height, flip, label = "IMG" }) => {
  const width = (height * 200) / 480;
  return (
    <svg width={width} height={height} viewBox="0 0 200 480" fill={UI.dim}>
      <g transform={flip ? "translate(200 0) scale(-1 1)" : undefined}>
      <circle cx="100" cy="46" r="34" />
      {/* torso + arms */}
      <path d="M62 100 H138 Q158 100 160 124 L168 270 Q169 284 156 284 Q145 284 143 272 L134 160 H126 V300 H74 V160 H66 L57 272 Q55 284 44 284 Q31 284 32 270 L40 124 Q42 100 62 100 Z" />
      {/* legs */}
      <path d="M74 296 H126 L122 452 Q121 466 108 466 Q96 466 96 454 L100 330 L98 330 L96 454 Q96 466 84 466 Q71 466 70 452 Z" />
      </g>
      <text
        x="100"
        y="208"
        textAnchor="middle"
        fontFamily={fontFamily}
        fontWeight={700}
        fontSize={Math.min(21, 80 / label.length)}
        fill="#0c0c0c"
      >
        {label}
      </text>
    </svg>
  );
};

export const CharacterView: React.FC<{ c: CharacterSpec }> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pos = c.pos ?? "center";
  const bg = pos === "bg";
  const height = c.height ?? (bg ? 1000 : 820);
  const wanted = c.src === undefined ? [] : Array.isArray(c.src) ? c.src : [c.src];
  // Not generated yet → placeholder named after the pose; real image shows up once the file lands in public/.
  const present = new Set(getStaticFiles().map((f) => f.name.replace(/\\/g, "/")));
  const srcs = wanted.filter((s) => present.has(s));
  const missing = wanted.length > 0 && srcs.length === 0 ? wanted[0].replace(/^.*\/|\.\w+$/g, "") : undefined;
  const poseIdx =
    srcs.length > 1
      ? Math.floor((frame / fps) * (c.poseFps ?? 3)) % srcs.length
      : 0;
  const breathe = 1 + 0.003 * (1 + Math.sin((frame / fps) * ((2 * Math.PI) / 3.5)));

  const slot: React.CSSProperties = { position: "absolute", bottom: bg ? 40 : 30 };
  if (pos === "left") slot.left = 130;
  else if (pos === "right") slot.right = 130;
  else {
    slot.left = 0;
    slot.width = WIDTH;
    slot.display = "flex";
    slot.justifyContent = "center";
  }
  slot.height = Math.min(height, HEIGHT);

  return (
    <div style={{ ...slot, opacity: bg ? 0.25 : c.dim ? 0.35 : 1 }}>
      <div style={{ height: "100%", ...appear(frame, 0, 12, 12) }}>
        <div
          style={{
            height: "100%",
            transform: `scaleX(${c.flip && srcs.length > 0 ? -1 : 1}) scale(${breathe})`,
            transformOrigin: "50% 100%",
          }}
        >
          {srcs.length === 0 ? (
            <Placeholder height={slot.height as number} flip={c.flip} label={missing} />
          ) : (
            srcs.map((s, i) => (
              <Img
                key={s}
                src={staticFile(s)}
                style={{
                  height: "100%",
                  width: "auto",
                  mixBlendMode: "lighten",
                  display: i === poseIdx ? "block" : "none",
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
