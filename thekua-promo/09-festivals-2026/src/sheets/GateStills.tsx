import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { P, PAGE, shade } from '../styles/pahari/palette';
import { PahariPage } from '../styles/pahari/Page';
import { S, PahariDefs, RevealCtx } from '../styles/pahari/paint';
import { PahariBorder } from '../styles/pahari/Border';
import { Landscape, Petals } from '../devi/pahari/PortraitScene';
import { Shailaputri } from '../devi/pahari/Shailaputri';
import { RoundTree, Cypress, HillTemple, Pavilion, River, Diya, Halo, Hill, SnowPeaks } from '../styles/pahari/scenery';
import { Head, Trishul, Lotus } from '../styles/pahari/figure';
import { Nandi } from '../styles/pahari/animals';
import { TitleCard } from '../shared/TitleCard';
import { EndCardFull, BrandStrip } from '../shared/EndCardFull';
import { IncenseHaze } from '../shared/reverent';
import { TextZone, T } from '../shared/text';
import { FONT } from '../style/fonts';
import days from '../../data/navratri-days.json';

const D1 = days[0];
const life = (t: number) => ({ t, blink: 0, breathe: 0, sway: 0, bloom: .45 });
const portrait = (t: number, hex: string, dy = 0) => (
  <>
    <Landscape t={t} />
    <g transform={`translate(500 ${720 + dy}) scale(1.28)`}><Shailaputri garment={hex} life={life(t)} /></g>
  </>
);

// ---------------------------------------------------------------- style sheet: palette + motif library
export const StyleSheet: React.FC = () => {
  const sw = Object.entries({ border: P.border, lapis: P.lapis, hartal: P.hartal, skyTop: P.skyTop, horizon: P.horizon, hillMid: P.hillMid, hillNear: P.hillNear, canopy: P.canopy, river: P.river, skin: P.skin, gold: P.gold, white: P.white, ink: P.ink });
  return (
    <AbsoluteFill style={{ background: P.border }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        <PahariDefs shimmer={.45} />
        <RevealCtx.Provider value={{ line: 1, fill: 1, shimmer: .45 }}>
          <rect x={66} y={66} width={948} height={1470} fill={P.paper} />
          {sw.map(([k, c], i) => <g key={k}><rect x={96 + (i % 7) * 128} y={96 + Math.floor(i / 7) * 96} width={110} height={56} fill={c} stroke={P.ink} strokeWidth={1.2} /><text x={151 + (i % 7) * 128} y={172 + Math.floor(i / 7) * 96} fontFamily="Playfair Display" fontSize={15} textAnchor="middle" fill={P.ink}>{k}</text></g>)}
          <Hill x={66} w={948} base={520} amp={50} bottom={600} seed={11} fill={P.hillMid} tufts={20} />
          <RoundTree x={170} y={600} h={260} seed={21} flowers="#D9707C" />
          <Cypress x={300} y={600} h={200} seed={4} />
          <HillTemple x={440} y={600} s={.8} />
          <RoundTree x={560} y={600} h={220} seed={23} />
          <Pavilion x={830} y={600} w={300} h={250} />
          <River x={66} y={600} w={948} h={60} t={0} />
          <g transform="translate(330 1000) scale(.9)"><Nandi /></g>
          <g transform="translate(830 830) scale(2.4)"><Halo x={0} y={-8} r={70} /><Head crown crescent veil={P.pink} /></g>
          <g transform="translate(770 1250) scale(2)"><Head veil={P.saffron} tilak={P.red} /></g>
          <Trishul x={120} top={1100} bottom={1500} />
          <Lotus x={210} y={1300} s={2} stem={[210, 1500]} />
          <Diya x={500} y={1440} s={1.3} flame={1} />
        </RevealCtx.Provider>
        <PahariBorder cartouche={false} win={{ x: 66, y: 66, w: 948, h: 1470 }} />
      </svg>
      <TextZone id="caption" z={{ x: 90, y: 1580, w: 900, h: 280 }}><T size={44} color={P.hartal} font={FONT.rozha}>पहाड़ी लघुचित्र · शैली पत्र</T><T size={30} color={P.hartal}>Kangra / Guler: flat gouache, fine sepia line, gold, rounded trees, Himachali architecture</T></TextZone>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- Format C (शुभकामना), mid-shot
export const Day1C: React.FC = () => {
  const t = useCurrentFrame() / 24, hex = D1.colour.hex;
  return (
    <PahariPage border={hex} shimmer={.4}
      painting={<>{portrait(t, hex, 90)}<Diya x={880} y={1470} s={.9} flame={t} /><Petals t={t + 4} n={20} /></>}
      overlay={<>
        <TextZone id="greet" z={{ x: 110, y: 300, w: 860, h: 170 }}><T size={112} color={P.border} font={FONT.rozha}>शुभ नवरात्रि</T></TextZone>
        <TextZone id="c-lines" z={{ x: 90, y: 1592, w: 900, h: 248 }}>
          <T size={46} color={P.ink} font={FONT.rozha}>{D1.dayNameHi} · {D1.devi.nameHi}</T>
          <T size={42} color={shade(hex, -.35)} mt={6}>{D1.mantra}</T>
          <T size={24} color={P.goldDeep} mt={10}>पहाड़ी लघुचित्र शैली में · हिमाचल प्रदेश</T>
        </TextZone>
      </>} />
  );
};
// Format C last 3 s: brand strip
export const Day1CBrand: React.FC = () => {
  const t = useCurrentFrame() / 24, hex = D1.colour.hex;
  return <PahariPage border={hex} painting={<>{portrait(t, hex, 90)}<Petals t={t + 4} n={20} /></>} overlay={<BrandStrip />} />;
};

// ---------------------------------------------------------------- Format B title placard (0–4 s)
export const Day1BTitle: React.FC = () => {
  const t = useCurrentFrame() / 24, hex = D1.colour.hex;
  return (
    <PahariPage border={hex} painting={portrait(t, hex, 90)}
      overlay={<>
        <TitleCard title={D1.devi.nameHi} artLine="पहाड़ी लघुचित्र शैली में · हिमाचल प्रदेश" series={`नवरात्रि · ${D1.dayNameHi} · आज की देवी`} z={{ x: 130, y: 110, w: 820, h: 300 }} />
        <TextZone id="sub" z={{ x: 90, y: 1592, w: 900, h: 248 }}><T size={46} color={P.ink}>नवरात्रि का पहला दिन —</T><T size={46} color={P.ink}>माँ शैलपुत्री।</T></TextZone>
      </>} />
  );
};

// ---------------------------------------------------------------- Format A title (Day 1 is Pahari)
export const Day1ATitle: React.FC = () => {
  const t = useCurrentFrame() / 24;
  return (
    <PahariPage painting={<><Landscape t={t} peaks /><HillTemple x={540} y={1190} s={1.1} /></>}
      overlay={<>
        <TitleCard title={D1.story.titleHi} artLine={D1.artForm.titleLineHi} series={`नवरात्रि · नौ देवियाँ, नौ कलाएँ · दिन ${D1.dayNumHi}`} />
        <TextZone id="sub" z={{ x: 90, y: 1592, w: 900, h: 248 }}><T size={46} color={P.ink}>नवरात्रि का पहला दिन…</T><T size={46} color={P.ink}>आज की कथा, पहाड़ी लघुचित्र शैली में।</T></TextZone>
      </>} />
  );
};

// ---------------------------------------------------------------- Pitru Paksha Ep 1 title (reverential)
export const PitruEp1Title: React.FC = () => {
  const t = useCurrentFrame() / 24;
  return (
    <AbsoluteFill>
      <PahariPage reverent painting={<><Landscape t={t} peaks /><HillTemple x={540} y={1190} s={1.1} /></>}
        overlay={<>
          <TitleCard title="भगीरथ प्रयास" artLine="पहाड़ी लघुचित्र शैली में · हिमाचल प्रदेश" series="पितृ पक्ष विशेष" accent={P.borderDeep} />
          <TextZone id="sub" z={{ x: 90, y: 1592, w: 900, h: 248 }}><T size={44} color={P.ink}>पितृ पक्ष में, एक कथा —</T><T size={44} color={P.ink}>पहाड़ी लघुचित्र शैली में।</T></TextZone>
        </>} />
      <IncenseHaze t={t} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- Pitru closing sign-off: one Pahari brass diya in near-dark
export const PitruClosing: React.FC = () => {
  const t = useCurrentFrame() / 24;
  return (
    <AbsoluteFill>
      <PahariPage reverent windowFill="#1E140E" cartouche
        painting={<><rect x={0} y={0} width={1080} height={1920} fill="#1E140E" /><Diya x={540} y={900} s={2.6} flame={t} glow={1.2} /></>}
        overlay={<TextZone id="closing" z={{ x: 90, y: 1592, w: 900, h: 248 }}><T size={62} color={P.ink} font={FONT.rozha}>पितरों को नमन।</T><T size={40} color={P.ink} mt={10}><span style={{ fontFamily: FONT.serif, fontWeight: 700 }}>Shri Desi Thekua</span> की ओर से</T></TextZone>} />
      <IncenseHaze t={t} a={.6} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- full end card (A and B)
export const EndCard: React.FC = () => (
  <PahariPage cartouche={false} windowFill={P.paper} overlay={<EndCardFull />} border={P.border} win={{ x: 66, y: 66, w: 948, h: 1788 }}
    painting={<>
      {[[96, 96], [984, 96], [984, 1824], [96, 1824]].map(([x, y], i) => <g key={i} transform={`translate(${x} ${y}) rotate(${i * 90})`}><path d="M0 0 Q40 6 60 40 M0 0 Q6 40 40 60" stroke={P.green} strokeWidth={2} fill="none" /><circle cx={34} cy={34} r={8} fill={P.pink} stroke={P.ink} strokeWidth={1} /></g>)}
    </>} />
);
