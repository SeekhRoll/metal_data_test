import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, W, H, BAND } from '../style/palette';
import { FONT } from '../style/fonts';
import { TextureDefs, Texture } from '../style/texture';
import { Pigeon, FLOCK, KING } from '../chars/pigeon';
import { lifeFor, mixLife, Bloom, wingAt, Mood } from '../style/states';

// Brief §3.4 step 3: one pigeon cycling through idle, panic, unity and bloom pattern states (2 s each).
const MOODS: [Mood, string, string][] = [['idle', 'शांत', 'idle: gentle drift, own rhythm'], ['panic', 'घबराहट', 'panic: patterns jitter out of sync'], ['unity', 'एकता', 'unity: one shared pulse'], ['bloom', 'खुशी', 'bloom: the pattern bursts outward']];
export const PatternTest: React.FC = () => {
  const f = useCurrentFrame(), t = f / 24, i = Math.min(3, Math.floor(t / 2)), u = (t % 2) / 2;
  const mood = MOODS[i][0], prev = MOODS[Math.max(0, i - 1)][0];
  const blend = Math.min(1, u / .15);
  const life = (ph: number) => mixLife(lifeFor(prev, t, ph, u), lifeFor(mood, t, ph, u), i ? blend : 1);
  const flap = mood === 'panic' ? wingAt(f, 0, 1) : mood === 'unity' ? wingAt(f, 0, 2) : mood === 'bloom' ? wingAt(f, 0, 3) : 'folded' as const;
  const shake = mood === 'panic' ? 10 * Math.sin(t * 40) : 0;
  return (
    <AbsoluteFill>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
        <TextureDefs />
        <rect width={W} height={H} fill={mood === 'panic' ? C.night : C.paper} />
        <Pigeon look={KING} k="king" x={560 + shake} y={560 + (flap === 'folded' ? 0 : -20 * Math.sin(t * 6))} s={1.6} king wing={flap} perched={flap === 'folded'} life={life(.2)} />
        {FLOCK.slice(0, 3).map((p, j) => <Pigeon key={j} look={p.look} k={'p' + j} x={230 + j * 310 + (mood === 'panic' ? 8 * Math.sin(t * 37 + j) : 0)} y={1150} s={.85} wing={flap === 'folded' ? 'folded' : wingAt(f, mood === 'unity' ? 0 : j * 3, mood === 'panic' ? 1 : 2)} perched={flap === 'folded'} life={life(j * .37 + .1)} />)}
        {mood === 'bloom' && <Bloom x={560} y={560} k={u * 1.3} r={380} n={20} />}
        <rect y={BAND.y} width={W} height={BAND.h} fill={mood === 'panic' ? C.night : C.white} />
        <text data-kind="text" x={W / 2} y={BAND.y + 120} textAnchor="middle" fontFamily={FONT.yatra} fontSize={72} fill={mood === 'panic' ? C.white : C.black}>{MOODS[i][1]}</text>
        <text data-kind="text" x={W / 2} y={BAND.y + 190} textAnchor="middle" fontFamily={FONT.tiro} fontSize={38} fill={mood === 'panic' ? C.yellow : C.brown}>{MOODS[i][2]}</text>
        <Texture w={W} h={H} dark={mood === 'panic'} />
      </svg>
    </AbsoluteFill>
  );
};
