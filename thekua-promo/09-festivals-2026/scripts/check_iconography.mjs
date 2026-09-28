// Brief §9.2: each Devi component exports its attributes; assert they match data/navratri-days.json.
import { readFileSync } from 'node:fs';
const days = JSON.parse(readFileSync(new URL('../data/navratri-days.json', import.meta.url)));
const src = readFileSync(new URL('../src/devi/pahari/devis.tsx', import.meta.url), 'utf8');
const entries = [...src.matchAll(/\{ day: (\d+), arms: (\d+), vahana: '([^']+)', holds: \[([^\]]*)\], features: \[([^\]]*)\]/g)];
const list = (s) => [...s.matchAll(/'([^']+)'/g)].map((m) => m[1]);
let bad = 0;
for (const d of days) {
  const e = entries.find((m) => +m[1] === d.day);
  const ic = d.iconography, fails = [];
  if (!e) { console.log(`day ${d.day}: no Devi entry`); bad++; continue; }
  if (+e[2] !== ic.arms) fails.push(`arms ${e[2]} != ${ic.arms}`);
  if (e[3] !== ic.vahana) fails.push(`vahana '${e[3]}' != '${ic.vahana}'`);
  if (JSON.stringify(list(e[4]).sort()) !== JSON.stringify([...ic.holds].sort())) fails.push(`holds ${list(e[4])} != ${ic.holds}`);
  if (JSON.stringify(list(e[5])) !== JSON.stringify(ic.features)) fails.push(`features ${list(e[5])} != ${ic.features}`);
  // arm count drawn: near + far item lists (or the Shailaputri component's two arms)
  const drawn = src.split(`{ day: ${d.day},`)[1].split('{ day:')[0];
  const m = drawn.match(/items\(\[([^\]]*)\], \[([^\]]*)\]\)|near: \[([^\]]*)\], far: \[([^\]]*)\]/);
  const n = m ? list(m[1] ?? m[3]).length + list(m[2] ?? m[4]).length : 2;
  if (n !== ic.arms) fails.push(`draws ${n} arms`);
  console.log(`day ${d.day} ${d.devi.nameEn}: ${fails.length ? 'FAIL ' + fails.join('; ') : 'ok'}`);
  bad += fails.length ? 1 : 0;
}
if (bad) { console.error('iconography: FAIL'); process.exit(1); }
console.log('iconography: PASS');
