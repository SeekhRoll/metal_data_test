// Motion helpers (brief §3.4): eased keyframes, a walk cycle, small irregular timing noise, and
// pendulum follow-through for everything that dangles (earrings, tails, quivers, loose forearms, hands).
//
// Pendulums are simulated deterministically from t = 0 at 96 Hz and cached per key, so any frame can be
// rendered on its own (Remotion renders frames in parallel) and always gives the same answer.

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const easeInOut = (x: number) => { x = clamp01(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
export const easeOut = (x: number) => 1 - Math.pow(1 - clamp01(x), 3);
export const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));

// piecewise keyframes [[time, value], ...] with eased segments
export function kf(t: number, keys: [number, number][], ease = easeInOut): number {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, v0] = keys[i], [t1, v1] = keys[i + 1];
    if (t <= t1) return v0 + (v1 - v0) * ease((t - t0) / (t1 - t0));
  }
  return keys[keys.length - 1][1];
}

// small irregular wobble (hand-held rods are never perfectly still)
export const jitter = (t: number, seed = 0, amp = 1) =>
  amp * (.55 * Math.sin(t * 2.3 + seed * 1.7) + .3 * Math.sin(t * 5.9 + seed * 3.1) + .15 * Math.sin(t * 11.3 + seed * 5.3));

// ---------------------------------------------------------------- pendulum follow-through
// theta'' = -w^2 theta - 2 z w theta' - gain * drive''   (theta is the part's angle offset in degrees)
// `drive` is any signal whose acceleration shakes the part: the puppet's x position (px), or the parent's angle (deg).
const SUB = 96, cache = new Map<string, Float32Array>();
export type Swing = { f?: number; z?: number; gain: number };
export function pendulum(key: string, t: number, drive: (t: number) => number, { f = 1.4, z = .16, gain }: Swing, until = 64): number {
  let arr = cache.get(key);
  if (!arr) {
    const n = Math.ceil(until * SUB) + 2, dt = 1 / SUB, w = 2 * Math.PI * f;
    arr = new Float32Array(n);
    let th = 0, v = 0;
    for (let i = 0; i < n; i++) {
      const s = i * dt, acc = (drive(s + dt) - 2 * drive(s) + drive(Math.max(0, s - dt))) / (dt * dt);
      v += (-w * w * th - 2 * z * w * v - gain * acc) * dt;
      th += v * dt;
      arr[i] = th;
    }
    cache.set(key, arr);
  }
  const x = Math.max(0, t * SUB), i = Math.min(arr.length - 2, Math.floor(x)), u = x - i;
  return arr[i] * (1 - u) + arr[i + 1] * u;
}

// ---------------------------------------------------------------- walk: the puppeteer bobs the figure; the legs swing loose
export function walk(dist: number, stride = 150) {
  const ph = dist / stride * Math.PI;           // one step per stride
  const s = Math.sin(ph);
  return { bob: -Math.abs(s) * 12, lean: 2.5 * Math.sin(ph * 2), frontLeg: 15 * s, backLeg: -15 * s };
}
