import React from 'react';
import { AbsoluteFill } from 'remotion';
import { P } from '../styles/pahari/palette';
import { PahariDefs, RevealCtx } from '../styles/pahari/paint';
import { PahariBorder } from '../styles/pahari/Border';
import { Sagar, Son, Anshuman, Dilip, Bhagiratha, IndraShadow, SacrificialHorse, Kapila, Brahma, Shiva, GangaOnMakara, BhagirathaChariot } from '../characters/ep1/cast';
import { FONT } from '../style/fonts';

const Label: React.FC<{ x: number; y: number; t: string }> = ({ x, y, t }) => <text x={x} y={y} textAnchor="middle" fontFamily={FONT.tiro} fontSize={30} fill={P.ink}>{t}</text>;
const Sheet: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <AbsoluteFill style={{ background: P.border }}>
    <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
      <PahariDefs shimmer={.4} />
      <RevealCtx.Provider value={{ line: 1, fill: 1, shimmer: .4 }}>
        <rect x={66} y={66} width={948} height={1788} fill={P.paper} />
        {children}
      </RevealCtx.Provider>
      <PahariBorder cartouche={false} win={{ x: 66, y: 66, w: 948, h: 1788 }} />
      <text x={540} y={134} textAnchor="middle" fontFamily={FONT.rozha} fontSize={46} fill={P.border}>{title}</text>
    </svg>
  </AbsoluteFill>
);

export const Ep1CastA: React.FC = () => (
  <Sheet title="भगीरथ प्रयास · पात्र (१)">
    <g transform="translate(200 310) scale(.52)"><Sagar /></g><Label x={210} y={690} t="राजा सगर" />
    <g transform="translate(470 290) scale(.62)"><Kapila open={0} /></g><Label x={500} y={540} t="महर्षि कपिल" />
    <g transform="translate(790 330) scale(.45)"><Son /></g>
    <g transform="translate(900 360) scale(.4)"><Son pose="point" turban="#D9707C" /></g><Label x={840} y={690} t="सगर-पुत्र (एक डिज़ाइन, भीड़)" />
    <g transform="translate(200 830) scale(.52)"><Anshuman /></g><Label x={210} y={1210} t="अंशुमान" />
    <g transform="translate(500 830) scale(.52)"><Dilip /></g><Label x={510} y={1210} t="दिलीप" />
    <g transform="translate(800 830) scale(.52)"><Bhagiratha /></g><Label x={810} y={1210} t="भगीरथ" />
    <g transform="translate(280 1400) scale(.55)"><IndraShadow /></g>
    <g transform="translate(640 1540) scale(.8)"><SacrificialHorse /></g><Label x={540} y={1800} t="यज्ञ का घोड़ा · इंद्र (केवल छाया)" />
  </Sheet>
);

export const Ep1CastB: React.FC = () => (
  <Sheet title="भगीरथ प्रयास · पात्र (२)">
    <g transform="translate(230 420) scale(.5)"><Bhagiratha pose="tapas" /></g><Label x={240} y={780} t="भगीरथ का तप" />
    <g transform="translate(720 360) scale(.5)"><Brahma /></g><Label x={730} y={780} t="ब्रह्मा" />
    <g transform="translate(270 1030) scale(.5)"><Shiva /></g><Label x={330} y={1390} t="शिव (जटाएँ फैलाए)" />
    <g transform="translate(760 1050) scale(.62)"><GangaOnMakara /></g><Label x={760} y={1370} t="मकर पर गंगा" />
    <g transform="translate(400 1660) scale(.52)"><BhagirathaChariot /></g><Label x={540} y={1810} t="भगीरथ का रथ" />
  </Sheet>
);
