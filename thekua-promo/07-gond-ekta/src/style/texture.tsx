import React from 'react';

// Canvas grain and slightly uneven paint density (brief §3.2), laid over the whole frame.
export const TextureDefs: React.FC = () => (
  <defs>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="n" />
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 .2  0 0 0 0 .15  0 0 0 0 .1  0 0 0 -1.4 .9" />
    </filter>
    <filter id="weave" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="3" seed="3" result="n" />
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 .5  0 0 0 0 .4  0 0 0 0 .3  0 0 0 -1.8 1.05" />
    </filter>
  </defs>
);
export const Texture: React.FC<{ w: number; h: number; dark?: boolean }> = ({ w, h, dark }) => (
  <g pointerEvents="none">
    <rect width={w} height={h} filter="url(#weave)" opacity={dark ? .12 : .18} style={{ mixBlendMode: 'multiply' }} />
    <rect width={w} height={h} filter="url(#grain)" opacity={dark ? .18 : .22} style={{ mixBlendMode: dark ? 'screen' : 'multiply' }} />
  </g>
);
