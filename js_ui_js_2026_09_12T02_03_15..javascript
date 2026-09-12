
// ============================================================
// ui.js — Interface: topbar, pills, relógio, config, log
// ============================================================

function updP(){
  var a=0, i=0, e=0;
  BOTS.forEach(function(b, idx){
    if(idx >= 8) return;
    if(b.state === 'work') a++;
    else if(b.state === 'error') e++;
    else i++;
  });
  document.getElementById('st-a').textContent = '● ' + a + ' ativos';
  document.getElementById('st-i').textContent = '● ' + i + ' ociosos';
  document.getElementById('st-e').textContent = '● ' + e + ' erros';
}

function updClk(){
  document.getElementById('clk').textContent =
    new Date().toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'});
}

function addLog(src, msg, tp){
  var el = document.getElementById('logP');
  var t = new Date().toLocaleTimeString('pt-BR', {hour:'2-digit',minute:'2-digit',second:'2-digit'});
  var d = document.createElement('div');
  d.className = 'pe ' + (tp || '');
  var cl = tp==='ok' ? '#4ecca3' : tp==='err' ? '#e94560' : '#f0c040';
  d.innerHTML = '<span class="pt">' + t + '</span>' +
                '<span class="ps" style="color:' + cl + '">' + src + '</span> ' + msg;
  el.insertBefore(d, el.firstChild);
  while(el.children.length > 50) el.removeChild(el.lastChild);
}

function openCfg(){
  document.getElementById('cfgM').classList.add('vis');
  var l = document.getElementById('cfgL');
  l.innerHTML = '';
  BOTS.forEach(function(b, i){
    if(i >= 8) return;
    var r = document.createElement('div');
    r.className = 'row';
    r.innerHTML =
      '<span class="bot-em">' + b.emoji + '</span>' +
      '<span class="bot-nm" style="color:' + b.color + '">' + b.name + '</span>' +
      '<select onchange="BOTS[' + i + '].state=this.value">' +
        '<option value="idle"'  + (b.state==='idle'  ? ' selected':'') + '>Idle</option>' +
        '<option value="work"'  + (b.state==='work'  ? ' selected':'') + '>Work</option>' +
        '<option value="sleep"' + (b.state==='sleep' ? ' selected':'') + '>Sleep</option>' +
      '</select>';
    l.appendChild(r);
  });
}

function closeCfg(){
  document.getElementById('cfgM').classList.remove('vis');
}

// ============================================================
// INIT — Timers e start
// ============================================================
function initOffice(){
  render();
  setInterval(sim, 1500);
  setInterval(updP, 1000);
  setInterval(updClk, 1000);
  updClk();

  // Random log entries
  setInterval(function(){
    if(!STATE.running) return;
    var b = BOTS[rn(8)];
    var ms = [
      ['▶ ' + b.emoji + ' Executando', 'ok'],
      ['✅ Concluído!', 'ok'],
      ['☕ Café...', 'soc'],
      ['🤔 Pensando...', 'soc'],
      ['❌ Timeout SAP', 'err']
    ];
    var m = ms[rn(ms.length)];
    addLog(b.name, m[0], m[1]);
  }, 3000);

  addLog('Sistema', '🏢 Bot Office Habbo iniciado!', 'ok');
}

// Start!
initOffice();

