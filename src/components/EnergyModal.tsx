import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EnergyLevel, Language } from '../types';
import { i18n } from '../i18n';
import { getEnergyVisual, energyLevelToSpoons, spoonsToEnergyLevel } from '../utils/energyVisual';
import { hapticEngine } from '../utils/hapticEngine';
import { RotateCcw, X, Sparkles, BatteryCharging, ShieldCheck } from 'lucide-react';

interface EnergyModalProps {
  currentLevel?: EnergyLevel;
  language: Language;
  onSetEnergy: (lvl: EnergyLevel) => void;
  onClose: () => void;
}

export default function EnergyModal({
  currentLevel = 3,
  language,
  onSetEnergy,
  onClose
}: EnergyModalProps) {
  const isEs = language === 'es';

  // Read spoons from localStorage
  const [spoons, setSpoons] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('ns_spoons');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.remaining === 'number') return parsed.remaining;
      }
    } catch (e) {}
    return energyLevelToSpoons(currentLevel);
  });

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Synchronize spoons with energy level
  const syncSpoonsAndEnergy = (newSpoons: number) => {
    const clamped = Math.max(0, Math.min(12, newSpoons));
    setSpoons(clamped);

    // Save to localStorage
    try {
      const saved = localStorage.getItem('ns_spoons');
      const prev = saved ? JSON.parse(saved) : { total: 12 };
      const updated = {
        ...prev,
        remaining: clamped,
        total: 12,
        lastUpdated: Date.now()
      };
      localStorage.setItem('ns_spoons', JSON.stringify(updated));
    } catch (e) {}

    // Dispatch global event for header and listeners
    window.dispatchEvent(new CustomEvent('ns_spoons_updated', { detail: clamped }));

    // Map to 1-5 energy level
    const newLevel = spoonsToEnergyLevel(clamped);
    onSetEnergy(newLevel);
  };

  const handleSelectLevel = (lvl: EnergyLevel) => {
    hapticEngine.triggerImpact('medium');
    const targetSpoons = energyLevelToSpoons(lvl);
    syncSpoonsAndEnergy(targetSpoons);
  };

  const handleSpend = (amount: number) => {
    hapticEngine.triggerImpact('light');
    syncSpoonsAndEnergy(spoons - amount);
  };

  const handleRecharge = (amount: number = 1) => {
    hapticEngine.triggerImpact('light');
    syncSpoonsAndEnergy(spoons + amount);
  };

  const levels: EnergyLevel[] = [1, 2, 3, 4, 5];

  // Visual state styling
  const ratio = spoons / 12;
  const stateColor = ratio > 0.5 
    ? 'text-cyan-400 dark:text-cyan-400 light:text-cyan-800 bg-cyan-500/10 dark:bg-cyan-500/10 light:bg-cyan-100 border-cyan-500/30' 
    : ratio > 0.25 
    ? 'text-amber-400 dark:text-amber-400 light:text-amber-800 bg-amber-500/10 dark:bg-amber-500/10 light:bg-amber-100 border-amber-500/30' 
    : 'text-rose-400 dark:text-rose-400 light:text-rose-800 bg-rose-500/10 dark:bg-rose-500/10 light:bg-rose-100 border-rose-500/30 animate-pulse';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-md p-0 sm:p-4" onClick={onClose}>
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 240 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md bg-slate-900/95 dark:bg-slate-900/95 light:bg-white backdrop-blur-3xl rounded-t-[36px] sm:rounded-[36px] p-6 sm:p-7 pb-[max(2.5rem,calc(env(safe-area-inset-bottom,0px)+1.5rem))] border-t sm:border border-white/15 dark:border-white/15 light:border-slate-300 shadow-2xl max-h-[92vh] overflow-y-auto no-scrollbar space-y-5"
      >
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 border-b border-white/10 dark:border-white/10 light:border-slate-200 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 dark:text-cyan-400 light:text-cyan-700 bg-cyan-500/15 dark:bg-cyan-500/15 light:bg-cyan-100 px-2.5 py-0.5 rounded-full border border-cyan-400/25">
                {isEs ? 'REGULACIÓN SOMÁTICA' : 'SOMATIC REGULATION'}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-100 dark:text-slate-100 light:text-slate-900 tracking-tight mt-1">
              {isEs ? 'Santuario de Energía & Cucharas' : 'Energy & Spoons Sanctuary'}
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 font-normal mt-0.5">
              {isEs 
                ? 'Monitorea tus recursos cognitivos para prevenir el colapso sensorial.' 
                : 'Monitor your cognitive stamina to prevent sensory shutdown.'}
            </p>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Current Spoon Balance Status */}
        <div className={`p-4 rounded-3xl border flex items-center justify-between ${stateColor}`}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 dark:bg-white/10 light:bg-white flex items-center justify-center text-2xl shadow-sm">
              🥄
            </div>
            <div>
              <span className="text-xs font-bold block uppercase tracking-wider">
                {isEs ? 'Cucharas Disponibles' : 'Available Spoons'}
              </span>
              <span className="text-2xl font-black tabular-nums tracking-tight">
                {spoons} <span className="text-xs font-semibold opacity-70">/ 12</span>
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 dark:bg-white/10 dark:hover:bg-white/20 light:bg-white light:hover:bg-slate-100 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm"
          >
            <RotateCcw size={12} />
            <span>{isEs ? 'Reiniciar' : 'Reset'}</span>
          </button>
        </div>

        {/* 12 Visual Bioluminescent Ceramic Spoons */}
        <div className="p-4 rounded-3xl bg-white/[0.03] dark:bg-white/[0.03] light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-200 space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 light:text-slate-600">
              {isEs ? 'Batería de Cucharas' : 'Spoon Battery'}
            </span>
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 light:text-slate-600">
              {Math.round((spoons / 12) * 100)}%
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-2 py-1">
            {Array.from({ length: 12 }).map((_, idx) => {
              const active = idx < spoons;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => syncSpoonsAndEnergy(idx + 1)}
                  className={`text-xl transition-all cursor-pointer hover:scale-125 active:scale-95 ${
                    active ? 'opacity-100 scale-105 drop-shadow' : 'opacity-20 grayscale scale-90'
                  }`}
                  title={`${idx + 1} cucharas`}
                >
                  🥄
                </button>
              );
            })}
          </div>
        </div>

        {/* 5 Cognitive Load Level Buttons with Dynamic Icons */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 light:text-slate-600 block mb-2 px-1">
            {isEs ? 'Nivel Autonómico (1 a 5)' : 'Autonomic State (1 to 5)'}
          </span>
          <div className="grid grid-cols-5 gap-2">
            {levels.map(lvl => {
              const visual = getEnergyVisual(lvl, 20);
              const isSelected = spoonsToEnergyLevel(spoons) === lvl;
              return (
                <motion.button
                  key={lvl}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => handleSelectLevel(lvl)}
                  className={`border rounded-2xl p-2.5 flex flex-col items-center justify-center text-center cursor-pointer transition-all shadow-md group ${
                    isSelected 
                      ? 'bg-cyan-500/25 border-cyan-400 dark:bg-cyan-500/25 dark:border-cyan-400 light:bg-cyan-100 light:border-cyan-600 scale-105' 
                      : 'bg-white/5 hover:bg-white/10 dark:bg-white/5 dark:hover:bg-white/10 light:bg-slate-50 light:hover:bg-slate-100 border-white/10 dark:border-white/10 light:border-slate-200'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-white/5 dark:bg-white/5 light:bg-white flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                    {visual.icon}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider leading-none mt-0.5 ${visual.color}`}>
                    {isEs ? visual.labelEs : visual.labelEn}
                  </span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-400 light:text-slate-600 font-medium mt-1">
                    {lvl}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Quick Spoon Action Chips */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 light:text-slate-600 block mb-2 px-1">
            {isEs ? 'Registro Rápido de Impacto' : 'Quick Impact Logging'}
          </span>
          <div className="grid grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => handleSpend(1)}
              className="py-2.5 px-1.5 rounded-2xl bg-white/5 hover:bg-white/10 dark:bg-white/5 dark:hover:bg-white/10 light:bg-slate-100 light:hover:bg-slate-200 border border-white/10 dark:border-white/10 light:border-slate-200 text-center text-xs active:scale-95 transition-all cursor-pointer flex flex-col items-center justify-center shadow-sm"
            >
              <div className="text-amber-300 dark:text-amber-300 light:text-amber-700 font-black text-xs sm:text-sm">-1 🥄</div>
              <div className="text-[10px] text-slate-300 dark:text-slate-300 light:text-slate-700 font-semibold leading-tight mt-0.5 truncate w-full">
                {isEs ? 'Leve' : 'Minor'}
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSpend(2)}
              className="py-2.5 px-1.5 rounded-2xl bg-white/5 hover:bg-white/10 dark:bg-white/5 dark:hover:bg-white/10 light:bg-slate-100 light:hover:bg-slate-200 border border-white/10 dark:border-white/10 light:border-slate-200 text-center text-xs active:scale-95 transition-all cursor-pointer flex flex-col items-center justify-center shadow-sm"
            >
              <div className="text-amber-400 dark:text-amber-400 light:text-amber-800 font-black text-xs sm:text-sm">-2 🥄</div>
              <div className="text-[10px] text-slate-300 dark:text-slate-300 light:text-slate-700 font-semibold leading-tight mt-0.5 truncate w-full">
                {isEs ? 'Social' : 'Social'}
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSpend(3)}
              className="py-2.5 px-1.5 rounded-2xl bg-white/5 hover:bg-white/10 dark:bg-white/5 dark:hover:bg-white/10 light:bg-slate-100 light:hover:bg-slate-200 border border-white/10 dark:border-white/10 light:border-slate-200 text-center text-xs active:scale-95 transition-all cursor-pointer flex flex-col items-center justify-center shadow-sm"
            >
              <div className="text-rose-400 dark:text-rose-400 light:text-rose-700 font-black text-xs sm:text-sm">-3 🥄</div>
              <div className="text-[10px] text-slate-300 dark:text-slate-300 light:text-slate-700 font-semibold leading-tight mt-0.5 truncate w-full">
                {isEs ? 'Sobrecarga' : 'Heavy'}
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleRecharge(1)}
              className="py-2.5 px-1.5 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 dark:bg-cyan-500/10 dark:hover:bg-cyan-500/20 light:bg-cyan-100 light:hover:bg-cyan-200 border border-cyan-500/30 text-center text-xs active:scale-95 transition-all cursor-pointer flex flex-col items-center justify-center shadow-sm"
            >
              <div className="text-cyan-300 dark:text-cyan-300 light:text-cyan-800 font-black text-xs sm:text-sm">+1 🥄</div>
              <div className="text-[10px] text-cyan-300 dark:text-cyan-300 light:text-cyan-800 font-semibold leading-tight mt-0.5 truncate w-full">
                {isEs ? 'Descanso' : 'Rest'}
              </div>
            </button>
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-widest shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
        >
          {isEs ? 'Guardar y Cerrar' : 'Save and Close'}
        </button>

        {/* Reset Confirmation Submodal */}
        <AnimatePresence>
          {isResetConfirmOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-900 dark:bg-slate-900 light:bg-white border border-cyan-500/30 rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 dark:bg-cyan-500/10 light:bg-cyan-100 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400 dark:text-cyan-400 light:text-cyan-700">
                  <RotateCcw size={24} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900">
                    {isEs ? '¿Reiniciar a 12 cucharas?' : 'Reset to 12 spoons?'}
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mt-1">
                    {isEs 
                      ? 'Se restablecerá tu nivel de energía para un nuevo ciclo de descanso.' 
                      : 'Your energy balance will be restored for a fresh rest cycle.'}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsResetConfirmOpen(false)}
                    className="py-3 px-4 rounded-xl bg-white/5 dark:bg-white/5 light:bg-slate-100 hover:bg-white/10 text-slate-300 dark:text-slate-300 light:text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    {isEs ? 'Cancelar' : 'Cancel'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      syncSpoonsAndEnergy(12);
                      setIsResetConfirmOpen(false);
                    }}
                    className="py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-colors shadow-lg shadow-cyan-500/20 cursor-pointer"
                  >
                    {isEs ? 'Reiniciar' : 'Reset'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
