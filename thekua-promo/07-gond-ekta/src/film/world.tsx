import React from 'react';
import { Gond, Life } from '../style/gond';
import { C } from '../style/palette';
import { tube, leafPath } from '../style/geom';
import { Pigeon, FLOCK } from '../chars/pigeon';
import { wingAt } from '../style/states';
import { boids } from './boids';
import { GROUND_Y } from './choreo';

// ---------------------------------------------------------------- a small Gond tree for the forest row
const TREE_COLS = [[C.leaf, C.lime], [C.turquoise, C.sky], [C.marigold, C.yellow], [C.leaf, C.yellow], [C.magenta, C.yellow]];
export const SmallTree: React.FC<{ k: string; x: number; y: number; s?: number; v?: number; life: Life }> = ({ k, x, y, s = 1, v = 0, life }) => {
  const [a, b] = TREE_COLS[v % TREE_COLS.length];
  const crown = v % 2 ? 'M0 -150 C70 -150 110 -110 110 -60 C110 -10 70 20 0 20 C-70 20 -110 -10 -110 -60 C-110 -110 -70 -150 0 -150 Z'
    : 'M0 -200 C40 -150 100 -80 100 -30 C100 10 60 26 0 26 C-60 26 -100 10 -100 -30 C-100 -80 -40 -150 0 -200 Z';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Gond k={k + '-tr'} d={tube([[0, 120, 40], [0, 0, 30], [0, -40, 26]])} fill={C.brown} bands={[{ w: 8, kind: 'dash', color: C.yellow, gap: 9, speed: 20 }]} life={life} outline={5} inner={null} />
      <g transform="translate(0 -40)">
        <Gond k={k + '-cr'} d={crown} fill={a} pattern={{ kind: v % 3 === 0 ? 'seeds' : v % 3 === 1 ? 'dots' : 'chevrons', fg: b, s: .8, angle: v * 20 }} bands={[{ w: 12, kind: 'solid', color: b }, { w: 10, kind: 'dash', color: C.black }]} life={{ ...life, phase: v * .7 }} outline={6} />
      </g>
    </g>
  );
};
export const Forest: React.FC<{ t: number; dx?: number; dy?: number }> = ({ t, dx = 0, dy = 0 }) => (
  <g transform={`translate(${dx} ${dy})`} data-id="forest">
    {Array.from({ length: 12 }, (_, i) => <SmallTree key={i} k={'ft' + i} x={-200 + i * 170 + (i % 2) * 20} y={1360 + (i % 3) * 40} s={.9 + (i % 3) * .15} v={i} life={{ t }} />)}
  </g>
);

// ---------------------------------------------------------------- the ground strip and small tufts
export const Ground: React.FC<{ t: number; dy?: number; night?: number }> = ({ t, dy = 0 }) => (
  <g transform={`translate(0 ${dy})`}>
    <Gond k="ground" d={`M-40 ${GROUND_Y} C200 ${GROUND_Y - 12} 800 ${GROUND_Y - 10} 1120 ${GROUND_Y} L1120 ${GROUND_Y + 200} L-40 ${GROUND_Y + 200} Z`} fill={C.brown} bands={[{ w: 12, kind: 'solid', color: C.marigold }, { w: 12, kind: 'dots', color: C.yellow, gap: 22, speed: 6 }, { w: 14, kind: 'dash', color: C.black, gap: 14, speed: 6 }]} life={{ t }} outline={6} />
    {[80, 900, 1010].map((x, i) => <g key={i} transform={`translate(${x} ${GROUND_Y + 4})`}>{[-30, 0, 30].map((a, j) => <g key={j} transform={`rotate(${a - 90 + 6 * Math.sin(t * 2 + i + j)})`}><Gond k={`tuft${i}-${j}`} d={leafPath(70, 14)} fill={[C.leaf, C.lime, C.turquoise][j]} outline={4} inner={null} life={{ t }} /></g>)}</g>)}
  </g>
);
export const Bush: React.FC<{ t: number; x: number; y: number; s?: number; dy?: number }> = ({ t, x, y, s = 1, dy = 0 }) => (
  <g transform={`translate(${x} ${y + dy}) scale(${s})`}>
    {[[-80, -40, -100], [0, -80, -80], [80, -40, -60], [-40, -10, 200], [40, -10, 230]].map(([dx, dyy, a], i) => (
      <g key={i} transform={`translate(${dx} ${dyy}) rotate(${a + 4 * Math.sin(t * 1.7 + i)})`}>
        <Gond k={'bush' + i} d={leafPath(170, 60)} fill={[C.leaf, C.lime, C.turquoise, C.leaf, C.lime][i]} pattern={{ kind: 'dashes', fg: C.yellow, s: .6, angle: 90 }} bands={[{ w: 8, kind: 'dots', color: C.white, gap: 14 }]} life={{ t, phase: i }} outline={5} />
      </g>
    ))}
  </g>
);
export const Burrow: React.FC<{ t: number; x: number; y: number }> = ({ t, x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <Gond k="mound" d="M-200 0 C-180 -120 -80 -190 20 -190 C130 -190 210 -110 220 0 Z" fill={C.marigold} pattern={{ kind: 'arcs', fg: C.brown, s: .8 }} bands={[{ w: 14, kind: 'solid', color: C.vermilion }, { w: 12, kind: 'dots', color: C.yellow, gap: 18 }]} life={{ t }} outline={6} />
    <Gond k="hole" d="M-70 0 C-66 -70 -20 -96 20 -96 C60 -96 96 -66 96 0 Z" fill={C.night} bands={[{ w: 8, kind: 'dash', color: C.brown, gap: 10 }]} life={{ t }} outline={5} inner={null} />
  </g>
);

// ---------------------------------------------------------------- scattered grain: glowing dots
export const GRAIN: [number, number][] = Array.from({ length: 34 }, (_, i) => [200 + ((i * 97) % 560), GROUND_Y - 6 - ((i * 37) % 22)]);
export const Grain: React.FC<{ t: number; from: [number, number]; t0: number; eaten?: number; dy?: number }> = ({ t, from, t0, eaten = 0, dy = 0 }) => (
  <g data-kind="graphic" data-id="grain" transform={`translate(0 ${dy})`}>
    {GRAIN.map(([gx, gy], i) => {
      const u = (t - t0 - i * .045) / .7;
      if (u < 0 || i < eaten) return null;
      const k = Math.min(1, u), x = from[0] + (gx - from[0]) * k, y = from[1] + (gy - from[1]) * k - Math.sin(k * Math.PI) * 120;
      const glow = u > 1 ? .5 + .5 * Math.sin(t * 4 + i) : 1;
      return <g key={i}><circle cx={x} cy={y} r={14} fill={C.yellow} opacity={.35 * glow} /><circle cx={x} cy={y} r={7} fill={C.yellow} stroke={C.black} strokeWidth={2.5} /></g>;
    })}
  </g>
);

// ---------------------------------------------------------------- far background flock (boids)
const farFlock = boids('far', 14, 4, 36, (t) => [200 + (t - 4) * 70 % 1400 - 100, 330 + 60 * Math.sin(t * .6)], 3);
export const FarBirds: React.FC<{ t: number; dy?: number; op?: number }> = ({ t, dy = 0, op = .85 }) => (
  <g opacity={op} data-id="farbirds">
    {farFlock(t).map((b, i) => <Pigeon key={i} look={FLOCK[i % 6].look} k={'fb' + i} x={b.x} y={b.y + dy} s={.2} flip={b.vx < 0} rot={Math.atan2(b.vy, Math.abs(b.vx)) * 40} wing={wingAt(Math.round(t * 24), i * 2)} life={{ t, phase: i }} />)}
  </g>
);
