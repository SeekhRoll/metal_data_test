import React from 'react';
import { P } from './palette';
import { S, Gold, circle, ellipse } from './paint';

// Kangra profile head, facing right. Local units: crown ≈ -64, chin ≈ 42. `blink` 0..1 closes the eye.
export type HeadProps = { skin?: string; crown?: boolean; crescent?: boolean; veil?: string | null; blink?: number; nath?: boolean; tilak?: string; male?: boolean };
export const Head: React.FC<HeadProps> = ({ skin = P.skin, crown = false, crescent = false, veil = null, blink = 0, nath = true, tilak, male = false }) => {
  const eyeOpen = 1 - blink;
  const uid = 'eye' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <g>
      {/* hair mass */}
      <S d="M18 -52 C6 -46 2 -32 4 -18 C5 -6 0 6 -6 16 C-10 24 -14 30 -18 34 C-34 24 -44 4 -44 -16 C-44 -44 -22 -64 2 -64 C10 -64 16 -58 18 -52Z" fill={P.hair} sw={1.2} />
      {/* face */}
      <S d="M16 -50 C24 -44 27 -34 27 -24 C27 -18 29 -14 31 -10 L41 6 C43 9 40 11 36 11 C35 13 36 14 37 15 C35 17 33 17 32 17.5 C34 19 35 21 33 23 C31 25 30 26 31 28 C33 33 30 40 22 42 C14 43 6 40 0 36 C2 20 4 0 4 -18 C3 -32 8 -44 16 -50Z" fill={skin} stroke={P.skinLine} sw={1.5} />
      {/* hair edge over the temple, and the curl in front of the ear */}
      <S d="M16 -50 C8 -44 3 -32 4 -18 C5 -8 3 2 0 10 C-2 4 -3 -8 -2 -20 C0 -36 6 -46 16 -50Z" fill={P.hair} stroke="none" />
      <S d="M3 -14 C0 0 3 12 9 20 C12 25 9 29 6 27" stroke={P.hair} sw={2.2} />
      {/* lips */}
      <S d="M37 14.6 Q34.5 16.6 32.2 17.4 Q35 18.6 33.8 21.8 Q36.4 19 37 14.6Z" fill="#B8433A" stroke="none" />
      {/* long Pahari eye with kohl reaching toward the temple */}
      {eyeOpen > .15 ? (
        <g>
          <S d={`M10 -13 C16 ${-13 - 7 * eyeOpen} 26 ${-12 - 7 * eyeOpen} 31.5 -12 C26 ${-12 + 4 * eyeOpen} 16 ${-12 + 4 * eyeOpen} 10 -13Z`} fill={P.pearl} stroke="none" />
          <clipPath id={uid}><path d={`M10 -13 C16 ${-13 - 7 * eyeOpen} 26 ${-12 - 7 * eyeOpen} 31.5 -12 C26 ${-12 + 4 * eyeOpen} 16 ${-12 + 4 * eyeOpen} 10 -13Z`} /></clipPath>
          <g clipPath={`url(#${uid})`}><circle cx={25.5} cy={-13.5} r={3.6} fill={P.hair} /></g>
          <S d={`M4 -12.2 L10 -13 C16 ${-13 - 7 * eyeOpen} 26 ${-12 - 7 * eyeOpen} 31.5 -12`} stroke={P.hair} sw={1.9} />
          <S d={`M10 -13 C16 ${-12 + 4 * eyeOpen} 26 ${-12 + 4 * eyeOpen} 31.5 -12`} stroke={P.skinLine} sw={1} />
        </g>
      ) : (
        <S d="M4 -12 L10 -12.6 C16 -10 26 -10 31.5 -12" stroke={P.hair} sw={1.9} />
      )}
      <S d="M7 -24 Q19 -30.5 30 -22.5" stroke={P.hair} sw={1.8} />
      {tilak && <S d="M26.5 -32 L27.5 -40" stroke={tilak} sw={2.4} />}
      {/* ear with pearl-and-gold jhumka */}
      <S d="M-4 -4 C-11 -6 -12 8 -4 10" fill={skin} stroke={P.skinLine} sw={1.2} />
      {!male && <g><Gold d={`M-8 12 h8 l-1 7 h-6z`} sw={.8} /><path d="M-10 19 Q-4 27 2 19Z" fill={P.gold} stroke={P.goldDeep} strokeWidth={.8} />{[-8, -4, 0].map((x) => <circle key={x} cx={x} cy={24} r={1.3} fill={P.pearl} />)}</g>}
      {/* nose ring */}
      {nath && !male && <g><path d={`M36 7 a8 8 0 1 0 6 12`} fill="none" stroke={P.gold} strokeWidth={1.4} /><circle cx={41.5} cy={19} r={1.8} fill={P.pearl} stroke={P.goldDeep} strokeWidth={.5} /></g>}
      {/* maang tikka on the parting */}
      {!male && !crown && <g><path d="M14 -56 Q20 -48 24 -42" stroke={P.gold} strokeWidth={1.2} fill="none" /><circle cx={24.5} cy={-40} r={2.6} fill={P.gold} stroke={P.goldDeep} strokeWidth={.6} /></g>}
      {/* translucent odhni over the head */}
      {veil && <S d="M20 -56 C8 -72 -34 -72 -50 -40 C-60 -16 -60 40 -64 110 L-40 116 C-38 70 -30 30 -18 12 C-10 0 -2 -20 2 -36 C6 -48 12 -54 20 -56Z" fill={veil} fillOp={.5} stroke={P.gold} sw={1.4} />}
      {crown && (
        <g>
          <Gold d="M-34 -50 C-34 -60 -24 -66 -12 -68 L-10 -96 L-2 -80 L6 -108 L12 -80 L22 -94 L22 -58 C12 -64 -14 -62 -34 -50Z" />
          <S d="M-34 -52 C-14 -64 12 -66 22 -58" stroke={P.goldDeep} sw={1} />
          {[-28, -20, -12, -4, 4, 12, 19].map((x, i) => <circle key={i} cx={x} cy={-59 + Math.abs(x + 6) * .12 - (i === 6 ? 0 : 0)} r={1.9} fill={P.pearl} stroke={P.goldDeep} strokeWidth={.5} />)}
          <circle cx={6} cy={-86} r={3.4} fill={P.red} stroke={P.goldDeep} strokeWidth={.7} />
          <circle cx={-10} cy={-80} r={2.4} fill={P.green} stroke={P.goldDeep} strokeWidth={.6} />
          <circle cx={21} cy={-78} r={2.4} fill={P.green} stroke={P.goldDeep} strokeWidth={.6} />
        </g>
      )}
      {crescent && <S d="M16 -64 A11 11 0 1 0 36 -66 A8.5 8.5 0 1 1 16 -64Z" fill={P.pearl} stroke={P.goldDeep} sw={1} />}
    </g>
  );
};

// the brass/steel trishul, shaft centred on x, head tip at `top`
export const Trishul: React.FC<{ x: number; top: number; bottom: number }> = ({ x, top, bottom }) => (
  <g data-id="trishul">
    <S d={`M${x - 2.4} ${top + 58} V${bottom} H${x + 2.4} V${top + 58}Z`} fill={P.wood} sw={1} />
    <Gold d={`M${x - 5} ${top + 56} h10 v10 h-10z`} sw={.9} />
    <Gold d={`M${x - 4} ${top + 70} h8 v6 h-8z`} sw={.8} />
    <S d={`M${x} ${top} L${x + 5} ${top + 18} L${x + 4} ${top + 56} H${x - 4} L${x - 5} ${top + 18}Z`} fill="#D9D6CC" sw={1.2} />
    <S d={`M${x - 4} ${top + 50} C${x - 24} ${top + 50} ${x - 28} ${top + 34} ${x - 24} ${top + 10} L${x - 20} ${top + 22} C${x - 20} ${top + 36} ${x - 14} ${top + 42} ${x - 4} ${top + 42}Z`} fill="#D9D6CC" sw={1.2} />
    <S d={`M${x + 4} ${top + 50} C${x + 24} ${top + 50} ${x + 28} ${top + 34} ${x + 24} ${top + 10} L${x + 20} ${top + 22} C${x + 20} ${top + 36} ${x + 14} ${top + 42} ${x + 4} ${top + 42}Z`} fill="#D9D6CC" sw={1.2} />
    <S d={`M${x - 26} ${top + 50} H${x + 26} V${top + 56} H${x - 26}Z`} fill="url(#goldFill)" stroke={P.goldDeep} sw={1} />
  </g>
);

// a lotus in profile on a stem
export const Lotus: React.FC<{ x: number; y: number; s?: number; stem?: [number, number] }> = ({ x, y, s = 1, stem }) => (
  <g data-id="lotus">
    {stem && <S d={`M${stem[0]} ${stem[1]} Q${(stem[0] + x) / 2 - 6} ${(stem[1] + y) / 2} ${x} ${y + 8 * s}`} stroke={P.green} sw={2.4} />}
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <S d="M0 8 C-18 6 -22 -6 -20 -12 C-12 -8 -6 -2 0 8Z" fill="#E48C9C" sw={1} />
      <S d="M0 8 C18 6 22 -6 20 -12 C12 -8 6 -2 0 8Z" fill="#E48C9C" sw={1} />
      <S d="M0 8 C-10 0 -10 -14 -4 -22 C0 -12 2 -2 0 8Z" fill="#F2B4BE" sw={1} />
      <S d="M0 8 C10 0 10 -14 4 -22 C0 -12 -2 -2 0 8Z" fill="#F2B4BE" sw={1} />
      <S d="M0 8 C-4 -4 -2 -22 0 -28 C2 -22 4 -4 0 8Z" fill="#F6C9D0" sw={1} />
    </g>
  </g>
);

export { circle, ellipse };
