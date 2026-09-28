import React from 'react';
import { smooth, tube, lens, circle } from '../madhubani/paint';

// Mysore painting: soft, muted, luminous colour; fine brown lines; restrained raised gold gesso on ornament and arches;
// serene faces; temple arches framing the scene. Radiance is always added as light, never as a change of skin.
export const MY = { ground: '#E9E1CC', sage: '#9DB09A', sageDeep: '#6F8A70', rose: '#D7A79C', blue: '#93A9BC', blueDeep: '#5F7890', red: '#A9514A', maroon: '#7A3A36', purple: '#8E7AA6', purpleDeep: '#62537C', gold: '#C8A15A', goldHi: '#E7CB8A', line: '#4A3426', skin: '#C99471', skinShade: '#A8765A', white: '#F6F2E8', cream: '#EFE6CF', hair: '#2A1E18', ochre: '#B98B4E', stone: '#CFC4AC', moon: '#FFF9E8' };
export { smooth, tube, lens, circle };

export const MyDefs: React.FC = () => (
  <defs>
    {/* gesso: raised gold, lit from the upper left */}
    <filter id="gesso" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="2.2" result="b" />
      <feSpecularLighting in="b" surfaceScale="3" specularConstant=".9" specularExponent="18" lightingColor="#FFF4D6" result="s"><feDistantLight azimuth="225" elevation="42" /></feSpecularLighting>
      <feComposite in="s" in2="SourceAlpha" operator="in" result="s2" />
      <feComposite in="SourceGraphic" in2="s2" operator="arithmetic" k1="0" k2="1" k3=".7" k4="0" />
    </filter>
    <filter id="mySoft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="30" /></filter>
    <filter id="myPaper" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="3" seed="13" result="g" />
      <feColorMatrix in="g" type="matrix" values="0 0 0 0 .42  0 0 0 0 .36  0 0 0 0 .28  0 0 0 -1.6 1" />
    </filter>
    <radialGradient id="mySkin" cx=".45" cy=".4" r=".7"><stop offset="0" stopColor={MY.skin} /><stop offset=".75" stopColor={MY.skin} /><stop offset="1" stopColor={MY.skinShade} /></radialGradient>
    <radialGradient id="myMoon" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor={MY.moon} stopOpacity=".95" /><stop offset=".45" stopColor={MY.moon} stopOpacity=".5" /><stop offset="1" stopColor={MY.moon} stopOpacity="0" /></radialGradient>
    <linearGradient id="myCloth" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#000" stopOpacity=".12" /><stop offset=".5" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".14" /></linearGradient>
  </defs>
);

// soft shape: fill, a faint cloth/volume shading, fine line
export const L: React.FC<{ d: string; fill: string; w?: number; shade?: boolean; line?: string; op?: number }> = ({ d, fill, w = 2.2, shade = true, line = MY.line, op = 1 }) => (
  <g opacity={op}><path d={d} fill={fill} />{shade && <path d={d} fill="url(#myCloth)" />}{w > 0 && <path d={d} fill="none" stroke={line} strokeWidth={w} strokeLinejoin="round" strokeLinecap="round" />}</g>
);
export const Ln: React.FC<{ d: string; w?: number; c?: string; op?: number }> = ({ d, w = 2, c = MY.line, op = 1 }) => <path d={d} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" opacity={op} />;
// raised gold gesso (shape + tiny pearl dots)
export const Gesso: React.FC<{ d: string; dots?: [number, number][] }> = ({ d, dots = [] }) => (
  <g filter="url(#gesso)"><path d={d} fill={MY.gold} stroke="#8C6A2E" strokeWidth={1.4} />{dots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3.2} fill={MY.goldHi} />)}</g>
);

// ---------------------------------------------------------------- serene frontal face (fine line, soft modelling)
export const MyFace: React.FC<{ closed?: number; blink?: number; crown?: 'kireeta' | 'bun' | 'jata' | 'none'; ornaments?: boolean; hairLoose?: boolean }> = ({ closed = 0, blink = 0, crown = 'kireeta', ornaments = true, hairLoose = false }) => {
  const shut = Math.max(closed, blink);
  const eye = (k: number) => <g key={k}>
    {shut < .9 && <><path d={lens(k * 16, -6, k * 62, -10, 7 * (1 - shut) * -k, 3 * k)} fill={MY.white} /><circle cx={k * 38} cy={-8} r={8 * (1 - shut)} fill={MY.hair} /></>}
    <Ln d={`M${k * 14} -6 Q${k * 38} ${-22 * (1 - shut) - 4} ${k * 66} -10`} w={2.6} c={MY.hair} />
    {shut >= .9 && <Ln d={`M${k * 18} -4 Q${k * 38} 4 ${k * 60} -6`} w={1.6} />}
    <Ln d={`M${k * 12} -36 Q${k * 40} -52 ${k * 72} -34`} w={2.4} c={MY.hair} />
  </g>;
  return <g>
    {hairLoose && <L d={smooth([[-96, -60], [-120, 80], [-130, 260], [-60, 300], [60, 300], [130, 260], [120, 80], [96, -60], [0, -130]], true)} fill={MY.hair} shade={false} w={1.4} />}
    {[-1, 1].map((k) => <L key={k} d={lens(k * 88, -24, k * 94, 30, 8)} fill="url(#mySkin)" shade={false} w={1.8} />)}
    <path d={smooth([[0, -110], [74, -94], [92, -30], [84, 40], [52, 100], [0, 118], [-52, 100], [-84, 40], [-92, -30], [-74, -94]], true)} fill="url(#mySkin)" stroke={MY.line} strokeWidth={2} />
    <L d="M-92 -30 C-90 -100 -40 -118 0 -112 C40 -118 90 -100 92 -30 C70 -64 30 -72 0 -70 C-30 -72 -70 -64 -92 -30Z" fill={MY.hair} shade={false} w={1.6} />
    {eye(-1)}{eye(1)}
    <Ln d="M-4 -24 C-2 10 -10 30 -2 40 C4 46 12 42 14 38" w={1.8} />
    <path d="M-8 44 Q2 52 12 44" fill={MY.skinShade} opacity={.5} />
    <path d="M-18 70 Q0 62 18 70 Q0 84 -18 70Z" fill={MY.red} stroke={MY.line} strokeWidth={1.2} />
    <circle cx={0} cy={-52} r={5} fill={MY.red} />
    {ornaments && <>{[-1, 1].map((k) => <Gesso key={k} d={`M${k * 94} 30 a10 10 0 1 0 0.1 0 M${k * 94 - 14} 44 h28 l-6 24 h-16Z`} />)}</>}
    {crown === 'kireeta' && <Gesso d="M-84 -80 C-70 -120 -40 -132 0 -134 C40 -132 70 -120 84 -80 L64 -170 L36 -150 L0 -210 L-36 -150 L-64 -170Z" dots={[[-60, -104], [-30, -118], [0, -122], [30, -118], [60, -104], [0, -170]]} />}
    {crown === 'bun' && <><L d={circle(0, -128, 38)} fill={MY.hair} shade={false} w={1.6} /><Gesso d="M-40 -110 C-20 -96 20 -96 40 -110 L36 -100 C20 -88 -20 -88 -36 -100Z" /></>}
    {crown === 'jata' && <L d="M-60 -96 C-70 -160 -30 -200 0 -206 C30 -200 70 -160 60 -96 C30 -110 -30 -110 -60 -96Z" fill={MY.hair} shade={false} w={1.6} />}
  </g>;
};

// ---------------------------------------------------------------- temple arch (mandapa): cusped arch on two pillars, tied curtains
export const Arch: React.FC<{ x: number; y: number; w: number; h: number; curtain?: string }> = ({ x, y, w, h, curtain = MY.red }) => {
  const cx = x + w / 2, spring = y + w * .5, n = 7, R = w / 2 - 50, bot = y + h;
  const cusps = Array.from({ length: n + 1 }, (_, i) => { const a = Math.PI + Math.PI * i / n; return [cx + Math.cos(a) * R, spring + Math.sin(a) * R] as [number, number]; });
  const curve = cusps.map(([px, py], i) => i === 0 ? `L${px} ${py}` : `A${R * .24} ${R * .24} 0 0 1 ${px} ${py}`).join(' ');
  const opening = `M${x + 50} ${bot} ${curve} L${x + w - 50} ${bot}`;
  return <g>
    <path d={`M${x} ${y} H${x + w} V${bot} H${x}Z ${opening}Z`} fill={MY.stone} fillRule="evenodd" stroke={MY.line} strokeWidth={2} />
    <path d={`M${x} ${y} H${x + w} V${bot} H${x}Z ${opening}Z`} fill="url(#myCloth)" fillRule="evenodd" />
    <g filter="url(#gesso)"><path d={`M${cusps[0][0]} ${cusps[0][1]} ${curve}`} fill="none" stroke={MY.gold} strokeWidth={16} /><path d={`M${cusps[0][0]} ${cusps[0][1]} ${curve}`} fill="none" stroke={MY.goldHi} strokeWidth={3} strokeDasharray="2 12" strokeLinecap="round" /></g>
    {[[x + w * .14, y + w * .12], [x + w * .86, y + w * .12]].map(([px, py], i) => <g key={i}><circle cx={px} cy={py} r={28} fill={MY.sage} stroke={MY.line} strokeWidth={2} /><Gesso d={`M${px - 12} ${py} a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0`} /></g>)}
    <Gesso d={`M${x} ${y} h${w} v14 h${-w}Z`} dots={Array.from({ length: Math.floor(w / 30) }, (_, i) => [x + 15 + i * 30, y + 7] as [number, number])} />
    {[-1, 1].map((k) => { const ex = k < 0 ? x + 50 : x + w - 50; return <L key={k} d={`M${ex} ${spring - 60} C${ex - k * 150} ${spring} ${ex - k * 70} ${spring + 200} ${ex - k * 24} ${spring + 280} C${ex - k * 6} ${spring + 400} ${ex - k * 8} ${bot - 200} ${ex - k * 30} ${bot} L${ex} ${bot}Z`} fill={curtain} />; })}
    {[-1, 1].map((k) => <Gesso key={k} d={circle(k < 0 ? x + 50 - 2 * 1 + 24 : x + w - 74, spring + 270, 12)} />)}
    {[x, x + w - 50].map((px, i) => <g key={i}><Gesso d={`M${px + 4} ${spring - 10} h42 v20 h-42Z M${px + 4} ${bot - 20} h42 v20 h-42Z M${px + 18} ${spring + 30} h14 v${bot - spring - 70} h-14Z`} /></g>)}
  </g>;
};
export const MyPaper: React.FC = () => <rect width={1080} height={1920} filter="url(#myPaper)" opacity={.28} style={{ mixBlendMode: 'multiply' }} pointerEvents="none" />;
// inner light: a moon-coloured bloom behind and a veil of light over the figure (never a change of skin colour)
export const Bloom: React.FC<{ x: number; y: number; r: number; a: number }> = ({ x, y, r, a }) => <circle cx={x} cy={y} r={r} fill="url(#myMoon)" opacity={a} />;
