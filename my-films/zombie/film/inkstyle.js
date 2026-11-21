// Hand-inked look for every prop (Colour Stick Explainer, detailed): tapered, slightly wobbly ink lines over flat colour.
// Loaded after props.js and before film.js. It re-defines shape/poly/line so every outline drawn through them is inked;
// RAW > 0 (used around the stick figures' parts) falls back to the clean even-hose line.
const INK = '#2B2622';
let RAW = 0;
function seedOf(P) { let h = P.length * 131; const x0 = P[0][0], y0 = P[0][1]; for (let i = 1; i < Math.min(P.length, 9); i++) h = (h * 31 + Math.round((P[i][0] - x0) * .5) * 17 + Math.round((P[i][1] - y0) * .5) * 7) | 0; return Math.abs(h) % 100000; }
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
  const w = o.w ?? 4, amp = o.amp ?? 1.1, seed = o.seed ?? seedOf(P), col = o.col || INK;
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
  if (o.paw !== false) {
  // raised paw reaching for the mug
  const arm = T([[-74, -186], [-128, -182], [-162, -172], [-160, -142], [-126, -150], [-70, -152]]);
  fillC(arm, P2.ginger); ink(T([[-74, -186], [-128, -182], [-160, -174]]), { w: W_(3.8) }); ink(T([[-70, -152], [-126, -150], [-152, -142]]), { w: W_(3.6) });
  ink(T([[-120, -184], [-118, -152]]), { w: W_(8), col: P2.gingerD, amp: .4 });
  const pw = T([[-150, -176], [-178, -178], [-190, -160], [-178, -140], [-150, -140]]); fillC(pw, P2.cream); ink(pw, { w: W_(3.6), closed: true });
  for (const y of [-166, -154]) ink(T([[-190, y], [-180, y + 1]]), { w: W_(2.2) });
  for (const [x, y] of [[-194, -170], [-196, -158], [-193, -146]]) ink(T([[x + 4, y], [x - 4, y - 2]]), { w: W_(1.6), ta: .1, tb: .8 });   // claws out
  } else { // second front leg on the table
    fillC(T([[-60, -140], [-26, -138], [-24, -12], [-62, -10]]), P2.ginger); ink(T([[-26, -136], [-25, -60], [-24, -14]]), { w: W_(3.4) });
    const pw2 = T([[-66, 2], [-66, -14], [-42, -22], [-18, -14], [-18, 2]]); fillC(pw2, P2.cream); ink(pw2, { w: W_(3.6) }); for (const x of [-50, -34]) ink(T([[x, -8], [x + 1, 2]]), { w: W_(2.4) });
  }
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
  if (o.angry) for (const [a, b] of [[[-98, -356], [-60, -344]], [[10, -356], [-26, -344]]]) ink(T([a, b]), { w: W_(5), ta: .2, tb: .3 });
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
  if (o.mouth === 'open') { const m = T([[-62, -292], [-22, -292], [-30, -270], [-42, -264], [-54, -270]]); fillC(m, '#7A2E2A'); ink(m, { w: W_(3), closed: true });
    for (const fx of [-56, -28]) { const f = T([[fx - 5, -292], [fx + 5, -292], [fx, -279]]); fillP(f, '#FFFFFF'); ink(f, { w: W_(1.6), sharp: true }); } }
  else { ink(T([[-42, -296], [-42, -290]]), { w: W_(2.4) }); ink(T([[-42, -290], [-48, -284], [-56, -286]]), { w: W_(2.4) }); ink(T([[-42, -290], [-36, -284], [-28, -286]]), { w: W_(2.4) }); }
  for (const [a, b] of [[[-64, -298], [-168, -312]], [[-64, -294], [-172, -294]], [[-64, -290], [-162, -276]], [[-20, -298], [76, -314]], [[-20, -294], [84, -296]], [[-20, -290], [74, -278]]])
    ink(T([a, b]), { w: W_(1.8), ta: .05, tb: .8, amp: .5 });
  for (const [x, y] of [[-60, -292], [-54, -286], [-30, -292], [-36, -286]]) { g.save(); g.fillStyle = INK; g.beginPath(); g.arc(ox + x * s, oy + y * s, 1.4 * s, 0, 7); g.fill(); g.restore(); }
}


// ---------- recording a canvas path built by a callback, as polylines ----------
function recordPath(build) {
  const subs = []; let cur = null, last = [0, 0];
  const M = ['moveTo', 'lineTo', 'quadraticCurveTo', 'bezierCurveTo', 'arc', 'ellipse', 'rect', 'roundRect', 'closePath'];
  const start = (x, y) => { cur = { P: [[x, y]], closed: false }; subs.push(cur); last = [x, y]; };
  const to = (x, y) => { if (!cur) start(x, y); else cur.P.push([x, y]); last = [x, y]; };
  const ell = (cx, cy, rx, ry, rot, a0, a1, ccw) => {
    let sw = a1 - a0; if (!ccw) { if (sw >= Math.PI * 2) sw = Math.PI * 2; while (sw < 0) sw += Math.PI * 2; } else { if (-sw >= Math.PI * 2) sw = -Math.PI * 2; while (sw > 0) sw -= Math.PI * 2; }
    const n = Math.max(10, Math.ceil(Math.abs(sw) * Math.max(rx, ry) / 5)), c = Math.cos(rot), s = Math.sin(rot);
    for (let i = 0; i <= n; i++) { const a = a0 + sw * i / n, x = Math.cos(a) * rx, y = Math.sin(a) * ry; to(cx + x * c - y * s, cy + x * s + y * c); }
    if (Math.abs(sw) >= Math.PI * 2 - 1e-6) { cur.closed = true; cur = null; }
  };
  g.moveTo = (x, y) => start(x, y);
  g.lineTo = (x, y) => to(x, y);
  g.quadraticCurveTo = (cx, cy, x, y) => { const [x0, y0] = last; for (let i = 1; i <= 12; i++) { const t = i / 12, s = 1 - t; to(s * s * x0 + 2 * s * t * cx + t * t * x, s * s * y0 + 2 * s * t * cy + t * t * y); } };
  g.bezierCurveTo = (a, b, c, d, x, y) => { const [x0, y0] = last; for (let i = 1; i <= 16; i++) { const t = i / 16, s = 1 - t; to(s * s * s * x0 + 3 * s * s * t * a + 3 * s * t * t * c + t * t * t * x, s * s * s * y0 + 3 * s * s * t * b + 3 * s * t * t * d + t * t * t * y); } };
  g.arc = (cx, cy, r, a0, a1, ccw) => ell(cx, cy, r, r, 0, a0, a1, ccw);
  g.ellipse = (cx, cy, rx, ry, rot, a0, a1, ccw) => ell(cx, cy, rx, ry, rot, a0, a1, ccw);
  g.rect = (x, y, w, h) => { start(x, y); to(x + w, y); to(x + w, y + h); to(x, y + h); cur.closed = true; cur = null; };
  g.roundRect = (x, y, w, h, r) => { r = Math.max(0, Math.min(typeof r === 'number' ? r : (r && r[0]) || 0, Math.abs(w) / 2, Math.abs(h) / 2)); cur = null;
    const arcs = [[x + w - r, y + r, -Math.PI / 2, 0], [x + w - r, y + h - r, 0, Math.PI / 2], [x + r, y + h - r, Math.PI / 2, Math.PI], [x + r, y + r, Math.PI, Math.PI * 1.5]];
    start(x + r, y); for (const [cx, cy, a, b] of arcs) { const n = Math.max(2, Math.ceil(r / 4)); for (let i = 0; i <= n; i++) { const t = a + (b - a) * i / n; to(cx + Math.cos(t) * r, cy + Math.sin(t) * r); } }
    cur.closed = true; cur = null; };
  g.closePath = () => { if (cur) { cur.closed = true; last = cur.P[0]; cur = null; } };
  try { build(); } finally { for (const m of M) delete g[m]; }
  return subs;
}
function perim(P) { let s = 0; for (let i = 1; i < P.length; i++) s += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); return s; }
function inkPath(P, closed, lw, col) {
  if (P.length < 2) return; let Q = P;
  if (closed) { Q = P.concat([P[0], P[Math.min(1, P.length - 1)]]); }   // close, and overshoot a touch past the start
  ink(Q, { w: lw * 1.15, col, sharp: true, closed: false, ta: closed ? .03 : .14, tb: closed ? .03 : .2, amp: lw < 4 ? .7 : 1.0, seed: seedOf(P) });
}
const ORIG = { shape, poly, line };
shape = function (build, fill, o = {}) {
  if (RAW) return ORIG.shape(build, fill, o);
  const col = o.col ?? C.ink, lw = o.lw ?? OUTW;
  g.save(); g.beginPath(); build(); if (fill) { g.fillStyle = fill; g.fill(); } g.restore();
  if (!lw || lw < 1) return;
  const subs = recordPath(build);
  for (const sp of subs) { if (perim(sp.P) < 40 || lw < 1.5) { g.save(); g.strokeStyle = col; g.lineWidth = lw; g.lineJoin = 'round'; g.lineCap = 'round'; g.beginPath(); g.moveTo(...sp.P[0]); for (const p of sp.P) g.lineTo(...p); if (sp.closed) g.closePath(); g.stroke(); g.restore(); }
    else inkPath(sp.P, sp.closed, lw, col); }
};
line = function (P, col, lw, dash) {
  if (RAW || dash || !lw || lw < 1.5 || perim(P) < 14) return ORIG.line(P, col, lw, dash);
  ink(P.length === 2 ? densify(P, 3) : P, { w: lw * 1.1, col, sharp: true, ta: .15, tb: .2, amp: lw < 4 ? .6 : 1.0, seed: seedOf(P) });
};

// ---------- a detailed wooden table (3/4 view): front edge from x0 to x1 at `top`, legs down to gy ----------
function tableP(x0, x1, top, gy, depth = 46, th = 26) {
  const FL = [x0, top], FR = [x1, top], BR = [x1 - depth * 1.2, top - depth], BL = [x0 + depth * 1.2, top - depth];
  for (const x of [BL[0] + 18, BR[0] - 18]) { fillP([[x - 10, top - depth + 10], [x + 10, top - depth + 10], [x + 9, gy - 40], [x - 9, gy - 40]], P2.woodFront); ink([[x - 10, top - depth + 10], [x - 9, gy - 40], [x + 9, gy - 40], [x + 10, top - depth + 10]], { w: 3, sharp: true }); }
  fillP([[x0 + 26, top + th], [x1 - 26, top + th], [x1 - 26, top + th + 34], [x0 + 26, top + th + 34]], P2.woodFront);
  ink([[x0 + 26, top + th + 34], [x1 - 26, top + th + 34]], { w: 3.4 }); ink([[x0 + 34, top + th + 26], [x1 - 34, top + th + 26]], { w: 1.6 });
  for (const x of [x0 + 28, x1 - 28]) {
    const t0 = top + th, h = gy - t0, leg = [[x - 18, t0], [x + 18, t0], [x + 18, t0 + h * .22], [x + 12, t0 + h * .28], [x + 14, t0 + h * .34], [x + 10, gy - 10], [x + 15, gy], [x - 15, gy], [x - 10, gy - 10], [x - 14, t0 + h * .34], [x - 12, t0 + h * .28], [x - 18, t0 + h * .22]];
    fillP(leg, P2.woodLeg); ink(leg.concat([leg[0]]), { w: 3.6, sharp: true, ta: .01, tb: .01 });
    for (const y of [t0 + h * .22, t0 + h * .28, t0 + h * .34, gy - 10]) ink(ellP(x, y, 14, 3.5, 0, Math.PI, 10), { w: 1.8 });
    for (let k = 0; k < 2; k++) ink([[x - 6 + k * 3, t0 + h * .45 + k * h * .18], [x - 4 + k * 3, t0 + h * .58 + k * h * .18]], { w: 1.3, col: P2.grain, amp: .3 });
  }
  fillP([FL, FR, [FR[0], FR[1] + th], [FL[0], FL[1] + th]], P2.woodFront);
  fillP([BL, BR, FR, FL], P2.woodTop);
  g.save(); g.beginPath(); g.moveTo(...BL); g.lineTo(...BR); g.lineTo(...FR); g.lineTo(...FL); g.closePath(); g.clip();
  const u = .5, a = [lerp(BL[0], FL[0], u), lerp(BL[1], FL[1], u)], b = [lerp(BR[0], FR[0], u), lerp(BR[1], FR[1], u)]; ink([a, b], { w: 2 });
  const r = mulberry(Math.round(x0 + x1)); for (let i = 0; i < Math.round((x1 - x0) / 40); i++) { const uu = r(), v = .08 + r() * .84, p = [lerp(lerp(BL[0], FL[0], v), lerp(BR[0], FR[0], v), uu), lerp(lerp(BL[1], FL[1], v), lerp(BR[1], FR[1], v), uu)], L = 30 + r() * 70;
    ink([p, [p[0] + L * .5, p[1] + (r() - .5) * 2], [p[0] + L, p[1] + (r() - .5) * 2]], { w: 1.3, col: P2.grain, amp: .6, ta: .3, tb: .3 }); }
  g.restore();
  ink([BL, BR, FR, FL, BL], { w: 3.8, sharp: true, ta: .01, tb: .01 });
  ink([FL, [FL[0], FL[1] + th], [FR[0], FR[1] + th], FR], { w: 3.8, sharp: true, ta: .01, tb: .01 });
  for (let x = x0 + 50; x < x1 - 70; x += 120) ink([[x, top + 8], [x + 40, top + 10]], { w: 1.3, col: P2.grain, amp: .4 });
}
