import React from 'react';
import { L } from '../stage/palette';
import { Leather, Dots, DotLine, Rosette, Slits, Slit, tube, arcPts, along, slitPath } from '../stage/leather';
import { Part } from '../stage/rig';

// One jointed rig for all the standing figures (facing right; root = waist; y up is negative).
// Rivets at shoulders, elbows, wrists, knees (+ neck and tail where they swing).

type Opts = {
  name: string; skin: string; dhoti: string; hem: string; sash: string;
  head: 'human' | 'monkey' | 'monkeyLaugh'; crown?: 'tall' | 'short' | 'cap'; weapon?: 'bow' | 'mace'; tail?: boolean; quiver?: boolean;
  mustache?: boolean; lower?: 'dhoti' | 'langot'; fur?: string;
};

// ---------------------------------------------------------------- pieces
const TORSO = 'M-58 -330 C-30 -352 40 -348 66 -322 C84 -290 82 -214 64 -160 C56 -120 52 -80 50 -30 L-52 -30 C-58 -90 -66 -160 -72 -230 C-76 -280 -72 -316 -58 -330 Z';
const DHOTI = 'M-66 -32 L62 -32 C78 30 88 140 82 256 L24 266 L6 110 L-12 266 L-74 256 C-86 140 -82 30 -66 -32 Z';
const LANGOT = 'M-62 -32 L60 -32 C66 10 60 50 40 80 L6 96 L-24 90 C-50 70 -64 20 -62 -32 Z';
const HAND = 'M-13 0 C-18 16 -16 36 -8 50 L-6 86 C-6 92 2 92 2 86 L3 58 L7 92 C8 98 15 98 15 92 L13 58 L18 88 C19 94 26 94 25 88 L22 54 C30 46 30 22 18 0 Z M14 12 C26 16 36 26 38 36 C38 42 32 42 30 38 C26 30 18 26 10 24 Z';
const FACE = 'M-24 0 L22 0 C24 -20 30 -34 38 -42 C44 -46 48 -52 46 -56 C43 -58 42 -60 46 -62 C50 -64 50 -68 46 -70 L72 -86 L52 -116 C50 -124 48 -134 44 -146 C36 -160 10 -164 -10 -158 C-34 -150 -40 -120 -38 -92 C-36 -60 -30 -30 -24 0 Z';
const HAIR = 'M-10 -158 C-40 -160 -62 -120 -64 -70 C-66 -30 -58 10 -44 40 L-26 36 C-36 0 -40 -40 -36 -80 C-34 -120 -24 -146 -10 -158 Z';
const MONKEY_HEAD = 'M-26 0 L24 0 C30 -14 40 -24 56 -30 C72 -36 80 -48 74 -58 C80 -66 76 -78 64 -80 C62 -96 52 -110 36 -118 C40 -130 34 -144 20 -146 C4 -154 -24 -150 -38 -128 C-52 -106 -50 -60 -40 -30 C-36 -18 -30 -8 -26 0 Z';
const MONKEY_MASK = 'M6 -14 C30 -22 62 -28 74 -48 C80 -64 72 -78 60 -80 C58 -98 46 -112 26 -118 C10 -116 0 -96 -2 -70 C-4 -46 0 -26 6 -14 Z';

const Pupil: React.FC<{ x: number; y: number }> = ({ x, y }) => <circle cx={x} cy={y} r={5.5} fill={L.black} opacity={.92} />;

// Mukut (after Tholu Bommalata kireetams, our own drawing). Built as separate tiers of leather, like the real
// crowns, so it never reads as a cap:
//   brow band (projects forward, with a front crest) · jewelled mound with a beaded, scalloped outline ·
//   a flared lotus collar with pointed ends · a tall bud-shaped finial · curled flame-leaves behind the ear ·
//   a large ear disc. Each piece cuts the pieces under it, so every area is one layer of leather.
// 'tall' = Ram, 'short' = Lakshman, 'cap' = Hanuman.
type P2 = [number, number];
type Kind = 'tall' | 'short' | 'cap';
const bez = (a: P2, b: P2, c: P2, d: P2, n: number): P2[] => Array.from({ length: n + 1 }, (_, i) => {
  const t = i / n, u = 1 - t;
  return [u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0], u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1]];
});
const poly = (pts: P2[]) => 'M' + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L') + ' Z';
// push a run of outline points outward in bead-like lobes
function scallop(pts: P2[], centre: P2, amp: number, period: number): P2[] {
  let s = 0;
  return pts.map((p, i) => {
    if (i) s += Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]);
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    let nx = -(b[1] - a[1]), ny = b[0] - a[0]; const m = Math.hypot(nx, ny) || 1; nx /= m; ny /= m;
    if (nx * (p[0] - centre[0]) + ny * (p[1] - centre[1]) < 0) { nx = -nx; ny = -ny; }
    const o = amp * Math.pow(Math.abs(Math.sin(Math.PI * s / period)), .6);
    return [p[0] + nx * o, p[1] + ny * o];
  });
}
const densePts = (pts: P2[], n = 3): P2[] => pts.flatMap((p, i) => i === pts.length - 1 ? [p] : Array.from({ length: n }, (_, j) => [p[0] + (pts[i + 1][0] - p[0]) * j / n, p[1] + (pts[i + 1][1] - p[1]) * j / n] as P2));

const DISC = 'M-40 -96 C-40 -112 -28 -124 -14 -124 C0 -124 12 -112 12 -96 C12 -80 0 -68 -14 -68 C-28 -68 -40 -80 -40 -96 Z';
const MONKEY_CROWN = 'translate(4 8) scale(.84)';
const CROWN_DIMS: Record<Kind, { C: number; T: number; back: number }> = {
  tall: { C: -250, T: -372, back: -86 }, short: { C: -236, T: -330, back: -84 }, cap: { C: -224, T: -304, back: -80 },
};
function crownGeom(kind: Kind) {
  const { C, T, back } = CROWN_DIMS[kind];
  // brow band: along the lower edge, 24 thick, with a pointed crest at the front
  const base = [...bez([-58, -64], [-46, -80], [-28, -100], [-10, -116], 8), ...bez([-10, -116], [12, -132], [34, -140], [58, -142], 8).slice(1)];
  const upper = base.map(([x, y], i) => [x + 6, y - 24 - (i / base.length) * 2] as P2);
  const band = poly([...base, [64, -146], [62, -162], [56, -172], [58, -194], [50, -178], [44, -170], ...upper.slice().reverse()]);
  // mound: near-vertical front, flat under the collar, beaded back
  const front = bez([48, -164], [56, -192], [46, -222], [36, C + 4], 8);
  const backTop = bez([-46, C + 14], [-80, C + 30], [back - 6, -200], [back, -150], 12);
  const backLow = bez([back, -150], [back + 2, -114], [-76, -88], [-60, -78], 8);
  const beaded = scallop(densePts([...backTop, ...backLow.slice(1)], 3), [-10, -160], 7, 22);
  const mound = poly([...upper.slice().reverse().slice(0, 1), ...front, ...beaded, ...upper.slice(0, 2)].filter(Boolean) as P2[]);
  // lotus collar: a flared ring wider than the mound, pointed at both ends
  const cx0 = -60 - 18, cx1 = 58;
  const collar = poly([
    [cx0, C + 18], ...bez([cx0, C + 18], [-40, C - 14], [30, C - 22], [cx1, C - 8], 10).slice(1),
    [cx1 - 6, C + 2], ...bez([cx1 - 6, C + 2], [30, C + 10], [-30, C + 20], [cx0 + 14, C + 24], 8).slice(1),
  ]);
  // finial: bud-shaped, leaning forward, with a small neck ring
  const sx = kind === 'cap' ? 8 : 18;
  const finial = poly([
    ...bez([-28, C - 2], [-36, C - 40], [-6, T + 50], [sx, T], 12),
    ...bez([sx, T], [28, T + 50], [38, C - 36], [26, C - 6], 12).slice(1),
  ]);
  // curled flame-leaves behind the ear
  const leaves: [number, number, number][][] = [
    [[-66, -132, 30], [-94, -146, 22], [-110, -164, 11], [-110, -180, 2]],
    [[-70, -110, 28], [-102, -112, 20], [-120, -124, 9], [-124, -136, 2]],
    [[-64, -90, 22], [-92, -84, 15], [-108, -88, 7], [-112, -98, 2]],
  ];
  return { band, mound, collar, finial, leaves, C, T, sx, back };
}
export const crownCut = (kind: Kind) => {
  const g = crownGeom(kind);
  return <>{[g.band, g.mound, g.collar, g.finial, DISC, ...g.leaves.map(tube)].map((d, i) => <path key={i} d={d} />)}</>;
};

function crown(kind: Kind, k: string, human = true) {
  const g = crownGeom(kind), { C, T, sx } = g;
  const med: [number, number, number][] = {
    tall: [[-60, -128, 12], [-36, -150, 13], [-8, -168, 13], [20, -180, 11], [-64, -178, 12], [-38, -204, 13], [-8, -222, 12], [20, -214, 10]],
    short: [[-60, -128, 12], [-36, -150, 13], [-8, -168, 13], [20, -180, 11], [-62, -178, 12], [-36, -202, 12], [-6, -210, 10]],
    cap: [[-56, -126, 11], [-32, -148, 12], [-4, -166, 12], [20, -178, 10], [-58, -174, 11], [-30, -196, 11], [-2, -204, 9]],
  }[kind] as [number, number, number][];
  const P = (d: string) => <path d={d} />;
  return (
    <g>
      {human && (
        <Leather id={k + '-lock'} d={tube([[-58, -70, 18], [-66, -20, 15], [-64, 30, 12], [-58, 64, 8]])} fill={L.turmeric}
          cut={<>{P(g.band)}{P(DISC)}</>}
          holes={<Dots pts={along([[-58, -50], [-66, -20], [-64, 30], [-58, 58]], 14)} r={2.8} />}
          paint={<>{[-30, 6, 42].map(y => <circle key={y} cx={-65} cy={y} r={5} fill={L.vermilion} opacity={.7} />)}</>} />
      )}
      {g.leaves.map((sp, i) => (
        <Leather key={i} id={`${k}-lf${i}`} d={tube(sp)} fill={i === 1 ? L.leaf : L.vermilion} alpha={.82}
          cut={<>{P(g.mound)}{P(g.band)}{P(DISC)}</>}
          holes={<Slits pts={along(sp.map(([x, y]) => [x, y] as P2), 12).slice(1, -1)} len={8} ang={80} w={1.8} />} />
      ))}
      <Leather id={k + '-mound'} d={g.mound} fill={L.turmeric} cut={<>{P(g.band)}{P(g.collar)}{P(DISC)}</>}
        holes={<>{med.map(([x, y, r], i) => <Rosette key={i} x={x} y={y} r={r} n={8} />)}</>}
        paint={<>{med.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r * 1.2} fill={i % 2 ? L.leaf : L.vermilion} opacity={.55} />)}</>} />
      <Leather id={k + '-fin'} d={g.finial} fill={L.turmeric} cut={P(g.collar)}
        holes={<>
          {[.3, .55].map((u, i) => { const y = C - 8 + (T - C) * u, w = 30 * (1 - u) + 6; return <Dots key={i} pts={Array.from({ length: 5 }, (_, j) => [sx * u - 4 - w * .6 + j * w * .3, y] as P2)} r={2.4} />; })}
          <Rosette x={-4} y={C - 26} r={11} />
          <circle cx={sx - 2} cy={T + 22} r={3.4} />
        </>}
        paint={<>
          {[.42, .7].map((u, i) => { const y = C - 8 + (T - C) * u; return <path key={i} d={`M-60 ${y - 5} L60 ${y - 9} L60 ${y + 1} L-60 ${y + 5} Z`} fill={i ? L.leaf : L.vermilion} opacity={.6} />; })}
        </>} />
      <Leather id={k + '-collar'} d={g.collar} fill={L.turmeric}
        holes={<><Dots pts={bez([-62, C + 12], [-30, C - 4], [20, C - 10], [48, C - 6], 10).slice(1, -1)} r={2.6} /><Rosette x={-6} y={C + 2} r={8} n={6} /></>}
        paint={<path d={g.collar} fill={L.vermilion} opacity={.35} />} />
      <Leather id={k + '-band'} d={g.band} fill={L.turmeric}
        holes={<><Dots pts={along([[-50, -84], [-24, -110], [8, -130], [40, -142]], 10)} r={2.6} /><Rosette x={20} y={-146} r={9} n={6} /><circle cx={54} cy={-178} r={2.6} /></>}
        paint={<>{[[-34, -104], [4, -134], [40, -150]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={6} ry={4.5} fill={i % 2 ? L.leaf : L.vermilion} opacity={.7} />)}</>} />
      <Leather id={k + '-disc'} d={DISC} fill={L.turmeric}
        holes={<><Rosette x={-14} y={-96} r={16} n={10} /><DotLine pts={arcPts(-14, -96, 22, 22, 0, Math.PI * 2, 24)} step={9} r={1.8} /></>}
        paint={<circle cx={-14} cy={-96} r={18} fill={L.vermilion} opacity={.5} />} />
    </g>
  );
}

function headPart(o: Opts): Part {
  const monkey = o.head !== 'human';
  const earring: Part = {
    id: 'earring', at: monkey ? [-6, -70] : [-14, -76], rivet: true,
    draw: (k) => <Leather id={k} d="M-10 0 L10 0 L14 34 C14 50 -14 50 -14 34 Z" fill={L.turmeric} holes={<circle cx={0} cy={34} r={6} />} />,
  };
  return {
    id: 'head', at: [6, -336],
    children: [earring],
    draw: (k) => monkey ? (
      <g transform="scale(1.32)">
        <Leather id={k + '-h'} d={MONKEY_HEAD} fill={o.fur || L.fur} cut={o.crown && <g transform={MONKEY_CROWN}>{crownCut(o.crown)}</g>} holes={<><DotLine pts={arcPts(-6, -70, 36, 60, Math.PI * .6, Math.PI * 1.4)} step={12} r={3} /><circle cx={-8} cy={-96} r={8} /></>} />
        <Leather id={k + '-m'} d={MONKEY_MASK} fill={L.monkeyFace} alpha={.86} cut={o.crown && <g transform={MONKEY_CROWN}>{crownCut(o.crown)}</g>}
          holes={<>
            <path d={slitPath(22, -92, 54, -96, 10)} />
            {o.head === 'monkeyLaugh' && <path d="M40 -40 C52 -46 70 -50 78 -60 C74 -44 60 -30 42 -30 Z" />}
            <circle cx={72} cy={-62} r={2.6} />
          </>}
          paint={<path d="M26 -108 Q42 -116 60 -104" fill="none" stroke={L.black} strokeWidth={5} />} />
        <Pupil x={40} y={-95} />
        {o.head === 'monkeyLaugh' && <Dots pts={[[50, -40], [60, -44], [70, -50]]} r={3} />}
        {o.crown && <g transform={MONKEY_CROWN}>{crown(o.crown, k, false)}</g>}
      </g>
    ) : (
      <g>
        <Leather id={k + '-hair'} d={HAIR} fill={L.black} alpha={.88} cut={o.crown && <>{crownCut(o.crown)}</>} holes={<DotLine pts={[[-40, -120], [-52, -60], [-44, 20]]} step={14} r={2.6} />} />
        <Leather id={k + '-f'} d={FACE} fill={o.skin} cut={o.crown && <>{crownCut(o.crown)}</>}
          holes={<>
            <path d={slitPath(10, -110, 46, -113, 8.5)} />
            <path d="M8 -110 C0 -108 -8 -104 -16 -104 C-8 -110 0 -112 8 -110 Z" />
            <DotLine pts={[[-20, -12], [16, -14]]} step={9} r={2.4} />
          </>}
          paint={<>
            <path d="M6 -126 Q28 -138 50 -124" fill="none" stroke={L.black} strokeWidth={4.5} />
            <path d="M40 -60 C44 -62 48 -61 48 -58 C46 -55 42 -55 40 -57 Z" fill={L.vermilion} />
            {o.mustache && <path d="M42 -66 C36 -60 26 -62 22 -70" fill="none" stroke={L.black} strokeWidth={4} />}
            <path d="M40 -150 L40 -132" stroke={L.vermilion} strokeWidth={4} />
          </>} />
        <Pupil x={30} y={-111} />
        {o.crown && crown(o.crown, k)}
      </g>
    ),
  };
}

function arm(side: 'front' | 'back', o: Opts): Part {
  const skin = o.skin;
  const weapon: Part[] = [];
  if (side === 'back' && o.weapon === 'bow') weapon.push({
    id: 'bow', at: [6, 60],
    draw: (k) => {
      const pts = arcPts(-230, 0, 280, 330, -Math.PI / 2.1, Math.PI / 2.1, 28).map(([x, y]) => [x + 0, y] as [number, number]);
      return (
        <g>
          <line x1={pts[0][0]} y1={pts[0][1]} x2={pts[pts.length - 1][0]} y2={pts[pts.length - 1][1]} stroke={L.black} strokeWidth={2.4} opacity={.7} />
          <Leather id={k} d={tube(pts.map(([x, y], i) => [x, y, 16 - Math.abs(i - 14) * .5]))} fill={L.maroon} holes={<Dots pts={along(pts, 26).slice(1, -1)} r={3} />} />
        </g>
      );
    },
  });
  if (side === 'front' && o.weapon === 'mace') weapon.push({
    id: 'mace', at: [8, 56], rot: 160,
    draw: (k) => (
      <g>
        <Leather id={k + '-s'} d={tube([[0, 40, 16], [0, -210, 14]])} fill={L.turmeric} holes={<DotLine pts={[[0, 20], [0, -200]]} step={20} r={2.6} />} />
        <Leather id={k + '-h'} d="M0 -330 C40 -330 64 -300 64 -262 C64 -226 40 -206 0 -206 C-40 -206 -64 -226 -64 -262 C-64 -300 -40 -330 0 -330 Z M-6 -330 L0 -360 L6 -330 Z" fill={L.turmeric}
          holes={<><Rosette x={0} y={-268} r={22} />{[-40, 40].map(x => <Slits key={x} pts={along([[x, -300], [x, -236]], 16)} len={10} ang={90} w={2.4} />)}</>} />
      </g>
    ),
  });
  return {
    id: side + 'Arm', at: side === 'front' ? [38, -300] : [-40, -300], rivet: true, behind: side === 'back',
    draw: (k) => <Leather id={k} d={tube([[0, 0, 40], [6, 80, 34], [10, 150, 28]])} fill={skin} holes={<DotLine pts={[[-12, 60], [22, 62]]} step={8} r={2.8} />} />,
    children: [{
      id: side + 'Fore', at: [10, 150], rivet: true,
      draw: (k) => <Leather id={k} d={tube([[0, 0, 28], [0, 70, 24], [0, 138, 20]])} fill={skin} holes={<DotLine pts={[[-9, 118], [9, 118]]} step={6} r={2.4} />} />,
      children: [{
        id: side + 'Hand', at: [0, 138], rivet: true,
        draw: (k) => <Leather id={k} d={HAND} fill={skin} />,
        children: weapon,
      }],
    }],
  };
}

function leg(side: 'front' | 'back', o: Opts): Part {
  const fur = o.lower === 'langot';
  return {
    id: side + 'Leg', at: side === 'front' ? [44, fur ? 90 : 254] : [-40, fur ? 90 : 254], rivet: true, behind: side === 'back',
    draw: (k) => (
      <Leather id={k} d={fur
        ? tube([[0, -10, 52], [10, 90, 44], [4, 180, 28], [0, 280, 22]]) + ' M-14 270 C4 274 50 280 66 292 C72 300 66 310 58 310 L-18 310 C-24 300 -22 286 -14 270 Z'
        : 'M-17 0 L17 0 L15 118 C34 120 62 124 74 134 C78 140 76 148 68 148 L-16 148 C-20 140 -18 128 -15 118 Z'}
        fill={o.skin} holes={<DotLine pts={fur ? [[-16, 268], [16, 268]] : [[-14, 108], [14, 108]]} step={7} r={2.6} />} />
    ),
  };
}

export function humanoid(o: Opts): Part {
  const lower = o.lower === 'langot' ? LANGOT : DHOTI;
  const kids: Part[] = [];
  if (o.tail) kids.push({
    id: 'tail', at: [-54, -10], rivet: true, behind: true,
    draw: (k) => {
      const sp: [number, number, number][] = [[0, 0, 26], [-60, 20, 24], [-120, 0, 22], [-150, -70, 20], [-140, -150, 18], [-100, -200, 16], [-50, -205, 14], [-20, -175, 12], [-30, -140, 10], [-60, -140, 9]];
      return <Leather id={k} d={tube(sp)} fill={o.fur || L.fur} holes={<Dots pts={along(sp.map(([x, y]) => [x, y] as [number, number]), 28).slice(1)} r={3.2} />} />;
    },
  });
  if (o.quiver) kids.push({
    id: 'quiver', at: [-70, -300], rot: -14, behind: true,
    draw: (k) => (
      <g>
        {[-10, 4, 16].map((x, i) => <Leather key={i} id={`${k}-f${i}`} d={`M${x - 6} 0 L${x} -70 L${x + 6} 0 Z`} fill={L.vermilion} holes={<Slits pts={[[x, -40]]} len={20} ang={90} w={1.6} />} />)}
        <Leather id={k} d="M-22 0 L22 0 L28 230 L-14 236 Z" fill={L.maroon} holes={<><DotLine pts={[[-8, 20], [8, 220]]} step={16} r={3} /><Rosette x={4} y={110} r={12} /></>} />
      </g>
    ),
  });
  kids.push(arm('back', o), leg('back', o), leg('front', o), headPart(o), arm('front', o));
  return {
    id: 'torso', at: [0, 0],
    draw: (k) => (
      <g>
        <Leather id={k + '-t'} d={TORSO} fill={o.skin}
          holes={<>
            <DotLine pts={arcPts(4, -334, 56, 62, Math.PI * .22, Math.PI * .86)} step={11} r={3.4} />
            <DotLine pts={arcPts(4, -334, 64, 120, Math.PI * .25, Math.PI * .8)} step={12} r={3} />
            <Rosette x={6} y={-218} r={13} />
            {o.head === 'human' && <DotLine pts={[[-52, -322], [50, -70]]} step={14} r={2.2} />}
            <DotLine pts={[[-50, -46], [48, -46]]} step={10} r={2.6} />
          </>} />
        <Leather id={k + '-l'} d={lower} fill={o.dhoti}
          holes={o.lower === 'langot' ? <><Rosette x={0} y={20} r={16} /><DotLine pts={[[-50, -10], [50, -10]]} step={12} r={3} /></> : <>
            {[-44, -14, 20, 50].map(x => <Slits key={x} pts={along([[x, -4], [x * 1.1, 200]], 24)} len={14} ang={90} w={2.4} />)}
            <Rosette x={-34} y={70} r={16} /><Rosette x={36} y={70} r={16} />
          </>} />
        {o.lower !== 'langot' && <Leather id={k + '-hem'} d="M-76 222 L-12 230 L-12 268 L-74 258 Z M6 230 L82 222 L82 258 L24 268 Z" fill={o.hem} holes={<><DotLine pts={[[-70, 246], [-18, 250]]} step={10} r={2.6} /><DotLine pts={[[28, 250], [78, 242]]} step={10} r={2.6} /></>} />}
        <Leather id={k + '-w'} d="M-62 -64 L58 -64 L56 -28 L-60 -28 Z" fill={o.hem} holes={<>{[-40, -10, 20, 46].map(x => <Rosette key={x} x={x} y={-46} r={9} n={6} />)}</>} />
        <Leather id={k + '-s'} d="M40 -30 C56 20 60 80 54 140 L40 144 C44 80 40 20 28 -30 Z" fill={o.sash} holes={<DotLine pts={[[44, -10], [48, 130]]} step={16} r={2.6} />} />
      </g>
    ),
    children: kids,
  };
}

export const RAM = humanoid({ name: 'ram', skin: L.ramBlue, dhoti: L.turmeric, hem: L.vermilion, sash: L.leaf, head: 'human', crown: 'tall', weapon: 'bow', quiver: true });
export const LAKSHMAN = humanoid({ name: 'lakshman', skin: L.gold, dhoti: L.vermilion, hem: L.leaf, sash: L.indigo, head: 'human', crown: 'short', weapon: 'bow', quiver: true });
export const HANUMAN = humanoid({ name: 'hanuman', skin: L.fur, fur: L.fur, dhoti: L.vermilion, hem: L.turmeric, sash: L.leaf, head: 'monkey', crown: 'cap', weapon: 'mace', tail: true, lower: 'langot' });
export const VANAR = humanoid({ name: 'vanar', skin: L.vanar, fur: L.vanar, dhoti: L.leaf, hem: L.turmeric, sash: L.vermilion, head: 'monkey', tail: true, lower: 'langot' });
export const VANAR_LAUGH = humanoid({ name: 'vanarLaugh', skin: L.vanar, fur: L.vanar, dhoti: L.leaf, hem: L.turmeric, sash: L.vermilion, head: 'monkeyLaugh', tail: true, lower: 'langot' });
