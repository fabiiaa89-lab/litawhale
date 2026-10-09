/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import WhaleLogo from './WhaleLogo';
import { Language } from '../types';
import { i18n } from '../i18n';
import { Sparkles } from 'lucide-react';

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
      className="fixed inset-0 z-[250] bg-[#02050f] flex flex-col items-center justify-center overflow-hidden select-none cursor-pointer"
    >
      {/* Deep Ocean Sanctuary Atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030919] via-[#051329] to-[#02040b] opacity-90" />
      
      {/* Floating Bioluminescent Bubble Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(14)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              y: '105vh',
              x: `${(i * 7.2) + (Math.sin(i * 2) * 6)}vw`,
              opacity: 0,
              scale: 0.4
            }}
            animate={{
              y: '-10vh',
              opacity: [0, 0.7, 0],
              scale: [0.4, 1.2, 0.6]
            }}
            transition={{
              duration: 3 + (i % 5) * 0.5,
              repeat: Infinity,
              ease: "easeOut",
              delay: (i * 0.22)
            }}
            className="absolute w-3 h-3 rounded-full bg-cyan-400/30 blur-[1px] border border-cyan-300/40"
          />
        ))}
      </div>

      {/* Gentle Floating Atmospheric Ring Waves */}
      <motion.div
        animate={{
          scale: [0.95, 1.25, 0.95],
          opacity: [0.15, 0.35, 0.15]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"
      />

      {/* Animated Swimming Whale Centerpiece */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-sm">
        <motion.div
          animate={{
            y: [-10, 10, -10],
            x: [-5, 5, -5],
            rotate: [-2, 2.5, -2],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative mb-6"
        >
          {/* Outer Ripple Wave Aura */}
          <motion.div 
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -inset-4 rounded-[42px] bg-gradient-to-tr from-cyan-500/25 to-purple-500/25 blur-xl pointer-events-none" 
          />

          {/* Whale Mark Card with Glass & Shadow */}
          <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-[36px] bg-white/[0.08] backdrop-blur-2xl border-2 border-cyan-400/40 flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.4)] relative overflow-hidden p-4">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-indigo-500/10 to-purple-500/20 opacity-70" />
            
            {/* The Animated Whale Logo */}
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative z-10 w-full h-full flex items-center justify-center"
            >
              <WhaleLogo className="w-full h-full scale-110" glow={true} />
            </motion.div>
          </div>
        </motion.div>

        {/* Title and Oceanic Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-2"
        >
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-[0_4px_25px_rgba(6,182,212,0.6)]">
            Lita-Whale
          </h1>
          
          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="h-px w-8 bg-cyan-400/50" />
            <span className="text-[11px] sm:text-xs font-black tracking-[4px] uppercase text-cyan-300 drop-shadow">
              {isEs ? 'REFUGIO SOMÁTICO' : 'SOMATIC SANCTUARY'}
            </span>
            <span className="h-px w-8 bg-cyan-400/50" />
          </div>

          <p className="text-xs text-slate-300 font-medium tracking-wide opacity-80 pt-1">
            {isEs ? 'Regulación sensorial para adultos Autistas y TDAH' : 'Sensory regulation for Autistic & ADHD adults'}
          </p>
        </motion.div>
      </div>

      {/* Bottom Creator Branding & Tap Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="absolute bottom-8 text-center space-y-2.5 z-10 pointer-events-none"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-cyan-200/80 text-[10px] font-semibold">
          <Sparkles size={11} className="text-cyan-400 animate-pulse" />
          <span>{isEs ? 'Toca para entrar al refugio' : 'Tap to enter sanctuary'}</span>
        </div>

        <div>
          <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Developed by</p>
          <p className="text-xs text-white font-black tracking-wider uppercase drop-shadow">Fabiola Aponte</p>
        </div>
      </motion.div>
    </div>
  );
}
