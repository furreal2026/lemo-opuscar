"""Score + foley for the Colour Stick Explainer demo (no voice) → film/out/mix.wav
Run from the library root: .venv/bin/python films/catman/film/mix.py"""
import sys, os, json
import numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB', os.path.abspath(os.path.join(HERE, '..', '..', '..', '..')))
OUT = os.environ.get('OUT', os.path.join(HERE, 'out'))
sys.path.insert(0, LIB)
from core.audio import sampler as S
from core.audio import sfx as X
from core.audio.sfx import SR, add
from scipy.signal import resample_poly, butter, sosfilt

S.seed(7)
EVJ = json.load(open(os.environ.get('EVENTS', os.path.join(HERE, 'events.json'))))
DUR = EVJ['dur']; N = int((DUR + 1.0) * SR)
EV = EVJ['ev']
def evt(tp): return [e['t'] for e in EV if e['type'] == tp]

# ---------------- score ----------------
# 120 bpm, 2 s bars; F major bed (pizzicato bass + marimba), glockenspiel climbing with the ripple, a closing chord.
BEAT = .5
PROG = [('F2', ['F3', 'A3', 'C4']), ('D2', ['D3', 'F3', 'A3']), ('A#1', ['A#2', 'D3', 'F3']), ('C2', ['C3', 'E3', 'G3'])]
ev = []; mute = []
for t in evt('chomp'): mute.append((t - .45, t))
for t in evt('crash'): mute.append((t - .4, t))
def muted(t): return any(a <= t < b for a, b in mute)
fin = evt('final')[0]
nb = int(fin / 2) + 1
for b in range(nb):
    bt = b * 2.0; root, ch = PROG[b % 4]
    if bt >= fin: break
    for k, p in [(0, root), (2, S.name(S.midi(root) + 7))]:
        if not muted(bt + k * BEAT): ev.append((bt + k * BEAT, 'contrabass_pizz', p, .45, .62, -.1))
    for k in (1, 3):
        if not muted(bt + k * BEAT): ev.append((bt + k * BEAT, 'bassoon_stac', S.name(S.midi(root) + 12), .2, .38, .15))
    arp = [S.name(S.midi(n) + 12) for n in ch]
    for i, j in enumerate([0, 1, 2, 1, 0, 2, 1, 2]):
        t = bt + i * BEAT / 2
        if t < fin and not muted(t): ev.append((t, 'marimba', arp[j], .3, .34 + .08 * (i % 2 == 0), (-.3 if i % 2 else .3)))
for t in evt('cut'): ev.append((t, 'glockenspiel', 'C6', .6, .3, .25))
for t in evt('sting'): ev += [(t, 'glockenspiel', 'F6', 1.5, .5, 0), (t, 'vibraphone_hard', 'A4', 1.8, .45, -.2), (t, 'vibraphone_hard', 'C5', 1.8, .4, .2)]
for t in evt('sting2'): ev += [(t + .1 + i * .28, 'bassoon_stac', p, .3, .6, 0) for i, p in enumerate(['D3', 'C#3', 'C3'])]
SCALE = ['F5', 'G5', 'A5', 'C6', 'D6', 'F6']
for e in EV:
    if e['type'] == 'node': ev.append((e['t'], 'glockenspiel', SCALE[min(5, e['n'])], .8, .45, -.4 if e['n'] % 2 else .4))
for t in evt('turn'): ev += [(t + i * .04, 'harp', S.name(S.midi('F4') + d), 1.2, .4, -.3 + i * .07) for i, d in enumerate([0, 4, 7, 12, 16, 19, 24])]
ev += [(fin, 'vibraphone', 'F4', 3.0, .45, -.2), (fin, 'vibraphone', 'A4', 3.0, .42, .2), (fin, 'vibraphone', 'C5', 3.0, .4, 0), (fin, 'contrabass_pizz', 'F2', 1.0, .6, 0), (fin + .02, 'glockenspiel', 'F6', 2.5, .4, 0)]
music = S.render(ev, dur=DUR + 1.0)
music = S.room(music, size=.35, mix=.15)
music = music[:N] if len(music) >= N else np.pad(music, ((0, N - len(music)), (0, 0)))

# ---------------- foley ----------------
fx = np.zeros((N, 2), np.float32)
def boing(f0=220, d=.45, up=True):
    tt = X.t_(d); f = f0 * (1 + (1.6 if up else -.4) * (1 - np.exp(-tt * 9))) * (1 + .06 * np.sin(2 * np.pi * 18 * tt))
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 5)).astype(np.float32) * .5
def tone(f, d, a=.4, decay=8):
    tt = X.t_(d); return (np.sin(2 * np.pi * f * tt) * np.exp(-tt * decay) * a).astype(np.float32)
def splash():
    d = .7; n = X.noise(d) * X.env_exp(d, .18); x = X.bp(n, 400, 5000) * .8
    for k in range(6): add1(x, X.click(1.5 + k * .2, .4), .1 + k * .07)
    return x.astype(np.float32)
def add1(buf, x, at):
    i = int(at * SR); j = min(len(buf), i + len(x)); buf[i:j] += x[:j - i]
for e in EV:
    t, tp = e['t'], e['type']
    if tp == 'pop': add(fx, X.pop(.7), t, .5, .1)
    elif tp == 'title': add(fx, X.whoosh(.25, .4), t, .18, -.2)
    elif tp == 'step': add(fx, X.step(.5), t, .35, -.3)
    elif tp == 'reach': add(fx, X.whoosh(.3, .5), t, .3, .2)
    elif tp == 'chomp': add(fx, X.thump(1, 90), t, .9, .2); add(fx, X.click(.7, 1), t, .8, .2); add(fx, X.crash(.5), t + .02, .25, .2)
    elif tp == 'boing': add(fx, boing(260), t, .5, -.1)
    elif tp == 'boing2': add(fx, boing(180, .6), t, .5, -.3)
    elif tp == 'sweep': add(fx, X.whoosh(.9, .6), t, .4, .4)
    elif tp == 'ding': add(fx, X.ding(.8), t, .45, .4)
    elif tp == 'slip': add(fx, X.whoosh(.5, .8), t, .5, 0); add(fx, boing(500, .3, False), t, .3, 0)
    elif tp == 'land': add(fx, X.thump(.8, 70), t, .7, .2)
    elif tp == 'tada': pass
    elif tp == 'splash': add(fx, splash(), t, .7, -.2); add(fx, X.clack(.8, .8), t, .5, -.2)
    elif tp == 'brush': add(fx, X.bp(X.noise(.35) * X.env_exp(.35, .1), 1500, 6000).astype(np.float32), t, .12, -.4)
    elif tp == 'tick': add(fx, X.click(1.6, .7), t, .4, .2)
    elif tp == 'jump': add(fx, X.whoosh(.6, .9), t, .55, -.2); add(fx, boing(150, .5), t, .35, -.2)
    elif tp == 'land2': add(fx, X.thump(.6, 80), t, .55, 0)
    elif tp == 'squeak': [add(fx, tone(3200 + 300 * k, .07, .25, 30), t + k * .12, .5, -.4) for k in range(3)]
    elif tp == 'beep': [add(fx, tone(1800, .12, .3, 4), t + k * .25, .4, 0) for k in range(3)]
    elif tp == 'hum': tt = X.t_(1.6); add(fx, (np.sin(2 * np.pi * 120 * tt) * .25 + np.sin(2 * np.pi * 240 * tt) * .1).astype(np.float32) * np.minimum(1, np.minimum(tt * 4, (1.6 - tt) * 4)), t, .5, .2)
    elif tp == 'blink': add(fx, tone(2400, .06, .3, 40), t, .4, .4)
    elif tp == 'whoosh': add(fx, X.whoosh(.5, .7), t, .45, .3)
    elif tp == 'crash': add(fx, X.crash(1), t, .7, .3); [add(fx, X.click(2 + k * .3, .6), t + .03 + k * .05, .5, .3) for k in range(5)]
    elif tp == 'tvon': add(fx, X.hp(X.noise(.3) * X.env_exp(.3, .12), 2000).astype(np.float32), t, .25, .3); add(fx, X.click(.9, .8), t, .4, .3)

# ---------------- mix ----------------
def rms(x): return float(np.sqrt(np.mean(x[np.abs(x) > 1e-4] ** 2)))
music *= .14 / rms(music)
out = music + fx * .9
fl = int(1.0 * SR); out[-fl:] *= np.linspace(1, 0, fl)[:, None]
out = X.limit(out, .95)
os.makedirs(OUT, exist_ok=True)
sf.write(os.path.join(OUT, 'mix.wav'), out.astype(np.float32), SR)
print('mix.wav', out.shape[0] / SR, 's  peak', float(np.abs(out).max()))
