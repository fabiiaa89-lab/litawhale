/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Symptom, AACCard } from './types';

export const SYMPTOMS: Symptom[] = [
  { 
    id: 'hands', 
    icon: '🤲', 
    label: 'Te tiemblan las manos', 
    translation: 'Activación del sistema nervioso autónomo (temblor)', 
    protocol: 'Protocolo: Presión profunda en las manos. Entrelaza los dedos y aprieta durante 30 segundos.' 
  },
  { 
    id: 'chest', 
    icon: '🫁', 
    label: 'Pecho apretado', 
    translation: 'Hiperactivación vagal o sobrecarga de procesamiento sensorial.', 
    protocol: 'Protocolo: Postura de expansión — pon las manos en la nuca, empuja los codos hacia atrás. Sostén 20 segundos.' 
  },
  { 
    id: 'dry', 
    icon: '💧', 
    label: 'Boca seca', 
    translation: 'Deshidratación o respuesta de estrés (cortisol elevado).', 
    protocol: 'Protocolo: Bebe agua ahora. Después: 15 minutos de silencio.' 
  },
  { 
    id: 'noise', 
    icon: '🔊', 
    label: 'Ruido molesta más', 
    translation: 'Umbral sensorial bajo. Hipervigilancia auditiva activa.', 
    protocol: 'Protocolo: Auriculares o tapones inmediatamente. Reduce fuentes de sonido en el entorno.' 
  },
  { 
    id: 'dizzy', 
    icon: '🌀', 
    label: 'Mareo / flotación', 
    translation: 'Posible disociación leve o fluctuación de presión arterial.', 
    protocol: 'Protocolo: Pon los pies planos en el suelo. Presiona el suelo con los talones. Nombra 3 objetos que ves.' 
  },
  { 
    id: 'heavy', 
    icon: '🧱', 
    label: 'Cuerpo pesado', 
    translation: 'Fatiga del sistema nervioso. Burnout físico.', 
    protocol: 'Protocolo: Prioridad mínima. Solo lo esencial. El cabello sucio no es una falla — es ahorro de batería.' 
  },
  { 
    id: 'nausea', 
    icon: '🤢', 
    label: 'Náusea', 
    translation: 'Respuesta gastrointestinal al estrés. Eje intestino-cerebro activado.', 
    protocol: 'Protocolo: Posición horizontal si es posible. Agua fría. No comer hasta que pase.' 
  },
  { 
    id: 'cold', 
    icon: '🥶', 
    label: 'Frío interno / entumecimiento', 
    translation: 'Respuesta vasovagal o disociación somatosensorial.', 
    protocol: 'Protocolo: Calor en las extremidades (manos bajo agua tibia). Cobija o manta de peso si está disponible.' 
  },
  { 
    id: 'heart', 
    icon: '💓', 
    label: 'Corazón acelerado', 
    translation: 'Taquicardia por activación simpática. Es una respuesta, no un peligro cardíaco.', 
    protocol: 'Protocolo: Vibración latido. Exhala más largo que inhala: 4 seg entrada, 8 seg salida.' 
  },
  { 
    id: 'dissoc', 
    icon: '🌫️', 
    label: 'No reconozco mi entorno', 
    translation: 'Disociación activa. El cerebro está en modo de protección.', 
    protocol: 'Protocolo de emergencia: Ve al módulo de Anclaje ahora. Usa el protocolo de choque térmico.' 
  },
];

export const AAC_CARDS: AACCard[] = [
  { id: 'card-dissoc', icon: '🌫️', label: 'Disociación / Agnosia', text: 'No reconozco quién eres ahora mismo.\n\nEs una respuesta neurológica temporal. Por favor, mantén la calma y dame espacio.' },
  { id: 'card-noverbal', icon: '🔇', label: 'No verbal', text: 'He perdido la capacidad de hablar en este momento.\n\nPuedo entenderte, pero para responder necesito usar esta pantalla o tiempo solo.' },
  { id: 'card-meltdown', icon: '🤚', label: 'Meltdown Inminente', text: 'Mi sistema está entrando en crisis sensorial.\n\nApaga luces, reduce ruido y no me toques. Necesito aislamiento inmediato.' },
  { id: 'card-slow', icon: '⏳', label: 'Procesamiento lento', text: 'Necesito más tiempo para procesar lo que me estás diciendo.\n\nPor favor, usa frases cortas y espera 10 segundos antes de repetir.' },
  { id: 'card-med', icon: '🏥', label: 'Ayuda médica requerida', text: 'Necesito asistencia médica profesional.\n\nNo es un ataque de pánico común, es una crisis neurológica aguda.' },
];
