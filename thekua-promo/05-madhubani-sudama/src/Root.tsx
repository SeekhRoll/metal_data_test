import React from 'react';
import { Composition } from 'remotion';
import { StyleSheet } from './sheets/StyleSheet';
import { SudamaSheet, WifeSheet, KrishnaSheet, SW, SH } from './sheets/CharacterSheet';

// Brief 3.4 steps 1-2: style sheet + character sheets, rendered as stills for approval before any animation.
export const Root: React.FC = () => (
  <>
    <Composition id="StyleSheet" component={StyleSheet} width={1920} height={1080} fps={24} durationInFrames={1} />
    <Composition id="SudamaSheet" component={SudamaSheet} width={SW} height={SH} fps={24} durationInFrames={1} />
    <Composition id="WifeSheet" component={WifeSheet} width={SW} height={SH} fps={24} durationInFrames={1} />
    <Composition id="KrishnaSheet" component={KrishnaSheet} width={SW} height={SH} fps={24} durationInFrames={1} />
  </>
);
