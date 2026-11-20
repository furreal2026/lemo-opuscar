"""Score + foley + voice for "What if you used 100% of your brain?" -> film/out/mix.wav
Run from the library root: .venv/bin/python my-films/brain100/film/mix.py   (length = events.json "dur", so a preview mixes only its part)"""
import sys, os, json
import numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB', os.path.abspath(os.path.join(HERE, '..', '..', '..')))
sys.path.insert(0, LIB)
from core.audio import sampler as S
from core.audio import sfx as X
from core.audio.sfx import SR, add
from scipy.signal import resample_poly, butter, sosfilt

S.seed(11)
TL = json.load(open(os.path.join(HERE, 'timeline.json')))
EVJ = json.load(open(os.path.join(HERE, 'events.json')))
DUR = EVJ['dur']; N = int((DUR + 1.0) * SR)
LN = TL['lines']; EV = EVJ['ev']
def evt(tp): return [e['t'] for e in EV if e['type'] == tp]

# ---------------- score: 120 bpm, light and quick (pizzicato, marimba, glockenspiel) ----------------
BEAT = .5
MAJ = [('C2', ['C3', 'E3', 'G3']), ('A1', ['A2', 'C3', 'E3']), ('F1', ['F2', 'A2', 'C3']), ('G1', ['G2', 'B2', 'D3'])]
MIN = [('A1', ['A2', 'C3', 'E3']), ('F1', ['F2', 'A2', 'C3']), ('D2', ['D3', 'F3', 'A3']), ('E2', ['E3', 'G#3', 'B3'])]
FEEL = {'h1': ('maj', 'light'), 'h2': ('maj', 'bounce'), 'h3': ('maj', 'tick'), 'c1a': ('maj', 'light'), 'c1b': ('maj', 'tick'), 'c1c': ('maj', 'bounce'),
        'c1d': ('maj', 'tick'), 'c1e': ('min', 'light'), 'c1f': ('min', 'tick'), 'c1g': ('min', 'walk'),
        'c2a': ('maj', 'tick'), 'c2b': ('maj', 'bounce'), 'c2c': ('maj', 'tick'), 'c2d': ('maj', 'bounce'), 'c2e': ('min', 'light'), 'c2f': ('min', 'tick'),
        'c3a': ('maj', 'light'), 'c3b': ('maj', 'walk'), 'c3c': ('min', 'light'),
        'c4a': ('maj', 'bounce'), 'c4b': ('maj', 'tick'), 'c4c': ('maj', 'light'), 'c4d': ('maj', 'bounce'), 'c4e': ('min', 'light'), 'c4f': ('min', 'tick'),
        'c5a': ('maj', 'light'), 'c5b': ('maj', 'bounce'), 'c5c': ('maj', 'walk'), 'c5d': ('min', 'light'),
        'c6a': ('maj', 'walk'), 'c6b': ('min', 'light'), 'c6c': ('min', 'tick'), 'c6d': ('min', 'light'),
        'c7a': ('maj', 'light'), 'c7b': ('maj', 'bounce'), 'c7c': ('min', 'light'), 'c7d': ('min', 'tick'),
        'e1': ('maj', 'light'), 'e2': ('min', 'light'), 'e3': ('maj', 'light')}
MOTIF = ['G5', 'E5', 'C6', 'D6']
mute = []
for t in evt('stop'): mute.append((t - .35, t + .9))
for t in evt('crash'): mute.append((t - .55, t + 1.0))
for t in evt('gauge'): mute.append((t - .4, t + .05))
for t in evt('buzz2'): mute.append((t - .2, t + .6))
for t in evt('noise'): mute.append((t, t + 3.5))
for t in evt('stop'): mute.append((t, t + 1.2))
for t in evt('slowmo'): mute.append((t - .2, t + 1.0))
def muted(t): return any(a <= t < b for a, b in mute)
ev = []
for sc in TL['scenes']:
    if sc['t0'] >= DUR: break
    sid = sc['id']; mode, feel = FEEL.get(sid, ('maj', 'walk')); prog = MAJ if mode == 'maj' else MIN
    t0, t1 = sc['t0'], min(sc['t1'], DUR); nb = int(round((t1 - t0) / (4 * BEAT)))
    for b in range(nb):
        bt = t0 + b * 4 * BEAT; root, ch = prog[b % 4]; bass5 = S.name(S.midi(root) + 7)
        for k, p in [(0, root), (2, bass5)]:
            if not muted(bt + k * BEAT): ev.append((bt + k * BEAT, 'contrabass_pizz', p, .45, .6, -.1))
        if feel in ('walk', 'bounce'):
            for k in (1, 3):
                if not muted(bt + k * BEAT): ev.append((bt + k * BEAT, 'bassoon_stac', S.name(S.midi(root) + 12 + (4 if mode == 'maj' else 3) * (k == 3)), .2, .38, .15))
        arp = [S.name(S.midi(n) + 12) for n in ch]; pat = [0, 1, 2, 1, 0, 2, 1, 2]
        for i, j in enumerate(pat):
            t = bt + i * BEAT / 2
            if muted(t): continue
            ev.append((t, 'marimba', arp[j], .3, .3 + .08 * (i % 2 == 0), (-.3 if i % 2 else .3)))
        if feel == 'tick':
            for k in (1, 3):
                if not muted(bt + k * BEAT): ev.append((bt + k * BEAT, 'woodblock', 'b' if k == 1 else 'c', None, .3, .4))
        if feel == 'bounce' and not muted(bt + 3.5 * BEAT): ev.append((bt + 3.5 * BEAT, 'violins_pizz', arp[2], .3, .36, .3))
    for i, p in enumerate(MOTIF):
        if not muted(t0 + .05 + i * BEAT / 2): ev.append((t0 + .05 + i * BEAT / 2, 'glockenspiel', p, .6, .34, .25))
# stingers
for t in evt('sting'): ev += [(t, 'glockenspiel', 'G6', 1.5, .5, 0), (t, 'vibraphone_hard', 'E4', 1.8, .45, -.2), (t, 'vibraphone_hard', 'C5', 1.8, .4, .2)]
for t in evt('chime') + evt('ding'): ev += [(t + i * .07, 'glockenspiel', S.name(S.midi('C6') + d), .5, .33, .3) for i, d in enumerate([0, 4, 7, 12])]
for t in evt('shimmer'): ev += [(t + i * .05, 'glockenspiel', S.name(S.midi('C6') + d), .5, .3, .3) for i, d in enumerate([0, 4, 7, 12, 16])]
for t in evt('grow2'): ev += [(t - .2 + i * .08, 'xylophone', S.name(S.midi('C5') + d), .3, .36, .2) for i, d in enumerate([0, 2, 4, 5, 7, 9, 11, 12])]
for t in evt('rise'): ev += [(t + i * .12, 'xylophone', S.name(S.midi('C5') + d), .3, .3, -.2) for i, d in enumerate([0, 2, 4, 7, 9, 12])]
for t in evt('boss'): ev += [(t + i * .3, 'trombone_stac', p, .3, .5, 0) for i, p in enumerate(['C3', 'B2', 'A#2'])] + [(t + .9, 'trombone', 'A2', 1.1, .45, 0)]
for t in evt('womp'): ev += [(t + i * .26, 'bassoon_stac', p, .25, .5, 0) for i, p in enumerate(['E3', 'D#3', 'D3'])]
for t in evt('check'): ev.append((t, 'marimba', 'G5', .4, .5, .3))
for t in evt('boing'): ev += [(t, 'violins_pizz', 'C5', .3, .4, 0), (t + .12, 'violins_pizz', 'G5', .3, .4, 0)]
for t in evt('alarm'): ev += [(t + i * .32, 'vibraphone_hard', p, .3, .45, 0) for i, p in enumerate(['A5', 'F5', 'A5', 'F5'])]
for t in evt('reboot'): ev += [(t + i * .07, 'xylophone', S.name(S.midi('C5') + d), .25, .35, 0) for i, d in enumerate([0, 7, 12])]
for t in evt('choir'): ev += [(t, 'vibraphone', p, 2.0, .4, k) for p, k in [('C5', -.3), ('E5', 0), ('G5', .3)]] + [(t, 'glockenspiel', 'C7', 1.5, .4, 0)]
for t in evt('orch'): ev += [(t + i * .35, ins, p, .5, .4, pn) for i, (ins, p, pn) in enumerate([('violins_pizz', 'E5', -.4), ('woodblock', 'b', 0), ('marimba', 'C5', .2), ('trombone_stac', 'G3', .4)])]
for t in evt('tada'): ev += [(t - .3 + i * .04, 'harp', S.name(S.midi('C4') + d), .8, .42, -.3 + i * .06) for i, d in enumerate([0, 2, 4, 5, 7, 9, 11, 12, 14, 16])] + [(t + .1, 'glockenspiel', 'C7', 1.2, .5, 0)]
for t in evt('end'): ev += [(t + .2, 'glockenspiel', 'C6', 2.5, .45, 0), (t + .2, 'vibraphone', 'C4', 3.0, .45, -.2), (t + .2, 'vibraphone', 'E4', 3.0, .4, .2), (t + .2, 'contrabass_pizz', 'C2', 1.0, .6, 0)]
for t in evt('land'): ev.append((t, 'marimba', S.name(S.midi('C5') + [0, 2, 4, 5, 7, 9, 11, 12][[e for e in EV if e['type'] == 'land' and e['t'] == t][0].get('i', 0) % 8]), .3, .45, 0))
for t in evt('pulse'): ev.append((t, 'glockenspiel', S.name(S.midi('C6') + [0, 2, 4, 5, 7, 9, 12][[e for e in EV if e['type'] == 'pulse' and e['t'] == t][0].get('i', 0) % 7]), .4, .32, .2))
for t in evt('party'): ev += [(t + i * .09, 'glockenspiel', p, .4, .35, 0) for i, p in enumerate(['C6', 'E6', 'G6'])] + [(t + .4, 'bassoon_stac', 'C3', .3, .45, 0)]
music = S.render(ev, dur=DUR + 1.0)
music = S.room(music, size=.35, mix=.15)
music = music[:N] if len(music) >= N else np.pad(music, ((0, N - len(music)), (0, 0)))

# ---------------- voice ----------------
voice = np.zeros((N, 2), np.float32)
for lid, L in LN.items():
    if L['t'] >= DUR: continue
    x, sr = sf.read(os.path.join(HERE, '..', 'voice', 'out', lid + '.wav'), dtype='float32')
    if x.ndim > 1: x = x.mean(1)
    if sr != SR: x = resample_poly(x, SR, sr).astype(np.float32)
    add(voice, x, L['t'], 1.0, 0.0)
v = voice[:, 0].copy(); v = X.compress(v, thr=.18, ratio=4.0); v = X.compress(v, thr=.3, ratio=2.5); voice = np.stack([v, v], 1)

# ---------------- foley ----------------
fx = np.zeros((N, 2), np.float32)
def tone(f, d, a=.4, decay=8):
    tt = X.t_(d); return (np.sin(2 * np.pi * f * tt) * np.exp(-tt * decay) * a).astype(np.float32)
def buzz(d=.32):   # phone vibration: 170 Hz hum, gated twice
    tt = X.t_(d); x = (np.sign(np.sin(2 * np.pi * 170 * tt)) * .25 + np.sin(2 * np.pi * 340 * tt) * .2) * (np.sin(2 * np.pi * 12 * tt) > -.2)
    return (X.lp(x, 900) * np.minimum(1, np.minimum(tt * 40, (d - tt) * 40))).astype(np.float32)
def chirp(f0, f1, d, a=.3):
    tt = X.t_(d); f = np.linspace(f0, f1, len(tt)); return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 3) * a).astype(np.float32)
for e in EV:
    t, tp = e['t'], e['type']
    if t > DUR: continue
    if tp == 'pop': add(fx, X.pop(.6), t, .4, .1)
    elif tp in ('whoosh', 'stretch'): add(fx, X.whoosh(.4 if tp == 'whoosh' else .5, .7), t, .45 if tp == 'whoosh' else .25, .2)
    elif tp == 'thump': add(fx, X.thump(.6, 75), t, .45, 0)
    elif tp == 'stop': add(fx, chirp(900, 200, .35), t, .5, 0)
    elif tp == 'glitch': [add(fx, tone(2200 + 400 * k, .04, .3, 40), t + k * .06, .35, .3) for k in range(5)]
    elif tp == 'tap': add(fx, X.click(1.4, .6), t, .35, .3)
    elif tp == 'card': add(fx, X.whoosh(.18, .9), t, .25, .3); add(fx, X.click(1.8, .5), t + .15, .3, .3)
    elif tp == 'tick': add(fx, X.click(1.6, .6), t, .35, .2)
    elif tp == 'slam': add(fx, X.thump(.9, 90), t, .6, .1); add(fx, X.clack(.9, .7), t, .4, .1)
    elif tp == 'circle': add(fx, X.bp(X.noise(.35) * X.env_exp(.35, .12), 1500, 6000).astype(np.float32), t, .15, -.2)
    elif tp == 'bell': [add(fx, tone(1320, .5, .25, 5), t + k * .18, .4, -.3) for k in range(3)]
    elif tp == 'chalk': add(fx, X.bp(X.noise(.4) * X.env_exp(.4, .2), 2000, 7000).astype(np.float32), t, .14, .3)
    elif tp == 'turn': add(fx, X.whoosh(.25, .8), t, .25, .3)
    elif tp == 'buzz': add(fx, buzz(), t, .7, .2); add(fx, buzz(), t + .45, .6, .2)
    elif tp == 'buzz2': add(fx, buzz(.28), t, .7, 0)
    elif tp == 'power': add(fx, chirp(200, 1400, .5, .25), t, .4, 0)
    elif tp == 'scan': add(fx, X.bp(X.noise(1.2) * np.minimum(1, X.t_(1.2) * 3), 800, 3000).astype(np.float32) * .3, t, .3, -.3)
    elif tp == 'clock': [add(fx, X.click(2.0, .5), t + k * .25, .3, .3) for k in range(10)]
    elif tp == 'gauge': add(fx, chirp(300, 1200, .9, .25), t, .4, .2)
    elif tp == 'send': add(fx, chirp(600, 1500, .15, .3), t, .4, .3)
    elif tp == 'crash': add(fx, X.crash(.9), t, .65, .2); add(fx, X.thump(1, 60), t, .8, 0); add(fx, chirp(800, 60, .7, .35), t + .05, .45, 0)
    elif tp == 'stamp': add(fx, X.thump(.8, 110), t, .6, .3)
    elif tp == 'ding': add(fx, X.ding(.7), t, .35, .3)
    elif tp == 'reboot': add(fx, chirp(300, 900, .25, .25), t, .3, 0)
    elif tp == 'clack': add(fx, X.clack(1.1, .8), t, .5, .2)
    elif tp == 'slash': add(fx, X.whoosh(.15, 1.0), t, .4, 0)
    elif tp == 'door': add(fx, X.creak(.6), t, .35, .4)
    elif tp == 'kick': add(fx, X.thump(.9, 120), t, .6, -.3)
    elif tp == 'slowmo': add(fx, chirp(400, 120, 1.0, .3), t, .35, 0)
    elif tp == 'catch': add(fx, X.thump(.7, 150), t, .6, .3); add(fx, X.click(1.2, .6), t, .4, .3)
    elif tp == 'gasp': add(fx, X.bp(X.noise(.4) * X.env_exp(.4, .15), 600, 3000).astype(np.float32), t, .3, 0)
    elif tp == 'thud': add(fx, X.thump(.5, 140), t, .4, .3)
    elif tp == 'sizzle': add(fx, X.hp(X.noise(1.2) * np.minimum(1, X.t_(1.2) * 4) * X.env_exp(1.2, .8), 3000).astype(np.float32), t, .25, -.2)
    elif tp == 'washer': tt = X.t_(2.2); add(fx, (np.sin(2 * np.pi * 60 * tt) * .3 * (1 + .5 * np.sin(2 * np.pi * 7 * tt)) * np.minimum(1, np.minimum(tt * 4, (2.2 - tt) * 3))).astype(np.float32), t, .5, .3)
    elif tp == 'can': add(fx, X.click(2.2, .5), t, .3, .4)
    elif tp == 'switch': add(fx, X.clack(1.6, .9), t, .5, .3)
    elif tp == 'noise': tt = X.t_(2.8); add(fx, (X.noise(2.8) * .25 + np.sign(np.sin(2 * np.pi * 220 * tt)) * .12).astype(np.float32) * np.minimum(1, tt * 1.5) * np.minimum(1, (2.8 - tt) * 4), t, .45, 0)
    elif tp == 'crowd': add(fx, X.bp(X.noise(1.5) * np.minimum(1, X.t_(1.5) * 3) * X.env_exp(1.5, .9), 300, 2500).astype(np.float32), t, .35, 0)
    elif tp == 'tada': pass
    elif tp == 'end': pass

# ---------------- mix ----------------
env = np.abs(voice[:, 0]); k = int(.12 * SR)
env = np.convolve(env, np.ones(k) / k, mode='same'); env = env / (env.max() + 1e-9)
duck = 1 - .45 * np.clip(env * 6, 0, 1)
sos = butter(2, [300, 4000], 'band', fs=SR, output='sos')
mid = np.stack([sosfilt(sos, music[:, c]) for c in range(2)], 1)
music = music - mid * (1 - duck)[:, None] * .6
def rms(x): return float(np.sqrt(np.mean(x[np.abs(x) > 1e-4] ** 2)))
voice *= .2 / rms(voice); music *= (.2 / 3.16) / rms(music)
music *= duck[:, None]
out = voice + music + fx * .9
fl = int(1.0 * SR); out[-fl:] *= np.linspace(1, 0, fl)[:, None]
out = X.limit(out, .95)
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), out.astype(np.float32), SR)
print('mix.wav', out.shape[0] / SR, 's  peak', float(np.abs(out).max()))
with open(os.path.join(HERE, 'CREDITS'), 'w') as f:
    f.write('What if you used 100% of your brain? — credits\n\nVoice: Kokoro TTS (am_puck), kokoro-onnx (Apache 2.0).\nFont: Jost (SIL OFL 1.1).\nFoley: synthesised (core/audio/sfx.py and film/mix.py).\nInstruments:\n')
    f.write('\n'.join(S.credits(sorted({e[1] for e in ev}))) + '\n')
    f.write('Figure rig and helpers: Lemo-Opuscar styles/stick-explainer (MIT); look from my-styles/colour-stick.\n')
