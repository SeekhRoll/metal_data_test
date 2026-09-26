// Reserved text zones (brief §6): the status panel at the top, the subtitle band at the bottom, and the
// "सोचिए…" zone in open water. Illustration never enters them (checked by scripts/check_text.py).
export const W = 1080, H = 1920;
export const PANEL = { x: 0, y: 0, w: 1080, h: 330 };
export const BAND = { x: 0, y: 1620, w: 1080, h: 300 };
export const SUB_ZONE = { x: 90, y: 1664, w: 900, h: 216 };
export const THINK_ZONE = { x: 630, y: 900, w: 420, h: 250 };
export const PANEL_TEXT = {
  near: { x: 240, y: 72, size: 44 }, far: { x: 840, y: 72, size: 44 },
  counterLabel: { x: 540, y: 132, size: 40 }, counter: { x: 540, y: 222, size: 76 },
};
export const ICON_SLOTS = { near: [95, 205, 315], far: [705, 815, 925], y: 168, size: 104 };
export const BUBBLES = { lion: { x: 600, y: 640, s: 420 }, goat: { x: 600, y: 640, s: 420 } };
