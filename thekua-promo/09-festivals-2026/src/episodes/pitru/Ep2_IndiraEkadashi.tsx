import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { T } from '../../styles/patta/palette';
import { S } from '../../styles/pahari/paint';
import { seg, ease, rng } from '../../styles/pahari/rand';
import { PattaTree, Deula, Dots, PattaRiver, BANDS } from '../../styles/patta/kit';
import { Indrasen, Queen, Narada, Father, Vimana, PattaDiya, Patta } from '../../characters/ep2/cast';
import { PattaPage, SUB } from '../../sheets/PattaSheets';
import { TextZone, T as Tx } from '../../shared/text';
import { FONT } from '../../style/fonts';
import { FPS, sceneAt, darkness, blinkAt, onTwos, Subtitles, splitCues, Cue, makeCheck, Scene } from '../../shared/film';
import tl from './ep2-timeline.json';
import vo from './ep2-vo.json';
import { Motes } from './ep1-props';

// इंदिरा एकादशी · Pattachitra · ≈90 s (brief §7). Every scene opens with the border bands drawing in.
export const EP2_SCENES: Scene[] = tl.scenes;
const CUES: Cue[] = (vo as { id: string; text: string; at: number; dur: number; sub?: boolean }[]).filter((l) => l.sub !== false).flatMap((l) => splitCues(l.text, l.at, l.at + l.dur));
const X0 = 91, X1 = 989, Y0 = 91, GROUND = 1560;

const Ground: React.FC = () => <><rect x={X0} y={GROUND} width={X1 - X0} height={60} fill={T.greenDeep} /><Dots pts={[[X0, GROUND + 10], [X1, GROUND + 10]]} step={12} r={2} /></>;
const Frieze: React.FC<{ y: number; t: number }> = ({ y, t }) => (
  <g data-kind="graphic" data-id="frieze">
    {[0, 1, 2, 3].map((i) => { const cx = 190 + i * 233; return <g key={i}>
      {Array.from({ length: 12 }, (_, k) => { const a = k / 12 * Math.PI * 2; return <ellipse key={k} cx={cx + Math.cos(a) * 34} cy={y + Math.sin(a) * 34} rx={26} ry={11} transform={`rotate(${a * 180 / Math.PI} ${cx + Math.cos(a) * 34} ${y + Math.sin(a) * 34})`} fill={k % 2 ? T.pink : T.white} stroke={T.black} strokeWidth={1.6} />; })}
      <circle cx={cx} cy={y} r={20} fill={T.yellow} stroke={T.black} strokeWidth={2} /><Dots pts={[[cx - 12, y], [cx + 12, y]]} step={6} r={1.8} c={T.red} />
    </g>; })}
    {[0, 1, 2].map((i) => { const bx = 306 + i * 233, by = y + 6 + 4 * Math.sin(t * 2 + i); return <g key={'p' + i}>
      <S d={`M${bx - 30} ${by} C${bx - 20} ${by - 26} ${bx + 14} ${by - 26} ${bx + 24} ${by - 6} L${bx + 36} ${by - 2} L${bx + 22} ${by + 6} C${bx + 10} ${by + 14} ${bx - 14} ${by + 14} ${bx - 30} ${by}Z`} fill={T.green} sw={1.2} />
      <S d={`M${bx - 30} ${by} L${bx - 58} ${by + 22} L${bx - 26} ${by + 8}Z`} fill={T.teal} sw={1} />
      <circle cx={bx + 14} cy={by - 12} r={2} fill={T.black} /><S d={`M${bx + 24} ${by - 6} q8 2 6 10`} stroke={T.red} sw={3} />
    </g>; })}
  </g>
);
const Canopy: React.FC<{ y: number }> = ({ y }) => <>
  <S d={`M${X0} ${y} H${X1} V${y + 40} H${X0}Z`} fill={T.yellow} sw={2} />
  <Dots pts={[[X0 + 10, y + 20], [X1 - 10, y + 20]]} step={10} r={2.4} c={T.red} />
  {Array.from({ length: 23 }, (_, i) => <S key={i} d={`M${X0 + i * 40} ${y + 40} q20 30 40 0`} fill={T.ochre} sw={1.4} />)}
</>;
// the courtiers/subjects: small bowing figures (one design, repeated)
const Subject: React.FC<{ x: number; bow: number }> = ({ x, bow }) => (
  <g transform={`translate(${x} ${GROUND - 646 * .5}) scale(-.5 .5)`}><Queen arms={bow > .5 ? 'namaskar' : 'down'} blink={0} /></g>
);

const Title: React.FC<{ t: number; u: number }> = ({ t }) => <><Deula x={540} y={GROUND} s={1.8} /><PattaTree x={220} y={GROUND} h={520} seed={3} bird /><PattaTree x={860} y={GROUND} h={500} seed={8} flower={T.white} /><Ground /></>;

const Court: React.FC<{ t: number; u: number }> = ({ t, u }) => (
  <g>
    <Frieze y={330} t={t} />
    <Canopy y={560} />
    {[150, 930].map((x) => <g key={x}><S d={`M${x - 14} 600 V${GROUND} H${x + 14} V600Z`} fill={T.ochre} sw={2} /><Dots pts={[[x, 620], [x, GROUND - 20]]} step={16} r={2.4} /></g>)}
    <g transform="translate(330 900) scale(1.3)"><Indrasen blink={blinkAt(t, 1)} /></g>
    {[0, 1, 2].map((i) => <Subject key={i} x={880 - i * 110} bow={Math.sin(onTwos(t) * 1.2 + i) > 0 ? 1 : 0} />)}
    <Ground />
  </g>
);

const NaradaArrives: React.FC<{ t: number; u: number }> = ({ t, u }) => {
  const d = ease(seg(u, .2, 4.5));
  return (
    <g>
      <Frieze y={330} t={t} />
      <Canopy y={560} />
      <g transform="translate(300 900) scale(1.25)"><Indrasen pose={u > 4.6 ? 'namaskar' : 'throne'} blink={blinkAt(t, 2)} /></g>
      <g transform={`translate(800 ${-380 + d * 1050}) scale(-1.2 1.2)`}><Narada blink={blinkAt(t, 3)} t={t} /></g>
      {d < 1 && <g opacity={1 - d}>{[-110, -40, 30, 100].map((x, i) => <S key={i} d={`M${800 + x - 40} ${-380 + d * 1050 + 760} a40 30 0 1 0 80 0Z`} fill={T.white} sw={1.4} />)}</g>}
      <Ground />
    </g>
  );
};

// the father's message: a darker, cooler panel inside the same border system (no suffering, only waiting)
const FatherPanel: React.FC<{ t: number; u: number; lit?: number }> = ({ t, lit = 0 }) => (
  <g>
    <rect x={140} y={760} width={800} height={780} fill={lit > 0 ? mixHex(T.dim, T.gold, lit * .5) : T.dim} stroke={T.black} strokeWidth={4} />
    <rect x={140} y={760} width={800} height={780} fill="none" stroke={T.dimLite} strokeWidth={10} />
    <Dots pts={[[150, 770], [930, 770], [930, 1530], [150, 1530], [150, 770]]} step={14} r={2} c="#9AA6B8" />
    <g opacity={.55}><PattaTree x={250} y={1500} h={300} seed={12} flower={T.dimLite} /><PattaTree x={830} y={1500} h={280} seed={13} flower={T.dimLite} /></g>
    <g transform="translate(500 1060) scale(.95)"><Father blink={blinkAt(t, 4)} /></g>
  </g>
);
const FatherScene: React.FC<{ t: number; u: number }> = ({ t, u }) => (
  <g>
    <g transform="translate(270 420) scale(.55)"><Narada blink={blinkAt(t, 3)} /></g>
    <g transform="translate(820 420) scale(-.55 .55)"><Indrasen pose="namaskar" blink={blinkAt(t, 2)} /></g>
    <g opacity={seg(u, .8, 2)}><FatherPanel t={t} u={u} /></g>
  </g>
);

// the vow: three compartments appear one after another (shradh at the river · the fast · daan the next day)
const Vow: React.FC<{ t: number; u: number }> = ({ t, u }) => {
  const p = [seg(u, .3, 1.3), seg(u, 5.4, 6.4), seg(u, 8.2, 9.2)];
  const box = (i: number, y: number, h: number, children: React.ReactNode) => (
    <g opacity={p[i]} transform={`translate(0 ${(1 - ease(p[i])) * 30})`}>
      <rect x={130} y={y} width={820} height={h} fill={[T.red, T.redDeep, T.red][i]} stroke={T.black} strokeWidth={4} />
      <rect x={138} y={y + 8} width={804} height={h - 16} fill="none" stroke={T.yellow} strokeWidth={3} />
      <clipPath id={`vow${i}`}><rect x={142} y={y + 12} width={796} height={h - 24} /></clipPath>
      <g clipPath={`url(#vow${i})`}>{children}</g>
    </g>
  );
  return (
    <g>
      {box(0, 120, 460, <>
        <PattaRiver x={142} y={450} w={796} h={120} t={t} />
        <g transform="translate(400 170) scale(.44)"><Indrasen pose="offer" blink={blinkAt(t, 1)} /></g>
        <g transform="translate(250 180) scale(.42)"><Queen arms="offer" blink={blinkAt(t, 2)} /></g>
        {[0, 1, 2].map((i) => <circle key={i} cx={560 + i * 26} cy={430} r={11} fill={T.white} stroke={T.black} strokeWidth={2} />)}
      </>)}
      {box(1, 610, 460, <>
        <g transform="translate(360 700) scale(.44)"><Indrasen pose="namaskar" blink={1} /></g>
        <g transform="translate(560 710) scale(.42)"><Queen arms="namaskar" blink={1} /></g>
        <PattaDiya x={780} y={1000} s={.8} flame={t} />
      </>)}
      {box(2, 1100, 460, <>
        <g transform="translate(330 1190) scale(.44)"><Indrasen pose="offer" blink={blinkAt(t, 5)} /></g>
        {[0, 1, 2].map((i) => <g key={i} transform={`translate(${700 + i * 90} 1200) scale(-.42 .42)`}><Narada blink={blinkAt(t, i + 6)} /></g>)}
        <S d="M480 1400 C500 1380 540 1380 560 1400 L550 1420 H490Z" fill={T.yellow} sw={1.4} />
      </>)}
    </g>
  );
};

// release: the dim panel brightens, Vaikuntha opens above, the vimana descends and the father rises into gold
const Release: React.FC<{ t: number; u: number }> = ({ t, u }) => {
  const open = ease(seg(u, .6, 2.6)), lit = seg(u, 1.2, 4), vim = ease(seg(u, 2.6, 6)), rise = ease(seg(u, 6, 9.5));
  const r = rng(4);
  return (
    <g>
      <g transform={`translate(0 ${-rise * 60})`}><FatherPanel t={t} u={u} lit={lit} /></g>
      <g opacity={open}>
        <rect x={140} y={120} width={800} height={600 * open} fill={T.gold} stroke={T.black} strokeWidth={4} />
        <clipPath id="vk"><rect x={140} y={120} width={800} height={600 * open} /></clipPath>
        <g clipPath="url(#vk)">
          {Array.from({ length: 36 }, (_, i) => { const a = i / 36 * Math.PI * 2 + t * .05; return <path key={i} d={`M540 420 L${540 + Math.cos(a) * 520} ${420 + Math.sin(a) * 520}`} stroke={T.goldHi} strokeWidth={6} opacity={.7} />; })}
          {[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={200 + i * 136} cy={180} r={16} fill={T.pink} stroke={T.black} strokeWidth={2} />)}
        </g>
        <rect x={140} y={120} width={800} height={600 * open} fill="none" stroke={T.red} strokeWidth={10} />
      </g>
      <g transform={`translate(540 ${-200 + vim * 760 - rise * 520}) scale(1.05)`} opacity={vim}><Vimana t={t} /></g>
      {rise > 0 && <g transform={`translate(${500 + rise * 28} ${1060 - rise * 620}) scale(${.95 - rise * .4})`} opacity={1 - seg(u, 9, 10.5) * .2}><Father blink={blinkAt(t, 4)} /></g>}
      {/* flowers falling across the scene */}
      {u > 5 && Array.from({ length: 30 }, (_, i) => { const x = 150 + r() * 780, sp = 60 + r() * 60, y = 120 + ((u - 5) * sp + r() * 800) % 1450; return <g key={i} data-kind="graphic" data-id="flower">{[0, 1, 2, 3, 4].map((k) => { const a = k / 5 * Math.PI * 2 + t; return <circle key={k} cx={x + Math.cos(a) * 5} cy={y + Math.sin(a) * 5} r={3.6} fill={i % 2 ? T.pink : T.white} stroke={T.black} strokeWidth={.8} />; })}</g>; })}
    </g>
  );
};

// moral: the king sets a lamp on the river; it floats away
const MoralScene: React.FC<{ t: number; u: number }> = ({ t, u }) => {
  const float = ease(seg(u, 2.2, 11));
  return (
    <g>
      <rect x={X0} y={Y0} width={X1 - X0} height={1100} fill={T.sky} />
      {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={X0 + (i * 137) % 900} cy={Y0 + (i * 71) % 700} r={2} fill={T.white} opacity={.7} />)}
      <circle cx={820} cy={300} r={60} fill={T.white} stroke={T.black} strokeWidth={3} />
      <PattaTree x={180} y={1190} h={420} seed={21} />
      <Deula x={880} y={1190} s={.9} />
      <PattaRiver x={X0} y={1190} w={X1 - X0} h={380} t={t} fish={false} />
      <g transform={`translate(300 ${1190 - 646 * .78}) scale(.78)`}><Indrasen pose={u < 2 ? 'offer' : 'namaskar'} blink={blinkAt(t, 1)} /></g>
      <g transform={`translate(${420 + float * 420} ${1290 + float * 120}) scale(${.55 - float * .25})`}><PattaDiya x={0} y={0} s={1} flame={t} /></g>
    </g>
  );
};
const Closing: React.FC<{ t: number; u: number }> = ({ t }) => <><rect x={0} y={0} width={1080} height={1920} fill="#1A100C" /><PattaDiya x={480} y={900} s={2.4} flame={t} /></>;

const PAINT: Record<string, React.FC<{ t: number; u: number }>> = { title: Title, court: Court, narada: NaradaArrives, father: FatherScene, vow: Vow, release: Release, moral: MoralScene, closing: Closing };

function mixHex(a: string, b: string, k: number) {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const A = p(a), B = p(b);
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join('');
}

export const Ep2Frame: React.FC<{ t: number }> = ({ t }) => {
  const s = sceneAt(EP2_SCENES, t), u = t - s.from, Scene = PAINT[s.id];
  const k = s.id === 'closing' ? BANDS.length : Math.min(BANDS.length, u * (s.id === 'title' ? 3 : 6));
  const dark = darkness(EP2_SCENES, t);
  return (
    <PattaPage t={t} k={k} ground={s.id === 'closing' ? '#1A100C' : s.id === 'father' || s.id === 'release' ? T.redDeep : T.red}
      overlay={<>
        {dark > 0 && <AbsoluteFill style={{ background: '#120A06', opacity: dark }} />}
        {s.id === 'title' && <>
          <div data-kind="surface" style={{ position: 'absolute', left: 150, top: 150, width: 780, height: 300, background: T.yellow, border: `3px solid ${T.black}`, boxShadow: `inset 0 0 0 8px ${T.yellow}, inset 0 0 0 11px ${T.red}`, opacity: seg(u, 1.4, 2.2) }} />
          <TextZone id="title" z={{ x: 170, y: 166, w: 740, h: 268 }} opacity={seg(u, 1.6, 2.6)}>
            <Tx size={92} color={T.redDeep} font={FONT.rozha}>इंदिरा एकादशी</Tx>
            <Tx size={38} color={T.black} mt={6}>पट्टचित्र शैली में · ओडिशा</Tx>
            <Tx size={32} color={T.redDeep} mt={10}>पितृ पक्ष विशेष</Tx>
          </TextZone>
        </>}
        {s.id === 'moral' && <TextZone id="moral" z={SUB} opacity={seg(u, 2.6, 3.4)}><Tx size={42} color={T.black}>जो चले गए, वो दूर नहीं होते…</Tx><Tx size={46} color={T.redDeep} font={FONT.rozha}>हमारे अच्छे कर्म, उन तक पहुँचते हैं।</Tx></TextZone>}
        {s.id === 'closing' && <TextZone id="closing" z={SUB} opacity={seg(u, .5, 1.5)}><Tx size={58} color={T.black} font={FONT.rozha}>पितरों को नमन।</Tx><Tx size={38} color={T.black} mt={6}><span style={{ fontFamily: FONT.serif, fontWeight: 700 }}>Sri Desi Thekua</span> की ओर से</Tx></TextZone>}
        {s.id !== 'moral' && s.id !== 'closing' && <Subtitles cues={CUES} t={t} z={SUB} size={42} color={T.black} />}
      </>}>
      <Scene t={t} u={u} />
    </PattaPage>
  );
};

export const Ep2: React.FC = () => { const f = useCurrentFrame(); return <Ep2Frame t={f / FPS} />; };
export const Ep2Check = makeCheck(Ep2Frame, EP2_SCENES, { x0: 91, y0: 91, x1: 989, y1: 1620 });
export const EP2_FRAMES = Math.round(tl.dur * FPS);
export { Patta, Motes };
