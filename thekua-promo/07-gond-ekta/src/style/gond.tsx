import React from 'react';
import { C, Col } from './palette';

// ============================================================================================================
// Gond figure: flat fill, contour bands of pattern that follow the outline (dashes, dots, seeds), an inner fill
// pattern, a thin white inner line along the edge, and a bold black outline (brief §3.2).
// Patterns are alive: `t` drives dash offsets (dots travel along the contour lines) and a pulse.
// ============================================================================================================

export type PatternKind = 'dots' | 'dashes' | 'scales' | 'seeds' | 'chevrons' | 'arcs' | 'none';
export type Band = { w: number; kind: 'solid' | 'dash' | 'dots' | 'seed' | 'ticks'; color: Col; gap?: number; speed?: number };
export type Life = { t: number; phase?: number; pulse?: number; grow?: number; jitter?: number };

let uid = 0;
const nextId = (p: string) => `${p}${uid++}`;

// ---------------------------------------------------------------- the pattern library (brief §3.4 step 1)
// Each is an SVG <pattern>; `t` animates its patternTransform (drift) and `pulse` its motif size.
export const PatternDef: React.FC<{ id: string; kind: PatternKind; fg: Col; bg?: Col; s?: number; t?: number; pulse?: number; angle?: number }> =
  ({ id, kind, fg, bg, s = 1, t = 0, pulse = 1, angle = 0 }) => {
    const p = pulse, size = { dots: 22, dashes: 18, scales: 30, seeds: 34, chevrons: 26, arcs: 34, none: 20 }[kind] * s;
    const drift = { dots: [t * 10, 0], dashes: [0, t * 12], scales: [0, t * 8], seeds: [t * 6, t * 6], chevrons: [t * 14, 0], arcs: [0, -t * 9], none: [0, 0] }[kind];
    const u = size;
    let motif: React.ReactNode = null;
    if (kind === 'dots') motif = <><circle cx={u * .25} cy={u * .25} r={u * .13 * p} fill={fg} /><circle cx={u * .75} cy={u * .75} r={u * .13 * p} fill={fg} /></>;
    if (kind === 'dashes') motif = <><path d={`M${u * .2} ${u * .15} v${u * .42 * p} M${u * .7} ${u * .55} v${u * .42 * p}`} stroke={fg} strokeWidth={u * .12} strokeLinecap="round" /></>;
    if (kind === 'scales') motif = <path d={`M0 ${u * .5} A${u * .5} ${u * .5} 0 0 0 ${u} ${u * .5} M${-u * .5} 0 A${u * .5} ${u * .5} 0 0 0 ${u * .5} 0 M${u * .5} 0 A${u * .5} ${u * .5} 0 0 0 ${u * 1.5} 0 M${-u * .5} ${u} A${u * .5} ${u * .5} 0 0 0 ${u * .5} ${u} M${u * .5} ${u} A${u * .5} ${u * .5} 0 0 0 ${u * 1.5} ${u}`}
      fill="none" stroke={fg} strokeWidth={u * .09 * (0.7 + .3 * p)} />;
    if (kind === 'seeds') motif = <><path d={`M${u * .25} ${u * .1} C${u * (.25 + .14 * p)} ${u * .25} ${u * (.25 + .14 * p)} ${u * .38} ${u * .25} ${u * .45} C${u * (.25 - .14 * p)} ${u * .38} ${u * (.25 - .14 * p)} ${u * .25} ${u * .25} ${u * .1} Z`} fill={fg} />
      <path d={`M${u * .75} ${u * .6} C${u * (.75 + .14 * p)} ${u * .75} ${u * (.75 + .14 * p)} ${u * .88} ${u * .75} ${u * .95} C${u * (.75 - .14 * p)} ${u * .88} ${u * (.75 - .14 * p)} ${u * .75} ${u * .75} ${u * .6} Z`} fill={fg} /></>;
    if (kind === 'chevrons') motif = <path d={`M0 ${u * .7} L${u * .5} ${u * (.7 - .4 * p)} L${u} ${u * .7}`} fill="none" stroke={fg} strokeWidth={u * .13} strokeLinejoin="round" />;
    if (kind === 'arcs') motif = <>{[.42, .3, .18].map((r, i) => <path key={i} d={`M${u * (.5 - r)} ${u} A${u * r} ${u * r} 0 0 1 ${u * (.5 + r)} ${u}`} fill="none" stroke={fg} strokeWidth={u * .06 * (0.8 + .2 * p)} />)}</>;
    return (
      <pattern id={id} width={u} height={u} patternUnits="userSpaceOnUse" patternTransform={`rotate(${angle}) translate(${drift[0]} ${drift[1]})`}>
        {bg && <rect width={u} height={u} fill={bg} />}
        {motif}
      </pattern>
    );
  };

// ---------------------------------------------------------------- the figure
export type GondProps = {
  d: string; fill: Col; k: string;
  pattern?: { kind: PatternKind; fg: Col; s?: number; angle?: number };
  bands?: Band[];
  life?: Life;
  outline?: number;           // black outline width
  inner?: Col | null;         // thin inner line colour (white by default)
  reveal?: number;            // 0..3: outline draws (0-1), colour fills (1-2), patterns grow inward (2-3)
  opacity?: number;
};
export const Gond: React.FC<GondProps> = ({ d, fill, k, pattern, bands = [], life = { t: 0 }, outline = 6, inner = C.white, reveal = 3, opacity = 1 }) => {
  const clip = `gc-${k}`, pat = `gp-${k}`;
  const t = life.t + (life.phase ?? 0) + (life.jitter ? life.jitter * Math.sin(life.t * 23 + (life.phase ?? 0) * 7) : 0);
  const pulse = life.pulse ?? 1;
  const draw = Math.min(1, Math.max(0, reveal)), fillA = Math.min(1, Math.max(0, reveal - 1)), grow = Math.min(1, Math.max(0, reveal - 2)) * (life.grow ?? 1);
  return (
    <g data-kind="graphic" data-id={k} opacity={opacity}>
      <defs>
        <clipPath id={clip}><path d={d} /></clipPath>
        {pattern && pattern.kind !== 'none' && <PatternDef id={pat} kind={pattern.kind} fg={pattern.fg} s={pattern.s} angle={pattern.angle} t={t} pulse={pulse} />}
      </defs>
      <path d={d} fill={fill} opacity={fillA} />
      {pattern && pattern.kind !== 'none' && <path d={d} fill={`url(#${pat})`} opacity={fillA * Math.min(1, grow * 1.5)} />}
      <ContourBands d={d} clip={clip} bands={bands} t={t} pulse={pulse} grow={grow} />
      {inner && <path d={d} fill="none" stroke={inner} strokeWidth={outline * 2.4} clipPath={`url(#${clip})`} opacity={fillA} />}
      {inner && <path d={d} fill="none" stroke={fill} strokeWidth={outline * 1.2} clipPath={`url(#${clip})`} opacity={fillA} />}
      <path d={d} fill="none" stroke={C.black} strokeWidth={outline} strokeLinejoin="round" pathLength={1} strokeDasharray={draw < 1 ? `${draw} 1` : undefined} />
    </g>
  );
};

// Contour bands: rings of pattern following the outline, from the edge inward. A ring at depth m with width w is
// the path's stroke masked to (stroke 2m+w) minus (stroke 2m-w), clipped to the shape. Dots and seeds are placed on
// the inset contour by sampling the path, so they can travel along it.
const ContourBands: React.FC<{ d: string; clip: string; bands: Band[]; t: number; pulse: number; grow: number }> = ({ d, clip, bands, t, pulse, grow }) => {
  let depth = 12;                                   // leave the inner white line clear
  return (
    <g clipPath={`url(#${clip})`}>
      {bands.map((b, i) => {
        const w = b.w * grow, m = depth + w / 2; depth += w;
        if (w < .5) return null;
        const id = `${clip}-r${i}`, gap = b.gap ?? (b.kind === 'dots' ? w * 1.6 : b.kind === 'seed' ? w * 1.5 : w * .55);
        const off = -t * (b.speed ?? 16);
        let el: React.ReactNode = null;
        if (b.kind === 'solid') el = <path d={d} fill="none" stroke={b.color} strokeWidth={2 * m + w} />;
        else if (b.kind === 'dash' || b.kind === 'ticks') el = <path d={d} fill="none" stroke={b.color} strokeWidth={2 * m + w} strokeDasharray={`${(b.kind === 'ticks' ? 2 : 3.4) * pulse} ${gap}`} strokeDashoffset={off} />;
        const ring = b.kind === 'dots' || b.kind === 'seed';
        return (
          <g key={i}>
            {!ring && <defs>
              <mask id={id} maskUnits="userSpaceOnUse" x={-4000} y={-4000} width={9000} height={9000}>
                <path d={d} fill="none" stroke="#fff" strokeWidth={2 * m + w} />
                <path d={d} fill="none" stroke="#000" strokeWidth={Math.max(0, 2 * m - w)} />
              </mask>
            </defs>}
            {ring
              ? <RingDots d={d} m={m} w={w} gap={gap} off={off} color={b.color} pulse={pulse} seed={b.kind === 'seed'} />
              : <g mask={`url(#${id})`}>{el}</g>}
          </g>
        );
      })}
    </g>
  );
};

// Dots on an inset contour: sample the outline, offset each sample inward by m along the normal (inside = where
// the shape's clip keeps it), and place dots; `off` makes them travel along the line.
const RingDots: React.FC<{ d: string; m: number; w: number; gap: number; off: number; color: Col; pulse: number; seed: boolean }> = ({ d, m, w, gap, off, color, pulse, seed }) => {
  const pts = samplePath(d, gap, off);
  const r = w * .3 * pulse;
  return <>{pts.map(([x, y, nx, ny, ang], i) => {
    const cx = x + nx * m, cy = y + ny * m;
    return seed
      ? <path key={i} d={`M${cx} ${cy - r * 1.6} C${cx + r} ${cy - r * .4} ${cx + r} ${cy + r * .8} ${cx} ${cy + r * 1.3} C${cx - r} ${cy + r * .8} ${cx - r} ${cy - r * .4} ${cx} ${cy - r * 1.6} Z`} fill={color} transform={`rotate(${ang} ${cx} ${cy})`} />
      : <circle key={i} cx={cx} cy={cy} r={r} fill={color} />;
  })}</>;
};

// ---------------------------------------------------------------- path sampling (browser: SVGPathElement)
const cache = new Map<string, { len: number; el: SVGPathElement; ccw: boolean }>();
function pathInfo(d: string) {
  let c = cache.get(d);
  if (!c && typeof document !== 'undefined') {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    el.setAttribute('d', d);
    const len = el.getTotalLength();
    // signed area from samples to know which normal points inward
    let a = 0; const n = 64;
    let prev = el.getPointAtLength(0);
    for (let i = 1; i <= n; i++) { const p = el.getPointAtLength(len * i / n); a += prev.x * p.y - p.x * prev.y; prev = p; }
    c = { len, el, ccw: a < 0 };
    cache.set(d, c);
  }
  return c;
}
export function samplePath(d: string, step: number, off = 0): [number, number, number, number, number][] {
  const c = pathInfo(d);
  if (!c || !isFinite(c.len) || c.len <= 0) return [];
  const out: [number, number, number, number, number][] = [];
  const n = Math.max(1, Math.floor(c.len / step)), s = c.len / n, o = ((-off % s) + s) % s;
  for (let i = 0; i < n; i++) {
    const l = (o + i * s) % c.len;
    const p = c.el.getPointAtLength(l), q = c.el.getPointAtLength(Math.min(c.len, l + .5));
    let tx = q.x - p.x, ty = q.y - p.y; const m = Math.hypot(tx, ty) || 1; tx /= m; ty /= m;
    // inward normal: for a clockwise path in screen coords (y down) it is (-ty, tx)
    const nx = c.ccw ? ty : -ty, ny = c.ccw ? -tx : tx;
    out.push([p.x, p.y, nx, ny, Math.atan2(ty, tx) * 180 / Math.PI + 90]);
  }
  return out;
}
export const pathLength = (d: string) => pathInfo(d)?.len ?? 0;
