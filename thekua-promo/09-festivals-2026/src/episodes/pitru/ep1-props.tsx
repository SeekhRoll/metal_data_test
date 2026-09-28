import React from 'react';
import { P } from '../../styles/pahari/palette';
import { S, Gold } from '../../styles/pahari/paint';
import { rng } from '../../styles/pahari/rand';

// Pahari fire: layered tongues, flat colour with outline, flickering on twos
export const Fire: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => {
  const k = Math.floor(t * 12) % 4;
  const tongue = (dx: number, h: number, c: string, w: number, i: number) => {
    const sway = [0, 4, -3, 2][(k + i) % 4];
    return <S key={i + c} d={`M${dx - w} 0 C${dx - w} ${-h * .4} ${dx + sway - w * .4} ${-h * .7} ${dx + sway} ${-h} C${dx + sway + w * .4} ${-h * .7} ${dx + w} ${-h * .4} ${dx + w} 0Z`} fill={c} stroke="#8A2A12" sw={1} />;
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} data-kind="graphic" data-id="fire">
      <ellipse cx={0} cy={-40} rx={90} ry={70} fill="#FFB24A" opacity={.3} filter="url(#haloBloom)" />
      {tongue(-30, 70, '#D9432A', 18, 0)}{tongue(28, 76, '#D9432A', 18, 1)}{tongue(0, 110, '#E8702A', 26, 2)}
      {tongue(-14, 62, '#F2A93A', 12, 3)}{tongue(14, 70, '#F2A93A', 12, 4)}{tongue(0, 50, '#FBE08A', 10, 5)}
    </g>
  );
};

// square yajna kund with stepped brick sides
export const Kund: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => (
  <g data-kind="graphic" data-id="kund">
    <Fire x={x} y={y - 26} t={t} s={1.1} />
    <S d={`M${x - 120} ${y} H${x + 120} L${x + 100} ${y - 30} H${x - 100}Z`} fill="#B5643A" sw={1.4} />
    <S d={`M${x - 140} ${y + 22} H${x + 140} L${x + 120} ${y} H${x - 120}Z`} fill="#C97A48" sw={1.4} />
    {Array.from({ length: 11 }, (_, i) => <S key={i} d={`M${x - 118 + i * 22} ${y + 2} V${y + 20}`} stroke="#8A4A2A" sw={1} />)}
    {[-150, 150].map((dx) => <g key={dx}><S d={`M${x + dx - 10} ${y + 22} V${y - 60}`} stroke={P.wood} sw={4} /><S d={`M${x + dx - 26} ${y - 60} H${x + dx + 6}`} stroke={P.saffron} sw={6} /></g>)}
  </g>
);

// earth strata for the cross-section down to Patala
export const Strata: React.FC<{ x: number; y: number; w: number; h: number; seed: number }> = ({ x, y, w, h, seed }) => {
  const r = rng(seed), bands = ['#B99058', '#A07444', '#8A5E36', '#6E4A2C', '#553822', '#3E2A1C', '#2A1D15'], out: React.ReactNode[] = [];
  bands.forEach((c, i) => {
    const y0 = y + i * h / bands.length, y1 = y0 + h / bands.length + 20;
    let d = `M${x} ${y0}`;
    for (let k = 0; k <= 12; k++) d += ` L${x + k * w / 12} ${y0 + Math.sin(k * 1.3 + i) * 10}`;
    d += ` L${x + w} ${y1} L${x} ${y1}Z`;
    out.push(<path key={i} d={d} fill={c} stroke={P.ink} strokeWidth={1} />);
    for (let k = 0; k < 26; k++) out.push(<ellipse key={i + '_' + k} cx={x + r() * w} cy={y0 + 16 + r() * (h / bands.length - 20)} rx={4 + r() * 8} ry={3 + r() * 4} fill="none" stroke="#2A1A12" strokeWidth={.8} opacity={.5} />);
  });
  return <g data-kind="surface" data-id="strata">{out}</g>;
};

// the heap of ashes (drawn gently: a grey mound, nothing more)
export const AshMound: React.FC<{ x: number; y: number; a?: number }> = ({ x, y, a = 1 }) => (
  <g data-kind="graphic" data-id="ash" opacity={a}>
    <S d={`M${x - 170} ${y} C${x - 120} ${y - 60} ${x - 40} ${y - 90} ${x} ${y - 92} C${x + 50} ${y - 90} ${x + 120} ${y - 60} ${x + 170} ${y}Z`} fill="#A7A29A" sw={1.3} />
    <S d={`M${x - 100} ${y - 40} C${x - 40} ${y - 60} ${x + 40} ${y - 60} ${x + 110} ${y - 36}`} stroke="#8A857E" sw={1.2} />
  </g>
);

// rising points of light (liberation / dissolving motes): deterministic particles
export const Motes: React.FC<{ n: number; x: number; y: number; w: number; t: number; col?: string; rise?: number; seed?: number; avoid?: { x: number; y: number; w: number; h: number }[] }> = ({ n, x, y, w, t, col = '#FFE39A', rise = 120, seed = 4, avoid = [] }) => {
  const r = rng(seed), out: React.ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const x0 = x + r() * w, d0 = r() * 1.2, sp = rise * (.6 + r() * .8), ph = r() * 6;
    const u = t - d0; if (u < 0) continue;
    const px = x0 + 14 * Math.sin(u * 1.4 + ph), py = y - u * sp, rr = 2.2 + r() * 2.8, a = Math.min(1, u * 2) * Math.max(0, 1 - u / 5);
    if (a <= 0 || avoid.some((z) => px > z.x - 30 && px < z.x + z.w + 30 && py > z.y - 30 && py < z.y + z.h + 30)) continue;
    out.push(<g key={i} data-kind="graphic" data-id="mote"><circle cx={px} cy={py} r={rr * 3} fill={col} opacity={.25 * a} /><circle cx={px} cy={py} r={rr} fill={col} opacity={a} /></g>);
  }
  return <g>{out}</g>;
};

// water lines trailing the falling Ganga (Pahari convention: parallel wavy strands)
export const WaterFall: React.FC<{ x0: number; y0: number; x1: number; y1: number; w: number; t: number; a?: number }> = ({ x0, y0, x1, y1, w, t, a = 1 }) => {
  const out: React.ReactNode[] = [];
  for (let i = 0; i < 9; i++) {
    const o = (i - 4) / 4 * w / 2;
    let d = '';
    for (let k = 0; k <= 20; k++) { const u = k / 20, X = x0 + (x1 - x0) * u + o + Math.sin(u * 14 - t * 6 + i) * 6, Y = y0 + (y1 - y0) * u; d += `${k ? 'L' : 'M'}${X.toFixed(1)} ${Y.toFixed(1)} `; }
    out.push(<path key={i} d={d} stroke={i % 2 ? '#F4F7F6' : '#9FC3D3'} strokeWidth={i % 2 ? 5 : 3} fill="none" opacity={a} />);
  }
  return <g data-kind="graphic" data-id="waterfall">{out}</g>;
};

// seasons behind the tapasya: rain strokes and snow
export const Rain: React.FC<{ t: number; a: number; x: number; y: number; w: number; h: number }> = ({ t, a, x, y, w, h }) => a <= 0 ? null : (
  <g opacity={a} data-kind="graphic" data-id="rain">{Array.from({ length: 60 }, (_, i) => { const px = x + (i * 97 % w), py = y + ((i * 211 + t * 700) % h); return <path key={i} d={`M${px} ${py} l-6 22`} stroke="#9FB4C8" strokeWidth={1.6} />; })}</g>
);
export const Snow: React.FC<{ t: number; a: number; x: number; y: number; w: number; h: number }> = ({ t, a, x, y, w, h }) => a <= 0 ? null : (
  <g opacity={a} data-kind="graphic" data-id="snow">{Array.from({ length: 50 }, (_, i) => { const px = x + ((i * 131 + Math.sin(t + i) * 20) % w + w) % w, py = y + ((i * 173 + t * 60) % h); return <circle key={i} cx={px} cy={py} r={3} fill="#FBFBF8" />; })}</g>
);

export { Gold };
