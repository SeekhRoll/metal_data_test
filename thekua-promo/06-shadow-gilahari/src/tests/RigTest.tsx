import React from 'react';
import { useCurrentFrame } from 'remotion';
import { StageSvg, BaseText } from '../stage/Stage';
import { Puppet, Pose } from '../stage/rig';
import { RAM, HANUMAN } from '../puppets/humanoid';
import { kf, pendulum, walk, jitter, easeInOut } from '../stage/motion';

// Brief §3.5 step 3: one puppet walking, one swinging; everything that dangles settles with damped swing.
const RODS = [{ part: 'frontHand', at: [8, 40] as [number, number] }, { part: 'backHand', at: [8, 40] as [number, number] }, { part: 'torso', at: [0, -200] as [number, number] }];

// Ram walks in from the left and stops, then raises his hand in blessing
const ramX = (t: number) => kf(t, [[.3, -120], [3.7, 250]], (x) => easeInOut(x) * .85 + x * .15);
const ramFA = (t: number) => kf(t, [[4.3, -8], [5.0, -62], [7.4, -62], [8.0, -8]]);

// Hanuman (right, facing left) winds up and swings the mace overhead, then plants it
const hnFA = (t: number) => kf(t, [[3.2, -40], [3.7, 18], [4.25, -175], [4.8, -28], [9, -28]]);
const hnLean = (t: number) => kf(t, [[3.2, 0], [3.7, -5], [4.25, 7], [4.7, -2], [5.2, 0]]);

export const RigTest: React.FC = () => {
  const t = useCurrentFrame() / 24;
  const x = ramX(t), w = walk(x + 120);
  const moving = kf(t, [[.3, 0], [.6, 1], [3.4, 1], [3.7, 0]]);   // legs and bob fade in/out with the walk
  const ram: Pose = {
    torso: w.lean * moving + jitter(t, 1, .6),
    frontLeg: w.frontLeg * moving + pendulum('r-fl', t, ramX, { f: 1.8, z: .22, gain: .012 }),
    backLeg: w.backLeg * moving + pendulum('r-bl', t, ramX, { f: 1.7, z: .22, gain: .012 }),
    backArm: 10 + pendulum('r-ba', t, ramX, { f: 1.1, z: .14, gain: .02 }),
    backFore: -24 + pendulum('r-bf', t, ramX, { f: 1.5, z: .15, gain: .012 }),
    frontArm: ramFA(t) + pendulum('r-fa', t, ramX, { f: 1.1, z: .14, gain: .015 }),
    frontFore: kf(t, [[4.3, -6], [5.0, -58], [7.4, -58], [8.0, -6]]) + pendulum('r-ff', t, ramFA, { f: 1.6, z: .14, gain: .7 }),
    frontHand: kf(t, [[4.3, 0], [5.0, -20], [7.4, -20], [8.0, 0]]) + pendulum('r-fh', t, ramFA, { f: 2.2, z: .15, gain: .5 }),
    earring: pendulum('r-er', t, ramX, { f: 1.9, z: .1, gain: .05 }) + pendulum('r-er2', t, (s) => walk(ramX(s) + 120).bob, { f: 1.9, z: .1, gain: .3 }),
    quiver: -14 + pendulum('r-qv', t, ramX, { f: .9, z: .12, gain: .012 }),
    head: jitter(t, 4, .8),
  };
  const hn: Pose = {
    torso: hnLean(t) + jitter(t, 7, .5),
    frontArm: hnFA(t) + jitter(t, 9, .8),
    frontFore: -40 + pendulum('h-ff', t, hnFA, { f: 1.4, z: .16, gain: .55 }),
    frontHand: -10 + pendulum('h-fh', t, hnFA, { f: 2.1, z: .18, gain: .35 }),
    backArm: 14 + pendulum('h-ba', t, hnLean, { f: 1.2, z: .14, gain: 1.4 }),
    backFore: -20 + pendulum('h-bf', t, hnLean, { f: 1.6, z: .14, gain: 1.2 }),
    tail: 6 + pendulum('h-tl', t, hnFA, { f: .8, z: .1, gain: .12 }),
    earring: pendulum('h-er', t, hnFA, { f: 1.9, z: .1, gain: .25 }),
    head: -hnLean(t) * .6 + jitter(t, 11, .7),
  };
  return (
    <StageSvg t={t}
      screen={<>
        <Puppet root={HANUMAN} pose={hn} x={870} y={1010 + jitter(t, 3, 2)} s={.6} flip k="hn" rods={RODS} />
        <Puppet root={RAM} pose={ram} x={x} y={1020 + w.bob * moving + jitter(t, 2, 1.5)} s={.66} k="ram" rods={RODS} />
      </>}
      base={<BaseText lines={['रिग परीक्षण', 'चाल · गदा का झूला · ठहराव']} size={48} />} />
  );
};
