// Madhubani palette (brief 3.2): turmeric, vermilion, indigo, leaf green, lamp-black, ochre on handmade paper.
// Flat fills only. The "light" tints are the same pigments laid thinner (skin, Krishna's blue).
export const C = {
  paper: '#F1E2C0',
  paperShade: '#E4CFA4',
  turmeric: '#E6A019',
  turmericLight: '#F0C15A',
  vermilion: '#D1392A',
  indigo: '#28388A',
  indigoLight: '#3E63C3',
  leaf: '#3C8A3A',
  black: '#1B1511',
  ochre: '#B5682A',
} as const;

export type Pigment = keyof typeof C;

export const SWATCHES: [Pigment, string, string][] = [
  ['turmeric', 'हल्दी', 'turmeric yellow'],
  ['vermilion', 'सिंदूरी', 'vermilion'],
  ['indigo', 'नील', 'indigo'],
  ['leaf', 'पत्ती हरा', 'leaf green'],
  ['black', 'काजल', 'lamp-black'],
  ['ochre', 'गेरू', 'ochre'],
  ['paper', 'हस्तनिर्मित काग़ज़', 'handmade paper'],
];
