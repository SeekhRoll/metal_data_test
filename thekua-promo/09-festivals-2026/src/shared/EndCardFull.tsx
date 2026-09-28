import React from 'react';
import { Img, staticFile } from 'remotion';
import { P } from '../styles/pahari/palette';
import { FONT } from '../style/fonts';
import menu from '../../data/menu.json';
import { TextZone, T } from './text';

// Formats A and B end card (≈6–8 s): the same card for all 18 videos, in a neutral Pahari border.
// Product photos come from assets/products (real photos supplied by the brand); until then a labelled slot.
export const PRODUCT_PHOTOS: Record<string, string | null> = { thekua: null, sev: null, papdi: null, cookies: null, baked: null };

const Tile: React.FC<{ p: (typeof menu.products)[number]; w: number; h: number }> = ({ p, w, h }) => {
  const src = PRODUCT_PHOTOS[p.id];
  return (
    <div data-kind="graphic" data-id={'tile-' + p.id} style={{ width: w, height: h, background: P.paper, border: `2px solid ${P.ink}`, boxShadow: `inset 0 0 0 5px ${P.paper}, inset 0 0 0 7px ${P.gold}`, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 12, boxSizing: 'border-box' }}>
      <div style={{ width: w - 34, height: w - 34, background: '#E3D6B6', border: `1px solid ${P.goldDeep}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {src ? <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontFamily: FONT.serif, fontSize: 18, color: P.goldDeep }}>photo</span>}
      </div>
      <div data-kind="text" style={{ fontFamily: FONT.serif, fontSize: 21, fontWeight: 700, color: P.ink, textAlign: 'center', lineHeight: 1.15, marginTop: 10, height: 50, display: 'flex', alignItems: 'center' }}>{p.name.replace('Shri ', '')}</div>
      <div data-kind="text" style={{ fontFamily: FONT.serif, fontSize: 20, color: P.ink, marginTop: 4 }}>{p.weight} · <b style={{ color: P.border }}>₹{p.price}</b></div>
    </div>
  );
};

export const EndCardFull: React.FC<{ a?: number; topLine?: string }> = ({ a = 1, topLine = 'नवरात्रि की शुभकामनाओं के साथ' }) => {
  const [p1, p2, p3, p4, p5] = menu.products;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: a }}>
      <TextZone id="end-top" z={{ x: 110, y: 150, w: 860, h: 250 }}>
        <T size={50} color={P.border} font={FONT.rozha}>{topLine}</T>
        <T size={40} color={P.ink} mt={16}><span style={{ fontFamily: FONT.serif, fontWeight: 700 }}>{menu.brand}</span> की ओर से</T>
      </TextZone>
      <div style={{ position: 'absolute', left: 96, top: 440, width: 888, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 22 }}>
        {[p1, p2, p3].map((p) => <Tile key={p.id} p={p} w={272} h={380} />)}
        {[p4, p5].map((p) => <Tile key={p.id} p={p} w={272} h={380} />)}
      </div>
      <TextZone id="end-claims" z={{ x: 110, y: 1260, w: 860, h: 280 }}>
        <T size={34} color={P.green} font={FONT.serif} weight={700}>{menu.claims.join('  ·  ')}</T>
        <T size={30} color={P.ink} mt={14}>डिलीवरी {menu.delivery}</T>
        {menu.orderNotes.map((n) => <T key={n} size={27} color={P.ink} mt={4}>{n}</T>)}
      </TextZone>
      <TextZone id="end-phone" z={{ x: 110, y: 1570, w: 860, h: 230 }}>
        <T size={34} color={P.ink}>ऑर्डर के लिए कॉल करें</T>
        <T size={88} color={P.border} font={FONT.serif} weight={800} ls={2}>{menu.phone.replace(/(\d{5})(\d{5})/, '$1 $2')}</T>
      </TextZone>
    </div>
  );
};

// Format C short brand strip (≈3 s): no products or prices, stays shareable.
export const BrandStrip: React.FC<{ a?: number }> = ({ a = 1 }) => (
  <TextZone id="brand-strip" z={{ x: 90, y: 1610, w: 900, h: 220 }} opacity={a}>
    <T size={40} color={P.ink}><span style={{ fontFamily: FONT.serif, fontWeight: 700 }}>{menu.brand}</span> की ओर से</T>
    <T size={46} color={P.border} font={FONT.rozha} mt={6}>शुभ नवरात्रि</T>
    <T size={40} color={P.ink} font={FONT.serif} weight={700} mt={6}>📞 {menu.phone.replace(/(\d{5})(\d{5})/, '$1 $2')}</T>
  </TextZone>
);
