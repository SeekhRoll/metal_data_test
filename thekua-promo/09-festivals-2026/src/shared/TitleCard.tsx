import React from 'react';
import { P } from '../styles/pahari/palette';
import { FONT } from '../style/fonts';
import { TextZone, T, Zone } from './text';

// The opening title, top to bottom: story title / art-form line / series line, on a hartal-yellow
// inscription panel set into the painting's sky (a Pahari album page carries its caption this way).
export const TITLE_ZONE: Zone = { x: 130, y: 150, w: 820, h: 330 };
export const TitleCard: React.FC<{ title: string; artLine: string; series: string; a?: number; z?: Zone; panel?: string; ink?: string; accent?: string }> = ({ title, artLine, series, a = 1, z = TITLE_ZONE, panel = P.hartal, ink = P.ink, accent = P.border }) => (
  <>
    <div data-kind="surface" style={{ position: 'absolute', left: z.x, top: z.y, width: z.w, height: z.h, background: panel, border: `2px solid ${P.ink}`, boxShadow: `inset 0 0 0 7px ${panel}, inset 0 0 0 9px ${P.gold}`, opacity: a }} />
    <TextZone id="title" z={{ x: z.x + 24, y: z.y + 18, w: z.w - 48, h: z.h - 36 }} opacity={a}>
      <T size={96} color={accent} font={FONT.rozha}>{title}</T>
      <T size={38} color={ink} mt={10}>{artLine}</T>
      <div style={{ width: 360, height: 2, background: P.gold, margin: '14px 0 10px' }} />
      <T size={32} color={P.goldDeep}>{series}</T>
    </TextZone>
  </>
);
