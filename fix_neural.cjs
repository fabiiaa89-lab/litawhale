const fs = require('fs');

let file = fs.readFileSync('src/components/screens/NeuralCortex.tsx', 'utf8');

file = file.replace(/title="Tu Refugio Seguro"/, 'title={t.cortexTitle || t.title}');
file = file.replace(/Asistente de Calma/, '{t.companionMode}');
file = file.replace(/Compañero diseñado para tu tranquilidad/, '{t.companionModeSub}');
file = file.replace(/placeholder="¿En qué puedo ayudarte\?"/, 'placeholder={t.placeholder}');

fs.writeFileSync('src/components/screens/NeuralCortex.tsx', file);
console.log("NeuralCortex fixed");
