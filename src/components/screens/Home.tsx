import { motion } from 'motion/react';
import { EnergyLevel, Screen, Language } from '../../types';
import { Settings, BrainCircuit, Menu, ShieldAlert } from 'lucide-react';
import { i18n } from '../../i18n';
import WhaleLogo from '../WhaleLogo';
import PWAInstallBanner from '../PWAInstallBanner';

interface HomeProps {
  energy: EnergyLevel;
  language: Language;
  onNavigate: (screen: Screen) => void;
  onOpenEnergy: () => void;
  onOpenMenu: () => void;
  onOpenInstallModal?: () => void;
}

export default function Home({ energy, language, onNavigate, onOpenEnergy, onOpenMenu, onOpenInstallModal }: HomeProps) {
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
  // 11-12 spoons -> Level 5 (Máxima)
  // 9-10 spoons  -> Level 4 (Alta)
  // 6-8 spoons   -> Level 3 (Media)
  // 3-5 spoons   -> Level 2 (Baja)
  // 0-2 spoons   -> Level 1 (Crítica)
  const currentEnergyLevel: EnergyLevel = (() => {
    if (spoons <= 2) return 1;
    if (spoons <= 5) return 2;
    if (spoons <= 8) return 3;
    if (spoons <= 10) return 4;
    return 5;
  })();

  return (
    <div className="flex flex-col h-full overflow-hidden bg-transparent">
      {/* Fixed Header */}
      <div className="flex justify-between items-center px-4 sm:px-5 pt-[max(1.25rem,calc(env(safe-area-inset-top,0px)+0.75rem))] pb-3.5 gap-2 shrink-0 border-b border-white/5 bg-slate-950/40 backdrop-blur-md">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden group bg-white/5 border border-white/10 p-1.5">
             <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-cyan-500/20 opacity-50" />
             <WhaleLogo className="relative z-10 w-full h-full scale-110" glow={true} />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-slate-100 tracking-tight whitespace-nowrap truncate leading-tight">Lita-Whale</h1>
            <p className="text-[11px] text-cyan-300/80 font-medium tracking-wide whitespace-nowrap truncate">{t.cortex}</p>
          </div>
        </div>
        <div className="flex gap-1.5 shrink-0 items-center">
          <button 
            onClick={onOpenEnergy}
            className="glass-card hover:bg-white/10 active:scale-95 transition-all rounded-xl px-2.5 sm:px-3 py-2 text-xs text-slate-300 cursor-pointer shadow-xl flex items-center gap-1.5 h-10 border border-white/10"
            title={`${t.battery} (${currentEnergyLevel}/5) & Cucharas (${spoons}/12)`}
          >
            <span className="text-amber-400 font-bold flex items-center gap-0.5">
              <span>⚡</span>
              <span className="font-semibold text-xs sm:text-sm">{currentEnergyLevel}</span>
            </span>
            <span className="text-white/20">|</span>
            <span className="text-indigo-300 font-bold flex items-center gap-0.5">
              <span>🥄</span>
              <span className="font-semibold text-xs sm:text-sm">{spoons}</span>
            </span>
          </button>
          <button 
            onClick={() => onNavigate('ai')}
            className="glass hover:bg-white/10 active:scale-95 transition-all h-10 w-10 shrink-0 flex items-center justify-center rounded-xl text-indigo-300 border border-indigo-500/30 shadow-lg"
            title="AI Cortex"
          >
            <BrainCircuit size={18} />
          </button>
          <button 
            onClick={onOpenMenu}
            className="glass hover:bg-white/10 active:scale-95 transition-all h-10 w-10 shrink-0 flex items-center justify-center rounded-xl text-cyan-300 border border-cyan-500/30 shadow-lg"
            aria-label="Abrir menú"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto no-scrollbar px-6 pt-4 pb-[max(5rem,calc(env(safe-area-inset-bottom,0px)+4rem))]">
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => onNavigate('sos')}
        className="w-full py-4 sm:py-5 px-3 rounded-[32px] bg-[#1a1518] shadow-lg border border-rose-500/20 flex items-center justify-center gap-2.5 sm:gap-3 hover:bg-[#20171a] transition-colors shrink-0"
      >
        <span className="text-rose-500 flex items-center justify-center shrink-0">
          <ShieldAlert size={22} strokeWidth={2.5} />
        </span>
        <span className="text-xs sm:text-sm font-black text-rose-50 uppercase tracking-[2px] sm:tracking-[3px] text-center">{t.sosBtn}</span>
      </motion.button>

      <motion.div 
        whileTap={{ scale: 0.99 }}
        onClick={() => onNavigate('crisis')}
        className="w-full bg-rose-500/10 backdrop-blur-2xl border-2 border-rose-500/30 rounded-[32px] py-6 px-6 flex items-center gap-5 cursor-pointer shadow-2xl relative overflow-hidden shrink-0 min-h-[100px]"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <div className="w-24 h-24 rounded-full bg-rose-500 blur-3xl" />
        </div>
        <div className="w-4 h-4 rounded-full bg-rose-500 animate-ping shadow-[0_0_20px_rgba(244,63,94,1)] shrink-0" />
        <div className="relative z-10 text-left">
          <div className="text-lg font-black text-rose-100 uppercase tracking-tighter">{t.crisisProtocol}</div>
          <div className="text-[11px] leading-snug text-rose-400 mt-1 font-bold opacity-80 uppercase">{t.crisisSub}</div>
        </div>
        <div className="ml-auto text-2xl text-rose-300 opacity-40">→</div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 shrink-0">
        <GridButton 
          icon="📍" 
          label={t.anchor} 
          sub={t.anchorSub} 
          className="bg-blue-600/10 backdrop-blur-xl border border-blue-400/30" 
          onClick={() => onNavigate('anchor')} 
        />
        <GridButton 
          icon="🧘" 
          label={t.body} 
          sub={t.bodySub} 
          className="bg-emerald-600/10 backdrop-blur-xl border border-emerald-400/30" 
          onClick={() => onNavigate('body')} 
        />
        <GridButton 
          icon="〰️" 
          label={t.haptic} 
          sub={t.hapticSub} 
          className="bg-purple-600/10 backdrop-blur-xl border border-purple-400/30" 
          onClick={() => onNavigate('haptic')} 
        />
        <GridButton 
          icon="💬" 
          label={t.aac} 
          sub={t.aacSub} 
          className="bg-cyan-600/10 backdrop-blur-xl border border-cyan-400/30" 
          onClick={() => onNavigate('cards')} 
        />
      </div>

      <div className="mt-2 text-[10px] uppercase tracking-[4px] text-slate-500 font-black px-1">{t.priority}</div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => onNavigate('meds')}
        className="w-full bg-white/5 backdrop-blur-2xl border-2 border-white/10 rounded-[32px] p-6 flex items-center justify-between cursor-pointer shadow-3xl hover:bg-white/10 transition-all font-sans shrink-0"
      >
        <div className="flex items-center gap-4">
          <span className="text-4xl drop-shadow-md">💊</span>
          <div className="text-left">
            <span className="text-lg font-black text-white block uppercase tracking-tighter">{t.meds}</span>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{t.medsSub}</span>
          </div>
        </div>
        <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-amber-500 animate-pulse" />
        </div>
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => onNavigate('isochronic')}
        className="w-full bg-indigo-600/15 backdrop-blur-2xl border-2 border-indigo-400/30 rounded-[32px] p-6 flex items-center gap-4 cursor-pointer shadow-3xl hover:bg-indigo-600/25 transition-all text-left shrink-0 group relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
          <div className="w-20 h-20 rounded-full bg-indigo-400 blur-2xl" />
        </div>
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-2xl shrink-0">
          🌊
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-lg font-black text-white block uppercase tracking-tighter truncate">{t.isochronicTitle}</span>
          <span className="text-[10px] uppercase tracking-widest text-indigo-300 font-bold block truncate">{t.isochronicSub}</span>
        </div>
        <div className="text-xl text-indigo-300 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">→</div>
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => onNavigate('debts')}
        className="w-full bg-indigo-500/10 backdrop-blur-2xl border border-indigo-400/20 rounded-[32px] p-6 flex items-center gap-4 cursor-pointer shadow-3xl hover:bg-indigo-500/20 transition-all text-left shrink-0 group relative overflow-hidden"
      >
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-2xl shrink-0">
          ⏳
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-lg font-black text-white block uppercase tracking-tighter truncate">{t.debtsTitle}</span>
          <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold block truncate">{t.debtsSub}</span>
        </div>
        <div className="text-xl text-indigo-300 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">→</div>
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => onNavigate('stealth')}
        className="w-full bg-slate-800/40 backdrop-blur-2xl border-2 border-slate-600/30 rounded-[32px] p-6 flex items-center gap-4 cursor-pointer shadow-3xl hover:bg-slate-800/60 transition-all text-left shrink-0 group relative overflow-hidden"
      >
        <div className="w-12 h-12 rounded-2xl bg-slate-700/40 border border-slate-500/30 flex items-center justify-center text-2xl shrink-0">
          🏢
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-base sm:text-lg font-black text-white block uppercase tracking-tighter leading-tight">{t.stealthTitle}</span>
          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mt-0.5">{t.stealthSub}</span>
        </div>
        <div className="text-xl text-slate-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">→</div>
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => onNavigate('companion')}
        className="w-full bg-teal-500/10 backdrop-blur-2xl border border-teal-400/20 rounded-[32px] p-6 flex items-center gap-4 cursor-pointer shadow-3xl hover:bg-teal-500/20 transition-all text-left shrink-0 group relative overflow-hidden"
      >
        <div className="w-12 h-12 rounded-2xl bg-teal-500/20 flex items-center justify-center text-xl shrink-0">
          🪷
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-base sm:text-lg font-black text-white block uppercase tracking-tighter leading-tight">{t.companionTitle}</span>
          <span className="text-[10px] uppercase tracking-widest text-teal-400 font-bold block mt-0.5">{t.companionSub}</span>
        </div>
        <div className="text-xl text-teal-300 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">→</div>
      </motion.button>

      <div className="mt-4 mb-12 text-center opacity-60">
        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Developed by</p>
        <p className="text-xs text-slate-400 font-bold tracking-tight mt-1 uppercase">Fabiola Aponte</p>
      </div>
      </div>
    </div>
  );
}

function GridButton({ icon, label, sub, className, onClick }: any) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`h-[160px] flex flex-col items-center justify-center rounded-[32px] p-6 cursor-pointer text-white shadow-xl group transition-all ${className}`}
    >
      <span className="text-4xl mb-3 drop-shadow-2xl opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform">{icon}</span>
      <span className="text-base font-black tracking-tighter uppercase">{label}</span>
      <span className="text-[10px] font-bold tracking-[3px] opacity-40 mt-1">{sub}</span>
    </motion.button>
  );
}
