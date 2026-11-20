// Detailed hand-inked props (test): every line is a tapered, slightly wobbly ink ribbon; flat colour sits under the ink.
// The stick figures keep the even-hose rig from index.html.
const INK = '#2B2622';
function withRot(cx, cy, a, fn) { g.save(); g.translate(cx, cy); g.rotate(a); g.translate(-cx, -cy); fn(); g.restore(); }
let SEED = 1;
function hash1(n) { n = Math.imul(n ^ 0x9E3779B9, 0x85EBCA6B); n ^= n >>> 13; n = Math.imul(n, 0xC2B2AE35); n ^= n >>> 16; return (n >>> 0) / 4294967296; }
function noise1(x, s) { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(hash1(i * 7919 + s * 104729), hash1((i + 1) * 7919 + s * 104729), u); }
function catmull(P, closed, step = 2) {
  const n = P.length, out = [], get = i => closed ? P[(i + n) % n] : P[Math.max(0, Math.min(n - 1, i))];
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2), L = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]), m = Math.max(2, Math.ceil(L / step));
    for (let k = 0; k < m; k++) { const t = k / m, t2 = t * t, t3 = t2 * t;
      out.push([0, 1].map(j => .5 * ((2 * p1[j]) + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3))); }
  }
  out.push(closed ? [...out[0]] : [...P[n - 1]]); return out;
}
// a hand-inked line through control points P (Catmull-Rom). o: w width, ta/tb taper fractions, amp wobble, closed, col, sharp (polyline)
function ink(P, o = {}) {
  const w = o.w ?? 4, amp = o.amp ?? 1.1, seed = SEED++, col = o.col || INK;
  let Q = o.sharp ? densify(P, 2) : catmull(P, !!o.closed);
  if (o.closed && !o.sharp) { const k = Math.min(Q.length - 1, 6); Q = Q.concat(Q.slice(1, k).map(([x, y]) => [x + 1.2, y + 1.2])); }   // overshoot past the start
  const N = Q.length; if (N < 2) return;
  let len = [0]; for (let i = 1; i < N; i++) len.push(len[i - 1] + Math.hypot(Q[i][0] - Q[i - 1][0], Q[i][1] - Q[i - 1][1])); const T = len[N - 1] || 1;
  const ta = o.ta ?? .12, tb = o.tb ?? .16, L = [], R = [];
  for (let i = 0; i < N; i++) {
    const a = Q[Math.max(0, i - 1)], b = Q[Math.min(N - 1, i + 1)]; let tx = b[0] - a[0], ty = b[1] - a[1]; const l = Math.hypot(tx, ty) || 1; tx /= l; ty /= l;
    const s = len[i], u = s / T, off = amp * ((noise1(s / 45, seed) - .5) * 2 + (noise1(s / 11, seed + 9) - .5) * .5);
    const tap = Math.max(.3, Math.pow(Math.min(1, u / ta), .55) * Math.pow(Math.min(1, (1 - u) / tb), .55));
    const ww = w * tap * (.85 + .3 * noise1(s / 30, seed + 4)) / 2;
    const x = Q[i][0] - ty * off, y = Q[i][1] + tx * off;
    L.push([x - ty * ww, y + tx * ww]); R.push([x + ty * ww, y - tx * ww]);
  }
  g.save(); g.fillStyle = col; g.beginPath(); g.moveTo(L[0][0], L[0][1]); for (const p of L) g.lineTo(p[0], p[1]); for (let i = R.length - 1; i >= 0; i--) g.lineTo(R[i][0], R[i][1]); g.closePath(); g.fill(); g.restore();
}
function densify(P, step) { const out = [P[0]]; for (let i = 1; i < P.length; i++) { const a = P[i - 1], b = P[i], L = Math.hypot(b[0] - a[0], b[1] - a[1]), m = Math.max(1, Math.ceil(L / step)); for (let k = 1; k <= m; k++) out.push([lerp(a[0], b[0], k / m), lerp(a[1], b[1], k / m)]); } return out; }
function fillC(P, col, closed = true) { const Q = catmull(P, closed); g.save(); g.fillStyle = col; g.beginPath(); g.moveTo(Q[0][0], Q[0][1]); for (const p of Q) g.lineTo(p[0], p[1]); g.closePath(); g.fill(); g.restore(); }
function fillP(P, col) { g.save(); g.fillStyle = col; g.beginPath(); g.moveTo(P[0][0], P[0][1]); for (const p of P) g.lineTo(p[0], p[1]); g.closePath(); g.fill(); g.restore(); }
const T2 = (o, s, P) => P.map(([x, y]) => [o[0] + x * s, o[1] + y * s]);   // local → world
function ellP(cx, cy, rx, ry, a0 = 0, a1 = Math.PI * 2, n = 18, rot = 0) { const P = []; for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n, x = Math.cos(a) * rx, y = Math.sin(a) * ry; P.push([cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)]); } return P; }

// ---------------- palette ----------------
const P2 = { ginger: '#F0913A', gingerD: '#C9652A', cream: '#F8DDB4', pink: '#EFA7A0', woodTop: '#DCA56B', woodFront: '#B97C47', woodLeg: '#C8894F', grain: '#9A6337',
  mug: '#4F86D1', coffee: '#6B4027', paperN: '#F7F3E8', shadow: 'rgba(43,38,34,.12)', leaf: '#7FB565', pot: '#D65A3C' };

// ---------------- the cat (sitting, 3/4 view, facing left, one paw raised) ----------------
function catD(ox, oy, s, o = {}) {
  const T = P => T2([ox, oy], s, P), W_ = v => v * Math.sqrt(s);
  // tail behind the body: a tapered filled band
  const tail = T([[118, -14], [150, 6], [120, 26], [40, 28], [-30, 18], [-62, 6]]);
  const tq = catmull(tail, false, 3); const tl = [], tr = [];
  tq.forEach((p, i) => { const a = tq[Math.max(0, i - 1)], b = tq[Math.min(tq.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, w = lerp(17, 7, i / (tq.length - 1)) * s;
    tl.push([p[0] - dy / l * w, p[1] + dx / l * w]); tr.push([p[0] + dy / l * w, p[1] - dx / l * w]); });
  const tailPoly = tl.concat(tr.reverse()); fillP(tailPoly, P2.ginger);
  for (let k = 1; k < 6; k++) { const i = Math.floor(tq.length * k / 6), p = tq[i], a = tq[i - 1], dx = p[0] - a[0], dy = p[1] - a[1], l = Math.hypot(dx, dy) || 1, w = lerp(17, 7, i / tq.length) * s;
    ink([[p[0] - dy / l * w * .9, p[1] + dx / l * w * .9], [p[0] + dy / l * w * .9 + dx / l * 6, p[1] - dx / l * w * .9 + dy / l * 6]], { w: W_(6), col: P2.gingerD, amp: .4, ta: .3, tb: .3 }); }
  ink(tl, { w: W_(3.8), ta: .05, tb: .1 }); ink(tr, { w: W_(3.8), ta: .1, tb: .05 });
  // body
  const body = T([[-95, -268], [-112, -232], [-120, -205], [-106, -196], [-117, -176], [-100, -165], [-98, -110], [-92, -40], [-82, 0], [110, 4], [138, -30], [140, -80], [126, -150], [92, -215], [36, -255], [-8, -262]]);
  fillC(body, P2.ginger);
  fillC(T([[-95, -262], [-62, -250], [-58, -170], [-96, -150], [-114, -205]]), P2.cream);
  // stripes on the back and haunch (colour strokes, then a few ink ticks)
  for (const [a, b, w] of [[[62, -236], [38, -204], 13], [[96, -198], [70, -172], 13], [[121, -146], [92, -128], 12], [[134, -96], [104, -90], 11], [[132, -50], [104, -48], 10]])
    ink(T([a, b]), { w: W_(w), col: P2.gingerD, ta: .2, tb: .45, amp: .6 });
  ink(body, { w: W_(4.6), closed: true });
  // fur ticks along the back
  for (const [x, y, dx, dy] of [[70, -226, 8, 6], [108, -180, 7, 8], [131, -116, 8, 6], [138, -66, 9, 3]]) ink(T([[x, y], [x + dx, y + dy]]), { w: W_(2.4), ta: .3, tb: .6 });
  // haunch and back paw
  ink(T([[34, -150], [92, -128], [118, -60], [96, -8]]), { w: W_(3.4) });
  fillC(T([[10, 2], [8, -14], [40, -22], [76, -14], [74, 4]]), P2.ginger); ink(T([[10, 2], [8, -14], [40, -22], [76, -14], [74, 4]]), { w: W_(3.4) });
  for (const x of [30, 48]) ink(T([[x, -6], [x + 2, 3]]), { w: W_(2.4) });
  // front leg on the table
  fillC(T([[-100, -140], [-62, -138], [-58, -12], [-104, -10]]), P2.ginger);
  ink(T([[-100, -140], [-103, -60], [-104, -12]]), { w: W_(3.8) }); ink(T([[-62, -136], [-60, -60], [-58, -14]]), { w: W_(3.4) });
  const paw = T([[-110, 2], [-110, -14], [-82, -24], [-52, -14], [-52, 2]]); fillC(paw, P2.cream); ink(paw, { w: W_(3.6) });
  for (const x of [-92, -74]) ink(T([[x, -8], [x + 1, 2]]), { w: W_(2.4) });
  ink(T([[-96, -110], [-74, -112]]), { w: W_(8), col: P2.gingerD, amp: .4 }); ink(T([[-96, -80], [-72, -82]]), { w: W_(7), col: P2.gingerD, amp: .4 });
  // raised paw reaching for the mug
  const arm = T([[-74, -186], [-128, -182], [-162, -172], [-160, -142], [-126, -150], [-70, -152]]);
  fillC(arm, P2.ginger); ink(T([[-74, -186], [-128, -182], [-160, -174]]), { w: W_(3.8) }); ink(T([[-70, -152], [-126, -150], [-152, -142]]), { w: W_(3.6) });
  ink(T([[-120, -184], [-118, -152]]), { w: W_(8), col: P2.gingerD, amp: .4 });
  const pw = T([[-150, -176], [-178, -178], [-190, -160], [-178, -140], [-150, -140]]); fillC(pw, P2.cream); ink(pw, { w: W_(3.6), closed: true });
  for (const y of [-166, -154]) ink(T([[-190, y], [-180, y + 1]]), { w: W_(2.2) });
  for (const [x, y] of [[-194, -170], [-196, -158], [-193, -146]]) ink(T([[x + 4, y], [x - 4, y - 2]]), { w: W_(1.6), ta: .1, tb: .8 });   // claws out
  // ears
  for (const E of [[[-100, -364], [-120, -448], [-60, -398]], [[-14, -398], [26, -452], [36, -352]]]) {
    const ear = T(E); fillP(ear, P2.ginger); const c = [(E[0][0] + E[1][0] + E[2][0]) / 3, (E[0][1] + E[1][1] + E[2][1]) / 3];
    const inner = T(E.map(([x, y]) => [c[0] + (x - c[0]) * .58, c[1] + (y - c[1]) * .58 + 8])); fillP(inner, P2.pink);
    ink(ear, { w: W_(4.4), sharp: true, ta: .02, tb: .02 }); ink([inner[0], inner[1], inner[2]], { w: W_(2.2), sharp: true });
    for (let k = 0; k < 3; k++) { const b = T([[lerp(E[0][0], E[2][0], .3 + k * .2), lerp(E[0][1], E[2][1], .3 + k * .2)]])[0], tip = T([[lerp(c[0], E[1][0], .55), lerp(c[1], E[1][1], .55)]])[0];
      ink([b, [lerp(b[0], tip[0], .6), lerp(b[1], tip[1], .6)]], { w: W_(1.8), ta: .2, tb: .7 }); }
  }
  // head with cheek tufts
  const head = T([[-100, -360], [-112, -330], [-118, -306], [-106, -299], [-124, -287], [-100, -276], [-80, -262], [-40, -255], [0, -262], [20, -276], [44, -287], [30, -298], [46, -306], [40, -330], [28, -362], [5, -392], [-40, -402], [-82, -392]]);
  fillC(head, P2.ginger);
  fillC(ellP(ox - 42 * s, oy - 288 * s, 36 * s, 24 * s), P2.cream);
  for (const [a, b] of [[[-58, -388], [-52, -364]], [[-40, -396], [-40, -368]], [[-22, -388], [-28, -364]]]) ink(T([a, b]), { w: W_(6), col: P2.gingerD, ta: .2, tb: .5, amp: .4 });
  for (const [a, b] of [[[-116, -332], [-96, -326]], [[42, -334], [22, -326]]]) ink(T([a, b]), { w: W_(6), col: P2.gingerD, ta: .2, tb: .6, amp: .4 });
  ink(head, { w: W_(4.6), closed: true });
  // eyes: almond, slit pupils, a highlight; a slightly narrowed, scheming look
  for (const ex of [-76, -8]) {
    const e = ellP(ox + ex * s, oy - 330 * s, 17 * s, 11 * s, 0, Math.PI * 2, 20, ex < -40 ? .12 : -.12);
    fillP(e, '#F6E27A'); g.save(); g.beginPath(); g.ellipse(ox + (ex - 3) * s, oy - 330 * s, 4 * s, 10 * s, 0, 0, Math.PI * 2); g.fillStyle = INK; g.fill(); g.restore();
    g.save(); g.beginPath(); g.arc(ox + (ex + 3) * s, oy - 334 * s, 2.6 * s, 0, Math.PI * 2); g.fillStyle = '#fff'; g.fill(); g.restore();
    ink(e, { w: W_(3), closed: true });
    ink(T([[ex - 18, -346], [ex, -342], [ex + 16, -348]]).map(([x, y], i) => [x, y + (ex < -40 ? i * 1.5 : (2 - i) * 1.5) * s]), { w: W_(3.6), ta: .2, tb: .3 });   // lids
  }
  // nose, mouth, whiskers
  const nose = T([[-50, -306], [-34, -306], [-42, -296]]); fillP(nose, P2.pink); ink(nose, { w: W_(2.4), sharp: true });
  ink(T([[-42, -296], [-42, -290]]), { w: W_(2.4) }); ink(T([[-42, -290], [-48, -284], [-56, -286]]), { w: W_(2.4) }); ink(T([[-42, -290], [-36, -284], [-28, -286]]), { w: W_(2.4) });
  for (const [a, b] of [[[-64, -298], [-168, -312]], [[-64, -294], [-172, -294]], [[-64, -290], [-162, -276]], [[-20, -298], [76, -314]], [[-20, -294], [84, -296]], [[-20, -290], [74, -278]]])
    ink(T([a, b]), { w: W_(1.8), ta: .05, tb: .8, amp: .5 });
  for (const [x, y] of [[-60, -292], [-54, -286], [-30, -292], [-36, -286]]) { g.save(); g.fillStyle = INK; g.beginPath(); g.arc(ox + x * s, oy + y * s, 1.4 * s, 0, 7); g.fill(); g.restore(); }
}

// ---------------- the table with things on it (3/4 view) ----------------
function tableD() {
  const FL = [420, 640], FR = [1470, 640], BR = [1380, 556], BL = [510, 556], TH = 30;
  // shadow on the floor
  g.save(); g.fillStyle = P2.shadow; g.beginPath(); g.ellipse(945, 912, 600, 26, 0, 0, Math.PI * 2); g.fill(); g.restore();
  for (let x = 380; x < 1520; x += 22) ink([[x, 922], [x + 26, 900]], { w: 1.6, col: 'rgba(43,38,34,.35)', amp: .3 });
  // back legs (drawn first)
  for (const x of [548, 1342]) { fillP([[x - 13, 586], [x + 13, 586], [x + 11, 838], [x - 11, 838]], P2.woodFront); ink([[x - 13, 586], [x - 11, 838]], { w: 3.4 }); ink([[x + 13, 586], [x + 11, 838]], { w: 3.4 }); ink([[x - 11, 838], [x + 11, 838]], { w: 3 }); }
  // apron under the top
  fillP([[FL[0] + 30, FL[1] + TH], [FR[0] - 30, FR[1] + TH], [FR[0] - 30, FR[1] + TH + 46], [FL[0] + 30, FL[1] + TH + 46]], P2.woodFront);
  ink([[FL[0] + 30, FL[1] + TH + 46], [FR[0] - 30, FR[1] + TH + 46]], { w: 3.6 }); ink([[FL[0] + 40, FL[1] + TH + 36], [FR[0] - 40, FR[1] + TH + 36]], { w: 1.8 });
  // front legs: turned, with beads
  for (const x of [452, 1438]) {
    const top = FL[1] + TH, bot = 902, leg = [[x - 22, top], [x + 22, top], [x + 22, top + 70], [x + 15, top + 86], [x + 17, top + 102], [x + 13, bot - 12], [x + 18, bot], [x - 18, bot], [x - 13, bot - 12], [x - 17, top + 102], [x - 15, top + 86], [x - 22, top + 70]];
    fillP(leg, P2.woodLeg);
    ink(leg, { w: 4, sharp: true, closed: true, ta: .01, tb: .01 });
    for (const y of [top + 70, top + 86, top + 102, bot - 12]) ink(ellP(x, y, 18, 4, 0, Math.PI, 10), { w: 2 });
    for (let k = 0; k < 3; k++) ink([[x - 8 + k * 2, top + 120 + k * 40], [x - 6 + k * 2, top + 150 + k * 40]], { w: 1.4, col: P2.grain, amp: .3 });
  }
  // top: front face and surface
  fillP([FL, FR, [FR[0], FR[1] + TH], [FL[0], FL[1] + TH]], P2.woodFront);
  fillP([BL, BR, FR, FL], P2.woodTop);
  // planks + grain + knots
  for (const u of [.34, .67]) { const a = [lerp(BL[0], FL[0], u), lerp(BL[1], FL[1], u)], b = [lerp(BR[0], FR[0], u), lerp(BR[1], FR[1], u)]; ink([a, [lerp(a[0], b[0], .5), lerp(a[1], b[1], .5) + 1], b], { w: 2.2 }); }
  g.save(); g.beginPath(); g.moveTo(...BL); g.lineTo(...BR); g.lineTo(...FR); g.lineTo(...FL); g.closePath(); g.clip();
  const r = mulberry(5);
  for (let i = 0; i < 26; i++) { const u = r(), v = .05 + r() * .9, a = [lerp(lerp(BL[0], FL[0], v), lerp(BR[0], FR[0], v), u), lerp(lerp(BL[1], FL[1], v), lerp(BR[1], FR[1], v), u)], L = 40 + r() * 90;
    ink([a, [a[0] + L * .5, a[1] + (r() - .5) * 3], [a[0] + L, a[1] + (r() - .5) * 2]], { w: 1.4, col: P2.grain, amp: .7, ta: .3, tb: .3 }); }
  for (const [x, y] of [[700, 602], [1250, 575]]) { ink(ellP(x, y, 14, 4, 0, Math.PI * 2, 14), { w: 1.6, col: P2.grain, closed: true }); ink(ellP(x, y, 26, 7, 0, Math.PI * 2, 16), { w: 1.2, col: P2.grain, closed: true }); }
  g.restore();
  ink([BL, BR, FR, FL], { w: 4.2, closed: true, sharp: true, ta: .01, tb: .01 });
  ink([FL, [FL[0], FL[1] + TH], [FR[0], FR[1] + TH], FR], { w: 4.2, sharp: true, ta: .01, tb: .01 });
  for (let x = FL[0] + 60; x < FR[0] - 80; x += 140) ink([[x, FL[1] + 8], [x + 50, FL[1] + 10]], { w: 1.4, col: P2.grain, amp: .4 });
}
// a folded newspaper lying on the table
function newspaperD() {
  const A = [700, 606], B = [980, 606], C_ = [950, 572], D = [730, 572];
  const q = (u, v) => [lerp(lerp(D[0], A[0], v), lerp(C_[0], B[0], v), u), lerp(lerp(D[1], A[1], v), lerp(C_[1], B[1], v), u)];
  fillP([[A[0] + 6, A[1] + 3], [B[0] + 6, B[1] + 3], B, A], 'rgba(43,38,34,.18)');
  fillP([A, B, C_, D], P2.paperN); ink([A, B, C_, D], { w: 3, closed: true, sharp: true, ta: .01, tb: .01 }); ink([q(.5, 0), q(.5, 1)], { w: 1.6 });
  { const m = q(.5, .22); g.save(); g.translate(m[0], m[1]); g.transform(1, 0, -.35, .7, 0, 0); g.font = '600 18px Jost'; g.fillStyle = INK; g.textAlign = 'center'; g.letterSpacing = '1px'; g.fillText('THE DAILY MEOW', 0, 8); g.restore(); }
  for (const [u0, u1] of [[.06, .44]]) for (let v = .48; v < .95; v += .11) ink([q(u0, v), q(u1, v)], { w: 1.4, amp: .3 });
  fillP([q(.6, .5), q(.92, .5), q(.92, .9), q(.6, .9)], '#CFE6F2'); ink([q(.6, .5), q(.92, .5), q(.92, .9), q(.6, .9)], { w: 1.4, closed: true, sharp: true });
}
// the mug at the very edge
function mugD(cx, by, rot) {
  withRot(cx, by, rot, () => {
    const w = 46, h = 92, top = by - h;
    fillP([[cx - w, top], [cx + w, top], [cx + w - 4, by], [cx - w + 4, by]], P2.mug);
    fillC(ellP(cx, by, w - 4, 10, 0, Math.PI, 12).concat([[cx - w + 4, by]]), P2.mug);
    ink([[cx - w, top], [cx - w + 4, by - 2]], { w: 4 }); ink([[cx + w, top], [cx + w - 4, by - 2]], { w: 4 }); ink(ellP(cx, by - 2, w - 4, 10, 0, Math.PI, 14), { w: 4 });
    fillC(ellP(cx, top, w, 12), '#3A69AE'); fillC(ellP(cx, top + 2, w - 7, 8), P2.coffee); ink(ellP(cx, top, w, 12, 0, Math.PI * 2, 22), { w: 3.6, closed: true });
    const hd = [[cx + w - 2, top + 20], [cx + w + 30, top + 18], [cx + w + 34, top + 50], [cx + w + 6, top + 70]]; ink(hd, { w: 9, col: INK, amp: .4 }); ink(hd, { w: 4, col: P2.mug, amp: .4 });
    g.save(); g.font = '600 15px Jost'; g.fillStyle = '#F3F0EA'; g.textAlign = 'center'; g.fillText('#1 HUMAN', cx - 4, top + 54); g.restore();
    ink([[cx - w + 12, top + 26], [cx - w + 14, by - 14]], { w: 3, col: 'rgba(255,255,255,.55)', amp: .3 });
    for (const dx of [-14, 8]) ink([[cx + dx, top - 16], [cx + dx - 10, top - 40], [cx + dx + 8, top - 62], [cx + dx - 4, top - 84]], { w: 2.2, col: '#9C978C', ta: .4, tb: .5 });
  });
}
// a potted plant on the far corner
function plantD(cx, by) {
  const pot = [[cx - 40, by - 70], [cx + 40, by - 70], [cx + 30, by], [cx - 30, by]];
  for (const [a, l] of [[-.7, 110], [-.35, 140], [0, 150], [.35, 130], [.7, 105], [-.1, 120]]) { const x1 = cx + Math.sin(a) * l, y1 = by - 70 - Math.cos(a) * l;
    const lf = [[cx, by - 70], [lerp(cx, x1, .5) - Math.cos(a) * 24, lerp(by - 70, y1, .5) - Math.sin(a) * 24], [x1, y1], [lerp(cx, x1, .5) + Math.cos(a) * 24, lerp(by - 70, y1, .5) + Math.sin(a) * 24]];
    fillC(lf, P2.leaf); ink(lf, { w: 2.8, closed: true }); ink([[cx, by - 70], [lerp(cx, x1, .85), lerp(by - 70, y1, .85)]], { w: 1.6 }); }
  fillP(pot, P2.pot); ink(pot, { w: 3.6, closed: true, sharp: true, ta: .01, tb: .01 }); fillP([[cx - 46, by - 82], [cx + 46, by - 82], [cx + 46, by - 66], [cx - 46, by - 66]], '#B8472D');
  ink([[cx - 46, by - 82], [cx + 46, by - 82], [cx + 46, by - 66], [cx - 46, by - 66]], { w: 3, closed: true, sharp: true, ta: .01, tb: .01 });
}

// ---------------- the test frame ----------------
SCENES.d1 = { dur: 1, setup() {}, draw() {
  SEED = 1;
  const gy = 902;
  line([[60, gy], [1860, gy]], C.tint, LW);
  tableD();
  plantD(590, 586);
  newspaperD();
  mugD(1030, 640, -.12);
  catD(1236, 634, 1.0);
  // the stick figure stays the same (even hose)
  figure({ x: 240, gy, S: 470 }, pose({ la: -.4, lb: .2, ra: 1.3, rb: -.4, head: .25, lean: .03 }));
  label('Detail style test', 124, 118);
  text('Mr. Biscuits vs.', 116, 220, { size: 84, w: 600, track: -2 });
  text('the edge of the table.', 116, 310, { size: 84, w: 600, track: -2, col: C.ginger });
}};
const FONTS_READY = Promise.all([document.fonts.load(`600 40px ${EN}`), document.fonts.load(`500 40px ${EN}`)]);
{ const sc = SCENES[SCENE === 'full' ? 'd1' : SCENE]; sc.setup(); window.DUR = 1; window.render = t => { paper(); sc.draw(t); }; FONTS_READY.then(() => { window.render(0); window.READY = true; }); }
