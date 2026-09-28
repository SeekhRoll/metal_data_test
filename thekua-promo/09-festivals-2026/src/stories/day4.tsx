import React from 'react';
import { seg, ease } from '../styles/pahari/rand';
import { K, Flour, Powder, Dots, sikku, petalKolam, sunKolam, circleD, ellipseD, FACE_LINE, KolamDevi, Ring } from '../styles/kolam/kit';
import type { SP } from './day1';

// Day 4 · एक मुस्कान (Kolam). One continuous white line on the dark floor; colour only as powder in finished shapes.
const CX = 540, CY = 760;
const G = (id: string, c: React.ReactNode) => <g data-kind="graphic" data-id={id}>{c}</g>;
const EGG = sikku(6, 7, CX, CY, 72);

// title: a small kolam draws itself below the title card
const S0: React.FC<SP> = ({ u }) => { const k = sikku(3, 4, CX, 1150, 70); return <>{G('title-kolam', <><Dots pts={k.dots} k={seg(u, 0, 1)} /><Flour d={k.d} p={ease(seg(u, .8, 4))} /></>)}</>; };

// before anything: darkness, and one white dot
const S1: React.FC<SP> = ({ u }) => <>{G('first-dot', <circle cx={CX} cy={CY} r={9 * ease(seg(u, .5, 1.5))} fill={K.flour} filter="url(#flour)" />)}</>;

// one continuous line draws the Devi's face around the dot, ending in a smile
const S2: React.FC<SP> = ({ u, dur }) => <>{G('face', <><circle cx={CX} cy={CY} r={9} fill={K.flour} filter="url(#flour)" /><Flour d={FACE_LINE(CX, CY, 1.3)} p={ease(seg(u, .2, dur - .4))} w={6} /></>)}</>;

// the dot grid spreads outward and a looping kolam forms the cosmic egg
const S3: React.FC<SP> = ({ u, dur }) => <>{G('egg', <>
  <g opacity={1 - seg(u, 0, 1)}><Flour d={FACE_LINE(CX, CY, 1.3)} w={6} /></g>
  <Dots pts={EGG.dots} k={ease(seg(u, .3, 1.8))} />
  <Flour d={EGG.d} p={ease(seg(u, 1.4, dur - .2))} w={5} />
</>)}</>;

// the kolam keeps growing: sun, stars, hills, rivers, birds; blue and saffron powder fills in
const S4: React.FC<SP> = ({ u, dur }) => {
  const q = (a: number, b: number) => ease(seg(u, a * dur, b * dur));
  return <>
    {G('egg', <><Powder d={EGG.d} col={K.blue} a={q(.05, .3) * .7} /><Dots pts={EGG.dots} /><Flour d={EGG.d} w={5} /></>)}
    {G('sun', <><Powder d={circleD(CX, CY, 70)} col={K.saffron} a={q(.1, .3)} /><Flour d={sunKolam(CX, CY, 70, 14)} p={q(.05, .3)} w={4} /></>)}
    {[[180, 230], [880, 260], [260, 420], [820, 470], [150, 900], [930, 880], [300, 1210], [800, 1190]].map(([x, y], i) => G('star', <Flour key={i} d={petalKolam(x, y, 36, 5, .25)} p={q(.25 + i * .04, .4 + i * .04)} w={3.4} />))}
    {G('hills', <Flour d="M80 1400 C220 1290 330 1290 460 1400 C580 1290 700 1280 830 1400 C900 1350 960 1350 1000 1400" p={q(.5, .75)} w={5} />)}
    {G('river', <><Powder d="M80 1440 C200 1420 300 1460 420 1435 C540 1410 660 1460 780 1435 C880 1415 950 1430 1000 1440 L1000 1500 C880 1490 760 1510 640 1490 C520 1470 400 1510 280 1490 C180 1475 120 1490 80 1500 Z" col={K.blue} a={q(.7, .9) * .8} /><Flour d="M80 1440 C200 1420 300 1460 420 1435 C540 1410 660 1460 780 1435 C880 1415 950 1430 1000 1440 M80 1500 C180 1475 280 1490 400 1500 C520 1510 640 1485 760 1500 C880 1515 950 1495 1000 1500" p={q(.62, .85)} w={4} /></>)}
    {G('birds', <>{[[300, 600], [760, 640], [520, 560]].map(([x, y], i) => <Flour key={i} d={`M${x - 40} ${y} Q${x - 20} ${y - 26} ${x} ${y} Q${x + 20} ${y - 26} ${x + 40} ${y}`} p={q(.8 + i * .05, .95)} w={4} />)}</>)}
  </>;
};

// the Devi in continuous line inside the sun's disc: eight arms, lion
const Sun: React.FC<{ p: number }> = ({ p }) => <>{G('sun-disc', <><Powder d={circleD(CX, 720, 430)} col={K.saffron} a={.3 * p} /><Flour d={sunKolam(CX, 720, 400, 28)} p={p} w={4} /><Ring cx={CX} cy={720} r={420} n={40} p={p} /></>)}</>;
const S5: React.FC<SP> = ({ u, dur }) => <><Sun p={ease(seg(u, 0, 1.2))} />{G('devi', <KolamDevi cx={CX} cy={560} s={.72} p={ease(seg(u, .6, dur - .2))} />)}</>;
const S6: React.FC<SP> = () => <><Sun p={1} />{G('devi', <KolamDevi cx={CX} cy={560} s={.72} />)}</>;

export const DAY4 = { page: 'kolam' as const, scenes: [S0, S1, S2, S3, S4, S5, S6], moralFrom: 6 };
