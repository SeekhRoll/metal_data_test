import React from 'react';
import { S, circle, LineCtx } from '../pahari/paint';
import { rng } from '../pahari/rand';
import { limb } from '../pahari/body';

// Manjusha (Bhagalpur): strictly three colours — pink, green, yellow — with bold black outlines on a light ground.
export const M = { pink: '#E4497E', green: '#2F9A4C', yellow: '#F2C230', black: '#141110', ground: '#FBF6EA' };
export const MLINE = { scale: 2, ink: M.black, skin: M.black, min: 2.2 };
export const Manj: React.FC<{ children: React.ReactNode }> = ({ children }) => <LineCtx.Provider value={MLINE}>{children}</LineCtx.Provider>;
const K = M.black;

// ---------------------------------------------------------------- borders
// lahariya (wave) band: a continuous sinuous line; `flow` slides it along forever
export const Lahariya: React.FC<{ x: number; y: number; w: number; h: number; flow?: number; fill?: string; wave?: string }> = ({ x, y, w, h, flow = 0, fill = M.yellow, wave = M.green }) => {
  const step = h * 1.6, off = -((flow * step) % step) - step;
  let d = `M${x + off} ${y + h / 2}`;
  for (let xx = x + off; xx < x + w + step; xx += step) d += ` q${step / 4} ${-h * .42} ${step / 2} 0 t${step / 2} 0`;
  const id = `lh${Math.round(x)}_${Math.round(y)}_${Math.round(w)}`;
  return (
    <g data-kind="graphic" data-id="lahariya">
      <clipPath id={id}><rect x={x} y={y} width={w} height={h} /></clipPath>
      <rect x={x} y={y} width={w} height={h} fill={fill} stroke={K} strokeWidth={3} />
      <g clipPath={`url(#${id})`}>
        <path d={d} stroke={wave} strokeWidth={h * .28} fill="none" strokeLinecap="round" />
        <path d={d} stroke={K} strokeWidth={2.4} fill="none" />
      </g>
    </g>
  );
};
// triangle (dantar) band and belpatra (leaf) band
export const Triangles: React.FC<{ x: number; y: number; w: number; h: number; a?: string; b?: string }> = ({ x, y, w, h, a = M.pink, b = M.yellow }) => {
  const n = Math.round(w / h), s = w / n;
  return <g data-kind="surface"><rect x={x} y={y} width={w} height={h} fill={b} stroke={K} strokeWidth={3} />{Array.from({ length: n }, (_, i) => <path key={i} d={`M${x + i * s} ${y + h} L${x + (i + .5) * s} ${y} L${x + (i + 1) * s} ${y + h}Z`} fill={a} stroke={K} strokeWidth={2} />)}</g>;
};
export const Belpatra: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => {
  const n = Math.round(w / (h * 1.3)), s = w / n;
  return <g data-kind="surface"><rect x={x} y={y} width={w} height={h} fill={M.ground} stroke={K} strokeWidth={3} />{Array.from({ length: n }, (_, i) => { const cx = x + (i + .5) * s, cy = y + h / 2; return <g key={i}>{[-1, 0, 1].map((k) => <ellipse key={k} cx={cx + k * h * .28} cy={cy + (k ? 2 : -3)} rx={h * .16} ry={h * .34} transform={`rotate(${k * 40} ${cx + k * h * .28} ${cy})`} fill={M.green} stroke={K} strokeWidth={1.6} />)}</g>; })}</g>;
};

// ---------------------------------------------------------------- a compartment: bordered box that opens like a lid/panels. `open` 0..1.
export const Compartment: React.FC<{ x: number; y: number; w: number; h: number; open?: number; flow?: number; children?: React.ReactNode; wave?: boolean; ground?: string; id?: string }> = ({ x, y, w, h, open = 1, flow = 0, children, wave = true, ground = M.ground, id = 'c' }) => {
  const b = 26, inner = { x: x + b * 2, y: y + b * 2, w: w - b * 4, h: h - b * 4 };
  const lid = 1 - open;
  return (
    <g>
      {wave ? <><Lahariya x={x} y={y} w={w} h={b} flow={flow} /><Lahariya x={x} y={y + h - b} w={w} h={b} flow={-flow} /><Triangles x={x} y={y + b} w={w} h={b} /><Triangles x={x} y={y + h - 2 * b} w={w} h={b} a={M.green} /></>
        : <><Triangles x={x} y={y} w={w} h={b} /><Belpatra x={x} y={y + b} w={w} h={b} /><Belpatra x={x} y={y + h - 2 * b} w={w} h={b} /><Triangles x={x} y={y + h - b} w={w} h={b} a={M.green} /></>}
      <rect x={x} y={y + 2 * b} width={2 * b} height={h - 4 * b} fill={M.pink} stroke={K} strokeWidth={3} />
      <rect x={x + w - 2 * b} y={y + 2 * b} width={2 * b} height={h - 4 * b} fill={M.pink} stroke={K} strokeWidth={3} />
      {Array.from({ length: Math.floor((h - 4 * b) / 40) }, (_, i) => <g key={i}><circle cx={x + b} cy={y + 2 * b + 20 + i * 40} r={9} fill={M.yellow} stroke={K} strokeWidth={2} /><circle cx={x + w - b} cy={y + 2 * b + 20 + i * 40} r={9} fill={M.yellow} stroke={K} strokeWidth={2} /></g>)}
      <clipPath id={'cmp' + id}><rect {...{ x: inner.x, y: inner.y, width: inner.w, height: inner.h }} /></clipPath>
      <rect x={inner.x} y={inner.y} width={inner.w} height={inner.h} fill={ground} stroke={K} strokeWidth={4} />
      <g clipPath={`url(#cmp${id})`}>{children}</g>
      {/* the two panels of the box swing open from the centre */}
      {lid > 0 && <g>
        <rect x={inner.x} y={inner.y} width={inner.w / 2 * lid} height={inner.h} fill={M.pink} stroke={K} strokeWidth={4} />
        <rect x={inner.x + inner.w - inner.w / 2 * lid} y={inner.y} width={inner.w / 2 * lid} height={inner.h} fill={M.pink} stroke={K} strokeWidth={4} />
        {lid > .15 && [0, 1].map((s) => <g key={s}>{Array.from({ length: 5 }, (_, i) => { const cx = s ? inner.x + inner.w - inner.w / 4 * lid : inner.x + inner.w / 4 * lid, cy = inner.y + inner.h * (i + .5) / 5; return <g key={i}><circle cx={cx} cy={cy} r={22 * lid} fill={M.yellow} stroke={K} strokeWidth={2.4} /><circle cx={cx} cy={cy} r={8 * lid} fill={M.green} stroke={K} strokeWidth={2} /></g>; })}</g>)}
      </g>}
    </g>
  );
};
export const inner = (x: number, y: number, w: number, h: number) => ({ x: x + 52, y: y + 52, w: w - 104, h: h - 104 });

// ---------------------------------------------------------------- the Phalgu: a lahariya river that can slide beneath a sand band
export const Phalgu: React.FC<{ x: number; y: number; w: number; h: number; flow: number; sand?: number }> = ({ x, y, w, h, flow, sand = 0 }) => {
  const r = rng(7);
  return (
    <g data-kind="graphic" data-id="phalgu">
      {[0, 1, 2].map((i) => <Lahariya key={i} x={x} y={y + i * h / 3} w={w} h={h / 3} flow={flow * (1 + i * .2)} fill={i % 2 ? M.green : M.yellow} wave={i % 2 ? M.yellow : M.green} />)}
      {sand > 0 && <g>
        <rect x={x} y={y} width={w} height={h * sand} fill={M.yellow} stroke={K} strokeWidth={3} />
        {Array.from({ length: Math.round(80 * sand) }, (_, i) => <circle key={i} cx={x + r() * w} cy={y + r() * h * sand} r={2 + r() * 2} fill={K} opacity={.7} />)}
        <path d={`M${x} ${y + h * sand} H${x + w}`} stroke={K} strokeWidth={4} />
      </g>}
    </g>
  );
};

// ---------------------------------------------------------------- the Akshayavat: large, symmetrical, bordered banyan; `glow` greens it
export const Akshayavat: React.FC<{ x: number; y: number; s?: number; shimmer?: number; glow?: number }> = ({ x, y, s = 1, shimmer = 0, glow = 0 }) => {
  const leaves: React.ReactNode[] = [];
  for (let ring = 0; ring < 4; ring++) {
    const n = 8 + ring * 6, R = 70 + ring * 62;
    for (let i = 0; i < n; i++) {
      const a = Math.PI + (i + .5) / n * Math.PI, lx = Math.cos(a) * R, ly = -300 + Math.sin(a) * R * .8, rot = a * 180 / Math.PI + 90 + Math.sin(shimmer * 6 + i + ring) * 6;
      leaves.push(<g key={ring + '_' + i} transform={`translate(${lx} ${ly}) rotate(${rot})`}>
        <path d="M0 -26 C16 -14 16 12 0 26 C-16 12 -16 -14 0 -26Z" fill={(i + ring) % 3 === 0 ? M.yellow : M.green} stroke={K} strokeWidth={2.4} />
        <path d="M0 -20 V20" stroke={K} strokeWidth={1.4} />
      </g>);
    }
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} data-kind="graphic" data-id="akshayavat">
      {glow > 0 && <ellipse cx={0} cy={-300} rx={330} ry={280} fill={M.green} opacity={.28 * glow} filter="url(#haloBloom)" />}
      {/* the trunk and hanging aerial roots, symmetrical */}
      <S d="M-44 0 C-40 -80 -30 -160 -22 -240 H22 C30 -160 40 -80 44 0Z" fill={M.pink} sw={1.6} />
      {[-1, 1].map((k) => [0, 1].map((j) => <S key={k + '_' + j} d={`M${k * (70 + j * 90)} -300 C${k * (72 + j * 90)} -200 ${k * (66 + j * 90)} -100 ${k * (70 + j * 90)} 0`} stroke={K} sw={2} />))}
      {[-1, 1].map((k) => <S key={k} d={`M${k * 16} -220 C${k * 60} -260 ${k * 120} -280 ${k * 200} -290`} stroke={K} sw={3} />)}
      {/* bordered canopy */}
      <S d="M-300 -300 A300 250 0 0 1 300 -300 Z" fill={M.ground} sw={1.6} />
      {leaves}
      <S d="M-300 -300 A300 250 0 0 1 300 -300" stroke={M.pink} sw={4} />
      <S d="M-320 -300 H320 V-280 H-320Z" fill={M.yellow} sw={1.4} />
      {Array.from({ length: 16 }, (_, i) => <path key={i} d={`M${-320 + i * 40} -280 L${-300 + i * 40} -300 L${-280 + i * 40} -280Z`} fill={M.pink} stroke={K} strokeWidth={1.6} />)}
      <S d="M-120 0 H120 V20 H-120Z" fill={M.green} sw={1.4} />
    </g>
  );
};

// ---------------------------------------------------------------- Manjusha figures: profile head with one large eye, flat patterned body
export const MHead: React.FC<{ skin: string; crown?: 'mukut' | 'sita' | null; blink?: number; hair?: string }> = ({ skin, crown = null, blink = 0, hair = K }) => (
  <g>
    <S d="M-34 -30 C-40 -60 -10 -76 14 -64 C26 -58 30 -46 28 -36 L-30 -8Z" fill={hair} sw={1} />
    {crown === 'sita' && <S d="M-40 -30 C-66 -34 -72 -6 -56 6 C-44 14 -32 6 -30 -6Z" fill={hair} sw={1} />}
    <S d="M-26 -40 C-6 -56 22 -52 30 -34 L38 -8 C40 -2 34 0 32 2 L34 12 C34 18 28 22 24 22 C22 34 12 42 -4 40 C-22 38 -30 22 -30 4 C-30 -14 -30 -28 -26 -40Z" fill={skin} sw={1.4} />
    {blink < .5 ? <g><ellipse cx={12} cy={-18} rx={11} ry={7} fill={M.ground} stroke={K} strokeWidth={2.4} /><circle cx={14} cy={-18} r={4.4} fill={K} /></g> : <path d="M1 -18 Q12 -12 23 -18" stroke={K} strokeWidth={2.4} fill="none" />}
    <S d="M0 -32 Q12 -38 24 -30" sw={1.2} />
    <S d="M22 14 L30 12" sw={1.2} />
    {crown === 'mukut' && <g><S d="M-30 -52 L-24 -84 L-12 -64 L0 -96 L12 -64 L24 -84 L28 -48 C8 -60 -14 -60 -30 -52Z" fill={M.yellow} sw={1.2} /><circle cx={0} cy={-70} r={5} fill={M.pink} stroke={K} strokeWidth={2} /></g>}
    {crown === 'sita' && <g><S d="M-26 -56 C-6 -66 16 -64 26 -52" stroke={M.yellow} sw={3} /><circle cx={30} cy={-40} r={3} fill={M.yellow} stroke={K} strokeWidth={1.4} /></g>}
    <circle cx={-18} cy={4} r={6} fill={M.yellow} stroke={K} strokeWidth={2} />
  </g>
);

type Pose = 'stand' | 'namaskar' | 'offer' | 'kneel' | 'point' | 'bow' | 'walk';
// standing/kneeling figure, facing right; `garb` = [upper, lower] from the three colours
export const MFigure: React.FC<{ skin: string; garb: [string, string]; pose?: Pose; crown?: 'mukut' | 'sita' | null; blink?: number; bow?: boolean; female?: boolean }> = ({ skin, garb, pose = 'stand', crown = null, blink = 0, bow = false, female = false }) => {
  const kneel = pose === 'kneel', tilt = pose === 'bow' ? 18 : 0;
  const arms: Record<Pose, [number, number][][]> = {
    stand: [[[-6, 70], [-4, 150], [4, 220]], [[10, 70], [20, 150], [30, 220]]],
    walk: [[[-6, 70], [-24, 140], [-30, 210]], [[10, 70], [34, 140], [44, 206]]],
    namaskar: [[[-6, 70], [20, 140], [48, 110]], [[10, 70], [26, 144], [50, 112]]],
    bow: [[[-6, 70], [20, 140], [48, 110]], [[10, 70], [26, 144], [50, 112]]],
    offer: [[[-6, 70], [24, 146], [70, 170]], [[10, 70], [34, 146], [80, 168]]],
    kneel: [[[-6, 70], [24, 146], [70, 190]], [[10, 70], [34, 146], [84, 186]]],
    point: [[[-6, 70], [-4, 150], [4, 220]], [[10, 70], [60, 100], [118, 96]]],
  };
  const [far, near] = arms[pose];
  return (
    <Manj>
      <g transform={`rotate(${tilt} 0 200)`}>
        <S d={limb(far, [24, 18, 14])} fill={skin} sw={1.2} />
        {/* torso */}
        <S d="M-26 50 C-40 60 -42 110 -34 180 L34 180 C40 120 40 70 24 50Z" fill={skin} sw={1.4} />
        <S d={female ? 'M-30 66 C-10 60 22 64 34 84 C36 110 30 130 26 140 C0 146 -26 144 -34 140Z' : 'M-34 150 H36 V180 H-34Z'} fill={garb[0]} sw={1.4} />
        {/* lower garment: long skirt / dhoti, flat with bold pattern */}
        {!kneel ? <g>
          <S d={female ? 'M-38 176 L36 176 C48 260 58 340 64 420 L-60 420 C-54 340 -46 260 -38 176Z' : 'M-36 176 L36 176 C44 240 48 300 50 350 L-46 350 C-44 300 -42 240 -36 176Z'} fill={garb[1]} sw={1.4} />
          {Array.from({ length: 4 }, (_, i) => <S key={i} d={`M${-40 + i * 4} ${220 + i * (female ? 50 : 34)} H${46 + i * 4}`} sw={1.2} />)}
          {(female ? [[-24, 420], [24, 420]] : [[-24, 350], [16, 350]]).map(([fx, fy], i) => <g key={i}><S d={`M${fx - 4} ${fy} V${fy + (female ? 12 : 60)}`} stroke={skin} sw={14} cap="butt" /><S d={`M${fx - 12} ${fy + (female ? 14 : 62)} H${fx + 22}`} sw={6} /></g>)}
        </g> : <g>
          <S d="M-36 176 L36 176 C80 190 110 220 112 250 L-40 250 C-50 220 -44 190 -36 176Z" fill={garb[1]} sw={1.4} />
          <S d="M-40 250 C-50 270 -20 284 30 282 L112 276" fill="none" sw={1.2} />
        </g>}
        <S d={limb(near, [26, 20, 15])} fill={skin} sw={1.2} />
        <S d={circle(near[2][0] + 4, near[2][1] + 2, 10)} fill={skin} sw={1.2} />
        <S d="M-10 30 L-8 52 H18 L16 30Z" fill={skin} stroke="none" />
        <g transform="translate(0 0)"><MHead skin={skin} crown={crown} blink={blink} /></g>
        {Array.from({ length: 7 }, (_, i) => <circle key={i} cx={-18 + i * 7} cy={60 + Math.sin(i / 6 * Math.PI) * 18} r={3.2} fill={M.yellow} stroke={K} strokeWidth={1.2} />)}
      </g>
    </Manj>
  );
};

// the cow (a witness), in profile: flat body with bold pattern
export const MCow: React.FC<{ turned?: number; blink?: number }> = ({ turned = 0, blink = 0 }) => (
  <Manj>
    <g transform={turned ? 'scale(-1 1)' : undefined} data-id="cow">
      {[[-110, 70], [-80, 70], [90, 70], [118, 70]].map(([x, y], i) => <S key={i} d={`M${x} ${y} V${y + 110} H${x + 18} V${y}Z`} fill={i % 2 ? M.yellow : M.ground} sw={1.2} />)}
      <S d="M-150 20 C-150 -20 -100 -30 0 -26 C80 -24 130 -30 150 -10 C170 30 160 80 140 90 C60 100 -80 100 -130 90 C-150 80 -154 50 -150 20Z" fill={M.ground} sw={1.4} />
      {[[-80, 20], [-20, 40], [50, 10], [100, 50]].map(([x, y], i) => <S key={i} d={circle(x, y, 18)} fill={i % 2 ? M.pink : M.green} sw={1.2} />)}
      <S d="M140 -10 C170 -40 210 -40 222 -10 C230 10 220 34 200 36 C180 38 160 24 150 10Z" fill={M.ground} sw={1.4} />
      <S d="M170 -34 C166 -60 176 -72 188 -72 M196 -36 C200 -60 214 -70 224 -66" sw={2} />
      {blink < .5 ? <g><ellipse cx={196} cy={-6} rx={8} ry={5} fill={M.ground} stroke={M.black} strokeWidth={2} /><circle cx={198} cy={-6} r={3} fill={M.black} /></g> : <path d="M188 -6 Q196 -2 204 -6" stroke={M.black} strokeWidth={2} fill="none" />}
      <S d="M-150 20 C-170 40 -176 80 -168 110" sw={3} />
    </g>
  </Manj>
);

// the glowing hands of Dasharatha: outline only, rising out of light
export const GlowHands: React.FC<{ a: number; reach?: number }> = ({ a, reach = 1 }) => a <= 0 ? null : (
  <g opacity={a} data-kind="graphic" data-id="glow-hands">
    <ellipse cx={0} cy={0} rx={200} ry={120} fill="#FFE39A" opacity={.55} filter="url(#haloBloom)" />
    {[-1, 1].map((k) => <g key={k} transform={`translate(${k * 44} ${-40 * reach}) scale(${k} 1)`}>
      <path d="M0 60 C-6 20 -8 -10 -4 -40 C-2 -54 8 -54 10 -40 L12 -14 L14 -54 C16 -66 26 -66 26 -54 L26 -12 L30 -46 C32 -58 42 -58 42 -46 L38 0 C46 -10 58 -8 56 4 C48 24 36 44 30 60Z" fill="none" stroke="#FFF4C8" strokeWidth={6} strokeLinejoin="round" />
      <path d="M0 60 C-6 20 -8 -10 -4 -40 C-2 -54 8 -54 10 -40 L12 -14 L14 -54 C16 -66 26 -66 26 -54 L26 -12 L30 -46 C32 -58 42 -58 42 -46 L38 0 C46 -10 58 -8 56 4 C48 24 36 44 30 60Z" fill="none" stroke={M.yellow} strokeWidth={2.4} strokeLinejoin="round" />
    </g>)}
  </g>
);

// small sand pindas
export const Pindas: React.FC<{ n: number; x: number; y: number }> = ({ n, x, y }) => (
  <g data-kind="graphic" data-id="pindas">{Array.from({ length: n }, (_, i) => <g key={i}><circle cx={x + i * 30} cy={y} r={12} fill={M.yellow} stroke={M.black} strokeWidth={2.4} />{[0, 1, 2].map((k) => <circle key={k} cx={x + i * 30 - 4 + k * 4} cy={y - 2 + (k % 2) * 4} r={1.4} fill={M.black} />)}</g>)}</g>
);

export const MDiya: React.FC<{ x: number; y: number; s?: number; flame?: number }> = ({ x, y, s = 1, flame = 0 }) => (
  <Manj>
    <g transform={`translate(${x} ${y}) scale(${s})`} data-id="manjusha-diya">
      <ellipse cx={60} cy={-60} rx={70} ry={80} fill="#FFD27A" opacity={.3} filter="url(#haloBloom)" />
      <S d="M-30 40 H30 L20 26 Q8 20 6 8 H-6 Q-8 20 -20 26Z" fill={M.yellow} sw={1.2} />
      <S d="M-58 -14 Q-54 10 0 12 Q54 10 60 -14 Q70 -20 78 -26 Q58 -28 46 -20 Q0 -10 -58 -14Z" fill={M.yellow} sw={1.4} />
      {[-36, -12, 12, 36].map((xx) => <S key={xx} d={`M${xx - 6} -2 L${xx} -10 L${xx + 6} -2Z`} fill={M.pink} sw={.8} />)}
      <g transform={`translate(66 -28) rotate(${2.5 * Math.sin(flame * 5.3)}) scale(1 ${1 + .06 * Math.sin(flame * 9)})`}>
        <path d="M0 0 C-12 -8 -8 -26 0 -46 C8 -26 12 -8 0 0Z" fill={M.pink} stroke={M.black} strokeWidth={3} />
        <path d="M0 -4 C-6 -8 -4 -18 0 -30 C4 -18 6 -8 0 -4Z" fill={M.yellow} />
      </g>
    </g>
  </Manj>
);

// Manjusha panels leave little empty ground: scattered four-petal flowers, dots, and a sun disc with rays
export const Fillers: React.FC<{ x: number; y: number; w: number; h: number; n?: number; seed?: number; avoid?: { x: number; y: number; w: number; h: number }[] }> = ({ x, y, w, h, n = 30, seed = 3, avoid = [] }) => {
  const r = rng(seed), out: React.ReactNode[] = [];
  for (let i = 0; i < n * 4 && out.length < n; i++) {
    const cx = x + r() * w, cy = y + r() * h, c = [M.pink, M.green, M.yellow][Math.floor(r() * 3)];
    if (avoid.some((a) => cx > a.x - 30 && cx < a.x + a.w + 30 && cy > a.y - 30 && cy < a.y + a.h + 30)) continue;
    out.push(<g key={i}>{[0, 1, 2, 3].map((k) => <ellipse key={k} cx={cx + [9, 0, -9, 0][k]} cy={cy + [0, 9, 0, -9][k]} rx={k % 2 ? 5 : 9} ry={k % 2 ? 9 : 5} fill={c} stroke={M.black} strokeWidth={1.6} />)}<circle cx={cx} cy={cy} r={3.4} fill={M.black} /></g>);
  }
  return <g data-kind="graphic" data-id="fillers">{out}</g>;
};
export const Sun: React.FC<{ x: number; y: number; r?: number; rot?: number }> = ({ x, y, r = 50, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`} data-kind="graphic" data-id="sun">
    {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${r * .9} -8 L${r * 1.45} 0 L${r * .9} 8Z`} transform={`rotate(${i * 30})`} fill={i % 2 ? M.pink : M.yellow} stroke={M.black} strokeWidth={2} />)}
    <circle r={r} fill={M.yellow} stroke={M.black} strokeWidth={3} /><circle r={r * .55} fill={M.pink} stroke={M.black} strokeWidth={2.4} />
  </g>
);
