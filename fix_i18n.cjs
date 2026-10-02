const fs = require('fs');

let file = fs.readFileSync('src/i18n.ts', 'utf8');

// Energy Modal
file = file.replace(/title: 'Carga Cognitiva',/, "title: 'Carga Cognitiva',\n        subtitle: 'Validación de Energía Ejecutiva',");

// Home missing translations
file = file.replace(/medsSub: 'Sin confirmación de dosis',/, "medsSub: 'Sin confirmación de dosis',\n      debtsTitle: 'Compromisos Futuros',\n      debtsSub: 'Gestión Lógica de Deuda',\n      stealthTitle: 'Modo Trabajo (Stealth)',\n      stealthSub: 'Terminal Sys.Reg()',\n      companionTitle: 'Refugio de Compañía',\n      companionSub: 'Interacción IA segura',");

file = file.replace(/medsSub: 'Unconfirmed Dose',/, "medsSub: 'Unconfirmed Dose',\n      debtsTitle: 'Future Commitments',\n      debtsSub: 'Logical Debt Management',\n      stealthTitle: 'Stealth Mode',\n      stealthSub: 'Terminal Sys.Reg()',\n      companionTitle: 'Companion Refuge',\n      companionSub: 'Safe AI Interaction',");

// AI titles missing translations
file = file.replace(/title: 'CÓRTEX NEURAL',/, "title: 'CÓRTEX NEURAL',\n        companionMode: 'ASISTENTE DE CALMA',\n        companionModeSub: 'COMPAÑERO DISEÑADO PARA TU TRANQUILIDAD',\n        placeholder: '¿En qué puedo ayudarte?',");
file = file.replace(/title: 'NEURAL CORTEX',/, "title: 'NEURAL CORTEX',\n        companionMode: 'CALM ASSISTANT',\n        companionModeSub: 'COMPANION DESIGNED FOR YOUR PEACE OF MIND',\n        placeholder: 'How can I help you?',");

// Body scanner
file = file.replace(/stopGuide: 'Detener guía',/, "stopGuide: 'Detener guía',\n      q1: 'PREGUNTA 1 DE 3',\n      q2: 'PREGUNTA 2 DE 3',\n      q3: 'PREGUNTA 3 DE 3',\n      yes: 'SÍ',\n      no: 'NO',\n      scanBtn: 'ESCÁNER LIBRE',\n      calBtn: 'CALIBRACIÓN',");

file = file.replace(/stopGuide: 'Stop guide',/, "stopGuide: 'Stop guide',\n      q1: 'QUESTION 1 OF 3',\n      q2: 'QUESTION 2 OF 3',\n      q3: 'QUESTION 3 OF 3',\n      yes: 'YES',\n      no: 'NO',\n      scanBtn: 'FREE SCAN',\n      calBtn: 'CALIBRATION',");

// Settings placeholders
file = file.replace(/title: 'CONFIGURACIÓN',/, "title: 'CONFIGURACIÓN',\n        placeholders: {\n            blood: 'Ej: O+',\n            allergies: 'Medicamentos, látex, etc.',\n            hyper: 'Ej: Luces fuertes, ruidos agudos',\n            hypo: 'Ej: Necesidad de presión profunda',\n            triggers: 'Lo que más me molesta',\n            interests: 'Temas que me apasionan/calman',\n            supportEntity: 'Ej: Mi gato, Peluche dino, Manta'\n        },");

file = file.replace(/title: 'SETTINGS',/, "title: 'SETTINGS',\n        placeholders: {\n            blood: 'Ex: O+',\n            allergies: 'Meds, latex, etc.',\n            hyper: 'Ex: Bright lights, loud noises',\n            hypo: 'Ex: Need for deep pressure',\n            triggers: 'What bothers me the most',\n            interests: 'Topics I am passionate about',\n            supportEntity: 'Ex: My cat, Dino plush, Blanket'\n        },");


fs.writeFileSync('src/i18n.ts', file);
console.log("i18n fixed");
