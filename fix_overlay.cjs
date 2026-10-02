const fs = require('fs');
let file = fs.readFileSync('src/components/FullCardOverlay.tsx', 'utf8');

file = file.replace(/import { AACCard } from '\.\.\/types';/, "import { AACCard, Language } from '../types';\nimport { i18n } from '../i18n';");

file = file.replace(/interface FullCardOverlayProps \{/, "interface FullCardOverlayProps {\n  language: Language;");

file = file.replace(/export default function FullCardOverlay\(\{ card, onClose \}: FullCardOverlayProps\) \{/, "export default function FullCardOverlay({ card, language, onClose }: FullCardOverlayProps) {\n  const t = i18n[language].cards;");

// Fix text styling to not be so large and not cover the close button
file = file.replace(/className="flex flex-col items-center"/, 'className="flex flex-col items-center max-w-md w-full max-h-[70vh]"');
file = file.replace(/<div className="text-3xl font-black text-white leading-relaxed whitespace-pre-wrap max-w-sm drop-shadow-lg uppercase tracking-tight">/, '<div className="text-xl md:text-2xl font-black text-white leading-relaxed whitespace-pre-wrap max-w-sm drop-shadow-lg uppercase tracking-tight overflow-y-auto no-scrollbar pb-4">');

file = file.replace(/Cerrar tarjeta/, '{t.close}');

fs.writeFileSync('src/components/FullCardOverlay.tsx', file);

let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace(/<FullCardOverlay\s+card=\{activeCard\}\s+onClose=\{/, '<FullCardOverlay language={profile.language} card={activeCard} onClose={');
fs.writeFileSync('src/App.tsx', app);

console.log("FullCardOverlay fixed");
