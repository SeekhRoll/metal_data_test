// Pahari miniature (Kangra / Guler) palette: flat opaque gouache colours, fine sepia outlines, gold.
export const P = {
  ink: '#2A1A12',          // main outline (dark sepia)
  skinLine: '#7A3B22',     // fine red-brown line used on skin
  border: '#B3362B',       // wide vermilion outer border
  borderDeep: '#7E2118',
  lapis: '#22305F',        // inner margin band
  hartal: '#E9D9A6',       // pale yellow cartouche for text
  paper: '#F1E7CF',
  white: '#F4EFE3',        // lead white
  skyTop: '#5F82B8',
  skyPale: '#E3E6D8',
  horizon: '#F1D58C',
  hillFar: '#AFB88A',
  hillMid: '#8CA55A',
  hillNear: '#6D8C43',
  hillDark: '#4E6B33',
  ground: '#A9B96B',
  canopy: '#2F4E2B',
  leaf: '#5E8A3E',
  leafHi: '#86A94F',
  trunk: '#5B3A24',
  river: '#D7DEDC',
  ripple: '#7F98B2',
  skin: '#E6B88E',
  hair: '#1B1512',
  gold: '#C9A04A',
  goldHi: '#F3DC93',
  goldDeep: '#8A6424',
  pearl: '#FBF6EA',
  red: '#C2362C',
  pink: '#D9707C',
  saffron: '#E58A2E',
  green: '#3F7A3A',
  blue: '#2F4E9A',
  stone: '#C9BFA8',
  wood: '#7A4B2A',
  slate: '#6E6A66',
} as const;

// Day accent colours for the Navratri B/C videos (accent only: border band, garment, garlands)
export type Accent = { hex: string; deep: string };
export const accent = (hex: string): Accent => ({ hex, deep: shade(hex, -.3) });

export function shade(hex: string, k: number) {
  const n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const f = (c: number) => Math.round(k < 0 ? c * (1 + k) : c + (255 - c) * k);
  return '#' + [f(r), f(g), f(b)].map((c) => c.toString(16).padStart(2, '0')).join('');
}

// Page layout: the painting window sits inside the red border, with a hartal-yellow cartouche below for text.
export const PAGE = {
  W: 1080, H: 1920,
  win: { x: 66, y: 66, w: 948, h: 1470 },
  cartouche: { x: 66, y: 1578, w: 948, h: 276 },
};
