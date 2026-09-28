import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { P, PAGE } from '../../styles/pahari/palette';
import { PahariPage } from '../../styles/pahari/Page';
import { S } from '../../styles/pahari/paint';
import { seg, ease, rng } from '../../styles/pahari/rand';
import { Landscape } from '../../devi/pahari/PortraitScene';
import { Sky, Hill, RoundTree, Cypress, River, HillTemple, Pavilion, SnowPeaks, Halo, Diya } from '../../styles/pahari/scenery';
import { Sagar, Son, Anshuman, Dilip, Bhagiratha, IndraShadow, SacrificialHorse, Kapila, Brahma, Shiva, GangaOnMakara, BhagirathaChariot } from '../../characters/ep1/cast';
import { Kund, Strata, AshMound, Motes, WaterFall, Rain, Snow } from './ep1-props';
import { TitleCard, TITLE_ZONE } from '../../shared/TitleCard';
import { IncenseHaze } from '../../shared/reverent';
import { TextZone, T } from '../../shared/text';
import { FONT } from '../../style/fonts';
import { FPS, sceneAt, darkness, reveal, blinkAt, onTwos, Subtitles, splitCues, Cue, makeCheck } from '../../shared/film';
import { EP1_SCENES, EP1_DUR } from './ep1-timeline';
import vo from './ep1-vo.json';

const W = PAGE.win, GROUND = 1480;
const sc = (id: string) => EP1_SCENES.find((s) => s.id === id)!;
const CUES: Cue[] = (vo as { id: string; text: string; at: number; dur: number; sub?: boolean }[]).filter((l) => l.sub !== false).flatMap((l) => splitCues(l.text, l.at, l.at + l.dur));

// ---------------------------------------------------------------- scenes (u = seconds since the scene began)
const Title: React.FC<{ t: number; u: number }> = ({ t }) => <><Landscape t={t} peaks /><HillTemple x={540} y={1190} s={1.1} /></>;

const Yagya: React.FC<{ t: number; u: number }> = ({ t, u }) => {
  const tt = onTwos(t), lead = seg(u, 4.2, 9.5), gone = seg(u, 7.5, 9.8);
  return (
    <g transform={`translate(540 1300) scale(${1.22 + .06 * seg(u, 0, 12)}) translate(-540 -1300)`}>
      <Sky x={W.x} y={W.y} w={W.w} h={700} horizon={.9} />
      <Hill x={W.x - 60} w={W.w + 120} base={700} amp={80} bottom={900} seed={11} fill={P.hillMid} tufts={24} />
      <rect x={W.x - 200} y={880} width={W.w + 400} height={900} fill="#E9E1CF" />
      {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${W.x} ${900 + i * 80} H${W.x + W.w}`} stroke="#CFC5AE" strokeWidth={1.4} />)}
      <Pavilion x={540} y={1010} w={760} h={400} />
      <RoundTree x={W.x + 60} y={910} h={330} seed={21} flowers="#D9707C" sway={Math.sin(t * .8)} />
      <Cypress x={W.x + W.w - 60} y={910} h={260} seed={7} />
      <Kund x={520} y={1350} t={tt} />
      <g transform={`translate(300 ${GROUND - 646 * .62}) scale(.62)`}><Sagar blink={blinkAt(t, 1)} breathe={Math.sin(t * 1.6)} /></g>
      <g opacity={1 - gone} transform={`translate(${740 + lead * 360} ${GROUND - 290 * .62 + gone * 60}) scale(.62)`}><SacrificialHorse step={lead > 0 ? tt * .9 : 0} tail={Math.sin(t * 1.2)} blink={blinkAt(t, 3)} /></g>
      {u > 4 && <g opacity={Math.min(seg(u, 4, 5), 1 - gone)} transform={`translate(${880 + lead * 360} ${GROUND - 646 * .6 + gone * 60}) scale(.6)`}><IndraShadow /></g>}
    </g>
  );
};

// cross-section down through the earth to Patala: a tall painting the camera travels down
const TALL = 2700;
const SON_PATH = (i: number) => { const u = i / 13; return [220 + u * 560 + (i % 2) * 40, 520 + u * 1500] as const; };
const Sons: React.FC<{ t: number; u: number }> = ({ t, u }) => {
  const tt = onTwos(t), cam = -ease(seg(u, .5, 6.2)) * (TALL - W.h), arrived = u > 6.4;
  const kids: React.ReactNode[] = [];
  const visible = Math.floor(seg(u, .2, 5.6) * 14);
  if (!arrived) for (let i = 0; i < visible; i++) { const [x, y] = SON_PATH(i); const ph = Math.floor(tt * 4 + i) % 2; kids.push(<g key={i} transform={`translate(${x} ${y}) scale(.26)`}><Son pose={ph ? 'dig' : 'down'} turban={[P.saffron, '#D9707C', '#6E8B3D', '#5F8FC0'][i % 4]} blink={blinkAt(t, i)} /></g>); }
  else for (let i = 0; i < 6; i++) kids.push(<g key={i} transform={`translate(${990 - i * 40} ${W.y + TALL - 300 - 646 * .34 + (i % 2) * 14}) scale(-.34 .34)`}><Son pose="point" turban={[P.saffron, '#D9707C', '#6E8B3D', '#5F8FC0'][i % 4]} blink={blinkAt(t, i)} /></g>);
  return (
    <g transform={`translate(0 ${cam})`}>
      <Sky x={W.x} y={W.y} w={W.w} h={320} horizon={.9} />
      <Hill x={W.x - 60} w={W.w + 120} base={330} amp={60} bottom={430} seed={31} fill={P.hillMid} tufts={16} />
      <rect x={W.x} y={400} width={W.w} height={30} fill={P.ground} />
      <Strata x={W.x} y={430} w={W.w} h={TALL - 700} seed={5} />
      {/* the dug passage: a lighter zig-zag through the strata */}
      <path d={`M200 430 ${Array.from({ length: 14 }, (_, i) => { const [x, y] = SON_PATH(i); return `L${x + 40} ${y + 160}`; }).join(' ')}`} stroke="#D8B982" strokeWidth={90} fill="none" opacity={.55} strokeLinejoin="round" />
      {/* Patala chamber */}
      <rect x={W.x} y={W.y + TALL - 620} width={W.w} height={620} fill="#2B2230" />
      <path d={`M${W.x} ${W.y + TALL - 620} Q540 ${W.y + TALL - 760} ${W.x + W.w} ${W.y + TALL - 620}`} fill="#2B2230" stroke={P.ink} strokeWidth={1.4} />
      <rect x={W.x} y={W.y + TALL - 300} width={W.w} height={300} fill="#4A3A3E" />
      <g transform={`translate(230 ${W.y + TALL - 300 - 330 * .7}) scale(.7)`}><Kapila open={0} breathe={Math.sin(t * 1.2)} /></g>
      <S d={`M470 ${W.y + TALL - 300} V${W.y + TALL - 470}`} stroke={P.wood} sw={6} />
      <g transform={`translate(560 ${W.y + TALL - 300 - 290 * .42}) scale(.42)`}><SacrificialHorse tail={Math.sin(t)} blink={blinkAt(t, 2)} /></g>
      <S d={`M470 ${W.y + TALL - 450} C520 ${W.y + TALL - 440} 580 ${W.y + TALL - 420} 640 ${W.y + TALL - 360}`} stroke="#C9A04A" sw={2} />
      {kids}
    </g>
  );
};

const Gaze: React.FC<{ t: number; u: number }> = ({ t, u }) => {
  const open = ease(seg(u, 1.4, 2.0)), wave = seg(u, 2.1, 3.6), fade = seg(u, 2.6, 4.4);
  return (
    <g>
      <rect x={W.x} y={W.y} width={W.w} height={W.h} fill="#2B2230" />
      <rect x={W.x} y={1200} width={W.w} height={400} fill="#4A3A3E" />
      <g transform="translate(250 780) scale(1.25)"><Kapila open={open} breathe={Math.sin(t * 1.2)} /></g>
      {/* the gaze: a pale wave of light passing over the sons, who turn to still silhouettes and drift away as motes */}
      {wave > 0 && wave < 1 && <rect x={330 + wave * 700 - 160} y={W.y} width={160} height={W.h} fill="#FFFBEF" opacity={.55 * Math.sin(wave * Math.PI)} filter="url(#softBlur)" />}
      {Array.from({ length: 6 }, (_, i) => {
        const hit = seg(u, 2.1 + i * .18, 2.7 + i * .18);
        return <g key={i} opacity={1 - fade} filter={hit > .3 ? 'url(#silhouette)' : undefined} transform={`translate(${980 - i * 60} ${1200 - 646 * .44 + (i % 2) * 14}) scale(-.44 .44)`}><Son pose="point" blink={0} turban={[P.saffron, '#D9707C', '#6E8B3D'][i % 3]} /></g>;
      })}
      <Motes n={120} x={620} y={1150} w={380} t={Math.max(0, u - 3.0)} col="#E9E4DA" rise={90} seed={11} />
    </g>
  );
};

const Generations: React.FC<{ t: number; u: number }> = ({ t, u }) => {
  const a1 = 1 - seg(u, 3.4, 4.6), a2 = Math.min(seg(u, 3.4, 4.6), 1 - seg(u, 7.2, 8.4)), a3 = seg(u, 7.2, 8.4);
  const pos = (s: number) => `translate(420 ${GROUND - 646 * .8}) scale(.8)`;
  return (
    <g transform={`translate(${-20 * seg(u, 0, 12)} 0)`}>
      <Landscape t={t} peaks />
      <g opacity={a1} transform={pos(1)}><Anshuman blink={blinkAt(t, 1)} /></g>
      <g opacity={a2} transform={pos(2)}><Dilip blink={blinkAt(t, 2)} /></g>
      <g opacity={a3} transform={pos(3)}><Bhagiratha blink={blinkAt(t, 3)} /></g>
    </g>
  );
};

const Tapasya: React.FC<{ t: number; u: number }> = ({ t, u }) => {
  const rain = Math.min(seg(u, 1.4, 2), 1 - seg(u, 3.4, 4)), snow = Math.min(seg(u, 3.6, 4.2), 1 - seg(u, 5.6, 6.2)), bloom = seg(u, 6, 7.4);
  const groundTint = u < 1.6 ? '#D9B36A' : u < 3.8 ? '#6E8C5A' : u < 6 ? '#EEF0EC' : P.hillMid;
  return (
    <g>
      <Sky x={W.x} y={W.y} w={W.w} h={900} horizon={.92} top={u > 1.6 && u < 3.8 ? '#4A5870' : P.skyTop} />
      <SnowPeaks x={W.x - 40} w={W.w + 80} base={1000} h={480} seed={2} />
      <Hill x={W.x - 60} w={W.w + 120} base={1100} amp={80} bottom={1600} seed={41} fill={groundTint} tufts={u > 6 ? 30 : 0} />
      <Rain t={t} a={rain} x={W.x} y={W.y} w={W.w} h={W.h} />
      <Snow t={t} a={snow} x={W.x} y={W.y} w={W.w} h={W.h} />
      {u > 6 && <RoundTree x={W.x + 80} y={1260} h={300} seed={9} flowers="#E0747F" />}
      <g transform={`translate(330 ${GROUND - 646 * .82}) scale(.82)`}><Bhagiratha pose="tapas" blink={blinkAt(t, 5) * (u < 6 ? 1 : 0)} breathe={Math.sin(t * .9)} /></g>
      {bloom > 0 && <g opacity={bloom} transform={`translate(760 ${470 - 20 * ease(bloom)}) scale(.72)`}><Halo x={-30} y={-50} r={180} bloom={bloom} /><Brahma blink={blinkAt(t, 6)} /></g>}
    </g>
  );
};

const Ganga: React.FC<{ t: number; u: number }> = ({ t, u }) => {
  const fall = ease(seg(u, .3, 4)), spread = ease(seg(u, 2.8, 4.4)), absorbed = seg(u, 4.4, 6), stream = seg(u, 6.4, 9);
  const gy = -300 + fall * 820;
  return (
    <g>
      <Sky x={W.x} y={W.y} w={W.w} h={W.h} horizon={.96} />
      <circle cx={600} cy={380} r={420} fill="#FFE7A8" opacity={.45 * Math.sin(Math.PI * seg(u, .5, 9))} filter="url(#haloBloom)" />
      <SnowPeaks x={W.x - 60} w={W.w + 120} base={1500} h={520} seed={7} />
      {/* the torrent from the sky, then absorbed into the locks */}
      <WaterFall x0={640} y0={W.y} x1={520} y1={Math.min(gy + 380, 700)} w={200 * (1 - absorbed * .9)} t={t} a={1 - absorbed * .8} />
      <g opacity={1 - absorbed} transform={`translate(650 ${gy - 60}) scale(.72)`}><GangaOnMakara t={t} blink={blinkAt(t, 7)} /></g>
      <g transform={`translate(500 ${1400 - 646 * .95}) scale(.95)`}><Shiva spread={spread} blink={blinkAt(t, 8)} /></g>
      {stream > 0 && <WaterFall x0={560} y0={820} x1={560 + stream * 420} y1={820 + stream * 700} w={46} t={t} />}
    </g>
  );
};

const Liberation: React.FC<{ t: number; u: number }> = ({ t, u }) => {
  const WIDE = 2100, cam = -ease(seg(u, 0, 7)) * (WIDE - W.w), cx = 300 + ease(seg(u, 0, 7)) * 1250, reach = seg(u, 6.2, 7.2), lights = Math.max(0, u - 6.8);
  return (
    <g transform={`translate(${cam} 0)`}>
      <Sky x={W.x} y={W.y} w={WIDE} h={820} horizon={.9} />
      <SnowPeaks x={W.x} w={WIDE} base={900} h={380} seed={3} />
      <Hill x={W.x - 60} w={WIDE + 120} base={1000} amp={80} bottom={1600} seed={17} fill={P.hillMid} tufts={50} />
      <rect x={W.x} y={1250} width={WIDE} height={400} fill={P.ground} />
      <River x={W.x} y={1250} w={Math.max(0, cx - 120 - W.x)} h={70} t={t} id="ganga-river" />
      <AshMound x={1780} y={1260} a={1 - seg(u, 8, 9.5) * .7} />
      <g transform={`translate(${cx} ${1250 - 150 * .85}) scale(.85)`}><BhagirathaChariot t={onTwos(t)} /></g>
      {lights > 0 && <Motes n={260} x={1620} y={1220} w={320} t={lights} rise={170} seed={21} />}
      {[300, 900, 1500].map((x, i) => <RoundTree key={i} x={x} y={1260} h={260} seed={30 + i} sway={Math.sin(t * .7 + i)} />)}
    </g>
  );
};

const Moral: React.FC<{ t: number; u: number }> = ({ t }) => (
  <g>
    <Landscape t={t} peaks />
    <g transform={`translate(360 ${GROUND - 646 * .8}) scale(.8)`}><Bhagiratha blink={blinkAt(t, 9)} breathe={Math.sin(t)} /></g>
  </g>
);

const Closing: React.FC<{ t: number }> = ({ t }) => <><rect x={0} y={0} width={1080} height={1920} fill="#1E140E" /><Diya x={540} y={900} s={2.6} flame={t} glow={1.2} /></>;

const PAINT: Record<string, React.FC<{ t: number; u: number }>> = { title: Title, yagya: Yagya, sons: Sons, gaze: Gaze, generations: Generations, tapasya: Tapasya, ganga: Ganga, liberation: Liberation, moral: Moral, closing: Closing };

const Cover: React.FC<{ u: number }> = ({ u }) => {
  const k = ease(seg(u, .2, 1.4));
  if (k >= 1) return null;
  return (
    <AbsoluteFill style={{ perspective: 1800 }}>
      <div style={{ position: 'absolute', inset: 0, transformOrigin: '0% 50%', transform: `rotateY(${-100 * k}deg)`, background: '#6E1E18', boxShadow: `inset 0 0 0 28px #5A1812, inset 0 0 0 32px ${P.gold}, inset 0 0 0 38px #5A1812, inset 0 0 0 40px ${P.gold}`, opacity: 1 - seg(u, 1.1, 1.4) }}>
        <svg viewBox="0 0 1080 1920" width={1080} height={1920}><g transform="translate(540 960)">{Array.from({ length: 12 }, (_, i) => <ellipse key={i} rx={120} ry={34} transform={`rotate(${i * 15})`} fill="none" stroke={P.gold} strokeWidth={2} opacity={.8} />)}<circle r={26} fill={P.gold} /></g></svg>
      </div>
    </AbsoluteFill>
  );
};

export const Ep1Frame: React.FC<{ t: number }> = ({ t }) => {
  const s = sceneAt(EP1_SCENES, t), u = t - s.from, Scene = PAINT[s.id];
  const rv = s.id === 'closing' ? { line: 1, fill: 1, shimmer: -1 } : reveal(s.id === 'title' ? Math.max(0, u - .8) : u, s.id === 'title' ? .8 : 1.6);
  const title = s.id === 'title' ? seg(u, 1.6, 2.6) : 0;
  const moral = s.id === 'moral';
  return (
    <AbsoluteFill>
      <PahariPage reverent reveal={rv} shimmer={rv.shimmer} windowFill={s.id === 'closing' ? '#1E140E' : P.paper} dim={darkness(EP1_SCENES, t)}
        painting={<Scene t={t} u={u} />}
        overlay={<>
          {title > 0 && <TitleCard title="भगीरथ प्रयास" artLine="पहाड़ी लघुचित्र शैली में · हिमाचल प्रदेश" series="पितृ पक्ष विशेष" accent={P.borderDeep} a={title} />}
          {moral && <TextZone id="moral" z={PAGE.cartouche} opacity={seg(u, .6, 1.4) * (1 - seg(u, 5, 5.6))}><T size={44} color={P.ink}>आज भी बड़े प्रयास को,</T><T size={58} color={P.borderDeep} font={FONT.rozha}>"भगीरथ प्रयास" कहते हैं।</T></TextZone>}
          {s.id === 'closing' && <TextZone id="closing" z={PAGE.cartouche} opacity={seg(u, .5, 1.5)}><T size={62} color={P.ink} font={FONT.rozha}>पितरों को नमन।</T><T size={40} color={P.ink} mt={10}><span style={{ fontFamily: FONT.serif, fontWeight: 700 }}>Sri Desi Thekua</span> की ओर से</T></TextZone>}
          {!moral && s.id !== 'closing' && <Subtitles cues={CUES} t={t} z={{ x: 90, y: 1600, w: 900, h: 230 }} color={P.ink} />}
        </>} />
      <IncenseHaze t={t} a={s.id === 'closing' ? .5 : 1} />
      {s.id === 'title' && <Cover u={u} />}
    </AbsoluteFill>
  );
};

export const Ep1: React.FC = () => { const f = useCurrentFrame(); return <Ep1Frame t={f / FPS} />; };
export const Ep1Check = makeCheck(Ep1Frame, EP1_SCENES, { x0: W.x, y0: W.y, x1: W.x + W.w, y1: W.y + W.h });
export const EP1_FRAMES = Math.round(EP1_DUR * FPS);
