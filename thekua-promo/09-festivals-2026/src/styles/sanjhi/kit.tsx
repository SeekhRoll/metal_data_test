import React from 'react';
import { StencilCtx } from '../pahari/paint';

// Sanjhi (Mathura–Vrindavan): ivory cut-paper stencils with lace-like perforations over a soft coloured powder ground.
// The picture is the negative space: whatever is cut lets the powder beneath show through.
export const SJ = { paper: '#F6F0E2', paperShade: '#D9CFBA', ochre: '#D9962E', blue: '#5C84B8', white: '#F4F4F0', pink: '#D98AA0', green: '#6FA06A', gold: '#E4B54A', saffron: '#E07A2E' };

// perforation patterns (in mask space: white = paper kept, black = cut)
export const LaceDefs: React.FC = () => (
  <defs>
    <pattern id="laceDots" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="#fff" /><circle cx="8" cy="8" r="5" fill="#000" /></pattern>
    <pattern id="laceFlower" width="26" height="26" patternUnits="userSpaceOnUse"><rect width="26" height="26" fill="#fff" />{[0, 1, 2, 3, 4, 5].map((i) => { const a = i / 6 * Math.PI * 2; return <ellipse key={i} cx={13 + Math.cos(a) * 6.4} cy={13 + Math.sin(a) * 6.4} rx={5.4} ry={3} transform={`rotate(${a * 180 / Math.PI} ${13 + Math.cos(a) * 6.4} ${13 + Math.sin(a) * 6.4})`} fill="#000" />; })}<circle cx="13" cy="13" r="2.6" fill="#000" /></pattern>
    <pattern id="laceLattice" width="18" height="18" patternUnits="userSpaceOnUse"><rect width="18" height="18" fill="#fff" /><path d="M9 0.5 L17.5 9 L9 17.5 L0.5 9Z" fill="#000" /><path d="M9 7 L11 9 L9 11 L7 9Z" fill="#fff" /></pattern>
    <pattern id="laceVine" width="30" height="20" patternUnits="userSpaceOnUse"><rect width="30" height="20" fill="#fff" /><path d="M0 10 Q7.5 2 15 10 T30 10" stroke="#000" strokeWidth="4" fill="none" /><ellipse cx="7" cy="15" rx="5" ry="3" fill="#000" /><ellipse cx="22" cy="5" rx="5" ry="3" fill="#000" /></pattern>
    <pattern id="laceSolid" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="#000" /></pattern>
  </defs>
);
// choose a lace for each colour so different parts of a figure read differently
const LACES = ['url(#laceFlower)', 'url(#laceDots)', 'url(#laceLattice)', 'url(#laceVine)'];
export const laceFor = (fill: string) => {
  if (fill.startsWith('url(#gold')) return 'url(#laceLattice)';
  let h = 0; for (const c of fill) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return LACES[h % LACES.length];
};

// powder ground: coloured regions with a fine grainy texture; `k` 0..1 sifts it in (grains appear progressively)
export const Powder: React.FC<{ x: number; y: number; w: number; h: number; k: number; children: React.ReactNode; id?: string; seed?: number }> = ({ x, y, w, h, k, children, id = 'pw', seed = 5 }) => (
  <g>
    <defs>
      <filter id={id + 'grain'} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="1" seed={seed} result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -3 1.9" />
      </filter>
      {/* grains appear where noise < k: a sifting reveal */}
      <filter id={id + 'sift'} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed={seed + 3} result="n" />
        <feColorMatrix in="n" type="luminanceToAlpha" result="l" />
        <feComponentTransfer in="l"><feFuncA type="discrete" tableValues={Array.from({ length: 20 }, (_, i) => (i / 20 < k * 1.15 ? 1 : 0)).join(' ')} /></feComponentTransfer>
      </filter>
      <mask id={id + 'mask'}><rect x={x} y={y} width={w} height={h} fill="#fff" filter={`url(#${id}sift)`} /></mask>
    </defs>
    <g mask={k < 1 ? `url(#${id}mask)` : undefined}>
      {children}
      <rect x={x} y={y} width={w} height={h} filter={`url(#${id}grain)`} opacity={.35} style={{ mixBlendMode: 'multiply' }} />
    </g>
  </g>
);

// the stencil: ivory paper with everything drawn inside `cuts` removed; soft drop shadow; lifts/settles with `lift`
export const Stencil: React.FC<{ x: number; y: number; w: number; h: number; cuts: React.ReactNode; id: string; lift?: number; opacity?: number; cut?: number }> = ({ x, y, w, h, cuts, id, lift = 0, opacity = 1, cut = 4.5 }) => {
  const m = (
    <mask id={id} maskUnits="userSpaceOnUse" x={x - 40} y={y - 40} width={w + 80} height={h + 80}>
      <rect x={x} y={y} width={w} height={h} fill="#fff" />
      <StencilCtx.Provider value={{ lace: laceFor, cut }}>{cuts}</StencilCtx.Provider>
    </mask>
  );
  const dx = 4 + lift * 10, dy = 6 + lift * 16;
  return (
    <g opacity={opacity} data-kind="surface" data-id={'stencil-' + id}>
      <defs>{m}<filter id={id + 'sh'} x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation={3 + lift * 6} /></filter></defs>
      <rect x={x + dx} y={y + dy} width={w} height={h} fill="#000" opacity={.28} mask={`url(#${id})`} filter={`url(#${id}sh)`} />
      <g transform={`translate(${-lift * 4} ${-lift * 8})`}>
        <rect x={x} y={y} width={w} height={h} fill={SJ.paper} mask={`url(#${id})`} />
        <rect x={x} y={y} width={w} height={h} fill="url(#paperTex)" mask={`url(#${id})`} opacity={.5} />
      </g>
    </g>
  );
};
export const PaperTexDefs: React.FC = () => (
  <defs>
    <filter id="paperFibre" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".6 .04" numOctaves="2" seed="9" result="n" /><feColorMatrix in="n" type="matrix" values="0 0 0 0 .75  0 0 0 0 .7  0 0 0 0 .6  0 0 0 -1.5 .9" /></filter>
    <pattern id="paperTex" width="1080" height="1920" patternUnits="userSpaceOnUse"><rect width="1080" height="1920" filter="url(#paperFibre)" /></pattern>
  </defs>
);

// ornamental border cuts for a stencil frame
export const BorderCuts: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => {
  const out: React.ReactNode[] = [];
  const edge = (x0: number, y0: number, x1: number, y1: number, key: string) => {
    const L = Math.hypot(x1 - x0, y1 - y0), n = Math.floor(L / 40);
    for (let i = 0; i <= n; i++) { const cx = x0 + (x1 - x0) * i / n, cy = y0 + (y1 - y0) * i / n; out.push(<g key={key + i}>{[0, 1, 2, 3].map((k) => <ellipse key={k} cx={cx + [7, 0, -7, 0][k]} cy={cy + [0, 7, 0, -7][k]} rx={k % 2 ? 3 : 6} ry={k % 2 ? 6 : 3} fill="#000" />)}</g>); }
  };
  edge(x + 30, y + 30, x + w - 30, y + 30, 't'); edge(x + 30, y + h - 30, x + w - 30, y + h - 30, 'b');
  edge(x + 30, y + 30, x + 30, y + h - 30, 'l'); edge(x + w - 30, y + 30, x + w - 30, y + h - 30, 'r');
  return <g>{out}<rect x={x + 54} y={y + 54} width={w - 108} height={h - 108} fill="none" stroke="#000" strokeWidth={3} /><rect x={x + 62} y={y + 62} width={w - 124} height={h - 124} fill="none" stroke="#000" strokeWidth={1.4} /></g>;
};
