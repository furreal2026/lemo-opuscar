// Act 5 · realising (Day 6) — grey, overcast; the fungus is the only colour that stays
const INF5 = { veins: .7, hood: 1, arms: 'both' };
const INF5b = { veins: .8, hood: 0, stalks: .7, arms: 'both' };

// 061 · he "wakes" standing in a corner, facing the wall
S('061', (t, d) => {
  const rev = t > 2.0; cam(rev ? 1.1 : 1.3, rev ? 960 : 1500, 520);
  bedroomF(BED_DAY);
  const turn = ein(t, 1.0, .6);
  hero({ x: rev ? 1500 : 1560, gy: GY, S: 440, face: -1 }, P({ la: -.2, lb: .05, ra: .2, rb: -.05, head: lerp(0, .5, turn) }), INF5);
  for (let i = 0; i < 8; i++) dline([[1640 + i * 40, 100], [1640 + i * 40, GY]], '#BBD0DA');
  gloom(1);
  Lb('Day 6', 124, 150, t, .2, d, { col: C.ink });
}, [[0, 'rain', { d: 4 }]]);

// 062 · the room wrecked; flashback: the body did it while he watched
S('062', (t, d) => {
  const fb = t > 2.4 && t < 5.4;
  if (!fb) {
    cam(1.05, lerp(800, 1100, seg(t, 0, d)), 540);
    bedroomF(BED_DAY);
    const r = mulberry(19); for (let i = 0; i < 30; i++) { const x = 100 + r() * 1700, y = 200 + ((r() * 800 + t * 40 * (r() + .3)) % 700); g.save(); g.globalAlpha = .9; withRot(x, y, t + i, () => shape(() => g.ellipse(x, y, 14, 6, 0, 0, Math.PI * 2), C2.white, { lw: 2 })); g.restore(); }
    withRot(bp(545, 420)[0], bp(545, 420)[1], .5, () => rect(bp(490, 400)[0], bp(490, 400)[1], 240, 90, C2.wood));
    rect(bp(70, 300)[0], bp(70, 300)[1], 300, 100, '#F1EDE3'); for (let i = 0; i < 4; i++) ink([[bp(80, 310)[0] + i * 60, bp(80, 310)[1]], [bp(80, 310)[0] + i * 60 + 30, bp(80, 310)[1] + 80]], { w: 3 });
    hero({ x: 1500, gy: GY, S: 440 }, P({ la: -.15, lb: .05, ra: .15, rb: -.05 }), INF5);
    gloom(1);
  } else {
    const inside = t > 3.9;
    if (!inside) { cam(1.05); bedroomF(BED_DAY); const swing = Math.sin(t * 9); hero({ x: 700, gy: GY, S: 440 }, P({ ra: 2.2 + swing * .6, rb: .3, la: -1.6 - swing * .6, lb: -.4, lean: .1 * swing, head: .2 }), { ...INF5, claw: 1 });
      const r = mulberry(4); for (let i = 0; i < 16; i++) { const u = ((t * .7) + i / 16) % 1; circ(400 + r() * 700, 300 + u * 500, 7, C2.white, { lw: 2 }); } night(1); }
    else { cam(1.2, 960, 560); ctrlRoom(t, { threads: .6, taken: { 0: 1, 1: 1 }, view: (x, y, r) => { rect(x - r, y - r, 2 * r, 2 * r, '#3B4670', { lw: 0 }); RAW++; figure({ x, gy: y + r, S: 260, col: '#9AA3BF' }, P({ ra: 2.4, rb: .3, la: -1.6 })); RAW--; } });
      littleMe(960, P({ la: -2.2, lb: -.4, ra: 2.2, rb: .4, head: .05 })); }
    Lb('3:00 a.m.', 124, 150, t, 2.5, 5.3, { col: C.paper });
  }
}, [[.2, 'rain', { d: 2.2 }], [2.4, 'muffle', { d: 3 }], [2.5, 'rip'], [3.1, 'rip'], [3.9, 'room', { d: 1.5 }]]);

// 063 · the hood comes down: the full reveal in the cracked mirror
S('063', (t, d) => {
  const back = ein(t, 4.6, .5), push = ss(seg(t, 1.6, 4.2)); cam(lerp(1.2, 1.7, push) - .3 * back, 960, lerp(450, 380, push));
  const hood = 1 - ein(t, 1.0, .5);
  const pr = P({ la: -.3 - 2.0 * bell(t, .6, 1.8), lb: .2 + 1.6 * bell(t, .6, 1.8), ra: .3 + 2.0 * bell(t, .6, 1.8), rb: -.2 - 1.6 * bell(t, .6, 1.8), hx: -.06 * back });
  bathroom({ crack: 1, lightOff: flicker(t) < 1, reflect: (mx, my, mw, mh) => hero({ x: mx + mw / 2, gy: my + mh + 200, S: 520, face: -1 }, pr, { veins: .85, hood, stalks: ein(t, 1.2, 1.0), arms: 'both' }) });
  gloom(1);
  if (flicker(t) < 1) wash('#3A4050', .3);
}, [[1.0, 'cloth'], [1.6, 'celestaHold'], [4.6, 'step']]);

// 064 · a stalk snaps; a puff of spores
S('064', (t, d) => {
  cam(3.0, 1000, 330);
  const touch = ein(t, .4, .5), cough = Math.max(0, Math.sin((t - 1.4) * 12)) * (t > 1.4 && t < 3 ? 1 : 0);
  bathroom({ crack: 1, reflect: (mx, my, mw, mh) => { const j = hero({ x: mx + mw / 2, gy: my + mh + 200, S: 520, face: -1 }, P({ ra: 2.5 * touch, rb: 1.4 * touch, la: -.3, lb: .2, head: .08 * cough, hy: .01 * cough }), INF5b);
    if (t > 1.2) { const u = t - 1.2, r = mulberry(2); for (let i = 0; i < 40; i++) { const a = r() * 6.28, v = 40 + r() * 120; g.save(); g.globalAlpha = clamp(1 - u / 2.6); circ(j.Hd[0] + 50 + Math.cos(a) * v * (1 - Math.exp(-u * 2)), j.Hd[1] - 40 + Math.sin(a) * v * (1 - Math.exp(-u * 2)) - u * 15, 3 + r() * 4, C.ginger, { lw: 0 }); g.restore(); } } } });
  gloom(1);
}, [[1.2, 'puff'], [1.5, 'cough'], [2.1, 'cough']]);

// 065 · the laptop: an ant with a stalk; the same shape in the mirror
S('065', (t, d) => {
  cam(1.15, 1050, 470);
  const q = 'fungus growing out of head', n = Math.floor(clamp((t - .3) / 1.4) * q.length), res = t > 2.0;
  deskSet({ mirror: true, mirrorFn: (x, y, w, h) => { RAW++; try { hero({ x: x + w / 2, gy: y + h + 70, S: 200, face: -1 }, P({ head: .1 }), { ...INF5b, hood: 0 }); } finally { RAW--; } },
    screen: (x, y, w, h) => { rect(x, y, w, h, '#FFFFFF', { lw: 0 }); rrect(x + 14, y + 12, w - 28, 30, 15, '#EEF1F3', { lw: 2 }); text(q.slice(0, n), x + 26, y + 33, { size: 15, w: 500 }); if (res) { antScene(x + 90, y + 140, .14, 1); antScene(x + 240, y + 140, .14, .9); } } });
  const look = Math.floor(clamp((t - 2.6) / 2.4) * 4) % 2;
  hero({ x: 1000, gy: GY, S: 440, face: 1 }, P({ hy: .14, lfx: .1, rfx: .14, la: -.6, lb: -.8, ra: .6, rb: .8, head: look ? .5 : -.1, lean: .05 }), { ...INF5b, hood: 0 });
  gloom(1);
}, [[.3, 'typing', { d: 1.4 }], [2.0, 'blip']]);

// 066 · a card: 37 °C — the real world is too hot for it
S('066', (t, d) => {
  cam(1);
  thermo(700, 640, 2.4, '37 °C', false);
  const wilt = ein(t, 2.2, 1.2), x = 1180, y = 760;
  line([[x, y], [x + 40 * wilt, y - 260 + 120 * wilt]], C.ink, 14); line([[x, y], [x + 40 * wilt, y - 260 + 120 * wilt]], C.ginger, 7); circ(x + 40 * wilt + 30 * wilt, y - 260 + 160 * wilt, 26, C.ginger, { lw: 5 });
  ground(y + 4, 1040, 1320);
  Tx('Human body: 37 °C', 124, 230, { size: 64, w: 600, track: -1 }, t, .4);
  Tx('too hot for Cordyceps', 124, 300, { size: 40, w: 500, col: C.mute }, t, 1.6);
  Lb('Fiction: Cordyceps does not infect humans', 124, 860, t, 3.0, d, { col: C.red });
}, [[2.2, 'wilt']]);

// 067 · I AM STILL ME — the pen tears the paper
S('067', (t, d) => {
  cam(1);
  rect(-100, -100, 2200, 1300, C2.woodL, { lw: 0 });
  withRot(960, 540, -.04, () => { rect(520, 200, 880, 640, '#FBFAF6', { lw: 5 }); for (let y = 280; y < 820; y += 56) dline([[540, y], [1380, y]], '#BFD7E6'); line([[620, 210], [620, 830]], '#E9A99F', 3); });
  const s = 'I AM STILL ME', n = clamp((t - .4) / 4.2) * s.length; let x = 680;
  for (let i = 0; i < Math.floor(n); i++) { const k = i / s.length, jit = k * k * 26; g.save(); g.translate(x, 560 + Math.sin(i * 2.1) * jit); g.rotate(Math.sin(i * 1.7) * k * .5); text(s[i], 0, 0, { size: 96 - k * 10, w: 600 - 0 }); g.restore(); x += s[i] === ' ' ? 40 : 66 + k * 10; }
  if (t > 4.6) { ink([[x - 40, 520], [x + 60, 600], [x + 140, 540]], { w: 5, sharp: true }); poly([[x, 560], [x + 120, 600], [x + 60, 640]], C2.woodL, { lw: 3 }); }
  const tip = [x + 10, 560]; bigArm([1700, 1300], tip, 30, 0); line([tip, [tip[0] + 90, tip[1] + 90]], C.blue, 18);
  for (let i = 0; i < 3; i++) ink([[1400 - i * 40, 1000 - i * 30], [1300 - i * 40, 900 - i * 30]], { w: 4, col: C.ginger });
}, [[.4, 'pen', { d: 4.2 }], [4.6, 'rip']]);

// 068 · the news: BREAKING, the map fills with orange
S('068', (t, d) => {
  const ins = ss(seg(t, 1.6, 2.4)); cam(lerp(1, 1.7, ins), lerp(960, 1560, ins), lerp(540, 520, ins));
  livingroom({ door: false, win: 'day', lamp: false, screen: (x, y, w, h) => news(x, y, w, h, t, { map: seg(t, 1.6, d) }) });
  const reach = ein(t, 3.4, 1.4);
  hero(...(([f, q]) => [f, q])(sitOn(640, SEAT, 400, { la: -.4, lb: .3, ra: .3 + 1.2 * reach, rb: -.1, lean: .08 + .1 * reach })), INF5b);
  gloom(1);
}, [[.2, 'tvNews', { d: 5.8 }]]);

// 069 · the TV shows armed people behind a barricade
S('069', (t, d) => {
  cam(1);
  rect(-100, -100, 2200, 1300, '#1E2028', { lw: 0 });
  tvSet(260, 120, 1400, 820, 2000, (x, y, w, h) => news(x, y, w, h, t, { barricade: 1, ticker: 'ARMED VOLUNTEERS GUARD THE BRIDGE' }));
  if (t > d - .5) { scr(); const k = ein(t, d - .5, .3); g.save(); g.fillStyle = '#111'; g.globalAlpha = k; g.fillRect(0, 0, W, H); g.restore(); g.save(); g.globalAlpha = 1 - k; circ(W / 2, H / 2, 6, '#FFF', { lw: 0 }); g.restore(); }
}, [[.1, 'tvNews', { d: 3.4 }], [3.5, 'tvoff']]);

// 070 · the photo goes into the hoodie pocket
S('070', (t, d) => {
  cam(1.25, 700, 520);
  kitchen({ fx: 420, photo: t < 1.0, star: true });
  const take = ein(t, .4, .6), pocket = ein(t, 1.6, .7);
  const p = P({ ra: 1.6 - 1.4 * pocket, rb: .2 - .9 * pocket, la: -.4, lb: .2, head: .2 + .2 * take, lean: .03 });
  const j = hero({ x: 700, gy: GY, S: 440, face: -1 }, p, { ...INF5b, hood: 1 });
  if (t >= 1.0 && t < 2.2) { const h = handR(j); photoP(h[0], h[1] - 10, .8, .1); }
  if (t > 2.2) { const pt = [j.Hp[0] + 20, j.Hp[1] - 40]; rect(pt[0] - 30, pt[1] - 20, 60, 40, HOOD, { lw: 4 }); }
  gloom(1);
}, [[.4, 'family'], [2.2, 'cloth']]);

// 071 · he holds the fridge shut with his whole body
S('071', (t, d) => {
  const pov = t > .6 && t < 1.8; const [sx, sy] = shake(t, 2.2, 6, .2); cam(pov ? 2.2 : 1.1, pov ? 420 : 560, pov ? 600 : 540, sx, sy);
  const bump = t > 2.0 ? Math.max(0, Math.sin((t - 2) * 7)) : 0;
  kitchen({ fx: 420, open: pov ? .8 : bump * .12, inside: (x0, top, w, h) => steak(x0 + w / 2, top + 270, 1.1, pov ? .8 + .2 * Math.sin(t * 10) : 0) });
  if (!pov) hero({ x: 620, gy: GY, S: 440, prof: true, face: -1 }, P({ lean: -.18, ra: -1.6, rb: -.3, la: -1.4, lb: -.2, lfx: .08, rfx: .16, head: -.2, hy: .02 }), INF5b);
  gloom(1);
}, [[.6, 'fridgeOpen'], [1.8, 'slam'], [2.3, 'thud'], [3.2, 'thud'], [4.1, 'thud']]);

// 072 · sticky notes on the levers: NO · MIA · LEO · DON'T
S('072', (t, d) => {
  cam(1.2, 960, 660);
  const nk = i => t - (.6 + i * 1.0);
  ctrlRoom(t, { threads: .5, taken: { 0: .6, 1: 1 }, notes: [[0, 'NO', nk(0)], [1, 'MIA', nk(1)], [2, 'LEO', nk(2)], [3, "DON'T", nk(3)]], view: (x, y, r) => rect(x - r, y - r, 2 * r, 2 * r, '#C9C9C9', { lw: 0 }) });
  const i = clamp(Math.floor((t - .3) / 1.0), 0, 3), tap = Math.max(0, Math.sin((t - .3) * Math.PI * 2));
  littleMe(leverX(i), P({ ra: 2.5 - .3 * tap, rb: .3, la: -.5, lb: .3 }));
}, [[.6, 'stick'], [1.6, 'stick'], [2.6, 'stick'], [3.6, 'stick']]);

// 073 · time-lapse: the barricade goes up
S('073', (t, d) => {
  cam(1);
  const u = seg(t, .2, d - .5);
  livingroom({ doorX: 120, sofaX: lerp(560, 220, ss(clamp(u * 2))), tv: false, lampX: 1500, win: u > .7 ? 'dusk' : 'day' });
  const nb = Math.floor(u * 6); for (let i = 0; i < nb; i++) box(160 + (i % 3) * 180, GY - 230 - Math.floor(i / 3) * 150, 170, 140, { label: i % 2 === 0 });
  const ph = (t * 4) % 1, x = lerp(1300, 700, Math.abs(Math.sin(t * 2.2)));
  hero({ x, gy: GY, S: 420, prof: true, face: Math.cos(t * 2.2) > 0 ? -1 : 1 }, P({ lean: .3, la: -1.4, lb: -.3, ra: -1.3, rb: -.2, hy: .03, lfx: .08 * Math.sin(ph * 6.28), rfx: -.08 * Math.sin(ph * 6.28) }), INF5b);
  gloom(1); if (u > .7) night((u - .7) / .3 * .8);
}, [[.3, 'drag'], [1.6, 'boxThud'], [2.6, 'boxThud'], [3.6, 'boxThud'], [4.6, 'boxThud'], [0, 'pizzFast', { d: 6 }]]);

// 074 · inside the box fort; his veins glow in the dark
S('074', (t, d) => {
  cam(1.15, 960, 600);
  rect(-100, -100, 2200, 1300, K.lilac, { lw: 0 }); ground(GY, -400, 2400);
  for (const [x, gy2, w, h] of [[200, GY, 300, 260], [500, GY, 260, 300], [1260, GY, 300, 280], [1540, GY, 260, 240], [300, GY - 260, 280, 200], [1320, GY - 280, 260, 200]]) box(x, gy2, w, h, { label: false });
  const j = hero({ x: 960, gy: GY, S: 420 }, breathe(PS.hug(), t, 0, 2), { ...INF5b, hood: 1 });
  rect(820, GY - 70, 280, 70, '#8FA0C0', { lw: 4 });
  night(1.15);
  cone([[1500, 100], [1700, 100], [1300, GY], [900, GY]], '#C9D8FF', .12);
  // the veins, bright on top of the dark
  g.save(); g.globalAlpha = .6 + .3 * Math.sin(t * 2); hero({ x: 960, gy: GY, S: 420, col: 'rgba(0,0,0,0)', fill: 'rgba(0,0,0,0)' }, breathe(PS.hug(), t, 0, 2), { veins: .9, arms: 'both' }); g.restore();
  SUBDARK = true;
}, [[0, 'roomtone', { d: 6 }]]);

// 075 · Mia: "We're coming to get you." He types NO — the thumb hits "ok"
S('075', (t, d) => {
  cam(1);
  rect(-100, -100, 2200, 1300, '#22283A', { lw: 0 });
  const n = Math.floor(clamp((t - 2.2) / .6) * 2);
  bigPhone(660, 110, 600, 770, (x, y, w, h) => { rect(x, y, w, h, '#F7F9FA', { lw: 0 }); rect(x, y, w, 90, '#EEF1F3', { lw: 0 }); text('Mia ♥', x + w / 2, y + 60, { size: 32, w: 600, align: 'center' });
    let yy = y + 120; yy += chat(x, yy, w, "Are you ok??", false, ein(t, .3, .2)); yy += chat(x, yy, w, "We're coming to get you.", false, ein(t, 1.0, .2)); yy += chat(x, yy, w, 'Stay there.', false, ein(t, 1.6, .2));
    if (t > 3.6) chat(x, yy + 10, w, 'ok', true, ein(t, 3.6, .15));
    rrect(x + 20, y + h - 160, 120, 56, 14, '#E4E7EA', { lw: 0 }); text('ok', x + 80, y + h - 122, { size: 28, w: 600, align: 'center' }); rrect(x + 160, y + h - 160, 160, 56, 14, '#E4E7EA', { lw: 0 }); text('sorry', x + 240, y + h - 122, { size: 26, w: 500, align: 'center' });
    rrect(x + 20, y + h - 90, w - 40, 64, 32, '#FFFFFF', { lw: 3 }); text(t < 3.6 ? 'NO'.slice(0, n) : '', x + 44, y + h - 46, { size: 28, w: 600 }); });
  const tx = t < 3.3 ? 860 : lerp(860, 735, ein(t, 3.3, .2)), ty = t < 3.3 ? 860 : 790;
  bigArm([1500, 1300], [tx + Math.sin(t * 30) * 6, ty], 30, 1, 0, -2.5);
  for (let i = 0; i < 3; i++) ink([[1500 - i * 60, 1150 - i * 20], [1350 - i * 60, 1000 - i * 30]], { w: 4, col: C.ginger });
  if (t > d - .6) { scr(); g.save(); g.globalAlpha = ein(t, d - .6, .5); g.fillStyle = '#111'; g.fillRect(0, 0, W, H); g.restore(); }
  SUBDARK = true;
}, [[.3, 'msg'], [1.0, 'msg'], [1.6, 'msg'], [2.2, 'tap'], [2.5, 'tap'], [3.4, 'tap'], [3.6, 'whooshSend']]);
