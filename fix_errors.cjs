const fs = require('fs');

let meds = fs.readFileSync('src/components/screens/Meds.tsx', 'utf8');
meds = meds.replace(/onAdd\(\{ name: 'SOS Med', dose: '1mg', time: 'When needed', confirmed: false \}\)/, "onAdd({ id: Math.random().toString(36).substring(7), name: 'SOS Med', dose: '1mg', time: 'When needed', confirmed: false })");
fs.writeFileSync('src/components/screens/Meds.tsx', meds);

let i18n = fs.readFileSync('src/i18n.ts', 'utf8');
i18n = i18n.replace(/subtitle: 'Validación de Energía Ejecutiva',\n\s*subtitle: 'Validación de Energía Ejecutiva',/g, "subtitle: 'Validación de Energía Ejecutiva',");
i18n = i18n.replace(/subtitle: 'Executive Energy Validation',\n\s*subtitle: 'Executive Energy Validation',/g, "subtitle: 'Executive Energy Validation',");
fs.writeFileSync('src/i18n.ts', i18n);

console.log("Errors fixed");
