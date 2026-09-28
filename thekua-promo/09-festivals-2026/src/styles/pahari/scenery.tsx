import React from 'react';
import { P } from './palette';
import { S, Gold, ellipse, circle } from './paint';
import { rng } from './rand';

// ---------------------------------------------------------------- sky: flat bands (no gradients), gold horizon, rolled clouds
export const Sky: React.FC<{ x: number; y: number; w: number; h: number; horizon?: number; top?: string; pale?: string; gold?: string }> = ({ x, y, w, h, horizon = .82, top = P.skyTop, pale = P.skyPale, gold = P.horizon }) => {
  const hy = y + h * horizon;
  return (
    <g data-kind="surface" data-id="sky">
      <rect x={x} y={y} width={w} height={h} fill={pale} />
      <path d={`M${x} ${y}H${x + w}V${y + h * .2} C${x + w * .75} ${y + h * .26} ${x + w * .3} ${y + h * .17} ${x} ${y + h * .24}Z`} fill={top} />
      {/* rolled cloud edge along the blue band */}
      <path d={cloudEdge(x, y + h * .2, w, 14)} fill={P.white} stroke={P.ink} strokeWidth={1} opacity={.9} />
      <rect x={x} y={hy - h * .05} width={w} height={h * .05} fill={gold} opacity={.8} />
      <path d={`M${x} ${hy - h * .05} H${x + w}`} stroke="#E7B95A" strokeWidth={1.4} opacity={.8} />
    </g>
  );
};
function cloudEdge(x: number, y: number, w: number, r: number) {
  let d = `M${x} ${y + 6}`;
  const n = Math.round(w / (r * 2.2));
  for (let i = 0; i < n; i++) { const cx = x + (i + .5) * w / n; d += ` Q${cx} ${y + 6 + r * (i % 2 ? 1.2 : 1.7)} ${x + (i + 1) * w / n} ${y + 6}`; }
  return d + ` L${x + w} ${y - 4} L${x} ${y - 4} Z`;
}

// ---------------------------------------------------------------- rolling hills: flat layers, darker ridge line, tufts of small trees
export function ridge(x: number, w: number, base: number, amp: number, seed: number, n = 5) {
  const r = rng(seed), ph = [r() * 6, r() * 6, r() * 6];
  const pts: [number, number][] = [];
  for (let i = 0; i <= 60; i++) {
    const u = i / 60, X = x + u * w;
    const Y = base - amp * (.55 + .45 * Math.sin(u * n + ph[0])) - amp * .35 * Math.sin(u * n * 2.3 + ph[1]) - amp * .15 * Math.sin(u * 13 + ph[2]);
    pts.push([X, Y]);
  }
  return pts;
}
const toPath = (pts: [number, number][]) => 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L');

export const Hill: React.FC<{ x: number; w: number; base: number; amp: number; bottom: number; seed: number; fill: string; line?: string; tufts?: number; tuftColor?: string; n?: number; id?: string }> = ({ x, w, base, amp, bottom, seed, fill, line = P.hillDark, tufts = 0, tuftColor = P.canopy, n = 5, id }) => {
  const pts = ridge(x, w, base, amp, seed, n);
  const r = rng(seed + 9);
  const tf: React.ReactNode[] = [];
  for (let i = 0; i < tufts; i++) {
    const p = pts[Math.floor(r() * pts.length)], s = 5 + r() * 7;
    tf.push(<S key={i} d={`M${p[0] - s * .9} ${p[1] + 2} C${p[0] - s} ${p[1] - s * 1.6} ${p[0] + s} ${p[1] - s * 1.6} ${p[0] + s * .9} ${p[1] + 2}Z`} fill={tuftColor} stroke={P.ink} sw={.8} />);
  }
  return (
    <g data-kind="graphic" data-id={id}>
      <S d={toPath(pts) + ` L${x + w} ${bottom} L${x} ${bottom} Z`} fill={fill} stroke="none" />
      <S d={toPath(pts)} stroke={line} sw={1.6} />
      {tf}
    </g>
  );
};

// ---------------------------------------------------------------- the Kangra tree: slender trunk, rounded canopy, every leaf drawn
export const RoundTree: React.FC<{ x: number; y: number; h: number; seed: number; flowers?: string; canopy?: string; leaf?: string; sway?: number; id?: string }> = ({ x, y, h, seed, flowers, canopy = P.canopy, leaf = P.leaf, sway = 0, id }) => {
  const r = rng(seed);
  const rx = h * .3, ry = h * .34, cx = x + sway * h * .02, cy = y - h + ry;
  const leaves: React.ReactNode[] = [];
  const step = Math.max(7, h * .045);
  for (let yy = cy - ry; yy < cy + ry; yy += step * .8) {
    for (let xx = cx - rx; xx < cx + rx; xx += step) {
      const ox = xx + (Math.round((yy - cy) / step) % 2 ? step / 2 : 0) + (r() - .5) * 2;
      const dx = (ox - cx) / rx, dy = (yy - cy) / ry;
      if (dx * dx + dy * dy > .86) continue;
      const a = Math.atan2(dy, dx) * 180 / Math.PI + 90 + (r() - .5) * 30, L = step * .62;
      leaves.push(
        <g key={xx + '_' + yy} transform={`rotate(${a.toFixed(1)} ${ox.toFixed(1)} ${yy.toFixed(1)})`}>
          <path d={`M${ox} ${yy - L} Q${ox + L * .45} ${yy} ${ox} ${yy + L} Q${ox - L * .45} ${yy} ${ox} ${yy - L}Z`} fill={r() < .25 ? P.leafHi : leaf} />
          <path d={`M${ox} ${yy - L * .8} L${ox} ${yy + L * .8}`} stroke={canopy} strokeWidth={.7} />
        </g>,
      );
      if (flowers && r() < .12) leaves.push(<circle key={'f' + xx + '_' + yy} cx={ox + 2} cy={yy - 2} r={step * .22} fill={flowers} />);
    }
  }
  const tw = Math.max(4, h * .035);
  return (
    <g data-kind="graphic" data-id={id}>
      <S d={`M${x - tw} ${y} C${x - tw * .6} ${y - h * .3} ${cx - tw * .4} ${cy + ry * .4} ${cx - tw * .3} ${cy} L${cx + tw * .3} ${cy} C${cx + tw * .4} ${cy + ry * .4} ${x + tw * .6} ${y - h * .3} ${x + tw} ${y}Z`} fill={P.trunk} sw={1.2} />
      <S d={ellipse(cx, cy, rx, ry)} fill={canopy} sw={1.4} />
      {leaves}
    </g>
  );
};

// slim cypress, a Pahari garden staple
export const Cypress: React.FC<{ x: number; y: number; h: number; seed: number; id?: string }> = ({ x, y, h, seed, id }) => {
  const r = rng(seed), w = h * .12;
  const marks: React.ReactNode[] = [];
  for (let i = 0; i < 26; i++) { const t = r(), yy = y - h * .1 - t * h * .85, hw = w * Math.sin(Math.PI * (1 - t) * .95 + .1), xx = x + (r() - .5) * hw * 1.4; marks.push(<path key={i} d={`M${xx - 3} ${yy + 3} Q${xx} ${yy - 4} ${xx + 3} ${yy + 3}`} stroke={P.leafHi} strokeWidth={1.1} fill="none" />); }
  return (
    <g data-kind="graphic" data-id={id}>
      <S d={`M${x} ${y - h} C${x + w * 1.3} ${y - h * .6} ${x + w * 1.1} ${y - h * .15} ${x + w * .2} ${y - h * .08} L${x - w * .2} ${y - h * .08} C${x - w * 1.1} ${y - h * .15} ${x - w * 1.3} ${y - h * .6} ${x} ${y - h}Z`} fill="#27482A" sw={1.2} />
      {marks}
      <S d={`M${x - 3} ${y} L${x - 2} ${y - h * .09} L${x + 2} ${y - h * .09} L${x + 3} ${y}Z`} fill={P.trunk} sw={1} />
    </g>
  );
};

// ---------------------------------------------------------------- river: silvery flat band with Pahari basket-weave ripple lines
export const River: React.FC<{ x: number; y: number; w: number; h: number; t?: number; top?: string; id?: string }> = ({ x, y, w, h, t = 0, id }) => {
  const rows: React.ReactNode[] = [];
  const step = 16, sp = 24;
  for (let j = 0, yy = y + 8; yy < y + h - 4; yy += step, j++) {
    let d = '';
    const off = ((t * 14 + j * 11) % sp) - sp;
    for (let xx = x + off; xx < x + w; xx += sp) d += `M${xx.toFixed(1)} ${yy} q${sp / 4} -5 ${sp / 2} 0 `;
    rows.push(<path key={j} d={d} stroke={P.ripple} strokeWidth={1.1} fill="none" opacity={.85} />);
  }
  return (
    <g data-kind="graphic" data-id={id}>
      <clipPath id={'rc' + (id ?? '')}><rect x={x} y={y} width={w} height={h} /></clipPath>
      <rect x={x} y={y} width={w} height={h} fill={P.river} />
      <g clipPath={`url(#rc${id ?? ''})`}>{rows}</g>
      <path d={`M${x} ${y}H${x + w} M${x} ${y + h}H${x + w}`} stroke={P.ink} strokeWidth={1.2} />
    </g>
  );
};

// ---------------------------------------------------------------- Himachali hill temple (kath-kuni stone-and-timber walls, tiered slate roof)
export const HillTemple: React.FC<{ x: number; y: number; s?: number; id?: string }> = ({ x, y, s = 1, id }) => {
  const g = (d: string) => d;
  const courses: React.ReactNode[] = [];
  for (let i = 0; i < 7; i++) courses.push(<path key={i} d={`M${-70} ${-20 - i * 16}H70`} stroke={i % 2 ? P.wood : P.stone} strokeWidth={i % 2 ? 6 : 9} />);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} data-kind="graphic" data-id={id}>
      <S d={g('M-95 0 H95 V-18 H-95Z')} fill={P.stone} sw={1.5} />
      <S d="M-70 -18 H70 V-135 H-70Z" fill={P.stone} sw={1.5} />
      {courses}
      <S d="M-70 -18 H70 V-135 H-70Z" sw={1.5} />
      {/* doorway with a carved wooden frame (straight lintel, no arch) */}
      <S d="M-20 -18 V-86 H20 V-18Z" fill="#3A2416" sw={1.4} />
      <S d="M-28 -18 V-94 H28 V-18 M-20 -94 V-86 H20 V-94" fill="none" stroke={P.wood} sw={4} />
      <S d="M-100 -135 H100 L78 -170 H-78Z" fill={P.slate} sw={1.5} />
      <S d="M-86 -170 H86 L58 -212 H-58Z" fill={P.slate} sw={1.5} />
      {/* scalloped slate shingles */}
      {[-150, -190].map((yy, k) => <path key={k} d={Array.from({ length: 16 }, (_, i) => `M${-90 + k * 14 + i * (11 - k * 1.6)} ${yy} q3 5 6 0`).join(' ')} stroke="#4A4744" strokeWidth={1} fill="none" />)}
      {/* wooden balcony band */}
      <S d="M-80 -135 H80 V-122 H-80Z" fill={P.wood} sw={1.2} />
      {Array.from({ length: 11 }, (_, i) => <path key={i} d={`M${-75 + i * 15} -135 V-122`} stroke="#3A2416" strokeWidth={1} />)}
      <S d="M-58 -212 H58 L0 -250Z" fill="#8A4A2E" sw={1.4} />
      <Gold d="M-6 -250 H6 L4 -262 Q12 -268 0 -282 Q-12 -268 -4 -262Z" />
      <S d="M0 -282 V-300" stroke={P.goldDeep} sw={1.4} />
      <S d="M0 -300 L22 -293 L0 -286Z" fill={P.saffron} sw={1} />
    </g>
  );
};

// ---------------------------------------------------------------- Rajput-Pahari pavilion: flat roof, parapet, slender bracketed pillars (no arches, no domes)
export const Pavilion: React.FC<{ x: number; y: number; w?: number; h?: number; id?: string; curtain?: string }> = ({ x, y, w = 420, h = 340, id, curtain = P.red }) => {
  const cols = 4, pw = 10;
  return (
    <g transform={`translate(${x} ${y})`} data-kind="graphic" data-id={id}>
      <S d={`M${-w / 2 - 20} 0 H${w / 2 + 20} V-26 H${-w / 2 - 20}Z`} fill={P.white} sw={1.5} />
      <S d={`M${-w / 2 - 20} -26 H${w / 2 + 20}`} stroke={P.stone} sw={3} />
      <S d={`M${-w / 2} -26 H${w / 2} V${-h} H${-w / 2}Z`} fill="#E9E1CF" sw={1.4} />
      {/* back wall niche + rolled curtain */}
      <S d={`M${-w / 2 + 20} ${-h + 40} H${w / 2 - 20}`} stroke={curtain} sw={16} cap="butt" />
      <S d={`M${-w / 2 + 20} ${-h + 33} H${w / 2 - 20} M${-w / 2 + 20} ${-h + 48} H${w / 2 - 20}`} stroke={P.gold} sw={1.6} />
      {Array.from({ length: cols }, (_, i) => {
        const cx = -w / 2 + 8 + i * (w - 16) / (cols - 1);
        return (
          <g key={i}>
            <S d={`M${cx - pw / 2} -26 V${-h + 22} H${cx + pw / 2} V-26Z`} fill={P.white} sw={1.2} />
            {/* bracket capital */}
            <S d={`M${cx - pw / 2 - 12} ${-h + 22} H${cx + pw / 2 + 12} L${cx + pw / 2} ${-h + 36} H${cx - pw / 2}Z`} fill={P.white} sw={1.2} />
            <S d={`M${cx - pw / 2 - 3} -26 H${cx + pw / 2 + 3} V-40 H${cx - pw / 2 - 3}Z`} fill={P.stone} sw={1} />
          </g>
        );
      })}
      <S d={`M${-w / 2 - 16} ${-h} H${w / 2 + 16} V${-h - 16} H${-w / 2 - 16}Z`} fill={P.white} sw={1.4} />
      {/* parapet with small merlons */}
      {Array.from({ length: 14 }, (_, i) => { const cx = -w / 2 - 10 + i * (w + 20) / 13; return <S key={i} d={`M${cx - 7} ${-h - 16} V${-h - 30} H${cx + 7} V${-h - 16}`} fill={P.white} sw={1.1} />; })}
      <S d={`M${-w / 2} ${-h + 6} H${w / 2}`} stroke={P.gold} sw={2} />
      {/* carpet */}
      <S d={`M${-w / 2 + 16} -26 L${w / 2 - 16} -26 L${w / 2 - 30} -48 L${-w / 2 + 30} -48Z`} fill={P.red} sw={1.1} />
      <S d={`M${-w / 2 + 26} -30 L${w / 2 - 26} -30`} stroke={P.gold} sw={1.4} />
    </g>
  );
};

// ---------------------------------------------------------------- small props
export const Diya: React.FC<{ x: number; y: number; s?: number; flame?: number; glow?: number; id?: string }> = ({ x, y, s = 1, flame = 0, glow = 1, id }) => {
  const f = 1 + .06 * Math.sin(flame * 9) + .04 * Math.sin(flame * 17 + 1);
  const lean = 2.5 * Math.sin(flame * 5.3);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} data-kind="graphic" data-id={id}>
      <ellipse cx={0} cy={-58} rx={70} ry={80} fill="#FFD27A" opacity={.28 * glow} filter="url(#haloBloom)" />
      {/* brass diya: flared stand, shallow bowl, pinched spout */}
      <Gold d="M-26 40 H26 L18 30 Q8 24 6 10 H-6 Q-8 24 -18 30Z" />
      <Gold d="M-8 10 H8 V-2 H-8Z" />
      <Gold d="M-54 -14 Q-50 8 0 10 Q50 8 58 -14 Q66 -18 74 -24 Q56 -26 44 -18 Q0 -10 -54 -14Z" />
      <S d="M-50 -14 Q0 -6 50 -16" stroke={P.goldDeep} sw={1.2} />
      {[-30, -10, 10, 30].map((xx) => <circle key={xx} cx={xx} cy={-1} r={2} fill={P.goldDeep} />)}
      {/* flame */}
      <g transform={`translate(62 -26) rotate(${lean}) scale(1 ${f})`}>
        <path d="M0 0 C-12 -8 -8 -26 0 -46 C8 -26 12 -8 0 0Z" fill="#F7B733" />
        <path d="M0 -3 C-6 -8 -4 -18 0 -30 C4 -18 6 -8 0 -3Z" fill="#FFF3C4" />
        <path d="M0 0 C-12 -8 -8 -26 0 -46 C8 -26 12 -8 0 0Z" fill="none" stroke="#B5552A" strokeWidth={1} />
      </g>
    </g>
  );
};

export const Halo: React.FC<{ x: number; y: number; r: number; bloom?: number; id?: string }> = ({ x, y, r, bloom = 0, id }) => (
  <g data-kind="graphic" data-id={id}>
    {bloom > 0 && <circle cx={x} cy={y} r={r * (1.2 + .4 * bloom)} fill="#FFE39A" opacity={.55 * bloom} filter="url(#haloBloom)" />}
    <S d={circle(x, y, r)} fill="url(#goldFill)" stroke={P.goldDeep} sw={1.6} />
    <S d={circle(x, y, r * .9)} stroke={P.goldDeep} sw={.8} />
    {Array.from({ length: 48 }, (_, i) => { const a = i / 48 * Math.PI * 2; return <path key={i} d={`M${x + Math.cos(a) * r * .9} ${y + Math.sin(a) * r * .9} L${x + Math.cos(a) * r * .99} ${y + Math.sin(a) * r * .99}`} stroke={P.goldDeep} strokeWidth={.9} />; })}
  </g>
);

export const Marigold: React.FC<{ x: number; y: number; r?: number; rot?: number; c?: string }> = ({ x, y, r = 9, rot = 0, c = P.saffron }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    {Array.from({ length: 10 }, (_, i) => { const a = i / 10 * Math.PI * 2; return <circle key={i} cx={Math.cos(a) * r * .55} cy={Math.sin(a) * r * .55} r={r * .45} fill={c} stroke="#9A4B12" strokeWidth={.6} />; })}
    <circle r={r * .4} fill="#F2B232" />
  </g>
);

// ---------------------------------------------------------------- Himalayan snow peaks, Kangra-style: white caps with fine blue-grey ridge lines
export const SnowPeaks: React.FC<{ x: number; w: number; base: number; h: number; seed: number; id?: string }> = ({ x, w, base, h, seed, id }) => {
  const r = rng(seed), n = 5, out: React.ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const cx = x + (i + .5) * w / n + (r() - .5) * 60, ph = h * (.6 + r() * .4), hw = w / n * (.75 + r() * .3);
    const d = `M${cx - hw} ${base} L${cx - hw * .35} ${base - ph * .6} L${cx - hw * .1} ${base - ph * .85} L${cx} ${base - ph} L${cx + hw * .2} ${base - ph * .78} L${cx + hw * .45} ${base - ph * .55} L${cx + hw} ${base}Z`;
    out.push(<g key={i}>
      <S d={d} fill="#E9ECEA" stroke="#7C8A9A" sw={1.3} />
      <S d={`M${cx} ${base - ph} L${cx + hw * .08} ${base - ph * .6} L${cx - hw * .05} ${base - ph * .35} M${cx - hw * .1} ${base - ph * .85} L${cx - hw * .3} ${base - ph * .45}`} stroke="#9AA7B6" sw={1.1} />
      <S d={`M${cx} ${base - ph} L${cx + hw * .2} ${base - ph * .78} L${cx + hw * .45} ${base - ph * .55} L${cx + hw} ${base} L${cx + hw * .1} ${base} L${cx + hw * .05} ${base - ph * .6}Z`} fill="#C9D2D8" stroke="none" />
    </g>);
  }
  return <g data-kind="graphic" data-id={id}>{out}</g>;
};
