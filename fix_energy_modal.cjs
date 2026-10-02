const fs = require('fs');

let file = fs.readFileSync('src/components/EnergyModal.tsx', 'utf8');

file = file.replace(/import \{ EnergyLevel \} from '\.\.\/types';/, "import { EnergyLevel, Language } from '../types';\nimport { i18n } from '../i18n';");

file = file.replace(/interface EnergyModalProps \{/, "interface EnergyModalProps {\n  language: Language;");

file = file.replace(/export default function EnergyModal\(\{ onSetEnergy, onClose \}: EnergyModalProps\) \{/, "export default function EnergyModal({ language, onSetEnergy, onClose }: EnergyModalProps) {\n  const t = i18n[language].energy;");

file = file.replace(/label: 'CRÍTICA' \}/, 'label: t.crit }');
file = file.replace(/label: 'BAJA' \}/, 'label: t.low }');
file = file.replace(/label: 'MEDIA' \}/, 'label: t.med }');
file = file.replace(/label: 'ALTA' \}/, 'label: t.high }');
file = file.replace(/label: 'MÁXIMA' \}/, 'label: t.max }');

file = file.replace(/>Carga Cognitiva<\/h2>/, '>{t.title}</h2>');
file = file.replace(/>Validación de Energía Ejecutiva<\/p>/, '>{t.subtitle}</p>');
file = file.replace(/>\s*Cerrar\s*<\/button>/, '>{t.close}</button>');

fs.writeFileSync('src/components/EnergyModal.tsx', file);

let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace(/<EnergyModal \s*onSetEnergy=\{handleSetEnergy\}\s*onClose=\{/, '<EnergyModal language={profile.language} onSetEnergy={handleSetEnergy} onClose={');
fs.writeFileSync('src/App.tsx', app);

console.log("EnergyModal translations fixed");
