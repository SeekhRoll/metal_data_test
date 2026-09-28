import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { PahariDefs, RevealCtx } from '../styles/pahari/paint';
import { Fillers, Sun, M, Manj, Lahariya, Triangles, Belpatra, Compartment, Phalgu, Akshayavat, MHead, MFigure, MCow, GlowHands, Pindas, MDiya } from '../styles/manjusha/kit';
import { TextZone, T as Tx } from '../shared/text';
import { FONT } from '../style/fonts';
import { REVERENT_FILTER, IncenseHaze } from '../shared/reverent';

// Manjusha page: the whole frame is one box; a smaller box at the foot carries the text
export const MSUB = { x: 90, y: 1650, w: 900, h: 190 };
export const ManjPage: React.FC<{ t?: number; open?: number; children?: React.ReactNode; overlay?: React.ReactNode; reverent?: boolean }> = ({ t = 0, open = 1, children, overlay, reverent = true }) => (
  <AbsoluteFill style={{ background: M.ground }}>
    <AbsoluteFill style={{ filter: reverent ? REVERENT_FILTER : undefined }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        <PahariDefs />
        <RevealCtx.Provider value={{ line: 1, fill: 1, shimmer: -1 }}>
          <rect width={1080} height={1920} fill={M.ground} />
          <Compartment x={20} y={20} w={1040} h={1600} open={open} flow={t * .8} id="main">{children}</Compartment>
          <rect x={MSUB.x - 50} y={MSUB.y - 16} width={MSUB.w + 100} height={MSUB.h + 60} fill={M.yellow} stroke={M.black} strokeWidth={4} />
          <Triangles x={MSUB.x - 50} y={MSUB.y - 16} w={MSUB.w + 100} h={20} />
          <rect x={MSUB.x - 30} y={MSUB.y + 10} width={MSUB.w + 60} height={MSUB.h + 10} fill={M.ground} stroke={M.black} strokeWidth={3} />
          <rect width={1080} height={1920} filter="url(#paperGrain)" opacity={.12} style={{ mixBlendMode: 'multiply' }} />
        </RevealCtx.Provider>
      </svg>
    </AbsoluteFill>
    {reverent && <IncenseHaze t={t} a={.35} />}
    {overlay}
  </AbsoluteFill>
);

export const ManjStyle: React.FC = () => (
  <ManjPage reverent={false} overlay={<TextZone id="cap" z={MSUB}><Tx size={42} color={M.pink} font={FONT.rozha}>मंजूषा कला · शैली पत्र</Tx><Tx size={26} color={M.black}>pink · green · yellow, bold black line · lahariya, dantar, belpatra borders</Tx></TextZone>}>
    {[M.pink, M.green, M.yellow, M.black, M.ground].map((c, i) => <rect key={i} x={110 + i * 150} y={110} width={120} height={60} fill={c} stroke={M.black} strokeWidth={3} />)}
    <Lahariya x={100} y={210} w={880} h={40} flow={0} />
    <Triangles x={100} y={270} w={880} h={34} />
    <Belpatra x={100} y={324} w={880} h={40} />
    <Akshayavat x={300} y={900} s={.7} />
    <g transform="translate(720 760) scale(.95)"><MCow /></g>
    <Manj>
      <g transform="translate(160 1080) scale(1.6)"><MHead skin={M.green} crown="mukut" /></g>
      <g transform="translate(420 1080) scale(1.6)"><MHead skin={M.yellow} crown="mukut" /></g>
      <g transform="translate(680 1080) scale(1.6)"><MHead skin={M.yellow} crown="sita" /></g>
    </Manj>
    <MDiya x={880} y={1080} s={.9} />
    <g transform="translate(0 1260)"><Phalgu x={72} y={0} w={936} h={140} flow={0} sand={.45} /></g>
    <Pindas n={5} x={440} y={1450} />
  </ManjPage>
);

export const ManjArrival: React.FC = () => {
  const t = useCurrentFrame() / 24;
  return (
    <ManjPage t={t} overlay={<>
      <div data-kind="surface" style={{ position: 'absolute', left: 150, top: 110, width: 780, height: 280, background: M.yellow, border: `4px solid ${M.black}`, boxShadow: `inset 0 0 0 10px ${M.yellow}, inset 0 0 0 14px ${M.pink}` }} />
      <TextZone id="title" z={{ x: 170, y: 126, w: 740, h: 248 }}><Tx size={88} color={M.pink} font={FONT.rozha}>फल्गु के तट पर</Tx><Tx size={36} color={M.black} mt={4}>मंजूषा कला शैली में · भागलपुर, बिहार</Tx><Tx size={30} color={M.green} mt={8}>पितृ पक्ष विशेष</Tx></TextZone>
      <TextZone id="sub" z={MSUB}><Tx size={42} color={M.black}>कहते हैं, वनवास के समय, श्रीराम,</Tx><Tx size={42} color={M.black}>लक्ष्मण और सीता…</Tx></TextZone>
    </>}>
      <Sun x={880} y={520} r={50} rot={t * 6} />
      <Fillers x={80} y={420} w={920} h={440} n={22} seed={5} avoid={[{ x: 780, y: 440, w: 200, h: 170 }]} />
      <Akshayavat x={760} y={1300} s={.72} shimmer={t} />
      <g transform="translate(200 890) scale(.95)"><MFigure skin={M.green} garb={[M.yellow, M.yellow]} crown="mukut" pose="walk" /></g>
      <g transform="translate(330 900) scale(.9)"><MFigure skin={M.yellow} garb={[M.pink, M.green]} crown="sita" pose="walk" female /></g>
      <g transform="translate(470 890) scale(.92)"><MFigure skin={M.yellow} garb={[M.green, M.pink]} crown="mukut" pose="walk" /></g>
      <Phalgu x={72} y={1310} w={936} h={260} flow={t * .8} />
    </ManjPage>
  );
};

export const ManjPinda: React.FC = () => {
  const t = useCurrentFrame() / 24;
  return (
    <ManjPage t={t} overlay={<TextZone id="sub" z={MSUB}><Tx size={42} color={M.black}>सीता ने फल्गु की बालू से ही पिंड बनाए,</Tx><Tx size={42} color={M.black}>और अर्पित कर दिए।</Tx></TextZone>}>
      <Sun x={560} y={200} r={46} rot={t * 6} />
      <Fillers x={80} y={100} w={920} h={340} n={20} seed={8} avoid={[{ x: 480, y: 130, w: 160, h: 140 }]} />
      <Akshayavat x={780} y={1000} s={.62} shimmer={t} />
      <g transform="translate(260 760) scale(.8)"><MCow /></g>
      <g transform="translate(270 950) scale(1.05)"><MFigure skin={M.yellow} garb={[M.pink, M.green]} crown="sita" pose="kneel" female /></g>
      <Pindas n={5} x={420} y={1170} />
      <g transform="translate(560 1240)"><GlowHands a={1} /></g>
      <Phalgu x={72} y={1250} w={936} h={320} flow={t * .8} sand={.45} />
    </ManjPage>
  );
};
