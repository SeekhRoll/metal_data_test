import React from 'react';
import { AbsoluteFill } from 'remotion';
import { P, PAGE } from './palette';
import { PahariDefs, PaperOverlay, RevealCtx, Reveal } from './paint';
import { PahariBorder } from './Border';
import { REVERENT_FILTER } from '../../shared/reverent';

// One Pahari album page: SVG painting clipped to the window, the border on top, then HTML text layers.
export const PahariPage: React.FC<{ painting?: React.ReactNode; overlay?: React.ReactNode; border?: string; reveal?: Reveal; shimmer?: number; reverent?: boolean; cartouche?: boolean; windowFill?: string; dim?: number; win?: { x: number; y: number; w: number; h: number } }> = ({ painting, overlay, border = P.border, reveal = { line: 1, fill: 1, shimmer: -1 }, shimmer = -1, reverent = false, cartouche = true, windowFill = P.paper, dim = 0, win = PAGE.win }) => {
  const w = win;
  return (
    <AbsoluteFill style={{ background: border }}>
      <AbsoluteFill style={{ filter: reverent ? REVERENT_FILTER : undefined }}>
        <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
          <PahariDefs shimmer={shimmer} />
          <RevealCtx.Provider value={reveal}>
            <clipPath id="win"><rect x={w.x} y={w.y} width={w.w} height={w.h} /></clipPath>
            <rect x={w.x} y={w.y} width={w.w} height={w.h} fill={windowFill} />
            <g clipPath="url(#win)">{painting}</g>
            {dim > 0 && <rect x={w.x} y={w.y} width={w.w} height={w.h} fill="#140C08" opacity={dim} />}
            <PaperOverlay x={0} y={0} w={1080} h={1920} />
            <PahariBorder color={border} cartouche={cartouche} win={win} />
          </RevealCtx.Provider>
        </svg>
      </AbsoluteFill>
      {overlay}
    </AbsoluteFill>
  );
};
