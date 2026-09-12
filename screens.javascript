
// ============================================================
// screens.js — Telas isométricas na parede norte
// ============================================================

function dWScr(tx, ty, wH, type){
  var p0 = t2s(tx, ty), p1 = t2s(tx + 1.3, ty);
  var sw = p1.x - p0.x, sh = 30, dx = p1.y - p0.y;
  var sx = p0.x, sy = p0.y - wH + 14;

  // Frame
  C.fillStyle = '#0a0a0a';
  C.beginPath();
  C.moveTo(sx-2, sy-2); C.lineTo(sx+sw+2, sy+dx-2);
  C.lineTo(sx+sw+2, sy+dx+sh+2); C.lineTo(sx-2, sy+sh+2);
  C.closePath(); C.fill();

  // Screen bg
  var bgs = {ord:'#0a2a1a', perf:'#0a1a2a', stat:'#1a0a2a', etq:'#1a1a0a'};
  C.fillStyle = bgs[type];
  C.beginPath();
  C.moveTo(sx, sy); C.lineTo(sx+sw, sy+dx);
  C.lineTo(sx+sw, sy+dx+sh); C.lineTo(sx, sy+sh);
  C.closePath(); C.fill();

  // Content
  if(type === 'ord') drawScreenOrdens(sx, sy, sw, sh, dx);
  else if(type === 'perf') drawScreenPerf(sx, sy, sw, sh, dx);
  else if(type === 'stat') drawScreenStatus(sx, sy, sw, sh, dx);
  else if(type === 'etq') drawScreenEtq(sx, sy, sw, sh, dx);

  // Glow
  var gcs = {ord:'rgba(78,204,163,.04)', perf:'rgba(69,183,209,.04)',
             stat:'rgba(167,139,250,.04)', etq:'rgba(240,192,64,.04)'};
  C.fillStyle = gcs[type];
  C.beginPath();
  C.moveTo(sx, sy+sh+4); C.lineTo(sx+sw, sy+dx+sh+4);
  C.lineTo(sx+sw, sy+dx+sh+12); C.lineTo(sx, sy+sh+12);
  C.closePath(); C.fill();

  // Label
  var labels = {ord:'ORDENS', perf:'PERFORMANCE', stat:'STATUS BOTS', etq:'ETIQUETAS'};
  C.fillStyle = '#8aa4cc'; C.font = 'bold 5px monospace'; C.textAlign = 'center';
  C.fillText(labels[type], (sx + sx + sw) / 2, sy + sh + dx/2 + 8);
}

function drawScreenOrdens(sx, sy, sw, sh, dx){
  [.6,.8,.4,.9,.5,.7,.3,.65,.5].forEach(function(v, j){
    var bh = v * (sh - 6);
    C.fillStyle = v > .7 ? '#4ecca3' : v > .5 ? '#f0c040' : '#e94560';
    C.fillRect(sx + 3 + j*(sw/10), sy + sh - 3 - bh + dx*(j/9), Math.max(2, sw/13), bh);
  });
}

function drawScreenPerf(sx, sy, sw, sh, dx){
  var f = STATE.frame;
  C.strokeStyle = '#45b7d1'; C.lineWidth = 1.5; C.beginPath();
  for(var j=0; j<10; j++){
    var lx = sx + 3 + j*(sw/10.5);
    var ly = sy + 4 + Math.sin(f*.02 + j)*6 + sh/3 + dx*(j/10);
    j === 0 ? C.moveTo(lx, ly) : C.lineTo(lx, ly);
  }
  C.stroke();
  C.strokeStyle = '#e9456080'; C.beginPath();
  for(var j=0; j<10; j++){
    var lx = sx + 3 + j*(sw/10.5);
    var ly = sy + 8 + Math.cos(f*.03 + j)*5 + sh/3 + dx*(j/10);
    j === 0 ? C.moveTo(lx, ly) : C.lineTo(lx, ly);
  }
  C.stroke();
}

function drawScreenStatus(sx, sy, sw, sh, dx){
  BOTS.forEach(function(b, j){
    if(j >= 8) return;
    var gx = sx + 4 + (j%4)*(sw/4.5);
    var gy = sy + 5 + Math.floor(j/4)*12 + dx*((j%4)/4);
    var sc = b.state==='work' ? '#4ecca3' :
             b.state==='error' ? '#e94560' :
             b.state==='sleep' ? '#505070' : '#f0c040';
    C.fillStyle = sc;
    C.beginPath(); C.arc(gx+3, gy+3, 3, 0, Math.PI*2); C.fill();
    C.fillStyle = '#555'; C.fillRect(gx-1, gy+8, 9, 2);
  });
}

function drawScreenEtq(sx, sy, sw, sh, dx){
  var bd = STATE.board;
  var cx2 = sx + sw*.35, cy2 = sy + sh*.5 + dx*.35, r = 10;
  var sl = [{v:bd.a||3,c:'#e74c3c'},{v:bd.v||5,c:'#f39c12'},{v:bd.o||20,c:'#27ae60'}];
  var tot = 0; sl.forEach(function(s){ tot += s.v });
  var ang = -Math.PI / 2;
  sl.forEach(function(s){
    var swp = s.v / tot * Math.PI * 2;
    C.beginPath(); C.moveTo(cx2, cy2); C.arc(cx2, cy2, r, ang, ang + swp);
    C.closePath(); C.fillStyle = s.c; C.fill();
    C.strokeStyle = 'rgba(255,255,255,.3)'; C.lineWidth = .5; C.stroke();
    ang += swp;
  });
  C.font = '4px Arial'; C.textAlign = 'left';
  [['A:'+bd.a,'#e74c3c'],['V:'+bd.v,'#f39c12'],['OK:'+bd.o,'#27ae60']].forEach(function(l, i){
    C.fillStyle = l[1]; C.fillRect(sx + sw*.65, sy + 6 + i*7 + dx*.5, 4, 4);
    C.fillStyle = '#aaa'; C.fillText(l[0], sx + sw*.65 + 5, sy + 9 + i*7 + dx*.5);
  });
}

