// Renders every review still into stills/ using the Chromium that ships with Playwright (no download needed).
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const shell = ['/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell'].find(existsSync);
const browser = shell ? `--browser-executable=${shell}` : '';
const ids = process.argv.slice(2).length ? process.argv.slice(2) : ['StyleSheet', 'SudamaSheet', 'WifeSheet', 'KrishnaSheet'];
for (const id of ids) {
  execSync(`npx remotion still src/index.ts ${id} stills/${id}.png ${browser} --log=error`, { stdio: 'inherit' });
  console.log('wrote stills/' + id + '.png');
}
