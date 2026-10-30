import type React from "react";

// Hand in local space: wrist at (0,0), fingers along +y, thumb on the -x side (palm view of a right hand
// seen from the front). curl 0 = open, 1 = closed.
const PALM = "M-27,-6 C-35,24 -41,56 -41,86 C-30,98 30,98 41,86 C41,56 35,24 27,-6 Z";

const FINGERS = [
  { x: -27, a: 10, len: 74, w: 17, ring: false },
  { x: -9, a: 3, len: 85, w: 18, ring: false },
  { x: 10, a: -4, len: 78, w: 17, ring: true },
  { x: 28, a: -12, len: 60, w: 15, ring: true },
] as const;

export const HandDefs: React.FC = () => (
  <defs>
    <linearGradient id="hd-finger" x1={0} y1={0} x2={1} y2={0}>
      <stop offset={0} stopColor="#e6b392" />
      <stop offset={0.55} stopColor="#d29a76" />
      <stop offset={1} stopColor="#a96d4c" />
    </linearGradient>
    <radialGradient id="hd-palm" cx={0.4} cy={0.35} r={0.8}>
      <stop offset={0} stopColor="#e9b896" />
      <stop offset={0.6} stopColor="#d09872" />
      <stop offset={1} stopColor="#a56a49" />
    </radialGradient>
    <linearGradient id="hd-gold" x1={0} y1={0} x2={1} y2={1}>
      <stop offset={0} stopColor="#fff3b5" />
      <stop offset={0.3} stopColor="#efc044" />
      <stop offset={0.55} stopColor="#a8741a" />
      <stop offset={0.8} stopColor="#f4d466" />
      <stop offset={1} stopColor="#8a5a10" />
    </linearGradient>
    <filter id="hd-b1" x={-100} y={-100} width={300} height={300} filterUnits="userSpaceOnUse">
      <feGaussianBlur stdDeviation={1.2} />
    </filter>
    <filter id="hd-b3" x={-100} y={-100} width={300} height={300} filterUnits="userSpaceOnUse">
      <feGaussianBlur stdDeviation={3.5} />
    </filter>
  </defs>
);

const Finger: React.FC<{ f: (typeof FINGERS)[number]; curl: number; spread: number }> = ({ f, curl, spread }) => {
  const L = f.len * (1 - 0.5 * curl);
  const crease = (k: number) => `M${-f.w / 2 + 3},${L * k} Q0,${L * k + 2.5} ${f.w / 2 - 3},${L * k}`;
  return (
    <g transform={`translate(${f.x},84) rotate(${f.a * spread})`}>
      <rect x={-f.w / 2} y={-6} width={f.w} height={L + 6} rx={f.w / 2} fill="url(#hd-finger)" stroke="rgba(70,35,25,0.6)" strokeWidth={1.1} />
      <rect x={-f.w / 2} y={-6} width={f.w} height={L + 6} rx={f.w / 2} fill="rgba(60,25,15,1)" opacity={curl * 0.22} />
      <path d={crease(0.4)} fill="none" stroke="rgba(110,60,42,0.55)" strokeWidth={1.2} />
      <path d={crease(0.72)} fill="none" stroke="rgba(110,60,42,0.5)" strokeWidth={1.2} />
      <ellipse cx={-f.w * 0.15} cy={L - f.w * 0.5} rx={f.w * 0.2} ry={f.w * 0.3} fill="#fff" opacity={0.2} filter="url(#hd-b1)" />
      {f.ring && (
        <g>
          <rect x={-f.w / 2 - 1.5} y={L * 0.18} width={f.w + 3} height={7.5} rx={2.5} fill="url(#hd-gold)" stroke="#6a4208" strokeWidth={0.8} />
          <rect x={-f.w / 2 + 1} y={L * 0.18 + 1.5} width={f.w * 0.5} height={1.8} rx={0.9} fill="#fff" opacity={0.8} />
        </g>
      )}
    </g>
  );
};

export const Hand: React.FC<{ curl?: number; spread?: number }> = ({ curl = 0, spread = 1 }) => (
  <g>
    {[...FINGERS].reverse().map((f) => (
      <Finger key={f.x} f={f} curl={curl} spread={spread} />
    ))}
    <path d={PALM} fill="url(#hd-palm)" stroke="rgba(70,35,25,0.55)" strokeWidth={1.1} />
    {/* palm lines, thenar shading, shadow under the knuckles */}
    <path d="M-32,44 C-12,54 12,56 34,44" fill="none" stroke="rgba(110,55,38,0.4)" strokeWidth={1.8} filter="url(#hd-b1)" />
    <path d="M-30,26 C-16,34 -10,60 -16,82" fill="none" stroke="rgba(110,55,38,0.4)" strokeWidth={2} filter="url(#hd-b1)" />
    <ellipse cx={-22} cy={52} rx={13} ry={26} fill="#f6d2b4" opacity={0.25} filter="url(#hd-b3)" />
    <ellipse cx={0} cy={0} rx={30} ry={10} fill="rgba(60,25,15,0.35)" filter="url(#hd-b3)" />
    <rect x={-38} y={82} width={76} height={5} fill="rgba(80,38,25,0.28)" filter="url(#hd-b1)" />
    {/* thumb */}
    <g transform={`translate(-34,54) rotate(${40 - 55 * curl})`}>
      <rect x={-11} y={-4} width={22} height={42} rx={11} fill="url(#hd-finger)" stroke="rgba(70,35,25,0.6)" strokeWidth={1.1} />
      <g transform="translate(0,34) rotate(-6)">
        <rect x={-9.5} y={0} width={19} height={32 * (1 - 0.3 * curl)} rx={9.5} fill="url(#hd-finger)" stroke="rgba(70,35,25,0.6)" strokeWidth={1.1} />
        <path d="M-6,2 Q0,5 6,2" fill="none" stroke="rgba(110,60,42,0.55)" strokeWidth={1.2} />
      </g>
    </g>
  </g>
);
