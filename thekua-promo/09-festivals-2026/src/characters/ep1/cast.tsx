import React from 'react';
import { P } from '../../styles/pahari/palette';
import { S, Gold } from '../../styles/pahari/paint';
import { MaleBody, MaleHead, Arm, Padmasana, limb } from '../../styles/pahari/body';
import { Head, Lotus } from '../../styles/pahari/figure';
import { Horse, Makara, Chariot } from '../../styles/pahari/animals';
import { Halo } from '../../styles/pahari/scenery';

// Episode 1 · भगीरथ प्रयास: every figure faces right, feet at y ≈ 660 (standing), units as in body.tsx.
export type Life = { t?: number; blink?: number; breathe?: number };

export const Sagar: React.FC<Life & { arms?: 'offer' | 'down' | 'point' | 'namaskar' }> = ({ blink = 0, breathe = 0, arms = 'offer' }) => (
  <MaleBody arms={arms} legs="stand" breathe={breathe} garb={{ dhoti: '#E8B84A', sash: P.red, uttariya: '#7A3A6A', dhotiLen: 620, border: P.red, garland: true, hair: '#6E6A64' }} head={<MaleHead kind="king" age={.8} blink={blink} />} />
);

// one design, instanced as the crowd of sons; `kudal` = digging with a spade
export const Son: React.FC<Life & { pose?: 'dig' | 'point' | 'down'; turban?: string; dhoti?: string }> = ({ blink = 0, pose = 'dig', turban = P.saffron, dhoti = '#EFE4C8' }) => (
  <MaleBody arms={pose} legs={pose === 'dig' ? 'dig' : 'stand'} garb={{ dhoti, sash: '#6E8B3D', uttariya: '#E3C88C', dhotiLen: 520, border: '#6E8B3D', hair: null }} head={<MaleHead kind="youth" crownCol={turban} blink={blink} tilak={undefined} />}
    nearProp={pose === 'dig' ? <g><S d="M92 196 L150 520" stroke={P.wood} sw={6} /><S d="M136 512 L176 520 L168 560 L128 548Z" fill="#8A8C8E" sw={1.2} /></g> : undefined} />
);

export const Anshuman: React.FC<Life> = ({ blink = 0 }) => (
  <MaleBody arms="namaskar" legs="stand" garb={{ dhoti: '#D9707C', sash: '#2F6E9A', uttariya: '#7FA35A', dhotiLen: 620, garland: true }} head={<MaleHead kind="prince" blink={blink} crownCol={P.green} />} />
);
export const Dilip: React.FC<Life> = ({ blink = 0 }) => (
  <MaleBody arms="namaskar" legs="stand" garb={{ dhoti: '#5F8FC0', sash: '#8A3A6A', uttariya: '#E8B84A', dhotiLen: 620, garland: true }} head={<MaleHead kind="king" age={.6} blink={blink} crownCol={P.blue} />} />
);
export type BhagirathaPose = 'namaskar' | 'tapas' | 'point' | 'reins' | 'down';
export const Bhagiratha: React.FC<Life & { pose?: BhagirathaPose }> = ({ blink = 0, breathe = 0, pose = 'namaskar' }) => (
  <MaleBody arms={pose === 'tapas' ? 'urdhva' : pose} legs={pose === 'tapas' ? 'onefoot' : 'stand'} breathe={breathe}
    garb={{ dhoti: pose === 'tapas' ? '#E7C79A' : '#F2C94C', sash: P.saffron, uttariya: pose === 'tapas' ? '#C9A36A' : P.red, dhotiLen: pose === 'tapas' ? 520 : 620, border: pose === 'tapas' ? '#9A7A4A' : P.red, garland: pose !== 'tapas', hair: pose === 'tapas' ? '#3A2A20' : undefined }}
    head={<MaleHead kind={pose === 'tapas' ? 'sage' : 'king'} beard={pose === 'tapas' ? '#3A2A20' : undefined} blink={blink} crownCol={P.saffron} />} />
);

// Indra appears only as a shadow leading the horse away (brief: shadow only)
export const IndraShadow: React.FC<{ a?: number }> = ({ a = 1 }) => (
  <g filter="url(#silhouette)" opacity={a} data-id="indra-shadow">
    <MaleBody arms={{ near: { sh: [4, 108], el: [60, 170], wr: [120, 200], hand: 'fist' }, far: { sh: [-10, 108], el: [-10, 200], wr: [0, 276] } }} legs="stride" garb={{ dhoti: '#888', sash: '#888', uttariya: '#888' }} head={<MaleHead kind="king" />} />
  </g>
);

export const SacrificialHorse: React.FC<{ step?: number; tail?: number; blink?: number }> = (p) => <Horse {...p} saddle={P.red} plate plume />;

// seated in meditation; `open` 0..1 opens the eyes (scene 4)
export const Kapila: React.FC<{ open?: number; breathe?: number }> = ({ open = 0, breathe = 0 }) => (
  <g data-id="kapila">
    <S d="M-110 330 C-60 300 120 300 160 330 C120 348 -60 350 -110 330Z" fill="#B48A5A" sw={1.2} />
    {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={-80 + i * 22} cy={326 + (i % 2) * 4} r={3} fill="#6E4E2E" />)}
    <Arm sh={[-10, 108]} el={[-6, 214]} wr={[40, 276]} skin={P.skin} bangles={false} armlet={false} />
    <g transform={`translate(0 ${breathe * .6})`}>
      <S d="M-6 86 C-28 94 -40 110 -40 132 C-40 180 -36 230 -34 266 L34 266 C38 240 44 200 44 160 C44 130 36 104 22 88Z" fill={P.skin} stroke={P.skinLine} sw={1.4} />
    </g>
    <Padmasana cloth="#E08A3A" />
    <S d="M-20 100 C0 150 20 200 34 250" stroke="#F4EFE3" sw={1.4} />
    {Array.from({ length: 14 }, (_, i) => { const u = i / 13; return <circle key={i} cx={-6 + u * 40} cy={96 + Math.sin(u * Math.PI) * 50} r={2.6} fill="#7A4B2A" />; })}
    <Arm sh={[4, 108]} el={[16, 214]} wr={[52, 276]} skin={P.skin} bangles={false} armlet={false} />
    <S d="M38 270 C50 266 62 270 64 278 C56 284 44 284 38 280Z" fill={P.skin} stroke={P.skinLine} sw={1} />
    <S d="M20 40 C22 58 24 72 26 90 L-6 90 C-4 70 -4 52 -4 34Z" fill={P.skin} stroke="none" />
    <MaleHead kind="sage" blink={1 - open} age={.8} tilak="#F4EFE3" />
  </g>
);

// Brahma: three visible heads of four, four arms (Vedas, kamandalu, mala, abhaya), golden skin
export const Brahma: React.FC<Life> = ({ blink = 0 }) => {
  const skin = '#E9B470', shadeSkin = '#D9A060';
  return (
    <g data-id="brahma">
      <Halo x={-30} y={-50} r={130} />
      <Arm sh={[-10, 108]} el={[-40, 30]} wr={[-40, -40]} hand="fist" skin={skin} />
      <g>{Array.from({ length: 16 }, (_, i) => <circle key={i} cx={-40 + Math.cos(i / 16 * 6.28) * 16} cy={-62 + Math.sin(i / 16 * 6.28) * 16} r={2.4} fill="#7A4B2A" />)}</g>
      <MaleBody arms={{ near: { sh: [4, 108], el: [30, 190], wr: [62, 128], hand: 'abhaya' }, far: { sh: [-10, 108], el: [-6, 200], wr: [10, 270], hand: 'fist' } }} legs="stand"
        garb={{ dhoti: '#F4EFE3', sash: P.red, uttariya: '#E0A23A', skin }}
        nearProp={<g><S d="M-6 270 C-20 272 -26 290 -16 304 C-6 316 18 316 26 304 C34 290 28 272 14 270Z" fill={P.gold} sw={1.2} /><S d="M4 270 V252" stroke={P.goldDeep} sw={3} /></g>}
        head={<g>
          <g transform="translate(-22 -30) scale(.8)"><MaleHead kind="sage" skin={shadeSkin} blink={blink} tilak={undefined} /></g>
          <g transform="translate(-66 4) scale(-1 1)"><MaleHead kind="sage" skin={skin} blink={blink} tilak={undefined} /></g>
          <MaleHead kind="sage" skin={skin} blink={blink} />
          <Gold d="M-104 -52 C-100 -80 -60 -96 -30 -98 L-24 -150 L-12 -118 L-2 -160 L8 -118 L20 -146 L30 -58 C0 -72 -70 -72 -104 -52Z" />
          {[-90, -70, -50, -30, -10, 10].map((x) => <circle key={x} cx={x} cy={-72 + Math.abs(x + 40) * .12} r={2.4} fill={P.pearl} stroke={P.goldDeep} strokeWidth={.5} />)}
        </g>} />
      <Arm sh={[10, 110]} el={[64, 160]} wr={[96, 110]} hand="fist" skin={skin} />
      <S d="M84 88 H122 V112 H84Z" fill="#B53A2E" sw={1.2} />
      <S d="M84 94 H122 M84 106 H122" stroke={P.gold} sw={1.2} />
    </g>
  );
};

// Shiva catching the Ganga: ash-pale skin, blue throat, tiger skin, serpent, matted locks spread wide like a fan
export const Shiva: React.FC<Life & { spread?: number }> = ({ blink = 0, spread = 1 }) => {
  const skin = '#DCE1DE';
  const locks: React.ReactNode[] = [];
  for (let i = 0; i < 17; i++) {
    const a0 = (-172 + i * 10.5) * Math.PI / 180, a = a0 * (.35 + .65 * spread) - (1 - spread) * 1.2, L = 170 + 110 * spread + (i % 3) * 22;
    const pts: [number, number][] = [];
    for (let k = 0; k <= 5; k++) { const u = k / 5, r = L * u, wv = Math.sin(u * 7 + i) * 12 * u; pts.push([-8 + Math.cos(a) * r - Math.sin(a) * wv, -70 + Math.sin(a) * r + Math.cos(a) * wv]); }
    locks.push(<S key={i} d={limb(pts, [16, 13, 11, 9, 6, 2])} fill={i % 2 ? '#3B2A1E' : '#4E3826'} stroke="#24170F" sw={1} />);
  }
  return (
    <g data-id="shiva">
      {spread > 0 && <g opacity={spread}>{locks}</g>}
      <MaleBody arms={spread > .5 ? { near: { sh: [4, 108], el: [80, 60], wr: [110, -30], hand: 'open' }, far: { sh: [-10, 108], el: [-70, 50], wr: [-110, -30], hand: 'open' } } : 'abhaya'} legs="stand"
        garb={{ dhoti: '#E08A3A', sash: '#6E4E2E', uttariya: 'none', skin, dhotiLen: 470 }}
        nearProp={<g>
          {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${-30 + i * 11} ${290 + (i % 2) * 40} q6 14 0 26`} stroke="#2A1A12" strokeWidth={3} fill="none" />)}
          <S d="M-8 90 C-20 120 10 140 34 124 C44 118 40 104 30 102" stroke="#3E6A4E" sw={5} />
          <S d="M30 102 C38 96 46 100 44 106" fill="#3E6A4E" sw={1} />
        </g>}
        head={<g><S d="M-2 30 C6 42 18 46 24 44 L26 60 C14 62 2 56 -4 48Z" fill="#6D86B0" stroke="none" /><MaleHead kind="shiva" skin={skin} blink={blink} /></g>} />
    </g>
  );
};

// Ganga seated on her makara, holding a kalash and a lotus
export const GangaOnMakara: React.FC<{ t?: number; blink?: number }> = ({ t = 0, blink = 0 }) => {
  const g = '#E9F1EE', gl = '#9CC7C0';
  return (
    <g data-id="ganga">
      <g transform="translate(0 330)"><Makara t={t} /></g>
      <Halo x={2} y={-10} r={80} />
      <S d="M-40 -30 C-66 40 -78 160 -86 300 L-40 300 C-40 220 -40 150 -30 110Z" fill={gl} fillOp={.6} stroke={P.gold} sw={1.4} />
      <Arm sh={[-8, 110]} el={[-6, 200]} wr={[50, 236]} hand="fist" />
      <S d="M50 214 C40 214 34 226 38 240 C42 256 66 258 72 244 C76 232 70 216 60 214Z" fill={P.gold} sw={1.2} />
      <S d="M-8 86 L22 86 C34 96 44 112 50 140 C54 160 42 176 32 186 C28 205 26 225 28 248 L-36 248 C-38 210 -44 150 -38 112 C-34 96 -22 88 -8 86Z" fill={P.skin} stroke={P.skinLine} sw={1.4} />
      <S d="M-12 96 C8 96 30 104 44 124 C52 146 48 166 34 186 C10 192 -18 190 -34 184 C-38 150 -34 118 -24 104Z" fill={gl} sw={1.3} />
      <S d="M-36 246 L28 246 C60 250 92 262 108 286 C112 300 110 316 104 330 L-46 330 C-48 300 -46 270 -36 246Z" fill={g} sw={1.5} />
      {Array.from({ length: 7 }, (_, i) => <S key={i} d={`M${-26 + i * 16} 256 C${-24 + i * 17} 290 ${-26 + i * 18} 310 ${-28 + i * 19} 328`} stroke={gl} sw={1.2} />)}
      <S d="M-36 246 L30 246" stroke={P.gold} sw={3} />
      <Arm sh={[4, 106]} el={[26, 180]} wr={[76, 150]} hand="fist" />
      <Lotus x={90} y={112} s={1} stem={[80, 150]} />
      <S d="M20 40 C22 58 24 72 26 90 L-6 90 C-4 70 -4 52 -4 34Z" fill={P.skin} stroke="none" />
      <S d="M20 40 C22 58 24 72 26 90" stroke={P.skinLine} sw={1.2} />
      <Head crown blink={blink} veil={gl} />
    </g>
  );
};

export const BhagirathaChariot: React.FC<{ t?: number }> = ({ t = 0 }) => (
  <g data-id="bhagiratha-chariot">
    <g transform="translate(290 -82) scale(.8)"><Horse step={t * .8} saddle={P.saffron} /></g>
    <g transform="translate(-10 -330) scale(.62)"><Bhagiratha pose="reins" /></g>
    <Chariot t={t} />
    <S d="M44 -210 C140 -190 260 -160 400 -150" stroke="#6E4E2E" sw={1.4} />
  </g>
);

export { limb };
