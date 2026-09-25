import React from 'react';
import { Puppet, baseM, worldPoint, Pose } from '../../stage/rig';
import { RAM, LAKSHMAN, HANUMAN_BARE as HANUMAN, VANAR } from '../../puppets/humanoid';
import { placard, rock } from '../../puppets/props';
import { kf, pendulum, seg, easeOut, easeInOut, jitter } from '../../stage/motion';
import { GLOW } from '../../stage/palette';
import { Sky, Bank, FrontWave, Bridge, Splash, SLOTS, BRIDGE_Y, GROUND, ROCK_S } from '../world';
import { standWalk, moveWindow, RODS, REST } from '../actors';

// ---------------------------------------------------------------- S1 · 0-5 s · the lamp is lit; the title placard rises
export const S1: React.FC<{ t: number }> = ({ t }) => {
  const py = (s: number) => kf(s, [[1.5, 1760], [3.0, 690]], easeOut);
  const depth = kf(t, [[1.5, .55], [3.0, 0], [4.4, 0], [4.95, .7]]);
  const flare = seg(t, .5, .75) * (1 - seg(t, .8, 2.2));
  return (
    <>
      {/* the wick catching: a bloom of light on the cloth */}
      {flare > 0 && <circle cx={540} cy={1170} r={120 + 500 * seg(t, .5, 2.2)} fill={GLOW} opacity={.55 * flare} style={{ mixBlendMode: 'screen', filter: 'blur(40px)' }} />}
      <Puppet root={placard('गिलहरी का योगदान', 'छाया कथा · भाग १')} x={540} y={py(t) + jitter(t, 3, 2)} s={1}
        rot={pendulum('pl-rot', t, py, { f: .9, z: .14, gain: -.004 }) + jitter(t, 6, .5)}
        depth={depth} fade={1 - seg(t, 4.6, 4.95)} k="title" rods={[{ part: 'placard', at: [-200, 150] }, { part: 'placard', at: [200, 150] }]} />
    </>
  );
};

// ---------------------------------------------------------------- S2 · 5-13 s · Ram and Lakshman at the shore
const ramX2 = (t: number) => kf(t, [[5.2, -170], [8.4, 330]], (x) => easeInOut(x) * .8 + x * .2);
const lakX2 = (t: number) => kf(t, [[5.6, -330], [8.9, 150]], (x) => easeInOut(x) * .8 + x * .2);
const point2 = (t: number) => kf(t, [[9.3, -8], [10.1, -96], [12.9, -96]]);
export const S2: React.FC<{ t: number }> = ({ t }) => {
  const ram = standWalk('s2r', t, ramX2, moveWindow(t, 5.2, 8.4), { frontArm: point2(t), frontFore: kf(t, [[9.3, -6], [10.1, -4]]) + pendulum('s2r-pf', t, point2, { f: 1.6, z: .15, gain: .6 }), frontHand: pendulum('s2r-ph', t, point2, { f: 2.2, z: .15, gain: .4 }) }, 1);
  const lak = standWalk('s2l', t, lakX2, moveWindow(t, 5.6, 8.9), { head: kf(t, [[9.6, 0], [10.4, -6]]) }, 7);
  return (
    <>
      <Sky t={t} />
      <Puppet root={LAKSHMAN} pose={lak.pose} x={lakX2(t)} y={GROUND - 402 * .66 + lak.bob} s={.66} depth={.12} k="lak" rods={RODS} />
      <Puppet root={RAM} pose={ram.pose} x={ramX2(t)} y={GROUND - 402 * .7 + ram.bob} s={.7} k="ram" rods={RODS} />
      <FrontWave t={t} />
      <Bank t={t} />
    </>
  );
};

// ---------------------------------------------------------------- S3 · 13-21 s · the vanar sena throws "राम" rocks; they float
export const THROWS = [14.2, 15.55, 16.9, 18.25, 19.6];     // release times, rock i lands in SLOTS[i]
export const FLIGHT = .75;
export const LANDED = THROWS.map(r => r + FLIGHT);
const H = { x: 380, s: .66, flip: false }, N = { x: 200, s: .6, flip: false };
const throwerOf = (i: number) => (i % 2 ? N : H);
// arms: rest -> lifted overhead (carrying) -> wound back -> thrown forward -> rest
function armsFor(t: number, releases: number[]) {
  let fa = -8, ba = 10;
  for (const r of releases) {
    const u = t - r;
    if (u < -1 || u > 1) continue;
    fa = kf(u, [[-1, -8], [-.45, -165], [-.12, -188], [0, -120], [.22, -55], [.9, -8]]);
    ba = kf(u, [[-1, 10], [-.45, -150], [-.12, -172], [0, -110], [.22, -40], [.9, 10]]);
  }
  return { fa, ba };
}
const holdPoint = (root: typeof HANUMAN, pose: Pose, m: ReturnType<typeof baseM>) => {
  const a = worldPoint(root, pose, m, 'frontHand', [6, 36])!, b = worldPoint(root, pose, m, 'backHand', [6, 36])!;
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 30] as [number, number];
};
function vanarPose(key: string, t: number, who: typeof H, releases: number[], seed: number) {
  const armsAt = (s: number) => armsFor(s, releases);
  const { fa, ba } = armsAt(t);
  const x = () => who.x;
  const { pose, bob } = standWalk(key, t, x, 0, {
    frontArm: fa, backArm: ba,
    frontFore: -10 + pendulum(key + 'ff2', t, (s) => armsAt(s).fa, { f: 1.5, z: .15, gain: .5 }),
    backFore: -14 + pendulum(key + 'bf2', t, (s) => armsAt(s).ba, { f: 1.5, z: .15, gain: .5 }),
    torso: kf(t - (releases.find(r => Math.abs(t - r) < 1) ?? -99), [[-.45, 0], [-.12, -6], [.22, 8], [.9, 0]]),
  }, seed);
  pose.tail = (pose.tail ?? 6) + pendulum(key + 'tl2', t, (s) => armsAt(s).fa, { f: .8, z: .1, gain: .1 });
  return { pose, bob };
}
export const S3: React.FC<{ t: number }> = ({ t }) => {
  const hR = THROWS.filter((_, i) => throwerOf(i) === H), nR = THROWS.filter((_, i) => throwerOf(i) === N);
  const hn = vanarPose('s3h', t, H, hR, 3), nl = vanarPose('s3n', t, N, nR, 9);
  const yH = GROUND - 402 * H.s + hn.bob, yN = GROUND - 402 * N.s + nl.bob;
  const mH = baseM(H.x, yH, H.s), mN = baseM(N.x, yN, N.s);
  const neelY = GROUND - 402 * .5 - 16 + 8 * Math.sin(t * 2.2);
  const flying = THROWS.map((r, i) => {
    const who = throwerOf(i), root = who === H ? HANUMAN : VANAR, pose = who === H ? hn.pose : nl.pose, m = who === H ? mH : mN;
    if (t < r - .7 || t >= r + FLIGHT) return null;
    if (t < r) { const p = holdPoint(root, pose, m); return <Puppet key={i} root={rock(i)} x={p[0]} y={p[1]} s={ROCK_S} fade={seg(t, r - .7, r - .5)} k={'fly' + i} />; }
    const u = (t - r) / FLIGHT, p0 = holdPoint(root, pose, m);
    const x = p0[0] + (SLOTS[i] - p0[0]) * u, y = p0[1] + (BRIDGE_Y - p0[1]) * u - 260 * 4 * u * (1 - u);
    return <Puppet key={i} root={rock(i)} x={x} y={y} rot={-70 * Math.sin(u * Math.PI)} s={ROCK_S} k={'fly' + i} />;
  });
  return (
    <>
      <Sky t={t} />
      <Puppet root={VANAR} pose={{ ...REST, frontArm: -160, backArm: -150, frontFore: -20 + 5 * Math.sin(t * 2), backFore: -20, head: 4 * Math.sin(t * 1.3) }} x={80} y={neelY} s={.5} depth={.35} k="neel" />
      <Puppet root={rock(7)} x={80 + 30} y={neelY - 402 * .5 * .9 - 40} s={ROCK_S} depth={.35} k="neelRock" />
      <Bridge t={t} landed={LANDED} />
      <Puppet root={VANAR} pose={nl.pose} x={N.x} y={yN} s={N.s} k="nal" rods={RODS} />
      <Puppet root={HANUMAN} pose={hn.pose} x={H.x} y={yH} s={H.s} k="hanuman" rods={RODS} />
      {flying}
      <FrontWave t={t} />
      <Bank t={t} />
      {LANDED.map((l, i) => <Splash key={i} t={t} at={l} x={SLOTS[i]} y={BRIDGE_Y + 10} k={'sp' + i} />)}
    </>
  );
};
