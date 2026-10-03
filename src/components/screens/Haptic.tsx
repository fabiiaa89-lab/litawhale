import { useState, useEffect, useRef } from 'react';
import Header from '../Header';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../../types';
import { i18n } from '../../i18n';
import { hapticEngine } from '../../utils/hapticEngine';
import { Sparkles, Smartphone, Waves } from 'lucide-react';

interface HapticProps {
  language: Language;
  onBack: () => void;
}

export default function Haptic({ language, onBack }: HapticProps) {
  const t = i18n[language].haptic;
  const [activePatternId, setActivePatternId] = useState<string | null>(null);
  const activePatternRef = useRef<string | null>(null);

  // Stop vibration on unmount or tab switch
  useEffect(() => {
    const handleGlobalStop = () => {
      hapticEngine.stop();
      setActivePatternId(null);
      activePatternRef.current = null;
    };

    window.addEventListener('pointerup', handleGlobalStop);
    window.addEventListener('pointercancel', handleGlobalStop);
    window.addEventListener('blur', handleGlobalStop);

    return () => {
      hapticEngine.stop();
      window.removeEventListener('pointerup', handleGlobalStop);
      window.removeEventListener('pointercancel', handleGlobalStop);
      window.removeEventListener('blur', handleGlobalStop);
    };
  }, []);

  const handleStartVibrate = (id: string, pattern: number[]) => {
    setActivePatternId(id);
    activePatternRef.current = id;
    hapticEngine.start(pattern);
  };

  const handleStopVibrate = () => {
    hapticEngine.stop();
    setActivePatternId(null);
    activePatternRef.current = null;
  };

  const patterns = [
    {
      id: 'p1',
      icon: '〰️',
      title: t.pattern1,
      desc: t.pattern1Sub,
      pattern: [220, 120, 220, 120, 220, 250],
      color: '#a855f7',
      freq: '52 Hz · Rítmico'
    },
    {
      id: 'p2',
      icon: '🫀',
      title: t.pattern2,
      desc: t.pattern2Sub,
      pattern: [350, 450, 350, 700],
      color: '#ec4899',
      freq: '45 Hz · Somático'
    },
    {
      id: 'p3',
      icon: '⚡',
      title: t.pattern3,
      desc: t.pattern3Sub,
      pattern: [60, 60, 60, 60, 60, 60, 60, 180],
      color: '#06b6d4',
      freq: '65 Hz · Ráfaga'
    },
    {
      id: 'p4',
      icon: '💥',
      title: t.pattern4,
      desc: t.pattern4Sub,
      pattern: [500, 150, 300, 100, 400, 200],
      color: '#f59e0b',
      freq: '38 Hz · Shockwave'
    }
  ];

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">
      <Header title={t.title} onBack={onBack} />

      <p className="mx-6 mt-3 text-[11px] text-amber-300">
        {language === 'es'
          ? 'Aviso: si tienes epilepsia o sensibilidad a estímulos rítmicos, consulta a tu médico antes de usar esta función. Esta app es un apoyo y no reemplaza la atención profesional.'
          : 'Notice: if you have epilepsy or sensitivity to rhythmic stimuli, check with your doctor before using this feature. This app is a support tool and does not replace professional care.'}
      </p>

      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar pb-[max(5rem,calc(env(safe-area-inset-bottom,0px)+3.5rem))]">
      {/* Main Status & Active Vibration Banner */}
      <div className="px-6 pt-4 pb-2">
        <AnimatePresence mode="wait">
          {activePatternId ? (
            <motion.div
              key="active"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-4 rounded-3xl bg-purple-600/30 border-2 border-purple-400 backdrop-blur-2xl text-center shadow-[0_0_30px_rgba(168,85,247,0.4)] flex flex-col items-center justify-center gap-1.5"
            >
              <div className="flex items-center gap-2 text-purple-200 font-black text-xs uppercase tracking-widest animate-pulse">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
                <span>{t.activeDisruption}</span>
              </div>
              <p className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">
                {t.releaseTip}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-3.5 rounded-2xl bg-white/5 border border-purple-500/20 backdrop-blur-xl text-center"
            >
              <p className="text-purple-300 font-black text-[10px] tracking-[2.5px] uppercase">
                👉 {t.pressHoldTip}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Vibration Cards List */}
      <div className="space-y-4 px-6 mt-3">
        {patterns.map((item) => {
          const isActive = activePatternId === item.id;

          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.97 }}
              onPointerDown={(e) => {
                e.preventDefault();
                handleStartVibrate(item.id, item.pattern);
              }}
              onPointerUp={handleStopVibrate}
              onPointerLeave={handleStopVibrate}
              onPointerCancel={handleStopVibrate}
              onTouchStart={(e) => {
                // Prevent iOS text selection & callouts
                e.stopPropagation();
              }}
              onContextMenu={(e) => e.preventDefault()}
              className={`w-full p-6 rounded-[32px] flex items-center gap-4 text-left transition-all duration-200 select-none shadow-2xl relative overflow-hidden touch-none cursor-pointer ${
                isActive
                  ? 'bg-purple-600/35 border-2 border-purple-400 shadow-[0_0_35px_rgba(168,85,247,0.35)] scale-[0.99]'
                  : 'bg-purple-950/20 hover:bg-purple-900/30 border border-purple-500/20'
              }`}
            >
              {/* Dynamic shockwave glow when active */}
              {isActive && (
                <div 
                  className="absolute inset-0 opacity-25 animate-pulse pointer-events-none"
                  style={{ backgroundColor: item.color }}
                />
              )}

              {/* Icon Container with glowing pulse */}
              <div 
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0 transition-transform duration-300 ${
                  isActive ? 'scale-110 shadow-lg' : ''
                }`}
                style={{
                  backgroundColor: `${item.color}22`,
                  border: `1px solid ${item.color}55`
                }}
              >
                <span className={isActive ? 'animate-bounce' : ''}>{item.icon}</span>
              </div>

              {/* Text info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-black text-white text-lg tracking-tight truncate">
                    {item.title}
                  </span>
                  <span 
                    className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0"
                    style={{ backgroundColor: `${item.color}20`, color: item.color }}
                  >
                    {item.freq}
                  </span>
                </div>
                <div className="text-purple-300 font-bold text-xs uppercase tracking-widest mt-1 opacity-80 leading-snug">
                  {item.desc}
                </div>
              </div>

              {/* Visual wave indicator */}
              <div className="shrink-0 text-purple-300 opacity-60">
                {isActive ? (
                  <Waves size={20} className="text-purple-300 animate-spin" />
                ) : (
                  <span className="text-lg opacity-40">〰️</span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Explanatory Footer note for iOS & Android */}
      <div className="mx-6 mt-6 p-4 rounded-2xl bg-black/30 border border-white/10 text-center">
        <p className="text-[10px] text-slate-400 font-bold leading-relaxed">
          {t.compatTip}
        </p>
      </div>
      </div>
    </div>
  );
}
