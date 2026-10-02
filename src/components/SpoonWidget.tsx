import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SpoonState, SpoonActivity, Language, Screen } from '../types';
import { i18n } from '../i18n';
import { 
  X, 
  RotateCcw, 
  Bell, 
  BellOff, 
  Sparkles, 
  ShieldAlert, 
  Moon, 
  Plus, 
  Minus,
  ChevronUp,
  History,
  Info
} from 'lucide-react';
import { hapticEngine } from '../utils/hapticEngine';

interface SpoonWidgetProps {
  language: Language;
  onNavigate?: (screen: Screen) => void;
  onActivateCave?: () => void;
}

// Gentle, soothing chime using Web Audio API for friendly mindful alerts
function playGentleChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // First harmonic
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    gain1.gain.setValueAtTime(0.08, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 1.2);

    // Second harmonic for warmth
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15); // E5
    gain2.gain.setValueAtTime(0.07, ctx.currentTime + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.15);
    osc2.stop(ctx.currentTime + 1.4);
  } catch (e) {
    // Audio context may require prior user interaction
  }
}

export default function SpoonWidget({ language, onNavigate, onActivateCave }: SpoonWidgetProps) {
  const t = i18n[language].spoons;
  const todayDateStr = new Date().toISOString().split('T')[0];

  const [spoonState, setSpoonState] = useState<SpoonState>(() => {
    const saved = localStorage.getItem('ns_spoons');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Auto reset if new day
        if (parsed.lastResetDate !== todayDateStr) {
          return {
            total: parsed.total || 12,
            remaining: parsed.total || 12,
            history: [],
            lastResetDate: todayDateStr,
            reminderEnabled: parsed.reminderEnabled ?? true,
            reminderIntervalMinutes: parsed.reminderIntervalMinutes || 90
          };
        }
        return parsed;
      } catch (e) {}
    }
    return {
      total: 12,
      remaining: 12,
      history: [],
      lastResetDate: todayDateStr,
      reminderEnabled: true,
      reminderIntervalMinutes: 90
    };
  });

  const [isOpen, setIsOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [friendlyToast, setFriendlyToast] = useState<{
    show: boolean;
    isCritical: boolean;
    message: string;
  } | null>(null);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ns_spoons', JSON.stringify(spoonState));
      window.dispatchEvent(new CustomEvent('ns_spoons_updated', { detail: spoonState.remaining }));
    } catch (e) {
      console.warn("Could not save spoons to localStorage:", e);
    }
  }, [spoonState]);

  // Periodic Mindful Friendly Notification Check
  useEffect(() => {
    if (!spoonState.reminderEnabled) return;

    // Check every 2 minutes if it's time for a gentle mindfulness pause
    const interval = setInterval(() => {
      const lastCheck = localStorage.getItem('ns_last_spoon_check');
      const now = Date.now();
      const intervalMs = (spoonState.reminderIntervalMinutes || 90) * 60 * 1000;

      if (!lastCheck || now - parseInt(lastCheck, 10) >= intervalMs) {
        localStorage.setItem('ns_last_spoon_check', now.toString());
        triggerFriendlyReminder();
      }
    }, 120000);

    return () => clearInterval(interval);
  }, [spoonState.reminderEnabled, spoonState.reminderIntervalMinutes, spoonState.remaining]);

  const triggerFriendlyReminder = () => {
    playGentleChime();
    hapticEngine.triggerImpact('light');

    const isCritical = spoonState.remaining <= 3;
    setFriendlyToast({
      show: true,
      isCritical,
      message: isCritical ? t.criticalAlert : t.reminderPrompt
    });

    // Native Browser Notification if tab is in background or minimized
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(isCritical ? '⚠️ Lita-Whale - Cucharas Bajas' : '🥄 Lita-Whale - Pausa Consciente', {
          body: isCritical 
            ? `Te quedan ${spoonState.remaining} cucharas. Es momento de proteger tu energía.`
            : `Pausa consciente: Llevas ${spoonState.remaining} de ${spoonState.total} cucharas disponibles.`,
          icon: '/favicon.ico'
        });
      } catch (e) {}
    }
  };

  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          playGentleChime();
        }
      } catch (e) {}
    }
  };

  const handleSpendSpoons = (amount: number, label: string) => {
    hapticEngine.triggerImpact('medium');
    const newRemaining = Math.max(0, spoonState.remaining - amount);
    const newActivity: SpoonActivity = {
      id: 'act-' + Date.now(),
      name: label,
      amount: -amount,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setSpoonState(prev => ({
      ...prev,
      remaining: newRemaining,
      history: [newActivity, ...prev.history].slice(0, 10)
    }));

    if (newRemaining <= 3 && spoonState.remaining > 3) {
      // Trigger critical warning alert
      setTimeout(() => {
        playGentleChime();
        setFriendlyToast({
          show: true,
          isCritical: true,
          message: t.criticalAlert
        });
      }, 500);
    }
  };

  const handleRechargeSpoons = (amount: number = 1, label: string = 'Descanso / Silencio') => {
    hapticEngine.triggerImpact('light');
    playGentleChime();
    const newRemaining = Math.min(spoonState.total, spoonState.remaining + amount);
    const newActivity: SpoonActivity = {
      id: 'act-' + Date.now(),
      name: label,
      amount: +amount,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setSpoonState(prev => ({
      ...prev,
      remaining: newRemaining,
      history: [newActivity, ...prev.history].slice(0, 10)
    }));
  };

  const handleReset = () => {
    if (confirm(t.reset + '?')) {
      hapticEngine.triggerImpact('heavy');
      setSpoonState(prev => ({
        ...prev,
        remaining: prev.total,
        history: [{
          id: 'reset-' + Date.now(),
          name: t.reset,
          amount: prev.total,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]
      }));
    }
  };

  // Color determination based on energy ratio
  const ratio = spoonState.remaining / spoonState.total;
  const statusColor = ratio > 0.5 
    ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' 
    : ratio > 0.25 
    ? 'text-amber-300 bg-amber-500/10 border-amber-500/30' 
    : 'text-rose-400 bg-rose-500/10 border-rose-500/30 animate-pulse';

  const dotColor = ratio > 0.5 
    ? 'bg-cyan-400' 
    : ratio > 0.25 
    ? 'bg-amber-400' 
    : 'bg-rose-400 animate-ping';

  return (
    <>
      {/* Friendly Disruptive Top Notification Banner */}
      <AnimatePresence>
        {friendlyToast?.show && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            className="fixed top-4 inset-x-4 max-w-sm mx-auto z-[150] shadow-2xl"
          >
            <div className={`p-4 rounded-3xl border backdrop-blur-2xl ${
              friendlyToast.isCritical 
                ? 'bg-rose-950/90 border-rose-500/50 text-white shadow-[0_0_30px_rgba(244,63,94,0.4)]' 
                : 'bg-slate-900/90 border-white/20 text-white shadow-[0_0_30px_rgba(0,0,0,0.5)]'
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center text-lg shrink-0">
                    {friendlyToast.isCritical ? '⚠️' : '🥄'}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold tracking-tight text-white flex items-center gap-1.5">
                      <span>{friendlyToast.isCritical ? t.criticalAlert : t.reminderTitle}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-cyan-300 font-medium">
                        {spoonState.remaining}/{spoonState.total} 🥄
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                      {friendlyToast.isCritical ? t.criticalSub : friendlyToast.message}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setFriendlyToast(null)}
                  className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Quick Actions inside Notification */}
              <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-white/10">
                {friendlyToast.isCritical ? (
                  <>
                    <button
                      onClick={() => {
                        setFriendlyToast(null);
                        if (onActivateCave) onActivateCave();
                        else if (onNavigate) onNavigate('cave');
                      }}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
                    >
                      <Moon size={13} />
                      <span>{t.enterCave}</span>
                    </button>
                    <button
                      onClick={() => {
                        handleRechargeSpoons(1, 'Descanso');
                        setFriendlyToast(null);
                      }}
                      className="py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors"
                    >
                      +1 🥄 {language === 'es' ? 'Descansé' : 'Rested'}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        handleSpendSpoons(1, 'Gasto leve');
                        setFriendlyToast(null);
                      }}
                      className="flex-1 py-1.5 px-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-medium transition-colors"
                    >
                      {t.spentOne}
                    </button>
                    <button
                      onClick={() => {
                        handleSpendSpoons(2, 'Gasto medio');
                        setFriendlyToast(null);
                      }}
                      className="flex-1 py-1.5 px-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-medium transition-colors"
                    >
                      {t.spentTwo}
                    </button>
                    <button
                      onClick={() => setFriendlyToast(null)}
                      className="py-1.5 px-3 rounded-xl bg-cyan-500/20 text-cyan-300 text-xs font-medium hover:bg-cyan-500/30 transition-colors"
                    >
                      {t.allGood}
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Drawer / Modal for Spoon Theory (Opened via notification or modal) */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[140] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md"
            />

            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 240 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm bg-[#121424] border border-white/15 rounded-t-[36px] sm:rounded-[36px] p-6 shadow-2xl max-h-[85vh] overflow-y-auto no-scrollbar pb-[max(2.5rem,calc(env(safe-area-inset-bottom,0px)+1.5rem))]"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-xl shrink-0">
                    🥄
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100 tracking-tight">
                      {t.title}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {t.subtitle}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Spoon Gauge Display */}
              <div className="my-5 p-5 rounded-3xl bg-white/[0.03] border border-white/10 text-center relative overflow-hidden">
                <div className="text-3xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
                  <span>{spoonState.remaining}</span>
                  <span className="text-base font-normal text-slate-400">/ {spoonState.total} {language === 'es' ? 'cucharas' : 'spoons'}</span>
                </div>

                {/* Visual Spoons Row */}
                <div className="flex flex-wrap justify-center gap-1.5 mt-3 max-w-[260px] mx-auto">
                  {Array.from({ length: spoonState.total }).map((_, idx) => {
                    const isAvailable = idx < spoonState.remaining;
                    return (
                      <span 
                        key={idx}
                        className={`text-lg transition-transform ${isAvailable ? 'opacity-100 scale-105' : 'opacity-20 grayscale scale-90'}`}
                      >
                        🥄
                      </span>
                    );
                  })}
                </div>

                {/* Progress bar */}
                <div className="w-full bg-white/5 h-2 rounded-full mt-4 overflow-hidden p-0.5 border border-white/10">
                  <motion.div 
                    initial={false}
                    animate={{ width: `${(spoonState.remaining / spoonState.total) * 100}%` }}
                    className={`h-full rounded-full transition-colors ${
                      ratio > 0.5 ? 'bg-cyan-400' : ratio > 0.25 ? 'bg-amber-400' : 'bg-rose-500'
                    }`}
                  />
                </div>
              </div>

              {/* Critical Alert Warning */}
              {spoonState.remaining <= 3 && (
                <div className="mb-5 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-3">
                  <ShieldAlert size={20} className="text-rose-400 shrink-0" />
                  <div className="flex-1">
                    <p className="font-bold">{t.criticalAlert}</p>
                    <p className="text-[10px] text-rose-300/80 mt-0.5">{t.criticalSub}</p>
                  </div>
                  {onActivateCave && (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        onActivateCave();
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-[11px] shrink-0 transition-colors"
                    >
                      {t.enterCave}
                    </button>
                  )}
                </div>
              )}

              {/* Quick Actions (1-Tap Logging) */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block ml-1">
                  {t.quickLog}
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSpendSpoons(1, language === 'es' ? 'Tarea leve' : 'Minor task')}
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left text-xs font-semibold text-slate-200 flex flex-col gap-1 transition-all active:scale-95 cursor-pointer"
                  >
                    <span className="text-amber-300 font-bold">-1 🥄 {language === 'es' ? 'Leve' : 'Minor'}</span>
                    <span className="text-[10px] text-slate-400 font-normal leading-tight">{language === 'es' ? 'Mensajes, comida, aseo' : 'Texting, meal, shower'}</span>
                  </button>

                  <button
                    onClick={() => handleSpendSpoons(2, language === 'es' ? 'Tarea media' : 'Moderate task')}
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left text-xs font-semibold text-slate-200 flex flex-col gap-1 transition-all active:scale-95 cursor-pointer"
                  >
                    <span className="text-amber-400 font-bold">-2 🥄 {language === 'es' ? 'Media' : 'Medium'}</span>
                    <span className="text-[10px] text-slate-400 font-normal leading-tight">{language === 'es' ? 'Cocinar, conducir, llamada' : 'Cooking, drive, phone call'}</span>
                  </button>

                  <button
                    onClick={() => handleSpendSpoons(3, language === 'es' ? 'Tarea pesada' : 'Heavy task')}
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left text-xs font-semibold text-slate-200 flex flex-col gap-1 transition-all active:scale-95 cursor-pointer"
                  >
                    <span className="text-rose-400 font-bold">-3 🥄 {language === 'es' ? 'Pesada' : 'Heavy'}</span>
                    <span className="text-[10px] text-slate-400 font-normal leading-tight">{language === 'es' ? 'Socializar, trabajo, máscara' : 'Socializing, work, masking'}</span>
                  </button>

                  <button
                    onClick={() => handleRechargeSpoons(1, language === 'es' ? 'Descanso somático' : 'Somatic rest')}
                    className="p-3 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-left text-xs font-semibold text-cyan-200 flex flex-col gap-1 transition-all active:scale-95 cursor-pointer"
                  >
                    <span className="text-cyan-300 font-bold">+1 🥄 {language === 'es' ? 'Recarga' : 'Recharge'}</span>
                    <span className="text-[10px] text-cyan-400/80 font-normal leading-tight">{language === 'es' ? 'Silencio, siesta, stimming' : 'Silence, nap, stimming'}</span>
                  </button>
                </div>
              </div>

              {/* History Toggle */}
              {spoonState.history.length > 0 && (
                <div className="mt-4 pt-3 border-t border-white/10">
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 font-medium py-1 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <History size={13} />
                      {language === 'es' ? 'Historial de hoy' : "Today's history"}
                    </span>
                    <span className="text-[11px]">{showHistory ? '▲' : '▼'}</span>
                  </button>

                  {showHistory && (
                    <div className="mt-2 space-y-1.5 max-h-32 overflow-y-auto no-scrollbar">
                      {spoonState.history.map(item => (
                        <div key={item.id} className="flex items-center justify-between text-[11px] px-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/5">
                          <span className="text-slate-300 truncate">{item.name}</span>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={item.amount > 0 ? 'text-cyan-400 font-bold' : 'text-amber-400 font-bold'}>
                              {item.amount > 0 ? `+${item.amount}` : item.amount} 🥄
                            </span>
                            <span className="text-slate-500 text-[9px]">{item.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Reminders & Reset Tools */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    const nextVal = !spoonState.reminderEnabled;
                    setSpoonState(prev => ({ ...prev, reminderEnabled: nextVal }));
                    if (nextVal) {
                      requestNotificationPermission();
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    spoonState.reminderEnabled 
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                      : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                  title={t.enableNotifications}
                >
                  {spoonState.reminderEnabled ? <Bell size={13} /> : <BellOff size={13} />}
                  <span>{spoonState.reminderEnabled ? (language === 'es' ? 'Avisos activos' : 'Active alerts') : (language === 'es' ? 'Avisos off' : 'Alerts off')}</span>
                </button>

                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw size={12} />
                  <span>{t.reset}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
