import React from 'react';
import { Composition } from 'remotion';
import { PigeonSheet, SW, SH } from './sheets/PigeonSheet';
import { CastSheet } from './sheets/CastSheet';
import { TreeSheet } from './sheets/TreeSheet';
import { StyleSheet } from './sheets/StyleSheet';

// Brief §3.4 steps 1-2: the style sheet and character sheets, rendered as stills for approval before any animation.
export const Root: React.FC = () => (
  <>
    <Composition id="StyleSheet" component={StyleSheet} width={SW} height={SH} fps={24} durationInFrames={1} />
    <Composition id="PigeonSheet" component={PigeonSheet} width={SW} height={SH} fps={24} durationInFrames={1} />
    <Composition id="CastSheet" component={CastSheet} width={SW} height={SH} fps={24} durationInFrames={1} />
    <Composition id="TreeSheet" component={TreeSheet} width={SW} height={SH} fps={24} durationInFrames={1} />
  </>
);
