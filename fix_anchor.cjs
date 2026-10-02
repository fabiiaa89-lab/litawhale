const fs = require('fs');

let file = fs.readFileSync('src/components/screens/Anchor.tsx', 'utf8');

file = file.replace(/import { motion } from 'motion\/react';/, "import { motion } from 'motion/react';\nimport { User } from 'lucide-react';");

file = file.replace(
    /<div className="text-7xl drop-shadow-\[0_10px_30px_rgba\(255,255,255,0\.2\)\]">👤<\/div>/,
    '<div className="w-24 h-24 rounded-[32px] bg-white/10 flex items-center justify-center border-2 border-white/20 shadow-2xl"><User size={48} className="text-white/70" /></div>'
);

// We remove overflow-hidden from the profile card so it doesnt crop if it somehow still happens, though the new icon shouldn't.
file = file.replace(/overflow-hidden group"/, 'group"');

fs.writeFileSync('src/components/screens/Anchor.tsx', file);
console.log("Anchor fixed");
