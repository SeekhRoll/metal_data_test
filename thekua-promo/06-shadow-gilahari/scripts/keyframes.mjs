// Keyframe stills of the film, one bundle for all frames (brief §3.5 step 4: stills before motion).
// usage: node scripts/keyframes.mjs 2.5 7 10.4 ...   -> build/kf/k-<sec>.jpg, plus build/kf/sheet.jpg (contact sheet)
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const secs = process.argv.slice(2).map(Number);
mkdirSync('build/kf', { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
const composition = await selectComposition({ serveUrl, id: 'Film', browserExecutable });
for (const s of secs) {
  const out = `build/kf/k-${s.toFixed(2).padStart(5, '0')}.jpg`;
  await renderStill({ serveUrl, composition, frame: Math.round(s * 24), output: out, imageFormat: 'jpeg', jpegQuality: 85, browserExecutable });
  console.log('wrote', out);
}
