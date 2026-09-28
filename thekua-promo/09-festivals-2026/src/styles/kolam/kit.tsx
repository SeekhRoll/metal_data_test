import React from 'react';
import { rng } from '../pahari/rand';

// Kolam (Tamil Nadu): white rice-flour lines on a dark earth-red floor. Dots first, then one continuous line that
// winds around them without lifting. Colour (royal blue, a little saffron) only as powder inside finished shapes.
export const K = { floor: '#6E2A1C', floorDeep: '#4E1C12', flour: '#F6F1E6', blue: '#2C4FB8', saffron: '#E88A2A', dot: '#F6F1E6' };

export const KolamDefs: React.FC = () => (
  <defs>
    {/* hand-drawn flour: slightly uneven edges and grain */}
    <filter id="flour" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="1" seed="4" result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale="3.4" xChannelSelector="R" yChannelSelector="G" result="d" />
      <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="1" seed="11" result="g" />
      <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 1.7" result="ga" />
      <feComposite in="d" in2="ga" operator="in" />
    </filter>
    <filter id="floorTex" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".012 .02" numOctaves="4" seed="2" result="n" />
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 .2  0 0 0 0 .07  0 0 0 0 .04  0 0 0 -1.6 1.1" />
    </filter>
    <filter id="powderGrain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="1" seed="7" result="n" />
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.6 1.8" result="a" />
      <feComposite in="SourceGraphic" in2="a" operator="in" />
    </filter>
  </defs>
);

export const Floor: React.FC<{ x?: number; y?: number; w?: number; h?: number }> = ({ x = 0, y = 0, w = 1080, h = 1920 }) => (
  <g data-kind="surface"><rect x={x} y={y} width={w} height={h} fill={K.floor} /><rect x={x} y={y} width={w} height={h} filter="url(#floorTex)" opacity={.7} /></g>
);

// a flour line that draws itself: `p` 0..1 of its length (pathLength trick), slightly uneven width via the flour filter
export const Flour: React.FC<{ d: string; p?: number; w?: number; col?: string; id?: string }> = ({ d, p = 1, w = 5, col = K.flour, id }) => p <= 0 ? null : (
  <path d={d} fill="none" stroke={col} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={p < 1 ? `${p} 1` : undefined} filter="url(#flour)" data-kind="graphic" data-id={id} />
);
export const Powder: React.FC<{ d: string; col: string; a?: number }> = ({ d, col, a = 1 }) => a <= 0 ? null : <path d={d} fill={col} opacity={.85 * a} filter="url(#powderGrain)" />;

// ---------------------------------------------------------------- dot grids and the loop kolam (a single closed line around every dot)
export type Grid = { cx: number; cy: number; n: number; s: number };
export const gridDots = (g: Grid) => {
  const out: [number, number][] = [];
  for (let i = 0; i < g.n; i++) for (let j = 0; j < g.n; j++) {
    const dx = i - (g.n - 1) / 2, dy = j - (g.n - 1) / 2;
    if (Math.abs(dx) + Math.abs(dy) <= (g.n - 1) / 2 + .01) out.push([g.cx + (dx - dy) * g.s * .7071, g.cy + (dx + dy) * g.s * .7071]);
  }
  return out;
};
export const Dots: React.FC<{ pts: [number, number][]; k?: number; r?: number }> = ({ pts, k = 1, r = 5 }) => (
  <g data-kind="graphic" data-id="dots">{pts.slice(0, Math.ceil(pts.length * k)).map(([x, y], i) => <circle key={i} cx={x} cy={y} r={r} fill={K.dot} filter="url(#flour)" />)}</g>
);

// Sikku-style continuous line for a rhombus grid: a closed curve that weaves around each dot (lissajous-like path),
// generated as one path so it can be drawn without lifting.
export function loopKolam(g: Grid, turns = 3) {
  const N = 1400, R = (g.n - 1) / 2 * g.s * .72 + g.s * .5, pts: string[] = [];
  for (let i = 0; i <= N; i++) {
    const a = i / N * Math.PI * 2;
    const r = R * (.62 + .38 * Math.cos(turns * 2 * a) ** 2) + g.s * .22 * Math.sin((g.n * 2) * a);
    const x = g.cx + Math.cos(a) * r, y = g.cy + Math.sin(a) * r;
    pts.push(`${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return pts.join(' ') + 'Z';
}
// a rosette of petal loops (lotus kolam), one continuous line
export function petalKolam(cx: number, cy: number, R: number, petals = 8, inner = .45) {
  const N = 1600, pts: string[] = [];
  for (let i = 0; i <= N; i++) {
    const a = i / N * Math.PI * 2, r = R * (inner + (1 - inner) * Math.abs(Math.sin(petals / 2 * a)));
    pts.push(`${i ? 'L' : 'M'}${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)}`);
  }
  return pts.join(' ') + 'Z';
}
// the sun: a ring and a continuous zig-zag of rays
export function sunKolam(cx: number, cy: number, R: number, rays = 16) {
  let d = '';
  for (let i = 0; i <= rays * 2; i++) { const a = i / (rays * 2) * Math.PI * 2, r = i % 2 ? R * 1.5 : R * 1.08; d += `${i ? 'L' : 'M'}${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)} `; }
  return d + 'Z';
}
export const circleD = (cx: number, cy: number, r: number) => `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0`;
export const ellipseD = (cx: number, cy: number, rx: number, ry: number) => `M${cx - rx} ${cy} a${rx} ${ry} 0 1 0 ${2 * rx} 0 a${rx} ${ry} 0 1 0 ${-2 * rx} 0`;

// ---------------------------------------------------------------- continuous-line figures (hand-authored single strokes)
// The Devi's face around the central dot, ending in a gentle smile: one stroke.
export const FACE_LINE = (cx: number, cy: number, s = 1) => {
  const P = (x: number, y: number) => `${(cx + x * s).toFixed(1)} ${(cy + y * s).toFixed(1)}`;
  return [
    `M${P(0, 150)}`,
    `C${P(-60, 148)} ${P(-104, 100)} ${P(-112, 30)}`,          // left cheek up
    `C${P(-120, -60)} ${P(-80, -150)} ${P(0, -158)}`,          // forehead
    `C${P(80, -150)} ${P(120, -60)} ${P(112, 30)}`,
    `C${P(104, 100)} ${P(60, 148)} ${P(0, 150)}`,              // back to the chin
    `C${P(-30, 138)} ${P(-40, 100)} ${P(-26, 90)}`,            // into the smile
    `C${P(-12, 104)} ${P(12, 104)} ${P(26, 90)}`,
    `C${P(14, 80)} ${P(6, 60)} ${P(0, 50)}`,                   // nose line up
    `C${P(-8, 20)} ${P(-4, -10)} ${P(-10, -24)}`,
    `C${P(-30, -40)} ${P(-60, -40)} ${P(-80, -24)}`,           // left eye: long almond
    `C${P(-60, -6)} ${P(-30, -6)} ${P(-10, -24)}`,
    `C${P(-30, -64)} ${P(-70, -66)} ${P(-90, -48)}`,           // left brow
    `M${P(10, -24)} C${P(30, -40)} ${P(60, -40)} ${P(80, -24)}`,
    `C${P(60, -6)} ${P(30, -6)} ${P(10, -24)}`,
    `C${P(30, -64)} ${P(70, -66)} ${P(90, -48)}`,
    `M${P(-6, -78)} C${P(-6, -90)} ${P(6, -90)} ${P(6, -78)} C${P(6, -66)} ${P(-6, -66)} ${P(-6, -78)}`, // bindi
  ].join(' ');
};

export const Ring: React.FC<{ cx: number; cy: number; r: number; n?: number; seed?: number; p?: number }> = ({ cx, cy, r, n = 36, p = 1 }) => {
  let d = '';
  for (let i = 0; i <= n * 8; i++) { const a = i / (n * 8) * Math.PI * 2, rr = r + 12 * Math.sin(a * n); d += `${i ? 'L' : 'M'}${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)} `; }
  return <Flour d={d + 'Z'} p={p} w={4} />;
};

export { rng };

// Kushmanda in continuous line inside the sun: face, crown loops, eight arm-loops each ending in its item, lion below
export const KolamDevi: React.FC<{ cx: number; cy: number; s?: number; p?: number; fill?: number }> = ({ cx, cy, s = 1, p = 1, fill = 1 }) => {
  const P = (x: number, y: number) => `${(cx + x * s).toFixed(1)} ${(cy + y * s).toFixed(1)}`;
  const q = (a: number, b: number) => Math.max(0, Math.min(1, (p - a) / (b - a)));
  const arms = Array.from({ length: 8 }, (_, i) => {
    const side = i < 4 ? -1 : 1, k = i % 4, a = (side < 0 ? 200 - k * 34 : -20 + k * 34) * Math.PI / 180;
    const sx = side * 60, sy = 170, ex = sx + Math.cos(a) * 230, ey = sy + Math.sin(a) * 200;
    const mx = (sx + ex) / 2 - Math.sin(a) * 40 * side, my = (sy + ey) / 2 + Math.cos(a) * 40;
    return { d: `M${P(sx, sy)} Q${P(mx, my)} ${P(ex, ey)} Q${P(mx + 20 * side, my + 24)} ${P(sx, sy + 30)}`, ex, ey, i };
  });
  const items = ['circle', 'lotus', 'arrow', 'bow', 'circle', 'lotus', 'kalash', 'circle'];
  return (
    <g>
      {fill > 0 && <Powder d={ellipseD(cx, cy, 112 * s, 154 * s)} col={K.saffron} a={fill * .55} />}
      <Flour d={FACE_LINE(cx, cy, s)} p={q(0, .3)} w={5} id="devi-face" />
      {/* crown: three rising loops */}
      <Flour d={`M${P(-90, -170)} C${P(-100, -260)} ${P(-40, -300)} ${P(-30, -200)} C${P(-20, -320)} ${P(20, -320)} ${P(30, -200)} C${P(40, -300)} ${P(100, -260)} ${P(90, -170)}`} p={q(.25, .4)} w={5} />
      {/* shoulders and torso as a lotus-bud outline */}
      <Flour d={`M${P(-60, 170)} C${P(-140, 200)} ${P(-150, 360)} ${P(-80, 460)} C${P(-40, 520)} ${P(40, 520)} ${P(80, 460)} C${P(150, 360)} ${P(140, 200)} ${P(60, 170)}`} p={q(.35, .5)} w={5} />
      {arms.map((a, i) => <g key={i}>
        <Flour d={a.d} p={q(.5 + i * .04, .56 + i * .04)} w={4.5} />
        {q(.56 + i * .04, .6 + i * .04) > 0 && (items[i] === 'circle'
          ? <Flour d={circleD(cx + a.ex * s, cy + (a.ey - 14) * s, 20 * s)} p={q(.56 + i * .04, .6 + i * .04)} w={4} />
          : items[i] === 'lotus' ? <Flour d={petalKolam(cx + a.ex * s, cy + (a.ey - 20) * s, 26 * s, 6, .3)} p={q(.56 + i * .04, .6 + i * .04)} w={3.4} />
          : items[i] === 'kalash' ? <Flour d={`M${P(a.ex - 18, a.ey - 4)} C${P(a.ex - 30, a.ey - 40)} ${P(a.ex + 30, a.ey - 40)} ${P(a.ex + 18, a.ey - 4)} Z M${P(a.ex - 8, a.ey - 36)} L${P(a.ex, a.ey - 56)} L${P(a.ex + 8, a.ey - 36)}`} p={q(.56 + i * .04, .6 + i * .04)} w={3.6} />
          : items[i] === 'bow' ? <Flour d={`M${P(a.ex, a.ey - 60)} Q${P(a.ex + 40, a.ey)} ${P(a.ex, a.ey + 60)} L${P(a.ex, a.ey - 60)}`} p={q(.56 + i * .04, .6 + i * .04)} w={3.6} />
          : <Flour d={`M${P(a.ex - 50, a.ey + 20)} L${P(a.ex + 40, a.ey - 30)} M${P(a.ex + 40, a.ey - 30)} l${-18 * s} ${2 * s} M${P(a.ex + 40, a.ey - 30)} l${-6 * s} ${16 * s}`} p={q(.56 + i * .04, .6 + i * .04)} w={3.6} />)}
      </g>)}
      {/* the lion: one flowing profile line, mane as loops */}
      <Flour d={`M${P(-260, 640)} C${P(-230, 560)} ${P(-120, 540)} ${P(0, 548)} C${P(90, 552)} ${P(150, 540)} ${P(190, 500)} C${P(240, 470)} ${P(300, 490)} ${P(300, 550)} C${P(300, 600)} ${P(250, 620)} ${P(220, 600)} C${P(210, 640)} ${P(200, 700)} ${P(210, 760)} M${P(-200, 600)} C${P(-210, 680)} ${P(-190, 720)} ${P(-200, 760)} M${P(-80, 600)} C${P(-84, 680)} ${P(-76, 720)} ${P(-80, 760)} M${P(100, 600)} C${P(104, 680)} ${P(96, 720)} ${P(100, 760)} M${P(-260, 640)} C${P(-320, 620)} ${P(-340, 560)} ${P(-300, 520)}`} p={q(.82, 1)} w={5} id="lion" />
      {q(.9, 1) > 0 && <Flour d={petalKolam(cx + 240 * s, cy + 530 * s, 70 * s, 12, .55)} p={q(.9, 1)} w={3.4} />}
    </g>
  );
};

// ---------------------------------------------------------------- the real sikku kolam: a 45° "billiard" path between the dots
// Dots at integer points of an nx × ny grid (ny = nx + 1 gives a single closed line). The line runs diagonally between
// dots and, where it meets the edge, loops around the edge dot instead of reflecting sharply. Returned already rotated
// 45° and scaled about (cx, cy), with the dot positions.
export function sikku(nx: number, ny: number, cx: number, cy: number, s: number) {
  const X0 = -.5, X1 = nx - .5, Y0 = -.5, Y1 = ny - .5;
  const map = (x: number, y: number): [number, number] => { const u = x - (nx - 1) / 2, v = y - (ny - 1) / 2; return [cx + (u - v) * s * .7071, cy + (u + v) * s * .7071]; };
  let x = X0, y = 0, vx = 1, vy = 1;
  const hits: { x: number; y: number; vin: [number, number]; vout: [number, number] }[] = [];
  for (let guard = 0; guard < 4000; guard++) {
    const tx = vx > 0 ? (X1 - x) : (x - X0), ty = vy > 0 ? (Y1 - y) : (y - Y0), t = Math.min(tx, ty);
    x += vx * t; y += vy * t;
    const vin: [number, number] = [vx, vy];
    if (Math.abs(tx - t) < 1e-9) vx = -vx;
    if (Math.abs(ty - t) < 1e-9) vy = -vy;
    hits.push({ x, y, vin, vout: [vx, vy] });
    if (Math.abs(x - X0) < 1e-9 && Math.abs(y - 0) < 1e-9 && vx === 1 && vy === 1) break;
  }
  // build the path: diagonals that swell softly around each dot they pass (the hand-drawn sikku curve), and a rounded
  // loop at each boundary hit that bulges out around the edge dot
  const parts: string[] = [];
  const wave = (ax: number, ay: number, bx: number, by: number) => {
    const L = Math.hypot(bx - ax, by - ay), n = Math.max(2, Math.round(L * 10)), ux = (bx - ax) / L, uy = (by - ay) / L;
    let d = '';
    for (let k = 1; k <= n; k++) { const t = k / n * L, off = .13 * Math.sin(Math.PI * 2 * t / 1.4142), q = map(ax + ux * t - uy * off, ay + uy * t + ux * off); d += ` L${q[0].toFixed(1)} ${q[1].toFixed(1)}`; }
    return d;
  };
  let prev: [number, number] | null = null;
  hits.forEach((h, i) => {
    const inx = h.x - h.vin[0] * .5, iny = h.y - h.vin[1] * .5, pout = map(h.x + h.vout[0] * .5, h.y + h.vout[1] * .5);
    const nxo = h.vin[0] !== h.vout[0] ? h.vin[0] : 0, nyo = h.vin[1] !== h.vout[1] ? h.vin[1] : 0;   // outward normal
    const c = map(h.x + nxo * .62, h.y + nyo * .62), pin = map(inx, iny);
    if (i === 0) parts.push(`M${pin[0].toFixed(1)} ${pin[1].toFixed(1)}`);
    else if (prev) parts.push(wave(prev[0], prev[1], inx, iny));
    parts.push(` Q${c[0].toFixed(1)} ${c[1].toFixed(1)} ${pout[0].toFixed(1)} ${pout[1].toFixed(1)}`);
    prev = [h.x + h.vout[0] * .5, h.y + h.vout[1] * .5];
  });
  // close the loop along the curve back to the first loop (not with a straight chord)
  if (prev) { const f = hits[0]; parts.push(wave(prev[0], prev[1], f.x - f.vin[0] * .5, f.y - f.vin[1] * .5)); }
  const dots: [number, number][] = [];
  for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) dots.push(map(i, j));
  return { d: parts.join(' '), dots };
}
