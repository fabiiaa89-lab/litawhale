import React from 'react';
import { motion } from 'motion/react';
import { Screen, Language, EnergyLevel, AppTheme } from '../../types';
import { 
  Menu, 
  ShieldAlert, 
  Compass, 
  Activity, 
  Waves, 
  MessageSquareHeart, 
  Pill, 
  Headphones, 
  Hourglass, 
  ShieldCheck, 
  Bot,
  ArrowRight
} from 'lucide-react';
import WhaleLogo from '../WhaleLogo';
import { i18n } from '../../i18n';
import PWAInstallBanner from '../PWAInstallBanner';

interface HomeProps {
  language: Language;
  onNavigate: (screen: Screen) => void;
  onOpenEnergy: () => void;
  onOpenMenu: () => void;
  onOpenInstallModal?: () => void;
  energy?: EnergyLevel;
  theme?: AppTheme;
  onToggleTheme?: () => void;
}

export default function Home({ 
  language, 
  onNavigate, 
  onOpenEnergy, 
  onOpenMenu, 
  onOpenInstallModal 
}: HomeProps) {
  const isEs = language === 'es';
  const t = i18n[language].home;

  const spoons = (() => {
    try {
      const saved = localStorage.getItem('ns_spoons');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.remaining === 'number') return parsed.remaining;
      }
    } catch (e) {}
    return 12;
  })();

  const spoonPillStyle = spoons > 6 
    ? 'border-cyan-500/30 text-cyan-300 dark:text-cyan-300 light:text-cyan-800 bg-cyan-500/10 dark:bg-cyan-500/10 light:bg-cyan-50' 
    : spoons > 2 
    ? 'border-amber-500/30 text-amber-300 dark:text-amber-300 light:text-amber-800 bg-amber-500/10 dark:bg-amber-500/10 light:bg-amber-50' 
    : 'border-rose-500/40 text-rose-300 dark:text-rose-300 light:text-rose-800 bg-rose-500/10 dark:bg-rose-500/10 light:bg-rose-50 animate-pulse';

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">
      {/* Optimal Elemental Header: Left Sanctuary Identity + Right Vitality & Menu */}
      <div className="flex items-center justify-between px-4 sm:px-6 pt-4 pb-2 z-20 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-2xl flex items-center justify-center shadow-md relative overflow-hidden group bg-white/5 dark:bg-white/5 light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-300 p-1.5">
             <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-teal-500/20 opacity-50" />
             <WhaleLogo className="relative z-10 w-full h-full scale-110" glow={true} />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-slate-100 dark:text-slate-100 light:text-slate-900 tracking-tight whitespace-nowrap truncate leading-tight">
              Lita-Whale
            </h1>
            <p className="text-[11px] text-cyan-400 dark:text-cyan-400 light:text-cyan-700 font-medium tracking-wide whitespace-nowrap truncate">
              {isEs ? 'Refugio Somático' : 'Somatic Sanctuary'}
            </p>
          </div>
        </div>

        <div className="flex gap-2 shrink-0 items-center">
          
          {/* Botón del Córtex Externo */}
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => window.dispatchEvent(new CustomEvent('open_cortex'))}
            className="h-9 sm:h-10 px-3 rounded-xl bg-[#1E1B4B]/80 hover:bg-[#312E81] border border-indigo-500/30 flex items-center justify-center gap-1.5 text-xs font-bold text-indigo-300 transition-all shadow-md cursor-pointer"
            aria-label="Abrir Córtex Externo"
          >
            <Bot size={16} className="text-indigo-400" />
            <span className="hidden sm:inline">Córtex</span>
          </motion.button>

          {/* Elemental Vitality Pill: Spoons Balance */}
          <motion.button 
            whileTap={{ scale: 0.94 }}
            onClick={onOpenEnergy}
            className={`h-9 sm:h-10 px-3 rounded-xl border flex items-center justify-center gap-1 text-xs font-bold transition-all shadow-md cursor-pointer ${spoonPillStyle}`}
            title={`Cucharas disponibles: ${spoons}/12`}
            aria-label="Cucharas y energía"
          >
            <span className="mr-0.5">🥄</span>
            <span className="tabular-nums font-black">{spoons}</span>
            <span className="text-[10px] opacity-60">/ 12</span>
          </motion.button>

          {/* Lateral Menu Button */}
          <motion.button 
            whileTap={{ scale: 0.92 }}
            onClick={onOpenMenu}
            className="glass hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-slate-100 active:scale-95 transition-all h-9 w-9 sm:h-10 sm:w-10 shrink-0 flex items-center justify-center rounded-xl text-slate-200 dark:text-slate-200 light:text-slate-800 border border-white/10 dark:border-white/10 light:border-slate-300 shadow-md cursor-pointer"
            aria-label="Abrir menú"
          >
            <Menu size={18} />
          </motion.button>
        </div>
      </div>

      {/* Scrollable Content with Safe Mobile Margins */}
      <div className="flex-1 flex flex-col gap-3.5 overflow-y-auto no-scrollbar px-4 sm:px-6 pt-3 pb-[max(5rem,calc(env(safe-area-inset-bottom,0px)+3.5rem))]">
        {onOpenInstallModal && (
          <PWAInstallBanner onOpenModal={onOpenInstallModal} language={language} />
        )}

        {/* SOS Medical Card: High-Impact Authoritative Beacon */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('sos')}
          className="w-full p-4 sm:p-4.5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-rose-950/80 via-slate-900/90 to-rose-950/60 dark:from-rose-950/80 dark:via-slate-900/90 dark:to-rose-950/60 light:from-rose-50 light:via-white light:to-rose-100 shadow-lg border-2 border-rose-500/40 hover:border-rose-500/70 transition-all shrink-0 cursor-pointer text-left flex items-center justify-between gap-3 group relative overflow-hidden"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Duotone Pulse Beacon Icon */}
            <div className="relative shrink-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform shadow-inner">
                <ShieldAlert size={24} className="stroke-[2.2]" />
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full animate-ping shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-rose-400 dark:text-rose-400 light:text-rose-700 bg-rose-500/15 dark:bg-rose-500/15 light:bg-rose-100 px-2 py-0.5 rounded-md border border-rose-500/25">
                  {isEs ? 'EMERGENCIA MÉDICA' : 'MEDICAL EMERGENCY'}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-black text-rose-100 dark:text-rose-100 light:text-rose-950 tracking-tight leading-snug mt-1">
                {t.sosBtn}
              </h2>
              <p className="text-[11px] text-rose-200/80 dark:text-rose-200/80 light:text-rose-800 font-medium leading-snug mt-0.5">
                {isEs 
                  ? 'Ficha clínica, límites sensoriales y contacto de emergencia' 
                  : 'Clinical profile, sensory boundaries & trusted emergency contact'}
              </p>
            </div>
          </div>

          <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-300 dark:text-rose-300 light:text-rose-700 shrink-0 group-hover:translate-x-0.5 transition-transform">
            <ArrowRight size={16} />
          </div>
        </motion.button>

        {/* Crisis Protocol Card */}
        <motion.div 
          whileTap={{ scale: 0.99 }}
          onClick={() => onNavigate('crisis')}
          className="w-full bg-rose-500/10 dark:bg-rose-500/10 light:bg-rose-50/80 backdrop-blur-2xl border-2 border-rose-500/30 dark:border-rose-500/30 light:border-rose-300 rounded-2xl sm:rounded-3xl py-4 sm:py-4.5 px-4 sm:px-5 flex items-center gap-3.5 cursor-pointer shadow-xl relative overflow-hidden shrink-0 min-h-[85px] group"
        >
          <div className="w-3.5 h-3.5 rounded-full bg-rose-500 animate-ping shadow-[0_0_15px_rgba(244,63,94,1)] shrink-0" />
          <div className="relative z-10 text-left flex-1 min-w-0">
            <div className="text-sm sm:text-base font-bold text-rose-100 dark:text-rose-100 light:text-rose-950 tracking-tight leading-snug">
              {t.crisisProtocol}
            </div>
            <div className="text-[11px] sm:text-xs leading-normal text-rose-300/90 dark:text-rose-300/90 light:text-rose-800 mt-0.5 font-medium">
              {t.crisisSub}
            </div>
          </div>
          <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center text-rose-300 dark:text-rose-300 light:text-rose-700 shrink-0 font-bold group-hover:translate-x-0.5 transition-transform">
            <ArrowRight size={16} />
          </div>
        </motion.div>

        {/* 4 Primary Sensory Pillars (Grid with Unified Duotone Badges) */}
        <div className="grid grid-cols-2 gap-3 shrink-0">
          <GridButton 
            icon={<Compass size={24} className="text-cyan-400 dark:text-cyan-400 light:text-cyan-700" />}
            badgeBg="bg-cyan-500/20 dark:bg-cyan-500/20 light:bg-cyan-100 border-cyan-400/35 dark:border-cyan-400/35 light:border-cyan-300"
            label={t.anchor} 
            sub={t.anchorSub} 
            className="bg-cyan-600/10 dark:bg-cyan-600/10 light:bg-cyan-50/70 border-cyan-400/25 dark:border-cyan-400/25 light:border-cyan-300 hover:border-cyan-400/40" 
            onClick={() => onNavigate('anchor')} 
          />
          <GridButton 
            icon={<Activity size={24} className="text-emerald-400 dark:text-emerald-400 light:text-emerald-700" />}
            badgeBg="bg-emerald-500/20 dark:bg-emerald-500/20 light:bg-emerald-100 border-emerald-400/35 dark:border-emerald-400/35 light:border-emerald-300"
            label={t.body} 
            sub={t.bodySub} 
            className="bg-emerald-600/10 dark:bg-emerald-600/10 light:bg-emerald-50/70 border-emerald-400/25 dark:border-emerald-400/25 light:border-emerald-300 hover:border-emerald-400/40" 
            onClick={() => onNavigate('body')} 
          />
          <GridButton 
            icon={<Waves size={24} className="text-purple-400 dark:text-purple-400 light:text-purple-700" />}
            badgeBg="bg-purple-500/20 dark:bg-purple-500/20 light:bg-purple-100 border-purple-400/35 dark:border-purple-400/35 light:border-purple-300"
            label={t.haptic} 
            sub={t.hapticSub} 
            className="bg-purple-600/10 dark:bg-purple-600/10 light:bg-purple-50/70 border-purple-400/25 dark:border-purple-400/25 light:border-purple-300 hover:border-purple-400/40" 
            onClick={() => onNavigate('haptic')} 
          />
          <GridButton 
            icon={<MessageSquareHeart size={24} className="text-teal-400 dark:text-teal-400 light:text-teal-700" />}
            badgeBg="bg-teal-500/20 dark:bg-teal-500/20 light:bg-teal-100 border-teal-400/35 dark:border-teal-400/35 light:border-teal-300"
            label={t.aac} 
            sub={t.aacSub} 
            className="bg-teal-600/10 dark:bg-teal-600/10 light:bg-teal-50/70 border-teal-400/25 dark:border-teal-400/25 light:border-teal-300 hover:border-teal-400/40" 
            onClick={() => onNavigate('cards')} 
          />
        </div>

        {/* Priority Section Label */}
        <div className="mt-1 text-[11px] tracking-wider text-slate-400 dark:text-slate-400 light:text-slate-600 font-bold uppercase px-1">
          {t.priority}
        </div>

        {/* Medication Schedule Card */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('meds')}
          className="w-full bg-white/5 dark:bg-white/5 light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-4.5 flex items-center justify-between cursor-pointer shadow-lg hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-slate-50 transition-all text-left shrink-0 group"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 dark:bg-amber-500/20 light:bg-amber-100 border border-amber-400/35 dark:border-amber-400/35 light:border-amber-300 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              <Pill size={22} className="text-amber-400 dark:text-amber-400 light:text-amber-700 shrink-0" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-sm sm:text-base font-bold text-white dark:text-white light:text-slate-900 block tracking-tight leading-snug">
                {t.meds}
              </span>
              <span className="text-[11px] text-slate-300 dark:text-slate-300 light:text-slate-600 font-medium block mt-0.5 leading-snug">
                {t.medsSub}
              </span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-xl bg-white/5 dark:bg-white/5 light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-200 flex items-center justify-center text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0">
            <ArrowRight size={15} />
          </div>
        </motion.button>

        {/* Isochronic Tones Card */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('isochronic')}
          className="w-full bg-indigo-600/10 dark:bg-indigo-600/10 light:bg-indigo-50/70 border border-indigo-400/25 dark:border-indigo-400/25 light:border-indigo-300 rounded-2xl sm:rounded-3xl p-4 sm:p-4.5 flex items-center gap-3.5 cursor-pointer shadow-lg hover:bg-indigo-600/20 transition-all text-left shrink-0 group relative overflow-hidden"
        >
          <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 dark:bg-indigo-500/20 light:bg-indigo-100 border border-indigo-400/35 dark:border-indigo-400/35 light:border-indigo-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Headphones size={22} className="text-indigo-400 dark:text-indigo-400 light:text-indigo-700 shrink-0" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-sm sm:text-base font-bold text-white dark:text-white light:text-slate-900 block tracking-tight leading-snug">
              {t.isochronicTitle}
            </span>
            <span className="text-[11px] text-indigo-300 dark:text-indigo-300 light:text-indigo-800 font-medium block mt-0.5 leading-snug">
              {t.isochronicSub}
            </span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-400/25 flex items-center justify-center text-indigo-300 dark:text-indigo-300 light:text-indigo-700 shrink-0 group-hover:translate-x-0.5 transition-transform">
            <ArrowRight size={15} />
          </div>
        </motion.button>

        {/* Debts / Future Commitments */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('debts')}
          className="w-full bg-amber-500/10 dark:bg-amber-500/10 light:bg-amber-50/70 border border-amber-400/25 dark:border-amber-400/25 light:border-amber-300 rounded-2xl sm:rounded-3xl p-4 sm:p-4.5 flex items-center gap-3.5 cursor-pointer shadow-lg hover:bg-amber-500/20 transition-all text-left shrink-0 group relative overflow-hidden"
        >
          <div className="w-11 h-11 rounded-2xl bg-amber-500/20 dark:bg-amber-500/20 light:bg-amber-100 border border-amber-400/35 dark:border-amber-400/35 light:border-amber-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Hourglass size={22} className="text-amber-400 dark:text-amber-400 light:text-amber-700 shrink-0" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-sm sm:text-base font-bold text-white dark:text-white light:text-slate-900 block tracking-tight leading-snug">
              {t.debtsTitle}
            </span>
            <span className="text-[11px] text-amber-300/80 dark:text-amber-300/80 light:text-amber-800 font-medium block mt-0.5 leading-snug">
              {t.debtsSub}
            </span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-400/25 flex items-center justify-center text-amber-300 dark:text-amber-300 light:text-amber-700 shrink-0 group-hover:translate-x-0.5 transition-transform">
            <ArrowRight size={15} />
          </div>
        </motion.button>

        {/* Stealth Mode */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('stealth')}
          className="w-full bg-slate-800/40 dark:bg-slate-800/40 light:bg-slate-100 border border-slate-600/30 dark:border-slate-600/30 light:border-slate-300 rounded-2xl sm:rounded-3xl p-4 sm:p-4.5 flex items-center gap-3.5 cursor-pointer shadow-lg hover:bg-slate-800/60 dark:hover:bg-slate-800/60 light:hover:bg-slate-200 transition-all text-left shrink-0 group relative overflow-hidden"
        >
          <div className="w-11 h-11 rounded-2xl bg-slate-700/40 dark:bg-slate-700/40 light:bg-slate-200 border border-slate-500/30 dark:border-slate-500/30 light:border-slate-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <ShieldCheck size={22} className="text-slate-300 dark:text-slate-300 light:text-slate-700 shrink-0" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-sm sm:text-base font-bold text-white dark:text-white light:text-slate-900 block tracking-tight leading-snug">
              {t.stealthTitle}
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-600 font-medium block mt-0.5 leading-snug">
              {t.stealthSub}
            </span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-slate-700/30 border border-slate-600/30 flex items-center justify-center text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0">
            <ArrowRight size={15} />
          </div>
        </motion.button>

        {/* Companion AI Sanctuary */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('companion')}
          className="w-full bg-teal-500/10 dark:bg-teal-500/10 light:bg-teal-50/70 border border-teal-400/25 dark:border-teal-400/25 light:border-teal-300 rounded-2xl sm:rounded-3xl p-4 sm:p-4.5 flex items-center gap-3.5 cursor-pointer shadow-lg hover:bg-teal-500/20 transition-all text-left shrink-0 group relative overflow-hidden"
        >
          <div className="w-11 h-11 rounded-2xl bg-teal-500/20 dark:bg-teal-500/20 light:bg-teal-100 border border-teal-400/35 dark:border-teal-400/35 light:border-teal-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Bot size={22} className="text-teal-400 dark:text-teal-400 light:text-teal-700 shrink-0" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-sm sm:text-base font-bold text-white dark:text-white light:text-slate-900 block tracking-tight leading-snug">
              {t.companionTitle}
            </span>
            <span className="text-[11px] text-teal-300/80 dark:text-teal-300/80 light:text-teal-800 font-medium block mt-0.5 leading-snug">
              {t.companionSub}
            </span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-teal-500/15 border border-teal-400/25 flex items-center justify-center text-teal-300 dark:text-teal-300 light:text-teal-700 shrink-0 group-hover:translate-x-0.5 transition-transform">
            <ArrowRight size={15} />
          </div>
        </motion.button>

        <div className="mt-4 mb-6 text-center opacity-60">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Developed by</p>
          <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 font-bold tracking-tight mt-0.5">Fabiola Aponte</p>
        </div>
      </div>
    </div>
  );
}

function GridButton({
  icon,
  badgeBg = "bg-white/10 border-white/15",
  label,
  sub,
  className = "",
  onClick
}: {
  icon: React.ReactNode;
  badgeBg?: string;
  label: string;
  sub: string;
  className?: string;
  onClick: () => void;
}) {
  return (
    <motion.button 
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`p-4 rounded-3xl border transition-all flex flex-col items-start justify-between min-h-[140px] text-left group shadow-lg cursor-pointer ${className}`}
    >
      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-sm group-hover:scale-105 transition-transform ${badgeBg}`}>
        {icon}
      </div>
      <div className="w-full">
        <span className="font-bold tracking-tight text-white dark:text-white light:text-slate-900 text-sm leading-snug block">
          {label}
        </span>
        <span className="text-[11px] text-slate-300 dark:text-slate-300 light:text-slate-600 font-medium line-clamp-2 mt-0.5 leading-snug block">
          {sub}
        </span>
      </div>
    </motion.button>
  );
}