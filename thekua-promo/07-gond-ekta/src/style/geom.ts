// Geometry helpers: smooth tapered limbs (branches, roots, arms, tails) and curve sampling.
export type P = [number, number];
export type SP = [number, number, number];            // x, y, width

function densify(sp: SP[], n = 6): SP[] {
  if (sp.length < 3) return sp;
  const out: SP[] = [];
  const g = (i: number) => sp[Math.max(0, Math.min(sp.length - 1, i))];
  for (let i = 0; i < sp.length - 1; i++) for (let j = 0; j < n; j++) {
    const t = j / n, t2 = t * t, t3 = t2 * t, [p0, p1, p2, p3] = [g(i - 1), g(i), g(i + 1), g(i + 2)];
    const cr = (k: 0 | 1 | 2) => .5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3);
    out.push([cr(0), cr(1), cr(2)]);
  }
  out.push(sp[sp.length - 1]);
  return out;
}
export const spline = (sp: SP[], n = 6) => densify(sp, n);

// a tapered tube along a spine; `upto` (0..1) grows it from the root
export function tube(spine: SP[], upto = 1): string {
  let sp = densify(spine);
  if (upto < 1) {
    const L = sp.reduce((a, p, i) => i ? a + Math.hypot(p[0] - sp[i - 1][0], p[1] - sp[i - 1][1]) : 0, 0);
    let acc = 0; const out: SP[] = [sp[0]];
    for (let i = 1; i < sp.length; i++) {
      const s = Math.hypot(sp[i][0] - sp[i - 1][0], sp[i][1] - sp[i - 1][1]);
      if (acc + s >= L * upto) { const k = (L * upto - acc) / s; out.push([sp[i - 1][0] + (sp[i][0] - sp[i - 1][0]) * k, sp[i - 1][1] + (sp[i][1] - sp[i - 1][1]) * k, sp[i - 1][2] + (sp[i][2] - sp[i - 1][2]) * k]); break; }
      acc += s; out.push(sp[i]);
    }
    sp = out.length > 1 ? out : [sp[0], [sp[0][0], sp[0][1] - .1, sp[0][2]]];
  }
  const Lp: P[] = [], Rp: P[] = [];
  sp.forEach(([x, y, w], i) => {
    const a = sp[Math.max(0, i - 1)], b = sp[Math.min(sp.length - 1, i + 1)];
    let tx = b[0] - a[0], ty = b[1] - a[1]; const m = Math.hypot(tx, ty) || 1; tx /= m; ty /= m;
    Lp.push([x - ty * w / 2, y + tx * w / 2]); Rp.push([x + ty * w / 2, y - tx * w / 2]);
  });
  const e = sp[sp.length - 1], s = sp[0], f = (n: number) => n.toFixed(1);
  let d = `M${f(Lp[0][0])} ${f(Lp[0][1])}`;
  Lp.slice(1).forEach(p => d += ` L${f(p[0])} ${f(p[1])}`);
  d += ` A${f(Math.max(.5, e[2] / 2))} ${f(Math.max(.5, e[2] / 2))} 0 0 1 ${f(Rp[Rp.length - 1][0])} ${f(Rp[Rp.length - 1][1])}`;
  Rp.slice(0, -1).reverse().forEach(p => d += ` L${f(p[0])} ${f(p[1])}`);
  d += ` A${f(s[2] / 2)} ${f(s[2] / 2)} 0 0 1 ${f(Lp[0][0])} ${f(Lp[0][1])} Z`;
  return d;
}
// point + direction at fraction u along a spine
export function along(spine: SP[], u: number): { p: P; ang: number; w: number } {
  const sp = densify(spine);
  const seg = sp.map((p, i) => i ? Math.hypot(p[0] - sp[i - 1][0], p[1] - sp[i - 1][1]) : 0);
  const L = seg.reduce((a, b) => a + b, 0);
  let target = L * Math.max(0, Math.min(1, u)), i = 1;
  while (i < sp.length - 1 && target > seg[i]) { target -= seg[i]; i++; }
  const k = seg[i] ? target / seg[i] : 0, a = sp[i - 1], b = sp[i];
  return { p: [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k], ang: Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI, w: a[2] + (b[2] - a[2]) * k };
}
export const leafPath = (len: number, wid: number) => `M0 0 C${len * .25} ${-wid} ${len * .75} ${-wid * .9} ${len} 0 C${len * .75} ${wid * .9} ${len * .25} ${wid} 0 0 Z`;
