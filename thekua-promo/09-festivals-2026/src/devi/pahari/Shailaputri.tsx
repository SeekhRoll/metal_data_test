import React from 'react';
import { P, shade } from '../../styles/pahari/palette';
import { S, Gold } from '../../styles/pahari/paint';
import { Head, Trishul, Lotus } from '../../styles/pahari/figure';
import { Nandi } from '../../styles/pahari/animals';
import { Halo } from '../../styles/pahari/scenery';

// Day 1 · माँ शैलपुत्री (iconography: 2 arms, rides Nandi, trishul in the right hand, lotus in the left,
// crescent moon on the forehead). Facing right, so the right arm is the near arm.
export const ICON_SHAILAPUTRI = { arms: 2, vahana: 'bull (Nandi)', holds: ['trishul (right)', 'lotus (left)'], features: ['crescent moon on forehead'] };

export type Life = { t: number; blink: number; breathe: number; sway: number; bloom: number };

export const Shailaputri: React.FC<{ garment: string; life: Life }> = ({ garment, life }) => {
  const deep = shade(garment, -.28), lite = shade(garment, .25);
  const br = 1 + .006 * life.breathe;
  return (
    <g data-id="devi-shailaputri" data-kind="graphic">
      <g transform="translate(56 300)"><Nandi step={0} tail={Math.sin(life.t * 1.3)} ear={Math.max(0, Math.sin(life.t * .9) ** 9)} blink={life.blink} jhool={P.red} /></g>
      <Halo x={2} y={-10} r={84} bloom={life.bloom} id="halo" />
      {/* long braid with a gold tassel (parandi) */}
      <S d="M-36 20 C-44 60 -46 120 -44 190 L-32 190 C-32 120 -28 60 -24 26Z" fill={P.hair} sw={1} />
      {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M-42 ${40 + i * 19} q6 5 12 0`} stroke="#4A3A30" strokeWidth={1} fill="none" />)}
      <Gold d="M-44 190 h12 l2 26 h-16z" sw={.8} />
      {/* odhni falling down the back, behind the body */}
      <S d="M-40 -30 C-66 40 -78 160 -86 300 C-88 330 -80 380 -70 420 L-34 420 C-40 330 -40 220 -30 140Z" fill={P.pink} fillOp={.55} stroke={P.gold} sw={1.6} />
      {/* far arm raised in front of the chest, holding the lotus */}
      <g transform={`rotate(${life.sway * .6} -6 112)`}>
        <S d="M-6 112 C14 118 30 150 44 170 C50 160 56 146 60 132 L70 136 C66 156 58 176 48 190 C40 196 30 190 24 180 C12 162 -2 140 -10 128Z" fill={P.skin} stroke={P.skinLine} sw={1.3} />
        <Gold d="M54 138 l12 4 l-3 7 l-12 -4z" sw={.7} />
        <S d="M60 134 C62 128 68 124 72 126 C74 132 70 138 66 140Z" fill={P.skin} stroke={P.skinLine} sw={1.1} />
        <Lotus x={80} y={84} s={1.05} stem={[68, 132]} />
      </g>
      {/* torso: choli, midriff, waist */}
      <g transform={`scale(1 ${br})`}>
        <S d="M-8 86 L22 86 C34 96 44 112 50 140 C54 160 42 176 32 186 C28 205 26 225 28 248 L-36 248 C-38 210 -44 150 -38 112 C-34 96 -22 88 -8 86Z" fill={P.skin} stroke={P.skinLine} sw={1.4} />
        <S d="M-12 96 C8 96 30 104 44 124 C52 146 48 166 34 186 C10 192 -18 190 -34 184 C-38 150 -34 118 -24 104Z" fill={garment} sw={1.3} />
        <S d="M-30 178 C-6 186 18 186 36 180" stroke={P.gold} sw={2.4} />
      </g>
      {/* necklaces: pearl strands and a gold hansli */}
      <S d="M-4 90 C6 112 20 122 34 118" stroke={P.gold} sw={3} />
      {Array.from({ length: 9 }, (_, i) => { const u = i / 8, x = -6 + u * 42, y = 96 + Math.sin(u * Math.PI) * 30; return <circle key={i} cx={x} cy={y} r={2} fill={P.pearl} stroke={P.goldDeep} strokeWidth={.4} />; })}
      {Array.from({ length: 12 }, (_, i) => { const u = i / 11, x = -8 + u * 46, y = 100 + Math.sin(u * Math.PI) * 48; return <circle key={i} cx={x} cy={y} r={1.8} fill={P.pearl} stroke={P.goldDeep} strokeWidth={.4} />; })}
      {/* ghagra draped over Nandi's side, knees forward, pleats falling */}
      <S d="M-36 246 L28 246 C60 250 92 262 108 286 C116 320 122 380 128 432 C80 440 -10 440 -46 432 C-50 380 -48 300 -36 246Z" fill={garment} sw={1.5} />
      {Array.from({ length: 9 }, (_, i) => { const x0 = -30 + i * 14, x1 = -40 + i * 19; return <S key={i} d={`M${x0} 262 C${x0 + 4} 320 ${x1} 380 ${x1 + 2} 430`} stroke={deep} sw={1.2} />; })}
      <S d="M-46 418 C-10 426 80 426 128 418 L128 432 C80 440 -10 440 -46 432Z" fill="url(#goldFill)" stroke={P.goldDeep} sw={1.1} />
      <S d="M-34 250 C0 244 20 244 30 246" stroke={lite} sw={6} op={.6} />
      <S d="M-36 246 L30 246" stroke={P.gold} sw={3} />
      {/* feet with alta and anklets below the hem */}
      <S d="M104 432 C104 444 112 450 134 450 C142 450 142 442 134 438 L122 430Z" fill={P.skin} stroke={P.skinLine} sw={1.2} />
      <S d="M110 448 C118 452 130 452 138 448" stroke="#C0392B" sw={2.2} />
      <S d="M104 434 C112 438 120 438 124 434" stroke={P.gold} sw={2} />
      {/* odhni over the shoulder in front */}
      <S d="M-20 88 C-30 120 -40 170 -36 250 L-20 250 C-24 190 -16 130 -4 96Z" fill={P.pink} fillOp={.5} stroke={P.gold} sw={1.2} />
      {/* near arm: hanging forward, hand gripping the trishul */}
      <S d="M-18 100 C-4 88 22 96 26 124 L31 196 C33 206 22 212 16 204 L6 150 C-2 136 -14 124 -18 100Z" fill={P.skin} stroke={P.skinLine} sw={1.3} />
      <Gold d="M8 128 l17 -2 l1 8 l-17 2z" sw={.7} />
      <S d="M16 204 C30 214 50 226 70 232 L74 244 C52 240 30 228 14 216Z" fill={P.skin} stroke={P.skinLine} sw={1.3} />
      <Trishul x={82} top={-238} bottom={470} />
      <S d="M70 226 C78 222 90 224 92 232 C92 242 84 248 74 246 C68 242 66 232 70 226Z" fill={P.skin} stroke={P.skinLine} sw={1.2} />
      {[0, 1, 2].map((i) => <S key={i} d={`M${60 + i * 3} ${226 + i * 1.5} l3 14`} stroke={i === 1 ? P.red : P.gold} sw={2.4} />)}
      {/* neck and head */}
      <S d="M20 40 C22 58 24 72 26 90 L-4 90 C-2 70 -2 52 -2 34Z" fill={P.skin} stroke="none" />
      <S d="M20 40 C22 58 24 72 26 90" stroke={P.skinLine} sw={1.2} />
      <Head crown crescent blink={life.blink} veil={P.pink} />
    </g>
  );
};
