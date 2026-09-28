import React from 'react';
import { P } from '../styles/pahari/palette';
import { S, LineCtx } from '../styles/pahari/paint';
import { seg, ease } from '../styles/pahari/rand';
import { SJ, Powder, Stencil, BorderCuts } from '../styles/sanjhi/kit';
import { SnowPeaks, RoundTree } from '../styles/pahari/scenery';
import { Lotus } from '../styles/pahari/figure';
import { DeviFigure } from '../devi/pahari/DeviFigure';
import { deviFor } from '../devi/pahari/devis';
import { Brahma } from '../characters/ep1/cast';
import { blinkAt } from '../shared/film';
import type { SP } from './day1';

// Day 2 · अपर्णा (Sanjhi). Every scene lays down a new stencil (it settles from a lift) and powder sifts in beneath.
export const SX = 40, SY = 40, SW = 1000, SH = 1540;
const life = (t: number, s = 0) => ({ t, blink: blinkAt(t, s), breathe: Math.sin(t * 1.2), sway: 0, bloom: 0 });

// one Sanjhi plate: the same drawing is the powder (painted, no outlines) and the stencil (cut)
export const Plate: React.FC<{ id: string; u: number; drawing: React.ReactNode; sky: string; ground: string; wash: string; washK?: number; extra?: React.ReactNode }> = ({ id, u, drawing, sky, ground, wash, washK = .55, extra }) => {
  const lift = 1 - ease(seg(u, 0, .6)), k = seg(u, .4, 1.6);
  return (
    <g>
      <Powder x={SX} y={SY} w={SW} h={SH} k={k} id={id + 'p'}>
        <rect x={SX} y={SY} width={SW} height={SH} fill={sky} />
        <rect x={SX} y={1380} width={SW} height={SH - 1340} fill={ground} />
        <g style={{ filter: 'saturate(1.7) contrast(1.15)' }}><LineCtx.Provider value={{ scale: 0, ink: P.ink, skin: P.skinLine }}>{drawing}</LineCtx.Provider></g>
        <rect x={SX} y={SY} width={SW} height={SH} fill={wash} opacity={washK} style={{ mixBlendMode: 'multiply' }} />
        {extra}
      </Powder>
      <Stencil x={SX} y={SY} w={SW} h={SH} id={id + 's'} lift={lift} opacity={1 - lift * .3} cuts={<><BorderCuts x={SX} y={SY} w={SW} h={SH} />{drawing}</>} />
    </g>
  );
};
const Ground: React.FC = () => <>{[180, 360, 720, 900].map((x, i) => <Lotus key={i} x={x} y={1480} s={1.1} />)}<path d={`M${SX + 70} 1440 H${SX + SW - 70}`} stroke={P.ink} strokeWidth={4} /></>;

const Kailash: React.FC = () => <SnowPeaks x={SX + 60} w={SW - 120} base={900} h={420} seed={9} />;
const S0: React.FC<SP> = ({ t, u }) => <Plate id="d2s0" u={u} sky="#E0A040" ground="#B8742A" wash="#E8A030" drawing={<><Kailash /><RoundTree x={220} y={1400} h={480} seed={3} /><RoundTree x={860} y={1400} h={440} seed={4} /><Ground /></>} />;

// young Parvati, looking toward Kailash
const S1: React.FC<SP> = ({ t, u }) => <Plate id="d2s1" u={u} sky="#E0A040" ground="#B8742A" wash="#E08A50" drawing={<>
  <Kailash />
  <g transform="translate(360 620) scale(1.12)"><DeviFigure life={life(t, 1)} spec={{ posture: 'walking', garment: '#C2362C', veil: P.pink, crown: true, halo: false, near: ['none'], far: ['none'] }} /></g>
  <Ground />
</>} />;

// Parvati meditating beneath a tree in the forest
const Meditating: React.FC<{ t: number }> = ({ t }) => <>
  <RoundTree x={540} y={1380} h={1000} seed={6} />
  <g transform="translate(520 900) scale(1.1)"><DeviFigure life={life(t, 2)} spec={{ posture: 'padmasana', garment: '#F4EFE3', veil: '#F4EFE3', crown: false, halo: false, near: ['dhyana'], far: ['dhyana'] }} /></g>
</>;
const S2: React.FC<SP> = ({ t, u }) => <Plate id="d2s2" u={u} sky="#7FA35A" ground="#4E7A3A" wash="#9ACD7A" drawing={<><Meditating t={t} /><Ground /></>} />;

// the seasons: the stencil stays fixed while the powder cycles summer ochre → monsoon blue → winter white;
// the offerings beside her shrink from fruit to bel leaves to nothing
const SEASONS = ['#E09A30', '#3E6AB0', '#EEF2F6'];
const S3: React.FC<SP> = ({ t, u, dur }) => {
  const q = seg(u, .6, Math.max(1, dur - .6)) * 2.999, i = Math.floor(q), f = q - i;
  const wash = mix(SEASONS[i], SEASONS[Math.min(2, i + 1)], ease(Math.max(0, f - .7) / .3));
  const stage = Math.floor(seg(u, .6, dur * .85) * 3);
  const offering = stage === 0
    ? <>{[0, 1, 2].map((k) => <S key={k} d={`M${760 + k * 44} 1330 m-18 0 a18 18 0 1 0 36 0 a18 18 0 1 0 -36 0`} fill="#E0562A" />)}</>
    : stage === 1 ? <>{[0, 1].map((k) => <g key={k} transform={`translate(${780 + k * 60} 1330)`}>{[-40, 0, 40].map((a) => <S key={a} d="M0 0 C-10 -14 -8 -34 0 -44 C8 -34 10 -14 0 0Z" fill="#6E8B3D" />)}</g>)}</> : null;
  return <Plate id="d2s3" u={u + 3} sky="#7FA35A" ground="#4E7A3A" wash={wash} washK={.65} drawing={<><Meditating t={t} /><Ground />{offering}</>} />;
};

// Brahma's stencil lifts into place, golden powder glowing through the cuts
const S4: React.FC<SP> = ({ t, u }) => <Plate id="d2s4" u={u} sky="#F0C040" ground="#E0A030" wash="#F4C23A" washK={.5}
  extra={<ellipse cx={540} cy={700} rx={420} ry={520} fill="#FFF0B0" opacity={.55 * seg(u, 1.2, 3)} filter="url(#haloBloom)" />}
  drawing={<><g transform="translate(560 560) scale(1.05)"><Brahma blink={blinkAt(t, 3)} /></g><Ground /></>} />;

// the full portrait stencil: barefoot, white attire, mala, kamandalu
const Portrait: React.FC<{ t: number }> = ({ t }) => { const D = deviFor(2).draw; return <><g transform="translate(560 420) scale(1.28)"><D hex="#F2EFE6" life={life(t, 5)} /></g><RoundTree x={200} y={1400} h={520} seed={21} /><RoundTree x={890} y={1400} h={460} seed={22} /><Ground /></>; };
const S5: React.FC<SP> = ({ t, u }) => <Plate id="d2s5" u={u} sky="#E0A040" ground="#B8742A" wash="#E8A030" drawing={<Portrait t={t} />} />;
const S6: React.FC<SP> = ({ t, u }) => <Plate id="d2s5" u={u + 5} sky="#E0A040" ground="#B8742A" wash="#E8A030" drawing={<Portrait t={t} />} />;

function mix(a: string, b: string, k: number) {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const A = p(a), B = p(b);
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join('');
}

export const DAY2 = { page: 'sanjhi' as const, scenes: [S0, S1, S2, S3, S4, S5, S6], moralFrom: 6 };
