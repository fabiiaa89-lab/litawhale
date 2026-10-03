import { motion } from 'motion/react';
import { Language } from '../../types';
import { i18n } from '../../i18n';

interface CaveProps {
  language: Language;
  onExit: () => void;
}

export default function Cave({ language, onExit }: CaveProps) {
  const t = i18n[language].cave;
  return (
    <div className="fixed inset-0 z-[200] w-screen h-screen bg-[#030308] flex flex-col items-center justify-center text-center p-6 bg-gradient-to-br from-black via-[#060614] to-black select-none touch-none">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8"
      >
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-indigo-400 drop-shadow-[0_0_20px_rgba(129,140,248,0.3)]">{t.title}</h1>
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
        className="absolute bottom-[max(2rem,calc(env(safe-area-inset-bottom,0px)+1.5rem))] px-8 py-4 rounded-full border border-indigo-900 text-indigo-700 font-bold tracking-widest uppercase text-xs active:bg-indigo-900/30 transition-colors cursor-pointer"
      >
        {t.exit}
      </button>
    </div>
  );
}
