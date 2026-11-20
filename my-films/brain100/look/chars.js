// "What if you used 100% of your brain?" — cast and shared props (Colour Stick Explainer v2).
// Power colour (ginger) = the upgraded brain. Red = danger, crash, limit. Figures stay clean even-hose lines.
const C3 = { hair: '#3A2A24', hairL: '#5A4136', chalk: '#F4F1E6', board: '#2F4A3E', boardD: '#243A30', field: '#8CC46A', fieldD: '#7AB55A',
  dress: '#E58FA0', bubble: '#FFFFFF', bubbleG: '#F7D3DA', steel: '#C9D2D8', steelD: '#9AA6AE', green: '#93C86E', wasabi: '#9CC255',
  rice: '#FBF8EF', salmon: '#F29A72', tuna: '#D9534F', nori: '#2E3B33', lantern: '#F1C35B', night: '#2B3150', nightL: '#3B4368',
  cream: '#F8E7C4', teal: '#7FC3B8', lilac: '#C9B8E6', olive: '#B9C46A', heart: '#E86A6A' };

// ---------- the upgraded you: the even-hose figure + a ginger head with brain folds ----------
function brainFolds(cx, cy, r, up, col) {
  g.save(); g.beginPath(); g.arc(cx, cy, r * .86, 0, Math.PI * 2); g.clip();
  const c = Math.cos(up + Math.PI / 2), s = Math.sin(up + Math.PI / 2), u = [Math.cos(up), Math.sin(up)];
  const P = (a, b) => [cx + c * a * r + u[0] * b * r, cy + s * a * r + u[1] * b * r];   // a: across, b: along "up"
  ink([P(0, .85), P(.06, .45), P(-.04, .1), P(.05, -.3)], { w: 2.6, col, amp: .3 });   // the central fissure
  for (const sd of [-1, 1]) {
    ink([P(sd * .25, .7), P(sd * .45, .55), P(sd * .3, .35), P(sd * .55, .2)], { w: 2.4, col, amp: .3 });
    ink([P(sd * .2, .2), P(sd * .42, .02), P(sd * .62, .1)], { w: 2.4, col, amp: .3 });
    ink([P(sd * .18, -.15), P(sd * .38, -.3), P(sd * .6, -.22)], { w: 2.2, col, amp: .3 });
  }
  g.restore();
}
function brainy(f, p, o = {}) {
  const fill = o.red ? C.red : C.ginger;
  const j = figure({ ...f, fill }, p), r = GEO.headR * f.S, up = Math.atan2(j.Hd[1] - j.N[1], j.Hd[0] - j.N[0]);
  brainFolds(j.Hd[0], j.Hd[1], r, up, o.red ? '#9E2A1C' : C.gingerD);
  if (o.spark) for (const a of [-.75, 0, .75]) { const A = up + a, k = clamp(Math.sqrt(f.S / 380), .6, 1.05);
    line([[j.Hd[0] + Math.cos(A) * r * 1.35, j.Hd[1] + Math.sin(A) * r * 1.35], [j.Hd[0] + Math.cos(A) * r * 1.75, j.Hd[1] + Math.sin(A) * r * 1.75]], o.red ? C.red : C.ginger, 6 * k); }
  return j;
}
// before the upgrade: the plain ink figure
const plain = (f, p) => figure(f, p);

// ---------- the girlfriend: a hair cap and a ponytail (a costume, not a face) ----------
function gf(f, p, o = {}) {
  const j0 = joints(f, p), r = GEO.headR * f.S, sc = clamp(Math.sqrt(f.S / 380), .6, 1.05), d = f.face || -1;
  const up = Math.atan2(j0.Hd[1] - j0.N[1], j0.Hd[0] - j0.N[0]), U = [Math.cos(up), Math.sin(up)], Sd = [Math.cos(up + Math.PI / 2) * -d, Math.sin(up + Math.PI / 2) * -d];
  const at = (a, b) => [j0.Hd[0] + Sd[0] * a * r + U[0] * b * r, j0.Hd[1] + Sd[1] * a * r + U[1] * b * r];
  // ponytail behind the head (on the side away from where she faces)
  const pt = [at(.75, .55), at(1.45, .5), at(1.6, -.2), at(1.3, -.75), at(1.05, -.3), at(.9, .15)];
  fillC(pt, C3.hair); ink(pt, { w: 3.6 * sc, closed: true });
  ink([at(1.2, .25), at(1.32, -.35)], { w: 2 * sc, col: C3.hairL });
  if (o.dress) {   // a dress: from the shoulders to just under the hips
    const j = j0, Hp = j.Hp, Sh = j.Sh, w0 = .07 * f.S, w1 = .17 * f.S, y1 = Hp[1] + .11 * f.S;
    const D = [[Sh[0] - w0, Sh[1] + .01 * f.S], [Sh[0] + w0, Sh[1] + .01 * f.S], [Hp[0] + w1, y1], [Hp[0] - w1, y1]];
    figure(f, p);
    fillC([[D[0][0], D[0][1]], [D[1][0], D[1][1]], [(D[1][0] + D[2][0]) / 2 + 6, (D[1][1] + D[2][1]) / 2], D[2], [(D[2][0] + D[3][0]) / 2, y1 + 8], D[3], [(D[0][0] + D[3][0]) / 2 - 6, (D[0][1] + D[3][1]) / 2]], C3.dress);
    ink([D[0], D[1], [(D[1][0] + D[2][0]) / 2 + 6, (D[1][1] + D[2][1]) / 2], D[2], [(D[2][0] + D[3][0]) / 2, y1 + 8], D[3], [(D[0][0] + D[3][0]) / 2 - 6, (D[0][1] + D[3][1]) / 2], D[0]], { w: 4.5 * sc });
    for (let k = 1; k < 4; k++) ink([[lerp(D[3][0], D[2][0], k / 4), y1 + 4], [lerp(Sh[0] - w0 * .4, Sh[0] + w0 * .4, k / 4), Hp[1] - .06 * f.S]], { w: 1.8 * sc, col: '#B9667A' });
    // arms drawn again on top of the dress
    g.save(); g.strokeStyle = C.ink; g.lineCap = 'round'; g.lineWidth = Math.max(5, 8 * sc); g.beginPath();
    for (const [El, Hn] of [j.aL, j.aR]) { const Q = ctrl(j.Sh, El, Hn, .8); g.moveTo(j.Sh[0], j.Sh[1]); g.quadraticCurveTo(Q[0], Q[1], Hn[0], Hn[1]); } g.stroke(); g.restore();
  } else figure(f, p);
  // hair cap over the top of the head
  const cap = [at(-1.08, .05), at(-.95, .65), at(-.45, 1.05), at(.2, 1.12), at(.8, .85), at(1.1, .2), at(.85, .35), at(.3, .62), at(-.3, .55), at(-.8, .3)];
  fillC(cap, C3.hair); ink(cap, { w: 3.8 * sc, closed: true });
  ink([at(-.2, .95), at(.35, .9)], { w: 1.8 * sc, col: C3.hairL });
  // a bow
  const b = at(.98, .45);
  for (const sd of [-1, 1]) { const P = [b, [b[0] + sd * 12 * sc, b[1] - 10 * sc], [b[0] + sd * 14 * sc, b[1] + 8 * sc]]; fillP(P, C.pink); ink([...P, b], { w: 2.4 * sc, sharp: true }); }
  circ(b[0], b[1], 4.5 * sc, C.pink, { lw: 2.4 * sc });
  return j0;
}

// ---------- Einstein: wild white hair puffs (no face) ----------
function einstein(f, p) {
  const j0 = joints(f, p), r = GEO.headR * f.S, up = Math.atan2(j0.Hd[1] - j0.N[1], j0.Hd[0] - j0.N[0]), sc = clamp(Math.sqrt(f.S / 380), .6, 1.05);
  for (const [a, k, rr] of [[-1.75, 1.0, .42], [-1.25, 1.02, .46], [-.6, 1.0, .44], [0, 1.02, .4], [.6, 1.0, .44], [1.25, 1.02, .46], [1.75, 1.0, .42]]) {
    const A = up + a, c = [j0.Hd[0] + Math.cos(A) * r * k, j0.Hd[1] + Math.sin(A) * r * k];
    const P = []; for (let i = 0; i < 9; i++) { const t = i / 9 * Math.PI * 2, w = rr * r * (1 + .18 * Math.sin(i * 2.7 + a * 3)); P.push([c[0] + Math.cos(t) * w, c[1] + Math.sin(t) * w]); }
    fillC(P, '#F7F6F1'); ink(P, { w: 3.4 * sc, closed: true });
  }
  const j = figure(f, p);
  // a bushy moustache stays off: people have no faces in this style
  return j;
}

// ---------- shared props ----------
function bubble(x, y, w, h, s, o = {}) {   // a speech or chat bubble with a tail toward (tx, ty)
  const fill = o.fill || C3.bubble, tx = o.tx ?? x + w * .2, ty = o.ty ?? y + h + 40;
  shape(() => { g.roundRect(x, y, w, h, o.r ?? 26); }, fill, { lw: o.lw ?? 5 });
  const bx = clamp(tx, x + 30, x + w - 60), by = ty < y ? y : y + h;
  g.save(); g.fillStyle = fill; g.beginPath(); g.moveTo(bx, by + (ty < y ? 4 : -4)); g.lineTo(tx, ty); g.lineTo(bx + 34, by + (ty < y ? 4 : -4)); g.closePath(); g.fill(); g.restore();
  ink([[bx, by], [tx, ty], [bx + 34, by]], { w: (o.lw ?? 5) * 1.05, sharp: true });
  const lines = Array.isArray(s) ? s : [s], fs = o.size ?? 34;
  lines.forEach((t, i) => text(t, x + (o.center ? w / 2 : 28), y + h / 2 + fs * .36 + (i - (lines.length - 1) / 2) * fs * 1.25, { size: fs, w: o.wt ?? 500, col: o.col || C.ink, align: o.center ? 'center' : 'left' }));
}
function thought(x, y, w, h, tx, ty, fill = C3.bubble) {
  const P = []; const n = 14; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; P.push([x + w / 2 + Math.cos(a) * w / 2 * (1 + .06 * Math.sin(i * 3)), y + h / 2 + Math.sin(a) * h / 2 * (1 + .06 * Math.sin(i * 3))]); }
  for (let i = 0; i < n; i++) { const a = (i + .5) / n * Math.PI * 2; circ(x + w / 2 + Math.cos(a) * w / 2 * .96, y + h / 2 + Math.sin(a) * h / 2 * .96, Math.min(w, h) * .11, fill, { lw: 4 }); }
  fillC(P, fill);
  for (let k = 0; k < 3; k++) { const u = (k + 1) / 4; circ(lerp(x + w / 2, tx, .55 + u * .45), lerp(y + h, ty, .55 + u * .45) - 0, 16 - k * 4, fill, { lw: 4 }); }
}
function phone(x, y, w, h, o = {}) {   // a smartphone, screen up
  rrect(x, y, w, h, w * .14, C.ink, { lw: 5 });
  rrect(x + w * .06, y + h * .06, w * .88, h * .88, w * .09, o.screen || C.screen, { lw: 0 });
  rrect(x + w * .38, y + h * .025, w * .24, h * .018, 4, '#555', { lw: 0 });
  return [x + w * .06, y + h * .06, w * .88, h * .88];
}
function chat(x, y, s, o = {}) {   // a chat message pill; o.me puts it on the right in ginger tint
  g.save(); g.font = `500 ${o.size ?? 30}px Jost`; const tw = g.measureText(s).width; g.restore();
  const w = tw + 44, h = (o.size ?? 30) * 1.75, X = o.right ? x - w : x;
  rrect(X, y, w, h, h / 2, o.fill || (o.me ? '#FCE2C6' : C3.bubbleG), { lw: 4 });
  text(s, X + 22, y + h * .66, { size: o.size ?? 30, w: o.wt ?? 500, col: o.col || C.ink });
  return [X, y, w, h];
}
function sweat(x, y, k = 1) { for (const [dx, dy, s] of [[0, 0, 1], [26, 22, .8], [-8, 40, .6]]) { const X = x + dx * k, Y = y + dy * k, R = 9 * k * s; const P = [[X, Y - R * 2.2], [X + R, Y], [X, Y + R], [X - R, Y]]; fillC(P, '#BFE3F2'); ink(P, { w: 2.6, closed: true }); } }
function meterBar(x, y, w, v, col, lab, val) { label(lab, x, y - 12); rrect(x, y, w, 26, 8, C2.white, { lw: 4 }); rrect(x + 4, y + 4, (w - 8) * v, 18, 5, col, { lw: 0 }); if (val) text(val, x + w + 14, y + 23, { size: 24, w: 600, col }); }
function stars(x, y, k = 1, col = C.red) { for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * 1.25; line([[x + Math.cos(a) * 30 * k, y + Math.sin(a) * 30 * k], [x + Math.cos(a) * 52 * k, y + Math.sin(a) * 52 * k]], col, 6); } }
function errorCard(x, y, w, h, l1, l2) {
  rrect(x + 10, y + 12, w, h, 18, 'rgba(43,38,34,.15)', { lw: 0 });
  rrect(x, y, w, h, 18, C.red, { lw: 6 });
  rrect(x, y, w, 56, [18, 18, 0, 0], '#B8301E', { lw: 0 }); ink([[x, y + 56], [x + w, y + 56]], { w: 4 });
  for (const k of [0, 1, 2]) circ(x + 30 + k * 30, y + 28, 9, C.paper, { lw: 3 });
  text(l1, x + 36, y + 56 + (h - 56) * .48, { size: 52, w: 600, col: C.paper, track: 1 });
  text(l2, x + 38, y + 56 + (h - 56) * .78, { size: 30, w: 500, col: '#FBD9D2' });
}
function chapter(n, name) { label(`Chapter ${n}  ·  ${name}`, 124, 150); }
function headline(a, b, colB = C.ginger, y = 238, size = 84) { text(a, 118, y, { size, w: 600, track: -2 }); if (b) text(b, 118, y + size * 1.08, { size, w: 600, track: -2, col: colB }); }
function wall(y0, y1, col) { rect(-20, y0, W + 40, y1 - y0, col, { lw: 0 }); }
function windowW(x, y, w, h, sky = C.sky, o = {}) {
  rect(x - 14, y - 14, w + 28, h + 28, C2.white);
  rect(x, y, w, h, sky);
  if (o.sun) { circ(x + w * .7, y + h * .62, h * .18, C.sun, { lw: 4 }); for (const [a, b] of [[.2, .78], [.45, .7]]) rrect(x + w * a - 40, y + h * b, 90, 22, 11, '#FFFFFF', { lw: 3 }); }
  if (o.night) { circ(x + w * .7, y + h * .32, h * .13, '#F4F1E6', { lw: 3 }); for (const [a, b] of [[.2, .2], [.35, .5], [.15, .7], [.85, .7]]) circ(x + w * a, y + h * b, 3, '#F4F1E6', { lw: 0 }); }
  dline([[x + w / 2, y], [x + w / 2, y + h]]); dline([[x, y + h / 2], [x + w, y + h / 2]]);
  poly([[x + 6, y + 6], [x + w * .2, y + 6], [x + 6, y + h * .3]], 'rgba(255,255,255,.65)', { lw: 0 });
  rect(x - 24, y + h + 14, w + 48, 16, C2.white);
}
function frameArt(x, y, w, h, kind = 'hill') {
  rect(x, y, w, h, C2.wood); rect(x + 12, y + 12, w - 24, h - 24, kind === 'hill' ? C.sky : C3.cream, { lw: DL });
  if (kind === 'hill') { poly([[x + 12, y + h - 12], [x + w * .35, y + h * .45], [x + w * .6, y + h * .7], [x + w * .75, y + h * .5], [x + w - 12, y + h - 12]], C.grass, { lw: DL }); circ(x + w * .78, y + h * .3, 12, C.sun, { lw: DL }); }
  line([[x + w / 2 - 30, y], [x + w / 2, y - 26], [x + w / 2 + 30, y]], C.ink, 3); circ(x + w / 2, y - 26, 4, C.ink, { lw: 0 });
}
function plant(x, gy, h = 140) {
  poly([[x - 34, gy], [x - 42, gy - 64], [x + 42, gy - 64], [x + 34, gy]], C2.bowl || '#D65A3C'); rect(x - 48, gy - 78, 96, 16, '#C24F33');
  for (const [a, l] of [[-.6, 1], [-.25, 1.15], [.1, 1.2], [.45, 1.05], [.8, .9]]) { const tip = [x + Math.sin(a) * h * l * .8, gy - 76 - Math.cos(a) * h * l]; const m = [(x + tip[0]) / 2, (gy - 76 + tip[1]) / 2];
    const L = [[x, gy - 76], [m[0] - 18, m[1]], tip, [m[0] + 18, m[1]]]; fillC(L, C2.leaf); ink(L, { w: 3.4, closed: true }); ink([[x, gy - 76], tip], { w: 1.8, col: C2.leafD }); }
}
function lampFloor(x, gy) { shape(() => g.ellipse(x, gy - 6, 46, 10, 0, 0, Math.PI * 2), C2.chrome, { lw: 4 }); line([[x, gy - 8], [x, gy - 300]], C.ink, 8); poly([[x - 70, gy - 300], [x + 70, gy - 300], [x + 44, gy - 400], [x - 44, gy - 400]], C.wall); for (const dx of [-36, 0, 36]) dline([[x + dx * .9, gy - 306], [x + dx * .6, gy - 394]], '#D9B65E'); }
function clockW(x, y, r, hh = 10, mm = 10) { circ(x, y, r, C2.white, { lw: 6 }); for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; ORIG.line([[x + Math.cos(a) * r * .78, y + Math.sin(a) * r * .78], [x + Math.cos(a) * r * .9, y + Math.sin(a) * r * .9]], C.ink, 3); }
  const ah = (hh % 12 + mm / 60) / 12 * Math.PI * 2 - Math.PI / 2, am = mm / 60 * Math.PI * 2 - Math.PI / 2;
  line([[x, y], [x + Math.cos(ah) * r * .5, y + Math.sin(ah) * r * .5]], C.ink, 6); line([[x, y], [x + Math.cos(am) * r * .75, y + Math.sin(am) * r * .75]], C.ink, 4); circ(x, y, 5, C.ink, { lw: 0 }); }
function bookD(x, y, w, h, col, title) {   // a closed book, standing (spine toward the viewer)
  rect(x, y, w, h, col, { lw: 4 }); dline([[x + 4, y + 14], [x + w - 4, y + 14]]); dline([[x + 4, y + h - 14], [x + w - 4, y + h - 14]]);
  if (title && w > 26) { g.save(); g.translate(x + w / 2 + 6, y + h / 2); g.rotate(-Math.PI / 2); g.font = '600 15px Jost'; g.fillStyle = C.ink; g.textAlign = 'center'; g.fillText(title, 0, 0); g.restore(); }
}
function shelf(x, y, w, rows = 3, rh = 120, seed = 4) {
  rect(x - 16, y - 16, w + 32, rows * rh + 32, C2.wood);
  const r = mulberry(seed), cols = [C.sky, C.roof, C.wall, C.grass, C.blue, C.pink, C3.teal, C3.lilac, C3.olive, '#E9C08B'];
  for (let k = 0; k < rows; k++) { const yb = y + (k + 1) * rh; rect(x, y + k * rh, w, rh, C2.woodL, { lw: DL }); let bx = x + 8;
    while (bx < x + w - 40) { const bw = 22 + r() * 22, bh = rh * (.62 + r() * .3); if (r() < .12 && bx < x + w - 90) { withRot(bx + 6, yb - 4, -.32, () => bookD(bx + 6, yb - 4 - bh, bw, bh, cols[Math.floor(r() * cols.length)])); bx += bw + 30; continue; }
      bookD(bx, yb - bh, bw, bh, cols[Math.floor(r() * cols.length)], bw > 34 ? ['MATH', 'ART', 'A–Z', 'BIO', '1001'][Math.floor(r() * 5)] : null); bx += bw + 2; }
    rect(x - 16, yb - 6, w + 32, 12, C2.wood); }
}
