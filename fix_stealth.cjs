const fs = require('fs');
let sm = fs.readFileSync('src/components/screens/StealthMode.tsx', 'utf8');

sm = sm.replace("import { motion } from 'motion/react';", "import { motion } from 'motion/react';\nimport { Language } from '../../types';\nimport { i18n } from '../../i18n';");

sm = sm.replace(
  "export default function StealthMode({ onBack }: { onBack: () => void }) {",
  "export default function StealthMode({ language, onBack }: { language: Language, onBack: () => void }) {\n  const t = i18n[language].stealth;"
);

sm = sm.replace(/<div className="font-black tracking-widest uppercase mb-2">MODO SIGILO<\/div>/g, '<div className="font-black tracking-widest uppercase mb-2">{t.title}</div>');
sm = sm.replace(/<div className="text-xs opacity-50">Pantalla atenuada y notificaciones bloqueadas\.<\/div>/g, '<div className="text-xs opacity-50">{t.desc}</div>');
sm = sm.replace(/<div className="font-black tracking-widest uppercase text-xs">PULSA PARA SALIR<\/div>/g, '<div className="font-black tracking-widest uppercase text-xs">{t.exit}</div>');

fs.writeFileSync('src/components/screens/StealthMode.tsx', sm);
console.log('StealthMode fixed');
