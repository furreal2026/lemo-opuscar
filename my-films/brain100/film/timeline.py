# Builds film/timeline.json + timeline.js + cues.json from the voice: scenes, line starts, word times, subtitle cues.
import json, math, os, re
H = os.path.dirname(os.path.abspath(__file__)); V = os.path.join(H, '..', 'voice')
lines = json.load(open(os.path.join(V, 'lines.json')))
dur = json.load(open(os.path.join(V, 'out', 'dur.json')))
words = json.load(open(os.path.join(V, 'out', 'words.json')))
BEAT = 0.5   # 120 bpm: every scene starts on a beat
# per-scene lead (time before the first line: room for the transition) and tail
LEAD = {'h1': 1.0, 'c1a': 1.3, 'c1e': .3, 'c1f': .5}
TAIL = {'h3': .2, 'c1d': .3, 'c1e': .2, 'c1g': 1.2}
# extra pause before a line (punchlines, dialogue, a beat of silence)
PAUSE = {'p006': .5, 'p008': .45, 'p019': .5, 'p030': .55, 'p031': .25, 'p041': .35, 'p043': .45, 'p044': .6, 'p045': .5}
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
            if chunks and len(chunks[-1]) + 1 + len(s) <= 56: chunks[-1] += ' ' + s
            else: chunks.append(s)
        # split long chunks at a comma near the middle
        out = []
        for ch in chunks:
            if len(ch) > 56 and ',' in ch:
                parts = ch.split(', '); acc = ''
                for p in parts:
                    if acc and len(acc) + len(p) + 2 > 56: out.append(acc + ','); acc = p
                    else: acc = (acc + ', ' + p) if acc else p
                out.append(acc)
            else: out.append(ch)
        out2 = []
        for ch in out:   # still too long and no comma: split at the word nearest the middle
            ws = ch.split()
            if len(ch) > 56 and len(ws) > 4:
                m = len(ws) // 2; out2 += [' '.join(ws[:m]), ' '.join(ws[m:])]
            else: out2.append(ch)
        out = out2
        nw = [len(ch.split()) for ch in out]; k = 0
        for ch, n in zip(out, nw):
            a = w[min(k, len(w) - 1)][1] if w else c; k += n
            b = w[min(k, len(w)) - 1][2] if w else c + dur[lid]
            cues.append({'t0': round(a - .05, 3), 't1': round(b + .3, 3), 'text': ch, 'line': lid})
        c += dur[lid]
    t1 = math.ceil((c + TAIL.get(sid, .55)) / BEAT) * BEAT
    scenes.append({'id': sid, 't0': round(t0, 3), 't1': round(t1, 3)}); t = t1
for i, q in enumerate(cues):
    nxt = cues[i + 1]['t0'] - .04 if i + 1 < len(cues) else q['t1'] + 2
    q['t1'] = round(min(max(q['t1'], q['t0'] + 1.2), nxt), 3)
TL = {'dur': t, 'beat': BEAT, 'scenes': scenes, 'lines': L, 'cues': cues}
json.dump(TL, open(os.path.join(H, 'timeline.json'), 'w'), indent=1)
open(os.path.join(H, 'timeline.js'), 'w').write('window.TL = ' + json.dumps(TL) + ';\n')
json.dump([{'t0': q['t0'], 't1': q['t1'], 'text': q['text']} for q in cues], open(os.path.join(H, 'cues.json'), 'w'), indent=1)
print('dur %.1f s (%d:%02d)' % (t, t // 60, t % 60)); [print(s) for s in scenes]
