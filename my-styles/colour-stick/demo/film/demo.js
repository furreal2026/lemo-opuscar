// Colour Stick Explainer — demo film (≈27 s, no voice, no subtitles).
// Five moments cut from "What if a cat bit you?" (film time → demo time), then a new closing shot: the ripple (native move).
const tBiteD = lt('l03'), tEarsD = wt('l05', 'ears'), tLaunchD = wt('l14', '5') + .05, tPushD = le('l19') + .25, tTVD = wt('l24', 'city');
const SEG = [ // [film start, length]; lengths are whole beats (0.5 s) so every cut lands on the beat
  [tBiteD - 3.0, 4.5],   // the bite: flat-colour room, detailed props, the cat
  [tEarsD - 1.0, 4.5],   // the transformation: ginger head, ears, whiskers, tail
  [tLaunchD - 1.0, 4.0], // the power colour: the 9 m jump, the detailed house
  [tPushD - 1.0, 3.5],   // red = limit: the mug falls, NOOO
  [tTVD - 2.0, 4.0],     // the box and the TV
];
const RIP = 7.0;
let acc = 0; const CUTS = SEG.map(([a, l]) => { const o = { a, l, d0: acc }; acc += l; return o; });
const R0 = acc, DDUR = acc + RIP;

// ---------- the ripple ----------
const RN = 9, RSRC = 4, RT0 = R0 + 1.2, RSTEP = .26, RGY = 840, RS = 300;
const RX = [...Array(RN)].map((_, i) => 200 + i * 190);
const RTi = i => i === RSRC ? RT0 - .35 : RT0 + Math.abs(i - RSRC) * RSTEP;
const RTURN = RT0 + 4 * RSTEP + .7;
function ripple(t) {
  const u = t - R0;
  cam(lerp(1.3, 1, ss(seg(t, R0 + .2, RT0 + 1.0))), lerp(RX[RSRC], 960, ss(seg(t, R0 + .2, RT0 + 1.0))), lerp(660, 560, ss(seg(t, R0 + .2, RT0 + 1.0))));
  // the system line with its pulse
  const y = RGY + 40, x0 = RX[0] - 90, x1 = RX[RN - 1] + 90;
  line([[x0, y], [x1, y]], C.tint, LW);
  const v = 190 / RSTEP, run = t - RT0;
  if (run > 0) for (const sg of [-1, 1]) { const head = RX[RSRC] + sg * run * v, tail = RX[RSRC] + sg * Math.max(0, run * v - 220);
    const lim = sg < 0 ? x0 : x1, h = sg < 0 ? Math.max(head, lim) : Math.min(head, lim), tl = sg < 0 ? Math.max(tail, lim) : Math.min(tail, lim);
    if (Math.abs(h - tl) > 1) line([[tl, y], [h, y]], C.ginger, LW); }
  RX.forEach((x, i) => { const Ti = RTi(i), on = ss(seg(t, Ti - .02, Ti + .1)), pp = bell(t, Ti - .02, Ti + .3);
    circ(x, y, 10 + 5 * pp, mix(C.tint, C.ginger, on), { lw: 0 }); if (on < .99) circ(x, y, 4.5 * (1 - on), C.paper, { lw: 0 }); });
  // the people: each changes when the pulse reaches it, then all turn to the first one
  RX.forEach((x, i) => {
    const Ti = RTi(i), ph = i * 1.7, dir = Math.sign(RSRC - i);
    const keys = [[0, pose({ la: -.45, lb: .2, ra: .45, rb: -.2 })],
      [Ti - .14, pose({ hy: .02, la: -.25, lb: .3, ra: .25, rb: -.3 })],
      [Ti + .02, pose({ la: -2.3, lb: -.3, ra: 2.3, rb: .3, head: -.08, lfy: .05, rfy: .05 })],
      [Ti + .55, pose({ la: -.5, lb: .25, ra: .5, rb: -.25 })]];
    if (i !== RSRC) keys.push([RTURN + Math.abs(i - RSRC) * .03, pose({ la: -.5, lb: .25, ra: .5, rb: -.25, head: .32 * dir, lean: .04 * dir })]);
    else keys.push([RTURN + .4, pose({ la: -2.0, lb: -.2, ra: .5, rb: -.25, head: -.05 })]);
    const k = i === RSRC ? {} : { ears: sp(t - Ti, 16, .4), head: ss(seg(t, Ti, Ti + .15)), whisk: ss(seg(t, Ti, Ti + .15)), tail: sp(t - Ti - .05, 14, .45) };
    const lift = Math.max(0, sp(t - Ti, 14, .5) * (1 - ss(seg(t, Ti + .15, Ti + .45)))) * 26;
    catK({ x, gy: RGY - lift, S: RS }, breathe(poseAt(keys, t), t, ph), k);
  });
  scr();
  L('Colour Stick Explainer', 124, 118, t, R0 + .1);
  T('One bite.', 116, 226, { size: 96, w: 600, track: -2 }, t, R0 + .3);
  T('Everyone’s a cat.', 116, 326, { size: 96, w: 600, track: -2, col: C.ginger }, t, RT0 + .6);
  // end: fade to paper
  const kf = ein(t, DDUR - .7, .6); if (kf > 0) { g.save(); g.globalAlpha = kf; g.fillStyle = C.paper; g.fillRect(0, 0, W, H); g.restore(); }
}

// ---------- events for the mixer (film events inside each cut, moved to demo time) ----------
const DEV = [];
for (const c of CUTS) for (const e of EV) if (e.t >= c.a && e.t < c.a + c.l && !['title', 'step', 'brush'].includes(e.type)) DEV.push({ ...e, t: +(e.t - c.a + c.d0).toFixed(3) });
CUTS.forEach((c, i) => i && DEV.push({ t: c.d0, type: 'cut' }));
DEV.push({ t: R0, type: 'cut' }, { t: RTi(RSRC), type: 'boing' });
for (let i = 0; i < RN; i++) if (i !== RSRC) DEV.push({ t: +RTi(i).toFixed(3), type: 'node', n: Math.abs(i - RSRC) });
DEV.push({ t: +RTURN.toFixed(3), type: 'turn' }, { t: +(DDUR - 2.4).toFixed(3), type: 'final' });

// ================= page contract (overrides film.js) =================
window.EV = DEV.sort((a, b) => a.t - b.t);
window.DUR = DDUR;
window.render = t => {
  scr(); paper();
  if (t >= R0) { g.save(); ripple(t); g.restore(); scr(); return; }
  const c = CUTS.find(c => t >= c.d0 && t < c.d0 + c.l) || CUTS[CUTS.length - 1];
  const ft = c.a + (t - c.d0), s = TLS.scenes.find(x => ft >= x.t0 && ft < x.t1);
  g.save(); FILM[s.id](ft); g.restore(); scr();
  const kin = 1 - ein(t, 0, .35); if (kin > 0) { g.save(); g.globalAlpha = kin; g.fillStyle = C.paper; g.fillRect(0, 0, W, H); g.restore(); }
};
window.TEXTS = t => { TXT = []; window.render(t); const r = TXT; TXT = null; return r; };
