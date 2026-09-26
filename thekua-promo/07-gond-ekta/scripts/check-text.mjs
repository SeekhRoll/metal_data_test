// Brief §4.5: render every 6th frame of the film and fail if any text box (padded 24 px) touches a graphic box.
// FilmCheck (src/film/Film.tsx) measures getBoundingClientRect of every [data-kind] node and throws with
// scene, frame and element ids on the first collision, which fails this render and exits non-zero.
import { execSync } from 'node:child_process';
const shell = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
try {
  execSync(`npx remotion render src/index.ts FilmCheck build/check.mp4 --scale=0.25 --browser-executable=${shell} --log=error`, { stdio: 'inherit' });
  console.log('text collision check: PASS (240 sampled frames, every 6th frame of 1440)');
} catch (e) {
  console.error('text collision check: FAIL');
  process.exit(1);
}
