// Act 8 · the ending (dusk → night → black)
const INF8 = { veins: 1, hood: 0, stalks: 1, arms: 'both' };
const CLAWP = () => P({ la: -2.0, lb: -.1, ra: .4, rb: -.1, lean: .1, head: .45, hy: .01 });
function lateLight(k) { dusk(.6); night(k); }

// 109 · Mia looks from the photo to him; Leo hauls her up and away
S('109', (t, d) => {
  cam(1.15, 1250, 560);
  garden({ hole: true });
  hero({ ...ME7(), x: GDX + GDW / 2 + 460 }, P({ la: -2.0, lb: -.1, ra: 1.0, rb: .2, lean: .2, head: .3 }), { ...INF8, claw: 1 });
  photoP(1180, GY - 6, .9, -.1);
  const up = ein(t, 2.6, .6), away = ein(t, 3.4, 2.4), look = Math.floor(clamp(t / 2.4) * 4) % 2;
  const mx = 1300 + 300 * away;
  MIA(mx, GY, 400, up < 1 ? lerpPose(P({ hy: .24, lfx: -.2, rfx: .2, la: -1.2, lb: .5, ra: 1.2, rb: -.5, lean: -.2, head: look ? .3 : -.3 }), P({ ra: .4, rb: -.2, la: -1.2, lb: .2, head: -.3 }), up) : walkP(-t * 5, .5), t, { face: -1 });
  LEO(mx + 180, GY, 420, P({ la: -1.5, lb: -.3, ra: .9, rb: -.3, lean: .1 }), t, { batA: .5 });
  lateLight(.15);
}, [[0, 'strings', { d: 6 }], [2.6, 'cloth']]);

// 110 · reload; the red line holds steady on his head
S('110', (t, d) => {
  cam(1.5, dx7 - 150, 520);
  garden({ hole: true });
  const rl = bell(t, .3, 1.2);
  const dj = DAN(dx7, GY, 410, P({ ra: -1.4, rb: -.2, la: -1.2 + .6 * rl, lb: -.4 - .8 * rl, head: -.1 }), t, { rifleA: Math.PI - .12 });
  if (t > .9) { const u = clamp((t - .9) / .6); shape(() => g.ellipse(dj.muzzle[0] + 360 + 30 * u, dj.muzzle[1] + 20 + 260 * u * u, 6, 12, u * 8, 0, Math.PI * 2), '#E8C35A', { lw: 2 }); }
  aimLine(dj.muzzle, [GDX + GDW / 2 + 460, GY - 400 * .9], ein(t, 1.4, .3));
  bubble('Last warning.', dx7 - 300, 340, dx7 - 60, 400, t, LT('d13'), LE('d13') + .8);
  lateLight(.25);
}, [[.4, 'reload'], [1.0, 'shell']]);

// 111 · the mouth lever won't move; outside only a breath
S('111', (t, d) => {
  const wide = t > 3.6; cam(wide ? 1 : 1.6, wide ? 960 : leverX(3), wide ? 540 : CR.panelY + 20);
  const push = ein(t, .4, .3) * (1 - ein(t, 3.2, .2)) * (.9 + .1 * Math.sin(t * 40));
  ctrlRoom(t, { threads: .95, taken: { 0: 1, 1: 1, 2: 1, 3: 1 }, lv: { 3: .03 * push }, lamps: { 0: 'off', 1: 'f', 2: 'f', 3: 'r' }, notes: [[1, 'MIA', 2]], view: (x, y, r) => { rect(x - r, y - r, 2 * r, 2 * r, '#C9A58F', { lw: 0 }); DAN(x, y + r, 280, P({ ra: -1.4, rb: -.2, la: -1.2, lb: -.4 }), t, { rifleA: Math.PI + .05 }); } });
  const fall = ein(t, 3.2, .4);
  littleMe(leverX(3) - 70, lerpPose(P({ lean: .35, ra: 1.3, rb: .1, la: 1.0, lb: .3, lfx: -.18, rfx: -.08, hy: .03 }), P({ hy: .24, lfx: -.16, rfx: .2, la: -.6, lb: .4, ra: .6, rb: -.4, head: .4 }), fall));
  if (t > 1.0 && t < 3.4) warpText('hhh…', 1200, 300, t, 1.0, { size: 60, col: C.mute, amp: .6 });
}, [[.4, 'leverStrain', { d: 2.8 }], [1.0, 'breath'], [3.2, 'thud'], [3.4, 'silence']]);

// 112 · tears; the arm stays a claw
S('112', (t, d) => {
  cam(lerp(2.1, 2.5, seg(t, 0, d)), GDX + GDW / 2 + 470, 480);
  garden({ hole: true });
  const j = hero({ ...ME7(), x: GDX + GDW / 2 + 460 }, breathe(tremble(CLAWP(), t, .4), t, 0, .5), { ...INF8, claw: 1 });
  tearDrops(j, 400, t, .8, 1, 3); tearDrops(j, 400, t, 1.3, -1, 3);
  lateLight(.35);
  g.save(); g.globalAlpha = .4 + .2 * Math.sin(t * 2); hero({ ...ME7(), x: GDX + GDW / 2 + 460, col: 'rgba(0,0,0,0)', fill: 'rgba(0,0,0,0)' }, breathe(tremble(CLAWP(), t, .4), t, 0, .5), { veins: 1, arms: 'both' }); g.restore();
}, [[.4, 'celestaHold'], [0, 'silence']]);

// 113 · from behind him: they back away down the path, guns up
S('113', (t, d) => {
  cam(1, 960, 540);
  garden({ hole: true, hose: false });
  const back = seg(t, 0, d), x0 = 1200 + 500 * back, sc = 1 - .35 * back;
  for (const [dx, f] of [[0, MIA], [200, LEO], [400, DAN]]) f(x0 + dx * sc, GY - 30 * back, 380 * sc, dragP(-t * 4, .4), t, { face: -1, torch: dx === 200 ? 1 : 0, rifleA: Math.PI + .1 });
  lateLight(.45);
  cone([[x0 + 200 * sc - 30, GY - 300 * sc], [x0 + 200 * sc - 10, GY - 320 * sc], [GDX + 200, GY - 600], [GDX + 200, GY]], '#FFF7D6', .35);
  hero({ x: 520, gy: 1360, S: 1100, face: 1 }, breathe(CLAWP(), t, 0, .5), { ...INF8, claw: 1 });   // his back, over the shoulder
}, [[0, 'stepsAway', { d: 6 }]]);

// 114 · what they see: a monster in the doorway
S('114', (t, d) => {
  cam(1.6, GDX + GDW / 2 + 60, 470, Math.sin(t * 7) * 4, Math.cos(t * 6) * 3);
  garden({ hole: true, hose: false });
  hero({ ...ME7(), x: GDX + GDW / 2 + 60, S: 440 }, twitchP(CLAWP(), t, 2, 5), { ...INF8, claw: 1 });
  doorF(GDX - 4, GY, 40, GDH, 0, C.blue, 0); line([[GDX + 6, GY - GDH * .8], [GDX + 30, GY - GDH * .6]], C.red, 10);
  lateLight(.45); wash('#F2B8B0', .25);
  cone([[2100, 300], [2100, 700], [GDX + GDW / 2 - 300, GY], [GDX + GDW / 2 - 200, GY - 520]], '#FFF7D6', .45);
}, [[0, 'growlLow', { d: 6 }], [0, 'fearBreath', { d: 6 }]]);

// 115 · control room: he stops fighting; the panel lights go out, one by one
S('115', (t, d) => {
  cam(1.1, 960, 520);
  const off = Math.floor(clamp((t - 1.5) / 4.5) * 4.99), lamps = {}; for (let i = 0; i < 4; i++) lamps[i] = i < off ? 'off' : 'f';
  ctrlRoom(t, { threads: 1, taken: { 0: 1, 1: 1, 2: 1, 3: 1 }, lamps, view: (x, y, r) => { rect(x - r, y - r, 2 * r, 2 * r, '#7D7A90', { lw: 0 }); const b = seg(t, 0, d); for (const [dx, f] of [[-50, MIA], [10, LEO], [70, DAN]]) f(x + dx + 60 * b, y + r * .6, 150 * (1 - .4 * b), P({}), t, { torch: dx === 10 ? 1 : 0 }); } });
  littleMe(CR.wx, P({ la: -2.5, lb: -.2, ra: 2.5, rb: .2, head: .05 }), { S: 260 });
  wash('#1A1820', .12 * off);
}, [[1.5, 'lampOff'], [2.6, 'lampOff'], [3.7, 'lampOff'], [4.8, 'lampOff'], [0, 'strings', { d: 7 }]]);

// 116 · at the gate Mia turns back once; a small raised hand
S('116', (t, d) => {
  cam(1.9, 1700, 560);
  street({ hx: 520, sky: '#6D7AA0', neighbour: false, fence: false, trees: false, lampPost: 1500 }); fence(1400, 1900, GY, 70);
  const turn = ein(t, .6, .5), hand = bell(t, 1.6, 3.6), go = ein(t, 3.8, 1.5);
  MIA(1660 + 300 * go, GY, 380, go > 0 ? walkP(t * 6, .6) : P({ head: .3 * turn, ra: .4 + 1.1 * hand, rb: -.2 - .6 * hand, la: -.4, lb: .2 }), t, { face: go > 0 ? 1 : -1 });
  LEO(1800 + 300 * go, GY, 400, P({ la: -1.4 * (1 - go), lb: -.2, ra: .6, rb: -.2 }), t, { torch: 1, face: 1 });
  lateLight(.6);
}, [[.6, 'familyBroken'], [3.8, 'stepsAway', { d: 2 }]]);

// 117 · alone, his body turns by itself and lurches inside; the photo stays in the grass
S('117', (t, d) => {
  cam(1.1, 820, 560);
  garden({ hole: true, hose: false });
  const turn = ein(t, .6, .4), inn = ein(t, 1.4, 3.6);
  const S2 = 400 * (1 - .25 * inn);
  if (inn < .98) hero({ x: lerp(GDX + GDW / 2 + 460, GDX + GDW / 2, inn), gy: GY - 30 * inn, S: S2, prof: true, face: -1 }, dragP(t * 4.5, inn > 0 ? 1 : 0), { ...INF8, claw: .6 });
  photoP(1250, GY + 10, 1.4, -.12);
  lateLight(.7);
  if (inn > .5) { g.save(); g.globalAlpha = (inn - .5) * 1.4; rect(GDX, GY - GDH, GDW, GDH, '#15141A', { lw: 0 }); g.restore(); }
}, [[0, 'dragSteps', { d: 5 }], [5.0, 'silence']]);

// 118 · pull back: the house, the street, the other infected; the torch beam shrinks away
S('118', (t, d) => {
  const u = ss(seg(t, 0, d)); cam(lerp(1, .5, u), lerp(960, 960, u), lerp(540, -100, u));
  rect(-3000, -3000, 8000, 3200, '#3E4870', { lw: 0 });
  g.save(); g.translate(-1300, 0); street({ hx: 520, sky: '#3E4870', fence: false, neighbour: true }); g.restore();
  street({ hx: 520, sky: '#3E4870', fence: false, moon: false, lampPost: 1200 });
  g.save(); g.translate(1900, 0); street({ hx: 520, sky: '#3E4870', fence: false }); g.restore();
  for (let i = 0; i < 6; i++) hero({ x: -900 + i * 520 + 30 * t, gy: GY, S: 360, prof: true, face: 1, seed: i + 11 }, dragP(t * 3.8 + i, .9), { veins: 1, stalks: 1, arms: 'both' });
  night(1);
  const tx = lerp(2400, 3600, u); cone([[tx, GY - 260], [tx + 20, GY - 280], [tx + 500, GY], [tx + 200, GY]], '#FFF7D6', .5 * (1 - u * .6));
  const r = mulberry(5); for (let i = 0; i < 60; i++) circ(-2000 + r() * 6000, -2600 + r() * 2500, 3, '#E9E6D2', { lw: 0 });
  circ(1600, -900, 60, '#E9E6D2', { lw: 6 });
  SUBDARK = true;
}, [[0, 'wind', { d: 7 }], [0, 'shuffle', { d: 7 }]]);

// 119 · the last window: the little you still sits at it as the view dims
S('119', (t, d) => {
  cam(lerp(1, 1.3, seg(t, 0, d)), CR.wx, lerp(560, 420, seg(t, 0, d)));
  ctrlRoom(t, { threads: 1, taken: { 0: 1, 1: 1, 2: 1, 3: 1 }, lamps: { 0: 'off', 1: 'off', 2: 'off', 3: 'off' }, dim: lerp(.2, .9, seg(t, 0, d)), view: (x, y, r) => { rect(x - r, y - r, 2 * r, 2 * r, '#3E4870', { lw: 0 }); const r2 = mulberry(2); for (let i = 0; i < 20; i++) circ(x - r + r2() * 2 * r, y - r + r2() * r, 2, '#E9E6D2', { lw: 0 }); } });
  littleMe(CR.wx, P({ hy: .16, lfx: .1, rfx: .14, la: -2.5, lb: -.2, ra: 2.5, rb: .2, head: .1 }), { S: 260 });
  wash('#0E0D12', .55 + .35 * seg(t, 0, d));
  if (t > d - .05) { scr(); g.fillStyle = '#000'; g.fillRect(0, 0, W, H); }
}, [[0, 'heartSlow', { d: 6 }], [6.8, 'cutBlack']]);

// 120 · the quote on ink
S('120', (t, d) => {
  scr(); g.fillStyle = '#24242C'; g.fillRect(-10, -10, W + 20, H + 20); cam(1);
  SUBDARK = true;
  const a = LT('n6'), b = WT('n6', "it's");
  Tx('“Perhaps the worst part of becoming a zombie', 124, 420, { size: 60, w: 600, col: C.paper, track: -1 }, t, a, d - .8);
  Tx('isn’t losing your humanity.', 124, 500, { size: 60, w: 600, col: C.paper, track: -1 }, t, a + 1.4, d - .8);
  Tx('It’s being forced to watch yourself lose it.”', 124, 620, { size: 60, w: 600, col: C.ginger, track: -1 }, t, b - .1, d - .8);
  Lb('Curious Mind  ·  What if?  Episode 2', 124, 760, t, b + 3.0, d - .5, { col: '#8E8A84' });
});
