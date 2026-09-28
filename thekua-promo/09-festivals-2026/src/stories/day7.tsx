import React from 'react';
import { L, GLOW } from '../styles/shadow/palette';
import { Leather, DotLine, Dots, Rosette, tube, arcPts, along } from '../styles/shadow/leather';
import { Rig, Part } from '../styles/shadow/rig';
import { humanoid } from '../styles/shadow/humanoid';
import { banner } from '../styles/shadow/props';
import { seg, ease, rng } from '../styles/pahari/rand';
import { onTwos } from '../shared/film';
import days from '../../data/navratri-days.json';
import type { SP } from './day1';

// Day 7 · शुभंकरी (Tholu Bommalata, night variant): darker screen, fewer colours; the Devi's three eyes and necklace
// glow through perforations. Raktabeej's drops are dark embers, never blood.
export const NIGHT = { lit: .62, spread: .8 };
const RAKTA = humanoid({ name: 'raktabeej', skin: '#5A3432', dhoti: L.black, hem: L.maroon, sash: L.vermilion, head: 'human', crown: 'tall', mustache: true, weapon: 'mace' });
const CHILD = humanoid({ name: 'child', skin: L.gold, dhoti: L.leaf, hem: L.turmeric, sash: L.vermilion, head: 'human' });

// Kalaratri: dark leather, loose hair spread behind, third eye and necklace cut through (they glow), two extra arms
// holding the sickle-sword and the vajra; near hand in abhaya, far hand in varada.
const DEVI_BASE = humanoid({ name: 'kalaratri', skin: '#2E2A36', dhoti: '#5A5E66', hem: L.indigo, sash: L.maroon, head: 'human', crown: 'tall' });
const hair: Part = {
  id: 'hair', at: [-10, -470], behind: true,
  draw: (k) => <Leather id={k} d="M0 -20 C-80 -40 -170 20 -200 140 C-220 240 -190 360 -150 440 C-130 380 -120 300 -100 240 C-110 330 -80 400 -40 450 C-40 360 -30 260 -10 180 C0 100 20 30 0 -20 Z" fill={L.black} alpha={.95} holes={<DotLine pts={[[-120, 60], [-160, 220], [-140, 380]]} step={18} r={3} />} />,
};
const extraArm = (id: string, at: [number, number], rot: number, item: 'sickle' | 'vajra'): Part => ({
  id, at, rot, rivet: true, behind: true,
  draw: (k) => <Leather id={k} d={tube([[0, 0, 32], [4, 120, 26], [6, 230, 20]])} fill="#2E2A36" holes={<DotLine pts={[[-8, 200], [8, 200]]} step={6} r={2.4} />} />,
  children: [{
    id: id + 'Item', at: [6, 240], rot: -rot,
    draw: (k) => item === 'sickle'
      ? <Leather id={k} d="M-5 40 L-5 -40 C-10 -120 40 -180 110 -170 C60 -150 20 -110 8 -40 L5 40 Z" fill="#8A8C90" holes={<DotLine pts={[[0, -40], [30, -120], [80, -160]]} step={14} r={2.4} />} />
      : <Leather id={k} d="M-8 -12 H8 V12 H-8 Z M0 -12 C-22 -40 -16 -80 0 -110 C16 -80 22 -40 0 -12 Z M0 12 C-22 40 -16 80 0 110 C16 80 22 40 0 12 Z" fill={L.turmeric} holes={<Dots pts={[[0, -60], [0, 60]]} r={5} />} />,
  }],
});
function withKids(base: Part, kids: Part[]): Part { return { ...base, children: [...kids, ...(base.children || [])] }; }
const DEVI = withKids(DEVI_BASE, [hair, extraArm('arm3', [-30, -300], -150, 'sickle'), extraArm('arm4', [30, -300], -40, 'vajra')]);

// the glowing necklace and third eye, laid over the torso/head in screen space (light through perforations)
const DeviGlow: React.FC<{ a: number }> = ({ a }) => a <= 0 ? null : (
  <g opacity={a} style={{ mixBlendMode: 'screen' }} data-kind="graphic" data-id="devi-glow">
    {arcPts(4, -334, 60, 80, Math.PI * .2, Math.PI * .85, 14).map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r={11} fill="#BFE0FF" opacity={.55} filter="url(#holeBloom)" /><circle cx={x} cy={y} r={4} fill="#F4FAFF" /></g>)}
    <circle cx={30} cy={-530} r={10} fill="#FFD9A0" opacity={.6} filter="url(#holeBloom)" /><circle cx={30} cy={-530} r={4} fill="#FFF3D0" />
  </g>
);
// breath of fire: a flickering leather flame from the mouth
const Breath: React.FC<{ t: number; a: number }> = ({ t, a }) => a <= 0 ? null : (
  <g opacity={a} transform={`translate(70 -500) rotate(${-10 + 4 * Math.sin(t * 9)})`}>
    <Leather id={'breath' + Math.floor(t * 12)} d="M0 0 C40 -20 90 -10 120 -30 C100 0 110 20 140 30 C100 34 60 20 0 12 Z" fill={L.vermilion} alpha={.7} holes={<Dots pts={[[60, 0], [90, 6]]} r={4} />} />
  </g>
);

const Donkey: React.FC = () => (
  <g data-kind="graphic" data-id="donkey">
    <Leather id="donkey" d="M-230 -40 C-230 -120 -120 -130 40 -120 C100 -118 140 -140 170 -200 C180 -250 200 -300 220 -300 C236 -270 228 -230 240 -200 C270 -170 280 -130 260 -110 C240 -94 210 -100 190 -80 C170 -20 170 40 150 60 L130 180 L108 180 L112 60 C60 70 -40 70 -120 60 L-130 180 L-152 180 L-160 50 C-200 30 -230 0 -230 -40 Z M-230 -60 C-270 -40 -280 20 -270 60 L-258 60 C-262 20 -250 -20 -226 -40 Z" fill="#6E6A66" alpha={.9}
      holes={<><DotLine pts={[[-200, -80], [0, -96], [140, -120]]} step={16} r={3} /><Rosette x={-60} y={-20} r={18} /><circle cx={214} cy={-190} r={6} /></>} />
  </g>
);

const Puppet: React.FC<{ part: Part; x: number; y: number; s?: number; flip?: boolean; pose?: Record<string, number>; k: string; op?: number }> = ({ part, x, y, s = .8, flip, pose, k, op = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`} opacity={op}><Rig part={part} pose={pose} k={k} rivetR={7} /></g>
);
const sway = (t: number, a = 6) => Math.sin(onTwos(t) * 2.2) * a;

// ember falling from Raktabeej: dark at first; `light` 0..1 turns it into harmless light
const Ember: React.FC<{ x: number; y: number; light?: number }> = ({ x, y, light = 0 }) => (
  <g data-kind="graphic" data-id="ember">
    {light < 1 && <circle cx={x} cy={y} r={9} fill="#3A1A10" opacity={1 - light} />}
    {light > 0 && <><circle cx={x} cy={y} r={22 * light} fill={GLOW} opacity={.5 * light} filter="url(#holeBloom)" /><circle cx={x} cy={y} r={6} fill="#FFF3C8" opacity={light} /></>}
  </g>
);

const D7 = days[6];
const S0: React.FC<SP> = () => {
  const b = banner(760, 330, L.maroon, [
    { text: D7.story.titleHi, size: 92, y: -50 },
    { text: 'तोलु बोम्मलाटा छाया कठपुतली शैली में · आंध्र प्रदेश', size: 30, y: 30 },
    { text: 'नवरात्रि · नौ देवियाँ, नौ कलाएँ · दिन ७', size: 28, y: 90 },
  ], 'placard');
  return <g transform="translate(540 700)"><Rig part={b} k="placard" /></g>;
};

// Raktabeej: every drop that falls becomes another Raktabeej (dark embers)
const S1: React.FC<SP> = ({ t, u }) => {
  const r = rng(3), clones = Math.min(3, Math.floor(seg(u, 1.5, 5) * 4));
  return <>
    <Puppet part={RAKTA} x={420} y={900} k="rk" pose={{ frontArm: -60 + sway(t, 10), backArm: 20 + sway(t, 6) }} />
    {Array.from({ length: 6 }, (_, i) => { const t0 = .8 + i * .7, p = seg(u, t0, t0 + .9); return p > 0 && p < 1 ? <Ember key={i} x={500 + i * 40 + r() * 20} y={820 + p * 400} /> : null; })}
    {Array.from({ length: clones }, (_, i) => <Puppet key={i} part={RAKTA} x={640 + i * 120} y={1000 + (i % 2) * 20} s={.5} k={'c' + i} pose={{ frontArm: -40 + sway(t + i, 8) }} />)}
  </>;
};
// they multiply across the screen
const Crowd: React.FC<{ t: number; n: number; fade?: number }> = ({ t, n, fade = 0 }) => <>{Array.from({ length: n }, (_, i) => {
  const x = 120 + (i % 6) * 160, y = 980 + Math.floor(i / 6) * 180 - (i % 2) * 30;
  return <Puppet key={i} part={RAKTA} x={x} y={y} s={.42} k={'cr' + i} op={1 - fade} pose={{ frontArm: -50 + sway(t + i * .7, 12), backArm: 30 + sway(t + i, 8) }} />;
})}</>;
const S2: React.FC<SP> = ({ t, u }) => <Crowd t={t} n={Math.min(12, 4 + Math.floor(u * 2.4))} />;

// the lamp dims; the Devi appears: dark, loose hair, three eyes, necklace glowing, fire in her breath
const Devi: React.FC<{ t: number; x?: number; s?: number; glow?: number; fire?: number; pose?: Record<string, number> }> = ({ t, x = 560, s = .9, glow = 1, fire = 0, pose }) => (
  <g transform={`translate(${x} 860) scale(${s})`}>
    <Rig part={DEVI} k="devi" rivetR={7} pose={{ frontArm: -150 + sway(t, 4), frontFore: -30, backArm: 30, arm3: -150 + sway(t, 5), arm4: -40 - sway(t, 5), ...pose }} />
    <DeviGlow a={glow} />
    <Breath t={t} a={fire} />
  </g>
);
const S3: React.FC<SP> = ({ t, u }) => <><g opacity={.6}><Crowd t={t} n={12} /></g><g opacity={ease(seg(u, .6, 2))}><Devi t={t} fire={seg(u, 2, 3)} /></g></>;

// every falling ember becomes light before it touches the ground; the clones fade; Raktabeej vanishes
const S4: React.FC<SP> = ({ t, u }) => {
  const r = rng(8);
  return <>
    <Crowd t={t} n={12} fade={seg(u, 1.6, 3.6)} />
    <Devi t={t} x={540} fire={1 - seg(u, 3, 4)} />
    {Array.from({ length: 14 }, (_, i) => { const t0 = .2 + i * .3, p = seg(u, t0, t0 + 1.2); return p > 0 && p < 1 ? <Ember key={i} x={140 + r() * 800} y={700 + p * 560} light={seg(p, .35, .7)} /> : null; })}
  </>;
};

// the lamp brightens; the Devi raises her hand in blessing over a frightened child, who smiles
const S5: React.FC<SP> = ({ t, u }) => <>
  <g transform="translate(560 1296) scale(.8)"><Donkey /></g>
  <Devi t={t} x={520} s={.82} pose={{ frontArm: -120 + sway(t, 3), frontFore: -60 }} />
  <Puppet part={CHILD} x={860} y={1080} s={.45} flip k="child" pose={{ neck: u > 2.2 ? 0 : 14, frontArm: u > 2.2 ? -40 : 20 }} />
</>;
const S6: React.FC<SP> = ({ t }) => <><g transform="translate(560 1296) scale(.8)"><Donkey /></g><Devi t={t} x={520} s={.82} pose={{ frontArm: -120 + sway(t, 3), frontFore: -60 }} /></>;

// lamp level per scene (night variant; dims when the Devi appears, brightens at the blessing)
export const litFor = (idx: number, u: number) => idx === 0 ? seg(u, 0, 1.4) * NIGHT.lit : idx === 3 ? NIGHT.lit - .2 * seg(u, 0, 1) : idx === 4 ? NIGHT.lit - .2 : idx >= 5 ? NIGHT.lit - .2 + .45 * seg(u, 0, 1.5) : NIGHT.lit;
export const DAY7 = { page: 'shadow' as const, scenes: [S0, S1, S2, S3, S4, S5, S6], moralFrom: 6 };
