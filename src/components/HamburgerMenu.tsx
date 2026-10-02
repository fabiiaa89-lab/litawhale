import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { Screen, Profile, EnergyLevel, Language } from '../types';
import { i18n } from '../i18n';
import { X, Settings, User, HeartPulse, Sparkles, Building2, ShieldAlert, BatteryCharging, Globe, ChevronRight, Compass, Waves, Coins, Crown, Package, BookOpen, ClipboardList } from 'lucide-react';
import WhaleLogo from './WhaleLogo';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
  energy: EnergyLevel;
  onNavigate: (screen: Screen) => void;
  onOpenEnergy: () => void;
  onToggleLanguage: () => void;
}

export default function HamburgerMenu({
  isOpen,
  onClose,
  profile,
  energy,
  onNavigate,
  onOpenEnergy,
  onToggleLanguage
}: HamburgerMenuProps) {
  if (!isOpen) return null;

  const t = i18n[profile.language].menu;
  const defaultName = profile.language === 'es' ? 'Usuario' : 'User';
  const displayName = profile.name.trim() || defaultName;

  const handleSelectScreen = (screen: Screen) => {
    onNavigate(screen);
    onClose();
  };

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
        className="w-full max-w-[340px] sm:max-w-sm h-full bg-[#121420]/95 border-l border-white/10 flex flex-col shadow-2xl px-6 pt-[max(1.5rem,calc(env(safe-area-inset-top,0px)+1rem))] pb-[max(2rem,calc(env(safe-area-inset-bottom,0px)+1.5rem))] overflow-y-auto no-scrollbar"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 p-1 flex items-center justify-center">
              <WhaleLogo className="w-full h-full scale-110" glow={false} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 tracking-tight">{t.title}</h2>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide opacity-80">Lita-Whale</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 text-slate-300 flex items-center justify-center transition-all border border-white/10"
            aria-label={t.close}
          >
            <X size={18} />
          </button>
        </div>

        {/* Section: Yo soy (I am) */}
        <div className="mt-6">
          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelectScreen('anchor')}
            className="w-full bg-gradient-to-br from-cyan-950/40 via-blue-900/30 to-purple-950/40 border border-cyan-500/30 hover:border-cyan-400/60 rounded-3xl p-5 text-left transition-all cursor-pointer shadow-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <User size={80} className="text-cyan-300" />
            </div>

            <div className="relative z-10 flex items-center gap-4">
              <div className="relative shrink-0">
                {profile.userImage ? (
                  <img
                    src={profile.userImage}
                    alt={displayName}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-400/40 shadow-lg"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border-2 border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-lg">
                    <User size={26} />
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-cyan-500 text-[8px] font-black text-slate-950 uppercase tracking-tighter">
                  {profile.sensitivity}
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-cyan-400 font-black uppercase tracking-widest block">
                  {t.iam}
                </span>
                <span className="text-lg font-black text-white uppercase tracking-tight block truncate drop-shadow-sm">
                  {displayName}
                </span>
                <span className="text-[10px] text-slate-400 font-bold tracking-tight block truncate mt-0.5 opacity-80">
                  {t.iamSubtitle}
                </span>
              </div>

              <ChevronRight size={18} className="text-cyan-400 shrink-0 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </div>
          </motion.div>
        </div>

        {/* Section: Menu Items */}
        <div className="mt-6 space-y-2.5 flex-1">
          {/* Membresía Pro / Funciones Pagas */}
          <MenuItem
            icon={<Crown size={18} className="text-amber-400" />}
            title={t.premium}
            subtitle={t.premiumSubtitle}
            onClick={() => handleSelectScreen('premium')}
            highlight
          />

          {/* Registro Sensorial (Bitácora de Meltdowns & Shutdowns) */}
          <MenuItem
            icon={<ClipboardList size={18} className="text-cyan-400" />}
            title={t.sensoryLog}
            subtitle={t.sensoryLogSubtitle}
            onClick={() => handleSelectScreen('sensory-log')}
          />

          {/* Kit de Supervivencia Sensorial */}
          <MenuItem
            icon={<Package size={18} className="text-indigo-400" />}
            title={t.kit}
            subtitle={t.kitSubtitle}
            onClick={() => handleSelectScreen('kit')}
          />

          {/* Libros sobre Autismo */}
          <MenuItem
            icon={<BookOpen size={18} className="text-purple-400" />}
            title={t.books}
            subtitle={t.booksSubtitle}
            onClick={() => handleSelectScreen('books')}
          />

          {/* Configuración */}
          <MenuItem
            icon={<Settings size={18} className="text-slate-300" />}
            title={t.settings}
            subtitle={t.settingsSubtitle}
            onClick={() => handleSelectScreen('settings')}
          />

          {/* SOS: Información Médica */}
          <MenuItem
            icon={<ShieldAlert size={18} className="text-rose-400" />}
            title={t.sos}
            subtitle={profile.bloodType ? `${profile.bloodType} · SOS` : (profile.language === 'es' ? 'Ficha de emergencia médica' : 'Medical emergency card')}
            onClick={() => handleSelectScreen('sos')}
          />

          {/* Refugio de Compañía */}
          <MenuItem
            icon={<Sparkles size={18} className="text-teal-400" />}
            title={t.companion}
            subtitle={profile.supportEntity || (profile.language === 'es' ? 'IA de apoyo somático' : 'AI Companion')}
            onClick={() => handleSelectScreen('companion')}
          />

          {/* Tonos Isocrónicos */}
          <MenuItem
            icon={<Waves size={18} className="text-blue-400" />}
            title={t.isochronic}
            subtitle={profile.language === 'es' ? 'Sincronización cerebral & rescate' : 'Brainwave synchronization'}
            onClick={() => handleSelectScreen('isochronic')}
          />

          {/* Compromisos Futuros */}
          <MenuItem
            icon={<Coins size={18} className="text-yellow-400" />}
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

          {/* Carga Cognitiva */}
          <MenuItem
            icon={<BatteryCharging size={18} className="text-amber-400" />}
            title={t.energy}
            subtitle={`Nivel actual: ${energy}/5`}
            onClick={() => {
              onClose();
              onOpenEnergy();
            }}
          />
        </div>

        {/* Footer: Quick controls */}
        <div className="mt-6 pt-5 border-t border-white/10 space-y-3">
          <button
            onClick={onToggleLanguage}
            className="w-full py-3.5 px-4 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 transition-all border border-white/10 text-white font-bold flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2.5 text-slate-300">
              <Globe size={16} className="text-cyan-400" />
              <span>{t.language}</span>
            </div>
            <span className="text-cyan-400 font-black uppercase px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
              {profile.language.toUpperCase()}
            </span>
          </button>

          <div className="text-center pt-1">
            <p className="text-[11px] text-cyan-300 font-black uppercase tracking-wider">
              {profile.name || (profile.language === 'es' ? 'Tu Espacio Seguro' : 'Your Safe Space')}
            </p>
            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 opacity-80">
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
      className={`w-full p-3.5 rounded-2xl transition-all flex items-center gap-3.5 text-left border ${
        highlight
          ? 'bg-white/10 hover:bg-white/15 border-white/20 shadow-md'
          : 'bg-white/5 hover:bg-white/10 border-white/5'
      }`}
    >
      <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-black text-white uppercase tracking-tight truncate">{title}</p>
        <p className="text-[10px] text-slate-400 font-semibold tracking-tight truncate">{subtitle}</p>
      </div>
      <ChevronRight size={15} className="text-slate-500 shrink-0" />
    </motion.button>
  );
}
