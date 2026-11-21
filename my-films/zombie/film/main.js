let SUBDARK = false;
// ---------- subtitles (screen space, from the voice) ----------
function drawSubs(t) { const q = TLS.cues.find(c => t >= c.t0 && t < c.t1); if (!q || q.line === 'n6') return; const k = ein(t, q.t0, .12) * (1 - ein(t, q.t1 - .12, .12));
  let dark = SUBDARK; if (!dark) { scr(); const d0 = g.getImageData(140, 975, 900, 34).data; let sum = 0, n = 0; for (let i = 0; i < d0.length; i += 64) { sum += .3 * d0[i] + .59 * d0[i + 1] + .11 * d0[i + 2]; n++; } dark = sum / n < 128; } g.save(); g.globalAlpha = k; g.fillStyle = C.ginger; g.fillRect(124, 968, 4, 46); g.restore();
  const n = TXT ? TXT.length : 0; text(q.text, 146, 1003, { size: 36, w: 500, a: k, col: dark ? C.paper : C.ink }); if (TXT && TXT.length > n) TXT[TXT.length - 1].pass = true; }
// ---------- page contract ----------
window.EV = EV.sort((a, b) => a.t - b.t);
window.DUR = DUR;
window.render = T => {
  scr(); paper(); GEST = gestureAt(T); SUBDARK = false;
  const s = TLS.scenes.find(x => T >= x.t0 && T < x.t1) || TLS.scenes[TLS.scenes.length - 1];
  g.save();
  if (FILM[s.id]) FILM[s.id](T); else { scr(); text('scene ' + s.id, 124, 540, { size: 80, w: 600, col: C.mute }); }
  g.restore(); scr();
  if (SUBDARK) { g.save(); g.fillStyle = 'rgba(0,0,0,0)'; g.restore(); }
  drawSubs(T);
};
window.TEXTS = t => { TXT = []; window.render(t); const r = TXT; TXT = null; return r; };
const QS2 = new URLSearchParams(location.search);
if (QS2.get('from')) { const F = +QS2.get('from'); const r0 = window.render; window.render = t => r0(F + t); window.DUR = +(QS2.get('to') ?? DUR) - F; }
document.fonts.load(`600 40px ${EN}`).then(() => Promise.all([document.fonts.load(`500 40px ${EN}`), document.fonts.load(`400 40px ${EN}`)])).then(() => { window.render(0); window.READY = true; });
