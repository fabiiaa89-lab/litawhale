import React, { useState, useEffect, useRef } from 'react';
import Header from '../Header';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../../types';
import { i18n } from '../../i18n';
import { hapticEngine } from '../../utils/hapticEngine';
import { Waves, HeartPulse, Zap, Flame, Radio, Play, Square, Smartphone, CheckCircle2, AlertCircle } from 'lucide-react';

interface HapticProps {
  language: Language;
  onBack: () => void;
}

export default function Haptic({ language, onBack }: HapticProps) {
  const isEs = language === 'es';
  const t = i18n[language].haptic;
  const [activePatternId, setActivePatternId] = useState<string | null>(null);
  const [interactionMode, setInteractionMode] = useState<'hold' | 'toggle'>('toggle');
  const [testResult, setTestResult] = useState<{ message: string; ok: boolean } | null>(null);
  const activePatternRef = useRef<string | null>(null);

  const hasHardwareVibrate = typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';

  // Stop vibration on unmount or tab switch
  useEffect(() => {
    const handleGlobalStop = () => {
      hapticEngine.stop();
      setActivePatternId(null);
      activePatternRef.current = null;
    };

    window.addEventListener('blur', handleGlobalStop);
    window.addEventListener('pagehide', handleGlobalStop);

    return () => {
      window.removeEventListener('blur', handleGlobalStop);
      window.removeEventListener('pagehide', handleGlobalStop);
      hapticEngine.stop();
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

  const handleTogglePattern = (id: string, pattern: number[]) => {
    if (activePatternId === id) {
      handleStopVibrate();
    } else {
      handleStartVibrate(id, pattern);
    }
  };

  const handleHardwareTest = () => {
    const res = hapticEngine.testVibration(450);
    if (res.supported) {
      setTestResult({
        ok: true,
        message: isEs
          ? '✓ Pulso de 450ms enviado al motor físico de Android.'
          : '✓ 450ms pulse dispatched to Android physical motor.'
      });
    } else {
      setTestResult({
        ok: false,
        message: isEs
          ? 'ℹ API de vibración restringida por el navegador o modo ahorro; resonancia acústico-táctil activa.'
          : 'ℹ Vibration API restricted; somatic acoustic-tactile resonance engaged.'
      });
    }
    setTimeout(() => setTestResult(null), 4000);
  };

  const patterns = [
    {
      id: 'p1',
      icon: <Waves size={24} className="text-cyan-400 shrink-0" />,
      title: t.pattern1 || (isEs ? 'Respiración Háptica' : 'Haptic Breathing'),
      desc: t.pattern1Sub || (isEs ? 'Ondas rítmicas suaves para regular la frecuencia cardíaca' : 'Smooth rhythmic waves to steady heart rate'),
      pattern: [220, 120, 220, 120, 220, 250],
      color: '#06b6d4',
      freq: '52 Hz · Rítmico'
    },
    {
      id: 'p2',
      icon: <HeartPulse size={24} className="text-pink-400 shrink-0" />,
      title: t.pattern2 || (isEs ? 'Latido Calmante' : 'Calming Heartbeat'),
      desc: t.pattern2Sub || (isEs ? 'Doble pulsación diastólica que ancla la propiocepción' : 'Double diastolic pulse for proprioceptive grounding'),
      pattern: [350, 450, 350, 700],
      color: '#ec4899',
      freq: '45 Hz · Somático'
    },
    {
      id: 'p3',
      icon: <Zap size={24} className="text-emerald-400 shrink-0" />,
      title: t.pattern3 || (isEs ? 'Disrupción de Crisis' : 'Crisis Disruption'),
      desc: t.pattern3Sub || (isEs ? 'Micro-ráfagas rápidas para cortar pensamientos intrusivos' : 'Rapid bursts to disrupt panic & cognitive looping'),
      pattern: [80, 80, 80, 80, 80, 80, 80, 200],
      color: '#10b981',
      freq: '65 Hz · Ráfaga'
    },
    {
      id: 'p4',
      icon: <Flame size={24} className="text-amber-400 shrink-0" />,
      title: t.pattern4 || (isEs ? 'Impacto de Choque' : 'Grounding Shockwave'),
      desc: t.pattern4Sub || (isEs ? 'Onda descendente intensa para desarmar la sobrecarga' : 'Deep heavy wave for severe sensory overload reset'),
      pattern: [500, 150, 300, 100, 400, 200],
      color: '#f59e0b',
      freq: '38 Hz · Shockwave'
    }
  ];

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">
      <Header title={t.title} onBack={onBack} />

      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-4 sm:px-6 pt-3 pb-[max(5rem,calc(env(safe-area-inset-bottom,0px)+3.5rem))] space-y-4">
        {/* Hardware Status & Quick Test for Android */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] dark:bg-white/[0.04] light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Smartphone size={18} className="text-cyan-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-200 dark:text-slate-200 light:text-slate-800">
                {isEs ? 'Hardware Háptico Android' : 'Android Haptic Hardware'}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-600">
                {hasHardwareVibrate
                  ? (isEs ? 'Motor de vibración disponible en el dispositivo' : 'Vibration hardware detected on device')
                  : (isEs ? 'Modo resonancia acústico-táctil activo' : 'Acoustic-tactile somatic resonance active')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleHardwareTest}
            className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 active:scale-95 border border-cyan-400/40 text-cyan-300 dark:text-cyan-300 light:text-cyan-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <Zap size={13} />
            <span>{isEs ? 'Probar Motor (450ms)' : 'Test Motor (450ms)'}</span>
          </button>
        </div>

        {/* Feedback result */}
        <AnimatePresence>
          {testResult && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className={`p-3 rounded-2xl text-xs font-medium flex items-center gap-2 border ${
                testResult.ok
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 dark:text-emerald-300 light:text-emerald-800'
                  : 'bg-amber-500/15 border-amber-500/30 text-amber-300 dark:text-amber-300 light:text-amber-800'
              }`}
            >
              {testResult.ok ? <CheckCircle2 size={16} className="shrink-0" /> : <AlertCircle size={16} className="shrink-0" />}
              <span>{testResult.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Medical disclaimer note */}
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-[11px] text-amber-300 dark:text-amber-300 light:text-amber-800 leading-relaxed font-medium">
          {isEs
            ? 'Aviso: Esta herramienta emite vibraciones somáticas y pulsos táctiles de baja frecuencia para cortar la desregulación. Si tienes epilepsia o sensibilidad motora rítmica, úsala con precaución.'
            : 'Notice: Emits somatic vibrations and tactile pulses to interrupt sensory overload. If you have epilepsy or motor rhythmic sensitivity, use with caution.'}
        </div>

        {/* Mode Selector Tabs (Hold vs Tap Toggle) */}
        <div className="p-1 rounded-2xl bg-slate-900/60 dark:bg-white/5 light:bg-slate-200/80 border border-white/10 dark:border-white/10 light:border-slate-300 flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              handleStopVibrate();
              setInteractionMode('toggle');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              interactionMode === 'toggle'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-white'
            }`}
          >
            <Radio size={14} />
            <span>{isEs ? 'Tocar para activar (Continuo)' : 'Tap to toggle (Continuous)'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              handleStopVibrate();
              setInteractionMode('hold');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              interactionMode === 'hold'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-white'
            }`}
          >
            <span>{isEs ? 'Mantener presionado' : 'Press & Hold'}</span>
          </button>
        </div>

        {/* Active Vibration Status Banner */}
        <AnimatePresence mode="wait">
          {activePatternId ? (
            <motion.div
              key="active"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="p-4 rounded-3xl bg-cyan-600/25 border-2 border-cyan-400/60 backdrop-blur-2xl text-center shadow-[0_0_30px_rgba(6,182,212,0.3)] flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0 text-left">
                <span className="w-3.5 h-3.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white dark:text-white light:text-cyan-950 uppercase tracking-wider">
                    {t.activeDisruption || (isEs ? 'Pulsación Háptica Activa' : 'Haptic Pulse Active')}
                  </h4>
                  <p className="text-[11px] text-cyan-200 dark:text-cyan-200 light:text-cyan-800 font-medium">
                    {interactionMode === 'toggle'
                      ? (isEs ? 'Toca la tarjeta nuevamente para detener.' : 'Tap card again to stop.')
                      : (isEs ? 'Mantén el dedo para sostener el anclaje somático.' : 'Hold finger to sustain sensory pulse.')}
                  </p>
                </div>
              </div>

              {interactionMode === 'toggle' && (
                <button
                  type="button"
                  onClick={handleStopVibrate}
                  className="py-1.5 px-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs uppercase tracking-wider shrink-0 transition-colors cursor-pointer"
                >
                  {isEs ? 'Detener' : 'Stop'}
                </button>
              )}
            </motion.div>
          ) : (
            <div className="p-3 rounded-2xl bg-white/[0.04] dark:bg-white/[0.04] light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 text-center">
              <p className="text-[11px] text-cyan-300 dark:text-cyan-300 light:text-cyan-700 font-bold tracking-wide">
                {interactionMode === 'toggle'
                  ? (isEs ? '👉 Toca cualquier tarjeta para iniciar la estimulación continua' : '👉 Tap any card to start continuous stimulation')
                  : (isEs ? '👉 Mantén presionada cualquier tarjeta para sentir la vibración' : '👉 Press and hold any card to feel vibration')}
              </p>
            </div>
          )}
        </AnimatePresence>

        {/* Vibration Cards List with Vector Duotone Icons (Option A) */}
        <div className="space-y-3">
          {patterns.map((item) => {
            const isActive = activePatternId === item.id;

            return (
              <motion.div
                key={item.id}
                whileTap={{ scale: 0.98 }}
                style={{ touchAction: 'none' }}
                onPointerDown={(e) => {
                  if (interactionMode === 'hold') {
                    try {
                      e.currentTarget.setPointerCapture(e.pointerId);
                    } catch {}
                    handleStartVibrate(item.id, item.pattern);
                  }
                }}
                onPointerUp={(e) => {
                  if (interactionMode === 'hold') {
                    try {
                      e.currentTarget.releasePointerCapture(e.pointerId);
                    } catch {}
                    handleStopVibrate();
                  }
                }}
                onPointerCancel={() => {
                  if (interactionMode === 'hold') {
                    handleStopVibrate();
                  }
                }}
                onPointerLeave={() => {
                  if (interactionMode === 'hold') {
                    handleStopVibrate();
                  }
                }}
                onClick={() => {
                  if (interactionMode === 'toggle') {
                    handleTogglePattern(item.id, item.pattern);
                  }
                }}
                onContextMenu={(e) => e.preventDefault()}
                className={`w-full p-4 sm:p-5 rounded-3xl flex items-center gap-4 text-left transition-all duration-200 select-none shadow-lg relative overflow-hidden cursor-pointer border ${
                  isActive
                    ? 'bg-cyan-600/30 border-2 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400/40'
                    : 'bg-white/[0.04] dark:bg-white/[0.04] light:bg-white hover:bg-white/[0.07] border-white/10 dark:border-white/10 light:border-slate-200'
                }`}
              >
                {/* Active glow accent */}
                {isActive && (
                  <div
                    className="absolute inset-0 opacity-20 animate-pulse pointer-events-none"
                    style={{ backgroundColor: item.color }}
                  />
                )}

                {/* Duotone Icon Badge */}
                <div
                  className={`w-13 h-13 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-300 ${
                    isActive ? 'scale-105 shadow-md' : ''
                  }`}
                  style={{
                    backgroundColor: `${item.color}20`,
                    borderColor: `${item.color}45`
                  }}
                >
                  {item.icon}
                </div>

                {/* Text and Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-white dark:text-white light:text-slate-900 text-sm sm:text-base tracking-tight leading-snug">
                      {item.title}
                    </span>
                    <span
                      className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0"
                      style={{ backgroundColor: `${item.color}25`, color: item.color }}
                    >
                      {item.freq}
                    </span>
                  </div>
                  <p className="text-slate-300 dark:text-slate-300 light:text-slate-600 text-xs mt-1 leading-snug">
                    {item.desc}
                  </p>
                </div>

                {/* State toggle indicator */}
                <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10">
                  {isActive ? (
                    <Square size={13} className="text-cyan-300 fill-cyan-300" />
                  ) : (
                    <Play size={13} className="text-slate-400 ml-0.5" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Compatibility info footer */}
        <div className="p-3.5 rounded-2xl bg-white/[0.03] dark:bg-white/[0.03] light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-200 text-center">
          <p className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-600 font-medium leading-relaxed">
            {isEs
              ? '💡 Compatible con el motor de vibración de Android (Vibration API) y la resonancia táctil de Web Audio. Si tu teléfono tiene el modo "Ahorro de batería" activo o vibración del sistema desactivada en Ajustes > Sonido > Vibración, el sistema operativo puede pausar el motor físico.'
              : '💡 Supported by Android Vibration API and Web Audio somatic pulse synthesis. Ensure battery saver is off for maximum haptic intensity.'}
          </p>
        </div>
      </div>
    </div>
  );
}
