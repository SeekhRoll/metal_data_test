import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { BP, PatDefs, F, FloralBand, ScrollRails, PaperOverlay, Scatter, PatFace, Flower } from '../styles/bengalpat/kit';
import { Katyayani, PatLion, Mahisha, Buffalo, Sage, Hut, Tree, PatLotus } from '../styles/bengalpat/figures';
import { TextZone, T as Tx } from '../shared/text';
import { FONT } from '../style/fonts';

export const BSUB = { x: 90, y: 1630, w: 900, h: 220 };
// the Patua scroll seen through the frame: `scroll` is the scroll content, already positioned; rails and text panel stay put
export const ScrollPage: React.FC<{ children: React.ReactNode; overlay?: React.ReactNode }> = ({ children, overlay }) => (
  <AbsoluteFill style={{ background: BP.redDeep }}>
    <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
      <PatDefs />
      <clipPath id="swin"><rect x={60} y={0} width={960} height={1590} /></clipPath>
      <g clipPath="url(#swin)"><rect x={60} y={0} width={960} height={1590} fill={BP.ground} /><g filter="url(#patWobble)">{children}</g></g>
      <ScrollRails h={1600} />
      <rect x={0} y={1590} width={1080} height={330} fill={BP.redDeep} />
      <rect x={70} y={1612} width={940} height={260} fill={BP.paper} stroke={BP.black} strokeWidth={4} />
      <rect x={82} y={1624} width={916} height={236} fill="none" stroke={BP.red} strokeWidth={3} />
      <PaperOverlay />
    </svg>
    {overlay}
  </AbsoluteFill>
);
// a scroll panel: coloured ground between two floral bands
export const Panel: React.FC<{ y: number; h: number; ground?: string; children?: React.ReactNode }> = ({ y, h, ground = BP.ground, children }) => (
  <g><rect x={60} y={y} width={960} height={h} fill={ground} />{children}<FloralBand y={y + h} /></g>
);

export const BengalStyle: React.FC = () => (
  <ScrollPage overlay={<TextZone id="cap" z={BSUB}><Tx size={42} color={BP.redDeep} font={FONT.rozha}>बंगाल पटचित्र · शैली पत्र</Tx><Tx size={26} color={BP.black}>Patua scroll · flat yellow, red, indigo, black · bold outline · fish eyes · floral bands</Tx></TextZone>}>
    <Panel y={0} h={330} ground={BP.paper}>{[BP.yellow, BP.red, BP.indigo, BP.black, BP.green, BP.white, BP.orange, BP.pink].map((c, i) => <F key={i} d={`M${110 + (i % 4) * 220} ${80 + Math.floor(i / 4) * 120} h170 v80 h-170Z`} fill={c} />)}</Panel>
    <Panel y={400} h={820}><g transform="translate(540 820) scale(1.5)"><PatFace crown="shola" third /></g></Panel>
    <Panel y={1290} h={400} ground={BP.red}><g transform="translate(300 1590) scale(.8)"><PatLotus x={0} y={-200} s={1.6} /></g><g transform="translate(700 1560) scale(.55)"><PatLion /></g></Panel>
  </ScrollPage>
);

export const BengalPortrait: React.FC = () => {
  const t = useCurrentFrame() / 24;
  return (
    <ScrollPage overlay={<TextZone id="cap" z={BSUB}><Tx size={52} color={BP.redDeep} font={FONT.rozha}>अन्याय का अंत</Tx><Tx size={32} color={BP.black}>बंगाल पटचित्र शैली में · पश्चिम बंगाल</Tx><Tx size={26} color={BP.redDeep} mt={6}>नवरात्रि · नौ देवियाँ, नौ कलाएँ · दिन ६</Tx></TextZone>}>
      <FloralBand y={-30} />
      <Panel y={40} h={1480} ground={BP.ground}>
        <Scatter x={80} y={80} w={920} h={300} n={14} seed={4} />
        <g transform="translate(500 1440) scale(1.25)"><PatLion /></g>
        <g transform="translate(420 1110) scale(1.3)"><Katyayani t={t} /></g>
      </Panel>
    </ScrollPage>
  );
};

export const BengalScroll: React.FC = () => (
  <ScrollPage overlay={<TextZone id="cap" z={BSUB}><Tx size={40} color={BP.black}>महिषासुर का आतंक बढ़ता जा रहा था।</Tx></TextZone>}>
    <Panel y={-200} h={900} ground={BP.ground}>
      <g transform="translate(760 640) scale(.8)"><Buffalo /></g>
      <g transform="translate(400 660) scale(.8)"><Mahisha stomp={.5} /></g>
      {[[860, 180], [940, 300]].map(([x, y], i) => <g key={i} transform={`translate(${x} ${y}) scale(.3)`}><PatFace skin={BP.pink} female={false} crown="jata" /></g>)}
    </Panel>
    <Panel y={770} h={900} ground={BP.blue}>
      <g transform="translate(230 1420)"><Tree s={1.3} /></g>
      <g transform="translate(830 1300)"><Hut /></g>
      <g transform="translate(540 1560) scale(1.05)"><Sage /></g>
    </Panel>
  </ScrollPage>
);
