/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { Profile } from "../types";

let genAI: GoogleGenerativeAI | null = null;

export function initGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY not found in environment");
    return;
  }
  genAI = new GoogleGenerativeAI(apiKey);
}

export async function askNeuralCortex(prompt: string, profile: Profile, language: string = 'es') {
  if (!genAI) initGemini();
  if (!genAI) return language === 'es' ? 'Sistema de IA no configurado.' : 'AI System not configured.';

  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: `Actúa como un regulador lógico para una persona autista (responde en el idioma: ${language === 'es' ? 'Español' : 'English'}). (${profile.name || 'el usuario'}). Tus respuestas deben ser directas, basadas en hechos y evitar el consuelo emocional vacío. Usa los datos del perfil del usuario (sangre, sensibilidad, intereses, documentos) para personalizar cada instrucción. Si el usuario está en crisis (Nivel 1 o 2), prioriza la seguridad física y el mutismo. Si el usuario habla de deudas, recuérdale que es dinero del futuro y ayúdale a planificar el pago sin culpa.

CONTEXTO DEL USUARIO:
- Tipo de Sangre: ${profile.bloodType || 'No especificado'}
- Alergias: ${profile.allergies || 'No especificadas'}
- Intereses: ${profile.interests || 'No especificados'}
- Hipersensibilidades: ${profile.hypersensitivities || 'No especificadas'}
- Hiposensibilidades: ${profile.hyposensitivities || 'No especificadas'}
- Disparadores: ${profile.triggers || 'No especificados'}
- Comida segura: ${profile.safeFood || 'No especificada'}
- Modo Sensorial actual: ${profile.sensitivity}`
  });

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return language === 'es' ? 'Error en la conexión con el Córtex Externo.' : 'Error connecting to External Cortex.';
  }
}

export async function getCompanionMessage(entity: string, language: string = 'es'): Promise<string> {
  if (!genAI) initGemini();
  if (!genAI) return language === 'es' ? 'Modo offline. Tu compañero está aquí contigo en silencio.' : 'Offline mode. Your companion is here with you in silence.';

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `El usuario (que es autista) está en riesgo (responde en el idioma: ${language === 'es' ? 'Español' : 'English'}). de sobrecarga sensorial o laboral y necesita regulación. Su animal, objeto o ser de apoyo es "${entity}". Escribe estrictamente 2 oraciones muy descriptivas (usando segunda persona) describiendo una acción física específica que realiza este ser/objeto para transmitirle calma profunda, seguridad y empatía sin palabras. Lenguaje directo, seguro, compasivo y sensorialmente agradable.`;
  
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return language === 'es' ? 'El compañero está en silencio, cuidándote atentamente.' : 'The companion is silent, watching over you carefully.';
  }
}
