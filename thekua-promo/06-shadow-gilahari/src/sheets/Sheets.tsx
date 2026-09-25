import React from 'react';
import { AbsoluteFill } from 'remotion';
import { StageSvg, StageDefs, BaseText, lamp } from '../stage/Stage';
import { Puppet, Part, Pose } from '../stage/rig';
import { SCREEN, WOOD, GLOW } from '../stage/palette';
import { FONT } from '../stage/fonts';
import { RAM, LAKSHMAN, HANUMAN, VANAR, VANAR_LAUGH } from '../puppets/humanoid';
import { squirrel, rock, wave, placard, makerHand, sancha, thekuaPiece, thaali } from '../puppets/props';

const HAND_RODS = [{ part: 'frontHand', at: [8, 40] as [number, number] }, { part: 'backHand', at: [8, 40] as [number, number] }, { part: 'torso', at: [0, -200] as [number, number] }];
const REST: Pose = { frontArm: -8, frontFore: -6, backArm: 10, backFore: -24 };

// ---------------------------------------------------------------- the stage, with the depth system demonstrated
export const StageSheet: React.FC = () => (
  <AbsoluteFill>
    <StageSvg t={1.3}
      screen={<>
        <Puppet root={HANUMAN} pose={{ ...REST, frontArm: -30, frontFore: -40 }} x={760} y={900} s={.62} flip depth={.75} k="hn" rods={HAND_RODS} />
        <Puppet root={RAM} pose={REST} x={330} y={1020} s={.66} k="ram" rods={HAND_RODS} />
      </>}
      base={<BaseText lines={['मंच परीक्षण · छाया कथा', 'बायें: परदे से सटी कठपुतली · दायें: पीछे खींची हुई']} size={44} />} />
  </AbsoluteFill>
);

// ---------------------------------------------------------------- wide review sheets
export const SW = 2560, SH = 1440;
const Backlit: React.FC<{ title: string; items: { el: React.ReactNode; x: number; hi: string; en: string }[] }> = ({ title, items }) => {
  const l = lamp(1.3), strip = 250;
  return (
    <AbsoluteFill>
      <svg viewBox={`0 0 ${SW} ${SH}`} width={SW} height={SH}>
        <StageDefs />
        <defs>
          <radialGradient id="hotW" gradientUnits="userSpaceOnUse" cx={SW / 2} cy={SH * .62} r={1600}>
            <stop offset="0" stopColor={SCREEN.hot} /><stop offset=".3" stopColor={SCREEN.warm} /><stop offset=".62" stopColor={SCREEN.mid} /><stop offset="1" stopColor={SCREEN.edge} />
          </radialGradient>
        </defs>
        <rect width={SW} height={SH - strip} fill="url(#hotW)" />
        <rect width={SW} height={SH - strip} fill="url(#threads)" opacity={.35} style={{ mixBlendMode: 'multiply' }} />
        <rect width={SW} height={SH - strip} filter="url(#weave)" opacity={.22} />
        <rect width={SW} height={SH - strip} filter="url(#stains)" opacity={.2} />
        {items.map((it, i) => <g key={i}>{it.el}</g>)}
        <rect y={SH - strip} width={SW} height={strip} fill={WOOD.mid} />
        <rect y={SH - strip} width={SW} height={strip} filter="url(#woodGrain)" opacity={.7} />
        <rect y={SH - strip} width={SW} height={14} fill={WOOD.deep} />
        <text data-kind="text" x={SW / 2} y={SH - strip + 66} textAnchor="middle" fontFamily={FONT.yatra} fontSize={42} fill={WOOD.brassHi}>{title}</text>
        {items.map((it, i) => (
          <g key={'l' + i}>
            <text data-kind="text" x={it.x} y={SH - 86} textAnchor="middle" fontFamily={FONT.tiro} fontSize={36} fill="#F4E2BC">{it.hi}</text>
            <text data-kind="text" x={it.x} y={SH - 42} textAnchor="middle" fontFamily={FONT.tiro} fontSize={24} fill="#D8B888">{it.en}</text>
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};

const feetY = (s: number, ground = 1130, h = 402) => ground - h * s;

export const HeroesSheet: React.FC = () => (
  <Backlit title="छाया कथा · कठपुतलियाँ १" items={[
    { el: <Puppet root={RAM} pose={REST} x={560} y={feetY(.82)} s={.82} k="r" rods={HAND_RODS} />, x: 560, hi: 'श्रीराम', en: 'Ram: blue-green, crown, bow & quiver' },
    { el: <Puppet root={LAKSHMAN} pose={REST} x={1320} y={feetY(.8)} s={.8} k="l" rods={HAND_RODS} />, x: 1320, hi: 'लक्ष्मण', en: 'Lakshman: golden, crown, bow' },
    { el: <Puppet root={HANUMAN} pose={{ ...REST, frontArm: -40, frontFore: -60, tail: 6 }} x={2040} y={feetY(.8, 1130, 400)} s={.8} k="h" rods={HAND_RODS} />, x: 2040, hi: 'हनुमान', en: 'Hanuman: mace, curled tail, crown' },
  ]} />
);

export const VanarSheet: React.FC = () => (
  <Backlit title="छाया कथा · कठपुतलियाँ २" items={[
    { el: <Puppet root={VANAR} pose={REST} x={440} y={feetY(.72, 1130, 400)} s={.72} k="v" rods={HAND_RODS} />, x: 440, hi: 'वानर', en: 'generic monkey' },
    { el: <Puppet root={VANAR_LAUGH} pose={{ ...REST, head: -24, frontArm: -70, frontFore: -60, frontHand: -20 }} x={1100} y={feetY(.72, 1130, 400)} s={.72} k="vl" rods={HAND_RODS} />, x: 1100, hi: 'हँसता वानर', en: 'laughing monkey (head tips back)' },
    { el: <Puppet root={squirrel()} x={1740} y={900} s={2.1} k="sq" rods={[{ part: 'body', at: [0, 10] }]} rivetR={5} />, x: 1720, hi: 'गिलहरी', en: 'squirrel, no stripes' },
    { el: <Puppet root={squirrel([1, 1, 1])} x={2300} y={900} s={2.1} k="sq2" rods={[{ part: 'body', at: [0, 10] }]} rivetR={5} />, x: 2250, hi: 'धारियों वाली गिलहरी', en: 'squirrel with glowing stripes' },
  ]} />
);

export const PropsSheet: React.FC = () => (
  <Backlit title="छाया कथा · सामग्री" items={[
    { el: <Puppet root={placard('गिलहरी का योगदान', 'छाया कथा · भाग १')} x={230} y={560} s={.5} k="pc" rods={[{ part: 'placard', at: [0, 150] }]} />, x: 230, hi: 'शीर्षक पट', en: 'title placard' },
    { el: <><Puppet root={rock()} x={660} y={420} s={1.2} k="rk" /><Puppet root={rock(1)} x={660} y={760} s={.9} k="rk2" /></>, x: 660, hi: 'राम-शिला', en: 'rock carved with राम' },
    { el: <Puppet root={wave(390)} x={1080} y={760} s={1} k="wv" />, x: 1080, hi: 'समुद्र', en: 'wave with ripples' },
    { el: <Puppet root={sancha()} x={1500} y={760} s={.72} k="sc" />, x: 1500, hi: 'साँचा', en: 'wooden sancha' },
    { el: <><Puppet root={makerHand(false)} x={1830} y={420} s={.95} k="mh1" pose={{ fore: -16 }} rods={[{ part: 'fore', at: [0, 40] }]} /><Puppet root={makerHand(true)} x={2020} y={420} s={.95} flip k="mh2" pose={{ fore: -16 }} rods={[{ part: 'fore', at: [0, 40] }]} /></>, x: 1925, hi: 'बनाने वाले हाथ', en: 'hands: open / pinch' },
    { el: <><Puppet root={thaali()} x={2330} y={900} s={.82} k="th" />{[-120, -40, 40, 120].map((dx, i) => <Puppet key={i} root={thekuaPiece()} x={2330 + dx} y={856} s={.62} k={'tk' + i} />)}</>, x: 2330, hi: 'ठेकुआ, थाली', en: 'thekua on a thaali' },
  ]} />
);
