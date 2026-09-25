// Tholu Bommalata palette (brief §3.3): saturated dyed leather laid over a lamp-lit cloth.
export const L = {
  vermilion: '#C42E1C',
  turmeric: '#E09C18',
  indigo: '#22307C',
  leaf: '#2C7A30',
  maroon: '#6A1420',
  black: '#140C08',
  ramBlue: '#2F78DC',       // Ram: blue (lifted so it stays blue over the warm lamp light)
  gold: '#E2A447',          // Lakshman's golden skin
  fur: '#A0521A',           // Hanuman
  vanar: '#7A3C16',         // the other monkeys
  monkeyFace: '#D0461F',
  squirrel: '#8A5A2E',
  stone: '#3C3F66',
  wood: '#7A3E1C',
} as const;

export const WOOD = { deep: '#1E0F08', dark: '#2E170B', mid: '#4B2713', light: '#7B4824', brass: '#C8962E', brassHi: '#F0C860' };
export const SCREEN = { hot: '#FFF2CC', warm: '#F8D28C', mid: '#E9AE5E', edge: '#8E4618', dark: '#3A1A08' };
export const GLOW = '#FFF6D8';

// Stage geometry (brief §3.2): the cloth fills the upper ~78%, carved frame around it, wide base panel below.
export const STAGE = {
  W: 1080, H: 1920,
  screen: { x: 58, y: 58, w: 964, h: 1440 },
  base: { y: 1498 },
};
// Reserved text rectangles (brief §4). Subtitles live only on the base panel.
export const TEXT_ZONES = {
  subtitle: { x: 118, y: 1586, w: 844, h: 250 },
};

// dyes that would turn muddy when multiplied over the warm screen get a normal-blend lift on top
export const LIFT: Record<string, number> = { '#2F78DC': .42 };
