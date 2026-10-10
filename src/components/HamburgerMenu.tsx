import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { Screen, Profile, EnergyLevel, AppTheme } from '../types';
import { i18n } from '../i18n';
import { X, User, Building2, Globe, ChevronRight, Waves, Coins, Sun, Moon, Gamepad2 } from 'lucide-react';
import WhaleLogo from './WhaleLogo';
import { getEnergyVisual } from '../utils/energyVisual';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
  energy: EnergyLevel;
  theme?: AppTheme;
  onNavigate: (screen: Screen) => void;
  onOpenEnergy: () => void;
  onToggleLanguage: () => void;
  onToggleTheme?: () => void;
}

export default function HamburgerMenu({
  isOpen,
  onClose,
  profile,
  energy,
  theme = 'dark',
  onNavigate,
  onOpenEnergy,
  onToggleLanguage,
  onToggleTheme
}: HamburgerMenuProps) {
  if (!isOpen) return null;

  const t = i18n[profile.language].menu;
  const defaultName = profile.language === 'es' ? 'Usuario' : 'User';
  const displayName = profile.name.trim() || defaultName;

  const handleSelectScreen = (screen: Screen) => {
    onNavigate(screen);
    onClose();
  };

  const energyVisual = getEnergyVisual(energy, 18);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[340px] sm:max-w-sm h-full bg-[#121420] dark:bg-[#121420] light:bg-[#f8fafc] border-l border-white/10 dark:border-white/10 light:border-slate-200 flex flex-col shadow-2xl px-5 sm:px-6 pt-[max(1.25rem,calc(env(safe-area-inset-top,0px)+0.75rem))] pb-[max(2rem,calc(env(safe-area-inset-bottom,0px)+1.5rem))] overflow-y-auto no-scrollbar"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 dark:border-white/10 light:border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-slate-200 border border-white/10 dark:border-white/10 light:border-slate-300 p-1 flex items-center justify-center">
              <WhaleLogo className="w-full h-full scale-110" glow={false} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 dark:text-slate-100 light:text-slate-900 tracking-tight">{t.title}</h2>
              <p className="text-[10px] text-slate-400 dark:text-slate-400 light:text-slate-500 font-medium tracking-wide opacity-80">Lita-Whale</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-slate-200 hover:bg-white/10 active:scale-95 text-slate-300 dark:text-slate-300 light:text-slate-700 flex items-center justify-center transition-all border border-white/10 dark:border-white/10 light:border-slate-300 cursor-pointer"
            aria-label={t.close}
          >
            <X size={18} />
          </button>
        </div>

        {/* Section: Yo soy (I am) */}
        <div className="mt-5">
          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelectScreen('anchor')}
            className="w-full bg-gradient-to-br from-cyan-950/40 via-blue-900/30 to-purple-950/40 border border-cyan-500/30 hover:border-cyan-400/60 rounded-3xl p-4 sm:p-5 text-left transition-all cursor-pointer shadow-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <User size={80} className="text-cyan-300" />
            </div>

            <div className="relative z-10 flex items-center gap-3.5">
              <div className="relative shrink-0">
                {profile.userImage ? (
                  <img
                    src={profile.userImage}
                    alt={displayName}
                    className="w-13 h-13 rounded-2xl object-cover border-2 border-cyan-400/40 shadow-lg"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-13 h-13 rounded-2xl bg-cyan-500/20 border-2 border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-lg">
                    <User size={24} />
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-cyan-500 text-[8px] font-black text-slate-950 uppercase tracking-tighter">
                  {profile.sensitivity}
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <span className="text-base font-bold text-white tracking-tight block truncate drop-shadow-sm">
                  {displayName}
                </span>
                <span className="text-[11px] text-slate-300 font-medium block truncate mt-0.5 opacity-90">
                  {profile.language === 'es' ? 'Perfil sensorial activo' : 'Active sensory profile'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Nav list */}
        <div className="mt-4 space-y-2 flex-1">
          {/* Tonos Isocrónicos */}
          <MenuItem
            icon={<Waves size={18} className="text-blue-400" />}
            title={t.isochronic}
            subtitle={profile.language === 'es' ? 'Sincronización cerebral & rescate' : 'Brainwave synchronization'}
            onClick={() => handleSelectScreen('isochronic')}
          />

          {/* Compromisos Futuros */}
          <MenuItem
            icon={<Coins size={18} className="text-amber-400" />}
            title={t.debts}
            subtitle={profile.language === 'es' ? 'Gestión lógica de deudas' : 'Logical debt management'}
            onClick={() => handleSelectScreen('debts')}
          />

          {/* Modo Trabajo (Stealth) */}
          <MenuItem
            icon={<Building2 size={18} className="text-slate-400" />}
            title={t.stealth}
            subtitle={profile.language === 'es' ? 'Regulación discreta anti-crisis' : 'Discreet sensory regulation'}
            onClick={() => handleSelectScreen('stealth')}
          />

          {/* Entretenimiento Calmante (Minijuegos & Spinner) */}
          <MenuItem
            icon={<Gamepad2 size={18} className="text-cyan-400" />}
            title={profile.language === 'es' ? 'Entretenimiento Calmante' : 'Calming Entertainment'}
            subtitle={profile.language === 'es' ? 'Fidget Spinner, Sudoku Zen & Palabras' : 'Fidget Spinner, Zen Sudoku & Words'}
            onClick={() => handleSelectScreen('arcade')}
          />

          {/* Carga Cognitiva con Icono Dinámico */}
          <MenuItem
            icon={energyVisual.icon}
            title={t.energy}
            subtitle={`Nivel actual: ${energy}/5 · ${profile.language === 'es' ? energyVisual.labelEs : energyVisual.labelEn}`}
            onClick={() => {
              onClose();
              onOpenEnergy();
            }}
          />

          {/* Ajustes */}
          <MenuItem
            icon={<span className="text-base">⚙️</span>}
            title={t.settings || (profile.language === 'es' ? 'Ajustes' : 'Settings')}
            subtitle={profile.language === 'es' ? 'Personalizar entorno y perfil' : 'Customize profile and sanctuary'}
            onClick={() => handleSelectScreen('settings')}
          />
        </div>

        {/* Footer: Quick controls (Language + Theme Switch) */}
        <div className="mt-4 pt-4 border-t border-white/10 dark:border-white/10 light:border-slate-200 space-y-2.5">
          {/* Theme Switcher in Menu */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="w-full py-3 px-4 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-white hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-slate-100 active:scale-95 transition-all border border-white/10 dark:border-white/10 light:border-slate-200 text-white dark:text-white light:text-slate-900 font-bold flex items-center justify-between text-xs cursor-pointer shadow-sm"
            >
              <div className="flex items-center gap-2.5 text-slate-300 dark:text-slate-300 light:text-slate-700">
                {theme === 'dark' ? <Moon size={16} className="text-indigo-400" /> : <Sun size={16} className="text-amber-500" />}
                <span>{profile.language === 'es' ? 'Tema Visual' : 'Theme Mode'}</span>
              </div>
              <span className="text-cyan-400 dark:text-cyan-400 light:text-cyan-700 font-bold uppercase px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[10px]">
                {theme === 'dark' ? (profile.language === 'es' ? 'Oscuro' : 'Dark') : (profile.language === 'es' ? 'Claro' : 'Light')}
              </span>
            </button>
          )}

          {/* Language Switcher */}
          <button
            onClick={onToggleLanguage}
            className="w-full py-3 px-4 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-white hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-slate-100 active:scale-95 transition-all border border-white/10 dark:border-white/10 light:border-slate-200 text-white dark:text-white light:text-slate-900 font-bold flex items-center justify-between text-xs cursor-pointer shadow-sm"
          >
            <div className="flex items-center gap-2.5 text-slate-300 dark:text-slate-300 light:text-slate-700">
              <Globe size={16} className="text-cyan-400 dark:text-cyan-400 light:text-cyan-700" />
              <span>{t.language}</span>
            </div>
            <span className="text-cyan-400 dark:text-cyan-400 light:text-cyan-700 font-bold uppercase px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[10px]">
              {profile.language.toUpperCase()}
            </span>
          </button>

          <div className="text-center pt-1">
            <p className="text-[10px] text-cyan-300 dark:text-cyan-300 light:text-cyan-800 font-bold uppercase tracking-wider">
              {profile.name || (profile.language === 'es' ? 'Tu Espacio Seguro' : 'Your Safe Space')}
            </p>
            <p className="text-[8px] text-slate-400 dark:text-slate-400 light:text-slate-500 font-medium uppercase tracking-widest mt-0.5 opacity-80">
              {profile.language === 'es' 
                ? 'Soporte Neurodivergente · TDAH · Ansiedad · Sensorial' 
                : 'Neurodivergent Support · ADHD · Anxiety · Sensory'}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function MenuItem({
  icon,
  title,
  subtitle,
  onClick,
  highlight = false
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
  highlight?: boolean;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full p-3 rounded-2xl transition-all flex items-center gap-3 text-left border cursor-pointer ${
        highlight
          ? 'bg-white/10 dark:bg-white/10 light:bg-slate-200 hover:bg-white/15 border-white/20 dark:border-white/20 light:border-slate-300 shadow-md'
          : 'bg-white/5 dark:bg-white/5 light:bg-white hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-slate-100 border-white/5 dark:border-white/5 light:border-slate-200 shadow-sm'
      }`}
    >
      <div className="w-8 h-8 rounded-xl bg-white/5 dark:bg-white/5 light:bg-slate-100 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold text-white dark:text-white light:text-slate-900 tracking-tight truncate">{title}</p>
        <p className="text-[10px] text-slate-400 dark:text-slate-400 light:text-slate-500 font-medium tracking-tight truncate leading-tight mt-0.5">{subtitle}</p>
      </div>
      <ChevronRight size={14} className="text-slate-500 dark:text-slate-500 light:text-slate-400 shrink-0" />
    </motion.button>
  );
}
