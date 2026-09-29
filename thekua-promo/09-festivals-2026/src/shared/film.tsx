import React, { useLayoutEffect, useRef } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { seg, ease } from '../styles/pahari/rand';
import { TextZone, T, Zone } from './text';
import { FONT } from '../style/fonts';

export const FPS = 24;
export type Scene = { id: string; from: number; to: number };
export const sceneAt = (scenes: Scene[], t: number) => scenes.find((s) => t >= s.from && t < s.to) ?? scenes[scenes.length - 1];

// replacement animation on twos: character motion samples time on even frames only
export const onTwos = (t: number) => Math.floor(t * FPS / 2) * 2 / FPS;

// Reverential transitions: fade to near-dark at each scene boundary, then return (no energetic wipes)
export function darkness(scenes: Scene[], t: number, fade = .7, floor = .88) {
  let d = 0;
  for (const s of scenes) {
    if (t >= s.from && t < s.from + fade && s.from > 0) d = Math.max(d, 1 - seg(t, s.from, s.from + fade));
    if (t >= s.to - fade && t < s.to) d = Math.max(d, seg(t, s.to - fade, s.to));
  }
  return d * floor;
}

// fine-line reveal at the start of a scene: outline draws on, then colour fills in, then the gold shimmer passes
export function reveal(u: number, speed = 1) {
  return { line: ease(seg(u, 0, 1.3 / speed)), fill: ease(seg(u, .9 / speed, 1.9 / speed)), shimmer: u > 1.7 / speed && u < 3.2 / speed ? seg(u, 1.7 / speed, 3.2 / speed) : -1 };
}

// blink every few seconds (deterministic per character)
export const blinkAt = (t: number, seed = 0) => { const p = (t + seed * 1.37) % (3.3 + (seed % 3) * .6); return p < .12 ? 1 : 0; };

// ---------------------------------------------------------------- subtitles: ≤2 lines, ≈28 chars a line (brief)
export type Cue = { from: number; to: number; lines: string[] };
export function splitCues(text: string, from: number, to: number, max = 28): Cue[] {
  const words = text.replace(/\s+/g, ' ').trim().split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) { if ((cur + ' ' + w).trim().length > max && cur) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); }
  if (cur) lines.push(cur);
  const cards: string[][] = [];
  for (let i = 0; i < lines.length; i += 2) cards.push(lines.slice(i, i + 2));
  const total = cards.reduce((a, c) => a + c.join('').length, 0);
  let t = from;
  return cards.map((c) => { const d = (to - from) * c.join('').length / total; const cue = { from: t, to: t + d, lines: c }; t += d; return cue; });
}
export const Subtitles: React.FC<{ cues: Cue[]; t: number; z: Zone; size?: number; color: string }> = ({ cues, t, z, size = 46, color }) => {
  const c = cues.find((q) => t >= q.from && t < q.to + .25);
  if (!c) return null;
  const a = Math.min(seg(t, c.from, c.from + .2), 1 - seg(t, c.to + .05, c.to + .25));
  return <TextZone id="subtitle" z={z} opacity={a}>{c.lines.map((l, i) => <T key={i} size={size} color={color} font={FONT.tiro}>{l}</T>)}</TextZone>;
};

// ---------------------------------------------------------------- automated text-collision check (brief §10): 24 px padding
const PAD = 24;
type Box = { id: string; x0: number; y0: number; x1: number; y1: number };
// effective opacity through the ancestors: fully faded elements are not on screen and are skipped
function alpha(el: Element | null, root: Element) {
  let a = 1;
  for (let e = el; e && e !== root; e = e.parentElement) { a *= parseFloat(getComputedStyle(e).opacity || '1'); const o = e.getAttribute('opacity'); if (o !== null) a *= parseFloat(o); }
  return a;
}
function boxes(root: HTMLElement, kind: string): Box[] {
  const r0 = root.getBoundingClientRect(), k = 1080 / r0.width;
  return Array.from(root.querySelectorAll(`[data-kind="${kind}"]`)).filter((el) => alpha(el, root) > .02).map((el, i) => {
    const b = el.getBoundingClientRect();
    return { id: el.getAttribute('data-id') ?? `${kind}${i}`, x0: (b.left - r0.left) * k, y0: (b.top - r0.top) * k, x1: (b.right - r0.left) * k, y1: (b.bottom - r0.top) * k };
  }).filter((b) => b.x1 > b.x0 && b.y1 > b.y0);
}
// graphics are clipped to the painting window, so only the visible part of their box counts
export type Clip = { x0: number; y0: number; x1: number; y1: number };
export function collisions(root: HTMLElement, clip?: Clip) {
  const out: string[] = [];
  const gs = boxes(root, 'graphic').map((g) => clip ? { ...g, x0: Math.max(g.x0, clip.x0), y0: Math.max(g.y0, clip.y0), x1: Math.min(g.x1, clip.x1), y1: Math.min(g.y1, clip.y1) } : g).filter((g) => g.x1 > g.x0 && g.y1 > g.y0);
  for (const t of boxes(root, 'text')) for (const g of gs)
    if (t.x0 - PAD < g.x1 && g.x0 < t.x1 + PAD && t.y0 - PAD < g.y1 && g.y0 < t.y1 + PAD) out.push(`${t.id} x ${g.id}`);
  return out;
}
export function makeCheck(Frame: React.FC<{ t: number }>, scenes: Scene[], clip?: Clip) {
  const C: React.FC = () => {
    const f = useCurrentFrame() * 6, t = f / FPS, ref = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
      const hits = collisions(ref.current!, clip);
      if (hits.length) throw new Error(`TEXT COLLISION · scene ${sceneAt(scenes, t)?.id ?? "-"} · frame ${f} (${t.toFixed(2)} s): ${[...new Set(hits)].slice(0, 8).join('; ')}`);
    }, [f]);
    return <AbsoluteFill ref={ref}><Frame t={t} /></AbsoluteFill>;
  };
  return C;
}
