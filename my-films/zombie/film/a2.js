// Act 2 · first symptoms (Day 1)
// a big arm from off-screen to a hand point (close-ups): root (off-screen) → hand, fingers fanned
function bigArm(root, hand, w = 26, fingers = 4, spread = .25, dir = null, col = C.ink) {
  const mid = [lerp(root[0], hand[0], .55) + (hand[1] - root[1]) * .08, lerp(root[1], hand[1], .55) - (hand[0] - root[0]) * .08];
  g.save(); g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.beginPath(); g.moveTo(...root); g.quadraticCurveTo(...mid, ...hand); g.stroke(); g.restore();
  const a = dir ?? Math.atan2(hand[1] - mid[1], hand[0] - mid[0]);
  for (let i = 0; i < fingers; i++) { const b = a + (i - (fingers - 1) / 2) * spread; line([hand, [hand[0] + Math.cos(b) * w * 2.2, hand[1] + Math.sin(b) * w * 2.2]], col, w * .62); }
}

// 013 · the alarm: two misses, the third knocks it off
S('013', (t, d) => {
  const ns = bp(545, 330); cam(2.0, ns[0] - 40, ns[1] - 60);
  bedroomF(BED_DAY);
  const hits = [.8, 1.6, 2.5], off = t > 2.5, fly = clamp((t - 2.5) / .6);
  const cx = ns[0] - 30 + (off ? -260 * fly : 0), cy = ns[1] + (off ? 420 * fly * fly - 120 * fly : 0);
  withRot(cx, cy, off ? -fly * 2.5 : 0, () => alarmClock(cx, cy, 1, off ? 0 : t, '7:02'));
  let hx = ns[0] - 400, hy = ns[1] - 140;
  const tgt = [[ns[0] - 160, ns[1] - 10], [ns[0] + 120, ns[1] - 10], [ns[0] - 40, ns[1] - 60]];
  for (let i = 0; i < 3; i++) { const u = bell(t, hits[i] - .35, hits[i] + .25); if (u > 0) { hx = lerp(ns[0] - 420, tgt[i][0], u); hy = lerp(ns[1] - 160, tgt[i][1], u); } }
  bigArm([ns[0] - 900, ns[1] - 300], [hx, hy], 14, 4, .3);
  Lb('Day 1  ·  7:02 a.m.', ns[0] - 420, ns[1] - 260, t, .2, d, {});
}, [[0, 'ring', { d: 2.5 }], [.8, 'slap'], [1.6, 'slap'], [2.5, 'slap'], [3.0, 'bonk']]);

// 014 · sitting on the edge of the bed, swaying
S('014', (t, d) => {
  camTilt(1.15, 900, 520, sway(t, 3, .45));
  bedroomF(BED_DAY);
  const rub = Math.sin(t * 6) * .3 * ein(t, .6, .3), p = P({ hy: .2, lfx: -.04, rfx: .06, la: -.5, lb: .4, ra: 2.3 + rub, rb: 1.6, head: .2 + .12 * Math.sin(t * 2.6), lean: .06 * Math.sin(t * 2.6) });
  hero({ x: 820, gy: 850, S: 520 }, p);
  shape(() => g.ellipse(700, 870, 40, 14, 0, 0, Math.PI * 2), C.pink, { lw: 4 }); shape(() => g.ellipse(940, 872, 40, 14, 0, 0, Math.PI * 2), C.pink, { lw: 4 });
}, [[0, 'tinnitus', { d: 4 }]]);

// 015 · brushing teeth; the reflection lags and doubles
S('015', (t, d) => {
  cam(1.05, 960, 470);
  const brush = Math.sin(t * 14) * .12 * (t < 2.0 || t > 3.6 ? 1 : 0), lean = ein(t, 2.0, .5) * eout(t, 3.6, .4);
  const pr = t2 => P({ ra: .7 + brush, rb: -2.25, la: -.4, lb: .3, head: .05 + .2 * lean, lean: .03 * lean });
  bathroom({ lightOff: t > 2.6 && t < 2.75, reflect: (mx, my, mw, mh) => {
    const dbl = ein(t, 2.1, .3) * eout(t, 3.5, .3), lag = .25;
    if (dbl > 0) { g.save(); g.globalAlpha = .45 * dbl; hero({ x: mx + mw / 2 + 34 * dbl, gy: my + mh + 330, S: 560, face: -1 }, pr(t - lag)); g.restore(); }
    const j = hero({ x: mx + mw / 2, gy: my + mh + 330, S: 560, face: -1 }, pr(t - lag * dbl));
    const h = handR(j); line([h, [h[0] - 20, h[1] - 50]], C.blue, 10);
  } });
  const j = hero({ x: 380, gy: 1320, S: 980, face: 1 }, pr(t));     // you, over the shoulder
  if (t > 2.6 && t < 2.75) wash('#556070', .35);
}, [[0, 'brush', { d: 2 }], [2.6, 'neon'], [3.6, 'brush', { d: 1.4 }]]);

// 016 · the coffee misses the cup
S('016', (t, d) => {
  const tilt = ss(seg(t, 2.6, 3.4)); cam(lerp(1.7, 1.15, tilt), lerp(1080, 980, tilt), lerp(600, 500, tilt));
  kitchen({ fx: 300 });
  const pour = ein(t, .4, .4);
  const j = hero({ x: 950, gy: GY, S: 440 }, breathe(P({ ra: .75 + .25 * pour, rb: .5, la: -.4, lb: .2, head: .25 + .05 * pour }), t));
  const h = handR(j); withRot(h[0], h[1], .6 * pour, () => { rrect(h[0] - 10, h[1] - 20, 80, 90, 14, '#3A4052'); rect(h[0] + 70, h[1] - 6, 20, 14, '#3A4052', { lw: 3 }); });
  cup(1150, 640, 1.3);
  if (pour > .5 && t < 3.3) { line([[h[0] + 80, h[1] + 30], [1110, 640]], C2.coffee, 9); }
  const pud = clamp((t - .9) / 2.4); if (pud > 0) { shape(() => g.ellipse(1100, 642, 30 + 140 * pud, 6 + 6 * pud, 0, 0, Math.PI * 2), C2.coffee, { lw: 3 }); for (let i = 0; i < 3; i++) if (pud > .5) { const u = ((t * 1.4) + i / 3) % 1; circ(1180 + i * 40, 650 + u * 220, 6, C2.coffee, { lw: 2 }); } }
  if (t > 3.3) shockLines(j, 440, t, 3.3, .6);
}, [[.5, 'pour', { d: 2.8 }], [3.3, 'jolt']]);

// 017 · outside: the sun is too bright
S('017', (t, d) => {
  const pov = t > 3.2; cam(pov ? 1.3 : 1, pov ? 1500 : 760, pov ? 420 : 540);
  street({ sun: 1 + Math.sin(t * 6) * .5, sunX: 1500, hx: 520, hs: 1.6 });
  const step = ein(t, .2, .8), shield = ein(t, 1.0, .3);
  const p = lerpPose(walkP(t * 6, .7), P({ ra: 2.6, rb: 1.7, la: -.6, lb: .3, lean: -.12, head: -.25, hy: .015 }), shield);
  hero({ x: lerp(560, 760, step), gy: GY, S: 420 }, p);
  glare(lerp(.4, pov ? 1.4 : .9, ein(t, .9, .4)));
  if (pov) wash('#FFFDF0', .35 + .15 * Math.sin(t * 9), 'screen');
}, [[.2, 'door'], [.4, 'birds', { d: 4.6 }], [1.0, 'glare']]);

// 018 · the café menu swims
S('018', (t, d) => {
  const back = ss(seg(t, 2.4, 3.2)); cam(lerp(2.2, 1, back), lerp(1270, 960, back), lerp(285, 540, back));
  cafe({ swim: 1 - back * .3, t });
  const bar = person({ x: 1760, gy: GY, S: 400, face: -1 }, breathe(P({ la: -.8, lb: -.9, ra: .4, rb: -.2 }), t, 1));
  const j = hero({ x: 1180, gy: GY, S: 420 }, breathe(poseAt([[0, P({ head: -.2 })], [3.6, P({ ra: 1.9, rb: .2, head: -.15 })]], t), t));
  Lb('Barista', 1700, 420, t, 2.8, d);
}, [[0, 'cafe', { d: 5 }], [3.6, 'tap']]);

// 019 · with Leo; the head droops, the snap
S('019', (t, d) => {
  cam(1.08, 960, 560);
  cafe({ counter: false });
  const snap = LT('d01') + 1.4;
  const talk = Math.sin(t * 5) * .4 * (t < snap - .4 ? 1 : 0);
  const lp = t < snap - .2 ? P({ ra: 1.4 + talk, rb: -.6 - talk, la: -1.1 - talk * .5, lb: .7, head: -.1 + .05 * talk }) : P({ ra: 1.75, rb: -.3, la: -.4, lb: .2, head: .25 });
  const sn = bell(t, snap - .1, snap + .3);
  rect(1360, 700, 30, 180, C2.wood, { lw: 4 }); withRot(1430, GY, -.3, () => { rrect(1400, 600, 40, 280, 18, '#E0574A'); for (const y of [640, 840]) circ(1420, y, 14, C.ink, { lw: 0 }); });   // the skateboard
  person({ x: 1250, gy: GY, S: 420, face: -1 }, breathe(lpose(lp, sn), t, 2));
  const droop = ein(t, .8, 2.2) * (1 - ein(t, snap, .15));
  hero({ x: 700, gy: GY, S: 420 }, P({ head: .1 + .55 * droop, lean: .1 * droop, hy: .03 * droop, la: -.3, lb: .2, ra: .3, rb: -.2 }));
  if (t > snap) shockLines({ Hd: joints({ x: 700, gy: GY, S: 420 }, P({}))?.Hd }, 420, t, snap, .5);
  tableP(820, 1130, 690, GY, 40);
  cup(900, 690, 1); cup(1060, 690, 1);
  pointer('Leo, best friend', 1480, 560, 1290, 600, t, .4, d);
  popText('*snap*', 1050, 470, t, snap, { size: 34, col: C.ink }, snap + .8);
  function lpose(p, k) { return k > 0 ? lerpPose(p, P({ ra: 1.6, rb: -1.6, la: -.4, lb: .2, head: -.05 }), k) : p; }
}, [[0, 'cafe', { d: 6 }], [LT('d01') + 1.4, 'snap']]);

// 020 · the finger taps on its own
S('020', (t, d) => {
  cam(1);
  rect(-100, -100, 2200, 1300, C2.woodL, { lw: 0 }); for (let i = 0; i < 14; i++) ink([[-100, 80 + i * 75], [700, 90 + i * 75 + Math.sin(i) * 12], [1400, 78 + i * 75], [2100, 86 + i * 75]], { w: 2, col: '#B9834F', amp: .6 });
  shape(() => g.ellipse(1350, 300, 110, 40, 0, 0, Math.PI * 2), null, { lw: 6, col: '#9A6337' });   // a coffee ring
  const tap = t < 2.4 ? Math.max(0, Math.sin(t * 16)) : 0;
  const hand = [900, 640];
  bigArm([400, 1300], hand, 30, 0);
  shape(() => g.ellipse(hand[0], hand[1], 90, 60, -.2, 0, Math.PI * 2), C.paper, { lw: 8 });
  for (let i = 0; i < 3; i++) line([[hand[0] + 40 + i * 6, hand[1] - 30 + i * 26], [hand[0] + 120 + i * 4, hand[1] - 40 + i * 30]], C.ink, 12);
  const fx = hand[0] + 50, fy = hand[1] - 40; line([[fx, fy], [fx + 130, fy - 50 - 50 * tap]], C.ink, 13);
  if (tap > .9) popText('tok', fx + 160, fy - 100, t, t - .01, { size: 30, col: C.mute });
  const cover = ein(t, 2.4, .35); if (cover > 0) bigArm([1900, 1300], [lerp(1900, fx + 80, cover), lerp(1300, fy - 20, cover)], 30, 4, .3);
}, [[.1, 'tap'], [.5, 'tap'], [.9, 'tap'], [1.3, 'tap'], [1.7, 'tap'], [2.1, 'tap'], [2.4, 'thud']]);

// 021 · dizzy on the way home: he holds on to the fence
S('021', (t, d) => {
  const r = sway(t, 5, .5); camTilt(1.1, 960, 560, r);
  const dbl = .35 * (.5 + .5 * Math.sin(t * 2.2));
  g.save(); g.globalAlpha = dbl; g.translate(28, 6); street({ hx: 520, fence: false, sky: '#F4D9B8' }); g.restore();
  street({ hx: 520, sky: '#F4D9B8', f2: 700, f3: 1500 });
  const hold = ein(t, 1.4, .5);
  const p = lerpPose(dragP(t * 5, .7), P({ hy: .08, la: .9, lb: -.5, ra: 1.3, rb: .1, lean: .25, head: .45 }), hold);
  hero({ x: lerp(500, 900, ss(seg(t, 0, 1.5))), gy: GY, S: 420, prof: true, face: 1 }, p);
  dusk(.8);
}, [[0, 'heartbeatHi', { d: 5 }]]);

// 022 · POV: the fence posts swim
S('022', (t, d) => {
  cam(1.6, 1100, 760);
  for (let k = 0; k < 2; k++) { g.save(); g.globalAlpha = k ? .45 : 1; g.translate(k ? 30 * Math.sin(t * 3) : 0, k ? 8 : 0); street({ hx: 520, sky: '#F4D9B8', f2: 700, f3: 1600, neighbour: false, treeX: 1300 }); g.restore(); }
  dusk(.8);
}, [[0, 'slowdown', { d: 3 }]]);

// 023 · thermometer, then the search
S('023', (t, d) => {
  const ph = t < 2 ? 0 : t < 3.6 ? 1 : 2;
  if (ph === 0) { cam(1.05, 900, 560); livingroom({ win: 'dusk', door: false }); const j = hero({ x: 640, gy: GY - 110, S: 400, prof: true, face: 1 }, breathe(P({ hy: .2, lfx: .36, rfx: .44, lfy: .02, rfy: .02, la: -.4, lb: .3, ra: .5, rb: -2.0, lean: .03, head: .1 }), t));
    const h = handR(j); line([h, [h[0] + 40, j.Hd[1] + 8]], C2.white, 10); line([h, [h[0] + 40, j.Hd[1] + 8]], C.ink, 3); dusk(.5); }
  else if (ph === 1) { cam(1); rect(-100, -100, 2200, 1300, K.lilac, { lw: 0 }); bigArm([700, 1300], [900, 760], 34, 4, .3); thermo(980, 640, 2.6, '39.4 °C', true); bigNumber('39.4 °C', 1260, 520, t, 2.3, C.red, 110); }
  else { cam(1); rect(-100, -100, 2200, 1300, K.lilac, { lw: 0 }); const q = 'dizzy blurry finger twitch', n = Math.floor(clamp((t - 3.7) / 1.2) * q.length);
    bigPhone(660, 120, 600, 760, (x, y, w, h) => { rrect(x + 30, y + 40, w - 60, 70, 35, '#EEF1F3', { lw: 3 }); text(q.slice(0, n) + (Math.floor(t * 3) % 2 ? '|' : ''), x + 60, y + 86, { size: 28, w: 500 });
      if (t > 5.0) { const k = ein(t, 5.0, .3); g.save(); g.globalAlpha = k; text('Top result', x + 40, y + 180, { size: 22, w: 500, col: C.mute }); text('Probably just tired.', x + 40, y + 230, { size: 38, w: 600, col: C.blue }); for (let i = 0; i < 4; i++) rect(x + 40, y + 290 + i * 70, w - 80 - i * 60, 24, '#E4E7EA', { lw: 0 }); g.restore(); } }); }
}, [[0.4, 'beepT'], [2.3, 'beepT'], [3.7, 'typing', { d: 1.2 }], [5.0, 'blip']]);

// 024 · the pill, the glass shakes
S('024', (t, d) => {
  const dive = ss(seg(t, 2.8, d)); cam(lerp(1, 7, dive * dive), lerp(960, 960, dive), lerp(560, 620, dive));
  rect(-100, -100, 2200, 1300, K.lilac, { lw: 0 }); rect(-100, 860, 2200, 400, C2.woodL);
  pills(1450, 850, 1.6);
  const shk = Math.sin(t * 40) * 6 * ein(t, .6, .3);
  const gx = 960 + shk, gy2 = 820 - 120 * ein(t, .8, .6);
  bigArm([420, 1300], [gx - 70, gy2 - 60], 30, 0); glassW(gx, gy2, 2.4, .7, t);
  for (let i = 0; i < 4; i++) line([[gx - 70, gy2 - 60 - i * 14], [gx - 40, gy2 - 70 - i * 14]], C.ink, 14);
  if (t > 1.6 && t < 2.6) popText('clink', 1150, 300, t, 1.6, { size: 34, col: C.mute }, 2.6);
  if (dive > .6) { scr(); g.save(); g.globalAlpha = (dive - .6) / .4; g.fillStyle = C.paper; g.fillRect(0, 0, W, H); g.restore(); }
}, [[.6, 'glassShake', { d: 1.6 }], [1.6, 'clink'], [2.8, 'gulp']]);

// 025 · inside: spores wake in the stomach
S('025', (t, d) => {
  const pull = ss(seg(t, .2, 2.6)); cam(lerp(3.2, 1, pull), lerp(960, 960, pull), lerp(640, 540, pull));
  const B = tubeFig({ x: 960, gy: 900, S: 740 }, P({ la: -.45, lb: .15, ra: .45, rb: -.15 }));
  const belly = qpt(B.j.Hp, B.j.Cc, B.j.N, .35);
  const r = mulberry(14); for (let i = 0; i < 9; i++) { const a = r() * 6.28, dd = r() * 22, x = belly[0] + Math.cos(a) * dd, y = belly[1] + Math.sin(a) * dd, wob = Math.sin(t * 9 + i) * 2 * ein(t, 1.2, .3);
    circ(x + wob, y, 7, C.ginger, { lw: 2 }); if (t > 2.4 + i * .1) ink([[x, y], [x + Math.cos(a) * 14, y + Math.sin(a) * 14], [x + Math.cos(a + .5) * 24, y + Math.sin(a + .5) * 24]], { w: 3, col: C.ginger, amp: .4 }); }
  pointer('spore', belly[0] + 160, belly[1] - 120, belly[0] + 30, belly[1] - 14, t, 2.6, d);
  label('Inside you  ·  Day 1, evening', 124, 150);
}, [[1.2, 'fungus'], [2.4, 'glock', { n: 3 }]]);

// 026 · hyphae spread through the body like roots
S('026', (t, d) => {
  const toWin = ss(seg(t, d - 1.0, d));
  cam(lerp(1, 1.5, toWin), lerp(960, 1200, toWin), lerp(540, 420, toWin));
  const B = tubeFig({ x: 960, gy: 900, S: 740 }, P({ la: -.45, lb: .15, ra: .45, rb: -.15 }));
  hyphaeBody(B, seg(t, .1, d - 1.4), t);
  pointer('hyphae', 1300, 300, 1080, 470, t, 1.0, d - .8);
  label('Inside you  ·  Day 1, night', 124, 150);
  if (toWin > 0) { scr(); g.save(); g.globalAlpha = toWin; g.fillStyle = '#5B6B90'; g.fillRect(0, 0, W, H); g.restore(); }
}, [[.3, 'grow', { d: 5.5 }], [.5, 'glock', { n: 8 }]]);

// 027 · a restless night (top-down), then morning
S('027', (t, d) => {
  cam(1.05, 900, 560);
  bedroomF(BED_DAY);
  sleeper(t, 1);
  alarmClock(bp(545, 330)[0] - 30, bp(545, 330)[1], .9, 0, t < 3.5 ? '11:40' : '6:58');
  night(1 - ein(t, 3.6, 1.0));
  if (t < 3.6) cone([[bp(520, 60)[0], bp(520, 60)[1]], [bp(720, 60)[0], bp(720, 60)[1]], [bp(500, 520)[0], bp(500, 520)[1]], [bp(260, 520)[0], bp(260, 520)[1]]], '#C9D8FF', .16);
  stamp('', 0, 0, t, 0);
}, [[0, 'tick', { d: 4, rate: 3 }], [.5, 'rustle'], [1.6, 'rustle'], [2.6, 'rustle'], [3.8, 'morning']]);
