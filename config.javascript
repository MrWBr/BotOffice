
// ============================================================
// config.js — Configuração central de todos os bots e sala
// ============================================================

var CFG = {
  // Sala
  COLS: 12,
  ROWS: 8,
  TILE_W: 58,
  TILE_H: 29,
  WALL_H: 70,
  SCALE: 1.35,

  // Paleta
  PAL: {
    fL:'#b8a878', fD:'#a89868', fLn:'#9a8a58',
    wF:'#2a3a5a', wS:'#1a2a4a', wT:'#4a5a7a', wLn:'#5a6a8a',
    dT:'#c8a050', dF:'#a08040', dS:'#887030',
    mFr:'#333', mSc:'#0a2040', mOn:'#0a3050',
    sk:'#f0c8a0', skD:'#d4a878', pnt:'#2a2a5e', sho:'#1a1a3e'
  },

  // Portas (parede norte)
  DOORS: [
    { tx:3,   label:'☕ COPA',      color:'#d4a574', type:'copa'  },
    { tx:5.5, label:'🤝 REUNIÃO',  color:'#a78bfa', type:'meet'  }
  ],

  // Wall screens (parede norte)
  SCREENS: [
    { tx:1,    type:'etq',  label:'ETIQUETAS'   },
    { tx:8,    type:'ord',  label:'ORDENS'       },
    { tx:9.5,  type:'perf', label:'PERFORMANCE'  },
    { tx:11,   type:'stat', label:'STATUS BOTS'  }
  ],

  // Frases por estado
  PHRASES: {
    idle:  ['...','Hmm...','🤔','Aguardando...'],
    work:  ['Executando...','Processando...','Rodando macro...','SAP respondendo...'],
    sleep: ['Zzz... 😴','5 min...','Descansando...'],
    happy: ['Pronto! ✅','Feito!','Concluído! 🎉'],
    error: ['ERRO! ❌','Timeout SAP!','Falha na conexão!'],
    cafe:  ['☕ Café!','Cafezinho...','Expresso duplo!'],
    meet:  ['🤝 Reunião!','Alinhamento...','Sync rápido!']
  },

  // Operador
  OPERATOR_PHRASES: [
    'Monitorando...','Tudo normal 👍','Status OK ✅',
    'Verificando...','Sistemas online 🟢','Checando SAP...'
  ]
};

// ============================================================
// BOTS — Cada bot com suas macros reais do PlanejamentoUTL
// ============================================================
var BOTS = [
  {
    id:'b0', name:'SAP Keeper', emoji:'🏠',
    color:'#4ecca3', hair:'#2a2a3a',
    tx:2, ty:2, hx:2, hy:2,
    state:'idle', bub:'', bubT:0,
    hidden:false, act:null, _w:null,
    personality:'diligente',
    macros:['Abrir_Sap','SapKeeper']
    mood: { paciencia: 0.7, confianca: 0.6, carga: 0.3 }
  },
  {
    id:'b1', name:'Harvester', emoji:'🌾',
    color:'#45b7d1', hair:'#8B4513',
    tx:4, ty:2, hx:4, hy:2,
    state:'idle', bub:'', bubT:0,
    hidden:false, act:null, _w:null,
    personality:'workaholic',
    macros:['Ordens','Bancodedados_IP24','ATTiw29_MM','ATTip24','Att_Iw49','ATUALIZAR_IW38','Quebras','suborder']
    mood: { paciencia: 0.7, confianca: 0.6, carga: 0.3 }
  },
  {
    id:'b2', name:'Planner', emoji:'📋',
    color:'#f0c040', hair:'#c0392b',
    tx:6, ty:2, hx:6, hy:2,
    state:'idle', bub:'', bubT:0,
    hidden:false, act:null, _w:null,
    personality:'metódico',
    macros:['chamar_planos','Liberar_rotas']
  },
  {
    id:'b3', name:'Dispatch', emoji:'📦',
    color:'#a78bfa', hair:'#1a1a2a',
    tx:8, ty:2, hx:8, hy:2,
    state:'idle', bub:'', bubT:0,
    hidden:false, act:null, _w:null,
    personality:'organizado',
    macros:['DistribuicaoOrdens']
    mood: { paciencia: 0.7, confianca: 0.6, carga: 0.3 }
  },
  {
    id:'b4', name:'Checker', emoji:'✅',
    color:'#06b6d4', hair:'#d4a030',
    tx:2, ty:5, hx:2, hy:5,
    state:'idle', bub:'', bubT:0,
    hidden:false, act:null, _w:null,
    personality:'perfeccionista',
    macros:['AnaliseCheck','CorrigirCheck']
    mood: { paciencia: 0.7, confianca: 0.6, carga: 0.3 }
  },
  {
    id:'b5', name:'Labels', emoji:'🏷',
    color:'#f97316', hair:'#2a2a3a',
    tx:4, ty:5, hx:4, hy:5,
    state:'idle', bub:'', bubT:0,
    hidden:false, act:null, _w:null,
    personality:'atento',
    macros:['ATT_EtiquetasDiario','etqiw49']
    mood: { paciencia: 0.7, confianca: 0.6, carga: 0.3 }
  },
  {
    id:'b6', name:'Mailer', emoji:'📧',
    color:'#e94560', hair:'#e07020',
    tx:6, ty:5, hx:6, hy:5,
    state:'idle', bub:'', bubT:0,
    hidden:false, act:null, _w:null,
    personality:'comunicativo',
    macros:['Etiquetas_email','EtiquetasSemRetorno_email','EnviarEmail_ordensativas','EnviarEmail_horas','RotasAtrasadas','Emails_dinamicos','ProgramacaoEmail']
    mood: { paciencia: 0.7, confianca: 0.6, carga: 0.3 }
  },
  {
    id:'b7', name:'Reporter', emoji:'📊',
    color:'#8b5cf6', hair:'#6a3a8a',
    tx:8, ty:5, hx:8, hy:5,
    state:'idle', bub:'', bubT:0,
    hidden:false, act:null, _w:null,
    personality:'analítico',
    macros:['lancamentohoras']
    mood: { paciencia: 0.7, confianca: 0.6, carga: 0.3 }
  },
  {
    id:'op', name:'Operador', emoji:'👨‍💼',
    color:'#8aa4cc', hair:'#2a2a3a',
    tx:10, ty:1, hx:10, hy:1,
    state:'idle', bub:'', bubT:0,
    hidden:false, act:null, _w:null,
    personality:'supervisor',
    macros:[]
    mood: { paciencia: 0.7, confianca: 0.6, carga: 0.3 }
  }
];

// Estado global compartilhado
var STATE = {
  running: true,
  frame: 0,
  paperCount: 7,
  mailCount: 3,
  mailFlag: false,
  board: { a:3, v:5, o:22 },
  copaOcc: [],
  meetOcc: []
};

