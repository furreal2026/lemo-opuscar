import sys
from PIL import Image, ImageDraw, ImageFont
H='look/out/'
shots=[('s1','1','0:00–0:20','Full · locked, then push to the bite','Hook: "What if a cat bit you?" Mr. Biscuits says no. CHOMP.'),
('s2','2','0:20–0:45','Medium · push in to the mirror','Day 1: ears, whiskers, tail. Real bites only give infections: see a doctor.'),
('s3','3','0:45–1:15','Split · locked, wipe-free cut on a beat','Power 1, night vision: light about 6× dimmer. Finds the remote at 3 a.m.'),
('s4','4','1:15–1:40','Full · tilt down with the fall','Power 2, landing feet-first (righting reflex). The paint bucket can\'t.'),
('s5','5','1:40–2:10','Wide · pull back up the 0–10 m ruler','Power 3, the jump: 5× height = 9 m. (2:10–2:30 Power 4: hearing, not drawn)'),
('s6','6','2:30–2:55','Medium · locked, mug falls in slow-mo','The turn. Side effect 1: things on edges must fall. The boss\'s mug.'),
('s7','7','3:00–3:30','Wide · drift right to the TV','The catch: sleeps 16 h a day. City needs Meow Man; he is in a box.'),
('s8','8','3:40–4:00','Wide · slow pull back, end','Day 30: Mr. Biscuits bit the boss too. Two Meow Men, both asleep. Next episode tease.')]
w,h=900,506; cap=120; cols=2
S=Image.new('RGB',(cols*w+(cols+1)*30,4*(h+cap)+5*30+90),'#ECE8E0'); d=ImageDraw.Draw(S)
F=lambda n:ImageFont.truetype('look/fonts/Jost.ttf',n)
d.text((30,24),'What if a cat bit you?  —  storyboard (8 key shots, ~4:00)',fill='#24242C',font=F(40))
for k,(f,n,t,fr,l) in enumerate(shots):
  x=30+(k%cols)*(w+30); y=90+(k//cols)*(h+cap+30)
  S.paste(Image.open(H+f+'.png').convert('RGB').resize((w,h)),(x,y))
  d.text((x,y+h+10),f'{n}   {t}',fill='#E07A1F',font=F(28)); d.text((x+260,y+h+14),fr,fill='#6E6A62',font=F(24))
  d.text((x,y+h+52),l,fill='#24242C',font=F(25))
S.save(sys.argv[1],quality=90); print(S.size)
