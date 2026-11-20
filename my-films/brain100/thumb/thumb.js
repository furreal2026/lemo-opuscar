// YouTube thumbnails, drawn with the film's own code at 1920×1080, exported at 1280×720: ?v=a | b
const TV = new URLSearchParams(location.search).get('v') || 'a';
// heavy type: an ink outline, then a paper outline, then the fill, so it reads on any ground and at phone size
function bigText(s, x, y, size, col, o = {}) {
  g.save(); g.font = `700 ${size}px Jost`; g.letterSpacing = (o.track ?? -3) + 'px'; g.textAlign = o.align || 'left'; g.lineJoin = 'round';
  if (o.rot) { g.translate(x, y); g.rotate(o.rot); x = 0; y = 0; }
  g.lineWidth = size * .26; g.strokeStyle = C.ink; g.strokeText(s, x, y);
  g.lineWidth = size * .14; g.strokeStyle = o.stroke || C.paper; g.strokeText(s, x, y);
  g.fillStyle = col; g.fillText(s, x, y); g.restore();
}
function burst(cx, cy, r, col, n = 18) { g.save(); g.globalAlpha = .5; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; poly([[cx, cy], [cx + Math.cos(a - .09) * r, cy + Math.sin(a - .09) * r], [cx + Math.cos(a + .09) * r, cy + Math.sin(a + .09) * r]], col, { lw: 0 }); } g.restore(); }
// the hero: a huge ginger brain head with neck and shoulders, sparks
function hero(x, y, R, o = {}) {
  const k = R / 230;
  g.save(); g.strokeStyle = C.ink; g.lineCap = 'round'; g.lineWidth = 34 * k; g.beginPath();
  g.moveTo(x, y + R); g.lineTo(x, y + R + 260 * k); g.moveTo(x - 260 * k, H + 80); g.quadraticCurveTo(x - 40 * k, y + R + 120 * k, x, y + R + 100 * k); g.quadraticCurveTo(x + 40 * k, y + R + 120 * k, x + 260 * k, H + 80); g.stroke(); g.restore();
  circ(x, y, R, o.half ? C.ginger : (o.red ? C.red : C.ginger), { lw: 0 });
  if (o.half) { g.save(); g.beginPath(); g.arc(x, y, R, -Math.PI / 2, Math.PI / 2); g.closePath(); g.clip(); circ(x, y, R, C.red, { lw: 0 }); g.restore(); }
  brainFolds(x, y, R, -Math.PI / 2, C.gingerD);
  if (o.half) { // a crack down the middle where the red half begins
    ink([[x, y - R], [x - 18 * k, y - R * .55], [x + 16 * k, y - R * .2], [x - 14 * k, y + R * .15], [x + 12 * k, y + R * .5], [x, y + R]], { w: 9 * k, sharp: true }); }
  circ(x, y, R, null, { lw: 16 * k, col: C.ink });
  if (o.spark) for (const a of [-2.3, -1.9, -1.57, -1.24, -.84]) { const c = o.red ? C.red : C.ginger; line([[x + Math.cos(a) * R * 1.18, y + Math.sin(a) * R * 1.18], [x + Math.cos(a) * R * 1.5, y + Math.sin(a) * R * 1.5]], c, 20 * k); }
  if (o.sweat) { sweat(x + R * .95, y - R * .7, 2.6 * k); sweat(x - R * 1.2, y - R * .3, 2 * k); }
}
const THUMB = {
  // A (recommended): 100% brain vs one word — the head cracks red
  a() {
    rect(0, 0, W, H, '#FBE7A1', { lw: 0 });
    burst(560, 600, 1100, '#F6D47E');
    rect(1130, 0, 790, H, '#F3D3D8', { lw: 0 }); ink([[1130, -10], [1130, H + 10]], { w: 10 });
    hero(560, 600, 270, { half: 1, spark: 1, sweat: 1 });
    // meter: brain 100 %
    rrect(130, 170, 860, 120, 30, C2.white, { lw: 10 }); rrect(150, 190, 820, 80, 18, C.ginger, { lw: 0 });
    bigText('100% BRAIN', 560, 266, 92, C.ink, { align: 'center', track: 2 });
    // the phone, tilted, one word
    withRot(1525, 560, .08, () => { phoneUI(1250, 120, 550, 860, [['Yesterday 9:58 PM', 'ts'], ['Fine.', 'her', 120]], { read: 'Read', status: 'online' }); });
    // crash arrow and stamp
    g.save(); g.strokeStyle = C.red; g.lineWidth = 30; g.lineCap = 'round'; g.beginPath(); g.moveTo(1240, 700); g.quadraticCurveTo(1060, 820, 880, 760); g.stroke(); g.restore();
    poly([[840, 740], [920, 712], [912, 800]], C.red, { lw: 0 });
    bigText('CRASH', 560, 1030, 170, C.red, { align: 'center', track: 6, rot: -.04 });
  },
  // B: a supercomputer brain vs "we need to talk" — ten million outcomes, no solution
  b() {
    rect(0, 0, W, H, '#2E3556', { lw: 0 });
    burst(820, 560, 1300, '#3B4368', 22);
    // outcome tree out of the head, ending in red Xs
    const r = mulberry(7);
    for (let i = 0; i < 26; i++) { const a = -1.3 + i * .1, L = 520 + r() * 260, x1 = 820 + Math.cos(a) * L, y1 = 560 + Math.sin(a) * L * .7; line([[820, 560], [x1, y1]], C.ginger, 6);
      line([[x1 - 14, y1 - 14], [x1 + 14, y1 + 14]], C.red, 7); line([[x1 - 14, y1 + 14], [x1 + 14, y1 - 14]], C.red, 7); }
    hero(820, 580, 270, { spark: 1, sweat: 1 });
    bigText('100%', 120, 230, 190, C.ginger, { track: -2 });
    bigText('BRAIN', 120, 400, 150, C.paper, { track: 0 });
    // her bubble
    withRot(1500, 760, -.05, () => { rrect(1180, 660, 640, 210, 40, C2.white, { lw: 12 }); g.save(); g.fillStyle = C2.white; g.beginPath(); g.moveTo(1300, 860); g.lineTo(1230, 980); g.lineTo(1400, 862); g.closePath(); g.fill(); g.restore(); ink([[1300, 866], [1230, 980], [1400, 866]], { w: 12, sharp: true });
      text('We need', 1500, 755, { size: 88, w: 700, align: 'center' }); text('to talk.', 1500, 845, { size: 88, w: 700, align: 'center', col: C.red }); });
    bigText('0 SOLUTIONS', 1500, 260, 110, C.red, { align: 'center', track: 2, rot: .05 });
  },
};
window.render = () => { scr(); paper(); g.save(); THUMB[TV](); g.restore(); };
window.DUR = 1;
