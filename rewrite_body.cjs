const fs = require('fs');

let content = fs.readFileSync('src/components/screens/BodyScanner.tsx', 'utf8');

// Replace constants import with i18n
content = content.replace("import { SYMPTOMS } from '../../constants';", "import { i18n } from '../../i18n';");

// Replace Language in props
content = content.replace(
  "interface BodyScannerProps {\n  profile: Profile;", 
  "import { Language } from '../../types';\ninterface BodyScannerProps {\n  profile: Profile;\n  language: Language;"
);

content = content.replace(
  "export default function BodyScanner({ profile, onBack }: BodyScannerProps) {",
  "export default function BodyScanner({ profile, language, onBack }: BodyScannerProps) {"
);

// We need to inject t and use t.symptoms etc.
const injectStr = `  const t = i18n[language].body;
  const bodySub = i18n[language].bodySub;
  const SYMPTOMS = i18n[language].symptoms;
  const CALIBRATION_STEPS = i18n[language].calibrationSteps;
  const calResultMap = i18n[language].calResult;`;
  
content = content.replace("export default function BodyScanner({ profile, language, onBack }: BodyScannerProps) {", "export default function BodyScanner({ profile, language, onBack }: BodyScannerProps) {\n" + injectStr);

// Find result text usage and replace with i18n logic
content = content.replace(/setResult\('Necesitas liberar tensión muscular de inmediato.'\);/g, "setResult(calResultMap.tension);");
content = content.replace(/setResult\('Inicia el ejercicio de respiración inferior.'\);/g, "setResult(calResultMap.heart);");
content = content.replace(/setResult\('Aíslate\. Busca tus auriculares o ve al Modo Cueva\.'\);/g, "setResult(calResultMap.noise);");
content = content.replace(/setResult\('Estado base\. No se detectan anomalías graves\.'\);/g, "setResult(calResultMap.none);");

content = content.replace(/<div className="text-xl font-black text-emerald-400 tracking-tighter">ESCÁNER CORPORAL<\/div>/g, '<div className="text-xl font-black text-emerald-400 tracking-tighter">{t.title}</div>');
content = content.replace(/<div className="text-\[10px\] text-emerald-500\/60 font-black uppercase tracking-\[3px\]">Interpretación Interoceptiva<\/div>/g, '<div className="text-[10px] text-emerald-500/60 font-black uppercase tracking-[3px]">{t.subtitle}</div>');

content = content.replace(/>Escáner Guiado<\/div>/g, ">{bodySub.scanBtn}</div>");
content = content.replace(/>Test de Calibración<\/div>/g, ">{bodySub.calBtn}</div>");
content = content.replace(/>¿Qué sientes ahora\?<\/div>/g, ">{bodySub.whatFeelin}</div>");

content = content.replace(/>Traducción de Señal<\/div>/g, ">{t.translationTitle}</div>");
content = content.replace(/>Sugerencia de Protocolo:<\/div>/g, ">{bodySub.protocol}</div>");

content = content.replace(/>INICIAR RESPIRACIÓN \(4-8\)<\/button>/g, ">{bodySub.startBreath}</button>");
content = content.replace(/>INHALA — 4 SEG<\/div>/g, ">{t.breathIn}</div>");
content = content.replace(/>EXHALA — 8 SEG<\/div>/g, ">{t.breathOut}</div>");
content = content.replace(/>Detener guía<\/button>/g, ">{t.stopGuide}</button>");
content = content.replace(/>Analizando señal\.\.\.<\/div>/g, ">{bodySub.analyzing}</div>");

// Remove old hardcoded CALIBRATION_STEPS array
content = content.replace(/const CALIBRATION_STEPS = \[[\s\S]*?\];/m, "");

fs.writeFileSync('src/components/screens/BodyScanner.tsx', content);
