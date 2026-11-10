import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Bench, Bin, Block, Birds, Backdrop, Bush, Cloud2, Fence, Frame, Hydrant, House, Lamp, Office, Plant, PowerLines, Shop, Sign, Sun, Tree, Tufts } from '../../lines/env';
import { Car, G, H, Head, Man, Sheet, Tx, W } from '../piter-bw/shots';

// Лист-образец окружения: что есть в lines/env.tsx. Одна страница на кадр.
const Lbl: React.FC<{ x: number; text: string }> = ({ x, text }) => <Tx x={x} y={G + 62} size={34}>{text}</Tx>;

const Page1: React.FC = () => (
  <Sheet>
    <Head lines={['ДОМА']} t={20} y={200} />
    <path d={`M0 ${G} H${W} M0 ${G + 12} H${W}`} />
    <Block x={125} s={0.62} floors={8} cols={4} seed={1} /><Lbl x={125} text="панелька" />
    <Office x={330} s={0.62} floors={11} seed={2} /><Lbl x={330} text="башня" />
    <House x={560} s={0.62} t={20} /><Lbl x={560} text="дом" />
    <Shop x={850} s={0.62} /><Lbl x={850} text="магазин" />
    <Man x={470} s={0.55} mouth="smile" />
  </Sheet>
);
const Page2: React.FC = () => (
  <Sheet>
    <Head lines={['ДЕРЕВЬЯ И ПАЛКИ']} t={20} y={200} />
    <path d={`M0 ${G} H${W} M0 ${G + 12} H${W}`} />
    <Tree x={140} kind="round" s={0.85} seed={5} /><Lbl x={140} text="крона" />
    <Tree x={380} kind="bare" s={1.05} seed={11} /><Lbl x={380} text="голое" />
    <Tree x={620} kind="pine" s={0.9} /><Lbl x={620} text="ёлка" />
    <Bush x={860} w={190} seed={3} /><Lbl x={860} text="куст" />
    <Fence x1={40} x2={520} kind="pickets" y={G - 360} /><Lbl x={280} text="" />
    <Fence x1={560} x2={1040} kind="sticks" y={G - 360} seed={9} />
    <Tufts n={26} seed={3} y={G} />
    <Man x={930} s={0.6} mouth="smile" />
  </Sheet>
);
const Page3: React.FC = () => (
  <Sheet>
    <Head lines={['УЛИЦА И КОМНАТА']} t={20} y={200} />
    <path d={`M0 ${G} H${W} M0 ${G + 12} H${W}`} />
    <Lamp x={100} s={0.9} /><Bench x={330} s={0.9} /><Bin x={500} s={1.2} /><Hydrant x={600} s={1.2} />
    <Sign x={720} kind="round" /><Sign x={820} kind="tri" /><Sign x={920} kind="stop" />
    <Plant x={1010} s={0.8} />
    <Car x={300} y={G - 520} s={0.9} />
    <Sun x={760} y={520} r={52} t={10} /><Cloud2 x={80} y={640} /><Birds x={420} y={560} t={8} />
    <Frame x={40} y={820} /><PowerLines y={380} />
  </Sheet>
);
const Back: React.FC<{ kind: 'street' | 'yard' | 'office'; v: number; title: string }> = ({ kind, v, title }) => (
  <Sheet>
    <Head lines={[title]} t={20} y={200} />
    <path d={`M0 ${G} H${W} M0 ${G + 12} H${W}`} />
    <Backdrop kind={kind} v={v} t={10} />
    <Man x={400} s={1.5} mouth="smile" /><Man x={720} s={1.5} mouth="open" brow="raised" flip />
  </Sheet>
);

const PAGES: React.FC[] = [
  Page1, Page2, Page3,
  () => <Back kind="street" v={0} title="ДВОР" />,
  () => <Back kind="yard" v={0} title="ПРИГОРОД" />,
  () => <Back kind="office" v={0} title="ОФИС" />,
  () => <Back kind="street" v={1} title="ДВОР 2" />,
  () => <Back kind="yard" v={1} title="ПРИГОРОД 2" />,
];

const Main: React.FC = () => {
  const f = Math.min(useCurrentFrame(), PAGES.length - 1);
  const P = PAGES[f];
  return <AbsoluteFill style={{ backgroundColor: '#fff' }}><P /></AbsoluteFill>;
};

export const envBw = { id: 'EnvBw', total: PAGES.length, shotCount: PAGES.length, width: W, height: H, Main, Board: Main };
