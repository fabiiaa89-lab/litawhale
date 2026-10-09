import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../../types';
import { i18n } from '../../i18n';
import WhaleLogo from '../WhaleLogo';
import { Waves, Sparkles, ArrowUp, Sun } from 'lucide-react';

interface CaveProps {
  language: Language;
  onExit: () => void;
}

export default function Cave({ language, onExit }: CaveProps) {
  const isEs = language === 'es';
  const t = i18n[language].cave;
  const [isBreaching, setIsBreaching] = useState(false);

  const handleStartBreach = () => {
    setIsBreaching(true);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([40, 60, 80]);
      } catch (e) {}
    }
    // Smooth transition into surface world
    setTimeout(() => {
      onExit();
    }, 2400);
  };

  return (
    <div className="fixed inset-0 z-[200] w-screen h-screen bg-[#02040b] flex flex-col items-center justify-between p-6 sm:p-8 select-none touch-none overflow-hidden">
      {/* Ambient Deep Sea Glow & Bioluminescence */}
      <div className="absolute inset-0 bg-radial from-cyan-950/20 via-[#030612] to-[#010206] pointer-events-none" />
      
      {/* Gentle Floating Atmospheric Ocean Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.08, 0.18, 0.08]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-96 h-96 rounded-full border border-cyan-500/20 bg-cyan-500/5 blur-xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 0.95, 1.2],
            opacity: [0.05, 0.12, 0.05]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute w-[500px] h-[500px] rounded-full border border-teal-500/15 bg-teal-500/5 blur-2xl"
        />
      </div>

      {/* Top Sanctuary Badge */}
      <div className="relative z-10 w-full flex items-center justify-center pt-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-bold uppercase tracking-widest shadow-lg">
          <Waves size={14} className="text-cyan-400" />
          <span>{isEs ? 'INMERSIÓN OCÉANICA · SILENCIO TOTAL' : 'DEEP OCEAN DIVE · ZERO INPUT'}</span>
        </div>
      </div>

      {/* Center Sanctuary Focus: The Restorative Whale Sanctuary */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="relative z-10 flex flex-col items-center max-w-sm w-full my-auto text-center space-y-6"
      >
        {/* Soft Bioluminescent Whale Mark */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            filter: [
              'drop-shadow(0 0 20px rgba(6,182,212,0.3))',
              'drop-shadow(0 0 35px rgba(6,182,212,0.6))',
              'drop-shadow(0 0 20px rgba(6,182,212,0.3))'
            ]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center p-3 shadow-2xl backdrop-blur-xl"
        >
          <WhaleLogo className="w-full h-full scale-110" glow={true} />
        </motion.div>

        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
            {isEs ? 'Estás a salvo en las profundidades' : 'You are safe in the deep waters'}
          </h1>

          <p className="text-xs sm:text-sm text-cyan-200/80 font-medium leading-relaxed">
            {isEs 
              ? 'Como la ballena que se sumerge en calma para descansar de la tormenta, aquí no hay ruido, ni demandas, ni expectativas.'
              : 'Like the whale descending into serene waters to escape the storm, there is no noise, no demand, and no expectation here.'}
          </p>

          <div className="pt-2 space-y-1.5 text-slate-300 text-xs font-semibold">
            <p className="opacity-90">{isEs ? '• No tienes que responder a nadie.' : '• You do not have to answer anyone.'}</p>
            <p className="opacity-90">{isEs ? '• No se requiere ninguna acción.' : '• No action is required.'}</p>
            <p className="opacity-90">{isEs ? '• Tu sistema se está restaurando.' : '• Your nervous system is restoring.'}</p>
          </div>
        </div>

        <div className="pt-4 flex items-center gap-2 text-cyan-400 text-xs font-bold tracking-wider uppercase opacity-75">
          <Sparkles size={14} />
          <span>{isEs ? 'Recuperando cucharas de energía' : 'Regenerating energy spoons'}</span>
        </div>
      </motion.div>

      {/* Surface Action Button */}
      <div className="relative z-10 w-full max-w-sm pb-2">
        <motion.button 
          whileTap={{ scale: 0.96 }}
          onClick={handleStartBreach}
          className="w-full py-4 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 active:scale-95 border-2 border-cyan-400/50 text-cyan-200 hover:text-white font-bold tracking-wider uppercase text-xs transition-all shadow-xl shadow-cyan-950/50 flex items-center justify-center gap-2 cursor-pointer"
        >
          <ArrowUp size={16} />
          <span>{isEs ? 'Emerger a la superficie' : 'Breach to surface'}</span>
        </motion.button>
      </div>

      {/* Spectacular Whale Breaching Transition Splash Screen */}
      <AnimatePresence>
        {isBreaching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onExit}
            className="fixed inset-0 z-[250] bg-[#030914] flex flex-col items-center justify-center p-6 text-center overflow-hidden cursor-pointer"
          >
            {/* Sunlit Oceanic Surface Awakening Gradient */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 bg-gradient-to-t from-[#020a16] via-[#043353]/90 to-[#38bdf8]/30 pointer-events-none" 
            />

            {/* Rising Bubbles and Bioluminescence */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(16)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    y: '100vh', 
                    x: `${(i * 6.5) + (Math.sin(i) * 5)}vw`, 
                    opacity: 0,
                    scale: 0.5 
                  }}
                  animate={{ 
                    y: '-10vh', 
                    opacity: [0, 0.8, 0],
                    scale: [0.5, 1.4, 0.8] 
                  }}
                  transition={{ 
                    duration: 1.8 + (i % 4) * 0.3, 
                    ease: "easeOut",
                    delay: (i * 0.08) 
                  }}
                  className="absolute w-3 h-3 rounded-full bg-cyan-300/40 blur-[1px] border border-cyan-200/50"
                />
              ))}
            </div>

            {/* Radiant Sunburst of Light from Above */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: [0.8, 1.3, 1.1], opacity: [0, 0.4, 0.25] }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute -top-24 w-96 h-96 rounded-full bg-cyan-400 blur-3xl pointer-events-none"
            />

            {/* Leaping Whale - Soaring from darkness into the radiant light */}
            <motion.div
              initial={{ y: 160, scale: 0.7, rotate: -18, opacity: 0 }}
              animate={{ 
                y: [160, -28, 0], 
                scale: [0.7, 1.25, 1.1], 
                rotate: [-18, 10, 0],
                opacity: [0, 1, 1] 
              }}
              transition={{ 
                duration: 1.8, 
                times: [0, 0.6, 1],
                ease: "easeOut" 
              }}
              className="relative z-10 flex flex-col items-center"
            >
              <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-[40px] bg-white/10 backdrop-blur-2xl border-2 border-cyan-400/50 flex items-center justify-center p-4 shadow-[0_0_60px_rgba(6,182,212,0.55)] relative mb-8">
                <WhaleLogo className="w-full h-full scale-110 drop-shadow-[0_0_25px_rgba(56,189,248,0.7)]" glow={true} />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="space-y-3 max-w-sm"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-300/40 text-cyan-200 text-xs font-black uppercase tracking-widest shadow-lg">
                  <Sun size={14} className="text-cyan-300 animate-spin" />
                  <span>{isEs ? 'EMERGIENDO A LA SUPERFICIE' : 'BREACHING TO SURFACE'}</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight drop-shadow-2xl">
                  {isEs ? 'Poderosa, fuerte y en calma' : 'Powerful, strong and calm'}
                </h2>

                <p className="text-sm text-cyan-100 font-medium leading-relaxed">
                  {isEs 
                    ? 'Has descansado en las profundidades. Ahora emerges lista para navegar tu día a tu propio ritmo.'
                    : 'You rested in the peaceful depths. You now surface ready to navigate life at your own true rhythm.'}
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
