import React from 'react';
import { BP, F, Ln, PatFace, smooth, tube, lens, circle, Flower } from './kit';

type Pt = [number, number, number];
const Arm: React.FC<{ sp: Pt[]; skin: string }> = ({ sp, skin }) => <g><F d={tube(sp)} fill={skin} w={4.5} />{[.3, .78].map((f, i) => { const k = Math.min(sp.length - 1, Math.floor(f * (sp.length - 1)) + i); const [x, y] = sp[k]; return <F key={i} d={lens(x - 14, y, x + 14, y, 5)} fill={BP.yellow} w={2.4} />; })}</g>;
const Hand: React.FC<{ x: number; y: number; skin: string; rot?: number; s?: number }> = ({ x, y, skin, rot = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}><F d="M-20 16 C-24 -8 -22 -34 -16 -46 C-12 -54 -6 -52 -6 -44 L-4 -24 L-2 -54 C0 -62 8 -62 8 -54 L8 -24 L12 -50 C14 -58 22 -58 22 -48 L18 -18 L26 -34 C30 -42 38 -38 34 -28 C30 -12 24 4 18 16Z" fill={skin} w={3.4} /></g>
);
export const Sword: React.FC<{ x: number; y: number; rot?: number; s?: number }> = ({ x, y, rot = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}><F d="M-8 0 L-12 -250 C-10 -272 10 -272 12 -250 L8 0Z" fill={BP.white} w={4} /><F d="M-36 0 H36 V16 H-36Z" fill={BP.yellow} w={3} /><F d="M-8 16 H8 V62 H-8Z" fill={BP.red} w={3} /></g>
);
export const PatLotus: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}><Ln d="M0 10 C4 60 -6 100 0 150" w={6} c={BP.greenDeep} />{[-2, -1, 0, 1, 2].map((k) => <F key={k} d={`M0 16 C${k * 16 - 18} 0 ${k * 16 - 10} -26 ${k * 13} -46 C${k * 16 + 10} -26 ${k * 16 + 18} 0 0 16Z`} fill={Math.abs(k) % 2 ? BP.red : BP.pink} w={2.6} />)}</g>
);

// Katyayani, four-armed, seated side-saddle on the lion (lion drawn separately under her). Origin: seat point.
export const Katyayani: React.FC<{ blink?: number; swordUp?: number; t?: number }> = ({ blink = 0, swordUp = 1, t = 0 }) => {
  const skin = BP.yellow, sway = Math.sin(t * 1.3) * 2;
  return <g>
    {/* upper arms (behind torso): sword raised right, lotus left */}
    <Arm sp={[[70, -250, 40], [150, -300, 34], [170 + 10 * (1 - swordUp), -400 + 50 * (1 - swordUp), 28]]} skin={skin} />
    <Sword x={176 + 10 * (1 - swordUp)} y={-410 + 50 * (1 - swordUp)} rot={14 - 40 * (1 - swordUp)} />
    <Hand x={172 + 10 * (1 - swordUp)} y={-400 + 50 * (1 - swordUp)} skin={skin} s={.9} />
    <Arm sp={[[-70, -250, 40], [-150, -300, 34], [-170, -400, 28]]} skin={skin} />
    <PatLotus x={-172} y={-450} s={1.1} /><Hand x={-172} y={-404} skin={skin} s={.9} />
    {/* saree over the lap, hanging down the lion's flank; one foot showing */}
    <F d="M-80 -120 C-130 -90 -130 10 -110 90 L120 100 C136 20 130 -90 80 -120Z" fill={BP.red} pat="patStripe" />
    <F d="M-114 84 C-40 116 50 116 124 94 L126 124 C50 148 -40 148 -116 116Z" fill={BP.yellow} />
    <F d="M30 124 C50 134 90 136 106 128 C110 150 80 160 30 154Z" fill={skin} w={3.4} />
    {/* torso: green blouse (the day's colour), red border */}
    <F d="M-86 -280 C-90 -220 -80 -160 -64 -110 L64 -110 C80 -160 90 -220 86 -280 C50 -300 -50 -300 -86 -280Z" fill={skin} />
    <F d="M-84 -250 C-50 -262 50 -262 84 -250 L78 -190 C40 -176 -40 -176 -78 -190Z" fill={BP.green} />
    <Ln d="M-78 -190 C-40 -176 40 -176 78 -190" w={6} c={BP.red} />
    {[0, 1, 2].map((i) => <Ln key={i} d={`M${-60 + i * 4} ${-276 + i * 14} C-20 ${-230 + i * 22} 20 ${-230 + i * 22} ${60 - i * 4} ${-276 + i * 14}`} w={4} c={i === 1 ? BP.red : BP.yellow} />)}
    <F d="M-96 -130 C-40 -150 40 -150 96 -130 L100 -100 C40 -118 -40 -118 -100 -100Z" fill={BP.red} />
    {/* lower arms in front: abhaya (right), varada (left) */}
    <Arm sp={[[80, -260, 40], [120, -190, 34], [110, -140, 28]]} skin={skin} />
    <Hand x={112} y={-150} skin={skin} />
    <Arm sp={[[-80, -260, 40], [-118, -190, 34], [-110, -120, 28]]} skin={skin} />
    <Hand x={-110} y={-104} skin={skin} rot={180} />
    <g transform={`translate(${sway * .5} -380) scale(.8)`}><PatFace skin={skin} crown="shola" third blink={blink} /></g>
  </g>;
};

// Patua lion: profile to the right, pale body, orange ringlet mane, open jaws. Origin: between the feet.
export const PatLion: React.FC<{ step?: number; roar?: number }> = ({ step = 0, roar = 0 }) => {
  const body = '#F6E2A8', leg = (x: number, ph: number) => { const sw = Math.sin(step * Math.PI * 2 + ph) * 16;
    return <g key={x}><F d={`M${x - 24} -170 C${x - 26} -110 ${x - 20 + sw} -50 ${x - 22 + sw} -20 L${x + 22 + sw} -20 C${x + 24 + sw} -50 ${x + 24} -110 ${x + 26} -170Z`} fill={body} w={4} />{[0, 1, 2].map((k) => <Ln key={k} d={`M${x - 14 + sw + k * 14} -20 v14`} w={4} />)}</g>; };
  return <g>
    <Ln d="M-240 -240 C-320 -250 -350 -330 -310 -390 C-290 -420 -250 -400 -270 -370" w={16} />
    <Ln d="M-240 -240 C-320 -250 -350 -330 -310 -390 C-290 -420 -250 -400 -270 -370" w={9} c={body} />
    <F d={circle(-268, -372, 16)} fill={BP.orange} w={3} />
    {leg(-190, 0)}{leg(-120, Math.PI)}
    <F d={smooth([[-260, -230], [-240, -300], [-120, -320], [60, -320], [190, -300], [220, -220], [180, -150], [40, -140], [-140, -140], [-240, -160]], true)} fill={body} />
    {[[-150, -250], [-80, -210], [0, -270], [60, -200], [-200, -200]].map(([x, y], i) => <F key={i} d={circle(x, y, 9)} fill={BP.orange} w={2} />)}
    {leg(100, Math.PI)}{leg(170, 0)}
    {/* mane of ringlets around the head */}
    {Array.from({ length: 16 }, (_, i) => { const a = i / 16 * Math.PI * 2, x = 230 + Math.cos(a) * 92, y = -330 + Math.sin(a) * 92; return <g key={i}><F d={circle(x, y, 28)} fill={i % 2 ? BP.orange : BP.red} w={3} /><Ln d={`M${x - 10} ${y} a10 10 0 1 1 10 10`} w={3} c={BP.yellow} /></g>; })}
    <F d={smooth([[170, -400], [260, -410], [320, -370], [330, -310], [310, -270], [240, -250], [180, -270], [160, -340]], true)} fill={body} />
    <F d={lens(236, -364, 286, -372, 9)} fill={BP.white} w={3} /><circle cx={262} cy={-368} r={9} fill={BP.black} />
    <Ln d="M226 -392 Q262 -410 296 -392" w={4} />
    <F d={`M290 -300 L338 ${-298 + roar * 6} C336 ${-270 + roar * 14} 300 ${-262 + roar * 14} 280 ${-270 + roar * 10}Z`} fill={BP.red} w={3} />
    {[300, 318].map((x) => <F key={x} d={`M${x} -300 l6 14 l6 -14Z`} fill={BP.white} w={1.6} />)}
    <F d={circle(322, -334, 8)} fill={BP.black} w={0} />
  </g>;
};

// Mahishasura: green, horned crown, moustache, sword and shield, wide stance. Origin: between the feet.
export const Mahisha: React.FC<{ blink?: number; stomp?: number }> = ({ blink = 0, stomp = 0 }) => {
  const skin = BP.skinGreen;
  return <g>
    <Arm sp={[[90, -560, 50], [200, -620, 42], [230 + stomp * 10, -720, 34]]} skin={skin} />
    <Sword x={234 + stomp * 10} y={-734} rot={30 + stomp * 20} s={1.2} />
    <Hand x={230 + stomp * 10} y={-724} skin={skin} />
    {[-1, 1].map((k) => <F key={k} d={tube([[k * 60, -330, 70], [k * 150, -170, 60], [k * 170, -20, 50]])} fill={skin} />)}
    {[-1, 1].map((k) => <F key={k} d={`M${k * 140} -30 C${k * 160} -34 ${k * 230} -30 ${k * 240} -6 L${k * 140} 0Z`} fill={skin} w={4} />)}
    <F d="M-150 -380 C-190 -300 -200 -220 -190 -170 L190 -170 C200 -220 190 -300 150 -380Z" fill={BP.red} pat="patStripe" />
    <F d="M-110 -620 C-130 -520 -120 -440 -100 -380 L100 -380 C120 -440 130 -520 110 -620 C60 -640 -60 -640 -110 -620Z" fill={skin} />
    <Ln d="M-60 -560 C-30 -540 30 -540 60 -560 M-40 -480 C-20 -470 20 -470 40 -480" w={3} c={BP.greenDeep} />
    <F d="M-120 -400 H120 V-366 H-120Z" fill={BP.yellow} />
    <Arm sp={[[-90, -560, 50], [-190, -500, 42], [-200, -420, 34]]} skin={skin} />
    <F d={circle(-210, -430, 76)} fill={BP.indigo} />
    {[50, 26].map((r) => <circle key={r} cx={-210} cy={-430} r={r} fill="none" stroke={BP.yellow} strokeWidth={5} />)}
    <g transform="translate(0 -730) scale(.95)"><PatFace skin={skin} female={false} crown="demon" moustache blink={blink} /></g>
  </g>;
};

// the buffalo form: profile to the left, indigo-black, sweeping horns
export const Buffalo: React.FC<{ step?: number }> = ({ step = 0 }) => {
  const c = '#2D2F3E', leg = (x: number, ph: number) => { const sw = Math.sin(step * Math.PI * 2 + ph) * 18; return <F key={x} d={`M${x - 22} -150 L${x - 20 + sw} -10 L${x + 20 + sw} -10 L${x + 22} -150Z`} fill={c} w={4} />; };
  return <g>
    {leg(-150, 0)}{leg(-80, Math.PI)}{leg(100, Math.PI)}{leg(170, 0)}
    <F d={smooth([[-230, -250], [-120, -330], [80, -340], [230, -280], [240, -160], [100, -130], [-120, -130], [-240, -170]], true)} fill={c} />
    <Ln d="M230 -250 C270 -230 290 -200 300 -150" w={6} c={BP.black} />
    <F d={smooth([[-200, -300], [-300, -290], [-340, -220], [-320, -170], [-250, -180], [-220, -230]], true)} fill={c} />
    <F d="M-230 -300 C-300 -380 -250 -440 -170 -420 C-230 -410 -250 -370 -214 -318Z" fill={BP.white} w={4} />
    <F d={lens(-300, -250, -270, -256, 7)} fill={BP.red} w={2.4} /><circle cx={-286} cy={-253} r={5} fill={BP.black} />
    <circle cx={-326} cy={-196} r={5} fill={BP.black} />
  </g>;
};
export const Elephant: React.FC = () => <g>
  {[-150, -60, 80, 160].map((x) => <F key={x} d={`M${x - 30} -150 L${x - 30} 0 L${x + 30} 0 L${x + 30} -150Z`} fill={BP.grey} w={4} />)}
  <F d={smooth([[-220, -200], [-140, -360], [60, -380], [200, -320], [230, -200], [140, -130], [-160, -130]], true)} fill={BP.grey} />
  <F d="M-200 -300 C-280 -300 -300 -200 -290 -60 C-288 -30 -260 -30 -262 -60 C-270 -160 -250 -230 -210 -240Z" fill={BP.grey} />
  <F d="M-150 -340 C-100 -250 -40 -250 -20 -300 C-40 -360 -100 -380 -150 -340Z" fill={BP.pink} />
  <F d="M-210 -250 C-250 -230 -260 -200 -240 -190" fill="none" /><F d="M-220 -240 L-250 -196 L-228 -200Z" fill={BP.white} w={3} />
  <circle cx={-190} cy={-300} r={7} fill={BP.black} />
</g>;

// the sage: cross-legged, saffron, white beard, eyes closed, matted hair
export const Sage: React.FC<{ breathe?: number }> = ({ breathe = 0 }) => {
  const skin = BP.pink;
  return <g>
    <F d="M-250 0 C-260 -80 -180 -130 -80 -140 L80 -140 C180 -130 260 -80 250 0Z" fill={BP.orange} pat="patStripe" />
    <g transform={`translate(0 ${-breathe * 3})`}><F d="M-120 -140 C-130 -240 -120 -330 -90 -400 L90 -400 C120 -330 130 -240 120 -140Z" fill={skin} /></g>
    <Ln d="M-110 -390 C-50 -300 50 -300 110 -390" w={6} c={BP.redDeep} />
    {Array.from({ length: 9 }, (_, i) => <F key={i} d={circle(-80 + i * 20, -330 + Math.abs(i - 4) * -12 + 34, 7)} fill={BP.redDeep} w={2} />)}
    <Arm sp={[[-100, -380, 40], [-150, -250, 34], [-60, -150, 28]]} skin={skin} />
    <Arm sp={[[100, -380, 40], [150, -250, 34], [60, -150, 28]]} skin={skin} />
    <F d={lens(-60, -150, 60, -150, 14)} fill={skin} w={3.4} />
    <g transform={`translate(0 ${-500 - breathe * 3}) scale(.9)`}><PatFace skin={skin} female={false} crown="jata" closed={1} beard /></g>
  </g>;
};
export const Hut: React.FC = () => <g>
  <F d="M-150 0 V-180 H150 V0Z" fill={BP.paper} pat="patStripe" />
  <F d="M-50 0 V-120 H50 V0Z" fill={BP.black} />
  <F d="M-200 -170 C-150 -300 150 -300 200 -170 C100 -200 -100 -200 -200 -170Z" fill={BP.orange} pat="patStripe" />
</g>;
export const Tree: React.FC<{ s?: number }> = ({ s = 1 }) => <g transform={`scale(${s})`}>
  <F d="M-20 0 C-14 -100 -16 -200 -10 -260 L10 -260 C16 -200 14 -100 20 0Z" fill={BP.redDeep} />
  {Array.from({ length: 9 }, (_, i) => { const a = -Math.PI / 2 + (i - 4) * .36, r = 110; return <F key={i} d={lens(0, -250, Math.cos(a) * r, -250 + Math.sin(a) * r, 20)} fill={i % 2 ? BP.green : BP.greenDeep} w={3} />; })}
  <Flower x={0} y={-260} r={18} c={BP.red} />
</g>;
