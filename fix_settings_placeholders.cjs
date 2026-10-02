const fs = require('fs');

let settings = fs.readFileSync('src/components/screens/Settings.tsx', 'utf8');

settings = settings.replace(/placeholder="Ej: Alex Doe"/, 'placeholder={t.placeholders?.name || "Ej: Alex Doe"}');
settings = settings.replace(/placeholder="Ej: O\+"/g, 'placeholder={t.placeholders?.blood || "Ej: O+"}');
settings = settings.replace(/placeholder="Ej: Luces fuertes, ruidos agudos"/, 'placeholder={t.placeholders?.hyper || "Ej: Luces fuertes, ruidos agudos"}');
settings = settings.replace(/placeholder="Ej: Necesidad de presión"/, 'placeholder={t.placeholders?.hypo || "Ej: Necesidad de presión"}');
settings = settings.replace(/placeholder="Ej: Mi gato, Peluche dino, Manta"/, 'placeholder={t.placeholders?.supportEntity || "Ej: Mi gato, Peluche dino, Manta"}');
settings = settings.replace(/placeholder="Ej: Clonazepam 2mg"/, 'placeholder={t.placeholders?.sosMed || "Ej: Clonazepam 2mg"}');
settings = settings.replace(/placeholder="Ej: Sertralina"/, 'placeholder={t.placeholders?.dailyMed || "Ej: Sertralina"}');
settings = settings.replace(/placeholder="Ej: Yogurt, Frutos secos"/, 'placeholder={t.placeholders?.safeFood || "Ej: Yogurt, Frutos secos"}');
settings = settings.replace(/Medicamentos, latex, etc\./, '{t.placeholders?.allergies || "Medicamentos, latex, etc."}');

fs.writeFileSync('src/components/screens/Settings.tsx', settings);

let i18n = fs.readFileSync('src/i18n.ts', 'utf8');
i18n = i18n.replace(/title: 'CÓRTEX NEURAL',/, "title: 'CÓRTEX NEURAL',\n        cortexTitle: 'Tu Refugio Seguro',");
i18n = i18n.replace(/title: 'NEURAL CORTEX',/, "title: 'NEURAL CORTEX',\n        cortexTitle: 'Your Safe Haven',");

i18n = i18n.replace(/blood: 'Ej: O\+',/, "blood: 'Ej: O+',\n            name: 'Ej: Alex Doe',\n            sosMed: 'Ej: Clonazepam 2mg',\n            dailyMed: 'Ej: Sertralina',\n            safeFood: 'Ej: Yogurt, Frutos secos',");
i18n = i18n.replace(/blood: 'Ex: O\+',/, "blood: 'Ex: O+',\n            name: 'Ex: Alex Doe',\n            sosMed: 'Ex: Clonazepam 2mg',\n            dailyMed: 'Ex: Sertraline',\n            safeFood: 'Ex: Yogurt, Nuts',");

fs.writeFileSync('src/i18n.ts', i18n);

console.log("Settings and i18n placeholders fixed");
