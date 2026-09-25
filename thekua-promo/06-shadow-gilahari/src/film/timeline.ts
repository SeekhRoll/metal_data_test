import { kf, easeOut, seg } from '../stage/motion';

// Scene windows (brief §2). The film is exactly 60 s at 24 fps.
export const FPS = 24, DURATION = 60;
export const SCENES = [
  { id: 'S1', name: 'दीपक', from: 0, to: 5 },
  { id: 'S2', name: 'समुद्र', from: 5, to: 13 },
  { id: 'S3', name: 'वानर सेना', from: 13, to: 21 },
  { id: 'S4', name: 'गिलहरी', from: 21, to: 29 },
  { id: 'S5', name: 'उपहास', from: 29, to: 36 },
  { id: 'S6', name: 'श्रीराम का स्पर्श', from: 36, to: 45 },
  { id: 'S7', name: 'सीख', from: 45, to: 52 },
  { id: 'S8', name: 'श्री देसी ठेकुआ', from: 52, to: 60 },
] as const;
export const sceneAt = (t: number) => SCENES.find(s => t >= s.from && t < s.to) || SCENES[SCENES.length - 1];

// the puppeteer changes the scene while the lamp dips
export const CUTS = [5, 13, 45, 52];
const dip = (t: number) => CUTS.reduce((m, c) => m * (1 - .62 * Math.exp(-Math.pow((t - c) / .26, 2))), 1);

// lamp level: dark, struck, spreading; brighter for the end card
export function lampLevel(t: number) {
  const strike = t < .55 ? 0 : t < .7 ? .3 * seg(t, .55, .7) : .3 + .7 * easeOut(seg(t, .7, 2.6));
  const end = 1 + .16 * easeOut(seg(t, 56.2, 57.4));
  return { lit: strike * dip(t) * end, spread: kf(t, [[.55, .12], [2.8, 1]], easeOut) };
}
