import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate, Easing } from 'remotion';
import { FONT } from '../fonts';
import TL from './timeline.json';
import SUBS from './subs.json';
import { W, H, PANEL, BAND, SUB_ZONE, THINK_ZONE, PANEL_TEXT, ICON_SLOTS, BUBBLES } from './layout';

const INK = '#3A2A20';
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const devnum = (n: number) => String(n).replace(/\d/g, (d) => '०१२३४५६७८९'[+d]);

// the painted frames (Blender renders run through the watercolour post, held on twos, freeze and wipe included)
const Frame: React.FC<{ f: number }> = ({ f }) => <Img src={staticFile(`frames/${String(f).padStart(5, '0')}.jpg`)} style={{ position: 'absolute', width: W, height: H }} />;

// ---------------------------------------------------------------- status panel (scenes 5-6)
function panelState(t: number) {
  const cs = TL.crossings as { k: number; start: number; unload: number }[];
  let k = 0, done = 0;
  for (const c of cs) { if (t >= c.start) k = c.k; if (t >= c.unload + .9) done = c.k; }
  return { k, st: (TL.states as { k: number; near: string[]; far: string[] }[])[done] };
}
const Panel: React.FC<{ t: number }> = ({ t }) => {
  const p0 = (TL as { beats: { panel_in: number } }).beats.panel_in;
  const show = interpolate(t, [p0, p0 + .6], [0, 1], clamp);
  if (show <= 0) return null;
  const { k, st } = panelState(t);
  const slot = (who: string) => ({ lion: 0, goat: 1, cabbage: 2 } as Record<string, number>)[who];
  const icons = (side: 'near' | 'far') => (st[side] as string[]).map(who => {
    const x = ICON_SLOTS[side][slot(who)], s = ICON_SLOTS.size;
    return <Img key={side + who} src={staticFile(`icon-${who}.png`)} style={{ position: 'absolute', left: x - s / 2, top: ICON_SLOTS.y, width: s, height: s, objectFit: 'contain' }} />;
  });
  const T: React.FC<{ p: { x: number; y: number; size: number }; font?: string; color?: string; children: React.ReactNode }> = ({ p, font = FONT.tiro, color = INK, children }) =>
    <div data-kind="text" style={{ position: 'absolute', left: p.x - 250, width: 500, top: p.y - p.size, textAlign: 'center', fontFamily: font, fontSize: p.size, color, lineHeight: 1.2 }}>{children}</div>;
  return (
    <AbsoluteFill style={{ opacity: show }}>
      <Img src={staticFile('panel.png')} style={{ position: 'absolute', left: PANEL.x, top: PANEL.y, width: PANEL.w, height: PANEL.h }} />
      <T p={PANEL_TEXT.near}>इस पार</T>
      <T p={PANEL_TEXT.far}>उस पार</T>
      <T p={PANEL_TEXT.counterLabel}>चक्कर</T>
      <T p={PANEL_TEXT.counter} font={FONT.yatra} color="#B0301E">{k ? `${devnum(k)}/७` : '०/७'}</T>
      {icons('near')}{icons('far')}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- the two imagination bubbles (scene 2)
const Bubble: React.FC<{ t: number; who: 'lion' | 'goat'; t0: number; t1: number }> = ({ t, who, t0, t1 }) => {
  const pop = interpolate(t, [t0, t0 + .35, t0 + .5], [0, 1.08, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  const out = interpolate(t, [t1 - .3, t1], [1, 0], clamp);
  if (t < t0 || t > t1) return null;
  const b = BUBBLES[who], s = b.s * pop;
  return <Img src={staticFile(`bubble-${who}-framed.png`)} style={{ position: 'absolute', left: b.x - s / 2 + b.s / 2, top: b.y - s / 2 + b.s / 2, width: s, height: s, opacity: out }} />;
};

// ---------------------------------------------------------------- "सोचिए…"
const Think: React.FC<{ t: number }> = ({ t }) => {
  const [f0, f1] = (TL as { beats: { freeze: number[] } }).beats.freeze;
  const a = interpolate(t, [f0 + .1, f0 + .6, f1 - .3, f1], [0, 1, 1, 0], clamp);
  if (a <= 0) return null;
  const z = THINK_ZONE;
  return <div data-kind="text" style={{ position: 'absolute', left: z.x, top: z.y, width: z.w, height: z.h, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.yatra, fontSize: 118, color: '#B0301E', opacity: a, transform: `rotate(-3deg) scale(${.9 + .1 * a})` }}>सोचिए…</div>;
};

// ---------------------------------------------------------------- subtitles on the painted band
const Subtitles: React.FC<{ t: number }> = ({ t }) => {
  const c = (SUBS as { from: number; to: number; lines: string[] }[]).find(s => t >= s.from && t < s.to);
  const a = c ? Math.min(interpolate(t, [c.from, c.from + .15], [0, 1], clamp), interpolate(t, [c.to - .15, c.to], [1, 0], clamp)) : 0;
  return (
    <>
      <Img src={staticFile('band.png')} style={{ position: 'absolute', left: BAND.x, top: BAND.y, width: BAND.w, height: BAND.h }} />
      {c && <div data-kind="text" style={{ position: 'absolute', left: SUB_ZONE.x, top: SUB_ZONE.y, width: SUB_ZONE.w, height: SUB_ZONE.h, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.tiro, fontSize: 56, lineHeight: 1.3, color: INK, opacity: a, textAlign: 'center' }}>
        {c.lines.map((l, i) => <div key={i}>{l}</div>)}
      </div>}
    </>
  );
};

export const Film: React.FC = () => {
  const f = useCurrentFrame(), t = f / 24;
  const B = (TL as { bubbles?: { who: 'lion' | 'goat'; from: number; to: number }[] }).bubbles || [];
  return (
    <AbsoluteFill style={{ background: '#F4EEE0' }}>
      <Frame f={f} />
      {B.map((b, i) => <Bubble key={i} t={t} who={b.who} t0={b.from} t1={b.to} />)}
      <Panel t={t} />
      <Think t={t} />
      <Subtitles t={t} />
    </AbsoluteFill>
  );
};
