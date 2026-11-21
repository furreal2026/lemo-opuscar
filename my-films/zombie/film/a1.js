// Act 1 · the infection nobody noticed (Hour 0)
const ME = (x, gy = GY, S = 400, o = {}) => ({ x, gy, S, ...o });

// 001 · midnight, POV from inside the fridge
S('001', (t, d) => {
  cam(1.0 + .03 * seg(t, 0, d));
  kitchen({ night: true, open: 0, fx: -600 });
  const scan = Math.sin(t * 1.6) * .18, look = P({ lean: -.02, head: scan, hx: scan * .05, la: .5, lb: -1.5, ra: 1.9, rb: .5 });
  const j = hero(ME(960, 1180, 820), breathe(look, t));
  night(1);
  cone([[620, 140], [1300, 140], [1500, 1080], [420, 1080]], '#FFF1B8', .32);
  const gr = [Math.sin(t * 60) * 3, Math.cos(t * 50) * 2]; if (t > 2.2 && t < 3.6) text('grrr', j.Hp[0] - 160 + gr[0], j.Hp[1] - 110 + gr[1], { size: 40, w: 600, col: C.paper, a: ein(t, 2.2, .15) * eout(t, 3.3, .3) });
  // the fridge from inside: walls, shelves, the light
  scr(); cam(1);
  rect(-50, -50, 2020, 140, '#F7F3E3', { lw: 0 }); rect(-50, 1000, 2020, 140, '#F7F3E3', { lw: 0 }); rect(-50, -50, 180, 1200, '#EFEAD6', { lw: 0 }); rect(1790, -50, 200, 1200, '#EFEAD6', { lw: 0 });
  line([[130, 90], [1790, 90]], C.ink, 6); line([[130, 1000], [1790, 1000]], C.ink, 6); line([[130, 90], [130, 1000]], C.ink, 6); line([[1790, 90], [1790, 1000]], C.ink, 6);
  for (const y of [180, 860]) { line([[130, y], [1790, y]], C2.chrome, 10); for (let x = 150; x < 1790; x += 40) ORIG.line([[x, y - 6], [x, y + 6]], C.mute, 2); }
  // mustard + lemon on the lower shelf (foreground)
  rrect(260, 700, 80, 160, 14, '#E8C35A'); rect(282, 660, 36, 40, C.red, { lw: 4 }); text('M', 300, 800, { size: 40, w: 600, align: 'center' });
  shape(() => g.ellipse(1620, 830, 70, 34, 0, Math.PI, 0), '#F2E27A', { lw: 5 }); shape(() => g.ellipse(1620, 830, 54, 10, 0, 0, Math.PI * 2), '#F7F0B8', { lw: 3 });
  rect(1500, 120, 46, 46, '#FFF3B0', { lw: 3 });
  Lb('Day 1  ·  11:48 p.m.', 124, 150, t, .3, d - .2, { col: C.ink });
}, [[0, 'fridgeOpen'], [.2, 'hum', { d: 6 }], [2.2, 'growl']]);

// 002 · the hand sweeps the empty shelf
S('002', (t, d) => {
  cam(1);
  rect(-100, -100, 2200, 1300, '#FFF6D8', { lw: 0 });
  for (const y of [300, 700]) { line([[0, y], [1920, y]], C2.chrome, 14); for (let x = 20; x < 1920; x += 48) ORIG.line([[x, y - 8], [x, y + 8]], C.mute, 3); }
  rect(0, 0, 1920, 70, '#F2F7F9', { lw: 6 });
  const push = ss(seg(t, .5, 1.4)), lift = bell(t, 1.7, 3.4);
  const mx = 700 + 120 * push; rrect(mx - 70, 420, 140, 280, 24, '#E8C35A'); rect(mx - 30, 350, 60, 70, C.red, { lw: 5 }); text('M', mx, 600, { size: 80, w: 600, align: 'center' });
  const lx = 1200, ly = 640 - 160 * lift;
  const hx = t < 1.5 ? lerp(1950, mx + 90, ss(seg(t, 0, .6))) : lerp(mx + 120, lx + 40, ss(seg(t, 1.4, 1.8))), hy = t < 1.5 ? 560 : ly - 30;
  shape(() => g.ellipse(lx, ly, 120, 60, 0, Math.PI, 0), '#E8D86A', { lw: 6 }); shape(() => g.ellipse(lx, ly, 96, 18, 0, 0, Math.PI * 2), '#F2E9A4', { lw: 4 });
  for (let i = 0; i < 5; i++) dline([[lx - 70 + i * 34, ly - 4], [lx - 60 + i * 34, ly - 40]], '#C8B84A');
  line([[2100, hy + 160], [hx + 60, hy + 30], [hx, hy]], C.ink, 26);
  for (let i = 0; i < 4; i++) { const a = -2.6 + i * .25 + Math.sin(t * 9 + i) * .05 * (t > 2.8 ? 1 : 0); line([[hx, hy], [hx + Math.cos(a) * 60, hy + Math.sin(a) * 60]], C.ink, 16); }
  if (t > 3.0) { const k = ss(seg(t, 3.0, 3.4)); poly([[0, 0], [1920 * k * .5, 0], [1920 * k * .5, 1080], [0, 1080]], '#1E2232', { lw: 0 }); poly([[1920, 0], [1920 - 1920 * k * .5, 0], [1920 - 1920 * k * .5, 1080], [1920, 1080]], '#1E2232', { lw: 0 }); }
}, [[.5, 'clink'], [1.6, 'clink'], [3.0, 'thup']]);

// 003 · dark kitchen; he turns, finds the bread
S('003', (t, d) => {
  const pan = ss(seg(t, 1.6, 2.8)); cam(1.05, lerp(760, 960, pan), 560);
  kitchen({ night: true, bread: true, breadX: 800, fx: 280 });
  const p = poseAt([[0, P({ head: -.3, la: -.4, lb: .3, ra: .3, rb: -.2 })], [1.7, P({ head: .25, lean: .05, la: -.5, lb: .4, ra: .5, rb: -.2, hy: -.005 })], [2.3, P({ head: .2, lean: .12, la: -.4, lb: .3, ra: .8, rb: -.3 })]], t);
  hero(ME(560, GY, 420, { prof: true, face: 1 }), breathe(p, t));
  night(1);
  cone([[1236, 226], [1464, 226], [1150, 880], [700, 880]], '#C9D8FF', .16);
  text('11:49', 1135, 600, { size: 18, w: 600, col: '#BDF2C8', align: 'center' });
  popText('!', 640, 360, t, 1.75, { size: 70, col: C.paper }, 2.6);
}, [[1.75, 'idea']]);

// 004 · insert: the mould under the loaf (we see it, he doesn't)
S('004', (t, d) => {
  const tilt = ss(seg(t, .3, 2.6)); cam(1, 960, lerp(380, 640, tilt));
  rect(-100, -100, 2200, 1300, K.wallK, { lw: 0 }); rect(-100, 720, 2200, 60, C2.woodL); rect(-100, 780, 2200, 500, C2.wood, { lw: 0 });
  for (let i = 0; i < 9; i++) ink([[-100, 735 + i * 5], [600, 738 + i * 5 + Math.sin(i) * 3], [1300, 734 + i * 5], [2100, 737 + i * 5]], { w: 1.6, col: '#B9834F', amp: .4 });
  shape(() => g.ellipse(1620, 520, 30, 20, 0, 0, Math.PI * 2), '#E8E2CF', { lw: 4 }); // a loose clip
  scaled(960, 730, 3.4, () => breadMoldy(960, 730, 1, ss(seg(t, .8, 2.2)), 0));
  // plastic bag edge
  g.save(); g.globalAlpha = .22; rect(560, 330, 820, 400, '#FFFFFF', { lw: 0 }); g.restore(); ink([[560, 330], [1380, 330]], { w: 3, col: C.mute });
  night(.75);
  cone([[400, -100], [1300, -100], [1700, 1100], [200, 1100]], '#C9D8FF', .14);
  // spores glint in the power colour on top of the wash
  const r = mulberry(12); for (let i = 0; i < 14; i++) { const x = 820 + r() * 260, y = 690 + r() * 30; g.save(); g.globalAlpha = ein(t, 1.2 + i * .05, .3) * .9; circ(x, y, 4 + r() * 5, C.ginger, { lw: 0 }); g.restore(); }
}, [[1.0, 'fungus']]);

// 005 · eating while scrolling
S('005', (t, d) => {
  cam(1.08, 960, 520);
  kitchen({ night: true, fx: 260 });
  const chew = Math.max(0, Math.sin(t * 9)) * (t > 1.8 ? 1 : 0), tear = bell(t, 1.0, 1.8);
  const p = P({ ra: .55, rb: -1.95, la: -.3 - .9 * tear + .2 * (t > 1.8 ? 1 : 0), lb: -1.6 * (t > 1.0 ? 1 : 0) - .2, head: .22 + .03 * chew, hy: .004 * chew });
  const j = hero(ME(960, GY, 460), breathe(p, t));
  const ph = handR(j); phoneP(ph[0] + 14, ph[1] - 30, .9, -.15, (x, y, w, h) => { rect(x, y, w, h, '#FCE7D0', { lw: 0 }); circ(x + w / 2, y + h * .55, 16, C.ginger === '#F28C28' ? '#E0A060' : C.box, { lw: 2 }); poly([[x + w / 2 - 14, y + h * .45], [x + w / 2 - 6, y + h * .3], [x + w / 2 - 2, y + h * .44]], '#E0A060', { lw: 2 }); poly([[x + w / 2 + 14, y + h * .45], [x + w / 2 + 6, y + h * .3], [x + w / 2 + 2, y + h * .44]], '#E0A060', { lw: 2 }); });
  const bh = handL(j); breadMoldy(bh[0] - 6, bh[1] + 30, .45, 0, t > 1.8 ? .6 : 0);
  night(1);
  cone([[ph[0] - 6, ph[1] - 50], [ph[0] + 36, ph[1] - 50], [j.Hd[0] + 80, j.Hd[1] - 20], [j.Hd[0] - 90, j.Hd[1] - 20]], '#CFE6F2', .22);
  const r = mulberry(5); for (let i = 0; i < 6; i++) { const u = ((t - 1.9) * .8 + i / 6) % 1; if (t > 1.9) circ(bh[0] + (r() - .5) * 60, bh[1] + 60 + u * 300, 5, '#C9A160', { lw: 2 }); }
}, [[1.0, 'tear'], [1.9, 'chew'], [2.6, 'chew'], [3.3, 'chew'], [.2, 'phoneVid', { d: 4.6 }]]);

// 006 · tracking: kitchen → living room, eating, crumbs
S('006', (t, d) => {
  const x = lerp(760, 3150, ss(seg(t, .2, d - .3)) * .2 + seg(t, .2, d - .3) * .8);
  cam(1, x + 120, 540);
  kitchen({ night: true, fx: 420, photo: true, star: true });
  g.save(); g.translate(2300, 0); livingroom({ win: 'night', door: false, sofaX: 300, tvX: 1150 }); g.restore();
  rect(1880, 100, 360, GY - 100, '#D9CDB2'); rect(1940, 300, 240, GY - 300, '#F5EFE0', { lw: 5 });   // the doorway wall
  const p = walkP(t * 7.5, .8); p.ra = .55; p.rb = -1.9; p.head = .15;
  const j = hero(ME(x, GY, 420, { prof: true, face: 1 }), p);
  night(1);
  const fl = .26 + .1 * Math.sin(t * 13) * Math.sin(t * 3.1); cone([[3450, 400], [3970, 400], [3600, 880], [2700, 880]], '#BFDDF2', fl);
  for (let i = 0; i < 8; i++) { const cx = 900 + i * 300; if (cx < x - 40) circ(cx, GY - 4, 5, '#C9A160', { lw: 2 }); }
}, [[0, 'steps', { d: 6, rate: 1.2 }]]);

// 007 · macro: spores drift up from the bite
S('007', (t, d) => {
  cam(1);
  rect(-100, -100, 2200, 1300, '#2A3047', { lw: 0 });
  cone([[1500, -100], [2100, -100], [1200, 1200], [300, 1200]], '#9FC3E6', .18);
  scaled(900, 760, 3.2, () => breadMoldy(900, 760, 1, .9, .9, '#2A3047'));
  const r = mulberry(21); for (let i = 0; i < 40; i++) { const sx = 980 + r() * 240, sy = 520 + r() * 200, vx = (r() - .4) * 40, vy = -30 - r() * 40, u = t * .5;
    const x = sx + vx * u + Math.sin(t * 1.3 + i) * 12, y = sy + vy * u * 3; g.save(); g.globalAlpha = clamp(t / .6) * (.6 + .4 * Math.sin(t * 3 + i)); circ(x, y, 3 + r() * 4, C.ginger, { lw: 0 }); g.restore(); }
}, [[0, 'spores', { d: 4 }]]);

// 008 · flop on the sofa, lick fingers
S('008', (t, d) => {
  cam(1);
  livingroom({ win: 'night', door: false });
  rect(1010, 760, 180, 20, C2.woodL); line([[1030, 780], [1030, 880]], C.ink, 7); line([[1170, 780], [1170, 880]], C.ink, 7);
  rrect(1060, 735, 80, 25, 4, '#E8E2CF', { lw: 4 });   // the empty bread bag
  const fall = ss(seg(t, .2, .8)), lick = t > 1.8 && t < 4.2 ? Math.max(0, Math.sin((t - 1.8) * 7.8)) : 0;
  const p = lerpPose(P({ la: -.4, lb: .2, ra: .4, rb: -.2 }), P({ hy: .2, lfx: .36, rfx: .44, lfy: .13, rfy: .14, la: -.9, lb: .5, ra: .6 + lick * 1.9, rb: -1.4 * lick - .2, lean: -.12, head: -.1 }), fall);
  hero(ME(lerp(780, 650, fall), GY - 110 * fall, 400, { prof: true, face: 1 }), p);
  night(1);
  const fl = .25 + .12 * Math.sin(t * 11) * Math.sin(t * 2.3); cone([[1318, 378], [1802, 378], [1500, 880], [500, 880]], '#BFDDF2', fl);
}, [[.75, 'boing'], [2.0, 'lick'], [2.8, 'lick'], [3.6, 'lick']]);

// 009 · Mr. Biscuits sniffs the crumbs, hisses, bolts
S('009', (t, d) => {
  const tH = 2.0, tRun = 2.9; cam(lerp(1, 1.12, ss(seg(t, 1.6, 2.2))), lerp(960, 900, ss(seg(t, 1.6, 2.2))), 560);
  livingroom({ win: 'night', door: false });
  rrect(1060, 735, 80, 25, 4, '#E8E2CF', { lw: 4 }); rect(1010, 760, 180, 20, C2.woodL); line([[1030, 780], [1030, 880]], C.ink, 7); line([[1170, 780], [1170, 880]], C.ink, 7);
  const shrug = bell(t, 3.4, 4.8);
  hero(ME(650, GY - 110, 400, { prof: true, face: 1 }), breathe(P({ hy: .2, lfx: .36, rfx: .44, lfy: .13, rfy: .14, la: -.9 - shrug * .5, lb: .5 - 1.4 * shrug, ra: .6 + shrug * .7, rb: -.2 + shrug * 1.3, lean: -.12, head: -.1 + .2 * shrug }), t));
  const run = ss(seg(t, tRun, tRun + .5)), cx = lerp(1010, -200, run), hop = Math.sin(Math.PI * clamp((t - tRun) / .5)) * 120;
  scaled(cx, 640 - hop, .62, () => catD(cx, 640 - hop, .62, { paw: false, angry: t > tH, mouth: t > tH && t < tRun ? 'open' : 'closed' }));
  if (t > tH && t < tRun) for (const a of [-2.4, -2.0, -1.6]) line([[1000 + Math.cos(a) * 110, 560 + Math.sin(a) * 110], [1000 + Math.cos(a) * 150, 560 + Math.sin(a) * 150]], C.ink, 5);
  night(1);
  const fl = .25 + .12 * Math.sin(t * 11) * Math.sin(t * 2.3); cone([[1318, 378], [1802, 378], [1500, 880], [500, 880]], '#BFDDF2', fl);
  pointer('Mr. Biscuits', 1150, 430, 1040, 520, t, .4, tH);
}, [[1.0, 'sniff'], [2.0, 'hiss'], [2.9, 'scamper'], [3.4, 'shrug']]);

// 010 · the house at night; the TV window goes dark
S('010', (t, d) => {
  const push = ss(seg(t, .5, d)); cam(lerp(1, 1.5, push), lerp(960, 430, push), lerp(540, 520, push));
  street({ sky: '#7D8FB8', moon: true, lampPost: 1180, lampOn: false, hx: 520 });
  night(1);
  const on = t < 3.4 ? .55 + .25 * Math.sin(t * 12) * Math.sin(t * 3) : 0;
  g.save(); g.globalAlpha = on; rect(520 - 180, GY - 350, 110, 100, '#BFDDF2', { lw: 0 }); g.restore();
  cone([[1154, GY - 410], [1206, GY - 410], [1330, GY], [1030, GY]], '#FFF1B8', .3);
}, [[0, 'crickets', { d: 5 }], [3.4, 'tvoff']]);

// 011 · asleep; the fungus grows out of the bag (time-lapse); into the head
S('011', (t, d) => {
  const head = [300, 600], bag = bp(560, 322);
  const z1 = ss(seg(t, 1.2, 2.6)), z2 = ss(seg(t, 3.4, d));
  cam(lerp(1, 1.9, z1) * lerp(1, 8, z2 * z2), lerp(lerp(960, bag[0], z1), head[0], z2), lerp(lerp(540, bag[1], z1), head[1] + 30, z2));
  bedroomF(BED_DAY);
  // you, lying on the bed (rotated figure), the blanket over the legs
  sleeper(t, 0);
  alarmClock(bp(600, 330)[0] - 100, bp(600, 330)[1], .9, 0, '2:13');
  // bread bag on the nightstand, hyphae creeping out
  rrect(bag[0] - 70, bag[1] - 50, 140, 50, 8, '#EDE7D2', { lw: 4 }); ink([[bag[0] + 70, bag[1] - 30], [bag[0] + 90, bag[1] - 20]], { w: 4 });
  const gk = seg(t, .6, 3.2), rr = mulberry(41); for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (rr() - .5) * 2.2; let x = bag[0] - 40 + rr() * 80, y = bag[1] - 48, ang = a; const Pt = [[x, y]]; for (let s = 0; s < 8; s++) { ang += (rr() - .5) * .8; x += Math.cos(ang) * 9; y += Math.sin(ang) * 9; Pt.push([x, y]); }
    const n = Math.floor(Pt.length * clamp(gk * 1.3 - i * .05)); if (n > 1) ink(Pt.slice(0, n), { w: 3, col: C.ginger, amp: .4 }); }
  night(1);
  const mv = seg(t, 0, d); cone([[bp(520, 60)[0], bp(520, 60)[1]], [bp(720, 60)[0], bp(720, 60)[1]], [bp(560 - mv * 200, 520)[0], bp(500, 520)[1]], [bp(280 - mv * 200, 520)[0], bp(280, 520)[1]]], '#C9D8FF', .16);
  // the fungus re-drawn bright on top of the night
  for (let i = 0; i < 5; i++) { const u = ((t * .6) + i / 5) % 1; g.save(); g.globalAlpha = (1 - u) * gk; circ(bag[0] - 30 + i * 15, bag[1] - 60 - u * 60, 3, C.ginger, { lw: 0 }); g.restore(); }
  if (z2 > .7) { scr(); g.save(); g.globalAlpha = (z2 - .7) / .3; g.fillStyle = '#24242C'; g.fillRect(0, 0, W, H); g.restore(); }
}, [[0, 'tick', { d: 5, rate: 2 }], [1.0, 'fungus'], [3.6, 'dive']]);

// 012 · the title sequence is spliced in from ../intro (zombie-intro), same length
S('012', (t, d) => { scr(); g.fillStyle = '#24242C'; g.fillRect(0, 0, W, H); });

// you asleep on the bed (a lying figure: feet right, head on the pillow); restless k 0..1 rolls and kicks
function sleeper(t, restless = 0, o = {}) {
  const X = 1060, Y = 640, kick = restless * Math.max(0, Math.sin(t * 3.1)), roll = restless * Math.sin(t * 1.3) * .08;
  g.save(); g.translate(X, Y); g.rotate(-Math.PI / 2 + roll);
  hero({ x: 0, gy: 0, S: 820 }, breathe(P({ la: -.3 - .5 * kick, lb: .6, ra: .9, rb: -1.2, head: .1 + .2 * roll, lfx: .1 * kick, rfx: -.08 * kick }), t, 0, 2), o); g.restore();
  const bl = bp(250, 322); rect(bl[0], bl[1] + 10 * kick, 210 * BK - 40 * kick, 64 * BK, BED_DAY.blanket, { lw: 6 }); for (let i = 1; i < 4; i++) dline([[bl[0] + i * 120, bl[1] + 10], [bl[0] + i * 120 - 10, bl[1] + 150]], '#3B6BB0');
}
