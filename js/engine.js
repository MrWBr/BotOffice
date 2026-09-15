// ============================================================
// engine.js — Canvas, coordenadas isométricas, render loop, objetos 3D, crachá e RH
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

// ============================================================
// PRIMITIVAS DE DESENHO ISOMÉTRICO 3D
// ============================================================

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

function dDoor(tx, label, color, active){
  var p = t2s(tx, 0);
  C.fillStyle = active ? color : '#475569';
  C.fillRect(p.x - 12, p.y - CFG.WALL_H + 15, 24, 38);
  C.strokeStyle = '#1e293b'; C.strokeRect(p.x - 12, p.y - CFG.WALL_H + 15, 24, 38);
  C.fillStyle = '#ffffff';
  C.font = 'bold 9px sans-serif';
  C.textAlign = 'center';
  C.fillText(label, p.x, p.y - CFG.WALL_H + 10);
}

function dWScr(tx, ty, h, type){
  var p = t2s(tx, ty);
  C.fillStyle = '#0f172a';
  C.fillRect(p.x - 14, p.y - h + 15, 28, 18);
  C.strokeStyle = '#38bdf8'; C.strokeRect(p.x - 14, p.y - h + 15, 28, 18);
}

function dDesk(tx, ty){
  var p = t2s(tx, ty);
  dBox(p.x, p.y + 10, 1.5, 1.2, 14, CFG.PAL.dT, CFG.PAL.dF, CFG.PAL.dS);
}

function dMon(tx, ty, txt, active){
  var p = t2s(tx, ty);
  C.fillStyle = '#333333';
  C.fillRect(p.x - 1, p.y - 8, 2, 6);
  C.fillStyle = active ? '#0284c7' : '#1e293b';
  C.fillRect(p.x - 10, p.y - 22, 20, 14);
  C.strokeStyle = '#64748b'; C.strokeRect(p.x - 10, p.y - 22, 20, 14);
  if(active){
    C.fillStyle = '#ffffff';
    C.font = '8px monospace';
    C.textAlign = 'center';
    C.fillText(txt, p.x, p.y - 13);
  }
}

function dChair(tx, ty, color){
  var p = t2s(tx, ty);
  dBox(p.x, p.y + 12, 0.8, 0.8, 8, color, shade(color, -0.2), shade(color, -0.4));
  C.fillStyle = color;
  C.fillRect(p.x - 5, p.y - 4, 10, 10);
}

function dPapers(tx, ty, count){
  var p = t2s(tx, ty);
  for(var i = 0; i < Math.min(count, 5); i++){
    C.fillStyle = '#f8fafc';
    C.fillRect(p.x - 6 + i, p.y - 6 - i*2, 10, 7);
    C.strokeStyle = '#cbd5e1'; C.strokeRect(p.x - 6 + i, p.y - 6 - i*2, 10, 7);
  }
}

function dMailbox(tx, ty, count, flag){
  var p = t2s(tx, ty);
  dBox(p.x, p.y + 10, 0.8, 0.8, 12, '#475569', '#334155', '#1e293b');
  if(flag){
    C.fillStyle = '#ef4444';
    C.fillRect(p.x + 3, p.y - 6, 4, 8);
  }
}

function dPlant(tx, ty){
  var p = t2s(tx, ty);
  dBox(p.x, p.y + 10, 0.6, 0.6, 10, '#b45309', '#78350f', '#451a03');
  C.fillStyle = '#15803d';
  C.beginPath();
  C.arc(p.x, p.y - 4, 9, 0, Math.PI * 2);
  C.fill();
}

function tickWalk(bot){
  if(bot.hx === undefined) return;
  var dx = bot.hx - bot.tx;
  var dy = bot.hy - bot.ty;
  var dist = Math.hypot(dx, dy);
  if(dist > 0.05){
    bot.tx += (dx / dist) * 0.05;
    bot.ty += (dy / dist) * 0.05;
  } else {
    bot.tx = bot.hx;
    bot.ty = bot.hy;
  }
}

function dChar(tx, ty, bot){
  if(bot.hidden) return;
  var p = t2s(tx, ty);
  var cx = p.x;
  var cy = p.y;

  // Sombra Isométrica
  C.fillStyle = 'rgba(0,0,0,0.2)';
  C.beginPath();
  C.ellipse(cx, cy + 2, 10, 5, 0, 0, Math.PI * 2);
  C.fill();

  // Corpo 3D (Prisma Isométrico)
  dBox(cx, cy, 0.6, 0.6, 18, bot.color, shade(bot.color, -0.2), shade(bot.color, -0.4));

  // Cabeça
  C.fillStyle = CFG.PAL.sk;
  C.beginPath();
  C.arc(cx, cy - 22, 7, 0, Math.PI * 2);
  C.fill();

  // Cabelo
  C.fillStyle = bot.hair || '#2a2a3a';
  C.beginPath();
  C.arc(cx, cy - 25, 7, Math.PI, Math.PI * 2);
  C.fill();

  // Emoji / Rosto
  C.font = '10px sans-serif';
  C.textAlign = 'center';
  C.fillText(bot.emoji || '🤖', cx, cy - 30);

  // Balão de fala
  if(bot.bub && bot.bubT > 0){
    bot.bubT--;
    C.font = '10px sans-serif';
    var bw = C.measureText(bot.bub).width + 12;
    var bh = 18;
    var bx = cx - bw / 2;
    var by = cy - 52;

    C.fillStyle = 'rgba(255, 255, 255, 0.95)';
    C.fillRect(bx, by, bw, bh);
    C.strokeStyle = '#334155'; C.lineWidth = 1;
    C.strokeRect(bx, by, bw, bh);

    C.fillStyle = '#0f172a';
    C.fillText(bot.bub, cx, by + 12);
  }
}

// ============================================================
// REGRAS DE RH, CARREIRA E HOVER DO CRACHÁ
// ============================================================

var TABELA_CARREIRA = [
  { limite: 5,   nivel: 'Jr 1' },
  { limite: 15,  nivel: 'Jr 2' },
  { limite: 30,  nivel: 'Pl 1' },
  { limite: 50,  nivel: 'Pl 2' },
  { limite: 80,  nivel: 'Sr 1' },
  { limite: 999, nivel: 'Sr 2 / Especialista' }
];

function avaliarProgressoCarreira(bot) {
  if (bot.personality === 'supervisor') return;
  var acertos = bot.acertos || 0;
  var nivelAtual = bot.personality;

  for (var i = 0; i < TABELA_CARREIRA.length; i++) {
    if (acertos <= TABELA_CARREIRA[i].limite) {
      if (nivelAtual !== TABELA_CARREIRA[i].nivel) {
        bot.personality = TABELA_CARREIRA[i].nivel;
        bot.bub = 'Promovido! 🚀';
        bot.bubT = 150;
        if (typeof addLog === 'function') {
          addLog(bot.name, '📈 Subiu de nível para ' + bot.personality + '!', 'ok');
        }
      }
      break;
    }
  }
}

function avaliarDemissaoPorErros(bot, index) {
  if (bot.personality === 'supervisor') return;
  var erros = bot.erros || 0;
  var acertos = bot.acertos || 0;

  if (erros >= 5 && erros > acertos) {
    if (typeof addLog === 'function') {
      addLog(bot.name, '❌ DEMITIDO por excesso de falhas no VBA (' + erros + ' erros).', 'err');
    }

    if (typeof window.removerBotFrota === 'function') {
      window.removerBotFrota(bot.id);
    }

    var posX = (index % 4) * 2 + 1;
    var posY = index < 4 ? 2 : 5;

    BOTS[index] = {
      id: 'bot_repot_' + Date.now(),
      name: 'Substituto (Novo)',
      emoji: '🤖',
      color: '#38bdf8',
      tx: posX, ty: posY, hx: posX, hy: posY,
      state: 'idle', bub: 'Novo na área!', bubT: 120,
      personality: 'diligente',
      tempoCasa: '1 dia',
      acertos: 0,
      erros: 0,
      _fadiga: 0,
      _emPausa: false,
      macros: ['Ordens PM'],
      currentMacro: 'Ordens PM'
    };

    if (window._BOT_SCHED && window._BOT_SCHED[bot.id]) {
      delete window._BOT_SCHED[bot.id];
    }
  }
}

(function HookRetornoVBA() {
  var origVBA = window.receberRetornoVBA;
  window.receberRetornoVBA = function(botId, sucesso, mensagem) {
    if (typeof origVBA === 'function') {
      origVBA(botId, sucesso, mensagem);
    }
    var idx = BOTS.findIndex(function(b) { return b.id === botId; });
    if (idx !== -1) {
      avaliarProgressoCarreira(BOTS[idx]);
      avaliarDemissaoPorErros(BOTS[idx], idx);
    }
  };
})();

function getBotHumor(bot) {
  if (bot.state === 'error') return '🤬';
  if (bot.state === 'work') return '⚡';
  if (bot._emPausa || (bot.bub && bot.bub.indexOf('copa') !== -1)) return '☕';

  var acertos = bot.acertos || 0;
  if (acertos > 15) return '🔥';
  if (acertos > 5) return '😊';
  return '😎';
}

function initBotHoverIsometric() {
  var cracha = document.getElementById('bot-cracha');
  if (!cracha || !CV) return;

  CV.addEventListener('mousemove', function(e) {
    var rect = CV.getBoundingClientRect();
    var canvasX = (e.clientX - rect.left) / CFG.SCALE;
    var canvasY = (e.clientY - rect.top) / CFG.SCALE;

    var botEncontrado = null;
    var menorDistancia = 50; 

    BOTS.forEach(function(bot) {
      if (bot.hidden) return;
      var pos = t2s(bot.tx, bot.ty);
      var charX = pos.x;
      var charY = pos.y - 10;

      var dist = Math.hypot(canvasX - charX, canvasY - charY);
      if (dist < menorDistancia) {
        menorDistancia = dist;
        botEncontrado = bot;
      }
    });

    if (botEncontrado) {
      var humor = getBotHumor(botEncontrado);
      var acertos = botEncontrado.acertos || 0;
      var erros = botEncontrado.erros || 0;
      var nivel = botEncontrado.personality || 'Jr 1';
      var tempo = botEncontrado.tempoCasa || '1 mês';

      cracha.innerHTML =
        '<div class="cracha-header">' +
          '<span class="cracha-nome">' + (botEncontrado.emoji || '🤖') + ' ' + botEncontrado.name + '</span>' +
          '<span class="cracha-humor">' + humor + '</span>' +
        '</div>' +
        '<div class="cracha-row"><span>Perfil:</span> <span class="cracha-val">' + nivel + '</span></div>' +
        '<div class="cracha-row"><span>Tempo de Casa:</span> <span class="cracha-val">' + tempo + '</span></div>' +
        '<div class="cracha-row"><span>Acertos:</span> <span class="cracha-val" style="color:#4ade80;">' + acertos + '</span></div>' +
        '<div class="cracha-row"><span>Falhas:</span> <span class="cracha-val" style="color:#f87171;">' + erros + '</span></div>' +
        '<div class="cracha-row"><span>Status:</span> <span class="cracha-val">' + botEncontrado.state.toUpperCase() + '</span></div>';

      cracha.style.display = 'block';
      cracha.style.left = (e.pageX + 15) + 'px';
      cracha.style.top = (e.pageY + 15) + 'px';
    } else {
      cracha.style.display = 'none';
    }
  });

  CV.addEventListener('mouseleave', function() {
    cracha.style.display = 'none';
  });
}

window.addEventListener('DOMContentLoaded', function() {
  initBotHoverIsometric();
});

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