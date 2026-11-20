# Builds film/timeline.json + timeline.js + cues.json from the voice: scenes, line starts, word times, subtitle cues.
import json, math, os, re
H = os.path.dirname(os.path.abspath(__file__)); V = os.path.join(H, '..', 'voice')
lines = json.load(open(os.path.join(V, 'lines.json')))
dur = json.load(open(os.path.join(V, 'out', 'dur.json')))
words = json.load(open(os.path.join(V, 'out', 'words.json')))
BEAT = 0.5   # 120 bpm: every scene starts on a beat
# per-scene lead (time before the first line: room for the transition) and tail
LEAD = {'h1': 1.0, 'c1a': 1.3, 'c1e': .3, 'c1f': .5, 'c2a': .9, 'c3a': .9, 'c4a': .9, 'c5a': .9, 'c6a': .9, 'c7a': .9, 'e1': .9, 'c6b': .3, 'c6d': .35, 'c2c': .5, 'c4c': .6}
TAIL = {'h3': .2, 'c1d': .3, 'c1e': .2, 'c1g': 1.2, 'c2f': 1.0, 'c3c': 1.0, 'c4f': 1.0, 'c5d': 1.0, 'c6b': .2, 'c6d': 1.0, 'c7d': 1.0, 'e3': 2.5}
# extra pause before a line (punchlines, dialogue, a beat of silence)
PAUSE = {'p006': .5, 'p008': .45, 'p019': .5, 'p030': .55, 'p031': .25, 'p041': .35, 'p043': .45, 'p044': .6, 'p045': .5, 'p057': .3, 'p073': .3, 'p075': .35, 'p076': .5, 'p097': .3, 'p100': .4, 'p104': .3, 'p117': .3, 'p124': .3, 'p138': .4, 'p140': .3, 'p160': .5, 'p173': .35, 'p185': .3, 'p187': .5, 'p196': .5, 'p200': .3, 'p208': .3, 'p215': .4, 'p222': .3, 'p233': .5, 'p240': .5, 'p241': .6}
order = []
for l in lines:
    if not order or order[-1][0] != l['scene']: order.append((l['scene'], []))
    order[-1][1].append(l)
t = 0.0; scenes = []; L = {}; cues = []
for sid, ls in order:
    t0 = t; c = t0 + LEAD.get(sid, .35)
    for i, l in enumerate(ls):
        lid = l['id']
        if i: c += .24 + PAUSE.get(lid, 0)
        else: c += PAUSE.get(lid, 0) * .5
        w = [[x, round(c + max(0, a), 3), round(c + b, 3)] for x, a, b in words[lid]]
        L[lid] = {'t': round(c, 3), 'dur': dur[lid], 'scene': sid, 'text': l['sub'], 'words': w}
        text = l['sub']
        sents = re.findall(r'(?:[^.!?…]|\.(?=\d))+[.!?…"]*', text); chunks = []
        for s in sents:
            s = s.strip()
            if not s: continue
            if chunks and len(chunks[-1]) + 1 + len(s) <= 44: chunks[-1] += ' ' + s
            else: chunks.append(s)
        # split long chunks at a comma near the middle
        out = []
        for ch in chunks:
            if len(ch) > 44 and ',' in ch:
                parts = ch.split(', '); acc = ''
                for p in parts:
                    if acc and len(acc) + len(p) + 2 > 44 and len(acc) >= 20: out.append(acc + ','); acc = p
                    else: acc = (acc + ', ' + p) if acc else p
                out.append(acc)
            else: out.append(ch)
        def split(ch):   # still too long: split into the fewest balanced word groups that each fit
            ws = ch.split()
            if len(ch) <= 44 or len(ws) < 2: return [ch]
            n = 2
            while True:
                per = len(ch) / n; parts = []; cur = []
                for w in ws:
                    if cur and len(' '.join(cur + [w])) > per + 6 and len(parts) < n - 1: parts.append(' '.join(cur)); cur = [w]
                    else: cur.append(w)
                parts.append(' '.join(cur))
                if all(len(x) <= 44 for x in parts): return parts
                n += 1
        out = [x for ch in out for x in split(ch)]
        nw = [len(ch.split()) for ch in out]; k = 0
        for ch, n in zip(out, nw):
            a = w[min(k, len(w) - 1)][1] if w else c; k += n
            b = w[min(k, len(w)) - 1][2] if w else c + dur[lid]
            cues.append({'t0': round(a - .05, 3), 't1': round(b + .3, 3), 'text': ch, 'line': lid})
        c += dur[lid]
    t1 = math.ceil((c + TAIL.get(sid, .55)) / BEAT) * BEAT
    scenes.append({'id': sid, 't0': round(t0, 3), 't1': round(t1, 3)}); t = t1
# merge a cue that would flash (< 0.7 s before the next one of the same line) into its neighbour, if the result stays short
i = 0
while i < len(cues) - 1:
    q, n = cues[i], cues[i + 1]
    if q['line'] == n['line'] and (n['t0'] - q['t0'] < .7 or len(q['text']) < 8) and len(q['text']) + len(n['text']) + 1 <= 52:
        q['text'] += ' ' + n['text']; q['t1'] = n['t1']; del cues[i + 1]
    else: i += 1
for i, q in enumerate(cues):
    nxt = cues[i + 1]['t0'] - .04 if i + 1 < len(cues) else q['t1'] + 2
    q['t1'] = round(min(max(q['t1'], q['t0'] + 1.2), nxt), 3)
TL = {'dur': t, 'beat': BEAT, 'scenes': scenes, 'lines': L, 'cues': cues}
json.dump(TL, open(os.path.join(H, 'timeline.json'), 'w'), indent=1)
open(os.path.join(H, 'timeline.js'), 'w').write('window.TL = ' + json.dumps(TL) + ';\n')
json.dump([{'t0': q['t0'], 't1': q['t1'], 'text': q['text']} for q in cues], open(os.path.join(H, 'cues.json'), 'w'), indent=1)
print('dur %.1f s (%d:%02d)' % (t, t // 60, t % 60)); [print(s) for s in scenes]
