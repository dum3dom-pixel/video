import type React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Face } from "./Face";
import { Hand, HandDefs } from "./Hands";

const BODY =
  "M486,922 C440,934 380,948 352,970 C336,985 332,1010 334,1050 C336,1160 352,1330 350,1450 C349,1520 346,1560 344,1598 C400,1612 480,1618 540,1616 C600,1618 680,1612 736,1598 C734,1560 731,1520 730,1450 C728,1330 744,1160 746,1050 C748,1010 744,985 728,970 C700,948 640,934 594,922 Z";
// Left jacket panel including the lapel; the right one is the mirror image.
const PANEL =
  "M486,922 C440,934 380,948 352,970 C336,985 332,1010 334,1050 C336,1160 352,1330 350,1450 C349,1520 346,1560 344,1598 L440,1604 C442,1500 442,1380 442,1262 L496,930 Z";
const LAPEL = "M496,930 L426,992 L444,1008 L428,1100 L442,1262 Z";
const COLLAR = "M500,916 C484,926 462,952 444,1004 C480,1010 510,1040 538,1090 C540,1040 520,960 500,916 Z";

const mirror = "translate(1080 0) scale(-1 1)";

const Sleeve: React.FC<{ len: number; w0: number; w1: number; fill: string; fold?: boolean }> = ({
  len,
  w0,
  w1,
  fill,
  fold,
}) => (
  <g>
    <path
      d={`M${-w0},0 C${-w0 - 4},${len * 0.4} ${-w1 - 4},${len * 0.7} ${-w1},${len} A${w1},${w1} 0 0 0 ${w1},${len} C${w1 + 4},${len * 0.7} ${w0 + 4},${len * 0.4} ${w0},0 A${w0},${w0} 0 0 0 ${-w0},0 Z`}
      fill={fill}
    />
    <path
      d={`M${-w0 * 0.55},6 C${-w0 * 0.62},${len * 0.4} ${-w1 * 0.62},${len * 0.7} ${-w1 * 0.5},${len - 4}`}
      fill="none"
      stroke="rgba(215,228,255,0.45)"
      strokeWidth={12}
      filter="url(#h-b4)"
    />
    <path
      d={`M${w0 * 0.6},6 C${w0 * 0.66},${len * 0.4} ${w1 * 0.66},${len * 0.7} ${w1 * 0.55},${len - 4}`}
      fill="none"
      stroke="rgba(0,0,0,0.5)"
      strokeWidth={12}
      filter="url(#h-b4)"
    />
    {fold &&
      [0.82, 0.9, 0.97].map((k, i) => (
        <path
          key={i}
          d={`M${-w1 + 4},${len * k} Q0,${len * k + 7 - i * 2} ${w1 - 4},${len * k}`}
          fill="none"
          stroke="rgba(0,0,0,0.6)"
          strokeWidth={3}
          filter="url(#h-b1)"
        />
      ))}
  </g>
);

const Sparkle: React.FC<{ x: number; y: number; k: number }> = ({ x, y, k }) =>
  k > 0.02 ? (
    <g transform={`translate(${x},${y}) rotate(${12 + k * 30}) scale(${k})`}>
      <circle r={16} fill="url(#h-glow)" />
      <path d="M0,-30 Q1.5,-1.5 30,0 Q1.5,1.5 0,30 Q-1.5,1.5 -30,0 Q-1.5,-1.5 0,-30 Z" fill="#fff" />
      <path d="M0,-12 Q0.8,-0.8 12,0 Q0.8,0.8 0,12 Q-0.8,0.8 -12,0 Q-0.8,-0.8 0,-12 Z" fill="#fff" transform="rotate(45)" opacity={0.8} />
    </g>
  ) : null;

const CHAIN = "M503,930 C506,1000 528,1070 540,1092 C552,1070 574,1000 577,930";

export const Hero: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const ease = (a: number, b: number) =>
    interpolate(frame, [a, b], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    });

  // Walk: 2 steps per second.
  const stride = Math.sin(2 * Math.PI * t);
  const bob = -10 * Math.abs(stride);
  const sway = stride * 1.1;
  const shiftX = stride * 6;
  const scale = interpolate(frame, [0, 90], [1, 1.04]);
  const smirk = 0.12 + 0.88 * ease(10, 50);
  const blink = Math.max(0, 1 - Math.abs(frame - 35.2) / 1.9);
  const headRot = -sway * 0.9 + Math.sin(2 * Math.PI * t * 0.5) * 0.6;
  const headDy = -bob * 0.25;

  // Right arm (viewer's left) waves: raise 62-74, then two oscillations until the end.
  const raise = ease(62, 74);
  const waveAmp = interpolate(frame, [70, 74], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const osc = Math.sin(((frame - 72) / 9) * 2 * Math.PI) * waveAmp;
  const swing = -stride * (1 - raise);
  const rA1 = 4 + swing * 5 + raise * 38 + osc * 2;
  const rA2 = -5 + swing * 3 + raise * 156 + osc * 15;
  const rA3 = -4 + raise * 2 + osc * 9;
  const curl = 0.4 * (1 - raise);

  const glintA = Math.max(0, 1 - Math.abs(frame - 27) / 5);
  const glintB = Math.max(0, 1 - Math.abs(frame - 58) / 5);

  return (
    <g transform={`translate(${shiftX},${bob}) rotate(${sway} 540 1700) translate(540 1250) scale(${scale}) translate(-540 -1250)`}>
      <defs>
        {[1, 2, 4, 8].map((b) => (
          <filter key={b} id={`h-b${b}`} x={-200} y={-300} width={1500} height={2500} filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation={b} />
          </filter>
        ))}
        <linearGradient id="h-leather" x1={0} y1={0} x2={1} y2={0}>
          <stop offset={0} stopColor="#4a4a54" />
          <stop offset={0.35} stopColor="#2a2a31" />
          <stop offset={1} stopColor="#111115" />
        </linearGradient>
        <linearGradient id="h-leatherR" x1={0} y1={0} x2={1} y2={0}>
          <stop offset={0} stopColor="#17171b" />
          <stop offset={0.7} stopColor="#2a2a31" />
          <stop offset={1} stopColor="#3c3c46" />
        </linearGradient>
        <linearGradient id="h-sleeve" x1={0} y1={0} x2={1} y2={0}>
          <stop offset={0} stopColor="#4a4a56" />
          <stop offset={0.4} stopColor="#26262d" />
          <stop offset={1} stopColor="#0a0a0c" />
        </linearGradient>
        <linearGradient id="h-sleeveR" x1={0} y1={0} x2={1} y2={0}>
          <stop offset={0} stopColor="#2a2a31" />
          <stop offset={0.5} stopColor="#17171b" />
          <stop offset={1} stopColor="#08080a" />
        </linearGradient>
        <linearGradient id="h-lapel" x1={0} y1={0} x2={1} y2={0}>
          <stop offset={0} stopColor="#3f3f47" />
          <stop offset={1} stopColor="#202026" />
        </linearGradient>
        <linearGradient id="h-sheen" x1={0} y1={0} x2={1} y2={0}>
          <stop offset={0} stopColor="rgba(220,230,255,0)" />
          <stop offset={0.5} stopColor="rgba(220,230,255,0.5)" />
          <stop offset={1} stopColor="rgba(220,230,255,0)" />
        </linearGradient>
        <linearGradient id="h-gold" x1={0} y1={0} x2={1} y2={1}>
          <stop offset={0} stopColor="#fff3b5" />
          <stop offset={0.3} stopColor="#efc044" />
          <stop offset={0.55} stopColor="#a8741a" />
          <stop offset={0.8} stopColor="#f4d466" />
          <stop offset={1} stopColor="#8a5a10" />
        </linearGradient>
        <radialGradient id="h-glow">
          <stop offset={0} stopColor="rgba(255,250,220,0.95)" />
          <stop offset={1} stopColor="rgba(255,240,180,0)" />
        </radialGradient>
        <linearGradient id="h-skinc" x1={0} y1={0} x2={0} y2={1}>
          <stop offset={0} stopColor="#c58a67" />
          <stop offset={1} stopColor="#aa7050" />
        </linearGradient>
        <linearGradient id="h-shirtshade" x1={0} y1={0} x2={1} y2={0}>
          <stop offset={0} stopColor="rgba(10,4,2,0.6)" />
          <stop offset={0.3} stopColor="rgba(10,4,2,0)" />
          <stop offset={0.7} stopColor="rgba(10,4,2,0)" />
          <stop offset={1} stopColor="rgba(10,4,2,0.6)" />
        </linearGradient>
        <linearGradient id="h-pants" x1={0} y1={0} x2={1} y2={0}>
          <stop offset={0} stopColor="#2a2a30" />
          <stop offset={0.5} stopColor="#16161a" />
          <stop offset={1} stopColor="#0a0a0c" />
        </linearGradient>
        <linearGradient id="h-paper" x1={0} y1={0} x2={1} y2={0}>
          <stop offset={0} stopColor="#d8d5cb" />
          <stop offset={1} stopColor="#9d9a90" />
        </linearGradient>
        <pattern id="h-paisley" width={46} height={58} patternUnits="userSpaceOnUse" patternTransform="rotate(-14)">
          <rect width={46} height={58} fill="#5f2a24" />
          <path d="M20,6 C33,8 38,25 30,38 C24,47 10,45 10,34 C10,27 16,25 19,29 C16,21 14,13 20,6 Z" fill="#d6bc8d" />
          <path d="M20,14 C26,18 28,28 24,36 C20,40 16,38 17,34" fill="none" stroke="#7a3a2c" strokeWidth={2.2} />
          <circle cx={22} cy={30} r={2.6} fill="#8c2f35" />
          <g transform="translate(23 29)">
            <path d="M20,6 C33,8 38,25 30,38 C24,47 10,45 10,34 C10,27 16,25 19,29 C16,21 14,13 20,6 Z" fill="#8c3a34" transform="scale(0.6) rotate(180 20 26)" />
          </g>
          <circle cx={6} cy={50} r={2} fill="#c9a977" />
          <circle cx={40} cy={10} r={2} fill="#c9a977" />
        </pattern>
        <pattern id="h-news" width={40} height={30} patternUnits="userSpaceOnUse">
          <rect width={40} height={30} fill="#d3d0c5" />
          {[3, 7, 11, 15, 19, 23, 27].map((y, i) => (
            <path key={y} d={`M2,${y} H${38 - (i % 3) * 7}`} stroke="#6a665c" strokeWidth={1.7} />
          ))}
        </pattern>
        <clipPath id="h-clip-body">
          <path d={BODY} />
        </clipPath>
      </defs>
      <HandDefs />

      {/* trousers below the jacket */}
      <path d="M362,1580 L718,1580 L744,1960 L336,1960 Z" fill="url(#h-pants)" />
      <path d="M540,1600 L540,1960" stroke="rgba(255,255,255,0.06)" strokeWidth={6} filter="url(#h-b2)" />

      {/* jacket body, back of the collar */}
      <path d="M482,940 C478,904 494,870 514,864 L566,864 C586,870 602,904 598,940 Z" fill="#17171b" />
      <path d={BODY} fill="url(#h-leather)" />
      <g clipPath="url(#h-clip-body)">
        <ellipse cx={405} cy={986} rx={70} ry={11} transform="rotate(-14 405 986)" fill="rgba(220,230,255,0.45)" filter="url(#h-b4)" />
        <ellipse cx={684} cy={988} rx={60} ry={9} transform="rotate(14 684 988)" fill="rgba(220,230,255,0.2)" filter="url(#h-b4)" />
      </g>

      {/* head with neck: the head counter-moves against the body */}
      <g transform={`translate(540 ${748 + headDy}) rotate(${headRot + raise * 3} 0 150) scale(1.1 1)`}>
        <Face smirk={smirk} blink={blink} />
      </g>

      {/* chest, belt and shirt in the jacket opening */}
      <path d="M452,928 L628,928 L636,1604 L444,1604 Z" fill="#0a0a0c" />
      <path d="M498,926 L582,926 L540,1092 Z" fill="url(#h-skinc)" />
      <path d="M540,990 L540,1090" stroke="rgba(60,25,15,0.35)" strokeWidth={4} filter="url(#h-b2)" />
      <path d="M512,990 C525,1010 534,1030 540,1060" fill="none" stroke="rgba(255,225,200,0.15)" strokeWidth={8} filter="url(#h-b4)" />
      {[0, 1].map((i) => (
        <g key={i} transform={i ? mirror : undefined}>
          <path d="M498,924 L540,1092 L540,1496 L430,1496 L430,1262 Z" fill="url(#h-paisley)" />
          <path d="M498,924 L540,1092 L540,1496 L430,1496 L430,1262 Z" fill="url(#h-shirtshade)" />
        </g>
      ))}
      <path d="M540,1092 L540,1496" stroke="rgba(0,0,0,0.5)" strokeWidth={2} />
      {[1150, 1240, 1330, 1420].map((y) => (
        <g key={y}>
          <circle cx={540} cy={y} r={5} fill="#d8cdb4" stroke="rgba(0,0,0,0.5)" />
          <circle cx={539} cy={y - 1} r={1.6} fill="#fff" opacity={0.7} />
        </g>
      ))}
      <rect x={440} y={1496} width={200} height={34} fill="#14110f" />
      <rect x={522} y={1500} width={36} height={26} rx={4} fill="url(#h-gold)" stroke="#6a4208" />
      <rect x={530} y={1506} width={20} height={14} rx={2} fill="#2b2013" />
      <rect x={440} y={1530} width={200} height={74} fill="url(#h-pants)" />

      {/* newspapers under his left arm (viewer's right) */}
      <g transform="rotate(5 740 1350)">
        <rect x={702} y={1156} width={90} height={410} fill="#8d8a80" />
        <rect x={696} y={1150} width={90} height={410} fill="#b6b3a8" />
        <rect x={690} y={1144} width={90} height={410} fill="url(#h-news)" />
        <rect x={690} y={1144} width={90} height={410} fill="url(#h-paper)" opacity={0.55} />
        <rect x={698} y={1154} width={74} height={22} fill="#2a2a2c" />
        <rect x={698} y={1184} width={34} height={44} fill="#85827a" />
        <path d="M735,1144 V1554" stroke="rgba(0,0,0,0.25)" strokeWidth={3} />
        <rect x={690} y={1544} width={90} height={10} fill="rgba(0,0,0,0.3)" />
        <rect x={690} y={1144} width={90} height={410} fill="none" stroke="rgba(60,58,50,0.7)" strokeWidth={1.5} />
      </g>

      {/* jacket panels and lapels over the shirt */}
      {[0, 1].map((i) => (
        <g key={i} transform={i ? mirror : undefined}>
          <path d={PANEL} fill={i ? "url(#h-leatherR)" : "url(#h-leather)"} />
          <path d={LAPEL} fill="url(#h-lapel)" opacity={i ? 0.45 : 1} />
          <path d="M496,930 L442,1262 L440,1604" fill="none" stroke="rgba(0,0,0,0.7)" strokeWidth={4} />
          <path d="M426,992 L444,1008 L428,1100 L442,1262" fill="none" stroke="rgba(230,238,255,0.5)" strokeWidth={2} filter="url(#h-b1)" opacity={i ? 0.4 : 1} />
          <path d="M436,1006 L448,1022 L436,1100 L446,1250" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth={1.6} strokeDasharray="5 4" />
          <path d="M410,962 C404,1100 400,1300 386,1520" fill="none" stroke="rgba(0,0,0,0.55)" strokeWidth={2.4} />
          <path d="M414,962 C408,1100 404,1300 390,1520" fill="none" stroke="rgba(235,240,255,0.18)" strokeWidth={2} strokeDasharray="2 5" />
          <path d="M366,1352 L446,1338" stroke="#050506" strokeWidth={8} strokeLinecap="round" />
          <path d="M368,1359 L446,1345" stroke="rgba(230,238,255,0.35)" strokeWidth={1.6} />
          {[1240, 1300, 1400, 1470].map((y, k) => (
            <path key={y} d={`M${352 + k * 2},${y} C${390},${y + 14} ${430},${y + 4} ${456},${y + 18}`} fill="none" stroke="rgba(0,0,0,0.55)" strokeWidth={5} filter="url(#h-b2)" />
          ))}
          <path d="M360,1180 C390,1190 420,1186 452,1200" fill="none" stroke="rgba(220,230,255,0.2)" strokeWidth={5} filter="url(#h-b2)" opacity={i ? 0.3 : 1} />
          <path d="M346,1590 C380,1602 420,1606 458,1606" fill="none" stroke="rgba(220,230,255,0.28)" strokeWidth={3} filter="url(#h-b1)" opacity={i ? 0.3 : 1} />
        </g>
      ))}

      {/* collars of the shirt, shadow under the jaw, chain */}
      {[0, 1].map((i) => (
        <g key={i} transform={i ? mirror : undefined}>
          <path d={COLLAR} fill="rgba(0,0,0,0.5)" transform="translate(2 5)" filter="url(#h-b2)" />
          <path d={COLLAR} fill="url(#h-paisley)" />
          <path d={COLLAR} fill="url(#h-shirtshade)" opacity={0.7} />
          <path d="M444,1004 C480,1010 510,1040 538,1090" fill="none" stroke="rgba(255,240,210,0.5)" strokeWidth={2} />
          <path d="M500,918 C484,928 462,954 444,1004" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth={2} />
        </g>
      ))}
      <path d={CHAIN} fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth={13} transform="translate(2 5)" filter="url(#h-b2)" />
      <path d={CHAIN} fill="none" stroke="url(#h-gold)" strokeWidth={13} strokeLinecap="round" />
      <path d={CHAIN} fill="none" stroke="rgba(90,52,0,0.7)" strokeWidth={13} strokeDasharray="1.6 9" />
      <path d={CHAIN} fill="none" stroke="rgba(255,248,200,0.9)" strokeWidth={4} strokeDasharray="5 9" transform="translate(-2 -2)" />
      <circle cx={540} cy={1106} r={19} fill="url(#h-gold)" stroke="#6a4208" strokeWidth={1.5} />
      <circle cx={540} cy={1106} r={13} fill="none" stroke="rgba(110,70,10,0.8)" strokeWidth={2} />
      <path d="M540,1096 V1116 M531,1104 H549" stroke="#7a4e0c" strokeWidth={3.5} strokeLinecap="round" />
      <circle cx={534} cy={1099} r={3} fill="#fff" opacity={0.7} />
      <Sparkle x={523} y={1018} k={glintA} />
      <Sparkle x={541} y={1104} k={glintB} />

      {/* his left arm (viewer's right): upper arm clamps the papers, forearm brings the hand in front */}
      <g transform="translate(714 1010) rotate(-8)">
        <Sleeve len={280} w0={56} w1={50} fill="url(#h-sleeveR)" />
        <g transform="translate(0 280) rotate(40)">
          <g transform="translate(0 236) scale(-1.05 1.05) rotate(18)">
            <Hand curl={0.7} spread={0.6} />
          </g>
          <rect x={-36} y={212} width={72} height={28} rx={5} fill="url(#h-paisley)" />
          <rect x={-35} y={236} width={70} height={11} rx={4} fill="url(#h-gold)" stroke="#6a4208" strokeWidth={1} />
          <Sleeve len={224} w0={52} w1={40} fill="url(#h-sleeveR)" fold />
        </g>
      </g>

      {/* his right arm (viewer's left): 2-bone arm, shoulder -> elbow -> wrist */}
      <g transform={`translate(366 1010) rotate(${rA1})`}>
        <Sleeve len={280} w0={56} w1={50} fill="url(#h-sleeve)" />
        <g transform={`translate(0 280) rotate(${rA2})`}>
          <g transform={`translate(0 268) rotate(${rA3}) scale(1.2)`}>
            <Hand curl={curl} spread={0.5 + raise * 0.75} />
          </g>
          <rect x={-38} y={252} width={76} height={14} rx={5} fill="url(#h-gold)" stroke="#6a4208" strokeWidth={1} />
          <rect x={-38} y={240} width={76} height={22} rx={5} fill="url(#h-paisley)" />
          <Sleeve len={246} w0={52} w1={40} fill="url(#h-sleeve)" fold />
        </g>
      </g>
    </g>
  );
};
