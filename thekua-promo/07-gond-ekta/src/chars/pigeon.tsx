import React from 'react';
import { Gond, Band, Life, PatternKind } from '../style/gond';
import { C, Col } from '../style/palette';

// A Gond pigeon in profile, facing right, origin at the body's centre. Wings are replacement drawings:
// four hand-made wing shapes (up, half-up, level, down) cycled on twos (brief §3.3).
export type PigeonLook = { body: Col; wing: Col; head: Col; tail: Col; pattern: PatternKind; patFg: Col; bands: Band[]; wingBands: Band[] };

const TAIL = 'M-104 -12 C-146 -26 -200 -34 -240 -30 C-250 -14 -250 8 -240 22 C-200 24 -146 16 -104 8 Z';
const BODY = 'M-116 -6 C-96 -44 -30 -72 30 -76 C48 -94 66 -112 90 -116 C104 -86 118 -62 118 -34 C120 6 96 42 40 54 C-20 64 -84 44 -116 -6 Z';
const HEAD = 'M74 -96 C70 -126 92 -146 116 -142 C136 -138 146 -120 144 -106 L172 -98 L143 -90 C138 -74 122 -64 104 -66 C88 -68 76 -80 74 -96 Z';
const COLLAR = 'M58 -96 C72 -112 110 -112 132 -86 L126 -54 C104 -70 76 -72 46 -62 Z';
const CREST = 'M100 -138 C92 -164 96 -190 104 -202 C112 -184 114 -162 108 -140 Z M114 -140 C116 -168 128 -186 140 -192 C140 -172 132 -154 120 -138 Z M90 -136 C76 -154 70 -174 72 -188 C84 -174 94 -158 98 -138 Z';
const LEGS = 'M20 52 L14 88 M14 88 L0 96 M14 88 L26 98 M50 46 L48 86 M48 86 L36 94 M48 86 L60 96';

// wing drawings: shoulder at (18,-40); feather tips trail backwards
const WINGS = [
  // 0 up: raised high, foreshortened, tips pointing up and back
  'M30 -60 C10 -110 -20 -180 -54 -250 L-38 -232 L-74 -238 L-52 -212 L-94 -214 L-66 -190 L-104 -184 L-74 -166 L-100 -152 C-60 -110 -10 -80 30 -60 Z',
  // 1 half-up
  'M30 -60 C-10 -96 -80 -150 -150 -180 L-132 -160 L-172 -160 L-144 -140 L-182 -134 L-150 -118 L-184 -106 L-150 -94 C-90 -78 -30 -66 30 -60 Z',
  // 2 level: wide, the full span seen
  'M30 -60 C-30 -80 -130 -92 -226 -82 L-202 -66 L-242 -58 L-206 -46 L-238 -32 L-200 -26 L-224 -10 C-130 -8 -40 -26 30 -60 Z',
  // 3 down: swept below the body
  'M30 -60 C-16 -44 -90 0 -150 60 L-128 56 L-150 92 L-120 78 L-128 118 L-100 90 L-96 128 C-56 76 -6 0 30 -60 Z',
];
export const WING_FOLDED = 'M40 -70 C0 -80 -80 -68 -156 -34 L-130 -26 L-162 -14 L-132 -8 L-156 8 C-80 12 0 -12 40 -70 Z';

export const Pigeon: React.FC<{ look: PigeonLook; k: string; x: number; y: number; s?: number; flip?: boolean; rot?: number; wing?: number | 'folded'; life?: Life; king?: boolean; reveal?: number; perched?: boolean }> =
  ({ look, k, x, y, s = 1, flip, rot = 0, wing = 2, life = { t: 0 }, king, reveal = 3, perched }) => {
    const wingD = wing === 'folded' ? WING_FOLDED : WINGS[((wing % 4) + 4) % 4];
    const o = 5 / s * 1.0;
    return (
      <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s}) rotate(${rot})`} data-id={k}>
        {(perched || wing === 'folded') && <path d={LEGS} stroke={C.vermilion} strokeWidth={6} strokeLinecap="round" fill="none" />}
        <Gond k={k + '-tail'} d={TAIL} fill={look.tail} bands={[{ w: 10, kind: 'dash', color: C.black, speed: 10 }, { w: 12, kind: 'dots', color: C.white }]} life={life} outline={o} reveal={reveal} />
        {wing !== 'folded' && (wing as number) % 4 === 0 && <Gond k={k + '-wing'} d={wingD} fill={look.wing} bands={look.wingBands} life={life} outline={o} reveal={reveal} />}
        <Gond k={k + '-body'} d={BODY} fill={look.body} pattern={{ kind: look.pattern, fg: look.patFg, s: .9 }} bands={look.bands} life={life} outline={o} reveal={reveal} />
        {king && <Gond k={k + '-crest'} d={CREST} fill={C.magenta} bands={[{ w: 6, kind: 'dots', color: C.yellow, gap: 12 }]} life={life} outline={o} reveal={reveal} />}
        <Gond k={k + '-head'} d={HEAD} fill={look.head} bands={[{ w: 8, kind: 'dash', color: C.black, gap: 9 }]} life={life} outline={o} reveal={reveal} />
        {king && <Gond k={k + '-collar'} d={COLLAR} fill={C.turquoise} bands={[{ w: 8, kind: 'solid', color: C.magenta }, { w: 6, kind: 'dots', color: C.yellow, gap: 11 }, { w: 7, kind: 'solid', color: C.cobalt }]} life={life} outline={o} reveal={reveal} />}
        {(wing === 'folded' || (wing as number) % 4 !== 0) && <Gond k={k + '-wing'} d={wingD} fill={look.wing} bands={look.wingBands} life={life} outline={o} reveal={reveal} />}
        {/* the single eye */}
        <g opacity={Math.min(1, Math.max(0, reveal - 1))}>
          <circle cx={116} cy={-114} r={11} fill={C.white} stroke={C.black} strokeWidth={3.5} />
          <circle cx={120} cy={-114} r={5.5} fill={C.black} />
        </g>
        <path d="M144 -98 L168 -98" stroke={C.black} strokeWidth={2.5} opacity={Math.min(1, Math.max(0, reveal - 1))} />
      </g>
    );
  };

// ---------------------------------------------------------------- the flock's looks: Chitragreeva + 6 pattern variants
const wb = (a: Col, b: Col): Band[] => [{ w: 12, kind: 'solid', color: a }, { w: 10, kind: 'dash', color: C.black, gap: 10 }, { w: 12, kind: 'seed', color: b }];
export const KING: PigeonLook = {
  body: C.cobalt, wing: C.turquoise, head: C.cobalt, tail: C.magenta, pattern: 'scales', patFg: C.sky,
  bands: [{ w: 12, kind: 'solid', color: C.yellow }, { w: 10, kind: 'dots', color: C.magenta }, { w: 10, kind: 'dash', color: C.white, gap: 10 }],
  wingBands: wb(C.yellow, C.magenta),
};
export const FLOCK: { name: string; look: PigeonLook }[] = [
  { name: 'dots', look: { body: C.magenta, wing: C.marigold, head: C.magenta, tail: C.turquoise, pattern: 'dots', patFg: C.yellow, bands: [{ w: 12, kind: 'dash', color: C.white }], wingBands: wb(C.vermilion, C.white) } },
  { name: 'fish scales', look: { body: C.turquoise, wing: C.cobalt, head: C.turquoise, tail: C.marigold, pattern: 'scales', patFg: C.white, bands: [{ w: 12, kind: 'dots', color: C.black }], wingBands: wb(C.sky, C.yellow) } },
  { name: 'chevrons', look: { body: C.marigold, wing: C.vermilion, head: C.marigold, tail: C.leaf, pattern: 'chevrons', patFg: C.vermilion, bands: [{ w: 12, kind: 'dash', color: C.black }], wingBands: wb(C.yellow, C.black) } },
  { name: 'dashes', look: { body: C.leaf, wing: C.lime, head: C.leaf, tail: C.magenta, pattern: 'dashes', patFg: C.yellow, bands: [{ w: 12, kind: 'dots', color: C.white }], wingBands: wb(C.leaf, C.white) } },
  { name: 'seeds', look: { body: C.vermilion, wing: C.yellow, head: C.vermilion, tail: C.cobalt, pattern: 'seeds', patFg: C.yellow, bands: [{ w: 12, kind: 'dash', color: C.white }], wingBands: wb(C.marigold, C.vermilion) } },
  { name: 'arcs', look: { body: C.plum, wing: C.magenta, head: C.plum, tail: C.yellow, pattern: 'arcs', patFg: C.sky, bands: [{ w: 12, kind: 'dots', color: C.yellow }], wingBands: wb(C.magenta, C.white) } },
];
