import React from 'react';
import { Gond, Life } from '../style/gond';
import { C } from '../style/palette';

// A patterned thaali of thekua (seen from the side, slightly above), and a single thekua with its sancha ribs.
export const Thekua: React.FC<{ k: string; x: number; y: number; s?: number; life?: Life }> = ({ k, x, y, s = 1, life }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Gond k={k} d="M-40 0 C-44 -22 -22 -34 0 -34 C22 -34 44 -22 40 0 C38 16 20 22 0 22 C-20 22 -38 16 -40 0 Z" fill={C.marigold} life={life} outline={4} inner={null} />
    {Array.from({ length: 7 }, (_, i) => { const a = -1 + i / 3; return <path key={i} d={`M0 16 L${Math.sin(a) * 30} ${16 - Math.cos(a) * 40}`} stroke={C.brown} strokeWidth={3} />; })}
  </g>
);
export const Thaali: React.FC<{ k: string; x: number; y: number; s?: number; life?: Life; n?: number }> = ({ k, x, y, s = 1, life, n = 5 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Gond k={k + '-rim'} d="M-190 0 C-190 -34 -100 -52 0 -52 C100 -52 190 -34 190 0 C190 34 100 52 0 52 C-100 52 -190 34 -190 0 Z" fill={C.yellow} bands={[{ w: 12, kind: 'solid', color: C.vermilion }, { w: 10, kind: 'dots', color: C.white, gap: 16 }, { w: 10, kind: 'dash', color: C.black, gap: 10 }]} life={life} outline={5} />
    {Array.from({ length: n }, (_, i) => <Thekua key={i} k={`${k}-t${i}`} x={-110 + i * 220 / Math.max(1, n - 1)} y={-14 - (i % 2) * 14} s={.9} life={life} />)}
  </g>
);
