// ============================================================
// ui.js — Interface: topbar, pills, relógio e log
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
  if(!el) return;
  var t = new Date().toLocaleTimeString('pt-BR', {hour:'2-digit',minute:'2-digit',second:'2-digit'});
  var d = document.createElement('div');
  d.className = 'pe ' + (tp || '');
  var cl = tp==='ok' ? '#4ecca3' : tp==='err' ? '#e94560' : '#f0c040';
  d.innerHTML = '<span class="pt">' + t + '</span>' +
                '<span class="ps" style="color:' + cl + '">' + src + '</span> ' + msg;
  el.insertBefore(d, el.firstChild);
  while(el.children.length > 50) el.removeChild(el.lastChild);
}

function initOffice(){
  // Carrega frotas se já declaradas na página HTML
  if (typeof window.frotaConfig !== 'undefined' && typeof window.atualizarInstanciasBots === 'function') {
    window.atualizarInstanciasBots(window.frotaConfig);
  }
  
  render();
  setInterval(sim, 1500);
  setInterval(updP, 1000);
  setInterval(updClk, 1000);
  updClk();
  addLog('Sistema', '🏢 Bot Office iniciado!', 'ok');
}
function getTempoDeCasaSimulado(bot) {
  const diaAtual = STATE.currentSimDay || 0;
  const diaEntrada = bot.hireSimDay || 0;
  const diasTotais = Math.max(1, diaAtual - diaEntrada);
  
  if (diasTotais < 30) {
    return `${diasTotais} dia(s)`;
  }
  
  const meses = Math.floor(diasTotais / 30);
  const diasRestantes = diasTotais % 30;
  
  if (meses < 12) {
    return diasRestantes > 0 ? `${meses}m ${diasRestantes}d` : `${meses} mês(es)`;
  }
  
  const anos = Math.floor(meses / 12);
  const mesesRestantes = meses % 12;
  return `${anos}a ${mesesRestantes}m`;
}
initOffice();