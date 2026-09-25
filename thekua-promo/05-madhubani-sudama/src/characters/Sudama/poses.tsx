import React from 'react';
import { Figure, FigureSpec, Potli, Leg } from '../parts';

// Sudama: thin, poor Brahmin friend of Krishna. Shaven head with shikha, Vaishnava tilak, sparse beard,
// patched ochre dhoti, off-white uttariya across the chest. Every export is a separate drawing.

const walkLegs: [Leg, Leg, number][] = [
  // [near leg, far leg, body bob]   contact -> passing -> contact (legs swapped) -> passing
  [{ knee: [44, -176], ankle: [78, -18] }, { knee: [-40, -176], ankle: [-80, -34], foot: -22 }, 0],
  [{ knee: [10, -178], ankle: [2, -16] }, { knee: [32, -196], ankle: [-4, -74], foot: 12 }, -7],
  [{ knee: [-40, -176], ankle: [-80, -34], foot: -22 }, { knee: [44, -176], ankle: [78, -18] }, 0],
  [{ knee: [32, -196], ankle: [-4, -74], foot: 12 }, { knee: [10, -178], ankle: [2, -16] }, -7],
];
const swingFar: [number, number][] = [[46, -432], [-6, -420], [-58, -440], [-6, -420]];
const swingNear: [number, number][] = [[-56, -440], [-4, -420], [46, -432], [-4, -420]];

export const walk = (i: number, potli = true): FigureSpec => {
  const [n, f, bob] = walkLegs[i % 4];
  return {
    kind: 'sudama', dy: bob, lean: 3,
    head: { eye: 'open', mouth: 'neutral' },
    legNear: n, legFar: f,
    armFar: [[-18, -590, 0], [(swingFar[i % 4][0] - 18) / 2, -510, 0], [swingFar[i % 4][0], swingFar[i % 4][1], 0]], handFar: 'open',
    armNear: potli
      ? [[10, -586, 0], [52, -512, 0], [78, -566, 0]]
      : [[10, -586, 0], [(swingNear[i % 4][0] + 10) / 2, -508, 0], [swingNear[i % 4][0], swingNear[i % 4][1], 0]],
    handNear: potli ? 'hold' : 'open',
    holdNear: potli ? <Potli x={98} y={-526} s={0.95} /> : undefined,
  };
};

export const sit: FigureSpec = {
  kind: 'sudama', sit: true,
  head: { eye: 'open', mouth: 'neutral', tilt: 4 },
  armFar: [[-18, -590, 0], [10, -508, 0], [70, -466, 0]], handFar: 'hold',
  armNear: [[10, -586, 0], [46, -506, 0], [96, -462, 0]], handNear: 'hold',
};

export const hide: FigureSpec = {
  kind: 'sudama', lean: 6,
  head: { eye: 'down', mouth: 'neutral', tilt: 12, dx: 2, dy: 6 },
  legNear: { knee: [12, -176], ankle: [16, -16] }, legFar: { knee: [-12, -176], ankle: [-18, -16] },
  behind: <Potli x={-92} y={-398} s={0.95} />,
  armFar: [[-18, -590, 0], [-60, -500, 0], [-70, -430, 0]], handFar: 'hold',
  armNear: [[10, -586, 0], [22, -500, 0], [30, -420, 0]], handNear: 'open',
};

export const embrace: FigureSpec = {
  kind: 'sudama', lean: -3,
  head: { eye: 'closed', mouth: 'smile', tilt: -4, tear: true },
  legNear: { knee: [22, -176], ankle: [40, -16] }, legFar: { knee: [-18, -176], ankle: [-30, -16] },
  armFar: [[-18, -590, 0], [58, -624, 0], [112, -676, 0]], handFar: 'open',
  armNear: [[10, -586, 0], [80, -600, 0], [128, -648, 0]], handNear: 'open',
};

export const SUDAMA_POSES: { id: string; hi: string; en: string; spec: FigureSpec }[] = [
  { id: 'sit', hi: 'कुटिया में', en: 'sitting in the hut', spec: sit },
  { id: 'walk1', hi: 'चाल १', en: 'walk: contact', spec: walk(0) },
  { id: 'walk2', hi: 'चाल २', en: 'walk: passing', spec: walk(1) },
  { id: 'walk3', hi: 'चाल ३', en: 'walk: contact', spec: walk(2) },
  { id: 'walk4', hi: 'चाल ४', en: 'walk: passing', spec: walk(3) },
  { id: 'hide', hi: 'पोटली छुपाना', en: 'hiding the potli', spec: hide },
  { id: 'embrace', hi: 'आलिंगन', en: 'the embrace', spec: embrace },
  { id: 'return', hi: 'लौटना', en: 'walking home (no potli)', spec: walk(0, false) },
];

export const SudamaPose: React.FC<{ spec: FigureSpec }> = ({ spec }) => <Figure spec={spec} />;

// added for the film: waiting at the gate with the potli, and a grateful namaste
export const wait: FigureSpec = {
  kind: 'sudama', lean: 2,
  head: { eye: 'open', mouth: 'neutral', tilt: 3 },
  legNear: { knee: [12, -176], ankle: [16, -16] }, legFar: { knee: [-12, -176], ankle: [-18, -16] },
  armFar: [[-18, -590, 0], [-4, -500, 0], [8, -430, 0]], handFar: 'open',
  armNear: [[10, -586, 0], [52, -512, 0], [78, -566, 0]], handNear: 'hold',
  holdNear: <Potli x={98} y={-526} s={0.95} />,
};
export const namaste: FigureSpec = {
  kind: 'sudama',
  head: { eye: 'closed', mouth: 'smile', tilt: 4, tear: true },
  legNear: { knee: [12, -176], ankle: [16, -16] }, legFar: { knee: [-12, -176], ankle: [-18, -16] },
  armFar: [[-18, -590, 0], [36, -516, 0], [60, -586, 0]], handFar: 'up',
  armNear: [[10, -586, 0], [58, -512, 0], [70, -584, 0]], handNear: 'up',
};
