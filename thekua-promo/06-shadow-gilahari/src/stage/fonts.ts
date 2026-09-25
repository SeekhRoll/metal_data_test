import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

export const FONT = { tiro: 'Tiro Devanagari Hindi', yatra: 'Yatra One', rozha: 'Rozha One', serif: 'Playfair Display', script: 'Dancing Script' };

export const fontsReady = Promise.all([
  loadFont({ family: FONT.tiro, url: staticFile('fonts/TiroDevanagariHindi-Regular.ttf') }),
  loadFont({ family: FONT.yatra, url: staticFile('fonts/YatraOne-Regular.ttf') }),
  loadFont({ family: FONT.rozha, url: staticFile('fonts/RozhaOne-Regular.ttf') }),
  loadFont({ family: FONT.serif, url: staticFile('fonts/PlayfairDisplay.ttf'), weight: '400 900' }),
  loadFont({ family: FONT.script, url: staticFile('fonts/DancingScript.ttf'), weight: '400 700' }),
]);
