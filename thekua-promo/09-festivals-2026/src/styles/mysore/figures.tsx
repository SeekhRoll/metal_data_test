import React from 'react';
import { MY, L, Ln, Gesso, MyFace, smooth, tube, lens, circle } from './kit';

type Pt = [number, number, number];
const Arm: React.FC<{ sp: Pt[]; bangles?: boolean }> = ({ sp, bangles = true }) => {
  const e = sp[sp.length - 1], p = sp[sp.length - 2], bx = p[0] + (e[0] - p[0]) * .8, by = p[1] + (e[1] - p[1]) * .8;
  return <g><path d={tube(sp)} fill="url(#mySkin)" stroke={MY.line} strokeWidth={2} />{bangles && <Gesso d={lens(bx - 16, by, bx + 16, by, 5)} />}</g>;
};
const Hand: React.FC<{ x: number; y: number; rot?: number; s?: number }> = ({ x, y, rot = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}><path d="M-18 14 C-22 -8 -20 -30 -14 -42 C-10 -48 -5 -46 -5 -40 L-3 -22 L-1 -48 C1 -55 7 -55 7 -48 L7 -22 L11 -45 C13 -52 20 -52 20 -44 L16 -16 L23 -30 C27 -36 33 -33 30 -25 C26 -10 21 4 16 14Z" fill="url(#mySkin)" stroke={MY.line} strokeWidth={1.8} /></g>
);
export const Trishul: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}><Ln d="M0 260 V-80" w={6} c={MY.line} /><Ln d="M0 260 V-80" w={3} c={MY.goldHi} /><Gesso d="M-44 -70 C-50 -110 -40 -140 -30 -160 C-30 -130 -20 -100 -6 -92 L-4 -170 L0 -200 L4 -170 L6 -92 C20 -100 30 -130 30 -160 C40 -140 50 -110 44 -70 C30 -80 12 -84 0 -84 C-12 -84 -30 -80 -44 -70Z" /></g>
);
export const Damaru: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}><L d="M-30 -40 H30 L4 0 L30 40 H-30 L-4 0Z" fill={MY.maroon} w={1.8} /><Gesso d="M-32 -44 h64 v8 h-64Z M-32 36 h64 v8 h-64Z" /><Ln d="M4 0 C20 10 30 20 36 34" w={1.6} /><circle cx={36} cy={36} r={5} fill={MY.gold} /></g>
);

// seated four-armed Devi in white (Mahagauri) or Parvati in tapas (two arms, dhyana, bark-cloth). Origin: seat centre.
export const MyDevi: React.FC<{ tapas?: boolean; blink?: number; t?: number; saree?: string; border?: string }> = ({ tapas = false, blink = 0, t = 0, saree = MY.white, border = MY.gold }) => {
  const br = Math.sin(t * 1.1) * 2;
  return <g>
    {!tapas && <>
      <Arm sp={[[64, -350, 30], [136, -400, 26], [146, -490, 22]]} /><Trishul x={152} y={-510} s={.9} /><Hand x={148} y={-494} s={.8} />
      <Arm sp={[[-64, -350, 30], [-136, -400, 26], [-146, -490, 22]]} /><Damaru x={-148} y={-530} s={.8} /><Hand x={-148} y={-494} s={.8} />
    </>}
    {/* folded legs, saree */}
    {tapas && <path d={smooth([[-70, -470], [-96, -380], [-110, -250], [-90, -170], [0, -190], [90, -170], [110, -250], [96, -380], [70, -470]], true)} fill={MY.hair} stroke={MY.line} strokeWidth={1.4} />}
    <path d="M-56 -240 C-60 -200 -62 -170 -66 -150 L66 -150 C62 -170 60 -200 56 -240Z" fill="url(#mySkin)" stroke={MY.line} strokeWidth={2} />
    <L d="M-70 -150 C-200 -140 -250 -70 -240 0 L240 0 C250 -70 200 -140 70 -150Z" fill={tapas ? MY.ochre : saree} />
    <L d="M-66 -160 H66 L60 -140 H-60Z" fill={tapas ? MY.ochre : saree} />
    <Ln d="M-240 -8 C-120 14 120 14 240 -8" w={10} c={border} /><Ln d="M-220 -50 C-140 -76 -40 -64 0 -40 C40 -64 140 -76 220 -50" w={1.6} op={.6} /><Ln d="M-150 -110 C-90 -90 -40 -70 0 -40 M150 -110 C90 -90 40 -70 0 -40" w={1.4} op={.5} />
    {[-1, 1].map((k) => <path key={k} d={`M${k * 20} -40 C${k * 60} -54 ${k * 110} -52 ${k * 130} -36 C${k * 110} -24 ${k * 60} -22 ${k * 20} -30Z`} fill="url(#mySkin)" stroke={MY.line} strokeWidth={1.8} />)}
    {/* torso */}
    <g transform={`translate(0 ${-br - 50})`}>
      <path d="M-78 -330 C-82 -270 -70 -210 -56 -170 L56 -170 C70 -210 82 -270 78 -330 C44 -348 -44 -348 -78 -330Z" fill="url(#mySkin)" stroke={MY.line} strokeWidth={2} />
      <L d="M-76 -300 C-40 -312 40 -312 76 -300 L70 -250 C36 -238 -36 -238 -70 -250Z" fill={tapas ? MY.ochre : saree} />
      {/* pallu over the left shoulder */}
      <L d="M-78 -330 C-40 -300 20 -240 60 -176 L20 -170 C-10 -220 -50 -270 -84 -290Z" fill={tapas ? MY.ochre : saree} />
      {!tapas && <Ln d="M-78 -330 C-40 -300 20 -240 60 -176" w={8} c={border} />}
      {!tapas && <Gesso d="M-50 -330 C-30 -290 30 -290 50 -330 L42 -330 C26 -300 -26 -300 -42 -330Z" dots={[[-30, -310], [0, -300], [30, -310]]} />}
      {tapas && <Ln d="M-40 -320 C-20 -290 20 -290 40 -320" w={3} c={MY.maroon} />}
      {tapas ? <>
        <Arm sp={[[-76, -310, 34], [-116, -220, 28], [-40, -140, 22]]} bangles={false} />
        <Arm sp={[[76, -310, 34], [116, -220, 28], [40, -140, 22]]} bangles={false} />
        <path d={lens(-44, -136, 44, -136, 10)} fill="url(#mySkin)" stroke={MY.line} strokeWidth={1.8} />
      </> : <>
        <Arm sp={[[76, -310, 34], [110, -230, 28], [104, -176, 22]]} /><Hand x={106} y={-184} s={.9} />
        <Arm sp={[[-76, -310, 34], [-110, -230, 28], [-104, -150, 22]]} /><Hand x={-104} y={-136} rot={180} s={.9} />
      </>}
      <path d="M-18 -360 V-320 H18 V-360Z" fill="url(#mySkin)" stroke={MY.line} strokeWidth={1.6} />
      <g transform="translate(0 -420) scale(.7)"><MyFace crown={tapas ? 'bun' : 'kireeta'} ornaments={!tapas} closed={tapas ? 1 : 0} blink={blink} /></g>
    </g>
  </g>;
};

// Nandi, the white bull, reclining, profile facing left. Origin: under the belly.
export const Nandi: React.FC<{ blink?: number }> = ({ blink = 0 }) => <g>
  <L d={smooth([[-160, -60], [-120, -150], [-40, -170], [40, -200], [100, -170], [200, -140], [240, -70], [220, 0], [-160, 0]], true)} fill={MY.white} />
  <L d="M-40 -170 C-60 -80 60 -60 140 -160 L100 -170 C60 -110 -10 -110 -10 -176Z" fill={MY.red} /><Ln d="M-40 -170 C-60 -80 60 -60 140 -160" w={6} c={MY.gold} />
  <L d={smooth([[-150, -90], [-230, -110], [-280, -80], [-270, -30], [-220, -20], [-160, -40]], true)} fill={MY.white} />
  <L d="M-200 -110 C-220 -170 -190 -190 -170 -180 C-190 -170 -190 -140 -180 -112Z" fill={MY.stone} />
  <L d="M-250 -106 C-280 -150 -260 -170 -240 -164 C-256 -150 -254 -130 -238 -110Z" fill={MY.stone} />
  <path d={lens(-236, -80, -218, -84, 4 * (1 - blink))} fill={MY.hair} />
  <Gesso d="M-170 -60 C-150 -20 -130 -10 -110 -10 L-110 0 C-140 0 -170 -20 -180 -50Z" dots={[[-160, -30], [-140, -16]]} />
  {[-90, 160].map((x) => <L key={x} d={`M${x} -20 C${x - 60} -20 ${x - 80} 0 ${x - 70} 6 L${x + 20} 6Z`} fill={MY.white} />)}
  <Ln d="M220 -80 C250 -60 250 -20 236 10" w={3} />
</g>;
