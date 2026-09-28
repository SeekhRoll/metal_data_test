import React from 'react';
import { P } from './palette';
import { S, Gold, circle } from './paint';

const BULL = '#F4EFE3', BULL_FAR = '#DCD5C6', BULL_LINE = '#6E6254';

// Nandi in profile, facing right. Back line ≈ y 0, hooves at y ≈ 288.
// `step` 0..1 cycles a slow walk (legs swap on twos), `tail` and `ear` add idle life.
export const Nandi: React.FC<{ step?: number; tail?: number; ear?: number; blink?: number; jhool?: string; band?: string }> = ({ step = 0, tail = 0, ear = 0, blink = 0, jhool = P.red, band = P.red }) => {
  const k = Math.sin(step * Math.PI * 2);
  const leg = (x: number, top: number, far: boolean, hind: boolean, sh: number) => {
    const c = far ? BULL_FAR : BULL, dx = sh * 10;
    const d = hind
      ? `M${x} ${top} C${x + 10} ${top + 50} ${x + 26 + dx * .3} ${top + 76} ${x + 24 + dx * .5} ${top + 110} L${x + 20 + dx} ${286} L${x + 38 + dx} ${286} L${x + 42 + dx * .5} ${top + 110} C${x + 44} ${top + 80} ${x + 44} ${top + 40} ${x + 44} ${top + 20}Z`
      : `M${x} ${top} C${x + 4} ${top + 40} ${x + 8 + dx * .3} ${top + 80} ${x + 6 + dx * .6} ${top + 122} L${x + 4 + dx} 286 L${x + 24 + dx} 286 L${x + 22 + dx * .6} ${top + 122} C${x + 26} ${top + 80} ${x + 30} ${top + 40} ${x + 32} ${top - 4}Z`;
    return (
      <g>
        <S d={d} fill={c} stroke={BULL_LINE} sw={1.4} />
        <S d={`M${x + 3 + dx} 278 H${x + 25 + dx} L${x + 25 + dx} 288 H${x + 3 + dx}Z`} fill="#3A302A" sw={1} />
      </g>
    );
  };
  return (
    <g data-id="nandi" data-kind="graphic">
      {/* far legs */}
      {leg(118, 140, true, false, -k)}
      {leg(-226, 100, true, true, k)}
      {/* tail */}
      <S d={`M-252 38 C${-276 + tail * 6} 90 ${-282 + tail * 10} 170 ${-274 + tail * 14} 236`} stroke={BULL_LINE} sw={3.2} />
      <S d={`M${-280 + tail * 14} 232 C${-290 + tail * 14} 250 ${-282 + tail * 14} 272 ${-272 + tail * 14} 276 C${-262 + tail * 14} 268 ${-262 + tail * 14} 244 ${-270 + tail * 14} 230Z`} fill="#4A3F36" sw={1} />
      {/* body */}
      <S d="M-250 20 C-240 0 -200 -6 -150 -4 C-80 0 -10 2 40 -8 C60 -30 90 -46 112 -40 C130 -34 140 -20 150 -14 C170 -12 190 -20 205 -24 C222 -20 232 -4 244 20 C252 40 262 58 262 72 C262 84 250 88 238 84 C226 78 212 70 200 64 C186 60 176 70 170 90 C164 120 150 146 128 150 C118 150 112 146 108 142 C60 150 -60 152 -150 146 C-200 144 -236 130 -252 96 C-262 70 -262 40 -250 20Z" fill={BULL} stroke={BULL_LINE} sw={1.6} />
      {/* soft grey contour lines (the only modelling Pahari painters allow themselves) */}
      <S d="M-240 96 C-220 120 -180 132 -150 136 M-40 138 C20 140 80 136 104 130 M150 40 C160 60 164 80 166 96" stroke="#B9B1A2" sw={3} op={.6} />
      {/* near legs */}
      {leg(96, 136, false, false, k)}
      {leg(-252, 96, false, true, -k)}
      {/* saddle cloth */}
      <S d="M-150 -4 C-80 0 -10 2 40 -8 C50 20 54 60 52 96 C-20 104 -100 104 -156 96 C-160 60 -158 20 -150 -4Z" fill={jhool} sw={1.4} />
      <S d="M-146 12 C-80 16 -10 18 44 8 M-156 84 C-100 92 -20 92 50 84" stroke={P.gold} sw={3} />
      {Array.from({ length: 5 }, (_, i) => Array.from({ length: 3 }, (_, j) => <circle key={i + '_' + j} cx={-128 + i * 40 + (j % 2) * 20} cy={32 + j * 20} r={3.2} fill={P.goldHi} stroke={P.goldDeep} strokeWidth={.6} />))}
      {Array.from({ length: 9 }, (_, i) => { const x = -150 + i * 25; return <g key={i}><path d={`M${x} 96 V112`} stroke={P.gold} strokeWidth={1.6} /><circle cx={x} cy={115} r={3} fill={P.gold} stroke={P.goldDeep} strokeWidth={.6} /></g>; })}
      {/* neck band with bells */}
      <S d="M150 -12 C160 30 168 60 172 84 L186 80 C180 52 172 24 164 -16Z" fill={band} sw={1.2} />
      {[0, 1, 2].map((i) => <Gold key={i} d={`M${165 + i * 3} ${24 + i * 22} a6 6 0 1 0 12 0 l-2 8 h-8z`} sw={.8} />)}
      {/* horns and ears */}
      <S d="M190 -22 C182 -50 166 -64 150 -72 C166 -56 176 -40 180 -18Z" fill="#CFC4AE" stroke={BULL_LINE} sw={1.2} />
      <S d="M204 -24 C200 -52 188 -70 172 -80 C186 -62 194 -44 194 -20Z" fill="#E4DBC7" stroke={BULL_LINE} sw={1.3} />
      <g transform={`rotate(${ear * 8} 190 0)`}><S d="M192 -6 C176 -6 162 -2 154 6 C168 12 184 8 198 2Z" fill="#EFD7CC" stroke={BULL_LINE} sw={1.2} /></g>
      {/* eye, nostril, mouth */}
      {blink < .5 ? (
        <g><S d="M214 10 C218 3 228 3 232 9 C228 13 218 14 214 10Z" fill={P.pearl} stroke={BULL_LINE} sw={1} /><circle cx={226} cy={8.5} r={3} fill={P.hair} /><S d="M210 10 L214 10 C218 3 228 3 232 9" stroke={P.hair} sw={1.4} /></g>
      ) : <S d="M212 10 C220 13 228 12 232 9" stroke={P.hair} sw={1.4} />}
      <S d="M250 60 C254 56 258 58 257 64" stroke={BULL_LINE} sw={1.4} />
      <S d="M238 84 C244 80 252 78 258 78" stroke={BULL_LINE} sw={1.2} />
      <S d="M228 38 C236 50 242 56 250 60" stroke="#EAC8B8" sw={4} op={.7} />
    </g>
  );
};

export { circle };
