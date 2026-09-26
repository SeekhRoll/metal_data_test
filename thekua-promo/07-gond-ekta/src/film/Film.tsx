import React, { useLayoutEffect, useRef } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, W, H, BAND, TEXT_ZONES } from '../style/palette';
import { seg } from '../style/motion';
import { TextureDefs, Texture } from '../style/texture';
import { FPS, sceneAt, ground, lerpCol } from './timeline';
import { S1, S2, S3, S4, S5, S6, S7, S8 } from './scenes';
import { Band, SubtitleText, TITLE_ZONE } from './text';
import SUBS from './subs.json';

const BODY: Record<string, React.FC<{ t: number; frame: number }>> = { S1, S2, S3, S4, S5, S6, S7, S8 };

export const FilmFrame: React.FC<{ t: number; frame: number }> = ({ t, frame }) => {
  const sc = sceneAt(t), Body = BODY[sc.id], g = ground(t);
  const c = (SUBS as { from: number; to: number; lines: string[] }[]).find(s => t >= s.from && t < s.to);
  const subA = c ? Math.min(seg(t, c.from, c.from + .18), 1 - seg(t, c.to - .18, c.to)) : 0;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
      <TextureDefs />
      <defs><clipPath id="stage"><rect x={0} y={0} width={W} height={BAND.y} /></clipPath></defs>
      <rect width={W} height={H} fill={lerpCol(C.paper, C.night, g.k)} />
      <g clipPath="url(#stage)" data-clip="screen" data-scene={sc.id}><Body t={t} frame={frame} /></g>
      <Band night={g.k} />
      {c && <SubtitleText lines={c.lines} night={g.k} opacity={subA} />}
      <Texture w={W} h={H} dark={g.k > .5} />
    </svg>
  );
};

// ---------------------------------------------------------------- brief §4.5: automated text / graphics collision check
const PAD = 24;
type Box = { x0: number; y0: number; x1: number; y1: number };
function boxes(svg: SVGSVGElement, kind: string): { id: string; b: Box }[] {
  const r0 = svg.getBoundingClientRect(), k = W / r0.width;
  return Array.from(svg.querySelectorAll(`[data-kind="${kind}"]`)).map((el) => {
    const r = el.getBoundingClientRect();
    let b: Box = { x0: (r.left - r0.left) * k, y0: (r.top - r0.top) * k, x1: (r.right - r0.left) * k, y1: (r.bottom - r0.top) * k };
    if (el.closest('[data-clip="screen"]')) b = { x0: Math.max(b.x0, 0), y0: Math.max(b.y0, 0), x1: Math.min(b.x1, W), y1: Math.min(b.y1, BAND.y) };
    const id = (el.closest('[data-id]') as HTMLElement | null)?.dataset.id || el.tagName;
    return { id, b };
  }).filter(({ b }) => b.x1 > b.x0 && b.y1 > b.y0);
}
export function collisions(svg: SVGSVGElement): string[] {
  const texts = boxes(svg, 'text'), graphics = boxes(svg, 'graphic'), out: string[] = [];
  for (const t of texts) {
    const b = { x0: t.b.x0 - PAD, y0: t.b.y0 - PAD, x1: t.b.x1 + PAD, y1: t.b.y1 + PAD };
    for (const g of graphics) if (b.x0 < g.b.x1 && g.b.x0 < b.x1 && b.y0 < g.b.y1 && g.b.y0 < b.y1) out.push(`${t.id} x ${g.id}`);
  }
  return out;
}
export const Film: React.FC = () => { const f = useCurrentFrame(); return <AbsoluteFill style={{ background: C.paper }}><FilmFrame t={f / FPS} frame={f} /></AbsoluteFill>; };
export const FilmCheck: React.FC = () => {
  const f = useCurrentFrame() * 6, t = f / FPS, ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const hits = collisions(ref.current!.querySelector('svg')!);
    if (hits.length) throw new Error(`TEXT COLLISION · scene ${sceneAt(t).id} · frame ${f} (${t.toFixed(2)} s): ${[...new Set(hits)].slice(0, 8).join('; ')}`);
  }, [f]);
  return <AbsoluteFill ref={ref} style={{ background: C.paper }}><FilmFrame t={t} frame={f} /></AbsoluteFill>;
};
export { TEXT_ZONES, TITLE_ZONE };
