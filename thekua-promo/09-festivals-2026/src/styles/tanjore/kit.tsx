import React from 'react';
import { smooth, tube, lens, circle } from '../madhubani/paint';

// Tanjore painting: rich, vivid colour; a large frontal deity with a rounded face; an ornate prabhavali;
// raised gold-foil relief on ornament and arch, inlaid glass gems (red, green, white). The light sweeps across the gold.
export const TJ = { red: '#A8161B', redDeep: '#6E0B10', green: '#17613A', greenDeep: '#0E4226', blue: '#1D4C94', blueDeep: '#123363', gold: '#D4A43A', goldDeep: '#9A7020', goldHi: '#F6DA85', line: '#2A1408', skin: '#EDBE8E', skinShade: '#CF9A6C', ash: '#CFD8E4', ashShade: '#A9B6C8', white: '#FBF5E8', black: '#140C08', ruby: '#C8102E', emerald: '#12A05C', pearl: '#F4F1EA', silk: '#1E7D4A', tiger: '#E08A2A' };
export { smooth, tube, lens, circle };

// the gold-foil relief filter; `az` moves the light across the raised gold (the signature light sweep)
export const TjDefs: React.FC<{ az?: number }> = ({ az = 225 }) => (
  <defs>
    <filter id="foil" x="-5%" y="-5%" width="110%" height="110%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="2.6" result="h" />
      <feDiffuseLighting in="h" surfaceScale="5" diffuseConstant="1.15" lightingColor="#FFFFFF" result="d"><feDistantLight azimuth={az} elevation="48" /></feDiffuseLighting>
      <feComposite in="SourceGraphic" in2="d" operator="arithmetic" k1="1.1" k2="0" k3="0" k4="0" result="lit" />
      <feSpecularLighting in="h" surfaceScale="5" specularConstant="1.2" specularExponent="24" lightingColor="#FFF3C8" result="s"><feDistantLight azimuth={az} elevation="40" /></feSpecularLighting>
      <feComposite in="s" in2="SourceAlpha" operator="in" result="s2" />
      <feComposite in="lit" in2="s2" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
    </filter>
    <filter id="tjCloth" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="17" result="g" />
      <feColorMatrix in="g" type="matrix" values="0 0 0 0 .3  0 0 0 0 .2  0 0 0 0 .1  0 0 0 -1.4 .9" />
    </filter>
    <filter id="tjGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="24" /></filter>
    <radialGradient id="tjSkin" cx=".45" cy=".4" r=".75"><stop offset="0" stopColor={TJ.skin} /><stop offset=".8" stopColor={TJ.skin} /><stop offset="1" stopColor={TJ.skinShade} /></radialGradient>
    <radialGradient id="tjAsh" cx=".45" cy=".4" r=".75"><stop offset="0" stopColor={TJ.ash} /><stop offset=".8" stopColor={TJ.ash} /><stop offset="1" stopColor={TJ.ashShade} /></radialGradient>
    <radialGradient id="tjLight" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#FFF8DC" stopOpacity="1" /><stop offset=".4" stopColor="#FFE9A0" stopOpacity=".6" /><stop offset="1" stopColor="#FFE9A0" stopOpacity="0" /></radialGradient>
    <pattern id="tjTiger" width="40" height="30" patternUnits="userSpaceOnUse"><path d="M4 4 C14 10 10 20 20 26 M24 2 C30 8 30 16 36 22" stroke={TJ.black} strokeWidth="4" fill="none" strokeLinecap="round" /></pattern>
    <pattern id="tjButi" width="36" height="36" patternUnits="userSpaceOnUse"><circle cx="18" cy="18" r="4" fill={TJ.goldHi} /><circle cx="0" cy="0" r="2.6" fill={TJ.goldHi} /><circle cx="36" cy="36" r="2.6" fill={TJ.goldHi} /></pattern>
  </defs>
);

export const P: React.FC<{ d: string; fill: string; w?: number; pat?: string; line?: string }> = ({ d, fill, w = 3.4, pat, line = TJ.line }) => (
  <g><path d={d} fill={fill} />{pat && <path d={d} fill={`url(#${pat})`} />}{w > 0 && <path d={d} fill="none" stroke={line} strokeWidth={w} strokeLinejoin="round" strokeLinecap="round" />}</g>
);
export const Ln: React.FC<{ d: string; w?: number; c?: string; op?: number }> = ({ d, w = 3, c = TJ.line, op = 1 }) => <path d={d} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" opacity={op} />;
// raised gold foil: shapes plus beading, lit by the foil filter
export const Foil: React.FC<{ d: string; beads?: [number, number][]; r?: number; children?: React.ReactNode }> = ({ d, beads = [], r = 4, children }) => (
  <g filter="url(#foil)"><path d={d} fill={TJ.gold} stroke={TJ.goldDeep} strokeWidth={1.6} />{beads.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={r} fill={TJ.gold} />)}{children}</g>
);
// inlaid glass gem with a twinkling specular point
export const Gem: React.FC<{ x: number; y: number; r?: number; c?: string; t?: number; ph?: number }> = ({ x, y, r = 9, c = TJ.ruby, t = 0, ph = 0 }) => {
  const tw = Math.max(0, Math.sin(t * 2.2 + ph * 7.3)) ** 6;
  return <g><circle cx={x} cy={y} r={r + 2.5} fill={TJ.goldDeep} /><circle cx={x} cy={y} r={r} fill={c} /><circle cx={x - r * .35} cy={y - r * .35} r={r * .3} fill="#fff" opacity={.7} />
    {tw > .05 && <path d={`M${x - r * 1.8 * tw} ${y} L${x} ${y - r * .3} L${x + r * 1.8 * tw} ${y} L${x} ${y + r * .3}Z M${x} ${y - r * 1.8 * tw} L${x + r * .3} ${y} L${x} ${y + r * 1.8 * tw} L${x - r * .3} ${y}Z`} fill="#fff" opacity={tw} />}</g>;
};
export const gemRow = (pts: [number, number][], t = 0, r = 8, cs = [TJ.ruby, TJ.emerald, TJ.pearl]) => pts.map(([x, y], i) => <Gem key={i} x={x} y={y} r={r} c={cs[i % cs.length]} t={t} ph={i} />);

// ---------------------------------------------------------------- the round Tanjore face
export const TFace: React.FC<{ skin?: string; closed?: number; blink?: number; crown?: 'kireetam' | 'jata' | 'none'; t?: number; female?: boolean }> = ({ skin = 'url(#tjSkin)', closed = 0, blink = 0, crown = 'kireetam', t = 0, female = true }) => {
  const shut = Math.max(closed, blink);
  const eye = (k: number) => <g key={k}>
    {shut < .9 && <><path d={lens(k * 14, -8, k * 70, -12, 10 * (1 - shut) * -k, 4 * k)} fill={TJ.white} /><circle cx={k * 40} cy={-11} r={11 * (1 - shut)} fill={TJ.black} /><circle cx={k * 36} cy={-15} r={3} fill="#fff" opacity={1 - shut} /></>}
    <Ln d={`M${k * 12} -8 Q${k * 40} ${-30 * (1 - shut) - 6} ${k * 76} -14`} w={4} c={TJ.black} />
    <Ln d={`M${k * 14} -6 Q${k * 42} ${4 - shut * 2} ${k * 70} -10`} w={2} />
    <Ln d={`M${k * 10} -42 Q${k * 42} -60 ${k * 80} -40`} w={4} c={TJ.black} />
  </g>;
  return <g>
    {[-1, 1].map((k) => <P key={k} d={lens(k * 100, -30, k * 106, 36, 9)} fill={skin} w={2.4} />)}
    <P d={smooth([[0, -118], [82, -104], [104, -30], [98, 44], [66, 106], [0, 126], [-66, 106], [-98, 44], [-104, -30], [-82, -104]], true)} fill={skin} />
    {eye(-1)}{eye(1)}
    <Ln d="M-4 -26 C-2 10 -12 32 -2 42 C6 48 14 44 16 40" w={2.4} />
    <path d="M-22 72 Q0 64 22 72 Q0 88 -22 72Z" fill={TJ.red} stroke={TJ.line} strokeWidth={1.6} />
    {female ? <circle cx={0} cy={-62} r={7} fill={TJ.red} /> : <g><Ln d="M-40 -66 H40 M-40 -58 H40 M-40 -50 H40" w={3} c={TJ.white} /><circle cx={0} cy={-58} r={6} fill={TJ.red} /></g>}
    {[-1, 1].map((k) => <g key={k}><Foil d={circle(k * 104, 50, 14)} /><Gem x={k * 104} y={50} r={6} c={k < 0 ? TJ.ruby : TJ.emerald} t={t} ph={k + 3} /></g>)}
    {crown === 'kireetam' && <><Foil d="M-100 -60 C-96 -120 -50 -140 0 -142 C50 -140 96 -120 100 -60 C60 -86 -60 -86 -100 -60Z M-84 -118 L-64 -240 C-40 -290 40 -290 64 -240 L84 -118 C40 -134 -40 -134 -84 -118Z" beads={Array.from({ length: 9 }, (_, i) => [-80 + i * 20, -86 + Math.abs(i - 4) * 4] as [number, number])} />
      {gemRow([[0, -110], [-40, -170], [40, -170], [0, -220], [-30, -250], [30, -250]], t, 9)}
      <Foil d="M-20 -280 C-20 -320 20 -320 20 -280Z M-6 -318 L0 -350 L6 -318Z" /></>}
    {crown === 'jata' && <><P d="M-96 -54 C-110 -170 -60 -250 0 -262 C60 -250 110 -170 96 -54 C60 -80 -60 -80 -96 -54Z" fill={TJ.black} />
      {[-50, -20, 10, 40].map((x, i) => <Ln key={i} d={`M${x} -80 C${x - 10} -140 ${x + 10} -200 ${x} -250`} w={2.4} c="#5A3A22" />)}
      <Foil d="M-100 -60 C-60 -90 60 -90 100 -60 L96 -46 C60 -74 -60 -74 -96 -46Z" beads={[[-60, -70], [-20, -76], [20, -76], [60, -70]]} />
      <P d="M30 -230 C70 -236 96 -210 94 -180 C84 -206 60 -218 34 -214Z" fill={TJ.white} /></>}
  </g>;
};

// ---------------------------------------------------------------- prabhavali: the ornate arch of gold relief with gems, makara ends, kirtimukha crest
export const Prabhavali: React.FC<{ cx: number; base: number; w: number; h: number; t?: number }> = ({ cx, base, w, h, t = 0 }) => {
  const R = w / 2, top = base - h, sp = top + R;
  const arc = (r: number) => `M${cx - r} ${base} V${sp} A${r} ${r} 0 0 1 ${cx + r} ${sp} V${base}`;
  const flames = Array.from({ length: 23 }, (_, i) => { const a = Math.PI + Math.PI * (i + .5) / 23, x = cx + Math.cos(a) * (R + 6), y = sp + Math.sin(a) * (R + 6); return `M${x} ${y} l${Math.cos(a - .18) * 26} ${Math.sin(a - .18) * 26} L${cx + Math.cos(a + .08) * (R + 6)} ${sp + Math.sin(a + .08) * (R + 6)}Z`; }).join(' ');
  const gems: [number, number][] = Array.from({ length: 15 }, (_, i) => { const a = Math.PI + Math.PI * (i + .5) / 15; return [cx + Math.cos(a) * (R - 22), sp + Math.sin(a) * (R - 22)]; });
  const sideGems: [number, number][] = []; for (let y = sp + 60; y < base - 40; y += 90) { sideGems.push([cx - R + 22, y], [cx + R - 22, y]); }
  return <g>
    <g filter="url(#foil)"><path d={arc(R)} fill="none" stroke={TJ.gold} strokeWidth={48} /><path d={flames} fill={TJ.gold} stroke={TJ.goldDeep} strokeWidth={1.4} />
      <path d={arc(R - 44)} fill="none" stroke={TJ.goldDeep} strokeWidth={4} /><path d={arc(R + 24)} fill="none" stroke={TJ.goldDeep} strokeWidth={3} />
      <path d={`M${cx - 70} ${top - 10} C${cx - 70} ${top - 90} ${cx + 70} ${top - 90} ${cx + 70} ${top - 10} C${cx + 40} ${top + 10} ${cx - 40} ${top + 10} ${cx - 70} ${top - 10}Z`} fill={TJ.gold} stroke={TJ.goldDeep} strokeWidth={2} />
      {[-1, 1].map((k) => <path key={k} d={`M${cx + k * R} ${base} c${k * 40} -10 ${k * 70} -40 ${k * 60} -80 c${-k * 10} 30 ${-k * 30} 40 ${-k * 50} 30Z`} fill={TJ.gold} stroke={TJ.goldDeep} strokeWidth={2} />)}
    </g>
    {gemRow([...gems, ...sideGems], t, 10)}
    <Gem x={cx} y={top - 50} r={18} c={TJ.ruby} t={t} ph={9} />
    {[-1, 1].map((k) => <circle key={k} cx={cx + k * 30} cy={top - 60} r={7} fill={TJ.black} />)}
  </g>;
};

// the painting's wooden frame, gilded with relief, and the red ground inside
export const TjFrame: React.FC<{ t?: number }> = ({ t = 0 }) => <g>
  <g filter="url(#foil)">
    <path d="M20 20 H1060 V1600 H20Z M64 64 V1556 H1016 V64Z" fill={TJ.gold} fillRule="evenodd" stroke={TJ.goldDeep} strokeWidth={2} />
    {Array.from({ length: 26 }, (_, i) => <circle key={'t' + i} cx={52 + i * 39} cy={42} r={6} fill={TJ.gold} />)}
    {Array.from({ length: 26 }, (_, i) => <circle key={'b' + i} cx={52 + i * 39} cy={1578} r={6} fill={TJ.gold} />)}
    {Array.from({ length: 40 }, (_, i) => <circle key={'l' + i} cx={42} cy={80 + i * 38} r={6} fill={TJ.gold} />)}
    {Array.from({ length: 40 }, (_, i) => <circle key={'r' + i} cx={1038} cy={80 + i * 38} r={6} fill={TJ.gold} />)}
  </g>
  {gemRow([[42, 42], [1038, 42], [42, 1578], [1038, 1578]], t, 11)}
</g>;
// the curtain swag at the top of the scene
export const Swag: React.FC = () => <g>
  {[0, 1, 2, 3].map((i) => <P key={i} d={`M${64 + i * 238} 64 Q${183 + i * 238} 180 ${302 + i * 238} 64Z`} fill={i % 2 ? TJ.green : TJ.red} />)}
  <Foil d="M64 64 H1016 V78 H64Z" beads={Array.from({ length: 5 }, (_, i) => [64 + i * 238, 80] as [number, number])} r={9} />
</g>;
export const Lotus: React.FC<{ x: number; y: number; w: number }> = ({ x, y, w }) => <g>
  {Array.from({ length: 9 }, (_, i) => { const px = x - w / 2 + (i + .5) * w / 9; return <P key={i} d={`M${px - w / 16} ${y} C${px - w / 18} ${y - 60} ${px} ${y - 80} ${px} ${y - 90} C${px} ${y - 80} ${px + w / 18} ${y - 60} ${px + w / 16} ${y}Z`} fill={i % 2 ? '#E8889A' : '#F4B9C4'} w={2.4} />; })}
  <Foil d={`M${x - w / 2 - 10} ${y} H${x + w / 2 + 10} V${y + 30} H${x - w / 2 - 10}Z`} beads={Array.from({ length: 12 }, (_, i) => [x - w / 2 + i * w / 11, y + 15] as [number, number])} />
</g>;
