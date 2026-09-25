import { Pose } from '../stage/rig';
import { kf, seg, easeInOut, easeOut, pendulum, jitter } from '../stage/motion';
import { GAP } from './world';

// The squirrel's whole performance from scene 4 to the moment Ram picks it up, as one continuous function of time.
// Quick, skittering motion with small hops and tail flicks (brief §3.4).
export const SQ_S = 1.15;
export const FLICK = 33.45;
const FEET = 40;                                          // local y of the paws
const SAND = 1282, ROCK_TOP = 1210;
export const sandY = (s = SQ_S) => SAND - FEET * s;
const rockY = (s = SQ_S) => ROCK_TOP - FEET * s;
const P = { start: [160, sandY()], water: [450, sandY() + 18], roll: [290, sandY()], gap: [GAP[0], rockY()], land: [410, sandY() - 6] } as const;

type Seg = { t0: number; t1: number; kind: 'run' | 'dip' | 'roll' | 'shake' | 'hold' | 'tumble' | 'getup'; a: readonly number[]; b: readonly number[] };
const segs: Seg[] = [];
{
  let c = 21.1, from: readonly number[] = P.start;
  for (const D of [3.1, 2.6, 2.1]) {
    const at = (f: number) => c + D * f;
    segs.push({ t0: at(0), t1: at(.22), kind: 'run', a: from, b: P.water });
    segs.push({ t0: at(.22), t1: at(.34), kind: 'dip', a: P.water, b: P.water });
    segs.push({ t0: at(.34), t1: at(.52), kind: 'run', a: P.water, b: P.roll });
    segs.push({ t0: at(.52), t1: at(.64), kind: 'roll', a: P.roll, b: P.roll });
    segs.push({ t0: at(.64), t1: at(.84), kind: 'run', a: P.roll, b: P.gap });
    segs.push({ t0: at(.84), t1: at(1), kind: 'shake', a: P.gap, b: P.gap });
    c += D; from = P.gap;
  }
  segs.push({ t0: c, t1: 30.2, kind: 'hold', a: P.gap, b: P.gap });
  segs.push({ t0: 30.2, t1: 31.3, kind: 'shake', a: P.gap, b: P.gap });
  segs.push({ t0: 31.3, t1: FLICK, kind: 'hold', a: P.gap, b: P.gap });
  segs.push({ t0: FLICK, t1: FLICK + .8, kind: 'tumble', a: P.gap, b: P.land });
  segs.push({ t0: FLICK + .8, t1: 35.2, kind: 'hold', a: P.land, b: P.land });
  segs.push({ t0: 35.2, t1: 35.9, kind: 'getup', a: P.land, b: P.land });
  segs.push({ t0: 35.9, t1: 99, kind: 'hold', a: P.land, b: P.land });
}
export const shakeTimes = segs.filter(s => s.kind === 'shake').map(s => [s.t0, s.t1] as [number, number]);
export const dipTimes = segs.filter(s => s.kind === 'dip').map(s => s.t0 + (s.t1 - s.t0) * .45);

function raw(t: number) {
  const g = segs.find(s => t < s.t1) || segs[segs.length - 1];
  const u = seg(t, g.t0, g.t1);
  let x = g.a[0], y = g.a[1], rot = 0, dirX = g.b[0] - g.a[0];
  if (g.kind === 'run') {
    const e = easeInOut(u) * .7 + u * .3;
    x = g.a[0] + (g.b[0] - g.a[0]) * e; y = g.a[1] + (g.b[1] - g.a[1]) * e;
    y -= Math.abs(Math.sin(Math.abs(x - g.a[0]) / 34 * Math.PI)) * 10;              // skitter hops
  } else if (g.kind === 'dip') {
    y += 34 * Math.sin(u * Math.PI); rot = 26 * Math.sin(u * Math.PI);
  } else if (g.kind === 'roll') {
    y -= 20 * Math.sin(u * Math.PI); rot = -360 * easeInOut(u);
  } else if (g.kind === 'shake') {
    rot = 7 * Math.sin(u * Math.PI * 14) * Math.sin(u * Math.PI);
  } else if (g.kind === 'tumble') {
    const e = easeOut(u);
    x = g.a[0] + (g.b[0] - g.a[0]) * e; y = g.a[1] + (g.b[1] - g.a[1]) * u - 230 * 4 * u * (1 - u);
    rot = -540 * e; dirX = 1;
  } else if (g.kind === 'getup') {
    rot = -540 + 180 * easeInOut(u); y -= 30 * Math.sin(u * Math.PI);
  } else if (g.kind === 'hold' && g.t0 >= FLICK + .7 && g.t0 < 35.2) {
    const b = t - g.t0; rot = -540; y -= 10 * Math.exp(-b * 6) * Math.abs(Math.sin(b * 14));
  }
  return { x, y, rot, dirX, kind: g.kind, u };
}
// facing: the direction of the current (or last) run
function facing(t: number) {
  const past = segs.filter(s => s.kind === 'run' && s.t0 <= t);
  const g = past[past.length - 1];
  return g ? g.b[0] < g.a[0] : false;
}

export function squirrelAt(t: number): { x: number; y: number; rot: number; flip: boolean; pose: Pose } {
  const r = raw(t), flip = facing(t) && r.kind !== 'tumble' && t < FLICK;
  const xf = (s: number) => raw(s).x;
  const dist = Math.abs(xf(t));
  const running = r.kind === 'run' ? 1 : 0;
  const legs = Math.sin(dist / 18 * Math.PI) * 30 * running;
  const flick = Math.pow(Math.max(0, Math.sin(t * 2.3)), 30) * -26;               // periodic tail flicks
  const pose: Pose = {
    tail: pendulum('sq-tail', t, xf, { f: 1.6, z: .12, gain: .012 * (flip ? -1 : 1) }) + flick + jitter(t, 12, 2) + (r.kind === 'hold' && t > FLICK && t < 36 ? 30 : 0),
    hindLeg: legs + jitter(t, 13, 1.5),
    foreLeg: -legs + jitter(t, 14, 1.5),
  };
  return { x: r.x, y: r.y + jitter(t, 15, 1), rot: r.rot + jitter(t, 16, 1.2), flip, pose };
}
