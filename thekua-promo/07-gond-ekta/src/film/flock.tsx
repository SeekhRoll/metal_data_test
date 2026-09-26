import React from 'react';
import { Pigeon, KING, FLOCK } from '../chars/pigeon';
import { lifeFor, mixLife, Bloom, wingAt } from '../style/states';
import { seg } from '../style/motion';
import { birdAt, N } from './choreo';
import { BEAT } from './timeline';

// the seven foreground birds: back row first (1, 3, 5), then the king and the front row
const ORDER = [5, 3, 1, 6, 4, 2, 0];
export const Flock: React.FC<{ t: number; frame: number; only?: number[]; dy?: number }> = ({ t, frame, only, dy = 0 }) => (
  <g data-id="flock">
    {ORDER.filter(i => !only || only.includes(i)).map(i => {
      const b = birdAt(i, t);
      if (b.vis <= 0) return null;
      const ph = i * .37 + .1;
      // panic -> unity is a visible change: the patterns and the wings fall into one shared rhythm
      let life = lifeFor(b.mood, t, ph, b.bloomAt ? (t - b.bloomAt) : 0);
      if (t > BEAT.sync && t < BEAT.sync + 1.2) life = mixLife(lifeFor('panic', t, ph), lifeFor('unity', t, ph), seg(t, BEAT.sync, BEAT.sync + 1.2));
      const shared = b.mood === 'unity' || b.mood === 'bloom';
      const wing = b.flying ? wingAt(frame, shared ? 0 : b.wingOff, 2) : 'folded' as const;
      return (
        <g key={i} opacity={b.vis}>
          {b.bloomAt !== undefined && <Bloom x={b.x} y={b.y + dy} k={(t - b.bloomAt) / 1.1} r={i === 0 ? 420 : 260} n={i === 0 ? 24 : 16} seed={i} />}
          <Pigeon look={i === 0 ? KING : FLOCK[i - 1].look} k={'bird' + i} x={b.x} y={b.y + dy} s={b.s} flip={b.flip} rot={b.rot} wing={wing} perched={!b.flying} king={i === 0} life={life} />
        </g>
      );
    })}
  </g>
);
export { N };
