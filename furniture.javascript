
// ============================================================
// furniture.js — Móveis, objetos e portas
// ============================================================

function dDesk(tx,ty){
  var p=t2s(tx+.5,ty+.5);
  dBox(p.x,p.y-2,1.6,.8,14,CFG.PAL.dT,CFG.PAL.dF,CFG.PAL.dS);
  C.fillStyle=CFG.PAL.dS;
  [[tx+.15,ty+.15],[tx+.85,ty+.15],[tx+.15,ty+.85],[tx+.85,ty+.85]].forEach(function(cr){
    var pp=t2s(cr[0],cr[1]);C.fillRect(pp.x-1,pp.y-2,3,14);
  });
}

function dMon(tx,ty,text,on){
  var p=t2s(tx+.5,ty+.5), sx=p.x-10, sy=p.y-38;
  C.fillStyle=CFG.PAL.mFr;
  C.fillRect(p.x-2,sy+22,4,8);
  C.fillRect(p.x-6,sy+28,12,3);
  C.fillRect(sx-2,sy-2,24,20);
  C.fillStyle=on?CFG.PAL.mOn:CFG.PAL.mSc;
  C.fillRect(sx,sy,20,16);
  if(on){C.fillStyle='rgba(78,204,163,.1)';C.fillRect(sx-4,sy+16,28,6)}
  if(text){C.fillStyle='#4ecca3';C.font='bold 6px monospace';C.textAlign='center';C.fillText(text,p.x,sy+10)}
}

function dChair(tx,ty,cl){
  var p=t2s(tx+.5,ty+.5);
  dBox(p.x,p.y+4,.6,.6,8,cl,shade(cl,-.15),shade(cl,-.25));
  C.fillStyle=shade(cl,-.1);C.fillRect(p.x-7,p.y-8,4,16);
  C.fillStyle=cl;C.fillRect(p.x-6,p.y-7,3,14);
}

function dPapers(tx,ty,cnt){
  var p=t2s(tx+.5,ty+.5), mx=Math.min(cnt,15);
  for(var i=0;i<mx;i++){
    var ox=(Math.sin(i*2.7)*3)|0;
    C.save();C.translate(p.x+ox,p.y-4-i*2);
    C.rotate((Math.sin(i*1.3)*4)*Math.PI/180);
    C.fillStyle=i%3===0?'#e8e2ce':i%3===1?'#f0ead6':'#f5f0dc';
    C.fillRect(-8,-5,16,10);
    C.strokeStyle='#d4c9a8';C.lineWidth=.5;C.strokeRect(-8,-5,16,10);
    C.fillStyle='#c0b898';
    for(var l=0;l<3;l++) C.fillRect(-5,-3+l*3,10,1);
    C.restore();
  }
  if(cnt>0){
    C.fillStyle='rgba(0,0,0,.5)';C.font='bold 7px Arial';C.textAlign='center';
    C.fillText(cnt+' WO',p.x,p.y-6-mx*2);
  }
}

function dPlant(tx,ty){
  var p=t2s(tx+.5,ty+.5);
  dBox(p.x,p.y+2,.4,.4,8,'#8B4513','#6B3410','#5a2a08');
  [[0,-14,8],[6,-18,7],[-5,-16,7],[3,-22,6],[-3,-20,6]].forEach(function(l){
    C.beginPath();
    C.ellipse(p.x+l[0],p.y+l[1],l[2],l[2]/2,l[0]*.1,0,Math.PI*2);
    C.fillStyle=l[1]<-18?'#2ecc71':'#27ae60';C.fill();
  });
}

// Blue Mailbox (Correios BR)
function dMailbox(tx,ty,cnt,flg){
  var p=t2s(tx+.5,ty+.5);
  C.fillStyle='#555';C.fillRect(p.x-2,p.y-6,4,20);
  dBox(p.x,p.y-10,.7,.5,14,'#2a6aaa','#1a4a8a','#0a3a7a');
  C.fillStyle='#3a7aba';C.beginPath();C.arc(p.x,p.y-24,8,Math.PI,0);C.fill();
  C.fillStyle='#0a2a5a';C.fillRect(p.x-6,p.y-18,12,3);
  C.fillStyle='#fff';C.font='bold 4px Arial';C.textAlign='center';
  C.fillText('CORREIO',p.x,p.y-13);
  if(flg){
    C.fillStyle='#e74c3c';C.fillRect(p.x+9,p.y-30,3,12);
    C.fillStyle='#ff6b6b';C.fillRect(p.x+12,p.y-30,7,4);
  }
  if(cnt>0){
    C.fillStyle='#e74c3c';C.beginPath();C.arc(p.x+8,p.y-28,6,0,Math.PI*2);C.fill();
    C.fillStyle='#fff';C.font='bold 7px Arial';C.fillText(cnt,p.x+8,p.y-26);
  }
}

// Door (parede norte — face larga)
function dDoor(tx,label,color,occ){
  var wH=CFG.WALL_H;
  var pL=t2s(tx,0), pR=t2s(tx+1.4,0);
  var topL=pL.y-wH+16, topR=pR.y-wH+16;
  var botL=pL.y-8,      botR=pR.y-8;

  // Frame
  C.fillStyle='#3a2a1a';
  C.beginPath();
  C.moveTo(pL.x-2,topL-3);C.lineTo(pR.x+2,topR-3);
  C.lineTo(pR.x+2,botR+3);C.lineTo(pL.x-2,botL+3);
  C.closePath();C.fill();

  // Porta
  C.fillStyle=occ?shade(color,.15):color;
  C.beginPath();
  C.moveTo(pL.x,topL);C.lineTo(pR.x,topR);
  C.lineTo(pR.x,botR);C.lineTo(pL.x,botL);
  C.closePath();C.fill();
  C.strokeStyle='rgba(0,0,0,.2)';C.lineWidth=1;C.stroke();

  // Divisão (porta dupla)
  var midX=(pL.x+pR.x)/2, midTY=(topL+topR)/2, midBY=(botL+botR)/2;
  C.strokeStyle='rgba(0,0,0,.15)';C.lineWidth=1;
  C.beginPath();C.moveTo(midX,midTY);C.lineTo(midX,midBY);C.stroke();

  // Maçanetas
  C.fillStyle='#d4a030';
  var hY=(midTY+midBY)/2+4;
  C.beginPath();C.arc(midX-4,hY,1.8,0,Math.PI*2);C.fill();
  C.beginPath();C.arc(midX+4,hY,1.8,0,Math.PI*2);C.fill();

  // Janelinhas
  C.fillStyle=occ?'rgba(255,255,200,.15)':'rgba(100,150,200,.1)';
  var winH=12;
  C.beginPath();
  C.moveTo(pL.x+4,topL+6);C.lineTo(midX-3,midTY+6);
  C.lineTo(midX-3,midTY+6+winH);C.lineTo(pL.x+4,topL+6+winH);
  C.closePath();C.fill();
  C.beginPath();
  C.moveTo(midX+3,midTY+6);C.lineTo(pR.x-4,topR+6);
  C.lineTo(pR.x-4,topR+6+winH);C.lineTo(midX+3,midTY+6+winH);
  C.closePath();C.fill();

  // Luz por baixo quando ocupado
  if(occ){
    C.fillStyle=color+'20';
    C.beginPath();
    C.moveTo(pL.x,botL);C.lineTo(pR.x,botR);
    C.lineTo(pR.x+6,botR+10);C.lineTo(pL.x+6,botL+10);
    C.closePath();C.fill();
  }

  // Placa
  C.font='bold 6px Arial';C.textAlign='center';
  var lx=(pL.x+pR.x)/2, ly=(topL+topR)/2-6;
  var tw2=C.measureText(label).width;
  C.fillStyle='rgba(0,0,0,.65)';
  C.beginPath();C.roundRect(lx-tw2/2-4,ly-7,tw2+8,11,3);C.fill();
  C.fillStyle=color;C.fillText(label,lx,ly);

  // LED
  C.fillStyle=occ?color:'#444';
  C.beginPath();C.arc(lx+tw2/2+8,ly-2,3,0,Math.PI*2);C.fill();
  if(occ){C.fillStyle=color+'40';C.beginPath();C.arc(lx+tw2/2+8,ly-2,7,0,Math.PI*2);C.fill()}
}

