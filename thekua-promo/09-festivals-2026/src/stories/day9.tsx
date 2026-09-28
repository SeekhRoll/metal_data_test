import React from 'react';
import { seg, ease } from '../styles/pahari/rand';
import { TJ, P, Ln, Foil, Gem, TFace, Prabhavali, Swag, Lotus, circle } from '../styles/tanjore/kit';
import { Siddhidatri, Ardhanari } from '../styles/tanjore/figures';
import days from '../../data/navratri-days.json';
import type { SP } from './day1';

// Day 9 · अर्धनारीश्वर (Tanjore painting), the series finale. Gold relief with a slow light sweep (TanjorePage animates
// the foil light), glass gems that catch sparkles; eight siddhis as eight glowing gems.
const G = (id: string, c: React.ReactNode) => <g data-kind="graphic" data-id={id}>{c}</g>;
const blinkAt = (u: number, ...ts: number[]) => Math.max(0, ...ts.map((b) => 1 - Math.abs(u - b) / .09));
const Ground: React.FC<{ c: string }> = ({ c }) => <rect x={64} y={64} width={952} height={1492} fill={c} />;
const SIDDHI = [TJ.ruby, TJ.emerald, TJ.pearl, '#2F6FD0', TJ.ruby, TJ.emerald, TJ.pearl, '#E0A020'];
// Adi Shakti as radiant light
const Shakti: React.FC<{ x: number; y: number; r: number; u: number; a?: number }> = ({ x, y, r, u, a = 1 }) => <g opacity={a}>
  <circle cx={x} cy={y} r={r * 1.8} fill="url(#tjLight)" />
  {Array.from({ length: 24 }, (_, i) => { const an = i / 24 * Math.PI * 2 + u * .15; return <Ln key={i} d={`M${x + Math.cos(an) * r * .6} ${y + Math.sin(an) * r * .6} L${x + Math.cos(an) * r * (1.1 + .2 * Math.sin(u * 3 + i))} ${y + Math.sin(an) * r * (1.1 + .2 * Math.sin(u * 3 + i))}`} w={4} c="#FFF3C8" op={.8} />; })}
  <circle cx={x} cy={y} r={r * .5} fill="#FFFBEA" />
</g>;

// 0 · title: the empty shrine, lotus seat, the gems catching light
const S0: React.FC<SP> = ({ u }) => <>
  <Ground c={TJ.green} /><Swag />
  <Prabhavali cx={540} base={1420} w={860} h={1260} t={u} />
  {G('shrine-light', <Shakti x={540} y={960} r={150} u={u} a={.5 + .1 * Math.sin(u * 2)} />)}
  {G('lotus', <Lotus x={540} y={1460} w={720} />)}
</>;

// 1 · Shiva, eyes closed, worships the Adi Shakti, who appears as light
const S1: React.FC<SP> = ({ u, dur }) => {
  const a = ease(seg(u, .3, 2));
  return <>
    <Ground c={TJ.blue} /><Swag />
    {G('shakti', <Shakti x={760} y={560} r={130 + 10 * Math.sin(u * 1.5)} u={u} a={a} />)}
    {G('shiva', <g transform="translate(400 1520) scale(.95)"><Ardhanari t={u} blink={1} split={0} /></g>)}
  </>;
};

// 2 · eight glowing gems, one for each siddhi, float from the Devi to Shiva
const S2: React.FC<SP> = ({ u, dur }) => <>
  <Ground c={TJ.blue} /><Swag />
  {G('shakti', <Shakti x={760} y={560} r={140} u={u} />)}
  {G('siddhis', <>{SIDDHI.map((c, i) => {
    const p = ease(seg(u, .4 + i * (dur - 2) / 10, 1.8 + i * (dur - 2) / 10)), x = 760 + (400 - 760) * p + Math.sin(p * Math.PI) * (i % 2 ? 90 : -90), y = 560 + (860 - 560) * p - Math.sin(p * Math.PI) * 160;
    return <g key={i} opacity={1 - seg(p, .92, 1)}><circle cx={x} cy={y} r={40} fill="url(#tjLight)" /><Gem x={x} y={y} r={22} c={c} t={u} ph={i} /></g>;
  })}</>)}
  {G('shiva', <g transform="translate(400 1520) scale(.95)"><Ardhanari t={u} blink={1 - seg(u, dur - 1.2, dur - .8)} split={0} /></g>)}
  {G('glow', <circle cx={400} cy={860} r={90 * seg(u, 1.8, dur)} fill="url(#tjLight)" />)}
</>;

// 3 · the left half of Shiva's body becomes the Devi; a gold line traces the division
const S3: React.FC<SP> = ({ u, dur }) => {
  const split = ease(seg(u, .6, dur * .6)), move = ease(seg(u, 0, 1));
  return <>
    <Ground c={TJ.blue} /><Swag />
    <g opacity={move}><Prabhavali cx={540} base={1500} w={760} h={1300} t={u} /></g>
    {G('ardhanari', <g transform={`translate(${400 + 140 * move} ${1520 - 30 * move}) scale(${.95 + .15 * move})`}><Ardhanari t={u} blink={blinkAt(u, dur - .8)} split={split} /></g>)}
    {G('flash', <circle cx={540} cy={900} r={400} fill="url(#tjLight)" opacity={Math.sin(split * Math.PI) * .6} />)}
  </>;
};

// 4 · devas, sages and people bow; blessings flow outward and the gems sparkle
const Devotee: React.FC<{ x: number; y: number; kind: 'deva' | 'sage' | 'human'; bow: number; dir: number }> = ({ x, y, kind, bow, dir }) => (
  <g transform={`translate(${x} ${y}) rotate(${dir * 18 * bow}) scale(.34)`}>
    <P d="M-110 120 C-130 220 -120 330 -100 400 L100 400 C120 330 130 220 110 120 C60 100 -60 100 -110 120Z" fill={kind === 'deva' ? TJ.red : kind === 'sage' ? '#D9832A' : TJ.green} />
    <P d="M-40 190 C-20 160 20 160 40 190 L10 260 H-10Z" fill="url(#tjSkin)" w={2.4} />
    <TFace crown={kind === 'deva' ? 'kireetam' : kind === 'sage' ? 'jata' : 'none'} female={kind === 'human'} closed={bow} />
  </g>
);
const S4: React.FC<SP> = ({ u, dur }) => {
  const bow = ease(seg(u, .6, 2)) * (.8 + .2 * Math.sin(u * 1.4));
  return <>
    <Ground c={TJ.red} /><Swag />
    <Prabhavali cx={540} base={1140} w={560} h={960} t={u} />
    {G('ardhanari', <g transform="translate(540 1160) scale(.78)"><Ardhanari t={u} blink={blinkAt(u, 2)} /></g>)}
    {G('blessing', <>{Array.from({ length: 12 }, (_, i) => { const p = ((u * .35 + i / 12) % 1), an = i * .5236; return <g key={i} opacity={Math.sin(p * Math.PI)}><Gem x={540 + Math.cos(an) * (120 + p * 360)} y={700 + Math.sin(an) * (120 + p * 360) * .8} r={9} c={SIDDHI[i % 8]} t={u} ph={i} /></g>; })}</>)}
    {G('devotees', <>{([[150, 1250, 'deva', 1], [290, 1330, 'sage', 1], [140, 1440, 'human', 1], [930, 1250, 'deva', -1], [790, 1330, 'sage', -1], [940, 1440, 'human', -1]] as [number, number, 'deva' | 'sage' | 'human', number][]).map(([x, y, k, d], i) => <Devotee key={i} x={x} y={y} kind={k} bow={bow} dir={d} />)}</>)}
  </>;
};

// 5, 6 · Siddhidatri, the full portrait: lotus seat, chakra, gada, shankh, lotus; the light sweeps across the gold
const Portrait: React.FC<{ u: number; dur: number; z0: number; z1: number; nine?: number }> = ({ u, dur, z0, z1, nine = 0 }) => {
  const z = z0 + (z1 - z0) * ease(seg(u, 0, dur));
  return <>
    <Ground c={TJ.green} /><Swag />
    <g transform={`translate(540 900) scale(${z}) translate(-540 -900)`}>
      <Prabhavali cx={540} base={1420} w={860} h={1260} t={u} />
      {G('lotus', <Lotus x={540} y={1460} w={720} />)}
      {G('siddhidatri', <g transform="translate(540 1420) scale(1.28)"><Siddhidatri t={u} blink={blinkAt(u, 1.5, 4.5)} /></g>)}
    </g>
    {/* finale: the nine days' colours light up as nine gems around the arch */}
    {nine > 0 && G('nine', <>{days.map((d, i) => { const an = Math.PI * (1.05 + .9 * i / 8), on = seg(nine, i / 10, i / 10 + .12); return <g key={i} opacity={on} transform={`translate(${540 + Math.cos(an) * 470} ${900 + Math.sin(an) * 560})`}><circle r={40} fill="url(#tjLight)" /><Gem x={0} y={0} r={22} c={d.colour.hex} t={u} ph={i} /></g>; })}</>)}
  </>;
};
const S5: React.FC<SP> = ({ u, dur }) => <Portrait u={u} dur={dur} z0={1.08} z1={1} />;
const S6: React.FC<SP> = ({ u, dur }) => <Portrait u={u + 6} dur={dur} z0={1} z1={1} />;
const S7: React.FC<SP> = ({ u, dur }) => <Portrait u={u + 12} dur={dur} z0={1} z1={.86} nine={seg(u, 0, dur * .8)} />;

export const DAY9 = { page: 'tanjore' as const, scenes: [S0, S1, S2, S3, S4, S5, S6, S7], moralFrom: 6 };
