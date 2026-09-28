import React from 'react';
import { P } from '../styles/pahari/palette';
import { S } from '../styles/pahari/paint';
import { seg, ease, rng } from '../styles/pahari/rand';
import { Landscape, Petals } from '../devi/pahari/PortraitScene';
import { Sky, Hill, Pavilion, HillTemple, SnowPeaks, RoundTree, Cypress, Marigold } from '../styles/pahari/scenery';
import { MaleBody, MaleHead } from '../styles/pahari/body';
import { DeviFigure } from '../devi/pahari/DeviFigure';
import { Shailaputri } from '../devi/pahari/Shailaputri';
import { Kund } from '../episodes/pitru/ep1-props';
import { blinkAt, onTwos } from '../shared/film';
import { PAGE } from '../styles/pahari/palette';

// Day 1 · पर्वत की बेटी (Pahari). Scenes: title, Daksha's yajna, Sati insulted, yogic light (abstract, never graphic),
// birth in Himavan's palace, Shailaputri portrait, moral (portrait held).
const W = PAGE.win, G = 1480;
const life = (t: number, s = 0, bloom = 0) => ({ t, blink: blinkAt(t, s), breathe: Math.sin(t * 1.4), sway: 0, bloom });
export type SP = { t: number; u: number; dur: number };

const Courtyard: React.FC<{ t: number }> = ({ t }) => <>
  <Sky x={W.x} y={W.y} w={W.w} h={700} horizon={.9} />
  <Hill x={W.x - 60} w={W.w + 120} base={700} amp={80} bottom={900} seed={11} fill={P.hillMid} tufts={24} />
  <rect x={W.x - 200} y={880} width={W.w + 400} height={900} fill="#E9E1CF" />
  {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${W.x} ${900 + i * 80} H${W.x + W.w}`} stroke="#CFC5AE" strokeWidth={1.4} />)}
  <Pavilion x={540} y={1010} w={760} h={400} curtain={P.saffron} />
  <Cypress x={W.x + 60} y={910} h={260} seed={7} />
  <Cypress x={W.x + W.w - 60} y={910} h={260} seed={8} />
</>;
const Daksha: React.FC<{ t: number; arms: 'offer' | 'point' | 'down' }> = ({ t, arms }) => (
  <MaleBody arms={arms} legs="stand" breathe={Math.sin(t * 1.5)} garb={{ dhoti: '#5F8FC0', sash: P.red, uttariya: '#E8B84A', dhotiLen: 620, garland: true, hair: '#6E6A64' }} head={<MaleHead kind="king" age={.7} blink={blinkAt(t, 1)} crownCol={P.green} />} />
);
const Guest: React.FC<{ t: number; i: number }> = ({ t, i }) => (
  <MaleBody arms="namaskar" legs="stand" garb={{ dhoti: ['#D9707C', '#7FA35A', '#E8B84A', '#5F8FC0'][i % 4], sash: P.red, uttariya: '#F4EFE3', dhotiLen: 600, hair: null }} head={<MaleHead kind={i % 2 ? 'prince' : 'youth'} blink={blinkAt(t, 4 + i)} crownCol={P.saffron} />} />
);
const Sati: React.FC<{ t: number; walk?: boolean }> = ({ t, walk = true }) => (
  <DeviFigure life={{ ...life(t, 3), bloom: 0 }} spec={{ posture: walk ? 'walking' : 'padmasana', garment: '#C2362C', veil: P.pink, crown: false, halo: false, near: walk ? ['none'] : ['dhyana'], far: walk ? ['none'] : ['dhyana'] }} />
);

const S0: React.FC<SP> = ({ t }) => <><Landscape t={t} peaks /><HillTemple x={540} y={1190} s={1.1} /></>;

// Daksha's great yajna; guests arrive, but Shiva and Sati are not there
const S1: React.FC<SP> = ({ t, u }) => {
  const arrive = (i: number) => ease(seg(u, .4 + i * .7, 1.6 + i * .7));
  return <g transform={`translate(540 1300) scale(${1.18 + .05 * seg(u, 0, 8)}) translate(-540 -1300)`}>
    <Courtyard t={t} />
    <Kund x={540} y={1360} t={onTwos(t)} />
    <g transform={`translate(300 ${G - 646 * .6}) scale(.6)`}><Daksha t={t} arms="offer" /></g>
    {[0, 1, 2].map((i) => <g key={i} opacity={arrive(i)} transform={`translate(${760 + i * 70 + (1 - arrive(i)) * 160} ${G - 646 * .52 + i * 6}) scale(-.52 .52)`}><Guest t={t} i={i} /></g>)}
  </g>;
};

// Sati arrives alone; Daksha mocks Shiva before the court
const S2: React.FC<SP> = ({ t, u }) => {
  const walkIn = ease(seg(u, 0, 2.4));
  return <g transform="translate(540 1300) scale(1.18) translate(-540 -1300)">
    <Courtyard t={t} />
    <g transform={`translate(260 ${G - 646 * .6}) scale(.6)`}><Daksha t={t} arms={u > 2.4 ? 'point' : 'down'} /></g>
    {[0, 1].map((i) => <g key={i} transform={`translate(${160 + i * 60} ${G - 646 * .5 + 20}) scale(.5)`}><Guest t={t} i={i + 2} /></g>)}
    <g transform={`translate(${940 - walkIn * 190} ${G - 646 * .56}) scale(-.56 .56)`}><Sati t={t} /></g>
  </g>;
};

// abstract: Sati in meditation; golden yogic light rises around her until she becomes light
const S3: React.FC<SP> = ({ t, u }) => {
  const glow = ease(seg(u, .8, 4.2)), into = seg(u, 3.4, 5.2);
  return <>
    <rect x={W.x} y={W.y} width={W.w} height={W.h} fill="#3A2A30" />
    <ellipse cx={540} cy={820} rx={200 + 420 * glow} ry={260 + 520 * glow} fill="#FFD980" opacity={.25 + .6 * glow} filter="url(#haloBloom)" />
    {Array.from({ length: 28 }, (_, i) => { const a = i / 28 * Math.PI * 2, r = 160 + 220 * glow; return <path key={i} d={`M${540 + Math.cos(a) * 120} ${820 + Math.sin(a) * 150} L${540 + Math.cos(a) * r} ${820 + Math.sin(a) * r * 1.2}`} stroke="#FFE7A0" strokeWidth={5} opacity={glow * .7} strokeLinecap="round" />; })}
    <g opacity={1 - into} transform={`translate(520 ${820 - 250}) scale(.9)`}><Sati t={t} walk={false} /></g>
    <ellipse cx={540} cy={820} rx={150} ry={220} fill="#FFF6D8" opacity={into} filter="url(#haloBloom)" />
  </>;
};

// Himalayan peaks; a baby girl born in King Himavan's palace; flowers rain down
const S4: React.FC<SP> = ({ t, u }) => {
  const r = rng(12);
  return <>
    <Sky x={W.x} y={W.y} w={W.w} h={900} horizon={.9} />
    <SnowPeaks x={W.x - 40} w={W.w + 80} base={960} h={460} seed={2} />
    <Hill x={W.x - 60} w={W.w + 120} base={1040} amp={60} bottom={1600} seed={41} fill={P.hillMid} tufts={30} />
    <HillTemple x={760} y={1260} s={1.05} />
    <g transform={`translate(360 ${G - 646 * .62}) scale(.62)`}>
      <DeviFigure life={life(t, 6)} spec={{ posture: 'walking', garment: '#2F6E9A', veil: '#E8B84A', crown: true, halo: false, near: ['none'], far: ['none'] }} />
      <g transform="translate(66 200)"><S d="M-30 0 C-40 30 -10 56 30 50 C60 44 66 16 50 -4 C30 -20 -20 -16 -30 0Z" fill="#F4EFE3" sw={1.4} /><circle cx={42} cy={2} r={16} fill={P.skin} stroke={P.skinLine} strokeWidth={1.2} /><circle cx={46} cy={-2} r={1.8} fill={P.hair} /></g>
    </g>
    <g transform={`translate(560 ${G - 646 * .66}) scale(.66)`}><MaleBody arms="namaskar" legs="stand" garb={{ dhoti: '#F2C94C', sash: P.red, uttariya: '#7FA35A', dhotiLen: 620, garland: true }} head={<MaleHead kind="king" age={.5} blink={blinkAt(t, 7)} crownCol={P.blue} />} /></g>
    {u > .6 && Array.from({ length: 34 }, (_, i) => { const x = W.x + r() * W.w, sp = 70 + r() * 60, y = W.y + ((u - .6) * sp + r() * 900) % W.h; return <g key={i} data-kind="graphic" data-id="flower"><Marigold x={x} y={y} r={5 + r() * 4} rot={u * 50 + i * 20} c={i % 3 ? P.saffron : '#E0747F'} /></g>; })}
  </>;
};

const Portrait: React.FC<SP & { bloom: number }> = ({ t, bloom }) => <>
  <Landscape t={t} />
  <g transform="translate(500 810) scale(1.28)"><Shailaputri garment="#E8731C" life={life(t, 9, bloom)} /></g>
</>;
const S5: React.FC<SP> = ({ t, u }) => <Portrait t={t} u={u} dur={0} bloom={.3 + .4 * Math.sin(Math.PI * seg(u, 0, 3))} />;
const S6: React.FC<SP> = ({ t, u }) => <><Portrait t={t} u={u} dur={0} bloom={.4} /><Petals t={u} n={16} avoid={[{ x: 110, y: 100, w: 860, h: 360 }]} /></>;

export const DAY1 = { page: 'pahari' as const, scenes: [S0, S1, S2, S3, S4, S5, S6], moralFrom: 6 };
