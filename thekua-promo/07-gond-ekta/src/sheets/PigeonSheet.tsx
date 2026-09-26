import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C } from '../style/palette';
import { FONT } from '../style/fonts';
import { TextureDefs, Texture } from '../style/texture';
import { Pigeon, KING, FLOCK } from '../chars/pigeon';

export const SW = 2560, SH = 1440;
export const Title: React.FC<{ hi: string; en: string }> = ({ hi, en }) => (
  <>
    <text data-kind="text" x={SW / 2} y={96} textAnchor="middle" fontFamily={FONT.yatra} fontSize={64} fill={C.black}>{hi}</text>
    <text data-kind="text" x={SW / 2} y={146} textAnchor="middle" fontFamily={FONT.tiro} fontSize={30} fill={C.brown}>{en}</text>
  </>
);
export const Label: React.FC<{ x: number; y: number; hi: string; en: string }> = ({ x, y, hi, en }) => (
  <>
    <text data-kind="text" x={x} y={y} textAnchor="middle" fontFamily={FONT.tiro} fontSize={34} fill={C.black}>{hi}</text>
    <text data-kind="text" x={x} y={y + 38} textAnchor="middle" fontFamily={FONT.tiro} fontSize={24} fill={C.brown}>{en}</text>
  </>
);

export const PigeonSheet: React.FC = () => (
  <AbsoluteFill>
    <svg viewBox={`0 0 ${SW} ${SH}`} width={SW} height={SH}>
      <TextureDefs />
      <rect width={SW} height={SH} fill={C.paper} />
      <Title hi="गोंड कथा · पात्र १ · कबूतर" en="Chitragreeva, king of the pigeons, and his flock: six pattern variants" />
      <Pigeon look={KING} k="king" x={470} y={560} s={1.45} king wing={2} life={{ t: .6 }} />
      <Label x={430} y={790} hi="चित्रग्रीव" en="the king: larger, crest, patterned collar" />
      {[0, 1, 2, 3].map((w, i) => <Pigeon key={w} look={KING} k={'kw' + i} x={180 + (i % 2) * 380} y={1000 + Math.floor(i / 2) * 200} s={.58} king wing={w} life={{ t: 1 + i }} />)}
      <Label x={400} y={1360} hi="पंखों की चार ड्रॉइंग" en="wings: 4 replacement drawings, on twos" />
      {FLOCK.map((f, i) => {
        const cx = 1050 + (i % 3) * 520, cy = 470 + Math.floor(i / 3) * 560;
        return (
          <g key={f.name}>
            <Pigeon look={f.look} k={'p' + i} x={cx} y={cy} s={1} wing={i % 2 ? 'folded' : 1} perched={i % 2 === 1} life={{ t: i * .3 }} />
            <Label x={cx} y={cy + 190} hi={`कबूतर ${'१२३४५६'[i]}`} en={f.name} />
          </g>
        );
      })}
      <Texture w={SW} h={SH} />
    </svg>
  </AbsoluteFill>
);
