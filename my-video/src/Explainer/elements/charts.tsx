import React from "react";
import { Easing, interpolate, interpolateColors } from "remotion";
import { useElementFrame, accent, appear, COLORS, easeOut, fontFamily, prog, STAGGER, tint, UI } from "../theme";
import type { Element } from "../types";

type Of<T extends Element["type"]> = Extract<Element, { type: T }>;

export const DotGrid: React.FC<{ e: Of<"dotGrid"> }> = ({ e }) => {
  const frame = useElementFrame();
  const cols = Math.min(e.count, Math.ceil(Math.sqrt(e.count * 4)));
  const rows = Math.ceil(e.count / cols);
  const gap = 46;
  const dot = 24;
  const hi = e.highlight ?? 0;
  const color = accent(e.color, "orange");
  const fillFrames = Math.min(36, e.count);
  const hiStart = fillFrames + 10;
  return (
    <div style={{ fontFamily, textAlign: "center" }}>
      {e.label ? (
        <div
          style={{
            ...appear(frame, 0),
            color: COLORS.grey,
            fontSize: 26,
            fontWeight: 600,
            marginBottom: 30,
          }}
        >
          {e.label}
        </div>
      ) : null}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, ${gap}px)`,
          gridAutoRows: `${gap}px`,
          justifyContent: "center",
          alignItems: "center",
          justifyItems: "center",
          height: rows * gap,
        }}
      >
        {Array.from({ length: e.count }, (_, i) => {
          const p = prog(frame, (i / e.count) * fillFrames, 8);
          const isHi = i < hi;
          const hp = isHi ? prog(frame, hiStart + i * 0.6, 8) : 0;
          const pop = isHi ? 1 + 0.35 * Math.sin(Math.PI * hp) : 1;
          return (
            <div
              key={i}
              style={{
                width: dot,
                height: dot,
                borderRadius: dot,
                background: hp > 0.5 ? color : "#8a8a8a",
                opacity: p * (hp > 0.5 || !hi ? 1 : 0.55),
                transform: `scale(${(0.4 + 0.6 * p) * pop})`,
              }}
            />
          );
        })}
      </div>
      {e.caption ? (
        <div
          style={{
            ...appear(frame, hiStart + 14),
            color: hi ? color : COLORS.grey,
            fontSize: 38,
            fontWeight: 700,
            marginTop: 34,
          }}
        >
          {e.caption}
        </div>
      ) : null}
    </div>
  );
};

export const Bars: React.FC<{ e: Of<"bars"> }> = ({ e }) => {
  const frame = useElementFrame();
  const BAR_W = 460;
  return (
    <div
      style={{
        fontFamily,
        display: "flex",
        flexDirection: "column",
        gap: 34,
        width: 900,
      }}
    >
      {e.items.map((it, i) => {
        const d = i * STAGGER * 1.5;
        const p = prog(frame, d + 4, 26);
        const c = accent(it.color);
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <div
              style={{
                ...appear(frame, d),
                width: 270,
                textAlign: "right",
                color: COLORS.white,
                fontSize: 30,
                fontWeight: 700,
                lineHeight: 1.15,
              }}
            >
              {it.label}
            </div>
            <div
              style={{
                width: BAR_W,
                height: 40,
                borderRadius: 10,
                background: "#161616",
              }}
            >
              <div
                style={{
                  width: Math.max(0, Math.min(1, it.value)) * BAR_W * p,
                  height: "100%",
                  borderRadius: 10,
                  background: c,
                }}
              />
            </div>
            <div
              style={{
                ...appear(frame, d + 28),
                width: 150,
                color: c === COLORS.white ? COLORS.grey : c,
                fontSize: 26,
                fontWeight: 700,
              }}
            >
              {it.note ?? ""}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const LineChart: React.FC<{ e: Of<"lineChart"> }> = ({ e }) => {
  const frame = useElementFrame();
  const W = 860;
  const H = 400;
  const pl = 70; // left pad for y label
  const pb = 20;
  const top = 30;
  const plateau = Math.max(0.15, Math.min(0.95, e.plateauAt ?? 0.55));
  const k = 3.6;
  const f = (x: number) =>
    x <= plateau
      ? 1 - Math.exp((-k * x) / plateau)
      : 1 - Math.exp(-k) + (0.04 * (x - plateau)) / (1 - plateau);
  const cw = W - pl;
  const ch = H - top - pb;
  const yAt = (x: number) => top + ch - f(x) * ch * 0.92;
  const pts: string[] = [];
  const N = 80;
  for (let i = 0; i <= N; i++) {
    const x = i / N;
    pts.push(`${i === 0 ? "M" : "L"}${(pl + x * cw).toFixed(1)} ${yAt(x).toFixed(1)}`);
  }
  const drawP = prog(frame, 8, 46);
  const markX = pl + plateau * cw;
  const markStart = 8 + 46 * plateau * 0.9;
  const markP = prog(frame, markStart, 12);
  const noteP = prog(frame, markStart + 8, 12);
  return (
    <div style={{ fontFamily, textAlign: "center", width: W }}>
      {e.title ? (
        <div
          style={{
            ...appear(frame, 0),
            color: COLORS.white,
            fontSize: 38,
            fontWeight: 700,
            marginBottom: 18,
          }}
        >
          {e.title}
        </div>
      ) : null}
      <svg width={W} height={H + 40} style={{ ...appear(frame, 0), overflow: "visible" }}>
        <line x1={pl} y1={top + ch} x2={W} y2={top + ch} stroke="#555" strokeWidth={3} strokeLinecap="round" />
        <line x1={pl} y1={top} x2={pl} y2={top + ch} stroke="#555" strokeWidth={3} strokeLinecap="round" />
        {e.yLabel ? (
          <text
            transform={`translate(24 ${top + ch / 2}) rotate(-90)`}
            textAnchor="middle"
            fill={COLORS.grey}
            fontSize={26}
            fontWeight={600}
          >
            {e.yLabel}
          </text>
        ) : null}
        {e.xLabel ? (
          <text x={pl + cw / 2} y={top + ch + 56} textAnchor="middle" fill={COLORS.grey} fontSize={26} fontWeight={600}>
            {e.xLabel}
          </text>
        ) : null}
        <line
          x1={markX}
          y1={top - 10}
          x2={markX}
          y2={top + ch}
          stroke={COLORS.orange}
          strokeWidth={3}
          strokeDasharray="10 10"
          opacity={markP}
        />
        <path
          d={pts.join(" ")}
          pathLength={1}
          fill="none"
          stroke={COLORS.white}
          strokeWidth={7}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1 1"
          strokeDashoffset={1 - drawP}
        />
        <circle
          cx={pl + drawP * cw}
          cy={yAt(drawP)}
          r={11}
          fill={COLORS.orange}
          opacity={drawP > 0 && drawP < 1 ? 1 : 0}
        />
        {e.note ? (
          <text
            x={markX + 20}
            y={top + ch * 0.5}
            fill={COLORS.orange}
            fontSize={28}
            fontWeight={700}
            opacity={noteP}
            transform={`translate(0 ${(1 - noteP) * 10})`}
          >
            {e.note}
          </text>
        ) : null}
      </svg>
    </div>
  );
};

const NUM_RE = /(\d[\d\s]*)/;

export const BigNumber: React.FC<{ e: Of<"bigNumber"> }> = ({ e }) => {
  const frame = useElementFrame();
  const m = NUM_RE.exec(e.value);
  const countP = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  let shown = e.value;
  if (m) {
    const target = parseInt(m[1].replace(/\s/g, ""), 10);
    if (!isNaN(target)) {
      shown = e.value.replace(NUM_RE, String(Math.round(target * countP)));
    }
  }
  const pop = prog(frame, 0, 14);
  const scale = 0.8 + 0.2 * pop + 0.04 * Math.sin(Math.PI * pop);
  return (
    <div style={{ fontFamily, textAlign: "center" }}>
      <div
        style={{
          color: COLORS.grey,
          fontSize: 240,
          fontWeight: 800,
          lineHeight: 1,
          opacity: pop,
          transform: `scale(${scale})`,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {shown}
      </div>
      {e.caption ? (
        <div
          style={{
            ...appear(frame, 22),
            color: COLORS.white,
            fontSize: 38,
            fontWeight: 700,
            marginTop: 20,
          }}
        >
          {e.caption}
        </div>
      ) : null}
      {e.after ? (
        <div
          style={{
            ...appear(frame, 34),
            color: COLORS.green,
            fontSize: 44,
            fontWeight: 700,
            marginTop: 26,
          }}
        >
          {e.after}
        </div>
      ) : null}
    </div>
  );
};

const VS_WOBBLE_START = 14;
const VS_WOBBLE_FRAMES = 30; // ~1 s of tension, ends on a zero crossing so the slam starts from 0.5
const VS_SLAM_DUR = 14;
/** Element-relative frame at which the marker slams toward the winner. */
export const VERSUS_SLAM_FRAME = VS_WOBBLE_START + VS_WOBBLE_FRAMES + 2;

export const Versus: React.FC<{ e: Of<"versus"> }> = ({ e }) => {
  const frame = useElementFrame();
  const BAR_W = 900;
  const LABEL_W = 270;
  const leftWins = e.winner === "left";
  const target = leftWins ? 0.8 : 0.2;

  const wt = Math.max(0, Math.min(1, (frame - VS_WOBBLE_START) / VS_WOBBLE_FRAMES));
  const wobble = 0.07 * (0.35 + 0.65 * wt) * Math.sin(2 * Math.PI * 3 * wt);
  const slam = interpolate(frame, [VERSUS_SLAM_FRAME, VERSUS_SLAM_FRAME + VS_SLAM_DUR], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.8)),
  });
  const m = Math.max(0.03, Math.min(0.97, 0.5 + (frame < VERSUS_SLAM_FRAME ? wobble : 0) + (target - 0.5) * slam));
  const done = prog(frame, VERSUS_SLAM_FRAME, 10);

  const side = (s: "left" | "right") => {
    const color = accent(e[s].color, s === "left" ? "orange" : "green");
    const win = e.winner === s;
    const textColor = interpolateColors(done, [0, 1], [COLORS.white, win ? color : UI.dimText]);
    const scale = 1 + (win ? 0.14 : -0.04) * done;
    return { color, textColor, scale, win };
  };
  const L = side("left");
  const R = side("right");

  const label = (s: "left" | "right", v: ReturnType<typeof side>) => (
    <div
      style={{
        ...appear(frame, 0, 12, 20),
        width: LABEL_W,
        textAlign: s === "left" ? "right" : "left",
        color: v.textColor,
        fontSize: 46,
        fontWeight: 800,
        lineHeight: 1.1,
        whiteSpace: "pre-line",
      }}
    >
      <div
        style={{
          display: "inline-block",
          transform: `scale(${v.scale})`,
          transformOrigin: s === "left" ? "right center" : "left center",
        }}
      >
        {e[s].label}
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily, textAlign: "center" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 36 }}>
        {label("left", L)}
        <div style={{ ...appear(frame, 0, 12, 20), position: "relative", width: BAR_W, height: 46 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 23,
              overflow: "hidden",
              background: UI.panel,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: m * BAR_W,
                background: L.color,
                opacity: 1 - (L.win ? 0 : 0.6) * done,
              }}
            />
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: (1 - m) * BAR_W,
                background: R.color,
                opacity: 1 - (R.win ? 0 : 0.6) * done,
              }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              left: m * BAR_W - 5,
              top: -19,
              width: 10,
              height: 84,
              borderRadius: 5,
              background: COLORS.white,
              boxShadow: `0 0 18px ${tint("#FFFFFF", 0.6)}`,
            }}
          />
        </div>
        {label("right", R)}
      </div>
      {e.note ? (
        <div
          style={{
            ...appear(frame, VERSUS_SLAM_FRAME + 16),
            color: COLORS.grey,
            fontSize: 32,
            fontWeight: 600,
            marginTop: 44,
          }}
        >
          {e.note}
        </div>
      ) : null}
    </div>
  );
};
