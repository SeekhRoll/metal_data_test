import React from 'react';
import { Gond, Life } from '../style/gond';
import { C } from '../style/palette';
import { tube } from '../style/geom';

// Hiranyaka the mouse: profile facing right, a pattern of tiny dashes. Origin at the feet.
const BODY = 'M-110 0 C-116 -60 -60 -104 10 -100 C60 -98 96 -72 116 -40 L146 -30 L118 -18 C104 4 70 16 20 16 L-90 16 C-104 14 -110 8 -110 0 Z';
const EAR = 'M18 -96 C0 -140 30 -170 60 -160 C84 -150 84 -118 62 -96 Z';
export const Mouse: React.FC<{ k: string; x: number; y: number; s?: number; flip?: boolean; chew?: number; life?: Life; reveal?: number }> = ({ k, x, y, s = 1, flip, chew = 0, life = { t: 0 }, reveal = 3 }) => {
  const tail = tube([[-104, -4, 14], [-170, 10, 11], [-230, -20, 8], [-230, -70, 6], [-196, -84, 4], [-184, -60, 3]]);
  const ol = 5 / s;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s}) rotate(${chew * 6} 110 -30)`} data-id={k}>
      <Gond k={k + '-tail'} d={tail} fill={C.magenta} bands={[{ w: 4, kind: 'dots', color: C.white, gap: 9 }]} life={life} outline={ol} inner={null} reveal={reveal} />
      <Gond k={k + '-body'} d={BODY} fill={C.sky} pattern={{ kind: 'dashes', fg: C.cobalt, s: .5 }} bands={[{ w: 10, kind: 'solid', color: C.yellow }, { w: 8, kind: 'dash', color: C.black, gap: 8 }, { w: 8, kind: 'dots', color: C.magenta, gap: 12 }]} life={life} outline={ol} reveal={reveal} />
      <Gond k={k + '-ear'} d={EAR} fill={C.magenta} bands={[{ w: 8, kind: 'dots', color: C.yellow, gap: 11 }]} life={life} outline={ol} reveal={reveal} />
      <g opacity={Math.min(1, Math.max(0, reveal - 1))}>
        <circle cx={82} cy={-58} r={9} fill={C.white} stroke={C.black} strokeWidth={3} />
        <circle cx={85} cy={-58} r={4.5} fill={C.black} />
        <circle cx={146} cy={-30} r={5} fill={C.black} />
        <path d="M130 -30 L172 -44 M130 -26 L174 -24 M130 -22 L170 -8" stroke={C.black} strokeWidth={2} />
        <path d="M-60 16 L-66 30 M-20 16 L-24 30 M40 14 L44 28 M70 10 L76 24" stroke={C.black} strokeWidth={5} strokeLinecap="round" />
      </g>
    </g>
  );
};
