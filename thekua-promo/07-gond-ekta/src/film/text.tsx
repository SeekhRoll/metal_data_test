import React from 'react';
import { C, W, BAND, TEXT_ZONES } from '../style/palette';
import { FONT } from '../style/fonts';
import { Gond } from '../style/gond';
import { tube } from '../style/geom';

// Text never sits on patterned art (brief §4): titles go in a reserved clear zone of the open ground; subtitles on
// the solid band at the bottom; end-card words on placards whose patterned borders stay 24 px clear of the text.
export const TITLE_ZONE = { x: 90, y: 120, w: 900, h: 300 };
export const TitleText: React.FC<{ lines: { text: string; size: number; font?: string; color?: string }[]; opacity?: number; y0?: number }> = ({ lines, opacity = 1, y0 = TITLE_ZONE.y + 110 }) => {
  let y = y0;
  return (
    <g opacity={opacity}>
      {lines.map((l, i) => { const el = <text key={i} data-kind="text" data-id={'title' + i} x={W / 2} y={y} textAnchor="middle" fontFamily={l.font ?? FONT.yatra} fontSize={l.size} fill={l.color ?? C.black}>{l.text}</text>; y += l.size * 1.25; return el; })}
    </g>
  );
};
export const Band: React.FC<{ night: number }> = ({ night }) => (
  <g data-kind="surface">
    <rect x={0} y={BAND.y} width={W} height={BAND.h} fill={night > .5 ? C.night : C.white} />
    <path d={`M0 ${BAND.y} H${W}`} stroke={night > .5 ? C.white : C.black} strokeWidth={6} />
    <path d={`M0 ${BAND.y + 12} H${W}`} stroke={night > .5 ? C.white : C.black} strokeWidth={2} strokeDasharray="2 12" />
  </g>
);
export const SubtitleText: React.FC<{ lines: string[]; night: number; opacity: number }> = ({ lines, night, opacity }) => {
  const z = TEXT_ZONES.subtitle, size = 56, lh = size * 1.3, y0 = z.y + z.h / 2 - (lines.length - 1) * lh / 2 + size * .34;
  return <g opacity={opacity}>{lines.map((l, i) => <text key={i} data-kind="text" data-id={'sub' + i} x={W / 2} y={y0 + i * lh} textAnchor="middle" fontFamily={FONT.tiro} fontSize={size} fill={night > .5 ? C.white : C.black}>{l}</text>)}</g>;
};

// a Gond placard: a plain surface for the words, framed by four separate patterned strips
export const Placard: React.FC<{ k: string; x: number; y: number; w: number; h: number; fill: string; frame: string; lines: { text: string; size: number; font?: string; color?: string; dy: number }[]; t: number; opacity?: number }> =
  ({ k, x, y, w, h, fill, frame, lines, t, opacity = 1 }) => {
    const b = 30;
    const strip = (id: string, x0: number, y0: number, x1: number, y1: number) => <Gond k={`${k}-${id}`} d={tube([[x0, y0, b], [x1, y1, b]])} fill={frame} bands={[{ w: 6, kind: 'dots', color: C.white, gap: 14, speed: 10 }]} life={{ t }} outline={4} inner={null} />;
    return (
      <g opacity={opacity} transform={`translate(${x} ${y})`}>
        <rect data-kind="surface" x={-w / 2} y={-h / 2} width={w} height={h} rx={16} fill={fill} stroke={C.black} strokeWidth={6} />
        {strip('t', -w / 2 + 20, -h / 2 + 4, w / 2 - 20, -h / 2 + 4)}
        {strip('b', -w / 2 + 20, h / 2 - 4, w / 2 - 20, h / 2 - 4)}
        {strip('l', -w / 2 + 4, -h / 2 + 34, -w / 2 + 4, h / 2 - 34)}
        {strip('r', w / 2 - 4, -h / 2 + 34, w / 2 - 4, h / 2 - 34)}
        {lines.map((l, i) => <text key={i} data-kind="text" data-id={`${k}-text${i}`} x={0} y={l.dy} textAnchor="middle" fontFamily={l.font ?? FONT.yatra} fontSize={l.size} fill={l.color ?? C.black}>{l.text}</text>)}
      </g>
    );
  };
