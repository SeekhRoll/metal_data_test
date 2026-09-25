import React from 'react';
import { C } from '../../styles/palette';
import { FigureSpec, Potli } from '../parts';

// Sudama's wife (Susheela): vermilion saree with leaf-green border, pallu over the head,
// sindoor, bindi, nose ring, fish kundal. Every export is a separate drawing.

const strings = (hx: number, hy: number) => (
  <path d={`M104 -520 C${(104 + hx) / 2} ${hy - 30} ${hx - 10} ${hy - 6} ${hx} ${hy}`} fill="none" stroke={C.vermilion} strokeWidth={3.5} />
);

export const tieA: FigureSpec = {
  kind: 'wife', sit: true,
  head: { eye: 'down', mouth: 'smile', tilt: 10, dx: 2, dy: 4 },
  armFar: [[-18, -590, 0], [20, -506, 0], [82, -484, 0]], handFar: 'hold',
  holdFar: <Potli x={104} y={-448} s={0.95} />,
  armNear: [[10, -586, 0], [52, -514, 0], [100, -512, 0]], handNear: 'hold',
};

export const tieB: FigureSpec = {
  kind: 'wife', sit: true,
  head: { eye: 'down', mouth: 'smile', tilt: 8, dx: 2, dy: 4 },
  armFar: [[-18, -590, 0], [18, -510, 0], [70, -500, 0]], handFar: 'hold',
  holdFar: <Potli x={104} y={-448} s={0.95} />,
  armNear: [[10, -586, 0], [66, -540, 0], [128, -552, 0]], handNear: 'hold',
  extra: <g>{strings(128, -556)}{strings(72, -504)}</g>,
};

export const handOver: FigureSpec = {
  kind: 'wife',
  head: { eye: 'open', mouth: 'smile', tilt: 3 },
  legNear: { knee: [12, -176], ankle: [16, -16] },
  armFar: [[-18, -590, 0], [40, -532, 0], [96, -544, 0]], handFar: 'hold',
  armNear: [[10, -586, 0], [58, -524, 0], [112, -530, 0]], handNear: 'hold',
  holdNear: <Potli x={132} y={-500} s={0.95} />,
};

export const bless: FigureSpec = {
  kind: 'wife',
  head: { eye: 'open', mouth: 'smile', tilt: -2 },
  legNear: { knee: [12, -176], ankle: [16, -16] },
  armFar: [[-18, -590, 0], [-10, -500, 0], [8, -430, 0]], handFar: 'hold',
  armNear: [[10, -586, 0], [96, -612, 0], [150, -690, 0]], handNear: 'up',
};

export const WIFE_POSES: { id: string; hi: string; en: string; spec: FigureSpec }[] = [
  { id: 'tieA', hi: 'पोटली बाँधना १', en: 'tying the potli (A)', spec: tieA },
  { id: 'tieB', hi: 'पोटली बाँधना २', en: 'tying the potli (B)', spec: tieB },
  { id: 'handOver', hi: 'पोटली देना', en: 'handing it over', spec: handOver },
  { id: 'bless', hi: 'विदा', en: 'blessing / farewell', spec: bless },
];
