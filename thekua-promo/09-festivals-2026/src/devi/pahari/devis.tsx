import React from 'react';
import { P } from '../../styles/pahari/palette';
import { S } from '../../styles/pahari/paint';
import { MaleHead } from '../../styles/pahari/body';
import { Nandi } from '../../styles/pahari/animals';
import { Lion, Tiger, Donkey, LotusSeat } from '../../styles/pahari/vahanas';
import { DeviFigure, DeviSpec, Life } from './DeviFigure';
import { Shailaputri } from './Shailaputri';
import type { Item } from '../../styles/pahari/attributes';

// The nine Pahari Devi portraits for Formats B and C. Each entry exports the attributes it draws, and
// tests/iconography.test (scripts/check_iconography.mjs) asserts them against data/navratri-days.json (brief §6.2, §9.2).
export type DeviEntry = { day: number; arms: number; vahana: string; holds: string[]; features: string[]; draw: React.FC<{ hex: string; life: Life }> };

// six-faced baby Skanda (three faces visible) on the Devi's lap
const BabySkanda: React.FC = () => (
  <g transform="translate(66 170) scale(1.5)" data-id="baby-skanda">
    <S d="M-26 30 C-30 60 -10 80 20 80 C44 80 52 60 46 34 C40 20 -20 16 -26 30Z" fill={P.skin} stroke={P.skinLine} sw={1.2} />
    <S d="M-24 54 C0 62 30 62 48 52 L48 80 C20 88 -10 88 -24 80Z" fill={P.saffron} sw={1.1} />
    {[-22, 0, 22].map((x, i) => <g key={i} transform={`translate(${x} ${-4 - (i === 1 ? 6 : 0)}) scale(${i === 1 ? .34 : .3}) ${i === 0 ? 'scale(-1 1)' : ''}`}><MaleHead kind="youth" crownCol={P.gold} tilak={P.red} /></g>)}
  </g>
);

const VAHANA_SADDLE: Record<string, React.FC<{ life: Life }>> = {
  nandi: ({ life }) => <g transform="translate(56 300)"><Nandi tail={Math.sin(life.t * 1.3)} blink={life.blink} jhool={P.red} /></g>,
  whiteBull: ({ life }) => <g transform="translate(56 300)"><Nandi tail={Math.sin(life.t * 1.3)} blink={life.blink} jhool="#6B3FA0" band="#6B3FA0" /></g>,
  tiger: ({ life }) => <g transform="translate(40 300)"><Tiger tail={Math.sin(life.t * 1.2)} blink={life.blink} /></g>,
  lion: ({ life }) => <g transform="translate(40 300)"><Lion tail={Math.sin(life.t * 1.2)} blink={life.blink} /></g>,
  donkey: ({ life }) => <g transform="translate(70 300)"><Donkey tail={Math.sin(life.t)} blink={life.blink} ear={Math.sin(life.t * .8)} /></g>,
};

const make = (base: Omit<DeviSpec, 'garment' | 'veil'> & { veil?: string }, vahana: string | null, extra?: (life: Life) => React.ReactNode, garmentFor?: (hex: string) => string, over?: (life: Life) => React.ReactNode): React.FC<{ hex: string; life: Life }> => ({ hex, life }) => {
  const V = vahana ? VAHANA_SADDLE[vahana] : null;
  return (
    <g>
      {extra?.(life)}
      {V && <V life={life} />}
      <DeviFigure life={life} spec={{ ...base, garment: garmentFor ? garmentFor(hex) : hex, veil: base.veil ?? P.pink }} />
      {over?.(life)}
    </g>
  );
};

const items = (near: Item[], far: Item[]) => ({ near, far });

export const DEVIS: DeviEntry[] = [
  { day: 1, arms: 2, vahana: 'bull (Nandi)', holds: ['trishul (right)', 'lotus (left)'], features: ['crescent moon on forehead'],
    draw: ({ hex, life }) => <Shailaputri garment={hex} life={life} /> },
  { day: 2, arms: 2, vahana: 'walks barefoot', holds: ['japa mala', 'kamandalu'], features: ['white attire', 'serene'],
    draw: make({ posture: 'walking', white: true, veil: '#F4EFE3', crown: false, ...items(['mala'], ['kamandalu']) }, null) },
  { day: 3, arms: 10, vahana: 'tiger', holds: ['trishul', 'gada', 'sword', 'kamandalu', 'lotus', 'arrow', 'bow', 'japa mala', 'abhaya mudra', 'varada mudra'], features: ['bell-shaped half-moon on forehead', 'golden'],
    draw: make({ posture: 'saddle', bell: true, skin: '#EDBE6E', ...items(['abhaya', 'gada', 'sword', 'trishul', 'arrow'], ['varada', 'kamandalu', 'mala', 'bow', 'lotus']) }, 'tiger') },
  { day: 4, arms: 8, vahana: 'lion', holds: ['kamandalu', 'bow', 'arrow', 'lotus', 'amrit kalash', 'chakra', 'gada', 'japa mala'], features: ['radiant like the sun'],
    draw: make({ posture: 'saddle', ...items(['kalash', 'chakra', 'gada', 'mala'], ['kamandalu', 'bow', 'arrow', 'lotus']) }, 'lion',
      (life) => <g opacity={.9}>{Array.from({ length: 24 }, (_, i) => { const a = i / 24 * Math.PI * 2 + life.t * .1; return <path key={i} d={`M${2 + Math.cos(a) * 90} ${-10 + Math.sin(a) * 90} L${2 + Math.cos(a) * 150} ${-10 + Math.sin(a) * 150}`} stroke="#F2C94C" strokeWidth={6} strokeLinecap="round" />; })}</g>) },
  { day: 5, arms: 4, vahana: 'lion; seated on lotus', holds: ['lotus', 'lotus', 'abhaya mudra', 'baby Skanda'], features: ['six-faced baby Skanda on her lap'],
    draw: ({ hex, life }) => <g>
      <g transform="translate(-60 250) scale(.8)"><Lion tail={Math.sin(life.t)} blink={life.blink} /></g>
      <g transform="translate(20 330)"><LotusSeat w={320} /></g>
      <DeviFigure life={life} spec={{ posture: 'padmasana', garment: hex, veil: P.pink, near: ['abhaya', 'lotus'], far: ['lotus', 'none'], lap: <BabySkanda /> }} />
    </g> },
  { day: 6, arms: 4, vahana: 'lion', holds: ['sword', 'lotus', 'abhaya mudra', 'varada mudra'], features: ['warrior radiance'],
    draw: make({ posture: 'saddle', ...items(['abhaya', 'sword'], ['varada', 'lotus']) }, 'lion') },
  { day: 7, arms: 4, vahana: 'donkey', holds: ['sickle-sword', 'vajra', 'abhaya mudra', 'varada mudra'], features: ['dark complexion', 'loose hair', 'three eyes', 'lightning-bright necklace'],
    draw: make({ posture: 'saddle', skin: '#4A3B45', looseHair: true, thirdEye: true, veil: '#5A5E66', ...items(['abhaya', 'sickle'], ['varada', 'vajra']) }, 'donkey', undefined, undefined,
      () => <g>{Array.from({ length: 12 }, (_, i) => { const u = i / 11; return <g key={i}><circle cx={-8 + u * 46} cy={100 + Math.sin(u * Math.PI) * 48} r={9} fill="#CFE4FF" opacity={.6} filter="url(#softBlur)" /><circle cx={-8 + u * 46} cy={100 + Math.sin(u * Math.PI) * 48} r={3.4} fill="#F4FAFF" /></g>; })}</g>) },
  { day: 8, arms: 4, vahana: 'white bull', holds: ['trishul', 'damaru', 'abhaya mudra', 'varada mudra'], features: ['white garments', 'moonlike radiance'],
    draw: make({ posture: 'saddle', white: true, veil: '#E7E0F2', ...items(['abhaya', 'trishul'], ['varada', 'damaru']) }, 'whiteBull', undefined, () => '#F1EDE4') },
  { day: 9, arms: 4, vahana: 'lotus seat', holds: ['chakra', 'gada', 'shankh', 'lotus'], features: ['surrounded by devotees and sages'],
    draw: ({ hex, life }) => <g>
      <g transform="translate(20 330)"><LotusSeat w={320} /></g>
      <DeviFigure life={life} spec={{ posture: 'padmasana', garment: hex, veil: P.pink, near: ['chakra', 'gada'], far: ['shankh', 'lotus'] }} />
    </g> },
];
export const deviFor = (day: number) => DEVIS[day - 1];
