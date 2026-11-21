// Title sequence (scene 012): "WHAT IF YOU BECAME A ZOMBIE… / BUT NEVER LOST YOUR MIND?"
// A zombie-film cold-open in Colour Stick grammar: a spore pulsing in the dark, hyphae spreading like roots,
// a flickering tube light, title words stamped on heartbeats, the infection creeping into the letters of ZOMBIE,
// and one word it cannot reach: MIND (inside an ink head-ring). Ginger = the fungus (the film's one power colour).
const DUR = 14;
const GIN = C.ginger, GIND = C.gingerD, INKC = C.ink, PAP = C.paper;
const M = 124;                                   // left margin
const L1 = { s: 'WHAT IF YOU BECAME', y: 392, size: 96 };
const L2 = { s: 'A ZOMBIE', y: 628, size: 236 };
const L3 = { a: 'BUT NEVER LOST YOUR ', b: 'MIND?', y: 780, size: 66 };
const SPORE = [1585, 545];
const T_BURST = 1.3, T_LIGHT = 4.52;
const FLICK = [[4.0, 0], [4.07, 1], [4.14, 0], [4.27, 1], [4.33, 0], [4.52, 1]];   // [t, paper on?]
const W1 = [['WHAT', 4.75], ['IF', 5.0], ['YOU', 5.25], ['BECAME', 5.5]];
const T_Z0 = 5.95, T_ZSTEP = .17;              // letters of "A ZOMBIE" arrive one by one
const T_DOTS = 7.35, T_SAG = 7.9;
const W3 = [['BUT', 8.35], ['NEVER', 8.6], ['LOST', 8.85], ['YOUR', 9.1]];
const T_MIND = 9.7, T_RING = 10.0, T_RECOIL = 10.35, T_LABEL = 11.1;
const BEATS = [0.35, 1.1, 1.8, 2.45, 3.05, 3.6, 4.6, 5.1, 5.55, 6.0, 6.42, 6.84, 7.24, 7.62, 8.0, 8.36, 8.72, 9.08, 9.42];

const bg = t => { let on = 0; for (const [ft, v] of FLICK) if (t >= ft) on = v; return on; };
const gease = u => { u = clamp(u); return 1 - Math.pow(1 - u, 3) * Math.cos(u * 2.2) ; };
function wordW(s, size, w = 600, track = -2) { g.save(); g.font = `${w} ${size}px ${EN}`; g.letterSpacing = track + 'px'; const m = g.measureText(s).width; g.restore(); return m; }

// ---------- layout (after fonts) ----------
let LAY = null;
function layout() {
  const x3 = M + wordW(L3.a, L3.size, 600, 0), wM = wordW(L3.b, L3.size, 600, 0);
  const mind = { x: x3 + 26, w: wM, cx: x3 + 26 + wM * .5, cy: L3.y - L3.size * .36, r: wM * .5 + 26, ry: L3.size * .82 };
  const letters = []; let x = M;
  for (const ch of L2.s) { const w = wordW(ch, L2.size, 600, -4); letters.push({ ch, x, w }); x += w; }
  const dotsX = x + 8;
  const box3 = { x0: M - 20, x1: x3 - 10, y0: L3.y - L3.size * .85, y1: L3.y + 22 };
  LAY = { mind, letters, dotsX, box3 };
  buildNet();
}

// ---------- the hyphae network (deterministic) ----------
let NET = [];        // branches: {P:[[x,y]..], cum:[], t0, speed, w, depth, blocked}
let NODES = [];      // {x, y, t}
let VEINS = [];      // veins inside the letters of ZOMBIE
function blockedAt(x, y) {
  const m = LAY.mind; if (Math.hypot(x - m.cx, y - m.cy) < m.r + 16) return true;
  const b = LAY.box3; if (x > b.x0 && x < b.x1 && y > b.y0 && y < b.y1) return true;
  if (x > M - 20 && x < M + 470 && y > 845 && y < 900) return true;   // the episode label
  return false;
}
function grow(x, y, a, len, t0, speed, depth, rnd, jit = .55) {
  const P = [[x, y]], step = 16; let blocked = false, cx = x, cy = y, ang = a;
  const n = Math.round(len / step);
  for (let i = 0; i < n; i++) {
    ang += (rnd() - .5) * jit;
    const nx = cx + Math.sin(ang) * step, ny = cy - Math.cos(ang) * step;
    if (nx < -140 || nx > W + 140 || ny < 120 + 70 * hash1(Math.round(nx / 9)) || ny > H + 140) break;
    if (blockedAt(nx, ny)) { blocked = true; break; }
    cx = nx; cy = ny; P.push([cx, cy]);
  }
  if (P.length < 2) return;
  const cum = [0]; for (let i = 1; i < P.length; i++) cum.push(cum[i - 1] + step);
  const br = { P, cum, t0, speed, w: [5.2, 4, 2.8, 2, 1.5][depth], depth, blocked };
  NET.push(br);
  if (depth >= 4) return;
  let next = 50 + rnd() * 70;
  while (next < cum[cum.length - 1] - 20) {
    const i = Math.round(next / step), p = P[i];
    const prevA = Math.atan2(p[0] - P[i - 1][0], -(p[1] - P[i - 1][1]));
    const side = rnd() < .5 ? -1 : 1, na = prevA + side * (.45 + rnd() * .6);
    const tt = t0 + next / speed;
    NODES.push({ x: p[0], y: p[1], t: tt, depth });
    grow(p[0], p[1], na, len * (.42 + rnd() * .3), tt, speed * (.86 + rnd() * .1), depth + 1, rnd);
    next += 70 + rnd() * 110;
  }
}
function buildNet() {
  NET = []; NODES = []; VEINS = [];
  const rnd = mulberry(29);
  const roots = 7;
  for (let k = 0; k < roots; k++) {
    const a = -Math.PI / 2 - .25 + (k / roots) * Math.PI * 2 + (rnd() - .5) * .3;   // all round, biased to the left
    const len = 520 + rnd() * 520 + (Math.sin(a) < 0 ? 520 : 0);                   // longer roots reach left, into the title
    grow(SPORE[0] + Math.sin(a) * 14, SPORE[1] - Math.cos(a) * 14, a, len, T_BURST + rnd() * .12, 360 + rnd() * 80, 0, rnd);
  }
  // three long roots reach left, under the title, so the infection arrives at ZOMBIE
  for (const [a, len, t0] of [[-Math.PI / 2 - .1, 1650, 1.5], [-Math.PI / 2 + .16, 1500, 1.7], [-Math.PI / 2 - .32, 1450, 1.9]])
    grow(SPORE[0], SPORE[1], a, len, t0, 430, 1, rnd, .3);
  // veins rising inside each letter of ZOMBIE from its baseline
  const vr = mulberry(77);
  LAY.letters.forEach((L, i) => {
    if (L.ch === ' ' || L.ch === 'A') return;
    const tl = T_Z0 + i * T_ZSTEP + .25;
    for (let k = 0; k < 4; k++) {
      let x = L.x + L.w * (.18 + .64 * vr()), y = L2.y + 6, a = (vr() - .5) * .9; const P = [[x, y]];
      for (let s = 0; s < 14; s++) { a += (vr() - .5) * .9; x += Math.sin(a) * 13; y -= Math.cos(a) * 13; P.push([x, y]); }
      const cum = [0]; for (let j = 1; j < P.length; j++) cum.push(cum[j - 1] + 13);
      VEINS.push({ P, cum, t0: tl + k * .12 + vr() * .2, speed: 120 + vr() * 50, w: 7 - k });
    }
  });
}
function partial(br, t, cut = 0) {
  const s = (t - br.t0) * br.speed - cut; if (s <= 0) return null;
  const P = br.P, cum = br.cum, L = cum[cum.length - 1];
  if (s >= L) return P;
  let i = 1; while (cum[i] < s) i++;
  const u = (s - cum[i - 1]) / (cum[i] - cum[i - 1]), a = P[i - 1], b = P[i];
  return P.slice(0, i).concat([[lerp(a[0], b[0], u), lerp(a[1], b[1], u)]]);
}
function drawNet(t, col, cx = g, inkF = ink) {
  const rec = ss(seg(t, T_RECOIL, T_RECOIL + .5));
  for (const br of NET) {
    const cut = br.blocked ? 46 * rec : 0;
    const Q = partial(br, t, cut); if (!Q || Q.length < 2) continue;
    // tips that hit the ring twitch back: a small shiver while they retreat
    inkF(Q, { w: br.w, col, ta: .02, tb: .35, amp: .7, seed: (br.P.length * 97 + br.depth * 13) | 0 });
  }
  for (const n of NODES) { const k = sp(t - n.t, 18, .45); if (k <= 0) continue; cx.save(); cx.fillStyle = col; cx.beginPath(); cx.arc(n.x, n.y, (n.depth < 2 ? 6.5 : 4.5) * k, 0, Math.PI * 2); cx.fill(); cx.restore(); }
}
function sp(x, w = 11, z = .6) { if (x <= 0) return 0; const wd = w * Math.sqrt(1 - z * z); return 1 - Math.exp(-z * w * x) * (Math.cos(wd * x) + z * w / wd * Math.sin(wd * x)); }

// ---------- the spore ----------
function spore(t, onPaper) {
  let r = 11; for (const b of BEATS) if (b < T_BURST + .1) r += 9 * Math.exp(-Math.max(0, t - b) * 9) * (t >= b);
  const burst = sp(t - T_BURST, 16, .4);
  r += 10 * burst;
  g.save(); g.fillStyle = GIN; g.beginPath(); g.arc(SPORE[0], SPORE[1], r, 0, Math.PI * 2); g.fill(); g.restore();
  if (!onPaper && t < T_BURST + .6) {          // a faint halo in the dark (flat ring, no gradient)
    const k = 1 - seg(t, T_BURST, T_BURST + .6);
    g.save(); g.globalAlpha = .22 * k; g.fillStyle = GIN; g.beginPath(); g.arc(SPORE[0], SPORE[1], r * 2.4, 0, Math.PI * 2); g.fill(); g.restore();
  }
  // spore puff at the burst
  if (t > T_BURST && t < T_BURST + 1.4) {
    const r2 = mulberry(5), u = t - T_BURST;
    for (let i = 0; i < 26; i++) { const a = r2() * Math.PI * 2, v = 60 + r2() * 160, d = v * (1 - Math.exp(-u * 2.2)); g.save(); g.globalAlpha = clamp(1 - u / 1.4) * .9; g.fillStyle = GIN; g.beginPath(); g.arc(SPORE[0] + Math.sin(a) * d, SPORE[1] - Math.cos(a) * d - u * 20, 2.5 + r2() * 3, 0, Math.PI * 2); g.fill(); g.restore(); }
  }
}

// ---------- title type ----------
function stamp(s, x, y, size, tIn, t, col, track = -2) {
  const u = t - tIn; if (u < 0) return;
  const k = sp(u, 22, .5), sc = lerp(1.18, 1, k), a = clamp(u / .06);
  g.save(); g.translate(x, y); g.scale(sc, sc); g.translate(-x, -y); text(s, x, y, { size, w: 600, col, track, a }); g.restore();
}
function twitch(i, t) {          // deterministic little jolts: a letter jumps for two frames, now and then
  const f = Math.floor(t * 30), h = hash1(f * 31 + i * 977);
  if (h > .965) return [(hash1(f + i) - .5) * 14, (hash1(f * 3 + i) - .5) * 10];
  return [0, 0];
}
let OFF = null, og = null, inkO = null;
function zombieWord(t) {
  if (!OFF) { OFF = document.createElement('canvas'); OFF.width = W; OFF.height = H; og = OFF.getContext('2d'); inkO = new Function('g', 'return (' + ink.toString() + ')')(og); }
  og.setTransform(1, 0, 0, 1, 0, 0); og.clearRect(0, 0, W, H);
  // letters, into the offscreen canvas
  LAY.letters.forEach((L, i) => {
    if (L.ch === ' ') return;
    const tIn = T_Z0 + i * T_ZSTEP, u = t - tIn; if (u < 0) return;
    const k = sp(u, 15, .32), drop = (1 - k) * -46;
    let [dx, dy] = u > .4 ? twitch(i, t) : [0, 0];
    let rot = 0;
    if (L.ch === 'E') { const s = sp(t - T_SAG, 9, .35); rot = .085 * s; dy += 9 * s; }     // the last letter sags like a dead limb
    const cx = L.x + L.w / 2, by = L2.y;
    og.save(); og.translate(cx + dx, by + dy + drop); og.rotate(rot); og.translate(-cx, -by);
    og.globalAlpha = clamp(u / .05);
    og.font = `600 ${L2.size}px ${EN}`; og.fillStyle = INKC; og.textAlign = 'left'; og.letterSpacing = '0px'; og.fillText(L.ch, L.x, by);
    og.restore();
  });
  // the fungus, only on top of the letters
  og.globalCompositeOperation = 'source-atop';
  for (const v of VEINS) { const Q = partial(v, t); if (!Q || Q.length < 2) continue; inkO(Q, { w: v.w, col: GIN, ta: .05, tb: .5, amp: .8 }); }
  drawNet(t, GIN, og, inkO);
  og.globalCompositeOperation = 'source-over';
  g.drawImage(OFF, 0, 0);
  if (TXT && t >= T_Z0) TXT.push({ id: 'zombie', text: L2.s, x0: M, y0: L2.y - L2.size * .75, x1: LAY.dotsX, y1: L2.y + 20 });
  // the ellipsis: three dots; the last one drips down and falls like a spore
  for (let d = 0; d < 3; d++) {
    const tIn = T_DOTS + d * .14, u = t - tIn; if (u < 0) continue;
    let x = LAY.dotsX + 16 + d * 46, y = L2.y - 14, r = 15 * sp(u, 20, .45);
    if (d === 2 && t > T_DOTS + 1.0) {
      const v = t - (T_DOTS + 1.0), stretch = ss(clamp(v / .5));
      if (v < .5) { g.save(); g.fillStyle = GIN; g.beginPath(); g.ellipse(x, y + 10 * stretch, r * (1 - .25 * stretch), r * (1 + .6 * stretch), 0, 0, Math.PI * 2); g.fill(); g.restore(); continue; }
      const fall = (v - .5); y += 10 + 380 * fall * fall + 30 * fall; r *= .8; if (y > H + 30) continue;
      g.save(); g.fillStyle = GIN; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill(); g.restore(); continue;
    }
    g.save(); g.fillStyle = d === 2 && t > T_DOTS + .5 ? mix(INKC, GIN, ss(seg(t, T_DOTS + .5, T_DOTS + 1))) : INKC; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill(); g.restore();
  }
}
function mindLine(t, col) {
  let x = M;
  for (const [w, tw] of W3) { stamp(w, x, L3.y, L3.size, tw, t, col, 0); x += wordW(w + ' ', L3.size, 600, 0); }
  if (t >= T_MIND) {
    const u = t - T_MIND, k = sp(u, 12, .6);
    text(L3.b, LAY.mind.x, L3.y + (1 - k) * 16, { size: L3.size, w: 600, col, a: clamp(u / .25) });
  }
  // the head ring around MIND: one hand-inked circle that draws itself, then holds the line
  const rk = ss(seg(t, T_RING, T_RING + .45));
  if (rk > 0) {
    const m = LAY.mind, n = Math.max(3, Math.round(48 * rk)), P = [];
    for (let i = 0; i <= n; i++) { const a = -2.2 + (i / 48) * Math.PI * 2.08; P.push([m.cx + Math.cos(a) * m.r, m.cy + Math.sin(a) * m.ry]); }
    ink(P, { w: 7, col, ta: .04, tb: .08, amp: 1.2, seed: 4242 });
  }
}

// ---------- camera: the style's two-finger gesture at each "scene" start, then a slow drift ----------
function camAt(t) {
  const starts = [0, T_LIGHT]; let s0 = 0, idx = 0; for (let i = 0; i < starts.length; i++) if (t >= starts[i]) { s0 = starts[i]; idx = i; }
  const u = clamp((t - s0) / .85), e = 1 - Math.pow(1 - u, 3);
  const z = lerp(1.06, 1, e) * (1 + .018 * seg(t, 0, DUR)), r = (idx % 2 ? -1 : 1) * lerp(.035, 0, e) + .006 * Math.sin(t * .4);
  return { z, r };
}
function shakeAt(t) {
  let dx = 0, dy = 0; const hits = W1.map(w => w[1]).concat([T_Z0 + T_ZSTEP * 2]);
  for (const h of hits) { const u = t - h; if (u >= 0 && u < .22) { const k = (1 - u / .22) * 7; dx += Math.sin(u * 90) * k; dy += Math.cos(u * 77) * k; } }
  return [dx, dy];
}

// ---------- events for the mix ----------
const EV = [];
const ev = (t, type, o = {}) => EV.push({ t: +t.toFixed(3), type, ...o });
BEATS.forEach(b => ev(b, 'heart'));
ev(T_BURST, 'burst');
FLICK.forEach(([t, v]) => ev(t, 'flick', { on: v }));
W1.forEach(([w, t]) => ev(t, 'stamp'));
'A ZOMBIE'.split('').forEach((c, i) => { if (c !== ' ') ev(T_Z0 + i * T_ZSTEP, 'letter', { i }); });
ev(T_DOTS, 'dots'); ev(T_DOTS + 1.5, 'drip'); ev(T_SAG, 'sag');
W3.forEach(([w, t]) => ev(t, 'type'));
ev(T_MIND, 'mind'); ev(T_RING, 'ring'); ev(T_RECOIL, 'recoil'); ev(T_LABEL, 'label');

// ---------- frame ----------
window.render = t => {
  if (!LAY) layout();
  g.setTransform(1, 0, 0, 1, 0, 0);
  const on = bg(t);
  if (on) paper(); else { g.fillStyle = INKC; g.fillRect(0, 0, W, H); }
  const { z, r } = camAt(t), [sx, sy] = shakeAt(t);
  const c = Math.cos(r) * z, s = Math.sin(r) * z;
  g.setTransform(c, s, -s, c, W / 2 - (c * W / 2 - s * H / 2) + sx, H / 2 - (s * W / 2 + c * H / 2) + sy);
  // nodes growing in the dark: the hyphae; after the light comes on they stay, a quieter tone behind the type
  drawNet(t, GIN);
  spore(t, on);
  if (on) {
    let x = M; for (const [w, tw] of W1) { stamp(w, x, L1.y, L1.size, tw, t, INKC); x += wordW(w + ' ', L1.size); }
    zombieWord(t);
    mindLine(t, INKC);
    const k = ss(seg(t, T_LABEL, T_LABEL + .4));
    if (k > 0) label('What if?  ·  Episode 2', M, 880 + (1 - k) * 14, { a: k });
  }
  g.setTransform(1, 0, 0, 1, 0, 0);
};
window.EV = EV.sort((a, b) => a.t - b.t);
window.DUR = DUR;
window.TEXTS = t => { TXT = []; window.render(t); const r = TXT; TXT = null; return r; };
document.fonts.load(`600 40px ${EN}`).then(() => document.fonts.load(`500 40px ${EN}`)).then(() => { layout(); window.render(0); window.READY = true; });
