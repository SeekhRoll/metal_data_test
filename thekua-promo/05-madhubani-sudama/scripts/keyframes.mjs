// Renders keyframe stills of the film (brief §3.4 step 3: check stills before motion).
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
const shell = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const browser = existsSync(shell) ? `--browser-executable=${shell}` : '';
mkdirSync('stills/keyframes', { recursive: true });
const secs = process.argv.slice(2).map(Number);
for (const s of secs) {
  const f = Math.round(s * 24);
  execSync(`npx remotion still src/index.ts Film stills/keyframes/k-${s.toFixed(1).padStart(4, '0')}.jpg --frame=${f} --image-format=jpeg --jpeg-quality=85 ${browser} --log=error`, { stdio: 'inherit' });
}
