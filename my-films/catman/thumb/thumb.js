// YouTube thumbnails (1920×1080 drawn, exported at 1280×720): ?v=a | b
const V = new URLSearchParams(location.search).get('v') || 'a';
function bigText(s, x, y, size, col, o = {}) { // heavy type with a paper outline so it pops on any ground
  g.save(); g.font = `700 ${size}px Jost`; g.letterSpacing = (o.track ?? -3) + 'px'; g.textAlign = o.align || 'left'; g.lineJoin = 'round';
  g.lineWidth = size * .16; g.strokeStyle = o.stroke || C.paper; g.strokeText(s, x, y); g.fillStyle = col; g.fillText(s, x, y); g.restore(); }
function sunburst(cx, cy, r, col) { circ(cx, cy, r, col, { lw: 0 }); g.save(); g.globalAlpha = .18; for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2;
  poly([[cx, cy], [cx + Math.cos(a - .1) * r * 1.6, cy + Math.sin(a - .1) * r * 1.6], [cx + Math.cos(a + .1) * r * 1.6, cy + Math.sin(a + .1) * r * 1.6]], C.ginger, { lw: 0 }); } g.restore(); }
const THUMB = {
  a() {
    // right half: a warm flat ground behind the hero
    rect(1010, 0, 910, 1080, C.wall, { lw: 0 });
    g.save(); g.beginPath(); g.rect(1010, 0, 910, 1080); g.clip(); sunburst(1460, 560, 360, '#F9E2A0'); g.restore();
    // before: plain you
    figure({ x: 470, gy: 960, S: 560, lwk: 1.7 }, pose({ la: -.5, lb: .3, ra: .5, rb: -.3, head: -.1 }));
    bigText('YOU', 470, 300, 120, C.ink, { align: 'center', track: 6 });
    // the bite: a fat red arrow
    g.save(); g.strokeStyle = C.red; g.lineWidth = 34; g.lineCap = 'round'; g.beginPath(); g.moveTo(700, 640); g.quadraticCurveTo(960, 470, 1170, 620); g.stroke(); g.restore();
    poly([[1220, 660], [1130, 660], [1196, 570]], C.red, { lw: 0 });
    bigText('1 BITE', 960, 450, 150, C.red, { align: 'center', track: 0 });
    // after: Meow Man, arms up, eyes glowing
    catK({ x: 1440, gy: 1010, S: 760, lwk: 1.6, face: -1 }, pose({ la: -2.35, lb: -.25, ra: 2.35, rb: .25, head: -.04 }), { glow: 1 });
    ground(1010, 0, 1920);
  },
  b() {
    rect(0, 0, 1920, 1080, C.paper, { lw: 0 });
    sunburst(1440, 520, 400, '#F9E2A0');
    // speed lines behind the burger
    for (let i = -3; i <= 3; i++) line([[1910, 600 + i * 30], [1700, 620 + i * 20]], C.ginger, 10);
    const J = catK({ x: 1420, gy: 1060, S: 820, lwk: 1.6 }, pose({ la: -.6, lb: .25, ra: .75, rb: -2.45, head: .12 }), { glow: 1 });
    burger(J.aR[1][0] + 40, J.aR[1][1] + 10, 2.2);
    bigText('CAT', 110, 450, 200, C.ink, {});
    bigText('POWERS?!', 110, 660, 200, C.ginger, {});
    ground(1060, 0, 1920);
  },
};
window.render = () => { scr(); paper(); g.save(); THUMB[V](); g.restore(); };
window.DUR = 1;
