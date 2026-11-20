// "What if you used 100% of your brain?" — the film. Every frame is a pure function of t (seconds); timings from timeline.js (voice).
// Camera comfort rules: fast pushes ≤ 0.4 s and always followed by a ≥ 0.8 s hold; rotation ≤ 1.5°; never two fast moves in a row;
// each scene opens with a gentle pinch (1.04× → 1×).
const TLS = window.TL, LN = TLS.lines, SC = Object.fromEntries(TLS.scenes.map(s => [s.id, s]));
const QS2 = new URLSearchParams(location.search);
const TO = +(QS2.get('to') ?? TLS.dur);
const DUR = Math.min(TLS.dur, TO);
const lt = id => LN[id].t, le = id => LN[id].t + LN[id].dur;
function wt(id, w, n = 1) { const ws = LN[id].words; let k = 0; for (const x of ws) if (x[0].toLowerCase().replace(/[^a-z0-9.%]/g, '').startsWith(w.toLowerCase()) && ++k === n) return x[1]; return LN[id].t; }

// ---------- motion helpers ----------
const ein = (t, a, d = .4) => ss(seg(t, a, a + d));
const eout3 = u => 1 - Math.pow(1 - clamp(u), 3);
function sp(x, w = 11, z = .6) { if (x <= 0) return 0; const wd = w * Math.sqrt(1 - z * z); return 1 - Math.exp(-z * w * x) * (Math.cos(wd * x) + z * w / wd * Math.sin(wd * x)); }
const pop = (t, a) => sp(t - a, 17, .45);
function lerpPose(a, b, s) { const o = {}; for (const k of KEYS) o[k] = a[k] + (b[k] - a[k]) * s; return o; }
function poseAt(keys, t) { let p = { ...keys[0][1] }; for (let i = 1; i < keys.length; i++) { const s = sp(t - keys[i][0]); if (s > 0) p = lerpPose(p, keys[i][1], s); } return p; }
function breathe(p, t, ph = 0) { const q = { ...p }; q.hy += .004 * Math.sin(t * 2.1 + ph); q.head += .015 * Math.sin(t * 1.3 + ph); return q; }
function popIn(x, y, k, fn) { if (k <= 0.001) return; g.save(); g.translate(x, y); g.scale(k, k); g.translate(-x, -y); fn(); g.restore(); }
function T(s, x, y, o, t, a, out = 1e9) { const k = ein(t, a, .4) * (1 - ein(t, out - .3, .3)); if (k <= 0) return; text(s, x, y + (1 - k) * 18, { ...o, a: k * (o.a ?? 1) }); }
function Lb(s, x, y, t, a, out, o = {}) { const k = ein(t, a, .4) * (1 - ein(t, (out ?? 1e9) - .3, .3)); if (k <= 0) return; label(s, x, y + (1 - k) * 12, { a: k, ...o }); }
function shakeAt(t, a, amp = 6, d = .25) { const u = t - a; if (u < 0 || u > d) return [0, 0]; const k = (1 - u / d) * amp; return [Math.sin(u * 83) * k, Math.cos(u * 71) * k]; }
function headline2(a, b, colB, t, ta, tb, size = 84, y = 238) { T(a, 118, y, { size, w: 600, track: -2 }, t, ta); if (b) T(b, 118, y + size * 1.08, { size, w: 600, track: -2, col: colB }, t, tb ?? ta + .25); }

// ---------- camera ----------
let CAM = { z: 1, cx: W / 2, cy: H / 2, r: 0, sx: 0, sy: 0 };
function pinch(t, s, sign = 1) { const u = eout3((t - s.t0) / .85), drift = seg(t, s.t0 + .85, s.t1); return { z: lerp(1.04, 1, u) * (1 + .008 * drift), r: sign * (lerp(1.2, .3, u) - .25 * drift) * Math.PI / 180 }; }
function camSet(z = 1, cx = W / 2, cy = H / 2, r = 0, sx = 0, sy = 0) { const c = Math.cos(r) * z, sn = Math.sin(r) * z; g.setTransform(c, sn, -sn, c, W / 2 + sx - (c * cx - sn * cy), H / 2 + sy - (sn * cx + c * cy)); }
function scr() { g.setTransform(1, 0, 0, 1, 0, 0); }
function world(fn) { HIDE = 1; fn(); HIDE = 0; }
// zoom z about world point P, which sits at screen point A (no sideways swing while zooming)
function camAnchor(z, P, A, r = 0) { camSet(z, P[0] - (A[0] - W / 2) / z, P[1] - (A[1] - H / 2) / z, r); }
let SUBWASH = 0, SUBDARK = 0;

// ---------- events for the mixer ----------
const EV = []; const ev = (t, type, o = {}) => { if (t <= DUR + .5) EV.push({ t: +t.toFixed(3), type, ...o }); };
const FILM = {};

// ---------- shared drawings ----------
function bedroomSet() {
  wall(0, GY, '#F6E7C8'); for (let x = 40; x < W; x += 64) dline([[x, 110], [x, GY - 120]], '#EBD6AE');
  rect(-20, GY - 120, W + 40, 120, '#E9D3A8', { lw: 0 }); dline([[-20, GY - 120], [W + 20, GY - 120]]);
  windowW(1150, 190, 300, 260, C.sky, { sun: 1 });
  for (const [x0, s] of [[1110, -1], [1490, 1]]) { const P = [[x0, 160], [x0 + s * 70, 160], [x0 + s * 60, 360], [x0 + s * 90, 520], [x0 + s * 10, 520], [x0 + s * -6, 360]]; fillC(P, C.pink); ink(P, { w: 4.5, closed: true }); for (const k of [.3, .6]) ink([[x0 + s * 70 * k, 170], [x0 + s * (10 + 70 * k), 510]], { w: 1.8, col: '#C98078' }); }
  line([[1080, 160], [1520, 160]], C.ink, 8);
  const bx = 820, bw = 640, top = 690;
  rect(bx - 30, 520, 46, GY - 520, C2.wood); rect(bx - 40, 510, 66, 20, C2.wood);
  rect(bx, top, bw, 70, '#F7F3E8'); rect(bx + 6, top + 70, bw, 40, C2.wood);
  const bl = [[bx + 150, top - 10], [bx + bw + 10, top - 4], [bx + bw + 20, top + 96], [bx + 140, top + 96]]; fillC(bl, C.blue); ink(bl, { w: 5, closed: true });
  for (let k = 0; k < 6; k++) for (let m = 0; m < 2; m++) circ(bx + 210 + k * 80, top + 22 + m * 44, 7, '#7FA6E0', { lw: 0 });
  rrect(bx + 20, top - 50, 160, 64, 30, C2.white); for (const x of [bx + 30, bx + bw - 30]) rect(x - 10, top + 110, 20, GY - top - 110, C2.wood);
  rect(1500, 700, 150, GY - 700, C2.woodL); dline([[1500, 760], [1650, 760]]); circ(1575, 730, 6, C.ink, { lw: 0 }); circ(1575, 800, 6, C.ink, { lw: 0 });
  ground(GY, -20, W + 20);
}
function brainTag(x, y, v, k = 1) { popIn(x + 120, y + 32, k, () => { rrect(x, y, 240, 64, 14, C2.white, { lw: 4 }); label('Brain', x + 20, y + 40, { col: C.ink }); rrect(x + 100, y + 18, 120, 28, 6, C2.white, { lw: 3 }); rrect(x + 103, y + 21, 114 * v, 22, 4, C.ginger, { lw: 0 }); text(Math.round(v * 100) + '%', x + 160, y + 42, { size: 22, w: 600, align: 'center' }); }); }
function icon(kind, x, y, k) {
  popIn(x, y, k, () => { circ(x, y, 52, C2.white, { lw: 5 });
    if (kind === 'book') { poly([[x - 30, y - 22], [x, y - 14], [x, y + 26], [x - 30, y + 18]], C.sky, { lw: 3 }); poly([[x + 30, y - 22], [x, y - 14], [x, y + 26], [x + 30, y + 18]], C.sky, { lw: 3 }); }
    if (kind === 'eq') text('∑x²', x, y + 12, { size: 34, w: 600, align: 'center' });
    if (kind === 'lang') text('あ A', x, y + 12, { size: 30, w: 600, align: 'center' });
    if (kind === 'chip') { rect(x - 22, y - 22, 44, 44, C.ginger, { lw: 4 }); for (let i = -1; i <= 1; i++) { dline([[x - 32, y + i * 12], [x - 22, y + i * 12]]); dline([[x + 22, y + i * 12], [x + 32, y + i * 12]]); } }
    if (kind === 'ein') { for (const [a, rr] of [[-2.4, 14], [-1.9, 15], [-1.2, 14], [-.6, 13], [0, 0]]) if (rr) circ(x + Math.cos(a) * 22, y - 6 + Math.sin(a) * 22, rr, '#F7F6F1', { lw: 2.5 }); circ(x, y - 4, 20, C.paper, { lw: 3 }); line([[x, y + 16], [x, y + 34]], C.ink, 3); }
    if (kind === 'heart') text('♥', x, y + 14, { size: 44, w: 400, col: C.pink, align: 'center' });
    if (kind === 'eye') { shape(() => g.ellipse(x, y, 30, 18, 0, 0, Math.PI * 2), C2.white, { lw: 3 }); circ(x, y, 9, C.ink, { lw: 0 }); }
  });
}
// a phone with a chat, at any rectangle (so it can travel between layouts)
function phoneUI(x, y, w, h, msgs, o = {}) {
  const k = w / 600;
  g.save(); g.translate(x, y); g.scale(k, k);
  rrect(0, 0, 600, h / k, 70, C.ink, { lw: 6 }); rrect(24, 24, 552, h / k - 48, 50, '#FBFAF6', { lw: 0 });
  rrect(230, 34, 140, 26, 13, '#111', { lw: 0 });
  rect(24, 70, 552, 110, '#F1EDE5', { lw: 0 });
  circ(100, 126, 36, C.paper, { lw: 4 }); shape(() => { g.arc(100, 126, 37, Math.PI * 1.05, Math.PI * 1.95); g.closePath(); }, C3.hair, { lw: 3 }); circ(140, 120, 12, C3.hair, { lw: 3 });
  text('Her ❤', 156, 120, { size: 36, w: 600 }); text(o.status || 'online', 158, 156, { size: 22, w: 500, col: C.grass });
  let yy = 230;
  for (const m of msgs) { const [s, who, sz, kk] = m, size = sz || 30, a = kk ?? 1; if (a <= 0) continue;
    popIn(who === 'me' ? 540 : 60, yy + size, a, () => { if (who === 'me') chat(550, yy, s, { me: 1, right: 1, size }); else if (who === 'her') chat(50, yy, s, { size, wt: size > 40 ? 600 : 500 }); else text(s, 300, yy + 26, { size: 20, w: 500, col: C.mute, align: 'center' }); });
    if (who === 'ts') yy -= 30; yy += size * 1.75 + 22; }
  if (o.typing) { rrect(50, yy, 110, 52, 26, C3.bubbleG, { lw: 4 }); for (const q of [0, 1, 2]) circ(80 + q * 25, yy + 26, 6, C.mute, { lw: 0 }); }
  if (o.read) text(o.read, 552, yy + 10, { size: 20, w: 500, col: C.mute, align: 'right' });
  rrect(44, h / k - 100, 512, 64, 32, '#F1EDE5', { lw: 3 }); text(o.draft || 'Message…', 74, h / k - 58, { size: 24, w: 500, col: o.draft ? C.ink : C.mute });
  g.restore();
}
function bigHead(hx, hy, R, red, rot = -.3) { circ(hx, hy, R, red ? C.red : C.ginger, { lw: 0 }); brainFolds(hx, hy, R, -Math.PI / 2 + rot, red ? '#9E2A1C' : C.gingerD); circ(hx, hy, R, null, { lw: 9, col: C.ink }); }

// ================= HOOK =================
// ---- h1: wake up at 100 % ----
{ const s = SC.h1, tUp = wt('p001', 'woke'), tPct = wt('p001', 'one'), tBook = wt('p002', 'books'), tEq = wt('p002', 'equations'), tLang = wt('p002', 'languages'), tTod = wt('p002', 'toddler'), tEin = wt('p003', 'einstein');
  ev(s.t0 + .2, 'pop'); ev(tUp, 'stretch'); ev(tPct, 'rise'); ev(tPct + 1.1, 'ding'); ev(tBook, 'pop'); ev(tEq, 'pop'); ev(tLang, 'pop'); ev(tEin, 'sting');
  const P0 = pose({ la: -.3, lb: .1, ra: .3, rb: -.1, head: .25, hy: .02, lean: .04 }), UP = pose({ la: -2.5, lb: -.25, ra: 2.5, rb: .25, head: .06 }), OK = pose({ la: -.5, lb: .2, ra: 1.0, rb: 1.9, head: -.05 });
  FILM.h1 = t => {
    const pc = pinch(t, s, -1), push = ss(seg(t, s.t0 + 1, s.t1)) * .06;
    camSet(pc.z * (1 + push), 960, 540, pc.r);
    world(() => { bedroomSet(); clockW(1550, 650, 42, 7, 2 + Math.floor(seg(t, s.t0, s.t1) * 3)); rrect(1600, 684, 40, 16, 4, C.ink, { lw: 0 });
      const p = breathe(poseAt([[0, P0], [tUp, UP], [tEin + .6, OK]], t), t);
      const j = brainy({ x: 1720, gy: GY, S: 400 }, p, { spark: t > tPct + .9 && Math.sin(t * 6) > -.6 });
      const v = ss(seg(t, tPct, tPct + 1.1)); brainTag(1600, 330, v, pop(t, tPct - .3));
      icon('book', 1390, 610, pop(t, tBook)); icon('eq', 1470, 490, pop(t, tEq)); icon('lang', 1600, 560, pop(t, tLang)); icon('ein', 1880, 300, pop(t, tEin) * (1 - ein(t, s.t1 - .3, .3)));
      if (t > tEin) { const k = pop(t, tEin + .15); popIn(1880, 380, k, () => { rrect(1810, 360, 140, 40, 20, C.ginger, { lw: 3 }); text('you win', 1880, 388, { size: 22, w: 600, align: 'center' }); }); }
    });
    scr(); Lb('What if?  ·  Brain upgrade', 124, 150, t, s.t0 + .2);
    T('What if you used', 118, 238, { size: 92, w: 600, track: -2 }, t, s.t0 + .3); T('100% of your brain?', 118, 337, { size: 92, w: 600, track: -2, col: C.ginger }, t, tPct - .2);
  };
}
// ---- h2: a walking supercomputer… except ----
{ const s = SC.h2, tPred = wt('p004', 'predict'), tEmo = wt('p004', 'emotions'), tProb = wt('p004', 'problems'), tSup = wt('p005', 'supercomputer'), tEx = lt('p006'), tOne = lt('p007'), tGf = lt('p008'), tCr = wt('p009', 'crash'), tOs = wt('p009', 'operating');
  ev(s.t0 + .1, 'whoosh'); ev(tPred, 'pop'); ev(tEmo, 'pop'); ev(tProb, 'pop'); ev(tSup, 'chime'); ev(tEx - .05, 'stop'); ev(tGf, 'boss'); ev(tCr, 'glitch');
  const YOU = pose({ la: -.9, lb: -.4, ra: .9, rb: .4, head: -.05 });
  FILM.h2 = t => {
    const pc = pinch(t, s, 1); camSet(pc.z, 960, 540, pc.r);
    world(() => {
      const cx = 640, gy = GY, grow = eout3((t - s.t0) / .55), spin = (t < tEx ? t : tEx) * .35;
      g.save(); g.globalAlpha = grow; shape(() => g.ellipse(cx, 500, 330 * grow, 120 * grow, -.12, 0, Math.PI * 2), null, { lw: 3, col: C.mute }); g.restore();
      const items = [['book', 0, s.t0], ['eq', 1, s.t0 + .1], ['lang', 2, s.t0 + .2], ['eye', 3, tPred], ['heart', 4, tEmo], ['chip', 5, tProb]];
      for (const [k, i, a] of items) { const ang = spin + i / 6 * Math.PI * 2, x = cx + Math.cos(ang) * 330 * grow, y = 500 + Math.sin(ang) * 120 * grow - Math.cos(ang) * 30; icon(k, x, y, pop(t, a) * grow * (.85 + .15 * Math.sin(ang))); }
      const j = brainy({ x: cx, gy, S: 400 }, breathe(poseAt([[0, YOU], [tEx, pose({ la: -.4, lb: .2, ra: .4, rb: -.2, head: .2 })], [tGf + .3, pose({ la: -.5, lb: .3, ra: .5, rb: -.3, head: .35, lean: .05 })]], t), t), { spark: t < tCr || (t > tCr + .5) || Math.sin(t * 40) > 0, red: t > tCr && t < tCr + .45 && Math.sin(t * 50) > 0 });
      // the boss walks in
      const walkIn = seg(t, tGf - .9, tGf + .2), gx = lerp(2150, 1480, eout3(walkIn)), ph = t * 9;
      const gp = walkIn < 1 ? Object.assign(pose({}), { lfx: .07 * Math.sin(ph), rfx: -.07 * Math.sin(ph), lfy: .045 * Math.max(0, Math.cos(ph)), rfy: .045 * Math.max(0, -Math.cos(ph)), la: .3 + .3 * Math.sin(ph), lb: -.3, ra: 1.1, rb: 1.6, head: .1 }) : pose({ la: -.4, lb: .2, ra: 1.1, rb: 1.6, head: .1 });
      if (t > tGf - 1) { gf({ x: gx, gy, S: 380, face: -1 }, breathe(gp, t, 1)); rrect(gx - 40, 570, 34, 58, 7, C.ink, { lw: 0 }); }
      if (t > tGf + .3) { const k = pop(t, tGf + .3); popIn(1490, 326, k, () => { label('Boss', 1360, 300, { col: C.red }); rrect(1360, 314, 260, 24, 6, C2.white, { lw: 4 }); rrect(1364, 318, 252 * ss(seg(t, tGf + .4, tGf + 1.2)), 16, 4, C.red, { lw: 0 }); text('∞', 1640, 336, { size: 30, w: 600, col: C.red }); }); }
      if (t > tCr - .3) { popIn(1340, 450, pop(t, tCr - .3), () => chat(1300, 420, '• • •', { size: 30, wt: 600 })); }
      ground(gy, 124, 1796);
    });
    scr(); Lb('Hook', 124, 150, t, s.t0 + .2);
    if (t < tEx - .1) T('A walking', 118, 238, { size: 84, w: 600, track: -2 }, t, tSup - .3, tEx), T('supercomputer.', 118, 329, { size: 84, w: 600, track: -2, col: C.ginger }, t, tSup - .1, tEx);
    else headline2('Except…', 'there\'s one problem.', C.red, t, tEx, tOne);
  };
}
// ---- h3: before we get to that… (slow push to the head, then a fast dive) ----
{ const s = SC.h3, tLet = lt('p011'), tDive = s.t1 - .42;
  ev(tDive, 'whoosh'); ev(s.t1, 'thump');
  FILM.h3 = t => {
    const slow = ss(seg(t, s.t0, tDive)), fast = t > tDive ? eout3((t - tDive) / .42) : 0;
    const j0 = joints({ x: 640, gy: GY, S: 400 }, pose({ la: -.5, lb: .3, ra: .5, rb: -.3, head: .35, lean: .05 })), Hd = j0.Hd;
    const z = lerp(1, 1.25, slow) * lerp(1, 7, fast), A = [lerp(Hd[0], W / 2, fast), lerp(Hd[1], H / 2, fast)];
    camAnchor(z, Hd, A); SUBWASH = fast;
    const fadeIcons = 1 - ein(t, tDive - .5, .35);
    world(() => {
      g.save(); g.globalAlpha = fadeIcons; shape(() => g.ellipse(640, 500, 330, 120, -.12, 0, Math.PI * 2), null, { lw: 3, col: C.mute }); g.restore();
      const items = ['book', 'eq', 'lang', 'eye', 'heart', 'chip']; items.forEach((k, i) => { const ang = SC.h2.t1 * .35 + i / 6 * Math.PI * 2 + (t - s.t0) * .35; icon(k, 640 + Math.cos(ang) * 330, 500 + Math.sin(ang) * 120 - Math.cos(ang) * 30, (.85 + .15 * Math.sin(ang)) * fadeIcons); });
      brainy({ x: 640, gy: GY, S: 400 }, breathe(pose({ la: -.5, lb: .3, ra: .5, rb: -.3, head: .35, lean: .05 }), t), { spark: 1 });
      const out = seg(t, s.t0, s.t0 + 1.2), gx = lerp(1480, 2200, ss(out));
      if (gx < 2150) gf({ x: gx, gy: GY, S: 380, face: 1 }, pose({ la: -.4, lb: .2, ra: 1.1, rb: 1.6, head: -.1 }));
      ground(GY, 124, 1796);
    });
    scr(); if (t > tDive) speedLines(W / 2, H / 2, .5 + fast * .7, 5 + Math.floor((t - tDive) * 30), 40);
    if (t < tDive) { T('But first…', 118, 238, { size: 84, w: 600, track: -2 }, t, s.t0 + .2, tDive); T('let\'s find out.', 118, 329, { size: 84, w: 600, track: -2, col: C.ginger }, t, tLet, tDive); }
  };
}

// ================= CHAPTER 1 · PERFECT MEMORY =================
// ---- c1a: Day one — out of the head into the bedroom; every memory comes back ----
{ const s = SC.c1a, tPhone = wt('p013', 'phone'), tEv = wt('p013', 'everything'), tConv = wt('p014', 'conversation'), tBook = wt('p014', 'book'), tPw = wt('p014', 'password'), tPow = wt('p015', 'ridiculously');
  ev(s.t0 + .15, 'pop'); ev(tPhone, 'tap'); ev(tEv, 'shimmer'); ev(tConv, 'card'); ev(tBook, 'card'); ev(tPw, 'card'); ev(tPow, 'grow2');
  FILM.c1a = t => {
    const out = eout3((t - s.t0) / 1.0), j0 = joints({ x: 1720, gy: GY, S: 400 }, pose({ la: -.5, lb: .2, ra: .5, rb: -.2 }));
    const pc = pinch(t, s, -1), z = lerp(7, 1, out) * (out >= 1 ? pc.z : 1);
    if (out < 1) { camAnchor(z, j0.Hd, [lerp(W / 2, j0.Hd[0], out), lerp(H / 2, j0.Hd[1], out)]); SUBWASH = 1 - out; } else camSet(z, 960, 540, pc.r);
    world(() => {
      bedroomSet(); clockW(1550, 650, 42, 7, 5); rrect(1600, 684, 40, 16, 4, C.ink, { lw: 0 });
      const pP = pose({ la: -.4, lb: .2, ra: .5, rb: 2.4, head: .3 });
      const p = breathe(poseAt([[0, pose({ la: -.5, lb: .2, ra: .5, rb: -.2 })], [tPhone - .2, pP]], t), t);
      const j = brainy({ x: 1720, gy: GY, S: 400 }, p, { spark: t > tEv });
      if (t > tPhone - .2) { const h = j.aR[1]; rrect(h[0] - 16, h[1] - 56, 32, 56, 6, C.ink, { lw: 0 }); rect(h[0] - 12, h[1] - 50, 24, 42, '#FCE2C6', { lw: 0 }); }
      // memory cards fly out of the head into a wall
      const cards = [[tConv, 'chat', 1130, 330, '"see you at 8!"'], [tBook, 'book', 1300, 250, 'every book'], [tPw, 'pw', 1480, 330, '•••••••• 2012']];
      for (const [a, kind, x, y, s2] of cards) { const k = ein(t, a - .1, .45); if (k <= 0) continue;
        const X = lerp(j.Hd[0], x, eout3(k)), Y = lerp(j.Hd[1], y, eout3(k));
        popIn(X, Y, .3 + .7 * k, () => { rrect(X - 110, Y - 44, 220, 88, 14, C2.white, { lw: 4 }); rect(X - 110, Y - 44, 12, 88, C.ginger, { lw: 0 }); text(s2, X - 86, Y + 10, { size: kind === 'pw' ? 26 : 24, w: 600 }); }); }
      if (t > tPow - .2) { const r = mulberry(4), k = seg(t, tPow - .2, tPow + 1.4); for (let i = 0; i < 26; i++) { const a = r() * 1.2, x = 860 + r() * 900, y = 200 + r() * 360; if (k > a / 1.2) { g.save(); g.globalAlpha = .55; rrect(x - 40, y - 18, 80, 36, 8, '#FCE2C6', { lw: 2.5 }); g.restore(); } } }
    });
    scr(); Lb('Chapter 1  ·  Perfect memory', 124, 150, t, s.t0 + .5);
    T('Day one.', 118, 238, { size: 92, w: 600, track: -2 }, t, s.t0 + .6); T('You remember everything.', 122, 312, { size: 40, w: 500, col: C.ginger }, t, tEv);
  };
}
// ---- c1b: the normal filter vs. no filter (new frame) ----
function funnel(x, y, open) {
  const w0 = 380, w1 = lerp(60, 300, open), h = 260;
  poly([[x - w0 / 2, y], [x + w0 / 2, y], [x + w1 / 2, y + h], [x + w1 / 2, y + h + 60], [x - w1 / 2, y + h + 60], [x - w1 / 2, y + h]], '#E2EEF2');
  for (let k = 1; k < 4; k++) dline([[x - w0 / 2 + k * 12 * (1 - open), y + k * 60], [x + w0 / 2 - k * 12 * (1 - open), y + k * 60]], '#B9CDD4');
  label(open > .5 ? 'No filter' : 'Brain filter', x - 70, y - 20, { col: C.ink });
}
{ const s = SC.c1b, tKeep = wt('p016', 'keeping'), tDisc = wt('p016', 'discarding'), tImag = lt('p017'), tAll = wt('p017', 'every');
  ev(tKeep, 'tick'); ev(tDisc, 'womp'); ev(tImag, 'whoosh'); ev(tAll, 'shimmer');
  FILM.c1b = t => {
    const pc = pinch(t, s, 1); camSet(pc.z, 960, 540, pc.r);
    world(() => {
      const open = ss(seg(t, tImag, tImag + .8)), fx = 1100, fy = 300;
      funnel(fx, fy, open);
      const bin = [1500, 760]; rrect(bin[0] - 90, bin[1] - 120, 180, 120, 14, C2.chrome); for (let k = 0; k < 4; k++) dline([[bin[0] - 70 + k * 46, bin[1] - 110], [bin[0] - 66 + k * 46, bin[1] - 10]], '#8E99A0'); label('Forgotten', bin[0] - 70, bin[1] + 34);
      const jar = [700, 760]; rrect(jar[0] - 100, jar[1] - 140, 200, 140, 20, '#FCE2C6'); label('Kept', jar[0] - 30, jar[1] + 34);
      // falling memory cards
      const r = mulberry(12);
      for (let i = 0; i < 18; i++) { const t0 = s.t0 + .3 + i * .42, u = (t - t0) / 1.6; if (u < 0) continue; const keep = open > .5 || (i % 4 === 0);
        const after = t0 > tImag + .4 ? true : keep, x0 = fx - 160 + r() * 320;
        let x, y, a = 1;
        if (u < .5) { x = lerp(x0, fx, u * 2); y = lerp(80, fy + 260, u * 2); }
        else { const v = clamp((u - .5) * 2); if (after) { x = lerp(fx, jar[0], v); y = lerp(fy + 320, jar[1] - 80 - (i % 3) * 18, v); } else { x = lerp(fx, bin[0], v); y = lerp(fy + 320, bin[1] - 80, v); a = 1 - v * .5; } }
        g.save(); g.globalAlpha = a; rrect(x - 50, y - 22, 100, 44, 9, after ? '#FCE2C6' : C2.white, { lw: 3.4 }); ORIG.line([[x - 34, y - 6], [x + 30, y - 6]], C.mute, 2.4); ORIG.line([[x - 34, y + 8], [x + 12, y + 8]], C.mute, 2.4); g.restore(); }
      if (t < tImag) { const j = plain({ x: 300, gy: GY, S: 360 }, breathe(pose({ la: -.5, lb: .2, ra: .5, rb: -.2, head: .1 }), t)); }
      else brainy({ x: 300, gy: GY, S: 360 }, breathe(pose({ la: -2.3, lb: -.4, ra: 2.3, rb: .4, head: -.05 }), t), { spark: 1 });
      ground(GY, 124, 1796);
    });
    scr(); Lb('Chapter 1  ·  Perfect memory', 124, 150, t, s.t0 + .2);
    if (t < tImag) headline2('Normally,', 'your brain filters.', C.mute, t, s.t0 + .3, tKeep, 76);
    else headline2('Now:', 'almost every detail.', C.ginger, t, tImag, tAll, 76);
  };
}
// ---- c1c: read once, done; the typo on page 147 ----
{ const s = SC.c1c, tDone = lt('p019'), tTypo = wt('p020', 'typo'), tChar = wt('p020', 'characters');
  ev(tDone, 'slam'); ev(tTypo, 'circle'); ev(tChar, 'pop');
  FILM.c1c = t => {
    const pc = pinch(t, s, -1), push = ss(seg(t, tTypo - .3, tTypo + 1.2)) * .1;
    camSet(pc.z * (1 + push), 960, 500, pc.r);
    world(() => {
      shelf(1310, 150, 460, 3, 140, 7);
      const cx = 520; shape(() => g.roundRect(cx - 230, 560, 300, 260, 40), C3.teal); shape(() => g.roundRect(cx - 270, 680, 380, 120, 30), '#6AB0A5'); rect(cx - 250, 800, 24, 80, C2.wood); rect(cx + 70, 800, 24, 80, C2.wood);
      const shut = t > tDone - .05; const p = breathe(poseAt([[0, pose({ la: -.9, lb: -1.6, ra: .6, rb: -2.1, head: .3 })], [tDone - .05, pose({ la: -.8, lb: -1.5, ra: .5, rb: -2.0, head: -.05 })]], t), t);
      const j = brainy({ x: cx + 260, gy: GY, S: 400 }, p, { spark: shut });
      const bx = j.aR[1][0] - 70, by = j.aR[1][1] - 70;
      if (!shut) { // pages flipping fast
        poly([[bx, by + 10], [bx + 80, by], [bx + 80, by + 100], [bx, by + 110]], C2.white, { lw: 4 }); poly([[bx + 80, by], [bx + 160, by + 10], [bx + 160, by + 110], [bx + 80, by + 100]], C2.white, { lw: 4 });
        const f = (t * 6) % 1; withRot(bx + 80, by + 50, 0, () => poly([[bx + 80, by], [bx + 80 + 80 * Math.cos(f * Math.PI), by + 10 - 20 * Math.sin(f * Math.PI)], [bx + 80 + 80 * Math.cos(f * Math.PI), by + 110 - 20 * Math.sin(f * Math.PI)], [bx + 80, by + 100]], C2.white, { lw: 3 }));
        const n = Math.min(300, Math.floor(seg(t, s.t0, tDone) * 300)); text(n + '/300', bx + 80, by - 20, { size: 22, w: 600, col: C.mute, align: 'center' });
      } else { const k = pop(t, tDone - .05); popIn(bx + 80, by + 55, .9 + .1 * k, () => { rect(bx + 30, by, 100, 120, C.blue, { lw: 4 }); dline([[bx + 42, by + 6], [bx + 42, by + 114]]); text('300', bx + 86, by + 66, { size: 24, w: 600, col: C.paper, align: 'center' }); }); }
      if (t > tTypo - .5) { const k = eout3((t - tTypo + .5) / .5), mx = lerp(1500, 1060, k), my = 400;
        line([[mx + 100, my + 100], [mx + 170, my + 170]], C2.wood, 22); circ(mx, my, 140, C2.white, { lw: 10 });
        text('…the cat sat on', mx - 120, my - 40, { size: 30, w: 400, col: C.mute }); text('teh', mx - 120, my + 14, { size: 54, w: 600 }); text('mat. Then', mx - 10, my + 14, { size: 30, w: 400, col: C.mute });
        const c = ein(t, tTypo, .4); if (c > 0) { g.save(); g.strokeStyle = C.ginger; g.lineWidth = 6; g.lineCap = 'round'; g.beginPath(); g.ellipse(mx - 82, my - 2, 58, 36, -.08, -Math.PI / 2, -Math.PI / 2 + c * Math.PI * 2); g.stroke(); g.restore(); }
        label('page 147', mx - 46, my + 80); }
      ground(GY, 124, 1796);
    });
    scr(); Lb('Chapter 1  ·  Perfect memory', 124, 150, t, s.t0 + .2);
    headline2('Read it once.', 'Done.', C.ginger, t, s.t0 + .3, tDone);
  };
}
// ---- c1d: the exam ----
function classroom(t, o) {
  wall(0, GY, '#E5EEF0'); rect(-20, GY - 90, W + 40, 90, '#D3E0E4', { lw: 0 }); dline([[-20, GY - 90], [W + 20, GY - 90]]);
  rect(940, 170, 800, 330, C2.wood); rect(958, 188, 764, 294, C3.board, { lw: DL });
  text('FINAL EXAM', 990, 250, { size: 34, w: 500, col: C3.chalk });
  ['Q1.  Name every king of France', 'Q2.  Solve  3x² − 12 = 0', 'Q3.  Explain everything'].forEach((q, i) => { text(q, 990, 310 + i * 50, { size: 28, w: 500, col: C3.chalk }); const k = o.ticks?.[i] ?? 0; if (k > 0) { g.save(); g.globalAlpha = k; ink([[1600, 300 + i * 50], [1614, 314 + i * 50], [1644, 284 + i * 50]], { w: 6, col: C.ginger }); g.restore(); } });
  rect(1240, 482, 200, 14, C2.woodL); clockW(820, 230, 52, 9, 50 + (o.min || 0));
  const desk = (x, w = 240) => { rect(x - w / 2, 690, w, 22, C2.woodL); rect(x - w / 2 + 14, 712, 14, GY - 712, C.ink, { lw: 0 }); rect(x + w / 2 - 28, 712, 14, GY - 712, C.ink, { lw: 0 }); rect(x - w / 2 + 40, 674, 80, 16, C2.white, { lw: 3 }); };
  for (const [x, i] of [[1180, 0], [1480, 1]]) { desk(x); const tr = o.turn ?? 0; plain({ x, gy: GY, S: 330 }, breathe(pose({ la: -.4, lb: -.9, ra: .4, rb: .9, head: lerp(.1, -.55, sp(tr - i * .12)), lean: lerp(0, -.08, sp(tr - i * .12)) }), t, i)); }
  const tp = o.teach ?? pose({ la: -.4, lb: .2, ra: .3, rb: -.2, head: -.15 }); plain({ x: 1700, gy: GY, S: 380, face: -1 }, breathe(tp, t, 3));
  if (o.q > 0) { popIn(1740, 450, o.q, () => { text('?', 1740, 470, { size: 70, w: 600, col: C.mute }); text('?', 1790, 430, { size: 50, w: 600, col: C.mute }); }); }
  desk(520);
  const j = brainy({ x: 520, gy: GY, S: 340 }, breathe(o.you ?? pose({ la: -.45, lb: -.9, ra: .45, rb: .9, head: .08 }), t, 2), { spark: o.spark ?? 1 });
  deskPhone(600, 674, o.buzz && Math.sin(t * 60) > -.3);
  if (o.cloud > 0) popIn(270, 450, o.cloud, () => { thought(110, 360, 320, 180, j.Hd[0] - 30, j.Hd[1] - 50, '#FFF6EA');
    poly([[170, 390], [270, 406], [270, 504], [170, 488]], C2.white, { lw: 4 }); poly([[270, 406], [370, 390], [370, 488], [270, 504]], C2.white, { lw: 4 });
    for (let k = 0; k < 5; k++) { dline([[182, 420 + k * 15], [258, 426 + k * 15]], C.ginger); dline([[282, 426 + k * 15], [358, 420 + k * 15]], C.ginger); } });
  ground(GY, -20, W + 20);
  return j;
}
{ const s = SC.c1d, tQ = lt('p022'), tClose = wt('p023', 'eyes'), tBook = wt('p024', 'textbook'), tAns = wt('p025', 'perfectly'), tStare = wt('p026', 'stare'), tExist = wt('p027', 'existence');
  ev(s.t0 + .1, 'bell'); ev(tQ, 'chalk'); ev(tBook, 'pop'); [0, 1, 2].forEach(i => ev(tAns + i * .25, 'check', { i })); ev(tStare, 'turn'); ev(tExist, 'boing');
  FILM.c1d = t => {
    const pc = pinch(t, s, 1); camSet(pc.z, 960, 540, pc.r);
    world(() => classroom(t, {
      ticks: [0, 1, 2].map(i => ein(t, tAns + i * .25, .2)), min: Math.floor(seg(t, s.t0, s.t1) * 8),
      teach: poseAt([[0, pose({ la: -.4, lb: .2, ra: .3, rb: -.2, head: -.15 })], [tQ, pose({ la: -1.9, lb: -.4, ra: .3, rb: -.2, head: -.15, lean: .05 })], [tExist, pose({ la: -2.4, lb: -.6, ra: 2.3, rb: .6, head: .2, lean: -.05 })]], t),
      you: poseAt([[0, pose({ la: -.45, lb: -.9, ra: .45, rb: .9, head: .08 })], [tClose, pose({ la: -.45, lb: -.9, ra: .45, rb: .9, head: .45 })], [tAns, pose({ la: -.45, lb: -.9, ra: 2.4, rb: .5, head: -.05 })]], t),
      spark: t > tBook, cloud: pop(t, tBook - .1) * (1 - ein(t, tAns + .8, .3)), turn: t - tStare, q: pop(t, tExist)
    }));
    scr(); Lb('Chapter 1  ·  Perfect memory', 124, 150, t, s.t0 + .2);
    headline2('The whole', 'textbook.', C.ginger, t, s.t0 + .3, tBook);
  };
}
// ---- c1e: the notification zoom ----
{ const s = SC.c1e, tBuzz = lt('p028'), tPush = wt('p029', 'girlfriend'), tFine = lt('p030'), tOne = lt('p031');
  ev(tBuzz, 'buzz'); ev(tPush - .05, 'whoosh'); ev(tFine - .05, 'buzz2'); ev(tFine, 'pop');
  FILM.c1e = t => {
    if (t < tFine - .05) {
      const u = eout3((t - tPush) / .38), z = lerp(1, 3.3, t > tPush ? u : 0), cx = lerp(960, 610, t > tPush ? u : 0), cy = lerp(540, 650, t > tPush ? u : 0), r = lerp(0, .03, t > tPush ? u : 0);
      camSet(z, cx, cy, r); SUBWASH = t > tPush ? u : 0;
      world(() => classroom(t, { ticks: [1, 1, 1], min: 8, teach: pose({ la: -2.4, lb: -.6, ra: 2.3, rb: .6, head: .2, lean: -.05 }), turn: 5, q: 1, buzz: t > tBuzz, you: poseAt([[0, pose({ la: -.45, lb: -.9, ra: 2.4, rb: .5, head: -.05 })], [tBuzz + .1, pose({ la: -.45, lb: -.9, ra: .45, rb: .9, head: .35 })]], t) }));
      scr(); if (t > tPush && t < tPush + .5) speedLines(W / 2 + 80 * u, H / 2 + 60 * u, .4 + u * .7, 11 + Math.floor((t - tPush) * 30), 40);
    } else {
      const u = t - tFine + .05, sc = 1 + .06 * Math.exp(-7 * u) * Math.cos(16 * u);
      g.save(); g.translate(W / 2, H / 2); g.scale(sc, sc); g.translate(-W / 2, -H / 2);
      wall(0, H, '#E9E4DA');
      const big = 1 + .06 * ein(t, tOne, .5);
      withRot(1060, 500, -.035, () => phoneUI(760, 60, 600, 880, [['Sorry I forgot to say', 'me', 26], ['I love the new haircut!!', 'me', 26], ['Yesterday 9:58 PM', 'ts'], ['Fine.', 'her', 64 * big, pop(t, tFine)]], { read: 'Read 9:41 AM' }));
      bigHead(1640, 1010, 300, false);
      g.restore();
    }
    scr(); if (t > tFine) Lb('Chapter 1', 124, 150, t, tFine);
  };
}
// ---- c1f: the archive search, danger 98.7 % (the phone travels from full screen into the layout) ----
{ const s = SC.c1f, tAct = lt('p032'), tSearch = wt('p033', 'thousands'), tC = [lt('p034'), lt('p035'), lt('p036')], tTags = lt('p037'), tCalc = lt('p038'), tRes = wt('p038', 'result'), tDang = lt('p039');
  ev(s.t0, 'whoosh'); ev(tAct, 'power'); ev(tSearch, 'scan'); tC.forEach(x => ev(x, 'card')); [0, 1, 2].forEach(i => ev(tTags + i * .5, 'tick')); ev(tCalc, 'clock'); ev(tDang, 'gauge'); ev(tDang + 1.1, 'alarm');
  FILM.c1f = t => {
    const pc = pinch(t, s, -1), mv = eout3((t - s.t0) / .7); camSet(mv >= 1 ? pc.z : 1, 960, 540, mv >= 1 ? pc.r : 0);
    world(() => {
      const show = ein(t, s.t0 + .35, .4);
      // phone: full screen (rotated) → small on the left
      const X = lerp(760, 150, mv), Y = lerp(60, 330, mv), Wd = lerp(600, 300, mv), Hd = lerp(880, 560, mv);
      withRot(X + Wd / 2, Y + Hd / 2, lerp(-.035, 0, mv), () => phoneUI(X, Y, Wd, Hd, [['Sorry I forgot to say', 'me', 26], ['I love the new haircut!!', 'me', 26], ['Yesterday 9:58 PM', 'ts'], ['Fine.', 'her', 64]], { read: 'Read 9:41 AM' }));
      if (mv < 1) bigHead(lerp(1640, 1900, mv), lerp(1010, 1300, mv), 300, false);
      g.save(); g.globalAlpha = show;
      label('Memory search  ·  ' + Math.floor(4812 * ss(seg(t, tSearch - .3, tSearch + 1.5))).toLocaleString('en') + ' chats', 560, 340);
      const cards = [['3 months ago', 'fine ❤', 'safe', C.grass], ['2 weeks ago', 'fine.', 'hmm', C.wall], ['yesterday', 'fine', 'haircut not complimented', C.pink]];
      cards.forEach(([when, msg, note, col], i) => { const k = pop(t, tC[i]); if (k <= 0) return; const y = 370 + i * 120;
        popIn(560, y + 48, k, () => { rrect(560, y, 520, 96, 16, C2.white, { lw: 4 }); rect(560, y, 14, 96, col, { lw: 0 }); label(when, 592, y + 34); text(msg, 592, y + 76, { size: 34, w: 600 }); text(note, 1060, y + 76, { size: 22, w: 500, col: C.mute, align: 'right' }); });
        const lk = ein(t, tC[i] - .2, .3); if (lk > 0) line([[450, 620], [lerp(450, 550, lk), lerp(620, y + 48, lk)]], C.ginger, 3, [3, 10]); });
      ['punctuation', 'reply time 4 min', 'weather: cloudy'].forEach((s2, k) => { const a = pop(t, tTags + k * .5); popIn(643 + k * 178, 762, a, () => { rrect(560 + k * 178, 740, 166, 44, 22, '#FCE2C6', { lw: 3 }); text(s2, 643 + k * 178, 770, { size: 19, w: 500, align: 'center' }); }); });
      // gauge
      const gx = 1460, gyy = 600, R = 220, gk = pop(t, tCalc - .2);
      popIn(gx, gyy, gk, () => {
        shape(() => { g.arc(gx, gyy, R, Math.PI, 0); g.lineTo(gx + R - 50, gyy); g.arc(gx, gyy, R - 50, 0, Math.PI, true); g.closePath(); }, C2.white, { lw: 5 });
        for (const [a0, a1, c] of [[Math.PI, Math.PI * 1.45, C.grass], [Math.PI * 1.45, Math.PI * 1.75, C.wall], [Math.PI * 1.75, Math.PI * 2, C.red]]) shape(() => { g.arc(gx, gyy, R - 6, a0, a1); g.arc(gx, gyy, R - 44, a1, a0, true); g.closePath(); }, c, { lw: 0 });
        const calc = t < tDang ? .3 + .25 * Math.sin((t - tCalc) * 7) * seg(t, tCalc, tCalc + .5) : lerp(.3, .987, sp(t - tDang, 9, .5));
        const na = Math.PI + Math.PI * calc; line([[gx, gyy], [gx + Math.cos(na) * (R - 30), gyy + Math.sin(na) * (R - 30)]], C.ink, 9); circ(gx, gyy, 16, C.ink, { lw: 0 });
        label('Danger level', gx - 90, gyy + 60);
        if (t < tDang) { const m = Math.floor(17 * ss(seg(t, tCalc, tRes))); text(m + ' min of calculations…', gx, gyy + 150, { size: 30, w: 500, col: C.mute, align: 'center' }); }
        else { const v = 98.7 * ss(seg(t, tDang, tDang + .9)); text(v.toFixed(1) + '%', gx, gyy + 150, { size: 96, w: 600, col: C.red, align: 'center', track: -2 }); }
      });
      g.restore();
    });
    scr(); Lb('Chapter 1  ·  Perfect memory', 124, 150, t, s.t0 + .4);
    T('"Fine."', 118, 238, { size: 92, w: 600, track: -2 }, t, s.t0 + .5); T('Just one word.', 122, 300, { size: 34, w: 500, col: C.mute }, t, s.t0 + .7);
  };
}
// ---- c1g: "Are you sure?" — "Whatever." — crash ----
{ const s = SC.c1g, tSure = lt('p041'), tWh = lt('p043'), tCrash = lt('p044'), tCong = lt('p045'), tPhd = wt('p046', 'p'), tHist = wt('p046', 'history');
  ev(tSure, 'send'); ev(tWh, 'buzz2'); ev(tCrash - .02, 'crash'); ev(tCong, 'party'); ev(tPhd, 'stamp');
  FILM.c1g = t => {
    const pc = pinch(t, s, 1), [sx, sy] = shakeAt(t, tCrash, 7, .28); camSet(pc.z, 960, 540, pc.r, sx, sy);
    world(() => {
      wall(0, GY, '#E5EEF0');
      const crashed = t > tCrash;
      const p = breathe(poseAt([[0, pose({ la: -.5, lb: .2, ra: .5, rb: 2.4, head: .3 })], [tCrash, pose({ lean: -.08, head: .55, la: -.15, lb: .05, ra: .35, rb: .9, hy: .03, bend: .05 })]], t), t);
      const j = brainy({ x: 760, gy: GY, S: 400 }, p, { red: crashed, spark: !crashed });
      const h = j.aR[1]; rrect(h[0] - 16, h[1] - 50, 32, 56, 6, C.ink, { lw: 0 }); rect(h[0] - 12, h[1] - 44, 24, 42, '#FCE2C6', { lw: 0 });
      if (t > tSure - .1) popIn(j.Hd[0] + 230, j.Hd[1] - 120, pop(t, tSure - .1) * (1 - ein(t, tCrash, .2)), () => chat(j.Hd[0] + 100, j.Hd[1] - 160, 'Are you sure?', { me: 1, size: 34 }));
      if (t > tWh - .1) popIn(1060, 400, pop(t, tWh - .1), () => bubble(900, 340, 320, 100, 'Whatever.', { tx: h[0] + 10, ty: h[1] - 56, size: 42, wt: 600 }));
      if (crashed) { for (const [x, y, a] of [[j.Hd[0] - 110, j.Hd[1] - 120, -.3], [j.Hd[0] - 40, j.Hd[1] - 160, 0], [j.Hd[0] + 40, j.Hd[1] - 140, .4]]) withRot(x, y, a, () => line([[x, y], [x + 4, y - 40]], C.red, 7));
        popIn(1560, 430, pop(t, tCrash + .05), () => errorCard(1300, 330, 520, 200, 'BRAIN CRASHED', 'Not responding…')); }
      if (t > tCong - .1) { const k = seg(t, tCong - .1, tCong + 1); const r = mulberry(3); for (let i = 0; i < 14; i++) { const a = -Math.PI / 2 + (r() - .5) * 2, d = 200 * eout3(k); const x = 560 + Math.cos(a) * d, y = 560 + Math.sin(a) * d + 260 * k * k; g.save(); g.globalAlpha = 1 - k; rect(x, y, 12, 6, [C.ginger, C.sky, C.pink, C.grass][i % 4], { lw: 0 }); g.restore(); } }
      if (t > tHist) { const k = pop(t, tHist); popIn(1460, 760, k, () => { withRot(1460, 760, -.05, () => { rrect(1240, 680, 440, 150, 10, '#FFF6E2', { lw: 5 }); text('PhD', 1290, 760, { size: 48, w: 600 }); text('Girlfriend Communication', 1292, 800, { size: 24, w: 500, col: C.mute }); });
        const sk = pop(t, tPhd); if (sk > 0) popIn(1600, 740, 1.6 - .6 * sk, () => withRot(1600, 740, -.25, () => { g.save(); g.globalAlpha = sk; g.strokeStyle = C.red; g.lineWidth = 5; g.strokeRect(1520, 714, 170, 52); text('PENDING', 1605, 752, { size: 30, w: 600, col: C.red, align: 'center', track: 2 }); g.restore(); })); }); }
      ground(GY, -20, W + 20);
    });
    scr(); Lb('Chapter 1  ·  Perfect memory', 124, 150, t, s.t0 + .2);
    if (t < tCrash) T('You reply:', 118, 238, { size: 84, w: 600, track: -2 }, t, s.t0 + .2, tCrash);
    else headline2('Your brain', 'crashes.', C.red, t, tCrash, tCrash + .15);
  };
}

// Chapters 2–7 and the ending. Scenes reuse the storyboard drawings (look/board.js) through VIS (0…1 reveals) and PZ (pose overrides).
let SCN_I = 0;
const bp = (p, t, ph = 0) => breathe(pose(p), t, ph);
// one scene drawn from a storyboard frame: vis(t, V, P) fills the hooks; over(t) draws on top in world space; ttl(t) draws screen text; cam(t, s, pc) may set the camera
function board(id, sb, o) {
  const sign = (SCN_I++ % 2) ? 1 : -1;
  FILM[id] = t => {
    const s = SC[id], pc = pinch(t, s, sign);
    if (o.cam) o.cam(t, s, pc); else camSet(pc.z, 960, 540, pc.r);
    VIS = {}; PZ = {}; if (o.vis) o.vis(t, VIS, PZ, s);
    world(() => { SB[sb](); if (o.over) o.over(t, s); });
    VIS = null; PZ = null; scr();
    if (o.ttl) o.ttl(t, s);
  };
}
const CH = n => ['', 'Perfect memory', 'Super processing speed', 'The Einstein question', 'The athlete brain', 'Learning at super speed', 'The energy problem', 'Every neuron at once?'][n];
const chap = (n, t, s) => Lb(`Chapter ${n}  ·  ${CH(n)}`, 124, 150, t, s.t0 + .2);
function chips(list, x, y, t, times, col = '#FCE2C6') { let xx = x; list.forEach((w, i) => { g.save(); g.font = '500 24px Jost'; const tw = g.measureText(w).width + 36; g.restore(); const k = pop(t, times[i]); popIn(xx + tw / 2, y + 22, k, () => { rrect(xx, y, tw, 44, 22, col, { lw: 3 }); text(w, xx + 18, y + 30, { size: 24, w: 500 }); }); xx += tw + 12; }); }
function redCross(x, y, r, k) { if (k <= 0) return; ink([[x - r, y - r], [lerp(x - r, x + r, k), lerp(y - r, y + r, k)]], { w: 10, col: C.red }); if (k > .5) ink([[x + r, y - r], [lerp(x + r, x - r, (k - .5) * 2), lerp(y - r, y + r, (k - .5) * 2)]], { w: 10, col: C.red }); }

// ================= CHAPTER 2 · SUPER PROCESSING SPEED =================
// ---- c2a: thinking speed — a stream of information, a narrow gate, then patterns connect ----
{ const s = SC.c2a, tLim = wt('p048', 'limitations'), tPat = wt('p049', 'patterns'), tCon = wt('p049', 'connecting');
  ev(s.t0 + .1, 'reboot'); ev(s.t0 + .4, 'pop'); ev(tLim, 'womp'); ev(tPat, 'shimmer'); ev(tCon, 'grow2');
  const NODES = [[1180, 300], [1340, 240], [1500, 320], [1660, 260], [1250, 460], [1420, 430], [1600, 470], [1720, 400], [1300, 620], [1500, 600], [1680, 640]];
  const EDGES = [[0, 1], [1, 2], [2, 3], [0, 4], [4, 5], [5, 2], [5, 6], [6, 7], [3, 7], [4, 8], [8, 9], [9, 5], [9, 10], [10, 6]];
  FILM.c2a = t => {
    const pc = pinch(t, s, 1); camSet(pc.z, 960, 540, pc.r);
    world(() => {
      const j = brainy({ x: 420, gy: GY, S: 420 }, bp({ la: -.5, lb: .2, ra: .5, rb: -.2, head: .1 }, t), { spark: t > tPat });
      const hd = j.Hd, gate = ein(t, tLim - .2, .4) * (1 - ein(t, tPat, .5));
      // the gate ("conscious thinking")
      if (gate > 0) { g.save(); g.globalAlpha = gate; rect(820, 380, 26, 260, C2.chrome, { lw: 4 }); rect(820, 380, 26, 110, C.red, { lw: 0 }); label('Conscious thinking', 700, 680); g.restore(); }
      // dots flowing in from the right
      const r = mulberry(21);
      for (let i = 0; i < 40; i++) { const sp_ = .22 + r() * .1, ph = r(), yo = (r() - .5) * 180; let u = ((t - s.t0) * sp_ + ph) % 1; const x0 = 1850, x1 = hd[0] + 40;
        let x = lerp(x0, x1, u), y = 520 + yo * (1 - u) + Math.sin(u * 8 + i) * 10;
        if (gate > .5 && x < 870 && i % 4) { x = 870 + (i % 7) * 18; y = 520 + yo * .3; }
        circ(x, y, 9, i % 3 ? C.sky : C.wall, { lw: 2.5 }); }
      // the pattern network
      const pk = seg(t, tPat - .2, tCon + 1.2);
      if (pk > 0) { EDGES.forEach(([a, b], i) => { const k = clamp(pk * EDGES.length - i); if (k <= 0) return; const A = NODES[a], B = NODES[b]; line([A, [lerp(A[0], B[0], k), lerp(A[1], B[1], k)]], C.ginger, 5); });
        NODES.forEach(([x, y], i) => circ(x, y, 16, pk * NODES.length > i ? C.ginger : C2.white, { lw: 4 })); }
      ground(GY, 124, 1796);
    });
    scr(); chap(2, t, s); headline2('Next:', 'thinking speed.', C.ginger, t, s.t0 + .3, s.t0 + .6);
  };
}
// ---- c2b: chess — ordinary player, professional, you ----
{ const s = SC.c2b, tOrd = lt('p051'), tPro = lt('p052'), tUp = lt('p053'), tEx = lt('p054'), tMis = wt('p054', 'mistakes');
  ev(tOrd, 'pop'); ev(tPro, 'pop'); ev(tUp, 'sting'); ev(tEx, 'scan');
  board('c2b', 'b06', {
    vis: (t, V, P) => { V.path = Math.floor(4 * seg(t, tEx, tMis + .4) + .001); V.brb = 0; V.sweat = 0; V.spark = t > tUp ? 1 : 0;
      P.you = bp({ la: -.4, lb: -.6, ra: .9, rb: .8, head: t > tUp ? .12 : .3 }, t); P.opp = bp({ la: -1.1, lb: -1.9, ra: .6, rb: 1.6, head: -.15, lean: -.02 }, t, 1); },
    over: t => { const k = pop(t, tOrd) * (1 - ein(t, tUp, .3)); if (k > 0) popIn(1440, 340, k, () => { thought(1290, 250, 300, 170, 1430, 520); const n = t > tPro ? 5 : 2; for (let i = 0; i < n; i++) { const x = 1340 + i * 46, y = 330 + (i % 2) * 18; circ(x, y + 30, 9, C2.white, { lw: 3 }); line([[x, y + 20], [x + 14, y - 8]], C.ink, 3); arrowHead(x + 14, y - 8, -1.1, 9, C.ink, 3); } label(t > tPro ? 'pro: ' + n + ' moves' : 'ordinary: 2 moves', 1350, 400); }); },
    ttl: (t, s) => { chap(2, t, s); headline2('Let\'s test it', 'with chess.', C.ginger, t, s.t0 + .3, s.t0 + .7); }
  });
}
// ---- c2c: top view, twelve moves ahead ----
{ const s = SC.c2c, tPawn = wt('p055', 'pawn'), tSm = lt('p056'), tMate = lt('p057'), tSw = lt('p058');
  ev(s.t0 + .05, 'whoosh'); ev(tPawn, 'clack'); ev(tMate, 'chime'); for (let i = 0; i < 11; i++) ev(tSm + i * ((tMate + 1.2 - tSm) / 11), 'tick');
  board('c2c', 'b06z', {
    cam: (t, s, pc) => { const u = eout3((t - s.t0) / .5); camSet(lerp(1.15, 1, u) * pc.z * (1 + .03 * seg(t, s.t0 + .5, s.t1)), lerp(1100, 960, u), 540, pc.r); },
    vis: (t, V) => { V.n = Math.floor(11 * seg(t, tSm, tMate + 1.2)); V.hand = pop(t, tPawn - .4) * (1 - ein(t, tPawn + .8, .3)); V.sweat = pop(t, tSw); },
    ttl: (t, s) => { chap(2, t, s); T('12 moves', 118, 238, { size: 84, w: 600, track: -2, col: C.ginger }, t, tMate); T('ahead.', 118, 329, { size: 84, w: 600, track: -2 }, t, tMate + .2); }
  });
}
// ---- c2d: rematch, career doubts, the computer takes a break ----
{ const s = SC.c2d, tRe = wt('p059', 'rematch'), tAn = lt('p060'), tCar = wt('p061', 'career'), tCof = wt('p062', 'coffee');
  ev(tRe, 'pop'); ev(tAn, 'scan'); ev(tCar, 'womp'); ev(tCof, 'ding');
  board('c2d', 'b06', {
    vis: (t, V, P) => { V.path = t > tAn ? Math.floor(4 * seg(t, tAn, tAn + 1)) : 4; V.brb = pop(t, tCof - .2); V.sweat = 1;
      P.you = bp({ la: -.4, lb: -.6, ra: .9, rb: .8, head: .12 }, t);
      P.opp = poseAt([[0, pose({ la: -1.1, lb: -1.9, ra: .6, rb: 1.6, head: -.25, lean: -.05 })], [tRe - .2, pose({ la: -1.1, lb: -1.9, ra: 2.6, rb: .2, head: -.1 })], [tCar - .2, pose({ la: -.2, lb: .1, ra: .2, rb: -.1, head: .55, lean: .08, hy: .02 })]], t); },
    ttl: (t, s) => { chap(2, t, s); headline2('Rematch?', 'Another 12 moves.', C.ginger, t, tRe - .2, tAn + .3); }
  });
}
// ---- c2e: the hardest test, the dress question ----
{ const s = SC.c2e, tQ = lt('p065'), tProc = lt('p066'), tC = lt('p067');
  ev(tQ, 'pop'); ev(tProc, 'power'); [0, 1, 2, 3, 4].forEach(i => ev(tC + .3 + i * .55, 'tick'));
  board('c2e', 'b07', {
    vis: (t, V, P) => { V.q = pop(t, tQ - .1); V.A = V.B = V.C = 0; V.tree = 0; V.spark = t > tProc ? 1 : 0;
      P.gf = bp({ la: -1.3, lb: -1.7, ra: .5, rb: .3, head: .05 }, t, 1); P.you = bp({ la: -.6, lb: -.3, ra: 1.0, rb: 1.9, head: .1 }, t); },
    over: t => { const tags = [['face', 1290, 470], ['dress', 1520, 760], ['history', 980, 420], ['emotion', 1000, 520], ['consequences', 980, 620]];
      tags.forEach(([w, x, y], i) => { const k = pop(t, tC + .3 + i * .55); popIn(x, y, k, () => { g.save(); g.font = '500 22px Jost'; const tw = g.measureText(w).width + 30; g.restore(); rrect(x - tw / 2, y - 20, tw, 40, 20, '#FCE2C6', { lw: 3 }); text(w, x, y + 8, { size: 22, w: 500, align: 'center' }); }); }); },
    ttl: (t, s) => { chap(2, t, s); headline2('Something', 'even harder.', C.red, t, s.t0 + .3, s.t0 + .8); }
  });
}
// ---- c2f: options A/B/C, ten million outcomes, option B, system error ----
{ const s = SC.c2f, tA = lt('p068'), tB = lt('p069'), tC = lt('p070'), tSim = lt('p071'), tPick = lt('p072'), tSay = lt('p073'), tResp = lt('p075'), tErr = lt('p076');
  ev(tA, 'pop'); ev(tB, 'pop'); ev(tC, 'pop'); ev(tSim, 'grow2'); ev(tSim + .3, 'scan'); ev(tPick, 'chime'); ev(tSay, 'pop'); ev(tResp, 'boss'); ev(tErr - .02, 'crash');
  board('c2f', 'b07', {
    cam: (t, s, pc) => { const [sx, sy] = shakeAt(t, tErr, 7, .28); camSet(pc.z, 960, 540, pc.r, sx, sy); },
    vis: (t, V, P) => { V.q = t < tResp - .2 ? 1 : 0; V.A = pop(t, tA); V.B = pop(t, tB); V.C = pop(t, tC); V.tree = ss(seg(t, tSim, tSim + 1.6)); V.count = ss(seg(t, tSim, tSim + 2.2)); V.pickB = t > tPick ? 1 : 0;
      V.spark = t < tErr ? 1 : 0; V.red = t > tErr ? 1 : 0;
      P.gf = poseAt([[0, pose({ la: -1.3, lb: -1.7, ra: .5, rb: .3, head: .05 })], [tResp - .2, pose({ la: .9, lb: -1.7, ra: -.9, rb: 1.7, head: -.1 })]], t);
      P.you = poseAt([[0, pose({ la: -.6, lb: -.3, ra: 1.0, rb: 1.9, head: .1 })], [tSay, pose({ la: -.4, lb: .2, ra: 1.6, rb: .4, head: -.05 })], [tErr, pose({ lean: -.08, head: .55, la: -.15, lb: .05, ra: .2, rb: .05, hy: .03 })]], t); },
    over: t => { popIn(320, 300, pop(t, tSay) * (1 - ein(t, tResp, .3)), () => bubble(170, 250, 320, 90, 'You look beautiful.', { tx: 330, ty: 400, size: 28, fill: '#FCE2C6' }));
      popIn(1510, 230, pop(t, tResp - .1), () => bubble(1200, 170, 600, 120, ['So you\'re saying I', 'looked ugly yesterday?'], { tx: 1420, ty: 400, size: 34, col: C.red }));
      popIn(880, 490, pop(t, tErr), () => errorCard(560, 360, 640, 260, 'SYSTEM ERROR', 'No solution found.')); },
    ttl: (t, s) => { chap(2, t, s); if (t > tPick - .2) T('Option B.', 118, 238, { size: 84, w: 600, track: -2, col: C.ginger }, t, tPick - .2); }
  });
}

// ================= CHAPTER 3 · THE EINSTEIN QUESTION =================
{ const s = SC.c3a, tEin = wt('p079', 'einstein'), tRel = wt('p080', 'relativity'), tNo = lt('p082'), tSec = wt('p083', 'secret'), tMath = lt('p084');
  ev(s.t0 + .1, 'reboot'); ev(tEin, 'pop'); ev(tRel, 'chalk'); ev(tNo, 'pop'); ev(tSec, 'slash'); ev(tMath, 'tick');
  board('c3a', 'b08', {
    vis: (t, V, P) => { V.myth = pop(t, tNo); V.strike = ss(seg(t, tSec, tSec + .4)); V.real = t > tMath ? 1 : 0;
      const wr = t > tRel - .3 && t < tRel + 2.5 ? Math.sin(t * 9) * .18 : 0; P.ein = bp({ la: -1.9 + wr, lb: -.9 - wr, ra: .35, rb: -.3, head: -.1 + (t > tNo ? .3 : 0) }, t); },
    ttl: (t, s) => { chap(3, t, s); if (t < tSec - .2) headline2('How smart', 'could you get?', C.ginger, t, s.t0 + .3, s.t0 + .8, 84); else headline2('No secret', 'brain switch.', C.ginger, t, tSec - .2, tSec); }
  });
}
{ const s = SC.c3b, tEin = wt('p085', 'einstein'), tNot = lt('p086'), tShip = wt('p087', 'spaceship'), tCr = wt('p089', 'crashing');
  ev(tNot, 'womp'); ev(tShip, 'pop'); ev(tCr, 'glitch');
  board('c3b', 'b09a', {
    vis: (t, V, P) => { V.q = t > tShip ? 1 : 0; V.crash = t > tCr && t < tCr + 1.4 && Math.sin(t * 20) > -.6 ? 1 : 0; P.you = bp({ la: -.5, lb: .2, ra: 1.3, rb: .3, head: t > tShip ? -.2 : .15 }, t); },
    ttl: (t, s) => { chap(3, t, s); if (t < tShip - .2) headline2('Automatically', 'Einstein?', C.ginger, t, s.t0 + .3, tEin - .2, 76); else headline2('A fast computer', 'is not a spaceship.', C.ginger, t, tShip - .2, tShip, 76); }
  });
}
{ const s = SC.c3c, tEq = lt('p092'), tWalk = lt('p094'), tB1 = lt('p095'), tB2 = lt('p096'), tB3 = lt('p097'), tText = lt('p099'), tRel = lt('p100');
  ev(tEq, 'chalk'); ev(tWalk, 'door'); ev(tB1, 'pop'); ev(tB2, 'pop'); ev(tB3, 'boss'); ev(tText, 'pop'); ev(tRel, 'sting');
  board('c3c', 'b09', {
    vis: (t, V, P) => { V.gf = t > tWalk - .3 ? 1 : 0; V.gfx = lerp(1900, 1700, eout3((t - tWalk + .3) / .8)); V.b1 = pop(t, tB1 - .1) * (1 - ein(t, tB3 - .1, .2)); V.b2 = pop(t, tB2 - .1) * (1 - ein(t, tText, .3)); V.b3 = pop(t, tB3 - .1);
      const wr = t < tWalk ? Math.sin(t * 9) * .18 : 0; P.ein = bp({ la: -1.8 + wr, lb: -.7 - wr, ra: .4, rb: -.4, head: t > tB1 ? .25 : -.18 }, t);
      P.gf = poseAt([[0, pose({ la: -.5, lb: .3, ra: .9, rb: 2.3, head: .1 })], [tB3, pose({ la: .9, lb: -1.7, ra: -.9, rb: 1.7, head: -.05 })]], t); },
    over: t => { const k = pop(t, tText); if (k > 0) popIn(800, 700, k, () => { phone(700, 600, 120, 210, { screen: '#F7F5F0' }); text('Seen', 760, 690, { size: 20, w: 600, align: 'center', col: C.mute }); text('3 h ago', 760, 720, { size: 20, w: 600, align: 'center', col: C.red }); }); },
    ttl: (t, s) => { chap(3, t, s); if (t < tRel - .2) headline2('Einstein,', 'with your brain.', C.ginger, t, s.t0 + .3, s.t0 + .8, 70); else headline2('A different', 'theory of relativity.', C.red, t, tRel - .2, tRel, 70); }
  });
}

// ================= CHAPTER 4 · THE ATHLETE BRAIN =================
{ const s = SC.c4a, t150 = wt('p103', 'one'), tNot = lt('p104'), tTr = wt('p106', 'training'), W4 = ['coordination', 'timing', 'reaction', 'decision'].map(w => wt('p106', w));
  ev(s.t0 + .1, 'reboot'); ev(t150, 'pop'); ev(tNot, 'slash'); W4.forEach(x => ev(x, 'tick'));
  board('c4a', 'b10', {
    vis: (t, V, P) => { V.pred = 0; V.ring = 0; V.ball = .02; V.kx = 1640; P.keeper = bp({ la: -.6, lb: .3, ra: .6, rb: -.3, head: .05 }, t); P.striker = bp({ la: -.5, lb: .2, ra: .5, rb: -.2 }, t, 1); },
    over: t => { const k = pop(t, t150); if (k > 0) popIn(980, 330, k, () => { rrect(780, 270, 400, 120, 18, C2.white, { lw: 4 }); text('150%', 980, 352, { size: 72, w: 600, align: 'center', col: C.ginger }); redCross(980, 330, 70, ss(seg(t, tNot, tNot + .4))); }); },
    ttl: (t, s) => { chap(4, t, s); headline2('From the lab', 'to the field.', C.ginger, t, s.t0 + .3, s.t0 + .8); chips(['coordination', 'timing', 'reaction', 'decisions'], 124, 420, t, W4); }
  });
}
{ const s = SC.c4b, tKick = wt('p108', 'kick'), tAnt = wt('p109', 'anticipate'), tEff = lt('p110');
  ev(tKick, 'kick'); ev(tAnt, 'scan'); ev(tEff, 'chime');
  board('c4b', 'b10', {
    vis: (t, V, P) => { V.ball = t < tKick ? .02 : lerp(.02, .5, ss(seg(t, tKick, tEff + 2))); V.pred = ss(seg(t, tAnt - .2, tAnt + 1)); V.ring = pop(t, tAnt + .8); V.kx = lerp(1640, 1470, eout3((t - tEff) / .6));
      P.striker = poseAt([[0, pose({ la: -.5, lb: .2, ra: .5, rb: -.2 })], [tKick - .5, pose({ lean: .1, la: -.8, lb: .2, ra: .8, rb: -.2, rfx: -.12, rfy: .05 })], [tKick, pose({ lean: -.12, la: -1.4, lb: .3, ra: 1.0, rb: .2, rfx: .2, rfy: .16, lfx: -.06, head: .05 })]], t);
      P.keeper = poseAt([[0, pose({ la: -.6, lb: .3, ra: .6, rb: -.3, head: .05, hy: .02 })], [tEff, pose({ lean: .55, la: -1.2, lb: -.3, ra: 2.5, rb: .3, lfx: -.18, rfx: .12, rfy: .1, head: .3, hy: .03 })]], t); },
    ttl: (t, s) => { chap(4, t, s); headline2('Prediction,', 'not magic.', C.ginger, t, s.t0 + .3, tAnt); }
  });
}
{ const s = SC.c4c, tFly = lt('p111'), tHead = wt('p112', 'head'), tMiss = lt('p113');
  ev(s.t0, 'whoosh'); ev(tFly + .2, 'whoosh'); ev(tMiss, 'slowmo');
  board('c4c', 'b10z', {
    cam: (t, s, pc) => { const u = eout3((t - s.t0) / .35); camSet(lerp(1.3, 1, u), 960, 540, 0); },
    vis: (t, V) => { V.bx = lerp(900, 0, eout3(seg(t, tFly, tMiss))); V.hx = -60 * ss(seg(t, tHead - .2, tHead + .2)); V.gap = t > tMiss ? 1 : 0; },
    ttl: (t, s) => { chap(4, t, s); headline2('A few', 'centimetres.', C.ginger, t, tMiss, tMiss + .2); }
  });
}
{ const s = SC.c4d, tCatch = wt('p114', 'catch'), tShock = lt('p115'), tCalc = lt('p117'), tP1 = wt('p118', 'pillow'), tD1 = lt('p119'), tP2 = lt('p120'), tD2 = lt('p121'), tFam = lt('p122'), tGk = lt('p124');
  ev(tCatch, 'catch'); ev(tShock, 'gasp'); ev(tCalc, 'pop'); ev(tP1, 'whoosh'); ev(tP1 + .7, 'thud'); ev(tP2, 'whoosh'); ev(tP2 + .7, 'thud'); ev(tGk, 'sting');
  const dodge = pose({ lean: .45, la: -1.2, lb: -.5, ra: 1.2, rb: .4, head: .5, lfx: -.12, rfx: .14, hy: .03 });
  board('c4d', 'b11', {
    vis: (t, V, P) => { V.ball = t > tCatch - .1 ? 1 : 0; V.calc = pop(t, tCalc - .1) * (1 - ein(t, tP1, .3)); V.fam = t > tShock - .3 ? 1 : 0; V.pl1 = seg(t, tP1, tP1 + .75) * (t < tP1 + 2 ? 1 : 0); V.pl2 = seg(t, tP2, tP2 + .75) * (t < tP2 + 2 ? 1 : 0);
      P.you = poseAt([[0, pose({ la: -.4, lb: .2, ra: .4, rb: -.2 })], [tCatch - .2, pose({ lean: .3, la: -2.4, lb: -.5, ra: .8, rb: .4, head: .35, lfx: -.08, rfx: .1 })], [tP1 + .45, dodge], [tP1 + 1.2, pose({ la: -.5, lb: .2, ra: .5, rb: -.2 })], [tP2 + .45, pose({ lean: -.4, la: -1.2, lb: -.5, ra: 1.2, rb: .4, head: -.4, lfx: -.14, rfx: .1, hy: .03 })], [tP2 + 1.2, pose({ la: -2.3, lb: -.4, ra: 2.3, rb: .4 })]], t);
      const thr = (a, b) => poseAt([[0, pose({ la: -.5, lb: .2, ra: .5, rb: -.2 })], [tShock, pose({ la: -2.3, lb: -.3, ra: 2.3, rb: .3 })], [a, b]], t);
      P.f1 = thr(tP1 - .2, pose({ la: -2.2, lb: -.5, ra: .5, rb: .2, head: .1, lean: .1 })); P.f2 = thr(tP2 - .2, pose({ la: -.5, lb: -.2, ra: 2.4, rb: .4, head: -.05, lean: -.1 })); P.f3 = bp({ la: -2.3, lb: -.3, ra: 2.3, rb: .3, head: .1 }, t, 2); },
    ttl: (t, s) => { chap(4, t, s); if (t > tFam - .2) headline2('The household', 'goalkeeper.', C.ginger, t, tFam - .2, tGk); }
  });
}
{ const s = SC.c4e, tAsk = wt('p126', 'asks'), tQ = lt('p127');
  ev(tAsk, 'whoosh'); ev(tQ, 'pop');
  board('c4e', 'b12q', {
    cam: (t, s, pc) => { const u = t > tAsk ? eout3((t - tAsk) / .35) : 0; camAnchor(lerp(1, 1.14, u), [1440, 560], [1440, 560]); },
    vis: (t, V, P) => { V.q = pop(t, tQ - .1); V.scan = 0; V.spark = 1; P.you = bp({ la: -.4, lb: .2, ra: .4, rb: -.2, head: .1 }, t); },
    ttl: (t, s) => chap(4, t, s)
  });
}
{ const s = SC.c4f, tScan = lt('p128'), tId = lt('p134'), tSm = lt('p135'), t6 = lt('p136'), tSt = lt('p137'), t7 = lt('p138'), tRef = lt('p139'), tSurv = lt('p140');
  ev(tScan, 'scan'); [lt('p129'), lt('p130'), lt('p131'), lt('p132'), lt('p133')].forEach(x => ev(x, 'tick')); ev(tId, 'chime'); ev(t6, 'pop'); ev(t7, 'boss'); ev(tRef, 'womp');
  board('c4f', 'b12', {
    vis: (t, V, P) => { V.beam = ein(t, tScan, .3) * (1 - ein(t, tId + .4, .3)); V.b6 = pop(t, t6 - .1) * (1 - ein(t, t7 + 1.2, .3)); V.b7 = pop(t, t7 - .1); V.spark = t < t7 ? 1 : 0; V.red = t > t7 + .3 ? 1 : 0;
      P.you = poseAt([[0, pose({ la: -.5, lb: .2, ra: .5, rb: -.2, head: .05 })], [tSm, pose({ la: -.5, lb: .2, ra: 1.0, rb: 1.9, head: .05 })], [t7 + .3, pose({ lean: -.06, head: .5, la: -.2, lb: .1, ra: .2, rb: -.1, hy: .02 })]], t);
      P.gf = poseAt([[0, pose({ la: -.4, lb: .2, ra: .4, rb: -.2, head: -.05 })], [tSt, pose({ la: .9, lb: -1.7, ra: -.9, rb: 1.7, head: -.05 })]], t); },
    ttl: (t, s) => { chap(4, t, s); if (t > tRef - .2) headline2('Reflexes: perfect.', 'Survival: not.', C.red, t, tRef - .2, tSurv, 76); }
  });
}

// ================= CHAPTER 5 · LEARNING AT SUPER SPEED =================
{ const s = SC.c5a, tLearn = lt('p142'), tNeu = lt('p143'), tAd = lt('p145');
  ev(s.t0 + .1, 'reboot'); ev(tLearn, 'sting'); ev(tNeu, 'pop'); for (let i = 0; i < 7; i++) ev(tNeu + .6 + i * ((tAd + 1.5 - tNeu - .6) / 7), 'pulse', { i });
  board('c5a', 'b13', {
    vis: (t, V) => { V.lit = 7.2 * seg(t, tNeu + .6, tAd + 1.5); V.w0 = V.w1 = V.w2 = 0; },
    ttl: (t, s) => { chap(5, t, s); if (t < tNeu - .2) headline2('Your greatest power?', 'Learning.', C.ginger, t, s.t0 + .3, tLearn, 76); else { T('Neuroplasticity', 118, 238, { size: 84, w: 600, track: -2 }, t, tNeu - .2); T('Practice rewires the connections.', 122, 310, { size: 36, w: 500, col: C.ginger }, t, tAd); } }
  });
}
{ const s = SC.c5b, tW = ['their', 'there', 'they'].map((w, i) => wt('p148', w)), tQ = lt('p149'), tEff = lt('p150'), tFast = lt('p152'), HI = ['Hola!', 'Bonjour!', 'Ciao!', 'Hallo!', 'Olá!'];
  tW.forEach(x => ev(x, 'pop')); ev(tQ, 'womp'); ev(tEff, 'shimmer'); HI.forEach((h, i) => ev(tFast + .2 + i * .3, 'pop'));
  board('c5b', 'b13', {
    vis: (t, V) => { V.lit = t < tEff ? 2 : 2 + 5.2 * seg(t, tEff, tFast); V.w0 = pop(t, tW[0]); V.w1 = pop(t, tW[1]); V.w2 = pop(t, tW[2]); },
    over: t => { const k = pop(t, tQ) * (1 - ein(t, tEff, .3)); if (k > 0) popIn(1330, 430, k, () => text('???', 1330, 450, { size: 70, w: 600, col: C.mute, align: 'center' }));
      HI.forEach((h, i) => { const x = 560 + i * 260, y = 470; popIn(x + 80, y + 30, pop(t, tFast + .2 + i * .3), () => chat(x, y, h, { me: 1, size: 28 })); }); },
    ttl: (t, s) => { chap(5, t, s); headline2('A new language?', 'Much faster.', C.ginger, t, s.t0 + .3, tFast, 76); }
  });
}
{ const s = SC.c5c, tJp = lt('p155'), tUnd = lt('p156'), tWas = wt('p157', 'wasabi'), tYes = lt('p159'), tRed = wt('p160', 'red'), tFive = lt('p160');
  ev(tJp, 'pop'); ev(tUnd, 'chime'); ev(tWas, 'pop'); ev(tYes, 'pop'); ev(tRed - .2, 'sizzle'); ev(tRed, 'boing');
  board('c5c', 'b14', {
    vis: (t, V, P) => { V.jp = pop(t, tJp - .1) * (1 - ein(t, tWas - .3, .2)); V.wq = pop(t, tWas - .2) * (1 - ein(t, tYes + 1, .2)); V.yes = pop(t, tYes - .05) * (1 - ein(t, tFive, .2)); V.red = t > tRed - .1 ? 1 : 0; V.steam = t > tRed ? 1 : 0;
      P.you = poseAt([[0, pose({ la: -.5, lb: .2, ra: .5, rb: -.2, head: .05 })], [tYes, pose({ la: -.5, lb: .2, ra: 2.3, rb: .3, head: -.05 })], [tRed - .1, pose({ la: -2.3, lb: -.4, ra: 2.3, rb: .4, head: -.1 })]], t); },
    ttl: (t, s) => { chap(5, t, s); headline2('You understand', 'everything.', C.ginger, t, s.t0 + .3, tUnd, 76); T('5 seconds later', 124, 420, { size: 30, w: 500, col: C.mute }, t, tFive); }
  });
}
{ const s = SC.c5d, tStudy = lt('p164'), tDb = lt('p165'), tCr = lt('p167'), tNw = lt('p169'), tMe = lt('p171'), tHer = lt('p173'), t12 = lt('p174');
  ev(tStudy, 'pop'); ev(tDb, 'scan'); ev(tCr, 'chime'); ev(tNw, 'pop'); ev(tMe, 'pop'); ev(tHer, 'boss'); ev(t12, 'womp');
  board('c5d', 'b14n', {
    vis: (t, V, P) => { V.db = pop(t, tStudy) * (1 - ein(t, tMe, .25)); V.dbn = 4812 * ss(seg(t, tDb, tCr)); V.nw = pop(t, tNw - .1) * (1 - ein(t, tHer - .2, .2)); V.boxes = pop(t, tMe) * (1 - ein(t, tHer, .3));
      P.gf = poseAt([[0, pose({ la: .9, lb: -1.7, ra: -.9, rb: 1.7, head: -.12 })], [tHer, pose({ la: -2.2, lb: -.6, ra: .9, rb: 1.9, head: -.05 })]], t);
      P.you = poseAt([[0, pose({ la: -.5, lb: .2, ra: 1.2, rb: 1.8, head: .08 })], [tMe, pose({ la: -.5, lb: .2, ra: 1.9, rb: .2, head: -.05 })], [tHer + .2, pose({ la: -.4, lb: .2, ra: .4, rb: -.2, head: .4, hy: .02 })]], t); },
    over: t => { popIn(480, 460, pop(t, tMe + .1) * (1 - ein(t, tHer - .2, .2)), () => bubble(160, 400, 560, 120, ['Based on your tone and behaviour,', 'something is wrong.'], { tx: 560, ty: 540, size: 28, fill: '#FCE2C6' }));
      popIn(1240, 360, pop(t, tHer - .1) * (1 - ein(t, t12 + 1.5, .3)), () => bubble(960, 300, 560, 120, ['Wow. So now I\'m not', 'allowed to have feelings?'], { tx: 1150, ty: 440, size: 30, col: C.red })); },
    ttl: (t, s) => { chap(5, t, s); if (t < t12 - .2) headline2('The language of', 'relationships.', C.ginger, t, lt('p163'), lt('p163') + .3, 76); else headline2('12 languages: ✓', '"Nothing\'s wrong": ?', C.red, t, t12 - .2, lt('p175'), 76); }
  });
}

// ================= CHAPTER 6 · THE ENERGY PROBLEM =================
{ const s = SC.c6a, t2 = wt('p178', 'two'), t20 = wt('p178', 'twenty'), tFr = wt('p179', 'refrigerator'), tNeeds = lt('p181'), N4 = ['oxygen', 'glucose', 'blood', 'chemicals'].map(w => wt('p181', w)), tSev = wt('p184', 'seventeen'), tHeart = wt('p185', 'washing');
  ev(s.t0 + .1, 'reboot'); ev(t2, 'pop'); ev(t20, 'grow2'); ev(tFr, 'boing'); N4.forEach(x => ev(x, 'tick')); for (let i = 0; i < 17; i++) ev(tSev + i * .06, 'can'); ev(tHeart, 'washer');
  board('c6a', 'b15', {
    vis: (t, V, P) => { V.bar0 = ss(seg(t, t2, t2 + .4)); V.bar1 = ss(seg(t, t20, t20 + .9)); V.q = pop(t, tFr); V.cans = 17 * seg(t, tSev, tSev + 1.0); V.heart = pop(t, tHeart - .2); V.shake = t > tHeart ? Math.sin(t * 50) * 8 * (1 - seg(t, tHeart + 1.8, tHeart + 2.4)) : 0;
      P.you = bp({ la: -.4, lb: .1, ra: .4, rb: -.1 }, t); },
    ttl: (t, s) => { chap(6, t, s); if (t < t2 - .2) headline2('One tiny problem:', 'energy.', C.red, t, s.t0 + .3, lt('p177'), 76); else headline2('2% of you.', '20% of the energy.', C.ginger, t, t2 - .2, t20, 76);
      if (t > tNeeds - .2 && t < tSev - .3) chips(['oxygen', 'glucose', 'blood flow', 'chemicals'], 124, 420, t, N4); }
  });
}
// ---- c6b: the notification zoom, again (same move as Chapter 1) ----
{ const s = SC.c6b, tBuzz = s.t0 + .1, tPush = wt('p186', 'girlfriend'), tTalk = lt('p187');
  ev(tBuzz, 'buzz'); ev(tPush - .05, 'whoosh'); ev(tTalk - .05, 'buzz2'); ev(tTalk, 'pop');
  const P0 = pose({ la: -.4, lb: .1, ra: .5, rb: 2.4, head: .3 });
  FILM.c6b = t => {
    if (t < tTalk - .05) {
      const j0 = joints({ x: 300, gy: GY, S: 420 }, P0), ph = [j0.aR[1][0], j0.aR[1][1] - 30], u = t > tPush ? eout3((t - tPush) / .38) : 0;
      camAnchor(lerp(1, 3.2, u), ph, [lerp(ph[0], W / 2, u), lerp(ph[1], H / 2, u)], .03 * u); SUBWASH = u;
      VIS = { bar0: 1, bar1: 1, q: 1, cans: 17, heart: 1, shake: 0 }; PZ = { you: breathe(P0, t) };
      world(() => { SB.b15(); const h = ph, bz = Math.sin(t * 60) > -.3 ? 3 : 0; rrect(h[0] - 18 + bz, h[1] - 30, 36, 60, 7, C.ink, { lw: 0 }); rect(h[0] - 14 + bz, h[1] - 24, 28, 46, '#FCE2C6', { lw: 0 }); buzz(h[0], h[1], .8); });
      VIS = PZ = null; scr(); if (t > tPush && t < tPush + .5) speedLines(W / 2, H / 2, .4 + u * .7, 3 + Math.floor((t - tPush) * 30), 40);
    } else {
      const u = t - tTalk + .05, sc = 1 + .06 * Math.exp(-7 * u) * Math.cos(16 * u);
      g.save(); g.translate(W / 2, H / 2); g.scale(sc, sc); g.translate(-W / 2, -H / 2);
      wall(0, H, '#E9E4DA'); withRot(1060, 500, -.035, () => phoneUI(760, 60, 600, 880, [['ok see you tonight', 'her', 26], ['Today 11:02 AM', 'ts'], ['Can we talk?', 'her', 56, pop(t, tTalk)]], { typing: 1, status: 'typing…' }));
      bigHead(1640, 1010, 300, false); sweat(1390, 710, 2.2 * pop(t, tTalk + .5));
      g.restore();
    }
    scr(); if (t > tTalk) Lb('Chapter 6', 124, 150, t, tTalk);
  };
}
{ const s = SC.c6c, tAct = lt('p188'), tMem = lt('p189'), tEmo = lt('p190'), tRea = lt('p191'), tSw = lt('p192'), tNasa = wt('p193', 'nasa'), tAll = lt('p194');
  ev(s.t0, 'whoosh'); ev(tAct, 'power'); ev(tMem, 'card'); ev(tEmo, 'alarm'); ev(tRea, 'scan'); ev(tNasa, 'grow2');
  board('c6c', 'b16', {
    cam: (t, s, pc) => { const u = eout3((t - s.t0) / .7); camAnchor(lerp(2.2, 1, u) * (u >= 1 ? pc.z : 1), [1040, 530], [W / 2, H / 2], u >= 1 ? pc.r : 0); },
    vis: (t, V) => { V.phone = 0; V.mem = seg(t, tMem, tMem + 1.5); V.alarm = t > tEmo ? 1 : 0; V.wb = seg(t, tRea, tRea + 1.5); V.panic = ss(seg(t, tAct, tSw)); V.load = lerp(.15, .98, ss(seg(t, tAct, tNasa + .8))); },
    over: t => { if (t > tSw) { const k = pop(t, tSw); popIn(1430, 260, k, () => sweat(1420, 240, 2)); popIn(700, 430, k, () => sweat(700, 410, 1.6)); } },
    ttl: (t, s) => { chap(6, t, s); if (t < tNasa - .2) headline2('Every resource:', 'on.', C.ginger, t, s.t0 + .4, tAct + .3, 76); else headline2('More power than', 'a supercomputer…', C.red, t, tNasa - .2, tAll, 76); }
  });
}
{ const s = SC.c6d, tQ = lt('p196');
  ev(s.t0 + .05, 'buzz2'); ev(tQ + .2, 'pop'); ev(tQ + 1.4, 'boss');
  FILM.c6d = t => {
    scr(); wall(0, H, '#E9E4DA');
    withRot(1060, 500, -.035, () => phoneUI(760, 60, 600, 880, [['Can we talk?', 'her', 30], ['sure what\'s up?', 'me', 30], ['Why did you like', 'her', 40, pop(t, tQ)], ['her picture?', 'her', 40, pop(t, tQ + .3)]], {}));
    const x = 1390, y = 400, k = pop(t, tQ + 1.2); popIn(x + 150, y + 170, k, () => withRot(x + 150, y + 170, .06, () => { rect(x, y, 300, 340, C2.white); rect(x + 18, y + 18, 264, 230, C.sky, { lw: DL }); circ(x + 150, y + 140, 50, C.wall, { lw: DL }); poly([[x + 18, y + 248], [x + 100, y + 180], [x + 180, y + 248]], C.grass, { lw: DL }); text('❤', x + 40, y + 300, { size: 40, w: 400, col: C.red }); text('liked by you', x + 90, y + 296, { size: 22, w: 500, col: C.mute }); }));
    bigHead(1640, 1010, 300, t > tQ + 1.2);
    Lb('Chapter 6', 124, 150, t, s.t0);
  };
}

// ================= CHAPTER 7 · EVERY NEURON AT ONCE? =================
{ const s = SC.c7a, tFire = wt('p198', 'fire'), tGod = wt('p199', 'god'), tNot = lt('p200'), tSw = wt('p201', 'switch'), tGrp = lt('p202');
  ev(s.t0 + .1, 'reboot'); ev(tFire, 'switch'); ev(tGod, 'choir'); ev(tNot, 'slash'); ev(tSw, 'switch'); ev(tGrp, 'shimmer');
  const CL = [[1180, 380, C.sky], [1500, 330, C.wall], [1350, 620, C.pink]];
  FILM.c7a = t => {
    const pc = pinch(t, s, -1); camSet(pc.z, 960, 540, pc.r);
    world(() => {
      const j = brainy({ x: 520, gy: GY, S: 420 }, bp({ la: t > tGod && t < tNot ? -2.4 : -.5, lb: .2, ra: t > tGod && t < tNot ? 2.4 : .5, rb: -.2, head: .1 }, t), { spark: 1 });
      // halo
      const hk = pop(t, tGod) * (1 - ein(t, tNot + 1.2, .3)); if (hk > 0) popIn(j.Hd[0], j.Hd[1] - 80, hk, () => { shape(() => g.ellipse(j.Hd[0], j.Hd[1] - 80, 70, 18, 0, 0, Math.PI * 2), null, { lw: 8, col: C.wall }); redCross(j.Hd[0], j.Hd[1] - 80, 50, ss(seg(t, tNot, tNot + .4))); });
      if (t < tGrp - .2) { // the light switch
        const on = t > tFire, x = 1350, y = 480; rrect(x - 110, y - 170, 220, 340, 20, C2.white, { lw: 5 }); rrect(x - 40, y - 90, 80, 180, 14, '#EDE8DF', { lw: 4 });
        rrect(x - 30, on ? y - 82 : y + 2, 60, 80, 10, on ? C.ginger : C2.chrome, { lw: 4 }); text(on ? 'ON' : 'OFF', x, y + 130, { size: 30, w: 600, align: 'center', col: on ? C.ginger : C.mute });
        label('All neurons', x - 70, y - 200); redCross(x, y, 120, ss(seg(t, tSw, tSw + .5)));
      } else { // groups of neurons with their own jobs, firing in turn
        CL.forEach(([cx, cy, col], ci) => { const r = mulberry(ci + 3); const P = []; for (let i = 0; i < 7; i++) P.push([cx + (r() - .5) * 220, cy + (r() - .5) * 160]);
          for (let i = 0; i < 6; i++) line([P[i], P[i + 1]], C.mute, 3); const act = Math.floor((t - tGrp) * 3 + ci * 2.3) % 3 === ci % 3;
          P.forEach(p => circ(p[0], p[1], 14, act ? col : C2.white, { lw: 3.5 })); label(['vision', 'movement', 'memory'][ci], cx - 50, cy + 120); });
        for (let k = 0; k < 2; k++) { const A = CL[k], B = CL[k + 1], u = ((t - tGrp) * .8 + k * .5) % 1; circ(lerp(A[0], B[0], u), lerp(A[1], B[1], u), 9, C.ginger, { lw: 0 }); }
      }
      ground(GY, 124, 1796);
    });
    scr(); chap(7, t, s); if (t < tSw - .2) headline2('Fire 100%', 'at once?', C.ginger, t, s.t0 + .3, tFire); else headline2('Not a', 'light switch.', C.red, t, tSw - .2, tSw);
  };
}
{ const s = SC.c7b, tRoles = lt('p204'), tLoud = wt('p205', 'loudly'), tRh = lt('p206'), tNoise = lt('p208'), tDis = lt('p210');
  ev(tRoles, 'orch'); ev(tLoud, 'noise'); ev(tNoise, 'crash'); ev(tDis, 'womp');
  FILM.c7b = t => {
    const pc = pinch(t, s, 1), [sx, sy] = shakeAt(t, tNoise, 5, .3); camSet(pc.z, 960, 540, pc.r, sx, sy);
    VIS = { notes: 12 * seg(t, s.t0 + .5, tRoles + 2), noise: seg(t, tLoud, tNoise), nz: pop(t, tNoise) }; PZ = {};
    world(() => SB.b17n()); VIS = PZ = null; scr(); chap(7, t, s);
    if (t < tDis - 1.6) headline2('Think of', 'an orchestra.', C.ginger, t, s.t0 + .3, s.t0 + .7, 76); else headline2('Not intelligence.', 'A musical disaster.', C.red, t, lt('p209') - .2, tDis, 76);
  };
}
{ const s = SC.c7c, tSz = wt('p211', 'seizures'), tGoal = lt('p212'), tRight = lt('p213');
  ev(lt('p211'), 'pop'); ev(tSz, 'alarm'); ev(tRight, 'chime');
  FILM.c7c = t => {
    const pc = pinch(t, s, -1); camSet(pc.z, 960, 540, pc.r);
    world(() => {
      const x0 = 740, x1 = 1760, y0 = 320; rrect(x0 - 40, y0 - 60, x1 - x0 + 80, 600, 20, C2.white, { lw: 5 });
      const sync = ss(seg(t, lt('p211') + .4, tSz + .3)) * (1 - ss(seg(t, tGoal, tGoal + .8)));
      for (let ch = 0; ch < 5; ch++) { const yb = y0 + 40 + ch * 105, P = []; for (let x = x0; x <= x1; x += 6) { const u = (x - x0) / 60 - t * 2;
          const calm = Math.sin(u * (1.3 + ch * .37) + ch * 2) * 14 + Math.sin(u * 3.1 + ch) * 6, spike = Math.pow(Math.max(0, Math.sin(u * 1.4)), 12) * -80;
          P.push([x, yb + lerp(calm, spike, sync)]); }
        g.save(); g.strokeStyle = sync > .5 ? C.red : C.ink; g.lineWidth = 4; g.lineJoin = 'round'; g.beginPath(); P.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.stroke(); g.restore();
        if (t > tRight) { const u = ((t - tRight) * .9 - ch * .18); if (u > 0 && u < 1) circ(lerp(x0, x1, u), yb, 12, C.ginger, { lw: 3 }); } }
      label(sync > .5 ? 'Every neuron, at once: a seizure' : t > tGoal ? 'The right neurons, at the right time' : 'Normal activity', x0, y0 - 24, { col: sync > .5 ? C.red : C.ink });
    });
    scr(); chap(7, t, s); if (t < tGoal - .2) headline2('In real life:', 'seizures.', C.red, t, s.t0 + .3, tSz, 76); else headline2('The goal:', 'the right time.', C.ginger, t, tGoal - .2, tRight, 76);
  };
}
{ const s = SC.c7d, tTalk = lt('p215'), tMem = lt('p216'), tImg = lt('p217'), tEmo = lt('p219'), tMeet = lt('p220'), tAll = lt('p221'), tNone = lt('p222');
  ev(tTalk, 'boss'); ev(tMem, 'card'); ev(tImg, 'card'); ev(tEmo, 'alarm'); ev(tMeet, 'crowd'); ev(tNone, 'womp');
  board('c7d', 'b17m', {
    cam: (t, s, pc) => camSet(pc.z, 860, 540, pc.r),
    vis: (t, V) => { V.talk = pop(t, tTalk - .1) * (1 - ein(t, tMem + 1.5, .3)); V.proj = pop(t, tMem); V.wb2 = pop(t, tImg); V.panic = ss(seg(t, tEmo - .3, tMeet + .5)); },
    ttl: (t, s) => { chap(7, t, s); T('All neurons', 118, 238, { size: 64, w: 600, track: -2 }, t, tAll - .1); T('working.', 118, 308, { size: 64, w: 600, track: -2 }, t, tAll); T('No solution.', 118, 378, { size: 64, w: 600, track: -2, col: C.red }, t, tNone - .1); }
  });
}

// ================= ENDING =================
{ const s = SC.e1, tPct = lt('p225'), tCombo = lt('p226');
  ev(s.t0 + .1, 'reboot'); ev(tPct, 'sting'); for (let i = 0; i < 8; i++) ev(tCombo + i * .42, 'land', { i });
  board('e1', 'b18a', {
    vis: (t, V) => { for (let i = 0; i < 8; i++) V['p' + i] = pop(t, tCombo + i * .42); const w = seg(t, s.t0, s.t0 + 2.5); V.wx = lerp(2050, 1820, eout3(w)); V.wph = w < 1 ? t * 9 : .6; },
    ttl: (t, s) => { Lb('Ending  ·  The final boss', 124, 150, t, s.t0 + .2); if (t < tPct - .2) headline2('The smartest', 'human alive?', C.ginger, t, s.t0 + .3, s.t0 + .8); else headline2('Intelligence isn\'t', 'a percentage.', C.ginger, t, tPct - .2, tPct); }
  });
}
{ const s = SC.e2, tGf = lt('p232'), tDw = lt('p233'), tHelp = lt('p234');
  ev(tGf, 'boss'); ev(tDw, 'pop'); ev(tHelp, 'womp');
  board('e2', 'b18', {
    vis: (t, V, P) => { V.dw = pop(t, tDw - .1); V.qm = t > tDw + .8 ? 1 : 0; V.red = t > tDw + .8 ? 1 : 0;
      P.you = poseAt([[0, pose({ la: -.5, lb: .2, ra: .5, rb: -.2, head: .05 })], [tDw + .8, pose({ la: -2.5, lb: -.4, ra: 2.5, rb: .4, head: .1 })]], t); P.gf = bp({ la: -.4, lb: .2, ra: .9, rb: -1.9, head: -.05 }, t, 1); },
    ttl: (t, s) => { Lb('Ending  ·  The hardest problem', 124, 150, t, s.t0 + .2, null, { col: '#BFC4D8' }); T('The final boss', 118, 238, { size: 84, w: 600, track: -2, col: C.paper }, t, s.t0 + .4); }
  });
}
{ const s = SC.e3, tB = lt('p235'), tU = lt('p236'), tG = lt('p237'), tBut = lt('p238'), tHard = lt('p239'), tEat = lt('p240'), tEnd = lt('p241');
  ev(tB, 'pop'); ev(tU, 'pop'); ev(tG, 'pop'); ev(tBut, 'stop'); ev(tEat, 'tada'); ev(tEnd, 'end');
  FILM.e3 = t => {
    const pc = pinch(t, s, 1); camSet(pc.z, 960, 540, pc.r);
    if (t < tEat - .1) {
      SUBDARK = 1; rect(-40, -40, W + 80, H + 80, '#2E3556', { lw: 0 }); const r = mulberry(5); for (let i = 0; i < 60; i++) circ(r() * W, r() * 900, 1.5 + r() * 2, '#F4F1E6', { lw: 0 });
      const items = [[tB, 'the human brain', 620], [tU, 'the universe', 960], [tG, 'the distance between galaxies', 1300]];
      items.forEach(([a, s2, x], i) => { const k = pop(t, a) * (1 - ein(t, tBut, .4)); popIn(x, 520, k, () => {
        if (i === 0) bigHead(x, 500, 90, false, -.2); if (i === 1) { circ(x, 500, 80, C.sky, { lw: 5 }); shape(() => g.ellipse(x, 500, 130, 26, -.3, 0, Math.PI * 2), null, { lw: 5, col: C.wall }); }
        if (i === 2) { g.save(); g.strokeStyle = C.lilac; g.lineWidth = 6; g.lineCap = 'round'; for (const sg of [0, Math.PI]) { g.beginPath(); for (let a = 0; a < 9; a += .1) { const rr = 8 * a; g.lineTo(x + Math.cos(a + sg) * rr, 500 + Math.sin(a + sg) * rr * .6); } g.stroke(); } g.restore(); }
        text(s2, x, 660, { size: 28, w: 500, col: C.paper, align: 'center' }); }); });
      scr(); if (t > tBut - .2) { T('The hardest problem', 118, 420, { size: 84, w: 600, track: -2, col: C.paper }, t, tHard - .2); T('isn\'t science.', 118, 512, { size: 84, w: 600, track: -2, col: C.paper }, t, tHard + .3); }
    } else {
      const u = seg(t, tEat, tEnd + 2.5);
      VIS = { cx: 260 * ss(u), heart: pop(t, tEat + .6) }; PZ = { you: breathe(pose({ ra: .95, rb: -.35, la: -.4, lb: .2, head: .2 }), t), gf: breathe(pose({ la: -.95, lb: .35, ra: .4, rb: -.2, head: -.15 }), t, 1) };
      world(() => SB.b18e()); VIS = PZ = null; scr();
      T('Where to eat.', 118, 238, { size: 84, w: 600, track: -2, col: C.ginger }, t, tEat, tEnd - .1);
      if (t > tEnd - .2) { T('See you in the next', 118, 238, { size: 84, w: 600, track: -2, col: C.paper }, t, tEnd - .1); T('experiment!', 118, 329, { size: 84, w: 600, track: -2, col: C.ginger }, t, tEnd + .2); Lb('Curious Mind', 124, 150, t, tEnd, null, { col: '#BFC4D8' }); }
      const fo = ein(t, s.t1 - 1.0, .9); if (fo > 0) { g.save(); g.globalAlpha = fo; g.fillStyle = C.paper; g.fillRect(0, 0, W, H); g.restore(); }
    }
  };
}


// ---------- subtitles ----------
function drawSubs(t) { const q = TLS.cues.find(c => t >= c.t0 && t < c.t1); if (!q) return; const k = ein(t, q.t0, .1) * (1 - ein(t, q.t1 - .1, .1));
  if (SUBWASH > 0) { const gr = g.createLinearGradient(0, 930, 0, 1080); gr.addColorStop(0, 'rgba(243,240,234,0)'); gr.addColorStop(.35, 'rgba(243,240,234,.88)'); g.save(); g.globalAlpha = SUBWASH * k; g.fillStyle = gr; g.fillRect(0, 930, W, 150); g.restore(); }
  g.save(); g.globalAlpha = k; g.fillStyle = C.ginger; g.fillRect(124, 968, 4, 46); g.restore(); g.save(); g.font = '500 36px Jost'; const tw = g.measureText(q.text).width; g.restore(); const fs = tw > 1640 ? Math.floor(36 * 1640 / tw) : 36; text(q.text, 146, 1003, { size: fs, w: 500, a: k, col: SUBDARK ? C.paper : C.ink }); }

// ================= page contract =================
window.EV = EV.sort((a, b) => a.t - b.t);
window.DUR = DUR;
window.render = t => {
  scr(); paper(); SUBWASH = 0; SUBDARK = 0;
  const s = TLS.scenes.find(x => t >= x.t0 && t < x.t1) || TLS.scenes[TLS.scenes.length - 1];
  g.save(); FILM[s.id](t); g.restore(); scr();
  drawSubs(t);
};
window.TEXTS = t => { TXT = []; window.render(t); const r = TXT; TXT = null; return r; };
document.fonts.load(`600 40px ${EN}`).then(() => Promise.all([document.fonts.load(`500 40px ${EN}`), document.fonts.load(`400 40px ${EN}`)])).then(() => { window.render(0); window.READY = true; });
