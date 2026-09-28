import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { P, PAGE } from '../styles/pahari/palette';
import { PahariPage } from '../styles/pahari/Page';
import { PahariDefs, RevealCtx } from '../styles/pahari/paint';
import { seg, ease } from '../styles/pahari/rand';
import { LaceDefs, PaperTexDefs, SJ } from '../styles/sanjhi/kit';
import { TitleCard } from '../shared/TitleCard';
import { TextZone, T } from '../shared/text';
import { FONT } from '../style/fonts';
import { FPS, reveal, Subtitles, splitCues, Cue, makeCheck, Scene } from '../shared/film';
import days from '../../data/navratri-days.json';
import atl from './a-timeline.json';
import { DAY1 } from '../stories/day1';
import { DAY2 } from '../stories/day2';
import { DAY3 } from '../stories/day3';
import { DAY4 } from '../stories/day4';
import { DAY5 } from '../stories/day5';
import { DAY6 } from '../stories/day6';
import { DAY8 } from '../stories/day8';
import { MysorePage } from '../sheets/MysoreSheets';
import { ScrollPage } from '../sheets/BengalSheets';
import { FloralBand } from '../styles/bengalpat/kit';
import { MuralPage } from '../sheets/KeralaSheets';
import { DAY7, litFor } from '../stories/day7';
import { StageSvg } from '../styles/shadow/Stage';
import { K as KK, KolamDefs, Floor as KFloor, Flour as KFlour } from '../styles/kolam/kit';
import { Defs as MDefs, Paper as MPaper, PigmentVeil } from '../styles/madhubani/filters';
import { MadhubaniBorder } from '../styles/madhubani/MadhubaniBorder';
import { C as MC } from '../styles/madhubani/palette';

// Format A · देवी कथा: one scene per VO line (scripts/fit_a.py -> a-timeline.json), in the day's own art form.
type AT = { dur: number; lines: { id: string; text: string; at: number; dur: number }[]; scenes: Scene[] };
type Story = { page: 'pahari' | 'sanjhi' | 'madhubani' | 'kolam' | 'shadow' | 'kerala' | 'bengal' | 'mysore'; panelOf?: number[]; scenes: React.FC<{ t: number; u: number; dur: number }>[]; moralFrom: number };
const STORIES: Record<number, Story> = { 1: DAY1, 2: DAY2, 3: DAY3, 4: DAY4, 5: DAY5, 6: DAY6, 7: DAY7, 8: DAY8 };
export const aTimeline = (d: number): AT | null => (atl as Record<string, AT>)[String(d)] ?? null;
export const aFrames = (d: number) => Math.round((aTimeline(d)?.dur ?? 50) * FPS);
export const hasStory = (d: number) => !!STORIES[d] && !!aTimeline(d);
const SERIES = (d: number) => `नवरात्रि · नौ देवियाँ, नौ कलाएँ · दिन ${days[d - 1].dayNumHi}`;

export const FormatAFrame: React.FC<{ t: number; day: number }> = ({ t, day }) => {
  const d = days[day - 1], tl = aTimeline(day)!, st = STORIES[day];
  const i = Math.max(0, tl.scenes.findIndex((s) => t >= s.from && t < s.to)), idx = i < 0 ? tl.scenes.length - 1 : i;
  const sc = tl.scenes[idx], u = t - sc.from, dur = sc.to - sc.from, Scene = st.scenes[Math.min(idx, st.scenes.length - 1)];
  const moral = idx >= st.moralFrom, moralLine = tl.lines[st.moralFrom];
  const cues: Cue[] = tl.lines.filter((_, k) => k < st.moralFrom).flatMap((l) => splitCues(l.text, l.at, l.at + l.dur));
  const title = idx === 0 ? Math.min(seg(u, 1.2, 2), 1 - seg(u, dur - .5, dur)) : 0;
  const dark = st.page === 'kolam' || st.page === 'shadow', ink = dark ? '#F4E2BC' : P.ink;
  const texts = <>
    {title > 0 && st.page !== 'shadow' && (dark
      ? <TextZone id="title" z={{ x: 130, y: 150, w: 820, h: 330 }} opacity={title}><T size={96} color="#F6F1E6" font={FONT.rozha}>{d.story.titleHi}</T><T size={38} color="#F6F1E6" mt={8}>{d.artForm.titleLineHi}</T><T size={30} color="#F2C06A" mt={12}>{SERIES(day)}</T></TextZone>
      : <TitleCard title={d.story.titleHi} artLine={d.artForm.titleLineHi} series={SERIES(day)} a={title} />)}
    {moral && <TextZone id="moral" z={{ x: 90, y: 1600, w: 900, h: 230 }} opacity={seg(t, moralLine.at - .3, moralLine.at + .4)}><T size={d.story.moralHi.length > 44 ? 38 : 44} color={dark ? '#F2C06A' : P.borderDeep} font={FONT.rozha}>{d.story.moralHi}</T></TextZone>}
    {!moral && <Subtitles cues={cues} t={t} z={{ x: 90, y: 1620, w: 900, h: 230 }} color={ink} />}
  </>;
  if (st.page === 'shadow') {
    // reuses the Chhaya Katha engine: lamp-lit screen, carved frame; subtitles on the base panel. Title is the placard puppet.
    const lit = litFor(idx, u) * (idx > 0 && u < .5 ? .4 + 1.2 * u : 1);
    return (
      <AbsoluteFill style={{ background: '#140C08' }}>
        <StageSvg t={t} lit={lit} spread={.8} screen={<Scene t={t} u={u} dur={dur} />} />
        {texts}
      </AbsoluteFill>
    );
  }
  if (st.page === 'kolam') {
    const fade = idx > 0 && u < .6 ? ease(seg(u, 0, .6)) : 1;
    return (
      <AbsoluteFill style={{ background: KK.floorDeep }}>
        <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
          <KolamDefs /><KFloor />
          <g opacity={fade}><Scene t={t} u={u} dur={dur} /></g>
          <rect x={60} y={1610} width={960} height={270} fill={KK.floorDeep} opacity={.6} />
          <KFlour d="M70 1600 H1010" w={3} />
        </svg>
        {texts}
      </AbsoluteFill>
    );
  }
  if (st.page === 'madhubani') {
    // brief: reuse the Madhubani engine (bharni double lines, motif border, line boil); text sits on a paper cartouche
    const f = Math.round(t * FPS), sl = idx > 0 && u < .6 ? ease(seg(u, 0, .6)) : 1;
    return (
      <AbsoluteFill style={{ background: MC.paper }}>
        <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
          <MDefs boilSeed={Math.floor(f / 2) % 997 + 1} boil={2.2} />
          <MPaper w={1080} h={1920} />
          <g filter="url(#boil)">
            <g opacity={sl}><Scene t={t} u={u} dur={dur} /></g>
            <rect x={100} y={1586} width={880} height={250} rx={20} fill={MC.paper} stroke={MC.black} strokeWidth={4} />
            <rect x={112} y={1598} width={856} height={226} rx={14} fill="none" stroke={MC.vermilion} strokeWidth={3} />
            <MadhubaniBorder w={1080} h={1920} draw={1} />
          </g>
          <PigmentVeil w={1080} h={1920} />
        </svg>
        {texts}
      </AbsoluteFill>
    );
  }
  if (st.page === 'bengal') {
    // the Patua scroll: panels stacked down the cloth; the camera travels down to each new panel as its scene begins
    const PH = 1660, pan = st.panelOf ?? st.scenes.map((_, k) => k), p = pan[idx], pp = idx > 0 ? pan[idx - 1] : p;
    const k = p !== pp && u < 1.1 ? ease(seg(u, 0, 1.1)) : 1, camY = (pp + (p - pp) * k) * PH;
    const Prev = idx > 0 ? st.scenes[idx - 1] : null, pv = idx > 0 ? tl.scenes[idx - 1] : null;
    return <ScrollPage overlay={texts}><g transform={`translate(0 ${-camY})`}>
      {k < 1 && Prev && pv && <g transform={`translate(0 ${pp * PH})`}><Prev t={t} u={t - pv.from} dur={pv.to - pv.from} /><FloralBand y={1590} /></g>}
      <g transform={`translate(0 ${p * PH})`}><Scene t={t} u={u} dur={dur} /><FloralBand y={1590} /><FloralBand y={-70} /></g>
    </g></ScrollPage>;
  }
  if (st.page === 'mysore') {
    const fade = idx > 0 && u < .8 ? ease(seg(u, 0, .8)) : 1;
    const Prev = idx > 0 ? st.scenes[idx - 1] : null, pv = idx > 0 ? tl.scenes[idx - 1] : null;
    return <MysorePage overlay={texts}>{fade < 1 && Prev && pv && <Prev t={t} u={t - pv.from} dur={pv.to - pv.from} />}<g opacity={fade}><Scene t={t} u={u} dur={dur} /></g></MysorePage>;
  }
  if (st.page === 'kerala') {
    // the mural wall: foliage ground inside painted frame bands; scenes cross-fade like a lamp moving along the wall
    const fade = idx > 0 && u < .6 ? ease(seg(u, 0, .6)) : 1;
    const Prev = idx > 0 ? st.scenes[idx - 1] : null, pv = idx > 0 ? tl.scenes[idx - 1] : null;
    return <MuralPage overlay={texts}>{fade < 1 && Prev && pv && <Prev t={t} u={t - pv.from} dur={pv.to - pv.from} />}<g opacity={fade}><Scene t={t} u={u} dur={dur} /></g></MuralPage>;
  }
  if (st.page === 'sanjhi') {
    return (
      <AbsoluteFill style={{ background: '#2A2420' }}>
        <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
          <PahariDefs /><LaceDefs /><PaperTexDefs />
          <RevealCtx.Provider value={{ line: 1, fill: 1, shimmer: -1 }}><Scene t={t} u={u} dur={dur} /></RevealCtx.Provider>
          <rect x={40} y={1600} width={1000} height={280} fill={SJ.paper} />
          <rect x={52} y={1612} width={976} height={256} fill="none" stroke={SJ.paperShade} strokeWidth={3} />
        </svg>
        {texts}
      </AbsoluteFill>
    );
  }
  // Pahari: a painted-panel slide between scenes, like turning the pages of a miniature album
  const slide = idx > 0 && u < .7 ? ease(seg(u, 0, .7)) : 1;
  const Prev = idx > 0 ? st.scenes[Math.min(idx - 1, st.scenes.length - 1)] : null, pv = idx > 0 ? tl.scenes[idx - 1] : null;
  const rv = reveal(idx === 0 ? Math.max(0, u - .2) : 9, .9);
  return (
    <PahariPage reveal={rv} shimmer={rv.shimmer} painting={<>
      {slide < 1 && Prev && pv && <g transform={`translate(${-slide * PAGE.W} 0)`}><Prev t={t} u={t - pv.from} dur={pv.to - pv.from} /></g>}
      <g transform={`translate(${(1 - slide) * PAGE.W} 0)`}><Scene t={t} u={u} dur={dur} /></g>
    </>} overlay={texts} />
  );
};

export const FormatA: React.FC<{ day: number }> = ({ day }) => { const f = useCurrentFrame(); return <FormatAFrame t={f / FPS} day={day} />; };
const CLIP = { x0: 40, y0: 40, x1: 1040, y1: 1580 };  // Madhubani cartouche starts at 1586
const CHECK_A = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => makeCheck(({ t }) => <FormatAFrame t={t} day={d} />, [], CLIP));
export const FormatACheck: React.FC<{ day: number }> = ({ day }) => { const C = CHECK_A[day - 1]; return <C />; };
