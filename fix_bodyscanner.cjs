const fs = require('fs');

let file = fs.readFileSync('src/components/screens/BodyScanner.tsx', 'utf8');

file = file.replace(/Pregunta \{step \+ 1\} de \{CALIBRATION_STEPS.length\}/, "{step === 0 ? t.q1 : step === 1 ? t.q2 : t.q3}");
file = file.replace(/>\s*SÍ\s*<\/motion.button>/, '>{t.yes}</motion.button>');
file = file.replace(/>\s*NO\s*<\/motion.button>/, '>{t.no}</motion.button>');
file = file.replace(/Diagnóstico de Calibración/, '{bodySub.calBtn}');
file = file.replace(/Reiniciar/, 'Restart');

// Fix the py-10 which might make the text cut off in some screens, use flex-1 or normal py-6
file = file.replace(/className="py-10 rounded-\[32px\] bg-emerald-500\/20 border-2 border-emerald-500\/30 text-emerald-200 font-black text-2xl"/g, 'className="py-6 rounded-[32px] bg-emerald-500/20 border-2 border-emerald-500/30 text-emerald-200 font-black text-2xl flex items-center justify-center"');
file = file.replace(/className="py-10 rounded-\[32px\] bg-rose-500\/20 border-2 border-rose-500\/30 text-rose-200 font-black text-2xl"/g, 'className="py-6 rounded-[32px] bg-rose-500/20 border-2 border-rose-500/30 text-rose-200 font-black text-2xl flex items-center justify-center"');


fs.writeFileSync('src/components/screens/BodyScanner.tsx', file);
console.log("BodyScanner fixed");
