function microwave(x, y, k, ding) { scaled(x, y, k, () => { rrect(x - 110, y - 130, 220, 130, 10, C2.white); rrect(x - 95, y - 115, 130, 100, 6, ding ? C.wall : '#3A4052', { lw: DL });
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) circ(x + 62 + i * 14, y - 92 + j * 18, 4, C.ink, { lw: 0 }); rect(x + 50, y - 40, 50, 14, C.screen, { lw: 2 }); text('0:00', x + 75, y - 29, { size: 12, w: 600, align: 'center' }); }); }
function floorLamp(x, gy, rot) { withRot(x, gy, rot, () => { shape(() => g.ellipse(x, gy - 8, 60, 12, 0, 0, Math.PI * 2), C2.chrome, { lw: 5 }); line([[x, gy - 10], [x, gy - 330]], C.ink, 10); line([[x, gy - 10], [x, gy - 330]], C2.chrome, 4);
  poly([[x - 80, gy - 330], [x + 80, gy - 330], [x + 50, gy - 440], [x - 50, gy - 440]], C.wall); for (const dx of [-40, 0, 40]) dline([[x + dx * .9, gy - 336], [x + dx * .6, gy - 434]], '#D9B65E'); }); }
// Sets (the user's existing environments, re-dressed) and props for the zombie episode.
// Built from the Colour Stick v2 / Meow Man sets: houseD, fence, tree, box, bedroom, fridge, microwave, bread, tableP, floorLamp, the mirror, the TV, the desk, the diner.
const K = { wallK: '#F1E6C8', tileK: '#DDEBE6', lilac: '#E9E2F0', lilacL: '#D7CDE2', cafeW: '#F3E3CF', skyD: '#CFE8F2', walk: '#D9D4C9', road: '#B9B5AD', fungus: C.ginger, meat: '#E58C8C', meatL: '#F2B8B0', mint: '#A8D5BA' };

// ---------- the kitchen (Meow Man S9/S10: fridge, microwave, bread, counter) ----------
function fridgeBig(x, gy, open = 0, o = {}) {
  const w = 230, h = 540, x0 = x - w / 2, top = gy - h;
  if (open > 0) {   // the inside, lit
    rect(x0, top, w, h, '#FFF6D8', { lw: 6 });
    for (const yy of [top + 150, top + 270, top + 390]) { line([[x0 + 8, yy], [x0 + w - 8, yy]], C2.chrome, 6); for (let k = 0; k < 9; k++) ORIG.line([[x0 + 14 + k * 24, yy - 2], [x0 + 14 + k * 24, yy + 2]], C.mute, 2); }
    rect(x0 + 8, top + 8, w - 16, 120, '#F2F7F9', { lw: DL }); circ(x0 + w - 24, top + 24, 7, '#FFF3B0', { lw: 2 });
    if (o.inside) o.inside(x0, top, w, h);
    const dw = w * Math.sin(open * Math.PI / 2) * .5;      // the door, swung open to the left
    poly([[x0, top], [x0 - dw, top + 26], [x0 - dw, gy - 26], [x0, gy]], C2.white);
    if (dw > 30) { for (const yy of [top + 160, top + 300, top + 430]) line([[x0 - dw + 8, yy + 6], [x0 - 6, yy]], C2.chrome, 5); rect(x0 - dw * .7, top + 120, 14, 36, '#E8C35A', { lw: 3 }); rect(x0 - dw * .45, top + 116, 14, 40, C.red, { lw: 3 }); }
  } else {
    rrect(x0, top, w, h, 14, C2.white); dline([[x0, top + 170], [x0 + w, top + 170]]);
    rrect(x0 + w - 34, top + 40, 12, 80, 6, C2.chrome, { lw: DL }); rrect(x0 + w - 34, top + 200, 12, 120, 6, C2.chrome, { lw: DL });
    circ(x0 + 40, top + 60, 13, C.red, { lw: 3 }); rect(x0 + 120, top + 40, 40, 50, C.wall, { lw: 3 }); for (let i = 0; i < 3; i++) ORIG.line([[x0 + 126, top + 54 + i * 10], [x0 + 154, top + 54 + i * 10]], C.mute, 2);
    if (o.photo !== false) photoP(x0 + 70, top + 260, 1, -.05, o.photoT);
    if (o.star) star5(x0 + 70, top + 228, 12, '#E8C35A');
  }
}
function star5(x, y, r, col) { const P = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; P.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); } poly(P, col, { lw: 3 }); }
// the family photo: two small figures with ice creams (planted on the fridge, carried to the end)
function photoP(x, y, s = 1, rot = 0, corner = 0) {
  withRot(x, y, rot, () => { scaled(x, y, s, () => {
    rect(x - 46, y - 38, 92, 76, C2.white, { lw: 4 }); rect(x - 38, y - 30, 76, 52, C.sky, { lw: 2 }); rect(x - 38, y + 6, 76, 16, C.grass, { lw: 0 });
    RAW++; try { figure({ x: x - 14, gy: y + 20, S: 40, lwk: .35, lws: .5 }, P({ ra: 1.2, rb: -.4 })); figure({ x: x + 16, gy: y + 20, S: 32, lwk: .35, lws: .5 }, P({ la: -1.2, lb: .4 })); } finally { RAW--; }
    for (const [cx, cy] of [[x + 2, y - 4], [x + 2, y - 2]]) { poly([[cx - 4, cy], [cx + 4, cy], [cx, cy + 9]], C2.woodL, { lw: 1.5 }); circ(cx, cy - 2, 4, C.pink, { lw: 1.5 }); }
    if (corner) poly([[x + 46, y - 38], [x + 30, y - 38], [x + 46, y - 22]], C2.white, { lw: 3 });
  }); });
}
function counterK(x0, x1, top, gy) {
  rect(x0, top, x1 - x0, 26, C2.woodL); rect(x0 + 10, top + 26, x1 - x0 - 20, gy - top - 26, C2.wood);
  for (let x = x0 + 10, i = 0; x < x1 - 20; x += 190, i++) { rect(x + 8, top + 44, 172, gy - top - 64, C2.woodL, { lw: DL }); rrect(x + (i % 2 ? 24 : 150), top + 60, 10, 46, 5, C2.chrome, { lw: DL }); }
}
function kitchen(o = {}) {
  rect(-200, 100, 2400, GY - 100, K.wallK, { lw: 0 });
  rect(640, 520, 920, 120, K.tileK, { lw: 0 }); for (let x = 640; x <= 1560; x += 46) dline([[x, 520], [x, 640]], '#BCD3CC'); for (let y = 520; y <= 640; y += 40) dline([[640, y], [1560, y]], '#BCD3CC');
  // upper cabinets
  rect(700, 200, 420, 230, C2.woodL); dline([[910, 200], [910, 430]]); rrect(890, 380, 10, 34, 5, C2.chrome, { lw: DL }); rrect(920, 380, 10, 34, 5, C2.chrome, { lw: DL });
  // window
  const nightW = o.night; rect(1220, 210, 260, 230, C2.wood); rect(1236, 226, 228, 198, nightW ? C2.skyN : C.sky, { lw: DL }); dline([[1350, 226], [1350, 424]]); dline([[1236, 325], [1464, 325]]);
  if (nightW) circ(1410, 270, 22, '#E9E6D2', { lw: DL }); else poly([[1250, 240], [1300, 240], [1250, 300]], C2.white, { lw: 0 });
  rect(1210, 440, 280, 12, C2.white, { lw: 4 });
  counterK(620, 1600, 640, GY);
  ground(GY, -400, 2400);
  microwave(1060, 640, 1.05, false);
  // kettle and a pot of utensils
  shape(() => { g.moveTo(1400, 640); g.lineTo(1410, 575); g.quadraticCurveTo(1440, 555, 1470, 575); g.lineTo(1480, 640); g.closePath(); }, C2.chrome); line([[1478, 590], [1505, 575]], C.ink, 6);
  rect(760, 590, 46, 50, C.blue); for (const [a, c] of [[-.3, C2.wood], [0, C2.chrome], [.3, C2.wood]]) line([[783, 592], [783 + Math.sin(a) * 50, 592 - Math.cos(a) * 60]], c === C2.wood ? C.ink : C.ink, 5);
  if (o.bread) breadMoldy(o.breadX ?? 900, 640, o.breadK ?? 1, o.mold ?? 0, o.bitten);
  fridgeBig(o.fx ?? 420, GY, o.open || 0, o);
  if (o.binX) binP(o.binX, GY, o.binLid || 0);
}
function breadMoldy(x, y, k = 1, mold = 0, bitten = 0, bg = K.wallK) {
  scaled(x, y, k, () => {
    shape(() => { g.moveTo(x - 70, y); g.lineTo(x - 70, y - 60); g.arc(x - 34, y - 70, 38, Math.PI, Math.PI * 1.9); g.arc(x + 34, y - 70, 38, Math.PI * 1.1, 0); g.lineTo(x + 72, y - 60); g.lineTo(x + 72, y); g.closePath(); }, '#E3B877');
    for (let i = 0; i < 3; i++) dline([[x - 40 + i * 34, y - 92], [x - 24 + i * 34, y - 78]], '#B9833F');
    if (bitten > 0) { g.save(); g.globalCompositeOperation = 'destination-out'; g.restore(); for (let i = 0; i < 3; i++) circ(x + 64 - i * 4, y - 70 + i * 22, 20 * bitten, bg, { lw: 0 }); }
    if (mold > 0) { const r = mulberry(3); for (let i = 0; i < 16; i++) { const px = x - 50 + r() * 70, py = y - 8 - r() * 26; g.save(); g.globalAlpha = mold; circ(px, py, 3 + r() * 6, i % 3 ? '#9FA58E' : K.fungus, { lw: 0 }); g.restore(); }
      if (mold > .6) for (let i = 0; i < 10; i++) { const px = x - 46 + r() * 64, py = y - 10 - r() * 20; ORIG.line([[px, py], [px + (r() - .5) * 10, py - 8]], '#8C927C', 1.5); } }
    rect(x - 80, y - 4, 160, 6, null, { lw: 0 });
  });
}
function binP(x, gy, lid = 0) { poly([[x - 50, gy - 130], [x + 50, gy - 130], [x + 42, gy], [x - 42, gy]], C2.chrome); for (let i = 0; i < 4; i++) dline([[x - 30 + i * 20, gy - 110], [x - 26 + i * 18, gy - 16]], '#9AA5AD');
  withRot(x + 52, gy - 130, -lid * .9, () => rrect(x - 56, gy - 142, 112, 14, 6, C2.chrome)); rect(x - 60, gy - 8, 30, 8, C.ink, { lw: 0 }); }

// ---------- the bathroom (Meow Man S2) ----------
function bathroom(o = {}) {
  rect(-200, 100, 2400, GY - 100, C2.tile, { lw: 0 });
  for (let x = -200; x <= 2200; x += 64) dline([[x, 100], [x, GY]], '#B7CDD3'); for (let y = 100; y <= GY; y += 64) dline([[-200, y], [2200, y]], '#B7CDD3');
  const mx = o.mx ?? 760, my = o.my ?? 190, mw = o.mw ?? 400, mh = o.mh ?? 440;
  rrect(mx - 20, my - 20, mw + 40, mh + 40, 26, C2.wood); rrect(mx, my, mw, mh, 14, C.screen, { lw: DL });
  g.save(); g.beginPath(); g.roundRect(mx, my, mw, mh, 14); g.clip(); if (o.reflect) o.reflect(mx, my, mw, mh);
  for (const [a, b] of [[[mx + 30, my + 40], [mx + 90, my + 12]], [[mx + 30, my + 90], [mx + 150, my + 20]]]) line([a, b], C2.white, 8);
  if (o.crack > 0) { const cx = mx + mw * .62, cy = my + mh * .42, r = mulberry(4); for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2 + r() * .4, L = (90 + r() * 200) * o.crack; ink([[cx, cy], [cx + Math.cos(a) * L * .5 + (r() - .5) * 20, cy + Math.sin(a) * L * .5], [cx + Math.cos(a) * L, cy + Math.sin(a) * L]], { w: 3, col: C.ink, amp: .5, sharp: true }); }
    g.save(); g.strokeStyle = C.ink; g.lineWidth = 2.5; g.beginPath(); g.arc(cx, cy, 40 * o.crack, 0, Math.PI * 2); g.stroke(); g.restore(); }
  g.restore();
  const cy0 = my + mh + 70; rect(mx - 60, cy0, mw + 120, 34, C2.white); shape(() => g.ellipse(mx + mw / 2, cy0 + 2, 120, 16, 0, 0, Math.PI * 2), C.screen, { lw: DL });
  rrect(mx + mw / 2 - 12, cy0 - 60, 24, 60, 6, C2.chrome); rrect(mx + mw / 2 - 12, cy0 - 60, 70, 20, 8, C2.chrome);
  rect(mx - 35, cy0 + 34, mw + 70, GY - cy0 - 34, C2.woodL); dline([[mx + mw / 2, cy0 + 34], [mx + mw / 2, GY]]);
  rect(mx + mw - 10, cy0 - 60, 44, 60, C.blue); line([[mx + mw + 2, cy0 - 60], [mx + mw - 8, cy0 - 104]], C.red, 6); line([[mx + mw + 22, cy0 - 60], [mx + mw + 34, cy0 - 100]], C.grass, 6);
  // the strip light above the mirror
  rect(mx + 40, my - 64, mw - 80, 22, o.lightOff ? '#C9CED2' : '#FFFBE8', { lw: 5 });
  ground(GY, -400, 2400);
}

// ---------- the bedroom (Meow Man S3, day and night palettes) ----------
const BED_DAY = { line: C.ink, wall: '#CFE0E8', floor: '#C9B79C', glass: C.sky, moon: '#FFF3B8', curtain: '#E9A99F', wood: C2.wood, blanket: C.blue, pillow: C2.white, lamp: C.wall, sock: C.pink, remote: C2.chrome };
const BED_NIGHT = { line: C2.nightL, wall: C2.night, floor: '#171B2A', glass: '#232A40', moon: '#3A4260', curtain: '#20263A', wood: '#20263A', blanket: '#212739', pillow: '#232A3E', lamp: '#252C42', sock: '#1F2436', remote: '#1E2334' };
const BK = 2.5, BX = -40, BY = -160;          // the bedroom drawn full-frame: room point (u,v) → (BX+u*BK, BY+v*BK)
const bp = (u, v) => [BX + u * BK, BY + v * BK];
function bedroomF(pal = BED_DAY) { bedroom(BX, BY, 800 * BK, 520 * BK, pal); }

// ---------- the living room (Meow Man S7/S12: lilac wall, window, TV on legs, floor lamp) ----------
function sofa(x0, x1, gy, col = '#7FA6E0') {
  const h = 210, sh = 75; rrect(x0, gy - h, x1 - x0, h - 30, 26, col); rrect(x0 - 26, gy - 150, 70, 120, 24, col); rrect(x1 - 44, gy - 150, 70, 120, 24, col);
  const n = 3, cw = (x1 - x0 - 60) / n; for (let i = 0; i < n; i++) { rrect(x0 + 30 + i * cw, gy - sh - 20, cw - 6, 70, 16, '#9BBBEA'); for (let k = 0; k < 3; k++) dline([[x0 + 50 + i * cw + k * cw * .3, gy - sh - 4], [x0 + 50 + i * cw + k * cw * .3, gy - sh + 34]], '#6E93CC'); }
  for (const x of [x0 + 10, x1 - 30]) rect(x, gy - 30, 20, 30, C2.wood, { lw: 4 });
}
function tvSet(tx, ty, tw, th, gy, screen) {
  line([[tx + 120, ty + th], [tx + 90, gy]], C.ink, 8); line([[tx + tw - 120, ty + th], [tx + tw - 90, gy]], C.ink, 8);
  rrect(tx, ty, tw, th, 14, C.ink, { lw: 0 }); rect(tx + 18, ty + 18, tw - 36, th - 50, screen ? C.screen : '#2E3442', { lw: 0 });
  for (let i = 0; i < 3; i++) circ(tx + tw - 50 - i * 22, ty + th - 16, 5, C2.chrome, { lw: 0 });
  if (screen) { g.save(); g.beginPath(); g.rect(tx + 18, ty + 18, tw - 36, th - 50); g.clip(); screen(tx + 18, ty + 18, tw - 36, th - 50); g.restore(); }
  else { poly([[tx + 40, ty + 30], [tx + 120, ty + 30], [tx + 40, ty + 90]], '#3E4556', { lw: 0 }); }
}
function windowL(x, y, w, h, kind = 'day', blinds = 0) {
  rect(x, y, w, h, C2.wood); rect(x + 14, y + 14, w - 28, h - 28, kind === 'night' ? C2.skyN : kind === 'dusk' ? '#F4C9A4' : C.sky, { lw: DL });
  if (kind === 'night') circ(x + w * .7, y + h * .35, 20, '#E9E6D2', { lw: DL });
  dline([[x + w / 2, y + 14], [x + w / 2, y + h - 14]]);
  if (blinds > 0) for (let yy = y + 20; yy < y + 14 + (h - 28) * blinds; yy += 18) rect(x + 14, yy, w - 28, 11, '#EEE7D8', { lw: 2 });
  rect(x - 10, y + h, w + 20, 12, C2.white, { lw: 4 });
}
function doorF(x, gy, w = 190, h = 440, open = 0, col = C.blue, xMark = 0) {
  rect(x - 12, gy - h - 12, w + 24, h + 12, C2.white, { lw: 5 });
  rect(x, gy - h, w, h, open > 0 ? '#FFF3C4' : col);
  if (open > 0) { const dw = w * Math.cos(open * Math.PI / 2); rect(x, gy - h, dw, h, col); }
  else { rect(x + w * .12, gy - h * .93, w * .76, h * .34, null, { lw: DL }); rect(x + w * .12, gy - h * .52, w * .76, h * .39, null, { lw: DL }); circ(x + w - 26, gy - h * .48, 10, C.wall, { lw: DL }); }
  if (xMark > 0 && open <= 0) { const k = xMark, cx = x + w / 2, cy = gy - h * .6; g.save(); g.lineCap = 'round'; g.strokeStyle = C.red; g.lineWidth = 16;
    g.beginPath(); g.moveTo(cx - 70, cy - 80); g.lineTo(cx - 70 + 140 * clamp(k * 2), cy - 80 + 160 * clamp(k * 2)); g.stroke();
    if (k > .5) { g.beginPath(); g.moveTo(cx + 70, cy - 80); g.lineTo(cx + 70 - 140 * clamp(k * 2 - 1), cy - 80 + 160 * clamp(k * 2 - 1)); g.stroke(); }
    for (const [dx, dl] of [[-40, 40], [10, 60], [55, 30]]) if (k > .8) ORIG.line([[cx + dx, cy + 40], [cx + dx, cy + 40 + dl * (k - .8) * 5]], C.red, 6); g.restore(); }
}
function livingroom(o = {}) {
  rect(-200, 100, 2400, GY - 100, K.lilac, { lw: 0 }); for (let x = 0; x < 2200; x += 260) dline([[x, 100], [x, GY]], K.lilacL);
  windowL(o.winX ?? 1180, 220, 240, 190, o.win || 'day', o.blinds || 0);
  ground(GY, -400, 2400);
  shape(() => g.ellipse(o.rugX ?? 760, GY + 14, 520, 30, 0, 0, Math.PI * 2), '#D9A9B6', { lw: 5 });
  if (o.door !== false) doorF(o.doorX ?? -60, GY, 190, 440, o.doorOpen || 0, C.blue, o.xMark || 0);
  if (o.sofa !== false) sofa(o.sofaX ?? 360, (o.sofaX ?? 360) + 620, GY);
  if (o.lamp !== false) floorLamp(o.lampX ?? 1100, GY, 0);
  if (o.tv !== false) tvSet(o.tvX ?? 1300, 360, 520, 360, GY, o.screen);
}

// ---------- the street (Meow Man S1/S5: houseD, fence, trees) ----------
function street(o = {}) {
  const sky = o.sky || K.skyD; rect(-300, 100, 2600, GY - 100, sky, { lw: 0 });
  if (o.sun) { const k = o.sun; circ(o.sunX ?? 1650, 230, 50 + 6 * k, C.sun, { lw: 5 }); for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; line([[(o.sunX ?? 1650) + Math.cos(a) * 75, 230 + Math.sin(a) * 75], [(o.sunX ?? 1650) + Math.cos(a) * (95 + 20 * k), 230 + Math.sin(a) * (95 + 20 * k)]], C.ink, 5); } }
  if (o.moon) circ(1600, 220, 36, '#E9E6D2', { lw: 5 });
  const hs = o.hs ?? 1;   // house scale about the ground
  scaled(o.hx ?? 520, GY, hs, () => { houseD((o.hx ?? 520) - 230, (o.hx ?? 520) + 230, GY, GY - 400, GY - 600); if (o.lit) { g.save(); g.globalAlpha = o.lit; rect((o.hx ?? 520) - 180, GY - 350, 110, 100, '#FFE9A0', { lw: 0 }); g.restore(); } });
  if (o.neighbour !== false) scaled(1520, GY, .9, () => houseD(1300, 1760, GY, GY - 380, GY - 560));
  if (o.trees !== false) { tree(o.treeX ?? 1060, GY, 380); tree(1900, GY, 330); }
  if (o.lampPost) { line([[o.lampPost, GY], [o.lampPost, GY - 420]], C.ink, 10); rect(o.lampPost - 30, GY - 440, 60, 30, '#3A4052'); if (o.lampOn) cone([[o.lampPost - 26, GY - 410], [o.lampPost + 26, GY - 410], [o.lampPost + 150, GY], [o.lampPost - 150, GY]], '#FFF1B8', .35); }
  ground(GY, -400, 2400);
  sidewalkRoad();
  if (o.fence !== false) fence(o.f0 ?? -100, o.f1 ?? 280, GY, 70), fence(o.f2 ?? 780, o.f3 ?? 1240, GY, 70);
}
function bicycle(x, gy, k = 1) { scaled(x, gy, k, () => { for (const dx of [-70, 70]) { circ(x + dx, gy - 46, 46, null, { lw: 6 }); for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI; ORIG.line([[x + dx - Math.cos(a) * 44, gy - 46 - Math.sin(a) * 44], [x + dx + Math.cos(a) * 44, gy - 46 + Math.sin(a) * 44]], C.mute, 1.5); } }
  line([[x - 70, gy - 46], [x - 10, gy - 110], [x + 50, gy - 110], [x + 70, gy - 46]], C.red === undefined ? C.ink : C.blue, 7); line([[x - 10, gy - 110], [x, gy - 46], [x - 70, gy - 46]], C.blue, 7); line([[x + 50, gy - 110], [x + 44, gy - 140]], C.ink, 6); line([[x - 20, gy - 124], [x + 4, gy - 124]], C.ink, 8);
  rect(x + 50, gy - 150, 50, 30, C2.woodL, { lw: 4 }); }); }
function pigeon(x, y, k = 1, flap = 0) { scaled(x, y, k, () => { shape(() => g.ellipse(x, y, 34, 22, 0, 0, Math.PI * 2), '#A9AFB8', { lw: 5 }); circ(x + 30, y - 18, 14, '#A9AFB8', { lw: 5 }); poly([[x + 42, y - 20], [x + 56, y - 16], [x + 42, y - 12]], C.wall, { lw: 3 }); circ(x + 34, y - 21, 3, C.ink, { lw: 0 });
  const wa = flap ? Math.sin(flap * 30) * .8 : 0; withRot(x - 4, y - 6, -wa, () => shape(() => g.ellipse(x - 14, y - 6, 26, 12, -.3, 0, Math.PI * 2), '#8E95A0', { lw: 4 })); line([[x - 4, y + 20], [x - 8, y + 34]], C.pink, 4); line([[x + 8, y + 20], [x + 8, y + 34]], C.pink, 4); }); }
function hoseP(P0, P1, spray = 0) { ink([P0, [lerp(P0[0], P1[0], .3), P0[1] + 40], [lerp(P0[0], P1[0], .7), P1[1] + 30], P1], { w: 9, col: C.ink }); ink([P0, [lerp(P0[0], P1[0], .3), P0[1] + 40], [lerp(P0[0], P1[0], .7), P1[1] + 30], P1], { w: 4, col: C2.leaf });
  if (spray) for (let i = 0; i < 6; i++) { const a = spray.a + (i - 2.5) * .08, L = 120 + i * 10; g.save(); g.globalAlpha = .7; g.setLineDash([10, 14]); g.lineDashOffset = -spray.t * 200; g.strokeStyle = '#7FB6E6'; g.lineWidth = 4; g.beginPath(); g.moveTo(...P1); g.quadraticCurveTo(P1[0] + Math.cos(a) * L * .6, P1[1] + Math.sin(a) * L * .6 - 40, P1[0] + Math.cos(a) * L, P1[1] + Math.sin(a) * L + 20); g.stroke(); g.restore(); } }

// ---------- the café (Meow Man S11: menu board, tables) ----------
function cafe(o = {}) {
  rect(-200, 100, 2400, GY - 100, K.cafeW, { lw: 0 }); for (let y = 640; y < GY; y += 34) dline([[-200, y], [2200, y]], '#E3CDB2');
  rect(-200, 620, 2400, 14, C2.wood, { lw: 4 });
  // menu board
  rect(1080, 160, 380, 250, C.ink, { lw: 0 }); text('MENU', 1270, 210, { size: 30, w: 600, col: C2.white, align: 'center', track: 4 });
  ['ESPRESSO', 'LATTE', 'TOAST', 'SOUP OF THE DAY'].forEach((it, i) => { const j = o.swim ? Math.sin((o.t || 0) * 5 + i * 1.7) * 9 * o.swim : 0; text(it, 1110 + j, 254 + i * 36 + j * .4, { size: 20, w: 500, col: '#E9E4DA', track: 1 }); text('$' + [3, 4, 5, 6][i], 1430 - j, 254 + i * 36, { size: 22, w: 600, col: C.wall, align: 'right' }); });
  line([[1100, 224], [1440, 224]], '#8A8F9C', 2);
  // the window with the name
  rect(160, 180, 560, 360, C2.wood); rect(176, 196, 528, 328, C.sky, { lw: DL }); dline([[440, 196], [440, 524]]);
  text('CAFÉ', 300, 300, { size: 64, w: 600, col: '#FFFFFF', align: 'center', track: 6, a: .8 }); poly([[200, 220], [280, 220], [200, 320]], C2.white, { lw: 0 });
  // counter + espresso machine
  if (o.counter !== false) { rect(1500, 560, 520, 320, C2.woodL); rect(1500, 540, 520, 26, C2.wood); rrect(1560, 420, 170, 120, 10, C2.chrome); rect(1580, 440, 70, 40, '#3A4052', { lw: 3 }); for (const x of [1600, 1660]) line([[x, 540], [x, 515]], C.ink, 6); rrect(1590, 505, 30, 26, 4, C2.white, { lw: 3 }); }
  ground(GY, -400, 2400);
}
function cup(x, y, k = 1) { scaled(x, y, k, () => { rrect(x - 20, y - 34, 40, 34, 6, C2.white, { lw: 4 }); g.save(); g.strokeStyle = C.ink; g.lineWidth = 4; g.beginPath(); g.arc(x + 22, y - 18, 9, -Math.PI / 2, Math.PI / 2); g.stroke(); g.restore(); shape(() => g.ellipse(x, y, 32, 6, 0, 0, Math.PI * 2), C2.white, { lw: 3 }); }); }
function chair(x, gy, face = 1, tip = 0) { withRot(x, gy, tip, () => { line([[x - 30 * face, gy], [x - 30 * face, gy - 110]], C.ink, 7); line([[x + 30 * face, gy], [x + 30 * face, gy - 110]], C.ink, 7); rect(x - 40, gy - 120, 80, 14, C2.wood, { lw: 4 }); line([[x - 34 * face, gy - 120], [x - 40 * face, gy - 240]], C.ink, 7); rect(x - 46 * face - 4, gy - 240, 14, 80, C2.wood, { lw: 3 }); }); }

// ---------- the desk (Meow Man S6) with a laptop ----------
function deskSet(o = {}) {
  rect(-200, 100, 2400, GY - 100, '#E6EEF0', { lw: 0 }); for (let x = 0; x < 2200; x += 220) dline([[x, 100], [x, GY]], '#D2DEE2');
  windowL(160, 260, 300, 260, o.win || 'day');
  ground(GY, -400, 2400);
  const dt = 620; rect(600, dt, 920, 32, C2.woodL); rect(630, dt + 32, 30, GY - dt - 32, C2.wood); rect(1470, dt + 32, 30, GY - dt - 32, C2.wood);
  rect(1150, dt + 32, 300, 170, C2.woodL); dline([[1150, dt + 90], [1450, dt + 90]]); for (const y of [dt + 62, dt + 120]) rrect(1270, y - 5, 60, 10, 5, C2.chrome, { lw: DL });
  // mug of pens, plant, small mirror
  rect(640, dt - 70, 50, 70, C2.bowl); for (const a of [-.3, 0, .25]) line([[665, dt - 70], [665 + Math.sin(a) * 50, dt - 130]], C.ink, 5);
  if (o.mirror) { rrect(1330, dt - 170, 110, 150, 50, C2.wood); rrect(1342, dt - 158, 86, 126, 40, C.screen, { lw: DL }); line([[1385, dt - 20], [1385, dt]], C.ink, 8); if (o.mirrorFn) { g.save(); g.beginPath(); g.roundRect(1342, dt - 158, 86, 126, 40); g.clip(); o.mirrorFn(1342, dt - 158, 86, 126); g.restore(); } }
  if (o.laptop !== false) laptop(980, dt, 1, o.screen);
  return dt;
}
function laptop(x, y, k = 1, screen) { scaled(x, y, k, () => { poly([[x - 200, y], [x + 200, y], [x + 230, y + 4], [x - 230, y + 4]], C2.chrome); rrect(x - 180, y - 250, 360, 246, 10, '#3A4052'); rect(x - 166, y - 236, 332, 214, C.screen, { lw: 0 });
  if (screen) { g.save(); g.beginPath(); g.rect(x - 166, y - 236, 332, 214); g.clip(); screen(x - 166, y - 236, 332, 214); g.restore(); } circ(x + 120, y - 200, 0, null, { lw: 0 }); rrect(x - 140, y - 160, 0, 0, 0, null, { lw: 0 }); }); }

// ---------- small props ----------
function phoneP(x, y, s = 1, rot = 0, screen, col = '#2E3442') { withRot(x, y, rot, () => scaled(x, y, s, () => { rrect(x - 30, y - 56, 60, 112, 10, col, { lw: 5 }); rect(x - 24, y - 48, 48, 92, C.screen, { lw: 0 }); if (screen) { g.save(); g.beginPath(); g.rect(x - 24, y - 48, 48, 92); g.clip(); screen(x - 24, y - 48, 48, 92); g.restore(); } })); }
// a phone screen drawn large (close-ups): (x,y) top-left, w,h
function bigPhone(x, y, w, h, draw) { rrect(x - 24, y - 24, w + 48, h + 70, 40, '#2E3442', { lw: 6 }); rect(x, y, w, h, '#F7F9FA', { lw: 0 }); rrect(x + w / 2 - 50, y - 14, 100, 10, 5, C.ink, { lw: 0 }); g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); draw(x, y, w, h); g.restore(); circ(x + w / 2, y + h + 24, 0, null, { lw: 0 }); }
function chat(x, y, w, s, me, k = 1, col) { if (k <= 0) return 0; g.save(); g.font = `500 30px ${EN}`; const tw = Math.min(w - 80, g.measureText(s).width); g.restore(); const bx = me ? x + w - tw - 60 : x + 20;
  g.save(); g.globalAlpha = k; rrect(bx, y, tw + 40, 54, 22, col || (me ? '#4F86D1' : '#E4E7EA'), { lw: 0 }); text(s, bx + 20, y + 37, { size: 30, w: 500, col: me ? '#FFFFFF' : C.ink }); g.restore(); return 64; }
function thermo(x, y, k = 1, reading = '39.4 °C', red = true) { scaled(x, y, k, () => { rrect(x - 26, y - 150, 52, 190, 26, C2.white); rect(x - 18, y - 120, 36, 90, red ? '#FDE2DC' : C.screen, { lw: 3 }); text(reading, x, y - 64, { size: 15, w: 600, col: red ? C.red : C.ink, align: 'center' }); line([[x, y + 40], [x, y + 90]], C2.chrome, 10); line([[x, y + 40], [x, y + 90]], C.ink, 3); }); }
function bigNumber(s, x, y, t, a, col = C.red, size = 120) { const k = pop(t, a); if (k <= 0) return; scaled(x, y, k, () => text(s, x, y, { size, w: 600, col })); }
function steak(x, y, k = 1, glowK = 0) { scaled(x, y, k, () => { if (glowK > 0) { g.save(); g.globalAlpha = glowK * .5; shape(() => g.ellipse(x, y - 20, 120, 70, 0, 0, Math.PI * 2), '#F7E3A0', { lw: 0 }); g.restore(); }
  rrect(x - 90, y - 54, 180, 54, 6, '#E5ECEF', { lw: 4 }); shape(() => { g.moveTo(x - 70, y - 12); g.quadraticCurveTo(x - 80, y - 48, x - 20, y - 46); g.quadraticCurveTo(x + 40, y - 54, x + 70, y - 30); g.quadraticCurveTo(x + 76, y - 8, x + 20, y - 10); g.closePath(); }, K.meat);
  for (let i = 0; i < 4; i++) dline([[x - 50 + i * 30, y - 38], [x - 40 + i * 30, y - 20]], C2.white); rect(x + 30, y - 46, 46, 20, C2.white, { lw: 2 }); text('$12', x + 53, y - 31, { size: 12, w: 600, align: 'center' }); }); }
function apple(x, y, k = 1, bite = 0) { scaled(x, y, k, () => { circ(x - 12, y, 30, '#E0574A', { lw: 5 }); circ(x + 12, y, 30, '#E0574A', { lw: 5 }); shape(() => g.ellipse(x, y + 2, 34, 28, 0, 0, Math.PI * 2), '#E0574A', { lw: 0 }); line([[x, y - 28], [x + 4, y - 46]], C.ink, 5); shape(() => g.ellipse(x + 16, y - 40, 14, 7, -.5, 0, Math.PI * 2), C2.leaf, { lw: 3 });
  if (bite > 0) { circ(x + 38, y - 4, 16, '#F7EBCF', { lw: 4 }); circ(x + 36, y + 14, 12, '#F7EBCF', { lw: 4 }); } }); }
function glassW(x, y, k = 1, lvl = .7, ripple = 0) { scaled(x, y, k, () => { poly([[x - 40, y - 130], [x + 40, y - 130], [x + 32, y], [x - 32, y]], '#E6F3F8'); poly([[x - 37, y - 130 + 130 * (1 - lvl)], [x + 37, y - 130 + 130 * (1 - lvl)], [x + 32, y - 4], [x - 32, y - 4]], '#A9D8EC', { lw: 0 });
  if (ripple) for (let i = 0; i < 3; i++) ORIG.line([[x - 26 + i * 10, y - 130 + 130 * (1 - lvl) + 4], [x - 10 + i * 10, y - 130 + 130 * (1 - lvl) + 4 + Math.sin(ripple * 30 + i) * 3]], C2.white, 3); line([[x - 24, y - 110], [x - 20, y - 30]], C2.white, 5); }); }
function alarmClock(x, y, k = 1, ring = 0, time = '7:02') { scaled(x, y, k, () => { const j = ring ? Math.sin(ring * 60) * 4 : 0; g.save(); g.translate(j, 0); circ(x - 40, y - 96, 18, C.wall, { lw: 5 }); circ(x + 40, y - 96, 18, C.wall, { lw: 5 }); circ(x, y - 50, 56, C.red, { lw: 6 }); circ(x, y - 50, 44, C2.white, { lw: 3 });
  text(time, x, y - 42, { size: 24, w: 600, align: 'center' }); line([[x - 34, y - 6], [x - 44, y + 6]], C.ink, 6); line([[x + 34, y - 6], [x + 44, y + 6]], C.ink, 6); g.restore();
  if (ring) for (const s of [-1, 1]) for (let i = 0; i < 2; i++) line([[x + s * (76 + i * 16), y - 90 + i * 12], [x + s * (92 + i * 16), y - 104 + i * 12]], C.ink, 4); }); }
function pills(x, y, k = 1) { scaled(x, y, k, () => { rrect(x - 50, y - 20, 100, 40, 6, C2.chrome); for (let i = 0; i < 4; i++) circ(x - 33 + i * 22, y, 8, C2.white, { lw: 3 }); }); }
function knife(x, y, k = 1, rot = 0) { withRot(x, y, rot, () => scaled(x, y, k, () => { poly([[x, y - 8], [x + 140, y - 2], [x + 140, y + 6], [x, y + 8]], C2.chrome, { lw: 4 }); rrect(x - 80, y - 10, 80, 20, 6, C.ink, { lw: 0 }); })); }
function plate(x, y, k = 1) { scaled(x, y, k, () => { shape(() => g.ellipse(x, y, 70, 14, 0, 0, Math.PI * 2), C2.white, { lw: 5 }); shape(() => g.ellipse(x, y - 1, 46, 8, 0, 0, Math.PI * 2), null, { lw: 2 }); }); }
function shard(x, y, a, s = 1) { withRot(x, y, a, () => poly([[x - 20 * s, y], [x + 16 * s, y - 8 * s], [x + 24 * s, y + 6 * s], [x - 4 * s, y + 10 * s]], C2.white, { lw: 3 })); }
function noteP(x, y, s, txt, col = '#F6E7A6', rot = 0) { withRot(x, y, rot, () => { rect(x - 40 * s, y - 34 * s, 80 * s, 68 * s, col, { lw: 3 }); text(txt, x, y + 8 * s, { size: 20 * s, w: 600, align: 'center' }); }); }
function sprayCan(x, y, k = 1, rot = 0) { withRot(x, y, rot, () => scaled(x, y, k, () => { rrect(x - 18, y - 70, 36, 90, 8, C.red, { lw: 4 }); rect(x - 10, y - 86, 20, 16, C2.chrome, { lw: 3 }); })); }

// ---------- inside: the body diagram ----------
// a big hollow figure (a tube outline) and a network of hyphae that grows along its limbs from the stomach
function tubeFig(f, p, grow = 0, t = 0) {
  const j = joints(f, p), S = f.S, ow = 46 * S / 760, iw = 32 * S / 760;
  const paths = []; const Q = (A, B, E) => { const q = ctrl(A, B, E, .8); const pts = []; for (let i = 0; i <= 24; i++) pts.push(qpt(A, q, E, i / 24)); return pts; };
  paths.push(Q(j.Hp, j.lL[0], j.lL[1])); paths.push(Q(j.Hp, j.lR[0], j.lR[1]));
  const sp0 = []; for (let i = 0; i <= 24; i++) sp0.push(qpt(j.Hp, j.Cc, j.N, i / 24)); paths.push(sp0);
  paths.push(Q(j.Sh, j.aL[0], j.aL[1])); paths.push(Q(j.Sh, j.aR[0], j.aR[1]));
  g.save(); g.lineCap = 'round'; g.lineJoin = 'round';
  for (const [c, w] of [[C.ink, ow], [C.paper, iw]]) { g.strokeStyle = c; g.lineWidth = w; g.beginPath(); for (const pp of paths) { g.moveTo(...pp[0]); for (const q of pp) g.lineTo(...q); } g.stroke(); }
  const r = GEO.headR * S; circ(j.Hd[0], j.Hd[1], r + ow / 2 - iw / 2, C.paper, { lw: (ow - iw) / 2 + 2 });
  g.restore();
  return { j, paths, r };
}
function hyphaeBody(B, grow, t, belly) {
  // from the belly point (on the spine) run along the spine, then into each limb and the neck
  const sp0 = B.paths[2], legL = B.paths[0], legR = B.paths[1], armL = B.paths[3], armR = B.paths[4];
  const bi = Math.round(sp0.length * .35), shI = sp0.length - 1;
  const routes = [sp0.slice(0, bi + 1).reverse().concat(legL.slice(1)), sp0.slice(0, bi + 1).reverse().concat(legR.slice(1)), sp0.slice(bi).concat(armL.slice(1)), sp0.slice(bi).concat(armR.slice(1)), sp0.slice(bi)];
  routes.forEach((R, ri) => { const L = R.length, n = Math.floor(L * clamp(grow * 1.15 - ri * .04)); if (n < 2) return;
    const pts = R.slice(0, n).map(([x, y], i) => [x + Math.sin(i * 1.7 + ri) * 5, y + Math.cos(i * 1.3 + ri) * 5]); ink(pts, { w: 6, col: K.fungus, ta: .02, tb: .2, amp: 1 });
    for (let i = 4; i < n - 2; i += 5) { const [x, y] = pts[i], a = (i % 2 ? 1 : -1) * 1.2 + ri; ink([[x, y], [x + Math.cos(a) * 16, y + Math.sin(a) * 16], [x + Math.cos(a + .4) * 26, y + Math.sin(a + .4) * 26]], { w: 3, col: K.fungus, amp: .5 }); circ(x, y, 6, K.fungus, { lw: 0 }); } });
  return routes;
}

// ---------- inside: the control room in your head ----------
const LEVERS = ['ARM L', 'ARM R', 'LEGS', 'MOUTH'];
const CR = { cx: 960, cy: 540, R: 500, wx: 960, wy: 300, wr: 165, panelY: 610 };
function leverX(i) { return 660 + i * 200; }
// o: { threads 0..1, taken: {i: 0..1}, lv: {i: angle -1..1}, view(x,y,r), alarm, lamps, notes: [[i,txt,k]], photo, dim 0..1, wave 0..1 }
function ctrlRoom(t, o = {}) {
  SUBDARK = true;
  const { cx, cy, R } = CR;
  rect(-200, 0, 2400, 1080, '#2E2C33', { lw: 0 });
  circ(cx, cy, R, C.paper, { lw: 0 });
  // floor line and back wall arc
  g.save(); g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.clip();
  rect(cx - R, cy + 300, 2 * R, 300, '#E2DDD2', { lw: 0 }); line([[cx - R, cy + 300], [cx + R, cy + 300]], C.ink, 5);
  // the eye-window
  circ(CR.wx, CR.wy, CR.wr + 22, C2.wood, { lw: 7 });
  g.save(); g.beginPath(); g.arc(CR.wx, CR.wy, CR.wr, 0, Math.PI * 2); g.clip(); rect(CR.wx - CR.wr, CR.wy - CR.wr, CR.wr * 2, CR.wr * 2, C.sky, { lw: 0 }); if (o.view) o.view(CR.wx, CR.wy, CR.wr); if (o.dim) { g.globalAlpha = o.dim; rect(CR.wx - CR.wr, CR.wy - CR.wr, CR.wr * 2, CR.wr * 2, '#15141A', { lw: 0 }); } g.restore();
  circ(CR.wx, CR.wy, CR.wr, null, { lw: 6 }); line([[CR.wx - CR.wr, CR.wy], [CR.wx + CR.wr, CR.wy]], C.ink, 5); line([[CR.wx, CR.wy - CR.wr], [CR.wx, CR.wy + CR.wr]], C.ink, 5);
  label('EYES', CR.wx - 30, CR.wy + CR.wr + 52);
  // the desk with four levers
  const py = CR.panelY; poly([[560, py], [1360, py], [1420, py + 150], [500, py + 150]], C2.woodL); rect(500, py + 150, 920, 26, C2.wood);
  for (let i = 0; i < 4; i++) { const x = leverX(i), a = (o.lv?.[i] ?? 0) * .6, tk = o.taken?.[i] ?? 0;
    rrect(x - 14, py + 36, 28, 80, 10, '#3A4052', { lw: 4 }); const top = [x + Math.sin(a) * 120, py + 76 - Math.cos(a) * 120];
    line([[x, py + 76], top], C.ink, 12); line([[x, py + 76], top], C2.chrome, 5); circ(top[0], top[1], 20, tk > .5 ? K.fungus : C.red, { lw: 5 });
    text(LEVERS[i], x, py + 140, { size: 18, w: 600, align: 'center', track: 2 });
    const lamp = o.lamps?.[i] ?? (tk > .5 ? 'f' : 'g'); circ(x + 50, py + 30, 10, lamp === 'off' ? '#55545C' : lamp === 'f' ? K.fungus : lamp === 'r' ? C.red : '#93C86E', { lw: 3 });
    if (tk > 0) { // thread coiled round the lever
      for (let c = 0; c < 6 * tk; c++) { const u = c / 6, px = lerp(x, top[0], u), py2 = lerp(py + 76, top[1], u); ink([[px - 16, py2 + 6], [px, py2 - 4], [px + 16, py2 + 6]], { w: 4, col: K.fungus, amp: .4 }); } }
  }
  for (const [i, s, k] of (o.notes || [])) if (k > 0) scaled(leverX(i), py - 20, pop(k, 0), () => noteP(leverX(i), py - 20, 1, s, '#F6E7A6', (i - 1.5) * .06));
  if (o.photo !== false) photoP(1330, py + 60, .8, .08);
  // threads growing in from the wall
  if (o.threads > 0) ctrlThreads(o.threads, o.wave || 0, t);
  g.restore();
  // the ring of the head
  circ(cx, cy, R, null, { lw: 16 });
  if (o.alarm) { const on = Math.floor(t * 3) % 2; if (on) { g.save(); g.globalAlpha = .18; circ(cx, cy, R, C.red, { lw: 0 }); g.restore(); } circ(cx - R * .62, cy - R * .62, 18, on ? C.red : '#7A2A20', { lw: 5 }); circ(cx + R * .62, cy - R * .62, 18, on ? C.red : '#7A2A20', { lw: 5 }); }
}
let CTH = null;
function ctrlThreads(k, wave, t) {
  if (!CTH) { CTH = []; const r = mulberry(31); for (let i = 0; i < 40; i++) { const a = r() * Math.PI * 2, x0 = CR.cx + Math.cos(a) * CR.R, y0 = CR.cy + Math.sin(a) * CR.R; let x = x0, y = y0, ang = a + Math.PI + (r() - .5) * .6; const P = [[x, y]];
    for (let s = 0; s < 26; s++) { ang += (r() - .5) * .5; x += Math.cos(ang) * 18; y += Math.sin(ang) * 18; P.push([x, y]); } CTH.push({ P, k0: i / 40 * .8 }); } }
  for (const th of CTH) { const u = clamp((k - th.k0) / .25 + wave); if (u <= 0) continue; const n = Math.max(2, Math.floor(th.P.length * u)); const pts = th.P.slice(0, n).map(([x, y], i) => [x + Math.sin(t * 2 + i * .7) * 2, y + Math.cos(t * 1.7 + i * .5) * 2]);
    ink(pts, { w: 5, col: K.fungus, ta: .02, tb: .3, amp: .7 }); for (let i = 5; i < n; i += 7) circ(pts[i][0], pts[i][1], 5, K.fungus, { lw: 0 }); }
}
// the little you at the desk (seen from behind): S ~ 230
function littleMe(x, p, o = {}) { return figure({ x, gy: CR.cy + 400, S: o.S || 240 }, p); }

// ---------- the ant (inside the eye-window, or full frame) ----------
function antScene(cx, cy, s, u) {   // u 0..1: climb → bite → stalk
  scaled(cx, cy, s, () => {
    rect(cx - 600, cy - 600, 1200, 1200, '#DDEFD9', { lw: 0 });
    line([[cx - 40, cy + 400], [cx - 10, cy - 60]], C2.leafD, 14);
    shape(() => { g.moveTo(cx - 10, cy - 60); g.quadraticCurveTo(cx + 170, cy - 200, cx + 300, cy - 110); g.quadraticCurveTo(cx + 150, cy + 10, cx - 10, cy - 60); }, C2.leaf, { lw: 6 });
    line([[cx - 10, cy - 60], [cx + 290, cy - 112]], C2.leafD, 4);
    const climb = clamp(u / .55), ax = lerp(cx - 34, cx + 20, climb), ay = lerp(cy + 330, cy - 78, climb), ang = climb < 1 ? -1.5 : -.3;
    withRot(ax, ay, ang + Math.PI / 2, () => { for (const [dx, r] of [[-28, 12], [0, 10], [26, 15]]) circ(ax + dx, ay, r, '#3A2E2A', { lw: 3 }); for (const dx of [-8, 4, 14]) for (const s2 of [-1, 1]) line([[ax + dx, ay], [ax + dx + 10, ay + s2 * 22]], '#3A2E2A', 3); line([[ax + 36, ay - 6], [ax + 52, ay - 20]], '#3A2E2A', 3); });
    if (u > .6) { const k = clamp((u - .6) / .4), hx = ax + 0, hy = ay - 26; line([[hx, hy], [hx + 30 * k, hy - 120 * k]], C.ink, 8); line([[hx, hy], [hx + 30 * k, hy - 120 * k]], K.fungus, 4); circ(hx + 30 * k, hy - 120 * k, 12 * k, K.fungus, { lw: 3 }); }
  });
}

// ---------- the TV news graphic ----------
function news(x, y, w, h, t, o = {}) {
  rect(x, y, w, h, '#DCE9F0', { lw: 0 });
  if (o.map) { const mx = x + w * .5, my = y + h * .45; shape(() => { g.moveTo(mx - 200, my - 60); g.quadraticCurveTo(mx - 120, my - 140, mx, my - 110); g.quadraticCurveTo(mx + 160, my - 130, mx + 210, my - 30); g.quadraticCurveTo(mx + 170, my + 80, mx + 40, my + 90); g.quadraticCurveTo(mx - 150, my + 100, mx - 200, my - 60); }, '#BFD9A8', { lw: 4 });
    const r = mulberry(8); for (let i = 0; i < 40; i++) { const px = mx - 170 + r() * 360, py = my - 100 + r() * 180, a = (o.map - i / 40) * 4; if (a > 0) circ(px, py, 6 + 4 * clamp(a), K.fungus, { lw: 0 }); } }
  if (o.barricade) { const bx = x + 80; for (let i = 0; i < 4; i++) box(bx + i * 110, y + h - 70, 100, 80 + (i % 2) * 30, { label: false }); RAW++; try { for (let i = 0; i < 3; i++) { const j = figure({ x: bx + 90 + i * 140, gy: y + h - 70 - 100, S: 130, lws: .5 }, P({ ra: 1.5, rb: 0 })); const m = [j.aR[1][0] + 60, j.aR[1][1]]; line([j.aR[1], m], C.ink, 6); g.save(); g.setLineDash([6, 8]); line([m, [x + w, m[1] + 20]], C.red, 3); g.restore(); } } finally { RAW--; } }
  rect(x, y + h - 60, w, 60, C.red, { lw: 0 }); text(o.ticker || 'BREAKING  ·  STAY INDOORS', x + 24, y + h - 20, { size: 26, w: 600, col: C.paper, track: 2 });
  rect(x + 20, y + 20, 110, 44, C.red, { lw: 0 }); text('LIVE', x + 75, y + 52, { size: 26, w: 600, col: C.paper, align: 'center', track: 3 });
}

// the pavement (slabs, a kerb) and the asphalt road in front of the houses
function sidewalkRoad(x0 = -3000, x1 = 5000) {
  rect(x0, GY, x1 - x0, 74, '#CFCAC0', { lw: 0 });
  for (let x = Math.floor(x0 / 130) * 130; x < x1; x += 130) ORIG.line([[x, GY + 4], [x - 18, GY + 72]], '#B4AEA2', 3);
  ORIG.line([[x0, GY + 36], [x1, GY + 36]], '#BDB7AC', 2);
  rect(x0, GY + 74, x1 - x0, 16, '#E3DFD6', { lw: 0 }); ORIG.line([[x0, GY + 74], [x1, GY + 74]], C.ink, 4); ORIG.line([[x0, GY + 90], [x1, GY + 90]], C.ink, 5);
  rect(x0, GY + 90, x1 - x0, 1400, '#5C5E66', { lw: 0 });
  const r = mulberry(77); g.save(); g.fillStyle = '#6E7079'; for (let i = 0; i < 420; i++) { const x = x0 + r() * (x1 - x0), y = GY + 96 + r() * 600; g.fillRect(x, y, 3 + r() * 4, 2 + r() * 3); } g.restore();
  for (let x = Math.floor(x0 / 260) * 260; x < x1; x += 260) rect(x, GY + 200, 130, 14, '#EDE6C8', { lw: 0 });
  ink([[x0, GY + 120], [x1 * .3, GY + 124], [x1, GY + 119]], { w: 2, col: '#4A4C53', amp: .8 });
}
