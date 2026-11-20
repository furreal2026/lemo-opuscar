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
let SUBWASH = 0;

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

// placeholder for chapters not animated yet
for (const id of ['chapter2', 'chapter3', 'chapter4', 'chapter5', 'chapter6', 'chapter7', 'ending']) FILM[id] = t => { text(id + ' — not animated yet', 960, 540, { size: 48, w: 600, align: 'center', col: C.mute }); };

// ---------- subtitles ----------
function drawSubs(t) { const q = TLS.cues.find(c => t >= c.t0 && t < c.t1); if (!q) return; const k = ein(t, q.t0, .1) * (1 - ein(t, q.t1 - .1, .1));
  if (SUBWASH > 0) { const gr = g.createLinearGradient(0, 930, 0, 1080); gr.addColorStop(0, 'rgba(243,240,234,0)'); gr.addColorStop(.35, 'rgba(243,240,234,.88)'); g.save(); g.globalAlpha = SUBWASH * k; g.fillStyle = gr; g.fillRect(0, 930, W, 150); g.restore(); }
  g.save(); g.globalAlpha = k; g.fillStyle = C.ginger; g.fillRect(124, 968, 4, 46); g.restore(); text(q.text, 146, 1003, { size: 36, w: 500, a: k }); }

// ================= page contract =================
window.EV = EV.sort((a, b) => a.t - b.t);
window.DUR = DUR;
window.render = t => {
  scr(); paper(); SUBWASH = 0;
  const s = TLS.scenes.find(x => t >= x.t0 && t < x.t1) || TLS.scenes[TLS.scenes.length - 1];
  g.save(); FILM[s.id](t); g.restore(); scr();
  drawSubs(t);
};
window.TEXTS = t => { TXT = []; window.render(t); const r = TXT; TXT = null; return r; };
document.fonts.load(`600 40px ${EN}`).then(() => Promise.all([document.fonts.load(`500 40px ${EN}`), document.fonts.load(`400 40px ${EN}`)])).then(() => { window.render(0); window.READY = true; });
