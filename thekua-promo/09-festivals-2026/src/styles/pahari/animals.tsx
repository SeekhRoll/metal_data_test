import React from 'react';
import { P } from './palette';
import { S, Gold, circle } from './paint';
import { limb } from './body';

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

// ---------------------------------------------------------------- Pahari horse, facing right: arched neck, slender legs, henna-dyed lower legs
const HORSE_LINE = '#5E5246';
export const Horse: React.FC<{ coat?: string; far?: string; step?: number; henna?: boolean; plume?: boolean; plate?: boolean; saddle?: string; tail?: number; blink?: number }> = ({ coat = '#F3EEE2', far = '#D6CFBE', step = 0, henna = true, plume = true, plate = false, saddle, tail = 0, blink = 0 }) => {
  const k = Math.sin(step * Math.PI * 2);
  const hn = '#C8643A';
  // jointed legs: shoulder/stifle → knee/hock → fetlock → hoof, tapered, tops tucked under the body
  const leg = (x: number, hind: boolean, c: string, sh: number) => {
    const dx = sh * 18;
    const pts: [number, number][] = hind
      ? [[x, 40], [x + 20 + dx * .2, 120], [x - 6 + dx * .6, 196], [x + 2 + dx, 266], [x + 6 + dx, 284]]
      : [[x, 60], [x + 4 + dx * .2, 136], [x + 2 + dx * .6, 196], [x + 6 + dx, 266], [x + 10 + dx, 284]];
    const wd = hind ? [64, 38, 18, 14, 15] : [44, 28, 19, 14, 15];
    return (
      <g>
        <S d={limb(pts, wd)} fill={c} stroke={HORSE_LINE} sw={1.3} />
        {henna && <S d={limb(pts.slice(2), wd.slice(2))} fill={hn} stroke="none" op={.8} />}
        <S d={`M${pts[4][0] - 9} ${pts[4][1] - 4} H${pts[4][0] + 10} L${pts[4][0] + 12} ${pts[4][1] + 8} H${pts[4][0] - 10}Z`} fill="#3A302A" sw={1} />
      </g>
    );
  };
  return (
    <g data-id="horse" data-kind="graphic">
      {leg(98, false, far, -k)}
      {leg(-178, true, far, k)}
      {/* tail, henna-dyed */}
      <S d={`M-206 36 C${-240 + tail * 6} 20 ${-252 + tail * 10} 80 ${-246 + tail * 14} 150 C${-244 + tail * 14} 190 ${-236 + tail * 16} 220 ${-240 + tail * 18} 240 C${-226 + tail * 14} 220 ${-222 + tail * 12} 180 ${-224 + tail * 10} 140 C${-226 + tail * 6} 90 -216 56 -204 44Z`} fill={henna ? hn : '#8A7E70'} stroke={HORSE_LINE} sw={1.2} />
      {leg(76, false, coat, k)}
      {leg(-200, true, coat, -k)}
      {/* body */}
      <S d="M-205 30 C-200 4 -170 -10 -120 -6 C-60 2 -10 4 20 -6 C40 -50 80 -110 140 -136 C162 -144 180 -140 188 -130 L200 -146 L200 -122 C214 -104 232 -78 244 -58 C250 -46 246 -36 234 -36 C220 -36 206 -44 194 -54 C180 -62 170 -58 166 -44 C160 -10 150 30 132 64 C124 84 112 106 100 118 C40 134 -60 134 -150 118 C-196 110 -222 84 -222 54 C-222 42 -214 34 -205 30Z" fill={coat} stroke={HORSE_LINE} sw={1.6} />
      {henna && [[-160, 50], [-120, 70], [70, 40]].map(([x, y], i) => <g key={i}>{Array.from({ length: 8 }, (_, j) => { const a = j / 8 * Math.PI * 2; return <circle key={j} cx={x + Math.cos(a) * 9} cy={y + Math.sin(a) * 9} r={2.6} fill={hn} opacity={.75} />; })}<circle cx={x} cy={y} r={3.4} fill={hn} opacity={.75} /></g>)}
      <S d="M-196 84 C-176 104 -146 112 -116 116 M116 52 C112 76 104 96 96 108 M-10 124 C30 124 60 122 90 118" stroke="#C9C0AE" sw={3} op={.6} />
      {/* mane */}
      {Array.from({ length: 13 }, (_, i) => { const u = i / 12, x = 22 + u * 164, y = -8 - u * 122 - Math.sin(u * Math.PI) * 30; return <S key={i} d={`M${x} ${y} C${x - 14} ${y + 6} ${x - 22} ${y + 18} ${x - 24} ${y + 30} C${x - 12} ${y + 22} ${x - 4} ${y + 14} ${x + 8} ${y + 6}Z`} fill={henna ? '#B7542E' : '#8A7E70'} stroke={HORSE_LINE} sw={.9} />; })}
      {/* saddle cloth */}
      {saddle && <g><S d="M-110 -2 C-60 2 -10 2 30 -4 C36 30 36 70 32 96 C-20 102 -80 102 -118 96 C-120 60 -118 20 -110 -2Z" fill={saddle} sw={1.3} /><S d="M-114 86 C-60 94 0 94 34 86" stroke={P.gold} sw={4} /><S d="M-108 10 C-60 14 -10 14 32 8" stroke={P.gold} sw={3} />{Array.from({ length: 7 }, (_, i) => <circle key={i} cx={-100 + i * 20} cy={104} r={3.4} fill={P.gold} stroke={P.goldDeep} strokeWidth={.6} />)}</g>}
      {/* bridle and plume */}
      <S d="M198 -116 C202 -88 216 -62 232 -44 M192 -104 C206 -94 226 -74 240 -54 M200 -60 L226 -62" stroke={P.red} sw={2.4} />
      {[0, 1, 2].map((i) => <circle key={i} cx={203 + i * 10} cy={-88 + i * 14} r={2.2} fill={P.gold} />)}
      {plume && <S d="M188 -126 C186 -156 198 -172 216 -176 C206 -166 200 -152 198 -130Z" fill={P.red} stroke={P.goldDeep} sw={.8} />}
      {plate && <Gold d="M208 -104 l14 6 l-4 16 l-14 -6z" sw={.8} />}
      {/* eye and nostril */}
      {blink < .5 ? <g><S d="M210 -90 C213 -95 220 -95 223 -91 C220 -87 213 -87 210 -90Z" fill={P.pearl} stroke={HORSE_LINE} sw={.9} /><circle cx={217.5} cy={-91.2} r={2.5} fill={P.hair} /></g> : <S d="M210 -90 C214 -88 219 -88 223 -91" stroke={P.hair} sw={1.2} />}
      <S d="M238 -48 C241 -50 242 -46 240 -44" stroke={HORSE_LINE} sw={1.2} />
    </g>
  );
};

// ---------------------------------------------------------------- makara (Ganga's vahana): crocodile body, curled trunk-snout, fish tail
export const Makara: React.FC<{ t?: number }> = ({ t = 0 }) => {
  const tw = Math.sin(t * 1.4) * 8;
  return (
    <g data-id="makara" data-kind="graphic">
      <S d={`M-180 0 C-210 -20 ${-236 + tw} -60 ${-222 + tw} -100 C${-210 + tw} -70 -200 -40 -176 -24Z`} fill="#6FA38A" sw={1.3} />
      <S d={`M-222 ${-100} C-240 -120 -250 -118 -262 -130 C-240 -128 -232 -118 ${-222 + tw} -100Z`} fill="#8FC0A6" sw={1.1} />
      <S d="M-190 -10 C-150 -44 -40 -54 60 -44 C110 -40 150 -30 170 -16 C190 -2 196 14 180 22 C120 40 -60 44 -160 30 C-186 26 -196 10 -190 -10Z" fill="#6FA38A" sw={1.5} />
      {/* scales */}
      {Array.from({ length: 30 }, (_, i) => { const x = -160 + (i % 10) * 30 + (Math.floor(i / 10) % 2) * 15, y = -30 + Math.floor(i / 10) * 16; return <path key={i} d={`M${x - 8} ${y} q8 9 16 0`} stroke="#3F6E58" strokeWidth={1} fill="none" />; })}
      <S d="M-150 28 C-60 40 110 36 176 20" stroke="#E4D48C" sw={6} />
      {/* head with upturned trunk-snout and open jaw */}
      <S d="M150 -30 C176 -48 206 -52 224 -40 C240 -60 246 -86 236 -102 C250 -96 256 -70 246 -46 C252 -40 256 -30 250 -22 C232 -18 214 -16 200 -10 C218 -4 230 6 228 14 C206 14 184 10 168 0Z" fill="#6FA38A" sw={1.4} />
      <S d="M200 -10 C214 -6 226 2 228 12" stroke="#B94A3A" sw={4} />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M${206 + i * 7} -12 l2 5`} stroke={P.pearl} strokeWidth={2} />)}
      <S d="M200 -38 C204 -44 212 -44 214 -38 C210 -34 204 -34 200 -38Z" fill={P.pearl} stroke={P.hair} sw={.9} />
      <circle cx={208} cy={-38.4} r={2.4} fill={P.hair} />
      <S d="M176 -44 C180 -64 194 -72 204 -68 C196 -60 188 -52 186 -42Z" fill="#8FC0A6" sw={1} />
      {/* legs with claws */}
      {[[-120, 30], [90, 26]].map(([x, y], i) => <S key={i} d={`M${x} ${y} C${x + 4} ${y + 20} ${x + 10} ${y + 30} ${x + 22} ${y + 34} L${x + 30} ${y + 30} L${x + 22} ${y + 26} C${x + 18} ${y + 18} ${x + 16} ${y + 10} ${x + 16} ${y}Z`} fill="#6FA38A" sw={1.1} />)}
      {/* fin crest */}
      {Array.from({ length: 7 }, (_, i) => <S key={i} d={`M${-120 + i * 34} -48 L${-108 + i * 34} -66 L${-96 + i * 34} -47`} fill="#8FC0A6" sw={1} />)}
    </g>
  );
};

// ---------------------------------------------------------------- the chariot (ratha): two spoked wheels, carved box, parasol and flag
export const Chariot: React.FC<{ t?: number; flag?: string }> = ({ t = 0, flag = P.saffron }) => {
  const rot = t * 90;
  return (
    <g data-id="chariot" data-kind="graphic">
      {/* shaft */}
      <S d="M60 60 C160 50 240 10 330 -86" stroke={P.wood} sw={7} fill="none" />
      {/* box */}
      <S d="M-110 70 H80 L90 -10 H-100Z" fill="#B8742E" sw={1.5} />
      <S d="M-100 -10 H90 V-22 H-100Z" fill={P.gold} sw={1.2} />
      {Array.from({ length: 10 }, (_, i) => <S key={i} d={`M${-92 + i * 19} -10 V60`} stroke="#7A4B2A" sw={3} />)}
      <S d="M-110 70 H80" stroke={P.goldDeep} sw={3} />
      {/* parasol */}
      <S d="M-40 -22 V-440" stroke={P.goldDeep} sw={4} />
      <S d="M-150 -430 C-110 -480 30 -480 70 -430 Z" fill={P.red} sw={1.4} />
      {Array.from({ length: 11 }, (_, i) => <circle key={i} cx={-144 + i * 21} cy={-428} r={3} fill={P.gold} stroke={P.goldDeep} strokeWidth={.6} />)}
      <Gold d="M-44 -466 h8 l-4 -14z" />
      <S d="M80 -10 V-300" stroke={P.goldDeep} sw={3} />
      <S d={`M80 -300 L${136 + 5 * Math.sin(t * 5)} -288 L80 -272Z`} fill={flag} sw={1} />
      {/* wheel */}
      <g transform={`translate(-20 80) rotate(${rot})`}>
        <S d={circle(0, 0, 70)} fill="none" stroke="#6A3E1E" sw={9} />
        <S d={circle(0, 0, 70)} fill="none" stroke={P.goldDeep} sw={1.2} />
        {Array.from({ length: 12 }, (_, i) => { const a = i / 12 * Math.PI * 2; return <path key={i} d={`M0 0 L${Math.cos(a) * 66} ${Math.sin(a) * 66}`} stroke="#6A3E1E" strokeWidth={3.5} />; })}
        <S d={circle(0, 0, 12)} fill={P.gold} stroke={P.goldDeep} sw={1} />
      </g>
    </g>
  );
};
