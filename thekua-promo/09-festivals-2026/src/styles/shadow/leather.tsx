import React from 'react';
import { L, GLOW, LIFT } from './palette';

// ---------------------------------------------------------------- translucent leather (brief §3.3)
// A dyed leather piece: colour multiplies over the glowing screen at partial opacity, the thicker edge
// reads darker, and punched holes (masked out) let the lamp through and bloom.
export const Leather: React.FC<{ id: string; d: string; fill: string; holes?: React.ReactNode; alpha?: number; edge?: number; paint?: React.ReactNode; lift?: number; cut?: React.ReactNode }> = ({ id, d, fill, holes, alpha = .84, edge = 3, paint, cut, lift = LIFT[fill] ?? 0 }) => (
  <g data-kind="graphic">
    <mask id={`m-${id}`} maskUnits="userSpaceOnUse" x={-3000} y={-3000} width={6000} height={6000}>
      <path d={d} fill="#fff" />
      {holes && <g fill="#000" stroke="#000">{holes}</g>}
      {cut && <g fill="#000">{cut}</g>}
    </mask>
    <g mask={`url(#m-${id})`} style={{ mixBlendMode: 'multiply' }}>
      <path d={d} fill={fill} opacity={alpha} />
      {paint}
      <path d={d} fill="none" stroke={L.black} strokeWidth={edge * 2.4} opacity={.55} />
    </g>
    {lift > 0 && <g mask={`url(#m-${id})`}><path d={d} fill={fill} opacity={lift} /></g>}
    {holes && <g fill={GLOW} stroke={GLOW} opacity={.5} filter="url(#holeBloom)" style={{ mixBlendMode: 'screen' }}>{holes}</g>}
  </g>
);

// ---------------------------------------------------------------- perforation helpers (children of a mask: no fill set)
type Pt = [number, number];
export const Dots: React.FC<{ pts: Pt[]; r?: number }> = ({ pts, r = 4 }) => <>{pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={r} />)}</>;

export function along(pts: Pt[], step: number): Pt[] {
  const out: Pt[] = []; let carry = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const [a, b] = [pts[i], pts[i + 1]], L0 = Math.hypot(b[0] - a[0], b[1] - a[1]);
    let d = carry;
    while (d <= L0) { const k = d / L0; out.push([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]); d += step; }
    carry = d - L0;
  }
  return out;
}
export function arcPts(cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, n = 24): Pt[] {
  return Array.from({ length: n + 1 }, (_, i) => { const a = a0 + (a1 - a0) * i / n; return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]; });
}
export const DotLine: React.FC<{ pts: Pt[]; step?: number; r?: number }> = ({ pts, step = 12, r = 3.2 }) => <Dots pts={along(pts, step)} r={r} />;

export const Rosette: React.FC<{ x: number; y: number; r?: number; n?: number }> = ({ x, y, r = 16, n = 8 }) => (
  <g>
    <circle cx={x} cy={y} r={r * .28} />
    {Array.from({ length: n }, (_, i) => { const a = i / n * Math.PI * 2; return <path key={i} d={slitPath(x + Math.cos(a) * r * .5, y + Math.sin(a) * r * .5, x + Math.cos(a) * r, y + Math.sin(a) * r, r * .16)} />; })}
  </g>
);
export function slitPath(x0: number, y0: number, x1: number, y1: number, w: number): string {
  const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, dx = x1 - x0, dy = y1 - y0, m = Math.hypot(dx, dy) || 1, nx = -dy / m * w, ny = dx / m * w;
  return `M${x0} ${y0} Q${mx + nx} ${my + ny} ${x1} ${y1} Q${mx - nx} ${my - ny} ${x0} ${y0} Z`;
}
export const Slit: React.FC<{ a: Pt; b: Pt; w?: number }> = ({ a, b, w = 3 }) => <path d={slitPath(a[0], a[1], b[0], b[1], w)} />;
export const Slits: React.FC<{ pts: Pt[]; len?: number; ang?: number; w?: number }> = ({ pts, len = 14, ang = 90, w = 2.6 }) => (
  <>{pts.map(([x, y], i) => { const a = ang * Math.PI / 180; return <path key={i} d={slitPath(x - Math.cos(a) * len / 2, y - Math.sin(a) * len / 2, x + Math.cos(a) * len / 2, y + Math.sin(a) * len / 2, w)} />; })}</>
);

// ---------------------------------------------------------------- tube: a limb outline along a spine with widths
function densify(sp: [number, number, number][], n = 6): [number, number, number][] {
  if (sp.length < 3) return sp;
  const out: [number, number, number][] = [];
  const g = (i: number) => sp[Math.max(0, Math.min(sp.length - 1, i))];
  for (let i = 0; i < sp.length - 1; i++) for (let j = 0; j < n; j++) {
    const t = j / n, t2 = t * t, t3 = t2 * t, [p0, p1, p2, p3] = [g(i - 1), g(i), g(i + 1), g(i + 2)];
    const cr = (k: 0 | 1 | 2) => .5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3);
    out.push([cr(0), cr(1), cr(2)]);
  }
  out.push(sp[sp.length - 1]);
  return out;
}
export function tube(spine: [number, number, number][]): string {
  const sp = densify(spine);
  const Lp: Pt[] = [], Rp: Pt[] = [];
  sp.forEach(([x, y, w], i) => {
    const a = sp[Math.max(0, i - 1)], b = sp[Math.min(sp.length - 1, i + 1)];
    let tx = b[0] - a[0], ty = b[1] - a[1]; const m = Math.hypot(tx, ty) || 1; tx /= m; ty /= m;
    Lp.push([x - ty * w / 2, y + tx * w / 2]); Rp.push([x + ty * w / 2, y - tx * w / 2]);
  });
  const e = sp[sp.length - 1], s = sp[0];
  const f = (n: number) => n.toFixed(1);
  let d = `M${f(Lp[0][0])} ${f(Lp[0][1])}`;
  Lp.slice(1).forEach(p => d += ` L${f(p[0])} ${f(p[1])}`);
  d += ` A${f(e[2] / 2)} ${f(e[2] / 2)} 0 0 1 ${f(Rp[Rp.length - 1][0])} ${f(Rp[Rp.length - 1][1])}`;
  Rp.slice(0, -1).reverse().forEach(p => d += ` L${f(p[0])} ${f(p[1])}`);
  d += ` A${f(s[2] / 2)} ${f(s[2] / 2)} 0 0 1 ${f(Lp[0][0])} ${f(Lp[0][1])} Z`;
  return d;
}
