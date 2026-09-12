
// ============================================================
// engine.js — Canvas, coordenadas isométricas, render loop
// ============================================================

var CV = document.getElementById('cv');
var C = CV.getContext('2d');
var W, H;

function resizeCanvas(){
  W = window.innerWidth - 200;
  H = window.innerHeight - 34;
  CV.width = W;
  CV.height = H;
  CV.style.top = '34px';
  C.imageSmoothingEnabled = false;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Zoom
function zm(d){
  CFG.SCALE = Math.max(0.6, Math.min(2.5, CFG.SCALE + d));
  document.getElementById('zLbl').textContent = Math.round(CFG.SCALE * 100) + '%';
}

// Coordenadas isométricas
function OX(){ return W / 2 / CFG.SCALE - 60 }
function OY(){ return 50 / CFG.SCALE + 30 }
function t2s(tx, ty){
  return {
    x: OX() + (tx - ty) * CFG.TILE_W / 2,
    y: OY() + (tx + ty) * CFG.TILE_H / 2
  };
}

// Utilitários
function shade(hex, pct){
  var r = parseInt(hex.slice(1,3),16);
  var g = parseInt(hex.slice(3,5),16);
  var b = parseInt(hex.slice(5,7),16);
  r = Math.min(255, Math.max(0, r + r * pct)) | 0;
  g = Math.min(255, Math.max(0, g + g * pct)) | 0;
  b = Math.min(255, Math.max(0, b + b * pct)) | 0;
  return '#' + (r<16?'0':'') + r.toString(16) +
               (g<16?'0':'') + g.toString(16) +
               (b<16?'0':'') + b.toString(16);
}
function rn(n){ return ~~(Math.random() * n) }

// Primitivas
function dTile(tx, ty, cl){
  var p = t2s(tx, ty);
  C.beginPath();
  C.moveTo(p.x, p.y);
  C.lineTo(p.x + CFG.TILE_W/2, p.y + CFG.TILE_H/2);
  C.lineTo(p.x, p.y + CFG.TILE_H);
  C.lineTo(p.x - CFG.TILE_W/2, p.y + CFG.TILE_H/2);
  C.closePath();
  C.fillStyle = cl; C.fill();
  C.strokeStyle = CFG.PAL.fLn; C.lineWidth = 0.6; C.stroke();
}

function dWN(tx, ty, h){
  var p = t2s(tx, ty);
  C.beginPath();
  C.moveTo(p.x, p.y);
  C.lineTo(p.x + CFG.TILE_W/2, p.y + CFG.TILE_H/2);
  C.lineTo(p.x + CFG.TILE_W/2, p.y + CFG.TILE_H/2 - h);
  C.lineTo(p.x, p.y - h);
  C.closePath();
  C.fillStyle = CFG.PAL.wF; C.fill();
  C.strokeStyle = CFG.PAL.wLn; C.lineWidth = 0.6; C.stroke();
}

function dWW(tx, ty, h){
  var p = t2s(tx, ty);
  C.beginPath();
  C.moveTo(p.x, p.y);
  C.lineTo(p.x - CFG.TILE_W/2, p.y + CFG.TILE_H/2);
  C.lineTo(p.x - CFG.TILE_W/2, p.y + CFG.TILE_H/2 - h);
  C.lineTo(p.x, p.y - h);
  C.closePath();
  C.fillStyle = CFG.PAL.wS; C.fill();
  C.strokeStyle = CFG.PAL.wLn; C.lineWidth = 0.6; C.stroke();
}

function dBox(cx, cy, w, d, h, tC, fC, sC){
  var hw = w * CFG.TILE_W / 4, hd = d * CFG.TILE_H / 2;
  C.beginPath();
  C.moveTo(cx, cy-h); C.lineTo(cx+hw, cy+hd/2-h);
  C.lineTo(cx, cy+hd-h); C.lineTo(cx-hw, cy+hd/2-h);
  C.closePath();
  C.fillStyle = tC; C.fill();
  C.strokeStyle = 'rgba(0,0,0,.1)'; C.lineWidth = 0.6; C.stroke();
  C.beginPath();
  C.moveTo(cx, cy+hd-h); C.lineTo(cx+hw, cy+hd/2-h);
  C.lineTo(cx+hw, cy+hd/2); C.lineTo(cx, cy+hd);
  C.closePath();
  C.fillStyle = fC; C.fill(); C.stroke();
  C.beginPath();
  C.moveTo(cx, cy+hd-h); C.lineTo(cx-hw, cy+hd/2-h);
  C.lineTo(cx-hw, cy+hd/2); C.lineTo(cx, cy+hd);
  C.closePath();
  C.fillStyle = sC; C.fill(); C.stroke();
}

// ============================================================
// RENDER LOOP PRINCIPAL
// ============================================================
function render(){
  C.clearRect(0, 0, W, H);
  STATE.frame++;
  C.save();
  C.scale(CFG.SCALE, CFG.SCALE);

  var wH = CFG.WALL_H;
  var P = CFG.PAL;

  // Floor
  for(var y=0; y<CFG.ROWS; y++)
    for(var x=0; x<CFG.COLS; x++)
      dTile(x, y, (x+y)%2===0 ? P.fL : P.fD);

  // Walls
  for(var x=0; x<CFG.COLS; x++) dWN(x, 0, wH);
  for(var y=0; y<CFG.ROWS; y++) dWW(0, y, wH);

  // Wall top
  for(var x=0; x<CFG.COLS; x++){
    var p = t2s(x, 0);
    C.beginPath();
    C.moveTo(p.x, p.y - wH);
    C.lineTo(p.x + CFG.TILE_W/2, p.y + CFG.TILE_H/2 - wH);
    C.lineTo(p.x, p.y + CFG.TILE_H - wH);
    C.lineTo(p.x - CFG.TILE_W/2, p.y + CFG.TILE_H/2 - wH);
    C.closePath();
    C.fillStyle = P.wT; C.fill();
  }

  // Doors
  CFG.DOORS.forEach(function(d){
    var occ = d.type === 'copa' ? STATE.copaOcc : STATE.meetOcc;
    dDoor(d.tx, d.label, d.color, occ.length > 0);
  });

  // Wall screens
  CFG.SCREENS.forEach(function(s){
    dWScr(s.tx, 0, wH, s.type);
  });

  // Furniture row 1
  for(var i=0; i<4; i++){
    dDesk(1+i*2, 1);
    dMon(1+i*2, 1, BOTS[i].state==='work'?'RUN':'IDLE', BOTS[i].state==='work');
    dChair(1+i*2, 2, BOTS[i].color);
  }
  // Furniture row 2
  for(var i=0; i<4; i++){
    dDesk(1+i*2, 4);
    dMon(1+i*2, 4, BOTS[i+4].state==='work'?'RUN':'IDLE', BOTS[i+4].state==='work');
    dChair(1+i*2, 5, BOTS[i+4].color);
  }

  // Paper + Mail
  dDesk(10, 4); dPapers(10, 4, STATE.paperCount);
  dMailbox(10, 6, STATE.mailCount, STATE.mailFlag);

  // Plants
  dPlant(0.2, 0.5); dPlant(0.2, 7); dPlant(11, 7);

  // Characters (depth sorted)
  BOTS.slice().sort(function(a,b){
    return (a.tx + a.ty) - (b.tx + b.ty);
  }).forEach(function(bot){
    tickWalk(bot);
    dChar(bot.tx, bot.ty, bot);
  });

  C.restore();
  requestAnimationFrame(render);
}

