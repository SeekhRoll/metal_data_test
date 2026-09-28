import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { seg, ease } from '../../styles/pahari/rand';
import { M, Phalgu, Akshayavat, MFigure, MCow, GlowHands, Pindas, MDiya, Fillers, Sun, Manj } from '../../styles/manjusha/kit';
import { S } from '../../styles/pahari/paint';
import { ManjPage, MSUB } from '../../sheets/ManjSheets';
import { TextZone, T as Tx } from '../../shared/text';
import { FONT } from '../../style/fonts';
import { FPS, sceneAt, darkness, blinkAt, onTwos, Subtitles, splitCues, Cue, makeCheck, Scene } from '../../shared/film';
import tl from './ep3-timeline.json';
import vo from './ep3-vo.json';

// फल्गु के तट पर · Manjusha · ≈100 s (brief §8). Every scene opens like the panels of a box; the wave border flows.
export const EP3_SCENES: Scene[] = tl.scenes;
const CUES: Cue[] = (vo as { id: string; text: string; at: number; dur: number; sub?: boolean }[]).filter((l) => l.sub !== false).flatMap((l) => splitCues(l.text, l.at, l.at + l.dur));
const RIVER_Y = 1250, RIVER_H = 320;
type P = { t: number; u: number };

const Ram: React.FC<{ pose?: 'stand' | 'walk' | 'bow' | 'namaskar' | 'point'; t: number }> = ({ pose = 'stand', t }) => <MFigure skin={M.green} garb={[M.yellow, M.yellow]} crown="mukut" pose={pose} blink={blinkAt(t, 1)} />;
const Lakshman: React.FC<{ pose?: 'stand' | 'walk' | 'namaskar'; t: number }> = ({ pose = 'stand', t }) => <MFigure skin={M.yellow} garb={[M.green, M.pink]} crown="mukut" pose={pose} blink={blinkAt(t, 2)} />;
const Sita: React.FC<{ pose?: 'stand' | 'walk' | 'kneel' | 'offer' | 'namaskar'; t: number }> = ({ pose = 'stand', t }) => <MFigure skin={M.yellow} garb={[M.pink, M.green]} crown="sita" pose={pose} female blink={blinkAt(t, 3)} />;
const walkPose = (t: number) => (Math.floor(onTwos(t) * 3) % 2 ? 'walk' : 'stand') as 'walk' | 'stand';

const Title: React.FC<P> = ({ t }) => <><Sun x={880} y={620} r={54} rot={t * 6} /><Fillers x={80} y={460} w={920} h={560} n={26} seed={2} avoid={[{ x: 800, y: 540, w: 170, h: 170 }]} /><Akshayavat x={540} y={1240} s={.78} shimmer={t} /><Phalgu x={72} y={RIVER_Y} w={936} h={RIVER_H} flow={t * .8} /></>;

const Arrival: React.FC<P> = ({ t, u }) => {
  const k = ease(seg(u, 0, 5)), dx = -380 * (1 - k), pose = k < 1 ? walkPose(t) : 'stand';
  return <>
    <Sun x={880} y={200} r={50} rot={t * 6} />
    <Fillers x={80} y={100} w={920} h={420} n={24} seed={5} avoid={[{ x: 800, y: 120, w: 170, h: 170 }]} />
    <Akshayavat x={790} y={1250} s={.66} shimmer={t} />
    <g transform={`translate(${dx} 0)`}>
      <g transform="translate(200 840) scale(1)"><Ram pose={pose} t={t} /></g>
      <g transform="translate(340 850) scale(.94)"><Sita pose={pose} t={t} /></g>
      <g transform="translate(480 840) scale(.96)"><Lakshman pose={pose} t={t} /></g>
    </g>
    <Phalgu x={72} y={RIVER_Y} w={936} h={RIVER_H} flow={t * .8} />
  </>;
};

// Ram and Lakshman leave; Sita waits alone as the sun moves across the panel
const Waits: React.FC<P> = ({ t, u }) => {
  const go = ease(seg(u, .6, 5)), sun = seg(u, 0, 10);
  return <>
    <Sun x={160 + sun * 760} y={260 - Math.sin(sun * Math.PI) * 120} r={50} rot={t * 6} />
    <Fillers x={80} y={420} w={920} h={220} n={12} seed={7} />
    <Akshayavat x={790} y={1250} s={.66} shimmer={t} />
    <g transform="translate(360 850) scale(.94)"><Sita t={t} /></g>
    {go < 1 && <g opacity={1 - seg(u, 4, 5)} transform={`translate(${-go * 420} 0)`}>
      <g transform="translate(200 840) scale(-1 1)"><Ram pose={walkPose(t)} t={t} /></g>
      <g transform="translate(90 840) scale(-.96 .96)"><Lakshman pose={walkPose(t)} t={t} /></g>
    </g>}
    <Phalgu x={72} y={RIVER_Y} w={936} h={RIVER_H} flow={t * .8} />
  </>;
};

// Dasharatha's call: a soft golden glow rises from the river, and outline hands reach up out of the light
const Call: React.FC<P> = ({ t, u }) => {
  const glow = seg(u, .4, 2.4), hands = ease(seg(u, 1.8, 4));
  return <>
    <Sun x={900} y={240} r={46} rot={t * 6} />
    <Fillers x={80} y={120} w={920} h={420} n={18} seed={9} avoid={[{ x: 820, y: 170, w: 160, h: 150 }]} />
    <Akshayavat x={800} y={1250} s={.6} shimmer={t} />
    <g transform="translate(300 850) scale(.94)"><Sita pose={u > 4 ? 'namaskar' : 'stand'} t={t} /></g>
    <Phalgu x={72} y={RIVER_Y} w={936} h={RIVER_H} flow={t * .8} />
    <g transform={`translate(600 ${RIVER_Y + 20 - hands * 60})`}><GlowHands a={glow} reach={hands} /></g>
  </>;
};

// the sand pinda: Sita shapes the pindas from the river sand; the witnesses stand around; the hands receive and fade
const Pinda: React.FC<P> = ({ t, u }) => {
  const n = Math.min(5, Math.floor(seg(u, 1.6, 6) * 6)), receive = seg(u, 8, 10.5), hands = 1 - seg(u, 10.5, 12.5);
  return <>
    <Sun x={900} y={200} r={44} rot={t * 6} />
    <Akshayavat x={800} y={1000} s={.6} shimmer={t} glow={seg(u, 8, 10) * .4} />
    <g transform="translate(620 1080) scale(.62)"><MCow blink={blinkAt(t, 5)} /></g>
    <g transform="translate(250 950) scale(1.05)"><Sita pose={u < 7 ? 'kneel' : 'offer'} t={t} /></g>
    {n > 0 && <g opacity={1 - receive * .9}><Pindas n={n} x={400} y={1170} /></g>}
    <Phalgu x={72} y={RIVER_Y} w={936} h={RIVER_H} flow={t * .8} />
    <g transform={`translate(470 ${RIVER_Y + 10 - 40 * receive})`}><GlowHands a={hands * (u > .3 ? 1 : 0)} reach={1} /></g>
  </>;
};

// Ram returns and asks; the river and the cow stay silent (the cow turns away), only the Akshayavat's leaves shimmer
const Return: React.FC<P> = ({ t, u }) => {
  const k = ease(seg(u, 0, 3.6)), turned = u > 5.6 ? 1 : 0, still = seg(u, 5.6, 6.4);
  return <>
    <Sun x={880} y={200} r={44} rot={t * 6} />
    <Akshayavat x={820} y={1000} s={.6} shimmer={u > 8 ? t * 3 : t * .2} glow={seg(u, 8, 9) * .6} />
    <g transform="translate(720 1080) scale(.62)"><MCow turned={turned} blink={blinkAt(t, 5)} /></g>
    <g transform="translate(500 850) scale(.94)"><Sita pose="stand" t={t} /></g>
    <g transform={`translate(${-300 + k * 420} 0)`}>
      <g transform="translate(0 840)"><Ram pose={k < 1 ? walkPose(t) : 'point'} t={t} /></g>
      <g transform="translate(-130 840) scale(.96)"><Lakshman pose={k < 1 ? walkPose(t) : 'stand'} t={t} /></g>
    </g>
    <Phalgu x={72} y={RIVER_Y} w={936} h={RIVER_H} flow={t * .8 * (1 - still * .95)} />
  </>;
};

// the truth confirmed: a soft golden glow from above, Dasharatha's voice; Ram bows to Sita
const Truth: React.FC<P> = ({ t, u }) => {
  const glow = Math.sin(Math.PI * seg(u, .4, 9.5)), bow = u > 5.4;
  return <>
    <ellipse cx={540} cy={200} rx={520} ry={320} fill="#FFE39A" opacity={.55 * glow} filter="url(#haloBloom)" />
    <Sun x={540} y={220} r={60} rot={t * 8} />
    <Akshayavat x={840} y={1000} s={.52} shimmer={t} glow={.4} />
    <g transform="translate(260 850) scale(.96)"><Ram pose={bow ? 'bow' : 'stand'} t={t} /></g>
    <g transform="translate(660 850) scale(-.94 .94)"><Sita pose="stand" t={t} /></g>
    <g transform="translate(120 840) scale(.9)"><Lakshman pose="namaskar" t={t} /></g>
    <Phalgu x={72} y={RIVER_Y} w={936} h={RIVER_H} flow={t * .8} />
  </>;
};

// the legacy: the wave band slides beneath a sand band (dry surface, water flowing below); the Akshayavat glows green
const Legacy: React.FC<P> = ({ t, u }) => {
  const sand = ease(seg(u, .8, 5)), glow = seg(u, 4.4, 6.4);
  return <>
    <Sun x={880} y={200} r={46} rot={t * 6} />
    <Fillers x={80} y={120} w={920} h={200} n={14} seed={13} avoid={[{ x: 800, y: 130, w: 160, h: 150 }]} />
    <Akshayavat x={540} y={1180} s={.9} shimmer={t} glow={glow} />
    <Phalgu x={72} y={RIVER_Y} w={936} h={RIVER_H} flow={t * .8} sand={sand * .5} />
    {u > 7.6 && <Pindas n={5} x={180} y={RIVER_Y + 70} />}
  </>;
};

const MoralS: React.FC<P> = ({ t }) => <><Akshayavat x={540} y={1180} s={.9} shimmer={t} glow={.6} /><Phalgu x={72} y={RIVER_Y} w={936} h={RIVER_H} flow={t * .8} sand={.5} /></>;
const Closing: React.FC<P> = ({ t }) => <><rect x={0} y={0} width={1080} height={1920} fill="#1A120C" /><MDiya x={480} y={860} s={2.4} flame={t} /></>;

const PAINT: Record<string, React.FC<P>> = { title: Title, arrival: Arrival, waits: Waits, call: Call, pinda: Pinda, return: Return, truth: Truth, legacy: Legacy, moral: MoralS, closing: Closing };

export const Ep3Frame: React.FC<{ t: number }> = ({ t }) => {
  const s = sceneAt(EP3_SCENES, t), u = t - s.from, Scene = PAINT[s.id];
  const open = s.id === 'closing' ? 1 : ease(seg(u, .15, s.id === 'title' ? 1.8 : 1.1));
  const dark = darkness(EP3_SCENES, t);
  return (
    <ManjPage t={t} open={open} overlay={<>
      {dark > 0 && <AbsoluteFill style={{ background: '#140E0A', opacity: dark }} />}
      {s.id === 'title' && <>
        <div data-kind="surface" style={{ position: 'absolute', left: 150, top: 120, width: 780, height: 280, background: M.yellow, border: `4px solid ${M.black}`, boxShadow: `inset 0 0 0 10px ${M.yellow}, inset 0 0 0 14px ${M.pink}`, opacity: seg(u, 1.6, 2.4) }} />
        <TextZone id="title" z={{ x: 170, y: 136, w: 740, h: 248 }} opacity={seg(u, 1.8, 2.8)}><Tx size={88} color={M.pink} font={FONT.rozha}>फल्गु के तट पर</Tx><Tx size={36} color={M.black} mt={4}>मंजूषा कला शैली में · भागलपुर, बिहार</Tx><Tx size={30} color={M.green} mt={8}>पितृ पक्ष विशेष</Tx></TextZone>
      </>}
      {s.id === 'moral' && <TextZone id="moral" z={MSUB} opacity={seg(u, .4, 1.2)}><Tx size={40} color={M.black}>सच बोलना कभी-कभी कठिन होता है…</Tx><Tx size={50} color={M.pink} font={FONT.rozha}>पर वही अमर रहता है।</Tx></TextZone>}
      {s.id === 'closing' && <TextZone id="closing" z={MSUB} opacity={seg(u, .5, 1.5)}><Tx size={58} color={M.black} font={FONT.rozha}>पितरों को नमन।</Tx><Tx size={38} color={M.black} mt={6}><span style={{ fontFamily: FONT.serif, fontWeight: 700 }}>Sri Desi Thekua</span> की ओर से</Tx></TextZone>}
      {s.id !== 'moral' && s.id !== 'closing' && <Subtitles cues={CUES} t={t} z={MSUB} size={40} color={M.black} />}
    </>}>
      <Scene t={t} u={u} />
    </ManjPage>
  );
};

export const Ep3: React.FC = () => { const f = useCurrentFrame(); return <Ep3Frame t={f / FPS} />; };
export const Ep3Check = makeCheck(Ep3Frame, EP3_SCENES, { x0: 72, y0: 72, x1: 1008, y1: 1568 });
export const EP3_FRAMES = Math.round(tl.dur * FPS);
