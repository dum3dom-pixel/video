import type React from "react";

// Head + neck, origin = centre of the head (skull ~260px tall). Light comes from the upper left.
const HEAD =
  "M0,-130 C52,-130 90,-96 92,-44 C93,-8 90,34 80,68 C68,104 40,130 0,132 C-40,130 -68,104 -80,68 C-90,34 -93,-8 -92,-44 C-90,-96 -52,-130 0,-130 Z";
const NECK = "M-51,92 C-53,140 -64,190 -90,228 L90,228 C64,190 53,140 51,92 Z";
const HAIR =
  "M-93,16 C-108,-70 -86,-148 0,-153 C86,-148 108,-70 93,16 L87,0 C88,-14 84,-38 78,-60 C72,-72 64,-80 52,-84 C38,-80 22,-82 0,-92 C-22,-82 -38,-80 -52,-84 C-64,-80 -72,-72 -78,-60 C-84,-38 -88,-14 -87,0 Z";
const EYE = "M-19,-3 C-12,-13 10,-13 19,1.5 C10,8 -10,9 -19,-3 Z";

// Slicked-back strands: from the hairline up and over the crown.
const STRANDS = Array.from({ length: 15 }, (_, i) => {
  const k = i - 7;
  const x0 = k * 11;
  const y0 = -86 + Math.abs(k) * 0.9;
  const x1 = k * 12.5;
  const y1 = -146 + Math.abs(k) * 2.4;
  return { d: `M${x0},${y0} C${x0 + k * 1.2},${y0 - 24} ${x1 - k * 0.5},${y1 + 26} ${x1},${y1}`, light: i % 3 !== 1 };
});

const Eye: React.FC<{ m: 1 | -1; x: number; cover: number }> = ({ m, x, cover }) => {
  const lidY = -16 + cover * 25;
  return (
    <g transform={`translate(${x},-18) scale(${m * 1.08},1.08)`}>
      <g clipPath="url(#f-eyeclip)">
        <path d={EYE} fill="url(#f-sclera)" />
        <circle cx={0} cy={-2} r={8.8} fill="url(#f-iris)" />
        <circle cx={0} cy={-2} r={8.8} fill="none" stroke="#1d150c" strokeWidth={1.4} />
        <circle cx={0} cy={-2} r={4} fill="#050403" />
        <circle cx={-3 * m} cy={-5.5} r={2} fill="#fff" opacity={0.95} />
        <circle cx={3 * m} cy={1.5} r={1.1} fill="#fff" opacity={0.45} />
        {/* shadow cast by the upper lid */}
        <rect x={-22} y={-14} width={44} height={11} fill="url(#f-lidshadow)" />
        {/* upper lid (skin) */}
        <path d={`M-24,-20 L24,-20 L24,${lidY} Q0,${lidY + 5} -24,${lidY} Z`} fill="url(#f-lid)" />
        <path d={`M-24,${lidY} Q0,${lidY + 5} 24,${lidY}`} fill="none" stroke="#2a130d" strokeWidth={1.8} />
      </g>
      {/* lash line and flick */}
      <path d="M-20,-3 C-12,-14 10,-14 19,1.5" fill="none" stroke="#24110b" strokeWidth={3} strokeLinecap="round" />
      <path d="M-19,-3 L-24,-6" stroke="#24110b" strokeWidth={2} strokeLinecap="round" />
      {/* lid crease and lower-lid bag */}
      <path d="M-23,-8 C-13,-22 11,-23 22,-6" fill="none" stroke="rgba(85,40,26,0.6)" strokeWidth={1.8} filter="url(#f-b1)" />
      <path d="M-15,10 C-5,13 6,13 16,9" fill="none" stroke="rgba(110,55,38,0.35)" strokeWidth={2.2} filter="url(#f-b1)" />
      <circle cx={17} cy={1.5} r={2} fill="#c07060" opacity={0.7} />
    </g>
  );
};

const Brow: React.FC<{ m: 1 | -1; x: number; y: number; rot: number }> = ({ m, x, y, rot }) => (
  <g transform={`translate(${x},${y}) rotate(${rot * m}) scale(${m},1)`} filter="url(#f-b05)">
    <path d="M12,-5 C0,-14 -26,-15 -42,-2 C-28,-7 -8,-4 12,3 Z" fill="url(#f-brow)" />
    <path d="M10,-3 C-2,-9 -22,-9 -36,-2" fill="none" stroke="#120906" strokeWidth={1.6} opacity={0.7} />
  </g>
);

export const Face: React.FC<{ smirk: number; blink: number }> = ({ smirk: s, blink }) => {
  const cover = 0.26 + 0.06 * s + (1 - 0.26 - 0.06 * s) * blink;
  // Mouth: left corner nearly flat, right corner pulled up by the smirk.
  const Lx = -33;
  const Ly = 85 - 1.5 * s;
  const Rx = 34 + 3 * s;
  const Ry = 85 - 9.5 * s;
  const line = `C-14,${92 - s} 12,${91 - 2 * s} ${Rx},${Ry}`;
  return (
    <g>
      <defs>
        {[0.5, 1, 2, 3, 5, 8, 10].map((b) => (
          <filter
            key={b}
            id={`f-b${String(b).replace(".", "")}`}
            x={-300}
            y={-300}
            width={600}
            height={700}
            filterUnits="userSpaceOnUse"
          >
            <feGaussianBlur stdDeviation={b} />
          </filter>
        ))}
        <filter id="f-stub" x={-120} y={-20} width={240} height={260} filterUnits="userSpaceOnUse">
          <feTurbulence type="fractalNoise" baseFrequency={1.25} numOctaves={2} seed={7} result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.16  0 0 0 0 0.09  0 0 0 0 0.06  11 0 0 0 -5.0" />
        </filter>
        <linearGradient id="f-stubfade" x1={0} y1={0} x2={0} y2={1}>
          <stop offset={0.1} stopColor="#000" />
          <stop offset={0.3} stopColor="#fff" />
        </linearGradient>
        <mask id="f-stubmask" maskUnits="userSpaceOnUse" x={-120} y={-20} width={240} height={260}>
          <rect x={-120} y={30} width={240} height={200} fill="url(#f-stubfade)" />
        </mask>
        <clipPath id="f-head">
          <path d={HEAD} />
        </clipPath>
        <clipPath id="f-neck">
          <path d={NECK} />
        </clipPath>
        <clipPath id="f-hair">
          <path d={HAIR} />
        </clipPath>
        <clipPath id="f-eyeclip">
          <path d={EYE} />
        </clipPath>
        <radialGradient id="f-skin" cx={0.38} cy={0.33} r={0.85}>
          <stop offset={0} stopColor="#f2c9a7" />
          <stop offset={0.5} stopColor="#dca37c" />
          <stop offset={1} stopColor="#a96f4e" />
        </radialGradient>
        <linearGradient id="f-neckg" x1={0} y1={0} x2={1} y2={0}>
          <stop offset={0} stopColor="#cf9774" />
          <stop offset={0.5} stopColor="#b57c5b" />
          <stop offset={1} stopColor="#7e4c36" />
        </linearGradient>
        <linearGradient id="f-side" x1={0} y1={0} x2={1} y2={0}>
          <stop offset={0} stopColor="rgba(110,60,40,0.3)" />
          <stop offset={0.2} stopColor="rgba(110,60,40,0)" />
          <stop offset={0.6} stopColor="rgba(80,38,24,0)" />
          <stop offset={1} stopColor="rgba(70,30,20,0.55)" />
        </linearGradient>
        <linearGradient id="f-jaw" x1={0} y1={0} x2={0} y2={1}>
          <stop offset={0.62} stopColor="rgba(70,30,20,0)" />
          <stop offset={1} stopColor="rgba(60,25,16,0.4)" />
        </linearGradient>
        <linearGradient id="f-sclera" x1={0} y1={0} x2={0} y2={1}>
          <stop offset={0} stopColor="#b9aca2" />
          <stop offset={0.4} stopColor="#eee6de" />
          <stop offset={1} stopColor="#d4c6bb" />
        </linearGradient>
        <radialGradient id="f-iris" cx={0.5} cy={0.5} r={0.5}>
          <stop offset={0} stopColor="#8a7440" />
          <stop offset={0.6} stopColor="#5a4624" />
          <stop offset={1} stopColor="#241a0e" />
        </radialGradient>
        <linearGradient id="f-lidshadow" x1={0} y1={0} x2={0} y2={1}>
          <stop offset={0} stopColor="rgba(20,8,4,0.55)" />
          <stop offset={1} stopColor="rgba(20,8,4,0)" />
        </linearGradient>
        <linearGradient id="f-lid" x1={0} y1={0} x2={0} y2={1}>
          <stop offset={0} stopColor="#c58a6c" />
          <stop offset={1} stopColor="#d9a081" />
        </linearGradient>
        <linearGradient id="f-brow" x1={0} y1={0} x2={1} y2={0}>
          <stop offset={0} stopColor="#1c110c" />
          <stop offset={1} stopColor="#34231a" />
        </linearGradient>
        <linearGradient id="f-hairg" x1={0} y1={0} x2={0.3} y2={1}>
          <stop offset={0} stopColor="#46342a" />
          <stop offset={0.5} stopColor="#201611" />
          <stop offset={1} stopColor="#0d0807" />
        </linearGradient>
        <linearGradient id="f-ulip" x1={0} y1={0} x2={0} y2={1}>
          <stop offset={0} stopColor="#b2695a" />
          <stop offset={1} stopColor="#8c4a40" />
        </linearGradient>
        <linearGradient id="f-llip" x1={0} y1={0} x2={0} y2={1}>
          <stop offset={0} stopColor="#c9806e" />
          <stop offset={1} stopColor="#b06a5c" />
        </linearGradient>
        <radialGradient id="f-nose" cx={0.4} cy={0.35} r={0.7}>
          <stop offset={0} stopColor="#f0c4a2" />
          <stop offset={1} stopColor="#cf966f" />
        </radialGradient>
        <linearGradient id="f-ear" x1={0} y1={0} x2={1} y2={0}>
          <stop offset={0} stopColor="#d49a77" />
          <stop offset={1} stopColor="#a9704f" />
        </linearGradient>
        <linearGradient id="f-sheen" x1={0} y1={0} x2={1} y2={0}>
          <stop offset={0} stopColor="rgba(255,235,215,0)" />
          <stop offset={0.4} stopColor="rgba(255,235,215,0.55)" />
          <stop offset={1} stopColor="rgba(255,235,215,0)" />
        </linearGradient>
      </defs>

      {/* neck */}
      <path d={NECK} fill="url(#f-neckg)" />
      <g clipPath="url(#f-neck)">
        <ellipse cx={0} cy={134} rx={64} ry={34} fill="rgba(35,14,9,0.7)" filter="url(#f-b10)" />
        <path d="M-34,110 C-30,150 -22,190 -12,222" fill="none" stroke="rgba(255,225,200,0.16)" strokeWidth={10} filter="url(#f-b5)" />
        <path d="M34,110 C32,150 26,190 16,222" fill="none" stroke="rgba(40,16,10,0.3)" strokeWidth={9} filter="url(#f-b5)" />
        <ellipse cx={0} cy={172} rx={6} ry={12} fill="rgba(255,225,200,0.16)" filter="url(#f-b3)" />
        <rect x={-120} y={-20} width={240} height={260} filter="url(#f-stub)" mask="url(#f-stubmask)" opacity={0.4} />
      </g>

      {/* ears */}
      {([1, -1] as const).map((m) => (
        <g key={m} transform={`scale(${m},1)`}>
          <path
            d="M-88,-24 C-110,-30 -114,0 -105,24 C-100,38 -92,44 -84,38 Z"
            fill="url(#f-ear)"
            stroke="rgba(90,45,30,0.5)"
            strokeWidth={1.2}
          />
          <path d="M-97,-14 C-105,-2 -100,20 -92,30" fill="none" stroke="rgba(100,48,32,0.6)" strokeWidth={3} filter="url(#f-b1)" />
        </g>
      ))}

      {/* head base + volume */}
      <path d={HEAD} fill="url(#f-skin)" />
      <g clipPath="url(#f-head)">
        <rect x={-100} y={-140} width={200} height={280} fill="url(#f-side)" />
        <rect x={-100} y={-140} width={200} height={280} fill="url(#f-jaw)" />
        <ellipse cx={-14} cy={-72} rx={46} ry={20} fill="#fff" opacity={0.2} filter="url(#f-b10)" />
        <ellipse cx={-48} cy={22} rx={22} ry={14} fill="#fff" opacity={0.14} filter="url(#f-b8)" />
        <ellipse cx={50} cy={22 - 6 * s} rx={20} ry={13} fill="#fff" opacity={0.06 + 0.1 * s} filter="url(#f-b8)" />
        {/* eye sockets */}
        <ellipse cx={-39} cy={-22} rx={30} ry={16} fill="#6a3a2a" opacity={0.22} filter="url(#f-b8)" />
        <ellipse cx={39} cy={-22} rx={30} ry={16} fill="#6a3a2a" opacity={0.26} filter="url(#f-b8)" />
        {/* under the cheekbones and temples */}
        <ellipse cx={-68} cy={40} rx={14} ry={26} fill="#6a3322" opacity={0.2} filter="url(#f-b8)" />
        <ellipse cx={68} cy={40} rx={15} ry={26} fill="#5a2a1a" opacity={0.3} filter="url(#f-b8)" />
        {/* jaw line and chin */}
        <path d="M-82,52 C-70,100 -40,122 0,124 C40,122 70,100 82,52" fill="none" stroke="rgba(60,25,15,0.35)" strokeWidth={9} filter="url(#f-b5)" />
        <ellipse cx={-18} cy={112} rx={22} ry={7} fill="#fff" opacity={0.1} filter="url(#f-b5)" />
        {/* nasolabial folds */}
        <path d="M-24,54 C-34,66 -38,78 -36,90" fill="none" stroke="rgba(90,45,30,0.3)" strokeWidth={3} filter="url(#f-b2)" />
        <path
          d={`M24,54 C34,66 ${40 + 2 * s},${78 - 3 * s} ${38 + 3 * s},${88 - 8 * s}`}
          fill="none"
          stroke={`rgba(85,40,26,${0.3 + 0.25 * s})`}
          strokeWidth={3 + 1.5 * s}
          filter="url(#f-b2)"
        />
        {/* stubble over the lower face */}
        <rect x={-120} y={-20} width={240} height={260} filter="url(#f-stub)" mask="url(#f-stubmask)" opacity={0.5} />
        <ellipse cx={0} cy={96} rx={44} ry={26} fill="rgba(40,20,14,0.14)" filter="url(#f-b8)" />
      </g>

      {/* nose */}
      <g>
        <path d="M5,-28 C12,-10 14,10 17,30 C21,38 25,44 23,51 L10,41 Z" fill="rgba(100,52,36,0.32)" filter="url(#f-b3)" />
        <path d="M-7,-28 C-11,0 -13,22 -17,40" fill="none" stroke="rgba(100,52,36,0.2)" strokeWidth={3} filter="url(#f-b2)" />
        <path d="M-3,-24 C-4,-6 -5,16 -6,32" fill="none" stroke="rgba(255,235,215,0.3)" strokeWidth={5} filter="url(#f-b3)" />
        <ellipse cx={0} cy={39} rx={13.5} ry={11} fill="url(#f-nose)" />
        <ellipse cx={-3} cy={34} rx={4} ry={5} fill="#fff" opacity={0.3} filter="url(#f-b1)" />
        <path d="M-12,40 C-24,41 -27,54 -18,57 C-12,58 -10,53 -10,49" fill="url(#f-nose)" stroke="rgba(90,45,30,0.4)" strokeWidth={1.4} />
        <path d="M12,40 C24,41 27,54 18,57 C12,58 10,53 10,49" fill="#c58c68" stroke="rgba(90,45,30,0.45)" strokeWidth={1.4} />
        <ellipse cx={-8} cy={52} rx={5.5} ry={3.2} transform="rotate(14 -8 52)" fill="#33160f" opacity={0.9} />
        <ellipse cx={8} cy={52} rx={5.5} ry={3.2} transform="rotate(-14 8 52)" fill="#33160f" opacity={0.9} />
        <ellipse cx={0} cy={61} rx={20} ry={6} fill="rgba(80,38,26,0.38)" filter="url(#f-b3)" />
        <path d="M-4,60 C-5,66 -5,70 -5,73" fill="none" stroke="rgba(90,45,30,0.18)" strokeWidth={2} filter="url(#f-b1)" />
        <path d="M4,60 C5,66 5,70 5,73" fill="none" stroke="rgba(90,45,30,0.18)" strokeWidth={2} filter="url(#f-b1)" />
      </g>

      {/* eyes and brows */}
      <Eye m={1} x={-39} cover={cover} />
      <Eye m={-1} x={39} cover={cover} />
      <Brow m={1} x={-24} y={-40} rot={4} />
      <Brow m={-1} x={24} y={-46 - 2 * s} rot={-3} />

      {/* mouth */}
      <g>
        <path d={`M${Lx},${Ly} ${line} C20,${81 - 6 * s} 8,76 0,77.5 C-8,76 -22,78 ${Lx},${Ly} Z`} fill="url(#f-ulip)" />
        <path
          d={`M${Lx},${Ly} ${line} C${Rx - 6},${Ry + 10} 12,103 -6,102 C-22,101 -30,94 ${Lx},${Ly} Z`}
          fill="url(#f-llip)"
        />
        <path d={`M${Lx},${Ly} ${line}`} fill="none" stroke="#3b1812" strokeWidth={2.2} strokeLinecap="round" />
        <ellipse cx={-4} cy={96.5} rx={9} ry={2.4} fill="#fff" opacity={0.3} filter="url(#f-b1)" />
        <ellipse cx={0} cy={110} rx={18} ry={4.5} fill="rgba(85,40,28,0.3)" filter="url(#f-b3)" />
        <path
          d={`M${Rx + 4},${Ry - 5} C${Rx + 8},${Ry + 1} ${Rx + 6},${Ry + 8} ${Rx - 1},${Ry + 12}`}
          fill="none"
          stroke="rgba(80,36,24,0.55)"
          strokeWidth={2.2 * s + 0.4}
          filter="url(#f-b1)"
        />
      </g>

      {/* hair */}
      <path d={HAIR} fill="url(#f-hairg)" />
      <g clipPath="url(#f-hair)">
        {STRANDS.map((st, i) => (
          <path
            key={i}
            d={st.d}
            fill="none"
            stroke={st.light ? "rgba(255,225,190,0.2)" : "rgba(0,0,0,0.55)"}
            strokeWidth={st.light ? 1.5 : 2.2}
          />
        ))}
        <ellipse cx={-26} cy={-120} rx={56} ry={12} transform="rotate(-10 -26 -120)" fill="url(#f-sheen)" filter="url(#f-b3)" />
        <ellipse cx={30} cy={-132} rx={30} ry={6} transform="rotate(10 30 -132)" fill="url(#f-sheen)" opacity={0.5} filter="url(#f-b3)" />
      </g>
      <ellipse cx={0} cy={-80} rx={58} ry={5} fill="rgba(55,26,16,0.28)" filter="url(#f-b3)" clipPath="url(#f-head)" />
      <path d="M18,-152 C62,-146 98,-108 100,-58" fill="none" stroke="rgba(190,210,240,0.5)" strokeWidth={3} filter="url(#f-b1)" />
    </g>
  );
};
