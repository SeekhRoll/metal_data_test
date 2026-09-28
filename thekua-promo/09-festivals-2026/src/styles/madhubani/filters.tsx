import React from 'react';
import { C } from './palette';

// SVG defs shared by every frame: paper grain, uneven pigment, line boil, fill patterns.
// `boilSeed` changes every 2 frames in motion (brief 3.1); stills pass a fixed seed.
export const Defs: React.FC<{ boilSeed?: number; boil?: number }> = ({ boilSeed = 1, boil = 2.4 }) => (
  <defs>
    <filter id="paperGrain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="7" result="n" />
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.42  0 0 0 0 0.33  0 0 0 0 0.2  0 0 0 -1.6 1.05" />
    </filter>
    <filter id="paperFibres" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.012 0.18" numOctaves="2" seed="11" result="n" />
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.4  0 0 0 0 0.25  0 0 0 -2.2 1.1" />
    </filter>
    {/* low-frequency mottling: pigment laid unevenly by hand */}
    <filter id="pigment" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="3" seed="5" result="n" />
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 0 0.12  0 0 0 -1.4 0.95" />
    </filter>
    {/* line boil: subtle, re-seeded every 2 frames */}
    <filter id="boil" x="-2%" y="-2%" width="104%" height="104%">
      <feTurbulence type="turbulence" baseFrequency="0.03" numOctaves="2" seed={boilSeed} result="t" />
      <feDisplacementMap in="SourceGraphic" in2="t" scale={boil} xChannelSelector="R" yChannelSelector="G" />
    </filter>
    {/* fill patterns painted inside garments */}
    <pattern id="dotsBlack" width="22" height="22" patternUnits="userSpaceOnUse">
      <circle cx="11" cy="11" r="2.6" fill={C.black} />
    </pattern>
    <pattern id="dotsPaper" width="24" height="24" patternUnits="userSpaceOnUse">
      <circle cx="6" cy="6" r="3.2" fill={C.paper} />
      <circle cx="18" cy="18" r="3.2" fill={C.paper} />
    </pattern>
    <pattern id="pleats" width="16" height="40" patternUnits="userSpaceOnUse">
      <line x1="8" y1="0" x2="8" y2="40" stroke={C.black} strokeWidth="2" />
    </pattern>
    <pattern id="scales" width="22" height="16" patternUnits="userSpaceOnUse">
      <path d="M0 16 Q11 0 22 16" fill="none" stroke={C.black} strokeWidth="2" />
    </pattern>
    <pattern id="crossHatch" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="12" stroke={C.black} strokeWidth="1.6" />
      <line x1="0" y1="0" x2="12" y2="0" stroke={C.black} strokeWidth="1.6" />
    </pattern>
    <pattern id="patches" width="60" height="70" patternUnits="userSpaceOnUse">
      <rect x="8" y="10" width="18" height="16" fill={C.paperShade} stroke={C.black} strokeWidth="1.8" strokeDasharray="3 3" />
      <rect x="36" y="44" width="16" height="14" fill={C.turmericLight} stroke={C.black} strokeWidth="1.8" strokeDasharray="3 3" />
    </pattern>
  </defs>
);

// the handmade paper everything is painted on, plus a pigment-unevenness layer laid over the paint
export const Paper: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <g>
    <rect width={w} height={h} fill={C.paper} />
    <rect width={w} height={h} filter="url(#paperFibres)" opacity={0.35} />
    <rect width={w} height={h} filter="url(#paperGrain)" opacity={0.45} />
  </g>
);
export const PigmentVeil: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <rect width={w} height={h} filter="url(#pigment)" opacity={0.22} style={{ mixBlendMode: 'multiply' }} />
);
