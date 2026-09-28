import React, { createContext, useContext } from 'react';
import { P } from './palette';

// Reveal state shared by everything inside a painting: outlines draw on (line 0→1), then flat colour
// fills in (fill 0→1), then a gold shimmer passes (shimmer is a phase, -1 = none).
export type Reveal = { line: number; fill: number; shimmer: number };
export const RevealCtx = createContext<Reveal>({ line: 1, fill: 1, shimmer: -1 });
export const useReveal = () => useContext(RevealCtx);

type SP = { d: string; fill?: string; stroke?: string; sw?: number; op?: number; fillOp?: number; cap?: 'round' | 'butt'; id?: string; kind?: string };
// one painted shape: flat opaque fill + fine even outline
export const S: React.FC<SP> = ({ d, fill = 'none', stroke = P.ink, sw = 2, op = 1, fillOp = 1, cap = 'round', id, kind }) => {
  const r = useReveal();
  const hasLine = stroke !== 'none' && sw > 0;
  return (
    <g opacity={op} data-id={id} data-kind={kind}>
      {fill !== 'none' && r.fill > 0 && <path d={d} fill={fill} opacity={fillOp * r.fill} />}
      {hasLine && r.line > 0 && (
        <path d={d} fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap={cap} strokeLinejoin="round"
          pathLength={1} strokeDasharray={r.line < 1 ? `${r.line} 1` : undefined} />
      )}
    </g>
  );
};

// a gold area: flat gold + highlight band that sweeps across when shimmer >= 0
export const Gold: React.FC<{ d: string; sw?: number; stroke?: string }> = ({ d, sw = 1.4, stroke = P.goldDeep }) => (
  <S d={d} fill="url(#goldFill)" stroke={stroke} sw={sw} />
);

export const ellipse = (cx: number, cy: number, rx: number, ry: number) =>
  `M${cx - rx} ${cy} a${rx} ${ry} 0 1 0 ${2 * rx} 0 a${rx} ${ry} 0 1 0 ${-2 * rx} 0 Z`;
export const circle = (cx: number, cy: number, r: number) => ellipse(cx, cy, r, r);

// SVG defs every Pahari page needs. `shimmer` moves the gold highlight band across the frame (0..1), -1 = still.
export const PahariDefs: React.FC<{ shimmer?: number }> = ({ shimmer = -1 }) => {
  const x = shimmer < 0 ? -2 : -1 + shimmer * 3;
  return (
    <defs>
      <linearGradient id="goldFill" gradientUnits="userSpaceOnUse" x1={x * 1080} y1={0} x2={x * 1080 + 700} y2={1920 * .35}>
        <stop offset="0" stopColor={P.gold} /><stop offset=".42" stopColor={P.gold} /><stop offset=".5" stopColor={P.goldHi} />
        <stop offset=".58" stopColor={P.gold} /><stop offset="1" stopColor={P.gold} />
      </linearGradient>
      {/* handmade wasli paper / gouache grain */}
      <filter id="paperGrain" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" seed="7" result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 .38  0 0 0 0 .28  0 0 0 0 .16  0 0 0 -1.4 .95" />
      </filter>
      <filter id="paperMottle" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency=".006" numOctaves="3" seed="3" result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 .45  0 0 0 0 .32  0 0 0 0 .15  0 0 0 -2.2 1.25" />
      </filter>
      <filter id="haloBloom" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="18" /></filter>
      {/* turns anything into a soft grey shadow (Indra's shadow, figures fading) */}
      <filter id="silhouette" x="-10%" y="-10%" width="120%" height="120%"><feColorMatrix type="matrix" values="0 0 0 0 .16  0 0 0 0 .13  0 0 0 0 .14  0 0 0 .6 0" /></filter>
      <filter id="softBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3" /></filter>
    </defs>
  );
};

// grain + age mottling laid over a whole painting
export const PaperOverlay: React.FC<{ x: number; y: number; w: number; h: number; k?: number }> = ({ x, y, w, h, k = 1 }) => (
  <g pointerEvents="none" data-kind="surface">
    <rect x={x} y={y} width={w} height={h} filter="url(#paperGrain)" opacity={.16 * k} style={{ mixBlendMode: 'multiply' }} />
    <rect x={x} y={y} width={w} height={h} filter="url(#paperMottle)" opacity={.09 * k} style={{ mixBlendMode: 'multiply' }} />
  </g>
);
