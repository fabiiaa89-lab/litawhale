import React, { useState, useEffect } from 'react';
import Header from '../Header';
import { i18n } from '../../i18n';
import { motion, AnimatePresence } from 'motion/react';
import { Profile, Language } from '../../types';
import { 
  Wind, 
  Hand, 
  Droplets, 
  VolumeX, 
  Compass, 
  Anchor, 
  Activity, 
  ThermometerSnowflake, 
  HeartPulse, 
  EyeOff, 
  Scale, 
  Waves,
  Check
} from 'lucide-react';
import { hapticEngine } from '../../utils/hapticEngine';

interface BodyScannerProps {
  profile: Profile;
  language: Language;
  onBack: () => void;
}

export default function BodyScanner({ profile, language, onBack }: BodyScannerProps) {
  const t = i18n[language].body;
  const isEs = language === 'es';
  const SYMPTOMS = i18n[language].symptoms;
  const CALIBRATION_STEPS = i18n[language].calibrationSteps;

  const [mode, setMode] = useState<'scan' | 'calibration'>('scan');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  
  // Breathing guide state
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathState, setBreathState] = useState<{ phase: 'inhale' | 'exhale'; seconds: number }>({
    phase: 'inhale',
    seconds: 4,
  });

  // Calibration state
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [result, setResult] = useState<string | null>(null);

  // Reliable interval countdown for breathing regulation (4s inhale, 8s exhale)
  useEffect(() => {
    if (!isBreathing) return;

    setBreathState({ phase: 'inhale', seconds: 4 });

    const interval = setInterval(() => {
      setBreathState(curr => {
        if (curr.seconds <= 1) {
          const nextPhase = curr.phase === 'inhale' ? 'exhale' : 'inhale';
          const nextSeconds = nextPhase === 'inhale' ? 4 : 8;
          
          // Cross-platform iOS tactile acoustic pulse + Android physical vibration
          hapticEngine.playTactilePulse(nextPhase === 'inhale' ? 70 : 120);
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            try {
              navigator.vibrate(nextPhase === 'inhale' ? [50] : [35, 50, 35]);
            } catch (e) {}
          }
          return { phase: nextPhase, seconds: nextSeconds };
        }
        return { phase: curr.phase, seconds: curr.seconds - 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isBreathing]);

  const toggleSymptom = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelected(next);

    if (id === 'heart' || id === 'chest') {
      setIsBreathing(true);
    }
  };

  const currentTranslation = SYMPTOMS.find(s => s.id === [...selected].pop());

  const handleCalibrationAnswer = (ans: boolean) => {
    const currentStep = CALIBRATION_STEPS[step];
    const newAnswers = { ...answers, [currentStep.key]: ans };
    setAnswers(newAnswers);

    if (step < CALIBRATION_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      const positiveCount = Object.values(newAnswers).filter(Boolean).length;
      let suggestion = "";
      if (isEs) {
        if (positiveCount >= 2) {
          suggestion = "Sobrecarga sensorial elevada. Se recomienda entrar en Modo Cueva o aplicar anclaje somático inmediato.";
        } else if (positiveCount === 1) {
          suggestion = "Tensión moderada detectada. Se recomienda anclaje de realidad y respiración profunda 4-8.";
        } else {
          suggestion = "Sistema nervioso en equilibrio. Mantén tu entorno protegido y dosifica tus cucharas de energía.";
        }
        setResult(`Evaluación somática: ${suggestion}`);
      } else {
        if (positiveCount >= 2) {
          suggestion = "High sensory load detected. Cave Mode or deep somatic grounding recommended.";
        } else if (positiveCount === 1) {
          suggestion = "Moderate nervous tension. Reality grounding and 4-8 breathing pacing recommended.";
        } else {
          suggestion = "Nervous system balanced. Protect your safe boundaries and preserve your energy spoons.";
        }
        setResult(`Somatic assessment: ${suggestion}`);
      }
    }
  };

  // Vector Lucide Icon Resolver with High Contrast in both Dark and Light Mode
  const getSymptomVisual = (id: string) => {
    switch (id) {
      case 'hands':
        return {
          icon: <Hand size={22} className="text-cyan-400 dark:text-cyan-400 light:text-cyan-700" />,
          color: 'bg-cyan-500/20 dark:bg-cyan-500/20 light:bg-cyan-100 border-cyan-400/40 dark:border-cyan-400/40 light:border-cyan-300 text-cyan-300 dark:text-cyan-300 light:text-cyan-800'
        };
      case 'chest':
        return {
          icon: <Wind size={22} className="text-teal-400 dark:text-teal-400 light:text-teal-700" />,
          color: 'bg-teal-500/20 dark:bg-teal-500/20 light:bg-teal-100 border-teal-400/40 dark:border-teal-400/40 light:border-teal-300 text-teal-300 dark:text-teal-300 light:text-teal-800'
        };
      case 'dry':
        return {
          icon: <Droplets size={22} className="text-blue-400 dark:text-blue-400 light:text-blue-700" />,
          color: 'bg-blue-500/20 dark:bg-blue-500/20 light:bg-blue-100 border-blue-400/40 dark:border-blue-400/40 light:border-blue-300 text-blue-300 dark:text-blue-300 light:text-blue-800'
        };
      case 'noise':
        return {
          icon: <VolumeX size={22} className="text-purple-400 dark:text-purple-400 light:text-purple-700" />,
          color: 'bg-purple-500/20 dark:bg-purple-500/20 light:bg-purple-100 border-purple-400/40 dark:border-purple-400/40 light:border-purple-300 text-purple-300 dark:text-purple-300 light:text-purple-800'
        };
      case 'dizzy':
        return {
          icon: <Compass size={22} className="text-amber-400 dark:text-amber-400 light:text-amber-700" />,
          color: 'bg-amber-500/20 dark:bg-amber-500/20 light:bg-amber-100 border-amber-400/40 dark:border-amber-400/40 light:border-amber-300 text-amber-300 dark:text-amber-300 light:text-amber-800'
        };
      case 'heavy':
        return {
          icon: <Anchor size={22} className="text-slate-300 dark:text-slate-300 light:text-slate-700" />,
          color: 'bg-slate-500/20 dark:bg-slate-500/20 light:bg-slate-200 border-slate-400/40 dark:border-slate-400/40 light:border-slate-300 text-slate-300 dark:text-slate-300 light:text-slate-800'
        };
      case 'nausea':
        return {
          icon: <Activity size={22} className="text-emerald-400 dark:text-emerald-400 light:text-emerald-700" />,
          color: 'bg-emerald-500/20 dark:bg-emerald-500/20 light:bg-emerald-100 border-emerald-400/40 dark:border-emerald-400/40 light:border-emerald-300 text-emerald-300 dark:text-emerald-300 light:text-emerald-800'
        };
      case 'cold':
        return {
          icon: <ThermometerSnowflake size={22} className="text-sky-400 dark:text-sky-400 light:text-sky-700" />,
          color: 'bg-sky-500/20 dark:bg-sky-500/20 light:bg-sky-100 border-sky-400/40 dark:border-sky-400/40 light:border-sky-300 text-sky-300 dark:text-sky-300 light:text-sky-800'
        };
      case 'heart':
        return {
          icon: <HeartPulse size={22} className="text-rose-400 dark:text-rose-400 light:text-rose-700" />,
          color: 'bg-rose-500/20 dark:bg-rose-500/20 light:bg-rose-100 border-rose-400/40 dark:border-rose-400/40 light:border-rose-300 text-rose-300 dark:text-rose-300 light:text-rose-800'
        };
      case 'dissoc':
        return {
          icon: <EyeOff size={22} className="text-indigo-400 dark:text-indigo-400 light:text-indigo-700" />,
          color: 'bg-indigo-500/20 dark:bg-indigo-500/20 light:bg-indigo-100 border-indigo-400/40 dark:border-indigo-400/40 light:border-indigo-300 text-indigo-300 dark:text-indigo-300 light:text-indigo-800'
        };
      default:
        return {
          icon: <Activity size={22} className="text-cyan-400 dark:text-cyan-400 light:text-cyan-700" />,
          color: 'bg-cyan-500/20 dark:bg-cyan-500/20 light:bg-cyan-100 border-cyan-400/40 dark:border-cyan-400/40 light:border-cyan-300 text-cyan-300 dark:text-cyan-300 light:text-cyan-800'
        };
    }
  };

  const breathPhase = breathState.phase;
  const secondsRemaining = breathState.seconds;
  const progressPercent = breathPhase === 'inhale' 
    ? ((4 - secondsRemaining) / 4) * 100 
    : ((8 - secondsRemaining) / 8) * 100;

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">
      <Header title={t.title} onBack={onBack} />

      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-4 sm:px-6 pt-3 pb-[max(5rem,calc(env(safe-area-inset-bottom,0px)+3.5rem))] space-y-4">
        
        {/* Sanctuary Intro Card */}
        <div className="p-4 rounded-3xl bg-cyan-500/10 dark:bg-cyan-500/10 light:bg-white border border-cyan-400/25 dark:border-cyan-400/25 light:border-cyan-200 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 dark:bg-cyan-500/20 light:bg-cyan-100 border border-cyan-400/30 dark:border-cyan-400/30 light:border-cyan-300 flex items-center justify-center shrink-0">
              <Waves size={20} className="text-cyan-400 dark:text-cyan-400 light:text-cyan-700" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-bold text-white dark:text-white light:text-slate-900 tracking-tight leading-tight">
                {isEs ? 'Escáner de Señales Interoceptivas' : 'Interoceptive Signal Scanner'}
              </h2>
              <p className="text-[11px] text-cyan-300/90 dark:text-cyan-300/90 light:text-slate-600 font-medium leading-snug mt-0.5">
                {isEs 
                  ? 'Reconoce las señales somáticas de tu cuerpo y activa el protocolo regulador.'
                  : 'Identify somatic sensations and receive calming nervous system protocols.'}
              </p>
            </div>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="p-1 rounded-2xl bg-slate-900/60 dark:bg-white/5 light:bg-slate-200/80 border border-white/10 dark:border-white/10 light:border-slate-300 flex items-center gap-1">
          <button 
            type="button"
            onClick={() => setMode('scan')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              mode === 'scan' 
                ? 'bg-cyan-600 text-white shadow-md' 
                : 'text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-white'
            }`}
          >
            <Activity size={14} />
            <span>{t.scanBtn}</span>
          </button>
          <button 
            type="button"
            onClick={() => setMode('calibration')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              mode === 'calibration' 
                ? 'bg-cyan-600 text-white shadow-md' 
                : 'text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-white'
            }`}
          >
            <Scale size={14} />
            <span>{t.calBtn}</span>
          </button>
        </div>

        {mode === 'scan' ? (
          <>
            <div className="px-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 light:text-slate-600">
                {isEs ? 'Toca las sensaciones que sientes ahora:' : 'Select what you feel right now:'}
              </span>
            </div>

            {/* Symptoms Grid with Vector Duotone Icons */}
            <div className="grid grid-cols-2 gap-3">
              {SYMPTOMS.map(s => {
                const isSelected = selected.has(s.id);
                const visual = getSymptomVisual(s.id);

                return (
                  <motion.button
                    key={s.id}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => toggleSymptom(s.id)}
                    className={`p-4 rounded-3xl border transition-all flex flex-col items-center text-center shadow-md cursor-pointer ${
                      isSelected 
                        ? 'bg-emerald-500/20 dark:bg-emerald-500/20 light:bg-emerald-50 border-2 border-emerald-400 dark:border-emerald-400 light:border-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.25)]' 
                        : 'bg-white/[0.04] dark:bg-white/[0.04] light:bg-white hover:bg-white/[0.07] border-white/10 dark:border-white/10 light:border-slate-200'
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-2.5 border transition-all ${
                      isSelected 
                        ? 'bg-emerald-500/25 border-emerald-400/50 scale-105' 
                        : visual.color
                    }`}>
                      {visual.icon}
                    </div>
                    <span className="text-xs font-bold text-white dark:text-white light:text-slate-900 leading-snug">
                      {s.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Active Symptom Translation Card */}
            <AnimatePresence mode="wait">
              {selected.size > 0 && currentTranslation && (
                <motion.div
                  key={currentTranslation.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="rounded-3xl p-5 border-2 border-emerald-500/40 bg-emerald-950/20 dark:bg-emerald-950/20 light:bg-emerald-50/90 shadow-xl space-y-3 text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 dark:text-emerald-400 light:text-emerald-800">
                      {t.translationTitle}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 dark:text-emerald-300 light:text-emerald-800">
                      {currentTranslation.label}
                    </span>
                  </div>

                  <p className="text-sm sm:text-base font-bold text-white dark:text-white light:text-slate-900 leading-snug">
                    {currentTranslation.translation}
                  </p>

                  <div className="p-3 rounded-2xl bg-black/20 dark:bg-black/20 light:bg-white/80 border border-emerald-500/30 text-xs text-emerald-200 dark:text-emerald-200 light:text-emerald-900 font-medium leading-relaxed">
                    {currentTranslation.protocol}
                  </div>

                  {!isBreathing && (
                    <button
                      type="button"
                      onClick={() => setIsBreathing(true)}
                      className="w-full py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                      <Wind size={16} />
                      <span>{isEs ? 'Iniciar respiración 4-8 para calmar' : 'Start 4-8 breathing guide'}</span>
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Whale Sanctuary Deep Breathing Pacer (Respiración 4-8) */}
            {isBreathing && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-3xl p-6 bg-slate-900/90 dark:bg-slate-900/90 light:bg-white border-2 border-cyan-400/40 shadow-2xl flex flex-col items-center text-center relative overflow-hidden"
              >
                <div className="mb-4">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/30">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-xs font-black text-cyan-300 dark:text-cyan-300 light:text-cyan-800 uppercase tracking-wider">
                      {breathPhase === 'inhale' 
                        ? (isEs ? 'INHALA — Desciende a la calma' : 'INHALE — Sink into peace') 
                        : (isEs ? 'EXHALA — Suelta despacio el aire' : 'EXHALE — Release gently')}
                    </span>
                  </div>
                </div>

                {/* Oceanic Breathing Sphere */}
                <div className="relative w-48 h-48 flex items-center justify-center my-3">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="44"
                      fill="none"
                      stroke="rgba(6, 182, 212, 0.15)"
                      strokeWidth="3"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="44"
                      fill="none"
                      stroke={breathPhase === 'inhale' ? '#06b6d4' : '#10b981'}
                      strokeWidth="4"
                      strokeDasharray="276.46"
                      strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-linear"
                    />
                  </svg>

                  {/* Pulsing Core */}
                  <motion.div
                    animate={{
                      scale: breathPhase === 'inhale' 
                        ? 0.88 + (0.24 * (4 - secondsRemaining)) / 4 
                        : 1.12 - (0.24 * (8 - secondsRemaining)) / 8,
                      boxShadow: breathPhase === 'inhale' 
                        ? '0 0 35px rgba(6, 182, 212, 0.45)' 
                        : '0 0 25px rgba(16, 185, 129, 0.35)',
                      backgroundColor: breathPhase === 'inhale' 
                        ? 'rgba(6, 182, 212, 0.22)' 
                        : 'rgba(16, 185, 129, 0.18)'
                    }}
                    transition={{ 
                      duration: 0.9, 
                      ease: "linear" 
                    }}
                    className="absolute w-32 h-32 rounded-full border-2 border-cyan-400/50 flex flex-col items-center justify-center pointer-events-none"
                  >
                    <span className="text-3xl font-black text-white dark:text-white light:text-slate-900 tabular-nums">
                      {secondsRemaining}s
                    </span>
                    <span className="text-xs font-black uppercase tracking-widest text-cyan-300 dark:text-cyan-300 light:text-cyan-800">
                      {breathPhase === 'inhale' ? (isEs ? 'INHALA' : 'INHALE') : (isEs ? 'EXHALA' : 'EXHALE')}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-cyan-200/80 dark:text-cyan-200/80 light:text-slate-600">
                      {breathPhase === 'inhale' ? '4s' : '8s'}
                    </span>
                  </motion.div>
                </div>

                <button 
                  type="button"
                  onClick={() => setIsBreathing(false)}
                  className="mt-4 px-6 py-2.5 rounded-2xl bg-white/10 dark:bg-white/10 light:bg-slate-100 border border-white/15 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  {t.stopGuide}
                </button>
              </motion.div>
            )}
          </>
        ) : (
          /* Calibration Mode */
          <div className="space-y-4">
            {result ? (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl p-6 bg-cyan-950/20 dark:bg-cyan-950/20 light:bg-white border-2 border-cyan-500/40 shadow-xl text-center space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 dark:bg-cyan-500/20 light:bg-cyan-100 border border-cyan-400/30 flex items-center justify-center text-cyan-400 dark:text-cyan-400 light:text-cyan-700 mx-auto">
                  <Scale size={24} />
                </div>
                <h3 className="text-xs font-black uppercase tracking-wider text-cyan-400 dark:text-cyan-400 light:text-cyan-700">
                  {isEs ? 'RESULTADO DE CALIBRACIÓN SOMÁTICA' : 'SOMATIC CALIBRATION RESULT'}
                </h3>
                <p className="text-sm sm:text-base text-white dark:text-white light:text-slate-900 font-bold leading-relaxed">
                  {result}
                </p>
                <button 
                  type="button"
                  onClick={() => { setStep(0); setResult(null); setAnswers({}); }}
                  className="w-full py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  {isEs ? 'Reiniciar Test de Calibración' : 'Restart Calibration Test'}
                </button>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <div className="p-6 rounded-3xl bg-white/[0.04] dark:bg-white/[0.04] light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 text-center shadow-lg min-h-[220px] flex flex-col justify-center items-center">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 dark:bg-cyan-500/15 light:bg-cyan-100 border border-cyan-400/30 flex items-center justify-center mb-3">
                    {step === 0 && <Hand size={22} className="text-cyan-400 dark:text-cyan-400 light:text-cyan-700" />}
                    {step === 1 && <HeartPulse size={22} className="text-rose-400 dark:text-rose-400 light:text-rose-700" />}
                    {step === 2 && <VolumeX size={22} className="text-purple-400 dark:text-purple-400 light:text-purple-700" />}
                  </div>
                  <span className="text-[10px] font-bold text-cyan-400 dark:text-cyan-400 light:text-cyan-700 uppercase tracking-widest mb-2">
                    {step === 0 ? t.q1 : step === 1 ? t.q2 : t.q3}
                  </span>
                  <p className="text-base sm:text-lg font-bold text-white dark:text-white light:text-slate-900 leading-snug max-w-sm">
                    {CALIBRATION_STEPS[step].question}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCalibrationAnswer(true)}
                    className="py-4 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border-2 border-emerald-400/40 text-emerald-300 dark:text-emerald-300 light:text-emerald-800 font-bold text-lg flex items-center justify-center transition-all cursor-pointer shadow-md"
                  >
                    {t.yes}
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCalibrationAnswer(false)}
                    className="py-4 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border-2 border-rose-400/40 text-rose-300 dark:text-rose-300 light:text-rose-800 font-bold text-lg flex items-center justify-center transition-all cursor-pointer shadow-md"
                  >
                    {t.no}
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
