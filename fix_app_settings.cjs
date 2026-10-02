const fs = require('fs');
let file = fs.readFileSync('src/App.tsx', 'utf8');

file = file.replace(/<Settings\s+language=\{profile\.language\}/g, '<Settings ');

fs.writeFileSync('src/App.tsx', file);
console.log('App fixed');
