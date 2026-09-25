import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { FPS, SCENES } from './timeline';
import { onTwos, seg } from './anim';
import { S1_Title, S2_Hut, S3_Journey, S4_Embrace } from './scenes/S1_S4';
import { S5_Potli, S6_Return, S7_Moral, S8_EndCard } from './scenes/S5_S8';

// The whole film. All motion is sampled on twos. Scenes overlap by 0.5 s and dissolve (also on twos).
const ORDER: [keyof typeof SCENES, React.FC<{ frame: number; t: number }>][] = [
  ['title', S1_Title], ['hut', S2_Hut], ['journey', S3_Journey], ['embrace', S4_Embrace],
  ['potli', S5_Potli], ['ret', S6_Return], ['moral', S7_Moral], ['endcard', S8_EndCard],
];
const X = 0.5;

export const Film: React.FC = () => {
  const frame = onTwos(useCurrentFrame()), t = frame / FPS;
  return (
    <AbsoluteFill style={{ background: '#F1E2C0' }}>
      {ORDER.map(([k, Scene], i) => {
        const { from, to } = SCENES[k];
        const first = i === 0, last = i === ORDER.length - 1;
        if (t < from - (first ? 0 : X) || t > to + (last ? 1 : 0)) return null;
        const fadeIn = first ? 1 : seg(t, from - X, from);
        return <AbsoluteFill key={k} style={{ opacity: fadeIn }}><Scene frame={frame} t={t} /></AbsoluteFill>;
      })}
    </AbsoluteFill>
  );
};
