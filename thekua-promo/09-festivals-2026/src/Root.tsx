import React from 'react';
import { Composition } from 'remotion';
import { DeviPortraitStill } from './sheets/DeviPortraitStill';
import { Ep1CastA, Ep1CastB } from './sheets/CastSheet';
import { Ep1, Ep1Check, EP1_FRAMES } from './episodes/pitru/Ep1_Bhagiratha';
import { Ep2, Ep2Check, EP2_FRAMES } from './episodes/pitru/Ep2_IndiraEkadashi';
import { PattaStyle, PattaCourt, PattaRealms } from './sheets/PattaSheets';
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
    {still('PattaStyle', PattaStyle)}
    {still('PattaCourt', PattaCourt)}
    {still('PattaRealms', PattaRealms)}
    <Composition id="PitruEp1" component={Ep1} durationInFrames={EP1_FRAMES} fps={24} width={1080} height={1920} />
    <Composition id="PitruEp2" component={Ep2} durationInFrames={EP2_FRAMES} fps={24} width={1080} height={1920} />
    <Composition id="PitruEp2Check" component={Ep2Check} durationInFrames={Math.ceil(EP2_FRAMES / 6)} fps={24} width={1080} height={1920} />
    <Composition id="PitruEp1Check" component={Ep1Check} durationInFrames={Math.ceil(EP1_FRAMES / 6)} fps={24} width={1080} height={1920} />
  </>
);
