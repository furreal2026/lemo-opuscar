// Act 3 · the body changes (Day 2–3)
const INF3 = { veins: .25, arms: '' };

// 028 · veins on the neck in the mirror
S('028', (t, d) => {
  const push = ss(seg(t, 1.6, 4.2)); cam(lerp(1.05, 1.9, push), lerp(960, 960, push), lerp(470, 380, push));
  const lean = ein(t, 1.4, .6);
  const pr = P({ la: -.3, lb: .2, ra: .3, rb: -.2, head: .05 + .3 * lean * (1 - ein(t, 4.2, .4)), lean: .04 * lean, hx: -.03 * ein(t, 4.4, .4) });
  bathroom({ reflect: (mx, my, mw, mh) => { hero({ x: mx + mw / 2, gy: my + mh + 200, S: 520, face: -1 }, pr, { veins: .28 * ein(t, .3, 1.2), arms: '' }); } });
  hero({ x: 380, gy: 1320, S: 980 }, pr);
  label('Day 2  ·  7:30 a.m.', 124, 150);
}, [[1.5, 'celesta'], [.2, 'silence']]);

// 029 · rubbing with a towel; the marks stay
S('029', (t, d) => {
  cam(1.6, 960, 400);
  const rub = t < 3.4 ? Math.sin(t * (8 + t * 4)) : 0, drop = ein(t, 3.6, .4);
  const pr = P({ la: -.3, lb: .2, ra: 2.0 + .25 * rub - 1.6 * drop, rb: 1.8 - 1.7 * drop, head: -.15 + .05 * rub });
  bathroom({ reflect: (mx, my, mw, mh) => { const j = hero({ x: mx + mw / 2, gy: my + mh + 330, S: 560, face: -1 }, pr, INF3);
    if (drop < 1) { const h = handR(j); const ty = lerp(h[1], my + mh + 200, drop); rect(h[0] - 30, ty - 20, 60, 90, '#E9A99F', { lw: 4 }); for (let i = 0; i < 3; i++) dline([[h[0] - 30, ty + i * 24], [h[0] + 30, ty + i * 24]], C2.white); } } });
}, [[.3, 'rub', { d: 3 }], [3.6, 'clothDrop']]);

// 030 · ECU: the same pattern as the hyphae
S('030', (t, d) => {
  const flash = t > 1.0 && t < 2.0;
  if (!flash) { cam(4.2, 960, 620); bathroom({ reflect: (mx, my, mw, mh) => hero({ x: mx + mw / 2, gy: my + mh + 330, S: 560, face: -1 }, P({ head: -.1 }), { veins: .3, arms: '' }) }); }
  else { cam(1.6, 960, 360); const B = tubeFig({ x: 960, gy: 900, S: 740 }, P({ la: -.45, lb: .15, ra: .45, rb: -.15 })); hyphaeBody(B, 1, t); }
}, [[1.0, 'fungusHit'], [2.0, 'fungusHit']]);

// 031 · the hoodie: hood up, zip to the chin
S('031', (t, d) => {
  cam(1.25, 960, 440);
  const hood = ein(t, .6, .4), zip = ein(t, 1.4, .5), nod = bell(t, 2.6, 3.2);
  const pr = P({ la: -.3 - 1.8 * bell(t, .3, 1.1), lb: .2 + 1.5 * bell(t, .3, 1.1), ra: .3 + 1.2 * bell(t, 1.2, 2.0), rb: -.2 - 1.3 * bell(t, 1.2, 2.0), head: -.12 * nod });
  bathroom({ reflect: (mx, my, mw, mh) => hero({ x: mx + mw / 2, gy: my + mh + 330, S: 560, face: -1 }, pr, { ...INF3, veins: .28 * (1 - zip * .9), hood }) });
}, [[.6, 'cloth'], [1.4, 'zip']]);

// 032 · the fridge again: raw steak pulls him in
S('032', (t, d) => {
  const ins = t > 2.4 && t < 3.6;
  if (!ins) {
    cam(1.0 + .03 * seg(t, 0, d));
    kitchen({ fx: -600 });
    const pull = t < 2.4 ? ein(t, .5, 1.6) : 0, back = ein(t, 3.6, .3);
    const sniff = pull > 0 ? Math.max(0, Math.sin(t * 18)) * .03 : 0;
    const p = P({ lean: 0, head: -.05 + .1 * Math.sin(t * 2), hy: -.02 * pull, la: -.3, lb: .2, ra: .3 + 1.6 * back, rb: -.2 + .4 * back });
    hero({ x: 960, gy: 1180 + 60 * back - 90 * pull - sniff * 600, S: 820 + 120 * pull }, p, { hood: 1, veins: .1 });
    scr(); cam(1);
    rect(-50, -50, 2020, 140, '#F7F3E3', { lw: 0 }); rect(-50, 1000, 2020, 140, '#F7F3E3', { lw: 0 }); rect(-50, -50, 180, 1200, '#EFEAD6', { lw: 0 }); rect(1790, -50, 200, 1200, '#EFEAD6', { lw: 0 });
    for (const [a, b] of [[[130, 90], [1790, 90]], [[130, 1000], [1790, 1000]], [[130, 90], [130, 1000]], [[1790, 90], [1790, 1000]]]) line([a, b], C.ink, 6);
    for (const y of [180, 860]) { line([[130, y], [1790, y]], C2.chrome, 10); for (let x = 150; x < 1790; x += 40) ORIG.line([[x, y - 6], [x, y + 6]], C.mute, 2); }
    steak(560, 860, 2.2, pull);
    if (back < .5) { shape(() => g.ellipse(1450, 850, 130, 22, 0, 0, Math.PI * 2), C2.white, { lw: 5 }); for (let i = 0; i < 7; i++) circ(1360 + i * 30, 820 - (i % 2) * 14, 18, '#93B86E', { lw: 3 }); }
    Lb('Day 3', 124, 150, t, .2, d, { col: C.ink });
  } else { cam(1); rect(-100, -100, 2200, 1300, '#FFF6D8', { lw: 0 }); line([[0, 760], [1920, 760]], C2.chrome, 14); steak(960, 760, 4.4, .6 + .4 * Math.sin(t * 8)); }
}, [[.5, 'heartbeat'], [1.2, 'heartbeat'], [2.0, 'heartbeat'], [3.6, 'shake']]);

// 033 · an apple that tastes of nothing
S('033', (t, d) => {
  cam(1.1, 900, 520);
  kitchen({ fx: 280, binX: 1500, binLid: bell(t, 3.0, 3.8) });
  const bite = t > .6, toss = ein(t, 2.8, .3);
  const p = P({ ra: lerp(.5, 1.6, toss), rb: lerp(-1.9, .3, toss) * (bite ? 1 : .6), la: -.4, lb: .2, head: .2 + .15 * ein(t, 1.4, .4) });
  const j = hero({ x: 900, gy: GY, S: 440 }, breathe(p, t), { hood: 1, veins: .1 });
  const h = handR(j);
  if (t < 3.0) apple(h[0] + 20, h[1] - 20, .9, bite ? 1 : 0); else { const u = clamp((t - 3.0) / .6); apple(lerp(h[0], 1500, u), lerp(h[1], 740, u) - 160 * Math.sin(Math.PI * u), .9 * (1 - u * .3), 1); }
  if (t > 1.4) bubble('…', j.Hd[0] + 70, j.Hd[1] - 70, j.Hd[0] + 40, j.Hd[1] - 40, t, 1.4, 2.8);
}, [[.6, 'crunch'], [1.0, 'chew'], [3.0, 'toss'], [3.6, 'binLid']]);

// 034 · Mr. Biscuits flees under the bed; he kneels and reaches
S('034', (t, d) => {
  cam(1.3, 760, 700);
  bedroomF(BED_DAY);
  const kneel = ein(t, .9, .5);
  const p = lerpPose(P({ la: -.3, lb: .2, ra: .3, rb: -.2 }), P({ hy: .2, lfx: .05, rfx: .2, la: -.4, lb: .3, ra: -1.5, rb: -.05, lean: -.4, head: -.35 }), kneel);
  // under the bed: dark, two eyes
  rect(bp(70, 420)[0], bp(70, 420)[1], 360 * BK, 60 * BK, '#2C2A2E', { lw: 0 });
  if (t < .9) { const u = ein(t, 0, .8); scaled(lerp(1500, 600, u), 780, .4, () => catD(lerp(1500, 600, u), 780, .4, { angry: true, mouth: 'open' })); }
  else { const bl = Math.floor(t * 2) % 5 === 0 ? .2 : 1; for (const dx of [0, 34]) { g.save(); g.globalAlpha = bl; circ(540 + dx, 960, 9, '#F7E3A0', { lw: 0 }); g.restore(); } }
  line([[bp(70, 420)[0], bp(70, 420)[1]], [bp(430, 420)[0], bp(430, 420)[1]]], C.ink, 6);
  hero({ x: 1300, gy: 1010, S: 560, prof: true, face: -1 }, p, { hood: 1, veins: .12 });
}, [[.1, 'hiss'], [.4, 'scamper'], [.9, 'kneel']]);

// 035 · Face ID doesn't know him
S('035', (t, d) => {
  cam(1);
  rect(-100, -100, 2200, 1300, BED_DAY.wall, { lw: 0 });
  const fails = [1.0, 2.6], n = Math.floor(clamp((t - 4.0) / 1.2) * 4);
  bigPhone(660, 110, 600, 770, (x, y, w, h) => {
    rect(x, y, w, h, '#22283A', { lw: 0 }); text('9:41', x + w / 2, y + 120, { size: 90, w: 600, col: C.paper, align: 'center' });
    if (t < 3.8) { const shk = (t > fails[0] && t < fails[0] + .4) || (t > fails[1] && t < fails[1] + .4) ? Math.sin(t * 60) * 12 : 0, fail = t > fails[0];
      const cx = x + w / 2 + shk, cy = y + 330; g.save(); g.strokeStyle = fail ? C.red : C.paper; g.lineWidth = 6; for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { g.beginPath(); g.moveTo(cx + sx * 70, cy + sy * 30); g.lineTo(cx + sx * 70, cy + sy * 70); g.lineTo(cx + sx * 30, cy + sy * 70); g.stroke(); } g.restore();
      if (fail) text('Face not recognized', x + w / 2, y + 470, { size: 30, w: 600, col: C.red, align: 'center' }); }
    else { text('Enter passcode', x + w / 2, y + 230, { size: 30, w: 500, col: C.paper, align: 'center' }); for (let i = 0; i < 4; i++) circ(x + w / 2 - 75 + i * 50, y + 290, 12, i < n ? C.paper : null, { lw: 3, col: C.paper });
      for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) { circ(x + 150 + c * 150, y + 400 + r * 110, 42, '#3A4258', { lw: 0 }); text(String(r * 3 + c + 1), x + 150 + c * 150, y + 414 + r * 110, { size: 34, w: 500, col: C.paper, align: 'center' }); }
      if (t > 5.3) text('Wrong passcode', x + w / 2, y + 740, { size: 26, w: 600, col: C.red, align: 'center' }); }
  });
  if (t > 4.0) { const k = (t * 3) % 1; bigArm([1600, 1300], [lerp(1020, 900, k), lerp(610, 640, k)], 30, 1); }
}, [[1.0, 'bzzt'], [2.6, 'bzzt'], [4.1, 'tap'], [4.4, 'tap'], [4.7, 'tap'], [5.0, 'tap'], [5.3, 'bzzt']]);

// 036 · Mia calls; his voice cracks
S('036', (t, d) => {
  const close = t < 1.6;
  if (close) { cam(1); rect(-100, -100, 2200, 1300, BED_DAY.wall, { lw: 0 }); const rk = Math.sin(t * 40) * 4;
    bigPhone(660 + rk, 110, 600, 770, (x, y, w, h) => { rect(x, y, w, h, '#2C3E50', { lw: 0 }); photoP(x + w / 2, y + 260, 2.6, 0); text('Mia ♥', x + w / 2, y + 470, { size: 54, w: 600, col: C.paper, align: 'center' }); text('incoming call', x + w / 2, y + 520, { size: 26, w: 500, col: '#BFC6D0', align: 'center' });
      circ(x + 150, y + 660, 50, C.red, { lw: 0 }); circ(x + w - 150, y + 660, 50, '#5BB974', { lw: 0 }); }); }
  else { cam(1.15, 900, 500); bedroomF(BED_DAY);
    const p = P({ ra: 2.35, rb: 1.55, la: t > LT('d04') - .3 ? .3 : -.4, lb: t > LT('d04') - .3 ? -1.6 : .2, head: .2 });
    const j = hero({ x: 900, gy: GY, S: 440 }, breathe(p, t), { hood: 1, veins: .15 });
    const h = handR(j); phoneP(h[0] - 6, h[1] - 10, .7, .5);
    bubble("Dinner Sunday? Mom's making soup.", j.Hd[0] + 90, j.Hd[1] - 120, h[0] + 10, h[1] - 30, t, LT('d03'), LE('d03') + .8, { size: 30 });
    if (t > LT('d04')) warpText('Y—yeh…', j.Hd[0] - 330, j.Hd[1] - 60, t, LT('d04'), { size: 48, amp: 1.5 });
    if (t > d - 1.0) { const k = ein(t, d - 1.0, .3); g.save(); g.globalAlpha = k; label('call ended', j.Hd[0] + 80, j.Hd[1] + 40); g.restore(); } }
}, [[0, 'ringtone', { d: 1.6 }], [1.6, 'pickup'], [6.4, 'hangup']]);

// 037 · the photo on the fridge
S('037', (t, d) => {
  cam(1);
  rect(-100, -100, 2200, 1300, C2.white, { lw: 0 }); ink([[-100, 420], [2100, 420]], { w: 5 });
  rrect(1680, 520, 40, 300, 20, C2.chrome);
  photoP(960, 620, 5.2, -.05); star5(880, 400, 46, '#E8C35A');
  const reach = ein(t, 1.2, 1.2); bigArm([1700, 1300], [lerp(1600, 1090, reach), lerp(1100, 700, reach)], 34, 4, .22, -2.6);
  dusk(.4 * ein(t, 2.5, 2.5));
}, [[.4, 'family']]);

// 038 · standing at the window for hours (time-lapse)
S('038', (t, d) => {
  cam(1.05, 960, 520);
  livingroom({ win: 'night', winX: 840, door: false, sofa: false, tv: false, lampX: 1500 });
  hero({ x: 960, gy: GY, S: 440 }, P({ la: -.2, lb: .05, ra: .2, rb: -.05, head: -.08 }), { hood: 1, veins: .2 });
  // the wall clock: hands sweep 23:00 → 04:00
  const ck = [1500, 250], u = ss(seg(t, .5, d - .6)), hr = (11 + 5 * u) / 12 * Math.PI * 2, mn = (5 * u * 12) % 1 * Math.PI * 2 + 5 * u * Math.PI * 2;
  circ(ck[0], ck[1], 70, C2.white, { lw: 6 }); line([ck, [ck[0] + Math.sin(hr) * 36, ck[1] - Math.cos(hr) * 36]], C.ink, 7); line([ck, [ck[0] + Math.sin(mn) * 56, ck[1] - Math.cos(mn) * 56]], C.ink, 4);
  night(1);
  const mx = lerp(-150, 150, u); cone([[854 + mx * .2, 234], [1066 + mx * .2, 234], [1150 + mx, GY], [700 + mx, GY]], '#C9D8FF', .2);
  Lb('11 p.m. → 4 a.m.', 124, 150, t, .4, d, { col: C.paper });
}, [[0, 'tickFast', { d: 5.4 }]]);

// 039 · he snaps out of it — barefoot, in the garden
S('039', (t, d) => {
  cam(1);
  street({ sky: '#7D8FB8', moon: true, lampPost: 1240, hx: 520, hs: 1.25, fence: false });
  doorF(520 - 230 * 1.25 + 275 * 1.25 - 20, GY, 130, 230, 1);
  const jolt = t > .3; const p = jolt ? P({ la: -1.1, lb: -1, ra: 1.1, rb: 1, head: Math.sin(t * 9) * .3 * eout(t, 1.6, .5), hy: .01 }) : P({ la: -.2, ra: .2 });
  const j = hero({ x: 1000, gy: GY, S: 420 }, p, { hood: 1, veins: .2 });
  night(1);
  cone([[1214, GY - 410], [1266, GY - 410], [1390, GY], [1090, GY]], '#FFF1B8', .3);
  g.save(); g.globalAlpha = .5; rect(520 - 230 * 1.25 + 275 * 1.25 - 20, GY - 230, 130, 230, '#FFE9A0', { lw: 0 }); g.restore();
  shockLines(j, 420, t, .3, .8);
}, [[.3, 'lowhit'], [0, 'crickets', { d: 5 }]]);

// 040 · feet in the grass
S('040', (t, d) => {
  const up = ss(seg(t, 1.7, d)); cam(lerp(2.6, 6, up * up), lerp(1000, 1000, up), lerp(820, 450, up));
  street({ sky: '#7D8FB8', moon: true, hx: 520, fence: false });
  const back = ein(t, .8, .25);
  const j = hero({ x: 1000 - 30 * back, gy: GY, S: 420 }, P({ la: -.6, lb: .3, ra: .6, rb: -.3, lfx: -.06 * back, head: .3 }), { hood: 1, veins: .2 });
  for (let i = 0; i < 24; i++) { const x = 900 + i * 9; ORIG.line([[x, GY + 2], [x + Math.sin(i) * 6, GY - 16 - (i % 3) * 5]], C2.leafD, 3); }
  for (const s of [-1, 1]) { const f = s < 0 ? j.lL[1] : j.lR[1]; shape(() => g.ellipse(f[0] + 8 * s, f[1] - 2, 14, 6, 0, 0, Math.PI * 2), '#8C6A4A', { lw: 2 }); }
  night(1);
  if (up > .5) { scr(); g.save(); g.globalAlpha = (up - .5) / .5; g.fillStyle = '#2E2C33'; g.fillRect(0, 0, W, H); g.restore(); }
}, [[.8, 'rustle'], [1.8, 'dive']]);

// 041 · the control room, first visit
S('041', (t, d) => {
  const push = ss(seg(t, 3.6, 5.6)); cam(lerp(1, 1.5, push), lerp(960, 960, push), lerp(540, 640, push));
  const th = ein(t, .4, 2.5);
  ctrlRoom(t, { threads: 0, taken: { 2: th }, view: (x, y, r) => { scaled(x, y + r * .8, .45, () => { street({ sky: '#7D8FB8', moon: true, hx: 520, fence: false }); }); g.save(); g.globalAlpha = .5; rect(x - r, y - r, 2 * r, 2 * r, '#3B4670', { lw: 0 }); g.restore(); } });
  // one thread crawls from the wall to the LEGS lever
  const L0 = [[1420, 980], [1300, 900], [1180, 820], [1080, 760], [leverX(2) + 10, CR.panelY + 50]], n = Math.max(2, Math.floor(L0.length * th * 1.2)); ink(L0.slice(0, Math.min(L0.length, n)), { w: 6, col: K.fungus });
  const turn = ein(t, 2.6, .3), stand = ein(t, 3.4, .3);
  littleMe(960, lerpPose(P({ hy: .16, lfx: .1, rfx: .14, la: -.6, lb: .3, ra: .6, rb: -.3 }), P({ la: -1.1, lb: -1.3, ra: 1.1, rb: 1.3, head: .3 }), Math.max(turn * .4, stand)));
  label('Inside your head', 124, 150);
}, [[.2, 'room', { d: 8 }], [.6, 'fungus'], [3.4, 'gasp']]);

// 042 · he wins the legs back; out, the door locked twice
S('042', (t, d) => {
  if (t < 2.2) {
    cam(1.3, 1000, 680);
    const pull = ein(t, .5, .3), snap = t > 1.0;
    ctrlRoom(t, { taken: { 2: snap ? 0 : 1 }, lv: { 2: -pull * .8 }, view: (x, y, r) => { rect(x - r, y - r, 2 * r, 2 * r, '#3B4670', { lw: 0 }); } });
    if (snap && t < 1.5) for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; line([[leverX(2) + Math.cos(a) * 30, CR.panelY + 20 + Math.sin(a) * 30], [leverX(2) + Math.cos(a) * 60, CR.panelY + 20 + Math.sin(a) * 60]], K.fungus, 4); }
    const wipe = ein(t, 1.3, .3); littleMe(960, lerpPose(P({ ra: 2.0, rb: .3, la: -2.0, lb: -.3, lean: -.1 * pull, hy: .02 }), P({ ra: 2.6, rb: 1.6, la: -.4, lb: .2, head: .2 }), wipe));
  } else {
    cam(1.4, 700, 560);
    street({ sky: '#7D8FB8', moon: true, hx: 520, hs: 1.25, fence: false });
    const dx = 520 - 230 * 1.25 + 275 * 1.25 - 20, inside = ein(t, 2.4, .6);
    doorF(dx, GY, 130, 230, 1 - ein(t, 3.2, .3));
    const jig = t > 3.6 ? Math.sin(t * 30) * .15 * bell(t, 3.6, 4.6) : 0;
    hero({ x: lerp(900, dx + 70, inside), gy: GY, S: 420 * (1 - .3 * inside) }, t < 3.2 ? walkP(t * 7, .6) : P({ ra: 1.3 + jig, rb: .1, la: -.3, lb: .2 }), { hood: 1, veins: .2 });
    night(1);
  }
}, [[.5, 'lever'], [1.0, 'snapThread'], [3.3, 'doorShut'], [3.7, 'lock'], [4.1, 'lock']]);
