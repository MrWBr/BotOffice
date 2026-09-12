
// ============================================================
// simulation.js — Simulação de estados e eventos
// ============================================================

function sim(){
  if(!STATE.running) return;

  // Bot state changes
  BOTS.forEach(function(bot, i){
    if(i >= 8 || bot.act || bot.hidden) return;

    // Random state change
    if(Math.random() < 0.04){
      var sts = ['idle','work','idle','idle','work','sleep','idle','happy'];
      var ns = sts[rn(sts.length)];
      bot.state = ns;
      var ph = CFG.PHRASES[ns];
      if(ph){
        bot.bub = ph[rn(ph.length)];
        bot.bubT = 80;
      }
    }

    // Random coffee break
    if(Math.random() < 0.008 && bot.state === 'idle'){
      goCopa(bot);
    }
  });

  // Random meeting
  if(Math.random() < 0.004){
    var idle = BOTS.filter(function(b, i){
      return i < 8 && !b.act && !b.hidden && b.state === 'idle';
    });
    if(idle.length >= 2){
      var pick = idle.slice(0, 2 + rn(2));
      goMeet(pick.map(function(b){ return b.id }));
    }
  }

  // Operator
  if(Math.random() < 0.02){
    var op = CFG.OPERATOR_PHRASES;
    BOTS[8].bub = op[rn(op.length)];
    BOTS[8].bubT = 80;
  }

  // Paper stack grows
  if(Math.random() < 0.05 && STATE.paperCount < 25){
    STATE.paperCount++;
  }

  // Mail arrives
  if(Math.random() < 0.04){
    STATE.mailCount++;
    STATE.mailFlag = true;
    setTimeout(function(){ STATE.mailFlag = false }, 2000);
  }

  // Board updates
  if(Math.random() < 0.03){
    STATE.board.a = rn(6);
    STATE.board.v = rn(10);
    STATE.board.o = 15 + rn(25);
  }
}

