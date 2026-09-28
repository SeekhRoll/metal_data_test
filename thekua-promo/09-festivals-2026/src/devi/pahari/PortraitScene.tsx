import React from 'react';
import { P, PAGE } from '../../styles/pahari/palette';
import { ridge, Sky, Hill, RoundTree, Cypress, River, Marigold, HillTemple, SnowPeaks } from '../../styles/pahari/scenery';
import { S } from '../../styles/pahari/paint';
import { rng } from '../../styles/pahari/rand';

// The shared Pahari landscape behind a Devi portrait: sky band, three hill layers (for parallax), trees,
// a river, a flowering foreground. `pan` shifts the layers at different rates.
export const Landscape: React.FC<{ t: number; pan?: number; ground?: number; peaks?: boolean }> = ({ t, pan = 0, ground = 1170, peaks = false }) => {
  const w = PAGE.win, sway = Math.sin(t * .8);
  return (
    <g>
      <Sky x={w.x} y={w.y} w={w.w} h={ground - 330 - w.y} horizon={.9} />
      {peaks && <g transform={`translate(${pan * .05} 0)`}><SnowPeaks x={w.x - 40} w={w.w + 80} base={ground - 380} h={330} seed={2} id="peaks" /></g>}
      <g transform={`translate(${pan * .1} 0)`}>
        <Hill x={w.x - 60} w={w.w + 120} base={ground - 420} amp={120} bottom={ground} seed={31} fill="#C4C7A2" line="#9EA283" n={3} id="hill-farthest" />
        {!peaks && <HillTemple x={w.x + 760} y={onRidge(w.x - 60, w.w + 120, ground - 420, 120, 31, 3, w.x + 760) + 6} s={.32} id="temple" />}
      </g>
      <g transform={`translate(${pan * .2} 0)`}>
        <Hill x={w.x - 60} w={w.w + 120} base={ground - 330} amp={70} bottom={ground} seed={3} fill={P.hillFar} line="#8E9A6C" tufts={26} tuftColor="#7E906A" id="hill-far" />
      </g>
      <g transform={`translate(${pan * .5} 0)`}>
        <Hill x={w.x - 60} w={w.w + 120} base={ground - 200} amp={90} bottom={ground} seed={11} fill={P.hillMid} tufts={34} id="hill-mid" n={4} />
        <Cypress x={w.x + 120} y={ground - 190} h={150} seed={4} />
        <Cypress x={w.x + 820} y={ground - 170} h={130} seed={5} />
      </g>
      <River x={w.x} y={ground - 90} w={w.w} h={60} t={t} id="river" />
      <rect x={w.x} y={ground - 30} width={w.w} height={w.y + w.h - ground + 30} fill={P.ground} />
      <path d={`M${w.x} ${ground - 30} H${w.x + w.w}`} stroke={P.hillDark} strokeWidth={1.4} />
      <g transform={`translate(${pan} 0)`}>
        <RoundTree x={w.x + 70} y={ground + 40} h={420} seed={21} sway={sway} flowers="#D9707C" id="tree-l" />
        <RoundTree x={w.x + w.w - 60} y={ground + 60} h={380} seed={22} sway={-sway} id="tree-r" />
      </g>
      <Flowers y0={ground} y1={w.y + w.h} seed={5} />
    </g>
  );
};

// foreground meadow: tufts and small flowers, drawn individually
const Flowers: React.FC<{ y0: number; y1: number; seed: number }> = ({ y0, y1, seed }) => {
  const r = rng(seed), w = PAGE.win, out: React.ReactNode[] = [];
  for (let i = 0; i < 70; i++) {
    const x = w.x + 10 + r() * (w.w - 20), y = y0 + 20 + r() * (y1 - y0 - 30);
    if (r() < .5) out.push(<S key={i} d={`M${x - 5} ${y} Q${x - 3} ${y - 9} ${x} ${y - 12} M${x} ${y} L${x} ${y - 14} M${x + 5} ${y} Q${x + 3} ${y - 9} ${x} ${y - 12}`} stroke={P.hillDark} sw={1.1} />);
    else out.push(<g key={i}><S d={`M${x} ${y} L${x} ${y - 10}`} stroke={P.hillDark} sw={1} />{[0, 1, 2, 3, 4].map((k) => { const a = k / 5 * Math.PI * 2; return <circle key={k} cx={x + Math.cos(a) * 2.6} cy={y - 12 + Math.sin(a) * 2.6} r={1.9} fill={r() < .5 ? P.white : '#E0747F'} />; })}</g>);
  }
  return <g data-kind="graphic" data-id="meadow">{out}</g>;
};

// marigold petals drifting down (idle life / blessing)
export type Rect = { x: number; y: number; w: number; h: number };
export const Petals: React.FC<{ t: number; n?: number; seed?: number; from?: number; avoid?: Rect[] }> = ({ t, n = 26, seed = 9, from = 0, avoid = [] }) => {
  const r = rng(seed), w = PAGE.win, out: React.ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const x0 = w.x + r() * w.w, sp = 70 + r() * 60, ph = r() * 20, dt = t - from;
    if (dt < 0) continue;
    const y = w.y - 30 + ((dt * sp + ph * 90) % (w.h + 60)), x = x0 + 30 * Math.sin(dt * 1.3 + ph);
    const pr = 5 + r() * 4;
    // petals never drift into a text zone (24 px padding + the petal itself)
    if (avoid.some((z) => x > z.x - 36 && x < z.x + z.w + 36 && y > z.y - 36 && y < z.y + z.h + 36)) continue;
    out.push(<g key={i} data-kind="graphic" data-id="petal"><Marigold x={x} y={y} r={pr} rot={dt * 60 + ph * 20} /></g>);
  }
  return <g data-id="petals">{out}</g>;
};

function onRidge(x: number, w: number, base: number, amp: number, seed: number, n: number, at: number) {
  const pts = ridge(x, w, base, amp, seed, n);
  let best = pts[0];
  for (const p of pts) if (Math.abs(p[0] - at) < Math.abs(best[0] - at)) best = p;
  return best[1];
}
