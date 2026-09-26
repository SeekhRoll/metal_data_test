import React from 'react';
import { Gond, Life, Band, PatternKind } from '../style/gond';
import { C, Col } from '../style/palette';
import { tube, SP } from '../style/geom';

// Gond people: simple profile figures (facing right) with a single eye and patterned clothing (brief §3.2).
// Origin at the feet (standing) or the seat (sitting); height ~520 at s=1 when standing.
export type Outfit = {
  skin: Col; top: Col; topPat: PatternKind; topPatFg: Col; lower: Col; lowerBands: Band[];
  hair: 'turban' | 'bun' | 'short' | 'white-bun' | 'white-turban'; turban?: Col; drape?: Col;
};
export type Pose = 'stand' | 'crouch' | 'sit' | 'scatter';

const FACE = 'M-30 -8 C-44 -38 -36 -78 -2 -84 C28 -88 46 -68 46 -46 L60 -30 L46 -24 L50 -10 C40 2 20 8 0 4 C-14 2 -24 -2 -30 -8 Z';
const HAIR_SHORT = 'M-36 -30 C-50 -66 -30 -96 4 -96 C30 -96 46 -80 48 -60 C24 -74 -8 -72 -24 -46 C-28 -38 -32 -32 -36 -30 Z';
const BUN = 'M-40 -30 C-52 -70 -30 -98 4 -96 C30 -96 44 -80 46 -62 C20 -72 -8 -70 -22 -48 C-26 -38 -30 -30 -40 -30 Z M-40 -64 C-70 -70 -80 -40 -64 -26 C-52 -18 -40 -26 -38 -40 Z';
const TURBAN = 'M-40 -44 C-46 -90 -10 -112 24 -106 C52 -100 60 -78 54 -58 C30 -70 -10 -70 -40 -44 Z';

function capsule(a: [number, number], b: [number, number], w: number) { return tube([[a[0], a[1], w], [b[0], b[1], w * .8]]); }
function limb(pts: [number, number][], w0: number, w1: number): string { return tube(pts.map((p, i) => [p[0], p[1], w0 + (w1 - w0) * i / (pts.length - 1)] as SP)); }

export const Person: React.FC<{ o: Outfit; k: string; x: number; y: number; s?: number; flip?: boolean; pose?: Pose; arm?: number; head?: number; life?: Life; hold?: React.ReactNode; reveal?: number }> =
  ({ o, k, x, y, s = 1, flip, pose = 'stand', arm = 0, head = 0, life = { t: 0 }, hold, reveal = 3 }) => {
    const sit = pose === 'sit', crouch = pose === 'crouch';
    const hipY = sit ? -30 : crouch ? -150 : -250, lean = crouch ? 28 : pose === 'scatter' ? 8 : 0;
    const shY = hipY - 170;
    const ol = 5 / s;
    // torso: a tunic from the shoulders to the hips
    const torso = `M-44 ${hipY} C-54 ${hipY - 80} -48 ${shY + 20} -30 ${shY} C0 ${shY - 12} 34 ${shY - 8} 44 ${shY + 10} C54 ${hipY - 90} 56 ${hipY - 40} 50 ${hipY} Z`;
    const lower = sit
      ? `M-52 ${hipY - 6} L48 ${hipY - 6} C96 ${hipY + 2} 150 ${hipY + 10} 168 ${hipY + 34} C174 ${hipY + 50} 160 ${hipY + 60} 130 ${hipY + 60} L-60 ${hipY + 60} C-70 ${hipY + 40} -66 ${hipY + 10} -52 ${hipY - 6} Z`
      : crouch
        ? `M-50 ${hipY - 4} L50 ${hipY - 4} C92 ${hipY + 20} 110 ${hipY + 70} 96 ${hipY + 110} L70 ${hipY + 150} L40 ${hipY + 150} L56 ${hipY + 104} C30 ${hipY + 80} -10 ${hipY + 90} -30 ${hipY + 150} L-60 ${hipY + 150} C-70 ${hipY + 90} -64 ${hipY + 30} -50 ${hipY - 4} Z`
        : `M-48 ${hipY - 4} L50 ${hipY - 4} C58 ${hipY + 70} 56 ${hipY + 150} 50 ${hipY + 210} L20 ${hipY + 210} L4 ${hipY + 80} L-12 ${hipY + 210} L-44 ${hipY + 210} C-52 ${hipY + 150} -56 ${hipY + 70} -48 ${hipY - 4} Z`;
    const feet = sit ? '' : crouch
      ? `M40 ${hipY + 146} L96 ${hipY + 146} C104 ${hipY + 146} 104 ${hipY + 156} 96 ${hipY + 158} L40 ${hipY + 158} Z M-60 ${hipY + 146} L-6 ${hipY + 146} C2 ${hipY + 146} 2 ${hipY + 156} -6 ${hipY + 158} L-60 ${hipY + 158} Z`
      : `M18 ${hipY + 206} L70 ${hipY + 206} C80 ${hipY + 208} 80 ${hipY + 220} 70 ${hipY + 222} L18 ${hipY + 222} Z M-46 ${hipY + 206} L2 ${hipY + 206} C12 ${hipY + 208} 12 ${hipY + 220} 2 ${hipY + 222} L-46 ${hipY + 222} Z`;
    // the near arm: shoulder -> elbow -> hand, rotated by `arm` (degrees, positive = forward/up)
    const sh: [number, number] = [22, shY + 20], a = (arm) * Math.PI / 180;
    const el: [number, number] = [sh[0] + Math.sin(a) * 90 + 10, sh[1] + Math.cos(a) * 90];
    const b = a + (sit ? .9 : .35);
    const hd: [number, number] = [el[0] + Math.sin(b) * 84, el[1] + Math.cos(b) * 84];
    const armD = limb([sh, el, hd], 30, 22);
    const hand = `M${hd[0] - 12} ${hd[1] - 6} C${hd[0] - 10} ${hd[1] + 18} ${hd[0] + 16} ${hd[1] + 22} ${hd[0] + 20} ${hd[1] + 4} C${hd[0] + 18} ${hd[1] - 12} ${hd[0] + 2} ${hd[1] - 16} ${hd[0] - 12} ${hd[1] - 6} Z`;
    const headY = shY - 18;
    const hair = o.hair === 'turban' || o.hair === 'white-turban' ? TURBAN : o.hair === 'short' ? HAIR_SHORT : BUN;
    const hairCol = o.hair === 'turban' ? (o.turban ?? C.vermilion) : o.hair === 'white-turban' ? C.white : o.hair.startsWith('white') ? '#E8E2D6' : C.black;
    return (
      <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`} data-id={k}>
        <g transform={`rotate(${lean} 0 ${hipY})`}>
          <Gond k={k + '-low'} d={lower} fill={o.lower} bands={o.lowerBands} life={life} outline={ol} reveal={reveal} />
          {feet && <Gond k={k + '-feet'} d={feet} fill={o.skin} life={life} outline={ol} inner={null} reveal={reveal} />}
          <Gond k={k + '-top'} d={torso} fill={o.top} pattern={{ kind: o.topPat, fg: o.topPatFg, s: .8 }} bands={[{ w: 10, kind: 'dash', color: C.black, gap: 10 }]} life={life} outline={ol} reveal={reveal} />
          {o.drape && <Gond k={k + '-drape'} d={`M-40 ${shY + 4} C-10 ${shY - 6} 30 ${shY - 2} 40 ${shY + 12} L-20 ${hipY - 10} L-46 ${hipY - 30} Z`} fill={o.drape} bands={[{ w: 8, kind: 'dots', color: C.yellow, gap: 12 }]} life={life} outline={ol} reveal={reveal} />}
          <g transform={`translate(4 ${headY}) rotate(${head})`}>
            <path d={`M-8 12 L-8 40 L22 40 L20 12 Z`} fill={o.skin} stroke={C.black} strokeWidth={ol} />
            <Gond k={k + '-face'} d={FACE} fill={o.skin} life={life} outline={ol} inner={null} reveal={reveal} />
            <Gond k={k + '-hair'} d={hair} fill={hairCol} bands={o.hair.includes('turban') ? [{ w: 8, kind: 'dash', color: C.yellow, gap: 9 }] : []} life={life} outline={ol} inner={null} reveal={reveal} />
            <g opacity={Math.min(1, Math.max(0, reveal - 1))}>
              <path d="M8 -52 C16 -60 30 -60 36 -52 C30 -46 16 -46 8 -52 Z" fill={C.white} stroke={C.black} strokeWidth={2.5} />
              <circle cx={24} cy={-52} r={4} fill={C.black} />
              <path d="M26 -14 C32 -12 38 -12 42 -16" stroke={C.black} strokeWidth={2.5} fill="none" />
            </g>
          </g>
          {hold && <g transform={`translate(${hd[0]} ${hd[1]})`}>{hold}</g>}
          <Gond k={k + '-arm'} d={armD} fill={o.top} bands={[{ w: 8, kind: 'dots', color: C.white, gap: 12 }]} life={life} outline={ol} inner={null} reveal={reveal} />
          <Gond k={k + '-hand'} d={hand} fill={o.skin} life={life} outline={ol} inner={null} reveal={reveal} />
        </g>
      </g>
    );
  };

// ---------------------------------------------------------------- the cast
export const HUNTER: Outfit = { skin: C.brown, top: C.plum, topPat: 'chevrons', topPatFg: C.marigold, lower: C.black, lowerBands: [{ w: 10, kind: 'dash', color: C.vermilion }], hair: 'turban', turban: C.vermilion };
export const FAMILY: { name: string; o: Outfit; s: number }[] = [
  { name: 'दादाजी', o: { skin: C.brown, top: C.white, topPat: 'dots', topPatFg: C.cobalt, lower: C.white, lowerBands: [{ w: 10, kind: 'dash', color: C.cobalt }], hair: 'white-turban' }, s: .95 },
  { name: 'दादीजी', o: { skin: C.brown, top: C.magenta, topPat: 'seeds', topPatFg: C.yellow, lower: C.magenta, lowerBands: [{ w: 12, kind: 'solid', color: C.yellow }, { w: 8, kind: 'dots', color: C.white }], hair: 'white-bun', drape: C.yellow }, s: .92 },
  { name: 'पिता', o: { skin: C.brown, top: C.turquoise, topPat: 'chevrons', topPatFg: C.white, lower: C.cobalt, lowerBands: [{ w: 10, kind: 'dash', color: C.yellow }], hair: 'short' }, s: 1 },
  { name: 'माँ', o: { skin: C.brown, top: C.vermilion, topPat: 'scales', topPatFg: C.yellow, lower: C.leaf, lowerBands: [{ w: 12, kind: 'solid', color: C.marigold }, { w: 8, kind: 'dots', color: C.white }], hair: 'bun', drape: C.marigold }, s: .96 },
  { name: 'बिटिया', o: { skin: C.brown, top: C.yellow, topPat: 'dots', topPatFg: C.magenta, lower: C.magenta, lowerBands: [{ w: 8, kind: 'dash', color: C.white }], hair: 'bun' }, s: .66 },
  { name: 'बेटा', o: { skin: C.brown, top: C.leaf, topPat: 'dashes', topPatFg: C.yellow, lower: C.marigold, lowerBands: [{ w: 8, kind: 'dots', color: C.vermilion }], hair: 'short' }, s: .62 },
];

// the hunter's stick, and props for the family scene
export const Stick: React.FC<{ len?: number; ang?: number }> = ({ len = 420, ang = -70 }) => (
  <g transform={`rotate(${ang})`}>
    <Gond k="stick" d={tube([[0, 0, 16], [len, 0, 12]])} fill={C.marigold} bands={[{ w: 6, kind: 'dash', color: C.black, gap: 10 }]} outline={4} inner={null} />
  </g>
);
export const Cup: React.FC<{ k: string }> = ({ k }) => (
  <g><Gond k={k} d="M-18 -30 L18 -30 L14 6 C12 12 -12 12 -14 6 Z" fill={C.white} bands={[{ w: 6, kind: 'dash', color: C.vermilion, gap: 7 }]} outline={4} inner={null} /><path d="M-16 -34 C-8 -44 -4 -52 -10 -60 M0 -34 C8 -44 12 -52 6 -60" stroke={C.black} strokeWidth={2.5} fill="none" opacity={.7} /></g>
);
