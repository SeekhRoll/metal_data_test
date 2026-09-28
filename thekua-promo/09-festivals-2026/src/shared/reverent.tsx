import React from 'react';

// Pitru Paksha treatment: palette muted ~15%, warmer and dimmer light, incense haze drifting upward.
export const REVERENT_FILTER = 'saturate(.85) brightness(.9) sepia(.1)';

export const IncenseHaze: React.FC<{ t: number; a?: number }> = ({ t, a = 1 }) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', mixBlendMode: 'screen' }}>
    <defs>
      <filter id="haze" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency=".004 .012" numOctaves="3" seed="12" result="n">
          <animate attributeName="seed" values="12" dur="1s" />
        </feTurbulence>
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 .95  0 0 0 0 .9  0 0 0 0 .82  0 0 0 -2.4 1.25" />
      </filter>
    </defs>
    <clipPath id="hazeWin"><rect x={66} y={66} width={948} height={1470} /></clipPath>
    <g clipPath="url(#hazeWin)"><g transform={`translate(0 ${-(t * 22) % 1920})`}>
      <rect x={0} y={0} width={1080} height={1920} filter="url(#haze)" opacity={.14 * a} />
      <rect x={0} y={1920} width={1080} height={1920} filter="url(#haze)" opacity={.14 * a} />
    </g></g>
  </svg>
);
