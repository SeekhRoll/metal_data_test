import React from 'react';
import { L } from './palette';

// Jointed puppet rigs (brief §3.4: hierarchical transforms with pivots at the rivets).
// A Part's drawing is in its own local frame whose origin is its joint; `at` places that joint in the parent.
export type Part = {
  id: string;
  at: [number, number];
  rot?: number;               // rest angle (degrees)
  behind?: boolean;           // drawn before the parent (far arm, far leg, tail, scarf)
  rivet?: boolean;            // visible joint rivet at the origin
  draw: (key: string) => React.ReactNode;
  children?: Part[];
};
export type Pose = Record<string, number>;

export const Rivet: React.FC<{ r?: number }> = ({ r = 8 }) => (
  <g data-kind="graphic">
    <circle r={r} fill={L.black} opacity={.85} />
    <circle r={r * .45} fill="#C8962E" opacity={.9} />
    <circle r={r * .18} fill="#FFF3C8" />
  </g>
);

export const Rig: React.FC<{ part: Part; pose?: Pose; k: string; rivetR?: number }> = ({ part, pose = {}, k, rivetR = 8 }) => {
  const a = pose[part.id] ?? part.rot ?? 0;
  const kids = part.children || [];
  return (
    <g transform={`translate(${part.at[0]} ${part.at[1]}) rotate(${a})`}>
      {kids.filter(c => c.behind).map(c => <Rig key={c.id} part={c} pose={pose} k={k} rivetR={rivetR} />)}
      {part.draw(`${k}-${part.id}`)}
      {kids.filter(c => !c.behind).map(c => <Rig key={c.id} part={c} pose={pose} k={k} rivetR={rivetR} />)}
      {part.rivet && <Rivet r={rivetR} />}
    </g>
  );
};

// ---------------------------------------------------------------- forward kinematics (for rod attachment points)
type M = [number, number, number, number, number, number];
const mul = (a: M, b: M): M => [a[0] * b[0] + a[2] * b[1], a[1] * b[0] + a[3] * b[1], a[0] * b[2] + a[2] * b[3], a[1] * b[2] + a[3] * b[3], a[0] * b[4] + a[2] * b[5] + a[4], a[1] * b[4] + a[3] * b[5] + a[5]];
const tr = (x: number, y: number): M => [1, 0, 0, 1, x, y];
const ro = (deg: number): M => { const r = deg * Math.PI / 180, c = Math.cos(r), s = Math.sin(r); return [c, s, -s, c, 0, 0]; };

export function worldPoint(root: Part, pose: Pose, base: M, target: string, local: [number, number]): [number, number] | null {
  const walk = (p: Part, m: M): [number, number] | null => {
    const here = mul(m, mul(tr(p.at[0], p.at[1]), ro(pose[p.id] ?? p.rot ?? 0)));
    if (p.id === target) return [here[0] * local[0] + here[2] * local[1] + here[4], here[1] * local[0] + here[3] * local[1] + here[5]];
    for (const c of p.children || []) { const r = walk(c, here); if (r) return r; }
    return null;
  };
  return walk(root, base);
}
export const placeM = (x: number, y: number, s: number, flip = false): M => [flip ? -s : s, 0, 0, s, x, y];

// ---------------------------------------------------------------- control rods: thin, dark, semi-transparent bamboo off the bottom
export const Rod: React.FC<{ from: [number, number]; to?: [number, number]; w?: number }> = ({ from, to, w = 7 }) => {
  const end = to || [from[0] + (from[0] - 540) * .12, 2000];
  return (
    <g data-kind="graphic" style={{ mixBlendMode: 'multiply' }}>
      <line x1={from[0]} y1={from[1]} x2={end[0]} y2={end[1]} stroke="#2A1A10" strokeWidth={w} strokeLinecap="round" opacity={.5} />
      <line x1={from[0]} y1={from[1]} x2={end[0]} y2={end[1]} stroke="#2A1A10" strokeWidth={w * .35} strokeLinecap="round" opacity={.35} strokeDasharray="30 6" />
    </g>
  );
};

// A puppet placed on the screen, with depth (brief §3.3): pressed to the screen = sharp and full colour;
// pulled back = larger, blurred, dimmer.
export const Puppet: React.FC<{ root: Part; pose?: Pose; x: number; y: number; s?: number; flip?: boolean; depth?: number; k: string; rods?: { part: string; at: [number, number] }[]; rivetR?: number }> =
  ({ root, pose = {}, x, y, s = 1, flip, depth = 0, k, rods = [], rivetR }) => {
    const grow = 1 + .32 * depth, blur = depth * 16, op = 1 - .42 * depth;
    const m = placeM(x, y, s, flip);
    const rodPts = rods.map(r => worldPoint(root, pose, m, r.part, r.at)).filter(Boolean) as [number, number][];
    return (
      <g opacity={op} transform={`translate(${x} ${y}) scale(${grow}) translate(${-x} ${-y})`}>
        {blur > .3 && <defs><filter id={`dz-${k}`} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation={blur} /></filter></defs>}
        <g filter={blur > .3 ? `url(#dz-${k})` : undefined}>
          {rodPts.map((p, i) => <Rod key={i} from={p} />)}
          <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
            <Rig part={root} pose={pose} k={k} rivetR={rivetR} />
          </g>
        </g>
      </g>
    );
  };
