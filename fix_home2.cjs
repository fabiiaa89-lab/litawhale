const fs = require('fs');
let content = fs.readFileSync('src/components/screens/Home.tsx', 'utf8');

// Fix 1: Logo
content = content.replace('object-cover mix-blend-screen scale-[1.8]', 'object-contain mix-blend-screen scale-[1.3]');

// Fix 2: Container shrink issue (outermost flex-col makes children shrink if not careful)
// Let's just add shrink-0 to the buttons

// SOS Button
content = content.replace(
  'className="mx-6 mb-6 py-4 rounded-[28px] bg-rose-600 shadow-[0_0_20px_rgba(244,63,94,0.3)] border border-rose-400/50 flex items-center justify-center gap-3 active:bg-rose-700 transition-colors"',
  'className="mx-6 mb-6 py-4 rounded-[28px] bg-rose-600 shadow-[0_0_20px_rgba(244,63,94,0.3)] border border-rose-400/50 flex items-center justify-center gap-3 active:bg-rose-700 transition-colors shrink-0"'
);
content = content.replace(
  '<span className="text-[10px] font-black text-white uppercase tracking-[3px]">SOS: INF. MÉDICA</span>',
  '<span className="text-sm font-black text-white uppercase tracking-[2px]">SOS: INF. MÉDICA</span>'
);

// Crisis Button
content = content.replace(
  'className="mx-6 mb-6 bg-rose-500/10 backdrop-blur-2xl border-2 border-rose-500/30 rounded-[32px] p-6 flex items-center gap-5 cursor-pointer shadow-2xl relative overflow-hidden"',
  'className="mx-6 mb-6 bg-rose-500/10 backdrop-blur-2xl border-2 border-rose-500/30 rounded-[32px] py-6 px-6 flex items-center gap-5 cursor-pointer shadow-2xl relative overflow-hidden shrink-0 min-h-[100px]"'
);

// Grid container
content = content.replace(
  'className="grid grid-cols-2 gap-4 px-6 mb-6"',
  'className="grid grid-cols-2 gap-4 px-6 mb-6 shrink-0"'
);

// Other buttons
content = content.replace(
  'className="mx-6 mb-4 bg-white/5 backdrop-blur-2xl border-2 border-white/10 rounded-[32px] p-6 flex items-center justify-between cursor-pointer shadow-3xl hover:bg-white/10 transition-all font-sans"',
  'className="mx-6 mb-4 bg-white/5 backdrop-blur-2xl border-2 border-white/10 rounded-[32px] p-6 flex items-center justify-between cursor-pointer shadow-3xl hover:bg-white/10 transition-all font-sans shrink-0"'
);
content = content.replace(
  'className="mx-6 mb-4 bg-indigo-500/10 backdrop-blur-2xl border border-indigo-400/20 rounded-[32px] p-6 flex items-center gap-4 cursor-pointer shadow-3xl hover:bg-indigo-500/20 transition-all text-left"',
  'className="mx-6 mb-4 bg-indigo-500/10 backdrop-blur-2xl border border-indigo-400/20 rounded-[32px] p-6 flex items-center gap-4 cursor-pointer shadow-3xl hover:bg-indigo-500/20 transition-all text-left shrink-0"'
);
content = content.replace(
  'className="mx-6 mb-4 bg-[#1e1e1e]/60 backdrop-blur-2xl border border-[#333] rounded-[32px] p-6 flex items-center gap-4 cursor-pointer shadow-3xl hover:bg-[#2a2a2a] transition-all text-left"',
  'className="mx-6 mb-4 bg-[#1e1e1e]/60 backdrop-blur-2xl border border-[#333] rounded-[32px] p-6 flex items-center gap-4 cursor-pointer shadow-3xl hover:bg-[#2a2a2a] transition-all text-left shrink-0"'
);
content = content.replace(
  'className="mx-6 mb-4 bg-teal-500/10 backdrop-blur-2xl border border-teal-400/20 rounded-[32px] p-6 flex items-center gap-4 cursor-pointer shadow-3xl hover:bg-teal-500/20 transition-all text-left"',
  'className="mx-6 mb-4 bg-teal-500/10 backdrop-blur-2xl border border-teal-400/20 rounded-[32px] p-6 flex items-center gap-4 cursor-pointer shadow-3xl hover:bg-teal-500/20 transition-all text-left shrink-0"'
);


fs.writeFileSync('src/components/screens/Home.tsx', content);
