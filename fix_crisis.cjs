const fs = require('fs');
let file = fs.readFileSync('src/components/screens/Crisis.tsx', 'utf8');

file = file.replace(
  "onShowCard({ id: 'crisis', icon: '💬', text: 'I AM HAVING A MELTDOWN. I NEED QUIET.', bgColor: 'bg-rose-600', color: 'text-white' })",
  "onShowCard({ icon: '💬', label: 'CRISIS', text: 'I AM HAVING A MELTDOWN. I NEED QUIET.' })"
);

fs.writeFileSync('src/components/screens/Crisis.tsx', file);
console.log('Crisis fixed');
