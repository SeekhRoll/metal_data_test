import React from 'react';
import { seg, ease } from '../styles/pahari/rand';
import { KM, M, circ, ell, Foliage, FrontHead, Necklaces, Limb, KLotus } from '../styles/kerala/kit';
import { Skandamata, MuralLion, Tarakasura } from '../sheets/KeralaSheets';
import type { SP } from './day1';

// Day 5 · माँ की ममता (Kerala mural). Dense foliage ground; large frontal figures; a slow camera over the wall.
const G = (id: string, c: React.ReactNode) => <g data-kind="graphic" data-id={id}>{c}</g>;
const blinkAt = (u: number, ...ts: number[]) => Math.max(0, ...ts.map((b) => 1 - Math.abs(u - b) / .09));
const Leaves: React.FC<{ seed: number }> = ({ seed }) => <Foliage x={60} y={60} w={960} h={1520} seed={seed} n={230} />;
const cam = (u: number, dur: number, s0: number, s1: number, cx = 540, cy = 800) => {
  const s = s0 + (s1 - s0) * ease(seg(u, 0, dur)); return `translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})`;
};

// lotus pond, the lion resting beside it; the title panel sits in the sky
const Pond: React.FC<{ y: number }> = ({ y }) => <>
  <M d={`M60 ${y} C300 ${y - 30} 780 ${y - 30} 1020 ${y} V1580 H60Z`} fill={KM.green} shade={KM.greenDeep} w={4} />
  {[0, 1, 2, 3].map((k) => <path key={k} d={`M${120 + k * 30} ${y + 60 + k * 90} C400 ${y + 40 + k * 90} 680 ${y + 80 + k * 90} ${960 - k * 30} ${y + 60 + k * 90}`} stroke={KM.greenLite} strokeWidth={5} fill="none" />)}
</>;
const S0: React.FC<SP> = ({ u, dur }) => <>
  <Leaves seed={11} /><Pond y={1180} />
  <g transform={cam(u, dur, 1, 1.05, 540, 1100)}>
    {G('lotuses', <>{[[180, 1250, 1.3], [880, 1270, 1.2], [360, 1420, 1], [720, 1440, 1.1]].map(([x, y, s], i) => <KLotus key={i} x={x} y={y} s={s * ease(seg(u, .3 + i * .25, 1 + i * .25))} />)}</>)}
    {G('lion', <g transform="translate(470 1010) scale(.85)"><MuralLion /></g>)}
  </g>
</>;

// Tarakasura: the wall's full height; frightened devas peer out of the foliage
const Deva: React.FC<{ x: number; y: number; s: number; skin: string; hide: number }> = ({ x, y, s, skin, hide }) => (
  <g transform={`translate(${x} ${y + hide * 30}) scale(${s})`}><FrontHead skin={skin} crown="karanda" female={false} smile={false} /></g>
);
const S1: React.FC<SP> = ({ u, dur }) => {
  const shake = Math.sin(u * 30) * 2 * seg(u, dur * .55, dur * .6) * (1 - seg(u, dur * .7, dur * .8));
  return <>
    <Leaves seed={7} />
    <g transform={cam(u, dur, 1.08, .98, 540, 700)}>{G('taraka', <g transform={`translate(${540 + shake} 560) scale(.95)`}><Tarakasura t={u} blink={blinkAt(u, 1.6, 4.1)} /></g>)}</g>
    {G('devas', <>{[[140, 1450, KM.skinGreen], [300, 1500, KM.skin], [780, 1500, KM.skin], [940, 1450, KM.skinGreen]].map(([x, y, c], i) => <Deva key={i} x={x as number} y={y as number} s={.45} skin={c as string} hide={ease(seg(u, dur * .55 + i * .08, dur * .7))} />)}</>)}
  </>;
};

// birth: six babies on six lotuses in the Saravana pool, drawn together into one six-faced child in a blaze of light
const Baby: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <M d="M-40 0 C-48 44 -30 64 0 64 C30 64 48 44 40 0 C26 -12 -26 -12 -40 0Z" fill={KM.skin} shade={KM.redDeep} w={3} />
    <M d="M-36 38 H36 V58 H-36Z" fill={KM.green} w={2.4} />
    <g transform="translate(0 -34) scale(.34)"><FrontHead skin={KM.skin} crown="karanda" female={false} /></g>
  </g>
);
const Skanda6: React.FC<{ s?: number; blink?: number }> = ({ s = 1, blink = 0 }) => (
  <g transform={`scale(${s})`}>
    <M d="M-60 0 C-72 60 -46 90 0 90 C46 90 72 60 60 0 C40 -16 -40 -16 -60 0Z" fill={KM.skin} shade={KM.redDeep} w={3} />
    <M d="M-54 54 H54 V82 H-54Z" fill={KM.red} w={2.4} />
    {[-1, 1].map((k) => <M key={k} d={`M${k * 24 - 16} 84 L${k * 34 - 18} 150 L${k * 34 + 14} 150 L${k * 24 + 16} 84Z`} fill={KM.skin} shade={KM.redDeep} w={2.6} />)}
    {[[-84, -70, .3], [84, -70, .3], [-46, -84, .34], [46, -84, .34], [0, -120, .36], [0, -60, .42]].map(([x, y, h], i) => <g key={i} transform={`translate(${x} ${y}) scale(${h})`}><FrontHead skin={KM.skin} crown="karanda" female={false} blink={blink} /></g>)}
  </g>
);
const S2: React.FC<SP> = ({ u, dur }) => {
  const join = ease(seg(u, dur * .45, dur * .8)), glow = seg(u, 0, 1.2);
  return <>
    <Leaves seed={19} /><Pond y={1000} />
    {G('blaze', <g opacity={glow}><M d={circ(540, 900, 330)} fill={KM.yellowHi} shade={KM.yellow} w={4} />{Array.from({ length: 28 }, (_, i) => { const a = i / 28 * Math.PI * 2 + u * .15; return <M key={i} d={`M${540 + Math.cos(a) * 326} ${900 + Math.sin(a) * 326} L${540 + Math.cos(a + .06) * 390} ${900 + Math.sin(a + .06) * 390} L${540 + Math.cos(a + .12) * 326} ${900 + Math.sin(a + .12) * 326}Z`} fill={KM.red} w={2} />; })}</g>)}
    {G('babies', <>{Array.from({ length: 6 }, (_, i) => {
      const a = -Math.PI / 2 + i / 6 * Math.PI * 2, r = 250 * (1 - join), x = 540 + Math.cos(a) * r, y = 900 + Math.sin(a) * r;
      return <g key={i} transform={`translate(${x} ${y})`} opacity={(1 - seg(u, dur * .72, dur * .8)) * ease(seg(u, .4 + i * .2, .9 + i * .2))}><KLotus x={0} y={78} s={1.1} /><Baby s={1.25} /></g>;
    })}</>)}
    {G('skanda', <g transform="translate(540 880)" opacity={seg(u, dur * .74, dur * .84)}><KLotus x={0} y={150} s={1.8} /><Skanda6 s={1.3} blink={blinkAt(u, dur - .8)} /></g>)}
  </>;
};

// the mother raises him: portrait crop on the mother and child
const S3: React.FC<SP> = ({ u, dur }) => <>
  <Leaves seed={3} />
  <g transform={cam(u, dur, 1.55, 1.4, 600, 760)}>{G('skandamata', <g transform="translate(540 640) scale(1.02)"><Skandamata t={u} blink={blinkAt(u, 1.2, 3.4)} /></g>)}</g>
</>;

// the general: young Skanda on the peacock, vel in hand; the spear flies and Tarakasura falls
const Tail: React.FC<{ fan: number }> = ({ fan }) => {
  const R = 400 * fan, a0 = Math.PI * 1.02, a1 = Math.PI * 1.98;
  return <>
    <M d={`M0 0 L${Math.cos(a0) * R} ${Math.sin(a0) * R} A${R} ${R} 0 0 1 ${Math.cos(a1) * R} ${Math.sin(a1) * R}Z`} fill={KM.green} shade={KM.greenDeep} w={4} />
    {[.55, .8, .97].map((f, ring) => Array.from({ length: 7 + ring * 4 }, (_, i) => { const a = a0 + (a1 - a0) * (i + .5) / (7 + ring * 4), x = Math.cos(a) * R * f, y = Math.sin(a) * R * f;
      return <g key={ring + '-' + i}><path d={`M0 0 L${x} ${y}`} stroke={KM.greenDeep} strokeWidth={3} /><M d={ell(x, y, 26, 32)} fill={KM.greenLite} w={2.6} /><M d={ell(x, y + 4, 15, 19)} fill={KM.yellow} w={2} /><M d={circ(x, y + 6, 8)} fill={KM.black} w={0} /></g>; }))}
  </>;
};
const Peacock: React.FC = () => <>
  <M d="M-120 40 C-140 -20 -40 -60 40 -40 C100 -24 110 30 60 70 C10 100 -90 90 -120 40Z" fill={KM.green} shade={KM.greenDeep} w={4} />
  <M d="M40 -40 C60 -110 100 -150 130 -160 C152 -166 164 -148 150 -134 C130 -120 100 -90 90 -30Z" fill={KM.green} shade={KM.greenDeep} w={4} />
  <M d={circ(136, -148, 8)} fill={KM.white} w={2} /><M d="M152 -148 L180 -140 L152 -136Z" fill={KM.yellow} w={2} />
  {[-1, 0, 1].map((k) => <path key={k} d={`M${130 + k * 8} -164 l${k * 8} -30`} stroke={KM.black} strokeWidth={3} />)}
  {[-40, 20].map((x) => <path key={x} d={`M${x} 80 V150 l-16 10 M${x} 150 l16 10`} stroke={KM.yellow} strokeWidth={7} fill="none" />)}
</>;
const YoungSkanda: React.FC<{ throwK: number; blink: number }> = ({ throwK, blink }) => <>
  <Limb pts={[[-70, 60, 40], [-120, 150, 32], [-80, 220, 26]]} skin={KM.skin} />
  <M d="M-80 40 C-90 120 -80 190 -60 230 L60 230 C80 190 90 120 80 40 C50 24 -50 24 -80 40Z" fill={KM.skin} shade={KM.redDeep} w={4} />
  <Necklaces y={40} w={140} />
  <M d="M-70 220 C-110 260 -130 330 -100 360 L100 360 C130 330 110 260 70 220Z" fill={KM.red} shade={KM.redDeep} w={4} />
  <path d="M-110 300 H110" stroke={KM.yellow} strokeWidth={8} />
  <Limb pts={[[70, 60, 40], [150 - throwK * 20, 10 - throwK * 40, 32], [160 + throwK * 40, -70 - throwK * 20, 26]]} skin={KM.skin} />
  <g transform="translate(0 -20)"><FrontHead skin={KM.skin} crown="karanda" female={false} blink={blink} s={.62} /></g>
</>;
const Vel: React.FC = () => <><path d="M-220 0 H40" stroke={KM.black} strokeWidth={12} /><path d="M-220 0 H40" stroke={KM.yellow} strokeWidth={6} /><M d="M40 0 C60 -30 100 -30 150 0 C100 30 60 30 40 0Z" fill={KM.white} shade={KM.yellow} w={3} /></>;
const S4: React.FC<SP> = ({ u, dur }) => {
  const fly = ease(seg(u, dur * .45, dur * .62)), fall = ease(seg(u, dur * .6, dur * .85)), throwK = seg(u, dur * .38, dur * .46);
  return <>
    <Leaves seed={23} />
    {G('taraka', <g transform={`translate(${800 + fall * 60} ${420 + fall * 260}) rotate(${fall * 28}) scale(${.48 * (1 - fall * .15)})`} opacity={1 - seg(u, dur * .85, dur)}><Tarakasura t={u} /></g>)}
    {G('skanda-peacock', <g transform="translate(380 1110) scale(.9)"><g transform="translate(0 130)"><Tail fan={.5 + .5 * ease(seg(u, 0, 1.4))} /></g><g transform="translate(0 250)"><Peacock /></g><g transform="translate(0 -170)"><YoungSkanda throwK={throwK} blink={blinkAt(u, 1.1)} /></g></g>)}
    {fly < 1 && G('vel', <g transform={`translate(${540 + fly * 300} ${860 - fly * 260}) rotate(-40)`} opacity={seg(u, dur * .44, dur * .46)}><Vel /></g>)}
    {G('flash', <g opacity={seg(u, dur * .6, dur * .63) * (1 - seg(u, dur * .66, dur * .8))}><M d={circ(830, 560, 150)} fill={KM.yellowHi} w={0} /></g>)}
  </>;
};

// Skandamata: the full devotional image, lotus seat, lion before her
const Portrait: React.FC<{ u: number; dur: number; z0: number; z1: number }> = ({ u, dur, z0, z1 }) => <>
  <Leaves seed={3} />
  <g transform={cam(u, dur, z0, z1, 540, 900)}>
    {G('skandamata', <g transform="translate(540 640) scale(1.02)"><Skandamata t={u} blink={blinkAt(u, 1.5, 4)} /></g>)}
    {G('lion', <g transform="translate(420 1330) scale(.8)"><MuralLion /></g>)}
  </g>
</>;
const S5: React.FC<SP> = ({ u, dur }) => <Portrait u={u} dur={dur} z0={1.12} z1={1} />;
const S6: React.FC<SP> = ({ u, dur }) => <Portrait u={u + 6} dur={dur} z0={1} z1={1} />;

export const DAY5 = { page: 'kerala' as const, scenes: [S0, S1, S2, S3, S4, S5, S6], moralFrom: 6 };
