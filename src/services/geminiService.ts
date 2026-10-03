/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Profile } from "../types";

// La inicialización del SDK ya no es necesaria en el cliente.
// Mantenemos la función vacía para no romper otras partes de la app que la llamen.
export function initGemini() {
  return;
}

const RISK_WORDS = /suicid|matarme|quitarme la vida|no quiero vivir|hacerme da(ñ|n)o|autolesi|kill myself|end my life|want to die|self.?harm/i;

export async function askNeuralCortex(prompt: string, profile: Profile, language: string = 'es') {
  // Revisión local, sin depender de la IA: ante riesgo, se dirige a la ayuda real
  if (RISK_WORDS.test(prompt)) {
    return language === 'es'
      ? 'Lo que cuentas es importante. Abre el botón de Crisis para ver la línea de ayuda de tu país o llama ahora a tu contacto de emergencia. No estás solo/a.'
      : 'What you share matters. Open the Crisis button to see your local helpline, or call your emergency contact now. You are not alone.';
  }

  // Construimos el contexto que antes era el systemInstruction
  const systemContext = `Actúa como un regulador lógico para una persona autista (responde en el idioma: ${language === 'es' ? 'Español' : 'English'}). Tus respuestas deben ser directas, basadas en hechos y evitar el consuelo emocional vacío. Usa los datos del perfil del usuario (sensibilidad, intereses) para personalizar cada instrucción. Si el usuario está en crisis (Nivel 1 o 2), prioriza la seguridad física y el mutismo. Si el usuario habla de deudas, recuérdale que es dinero del futuro y ayúdale a planificar el pago sin culpa.

CONTEXTO DEL USUARIO:
- Intereses: ${profile.interests || 'No especificados'}
- Hipersensibilidades: ${profile.hypersensitivities || 'No especificadas'}
- Hiposensibilidades: ${profile.hyposensitivities || 'No especificadas'}
- Disparadores: ${profile.triggers || 'No especificados'}
- Comida segura: ${profile.safeFood || 'No especificada'}
- Modo Sensorial actual: ${profile.sensitivity}`;

  // Unimos el contexto y el prompt del usuario
  const fullPrompt = `${systemContext}\n\nACCION O PREGUNTA DEL USUARIO:\n${prompt}`;

  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: fullPrompt })
    });

    if (!response.ok) throw new Error('Proxy falló');
    
    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return language === 'es'
        ? 'No pude generar una respuesta. Si estás en crisis, abre el botón de Crisis o llama a tu contacto de emergencia o a tu línea de ayuda local.'
        : 'I could not generate a reply. If you are in crisis, open the Crisis button or call your emergency contact or local helpline.';
    }
    return text;
  } catch (error) {
    console.error("Cortex Proxy Error:", error);
    return language === 'es' ? 'Error en la conexión con el Córtex Externo.' : 'Error connecting to External Cortex.';
  }
}

export async function getCompanionMessage(entity: string, language: string = 'es'): Promise<string> {
  const fullPrompt = `El usuario (que es autista) está en riesgo (responde en el idioma: ${language === 'es' ? 'Español' : 'English'}). de sobrecarga sensorial o laboral y necesita regulación. Su animal, objeto o ser de apoyo es "${entity}". Escribe estrictamente 2 oraciones muy descriptivas (usando segunda persona) describiendo una acción física específica que realiza este ser/objeto para transmitirle calma profunda, seguridad y empatía sin palabras. Lenguaje directo, seguro, compasivo y sensorialmente agradable.`;
  
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: fullPrompt })
    });

    if (!response.ok) throw new Error('Proxy falló');

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return language === 'es'
        ? 'No pude generar una respuesta. Si estás en crisis, abre el botón de Crisis o llama a tu contacto de emergencia o a tu línea de ayuda local.'
        : 'I could not generate a reply. If you are in crisis, open the Crisis button or call your emergency contact or local helpline.';
    }
    return text;
  } catch (error) {
    console.error("Cortex Proxy Error:", error);
    return language === 'es' ? 'El compañero está en silencio, cuidándote atentamente.' : 'The companion is silent, watching over you carefully.';
  }
}
