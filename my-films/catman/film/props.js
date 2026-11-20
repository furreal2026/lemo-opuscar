// Storyboard scenes for "What if a cat bit you?" — detailed props: thick ink outline (6 px), thin detail lines (3 px), flat fills.
const DL = 3;
const C2 = MONO ? {} : { tile:'#DCEBEF', wood:'#B9834F', woodL:'#D6A673', chrome:'#B8C2C9', white:'#FBFAF6', fish:'#8FB3C9', rugL:'#7FA6E0',
  paint:'#4F86D1', kibble:'#8A5A33', bowl:'#D65A3C', leaf:'#6FAE57', leafD:'#4E8C3C', brick:'#C9715A', night:'#1C2133', nightL:'#2C3350',
  cv1:'#BFD1C9', cv2:'#9DB5AA', cv3:'#86A094', coffee:'#7A4B2A', city:'#3A4566', cityL:'#56628A', winY:'#F6D47E', skyN:'#26304D', tape:'#E2C38F' };
for (const k of ['tile','wood','woodL','chrome','white','fish','rugL','paint','kibble','bowl','leaf','leafD','brick','night','nightL','cv1','cv2','cv3','coffee','city','cityL','winY','skyN','tape']) if (!(k in C2)) C2[k] = C.tint;
function dline(P,col=C.ink){ line(P,col,DL); }
function rect(x,y,w,h,fill,o){ shape(()=>g.rect(x,y,w,h),fill,o); }
function rrect(x,y,w,h,r,fill,o){ shape(()=>g.roundRect(x,y,w,h,r),fill,o); }
function circ(x,y,r,fill,o){ shape(()=>g.arc(x,y,r,0,Math.PI*2),fill,o); }
function withRot(cx,cy,a,fn){ g.save(); g.translate(cx,cy); g.rotate(a); g.translate(-cx,-cy); fn(); g.restore(); }
function alpha(a,fn){ g.save(); g.globalAlpha=a; fn(); g.restore(); }
function tufts(x0,x1,y,step=70,seed=3){ const r=mulberry(seed); for(let x=x0;x<x1;x+=step*(.6+r())){ dline([[x-8,y],[x-12,y-14]],C2.leafD); dline([[x,y],[x,y-18]],C2.leafD); dline([[x+8,y],[x+12,y-13]],C2.leafD); } }
function tree(x,gy,h){
  const tw=h*.07; poly([[x-tw,gy],[x-tw*.7,gy-h*.55],[x+tw*.7,gy-h*.55],[x+tw,gy]],C2.wood);
  dline([[x,gy-h*.5],[x-h*.12,gy-h*.68]]); dline([[x+2,gy-h*.45],[x+h*.13,gy-h*.62]]);
  for(let i=0;i<5;i++) dline([[x-tw*.5+i*tw*.25,gy-12-i*9],[x-tw*.5+i*tw*.25,gy-40-i*14]],C.ink);
  const cl=[[0,-.78,.26],[-.2,-.66,.2],[.2,-.66,.2],[-.1,-.9,.18],[.13,-.88,.17]];
  for(const [u,v,r] of cl) circ(x+u*h,gy+v*h,r*h,C2.leaf);
  for(const [u,v,r] of cl.slice(0,3)) for(let k=0;k<3;k++){ const a=-2.2+k*.6; g.save();g.strokeStyle=C2.leafD;g.lineWidth=DL;g.lineCap='round';g.beginPath();g.arc(x+u*h,gy+v*h,r*h*.6,a,a+.5);g.stroke();g.restore(); }
}
function zzz(x,y,k=1){ text('z',x,y,{size:40*k,w:600,col:C.mute}); text('z',x+30*k,y-45*k,{size:52*k,w:600,col:C.mute}); text('Z',x+66*k,y-100*k,{size:68*k,w:600,col:C.mute}); }
function box(x,gy,w,h,{label=true}={}){
  const bt=gy-h;
  poly([[x,bt],[x-w*.2,bt-h*.3],[x+w*.12,bt-h*.25],[x+w*.24,bt]],C.boxD);
  poly([[x+w,bt],[x+w*1.17,bt-h*.36],[x+w*.84,bt-h*.27],[x+w*.76,bt]],C.boxD);
  rect(x,bt,w,h,C.box);
  // cardboard details: a crease under the flaps, corrugated edges, a stain, a stamp
  line([[x+6,bt+h*.1],[x+w-6,bt+h*.1]],C.boxD,2.2);
  for(let k=0;k<Math.floor(w/14);k++) ORIG.line([[x+8+k*14,bt+2],[x+12+k*14,bt+7]],C.boxD,1.6);
  { g.save(); g.globalAlpha=.25; g.fillStyle=C.boxD; g.beginPath(); g.ellipse(x+w*.78,gy-h*.28,w*.07,h*.06,.3,0,Math.PI*2); g.fill(); g.restore(); }
  g.save(); g.translate(x+w*.72,gy-h*.62); g.rotate(-.12); g.strokeStyle='rgba(200,60,40,.55)'; g.lineWidth=2.5; g.strokeRect(-w*.13,-12,w*.26,24); g.font=`600 ${Math.round(w*.045)}px Jost`; g.fillStyle='rgba(200,60,40,.6)'; g.textAlign='center'; g.fillText('FRAGILE',0,6); g.restore();
  rect(x+w*.42,bt,w*.16,h*.45,C2.tape,{lw:DL});
  dline([[x+w*.06,bt+10],[x+w*.06,gy-10]],C.boxD); dline([[x+w*.94,bt+10],[x+w*.94,gy-10]],C.boxD);
  if(label){ const lx=x+w*.12, ly=gy-h*.38; rect(lx,ly,w*.3,h*.24,C2.white,{lw:DL});
    arrowHead(lx+w*.08,ly+h*.06,-Math.PI/2,10,C.ink,DL); dline([[lx+w*.08,ly+h*.06],[lx+w*.08,ly+h*.19]]);
    arrowHead(lx+w*.2,ly+h*.06,-Math.PI/2,10,C.ink,DL); dline([[lx+w*.2,ly+h*.06],[lx+w*.2,ly+h*.19]]); }
  return bt;
}
// head (+ ears, whiskers) peeking over a rim at y=rim
function peek(x,rim,S,opt={}){ g.save(); g.beginPath(); g.rect(0,0,W,rim+4); g.clip(); catman({x,gy:rim+S*.75,S},pose({head:opt.tilt??.18}),{tail:0}); g.restore(); }
function houseD(hx0,hx1,gy,wallTop,peak){
  // chimney
  const cx=hx0+(hx1-hx0)*.72; rect(cx,peak+(wallTop-peak)*.18,46,(wallTop-peak)*.6,C2.brick);
  for(let i=1;i<4;i++) dline([[cx,peak+(wallTop-peak)*.18+i*24],[cx+46,peak+(wallTop-peak)*.18+i*24]]);
  rect(cx-6,peak+(wallTop-peak)*.18-14,58,16,C2.brick);
  rect(hx0,wallTop,hx1-hx0,gy-wallTop,C.wall);
  // siding lines
  for(let y=wallTop+38;y<gy;y+=38) dline([[hx0+3,y],[hx1-3,y]],'#D9B65E');
  const R=[[hx0-30,wallTop],[(hx0+hx1)/2,peak],[hx1+30,wallTop]];
  poly(R,C.roof);
  g.save(); g.beginPath(); g.moveTo(...R[0]); g.lineTo(...R[1]); g.lineTo(...R[2]); g.closePath(); g.clip();
  for(let y=peak+26,row=0;y<wallTop;y+=26,row++){ dline([[hx0-40,y],[hx1+40,y]],'#A8432B'); for(let x=hx0-40+(row%2)*24;x<hx1+40;x+=48) dline([[x,y],[x,y-26]],'#A8432B'); }
  g.restore(); poly(R,null);
  line([[hx0-30,wallTop+8],[hx1+30,wallTop+8]],C.ink,8);   // gutter
  const win=(x,y,w,h)=>{ rect(x,y,w,h,C.sky); dline([[x+w/2,y],[x+w/2,y+h]]); dline([[x,y+h/2],[x+w,y+h/2]]);
    poly([[x+4,y+4],[x+w*.28,y+4],[x+4,y+h*.6]],C2.white,{lw:0}); rect(x-10,y+h,w+20,12,C2.white); };
  win(hx0+50,wallTop+50,110,100); win(hx0+260,wallTop+50,110,100); win(hx0+50,wallTop+225,110,100);
  const dx=hx0+275, dw=90, dh=170; rect(dx,gy-dh,dw,dh,C.blue);
  rect(dx+14,gy-dh+16,dw-28,58,null,{lw:DL}); rect(dx+14,gy-dh+86,dw-28,60,null,{lw:DL});
  circ(dx+dw-16,gy-dh*.48,6,C.wall,{lw:DL}); rect(dx-14,gy-12,dw+28,12,C2.white,{lw:4});
  dline([[dx+dw/2-20,gy-dh-22],[dx+dw/2+20,gy-dh-22]]); text('12',dx+dw/2,gy-dh-30,{size:20,w:600,align:'center'});
}
function fence(x0,x1,gy,h){ for(let x=x0;x<x1;x+=34){ poly([[x,gy],[x,gy-h],[x+12,gy-h-14],[x+24,gy-h],[x+24,gy]],C2.white,{lw:4}); }
  line([[x0-6,gy-h*.35],[x1,gy-h*.35]],C.ink,4); line([[x0-6,gy-h*.75],[x1,gy-h*.75]],C.ink,4); }

// ---------------- S1: the bite ----------------
SCENES.s1 = { dur:1, setup(){}, draw(){
  label('What if?  ·  Episode 1',124,118);
  text('What if a cat',116,230,{size:104,w:600,track:-2});
  text('bit you?',116,340,{size:104,w:600,track:-2,col:C.ginger});
  const gy=880;
  // framed fish picture on the wall
  rect(1440,170,280,210,C2.wood); rect(1462,192,236,166,C.sky,{lw:DL});
  shape(()=>{g.moveTo(1500,275);g.quadraticCurveTo(1570,215,1640,275);g.quadraticCurveTo(1570,335,1500,275);},C2.fish,{lw:DL});
  poly([[1640,275],[1675,250],[1675,300]],C2.fish,{lw:DL}); circ(1525,268,5,C.ink,{lw:0});
  for(const x of [1560,1585,1610]) dline([[x,248],[x+8,275],[x,302]]);
  dline([[1560,170],[1580,130],[1600,170]]); circ(1580,128,6,C.ink,{lw:0});
  ground(gy,124,1796);
  // rug with border and fringe
  shape(()=>g.ellipse(1300,gy+12,470,30,0,0,Math.PI*2),C.blue,{lw:5});
  shape(()=>g.ellipse(1300,gy+12,410,19,0,0,Math.PI*2),null,{col:C2.rugL,lw:DL});
  for(const s of [-1,1]) for(let k=-2;k<=2;k++) dline([[1300+s*470,gy+12+k*9],[1300+s*495,gy+12+k*11]]);
  const p=pose({lean:.34,bend:-.03,head:.5,hy:.015,ra:1.12,rb:.08,la:-.2,lb:.35,lfx:-.06,rfx:.12});
  const f={x:1000,gy,S:470};
  const j=joints(f,p), hand=j.aR[1], cs=270, cx=hand[0]+.4*cs, base=hand[1]+.66*cs;
  rrect(cx-.42*cs,base,.86*cs,gy-base,20,C.pink);
  g.save(); g.setLineDash([8,10]); rrect(cx-.42*cs+12,base+12,.86*cs-24,gy-base-24,12,null,{lw:DL,col:'#C9746C'}); g.restore();
  // bowl
  const bx=1650; poly([[bx-60,gy-50],[bx+60,gy-50],[bx+45,gy],[bx-45,gy]],C2.bowl);
  for(let i=0;i<9;i++) circ(bx-42+i*10.5,gy-55-(i%3)*5,7,C2.kibble,{lw:2});
  text('MR. B',bx,gy-16,{size:20,w:600,col:C2.white,align:'center',track:2});
  figure(f,p);
  cat(cx,base,cs,{d:1,mood:'angry',mouth:1});
  jag(hand[0]-8,hand[1]-14,30,5,C.red,6);
  text('CHOMP',hand[0]-30,hand[1]-150,{size:44,w:600,col:C.red,track:2});
  label('Mr. Biscuits, 4 kg',cx+150,base-150);
  line([[cx+230,base-134],[cx+160,base-80]],C.mute,3); arrowHead(cx+160,base-80,Math.atan2(54,-70),12,C.mute,3);
  subtitle('Step one: pet a cat that has clearly said no.');
}};

// ---------------- S2: the mirror ----------------
SCENES.s2 = { dur:1, setup(){}, draw(){
  label('Day 1  ·  7:02 a.m.',124,118);
  text('Something is',116,226,{size:96,w:600,track:-2});
  text('different.',116,326,{size:96,w:600,track:-2,col:C.ginger});
  const gy=880;
  // tiles
  rect(960,170,640,560,C2.tile,{lw:0});
  for(let x=960;x<=1600;x+=64) dline([[x,170],[x,730]],'#B7CDD3');
  for(let y=170;y<=730;y+=64) dline([[960,y],[1600,y]],'#B7CDD3');
  // mirror + reflection
  const mx=1090,my=210,mw=340,mh=420;
  rrect(mx-18,my-18,mw+36,mh+36,26,C2.wood); rrect(mx,my,mw,mh,14,C.screen,{lw:DL});
  g.save(); g.beginPath(); g.roundRect(mx,my,mw,mh,14); g.clip();
  catman({x:mx+mw/2,gy:my+mh+250,S:420,face:-1},pose({la:-2.3,lb:-.4,ra:2.3,rb:.4,head:.05}));
  for(const [a,b] of [[[mx+30,my+40],[mx+90,my+12]],[[mx+30,my+90],[mx+150,my+20]]]) line([a,b],C2.white,8);
  g.restore();
  // counter, basin, tap, cup
  rect(1010,700,520,34,C2.white); shape(()=>g.ellipse(1260,702,120,16,0,0,Math.PI*2),C.screen,{lw:DL});
  rrect(1248,640,24,60,6,C2.chrome); rrect(1248,640,70,20,8,C2.chrome); circ(1236,690,10,C2.chrome,{lw:DL}); circ(1288,690,10,C2.chrome,{lw:DL});
  rect(1035,734,470,146,C2.woodL); dline([[1270,734],[1270,880]]); rrect(1240,780,12,46,5,C2.chrome,{lw:DL}); rrect(1288,780,12,46,5,C2.chrome,{lw:DL});
  rect(1035,860,470,20,C2.wood,{lw:DL});
  rect(1440,640,44,60,C.blue); line([[1452,640],[1442,590]],C.red,6); line([[1472,640],[1484,596]],C.grass,6);
  ground(gy,124,1796);
  // you
  catman({x:720,gy,S:420},pose({la:-2.3,lb:-.4,ra:2.3,rb:.4,head:-.05}));
  for(const a of [-2.6,-2.2,-1.0,-.6]) dline([[720+Math.cos(a)*120,520+Math.sin(a)*120],[720+Math.cos(a)*160,520+Math.sin(a)*160]]);
  text('?!',820,420,{size:64,w:600,col:C.red});
  subtitle('You wake up with two extra ears. On top.');
}};

// ---------------- S3: night vision split ----------------
function bedroom(x,y,w,h,pal){
  g.save(); g.translate(x,y); const k=w/800; g.scale(k,k);
  const L=pal.line, o={col:L}, od={col:L,lw:DL};
  g.save(); g.beginPath(); g.rect(0,0,800,520); g.clip();
  rect(0,0,800,520,pal.wall,{lw:0}); rect(0,400,800,120,pal.floor,{lw:0}); line([[0,400],[800,400]],L,4);
  for(let x2=0;x2<800;x2+=90) line([[x2,400],[x2-30,520]],L,DL);
  // window + moon + curtains
  rect(520,60,200,170,pal.glass,o); circ(660,110,26,pal.moon,od); line([[620,60],[620,230]],L,DL); line([[520,145],[720,145]],L,DL);
  for(const s of [500,700]) shape(()=>{g.moveTo(s,46);g.lineTo(s+40,46);g.quadraticCurveTo(s+50,150,s+44,250);g.lineTo(s-4,250);g.quadraticCurveTo(s+6,150,s,46);},pal.curtain,od);
  // bed
  rect(40,250,30,230,pal.wood,o); rect(40,330,420,90,pal.blanket,o); rect(70,300,120,40,pal.pillow,od);
  line([[200,330],[200,420]],L,DL); line([[300,330],[300,420]],L,DL); rect(430,380,30,100,pal.wood,o);
  // nightstand + lamp
  rect(490,330,110,90,pal.wood,o); line([[490,375],[600,375]],L,DL); circ(545,352,5,L,{lw:0}); circ(545,398,5,L,{lw:0});
  line([[545,330],[545,270]],L,5); poly([[510,270],[580,270],[565,225],[525,225]],pal.lamp,o);
  // sock, remote, spider
  shape(()=>{g.moveTo(230,470);g.lineTo(260,470);g.lineTo(262,492);g.lineTo(300,494);g.quadraticCurveTo(310,508,296,512);g.lineTo(236,510);g.closePath();},pal.sock,od);
  rrect(640,470,90,26,8,pal.remote,od); for(let i=0;i<4;i++) circ(660+i*18,483,4,L,{lw:0});
  line([[110,0],[110,70]],L,2); circ(110,78,9,L,{lw:0}); for(const s of [-1,1]) for(let i=0;i<3;i++) line([[110,74+i*5],[110+s*20,66+i*9]],L,2);
  g.restore(); rect(0,0,800,520,null,{lw:8});
  g.restore();
}
SCENES.s3 = { dur:1, setup(){}, draw(){
  label('Power 1  ·  Night vision',124,118);
  const dark={line:C2.nightL,wall:C2.night,floor:'#171B2A',glass:'#232A40',moon:'#3A4260',curtain:'#20263A',wood:'#20263A',blanket:'#212739',pillow:'#232A3E',lamp:'#252C42',sock:'#1F2436',remote:'#1E2334'};
  const cv={line:C.ink,wall:C2.cv1,floor:C2.cv2,glass:'#DDE8E2',moon:'#F6F8EE',curtain:C2.cv3,wood:C2.cv3,blanket:C2.cv2,pillow:'#E4ECE7',lamp:'#E4ECE7',sock:C2.cv3,remote:C2.cv3};
  bedroom(124,160,800,520,dark); bedroom(996,160,800,520,cv);
  // the found remote, circled in the power colour
  g.save(); g.strokeStyle=C.ginger; g.lineWidth=6; g.beginPath(); g.ellipse(996+685,160+483,70,34,-.08,0,Math.PI*2); g.stroke(); g.restore();
  text('found it!',1796,722,{size:26,w:600,col:C.ginger,align:'right'});
  label('You, before',124,722); label('You, now',996,722);
  g.save(); g.font='500 44px Jost'; const w1=g.measureText('Cats see in light about ').width; g.font='600 44px Jost'; const w2=g.measureText('6× dimmer ').width; g.restore();
  text('Cats see in light about',124,800,{size:44,w:500}); text('6× dimmer',124+w1,800,{size:44,w:600,col:C.ginger}); text('than you need.',124+w1+w2,800,{size:44,w:500});
  subtitle('Great news: you can find the TV remote at 3 a.m.');
}};

// ---------------- S4: always land on your feet ----------------
SCENES.s4 = { dur:1, setup(){}, draw(){
  const gy=880;
  // half-painted wall
  rect(124,150,1672,730,C.wall,{lw:0});
  rect(124,150,640,260,C2.paint,{lw:0}); for(const [x,l] of [[200,40],[330,70],[470,30],[600,56],[730,44]]){ line([[x,405],[x,405+l]],C2.paint,12); circ(x,411+l,9,C2.paint,{lw:0}); }
  // A-frame ladder
  const top=[560,300];
  for(const [a,b] of [[[470,gy],top],[[650,gy],top]]){ line([a,b],C.ink,14); line([a,b],C2.woodL,7); }
  for(let i=1;i<6;i++){ const t=i/6, y=gy+(top[1]-gy)*t, xl=470+(560-470)*t, xr=650+(560-650)*t; line([[xl,y],[xr,y]],C.ink,6); }
  rect(520,286,80,18,C2.wood,{lw:4});
  // falling bucket + splash
  withRot(700,520,.9,()=>{ poly([[670,500],[730,500],[722,560],[678,560]],C2.chrome); rect(668,494,64,10,C2.chrome,{lw:4}); });
  shape(()=>{g.moveTo(690,470);g.quadraticCurveTo(650,420,610,430);g.quadraticCurveTo(660,460,682,500);},C2.paint,{lw:DL});
  shape(()=>{g.ellipse(720,gy-6,110,16,0,0,Math.PI*2);},C2.paint,{lw:DL});
  for(const [x,y] of [[600,gy-40],[840,gy-34],[860,gy-70]]) circ(x,y,9,C2.paint,{lw:DL});
  ground(gy,124,1796);
  // three moments of the fall, ghosted
  const S=330;
  const sp=pose({la:-1.9,lb:.15,ra:1.9,rb:-.15,lfx:-.03,rfx:.03});
  alpha(.4,()=>withRot(860,310,Math.PI,()=>catman({x:860,gy:310+S*.5,S},sp,{tail:0})));
  alpha(.6,()=>withRot(940,500,Math.PI*.5,()=>catman({x:940,gy:500+S*.5,S},sp,{tail:0})));
  catman({x:1160,gy,S},pose({hy:.02,lean:-.04,la:-1.1,lb:-.3,ra:1.1,rb:.3,lfx:-.04,rfx:.04}));
  g.save();g.strokeStyle=C.ginger;g.lineWidth=6;g.setLineDash([2,16]);g.lineCap='round';g.beginPath();g.moveTo(950,150);g.bezierCurveTo(1140,170,1200,340,1180,560);g.stroke();g.restore();
  arrowHead(1180,560,Math.atan2(140,-10),16,C.ginger,6);
  text('ta-da!',1250,720,{size:34,w:600,col:C.ginger});
  label('Power 2  ·  The landing',1300,190);
  text('Cats can twist',1296,290,{size:56,w:500});
  text('feet-first',1296,380,{size:84,w:600,col:C.ginger,track:-2});
  text('in a fall of',1296,460,{size:56,w:500});
  text('just 30 cm.',1296,530,{size:56,w:600});
  subtitle('The paint bucket did not get this power.');
}};

// ---------------- S5: the jump (detailed) ----------------
SCENES.s5 = { dur:1, setup(){}, draw(){
  const gy=880, ppm=68;
  line([[170,gy],[170,gy-10.3*ppm]],C.ink,4);
  for(let m=0;m<=10;m+=.5){ const y=gy-m*ppm, big=m%2===0; line([[170,y],[170+(big?26:14),y]],C.ink,3); if(big) text(m+' m',124,y+8,{size:22,w:500,col:C.mute,align:'right'}); }
  fence(930,1130,gy,90);
  tree(1010,gy,370);
  const hx0=470,hx1=900, wallTop=gy-6.8*ppm, peak=gy-9*ppm;
  houseD(hx0,hx1,gy,wallTop,peak);
  tufts(200,1140,gy);
  const S=1.8*ppm, top=[(hx0+hx1)/2,peak];
  g.save();g.strokeStyle=C.ginger;g.lineWidth=6;g.setLineDash([2,16]);g.lineCap='round';g.beginPath();g.moveTo(300,gy-10);g.bezierCurveTo(300,gy-420,560,peak-200,top[0]-10,peak-6);g.stroke();g.restore();
  arrowHead(top[0]-10,peak-6,Math.atan2(194,top[0]-570),16,C.ginger,6);
  catman({x:top[0],gy:peak+4,S},pose({la:-2.45,lb:.35,ra:2.45,rb:-.35,head:-.05,lfx:-.05,rfx:.05}));
  figure({x:300,gy,S},pose({la:-.6,lb:.3,ra:.6,rb:-.3,head:-.35}));
  g.save();g.strokeStyle=C.mute;g.lineWidth=4;g.setLineDash([2,12]);g.lineCap='round';g.beginPath();g.moveTo(262,gy-S-14);g.quadraticCurveTo(300,gy-S-14-2*.5*ppm,338,gy-S-14);g.stroke();g.restore();
  text('you, before:',342,gy-96,{size:22,w:500,col:C.mute}); text('a 0.5 m hop',342,gy-66,{size:22,w:500,col:C.mute});
  ground(gy,124,1796);
  label('Power 3  ·  The jump',1240,190);
  text('Cats jump up to',1236,290,{size:52,w:500});
  text('5×',1230,450,{size:170,w:600,col:C.ginger,track:-4});
  text('their own height.',1236,530,{size:52,w:500});
  text('1.8 m × 5 = 9 m',1236,640,{size:60,w:600});
  text('Your neighbours have questions.',1238,700,{size:30,w:400,col:C.mute});
  subtitle('So you could hop onto a two-storey roof. From standing.');
}};

// ---------------- S6: things on edges ----------------
SCENES.s6 = { dur:1, setup(){}, draw(){
  label('Side effect 1',124,118);
  text('Things on edges',116,226,{size:96,w:600,track:-2});
  text('must fall.',116,326,{size:96,w:600,track:-2,col:C.red});
  const gy=880, dt=620;
  // window with city behind
  rect(140,420,330,300,C.sky); for(const [x,w,h] of [[160,60,150],[230,80,210],[320,50,120],[380,70,180]]){ rect(x,720-h,w,h,C2.cityL,{lw:DL}); for(let yy=720-h+16;yy<700;yy+=30) for(let xx=x+10;xx<x+w-14;xx+=22) rect(xx,yy,10,14,C.winY,{lw:0}); }
  rect(140,420,330,300,null); dline([[305,420],[305,720]]); rect(126,720,358,14,C2.white,{lw:4});
  ground(gy,124,1796);
  // Catman behind the desk, one finger out
  catman({x:1300,gy,S:440},pose({ra:1.62,rb:.02,la:-.4,lb:.25,head:.12,lean:.02}));
  // desk
  rect(600,dt,920,32,C2.woodL); rect(630,dt+32,30,gy-dt-32,C2.wood); rect(1470,dt+32,30,gy-dt-32,C2.wood);
  rect(1150,dt+32,300,170,C2.woodL); dline([[1150,dt+90],[1450,dt+90]]); dline([[1150,dt+148],[1450,dt+148]]);
  for(const y of [dt+62,dt+120,dt+176]) rrect(1270,y-5,60,10,5,C2.chrome,{lw:DL});
  // monitor
  rect(700,dt-250,330,210,C.ink,{lw:0}); rect(714,dt-236,302,182,C.screen,{lw:0});
  for(let r=0;r<6;r++) for(let c=0;c<4;c++) rect(724+c*72,dt-226+r*28,66,22,r===0?C.sky:C2.white,{lw:2});
  poly([[845,dt-40],[885,dt-40],[900,dt],[830,dt]],C2.chrome);
  // keyboard, mouse, papers, plant
  rrect(760,dt-22,230,18,4,C2.white,{lw:4}); for(let i=0;i<10;i++) dline([[772+i*21,dt-14],[784+i*21,dt-14]]);
  rrect(1010,dt-18,34,16,8,C2.white,{lw:4});
  for(let i=0;i<4;i++) rect(1060+i*3,dt-12-i*8,110,8,C2.white,{lw:DL});
  poly([[620,dt],[680,dt],[690,dt-60],[610,dt-60]],C2.bowl);
  for(const [a,l] of [[-.5,90],[-.15,110],[.25,100],[.6,80]]) shape(()=>{const x0=650,y0=dt-60,x1=x0+Math.sin(a)*l,y1=y0-Math.cos(a)*l;g.moveTo(x0,y0);g.quadraticCurveTo(x1-24,(y0+y1)/2,x1,y1);g.quadraticCurveTo(x1+24,(y0+y1)/2,x0,y0);},C2.leaf,{lw:4});
  // the mug, mid-fall
  withRot(1585,720,.7,()=>{ rrect(1550,690,64,74,8,C2.white); g.save();g.strokeStyle=C.ink;g.lineWidth=6;g.beginPath();g.arc(1618,727,18,-Math.PI/2,Math.PI/2);g.stroke();g.restore();
    text('BOSS',1582,736,{size:16,w:600,align:'center',track:1}); });
  for(const [x,y,r] of [[1530,660,9],[1555,640,7],[1600,650,6]]) circ(x,y,r,C2.coffee,{lw:2});
  for(const [x0,y0] of [[1512,612],[1520,640]]) dline([[x0,y0],[x0+40,y0+20]],C.mute);
  // the boss
  figure({x:1730,gy,S:420},pose({la:-2.5,lb:-.2,ra:2.5,rb:.2,head:-.1,lean:-.05}));
  text('NOOO',1650,450,{size:52,w:600,col:C.red,track:2});
  subtitle('You don’t know why you did it. You would do it again.');
}};

// ---------------- S7: the catch (detailed) ----------------
SCENES.s7 = { dur:1, setup(){}, draw(){
  label('The catch',124,118);
  text('Cats sleep',116,224,{size:96,w:600,track:-2});
  text('16 hours',116,328,{size:96,w:600,track:-2,col:C.red});
  text('a day. So do you now.',122,392,{size:40,w:400,col:C.mute});
  const gy=880;
  // window + sunbeam
  rect(640,430,170,130,C.sky); dline([[725,430],[725,560]]); dline([[640,495],[810,495]]); rect(628,560,194,12,C2.white,{lw:4});
  poly([[650,572],[810,572],[600,gy],[290,gy]],C.sun,{lw:0});
  ground(gy,124,1796);
  const bx=330,bw=300; const bt=box(bx,gy,bw,190);
  peek(bx+bw*.42,bt,330);
  for(const [c,w] of [[C.ink,23],[C.ginger,14]]){ g.save();g.strokeStyle=c;g.lineWidth=w;g.lineCap='round';g.beginPath();g.moveTo(bx+bw-30,bt+2);g.bezierCurveTo(bx+bw+40,bt-40,bx+bw+70,bt+30,bx+bw+110,bt-20);g.stroke();g.restore(); }
  zzz(bx+bw*.42+70,bt-50,.8);
  // TV on legs
  const tx=1000,ty=330,tw=720,th=470;
  line([[tx+120,ty+th],[tx+90,gy]],C.ink,8); line([[tx+tw-120,ty+th],[tx+tw-90,gy]],C.ink,8);
  rrect(tx,ty,tw,th,14,C.ink,{lw:0}); rect(tx+22,ty+22,tw-44,th-60,C.screen,{lw:0});
  for(let i=0;i<3;i++) circ(tx+tw-60+i*-26,ty+th-19,6,C2.chrome,{lw:0});
  g.save(); g.beginPath(); g.rect(tx+22,ty+22,tw-44,th-60); g.clip();
  // studio backdrop: skyline
  for(const [x,w,h] of [[tx+40,80,180],[tx+130,60,240],[tx+200,90,150],[tx+420,70,210],[tx+500,100,160],[tx+610,80,230]]) rect(x,ty+th-150-h,w,h+20,'#B4CFDD',{lw:2,col:'#8FB0C2'});
  rect(tx+22,ty+th-150,tw-44,112,C.red,{lw:0}); rect(tx+22,ty+th-150,170,36,C.ink,{lw:0});
  text('BREAKING',tx+38,ty+th-123,{size:22,w:600,col:C2.white,track:2});
  const A=figure({x:tx+200,gy:ty+th-30,S:330},pose({ra:.75,rb:2.15,la:-.4,lb:.2,head:.1}));
  const hn=A.aR[1]; line([[hn[0],hn[1]+10],[hn[0]+6,hn[1]-30]],C.ink,7); circ(hn[0]+8,hn[1]-42,15,C.ink,{lw:0});
  g.restore();
  text('LIVE',tx+44,ty+72,{size:30,w:600,col:C.red,track:3});
  text('CITY NEEDS MEOW MAN',tx+360,ty+th-90,{size:30,w:600,col:C2.white,track:1});
  text('HE IS IN A BOX',tx+360,ty+th-52,{size:30,w:600,col:C2.white,track:1});
  text('"We have tried shaking',tx+360,ty+110,{size:30,w:500});
  text('a bag of treats."',tx+360,ty+150,{size:30,w:500});
  subtitle('Superhero shifts are 8 hours. You are awake for 8 hours.');
}};

// ---------------- S8: ending ----------------
SCENES.s8 = { dur:1, setup(){}, draw(){
  label('Day 30',124,118);
  text('The city now has',116,226,{size:92,w:600,track:-2});
  text('two Meow Men.',116,326,{size:92,w:600,track:-2,col:C.ginger});
  text('Both asleep.',122,392,{size:40,w:400,col:C.mute});
  const gy=880;
  ground(gy,124,1796);
  const b1=box(700,gy,300,190); peek(700+130,b1,330,{tilt:.25});
  const b3=box(1460,gy,300,190,{label:false}); peek(1460+150,b3,330,{tilt:-.22});
  const b2=box(1110,gy,240,300,{label:false});
  cat(1230,b2,250,{d:-1,mood:'calm'});
  zzz(860,b1-120,.8); zzz(1640,b3-120,.8);
  label('You',760,b1-210); label('Your boss',1500,b3-210);
  line([[790,b1-200],[810,b1-130]],C.mute,3); line([[1560,b3-200],[1590,b3-130]],C.mute,3);
  text('(the cat is fine)',1230,b2-290,{size:28,w:500,col:C.mute,align:'center'});
  subtitle('Next time: what if a dog licked you?');
}};

