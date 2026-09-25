import React from 'react';
import { C } from '../styles/palette';
import { Bharni, Line, tube, lens, circle } from '../styles/paint';

// Madhubani figure conventions (brief 3.2): profile face, large fish-shaped eye drawn whole,
// one continuous forehead-to-nose line, long fingers, flat feet. Every pose is its own drawing
// assembled from these parts; nothing is rotated at a joint (brief 3.3, replacement animation).

export type Kind = 'sudama' | 'wife' | 'krishna';
export type Eye = 'open' | 'closed' | 'down';
export type Mouth = 'neutral' | 'smile' | 'open';
export type XY = [number, number];
export type Spine = [number, number, number][];

export const SKIN: Record<Kind, string> = { sudama: C.turmericLight, wife: C.turmericLight, krishna: C.indigoLight };

// ---------------------------------------------------------------- head (facing right, centre at 0,0)
const FACE = 'M-4 -64 C16 -66 31 -57 35 -40 C37 -31 38 -27 41 -22 L68 6 C62 11 51 11 45 11 C48 14 50 17 47 20 C44 21 43 22 44 24 C48 26 48 31 43 34 C43 44 37 53 23 55 C9 57 -3 55 -10 49 C-40 41 -58 13 -56 -18 C-54 -46 -33 -63 -4 -64 Z';

const EyeShape: React.FC<{ eye: Eye }> = ({ eye }) => {
  if (eye === 'closed') return (
    <g fill="none" stroke={C.black} strokeLinecap="round">
      <path d="M-6 -18 C8 -8 30 -8 44 -18" strokeWidth={4.5} />
      <path d="M4 -12 L0 -5 M16 -10 L14 -2 M28 -10 L28 -2 M38 -13 L41 -6" strokeWidth={2} />
      <path d="M-6 -18 C-16 -21 -22 -23 -30 -20" strokeWidth={3.5} />
    </g>
  );
  const down = eye === 'down';
  const white = down ? 'M-8 -13 C6 -24 32 -24 44 -13 C32 -3 6 -1 -8 -13 Z' : 'M-8 -16 C4 -34 32 -33 44 -18 C32 -3 6 -1 -8 -16 Z';
  return (
    <g>
      <path d={white} fill={C.paper} />
      <clipPath id={'eyeclip-' + eye}><path d={white} /></clipPath>
      <g clipPath={`url(#eyeclip-${eye})`}>
        <circle cx={21} cy={down ? -8 : -17} r={9.5} fill={C.black} />
        <circle cx={24} cy={down ? -10 : -20} r={2.6} fill={C.paper} />
      </g>
      <path d={white} fill="none" stroke={C.black} strokeWidth={3} />
      <path d={down ? 'M-8 -13 C6 -24 32 -24 44 -13' : 'M-8 -16 C4 -34 32 -33 44 -18'} fill="none" stroke={C.black} strokeWidth={5.5} strokeLinecap="round" />
      <path d={down ? 'M-8 -13 C-18 -16 -24 -17 -32 -14' : 'M-8 -16 C-18 -20 -24 -22 -32 -19'} fill="none" stroke={C.black} strokeWidth={3.5} strokeLinecap="round" />
    </g>
  );
};

const MouthShape: React.FC<{ mouth: Mouth }> = ({ mouth }) => (
  <g>
    {mouth === 'open'
      ? <Line d="M37 19 C44 17 50 19 51 23 C48 29 42 30 37 26 Z" fill="#7a1d14" w={2.4} />
      : <Line d="M40 21 C44 19 48 20 49 23 C46 26 43 26 40 24 Z" fill={C.vermilion} w={2.2} />}
    {mouth === 'smile' && <path d="M40 23 C36 22 34 20 33 17" fill="none" stroke={C.black} strokeWidth={2.4} strokeLinecap="round" />}
    <path d="M49 6 C51 3 55 3 56 6" fill="none" stroke={C.black} strokeWidth={2} />
  </g>
);

const Kundal: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M0 0 L0 8" stroke={C.black} strokeWidth={2} />
    <Line d="M-12 18 C-6 8 8 8 14 18 C8 28 -6 28 -12 18 Z" fill={C.turmeric} w={2.2} />
    <path d="M-12 18 L-20 12 L-20 24 Z" fill={C.vermilion} stroke={C.black} strokeWidth={1.8} />
    <circle cx={8} cy={17} r={2.2} fill={C.black} />
  </g>
);

export const Head: React.FC<{ kind: Kind; eye?: Eye; mouth?: Mouth; tear?: boolean }> = ({ kind, eye = 'open', mouth = 'neutral', tear }) => {
  const skin = SKIN[kind];
  return (
    <g>
      {/* behind the face */}
      {kind === 'wife' && <Bharni d={circle(-56, -6, 24)} fill={C.black} band={2} hatch={false} />}
      {kind === 'wife' && <Bharni d="M26 -62 C0 -82 -54 -74 -70 -30 C-80 2 -76 44 -64 84 L-40 88 C-52 44 -54 2 -44 -30 C-34 -56 -2 -64 26 -62 Z" fill={C.vermilion} pattern="dotsPaper" band={3.5} />}
      {kind === 'krishna' && (
        <g>
          <path d="M-16 -108 C-30 -140 -46 -170 -62 -206" fill="none" stroke={C.black} strokeWidth={7} strokeLinecap="round" />
          <path d="M-16 -108 C-30 -140 -46 -170 -62 -206" fill="none" stroke={C.leaf} strokeWidth={3} strokeLinecap="round" />
          <Bharni d={lens(-44, -160, -82, -262, 26)} fill={C.leaf} pattern="pleats" band={2.5} />
          <Line d={circle(-70, -234, 20)} fill={C.turmeric} w={2.5} />
          <Line d={circle(-70, -234, 13)} fill={C.indigoLight} w={2.2} />
          <circle cx={-70} cy={-234} r={6} fill={C.indigo} />
          <Bharni d="M-4 -64 C-33 -63 -54 -46 -56 -18 C-60 20 -64 62 -52 94 C-42 100 -30 96 -26 84 C-34 50 -30 2 -18 -28 C-8 -46 6 -56 22 -60 C14 -64 6 -65 -4 -64 Z" fill={C.black} band={2} hatch={false} />
          {[[-52, 94], [-40, 98], [-28, 88]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={7} fill={C.black} />)}
        </g>
      )}
      {/* face */}
      <Line d={FACE} fill={skin} w={3.4} />
      <path d="M-20 -16 C-34 -18 -36 8 -20 6" fill={skin} stroke={C.black} strokeWidth={3} />
      <EyeShape eye={eye} />
      <path d={eye === 'down' ? 'M-12 -34 C4 -42 30 -42 46 -32' : 'M-12 -40 C4 -50 30 -50 46 -38'} fill="none" stroke={C.black} strokeWidth={4.5} strokeLinecap="round" />
      <MouthShape mouth={mouth} />
      {tear && <path d="M-2 -2 C-8 8 -6 16 0 16 C6 16 6 8 -2 -2 Z" fill={C.indigoLight} stroke={C.black} strokeWidth={1.6} />}
      {/* hair / headgear in front */}
      {kind === 'sudama' && (
        <g>
          <path d="M-4 -64 C-33 -63 -54 -46 -56 -18 C-57 -4 -52 8 -46 14 C-42 -4 -38 -26 -22 -42 C-12 -52 2 -58 16 -62 C10 -64 4 -64 -4 -64 Z" fill={C.black} />
          <path d="M-26 -58 C-42 -80 -30 -98 -14 -88 C-22 -82 -24 -72 -18 -60 Z" fill={C.black} />
          <circle cx={-20} cy={-62} r={5} fill={C.black} />
          <Line d="M43 30 C45 46 38 66 22 90 C12 74 0 62 -10 49 C4 56 18 56 30 50 C38 44 42 38 43 30 Z" fill={C.paperShade} w={2.6} />
          {[[36, 44, 26, 74], [28, 52, 20, 84], [18, 54, 12, 76], [8, 54, 4, 66]].map(([a, b, c, d], i) => <path key={i} d={`M${a} ${b} Q${(a + c) / 2 + 4} ${(b + d) / 2} ${c} ${d}`} fill="none" stroke={C.black} strokeWidth={1.8} />)}
          <path d="M27 -60 C27 -50 35 -50 35 -60" fill="none" stroke={C.paper} strokeWidth={3.2} />
          <path d="M31 -58 L31 -50" stroke={C.vermilion} strokeWidth={2.4} />
        </g>
      )}
      {kind === 'wife' && (
        <g>
          <path d="M-4 -64 C-33 -63 -54 -46 -56 -18 C-57 4 -50 22 -40 34 C-40 8 -36 -20 -20 -40 C-8 -52 8 -58 22 -60 C14 -64 6 -65 -4 -64 Z" fill={C.black} />
          <path d="M22 -61 L2 -66" stroke={C.vermilion} strokeWidth={4} strokeLinecap="round" />
          <circle cx={33} cy={-46} r={4.5} fill={C.vermilion} stroke={C.black} strokeWidth={1.5} />
          <circle cx={50} cy={12} r={9} fill="none" stroke={C.turmeric} strokeWidth={3} />
          <Bharni d="M28 -62 C4 -80 -44 -74 -60 -36 C-44 -64 -8 -70 28 -62 Z" fill={C.vermilion} band={2.5} hatch={false} />
          <Kundal x={-22} y={4} />
        </g>
      )}
      {kind === 'krishna' && (
        <g>
          <Bharni d="M-42 -54 L-36 -110 L-18 -90 L-4 -132 L10 -92 L26 -112 L32 -56 C10 -70 -20 -68 -42 -54 Z" fill={C.turmeric} band={3} />
          {[-24, -4, 16].map(x => <circle key={x} cx={x} cy={-72} r={5} fill={C.vermilion} stroke={C.black} strokeWidth={1.8} />)}
          <path d="M-40 -58 C-14 -70 12 -70 32 -60" fill="none" stroke={C.black} strokeWidth={6} strokeDasharray="2 5" />
          <path d="M26 -62 C26 -48 36 -48 36 -62" fill="none" stroke={C.turmeric} strokeWidth={3.5} />
          <path d="M31 -58 L31 -48" stroke={C.vermilion} strokeWidth={2.4} />
          <Kundal x={-22} y={4} />
        </g>
      )}
    </g>
  );
};

// ---------------------------------------------------------------- hands, feet
export type HandKind = 'open' | 'hold' | 'up';
export const Hand: React.FC<{ x: number; y: number; a: number; kind?: HandKind; skin: string; bangles?: boolean }> = ({ x, y, a, kind = 'open', skin, bangles }) => (
  <g transform={`translate(${x} ${y}) rotate(${a})`}>
    {bangles && [-8, -2].map((dx, i) => <path key={i} d={`M${dx} -11 L${dx} 11`} stroke={i ? C.vermilion : C.turmeric} strokeWidth={5} />)}
    {kind === 'hold'
      ? <Line d="M-4 -10 C10 -14 24 -10 26 0 C26 10 14 14 0 11 C-6 8 -8 -4 -4 -10 Z" fill={skin} w={2.8} />
      : (
        <g>
          {[0, 1, 2, 3].map(i => <Line key={i} d={tube([[18, -7 + i * 4.6, 6.5], [32, -9 + i * 6, 6], [44, -11 + i * 7.4, 5]])} fill={skin} w={2.2} />)}
          <Line d={tube([[6, -8, 8], [14, -18, 7], [22, -24, 6]])} fill={skin} w={2.2} />
          <Line d="M-4 -10 C8 -13 20 -11 24 -5 C26 2 22 8 12 10 C2 11 -4 8 -6 2 Z" fill={skin} w={2.6} />
        </g>
      )}
    {kind === 'hold' && <path d="M8 -9 L10 10 M15 -9 L17 11 M22 -6 L23 9" stroke={C.black} strokeWidth={1.8} />}
  </g>
);

export const Foot: React.FC<{ x: number; y: number; a?: number; skin: string; anklet?: boolean }> = ({ x, y, a = 0, skin, anklet }) => (
  <g transform={`translate(${x} ${y}) rotate(${a})`}>
    <Line d="M-14 -8 C-20 6 -10 14 4 14 L44 14 C54 13 54 3 42 0 L12 -10 Z" fill={skin} w={2.8} />
    {[34, 40, 46].map(tx => <path key={tx} d={`M${tx} 6 l0 7`} stroke={C.black} strokeWidth={1.6} />)}
    {anklet && <path d="M-16 -10 C-6 -4 6 -6 14 -12" fill="none" stroke={C.turmeric} strokeWidth={6} />}
  </g>
);

// ---------------------------------------------------------------- props
export const Potli: React.FC<{ x: number; y: number; s?: number; open?: boolean }> = ({ x, y, s = 1, open }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {open ? (
      <g>
        <Bharni d="M-60 4 C-74 -26 -54 -46 -38 -34 L38 -34 C54 -46 74 -26 60 4 C40 20 -40 20 -60 4 Z" fill={C.paper} band={3} />
        <path d="M-58 -2 C-30 12 30 12 58 -2" fill="none" stroke={C.vermilion} strokeWidth={6} />
        {Array.from({ length: 16 }, (_, i) => <ellipse key={i} cx={-40 + (i % 8) * 11 + (i > 7 ? 5 : 0)} cy={-30 - (i > 7 ? 8 : 0)} rx={6} ry={3.5} fill={i % 3 ? C.paper : C.turmericLight} stroke={C.black} strokeWidth={1.4} transform={`rotate(${i * 23} ${-40 + (i % 8) * 11} ${-30})`} />)}
      </g>
    ) : (
      <g>
        <Bharni d="M-34 0 C-46 -30 -30 -56 -6 -58 L6 -58 C30 -56 46 -30 34 0 C20 12 -20 12 -34 0 Z" fill={C.paper} pattern="dotsBlack" band={3} />
        <path d="M-40 -14 C-20 -4 20 -4 40 -14" fill="none" stroke={C.vermilion} strokeWidth={7} />
        <Line d="M-6 -58 C-20 -78 -8 -86 0 -70 C8 -86 20 -78 6 -58 Z" fill={C.paper} w={2.6} />
        <path d="M-9 -58 L9 -58" stroke={C.vermilion} strokeWidth={5} />
      </g>
    )}
  </g>
);

export const Flute: React.FC<{ x0: number; y0: number; x1: number; y1: number }> = ({ x0, y0, x1, y1 }) => {
  const n = 6, dx = (x1 - x0), dy = (y1 - y0);
  return (
    <g>
      <Bharni d={tube([[x0, y0, 12], [x1, y1, 12]])} fill={C.ochre} band={2} hatch={false} />
      {[0.12, 0.88].map(k => <path key={k} d={`M${x0 + dx * k} ${y0 + dy * k - 7} l0 14`} stroke={C.vermilion} strokeWidth={6} />)}
      {Array.from({ length: n }, (_, i) => <circle key={i} cx={x0 + dx * (.35 + i * .08)} cy={y0 + dy * (.35 + i * .08)} r={2.4} fill={C.black} />)}
      <path d={`M${x1} ${y1} c6 14 -2 26 6 40 M${x1} ${y1} c-4 14 4 26 -2 40`} fill="none" stroke={C.vermilion} strokeWidth={3} />
    </g>
  );
};

export const Garland: React.FC = () => {
  const pts: XY[] = [];
  for (let i = 0; i <= 26; i++) { const u = i / 26; const x = (1 - u) ** 2 * -18 + 2 * (1 - u) * u * 90 + u * u * 26; const y = (1 - u) ** 2 * -604 + 2 * (1 - u) * u * -250 + u * u * -606; pts.push([x, y]); }
  return <g>{pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={7} fill={[C.vermilion, C.leaf, C.turmeric][i % 3]} stroke={C.black} strokeWidth={2} />)}</g>;
};

// ---------------------------------------------------------------- a whole figure (one drawing)
export interface Leg { knee: XY; ankle: XY; foot?: number }
export interface FigureSpec {
  kind: Kind;
  sit?: boolean;            // cross-legged / side-sitting: upper body lowered by 210
  dy?: number;              // body bob for walk/run drawings
  lean?: number;            // upper-body lean (degrees, about the waist), fixed per drawing
  head: { tilt?: number; eye?: Eye; mouth?: Mouth; tear?: boolean; dx?: number; dy?: number };
  armNear: Spine; armFar: Spine;
  handNear?: HandKind; handFar?: HandKind;
  legNear?: Leg; legFar?: Leg;
  behind?: React.ReactNode;    // drawn behind the far arm (e.g. potli hidden behind the back)
  holdFar?: React.ReactNode;   // drawn after the far arm, before the body
  holdNear?: React.ReactNode;  // drawn after the near arm
  extra?: React.ReactNode;     // drawn over everything
}

const angleOf = (sp: Spine) => { const a = sp[sp.length - 2], b = sp[sp.length - 1]; return Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI; };
const armTube = (sp: Spine) => tube(sp.map(([x, y], i) => [x, y, [26, 22, 17, 16][Math.min(i, 3)]]));

function lowerGarment(kind: Kind, n: Leg, f: Leg) {
  const [kn, kf] = [n.knee, f.knee];
  const front = kn[0] > kf[0] ? kn : kf, back = kn[0] > kf[0] ? kf : kn;
  if (kind === 'wife') return (
    <g>
      <Bharni d="M-50 -448 L42 -448 C58 -330 72 -150 84 -12 L-74 -12 C-66 -150 -62 -330 -50 -448 Z" fill={C.vermilion} pattern="dotsPaper" band={4} />
      <Bharni d="M-74 -12 L84 -12 L80 -56 L-70 -56 Z" fill={C.leaf} band={3} />
      {[-30, -8, 14].map(x => <path key={x} d={`M${x} -440 C${x + 4} -300 ${x + 10} -150 ${x + 16} -60`} fill="none" stroke={C.black} strokeWidth={2.5} />)}
    </g>
  );
  const d = `M-46 -452 L40 -452 C56 -390 ${front[0] + 44} ${front[1] - 110} ${front[0] + 32} ${front[1]} L${front[0] - 26} ${front[1] + 10} C${front[0] - 20} ${front[1] - 50} 8 -250 -4 -266 C-14 -250 ${back[0] + 22} ${back[1] - 50} ${back[0] + 26} ${back[1] + 10} L${back[0] - 34} ${back[1]} C${back[0] - 44} ${back[1] - 110} -60 -390 -46 -452 Z`;
  const k = kind === 'krishna';
  return (
    <g>
      <Bharni d={d} fill={k ? C.turmeric : C.ochre} pattern={k ? 'dotsBlack' : 'patches'} band={4.5} />
      <path d={`M${front[0] + 30} ${front[1] - 6} L${front[0] - 24} ${front[1] + 4} M${back[0] + 24} ${back[1] + 4} L${back[0] - 32} ${back[1] - 6}`} stroke={C.vermilion} strokeWidth={9} />
    </g>
  );
}

function lap(kind: Kind) {
  const saree = kind === 'wife';
  const d = saree
    ? 'M-52 -238 L42 -238 C84 -200 136 -120 136 -50 C136 -20 114 -6 84 -6 L-62 -6 C-82 -20 -82 -100 -72 -160 C-66 -200 -58 -220 -52 -238 Z'
    : 'M-46 -238 L40 -238 C72 -200 150 -126 172 -62 C178 -30 160 -8 130 -6 L-30 -6 C-62 -10 -72 -60 -66 -120 C-62 -170 -54 -210 -46 -238 Z';
  return (
    <g>
      <Bharni d={d} fill={saree ? C.vermilion : C.ochre} pattern={saree ? 'dotsPaper' : 'patches'} band={4.5} />
      {saree ? <Bharni d="M-62 -6 L84 -6 C104 -8 118 -14 124 -30 L-70 -40 Z" fill={C.leaf} band={3} />
        : <path d="M-28 -8 L128 -8" stroke={C.vermilion} strokeWidth={9} />}
    </g>
  );
}

function torso(kind: Kind) {
  const skin = SKIN[kind];
  const TORSO = 'M-42 -606 C-12 -616 18 -614 36 -602 C52 -584 54 -540 44 -500 C40 -470 38 -448 36 -432 L-38 -432 C-46 -470 -52 -540 -50 -576 C-49 -594 -47 -602 -42 -606 Z';
  if (kind === 'wife') return (
    <g>
      <Line d={TORSO} fill={skin} w={3.2} />
      <Bharni d="M-42 -606 C-12 -616 18 -614 36 -602 C52 -584 54 -548 46 -520 L-48 -520 C-50 -560 -50 -590 -42 -606 Z" fill={C.leaf} pattern="dotsBlack" band={3} />
      <Bharni d="M-50 -604 L-16 -614 L48 -470 L40 -440 L6 -440 Z" fill={C.vermilion} pattern="dotsPaper" band={3.5} />
    </g>
  );
  return (
    <g>
      <Line d={TORSO} fill={skin} w={3.2} />
      {kind === 'sudama' && [0, 1, 2].map(i => <path key={i} d={`M-6 ${-566 + i * 20} C8 ${-574 + i * 20} 24 ${-572 + i * 20} 34 ${-562 + i * 20}`} fill="none" stroke={C.black} strokeWidth={2.2} />)}
      {kind === 'sudama' && <Bharni d="M-48 -600 L-20 -612 L42 -472 L30 -446 Z" fill={C.paperShade} band={3} />}
      {kind === 'sudama' && <path d="M-40 -600 L34 -454" stroke={C.black} strokeWidth={1.6} strokeDasharray="4 4" />}
      {kind === 'krishna' && (
        <g>
          <path d="M-20 -606 C-6 -580 20 -580 32 -604" fill="none" stroke={C.turmeric} strokeWidth={7} />
          <path d="M-20 -606 C-6 -580 20 -580 32 -604" fill="none" stroke={C.black} strokeWidth={9} strokeDasharray="2 6" opacity={.6} />
          <Garland />
          <Bharni d="M-48 -472 L44 -470 L46 -440 L-50 -442 Z" fill={C.leaf} band={2.5} />
        </g>
      )}
    </g>
  );
}

export const Figure: React.FC<{ spec: FigureSpec }> = ({ spec: s }) => {
  const skin = SKIN[s.kind], k = s.kind;
  const up = s.sit ? 210 : 0;
  const legN = s.legNear || { knee: [12, -176], ankle: [14, -16] }, legF = s.legFar || { knee: [-14, -176], ankle: [-18, -16] };
  const leg = (l: Leg) => (
    <g>
      <Line d={tube([[l.knee[0], l.knee[1] - 20, 26], [(l.knee[0] + l.ankle[0]) / 2, (l.knee[1] + l.ankle[1]) / 2, 22], [l.ankle[0], l.ankle[1], 18]])} fill={skin} w={3.8} />
      <Foot x={l.ankle[0]} y={l.ankle[1]} a={l.foot || 0} skin={skin} anklet={k !== 'sudama'} />
    </g>
  );
  const handN = s.armNear[s.armNear.length - 1], handF = s.armFar[s.armFar.length - 1];
  const bangles = k !== 'sudama';
  return (
    <g transform={`translate(0 ${s.dy || 0})`}>
      <g transform={`translate(0 ${up}) rotate(${s.lean || 0} 0 -440)`}>
        {s.behind}
        <Line d={armTube(s.armFar)} fill={skin} w={3.8} />
        {k === 'krishna' && <ArmBand sp={s.armFar} />}
        <Hand x={handF[0]} y={handF[1]} a={angleOf(s.armFar)} kind={s.handFar} skin={skin} bangles={bangles} />
        {s.holdFar}
      </g>
      {s.sit ? lap(k) : (
        <g>
          {k !== 'wife' && leg(legF)}
          {k !== 'wife' && leg(legN)}
          {k === 'wife' && <Foot x={legN.ankle[0] + 20} y={-14} skin={skin} anklet />}
          {lowerGarment(k, legN, legF)}
        </g>
      )}
      <g transform={`translate(0 ${up}) rotate(${s.lean || 0} 0 -440)`}>
        {torso(k)}
        <Line d={tube([[8, -652, 30], [8, -604, 34]])} fill={skin} w={3} />
        <g transform={`translate(${20 + (s.head.dx || 0)} ${-706 + (s.head.dy || 0)}) rotate(${s.head.tilt || 0} 0 50) scale(1.3)`}>
          <Head kind={k} eye={s.head.eye} mouth={s.head.mouth} tear={s.head.tear} />
        </g>
        <Line d={armTube(s.armNear)} fill={skin} w={3.8} />
        {k === 'krishna' && <ArmBand sp={s.armNear} />}
        {s.holdNear}
        <Hand x={handN[0]} y={handN[1]} a={angleOf(s.armNear)} kind={s.handNear} skin={skin} bangles={bangles} />
        {s.extra}
      </g>
    </g>
  );
};

const ArmBand: React.FC<{ sp: Spine }> = ({ sp }) => {
  const [a, b] = [sp[0], sp[1]], x = a[0] + (b[0] - a[0]) * .45, y = a[1] + (b[1] - a[1]) * .45;
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
  return <g transform={`translate(${x} ${y}) rotate(${ang})`}><rect x={-6} y={-15} width={12} height={30} rx={3} fill={C.turmeric} stroke={C.black} strokeWidth={2.2} /></g>;
};
