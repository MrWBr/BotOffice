# BotOffice
A little tiny office for SAP bots

Folder structure

C:\BotOffice\
├── bot_office.html          ← Este arquivo (só HTML + CSS + imports)
├── js/
│   ├── config.js            ← Bots, cores, macros, personalidades
│   ├── engine.js            ← Canvas, iso, primitivas, render loop
│   ├── furniture.js         ← Mesa, monitor, cadeira, correio, portas
│   ├── screens.js           ← 4 telas isométricas na parede
│   ├── character.js         ← Personagem Habbo + balões
│   ├── walk.js              ← Walking engine + copa/reunião
│   ├── simulation.js        ← Estados aleatórios, eventos
│   └── ui.js                ← Pills, relógio, config modal, logs, init
├── bot_status.json          ← JSON que o VBA atualiza
└── start-office.bat         ← Servidor local
