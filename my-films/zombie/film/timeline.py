# Builds timeline.js/json from STORYBOARD.md (scene durations) and the voice (line durations, word times).
import json, os, re
H = os.path.dirname(os.path.abspath(__file__)); Z = os.path.join(H, '..'); V = os.path.join(Z, 'voice')
lines = json.load(open(os.path.join(V, 'lines.json')))
dur = json.load(open(os.path.join(V, 'out', 'dur.json')))
words = json.load(open(os.path.join(V, 'out', 'words.json')))
sb = open(os.path.join(Z, 'STORYBOARD.md')).read()
plan = [(m.group(1), float(m.group(2))) for m in re.finditer(r'^\*\*(\d{3}) · (\d+(?:\.\d+)?) s', sb, re.M)]
assert len(plan) == 120, len(plan)
byScene = {}
for l in lines: byScene.setdefault(l['scene'], []).append(l)
t = 0.0; scenes = []; L = {}; cues = []
for sid, d in plan:
    t0 = t; end = t0 + d; prev = t0
    for l in sorted(byScene.get(sid, []), key=lambda l: l['at']):
        lid = l['id']; c = max(t0 + l['at'], prev + (.3 if prev > t0 else 0)); prev = c + dur[lid]
        w = [[x, round(c + max(0, a), 3), round(c + b, 3)] for x, a, b in words[lid]]
        L[lid] = {'t': round(c, 3), 'dur': dur[lid], 'scene': sid, 'text': l['text'], 'words': w, 'voice': l['voice']}
        text = l['text'].replace('...', '…')
        sents = re.findall(r'[^.!?…]+[.!?…]*', text); chunks = []
        for s in sents:
            s = s.strip()
            if chunks and len(chunks[-1]) + 1 + len(s) <= 62: chunks[-1] += ' ' + s
            else: chunks.append(s)
        nw = [len(ch.split()) for ch in chunks]; k = 0
        for ch, n in zip(chunks, nw):
            a = w[min(k, len(w) - 1)][1] if w else c; k += n
            b = w[min(k, len(w)) - 1][2] if w else c + dur[lid]
            cues.append({'t0': round(a - .05, 3), 't1': round(b + .35, 3), 'text': ch, 'line': lid})
        end = max(end, c + dur[lid] + .6)
    scenes.append({'id': sid, 't0': round(t0, 3), 't1': round(end, 3)}); t = end
cues.sort(key=lambda q: q['t0'])
for i, q in enumerate(cues):
    nxt = cues[i + 1]['t0'] - .05 if i + 1 < len(cues) else q['t1'] + 2
    q['t1'] = round(min(max(q['t1'], q['t0'] + 1.8), nxt), 3)
T = {'dur': round(t, 3), 'scenes': scenes, 'lines': L, 'cues': cues}
json.dump(T, open(os.path.join(H, 'timeline.json'), 'w'), indent=1)
open(os.path.join(H, 'timeline.js'), 'w').write('window.TL = ' + json.dumps(T) + ';\n')
json.dump([{'t0': q['t0'], 't1': q['t1'], 'text': q['text']} for q in cues], open(os.path.join(H, 'cues.json'), 'w'), indent=1)
print('dur', round(t, 2), 'scenes', len(scenes), [ (s['id'], round(s['t1']-s['t0'],2)) for s,(i,d) in zip(scenes,plan) if abs((s['t1']-s['t0'])-d)>.01])
