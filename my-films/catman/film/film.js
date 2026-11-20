// "What if a cat bit you?" — the film. Every frame is a pure function of t (seconds). Timings come from timeline.js (voice-driven).
const TLS = window.TL, DUR = TLS.dur;
const LN = TLS.lines;
const lt = id => LN[id].t, le = id => LN[id].t + LN[id].dur;
// time of the n-th word in a line that starts with `w` (case-insensitive)
function wt(id, w, n = 1) { const ws = LN[id].words; let k = 0; for (const x of ws) if (x[0].toLowerCase().replace(/[^a-z0-9.,]/g, '').startsWith(w.toLowerCase()) && ++k === n) return x[1]; return LN[id].t; }
const SC = Object.fromEntries(TLS.scenes.map(s => [s.id, s]));

// ---------- motion helpers ----------
const ein = (t, a, d = .4) => ss(seg(t, a, a + d));
function sp(x, w = 11, z = .6) { if (x <= 0) return 0; const wd = w * Math.sqrt(1 - z * z); return 1 - Math.exp(-z * w * x) * (Math.cos(wd * x) + z * w / wd * Math.sin(wd * x)); }
const pop = (t, a) => sp(t - a, 17, .45);
function lerpPose(a, b, s) { const o = {}; for (const k of KEYS) o[k] = a[k] + (b[k] - a[k]) * s; return o; }
function poseAt(keys, t) { let p = { ...keys[0][1] }; for (let i = 1; i < keys.length; i++) { const s = sp(t - keys[i][0]); if (s > 0) p = lerpPose(p, keys[i][1], s); } return p; }
function walkP(ph, k = 1) { const p = rest(), A = .07 * k;
  p.lfx = A * Math.sin(ph); p.rfx = -A * Math.sin(ph); p.lfy = .045 * k * Math.max(0, Math.cos(ph)); p.rfy = .045 * k * Math.max(0, -Math.cos(ph));
  p.hy = .012 + .012 * Math.abs(Math.cos(ph)); p.lean = .06 * k; p.head = .04; p.la = -.7 * k * Math.sin(ph) - .3; p.lb = .5; p.ra = .7 * k * Math.sin(ph) + .3; p.rb = -.5; return p; }
function breathe(p, t, ph = 0) { const q = { ...p }; q.hy += .004 * Math.sin(t * 2.1 + ph); q.head += .015 * Math.sin(t * 1.3 + ph); return q; }
function cam(z = 1, cx = W / 2, cy = H / 2, sx = 0, sy = 0) { g.setTransform(z, 0, 0, z, W / 2 - cx * z + sx, H / 2 - cy * z + sy); }
function scr() { g.setTransform(1, 0, 0, 1, 0, 0); }
function shake(t, a, amp = 10, d = .3) { const u = t - a; if (u < 0 || u > d) return [0, 0]; const k = (1 - u / d) * amp; return [Math.sin(u * 83) * k, Math.cos(u * 71) * k]; }
// text that slides up 18 px while fading in, fades out at `out`
function T(s, x, y, o, t, a, out = 1e9) { const k = ein(t, a, .4) * (1 - ein(t, out - .3, .3)); if (k <= 0) return; text(s, x, y + (1 - k) * 18, { ...o, a: k * (o.a ?? 1) }); }
function L(s, x, y, t, a, out, o = {}) { const k = ein(t, a, .4) * (1 - ein(t, (out ?? 1e9) - .3, .3)); if (k <= 0) return; label(s, x, y + (1 - k) * 12, { a: k, ...o }); }
function scaled(x, y, k, fn) { if (k <= 0.001) return; g.save(); g.translate(x, y); g.scale(k, k); g.translate(-x, -y); fn(); g.restore(); }
function dashedArc(P, upto, col = C.ginger) { // P: cubic [p0,p1,p2,p3]; draw first `upto` (0..1)
  if (upto <= 0) return; g.save(); g.strokeStyle = col; g.lineWidth = 6; g.setLineDash([2, 16]); g.lineCap = 'round'; g.beginPath();
  const n = 60; for (let i = 0; i <= n * upto; i++) { const q = bez(P, i / n); i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]); } g.stroke(); g.restore(); }
function bez(P, u) { const s = 1 - u; return [0, 1].map(i => s * s * s * P[0][i] + 3 * s * s * u * P[1][i] + 3 * s * u * u * P[2][i] + u * u * u * P[3][i]); }

// Meow Man with partial transformation: k.head (fill), k.ears, k.whisk, k.tail in 0..1 (springy)
function catK(f, p, k = {}) {
  const S = f.S, sc = clamp(Math.sqrt(S / 380), .6, 1.05), w = 8 * sc, j = joints(f, p);
  const ke = k.ears ?? 1, kt = k.tail ?? 1, kw = k.whisk ?? 1, kh = k.head ?? 1;
  if (kt > 0.01) { const Hp = j.Hp, d = f.face || 1, wag = (k.wag || 0);
    const P = [Hp, [Hp[0] - d * .16 * S * kt, Hp[1] + .06 * S * kt], [Hp[0] - d * .36 * S * kt, Hp[1] - .02 * S * kt], [Hp[0] - d * (.33 + wag) * S * kt, Hp[1] - .27 * S * kt]];
    for (const [c, lw] of [[C.ink, w + 7 * sc], [C.ginger, w]]) { g.save(); g.strokeStyle = c; g.lineWidth = lw; g.lineCap = 'round'; g.beginPath(); g.moveTo(...P[0]); g.bezierCurveTo(...P[1], ...P[2], ...P[3]); g.stroke(); g.restore(); } }
  const r = GEO.headR * S, up = Math.atan2(j.Hd[1] - j.N[1], j.Hd[0] - j.N[0]);
  if (ke > 0.01) for (const s of [-1, 1]) { const a = up + s * .62, b0 = a - .36, b1 = a + .36, R = r * (.92 + .83 * ke);
    poly([[j.Hd[0] + Math.cos(b0) * r * .92, j.Hd[1] + Math.sin(b0) * r * .92], [j.Hd[0] + Math.cos(a) * R, j.Hd[1] + Math.sin(a) * R], [j.Hd[0] + Math.cos(b1) * r * .92, j.Hd[1] + Math.sin(b1) * r * .92]], C.ginger, { lw: 7.5 * sc }); }
  figure({ ...f, fill: kh >= 1 ? C.ginger : mix(C.paper, C.ginger, kh) }, p);
  if (kw > 0.01) { const side = [Math.cos(up + Math.PI / 2), Math.sin(up + Math.PI / 2)], dn = [-Math.cos(up), -Math.sin(up)];
    for (const s of [-1, 1]) for (const q of [-1, 0, 1]) { const o = [j.Hd[0] + side[0] * s * r * .62 + dn[0] * r * .25, j.Hd[1] + side[1] * s * r * .62 + dn[1] * r * .25];
      line([o, [o[0] + (side[0] * s * r * .95 + dn[0] * q * r * .3) * kw, o[1] + (side[1] * s * r * .95 + dn[1] * q * r * .3) * kw]], C.ink, 3 * sc); } }
  if (k.glow) for (const s of [-1, 1]) { const ex = j.Hd[0] + s * r * .38, ey = j.Hd[1] - r * .05;
    g.save(); g.globalAlpha = k.glow * .35; circ(ex, ey, r * .42, '#FFE9A8', { lw: 0 }); g.restore(); g.save(); g.globalAlpha = k.glow; circ(ex, ey, r * .17, '#FFF3C4', { lw: 0 }); g.restore(); }
  return j;
}

// ---------- events for the mixer ----------
const EV = []; const ev = (t, type, o = {}) => EV.push({ t: +t.toFixed(3), type, ...o });

// ================= scenes =================
const FILM = {};

// ---- S1: the bite ----
{ const s = SC.s1, tBite = lt('l03'), tReach = le('l02') + .15, tWalk1 = lt('l02') - .2;
  ev(.3, 'pop'); ev(s.t0 + .2, 'title');
  for (let x = .5; x < tWalk1; x += .38) ev(x, 'step');
  ev(tReach, 'reach'); ev(tBite, 'chomp'); ev(tBite + .05, 'sting');
  const reachP = pose({ lean: .34, bend: -.03, head: .5, hy: .015, ra: 1.12, rb: .08, la: -.2, lb: .35, lfx: -.06, rfx: .12 });
  const ouch = pose({ lean: -.12, head: -.25, ra: -2.2, rb: .9, la: -.9, lb: .5, hy: .01, lfx: -.04, rfx: .06 });
  FILM.s1 = t => {
    const gy = 880, f0 = { x: 1000, gy, S: 470 }, J = joints(f0, reachP), hand = J.aR[1], cs = 270, cx = hand[0] + .4 * cs, base = hand[1] + .66 * cs;
    const z = 1 + .07 * ss(seg(t, 2, tBite)), [sx, sy] = shake(t, tBite, 12, .35);
    cam(z, lerp(960, hand[0], ss(seg(t, 2, tBite))), lerp(540, hand[1] + 60, ss(seg(t, 2, tBite))), sx, sy);
    rect(1440, 170, 280, 210, C2.wood); rect(1462, 192, 236, 166, C.sky, { lw: DL });
    shape(() => { g.moveTo(1500, 275); g.quadraticCurveTo(1570, 215, 1640, 275); g.quadraticCurveTo(1570, 335, 1500, 275); }, C2.fish, { lw: DL });
    poly([[1640, 275], [1675, 250], [1675, 300]], C2.fish, { lw: DL }); circ(1525, 268, 5, C.ink, { lw: 0 });
    for (const x of [1560, 1585, 1610]) dline([[x, 248], [x + 8, 275], [x, 302]]);
    dline([[1560, 170], [1580, 130], [1600, 170]]); circ(1580, 128, 6, C.ink, { lw: 0 });
    ground(gy, -400, 2400);
    shape(() => g.ellipse(1300, gy + 12, 470, 30, 0, 0, Math.PI * 2), C.blue, { lw: 5 });
    shape(() => g.ellipse(1300, gy + 12, 410, 19, 0, 0, Math.PI * 2), null, { col: C2.rugL, lw: DL });
    for (const sg of [-1, 1]) for (let k = -2; k <= 2; k++) dline([[1300 + sg * 470, gy + 12 + k * 9], [1300 + sg * 495, gy + 12 + k * 11]]);
    rrect(cx - .42 * cs, base, .86 * cs, gy - base, 20, C.pink);
    g.save(); g.setLineDash([8, 10]); rrect(cx - .42 * cs + 12, base + 12, .86 * cs - 24, gy - base - 24, 12, null, { lw: DL, col: '#C9746C' }); g.restore();
    const bx = 1650; poly([[bx - 60, gy - 50], [bx + 60, gy - 50], [bx + 45, gy], [bx - 45, gy]], C2.bowl);
    for (let i = 0; i < 9; i++) circ(bx - 42 + i * 10.5, gy - 55 - (i % 3) * 5, 7, C2.kibble, { lw: 2 });
    text('MR. B', bx, gy - 16, { size: 20, w: 600, col: C2.white, align: 'center', track: 2 });
    // the guy walks in, reaches, gets bitten
    let x = 1000, p;
    if (t < tWalk1) { const u = clamp((t - .4) / (tWalk1 - .4)); x = lerp(640, 1000, 1 - (1 - u) * (1 - u)); p = walkP(t * 9.5, 1 - ss(seg(t, tWalk1 - .4, tWalk1))); }
    else p = poseAt([[0, pose({ la: -.45, lb: .2, ra: .45, rb: -.2 })], [tReach, reachP], [tBite + .18, ouch]], t);
    const handNow = t >= tBite && t < tBite + .18;
    figure({ x, gy, S: 470 }, handNow ? reachP : p);
    const ck = pop(t, .3), lunge = bell(t, tBite - .08, tBite + .25) * 14;
    scaled(cx, gy, ck, () => { g.save(); g.translate(-lunge, 0); cat(cx, base, cs, { d: 1, mood: 'angry', mouth: t > tBite - .06 && t < tBite + .7 ? 1 : 0 }); g.restore(); });
    if (t > tBite) { const k = pop(t, tBite); scaled(hand[0] - 8, hand[1] - 14, k, () => jag(hand[0] - 8, hand[1] - 14, 30, 5, C.red, 6));
      scaled(hand[0] + 40, hand[1] - 165, k, () => text('CHOMP', hand[0] - 30, hand[1] - 150, { size: 44, w: 600, col: C.red, track: 2 })); }
    const lk = ein(t, 1.0, .4); if (lk > 0) { g.save(); g.globalAlpha = lk; label('Mr. Biscuits, 4 kg', cx + 150, base - 150); line([[cx + 230, base - 134], [cx + 160, base - 80]], C.mute, 3); arrowHead(cx + 160, base - 80, Math.atan2(54, -70), 12, C.mute, 3); g.restore(); }
    scr();
    L('What if?  ·  Episode 1', 124, 118, t, .1);
    T('What if a cat', 116, 230, { size: 104, w: 600, track: -2 }, t, .2);
    T('bit you?', 116, 340, { size: 104, w: 600, track: -2, col: C.ginger }, t, .45);
  };
}

// ---- S2: reality check, then the mirror ----
{ const s = SC.s2, tDay = lt('l05'), tEars = wt('l05', 'ears'), tTail = wt('l06', 'tail'), tSwap = tDay - .1;
  ev(s.t0 + .1, 'title'); ev(tSwap, 'pop'); ev(tEars, 'boing'); ev(tEars + .1, 'sting'); ev(tTail, 'boing2');
  FILM.s2 = t => {
    const gy = 880;
    if (t < tSwap) { // reality check card
      scr();
      L('Reality check', 124, 118, t, s.t0 + .05, tSwap);
      T('Real cat bites don’t', 116, 240, { size: 88, w: 600, track: -2 }, t, s.t0 + .2, tSwap);
      T('give powers.', 116, 340, { size: 88, w: 600, track: -2 }, t, s.t0 + .4, tSwap);
      T('They give infections.', 120, 450, { size: 56, w: 600, col: C.red }, t, wt('l04', 'infection') - .2, tSwap);
      T('See a doctor.', 120, 530, { size: 56, w: 500 }, t, wt('l04', 'doctor') - .3, tSwap);
      // a bandaged hand
      const k = pop(t, s.t0 + .5); scaled(1350, 560, k, () => { withRot(1350, 560, -.35, () => {
        rrect(1220, 470, 300, 180, 80, C2.white); rrect(1290, 520, 150, 80, 18, C.wall, { lw: DL });
        for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) circ(1325 + i * 26, 548 + j * 24, 3, C.boxD, { lw: 0 });
        for (let i = 0; i < 4; i++) rrect(1500, 470 + i * 44, 110, 38, 18, C2.white); }); });
      const k2 = pop(t, wt('l04', 'doctor') - .2); scaled(1640, 300, k2, () => { rect(1590, 250, 100, 100, C.red); rect(1626, 268, 28, 64, C2.white, { lw: 0 }); rect(1608, 286, 64, 28, C2.white, { lw: 0 }); });
      return;
    }
    const [sx, sy] = shake(t, tEars, 8, .25), z = 1 + .05 * ss(seg(t, tSwap, s.t1));
    cam(z, 1000, 540, sx, sy);
    rect(960, 170, 640, 560, C2.tile, { lw: 0 });
    for (let x = 960; x <= 1600; x += 64) dline([[x, 170], [x, 730]], '#B7CDD3');
    for (let y = 170; y <= 730; y += 64) dline([[960, y], [1600, y]], '#B7CDD3');
    const kE = sp(t - tEars, 16, .4), kT = sp(t - tTail, 14, .45), kH = ss(seg(t, tEars - .05, tEars + .15));
    const P = poseAt([[0, pose({ la: -.4, lb: .2, ra: .4, rb: -.2, head: .1 })], [tEars, pose({ la: -2.3, lb: -.4, ra: 2.3, rb: .4, head: -.05 })], [tTail + .2, pose({ la: -2.0, lb: -.5, ra: 1.0, rb: .3, head: .35, lean: .05 })]], t);
    const kk = { ears: kE, head: kH, whisk: kH, tail: kT };
    const mx = 1090, my = 210, mw = 340, mh = 420;
    rrect(mx - 18, my - 18, mw + 36, mh + 36, 26, C2.wood); rrect(mx, my, mw, mh, 14, C.screen, { lw: DL });
    g.save(); g.beginPath(); g.roundRect(mx, my, mw, mh, 14); g.clip();
    const Pm = { ...P, la: -P.ra, ra: -P.la, lb: -P.rb, rb: -P.lb, head: -P.head, lean: -P.lean };
    catK({ x: mx + mw / 2, gy: my + mh + 250, S: 420, face: -1 }, breathe(Pm, t), { ...kk, tail: 0 });
    for (const [a, b] of [[[mx + 30, my + 40], [mx + 90, my + 12]], [[mx + 30, my + 90], [mx + 150, my + 20]]]) line([a, b], C2.white, 8);
    g.restore();
    rect(1010, 700, 520, 34, C2.white); shape(() => g.ellipse(1260, 702, 120, 16, 0, 0, Math.PI * 2), C.screen, { lw: DL });
    rrect(1248, 640, 24, 60, 6, C2.chrome); rrect(1248, 640, 70, 20, 8, C2.chrome); circ(1236, 690, 10, C2.chrome, { lw: DL }); circ(1288, 690, 10, C2.chrome, { lw: DL });
    rect(1035, 734, 470, 146, C2.woodL); dline([[1270, 734], [1270, 880]]); rrect(1240, 780, 12, 46, 5, C2.chrome, { lw: DL }); rrect(1288, 780, 12, 46, 5, C2.chrome, { lw: DL });
    rect(1035, 860, 470, 20, C2.wood, { lw: DL });
    rect(1440, 640, 44, 60, C.blue); line([[1452, 640], [1442, 590]], C.red, 6); line([[1472, 640], [1484, 596]], C.grass, 6);
    ground(gy, -400, 2400);
    catK({ x: 720, gy, S: 420 }, breathe(P, t), kk);
    if (t > tEars) { const k = ein(t, tEars, .15); g.save(); g.globalAlpha = k * (1 - ein(t, tTail - .3, .3));
      for (const a of [-2.6, -2.2, -1.0, -.6]) dline([[720 + Math.cos(a) * 120, 520 + Math.sin(a) * 120], [720 + Math.cos(a) * 160, 520 + Math.sin(a) * 160]]);
      text('?!', 820, 420, { size: 64, w: 600, col: C.red }); g.restore(); }
    if (t > tTail) { const k = pop(t, tTail); scaled(470, 560, k, () => { text('...why', 400, 600, { size: 40, w: 600, col: C.mute }); }); }
    scr();
    L('Day 1  ·  7:02 a.m.', 124, 118, t, tSwap);
    T('Something is', 116, 226, { size: 96, w: 600, track: -2 }, t, tSwap + .1);
    T('different.', 116, 326, { size: 96, w: 600, track: -2, col: C.ginger }, t, tEars - .1);
  };
}

// ---- S3: night vision ----
{ const s = SC.s3, tOpen = wt('l07', 'vision'), tSix = wt('l07', 'six'), tGlow = wt('l08', 'glow'), tRem = wt('l09', 'remote'), tMirror = wt('l08', 'mirror');
  ev(s.t0 + .1, 'title'); ev(tOpen, 'sweep'); ev(tGlow, 'shimmer'); ev(tRem, 'ding');
  const dark = { line: C2.nightL, wall: C2.night, floor: '#171B2A', glass: '#232A40', moon: '#3A4260', curtain: '#20263A', wood: '#20263A', blanket: '#212739', pillow: '#232A3E', lamp: '#252C42', sock: '#1F2436', remote: '#1E2334' };
  const cv = { line: C.ink, wall: C2.cv1, floor: C2.cv2, glass: '#DDE8E2', moon: '#F6F8EE', curtain: C2.cv3, wood: C2.cv3, blanket: C2.cv2, pillow: '#E4ECE7', lamp: '#E4ECE7', sock: C2.cv3, remote: C2.cv3 };
  FILM.s3 = t => {
    cam(1 + .02 * seg(t, s.t0, s.t1), 960, 540);
    const k1 = pop(t, s.t0 + .25); scaled(524, 420, Math.min(1, k1 * 1.0 + .0), () => bedroom(124, 160, 800, 520, dark));
    // glowing eyes in the dark panel
    if (t > tGlow - .1) { const k = ein(t, tGlow - .1, .3) * (.85 + .15 * Math.sin(t * 6));
      for (const ex of [470, 520]) { g.save(); g.globalAlpha = k * .4; circ(ex, 420, 24, '#FFE9A8', { lw: 0 }); g.restore(); g.save(); g.globalAlpha = k; circ(ex, 420, 10, '#FFF3C4', { lw: 0 }); g.restore(); } }
    // cat view opens like an eye, left to right
    const ko = ss(seg(t, tOpen, tOpen + .9));
    if (ko > 0) { g.save(); g.beginPath(); g.rect(996, 160 - 10, 820 * ko, 540); g.clip(); bedroom(996, 160, 800, 520, cv); g.restore();
      if (ko < 1) line([[996 + 800 * ko, 160], [996 + 800 * ko, 680]], C.ginger, 6); }
    // mirror layer diagram (tapetum): a small eye inset during l08
    const kd = ein(t, tMirror - .2, .3) * (1 - ein(t, lt('l09') - .2, .3));
    if (kd > 0) { g.save(); g.globalAlpha = kd; const ex = 1590, ey = 280;
      rrect(1470, 190, 300, 190, 16, C2.white, { lw: 4 });
      shape(() => g.arc(ex + 30, ey, 70, Math.PI * .6, Math.PI * 1.4, true), C2.fish, { lw: 4 });
      line([[ex + 30 + Math.cos(-.9) * 72, ey + Math.sin(-.9) * 72], [ex + 30 + Math.cos(.9) * 72, ey + Math.sin(.9) * 72]], C.ink, 0.01);
      g.save(); g.strokeStyle = C.ginger; g.lineWidth = 10; g.beginPath(); g.arc(ex + 30, ey, 74, -.9, .9); g.stroke(); g.restore();
      const u = (t * 1.2) % 1; line([[1490, ey - 20], [lerp(1490, ex + 100, Math.min(1, u * 2)), ey - 20]], C.wall, 5);
      if (u > .5) line([[ex + 100, ey + 18], [lerp(ex + 100, 1490, (u - .5) * 2), ey + 18]], C.wall, 5);
      text('mirror layer', 1490, 365, { size: 22, w: 600, col: C.ginger }); g.restore(); }
    if (t > tRem) { const k = ss(seg(t, tRem, tRem + .5)); g.save(); g.strokeStyle = C.ginger; g.lineWidth = 6; g.lineCap = 'round'; g.beginPath(); g.ellipse(996 + 685, 160 + 483, 70, 34, -.08, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * k); g.stroke(); g.restore(); }
    scr();
    L('Power 1  ·  Night vision', 124, 118, t, s.t0 + .05);
    L('You, before', 124, 722, t, s.t0 + .4); L('You, now', 996, 722, t, tOpen + .3);
    T('found it!', 1796, 722, { size: 26, w: 600, col: C.ginger, align: 'right' }, t, tRem + .2);
    g.save(); g.font = '500 44px Jost'; const w1 = g.measureText('Cats see in light about ').width; g.font = '600 44px Jost'; const w2 = g.measureText('6× dimmer ').width; g.restore();
    T('Cats see in light about', 124, 800, { size: 44, w: 500 }, t, tSix - .6);
    T('6× dimmer', 124 + w1, 800, { size: 44, w: 600, col: C.ginger }, t, tSix - .1);
    T('than you need.', 124 + w1 + w2, 800, { size: 44, w: 500 }, t, tSix + .2);
  };
}

// ---- S4: the landing ----
{ const s = SC.s4, tSlip = lt('l11') - .1, tLand = wt('l12', 'tada') - .35, tTada = wt('l12', 'tada'), tSplash = wt('l12', 'bucket') + .15;
  ev(s.t0 + .1, 'title'); ev(tSlip, 'slip'); ev(tLand, 'land'); ev(tTada, 'tada'); ev(tSplash, 'splash');
  for (let x = s.t0 + .4; x < tSlip; x += .6) ev(x, 'brush');
  const PATH = [[600, 420], [880, 160], [1180, 380], [1160, 880]];
  FILM.s4 = t => {
    const gy = 880, S = 330;
    const [sx, sy] = shake(t, tLand, 8, .25); cam(1, 960, 540, sx, sy);
    rect(124, 150, 1672, 730, C.wall, { lw: 0 });
    // paint: grows while he paints, drips
    const paintW = 640 * (.6 + .4 * ss(seg(t, s.t0, tSlip)));
    rect(124, 150, paintW, 260, C2.paint, { lw: 0 });
    for (const [x, l] of [[200, 40], [330, 70], [470, 30], [600, 56]]) if (x < 124 + paintW) { const ll = l * ss(seg(t, s.t0 + x / 400, s.t0 + x / 400 + 2)); line([[x, 405], [x, 405 + ll]], C2.paint, 12); circ(x, 411 + ll, 9, C2.paint, { lw: 0 }); }
    const top = [560, 420];
    for (const [a, b] of [[[470, gy], top], [[650, gy], top]]) { line([a, b], C.ink, 14); line([a, b], C2.woodL, 7); }
    for (let i = 1; i < 6; i++) { const u = i / 6, y = gy + (top[1] - gy) * u, xl = 470 + 90 * u, xr = 650 - 90 * u; line([[xl, y], [xr, y]], C.ink, 6); }
    rect(520, 406, 80, 18, C2.wood, { lw: 4 });
    // bucket: on the ladder top, falls at the slip, splashes at "bucket"
    const fb = seg(t, tSlip + .3, tSplash);
    if (t < tSplash) { const bxp = lerp(585, 760, fb), byp = lerp(382, gy - 30, fb * fb), rot = 2.2 * fb;
      withRot(bxp, byp, rot, () => { poly([[bxp - 30, byp - 24], [bxp + 30, byp - 24], [bxp + 22, byp + 30], [bxp - 22, byp + 30]], C2.chrome); rect(bxp - 32, byp - 30, 64, 10, C2.chrome, { lw: 4 }); }); }
    else { const k = pop(t, tSplash);
      scaled(720, gy, k, () => { shape(() => g.ellipse(720, gy - 6, 130, 18, 0, 0, Math.PI * 2), C2.paint, { lw: DL }); for (const [x, y] of [[580, gy - 40], [860, gy - 34], [880, gy - 74], [640, gy - 70]]) circ(x, y, 9, C2.paint, { lw: DL }); });
      withRot(770, gy - 24, 1.7, () => { poly([[740, gy - 48], [800, gy - 48], [792, gy + 6], [748, gy + 6]], C2.chrome); }); }
    ground(gy, -400, 2400);
    // Meow Man: paints on top, slips, slow-mo tumble along PATH, rights himself, lands
    const u = clamp((t - tSlip) / (tLand - tSlip));
    const paintP = pose({ ra: 2.5 + .25 * Math.sin(t * 5), rb: -.3, la: -.5, lb: .3, head: -.2, lean: -.04 });
    const tumble = pose({ la: -1.9, lb: .15, ra: 1.9, rb: -.15, lfx: -.03, rfx: .03 });
    const landP = pose({ hy: .025, lean: -.04, la: -1.1, lb: -.3, ra: 1.1, rb: .3, lfx: -.04, rfx: .04 });
    const tadaP = pose({ la: -2.3, lb: -.2, ra: 2.3, rb: .2, head: -.08 });
    if (t < tSlip) catK({ x: 560, gy: 406, S }, breathe(paintP, t), {});
    else if (t < tLand) {
      for (const [lag, a] of [[.24, .18], [.12, .3]]) { const uu = clamp(u - lag); if (uu <= 0) continue; const q = bez(PATH, uu), r = rotAt(uu);
        alpha(a, () => withRot(q[0], q[1], r, () => catK({ x: q[0], gy: q[1] + S * .5, S }, tumble, { tail: 0 }))); }
      const q = bez(PATH, u), r = rotAt(u); withRot(q[0], q[1], r, () => catK({ x: q[0], gy: q[1] + S * .5, S }, tumble, { wag: .1 * Math.sin(t * 8) }));
      dashedArc(PATH, u);
      g.save(); g.globalAlpha = ein(t, tSlip + .1, .3) * (1 - ein(t, tLand - .3, .3)); text('SLOW-MO', 1240, 860, { size: 28, w: 600, col: C.mute, track: 4 }); g.restore();
    } else { dashedArc(PATH, 1 - ein(t, tLand + .6, .6)); catK({ x: 1160, gy, S }, poseAt([[0, landP], [tTada, tadaP]], t), {}); }
    if (t > tTada) { const k = pop(t, tTada); scaled(1290, 700, k, () => text('ta-da!', 1250, 720, { size: 34, w: 600, col: C.ginger })); }
    scr();
    L('Power 2  ·  The landing', 1300, 190, t, s.t0 + .1);
    T('Cats can twist', 1296, 290, { size: 56, w: 500 }, t, lt('l11'));
    T('feet-first', 1296, 380, { size: 84, w: 600, col: C.ginger, track: -2 }, t, wt('l11', 'front'));
    T('in a fall of', 1296, 460, { size: 56, w: 500 }, t, wt('l11', 'fall') - .3);
    T('just 30 cm.', 1296, 530, { size: 56, w: 600 }, t, wt('l11', '30') - .1);
  };
  function rotAt(u) { // 0 → −π (tumble backwards) → 0 (head first, then body)
    if (u < .45) return -Math.PI * ss(u / .45); return -Math.PI * (1 - ss((u - .45) / .45)); }
}

// ---- S5: the jump ----
{ const s = SC.s5, tCrouch = wt('l14', 'times') - .1, tLaunch = wt('l14', '5') + .05, tTop = wt('l14', '9') + .25, tFive = wt('l13', 'five'), tNb = lt('l15');
  ev(s.t0 + .1, 'title'); ev(tFive, 'tick'); ev(tLaunch, 'jump'); ev(tTop, 'land2'); ev(tNb, 'pop');
  FILM.s5 = t => {
    const gy = 880, ppm = 68, S = 1.8 * ppm, hx0 = 470, hx1 = 900, wallTop = gy - 6.8 * ppm, peak = gy - 9 * ppm, top = [(hx0 + hx1) / 2, peak];
    // camera: close on the ground, pulls back up the ruler with the jump
    cam(1);
    line([[170, gy], [170, gy - 10.3 * ppm]], C.ink, 4);
    for (let m = 0; m <= 10; m += .5) { const y = gy - m * ppm, big = m % 2 === 0; line([[170, y], [170 + (big ? 26 : 14), y]], C.ink, 3); if (big) text(m + ' m', 124, y + 8, { size: 22, w: 500, col: C.mute, align: 'right' }); }
    fence(930, 1130, gy, 90); tree(1010, gy, 370); houseD(hx0, hx1, gy, wallTop, peak); tufts(200, 1140, gy);
    // neighbour in the upper window
    if (t > tNb) { const k = pop(t, tNb); g.save(); g.beginPath(); g.rect(hx0 + 260, wallTop + 50, 110, 100); g.clip();
      figure({ x: hx0 + 315, gy: wallTop + 150 + 180 * (1 - k) + 120, S: 170 }, pose({ head: .2 })); g.restore();
      scaled(hx0 + 330, wallTop + 30, k, () => text('?', hx0 + 380, wallTop + 40, { size: 56, w: 600, col: C.red })); }
    const P = [[340, gy - S * .5], [330, gy - 560], [560, peak - 220], [top[0], peak - S * .5 + 4]];
    const u = clamp((t - tLaunch) / (tTop - tLaunch));
    figure({ x: 260, gy, S }, pose({ la: -.6, lb: .3, ra: .6, rb: -.3, head: -.35 }));
    g.save(); g.strokeStyle = C.mute; g.lineWidth = 4; g.setLineDash([2, 12]); g.lineCap = 'round'; g.beginPath(); g.moveTo(222, gy - S - 14); g.quadraticCurveTo(260, gy - S - 14 - 2 * .5 * ppm, 298, gy - S - 14); g.stroke(); g.restore();
    text('you, before:', 150, gy - 66 - S, { size: 18, w: 500, col: C.mute }); text('a 0.5 m hop', 150, gy - 44 - S, { size: 18, w: 500, col: C.mute });
    if (t < tLaunch) catK({ x: 340, gy, S }, poseAt([[0, pose({ la: -.5, lb: .25, ra: .5, rb: -.25 })], [tCrouch, pose({ hy: .02, lean: .05, la: .5, lb: .4, ra: -.5, rb: -.4 })]], t), {});
    else if (t < tTop) { const q = bez(P, ss(u) * .3 + u * .7); dashedArc(P, u); catK({ x: q[0], gy: q[1] + S * .5, S }, pose({ la: -2.4, lb: .3, ra: 2.4, rb: -.3, lfy: .08, rfy: .05 }), {}); }
    else { dashedArc(P, 1); catK({ x: top[0], gy: peak + 4, S }, poseAt([[tTop, pose({ hy: .03, la: -1.2, ra: 1.2 })], [tTop + .3, pose({ la: -2.45, lb: .35, ra: 2.45, rb: -.35, head: -.05, lfx: -.05, rfx: .05 })]], t), {}); }
    ground(gy, -400, 2400);
    scr();
    L('Power 3  ·  The jump', 1240, 190, t, s.t0 + .1);
    T('Cats jump up to', 1236, 290, { size: 52, w: 500 }, t, s.t0 + .4);
    { const k = pop(t, tFive); scaled(1300, 400, k, () => text('5×', 1230, 450, { size: 170, w: 600, col: C.ginger, track: -4 })); }
    T('their own height.', 1236, 530, { size: 52, w: 500 }, t, tFive + .3);
    T('1.8 m × 5 = 9 m', 1236, 640, { size: 60, w: 600 }, t, wt('l14', '9') - .1);
    T('Your neighbors have questions.', 1238, 700, { size: 30, w: 400, col: C.mute }, t, tNb);
  };
}

// ---- S9: super hearing ----
function mouseHole(x, y, k) { scaled(x, y, k, () => { shape(() => { g.moveTo(x - 60, y); g.lineTo(x - 60, y - 50); g.arc(x, y - 50, 60, Math.PI, 0); g.lineTo(x + 60, y); g.closePath(); }, C.ink, { lw: 0 });
  shape(() => g.ellipse(x - 6, y - 22, 26, 18, 0, 0, Math.PI * 2), '#B9B4AA', { lw: 4 }); circ(x - 26, y - 40, 11, '#B9B4AA', { lw: 4 }); circ(x - 30, y - 22, 3, C.ink, { lw: 0 });
  line([[x + 18, y - 18], [x + 44, y - 6]], '#B9B4AA', 4); }); }
function microwave(x, y, k, ding) { scaled(x, y, k, () => { rrect(x - 110, y - 130, 220, 130, 10, C2.white); rrect(x - 95, y - 115, 130, 100, 6, ding ? C.wall : '#3A4052', { lw: DL });
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) circ(x + 62 + i * 14, y - 92 + j * 18, 4, C.ink, { lw: 0 }); rect(x + 50, y - 40, 50, 14, C.screen, { lw: 2 }); text('0:00', x + 75, y - 29, { size: 12, w: 600, align: 'center' }); }); }
function fridge(x, y, k) { scaled(x, y, k, () => { rrect(x - 75, y - 300, 150, 300, 12, C2.white); dline([[x - 75, y - 190], [x + 75, y - 190]]); rrect(x + 48, y - 270, 10, 60, 5, C2.chrome, { lw: DL }); rrect(x + 48, y - 170, 10, 80, 5, C2.chrome, { lw: DL });
  circ(x - 30, y - 250, 12, C.red, { lw: 3 }); rect(x - 50, y - 160, 40, 50, C.wall, { lw: 3 }); }); }
function waves(x, y, t, a, dir = 1, n = 3, col = C.ginger) { if (t < a) return; for (let i = 0; i < n; i++) { const u = ((t - a) * 1.2 + i / n) % 1; g.save(); g.globalAlpha = (1 - u) * .9; g.strokeStyle = col; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.arc(x, y, 20 + u * 70, dir > 0 ? -.6 : Math.PI - .6, dir > 0 ? .6 : Math.PI + .6); g.stroke(); g.restore(); } }
{ const s = SC.s9, tYou = wt('l16', '20'), tCat = wt('l16', '64'), tMouse = wt('l17', 'mouse'), tMic = wt('l17', 'microwave'), tFr = wt('l17', 'fridge'), tAll = wt('l17', 'all');
  ev(s.t0 + .1, 'title'); ev(tYou, 'grow'); ev(tCat, 'grow2'); ev(tMouse, 'squeak'); ev(tMic, 'beep'); ev(tFr, 'hum');
  FILM.s9 = t => {
    cam(1);
    const x0 = 360, px = 15, yb = 300;   // 18 px per kHz
    line([[x0, yb - 60], [x0, yb + 170]], C.ink, 4);
    for (let k = 0; k <= 70; k += 10) { line([[x0 + k * px, yb + 170], [x0 + k * px, yb + 182]], C.ink, 3); text(k + (k === 70 ? ' kHz' : ''), x0 + k * px, yb + 214, { size: 22, w: 500, col: C.mute, align: 'center' }); }
    line([[x0, yb + 170], [x0 + 70 * px, yb + 170]], C.tint, 4);
    const w1 = 20 * px * ss(seg(t, tYou - .3, tYou + .5)), w2 = 64 * px * ss(seg(t, tCat - .3, tCat + .9));
    if (w1 > 2) rect(x0, yb - 30, w1, 60, C.tint, { lw: 5 });
    if (w2 > 2) rect(x0, yb + 70, w2, 60, C.ginger, { lw: 5 });
    text('You', x0 - 24, yb + 12, { size: 30, w: 600, align: 'right', a: ein(t, s.t0 + .3) });
    text('Cat', x0 - 24, yb + 112, { size: 30, w: 600, align: 'right', col: C.ginger, a: ein(t, s.t0 + .5) });
    if (w1 > 300) text('20,000 Hz', x0 + w1 + 20, yb + 12, { size: 30, w: 600, a: ein(t, tYou + .3) });
    if (w2 > 900) text('64,000 Hz', x0 + w2 + 20, yb + 112, { size: 30, w: 600, col: C.ginger, a: ein(t, tCat + .7) });
    // the noisy world
    const gy = 880; ground(gy, -400, 2400);
    rect(124, 560, 360, 320, '#E9DCCB', { lw: 0 }); for (let y = 590; y < 880; y += 32) for (let x = 124 + (y % 64 ? 0 : 30); x < 484; x += 60) rect(x, y - 30, 60, 32, null, { lw: 2, col: '#CDBBA4' });
    mouseHole(300, gy, pop(t, tMouse)); waves(370, gy - 60, t, tMouse + .1);
    rect(560, 760, 330, 120, C2.woodL); microwave(720, 760, pop(t, tMic), t > tMic + .3 && t < tMic + .9); waves(860, 680, t, tMic + .1);
    fridge(1060, gy, pop(t, tFr)); waves(1160, 640, t, tFr + .1);
    const tired = t > tAll ? 1 : 0;
    catK({ x: 1620, gy, S: 400 }, breathe(poseAt([[0, pose({ la: -.4, lb: .2, ra: .4, rb: -.2 })], [tMouse, pose({ head: -.25, la: -.5, ra: .5 })], [tMic, pose({ head: .25, la: -.5, ra: .5 })], [tAll, pose({ head: .45, lean: -.06, hy: .015, la: -.25, lb: .1, ra: .25, rb: -.1, bend: .03 })]], t), t), { ears: 1 + .25 * bell(t, tMouse, tFr + 1.5) });
    if (tired) { const k = pop(t, tAll); scaled(1620, 420, k, () => text('make it stop', 1620, 420, { size: 30, w: 600, col: C.mute, align: 'center' })); }
    scr();
    L('Power 4  ·  Super hearing', 124, 118, t, s.t0 + .05);
  };
}

// ---- S11: super reflexes (the burger) ----
function burger(x, y, sc = 1, bite = 0) { g.save(); g.translate(x, y); g.scale(sc, sc);
  shape(() => { g.moveTo(-50, 8); g.quadraticCurveTo(0, 22, 50, 8); g.lineTo(50, 0); g.lineTo(-50, 0); g.closePath(); }, '#E2A65A', { lw: 4 });
  rrect(-54, -14, 108, 14, 6, '#7A4B2A', { lw: 4 });
  poly([[-56, -14], [56, -14], [40, -6], [20, -16], [0, -6], [-20, -16], [-40, -6]], C.wall, { lw: 3 });
  shape(() => { g.moveTo(-58, -18); for (let i = 0; i <= 6; i++) g.quadraticCurveTo(-58 + i * 19.3 + 9, -28, -58 + (i + 1) * 19.3, -18); g.lineTo(58, -14); g.lineTo(-58, -14); g.closePath(); }, C2.leaf, { lw: 3 });
  shape(() => { g.moveTo(-52, -22); g.quadraticCurveTo(-50, -66, 0, -68); g.quadraticCurveTo(50, -66, 52, -22); g.closePath(); }, '#E2A65A', { lw: 4 });
  for (const [a, b] of [[-26, -44], [-6, -54], [14, -46], [30, -36], [-34, -32], [4, -36]]) shape(() => g.ellipse(a, b, 4, 2.4, .4, 0, Math.PI * 2), C2.white, { lw: 0 });
  if (bite > 0) { g.globalCompositeOperation = 'destination-out'; for (const [a, b] of [[54, -30], [60, -10], [52, -50]]) { g.beginPath(); g.arc(a, b, 16 * bite, 0, Math.PI * 2); g.fill(); } }
  g.restore(); }
function stopwatch(x, y, k, label) { scaled(x, y, k, () => { circ(x, y, 60, C2.white, { lw: 6 }); rect(x - 12, y - 82, 24, 16, C.ink, { lw: 0 }); line([[x, y], [x + 30, y - 34]], C.ginger, 6); circ(x, y, 6, C.ink, { lw: 0 });
  text(label, x, y + 104, { size: 40, w: 600, col: C.ginger, align: 'center' }); }); }
{ const s = SC.s11, tSteal = wt('l29', 'mine') + .3, tGone = wt('l29', 'gone'), tReplay = lt('l30'), tThirty = wt('l30', '30'), tYum = wt('l30', 'delicious'), tRaise = lt('l29') + .4;
  ev(s.t0 + .1, 'title'); ev(wt('l28', 'quarter'), 'grow'); ev(wt('l28', '20'), 'grow2'); ev(tSteal, 'zip'); ev(tGone, 'blink'); ev(tThirty, 'ding'); ev(tYum, 'chomp');
  FILM.s11 = t => {
    const gy = 880, dt = 650, [sx, sy] = shake(t, tSteal, 6, .2);
    cam(1 + .05 * ss(seg(t, lt('l29'), tSteal)), lerp(960, 1150, ss(seg(t, lt('l29'), tSteal))), lerp(540, 560, ss(seg(t, lt('l29'), tSteal))), sx, sy);
    // diner wall: a menu board with a burger on it
    rect(1080, 150, 360, 230, C.ink, { lw: 0 }); text('MENU', 1260, 200, { size: 30, w: 600, col: C2.white, align: 'center', track: 4 });
    for (let i = 0; i < 4; i++) { dline([[1110, 236 + i * 34], [1300, 236 + i * 34]], '#8A8F9C'); text('$' + (5 + i), 1390, 244 + i * 34, { size: 22, w: 600, col: C.wall, align: 'right' }); }
    ground(gy, -400, 2400);
    // friend (ink) and Meow Man, the table in front of them
    const holdLow = pose({ la: -1.25, lb: -.9, ra: .45, rb: -.2, head: -.05 }), toMouth = pose({ la: -.75, lb: -2.15, ra: .45, rb: -.2, head: -.1 });
    const fP = poseAt([[0, holdLow], [tRaise, toMouth], [tGone + .2, pose({ la: -.75, lb: -2.15, ra: .45, rb: -.2, head: .35, lean: -.04 })]], t);
    const fJ = villain({ x: 1500, gy, S: 420 }, breathe(fP, t, 2));
    { const k = ein(t, lt('l29') + .2, .4); if (k > 0) { g.save(); g.globalAlpha = k; label('Dr. Woof, arch-enemy', 1600, 400); line([[1640, 412], [1580, 452]], C.mute, 3); arrowHead(1580, 452, Math.atan2(40, -60), 12, C.mute, 3); g.restore(); } }
    const has = t >= tSteal;
    if (!has) burger(fJ.aL[1][0] - 10, fJ.aL[1][1] + 6, .9);
    if (t > tGone) { const k = pop(t, tGone); scaled(1640, 530, k, () => text('...?', 1600, 550, { size: 48, w: 600, col: C.mute })); }
    const mP = poseAt([[0, pose({ la: -.45, lb: .2, ra: .45, rb: -.2, head: .2 })], [tSteal, pose({ la: -.45, lb: .2, ra: .55, rb: -2.55, head: -.05 })], [tYum, pose({ la: -.45, lb: .2, ra: .35, rb: -2.85, head: .15 })]], t);
    const mJ = catK({ x: 860, gy, S: 420 }, breathe(mP, t), { wag: .1 * Math.sin(t * 4) });
    if (has) burger(mJ.aR[1][0] + 18, mJ.aR[1][1] + 4, .9, ss(seg(t, tYum, tYum + .15)));
    if (t > tYum) { const k = pop(t, tYum + .05), hx = mJ.Hd[0] + 70, hy = mJ.Hd[1] - 70; scaled(hx, hy, k, () => text('nom', hx, hy, { size: 40, w: 600, col: C.ginger })); }
    // the steal: two frames of speed lines, then nothing
    if (t >= tSteal - .02 && t < tSteal + .12) { const a = [fJ.aL[1][0], fJ.aL[1][1]], b = [mJ.aR[1][0] + 18, mJ.aR[1][1]];
      for (let i = -2; i <= 2; i++) line([[a[0], a[1] + i * 16], [b[0], b[1] + i * 16]], C.ginger, 5); }
    rect(980, dt, 440, 26, C2.woodL); rect(1010, dt + 26, 24, gy - dt - 26, C2.wood); rect(1366, dt + 26, 24, gy - dt - 26, C2.wood);
    shape(() => g.ellipse(1060, dt - 4, 70, 12, 0, 0, Math.PI * 2), C2.white, { lw: 4 });
    for (let i = 0; i < 6; i++) circ(1030 + i * 12, dt - 16 - (i % 2) * 6, 9, C2.leaf, { lw: 2 });   // his salad
    shape(() => g.ellipse(1330, dt - 4, 70, 12, 0, 0, Math.PI * 2), C2.white, { lw: 4 });
    rrect(1196, dt - 70, 30, 70, 6, C.red, { lw: 4 }); rrect(1236, dt - 60, 26, 60, 6, C.wall, { lw: 4 });
    // replay: ghosts dash to the burger and back
    const kr = ein(t, tReplay - .1, .3) * (1 - ein(t, tYum - .2, .3));
    if (kr > 0) { const P = [[900, 560], [1150, 420], [1350, 420], [1450, 560]];
      g.save(); g.globalAlpha = kr; dashedArc(P, 1); g.restore();
      for (const [x, a] of [[1060, .22], [1220, .32], [1380, .42]]) alpha(a * kr, () => catK({ x, gy, S: 420 }, walkP(x * .05, 1), { tail: 0 }));
      g.save(); g.globalAlpha = kr; text('REPLAY · 1000× SLOWER', 1000, 820 - 380, { size: 26, w: 600, col: C.mute, track: 3 }); g.restore(); }
    scr();
    stopwatch(1710, 190, pop(t, tThirty), '0.03 s');
    L('Power 5  ·  Super reflexes', 124, 118, t, s.t0 + .05);
    T('Faster than', 116, 226, { size: 96, w: 600, track: -2 }, t, s.t0 + .2);
    T('your enemy.', 116, 326, { size: 96, w: 600, track: -2, col: C.ginger }, t, s.t0 + .45);
    // reaction-time bars during l28
    const kc = 1 - ein(t, lt('l29') - .3, .3);
    if (kc > 0) { const x0 = 124, y0 = 430, px = 1.6;
      const w1 = 250 * px * ss(seg(t, wt('l28', 'quarter') - .2, wt('l28', 'quarter') + .4)), w2 = 70 * px * ss(seg(t, wt('l28', '20') - .2, wt('l28', '20') + .4));
      g.save(); g.globalAlpha = kc;
      if (w1 > 2) rect(x0 + 90, y0, w1, 40, C.tint, { lw: 4 }); if (w2 > 2) { rect(x0 + 90, y0 + 60, w2, 40, C.ginger, { lw: 4 }); rect(x0 + 90, y0 + 60, Math.min(w2, 20 * px), 40, C.gingerD, { lw: 4 }); }
      text('You', x0, y0 + 30, { size: 28, w: 600, a: ein(t, s.t0 + .6) }); text('Cat', x0, y0 + 90, { size: 28, w: 600, col: C.ginger, a: ein(t, s.t0 + .8) });
      if (w1 > 380) text('250 ms', x0 + 110 + w1, y0 + 30, { size: 28, w: 600 }); if (w2 > 100) text('20–70 ms', x0 + 110 + w2, y0 + 90, { size: 28, w: 600, col: C.ginger });
      g.restore(); }
  };
}

// Dr. Woof: the even-hose figure + floppy grey dog ears and a black eye mask (a costume, not a face)
function villain(f, p) {
  const j = figure(f, p), r = GEO.headR * f.S, sc = clamp(Math.sqrt(f.S / 380), .6, 1.05);
  const up = Math.atan2(j.Hd[1] - j.N[1], j.Hd[0] - j.N[0]);
  for (const sd of [-1, 1]) { const a = up + sd * 1.25, ex = j.Hd[0] + Math.cos(a) * r * .95, ey = j.Hd[1] + Math.sin(a) * r * .95;
    shape(() => { g.ellipse(ex + sd * r * .18, ey + r * .55, r * .32, r * .7, sd * -.25, 0, Math.PI * 2); }, '#8A8F9C', { lw: 6 * sc }); }
  g.save(); g.translate(j.Hd[0], j.Hd[1]); g.rotate(up + Math.PI / 2);
  shape(() => g.roundRect(-r * 1.05, -r * .28, r * 2.1, r * .5, r * .2), C.ink, { lw: 0 });
  for (const sd of [-1, 1]) circ(sd * r * .42, -r * .03, r * .14, C.paper, { lw: 0 });
  g.restore(); return j;
}

// ---- S12: the weakness (red light, no focus) ----
function floorLamp(x, gy, rot) { withRot(x, gy, rot, () => { shape(() => g.ellipse(x, gy - 8, 60, 12, 0, 0, Math.PI * 2), C2.chrome, { lw: 5 }); line([[x, gy - 10], [x, gy - 330]], C.ink, 10); line([[x, gy - 10], [x, gy - 330]], C2.chrome, 4);
  poly([[x - 80, gy - 330], [x + 80, gy - 330], [x + 50, gy - 440], [x - 50, gy - 440]], C.wall); for (const dx of [-40, 0, 40]) dline([[x + dx * .9, gy - 336], [x + dx * .6, gy - 434]], '#D9B65E'); }); }
{ const s = SC.s12, tRed = wt('l31', 'red'), tOn = wt('l32', 'switches'), tWall = wt('l32', 'wall'), tFloor = wt('l32', 'floor'), tLamp = wt('l32', 'lamp'), tFocus = wt('l33', 'focus'), tStare = wt('l33', 'staring'), tCity = wt('l33', 'saving');
  ev(s.t0 + .1, 'title'); ev(tRed, 'sting2'); ev(tOn, 'tick'); ev(tWall, 'jump'); ev(tFloor, 'whoosh'); ev(tLamp + .3, 'crash'); ev(tFocus, 'womp');
  const DOT = [[tOn, 1080, 868], [tWall - .1, 1000, 860], [tWall + .5, 900, 300], [tFloor - .2, 820, 380], [tFloor + .5, 420, 868], [tLamp - .25, 560, 868], [tLamp + .2, 700, 520], [tLamp + 1.2, 900, 430]];
  function dotAt(t) { if (t < DOT[0][0]) return null; for (let i = 1; i < DOT.length; i++) if (t < DOT[i][0]) { const u = ss((t - DOT[i - 1][0]) / (DOT[i][0] - DOT[i - 1][0])); return [lerp(DOT[i - 1][1], DOT[i][1], u), lerp(DOT[i - 1][2], DOT[i][2], u)]; }
    const L0 = DOT[DOT.length - 1]; return [L0[1] + 10 * Math.sin(t * 7), L0[2] + 6 * Math.cos(t * 9)]; }
  FILM.s12 = t => {
    const gy = 880, [sx, sy] = shake(t, tLamp + .3, 10, .3); cam(1, 960, 540, sx, sy);
    rect(124, 150, 1672, 730, '#E9E2F0', { lw: 0 });   // a pale lilac wall
    for (let x = 300; x < 1796; x += 260) dline([[x, 150], [x, 880]], '#D7CDE2');
    rect(1180, 230, 220, 160, C2.wood); rect(1196, 246, 188, 128, C.sky, { lw: DL }); shape(() => { g.moveTo(1230, 330); g.lineTo(1280, 280); g.lineTo(1320, 320); g.lineTo(1350, 300); g.lineTo(1384, 340); g.lineTo(1384, 374); g.lineTo(1196, 374); g.lineTo(1196, 350); g.closePath(); }, C2.leaf, { lw: DL });
    ground(gy, -400, 2400);
    const crashed = ss(seg(t, tLamp + .25, tLamp + .55));
    floorLamp(700, gy, -1.25 * crashed);
    // Dr. Woof with the laser pointer, leaves while you stare
    const vx = lerp(1640, 2150, ss(seg(t, tCity, tCity + 2.2)));
    const vP = t < tOn - .3 ? pose({ la: -.45, lb: .2, ra: .45, rb: -.2 }) : pose({ la: -1.55, lb: -.05, ra: .45, rb: -.2, head: -.1 });
    const vJ = villain({ x: vx, gy, S: 420 }, breathe(vx > 1650 ? walkP(t * 9) : vP, t, 1));
    const d = dotAt(t), hand = vJ.aL[1];
    if (d && t < tCity) { rrect(hand[0] - 26, hand[1] - 7, 34, 14, 5, C2.chrome, { lw: 3 }); g.save(); g.globalAlpha = .45; line([[hand[0] - 26, hand[1]], d], C.red, 3); g.restore(); }
    if (d) { g.save(); g.globalAlpha = .35; circ(d[0], d[1], 22, C.red, { lw: 0 }); g.restore(); circ(d[0], d[1], 10, C.red, { lw: 0 }); }
    // Meow Man follows the dot a beat late, leaps when it climbs
    const dl = dotAt(t - .35); let mx = 1150, lift = 0, P = pose({ la: -.45, lb: .2, ra: .45, rb: -.2, head: .15 });
    if (dl && t < tLamp + .3) { mx = clamp(dl[0], 300, 1500); lift = Math.max(0, (860 - dl[1]) * .55); P = lift > 20 ? pose({ la: -2.5, lb: .3, ra: 2.4, rb: -.3, lfy: .06, rfy: .04, head: -.2 }) : walkP(t * 14, 1); }
    else if (t >= tLamp + .3) { mx = lerp(clamp(dotAt(tLamp - .05)[0], 300, 1500), 780, ss(seg(t, tLamp + .3, tLamp + 1.6))); P = poseAt([[tLamp + .3, pose({ hy: .03, lean: -.1, la: -1.4, ra: 1.4, head: .3 })], [tFocus, pose({ la: -.3, lb: .1, ra: .3, rb: -.1, head: -.35, lean: -.03 })]], t); }
    catK({ x: mx, gy: gy - lift, S: 380 }, breathe(P, t), { wag: .15 * Math.sin(t * 10) });
    if (t > tLamp + .3) { const k = pop(t, tLamp + .3); scaled(640, 470, k, () => text('BONK', 600, 480, { size: 48, w: 600, col: C.red, track: 2 })); }
    scr();
    L('The weakness', 124, 118, t, s.t0 + .05);
    T('Every hero has', 116, 226, { size: 96, w: 600, track: -2 }, t, s.t0 + .2);
    T('one: red light.', 116, 326, { size: 96, w: 600, track: -2, col: C.red }, t, tRed - .1);
    // focus meter
    const kf = ein(t, tOn, .4); if (kf > 0) { const f = 1 - ss(seg(t, tOn + .5, tStare + .5)), x0 = 124, y0 = 400; g.save(); g.globalAlpha = kf;
      label('Focus', x0, y0, {}); rect(x0, y0 + 16, 340, 30, C2.white, { lw: 4 }); if (f > .01) rect(x0, y0 + 16, 340 * f, 30, f > .5 ? C.ginger : C.red, { lw: 0 }); rect(x0, y0 + 16, 340, 30, null, { lw: 4 });
      text(Math.round(f * 100) + '%', x0 + 360, y0 + 42, { size: 28, w: 600, col: f > .5 ? C.ink : C.red }); g.restore(); }
  };
}

// ---- S6: things on edges ----
{ const s = SC.s6, tSwap = lt('l19') - .1, tLook = wt('l19', 'look'), tLooksAt = wt('l19', 'looks'), tPush = le('l19') + .25, tFall = tPush + .35, tCrash = tFall + .55;
  ev(s.t0 + .1, 'title'); ev(tSwap, 'title'); ev(tLooksAt, 'blink'); ev(tPush, 'tick'); ev(tFall, 'whoosh'); ev(tCrash, 'crash'); ev(tCrash + .1, 'sting2');
  FILM.s6 = t => {
    const gy = 880, dt = 620, [sx, sy] = shake(t, tCrash, 10, .3);
    cam(1 + .06 * ss(seg(t, tLook, tPush)), lerp(960, 1350, ss(seg(t, tLook, tPush))), lerp(540, 520, ss(seg(t, tLook, tPush))), sx, sy);
    rect(140, 420, 330, 300, C.sky); for (const [x, w, h] of [[160, 60, 150], [230, 80, 210], [320, 50, 120], [380, 70, 180]]) { rect(x, 720 - h, w, h, C2.cityL, { lw: DL }); for (let yy = 720 - h + 16; yy < 700; yy += 30) for (let xx = x + 10; xx < x + w - 14; xx += 22) rect(xx, yy, 10, 14, C.winY, { lw: 0 }); }
    rect(140, 420, 330, 300, null); dline([[305, 420], [305, 720]]); rect(126, 720, 358, 14, C2.white, { lw: 4 });
    ground(gy, -400, 2400);
    const P = poseAt([[0, pose({ la: -.4, lb: .25, ra: .4, rb: -.25, head: .0 })], [tLook, pose({ la: -.4, lb: .25, ra: .4, rb: -.25, head: .35, lean: .04 })], [tPush - .25, pose({ ra: 1.62, rb: .02, la: -.4, lb: .25, head: .3, lean: .05 })], [tCrash + .4, pose({ ra: .5, rb: -.2, la: -.4, lb: .25, head: -.1, lean: 0 })]], t);
    catK({ x: 1300, gy, S: 440 }, breathe(P, t), { wag: .08 * Math.sin(t * 3) });
    rect(600, dt, 920, 32, C2.woodL); rect(630, dt + 32, 30, gy - dt - 32, C2.wood); rect(1470, dt + 32, 30, gy - dt - 32, C2.wood);
    rect(1150, dt + 32, 300, 170, C2.woodL); dline([[1150, dt + 90], [1450, dt + 90]]); dline([[1150, dt + 148], [1450, dt + 148]]);
    for (const y of [dt + 62, dt + 120, dt + 176]) rrect(1270, y - 5, 60, 10, 5, C2.chrome, { lw: DL });
    rect(700, dt - 250, 330, 210, C.ink, { lw: 0 }); rect(714, dt - 236, 302, 182, C.screen, { lw: 0 });
    for (let r = 0; r < 6; r++) for (let c = 0; c < 4; c++) rect(724 + c * 72, dt - 226 + r * 28, 66, 22, r === 0 ? C.sky : C2.white, { lw: 2 });
    poly([[845, dt - 40], [885, dt - 40], [900, dt], [830, dt]], C2.chrome);
    rrect(760, dt - 22, 230, 18, 4, C2.white, { lw: 4 }); for (let i = 0; i < 10; i++) dline([[772 + i * 21, dt - 14], [784 + i * 21, dt - 14]]);
    rrect(1010, dt - 18, 34, 16, 8, C2.white, { lw: 4 }); for (let i = 0; i < 4; i++) rect(1060 + i * 3, dt - 12 - i * 8, 110, 8, C2.white, { lw: DL });
    poly([[620, dt], [680, dt], [690, dt - 60], [610, dt - 60]], C2.bowl);
    for (const [a, l] of [[-.5, 90], [-.15, 110], [.25, 100], [.6, 80]]) shape(() => { const x0 = 650, y0 = dt - 60, x1 = x0 + Math.sin(a) * l, y1 = y0 - Math.cos(a) * l; g.moveTo(x0, y0); g.quadraticCurveTo(x1 - 24, (y0 + y1) / 2, x1, y1); g.quadraticCurveTo(x1 + 24, (y0 + y1) / 2, x0, y0); }, C2.leaf, { lw: 4 });
    // the mug: sits on the edge, looks back, tips, falls, breaks
    const mug = (x, y, r, eyes) => withRot(x, y, r, () => { rrect(x - 32, y - 74, 64, 74, 8, C2.white); g.save(); g.strokeStyle = C.ink; g.lineWidth = 6; g.beginPath(); g.arc(x + 36, y - 37, 18, -Math.PI / 2, Math.PI / 2); g.stroke(); g.restore();
      text('BOSS', x, y - 22, { size: 16, w: 600, align: 'center', track: 1 }); if (eyes) { circ(x - 12, y - 52, 4, C.ink, { lw: 0 }); circ(x + 12, y - 52, 4, C.ink, { lw: 0 }); } });
    if (t < tFall) { const tip = .25 * ss(seg(t, tPush, tFall)); mug(1490, dt, tip, t > tLooksAt && t < tPush); }
    else if (t < tCrash) { const u = (t - tFall) / (tCrash - tFall); mug(lerp(1500, 1580, u), lerp(dt, gy, u * u), .25 + u * 2.2, false); }
    else { const k = pop(t, tCrash); for (const [dx, dy, r] of [[-60, -8, .4], [-10, -14, -.9], [40, -6, 1.6], [80, -10, .3]]) withRot(1580 + dx * k, gy + dy, r, () => poly([[1580 + dx * k - 14, gy + dy], [1580 + dx * k + 10, gy + dy - 16], [1580 + dx * k + 16, gy + dy + 2]], C2.white, { lw: 4 }));
      scaled(1580, gy, k, () => shape(() => g.ellipse(1580, gy - 4, 90, 12, 0, 0, Math.PI * 2), C2.coffee, { lw: DL })); }
    const bossP = poseAt([[0, pose({ la: -.4, lb: .2, ra: .4, rb: -.2 })], [tFall, pose({ la: -2.5, lb: -.2, ra: 2.5, rb: .2, head: -.1, lean: -.05 })]], t);
    figure({ x: 1730, gy, S: 420 }, breathe(bossP, t, 1));
    if (t > tFall) { const k = pop(t, tFall); scaled(1730, 440, k, () => text('NOOO', 1650, 450, { size: 52, w: 600, col: C.red, track: 2 })); }
    scr();
    L('Cat habits', 124, 118, t, s.t0 + .05, tSwap);
    T('Cat powers come', 116, 226, { size: 96, w: 600, track: -2 }, t, s.t0 + .2, tSwap);
    T('with cat habits.', 116, 326, { size: 96, w: 600, track: -2, col: C.ginger }, t, wt('l18', 'habits') - .2, tSwap);
    L('Habit 1', 124, 118, t, tSwap + .1);
    T('Things on edges', 116, 226, { size: 96, w: 600, track: -2 }, t, tSwap + .2);
    T('must fall.', 116, 326, { size: 96, w: 600, track: -2, col: C.red }, t, wt('l19', 'fall') - .1);
  };
}

// ---- S10: can't taste sweet ----
function cake(x, y, k, t) { scaled(x, y, k, () => {
  rrect(x - 170, y - 8, 340, 16, 8, C2.white); rect(x - 130, y - 150, 260, 142, C.pink); rect(x - 130, y - 100, 260, 18, C2.white, { lw: DL });
  shape(() => { g.moveTo(x - 136, y - 150); for (let i = 0; i <= 8; i++) { const xx = x - 136 + i * 34; g.quadraticCurveTo(xx + 17, y - 112, xx + 34, y - 150); } g.lineTo(x + 136, y - 168); g.lineTo(x - 136, y - 168); g.closePath(); }, C2.white);
  for (let i = 0; i < 4; i++) { const cx = x - 75 + i * 50; rect(cx - 6, y - 220, 12, 52, i % 2 ? C.sky : C.wall, { lw: 3 });
    const fl = 1 + .12 * Math.sin(t * 13 + i * 2); shape(() => { g.moveTo(cx, y - 222 - 26 * fl); g.quadraticCurveTo(cx + 12, y - 230, cx, y - 222); g.quadraticCurveTo(cx - 12, y - 230, cx, y - 222 - 26 * fl); }, C.wall, { lw: 3 }); } }); }
function bread(x, y, k) { scaled(x, y, k, () => { shape(() => { g.moveTo(x - 60, y); g.lineTo(x - 60, y - 70); g.arc(x - 30, y - 80, 34, Math.PI, Math.PI * 1.9); g.arc(x + 30, y - 80, 34, Math.PI * 1.1, 0); g.lineTo(x + 60, y); g.closePath(); }, '#EBC98E');
  for (const [dx, dy] of [[-30, -40], [10, -60], [30, -30], [-10, -20]]) circ(x + dx, y + dy, 4, '#C99A62', { lw: 0 });
  for (const dx of [-30, 0, 30]) line([[x + dx, y + 8], [x + dx - 4, y + 26]], C.sky, 4); }); }
{ const s = SC.s10, tGene = wt('l21', 'gene'), tCake = wt('l21', 'birthday'), tBread = wt('l21', 'wet');
  ev(s.t0 + .1, 'title'); ev(tCake, 'pop'); ev(tBread, 'womp');
  FILM.s10 = t => {
    cam(1 + .04 * seg(t, s.t0, s.t1), 1200, 560);
    const gy = 880; ground(gy, -400, 2400);
    rect(820, 700, 760, 30, C2.woodL); rect(860, 730, 30, 150, C2.wood); rect(1510, 730, 30, 150, C2.wood);
    cake(1020, 700, pop(t, tCake - .2), t);
    rrect(1240, 690, 150, 12, 6, C2.white); if (t < tBread) { scaled(1315, 690, pop(t, tCake + .2), () => poly([[1270, 690], [1360, 690], [1300, 640]], C.pink)); } else bread(1315, 690, pop(t, tBread));
    if (t > tBread) { const k = pop(t, tBread + .15); scaled(1460, 600, k, () => text('= wet bread', 1400, 610, { size: 34, w: 600, col: C.mute })); }
    catK({ x: 1660, gy, S: 400, face: -1 }, breathe(poseAt([[0, pose({ la: -.4, lb: .2, ra: .4, rb: -.2 })], [tCake, pose({ la: -1.35, lb: .3, ra: .4, rb: -.2, head: -.15 })], [tBread + .3, pose({ la: -.4, lb: .2, ra: .4, rb: -.2, head: .3 })]], t), t), {});
    scr();
    L('Habit 2', 124, 118, t, s.t0 + .05);
    T('Cats can’t', 116, 226, { size: 96, w: 600, track: -2 }, t, s.t0 + .2);
    T('taste sweet.', 116, 326, { size: 96, w: 600, track: -2, col: C.red }, t, wt('l21', 'sweet') - .2);
    T('The sweet-taste gene is broken.', 122, 392, { size: 36, w: 400, col: C.mute }, t, tGene - .2);
  };
}

// ---- S7: sleep ----
function zzzA(x, y, t, k = 1) { for (let i = 0; i < 3; i++) { const u = (t * .45 + i / 3) % 1; text(i === 2 ? 'Z' : 'z', x + u * 70 * k, y - u * 120 * k, { size: (34 + u * 30) * k, w: 600, col: C.mute, a: Math.sin(Math.PI * u) }); } }
{ const s = SC.s7, tTV = wt('l24', 'city'), tBox = wt('l24', 'box');
  ev(s.t0 + .1, 'title'); ev(tTV, 'tvon'); ev(tBox, 'tick');
  FILM.s7 = t => {
    const gy = 880; cam(lerp(1, 1.08, ss(seg(t, tTV - .3, tTV + 1.4))), lerp(960, 1220, ss(seg(t, tTV - .3, tTV + 1.4))), lerp(540, 560, ss(seg(t, tTV - .3, tTV + 1.4))));
    rect(640, 430, 170, 130, C.sky); dline([[725, 430], [725, 560]]); dline([[640, 495], [810, 495]]); rect(628, 560, 194, 12, C2.white, { lw: 4 });
    poly([[650, 572], [810, 572], [600, gy], [290, gy]], C.sun, { lw: 0 });
    ground(gy, -400, 2400);
    const bx = 330, bw = 300, bt = box(bx, gy, bw, 190);
    peek(bx + bw * .42, bt, 330, { tilt: .18 + .04 * Math.sin(t * .8) });
    const wag = Math.sin(t * 1.6) * 20;
    for (const [c, w] of [[C.ink, 23], [C.ginger, 14]]) { g.save(); g.strokeStyle = c; g.lineWidth = w; g.lineCap = 'round'; g.beginPath(); g.moveTo(bx + bw - 30, bt + 2); g.bezierCurveTo(bx + bw + 40, bt - 40, bx + bw + 70, bt + 30 + wag, bx + bw + 110, bt - 20 + wag); g.stroke(); g.restore(); }
    zzzA(bx + bw * .42 + 60, bt - 50, t, .9);
    // clock: 16 of 24 hours shaded
    { const k = pop(t, wt('l22', '12') - .2) * (1 - ein(t, tTV - .2, .4)), cx = 920, cy = 300; scaled(cx, cy, k, () => { circ(cx, cy, 90, C2.white, { lw: 6 });
      const a = ss(seg(t, wt('l22', '12'), wt('l22', '16') + .6)) * (16 / 24) * Math.PI * 2; shape(() => { g.moveTo(cx, cy); g.arc(cx, cy, 84, -Math.PI / 2, -Math.PI / 2 + a); g.closePath(); }, C.red, { lw: 0 });
      for (let i = 0; i < 12; i++) { const aa = i / 12 * Math.PI * 2; dline([[cx + Math.sin(aa) * 72, cy - Math.cos(aa) * 72], [cx + Math.sin(aa) * 84, cy - Math.cos(aa) * 84]]); }
      text('24 h', cx, cy + 128, { size: 24, w: 600, col: C.mute, align: 'center' }); }); }
    const tx = 1000, ty = 330, tw = 720, th = 470;
    line([[tx + 120, ty + th], [tx + 90, gy]], C.ink, 8); line([[tx + tw - 120, ty + th], [tx + tw - 90, gy]], C.ink, 8);
    rrect(tx, ty, tw, th, 14, C.ink, { lw: 0 }); for (let i = 0; i < 3; i++) circ(tx + tw - 60 - i * 26, ty + th - 19, 6, C2.chrome, { lw: 0 });
    const on = ss(seg(t, tTV, tTV + .25));
    rect(tx + 22, ty + 22, tw - 44, th - 60, '#2A3040', { lw: 0 });
    if (on > 0) { g.save(); g.beginPath(); const hh = (th - 60) * on; g.rect(tx + 22, ty + 22 + (th - 60 - hh) / 2, tw - 44, hh); g.clip();
      rect(tx + 22, ty + 22, tw - 44, th - 60, C.screen, { lw: 0 });
      for (const [x, w, h] of [[tx + 40, 80, 180], [tx + 130, 60, 240], [tx + 200, 90, 150], [tx + 420, 70, 210], [tx + 500, 100, 160], [tx + 610, 80, 230]]) rect(x, ty + th - 150 - h, w, h + 20, '#B4CFDD', { lw: 2, col: '#8FB0C2' });
      rect(tx + 22, ty + th - 150, tw - 44, 112, C.red, { lw: 0 }); rect(tx + 22, ty + th - 150, 170, 36, C.ink, { lw: 0 });
      text('BREAKING', tx + 38, ty + th - 123, { size: 22, w: 600, col: C2.white, track: 2 });
      const A = figure({ x: tx + 200, gy: ty + th - 30, S: 330 }, breathe(pose({ ra: .75, rb: 2.15, la: -.4 + .15 * Math.sin(t * 4), lb: .2, head: .1 }), t * 2));
      const hn = A.aR[1]; line([[hn[0], hn[1] + 10], [hn[0] + 6, hn[1] - 30]], C.ink, 7); circ(hn[0] + 8, hn[1] - 42, 15, C.ink, { lw: 0 });
      text('LIVE', tx + 44, ty + 72, { size: 30, w: 600, col: C.red, track: 3 });
      text('CITY NEEDS MEOW MAN', tx + 330, ty + th - 90, { size: 27, w: 600, col: C2.white, track: 1 });
      if (t > tBox) text('HE IS IN A BOX', tx + 330, ty + th - 52, { size: 27, w: 600, col: C2.white, track: 1 });
      text('"We have tried shaking', tx + 360, ty + 110, { size: 30, w: 500, a: ein(t, tTV + .8) }); text('a bag of treats."', tx + 360, ty + 150, { size: 30, w: 500, a: ein(t, tTV + 1) });
      g.restore(); }
    scr();
    L('The catch', 124, 118, t, s.t0 + .05);
    T('Cats sleep', 116, 224, { size: 96, w: 600, track: -2 }, t, s.t0 + .2, tTV + .1);
    T('12–16 hours', 116, 328, { size: 96, w: 600, track: -2, col: C.red }, t, wt('l22', '12') - .1, tTV + .1);
    T('a day. So do you now.', 122, 392, { size: 40, w: 400, col: C.mute }, t, wt('l22', 'so') - .1, tTV + .1);
    T('Awake: 8 h. Hero shift: 8 h.', 122, 448, { size: 32, w: 600, col: C.ink }, t, lt('l23') + .2, tTV - .2);
  };
}

// ---- S8: ending ----
{ const s = SC.s8, tAm = wt('l27', 'amazing'), tTer = wt('l27', 'terrible'), tNext = wt('l27', 'next');
  ev(s.t0 + .1, 'title'); ev(tAm, 'tick'); ev(tTer, 'blink'); ev(tNext, 'end');
  FILM.s8 = t => {
    const gy = 880; cam(lerp(1.05, 1, ss(seg(t, s.t0, tNext))), 1100, 600);
    ground(gy, -400, 2400);
    poly([[1180, 520], [1340, 520], [1460, gy], [1060, gy]], C.sun, { lw: 0 });
    const bx = 1110, bw = 300, bt = box(bx, gy, bw, 190);
    peek(bx + bw * .42, bt, 330, { tilt: .2 + .04 * Math.sin(t * .8) });
    for (const [c, w] of [[C.ink, 23], [C.ginger, 14]]) { g.save(); g.strokeStyle = c; g.lineWidth = w; g.lineCap = 'round'; g.beginPath(); g.moveTo(bx + bw - 30, bt + 2); g.bezierCurveTo(bx + bw + 40, bt - 40, bx + bw + 70, bt + 30 + Math.sin(t * 1.6) * 20, bx + bw + 110, bt - 20 + Math.sin(t * 1.6) * 20); g.stroke(); g.restore(); }
    zzzA(bx + bw * .42 + 60, bt - 50, t, .9);
    scr();
    L('So, being a cat superhero?', 124, 118, t, s.t0 + .1);
    T('Amazing powers.', 116, 226, { size: 96, w: 600, track: -2, col: C.ginger }, t, tAm - .1);
    T('Terrible schedule.', 116, 326, { size: 96, w: 600, track: -2, col: C.red }, t, tTer - .1);
    const ke = ein(t, tNext - .2, .5); if (ke > 0) { g.save(); g.globalAlpha = ke * .94; g.fillStyle = C.paper; g.fillRect(0, 0, W, H); g.restore();
      T('Next time', 124, 430, { size: 22, w: 500, col: C.mute, track: 3 }, t, tNext);
      T('What if a dog', 116, 540, { size: 104, w: 600, track: -2 }, t, tNext + .1);
      T('licked you?', 116, 650, { size: 104, w: 600, track: -2, col: C.blue }, t, tNext + .3); }
  };
}

// ---------- subtitles (screen space, from the voice) ----------
function drawSubs(t) { const q = TLS.cues.find(c => t >= c.t0 && t < c.t1); if (!q) return; const k = ein(t, q.t0, .12) * (1 - ein(t, q.t1 - .12, .12));
  // paper wash behind for legibility on busy frames
  g.save(); g.globalAlpha = k; g.fillStyle = C.ginger; g.fillRect(124, 968, 4, 46); g.restore();
  const n = TXT ? TXT.length : 0; text(q.text, 146, 1003, { size: 36, w: 500, a: k }); if (TXT && TXT.length > n) TXT[TXT.length - 1].pass = true; }

// ================= page contract =================
window.EV = EV.sort((a, b) => a.t - b.t);
window.DUR = DUR;
window.render = t => {
  scr(); paper();
  const s = TLS.scenes.find(x => t >= x.t0 && t < x.t1) || TLS.scenes[TLS.scenes.length - 1];
  g.save(); FILM[s.id](t); g.restore(); scr();
  drawSubs(t);
};
window.TEXTS = t => { TXT = []; window.render(t); const r = TXT; TXT = null; return r; };
const QS2 = new URLSearchParams(location.search);
if (QS2.get('from')) { const F = +QS2.get('from'); const r0 = window.render; window.render = t => r0(F + t); window.DUR = +(QS2.get('to') ?? DUR) - F; }
document.fonts.load(`600 40px ${EN}`).then(() => Promise.all([document.fonts.load(`500 40px ${EN}`), document.fonts.load(`400 40px ${EN}`)])).then(() => { window.render(0); window.READY = true; });
