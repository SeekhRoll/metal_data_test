import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { TJ, TjDefs, P, Foil, Gem, gemRow, TFace, Prabhavali, TjFrame, Swag, Lotus } from '../styles/tanjore/kit';
import { Siddhidatri, Ardhanari } from '../styles/tanjore/figures';
import { TextZone, T as Tx } from '../shared/text';
import { FONT } from '../style/fonts';

export const TSUB = { x: 90, y: 1640, w: 900, h: 220 };
export const TanjorePage: React.FC<{ t: number; ground?: string; children: React.ReactNode; overlay?: React.ReactNode; az?: number }> = ({ t, ground = TJ.red, children, overlay, az }) => (
  <AbsoluteFill style={{ background: TJ.redDeep }}>
    <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
      <TjDefs az={az ?? 200 + ((t * 18) % 160)} />
      <rect width={1080} height={1920} fill={TJ.redDeep} />
      <clipPath id="tjwin"><rect x={64} y={64} width={952} height={1492} /></clipPath>
      <g clipPath="url(#tjwin)"><rect x={64} y={64} width={952} height={1492} fill={ground} />{children}</g>
      <TjFrame t={t} />
      <rect x={70} y={1626} width={940} height={250} fill={TJ.white} stroke={TJ.gold} strokeWidth={5} />
      <rect width={1080} height={1920} filter="url(#tjCloth)" opacity={.2} style={{ mixBlendMode: 'multiply' }} />
    </svg>
    {overlay}
  </AbsoluteFill>
);

export const TanjoreStyle: React.FC = () => {
  const t = useCurrentFrame() / 24;
  return <TanjorePage t={t} overlay={<TextZone id="cap" z={TSUB}><Tx size={42} color={TJ.redDeep} font={FONT.rozha}>तंजावुर चित्रकला · शैली पत्र</Tx><Tx size={26} color={TJ.line}>vivid red, green, blue · raised gold-foil relief · inlaid glass gems · round frontal faces</Tx></TextZone>}>
    {[TJ.red, TJ.green, TJ.blue, TJ.white].map((c, i) => <P key={i} d={`M${110 + i * 220} 110 h170 v80 h-170Z`} fill={c} />)}
    <Foil d="M110 220 h830 v60 h-830Z" beads={Array.from({ length: 21 }, (_, i) => [130 + i * 40, 250] as [number, number])} r={7} />
    {gemRow([[200, 340], [320, 340], [440, 340], [560, 340], [680, 340], [800, 340]], t, 18)}
    <g transform="translate(540 900) scale(1.5)"><TFace t={t} /></g>
    <g transform="translate(540 1540) scale(.42)"><Prabhavali cx={0} base={0} w={700} h={800} t={t} /></g>
  </TanjorePage>;
};
export const TanjorePortrait: React.FC = () => {
  const t = useCurrentFrame() / 24;
  return <TanjorePage t={t} overlay={<TextZone id="cap" z={TSUB}><Tx size={52} color={TJ.redDeep} font={FONT.rozha}>अर्धनारीश्वर</Tx><Tx size={32} color={TJ.line}>तंजावुर चित्रकला शैली में · तमिलनाडु</Tx><Tx size={26} color={TJ.redDeep} mt={6}>नवरात्रि · नौ देवियाँ, नौ कलाएँ · दिन ९</Tx></TextZone>}>
    <rect x={64} y={64} width={952} height={1492} fill={TJ.green} />
    <Swag />
    <Prabhavali cx={540} base={1420} w={860} h={1260} t={t} />
    <Lotus x={540} y={1460} w={720} />
    <g transform="translate(540 1420) scale(1.28)"><Siddhidatri t={t} /></g>
  </TanjorePage>;
};
export const TanjoreArdhanari: React.FC = () => {
  const t = useCurrentFrame() / 24;
  return <TanjorePage t={t} ground={TJ.blue} overlay={<TextZone id="cap" z={TSUB}><Tx size={40} color={TJ.line}>तब शिव का आधा शरीर देवी का हो गया —</Tx><Tx size={40} color={TJ.line}>आधा शिव… आधी शक्ति।</Tx></TextZone>}>
    <Swag />
    <Prabhavali cx={540} base={1500} w={760} h={1300} t={t} />
    <g transform="translate(540 1490) scale(1.1)"><Ardhanari t={t} /></g>
  </TanjorePage>;
};
