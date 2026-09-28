import React from 'react';
import { P } from './palette';
import { S, Gold, circle, ellipse } from './paint';
import { Trishul, Lotus } from './figure';

// Held attributes, each drawn around its grip point (0,0), long axis up. Rotated by the hand that holds it.
const STEEL = '#D9D6CC';
export type Item = 'trishul' | 'lotus' | 'gada' | 'sword' | 'kamandalu' | 'arrow' | 'bow' | 'mala' | 'chakra' | 'shankh' | 'damaru' | 'kalash' | 'vajra' | 'sickle' | 'hook' | 'abhaya' | 'varada' | 'none';

export const Held: React.FC<{ item: Item; s?: number }> = ({ item, s = 1 }) => {
  const g = (n: React.ReactNode) => <g transform={`scale(${s})`} data-id={'item-' + item}>{n}</g>;
  switch (item) {
    case 'trishul': return g(<Trishul x={0} top={-190} bottom={120} />);
    case 'lotus': return g(<Lotus x={0} y={-60} s={1.1} stem={[0, 0]} />);
    case 'gada': return g(<><S d="M-3 40 V-70 H3 V40Z" fill={P.wood} sw={1} /><Gold d="M0 -140 C22 -136 26 -96 12 -76 L-12 -76 C-26 -96 -22 -136 0 -140Z" /><S d="M-18 -110 H18 M-14 -94 H14" stroke={P.goldDeep} sw={1} /><Gold d="M-2 -148 h4 v10 h-4z" /></>);
    case 'sword': return g(<><S d="M-5 -150 C-6 -100 -6 -40 -5 -14 H5 C6 -40 6 -100 0 -160 Z" fill={STEEL} sw={1.2} /><Gold d="M-16 -14 H16 V-6 H-16Z" /><S d="M-3 -6 V24 H3 V-6Z" fill={P.red} sw={1} /><Gold d="M-6 24 h12 v6 h-12z" /></>);
    case 'sickle': return g(<><S d="M-3 30 V-30 H3 V30Z" fill={P.wood} sw={1} /><S d="M-4 -30 C-6 -90 30 -140 70 -130 C40 -120 14 -90 6 -30Z" fill={STEEL} sw={1.2} /></>);
    case 'kamandalu': return g(<><S d="M-24 -20 C-30 10 -18 30 0 30 C18 30 30 10 24 -20 C14 -30 -14 -30 -24 -20Z" fill={P.gold} sw={1.2} /><S d="M24 -12 C40 -16 46 -30 50 -40" stroke={P.goldDeep} sw={4} /><S d="M-16 -24 C-14 -52 14 -52 16 -24" stroke={P.goldDeep} sw={2.4} /></>);
    case 'kalash': return g(<><S d="M-22 -14 C-30 16 -16 32 0 32 C16 32 30 16 22 -14 C14 -22 -14 -22 -22 -14Z" fill={P.gold} sw={1.2} /><S d="M-12 -18 H12 V-26 H-12Z" fill={P.gold} sw={1} />{[-10, 0, 10].map((x) => <ellipse key={x} cx={x} cy={-36} rx={5} ry={12} transform={`rotate(${x * 2} ${x} -36)`} fill={P.green} stroke={P.ink} strokeWidth={.8} />)}<circle cx={0} cy={-44} r={9} fill="#C68A3A" stroke={P.ink} strokeWidth={1} /></>);
    case 'arrow': return g(<><S d="M0 60 V-130" stroke={P.wood} sw={3} /><S d="M-7 -120 L0 -146 L7 -120Z" fill={STEEL} sw={1} /><S d="M0 50 L-9 66 M0 42 L-9 58 M0 50 L9 66 M0 42 L9 58" stroke={P.red} sw={2} /></>);
    case 'bow': return g(<><S d="M-8 -150 C40 -90 40 30 -8 90" stroke={P.wood} sw={5} /><S d="M-8 -150 V90" stroke={P.ink} sw={1} /><Gold d="M8 -40 h10 v20 h-10z" /></>);
    case 'mala': return g(<>{Array.from({ length: 20 }, (_, i) => { const a = i / 20 * Math.PI * 2; return <circle key={i} cx={Math.sin(a) * 14} cy={30 - (1 - Math.cos(a)) * 30} r={3} fill="#8A4A2A" stroke={P.ink} strokeWidth={.5} />; })}<circle cx={0} cy={-34} r={4} fill={P.gold} /></>);
    case 'chakra': return g(<><S d={circle(0, -30, 30)} fill={P.gold} sw={1.3} /><S d={circle(0, -30, 12)} fill={P.red} sw={1} />{Array.from({ length: 12 }, (_, i) => { const a = i / 12 * Math.PI * 2; return <path key={i} d={`M${Math.cos(a) * 12} ${-30 + Math.sin(a) * 12} L${Math.cos(a) * 30} ${-30 + Math.sin(a) * 30}`} stroke={P.goldDeep} strokeWidth={1.4} />; })}{Array.from({ length: 16 }, (_, i) => { const a = i / 16 * Math.PI * 2; return <path key={'f' + i} d={`M${Math.cos(a) * 30} ${-30 + Math.sin(a) * 30} L${Math.cos(a + .1) * 38} ${-30 + Math.sin(a + .1) * 38}`} stroke={P.goldDeep} strokeWidth={2} />; })}</>);
    case 'shankh': return g(<><S d="M-10 20 C-30 0 -26 -40 0 -54 C20 -40 26 -10 16 14 C8 26 -2 28 -10 20Z" fill={P.pearl} sw={1.3} /><S d="M-6 -40 C6 -30 8 -10 2 6 M-14 -16 C-4 -12 6 -12 14 -16" stroke="#C9BFA8" sw={1.2} /><S d="M-10 20 L-20 34 L-4 26Z" fill={P.pearl} sw={1} /></>);
    case 'damaru': return g(<><S d="M-18 -44 L18 -44 L2 -24 L18 -4 L-18 -4 L-2 -24Z" fill={P.red} sw={1.2} /><S d="M-18 -44 H18 M-18 -4 H18" stroke={P.gold} sw={3} /><S d="M-2 -24 C-20 -18 -26 -10 -30 0" stroke={P.ink} sw={1} /><circle cx={-30} cy={2} r={3} fill={P.ink} /><S d="M0 -4 V20" stroke={P.gold} sw={2} /></>);
    case 'vajra': return g(<><Gold d="M-5 -10 h10 v20 h-10z" /><Gold d="M0 -10 C-18 -30 -14 -60 0 -80 C14 -60 18 -30 0 -10Z" /><Gold d="M0 10 C-18 30 -14 60 0 80 C14 60 18 30 0 10Z" /></>);
    case 'hook': return g(<><S d="M-3 40 V-80 H3 V40Z" fill={P.wood} sw={1} /><S d="M0 -80 L0 -120 L10 -126 M0 -96 C-26 -96 -30 -70 -14 -62" stroke={STEEL} sw={5} /></>);
    default: return null;
  }
};
