import React from 'react';
import { rng } from '../pahari/rand';

// Kerala mural: pancha-varna — red ochre, yellow ochre, green (dominant), white, black — on lime plaster.
// Large ornamented figures, big expressive eyes, thick flowing outlines, soft tonal modelling along the edges.
export const KM = { red: '#B23A1E', redDeep: '#7E2410', yellow: '#D9A13A', yellowHi: '#EFC56A', green: '#2F6B45', greenDeep: '#1D4A30', greenLite: '#5E9460', white: '#F2EBDC', black: '#1C1410', skin: '#E0A24A', skinGreen: '#6FA27A', plaster: '#E7DCC4' };

export const MuralDefs: React.FC = () => (
  <defs>
    <filter id="plaster" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="5" result="g" />
      <feColorMatrix in="g" type="matrix" values="0 0 0 0 .45  0 0 0 0 .38  0 0 0 0 .28  0 0 0 -1.3 .9" result="g2" />
      <feTurbulence type="fractalNoise" baseFrequency=".008" numOctaves="3" seed="12" result="m" />
      <feColorMatrix in="m" type="matrix" values="0 0 0 0 .5  0 0 0 0 .4  0 0 0 0 .3  0 0 0 -2.4 1.3" result="m2" />
      <feMerge><feMergeNode in="g2" /><feMergeNode in="m2" /></feMerge>
    </filter>
    <filter id="edgeShade" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="9" /></filter>
  </defs>
);

// a modelled mural shape: flat fill, a darker tone blurred inward from the edge (clipped to the shape), thick outline
export const M: React.FC<{ d: string; fill: string; shade?: string; line?: string; w?: number; id?: string; kind?: string }> = ({ d, fill, shade, line = KM.black, w = 4, id, kind }) => {
  const cid = 'mc' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <g data-id={id} data-kind={kind}>
      <clipPath id={cid}><path d={d} /></clipPath>
      <path d={d} fill={fill} />
      {shade && <g clipPath={`url(#${cid})`}><path d={d} fill="none" stroke={shade} strokeWidth={26} filter="url(#edgeShade)" opacity={.8} /></g>}
      {w > 0 && <path d={d} fill="none" stroke={line} strokeWidth={w} strokeLinejoin="round" strokeLinecap="round" />}
    </g>
  );
};
export const circ = (cx: number, cy: number, r: number) => `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
export const ell = (cx: number, cy: number, rx: number, ry: number) => `M${cx - rx} ${cy} a${rx} ${ry} 0 1 0 ${2 * rx} 0 a${rx} ${ry} 0 1 0 ${-2 * rx} 0Z`;

// ---------------------------------------------------------------- dense foliage background: layered leaves and flowers
export const Foliage: React.FC<{ x: number; y: number; w: number; h: number; seed?: number; n?: number }> = ({ x, y, w, h, seed = 3, n = 140 }) => {
  const r = rng(seed), out: React.ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const cx = x + r() * w, cy = y + r() * h, a = r() * 360, L = 30 + r() * 34, c = [KM.green, KM.greenDeep, KM.greenLite][Math.floor(r() * 3)];
    out.push(<g key={i} transform={`translate(${cx} ${cy}) rotate(${a})`}><path d={`M0 ${-L} C${L * .5} ${-L * .4} ${L * .5} ${L * .4} 0 ${L} C${-L * .5} ${L * .4} ${-L * .5} ${-L * .4} 0 ${-L}Z`} fill={c} stroke={KM.black} strokeWidth={2.4} /><path d={`M0 ${-L * .8} V${L * .8}`} stroke={KM.black} strokeWidth={1.4} opacity={.6} /></g>);
    if (r() < .12) out.push(<g key={'f' + i} transform={`translate(${cx + 10} ${cy - 10})`}>{[0, 1, 2, 3, 4, 5].map((k) => { const aa = k / 6 * Math.PI * 2; return <ellipse key={k} cx={Math.cos(aa) * 10} cy={Math.sin(aa) * 10} rx={9} ry={5} transform={`rotate(${aa * 57.3} ${Math.cos(aa) * 10} ${Math.sin(aa) * 10})`} fill={r() < .5 ? KM.red : KM.white} stroke={KM.black} strokeWidth={1.6} />; })}<circle r={5} fill={KM.yellow} stroke={KM.black} strokeWidth={1.4} /></g>);
  }
  return <g data-kind="surface" data-id="foliage">{out}</g>;
};

// ---------------------------------------------------------------- frontal head with kireetam: big lotus eyes, arched brows, ornaments
export const FrontHead: React.FC<{ skin?: string; blink?: number; crown?: 'kireetam' | 'karanda' | null; female?: boolean; s?: number; smile?: boolean }> = ({ skin = KM.skin, blink = 0, crown = 'kireetam', female = true, s = 1, smile = true }) => {
  const o = 1 - blink;
  const eye = (sx: number) => (
    <g transform={`translate(${sx * 30} -8) scale(${sx} 1)`}>
      <M d={`M-22 0 C-12 ${-14 * o} 12 ${-15 * o} 26 -2 C14 ${6 * o} -8 ${7 * o} -22 0Z`} fill={KM.white} w={3} />
      {o > .2 && <><circle cx={3} cy={-2} r={8 * Math.min(1, o + .2)} fill={KM.black} /><circle cx={5} cy={-4} r={2} fill={KM.white} /></>}
      <path d="M26 -2 C32 -3 38 -2 42 0" stroke={KM.red} strokeWidth={3} fill="none" />
      <path d="M-22 -22 C-8 -34 16 -34 30 -22" stroke={KM.black} strokeWidth={4.5} fill="none" strokeLinecap="round" />
    </g>
  );
  return (
    <g transform={`scale(${s})`}>
      {/* hair behind */}
      <M d="M-74 -40 C-80 -110 -40 -140 0 -140 C40 -140 80 -110 74 -40 C80 20 70 60 60 80 L-60 80 C-70 60 -80 20 -74 -40Z" fill={KM.black} w={3} />
      {/* ears with large kundalas */}
      {[-1, 1].map((k) => <g key={k}><M d={ell(k * 64, 0, 12, 22)} fill={skin} shade={KM.redDeep} w={3} /><M d={circ(k * 70, 40, 18)} fill={KM.yellow} shade={KM.redDeep} w={3} /><circle cx={k * 70} cy={40} r={7} fill={KM.red} stroke={KM.black} strokeWidth={2} /></g>)}
      {/* face */}
      <M d="M-62 -40 C-62 -104 62 -104 62 -40 C62 20 40 70 0 78 C-40 70 -62 20 -62 -40Z" fill={skin} shade={KM.redDeep} w={4} id="face" />
      {eye(-1)}{eye(1)}
      <path d="M0 -4 C-4 18 -8 28 -12 34 C-4 38 4 38 10 34" stroke={KM.black} strokeWidth={3} fill="none" />
      <M d={smile ? 'M-18 50 C-8 60 8 60 18 50 C8 56 -8 56 -18 50Z' : 'M-16 52 C-6 56 6 56 16 52 C6 58 -6 58 -16 52Z'} fill={KM.red} w={2.4} />
      <circle cx={0} cy={-52} r={6} fill={KM.red} stroke={KM.black} strokeWidth={2} />
      {female && <path d="M-40 -80 C-20 -96 20 -96 40 -80" stroke={KM.yellow} strokeWidth={8} fill="none" />}
      {/* kireetam: tall tiered crown, heavily ornamented */}
      {crown === 'kireetam' && <g>
        <M d="M-70 -90 L70 -90 L64 -120 L-64 -120Z" fill={KM.yellow} shade={KM.redDeep} w={4} />
        <M d="M-60 -120 L60 -120 C54 -170 30 -230 0 -270 C-30 -230 -54 -170 -60 -120Z" fill={KM.yellow} shade={KM.redDeep} w={4} />
        {[-150, -190, -225].map((y, i) => <path key={i} d={`M${-50 + i * 14} ${y} H${50 - i * 14}`} stroke={KM.redDeep} strokeWidth={5} />)}
        {[-40, -14, 14, 40].map((x) => <M key={x} d={circ(x, -106, 8)} fill={KM.red} w={2.4} />)}
        <M d={circ(0, -160, 14)} fill={KM.green} w={3} />
        <M d="M-12 -270 C-8 -300 8 -300 12 -270Z" fill={KM.red} w={3} />
        {[-1, 1].map((k) => <M key={k} d={`M${k * 64} -118 C${k * 110} -150 ${k * 120} -110 ${k * 100} -80 C${k * 90} -100 ${k * 80} -110 ${k * 64} -100Z`} fill={KM.yellow} shade={KM.redDeep} w={3} />)}
      </g>}
      {crown === 'karanda' && <g><M d="M-56 -96 C-50 -150 -20 -180 0 -196 C20 -180 50 -150 56 -96Z" fill={KM.yellow} shade={KM.redDeep} w={4} />{[-120, -150].map((y) => <path key={y} d={`M-40 ${y} H40`} stroke={KM.redDeep} strokeWidth={4} />)}</g>}
    </g>
  );
};

// ornaments: layered necklaces across the chest, arm bands, waist belt
export const Necklaces: React.FC<{ y: number; w: number }> = ({ y, w }) => (
  <g>{[0, 1, 2].map((i) => <path key={i} d={`M${-w / 2 + i * 12} ${y} C${-w / 4} ${y + 60 + i * 30} ${w / 4} ${y + 60 + i * 30} ${w / 2 - i * 12} ${y}`} fill="none" stroke={[KM.yellow, KM.red, KM.yellow][i]} strokeWidth={i === 1 ? 7 : 10} />)}
    {Array.from({ length: 9 }, (_, i) => { const u = i / 8, x = -w / 2 + 24 + u * (w - 48), yy = y + 30 + Math.sin(u * Math.PI) * 76; return <M key={i} d={circ(x, yy, 7)} fill={i % 2 ? KM.red : KM.green} w={2} />; })}
  </g>
);

export const PlasterOverlay: React.FC = () => <rect width={1080} height={1920} filter="url(#plaster)" opacity={.4} style={{ mixBlendMode: 'multiply' }} pointerEvents="none" />;

// limb tube through joints (flat mural limbs with edge modelling)
function tubeD(pts: [number, number, number][]) {
  const L: string[] = [], R: string[] = [];
  pts.forEach(([x, y, w], i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy) || 1;
    L.push(`${(x - dy / n * w / 2).toFixed(1)} ${(y + dx / n * w / 2).toFixed(1)}`); R.unshift(`${(x + dy / n * w / 2).toFixed(1)} ${(y - dx / n * w / 2).toFixed(1)}`);
  });
  return 'M' + L.join(' L') + ' L' + R.join(' L') + 'Z';
}
export const Limb: React.FC<{ pts: [number, number, number][]; skin: string; band?: number }> = ({ pts, skin, band = .45 }) => {
  const [a, b] = [pts[0], pts[1]], bx = a[0] + (b[0] - a[0]) * band, by = a[1] + (b[1] - a[1]) * band;
  const c = pts[pts.length - 1], d = pts[pts.length - 2], wx = d[0] + (c[0] - d[0]) * .85, wy = d[1] + (c[1] - d[1]) * .85;
  return <g><M d={tubeD(pts)} fill={skin} shade={KM.redDeep} w={4} /><M d={circ(bx, by, pts[0][2] * .42)} fill={KM.yellow} w={3} /><M d={circ(wx, wy, pts[pts.length - 1][2] * .42)} fill={KM.yellow} w={3} /></g>;
};
export const Palm: React.FC<{ x: number; y: number; skin: string; up?: boolean; s?: number }> = ({ x, y, skin, up = true, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}><M d={up ? 'M-22 20 C-24 -10 -20 -40 -16 -54 C-12 -62 -6 -60 -6 -50 L-4 -30 L-2 -62 C0 -72 8 -72 8 -62 L8 -30 L12 -58 C14 -66 22 -66 22 -56 L18 -24 L26 -44 C30 -52 38 -48 34 -38 C30 -20 24 0 20 20Z' : 'M-20 -20 C-24 10 -18 40 -10 56 L10 56 C18 40 24 10 20 -20Z'} fill={skin} shade={KM.redDeep} w={3} /></g>
);
export const KLotus: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-2, -1, 0, 1, 2].map((k) => <M key={k} d={`M0 20 C${k * 18 - 16} 0 ${k * 18 - 10} -30 ${k * 14} -46 C${k * 18 + 10} -30 ${k * 18 + 16} 0 0 20Z`} fill={Math.abs(k) === 2 ? KM.red : KM.white} shade={KM.red} w={2.6} />)}
    <path d="M0 20 V120" stroke={KM.greenDeep} strokeWidth={6} />
  </g>
);
