// ============================================================
// config.js — Configuração central de bots, sala e personalidades
// ============================================================

var CFG = {
  COLS: 12, ROWS: 8, TILE_W: 58, TILE_H: 29, WALL_H: 70, SCALE: 1.35,
  PAL: {
    fL:'#b8a878', fD:'#a89868', fLn:'#9a8a58',
    wF:'#2a3a5a', wS:'#1a2a4a', wT:'#4a5a7a', wLn:'#5a6a8a',
    dT:'#c8a050', dF:'#a08040', dS:'#887030',
    mFr:'#333', mSc:'#0a2040', mOn:'#0a3050',
    sk:'#f0c8a0', skD:'#d4a878', pnt:'#2a2a5e', sho:'#1a1a3e'
  },
  DOORS: [
    { tx:3,   label:'☕ COPA',      color:'#d4a574', type:'copa'  },
    { tx:5.5, label:'🤝 REUNIÃO',  color:'#a78bfa', type:'meet'  }
  ],
  SCREENS: [
    { tx:1,    type:'etq',  label:'ETIQUETAS'   },
    { tx:8,    type:'ord',  label:'ORDENS'       },
    { tx:9.5,  type:'perf', label:'PERFORMANCE'  },
    { tx:11,   type:'stat', label:'STATUS BOTS'  }
  ],
  PHRASES: {
    idle:  ['...','Hmm...','🤔','Aguardando...'],
    work:  ['Executando...','Processando...','Rodando macro...','SAP respondendo...'],
    sleep: ['Zzz... 😴','5 min...','Descansando...'],
    happy: ['Pronto! ✅','Feito!','Concluído! 🎉'],
    error: ['ERRO! ❌','Timeout SAP!','Falha na conexão!'],
    cafe:  ['☕ Café!','Cafezinho...','Expresso duplo!'],
    meet:  ['🤝 Reunião!','Alinhamento...','Sync rápido!']
  },

  PERFIL_PERSONALIDADES: {
    diligente:   { nivel: 'Jr 1', modFadiga: 1.0, modEstresse: 1.0, limiarCafe: 0.60 },
    workaholic:  { nivel: 'Pl 2', modFadiga: 0.5, modEstresse: 0.7, limiarCafe: 0.85 },
    metodico:    { nivel: 'Pl 1', modFadiga: 0.9, modEstresse: 1.2, limiarCafe: 0.65 },
    organizada:  { nivel: 'Sr 1', modFadiga: 0.7, modEstresse: 0.8, limiarCafe: 0.70 },
    atento:      { nivel: 'Jr 2', modFadiga: 1.1, modEstresse: 1.1, limiarCafe: 0.55 },
    analitica:   { nivel: 'Pl 2', modFadiga: 0.8, modEstresse: 1.0, limiarCafe: 0.60 },
    focado:      { nivel: 'Jr 1', modFadiga: 1.0, modEstresse: 1.3, limiarCafe: 0.50 },
    eficiente:   { nivel: 'Sr 2', modFadiga: 0.6, modEstresse: 0.5, limiarCafe: 0.75 },
    supervisor:  { nivel: 'Especialista', modFadiga: 0.2, modEstresse: 0.2, limiarCafe: 0.90 }
  }
};

// ============================================================
// REGISTRO DE BOTS (COM TEMPO INDIVIDUAL POR MACRO)
// ============================================================
var BOTS = [
  {
    id: 'b0', name: 'Carlos Silva', emoji: '🤖', color: '#38bdf8', hair: '#2a2a3a',
    tx: 2, ty: 2, hx: 2, hy: 2, state: 'idle', bub: '', bubT: 0,
    hidden: false, act: null, _w: null,
    personality: 'diligente', hireSimDay: 0, acertos: 0, erros: 0, _fadiga: 0, _emPausa: false,
    currentMacro: 'Abrir_Sap',
    macros: [
      { name: 'Abrir_Sap', intervalMs: 100000, lastRun: 0 },
      { name: 'SapKeeper', intervalMs: 15000, lastRun: 0 }
    ]
  },
  {
    id: 'b1', name: 'Ana Oliveira', emoji: '🤖', color: '#22c55e', hair: '#8B4513',
    tx: 4, ty: 2, hx: 4, hy: 2, state: 'idle', bub: '', bubT: 0,
    hidden: false, act: null, _w: null,
    personality: 'workaholic', hireSimDay: 0, acertos: 0, erros: 0, _fadiga: 0, _emPausa: false,
    currentMacro: 'Bancodedados_IP24',
    macros: [
      { name: 'Bancodedados_IP24', intervalMs: 3000000, lastRun: 1 },
      { name: 'ATTiw29_MM', intervalMs: 600000, lastRun: 0 },
      { name: 'ATT_EtiquetasDiario', intervalMs: 150000, lastRun: 0 },
      { name: 'etqiw49', intervalMs: 155000, lastRun: 0 },
      { name: 'Att_Iw49', intervalMs: 120000, lastRun: 0 }
    ]
  },
  {
    id: 'b2', name: 'Lucas Souza', emoji: '🤖', color: '#f59e0b', hair: '#c0392b',
    tx: 6, ty: 2, hx: 6, hy: 2, state: 'idle', bub: '', bubT: 0,
    hidden: false, act: null, _w: null,
    personality: 'metodico', hireSimDay: 0, acertos: 28, erros: 2, _fadiga: 0, _emPausa: false,
    currentMacro: 'RotasAtrasadas',
    macros: [
      { name: 'RotasAtrasadas', intervalMs: 900000, lastRun: 0 }
    ]
  },
  {
    id: 'b3', name: 'Mariana Lima', emoji: '🤖', color: '#ec4899', hair: '#1a1a2a',
    tx: 8, ty: 2, hx: 8, hy: 2, state: 'idle', bub: '', bubT: 0,
    hidden: false, act: null, _w: null,
    personality: 'organizada', hireSimDay: 0, acertos: 62, erros: 1, _fadiga: 0, _emPausa: false,
    currentMacro: 'DistribuicaoOrdens',
    macros: [
      { name: 'DistribuicaoOrdens', intervalMs: 11000, lastRun: 0 }
    ]
  },
  {
    id: 'b4', name: 'Gabriel Pereira', emoji: '🤖', color: '#14b8a6', hair: '#d4a030',
    tx: 2, ty: 5, hx: 2, hy: 5, state: 'idle', bub: '', bubT: 0,
    hidden: false, act: null, _w: null,
    personality: 'atento', hireSimDay: 0, acertos: 18, erros: 3, _fadiga: 0, _emPausa: false,
    currentMacro: 'Quebras',
    macros: [
      { name: 'Quebras', intervalMs: 36000000, lastRun: 0 },
      { name: 'suborder', intervalMs: 36300000, lastRun: 0 }
    ]
  },
  {
    id: 'b5', name: 'Beatriz Ferreira', emoji: '🤖', color: '#8b5cf6', hair: '#2a2a3a',
    tx: 4, ty: 5, hx: 4, hy: 5, state: 'idle', bub: '', bubT: 0,
    hidden: false, act: null, _w: null,
    personality: 'analitica', hireSimDay: 0, acertos: 34, erros: 0, _fadiga: 0, _emPausa: false,
    currentMacro: 'Etiquetas_email',
    macros: [
      { name: 'Etiquetas_email', intervalMs: 18000000, lastRun: 0 },
      { name: 'OrdensAtivas_email', intervalMs: 700000, lastRun: 0 },
      { name: 'EnviarEmail_horas', intervalMs: 700000, lastRun: 0 }
    ]
  },
  {
    id: 'b6', name: 'Rafael Costa', emoji: '🤖', color: '#f97316', hair: '#e07020',
    tx: 6, ty: 5, hx: 6, hy: 5, state: 'idle', bub: '', bubT: 0,
    hidden: false, act: null, _w: null,
    personality: 'focado', hireSimDay: 0, acertos: 8, erros: 4, _fadiga: 0, _emPausa: false,
    currentMacro: 'lancamentohoras',
    macros: [
      { name: 'lancamentohoras', intervalMs: 1200000, lastRun: 0 }
    ]
  },
  {
    id: 'b7', name: 'Fernanda Ribeiro', emoji: '🤖', color: '#e94560', hair: '#6a3a8a',
    tx: 8, ty: 5, hx: 8, hy: 5, state: 'idle', bub: '', bubT: 0,
    hidden: false, act: null, _w: null,
    personality: 'eficiente', hireSimDay: 0, acertos: 110, erros: 1, _fadiga: 0, _emPausa: false,
    currentMacro: 'lancamentohoras',
    macros: [
      { name: 'EmailandSaveCellValue', intervalMs: 172800000, lastRun: 0 }
    ]
  },
  {
    id: 'op', name: 'Supervisor Roberto', emoji: '👨‍💼', color: '#a855f7', hair: '#2a2a3a',
    tx: 10, ty: 1, hx: 10, hy: 1, state: 'idle', bub: '', bubT: 0,
    hidden: false, act: null, _w: null,
    personality: 'supervisor', hireSimDay: 0, acertos: 500, erros: 0, _fadiga: 0, _emPausa: false,
    currentMacro: '',
    macros: []
  }
];

var STATE = {
  running: true, frame: 0, paperCount: 7, mailCount: 3, mailFlag: false,
  board: { a: 3, v: 5, o: 22 }, copaOcc: [], meetOcc: []
};