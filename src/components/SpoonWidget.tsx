import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, Screen } from '../types';
import { i18n } from '../i18n';
import { X, Moon } from 'lucide-react';
import { hapticEngine } from '../utils/hapticEngine';

interface SpoonWidgetProps {
  language: Language;
  onNavigate?: (screen: Screen) => void;
  onActivateCave?: () => void;
}

export default function SpoonWidget({ language, onNavigate, onActivateCave }: SpoonWidgetProps) {
  const t = i18n[language].spoons;

  // Local state for spoons and background reminder
  const [spoonState, setSpoonState] = useState(() => {
    try {
      const saved = localStorage.getItem('ns_spoons');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      total: 12,
      remaining: 12,
      reminderEnabled: true,
      reminderIntervalMinutes: 60,
      vibrateOnSpend: true,
      history: []
    };
  });

  const [friendlyToast, setFriendlyToast] = useState<{
    show: boolean;
    isCritical: boolean;
    message: string;
  } | null>(null);

  const autoDismissTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync to localStorage and trigger global app update
  useEffect(() => {
    try {
      localStorage.setItem('ns_spoons', JSON.stringify(spoonState));
      window.dispatchEvent(new CustomEvent('ns_spoons_updated', { detail: spoonState.remaining }));
    } catch (e) {}
  }, [spoonState]);

  // Listen to open requests from other components and trigger main energy sanctuary
  useEffect(() => {
    const handleOpenWidget = () => {
      window.dispatchEvent(new CustomEvent('ns_open_energy_modal'));
    };
    const handleTriggerToast = (e: Event) => {
      const custom = e as CustomEvent<{ isCritical?: boolean; message?: string }>;
      triggerToast(custom.detail?.isCritical ?? false, custom.detail?.message);
    };

    window.addEventListener('ns_open_spoon_widget', handleOpenWidget);
    window.addEventListener('ns_trigger_spoon_toast', handleTriggerToast);
    return () => {
      window.removeEventListener('ns_open_spoon_widget', handleOpenWidget);
      window.removeEventListener('ns_trigger_spoon_toast', handleTriggerToast);
    };
  }, [spoonState.remaining, spoonState.total]);

  // Periodic Mindful Friendly Notification Check
  useEffect(() => {
    if (!spoonState.reminderEnabled) return;

    const interval = setInterval(() => {
      const lastCheck = localStorage.getItem('ns_last_spoon_check');
      const now = Date.now();
      const intervalMs = (spoonState.reminderIntervalMinutes || 60) * 60 * 1000;

      if (!lastCheck || now - parseInt(lastCheck, 10) >= intervalMs) {
        localStorage.setItem('ns_last_spoon_check', now.toString());
        triggerFriendlyReminder();
      }
    }, 60000); // Check once per minute

    return () => clearInterval(interval);
  }, [spoonState.reminderEnabled, spoonState.reminderIntervalMinutes, spoonState.remaining]);

  // Trigger Toast Notification on Android & iOS
  const triggerToast = (isCritical = false, customMsg?: string) => {
    if (autoDismissTimerRef.current) {
      clearTimeout(autoDismissTimerRef.current);
      autoDismissTimerRef.current = null;
    }

    if (isCritical) {
      hapticEngine.triggerImpact('heavy');
    } else {
      hapticEngine.triggerImpact('light');
    }

    const defaultMsg = isCritical 
      ? t.criticalSub 
      : spoonState.remaining <= 3 
      ? (language === 'es' 
          ? `Te quedan ${spoonState.remaining} cucharas. Protege tu energía sensorial.` 
          : `You have ${spoonState.remaining} spoons left. Protect your sensory energy.`)
      : (language === 'es' 
          ? `Pausa consciente: Tienes ${spoonState.remaining} de ${spoonState.total} cucharas disponibles.` 
          : `Mindful pause: You have ${spoonState.remaining} of ${spoonState.total} spoons available.`);

    setFriendlyToast({
      show: true,
      isCritical,
      message: customMsg || defaultMsg
    });

    const timeoutMs = isCritical ? 10000 : 6000;
    autoDismissTimerRef.current = setTimeout(() => {
      setFriendlyToast(null);
    }, timeoutMs);
  };

  const triggerFriendlyReminder = () => {
    const isCritical = spoonState.remaining <= 2;
    triggerToast(isCritical);
  };

  const handleSpendSpoons = (amount: number, reason: string) => {
    const newRemaining = Math.max(0, spoonState.remaining - amount);
    const newHistory = [
      {
        id: Date.now().toString(),
        name: reason,
        amount: -amount,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      ...spoonState.history.slice(0, 19)
    ];

    setSpoonState((prev: typeof spoonState) => ({
      ...prev,
      remaining: newRemaining,
      history: newHistory
    }));

    if (spoonState.vibrateOnSpend) {
      hapticEngine.triggerImpact(amount >= 2 ? 'medium' : 'light');
    }

    if (newRemaining <= 2) {
      setTimeout(() => triggerToast(true), 300);
    }
  };

  const handleRechargeSpoons = (amount: number, reason: string) => {
    const newRemaining = Math.min(spoonState.total, spoonState.remaining + amount);
    const newHistory = [
      {
        id: Date.now().toString(),
        name: reason,
        amount: amount,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      ...spoonState.history.slice(0, 19)
    ];

    setSpoonState((prev: typeof spoonState) => ({
      ...prev,
      remaining: newRemaining,
      history: newHistory
    }));

    hapticEngine.triggerImpact('light');
  };

  return (
    <>
      {/* Emergent Toast Notification Banner - Visible on both Android & iOS (Safe Area top) */}
      <AnimatePresence>
        {friendlyToast?.show && (
          <motion.div
            initial={{ opacity: 0, y: -60, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -60, scale: 0.94 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            className="fixed top-[max(0.75rem,calc(env(safe-area-inset-top,0px)+0.5rem))] inset-x-3 sm:inset-x-4 max-w-sm mx-auto z-[250] shadow-2xl pointer-events-auto"
          >
            <div className={`p-4 rounded-3xl border backdrop-blur-2xl transition-colors ${
              friendlyToast.isCritical 
                ? 'bg-rose-950/95 dark:bg-rose-950/95 light:bg-rose-100 border-rose-500/60 text-white dark:text-white light:text-rose-950 shadow-[0_0_35px_rgba(244,63,94,0.45)]' 
                : 'bg-slate-900/95 dark:bg-slate-900/95 light:bg-white border-cyan-500/40 text-white dark:text-white light:text-slate-900 shadow-[0_0_35px_rgba(6,182,212,0.25)]'
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0 ${
                    friendlyToast.isCritical ? 'bg-rose-500/25 border border-rose-400/40' : 'bg-cyan-500/20 border border-cyan-400/40'
                  }`}>
                    {friendlyToast.isCritical ? '⚠️' : '🥄'}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold tracking-tight text-white dark:text-white light:text-slate-900 flex items-center gap-2">
                      <span>{friendlyToast.isCritical ? t.criticalAlert : t.reminderTitle}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        friendlyToast.isCritical ? 'bg-rose-500/30 text-rose-200' : 'bg-cyan-500/20 text-cyan-300'
                      }`}>
                        {spoonState.remaining}/{spoonState.total} 🥄
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-200 dark:text-slate-200 light:text-slate-700 mt-1 leading-snug">
                      {friendlyToast.isCritical ? t.criticalSub : friendlyToast.message}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setFriendlyToast(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors"
                  aria-label="Cerrar notificación"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Quick Actions inside Notification */}
              <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-white/10 dark:border-white/10 light:border-slate-200">
                {friendlyToast.isCritical ? (
                  <>
                    <button
                      onClick={() => {
                        setFriendlyToast(null);
                        if (onActivateCave) onActivateCave();
                        else if (onNavigate) onNavigate('cave');
                      }}
                      className="flex-1 py-2 px-3 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                    >
                      <Moon size={14} />
                      <span>{t.enterCave}</span>
                    </button>
                    <button
                      onClick={() => {
                        handleRechargeSpoons(1, 'Descanso');
                        setFriendlyToast(null);
                      }}
                      className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors cursor-pointer"
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
                      className="flex-1 py-1.5 px-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 dark:text-slate-200 light:text-slate-800 text-xs font-medium transition-colors cursor-pointer"
                    >
                      {t.spentOne}
                    </button>
                    <button
                      onClick={() => {
                        handleSpendSpoons(2, 'Gasto medio');
                        setFriendlyToast(null);
                      }}
                      className="flex-1 py-1.5 px-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 dark:text-slate-200 light:text-slate-800 text-xs font-medium transition-colors cursor-pointer"
                    >
                      {t.spentTwo}
                    </button>
                    <button
                      onClick={() => setFriendlyToast(null)}
                      className="py-1.5 px-3 rounded-xl bg-cyan-500/20 text-cyan-300 dark:text-cyan-300 light:text-cyan-800 text-xs font-bold hover:bg-cyan-500/30 transition-colors cursor-pointer"
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
    </>
  );
}
