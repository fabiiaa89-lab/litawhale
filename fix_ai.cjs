const fs = require('fs');
let ai = fs.readFileSync('src/components/screens/NeuralCortex.tsx', 'utf8');

ai = ai.replace(
  "interface NeuralCortexProps {\n  profile: Profile;", 
  "interface NeuralCortexProps {\n  profile: Profile;\n  language: Language;"
);
ai = ai.replace(
  "export default function NeuralCortex({ profile, onBack }: NeuralCortexProps) {", 
  "import { i18n } from '../../i18n';\nexport default function NeuralCortex({ profile, language, onBack }: NeuralCortexProps) {\n  const t = i18n[language].ai;"
);
ai = ai.replace(/<Header title="CÓRTEX NEURAL" onBack=\{onBack\} titleColor="#818cf8" \/>/g, '<Header title={t.title} onBack={onBack} titleColor="#818cf8" />');
ai = ai.replace(/Interconecta sistemas de salud y contexto para sugerir estrategias\./g, '{t.desc}');
ai = ai.replace(/Estado/g, '{t.status}');
ai = ai.replace(/Sistemas nominales/g, '{t.sysOk}');
ai = ai.replace(/askNeuralCortex\(userMsg, profile\)/g, 'askNeuralCortex(userMsg, profile, language)');

fs.writeFileSync('src/components/screens/NeuralCortex.tsx', ai);
