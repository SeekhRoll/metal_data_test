import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C } from '../style/palette';
import { FONT } from '../style/fonts';
import { Gond, PatternDef, PatternKind } from '../style/gond';
import { TextureDefs, Texture } from '../style/texture';
import { leafPath } from '../style/geom';
import { SW, SH, Title, Label } from './PigeonSheet';

const SWATCHES: [keyof typeof C, string][] = [['magenta', 'मजेंटा'], ['turquoise', 'फ़िरोज़ी'], ['marigold', 'गेंदा'], ['yellow', 'पीला'], ['leaf', 'हरा'], ['lime', 'धानी'], ['vermilion', 'सिंदूरी'], ['cobalt', 'नीला'], ['sky', 'आसमानी'], ['plum', 'जामुनी'], ['brown', 'कत्थई'], ['black', 'काला']];
const PATTERNS: [PatternKind, string, string][] = [['dots', 'बिंदी', 'dots (bindi)'], ['dashes', 'रेखाएँ', 'parallel dashes'], ['scales', 'मछली के शल्क', 'fish scales'], ['seeds', 'बीज', 'seeds / teardrops'], ['chevrons', 'शेवरॉन', 'chevrons'], ['arcs', 'चाप', 'concentric arcs']];
const BLOB = 'M-150 -60 C-140 -130 -40 -150 40 -140 C130 -130 170 -70 160 0 C150 80 60 120 -20 110 C-110 100 -160 40 -150 -60 Z';

export const StyleSheet: React.FC = () => (
  <AbsoluteFill>
    <svg viewBox={`0 0 ${SW} ${SH}`} width={SW} height={SH}>
      <TextureDefs />
      <defs>{PATTERNS.map(([k], i) => <PatternDef key={k} id={'sw-' + k} kind={k} fg={[C.magenta, C.cobalt, C.turquoise, C.vermilion, C.leaf, C.plum][i]} s={1.3} />)}</defs>
      <rect width={SW} height={SH} fill={C.paper} />
      <Title hi="गोंड कथा · शैली" en="palette, pattern library, outlines, contour bands, reveal, and the two backgrounds" />
      {/* palette */}
      {SWATCHES.map(([k, hi], i) => (
        <g key={k}>
          <rect x={120 + i * 190} y={210} width={150} height={110} rx={10} fill={C[k]} stroke={C.black} strokeWidth={5} />
          <text data-kind="text" x={195 + i * 190} y={360} textAnchor="middle" fontFamily={FONT.tiro} fontSize={28} fill={C.black}>{hi}</text>
        </g>
      ))}
      {/* the pattern library: six swatches, each a live <pattern> */}
      {PATTERNS.map(([k, hi, en], i) => (
        <g key={k}>
          <rect x={120 + i * 390} y={430} width={320} height={230} rx={14} fill={C.white} />
          <rect x={120 + i * 390} y={430} width={320} height={230} rx={14} fill={`url(#sw-${k})`} stroke={C.black} strokeWidth={6} />
          <Label x={280 + i * 390} y={710} hi={hi} en={en} />
        </g>
      ))}
      {/* outline style and contour bands */}
      <g transform="translate(330 1010)"><Gond k="ol" d={BLOB} fill={C.turquoise} outline={7} /></g>
      <Label x={330} y={1200} hi="काली बाहरी रेखा, सफ़ेद भीतरी रेखा" en="bold black outline, thin white inner line" />
      <g transform="translate(830 1010)"><Gond k="cb" d={BLOB} fill={C.magenta} pattern={{ kind: 'scales', fg: C.yellow, s: .9 }} bands={[{ w: 16, kind: 'solid', color: C.yellow }, { w: 14, kind: 'dash', color: C.black }, { w: 14, kind: 'dots', color: C.white }, { w: 14, kind: 'seed', color: C.turquoise }]} outline={7} /></g>
      <Label x={830} y={1200} hi="किनारे के साथ चलते पैटर्न" en="contour bands that follow the outline" />
      {/* reveal: outline first, then flat colour, then patterns grow in from the edges */}
      {[.6, 1.5, 2.45, 3].map((r, i) => (
        <g key={i} transform={`translate(${1260 + i * 250} 1010) scale(.62)`}>
          <Gond k={'rv' + i} d={BLOB} fill={C.marigold} pattern={{ kind: 'dots', fg: C.vermilion }} bands={[{ w: 16, kind: 'solid', color: C.cobalt }, { w: 14, kind: 'dash', color: C.white }, { w: 14, kind: 'dots', color: C.black }]} reveal={r} outline={9} />
        </g>
      ))}
      <Label x={1635} y={1200} hi="रेखा → रंग → पैटर्न" en="reveal: outline, then flat colour, then patterns grow inward" />
      {/* the two backgrounds */}
      <rect x={2250} y={880} width={200} height={130} rx={8} fill={C.paper} stroke={C.black} strokeWidth={5} />
      <rect x={2250} y={1030} width={200} height={130} rx={8} fill={C.night} stroke={C.black} strokeWidth={5} />
      {[0, 1, 2].map(i => <g key={i} transform={`translate(${2300 + i * 50} ${1095}) rotate(-60) scale(.5)`}><Gond k={'nl' + i} d={leafPath(80, 28)} fill={[C.yellow, C.magenta, C.turquoise][i]} outline={6} inner={C.white} /></g>)}
      <Label x={2350} y={1220} hi="खुली पृष्ठभूमि" en="open grounds: warm paper, deep night" />
      <Texture w={SW} h={SH} />
    </svg>
  </AbsoluteFill>
);
