import React from 'react';
import { Composition } from 'remotion';
import { Film } from './film/Film';

export const Root: React.FC = () => (
  <>
    <Composition id="Film" component={Film} width={1080} height={1920} fps={24} durationInFrames={Math.round(24 * 91.5)} />
  </>
);
