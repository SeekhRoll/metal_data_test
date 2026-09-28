import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { PahariDefs, RevealCtx, LineCtx } from '../styles/pahari/paint';
import { P } from '../styles/pahari/palette';
import { SJ, LaceDefs, PaperTexDefs, Powder, Stencil, BorderCuts } from '../styles/sanjhi/kit';
import { deviFor } from '../devi/pahari/devis';
import { RoundTree, Halo } from '../styles/pahari/scenery';
import { Lotus } from '../styles/pahari/figure';
import { TextZone, T as Tx } from '../shared/text';
import { FONT } from '../style/fonts';

const X = 40, Y = 40, W = 1000, H = 1540;
export const SJ_SUB = { x: 90, y: 1620, w: 900, h: 230 };

// the portrait stencil: border, Brahmacharini (walking, mala, kamandalu), two trees, lotuses
const PortraitCuts: React.FC<{ t: number }> = ({ t }) => {
  const D = deviFor(2).draw, life = { t, blink: 0, breathe: 0, sway: 0, bloom: 0 };
  return (
    <g>
      <BorderCuts x={X} y={Y} w={W} h={H} />
      <g transform="translate(560 420) scale(1.28)"><D hex="#F2EFE6" life={life} /></g>
      <RoundTree x={200} y={1400} h={520} seed={21} />
      <RoundTree x={890} y={1400} h={460} seed={22} />
      {[180, 360, 720, 900].map((x, i) => <Lotus key={i} x={x} y={1480} s={1.1} />)}
      <path d={`M${X + 70} 1440 H${X + W - 70}`} stroke="#000" strokeWidth={4} />
    </g>
  );
};

// the powder beneath: sky wash, halo glow, ground, in the season's colour
// the powder is the same drawing painted in flat colour (outlines off), so each cut part shows its own powder
const PowderGround: React.FC<{ sky: string; ground: string; halo: string }> = ({ sky, ground, halo }) => (
  <g>
    <rect x={X} y={Y} width={W} height={H} fill={sky} />
    <rect x={X} y={1380} width={W} height={H - 1340} fill={ground} />
    <g style={{ filter: 'saturate(1.7) contrast(1.15)' }}><LineCtx.Provider value={{ scale: 0, ink: P.ink, skin: P.skinLine }}><PortraitCuts t={0} /></LineCtx.Provider></g>
    {/* the season's powder colour washed over everything beneath the stencil */}
    <rect x={X} y={Y} width={W} height={H} fill={halo} opacity={.55} style={{ mixBlendMode: 'multiply' }} />
  </g>
);

const Page: React.FC<{ k: number; sky: string; ground: string; halo: string; lift?: number; caption: React.ReactNode }> = ({ k, sky, ground, halo, lift = 0, caption }) => {
  const t = useCurrentFrame() / 24;
  return (
    <AbsoluteFill style={{ background: '#2A2420' }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        <PahariDefs /><LaceDefs /><PaperTexDefs />
        <RevealCtx.Provider value={{ line: 1, fill: 1, shimmer: -1 }}>
          <Powder x={X} y={Y} w={W} h={H} k={k} id="p1"><PowderGround sky={sky} ground={ground} halo={halo} /></Powder>
          <Stencil x={X} y={Y} w={W} h={H} id="st1" lift={lift} cuts={<PortraitCuts t={t} />} />
          <rect x={40} y={1600} width={1000} height={280} fill={SJ.paper} />
          <rect x={52} y={1612} width={976} height={256} fill="none" stroke={SJ.paperShade} strokeWidth={3} />
        </RevealCtx.Provider>
      </svg>
      <TextZone id="cap" z={SJ_SUB}>{caption}</TextZone>
    </AbsoluteFill>
  );
};

export const SanjhiSift: React.FC = () => <Page k={.45} sky="#E0A040" ground="#B8742A" halo="#E8A030" lift={.5} caption={<><Tx size={40} color="#5A4A3A" font={FONT.rozha}>साँझी · चूर्ण झरते हुए</Tx><Tx size={26} color="#5A4A3A">the stencil lifts and settles as coloured powder sifts through the cuts</Tx></>} />;
export const SanjhiPortrait: React.FC = () => <Page k={1} sky="#E0A040" ground="#B8742A" halo="#E8A030" caption={<><Tx size={52} color="#8A5A2A" font={FONT.rozha}>अपर्णा</Tx><Tx size={32} color="#5A4A3A">साँझी कला शैली में · मथुरा-वृंदावन, उत्तर प्रदेश</Tx><Tx size={26} color="#8A5A2A" mt={6}>नवरात्रि · नौ देवियाँ, नौ कलाएँ · दिन २</Tx></>} />;
export const SanjhiMonsoon: React.FC = () => <Page k={1} sky="#3A6AA8" ground="#2E5A8A" halo="#5A8AD0" caption={<><Tx size={40} color="#5A4A3A" font={FONT.rozha}>ऋतुएँ बदलती हैं, स्टेंसिल वही</Tx><Tx size={26} color="#5A4A3A">same stencil, the powder beneath cycles: summer ochre → monsoon blue → winter white</Tx></>} />;
