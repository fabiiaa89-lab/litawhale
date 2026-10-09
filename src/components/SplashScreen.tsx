import { motion } from 'motion/react';
import WhaleLogo from './WhaleLogo';
import { Language } from '../types';

interface SplashScreenProps {
  language?: Language;
  onDismiss?: () => void;
}

export default function SplashScreen({ language, onDismiss }: SplashScreenProps) {
  const activeLang: Language = language || (() => {
    try {
      const saved = localStorage.getItem('ns_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.language === 'en' || parsed.language === 'es') return parsed.language;
      }
    } catch (e) {}
    const browserLang = typeof navigator !== 'undefined' ? navigator.language.split('-')[0] : 'es';
    return browserLang === 'es' ? 'es' : 'en';
  })();

  const isEs = activeLang === 'es';

  return (
    <div 
      onClick={onDismiss}
      className="fixed inset-0 z-[250] bg-[#050814] flex flex-col items-center justify-center overflow-hidden select-none cursor-pointer"
    >
      {/* Fondo ultra-limpio y oscuro sin distracciones móviles */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060d20] to-[#02040b] opacity-90" />

      {/* Contenedor central minimalista */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-sm">
        
        {/* Logo con respiración somática (muy lenta y suave, sin rotaciones bruscas) */}
        <motion.div
          animate={{ scale: [1, 1.03, 1], opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative mb-8"
        >
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-3xl bg-white/[0.03] backdrop-blur-md border border-white/5 flex items-center justify-center shadow-lg p-5">
             <WhaleLogo className="w-full h-full" glow={false} />
          </div>
        </motion.div>

        {/* Tipografía premium, clara y espaciada */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-3"
        >
          <h1 className="text-3xl sm:text-4xl font-black tracking-widest text-slate-100">
            LITA WHALE
          </h1>
          
          <div className="flex items-center justify-center gap-3 pt-2">
            <span className="h-px w-6 bg-cyan-900/50" />
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.3em] text-cyan-600 uppercase">
              {isEs ? 'Refugio Somático' : 'Somatic Sanctuary'}
            </span>
            <span className="h-px w-6 bg-cyan-900/50" />
          </div>
        </motion.div>
      </div>

      {/* Footer discreto */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="absolute bottom-10 text-center space-y-12 z-10 pointer-events-none"
      >
        <p className="text-[11px] text-slate-400 font-medium tracking-widest animate-pulse">
          {isEs ? 'TOCA PARA ENTRAR' : 'TAP TO ENTER'}
        </p>

        <div>
          <p className="text-[8px] text-slate-600 font-bold uppercase tracking-[0.2em]">Developed by</p>
          <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">Fabiola Aponte</p>
        </div>
      </motion.div>
    </div>
  );
}