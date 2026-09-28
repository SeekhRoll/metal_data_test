import React from 'react';
import { seg, ease } from '../styles/pahari/rand';
import { BP, F, Ln, PatFace, Flower, Scatter, circle } from '../styles/bengalpat/kit';
import { Katyayani, PatLion, Mahisha, Buffalo, Elephant, Sage, Hut, Tree } from '../styles/bengalpat/figures';
import type { SP } from './day1';

// Day 6 · अन्याय का अंत (Bengal Patachitra). One scroll panel per scene; formatA's 'bengal' page scrolls the camera down
// from panel to panel. Each scene draws its own panel in panel space: 60..1020 wide, 0..1590 tall.
const G = (id: string, c: React.ReactNode) => <g data-kind="graphic" data-id={id}>{c}</g>;
const blinkAt = (u: number, ...ts: number[]) => Math.max(0, ...ts.map((b) => 1 - Math.abs(u - b) / .09));
const Ground: React.FC<{ c?: string }> = ({ c = BP.ground }) => <rect x={60} y={0} width={960} height={1590} fill={c} />;
const Earth: React.FC<{ y?: number; c?: string }> = ({ y = 1380, c = BP.green }) => <><F d={`M60 ${y} C300 ${y - 30} 780 ${y - 30} 1020 ${y} V1590 H60Z`} fill={c} />{[180, 420, 700, 900].map((x, i) => <Flower key={i} x={x} y={y + 90 + (i % 2) * 50} r={14} c={[BP.red, BP.white][i % 2]} />)}</>;

// the Devi on her lion (panel-space placement shared by several panels)
const Rider: React.FC<{ x: number; y: number; s: number; t: number; blink?: number; swordUp?: number; step?: number }> = ({ x, y, s, t, blink = 0, swordUp = 1, step = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}><PatLion step={step} /><g transform="translate(-80 -270) scale(1.04)"><Katyayani t={t} blink={blink} swordUp={swordUp} /></g></g>
);

// 0 · opening: "suno, suno": lotus bank, the lion waiting, flowers; the title card sits above
const S0: React.FC<SP> = ({ u, dur }) => <>
  <Ground c={BP.paper} /><Earth y={1180} />
  {G('flowers', <Scatter x={100} y={560} w={880} h={380} n={12} seed={6} />)}
  {G('lion', <g transform={`translate(${520 + Math.sin(u * 2) * 4} 1420) scale(.95)`}><PatLion step={u * .6} roar={seg(u, dur * .5, dur * .6) * (1 - seg(u, dur * .7, dur * .8))} /></g>)}
</>;

// 1 · Mahishasura rampages; the devas flee
const S1: React.FC<SP> = ({ u, dur }) => {
  const stomp = Math.abs(Math.sin(u * 3)), run = ease(seg(u, .4, dur));
  return <>
    <Ground /><Earth y={1340} c={BP.orange} />
    {G('buffalo', <g transform={`translate(${760 - u * 10} 1420) scale(.95)`}><Buffalo step={u * 1.2} /></g>)}
    {G('mahisha', <g transform={`translate(420 ${1480 - stomp * 10}) scale(1.02)`}><Mahisha stomp={stomp} blink={blinkAt(u, 1.4)} /></g>)}
    {G('devas', <>{[[860, 260, BP.pink], [950, 420, BP.blue], [800, 560, BP.white]].map(([x, y, c], i) => <g key={i} transform={`translate(${(x as number) + run * 260} ${(y as number) - run * 40}) scale(.34)`} opacity={1 - seg(u, dur * .7, dur)}><PatFace skin={c as string} female={false} crown="jata" /></g>)}</>)}
  </>;
};

// 2 · the sage Katyayana, years of tapas at his ashram
const S2: React.FC<SP> = ({ u, dur }) => <>
  <Ground c={BP.blue} /><Earth y={1300} />
  {G('tree', <g transform="translate(200 1330)"><Tree s={1.3} /></g>)}
  {G('hut', <g transform="translate(840 1300)"><Hut /></g>)}
  {G('sun-moon', <>{[0, 1, 2].map((k) => { const p = ((u / dur) * 1.5 + k / 3) % 1; return <g key={k} opacity={Math.sin(p * Math.PI)}>{k % 2 ? <F d={`M${150 + p * 780} ${400 - Math.sin(p * Math.PI) * 220} a40 40 0 1 0 1 0 Z`} fill={BP.white} /> : <F d={circle(150 + p * 780, 400 - Math.sin(p * Math.PI) * 220, 44)} fill={BP.yellow} />}</g>; })}</>)}
  {G('sage', <g transform="translate(540 1500) scale(1.05)"><Sage breathe={Math.sin(u * 1.4)} /></g>)}
</>;

// 3 · the devas' light meets at the ashram and Katyayani appears
const S3: React.FC<SP> = ({ u, dur }) => {
  const beams = ease(seg(u, .3, dur * .45)), born = ease(seg(u, dur * .4, dur * .7));
  const devas: [number, number, string][] = [[160, 200, BP.pink], [390, 130, BP.blue], [690, 130, BP.white], [920, 200, BP.pink], [120, 480, BP.white], [960, 480, BP.blue]];
  return <>
    <Ground c={BP.indigo} />
    {G('devas', <>{devas.map(([x, y, c], i) => <g key={i} transform={`translate(${x} ${y}) scale(.34)`}><PatFace skin={c} female={false} crown="jata" /></g>)}</>)}
    {G('beams', <g opacity={1 - seg(u, dur * .7, dur * .9)}>{devas.map(([x, y], i) => <path key={i} d={`M${x} ${y + 40} L${x + (540 - x) * beams} ${y + 40 + (820 - y - 40) * beams}`} stroke={BP.yellow} strokeWidth={14 + 6 * Math.sin(u * 8 + i)} strokeLinecap="round" />)}<F d={circle(540, 820, 120 * beams + 30 * born)} fill={BP.yellow} w={4} /></g>)}
    {G('devi', <g transform={`translate(540 1460) scale(${.4 + .45 * born})`} opacity={born}><g transform="translate(-80 -270)"><Katyayani t={u} blink={blinkAt(u, dur - .6)} /></g></g>)}
    {G('sage', <g transform="translate(870 1520) scale(.45)"><Sage /></g>)}
  </>;
};

// 4 · Mahisha shifts shape (buffalo, lion, elephant); the Devi on her lion stays calm
const S4: React.FC<SP> = ({ u, dur }) => {
  const k = Math.min(2, Math.floor(u / (dur / 3))), local = u - k * dur / 3, puff = 1 - seg(local, 0, .5);
  const forms = [<Buffalo step={u} />, <g transform="scale(-1 1)"><PatLion step={u} roar={.8} /></g>, <Elephant />];
  return <>
    <Ground /><Earth y={1340} c={BP.red} />
    {G('rider', <Rider x={360} y={1420} s={.72} t={u} blink={blinkAt(u, 1.2, 3.6)} />)}
    {G('form', <g transform={`translate(800 1420) scale(${.62 * (1 - puff * .4)})`} opacity={1 - puff * .7}>{forms[k]}</g>)}
    {G('puff', <g opacity={puff}>{[0, 1, 2, 3, 4].map((i) => <F key={i} d={circle(800 + Math.cos(i * 1.26) * 90, 1200 + Math.sin(i * 1.26) * 70, 60)} fill={BP.white} />)}</g>)}
  </>;
};

// 5 · a single flash, the asura dissolves; flowers shower; the full portrait (no gore)
const S5: React.FC<SP> = ({ u, dur }) => {
  const flash = seg(u, .2, .5) * (1 - seg(u, .6, 1.4)), gone = seg(u, .4, 1);
  return <>
    <Ground c={BP.paper} />
    {G('asura', <g opacity={1 - gone} transform="translate(820 1500) scale(.55)"><Mahisha /></g>)}
    {G('portrait', <Rider x={480} y={1440} s={1.05} t={u} blink={blinkAt(u, 2.2, dur - 1)} />)}
    {G('shower', <>{Array.from({ length: 18 }, (_, i) => { const y = ((u * 120 + i * 97) % 1400) + 60 * 0; return <Flower key={i} x={100 + (i * 173) % 880} y={40 + y * seg(u, .8, 1.6)} r={13} c={[BP.red, BP.white, BP.orange][i % 3]} />; })}</>)}
    <rect x={60} y={0} width={960} height={1590} fill={BP.white} opacity={flash} />
  </>;
};
const S6: React.FC<SP> = ({ u, dur }) => <S5 u={u + 6} dur={dur + 6} t={0} />;

export const DAY6 = { page: 'bengal' as const, scenes: [S0, S1, S2, S3, S4, S5, S6], moralFrom: 6, panelOf: [0, 1, 2, 3, 4, 5, 5] };
