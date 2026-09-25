import React, { useLayoutEffect, useRef } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { StageSvg, BaseText } from '../stage/Stage';
import { STAGE, TEXT_ZONES } from '../stage/palette';
import { FONT } from '../stage/fonts';
import { seg } from '../stage/motion';
import { FPS, SCENES, lampLevel, sceneAt } from './timeline';
import { S1, S2, S3 } from './scenes/Opening';
import { S4, S5, S6 } from './scenes/Squirrel';
import { S7, S8 } from './scenes/Ending';
import SUBS from './subs.json';

const BODY: Record<string, React.FC<{ t: number }>> = { S1, S2, S3, S4, S5, S6, S7, S8 };

// subtitles (and the moral in scene 7) live only in the base-panel text zone
const Subtitle: React.FC<{ t: number }> = ({ t }) => {
  const c = (SUBS as { from: number; to: number; lines: string[] }[]).find(s => t >= s.from && t < s.to);
  if (!c) return null;
  const a = Math.min(seg(t, c.from, c.from + .18), 1 - seg(t, c.to - .18, c.to));
  return <BaseText lines={c.lines} size={54} opacity={a} />;
};
const Moral: React.FC<{ t: number }> = ({ t }) => {
  const a = seg(t, 46.6, 47.1) * (1 - seg(t, 51.5, 51.95));
  if (a <= 0) return null;
  return <BaseText lines={['कोई काम छोटा नहीं होता,', 'अगर मन पूरा हो।']} size={62} color="#F6C860" opacity={a} />;
};

export const FilmFrame: React.FC<{ t: number }> = ({ t }) => {
  const sc = sceneAt(t), Body = BODY[sc.id], lamp = lampLevel(t);
  return (
    <StageSvg t={t} lit={lamp.lit} spread={lamp.spread}
      screen={<g data-scene={sc.id}><Body t={t} /></g>}
      base={<><Subtitle t={t} /><Moral t={t} /></>} />
  );
};

// ---------------------------------------------------------------- brief §4.5: automated text / graphics collision check
// Every text node's box (padded by 24 px) must not touch any graphic node's box. Graphics inside the cloth are
// clipped to the screen rectangle (they cannot be seen outside it). Throwing fails the render with a report.
const PAD = 24;
type Box = { x0: number; y0: number; x1: number; y1: number };
function boxes(svg: SVGSVGElement, kind: string): { id: string; b: Box }[] {
  const r0 = svg.getBoundingClientRect(), k = 1080 / r0.width;
  const scr = STAGE.screen;
  return Array.from(svg.querySelectorAll(`[data-kind="${kind}"]`)).map((el) => {
    const r = el.getBoundingClientRect();
    let b: Box = { x0: (r.left - r0.left) * k, y0: (r.top - r0.top) * k, x1: (r.right - r0.left) * k, y1: (r.bottom - r0.top) * k };
    if (el.closest('[data-clip="screen"]')) b = { x0: Math.max(b.x0, scr.x), y0: Math.max(b.y0, scr.y), x1: Math.min(b.x1, scr.x + scr.w), y1: Math.min(b.y1, scr.y + scr.h) };
    const id = (el.closest('[data-id]') as HTMLElement | null)?.dataset.id || el.getAttribute('data-id') || el.tagName;
    return { id, b };
  }).filter(({ b }) => b.x1 > b.x0 && b.y1 > b.y0);
}
export function collisions(svg: SVGSVGElement): string[] {
  const texts = boxes(svg, 'text'), graphics = boxes(svg, 'graphic'), z = TEXT_ZONES.subtitle, out: string[] = [];
  for (const t of texts) {
    const b = { x0: t.b.x0 - PAD, y0: t.b.y0 - PAD, x1: t.b.x1 + PAD, y1: t.b.y1 + PAD };
    if (t.b.x0 < z.x || t.b.x1 > z.x + z.w || t.b.y0 < z.y || t.b.y1 > z.y + z.h) out.push(`${t.id} leaves the subtitle zone`);
    for (const g of graphics) if (b.x0 < g.b.x1 && g.b.x0 < b.x1 && b.y0 < g.b.y1 && g.b.y0 < b.y1) out.push(`${t.id} x ${g.id}`);
  }
  return out;
}

// Film: the 60 s film. FilmCheck: every 6th frame of the film, with the collision check on.
export const Film: React.FC = () => <AbsoluteFill style={{ background: '#000' }}><FilmFrame t={useCurrentFrame() / FPS} /></AbsoluteFill>;
export const FilmCheck: React.FC = () => {
  const f = useCurrentFrame() * 6, t = f / FPS, ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const svg = ref.current!.querySelector('svg')!;
    const hits = collisions(svg);
    if (hits.length) throw new Error(`TEXT COLLISION · scene ${sceneAt(t).id} · frame ${f} (${t.toFixed(2)} s): ${[...new Set(hits)].join('; ')}`);
  }, [f]);
  return <AbsoluteFill ref={ref} style={{ background: '#000' }}><FilmFrame t={t} /></AbsoluteFill>;
};
export { SCENES };
