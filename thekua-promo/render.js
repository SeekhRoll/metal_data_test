// Renders a concept's promo.html frame-by-frame in headless Chromium and muxes it with its soundtrack.
//
//   node render.js <concept>                  -> <concept>/output/promo.mp4 (1080x1920, 30 fps, 30 s)
//                                               <concept>/output/promo-whatsapp.mp4 (720p, ~12 MB)
//                                               <concept>/output/poster.jpg
//   node render.js <concept> --stills 2.3,16  -> <concept>/build/still-2.30.jpg ... (quick look at chosen moments)
//   node render.js <concept> --poster 27.5    -> choose the poster frame (default 27.5 s)
//
// <concept> is a folder such as 01-cinematic, 02-hand-drawn, 03-ghar-ki-mithas.
// Run `python3 <concept>/soundtrack.py` first so <concept>/build/soundtrack.wav exists.
// Needs: playwright (global install is fine), ffmpeg (FFMPEG env or `pip install imageio-ffmpeg`).
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn, spawnSync, execSync } = require('child_process');

function req(name) {
  try { return require(name); } catch { return require(path.join(execSync('npm root -g').toString().trim(), name)); }
}
const { chromium } = req('playwright');

const ROOT = __dirname, FPS = 30, DUR = 30;
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const CONCEPT = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2].replace(/\/$/, '') : null;
if (!CONCEPT || !fs.existsSync(path.join(ROOT, CONCEPT, 'promo.html'))) {
  console.error('usage: node render.js <concept-folder> [--stills t1,t2] [--poster t]');
  process.exit(1);
}
const BUILD = path.join(ROOT, CONCEPT, 'build'), OUT = path.join(ROOT, CONCEPT, 'output');
const FFMPEG = process.env.FFMPEG ||
  (() => { try { return execSync('python3 -c "import imageio_ffmpeg as i;print(i.get_ffmpeg_exe())"').toString().trim(); } catch { return 'ffmpeg'; } })();

const TYPES = { '.html': 'text/html', '.ttf': 'font/ttf', '.js': 'text/javascript' };
const server = http.createServer((q, r) => {
  const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
  if (!f.startsWith(ROOT) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(r);
});

function ff(args) {
  const r = spawnSync(FFMPEG, ['-y', '-loglevel', 'error', ...args], { stdio: 'inherit' });
  if (r.status !== 0) throw new Error('ffmpeg failed: ' + args.join(' '));
}

(async () => {
  fs.mkdirSync(BUILD, { recursive: true });
  fs.mkdirSync(OUT, { recursive: true });
  await new Promise(res => server.listen(0, res));
  const url = `http://127.0.0.1:${server.address().port}/${CONCEPT}/promo.html?capture`;
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });   // WebGL2 for painterly concepts
  const page = await browser.newPage({ viewport: { width: 400, height: 700 } });
  page.on('console', m => console.log('[page]', m.text()));
  page.on('pageerror', e => console.error('[page error]', e.message));
  await page.goto(url);
  await page.waitForFunction(() => window.READY === true, null, { timeout: 60000 });

  const stills = arg('--stills');
  if (stills) {
    for (const t of stills.split(',').map(Number)) {
      const data = await page.evaluate(t => window.frameJPEG(t, .9), t);
      const f = path.join(BUILD, `still-${t.toFixed(2)}.jpg`);
      fs.writeFileSync(f, Buffer.from(data.split(',')[1], 'base64'));
      console.log('wrote', f);
    }
    await browser.close(); server.close(); return;
  }

  const wav = path.join(BUILD, 'soundtrack.wav');
  if (!fs.existsSync(wav)) console.warn(`warning: ${wav} missing, rendering without sound (run python3 ${CONCEPT}/soundtrack.py)`);
  const mp4 = path.join(OUT, 'promo.mp4');
  const enc = spawn(FFMPEG, [
    '-y', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    ...(fs.existsSync(wav) ? ['-i', wav, '-c:a', 'aac', '-b:a', '192k'] : []),
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p',
    '-profile:v', 'high', '-movflags', '+faststart', '-t', String(DUR), mp4,
  ], { stdio: ['pipe', 'inherit', 'inherit'] });

  const total = FPS * DUR, t0 = Date.now();
  for (let i = 0; i < total; i++) {
    const data = await page.evaluate(t => window.frameJPEG(t, .95), i / FPS);
    const buf = Buffer.from(data.split(',')[1], 'base64');
    if (!enc.stdin.write(buf)) await new Promise(r => enc.stdin.once('drain', r));
    if (i % 60 === 0) console.log(`frame ${i}/${total}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  enc.stdin.end();
  await new Promise(r => enc.on('close', r));
  await browser.close(); server.close();

  ff(['-i', mp4, '-vf', 'scale=720:1280:flags=lanczos', '-c:v', 'libx264', '-preset', 'slow', '-b:v', '3200k', '-maxrate', '3800k',
    '-bufsize', '7000k', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', path.join(OUT, 'promo-whatsapp.mp4')]);
  ff(['-ss', arg('--poster', '27.5'), '-i', mp4, '-frames:v', '1', '-q:v', '2', path.join(OUT, 'poster.jpg')]);
  console.log('wrote', OUT + '/{promo.mp4,promo-whatsapp.mp4,poster.jpg}');
})().catch(e => { console.error(e); process.exit(1); });
