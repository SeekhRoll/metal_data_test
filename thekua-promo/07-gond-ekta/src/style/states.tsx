import React from 'react';
import { Life } from './gond';
import { C } from './palette';

// Emotion through pattern (brief §3.3). Every Gond figure takes a Life; these build it for each state.
//   idle   patterns drift gently, each bird on its own phase
//   panic  patterns jitter out of sync (fast, irregular, per-bird phases)
//   unity  one shared pulse and one shared drift for every bird: the dots march in lockstep
//   bloom  the pattern swells outward once, with a burst of motifs around the figure
export type Mood = 'idle' | 'panic' | 'unity' | 'bloom';
export function lifeFor(mood: Mood, t: number, phase: number, k = 0): Life {
  if (mood === 'panic') return { t: t * 2.6 + phase * 5, phase: 0, jitter: .5, pulse: 1 + .22 * Math.sin(t * 17 + phase * 9) * Math.sin(t * 5.3 + phase) };
  if (mood === 'unity') return { t: t * 1.2, phase: 0, pulse: 1 + .28 * Math.pow(Math.max(0, Math.sin(t * Math.PI * 2 * .9)), 2) };
  if (mood === 'bloom') return { t: t + phase, phase: 0, pulse: 1 + .6 * Math.sin(Math.min(1, k) * Math.PI) };
  return { t: t + phase * 3, phase: 0, pulse: 1 + .08 * Math.sin(t * 2.2 + phase * 4) };
}
// blend two moods' lives (for smooth transitions)
export function mixLife(a: Life, b: Life, k: number): Life {
  const m = (x = 0, y = 0) => x + (y - x) * k;
  return { t: m(a.t, b.t), phase: 0, jitter: m(a.jitter ?? 0, b.jitter ?? 0), pulse: m(a.pulse ?? 1, b.pulse ?? 1) };
}

// the joy burst: motifs flying outward from a point and fading (k: 0..1)
export const Bloom: React.FC<{ x: number; y: number; k: number; r?: number; n?: number; seed?: number }> = ({ x, y, k, r = 220, n = 16, seed = 0 }) => {
  if (k <= 0 || k >= 1) return null;
  const e = 1 - Math.pow(1 - k, 3), cols = [C.magenta, C.yellow, C.turquoise, C.vermilion, C.lime, C.cobalt];
  return (
    <g opacity={1 - Math.pow(k, 2)} data-kind="graphic">
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2 + seed, d = r * e * (0.75 + .25 * ((i * 7) % 3) / 2);
        const cx = x + Math.cos(a) * d, cy = y + Math.sin(a) * d, s = 1 - k * .4;
        return i % 2
          ? <circle key={i} cx={cx} cy={cy} r={15 * s} fill={cols[i % cols.length]} stroke={C.black} strokeWidth={3} />
          : <path key={i} transform={`translate(${cx} ${cy}) rotate(${a * 180 / Math.PI + 90}) scale(${s * 1.7})`} d="M0 -20 C10 -6 10 8 0 14 C-10 8 -10 -6 0 -20 Z" fill={cols[i % cols.length]} stroke={C.black} strokeWidth={3} />;
      })}
    </g>
  );
};

// wing drawing for a frame: replacement animation on twos, cycle up, half, level, down, level, half
const CYCLE = [0, 1, 2, 3, 2, 1];
export const wingAt = (frame: number, offset = 0, hold = 2) => CYCLE[Math.floor((frame + offset) / hold) % CYCLE.length];
