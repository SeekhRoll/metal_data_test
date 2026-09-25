import React from 'react';
import { L, GLOW } from '../stage/palette';
import { Leather, Dots, DotLine, Rosette, Slits, Slit, tube, arcPts, along, slitPath } from '../stage/leather';
import { Part } from '../stage/rig';
import { FONT } from '../stage/fonts';

// ---------------------------------------------------------------- the palm squirrel
// `stripes`: how far each of the three back stripes has been cut / lit (0..1), used for Ram's touch (brief §3.4)
const BACK: [number, number][] = [[70, -32], [40, -40], [8, -42], [-24, -38], [-56, -26]];
export function squirrel(stripes: [number, number, number] = [0, 0, 0]): Part {
  return {
    id: 'body', at: [0, 0],
    draw: (k) => (
      <g>
        <Leather id={k + '-b'} d="M-80 4 C-84 -18 -60 -34 -20 -38 C20 -42 56 -38 76 -28 C86 -40 104 -40 114 -30 C124 -22 128 -12 134 -6 C128 0 118 2 108 0 C100 10 84 14 70 12 C40 20 0 20 -30 18 C-56 18 -78 16 -80 4 Z"
          fill={L.squirrel}
          holes={<>
            <circle cx={106} cy={-22} r={5.5} />
            <Slits pts={along([[-50, 10], [60, 8]], 14)} len={7} ang={100} w={1.6} />
            {stripes.map((s, i) => {
              if (s <= 0) return null;
              const pts = along(BACK.map(([x, y]) => [x, y + 4 + i * 12] as [number, number]), 7);
              return <Dots key={i} pts={pts.slice(0, Math.max(1, Math.round(pts.length * s)))} r={2.3} />;
            })}
          </>} />
        <Leather id={k + '-e'} d="M92 -36 C88 -52 98 -58 104 -50 C106 -44 102 -38 96 -34 Z" fill={L.squirrel} />
        <circle cx={107} cy={-22} r={2.8} fill={L.black} />
        <path d="M132 -6 L150 -12 M132 -4 L150 -2" stroke={L.black} strokeWidth={1.2} opacity={.6} />
      </g>
    ),
    children: [
      { id: 'tail', at: [-76, -2], rivet: true, behind: true, draw: (k) => {
        const sp: [number, number, number][] = [[0, 0, 16], [-40, -20, 34], [-64, -64, 44], [-54, -116, 44], [-24, -148, 36], [12, -160, 24], [34, -150, 12]];
        return <Leather id={k} d={tube(sp)} fill={L.squirrel} holes={<Slits pts={along(sp.map(([x, y]) => [x, y] as [number, number]), 16).slice(1, -1)} len={16} ang={25} w={1.8} />} />;
      } },
      { id: 'hindLeg', at: [-50, 6], rivet: true, draw: (k) => <Leather id={k} d="M-20 -6 C-4 -14 12 -6 10 10 L6 28 L22 30 L22 36 L-2 36 L-4 18 C-14 16 -24 8 -20 -6 Z" fill={L.squirrel} /> },
      { id: 'foreLeg', at: [70, 8], rivet: true, draw: (k) => <Leather id={k} d="M-4 0 L6 0 L8 24 L18 28 L18 32 L-4 32 Z" fill={L.squirrel} /> },
    ],
  };
}

// ---------------------------------------------------------------- a floating rock carved with "राम"
export const rock = (seed = 0): Part => ({
  id: 'rock', at: [0, 0],
  draw: (k) => (
    <Leather id={k} d="M-130 20 C-150 -30 -110 -90 -40 -100 C20 -120 100 -96 130 -50 C150 -10 132 50 80 70 C20 92 -70 90 -110 60 C-126 48 -130 36 -130 20 Z"
      fill={L.stone} alpha={.86}
      holes={<>
        <text x={0} y={30} textAnchor="middle" fontFamily={FONT.yatra} fontSize={104}>राम</text>
        <DotLine pts={arcPts(0, -6, 118, 74, 0, Math.PI * 2, 40)} step={16} r={2.8} />
        <Slit a={[-110, -20 + seed * 4]} b={[-80, -50]} w={2} /><Slit a={[90, 40]} b={[118, 10]} w={2} />
      </>} />
  ),
});

// ---------------------------------------------------------------- the sea: a long perforated wave strip
export const wave = (w = 1300, phase = 0): Part => {
  const n = Math.round(w / 130);
  let d = `M${-w / 2} 200 L${-w / 2} 40`;
  const curls: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const x = -w / 2 + i * 130;
    d += ` C${x + 30} 40 ${x + 50} -30 ${x + 90} -20 C${x + 120} -12 ${x + 118} 20 ${x + 98} 22 C${x + 86} 22 ${x + 84} 8 ${x + 94} 6 C${x + 110} 30 ${x + 120} 40 ${x + 130} 40`;
    curls.push([x + 96, 8]);
  }
  d += ` L${w / 2} 200 Z`;
  return {
    id: 'wave', at: [0, 0],
    draw: (k) => (
      <Leather id={k} d={d} fill={L.indigo} alpha={.78}
        holes={<>
          {curls.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={4} />)}
          {[60, 100, 140].map((y, r) => Array.from({ length: n }, (_, i) => {
            const x = -w / 2 + i * 130 + ((r * 43 + phase * 30) % 130);
            return <path key={r + '-' + i} d={`M${x} ${y} Q${x + 30} ${y - 14} ${x + 60} ${y}`} fill="none" strokeWidth={4} />;
          }))}
        </>} />
    ),
  };
};

// ---------------------------------------------------------------- title placard (text is cut through, so it glows)
export const placard = (title: string, sub: string): Part => ({
  id: 'placard', at: [0, 0],
  draw: (k) => (
    <Leather id={k} d="M-380 -170 Q0 -230 380 -170 L380 150 Q0 200 -380 150 Z" fill={L.maroon} alpha={.9}
      holes={<>
        <DotLine pts={[[-350, -150], [0, -200], [350, -150]].flatMap((p, i, a) => i ? [p] : [p]) as [number, number][]} step={14} r={3} />
        <DotLine pts={[[-350, 130], [0, 172], [350, 130]]} step={14} r={3} />
        <Rosette x={-330} y={-10} r={20} /><Rosette x={330} y={-10} r={20} />
        <text x={0} y={-6} textAnchor="middle" fontFamily={FONT.yatra} fontSize={82}>{title}</text>
        <text x={0} y={88} textAnchor="middle" fontFamily={FONT.tiro} fontSize={44}>{sub}</text>
      </>} />
  ),
});

// ---------------------------------------------------------------- thekua making: puppet hands, the sancha, thekua, thaali
export const makerHand = (pinch = false): Part => ({
  id: 'fore', at: [0, 0], rivet: true,
  draw: (k) => <Leather id={k} d={tube([[0, 0, 60], [0, 110, 52], [0, 200, 44]])} fill={L.gold} holes={<><DotLine pts={[[-20, 170], [20, 170]]} step={8} r={3} /><DotLine pts={[[-20, 186], [20, 186]]} step={8} r={3} /><Rosette x={0} y={80} r={16} /></>} />,
  children: [{
    id: 'hand', at: [0, 200], rivet: true,
    draw: (k) => <Leather id={k} fill={L.gold}
      d={pinch
        ? 'M-24 0 C-32 24 -28 50 -12 64 L-4 96 C-2 104 10 104 10 96 L10 70 C20 70 30 60 32 44 L50 40 C58 38 58 28 50 26 L30 24 C32 12 28 4 22 0 Z'
        : 'M-24 0 C-32 26 -28 52 -14 70 L-12 118 C-12 126 0 126 0 118 L2 80 L8 124 C9 132 20 132 20 124 L16 80 L26 118 C28 126 38 124 36 116 L28 76 C40 66 44 36 26 0 Z'} />,
  }],
});
export const sancha = (): Part => ({
  id: 'sancha', at: [0, 0],
  draw: (k) => <Leather id={k} d="M-200 -60 L200 -60 C224 -60 236 -40 236 0 C236 40 224 60 200 60 L-200 60 C-224 60 -236 40 -236 0 C-236 -40 -224 -60 -200 -60 Z M236 -14 L300 -14 L300 14 L236 14 Z"
    fill={L.wood} holes={<>{Array.from({ length: 9 }, (_, i) => { const a = -1.1 + i * .275; return <Slit key={i} a={[0, 40]} b={[Math.sin(a) * 120, 40 - Math.cos(a) * 80]} w={3} />; })}<DotLine pts={arcPts(0, 0, 150, 48, 0, Math.PI * 2, 40)} step={14} r={3} /></>} />,
});
export const thekuaPiece = (): Part => ({
  id: 'thekua', at: [0, 0],
  draw: (k) => <Leather id={k} d="M-66 0 C-70 -36 -36 -56 0 -56 C36 -56 70 -36 66 0 C62 30 36 42 0 42 C-36 42 -62 30 -66 0 Z" fill={L.turmeric}
    holes={<>{Array.from({ length: 7 }, (_, i) => { const a = -1 + i / 3; return <Slit key={i} a={[0, 30]} b={[Math.sin(a) * 52, 30 - Math.cos(a) * 66]} w={2.2} />; })}<DotLine pts={arcPts(0, -6, 56, 38, 0, Math.PI * 2, 30)} step={10} r={2.2} /></>} />,
});
export const thaali = (): Part => ({
  id: 'thaali', at: [0, 0],
  draw: (k) => <Leather id={k} d="M-240 -10 L240 -10 C236 20 200 40 0 44 C-200 40 -236 20 -240 -10 Z" fill={L.turmeric}
    holes={<><DotLine pts={[[-220, 4], [220, 4]]} step={14} r={3} /><DotLine pts={[[-180, 24], [180, 24]]} step={18} r={2.4} /></>} />,
});
