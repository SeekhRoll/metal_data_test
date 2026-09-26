import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C } from '../style/palette';
import { TextureDefs, Texture } from '../style/texture';
import { Banyan } from '../chars/tree';
import { SW, SH, Title, Label } from './PigeonSheet';

export const TreeSheet: React.FC = () => (
  <AbsoluteFill>
    <svg viewBox={`0 0 ${SW} ${SH}`} width={SW} height={SH}>
      <TextureDefs />
      <rect width={SW} height={SH} fill={C.paper} />
      <Title hi="गोंड कथा · बरगद" en="the banyan: growth stages (Scene 1) and the full tree" />
      {[.06, .4, .7].map((g, i) => <Banyan key={i} k={'g' + i} x={260 + i * 420} y={1180} s={.72} grow={g} life={{ t: i }} />)}
      {[.06, .4, .7].map((g, i) => <Label key={i} x={260 + i * 420} y={1290} hi={['अंकुर', 'शाखाएँ', 'पत्ते'][i]} en={['a seed sprouts', 'the trunk rises, branches unfurl', 'leaves pop open along the branches'][i]} />)}
      <Banyan k="full" x={1900} y={1180} s={.95} grow={1} life={{ t: 2 }} />
      <Label x={1900} y={1290} hi="बरगद" en="the full banyan, dashes flowing up the trunk" />
      <Texture w={SW} h={SH} />
    </svg>
  </AbsoluteFill>
);
