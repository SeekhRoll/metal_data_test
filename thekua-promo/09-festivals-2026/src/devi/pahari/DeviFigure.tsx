import React from 'react';
import { P, shade } from '../../styles/pahari/palette';
import { S, Gold } from '../../styles/pahari/paint';
import { Head } from '../../styles/pahari/figure';
import { Arm, Leg, limb } from '../../styles/pahari/body';
import { Held, Item } from '../../styles/pahari/attributes';
import { Halo } from '../../styles/pahari/scenery';

type Pt = [number, number];
export type Life = { t: number; blink: number; breathe: number; sway: number; bloom: number };
export type Posture = 'saddle' | 'padmasana' | 'walking';

// Multi-armed Devi, facing right. Arms fan out from the shoulders like the Pahari Durga pages; each hand holds its
// item upright. `near` / `far` list the items from the lowest arm to the highest.
function fan(side: 'near' | 'far', items: Item[], life: Life) {
  const sh: Pt = side === 'near' ? [4, 108] : [-10, 108], n = items.length;
  // angle range (degrees, 0 = pointing right, 90 = down): near arms fan forward, far arms fan back
  const [a0, a1] = side === 'near' ? (n > 1 ? [70, -60] : [60, 60]) : (n > 1 ? [110, 230] : [100, 100]);
  return items.map((it, i) => {
    const u = n > 1 ? i / (n - 1) : 0, a = (a0 + (a1 - a0) * u + life.sway * (i % 2 ? .8 : -.8)) * Math.PI / 180;
    const L1 = 86, L2 = 78;
    const el: Pt = [sh[0] + Math.cos(a) * L1, sh[1] + Math.sin(a) * L1];
    const b = a - (side === 'near' ? .9 : -.9);
    const wr: Pt = [el[0] + Math.cos(b) * L2, el[1] + Math.sin(b) * L2 - (it === 'abhaya' || it === 'varada' ? 0 : 10)];
    const hand = it === 'abhaya' ? 'abhaya' : it === 'varada' ? 'open' : 'fist';
    return { sh, el, wr, it, hand: hand as 'abhaya' | 'open' | 'fist', i };
  });
}

export type DeviSpec = {
  garment: string; veil: string; skin?: string; posture: Posture;
  near: Item[]; far: Item[];
  crescent?: boolean; bell?: boolean; thirdEye?: boolean; looseHair?: boolean; crown?: boolean; white?: boolean;
  lap?: React.ReactNode;              // e.g. baby Skanda
};

export const DeviFigure: React.FC<{ spec: DeviSpec; life: Life }> = ({ spec, life }) => {
  const skin = spec.skin ?? P.skin, g = spec.garment, deep = shade(g, -.28);
  const near = fan('near', spec.near, life), far = fan('far', spec.far, life);
  const br = 1 + .006 * life.breathe;
  const armEl = (a: ReturnType<typeof fan>[number], k: string, w = 1) => (
    <g key={k}>
      <Arm sh={a.sh} el={a.el} wr={a.wr} hand={a.hand} skin={skin} w={w * .92} />
      {a.it !== 'abhaya' && a.it !== 'varada' && a.it !== 'none' && <g transform={`translate(${a.wr[0] + 4} ${a.wr[1]})`}><Held item={a.it} s={.62} /></g>}
    </g>
  );
  const seated = spec.posture !== 'walking';
  return (
    <g data-id="devi" data-kind="graphic">
      <Halo x={2} y={-10} r={84} bloom={life.bloom} id="halo" />
      {spec.looseHair
        ? <S d="M-40 -40 C-90 20 -110 140 -96 280 C-70 250 -60 200 -44 160 C-40 110 -30 60 -20 20Z" fill={P.hair} sw={1} />
        : <><S d="M-36 20 C-44 60 -46 120 -44 190 L-32 190 C-32 120 -28 60 -24 26Z" fill={P.hair} sw={1} /><Gold d="M-44 190 h12 l2 26 h-16z" sw={.8} /></>}
      <S d="M-40 -30 C-66 40 -78 160 -86 300 C-88 330 -80 380 -70 420 L-34 420 C-40 330 -40 220 -30 140Z" fill={spec.veil} fillOp={.55} stroke={P.gold} sw={1.6} />
      {far.map((a, i) => armEl(a, 'f' + i, .95))}
      {/* torso */}
      <g transform={`scale(1 ${br})`}>
        <S d="M-8 86 L22 86 C34 96 44 112 50 140 C54 160 42 176 32 186 C28 205 26 225 28 248 L-36 248 C-38 210 -44 150 -38 112 C-34 96 -22 88 -8 86Z" fill={skin} stroke={P.skinLine} sw={1.4} />
        <S d="M-12 96 C8 96 30 104 44 124 C52 146 48 166 34 186 C10 192 -18 190 -34 184 C-38 150 -34 118 -24 104Z" fill={spec.white ? P.white : g} sw={1.3} />
        <S d="M-30 178 C-6 186 18 186 36 180" stroke={P.gold} sw={2.4} />
      </g>
      <S d="M-4 90 C6 112 20 122 34 118" stroke={P.gold} sw={3} />
      {Array.from({ length: 12 }, (_, i) => { const u = i / 11; return <circle key={i} cx={-8 + u * 46} cy={100 + Math.sin(u * Math.PI) * 48} r={1.8} fill={P.pearl} stroke={P.goldDeep} strokeWidth={.4} />; })}
      {/* lower body */}
      {spec.posture === 'saddle' && <g>
        <S d="M-36 246 L28 246 C60 250 92 262 108 286 C116 320 122 380 128 432 C80 440 -10 440 -46 432 C-50 380 -48 300 -36 246Z" fill={g} sw={1.5} />
        {Array.from({ length: 9 }, (_, i) => { const x0 = -30 + i * 14, x1 = -40 + i * 19; return <S key={i} d={`M${x0} 262 C${x0 + 4} 320 ${x1} 380 ${x1 + 2} 430`} stroke={deep} sw={1.2} />; })}
        <S d="M-46 418 C-10 426 80 426 128 418 L128 432 C80 440 -10 440 -46 432Z" fill="url(#goldFill)" stroke={P.goldDeep} sw={1.1} />
        <S d="M104 432 C104 444 112 450 134 450 C142 450 142 442 134 438 L122 430Z" fill={skin} stroke={P.skinLine} sw={1.2} />
        <S d="M110 448 C118 452 130 452 138 448" stroke="#C0392B" sw={2.2} />
      </g>}
      {spec.posture === 'padmasana' && <g>
        <S d="M-44 246 L32 246 C70 256 124 270 140 296 C146 312 132 324 110 326 L-76 326 C-86 300 -64 262 -44 246Z" fill={g} sw={1.5} />
        {Array.from({ length: 6 }, (_, i) => <S key={i} d={`M${-40 + i * 26} 262 C${-30 + i * 28} 290 ${-26 + i * 30} 310 ${-24 + i * 32} 324`} stroke={deep} sw={1.2} />)}
        <S d="M-76 314 C-20 322 60 322 140 312" stroke={P.gold} sw={5} />
        <S d="M104 300 C116 294 134 296 140 304 C134 312 116 312 104 306Z" fill={skin} stroke={P.skinLine} sw={1.1} />
        {spec.lap}
      </g>}
      {spec.posture === 'walking' && <g>
        <Leg hip={[-10, 290]} knee={[-24, 470]} ankle={[-50, 640]} skin={skin} anklet />
        <Leg hip={[8, 290]} knee={[34, 466]} ankle={[52, 640]} skin={skin} anklet />
        <S d="M-36 246 L28 246 C50 320 70 440 84 600 C40 612 -40 612 -84 600 C-70 440 -52 320 -36 246Z" fill={spec.white ? P.white : g} sw={1.5} />
        {Array.from({ length: 8 }, (_, i) => <S key={i} d={`M${-28 + i * 8} 262 C${-40 + i * 16} 400 ${-60 + i * 20} 520 ${-66 + i * 21} 600`} stroke={spec.white ? '#CFC8B8' : deep} sw={1.2} />)}
        <S d="M-84 588 C-40 598 40 598 84 588 L84 600 C40 612 -40 612 -84 600Z" fill={spec.white ? '#E4DCCB' : 'url(#goldFill)'} stroke={P.goldDeep} sw={1} />
      </g>}
      <S d="M-36 246 L30 246" stroke={P.gold} sw={3} />
      <S d="M-20 88 C-30 120 -40 170 -36 250 L-20 250 C-24 190 -16 130 -4 96Z" fill={spec.veil} fillOp={.5} stroke={P.gold} sw={1.2} />
      {near.map((a, i) => armEl(a, 'n' + i))}
      <S d="M20 40 C22 58 24 72 26 90 L-4 90 C-2 70 -2 52 -2 34Z" fill={skin} stroke="none" />
      <S d="M20 40 C22 58 24 72 26 90" stroke={P.skinLine} sw={1.2} />
      <Head crown={spec.crown !== false} crescent={spec.crescent} blink={life.blink} veil={spec.looseHair ? null : spec.veil} skin={skin} />
      {spec.bell && <g><S d="M10 -70 C10 -86 30 -92 36 -80 C40 -70 34 -62 26 -60 L22 -60 C16 -62 10 -64 10 -70Z" fill={P.pearl} stroke={P.goldDeep} sw={1} /><S d="M14 -64 H34" stroke={P.goldDeep} sw={1.2} /><circle cx={24} cy={-58} r={2.4} fill={P.gold} /></g>}
      {spec.thirdEye && <S d="M24 -34 C26 -39 30 -39 31 -34 C30 -29 26 -29 24 -34Z" fill={P.pearl} stroke={P.hair} sw={1} />}
    </g>
  );
};
