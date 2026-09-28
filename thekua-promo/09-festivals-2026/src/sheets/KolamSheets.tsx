import React from 'react';
import { AbsoluteFill } from 'remotion';
import { sikku, K, KolamDefs, Floor, Flour, Powder, Dots, gridDots, loopKolam, petalKolam, sunKolam, circleD, KolamDevi, Ring } from '../styles/kolam/kit';
import { TextZone, T as Tx } from '../shared/text';
import { FONT } from '../style/fonts';

export const KSUB = { x: 90, y: 1640, w: 900, h: 220 };
const Page: React.FC<{ children: React.ReactNode; caption: React.ReactNode }> = ({ children, caption }) => (
  <AbsoluteFill style={{ background: K.floorDeep }}>
    <svg viewBox="0 0 1080 1920" width={1080} height={1920}><KolamDefs /><Floor />{children}
      <rect x={60} y={1610} width={960} height={270} fill={K.floorDeep} opacity={.6} />
      <Flour d="M70 1600 H1010" w={3} /></svg>
    <TextZone id="cap" z={KSUB}>{caption}</TextZone>
  </AbsoluteFill>
);
const g = { cx: 540, cy: 760, n: 9, s: 70 };
const KG = sikku(6, 7, 540, 760, 72);

export const KolamGrid: React.FC = () => (
  <Page caption={<><Tx size={42} color={K.flour} font={FONT.rozha}>कोलम · बिंदु, फिर एक रेखा</Tx><Tx size={26} color={K.flour}>the dots come first; one line winds around them without lifting</Tx></>}>
    <Dots pts={KG.dots} />
    <Flour d={KG.d} p={.45} w={5} />
  </Page>
);

export const KolamCosmos: React.FC = () => (
  <Page caption={<><Tx size={42} color={K.flour} font={FONT.rozha}>ब्रह्मांडीय अंड</Tx><Tx size={26} color={K.flour}>the cosmic egg grows into sun, stars, hills and rivers; blue and saffron powder fill</Tx></>}>
    <Powder d={KG.d} col={K.blue} a={.7} />
    <Dots pts={KG.dots} />
    <Flour d={KG.d} w={5} />
    <Powder d={circleD(540, 760, 70)} col={K.saffron} />
    <Flour d={sunKolam(540, 760, 70, 14)} w={4} />
    {[[180, 230], [880, 260], [300, 1300], [820, 1250], [150, 900], [930, 880]].map(([x, y], i) => <Flour key={i} d={petalKolam(x, y, 40, 5, .25)} w={3.4} />)}
    <Flour d="M80 1450 C220 1340 330 1340 460 1450 C580 1340 700 1330 830 1450 C900 1400 960 1400 1000 1450" w={5} />
    <Flour d="M80 1520 C200 1500 300 1540 420 1515 C540 1490 660 1540 780 1515 C880 1495 950 1510 1000 1520" w={4} />
  </Page>
);

export const KolamDeviSheet: React.FC = () => (
  <Page caption={<><Tx size={52} color={K.flour} font={FONT.rozha}>एक मुस्कान</Tx><Tx size={32} color={K.flour}>कोलम कला शैली में · तमिलनाडु</Tx><Tx size={26} color="#F2C06A" mt={6}>नवरात्रि · नौ देवियाँ, नौ कलाएँ · दिन ४</Tx></>}>
    <Powder d={circleD(540, 720, 430)} col={K.saffron} a={.35} />
    <Flour d={sunKolam(540, 720, 400, 28)} w={4} />
    <Ring cx={540} cy={720} r={420} n={40} />
    <g><KolamDevi cx={540} cy={560} s={.72} /></g>
    <Powder d={circleD(540, 720, 120)} col={K.blue} a={0} />
  </Page>
);
