// Motion rules (brief §3.3): everything eased with a slight overshoot, nothing linear, and all motion
// sampled on twos (a new drawing every 2 frames).
export const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const easeInOut = (k: number) => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
export const easeOut = (k: number) => 1 - Math.pow(1 - k, 3);
// ease-out with a small overshoot (settles like a brush lifted off the paper)
export const back = (k: number, s = 1.25) => { const c = s + 1; return 1 + c * Math.pow(k - 1, 3) + s * Math.pow(k - 1, 2); };
export const onTwos = (frame: number) => frame - (frame % 2);
// idle cycles: blink drawing held for 4 frames every ~3 s, per-character offset
export const blinking = (t: number, off = 0) => ((t + off) % 3.1) < 0.17;
