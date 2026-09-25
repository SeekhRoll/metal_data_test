import React from 'react';
import { C } from '../../styles/palette';
import { Bharni } from '../../styles/paint';
import { FigureSpec, Flute, Potli } from '../parts';

// Krishna (brief 3.2: always blue, peacock feather, flute, yellow pitambar): crown with feather,
// long curls, fish kundal, vaijayanti garland, armlets, anklets, green waist sash.

const sashFlow = (k: number) => (
  <Bharni d={`M-44 -460 C-90 ${-472 - k * 10} -140 ${-440 + k * 12} -186 ${-476 + k * 8} L-180 ${-450 + k * 8} C-140 ${-418 + k * 12} -92 ${-446 - k * 6} -46 -440 Z`} fill={C.leaf} band={2.5} />
);
const fluteTucked = <Flute x0={-40} y0={-500} x1={70} y1={-420} />;

export const flute: FigureSpec = {
  kind: 'krishna',
  head: { eye: 'closed', mouth: 'neutral', tilt: -6 },
  legNear: { knee: [6, -176], ankle: [8, -16] }, legFar: { knee: [34, -170], ankle: [60, -30], foot: 36 },
  armFar: [[-18, -590, 0], [52, -626, 0], [104, -666, 0]], handFar: 'hold',
  armNear: [[10, -586, 0], [96, -606, 0], [156, -656, 0]], handNear: 'hold',
  extra: <Flute x0={62} y0={-684} x1={250} y1={-640} />,
};

export const runA: FigureSpec = {
  kind: 'krishna', lean: 10,
  head: { eye: 'open', mouth: 'open', tilt: -6 },
  legNear: { knee: [62, -192], ankle: [106, -40], foot: -8 }, legFar: { knee: [-52, -160], ankle: [-104, -84], foot: -30 },
  behind: sashFlow(0),
  armFar: [[-18, -590, 0], [66, -592, 0], [134, -618, 0]], handFar: 'open',
  armNear: [[10, -586, 0], [82, -572, 0], [152, -590, 0]], handNear: 'open',
  holdFar: fluteTucked,
};

export const runB: FigureSpec = {
  kind: 'krishna', lean: 10, dy: -10,
  head: { eye: 'open', mouth: 'open', tilt: -6 },
  legNear: { knee: [-44, -170], ankle: [-98, -76], foot: -28 }, legFar: { knee: [60, -192], ankle: [102, -40], foot: -8 },
  behind: sashFlow(1),
  armFar: [[-18, -590, 0], [62, -600, 0], [128, -632, 0]], handFar: 'open',
  armNear: [[10, -586, 0], [80, -580, 0], [150, -604, 0]], handNear: 'open',
  holdFar: fluteTucked,
};

export const embrace: FigureSpec = {
  kind: 'krishna', lean: -2,
  head: { eye: 'closed', mouth: 'smile', tilt: -4 },
  legNear: { knee: [22, -176], ankle: [40, -16] }, legFar: { knee: [-18, -176], ankle: [-30, -16] },
  armFar: [[-18, -590, 0], [60, -610, 0], [118, -652, 0]], handFar: 'open',
  armNear: [[10, -586, 0], [82, -590, 0], [132, -630, 0]], handNear: 'open',
  holdFar: fluteTucked,
};

export const pull: FigureSpec = {
  kind: 'krishna', lean: -5,
  head: { eye: 'open', mouth: 'smile', tilt: 4 },
  legNear: { knee: [30, -176], ankle: [54, -16] }, legFar: { knee: [-22, -176], ankle: [-40, -16] },
  armFar: [[-18, -590, 0], [-70, -520, 0], [-38, -462, 0]], handFar: 'hold',
  armNear: [[10, -586, 0], [74, -532, 0], [136, -512, 0]], handNear: 'hold',
  holdNear: <Potli x={160} y={-472} s={0.95} />,
  holdFar: fluteTucked,
};

export const eat: FigureSpec = {
  kind: 'krishna',
  head: { eye: 'closed', mouth: 'open', tilt: -3 },
  legNear: { knee: [12, -176], ankle: [18, -16] }, legFar: { knee: [-14, -176], ankle: [-20, -16] },
  armFar: [[-18, -590, 0], [30, -500, 0], [92, -500, 0]], handFar: 'hold',
  holdFar: <Potli x={110} y={-482} s={0.95} open />,
  armNear: [[10, -586, 0], [74, -566, 0], [62, -660, 0]], handNear: 'hold',
  extra: <g>{[[74, -668], [84, -660], [70, -656]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={5} ry={3} fill={C.paper} stroke={C.black} strokeWidth={1.3} />)}</g>,
};

export const KRISHNA_POSES: { id: string; hi: string; en: string; spec: FigureSpec }[] = [
  { id: 'flute', hi: 'बाँसुरी', en: 'with flute (idle)', spec: flute },
  { id: 'runA', hi: 'दौड़ १', en: 'running (A)', spec: runA },
  { id: 'runB', hi: 'दौड़ २', en: 'running (B)', spec: runB },
  { id: 'embrace', hi: 'आलिंगन', en: 'the embrace', spec: embrace },
  { id: 'pull', hi: 'पोटली खींचना', en: 'pulling the potli', spec: pull },
  { id: 'eat', hi: 'चिवड़ा खाना', en: 'eating the chivda', spec: eat },
];
