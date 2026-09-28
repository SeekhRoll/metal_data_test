import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { P, PAGE } from '../styles/pahari/palette';
import { PahariDefs, PaperOverlay, RevealCtx } from '../styles/pahari/paint';
import { PahariBorder } from '../styles/pahari/Border';
import { Landscape, Petals } from '../devi/pahari/PortraitScene';
import { Shailaputri } from '../devi/pahari/Shailaputri';

export const DeviPortraitStill: React.FC<{ accentHex?: string }> = ({ accentHex = '#E8731C' }) => {
  const f = useCurrentFrame(), t = f / 24;
  const w = PAGE.win;
  return (
    <AbsoluteFill style={{ background: P.border }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        <PahariDefs shimmer={-1} />
        <RevealCtx.Provider value={{ line: 1, fill: 1, shimmer: -1 }}>
          <clipPath id="win"><rect x={w.x} y={w.y} width={w.w} height={w.h} /></clipPath>
          <g clipPath="url(#win)">
            <Landscape t={t} />
            <g transform="translate(500 720) scale(1.28)"><Shailaputri garment={accentHex} life={{ t, blink: 0, breathe: 0, sway: 0, bloom: .4 }} /></g>
            <Petals t={t + 3} n={14} />
          </g>
          <PaperOverlay x={0} y={0} w={1080} h={1920} />
          <PahariBorder />
        </RevealCtx.Provider>
      </svg>
    </AbsoluteFill>
  );
};
