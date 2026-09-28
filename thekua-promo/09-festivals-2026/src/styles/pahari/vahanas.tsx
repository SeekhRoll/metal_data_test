import React from 'react';
import { P } from './palette';
import { S, Gold, circle, ellipse } from './paint';
import { limb } from './body';

// Pahari big cats and the donkey, facing right, back line ≈ y 0, paws/hooves at ≈ y 250. `blink`, `tail` for idle life.
const LINE = '#5A3A1E';
const legs = (coat: string, far: string, xs: [number, number, number, number], hoof?: string) => {
  const one = (x: number, hind: boolean, c: string) => {
    const pts: [number, number][] = hind ? [[x, 30], [x + 18, 110], [x - 4, 180], [x + 4, 244]] : [[x, 50], [x + 4, 130], [x + 2, 200], [x + 8, 244]];
    return <g key={x + c}><S d={limb(pts, hind ? [60, 34, 20, 18] : [42, 26, 20, 18])} fill={c} stroke={LINE} sw={1.3} />
      {hoof ? <S d={`M${pts[3][0] - 10} ${pts[3][1] - 4} H${pts[3][0] + 10} L${pts[3][0] + 12} ${pts[3][1] + 8} H${pts[3][0] - 10}Z`} fill={hoof} sw={1} />
        : <S d={`M${pts[3][0] - 12} ${pts[3][1] - 6} C${pts[3][0] - 12} ${pts[3][1] + 8} ${pts[3][0] + 22} ${pts[3][1] + 8} ${pts[3][0] + 22} ${pts[3][1] + 2} C${pts[3][0] + 22} ${pts[3][1] - 6} ${pts[3][0] + 10} ${pts[3][1] - 8} ${pts[3][0] - 12} ${pts[3][1] - 6}Z`} fill={c} stroke={LINE} sw={1.2} />}</g>;
  };
  return { far: [one(xs[1], false, far), one(xs[3], true, far)], near: [one(xs[0], false, coat), one(xs[2], true, coat)] };
};

// lion: golden body, curling mane drawn lock by lock, tufted tail
export const Lion: React.FC<{ tail?: number; blink?: number; roar?: boolean }> = ({ tail = 0, blink = 0 }) => {
  const coat = '#E2A64A', far = '#C98E38', L = legs(coat, far, [140, 166, -196, -170]);
  return (
    <g data-id="lion" data-kind="graphic">
      {L.far}
      {/* tail curling up over the back, tufted */}
      <S d={`M-222 30 C${-266 + tail * 6} 20 ${-280 + tail * 8} -40 ${-250 + tail * 10} -80 C${-236 + tail * 10} -96 ${-220 + tail * 10} -92 ${-216 + tail * 10} -84`} stroke={LINE} sw={5} />
      <S d={`M${-216 + tail * 10} -84 c10 -14 30 -10 28 6 c-4 12 -22 12 -28 -6Z`} fill="#8A4A1E" sw={1} />
      {/* deep chest, tucked waist, rounded haunch */}
      <S d="M-226 40 C-230 0 -190 -14 -140 -8 C-80 0 -20 10 30 -4 C80 -20 120 -40 150 -30 C184 0 196 50 184 96 C176 118 150 128 130 124 C100 118 60 96 20 96 C-40 98 -100 112 -160 116 C-210 112 -224 80 -226 40Z" fill={coat} sw={1.6} />
      <S d="M-150 100 C-110 92 -60 86 -20 88" stroke="#C98E38" sw={3} op={.7} />
      {L.near}
      {/* mane: overlapping flame-shaped locks around the head and down the chest */}
      {Array.from({ length: 26 }, (_, i) => { const a = -2.9 + i * .2, r = 96 + (i % 3) * 12, cx = 214 + Math.cos(a) * r * .8, cy = -4 + Math.sin(a) * r * .95; return <S key={i} d={`M${cx} ${cy} C${cx - 22} ${cy - 12} ${cx - 38} ${cy + 10} ${cx - 34} ${cy + 34} C${cx - 22} ${cy + 20} ${cx - 8} ${cy + 14} ${cx} ${cy}Z`} fill={i % 2 ? '#B8702A' : '#9A5A22'} stroke={LINE} sw={1} />; })}
      {/* head */}
      <S d="M190 -64 C230 -80 272 -62 282 -24 C290 2 286 28 272 42 C256 56 226 58 206 46 C186 32 178 -24 190 -64Z" fill={coat} sw={1.5} />
      <S d="M268 20 C276 24 282 32 276 40 C268 46 256 44 252 38" stroke={LINE} sw={1.4} />
      <S d="M276 -8 C282 -8 286 -2 284 4 L274 4Z" fill="#6A3A1E" sw={1} />
      {blink < .5 ? <g><S d="M240 -32 C244 -40 256 -40 260 -32 C256 -26 244 -26 240 -32Z" fill="#F2E08A" sw={1.1} /><circle cx={252} cy={-33} r={3.4} fill={P.hair} /></g> : <S d="M240 -32 C248 -28 254 -28 260 -32" sw={1.4} />}
      <S d="M236 -46 Q250 -54 262 -44" stroke={LINE} sw={1.4} />
      <S d="M200 -62 C196 -80 206 -90 218 -84 C216 -76 210 -68 206 -60Z" fill={coat} sw={1.1} />
      {[0, 1, 2].map((i) => <S key={i} d={`M${262 + i * 5} ${24 + i * 2} l24 ${-4 + i * 4}`} stroke={LINE} sw={.8} />)}
    </g>
  );
};

// tiger (Chandraghanta): orange with black stripes, white belly
export const Tiger: React.FC<{ tail?: number; blink?: number }> = ({ tail = 0, blink = 0 }) => {
  const coat = '#E08A2E', far = '#C4731E', L = legs(coat, far, [150, 176, -190, -164]);
  const stripes = Array.from({ length: 11 }, (_, i) => { const x = -190 + i * 32; return <S key={i} d={`M${x} ${-2 + (i % 2) * 4} C${x + 10} 30 ${x - 6} 60 ${x + 4} 90`} stroke={P.hair} sw={5} />; });
  return (
    <g data-id="tiger" data-kind="graphic">
      {L.far}
      <S d={`M-222 20 C${-262 + tail * 8} 10 ${-282 + tail * 12} 90 ${-262 + tail * 16} 170`} stroke={LINE} sw={9} />
      {[0, 1, 2].map((i) => <S key={i} d={`M${-250 + tail * 10 + i * 4} ${60 + i * 36} l14 4`} stroke={P.hair} sw={4} />)}
      <S d="M-220 30 C-210 0 -150 -8 -60 -4 C20 0 100 -10 150 -20 C176 20 186 60 184 100 C178 122 160 130 140 128 C60 132 -80 134 -170 118 C-210 110 -230 70 -220 30Z" fill={coat} sw={1.6} />
      <S d="M-160 112 C-80 124 60 124 140 118" stroke="#F4EFE3" sw={10} />
      {stripes}
      {L.near}
      <S d="M160 -44 C200 -70 250 -60 266 -24 C276 0 272 28 256 42 C238 56 204 54 186 40 C168 24 158 -10 160 -44Z" fill={coat} sw={1.5} />
      <S d="M250 20 C262 26 268 34 258 42 C248 48 232 44 226 36Z" fill="#F4EFE3" sw={1} />
      {[0, 1, 2].map((i) => <S key={i} d={`M${184 + i * 14} -52 C${190 + i * 14} -40 ${186 + i * 14} -30 ${192 + i * 14} -22`} stroke={P.hair} sw={3} />)}
      <S d="M260 -6 C266 -6 270 0 268 6 L258 6Z" fill="#5A2A1E" sw={1} />
      {blink < .5 ? <g><S d="M222 -26 C226 -34 238 -34 242 -26 C238 -20 226 -20 222 -26Z" fill="#F2E08A" sw={1.1} /><circle cx={234} cy={-27} r={3.2} fill={P.hair} /></g> : <S d="M222 -26 C230 -22 236 -22 242 -26" sw={1.4} />}
      <S d="M172 -52 C166 -70 178 -80 190 -74 C188 -66 182 -58 178 -50Z" fill={coat} sw={1.1} />
    </g>
  );
};

// donkey (Kalaratri): grey, long ears, dark stripe on the back
export const Donkey: React.FC<{ tail?: number; blink?: number; ear?: number }> = ({ tail = 0, blink = 0, ear = 0 }) => {
  const coat = '#8E8A84', far = '#76726C', L = legs(coat, far, [110, 132, -160, -138], '#2A2522');
  return (
    <g data-id="donkey" data-kind="graphic">
      {L.far}
      <S d={`M-188 20 C${-210 + tail * 6} 40 ${-214 + tail * 10} 100 ${-206 + tail * 12} 150`} stroke={LINE} sw={3} />
      <S d="M-190 30 C-180 0 -120 -6 -40 -2 C20 0 70 -4 100 -20 C120 -60 150 -100 180 -110 C200 -106 214 -80 222 -50 C226 -30 216 -20 204 -24 C190 -30 176 -36 166 -30 C150 10 140 60 124 110 C60 120 -60 122 -150 112 C-186 104 -200 70 -190 30Z" fill={coat} sw={1.6} />
      <S d="M-180 12 C-100 4 20 4 100 -16 C130 -60 150 -96 176 -106" stroke="#4A4642" sw={5} />
      {L.near}
      <g transform={`rotate(${ear * 6} 176 -104)`}><S d="M172 -104 C160 -150 164 -186 176 -196 C186 -180 188 -140 184 -102Z" fill={coat} sw={1.2} /><S d="M186 -104 C184 -150 194 -184 206 -190 C212 -170 204 -130 196 -100Z" fill={coat} sw={1.2} /></g>
      <S d="M210 -36 C216 -32 220 -26 216 -22" sw={1.2} />
      {blink < .5 ? <g><S d="M186 -72 C189 -78 197 -78 200 -73 C197 -68 189 -68 186 -72Z" fill={P.pearl} sw={1} /><circle cx={194} cy={-73} r={2.6} fill={P.hair} /></g> : <S d="M186 -72 C192 -70 196 -70 200 -73" sw={1.2} />}
    </g>
  );
};

// lotus seat: layered petals seen from the side
export const LotusSeat: React.FC<{ w?: number; col?: string }> = ({ w = 300, col = '#E48C9C' }) => (
  <g data-id="lotus-seat" data-kind="graphic">
    {Array.from({ length: 9 }, (_, i) => { const x = -w / 2 + i * w / 8; return <S key={'b' + i} d={`M${x - 26} 30 C${x - 24} -6 ${x - 8} -30 ${x} -40 C${x + 8} -30 ${x + 24} -6 ${x + 26} 30Z`} fill={col} sw={1.2} />; })}
    {Array.from({ length: 8 }, (_, i) => { const x = -w / 2 + w / 16 + i * w / 8; return <S key={'f' + i} d={`M${x - 24} 40 C${x - 22} 6 ${x - 8} -14 ${x} -22 C${x + 8} -14 ${x + 22} 6 ${x + 24} 40Z`} fill="#F2B4BE" sw={1.2} />; })}
    <S d={`M${-w / 2 - 10} 40 H${w / 2 + 10} V54 H${-w / 2 - 10}Z`} fill="#6E8B3D" sw={1.2} />
  </g>
);
