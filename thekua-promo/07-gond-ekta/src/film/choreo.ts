import { kf, seg, easeInOut, easeOut, jitter, clamp01 } from '../style/motion';
import { Mood } from '../style/states';
import { BEAT, freeTime } from './timeline';

// Hand-choreographed foreground flock (brief §3.3). Bird 0 is Chitragreeva; 1-6 are the pattern variants.
// Positions are screen coordinates (1080×1920). Background birds use boids (boids.ts).
export const GROUND_Y = 1440;
export const N = 7;
export const scaleOf = (i: number) => (i === 0 ? .56 : .42);
const feet = (i: number) => GROUND_Y - 92 * scaleOf(i);

// where each bird stands under the trap (back row first in draw order: 1, 3, 5)
export const TRAP: [number, number][] = [[460, 0], [320, -34], [220, 0], [520, -40], [640, 2], [700, -36], [760, 0]];
// and in front of Hiranyaka's burrow
export const BURROW: [number, number][] = [[520, 0], [300, -34], [160, 0], [420, -40], [620, 2], [240, -60], [700, -30]];
// perches on the banyan in scene 7 (tree at x 540, ground 1560, s .9)
export const PERCH: [number, number][] = [[540, 520], [250, 760], [830, 760], [360, 610], [720, 600], [180, 930], [900, 930]];
// formation in flight (scene 2 and the lift): offsets from the leader
const FORM: [number, number][] = [[0, 0], [-190, -110], [-190, 110], [-370, -210], [-370, 210], [-540, -120], [-540, 150]];

export type BirdState = { x: number; y: number; s: number; rot: number; flip: boolean; flying: boolean; wingOff: number; mood: Mood; bloomAt?: number; vis: number };

function trapSpot(i: number): [number, number] { return [TRAP[i][0], feet(i) + TRAP[i][1] * .5]; }
function burrowSpot(i: number): [number, number] { return [BURROW[i][0], feet(i) + BURROW[i][1] * .5]; }

export function birdAt(i: number, t: number): BirdState {
  let s = scaleOf(i);
  const wob = (a: number) => jitter(t, i * 3 + a, 1);
  let x = 0, y = 0, rot = 0, flying = true, mood: Mood = 'idle', vis = 1, flip = false, bloomAt: number | undefined;
  const lead = (tt: number) => ({ x: kf(tt, [[4.6, -100], [12.8, 1300]], (u) => u), y: 820 + 50 * Math.sin(tt * 1.3) });
  if (t < 13) {
    // scene 2: the flock crosses above the forest in formation
    const L = lead(t), sp = i === 0 ? 1 : .8;
    x = L.x + FORM[i][0] * sp + wob(1) * 8; y = L.y + FORM[i][1] + 14 * Math.sin(t * 2.2 + i) + wob(2) * 6;
    rot = -4 * Math.cos(t * 2.2 + i);
    vis = t < 5 ? 0 : 1;
    s *= 1.4;
  } else if (t < BEAT.land) {
    // scene 3: they return, circle high over the grain, then swoop down to it
    const a = (t - 15.2) * 1.6 + i * .9, cx = 480, cy = 470;
    const circ: [number, number] = [cx + Math.cos(a) * (300 - i * 12), cy + Math.sin(a) * 110];
    const [lx, ly] = trapSpot(i);
    const k = easeInOut(seg(t, BEAT.swoop + i * .12, BEAT.land - .1));
    const enter = seg(t, 15.2, 16.2);
    x = circ[0] * (1 - k) + lx * k; y = circ[1] * (1 - k) + ly * k - Math.sin(k * Math.PI) * 60;
    x = x * enter + (-300 - i * 80) * (1 - enter); y = y * enter + (300 + i * 30) * (1 - enter);
    flip = k < .05 && Math.sin(a) < 0 ? true : false;
    flip = Math.sin(a) > 0 && k < .3;
    rot = k > 0 && k < 1 ? 14 * Math.sin(k * Math.PI) : 0;
    vis = t < 15.2 ? 0 : 1;
    if (t > BEAT.land - .2) flying = false;
  } else if (t < BEAT.lift) {
    // scenes 3-5: on the ground, pecking; then trapped in panic; then the king's call and the sync
    const [lx, ly] = trapSpot(i);
    const panic = t > BEAT.drop && t < BEAT.sync ? 1 : 0;
    x = lx + panic * (6 * Math.sin(t * 13 + i * 2) + 4 * Math.sin(t * 29 + i)); y = ly + panic * (5 * Math.sin(t * 17 + i * 3));
    rot = t < BEAT.drop ? 10 * Math.max(0, Math.sin(t * 5 + i * 1.7)) : panic * 8 * Math.sin(t * 11 + i);
    flying = t > BEAT.drop + .1 && (panic > 0 || t > BEAT.sync);
    mood = t < BEAT.drop ? 'idle' : t < BEAT.sync ? 'panic' : 'unity';
    flip = panic > 0 && (i % 2 === 1) && Math.sin(t * 2.3 + i) > 0;
  } else if (t < BEAT.arrive) {
    // scene 5: all together they lift the net and rise; then fly off to the friend
    const [lx, ly] = trapSpot(i), k = easeInOut(seg(t, BEAT.lift, BEAT.exit)), e = easeInOut(seg(t, BEAT.exit, BEAT.arrive));
    const cx = 480, rise = 820 * k;
    x = lx + (cx - lx) * .25 * k + 900 * e + 4 * Math.sin(t * 3 + i);
    y = ly - rise - 120 * e + 10 * Math.sin(t * 5.6);             // the same bob for everyone: they fly as one
    rot = -6 * k + 8 * e;
    mood = 'unity';
  } else if (t < BEAT.perch) {
    // scene 6: they come down at Hiranyaka's burrow, wait under the net, and burst free one by one
    const [bx, by] = burrowSpot(i), k = easeOut(seg(t, BEAT.arrive, BEAT.landed));
    const from: [number, number] = [bx - 700, by - 700];
    x = from[0] + (bx - from[0]) * k; y = from[1] + (by - from[1]) * k - Math.sin(k * Math.PI) * 80;
    flying = t < BEAT.landed;
    mood = 'unity';
    const ft = freeTime(i);
    if (t >= ft) {
      const u = t - ft, up = easeOut(clamp01(u / 1.1));
      x = bx + (i % 2 ? -1 : 1) * 60 * up; y = by - 1000 * up * up - 120 * up; flying = true; mood = 'bloom'; bloomAt = ft;
      vis = 1 - seg(u, .9, 1.2);
    }
    // the king nods towards his flock
    if (i === 0) rot = kf(t, [[BEAT.nod, 0], [BEAT.nod + .2, 18], [BEAT.nod + .45, -4], [BEAT.nod + .65, 14], [BEAT.nod + .9, 0]]);
  } else if (t < BEAT.family) {
    // scene 7: they fly in and settle on the banyan; one shared pulse
    const [px, py] = PERCH[i], k = easeOut(seg(t, BEAT.perch + i * .12, BEAT.perch + 1.4 + i * .12));
    const from: [number, number] = [i % 2 ? -250 : 1330, py + 120];
    x = from[0] + (px - from[0]) * k; y = from[1] + (py - from[1]) * k - Math.sin(k * Math.PI) * 50;
    flip = i % 2 === 0 && i !== 0 ? k < .99 : false;
    flip = x > px + 2 && k < 1;
    flying = k < .98; mood = 'unity';
  } else { vis = 0; }
  return { x, y, s, rot, flip, flying, wingOff: i * 3, mood, bloomAt, vis };
}
