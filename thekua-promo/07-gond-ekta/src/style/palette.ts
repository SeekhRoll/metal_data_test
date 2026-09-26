// Gond palette (brief §3.2): bold, flat, saturated colour; no gradients. Open backgrounds.
export const C = {
  magenta: '#D81B72',
  turquoise: '#14A7A5',
  marigold: '#F5A30A',
  yellow: '#F7D22E',
  leaf: '#3C9A36',
  lime: '#9CC93A',
  vermilion: '#E2381C',
  cobalt: '#2350B8',
  sky: '#5FB7E8',
  plum: '#6B2A7A',
  brown: '#8A4B22',
  black: '#17130F',
  white: '#FFF9EE',
  paper: '#F4EAD5',        // warm off-white background
  night: '#141019',        // deep black background for night / drama
} as const;
export type Col = string;

export const W = 1080, H = 1920;
// subtitles sit on a solid band at the bottom of the frame (brief §4.3)
export const BAND = { y: 1620, h: 300 };
export const TEXT_ZONES = { subtitle: { x: 90, y: 1660, w: 900, h: 220 } };
