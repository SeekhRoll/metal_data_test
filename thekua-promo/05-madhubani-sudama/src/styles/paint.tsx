import React from 'react';
import { C } from './palette';

// ---------------------------------------------------------------- Bharni fill
// A flat colour area outlined twice in black ink with kachni hatching in the gap between the lines.
// Built from stacked strokes on the same path: wide black -> paper band -> tick marks across the band.
// The fill is nudged a hair off its outline so the pigment slightly overlaps the ink, as by hand.
export const Bharni: React.FC<{
  d: string; fill: string; band?: number; pattern?: string; hatch?: boolean; slip?: [number, number]; bandFill?: string;
}> = ({ d, fill, band = 5, pattern, hatch = true, slip = [1.4, -1], bandFill = C.paper }) => (
  <g>
    <path d={d} fill={fill} transform={`translate(${slip[0]} ${slip[1]})`} />
    {pattern && <path d={d} fill={`url(#${pattern})`} opacity={0.9} />}
    <path d={d} fill="none" stroke={C.black} strokeWidth={band * 2 + 5} strokeLinejoin="round" />
    <path d={d} fill="none" stroke={bandFill} strokeWidth={band * 2} strokeLinejoin="round" />
    {hatch && <path d={d} fill="none" stroke={C.black} strokeWidth={band * 2} strokeDasharray="1.4 3.6" />}
  </g>
);

// Ek-rekha: single ink outline (skin, small parts)
export const Line: React.FC<{ d: string; fill?: string; w?: number; slip?: [number, number] }> = ({ d, fill = 'none', w = 3.2, slip = [1, -.8] }) => (
  <g>
    {fill !== 'none' && <path d={d} fill={fill} transform={`translate(${slip[0]} ${slip[1]})`} />}
    <path d={d} fill="none" stroke={C.black} strokeWidth={w} strokeLinejoin="round" strokeLinecap="round" />
  </g>
);

// ---------------------------------------------------------------- geometry helpers
type P = [number, number];
const f = (n: number) => n.toFixed(1);

// Catmull-Rom through points -> smooth cubic path
export function smooth(pts: P[], closed = false): string {
  const n = pts.length; if (n < 2) return '';
  const g = (i: number) => closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))];
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
    const c1: P = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: P = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return closed ? d + ' Z' : d;
}

// tapered tube along a spine [x, y, width]: arms, legs, necks, flute, feather quills
export function tube(sp: [number, number, number][]): string {
  const L: P[] = [], R: P[] = [];
  sp.forEach(([x, y, w], i) => {
    const a = sp[Math.max(0, i - 1)], b = sp[Math.min(sp.length - 1, i + 1)];
    let tx = b[0] - a[0], ty = b[1] - a[1]; const m = Math.hypot(tx, ty) || 1; tx /= m; ty /= m;
    L.push([x - ty * w / 2, y + tx * w / 2]); R.push([x + ty * w / 2, y - tx * w / 2]);
  });
  // round caps: a point pushed out beyond each end
  const s = sp[0], e = sp[sp.length - 1], s1 = sp[1], e1 = sp[sp.length - 2];
  const ext = (p: [number, number, number], q: [number, number, number]): P => {
    const dx = p[0] - q[0], dy = p[1] - q[1], m = Math.hypot(dx, dy) || 1; return [p[0] + dx / m * p[2] * .45, p[1] + dy / m * p[2] * .45];
  };
  return smooth([...L, ext(e, e1), ...R.reverse(), ext(s, s1)], true);
}

// lens / almond between two points (eyes, leaves, fish bodies)
export function lens(x0: number, y0: number, x1: number, y1: number, bulge: number, bulge2 = bulge): string {
  const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, dx = x1 - x0, dy = y1 - y0, m = Math.hypot(dx, dy), nx = -dy / m, ny = dx / m;
  return `M${f(x0)} ${f(y0)} Q${f(mx + nx * bulge * 2)} ${f(my + ny * bulge * 2)} ${f(x1)} ${f(y1)} Q${f(mx - nx * bulge2 * 2)} ${f(my - ny * bulge2 * 2)} ${f(x0)} ${f(y0)} Z`;
}

export const circle = (x: number, y: number, r: number) => `M${f(x - r)} ${f(y)} a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0 a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0 Z`;
