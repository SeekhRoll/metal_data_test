import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { T } from '../styles/patta/palette';
import { PahariDefs, RevealCtx, S } from '../styles/pahari/paint';
import { PattaBorder, bandsWidth, PattaTree, Deula, PattaHead, Veena, Dots } from '../styles/patta/kit';
import { Indrasen, Queen, Narada, Father, Vimana, PattaDiya, Patta } from '../characters/ep2/cast';
import { TextZone, T as Tx } from '../shared/text';
import { FONT } from '../style/fonts';
import { REVERENT_FILTER, IncenseHaze } from '../shared/reverent';

const B = bandsWidth, IN = { x: B, y: B, w: 1080 - 2 * B, h: 1920 - 2 * B };
export const SUB = { x: B + 30, y: 1620, w: 1080 - 2 * B - 60, h: 200 };

// one Pattachitra page: cloth ground, multi-band border, a yellow text panel at the foot
export const PattaPage: React.FC<{ ground?: string; k?: number; children?: React.ReactNode; overlay?: React.ReactNode; reverent?: boolean; t?: number }> = ({ ground = T.red, k = 6, children, overlay, reverent = true, t = 0 }) => (
  <AbsoluteFill style={{ background: T.black }}>
    <AbsoluteFill style={{ filter: reverent ? REVERENT_FILTER : undefined }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        <PahariDefs shimmer={-1} />
        <RevealCtx.Provider value={{ line: 1, fill: 1, shimmer: -1 }}>
          <rect x={0} y={0} width={1080} height={1920} fill={ground} />
          <clipPath id="pwin"><rect {...{ x: IN.x, y: IN.y, width: IN.w, height: IN.h }} /></clipPath>
          <g clipPath="url(#pwin)">{children}</g>
          {/* cloth texture */}
          <rect x={0} y={0} width={1080} height={1920} filter="url(#paperGrain)" opacity={.18} style={{ mixBlendMode: 'multiply' }} />
          <rect x={SUB.x} y={SUB.y} width={SUB.w} height={SUB.h} fill={T.yellow} stroke={T.black} strokeWidth={3} />
          <rect x={SUB.x + 8} y={SUB.y + 8} width={SUB.w - 16} height={SUB.h - 16} fill="none" stroke={T.red} strokeWidth={2} />
          <PattaBorder x={0} y={0} w={1080} h={1920} k={k} />
        </RevealCtx.Provider>
      </svg>
    </AbsoluteFill>
    {reverent && <IncenseHaze t={t} a={.3} />}
    {overlay}
  </AbsoluteFill>
);

const Title: React.FC = () => (
  <>
    <div data-kind="surface" style={{ position: 'absolute', left: 150, top: 140, width: 780, height: 300, background: T.yellow, border: `3px solid ${T.black}`, boxShadow: `inset 0 0 0 8px ${T.yellow}, inset 0 0 0 11px ${T.red}` }} />
    <TextZone id="title" z={{ x: 170, y: 156, w: 740, h: 268 }}>
      <Tx size={92} color={T.redDeep} font={FONT.rozha}>इंदिरा एकादशी</Tx>
      <Tx size={38} color={T.black} mt={6}>पट्टचित्र शैली में · ओडिशा</Tx>
      <Tx size={32} color={T.redDeep} mt={10}>पितृ पक्ष विशेष</Tx>
    </TextZone>
  </>
);

export const PattaStyle: React.FC = () => {
  const sw = Object.entries({ red: T.red, yellow: T.yellow, ochre: T.ochre, white: T.white, black: T.black, green: T.green, blue: T.blue, teal: T.teal, pink: T.pink, skin: T.skin, dim: T.dim, gold: T.gold });
  return (
    <PattaPage reverent={false} overlay={<TextZone id="cap" z={SUB}><Tx size={40} color={T.redDeep} font={FONT.rozha}>पट्टचित्र · शैली पत्र</Tx><Tx size={26} color={T.black}>hingula red, haritala yellow, conch white, lamp black · bold line, white-dot ornament</Tx></TextZone>}>
      {sw.map(([k, c], i) => <g key={k}><rect x={130 + (i % 6) * 140} y={130 + Math.floor(i / 6) * 90} width={120} height={50} fill={c} stroke={T.black} strokeWidth={2} /><text x={190 + (i % 6) * 140} y={200 + Math.floor(i / 6) * 90} textAnchor="middle" fontFamily="Playfair Display" fontSize={16} fill={T.white}>{k}</text></g>)}
      <PattaTree x={230} y={760} h={380} seed={3} bird />
      <Deula x={540} y={760} s={1.3} />
      <PattaTree x={850} y={760} h={360} seed={8} flower={T.white} />
      <rect x={IN.x} y={760} width={IN.w} height={10} fill={T.black} />
      <Patta>
        <g transform="translate(230 1030) scale(2.2)"><PattaHead crown="mukuta" /></g>
        <g transform="translate(530 1030) scale(2.2)"><PattaHead crown="queen" /></g>
        <g transform="translate(830 1040) scale(2.2)"><PattaHead crown="sage" beard={T.white} /></g>
        <Veena x={540} y={1340} rot={0} s={1.3} />
      </Patta>
      <PattaDiya x={540} y={1520} s={1.4} />
    </PattaPage>
  );
};

export const PattaCourt: React.FC = () => {
  const t = useCurrentFrame() / 24;
  return (
    <PattaPage t={t} overlay={<><Title /><TextZone id="sub" z={SUB}><Tx size={44} color={T.black}>माहिष्मती के राजा इंद्रसेन,</Tx><Tx size={44} color={T.black}>धर्मात्मा और प्रजा-प्रिय थे।</Tx></TextZone></>}>
      {/* canopy and pillars of the court */}
      <S d="M100 520 H980 V560 H100Z" fill={T.yellow} sw={2} />
      <Dots pts={[[110, 540], [970, 540]]} step={10} r={2.4} c={T.red} />
      {Array.from({ length: 22 }, (_, i) => <S key={i} d={`M${110 + i * 40} 560 q20 30 40 0`} fill={T.ochre} sw={1.4} />)}
      {[140, 940].map((x) => <g key={x}><S d={`M${x - 14} 560 V1520 H${x + 14} V560Z`} fill={T.ochre} sw={2} /><Dots pts={[[x, 580], [x, 1500]]} step={16} r={2.4} c={T.white} /></g>)}
      <rect x={IN.x} y={1520} width={IN.w} height={100} fill={T.greenDeep} />
      <Dots pts={[[IN.x, 1530], [IN.x + IN.w, 1530]]} step={12} r={2} c={T.white} />
      <g transform="translate(330 900) scale(1.3)"><Indrasen /></g>
      <g transform="translate(800 670) scale(-1.28 1.28)"><Narada /></g>
    </PattaPage>
  );
};

export const PattaRealms: React.FC = () => {
  const t = useCurrentFrame() / 24;
  return (
    <PattaPage t={t} ground={T.redDeep} overlay={<TextZone id="sub" z={SUB}><Tx size={42} color={T.black}>उसी क्षण, उनके पिता को मुक्ति मिली,</Tx><Tx size={42} color={T.black}>और वे दिव्य विमान में, वैकुंठ की ओर चले गए।</Tx></TextZone>}>
      {/* Vaikuntha: radiant golden panel opening above */}
      <g>
        <rect x={140} y={150} width={800} height={600} fill={T.gold} stroke={T.black} strokeWidth={4} />
        {Array.from({ length: 36 }, (_, i) => { const a = i / 36 * Math.PI * 2; return <path key={i} d={`M540 450 L${540 + Math.cos(a) * 520} ${450 + Math.sin(a) * 520}`} stroke={T.goldHi} strokeWidth={6} opacity={.7} />; })}
        <rect x={140} y={150} width={800} height={600} fill="none" stroke={T.red} strokeWidth={10} />
        <Dots pts={[[150, 160], [930, 160], [930, 740], [150, 740], [150, 160]]} step={14} r={2.4} c={T.white} />
        {[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={200 + i * 136} cy={210} r={16} fill={T.pink} stroke={T.black} strokeWidth={2} />)}
        <g transform="translate(540 520) scale(1.05)"><Vimana t={t} /></g>
        <g transform="translate(528 440) scale(.55)"><Father /></g>
      </g>
      {/* the dim realm: cooler panel inside the same border system */}
      <g>
        <rect x={140} y={820} width={800} height={720} fill={T.dim} stroke={T.black} strokeWidth={4} />
        <rect x={140} y={820} width={800} height={720} fill="none" stroke={T.dimLite} strokeWidth={10} />
        <Dots pts={[[150, 830], [930, 830], [930, 1530], [150, 1530], [150, 830]]} step={14} r={2} c="#9AA6B8" />
        <g opacity={.55}><PattaTree x={250} y={1500} h={300} seed={12} flower={T.dimLite} /><PattaTree x={830} y={1500} h={280} seed={13} flower={T.dimLite} /></g>
        <g transform="translate(500 1110) scale(.95)" opacity={.85}><Father /></g>
      </g>
    </PattaPage>
  );
};
