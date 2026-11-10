import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { PAPER } from '../../lines/kit';
import { PLACES, Place, type PlaceKind } from '../../lines/places';
import { G, H, Ground, Head, Man, Sheet, Stamp, Tx, W } from '../piter-bw/shots';

// Лист-образец локаций из lines/places.tsx. Сначала по странице на локацию (4 варианта v, без героя), затем каждый вариант в полный кадр с героем, облачком и штампом.
// npx remotion render src/index.ts PlacesBw out/places/p --sequence --image-format=png

const T = 10;

const Bub: React.FC<{ x: number; y: number; w: number; h?: number; text: string; size?: number }> = ({ x, y, w, h = 130, text, size = 76 }) => (
  <g transform={`translate(${x} ${y})`} strokeWidth={5}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={44} fill={PAPER} />
    <path d={`M${-(w / 2 - 70)} ${h / 2 - 2} L${-(w / 2 - 20)} ${h / 2 + 56} L${-(w / 2 - 130)} ${h / 2 - 2}`} fill={PAPER} />
    <Tx x={0} y={size * 0.34} size={size} bold={1.1}>{text}</Tx>
  </g>
);

/** Четыре варианта на странице: 2×2 по половине кадра. */
const Page: React.FC<{ kind: PlaceKind }> = ({ kind }) => (
  <Sheet>
    {[0, 1, 2, 3].map((v) => (
      <svg key={v} x={(v % 2) * (W / 2)} y={v > 1 ? H / 2 : 0} width={W / 2} height={H / 2} viewBox={`0 0 ${W} ${H}`}>
        <Place kind={kind} v={v} t={T} />
        <Ground />
        <Tx x={W / 2} y={G + 170} size={76}>{`${kind} v${v}`}</Tx>
      </svg>
    ))}
    <path d={`M${W / 2} 0 V${H} M0 ${H / 2} H${W}`} strokeWidth={2} />
  </Sheet>
);

/** Проверка зон кадра: заголовок, герой слева, облачко и штамп на штатных местах. */
const Scene: React.FC<{ kind: PlaceKind; v: number }> = ({ kind, v }) => (
  <Sheet>
    <Head lines={['ЗАГОЛОВОК', 'В ДВЕ СТРОКИ']} t={20} />
    <Place kind={kind} v={v} t={T} />
    <Ground />
    <Man x={330} s={1.75} mouth="smile" hair="tuft" />
    <Bub x={640} y={800} w={820} text="Реплика героя" />
    <Stamp x={700} y={1010} text="ШТАМП" t={T} at={0} size={110} />
  </Sheet>
);

const PAGES: React.FC[] = [
  ...PLACES.map((kind) => () => <Page kind={kind} />),
  ...PLACES.flatMap((kind) => [0, 1, 2, 3].map((v) => () => <Scene kind={kind} v={v} />)),
];

const Main: React.FC = () => {
  const f = Math.min(useCurrentFrame(), PAGES.length - 1);
  const P = PAGES[f];
  return <AbsoluteFill style={{ backgroundColor: '#fff' }}><P /></AbsoluteFill>;
};

export const placesBw = { id: 'PlacesBw', total: PAGES.length, shotCount: PAGES.length, width: W, height: H, Main, Board: Main };
