import React from 'react';
import { Composition } from 'remotion';
import { DeviPortraitStill } from './sheets/DeviPortraitStill';
import { Ep1CastA, Ep1CastB } from './sheets/CastSheet';
import { StyleSheet, Day1C, Day1CBrand, Day1BTitle, Day1ATitle, PitruEp1Title, PitruClosing, EndCard } from './sheets/GateStills';

const still = (id: string, C: React.FC) => <Composition key={id} id={id} component={C} durationInFrames={48} fps={24} width={1080} height={1920} />;
export const Root: React.FC = () => (
  <>
    {still('DeviPortraitStill', DeviPortraitStill)}
    {still('StyleSheet', StyleSheet)}
    {still('Day1C', Day1C)}
    {still('Day1CBrand', Day1CBrand)}
    {still('Day1BTitle', Day1BTitle)}
    {still('Day1ATitle', Day1ATitle)}
    {still('PitruEp1Title', PitruEp1Title)}
    {still('PitruClosing', PitruClosing)}
    {still('EndCard', EndCard)}
    {still('Ep1CastA', Ep1CastA)}
    {still('Ep1CastB', Ep1CastB)}
  </>
);
