
function updateMood(bot, prevState, newState){
  var m = bot.mood;
  if(newState === 'error'){
    m.paciencia = Math.max(0, m.paciencia - 0.15);
    m.carga = Math.min(1, m.carga + 0.1);
  } else if(prevState === 'work' && newState === 'idle'){
    m.confianca = Math.min(1, m.confianca + 0.08);
    m.carga = Math.max(0, m.carga - 0.1);
  } else if(newState === 'work'){
    m.carga = Math.min(1, m.carga + 0.03);
  }
  // Recuperação lenta com o tempo, todo tick
  m.paciencia = Math.min(1, m.paciencia + 0.01);
}
