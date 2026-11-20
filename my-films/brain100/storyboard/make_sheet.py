# Storyboard sheet: python3 storyboard/make_sheet.py   (from my-films/brain100; frames from look/out, watermark from brand/curious-mind)
import os
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__)); FILM = os.path.dirname(HERE); LIB = os.path.abspath(os.path.join(FILM, '../..'))
WM = Image.open(os.path.join(LIB, 'brand/curious-mind/curious-mind-watermark@2x.png')).convert('RGBA')
F = lambda n, w='SemiBold': ImageFont.truetype(os.path.join(FILM, 'look/fonts/Jost.ttf'), n)
def font(n, wt): f = F(n); f.set_variation_by_axes([wt]); return f
shots = [
 ('b01', '0:00', 'HOOK', 'Pinch-in, slow push to the head', 'You wake up at 100%. The "Brain 100%" tag pops.', 'IN: fade from paper'),
 ('b02', '0:15', 'HOOK', 'Pull back to two figures', 'Walking supercomputer… except: the boss bar fills.', 'IN: the 100% tag stretches into the orbit ring'),
 ('b03', '0:34', 'CH 1 · MEMORY', 'Push in on the magnifier', 'Read once. Done. The typo on page 147.', 'IN: dive THROUGH the ginger head into memory'),
 ('b04', '0:50', 'CH 1 · MEMORY', 'Slow drift left to right', 'The exam: the textbook appears in your head.', 'IN: match cut, open book > book in thought cloud'),
 ('b05', '1:10', 'CH 1 · MEMORY', 'Locked; cards fly out of the phone', '"Fine." Archive search > danger 98.7%. Crash.', 'IN: hard cut on the phone buzz'),
 ('b06', '1:44', 'CH 2 · SPEED', 'Push in to the board, pull to the PC', 'Checkmate in 12. Chess computer: BRB, coffee.', 'IN: crash freeze > head reboots, pinch-in'),
 ('b07e', '2:20', 'CH 2 · SPEED', 'Locked; outcome tree fans out', 'Option A/B/C > 10,000,000 outcomes > ERROR.', 'IN: chess arrows grow into the outcome tree'),
 ('b08', '2:54', 'CH 3 · EINSTEIN', 'Locked, then dive into the grid', 'No secret brain switch. The 10% myth struck out.', 'IN: error card shatters to chalk dust'),
 ('b09', '3:25', 'CH 3 · EINSTEIN', 'Rack to the door on the right', '"Baby, what are you thinking about?"', 'IN: back OUT of the spacetime grid'),
 ('b10', '3:51', 'CH 4 · ATHLETE', 'Slow-mo along the ball path', 'Prediction, not magic: the keeper pre-dives.', 'IN: the chalk planet becomes the football'),
 ('b11', '4:25', 'CH 4 · ATHLETE', 'Whip-follow the flying pillows', '"Calculated." The household goalkeeper.', 'IN: match cut, ball arc > pillow arc'),
 ('b12', '4:45', 'CH 4 · ATHLETE', 'Tilt up to the calendar, scan', 'Six months? SEVEN. Reflexes yes, survival no.', 'IN: tilt up from the sofa to the wall'),
 ('b13', '5:06', 'CH 5 · LEARNING', 'Locked; the pulse runs the chain', 'Neuroplasticity: people as neurons, holding hands.', 'IN: red head cools to ginger, pull back'),
 ('b14', '5:40', 'CH 5 · LEARNING', 'Push in to the face; red fills up', 'You understand everything… extra wasabi.', 'IN: the pulse runs off-frame into the restaurant'),
 ('b15', '6:23', 'CH 6 · ENERGY', 'Bars grow, drift right to the cans', '2% of you, 20% of the energy. 17 cans.', 'IN: the steam puffs become the chart bars'),
 ('b16', '6:50', 'CH 6 · ENERGY', 'Dive into the head: 3 departments', '"Can we talk?" Memory, Emotion, Reasoning panic.', 'IN: hard cut on the phone buzz'),
 ('b17', '7:20', 'CH 7 · NEURONS', 'Locked wide stage; ripple of notes', 'Not a light switch: an orchestra. Right time.', 'IN: zoom OUT of the head, the workers become musicians'),
 ('b17n', '7:45', 'CH 7 · NEURONS', 'Same frame, everyone at full volume', 'All at once = noise (seizures). Emergency meeting.', 'IN: same frame, sound slams'),
 ('b18', '8:19', 'ENDING · FINAL BOSS', 'Slow pull back to the night street', '"Do whatever you want." Where to eat? End card.', 'IN: callback line-up of every prop, then cut'),
]
def wm(im):
    w = round(im.width * 293 / 1920); h = round(w * WM.height / WM.width); y = round(im.height * 26 / 1080)
    im = im.convert('RGBA'); im.alpha_composite(WM.resize((w, h), Image.LANCZOS), ((im.width - w) // 2, y)); return im.convert('RGB')
os.makedirs(os.path.join(HERE, 'frames'), exist_ok=True)
cols, tw, th, cap, gap = 4, 760, 428, 150, 26
rows = (len(shots) + 1 + cols - 1) // cols
S = Image.new('RGB', (cols * tw + (cols + 1) * gap, 130 + rows * (th + cap + gap)), '#ECE8E0'); d = ImageDraw.Draw(S)
d.text((gap, 28), 'What if you used 100% of your brain?  —  storyboard (19 key frames, ~9:00, 16:9, Colour Stick v2)', fill='#24242C', font=font(46, 600))
d.text((gap, 86), 'Ginger = the upgraded brain · Red = danger / crash · narrator am_puck (fast) · Curious Mind watermark burnt in, top centre', fill='#6E6A62', font=font(28, 450))
for k, (f, t, ch, cam, what, tr) in enumerate(shots):
    im = wm(Image.open(os.path.join(FILM, 'look/out', f + '-0.jpg'))); im.save(os.path.join(HERE, 'frames', f'{k + 1:02d}_{f}.jpg'), quality=90)
    x = gap + (k % cols) * (tw + gap); y = 130 + (k // cols) * (th + cap + gap)
    S.paste(im.resize((tw, th), Image.LANCZOS), (x, y))
    d.text((x, y + th + 10), f'{k + 1}  {t}', fill='#E07A1F', font=font(30, 600)); d.text((x + 150, y + th + 16), ch, fill='#6E6A62', font=font(22, 500))
    d.text((x, y + th + 50), what, fill='#24242C', font=font(24, 500))
    d.text((x, y + th + 84), 'Camera: ' + cam, fill='#6E6A62', font=font(21, 450))
    d.text((x, y + th + 114), tr, fill='#3D7FB8', font=font(21, 500))
# legend tile
k = len(shots); x = gap + (k % cols) * (tw + gap); y = 130 + (k // cols) * (th + cap + gap)
d.rounded_rectangle((x, y, x + tw, y + th), 18, fill='#F3F0EA', outline='#24242C', width=3)
L = ['Transitions (v2: no wipes, page turns or zoom-blur)', '', '• Each scene opens with the tablet pinch: 1.06x to 1x, 2° turn', '• THROUGH a shape: into the head, the spacetime grid', '• MATCH cuts: book > thought book, ball > pillow,', '   chess arrows > outcome tree, planet > football', '• HARD CUT on a sound: phone buzz, crash hit', '• CRASH beat: head flashes red, figure slumps, 0.3 s', '   of silence, then a soft "reboot" pop into the next', '• Blue text under each frame = how we ARRIVE there']
for i, s in enumerate(L): d.text((x + 28, y + 26 + i * 38), s, fill='#24242C' if i else '#E07A1F', font=font(24 if i else 26, 500 if i else 600))
S.save(os.path.join(HERE, 'storyboard.jpg'), quality=88); print(S.size)
