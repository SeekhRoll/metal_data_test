import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { P } from '../styles/pahari/palette';
import { PahariDefs, RevealCtx } from '../styles/pahari/paint';
import { PahariBorder } from '../styles/pahari/Border';
import { DEVIS } from '../devi/pahari/devis';
import days from '../../data/navratri-days.json';
import { FONT } from '../style/fonts';

// all nine Pahari Devi portraits on one page, for the iconography review
export const DeviSheet: React.FC = () => {
  const t = useCurrentFrame() / 24, life = { t, blink: 0, breathe: 0, sway: 0, bloom: .3 };
  return (
    <AbsoluteFill style={{ background: P.border }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        <PahariDefs shimmer={.4} />
        <RevealCtx.Provider value={{ line: 1, fill: 1, shimmer: .4 }}>
          <rect x={66} y={66} width={948} height={1788} fill={P.paper} />
          {DEVIS.map((d, i) => {
            const cx = 230 + (i % 3) * 310, cy = 270 + Math.floor(i / 3) * 580, D = d.draw;
            return <g key={i}>
              <g transform={`translate(${cx - 20} ${cy}) scale(.42)`}><D hex={days[i].colour.hex} life={life} /></g>
              <text x={cx} y={cy + 300} textAnchor="middle" fontFamily={FONT.tiro} fontSize={28} fill={P.ink}>{days[i].dayNumHi} · {days[i].devi.nameHi}</text>
            </g>;
          })}
        </RevealCtx.Provider>
        <PahariBorder cartouche={false} win={{ x: 66, y: 66, w: 948, h: 1788 }} />
      </svg>
    </AbsoluteFill>
  );
};
