const fs = require('fs');

let i18n = fs.readFileSync('src/i18n.ts', 'utf8');

if (!i18n.includes('symptoms: [')) {
  const esConst = `
    symptoms: [
      { id: 'hands', icon: '🤲', label: 'Te tiemblan las manos', translation: 'Activación del sistema nervioso autónomo (temblor)', protocol: 'Protocolo: Presión profunda en las manos. Entrelaza los dedos y aprieta durante 30 segundos.' },
      { id: 'chest', icon: '🫁', label: 'Pecho apretado', translation: 'Hiperactivación vagal o sobrecarga de procesamiento sensorial.', protocol: 'Protocolo: Postura de expansión — pon las manos en la nuca, empuja los codos hacia atrás. Sostén 20 segundos.' },
      { id: 'dry', icon: '💧', label: 'Boca seca', translation: 'Deshidratación o respuesta de estrés (cortisol elevado).', protocol: 'Protocolo: Bebe agua ahora. Después: 15 minutos de silencio.' },
      { id: 'noise', icon: '🔊', label: 'Ruido molesta más', translation: 'Umbral sensorial bajo. Hipervigilancia auditiva activa.', protocol: 'Protocolo: Auriculares o tapones inmediatamente. Reduce fuentes de sonido en el entorno.' },
      { id: 'dizzy', icon: '🌀', label: 'Mareo / flotación', translation: 'Posible disociación leve o fluctuación de presión arterial.', protocol: 'Protocolo: Pon los pies planos en el suelo. Presiona el suelo con los talones. Nombra 3 objetos que ves.' },
      { id: 'heavy', icon: '🧱', label: 'Cuerpo pesado', translation: 'Fatiga del sistema nervioso. Burnout físico.', protocol: 'Protocolo: Prioridad mínima. Solo lo esencial. El cabello sucio no es una falla — es ahorro de batería.' },
      { id: 'nausea', icon: '🤢', label: 'Náusea', translation: 'Respuesta gastrointestinal al estrés. Eje intestino-cerebro activado.', protocol: 'Protocolo: Posición horizontal si es posible. Agua fría. No comer hasta que pase.' },
      { id: 'cold', icon: '🥶', label: 'Frío interno / entumecimiento', translation: 'Respuesta vasovagal o disociación somatosensorial.', protocol: 'Protocolo: Calor en las extremidades (manos bajo agua tibia). Cobija o manta de peso si está disponible.' },
      { id: 'heart', icon: '💓', label: 'Corazón acelerado', translation: 'Taquicardia por activación simpática. Es una respuesta, no un peligro cardíaco.', protocol: 'Protocolo: Vibración latido. Exhala más largo que inhala: 4 seg entrada, 8 seg salida.' },
      { id: 'dissoc', icon: '🌫️', label: 'No reconozco mi entorno', translation: 'Disociación activa. El cerebro está en modo de protección.', protocol: 'Protocolo de emergencia: Ve al módulo de Anclaje ahora. Usa el protocolo de choque térmico.' }
    ],
    aacCards: [
      { id: 'dissoc', icon: '🌫️', label: 'Disociación / Agnosia', text: 'No reconozco quién eres ahora mismo.\\n\\nEs una respuesta neurológica temporal. Por favor, mantén la calma y dame espacio.' },
      { id: 'noverbal', icon: '🔇', label: 'No verbal', text: 'He perdido la capacidad de hablar en este momento.\\n\\nPuedo entenderte, pero para responder necesito usar esta pantalla o tiempo solo.' },
      { id: 'meltdown', icon: '🤚', label: 'Meltdown Inminente', text: 'Mi sistema está entrando en crisis sensorial.\\n\\nApaga luces, reduce ruido y no me toques. Necesito aislamiento inmediato.' },
      { id: 'slow', icon: '⏳', label: 'Procesamiento lento', text: 'Necesito más tiempo para procesar lo que me estás diciendo.\\n\\nPor favor, usa frases cortas y espera 10 segundos antes de repetir.' },
      { id: 'med', icon: '🏥', label: 'Ayuda médica requerida', text: 'Necesito asistencia médica profesional.\\n\\nNo es un ataque de pánico común, es una crisis neurológica aguda.' }
    ],
    calibrationSteps: [
      { id: 1, question: 'Cierra los ojos. Aprieta las manos. ¿Sientes tensión?', key: 'tension' },
      { id: 2, question: '¿Sientes tu corazón rápido?', key: 'heart' },
      { id: 3, question: '¿Sientes que el ruido de afuera te duele?', key: 'noise' }
    ],
    calResult: {
      tension: 'Necesitas liberar tensión muscular de inmediato.',
      heart: 'Inicia el ejercicio de respiración inferior.',
      noise: 'Aíslate. Busca tus auriculares o ve al Modo Cueva.',
      none: 'Estado base. No se detectan anomalías graves.'
    },
    bodySub: {
        scanBtn: 'Escáner Guiado',
        calBtn: 'Test de Calibración',
        whatFeelin: '¿Qué sientes ahora?',
        analyzing: 'Analizando señal...',
        protocol: 'Sugerencia de Protocolo:',
        startBreath: 'INICIAR RESPIRACIÓN (4-8)',
    },
`;

  const enConst = `
    symptoms: [
      { id: 'hands', icon: '🤲', label: 'Shaking hands', translation: 'Autonomic nervous system activation (tremor)', protocol: 'Protocol: Deep pressure on hands. Interlock fingers and squeeze for 30 seconds.' },
      { id: 'chest', icon: '🫁', label: 'Tight chest', translation: 'Vagal hyperactivation or sensory processing overload.', protocol: 'Protocol: Expansion posture — place hands on back of neck, push elbows back. Hold 20 seconds.' },
      { id: 'dry', icon: '💧', label: 'Dry mouth', translation: 'Dehydration or stress response (elevated cortisol).', protocol: 'Protocol: Drink water now. Then: 15 minutes of silence.' },
      { id: 'noise', icon: '🔊', label: 'Noise is painful', translation: 'Low sensory threshold. Active auditory hypervigilance.', protocol: 'Protocol: Headphones or earplugs immediately. Reduce sound sources in environment.' },
      { id: 'dizzy', icon: '🌀', label: 'Dizziness / floating', translation: 'Possible mild dissociation or blood pressure fluctuation.', protocol: 'Protocol: Put feet flat on the floor. Press floor with heels. Name 3 objects you see.' },
      { id: 'heavy', icon: '🧱', label: 'Heavy body', translation: 'Nervous system fatigue. Physical burnout.', protocol: 'Protocol: Minimum priority. Only the essential. Unwashed hair is not a failure — it is battery saving.' },
      { id: 'nausea', icon: '🤢', label: 'Nausea', translation: 'Gastrointestinal stress response. Gut-brain axis activated.', protocol: 'Protocol: Horizontal position if possible. Cold water. Do not eat until it passes.' },
      { id: 'cold', icon: '🥶', label: 'Internal cold / numbness', translation: 'Vasovagal response or somatosensory dissociation.', protocol: 'Protocol: Heat on extremities (hands under warm water). Weighted blanket if available.' },
      { id: 'heart', icon: '💓', label: 'Fast heartbeat', translation: 'Tachycardia from sympathetic activation. It is a response, not a cardiac danger.', protocol: 'Protocol: Heartbeat vibration. Exhale longer than inhale: 4 sec in, 8 sec out.' },
      { id: 'dissoc', icon: '🌫️', label: 'I do not recognize surroundings', translation: 'Active dissociation. The brain is in protection mode.', protocol: 'Emergency Protocol: Go to Anchor module now. Use thermal shock protocol.' }
    ],
    aacCards: [
      { id: 'dissoc', icon: '🌫️', label: 'Dissociation / Agnosia', text: 'I do not recognize who you are right now.\\n\\nIt is a temporary neurological response. Please stay calm and give me space.' },
      { id: 'noverbal', icon: '🔇', label: 'Non-verbal', text: 'I have lost the ability to speak right now.\\n\\nI can understand you, but to respond I need to use this screen or have time alone.' },
      { id: 'meltdown', icon: '🤚', label: 'Imminent Meltdown', text: 'My system is entering a sensory crisis.\\n\\nTurn off lights, reduce noise and do not touch me. I need immediate isolation.' },
      { id: 'slow', icon: '⏳', label: 'Slow processing', text: 'I need more time to process what you are telling me.\\n\\nPlease use short sentences and wait 10 seconds before repeating.' },
      { id: 'med', icon: '🏥', label: 'Medical help required', text: 'I need professional medical assistance.\\n\\nThis is not a common panic attack, it is an acute neurological crisis.' }
    ],
    calibrationSteps: [
      { id: 1, question: 'Close your eyes. Squeeze your hands. Do you feel tension?', key: 'tension' },
      { id: 2, question: 'Do you feel your heart racing?', key: 'heart' },
      { id: 3, question: 'Does the outside noise hurt?', key: 'noise' }
    ],
    calResult: {
      tension: 'You need to release muscle tension immediately.',
      heart: 'Start the lower breathing exercise.',
      noise: 'Isolate. Find your headphones or go to Cave Mode.',
      none: 'Base state. No severe anomalies detected.'
    },
    bodySub: {
        scanBtn: 'Guided Scan',
        calBtn: 'Calibration Test',
        whatFeelin: 'What are you feeling right now?',
        analyzing: 'Analyzing signal...',
        protocol: 'Protocol Suggestion:',
        startBreath: 'START BREATHING (4-8)',
    },
`;

  i18n = i18n.replace(/body: \{[\s\S]*?stopGuide: 'Detener guía',\s*\},/, match => match + '\n' + esConst);
  i18n = i18n.replace(/body: \{[\s\S]*?stopGuide: 'Stop guide',\s*\},/, match => match + '\n' + enConst);

  fs.writeFileSync('src/i18n.ts', i18n);
  console.log('Added constants to i18n.ts');
}
