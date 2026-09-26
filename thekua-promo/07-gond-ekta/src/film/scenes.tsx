import React from 'react';
import { C } from '../style/palette';
import { FONT } from '../style/fonts';
import { kf, seg, easeInOut, easeOut, jitter, clamp01 } from '../style/motion';
import { Banyan } from '../chars/tree';
import { Person, HUNTER, FAMILY, Stick, Cup } from '../chars/people';
import { Mouse } from '../chars/mouse';
import { Thaali } from '../chars/props';
import { Pigeon, KING, FLOCK } from '../chars/pigeon';
import { wingAt, lifeFor } from '../style/states';
import { Gond } from '../style/gond';
import { tube, leafPath } from '../style/geom';
import { BEAT, freeTime } from './timeline';
import { birdAt, GROUND_Y } from './choreo';
import { Flock } from './flock';
import { Net, Pole } from './net';
import { Forest, Ground, Bush, Burrow, Grain, FarBirds } from './world';
import { TitleText, Placard } from './text';

type SP = { t: number; frame: number };
// camera: a slow push toward the trap (brief §3.3: slow pushes and vertical tilts)
// the focus point (fx, fy) moves to screen (540, sy); at z = 1 this is the identity, zoomed in it lifts the
// ground action to the middle of the tall frame
const Cam: React.FC<{ z: number; fx?: number; fy?: number; children: React.ReactNode }> = ({ z, fx = 560, fy = 1330, children }) => {
  const k = (z - 1) / .6, sx = 540 + (fx - 540) * (1 - Math.min(1, k)), sy = fy - 260 * Math.min(1, k);
  return <g transform={`translate(${sx} ${sy}) scale(${z}) translate(${-fx} ${-fy})`}>{children}</g>;
};
const trapZoom = (t: number) => kf(t, [[18.2, 1], [20.6, 1.6], [BEAT.lift + .2, 1.6], [BEAT.lift + 1.4, 1]]);
const tree = (t: number, grow: number, dy = 0, s = 1) => <Banyan k="banyan" x={540} y={1560 + dy} s={s} grow={grow} life={{ t }} />;

// ---------------------------------------------------------------- S1 · 0-5 · a seed becomes the banyan; the title
export const S1: React.FC<SP> = ({ t }) => {
  const tilt = easeInOut(seg(t, 4.4, 5.0)) * 1500;
  const title = seg(t, 2.2, 3.0) * (1 - seg(t, 4.3, 4.7));
  return (
    <>
      {tree(t, kf(t, [[.3, 0], [1.3, .1], [2.6, .45], [4.2, 1]], (u) => u), tilt, 1)}
      <TitleText opacity={title} lines={[{ text: 'एकता का जाल', size: 118, color: C.vermilion }, { text: 'गोंड कथा · भाग १', size: 50, font: FONT.tiro, color: C.brown }]} />
    </>
  );
};

// ---------------------------------------------------------------- S2 · 5-13 · the flock over the patterned forest
export const S2: React.FC<SP> = ({ t, frame }) => {
  const rise = (1 - easeOut(seg(t, 5, 5.9))) * -1500;
  return (
    <>
      <FarBirds t={t} dy={rise * .3} />
      <Forest t={t} dx={-(t - 5) * 38} dy={-rise * .0 + (1 - easeOut(seg(t, 5, 5.9))) * 700} />
      <g transform={`translate(0 ${(1 - easeOut(seg(t, 5.2, 6.2))) * -900})`}><Flock t={t} frame={frame} /></g>
    </>
  );
};

// ---------------------------------------------------------------- S3 · 13-20 · the hunter's trap
const hunterX = (t: number) => kf(t, [[12.9, 1200], [13.4, 860], [15.3, 860], [15.9, 760], [16.8, 760], [17.3, 930], [24.0, 930], [27.2, 820]]);
function hunterPose(t: number) {
  if (t < BEAT.scatter) return { pose: 'stand' as const, arm: -10 };
  if (t < 15.3) return { pose: 'scatter' as const, arm: 50 + 30 * Math.sin((t - BEAT.scatter) * 5) };
  if (t < BEAT.crouch) return { pose: 'stand' as const, arm: kf(t, [[15.4, -10], [16.0, 150], [16.8, 150], [17.1, 0]]) };
  if (t < BEAT.hunterRise) return { pose: 'crouch' as const, arm: t > BEAT.drop - .5 && t < BEAT.drop + .3 ? -30 : 40 };
  return { pose: 'stand' as const, arm: 150 + 10 * Math.sin(t * 3) };
}
export const Hunter: React.FC<{ t: number; dy?: number; s?: number; x?: number; run?: number }> = ({ t, dy = 0, s = .92, x, run = 0 }) => {
  const hp = hunterPose(t), hx = x ?? hunterX(t);
  const walkBob = Math.abs(Math.sin(t * (run ? 14 : 6))) * (run ? 12 : 0);
  const reveal = kf(t, [[12.9, 1.2], [13.6, 3]]);
  const stick = t > BEAT.hunterRise ? <Stick len={360} ang={-120 + 8 * Math.sin(t * 3)} /> : null;
  return <Person o={HUNTER} k="hunter" x={hx} y={GROUND_Y + 2 + dy - walkBob} s={s} flip pose={hp.pose} arm={hp.arm} hold={stick} reveal={reveal} life={{ t }} />;
};
export const S3: React.FC<SP> = ({ t, frame }) => (
  <Cam z={trapZoom(t)}>
    <Ground t={t} />
    <Pole t={t} />
    <Grain t={t} from={[hunterX(BEAT.scatter) - 110, 1080]} t0={BEAT.scatter} />
    <Flock t={t} frame={frame} />
    <Net t={t} />
    <Hunter t={t} />
    <Bush t={t} x={960} y={GROUND_Y} s={.95} />
  </Cam>
);

// ---------------------------------------------------------------- S4 · 20-27 · caught: panic, the hunter comes
export const S4: React.FC<SP> = ({ t, frame }) => (
  <Cam z={trapZoom(t)}>
    <Ground t={t} />
    <Pole t={t} />
    <Grain t={t} from={[750, 1080]} t0={BEAT.scatter} />
    <Flock t={t} frame={frame} />
    <Net t={t} />
    <Bush t={t} x={960} y={GROUND_Y} s={.95} />
    <Hunter t={t} />
  </Cam>
);

// ---------------------------------------------------------------- S5 · 27-35 · "सब एक साथ उड़ो!" the flock lifts the net
const Call: React.FC<{ t: number }> = ({ t }) => {
  const u = seg(t, BEAT.call, BEAT.call + 1.1);
  if (u <= 0 || u >= 1) return null;
  const b = birdAt(0, t), x = b.x + 170 * b.s, y = b.y - 100 * b.s;
  return <g data-kind="graphic" data-id="call" opacity={1 - u}>{[0, 1, 2].map(i => { const r = 30 + (u * 160 + i * 40); return <path key={i} d={`M${x + r * .5} ${y - r * .87} A${r} ${r} 0 0 1 ${x + r * .5} ${y + r * .87}`} fill="none" stroke={C.magenta} strokeWidth={9} strokeLinecap="round" />; })}</g>;
};
export const S5: React.FC<SP> = ({ t, frame }) => {
  const tilt = easeInOut(seg(t, BEAT.lift + .4, BEAT.exit + .4)) * 1100;       // the camera rises with the flock
  const hs = .92 - .5 * seg(t, BEAT.lift + .4, BEAT.exit + .6);
  const hx = kf(t, [[27, 820], [BEAT.lift, 800], [BEAT.exit + 1, 600]]);
  return (
    <Cam z={trapZoom(t)}>
      <FarBirds t={t} dy={-900 + tilt * .4} op={seg(t, BEAT.lift + 1, BEAT.lift + 2)} />
      <Ground t={t} dy={tilt} />
      <Pole t={t} dy={tilt} />
      <Grain t={t} from={[750, 1080]} t0={BEAT.scatter} dy={tilt} />
      <Hunter t={t} dy={tilt * .8} s={hs} x={hx} run={t > BEAT.lift ? 1 : 0} />
      <Bush t={t} x={960} y={GROUND_Y} s={.95} dy={tilt} />
      <Flock t={t} frame={frame} />
      <Net t={t} />
      <Call t={t} />
    </Cam>
  );
};

// ---------------------------------------------------------------- S6 · 35-44 · Hiranyaka frees them, the king last
const BURROW_X = 830;
function mousePos(t: number): { x: number; flip: boolean; chew: number; reveal: number } {
  const reveal = kf(t, [[BEAT.mouseOut, 1], [BEAT.mouseOut + .6, 3]]);
  const king = birdAt(0, BEAT.landed + .1);
  let x = kf(t, [[BEAT.mouseOut, BURROW_X], [37.6, king.x + 150]]), chew = 0;
  for (let i = 1; i <= 7; i++) {
    const bi = i === 7 ? 0 : i, ft = freeTime(bi), b = birdAt(bi, ft - .01);
    const t0 = ft - BEAT.chewStep + .05;
    if (t >= t0 - .3 && t < ft + .05) { x = kf(t, [[t0 - .3, x], [t0, b.x + 60]]); chew = Math.sin(t * 40) * seg(t, t0, ft); }
    else if (t >= ft + .05) x = b.x + 60;
  }
  return { x, flip: true, chew, reveal };
}
export const S6: React.FC<SP> = ({ t, frame }) => {
  const m = mousePos(t);
  return (
    <Cam z={kf(t, [[35, 1.2], [37, 1.55]])} fx={500}>
      <Ground t={t} />
      <Burrow t={t} x={BURROW_X} y={GROUND_Y} />
      <Flock t={t} frame={frame} />
      <Net t={t} />
      {t > BEAT.mouseOut && <Mouse k="hiranyaka" x={m.x} y={GROUND_Y - 2} s={.62} flip={m.flip} chew={m.chew} reveal={m.reveal} life={{ t }} />}
    </Cam>
  );
};

// ---------------------------------------------------------------- S7 · 44-51 · together on the banyan; the moral
export const S7: React.FC<SP> = ({ t, frame }) => {
  const push = 1 + .03 * seg(t, 44, 51);
  return (
    <>
      <g transform={`translate(540 1560) scale(${push}) translate(-540 -1560)`}>
        {tree(t, 1, 0, .9)}
        <Flock t={t} frame={frame} />
      </g>
      <TitleText opacity={seg(t, 45.6, 46.4)} y0={250} lines={[{ text: 'संघे शक्तिः कलौ युगे', size: 92, color: C.vermilion }]} />
    </>
  );
};

// ---------------------------------------------------------------- S8 · 51-60 · the family shares thekua and chai; the end card
const BRANCH: [number, number, number][] = [[-60, 760, 70], [200, 810, 54], [440, 840, 40], [640, 830, 26], [760, 800, 12]];
export const S8: React.FC<SP> = ({ t, frame }) => {
  const card = easeInOut(seg(t, BEAT.card, BEAT.card + .9));
  const famDy = 0, reveal = kf(t, [[51, 1], [52.2, 3]]);
  const branchDy = 0, branchOp = 1 - seg(t, BEAT.card - .5, BEAT.card - .02);
  const perch = (i: number, px: number, py: number, t0: number) => {
    const k = easeOut(seg(t, t0, t0 + 1));
    const x = px + (1 - k) * (i === 0 ? 700 : -700), y = py - (1 - k) * 400 + branchDy;
    return <Pigeon key={i} look={i === 0 ? KING : FLOCK[0].look} k={'fam-bird' + i} x={x} y={y} s={.5} flip={i !== 0 ? false : k < .99} wing={k < .98 ? wingAt(frame, i * 3) : 'folded'} perched={k >= .98} king={i === 0} life={lifeFor('unity', t, 0)} />;
  };
  const cupBob = (i: number) => 4 * Math.sin(t * 2 + i);
  return (
    <>
      {branchOp > 0 && <g transform={`translate(0 ${branchDy})`} opacity={branchOp}>
        <Gond k="branch" d={tube(BRANCH)} fill={C.brown} bands={[{ w: 10, kind: 'solid', color: C.vermilion }, { w: 12, kind: 'dash', color: C.yellow, gap: 11, speed: 24 }]} life={{ t }} outline={6} />
        {[80, 180, 300, 420, 540, 650].map((x, i) => <g key={i} transform={`translate(${x} ${800 + (i % 2) * 30}) rotate(${i % 2 ? 70 : -110})`}><Gond k={'bl' + i} d={leafPath(90, 30)} fill={[C.leaf, C.lime, C.turquoise][i % 3]} bands={[{ w: 6, kind: 'dots', color: C.white, gap: 12 }]} life={{ t, phase: i }} outline={4.5} inner={null} /></g>)}
      </g>}
      {branchOp > 0 && <g opacity={branchOp}>{perch(0, 560, 740, BEAT.birdsLand)}{perch(1, 330, 770, BEAT.birdsLand + .35)}</g>}
      <g transform={`translate(540 ${1470 + famDy}) scale(${1 - .22 * card}) translate(-540 -1470)`}>
        <Person o={FAMILY[0].o} k="dada" x={150} y={1470} s={FAMILY[0].s * .8} pose="sit" arm={60 + cupBob(0)} hold={<Cup k="c0" />} reveal={reveal} life={{ t }} />
        <Person o={FAMILY[1].o} k="dadi" x={330} y={1470} s={FAMILY[1].s * .8} pose="sit" arm={55 + cupBob(1)} reveal={reveal} life={{ t }} />
        <Person o={FAMILY[4].o} k="bitiya" x={460} y={1470} s={FAMILY[4].s * .8} pose="sit" arm={70 + 10 * Math.max(0, Math.sin(t * 1.4))} reveal={reveal} life={{ t }} />
        <Thaali k="thaali" x={620} y={1485} s={.62} life={{ t }} />
        <Person o={FAMILY[5].o} k="beta" x={780} y={1470} s={FAMILY[5].s * .8} pose="sit" flip arm={75 + 10 * Math.max(0, Math.sin(t * 1.4 + 1))} reveal={reveal} life={{ t }} />
        <Person o={FAMILY[2].o} k="papa" x={900} y={1470} s={FAMILY[2].s * .8} pose="sit" flip arm={60 + cupBob(2)} hold={<Cup k="c2" />} reveal={reveal} life={{ t }} />
        <Person o={FAMILY[3].o} k="maa" x={1030} y={1470} s={FAMILY[3].s * .8} pose="sit" flip arm={45 + cupBob(3)} reveal={reveal} life={{ t }} />
      </g>
      {card > 0 && <>
        <Placard k="brand" t={t} x={540} y={340 - (1 - card) * 900} w={900} h={400} fill={C.white} frame={C.magenta} opacity={card}
          lines={[{ text: 'श्री देसी ठेकुआ', size: 100, dy: -24, color: C.vermilion }, { text: 'SRI DESI THEKUA', size: 42, font: FONT.serif, dy: 40, color: C.black }, { text: 'साथ बैठिए, साथ बाँटिए', size: 52, font: FONT.tiro, dy: 112, color: C.cobalt }]} />
        <Placard k="contact" t={t} x={540} y={790 - (1 - card) * 900} w={900} h={290} fill={C.white} frame={C.turquoise} opacity={card}
          lines={[{ text: 'WhatsApp 81782 26605', size: 60, font: FONT.serif, dy: -16, color: C.black }, { text: 'द्वारका के सभी सेक्टरों में डिलीवरी', size: 42, font: FONT.tiro, dy: 54, color: C.brown }]} />
      </>}
    </>
  );
};
