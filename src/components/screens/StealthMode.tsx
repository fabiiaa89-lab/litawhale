import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from '../Header';
import { Language, Screen } from '../../types';
import { i18n } from '../../i18n';
import { 
  Zap, 
  Hand, 
  MessageSquare, 
  Shield, 
  Copy, 
  Check, 
  Maximize2, 
  X, 
  Volume2, 
  Compass, 
  Activity, 
  Heart, 
  Radio,
  EyeOff,
  SunMedium
} from 'lucide-react';

interface StealthModeProps {
  language: Language;
  onBack: () => void;
  onNavigate?: (screen: Screen) => void;
}

type TabType = 'emergency' | 'somatic' | 'scripts' | 'shelter';

export default function StealthMode({ language, onBack, onNavigate }: StealthModeProps) {
  const t = i18n[language].stealth;
  const [activeTab, setActiveTab] = useState<TabType>('emergency');
  
  // Full-screen non-verbal display modal
  const [fullScreenText, setFullScreenText] = useState<{ title: string; text: string } | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  // Ultra-dim stealth reading mode for severe photophobia
  const [isUltraDim, setIsUltraDim] = useState(false);

  // Breathing state
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathCounter, setBreathCounter] = useState(4);
  const [isBreathingActive, setIsBreathingActive] = useState(true);

  // Isometric hold interaction
  const [isPressingHands, setIsPressingHands] = useState(false);
  const [pressProgress, setPressProgress] = useState(0);

  // Breathing loop
  useEffect(() => {
    if (!isBreathingActive) return;

    let duration = 4;
    if (breathPhase === 'inhale') duration = 4;
    else if (breathPhase === 'hold') duration = 4;
    else if (breathPhase === 'exhale') duration = 6;

    setBreathCounter(duration);

    const interval = setInterval(() => {
      setBreathCounter((prev) => {
        if (prev <= 1) {
          if (breathPhase === 'inhale') {
            setBreathPhase('hold');
            return 4;
          } else if (breathPhase === 'hold') {
            setBreathPhase('exhale');
            return 6;
          } else {
            setBreathPhase('inhale');
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [breathPhase, isBreathingActive]);

  // Isometric pressure press loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPressingHands) {
      // Haptic feedback if supported
      if ('vibrate' in navigator) {
        try {
          navigator.vibrate(40);
        } catch (e) {
          // ignore
        }
      }
      timer = setInterval(() => {
        setPressProgress((p) => {
          if (p >= 100) {
            if ('vibrate' in navigator) {
              try {
                navigator.vibrate([80, 50, 120]);
              } catch (e) {
                // ignore
              }
            }
            return 100;
          }
          return p + 10;
        });
      }, 1000);
    } else {
      setPressProgress(0);
    }
    return () => clearInterval(timer);
  }, [isPressingHands]);

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2500);
    } catch (err) {
      console.warn('Clipboard error:', err);
    }
  };

  const scripts = [
    {
      id: 'work1',
      title: t.scriptWork1Title,
      text: t.scriptWork1Text,
      badge: language === 'es' ? 'Presencial' : 'In-Person',
    },
    {
      id: 'work2',
      title: t.scriptWork2Title,
      text: t.scriptWork2Text,
      badge: language === 'es' ? 'Chat / Mensaje' : 'Chat / Text',
    },
    {
      id: 'public',
      title: t.scriptPublicTitle,
      text: t.scriptPublicText,
      badge: language === 'es' ? 'Calle / Transporte' : 'Transit / Street',
    },
    {
      id: 'noverbal',
      title: t.scriptNoVerbalTitle,
      text: t.scriptNoVerbalText,
      badge: language === 'es' ? 'No Verbal / Mutismo' : 'Non-Verbal',
    },
  ];

  return (
    <div className={`flex flex-col h-full overflow-hidden transition-colors duration-500 ${isUltraDim ? 'bg-black text-slate-400' : 'bg-transparent text-white'}`}>
      {/* Header */}
      <div className="relative shrink-0">
        <Header title={t.title} onBack={onBack} />
        <button
          onClick={() => setIsUltraDim(!isUltraDim)}
          className={`absolute right-6 top-6 p-2.5 rounded-2xl border transition-all cursor-pointer ${
            isUltraDim 
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
              : 'bg-white/5 text-slate-400 hover:text-white border-white/10 hover:bg-white/10'
          }`}
          title={isUltraDim ? 'Modo Estándar' : 'Atenuar Pantalla (Fotofobia)'}
        >
          {isUltraDim ? <SunMedium size={18} /> : <EyeOff size={18} />}
        </button>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar safe-area-bottom pb-[max(5rem,calc(env(safe-area-inset-bottom,0px)+3.5rem))]">
      <div className="px-6 py-2">
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-4">
          {t.subtitle}
        </p>

        {/* Validation Master Card */}
        <div className="p-5 rounded-[28px] bg-indigo-950/30 border border-indigo-500/20 shadow-xl mb-5 relative overflow-hidden">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0 mt-0.5">
              <Heart size={18} className="animate-pulse" />
            </div>
            <div>
              <h3 className="text-xs font-black text-indigo-200 uppercase tracking-wider mb-1">
                {t.validationTitle}
              </h3>
              <p className="text-xs text-indigo-100/80 leading-relaxed font-medium">
                {t.validationText}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          <TabButton
            active={activeTab === 'emergency'}
            onClick={() => setActiveTab('emergency')}
            icon={<Zap size={15} />}
            label={language === 'es' ? 'Freno' : 'Brake'}
          />
          <TabButton
            active={activeTab === 'somatic'}
            onClick={() => setActiveTab('somatic')}
            icon={<Hand size={15} />}
            label={language === 'es' ? 'Somática' : 'Somatic'}
          />
          <TabButton
            active={activeTab === 'scripts'}
            onClick={() => setActiveTab('scripts')}
            icon={<MessageSquare size={15} />}
            label={language === 'es' ? 'Guiones' : 'Scripts'}
          />
          <TabButton
            active={activeTab === 'shelter'}
            onClick={() => setActiveTab('shelter')}
            icon={<Shield size={15} />}
            label={language === 'es' ? 'Refugio' : 'Shelter'}
          />
        </div>

        {/* Tab 1: Freno Rápido (Emergency De-escalation) */}
        {activeTab === 'emergency' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* Breathing Guide */}
            <div className="p-6 rounded-[32px] bg-slate-900/60 backdrop-blur-2xl border border-white/10 shadow-2xl text-center">
              <div className="text-[10px] font-black text-cyan-400 uppercase tracking-[3px] mb-2 flex items-center justify-center gap-1.5">
                <Activity size={13} />
                <span>{t.breathingTitle}</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mb-6">
                {t.breathingDesc}
              </p>

              {/* Visual Pulsing Breath Indicator */}
              <div className="flex flex-col items-center justify-center my-4">
                <motion.div
                  animate={{
                    scale: breathPhase === 'inhale' ? 1.25 : breathPhase === 'hold' ? 1.25 : 0.85,
                    borderColor: breathPhase === 'inhale' ? 'rgba(34, 211, 238, 0.6)' : breathPhase === 'hold' ? 'rgba(129, 140, 248, 0.6)' : 'rgba(52, 211, 153, 0.6)',
                  }}
                  transition={{ duration: breathPhase === 'exhale' ? 6 : 4, ease: 'easeInOut' }}
                  className="w-36 h-36 rounded-full border-4 flex flex-col items-center justify-center bg-white/5 backdrop-blur-md shadow-2xl relative"
                >
                  <span className="text-3xl font-black tracking-tight text-white mb-0.5">
                    {breathCounter}s
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300">
                    {breathPhase === 'inhale' ? t.inhale : breathPhase === 'hold' ? t.hold : t.exhale}
                  </span>
                </motion.div>
              </div>

              <div className="flex justify-center gap-3 mt-6">
                <button
                  onClick={() => setIsBreathingActive(!isBreathingActive)}
                  className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-bold active:scale-95 transition-all cursor-pointer"
                >
                  {isBreathingActive ? (language === 'es' ? 'Pausar' : 'Pause') : (language === 'es' ? 'Reanudar' : 'Resume')}
                </button>
              </div>
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {onNavigate && (
                <>
                  <button
                    onClick={() => onNavigate('isochronic')}
                    className="p-4 rounded-[24px] bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-left flex items-center justify-between text-white active:scale-98 transition-all cursor-pointer group shadow-lg"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0">
                        <Volume2 size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold block text-indigo-200 tracking-tight">
                          {language === 'es' ? 'Tonos Isocrónicos' : 'Isochronic Tones'}
                        </span>
                        <span className="text-[11px] text-slate-400 block font-medium">
                          {language === 'es' ? 'Ondas Alfa de calma' : 'Calming Alpha Waves'}
                        </span>
                      </div>
                    </div>
                    <span className="text-indigo-400 group-hover:translate-x-1 transition-transform">→</span>
                  </button>

                  <button
                    onClick={() => onNavigate('haptic')}
                    className="p-4 rounded-[24px] bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 text-left flex items-center justify-between text-white active:scale-98 transition-all cursor-pointer group shadow-lg"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shrink-0">
                        <Radio size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold block text-cyan-200 tracking-tight">
                          {language === 'es' ? 'Regulación Háptica' : 'Haptic Regulation'}
                        </span>
                        <span className="text-[11px] text-slate-400 block font-medium">
                          {language === 'es' ? 'Disrupción táctil continua' : 'Tactile grounding pulse'}
                        </span>
                      </div>
                    </div>
                    <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* Tab 2: Somática Invisible (Invisible Somatics) */}
        {activeTab === 'somatic' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* Press Hands Isometric Card */}
            <div className="p-5 rounded-[28px] bg-slate-900/60 backdrop-blur-2xl border border-white/10 shadow-xl space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shrink-0">
                  <Hand size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">
                    {t.pressHandsTitle}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed font-medium">
                    {t.pressHandsDesc}
                  </p>
                </div>
              </div>

              {/* Interactive Press Pad */}
              <div className="pt-2">
                <button
                  onMouseDown={() => setIsPressingHands(true)}
                  onMouseUp={() => setIsPressingHands(false)}
                  onTouchStart={() => setIsPressingHands(true)}
                  onTouchEnd={() => setIsPressingHands(false)}
                  className={`w-full py-4 px-6 rounded-2xl border font-black text-xs uppercase tracking-wider flex items-center justify-between transition-all select-none cursor-pointer ${
                    isPressingHands 
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 scale-[0.98] shadow-inner' 
                      : 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border-cyan-500/30 shadow-lg'
                  }`}
                >
                  <span className="leading-tight">
                    {isPressingHands ? t.pressHandsHolding : t.pressHandsAction}
                  </span>
                  <span className="font-mono text-sm">
                    {isPressingHands ? `${pressProgress}%` : '10s'}
                  </span>
                </button>
                {isPressingHands && (
                  <div className="w-full bg-white/10 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div 
                      className="bg-cyan-400 h-full transition-all duration-300"
                      style={{ width: `${pressProgress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Heel Grounding */}
            <div className="p-5 rounded-[28px] bg-slate-900/60 backdrop-blur-2xl border border-white/10 shadow-xl flex items-start gap-3">
              <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0">
                <Compass size={18} />
              </div>
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  {t.pressFeetTitle}
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed font-medium">
                  {t.pressFeetDesc}
                </p>
              </div>
            </div>

            {/* Jaw and Tongue Release */}
            <div className="p-5 rounded-[28px] bg-slate-900/60 backdrop-blur-2xl border border-white/10 shadow-xl flex items-start gap-3">
              <div className="w-9 h-9 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 shrink-0">
                <Activity size={18} />
              </div>
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  {t.jawReleaseTitle}
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed font-medium">
                  {t.jawReleaseDesc}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 3: Guiones de Salida (Scripts) */}
        {activeTab === 'scripts' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <p className="text-xs text-slate-400 font-medium">
              {t.scriptsSubtitle}
            </p>

            <div className="space-y-3">
              {scripts.map((item, idx) => (
                <div 
                  key={item.id}
                  className="p-5 rounded-[28px] bg-slate-900/60 backdrop-blur-2xl border border-white/10 shadow-xl space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">
                      {item.title}
                    </h4>
                    <span className="text-[9px] px-2 py-0.5 rounded-md bg-white/10 text-slate-300 font-bold uppercase tracking-wider">
                      {item.badge}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 text-xs text-slate-200 leading-relaxed font-medium select-all">
                    "{item.text}"
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => copyToClipboard(item.text, idx)}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check size={14} className="text-emerald-400" />
                          <span className="text-emerald-300 font-bold">{t.copied}</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} className="text-cyan-400" />
                          <span>{t.copyBtn}</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setFullScreenText({ title: item.title, text: item.text })}
                      className="py-2.5 px-4 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-cyan-500/30 active:scale-95 transition-all cursor-pointer"
                      title={t.showBigBtn}
                    >
                      <Maximize2 size={14} />
                      <span className="hidden sm:inline">{t.showBigBtn}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tab 4: Micro-Refugios (Shelters) */}
        {activeTab === 'shelter' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <p className="text-xs text-slate-400 font-medium">
              {t.shelterSubtitle}
            </p>

            <div className="space-y-3">
              <ShelterCard
                icon="🚻"
                title={t.shelterBathroom}
                desc={t.shelterBathroomSub}
              />
              <ShelterCard
                icon="🎧"
                title={t.shelterAnc}
                desc={t.shelterAncSub}
              />
              <ShelterCard
                icon="🚗"
                title={t.shelterCar}
                desc={t.shelterCarSub}
              />
              <ShelterCard
                icon="🕶️"
                title={t.shelterSunglasses}
                desc={t.shelterSunglassesSub}
              />
            </div>

            {onNavigate && (
              <div className="pt-2 space-y-2">
                <button
                  onClick={() => onNavigate('anchor')}
                  className="w-full py-4 px-6 rounded-2xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-200 border border-cyan-500/30 font-black text-xs uppercase tracking-wider flex items-center justify-between active:scale-98 transition-all cursor-pointer shadow-lg"
                >
                  <div className="flex items-center gap-2.5">
                    <Compass size={16} />
                    <span>{t.quickAnchor}</span>
                  </div>
                  <span>→</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Full-Screen Non-Verbal Card Modal */}
      <AnimatePresence>
        {fullScreenText && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-3xl flex flex-col justify-between p-8"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs font-black text-cyan-400 uppercase tracking-widest">
                {fullScreenText.title}
              </span>
              <button
                onClick={() => setFullScreenText(null)}
                className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center my-8 text-center px-4">
              <p className="text-2xl sm:text-3xl font-black text-white leading-relaxed tracking-tight">
                "{fullScreenText.text}"
              </p>
            </div>

            <button
              onClick={() => setFullScreenText(null)}
              className="w-full py-5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black uppercase tracking-widest text-sm shadow-2xl active:scale-98 transition-all cursor-pointer"
            >
              {t.closeBig}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}

function TabButton({ 
  active, 
  onClick, 
  icon, 
  label 
}: { 
  active: boolean; 
  onClick: () => void; 
  icon: ReactNode; 
  label: string; 
}) {
  return (
    <button
      onClick={onClick}
      className={`py-3 px-2 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all text-center cursor-pointer border ${
        active
          ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black shadow-lg scale-100'
          : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border-white/5 font-bold text-xs'
      }`}
    >
      {icon}
      <span className="text-[10px] tracking-tight">{label}</span>
    </button>
  );
}

function ShelterCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="p-5 rounded-[28px] bg-slate-900/60 backdrop-blur-2xl border border-white/10 shadow-xl flex items-start gap-3.5">
      <div className="text-2xl shrink-0 p-1">{icon}</div>
      <div>
        <h4 className="text-xs font-black text-white uppercase tracking-wider mb-0.5">
          {title}
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed font-medium">
          {desc}
        </p>
      </div>
    </div>
  );
}
