const fs = require('fs');

let i18n = fs.readFileSync('src/i18n.ts', 'utf8');
if (!i18n.includes('sosBtn')) {
  i18n = i18n.replace(/cortex: 'Your Safe Haven',/, "cortex: 'Your Safe Haven',\n      sosBtn: 'SOS: MEDICAL INFO',");
  i18n = i18n.replace(/cortex: 'Tu Refugio Seguro',/, "cortex: 'Tu Refugio Seguro',\n      sosBtn: 'SOS: INF. MÉDICA',");
  fs.writeFileSync('src/i18n.ts', i18n);
}

let home = fs.readFileSync('src/components/screens/Home.tsx', 'utf8');
home = home.replace(/>SOS: INF\. MÉDICA<\/span>/g, ">{t.sosBtn}</span>");
home = home.replace(/>SOS: MEDICAL INFO<\/span>/g, ">{t.sosBtn}</span>");
fs.writeFileSync('src/components/screens/Home.tsx', home);
console.log('Fixed Home SOS text');
