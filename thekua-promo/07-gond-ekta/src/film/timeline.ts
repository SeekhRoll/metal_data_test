import { seg, easeInOut } from '../style/motion';
import { C } from '../style/palette';

export const FPS = 24, DURATION = 60;
export const SCENES = [
  { id: 'S1', name: 'बरगद', from: 0, to: 5 },
  { id: 'S2', name: 'झुंड', from: 5, to: 13 },
  { id: 'S3', name: 'जाल', from: 13, to: 20 },
  { id: 'S4', name: 'फँसे', from: 20, to: 27 },
  { id: 'S5', name: 'एक साथ', from: 27, to: 35 },
  { id: 'S6', name: 'मित्र', from: 35, to: 44 },
  { id: 'S7', name: 'सीख', from: 44, to: 51 },
  { id: 'S8', name: 'श्री देसी ठेकुआ', from: 51, to: 60 },
] as const;
export const sceneAt = (t: number) => SCENES.find(s => t >= s.from && t < s.to) || SCENES[SCENES.length - 1];

// key story beats (seconds), shared by the choreography, the net and the score
export const BEAT = {
  scatter: 13.4, netUp: 15.6, crouch: 17.3, swoop: 18.0, land: 19.9,
  drop: 20.3, night: 20.4, hunterRise: 22.6,
  call: 27.5, sync: 28.2, lift: 29.4, exit: 33.2,
  arrive: 35.0, landed: 36.4, mouseOut: 36.7, nod: 38.2, chew0: 39.3, chewStep: .62, king: 43.1,
  perch: 44.0, family: 51.0, birdsLand: 52.2, card: 56.2,
};
export const freeTime = (i: number) => i === 0 ? BEAT.king : BEAT.chew0 + (i - 1) * BEAT.chewStep;

// open grounds (brief §3.2): warm paper, deep night for the drama of the trap
export function ground(t: number) {
  const k = seg(t, BEAT.night, BEAT.night + .7) * (1 - seg(t, BEAT.sync, BEAT.sync + 1.1));
  return { k: easeInOut(k), color: k > .5 ? C.night : C.paper };
}
export const lerpCol = (a: string, b: string, k: number) => {
  const p = (c: string) => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  const x = p(a), y = p(b);
  return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * k).toString(16).padStart(2, '0')).join('');
};
