import React from 'react';
import { Composition } from 'remotion';
import { PigeonSheet, SW, SH } from './sheets/PigeonSheet';
import { CastSheet } from './sheets/CastSheet';
import { TreeSheet } from './sheets/TreeSheet';
import { StyleSheet } from './sheets/StyleSheet';
import { PatternTest } from './tests/PatternTest';
import { Film, FilmCheck } from './film/Film';

// Brief §3.4 steps 1-2: the style sheet and character sheets, rendered as stills for approval before any animation.
export const Root: React.FC = () => (
  <>
    <Composition id="StyleSheet" component={StyleSheet} width={SW} height={SH} fps={24} durationInFrames={1} />
    <Composition id="PigeonSheet" component={PigeonSheet} width={SW} height={SH} fps={24} durationInFrames={1} />
    <Composition id="CastSheet" component={CastSheet} width={SW} height={SH} fps={24} durationInFrames={1} />
    <Composition id="TreeSheet" component={TreeSheet} width={SW} height={SH} fps={24} durationInFrames={1} />
    <Composition id="PatternTest" component={PatternTest} width={1080} height={1920} fps={24} durationInFrames={24 * 8} />
    <Composition id="Film" component={Film} width={1080} height={1920} fps={24} durationInFrames={24 * 60} />
    <Composition id="FilmCheck" component={FilmCheck} width={1080} height={1920} fps={24} durationInFrames={24 * 60 / 6} />
  </>
);
