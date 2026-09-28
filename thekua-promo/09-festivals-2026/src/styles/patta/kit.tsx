import React from 'react';
import { T } from './palette';
import { S, circle } from '../pahari/paint';
import { rng } from '../pahari/rand';
import { limb } from '../pahari/body';

// white dots along a polyline: the Pattachitra ornament/border detail
export const Dots: React.FC<{ pts: [number, number][]; step?: number; r?: number; c?: string }> = ({ pts, step = 9, r = 1.8, c = T.white }) => {
  const out: React.ReactNode[] = [];
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], L = Math.hypot(x1 - x0, y1 - y0), n = Math.max(1, Math.floor(L / step));
    for (let k = 0; k < n; k++) out.push(<circle key={i + '_' + k} cx={x0 + (x1 - x0) * k / n} cy={y0 + (y1 - y0) * k / n} r={r} fill={c} />);
  }
  return <g>{out}</g>;
};

// ---------------------------------------------------------------- the multi-band border; `k` (0..bands) draws the bands in one after another
type Band = { w: number; fill: string; motif?: 'creeper' | 'dots' | 'petals' | 'zigzag' | 'none'; mc?: string };
export const BANDS: Band[] = [
  { w: 30, fill: T.black, motif: 'creeper' },
  { w: 9, fill: T.red, motif: 'dots' },
  { w: 24, fill: T.yellow, motif: 'petals', mc: T.red },
  { w: 6, fill: T.black },
  { w: 18, fill: T.red, motif: 'zigzag' },
  { w: 4, fill: T.white },
];
export const bandsWidth = BANDS.reduce((a, b) => a + b.w, 0);

function motif(kind: Band['motif'], x: number, y: number, w: number, h: number, horiz: boolean, key: string, mc?: string) {
  const out: React.ReactNode[] = [], L = horiz ? w : h, t = horiz ? h : w;
  const at = (u: number, v: number): [number, number] => horiz ? [x + u, y + v] : [x + v, y + u];
  if (kind === 'creeper') {
    const step = 46;
    let d = '';
    for (let u = 0; u < L; u += step) { const a = at(u, t / 2), b = at(u + step / 2, t * .2), c = at(u + step, t / 2); d += `M${a[0]} ${a[1]} Q${b[0]} ${b[1]} ${c[0]} ${c[1]} `; }
    out.push(<path key={key + 'v'} d={d} stroke={T.white} strokeWidth={1.6} fill="none" />);
    for (let u = step / 2; u < L; u += step) {
      const c = at(u, t / 2 + 2);
      out.push(<g key={key + u}>{[0, 1, 2, 3, 4, 5].map((i) => { const a = i / 6 * Math.PI * 2; return <ellipse key={i} cx={c[0] + Math.cos(a) * 5} cy={c[1] + Math.sin(a) * 5} rx={4} ry={2.2} transform={`rotate(${a * 180 / Math.PI} ${c[0] + Math.cos(a) * 5} ${c[1] + Math.sin(a) * 5})`} fill={T.white} />; })}<circle cx={c[0]} cy={c[1]} r={2.4} fill={T.red} /></g>);
      const l = at(u + step / 2, t * .3);
      out.push(<ellipse key={key + 'l' + u} cx={l[0]} cy={l[1]} rx={5} ry={2} fill={T.green} stroke={T.white} strokeWidth={.6} />);
    }
  } else if (kind === 'dots') {
    for (let u = 4; u < L; u += 10) { const c = at(u, t / 2); out.push(<circle key={key + u} cx={c[0]} cy={c[1]} r={1.7} fill={T.white} />); }
  } else if (kind === 'petals') {
    for (let u = 0; u < L; u += 20) { const a = at(u, t), b = at(u + 10, -t * .1), c = at(u + 20, t); out.push(<path key={key + u} d={`M${a[0]} ${a[1]} Q${b[0]} ${b[1]} ${c[0]} ${c[1]}Z`} fill={mc} stroke={T.black} strokeWidth={1} />); }
  } else if (kind === 'zigzag') {
    let d = '';
    for (let u = 0; u < L; u += 14) { const a = at(u, t * .2), b = at(u + 7, t * .8); d += `${u ? 'L' : 'M'}${a[0]} ${a[1]} L${b[0]} ${b[1]} `; }
    out.push(<path key={key} d={d} stroke={T.white} strokeWidth={1.4} fill="none" />);
  }
  return out;
}

export const PattaBorder: React.FC<{ x: number; y: number; w: number; h: number; k?: number }> = ({ x, y, w, h, k = BANDS.length }) => {
  const out: React.ReactNode[] = [];
  let o = 0;
  BANDS.forEach((b, i) => {
    const p = Math.max(0, Math.min(1, k - i));
    if (p <= 0) { o += b.w; return; }
    const X = x + o, Y = y + o, W = w - 2 * o, H = h - 2 * o;
    const sides = [
      { x: X, y: Y, w: W, h: b.w, horiz: true }, { x: X + W - b.w, y: Y, w: b.w, h: H, horiz: false },
      { x: X, y: Y + H - b.w, w: W, h: b.w, horiz: true }, { x: X, y: Y, w: b.w, h: H, horiz: false },
    ];
    // draws in clockwise from the top-left corner
    const clipId = `bandclip${i}`;
    const per = 2 * (W + H), len = per * p;
    const seg = (a: number) => { const s0 = Math.min(len, a); return s0; };
    const cw = seg(W), cr = Math.max(0, seg(W + H) - W), cb = Math.max(0, seg(2 * W + H) - W - H), cl = Math.max(0, len - 2 * W - H);
    out.push(
      <g key={i}>
        <clipPath id={clipId}>
          <rect x={X} y={Y} width={cw} height={b.w} />
          <rect x={X + W - b.w} y={Y} width={b.w} height={cr} />
          <rect x={X + W - cb} y={Y + H - b.w} width={cb} height={b.w} />
          <rect x={X} y={Y + H - cl} width={b.w} height={cl} />
        </clipPath>
        <g clipPath={`url(#${clipId})`}>
          {sides.map((s, j) => <rect key={j} x={s.x} y={s.y} width={s.w} height={s.h} fill={b.fill} />)}
          {b.motif && b.motif !== 'none' && sides.map((s, j) => <g key={'m' + j}>{motif(b.motif, s.x, s.y, s.w, s.h, s.horiz, `${i}_${j}_`, b.mc)}</g>)}
          <rect x={X + .5} y={Y + .5} width={W - 1} height={H - 1} fill="none" stroke={T.black} strokeWidth={1} />
        </g>
      </g>,
    );
    o += b.w;
  });
  return <g data-kind="surface" data-id="patta-border">{out}</g>;
};

// ---------------------------------------------------------------- stylised tree: dense fans of pointed leaves with white midribs, flowers
export const PattaTree: React.FC<{ x: number; y: number; h: number; seed: number; flower?: string; bird?: boolean }> = ({ x, y, h, seed, flower = T.pink, bird = false }) => {
  const r = rng(seed), out: React.ReactNode[] = [];
  const top = y - h;
  const branches: [number, number][] = [];
  for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * .42, L = h * (.32 + r() * .12); branches.push([x + Math.cos(a) * L, top + h * .42 + Math.sin(a) * L]); }
  branches.forEach(([bx, by], i) => {
    out.push(<S key={'b' + i} d={`M${x} ${top + h * .45} Q${(x + bx) / 2} ${by + 20} ${bx} ${by}`} stroke="#5A3218" sw={3} />);
    for (let k = 0; k < 9; k++) {
      const a = -Math.PI / 2 + (k - 4) * .38 + (bx - x) / h * .8, L = h * .13;
      const ex = bx + Math.cos(a) * L, ey = by + Math.sin(a) * L, ang = a * 180 / Math.PI + 90;
      out.push(<g key={i + '_' + k} transform={`rotate(${ang} ${ex} ${ey})`}>
        <path d={`M${ex} ${ey - L * .55} Q${ex + L * .28} ${ey} ${ex} ${ey + L * .55} Q${ex - L * .28} ${ey} ${ex} ${ey - L * .55}Z`} fill={k % 3 ? T.green : T.greenDeep} stroke={T.black} strokeWidth={1.2} />
        <path d={`M${ex} ${ey - L * .45} L${ex} ${ey + L * .45}`} stroke={T.white} strokeWidth={.8} />
      </g>);
    }
    if (r() < .6) out.push(<g key={'f' + i}>{[0, 1, 2, 3, 4].map((q) => { const a = q / 5 * Math.PI * 2; return <circle key={q} cx={bx + Math.cos(a) * 5} cy={by + Math.sin(a) * 5} r={3.6} fill={flower} stroke={T.black} strokeWidth={.8} />; })}<circle cx={bx} cy={by} r={2.6} fill={T.yellow} /></g>);
  });
  if (bird) { const [bx, by] = branches[1]; out.push(<g key="bird"><S d={`M${bx - 16} ${by - 8} C${bx - 6} ${by - 22} ${bx + 12} ${by - 18} ${bx + 18} ${by - 8} L${bx + 26} ${by - 10} L${bx + 18} ${by - 4} C${bx + 6} ${by + 2} ${bx - 8} ${by} ${bx - 16} ${by - 8}Z`} fill={T.teal} sw={1} /><circle cx={bx + 12} cy={by - 12} r={1.6} fill={T.white} /></g>); }
  return (
    <g data-kind="graphic">
      <S d={`M${x - 10} ${y} C${x - 8} ${y - h * .3} ${x - 5} ${top + h * .5} ${x - 3} ${top + h * .45} L${x + 3} ${top + h * .45} C${x + 5} ${top + h * .5} ${x + 8} ${y - h * .3} ${x + 10} ${y}Z`} fill="#6A3A1C" sw={1.4} />
      <Dots pts={[[x, y - 6], [x, top + h * .5]]} step={12} r={1.4} />
      {out}
    </g>
  );
};

// ---------------------------------------------------------------- Odisha rekha deula: curvilinear spire with horizontal courses, amalaka, kalasha, flag
export const Deula: React.FC<{ x: number; y: number; s?: number; col?: string }> = ({ x, y, s = 1, col = T.ochre }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} data-kind="graphic">
    <S d="M-70 0 H70 V-40 H-70Z" fill={col} sw={1.4} />
    <S d="M-24 0 V-34 H24 V0Z" fill={T.black} sw={1.2} />
    <S d="M-60 -40 C-62 -120 -40 -190 -18 -230 H18 C40 -190 62 -120 60 -40Z" fill={col} sw={1.6} />
    {Array.from({ length: 9 }, (_, i) => { const yy = -52 - i * 20, hw = 60 - Math.pow(i / 9, 1.6) * 42; return <S key={i} d={`M${-hw} ${yy} H${hw}`} stroke={T.black} sw={1} />; })}
    <S d="M0 -40 V-230" stroke={T.redDeep} sw={2} />
    <S d="M-26 -232 C-26 -246 26 -246 26 -232 C26 -222 -26 -222 -26 -232Z" fill={T.yellow} sw={1.2} />
    <S d="M-8 -244 C-12 -256 12 -256 8 -244Z M0 -256 V-290" fill={T.yellow} sw={1.2} />
    <S d="M0 -290 L28 -282 L0 -272Z" fill={T.red} sw={1} />
    <Dots pts={[[-60, -40], [60, -40]]} step={8} />
  </g>
);

// ---------------------------------------------------------------- Pattachitra profile head (facing right): long fish-shaped eye, sharp nose, big kundala
export const PattaHead: React.FC<{ skin?: string; crown?: 'mukuta' | 'sage' | 'queen' | null; beard?: string | null; blink?: number; hair?: string; crownCol?: string }> = ({ skin = T.skin, crown = 'mukuta', beard = null, blink = 0, hair = T.black, crownCol = T.yellow }) => {
  const o = 1 - blink, uid = 'pe' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <g>
      <S d="M16 -52 C4 -48 0 -34 2 -18 C3 -6 -2 6 -6 14 C-20 20 -34 8 -36 -12 C-38 -40 -22 -60 0 -62 C8 -62 14 -58 16 -52Z" fill={hair} sw={1} />
      <S d="M24 -30 L26 -40" stroke={T.red} sw={2.4} />
      {crown === 'queen' && <S d="M-40 -20 C-66 -24 -76 0 -64 18 C-52 30 -34 22 -32 8Z" fill={hair} sw={1} />}
      <S d="M14 -50 C22 -44 24 -34 24 -24 C24 -16 30 -8 44 6 C46 9 42 12 36 11 C36 13 37 15 38 16 C35 18 33 18 32 18 C34 20 35 22 33 24 C31 28 34 36 26 42 C18 46 6 42 0 36 C2 20 4 0 4 -18 C3 -32 8 -44 14 -50Z" fill={skin} sw={1.2} />
      <clipPath id={uid}><path d={`M2 -13 C12 ${-13 - 11 * o} 28 ${-12 - 10 * o} 36 -12 C28 ${-12 + 6 * o} 12 ${-12 + 6 * o} 2 -13Z`} /></clipPath>
      {o > .15 ? <g>
        <path d={`M2 -13 C12 ${-13 - 11 * o} 28 ${-12 - 10 * o} 36 -12 C28 ${-12 + 6 * o} 12 ${-12 + 6 * o} 2 -13Z`} fill={T.white} />
        <g clipPath={`url(#${uid})`}><circle cx={24} cy={-14} r={5.4} fill={T.black} /><circle cx={25.5} cy={-15.5} r={1.4} fill={T.white} /></g>
        <S d={`M-10 -12 L2 -13 C12 ${-13 - 11 * o} 28 ${-12 - 10 * o} 36 -12 C28 ${-12 + 6 * o} 12 ${-12 + 6 * o} 2 -13`} sw={1.3} />
      </g> : <S d="M-10 -12 L2 -13 C12 -10 28 -10 36 -12" sw={1.3} />}
      <S d="M2 -28 Q20 -36 36 -23" sw={1.6} />
      <S d="M38 15.5 Q35 17.5 32.5 18 Q35 19.2 34 22 Q37 19 38 15.5Z" fill={T.red} stroke="none" />
      {beard && <S d="M0 22 C6 38 16 46 26 44 C32 42 34 34 33 26 C38 44 32 70 18 84 C4 72 -4 50 0 22Z" fill={beard} sw={1} />}
      {beard && <S d="M36 14 C30 16 24 16 20 12 C24 20 32 20 36 16Z" fill={beard} stroke="none" />}
      <S d="M-2 -4 C-10 -6 -12 8 -2 10" fill={skin} sw={1} />
      {/* kundala */}
      <S d={circle(-6, 18, 7)} fill={T.yellow} sw={1} />
      <circle cx={-6} cy={18} r={2.4} fill={T.red} />
      <Dots pts={[[-12, 12], [0, 12]]} step={4} r={1} />
      {crown === 'mukuta' && <g>
        <S d="M-42 -44 C-44 -60 -30 -70 -14 -70 L-18 -96 L-8 -88 L-4 -128 L6 -90 L14 -140 L20 -88 L30 -110 L30 -58 C14 -62 -18 -60 -42 -44Z" fill={crownCol} sw={1.2} />
        <S d="M-38 -52 C-14 -64 14 -64 30 -58 M-12 -78 H22 M-8 -98 H18" sw={1} />
        <Dots pts={[[-36, -54], [-12, -64], [14, -64], [28, -60]]} step={5} r={1.3} />
        <circle cx={14} cy={-112} r={3.6} fill={T.red} stroke={T.black} strokeWidth={1} />
      </g>}
      {crown === 'sage' && <S d="M-30 -58 C-36 -92 -2 -104 10 -80 C14 -70 6 -60 -8 -58Z" fill={hair} sw={1.2} />}
      {crown === 'queen' && <g><S d="M-30 -58 C-10 -70 14 -66 20 -58 L18 -50 C0 -60 -16 -58 -30 -52Z" fill={T.yellow} sw={1} /><Dots pts={[[-28, -56], [0, -64], [18, -58]]} step={5} r={1.2} /></g>}
    </g>
  );
};

// the veena Narada carries: long stem, two gourds, pegs
export const Veena: React.FC<{ x: number; y: number; rot?: number; s?: number }> = ({ x, y, rot = -60, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <S d="M-160 -5 H160 V5 H-160Z" fill="#7A4420" sw={1.2} />
    <S d={circle(-120, 14, 26)} fill={T.ochre} sw={1.2} />
    <S d={circle(110, 16, 30)} fill={T.ochre} sw={1.2} />
    <Dots pts={[[-146, 14], [-94, 14]]} step={6} r={1.3} />
    <S d="M-160 -2 H160 M-160 2 H160" stroke={T.white} sw={.5} />
    {[-150, -140, -130].map((p) => <S key={p} d={`M${p} -5 V-14`} sw={2} />)}
  </g>
);

export { limb, circle };
