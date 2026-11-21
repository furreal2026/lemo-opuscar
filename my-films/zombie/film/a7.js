// Act 7 · instinct against the mind (Day 7, golden hour → dusk)
const INF7 = { veins: .95, hood: 0, stalks: 1, arms: 'both' };
const GHX = 420, GHS = 2.2, GDX = GHX + (GHX - 230 + 275 - GHX) * GHS, GDW = 90 * GHS, GDH = 170 * GHS;   // the house close up: its door
function garden(o = {}) {
  street({ hx: GHX, hs: GHS, neighbour: false, fence: false, treeX: 2050, sky: o.sky || '#F4D9B8', trees: o.trees });
  rect(GDX, GY - GDH, GDW, GDH, '#A79C98', { lw: 0 });
  doorF(GDX, GY, GDW, GDH, 1, C.blue, 0);
  rect(GDX, GY - GDH, GDW, GDH, '#A79C98', { lw: 6 });
  // the door panel swung inward shows its red X on the edge
  poly([[GDX, GY - GDH], [GDX + 40, GY - GDH + 20], [GDX + 40, GY - 20], [GDX, GY]], C.blue); line([[GDX + 8, GY - GDH * .7], [GDX + 34, GY - GDH * .55]], C.red, 8);
  if (o.hose !== false) hoseP([1900, GY + 6], [1380, GY + 10]);
  if (o.splinter) { const k = o.splinter; for (let i = 0; i < 6; i++) { const a = -.8 - i * .35; const L = 40 + 140 * k; withRot(GDX + GDW + 6 + Math.cos(a) * L, GY - GDH * .72 + Math.sin(a) * L, i, () => rect(GDX + GDW + Math.cos(a) * L, GY - GDH * .72 + Math.sin(a) * L, 18, 6, C2.woodL, { lw: 2 })); } }
  if (o.hole) circ(GDX + GDW + 8, GY - GDH * .72, 9, C.ink, { lw: 0 });
}
const ME7 = (S = 400) => ({ x: GDX + GDW / 2, gy: GY, S });
const mx7 = 1260, lx7 = 1500, dx7 = 1740;   // where Mia, Leo and Dan stand
function goldenToDusk(t) { const T0 = SCX[CUR.id].t0 + t, u = seg(T0, SCX['091'].t0, SCX['109'].t0); dusk(lerp(.5, 1.0, u)); if (u > .55) night((u - .55) * .7); }
function aimLine(from, to, k = 1, wob = 0) { if (k <= 0) return; g.save(); g.globalAlpha = k; g.setLineDash([14, 14]); line([from, to], C.red, 4); g.restore(); circ(to[0], to[1], 8 * k, C.red, { lw: 0 }); }

// 091 · the standoff
S('091', (t, d) => {
  cam(1);
  garden();
  hero(ME7(), breathe(P({ la: -.25, ra: .25, head: .05 }), t), INF7);
  MIA(mx7, GY, 400, P({ ra: .4, rb: -.2, la: -.4, lb: .2 }), t);
  LEO(lx7, GY, 400, P({ ra: 1.4, rb: -1.6, la: -.4, lb: .2 }), t, { torch: 1 });
  const dj = DAN(dx7, GY, 410, P({ ra: -1.4, rb: -.2, la: -1.2, lb: -.4 }), t, { rifleA: Math.PI + .05 });
  goldenToDusk(t);
}, [[0, 'heartbeat', { d: 6, rate: 1 }], [0, 'wind', { d: 6 }]]);

// 092 · Mia steps back; her heel catches the hose
S('092', (t, d) => {
  cam(1.8, mx7 + 60, 640);
  garden();
  const back = ein(t, .4, .6), trip = bell(t, 1.4, 2.2);
  MIA(mx7 + 80 * back, GY, 400, P({ ra: 1.3, rb: 1.6, la: -.5 - .5 * trip, lb: .2, lean: -.08 - .1 * trip, head: -.1, rfx: .05 * back }), t);
  goldenToDusk(t);
}, [[.4, 'step'], [1.4, 'gasp']]);

// 093 · Dan aims: a red dotted line to your head
S('093', (t, d) => {
  const follow = ss(seg(t, 1.2, 2.6)); cam(lerp(1.8, 1, follow), lerp(dx7 - 100, 960, follow), lerp(520, 540, follow));
  garden();
  hero(ME7(), P({ la: -.25, ra: .25, head: -.05 }), INF7);
  const hj = joints(ME7(), P({}));
  const dj = DAN(dx7, GY, 410, P({ ra: -1.4, rb: -.2, la: -1.2, lb: -.4, head: -.1 }), t, { aimAt: hj.Hd });
  aimLine(dj.muzzle, hj.Hd, ein(t, .5, .4) * clamp((t - .5) * 2));
  bubble('Stay back!', dx7 - 260, 360, dx7 - 40, 420, t, LT('d10'), LE('d10') + .8);
  goldenToDusk(t);
}, [[.3, 'cock'], [.5, 'laserHum', { d: 3 }]]);

// 094 · hands up in surrender — and the fingers curl into claws on their own
S('094', (t, d) => {
  const push = ss(seg(t, 1.6, 4.4)); cam(lerp(1.5, 2.2, push), GDX + GDW / 2, lerp(520, 420, push));
  garden();
  const up = ein(t, .4, .6), claw = clamp((t - 2.4) / 1.4);
  const p = lerpPose(P({ la: -.25, ra: .25 }), PS.up(), up);
  hero(ME7(), tremble(p, t, up), { ...INF7, claw });
  goldenToDusk(t);
}, [[.4, 'cloth'], [2.4, 'sour'], [2.4, 'crackle', { d: 1.4 }]]);

// 095 · control room: hanging off the arm levers
S('095', (t, d) => {
  const [sx, sy] = shake(t, 0, 3, d); cam(1.25, 860, 660, sx * .3, sy * .3);
  const yank = Math.sin(t * 5);
  ctrlRoom(t, { threads: .85, alarm: true, taken: { 0: 1, 1: 1, 2: .6, 3: 1 }, lv: { 0: yank * .8, 1: yank * .8 }, lamps: { 0: 'r', 1: 'r', 2: 'f', 3: 'f' }, notes: [[1, 'MIA', 2]], view: (x, y, r) => { rect(x - r, y - r, 2 * r, 2 * r, '#F4D9B8', { lw: 0 }); MIA(x - 40, y + r, 300, P({ ra: 1.3, rb: 1.6 }), t); LEO(x + 90, y + r, 300, P({}), t); } });
  littleMe((leverX(0) + leverX(1)) / 2, P({ la: -2.6, lb: -.2, ra: 2.6, rb: .2, hy: -.05 + .05 * yank, lfy: .1 + .05 * yank, rfy: .12 - .05 * yank, lfx: -.06 * Math.sin(t * 9), rfx: .06 * Math.sin(t * 9) }));
}, [[0, 'leverStrain', { d: 5 }], [0, 'alarm', { d: 5 }]]);

// 096 · outside: the arms jerk up and down — they only see a monster twitching
S('096', (t, d) => {
  cam(1.05, 820, 540);
  garden();
  const y = Math.sin(t * 5);
  hero(ME7(), twitchP(P({ la: -1.6 - .9 * y, lb: -.2, ra: 1.6 + .9 * y, rb: .2, head: .1 * y, lean: .03 * y }), t, 2), { ...INF7, claw: 1 });
  LEO(1400, GY, 520, P({ ra: 2.3, rb: 1.0, la: -1.0, lb: -.5, head: -.1 }), t, { batA: -2.2 });
  MIA(1150, GY + 60, 600, P({ ra: 1.3, rb: 1.6, la: -.4, lb: .2 }), t);
  goldenToDusk(t);
}, [[0, 'heartbeatFast', { d: 4 }]]);

// 097 · one step to explain — a lurch; Leo raises the bat
S('097', (t, d) => {
  cam(1.2, 1100, 540);
  garden();
  const st = ein(t, .4, .35);
  hero({ ...ME7(), x: GDX + GDW / 2 + 160 * st }, poseJerk([[0, P({ la: -.8, lb: -.2, ra: .8, rb: .2 })], [.4, P({ la: -1.4, lb: -.2, ra: 1.2, rb: .3, lean: .2, head: .2, lfx: .1 })]], t), { ...INF7, claw: 1 });
  const bat = ein(t, .9, .3);
  LEO(lx7 - 100, GY, 420, lerpPose(P({ ra: 1.4, rb: -1.6 }), P({ ra: 2.6, rb: .9, la: -1.2, lb: -.6, lean: -.08 }), bat), t, { batA: lerp(-1.0, -2.6, bat) });
  MIA(mx7 - 60, GY, 400, P({ ra: 1.3, rb: 1.6, lean: -.1 }), t);
  bubble("Don't!", lx7 - 170, 380, lx7 - 90, 440, t, LT('d11'), LE('d11') + .9);
  goldenToDusk(t);
}, [[.4, 'lurch'], [.9, 'whoosh']]);

// 098 · he forces the body to kneel
S('098', (t, d) => {
  cam(1.3, GDX + 260, 560);
  garden();
  const k = ein(t, .6, .35);
  hero({ ...ME7(), x: GDX + GDW / 2 + 160 }, lerpPose(P({ la: -1.4, lb: -.2, ra: 1.2, rb: .3, lean: .2 }), P({ hy: .2, la: -.5, lb: .1, ra: .5, rb: -.1, head: .5, lean: .05, lfx: -.04, rfx: .1 }), k), { ...INF7, claw: .4 });
  if (t > .95 && t < 1.4) for (let i = 0; i < 5; i++) circ(GDX + 230 + i * 30, GY - 6 - Math.sin(i) * 10, 5, '#8C6A4A', { lw: 2 });
  goldenToDusk(t);
}, [[.95, 'kneelThud'], [1.2, 'silence']]);

// 099 · Mia softens, steps closer; Dan grips her arm
S('099', (t, d) => {
  cam(1.25, 1400, 540);
  garden();
  const step = ein(t, .6, .8), grab = ein(t, 2.4, .3);
  const mj = MIA(mx7 + 60 - 120 * step, GY, 400, P({ ra: 1.2 * step, rb: .1, la: -.4 - .8 * grab, lb: .2, head: .25, lean: .06 * step }), t);
  DAN(mx7 + 260 - 120 * step, GY, 410, lerpPose(P({ ra: .9, rb: -.2, la: -.5, lb: .2 }), P({ la: -1.45, lb: .1, ra: .9, rb: -.2, lean: -.08 }), grab), t, { rifleA: .6 });
  bubble('Is… is that you?', mx7 - 120, 360, mx7 - 70, 420, t, LT('d12'), LE('d12') + 1.0);
  goldenToDusk(t);
}, [[.6, 'step'], [2.4, 'grab']]);

// 100 · ECU: the photo held out in a trembling hand
S('100', (t, d) => {
  cam(1);
  rect(-100, -100, 2200, 1300, '#F4D9B8', { lw: 0 }); rect(-100, 820, 2200, 400, K.walk, { lw: 0 });
  const out = ein(t, .4, 2.2), sh = Math.sin(t * 38) * 6;
  const hx = lerp(500, 900, out) + sh, hy = lerp(900, 560, out);
  bigArm([-100, 1300], [hx, hy], 40, 4, .25, -.4, C.ink); for (let i = 0; i < 4; i++) ink([[hx - 240 + i * 50, hy + 320 - i * 60], [hx - 160 + i * 50, hy + 230 - i * 60]], { w: 5, col: C.ginger });
  photoP(hx + 200, hy - 40, 4.0, -.08 + .01 * Math.sin(t * 38), 1);
  goldenToDusk(t);
}, [[.4, 'family'], [.4, 'paper']]);

// 101 · Mia recognises it; tears
S('101', (t, d) => {
  cam(1.9, mx7 - 40, 520);
  garden();
  const reach = ein(t, 2.4, 1.0);
  const j = MIA(mx7 - 60, GY, 400, P({ ra: 2.3 - 1.0 * reach, rb: 1.6 - 1.5 * reach, la: -.4, lb: .2, head: .2 }), t, { face: -1 });
  tearDrops(j, 400, t, .8, -1, 3); tearDrops(j, 400, t, 1.0, 1, 2);
  goldenToDusk(t);
}, [[.6, 'familyRise'], [2.4, 'cloth']]);

// 102 · POV: the instinct lights her up; the world goes grey
S('102', (t, d) => {
  const push = ss(seg(t, 0, d)); cam(lerp(1.1, 1.8, push), lerp(1250, mx7 - 60, push), lerp(560, 480, push));
  garden();
  const mj = MIA(mx7 - 60, GY, 400, P({ ra: 1.3, rb: .1, la: -.4, lb: .2, head: .2 }), t);
  LEO(lx7, GY, 400, P({}), t); DAN(dx7, GY, 410, P({ la: -1.45, lb: .1 }), t, { rifleA: .6 });
  greyAll(.95);
  halo(mj, 400, t * (1 + push * 2), .6 + .4 * push);
}, [[0, 'heartbeatLoud', { d: 5 }]]);

// 103 · control room: a wave of threads from every side
S('103', (t, d) => {
  cam(1.05, 960, 560);
  ctrlRoom(t, { threads: .9, wave: ein(t, .3, 3.5) * 1.5, alarm: true, taken: { 0: 1, 1: 1, 2: 1, 3: 1 }, lamps: { 0: 'r', 1: 'r', 2: 'r', 3: 'r' }, view: (x, y, r) => { rect(x - r, y - r, 2 * r, 2 * r, '#8A8A8A', { lw: 0 }); RAW++; const j = figure({ x, gy: y + r, S: 300 }, P({})); RAW--; halo(j, 300, t, 1); } });
  littleMe(1250, PS.hug());
  photoP(1300, 760, 1.0, .1);
  if (t > d - .4) { scr(); g.save(); g.globalAlpha = ein(t, d - .4, .3); g.fillStyle = C.ginger; g.fillRect(0, 0, W, H); g.restore(); }
}, [[0, 'alarm', { d: 5 }], [.3, 'fungusSwarm', { d: 4.5 }]]);

// 104 · the lunge; the photo spins away (slow motion)
S('104', (t, d) => {
  cam(1.15, 1050, 540);
  garden();
  const L = ein(t, .1, 1.2);
  hero({ ...ME7(), x: GDX + GDW / 2 + 160 + 300 * L }, lerpPose(P({ hy: .2, la: -.5, ra: .5, head: .5 }), P({ la: -2.0, lb: -.1, ra: 1.5, rb: .2, lean: .35, head: .2, lfx: -.12, rfx: .14 }), L), { ...INF7, claw: 1 });
  MIA(mx7 - 60, GY, 400, P({ ra: 1.3, rb: .1, la: -.4, lb: .2, lean: -.1 * L }), t);
  const u = clamp(t / d), px = GDX + 520 + 260 * u, py = 520 - 260 * Math.sin(Math.PI * u * .8);
  photoP(px, py, 1.0, u * 7, 1);
  for (let i = 0; i < 3; i++) { g.save(); g.globalAlpha = .25 - i * .07; photoP(px - 30 * (i + 1), py + 10 * (i + 1), 1.0, u * 7 - .3 * (i + 1)); g.restore(); }
  goldenToDusk(t);
}, [[.1, 'reverseWhoosh']]);

// 105 · Leo yanks Mia back; the claw misses by inches; she falls in the grass
S('105', (t, d) => {
  const [sx, sy] = shake(t, .8, 8, .3); cam(1.15, 1100, 540, sx, sy);
  garden();
  hero({ ...ME7(), x: GDX + GDW / 2 + 460 }, P({ la: -2.0, lb: -.1, ra: 1.5, rb: .2, lean: .35, head: .2, lfx: -.12, rfx: .14 }), { ...INF7, claw: 1 });
  const pull = ein(t, .1, .5), fall = ein(t, .6, .3);
  const mxp = mx7 - 60 + 200 * pull;
  if (fall < 1) MIA(mxp, GY, 400, lerpPose(P({ lean: -.2, la: -1.2, lb: .2, ra: 1.0, rb: .3 }), P({ hy: .24, lfx: -.2, rfx: .2, la: -1.2, lb: .5, ra: 1.2, rb: -.5, lean: -.2 }), fall), t);
  else MIA(mxp, GY, 400, P({ hy: .24, lfx: -.2, rfx: .2, la: -1.2, lb: .5, ra: 1.2, rb: -.5, lean: -.2 }), t);
  LEO(mxp + 160, GY, 420, P({ la: -1.6, lb: -.6, ra: .9, rb: -.3, lean: -.15 }), t, { batA: .5 });
  goldenToDusk(t);
}, [[.3, 'scuffle'], [.8, 'fallGrass'], [1.2, 'silence']]);

// 106 · BANG: a warning shot into the door frame
S('106', (t, d) => {
  const [sx, sy] = shake(t, .3, 22, .5); cam(1.05, 960, 540, sx, sy);
  garden({ splinter: ein(t, .3, .4), hole: t > .3 });
  hero({ ...ME7(), x: GDX + GDW / 2 + 460 }, P({ la: -2.0, lb: -.1, ra: 1.5, rb: .2, lean: .35, head: .2 }), { ...INF7, claw: 1 });
  const dj = DAN(dx7, GY, 410, P({ ra: -1.4, rb: -.2, la: -1.2, lb: -.4, lean: -.05 * bell(t, .3, .6) }), t, { aimAt: [GDX + GDW + 8, GY - GDH * .72] });
  if (t > .3 && t < .34 + 2 / 60) { star5(dj.muzzle[0] - 30, dj.muzzle[1], 46, '#FFF1B8'); line([dj.muzzle, [GDX + GDW + 8, GY - GDH * .72]], C.red, 5); }
  goldenToDusk(t);
}, [[.3, 'gunshot']]);

// 107 · frozen mid-lunge, locked between two commands
S('107', (t, d) => {
  cam(2.0, GDX + GDW / 2 + 470, 500);
  garden({ hole: true });
  hero({ ...ME7(), x: GDX + GDW / 2 + 460 }, tremble(P({ la: -2.0, lb: -.1, ra: 1.5, rb: .2, lean: .35, head: .2, lfx: -.12, rfx: .14 }), t, 1.5), { ...INF7, claw: 1 });
  goldenToDusk(t);
}, [[0, 'earRing', { d: 3 }]]);

// 108 · the photo lands face up in the grass
S('108', (t, d) => {
  cam(1);
  rect(-100, -100, 2200, 1300, '#B7C7A0', { lw: 0 });
  const land = ein(t, .2, .5);
  photoP(960, lerp(300, 600, land), 5.0, lerp(1.2, -.1, land), 1);
  const r = mulberry(3); for (let i = 0; i < 70; i++) { const x = r() * 2000 - 40, y = 560 + r() * 520, h = 40 + r() * 60; ink([[x, y], [x + (r() - .5) * 20, y - h]], { w: 4, col: i % 3 ? C2.leafD : C2.leaf, amp: .4 }); }
  goldenToDusk(t);
  if (t > d - 1) { const k = ein(t, d - 1, .5); bigArm([2100, -100], [lerp(2100, 1300, k * (1 - ein(t, d - .4, .3))), lerp(-100, 300, k * (1 - ein(t, d - .4, .3)))], 26, 4, .3); }
}, [[.6, 'paperLand'], [0, 'silence']]);
