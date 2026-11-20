# Builds film/timeline.json from the voice durations and word times: scenes, line starts, subtitle cues.
import json, math, os, re
H = os.path.dirname(os.path.abspath(__file__)); V = os.path.join(H, '..', 'voice')
lines = {l['id']: l for l in json.load(open(os.path.join(V, 'lines.json')))}
dur = json.load(open(os.path.join(V, 'out', 'dur.json')))
words = json.load(open(os.path.join(V, 'out', 'words.json')))
BEAT = 0.5   # 120 bpm: every scene starts on a beat
# scene: (id, lead, [(line, gap_before)], tail)
PLAN = [
 ('s1', 1.4, [('l01',0), ('l02',.5), ('l03',.9)], 1.6),
 ('s2', .5, [('l04',0), ('l05',.6), ('l06',.4)], 1.2),
 ('s3', .6, [('l07',0), ('l08',.5), ('l09',.5)], 1.4),
 ('s4', .5, [('l10',0), ('l11',.4), ('l12',.5)], 1.4),
 ('s5', .5, [('l13',0), ('l14',.5), ('l15',.7)], 1.6),
 ('s9', .5, [('l16',0), ('l17',.5)], 1.2),
 ('s6', .5, [('l18',0), ('l19',.6), ('l20',1.4)], 1.4),
 ('s10', .5, [('l21',0)], 1.8),
 ('s7', .5, [('l22',0), ('l23',.5), ('l24',.5)], 1.4),
 ('s8', .7, [('l25',0), ('l26',.6), ('l27',1.0)], 3.0),
]
t = 0.0; scenes = []; L = {}; cues = []
def sub_text(s): return s.replace('...', '…')
for sid, lead, ls, tail in PLAN:
    t0 = t; c = t0 + lead
    for lid, gap in ls:
        c += gap
        w = [[x, round(c + max(0, a), 3), round(c + b, 3)] for x, a, b in words[lid]]
        L[lid] = {'t': round(c, 3), 'dur': dur[lid], 'scene': sid, 'text': lines[lid]['text'], 'words': w}
        # subtitle: split into sentence chunks of <= 60 chars, timed by word count
        text = sub_text(lines[lid]['text'])
        sents = re.findall(r'[^.!?…]+[.!?…]*', text); chunks = []
        for s in sents:
            s = s.strip()
            if chunks and len(chunks[-1]) + 1 + len(s) <= 60: chunks[-1] += ' ' + s
            else: chunks.append(s)
        nw = [len(ch.split()) for ch in chunks]; tot = sum(nw); k = 0
        for ch, n in zip(chunks, nw):
            a = w[min(k, len(w)-1)][1] if w else c; k += n
            b = w[min(k, len(w))-1][2] if w else c + dur[lid]
            cues.append({'t0': round(a - .05, 3), 't1': round(b + .35, 3), 'text': ch, 'line': lid})
        c += dur[lid]
    t1 = math.ceil((c + tail) / BEAT) * BEAT
    scenes.append({'id': sid, 't0': round(t0, 3), 't1': round(t1, 3)}); t = t1
# hold each cue >= 1.8 s where the next allows, never overlapping
for i, q in enumerate(cues):
    nxt = cues[i+1]['t0'] - .05 if i + 1 < len(cues) else q['t1'] + 2
    q['t1'] = round(min(max(q['t1'], q['t0'] + 1.8), nxt), 3)
json.dump({'dur': t, 'beat': BEAT, 'scenes': scenes, 'lines': L, 'cues': cues}, open(os.path.join(H, 'timeline.json'), 'w'), indent=1)
open(os.path.join(H, 'timeline.js'), 'w').write('window.TL = ' + json.dumps({'dur': t, 'beat': BEAT, 'scenes': scenes, 'lines': L, 'cues': cues}) + ';\n')
json.dump([{'t0': q['t0'], 't1': q['t1'], 'text': q['text']} for q in cues], open(os.path.join(H, 'cues.json'), 'w'), indent=1)
print('dur', t); [print(s) for s in scenes]
