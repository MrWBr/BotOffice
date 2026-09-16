// ============================================================
// simulation.js — Versão Final Corrigida (Fila VBA + Rotação + Utility AI + Recovery)
// ============================================================

window._BOT_SCHED = window._BOT_SCHED || {};

// ============================================================
// 1. CORPUS MARKOV PARA DIÁLOGOS DE MANUTENÇÃO / PCM
// ============================================================
var MARKOV_CORPUS = [
    "abrindo om de manutencao corretiva no sap pm",
    "atualizando cronograma",
    "checando backlog de ordens de servico atrasadas",
    "solicitando cotacao",
    "analisando mttr e mtbf",
    "revisando plano de lubricacao",
    "verificando disponibilidades de estoque critico almoxarifado",
    "fechando apontamento de horas no modulo pm do sap",
    "gerando relatorio semanal"
];

function _buildMarkov(corpus, order) {
    var chain = {}; order = order || 2;
    corpus.forEach(function(txt) {
        var words = txt.split(/\s+/);
        if (words.length <= order) return;
        for (var i = 0; i <= words.length - order; i++) {
            var k = words.slice(i, i + order).join(' ');
            var n = words[i + order] || null;
            if (!chain[k]) chain[k] = [];
            chain[k].push(n);
        }
    });
    return chain;
}
var _markovChain = _buildMarkov(MARKOV_CORPUS, 2);

function _genMarkov() {
    var keys = Object.keys(_markovChain);
    if (!keys.length) return "processando utl...";
    var k = keys[Math.floor(Math.random() * keys.length)];
    var res = k.split(' ');
    for (var i = 0; i < 5; i++) {
        var nex = _markovChain[k];
        if (!nex || !nex.length) break;
        var w = nex[Math.floor(Math.random() * nex.length)];
        if (!w) break;
        res.push(w);
        var parts = k.split(' '); parts.shift(); parts.push(w);
        k = parts.join(' ');
    }
    return res.join(' ');
}

// ============================================================
// 2. POSIÇÕES FÍSICAS E TRAVAS DO SISTEMA
// ============================================================
var SLOTS_MESAS = [
  { tx: 2, ty: 2 }, { tx: 4, ty: 2 }, { tx: 6, ty: 2 }, { tx: 8, ty: 2 },
  { tx: 2, ty: 5 }, { tx: 4, ty: 5 }, { tx: 6, ty: 5 }, { tx: 8, ty: 5 }
];

function isAnyBotWorking() {
  return BOTS.some(function(b) { return b.state === 'work'; });
}

// ============================================================
// 3. UTILITY AI (SISTEMA NEURAL DE DECISÃO)
// ============================================================

var PERFIS_NEURAIS = {
  diligente:  { wTrabalho: 0.7, wPausa: 0.5, limiarEstresse: 0.70, wChat: 0.3 },
  workaholic: { wTrabalho: 0.9, wPausa: 0.2, limiarEstresse: 0.95, wChat: 0.1 },
  metodico:   { wTrabalho: 0.6, wPausa: 0.8, limiarEstresse: 0.50, wChat: 0.2 },
  organizada: { wTrabalho: 0.7, wPausa: 0.6, limiarEstresse: 0.60, wChat: 0.4 },
  atento:     { wTrabalho: 0.8, wPausa: 0.5, limiarEstresse: 0.75, wChat: 0.3 },
  analitica:  { wTrabalho: 0.6, wPausa: 0.7, limiarEstresse: 0.60, wChat: 0.2 },
  focado:     { wTrabalho: 0.9, wPausa: 0.4, limiarEstresse: 0.85, wChat: 0.1 },
  eficiente:  { wTrabalho: 0.8, wPausa: 0.6, limiarEstresse: 0.70, wChat: 0.2 }
};

function processarNeuroniosDecisao(bot) {
  var sched = _BOT_SCHED[bot.id] || { lastRun: Date.now() };
  var tempoEsperaSeg = (Date.now() - sched.lastRun) / 1000;

  var perfil = PERFIS_NEURAIS[bot.personality] || PERFIS_NEURAIS.diligente;

  var energiaAtual = 1 - Math.min(1, (bot._fadiga || 0) / 100); 
  var nivelEstresse = Math.min(1, (bot.erros || 0) * 0.25); 
  var pressaoFila = Math.min(1, tempoEsperaSeg / 20); 

  var noise = () => Math.random() * 0.1;

  var scoreTrabalhar  = (energiaAtual * perfil.wTrabalho) + (pressaoFila * 0.6) + noise();
  var scorePausar     = ((1 - energiaAtual) * perfil.wPausa) + (nivelEstresse * 1.5) + noise();
  var scoreSocializar = (0.5 * perfil.wChat) + ((1 - nivelEstresse) * 0.3) + noise();

  if (nivelEstresse >= perfil.limiarEstresse || energiaAtual <= 0.1) {
    scorePausar += 10.0; 
  }

  // 🧠 GARANTE QUE O OBJETO _BRAIN EXISTA E SALVA OS DADOS COM SEGURANÇA
  if (!bot._brain) bot._brain = {};
  bot._brain.scoreTrabalhar = Math.max(0, scoreTrabalhar).toFixed(2);
  bot._brain.scorePausar = Math.max(0, scorePausar).toFixed(2);
  bot._brain.scoreSocializar = Math.max(0, scoreSocializar).toFixed(2);
  bot._brain.energy = Math.round(energiaAtual * 100);
  bot._brain.stress = Math.round(nivelEstresse * 100);

  var decisaoFinal = { dispararMacro: false, irParaCopa: false, falarChat: false };

  if (scorePausar > scoreTrabalhar && scorePausar > scoreSocializar) {
    decisaoFinal.irParaCopa = true;
    bot._brain.decisao = "PAUSA / CAFÉ";
  } else if (scoreTrabalhar > scorePausar && scoreTrabalhar > scoreSocializar) {
    decisaoFinal.dispararMacro = true;
    bot._brain.decisao = "TRABALHAR";
  } else {
    decisaoFinal.falarChat = true;
    bot._brain.decisao = "SOCIALIZAR";
  }

  return decisaoFinal;
}

function getBotHumor(bot) {
  if (bot.state === 'error') return '🤬';
  if (bot.state === 'work') return '⚡';
  if (bot._emPausa) return '☕';

  var estresse = (bot.erros || 0) - (bot.acertos || 0) * 0.1;
  if (estresse > 2) return '😤';
  if ((bot.acertos || 0) > 15) return '🔥';
  if ((bot.acertos || 0) > 5) return '😊';
  return '😎';
}

function forcarAtualizacaoUI() {
  if (typeof renderCards === 'function') renderCards();
  if (typeof renderBots === 'function') renderBots();
  if (typeof updateUI === 'function') updateUI();
}

// ============================================================
// 4. SINCRONIZAÇÃO E CONTROLE DE EXECUÇÃO
// ============================================================

window.atualizarInstanciasBots = function(novaFrotaConfig) {
  if (!novaFrotaConfig || !Array.isArray(novaFrotaConfig)) return;

  var operadores = novaFrotaConfig.filter(function(b) { return b.tipo !== 'supervisor'; });
  var supervisor = novaFrotaConfig.find(function(b) { return b.tipo === 'supervisor'; });
  var simDayAtual = (typeof STATE !== 'undefined' && STATE.currentSimDay) ? STATE.currentSimDay : 0;

  operadores.forEach(function(item, idx) {
    if (idx >= 8) return;
    var pos = SLOTS_MESAS[idx];
    var botExistente = BOTS[idx];

    if (!botExistente || botExistente.id !== item.id) {
      if (botExistente && _BOT_SCHED[botExistente.id]) {
        delete _BOT_SCHED[botExistente.id];
      }

      BOTS[idx] = {
        id: item.id,
        name: item.nome,
        emoji: '🤖',
        color: item.color || '#38bdf8',
        tx: pos.tx, ty: pos.ty, hx: pos.tx, hy: pos.ty,
        state: 'idle', bub: 'Novo contratado!', bubT: 100,
        hidden: false, act: null,
        personality: item.nivel || 'diligente',
        hireSimDay: item.hireSimDay !== undefined ? item.hireSimDay : simDayAtual,
        acertos: 0, erros: 0, _fadiga: 0, _emPausa: false,
        currentMacro: 'Ordens PM',
        macros: item.macros || [
          { name: 'Ordens PM', intervalMs: 15000, lastRun: 0 },
          { name: 'Apontamento', intervalMs: 30000, lastRun: 0 }
        ]
      };

      _BOT_SCHED[item.id] = { lastRun: Date.now() + (idx * 3000), timeoutAt: 0 };
    }
  });

  if (supervisor) {
    BOTS[8] = {
      id: supervisor.id, name: supervisor.nome, emoji: '👨‍💼', color: supervisor.color || '#a855f7',
      tx: 10, ty: 1, hx: 10, hy: 1, state: 'idle', bub: '', bubT: 0, hidden: false, act: null,
      personality: supervisor.personalidade || 'supervisor', hireSimDay: -1095,
      acertos: 500, erros: 0, _fadiga: 0, currentMacro: '', macros: []
    };
  }
};

window.receberRetornoVBA = function(botId, sucesso, mensagem) {
  var bot = BOTS.find(function(b) { return b.id === botId; });
  if (!bot) return;

  var sched = _BOT_SCHED[botId];
  if (sched) sched.timeoutAt = 0;

  if (sucesso) {
    bot.state = 'idle';
    bot.bub = 'Concluído! ✅';
    bot.bubT = 90;
    bot.acertos = (bot.acertos || 0) + 1;
    if (typeof addLog === 'function') addLog(bot.name, '✔ ' + (mensagem || 'Sucesso no VBA'), 'ok');
  } else {
    bot.state = 'error';
    bot.bub = 'ERRO VBA! ❌';
    bot.bubT = 120;
    bot.erros = (bot.erros || 0) + 1;
    if (typeof addLog === 'function') addLog(bot.name, '❌ Falha: ' + (mensagem || 'Erro no VBA'), 'err');

    if (bot.erros >= 5) {
      bot.bub = 'Demitido! 📦🚪';
      bot.bubT = 300;
      bot.state = 'fired';
      if (typeof addLog === 'function') addLog(bot.name, '🚨 DEMISSÃO: Excedeu limite de 5 erros!', 'err');

      setTimeout(function() {
        bot.hidden = true;
        bot.act = null;
        if (typeof _BOT_SCHED[bot.id] !== 'undefined') delete _BOT_SCHED[bot.id];
        forcarAtualizacaoUI();
      }, 4000);

      forcarAtualizacaoUI();
      return;
    }

    setTimeout(function() {
      if (bot.state === 'error') {
        bot.state = 'idle';
        bot.bub = 'Reorganizando...';
        bot.bubT = 60;
        forcarAtualizacaoUI();
      }
    }, 5000);
  }

  forcarAtualizacaoUI();

  if (typeof dispararComandoJson === 'function') {
    dispararComandoJson(bot.id, bot.name, bot.currentMacro, bot.state, bot.bub);
  }
};

function _initBotSched() {
  if (typeof BOTS === 'undefined') return;
  var now = Date.now();
  BOTS.forEach(function(b, i) {
    if (i >= 8) return;
    if (!_BOT_SCHED[b.id]) {
      _BOT_SCHED[b.id] = { lastRun: now + (i * 3000), timeoutAt: 0 };
    }
  });
}

function triggerBotTask(botId, customMacro) {
  var bot = BOTS.find(function(b) { return b.id === botId; });
  if (!bot || bot.act || bot.state === 'work' || bot._emPausa) return false;

  var chosenMacro = customMacro || bot.currentMacro || 'Ordens PM';

  if (bot.macros && Array.isArray(bot.macros)) {
    for (var i = 0; i < bot.macros.length; i++) {
      var m = bot.macros[i];
      var mName = (typeof m === 'object') ? m.name : m;
      if (mName === chosenMacro) {
        if (typeof m === 'object') m.lastRun = Date.now();
        break;
      }
    }
  }

  bot.state = 'work';
  bot.bub = chosenMacro;
  bot.bubT = 140;
  bot.currentMacro = chosenMacro;

  var sched = _BOT_SCHED[botId];
  if (!sched) { _initBotSched(); sched = _BOT_SCHED[botId]; }
  if (sched) {
    sched.lastRun = Date.now();
    sched.timeoutAt = Date.now() + 60000;
  }

  bot._fadiga = Math.min(100, (bot._fadiga || 0) + 25);
  forcarAtualizacaoUI();

  if (typeof dispararComandoJson === 'function') {
    dispararComandoJson(bot.id, bot.name || bot.id, chosenMacro, 'active', bot.bub);
  }
  
  if (typeof addLog === 'function') {
    addLog(bot.name || bot.id, '▶ Enviado para VBA: ' + chosenMacro, 'ok');
  }
  return true;
}

// ============================================================
// 5. LOOP PRINCIPAL DE SIMULAÇÃO
// ============================================================
function sim(){
  if(typeof STATE !== 'undefined' && !STATE.running) return;
  _initBotSched();
  var now = Date.now();
  var vbaOcupado = isAnyBotWorking();

  BOTS.forEach(function(bot, i){
    if(i >= 8 || bot.act || bot.hidden || bot.state === 'fired') return;

    var sched = _BOT_SCHED[bot.id];
    if(!sched) return;

    if(bot.state === 'work' && sched.timeoutAt > 0 && now >= sched.timeoutAt) {
      sched.timeoutAt = 0;
      window.receberRetornoVBA(bot.id, false, 'Timeout: Sem resposta do VBA');
      return;
    }

    if(bot.state === 'idle') {
      var decisao = processarNeuroniosDecisao(bot);

      if (decisao.irParaCopa && !bot._emPausa) {
        bot._emPausa = true;
        bot.bub = 'Pausa Café ☕';
        bot.bubT = 120;
        bot._fadiga = 0; 
        bot.erros = Math.max(0, (bot.erros || 0) - 0.5); 

        // 🚶‍♂️ SALVA A POSIÇÃO DA MESA E MANDA PARA A COPA (Ex: Coordenada X: 10, Y: 8 na sua matriz)
        bot.origemTx = bot.tx;
        bot.origemTy = bot.ty;
        bot.tx = 10; // Aluste para a coordenada X real da sua copa/cafeteria
        bot.ty = 8;  // Ajuste para a coordenada Y real da sua copa/cafeteria
        
        forcarAtualizacaoUI();
        setTimeout(function() { 
          bot._emPausa = false; 
          bot.bub = ''; 
          // Retorna o bot para a mesa original dele após o café
          if (bot.origemTx !== undefined) {
            bot.tx = bot.origemTx;
            bot.ty = bot.origemTy;
          }
          forcarAtualizacaoUI();
        }, 6000);
      }
      else if (!bot._emPausa) {
        var macroPronta = null;

        if (bot.macros && Array.isArray(bot.macros) && bot.macros.length > 0) {
          var maiorAtraso = -1;

          for (var mIdx = 0; mIdx < bot.macros.length; mIdx++) {
            var m = bot.macros[mIdx];
            var mName = (typeof m === 'object') ? m.name : m;
            var mInterval = (typeof m === 'object' && m.intervalMs) ? m.intervalMs : 15000;
            var mLastRun = (typeof m === 'object' && m.lastRun) ? m.lastRun : 0;
            var tempoPassado = now - mLastRun;

            if (tempoPassado >= mInterval) {
              var atraso = tempoPassado - mInterval;
              if (atraso > maiorAtraso) {
                maiorAtraso = atraso;
                macroPronta = mName;
              }
            }
          }
        } else if (bot.currentMacro) {
          macroPronta = bot.currentMacro;
        }

        if (macroPronta && decisao.dispararMacro) {
          if (!vbaOcupado) {
            vbaOcupado = true; 
            triggerBotTask(bot.id, macroPronta);
          } else {
            bot.bub = 'Aguardando fila VBA... ⏳';
            bot.bubT = 30;
          }
        } 
        else if (decisao.falarChat && bot.bubT <= 0) {
          bot.bub = _genMarkov();
          bot.bubT = 90;
          if (typeof addLog === 'function') addLog(bot.name, '💭 ' + bot.bub, 'soc');
        }
      }
    }

    if (bot.bubT > 0) bot.bubT--;
  });
}
