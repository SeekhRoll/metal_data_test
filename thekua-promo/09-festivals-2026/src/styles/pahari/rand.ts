export function rng(seed: number) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
export const ease = (u: number) => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u));
export const clamp01 = (u: number) => Math.max(0, Math.min(1, u));
export const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
// eased with slight overshoot (brief: nothing moves linearly)
export const easeBack = (u: number, s = 1.2) => { u = clamp01(u) - 1; return u * u * ((s + 1) * u + s) + 1; };
