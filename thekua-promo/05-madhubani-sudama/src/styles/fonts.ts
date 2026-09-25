import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

export const FONT = { tiro: 'Tiro Devanagari Hindi', yatra: 'Yatra One', kalam: 'Kalam' };

export const fontsReady = Promise.all([
  loadFont({ family: FONT.tiro, url: staticFile('fonts/TiroDevanagariHindi-Regular.ttf') }),
  loadFont({ family: FONT.yatra, url: staticFile('fonts/YatraOne-Regular.ttf') }),
  loadFont({ family: FONT.kalam, url: staticFile('fonts/Kalam-Bold.ttf') }),
]);
