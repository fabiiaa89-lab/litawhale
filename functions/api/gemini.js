export async function onRequestPost(context) {
  try {
    const { prompt } = await context.request.json();
    
    // Cloudflare extrae la API Key de sus variables de entorno seguras
    const apiKey = context.env.GEMINI_API_KEY;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Fallo en el servidor proxy' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}