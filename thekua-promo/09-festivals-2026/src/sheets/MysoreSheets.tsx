import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { MY, MyDefs, L, Ln, Gesso, MyFace, Arch, MyPaper, Bloom, circle } from '../styles/mysore/kit';
import { MyDevi, Nandi } from '../styles/mysore/figures';
import { TextZone, T as Tx } from '../shared/text';
import { FONT } from '../style/fonts';

export const MSUB = { x: 90, y: 1630, w: 900, h: 220 };
// a Mysore painting on its board: cream ground, fine red and gold borders, text panel at the foot
export const MysorePage: React.FC<{ children: React.ReactNode; overlay?: React.ReactNode }> = ({ children, overlay }) => (
  <AbsoluteFill style={{ background: MY.cream }}>
    <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
      <MyDefs />
      <rect width={1080} height={1920} fill={MY.cream} />
      <clipPath id="mywin"><rect x={60} y={60} width={960} height={1520} /></clipPath>
      <g clipPath="url(#mywin)"><rect x={60} y={60} width={960} height={1520} fill={MY.ground} />{children}</g>
      <rect x={60} y={60} width={960} height={1520} fill="none" stroke={MY.maroon} strokeWidth={10} />
      <g filter="url(#gesso)"><rect x={44} y={44} width={992} height={1552} fill="none" stroke={MY.gold} strokeWidth={10} /></g>
      <rect x={30} y={30} width={1020} height={1580} fill="none" stroke={MY.line} strokeWidth={2} />
      <rect x={70} y={1618} width={940} height={256} fill={MY.white} stroke={MY.gold} strokeWidth={4} />
      <MyPaper />
    </svg>
    {overlay}
  </AbsoluteFill>
);
export const ArchScene: React.FC<{ sky?: string; children?: React.ReactNode; front?: React.ReactNode }> = ({ sky = MY.blue, children, front }) => <>
  <rect x={60} y={60} width={960} height={1520} fill={sky} />
  <rect x={60} y={1330} width={960} height={250} fill={MY.stone} /><Ln d="M60 1330 H1020" w={2} />
  {Array.from({ length: 12 }, (_, i) => <Ln key={i} d={`M${60 + i * 90} 1580 L${300 + i * 45} 1330`} w={1.2} op={.4} />)}
  {children}
  <Arch x={60} y={60} w={960} h={1270} />
  {front}
</>;

export const MysoreStyle: React.FC = () => (
  <MysorePage overlay={<TextZone id="cap" z={MSUB}><Tx size={42} color={MY.maroon} font={FONT.rozha}>मैसूर चित्रकला · शैली पत्र</Tx><Tx size={26} color={MY.line}>muted luminous colour · fine lines · raised gold gesso · serene faces · temple arches</Tx></TextZone>}>
    {[MY.sage, MY.rose, MY.blue, MY.purple, MY.red, MY.cream, MY.stone, MY.gold].map((c, i) => <g key={i}>{i === 7 ? <Gesso d={`M${110 + (i % 4) * 220} ${110 + Math.floor(i / 4) * 110} h170 v76 h-170Z`} /> : <L d={`M${110 + (i % 4) * 220} ${110 + Math.floor(i / 4) * 110} h170 v76 h-170Z`} fill={c} />}</g>)}
    <g transform="translate(540 700) scale(2.1)"><MyFace /></g>
    <g transform="translate(300 1300) scale(.8)"><MyDevi /></g>
    <g transform="translate(780 1450) scale(.8)"><Nandi /></g>
  </MysorePage>
);

export const MysorePortrait: React.FC = () => {
  const t = useCurrentFrame() / 24;
  return (
    <MysorePage overlay={<TextZone id="cap" z={MSUB}><Tx size={52} color={MY.maroon} font={FONT.rozha}>भीतर का तेज़</Tx><Tx size={32} color={MY.line}>मैसूर चित्रकला शैली में · कर्नाटक</Tx><Tx size={26} color={MY.maroon} mt={6}>नवरात्रि · नौ देवियाँ, नौ कलाएँ · दिन ८</Tx></TextZone>}>
      <ArchScene sky={MY.purple} front={<g transform="translate(560 1500) scale(1.05)"><Nandi /></g>}>
        <Bloom x={540} y={820} r={480} a={.9} />
        <circle cx={540} cy={610} r={150} fill={MY.moon} opacity={.4} />
        <g transform="translate(540 1230)"><L d="M-240 0 C-240 -50 240 -50 240 0 L220 60 H-220Z" fill={MY.rose} /><Gesso d="M-240 0 C-240 -50 240 -50 240 0 C160 -26 -160 -26 -240 0Z" /></g>
        <g transform="translate(540 1212) scale(1.3)"><MyDevi t={t} /></g>
      </ArchScene>
    </MysorePage>
  );
};

export const MysoreTapas: React.FC = () => (
  <MysorePage overlay={<TextZone id="cap" z={MSUB}><Tx size={40} color={MY.line}>शिव को पाने के लिए, पार्वती ने वर्षों कठोर तप किया —</Tx><Tx size={40} color={MY.line}>धूप, वर्षा, आँधी… सब सहती रहीं।</Tx></TextZone>}>
    <ArchScene sky={MY.blueDeep}>
      {Array.from({ length: 60 }, (_, i) => { const x = 80 + (i * 97) % 920, y = 80 + (i * 211) % 1200; return <Ln key={i} d={`M${x} ${y} l-14 60`} w={2} c={MY.white} op={.45} />; })}
      <L d="M60 1100 C260 1020 420 1060 540 1010 C680 950 860 1030 1020 990 V1330 H60Z" fill={MY.sageDeep} />
      <g transform="translate(540 1280) scale(1.3)"><MyDevi tapas /></g>
    </ArchScene>
  </MysorePage>
);
