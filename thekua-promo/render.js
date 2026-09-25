// Renders promo.html frame-by-frame in headless Chromium and muxes with the soundtrack.
//
//   node render.js                 -> build/thekua-promo-dwarka.mp4 (1080x1920, 30 fps, 30 s)
//   node render.js --stills 2.3,16 -> build/still-2.30.png ... (quick look at chosen moments)
//
// Needs: playwright (global install is fine), ffmpeg (FFMPEG env or `pip install imageio-ffmpeg`).
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');

function req(name) {
  try { return require(name); } catch { return require(path.join(execSync('npm root -g').toString().trim(), name)); }
}
const { chromium } = req('playwright');

const ROOT = __dirname, OUT = path.join(ROOT, 'build');
const FPS = 30, DUR = 30;
const FFMPEG = process.env.FFMPEG ||
  (() => { try { return execSync('python3 -c "import imageio_ffmpeg as i;print(i.get_ffmpeg_exe())"').toString().trim(); } catch { return 'ffmpeg'; } })();

const TYPES = { '.html': 'text/html', '.ttf': 'font/ttf', '.js': 'text/javascript' };
const server = http.createServer((q, r) => {
  const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
  if (!f.startsWith(ROOT) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(r);
});

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  await new Promise(res => server.listen(0, res));
  const url = `http://127.0.0.1:${server.address().port}/promo.html?capture`;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 400, height: 700 } });
  page.on('console', m => console.log('[page]', m.text()));
  page.on('pageerror', e => console.error('[page error]', e.message));
  await page.goto(url);
  await page.waitForFunction(() => window.READY === true, null, { timeout: 60000 });

  const stillsArg = process.argv.indexOf('--stills');
  if (stillsArg > 0) {
    for (const t of process.argv[stillsArg + 1].split(',').map(Number)) {
      const data = await page.evaluate(t => window.frameJPEG(t, .9), t);
      const f = path.join(OUT, `still-${t.toFixed(2)}.jpg`);
      fs.writeFileSync(f, Buffer.from(data.split(',')[1], 'base64'));
      console.log('wrote', f);
    }
    await browser.close(); server.close(); return;
  }

  const wav = path.join(OUT, 'soundtrack.wav');
  const mp4 = path.join(OUT, 'thekua-promo-dwarka.mp4');
  const ff = spawn(FFMPEG, [
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
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 60 === 0) console.log(`frame ${i}/${total}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close(); server.close();
  console.log('wrote', mp4);
})().catch(e => { console.error(e); process.exit(1); });
