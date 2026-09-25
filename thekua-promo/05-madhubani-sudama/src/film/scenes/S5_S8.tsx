import React from 'react';
// @ts-ignore: flubber ships without types
import { interpolate as morph } from 'flubber';
import { C } from '../../styles/palette';
import { Bharni, Line, lens, circle } from '../../styles/paint';
import { FONT } from '../../styles/fonts';
import { Fish, Lotus, LotusTop, Peacock, Sun, Vine, Wave } from '../../motifs';
import { Tree, Bird, Cloud, Diya, Toran, Flag, Dome, Flower, Pillar, ThekuaM, HUT_D, PALACE_D } from '../../motifs/extra';
import { Figure, Potli, withBlink } from '../../characters/parts';
import * as Su from '../../characters/Sudama/poses';
import * as Wi from '../../characters/Wife/poses';
import * as Kr from '../../characters/Krishna/poses';
import { Frame, Place } from '../Frame';
import { seg, lerp, back, easeInOut, easeOut, blinking } from '../anim';

type P = { frame: number; t: number };
export const BRAND = { maroon: '#4A1414', gold: '#A8843A', phone: '81782 26605' };

// ================================================================ S5 · 29-39 s · The potli
const Hall: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill={C.vermilion} />
    {[0, 1, 2, 3].map(r => [0, 1, 2, 3, 4].map(c => <LotusTop key={r + '-' + c} x={150 + c * 195} y={520 + r * 240} s={.28} n={8} petal={C.turmeric} inner={C.paper} />))}
    <Toran x={96} y={130} w={888} sway={t * 1.1} />
    {[300, 780].map((x, i) => <g key={i} transform={`translate(${x} ${270 + Math.sin(t * 1.6 + i) * 4})`}><path d="M0 -140 L0 -10" stroke={C.black} strokeWidth={4} /><Diya x={0} y={30} s={.8} t={t + i} /></g>)}
    <Pillar x={140} y={1470} h={1080} /><Pillar x={940} y={1470} h={1080} />
    <rect x={0} y={1470} width={1080} height={450} fill={C.turmeric} />
    {Array.from({ length: 12 }, (_, i) => <Bharni key={i} d={`M${i * 92} 1470 L${i * 92 + 92} 1470 L${i * 92 + 92} 1560 L${i * 92} 1560 Z`} fill={i % 2 ? C.leaf : C.turmeric} band={2.5} hatch={false} />)}
  </g>
);
const BURSTS = Array.from({ length: 14 }, (_, i) => {
  const a = -Math.PI / 2 + (i % 2 ? 1 : -1) * (.3 + (i * .37) % 1.3), d = 170 + (i * 53) % 260;
  return { t0: 5.3 + i * .32, dx: Math.cos(a) * d, dy: Math.sin(a) * d - 60, col: [C.turmeric, C.paper, C.leaf, C.indigoLight][i % 4], s: .45 + (i % 3) * .12 };
});

export const S5_Potli: React.FC<P> = ({ frame, t }) => {
  const lt = t - 29;
  const kx = 330, sx = 790, base = 1480, sc = .9;
  const fly = seg(lt, 3.6, 4.4);
  // potli arc: from behind Sudama's back to Krishna's reaching hand
  const p0: [number, number] = [sx + 92 * sc, base - 398 * sc], p1: [number, number] = [kx + 160 * sc, base - 472 * sc];
  const k = easeInOut(fly), px = lerp(p0[0], p1[0], k), py = lerp(p0[1], p1[1], k) - Math.sin(k * Math.PI) * 220;
  const chew = Math.floor(frame / 6) % 2 === 0;
  let krishna = withBlink(Kr.stand, blinking(lt, .4)), sudama = withBlink(Su.hide, false);
  if (lt >= 3.6 && lt < 4.4) { krishna = { ...Kr.pull, holdNear: undefined }; sudama = { ...Su.hide, behind: undefined, head: { ...Su.hide.head, eye: 'open' } }; }
  else if (lt >= 4.4 && lt < 5.0) { krishna = Kr.pull; sudama = { ...Su.hide, behind: undefined, head: { ...Su.hide.head, eye: 'open' } }; }
  else if (lt >= 5.0) { krishna = { ...Kr.eat, head: { ...Kr.eat.head, mouth: chew ? 'open' : 'smile' } }; sudama = lt > 5.6 ? Su.namaste : { ...Su.hide, behind: undefined }; }
  const mouth: [number, number] = [kx + 110 * sc, base - 482 * sc];
  return (
    <Frame frame={frame} t={t}>
      <Hall t={t} />
      {/* flowers burst from the chivda and settle into the painting as pattern */}
      {BURSTS.map((b, i) => { const g = seg(lt, b.t0, b.t0 + .7); if (g <= 0) return null; const m = back(g); return <Flower key={i} x={mouth[0] + b.dx * m} y={mouth[1] + b.dy * m} s={b.s * back(g, 1.8)} col={b.col} />; })}
      <Place x={kx} y={base} s={sc}><Figure spec={krishna} /></Place>
      <Place x={sx} y={base} s={sc} flip><Figure spec={sudama} /></Place>
      {fly > 0 && fly < 1 && <Potli x={px} y={py} s={.95 * sc} />}
    </Frame>
  );
};

// ================================================================ S6 · 39-46 s · The return: hut becomes a palace
const HUT2PALACE = morph(HUT_D, PALACE_D, { maxSegmentLength: 8 });
const Village: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x={0} y={0} width={1080} height={560} fill={C.paper} />
    <Sun x={250} y={300} s={.62} spin={t * 5} />
    <Cloud x={720} y={250} s={.8} />
    {[0, 1, 2, 3].map(i => <Bird key={i} x={560 + i * 90 + t * 30} y={420 - (i % 2) * 40} s={.45} flap={Math.floor(t * 6 + i) % 2} />)}
    <rect x={0} y={540} width={1080} height={760} fill={C.turmericLight} />
    <rect x={0} y={540} width={1080} height={760} fill="url(#dotsBlack)" opacity={.12} />
    <Tree x={170} y={1210} s={.85} sway={t * 1.2} />
    <Bharni d="M-10 1210 L1090 1210 L1090 1300 L-10 1300 Z" fill={C.ochre} band={4} pattern="crossHatch" />
    <rect x={0} y={1300} width={1080} height={330} fill={C.indigoLight} opacity={.55} />
    <Wave x={0} y={1310} w={1080} rows={6} phase={t * .8} />
    {[0, 1, 2].map(i => <Fish key={i} x={200 + i * 330 + ((t * 40) % 80)} y={1400 + (i % 2) * 80} s={.55} flip={i === 1} body={[C.turmeric, C.vermilion, C.leaf][i]} />)}
  </g>
);
export const S6_Return: React.FC<P> = ({ frame, t }) => {
  const lt = t - 39;
  const walkK = seg(lt, 0, 4.2), wx = lerp(120, 470, easeInOut(walkK));
  const m = easeInOut(seg(lt, 3.0, 4.4)), palace = m >= .5;
  const bloom = (k: number) => seg(lt, 4.3 + k * .28, 5.1 + k * .28);
  const hx = 790, hy = 1210;
  return (
    <Frame frame={frame} t={t}>
      <Village t={t} />
      {/* patterns bloom outward from the doorway, across the walls and the land */}
      {[0, 1, 2, 3].map(k => {
        const n = 5 + k * 3, R = 150 + k * 150;
        return bloom(k) > 0 && Array.from({ length: n }, (_, i) => {
          const a = Math.PI + i / (n - 1) * Math.PI;
          return <LotusTop key={k + '-' + i} x={hx + Math.cos(a) * R} y={hy - 120 + Math.sin(a) * R} s={.26} grow={bloom(k)} n={6} petal={k % 2 ? C.vermilion : C.leaf} inner={C.turmeric} />;
        });
      })}
      <g transform={`translate(${hx} ${hy}) scale(.8)`}>
        <Bharni d={HUT2PALACE(m)} fill={palace ? C.turmeric : C.ochre} pattern={palace ? 'dotsBlack' : 'crossHatch'} band={5} />
        {!palace && Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${-240 + i * 42} -250 L${-150 + i * 26} -440`} stroke={C.black} strokeWidth={4} opacity={1 - m * 2} />)}
        {palace && <><Dome x={0} y={-640} s={.8 * back(seg(lt, 3.9, 4.5))} /><Flag x={-260} y={-460} wave={Math.sin(t * 5)} /><Flag x={260} y={-460} wave={Math.sin(t * 5 + 1)} /></>}
        <Bharni d="M-70 0 L-70 -170 C-70 -240 70 -240 70 -170 L70 0 Z" fill={palace ? C.vermilion : C.black} band={3.5} />
      </g>
      {lt > 5.0 && <Place x={hx - 20} y={hy} s={.52 * back(seg(lt, 5.0, 5.6))} flip><Figure spec={Wi.bless} /></Place>}
      <Place x={wx} y={1262} s={.82}><Figure spec={lt < 4.2 ? Su.walk(Math.floor(frame / 6) % 4, false) : Su.namaste} /></Place>
    </Frame>
  );
};

// ================================================================ S7 · 46-52 s · The moral, Gita 9.26
const SHLOKA = ['पत्रं पुष्पं फलं तोयं', 'यो मे भक्त्या प्रयच्छति।', 'तदहं भक्त्युपहृतमश्नामि', 'प्रयतात्मनः॥'];   // Gita 9.26, exactly as in the brief
export const S7_Moral: React.FC<P> = ({ frame, t }) => {
  const lt = t - 46, cx = 540, cy = 860, R = 350;
  return (
    <Frame frame={frame} t={t}>
      <Sun x={210} y={290} s={.5} spin={t * 5} />
      <g transform="translate(870 290)"><Bharni d="M-60 -60 C-100 -10 -80 60 -10 76 C-60 40 -70 -20 -60 -60 Z" fill={C.turmericLight} band={3} /><circle cx={-44} cy={0} r={4} fill={C.black} /></g>
      {Array.from({ length: 18 }, (_, i) => {
        const g = back(seg(lt, i * .05, .5 + i * .05)); if (g <= 0) return null;
        const a = i / 18 * Math.PI * 2;
        return <Bharni key={i} d={lens(cx + Math.cos(a) * (R - 10), cy + Math.sin(a) * (R - 10), cx + Math.cos(a) * (R + 120 * g), cy + Math.sin(a) * (R + 120 * g), 34 * g)} fill={i % 2 ? C.vermilion : C.turmeric} band={3.5} />;
      })}
      <Bharni d={circle(cx, cy, R)} fill={C.paper} band={6} bandFill={C.turmericLight} />
      {SHLOKA.map((line, i) => {
        const k = easeInOut(seg(lt, .9 + i * .95, 1.75 + i * .95)), y = cy - 150 + i * 100;
        return (
          <g key={i}>
            <clipPath id={'sl' + i}><rect x={cx - 320} y={y - 70} width={640 * k} height={100} /></clipPath>
            <text x={cx} y={y} textAnchor="middle" fontFamily={FONT.tiro} fontSize={54} fill={C.black} clipPath={`url(#sl${i})`}>{line}</text>
            {k > 0 && k < 1 && <circle cx={cx - 320 + 640 * k} cy={y - 16} r={6} fill={C.vermilion} />}
          </g>
        );
      })}
      <text x={cx} y={cy + R + 180} textAnchor="middle" fontFamily={FONT.tiro} fontSize={38} fill={C.indigo} opacity={seg(lt, 4.6, 5.2)}>श्रीमद्भगवद्गीता ९.२६</text>
      <Vine x={150} y={1560} r={-90} len={1300} sway={t} /><Vine x={930} y={1560} r={-90} len={1300} sway={t + 2} />
      <g><rect x={96} y={1420} width={888} height={140} fill={C.indigoLight} opacity={.5} /><Wave x={96} y={1424} w={888} rows={3} phase={t * .8} />
        <Fish x={330} y={1490} s={.5} body={C.turmeric} /><Fish x={750} y={1490} s={.5} flip body={C.vermilion} /></g>
    </Frame>
  );
};

// ================================================================ S8 · 52-60 s · Sri Desi Thekua
const POTLI_CLOSED = 'M-34 0 C-46 -30 -30 -56 -6 -58 L6 -58 C30 -56 46 -30 34 0 C20 12 -20 12 -34 0 Z';
const POTLI_OPEN = 'M-70 6 C-86 -26 -62 -50 -42 -36 L42 -36 C62 -50 86 -26 70 6 C46 22 -46 22 -70 6 Z';
const OPEN = morph(POTLI_CLOSED, POTLI_OPEN, { maxSegmentLength: 4 });

export const S8_EndCard: React.FC<P> = ({ frame, t }) => {
  const lt = t - 52;
  const open = easeInOut(seg(lt, .5, 1.4)), knot = 1 - seg(lt, .3, .8);
  const settle = easeInOut(seg(lt, 2.2, 3.2));
  const gx = 540, gy = lerp(960, 1080, settle), gs = lerp(3.0, 2.1, settle);
  const pop = (i: number) => back(seg(lt, 1.2 + i * .18, 1.9 + i * .18));
  const w = (a: number) => easeOut(seg(lt, a, a + .6));
  return (
    <Frame frame={frame} t={t}>
      {/* fish and flowers keep the page full around the potli */}
      <Fish x={220} y={1060} s={.6} body={C.turmeric} /><Fish x={860} y={1060} s={.6} flip body={C.leaf} fin={C.turmeric} />
      {[[200, 900], [880, 900], [200, 1210], [880, 1210]].map(([x, y], i) => <Flower key={i} x={x} y={y} s={.8} col={i % 2 ? C.vermilion : C.indigoLight} />)}
      {/* the potli unties itself */}
      <g transform={`translate(${gx} ${gy}) scale(${gs})`}>
        <Bharni d={OPEN(open)} fill={C.paper} pattern="dotsBlack" band={2.2} />
        <path d="M-60 -8 C-30 6 30 6 60 -8" fill="none" stroke={C.vermilion} strokeWidth={4} opacity={open} />
        {knot > 0 && <g opacity={knot}><Line d="M-6 -58 C-20 -78 -8 -86 0 -70 C8 -86 20 -78 6 -58 Z" fill={C.paper} w={1.6} /><path d="M-9 -58 L9 -58" stroke={C.vermilion} strokeWidth={4} /></g>}
        {[[-40, -40, -.25], [40, -40, .25], [0, -58, 0]].map(([x, y, r], i) => pop(i) > 0 && <ThekuaM key={i} x={x} y={y - 26 * pop(i)} s={.42 * pop(i)} r={r * 57} />)}
      </g>
      {/* end card in the box-sticker look, inside the Madhubani frame */}
      <g opacity={w(2.4)}>
        <path d="M150 170 H930 V700 H150 Z" fill="#F7EEDC" stroke={BRAND.maroon} strokeWidth={6} />
        <path d="M168 188 H912 V682 H168 Z" fill="none" stroke={BRAND.gold} strokeWidth={2.5} />
        <path d="M132 152 H948 V718 H132 Z" fill="none" stroke={BRAND.maroon} strokeWidth={3} strokeDasharray="14 10" />
        <text x={540} y={286} textAnchor="middle" fontFamily={FONT.serif} fontWeight={700} fontSize={62} letterSpacing={4} fill={BRAND.gold}>SRI DESI</text>
        <text x={540} y={430} textAnchor="middle" fontFamily={FONT.serif} fontWeight={900} fontSize={150} fill={BRAND.maroon}>THEKUA</text>
        <text x={540} y={532} textAnchor="middle" fontFamily={FONT.script} fontWeight={700} fontSize={86} fill={BRAND.maroon}>Cookies (Crunchy)</text>
        <path d="M300 574 H780" stroke={BRAND.gold} strokeWidth={4} />
        <text x={540} y={640} textAnchor="middle" fontFamily={FONT.serif} fontWeight={700} fontSize={29} letterSpacing={1} fill={BRAND.gold}>AUTHENTIC, TRADITIONAL &amp; HOME MADE</text>
      </g>
      <text x={540} y={796} textAnchor="middle" fontFamily={FONT.tiro} fontSize={62} fill={C.vermilion} opacity={w(2.9)}>घर का बना, प्रेम से बना</text>
      <g opacity={w(3.4)}>
        <rect x={150} y={1270} width={700} height={116} rx={30} fill="#F7EEDC" stroke={BRAND.gold} strokeWidth={5} />
        <text x={500} y={1305} textAnchor="middle" fontFamily={FONT.serif} fontWeight={700} fontSize={30} fill={BRAND.maroon}>For order call or WhatsApp</text>
        <text x={500} y={1366} textAnchor="middle" fontFamily={FONT.serif} fontWeight={800} fontSize={62} fill={BRAND.maroon}>{BRAND.phone}</text>
        <rect x={880} y={1296} width={64} height={64} fill="#F7EEDC" stroke="#1E7B34" strokeWidth={5} /><circle cx={912} cy={1328} r={18} fill="#1E7B34" />
      </g>
      <g opacity={w(3.8)}>
        <text x={540} y={1452} textAnchor="middle" fontFamily={FONT.serif} fontWeight={700} fontSize={38} fill={BRAND.maroon}>Delivery across all Dwarka sectors</text>
        <text x={540} y={1512} textAnchor="middle" fontFamily={FONT.tiro} fontSize={40} fill={C.indigo}>द्वारका के सभी सेक्टरों में डिलीवरी</text>
      </g>
    </Frame>
  );
};
