// Act 4 · losing control (Day 4–5)
const INF4 = { veins: .45, hood: 1, arms: 'R' };
function pizzaIcon(x, y, s = 1) { scaled(x, y, s, () => { poly([[x - 26, y - 30], [x + 26, y - 30], [x, y + 34]], '#F2C46A', { lw: 3 }); rect(x - 28, y - 36, 56, 10, '#D9984A', { lw: 3 }); for (const [a, b] of [[-8, -14], [8, -6], [0, 8]]) circ(x + a, y + b, 5, C.red, { lw: 0 }); }); }

// 043 · the hand drifts from the knife to the steak
S('043', (t, d) => {
  cam(1);
  rect(-100, -100, 2200, 1300, K.wallK, { lw: 0 }); rect(-100, 640, 2200, 60, C2.woodL); rect(-100, 700, 2200, 600, C2.wood, { lw: 0 });
  for (let x = 0; x < 2000; x += 46) dline([[x, 300], [x, 640]], '#BCD3CC');
  rect(500, 600, 520, 40, '#E8D2A8'); knife(640, 590, 1.4, 0); breadMoldy(900, 600, .9, 0, 0, K.wallK);
  steak(1450, 640, 1.8, ein(t, 1.4, 1.5) * .7);
  const drift = ss(seg(t, 1.0, 3.6)), hx = lerp(700, 1350, drift), hy = 560 - 60 * Math.sin(Math.PI * drift);
  bigArm([500, 1300], [hx, hy], 32, 4, .22, -1.2);
  if (drift > 0) for (let i = 0; i < 3; i++) ink([[hx - 160 + i * 30, hy + 200 - i * 40], [hx - 100 + i * 30, hy + 120 - i * 40]], { w: 3, col: C.ginger });
  Lb('Day 4', 124, 150, t, .2, d, { col: C.ink });
}, [[1.0, 'heartbeat'], [1.8, 'heartbeat'], [2.6, 'heartbeat']]);

// 044 · tug of war with his own arm
S('044', (t, d) => {
  const [sx, sy] = shake(t, 4.6, 8, .4); cam(1.05, 960, 540, sx, sy);
  kitchen({ fx: 300 });
  const tug = Math.sin(t * 3.2), drag = seg(t, .3, d) * 220;
  const p = P({ ra: 1.5 + .25 * tug, rb: .1, la: .9 + .2 * tug, lb: -1.0, lean: -.18 + .1 * tug, hy: .03, lfx: -.12, rfx: .06 });
  hero({ x: 1100 + drag - 60 * tug, gy: GY, S: 440, prof: true, face: 1 }, p, INF4);
  steak(1480, 640, 1, .6);
  const r = mulberry(6); for (let i = 0; i < 3; i++) { const tf = 1.6 + i * 1.2, u = clamp((t - tf) / .6); const x = 1250 + i * 70, y = 640 + u * u * 240; withRot(x, y, u * 3 * (i % 2 ? 1 : -1), () => i === 1 ? rect(x - 22, y - 50, 44, 50, C.blue) : plate(x, y, .8)); }
}, [[.3, 'struggle', { d: 5.5 }], [2.2, 'clatter'], [3.4, 'clatter'], [4.6, 'clatter']]);

// 045 · the plates shatter; he sits down hard
S('045', (t, d) => {
  const [sx, sy] = shake(t, .1, 12, .35); cam(1, 960, 540, sx, sy);
  kitchen({ fx: 300 });
  const sit = ein(t, .6, .4);
  hero({ x: 1150, gy: GY, S: 440 }, lerpPose(P({ la: -1.1, lb: -1.2, ra: 1.1, rb: 1.2 }), P({ hy: .24, lfx: -.18, rfx: .22, la: -.6, lb: .4, ra: .6, rb: -.4, head: .4 }), sit), INF4);
  const r = mulberry(16); for (let i = 0; i < 12; i++) shard(950 + r() * 500, GY - 6, r() * 6, 1.2);
}, [[.1, 'crash']]);

// 046 · the fist that won't close
S('046', (t, d) => {
  cam(1);
  rect(-100, -100, 2200, 1300, '#E9E3D3', { lw: 0 });
  const tries = [.6, 2.6], cl = Math.max(bell(t, tries[0], tries[0] + 1.6), bell(t, tries[1], tries[1] + 1.6)) * 1.2;
  const hx = 960, hy = 640;
  bigArm([760, 1300], [hx, hy + 80], 40, 0);
  shape(() => g.ellipse(hx, hy + 40, 120, 90, 0, 0, Math.PI * 2), C.paper, { lw: 9 });
  for (let i = 0; i < 5; i++) { const base = [hx - 100 + i * 50, hy - 20], curl = i < 3 ? clamp(cl) : .15 + .1 * Math.sin(t * 30 + i), L = i === 0 ? 90 : 140;
    const tip = [base[0] + Math.sin(curl * 2.4) * L * .5, base[1] - Math.cos(curl * 2.4) * L * (1 - curl * .3)];
    line([base, [base[0], base[1] - L * .45 * (1 - curl * .5)], tip], C.ink, 16); if (i >= 3 && cl > .3) ink([[base[0], base[1] + 40], [base[0] + 4, base[1] - 20]], { w: 4, col: C.ginger }); }
  for (let i = 0; i < 3; i++) ink([[hx - 40 + i * 30, hy + 120], [hx - 30 + i * 30, hy + 60], [hx - 50 + i * 32, hy + 10]], { w: 4, col: C.ginger });
  if (cl > .8) for (let i = 0; i < 3; i++) line([[hx + 160 + i * 12, hy - 80 + i * 20], [hx + 190 + i * 12, hy - 90 + i * 20]], C.ink, 5);
}, [[.6, 'strain'], [2.6, 'strain'], [1.4, 'twitchS'], [3.4, 'twitchS']]);

// 047 · control room: the arm lever moves only halfway
S('047', (t, d) => {
  cam(1.25, 1000, 660);
  const pull = Math.min(.5, ein(t, .6, 1.2) * .5 + .05 * Math.sin(t * 20) * ein(t, .6, .3));
  ctrlRoom(t, { threads: .35, taken: { 1: 1 }, lv: { 1: -pull * 1.4 }, lamps: { 1: 'f' }, view: (x, y, r) => { rect(x - r, y - r, 2 * r, 2 * r, '#E9E3D3', { lw: 0 }); circ(x, y + 20, 70, C.paper, { lw: 8 }); for (let i = 0; i < 5; i++) line([[x - 60 + i * 30, y - 20], [x - 60 + i * 30 + (i < 3 ? 20 * pull * 2 : 0), y - 90 + (i < 3 ? 60 * pull * 2 : 0)]], C.ink, 10); } });
  littleMe(leverX(1) + 60, P({ ra: -2.4, rb: -.2, la: -2.6, lb: -.3, lean: -.18, hy: .03, lfx: -.1, rfx: .08 }));
}, [[.6, 'leverStrain', { d: 4 }], [1.2, 'fungus']]);

// 048 · splash of water, the arm jerks, the mirror cracks
S('048', (t, d) => {
  const hit = 1.6, [sx, sy] = shake(t, hit, 14, .35); cam(1.1, 960, 470, sx, sy);
  const p = poseJerk([[0, P({ ra: .6, rb: -1.6, la: -.6, lb: 1.6, head: .2 })], [hit - .15, P({ ra: 2.1, rb: .1, la: -.6, lb: 1.2, lean: .05 })]], t);
  bathroom({ crack: ein(t, hit, .15), reflect: (mx, my, mw, mh) => hero({ x: mx + mw / 2, gy: my + mh + 200, S: 520, face: -1 }, p, INF4) });
  hero({ x: 420, gy: 1320, S: 980 }, p, INF4);
}, [[.3, 'tap', { d: 1.2 }], [1.6, 'glassCrack']]);

// 049 · texting Mia: the thumb twitches; 🍕 sent
S('049', (t, d) => {
  cam(1);
  rect(-100, -100, 2200, 1300, C2.tile, { lw: 0 });
  const msg = "Im skck dont cmoe", n = Math.floor(clamp((t - .6) / 2.2) * msg.length);
  bigPhone(660, 110, 600, 770, (x, y, w, h) => { rect(x, y, w, h, '#F7F9FA', { lw: 0 }); rect(x, y, w, 90, '#EEF1F3', { lw: 0 }); text('Mia ♥', x + w / 2, y + 60, { size: 32, w: 600, align: 'center' });
    chat(x, y + 120, w, 'Hey, you ok? Haven\'t heard from you', false);
    if (t > 3.6) { const k = ein(t, 3.6, .2); g.save(); g.globalAlpha = k; rrect(x + w - 150, y + 210, 110, 90, 22, '#4F86D1', { lw: 0 }); g.restore(); pizzaIcon(x + w - 95, y + 255, 1.1); }
    rrect(x + 20, y + h - 90, w - 40, 64, 32, '#FFFFFF', { lw: 3 }); text(t > 3.6 ? '' : msg.slice(0, n), x + 44, y + h - 46, { size: 28, w: 500 });
    if (t > 3.2 && t < 3.6) { rrect(x + 30, y + h - 180, 200, 70, 14, '#FFFFFF', { lw: 3 }); pizzaIcon(x + 80, y + h - 145, .8); text('pizza', x + 160, y + h - 135, { size: 22, w: 500, align: 'center' }); } });
  const tw = t > 3.2 ? 1 : 0, tx = t < 3.0 ? 900 + 60 * Math.sin(t * 12) : lerp(780, 760, tw), ty = t < 3.0 ? 820 : 760;
  bigArm([1500, 1300], [tx, ty], 30, 1, 0, -2.5);
  if (t > 3.6) { const k = pop(t, 3.65); scaled(1360, 260, k, () => text('sent', 1360, 260, { size: 34, w: 600, col: C.mute })); }
}, [[.6, 'typing', { d: 2.4 }], [3.6, 'whooshSend']]);

// 050 · tracking down the hallway: one leg drags
S('050', (t, d) => {
  const x = lerp(300, 1500, seg(t, .2, d)); cam(1.1, x + 100, 540);
  livingroom({ door: false, sofa: false, tv: false, lamp: false });
  for (let i = 0; i < 6; i++) { const fx = 200 + i * 300; rect(fx, 300, 150, 120, C2.wood); rect(fx + 14, 314, 122, 92, i % 2 ? C.sky : '#F2D9A0', { lw: DL }); if (i % 2) { RAW++; figure({ x: fx + 75, gy: 400, S: 70, lws: .4 }, P({})); RAW--; } }
  doorF(1900, GY, 190, 440, 0); rect(1880, GY - 10, 230, 10, '#C9A160', { lw: 3 });
  hero({ x, gy: GY, S: 430, prof: true, face: 1 }, dragP(t * 5.5, 1), INF4);
}, [[0, 'dragSteps', { d: 6 }]]);

// 051 · the neighbour waves; the hose sprays the wrong way
S('051', (t, d) => {
  cam(1.1, 1050, 540);
  street({ hx: 520, sun: .2, sunX: 1750, fence: false });
  const wv = ein(t, 1.2, .3), stiff = Math.floor(clamp((t - 1.8) / 1.2) * 4) / 4, drop = ein(t, 3.2, .1);
  const n = person({ x: 1420, gy: GY, S: 400, face: -1 }, breathe(t < 3.4 ? P({ ra: 2.5, rb: .4 + .4 * Math.sin(t * 9) * wv, la: -1.1, lb: -.2 }) : P({ ra: .4, rb: -.2, la: -.4 - 1.2 * bell(t, 3.4, d), lb: -1.4, head: .2 }), t));
  const hand = n.aL[1]; hoseP([1700, GY], [hand[0] - 10, hand[1]], { a: t > 3.6 ? -1.9 : Math.PI + .5, t });
  hero({ x: 820, gy: GY, S: 420 }, lerpPose(P({ la: -.3, lb: .2, ra: .3, rb: -.2 }), P({ ra: 2.4, rb: 0, la: -.3, lb: .2, head: .1 }), stiff * (1 - drop)), INF4);
  for (let i = 0; i < 4; i++) { const x = 1560 + i * 40; poly([[x - 16, GY], [x + 16, GY], [x + 12, GY - 40], [x - 12, GY - 40]], C2.bowl); circ(x, GY - 56, 14, C.pink, { lw: 3 }); }
  if (t > 3.7) { popText('?!', n.Hd[0] + 60, n.Hd[1] - 60, t, 3.8, { col: C.ink }); for (let i = 0; i < 6; i++) { const u = ((t * 1.8) + i / 6) % 1; circ(n.Hd[0] - 40 + i * 16, n.Hd[1] - 60 + u * 140, 5, '#7FB6E6', { lw: 0 }); } }
  pointer('Neighbour', 1560, 360, 1450, 420, t, .3, 2.5);
}, [[.2, 'water', { d: 5.6 }], [1.8, 'creak'], [3.7, 'splash']]);

// 052 · a cyclist swerves round him
S('052', (t, d) => {
  cam(1, 960, 520);
  street({ hx: 300, fence: false, trees: false, neighbour: false, lampPost: 1500 });
  const bx = lerp(2300, -400, seg(t, .6, 3.4)), swerve = Math.exp(-Math.pow((bx - 960) / 300, 2)) * -120;
  bicycle(bx, GY + 60 + swerve * -.2, .9); RAW++; try { figure({ x: bx + 10, gy: GY - 30 + swerve * -.2, S: 300, prof: true, face: -1 }, P({ hy: .2, la: -1.6, lb: .3, ra: -1.3, rb: .2, lean: -.25, lfx: -.1, rfx: .1 })); } finally { RAW--; }
  const late = ein(t, 2.6, .5);
  hero({ x: 960, gy: GY + 30, S: 420 }, P({ la: -.25, lb: .1, ra: .25, rb: -.1, head: -.25 * late }), INF4);
  bubble('Watch it!', bx - 80, GY - 360, bx, GY - 260, t, LT('d05'), LE('d05') + 1.0);
}, [[1.2, 'bell'], [1.8, 'whoosh']]);

// 053 · the head snaps toward a pigeon
S('053', (t, d) => {
  const snap = 1.0, back = 2.4, wp = bell(t, snap - .05, back + .1);
  cam(1.1, lerp(960, 1300, wp), 540);
  street({ hx: 300, fence: false, neighbour: false });
  pigeon(1500, GY - 20, 1.1, t > 3.0 ? t : 0);
  const hp = poseJerk([[0, P({ head: 0 })], [snap, P({ head: .6, lean: .08, ra: .6, rb: -.6 })], [back, P({ head: -.1, lean: -.04, ra: .3, rb: -.2 })]], t);
  hero({ x: 960, gy: GY, S: 420 }, tremble(hp, t, ein(t, snap, .1) * eout(t, back, .2)), { ...INF4, claw: .4 * bell(t, snap, back) });
}, [[1.0, 'snapHead'], [2.4, 'snapHead'], [3.0, 'wings']]);

// 054 · through the café window: Leo
S('054', (t, d) => {
  cam(1.15, 700, 470);
  cafe({ counter: false });
  person({ x: 520, gy: GY, S: 380, face: 1 }, breathe(P({ hy: .16, lfx: .1, rfx: .14, ra: .9, rb: -1.5, head: .1 }), t, 2));
  tableP(590, 820, 690, GY, 36); cup(680, 690, 1);
  // glass reflection over everything inside the window
  g.save(); g.globalAlpha = .35; poly([[176, 196], [300, 196], [176, 400]], '#FFFFFF', { lw: 0 }); poly([[480, 196], [560, 196], [300, 524], [220, 524]], '#FFFFFF', { lw: 0 }); g.restore();
  hero({ x: 1100, gy: 1220, S: 900, face: -1 }, P({ ra: 1.3 * ein(t, 2.4, .4), rb: .1, head: -.1 }), INF4);   // you, over the shoulder
}, [[2.8, 'doorbell']]);

// 055 · POV: every head in the café glows
S('055', (t, d) => {
  const pov = t > 1.2 && t < 4.6;
  cam(pov ? 1.1 : 1, pov ? 960 + 120 * Math.sin(t * .8) : 960, 540);
  cafe({});
  const ppl = [[300, -1], [560, 1], [1250, -1], [1700, -1]], js = [];
  for (const [x, f] of ppl) js.push(person({ x, gy: GY, S: 380, face: f }, breathe(P({ hy: .16, lfx: .1, rfx: .14, ra: .7, rb: -1.6 }), t, x)));
  tableP(380, 500, 690, GY, 30); tableP(1300, 1500, 690, GY, 30);
  if (!pov) hero({ x: 960, gy: GY, S: 430 }, P({ head: -.15 * ein(t, .5, .4), lean: .06, hy: .01 }), INF4);
  if (pov) { greyAll(.9); for (const j of js) halo(j, 380, t, 1); }
}, [[1.2, 'heartbeatLoud', { d: 3.4 }], [1.2, 'muffle', { d: 3.4 }]]);

// 056 · the growl; he clamps a hand over his face
S('056', (t, d) => {
  const jerk = .8; cam(1.6, 960, 440, ...shake(t, jerk, 6, .3));
  cafe({ counter: false });
  const p = poseJerk([[0, P({ head: -.1 })], [jerk, P({ head: .25, lean: .1, hy: .01 })], [1.6, P({ ra: 2.35, rb: 1.75, la: -.4, lb: .2, head: -.1, lean: -.08 })]], t);
  const j = hero({ x: 960, gy: GY, S: 480 }, p, INF4);
  if (t > jerk && t < 1.8) warpText('grrrh', j.Hd[0] + 80, j.Hd[1] - 30, t, jerk, { size: 54, amp: 2 });
}, [[.8, 'growl']]);

// 057 · Leo waves; he backs out, knocking a chair
S('057', (t, d) => {
  cam(1, 960, 540);
  cafe({});
  person({ x: 1300, gy: GY, S: 400, face: -1 }, breathe(t < 2.6 ? P({ ra: 2.5, rb: .3 + .4 * Math.sin(t * 9), la: -.4, lb: .2 }) : P({ ra: .8, rb: -.4, la: -.4, lb: .2, head: .3 }), t));
  tableP(1150, 1450, 690, GY, 36);
  const back = ss(seg(t, .8, 3.4));
  hero({ x: lerp(800, 100, back), gy: GY, S: 420, prof: true, face: 1 }, t > .8 ? dragP(-t * 9, .8) : P({ head: .1 }), INF4);
  chair(560, GY, 1, -1.4 * ein(t, 1.8, .3));
  bubble('Hey! You okay?', 1350, 420, 1310, 470, t, LT('d06'), LE('d06') + 1);
}, [[1.8, 'chairFall'], [3.2, 'doorbell']]);

// 058 · limping home at sunset
S('058', (t, d) => {
  const x = lerp(-100, 2000, seg(t, 0, d)); cam(1.05, x, 540);
  g.save(); g.translate(-600, 0); street({ hx: 520, sky: '#F4C9A4', sun: 0, f2: 700, f3: 1600 }); g.restore();
  g.save(); g.translate(1400, 0); street({ hx: 520, sky: '#F4C9A4', fence: true }); g.restore();
  circ(x + 500, 330, 70, C.sun, { lw: 5 });
  hero({ x, gy: GY, S: 420, prof: true, face: 1 }, dragP(t * 7, 1.1), INF4);
  dusk(1);
}, [[0, 'dragSteps', { d: 5, rate: 1.3 }], [0, 'breath', { d: 5 }]]);

// 059 · the door slams; he slides down it
S('059', (t, d) => {
  const [sx, sy] = shake(t, .4, 10, .3); cam(lerp(1, 1.2, ein(t, 1.2, 3)), 400, 560, sx, sy);
  livingroom({ doorX: 220, sofa: false, tv: false, lampX: 1300, win: 'dusk' });
  const slide = ein(t, 1.0, 1.4);
  hero({ x: 315, gy: GY, S: 430 }, lerpPose(P({ la: -.6, lb: .3, ra: .6, rb: -.3, lean: -.05 }), PS.hug(), slide), INF4);
  dusk(.8);
}, [[.4, 'slam'], [1.0, 'slide']]);

// 060 · control room: alarms; the eye-window shows an ant
S('060', (t, d) => {
  const toWin = ss(seg(t, 2.4, 4.4)); cam(lerp(1, 2.6, toWin), CR.wx, lerp(540, CR.wy, toWin));
  const work = Math.sin(t * 8);
  ctrlRoom(t, { threads: .55, alarm: true, taken: { 1: 1, 0: .5 }, lv: { 0: work * .5, 2: -work * .5, 3: work * .3 }, lamps: { 0: 'r', 1: 'f', 2: 'r' }, view: (x, y, r) => antScene(x, y + 40, .32, seg(t, 2.6, d - .4)) });
  littleMe(lerp(700, 1200, .5 + .5 * Math.sin(t * 2.3)), P({ ra: 2.2, rb: .3 * work, la: -2.2, lb: -.3 * work, lean: .1 * work }));
}, [[0, 'alarm', { d: 2.4 }], [2.6, 'antClimb', { d: 3 }], [6.4, 'fungus']]);
