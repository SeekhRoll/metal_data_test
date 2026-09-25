import React from 'react';
import { Puppet } from '../stage/rig';
import { wave, bank, lanka, sun, rock, drop } from '../puppets/props';
import { jitter, clamp01 } from '../stage/motion';

// Shared seashore set for scenes 2-6: sun, far Lanka, back wave; the bank and the front wave go in front.
export const GROUND = 1290;                          // feet line on the sand
export const BRIDGE_Y = 1262;                        // floating rocks' centre line
export const SLOTS = [540, 660, 780, 900, 1020];
export const ROCK_S = .56;
export const GAP = [600, 1206] as [number, number];  // the crack between the first two rocks, where the squirrel shakes sand

export const Sky: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Puppet root={sun()} x={300} y={400} s={1} rot={t * 3} depth={.2} k="sun" />
    <Puppet root={lanka()} x={880} y={1172 + jitter(t, 5, 2)} s={.62} depth={.55} k="lanka" />
    <Puppet root={wave(1100, t * .8 + 2)} x={600 + 12 * Math.sin(t * .7)} y={1226 + 5 * Math.sin(t * 1.1)} s={1} depth={.3} k="waveBack" />
  </>
);
export const Bank: React.FC<{ t: number }> = ({ t }) => <Puppet root={bank()} x={220} y={1300 + jitter(t, 8, 1.2)} k="bank" />;
export const FrontWave: React.FC<{ t: number }> = ({ t }) => (
  <Puppet root={wave(900, t * 1.2)} x={985 + 14 * Math.sin(t * .9 + 1)} y={1322 + 6 * Math.sin(t * 1.4)} k="waveFront" rods={[{ part: 'wave', at: [-200, 150] }, { part: 'wave', at: [200, 150] }]} />
);

// a rock that has landed in its slot: buoyant bob plus a damped dip after the splash
export function rockBob(t: number, i: number, landed: number) {
  const u = t - landed;
  const dipY = u > 0 ? 22 * Math.exp(-u * 3.2) * Math.cos(u * 8) : 0;
  return { y: BRIDGE_Y + 5 * Math.sin(t * 1.7 + i * 1.3) + dipY, rot: 3 * Math.sin(t * 1.3 + i * 2) + (u > 0 ? 10 * Math.exp(-u * 3) * Math.sin(u * 7) : 0) };
}
export const Bridge: React.FC<{ t: number; landed: number[] }> = ({ t, landed }) => (
  <>{landed.map((lt, i) => t >= lt && (() => { const b = rockBob(t, i, lt); return <Puppet key={i} root={rock(i)} x={SLOTS[i]} y={b.y} rot={b.rot} s={ROCK_S} k={'rk' + i} />; })())}</>
);

// water drops thrown up where something lands
export const Splash: React.FC<{ t: number; at: number; x: number; y: number; k: string; n?: number }> = ({ t, at, x, y, k, n = 7 }) => {
  const u = t - at;
  if (u < 0 || u > .8) return null;
  return <>{Array.from({ length: n }, (_, i) => {
    const a = -Math.PI / 2 + (i - (n - 1) / 2) * .32, v = 380 + (i % 3) * 60;
    return <Puppet key={i} root={drop()} x={x + Math.cos(a) * v * u} y={y + Math.sin(a) * v * u + 900 * u * u} rot={a * 57 + 90} s={.9} fade={1 - clamp01((u - .45) / .35)} k={`${k}-d${i}`} />;
  })}</>;
};
