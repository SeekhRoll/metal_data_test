import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C } from '../style/palette';
import { TextureDefs, Texture } from '../style/texture';
import { Person, HUNTER, FAMILY, Stick, Cup } from '../chars/people';
import { Mouse } from '../chars/mouse';
import { Thaali } from '../chars/props';
import { SW, SH, Title, Label } from './PigeonSheet';

export const CastSheet: React.FC = () => (
  <AbsoluteFill>
    <svg viewBox={`0 0 ${SW} ${SH}`} width={SW} height={SH}>
      <TextureDefs />
      <rect width={SW} height={SH} fill={C.paper} />
      <Title hi="गोंड कथा · पात्र २" en="the hunter, Hiranyaka the mouse, and the family" />
      {/* hunter: standing with stick, scattering grain, crouching behind a bush */}
      <Person o={HUNTER} k="h1" x={200} y={760} s={.95} arm={-10} hold={<Stick len={380} ang={-80} />} />
      <Person o={HUNTER} k="h2" x={470} y={760} s={.95} pose="scatter" arm={70} hold={<>{[0, 1, 2, 3, 4].map(i => <circle key={i} cx={30 + i * 16} cy={20 + (i % 2) * 18} r={6} fill={C.yellow} stroke={C.black} strokeWidth={2} />)}</>} />
      <Person o={HUNTER} k="h3" x={740} y={760} s={.95} pose="crouch" arm={40} />
      <Label x={470} y={840} hi="बहेलिया" en="the hunter: standing · scattering grain · crouching" />
      {/* Hiranyaka */}
      <Mouse k="m" x={1250} y={680} s={1.4} />
      <Label x={1250} y={840} hi="हिरण्यक" en="the mouse: a pattern of tiny dashes" />
      {/* the family, seated around the thaali */}
      <g>
        <Person o={FAMILY[0].o} k="f0" x={330} y={1250} s={FAMILY[0].s} pose="sit" arm={60} hold={<Cup k="c0" />} />
        <Person o={FAMILY[1].o} k="f1" x={600} y={1250} s={FAMILY[1].s} pose="sit" arm={50} />
        <Person o={FAMILY[4].o} k="f4" x={830} y={1250} s={FAMILY[4].s} pose="sit" arm={70} />
        <Thaali k="th" x={1180} y={1270} s={1.1} />
        <Person o={FAMILY[5].o} k="f5" x={1540} y={1250} s={FAMILY[5].s} pose="sit" flip arm={75} />
        <Person o={FAMILY[2].o} k="f2" x={1790} y={1250} s={FAMILY[2].s} pose="sit" flip arm={60} hold={<Cup k="c2" />} />
        <Person o={FAMILY[3].o} k="f3" x={2080} y={1250} s={FAMILY[3].s} pose="sit" flip arm={45} />
      </g>
      <Label x={1200} y={1370} hi="परिवार: दादाजी, दादीजी, बच्चे, माँ, पिता" en="the family around a thaali of thekua and cups of chai" />
      <Texture w={SW} h={SH} />
    </svg>
  </AbsoluteFill>
);
