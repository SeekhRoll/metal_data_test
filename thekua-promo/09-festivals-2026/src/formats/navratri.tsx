import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { P, PAGE, shade } from '../styles/pahari/palette';
import { PahariPage } from '../styles/pahari/Page';
import { seg, ease, easeBack } from '../styles/pahari/rand';
import { Landscape, Petals } from '../devi/pahari/PortraitScene';
import { Diya } from '../styles/pahari/scenery';
import { RevealCtx } from '../styles/pahari/paint';
import { deviFor } from '../devi/pahari/devis';
import { TitleCard } from '../shared/TitleCard';
import { BrandStrip } from '../shared/EndCardFull';
import { TextZone, T } from '../shared/text';
import { FONT } from '../style/fonts';
import { FPS, reveal, blinkAt, Subtitles, Cue, makeCheck, Scene } from '../shared/film';
import days from '../../data/navratri-days.json';
import btl from './b-timeline.json';
import { splitCues as split } from '../shared/film';

export const PAHARI_LINE = 'पहाड़ी लघुचित्र शैली में · हिमाचल प्रदेश';
type Day = (typeof days)[number];
const life = (t: number, day: number, bloom = .4) => ({ t, blink: blinkAt(t, day), breathe: Math.sin(t * 1.4), sway: Math.sin(t * .9) * .6, bloom });

// the day's portrait: Pahari landscape + Devi, slow push-in
const Portrait: React.FC<{ d: Day; t: number; dy?: number; push?: number; bloom?: number }> = ({ d, t, dy = 90, push = 0, bloom = .4 }) => {
  const e = deviFor(d.day), D = e.draw, pl = e.place ?? { x: 500, y: 720 + dy, s: 1.28 };
  return (
    <g transform={`translate(540 1000) scale(${1 + push * .06}) translate(-540 -1000)`}>
      <Landscape t={t} />
      <g transform={`translate(${pl.x} ${pl.y}) scale(${pl.s})`}><D hex={d.colour.hex} life={life(t, d.day, bloom)} /></g>
    </g>
  );
};

// the page tinted with a light wash of the day's colour (brief: border and background in the day's accent)
const wash = (hex: string) => { const n = parseInt(hex.slice(1), 16), P0 = [241, 231, 207], c = [n >> 16, (n >> 8) & 255, n & 255]; return '#' + P0.map((p, i) => Math.round(p + (c[i] - p) * .16).toString(16).padStart(2, '0')).join(''); };

// ---------------------------------------------------------------- Format C · शुभकामना (13 s)
export const C_DUR = 13;
const GREET_Z = { x: 110, y: 300, w: 860, h: 170 };
export const C_SCENES: Scene[] = [{ id: 'diya', from: 0, to: 3 }, { id: 'portrait', from: 3, to: 10 }, { id: 'brand', from: 10, to: C_DUR }];
export const FormatCFrame: React.FC<{ t: number; day: number }> = ({ t, day }) => {
  const d = days[day - 1], hex = d.colour.hex;
  const lit = seg(t, .5, 1.6), rv = reveal(Math.max(0, t - 2.4), 1.1), show = seg(t, 2.6, 3.2);
  const text = seg(t, 4.4, 5.4), brand = seg(t, 10, 10.8);
  return (
    <PahariPage border={hex} reveal={rv} shimmer={rv.shimmer} windowFill={wash(hex)}
      painting={<>
        <g opacity={show}><Portrait d={d} t={t} push={seg(t, 3, 13)} bloom={.35 + .3 * Math.sin(Math.PI * seg(t, 3, 6))} /></g>
        <RevealCtx.Provider value={{ line: 1, fill: 1, shimmer: -1 }}><Diya x={show > 0 ? 880 : 540} y={show > 0 ? 1470 : 900} s={show > 0 ? .9 : 2.2} flame={t} glow={lit} /></RevealCtx.Provider>
        {t > 3.2 && <Petals t={t - 3.2} n={22} from={0} avoid={[GREET_Z]} />}
      </>}
      overlay={<>
        <TextZone id="greet" z={GREET_Z} opacity={text * (1 - brand)}><T size={112} color={P.border} font={FONT.rozha}>शुभ नवरात्रि</T></TextZone>
        <TextZone id="c-lines" z={{ x: 90, y: 1592, w: 900, h: 248 }} opacity={text * (1 - brand)}>
          <T size={46} color={P.ink} font={FONT.rozha}>{d.dayNameHi} · {d.devi.nameHi}</T>
          <T size={42} color={shade(hex === '#F2EFE6' ? '#8A7A5A' : hex, -.35)} mt={6}>{d.mantra}</T>
          <T size={24} color={P.goldDeep} mt={10}>{PAHARI_LINE}</T>
        </TextZone>
        {brand > 0 && <BrandStrip a={brand} />}
      </>} />
  );
};

// ---------------------------------------------------------------- Format B · आज की देवी (≈20–24 s; the full end card is appended later)
// Sections follow the recorded lines (scripts/fit_b.py -> b-timeline.json): title / attributes / colour + bhog / mantra.
type BT = { dur: number; lines: { id: string; text: string; at: number; dur: number }[]; scenes: Scene[] };
export const bTimeline = (day: number): BT | null => (btl as Record<string, BT>)[String(day)] ?? null;
export const bFrames = (day: number) => Math.round((bTimeline(day)?.dur ?? 25) * FPS);
const CALLOUT_Z = { x: 150, y: 120, w: 780, h: 150 };
export const FormatBFrame: React.FC<{ t: number; day: number }> = ({ t, day }) => {
  const d = days[day - 1], hex = d.colour.hex, rv = reveal(t, 1.2), tl = bTimeline(day)!;
  const sc = (id: string) => tl.scenes.find((x) => x.id === id)!;
  const T0 = sc('title'), A = sc('attributes'), C = sc('colour'), MN = sc('mantra');
  const cues: Cue[] = tl.lines.filter((l) => !l.text.startsWith('मंत्र')).flatMap((l) => split(l.text, l.at, l.at + l.dur));
  const title = Math.min(seg(t, .5, 1.2), 1 - seg(t, T0.to - .4, T0.to));
  const per = (A.to - A.from) / d.calloutsHi.length;
  const k = t >= A.from && t < A.to ? Math.min(d.calloutsHi.length - 1, Math.floor((t - A.from) / per)) : -1, ku = t - A.from - k * per;
  const cA = k >= 0 ? Math.min(easeBack(seg(ku, 0, .45)), 1 - seg(ku, per - .35, per)) : 0;
  const col = t >= C.from && t < C.to ? Math.min(seg(t, C.from, C.from + .5), 1 - seg(t, C.to - .35, C.to)) : 0, mantra = seg(t, MN.from, MN.from + .5);
  return (
    <PahariPage border={hex} reveal={rv} shimmer={rv.shimmer}
      painting={<><Portrait d={d} t={t} push={seg(t, 0, tl.dur)} /><Petals t={t} n={12} avoid={[{ x: 110, y: 100, w: 860, h: 360 }]} /></>}
      overlay={<>
        {title > 0 && <TitleCard title={d.devi.nameHi} artLine={PAHARI_LINE} series={`नवरात्रि · ${d.dayNameHi}`} a={title} z={{ x: 130, y: 110, w: 820, h: 300 }} />}
        {k >= 0 && <>
          <div data-kind="surface" style={{ position: 'absolute', left: CALLOUT_Z.x + 110, top: CALLOUT_Z.y + 20, width: CALLOUT_Z.w - 220, height: CALLOUT_Z.h - 40, background: P.hartal, border: `2px solid ${P.ink}`, boxShadow: `inset 0 0 0 5px ${P.hartal}, inset 0 0 0 7px ${hex}`, opacity: cA, transform: `scale(${.9 + .1 * cA})` }} />
          <TextZone id="callout" z={CALLOUT_Z} opacity={cA}><T size={50} color={P.ink} font={FONT.rozha}>{d.calloutsHi[k]}</T></TextZone>
        </>}
        {col > 0 && <>
          <div data-kind="surface" style={{ position: 'absolute', left: 170, top: 120, width: 740, height: 330, background: P.hartal, border: `2px solid ${P.ink}`, opacity: col }} />
          <div data-kind="surface" style={{ position: 'absolute', left: 210, top: 170, width: 120, height: 120, borderRadius: 60, background: hex, border: `3px solid ${P.ink}`, opacity: col }} />
          <TextZone id="colour" z={{ x: 350, y: 140, w: 540, h: 170 }} opacity={col}><T size={36} color={P.ink}>आज का रंग</T><T size={60} color={shade(hex === '#F2EFE6' ? '#8A7A5A' : hex, -.3)} font={FONT.rozha}>{d.colour.nameHi}</T></TextZone>
          <TextZone id="bhog" z={{ x: 190, y: 320, w: 700, h: 110 }} opacity={col}><T size={d.bhogHi.length > 20 ? 30 : 40} color={P.ink}>भोग · {d.bhogHi}</T></TextZone>
        </>}
        {mantra > 0 && <TextZone id="mantra" z={{ x: 110, y: 150, w: 860, h: 260 }} opacity={mantra}><T size={34} color={P.ink}>मंत्र</T><T size={62} color={P.border} font={FONT.rozha}>{d.mantra}</T></TextZone>}
        <Subtitles cues={cues} t={t} z={{ x: 90, y: 1600, w: 900, h: 230 }} color={P.ink} />
      </>} />
  );
};
export const FormatB: React.FC<{ day: number }> = ({ day }) => { const f = useCurrentFrame(); return <FormatBFrame t={f / FPS} day={day} />; };
const CHECK_B = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => makeCheck(({ t }) => <FormatBFrame t={t} day={d} />, [], { x0: PAGE.win.x, y0: PAGE.win.y, x1: PAGE.win.x + PAGE.win.w, y1: PAGE.win.y + PAGE.win.h }));
export const FormatBCheck: React.FC<{ day: number }> = ({ day }) => { const C = CHECK_B[day - 1]; return <C />; };

export const FormatC: React.FC<{ day: number }> = ({ day }) => { const f = useCurrentFrame(); return <FormatCFrame t={f / FPS} day={day} />; };
const CHECK_C = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => makeCheck(({ t }) => <FormatCFrame t={t} day={d} />, C_SCENES, { x0: PAGE.win.x, y0: PAGE.win.y, x1: PAGE.win.x + PAGE.win.w, y1: PAGE.win.y + PAGE.win.h }));
export const FormatCCheck: React.FC<{ day: number }> = ({ day }) => { const C = CHECK_C[day - 1]; return <C />; };
