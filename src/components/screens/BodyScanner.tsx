import { useState, useEffect } from 'react';
import Header from '../Header';
import { i18n } from '../../i18n';
import { motion, AnimatePresence } from 'motion/react';
import { Profile, Language } from '../../types';

interface BodyScannerProps {
  profile: Profile;
  language: Language;
  onBack: () => void;
}

export default function BodyScanner({ profile, language, onBack }: BodyScannerProps) {
  const t = i18n[language].body;
  const bodySub = i18n[language].bodySub;
  const SYMPTOMS = i18n[language].symptoms;
  const CALIBRATION_STEPS = i18n[language].calibrationSteps;
  const calResultMap = i18n[language].calResult;

  const [mode, setMode] = useState<'scan' | 'calibration'>('scan');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  
  // Breathing guide state
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [secondsRemaining, setSecondsRemaining] = useState(4);

  // Calibration state
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [result, setResult] = useState<string | null>(null);

  // Reliable 1-second interval countdown for breathing regulation (4s inhale, 8s exhale)
  useEffect(() => {
    if (!isBreathing) return;

    // Start with inhale 4 seconds
    setBreathPhase('inhale');
    setSecondsRemaining(4);

    let currentPhase: 'inhale' | 'exhale' = 'inhale';

    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          currentPhase = currentPhase === 'inhale' ? 'exhale' : 'inhale';
          setBreathPhase(currentPhase);
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            try {
              navigator.vibrate(currentPhase === 'inhale' ? [40] : [30, 40, 30]);
            } catch (e) {}
          }
          return currentPhase === 'inhale' ? 4 : 8;
        }
        return prev - 1;
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
      if (language === 'es') {
        if (positiveCount >= 2) {
          suggestion = "Nivel 4: Sobrecarga sensorial detectada. Se recomienda activar Protocolo de Crisis o Modo Cueva.";
        } else if (positiveCount === 1) {
          suggestion = "Nivel 2: Tensión moderada. Se recomienda Anclaje de Realidad y Respiración 4-8.";
        } else {
          suggestion = "Nivel 1: Sistema estable. Mantén tu entorno protegido y monitoreo suave.";
        }
        setResult(`Basado en tus respuestas y tu perfil de ${profile.hypersensitivities || 'sensibilidad'}, sugerencia: ${suggestion}`);
      } else {
        if (positiveCount >= 2) {
          suggestion = "Level 4: Sensory overload detected. Crisis Protocol or Cave Mode recommended.";
        } else if (positiveCount === 1) {
          suggestion = "Level 2: Moderate tension. Reality Anchor and 4-8 Breathing recommended.";
        } else {
          suggestion = "Level 1: System stable. Maintain calm surroundings and gentle monitoring.";
        }
        setResult(`Based on your responses and your ${profile.hypersensitivities || 'sensitivity'} profile, suggestion: ${suggestion}`);
      }
    }
  };

  const totalPhaseSeconds = breathPhase === 'inhale' ? 4 : 8;
  const progressPercent = ((totalPhaseSeconds - secondsRemaining + 1) / totalPhaseSeconds) * 100;

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">
      <Header title={t.title} onBack={onBack} />
      
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar pb-[max(5rem,calc(env(safe-area-inset-bottom,0px)+3.5rem))]">
      {/* Mode tabs */}
      <div className="px-6 mt-6 mb-8 flex gap-2">
        <button 
          onClick={() => setMode('scan')}
          className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
            mode === 'scan' 
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-lg shadow-cyan-500/10' 
              : 'bg-white/5 border-white/10 text-slate-400'
          }`}
        >
          {t.scanBtn}
        </button>
        <button 
          onClick={() => setMode('calibration')}
          className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
            mode === 'calibration' 
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-lg shadow-cyan-500/10' 
              : 'bg-white/5 border-white/10 text-slate-400'
          }`}
        >
          {t.calBtn}
        </button>
      </div>

      {mode === 'scan' ? (
        <>
          <p className="px-6 text-[10px] text-slate-400 mb-6 font-black uppercase tracking-[3px]">
            {t.subtitle}
          </p>

          {/* Symptoms grid */}
          <div className="grid grid-cols-2 gap-4 px-6 mb-8">
            {SYMPTOMS.map(s => (
              <motion.button
                key={s.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleSymptom(s.id)}
                className={`p-5 rounded-[28px] border-2 transition-all duration-300 flex flex-col items-center text-center text-[10px] font-black uppercase tracking-wider shadow-2xl ${
                  selected.has(s.id) 
                    ? 'bg-emerald-500/20 backdrop-blur-2xl border-emerald-400 text-emerald-200 shadow-emerald-500/20' 
                    : 'bg-white/5 backdrop-blur-md border-white/10 text-slate-300 hover:border-white/20'
                }`}
              >
                <span className="text-3xl mb-2 drop-shadow-md">{s.icon}</span>
                <span className="leading-tight">{s.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Symptom translation card */}
          <AnimatePresence mode="wait">
            {selected.size > 0 && currentTranslation && (
              <motion.div
                key={currentTranslation.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mx-6 mb-8 bg-emerald-950/30 backdrop-blur-3xl border border-emerald-500/40 rounded-[32px] p-6 shadow-3xl ring-1 ring-emerald-500/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[10px] uppercase tracking-[4px] text-emerald-400 font-black">
                    {t.translationTitle}
                  </h3>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                    {currentTranslation.icon}
                  </span>
                </div>
                <p className="text-base text-emerald-50 text-left leading-snug mb-5 font-bold">
                  {currentTranslation.translation}
                </p>
                <div className="pt-4 border-t border-emerald-500/20 text-xs text-emerald-300 leading-relaxed font-semibold">
                  {currentTranslation.protocol}
                </div>

                {(!isBreathing) && (
                  <button
                    onClick={() => setIsBreathing(true)}
                    className="w-full mt-5 py-3 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 text-cyan-200 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-cyan-500/30 transition-all"
                  >
                    <span>🫁</span>
                    <span>{language === 'es' ? 'INICIAR GUÍA RESPIRATORIA (4-8)' : 'START BREATHING GUIDE (4-8)'}</span>
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Relaxing Breathing Pacer (Fixed layout & Non-overlapping countdown) */}
          {isBreathing && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-6 mb-12 bg-black/40 backdrop-blur-3xl border border-cyan-500/30 rounded-[36px] p-6 flex flex-col items-center text-center shadow-2xl relative overflow-hidden"
            >
              {/* Phase Header Label */}
              <div className="w-full mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-[11px] font-black text-cyan-300 uppercase tracking-[3px]">
                    {breathPhase === 'inhale' 
                      ? (language === 'es' ? 'INHALA (LLENA EL ABDOMEN)' : 'INHALE (FILL ABDOMEN)') 
                      : (language === 'es' ? 'EXHALA LENTAMENTE' : 'EXHALE SLOWLY')}
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-bold mt-2">
                  {breathPhase === 'inhale' 
                    ? (language === 'es' ? 'Toma aire suave en 4 segundos' : 'Gently breathe in for 4 seconds') 
                    : (language === 'es' ? 'Suelta el aire despacio en 8 segundos' : 'Release breath gently for 8 seconds')}
                </div>
              </div>

              {/* Breathing Circle Container with SVG timer ring and internal numbers */}
              <div className="relative w-52 h-52 flex items-center justify-center my-4">
                {/* SVG Progress Ring */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="rgba(34, 211, 238, 0.1)"
                    strokeWidth="3"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke={breathPhase === 'inhale' ? '#22d3ee' : '#818cf8'}
                    strokeWidth="4"
                    strokeDasharray="276.46"
                    strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>

                {/* Animated Glowing Breathing Orb */}
                <motion.div
                  animate={{
                    scale: breathPhase === 'inhale' ? 1.08 : 0.88,
                    boxShadow: breathPhase === 'inhale' 
                      ? '0 0 40px rgba(34, 211, 238, 0.35)' 
                      : '0 0 15px rgba(129, 140, 248, 0.15)',
                    backgroundColor: breathPhase === 'inhale' 
                      ? 'rgba(34, 211, 238, 0.18)' 
                      : 'rgba(129, 140, 248, 0.12)'
                  }}
                  transition={{ 
                    duration: breathPhase === 'inhale' ? 4 : 8, 
                    ease: "easeInOut" 
                  }}
                  className="absolute w-36 h-36 rounded-full border-2 border-cyan-400/40 flex flex-col items-center justify-center text-cyan-200 backdrop-blur-2xl pointer-events-none"
                >
                  <span className="text-2xl font-black mb-0.5">
                    {breathPhase === 'inhale' ? '↑' : '↓'}
                  </span>
                  <span className="text-4xl font-black tracking-tight text-white drop-shadow-md">
                    {secondsRemaining}s
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-cyan-300/80">
                    {breathPhase === 'inhale' ? 'In' : 'Out'}
                  </span>
                </motion.div>
              </div>

              {/* Stop breathing guide button */}
              <motion.button 
                whileTap={{ scale: 0.96 }}
                onClick={() => setIsBreathing(false)}
                className="mt-6 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white px-8 py-3.5 rounded-[22px] font-black uppercase text-[10px] tracking-widest transition-all shadow-xl"
              >
                {t.stopGuide}
              </motion.button>
            </motion.div>
          )}
        </>
      ) : (
        /* Calibration Mode */
        <div className="px-6 py-2">
          {result ? (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-cyan-950/30 backdrop-blur-3xl border border-cyan-500/40 rounded-[36px] p-8 shadow-3xl text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-2xl mx-auto mb-4">
                🔬
              </div>
              <h3 className="text-[10px] uppercase tracking-[4px] text-cyan-400 font-black mb-4">
                {t.calBtn}
              </h3>
              <p className="text-base text-white font-bold leading-relaxed mb-8">
                {result}
              </p>
              <button 
                onClick={() => { setStep(0); setResult(null); setAnswers({}); }}
                className="w-full py-4 rounded-2xl bg-cyan-500 text-slate-900 font-black uppercase text-xs tracking-widest hover:bg-cyan-400 transition-all shadow-lg"
              >
                {language === 'es' ? 'REINICIAR TEST' : 'RESTART TEST'}
              </button>
            </motion.div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[36px] p-8 min-h-[260px] flex flex-col items-center justify-center text-center shadow-2xl">
                <p className="text-[10px] text-cyan-400 font-black uppercase tracking-[4px] mb-6">
                  {step === 0 ? t.q1 : step === 1 ? t.q2 : t.q3}
                </p>
                <p className="text-xl font-black text-white leading-snug">
                  {CALIBRATION_STEPS[step].question}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCalibrationAnswer(true)}
                  className="py-5 rounded-[28px] bg-emerald-500/20 border-2 border-emerald-500/40 text-emerald-200 font-black text-xl flex items-center justify-center hover:bg-emerald-500/30 transition-all"
                >
                  {t.yes}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCalibrationAnswer(false)}
                  className="py-5 rounded-[28px] bg-rose-500/20 border-2 border-rose-500/40 text-rose-200 font-black text-xl flex items-center justify-center hover:bg-rose-500/30 transition-all"
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
