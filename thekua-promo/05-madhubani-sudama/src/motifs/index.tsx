import React from 'react';
import { C } from '../styles/palette';
import { Bharni, Line, lens, circle, smooth, tube } from '../styles/paint';

type XY = { x?: number; y?: number; s?: number; r?: number; flip?: boolean };
const T: React.FC<XY & { children: React.ReactNode }> = ({ x = 0, y = 0, s = 1, r = 0, flip, children }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${flip ? -s : s} ${s})`}>{children}</g>
);

// ---------------------------------------------------------------- Fish (Madhubani matsya: fertility, good fortune)
export const Fish: React.FC<XY & { body?: string; fin?: string }> = ({ body = C.turmeric, fin = C.vermilion, ...p }) => (
  <T {...p}>
    <Bharni d="M-64 0 L-112 -36 C-100 -12 -100 12 -112 36 Z" fill={fin} band={3.5} />
    <Bharni d="M-8 -36 L10 -62 L28 -40 Z" fill={C.leaf} band={3} />
    <Bharni d="M-8 36 L10 60 L26 40 Z" fill={C.leaf} band={3} />
    <Bharni d="M92 0 C62 -46 -26 -50 -68 -8 L-68 8 C-26 50 62 46 92 0 Z" fill={body} pattern="scales" band={4.5} />
    <path d="M52 -31 C38 -10 38 10 52 31" fill="none" stroke={C.black} strokeWidth={4} />
    <path d="M58 -24 C47 -8 47 8 58 24" fill={C.vermilion} opacity={0.9} />
    <Line d={circle(68, -6, 10)} fill={C.paper} w={3} />
    <circle cx={70} cy={-6} r={4.6} fill={C.black} />
  </T>
);

// ---------------------------------------------------------------- Lotus, side view
export const Lotus: React.FC<XY & { petal?: string; inner?: string }> = ({ petal = C.vermilion, inner = C.turmeric, ...p }) => {
  const P = (a: number, len: number, w: number) => {
    const rad = (a - 90) * Math.PI / 180, x = Math.cos(rad) * len, y = Math.sin(rad) * len;
    return lens(0, 0, x, y, w);
  };
  return (
    <T {...p}>
      <Bharni d={tube([[0, 0, 12], [4, 60, 10], [0, 130, 9]])} fill={C.leaf} band={2.5} />
      <Bharni d="M0 4 C-50 0 -86 -14 -96 -30 C-60 -24 -30 -20 0 -14 C30 -20 60 -24 96 -30 C86 -14 50 0 0 4 Z" fill={C.leaf} band={3} />
      {[-64, 64].map(a => <Bharni key={a} d={P(a, 110, 20)} fill={petal} band={3.5} />)}
      {[-32, 32].map(a => <Bharni key={a} d={P(a, 128, 22)} fill={inner} band={3.5} />)}
      <Bharni d={P(0, 140, 24)} fill={petal} band={4} />
      {[-12, 0, 12].map(x => <circle key={x} cx={x} cy={-18} r={3.5} fill={C.black} />)}
    </T>
  );
};

// ---------------------------------------------------------------- Lotus, top view (for pattern blooms)
export const LotusTop: React.FC<XY & { n?: number; petal?: string; inner?: string; grow?: number }> = ({ n = 8, petal = C.vermilion, inner = C.turmeric, grow = 1, ...p }) => (
  <T {...p}>
    {Array.from({ length: n }, (_, i) => {
      const a = i / n * Math.PI * 2, k = Math.min(1, Math.max(0, grow * n - i * .6));
      return k > 0 && <Bharni key={'o' + i} d={lens(0, 0, Math.cos(a) * 110 * k, Math.sin(a) * 110 * k, 24 * k)} fill={petal} band={3.5} />;
    })}
    {Array.from({ length: n }, (_, i) => {
      const a = (i + .5) / n * Math.PI * 2, k = Math.min(1, Math.max(0, grow * n - i * .6 - 1));
      return k > 0 && <Bharni key={'i' + i} d={lens(0, 0, Math.cos(a) * 72 * k, Math.sin(a) * 72 * k, 16 * k)} fill={inner} band={3} />;
    })}
    {grow > .3 && <Bharni d={circle(0, 0, 26)} fill={C.leaf} band={3} pattern="dotsBlack" />}
  </T>
);

// ---------------------------------------------------------------- Peacock
export const Peacock: React.FC<XY> = (p) => (
  <T {...p}>
    {Array.from({ length: 7 }, (_, i) => {
      const a = (148 + i * 13) * Math.PI / 180, ex = Math.cos(a) * 230 - 30, ey = Math.sin(a) * 230 + 10;
      return (
        <g key={i}>
          <Bharni d={lens(-40, 10, ex, ey, 22)} fill={C.leaf} band={3} pattern="pleats" />
          <Line d={circle(ex * .88 - 4, ey * .88 + 1, 17)} fill={C.turmeric} w={3} />
          <Line d={circle(ex * .88 - 4, ey * .88 + 1, 10)} fill={C.indigoLight} w={2.5} />
          <circle cx={ex * .88 - 4} cy={ey * .88 + 1} r={4.5} fill={C.indigo} />
        </g>
      );
    })}
    <Line d="M20 56 L14 104 M14 104 L0 112 M14 104 L28 112 M44 52 L46 102 M46 102 L32 110 M46 102 L60 110" w={4} />
    <Bharni d="M44 -44 C96 -42 104 38 34 58 C-36 70 -86 42 -96 12 C-58 2 -18 -42 44 -44 Z" fill={C.indigo} pattern="dotsPaper" band={4.5} />
    <Bharni d={tube([[56, -34, 30], [70, -80, 22], [86, -126, 18]])} fill={C.indigo} band={3.5} />
    <Bharni d={circle(90, -138, 18)} fill={C.indigo} band={3} />
    <Line d="M104 -142 L128 -134 L104 -128 Z" fill={C.turmeric} w={2.5} />
    <circle cx={94} cy={-142} r={4} fill={C.paper} /><circle cx={95} cy={-142} r={2} fill={C.black} />
    {[-14, 0, 14].map((dx, i) => <g key={i}><line x1={88} y1={-154} x2={80 + dx} y2={-188} stroke={C.black} strokeWidth={2.5} /><circle cx={80 + dx} cy={-190} r={5} fill={C.vermilion} stroke={C.black} strokeWidth={2} /></g>)}
    <path d="M20 -20 C40 0 40 30 20 44" fill="none" stroke={C.turmeric} strokeWidth={6} />
  </T>
);

// ---------------------------------------------------------------- Sun with a face
export const Sun: React.FC<XY & { rays?: number; spin?: number }> = ({ rays = 16, spin = 0, ...p }) => (
  <T {...p}>
    <g transform={`rotate(${spin})`}>
      {Array.from({ length: rays }, (_, i) => {
        const a = i / rays * Math.PI * 2, a1 = a - Math.PI / rays * .75, a2 = a + Math.PI / rays * .75, R = i % 2 ? 150 : 172;
        const d = `M${Math.cos(a1) * 96} ${Math.sin(a1) * 96} L${Math.cos(a) * R} ${Math.sin(a) * R} L${Math.cos(a2) * 96} ${Math.sin(a2) * 96} Z`;
        return <Bharni key={i} d={d} fill={i % 2 ? C.turmeric : C.vermilion} band={3} />;
      })}
    </g>
    <Bharni d={circle(0, 0, 100)} fill={C.turmeric} band={5} />
    {[-1, 1].map(sd => (
      <g key={sd}>
        <Line d={`M${sd * 12} -22 C${sd * 22} -40 ${sd * 52} -40 ${sd * 62} -24 C${sd * 50} -10 ${sd * 22} -10 ${sd * 12} -22 Z`} fill={C.paper} w={3} />
        <circle cx={sd * 37} cy={-24} r={8} fill={C.black} />
        <path d={`M${sd * 10} -48 C${sd * 24} -60 ${sd * 50} -60 ${sd * 66} -46`} fill="none" stroke={C.black} strokeWidth={4} />
      </g>
    ))}
    <path d="M0 -22 L-6 18 L6 20" fill="none" stroke={C.black} strokeWidth={3.5} strokeLinejoin="round" />
    <Line d="M-26 42 C-10 34 10 34 26 42 C10 56 -10 56 -26 42 Z" fill={C.vermilion} w={3} />
    <circle cx={0} cy={-64} r={7} fill={C.vermilion} stroke={C.black} strokeWidth={2.5} />
  </T>
);

// ---------------------------------------------------------------- Vine with leaves and tendrils
export const Vine: React.FC<XY & { len?: number; sway?: number; leaf?: string }> = ({ len = 420, sway = 0, leaf = C.leaf, ...p }) => {
  const pts: [number, number][] = [];
  for (let i = 0; i <= 14; i++) { const u = i / 14; pts.push([u * len, Math.sin(u * Math.PI * 2.2 + sway) * 26]); }
  return (
    <T {...p}>
      <path d={smooth(pts)} fill="none" stroke={C.black} strokeWidth={9} strokeLinecap="round" />
      <path d={smooth(pts)} fill="none" stroke={C.leaf} strokeWidth={4} strokeLinecap="round" />
      {pts.slice(1, -1).map(([x, y], i) => {
        const up = i % 2 ? -1 : 1, lx = x + 34, ly = y + up * 46;
        return (
          <g key={i}>
            <Bharni d={lens(x, y, lx, ly, 13)} fill={i % 3 === 0 ? C.turmeric : leaf} band={2.5} hatch={false} />
            <path d={`M${x} ${y} L${(x + lx) / 2 + 2} ${(y + ly) / 2}`} stroke={C.black} strokeWidth={2} />
            {i % 3 === 1 && <path d={`M${x} ${y} c-10 ${-up * 22} 12 ${-up * 30} 10 ${-up * 12}`} fill="none" stroke={C.black} strokeWidth={2.5} />}
          </g>
        );
      })}
    </T>
  );
};

// ---------------------------------------------------------------- Water: rows of curls
let WAVE_ID = 0;
export const Wave: React.FC<XY & { w?: number; rows?: number; phase?: number }> = ({ w = 600, rows = 3, phase = 0, ...p }) => {
  const id = React.useMemo(() => 'wclip' + (WAVE_ID++), []);
  return (
  <T {...p}>
    <clipPath id={id}><rect x={0} y={-4} width={w} height={rows * 44 + 8} /></clipPath>
    <g clipPath={`url(#${id})`}>
    {Array.from({ length: rows }, (_, r) => (
      <g key={r} transform={`translate(${((phase * 40 + r * 23) % 60) - 60} ${r * 44})`}>
        {Array.from({ length: Math.ceil(w / 60) + 2 }, (_, i) => (
          <g key={i}>
            <path d={`M${i * 60} 30 C${i * 60} 0 ${i * 60 + 44} 0 ${i * 60 + 44} 22 C${i * 60 + 44} 34 ${i * 60 + 26} 34 ${i * 60 + 26} 22`} fill="none" stroke={C.indigo} strokeWidth={5} strokeLinecap="round" />
            <path d={`M${i * 60} 30 C${i * 60} 0 ${i * 60 + 44} 0 ${i * 60 + 44} 22`} fill="none" stroke={C.black} strokeWidth={1.6} />
          </g>
        ))}
      </g>
    ))}
    </g>
  </T>
  );
};

// ---------------------------------------------------------------- Bamboo
export const Bamboo: React.FC<XY & { h?: number }> = ({ h = 500, ...p }) => (
  <T {...p}>
    {Array.from({ length: Math.floor(h / 90) }, (_, i) => <Bharni key={i} d={`M-14 ${-i * 90} L14 ${-i * 90} L12 ${-i * 90 - 84} L-12 ${-i * 90 - 84} Z`} fill={C.leaf} band={2.5} />)}
    {Array.from({ length: Math.floor(h / 90) - 1 }, (_, i) => <Bharni key={'l' + i} d={lens(0, -i * 90 - 88, (i % 2 ? 1 : -1) * 90, -i * 90 - 120, 12)} fill={C.leaf} band={2.5} hatch={false} />)}
  </T>
);
