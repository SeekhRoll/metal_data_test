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

// Format A · देवी कथा: one scene per VO line (scripts/fit_a.py -> a-timeline.json), in the day's own art form.
type AT = { dur: number; lines: { id: string; text: string; at: number; dur: number }[]; scenes: Scene[] };
type Story = { page: 'pahari' | 'sanjhi'; scenes: React.FC<{ t: number; u: number; dur: number }>[]; moralFrom: number };
const STORIES: Record<number, Story> = { 1: DAY1, 2: DAY2 };
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
  const texts = <>
    {title > 0 && <TitleCard title={d.story.titleHi} artLine={d.artForm.titleLineHi} series={SERIES(day)} a={title} />}
    {moral && <TextZone id="moral" z={{ x: 90, y: 1600, w: 900, h: 230 }} opacity={seg(t, moralLine.at - .3, moralLine.at + .4)}><T size={d.story.moralHi.length > 44 ? 38 : 44} color={P.borderDeep} font={FONT.rozha}>{d.story.moralHi}</T></TextZone>}
    {!moral && <Subtitles cues={cues} t={t} z={{ x: 90, y: 1600, w: 900, h: 230 }} color={P.ink} />}
  </>;
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
const CLIP = { x0: 40, y0: 40, x1: 1040, y1: 1580 };
const CHECK_A = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => makeCheck(({ t }) => <FormatAFrame t={t} day={d} />, [], CLIP));
export const FormatACheck: React.FC<{ day: number }> = ({ day }) => { const C = CHECK_A[day - 1]; return <C />; };
