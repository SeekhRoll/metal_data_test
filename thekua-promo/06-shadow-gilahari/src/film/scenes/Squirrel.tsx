import React from 'react';
import { Puppet, baseM, worldPoint, ccd, Pose } from '../../stage/rig';
import { RAM_BARE as RAM, VANAR_LAUGH } from '../../puppets/humanoid';
import { squirrel, speck } from '../../puppets/props';
import { kf, pendulum, seg, easeInOut, easeOut, jitter, clamp01 } from '../../stage/motion';
import { L } from '../../stage/palette';
import { Sky, Bank, FrontWave, Bridge, Splash, GAP, GROUND } from '../world';
import { LANDED } from './Opening';
import { squirrelAt, SQ_S, FLICK, shakeTimes, dipTimes, sandY } from '../squirrelPath';
import { standWalk, moveWindow, RODS, REST } from '../actors';

const SQ_ROD = [{ part: 'body', at: [0, 10] as [number, number] }];

// sand falling from the squirrel's fur into the crack while it shakes
const Sand: React.FC<{ t: number; x: number; y: number }> = ({ t, x, y }) => (
  <>{shakeTimes.flatMap(([a, b], si) => Array.from({ length: Math.ceil((b - a) / .09) }, (_, i) => {
    const t0 = a + i * .09, u = (t - t0) / .55;
    if (u < 0 || u > 1) return null;
    const dx = ((i * 37) % 50) - 25;
    return <Puppet key={si + '-' + i} root={speck(3 + (i % 3), L.turmeric)} x={x + dx} y={y + 10 + 60 * u + 70 * u * u} fade={1 - u} k={`sand${si}-${i}`} />;
  }))}</>
);

const SquirrelPuppet: React.FC<{ t: number; stripes?: [number, number, number] }> = ({ t, stripes }) => {
  const q = squirrelAt(t);
  return <Puppet root={squirrel(stripes)} pose={q.pose} x={q.x} y={q.y} rot={q.rot} flip={q.flip} s={SQ_S} k="sq" rods={SQ_ROD} rivetR={5} />;
};

// ---------------------------------------------------------------- S4 · 21-29 s · the squirrel: dip, roll, shake the sand into the cracks (x3, faster)
export const S4: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Sky t={t} />
    <Bridge t={t} landed={LANDED} />
    <FrontWave t={t} />
    <Bank t={t} />
    <SquirrelPuppet t={t} />
    <Sand t={t} x={GAP[0]} y={GAP[1]} />
    {dipTimes.map((d, i) => <Splash key={i} t={t} at={d} x={470} y={1296} n={5} k={'dip' + i} />)}
  </>
);

// ---------------------------------------------------------------- S5 · 29-36 s · a vanar laughs and flicks the squirrel aside
const MK = { s: .7, flip: true };
const mkX = (t: number) => kf(t, [[29.1, 1010], [30.5, 790], [35.3, 790], [36.1, 900]]);
const mkY = (t: number) => kf(t, [[29.1, 1560], [30.5, 1452], [35.3, 1452], [36.1, 1600]]) - 402 * MK.s;
export function monkeyPose(t: number): Pose {
  const laugh = seg(t, 30.5, 30.9) * (1 - seg(t, 33.0, 33.2)) + seg(t, 33.9, 34.3) * (1 - seg(t, 35.2, 35.6));
  const shake = Math.sin(t * 2 * Math.PI * 4.5) * laugh;
  const base: Pose = {
    ...REST,
    torso: -4 * laugh + 2.5 * shake,
    head: -36 * laugh + 5 * shake,
    frontArm: 20 * laugh - 8, frontFore: -90 * laugh - 6, frontHand: -10,
    backArm: 10 + 6 * shake, backFore: -24,
    tail: 6 + 10 * Math.sin(t * 1.7),
  };
  // the flick: reach down to the squirrel with a finger, then follow through
  const reach = seg(t, 33.05, FLICK) * (1 - seg(t, FLICK + .15, FLICK + .9));
  if (reach > 0) {
    const m = baseM(mkX(t), mkY(t), MK.s, MK.flip);
    const ik = ccd(VANAR_LAUGH, base, m, ['torso', 'frontArm', 'frontFore'], { part: 'frontHand', at: [10, 88] }, [GAP[0] + 30, GAP[1] - 10],
      { w: { torso: .25 }, lim: { torso: [-30, 30] } });
    for (const j of ['torso', 'frontArm', 'frontFore']) base[j] = base[j] + (ik[j] - base[j]) * easeInOut(reach);
    base.frontArm -= 40 * Math.sin(Math.PI * seg(t, FLICK - .05, FLICK + .35));        // the flick itself
  }
  const drive = (s: number) => (s > 33 && s < 35 ? seg(s, 33.05, FLICK) * 60 : 0);
  base.frontHand = (base.frontHand ?? 0) + pendulum('mk-fh', t, drive, { f: 2.2, z: .16, gain: .5 });
  base.earring = pendulum('mk-er', t, (s) => mkY(s) + monkeyShake(s) * 20, { f: 1.9, z: .1, gain: .06 });
  return base;
}
const monkeyShake = (t: number) => Math.sin(t * 2 * Math.PI * 4.5) * seg(t, 30.5, 30.9) * (1 - seg(t, 33.0, 33.2));
export const S5: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Sky t={t} />
    <Puppet root={VANAR_LAUGH} pose={monkeyPose(t)} x={mkX(t)} y={mkY(t) + jitter(t, 21, 1.5)} s={MK.s} flip depth={kf(t, [[29.1, .4], [30.5, 0], [35.3, 0], [36.1, .5]])} fade={1 - seg(t, 35.6, 36)} k="laugh" rods={RODS} clipBelow={1236} />
    <Bridge t={t} landed={LANDED} />
    <FrontWave t={t} />
    <Bank t={t} />
    <SquirrelPuppet t={t} />
    <Sand t={t} x={GAP[0]} y={GAP[1]} />
  </>
);

// ---------------------------------------------------------------- S6 · 36-45 s · Ram lifts the squirrel and strokes its back: three stripes light up
const R6 = { s: .7 };
const ramX6 = (t: number) => kf(t, [[36.1, -170], [38.0, 250]], (x) => easeInOut(x) * .8 + x * .2);
const crouch = (t: number) => kf(t, [[37.9, 0], [38.6, 170], [39.0, 170], [39.9, 90]]);
const PICK = 38.75;
const BACK_PTS: [number, number][] = [[70, -32], [40, -40], [8, -42], [-24, -38], [-56, -26]];
export const S6: React.FC<{ t: number }> = ({ t }) => {
  const x = ramX6(t), walkP = standWalk('s6r', t, ramX6, moveWindow(t, 36.1, 38.0), {}, 3);
  const y = GROUND - 402 * R6.s + walkP.bob * (1 - seg(t, 37.9, 38.1)) + crouch(t);
  const m = baseM(x, y, R6.s);
  let pose: Pose = { ...walkP.pose, torso: walkP.pose.torso + kf(t, [[37.9, 0], [38.6, 20], [39.0, 20], [39.9, 4]]), head: walkP.pose.head + kf(t, [[37.9, 0], [38.6, 10], [40, 12]]) };
  // the far (back) hand reaches for the squirrel, then brings it up to the chest
  const sq0 = squirrelAt(Math.min(t, PICK));
  const pickTarget: [number, number] = [sq0.x + 4, sq0.y + 30];
  const chest: [number, number] = [x + 170, y - 118];
  const reach = seg(t, 37.9, 38.6), lift = easeInOut(seg(t, PICK, 39.9));
  const tgt: [number, number] = [pickTarget[0] + (chest[0] - pickTarget[0]) * lift, pickTarget[1] + (chest[1] - pickTarget[1]) * lift];
  if (reach > 0) {
    const ik = ccd(RAM, pose, m, ['backArm', 'backFore'], { part: 'backHand', at: [8, 56] }, tgt);
    pose = { ...pose, backArm: pose.backArm + (ik.backArm - pose.backArm) * easeInOut(reach), backFore: pose.backFore + (ik.backFore - pose.backFore) * easeInOut(reach), backHand: -30 * reach };
  }
  const held = t >= PICK;
  const palm = worldPoint(RAM, pose, m, 'backHand', [8, 56])!;
  const sq = held ? { x: palm[0] - 16, y: palm[1] - 30, rot: jitter(t, 31, 2), flip: false } : squirrelAt(t);
  const sqS = held ? SQ_S - (SQ_S - .95) * easeInOut(seg(t, PICK, 39.9)) : SQ_S;
  // the near hand strokes along the squirrel's back, head to tail; stripes light behind the fingers
  const stroke = seg(t, 40.1, 41.7);
  if (t > 39.8) {
    const k = easeInOut(stroke), idx = k * (BACK_PTS.length - 1), i0 = Math.min(BACK_PTS.length - 2, Math.floor(idx)), f = idx - i0;
    const lp = [BACK_PTS[i0][0] + (BACK_PTS[i0 + 1][0] - BACK_PTS[i0][0]) * f, BACK_PTS[i0][1] + (BACK_PTS[i0 + 1][1] - BACK_PTS[i0][1]) * f];
    const over = 1 - Math.sin(Math.PI * clamp01(stroke)) * 0;
    const target: [number, number] = t < 40.1
      ? [sq.x + BACK_PTS[0][0] * sqS + 40, sq.y + BACK_PTS[0][1] * sqS - 60]
      : t > 41.7 ? [sq.x + BACK_PTS[4][0] * sqS - 10, sq.y - 70] : [sq.x + lp[0] * sqS, sq.y + lp[1] * sqS - 6 * over];
    const approach = seg(t, 39.8, 40.1) * (1 - seg(t, 41.7, 42.4));
    const ik = ccd(RAM, pose, m, ['frontArm', 'frontFore', 'frontHand'], { part: 'frontHand', at: [10, 80] }, target, { lim: { frontHand: [-60, 40] } });
    const a = easeInOut(approach);
    pose = { ...pose, frontArm: pose.frontArm + (ik.frontArm - pose.frontArm) * a, frontFore: pose.frontFore + (ik.frontFore - pose.frontFore) * a, frontHand: (pose.frontHand ?? 0) + (ik.frontHand - (pose.frontHand ?? 0)) * a };
  }
  const lit = easeInOut(stroke);
  const glow = t > 41.7 ? 1 : lit;
  const stripes: [number, number, number] = [glow, glow, glow];
  const sqPose = held
    ? { tail: pendulum('s6-tail', t, (s) => (s > PICK ? 1 : 0) * 40, { f: 1.4, z: .12, gain: 1 }) + Math.pow(Math.max(0, Math.sin(t * 1.9)), 30) * -24, hindLeg: 4, foreLeg: -6 }
    : squirrelAt(t).pose;
  const sqEl = <Puppet root={squirrel(stripes)} pose={sqPose} x={sq.x} y={sq.y} rot={sq.rot} flip={sq.flip} s={sqS} k="sq" rods={held ? [] : SQ_ROD} rivetR={5} />;
  return (
    <>
      <Sky t={t} />
      <Bridge t={t} landed={LANDED} />
      {held && sqEl}
      <Puppet root={RAM} pose={pose} x={x} y={y} s={R6.s} k="ram6" rods={RODS} clipBelow={crouch(t) > 1 ? 1286 + jitter(t, 8, 1.2) : undefined} />
      <FrontWave t={t} />
    <Bank t={t} />
      {!held && sqEl}
      </>
  );
};
