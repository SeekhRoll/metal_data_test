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
export const mulM = mul, roM = ro;
export type Mat = M;

// CCD inverse kinematics: turn the joints in `chain` (root first) so that point `eff.at` on part `eff.part` reaches
// `target` (screen coordinates). `w` scales how much each joint may turn per pass (e.g. a torso that only leans a little).
export function ccd(root: Part, pose: Pose, base: M, chain: string[], eff: { part: string; at: [number, number] }, target: [number, number],
  opts: { iters?: number; w?: Record<string, number>; lim?: Record<string, [number, number]> } = {}): Pose {
  const p: Pose = { ...pose }, sgn = Math.sign(base[0] * base[3] - base[1] * base[2]) || 1;
  const find = (q: Part, id: string): Part | null => q.id === id ? q : (q.children || []).reduce<Part | null>((r, c) => r || find(c, id), null);
  for (let it = 0; it < (opts.iters ?? 14); it++) {
    for (const j of [...chain].reverse()) {
      const pv = worldPoint(root, p, base, j, [0, 0]), e = worldPoint(root, p, base, eff.part, eff.at);
      if (!pv || !e) continue;
      let d = Math.atan2(target[1] - pv[1], target[0] - pv[0]) - Math.atan2(e[1] - pv[1], e[0] - pv[0]);
      while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
      const cur = p[j] ?? find(root, j)?.rot ?? 0;
      let nv = cur + d * 180 / Math.PI * sgn * (opts.w?.[j] ?? 1);
      const l = opts.lim?.[j]; if (l) nv = Math.max(l[0], Math.min(l[1], nv));
      p[j] = nv;
    }
  }
  return p;
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
export const Puppet: React.FC<{ root: Part; pose?: Pose; x: number; y: number; s?: number; flip?: boolean; depth?: number; k: string; rods?: { part: string; at: [number, number] }[]; rivetR?: number; fade?: number; rot?: number; clipBelow?: number }> =
  ({ root, pose = {}, x, y, s = 1, flip, depth = 0, k, rods = [], rivetR, fade = 1, rot = 0, clipBelow }) => {
    const grow = 1 + .32 * depth, blur = depth * 16, op = (1 - .42 * depth) * fade;
    if (op <= .005) return null;
    const m = mulM(placeM(x, y, s, flip), roM(rot));
    const rodPts = rods.map(r => worldPoint(root, pose, m, r.part, r.at)).filter(Boolean) as [number, number][];
    return (
      <g opacity={op} transform={`translate(${x} ${y}) scale(${grow}) translate(${-x} ${-y})`}>
        {blur > .3 && <defs><filter id={`dz-${k}`} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation={blur} /></filter></defs>}
        {clipBelow !== undefined && <defs><clipPath id={`cb-${k}`}><rect x={-4000} y={-4000} width={9000} height={4000 + clipBelow} /></clipPath></defs>}
        <g filter={blur > .3 ? `url(#dz-${k})` : undefined} clipPath={clipBelow !== undefined ? `url(#cb-${k})` : undefined}>
          <g data-id={k + "-rods"}>{rodPts.map((p, i) => <Rod key={i} from={p} />)}</g>
          <g data-id={k} transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s}) rotate(${rot})`}>
            <Rig part={root} pose={pose} k={k} rivetR={rivetR} />
          </g>
        </g>
      </g>
    );
  };

// the matrix a Puppet uses (depth 0), for IK targets and attaching one puppet to another's hand
export const baseM = (x: number, y: number, s = 1, flip = false, rot = 0): M => mul(placeM(x, y, s, flip), ro(rot));
