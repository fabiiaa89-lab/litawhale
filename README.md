# Lita Whale

PWA de apoyo sensorial para adultos autistas. React + Vite, desplegada en Cloudflare Workers.

## Desarrollo

    bun install
    bun run dev

## Despliegue

Cloudflare construye desde `main` (`bun run build` y `npx wrangler deploy`).
El Worker (`worker/index.js`) atiende `/api/gemini`. La clave de Gemini va SOLO como
secreto del Worker (`GEMINI_API_KEY`, en Settings > Variables and Secrets), nunca en el codigo.
