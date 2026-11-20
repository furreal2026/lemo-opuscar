# Storyboard sheet: python3 storyboard/make_sheet.py   (from my-films/brain100; frames from look/out, watermark from brand/curious-mind)
import os
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__)); FILM = os.path.dirname(HERE); LIB = os.path.abspath(os.path.join(FILM, '../..'))
WM = Image.open(os.path.join(LIB, 'brand/curious-mind/curious-mind-watermark@2x.png')).convert('RGBA')
F = lambda n, w='SemiBold': ImageFont.truetype(os.path.join(FILM, 'look/fonts/Jost.ttf'), n)
def font(n, wt): f = F(n); f.set_variation_by_axes([wt]); return f
shots = [
 ('b01', '0:00', 'HOOK', 'Pinch-in, slow push to the head', 'You wake up at 100%. "Brain 100%" pops.', 'IN: fade from paper'),
 ('b02', '0:15', 'HOOK', 'Pull back to two figures', 'Walking supercomputer… except: the boss.', 'IN: 100% tag stretches into the orbit'),
 ('b01z', '0:31', 'HOOK > CH 1', 'FAST push through the head (0.4 s)', '"Day one." Into the brain.', 'IN: whoosh, speed lines, cut inside'),
 ('b03', '0:34', 'CH 1 · MEMORY', 'Push in on the magnifier', 'Read once. Done. Typo on page 147.', 'IN: out of the brain folds'),
 ('b04', '0:50', 'CH 1 · MEMORY', 'Slow drift left to right', 'The exam: the textbook in your head.', 'IN: match cut, book > thought book'),
 ('b04n', '1:02', 'CH 1 · MEMORY', 'Hold wide; the phone buzzes', '"But then…" Her · 1 new.', 'IN: buzz sound, phone shakes'),
 ('b04z', '1:03', 'CH 1 · MEMORY', 'FAST spring push to the phone (0.35 s)', 'Camera rushes to the phone.', 'IN: whoosh + ink speed lines'),
 ('b05p', '1:04', 'CH 1 · MEMORY', 'Phone fills frame, small overshoot', '"Fine." Over your shoulder.', 'IN: hard cut on the 2nd buzz'),
 ('b05', '1:10', 'CH 1 · MEMORY', 'Cards fly out of the phone', 'Archive search: danger 98.7%.', 'IN: chat bubble splits into 3 cards'),
 ('b05c', '1:36', 'CH 1 · MEMORY', 'Locked; shake on the crash', '"Whatever." Your brain crashes.', 'IN: hard cut, low hit, 0.3 s silence'),
 ('b06', '1:44', 'CH 2 · SPEED', 'Push in to the board', 'Checkmate in 12. Computer: BRB.', 'IN: reboot pop, pinch-in'),
 ('b06z', '1:58', 'CH 2 · SPEED', 'Tilt down to top view, fast', '12 moves ahead, numbered.', 'IN: camera tips over the table'),
 ('b07e', '2:20', 'CH 2 · SPEED', 'Locked; outcome tree fans out', 'A/B/C > 10,000,000 > ERROR.', 'IN: chess arrows grow into the tree'),
 ('b08', '2:54', 'CH 3 · EINSTEIN', 'Locked, then dive into the grid', 'No secret brain switch. 10% myth.', 'IN: error card breaks to chalk dust'),
 ('b09a', '3:12', 'CH 3 · EINSTEIN', 'Slide right, laptop to blueprint', 'A fast computer is not a spaceship.', 'IN: out of the grid onto the blueprint'),
 ('b09', '3:25', 'CH 3 · EINSTEIN', 'Rack to the door on the right', '"Baby, what are you thinking about?"', 'IN: the blueprint rolls up, cut'),
 ('b10', '3:51', 'CH 4 · ATHLETE', 'Slow-mo along the ball path', 'Prediction, not magic.', 'IN: the chalk planet becomes the ball'),
 ('b10z', '4:08', 'CH 4 · ATHLETE', 'FAST push to the face, slow-mo x20', 'The ball misses by 3 cm.', 'IN: snap zoom on "toward your face"'),
 ('b11', '4:25', 'CH 4 · ATHLETE', 'Whip-follow the pillows', '"Calculated." Household goalkeeper.', 'IN: match cut, ball arc > pillow arc'),
 ('b12q', '4:42', 'CH 4 · ATHLETE', 'FAST push to the two of them', '"Do you remember what day it is?"', 'IN: snap zoom, music cuts out'),
 ('b12', '4:48', 'CH 4 · ATHLETE', 'Pull back + tilt to the calendar', 'Six months? SEVEN.', 'IN: pull back, scan beam sweeps'),
 ('b13', '5:06', 'CH 5 · LEARNING', 'Locked; pulse runs the chain', 'Neuroplasticity: neurons hold hands.', 'IN: red head cools, pull back'),
 ('b14', '5:40', 'CH 5 · LEARNING', 'Push in to the face; red fills up', 'Extra wasabi. Face turns red.', 'IN: pulse runs off-frame into here'),
 ('b14n', '6:00', 'CH 5 · LEARNING', 'Analysis boxes snap on', '"Nothing\'s wrong." Analysis HUD.', 'IN: steam clears into her room'),
 ('b15', '6:23', 'CH 6 · ENERGY', 'Bars grow, drift to the cans', '2% of you, 20% of the energy.', 'IN: hard cut on "tiny problem"'),
 ('b16p', '6:45', 'CH 6 · ENERGY', 'FAST push to the phone (same as Ch 1)', '"Can we talk?" Sweat drops.', 'IN: buzz > whoosh > cut'),
 ('b16', '6:52', 'CH 6 · ENERGY', 'Dive into the head: 3 departments', 'Memory, Emotion, Reasoning panic.', 'IN: through your head'),
 ('b16r', '7:12', 'CH 6 · ENERGY', 'Back out to the phone, head red', '"Why did you like her picture?"', 'IN: zoom out of the head'),
 ('b17', '7:20', 'CH 7 · NEURONS', 'Locked wide stage; note ripple', 'Not a light switch: an orchestra.', 'IN: head workers become musicians'),
 ('b17n', '7:45', 'CH 7 · NEURONS', 'Same frame, shake', 'All at once = NOISE (seizures).', 'IN: sound slams'),
 ('b17m', '8:02', 'CH 7 · NEURONS', 'FAST push into the head', '"We need to talk." Emergency meeting.', 'IN: snap zoom on her line'),
 ('b18a', '8:19', 'ENDING', 'Long slide along the line-up', 'Intelligence isn\'t a percentage.', 'IN: zoom out, props land one by one'),
 ('b18', '8:42', 'ENDING', 'Slow pull back to the street', '"Do whatever you want." Where to eat?', 'IN: walk off the line into the night'),
 ('b18e', '8:58', 'ENDING', 'Hold; they hold hands, walk in', 'See you in the next experiment!', 'IN: the decision: tacos'),
]
def wm(im):
    w = round(im.width * 293 / 1920); h = round(w * WM.height / WM.width); y = round(im.height * 26 / 1080)
    im = im.convert('RGBA'); im.alpha_composite(WM.resize((w, h), Image.LANCZOS), ((im.width - w) // 2, y)); return im.convert('RGB')
os.makedirs(os.path.join(HERE, 'frames'), exist_ok=True)
cols, tw, th, cap, gap = 5, 620, 349, 142, 24
rows = (len(shots) + 1 + cols - 1) // cols
S = Image.new('RGB', (cols * tw + (cols + 1) * gap, 130 + rows * (th + cap + gap)), '#ECE8E0'); d = ImageDraw.Draw(S)
d.text((gap, 28), 'What if you used 100% of your brain?  —  storyboard v2 (34 frames, ~9:00, 16:9, Colour Stick v2)', fill='#24242C', font=font(46, 600))
d.text((gap, 86), 'Ginger = the upgraded brain · Red = danger / crash · narrator am_puck (fast) · Curious Mind watermark burnt in, top centre', fill='#6E6A62', font=font(28, 450))
for k, (f, t, ch, cam, what, tr) in enumerate(shots):
    im = wm(Image.open(os.path.join(FILM, 'look/out', f + '-0.jpg'))); im.save(os.path.join(HERE, 'frames', f'{k + 1:02d}_{f}.jpg'), quality=90)
    x = gap + (k % cols) * (tw + gap); y = 130 + (k // cols) * (th + cap + gap)
    S.paste(im.resize((tw, th), Image.LANCZOS), (x, y))
    d.text((x, y + th + 10), f'{k + 1}  {t}', fill='#E07A1F', font=font(28, 600)); d.text((x + 140, y + th + 15), ch, fill='#6E6A62', font=font(20, 500))
    d.text((x, y + th + 48), what, fill='#24242C', font=font(22, 500))
    d.text((x, y + th + 80), 'Camera: ' + cam, fill='#6E6A62', font=font(19, 450))
    d.text((x, y + th + 108), tr, fill='#3D7FB8', font=font(19, 500))
# legend tile
k = len(shots); x = gap + (k % cols) * (tw + gap); y = 130 + (k // cols) * (th + cap + gap)
d.rounded_rectangle((x, y, x + tw, y + th), 18, fill='#F3F0EA', outline='#24242C', width=3)
L = ['Transitions', '• NOTIF ZOOM: buzz > 0.35 s spring push', '   to the phone + ink speed lines > cut to', '   the chat screen (clip: transition_notif_zoom.mp4)', '• SNAP ZOOM on key lines (ball, questions, meeting)', '• THROUGH a shape: head, spacetime grid', '• MATCH cuts: book, ball > pillow, planet > ball', '• CRASH: red head, slump, 0.3 s silence, reboot', '• Blue text = how we ARRIVE in each frame']
for i, s in enumerate(L): d.text((x + 22, y + 18 + i * 36), s, fill='#24242C' if i else '#E07A1F', font=font(21 if i else 26, 500 if i else 600))
S.save(os.path.join(HERE, 'storyboard.jpg'), quality=88); print(S.size)
