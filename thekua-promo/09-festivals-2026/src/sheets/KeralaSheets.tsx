import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { KM, MuralDefs, M, circ, ell, Foliage, FrontHead, Necklaces, PlasterOverlay, Limb, Palm, KLotus } from '../styles/kerala/kit';
import { TextZone, T as Tx } from '../shared/text';
import { FONT } from '../style/fonts';

export const KSUB2 = { x: 90, y: 1630, w: 900, h: 220 };
// the mural wall: plaster ground, painted frame bands (red, yellow, green), text panel at the foot
export const MuralPage: React.FC<{ children: React.ReactNode; overlay?: React.ReactNode }> = ({ children, overlay }) => (
  <AbsoluteFill style={{ background: KM.plaster }}>
    <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
      <MuralDefs />
      <rect width={1080} height={1920} fill={KM.plaster} />
      <clipPath id="mwin"><rect x={60} y={60} width={960} height={1520} /></clipPath>
      <g clipPath="url(#mwin)"><rect x={60} y={60} width={960} height={1520} fill={KM.greenDeep} />{children}</g>
      <rect x={60} y={60} width={960} height={1520} fill="none" stroke={KM.red} strokeWidth={22} />
      <rect x={40} y={40} width={1000} height={1560} fill="none" stroke={KM.yellow} strokeWidth={14} />
      <rect x={30} y={30} width={1020} height={1580} fill="none" stroke={KM.black} strokeWidth={4} />
      {Array.from({ length: 24 }, (_, i) => <circle key={i} cx={80 + i * 40} cy={1606} r={6} fill={KM.red} stroke={KM.black} strokeWidth={1.6} />)}
      <rect x={60} y={1620} width={960} height={250} fill={KM.yellow} opacity={.35} stroke={KM.red} strokeWidth={6} />
      <PlasterOverlay />
    </svg>
    {overlay}
  </AbsoluteFill>
);

// Skandamata: frontal, seated on a lotus, four arms (two lotuses, abhaya, the arm around baby Skanda), lion beside
export const Skandamata: React.FC<{ t: number; blink?: number }> = ({ t, blink = 0 }) => {
  const skin = KM.skin;
  return (
    <g data-kind="graphic" data-id="skandamata">
      {/* halo (prabha) of flames */}
      <M d={circ(0, -30, 190)} fill={KM.yellow} shade={KM.red} w={4} />
      {Array.from({ length: 22 }, (_, i) => { const a = i / 22 * Math.PI * 2; return <M key={i} d={`M${Math.cos(a) * 186} ${-30 + Math.sin(a) * 186} Q${Math.cos(a + .08) * 225} ${-30 + Math.sin(a + .08) * 225} ${Math.cos(a + .14) * 188} ${-30 + Math.sin(a + .14) * 188}Z`} fill={KM.red} w={2} />; })}
      {/* upper arms raised, holding lotuses */}
      <Limb pts={[[-104, 130, 54], [-190, 40, 44], [-170, -70, 34]]} skin={skin} />
      <Limb pts={[[104, 130, 54], [190, 40, 44], [170, -70, 34]]} skin={skin} />
      <KLotus x={-176} y={-130} s={1.1} /><KLotus x={176} y={-130} s={1.1} />
      {/* lotus seat */}
      {Array.from({ length: 11 }, (_, i) => { const x = -300 + i * 60; return <M key={i} d={`M${x - 34} 600 C${x - 30} 540 ${x - 10} 500 ${x} 480 C${x + 10} 500 ${x + 30} 540 ${x + 34} 600Z`} fill={i % 2 ? KM.red : KM.white} shade={KM.red} w={3} />; })}
      {/* legs folded (frontal), skirt with bands */}
      <M d="M-110 300 C-220 320 -270 400 -262 480 L262 480 C270 400 220 320 110 300Z" fill={KM.red} shade={KM.redDeep} w={4} />
      {[340, 400, 460].map((y) => <path key={y} d={`M${-260 + (y - 300) * .1} ${y + 40} C-100 ${y + 70} 100 ${y + 70} ${260 - (y - 300) * .1} ${y + 40}`} stroke={KM.yellow} strokeWidth={9} fill="none" />)}
      {[-1, 1].map((k) => <M key={k} d={`M${k * 180} 500 C${k * 220} 480 ${k * 270} 490 ${k * 280} 520 C${k * 250} 540 ${k * 210} 540 ${k * 180} 530Z`} fill={skin} shade={KM.redDeep} w={3} />)}
      {/* torso with choli and ornaments */}
      <M d="M-110 110 C-120 190 -110 260 -90 310 L90 310 C110 260 120 190 110 110 C70 90 -70 90 -110 110Z" fill={skin} shade={KM.redDeep} w={4} />
      <M d="M-106 150 C-60 136 60 136 106 150 L100 220 C60 234 -60 234 -100 220Z" fill={KM.green} shade={KM.greenDeep} w={4} />
      <Necklaces y={110} w={200} />
      <M d="M-96 290 H96 V318 H-96Z" fill={KM.yellow} w={3} />
      {/* lower right: abhaya; lower left: holding the child */}
      <Limb pts={[[-106, 140, 52], [-176, 250, 42], [-146, 200, 34]]} skin={skin} />
      <Palm x={-146} y={190} skin={skin} />
      {/* baby Skanda, six-faced (three faces seen), on the lap */}
      <g transform="translate(150 360) scale(1.25)">
        <g transform="translate(0 -34)">
          {[-1, 1].map((k) => <M key={k} d={`M${k * 20 - 14} 70 L${k * 30 - 16} 130 L${k * 30 + 14} 130 L${k * 20 + 14} 70Z`} fill={KM.skin} shade={KM.redDeep} w={2.6} />)}
          <M d="M-46 10 C-56 60 -40 84 0 84 C40 84 56 60 46 10 C30 -4 -30 -4 -46 10Z" fill={KM.skin} shade={KM.redDeep} w={3} />
          <M d="M-44 56 H44 V80 H-44Z" fill={KM.green} w={2.4} />
          <Necklaces y={6} w={70} />
        </g>
        {[-38, 0, 38].map((x, i) => <g key={i} transform={`translate(${x} ${-54 - (i === 1 ? 10 : 0)}) scale(${i === 1 ? .42 : .36})`}><FrontHead skin={KM.skin} crown="karanda" female={false} blink={blink} /></g>)}
      </g>
      <Limb pts={[[106, 140, 52], [170, 260, 42], [110, 340, 34]]} skin={skin} />
      {/* head */}
      <path d="M-26 70 V120 H26 V70Z" fill={skin} />
      <g transform="translate(0 0)"><FrontHead skin={skin} blink={blink} /></g>
    </g>
  );
};

// the lion (simha): Kerala temple lion: frontal face, bulging eyes, open jaws, ringlet mane, striding body
export const MuralLion: React.FC = () => (
  <g data-kind="graphic" data-id="lion">
    <M d="M-230 40 C-240 -30 -180 -70 -60 -70 L80 -70 C120 -70 150 -40 150 0 L150 60 C150 90 120 110 80 110 L-180 110 C-220 110 -230 80 -230 40Z" fill={KM.yellow} shade={KM.red} w={4} />
    {[-200, -130, 40, 110].map((x, i) => <g key={x}><M d={`M${x - 20} 90 L${x - 18 + (i % 2) * 12} 220 L${x + 28 + (i % 2) * 12} 220 L${x + 26} 90Z`} fill={KM.yellow} shade={KM.red} w={3} />{[0, 14, 28].map((k) => <path key={k} d={`M${x - 16 + k + (i % 2) * 12} 220 v14`} stroke={KM.black} strokeWidth={4} />)}</g>)}
    <path d="M-230 20 C-300 -10 -300 -100 -250 -120 C-240 -90 -260 -60 -236 -30" fill="none" stroke={KM.black} strokeWidth={14} strokeLinecap="round" />
    <path d="M-230 20 C-300 -10 -300 -100 -250 -120 C-240 -90 -260 -60 -236 -30" fill="none" stroke={KM.yellow} strokeWidth={8} strokeLinecap="round" />
    {/* ringlet mane */}
    {Array.from({ length: 20 }, (_, i) => { const a = i / 20 * Math.PI * 2, cx = 140 + Math.cos(a) * 118, cy = -110 + Math.sin(a) * 118; return <g key={i}><M d={circ(cx, cy, 30)} fill={i % 2 ? KM.red : KM.redDeep} w={3} /><path d={`M${cx - 12} ${cy} a12 12 0 1 1 12 12`} stroke={KM.yellow} strokeWidth={4} fill="none" /></g>; })}
    <M d={circ(140, -110, 104)} fill={KM.yellow} shade={KM.red} w={4} />
    {[-1, 1].map((k) => <g key={k}><M d={ell(140 + k * 42, -140, 30, 26)} fill={KM.white} w={4} /><circle cx={140 + k * 42} cy={-138} r={13} fill={KM.black} /><path d={`M${140 + k * 20} -176 Q${140 + k * 50} -196 ${140 + k * 78} -168`} stroke={KM.black} strokeWidth={6} fill="none" /></g>)}
    <M d="M122 -120 L158 -120 L150 -90 L130 -90Z" fill={KM.red} w={3} />
    <M d="M84 -60 C100 -84 180 -84 196 -60 C190 -20 90 -20 84 -60Z" fill={KM.redDeep} w={4} />
    <M d="M110 -50 C130 -30 150 -30 170 -50 C160 -36 120 -36 110 -50Z" fill={KM.red} w={2} />
    {[100, 180].map((x) => <M key={x} d={`M${x - 7} -66 L${x} -46 L${x + 7} -66Z`} fill={KM.white} w={2} />)}
  </g>
);

// Tarakasura: ornate and massive, filling the frame
export const Tarakasura: React.FC<{ t: number; blink?: number }> = ({ t, blink = 0 }) => (
  <g data-kind="graphic" data-id="tarakasura">
    {/* four arms: sword, shield, trident, fist */}
    <Limb pts={[[-220, 200, 90], [-360, 300, 72], [-420, 120, 58]]} skin={KM.green} />
    <M d="M-436 110 L-470 -300 L-440 -320 L-410 -300 L-404 110Z" fill={KM.white} shade={KM.black} w={4} />
    <M d="M-470 110 H-370 V140 H-470Z" fill={KM.yellow} w={3} />
    <Limb pts={[[220, 200, 90], [360, 300, 72], [420, 120, 58]]} skin={KM.green} />
    <path d="M420 480 V-260" stroke={KM.black} strokeWidth={16} /><path d="M420 480 V-260" stroke={KM.yellow} strokeWidth={9} />
    <M d="M360 -220 C360 -300 390 -330 400 -340 C396 -300 404 -270 420 -250 C436 -270 444 -300 440 -340 C450 -330 480 -300 480 -220 C460 -250 440 -250 420 -230 C400 -250 380 -250 360 -220Z" fill={KM.yellow} shade={KM.red} w={4} />
    <Limb pts={[[-240, 260, 86], [-330, 460, 66], [-250, 600, 54]]} skin={KM.green} />
    <M d={circ(-250, 620, 110)} fill={KM.red} shade={KM.redDeep} w={5} />
    {[70, 40].map((r) => <circle key={r} cx={-250} cy={620} r={r} fill="none" stroke={KM.yellow} strokeWidth={8} />)}
    <M d={circ(-250, 620, 18)} fill={KM.yellow} w={3} />
    <Limb pts={[[240, 260, 86], [330, 460, 66], [280, 600, 54]]} skin={KM.green} />
    <M d={circ(282, 620, 36)} fill={KM.green} shade={KM.greenDeep} w={4} />
    {/* torso */}
    <M d="M-260 400 C-290 220 -220 90 0 80 C220 90 290 220 260 400 L230 560 L-230 560Z" fill={KM.green} shade={KM.greenDeep} w={5} />
    {[-1, 1].map((k) => <path key={k} d={`M${k * 40} 250 C${k * 120} 270 ${k * 180} 250 ${k * 200} 210`} stroke={KM.greenDeep} strokeWidth={6} fill="none" />)}
    {/* chest ornaments: yajnopavita, necklaces, udarabandha */}
    <path d="M-170 130 C-80 300 60 420 200 540" stroke={KM.white} strokeWidth={12} fill="none" /><path d="M-170 130 C-80 300 60 420 200 540" stroke={KM.black} strokeWidth={2} fill="none" strokeDasharray="10 8" />
    <Necklaces y={100} w={420} />
    <M d="M-150 160 C-60 330 60 330 150 160 C120 260 60 300 0 304 C-60 300 -120 260 -150 160Z" fill={KM.yellow} shade={KM.red} w={4} />
    {[-80, -40, 0, 40, 80].map((x) => <M key={x} d={circ(x, 280 - Math.abs(x) * .6, 13)} fill={KM.red} w={2.4} />)}
    <M d="M-240 520 H240 V580 H-240Z" fill={KM.yellow} shade={KM.red} w={4} />
    {Array.from({ length: 12 }, (_, i) => <M key={i} d={circ(-220 + i * 40, 550, 11)} fill={i % 2 ? KM.red : KM.green} w={2} />)}
    {/* dhoti: red with gold bands and a fanned front pleat */}
    <M d="M-260 580 L-300 900 L300 900 L260 580Z" fill={KM.red} shade={KM.redDeep} w={5} />
    {[650, 730, 810].map((y) => <path key={y} d={`M${-266 - (y - 580) * .12} ${y} H${266 + (y - 580) * .12}`} stroke={KM.yellow} strokeWidth={10} />)}
    <M d="M-40 580 L-80 900 L80 900 L40 580Z" fill={KM.white} shade={KM.black} w={4} />
    {[-50, -20, 10, 40].map((x) => <path key={x} d={`M${x * .5} 590 L${x * 1.4} 900`} stroke={KM.black} strokeWidth={3} />)}
    {/* head (smaller, crown inside the frame) */}
    <g transform="translate(0 -10) scale(1.45)"><FrontHead skin={KM.green} blink={blink} female={false} smile={false} /></g>
    <M d="M-60 60 C-30 50 -8 56 0 68 C8 56 30 50 60 60 C46 74 22 78 0 74 C-22 78 -46 74 -60 60Z" fill={KM.black} w={2} />
    {[-18, 18].map((x) => <M key={x} d={`M${x - 6} 84 L${x} 108 L${x + 6} 84Z`} fill={KM.white} w={2} />)}
  </g>
);

export const KeralaPortrait: React.FC = () => {
  const t = useCurrentFrame() / 24;
  return (
    <MuralPage overlay={<TextZone id="cap" z={KSUB2}><Tx size={52} color={KM.redDeep} font={FONT.rozha}>माँ की ममता</Tx><Tx size={32} color={KM.black}>केरल भित्तिचित्र शैली में · केरल</Tx><Tx size={26} color={KM.redDeep} mt={6}>नवरात्रि · नौ देवियाँ, नौ कलाएँ · दिन ५</Tx></TextZone>}>
      <Foliage x={60} y={60} w={960} h={1520} seed={3} n={220} />
      <g transform="translate(540 640) scale(1.02)"><Skandamata t={t} /></g>
      <g transform="translate(420 1330) scale(.8)"><MuralLion /></g>
    </MuralPage>
  );
};
export const KeralaTaraka: React.FC = () => {
  const t = useCurrentFrame() / 24;
  return (
    <MuralPage overlay={<TextZone id="cap" z={KSUB2}><Tx size={40} color={KM.black}>तारकासुर को वरदान था —</Tx><Tx size={40} color={KM.black}>उसे केवल शिव का पुत्र ही हरा सकता है।</Tx></TextZone>}>
      <Foliage x={60} y={60} w={960} h={1520} seed={7} n={240} />
      <g transform="translate(540 560) scale(.95)"><Tarakasura t={t} /></g>
      {[[130, 1480], [950, 1480]].map(([x, y], i) => <g key={i} transform={`translate(${x} ${y}) scale(.5)`}><FrontHead skin={i % 2 ? KM.skin : KM.skinGreen} crown="karanda" female={false} smile={false} /></g>)}
    </MuralPage>
  );
};
export const KeralaStyle: React.FC = () => (
  <MuralPage overlay={<TextZone id="cap" z={KSUB2}><Tx size={42} color={KM.redDeep} font={FONT.rozha}>केरल भित्तिचित्र · शैली पत्र</Tx><Tx size={26} color={KM.black}>pancha-varna: red ochre, yellow ochre, green, white, black · modelled edges · lime plaster</Tx></TextZone>}>
    <rect x={60} y={60} width={960} height={1520} fill={KM.plaster} />
    {[KM.red, KM.yellow, KM.green, KM.white, KM.black].map((c, i) => <M key={i} d={`M${120 + i * 170} 120 h140 v80 h-140Z`} fill={c} w={3} />)}
    <g transform="translate(540 700) scale(2.2)"><FrontHead /></g>
    <g transform="translate(300 1300)"><KLotus x={0} y={0} s={1.6} /></g>
    <g transform="translate(760 1360) scale(.9)"><MuralLion /></g>
  </MuralPage>
);
