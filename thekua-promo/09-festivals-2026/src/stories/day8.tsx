import React from 'react';
import { seg, ease } from '../styles/pahari/rand';
import { MY, L, Ln, Gesso, MyFace, Bloom, circle, lens, tube } from '../styles/mysore/kit';
import { MyDevi, Nandi } from '../styles/mysore/figures';
import { ArchScene } from '../sheets/MysoreSheets';
import type { SP } from './day1';

// Day 8 · भीतर का तेज़ (Mysore painting). Framing rule: the radiance is inner light, the fruit of tapasya. Her complexion
// never changes; the glow is added as light (bloom behind, veil of light over), and only her garment turns white.
const G = (id: string, c: React.ReactNode) => <g data-kind="graphic" data-id={id}>{c}</g>;
const blinkAt = (u: number, ...ts: number[]) => Math.max(0, ...ts.map((b) => 1 - Math.abs(u - b) / .09));
const Hills: React.FC<{ c?: string }> = ({ c = MY.sageDeep }) => <L d="M60 1100 C260 1020 420 1060 540 1010 C680 950 860 1030 1020 990 V1330 H60Z" fill={c} />;
const Tapas: React.FC<{ u: number; y?: number; s?: number }> = ({ u, y = 1280, s = 1.3 }) => G('parvati', <g transform={`translate(540 ${y}) scale(${s})`}><MyDevi tapas t={u} /></g>);

// 0 · title: the empty arch at dusk, Nandi resting, a lotus pool
const S0: React.FC<SP> = ({ u }) => <ArchScene sky={MY.purple}>
  <Hills c={MY.sage} />
  <Bloom x={540} y={760} r={260} a={.5 + .1 * Math.sin(u)} />
  {G('nandi', <g transform="translate(560 1230) scale(1.05)"><Nandi blink={blinkAt(u, 2)} /></g>)}
</ArchScene>;

// 1 · tapas through sun, rain and wind
const S1: React.FC<SP> = ({ u, dur }) => {
  const ph = u / dur, sun = 1 - seg(ph, .3, .4), rain = seg(ph, .3, .4) * (1 - seg(ph, .63, .72)), wind = seg(ph, .63, .72);
  return <ArchScene sky={sun > .5 ? '#C7A77A' : MY.blueDeep}>
    <Hills />
    <g opacity={sun}>{G('sun', <><circle cx={820} cy={560} r={70} fill="#E9B45A" stroke={MY.line} strokeWidth={2} />{Array.from({ length: 12 }, (_, i) => <Ln key={i} d={`M${820 + Math.cos(i * .5236) * 86} ${560 + Math.sin(i * .5236) * 86} l${Math.cos(i * .5236) * 30} ${Math.sin(i * .5236) * 30}`} w={4} c="#E9B45A" />)}</>)}</g>
    <g opacity={rain}>{Array.from({ length: 70 }, (_, i) => { const x = 80 + (i * 97) % 920, y = 80 + ((i * 211 + u * 900) % 1200); return <Ln key={i} d={`M${x} ${y} l-14 60`} w={2} c={MY.white} op={.5} />; })}</g>
    <g opacity={wind}>{Array.from({ length: 14 }, (_, i) => { const x = ((i * 157 + u * 500) % 1100) - 20, y = 300 + (i * 83) % 800; return <L key={i} d={lens(x, y, x + 30, y - 10, 8)} fill={i % 2 ? MY.ochre : MY.sage} w={1.4} />; })}{[0, 1, 2].map((k) => <Ln key={k} d={`M${100 + ((u * 300 + k * 300) % 900)} ${500 + k * 220} q60 -30 120 0 t120 0`} w={3} c={MY.white} op={.5} />)}</g>
    <Tapas u={u} />
  </ArchScene>;
};

// 2 · the seasons pass in soft muted tones; she stays still
const SEASONS = [MY.sage, '#C9A46A', '#E8E4DA', MY.sage];
const mix = (a: string, b: string, k: number) => { const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); const x = p(a), y = p(b); return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * k).toString(16).padStart(2, '0')).join(''); };
const S2: React.FC<SP> = ({ u, dur }) => {
  const f = Math.min(2.999, (u / dur) * 3), i = Math.floor(f), c = mix(SEASONS[i], SEASONS[i + 1], ease(f - i)), snow = seg(f, 1.5, 2) * (1 - seg(f, 2.6, 3));
  return <ArchScene sky={mix(MY.blue, '#B9C3CC', snow)}>
    <Hills c={c} />
    <g opacity={snow}>{Array.from({ length: 50 }, (_, k) => <circle key={k} cx={80 + (k * 131) % 920} cy={80 + ((k * 173 + u * 90) % 1240)} r={4} fill={MY.white} />)}</g>
    <g opacity={seg(f, .8, 1.2) * (1 - seg(f, 1.6, 2))}>{Array.from({ length: 16 }, (_, k) => <L key={k} d={lens(100 + (k * 113) % 880, 200 + ((k * 191 + u * 120) % 1000), 124 + (k * 113) % 880, 190 + ((k * 191 + u * 120) % 1000), 7)} fill={MY.ochre} w={1.2} />)}</g>
    <Tapas u={u} />
  </ArchScene>;
};

// Shiva on a cloud, pouring the Ganga from a kalash over her head
const Cloud: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => <g transform={`translate(${x} ${y}) scale(${s})`}>{[[-90, 10, 60], [-30, -20, 70], [40, -10, 66], [100, 14, 54]].map(([cx, cy, r], i) => <L key={i} d={circle(cx, cy, r)} fill={MY.white} w={1.6} />)}</g>;
const Shiva: React.FC<{ pour: number; blink: number }> = ({ pour, blink }) => <g>
  <path d="M-80 60 C-86 120 -70 170 -50 200 L50 200 C70 170 86 120 80 60 C40 40 -40 40 -80 60Z" fill="url(#myAsh)" stroke={MY.line} strokeWidth={2} />
  <Ln d="M-70 70 C-20 130 30 170 50 196" w={3} c={MY.white} />
  <path d={tube([[70, 80, 30], [140, 80 - pour * 20, 26], [170, 40 - pour * 30, 22]])} fill="url(#myAsh)" stroke={MY.line} strokeWidth={2} />
  <g transform={`translate(176 ${30 - pour * 30}) rotate(${pour * 70})`}><L d="M-24 -10 C-30 20 -20 40 0 42 C20 40 30 20 24 -10Z" fill={MY.gold} /><L d="M-16 -10 L-10 -28 H10 L16 -10Z" fill={MY.gold} /></g>
  <path d="M-16 20 V60 H16 V20Z" fill="url(#myAsh)" stroke={MY.line} strokeWidth={1.6} />
  <g transform="translate(0 -40) scale(.62)"><MyFace crown="jata" ornaments={false} skin="url(#myAsh)" blink={blink} /></g>
  <L d="M20 -160 C50 -164 70 -140 66 -118 C60 -136 44 -148 22 -150Z" fill={MY.white} w={1.4} />
</g>;
const S3: React.FC<SP> = ({ u, dur }) => {
  const come = ease(seg(u, 0, 1.2)), pour = ease(seg(u, dur * .3, dur * .45)), flow = seg(u, dur * .42, dur * .5);
  return <ArchScene sky={MY.blue}>
    <Hills />
    {G('shiva', <g transform={`translate(${760} ${420 - (1 - come) * 200})`} opacity={come}><Cloud x={0} y={230} s={1.2} /><Shiva pour={pour} blink={blinkAt(u, 1.5)} /></g>)}
    {G('ganga', <g opacity={flow}><path d="M930 430 C860 560 640 600 566 770" stroke={MY.blueDeep} strokeWidth={34} fill="none" strokeLinecap="round" /><path d="M930 430 C860 560 640 600 566 770" stroke="#BFD6E6" strokeWidth={26} fill="none" strokeLinecap="round" />{[0, 1].map((k) => <path key={k} d={`M${926 + k * 8} ${430} C${856 + k * 8} 560 ${636 + k * 8} 600 ${562 + k * 8} 770`} stroke={MY.white} strokeWidth={4} fill="none" strokeDasharray="30 24" strokeDashoffset={-u * 200 - k * 20} strokeLinecap="round" />)}
      {Array.from({ length: 10 }, (_, k) => <circle key={k} cx={500 + (k * 37) % 90} cy={780 + ((k * 53 + u * 160) % 160)} r={5} fill={MY.white} />)}</g>)}
    <Tapas u={u} />
  </ArchScene>;
};

// 4 · the light rises from within: bloom behind, a veil of light over her; her garment turns white, her skin stays
const S4: React.FC<SP> = ({ u, dur }) => {
  const g = ease(seg(u, .2, dur * .7)), swap = ease(seg(u, dur * .45, dur * .8));
  return <ArchScene sky={mix(MY.blueDeep, MY.purple, g)}>
    <Hills c={mix(MY.sageDeep, MY.sage, g)} />
    <Bloom x={540} y={900} r={200 + 360 * g} a={g} />
    {G('rays', <g opacity={g * .6}>{Array.from({ length: 16 }, (_, k) => <Ln key={k} d={`M${540 + Math.cos(k * .3927 + u * .1) * 220} ${860 + Math.sin(k * .3927 + u * .1) * 220} L${540 + Math.cos(k * .3927 + u * .1) * (300 + 160 * g)} ${860 + Math.sin(k * .3927 + u * .1) * (300 + 160 * g)}`} w={3} c={MY.moon} />)}</g>)}
    <g opacity={1 - swap}><Tapas u={u} /></g>
    <g opacity={swap}>{G('mahagauri', <g transform="translate(540 1280) scale(1.3)"><MyDevi t={u} blink={blinkAt(u, dur - .7)} /></g>)}</g>
  </ArchScene>;
};

// 5, 6 · Mahagauri with Nandi: the full portrait
const Portrait: React.FC<{ u: number; dur: number; z0: number; z1: number }> = ({ u, dur, z0, z1 }) => {
  const z = z0 + (z1 - z0) * ease(seg(u, 0, dur));
  return <g transform={`translate(540 900) scale(${z}) translate(-540 -900)`}><ArchScene sky={MY.purple} front={G('nandi', <g transform="translate(560 1500) scale(1.05)"><Nandi blink={blinkAt(u, 2.5)} /></g>)}>
    <Bloom x={540} y={820} r={480} a={.85 + .1 * Math.sin(u * 1.3)} />
    <circle cx={540} cy={610} r={150} fill={MY.moon} opacity={.4} />
    {G('pedestal', <g transform="translate(540 1230)"><L d="M-240 0 C-240 -50 240 -50 240 0 L220 60 H-220Z" fill={MY.rose} /><Gesso d="M-240 0 C-240 -50 240 -50 240 0 C160 -26 -160 -26 -240 0Z" /></g>)}
    {G('mahagauri', <g transform="translate(540 1212) scale(1.3)"><MyDevi t={u} blink={blinkAt(u, 1.2, 4)} /></g>)}
  </ArchScene></g>;
};
const S5: React.FC<SP> = ({ u, dur }) => <Portrait u={u} dur={dur} z0={1.06} z1={1} />;
const S6: React.FC<SP> = ({ u, dur }) => <Portrait u={u + 6} dur={dur} z0={1} z1={1} />;

export const DAY8 = { page: 'mysore' as const, scenes: [S0, S1, S2, S3, S4, S5, S6], moralFrom: 6 };
