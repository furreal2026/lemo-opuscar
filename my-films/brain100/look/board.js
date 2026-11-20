// Storyboard key frames for "What if you used 100% of your brain?" — ?scene=b01 … b18
const SB = {};
const GY = 880;

// ---- B01 Hook: the impossible upgrade (bedroom, morning) ----
SB.b01 = () => {
  wall(0, GY, '#F6E7C8');
  for (let x = 40; x < W; x += 64) dline([[x, 110], [x, GY - 120]], '#EBD6AE');   // wallpaper stripes
  rect(-20, GY - 120, W + 40, 120, '#E9D3A8', { lw: 0 }); dline([[-20, GY - 120], [W + 20, GY - 120]]);
  windowW(1150, 190, 300, 260, C.sky, { sun: 1 });
  // curtains
  for (const [x0, s] of [[1110, -1], [1490, 1]]) { const P = [[x0, 160], [x0 + s * 70, 160], [x0 + s * 60, 360], [x0 + s * 90, 520], [x0 + s * 10, 520], [x0 + s * -6, 360]]; fillC(P, C.pink); ink(P, { w: 4.5, closed: true }); for (const k of [.3, .6]) ink([[x0 + s * 70 * k, 170], [x0 + s * (10 + 70 * k), 510]], { w: 1.8, col: '#C98078' }); }
  line([[1080, 160], [1520, 160]], C.ink, 8);
  // bed
  const bx = 820, bw = 640, top = 690;
  rect(bx - 30, 520, 46, GY - 520, C2.wood); rect(bx - 40, 510, 66, 20, C2.wood);
  rect(bx, top, bw, 70, '#F7F3E8'); rect(bx + 6, top + 70, bw, 40, C2.wood);
  const bl = [[bx + 150, top - 10], [bx + bw + 10, top - 4], [bx + bw + 20, top + 96], [bx + 140, top + 96]];
  fillC(bl, C.blue); ink(bl, { w: 5, closed: true });
  for (let k = 0; k < 6; k++) for (let m = 0; m < 2; m++) circ(bx + 210 + k * 80, top + 22 + m * 44, 7, '#7FA6E0', { lw: 0 });
  rrect(bx + 20, top - 50, 160, 64, 30, C2.white);
  for (const x of [bx + 30, bx + bw - 30]) rect(x - 10, top + 110, 20, GY - top - 110, C2.wood);
  // nightstand + clock + phone
  rect(1500, 700, 150, GY - 700, C2.woodL); dline([[1500, 760], [1650, 760]]); circ(1575, 730, 6, C.ink, { lw: 0 }); circ(1575, 800, 6, C.ink, { lw: 0 });
  clockW(1550, 650, 42, 7, 2); line([[1520, 692], [1510, 700]], C.ink, 4); line([[1580, 692], [1590, 700]], C.ink, 4);
  rrect(1600, 684, 40, 16, 4, C.ink, { lw: 0 });
  ground(GY, -20, W + 20);
  // you: just woke up, arms up, brain at 100 %
  brainy({ x: 1760, gy: GY, S: 400 }, pose({ la: -2.5, lb: -.25, ra: 2.5, rb: .25, head: .06 }), { spark: 1 });
  rrect(1640, 300, 240, 64, 14, C2.white, { lw: 4 }); label('Brain', 1660, 340, { col: C.ink });
  rrect(1740, 318, 120, 28, 6, C.ginger, { lw: 3 }); text('100%', 1800, 342, { size: 24, w: 600, align: 'center', col: C.ink });
  headline('What if you used', '100% of your brain?', C.ginger, 238, 92);
  label('What if?  ·  Brain upgrade', 124, 150);
  subtitle('You wake up tomorrow, and your brain is at one hundred percent.');
};

// ---- B02 Hook: a walking supercomputer… except ----
SB.b02 = () => {
  const cx = 700, gy = GY;
  // orbit of powers
  shape(() => g.ellipse(cx, 500, 330, 120, -.12, 0, Math.PI * 2), null, { lw: 3, col: C.mute });
  const orb = [[cx - 320, 520, 'book'], [cx - 120, 395, 'eq'], [cx + 210, 410, 'lang'], [cx + 310, 520, 'chip']];
  for (const [x, y, k] of orb) {
    circ(x, y, 52, C2.white, { lw: 5 });
    if (k === 'book') { poly([[x - 30, y - 22], [x, y - 14], [x, y + 26], [x - 30, y + 18]], C.sky, { lw: 3 }); poly([[x + 30, y - 22], [x, y - 14], [x, y + 26], [x + 30, y + 18]], C.sky, { lw: 3 }); }
    if (k === 'eq') text('∑x²', x, y + 12, { size: 34, w: 600, align: 'center' });
    if (k === 'lang') text('あ A', x, y + 12, { size: 30, w: 600, align: 'center' });
    if (k === 'chip') { rect(x - 22, y - 22, 44, 44, C.ginger, { lw: 4 }); for (let i = -1; i <= 1; i++) { dline([[x - 32, y + i * 12], [x - 22, y + i * 12]]); dline([[x + 22, y + i * 12], [x + 32, y + i * 12]]); } }
  }
  brainy({ x: cx, gy, S: 400 }, pose({ la: -.9, lb: -.4, ra: .9, rb: .4, head: -.05 }), { spark: 1 });
  label('A walking supercomputer', cx - 150, gy + 60);
  // the boss
  gf({ x: 1480, gy, S: 380, face: -1 }, pose({ la: -.4, lb: .2, ra: 1.1, rb: 1.6, head: .1 }));
  const ph = [1440, 600]; rrect(ph[0] - 4, ph[1] - 30, 34, 58, 7, C.ink, { lw: 0 });
  chat(1300, 420, '• • •', { size: 30, wt: 600 });
  label('Boss', 1360, 300, { col: C.red });
  rrect(1360, 314, 260, 24, 6, C2.white, { lw: 4 }); rrect(1364, 318, 252, 16, 4, C.red, { lw: 0 }); text('∞', 1640, 336, { size: 30, w: 600, col: C.red });
  ground(gy, 124, 1796);
  headline('Except…', 'there\'s one problem.', C.red, 238, 84);
  label('Hook', 124, 150);
  subtitle('Your girlfriend.');
};

// ---- B03 Chapter 1: perfect memory (the book, page 147) ----
SB.b03 = () => {
  shelf(1310, 150, 460, 3, 140, 7);
  // a reading chair
  const cx = 520;
  shape(() => g.roundRect(cx - 230, 560, 300, 260, 40), C3.teal); shape(() => g.roundRect(cx - 270, 680, 380, 120, 30), '#6AB0A5');
  rect(cx - 250, 800, 24, 80, C2.wood); rect(cx + 70, 800, 24, 80, C2.wood);
  // you, standing, holding the open book
  const f = { x: cx + 260, gy: GY, S: 400 }, j = brainy(f, pose({ la: -.9, lb: -1.6, ra: .6, rb: -2.1, head: .3 }), { spark: 0 });
  const bx = j.aR[1][0] - 70, by = j.aR[1][1] - 70;
  poly([[bx, by + 10], [bx + 80, by], [bx + 80, by + 100], [bx, by + 110]], C2.white, { lw: 4 }); poly([[bx + 80, by], [bx + 160, by + 10], [bx + 160, by + 110], [bx + 80, by + 100]], C2.white, { lw: 4 });
  for (let k = 0; k < 5; k++) { dline([[bx + 12, by + 30 + k * 14], [bx + 70, by + 26 + k * 14]], C.mute); dline([[bx + 90, by + 26 + k * 14], [bx + 148, by + 30 + k * 14]], C.mute); }
  // magnifier on the typo
  const mx = 1060, my = 400; line([[mx + 110, my + 110], [mx + 190, my + 190]], C2.wood, 22); circ(mx, my, 140, C2.white, { lw: 10 });
  text('…the cat sat on', mx - 120, my - 40, { size: 30, w: 400, col: C.mute }); text('teh', mx - 120, my + 14, { size: 54, w: 600 }); text('mat. Then the', mx - 10, my + 14, { size: 30, w: 400, col: C.mute });
  shape(() => g.ellipse(mx - 82, my - 2, 58, 36, -.08, 0, Math.PI * 2), null, { col: C.ginger, lw: 6 });
  label('page 147', mx - 46, my + 80);
  line([[bx + 80, by + 10], [mx - 40, my + 150]], C.ginger, 3, [3, 12]);
  ground(GY, 124, 1796);
  chapter(1, 'Perfect memory'); headline('Read it once.', 'Done.', C.ginger, 238, 84);
  text('300 pages · every detail', 122, 420, { size: 34, w: 500, col: C.mute });
  subtitle('…and even that suspicious typo on page 147.');
};

// ---- B04 Chapter 1: the exam ----
SB.b04 = () => {
  wall(0, GY, '#E5EEF0'); rect(-20, GY - 90, W + 40, 90, '#D3E0E4', { lw: 0 }); dline([[-20, GY - 90], [W + 20, GY - 90]]);
  // chalkboard + clock
  rect(940, 170, 800, 330, C2.wood); rect(958, 188, 764, 294, C3.board, { lw: DL });
  for (const [s, x, y] of [['FINAL EXAM', 990, 250], ['Q1.  Name every king of France', 990, 310], ['Q2.  Solve  3x² − 12 = 0', 990, 360], ['Q3.  Explain everything', 990, 410]]) text(s, x, y, { size: x === 990 && y === 250 ? 34 : 28, w: 500, col: C3.chalk });
  rect(1240, 482, 200, 14, C2.woodL); clockW(820, 230, 52, 9, 50);
  const desk = (x, w = 240) => { rect(x - w / 2, 690, w, 22, C2.woodL); rect(x - w / 2 + 14, 712, 14, GY - 712, C.ink, { lw: 0 }); rect(x + w / 2 - 28, 712, 14, GY - 712, C.ink, { lw: 0 }); rect(x - w / 2 + 40, 674, 80, 16, C2.white, { lw: 3 }); };
  // classmates staring at you (heads turned)
  for (const [x, h] of [[1180, .55], [1480, .5]]) { desk(x); plain({ x, gy: GY, S: 330 }, pose({ la: -.4, lb: -.9, ra: .4, rb: .9, head: -h, lean: -.08 })); }
  // teacher
  plain({ x: 1700, gy: GY, S: 380, face: -1 }, pose({ la: -1.9, lb: -.4, ra: .3, rb: -.2, head: -.15, lean: .05 }));
  text('?', 1740, 470, { size: 70, w: 600, col: C.mute }); text('?', 1790, 430, { size: 50, w: 600, col: C.mute });
  // you
  desk(520); const j = brainy({ x: 520, gy: GY, S: 340 }, pose({ la: -.45, lb: -.9, ra: .45, rb: .9, head: .08 }), { spark: 1 });
  thought(110, 360, 320, 180, j.Hd[0] - 30, j.Hd[1] - 50, '#FFF6EA');
  poly([[170, 390], [270, 406], [270, 504], [170, 488]], C2.white, { lw: 4 }); poly([[270, 406], [370, 390], [370, 488], [270, 504]], C2.white, { lw: 4 });
  for (let k = 0; k < 5; k++) { dline([[182, 420 + k * 15], [258, 426 + k * 15]], C.ginger); dline([[282, 426 + k * 15], [358, 420 + k * 15]], C.ginger); }
  ground(GY, -20, W + 20);
  chapter(1, 'Perfect memory'); headline('The whole', 'textbook.', C.ginger, 238, 84);
  subtitle('The teacher starts questioning your existence.');
};


// ---- B05 Chapter 1: "Fine." (the archive search, danger 98.7 %) ----
SB.b05 = () => {
  // the big phone, in your hand
  const [sx, sy, sw, sh] = phone(150, 330, 300, 560, { screen: '#F7F5F0' });
  rect(sx, sy, sw, 60, '#ECE7DE', { lw: 0 }); circ(sx + 34, sy + 30, 16, C3.hair, { lw: 2 }); text('Her', sx + 60, sy + 40, { size: 24, w: 600 });
  chat(sx + 16, sy + 110, 'I forgot your', { me: 1, size: 22, right: 0 }); chat(sx + 16, sy + 156, 'haircut, sorry!', { me: 1, size: 22 });
  chat(sx + 16, sy + 260, 'Fine.', { size: 44, wt: 600 });
  // archive search: three past "fine"s
  label('Memory search  ·  4,812 chats', 560, 340);
  const cards = [['3 months ago', 'fine ❤', 'safe', C.grass], ['2 weeks ago', 'fine.', 'hmm', C.wall], ['yesterday', 'fine', 'haircut not complimented', C.pink]];
  cards.forEach(([when, msg, note, col], i) => { const y = 370 + i * 120; rrect(560, y, 520, 96, 16, C2.white, { lw: 4 }); rect(560, y, 14, 96, col, { lw: 0 });
    label(when, 592, y + 34); text(msg, 592, y + 76, { size: 34, w: 600 }); text(note, 1060, y + 76, { size: 22, w: 500, col: C.mute, align: 'right' }); });
  for (const [k, s] of [[0, 'punctuation'], [1, 'reply time 4 min'], [2, 'weather: cloudy']]) { rrect(560 + k * 178, 740, 166, 44, 22, '#FCE2C6', { lw: 3 }); text(s, 643 + k * 178, 770, { size: 19, w: 500, align: 'center' }); }
  for (const y of [418, 538, 658]) line([[sx + sw + 30, sy + 290], [550, y]], C.ginger, 3, [3, 10]);
  // danger gauge
  const gx = 1460, gyy = 600, R = 220;
  shape(() => { g.arc(gx, gyy, R, Math.PI, 0); g.lineTo(gx + R - 50, gyy); g.arc(gx, gyy, R - 50, 0, Math.PI, true); g.closePath(); }, C2.white, { lw: 5 });
  for (const [a0, a1, c] of [[Math.PI, Math.PI * 1.45, C.grass], [Math.PI * 1.45, Math.PI * 1.75, C.wall], [Math.PI * 1.75, Math.PI * 2, C.red]]) shape(() => { g.arc(gx, gyy, R - 6, a0, a1); g.arc(gx, gyy, R - 44, a1, a0, true); g.closePath(); }, c, { lw: 0 });
  const na = Math.PI + Math.PI * .987; line([[gx, gyy], [gx + Math.cos(na) * (R - 30), gyy + Math.sin(na) * (R - 30)]], C.ink, 9); circ(gx, gyy, 16, C.ink, { lw: 0 });
  label('Danger level', gx - 90, gyy + 60); text('98.7%', gx, gyy + 150, { size: 96, w: 600, col: C.red, align: 'center', track: -2 });
  text('after 17 minutes of calculations', gx, gyy + 196, { size: 24, w: 400, col: C.mute, align: 'center' });
  chapter(1, 'Perfect memory'); headline('"Fine."', null, C.ink, 238, 92);
  text('Just one word.', 122, 300, { size: 34, w: 500, col: C.mute });
  subtitle('Danger level: 98.7 percent.');
};

// ---- B06 Chapter 2: chess, checkmate in twelve ----
SB.b06 = () => {
  wall(0, GY, '#EEE6F4');
  // window + chess computer with a coffee
  windowW(1060, 200, 220, 170, C.sky);
  const mx = 1520; rect(mx, 300, 260, 180, C.ink); rect(mx + 14, 314, 232, 152, '#D6ECF5', { lw: 0 }); rect(mx + 110, 480, 40, 50, C.ink, { lw: 4 }); rect(mx + 60, 528, 140, 14, C.ink, { lw: 0 });
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) if ((r + c) % 2) rect(mx + 30 + c * 22, 330 + r * 22, 22, 22, '#9DB5C2', { lw: 0 });
  text('BRB', mx + 190, 390, { size: 26, w: 600, align: 'center' }); text('☕', mx + 190, 440, { size: 34, w: 400, align: 'center' });
  rect(mx - 60, 542, 380, 18, C2.woodL); rect(mx - 40, 560, 16, GY - 560, C2.wood); rect(mx + 280, 560, 16, GY - 560, C2.wood);
  // chess table in 3/4
  tableP(620, 1300, 640, GY, 60, 26);
  const B = (u, v) => { const y = lerp(642 - 58, 640 - 6, v); const xl = lerp(620 + 92, 650, v), xr = lerp(1300 - 92, 1270, v); return [lerp(xl, xr, u), y]; };
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { const a = B(c / 8, r / 8), b = B((c + 1) / 8, r / 8), d = B((c + 1) / 8, (r + 1) / 8), e = B(c / 8, (r + 1) / 8); fillP([a, b, d, e], (r + c) % 2 ? '#8A6B4E' : '#EFE2C8'); }
  ink([B(0, 0), B(1, 0), B(1, 1), B(0, 1), B(0, 0)], { w: 3.4, sharp: true });
  const piece = (u, v, col, k = 1) => { const [x, y] = B(u, v); shape(() => g.ellipse(x, y - 4, 13 * k, 5 * k, 0, 0, Math.PI * 2), col, { lw: 3 }); poly([[x - 9 * k, y - 4], [x - 5 * k, y - 30 * k], [x + 5 * k, y - 30 * k], [x + 9 * k, y - 4]], col, { lw: 3 }); circ(x, y - 36 * k, 8 * k, col, { lw: 3 }); };
  for (const [u, v] of [[.12, .2], [.3, .15], [.55, .3], [.7, .12], [.85, .25]]) piece(u, v, '#3A3530');
  for (const [u, v] of [[.2, .8], [.45, .7], [.6, .85], [.8, .75], [.35, .55]]) piece(u, v, '#FBFAF6');
  // predicted moves (ginger), many steps ahead
  const pr = [[.45, .7], [.6, .45], [.4, .3], [.62, .18], [.78, .12]]; for (let i = 0; i < pr.length - 1; i++) { const a = B(...pr[i]), b = B(...pr[i + 1]); line([[a[0], a[1] - 50], [b[0], b[1] - 50]], C.ginger, 5, [2, 12]); }
  { const e = B(.78, .12); circ(e[0], e[1] - 50, 14, C.ginger, { lw: 3 }); }
  // the players
  brainy({ x: 470, gy: GY, S: 370 }, pose({ la: -.4, lb: -.6, ra: .9, rb: .8, head: .12 }), { spark: 1 });
  const j = plain({ x: 1440, gy: GY, S: 370, face: -1 }, pose({ la: -1.1, lb: -1.9, ra: .6, rb: 1.6, head: -.25, lean: -.05 }));
  sweat(j.Hd[0] + 50, j.Hd[1] - 60, 1.1);
  ground(GY, -20, W + 20);
  chapter(2, 'Super processing speed'); headline('Checkmate', 'in 12 moves.', C.ginger, 238, 84);
  subtitle('Even a chess computer might need a coffee break.');
};

// ---- B07 Chapter 2: the dress question, ten million outcomes ----
SB.b07 = () => {
  // her side: wardrobe + standing mirror
  rect(1450, 300, 330, GY - 300, C2.woodL); dline([[1615, 316], [1615, GY - 20]]); circ(1600, 600, 7, C.ink, { lw: 3 }); circ(1630, 600, 7, C.ink, { lw: 3 });
  for (const x of [1490, 1650]) rect(x, 340, 110, 200, null, { lw: DL });
  shape(() => g.ellipse(1250, 560, 90, 170, 0, 0, Math.PI * 2), C2.wood); shape(() => g.ellipse(1250, 560, 72, 150, 0, 0, Math.PI * 2), '#DCEFF6', { lw: DL });
  ink([[1215, 470], [1260, 430]], { w: 6, col: '#FFFFFF' }); line([[1210, 728], [1180, GY]], C.ink, 8); line([[1290, 728], [1320, GY]], C.ink, 8);
  gf({ x: 1440, gy: GY, S: 390, face: -1 }, pose({ la: -1.3, lb: -1.7, ra: .5, rb: .3, head: .05 }), { dress: 1 });
  bubble(1240, 170, 540, 120, ['Do you think I look', 'fat in this dress?'], { tx: 1420, ty: 400, size: 34 });
  // your side: options and the outcome tree
  const j = brainy({ x: 300, gy: GY, S: 380 }, pose({ la: -.6, lb: -.3, ra: 1.0, rb: 1.9, head: .1 }), { spark: 1 });
  const root = [j.Hd[0] + 70, j.Hd[1] - 10];
  const opts = [['A', 'Tell the truth', 380], ['B', 'Say she looks beautiful', 520], ['C', 'Pretend you didn\'t hear', 660]];
  const r = mulberry(5);
  opts.forEach(([k, s, y]) => { line([root, [520, y]], C.ginger, 4);
    for (let i = 0; i < 6; i++) { const yy = y - 50 + i * 20; line([[860, y], [1010, yy + (r() - .5) * 8]], C.ginger, 2); const X = [1018, yy]; line([[X[0] - 7, X[1] - 7], [X[0] + 7, X[1] + 7]], C.red, 3); line([[X[0] - 7, X[1] + 7], [X[0] + 7, X[1] - 7]], C.red, 3); }
    rrect(520, y - 34, 340, 68, 16, k === 'B' ? '#FCE2C6' : C2.white, { lw: 4 }); text(k, 548, y + 13, { size: 38, w: 600, col: C.ginger }); text(s, 590, y + 11, { size: 26, w: 500 }); });
  label('10,000,000 outcomes simulated', 520, 300);
  ground(GY, -20, W + 20);
  chapter(2, 'Super processing speed'); headline('Option B.', null, C.ginger, 238, 84);
  subtitle('"So you\'re saying I looked ugly yesterday?"');
};
SB.b07e = () => { SB.b07(); errorCard(560, 360, 640, 260, 'SYSTEM ERROR', 'No solution found.'); };

// ---- B08 Chapter 3: Einstein and the chalkboard ----
function einsteinRoom(withDoor) {
  wall(0, GY, '#EFE7D7'); rect(-20, GY - 70, W + 40, 70, '#D9CBB0', { lw: 0 }); dline([[-20, GY - 70], [W + 20, GY - 70]]);
  g.save(); g.translate(90, 0);
  rect(620, 170, 900, 400, C2.wood); rect(640, 190, 860, 360, C3.board, { lw: DL }); rect(900, 552, 340, 14, C2.woodL);
  text('E = mc²', 680, 280, { size: 64, w: 500, col: C3.chalk });
  text('t′ = t / √(1 − v²/c²)', 680, 360, { size: 34, w: 400, col: C3.chalk });
  // warped spacetime grid with a planet
  g.save(); g.strokeStyle = C3.chalk; g.lineWidth = 2.4; g.globalAlpha = .9;
  const cx = 1290, cy = 400; for (let i = -5; i <= 5; i++) { g.beginPath(); for (let k = -6; k <= 6; k++) { const x = cx + k * 30, y0 = cy + i * 14, d = Math.hypot(k * 30, i * 30); const y = y0 + 60 * Math.exp(-d * d / 9000); k === -6 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); }
  for (let k = -6; k <= 6; k++) { g.beginPath(); for (let i = -5; i <= 5; i++) { const x = cx + k * 30, y0 = cy + i * 14, d = Math.hypot(k * 30, i * 30); const y = y0 + 60 * Math.exp(-d * d / 9000); i === -5 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); }
  g.restore(); circ(cx, cy + 34, 34, C.wall, { lw: 4 });
  g.restore();
  // a desk with paper piles, a pipe of chalk, a clock
  rect(180, 700, 330, 22, C2.woodL); rect(200, 722, 18, GY - 722, C2.wood); rect(470, 722, 18, GY - 722, C2.wood);
  for (let k = 0; k < 6; k++) rect(220 + (k % 2) * 4, 690 - k * 10, 120, 10, C2.white, { lw: 3 }); for (let k = 0; k < 4; k++) rect(380 - (k % 2) * 3, 690 - k * 10, 100, 10, C2.white, { lw: 3 });
  clockW(1720, 220, 50, 2, 30);
  if (withDoor) { rect(1600, 300, 220, GY - 300, '#B97C47'); rect(1620, 320, 180, GY - 320, '#FBE7A1', { lw: DL }); circ(1612, 610, 8, C.wall, { lw: 3 }); }
}
SB.b08 = () => {
  einsteinRoom(false);
  einstein({ x: 1660, gy: GY, S: 400, face: -1 }, pose({ la: -1.9, lb: -.9, ra: .35, rb: -.3, head: -.1 }));
  rrect(1700, 520, 0, 0, 0, null, { lw: 0 });
  ground(GY, -20, W + 20);
  chapter(3, 'The Einstein question'); text('No secret', 118, 238, { size: 84, w: 600, track: -2 }); text('brain switch.', 118, 329, { size: 84, w: 600, track: -2, col: C.ginger });
  rrect(124, 420, 560, 210, 18, C2.white, { lw: 4 }); label('Myth', 150, 462, { col: C.red }); text('"Einstein used', 150, 510, { size: 30, w: 500 }); text('only 10% of his brain"', 150, 550, { size: 30, w: 500 });
  line([[150, 500], [520, 570]], C.red, 7);
  label('Real: maths · imagination · work', 150, 600);
  subtitle('There is no scientific evidence for a "brain percentage".');
};

// ---- B09 Chapter 3: a different theory of relativity ----
SB.b09 = () => {
  einsteinRoom(true);
  einstein({ x: 1200, gy: GY, S: 400, face: -1 }, pose({ la: -1.8, lb: -.7, ra: .4, rb: -.4, head: -.18 }));
  gf({ x: 1700, gy: GY, S: 380, face: -1 }, pose({ la: -.5, lb: .3, ra: .9, rb: 2.3, head: .1 }));
  bubble(1420, 170, 460, 100, 'Baby, what are you thinking about?', { tx: 1660, ty: 400, size: 26 });
  bubble(700, 600, 400, 90, 'The curvature of spacetime.', { tx: 1140, ty: 520, size: 26, fill: '#FFF6EA' });
  ground(GY, -20, W + 20);
  chapter(3, 'The Einstein question'); headline('A different', 'theory of relativity.', C.red, 238, 70);
  subtitle('"Okay. So you\'re not thinking about me?"');
};

// ---- B10 Chapter 4: the goalkeeper's prediction ----
SB.b10 = () => {
  rect(-20, 540, W + 40, GY - 540 + 200, C3.field, { lw: 0 });
  for (let i = 0; i < 8; i++) { const x0 = -200 + i * 300; poly([[x0, 540], [x0 + 150, 540], [x0 + 150 + (i - 4) * 60, GY + 200], [x0 + (i - 4) * 60, GY + 200]], C3.fieldD, { lw: 0 }); }
  rect(-20, 470, W + 40, 70, '#D9E7EF', { lw: 0 });
  for (let x = 0; x < W; x += 36) { circ(x + 18, 500, 12, ['#E8A0A0', '#A9D8EC', '#F6D47E', '#93C86E'][(x / 36) % 4], { lw: 2 }); }
  dline([[-20, 540], [W + 20, 540]]);
  // goal (3/4)
  const gx0 = 1180, gx1 = 1760, gt = 400, gb = 840;
  g.save(); g.globalAlpha = .55; for (let x = gx0; x <= gx1; x += 26) ORIG.line([[x, gt], [x + 60, gt - 40], [x + 60, gb - 40]], C.ink, 1.5); for (let y = gt; y <= gb; y += 26) ORIG.line([[gx0 + 60, y - 40], [gx1 + 60, y - 40]], C.ink, 1.5); g.restore();
  line([[gx0, gb], [gx0, gt], [gx1, gt], [gx1, gb]], C2.white, 18); line([[gx0, gb], [gx0, gt], [gx1, gt], [gx1, gb]], C.ink, 4);
  line([[gx0 - 300, gb + 20], [gx1 + 160, gb + 20]], '#FFFFFF', 6);
  // striker
  plain({ x: 420, gy: GY, S: 380, face: 1, prof: true }, pose({ lean: -.12, la: -1.4, lb: .3, ra: 1.0, rb: .2, rfx: .2, rfy: .16, lfx: -.06, head: .05 }));
  // ball + predicted path
  const ball = [760, 640]; dashedP([[560, 860], [760, 640], [1150, 470], [1560, 430]]);
  circ(1560, 430, 44, null, { col: C.ginger, lw: 6 }); circ(1560, 430, 22, C.ginger, { lw: 0 });
  circ(ball[0], ball[1], 30, '#FFFFFF', { lw: 5 }); poly([[ball[0] - 8, ball[1] - 10], [ball[0] + 8, ball[1] - 10], [ball[0] + 12, ball[1] + 4], [ball[0], ball[1] + 13], [ball[0] - 12, ball[1] + 4]], C.ink, { lw: 0 });
  for (const k of [1, 2, 3]) line([[ball[0] - 30 - k * 26, ball[1] + 26 + k * 18], [ball[0] - 50 - k * 26, ball[1] + 40 + k * 18]], C.mute, 3);
  // keeper (you) already diving to the right spot
  brainy({ x: 1470, gy: GY - 40, S: 380 }, pose({ lean: .55, la: -1.2, lb: -.3, ra: 2.5, rb: .3, lfx: -.18, rfx: .12, rfy: .1, head: .3, hy: .03 }), { spark: 1 });
  chapter(4, 'The athlete brain'); headline('Prediction,', 'not magic.', C.ginger, 238, 84);
  text('Years of training: timing, reaction, reading the body.', 122, 420, { size: 30, w: 500, col: C.mute });
  subtitle('Their brain anticipates where the ball might go.');
};
function dashedP(P) { g.save(); g.strokeStyle = C.ginger; g.lineWidth = 6; g.setLineDash([2, 16]); g.lineCap = 'round'; g.beginPath(); g.moveTo(...P[0]); g.bezierCurveTo(...P[1], ...P[2], ...P[3]); g.stroke(); g.restore(); }

// ---- B11 Chapter 4: the household goalkeeper ----
SB.b11 = () => {
  wall(0, GY, '#E3EEDC'); rect(-20, GY - 40, W + 40, 40, '#C9DDBE', { lw: 0 });
  frameArt(860, 300, 200, 150, 'hill'); frameArt(1460, 230, 160, 200, 'x'); text('HOME', 1540, 340, { size: 26, w: 600, align: 'center' });
  lampFloor(180, GY);
  // sofa
  const sx = 640; rrect(sx, 560, 640, 200, 40, C.pink); rrect(sx - 40, 640, 90, 180, 30, '#E8928A'); rrect(sx + 590, 640, 90, 180, 30, '#E8928A');
  rrect(sx + 20, 700, 600, 100, 24, '#F2B4AD'); dline([[sx + 320, 706], [sx + 320, 796]], '#C98078'); for (const x of [sx + 10, sx + 610]) rect(x, 820, 20, GY - 820, C2.wood);
  shape(() => g.ellipse(960, GY + 6, 520, 26, 0, 0, Math.PI * 2), C2.rugL || '#7FA6E0', { lw: 4 });
  // family throwing pillows
  plain({ x: 800, gy: GY - 110, S: 300 }, pose({ la: -2.2, lb: -.5, ra: .5, rb: .2, head: .1, lean: .1 }));
  plain({ x: 1060, gy: GY - 110, S: 330 }, pose({ la: -.5, lb: -.2, ra: 2.4, rb: .4, head: -.05, lean: -.1 }));
  plain({ x: 1340, gy: GY, S: 220, face: -1 }, pose({ la: -2.3, lb: -.3, ra: 2.3, rb: .3, head: .1 }));
  for (const [x, y, a] of [[1450, 360, .3], [1620, 520, -.4]]) withRot(x, y, a, () => { rrect(x - 50, y - 34, 100, 68, 20, C3.lilac); dline([[x - 30, y], [x + 30, y]], '#9C88C6'); });
  for (const [x, y] of [[1380, 380], [1550, 540]]) line([[x, y], [x - 60, y + 10]], C.mute, 3);
  // you: dodging, catching the ball one-handed
  const j = brainy({ x: 1720, gy: GY, S: 390, face: -1 }, pose({ lean: .3, la: -2.4, lb: -.5, ra: .8, rb: .4, head: .35, lfx: -.08, rfx: .1 }), { spark: 1 });
  const h = j.aL[1]; circ(h[0] - 10, h[1] - 26, 32, '#FFFFFF', { lw: 5 }); poly([[h[0] - 18, h[1] - 36], [h[0] - 2, h[1] - 36], [h[0] + 2, h[1] - 22], [h[0] - 10, h[1] - 14], [h[0] - 22, h[1] - 22]], C.ink, { lw: 0 });
  bubble(1440, 600, 270, 80, 'Calculated.', { tx: 1650, ty: 540, size: 30 });
  ground(GY, -20, W + 20);
  chapter(4, 'The athlete brain'); headline('The household', 'goalkeeper.', C.ginger, 238, 84);
  subtitle('Suddenly, your entire family is testing your reflexes.');
};

// ---- B12 Chapter 4: what day is today? ----
SB.b12 = () => {
  wall(0, GY, '#F3E3E6');
  // calendar
  const cx = 700, cy = 180, cw = 560, ch = 520; rect(cx, cy, cw, ch, C2.white); rect(cx, cy, cw, 90, C.red, { lw: 0 }); ink([[cx, cy + 90], [cx + cw, cy + 90]], { w: 4 });
  for (const x of [cx + 120, cx + cw - 120]) { rrect(x - 10, cy - 24, 20, 50, 8, C2.chrome, { lw: 3 }); }
  text('MAY', cx + cw / 2, cy + 62, { size: 44, w: 600, col: C.paper, align: 'center', track: 4 });
  for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++) { const n = r * 7 + c + 1; if (n > 31) continue; const x = cx + 20 + c * 76, y = cy + 110 + r * 78; ORIG.line([[x, y], [x + 70, y]], C.tint, 2); text(String(n), x + 6, y + 30, { size: 22, w: 500, col: C.mute });
    if (n === 14) { text('♥', x + 40, y + 62, { size: 30, w: 400, col: C.red, align: 'center' }); circ(x + 36, y + 38, 34, null, { col: C.red, lw: 4 }); }
    if (n === 3 || n === 22) circ(x + 36, y + 38, 30, null, { col: C.mute, lw: 3 }); }
  // scanning beam
  g.save(); g.globalAlpha = .28; poly([[560, 470], [cx + 20, cy + 110], [cx + 20, cy + ch - 20]], C.ginger, { lw: 0 }); g.restore();
  label('scanning: anniversaries · birthdays · first dates', cx, cy + ch + 46);
  const j = brainy({ x: 470, gy: GY, S: 390 }, pose({ la: -.5, lb: .2, ra: 1.0, rb: 1.9, head: .05 }), { spark: 1 });
  bubble(124, 400, 360, 110, ['Of course! Our', 'six-month anniversary.'], { tx: 440, ty: 560, size: 26 });
  gf({ x: 1560, gy: GY, S: 390, face: -1 }, pose({ la: .9, lb: -1.7, ra: -.9, rb: 1.7, head: -.05 }));
  bubble(1360, 300, 440, 110, ['It\'s our', 'SEVEN-month anniversary.'], { tx: 1540, ty: 470, size: 28, col: C.red });
  ground(GY, -20, W + 20);
  chapter(4, 'The athlete brain');
  subtitle('Your reflexes were perfect. Your survival instincts were not.');
};

// ---- B13 Chapter 5: neuroplasticity, people as neurons holding hands ----
SB.b13 = () => {
  const gy = 820, n = 7, S = 260, x0 = 520, step = 175;
  const lit = 4.4;   // the pulse has reached this far
  const J = [];
  for (let i = 0; i < n; i++) { const x = x0 + i * step, isLit = i < lit;
    const p = pose({ la: i === 0 ? -.5 : -1.35, lb: i === 0 ? .2 : -.05, ra: i === n - 1 ? .5 : 1.35, rb: i === n - 1 ? -.2 : .05, head: .04 * Math.sin(i * 1.7) });
    J.push(isLit ? brainy({ x, gy, S }, p) : plain({ x, gy, S, col: C.ink }, p)); }
  // the accent run along the joined arms
  for (let i = 0; i < n - 1; i++) { if (i + 1 >= lit) break; const a = J[i].Sh, b = J[i + 1].Sh, m = [(J[i].aR[1][0] + J[i + 1].aL[1][0]) / 2, (J[i].aR[1][1] + J[i + 1].aL[1][1]) / 2];
    g.save(); g.strokeStyle = C.ginger; g.lineWidth = 6; g.lineCap = 'round'; g.beginPath(); g.moveTo(...a); g.quadraticCurveTo(m[0], m[1] + 6, b[0], b[1]); g.stroke(); g.restore(); }
  ground(gy, 124, 1796);
  for (let i = 0; i < n; i++) circ(x0 + i * step, gy, 9, i < lit ? C.ginger : C.tint, { lw: 3 });
  // their / there / they're cards
  const words = [['their', 'belongs to them'], ['there', 'a place'], ['they\'re', 'they are']];
  words.forEach(([w, m], i) => { const x = 1080 + i * 250, y = 230; rrect(x, y, 220, 120, 16, C2.white, { lw: 4 }); text(w, x + 110, y + 62, { size: 40, w: 600, align: 'center' }); text(m, x + 110, y + 98, { size: 20, w: 500, col: C.mute, align: 'center' }); if (i < 2) line([[x + 220, y + 60], [x + 250, y + 60]], C.ginger, 4); });
  chapter(5, 'Learning at super speed'); headline('Neuroplasticity', null, C.ink, 238, 84);
  text('Practice rewires the connections.', 122, 310, { size: 36, w: 500, col: C.ginger });
  subtitle('Every time you practise something, your brain adapts.');
};

// ---- B14 Chapter 5: extra wasabi ----
SB.b14 = () => {
  wall(0, GY, '#F2E6D2');
  // noren curtain + lanterns + menu
  rect(740, 150, W - 700, 18, C2.wood);
  for (let k = 0; k < 4; k++) { const x = 770 + k * 170; rect(x, 168, 160, 170, '#3D5A80'); circ(x + 80, 250, 34, null, { col: C.paper, lw: 5 }); }
  for (const x of [1680, 1800]) { line([[x, 168], [x, 200]], C.ink, 3); rrect(x - 44, 200, 88, 120, 40, C3.lantern); for (const y of [230, 260, 290]) dline([[x - 40, y], [x + 40, y]], '#C99A3A'); rect(x - 26, 194, 52, 10, C.ink, { lw: 0 }); rect(x - 26, 316, 52, 10, C.ink, { lw: 0 }); }
  rect(1620, 380, 220, 300, C2.wood); rect(1636, 396, 188, 268, '#FFFDF5', { lw: DL });
  label('Menu', 1660, 436, { col: C.ink }); for (const [i, s] of [['Salmon', '¥480'], ['Tuna', '¥520'], ['Ramen', '¥900'], ['Wasabi', 'free']].entries()) { text(s[0], 1656, 486 + i * 44, { size: 24, w: 500 }); text(s[1], 1806, 486 + i * 44, { size: 24, w: 500, col: C.mute, align: 'right' }); }
  // counter
  rect(300, 700, 1300, 30, C2.woodL); rect(320, 730, 1260, GY - 730, '#B97C47'); for (let x = 380; x < 1560; x += 120) dline([[x, 740], [x, GY - 10]], '#9A6337');
  // waiter behind the counter (headband)
  const wj = plain({ x: 1250, gy: 900, S: 400, face: -1 }, pose({ la: -1.1, lb: -.9, ra: .3, rb: .2, head: -.05 }));
  line([[wj.Hd[0] - 44, wj.Hd[1] - 12], [wj.Hd[0] + 44, wj.Hd[1] - 12]], C.paper, 10); line([[wj.Hd[0] - 44, wj.Hd[1] - 18], [wj.Hd[0] + 44, wj.Hd[1] - 18]], C.ink, 3);
  bubble(1240, 300, 330, 90, 'Wasabi, extra?', { tx: 1270, ty: 420, size: 30 });
  // plate with sushi + wasabi
  shape(() => g.ellipse(860, 690, 170, 26, 0, 0, Math.PI * 2), C2.white, { lw: 4 });
  for (const [x, top] of [[760, C3.salmon], [860, C3.tuna]]) { rrect(x - 40, 650, 80, 36, 12, C3.rice, { lw: 3 }); rrect(x - 44, 638, 88, 22, 10, top, { lw: 3 }); for (const k of [-20, 0, 20]) dline([[x + k - 6, 642], [x + k + 6, 656]], '#FFFFFF'); }
  const wb = [[930, 684], [940, 652], [962, 640], [986, 652], [994, 684]]; fillC(wb, C3.wasabi); ink(wb.concat([wb[0]]), { w: 3.4 });
  // you: red head, steam
  const j = brainy({ x: 520, gy: 900, S: 400 }, pose({ la: -2.3, lb: -.4, ra: 2.3, rb: .4, head: -.1 }), { red: 1 });
  for (const sd of [-1, 1]) for (const k of [0, 1]) { const x = j.Hd[0] + sd * (40 + k * 26), y = j.Hd[1] - 60 - k * 20; ink([[x, y], [x + sd * 10, y - 22], [x, y - 44], [x + sd * 10, y - 66]], { w: 4, col: C.mute }); }
  text('5 seconds later', 124, 420, { size: 30, w: 500, col: C.mute });
  chapter(5, 'Learning at super speed'); headline('You understand', 'everything.', C.ginger, 238, 76);
  subtitle('Apparently, intelligence doesn\'t protect your tongue.');
};

// ---- B15 Chapter 6: the energy problem ----
SB.b15 = () => {
  // the comparison: 2 % weight vs 20 % energy
  const j = plain({ x: 300, gy: GY, S: 420 }, pose({ la: -.4, lb: .1, ra: .4, rb: -.1 }));
  circ(j.Hd[0], j.Hd[1], GEO.headR * 420 * .82, C.ginger, { lw: 0 }); brainFolds(j.Hd[0], j.Hd[1], GEO.headR * 420, -Math.PI / 2, C.gingerD); circ(j.Hd[0], j.Hd[1], GEO.headR * 420, null, { lw: 7, col: C.ink });
  const bx = 520, by = 820, bh = 420;
  for (const [i, v, lab, val] of [[0, .02, 'body weight', '2%'], [1, .20, 'energy at rest', '20%']]) { const x = bx + i * 200, h = Math.max(10, bh * v / .2);
    rect(x, by - h, 120, h, i ? C.ginger : '#F6C796'); label(lab, x - 6, by + 40); text(val, x + 60, by - h - 20, { size: 54, w: 600, align: 'center', col: i ? C.ginger : C.ink }); }
  line([[bx - 20, by], [bx + 360, by]], C.ink, 4);
  // fridge, open, with a "?"
  const fx = 1000; rrect(fx, 330, 240, GY - 330, 18, C2.white); dline([[fx, 560], [fx + 240, 560]]); rect(fx + 200, 380, 12, 120, C2.chrome, { lw: 3 }); rect(fx + 200, 600, 12, 160, C2.chrome, { lw: 3 });
  poly([[fx + 240, 560], [fx + 380, 600], [fx + 380, GY - 10], [fx + 240, GY]], '#EAF4F7');
  for (const y of [660, 760]) dline([[fx + 250, y], [fx + 372, y + 8]]); rrect(fx + 270, 620, 40, 40, 8, C3.olive, { lw: 3 }); rrect(fx + 320, 720, 34, 46, 6, C.sky, { lw: 3 });
  text('?', fx + 120, 470, { size: 120, w: 600, col: C.mute, align: 'center' });
  // 17 energy drinks
  const can = (x, y) => { rrect(x, y, 44, 80, 8, '#7FC3B8', { lw: 3.5 }); rect(x, y + 28, 44, 24, C.ink, { lw: 0 }); text('⚡', x + 22, y + 48, { size: 20, w: 600, col: C.wall, align: 'center' }); };
  let k = 0; for (let r = 0; r < 5; r++) for (let c = 0; c < 5 - r; c++) { if (k++ >= 15) break; can(1460 + c * 50 + r * 25, GY - 84 - r * 84); }
  can(1720, GY - 84); can(1772, GY - 84);
  label('×17', 1740, GY - 110, { col: C.ink });
  // heart as a washing machine
  const hx = 1690, hy = 380; rrect(hx - 90, hy - 100, 180, 200, 18, C2.white); circ(hx, hy + 14, 58, C.heart, { lw: 5 });
  const hp = [[hx, hy + 46], [hx - 36, hy + 8], [hx - 26, hy - 18], [hx, hy - 6], [hx + 26, hy - 18], [hx + 36, hy + 8]]; fillC(hp, '#B83B3B'); ink(hp, { w: 3, closed: true });
  for (const s of [-1, 1]) line([[hx + s * 110, hy - 40], [hx + s * 130, hy - 10]], C.mute, 4);
  ground(GY, 124, 1796);
  chapter(6, 'The energy problem'); headline('2% of you.', '20% of the energy.', C.ginger, 238, 76);
  subtitle('…for something that forgets why you opened the fridge.');
};

// ---- B16 Chapter 6: "Can we talk?" — the control room inside your head ----
SB.b16 = () => {
  // the head, huge, cut open: three departments
  const cx = 1040, cy = 530, R = 380;
  circ(cx, cy, R, '#FCE2C6', { lw: 9 }); g.save(); g.beginPath(); g.arc(cx, cy, R - 6, 0, Math.PI * 2); g.clip();
  rect(cx - R, cy + 140, 2 * R, 300, '#F6C796', { lw: 0 }); dline([[cx - R, cy + 140], [cx + R, cy + 140]]);
  dline([[cx - 140, cy - R], [cx - 140, cy + 140]]); dline([[cx + 140, cy - R], [cx + 140, cy + 140]]);
  // memory: filing cabinets
  for (let k = 0; k < 2; k++) { rect(cx - 330 + k * 96, cy - 60, 82, 200, C2.chrome); for (let d = 0; d < 3; d++) { dline([[cx - 330 + k * 96, cy - 60 + (d + 1) * 66], [cx - 248 + k * 96, cy - 60 + (d + 1) * 66]]); rect(cx - 306 + k * 96, cy - 32 + d * 66, 34, 8, C.ink, { lw: 0 }); } }
  for (let k = 0; k < 6; k++) withRot(cx - 260 + k * 18, cy - 120 - k * 14, k * .5, () => rect(cx - 280 + k * 18, cy - 140 - k * 14, 40, 52, C2.white, { lw: 3 }));
  // emotion: the alarm light
  rect(cx - 50, cy - 260, 100, 30, C.ink, { lw: 0 }); shape(() => { g.arc(cx, cy - 260, 54, Math.PI, 0); g.closePath(); }, C.red, { lw: 5 });
  for (const a of [-2.6, -2.1, -1.57, -1.05, -.5]) line([[cx + Math.cos(a) * 74, cy - 262 + Math.sin(a) * 74], [cx + Math.cos(a) * 110, cy - 262 + Math.sin(a) * 110]], C.red, 6);
  // reasoning: a whiteboard full of branches
  rect(cx + 180, cy - 200, 200, 150, C2.white); for (let k = 0; k < 4; k++) { line([[cx + 210, cy - 125], [cx + 330, cy - 180 + k * 36]], C.ginger, 3); text('?', cx + 350, cy - 168 + k * 36, { size: 22, w: 600, col: C.red }); }
  g.restore();
  // workers (small figures) in each department, all panicking
  for (const [x, a] of [[cx - 230, 1], [cx, -1], [cx + 260, 1], [cx - 80, 1], [cx + 120, -1]]) plain({ x, gy: cy + 140, S: 190, face: a }, pose({ la: -2.4, lb: -.3, ra: 2.4, rb: .3, head: .1 * a }));
  for (const [s, x] of [['Memory', cx - 320], ['Emotion', cx - 70], ['Reasoning', cx + 180]]) label(s, x, cy + 190, { col: C.ink });
  meterBar(cx - 200, cy + 250, 400, .98, C.red, 'Processing load', '');
  // the phone
  const [sx, sy, sw] = phone(1580, 360, 220, 410, { screen: '#F7F5F0' }); chat(sx + 12, sy + 120, 'Can we talk?', { size: 26, wt: 600 });
  chapter(6, 'The energy problem'); headline('"Can we talk?"', null, C.ink, 238, 84);
  subtitle('…for a conversation about her Instagram picture.');
};

// ---- B17 Chapter 7: the orchestra ----
SB.b17 = () => {
  // stage
  rect(-20, 700, W + 40, GY - 700 + 20, '#C98F5A', { lw: 0 }); for (let x = 0; x < W; x += 90) dline([[x, 704], [x + 30, GY]], '#A87445'); dline([[-20, 700], [W + 20, 700]]);
  for (const [x0, s] of [[-20, 1], [W + 20, -1]]) { const P = [[x0, 380], [x0 + s * 110, 380], [x0 + s * 80, 540], [x0 + s * 120, 700], [x0, 700]]; fillC(P, '#B8443A'); ink(P, { w: 5, closed: true }); for (const k of [.3, .6]) ink([[x0 + s * 110 * k, 390], [x0 + s * 110 * k + s * 12, 690]], { w: 2, col: '#8E2F28' }); }
  rect(-20, 360, W + 40, 26, '#8E2F28');
  const gy = 820;
  // conductor
  const cj = plain({ x: 960, gy, S: 360 }, pose({ la: -2.2, lb: -.6, ra: 1.3, rb: .6, head: -.05 })); line([cj.aL[1], [cj.aL[1][0] - 50, cj.aL[1][1] - 60]], C.ink, 4);
  // violin
  const v = plain({ x: 380, gy, S: 300, face: 1 }, pose({ la: -1.6, lb: -1.2, ra: 1.2, rb: 1.6, head: .3 }));
  withRot(v.N[0] + 30, v.N[1] + 10, -.6, () => { shape(() => g.ellipse(v.N[0] + 40, v.N[1] + 10, 46, 22, 0, 0, Math.PI * 2), '#B9652F', { lw: 4 }); line([[v.N[0] + 80, v.N[1] + 10], [v.N[0] + 130, v.N[1] + 10]], C.ink, 5); });
  // drums
  const d = plain({ x: 620, gy, S: 300 }, pose({ la: -1.8, lb: -.6, ra: 1.8, rb: .6 }));
  rect(560, 700, 120, 80, C.sky, { lw: 4 }); shape(() => g.ellipse(620, 700, 60, 14, 0, 0, Math.PI * 2), '#FFFFFF', { lw: 4 }); for (let x = 570; x < 680; x += 22) dline([[x, 710], [x + 10, 770]]);
  // piano
  rect(1250, 640, 280, 130, C.ink); for (let k = 0; k < 12; k++) rect(1262 + k * 22, 650, 20, 40, '#FFFFFF', { lw: 1.5 }); rect(1260, 770, 14, gy - 770, C.ink, { lw: 0 }); rect(1508, 770, 14, gy - 770, C.ink, { lw: 0 });
  plain({ x: 1200, gy, S: 300, face: 1 }, pose({ la: 1.2, lb: .6, ra: 1.4, rb: .6, head: .1 }));
  // trumpet
  const t = plain({ x: 1680, gy, S: 300, face: -1 }, pose({ la: -1.3, lb: -.4, ra: -.9, rb: -.9, head: -.2 }));
  poly([[t.Hd[0] - 30, t.Hd[1] + 10], [t.Hd[0] - 130, t.Hd[1] - 2], [t.Hd[0] - 160, t.Hd[1] - 26], [t.Hd[0] - 160, t.Hd[1] + 34], [t.Hd[0] - 130, t.Hd[1] + 18]], C.wall);
  // coordinated notes: one tidy staff, ginger
  for (let k = 0; k < 5; k++) ORIG.line([[300, 520 + k * 14], [1620, 520 + k * 14]], C.mute, 2);
  for (let k = 0; k < 12; k++) { const x = 340 + k * 110, y = 520 + ((k * 3) % 5) * 14; shape(() => g.ellipse(x, y, 12, 9, -.3, 0, Math.PI * 2), C.ginger, { lw: 3 }); line([[x + 11, y], [x + 11, y - 46]], C.ink, 3); }
  chapter(7, 'Every neuron at once?'); headline('Not a light switch.', 'An orchestra.', C.ginger, 238, 76);
  subtitle('The right neurons, at the right time.');
};
SB.b17n = () => {   // same stage, everyone at full volume: noise (the seizure beat)
  SB.b17();
  const r = mulberry(9); for (let k = 0; k < 26; k++) { const x = 300 + r() * 1320, y = 450 + r() * 170; line([[x, y], [x + 30, y - 24], [x + 10, y + 6], [x + 46, y - 12]], C.red, 5); }
  text('NOISE', 960, 600, { size: 120, w: 600, col: C.red, align: 'center', track: 6 });
};

// ---- B18 Ending: the final boss, where to eat ----
SB.b18 = () => {
  rect(-20, 0, W + 40, GY, '#2E3556', { lw: 0 }); for (const [x, y] of [[300, 140], [700, 200], [1100, 120], [1500, 180], [1800, 260]]) circ(x, y, 3, '#F4F1E6', { lw: 0 });
  // shopfronts
  const shops = [['PIZZA', C.roof, 80], ['SUSHI', '#3D5A80', 440], ['NOODLES', C.wall, 800], ['BURGERS', C.grass, 1160], ['TACOS', C.pink, 1520]];
  for (const [n, col, x] of shops) { rect(x, 330, 330, GY - 330, '#F1E4CC'); rect(x, 330, 330, 80, col); text(n, x + 165, 384, { size: 36, w: 600, align: 'center', col: col === C.wall || col === C.pink || col === C.grass ? C.ink : C.paper, track: 3 });
    rect(x + 30, 450, 170, 200, '#FBE7A1'); dline([[x + 115, 450], [x + 115, 650]]); rect(x + 225, 500, 80, GY - 500, '#B97C47'); circ(x + 240, 700, 6, C.wall, { lw: 2 });
    for (let k = 0; k < 6; k++) poly([[x + k * 55, 410], [x + k * 55 + 55, 410], [x + k * 55 + 27, 440]], k % 2 ? col : '#FFFFFF', { lw: 3 }); }
  rect(-20, GY, W + 40, 200, '#BDB6A8', { lw: 0 });
  // the couple
  gf({ x: 1120, gy: GY, S: 390, face: -1 }, pose({ la: -.4, lb: .2, ra: .9, rb: -1.9, head: -.05 }));
  bubble(1180, 160, 420, 90, 'Do whatever you want.', { tx: 1150, ty: 410, size: 30 });
  const j = brainy({ x: 780, gy: GY, S: 390 }, pose({ la: -2.5, lb: -.4, ra: 2.5, rb: .4, head: .1 }), { red: 1 });
  for (const [dx, dy, s] of [[-120, -120, 70], [90, -150, 54], [-40, -200, 44]]) text('?', j.Hd[0] + dx, j.Hd[1] + dy, { size: s, w: 600, col: C.red, align: 'center' });
  ground(GY, -20, W + 20);
  g.save(); g.fillStyle = 'rgba(46,53,86,.0)'; g.restore();
  text('The final boss', 124, 238, { size: 84, w: 600, track: -2, col: C.paper });
  label('Ending  ·  The hardest problem', 124, 150, { col: '#BFC4D8' });
  subtitle('It\'s deciding where to eat.');
};

const QS3 = new URLSearchParams(location.search).get('scene') || 'b01';
window.render = () => { g.setTransform(1, 0, 0, 1, 0, 0); paper(); (SB[QS3] || SB.b01)(); };
document.fonts.load(`600 40px ${EN}`).then(() => Promise.all([document.fonts.load(`500 40px ${EN}`), document.fonts.load(`400 40px ${EN}`)])).then(() => { window.render(0); window.READY = true; });
