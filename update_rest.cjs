const fs = require('fs');

// Companion
let companion = fs.readFileSync('src/components/screens/Companion.tsx', 'utf8');
companion = companion.replace(
  "interface CompanionProps {\n  profile: Profile;", 
  "import { Language } from '../../types';\nimport { i18n } from '../../i18n';\ninterface CompanionProps {\n  profile: Profile;\n  language: Language;"
);
companion = companion.replace(
  "export default function Companion({ profile, onBack }: CompanionProps) {", 
  "export default function Companion({ profile, language, onBack }: CompanionProps) {\n  const t = i18n[language].companion;"
);
companion = companion.replace(
  "getCompanionMessage(profile.supportEntity);",
  "getCompanionMessage(profile.supportEntity, language);"
);
companion = companion.replace(/<Header title="COMPAÑERO" onBack=\{onBack\} \/>/g, '<Header title={t.title} onBack={onBack} />');
companion = companion.replace(/No has configurado un Objeto o Ser de Apoyo en Ajustes\./g, '{t.noEntity}');
companion = companion.replace(/Ve a la configuración y añade a tu compañero para recibir confort aquí\./g, '{t.goConfig}');
companion = companion.replace(/Sintonizando conexión\.\.\./g, '{t.connecting}');
companion = companion.replace(/Generar nueva interacción/g, '{t.newInteraction}');
fs.writeFileSync('src/components/screens/Companion.tsx', companion);

// Debts
let debts = fs.readFileSync('src/components/screens/Debts.tsx', 'utf8');
debts = debts.replace(
  "interface DebtsProps {\n  debts: Debt[];", 
  "import { Language } from '../../types';\nimport { i18n } from '../../i18n';\ninterface DebtsProps {\n  debts: Debt[];\n  language: Language;"
);
debts = debts.replace(
  "export default function Debts({ debts, onUpdate, onBack }: DebtsProps) {", 
  "export default function Debts({ debts, language, onUpdate, onBack }: DebtsProps) {\n  const t = i18n[language].debts;"
);
debts = debts.replace(/<Header title="DEUDAS DE ENERGÍA" onBack=\{onBack\} titleColor="#f59e0b" \/>/g, '<Header title={t.title} onBack={onBack} titleColor="#f59e0b" />');
debts = debts.replace(/Actividades que están drenando tu energía\./g, '{t.subtitle}');
debts = debts.replace(/Añadir deuda/g, '{t.add}');
fs.writeFileSync('src/components/screens/Debts.tsx', debts);

// StealthMode
let stealth = fs.readFileSync('src/components/screens/StealthMode.tsx', 'utf8');
stealth = stealth.replace(
  "interface StealthModeProps {\n  onBack: () => void;", 
  "import { Language } from '../../types';\nimport { i18n } from '../../i18n';\ninterface StealthModeProps {\n  onBack: () => void;\n  language: Language;"
);
stealth = stealth.replace(
  "export default function StealthMode({ onBack }: StealthModeProps) {", 
  "export default function StealthMode({ language, onBack }: StealthModeProps) {\n  const t = i18n[language].stealth;"
);
stealth = stealth.replace(/<div className="font-black tracking-widest uppercase mb-2">MODO SIGILO<\/div>/g, '<div className="font-black tracking-widest uppercase mb-2">{t.title}</div>');
stealth = stealth.replace(/<div className="text-xs opacity-50">Pantalla atenuada y notificaciones bloqueadas\.<\/div>/g, '<div className="text-xs opacity-50">{t.desc}</div>');
stealth = stealth.replace(/<div className="font-black tracking-widest uppercase text-xs">PULSA PARA SALIR<\/div>/g, '<div className="font-black tracking-widest uppercase text-xs">{t.exit}</div>');
fs.writeFileSync('src/components/screens/StealthMode.tsx', stealth);

// i18n update missing keys
let i18n = fs.readFileSync('src/i18n.ts', 'utf8');
i18n = i18n.replace(/companion: \{[\s\S]*?desc: 'Conectando con entidad de apoyo\.\.\.',\s*\},/, 
`companion: {
        title: 'COMPAÑERO',
        desc: 'Conectando con entidad de apoyo...',
        noEntity: 'No has configurado un Objeto o Ser de Apoyo en Ajustes.',
        goConfig: 'Ve a la configuración y añade a tu compañero para recibir confort aquí.',
        connecting: 'Sintonizando conexión...',
        newInteraction: 'Generar nueva interacción',
    },`);
i18n = i18n.replace(/companion: \{[\s\S]*?desc: 'Connecting with support entity\.\.\.',\s*\},/, 
`companion: {
        title: 'COMPANION',
        desc: 'Connecting with support entity...',
        noEntity: 'You have not configured a Support Object or Entity in Settings.',
        goConfig: 'Go to settings and add your companion to receive comfort here.',
        connecting: 'Tuning connection...',
        newInteraction: 'Generate new interaction',
    },`);

i18n = i18n.replace(/stealth: \{[\s\S]*?desc: 'Pantalla atenuada y notificaciones bloqueadas\.',\s*\},/, 
`stealth: {
        title: 'MODO SIGILO',
        desc: 'Pantalla atenuada y notificaciones bloqueadas.',
        exit: 'PULSA PARA SALIR',
    },`);
i18n = i18n.replace(/stealth: \{[\s\S]*?desc: 'Dimmed screen and blocked notifications\.',\s*\},/, 
`stealth: {
        title: 'STEALTH MODE',
        desc: 'Dimmed screen and blocked notifications.',
        exit: 'PRESS TO EXIT',
    },`);

fs.writeFileSync('src/i18n.ts', i18n);
console.log('Rest updated');
