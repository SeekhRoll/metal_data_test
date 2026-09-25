import React from 'react';
import { C } from '../styles/palette';
import { Defs, Paper, PigmentVeil } from '../styles/filters';
import { Bharni } from '../styles/paint';
import { MadhubaniBorder } from '../borders/MadhubaniBorder';
import { FONT } from '../styles/fonts';
import { CUES, W, H } from './timeline';
import { seg, easeOut } from './anim';

// Every frame: handmade paper, painted content with subtle line boil (new seed every 2 frames),
// the motif border (brief: borders on every frame), pigment unevenness, burned-in subtitle cartouche.
export const Frame: React.FC<{ frame: number; t: number; border?: number; subtitles?: boolean; children: React.ReactNode }> = ({ frame, t, border = 1, subtitles = true, children }) => (
  <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
    <Defs boilSeed={Math.floor(frame / 2) % 997 + 1} boil={2.2} />
    <Paper w={W} h={H} />
    <g filter="url(#boil)">
      {children}
      <MadhubaniBorder w={W} h={H} draw={border} />
      {subtitles && <Cartouche t={t} />}
    </g>
    {subtitles && <SubtitleText t={t} />}
    <PigmentVeil w={W} h={H} />
  </svg>
);

const cueAt = (t: number) => CUES.find(c => t >= c.from - .25 && t <= c.to + .2);
const alphaOf = (t: number, c: { from: number; to: number }) => easeOut(seg(t, c.from - .25, c.from + .1)) * (1 - seg(t, c.to - .1, c.to + .2));

// rough Devanagari line breaking by estimated width
export function wrap(text: string, maxW: number, size: number): string[] {
  const words = text.split(' '), lines: string[] = [];
  let cur = '';
  const est = (s: string) => [...s].reduce((w, ch) => w + (/[ऀ-ःऺ-ॏ॑-ॗॢॣ]/.test(ch) ? 0.06 : 0.6), 0) * size;
  for (const w of words) { const nxt = cur ? cur + ' ' + w : w; if (est(nxt) > maxW && cur) { lines.push(cur); cur = w; } else cur = nxt; }
  if (cur) lines.push(cur);
  return lines;
}

const Cartouche: React.FC<{ t: number }> = ({ t }) => {
  const c = cueAt(t); if (!c) return null;
  const a = alphaOf(t, c), n = wrap(c.text, 720, 48).length;
  const h = 64 + n * 62, y0 = 1768 - h;
  return (
    <g opacity={a}>
      <Bharni d={`M140 ${y0} C360 ${y0 - 14} 720 ${y0 - 14} 940 ${y0} L940 1768 C720 1782 360 1782 140 1768 Z`} fill={C.paper} band={4} bandFill={C.turmericLight} />
    </g>
  );
};
const SubtitleText: React.FC<{ t: number }> = ({ t }) => {
  const c = cueAt(t); if (!c) return null;
  const a = alphaOf(t, c), lines = wrap(c.text, 720, 48), h = 64 + lines.length * 62, y0 = 1768 - h;
  return (
    <g opacity={a}>
      {lines.map((l, i) => <text key={i} x={540} y={y0 + 74 + i * 62} textAnchor="middle" fontFamily={FONT.tiro} fontSize={48} fill={C.black}>{l}</text>)}
    </g>
  );
};

// helpers for placing drawings
export const Place: React.FC<{ x: number; y: number; s?: number; flip?: boolean; children: React.ReactNode }> = ({ x, y, s = 1, flip, children }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>{children}</g>
);
