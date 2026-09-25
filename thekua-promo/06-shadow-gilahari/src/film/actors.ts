import { Pose } from '../stage/rig';
import { kf, pendulum, walk, jitter } from '../stage/motion';

export const REST: Pose = { frontArm: -8, frontFore: -6, backArm: 10, backFore: -24 };
export const RODS = [{ part: 'frontHand', at: [8, 40] as [number, number] }, { part: 'backHand', at: [8, 40] as [number, number] }, { part: 'torso', at: [0, -200] as [number, number] }];

// A standing or walking humanoid: the walk cycle fades in and out with `moving`, and everything that dangles
// (legs, loose arms, earring, quiver, tail) follows the body with damped pendulum swing (brief §3.4).
// `xf` is the puppet's x position over time; arm angles in `set` replace the rest pose (pendulums are added on top).
export function standWalk(key: string, t: number, xf: (t: number) => number, moving: number, set: Pose = {}, seed = 0): { pose: Pose; bob: number } {
  const w = walk(Math.abs(xf(t) - xf(0)));
  const base: Pose = { ...REST, ...set };
  const pose: Pose = {
    ...base,
    torso: (base.torso ?? 0) + w.lean * moving + jitter(t, seed + 1, .6),
    frontLeg: (base.frontLeg ?? 0) + w.frontLeg * moving + pendulum(key + 'fl', t, xf, { f: 1.8, z: .22, gain: .012 }),
    backLeg: (base.backLeg ?? 0) + w.backLeg * moving + pendulum(key + 'bl', t, xf, { f: 1.7, z: .22, gain: .012 }),
    backArm: base.backArm + pendulum(key + 'ba', t, xf, { f: 1.1, z: .14, gain: .02 }) + 4 * Math.sin(w.frontLeg / 15 * 1.2) * moving,
    backFore: base.backFore + pendulum(key + 'bf', t, xf, { f: 1.5, z: .15, gain: .012 }),
    frontArm: base.frontArm + pendulum(key + 'fa', t, xf, { f: 1.1, z: .14, gain: .015 }) - 4 * Math.sin(w.frontLeg / 15 * 1.2) * moving,
    frontFore: base.frontFore + pendulum(key + 'ff', t, xf, { f: 1.5, z: .15, gain: .012 }),
    earring: pendulum(key + 'er', t, xf, { f: 1.9, z: .1, gain: .05 }) + pendulum(key + 'er2', t, (s) => walk(Math.abs(xf(s) - xf(0))).bob, { f: 1.9, z: .1, gain: .3 }),
    quiver: -14 + pendulum(key + 'qv', t, xf, { f: .9, z: .12, gain: .012 }),
    tail: (base.tail ?? 6) + pendulum(key + 'tl', t, xf, { f: .8, z: .12, gain: .02 }) + 3 * Math.sin(t * 1.3 + seed),
    head: (base.head ?? 0) + jitter(t, seed + 4, .8),
  };
  return { pose, bob: w.bob * moving + jitter(t, seed + 2, 1.5) };
}
export const moveWindow = (t: number, t0: number, t1: number) => kf(t, [[t0, 0], [t0 + .3, 1], [t1 - .3, 1], [t1, 0]]);
