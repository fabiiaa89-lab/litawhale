// Worker de Lita Whale: reemplaza a functions/api/gemini.js (formato Pages)
// Ruta: POST /api/gemini  ->  proxy hacia Gemini con la clave guardada como secreto.

const MAX_BODY_CHARS = 32 * 1024; // tamaño máximo del cuerpo de la petición
const MAX_PROMPT_CHARS = 12000;   // largo máximo del prompt (el perfil sensorial va dentro)
const DEFAULT_MODEL = 'gemini-2.5-flash'; // usa el MISMO modelo que tenías en la línea 8 de gemini.js

// Reglas de seguridad fijas en el servidor (el navegador no puede alterarlas)
const SAFETY_INSTRUCTION = `Eres un apoyo de regulación para una persona autista. No des diagnósticos ni cambies dosis de medicamentos. Si la persona menciona ideas de hacerse daño o de suicidio, responde con calma, pídele que contacte a su persona de confianza o a la línea de ayuda de su país, y no des detalles de métodos.`;

const json = (body, status = 200, extraHeaders = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      ...extraHeaders,
    },
  });

async function handleGemini(request, env) {
  const url = new URL(request.url);

  if (request.method !== 'POST') {
    return json({ error: 'Método no permitido' }, 405, { Allow: 'POST' });
  }

  // Bloquea llamadas desde otros sitios web (no detiene clientes que no son navegadores).
  const origin = request.headers.get('Origin');
  if (origin && origin !== url.origin) {
    return json({ error: 'Origen no permitido' }, 403);
  }

  if (!env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY no está configurada como secreto');
    return json({ error: 'Servicio no disponible' }, 503);
  }

  // Límite de solicitudes por IP (binding GEMINI_LIMITER definido en wrangler.jsonc)
  if (env.GEMINI_LIMITER) {
    const ip = request.headers.get('CF-Connecting-IP') || 'desconocida';
    const { success } = await env.GEMINI_LIMITER.limit({ key: ip });
    if (!success) {
      return json(
        { error: 'Demasiadas solicitudes. Intenta de nuevo en un minuto.' },
        429,
        { 'Retry-After': '60' }
      );
    }
  }

  // Lectura y validación del cuerpo
  const raw = await request.text();
  if (raw.length > MAX_BODY_CHARS) {
    return json({ error: 'Solicitud demasiado grande' }, 413);
  }

  let prompt;
  try {
    ({ prompt } = JSON.parse(raw));
  } catch {
    return json({ error: 'JSON inválido' }, 400);
  }

  if (typeof prompt !== 'string' || !prompt.trim()) {
    return json({ error: 'Falta el campo "prompt"' }, 400);
  }
  if (prompt.length > MAX_PROMPT_CHARS) {
    return json({ error: 'El prompt es demasiado largo' }, 413);
  }

  // Llamada a Gemini. La clave va en un header, no en la URL.
  const model = env.GEMINI_MODEL || DEFAULT_MODEL;
  try {
    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SAFETY_INSTRUCTION }] },
          contents: [{ parts: [{ text: prompt }] }],
        }),
        signal: AbortSignal.timeout(25000),
      }
    );

    if (!upstream.ok) {
      // Solo se registra el código de estado, nunca el contenido del usuario.
      console.error('Gemini respondió con estado', upstream.status);
      return json(
        { error: 'El servicio de IA no pudo responder' },
        upstream.status === 429 ? 429 : 502
      );
    }

    // Misma forma de respuesta que antes, para no romper el cliente.
    const data = await upstream.json();
    return json(data);
  } catch (error) {
    console.error('Error llamando a Gemini:', error?.name);
    return json({ error: 'Fallo en el servidor proxy' }, 502);
  }
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/gemini') return handleGemini(request, env);
    return json({ error: 'No encontrado' }, 404);
  },
};
