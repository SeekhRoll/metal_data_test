import React from 'react';
import { C } from '../../styles/palette';
import { Bharni, Line, lens, circle } from '../../styles/paint';
import { FONT } from '../../styles/fonts';
import { Fish, Lotus, LotusTop, Peacock, Sun, Vine, Wave, Bamboo } from '../../motifs';
import { Tree, Bird, Cloud, Diya, Matka, Toran, Flag, Dome, Flower } from '../../motifs/extra';
import { Figure, withBlink } from '../../characters/parts';
import * as Su from '../../characters/Sudama/poses';
import * as Wi from '../../characters/Wife/poses';
import * as Kr from '../../characters/Krishna/poses';
import { Frame, Place } from '../Frame';
import { seg, lerp, back, easeInOut, easeOut, blinking } from '../anim';

type P = { frame: number; t: number };

// ================================================================ S1 · 0-5 s · Title
export const S1_Title: React.FC<P> = ({ frame, t }) => {
  const bd = easeInOut(seg(t, .1, 2.4)), sun = back(seg(t, .9, 1.8)), vine = easeOut(seg(t, .7, 2.6));
  const lotus = seg(t, 1.3, 2.8), pea = back(seg(t, 1.8, 2.8)), ink = easeInOut(seg(t, 2.1, 3.5)), fill = seg(t, 3.0, 3.8);
  const fa = t * .9;
  return (
    <Frame frame={frame} t={t} border={bd}>
      {sun > 0 && <Sun x={540} y={330} s={.95 * sun} spin={t * 5} />}
      {vine > 0 && <><Vine x={150} y={1560} r={-90} len={1300 * vine} sway={t} /><Vine x={930} y={1560} r={-90} len={1300 * vine} sway={t + 2} /></>}
      {lotus > 0 && <LotusTop x={540} y={1150} s={1.35} grow={lotus} />}
      {lotus > .5 && [0, 1].map(i => { const a = fa + i * Math.PI; return <Fish key={i} x={540 + Math.cos(a) * 250} y={1150 + Math.sin(a) * 150} s={.62} r={a * 180 / Math.PI + 90} body={i ? C.leaf : C.turmeric} />; })}
      {pea > 0 && <><Peacock x={250} y={1500} s={.7 * pea} /><Peacock x={830} y={1500} s={.7 * pea} flip /></>}
      <text x={540} y={790} textAnchor="middle" fontFamily={FONT.yatra} fontSize={128} fill={C.vermilion} fillOpacity={fill}
        stroke={C.black} strokeWidth={3.5} strokeDasharray={4200} strokeDashoffset={4200 * (1 - ink)}>सुदामा की पोटली</text>
      <text x={540} y={880} textAnchor="middle" fontFamily={FONT.tiro} fontSize={46} fill={C.indigo} opacity={seg(t, 3.3, 4.0)}>मधुबनी कथा · भाग १</text>
    </Frame>
  );
};

// ================================================================ S2 · 5-13 s · The hut
const HutWall: React.FC = () => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill={C.paperShade} />
    {/* painted wall: rows of motifs, the way village walls are painted */}
    {[0, 1, 2].map(r => [0, 1, 2, 3].map(c => (
      <g key={r + '-' + c} opacity={.55}>
        {((r + c) % 2) ? <LotusTop x={200 + c * 230} y={560 + r * 300} s={.42} /> : <Fish x={200 + c * 230} y={560 + r * 300} s={.5} r={(c % 2) * 180} />}
      </g>
    )))}
    {/* thatch */}
    <rect x={0} y={0} width={1080} height={380} fill={C.turmeric} />
    {Array.from({ length: 40 }, (_, i) => <path key={i} d={`M${i * 30 - 40} 380 L${i * 30 + 30} 90`} stroke={C.ochre} strokeWidth={10} />)}
    {Array.from({ length: 40 }, (_, i) => <path key={'b' + i} d={`M${i * 30 - 40} 380 L${i * 30 + 30} 90`} stroke={C.black} strokeWidth={2} />)}
    <Bharni d="M0 360 L1080 360 L1080 400 L0 400 Z" fill={C.ochre} band={3} pattern="pleats" />
    {/* niche with the lamp */}
    <Bharni d="M470 700 C470 620 610 620 610 700 L610 790 L470 790 Z" fill={C.indigo} band={3.5} />
    {/* floor + mat */}
    <rect x={0} y={1380} width={1080} height={540} fill={C.ochre} />
    <Bharni d="M110 1420 L970 1420 L990 1540 L90 1540 Z" fill={C.turmericLight} pattern="crossHatch" band={4} />
    {Array.from({ length: 22 }, (_, i) => <path key={i} d={`M${100 + i * 40} 1380 l20 -26 l20 26 Z`} fill={i % 2 ? C.vermilion : C.leaf} stroke={C.black} strokeWidth={2} />)}
  </g>
);

export const S2_Hut: React.FC<P> = ({ frame, t }) => {
  const lt = t - 5, push = 1 + .06 * easeInOut(seg(lt, 0, 8));
  const tying = lt > 2.6 && lt < 6.8 ? (Math.floor(frame / 6) % 2 ? Wi.tieB : Wi.tieA) : Wi.tieA;
  return (
    <Frame frame={frame} t={t}>
      <g transform={`translate(540 1150) scale(${push}) translate(-540 -1150)`}>
        <HutWall />
        <Diya x={540} y={780} s={1.1} t={t} />
        <Matka x={900} y={1400} s={.95} />
        <Matka x={1010} y={1410} s={.75} col={C.vermilion} />
        <Place x={290} y={1500} s={1.02}><Figure spec={withBlink(Su.sit, blinking(lt, .7))} /></Place>
        <Place x={760} y={1500} s={1.02} flip><Figure spec={tying} /></Place>
      </g>
      {/* foreground parallax: the toran sways faster than the room */}
      <Toran x={96} y={420 - 8 * easeInOut(seg(lt, 0, 8))} w={888} sway={t * 1.3} />
    </Frame>
  );
};

// ================================================================ S3 · 13-21 s · The journey (long scroll)
const WORLD = 3700;
const JourneyBG: React.FC<{ cam: number; t: number }> = ({ cam, t }) => (
  <g transform={`translate(${-cam * .35} 0)`}>
    <rect x={-100} y={0} width={WORLD} height={560} fill={C.paper} />
    <Sun x={700} y={300} s={.75} spin={t * 5} />
    {[300, 1300, 2100, 2900].map((x, i) => <Cloud key={i} x={x + Math.sin(t * .6 + i) * 20} y={200 + (i % 2) * 110} s={.9} />)}
    {Array.from({ length: 7 }, (_, i) => <Bird key={i} x={1000 + i * 150 + t * 40 + (i % 2) * 50} y={380 - (i % 3) * 50} s={.55} flap={Math.floor(t * 6 + i) % 2} body={i % 2 ? C.leaf : C.indigoLight} />)}
  </g>
);
const JourneyMid: React.FC<{ cam: number; t: number }> = ({ cam, t }) => (
  <g transform={`translate(${-cam} 0)`}>
    {/* land */}
    <rect x={-100} y={540} width={WORLD + 200} height={760} fill={C.turmericLight} />
    <rect x={-100} y={540} width={WORLD + 200} height={760} fill="url(#dotsBlack)" opacity={.12} />
    <Bharni d={`M-100 1210 L${WORLD + 100} 1210 L${WORLD + 100} 1300 L-100 1300 Z`} fill={C.ochre} band={4} pattern="crossHatch" />
    {[160, 900, 1650, 2250].map((x, i) => <Tree key={i} x={x} y={1210} s={.95} sway={t * 1.2 + i} fruit={i % 2 ? C.vermilion : C.turmeric} />)}
    {[520, 560, 1260, 1300, 1960].map((x, i) => <Bamboo key={i} x={x} y={1215} h={620 + (i % 2) * 90} s={.9} />)}
    <Peacock x={1150} y={1170} s={.62} />
    <Peacock x={2050} y={1170} s={.62} flip />
    {/* golden Dwarka by the sea */}
    <g transform="translate(2980 1210)">
      <Bharni d="M-420 0 L-420 -330 L420 -330 L420 0 Z" fill={C.turmeric} pattern="dotsBlack" band={5} />
      {[-300, -100, 100, 300].map(x => <Bharni key={x} d={`M${x - 60} 0 L${x - 60} -170 C${x - 60} -250 ${x + 60} -250 ${x + 60} -170 L${x + 60} 0 Z`} fill={C.vermilion} band={3.5} />)}
      <Dome x={-250} y={-330} s={.9} /><Dome x={0} y={-330} s={1.3} /><Dome x={250} y={-330} s={.9} />
      <Flag x={-250} y={-510} wave={Math.sin(t * 5)} /><Flag x={0} y={-600} wave={Math.sin(t * 5 + 1)} /><Flag x={250} y={-510} wave={Math.sin(t * 5 + 2)} />
      <text x={0} y={-60} textAnchor="middle" fontFamily={FONT.yatra} fontSize={70} fill={C.black}>द्वारका</text>
    </g>
  </g>
);
const River: React.FC<{ cam: number; t: number }> = ({ cam, t }) => (
  <g transform={`translate(${-cam} 0)`}>
    <rect x={-100} y={1300} width={WORLD + 200} height={320} fill={C.indigoLight} opacity={.55} />
    <Wave x={-100} y={1310} w={WORLD + 200} rows={6} phase={t * .8} />
    {Array.from({ length: 12 }, (_, i) => <Fish key={i} x={i * 330 + 120 + ((t * 50 + i * 30) % 120)} y={1380 + (i % 3) * 70} s={.55} flip={i % 2 === 1} body={[C.turmeric, C.vermilion, C.leaf][i % 3]} fin={C.vermilion} />)}
    {[700, 1850, 2500].map((x, i) => <Lotus key={i} x={x} y={1450} s={.5} />)}
  </g>
);

export const S3_Journey: React.FC<P> = ({ frame, t }) => {
  const lt = t - 13, cam = lerp(0, WORLD - 1180, easeInOut(seg(lt, 0, 7.8)));
  const walkIx = Math.floor(frame / 6) % 4;
  const sx = lerp(260, 420, easeInOut(seg(lt, 0, 8)));
  return (
    <Frame frame={frame} t={t}>
      <JourneyBG cam={cam} t={t} />
      <JourneyMid cam={cam} t={t} />
      <Place x={sx} y={1262} s={.82}><Figure spec={withBlink(Su.walk(walkIx), blinking(lt, .3))} /></Place>
      <River cam={cam} t={t} />
      {/* foreground parallax: bamboo and vine passing faster than the world */}
      <g transform={`translate(${-cam * 1.5} 0)`}>
        {Array.from({ length: 9 }, (_, i) => <Vine key={i} x={200 + i * 640} y={96} r={90} len={260 + (i % 3) * 60} sway={t + i} />)}
        {Array.from({ length: 12 }, (_, i) => <Lotus key={'l' + i} x={100 + i * 480} y={1575} s={.42} petal={i % 2 ? C.vermilion : C.turmeric} inner={i % 2 ? C.turmeric : C.vermilion} />)}
      </g>
    </Frame>
  );
};

// ================================================================ S4 · 21-29 s · The embrace at the gate
const Gate: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill={C.turmeric} />
    <rect x={0} y={0} width={1080} height={1920} fill="url(#dotsBlack)" opacity={.15} />
    <Bharni d="M180 1440 L180 560 C180 330 900 330 900 560 L900 1440 Z" fill={C.vermilion} band={6} pattern="dotsPaper" />
    <Bharni d="M270 1440 L270 640 C270 450 810 450 810 640 L810 1440 Z" fill={C.leaf} band={5} />
    <LotusTop x={540} y={760} s={.8} />
    {[0, 1, 2].map(i => <Fish key={i} x={400 + i * 140} y={1060 + (i % 2) * 60} s={.5} r={(i % 2) * 180} body={C.turmeric} />)}
    <Dome x={540} y={330} s={1.1} />
    <Peacock x={250} y={300} s={.55} /><Peacock x={830} y={300} s={.55} flip />
    <Flag x={120} y={560} wave={Math.sin(t * 5)} /><Flag x={960} y={560} wave={Math.sin(t * 5 + 1)} />
    <Toran x={180} y={560} w={720} sway={t * 1.3} />
    <rect x={0} y={1440} width={1080} height={480} fill={C.ochre} />
    {Array.from({ length: 24 }, (_, i) => <path key={i} d={`M${i * 46} 1440 l23 30 l23 -30 Z`} fill={i % 2 ? C.vermilion : C.turmeric} stroke={C.black} strokeWidth={2} />)}
  </g>
);

export const S4_Embrace: React.FC<P> = ({ frame, t }) => {
  const lt = t - 21;
  const run = seg(lt, .8, 3.8), kx = lerp(1180, 660, easeOut(run));
  const hugging = lt >= 3.9;
  const runSpec = Math.floor(frame / 4) % 2 ? Kr.runB : Kr.runA;
  const ripple = (k: number) => seg(lt, 4.1 + k * .32, 4.9 + k * .32);
  return (
    <Frame frame={frame} t={t}>
      <Gate t={t} />
      {/* lotus ripples spreading from the embrace */}
      {[0, 1, 2, 3, 4].map(k => {
        const n = 6 + k * 4, R = 190 + k * 165, g = ripple(k);
        return g > 0 && Array.from({ length: n }, (_, i) => {
          const a = i / n * Math.PI * 2 + k * .3;
          return <LotusTop key={k + '-' + i} x={530 + Math.cos(a) * R} y={1010 + Math.sin(a) * R * 1.1} s={.3} grow={g} n={6} petal={k % 2 ? C.vermilion : C.indigo} inner={C.paper} />;
        });
      })}
      {!hugging && <Place x={380} y={1480} s={.9}><Figure spec={withBlink(Su.wait, blinking(lt, 1))} /></Place>}
      {!hugging && lt > .8 && <Place x={kx} y={1480} s={.9} flip><Figure spec={runSpec} /></Place>}
      {hugging && <Place x={405} y={1480} s={.9}><Figure spec={Su.embrace} /></Place>}
      {hugging && <Place x={675} y={1480} s={.9} flip><Figure spec={Kr.embrace} /></Place>}
    </Frame>
  );
};
