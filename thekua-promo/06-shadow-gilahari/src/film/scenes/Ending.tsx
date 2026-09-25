import React from 'react';
import { Puppet, baseM, worldPoint } from '../../stage/rig';
import { squirrel, rock, sancha, thekuaPiece, thaali, makerHand, banner } from '../../puppets/props';
import { kf, pendulum, seg, easeInOut, easeOut, jitter } from '../../stage/motion';
import { L } from '../../stage/palette';
import { FONT } from '../../stage/fonts';
import { STAGE } from '../../stage/palette';

// ---------------------------------------------------------------- S7 · 45-52 s · the light narrows to the striped squirrel alone
export const S7: React.FC<{ t: number }> = ({ t }) => {
  const hop = t > 46.2 && t < 46.7 ? Math.sin(seg(t, 46.2, 46.7) * Math.PI) * 26 : 0;
  const flick = Math.pow(Math.max(0, Math.sin((t - 45) * 1.6)), 24) * -30;
  const pulse = .9 + .1 * Math.sin(t * 3);
  const r = kf(t, [[45.2, 1100], [46.8, 430]], easeOut);
  const { screen: S } = STAGE;
  return (
    <>
      <Puppet root={rock(3)} x={540} y={1150 + jitter(t, 40, 1.5)} s={.9} k="s7rock" rods={[{ part: 'rock', at: [0, 60] }]} />
      <Puppet root={squirrel([pulse, pulse, pulse])} pose={{ tail: flick + jitter(t, 41, 3) + pendulum('s7-tail', t, (s) => (s > 46.2 && s < 46.7 ? Math.sin(seg(s, 46.2, 46.7) * Math.PI) * 26 : 0), { f: 1.6, z: .12, gain: .4 }), hindLeg: jitter(t, 42, 2), foreLeg: jitter(t, 43, 2) }}
        x={530} y={1150 - 90 * .9 - 40 * 1.5 + 8 - hop + jitter(t, 44, 1.2)} rot={jitter(t, 45, 1.5)} s={1.5} k="s7sq" rods={[{ part: 'body', at: [0, 10] }]} rivetR={6} />
      {/* the lamp's pool of light closing around the squirrel */}
      <defs>
        <radialGradient id="pool" gradientUnits="userSpaceOnUse" cx={540} cy={1080} r={r}>
          <stop offset=".55" stopColor="#0A0503" stopOpacity={0} /><stop offset="1" stopColor="#0A0503" stopOpacity={.88} />
        </radialGradient>
      </defs>
      <rect x={S.x} y={S.y} width={S.w} height={S.h} fill="url(#pool)" />
      <rect x={S.x} y={S.y} width={S.w} height={S.h} fill="#0A0503" opacity={.88 * Math.max(0, 1 - r / 430) } />
    </>
  );
};

// ---------------------------------------------------------------- S8 · 52-60 s · thekua shaped by hand, one by one; the end card
const SANCHA: [number, number] = [560, 800], THAALI: [number, number] = [540, 1250];
const PIECES = [0, 1, 2].map(i => ({ t0: 52.25 + i * 1.3, slot: [410 + i * 130, THAALI[1] - 40] as [number, number] }));
function handTarget(t: number): { p: [number, number]; carry: number | null; pinch: boolean } {
  for (let i = 0; i < PIECES.length; i++) {
    const { t0, slot } = PIECES[i], u = t - t0;
    if (u >= 0 && u < 1.3) {
      const above: [number, number] = [SANCHA[0], SANCHA[1] - 160];
      if (u < .3) return { p: lerp2(above, SANCHA, easeInOut(u / .3)), carry: null, pinch: true };
      if (u < .55) return { p: [SANCHA[0], SANCHA[1] + 12 * Math.sin((u - .3) / .25 * Math.PI * 2)], carry: null, pinch: true };
      if (u < 1.05) { const k = easeInOut((u - .55) / .5); return { p: [SANCHA[0] + (slot[0] - SANCHA[0]) * k, SANCHA[1] + (slot[1] - SANCHA[1]) * k - 160 * Math.sin(k * Math.PI)], carry: i, pinch: true }; }
      return { p: lerp2(slot, above, easeInOut((u - 1.05) / .25)), carry: null, pinch: false };
    }
  }
  return { p: [SANCHA[0], SANCHA[1] - 160], carry: null, pinch: false };
}
const lerp2 = (a: [number, number], b: [number, number], k: number): [number, number] => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
const HAND_LEN = 300;          // makerHand: forearm pivot to fingertip (local)

export const S8: React.FC<{ t: number }> = ({ t }) => {
  const out = seg(t, 56.1, 56.9);                          // hands and sancha pull back for the end card
  const h = handTarget(t);
  const hs = 1.15, fx = h.p[0] + 10 * Math.sin(t * 2.2), fy = h.p[1] - HAND_LEN * hs;
  const hx = (s: number) => handTarget(s).p[0];
  const lean = pendulum('s8-hand', t, hx, { f: 1.3, z: .16, gain: .025 });
  const pieces = PIECES.map((pc, i) => {
    const u = t - pc.t0;
    if (u < .3) return null;
    if (h.carry === i) return <Puppet key={i} root={thekuaPiece()} x={h.p[0]} y={h.p[1] + 18} s={.8} k={'tk' + i} />;
    if (u < .55) return <Puppet key={i} root={thekuaPiece()} x={SANCHA[0]} y={SANCHA[1] + 4} s={.8 * seg(u, .3, .45)} k={'tk' + i} />;
    const drop = u < 1.25 ? 10 * Math.exp(-(u - 1.05) * 8) * Math.cos((u - 1.05) * 20) : 0;
    const ty = kf(t, [[56.1, pc.slot[1]], [57.2, pc.slot[1] + 110]]);
    return <Puppet key={i} root={thekuaPiece()} x={pc.slot[0]} y={ty + drop} s={.8 - .08 * seg(t, 56.1, 57.2)} k={'tk' + i} />;
  });
  const cardIn = (d: number) => kf(t, [[56.5 + d, 1], [57.5 + d, 0]], easeOut);
  const cardY = (d: number, y: number) => (s: number) => y + 900 * kf(s, [[56.5 + d, 1], [57.5 + d, 0]], easeOut);
  const card = (d: number, y: number, el: ReturnType<typeof banner>, k: string, w: number) => {
    const yf = cardY(d, y);
    if (t < 56.5 + d) return null;
    return <Puppet root={el} x={540} y={yf(t) + jitter(t, 50 + d * 10, 1.5)} rot={pendulum(k + '-r', t, yf, { f: .8, z: .14, gain: -.0025 }) + jitter(t, 60 + d, .4)} s={1}
      depth={.4 * cardIn(d)} k={k} rods={k === 'contact' ? [{ part: el.id, at: [-w * .36, 70] }, { part: el.id, at: [w * .36, 70] }] : []} />;
  };
  return (
    <>
      <Puppet root={sancha()} x={SANCHA[0]} y={SANCHA[1] + jitter(t, 51, 1.5)} s={1.15} depth={.6 * out} fade={1 - out} k="sancha" rods={[{ part: 'sancha', at: [0, 50] }]} />
      <Puppet root={makerHand(false)} pose={{ fore: 8 + jitter(t, 52, 1.5), hand: -10 }} x={SANCHA[0] - 250} y={SANCHA[1] - 300 * 1.15 + 20} s={1.15} depth={.6 * out} fade={1 - out} k="hOpen" rods={[{ part: 'fore', at: [0, 40] }]} />
      <Puppet root={thaali()} x={THAALI[0]} y={kf(t, [[56.1, THAALI[1]], [57.2, THAALI[1] + 110]])} s={1.3} k="thaali" rods={[{ part: 'thaali', at: [0, 30] }]} />
      {pieces}
      <Puppet root={makerHand(h.pinch)} pose={{ fore: lean }} x={fx} y={fy} s={hs} flip depth={.6 * out} fade={1 - out} k="hPinch" rods={[{ part: 'fore', at: [0, 40] }]} />
      {card(0, 380, banner(840, 330, L.maroon, [{ text: 'श्री देसी ठेकुआ', size: 104, y: 2, font: FONT.yatra }, { text: 'SRI DESI THEKUA', size: 50, y: 88, font: FONT.serif }], 'brand'), 'brand', 840)}
      {card(.35, 700, banner(860, 150, L.leaf, [{ text: 'एक-एक करके, हाथ से, पूरे मन से', size: 48, y: 17 }], 'tag'), 'tag', 860)}
      {card(.7, 960, banner(880, 220, L.indigo, [{ text: 'WhatsApp 81782 26605', size: 60, y: -8, font: FONT.serif }, { text: 'द्वारका के सभी सेक्टरों में डिलीवरी', size: 40, y: 62 }], 'contact'), 'contact', 880)}
    </>
  );
};
