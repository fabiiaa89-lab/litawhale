const fs = require('fs');

// CAVE
let cave = `import { motion } from 'motion/react';
import { Language } from '../../types';
import { i18n } from '../../i18n';

interface CaveProps {
  language: Language;
  onExit: () => void;
}

export default function Cave({ language, onExit }: CaveProps) {
  const t = i18n[language].cave;
  return (
    <div className="absolute inset-0 bg-black z-50 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-br from-black via-indigo-950 to-black">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8"
      >
        <h1 className="text-5xl font-black tracking-tighter text-indigo-400 drop-shadow-[0_0_20px_rgba(129,140,248,0.3)]">{t.title}</h1>
        <div className="space-y-2 text-indigo-200/50 font-bold uppercase tracking-widest text-sm">
          <p>{t.line1}</p>
          <p>{t.line2}</p>
          <p>{t.line3}</p>
        </div>
        <div className="pt-12 animate-pulse text-indigo-500/40 text-xs font-black tracking-[5px]">
          {t.status}
        </div>
      </motion.div>
      <button 
        onClick={onExit}
        className="absolute bottom-12 px-8 py-4 rounded-full border border-indigo-900 text-indigo-700 font-bold tracking-widest uppercase text-xs active:bg-indigo-900/30 transition-colors"
      >
        {t.exit}
      </button>
    </div>
  );
}
`;
fs.writeFileSync('src/components/screens/Cave.tsx', cave);


// HAPTIC
let haptic = `import Header from '../Header';
import { motion } from 'motion/react';
import { Language } from '../../types';
import { i18n } from '../../i18n';

interface HapticProps {
  language: Language;
  onBack: () => void;
}

export default function Haptic({ language, onBack }: HapticProps) {
  const t = i18n[language].haptic;
  const vibrate = (pattern: number[]) => {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent overflow-y-auto no-scrollbar pb-12">
      <Header title={t.title} onBack={onBack} titleColor="#c084fc" />
      <div className="p-6 text-center text-purple-300 font-bold text-sm tracking-widest uppercase mb-4 opacity-80">
        {t.subtitle}
      </div>
      <div className="space-y-4 px-6">
        <HapticCard 
          icon="〰️" 
          title={t.pattern1} 
          desc={t.pattern1Sub} 
          pattern={[200, 100, 200, 100, 200]} 
          onVibrate={vibrate} 
        />
        <HapticCard 
          icon="🫀" 
          title={t.pattern2}
          desc={t.pattern2Sub} 
          pattern={[300, 400, 300, 400]} 
          onVibrate={vibrate} 
        />
        <HapticCard 
          icon="⚡" 
          title={t.pattern3}
          desc={t.pattern3Sub}
          pattern={[50, 50, 50, 50, 50, 50, 50]} 
          onVibrate={vibrate} 
        />
      </div>
    </div>
  );
}

function HapticCard({ icon, title, desc, pattern, onVibrate }: any) {
  return (
    <motion.button 
      whileTap={{ scale: 0.95 }}
      onPointerDown={() => onVibrate(pattern)}
      onPointerUp={() => navigator.vibrate && navigator.vibrate(0)}
      onPointerLeave={() => navigator.vibrate && navigator.vibrate(0)}
      className="w-full bg-purple-950/20 border border-purple-500/20 p-6 rounded-[32px] flex items-center gap-4 text-left active:bg-purple-900/40 transition-colors shadow-2xl"
    >
      <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-3xl shrink-0">
        {icon}
      </div>
      <div>
        <div className="font-black text-white text-lg tracking-tight">{title}</div>
        <div className="text-purple-400 font-bold text-xs uppercase tracking-widest mt-1 opacity-80">{desc}</div>
      </div>
    </motion.button>
  );
}
`;
fs.writeFileSync('src/components/screens/Haptic.tsx', haptic);
console.log("Updated Cave, Haptic");
