import React from "react";

import { useElementFrame, accent, appear, COLORS, fontFamily, prog, STAGGER, tint, UI } from "../theme";
import type { Element } from "../types";

type Of<T extends Element["type"]> = Extract<Element, { type: T }>;

const THUMB =
  "M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z";
const BELL =
  "M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z";

export const Card: React.FC<{ e: Of<"card"> }> = ({ e }) => {
  const frame = useElementFrame();
  const [cur, total] = e.page ?? [0, 0];
  return (
    <div style={{ fontFamily, textAlign: "center" }}>
      <div
        style={{
          ...appear(frame, 0, 12, 20),
          width: 780,
          boxSizing: "border-box",
          padding: "44px 52px",
          borderRadius: 24,
          border: `3px solid ${COLORS.green}`,
          background: UI.panel,
        }}
      >
        <div style={{ color: COLORS.green, fontSize: 44, fontWeight: 800, marginBottom: 22 }}>
          {e.title}
        </div>
        <div style={{ color: COLORS.white, fontSize: 36, fontWeight: 600, lineHeight: 1.3, whiteSpace: "pre-line" }}>
          {e.body}
        </div>
        {e.note ? (
          <div
            style={{
              ...appear(frame, 18),
              color: COLORS.grey,
              fontSize: 26,
              fontWeight: 600,
              marginTop: 24,
            }}
          >
            {e.note}
          </div>
        ) : null}
      </div>
      {total > 0 ? (
        <div style={{ ...appear(frame, 14), display: "flex", gap: 14, justifyContent: "center", marginTop: 30 }}>
          {Array.from({ length: total }, (_, i) => (
            <div
              key={i}
              style={{
                width: 16,
                height: 16,
                borderRadius: 16,
                background: i + 1 === cur ? COLORS.green : UI.dim,
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

const Icon: React.FC<{ path: string; size?: number; color?: string; flip?: boolean }> = ({
  path,
  size = 30,
  color = COLORS.grey,
  flip,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    style={{ transform: flip ? "scaleY(-1)" : undefined }}
  >
    <path d={path} />
  </svg>
);

export const Comments: React.FC<{ e: Of<"comments"> }> = ({ e }) => {
  const frame = useElementFrame();
  return (
    <div style={{ fontFamily, display: "flex", flexDirection: "column", gap: 22, width: 820 }}>
      {e.items.map((it, i) => {
        const author = it.author ?? "@user";
        return (
          <div
            key={i}
            style={{
              ...appear(frame, i * STAGGER * 1.5),
              display: "flex",
              gap: 20,
              padding: "22px 28px",
              borderRadius: 26,
              background: UI.panel,
              border: `2px solid ${UI.panelBorder}`,
            }}
          >
            <div
              style={{
                flex: "none",
                width: 56,
                height: 56,
                borderRadius: 56,
                background: UI.dim,
                color: COLORS.grey,
                fontSize: 26,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {author.replace("@", "").charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: COLORS.grey, fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
                {author}
              </div>
              <div style={{ color: COLORS.white, fontSize: 30, fontWeight: 600, lineHeight: 1.25 }}>
                {it.text}
              </div>
              <div style={{ display: "flex", gap: 26, marginTop: 14 }}>
                <Icon path={THUMB} size={26} />
                <Icon path={THUMB} size={26} flip />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const CYRILLIC = /[Ѐ-ӿ]/;

/** Element-relative frame at which the button is "pressed". */
export const BUTTON_PRESS_FRAME = 38;

export const ButtonEl: React.FC<{ e: Of<"button"> }> = ({ e }) => {
  const frame = useElementFrame();
  const PRESS = BUTTON_PRESS_FRAME;
  const ru = CYRILLIC.test(e.label);
  const after =
    e.variant === "like"
      ? ru
        ? "ПОНРАВИЛОСЬ"
        : "LIKED"
      : ru
        ? "ВЫ ПОДПИСАНЫ"
        : "SUBSCRIBED";
  const pressed = frame >= PRESS;
  const p = prog(frame, PRESS, 12);
  // dip, then bounce above 1
  const scale = frame < PRESS ? 1 : 1 - 0.1 * Math.sin(Math.PI * Math.min(1, p * 2)) + (p > 0.5 ? 0.08 * Math.sin(Math.PI * (p - 0.5) * 2) : 0);
  const ring = prog(frame, PRESS, 18);
  const bg = pressed ? COLORS.red : COLORS.white;
  return (
    <div style={{ fontFamily, position: "relative", display: "flex", justifyContent: "center" }}>
      <div style={{ ...appear(frame, 0, 12, 20), position: "relative" }}>
        {pressed ? (
          <div
            style={{
              position: "absolute",
              inset: -4,
              borderRadius: 100,
              border: `4px solid ${COLORS.red}`,
              opacity: 1 - ring,
              transform: `scale(${1 + ring * 0.35})`,
            }}
          />
        ) : null}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            height: 104,
            padding: "0 52px",
            borderRadius: 104,
            background: bg,
            color: pressed ? "#fff" : "#000",
            fontSize: 38,
            fontWeight: 800,
            letterSpacing: "0.04em",
            transform: `scale(${scale})`,
          }}
        >
          <Icon
            path={e.variant === "like" ? THUMB : BELL}
            size={44}
            color={pressed ? "#fff" : "#000"}
          />
          {pressed ? after : e.label}
        </div>
      </div>
    </div>
  );
};

export const Callout: React.FC<{ e: Of<"callout"> }> = ({ e }) => {
  const frame = useElementFrame();
  const c = accent(e.color, "red");
  return (
    <div style={{ fontFamily, textAlign: "center" }}>
      <div
        style={{
          ...appear(frame, 0, 12, 20),
          display: "inline-block",
          maxWidth: 860,
          boxSizing: "border-box",
          padding: "30px 56px",
          borderRadius: 16,
          border: `2px solid ${c}`,
          background: tint(c, 0.1),
          color: c,
          fontSize: 44,
          fontWeight: 800,
          lineHeight: 1.2,
        }}
      >
        {e.text}
      </div>
      {e.note ? (
        <div style={{ ...appear(frame, 14), color: COLORS.grey, fontSize: 28, fontWeight: 600, marginTop: 24 }}>
          {e.note}
        </div>
      ) : null}
    </div>
  );
};
