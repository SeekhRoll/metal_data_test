import React from 'react';
import { C } from '../styles/madhubani/palette';
import { Bharni, Line, tube, circle } from '../styles/madhubani/paint';
import { Figure, FigureSpec, withBlink } from '../styles/madhubani/characters/parts';
import { Fish, Lotus, LotusTop, Sun, Vine, Bamboo, Peacock } from '../styles/madhubani/motifs';
import { Toran, Flower, Bird, PALACE_D } from '../styles/madhubani/extra';
import { seg, ease } from '../styles/pahari/rand';
import { blinkAt, onTwos } from '../shared/film';
import type { SP } from './day1';

// Day 3 · दूल्हा बदल गया (Madhubani, kohbar wedding variant). Figures: feet at y 0, head ≈ -900 (Madhubani units).
const Place: React.FC<{ x: number; y: number; s?: number; flip?: boolean; children: React.ReactNode; id?: string }> = ({ x, y, s = 1, flip, children, id = 'figure' }) => <g data-kind="graphic" data-id={id} transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>{children}</g>;
const G: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => <g data-kind="graphic" data-id={id}>{children}</g>;
const bl = (t: number, k: number) => blinkAt(t, k) > 0;

const maina = (pose: 'wait' | 'faint' | 'joy'): FigureSpec => ({
  kind: 'maina', lean: pose === 'faint' ? -24 : 0,
  head: { eye: pose === 'faint' ? 'closed' : 'open', mouth: pose === 'joy' ? 'smile' : pose === 'faint' ? 'open' : 'neutral', tilt: pose === 'faint' ? -18 : 0 },
  armFar: pose === 'joy' ? [[-18, -590, 0], [40, -660, 0], [70, -740, 0]] : [[-18, -590, 0], [20, -520, 0], [70, -520, 0]], handFar: pose === 'joy' ? 'up' : 'hold',
  armNear: pose === 'joy' ? [[10, -586, 0], [80, -650, 0], [120, -730, 0]] : pose === 'faint' ? [[10, -586, 0], [-10, -500, 0], [-30, -420, 0]] : [[10, -586, 0], [52, -520, 0], [96, -524, 0]], handNear: pose === 'joy' ? 'up' : 'hold',
});
const maid: FigureSpec = { kind: 'wife', head: { eye: 'open', mouth: 'neutral' }, armFar: [[-18, -590, 0], [-60, -560, 0], [-110, -560, 0]], armNear: [[10, -586, 0], [-40, -540, 0], [-100, -540, 0]], handNear: 'hold', handFar: 'hold' };
const parvati = (pose: 'stand' | 'namaskar'): FigureSpec => ({
  kind: 'parvati', head: { eye: 'open', mouth: 'smile' },
  armFar: pose === 'namaskar' ? [[-18, -590, 0], [30, -540, 0], [82, -600, 0]] : [[-18, -590, 0], [-10, -500, 0], [8, -430, 0]],
  armNear: pose === 'namaskar' ? [[10, -586, 0], [48, -536, 0], [88, -598, 0]] : [[10, -586, 0], [40, -500, 0], [80, -470, 0]], handNear: 'hold', handFar: 'hold',
});
const shiva = (kind: 'shiva' | 'groom', smile = false): FigureSpec => ({
  kind, head: { eye: 'open', mouth: smile ? 'smile' : 'neutral' },
  armFar: [[-18, -590, 0], [-10, -500, 0], [8, -430, 0]], handFar: 'hold',
  armNear: [[10, -586, 0], [96, -612, 0], [150, -690, 0]], handNear: 'up',
});
const gana = (k: number): FigureSpec => ({
  kind: 'gana', dy: k % 2 ? -40 : 0, lean: k % 2 ? 8 : -8,
  head: { eye: 'open', mouth: 'open' },
  legNear: k % 2 ? { knee: [70, -200], ankle: [110, -80], foot: -20 } : { knee: [20, -176], ankle: [16, -16] },
  legFar: k % 2 ? { knee: [-30, -170], ankle: [-40, -16] } : { knee: [-60, -200], ankle: [-100, -90], foot: -30 },
  armFar: [[-18, -590, 0], [-80, -660, 0], [-120, -760, 0]], handFar: 'up',
  armNear: [[10, -586, 0], [90, -660, 0], [130, -760, 0]], handNear: 'up',
});

// Madhubani Nandi and tiger (flat bharni fills with patterns)
const MNandi: React.FC<{ step?: number }> = ({ step = 0 }) => (
  <g>
    {[[-190, 0], [-150, 1], [150, 0], [190, 1]].map(([x, k], i) => <Line key={i} d={tube([[x, -160, 30], [x + (k === (step % 2) ? 10 : -6), -80, 24], [x, 0, 20]])} fill={C.paper} w={3} />)}
    <Bharni d="M-260 -240 C-260 -330 -120 -350 60 -340 C140 -336 190 -380 230 -420 C260 -440 300 -430 320 -390 C340 -350 330 -300 300 -280 C260 -250 220 -230 200 -170 C120 -140 -140 -140 -230 -160 C-260 -180 -262 -210 -260 -240 Z" fill={C.paper} pattern="dotsBlack" band={4} />
    <Bharni d="M-160 -330 C-80 -334 20 -334 60 -336 C70 -290 70 -230 60 -190 C-20 -186 -100 -186 -170 -190 C-176 -240 -172 -300 -160 -330 Z" fill={C.vermilion} pattern="dotsPaper" band={3} />
    <path d="M250 -420 C240 -470 260 -500 280 -510 M290 -410 C300 -460 320 -480 340 -480" stroke={C.black} strokeWidth={8} fill="none" />
    <circle cx={290} cy={-370} r={8} fill={C.black} />
  </g>
);
export const MTiger: React.FC = () => (
  <g>
    {[[-190, 0], [-150, 1], [150, 0], [190, 1]].map(([x], i) => <Line key={i} d={tube([[x, -160, 32], [x + 4, -80, 26], [x, 0, 22]])} fill={C.turmeric} w={3} />)}
    <Bharni d="M-260 -230 C-270 -320 -120 -340 60 -330 C150 -326 210 -350 250 -370 C300 -390 350 -360 350 -300 C350 -250 310 -220 260 -220 C220 -200 200 -170 190 -160 C120 -140 -140 -140 -230 -160 C-260 -180 -262 -200 -260 -230 Z" fill={C.turmeric} pattern="stripes" band={4} />
    <path d="M-260 -220 C-320 -240 -330 -320 -290 -360" stroke={C.black} strokeWidth={10} fill="none" strokeLinecap="round" />
    {/* head: round face, ears, whisker lines, stripes on the brow */}
    <Bharni d="M250 -400 C250 -470 380 -480 400 -400 C414 -340 380 -280 320 -280 C270 -282 248 -340 250 -400 Z" fill={C.turmeric} band={3.5} />
    <Line d="M262 -440 C250 -480 280 -490 292 -462 Z M372 -456 C380 -492 408 -486 398 -446 Z" fill={C.turmeric} w={3} />
    {[0, 1, 2].map((i) => <path key={i} d={`M${300 + i * 20} -450 C${304 + i * 20} -430 ${298 + i * 20} -418 ${304 + i * 20} -404`} stroke={C.black} strokeWidth={4} fill="none" />)}
    <circle cx={350} cy={-380} r={13} fill={C.paper} stroke={C.black} strokeWidth={3} /><circle cx={354} cy={-380} r={6} fill={C.black} />
    <path d="M388 -330 C396 -320 394 -306 382 -300 M330 -320 L300 -316 M330 -310 L302 -300" stroke={C.black} strokeWidth={3} fill="none" />
  </g>
);

// the ten-armed Devi: extra arms fan out behind, each holding its weapon (trishul, gada, sword, kamandalu, lotus, arrow, bow, mala)
const ITEMS = ['trishul', 'gada', 'sword', 'kamandalu', 'lotus', 'arrow', 'bow', 'mala'];
const MItem: React.FC<{ it: string }> = ({ it }) => {
  switch (it) {
    case 'trishul': return <g><path d="M0 40 V-110" stroke={C.black} strokeWidth={6} /><Line d="M-26 -90 C-26 -130 -10 -140 -8 -150 M26 -90 C26 -130 10 -140 8 -150 M0 -90 V-160 M-26 -90 H26" w={4} /></g>;
    case 'gada': return <g><path d="M0 40 V-60" stroke={C.black} strokeWidth={6} /><Line d={circle(0, -84, 28)} fill={C.turmeric} w={3} /></g>;
    case 'sword': return <Line d="M-6 30 L-6 -120 L0 -140 L6 -120 L6 30 Z M-20 30 H20" fill={C.paper} w={3} />;
    case 'kamandalu': return <Line d="M-24 -10 C-30 20 -18 36 0 36 C18 36 30 20 24 -10 C14 -20 -14 -20 -24 -10 Z" fill={C.turmeric} w={3} />;
    case 'lotus': return <Lotus x={0} y={-50} s={.5} />;
    case 'arrow': return <Line d="M0 40 V-110 M-10 -96 L0 -120 L10 -96" w={4} />;
    case 'bow': return <Line d="M-6 -110 C40 -60 40 40 -6 80 V-110" w={4} />;
    default: return <g>{Array.from({ length: 14 }, (_, i) => { const a = i / 14 * Math.PI * 2; return <circle key={i} cx={Math.sin(a) * 18} cy={-30 + Math.cos(a) * 26} r={4} fill={C.ochre} stroke={C.black} strokeWidth={1.4} />; })}</g>;
  }
};
const DeviArms: React.FC<{ grow: number }> = ({ grow }) => (
  <g opacity={grow}>{ITEMS.map((it, i) => {
    const a = (-150 + i * (120 / 7)) * Math.PI / 180, sx = 0, sy = -590, L = 170 * (.3 + .7 * grow);
    const ex = sx + Math.cos(a) * L * (i < 4 ? -1 : 1) * -1, ey = sy + Math.sin(a) * L;
    const x2 = i < 4 ? sx - Math.abs(Math.cos(a)) * L - 40 : sx + Math.abs(Math.cos(a)) * L + 40, y2 = ey - 40;
    return <g key={i}><Line d={tube([[sx, sy, 24], [(sx + x2) / 2, (sy + y2) / 2 + 10, 20], [x2, y2, 16]])} fill={C.turmeric} w={3.4} /><g transform={`translate(${x2} ${y2}) scale(${grow})`}><MItem it={it} /></g></g>;
  })}</g>
);
const devi = (sit = false): FigureSpec => ({
  kind: 'devi', sit, head: { eye: 'open', mouth: 'smile' },
  armFar: [[-18, -590, 0], [-10, -500, 0], [8, -430, 0]], handFar: 'hold',
  armNear: [[10, -586, 0], [96, -612, 0], [150, -690, 0]], handNear: 'up',
});

// kohbar motif field: lotus, bamboo, fish pair, parrots, sun and moon
const Kohbar: React.FC<{ t: number; bloom?: number; low?: number }> = ({ t, bloom = 1, low = 0 }) => <>
  <G id="sun"><Sun x={200} y={230 + low} rays={16} spin={t * 8} /></G>
  <G id="moon"><g transform={`translate(880 ${230 + low})`}><Line d="M-50 0 A50 50 0 1 0 30 -40 A38 38 0 1 1 -50 0 Z" fill={C.paper} w={3} /></g></G>
  <G id="bamboo"><Bamboo x={120} y={1500} h={620} /><Bamboo x={960} y={1500} h={600} /></G>
  <G id="fish"><Fish x={380} y={330 + low} /><g transform={`translate(700 ${330 + low}) scale(-1 1)`}><Fish x={0} y={0} /></g></G>
  <G id="parrots"><Bird x={300} y={520 + low} flap={Math.sin(onTwos(t) * 6)} /><g transform={`translate(780 ${520 + low}) scale(-1 1)`}><Bird x={0} y={0} flap={Math.sin(onTwos(t) * 6 + 1)} /></g></G>
  <G id="lotus-top"><LotusTop x={540} y={260 + low} n={10} grow={bloom} /></G>
</>;

const S0: React.FC<SP> = ({ t, u }) => <><Kohbar t={t} bloom={ease(seg(u, 0, 2))} low={530} /><Bharni d="M160 1420 H920 V1520 H160 Z" fill={C.indigoLight} pattern="scales" band={4} />{[260, 420, 580, 740, 860].map((x, i) => <Lotus key={i} x={x} y={1400} s={.7} />)}</>;

// the palace decorated for the wedding; Queen Maina waiting eagerly
const Palace: React.FC<{ t: number }> = ({ t }) => <>
  <G id="palace"><g transform="translate(540 1300) scale(1.05)"><Bharni d={PALACE_D} fill={C.turmericLight} pattern="dotsBlack" band={5} /></g></G>
  <G id="toran"><Toran x={540} y={640} w={760} sway={Math.sin(t)} /></G>
  <G id="sun"><Sun x={180} y={220} rays={14} spin={t * 8} /></G>
  <G id="fish"><Fish x={860} y={220} /></G>
</>;
const S1: React.FC<SP> = ({ t }) => <><Palace t={t} /><Place x={820} y={1520} s={.72}><Figure spec={withBlink(maina('wait'), bl(t, 1))} /></Place></>;

// the procession: ganas, bhoot and pret dancing (comic, never scary), Shiva ash-smeared on Nandi; Maina faints into her maids' arms
const S2: React.FC<SP> = ({ t, u }) => {
  const tt = onTwos(t), faint = seg(u, 2.4, 3.4), march = u * 50;
  return <>
    <Sun x={900} y={200} rays={14} spin={t * 8} />
    <g transform={`translate(${-120 + march} 0)`}>
      <Place x={380} y={1500} s={.62}><MNandi step={Math.floor(tt * 4)} /></Place>
      <Place x={400} y={1290} s={.5}><Figure spec={{ ...shiva('shiva'), sit: true }} /></Place>
      {[0, 1, 2].map((k) => <Place key={k} x={60 + k * 150} y={1540} s={.42}><Figure spec={gana(Math.floor(tt * 4) + k)} /></Place>)}
    </g>
    <Place x={860} y={1520} s={.66}><Figure spec={withBlink(maina(faint > .5 ? 'faint' : 'wait'), bl(t, 1))} /></Place>
    {faint > .5 && <Place x={980} y={1520} s={.62} flip><Figure spec={maid} /></Place>}
  </>;
};

// Parvati takes the radiant form: ten arms, golden glow, the bell-shaped moon, the tiger; patterns bloom outward
const S3: React.FC<SP> = ({ t, u }) => {
  const g = ease(seg(u, .4, 2.6));
  return <>
    <ellipse cx={540} cy={820} rx={200 + 360 * g} ry={260 + 420 * g} fill={C.turmericLight} opacity={.35 + .4 * g} />
    {Array.from({ length: 12 }, (_, i) => { const a = i / 12 * Math.PI * 2; return <g key={i} transform={`translate(${540 + Math.cos(a) * 420 * g} ${820 + Math.sin(a) * 520 * g}) scale(${.5 * g})`}><Flower x={0} y={0} col={i % 2 ? C.vermilion : C.leaf} /></g>; })}
    <g opacity={g}><Place x={540} y={1520} s={.72}><MTiger /></Place></g>
    <Place x={520} y={1520 - 230 * g} s={.72}><g transform={`translate(0 ${210 * Math.min(1, g * 2)})`}><DeviArms grow={g} /></g><Figure spec={g > .5 ? devi(true) : parvati('stand')} /></Place>
  </>;
};

// she stands before Shiva with folded hands
const S4: React.FC<SP> = ({ t }) => <><Palace t={t} /><Place x={330} y={1520} s={.7}><Figure spec={withBlink(parvati('namaskar'), bl(t, 2))} /></Place><Place x={780} y={1520} s={.7} flip><Figure spec={withBlink(shiva('shiva'), bl(t, 3))} /></Place></>;

// Shiva smiles and becomes Chandrashekhar, a radiant groom; Maina wakes, delighted
const S5: React.FC<SP> = ({ t, u }) => {
  const g = ease(seg(u, .6, 2.2));
  return <>
    <Palace t={t} />
    <ellipse cx={560} cy={1000} rx={220 + 160 * g} ry={380 + 120 * g} fill={C.turmericLight} opacity={.5 * g} />
    <Place x={560} y={1520} s={.74} flip><g opacity={1 - g}><Figure spec={shiva('shiva', true)} /></g><g opacity={g}><Figure spec={withBlink(shiva('groom', true), bl(t, 4))} /></g></Place>
    <Place x={250} y={1520} s={.66}><Figure spec={withBlink(maina(u > 2.6 ? 'joy' : 'faint'), bl(t, 1))} /></Place>
  </>;
};

// full portrait: Chandraghanta, ten arms, bell moon, on the tiger
const Portrait: React.FC<{ t: number }> = ({ t }) => <>
  <Kohbar t={t} />
  <ellipse cx={540} cy={820} rx={420} ry={560} fill={C.turmericLight} opacity={.45} />
  <Place x={540} y={1520} s={.74}><MTiger /></Place>
  <Place x={500} y={1290} s={.74}><g transform="translate(0 210)"><DeviArms grow={1} /></g><Figure spec={withBlink(devi(true), bl(t, 5))} /></Place>
</>;
const S6: React.FC<SP> = ({ t }) => <Portrait t={t} />;

export const DAY3 = { page: 'madhubani' as const, scenes: [S0, S1, S2, S3, S4, S5, S6], moralFrom: 6 };
