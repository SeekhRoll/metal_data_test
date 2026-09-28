import React from 'react';
import { P } from './palette';
import { S, Gold, circle } from './paint';

type Pt = [number, number];

// A tapered limb through 2+ joints: an outline built from the joint centreline and per-joint widths,
// smoothed with quadratic curves, so poses are drawn (swapped on twos) rather than rotated rigidly.
export function limb(pts: Pt[], wd: number[]) {
  const L: Pt[] = [], R: Pt[] = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy) || 1, nx = -dy / n, ny = dx / n, w = wd[i] / 2;
    L.push([pts[i][0] + nx * w, pts[i][1] + ny * w]); R.push([pts[i][0] - nx * w, pts[i][1] - ny * w]);
  }
  const side = (q: Pt[]) => { let d = ''; for (let i = 1; i < q.length; i++) { const m = i < q.length - 1 ? [(q[i][0] + q[i + 1][0]) / 2, (q[i][1] + q[i + 1][1]) / 2] : q[i]; d += ` Q${q[i][0].toFixed(1)} ${q[i][1].toFixed(1)} ${m[0].toFixed(1)} ${m[1].toFixed(1)}`; } return d; };
  const Rr = [...R].reverse();
  return `M${L[0][0].toFixed(1)} ${L[0][1].toFixed(1)}` + side(L) + ` L${Rr[0][0].toFixed(1)} ${Rr[0][1].toFixed(1)}` + side(Rr) + 'Z';
}

// hand at the end of a forearm, oriented along the last segment. `kind`: open palm, fist (gripping), point, abhaya (raised palm)
export const Hand: React.FC<{ at: Pt; from: Pt; kind?: 'open' | 'fist' | 'point' | 'abhaya'; skin?: string; s?: number }> = ({ at, from, kind = 'open', skin = P.skin, s = 1 }) => {
  const a = Math.atan2(at[1] - from[1], at[0] - from[0]) * 180 / Math.PI;
  const shapes: Record<string, string> = {
    open: 'M-2 -6 C8 -8 18 -6 24 -2 C26 0 24 3 20 3 L22 5 C18 8 8 8 -2 6Z',
    fist: 'M-2 -7 C6 -9 14 -8 16 -2 C17 4 14 8 6 8 L-2 7Z',
    point: 'M-2 -6 C6 -8 12 -6 14 -3 L30 -3 C32 -1 32 1 30 1 L14 2 C14 7 6 8 -2 6Z',
    abhaya: 'M-2 -7 C4 -10 10 -14 16 -22 C18 -24 21 -22 19 -19 L16 -12 C20 -10 20 -4 16 0 C10 6 2 8 -2 6Z',
  };
  return (
    <g transform={`translate(${at[0]} ${at[1]}) rotate(${a}) scale(${s})`}>
      <S d={shapes[kind]} fill={skin} stroke={P.skinLine} sw={1.1} />
      {kind === 'open' && <S d="M8 -1 L20 0 M8 2 L18 3" stroke={P.skinLine} sw={.6} />}
      {kind === 'fist' && <S d="M8 -4 C10 -2 10 2 8 4 M12 -4 C14 -2 14 2 12 4" stroke={P.skinLine} sw={.6} />}
    </g>
  );
};

// gold bangles/armlet across a limb segment
export const Band: React.FC<{ a: Pt; b: Pt; u: number; w: number; n?: number; col?: string }> = ({ a, b, u, w, n = 1, col }) => {
  const x = a[0] + (b[0] - a[0]) * u, y = a[1] + (b[1] - a[1]) * u, ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
  return <g transform={`translate(${x} ${y}) rotate(${ang})`}>{Array.from({ length: n }, (_, i) => <rect key={i} x={-1.4 + i * 3.2} y={-w / 2 - .5} width={2.4} height={w + 1} fill={col ?? P.gold} stroke={P.goldDeep} strokeWidth={.5} />)}</g>;
};

// Arm through shoulder → elbow → wrist, with the hand and ornaments.
export const Arm: React.FC<{ sh: Pt; el: Pt; wr: Pt; hand?: 'open' | 'fist' | 'point' | 'abhaya'; skin?: string; w?: number; bangles?: boolean; armlet?: boolean }> = ({ sh, el, wr, hand = 'open', skin = P.skin, w = 1, bangles = true, armlet = true }) => (
  <g>
    <S d={limb([sh, el, wr], [31 * w, 21 * w, 14 * w])} fill={skin} stroke={P.skinLine} sw={1.3} />
    {armlet && <Band a={sh} b={el} u={.42} w={25 * w} n={2} />}
    {bangles && <Band a={el} b={wr} u={.86} w={16 * w} n={2} />}
    <Hand at={wr} from={el} kind={hand} skin={skin} s={w} />
  </g>
);

export const Leg: React.FC<{ hip: Pt; knee: Pt; ankle: Pt; toe?: number; skin?: string; w?: number; anklet?: boolean }> = ({ hip, knee, ankle, toe = 1, skin = P.skin, w = 1, anklet = false }) => (
  <g>
    <S d={limb([hip, knee, ankle], [46 * w, 25 * w, 15 * w])} fill={skin} stroke={P.skinLine} sw={1.3} />
    <S d={`M${ankle[0] - 7 * w} ${ankle[1] - 4} C${ankle[0] - 8 * w} ${ankle[1] + 8} ${ankle[0]} ${ankle[1] + 12} ${ankle[0] + 26 * w * toe} ${ankle[1] + 12} C${ankle[0] + 30 * w * toe} ${ankle[1] + 12} ${ankle[0] + 28 * w * toe} ${ankle[1] + 4} ${ankle[0] + 18 * w * toe} ${ankle[1] + 2} L${ankle[0] + 7 * w} ${ankle[1] - 4}Z`} fill={skin} stroke={P.skinLine} sw={1.2} />
    {anklet && <S d={`M${ankle[0] - 8} ${ankle[1] - 2} L${ankle[0] + 8} ${ankle[1] - 2}`} stroke={P.gold} sw={3} />}
  </g>
);

// ---------------------------------------------------------------- male heads (facing right), same face system as the Devi
export type MaleHeadKind = 'king' | 'prince' | 'sage' | 'youth' | 'shiva' | 'brahma';
export const MaleHead: React.FC<{ kind: MaleHeadKind; skin?: string; blink?: number; beard?: string; crownCol?: string; tilak?: string; age?: number }> = ({ kind, skin = P.skin, blink = 0, beard, crownCol, tilak = '#E0A23A', age = 0 }) => {
  const eyeOpen = 1 - blink, uid = 'm' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const hair = kind === 'sage' || kind === 'brahma' ? (beard ?? '#EDEAE2') : P.hair;
  const bd = beard ?? (kind === 'sage' || kind === 'brahma' ? '#EDEAE2' : kind === 'king' && age > .5 ? '#8A8680' : null);
  return (
    <g>
      {/* hair */}
      {kind !== 'shiva' && <S d="M18 -52 C6 -46 2 -32 4 -18 C4 -8 2 2 -2 10 C-12 20 -24 24 -34 18 C-42 4 -44 -16 -42 -30 C-38 -52 -20 -64 2 -64 C10 -64 16 -58 18 -52Z" fill={hair} sw={1.2} />}
      {/* face: a touch heavier in the jaw than the Devi's */}
      <S d="M16 -50 C24 -44 27 -34 27 -24 C27 -18 29 -14 31 -10 L42 7 C44 10 41 12 36 12 C35 14 36 15 37 16 C35 18 33 18 32 18.5 C34 20 35 22 33 24 C31 26 30 27 31 30 C33 36 30 42 20 44 C12 45 4 42 -2 38 C0 20 4 0 4 -18 C3 -32 8 -44 16 -50Z" fill={skin} stroke={P.skinLine} sw={1.5} />
      {kind !== 'shiva' && <S d="M16 -50 C8 -44 3 -32 4 -18 C5 -8 3 2 0 10 C-2 4 -3 -8 -2 -20 C0 -36 6 -46 16 -50Z" fill={hair} stroke="none" />}
      {/* eye */}
      {eyeOpen > .15 ? (
        <g>
          <clipPath id={uid}><path d={`M10 -13 C16 ${-13 - 6.5 * eyeOpen} 26 ${-12 - 6.5 * eyeOpen} 31.5 -12 C26 ${-12 + 4 * eyeOpen} 16 ${-12 + 4 * eyeOpen} 10 -13Z`} /></clipPath>
          <S d={`M10 -13 C16 ${-13 - 6.5 * eyeOpen} 26 ${-12 - 6.5 * eyeOpen} 31.5 -12 C26 ${-12 + 4 * eyeOpen} 16 ${-12 + 4 * eyeOpen} 10 -13Z`} fill={P.pearl} stroke="none" />
          <g clipPath={`url(#${uid})`}><circle cx={25.5} cy={-13.2} r={3.5} fill={P.hair} /></g>
          <S d={`M5 -12.4 L10 -13 C16 ${-13 - 6.5 * eyeOpen} 26 ${-12 - 6.5 * eyeOpen} 31.5 -12`} stroke={P.hair} sw={1.8} />
        </g>
      ) : <S d="M5 -12 L10 -12.6 C16 -10 26 -10 31.5 -12" stroke={P.hair} sw={1.8} />}
      <S d="M7 -24 Q19 -30 30 -22.5" stroke={kind === 'sage' || kind === 'brahma' ? '#BDB7AA' : P.hair} sw={2.2} />
      {/* tilak */}
      {tilak && <S d="M25 -30 L27 -44 M29 -30 L29.5 -44" stroke={tilak} sw={1.6} />}
      {/* moustache */}
      {kind !== 'youth' && <S d="M36 14 C30 15 26 16 22 12 C24 18 30 19 36 16Z" fill={bd ?? P.hair} stroke="none" />}
      {/* beard */}
      {bd && <S d={`M-2 20 C4 34 12 44 20 46 C26 46 32 40 34 28 C38 44 34 ${70 + age * 40} 20 ${86 + age * 50} C4 ${76 + age * 30} -4 50 -2 20Z`} fill={bd} stroke={kind === 'sage' || kind === 'brahma' ? '#9A958A' : P.hair} sw={1} />}
      {/* ear */}
      <S d="M-4 -4 C-11 -6 -12 8 -4 10" fill={skin} stroke={P.skinLine} sw={1.2} />
      {kind !== 'sage' && kind !== 'shiva' && <circle cx={-6} cy={14} r={3.4} fill={P.gold} stroke={P.goldDeep} strokeWidth={.6} />}
      {kind === 'shiva' && <g><circle cx={-6} cy={16} r={6} fill="none" stroke="#E7E1D2" strokeWidth={2.6} /></g>}
      {/* headwear */}
      {(kind === 'king' || kind === 'prince') && (
        <g>
          <Gold d="M-42 -44 C-42 -58 -28 -68 -12 -70 L-12 -112 L-2 -92 L8 -136 L16 -92 L26 -114 L26 -56 C12 -62 -18 -60 -42 -44Z" />
          <S d="M-12 -84 L26 -86 M-12 -98 L24 -100" stroke={P.goldDeep} sw={1} />
          <S d="M-40 -48 C-16 -62 12 -64 24 -56" stroke={P.goldDeep} sw={1} />
          {[-32, -22, -12, -2, 8, 18].map((x) => <circle key={x} cx={x} cy={-57 + Math.abs(x + 6) * .1} r={2} fill={P.pearl} stroke={P.goldDeep} strokeWidth={.5} />)}
          <circle cx={8} cy={-108} r={4.4} fill={crownCol ?? P.red} stroke={P.goldDeep} strokeWidth={.7} />
          {kind === 'king' && <S d="M8 -136 C18 -152 34 -146 40 -160 C30 -142 16 -140 8 -136Z" fill="#F4EFE3" stroke={P.goldDeep} sw={.8} />}
        </g>
      )}
      {kind === 'youth' && <S d="M-36 -40 C-40 -64 -8 -76 14 -62 C10 -56 -8 -58 -24 -48 C-30 -44 -34 -40 -36 -40Z" fill={crownCol ?? P.saffron} sw={1.2} />}
      {kind === 'sage' && <S d="M-30 -56 C-34 -84 -8 -96 6 -80 C12 -72 6 -60 -6 -58 C-16 -56 -24 -54 -30 -56Z" fill={hair} stroke="#9A958A" sw={1.2} />}
      {kind === 'shiva' && (
        <g>
          {/* matted locks piled into a bun, with the crescent */}
          <S d="M18 -52 C8 -46 2 -32 4 -18 C4 -8 0 4 -6 12 C-30 20 -46 0 -44 -24 C-42 -48 -20 -64 2 -64 C10 -64 16 -58 18 -52Z" fill="#3B2A1E" sw={1.2} />
          <S d="M-26 -58 C-34 -96 4 -110 14 -80 C20 -64 4 -56 -8 -58 C-14 -58 -20 -56 -26 -58Z" fill="#3B2A1E" sw={1.2} />
          {[0, 1, 2, 3, 4].map((i) => <S key={i} d={`M${-22 + i * 7} -60 C${-24 + i * 7} -76 ${-16 + i * 7} -90 ${-8 + i * 5} -96`} stroke="#6B5140" sw={1} />)}
          <S d="M4 -96 A10 10 0 1 0 22 -100 A7.5 7.5 0 1 1 4 -96Z" fill={P.pearl} stroke={P.goldDeep} sw={1} />
          <S d="M-4 -6 C-12 -2 -16 10 -14 22" stroke="#3B2A1E" sw={3} />
          {/* third eye */}
          <S d="M26 -34 C28 -38 30 -38 31 -34 C30 -30 28 -30 26 -34Z" fill={P.red} stroke={P.hair} sw={.8} />
        </g>
      )}
    </g>
  );
};

// ---------------------------------------------------------------- the standing male figure (facing right)
// Anatomy (units, head ≈ 108 tall): neck 88, shoulder 100, waist 262, knee ≈ 470, ankle 648.
export type ArmPose = { sh: Pt; el: Pt; wr: Pt; hand?: 'open' | 'fist' | 'point' | 'abhaya' };
export const ARMS: Record<string, { near: ArmPose; far: ArmPose }> = {
  down: { near: { sh: [4, 108], el: [14, 200], wr: [30, 280] }, far: { sh: [-10, 108], el: [-8, 200], wr: [6, 280] } },
  namaskar: { near: { sh: [4, 108], el: [22, 196], wr: [58, 150] }, far: { sh: [-10, 108], el: [8, 200], wr: [54, 152] } },
  point: { near: { sh: [4, 108], el: [70, 140], wr: [138, 138], hand: 'point' }, far: { sh: [-10, 108], el: [-8, 200], wr: [6, 278] } },
  abhaya: { near: { sh: [4, 108], el: [30, 190], wr: [62, 128], hand: 'abhaya' }, far: { sh: [-10, 108], el: [-8, 200], wr: [6, 278] } },
  offer: { near: { sh: [4, 108], el: [30, 196], wr: [96, 210], hand: 'open' }, far: { sh: [-10, 108], el: [10, 200], wr: [80, 214], hand: 'open' } },
  urdhva: { near: { sh: [4, 108], el: [22, 20], wr: [18, -90], hand: 'open' }, far: { sh: [-10, 108], el: [0, 18], wr: [14, -92], hand: 'open' } },
  reins: { near: { sh: [4, 108], el: [24, 196], wr: [84, 188], hand: 'fist' }, far: { sh: [-10, 108], el: [2, 200], wr: [74, 192], hand: 'fist' } },
  dig: { near: { sh: [4, 108], el: [44, 176], wr: [96, 196], hand: 'fist' }, far: { sh: [-10, 108], el: [30, 184], wr: [80, 204], hand: 'fist' } },
};
export type LegPose = { near: [Pt, Pt, Pt]; far: [Pt, Pt, Pt] };
export const LEGS: Record<string, LegPose> = {
  stand: { near: [[8, 280], [14, 468], [16, 646]], far: [[-14, 280], [-18, 468], [-22, 646]] },
  stride: { near: [[8, 280], [40, 462], [62, 640]], far: [[-14, 280], [-30, 466], [-66, 636]] },
  onefoot: { near: [[4, 280], [8, 468], [8, 646]], far: [[-12, 280], [60, 380], [2, 440]] },
  dig: { near: [[10, 280], [52, 440], [40, 640]], far: [[-14, 280], [-40, 460], [-70, 636]] },
  seated: { near: [[8, 284], [104, 300], [100, 450]], far: [[-14, 284], [84, 306], [70, 452]] },
};

export type Garb = { dhoti: string; sash: string; uttariya: string; skin?: string; dhotiLen?: number; border?: string; hair?: string | null; garland?: boolean };
export const MaleBody: React.FC<{ arms: keyof typeof ARMS | { near: ArmPose; far: ArmPose }; legs: keyof typeof LEGS; garb: Garb; head: React.ReactNode; breathe?: number; nearProp?: React.ReactNode; bare?: boolean }> = ({ arms, legs, garb, head, breathe = 0, nearProp, bare = false }) => {
  const A = typeof arms === 'string' ? ARMS[arms] : arms, Lg = LEGS[legs], skin = garb.skin ?? P.skin;
  const dl = garb.dhotiLen ?? 560;
  return (
    <g>
      {garb.hair !== null && <S d="M-40 -10 C-54 30 -56 80 -48 120 C-40 124 -30 120 -26 110 C-28 70 -20 30 -8 10Z" fill={garb.hair ?? P.hair} sw={1} />}
      <Arm {...A.far} skin={skin} w={.95} />
      <Leg hip={Lg.far[0]} knee={Lg.far[1]} ankle={Lg.far[2]} skin={skin} />
      {/* torso */}
      <g transform={`translate(0 ${breathe * .6})`}>
        <S d="M-6 84 C-30 90 -50 100 -54 126 C-56 170 -40 220 -34 270 L32 270 C34 236 50 196 54 156 C56 126 42 100 22 86Z" fill={skin} stroke={P.skinLine} sw={1.4} />
        <S d="M30 150 C38 158 40 168 36 176" stroke={P.skinLine} sw={.9} />
      </g>
      <Leg hip={Lg.near[0]} knee={Lg.near[1]} ankle={Lg.near[2]} skin={skin} />
      {/* dhoti: gathered at the waist, pleated front fold, ending mid-calf */}
      {!bare && legs === 'seated' && (
        <g>
          <S d="M-40 258 L34 258 C70 262 110 270 128 290 C136 320 132 360 128 404 L66 410 C70 380 72 346 70 330 C40 330 -10 330 -40 318 C-46 300 -46 276 -40 258Z" fill={garb.dhoti} sw={1.4} />
          <S d="M66 410 L128 404" stroke={garb.border ?? P.gold} sw={6} />
          {Array.from({ length: 4 }, (_, i) => <S key={i} d={`M${80 + i * 12} 300 C${84 + i * 12} 340 ${82 + i * 12} 370 ${80 + i * 12} 404`} stroke="#000" sw={1} op={.22} />)}
        </g>
      )}
      {!bare && legs !== 'seated' && (
        <g>
          <S d={`M-36 262 L36 262 C44 320 ${Lg.near[1][0] + 30} 400 ${Lg.near[1][0] + 28} ${dl - 40} L${Lg.near[1][0] - 6} ${dl} C${(Lg.near[1][0] + Lg.far[1][0]) / 2} ${dl - 30} ${Lg.far[1][0] + 8} ${dl - 20} ${Lg.far[1][0] - 22} ${dl - 30} C-44 420 -44 330 -36 262Z`} fill={garb.dhoti} sw={1.4} />
          {Array.from({ length: 5 }, (_, i) => <S key={i} d={`M${14 + i * 4} 280 C${18 + i * 5} 360 ${Lg.near[1][0] + 4 + i * 5} 440 ${Lg.near[1][0] + i * 4} ${dl - 10}`} stroke="#000" sw={1} op={.22} />)}
          <S d={`M${Lg.far[1][0] - 22} ${dl - 30} C${(Lg.near[1][0] + Lg.far[1][0]) / 2} ${dl - 22} ${Lg.near[1][0] - 6} ${dl} ${Lg.near[1][0] + 28} ${dl - 40}`} stroke={garb.border ?? P.gold} sw={6} />
          <S d={`M36 264 C44 320 ${Lg.near[1][0] + 30} 400 ${Lg.near[1][0] + 28} ${dl - 40}`} stroke={garb.border ?? P.gold} sw={5} />
        </g>
      )}
      {/* sash with hanging ends */}
      <S d="M-38 252 C-10 262 20 262 38 252 L38 272 C20 280 -10 280 -38 272Z" fill={garb.sash} sw={1.2} />
      <S d="M24 268 C30 300 34 330 30 372 L18 370 C20 334 16 300 14 272Z" fill={garb.sash} sw={1.1} />
      <S d="M18 364 L30 366" stroke={P.gold} sw={3} />
      {/* uttariya over the shoulders */}
      <S d="M-30 96 C-40 140 -54 200 -60 300 C-62 330 -56 360 -50 380 L-38 378 C-44 330 -40 250 -26 150 C-20 126 -10 104 8 92Z" fill={garb.uttariya} fillOp={.85} sw={1.2} />
      {/* ornaments: necklace, sacred thread */}
      <S d="M-6 90 C4 112 18 122 32 118" stroke={P.gold} sw={3} />
      {Array.from({ length: 8 }, (_, i) => { const u = i / 7; return <circle key={i} cx={-6 + u * 38} cy={96 + Math.sin(u * Math.PI) * 32} r={2} fill={P.pearl} stroke={P.goldDeep} strokeWidth={.4} />; })}
      <S d="M-20 100 C0 150 20 200 34 250" stroke="#F4EFE3" sw={1.4} />
      {garb.garland && <g>{Array.from({ length: 22 }, (_, i) => { const u = i / 21; return <circle key={i} cx={-10 + u * 58 - Math.sin(u * Math.PI) * 6} cy={96 + Math.sin(u * Math.PI) * 150 + u * 20} r={4.2} fill={i % 3 ? P.saffron : P.pearl} stroke="#9A4B12" strokeWidth={.6} />; })}</g>}
      {nearProp}
      <Arm {...A.near} skin={skin} />
      <S d="M20 40 C22 58 24 72 26 90 L-6 90 C-4 70 -4 52 -4 34Z" fill={skin} stroke="none" />
      <S d="M20 40 C22 58 24 72 26 90" stroke={P.skinLine} sw={1.2} />
      {head}
    </g>
  );
};

// seated cross-legged (padmasana) lower body for sages and meditating figures; seat line at y 300
export const Padmasana: React.FC<{ cloth: string; skin?: string }> = ({ cloth, skin = P.skin }) => (
  <g>
    <S d="M-44 262 L36 262 C60 270 110 280 128 300 C132 312 120 322 100 324 L-70 324 C-80 300 -60 272 -44 262Z" fill={cloth} sw={1.4} />
    <S d="M-60 316 C-10 300 60 296 120 306" stroke="#8A6A40" sw={1} />
    <S d="M92 300 C104 294 122 296 128 304 C122 312 104 312 92 306Z" fill={skin} stroke={P.skinLine} sw={1.1} />
  </g>
);

export { circle };
