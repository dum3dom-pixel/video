import { useContext } from "react";
import type React from "react";
import { random, useCurrentFrame } from "remotion";
import {
  arcPoints,
  ellipsePoints,
  Glint,
  GRAPHITE,
  InkScale,
  SketchLine,
  SketchShape,
  type Pt,
} from "../BallCity/sketch";

export const GOLD = "#d4a017";
export const GOLD_L = "#f2c14e";
const SKIN = "#f0c8a2";
const SKIN_D = "#d4875a";
const L1 = 150; // upper arm
const L2 = 140; // forearm

export type Outfit = "leather" | "burgundy" | "blackLeather";
export type Expression = "smirk" | "smile" | "talk";
export type ArmPose = { readonly a: number; readonly b: number };

const OUTFITS = {
  leather: { coat: "#2a2a30", dark: "#000000", shirt: "#f1e6c8", pants: "#33333f", vTop: 34, vBot: 9 },
  burgundy: { coat: "#7a1830", dark: "#3d0614", shirt: "#f4f0e6", pants: "#2a2a35", vTop: 46, vBot: 24 },
  blackLeather: { coat: "#1f1f24", dark: "#000000", shirt: "#1f1f24", pants: "#1f1f24", vTop: 6, vBot: 3 },
} as const;

// Inverse kinematics: arm angles (degrees, positive = swing outward/up) that put the
// wrist at `target` in character space. The elbow is kept low/outside like a real arm.
export const reach = (side: "L" | "R", target: Pt): ArmPose => {
  const s = side === "R" ? 1 : -1;
  const dx = (target[0] - s * 118) * s;
  const dy = target[1] + 245;
  const d = Math.min(Math.max(Math.hypot(dx, dy), L1 - L2 + 1), L1 + L2 - 1);
  const base = Math.atan2(dx, dy);
  const alpha = Math.acos((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d));
  const score = (t: number) => Math.cos(t) * L1 + Math.sin(t) * L1 * 0.6;
  const t1 = score(base + alpha) > score(base - alpha) ? base + alpha : base - alpha;
  const tx = Math.sin(base) * d;
  const ty = Math.cos(base) * d;
  const t2 = Math.atan2(tx - Math.sin(t1) * L1, ty - Math.cos(t1) * L1);
  const deg = 180 / Math.PI;
  return { a: t1 * deg, b: (t2 - t1) * deg };
};

type HandProps = {
  readonly uid: string;
  readonly rings?: boolean;
  readonly bling?: number;
  readonly glints?: readonly number[]; // start frames, one per ring
  readonly children?: React.ReactNode;
};

// Hand centred at (0,0); the wrist is at y=-22, fingers point to +y.
export const Hand: React.FC<HandProps> = ({ uid, rings, bling = 1, glints = [], children }) => (
  <g>
    {[[-21, 44], [-7, 50], [7, 50], [21, 44]].map(([x, y], i) => (
      <SketchShape key={i} id={`${uid}-fg${i}`} points={ellipsePoints(x, y, 9.5, 21, 10)} seed={`${uid}fg${i}`} fill={SKIN} passes={1} width={2.5} amp={0.8} />
    ))}
    <SketchShape id={`${uid}-palm`} points={ellipsePoints(0, 8, 29, 34, 14)} seed={`${uid}palm`} fill={SKIN} hatch={SKIN_D} gap={8} hatchOpacity={0.4} passes={1} width={3} amp={1.5} />
    <SketchShape id={`${uid}-thumb`} points={ellipsePoints(-30, 0, 11, 22, 10)} seed={`${uid}th`} fill={SKIN} passes={1} width={3} amp={1} />
    {rings ? (
      <>
        <SketchShape id={`${uid}-br`} points={[[-31, -36], [31, -36], [33, -22], [-33, -22]]} seed={`${uid}br`} fill={GOLD_L} hatch={GOLD} gap={6} hatchOpacity={0.8} width={3} passes={1} amp={1} />
        {[[-21, 40], [-7, 46], [21, 40]].map(([x, y], i) => (
          <g key={i}>
            <SketchShape id={`${uid}-r${i}`} points={ellipsePoints(x, y, 13 * bling, 7 * bling, 12)} seed={`${uid}r${i}`} fill={GOLD_L} hatch={GOLD} gap={4} hatchOpacity={0.9} width={3 * bling} passes={1} amp={0.8} />
            <circle cx={x} cy={y - 5 * bling} r={4 * bling} fill="#fff" opacity={0.9} />
            {glints[i] !== undefined ? <Glint cx={x} cy={y} from={glints[i]} size={34 * bling} /> : null}
          </g>
        ))}
      </>
    ) : null}
    {children}
  </g>
);

type ArmProps = {
  readonly side: "L" | "R";
  readonly pose: ArmPose;
  readonly coat: string;
  readonly dark: string;
  readonly uid: string;
  readonly rings: boolean;
  readonly bling: number;
  readonly glints?: readonly number[];
  readonly held?: React.ReactNode;
};

const Arm: React.FC<ArmProps> = ({ side, pose, coat, dark, uid, rings, bling, glints, held }) => {
  const s = side === "R" ? 1 : -1;
  const id = `${uid}-arm${side}`;
  return (
    <g transform={`translate(${s * 118} -245) rotate(${-s * pose.a})`}>
      <SketchShape id={`${id}u`} points={[[-26, -14], [26, -14], [30, 20], [25, L1], [-25, L1], [-30, 20]]} seed={`${id}u`} fill={coat} hatch={dark} gap={9} hatchOpacity={0.55} width={3.5} />
      <g transform={`translate(0 ${L1}) rotate(${-s * pose.b})`}>
        <SketchShape id={`${id}f`} points={[[-27, -22], [27, -22], [22, L2 - 6], [-22, L2 - 6]]} seed={`${id}f`} fill={coat} hatch={dark} gap={9} hatchOpacity={0.55} width={3.5} />
        <g transform={`translate(0 ${L2 + 14})`}>
          <Hand uid={id} rings={rings} bling={bling} glints={glints}>{held}</Hand>
        </g>
      </g>
    </g>
  );
};

const Leg: React.FC<{ readonly s: number; readonly lift: number; readonly pants: string; readonly uid: string }> = ({ s, lift, pants, uid }) => (
  <g transform={`translate(${s * 46} ${24 - lift})`}>
    <SketchShape id={`${uid}-leg${s}`} points={[[-40, 0], [40, 0], [35, 260], [-35, 260]]} seed={`${uid}leg${s}`} fill={pants} hatch="#000" gap={9} hatchOpacity={0.4} width={3.5} />
    <SketchShape id={`${uid}-shoe${s}`} points={ellipsePoints(s * 6, 278, 50, 24, 14)} seed={`${uid}shoe${s}`} fill="#15151a" hatch="#555" gap={8} hatchOpacity={0.5} width={3} />
  </g>
);

const hairPoints = (): Pt[] => {
  const n = 14;
  const outer = Array.from({ length: n + 1 }, (_, k): Pt => {
    const a = Math.PI + (k / n) * Math.PI;
    const r = k % 2 === 1 ? 1.3 : 1.04;
    return [Math.cos(a) * 85 * r, -372 + Math.sin(a) * 104 * r];
  });
  const inner = Array.from({ length: n + 1 }, (_, k): Pt => {
    const a = 2 * Math.PI - (k / n) * Math.PI;
    return [Math.cos(a) * 70, -350 + Math.sin(a) * 82];
  });
  return [...outer, ...inner];
};
const HAIR = hairPoints();

type CharacterProps = {
  readonly outfit: Outfit;
  readonly expression?: Expression;
  readonly goldChain?: boolean;
  readonly rings?: boolean;
  readonly goldTooth?: boolean;
  readonly bling?: number; // ring/bracelet size multiplier
  readonly legs?: boolean;
  readonly walk?: number; // walk-cycle phase in radians
  readonly armL?: ArmPose;
  readonly armR?: ArmPose;
  readonly heldL?: React.ReactNode;
  readonly heldR?: React.ReactNode;
  readonly headTilt?: number;
  readonly gaze?: Pt; // pupil offset in px
  readonly glints?: {
    readonly tooth?: readonly number[];
    readonly chain?: readonly number[];
    readonly rightHand?: readonly number[];
    readonly leftHand?: readonly number[];
  };
  readonly x?: number;
  readonly y?: number;
  readonly scale?: number;
  readonly uid?: string;
};

const Mouth: React.FC<{ readonly expression: Expression; readonly gold: boolean; readonly toothGlints: readonly number[]; readonly uid: string }> = ({ expression, gold, toothGlints, uid }) => {
  const frame = useCurrentFrame();
  if (expression === "smirk") {
    return (
      <>
        <SketchLine seed={`${uid}mouth`} passes={2} width={5} amp={1.2} points={[[-30, -322], [-8, -314], [16, -318], [36, -338]]} />
        <SketchLine seed={`${uid}dimple`} passes={1} width={3} amp={0.8} points={[[40, -334], [46, -344]]} />
      </>
    );
  }
  const open = expression === "talk" ? (Math.sin(frame * 1.9) + 1) / 2 : 1;
  const ry = expression === "talk" ? 4 + 18 * open : 26;
  const cy = expression === "talk" ? -322 : -340;
  const mouth =
    expression === "talk"
      ? ellipsePoints(0, cy, 28, ry, 14)
      : arcPoints(0, cy, 40, ry, 12, 168, 10);
  const top = expression === "talk" ? cy - ry : cy + ry * 0.2;
  return (
    <>
      <SketchShape id={`${uid}-mouth`} points={mouth} seed={`${uid}mo`} fill="#5c1f1f" width={4} passes={1} amp={1} />
      <rect x={-22} y={top} width={44} height={9} fill="#fffdf4" stroke={GRAPHITE} strokeWidth={1.5} />
      {gold ? <rect x={-16} y={top} width={13} height={9} fill={GOLD_L} stroke={GOLD} strokeWidth={2} /> : null}
      {gold
        ? toothGlints.map((f, i) => <Glint key={i} cx={-9} cy={top + 4} from={f} size={44} />)
        : null}
    </>
  );
};

export const Character: React.FC<CharacterProps> = ({
  outfit,
  expression = "smirk",
  goldChain = false,
  rings = false,
  goldTooth = false,
  bling = 1,
  legs = true,
  walk = 0,
  armL = { a: 7, b: 5 },
  armR = { a: 7, b: 5 },
  heldL,
  heldR,
  headTilt = 0,
  gaze = [0, 0],
  glints = {},
  x = 0,
  y = 0,
  scale = 1,
  uid = "hero",
}) => {
  const frame = useCurrentFrame();
  const k = useContext(InkScale);
  const o = OUTFITS[outfit];
  const blink = (frame + Math.floor(random(uid) * 30)) % 34 === 0;
  const curls: Pt[] = [[-14, -245], [16, -215], [-8, -180], [12, -150], [-6, -115], [7, -85]];
  const lift = (s: number) => (walk ? Math.max(0, Math.sin(walk + (s > 0 ? Math.PI : 0))) * 34 : 0);
  return (
    <InkScale.Provider value={k / Math.sqrt(scale)}>
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {legs ? (
        <>
          <Leg s={-1} lift={lift(-1)} pants={o.pants} uid={uid} />
          <Leg s={1} lift={lift(1)} pants={o.pants} uid={uid} />
        </>
      ) : null}
      {/* neck + shirt */}
      <SketchShape id={`${uid}-neck`} points={[[-28, -310], [28, -310], [32, -266], [-32, -266]]} seed={`${uid}neck`} fill={SKIN} hatch={SKIN_D} gap={7} hatchOpacity={0.5} width={3} passes={1} />
      <SketchShape id={`${uid}-shirt`} points={[[-120, -255], [-62, -278], [62, -278], [120, -255], [100, -120], [92, 12], [-92, 12], [-100, -120]]} seed={`${uid}shirt`} fill={o.shirt} hatch={outfit === "leather" ? "#c9792f" : "#b9a98a"} gap={13} hatchOpacity={outfit === "blackLeather" ? 0 : 0.35} outline={false} />
      {outfit === "burgundy" ? (
        <SketchShape id={`${uid}-chest`} points={[[-34, -278], [34, -278], [0, -130]]} seed={`${uid}chest`} fill={SKIN} hatch={SKIN_D} gap={7} hatchOpacity={0.5} width={2.5} passes={1} />
      ) : null}
      {outfit === "leather"
        ? curls.map(([cx, cy], i) => (
            <SketchLine key={i} seed={`${uid}curl${i}`} passes={1} width={3.5} amp={0.8} color={i % 2 ? "#2a9d8f" : "#d9622b"} points={arcPoints(cx, cy, 9, 9, 200, 480, 9)} />
          ))
        : null}
      {([-1, 1] as const).map((s) => (
        <SketchShape
          key={s}
          id={`${uid}-coat${s}`}
          points={[[s * 120, -255], [s * 62, -280], [s * o.vTop, -276], [s * o.vBot, -40], [s * (o.vBot + 4), 12], [s * 92, 12], [s * 102, -120]]}
          seed={`${uid}coat${s}`}
          fill={o.coat}
          hatch={outfit === "burgundy" ? "#c04060" : "#6a6a78"}
          gap={outfit === "burgundy" ? 8 : 14}
          hatchOpacity={outfit === "burgundy" ? 0.45 : 0.35}
          width={4}
        />
      ))}
      {outfit === "blackLeather" ? (
        <SketchLine seed={`${uid}zip`} passes={1} width={3} color="#9a9aa8" points={[[0, -274], [0, 12]]} />
      ) : (
        <>
          <SketchLine seed={`${uid}lapL`} passes={1} width={3} points={[[-62, -278], [-52, -225], [-o.vTop + 6, -210]]} />
          <SketchLine seed={`${uid}lapR`} passes={1} width={3} points={[[62, -278], [52, -225], [o.vTop - 6, -210]]} />
        </>
      )}
      {goldChain ? (
        <g>
          <SketchLine seed={`${uid}chain`} passes={2} width={9} color={GOLD} amp={1} points={arcPoints(0, -282, 50, 92, 8, 172, 10)} />
          <SketchLine seed={`${uid}chainl`} passes={1} width={4} color={GOLD_L} amp={1} points={arcPoints(0, -284, 50, 92, 8, 172, 10)} />
          <SketchShape id={`${uid}-pend`} points={ellipsePoints(0, -186, 17, 20, 10)} seed={`${uid}pend`} fill={GOLD_L} hatch={GOLD} gap={5} hatchOpacity={0.9} width={3} passes={1} />
          {(glints.chain ?? []).map((f, i) => <Glint key={i} cx={0} cy={-190} from={f} size={50} />)}
        </g>
      ) : null}
      {/* head */}
      <g transform={`rotate(${headTilt} 0 -300)`}>
        <SketchShape id={`${uid}-earL`} points={ellipsePoints(-83, -368, 14, 24, 10)} seed={`${uid}eL`} fill={SKIN} passes={1} width={3} />
        <SketchShape id={`${uid}-earR`} points={ellipsePoints(83, -368, 14, 24, 10)} seed={`${uid}eR`} fill={SKIN} passes={1} width={3} />
        <SketchShape id={`${uid}-face`} points={ellipsePoints(0, -372, 82, 98, 28)} seed={`${uid}face`} fill={SKIN} hatch={SKIN_D} gap={11} hatchOpacity={0.35} width={4} />
        <SketchShape id={`${uid}-hair`} points={HAIR} seed={`${uid}hair`} fill="#2a2018" hatch="#7a6048" gap={7} hatchOpacity={0.5} width={3.5} />
        {([-1, 1] as const).map((s) => (
          <g key={s}>
            {blink ? (
              <SketchLine seed={`${uid}bl${s}`} passes={1} width={4} points={[[s * 32 - 15, -380], [s * 32 + 15, -380]]} />
            ) : (
              <>
                <SketchShape id={`${uid}-eye${s}`} points={ellipsePoints(s * 32, -380, 16, 10, 12)} seed={`${uid}eye${s}`} fill="#fff" width={3} passes={1} amp={0.8} />
                <circle cx={s * 32 + gaze[0]} cy={-380 + gaze[1]} r={6} fill={GRAPHITE} />
                <SketchLine seed={`${uid}lid${s}`} passes={1} width={5} amp={0.8} points={[[s * 32 - 18, -386], [s * 32, -391], [s * 32 + 18, -386]]} />
              </>
            )}
            <SketchLine seed={`${uid}brow${s}`} passes={1} width={6} amp={1} color="#2a2018" points={[[s * 16, -400 + (s < 0 ? -4 : 2)], [s * 50, -410 + (s < 0 ? -8 : 0)]]} />
          </g>
        ))}
        <SketchLine seed={`${uid}nose`} passes={1} width={3.5} amp={0.8} color="#8a5a3a" points={[[2, -390], [-8, -352], [8, -346]]} />
        <Mouth expression={expression} gold={goldTooth} toothGlints={glints.tooth ?? []} uid={uid} />
      </g>
      {/* arms last so hands pass in front of the face */}
      <Arm side="L" pose={armL} coat={o.coat} dark={o.dark} uid={uid} rings={rings} bling={bling} glints={glints.leftHand} held={heldL} />
      <Arm side="R" pose={armR} coat={o.coat} dark={o.dark} uid={uid} rings={rings} bling={bling} glints={glints.rightHand} held={heldR} />
    </g>
    </InkScale.Provider>
  );
};
