// YouTube thumbnails (1920×1080, scaled to 1280×720): ?k=a | b
const KQ = new URLSearchParams(location.search).get('k') || 'a';
window.DUR = 1; window.EV = [];
window.render = () => {
  scr(); paper(); GEST = { z: 1, r: 0 };
  if (KQ === 'a') {
    cam(1);
    rect(-100, -100, 2200, 1300, '#F4D9B8', { lw: 0 });
    const j = hero({ x: 1380, gy: 1900, S: 1700, lwk: 2.2 }, P({ la: -1.9, lb: -.2, ra: .3, rb: -.1, head: .25 }), { veins: 1, stalks: 1, arms: 'both', claw: 1 });
    tearDrops(j, 1700, .5, 0, 1, 2);
    g.save(); g.setLineDash([22, 18]); line([[2000, 140], [j.Hd[0] + 40, j.Hd[1] - 60]], C.red, 8); g.restore(); circ(j.Hd[0] + 40, j.Hd[1] - 60, 18, C.red, { lw: 0 });
    text('STILL', 110, 400, { size: 230, w: 700, track: -6 }); text('ME?', 110, 620, { size: 230, w: 700, track: -6, col: C.ginger });
    label('What if you became a zombie…', 120, 720, { size: 34, col: C.ink });
  } else {
    cam(1.25, 960, 640);
    ctrlRoom(0, { threads: .85, alarm: true, taken: { 0: 1, 1: 1, 3: 1 }, lv: { 1: -.6 }, view: (x, y, r) => { rect(x - r, y - r, 2 * r, 2 * r, '#F4D9B8', { lw: 0 }); person({ x: x - 30, gy: y + r, S: 300, face: -1 }, P({ ra: 1.3, rb: 1.6 }), { bag: 1 }); } });
    littleMe(leverX(1) + 60, P({ ra: -2.4, rb: -.2, la: -2.6, lb: -.3, lean: -.18, hy: .03, lfx: -.1, rfx: .08 }));
    scr(); rect(0, 0, 1920, 210, '#24242C', { lw: 0 }); text('TRAPPED IN MY OWN BODY', 960, 150, { size: 104, w: 700, col: C.paper, align: 'center', track: -2 });
  }
  scr();
};
document.fonts.load(`600 40px ${EN}`).then(() => document.fonts.load(`700 40px ${EN}`)).then(() => { window.render(0); window.READY = true; });
