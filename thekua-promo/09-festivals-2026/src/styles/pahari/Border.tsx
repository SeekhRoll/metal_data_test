import React from 'react';
import { P, PAGE } from './palette';

// Kangra album page: wide red outer border, thin gold rule, a lapis inner margin carrying a fine floral
// scroll, then a white hairline around the painting. `color` swaps the red for the day's accent.
function vine(x0: number, y0: number, x1: number, y1: number, amp: number, key: string) {
  const len = Math.hypot(x1 - x0, y1 - y0), n = Math.max(2, Math.round(len / 34));
  const ux = (x1 - x0) / len, uy = (y1 - y0) / len, nx = -uy, ny = ux;
  let d = `M${x0} ${y0}`;
  const deco: React.ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const a = i / n * len, b = (i + 1) / n * len, s = i % 2 ? -1 : 1;
    const c1 = [x0 + ux * (a + (b - a) * .35) + nx * amp * s, y0 + uy * (a + (b - a) * .35) + ny * amp * s];
    const c2 = [x0 + ux * (a + (b - a) * .65) + nx * amp * s, y0 + uy * (a + (b - a) * .65) + ny * amp * s];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${(x0 + ux * b).toFixed(1)} ${(y0 + uy * b).toFixed(1)}`;
    const m = (a + b) / 2, px = x0 + ux * m + nx * amp * s * .75, py = y0 + uy * m + ny * amp * s * .75;
    if (i % 2 === 0) {
      // five-dot flower
      deco.push(<g key={key + 'f' + i}>{[0, 1, 2, 3, 4].map((k) => { const t = k / 5 * Math.PI * 2; return <circle key={k} cx={px + Math.cos(t) * 2.6} cy={py + Math.sin(t) * 2.6} r={1.7} fill={P.white} />; })}<circle cx={px} cy={py} r={1.3} fill={P.red} /></g>);
    } else {
      const lx = px - nx * amp * s * 1.1, ly = py - ny * amp * s * 1.1, ang = Math.atan2(uy, ux) * 180 / Math.PI + 35 * s;
      deco.push(<ellipse key={key + 'l' + i} cx={lx} cy={ly} rx={4.2} ry={1.8} transform={`rotate(${ang} ${lx} ${ly})`} fill="#7FA35A" />);
    }
  }
  return <g key={key}><path d={d} fill="none" stroke={P.goldHi} strokeWidth={1.1} opacity={.85} />{deco}</g>;
}

export const PahariBorder: React.FC<{ color?: string; win?: { x: number; y: number; w: number; h: number }; cartouche?: boolean }> = ({ color = P.border, win = PAGE.win, cartouche = true }) => {
  const { W, H } = PAGE, band = 18, g = 5;
  const o = { x: win.x - band - g, y: win.y - band - g, w: win.w + 2 * (band + g), h: win.h + 2 * (band + g) };
  const c = PAGE.cartouche;
  return (
    <g data-kind="surface" data-id="border">
      {/* the page: red border with painted-out window */}
      <path d={`M0 0H${W}V${H}H0Z M${win.x} ${win.y}h${win.w}v${win.h}h${-win.w}Z` + (cartouche ? ` M${c.x} ${c.y}h${c.w}v${c.h}h${-c.w}Z` : '')} fill={color} fillRule="evenodd" />
      <rect x={0} y={0} width={W} height={H} fill="none" stroke={P.borderDeep} strokeWidth={10} opacity={.5} />
      {/* lapis inner margin with floral scroll */}
      <path d={`M${o.x} ${o.y}h${o.w}v${o.h}h${-o.w}Z M${win.x - g} ${win.y - g}h${win.w + 2 * g}v${win.h + 2 * g}h${-(win.w + 2 * g)}Z`} fill={P.lapis} fillRule="evenodd" />
      {vine(o.x + 14, o.y + band / 2, o.x + o.w - 14, o.y + band / 2, 4, 't')}
      {vine(o.x + 14, o.y + o.h - band / 2, o.x + o.w - 14, o.y + o.h - band / 2, 4, 'b')}
      {vine(o.x + band / 2, o.y + 14, o.x + band / 2, o.y + o.h - 14, 4, 'l')}
      {vine(o.x + o.w - band / 2, o.y + 14, o.x + o.w - band / 2, o.y + o.h - 14, 4, 'r')}
      <rect x={o.x - 3} y={o.y - 3} width={o.w + 6} height={o.h + 6} fill="none" stroke={P.gold} strokeWidth={2.2} />
      <rect x={o.x} y={o.y} width={o.w} height={o.h} fill="none" stroke={P.ink} strokeWidth={1.2} />
      <rect x={win.x - g} y={win.y - g} width={win.w + 2 * g} height={win.h + 2 * g} fill={'none'} stroke={P.white} strokeWidth={g} />
      <rect x={win.x} y={win.y} width={win.w} height={win.h} fill="none" stroke={P.ink} strokeWidth={1.4} />
      {cartouche && (
        <g data-id="cartouche">
          <rect x={c.x} y={c.y} width={c.w} height={c.h} fill={P.hartal} />
          <rect x={c.x + 7} y={c.y + 7} width={c.w - 14} height={c.h - 14} fill="none" stroke={P.gold} strokeWidth={1.6} />
          <rect x={c.x} y={c.y} width={c.w} height={c.h} fill="none" stroke={P.ink} strokeWidth={1.4} />
        </g>
      )}
    </g>
  );
};
