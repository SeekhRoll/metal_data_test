import React from 'react';
import { FONT } from '../style/fonts';

// A reserved text zone. Every piece of on-screen text sits in one; the collision check reads data-zone.
export type Zone = { x: number; y: number; w: number; h: number };
export const TextZone: React.FC<{ id: string; z: Zone; children: React.ReactNode; opacity?: number }> = ({ id, z, children, opacity = 1 }) => (
  <div data-zone={id} style={{ position: 'absolute', left: z.x, top: z.y, width: z.w, height: z.h, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', opacity }}>
    {children}
  </div>
);
export const T: React.FC<{ size: number; color: string; font?: string; weight?: number; mt?: number; ls?: number; children: React.ReactNode }> = ({ size, color, font = FONT.tiro, weight = 400, mt = 0, ls = 0, children }) => (
  <div data-kind="text" style={{ fontFamily: font, fontSize: size, color, fontWeight: weight, lineHeight: 1.28, marginTop: mt, letterSpacing: ls }}>{children}</div>
);
