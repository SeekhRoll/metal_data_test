import React from 'react';
import { C } from '../style/palette';
import { seg, easeInOut, clamp01 } from '../style/motion';
import { BEAT, freeTime } from './timeline';
import { birdAt, N, GROUND_Y, scaleOf } from './choreo';

// The hunter's net (brief §3.3): a deformable mesh grid with spring physics. Every knot is a damped mass pulled
// toward a target that depends on the story (hanging hidden from the pole, draped over the flock and pinned to the
// ground, lifted and hanging taut below the flying birds, draped again, chewed free), and tied to its neighbours
// by distance constraints so the whole grid sags, ripples and stretches as one cloth.
// Simulated once from t = 15 at 120 Hz and cached, so any frame renders on its own.
export const NX = 18, NY = 10;
const DX = 38, DY = 28, T0 = 15.0, T1 = 45, HZ = 120;
const POLE = { x0: 120, x1: 830, y: 860 };

type V = [number, number];
function bodyTop(x: number, t: number): number {
  let top = GROUND_Y;
  for (let i = 0; i < N; i++) {
    const b = birdAt(i, t);
    if (b.vis <= 0 || (t > BEAT.arrive && t >= freeTime(i))) continue;
    const s = scaleOf(i), half = 210 * s, dx = Math.abs(x - (b.x - 20 * s));
    if (dx < half) top = Math.min(top, b.y - 150 * s * Math.sqrt(1 - (dx / half) ** 2) - 16);
  }
  return top;
}
// which bird holds the net in the air above a given x (lift), and whether a column has been chewed free
const freedAt = (i: number) => freeTime(i);
function columnFree(x: number, t: number): boolean {
  if (t < BEAT.chew0) return false;
  for (let i = 0; i < N; i++) { const b = birdAt(i, Math.min(t, freedAt(i) - .01)); if (t >= freedAt(i) && Math.abs(x - b.x) < 150 * scaleOf(i)) return true; }
  return false;
}

function target(ix: number, iy: number, t: number): { p: V; k: number } {
  const v = iy / (NY - 1);
  if (t < BEAT.drop) {
    // hidden: hanging from the pole in a soft curtain
    const x = POLE.x0 + 16 + ix * DX, sag = 18 * Math.sin((ix / (NX - 1)) * Math.PI);
    return { p: [x, POLE.y + 8 + iy * DY * .9 + sag * v], k: 40 };
  }
  if (t < BEAT.lift) {
    // dropped: draped over the birds, the lowest row pinned to the ground
    const x = POLE.x0 + 30 + ix * (DX * .98), top = bodyTop(x, t);
    return { p: [x, top + (GROUND_Y - top) * v], k: t < BEAT.drop + .5 ? 22 : 60 };
  }
  if (t < BEAT.arrive + .6) {
    // lifted: the top row hangs from the flock, the rest hangs taut below it
    let sx = 0, sy = 0, n = 0;
    for (let i = 0; i < N; i++) { const b = birdAt(i, t); sx += b.x; sy += b.y; n++; }
    const cx = sx / n, cy = sy / n + 28;
    const x = cx + (ix - (NX - 1) / 2) * DX * .82;
    const lift = easeInOut(seg(t, BEAT.lift, BEAT.lift + .8));
    const hang: V = [x, cy + iy * DY + 12 * Math.sin(t * 5 + ix * .5) * v];
    const x0 = POLE.x0 + 30 + ix * (DX * .98), top = bodyTop(x0, BEAT.lift - .01);
    const lying: V = [x0, top + (GROUND_Y - top) * v];
    return { p: [lying[0] + (hang[0] - lying[0]) * lift, lying[1] + (hang[1] - lying[1]) * lift], k: 30 };
  }
  // at the burrow: draped again; columns fall limp to the ground once chewed through
  const x = 60 + ix * DX * 1.02;
  if (columnFree(x, t) || t > BEAT.king + .1) return { p: [x + (v - .5) * 30, GROUND_Y - 4 - (1 - v) * 6], k: 14 };
  const top = bodyTop(x, t);
  return { p: [x, top + (GROUND_Y - top) * v], k: 50 };
}

let cache: Float32Array | null = null;
function simulate() {
  const n = NX * NY, steps = Math.ceil((T1 - T0) * HZ) + 2, dt = 1 / HZ;
  const out = new Float32Array(steps * n * 2);
  const pos: V[] = [], vel: V[] = [];
  for (let iy = 0; iy < NY; iy++) for (let ix = 0; ix < NX; ix++) { pos.push(target(ix, iy, T0).p); vel.push([0, 0]); }
  for (let s = 0; s < steps; s++) {
    const t = T0 + s * dt;
    for (let iy = 0; iy < NY; iy++) for (let ix = 0; ix < NX; ix++) {
      const j = iy * NX + ix, tg = target(ix, iy, t), p = pos[j], v = vel[j];
      const damp = 2 * Math.sqrt(tg.k) * .55;
      v[0] += ((tg.p[0] - p[0]) * tg.k - v[0] * damp) * dt;
      v[1] += ((tg.p[1] - p[1]) * tg.k - v[1] * damp + (t > BEAT.drop && t < BEAT.drop + .6 ? 900 : 0)) * dt;
      p[0] += v[0] * dt; p[1] += v[1] * dt;
      if (p[1] > GROUND_Y) { p[1] = GROUND_Y; v[1] *= -.2; v[0] *= .7; }
    }
    // neighbours keep the grid together (a little give: 20% stretch)
    for (let it = 0; it < 2; it++) for (let iy = 0; iy < NY; iy++) for (let ix = 0; ix < NX; ix++) {
      const j = iy * NX + ix;
      for (const [nx, ny, rest] of [[ix + 1, iy, DX], [ix, iy + 1, DY]] as [number, number, number][]) {
        if (nx >= NX || ny >= NY) continue;
        const q = ny * NX + nx, a = pos[j], b = pos[q];
        const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, max = rest * 1.2;
        if (d > max) { const c = (d - max) / d * .5; a[0] += dx * c; a[1] += dy * c; b[0] -= dx * c; b[1] -= dy * c; }
      }
    }
    for (let j = 0; j < n; j++) { out[(s * n + j) * 2] = pos[j][0]; out[(s * n + j) * 2 + 1] = pos[j][1]; }
  }
  return out;
}
export function netAt(t: number): V[] {
  if (!cache) cache = simulate();
  const n = NX * NY, x = clamp01((t - T0) / (T1 - T0)) * (T1 - T0) * HZ, s = Math.min(Math.floor(x), cache.length / (n * 2) - 2), u = x - s;
  const out: V[] = [];
  for (let j = 0; j < n; j++) {
    const a = (s * n + j) * 2, b = ((s + 1) * n + j) * 2;
    out.push([cache[a] + (cache[b] - cache[a]) * u, cache[a + 1] + (cache[b + 1] - cache[a + 1]) * u]);
  }
  return out;
}

// drawing: fine black cords with small knots; hidden (camouflaged) until it drops
export const Net: React.FC<{ t: number; dy?: number }> = ({ t, dy = 0 }) => {
  if (t < BEAT.netUp || t > BEAT.perch) return null;
  const P = netAt(t), at = (ix: number, iy: number) => P[iy * NX + ix];
  const appear = easeInOut(seg(t, BEAT.netUp, BEAT.netUp + 1.2));
  const hidden = t < BEAT.drop ? .45 : 1, fade = 1 - seg(t, BEAT.king + .4, BEAT.perch);
  const cut = (x: number) => columnFree(x, t);
  let d = '';
  for (let iy = 0; iy < NY; iy++) for (let ix = 0; ix < NX - 1; ix++) {
    const a = at(ix, iy), b = at(ix + 1, iy);
    if (t > BEAT.arrive + .6 && (cut(a[0]) || cut(b[0]))) continue;
    d += `M${a[0].toFixed(1)} ${(a[1] + dy).toFixed(1)} L${b[0].toFixed(1)} ${(b[1] + dy).toFixed(1)} `;
  }
  for (let ix = 0; ix < NX; ix++) for (let iy = 0; iy < NY - 1; iy++) {
    const a = at(ix, iy), b = at(ix, iy + 1);
    d += `M${a[0].toFixed(1)} ${(a[1] + dy).toFixed(1)} L${b[0].toFixed(1)} ${(b[1] + dy).toFixed(1)} `;
  }
  const len = appear;
  return (
    <g data-kind="graphic" data-id="net" opacity={hidden * fade}>
      <path d={d} fill="none" stroke={C.black} strokeWidth={3.2} strokeLinecap="round" pathLength={1} strokeDasharray={len < 1 ? `${len} 1` : undefined} />
      <path d={d} fill="none" stroke={C.white} strokeWidth={1} opacity={.5} />
      {appear >= 1 && P.map(([x, y], j) => j % 2 === 0 && <circle key={j} cx={x} cy={y + dy} r={3.2} fill={C.yellow} stroke={C.black} strokeWidth={1.5} />)}
    </g>
  );
};
export const Pole: React.FC<{ t: number; dy?: number }> = ({ t, dy = 0 }) => {
  if (t < BEAT.netUp - .2 || t > BEAT.arrive) return null;
  const a = easeInOut(seg(t, BEAT.netUp - .2, BEAT.netUp + .6));
  return (
    <g data-kind="graphic" data-id="poles" opacity={a} transform={`translate(0 ${dy})`}>
      {[POLE.x0, POLE.x1].map(x => <g key={x}><rect x={x - 9} y={POLE.y - 20} width={18} height={GROUND_Y - POLE.y + 20} fill={C.brown} stroke={C.black} strokeWidth={4} /><path d={`M${x} ${POLE.y} V${GROUND_Y}`} stroke={C.yellow} strokeWidth={4} strokeDasharray="2 12" /></g>)}
      <rect x={POLE.x0 - 16} y={POLE.y - 12} width={POLE.x1 - POLE.x0 + 32} height={16} rx={8} fill={C.brown} stroke={C.black} strokeWidth={4} opacity={t < BEAT.drop ? 1 : 1} />
    </g>
  );
};
