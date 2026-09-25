import React from 'react';
import { C } from '../styles/palette';
import { Bharni, lens } from '../styles/paint';
import { LotusTop } from '../motifs';

// Every frame is framed (brief 3.2): outer double ink line, a band of vermilion teeth, a leafy vine band,
// inner double line, and a lotus in each corner. `draw` (0..1) paints it on stroke by stroke.
export const MadhubaniBorder: React.FC<{ w: number; h: number; inset?: number; band?: number; draw?: number }> = ({ w, h, inset = 22, band = 74, draw = 1 }) => {
  const x0 = inset, y0 = inset, x1 = w - inset, y1 = h - inset;
  const per = 2 * (x1 - x0 + y1 - y0);
  const dash = (len: number) => ({ strokeDasharray: len, strokeDashoffset: len * (1 - draw) });
  const rect = (d: number) => `M${x0 + d} ${y0 + d} H${x1 - d} V${y1 - d} H${x0 + d} Z`;
  // motifs along the band are revealed in order around the frame
  const along: { x: number; y: number; a: number; u: number }[] = [];
  const step = 46, sides: [number, number, number, number, number][] = [
    [x0 + band / 2, y0 + band / 2, x1 - band / 2, y0 + band / 2, 0], [x1 - band / 2, y0 + band / 2, x1 - band / 2, y1 - band / 2, 90],
    [x1 - band / 2, y1 - band / 2, x0 + band / 2, y1 - band / 2, 180], [x0 + band / 2, y1 - band / 2, x0 + band / 2, y0 + band / 2, 270]];
  let acc = 0; const total = sides.reduce((s, [a, b, c, d]) => s + Math.hypot(c - a, d - b), 0);
  for (const [ax, ay, bx, by, ang] of sides) {
    const L = Math.hypot(bx - ax, by - ay), n = Math.floor(L / step);
    for (let i = 1; i < n; i++) { const k = i / n; along.push({ x: ax + (bx - ax) * k, y: ay + (by - ay) * k, a: ang, u: (acc + L * k) / total }); }
    acc += L;
  }
  return (
    <g>
      {/* band ground */}
      <path d={`${rect(0)} ${rect(band)}`} fillRule="evenodd" fill={C.paper} opacity={draw > 0 ? 1 : 0} />
      {/* teeth + vine leaves */}
      {along.map((m, i) => m.u < draw && (
        <g key={i} transform={`translate(${m.x} ${m.y}) rotate(${m.a})`}>
          <path d={`M-${step / 2} ${-band / 2 + 2} L0 ${-band / 2 + 20} L${step / 2} ${-band / 2 + 2} Z`} fill={i % 2 ? C.vermilion : C.turmeric} stroke={C.black} strokeWidth={2.5} strokeLinejoin="round" />
          <path d={`M-${step / 2} 8 Q0 ${i % 2 ? -4 : 20} ${step / 2} 8`} fill="none" stroke={C.black} strokeWidth={3} />
          <Bharni d={lens(0, 8, i % 2 ? 14 : -14, i % 2 ? -18 : 30, 8)} fill={C.leaf} band={2} hatch={false} />
          <circle cx={0} cy={band / 2 - 10} r={4} fill={C.black} />
        </g>
      ))}
      {/* double ink lines, painted on */}
      {[0, 10, band - 10, band].map((d, i) => <path key={i} d={rect(d)} fill="none" stroke={C.black} strokeWidth={i % 3 === 0 ? 5 : 3} style={dash(per)} />)}
      <path d={rect(5)} fill="none" stroke={C.black} strokeWidth={10} strokeDasharray="1.5 4" opacity={draw >= 1 ? 1 : 0} />
      <path d={rect(band - 5)} fill="none" stroke={C.black} strokeWidth={10} strokeDasharray="1.5 4" opacity={draw >= 1 ? 1 : 0} />
      {/* corner lotuses bloom last */}
      {[[x0 + band / 2, y0 + band / 2], [x1 - band / 2, y0 + band / 2], [x1 - band / 2, y1 - band / 2], [x0 + band / 2, y1 - band / 2]].map(([x, y], i) => (
        <LotusTop key={i} x={x} y={y} s={0.42} grow={Math.max(0, Math.min(1, (draw - .8) * 5))} />
      ))}
    </g>
  );
};
