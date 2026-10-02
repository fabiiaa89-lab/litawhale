const fs = require('fs');

let gemini = fs.readFileSync('src/services/geminiService.ts', 'utf8');

// askNeuralCortex
gemini = gemini.replace(
  "export async function askNeuralCortex(prompt: string, profile: Profile) {",
  "export async function askNeuralCortex(prompt: string, profile: Profile, language: string = 'es') {"
);

gemini = gemini.replace(
  "if (!genAI) return \"Sistema de IA no configurado.\";",
  "if (!genAI) return language === 'es' ? 'Sistema de IA no configurado.' : 'AI System not configured.';"
);

gemini = gemini.replace(
  "Actúa como un regulador lógico para una persona autista",
  "Actúa como un regulador lógico para una persona autista (responde en el idioma: ${language === 'es' ? 'Español' : 'English'})."
);

gemini = gemini.replace(
  "return \"Error en la conexión con el Córtex Externo.\";",
  "return language === 'es' ? 'Error en la conexión con el Córtex Externo.' : 'Error connecting to External Cortex.';"
);

// getCompanionMessage
gemini = gemini.replace(
  "export async function getCompanionMessage(entity: string): Promise<string> {",
  "export async function getCompanionMessage(entity: string, language: string = 'es'): Promise<string> {"
);

gemini = gemini.replace(
  "if (!genAI) return \"Modo offline. Tu compañero está aquí contigo en silencio.\";",
  "if (!genAI) return language === 'es' ? 'Modo offline. Tu compañero está aquí contigo en silencio.' : 'Offline mode. Your companion is here with you in silence.';"
);

gemini = gemini.replace(
  "El usuario (que es autista) está en riesgo",
  "El usuario (que es autista) está en riesgo (responde en el idioma: ${language === 'es' ? 'Español' : 'English'})."
);

gemini = gemini.replace(
  "return \"El compañero está en silencio, cuidándote atentamente.\";",
  "return language === 'es' ? 'El compañero está en silencio, cuidándote atentamente.' : 'The companion is silent, watching over you carefully.';"
);

fs.writeFileSync('src/services/geminiService.ts', gemini);
console.log('Gemini service updated');
