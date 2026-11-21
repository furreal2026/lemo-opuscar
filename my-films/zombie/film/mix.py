"""Score + foley + voice for "What if you became a zombie… but never lost your mind?" → film/out/mix.wav
Run from the library root: .venv/bin/python my-films/zombie/film/mix.py   (the title sequence's own mix is placed at scene 012)"""
import sys, os, json
import numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB', os.path.abspath(os.path.join(HERE, '..', '..', '..')))
sys.path.insert(0, LIB)
from core.audio import sampler as S
from core.audio import sfx as X
from core.audio.sfx import SR, add
from scipy.signal import resample_poly, butter, sosfilt

S.seed(21)
TL = json.load(open(os.path.join(HERE, 'timeline.json')))
EV = json.load(open(os.path.join(HERE, 'events.json')))['ev']
DUR = TL['dur']; N = int((DUR + 2.0) * SR)
SC = {s['id']: s for s in TL['scenes']}; LN = TL['lines']
def T0(i): return SC['%03d' % i]['t0']
def T1(i): return SC['%03d' % i]['t1']
silences = [(e['t'], e['t'] + e.get('d', 1.6)) for e in EV if e['type'] == 'silence']
silences += [(T0(12), T1(12)), (T0(105) + 3.0, T1(106) + .2), (T1(119) - 3.2, T0(120) + .4)]
def quiet(t): return any(a <= t < b for a, b in silences)

# ---------------- score: one mood per act ----------------
ev = []
def pad(t0, t1, notes, inst='cellos', vel=.3, step=4.0):
    t = t0
    while t < t1 - .5:
        for k, n in enumerate(notes): ev.append(dict(t=t + k * .04, inst=inst, pitch=n, dur=min(step + .6, t1 - t), vel=vel, pan=(-.3 + .3 * k), attack=.6, release=1.2))
        t += step
def ost(t0, t1, seq, inst, beat, vel=.35, pan=0, skip=None):
    t = t0; i = 0
    while t < t1:
        if not quiet(t) and (skip is None or not skip(i)): ev.append((t, inst, seq[i % len(seq)], beat * .9, vel, pan))
        t += beat; i += 1
# Act 1 · midnight, curious: walking pizzicato in D minor, sparse glockenspiel
ost(T0(1), T1(11), ['D2', 'A2', 'F2', 'A2', 'C2', 'G2', 'A#1', 'F2'], 'contrabass_pizz', .6, .5, -.1)
ost(T0(1) + 2.4, T1(11), ['F5', 'A5', 'D6', 'C6', 'A5', 'E5'], 'glockenspiel', 1.2, .16, .3, skip=lambda i: i % 3 == 2)
# Act 2 · morning, light but off: marimba broken chords; the glock motif slightly sour on the fungus
ost(T0(13), T0(25), ['D4', 'F4', 'A4', 'F4', 'C4', 'E4', 'G4', 'E4'], 'marimba', .25, .28, .2)
ost(T0(13), T0(25), ['D2', 'D2', 'C2', 'C2', 'A#1', 'A#1', 'A1', 'A1'], 'contrabass_pizz', 1.0, .4, -.1)
pad(T0(25), T1(27), ['D3', 'A3', 'D#4'], 'cellos', .22, 6.0)
ost(T0(25), T1(26), ['C#6', 'G6', 'D6', 'G#6'], 'glockenspiel', .9, .14, .3)
# Act 3 · uneasy: vibraphone + low cellos
pad(T0(28), T1(42), ['D2', 'A2'], 'cellos', .24, 5.0)
ost(T0(28), T1(42), ['A4', 'D5', 'F5', 'E5', 'D5', 'C#5'], 'vibraphone', 1.5, .2, .1)
# Act 4 · losing control: faster pizzicato ostinato, timpani on the downbeats
ost(T0(43), T1(59), ['D2', 'D3', 'D2', 'C3', 'D2', 'A#2', 'D2', 'A2'], 'contrabass_pizz', .3, .45, -.1)
ost(T0(43), T1(59), ['D3', 'D3', 'F3', 'D3'], 'cellos_pizz', .6, .3, .2)
ost(T0(43), T1(59), ['F2'], 'timpani', 2.4, .35, 0)
pad(T0(60), T1(60), ['D2', 'G#2', 'D3'], 'cellos', .3, 4.0)
# Act 5 · grey realisation: slow bowed vibraphone and strings
pad(T0(61), T1(75), ['D3', 'F3', 'A3'], 'cellos', .2, 6.0)
ost(T0(61), T1(75), ['D5', 'C5', 'A4', 'F4'], 'vibraphone_bowed', 3.0, .14, -.2)
# Act 6 · lonely piano, then hope when Mia comes (D major)
ost(T0(76), T0(85), ['D4', 'A4', 'F4', 'E4', 'D4', 'C4'], 'piano', 1.6, .26, .1, skip=lambda i: i % 4 == 3)
pad(T0(85), T1(87), ['D3', 'F#3', 'A3'], 'cellos', .24, 4.0)
ost(T0(85), T1(87), ['F#5', 'A5', 'D6', 'A5'], 'glockenspiel', .8, .14, .3)
pad(T0(88), T1(90), ['D2', 'D#2'], 'contrabass', .35, 3.0)
# Act 7 · the fight: low strings rising, timpani heartbeat; everything stops before the shot
pad(T0(91), T0(105) + 3.0, ['D2', 'A2', 'D3'], 'cellos', .26, 3.0)
ost(T0(91), T0(105) + 3.0, ['D2'], 'timpani', 1.0, .3, 0)
pad(T0(100), T1(101), ['D3', 'F#3', 'A3', 'D4'], 'cellos', .22, 3.0)
ost(T0(100), T1(101), ['F#5', 'A5', 'B5', 'A5', 'F#5', 'E5'], 'piano', .9, .2, .2)
# Act 8 · the ending: soft strings, the family motif once and broken, a last chord on the quote
pad(T0(109), T1(118), ['D3', 'A3', 'F4'], 'cellos', .2, 6.0)
ost(T0(116), T1(116), ['F#5', 'A5', 'B5', 'A5'], 'piano', .9, .2, .2, skip=lambda i: i == 3)
pad(T0(120) + 1.0, T1(120), ['D3', 'A3', 'D4', 'F4'], 'cellos', .22, 6.0)
ev.append((LN['n6']['t'] + 5.0, 'vibraphone', 'D5', 5.0, .3, -.1)); ev.append((LN['n6']['t'] + 5.05, 'vibraphone', 'F5', 5.0, .26, .1)); ev.append((LN['n6']['t'] + 5.1, 'vibraphone', 'A5', 5.0, .24, 0))
# stingers on events
for e in EV:
    t, tp = e['t'], e['type']
    if tp in ('fungus', 'fungusHit', 'grow'): ev.append((t, 'glockenspiel', 'C#6', 1.4, .2, .3)); ev.append((t + .12, 'glockenspiel', 'G6', 1.2, .15, .4))
    elif tp == 'glock':
        for k in range(e.get('n', 3)): ev.append((t + k * .55, 'glockenspiel', ['C#6', 'G6', 'D6', 'G#6'][k % 4], 1.0, .15, .3))
    elif tp in ('family', 'familyRise'): [ev.append((t + k * .45, 'piano', p, 1.4, .22, .2)) for k, p in enumerate(['F#5', 'A5', 'B5', 'A5'])]
    elif tp in ('celesta', 'celestaHold'): ev.append((t, 'glockenspiel', 'A6', 3.0, .2, .2))
    elif tp == 'vibeLonely': ev.append((t, 'vibraphone', 'E5', 3.0, .3, 0))
    elif tp in ('lowhit', 'bigCrash'): ev.append((t, 'bass_drum', None, 1.5, .8, 0))
    elif tp == 'sour': ev.append((t, 'vibraphone_bowed', 'D#5', 2.0, .25, 0))
    elif tp == 'hope': ev.append((t, 'glockenspiel', 'D6', 1.5, .2, .3))
music = S.render(ev, dur=DUR + 2.0)
music = S.room(music, size=.4, mix=.16)
music = music[:N] if len(music) >= N else np.pad(music, ((0, N - len(music)), (0, 0)))
# cut the music in the silences (short fades)
gain = np.ones(N, np.float32)
for a, b in silences:
    ia, ib, f = int(a * SR), int(b * SR), int(.15 * SR)
    gain[max(0, ia):min(N, ib)] = 0; gain[max(0, ia - f):ia] = np.minimum(gain[max(0, ia - f):ia], np.linspace(1, 0, ia - max(0, ia - f)))
    gain[ib:min(N, ib + f)] = np.minimum(gain[ib:min(N, ib + f)], np.linspace(0, 1, min(N, ib + f) - ib))
music *= gain[:, None]

# ---------------- voice ----------------
voice = np.zeros((N, 2), np.float32)
for lid, L in LN.items():
    x, sr = sf.read(os.path.join(HERE, '..', 'voice', 'out', lid + '.wav'), dtype='float32')
    if x.ndim > 1: x = x.mean(1)
    if sr != SR: x = resample_poly(x, SR, sr).astype(np.float32)
    if lid == 'd03' or lid == 'd07': x = X.radio(x) * .8                          # on the phone, on the TV
    if lid == 'd04': x = np.tanh(resample_poly(x, 5, 4) * 3).astype(np.float32) * .5; x = X.lp(x, 2400)   # the cracked voice
    x = X.compress(x, thr=.18, ratio=4.0)
    pan = 0.0 if lid.startswith('n') else .15
    add(voice, x.astype(np.float32), L['t'], 1.0 if lid.startswith('n') else .85, pan)

# ---------------- foley ----------------
fx = np.zeros((N, 2), np.float32)
def tone(f, d, a=.4, decay=8): tt = X.t_(d); return (np.sin(2 * np.pi * f * tt) * np.exp(-tt * decay) * a).astype(np.float32)
def noiseb(d, lo, hi, tau=.1): return (X.bp(X.noise(d), lo, hi) * X.env_exp(d, tau)).astype(np.float32)
def bed(d, lo, hi, a=.08): n = X.bp(X.noise(d), lo, hi); e = np.minimum(1, np.minimum(X.t_(d) / .5, (d - X.t_(d)) / .5)); return (n * e * a).astype(np.float32)
def growl(d=.8): tt = X.t_(d); f = 70 + 20 * np.sin(tt * 17); b = np.sin(2 * np.pi * np.cumsum(f) / SR) * (1 + .5 * X.noise(d)) ; return (X.lp(np.tanh(b * 2), 900) * np.minimum(1, tt / .05) * np.exp(-tt * 1.5) * .6).astype(np.float32)
def steps(t, d, rate=1.0, drag=False):
    k = 0; s = t
    while s < t + d: add(fx, X.step(.5), s, .3, -.2 + .1 * (k % 2)); (drag and k % 2) and add(fx, noiseb(.35, 300, 2000, .12), s + .05, .12, 0); s += .55 / rate; k += 1
for e in EV:
    t, tp, d = e['t'], e['type'], e.get('d', 1.0)
    if tp in ('heartbeat', 'heartbeatHi', 'heartbeatLoud', 'heartbeatFast', 'heartSlow'):
        per = {'heartbeat': .9, 'heartbeatHi': .7, 'heartbeatLoud': .65, 'heartbeatFast': .5, 'heartSlow': 1.3}[tp]; g2 = .9 if tp == 'heartbeatLoud' else .6; s = t
        while s < t + (d if 'd' in e else .1): add(fx, X.heartbeat(1), s, g2, 0); s += per
        if 'd' not in e: add(fx, X.heartbeat(1), t, g2, 0)
    elif tp in ('step', 'kneel', 'stand', 'lurch'): add(fx, X.step(.7), t, .45, 0)
    elif tp in ('steps', 'stepsAway', 'stepsGroup', 'gravel'): steps(t, d, e.get('rate', 1.0))
    elif tp in ('dragSteps', 'drag', 'shuffle'): steps(t, d, e.get('rate', .8), True)
    elif tp in ('hum', 'tinnitus', 'earRing', 'laserHum'): f0 = {'hum': 110, 'tinnitus': 6200, 'earRing': 5200, 'laserHum': 900}[tp]; tt = X.t_(d); add(fx, (np.sin(2 * np.pi * f0 * tt) * np.minimum(1, np.minimum(tt * 3, (d - tt) * 3)) * (.05 if f0 > 1000 else .12)).astype(np.float32), t, 1, .1)
    elif tp in ('crickets',): tt = X.t_(d); add(fx, (X.bp(X.noise(d), 4000, 5500) * (np.sin(2 * np.pi * 18 * tt) > .6) * .05).astype(np.float32), t, 1, .2)
    elif tp in ('rain', 'wind', 'cafe', 'room', 'roomtone', 'birds', 'water', 'tvNews', 'phoneVid', 'muffle', 'fearBreath', 'strings', 'pizzFast', 'struggle', 'growlLow', 'antClimb', 'fungusSwarm', 'spores', 'purr', 'rub', 'brush', 'pour', 'pen', 'typing', 'scratch', 'spray', 'ring', 'ringtone', 'alarm', 'leverStrain', 'glassShake', 'tickFast', 'tick', 'slowdown', 'breath'):
        spec = {'rain': (800, 6000, .05), 'wind': (200, 1200, .07), 'cafe': (300, 2500, .04), 'room': (60, 300, .08), 'roomtone': (60, 300, .06), 'birds': (3000, 6000, .015), 'water': (1500, 6000, .05), 'tvNews': (500, 3000, .03), 'phoneVid': (800, 3000, .02), 'muffle': (100, 500, .06), 'fearBreath': (400, 2000, .03), 'strings': (100, 400, .0), 'pizzFast': (100, 200, .0), 'struggle': (200, 2000, .05), 'growlLow': (60, 300, .08), 'antClimb': (2000, 6000, .01), 'fungusSwarm': (300, 3000, .06), 'spores': (2000, 8000, .02), 'purr': (40, 160, .12), 'rub': (1500, 6000, .05), 'brush': (2000, 7000, .05), 'pour': (500, 3000, .06), 'pen': (2500, 7000, .03), 'typing': (2000, 6000, .0), 'scratch': (2000, 6000, .06), 'spray': (3000, 9000, .07), 'ring': (2000, 4000, .0), 'ringtone': (0, 0, 0), 'alarm': (0, 0, 0), 'leverStrain': (200, 1200, .05), 'glassShake': (3000, 6000, .0), 'tickFast': (0, 0, 0), 'tick': (0, 0, 0), 'slowdown': (100, 400, .05), 'breath': (300, 1800, .05)}[tp]
        if spec[2] > 0: add(fx, bed(d, spec[0], spec[1], spec[2]), t, 1, .1)
        if tp in ('typing',): [add(fx, X.click(1.6, .5), t + k * .11, .25, .2) for k in range(int(d / .11))]
        if tp in ('ring', 'alarm'): [add(fx, tone(1800 if tp == 'ring' else 980, .12, .25, 10), t + k * .16, .6, 0) for k in range(int(d / .16))]
        if tp == 'ringtone': [add(fx, tone(1320 if k % 2 else 1760, .14, .2, 6), t + k * .2, .5, .2) for k in range(int(d / .2))]
        if tp in ('tick', 'tickFast'): [add(fx, X.click(1.3, .4), t + k * (.5 / e.get('rate', 1) if tp == 'tick' else .12), .2, .1) for k in range(int(d / (.5 / e.get('rate', 1) if tp == 'tick' else .12)))]
        if tp == 'glassShake': [add(fx, tone(3200 + 200 * (k % 3), .05, .2, 40), t + k * .07, .4, 0) for k in range(int(d / .07))]
        if tp == 'purr': tt = X.t_(d); add(fx, (X.lp(X.noise(d), 200) * (.5 + .5 * np.sin(2 * np.pi * 25 * tt)) * .15).astype(np.float32), t, 1, .3)
        if tp == 'growlLow': add(fx, growl(d) * .3, t, 1, 0)
    elif tp in ('growl', 'hiss', 'voiceTry'): add(fx, growl(.9) if tp != 'hiss' else noiseb(.7, 2000, 8000, .25), t, .7 if tp == 'growl' else .35, .1)
    elif tp in ('clink', 'shell', 'tap', 'stick', 'lock', 'torchClick', 'tvoff', 'blip', 'beepT', 'msg', 'lampOff', 'lever'):
        f = {'clink': 2600, 'shell': 2200, 'tap': 1400, 'stick': 900, 'lock': 700, 'torchClick': 1100, 'tvoff': 3000, 'blip': 1700, 'beepT': 2400, 'msg': 1500, 'lampOff': 500, 'lever': 400}[tp]
        add(fx, tone(f, .15, .3, 30), t, .5, .1); add(fx, X.click(1.0, .6), t, .3, .1)
    elif tp in ('thup', 'thud', 'thump', 'slam', 'doorShut', 'boxThud', 'kneelThud', 'bonk', 'fallGrass', 'paperLand', 'binLid', 'clothDrop', 'boing', 'knock'):
        add(fx, X.thump(.9 if tp in ('slam', 'thump', 'doorShut') else .6, 70 if tp != 'knock' else 160), t, .8 if tp in ('slam', 'doorShut', 'thump') else .5, 0)
        if tp == 'knock': add(fx, X.clack(.6, .8), t, .5, -.3)
    elif tp in ('crash', 'clatter', 'chairFall', 'glassCrack', 'bigCrash'): add(fx, X.crash(1 if tp != 'clatter' else .6), t, .7, .2); [add(fx, X.click(2 + k * .3, .6), t + .03 + k * .05, .4, .2) for k in range(5)]
    elif tp in ('whoosh', 'whooshSend', 'dive', 'reverseWhoosh', 'jolt', 'shake', 'snapHead', 'wings', 'toss', 'scamper', 'grab', 'scuffle', 'cloth', 'zip', 'slide', 'shrug', 'tear', 'rip', 'paper', 'puff', 'wilt'):
        dd = {'dive': .9, 'reverseWhoosh': 1.2, 'rip': .3, 'zip': .25, 'paper': .4}.get(tp, .4)
        x = X.whoosh(dd, .8); x = x[::-1].copy() if tp == 'reverseWhoosh' else x; add(fx, x, t, .4 if tp not in ('cloth', 'paper') else .2, .2)
    elif tp in ('gunshot',):
        add(fx, X.crash(1), t, 1.0, .3); add(fx, X.thump(1, 50), t, 1.0, .2); add(fx, (X.lp(X.brown(2.4), 300) * X.env_exp(2.4, .7) * .6).astype(np.float32), t + .02, .8, 0)
        tt = X.t_(3.0); add(fx, (np.sin(2 * np.pi * 5800 * tt) * np.exp(-tt * .9) * .05).astype(np.float32), t + .1, 1, 0)
    elif tp in ('cock', 'reload'): add(fx, X.clack(1.0, 1), t, .6, .3); add(fx, X.clack(1.3, .8), t + .15, .5, .3)
    elif tp in ('fridgeOpen',): add(fx, noiseb(.3, 300, 1500, .1), t, .3, -.2); add(fx, X.click(.6, .7), t, .3, -.2)
    elif tp in ('chew', 'crunch', 'lick', 'sniff', 'gulp', 'cough', 'gasp'): add(fx, noiseb(.18 if tp != 'cough' else .3, 400, 3000, .06), t, .3 if tp != 'cough' else .45, 0)
    elif tp in ('door', 'doorCreak', 'gateCreak', 'creak'): add(fx, X.creak(.7), t, .4, -.2)
    elif tp in ('doorbell',): add(fx, tone(2093, .8, .25, 4), t, .5, .3); add(fx, tone(2637, .8, .2, 4), t + .12, .5, .3)
    elif tp in ('bell',): add(fx, tone(3000, .6, .25, 6), t, .5, .4); add(fx, tone(3000, .6, .25, 6), t + .18, .5, .4)
    elif tp in ('neon',): add(fx, (np.sign(np.sin(2 * np.pi * 100 * X.t_(.2))) * .1 * X.env_exp(.2, .08)).astype(np.float32), t, .4, 0)
    elif tp in ('splash', 'canRoll'): add(fx, noiseb(.6, 500, 5000, .2), t, .4, .3)
    elif tp in ('snap', 'snapThread', 'slap', 'idea', 'pickup', 'hangup', 'strain', 'twitchS', 'cutBlack', 'morning', 'glare', 'bzzt', 'fungus', 'family', 'celesta'):
        if tp == 'bzzt': add(fx, (np.sign(np.sin(2 * np.pi * 150 * X.t_(.3))) * .15 * X.env_exp(.3, .15)).astype(np.float32), t, .6, 0)
        elif tp in ('snap', 'slap', 'snapThread'): add(fx, X.click(1.4, 1), t, .6, .1)
        elif tp in ('pickup', 'hangup'): add(fx, tone(1000, .1, .3, 30), t, .4, .2)
        elif tp == 'glare': add(fx, tone(4200, 1.0, .08, 2), t, .5, 0)
        elif tp == 'strain': add(fx, noiseb(.8, 100, 800, .4), t, .3, 0)
fx[:, :] = np.tanh(fx * 1.2) / 1.2

# ---------------- the title sequence's own mix at scene 012 ----------------
im, isr = sf.read(os.path.join(HERE, '..', 'intro', 'out', 'mix.wav'), dtype='float32')
if isr != SR: im = np.stack([resample_poly(im[:, c], SR, isr) for c in range(2)], 1).astype(np.float32)
im = im[:int((T1(12) - T0(12) + .3) * SR)]

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
out = voice + music + fx * .55
i0 = int(T0(12) * SR); out[i0:i0 + len(im)] = out[i0:i0 + len(im)] * .1 + im * .35
fl = int(1.5 * SR); out[int(DUR * SR) - fl:int(DUR * SR)] *= np.linspace(1, 0, fl)[:, None]; out[int(DUR * SR):] = 0
out = np.stack([X.limit(out[:, c], .95) for c in range(2)], 1)
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), out.astype(np.float32), SR)
print('mix.wav', out.shape[0] / SR, 's  peak', float(np.abs(out).max()))
with open(os.path.join(HERE, 'CREDITS'), 'w') as f:
    f.write('What if you became a zombie… but never lost your mind? — credits\n\nVoices: Kokoro TTS (am_puck, am_adam, am_eric, am_liam, am_onyx, af_heart, bf_emma), kokoro-onnx (Apache 2.0).\nFont: Jost (SIL OFL 1.1).\nFoley: synthesised (core/audio/sfx.py).\nInstruments:\n')
    f.write('\n'.join(S.credits(sorted({(e['inst'] if isinstance(e, dict) else e[1]) for e in ev}))) + '\n')
    f.write('Figure rig and helpers: Lemo-Opuscar styles/stick-explainer (MIT). Sets: Colour Stick Explainer v2 / Meow Man.\nScience: Fredericksen et al. 2017, PNAS (Ophiocordyceps in carpenter ants).\n')
