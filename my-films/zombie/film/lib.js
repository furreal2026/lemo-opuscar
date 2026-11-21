// "What if you became a zombie… but never lost your mind?" — shared toolkit: timing, motion, camera, people, light.
const TLS = window.TL, DUR = TLS.dur, LN = TLS.lines;
const SCX = Object.fromEntries(TLS.scenes.map(s => [s.id, s]));
const GY = 880;

// ---------- motion ----------
const ein = (t, a, d = .4) => ss(seg(t, a, a + d));
const eout = (t, a, d = .4) => 1 - ss(seg(t, a, a + d));
function sp(x, w = 11, z = .6) { if (x <= 0) return 0; const wd = w * Math.sqrt(1 - z * z); return 1 - Math.exp(-z * w * x) * (Math.cos(wd * x) + z * w / wd * Math.sin(wd * x)); }
const pop = (t, a) => sp(t - a, 17, .45);
function lerpPose(a, b, s) { const o = {}; for (const k of KEYS) o[k] = a[k] + (b[k] - a[k]) * s; return o; }
function poseAt(keys, t, w = 11, z = .6) { let p = { ...keys[0][1] }; for (let i = 1; i < keys.length; i++) { const s = sp(t - keys[i][0], keys[i][2] ?? w, z); if (s > 0) p = lerpPose(p, keys[i][1], s); } return p; }
// jerky pose change (the infected body): snaps in steps instead of a spring
function poseJerk(keys, t) { let p = { ...keys[0][1] }; for (let i = 1; i < keys.length; i++) { const u = t - keys[i][0]; if (u > 0) { const s = Math.min(1, Math.floor(u * 14) / 4); p = lerpPose(p, keys[i][1], s * (1 + .12 * Math.sin(u * 40) * Math.exp(-u * 6))); } } return p; }
function walkP(ph, k = 1) { const p = rest(), A = .07 * k;
  p.lfx = A * Math.sin(ph); p.rfx = -A * Math.sin(ph); p.lfy = .045 * k * Math.max(0, Math.cos(ph)); p.rfy = .045 * k * Math.max(0, -Math.cos(ph));
  p.hy = .012 + .012 * Math.abs(Math.cos(ph)); p.lean = .06 * k; p.head = .04; p.la = -.7 * k * Math.sin(ph) - .3; p.lb = .5; p.ra = .7 * k * Math.sin(ph) + .3; p.rb = -.5; return p; }
// a dragging, uneven gait: one leg drags, one shoulder low, arms hang
function dragP(ph, k = 1) { const p = walkP(ph, k * .7); p.rfy *= .2; p.rfx *= .5; p.lean = .12 * k; p.head = .22 * k + .05 * Math.sin(ph * .5); p.ra = .25; p.rb = -.1; p.la = -.35 - .15 * Math.sin(ph); p.lb = .15; p.hy += .02 * k * Math.max(0, Math.sin(ph)); return p; }
function breathe(p, t, ph = 0, k = 1) { const q = { ...p }; q.hy += .004 * k * Math.sin(t * 2.1 + ph); q.head += .015 * k * Math.sin(t * 1.3 + ph); return q; }
function tremble(p, t, k = 1) { const q = { ...p }; q.lb += .05 * k * Math.sin(t * 47); q.rb += .05 * k * Math.sin(t * 53 + 1); q.hx += .002 * k * Math.sin(t * 61); return q; }
function twitchP(p, t, k = 1, seed = 1) { const f = Math.floor(t * 24), h = hash1(f * 13 + seed); if (h > 1 - .08 * k) { const q = { ...p }; q.ra += (hash1(f + 3) - .5) * .5 * k; q.head += (hash1(f + 7) - .5) * .4 * k; q.la += (hash1(f + 5) - .5) * .4 * k; return q; } return p; }
const P = o => pose(o);
const PS = {
  stand: () => P({}),
  hang: () => P({ la: -.25, lb: .1, ra: .25, rb: -.1 }),
  sad: () => P({ la: -.18, lb: .08, ra: .18, rb: -.08, head: .32, hy: .015, bend: .02 }),
  up: () => P({ la: -2.6, lb: -.3, ra: 2.6, rb: .3, head: -.05 }),
  scratch: () => P({ ra: 2.55, rb: 1.5, la: -.4, lb: .2, head: .25 }),
  shrug: () => P({ la: -1.2, lb: -1.3, ra: 1.2, rb: 1.3, head: .15 }),
  cover: () => P({ la: -2.2, lb: -1.9, ra: 2.2, rb: 1.9, head: .1, hy: .01 }),
  fear: () => P({ la: -1.0, lb: -1.6, ra: 1.0, rb: 1.6, lean: -.1, head: -.12, hy: .02 }),
  wave: () => P({ ra: 2.5, rb: .4, la: -.4, lb: .2 }),
  point: () => P({ ra: 1.55, rb: .02, la: -.4, lb: .2 }),
  reach: () => P({ ra: 1.25, rb: .15, la: -.35, lb: .2, lean: .12 }),
  claw: () => P({ la: -1.7, lb: -.25, ra: 1.7, rb: .25, lean: .08, head: .1 }),
  kneel: () => P({ hy: .2, la: -.3, lb: .1, ra: .3, rb: -.1, head: .35, lean: .05 }),
  sit: () => P({ hy: .2, lfx: .14, rfx: .2, la: -.5, lb: .4, ra: .5, rb: -.4 }),
  hug: () => P({ hy: .24, lfx: .1, rfx: .14, la: .4, lb: -1.2, ra: .9, rb: -1.6, head: .45, lean: .25 }),
  phone: () => P({ ra: .55, rb: -1.95, la: -.4, lb: .2, head: .2 }),
  phoneEar: () => P({ ra: 2.35, rb: 1.55, la: -.4, lb: .2, head: .2 }),
  grabWrist: () => P({ ra: 1.3, rb: .2, la: .2, lb: -1.25, lean: .05 }),
};

// ---------- scene registry & events ----------
const FILM = {}, EV = [];
let CUR = null;
function S(id, fn, evs = []) { const s = SCX[id]; FILM[id] = T => { const t = T - s.t0, d = s.t1 - s.t0; CUR = { id, t0: s.t0, d }; fn(t, d, T); }; for (const e of evs) EV.push({ t: +(s.t0 + e[0]).toFixed(3), type: e[1], ...(e[2] || {}) }); }
const LT = id => LN[id].t - SCX[LN[id].scene].t0;          // a line's start, local to its scene
const LE = id => LT(id) + LN[id].dur;
function WT(id, w, n = 1) { const ws = LN[id].words; let k = 0; for (const x of ws) if (x[0].toLowerCase().replace(/[^a-z0-9.,]/g, '').startsWith(w.toLowerCase()) && ++k === n) return x[1] - SCX[LN[id].scene].t0; return LT(id); }

// ---------- camera (the style's two-finger gesture per scene) ----------
let GEST = { z: 1, r: 0 }, CAMP = [1, W / 2, H / 2, 0, 0];
const gease = u => { u = clamp(u); const a = u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2, b = 1 - Math.pow(1 - u, 3); return .45 * a + .55 * b; };
function gestureAt(T) { const i = TLS.scenes.findIndex(x => T >= x.t0 && T < x.t1), sc = TLS.scenes[Math.max(0, i)], sg = i % 2 ? 1 : -1, u = gease((T - sc.t0) / .85);
  const drift = seg(T, sc.t0 + .85, sc.t1);
  return { z: lerp(1.06, 1, u) * (1 + .012 * drift), r: (sg * lerp(2.0, .6, u) - sg * .4 * drift) * Math.PI / 180 }; }
function cam(z = 1, cx = W / 2, cy = H / 2, sx = 0, sy = 0) { CAMP = [z, cx, cy, sx, sy]; z *= GEST.z; const c = Math.cos(GEST.r) * z, sn = Math.sin(GEST.r) * z;
  g.setTransform(c, sn, -sn, c, W / 2 + sx - (c * cx - sn * cy), H / 2 + sy - (sn * cx + c * cy)); }
const recam = () => cam(...CAMP);
function scr() { g.setTransform(1, 0, 0, 1, 0, 0); }
function shake(t, a, amp = 10, d = .3) { const u = t - a; if (u < 0 || u > d) return [0, 0]; const k = (1 - u / d) * amp; return [Math.sin(u * 83) * k, Math.cos(u * 71) * k]; }
function sway(t, amp = 3, f = .9) { return amp * Math.sin(t * f * 2 * Math.PI) * Math.PI / 180; }   // dizziness tilt (radians)
function camTilt(z, cx, cy, rot, sx = 0, sy = 0) { const r0 = GEST.r; GEST.r += rot; cam(z, cx, cy, sx, sy); GEST.r = r0; CAMP.rot = rot; }

// ---------- text ----------
function Tx(s, x, y, o, t, a, out = 1e9) { const k = ein(t, a, .4) * (1 - ein(t, out - .3, .3)); if (k <= 0) return; text(s, x, y + (1 - k) * 18, { ...o, a: k * (o.a ?? 1) }); }
function Lb(s, x, y, t, a, out, o = {}) { const k = ein(t, a, .4) * (1 - ein(t, (out ?? 1e9) - .3, .3)); if (k <= 0) return; label(s, x, y + (1 - k) * 12, { a: k, ...o }); }
function stamp(s, x, y, t, a = .2) { Lb(s, 124, 118, t, a); }               // time stamp label, top-left
function pointer(s, x, y, tx, ty, t, a, out) { const k = ein(t, a, .4) * (1 - ein(t, (out ?? 1e9) - .3, .3)); if (k <= 0) return; g.save(); g.globalAlpha = k; label(s, x, y); line([[x + 30, y + 12], [tx, ty]], C.mute, 3); arrowHead(tx, ty, Math.atan2(ty - y - 12, tx - x - 30), 12, C.mute, 3); g.restore(); }
function scaled(x, y, k, fn) { if (k <= 0.001) return; g.save(); g.translate(x, y); g.scale(k, k); g.translate(-x, -y); fn(); g.restore(); }
function popText(s, x, y, t, a, o = {}, out = 1e9) { const k = pop(t, a) * (1 - ein(t, out - .25, .25)); if (k <= 0) return; scaled(x, y, k, () => text(s, x, y, { size: 44, w: 600, ...o })); }
// a speech bubble: rounded box, tail toward (hx,hy)
function bubble(s, x, y, hx, hy, t, a, out = 1e9, o = {}) { const k = pop(t, a) * (1 - ein(t, out - .2, .2)); if (k <= 0) return;
  g.save(); g.font = `600 ${o.size || 34}px ${EN}`; const w = g.measureText(s).width + 48, h = (o.size || 34) + 34; g.restore();
  scaled(hx, hy, k, () => { shape(() => { g.roundRect(x, y - h, w, h, 22); }, o.fill || C2.white, { lw: 5 });
    poly([[x + 30, y - 4], [x + 64, y - 4], [hx, hy]], o.fill || C2.white, { lw: 0 }); line([[x + 30, y - 1], [hx, hy], [x + 64, y - 1]], C.ink, 5);
    text(s, x + 24, y - 17, { size: o.size || 34, w: 600, col: o.col || C.ink }); }); }
// a warped, cracked word (the infected voice)
function warpText(s, x, y, t, a, o = {}) { const k = ein(t, a, .15); if (k <= 0) return; let cx = x;
  for (let i = 0; i < s.length; i++) { const ch = s[i], j = Math.sin(t * 31 + i * 2.3) * 5 * (o.amp ?? 1); g.save(); g.translate(cx, y + j); g.rotate(Math.sin(t * 17 + i) * .12 * (o.amp ?? 1)); text(ch, 0, 0, { size: o.size || 44, w: 600, col: o.col || C.ink, a: k }); g.restore();
    g.save(); g.font = `600 ${o.size || 44}px ${EN}`; cx += g.measureText(ch).width + 2; g.restore(); } }

// ---------- people ----------
const HOOD = '#9A968E', HOODD = '#7E7A73', VEIN = C.ginger;
// the hero: f = {x, gy, S, prof, face}; o = {veins 0..1, stalks 0..1, hood 0..1, claw 0..1, glow 0..1, arms: 'L'|'R'|'both' veins on arms}
function hero(f, p, o = {}) {
  RAW++;
  try {
    const S = f.S, j0 = joints(f, p), r = GEO.headR * S, sc = clamp(Math.sqrt(S / 380), .6, 1.05);
    const up = Math.atan2(j0.Hd[1] - j0.N[1], j0.Hd[0] - j0.N[0]), back = -(f.face || 1);
    if (o.hood) { const hr = r * 1.32; g.save(); g.globalAlpha = clamp(o.hood); shape(() => { g.arc(j0.Hd[0], j0.Hd[1] + r * .05, hr, 0, Math.PI * 2); }, HOOD, { lw: 7 * sc }); g.restore(); }
    if (o.stalks > 0.01) stalks(j0, r, up, back, o.stalks, sc, f.seed || 1);
    const j = figure({ ...f, col: f.col || C.ink }, p);
    if (o.hood) { for (const s of [-1, 1]) line([[j.N[0] + s * r * .3, j.N[1] - r * .1], [j.N[0] + s * r * .34, j.N[1] + r * .7]], HOODD, 4 * sc); }
    if (o.veins > 0.01) veins(j, r, up, o, sc, f);
    if (o.claw > 0.01) for (const [El, Hn] of [j.aL, j.aR]) { const a = Math.atan2(Hn[1] - El[1], Hn[0] - El[0]); for (const d of [-.6, 0, .6]) line([Hn, [Hn[0] + Math.cos(a + d) * 22 * sc * o.claw, Hn[1] + Math.sin(a + d) * 22 * sc * o.claw]], C.ink, 6 * sc); }
    return j;
  } finally { RAW--; }
}
function stalks(j, r, up, back, k, sc, seed) {
  const rr = mulberry(seed * 17 + 3);
  for (let i = 0; i < 4; i++) {
    const a = up + back * (.5 + i * .32) + (rr() - .5) * .2, L = r * (.55 + rr() * .5) * k;
    const b = [j.Hd[0] + Math.cos(a) * r * .9, j.Hd[1] + Math.sin(a) * r * .9], e = [b[0] + Math.cos(a - back * .25) * L, b[1] + Math.sin(a - back * .25) * L];
    line([b, e], C.ink, 9 * sc); line([b, e], VEIN, 4.5 * sc); circ(e[0], e[1], 7 * sc * (.4 + .6 * k), VEIN, { lw: 3 * sc });
  }
}
function veins(j, r, up, o, sc, f) {
  const k = o.veins, col = VEIN, lw = 3.2 * sc;
  g.save(); if (o.glow) { g.shadowColor = 'rgba(0,0,0,0)'; }
  // neck: two branching lines rising from the neck into the head
  const N = j.N; const nk = [[N[0] - r * .25, N[1] + r * .5], [N[0] - r * .15, N[1] - r * .2], [N[0] - r * .3, N[1] - r * .55]];
  const part = (Pts, u) => { const n = Pts.length - 1, s = u * n, i = Math.floor(s); if (u <= 0) return null; const out = Pts.slice(0, i + 1); if (i < n) out.push([lerp(Pts[i][0], Pts[i + 1][0], s - i), lerp(Pts[i][1], Pts[i + 1][1], s - i)]); return out; };
  const draw = (Pts, u) => { const q = part(Pts, clamp(u)); if (q && q.length > 1) ink(q, { w: lw, col, ta: .05, tb: .5, amp: .5 }); };
  draw(nk, k * 2.2); draw([[N[0] + r * .2, N[1] + r * .4], [N[0] + r * .28, N[1] - r * .1], [N[0] + r * .45, N[1] - r * .4]], k * 2.2 - .3);
  // head: veins inside the disc
  if (k > .35) { g.save(); g.beginPath(); g.arc(j.Hd[0], j.Hd[1], r * .92, 0, Math.PI * 2); g.clip(); const u = (k - .35) / .65, rr = mulberry(9);
    for (let i = 0; i < 5; i++) { const a0 = Math.PI / 2 + (rr() - .5) * 2.2, x0 = j.Hd[0] + Math.cos(a0) * r, y0 = j.Hd[1] + Math.sin(a0) * r; const Pt = [[x0, y0]]; let x = x0, y = y0, a = a0 + Math.PI;
      for (let s = 0; s < 5; s++) { a += (rr() - .5) * 1.1; x += Math.cos(a) * r * .22; y += Math.sin(a) * r * .22; Pt.push([x, y]); } draw(Pt, u * 1.3 - i * .08); }
    g.restore(); }
  // arms: a line along each infected arm (hand → shoulder), ginger over ink
  const arms = o.arms ?? (k > .5 ? 'both' : k > .25 ? 'R' : '');
  for (const [nm, [El, Hn]] of [['L', j.aL], ['R', j.aR]]) { if (!(arms === 'both' || arms === nm)) continue; const Q = ctrl(j.Sh, El, Hn, .8), pts = []; for (let i = 0; i <= 8; i++) pts.push(qpt(Hn, Q, j.Sh, i / 8));
    const u = clamp((k - (arms === 'both' && nm === 'L' ? .5 : .25)) * 3); if (u > 0) { const q = part(pts, u); if (q && q.length > 1) { line(q, col, lw * 1.2); } } }
  g.restore();
}
// any other person: f, p, o = {bag, bat, torch, rifle, cap, col}
function person(f, p, o = {}) {
  RAW++;
  try {
    const S = f.S, sc = clamp(Math.sqrt(S / 380), .6, 1.05), j0 = joints(f, p);
    if (o.bag) { const x = j0.N[0] - (f.face || 1) * S * .07, y = j0.N[1] + S * .02; rrect(x - S * .08, y, S * .16, S * .2, 10 * sc, C.blue, { lw: 5 * sc }); line([[x - S * .05, y + S * .06], [x + S * .05, y + S * .06]], '#3B6BB0', 3 * sc); }
    const j = figure(f, p);
    const hand = j.aR[1], el = j.aR[0], a = Math.atan2(hand[1] - el[1], hand[0] - el[0]);
    if (o.bat) { const ba = o.batA ?? a - .9; line([hand, [hand[0] + Math.cos(ba) * S * .38, hand[1] + Math.sin(ba) * S * .38]], C.ink, 15 * sc); line([hand, [hand[0] + Math.cos(ba) * S * .38, hand[1] + Math.sin(ba) * S * .38]], C2.woodL, 8 * sc); }
    if (o.torch) { const h2 = j.aL[1], e2 = j.aL[0], a2 = o.torchA ?? Math.atan2(h2[1] - e2[1], h2[0] - e2[0]); j.torch = [h2[0] + Math.cos(a2) * 40 * sc, h2[1] + Math.sin(a2) * 40 * sc]; j.torchA = a2; withRot(h2[0], h2[1], a2, () => { rrect(h2[0] - 8, h2[1] - 8, 44 * sc, 16 * sc, 4, C2.chrome, { lw: 4 * sc }); }); }
    if (o.rifle) { const k = S / 400 * .6, g0 = j.aR[1]; let ra = o.rifleA ?? 0; if (o.aimAt) ra = Math.atan2(o.aimAt[1] - g0[1], o.aimAt[0] - g0[0]) + Math.asin(clamp(8 * k / Math.hypot(o.aimAt[0] - g0[0], o.aimAt[1] - g0[1]), -1, 1)) * (Math.cos(ra = Math.atan2(o.aimAt[1] - g0[1], o.aimAt[0] - g0[0])) < 0 ? -1 : 1); j.muzzle = rifle(g0, ra, k); j.rifleA = ra; }
    return j;
  } finally { RAW--; }
}
// a held hand of another figure, for props: returns hand point
const handR = j => j.aR[1], handL = j => j.aL[1];
function tearDrops(j, S, t, t0, side = 1, n = 3) { if (t < t0) return; const r = GEO.headR * S;
  for (let i = 0; i < n; i++) { const u = ((t - t0) * .9 + i / n) % 1, x = j.Hd[0] + side * r * .55 + side * u * 10, y = j.Hd[1] + r * .2 + u * u * 120;
    g.save(); g.globalAlpha = (1 - u) * .95; shape(() => { g.moveTo(x, y - 14); g.quadraticCurveTo(x + 9, y + 2, x, y + 8); g.quadraticCurveTo(x - 9, y + 2, x, y - 14); }, '#7FB6E6', { lw: 3 }); g.restore(); } }
function sweat(j, S, t, a, side = 1) { const k = pop(t, a); if (k <= 0) return; const r = GEO.headR * S, x = j.Hd[0] + side * r * 1.1, y = j.Hd[1] - r * .4; scaled(x, y, k, () => shape(() => { g.moveTo(x, y - 16); g.quadraticCurveTo(x + 10, y + 2, x, y + 9); g.quadraticCurveTo(x - 10, y + 2, x, y - 16); }, '#BFE0F2', { lw: 3 })); }
function marks(j, S, s, t, a, out = 1e9, col = C.red) { const r = GEO.headR * S; popText(s, j.Hd[0] + r * 1.1, j.Hd[1] - r * 1.1, t, a, { size: 52, col }, out); }
function shockLines(j, S, t, a, d = .6) { const k = ein(t, a, .1) * eout(t, a + d, .2); if (k <= 0) return; const r = GEO.headR * S; g.save(); g.globalAlpha = k;
  for (const ang of [-2.6, -2.2, -1.0, -.55]) line([[j.Hd[0] + Math.cos(ang) * r * 1.4, j.Hd[1] + Math.sin(ang) * r * 1.4], [j.Hd[0] + Math.cos(ang) * r * 1.9, j.Hd[1] + Math.sin(ang) * r * 1.9]], C.ink, 5); g.restore(); }
// halo of instinct (pale yellow, never ginger) around a head
function halo(j, S, t, k = 1) { if (k <= 0) return; const r = GEO.headR * S; g.save(); for (let i = 0; i < 3; i++) { const u = (t * .8 + i / 3) % 1; g.globalAlpha = k * (1 - u) * .55; g.strokeStyle = '#F2D36B'; g.lineWidth = 8; g.beginPath(); g.arc(j.Hd[0], j.Hd[1], r * (1.15 + u * .9), 0, Math.PI * 2); g.stroke(); } g.globalAlpha = k * .35; circ(j.Hd[0], j.Hd[1], r * 1.2, '#F7E3A0', { lw: 0 }); g.restore(); }

// ---------- light (flat: palette washes and flat light shapes, never gradients) ----------
function wash(col, a, mode = 'multiply') { if (a <= 0) return; scr(); g.save(); g.globalCompositeOperation = mode; g.globalAlpha = clamp(a); g.fillStyle = col; g.fillRect(0, 0, W, H); g.restore(); recam(); }
const night = (a = 1) => wash('#3B4670', .72 * a);
const dusk = (a = 1) => wash('#F2B48A', .32 * a);
const gloom = (a = 1) => wash('#808080', .45 * a, 'saturation');
const glare = (a = 1) => wash('#FFFFFF', .45 * a, 'screen');
const greyAll = (a = 1) => wash('#808080', a, 'saturation');
function cone(Pts, col = '#FFF1B8', a = .3) { g.save(); g.globalAlpha = a; g.fillStyle = col; g.beginPath(); g.moveTo(...Pts[0]); for (const p of Pts.slice(1)) g.lineTo(...p); g.closePath(); g.fill(); g.restore(); }
function flicker(t, rate = 1) { const f = Math.floor(t * 20 * rate); return hash1(f * 7 + 3) > .9 ? .5 : 1; }

// a detailed hunting rifle (2D, hand-inked): grip at g0, pointing along angle a; k = scale (1 at a 400 px figure). Returns the muzzle point.
const GUN = { metal: '#4A4F59', metalL: '#6E7480', dark: '#2F333B', wood: '#A8683A', woodL: '#C98A55', grain: '#7E4A26', glass: '#9FD0EE' };
function rifle(g0, a, k = 1) {
  const flip = Math.cos(a) < 0 ? -1 : 1, M = (x, y) => [g0[0] + (x * Math.cos(a) - y * flip * Math.sin(a)) * k, g0[1] + (x * Math.sin(a) + y * flip * Math.cos(a)) * k];
  const PL = (pts, fill, lw = 4) => poly(pts.map(([x, y]) => M(x, y)), fill, { lw: lw * Math.max(.6, k) });
  const LN = (pts, col, lw) => line(pts.map(([x, y]) => M(x, y)), col, lw * Math.max(.6, k));
  // sling (behind)
  const sl = []; for (let i = 0; i <= 12; i++) { const u = i / 12, x = lerp(-120, 150, u), y = lerp(24, 14, u) + Math.sin(Math.PI * u) * 46; sl.push([x, y]); } LN(sl, '#5A4630', 5);
  // stock with a pistol grip and a dark butt pad
  PL([[-8, -12], [-150, -16], [-152, 30], [-118, 30], [-46, 12], [-18, 34], [2, 34], [6, 10]], GUN.wood);
  PL([[-150, -16], [-162, -16], [-164, 31], [-152, 30]], GUN.dark, 3);
  for (let i = 0; i < 3; i++) LN([[-140 + i * 12, -8 + i * 8], [-60 + i * 6, -6 + i * 6]], GUN.grain, 2);
  for (let i = 0; i < 4; i++) LN([[-14 + i * 4, 16], [-6 + i * 4, 30]], GUN.grain, 1.5);   // checkering on the grip
  // receiver, ejection port, bolt handle
  PL([[-10, -20], [96, -20], [96, 8], [-10, 8]], GUN.metal);
  PL([[30, -15], [70, -15], [70, -5], [30, -5]], GUN.metalL, 2.5);
  LN([[76, -6], [84, 14]], GUN.dark, 5); circ(...M(85, 17), 6 * k, GUN.metalL, { lw: 3 * k });
  // trigger guard + trigger
  g.save(); g.strokeStyle = C.ink; g.lineWidth = 4 * k; g.lineCap = 'round'; g.beginPath(); const tg = [[8, 8], [6, 26], [22, 32], [40, 26], [40, 8]].map(([x, y]) => M(x, y)); g.moveTo(...tg[0]); for (const q of tg.slice(1)) g.lineTo(...q); g.stroke(); g.restore();
  LN([[22, 8], [20, 20]], C.ink, 4);
  // magazine
  PL([[50, 8], [72, 8], [76, 40], [56, 42]], GUN.dark);
  // fore-end (wood, checkered) and barrel with a front sight
  PL([[96, -16], [200, -14], [196, 8], [96, 10]], GUN.woodL);
  for (let i = 0; i < 6; i++) LN([[118 + i * 12, -10], [126 + i * 12, 4]], GUN.grain, 1.5);
  PL([[96, -16], [320, -12], [320, -4], [96, -4]], GUN.metal, 3.5);
  PL([[318, -14], [330, -14], [330, -2], [318, -2]], GUN.dark, 3);
  PL([[300, -12], [306, -22], [312, -12]], GUN.dark, 2.5);
  // scope: mounts, tube, bells, lens glints
  PL([[20, -20], [30, -20], [30, -30], [20, -30]], GUN.dark, 2.5); PL([[78, -20], [88, -20], [88, -30], [78, -30]], GUN.dark, 2.5);
  PL([[-4, -30], [120, -30], [120, -46], [-4, -46]], GUN.dark);
  PL([[120, -28], [150, -24], [150, -52], [120, -48]], GUN.dark); PL([[-4, -28], [-20, -26], [-20, -50], [-4, -48]], GUN.dark);
  LN([[52, -46], [52, -54]], GUN.dark, 6);
  PL([[150, -26], [154, -26], [154, -50], [150, -50]], GUN.glass, 2);
  LN([[10, -42], [100, -42]], GUN.metalL, 2);
  return M(330, -8);
}
