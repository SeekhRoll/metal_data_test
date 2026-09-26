// A simple boids flock for the far background birds (brief §3.1): separation, alignment, cohesion and a soft pull
// toward a path. Deterministic: simulated once from its start time at 60 Hz and cached per flock.
type B = { x: number; y: number; vx: number; vy: number };
const caches = new Map<string, Float32Array>();
export function boids(key: string, n: number, t0: number, t1: number, goal: (t: number) => [number, number], seed = 1): (t: number) => B[] {
  let arr = caches.get(key);
  const HZ = 60, steps = Math.ceil((t1 - t0) * HZ) + 2;
  if (!arr) {
    arr = new Float32Array(steps * n * 4);
    let r = seed * 9301 + 49297;
    const rnd = () => ((r = (r * 9301 + 49297) % 233280) / 233280);
    const g0 = goal(t0);
    const fl: B[] = Array.from({ length: n }, () => ({ x: g0[0] + (rnd() - .5) * 700, y: g0[1] + (rnd() - .5) * 300, vx: 60 + rnd() * 40, vy: (rnd() - .5) * 30 }));
    const dt = 1 / HZ;
    for (let s = 0; s < steps; s++) {
      const t = t0 + s * dt, g = goal(t);
      for (const a of fl) {
        let sx = 0, sy = 0, ax = 0, ay = 0, cx = 0, cy = 0, m = 0;
        for (const b of fl) {
          if (a === b) continue;
          const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy);
          if (d < 220) { m++; ax += b.vx; ay += b.vy; cx += b.x; cy += b.y; if (d < 90) { sx -= dx / (d + 1) * 140; sy -= dy / (d + 1) * 140; } }
        }
        if (m) { ax = ax / m - a.vx; ay = ay / m - a.vy; cx = cx / m - a.x; cy = cy / m - a.y; }
        a.vx += (sx * 1.5 + ax * .8 + cx * .15 + (g[0] - a.x) * .12) * dt;
        a.vy += (sy * 1.5 + ay * .8 + cy * .15 + (g[1] - a.y) * .15) * dt;
        const v = Math.hypot(a.vx, a.vy), vmax = 220;
        if (v > vmax) { a.vx *= vmax / v; a.vy *= vmax / v; }
        a.x += a.vx * dt; a.y += a.vy * dt;
      }
      fl.forEach((b, i) => { const o = (s * n + i) * 4; arr![o] = b.x; arr![o + 1] = b.y; arr![o + 2] = b.vx; arr![o + 3] = b.vy; });
    }
    caches.set(key, arr);
  }
  const A = arr;
  return (t: number) => {
    const s = Math.max(0, Math.min(steps - 1, Math.round((t - t0) * HZ)));
    return Array.from({ length: n }, (_, i) => { const o = (s * n + i) * 4; return { x: A[o], y: A[o + 1], vx: A[o + 2], vy: A[o + 3] }; });
  };
}
