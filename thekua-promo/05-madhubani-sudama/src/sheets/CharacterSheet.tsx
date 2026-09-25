import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C } from '../styles/palette';
import { Defs, Paper, PigmentVeil } from '../styles/filters';
import { Bharni } from '../styles/paint';
import { MadhubaniBorder } from '../borders/MadhubaniBorder';
import { Figure, FigureSpec, Head, Kind, Eye, Mouth } from '../characters/parts';
import { FONT } from '../styles/fonts';
import { SUDAMA_POSES } from '../characters/Sudama/poses';
import { WIFE_POSES } from '../characters/Wife/poses';
import { KRISHNA_POSES } from '../characters/Krishna/poses';

export const SW = 2560, SH = 1900;
type Pose = { id: string; hi: string; en: string; spec: FigureSpec };

const Sheet: React.FC<{ kind: Kind; title: string; sub: string; poses: Pose[]; face: [Eye, Mouth][] }> = ({ kind, title, sub, poses, face }) => {
  const rows = poses.length > 4 ? 2 : 1, cols = Math.ceil(poses.length / rows);
  const ax = 760, aw = SW - ax - 130, ay = 250, ah = SH - ay - 120;
  const cw = aw / cols, rh = ah / rows, sc = Math.min(0.95, (rh - 110) / 1080, cw / 460);
  return (
    <AbsoluteFill>
      <svg viewBox={`0 0 ${SW} ${SH}`} width={SW} height={SH}>
        <Defs />
        <Paper w={SW} h={SH} />
        <g filter="url(#boil)">
          <MadhubaniBorder w={SW} h={SH} />
          <text x={SW / 2} y={170} textAnchor="middle" fontFamily={FONT.yatra} fontSize={70} fill={C.vermilion} stroke={C.black} strokeWidth={1.5}>{title}</text>
          <text x={SW / 2} y={218} textAnchor="middle" fontFamily={FONT.tiro} fontSize={28} fill={C.ochre}>{sub}</text>
          {/* face close-ups */}
          <Bharni d={`M140 250 H${ax - 60} V${SH - 140} H140 Z`} fill={C.paper} band={5} hatch={false} />
          <g transform={`translate(430 ${kind === 'krishna' ? 900 : 640}) scale(${kind === 'krishna' ? 1.9 : 2.3})`}>
            <Head kind={kind} eye={face[0][0]} mouth={face[0][1]} />
          </g>
          {face.slice(1).map(([eye, mouth], i) => (
            <g key={i}>
              <g transform={`translate(${300 + i * 280} ${SH - 430}) scale(1.35)`}><Head kind={kind} eye={eye} mouth={mouth} /></g>
              <text x={290 + i * 280} y={SH - 230} textAnchor="middle" fontFamily={FONT.tiro} fontSize={26} fill={C.ochre}>{eye} · {mouth}</text>
            </g>
          ))}
          {/* pose drawings */}
          {poses.map((p, i) => {
            const c = i % cols, r = Math.floor(i / cols), cx = ax + cw * (c + .5), base = ay + rh * (r + 1) - 70;
            return (
              <g key={p.id}>
                <g transform={`translate(${cx - 60 * sc} ${base}) scale(${sc})`}><Figure spec={p.spec} /></g>
                <text x={cx} y={base + 44} textAnchor="middle" fontFamily={FONT.tiro} fontSize={30} fill={C.black}>{p.hi}</text>
                <text x={cx} y={base + 72} textAnchor="middle" fontFamily={FONT.tiro} fontSize={20} fill={C.ochre}>{p.en}</text>
              </g>
            );
          })}
        </g>
        <PigmentVeil w={SW} h={SH} />
      </svg>
    </AbsoluteFill>
  );
};

export const SudamaSheet: React.FC = () => (
  <Sheet kind="sudama" title="सुदामा" sub="Sudama: character sheet (8 drawings incl. 4-drawing walk cycle)" poses={SUDAMA_POSES}
    face={[['open', 'neutral'], ['down', 'neutral'], ['closed', 'smile']]} />
);
export const WifeSheet: React.FC = () => (
  <Sheet kind="wife" title="सुदामा की पत्नी" sub="Sudama's wife: character sheet (4 drawings)" poses={WIFE_POSES}
    face={[['open', 'smile'], ['down', 'smile'], ['closed', 'smile']]} />
);
export const KrishnaSheet: React.FC = () => (
  <Sheet kind="krishna" title="श्रीकृष्ण" sub="Krishna: character sheet (6 drawings). Blue, peacock feather, flute, yellow pitambar" poses={KRISHNA_POSES}
    face={[['open', 'smile'], ['closed', 'open'], ['closed', 'neutral']]} />
);
