import React from 'react';
import { Gond, Life } from '../style/gond';
import { C } from '../style/palette';
import { tube, along, leafPath, SP } from '../style/geom';

// The banyan (brief §3.2: trees are the central motif; huge, stylised, heavily patterned, curling roots and branches).
// Origin at the foot of the trunk. `grow` 0..1 sprouts it: roots and trunk rise, branches unfurl, leaves pop open
// in order along each branch (Scene 1). Dash patterns flow up the trunk (its bands' offsets move with `t`).
const TRUNK: SP[] = [[0, 40, 60], [0, 8, 230], [6, -160, 160], [-10, -330, 140], [0, -470, 140], [2, -560, 70], [0, -600, 20]];
const ROOTS: SP[][] = [
  [[-40, 0, 70], [-150, 20, 46], [-250, 14, 30], [-300, -20, 18], [-280, -50, 8]],
  [[40, 0, 70], [150, 22, 46], [250, 16, 30], [300, -18, 18], [284, -48, 8]],
  [[-20, 10, 50], [-80, 56, 30], [-150, 70, 16], [-190, 56, 6]],
  [[20, 10, 50], [80, 58, 30], [150, 72, 16], [190, 58, 6]],
];
const BRANCHES: SP[][] = [
  [[0, -520, 96], [-150, -640, 70], [-310, -700, 50], [-420, -660, 32], [-450, -590, 18], [-420, -560, 8]],
  [[0, -520, 96], [150, -650, 70], [310, -710, 50], [420, -672, 32], [452, -600, 18], [424, -572, 8]],
  [[-10, -540, 80], [-90, -720, 58], [-200, -860, 40], [-300, -910, 24], [-340, -870, 10]],
  [[10, -540, 80], [100, -730, 58], [210, -870, 40], [310, -916, 24], [344, -876, 10]],
  [[0, -560, 70], [-10, -760, 50], [10, -930, 34], [0, -1020, 16], [-30, -1040, 6]],
];
// banyan aerial roots hanging from the lower branches
const AERIAL = [[-230, -690], [-350, -690], [230, -700], [350, -700], [-130, -620], [130, -625]] as const;
const LEAF_COLS = [C.leaf, C.lime, C.turquoise, C.leaf, C.marigold];

export const Banyan: React.FC<{ k: string; x: number; y: number; s?: number; grow?: number; life?: Life; unity?: number }> = ({ k, x, y, s = 1, grow = 1, life = { t: 0 } }) => {
  const g = (a: number, b: number) => Math.max(0, Math.min(1, (grow - a) / (b - a)));
  const easeBack = (u: number) => { const c = 1.9; return u <= 0 ? 0 : u >= 1 ? 1 : 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); };
  const trunkG = g(.08, .4), rootG = g(.12, .42);
  const sc = .12 + .88 * (1 - Math.pow(1 - trunkG, 3));              // the whole tree rises from the sprout
  const bands = [{ w: 16, kind: 'solid' as const, color: C.vermilion }, { w: 16, kind: 'dash' as const, color: C.yellow, gap: 12, speed: 28 }, { w: 12, kind: 'dots' as const, color: C.white, gap: 20, speed: 28 }];
  const leaves: React.ReactNode[] = [];
  BRANCHES.forEach((br, bi) => {
    const bg = g(.3 + bi * .04, .62 + bi * .04);
    for (let j = 0; j < 9; j++) {
      const u = .18 + j * .1;
      if (u > 1) break;
      const { p, ang } = along(br, u);
      for (const side of [-1, 1]) {
        const lg = easeBack(g(.45 + bi * .04 + j * .035, .55 + bi * .04 + j * .035));
        if (lg <= 0 || bg < u) continue;
        const a = ang + side * (55 + (j % 3) * 12), L = 92 - j * 3, col = LEAF_COLS[(bi + j + (side > 0 ? 1 : 0)) % LEAF_COLS.length];
        leaves.push(
          <g key={`${bi}-${j}-${side}`} transform={`translate(${p[0]} ${p[1]}) rotate(${a}) scale(${lg})`}>
            <Gond k={`${k}-l${bi}-${j}-${side}`} d={leafPath(L, 30)} fill={col} bands={[{ w: 6, kind: 'dots', color: C.white, gap: 12, speed: 8 }]} life={{ ...life, phase: (life.phase ?? 0) + bi * .3 + j * .1 }} outline={4.5} inner={null} />
            <path d={`M6 0 L${L - 10} 0`} stroke={C.black} strokeWidth={3} />
          </g>,
        );
      }
    }
    // a big leaf at each branch tip
    const tip = easeBack(g(.8 + bi * .03, .9 + bi * .03));
    if (tip > 0) { const { p, ang } = along(br, 1); leaves.push(<g key={'tip' + bi} transform={`translate(${p[0]} ${p[1]}) rotate(${ang}) scale(${tip})`}><Gond k={`${k}-tip${bi}`} d={leafPath(120, 44)} fill={C.marigold} pattern={{ kind: 'seeds', fg: C.vermilion, s: .6 }} life={life} outline={5} /></g>); }
  });
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} data-id={k}>
      {/* the seed and its first shoot */}
      {grow < .16 && <g opacity={1 - g(.1, .16)}>
        <Gond k={`${k}-seed`} d="M-34 0 C-36 -30 -14 -48 0 -48 C14 -48 36 -30 34 0 C30 20 -30 20 -34 0 Z" fill={C.marigold} bands={[{ w: 6, kind: 'dots', color: C.vermilion, gap: 10 }]} life={life} outline={5} inner={null} />
        {grow > .02 && <g transform={`translate(0 -40) scale(${Math.min(1, (grow - .02) / .06)})`}>
          <path d="M0 0 C-4 -30 6 -60 0 -90" stroke={C.leaf} strokeWidth={9} fill="none" strokeLinecap="round" />
          <g transform="translate(0 -80) rotate(-140)"><Gond k={`${k}-sp1`} d={leafPath(60, 22)} fill={C.lime} life={life} outline={4} inner={null} /></g>
          <g transform="translate(0 -86) rotate(-30)"><Gond k={`${k}-sp2`} d={leafPath(64, 22)} fill={C.leaf} life={life} outline={4} inner={null} /></g>
        </g>}
      </g>}
      <g transform={`scale(${sc})`}>
      {AERIAL.map(([ax, ay], i) => {
        const a = g(.7 + i * .02, .95);
        return a > 0 && <g key={'a' + i}>
          <path d={`M${ax} ${ay} C${ax + 6} ${ay + 120} ${ax - 8} ${ay + 260} ${ax} ${ay + 420 * a}`} stroke={C.brown} strokeWidth={10} fill="none" strokeLinecap="round" />
          <path d={`M${ax} ${ay} C${ax + 6} ${ay + 120} ${ax - 8} ${ay + 260} ${ax} ${ay + 420 * a}`} stroke={C.yellow} strokeWidth={4} fill="none" strokeDasharray="1 12" strokeDashoffset={-life.t * 20} strokeLinecap="round" />
        </g>;
      })}
      {ROOTS.map((r, i) => rootG > 0 && <Gond key={'r' + i} k={`${k}-root${i}`} d={tube(r, rootG)} fill={C.brown} bands={[{ w: 10, kind: 'dash', color: C.yellow, gap: 10, speed: 20 }]} life={life} outline={5} />)}
      {BRANCHES.map((br, i) => { const bg = g(.3 + i * .04, .62 + i * .04); return bg > .02 && <Gond key={'b' + i} k={`${k}-br${i}`} d={tube(br, bg)} fill={C.brown} bands={[{ w: 10, kind: 'solid', color: C.vermilion }, { w: 12, kind: 'dash', color: C.yellow, gap: 11, speed: 24 }]} life={life} outline={5} />; })}
      {trunkG > 0 && <Gond k={`${k}-trunk`} d={tube(TRUNK)} fill={C.brown} pattern={{ kind: 'dashes', fg: C.marigold, s: 1, angle: 0 }} bands={bands} life={life} outline={6} />}
      {leaves}
      </g>
    </g>
  );
};
