import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { EnergyLevel, Language } from '../types';
import { i18n } from '../i18n';
import { RotateCcw } from 'lucide-react';
import { hapticEngine } from '../utils/hapticEngine';

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

  const options: { level: EnergyLevel; icon: string; label: string; spoons: string }[] = [
    { level: 1, icon: '🪫', label: t.crit, spoons: '0-2 🥄' },
    { level: 2, icon: '🔋', label: t.low, spoons: '3-5 🥄' },
    { level: 3, icon: '⚡', label: t.med, spoons: '6-8 🥄' },
    { level: 4, icon: '✅', label: t.high, spoons: '9-10 🥄' },
    { level: 5, icon: '🚀', label: t.max, spoons: '11-12 🥄' },
  ];

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

  return (
    <div className="absolute inset-0 z-50 flex items-end bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        onClick={e => e.stopPropagation()}
        className="w-full bg-slate-900/90 backdrop-blur-[40px] rounded-t-[40px] p-6 sm:p-8 pb-[max(3rem,calc(env(safe-area-inset-bottom,0px)+2rem))] border-t border-white/20 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar space-y-6"
      >
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-100 tracking-tight">{t.title}</h2>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-cyan-300 border border-white/10">
              <span>🥄</span>
              <span>{spoons} / 12 {language === 'es' ? 'cucharas' : 'spoons'}</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 font-normal mt-1">{t.subtitle}</p>
        </div>

        {/* 5 Cognitive Load Level Buttons */}
        <div className="grid grid-cols-5 gap-2">
          {options.map(opt => (
            <button
              key={opt.level}
              onClick={() => handleSelectLevel(opt.level)}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-2.5 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/10 transition-colors shadow-lg active:scale-95"
            >
              <span className="text-2xl mb-1 drop-shadow-md">{opt.icon}</span>
              <span className="text-[9px] font-bold text-slate-100 uppercase tracking-wider leading-none">{opt.label}</span>
              <span className="text-[8px] text-cyan-300 font-semibold mt-1 opacity-80">{opt.spoons}</span>
            </button>
          ))}
        </div>

        {/* Fused Spoon Theory Quick Logger */}
        <div className="p-4 rounded-3xl bg-white/[0.03] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <span>🥄</span>
              <span>{tSpoons?.title || 'Teoría de las Cucharas'}</span>
            </span>
            <button
              onClick={() => syncSpoonsAndEnergy(12)}
              className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw size={11} />
              <span>{tSpoons?.reset || 'Reiniciar (12)'}</span>
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

          {/* Quick Spoon Action Chips */}
          <div className="grid grid-cols-4 gap-1.5 pt-1">
            <button
              onClick={() => handleSpend(1)}
              className="py-2 px-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-center text-xs text-slate-200 font-medium active:scale-95 transition-all cursor-pointer"
            >
              <div className="text-amber-300 font-bold">-1 🥄</div>
              <div className="text-[9px] text-slate-400 truncate">{language === 'es' ? 'Leve' : 'Minor'}</div>
            </button>
            <button
              onClick={() => handleSpend(2)}
              className="py-2 px-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-center text-xs text-slate-200 font-medium active:scale-95 transition-all cursor-pointer"
            >
              <div className="text-amber-400 font-bold">-2 🥄</div>
              <div className="text-[9px] text-slate-400 truncate">{language === 'es' ? 'Media' : 'Med'}</div>
            </button>
            <button
              onClick={() => handleSpend(3)}
              className="py-2 px-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-center text-xs text-slate-200 font-medium active:scale-95 transition-all cursor-pointer"
            >
              <div className="text-rose-400 font-bold">-3 🥄</div>
              <div className="text-[9px] text-slate-400 truncate">{language === 'es' ? 'Pesada' : 'Heavy'}</div>
            </button>
            <button
              onClick={() => handleRecharge(1)}
              className="py-2 px-1 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-center text-xs text-cyan-200 font-medium active:scale-95 transition-all cursor-pointer"
            >
              <div className="text-cyan-300 font-bold">+1 🥄</div>
              <div className="text-[9px] text-cyan-400/80 truncate">{language === 'es' ? 'Recarga' : 'Rest'}</div>
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold text-sm shadow-xl transition-colors cursor-pointer"
        >
          {t.close}
        </button>
      </motion.div>
    </div>
  );
}
