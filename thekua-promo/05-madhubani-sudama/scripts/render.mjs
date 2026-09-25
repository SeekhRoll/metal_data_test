// Renders the silent 60 s film with Remotion (Playwright's headless shell), then scripts/mix.py muxes audio.
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
const shell = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const browser = existsSync(shell) ? `--browser-executable=${shell}` : '';
mkdirSync('out', { recursive: true });
execSync(`npx remotion render src/index.ts Film out/film-silent.mp4 --codec=h264 --crf=17 --concurrency=4 --muted ${browser} --log=error`, { stdio: 'inherit' });
console.log('wrote out/film-silent.mp4');
