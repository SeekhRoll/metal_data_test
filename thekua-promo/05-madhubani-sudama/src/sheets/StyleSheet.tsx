import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, SWATCHES } from '../styles/palette';
import { Defs, Paper, PigmentVeil } from '../styles/filters';
import { Bharni, Line } from '../styles/paint';
import { MadhubaniBorder } from '../borders/MadhubaniBorder';
import { Fish, Lotus, LotusTop, Peacock, Sun, Vine, Wave, Bamboo } from '../motifs';
import { FONT } from '../styles/fonts';

const W = 1920, H = 1080;
const Label: React.FC<{ x: number; y: number; hi: string; en?: string; size?: number }> = ({ x, y, hi, en, size = 30 }) => (
  <g>
    <text x={x} y={y} textAnchor="middle" fontFamily={FONT.tiro} fontSize={size} fill={C.black}>{hi}</text>
    {en && <text x={x} y={y + size * .9} textAnchor="middle" fontFamily={FONT.tiro} fontSize={size * .62} fill={C.ochre}>{en}</text>}
  </g>
);

export const StyleSheet: React.FC = () => (
  <AbsoluteFill>
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
      <Defs />
      <Paper w={W} h={H} />
      <g filter="url(#boil)">
        <MadhubaniBorder w={W} h={H} />
        <text x={W / 2} y={150} textAnchor="middle" fontFamily={FONT.yatra} fontSize={58} fill={C.vermilion} stroke={C.black} strokeWidth={1.5}>सुदामा की पोटली · शैली पत्र</text>
        <text x={W / 2} y={190} textAnchor="middle" fontFamily={FONT.tiro} fontSize={24} fill={C.ochre}>Style sheet: palette, bharni fill, motif library, border</text>
        {/* palette */}
        {SWATCHES.map(([k, hi, en], i) => (
          <g key={k} transform={`translate(${190 + i * 118} 280)`}>
            <Bharni d="M-44 -40 H44 V40 H-44 Z" fill={C[k]} band={4} />
            <Label x={0} y={82} hi={hi} en={en} size={22} />
          </g>
        ))}
        {/* bharni demo */}
        <g transform="translate(1290 330)">
          <Bharni d="M-150 -60 C-90 -110 90 -110 150 -60 C170 0 120 60 0 70 C-120 60 -170 0 -150 -60 Z" fill={C.vermilion} pattern="dotsPaper" band={8} />
          <Label x={0} y={120} hi="भरनी: दोहरी रेखा + कचनी" en="bharni: double ink line with kachni hatching" size={24} />
        </g>
        <g transform="translate(1650 330)">
          <Line d="M-80 -50 C-40 -80 40 -80 80 -50 C90 0 50 50 0 56 C-50 50 -90 0 -80 -50 Z" fill={C.turmericLight} w={4} />
          <Label x={0} y={120} hi="एक रेखा" en="single line (skin, small parts)" size={24} />
        </g>
        {/* motifs */}
        <Fish x={260} y={560} s={1} />
        <Fish x={260} y={680} s={0.8} flip body={C.leaf} fin={C.turmeric} />
        <Label x={250} y={790} hi="मछली" en="fish" />
        <Lotus x={520} y={640} s={1} />
        <Label x={520} y={820} hi="कमल" en="lotus" />
        <LotusTop x={760} y={600} s={0.8} />
        <Label x={760} y={790} hi="कमल (ऊपर से)" en="lotus, top view (pattern blooms)" />
        <Peacock x={1130} y={630} s={0.9} />
        <Label x={1110} y={800} hi="मोर" en="peacock" />
        <Sun x={1390} y={610} s={0.85} />
        <Label x={1390} y={800} hi="सूर्य" en="sun" />
        <Bamboo x={1640} y={790} h={400} s={0.85} />
        <Label x={1690} y={850} hi="बाँस" en="bamboo" />
        <Vine x={180} y={900} len={700} />
        <Label x={880} y={960} hi="बेल" en="vine" />
        <g>
          <rect x={960} y={852} width={620} height={128} fill={C.indigoLight} opacity={0.35} />
          <Wave x={960} y={856} w={620} rows={3} />
          <Fish x={1270} y={920} s={0.45} body={C.vermilion} fin={C.turmeric} />
        </g>
        <Label x={1700} y={940} hi="लहरें" en="water" size={24} />
      </g>
      <PigmentVeil w={W} h={H} />
    </svg>
  </AbsoluteFill>
);
