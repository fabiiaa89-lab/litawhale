import { motion } from 'motion/react';
import { EnergyLevel, Screen, Language, AppTheme } from '../../types';
import { BrainCircuit, Menu, ShieldAlert, Sun, Moon } from 'lucide-react';
import { i18n } from '../../i18n';
import WhaleLogo from '../WhaleLogo';
import PWAInstallBanner from '../PWAInstallBanner';
import { getEnergyVisual, spoonsToEnergyLevel } from '../../utils/energyVisual';

interface HomeProps {
  energy: EnergyLevel;
  language: Language;
  theme?: AppTheme;
  onNavigate: (screen: Screen) => void;
  onOpenEnergy: () => void;
  onOpenMenu: () => void;
  onToggleTheme?: () => void;
  onOpenInstallModal?: () => void;
}

export default function Home({
  energy,
  language,
  theme = 'dark',
  onNavigate,
  onOpenEnergy,
  onOpenMenu,
  onToggleTheme,
  onOpenInstallModal
}: HomeProps) {
  const t = i18n[language].home;

  // Read current spoons from localStorage or state
  const spoons = (() => {
    try {
      const saved = localStorage.getItem('ns_spoons');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.remaining === 'number') return parsed.remaining;
      }
    } catch (e) {}
    const spoonMap: Record<EnergyLevel, number> = { 1: 1, 2: 4, 3: 7, 4: 10, 5: 12 };
    return spoonMap[energy] || 12;
  })();

  // Synchronize energy level directly with spoon theory:
  const currentEnergyLevel: EnergyLevel = spoonsToEnergyLevel(spoons);
  const energyVisual = getEnergyVisual(currentEnergyLevel, 16);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-transparent">
      {/* Fixed Header with Dynamic Energy Icon & Theme Switcher */}
      <div className="flex justify-between items-center px-4 sm:px-5 pt-[max(1rem,calc(env(safe-area-inset-top,0px)+0.6rem))] pb-3 gap-2 shrink-0 border-b border-white/5 glass-dark transition-colors">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-2xl flex items-center justify-center shadow-md relative overflow-hidden group bg-white/5 border border-white/10 p-1.5">
             <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-cyan-500/20 opacity-50" />
             <WhaleLogo className="relative z-10 w-full h-full scale-110" glow={true} />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight whitespace-nowrap truncate leading-tight">Lita-Whale</h1>
            <p className="text-[11px] text-cyan-300 font-medium tracking-wide whitespace-nowrap truncate">{t.cortex}</p>
          </div>
        </div>

        <div className="flex gap-1.5 shrink-0 items-center">
          {/* Dynamic Energy & Spoons Button: Icon changes with level! */}
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={onOpenEnergy}
            className="glass-card hover:bg-white/10 active:scale-95 transition-all rounded-xl px-2.5 sm:px-3 py-1.5 text-xs text-slate-200 cursor-pointer shadow-md flex items-center gap-1.5 h-9 sm:h-10 border border-white/10"
            title={`${t.battery} (${currentEnergyLevel}/5) · Cucharas (${spoons}/12)`}
            aria-label="Carga cognitiva y cucharas"
          >
            <span className="flex items-center gap-1">
              {energyVisual.icon}
              <span className={`font-black text-xs sm:text-sm ${energyVisual.color}`}>{currentEnergyLevel}</span>
            </span>
            <span className="text-white/20 text-[10px]">|</span>
            <span className="text-indigo-300 font-bold flex items-center gap-0.5 text-xs sm:text-sm">
              <span>🥄</span>
              <span>{spoons}</span>
            </span>
          </motion.button>

          {/* Theme Toggle Button: Sun/Moon */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={onToggleTheme}
            className="glass hover:bg-white/10 active:scale-95 transition-all h-9 w-9 sm:h-10 sm:w-10 shrink-0 flex items-center justify-center rounded-xl text-slate-300 hover:text-white border border-white/10 shadow-md cursor-pointer"
            title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
            aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {theme === 'dark' ? (
              <Sun size={17} className="text-amber-400" />
            ) : (
              <Moon size={17} className="text-indigo-400" />
            )}
          </motion.button>

          {/* AI Cortex Button */}
          <motion.button 
            whileTap={{ scale: 0.92 }}
            onClick={() => onNavigate('ai')}
            className="glass hover:bg-white/10 active:scale-95 transition-all h-9 w-9 sm:h-10 sm:w-10 shrink-0 flex items-center justify-center rounded-xl text-cyan-300 border border-cyan-500/30 shadow-md"
            title="AI Cortex"
            aria-label="AI Cortex"
          >
            <BrainCircuit size={17} />
          </motion.button>

          {/* Menu Button */}
          <motion.button 
            whileTap={{ scale: 0.92 }}
            onClick={onOpenMenu}
            className="glass hover:bg-white/10 active:scale-95 transition-all h-9 w-9 sm:h-10 sm:w-10 shrink-0 flex items-center justify-center rounded-xl text-slate-200 border border-white/10 shadow-md"
            aria-label="Abrir menú"
          >
            <Menu size={18} />
          </motion.button>
        </div>
      </div>

      {/* Scrollable Content with Safe Mobile Margins */}
      <div className="flex-1 flex flex-col gap-3.5 overflow-y-auto no-scrollbar px-4 sm:px-6 pt-3.5 pb-[max(5rem,calc(env(safe-area-inset-bottom,0px)+3.5rem))]">
        {onOpenInstallModal && (
          <PWAInstallBanner onOpenModal={onOpenInstallModal} language={language} />
        )}

        {/* SOS Medical Button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('sos')}
          className="w-full py-3.5 sm:py-4 px-4 rounded-2xl sm:rounded-3xl bg-[#1a1518] shadow-md border border-rose-500/25 flex items-center justify-center gap-2.5 hover:bg-[#22161b] transition-all shrink-0 cursor-pointer"
        >
          <span className="text-rose-500 flex items-center justify-center shrink-0">
            <ShieldAlert size={20} strokeWidth={2.4} />
          </span>
          <span className="text-xs sm:text-sm font-bold text-rose-100 uppercase tracking-wider text-center">
            {t.sosBtn}
          </span>
        </motion.button>

        {/* Crisis Protocol Card */}
        <motion.div 
          whileTap={{ scale: 0.99 }}
          onClick={() => onNavigate('crisis')}
          className="w-full bg-rose-500/10 backdrop-blur-2xl border-2 border-rose-500/30 rounded-2xl sm:rounded-3xl py-4 sm:py-5 px-5 flex items-center gap-4 cursor-pointer shadow-xl relative overflow-hidden shrink-0 min-h-[90px]"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <div className="w-24 h-24 rounded-full bg-rose-500 blur-3xl" />
          </div>
          <div className="w-3.5 h-3.5 rounded-full bg-rose-500 animate-ping shadow-[0_0_15px_rgba(244,63,94,1)] shrink-0" />
          <div className="relative z-10 text-left flex-1 min-w-0">
            <div className="text-base sm:text-lg font-bold text-rose-100 tracking-tight leading-snug">
              {t.crisisProtocol}
            </div>
            <div className="text-[11px] sm:text-xs leading-normal text-rose-300/90 mt-0.5 font-medium">
              {t.crisisSub}
            </div>
          </div>
          <div className="text-xl text-rose-300 opacity-60 shrink-0 font-bold">→</div>
        </motion.div>

        {/* 4 Primary Sensory Pillars (Grid) */}
        <div className="grid grid-cols-2 gap-3 shrink-0">
          <GridButton 
            icon="📍" 
            label={t.anchor} 
            sub={t.anchorSub} 
            className="bg-blue-600/10 backdrop-blur-xl border border-blue-400/25 hover:border-blue-400/40" 
            onClick={() => onNavigate('anchor')} 
          />
          <GridButton 
            icon="🧘" 
            label={t.body} 
            sub={t.bodySub} 
            className="bg-emerald-600/10 backdrop-blur-xl border border-emerald-400/25 hover:border-emerald-400/40" 
            onClick={() => onNavigate('body')} 
          />
          <GridButton 
            icon="〰️" 
            label={t.haptic} 
            sub={t.hapticSub} 
            className="bg-purple-600/10 backdrop-blur-xl border border-purple-400/25 hover:border-purple-400/40" 
            onClick={() => onNavigate('haptic')} 
          />
          <GridButton 
            icon="💬" 
            label={t.aac} 
            sub={t.aacSub} 
            className="bg-cyan-600/10 backdrop-blur-xl border border-cyan-400/25 hover:border-cyan-400/40" 
            onClick={() => onNavigate('cards')} 
          />
        </div>

        {/* Priority Section Label */}
        <div className="mt-1 text-[11px] tracking-wider text-slate-400 font-bold uppercase px-1">
          {t.priority}
        </div>

        {/* Medication Schedule Card */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('meds')}
          className="w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex items-center justify-between cursor-pointer shadow-lg hover:bg-white/10 transition-all text-left shrink-0"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <span className="text-3xl drop-shadow-md shrink-0">💊</span>
            <div className="min-w-0 flex-1">
              <span className="text-base sm:text-lg font-bold text-white block tracking-tight leading-snug">
                {t.meds}
              </span>
              <span className="text-[11px] text-slate-400 font-medium block mt-0.5 leading-snug">
                {t.medsSub}
              </span>
            </div>
          </div>
          <div className="h-7 w-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          </div>
        </motion.button>

        {/* Isochronic Tones Card */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('isochronic')}
          className="w-full bg-indigo-600/10 backdrop-blur-2xl border border-indigo-400/25 rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex items-center gap-3.5 cursor-pointer shadow-lg hover:bg-indigo-600/20 transition-all text-left shrink-0 group relative overflow-hidden"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-xl shrink-0">
            🌊
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-base sm:text-lg font-bold text-white block tracking-tight leading-snug">
              {t.isochronicTitle}
            </span>
            <span className="text-[11px] text-indigo-300 font-medium block mt-0.5 leading-snug">
              {t.isochronicSub}
            </span>
          </div>
          <div className="text-lg text-indigo-300 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0">
            →
          </div>
        </motion.button>

        {/* Debts / Future Commitments */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('debts')}
          className="w-full bg-amber-500/10 backdrop-blur-2xl border border-amber-400/25 rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex items-center gap-3.5 cursor-pointer shadow-lg hover:bg-amber-500/20 transition-all text-left shrink-0 group relative overflow-hidden"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-amber-500/20 flex items-center justify-center text-xl shrink-0">
            ⏳
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-base sm:text-lg font-bold text-white block tracking-tight leading-snug">
              {t.debtsTitle}
            </span>
            <span className="text-[11px] text-amber-300/80 font-medium block mt-0.5 leading-snug">
              {t.debtsSub}
            </span>
          </div>
          <div className="text-lg text-amber-300 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0">
            →
          </div>
        </motion.button>

        {/* Stealth Mode */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('stealth')}
          className="w-full bg-slate-800/40 backdrop-blur-2xl border border-slate-600/30 rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex items-center gap-3.5 cursor-pointer shadow-lg hover:bg-slate-800/60 transition-all text-left shrink-0 group relative overflow-hidden"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-slate-700/40 border border-slate-500/30 flex items-center justify-center text-xl shrink-0">
            🏢
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-base sm:text-lg font-bold text-white block tracking-tight leading-snug">
              {t.stealthTitle}
            </span>
            <span className="text-[11px] text-slate-400 font-medium block mt-0.5 leading-snug">
              {t.stealthSub}
            </span>
          </div>
          <div className="text-lg text-slate-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0">
            →
          </div>
        </motion.button>

        {/* Companion AI Sanctuary */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('companion')}
          className="w-full bg-teal-500/10 backdrop-blur-2xl border border-teal-400/25 rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex items-center gap-3.5 cursor-pointer shadow-lg hover:bg-teal-500/20 transition-all text-left shrink-0 group relative overflow-hidden"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-teal-500/20 flex items-center justify-center text-xl shrink-0">
            🪷
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-base sm:text-lg font-bold text-white block tracking-tight leading-snug">
              {t.companionTitle}
            </span>
            <span className="text-[11px] text-teal-300/80 font-medium block mt-0.5 leading-snug">
              {t.companionSub}
            </span>
          </div>
          <div className="text-lg text-teal-300 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0">
            →
          </div>
        </motion.button>

        <div className="mt-4 mb-6 text-center opacity-60">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Developed by</p>
          <p className="text-xs text-slate-400 font-bold tracking-tight mt-0.5">Fabiola Aponte</p>
        </div>
      </div>
    </div>
  );
}

function GridButton({
  icon,
  label,
  sub,
  className = "",
  onClick
}: {
  icon: string;
  label: string;
  sub: string;
  className?: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`min-h-[135px] sm:min-h-[145px] flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl p-4 cursor-pointer text-white shadow-lg group transition-all text-center ${className}`}
    >
      <span className="text-3xl sm:text-4xl mb-2 drop-shadow-md opacity-90 group-hover:scale-110 transition-transform select-none">
        {icon}
      </span>
      <span className="text-sm sm:text-base font-bold tracking-tight text-white leading-tight block w-full px-1">
        {label}
      </span>
      <span className="text-[10px] font-medium tracking-wide opacity-75 mt-1 block uppercase">
        {sub}
      </span>
    </motion.button>
  );
}
