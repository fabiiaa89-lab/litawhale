/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import WhaleLogo from './WhaleLogo';
import { Language } from '../types';
import { i18n } from '../i18n';

interface SplashScreenProps {
  language?: Language;
}

export default function SplashScreen({ language }: SplashScreenProps) {
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

  const subtitle = i18n[activeLang].home.cortex;

  return (
    <div className="absolute inset-0 z-[200] bg-black flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#1a0b2e] to-[#0a1a1f] opacity-80" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="w-36 h-36 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 flex items-center justify-center shadow-2xl relative overflow-hidden mb-8 p-3">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-cyan-500/20 opacity-50" />
          <WhaleLogo className="relative z-10 w-full h-full scale-110" glow={true} />
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-2xl mb-2">Lita-Whale</h1>
        <div className="h-px w-12 bg-cyan-500/50 mb-6" />
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[4px] opacity-60">{subtitle}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-12 text-center"
      >
        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Developed by</p>
        <p className="text-xs text-white font-bold tracking-tight mt-1 uppercase">Fabiola Aponte</p>
      </motion.div>
    </div>
  );
}
