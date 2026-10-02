const fs = require('fs');
let file = fs.readFileSync('src/components/screens/Home.tsx', 'utf8');

// Fix logo
file = file.replace(/className="relative z-10 w-full h-full object-contain mix-blend-screen scale-\[1\.3\]"/, 'className="relative z-10 w-full h-full object-cover rounded-2xl"');
file = file.replace(/className="w-12 h-12 shrink-0 rounded-2xl bg-white\/5 backdrop-blur-2xl border border-white\/10 flex items-center justify-center shadow-2xl relative overflow-hidden group"/, 'className="w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden group bg-transparent"');
// Fix SOS button text size
file = file.replace(/<span className="text-sm font-black text-white uppercase tracking-\[2px\]">\{t\.sosBtn\}<\/span>/, '<span className="text-xl font-black text-white uppercase tracking-[2px]">{t.sosBtn}</span>');

// Fix crisis button
file = file.replace(/<Settings size=\{100\} \/>/, '<BrainCircuit size={100} />');

fs.writeFileSync('src/components/screens/Home.tsx', file);
console.log('Home fixed');
