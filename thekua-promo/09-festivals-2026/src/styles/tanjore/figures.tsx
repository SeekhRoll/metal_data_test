import React from 'react';
import { TJ, P, Ln, Foil, Gem, gemRow, TFace, smooth, tube, lens, circle } from './kit';

type Pt = [number, number, number];
const Arm: React.FC<{ sp: Pt[]; skin: string; t?: number }> = ({ sp, skin, t = 0 }) => {
  const e = sp[sp.length - 1], p = sp[sp.length - 2], bx = p[0] + (e[0] - p[0]) * .8, by = p[1] + (e[1] - p[1]) * .8, [ax, ay] = sp[0];
  return <g><P d={tube(sp)} fill={skin} /><Foil d={lens(bx - 18, by, bx + 18, by, 7)} /><Foil d={lens(ax + (sp[1][0] - ax) * .35 - 18, ay + (sp[1][1] - ay) * .35, ax + (sp[1][0] - ax) * .35 + 18, ay + (sp[1][1] - ay) * .35, 6)} /></g>;
};
const Hand: React.FC<{ x: number; y: number; skin: string; rot?: number; s?: number }> = ({ x, y, skin, rot = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}><P d="M-20 16 C-24 -8 -22 -34 -16 -46 C-12 -54 -6 -52 -6 -44 L-4 -24 L-2 -54 C0 -62 8 -62 8 -54 L8 -24 L12 -50 C14 -58 22 -58 22 -48 L18 -18 L26 -34 C30 -42 38 -38 34 -28 C30 -12 24 4 18 16Z" fill={skin} w={2.4} /></g>
);
export const Chakra: React.FC<{ x: number; y: number; s?: number; t?: number }> = ({ x, y, s = 1, t = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}><g transform={`rotate(${t * 20})`}><Foil d={`${circle(0, 0, 46)} ${circle(0, 0, 30)}`}>{Array.from({ length: 8 }, (_, i) => <path key={i} d={`M0 0 L${Math.cos(i * .785) * 46} ${Math.sin(i * .785) * 46}`} stroke={TJ.gold} strokeWidth={6} />)}{Array.from({ length: 12 }, (_, i) => <path key={'f' + i} d={`M${Math.cos(i * .5236) * 46} ${Math.sin(i * .5236) * 46} L${Math.cos(i * .5236 + .26) * 62} ${Math.sin(i * .5236 + .26) * 62} L${Math.cos(i * .5236 + .4) * 46} ${Math.sin(i * .5236 + .4) * 46}Z`} fill={TJ.gold} />)}</Foil></g><Gem x={0} y={0} r={10} c={TJ.ruby} t={t} ph={2} /></g>
);
export const Shankh: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}><P d="M-30 30 C-50 0 -40 -40 0 -54 C30 -60 50 -40 40 -10 C34 10 20 30 0 44 C-10 50 -24 44 -30 30Z" fill={TJ.pearl} /><Ln d="M-20 20 C-10 0 10 -20 30 -20 M-10 34 C0 20 20 0 36 -4" w={2} /><Foil d="M-34 26 C-40 40 -30 56 -14 52 L-6 42Z" /></g>
);
export const Gada: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}><Foil d="M-7 0 V-190 H7 V0Z M-40 -200 C-40 -260 40 -260 40 -200 C40 -170 -40 -170 -40 -200Z M-14 0 H14 V20 H-14Z" beads={[[0, -230], [-24, -205], [24, -205], [0, -186]]} r={5} /></g>
);
export const TLotus: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}><Ln d="M0 10 C6 60 -6 110 0 160" w={6} c={TJ.greenDeep} />{[-2, -1, 0, 1, 2].map((k) => <P key={k} d={`M0 16 C${k * 16 - 18} 0 ${k * 16 - 10} -26 ${k * 13} -48 C${k * 16 + 10} -26 ${k * 16 + 18} 0 0 16Z`} fill={Math.abs(k) % 2 ? '#E8889A' : '#F7C7CF'} w={2.4} />)}</g>
);
export const Trishul: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}><Foil d="M-5 300 V-80 H5 V300Z M-48 -70 C-54 -110 -44 -140 -34 -160 C-34 -130 -24 -100 -8 -92 L-5 -170 L0 -205 L5 -170 L8 -92 C24 -100 34 -130 34 -160 C44 -140 54 -110 48 -70 C32 -80 14 -84 0 -84 C-14 -84 -32 -80 -48 -70Z" /><P d="M-20 -40 C-20 -70 20 -70 20 -40 L4 -10 L20 20 C20 50 -20 50 -20 20 L-4 -10Z" fill={TJ.redDeep} w={2} /></g>
);
const Necklaces: React.FC<{ y: number; w: number; t: number }> = ({ y, w, t }) => <g>
  {[0, 1, 2].map((i) => <Foil key={i} d={`M${-w / 2 + i * 8} ${y + i * 6} C${-w / 4} ${y + 60 + i * 34} ${w / 4} ${y + 60 + i * 34} ${w / 2 - i * 8} ${y + i * 6} L${w / 2 - i * 8 - 3} ${y + i * 6 + 10} C${w / 4} ${y + 70 + i * 34} ${-w / 4} ${y + 70 + i * 34} ${-w / 2 + i * 8 + 3} ${y + i * 6 + 10}Z`} />)}
  {gemRow([[0, y + 110], [-36, y + 96], [36, y + 96], [0, y + 60]], t, 9)}
</g>;

// seated four-armed Devi (Siddhidatri): chakra, shankh, gada, lotus; red saree with gold buti; on the lotus seat. Origin: seat centre.
export const Siddhidatri: React.FC<{ t?: number; blink?: number }> = ({ t = 0, blink = 0 }) => {
  const sk = 'url(#tjSkin)', br = Math.sin(t * 1.1) * 2;
  return <g>
    <Arm sp={[[70, -400, 36], [150, -450, 30], [160, -540, 26]]} skin={sk} /><Chakra x={166} y={-590} s={.95} t={t} /><Hand x={162} y={-546} skin={sk} s={.9} />
    <Arm sp={[[-70, -400, 36], [-150, -450, 30], [-160, -540, 26]]} skin={sk} /><Shankh x={-166} y={-600} /><Hand x={-162} y={-546} skin={sk} s={.9} />
    <P d="M-80 -170 C-230 -160 -270 -80 -260 0 L260 0 C270 -80 230 -160 80 -170Z" fill={TJ.red} pat="tjButi" />
    <Foil d="M-262 -14 C-130 12 130 12 262 -14 L262 6 C130 30 -130 30 -262 6Z" />
    {[-1, 1].map((k) => <P key={k} d={`M${k * 16} -46 C${k * 60} -62 ${k * 120} -60 ${k * 144} -42 C${k * 120} -28 ${k * 60} -26 ${k * 16} -34Z`} fill={sk} w={2.4} />)}
    {[-1, 1].map((k) => <Foil key={k} d={lens(k * 130 - 14, -40, k * 130 + 14, -40, 6)} />)}
    <P d="M-64 -270 C-68 -220 -72 -190 -76 -170 L76 -170 C72 -190 68 -220 64 -270Z" fill={sk} />
    <P d="M-80 -186 H80 L74 -160 H-74Z" fill={TJ.red} pat="tjButi" /><Foil d="M-80 -196 H80 V-180 H-80Z" beads={[[-50, -188], [0, -188], [50, -188]]} />
    <g transform={`translate(0 ${-br})`}>
      <P d="M-88 -420 C-92 -360 -80 -300 -64 -268 L64 -268 C80 -300 92 -360 88 -420 C50 -440 -50 -440 -88 -420Z" fill={sk} />
      <P d="M-86 -390 C-50 -404 50 -404 86 -390 L80 -330 C40 -316 -40 -316 -80 -330Z" fill={TJ.green} />
      <P d="M-88 -420 C-50 -380 20 -320 64 -268 L24 -262 C-10 -310 -54 -360 -94 -380Z" fill={TJ.red} pat="tjButi" />
      <Necklaces y={-430} w={120} t={t} />
      <Arm sp={[[86, -400, 36], [130, -310, 30], [150, -230, 26]]} skin={sk} /><Gada x={156} y={-200} rot={10} s={.9} /><Hand x={150} y={-236} skin={sk} s={.9} />
      <Arm sp={[[-86, -400, 36], [-130, -310, 30], [-130, -230, 26]]} skin={sk} /><TLotus x={-132} y={-280} s={1} /><Hand x={-130} y={-236} skin={sk} s={.9} />
      <path d="M-22 -450 V-414 H22 V-450Z" fill={sk} stroke={TJ.line} strokeWidth={2} />
      <g transform="translate(0 -540) scale(.82)"><TFace t={t} blink={blink} /></g>
    </g>
  </g>;
};

// standing figure, drawn whole in one aspect; Ardhanarishvara clips the Shiva aspect to the right half of the body (viewer's left)
const Standing: React.FC<{ shiva: boolean; t: number; blink: number }> = ({ shiva, t, blink }) => {
  const sk = shiva ? 'url(#tjAsh)' : 'url(#tjSkin)';
  return <g>
    {/* upper arms: trishul (Shiva) / lotus (Shakti) */}
    {shiva ? <><Arm sp={[[-90, -760, 36], [-190, -800, 30], [-200, -900, 26]]} skin={sk} /><Trishul x={-206} y={-940} s={.95} /><Hand x={-202} y={-906} skin={sk} s={.9} /></>
      : <><Arm sp={[[90, -760, 36], [190, -800, 30], [200, -900, 26]]} skin={sk} /><TLotus x={206} y={-960} s={1.1} /><Hand x={202} y={-906} skin={sk} s={.9} /></>}
    {/* legs */}
    {[-1, 1].map((k) => <P key={k} d={tube([[k * 40, -300, 70], [k * 50, -150, 58], [k * 52, -30, 46]])} fill={sk} />)}
    {[-1, 1].map((k) => <P key={k} d={`M${k * 30} -30 C${k * 30} 0 ${k * 90} 6 ${k * 100} -10 C${k * 90} -30 ${k * 60} -34 ${k * 30} -30Z`} fill={sk} w={2.4} />)}
    {[-1, 1].map((k) => <Foil key={k} d={`M${k * 52 - 26} -50 h52 v14 h-52Z`} />)}
    {/* lower garment: tiger skin (Shiva) / green silk to the ankle (Shakti) */}
    {shiva ? <P d="M-120 -560 C-140 -480 -150 -380 -140 -300 L140 -300 C150 -380 140 -480 120 -560Z" fill={TJ.tiger} pat="tjTiger" />
      : <P d="M-120 -560 C-150 -400 -170 -200 -150 -40 L150 -40 C170 -200 150 -400 120 -560Z" fill={TJ.silk} pat="tjButi" />}
    {!shiva && <Foil d="M-152 -60 H152 V-36 H-152Z" />}
    <Foil d="M-126 -580 H126 V-548 H-126Z" beads={[[-90, -564], [-30, -564], [30, -564], [90, -564]]} />
    {/* torso */}
    <P d="M-110 -790 C-120 -700 -110 -620 -96 -560 L96 -560 C110 -620 120 -700 110 -790 C60 -812 -60 -812 -110 -790Z" fill={sk} />
    {shiva ? <><Ln d="M-100 -790 C-40 -700 30 -620 90 -566" w={5} c={TJ.white} /><P d="M-86 -780 C-60 -730 60 -730 86 -780 C80 -760 60 -740 70 -720 C40 -730 -40 -730 -70 -720 C-60 -740 -80 -760 -86 -780Z" fill="#3E7F5A" /><circle cx={70} cy={-722} r={9} fill="#3E7F5A" stroke={TJ.line} strokeWidth={2} />
      {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={-64 + i * 16} cy={-690 + Math.abs(i - 4) * -8 + 30} r={6} fill="#6B2E1A" stroke={TJ.line} strokeWidth={1.4} />)}</>
      : <><P d="M-108 -760 C-60 -776 60 -776 108 -760 L100 -690 C50 -676 -50 -676 -100 -690Z" fill={TJ.red} /><Necklaces y={-800} w={140} t={t} /></>}
    {/* lower arms: abhaya (Shiva) / resting on the hip (Shakti) */}
    {shiva ? <><Arm sp={[[-106, -770, 36], [-150, -670, 30], [-140, -610, 26]]} skin={sk} /><Hand x={-142} y={-620} skin={sk} /></>
      : <><Arm sp={[[106, -770, 36], [160, -680, 30], [120, -580, 26]]} skin={sk} /><Hand x={122} y={-584} skin={sk} rot={150} s={.9} /></>}
    <path d="M-24 -820 V-780 H24 V-820Z" fill={sk} stroke={TJ.line} strokeWidth={2} />
    <g transform="translate(0 -920) scale(.9)"><TFace skin={sk} t={t} blink={blink} crown={shiva ? 'jata' : 'kireetam'} female={!shiva} /></g>
  </g>;
};
export const Ardhanari: React.FC<{ t?: number; blink?: number; split?: number }> = ({ t = 0, blink = 0, split = 1 }) => {
  // split 0 = all Shiva; 1 = the left half of the body (viewer's right) is the Devi
  const cut = 400 * (1 - split);
  return <g>
    <clipPath id="ardS"><rect x={-600} y={-1400} width={600 + cut} height={1500} /></clipPath>
    <clipPath id="ardD"><rect x={cut} y={-1400} width={600} height={1500} /></clipPath>
    <g clipPath="url(#ardS)"><Standing shiva t={t} blink={blink} /></g>
    {split > 0 && <g clipPath="url(#ardD)"><Standing shiva={false} t={t} blink={blink} /></g>}
    {split > 0 && <Foil d={`M${cut - 4} -1200 h8 V-10 h-8Z`} />}
  </g>;
};
export { Standing };
