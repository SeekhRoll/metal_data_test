import React from 'react';
import { smooth, tube, lens, circle } from '../madhubani/paint';
import { rng } from '../pahari/rand';

// Bengal Patachitra (Patua scroll): flat bright colour (yellow, red, indigo, black) with bold black outlines,
// huge fish-shaped eyes, stacked panels divided by floral borders, painted on a cloth-backed paper scroll.
export const BP = { ground: '#EDC35A', groundDeep: '#D9A63E', paper: '#F3E6C4', red: '#C62F22', redDeep: '#8E1D14', indigo: '#28407E', blue: '#4A74B8', black: '#171210', white: '#F8F1E2', green: '#3F7E36', greenDeep: '#27561F', pink: '#F0B39A', yellow: '#F4C62F', orange: '#E07A22', grey: '#5C5A62', skinGreen: '#6FA05A' };

export const PatDefs: React.FC = () => (
  <defs>
    {/* the hand wobble of a brush line: a fixed displacement, not animated */}
    <filter id="patWobble" x="-2%" y="-2%" width="104%" height="104%">
      <feTurbulence type="fractalNoise" baseFrequency=".02" numOctaves="2" seed="4" result="t" />
      <feDisplacementMap in="SourceGraphic" in2="t" scale="5" xChannelSelector="R" yChannelSelector="G" />
    </filter>
    <filter id="patPaper" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="3" seed="9" result="g" />
      <feColorMatrix in="g" type="matrix" values="0 0 0 0 .45  0 0 0 0 .35  0 0 0 0 .2  0 0 0 -1.5 1" result="g2" />
      <feTurbulence type="fractalNoise" baseFrequency=".004 .03" numOctaves="2" seed="21" result="w" />
      <feColorMatrix in="w" type="matrix" values="0 0 0 0 .5  0 0 0 0 .38  0 0 0 0 .22  0 0 0 -2.6 1.35" result="w2" />
      <feMerge><feMergeNode in="g2" /><feMergeNode in="w2" /></feMerge>
    </filter>
    <pattern id="patStripe" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(12)"><path d="M0 9 H18" stroke={BP.black} strokeWidth={2.4} opacity={.7} /></pattern>
    <pattern id="patDots" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx={13} cy={13} r={3.6} fill={BP.white} /></pattern>
  </defs>
);

// flat shape: fill (optionally a pattern over it) and a bold black line
export const F: React.FC<{ d: string; fill: string; w?: number; pat?: string; line?: string }> = ({ d, fill, w = 5, pat, line = BP.black }) => (
  <g>
    <path d={d} fill={fill} />
    {pat && <path d={d} fill={`url(#${pat})`} />}
    {w > 0 && <path d={d} fill="none" stroke={line} strokeWidth={w} strokeLinejoin="round" strokeLinecap="round" />}
  </g>
);
export const Ln: React.FC<{ d: string; w?: number; c?: string }> = ({ d, w = 4, c = BP.black }) => <path d={d} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />;
export { smooth, tube, lens, circle };

// ---------------------------------------------------------------- the Patua face: frontal, long fish eyes to the temples
export const PatFace: React.FC<{ skin?: string; closed?: number; third?: boolean; beard?: boolean; crown?: 'shola' | 'demon' | 'jata' | 'none'; female?: boolean; blink?: number; moustache?: boolean }> = ({ skin = BP.yellow, closed = 0, third = false, beard = false, crown = 'none', female = true, blink = 0, moustache = false }) => {
  const shut = Math.max(closed, blink);
  const eye = (k: number) => {
    const x0 = k * 12, x1 = k * 86, y = -10;
    return <g key={k}>
      {shut < .9 && <><path d={lens(x0, y, x1, y - 16, 15 * (1 - shut) * -k, 5 * k)} fill={BP.white} /><circle cx={k * 36} cy={y - 8} r={16 * (1 - shut)} fill={BP.black} /><circle cx={k * 31} cy={y - 13} r={4 * (1 - shut)} fill={BP.white} /></>}
      <Ln d={`M${x0} ${y} Q${k * 44} ${y - 40 * (1 - shut) - 4} ${x1 + k * 16} ${y - 22}`} w={5} />
      <Ln d={`M${x0} ${y} Q${k * 50} ${y + 8} ${x1} ${y - 16}`} w={3} />
      <Ln d={`M${k * 14} ${y - 50} Q${k * 50} ${y - 72} ${k * 98} ${y - 46}`} w={5} />
    </g>;
  };
  return <g>
    {/* hair mass behind */}
    {female && <F d={smooth([[-112, -40], [-126, 60], [-140, 200], [-110, 250], [-70, 150], [0, 90], [70, 150], [110, 250], [140, 200], [126, 60], [112, -40], [0, -120]], true)} fill={BP.black} w={0} />}
    {[-1, 1].map((k) => <F key={k} d={lens(k * 96, -26, k * 108, 36, 10)} fill={skin} w={4} />)}
    <F d={smooth([[0, -112], [80, -100], [104, -40], [96, 40], [60, 108], [0, 128], [-60, 108], [-96, 40], [-104, -40], [-80, -100]], true)} fill={skin} />
    {!female && crown === 'none' && <F d="M-104 -40 C-100 -110 -40 -128 0 -128 C40 -128 100 -110 104 -40 C80 -80 -80 -80 -104 -40Z" fill={BP.black} />}
    {female && <F d="M-104 -40 C-100 -100 -40 -118 0 -112 C40 -118 100 -100 104 -40 C70 -70 30 -80 0 -76 C-30 -80 -70 -70 -104 -40Z" fill={BP.black} w={3} />}
    {female && <Ln d="M0 -112 V-78" w={5} c={BP.red} />}
    {eye(-1)}{eye(1)}
    {third && <F d={lens(0, -76, 0, -46, 7)} fill={BP.white} w={3} />}
    {!third && female && <circle cx={0} cy={-58} r={7} fill={BP.red} />}
    <Ln d="M-6 -22 C-4 16 -14 40 -4 52 C4 58 14 54 16 48" w={4} />
    <F d="M-22 76 Q0 66 22 76 Q0 94 -22 76Z" fill={BP.red} w={2.4} />
    {moustache && <F d="M-60 64 C-30 50 -10 58 0 66 C10 58 30 50 60 64 C74 70 80 60 84 50 C80 76 50 80 0 74 C-50 80 -80 76 -84 50 C-80 60 -74 70 -60 64Z" fill={BP.black} w={2} />}
    {beard && <F d="M-96 30 C-100 140 -60 250 0 290 C60 250 100 140 96 30 C80 90 50 110 0 110 C-50 110 -80 90 -96 30Z" fill={BP.white} w={4} />}
    {beard && [-40, 0, 40].map((x) => <Ln key={x} d={`M${x} 130 C${x * 1.1} 180 ${x * .8} 230 ${x * .5} 270`} w={2.4} c={BP.grey} />)}
    {female && <><circle cx={28} cy={50} r={20} fill="none" stroke={BP.yellow} strokeWidth={4} /><circle cx={28} cy={50} r={20} fill="none" stroke={BP.black} strokeWidth={1.4} /></>}
    {female && [-1, 1].map((k) => <F key={k} d={circle(k * 112, 60, 16)} fill={BP.yellow} w={3} />)}
    {crown === 'shola' && <ShoLa />}
    {crown === 'demon' && <g><F d="M-100 -60 C-90 -140 90 -140 100 -60 C60 -86 -60 -86 -100 -60Z" fill={BP.red} /><F d="M-80 -110 C-160 -150 -170 -230 -130 -260 C-140 -210 -110 -170 -60 -128Z" fill={BP.white} /><F d="M80 -110 C160 -150 170 -230 130 -260 C140 -210 110 -170 60 -128Z" fill={BP.white} /></g>}
    {crown === 'jata' && <F d="M-70 -100 C-80 -190 -30 -230 0 -236 C30 -230 80 -190 70 -100 C40 -118 -40 -118 -70 -100Z" fill={BP.black} w={3} />}
  </g>;
};
// the white sola-pith crown of Bengal's Durga: a tall scalloped fan with red and green insets
export const ShoLa: React.FC = () => {
  const n = 11, R = 210, pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) { const a = Math.PI * (1.08 + .84 * i / n); pts.push([Math.cos(a) * R, -60 + Math.sin(a) * R * 1.05]); }
  const edge = pts.map(([x, y], i) => i === 0 ? `M${x} ${y}` : `Q${(pts[i - 1][0] + x) / 2 * 1.14} ${(pts[i - 1][1] + y) / 2 * 1.1 - 12} ${x} ${y}`).join(' ');
  return <g>
    <F d={`M-104 -60 L${pts[0][0]} ${pts[0][1]} ${edge.slice(edge.indexOf('Q'))} L104 -60 C60 -84 -60 -84 -104 -60Z`} fill={BP.white} />
    {pts.slice(1, -1).map(([x, y], i) => <F key={i} d={circle(x * .78, -60 + (y + 60) * .78, 11)} fill={i % 2 ? BP.red : BP.green} w={2.4} />)}
    <F d="M-46 -104 L0 -176 L46 -104Z" fill={BP.red} w={3} /><F d="M-22 -110 L0 -148 L22 -110Z" fill={BP.yellow} w={2} />
    <F d={circle(0, -178, 16)} fill={BP.yellow} w={3} />
    <Ln d="M-100 -74 C-40 -96 40 -96 100 -74" w={3} c={BP.red} />
  </g>;
};

// ---------------------------------------------------------------- scroll: floral border strip between panels
export const FloralBand: React.FC<{ y: number; x?: number; w?: number; h?: number }> = ({ y, x = 60, w = 960, h = 70 }) => {
  const n = Math.round(w / 80);
  return <g>
    <F d={`M${x} ${y} h${w} v${h} h${-w}Z`} fill={BP.black} w={0} />
    <Ln d={`M${x} ${y + 6} h${w} M${x} ${y + h - 6} h${w}`} w={3} c={BP.yellow} />
    <Ln d={Array.from({ length: n }, (_, i) => `M${x + i * 80} ${y + h / 2} q20 -18 40 0 q20 18 40 0`).join(' ')} w={4} c={BP.green} />
    {Array.from({ length: n }, (_, i) => { const cx = x + 40 + i * 80, cy = y + h / 2; return <g key={i}>{[0, 1, 2, 3].map((k) => <F key={k} d={lens(cx, cy, cx + Math.cos(k * Math.PI / 2) * 22, cy + Math.sin(k * Math.PI / 2) * 22, 6)} fill={i % 2 ? BP.red : BP.orange} w={2} />)}<circle cx={cx} cy={cy} r={6} fill={BP.yellow} stroke={BP.black} strokeWidth={2} /></g>; })}
  </g>;
};
// side rails of the scroll (the cloth edge), full height
export const ScrollRails: React.FC<{ h: number }> = ({ h }) => <g>
  {[[0, 60], [1020, 60]].map(([x, w], i) => <g key={i}><rect x={x} y={-100} width={w} height={h + 200} fill={BP.red} /><Ln d={`M${x + (i ? 8 : w - 8)} -100 V${h + 100}`} w={4} c={BP.black} />{Array.from({ length: Math.ceil((h + 200) / 60) }, (_, k) => <circle key={k} cx={x + w / 2} cy={-70 + k * 60} r={9} fill={BP.yellow} stroke={BP.black} strokeWidth={2} />)}</g>)}
</g>;
export const PaperOverlay: React.FC = () => <rect width={1080} height={1920} filter="url(#patPaper)" opacity={.42} style={{ mixBlendMode: 'multiply' }} pointerEvents="none" />;

// ---------------------------------------------------------------- flat bits
export const Flower: React.FC<{ x: number; y: number; r?: number; c?: string }> = ({ x, y, r = 16, c = BP.red }) => <g>{[0, 1, 2, 3, 4].map((k) => <F key={k} d={circle(x + Math.cos(k * 1.2566) * r * .7, y + Math.sin(k * 1.2566) * r * .7, r * .5)} fill={c} w={2} />)}<circle cx={x} cy={y} r={r * .35} fill={BP.yellow} stroke={BP.black} strokeWidth={2} /></g>;
export const Scatter: React.FC<{ x: number; y: number; w: number; h: number; n?: number; seed?: number }> = ({ x, y, w, h, n = 20, seed = 2 }) => {
  const r = rng(seed); return <g>{Array.from({ length: n }, (_, i) => <Flower key={i} x={x + r() * w} y={y + r() * h} r={10 + r() * 8} c={[BP.red, BP.white, BP.orange][i % 3]} />)}</g>;
};
