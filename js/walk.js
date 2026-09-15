
// ============================================================
// walk.js — Walking engine + ações (copa, reunião)
// ============================================================

function walkTo(bot, tx, ty, cb){
  bot.state = 'walk';
  bot.act = 'walking';
  bot._w = { tx:tx, ty:ty, cb:cb };
}

function tickWalk(bot){
  if(!bot._w) return;
  var t = bot._w;
  var dx = t.tx - bot.tx;
  var dy = t.ty - bot.ty;
  var dist = Math.sqrt(dx*dx + dy*dy);

  if(dist < 0.15){
    bot.tx = t.tx;
    bot.ty = t.ty;
    var cb = t.cb;
    bot._w = null;
    bot.act = null;
    if(cb) cb();
    return;
  }
  bot.tx += dx / dist * 0.1;
  bot.ty += dy / dist * 0.1;
}

function goDesk(bot){
  bot.hidden = false;
  walkTo(bot, bot.hx, bot.hy, function(){ bot.state = 'idle' });
}

function goCopa(bot){
  if(bot.act) return;
  var ph = CFG.PHRASES.cafe;
  bot.bub = ph[rn(ph.length)]; bot.bubT = 60;
  addLog(bot.name, '☕ Indo pro café', 'soc');

  // Walk to copa door (parede norte, tx=3.5)
  walkTo(bot, 3.5, 0.5, function(){
    bot.hidden = true;
    bot.state = 'cafe';
    STATE.copaOcc.push(bot.id);
    addLog(bot.name, '☕ Na copa', 'soc');

    setTimeout(function(){
      STATE.copaOcc = STATE.copaOcc.filter(function(id){ return id !== bot.id });
      bot.hidden = false;
      bot.tx = 3.5; bot.ty = 0.5;
      bot.bub = 'Voltei! ☕'; bot.bubT = 60;
      goDesk(bot);
    }, 5000 + rn(5000));
  });
}

function goMeet(ids){
  var bots = ids.map(function(id){
    return BOTS.find(function(b){ return b.id === id });
  }).filter(function(b){ return b && !b.act && !b.hidden });

  if(bots.length < 2) return;

  var ph = CFG.PHRASES.meet;
  addLog('Reunião', '🤝 ' + bots.map(function(b){ return b.emoji }).join(''), 'soc');

  bots.forEach(function(bot){
    bot.bub = ph[rn(ph.length)]; bot.bubT = 60;
    // Walk to meeting door (parede norte, tx=6)
    walkTo(bot, 6, 0.5, function(){
      bot.hidden = true;
      bot.state = 'meet';
      STATE.meetOcc.push(bot.id);
    });
  });

  setTimeout(function(){
    bots.forEach(function(bot){
      STATE.meetOcc = STATE.meetOcc.filter(function(id){ return id !== bot.id });
      bot.hidden = false;
      bot.tx = 6; bot.ty = 0.5;
      bot.bub = 'Voltei!'; bot.bubT = 60;
      goDesk(bot);
    });
  }, 8000 + rn(5000));
}

