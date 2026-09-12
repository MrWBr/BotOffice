
// ============================================================
// character.js — Personagem Habbo + balões de fala
// ============================================================

function dChar(tx, ty, o){
  if(o.hidden) return;
  var p = t2s(tx+.5, ty+.5), x = p.x, y = p.y;
  var st = o.state || 'idle', cl = o.color, hr = o.hair || '#2a2a3a';
  var f = STATE.frame, P = CFG.PAL;

  C.save(); C.translate(x, y);

  // Shadow
  C.fillStyle = 'rgba(0,0,0,.25)';
  C.beginPath(); C.ellipse(0, 4, 12, 5, 0, 0, Math.PI*2); C.fill();

  // Legs (animated when walking)
  var lk = st === 'walk' ? Math.sin(f * .15) * 4 : 0;
  C.fillStyle = P.pnt;
  C.fillRect(-5, -2-lk, 5, 14); C.fillRect(1, -2+lk, 5, 14);
  C.fillStyle = P.sho;
  C.fillRect(-6, 10-lk, 7, 4); C.fillRect(0, 10+lk, 7, 4);

  // Body
  C.fillStyle = cl; C.fillRect(-8, -18, 16, 18);
  C.fillStyle = 'rgba(0,0,0,.1)'; C.fillRect(0, -18, 8, 18);

  // Arms
  var aA = st === 'work' ? Math.sin(f * .4) * 4 : 0;
  C.fillStyle = cl; C.fillRect(-12, -16, 5, 14);
  C.fillStyle = P.sk; C.fillRect(-12, -4, 5, 4);
  C.save(); C.translate(8, -16); C.rotate(aA * Math.PI / 180);
  C.fillStyle = cl; C.fillRect(0, 0, 5, 14);
  C.fillStyle = P.sk; C.fillRect(0, 12, 5, 4);
  C.restore();

  // Neck
  C.fillStyle = P.sk; C.fillRect(-3, -22, 6, 5);

  // Head
  C.fillStyle = P.sk;
  C.beginPath(); C.roundRect(-9, -38, 18, 18, 3); C.fill();
  C.fillStyle = P.skD;
  C.beginPath(); C.roundRect(0, -38, 9, 18, [0,3,3,0]); C.fill();

  // Hair
  C.fillStyle = hr;
  C.beginPath(); C.roundRect(-10, -42, 20, 10, 3); C.fill();
  C.fillRect(-10,-38,3,12); C.fillRect(8,-38,3,10);
  C.fillRect(-8,-36,16,4);
  C.fillRect(-11,-38,3,6); C.fillRect(9,-36,3,5);

  // Eyes
  if(st === 'sleep'){
    C.fillStyle = '#111';
    C.fillRect(-6,-30,5,1); C.fillRect(2,-30,5,1);
  } else {
    C.fillStyle = '#fff';
    C.fillRect(-6,-32,5,5); C.fillRect(2,-32,5,5);
    C.fillStyle = '#111';
    C.fillRect(-4,-31,3,3); C.fillRect(4,-31,3,3);
    C.fillStyle = '#fff';
    C.fillRect(-4,-31,1,1); C.fillRect(4,-31,1,1);
  }

  // Mouth
  if(st === 'error'){
    C.fillStyle = '#111';
    C.beginPath(); C.arc(0,-24,2,0,Math.PI*2); C.fill();
  } else if(st === 'happy' || st === 'work'){
    C.fillStyle = 'rgba(0,0,0,.25)';
    C.beginPath(); C.arc(0,-24,3,0,Math.PI); C.fill();
  } else {
    C.fillStyle = 'rgba(0,0,0,.2)'; C.fillRect(-2,-25,5,2);
  }

  // Emoji badge
  C.font = '10px serif'; C.textAlign = 'center';
  C.fillText(o.emoji || '', 0, -6);

  // Name tag
  if(o.name){
    C.font = 'bold 8px Arial'; C.textAlign = 'center';
    var tw = C.measureText(o.name).width;
    C.fillStyle = 'rgba(0,0,0,.65)';
    C.beginPath(); C.roundRect(-tw/2-5, -50, tw+10, 12, 4); C.fill();
    C.fillStyle = '#fff'; C.fillText(o.name, 0, -41);
  }

  // Status LED
  var lc = {idle:'#f0c040',work:'#4ecca3',error:'#e94560',sleep:'#505070',
            cafe:'#d4a574',meet:'#a78bfa',happy:'#4ecca3',walk:'#45b7d1'};
  C.beginPath(); C.arc(10,-38,3,0,Math.PI*2);
  C.fillStyle = lc[st] || '#f0c040'; C.fill();
  C.strokeStyle = 'rgba(0,0,0,.3)'; C.lineWidth = 1; C.stroke();

  // Zzz animation
  if(st === 'sleep'){
    var zO = Math.sin(f * .05) * 6;
    C.fillStyle = 'rgba(255,255,255,.6)';
    C.font = 'bold 10px Arial'; C.fillText('Z', 12, -44-zO);
    C.font = 'bold 7px Arial'; C.fillText('z', 18, -50-zO);
  }

  C.restore();

  // Speech bubble
  if(o.bub && o.bubT > 0){
    o.bubT--;
    C.save();
    C.fillStyle = '#fff'; C.strokeStyle = '#000'; C.lineWidth = 2;
    C.font = 'bold 9px Arial'; C.textAlign = 'center';
    var bw = C.measureText(o.bub).width + 16;
    C.beginPath(); C.roundRect(x-bw/2, y-68, bw, 18, 8); C.fill(); C.stroke();
    C.beginPath();
    C.moveTo(x-4, y-50); C.lineTo(x+4, y-50); C.lineTo(x-2, y-42);
    C.closePath(); C.fillStyle = '#fff'; C.fill(); C.stroke();
    C.fillStyle = '#000'; C.fillText(o.bub, x, y-56);
    C.restore();
  }
}

