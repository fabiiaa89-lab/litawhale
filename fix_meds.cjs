const fs = require('fs');
let file = fs.readFileSync('src/components/screens/Meds.tsx', 'utf8');

file = file.replace(/dosage/g, 'dose');
file = file.replace(/schedule/g, 'time');

fs.writeFileSync('src/components/screens/Meds.tsx', file);
console.log('Meds fixed');
