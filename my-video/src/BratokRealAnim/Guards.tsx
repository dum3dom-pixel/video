import type React from "react";
import { useCurrentFrame } from "remotion";

// Bodyguard in local space, origin = centre of the head (same proportions as the hero).
const HEAD =
  "M0,-128 C58,-128 98,-94 100,-40 C101,0 98,40 86,76 C72,112 42,130 0,132 C-42,130 -72,112 -86,76 C-98,40 -101,0 -100,-40 C-98,-94 -58,-128 0,-128 Z";

const Guard: React.FC<{ id: string; x: number; y: number; scale: number; flip: boolean; phase: number; blur: number }> = ({
  id,
  x,
  y,
  scale,
  flip,
  phase,
  blur,
}) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const bob = -9 * Math.abs(Math.sin(2 * Math.PI * t + phase));
  const sway = Math.sin(2 * Math.PI * t + phase) * 1.4;
  const k = interpolateScale(frame);
  return (
    <g
      transform={`translate(${x},${y + bob}) rotate(${sway}) scale(${flip ? -scale * k : scale * k},${scale * k})`}
      filter={`url(#g-blur${blur})`}
    >
      <defs>
        <linearGradient id={`${id}-suit`} x1={0} y1={0} x2={1} y2={0}>
          <stop offset={0} stopColor="#737a8c" />
          <stop offset={0.45} stopColor="#3b3f4c" />
          <stop offset={1} stopColor="#1a1c22" />
        </linearGradient>
        <radialGradient id={`${id}-skin`} cx={0.4} cy={0.35} r={0.85}>
          <stop offset={0} stopColor="#d9a483" />
          <stop offset={0.6} stopColor="#b57a58" />
          <stop offset={1} stopColor="#7d4b34" />
        </radialGradient>
        <linearGradient id={`${id}-shade`} x1={0} y1={0} x2={1} y2={0}>
          <stop offset={0} stopColor="rgba(80,40,25,0.1)" />
          <stop offset={0.5} stopColor="rgba(80,40,25,0)" />
          <stop offset={1} stopColor="rgba(40,18,10,0.55)" />
        </linearGradient>
        <linearGradient id={`${id}-glass`} x1={0} y1={0} x2={1} y2={1}>
          <stop offset={0} stopColor="#3a3d46" />
          <stop offset={0.5} stopColor="#09090c" />
          <stop offset={1} stopColor="#000" />
        </linearGradient>
        <clipPath id={`${id}-head`}>
          <path d={HEAD} />
        </clipPath>
      </defs>
      {/* arms hanging down with clasped hands */}
      <path d="M-215,190 C-260,230 -268,420 -250,640 L-130,660 C-140,480 -150,330 -150,210 Z" fill={`url(#${id}-suit)`} />
      <path d="M215,190 C260,230 268,420 250,640 L130,660 C140,480 150,330 150,210 Z" fill={`url(#${id}-suit)`} />
      {/* torso and shoulders */}
      <path
        d="M-70,150 C-170,165 -250,190 -268,270 L-285,1800 L285,1800 L268,270 C250,190 170,165 70,150 Z"
        fill={`url(#${id}-suit)`}
      />
      <ellipse cx={-170} cy={205} rx={90} ry={14} transform="rotate(-8 -170 205)" fill="rgba(215,225,255,0.22)" filter="url(#g-blur4)" />
      <path d="M-50,150 L0,400 L50,150 Z" fill="#cfd0d6" />
      <path d="M-50,150 L-6,330 L-44,260 Z" fill="rgba(0,0,0,0.25)" />
      <path d="M-14,165 L14,165 L22,340 L0,372 L-22,340 Z" fill="#0b0b0e" />
      <path d="M-6,180 L-3,330" stroke="rgba(255,255,255,0.18)" strokeWidth={3} />
      <path d="M-50,150 L-130,330 L-40,520 L-24,400 Z" fill="#101114" />
      <path d="M50,150 L130,330 L40,520 L24,400 Z" fill="#08080a" />
      <path d="M-50,150 L-130,330 L-40,520" fill="none" stroke="rgba(210,220,255,0.22)" strokeWidth={3} />
      {/* neck */}
      <path d="M-56,96 L-62,180 L62,180 L56,96 Z" fill={`url(#${id}-skin)`} />
      <rect x={-62} y={96} width={124} height={50} fill="rgba(30,12,8,0.5)" filter="url(#g-blur4)" />
      {/* head */}
      <path d={HEAD} fill={`url(#${id}-skin)`} />
      <g clipPath={`url(#${id}-head)`}>
        <rect x={-110} y={-140} width={220} height={280} fill={`url(#${id}-shade)`} />
        <ellipse cx={-20} cy={-70} rx={50} ry={20} fill="#fff" opacity={0.14} filter="url(#g-blur8)" />
        <ellipse cx={0} cy={60} rx={90} ry={50} fill="rgba(40,18,10,0.25)" filter="url(#g-blur8)" />
        <path d="M-14,-20 C-18,10 -20,30 -24,48 L8,50" fill="none" stroke="rgba(70,34,22,0.4)" strokeWidth={6} filter="url(#g-blur4)" />
        <path d="M-40,92 Q0,100 40,92" fill="none" stroke="#2a1410" strokeWidth={5} filter="url(#g-blur1)" />
      </g>
      <ellipse cx={-102} cy={10} rx={12} ry={28} fill="#9d6446" />
      <ellipse cx={102} cy={10} rx={12} ry={28} fill="#7d4b34" />
      {/* short hair */}
      <path
        d="M-100,-20 C-112,-90 -70,-146 0,-148 C70,-146 112,-90 100,-20 C96,-60 70,-94 0,-94 C-70,-94 -96,-60 -100,-20 Z"
        fill="#151010"
      />
      <ellipse cx={-30} cy={-120} rx={50} ry={9} fill="rgba(230,235,255,0.3)" filter="url(#g-blur3)" />
      {/* sunglasses */}
      <path d="M-88,-34 L88,-34 L88,-18 L-88,-18 Z" fill="#050507" />
      <path d="M-84,-30 L-8,-30 C-8,6 -26,20 -48,20 C-72,20 -84,0 -84,-30 Z" fill={`url(#${id}-glass)`} stroke="#050507" strokeWidth={4} />
      <path d="M84,-30 L8,-30 C8,6 26,20 48,20 C72,20 84,0 84,-30 Z" fill={`url(#${id}-glass)`} stroke="#050507" strokeWidth={4} />
      <path d="M-70,-24 L-46,-24 L-62,6 Z" fill="rgba(255,255,255,0.22)" />
      <path d="M26,-24 L50,-24 L34,6 Z" fill="rgba(255,255,255,0.12)" />
      <path d="M-20,45 C-10,56 10,56 20,45" fill="none" stroke="rgba(60,28,16,0.7)" strokeWidth={4} />
    </g>
  );
};

// Guards drift slightly closer with the walk (1.0 -> 1.025).
const interpolateScale = (frame: number) => 1 + (frame / 90) * 0.025;

export const Guards: React.FC = () => (
  <g>
    <defs>
      {[1, 3, 4, 8].map((b) => (
        <filter key={b} id={`g-blur${b}`} x={-1500} y={-600} width={3000} height={3200} filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation={b === 1 ? 1 : b} />
        </filter>
      ))}
    </defs>
    <Guard id="g1" x={105} y={700} scale={0.64} flip={false} phase={1.6} blur={3} />
    <Guard id="g2" x={1005} y={690} scale={0.66} flip phase={3.3} blur={3} />
  </g>
);
