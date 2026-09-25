import React from 'react';
import { STAGE, SCREEN, WOOD, TEXT_ZONES, GLOW } from './palette';
import { FONT } from './fonts';

const { W, H, screen: S, base: B } = STAGE;

// ---------------------------------------------------------------- lamp flicker (brief §3.3)
// Low-frequency noise on brightness (about ±6%) and hot-spot position, with occasional small gutters.
export function lamp(t: number) {
  const n = .03 * Math.sin(t * 6.1) + .018 * Math.sin(t * 13.7 + 1) + .012 * Math.sin(t * 23.3 + 2);
  const gutter = .08 * Math.pow(Math.max(0, Math.sin(t * .83 + .5)), 24) + .06 * Math.pow(Math.max(0, Math.sin(t * 1.37 + 2)), 30);
  return {
    b: 1 + n - gutter,
    x: 540 + 14 * Math.sin(t * 1.9) + 6 * Math.sin(t * 5.3),
    y: 1170 + 10 * Math.sin(t * 2.3) + 4 * Math.sin(t * 7.1),
  };
}

export const StageDefs: React.FC = () => (
  <defs>
    <clipPath id="screenClip"><rect x={S.x} y={S.y} width={S.w} height={S.h} /></clipPath>
    <filter id="weave" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.95 0.55" numOctaves="2" seed="4" result="n" />
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 .35  0 0 0 0 .2  0 0 0 0 .08  0 0 0 -1.2 1.0" />
    </filter>
    <pattern id="threads" width="6" height="6" patternUnits="userSpaceOnUse">
      <path d="M0 .5 H6 M.5 0 V6" stroke="#6A3A14" strokeWidth=".8" opacity=".45" />
    </pattern>
    <filter id="stains" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.0045" numOctaves="3" seed="21" result="n" />
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 .42  0 0 0 0 .22  0 0 0 0 .07  -2.6 0 0 0 1.35" />
    </filter>
    <filter id="uneven" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.0018" numOctaves="2" seed="8" result="n" />
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 .3  0 0 0 0 .15  0 0 0 0 .05  0 0 0 -1.6 .9" />
    </filter>
    <filter id="holeBloom" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3.2" /></filter>
    <filter id="woodGrain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.003 0.09" numOctaves="3" seed="13" result="n" />
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 .1  0 0 0 0 .05  0 0 0 0 .02  0 0 0 -2.2 1.2" />
    </filter>
  </defs>
);

// the lit cloth screen; `children` are the puppets (clipped to the cloth)
export const Screen: React.FC<{ t: number; lit?: number; spread?: number; children?: React.ReactNode }> = ({ t, lit = 1, spread = 1, children }) => {
  const l = lamp(t), b = l.b * lit;
  return (
    <g clipPath="url(#screenClip)" data-clip="screen">
      <defs>
        <radialGradient id="hot" gradientUnits="userSpaceOnUse" cx={l.x} cy={l.y} r={1250 * Math.max(.05, spread)}>
          <stop offset="0" stopColor={SCREEN.hot} /><stop offset=".22" stopColor={SCREEN.warm} /><stop offset=".55" stopColor={SCREEN.mid} />
          <stop offset=".86" stopColor={SCREEN.edge} /><stop offset="1" stopColor={SCREEN.dark} />
        </radialGradient>
      </defs>
      <rect x={S.x} y={S.y} width={S.w} height={S.h} fill="url(#hot)" />
      <rect x={S.x} y={S.y} width={S.w} height={S.h} fill="url(#threads)" opacity={.35} style={{ mixBlendMode: 'multiply' }} />
      <rect x={S.x} y={S.y} width={S.w} height={S.h} filter="url(#weave)" opacity={.22} />
      <rect x={S.x} y={S.y} width={S.w} height={S.h} filter="url(#uneven)" opacity={.22} />
      <rect x={S.x} y={S.y} width={S.w} height={S.h} filter="url(#stains)" opacity={.2} />
      {children}
      {/* lamp brightness (flicker, gutters, and the lamp being lit at the start) */}
      {b < 1 && <rect x={S.x} y={S.y} width={S.w} height={S.h} fill="#0A0503" opacity={Math.min(1, (1 - b) * 1.35)} />}
      {b > 1 && <rect x={S.x} y={S.y} width={S.w} height={S.h} fill={GLOW} opacity={(b - 1) * 1.1} style={{ mixBlendMode: 'screen' }} />}
    </g>
  );
};

// carved dark-wood frame and base panel
function cuspedInner(): string {
  const x0 = S.x, y0 = S.y, x1 = S.x + S.w, y1 = S.y + S.h, c = 40;
  let d = `M${x0} ${y0}`;
  for (let x = x0; x < x1; x += c) d += ` Q${x + c / 2} ${y0 + 16} ${Math.min(x + c, x1)} ${y0}`;
  for (let y = y0; y < y1; y += c) d += ` Q${x1 - 14} ${y + c / 2} ${x1} ${Math.min(y + c, y1)}`;
  d += ` L${x1} ${y1} L${x0} ${y1}`;
  for (let y = y1; y > y0; y -= c) d += ` Q${x0 + 14} ${y - c / 2} ${x0} ${Math.max(y - c, y0)}`;
  return d + ' Z';
}

const Stud: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 9 }) => (
  <g><circle cx={x} cy={y} r={r} fill={WOOD.brass} /><circle cx={x - r * .3} cy={y - r * .3} r={r * .35} fill={WOOD.brassHi} /><circle cx={x} cy={y} r={r} fill="none" stroke={WOOD.deep} strokeWidth={2} /></g>
);
const CarvedRosette: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 22 }) => (
  <g>
    {Array.from({ length: 8 }, (_, i) => { const a = i / 8 * Math.PI * 2; return <ellipse key={i} cx={x + Math.cos(a) * r * .55} cy={y + Math.sin(a) * r * .55} rx={r * .42} ry={r * .2} transform={`rotate(${a * 180 / Math.PI} ${x + Math.cos(a) * r * .55} ${y + Math.sin(a) * r * .55})`} fill={WOOD.light} stroke={WOOD.deep} strokeWidth={2} />; })}
    <Stud x={x} y={y} r={r * .32} />
  </g>
);

export const Frame: React.FC<{ t: number }> = ({ t }) => {
  const l = lamp(t);
  return (
    <g data-kind="surface">
      <path d={`M0 0 H${W} V${H} H0 Z ${cuspedInner()}`} fillRule="evenodd" fill={WOOD.dark} />
      <clipPath id="frameClip"><path d={`M0 0 H${W} V${H} H0 Z ${cuspedInner()}`} clipRule="evenodd" /></clipPath>
      <g clipPath="url(#frameClip)"><rect width={W} height={H} filter="url(#woodGrain)" opacity={.6} /></g>
      {/* mouldings */}
      <rect x={16} y={16} width={W - 32} height={B.y + 10} fill="none" stroke={WOOD.light} strokeWidth={3} opacity={.6} />
      <rect x={S.x - 12} y={S.y - 12} width={S.w + 24} height={S.h + 24} fill="none" stroke={WOOD.deep} strokeWidth={6} />
      <rect x={S.x - 12} y={S.y - 12} width={S.w + 24} height={S.h + 24} fill="none" stroke={WOOD.brass} strokeWidth={1.6} opacity={.6} />
      {[[30, 30], [W - 30, 30], [30, B.y - 20], [W - 30, B.y - 20]].map(([x, y], i) => <Stud key={i} x={x} y={y} r={8} />)}
      {/* base panel */}
      <rect x={0} y={B.y} width={W} height={H - B.y} fill={WOOD.mid} />
      <rect x={0} y={B.y} width={W} height={H - B.y} filter="url(#woodGrain)" opacity={.7} />
      <rect x={0} y={B.y} width={W} height={18} fill={WOOD.deep} />
      <path d={`M0 ${B.y + 18} H${W}`} stroke={WOOD.brass} strokeWidth={3} opacity={.7} />
      <rect x={40} y={B.y + 44} width={W - 80} height={H - B.y - 80} rx={14} fill={WOOD.dark} stroke={WOOD.light} strokeWidth={4} />
      <rect x={54} y={B.y + 58} width={W - 108} height={H - B.y - 108} rx={10} fill="none" stroke={WOOD.brass} strokeWidth={1.8} opacity={.55} />
      {/* spill of lamp light on the base edge */}
      <rect x={S.x} y={B.y + 18} width={S.w} height={24} fill={`rgba(255,190,110,${.18 * l.b})`} />
      {[[80, B.y + 88], [W - 80, B.y + 88], [80, H - 88], [W - 80, H - 88]].map(([x, y], i) => <g key={i} data-kind="graphic" data-id={'rosette' + i}><CarvedRosette x={x} y={y} r={20} /></g>)}
    </g>
  );
};

// subtitles and moral text: only ever inside the base-panel text zone (brief §3.2, §4)
export const BaseText: React.FC<{ lines: string[]; opacity?: number; size?: number; color?: string }> = ({ lines, opacity = 1, size = 56, color = '#F4E2BC' }) => {
  const z = TEXT_ZONES.subtitle, lh = size * 1.32, y0 = z.y + z.h / 2 - (lines.length - 1) * lh / 2 + size * .34;
  return (
    <g opacity={opacity} data-zone="subtitle">
      {lines.map((l, i) => <text key={i} data-kind="text" data-id={'base-line' + i} x={z.x + z.w / 2} y={y0 + i * lh} textAnchor="middle" fontFamily={FONT.tiro} fontSize={size} fill={color}>{l}</text>)}
    </g>
  );
};

export const StageSvg: React.FC<{ t: number; lit?: number; spread?: number; screen?: React.ReactNode; base?: React.ReactNode; w?: number; h?: number }> = ({ t, lit, spread, screen, base }) => (
  <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
    <StageDefs />
    <Screen t={t} lit={lit} spread={spread}>{screen}</Screen>
    <Frame t={t} />
    {base}
  </svg>
);
