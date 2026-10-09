import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import WhaleLogo from './WhaleLogo';
import { EnergyLevel, AppTheme } from '../types';
import { spoonsToEnergyLevel } from '../utils/energyVisual';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  titleColor?: string;
  energy?: EnergyLevel;
  spoons?: number;
  onOpenEnergy?: () => void;
  theme?: AppTheme;
  onToggleTheme?: () => void;
}

export default function Header({
  title,
  onBack,
  energy: propEnergy,
  spoons: propSpoons,
  onOpenEnergy,
}: HeaderProps) {
  // Local state for spoons synced with localStorage & events
  const [currentSpoons, setCurrentSpoons] = useState<number>(() => {
    if (typeof propSpoons === 'number') return propSpoons;
    try {
      const saved = localStorage.getItem('ns_spoons');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.remaining === 'number') return parsed.remaining;
      }
    } catch (e) {}
    return 12;
  });

  useEffect(() => {
    if (typeof propSpoons === 'number') {
      setCurrentSpoons(propSpoons);
    }
  }, [propSpoons]);

  useEffect(() => {
    const handleSpoonUpdate = (e: Event) => {
      const custom = e as CustomEvent<number>;
      if (typeof custom.detail === 'number') {
        setCurrentSpoons(custom.detail);
      } else {
        try {
          const saved = localStorage.getItem('ns_spoons');
          if (saved) {
            const parsed = JSON.parse(saved);
            if (typeof parsed.remaining === 'number') setCurrentSpoons(parsed.remaining);
          }
        } catch (err) {}
      }
    };

    window.addEventListener('ns_spoons_updated', handleSpoonUpdate);
    window.addEventListener('storage', handleSpoonUpdate);
    return () => {
      window.removeEventListener('ns_spoons_updated', handleSpoonUpdate);
      window.removeEventListener('storage', handleSpoonUpdate);
    };
  }, []);

  const activeLevel: EnergyLevel = propEnergy ?? spoonsToEnergyLevel(currentSpoons);

  const handleEnergyClick = () => {
    if (onOpenEnergy) {
      onOpenEnergy();
    } else {
      window.dispatchEvent(new CustomEvent('ns_open_energy_modal'));
    }
  };

  // Autonomic state coloration for the Spoons Pill
  const spoonPillStyle = currentSpoons > 6 
    ? 'border-cyan-500/30 text-cyan-300 dark:text-cyan-300 light:text-cyan-800 bg-cyan-500/10 dark:bg-cyan-500/10 light:bg-cyan-50' 
    : currentSpoons > 2 
    ? 'border-amber-500/30 text-amber-300 dark:text-amber-300 light:text-amber-800 bg-amber-500/10 dark:bg-amber-500/10 light:bg-amber-50' 
    : 'border-rose-500/40 text-rose-300 dark:text-rose-300 light:text-rose-800 bg-rose-500/10 dark:bg-rose-500/10 light:bg-rose-50 animate-pulse';

  return (
    <div className="flex-none relative z-40 flex items-center justify-between gap-3 px-4 sm:px-6 pt-[max(1rem,calc(env(safe-area-inset-top,0px)+0.6rem))] pb-3 shrink-0 glass-dark border-b border-white/5 dark:border-white/5 light:border-slate-200 transition-colors">
      {/* Left: Back button or Sanctuary Logo + Title */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {onBack ? (
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-300 flex items-center justify-center text-slate-200 dark:text-slate-200 light:text-slate-800 hover:text-white cursor-pointer backdrop-blur-xl shadow-md shrink-0 transition-all"
            aria-label={document.documentElement.lang === 'en' ? 'Back' : 'Volver'}
          >
            <ArrowLeft size={18} />
          </motion.button>
        ) : (
          <div className="w-10 h-10 rounded-2xl overflow-hidden border border-white/10 dark:border-white/10 light:border-slate-300 shrink-0 p-1.5 bg-white/5 dark:bg-white/5 light:bg-slate-100 flex items-center justify-center shadow-md">
            <WhaleLogo className="w-full h-full scale-110" glow={false} />
          </div>
        )}
        <h2 className="text-base sm:text-lg font-bold text-slate-100 dark:text-slate-100 light:text-slate-900 tracking-tight truncate leading-tight">
          {title}
        </h2>
      </div>

      {/* Right: Elemental Vitality & Spoons Pill */}
      <div className="flex items-center gap-2 shrink-0">
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={handleEnergyClick}
          className={`h-9 px-3 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all shadow-sm cursor-pointer ${spoonPillStyle}`}
          title={`Vitalidad Autonómica: ${activeLevel}/5 · ${currentSpoons}/12 Cucharas`}
          aria-label="Abrir santuario de energía y cucharas"
        >
          <span>🥄</span>
          <span className="tabular-nums font-black">{currentSpoons}</span>
          <span className="text-[10px] opacity-60">/ 12</span>
        </motion.button>
      </div>
    </div>
  );
}
