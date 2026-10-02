import { Language } from '../types';

export interface HelplineInfo {
  number: string;
  name: string;
  country: string;
}

// Map country codes/names to emergency crisis helpline numbers
export function getHelplineByCountry(countryStr?: string, lang: Language = 'es'): HelplineInfo {
  const isSpanish = lang === 'es';
  const c = (countryStr || '').toLowerCase().trim();

  if (c.includes('españa') || c.includes('spain') || c === 'es') {
    return { number: '024', name: isSpanish ? 'Línea de Atención a la Conducta Suicida (España)' : 'Suicide Behavior Helpline (Spain)', country: 'España' };
  }
  if (c.includes('méxico') || c.includes('mexico') || c === 'mx') {
    return { number: '800 911 2000', name: isSpanish ? 'Línea de la Vida (México)' : 'Lifeline (Mexico)', country: 'México' };
  }
  if (c.includes('colombia') || c === 'co') {
    return { number: '106', name: isSpanish ? 'Línea 106 de Ayuda Emocional (Colombia)' : 'Line 106 Emotional Support (Colombia)', country: 'Colombia' };
  }
  if (c.includes('argentina') || c === 'ar') {
    return { number: '135', name: isSpanish ? 'Centro de Asistencia al Suicida (Argentina)' : 'Suicide Assistance Center (Argentina)', country: 'Argentina' };
  }
  if (c.includes('chile') || c === 'cl') {
    return { number: '*4141', name: isSpanish ? 'Línea No Estás Solo (*4141 Chile)' : 'You Are Not Alone Helpline (Chile)', country: 'Chile' };
  }
  if (c.includes('perú') || c.includes('peru') || c === 'pe') {
    return { number: '113', name: isSpanish ? 'Línea 113 Opción 5 (Perú)' : 'Line 113 Option 5 (Peru)', country: 'Perú' };
  }
  if (c.includes('venezuela') || c === 've') {
    return { number: '0800-4243638', name: isSpanish ? 'Línea de Atención de Salud Mental (Venezuela)' : 'Mental Health Helpline (Venezuela)', country: 'Venezuela' };
  }
  if (c.includes('ecuador') || c === 'ec') {
    return { number: '171', name: isSpanish ? 'Línea 171 Opción 6 (Ecuador)' : 'Line 171 Option 6 (Ecuador)', country: 'Ecuador' };
  }
  if (c.includes('uruguay') || c === 'uy') {
    return { number: '*0767', name: isSpanish ? 'Línea de Prevención del Suicidio (*0767 Uruguay)' : 'Suicide Prevention Line (Uruguay)', country: 'Uruguay' };
  }
  if (c.includes('estados unidos') || c.includes('united states') || c.includes('usa') || c === 'us') {
    return { number: '988', name: '988 Suicide & Crisis Lifeline (USA)', country: 'United States' };
  }
  if (c.includes('reino unido') || c.includes('united kingdom') || c.includes('uk') || c === 'gb') {
    return { number: '111', name: 'NHS Mental Health Crisis Line (UK)', country: 'United Kingdom' };
  }
  if (c.includes('alemania') || c.includes('germany') || c === 'de') {
    return { number: '0800 111 0 111', name: 'TelefonSeelsorge (Deutschland)', country: 'Deutschland' };
  }

  // Default international fallback
  return isSpanish
    ? { number: '911 / 112', name: 'Línea de Emergencia y Crisis General', country: 'Internacional' }
    : { number: '988 / 911', name: 'Emergency & Crisis Support Lifeline', country: 'International' };
}

// Fetch user country by HTML5 Geolocation API with Nominatim reverse geocoding
export async function detectCountryByGPS(): Promise<string | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=3`,
            { headers: { 'Accept-Language': 'es' } }
          );
          if (res.ok) {
            const data = await res.json();
            const countryName = data.address?.country || data.display_name;
            if (countryName) {
              resolve(countryName);
              return;
            }
          }
        } catch (e) {
          console.warn('GPS country detection fetch failed:', e);
        }
        resolve(null);
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        resolve(null);
      },
      { timeout: 8000 }
    );
  });
}

// WhatsApp link generator with real-time location link and text message
export function buildWhatsAppEmergencyUrl(phone: string, lat?: number, lng?: number, address?: string, lang: Language = 'es'): string {
  // Clean phone number (keep only digits)
  const cleanedPhone = phone.replace(/[^0-9]/g, '');

  let text = '';
  if (lang === 'es') {
    text = `🚨 ¡S.O.S! Necesito ayuda urgente.`;
    if (lat && lng) {
      text += ` Mi ubicación actual en tiempo real es: https://maps.google.com/?q=${lat},${lng}`;
      if (address) {
        text += ` (${address})`;
      }
    }
    text += ` Por favor abre este enlace para ver dónde estoy o contáctame de inmediato.`;
  } else {
    text = `🚨 SOS! I need urgent help.`;
    if (lat && lng) {
      text += ` My current real-time location is: https://maps.google.com/?q=${lat},${lng}`;
      if (address) {
        text += ` (${address})`;
      }
    }
    text += ` Please open this link or contact me immediately.`;
  }

  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanedPhone}?text=${encodedText}`;
}
