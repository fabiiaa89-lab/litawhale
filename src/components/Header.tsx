import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';
import WhaleLogo from './WhaleLogo';
import { EnergyLevel, AppTheme } from '../types';
import { getEnergyVisual, spoonsToEnergyLevel } from '../utils/energyVisual';

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
  theme: propTheme,
  onToggleTheme
}: HeaderProps) {
  // Local state for energy/spoons if not passed via props
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

  const [currentTheme, setCurrentTheme] = useState<AppTheme>(() => {
    if (propTheme) return propTheme;
    try {
      const saved = localStorage.getItem('ns_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {}
    return 'dark';
  });

  // Keep state synced with events
  useEffect(() => {
    if (typeof propSpoons === 'number') {
      setCurrentSpoons(propSpoons);
    }
  }, [propSpoons]);

  useEffect(() => {
    if (propTheme) {
      setCurrentTheme(propTheme);
    }
  }, [propTheme]);

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

    const handleThemeUpdate = () => {
      try {
        const saved = localStorage.getItem('ns_theme');
        if (saved === 'light' || saved === 'dark') setCurrentTheme(saved);
      } catch (e) {}
    };

    window.addEventListener('ns_spoons_updated', handleSpoonUpdate);
    window.addEventListener('storage', handleSpoonUpdate);
    window.addEventListener('ns_theme_updated', handleThemeUpdate);
    return () => {
      window.removeEventListener('ns_spoons_updated', handleSpoonUpdate);
      window.removeEventListener('storage', handleSpoonUpdate);
      window.removeEventListener('ns_theme_updated', handleThemeUpdate);
    };
  }, []);

  const activeLevel: EnergyLevel = propEnergy ?? spoonsToEnergyLevel(currentSpoons);
  const visual = getEnergyVisual(activeLevel, 15);

  const handleEnergyClick = () => {
    if (onOpenEnergy) {
      onOpenEnergy();
    } else {
      window.dispatchEvent(new CustomEvent('ns_open_energy_modal'));
    }
  };

  const handleThemeToggle = () => {
    if (onToggleTheme) {
      onToggleTheme();
    } else {
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setCurrentTheme(nextTheme);
      try {
        localStorage.setItem('ns_theme', nextTheme);
      } catch (e) {}
      const root = document.documentElement;
      if (nextTheme === 'light') {
        root.classList.add('light');
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
        document.body.style.backgroundColor = '#f4f7fb';
      } else {
        root.classList.add('dark');
        root.classList.remove('light');
        root.setAttribute('data-theme', 'dark');
        document.body.style.backgroundColor = '#0b0e1b';
      }
      window.dispatchEvent(new CustomEvent('ns_theme_updated', { detail: nextTheme }));
    }
  };

  return (
    <div className="flex-none relative z-40 flex items-center justify-between gap-3 px-4 sm:px-5 pt-[max(1rem,calc(env(safe-area-inset-top,0px)+0.6rem))] pb-3 shrink-0 glass-dark border-b border-white/5 transition-colors">
      {/* Left zone: Back button or Logo + Title */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {onBack ? (
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={onBack}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-200 hover:text-white hover:bg-white/10 cursor-pointer backdrop-blur-xl shadow-md ring-1 ring-white/5 shrink-0 transition-all"
            aria-label={document.documentElement.lang === 'en' ? 'Back' : 'Volver'}
          >
            <ArrowLeft size={18} />
          </motion.button>
        ) : (
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl overflow-hidden border border-white/10 shrink-0 p-1.5 bg-white/5 flex items-center justify-center shadow-md">
            <WhaleLogo className="w-full h-full scale-110" glow={false} />
          </div>
        )}
        <h2 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight truncate leading-tight">
          {title}
        </h2>
      </div>

      {/* Right zone: Dynamic Energy indicator + Theme switch */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Dynamic Energy Pill: Icon changes with number! */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleEnergyClick}
          className="glass-card hover:bg-white/10 active:scale-95 transition-all rounded-xl px-2.5 py-1.5 text-xs text-slate-200 cursor-pointer shadow-md flex items-center gap-1.5 h-9 border border-white/10"
          title={`Nivel de Energía: ${activeLevel}/5 · ${currentSpoons}/12 Cucharas`}
          aria-label="Abrir panel de energía y cucharas"
        >
          <span className="flex items-center gap-1">
            {visual.icon}
            <span className={`font-black text-xs ${visual.color}`}>{activeLevel}</span>
          </span>
          <span className="text-white/20 text-[10px]">|</span>
          <span className="text-indigo-300 font-bold flex items-center gap-0.5 text-xs">
            <span>🥄</span>
            <span>{currentSpoons}</span>
          </span>
        </motion.button>

        {/* Theme Toggle Button: Sun/Moon with 44px min touch target */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={handleThemeToggle}
          className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-md cursor-pointer shrink-0"
          aria-label={currentTheme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          title={currentTheme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
        >
          {currentTheme === 'dark' ? (
            <Sun size={16} className="text-amber-400" />
          ) : (
            <Moon size={16} className="text-indigo-400" />
          )}
        </motion.button>
      </div>
    </div>
  );
}
