// Act 6 · other people (Day 7)
const INF6 = { veins: .85, hood: 1, stalks: .8, arms: 'both' };
const DOORX = 520 - 230 * 1.25 + 275 * 1.25 - 20;          // the front door of the house drawn at hs 1.25
const MIA = (x, gy, S, p, t, o = {}) => person({ x, gy, S, face: o.face ?? -1 }, breathe(p, t, 1), { bag: 1, ...o });
const LEO = (x, gy, S, p, t, o = {}) => person({ x, gy, S, face: o.face ?? -1 }, breathe(p, t, 2), { bat: 1, ...o });
const DAN = (x, gy, S, p, t, o = {}) => person({ x, gy, S, face: o.face ?? -1 }, breathe(p, t, 3), { rifle: 1, ...o });
function binTipped(x, gy) { withRot(x, gy - 40, 1.45, () => binP(x, gy + 30, 0)); for (let i = 0; i < 4; i++) shape(() => g.ellipse(x + 80 + i * 50, gy - 6, 20, 8, i, 0, Math.PI * 2), C2.white, { lw: 3 }); }

// 076 · an empty street
S('076', (t, d) => {
  cam(1.02 + .02 * seg(t, 0, d), 960 + 40 * seg(t, 0, d), 540);
  street({ hx: 520, hs: 1.25, fence: false, f2: 900, f3: 1300, sky: '#DCE6EA' });
  fence(900, 1300, GY, 70);
  binTipped(1420, GY);
  const r = mulberry(7); for (let i = 0; i < 4; i++) { const x = (r() * 2000 + t * 260 * (1 + r())) % 2200 - 100, y = 700 + r() * 150 + Math.sin(t * 3 + i) * 20; withRot(x, y, t * 2 + i, () => rect(x - 20, y - 14, 40, 28, C2.white, { lw: 3 })); }
  withRot(1300, GY - 70, Math.sin(t * 1.5) * .3, () => rect(1300, GY - 70, 80, 70, null, { lw: 5 }));
  Lb('Day 7', 124, 150, t, .2, d, { col: C.ink });
}, [[0, 'wind', { d: 5 }], [1.0, 'gateCreak']]);

// 077 · knocking; he freezes
S('077', (t, d) => {
  cam(1);
  livingroom({ doorX: 120, sofaX: 220, tv: false, lampX: 1500, blinds: 1 });
  for (let i = 0; i < 4; i++) box(160 + (i % 3) * 180, GY - 230 - Math.floor(i / 3) * 150, 170, 140, { label: false });
  const knocks = [.3, .6, .9]; let jig = 0; for (const k of knocks) jig += bell(t, k, k + .12) * 3;
  g.save(); g.translate(jig, 0); doorF(120, GY, 190, 440, 0); g.restore();
  const freeze = ein(t, .3, .1);
  hero({ x: 1150, gy: GY, S: 430 }, lerpPose(breathe(P({ la: -.3, lb: .2, ra: .3, rb: -.2 }), t), P({ la: -.8, lb: -.6, ra: .5, rb: -.2, head: -.4, hy: .015 }), freeze), INF6);
  bubble('Hello? Anyone in there?', 260, 300, 200, 360, t, LT('d08'), LE('d08') + .8);
  for (const k of knocks) popText('knock', 300, 520, t, k, { size: 30, col: C.mute }, k + .5);
}, [[.3, 'knock'], [.6, 'knock'], [.9, 'knock']]);

// 078 · peeking through the blinds: a stranger with a crowbar
S('078', (t, d) => {
  cam(1);
  street({ hx: 1500, hs: 1, sky: '#DCE6EA', neighbour: false, f2: 400, f3: 900 });
  const x = lerp(300, 900, seg(t, 0, d));
  DAN(x, GY, 420, walkP(t * 6, .6), t, { rifle: 0, face: 1 });
  line([[x + 40, 640], [x + 60, 820]], C2.chrome, 10);
  pointer('Dan, survivor', x + 120, 420, x + 40, 480, t, 1.0, d);
  // the blind slats in front
  scr(); for (let y = -20; y < H; y += 70) { rect(-10, y, W + 20, 48, '#EEE7D8', { lw: 3 }); } line([[960, 0], [960, H]], '#D8CFBD', 4);
}, [[.2, 'gravel', { d: 4.6 }]]);

// 079 · nails scrape the window sill
S('079', (t, d) => {
  cam(1);
  rect(-100, -100, 2200, 1300, K.lilac, { lw: 0 }); rect(-100, 560, 2200, 80, C2.white); rect(-100, 640, 2200, 30, C2.wood);
  for (let y = 0; y < 540; y += 70) rect(300, y, 1320, 48, '#EEE7D8', { lw: 3 });
  const pull = ein(t, .4, .8), sc = clamp((t - 1.2) / 2.2);
  for (let i = 0; i < 4; i++) { const x0 = 760 + i * 70; ink([[x0, 600], [x0 + 20, 605], [x0 + 40 + 120 * sc, 612]], { w: 3, col: '#9A6337' }); }
  const hx = 1000 + 140 * sc; bigArm([1200, 1300], [hx, 600], 34, 4, .3, -1.8);
  for (let i = 0; i < 3; i++) ink([[1150 - i * 40, 1100], [1080 - i * 40, 900]], { w: 4, col: C.ginger });
}, [[1.2, 'scratch', { d: 2.2 }], [.4, 'heartbeat']]);

// 080 · door wars: pushed from both sides (cross-cut)
S('080', (t, d) => {
  const beats = [.4, 1.3, 2.1, 2.8, 3.4, 3.9, 4.4, 4.8, 5.2], i = beats.filter(b => t >= b).length, out = i % 2 === 1;
  const hit = beats[Math.max(0, i - 1)] || 0, [sx, sy] = shake(t, hit, 9, .25);
  if (out) { cam(1.2, 600, 560, sx, sy); street({ hx: 520, hs: 1.25, sky: '#DCE6EA', fence: false });
    DAN(DOORX - 30, GY, 400, P({ lean: .3, ra: 1.0, rb: -.3, la: .8, lb: -.5, hy: .02, lfx: -.16, rfx: -.06 }), t, { rifle: 0, face: 1 }); }
  else { cam(1.1, 500, 560, sx, sy); livingroom({ doorX: 120, sofaX: 260, tv: false, lampX: 1500 }); for (let k = 0; k < 4; k++) box(200 + (k % 3) * 180, GY - 230 - Math.floor(k / 3) * 150, 170, 140, { label: false });
    hero({ x: 930, gy: GY, S: 430, prof: true, face: -1 }, P({ lean: -.3, ra: -1.0, rb: .3, la: -.8, lb: .5, hy: .02, lfx: .16, rfx: .06 }), INF6); }
}, [[.4, 'thump'], [1.3, 'thump'], [2.1, 'thump'], [2.8, 'thump'], [3.4, 'thump'], [3.9, 'thump'], [4.4, 'thump'], [4.8, 'thump'], [5.2, 'thump']]);

// 081 · he sprays a red X on the door and leaves
S('081', (t, d) => {
  cam(1.25, 600, 520);
  street({ hx: 520, hs: 1.25, sky: '#DCE6EA', fence: false });
  doorF(DOORX, GY, 130, 230, 0, C.blue, 0);
  const xk = seg(t, .6, 2.2); if (xk > 0) { const cx = DOORX + 65, cy = GY - 150; g.save(); g.lineCap = 'round'; g.strokeStyle = C.red; g.lineWidth = 12; g.beginPath(); g.moveTo(cx - 45, cy - 55); g.lineTo(cx - 45 + 90 * clamp(xk * 2), cy - 55 + 110 * clamp(xk * 2)); g.stroke(); if (xk > .5) { g.beginPath(); g.moveTo(cx + 45, cy - 55); g.lineTo(cx + 45 - 90 * clamp(xk * 2 - 1), cy - 55 + 110 * clamp(xk * 2 - 1)); g.stroke(); } g.restore(); }
  const leave = ein(t, 2.6, 2), x = lerp(DOORX + 230, 1600, leave);
  const j = DAN(x, GY, 400, leave > 0 ? walkP(t * 6, .7) : P({ ra: 1.5 + .4 * Math.sin(t * 6) * (xk < 1 ? 1 : 0), rb: .1, la: -.4, lb: .2 }), t, { rifle: 0, face: leave > 0 ? 1 : -1 });
  if (leave <= 0) { const h = handR(j); sprayCan(h[0], h[1], .8, 1.6); }
}, [[.6, 'spray', { d: 1.6 }]]);

// 082 · infected people shuffle past — then stop together at a sound
S('082', (t, d) => {
  cam(1.05, 960, 540);
  street({ hx: 520, hs: 1.25, sky: '#C9D0D4', fence: false, f2: 700, f3: 1500 }); fence(700, 1500, GY, 70);
  const stop = 3.0, js = [];
  for (let i = 0; i < 5; i++) { const sp2 = 70 + i * 9, x = -200 + i * 230 + sp2 * Math.min(t, stop) + (t > stop ? 0 : 0), ph = t * 4 + i * 1.7;
    const p = t < stop ? dragP(ph, .9) : poseJerk([[0, dragP(stop * 4 + i * 1.7, .9)], [stop + .02 * i, P({ head: .5, la: -.2, ra: .2, lean: .05 })]], t);
    js.push(hero({ x, gy: GY, S: 380 + (i % 2) * 30, prof: true, face: 1, seed: i + 3 }, p, { veins: 1, stalks: 1, arms: 'both' })); }
  const cx = 1300 + 300 * clamp((t - 2.8) * 2), cy = GY - 10; withRot(cx, cy, t * 6, () => rect(cx - 16, cy - 22, 32, 44, C.red, { lw: 4 }));
  gloom(.6);
}, [[0, 'shuffle', { d: 6 }], [2.8, 'canRoll'], [3.0, 'silence']]);

// 083 · one of them looks at him through the glass
S('083', (t, d) => {
  cam(1.3, 960, 500);
  rect(-100, -100, 2200, 1300, K.lilac, { lw: 0 }); rect(500, 140, 920, 700, '#DCE6EA'); line([[960, 140], [960, 840]], C2.wood, 16); rect(500, 140, 920, 700, null, { lw: 18, col: C2.wood });
  g.save(); g.beginPath(); g.rect(500, 140, 920, 700); g.clip();
  const leave = ein(t, 4.2, 1.5);
  hero({ x: lerp(1180, 1600, leave), gy: 1000, S: 640, face: -1, seed: 9 }, P({ head: -.3 * ein(t, 2.4, .4), la: -.2, ra: .2, lean: -.04 }), { veins: 1, stalks: 1, arms: 'both' });
  g.globalAlpha = .3; poly([[520, 160], [700, 160], [520, 420]], '#FFFFFF', { lw: 0 }); g.restore();
  const wv = bell(t, 1.4, 3.0);
  hero({ x: 640, gy: 1040, S: 700, face: 1 }, P({ ra: .3 + 1.6 * wv, rb: -.2 - 1.2 * wv + .3 * Math.sin(t * 10) * wv, la: -.3, lb: .2 }), INF6);
  gloom(.6);
}, [[1.4, 'vibeLonely']]);

// 084 · under the table, Mr. Biscuits stays this time
S('084', (t, d) => {
  cam(1.1, 960, 700);
  rect(-100, -100, 2200, 1300, K.wallK, { lw: 0 }); ground(GY, -400, 2400);
  rect(400, 380, 1120, 40, C2.woodL); for (const x of [450, 1440]) { line([[x, 420], [x, GY]], C.ink, 30); line([[x, 420], [x, GY]], C2.wood, 18); for (let k = 0; k < 4; k++) circ(x, 480 + k * 100, 22, C2.wood, { lw: 5 }); }
  const pet = ein(t, 2.0, .6), stroke = Math.sin(t * 3) * pet;
  hero({ x: 820, gy: GY, S: 400 }, P({ hy: .24, lfx: .1, rfx: .14, la: .4, lb: -1.2, ra: .9 + .4 * pet + .1 * stroke, rb: -1.6 + 1.2 * pet, head: .4 + .1 * pet, lean: .2 }), INF6);
  const cx = 1120; catD(cx, GY, .45, { paw: false, mouth: 'closed' });
  if (t > 4.6) popText('!', cx + 40, 640, t, 4.7, { size: 50, col: C.ink });
  gloom(.4);
}, [[1.0, 'purr', { d: 4 }], [2.0, 'family']]);

// 085 · three people walk up the garden: Mia, Leo, Dan
S('085', (t, d) => {
  const ms = t > 3.0; cam(ms ? 1.35 : 1, ms ? 1350 : 960, ms ? 560 : 540);
  street({ hx: 520, hs: 1.25, sky: '#F4D9B8', fence: false });
  doorF(DOORX, GY, 130, 230, 0, C.blue, 1);
  const w = seg(t, 0, 3.2), x0 = lerp(2000, 1350, w);
  const jm = MIA(x0, GY, 400, w < 1 ? walkP(t * 7, .8) : P({ ra: .8, rb: -.3, la: -.5, lb: .2, lean: -.06 }), t);
  LEO(x0 + 220, GY, 400, w < 1 ? walkP(t * 7 + 1, .8) : P({ head: Math.sin(t * 2) * .4 }), t, { torch: 1 });
  DAN(x0 + 440, GY, 410, w < 1 ? walkP(t * 7 + 2, .8) : P({ ra: 1.0, rb: -.2, la: -1.7, lb: .1, head: .1 * Math.sin(t * 3) }), t, { rifleA: .5 });
  if (ms) { pointer('Mia, your sister', x0 - 150, 360, x0 - 10, 450, t, 3.2, d); pointer('Leo', x0 + 260, 330, x0 + 225, 440, t, 3.4, d); }
  dusk(.6);
}, [[0, 'stepsGroup', { d: 3.2 }]]);

// 086 · his name: he stands and steps toward it
S('086', (t, d) => {
  cam(lerp(1, 1.25, seg(t, 0, d)), 1000, 520);
  livingroom({ doorX: 120, sofaX: 260, tv: false, lampX: 1500, blinds: .9, win: 'dusk' });
  for (let k = 0; k < 4; k++) box(200 + (k % 3) * 180, GY - 230 - Math.floor(k / 3) * 150, 170, 140, { label: false });
  const up = ein(t, .6, .5), step = ein(t, 1.6, .8);
  hero({ x: lerp(1100, 1250, step), gy: GY, S: 430 }, lerpPose(PS.hug(), P({ lean: .1, head: -.15, la: -.4, lb: .2, ra: .5, rb: -.1 }), up), INF6);
  for (let i = 0; i < 6; i++) cone([[1194, 234 + i * 22], [1406, 234 + i * 22], [1500 + i * 30, 880], [1300 + i * 30, 880]], '#FFE2B8', .06);
  bubble("It's Mia! Are you in there?", 1250, 200, 1290, 250, t, LT('d09'), LE('d09') + .8);
  dusk(.5);
}, [[.6, 'stand']]);

// 087 · control room: Mia in the window; the mouth lever is wrapped tight
S('087', (t, d) => {
  cam(1.1, 960, 560);
  const jump = ein(t, .3, .3), look = ein(t, 2.4, .4);
  ctrlRoom(t, { threads: .75, taken: { 0: 1, 1: 1, 3: 1 }, notes: [[0, 'NO', 2], [1, 'MIA', 2], [2, 'LEO', 2], [3, "DON'T", 2]], view: (x, y, r) => { rect(x - r, y - r, 2 * r, 2 * r, '#F4D9B8', { lw: 0 }); MIA(x, y + r, 300, P({ ra: .8, rb: -.3 }), t); } });
  littleMe(lerp(960, 960, jump), lerpPose(P({ hy: .16, lfx: .1, rfx: .14, la: -.6, lb: .3, ra: .6, rb: -.3 }), look > 0 ? P({ ra: 1.5, rb: .1, la: -.4, lb: .2, head: .5 }) : P({ la: -2.6, lb: -.3, ra: 2.6, rb: .3, lfy: .05 * Math.sin(t * 12), rfy: .05 * Math.cos(t * 12) }), jump));
}, [[.3, 'hope'], [2.4, 'lever']]);

// 088 · "MI—" melts into a growl; outside, the rifle comes up
S('088', (t, d) => {
  const out = t > 2.0;
  if (!out) { cam(1.6, 1100, 440); livingroom({ doorX: 120, sofaX: 260, tv: false, lampX: 1500, blinds: .9, win: 'dusk' });
    const j = hero({ x: 1150, gy: GY, S: 460 }, poseJerk([[0, P({ lean: .1 })], [.9, P({ lean: .2, head: .3, hy: .01 })]], t), INF6);
    if (t < .9) text('MI—', j.Hd[0] + 90, j.Hd[1] - 40, { size: 60, w: 600, a: ein(t, .3, .2) }); else warpText('GRRAAH', j.Hd[0] + 90, j.Hd[1] - 40, t, .9, { size: 64, amp: 2.5 }); dusk(.4); }
  else { cam(1.1, 1300, 540); street({ hx: 520, hs: 1.25, sky: '#F4D9B8', fence: false }); doorF(DOORX, GY, 130, 230, 0, C.blue, 1);
    const up = ein(t, 2.4, .25);
    MIA(1300, GY, 400, P({ ra: 1.4, rb: 1.6, la: -.4, lb: .2, lean: -.06, head: -.1 }), t);
    LEO(1520, GY, 400, P({ head: -.2, la: -.3, lb: .2 }), t, { torch: 1 });
    DAN(1740, GY, 410, lerpPose(P({ ra: 1.0, rb: -.2, la: -1.7, lb: .1 }), P({ ra: -1.4, rb: -.2, la: -1.2, lb: -.4, head: -.1 }), up), t, { rifleA: lerp(.5, Math.PI + .05, up) });
    dusk(.6); }
}, [[.3, 'voiceTry'], [.9, 'growl'], [2.0, 'silence'], [2.4, 'cock']]);

// 089 · the torch beam hits him; he flinches from the light
S('089', (t, d) => {
  cam(1.1, 1000, 520);
  livingroom({ doorX: 120, sofaX: 260, tv: false, lampX: 1500, blinds: .9, win: 'dusk' });
  const on = t > .6, fl = ein(t, .7, .2);
  hero({ x: 1150, gy: GY, S: 440 }, lerpPose(P({ lean: .1 }), P({ ra: 2.4, rb: 1.7, la: -2.4, lb: -1.7, lean: -.2, head: -.4, hx: -.06 }), fl), INF6);
  dusk(.6); if (on) { night(.4); cone([[1200, 240], [1410, 240], [1500, 880], [800, 880]], '#FFF7D6', .55); }
}, [[.6, 'torchClick'], [.8, 'hiss']]);

// 090 · he pulls the barricade — too strong: the sofa flips, the door opens
S('090', (t, d) => {
  const hit = 1.4, [sx, sy] = shake(t, hit, 16, .4); cam(1, 800, 540, sx, sy);
  const fly = ein(t, hit - .2, .5), open = ein(t, 2.6, .8);
  livingroom({ doorX: 120, sofa: false, tv: false, lampX: 1500, blinds: .9, win: 'dusk', doorOpen: open });
  withRot(600, GY, -2.2 * fly, () => sofa(260 + 300 * fly, 880 + 300 * fly, GY - 60 * Math.sin(Math.PI * fly)));
  for (let k = 0; k < 4; k++) { const bx = 200 + (k % 3) * 180 + fly * (300 + k * 120), by = GY - 230 - Math.floor(k / 3) * 150 + fly * 200 - Math.sin(Math.PI * fly) * 200; withRot(bx, by, fly * (k - 1.5), () => box(bx, by + 140, 170, 140, { label: false })); }
  hero({ x: 1000, gy: GY, S: 440, prof: true, face: -1 }, poseJerk([[0, P({ lean: -.3, ra: -1.4, rb: 0, la: -1.2, lb: 0, hy: .03 })], [hit, P({ lean: .2, ra: .9, rb: .2, la: 1.0, lb: .2, hy: .01 })]], t), { ...INF6, claw: .6 });
  if (open > 0) cone([[120, GY - 440], [310, GY - 440], [900, GY], [120, GY]], '#FFE2B8', .4 * open);
  dusk(.4);
}, [[1.4, 'bigCrash'], [2.6, 'doorCreak']]);
