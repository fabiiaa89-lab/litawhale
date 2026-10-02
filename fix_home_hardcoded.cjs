const fs = require('fs');

let file = fs.readFileSync('src/components/screens/Home.tsx', 'utf8');

file = file.replace(/Compromisos Futuros/, '{t.debtsTitle}');
file = file.replace(/Gestión Lógica de Deuda/, '{t.debtsSub}');

file = file.replace(/Modo Trabajo \(Stealth\)/, '{t.stealthTitle}');
file = file.replace(/Terminal Sys\.Reg\(\)/, '{t.stealthSub}');

file = file.replace(/Refugio de Compañía/, '{t.companionTitle}');
file = file.replace(/Interacción IA segura/, '{t.companionSub}');

fs.writeFileSync('src/components/screens/Home.tsx', file);
console.log("Home hardcoded strings fixed");
