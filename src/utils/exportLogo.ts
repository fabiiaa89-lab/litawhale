export const SVG_LOGO_RAW = `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="whaleBodyGradient" x1="20" y1="40" x2="180" y2="160" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="35%" stop-color="#06b6d4" />
      <stop offset="70%" stop-color="#6366f1" />
      <stop offset="100%" stop-color="#a855f7" />
    </linearGradient>
    <linearGradient id="whaleBellyGradient" x1="40" y1="120" x2="140" y2="160" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#e0f2fe" stop-opacity="0.85" />
      <stop offset="60%" stop-color="#bae6fd" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#c084fc" stop-opacity="0.3" />
    </linearGradient>
    <linearGradient id="spoutGlow" x1="60" y1="10" x2="90" y2="50" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#67e8f9" />
      <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.1" />
    </linearGradient>
    <radialGradient id="auraGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.25" />
      <stop offset="60%" stop-color="#818cf8" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="flipperGradient" x1="70" y1="105" x2="100" y2="145" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0ea5e9" />
      <stop offset="100%" stop-color="#7c3aed" />
    </linearGradient>
  </defs>

  <circle cx="100" cy="100" r="88" fill="url(#auraGlow)" />

  <g opacity="0.8">
    <circle cx="45" cy="45" r="1.5" fill="#a5f3fc" />
    <circle cx="155" cy="55" r="2" fill="#c4b5fd" />
    <circle cx="165" cy="135" r="1.5" fill="#67e8f9" />
    <circle cx="35" cy="130" r="1.5" fill="#e0e7ff" />
    <circle cx="130" cy="30" r="1" fill="#bae6fd" />
    <path d="M45 45L55 35M155 55L165 65" stroke="#38bdf8" stroke-width="0.75" stroke-dasharray="2 2" opacity="0.4" />
  </g>

  <g opacity="0.9">
    <path d="M78 48 C75 32 60 22 48 26 C44 27.5 50 35 60 38 C70 41 74 46 76 50" fill="url(#spoutGlow)" />
    <path d="M82 48 C85 30 102 18 114 22 C118 23.5 110 32 100 36 C90 40 85 45 84 50" fill="url(#spoutGlow)" />
    <circle cx="46" cy="24" r="2.5" fill="#67e8f9" />
    <circle cx="116" cy="20" r="2" fill="#93c5fd" />
    <circle cx="80" cy="16" r="3" fill="#a5f3fc" />
  </g>

  <path d="M148 98 C160 85 178 72 190 76 C186 88 178 98 168 104 C180 108 192 118 190 132 C176 130 162 118 148 108 Z" fill="url(#whaleBodyGradient)" stroke="#38bdf8" stroke-width="1.2" stroke-linejoin="round" />
  <path d="M32 94 C32 66 62 50 96 52 C134 54 158 76 166 98 C158 114 138 126 112 134 C82 142 50 136 38 118 C33 110 32 102 32 94 Z" fill="url(#whaleBodyGradient)" stroke="#7dd3fc" stroke-width="1.5" />
  <path d="M38 108 C48 126 78 135 112 132 C104 138 88 141 72 140 C52 138 40 126 38 108 Z" fill="url(#whaleBellyGradient)" />
  
  <path d="M52 114 C64 125 84 131 104 131" stroke="#e0f2fe" stroke-width="1.2" stroke-linecap="round" opacity="0.6" />
  <path d="M58 120 C70 129 88 133 100 133" stroke="#e0f2fe" stroke-width="1.2" stroke-linecap="round" opacity="0.4" />

  <path d="M74 104 C72 116 78 132 92 144 C96 142 98 134 96 124 C94 114 86 104 74 104 Z" fill="url(#flipperGradient)" stroke="#38bdf8" stroke-width="1.2" />

  <path d="M52 86 Q57 81 62 86" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" />
  <circle cx="57" cy="80" r="1.5" fill="#f8fafc" opacity="0.9" />

  <circle cx="86" cy="74" r="1.8" fill="#e0e7ff" opacity="0.8" />
  <circle cx="108" cy="78" r="1.4" fill="#bae6fd" opacity="0.7" />
  <circle cx="126" cy="86" r="1.6" fill="#c4b5fd" opacity="0.8" />
  <circle cx="142" cy="94" r="1.2" fill="#e0e7ff" opacity="0.6" />

  <path d="M36 98 Q42 102 48 98" stroke="#38bdf8" stroke-width="1.5" stroke-linecap="round" opacity="0.7" />
</svg>`;

export function downloadSvgFile(filename = 'lita-whale-vector.svg') {
  const blob = new Blob([SVG_LOGO_RAW], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadPngFromSvg(
  size = 2048, 
  withDarkBackground = true,
  filename = 'lita-whale-social-hd.png'
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      const svgBlob = new Blob([SVG_LOGO_RAW], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error('Canvas context not available'));
          return;
        }

        // Background
        if (withDarkBackground) {
          // Subtle radial dark gradient
          const bgGrad = ctx.createRadialGradient(size / 2, size / 2, size * 0.1, size / 2, size / 2, size * 0.7);
          bgGrad.addColorStop(0, '#1a182e');
          bgGrad.addColorStop(1, '#0e0c18');
          ctx.fillStyle = bgGrad;
          ctx.fillRect(0, 0, size, size);
        } else {
          ctx.clearRect(0, 0, size, size);
        }

        // Draw image in canvas
        const padding = size * 0.08;
        const drawSize = size - padding * 2;
        ctx.drawImage(img, padding, padding, drawSize, drawSize);

        canvas.toBlob((blob) => {
          if (blob) {
            const pngUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = pngUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(pngUrl);
          }
          URL.revokeObjectURL(url);
          resolve();
        }, 'image/png');
      };

      img.onerror = (err) => {
        URL.revokeObjectURL(url);
        reject(err);
      };

      img.src = url;
    } catch (e) {
      reject(e);
    }
  });
}
