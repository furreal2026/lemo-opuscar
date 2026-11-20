"""Score + foley + voice for "What if a cat bit you?" → film/out/mix.wav
Run from the library root: .venv/bin/python films/catman/film/mix.py"""
import sys, os, json
import numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB', os.path.abspath(os.path.join(HERE, '..', '..', '..')))
sys.path.insert(0, LIB)
from core.audio import sampler as S
from core.audio import sfx as X
from core.audio.sfx import SR, add
from scipy.signal import resample_poly, butter, sosfilt

S.seed(7)
TL = json.load(open(os.path.join(HERE, 'timeline.json')))
EVJ = json.load(open(os.path.join(HERE, 'events.json')))
DUR = TL['dur']; N = int((DUR + 1.5) * SR)
LN = TL['lines']; SCN = {s['id']: s for s in TL['scenes']}
EV = EVJ['ev']
def evt(tp): return [e['t'] for e in EV if e['type'] == tp]

# ---------------- score ----------------
# 120 bpm, 2 s bars. Chords per scene; light pizzicato + marimba bed, glockenspiel motif, comic bassoon.
BEAT = .5
MAJ = [('F2', ['F3', 'A3', 'C4']), ('D2', ['D3', 'F3', 'A3']), ('A#1', ['A#2', 'D3', 'F3']), ('C2', ['C3', 'E3', 'G3'])]
MIN = [('D2', ['D3', 'F3', 'A3']), ('A#1', ['A#2', 'D3', 'F3']), ('G1', ['G2', 'A#2', 'D3']), ('A1', ['A2', 'C#3', 'E3'])]
END = [('F2', ['F3', 'A3', 'C4']), ('A#1', ['A#2', 'D3', 'F3']), ('C2', ['C3', 'E3', 'G3']), ('F2', ['F3', 'A3', 'C4'])]
FEEL = {'s1': ('maj', 'walk'), 's2': ('maj', 'light'), 's3': ('maj', 'tick'), 's4': ('maj', 'light'), 's5': ('maj', 'bounce'),
        's9': ('maj', 'tick'), 's11': ('maj', 'bounce'), 's12': ('min', 'walk'), 's6': ('min', 'walk'), 's10': ('min', 'light'), 's7': ('min', 'sleepy'), 's8': ('end', 'light')}
MOTIF = ['C6', 'A5', 'F5', 'G5', 'A5', 'C6']   # glockenspiel figure at each scene start (on beats)
ev = []
mute = []   # windows where the music drops out (a real silence before a hit)
tBite = LN['l03']['t']; mute.append((tBite - .55, tBite))
tCrash = evt('crash')[0]; mute.append((tCrash - .5, tCrash))
def muted(t): return any(a <= t < b for a, b in mute)
for sc in TL['scenes']:
    sid = sc['id']; mode, feel = FEEL[sid]; prog = MAJ if mode == 'maj' else MIN if mode == 'min' else END
    t0, t1 = sc['t0'], sc['t1']; nb = int(round((t1 - t0) / (4 * BEAT)))
    for b in range(nb):
        bt = t0 + b * 4 * BEAT; root, ch = prog[b % 4]
        bass5 = S.name(S.midi(root) + 7)
        for k, p in [(0, root), (2, bass5)]:
            if not muted(bt + k * BEAT): ev.append((bt + k * BEAT, 'contrabass_pizz', p, .45, .62, -.1))
        if feel in ('walk', 'bounce'):
            for k in (1, 3):
                if not muted(bt + k * BEAT): ev.append((bt + k * BEAT, 'bassoon_stac', S.name(S.midi(root) + 12 + (4 if mode == 'maj' else 3) * (k == 3)), .2, .42, .15))
        if feel == 'sleepy':
            if b % 2 == 0: ev.append((bt, 'vibraphone', ch[0].replace('3', '4').replace('2', '4'), 3.6, .32, .2)); ev.append((bt + .02, 'vibraphone', ch[2].replace('3', '4').replace('2', '4'), 3.6, .28, -.2))
            continue
        # marimba broken chord in eighths, up an octave
        arp = [S.name(S.midi(n) + 12) for n in ch]; pat = [0, 1, 2, 1, 0, 2, 1, 2]
        for i, j in enumerate(pat):
            t = bt + i * BEAT / 2
            if muted(t): continue
            ev.append((t, 'marimba', arp[j], .3, .34 + .08 * (i % 2 == 0), (-.3 if i % 2 else .3)))
        if feel == 'tick':
            for k in (1, 3):
                if not muted(bt + k * BEAT): ev.append((bt + k * BEAT, 'woodblock', 'b' if k == 1 else 'c', None, .35, .4))
        if feel == 'bounce':
            ev.append((bt + 3.5 * BEAT, 'violins_pizz', arp[2], .3, .4, .3))
    # motif at the scene start
    for i, p in enumerate(MOTIF[:4] if sid != 's8' else MOTIF):
        ev.append((t0 + .05 + i * BEAT / 2, 'glockenspiel', p, .6, .38, .25))
# stingers
for t in evt('sting'): ev += [(t, 'glockenspiel', 'F6', 1.5, .55, 0), (t, 'vibraphone_hard', 'A4', 1.8, .5, -.2), (t, 'vibraphone_hard', 'C5', 1.8, .45, .2)]
for t in evt('sting2'): ev += [(t + .1 + i * .28, 'bassoon_stac', p, .3, .6, 0) for i, p in enumerate(['D3', 'C#3', 'C3'])] + [(t + .1 + .84, 'bassoon', 'B2', 1.1, .55, 0)]
for t in evt('womp'): ev += [(t + i * .32, 'trombone_stac', p, .3, .55, 0) for i, p in enumerate(['A#2', 'A2', 'G#2'])] + [(t + .96, 'trombone', 'G2', 1.2, .5, 0)]
for t in evt('tada'): ev += [(t - .3 + i * .04, 'harp', S.name(S.midi('F4') + d), .8, .45, -.3 + i * .06) for i, d in enumerate([0, 2, 4, 5, 7, 9, 11, 12, 14, 16])] + [(t + .1, 'glockenspiel', 'C7', 1.2, .5, 0)]
for t in evt('shimmer'): ev += [(t + i * .05, 'glockenspiel', S.name(S.midi('C6') + d), .5, .35, .3) for i, d in enumerate([0, 4, 7, 12, 16])]
for t in evt('grow'): ev += [(t - .2 + i * .1, 'xylophone', S.name(S.midi('C5') + d), .3, .35, -.2) for i, d in enumerate([0, 2, 4])]
for t in evt('grow2'): ev += [(t - .2 + i * .08, 'xylophone', S.name(S.midi('C5') + d), .3, .4, .2) for i, d in enumerate([0, 2, 4, 5, 7, 9, 11, 12, 14, 16])]
for t in evt('end'): ev += [(t + .2, 'glockenspiel', 'F6', 2.5, .45, 0), (t + .2, 'vibraphone', 'F4', 3.0, .45, -.2), (t + .2, 'vibraphone', 'A4', 3.0, .4, .2), (t + .2, 'contrabass_pizz', 'F2', 1.0, .6, 0)]
music = S.render(ev, dur=DUR + 1.5)
music = S.room(music, size=.35, mix=.15)
music = music[:N] if len(music) >= N else np.pad(music, ((0, N - len(music)), (0, 0)))

# ---------------- voice ----------------
voice = np.zeros((N, 2), np.float32)
for lid, L in LN.items():
    x, sr = sf.read(os.path.join(HERE, '..', 'voice', 'out', lid + '.wav'), dtype='float32')
    if x.ndim > 1: x = x.mean(1)
    if sr != SR: x = resample_poly(x, SR, sr).astype(np.float32)
    add(voice, x, L['t'], 1.0, 0.0)
v = voice[:, 0].copy()
v = X.compress(v, thr=.18, ratio=4.0); v = X.compress(v, thr=.3, ratio=2.5)
voice = np.stack([v, v], 1)

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
    elif tp == 'zip': add(fx, X.whoosh(.12, 1.0), t - .04, .8, -.2); add(fx, X.click(2.2, .8), t + .06, .5, -.4)
    elif tp == 'tvon': add(fx, X.hp(X.noise(.3) * X.env_exp(.3, .12), 2000).astype(np.float32), t, .25, .3); add(fx, X.click(.9, .8), t, .4, .3)

# ---------------- mix ----------------
# duck the music under the voice (envelope from the voice), and carve 300 Hz–4 kHz while it speaks
env = np.abs(voice[:, 0]); k = int(.12 * SR)
env = np.convolve(env, np.ones(k) / k, mode='same'); env = env / (env.max() + 1e-9)
duck = 1 - .45 * np.clip(env * 6, 0, 1)
sos = butter(2, [300, 4000], 'band', fs=SR, output='sos')
mid = np.stack([sosfilt(sos, music[:, c]) for c in range(2)], 1)
music = music - mid * (1 - duck)[:, None] * .6
def rms(x): return float(np.sqrt(np.mean(x[np.abs(x) > 1e-4] ** 2)))
voice *= .2 / rms(voice); music *= (.2 / 3.16) / rms(music)   # voice ≈ 10 dB above the music (RMS)
music *= duck[:, None]
out = voice + music + fx * .9
# tail fade
fl = int(1.2 * SR); out[-fl:] *= np.linspace(1, 0, fl)[:, None]
out = X.limit(out, .95)
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), out.astype(np.float32), SR)
print('mix.wav', out.shape[0] / SR, 's  peak', float(np.abs(out).max()))
with open(os.path.join(HERE, 'CREDITS'), 'w') as f:
    f.write('What if a cat bit you? — credits\n\nVoice: Kokoro TTS (am_puck), kokoro-onnx (Apache 2.0).\nFont: Jost (SIL OFL 1.1).\nFoley: synthesised (core/audio/sfx.py).\nInstruments:\n')
    f.write('\n'.join(S.credits(sorted({e[1] for e in ev}))) + '\n')
    f.write('Figure rig and helpers: Lemo-Opuscar styles/stick-explainer (MIT).\n')
