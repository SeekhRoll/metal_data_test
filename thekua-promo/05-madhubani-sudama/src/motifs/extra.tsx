import React from 'react';
import { C } from '../styles/palette';
import { Bharni, Line, lens, circle, tube, smooth } from '../styles/paint';

type XY = { x?: number; y?: number; s?: number; r?: number; flip?: boolean };
const T: React.FC<XY & { children: React.ReactNode }> = ({ x = 0, y = 0, s = 1, r = 0, flip, children }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${flip ? -s : s} ${s})`}>{children}</g>
);

// Tree of life: trunk, curling branches, leaf lenses, fruit; origin at the foot of the trunk
export const Tree: React.FC<XY & { sway?: number; fruit?: string }> = ({ sway = 0, fruit = C.vermilion, ...p }) => {
  const br: [number, number, number][] = [[-1, -300, 150], [1, -360, 160], [-1, -440, 130], [1, -500, 120], [-1, -560, 90], [1, -600, 80]];
  return (
    <T {...p}>
      <Bharni d={tube([[0, 0, 60], [6, -200, 44], [-4, -420, 30], [2, -640, 16]])} fill={C.ochre} band={3.5} pattern="pleats" />
      {br.map(([sd, y, len], i) => {
        const pts: [number, number][] = [[0, y], [sd * len * .5, y - 40], [sd * len, y - 30 + Math.sin(sway + i) * 6]];
        return (
          <g key={i}>
            <path d={smooth(pts)} fill="none" stroke={C.black} strokeWidth={12} strokeLinecap="round" />
            <path d={smooth(pts)} fill="none" stroke={C.ochre} strokeWidth={6} strokeLinecap="round" />
            {[0.35, 0.65, 1].map((k, j) => {
              const lx = sd * len * k, ly = y - 30 - 40 * Math.sin(k * Math.PI) + Math.sin(sway + i + j) * 4;
              return <Bharni key={j} d={lens(lx, ly, lx + sd * 30, ly - 50, 14)} fill={j % 2 ? C.leaf : C.turmeric} band={2.5} hatch={false} />;
            })}
            <Line d={circle(sd * len * .8, y - 4, 11)} fill={fruit} w={2.4} />
          </g>
        );
      })}
      {[[-40, -660], [40, -660], [0, -700]].map(([x, y], i) => <Bharni key={i} d={lens(x, y, x + (i - 1) * 30, y - 60, 16)} fill={C.leaf} band={2.5} hatch={false} />)}
    </T>
  );
};

export const Bird: React.FC<XY & { flap?: number; body?: string }> = ({ flap = 0, body = C.leaf, ...p }) => (
  <T {...p}>
    <Bharni d={flap ? 'M-6 -4 L-40 -46 L10 -14 Z' : 'M-6 -4 L-46 10 L8 6 Z'} fill={C.turmeric} band={2} hatch={false} />
    <Bharni d="M-40 6 C-30 -18 20 -24 34 -8 C40 0 30 14 10 16 C-10 18 -30 16 -40 6 Z" fill={body} band={2.5} pattern="dotsBlack" hatch={false} />
    <Line d="M34 -8 L50 -4 L36 2 Z" fill={C.vermilion} w={2} />
    <circle cx={26} cy={-6} r={3} fill={C.black} />
    <path d="M-40 6 L-66 0 M-40 6 L-66 14" stroke={C.black} strokeWidth={3} />
  </T>
);

export const Cloud: React.FC<XY> = (p) => (
  <T {...p}>
    <Bharni d="M-110 20 C-130 -10 -100 -40 -70 -26 C-60 -60 -10 -64 6 -34 C24 -60 76 -54 80 -20 C112 -24 124 14 96 26 Z" fill={C.paper} band={3} />
    <path d="M-80 4 C-60 -6 -40 -6 -24 4 M10 -4 C30 -14 50 -12 64 0" fill="none" stroke={C.indigo} strokeWidth={3} />
  </T>
);

export const Diya: React.FC<XY & { t?: number }> = ({ t = 0, ...p }) => (
  <T {...p}>
    <g transform={`translate(0 -34) scale(${1 + .08 * Math.sin(t * 17)} ${1 + .12 * Math.sin(t * 23)})`}>
      <Line d="M0 0 C-14 -20 -6 -40 0 -54 C6 -40 14 -20 0 0 Z" fill={C.turmeric} w={2.4} />
      <path d="M0 -6 C-5 -16 -2 -26 0 -32 C2 -26 5 -16 0 -6 Z" fill={C.vermilion} />
    </g>
    <Bharni d="M-50 -30 L50 -30 C44 -6 22 6 0 6 C-22 6 -44 -6 -50 -30 Z" fill={C.ochre} band={2.5} />
  </T>
);

export const Matka: React.FC<XY & { col?: string }> = ({ col = C.ochre, ...p }) => (
  <T {...p}>
    <Bharni d="M-40 -150 L40 -150 L34 -126 C80 -110 96 -50 70 -20 C50 4 -50 4 -70 -20 C-96 -50 -80 -110 -34 -126 Z" fill={col} band={3.5} />
    <path d="M-80 -70 C-40 -56 40 -56 80 -70" fill="none" stroke={C.black} strokeWidth={8} strokeDasharray="2 7" />
    <path d="M-70 -40 L70 -40" stroke={C.vermilion} strokeWidth={8} />
  </T>
);

export const Pillar: React.FC<XY & { h?: number }> = ({ h = 900, ...p }) => (
  <T {...p}>
    <Bharni d={`M-44 0 L44 0 L44 ${-h} L-44 ${-h} Z`} fill={C.turmeric} pattern="dotsBlack" band={4} />
    {Array.from({ length: Math.floor(h / 150) }, (_, i) => <Bharni key={i} d={`M-50 ${-60 - i * 150} L50 ${-60 - i * 150} L50 ${-90 - i * 150} L-50 ${-90 - i * 150} Z`} fill={C.vermilion} band={2.5} hatch={false} />)}
    <Bharni d={`M-70 ${-h} L70 ${-h} L56 ${-h - 50} L-56 ${-h - 50} Z`} fill={C.vermilion} band={3} />
    <Bharni d="M-66 0 L66 0 L56 -40 L-56 -40 Z" fill={C.vermilion} band={3} />
  </T>
);

export const Toran: React.FC<XY & { w?: number; sway?: number }> = ({ w = 800, sway = 0, ...p }) => (
  <T {...p}>
    <path d={`M0 0 Q${w / 2} 40 ${w} 0`} fill="none" stroke={C.black} strokeWidth={5} />
    {Array.from({ length: Math.floor(w / 46) }, (_, i) => {
      const x = 23 + i * 46, y = 40 * 4 * (x / w) * (1 - x / w) * .5 + 6, a = Math.sin(sway + i) * 6;
      return <g key={i} transform={`rotate(${a} ${x} ${y})`}><Bharni d={lens(x, y, x, y + 70, 16)} fill={i % 3 === 1 ? C.turmeric : C.leaf} band={2.5} hatch={false} /><path d={`M${x} ${y} L${x} ${y + 60}`} stroke={C.black} strokeWidth={2} /></g>;
    })}
  </T>
);

export const Flower: React.FC<XY & { col?: string }> = ({ col = C.vermilion, ...p }) => (
  <T {...p}>
    {[0, 1, 2, 3, 4].map(i => { const a = i / 5 * Math.PI * 2 - Math.PI / 2; return <Bharni key={i} d={lens(0, 0, Math.cos(a) * 40, Math.sin(a) * 40, 12)} fill={col} band={2} hatch={false} />; })}
    <Line d={circle(0, 0, 9)} fill={C.turmeric} w={2} />
  </T>
);

export const Flag: React.FC<XY & { wave?: number }> = ({ wave = 0, ...p }) => (
  <T {...p}>
    <path d="M0 0 L0 -140" stroke={C.black} strokeWidth={6} />
    <Bharni d={`M0 -140 C30 ${-150 + wave * 8} 50 ${-128 - wave * 8} 80 ${-134 + wave * 6} L60 -112 L80 ${-92 + wave * 4} C50 ${-88 - wave * 8} 30 ${-106 + wave * 8} 0 -100 Z`} fill={C.vermilion} band={2.5} hatch={false} />
  </T>
);

// Madhubani thekua: golden oval, ridges fanning from the base, dotted rim, double outline
export const ThekuaM: React.FC<XY> = (p) => (
  <T {...p}>
    <Bharni d="M-110 0 C-116 -60 -60 -92 0 -92 C60 -92 116 -60 110 0 C104 50 60 70 0 70 C-60 70 -104 50 -110 0 Z" fill={C.turmeric} band={4} />
    {Array.from({ length: 9 }, (_, i) => { const a = -1.1 + i * 2.2 / 8; return <path key={i} d={`M0 58 Q${Math.sin(a) * 50} ${10 - Math.cos(a) * 40} ${Math.sin(a) * 96} ${-Math.cos(a) * 74}`} fill="none" stroke={C.ochre} strokeWidth={6} />; })}
    {Array.from({ length: 9 }, (_, i) => { const a = -1.1 + i * 2.2 / 8; return <path key={'b' + i} d={`M0 58 Q${Math.sin(a) * 50} ${10 - Math.cos(a) * 40} ${Math.sin(a) * 96} ${-Math.cos(a) * 74}`} fill="none" stroke={C.black} strokeWidth={1.8} />; })}
    {Array.from({ length: 22 }, (_, i) => { const a = i / 22 * Math.PI * 2; return <circle key={'d' + i} cx={Math.cos(a) * 92} cy={Math.sin(a) * 70 - 10} r={3.4} fill={C.black} />; })}
  </T>
);

// palace pieces
export const Dome: React.FC<XY & { col?: string }> = ({ col = C.turmeric, ...p }) => (
  <T {...p}>
    <Bharni d="M-90 0 C-96 -70 -40 -120 0 -150 C40 -120 96 -70 90 0 Z" fill={col} pattern="dotsBlack" band={4} />
    <path d="M0 -150 L0 -200" stroke={C.black} strokeWidth={6} />
    <Line d={circle(0, -206, 10)} fill={C.vermilion} w={2.4} />
    <Bharni d="M-100 0 L100 0 L100 26 L-100 26 Z" fill={C.vermilion} band={2.5} hatch={false} />
  </T>
);

// hut and palace silhouettes (same starting point so flubber morphs cleanly)
export const HUT_D = 'M-220 0 L-220 -250 L-260 -250 L-120 -430 L0 -470 L120 -430 L260 -250 L220 -250 L220 0 Z';
export const PALACE_D = 'M-300 0 L-300 -380 L-260 -470 L-200 -380 L-150 -380 L-150 -520 L-80 -620 L0 -700 L80 -620 L150 -520 L150 -380 L200 -380 L260 -470 L300 -380 L300 0 Z';
