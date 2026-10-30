import React from "react";

import { useElementFrame, appear, COLORS, fontFamily, prog, tint, UI } from "../theme";
import type { Element } from "../types";

type Of<T extends Element["type"]> = Extract<Element, { type: T }>;

const HIT_FRAME = 18;

const label = (x: number, y: number, text: string, fill: string, size = 26) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={size} fill={fill}>
    {text}
  </text>
);

/** Top-down head: skull outline + orange brain. On a hit the skull moves at once, the brain lags behind. */
export const Brain: React.FC<{ e: Of<"brain"> }> = ({ e }) => {
  const frame = useElementFrame();
  const mode = e.mode ?? "rest";
  const skull = mode === "rest" ? 0 : prog(frame, HIT_FRAME, 8);
  const brain = mode === "rest" ? 0 : prog(frame, HIT_FRAME + 6, 34);
  const shear = Math.max(0, skull - brain); // relative skull/brain motion, peaks right after the hit
  const rot = (k: number) => (mode === "rotate" ? 38 * k : 0);
  const push = (k: number) => (mode === "push" ? 70 * k : 0);
  const drift = mode === "rest" ? 3 * Math.sin(frame / 9) : 0;
  const pivot = "260px 300px";

  return (
    <div style={{ fontFamily, textAlign: "center", ...appear(frame, 0, 12, 20) }}>
      <svg width={620} height={460} viewBox="0 0 520 440">
        <g
          style={{ transformOrigin: pivot }}
          transform={`translate(${push(skull)} 0) rotate(${rot(skull)} 260 300)`}
        >
          {/* skull: outline, nose, ears */}
          <ellipse cx={260} cy={220} rx={150} ry={180} fill={UI.panel} stroke={COLORS.white} strokeWidth={6} />
          <path d="M240 46 L260 6 L280 46" fill="none" stroke={COLORS.white} strokeWidth={6} strokeLinejoin="round" />
          <ellipse cx={108} cy={230} rx={14} ry={32} fill="none" stroke={COLORS.white} strokeWidth={5} />
          <ellipse cx={412} cy={230} rx={14} ry={32} fill="none" stroke={COLORS.white} strokeWidth={5} />
        </g>
        <g transform={`translate(${push(brain) + drift} 0) rotate(${rot(brain)} 260 300)`}>
          <ellipse cx={260} cy={226} rx={120} ry={150} fill={tint(COLORS.orange, 0.35)} stroke={COLORS.orange} strokeWidth={5} />
          <path d="M260 80 V372" stroke={COLORS.orange} strokeWidth={3} opacity={0.7} />
          {[130, 180, 230, 280, 330].map((y) => (
            <React.Fragment key={y}>
              <path d={`M170 ${y} q20 -22 40 0 t40 0`} fill="none" stroke={COLORS.orange} strokeWidth={3} opacity={0.6} />
              <path d={`M270 ${y} q20 -22 40 0 t40 0`} fill="none" stroke={COLORS.orange} strokeWidth={3} opacity={0.6} />
            </React.Fragment>
          ))}
        </g>
        {mode === "rotate" && shear > 0.05 ? (
          <text
            x={260}
            y={425}
            textAnchor="middle"
            fontFamily={fontFamily}
            fontWeight={800}
            fontSize={30}
            fill={COLORS.red}
            opacity={Math.min(1, shear * 3)}
          >
            СДВИГ СЛОЁВ
          </text>
        ) : null}
        {label(70, 24, "череп", COLORS.white, 24)}
        {label(70, 54, "мозг", COLORS.orange, 24)}
      </svg>
      {e.caption ? (
        <div style={{ ...appear(frame, 20), color: COLORS.grey, fontSize: 30, fontWeight: 600, marginTop: 4 }}>{e.caption}</div>
      ) : null}
    </div>
  );
};

const HEAD = "M105 135 a85 100 0 1 1 170 0 q0 40 -18 78 l-14 26 q-8 10 -20 6 l-70 -24 q-48 -26 -48 -86 z";
const COM = { x: 190, y: 135 };

/** One side-view head: a horizontal punch at height `y` — through the centre of mass it only pushes, off-centre it also turns the head. */
const LeverHead: React.FC<{ y: number; frame: number; turns: boolean; title: string; color: string; note: string }> = ({
  y,
  frame,
  turns,
  title,
  color,
  note,
}) => {
  const arrowIn = prog(frame, 0, 12);
  const hit = prog(frame, HIT_FRAME, 20);
  const arm = Math.abs(y - COM.y);
  return (
    <svg width={470} height={520} viewBox="0 0 470 520">
      {label(235, 32, title, color, 30)}
      <g transform={`translate(${(turns ? 22 : 70) * hit} 0) rotate(${turns ? 32 * hit : 0} ${COM.x} ${COM.y})`}>
        <path d={HEAD} fill={UI.panel} stroke={COLORS.white} strokeWidth={5} strokeLinejoin="round" />
        <circle cx={COM.x} cy={COM.y} r={9} fill={COLORS.orange} />
      </g>
      <rect x={170} y={232} width={46} height={110} fill={UI.dim} />
      {/* force line + arrow from the right */}
      <line x1={420 - 60 * (1 - arrowIn)} y1={y + 6} x2={300} y2={y + 6} stroke={color} strokeWidth={7} opacity={arrowIn * (1 - hit * 0.7)} />
      <path d={`M310 ${y - 10} L284 ${y + 6} L310 ${y + 22}`} fill="none" stroke={color} strokeWidth={7} opacity={arrowIn * (1 - hit * 0.7)} />
      {/* dashed line of force carried through the head to the centre of mass level */}
      <line x1={90} y1={y + 6} x2={284} y2={y + 6} stroke={color} strokeWidth={2} strokeDasharray="8 8" opacity={0.7 * arrowIn} />
      {arm > 5 ? (
        <g opacity={prog(frame, 8, 12)}>
          <line x1={COM.x} y1={COM.y} x2={COM.x} y2={y + 6} stroke={COLORS.orange} strokeWidth={4} />
          {label(COM.x - 52, (COM.y + y) / 2 + 14, "плечо", COLORS.orange, 24)}
        </g>
      ) : (
        <g opacity={prog(frame, 8, 12)}>{label(COM.x, COM.y + 56, "плечо = 0", COLORS.grey, 24)}</g>
      )}
      <g opacity={prog(frame, HIT_FRAME + 10, 12)}>{label(235, 440, note, color, 28)}</g>
    </svg>
  );
};

/** Forehead vs chin: same horizontal force, only the chin punch misses the centre of mass → head rotates. */
export const Lever: React.FC<{ e: Of<"lever"> }> = ({ e }) => {
  const frame = useElementFrame();
  return (
    <div style={{ fontFamily, textAlign: "center", ...appear(frame, 0, 12, 20) }}>
      <div style={{ display: "flex", gap: 40, justifyContent: "center" }}>
        <LeverHead y={COM.y} frame={frame} turns={false} title="В ЦЕНТР" color={COLORS.white} note="голову толкает" />
        <LeverHead y={232} frame={frame} turns title="В ПОДБОРОДОК" color={COLORS.orange} note="голова крутится" />
      </div>
      {e.caption ? (
        <div style={{ ...appear(frame, 26), color: COLORS.grey, fontSize: 30, fontWeight: 600 }}>{e.caption}</div>
      ) : null}
    </div>
  );
};
