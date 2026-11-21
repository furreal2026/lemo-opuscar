"""Sound for the title sequence → out/mix.wav. Run from the library root: .venv/bin/python my-films/zombie/intro/mix.py"""
import sys, os, json
import numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB', os.path.abspath(os.path.join(HERE, '..', '..', '..')))
sys.path.insert(0, LIB)
from core.audio import sampler as S
from core.audio import sfx as X
from core.audio.sfx import SR, add
S.seed(11)
EVJ = json.load(open(os.path.join(HERE, 'events.json'))); DUR = EVJ['dur']; EV = EVJ['ev']
N = int((DUR + 1.0) * SR)
def evt(tp): return [e for e in EV if e['type'] == tp]
T_MIND = evt('mind')[0]['t']; T_LIGHT = [e['t'] for e in evt('flick') if e['on']][-1]

# ---- music: low drone + bowed vibraphone cluster in the dark, cellos under the title, a clean chord on MIND ----
ev = []
ev.append((0.0, 'contrabass', 'E1', T_MIND - .1, .55, 0))
ev.append((0.2, 'cellos', 'E2', T_MIND - .3, .32, -.2))
ev.append((1.3, 'vibraphone_bowed', 'F5', 3.0, .22, .35))       # a sour, glassy note when the spore bursts
ev.append((2.4, 'vibraphone_bowed', 'A#5', 2.4, .16, -.35))
for i, e in enumerate(evt('stamp')): ev.append((e['t'], 'timpani', ['F2', 'F2', 'F#2', 'G2'][i], 1.4, .6, 0))
ev.append((evt('letter')[2]['t'], 'gong', None, 4.0, .35, 0))
ev.append((evt('letter')[2]['t'], 'bass_drum', None, 1.5, .8, 0))
# glockenspiel, slightly sour, on the first branch points (the fungus motif)
for k, (t, p) in enumerate([(1.55, 'F6'), (1.85, 'B6'), (2.2, 'E6'), (2.6, 'A#6'), (3.0, 'F6'), (3.5, 'B6')]):
    ev.append((t, 'glockenspiel', p, 1.0, .22 - .015 * k, (-.5 + k * .2)))
for i, e in enumerate(evt('type')): ev.append((e['t'], 'glockenspiel', ['B5', 'E6', 'F#6', 'G#6'][i], .8, .12, .2))
# MIND: everything stops, one clean chord (vibraphone + celesta-like glock), then the label
ev.append((T_MIND, 'vibraphone', 'E5', 3.6, .42, -.15)); ev.append((T_MIND + .03, 'vibraphone', 'G#5', 3.6, .36, .15)); ev.append((T_MIND + .06, 'vibraphone', 'B5', 3.6, .32, 0))
ev.append((T_MIND, 'glockenspiel', 'E7', 2.0, .2, .3))
ev.append((evt('ring')[0]['t'] + .1, 'cellos', 'E3', 3.6, .25, 0))
music = S.render(ev, dur=DUR + 1.0)
if music.ndim == 1: music = np.stack([music, music], 1)
music = music[:N] if len(music) >= N else np.pad(music, ((0, N - len(music)), (0, 0)))

# ---- foley ----
fx = np.zeros((N, 2), np.float32)
def buzz(d=.08):
    tt = X.t_(d); return (np.sign(np.sin(2 * np.pi * 100 * tt)) * .3 + X.hp(X.noise(d), 3000) * .4) * np.exp(-tt * 18)
for e in EV:
    t, tp = e['t'], e['type']
    if tp == 'heart':
        g = .9 if t < T_LIGHT else .6
        add(fx, X.heartbeat(1.0), t, g, 0)
    elif tp == 'burst': add(fx, X.pop(1.0), t, .6, .3); add(fx, X.whoosh(.9, .8), t, .5, .3); add(fx, X.rumble(1.4, .8), t, .4, 0)
    elif tp == 'flick': add(fx, X.click(.6, 1.0), t, .7, .2); add(fx, buzz(.12 if e['on'] else .06), t, .35, .2)
    elif tp == 'stamp': add(fx, X.thump(1, 60), t, .8, 0)
    elif tp == 'letter': add(fx, X.thump(.6, 90 + e['i'] * 6), t, .45, -.3 + e['i'] * .08); add(fx, X.clack(.7 + e['i'] * .05, .5), t, .25, 0)
    elif tp == 'sag': add(fx, X.creak(.6), t, .35, .2)
    elif tp == 'dots': [add(fx, X.click(1.4 + k * .2, .5), t + k * .14, .3, .3) for k in range(3)]
    elif tp == 'drip': tt = X.t_(.25); add(fx, (np.sin(2 * np.pi * (900 - 2400 * tt) * tt) * np.exp(-tt * 22)).astype(np.float32), t, .3, .3)
    elif tp == 'type': add(fx, X.click(1.1, .6), t, .35, -.1)
    elif tp == 'ring': add(fx, X.bp(X.noise(.45) * X.env_exp(.45, .2), 1200, 5000).astype(np.float32), t, .14, -.2)
    elif tp == 'recoil': add(fx, X.whoosh(.3, .5), t, .2, .4)
    elif tp == 'label': add(fx, X.whoosh(.25, .4), t, .15, -.2)
# room tone in the dark, cut when the light comes on
tt = X.t_(T_LIGHT); room = X.lp(X.brown(T_LIGHT), 300) * .05; add(fx, room.astype(np.float32), 0, 1, 0)
mix = music * .9 + fx
for c in range(2): mix[:, c] = X.limit(mix[:, c], .89)
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix, SR)
print('mix', len(mix) / SR, 's')
