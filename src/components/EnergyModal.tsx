import { useState } from 'react';
import { motion } from 'motion/react';
import { EnergyLevel, Language } from '../types';
import { i18n } from '../i18n';
import { RotateCcw, ExternalLink } from 'lucide-react';
import { hapticEngine } from '../utils/hapticEngine';
import { getEnergyVisual } from '../utils/energyVisual';

interface EnergyModalProps {
  language: Language;
  onSetEnergy: (level: EnergyLevel) => void;
  onClose: () => void;
}

export default function EnergyModal({ language, onSetEnergy, onClose }: EnergyModalProps) {
  const t = i18n[language].energy;
  const tSpoons = i18n[language].spoons;

  const [spoons, setSpoons] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('ns_spoons');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.remaining === 'number') return parsed.remaining;
      }
    } catch (e) {}
    return 8;
  });

  const levels: EnergyLevel[] = [1, 2, 3, 4, 5];

  const syncSpoonsAndEnergy = (newSpoons: number) => {
    const clamped = Math.max(0, Math.min(12, newSpoons));
    setSpoons(clamped);

    let newLevel: EnergyLevel = 3;
    if (clamped <= 2) newLevel = 1;
    else if (clamped <= 5) newLevel = 2;
    else if (clamped <= 8) newLevel = 3;
    else if (clamped <= 10) newLevel = 4;
    else newLevel = 5;

    try {
      const saved = localStorage.getItem('ns_spoons');
      const parsed = saved ? JSON.parse(saved) : { total: 12, history: [] };
      parsed.remaining = clamped;
      parsed.lastResetDate = new Date().toISOString().split('T')[0];
      localStorage.setItem('ns_spoons', JSON.stringify(parsed));
      window.dispatchEvent(new CustomEvent('ns_spoons_updated', { detail: clamped }));
    } catch (e) {}

    onSetEnergy(newLevel);
  };

  const handleSelectLevel = (level: EnergyLevel) => {
    hapticEngine.triggerImpact('medium');
    const spoonMap: Record<EnergyLevel, number> = { 1: 1, 2: 4, 3: 7, 4: 10, 5: 12 };
    syncSpoonsAndEnergy(spoonMap[level]);
  };

  const handleSpend = (amount: number) => {
    hapticEngine.triggerImpact('light');
    syncSpoonsAndEnergy(spoons - amount);
  };

  const handleRecharge = (amount: number = 1) => {
    hapticEngine.triggerImpact('light');
    syncSpoonsAndEnergy(spoons + amount);
  };

  const handleOpenDetailedSpoons = () => {
    onClose();
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('ns_open_spoon_widget'));
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/65 backdrop-blur-md p-0 sm:p-4" onClick={onClose}>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: 'spring', damping: 25, stiffness: 240 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md bg-slate-900/95 backdrop-blur-3xl rounded-t-[36px] sm:rounded-[36px] p-6 sm:p-7 pb-[max(2.5rem,calc(env(safe-area-inset-bottom,0px)+1.5rem))] border-t sm:border border-white/15 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar space-y-5"
      >
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-slate-100 tracking-tight">{t.title}</h2>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-xs font-bold text-cyan-300 border border-cyan-500/30">
              <span>🥄</span>
              <span>{spoons} / 12 {language === 'es' ? 'cucharas' : 'spoons'}</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 font-normal mt-1">{t.subtitle}</p>
        </div>

        {/* 5 Cognitive Load Level Buttons with Dynamic Icons */}
        <div className="grid grid-cols-5 gap-2">
          {levels.map(lvl => {
            const visual = getEnergyVisual(lvl, 20);
            return (
              <motion.button
                key={lvl}
                whileTap={{ scale: 0.94 }}
                onClick={() => handleSelectLevel(lvl)}
                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-2.5 flex flex-col items-center justify-center text-center cursor-pointer transition-all shadow-md active:scale-95 group"
              >
                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                  {visual.icon}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider leading-none mt-0.5 ${visual.color}`}>
                  {language === 'es' ? visual.labelEs : visual.labelEn}
                </span>
                <span className="text-[9px] text-slate-400 font-medium mt-1">
                  {visual.spoonsRange}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Fused Spoon Theory Quick Logger */}
        <div className="p-4 rounded-3xl bg-white/[0.03] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <span>🥄</span>
              <span>{tSpoons?.title || (language === 'es' ? 'Gestión Rápida de Cucharas' : 'Quick Spoons Log')}</span>
            </span>
            <button
              onClick={() => syncSpoonsAndEnergy(12)}
              className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw size={11} />
              <span>{tSpoons?.reset || (language === 'es' ? 'Reiniciar (12)' : 'Reset (12)')}</span>
            </button>
          </div>

          {/* Visual Spoons Battery Display */}
          <div className="flex flex-wrap justify-center gap-1.5 py-1">
            {Array.from({ length: 12 }).map((_, idx) => {
              const active = idx < spoons;
              return (
                <span 
                  key={idx}
                  className={`text-base transition-all ${active ? 'opacity-100 scale-105' : 'opacity-20 grayscale scale-90'}`}
                >
                  🥄
                </span>
              );
            })}
          </div>

          {/* Quick Spoon Action Chips without truncation */}
          <div className="grid grid-cols-4 gap-1.5 pt-1">
            <button
              onClick={() => handleSpend(1)}
              className="py-2.5 px-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-center text-xs text-slate-200 font-medium active:scale-95 transition-all cursor-pointer flex flex-col items-center justify-center"
            >
              <div className="text-amber-300 font-bold">-1 🥄</div>
              <div className="text-[10px] sm:text-xs text-slate-300 font-medium leading-tight mt-0.5 whitespace-nowrap">
                {language === 'es' ? 'Leve' : 'Minor'}
              </div>
            </button>

            <button
              onClick={() => handleSpend(2)}
              className="py-2.5 px-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-center text-xs text-slate-200 font-medium active:scale-95 transition-all cursor-pointer flex flex-col items-center justify-center"
            >
              <div className="text-amber-400 font-bold">-2 🥄</div>
              <div className="text-[10px] sm:text-xs text-slate-300 font-medium leading-tight mt-0.5 whitespace-nowrap">
                {language === 'es' ? 'Media' : 'Med'}
              </div>
            </button>

            <button
              onClick={() => handleSpend(3)}
              className="py-2.5 px-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-center text-xs text-slate-200 font-medium active:scale-95 transition-all cursor-pointer flex flex-col items-center justify-center"
            >
              <div className="text-rose-400 font-bold">-3 🥄</div>
              <div className="text-[10px] sm:text-xs text-slate-300 font-medium leading-tight mt-0.5 whitespace-nowrap">
                {language === 'es' ? 'Pesada' : 'Heavy'}
              </div>
            </button>

            <button
              onClick={() => handleRecharge(1)}
              className="py-2.5 px-1 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-center text-xs text-cyan-200 font-medium active:scale-95 transition-all cursor-pointer flex flex-col items-center justify-center"
            >
              <div className="text-cyan-300 font-bold">+1 🥄</div>
              <div className="text-[10px] sm:text-xs text-cyan-300 font-medium leading-tight mt-0.5 whitespace-nowrap">
                {language === 'es' ? 'Recarga' : 'Rest'}
              </div>
            </button>
          </div>
        </div>

        {/* Detailed spoons manager trigger */}
        <button
          onClick={handleOpenDetailedSpoons}
          className="w-full py-3 px-4 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-400/25 text-indigo-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>{language === 'es' ? 'Abrir Panel Completo de Cucharas' : 'Open Full Spoons Manager'}</span>
          <ExternalLink size={14} />
        </button>

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
        >
          {t.close}
        </button>
      </motion.div>
    </div>
  );
}
