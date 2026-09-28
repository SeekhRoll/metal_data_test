import React from 'react';
import { T, TLINE } from '../../styles/patta/palette';
import { S, LineCtx } from '../../styles/pahari/paint';
import { MaleBody, Arm, Padmasana } from '../../styles/pahari/body';
import { PattaHead, Veena, Dots, circle } from '../../styles/patta/kit';

// Episode 2 · इंदिरा एकादशी (Pattachitra). All figures face right; mirror with scale(-1 1).
export const Patta: React.FC<{ children: React.ReactNode }> = ({ children }) => <LineCtx.Provider value={TLINE}>{children}</LineCtx.Provider>;

const jewels = <g>
  <Dots pts={[[-4, 92], [8, 112], [22, 120], [34, 116]]} step={5} r={1.8} c={T.yellow} />
  <Dots pts={[[-8, 96], [6, 130], [24, 142], [38, 132]]} step={6} r={1.8} c={T.white} />
</g>;

// King Indrasen on his throne (seated), or standing at the river (shradh / lamp)
export const Throne: React.FC = () => (
  <g>
    <S d="M-80 -60 C-80 -120 -40 -140 -10 -130 L-10 330 L-80 330Z" fill={T.yellow} sw={1.4} />
    <Dots pts={[[-74, -60], [-40, -126], [-14, -126]]} step={7} r={1.8} c={T.red} />
    <S d="M-90 320 H150 V360 H-90Z" fill={T.ochre} sw={1.4} />
    <S d="M-80 360 L-70 440 M140 360 L130 440" sw={6} />
    <Dots pts={[[-86, 340], [146, 340]]} step={8} r={2} c={T.white} />
    <S d="M-60 330 H140 V300 C80 290 -20 290 -60 300Z" fill={T.red} sw={1.2} />
  </g>
);
export const Indrasen: React.FC<{ pose?: 'throne' | 'namaskar' | 'offer' | 'down'; blink?: number }> = ({ pose = 'throne', blink = 0 }) => (
  <Patta>
    <g data-id="indrasen">
      {pose === 'throne' && <Throne />}
      <MaleBody arms={pose === 'throne' ? 'abhaya' : pose} legs={pose === 'throne' ? 'seated' : 'stand'}
        garb={{ dhoti: T.red, sash: T.yellow, uttariya: T.green, skin: T.skin, border: T.yellow, garland: true, dhotiLen: 620 }}
        head={<PattaHead crown="mukuta" blink={blink} />} nearProp={jewels} />
    </g>
  </Patta>
);

export const Queen: React.FC<{ blink?: number; arms?: 'namaskar' | 'offer' | 'down' }> = ({ blink = 0, arms = 'namaskar' }) => (
  <Patta>
    <g data-id="queen">
      <MaleBody arms={arms} legs="stand" garb={{ dhoti: T.blue, sash: T.pink, uttariya: T.pink, skin: T.skin, border: T.yellow, dhotiLen: 650, hair: null }}
        head={<PattaHead crown="queen" blink={blink} />} nearProp={<g><S d="M-40 110 C-20 90 30 96 50 130 C54 160 40 180 30 186 C0 190 -30 186 -44 176Z" fill={T.pink} sw={1.2} /><Dots pts={[[-40, 176], [30, 186]]} step={6} r={1.6} c={T.yellow} /></g>} />
    </g>
  </Patta>
);

// Narada: sage with the tuft of hair, veena over the shoulder, cymbals
export const Narada: React.FC<{ blink?: number; t?: number }> = ({ blink = 0, t = 0 }) => (
  <Patta>
    <g data-id="narada">
      <Veena x={-10} y={240} rot={-58} s={.95} />
      <MaleBody arms={{ near: { sh: [4, 108], el: [44, 160], wr: [62, 96], hand: 'open' }, far: { sh: [-10, 108], el: [-4, 190], wr: [30, 150], hand: 'fist' } }} legs="stand"
        garb={{ dhoti: T.ochre, sash: T.red, uttariya: T.white, skin: T.skin, border: T.red, dhotiLen: 560, hair: null }}
        head={<PattaHead crown="sage" beard={T.white} blink={blink} />} />
    </g>
  </Patta>
);

// the king's father in the dim realm: seated, calm, waiting (brief: no suffering, no punishment)
export const Father: React.FC<{ blink?: number; rise?: number }> = ({ blink = 0 }) => (
  <Patta>
    <g data-id="father">
      <Arm sh={[-10, 108]} el={[-6, 214]} wr={[40, 276]} skin={T.skin} bangles={false} armlet={false} />
      <S d="M-6 84 C-30 90 -50 100 -54 126 C-56 170 -40 220 -34 266 L34 266 C36 236 50 196 54 156 C56 126 42 100 22 86Z" fill={T.skin} sw={1.4} />
      <Padmasana cloth={T.white} skin={T.skin} />
      <S d="M-40 96 C-50 160 -60 230 -58 300 L-40 300 C-42 230 -30 160 -18 104Z" fill={T.ochre} sw={1.2} />
      <Arm sh={[4, 108]} el={[16, 214]} wr={[52, 276]} skin={T.skin} bangles={false} armlet={false} />
      <S d="M20 40 C22 58 24 72 26 90 L-6 90 C-4 70 -4 52 -4 34Z" fill={T.skin} stroke="none" />
      <PattaHead crown={null} beard={T.white} blink={blink} hair={T.white} />
    </g>
  </Patta>
);

// the celestial vimana: a small spired pavilion on a lotus, on clouds, with pennants and bells
export const Vimana: React.FC<{ t?: number }> = ({ t = 0 }) => (
  <Patta>
    <g data-id="vimana">
      {[-120, -60, 0, 60, 120].map((x, i) => <S key={i} d={circle(x, 90 + (i % 2) * 8, 40)} fill={T.white} sw={1.2} />)}
      <S d="M-110 60 C-60 90 60 90 110 60 L90 40 H-90Z" fill={T.pink} sw={1.2} />
      {Array.from({ length: 9 }, (_, i) => <S key={i} d={`M${-88 + i * 22} 44 Q${-77 + i * 22} 70 ${-66 + i * 22} 44`} fill={T.red} sw={.8} />)}
      <S d="M-80 40 V-80 H80 V40Z" fill={T.yellow} sw={1.4} />
      <S d="M-60 40 V-60 H60 V40Z" fill={T.redDeep} sw={1.2} />
      <S d="M-100 -80 H100 L60 -140 H-60Z" fill={T.ochre} sw={1.4} />
      <S d="M-50 -140 C-50 -190 -20 -220 0 -240 C20 -220 50 -190 50 -140Z" fill={T.yellow} sw={1.4} />
      <S d="M0 -240 V-270" sw={2} />
      <S d={`M0 -270 L${34 + 4 * Math.sin(t * 5)} -262 L0 -252Z`} fill={T.red} sw={1} />
      <Dots pts={[[-96, -82], [96, -82]]} step={8} r={2} c={T.white} />
      {[-80, 80].map((x) => <g key={x}><S d={`M${x} -80 V-40`} sw={1} /><S d={`M${x - 6} -40 a6 6 0 0 0 12 0Z`} fill={T.yellow} sw={1} /></g>)}
    </g>
  </Patta>
);

export const PattaDiya: React.FC<{ x: number; y: number; s?: number; flame?: number }> = ({ x, y, s = 1, flame = 0 }) => (
  <Patta>
    <g transform={`translate(${x} ${y}) scale(${s})`} data-id="patta-diya">
      <ellipse cx={60} cy={-60} rx={70} ry={80} fill="#FFD27A" opacity={.3} filter="url(#haloBloom)" />
      <S d="M-30 40 H30 L20 26 Q8 20 6 8 H-6 Q-8 20 -20 26Z" fill={T.yellow} sw={1.2} />
      <S d="M-58 -14 Q-54 10 0 12 Q54 10 60 -14 Q70 -20 78 -26 Q58 -28 46 -20 Q0 -10 -58 -14Z" fill={T.yellow} sw={1.4} />
      <Dots pts={[[-50, -4], [50, -6]]} step={8} r={2} c={T.red} />
      <g transform={`translate(66 -28) rotate(${2.5 * Math.sin(flame * 5.3)}) scale(1 ${1 + .06 * Math.sin(flame * 9)})`}>
        <path d="M0 0 C-12 -8 -8 -26 0 -46 C8 -26 12 -8 0 0Z" fill={T.ochre} stroke={T.black} strokeWidth={2} />
        <path d="M0 -4 C-6 -8 -4 -18 0 -30 C4 -18 6 -8 0 -4Z" fill={T.white} />
      </g>
    </g>
  </Patta>
);
