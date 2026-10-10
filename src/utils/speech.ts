/**
 * Latin American Spanish prioritized speech synthesis utility.
 * Grounded in neurodivergent AAC communication needs.
 */

export function getLatinAmericanVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // 1. Highest priority: exact es-419 (Latin America) or specific LatAm country codes
  const latamExact = voices.find(v => {
    const lang = (v.lang || '').toLowerCase();
    return (
      lang === 'es-419' ||
      lang.startsWith('es-mx') || // Mexico
      lang.startsWith('es-us') || // US Hispanic
      lang.startsWith('es-ar') || // Argentina
      lang.startsWith('es-co') || // Colombia
      lang.startsWith('es-cl') || // Chile
      lang.startsWith('es-pe') || // Peru
      lang.startsWith('es-cr') || // Costa Rica
      lang.startsWith('es-uy') || // Uruguay
      lang.startsWith('es-ve')    // Venezuela
    );
  });
  if (latamExact) return latamExact;

  // 2. Named Latin American neural/local voices across OSes (Android, iOS, Windows, macOS, ChromeOS)
  const latamNamed = voices.find(v => {
    const name = (v.name || '').toLowerCase();
    const lang = (v.lang || '').toLowerCase();
    const isSpanish = lang.startsWith('es');
    return (
      isSpanish &&
      (name.includes('mexic') ||
        name.includes('latino') ||
        name.includes('latin') ||
        name.includes('colombia') ||
        name.includes('argentina') ||
        name.includes('paulina') ||
        name.includes('sabina') ||
        name.includes('diego') ||
        name.includes('jorge') ||
        name.includes('carlos') ||
        name.includes('gonzalo') ||
        name.includes('soledad') ||
        name.includes('mia') ||
        name.includes('raul'))
    );
  });
  if (latamNamed) return latamNamed;

  // 3. Fallback: Any Spanish voice that is NOT explicitly Spain (es-ES)
  const anyNonSpainEs = voices.find(v => {
    const lang = (v.lang || '').toLowerCase();
    return lang.startsWith('es') && !lang.includes('es-es');
  });
  if (anyNonSpainEs) return anyNonSpainEs;

  // 4. Fallback to any available Spanish voice
  return voices.find(v => (v.lang || '').toLowerCase().startsWith('es')) || null;
}

export function speakLatinAmericanText(
  text: string, 
  language: 'es' | 'en' = 'es',
  callbacks?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: () => void;
  }
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    callbacks?.onError?.();
    return;
  }

  try {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92;
    utterance.pitch = 1.0;

    const executeSpeak = () => {
      if (language === 'es') {
        utterance.lang = 'es-419'; // Standard BCP-47 for Latin America
        const latamVoice = getLatinAmericanVoice();
        if (latamVoice) {
          utterance.voice = latamVoice;
          utterance.lang = latamVoice.lang || 'es-419';
        }
      } else {
        utterance.lang = 'en-US';
      }

      if (callbacks?.onStart) utterance.onstart = callbacks.onStart;
      if (callbacks?.onEnd) utterance.onend = callbacks.onEnd;
      if (callbacks?.onError) utterance.onerror = callbacks.onError;

      window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        executeSpeak();
      };
      // Timeout fallback in case voiceschanged does not trigger
      setTimeout(() => {
        if (!window.speechSynthesis.speaking) {
          executeSpeak();
        }
      }, 150);
    } else {
      executeSpeak();
    }
  } catch (err) {
    console.warn('Speech synthesis error:', err);
    callbacks?.onError?.();
  }
}
