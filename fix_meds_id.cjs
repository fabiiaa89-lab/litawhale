const fs = require('fs');
let file = fs.readFileSync('src/components/screens/Meds.tsx', 'utf8');

file = file.replace(
  "onAdd({ name, dose, time, confirmed: false })",
  "onAdd({ id: Math.random().toString(36).substring(7), name, dose, time, confirmed: false })"
);

fs.writeFileSync('src/components/screens/Meds.tsx', file);
console.log('Meds ID fixed');
