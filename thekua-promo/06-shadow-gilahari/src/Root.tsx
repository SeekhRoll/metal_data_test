import React from 'react';
import { Composition } from 'remotion';
import { RigTest } from './tests/RigTest';
import { Film, FilmCheck } from './film/Film';
import { StageSheet, HeroesSheet, VanarSheet, PropsSheet, SW, SH } from './sheets/Sheets';

// Brief §3.5 steps 1-2: the stage and the puppet sheets, rendered as stills for approval before any animation.
export const Root: React.FC = () => (
  <>
    <Composition id="StageSheet" component={StageSheet} width={1080} height={1920} fps={24} durationInFrames={1} />
    <Composition id="HeroesSheet" component={HeroesSheet} width={SW} height={SH} fps={24} durationInFrames={1} />
    <Composition id="VanarSheet" component={VanarSheet} width={SW} height={SH} fps={24} durationInFrames={1} />
    <Composition id="PropsSheet" component={PropsSheet} width={SW} height={SH} fps={24} durationInFrames={1} />
    <Composition id="Film" component={Film} width={1080} height={1920} fps={24} durationInFrames={24 * 60} />
    <Composition id="FilmCheck" component={FilmCheck} width={1080} height={1920} fps={24} durationInFrames={24 * 60 / 6} />
    <Composition id="RigTest" component={RigTest} width={1080} height={1920} fps={24} durationInFrames={24 * 9} />
  </>
);
