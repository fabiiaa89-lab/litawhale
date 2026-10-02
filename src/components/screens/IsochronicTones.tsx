import { useState, useEffect, useRef } from 'react';
import Header from '../Header';
import { Language } from '../../types';
import { i18n } from '../../i18n';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Play, Square, Clock, Sparkles, Waves, Info, CheckCircle2, Sliders } from 'lucide-react';
import { ISOCHRONIC_PRESETS, IsochronicPreset, isochronicAudio } from '../../utils/isochronicAudio';

interface IsochronicTonesProps {
  language: Language;
  onBack: () => void;
}

export default function IsochronicTones({ language, onBack }: IsochronicTonesProps) {
  const t = i18n[language].isochronic;
  const isEs = language === 'es';

  const [selectedPreset, setSelectedPreset] = useState<IsochronicPreset>(ISOCHRONIC_PRESETS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [masterVolume, setMasterVolume] = useState(0.6);
  const [ambientVolume, setAmbientVolume] = useState(0.25);
  const [ambientEnabled, setAmbientEnabled] = useState(true);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(10); // in minutes, null = continuous
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Synchronize audio playback
  const handleTogglePlay = (presetToPlay?: IsochronicPreset) => {
    const target = presetToPlay || selectedPreset;

    if (isPlaying && (!presetToPlay || presetToPlay.id === selectedPreset.id)) {
      isochronicAudio.stop();
      setIsPlaying(false);
      setRemainingSeconds(null);
    } else {
      setSelectedPreset(target);
      isochronicAudio.setMasterVolume(masterVolume);
      isochronicAudio.setAmbientVolume(ambientVolume);
      isochronicAudio.toggleAmbient(ambientEnabled);
      isochronicAudio.startPreset(target);
      setIsPlaying(true);

      if (selectedDuration) {
        setRemainingSeconds(selectedDuration * 60);
      } else {
        setRemainingSeconds(null);
      }
    }
  };

  // Handle master volume
  const handleVolumeChange = (newVol: number) => {
    setMasterVolume(newVol);
    isochronicAudio.setMasterVolume(newVol);
  };

  // Handle ambient volume
  const handleAmbientVolumeChange = (newVol: number) => {
    setAmbientVolume(newVol);
    isochronicAudio.setAmbientVolume(newVol);
  };

  // Handle ambient toggle
  const handleToggleAmbient = () => {
    const next = !ambientEnabled;
    setAmbientEnabled(next);
    isochronicAudio.toggleAmbient(next);
  };

  // Countdown timer effect
  useEffect(() => {
    let timer: any = null;
    if (isPlaying && remainingSeconds !== null) {
      timer = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev === null) return null;
          if (prev <= 1) {
            isochronicAudio.stop();
            setIsPlaying(false);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, remainingSeconds]);

  // Clean up on screen unmount
  useEffect(() => {
    return () => {
      isochronicAudio.stop();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Visualizer Canvas loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      if (isPlaying) {
        const pulseRate = selectedPreset.pulseRate;
        phase += 0.05 + pulseRate * 0.008;

        const analyser = isochronicAudio.getAnalyser();
        const bufferLength = analyser ? analyser.frequencyBinCount : 32;
        const dataArray = new Uint8Array(bufferLength);
        if (analyser) {
          analyser.getByteFrequencyData(dataArray);
        }

        // Draw multiple glowing harmonic rings and sine waves
        const centerX = width / 2;
        const centerY = height / 2;
        const baseRadius = 32;
        const pulseIntensity = Math.sin(phase * (pulseRate / 2)) * 0.5 + 0.5;

        // Background subtle glow
        const glowGradient = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 70);
        glowGradient.addColorStop(0, selectedPreset.color + '44');
        glowGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGradient;
        ctx.fillRect(0, 0, width, height);

        // Circular wave rings
        for (let i = 0; i < 3; i++) {
          const r = baseRadius + i * 14 + pulseIntensity * 12;
          ctx.beginPath();
          ctx.arc(centerX, centerY, Math.max(5, r), 0, Math.PI * 2);
          ctx.strokeStyle = `${selectedPreset.color}${Math.floor((0.7 - i * 0.2) * 255).toString(16).padStart(2, '0')}`;
          ctx.lineWidth = 2.5 - i * 0.6;
          ctx.stroke();
        }

        // Pulsating center dot
        ctx.beginPath();
        ctx.arc(centerX, centerY, 8 + pulseIntensity * 6, 0, Math.PI * 2);
        ctx.fillStyle = selectedPreset.color;
        ctx.shadowColor = selectedPreset.color;
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Horizontal acoustic waveform
        ctx.beginPath();
        ctx.strokeStyle = selectedPreset.color + '88';
        ctx.lineWidth = 2;
        for (let x = 0; x < width; x += 3) {
          const normX = (x / width) * Math.PI * 4;
          const y = centerY + Math.sin(normX + phase * 2) * (14 * pulseIntensity);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else {
        // Idle serene state
        const centerX = width / 2;
        const centerY = height / 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 24, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fill();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, selectedPreset]);

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">
      <Header title={t.title} onBack={onBack} />

      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar pb-[max(5rem,calc(env(safe-area-inset-bottom,0px)+3.5rem))]">
      {/* Hero Visualizer & Master Control Card */}
      <div className="mx-6 mt-4 p-6 rounded-[36px] bg-indigo-950/20 backdrop-blur-3xl border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
          <div className="w-32 h-32 rounded-full bg-indigo-500 blur-3xl" />
        </div>

        {/* Top bar with preset name & status */}
        <div className="flex items-start justify-between mb-4 relative z-10">
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 mb-1.5">
              {selectedPreset.icon} {isEs ? selectedPreset.category.toUpperCase() : selectedPreset.category.toUpperCase()} BAND
            </span>
            <h2 className="text-lg font-black text-white leading-tight">
              {isEs ? selectedPreset.name : selectedPreset.nameEn}
            </h2>
            <p className="text-[10px] text-indigo-300/80 font-bold uppercase tracking-wider mt-0.5">
              {t.carrier} {selectedPreset.carrierFreq} Hz · {t.pulse} {selectedPreset.pulseRate} Hz
            </p>
          </div>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="w-9 h-9 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-indigo-300 transition-all"
            title="Información neurocientífica"
          >
            <Info size={16} />
          </button>
        </div>

        {/* Canvas Visualizer Center */}
        <div className="flex flex-col items-center justify-center my-3 relative z-10">
          <canvas
            ref={canvasRef}
            width={240}
            height={110}
            className="w-full max-w-[240px] h-[110px] rounded-2xl"
          />
          {isPlaying && remainingSeconds !== null && (
            <div className="mt-2 text-xs font-mono font-bold text-cyan-300 bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-500/30 flex items-center gap-1.5">
              <Clock size={12} />
              <span>{formatSeconds(remainingSeconds)}</span>
            </div>
          )}
        </div>

        {/* Main Action Play / Pause Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => handleTogglePlay()}
          className={`w-full py-4 rounded-[24px] font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 shadow-xl transition-all relative z-10 ${
            isPlaying
              ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20 border border-rose-400/50'
              : 'bg-indigo-500 hover:bg-indigo-400 text-slate-950 shadow-indigo-500/30 border border-indigo-300'
          }`}
        >
          {isPlaying ? (
            <>
              <Square size={16} fill="currentColor" />
              <span>{t.stopTone}</span>
            </>
          ) : (
            <>
              <Play size={16} fill="currentColor" />
              <span>{t.playTone}</span>
            </>
          )}
        </motion.button>

        {/* Sound sliders & ambient layer */}
        <div className="mt-5 pt-4 border-t border-white/10 space-y-4 relative z-10">
          {/* Master Volume */}
          <div>
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              <span className="flex items-center gap-1.5">
                {masterVolume > 0 ? <Volume2 size={13} className="text-indigo-400" /> : <VolumeX size={13} />}
                {t.masterVolume}
              </span>
              <span className="font-mono text-indigo-300">{Math.round(masterVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={masterVolume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
            />
          </div>

          {/* Ambient Noise Layer */}
          <div>
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              <button 
                onClick={handleToggleAmbient}
                className="flex items-center gap-1.5 text-left hover:text-white transition-colors"
              >
                <span className={`w-2.5 h-2.5 rounded-full ${ambientEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                <span>{t.ambientLayer}</span>
              </button>
              <span className="font-mono text-emerald-400">{ambientEnabled ? `${Math.round(ambientVolume * 100)}%` : 'OFF'}</span>
            </div>
            {ambientEnabled && (
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={ambientVolume}
                onChange={(e) => handleAmbientVolumeChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            )}
          </div>

          {/* Timer Selection */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
              <Clock size={12} className="text-cyan-400" />
              <span>{t.timer}</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, null].map((dur, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedDuration(dur);
                    if (isPlaying) {
                      setRemainingSeconds(dur ? dur * 60 : null);
                    }
                  }}
                  className={`py-1.5 px-2 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${
                    selectedDuration === dur
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {dur ? `${dur} ${t.min}` : t.continuous}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Neurodivergent Scientific Explanatory Box (Collapsible) */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-6 mt-4 p-6 rounded-[32px] bg-slate-900/80 backdrop-blur-2xl border border-indigo-500/30 text-xs text-slate-300 space-y-3 shadow-2xl"
          >
            <div className="flex items-center gap-2 text-indigo-400 font-black text-[11px] uppercase tracking-widest">
              <Sparkles size={14} />
              <span>{t.howItWorks}</span>
            </div>
            <p className="leading-relaxed text-slate-300">
              {t.howItWorksDesc}
            </p>
            <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-200 font-semibold leading-relaxed">
              {t.headphonesTip}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tone Selection Catalog */}
      <div className="px-6 mt-8 mb-3">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[4px]">
          {isEs ? 'FRECUENCIAS REGULATORIAS' : 'REGULATORY FREQUENCIES'}
        </h3>
      </div>

      <div className="px-6 space-y-4">
        {ISOCHRONIC_PRESETS.map((preset) => {
          const isCurrent = selectedPreset.id === preset.id;
          const isTonePlaying = isPlaying && isCurrent;

          return (
            <motion.div
              key={preset.id}
              whileTap={{ scale: 0.98 }}
              className={`p-6 rounded-[32px] border-2 transition-all duration-300 text-left shadow-2xl relative overflow-hidden ${
                isCurrent
                  ? 'bg-white/10 backdrop-blur-2xl border-indigo-400 shadow-indigo-500/10 ring-1 ring-indigo-400/20'
                  : 'bg-white/5 backdrop-blur-md border-white/10 hover:border-white/20'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-lg"
                    style={{ backgroundColor: `${preset.color}22`, border: `1px solid ${preset.color}44` }}
                  >
                    {preset.icon}
                  </div>
                  <div>
                    <h4 className="font-black text-white text-base leading-tight">
                      {isEs ? preset.name : preset.nameEn}
                    </h4>
                    <span 
                      className="inline-block text-[9px] font-black uppercase tracking-widest mt-0.5"
                      style={{ color: preset.color }}
                    >
                      {preset.pulseRate} Hz {preset.category.toUpperCase()} · Carrier {preset.carrierFreq} Hz
                    </span>
                  </div>
                </div>

                {/* Play button directly on card */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isTonePlaying) {
                      handleTogglePlay(preset);
                    } else {
                      setSelectedPreset(preset);
                      handleTogglePlay(preset);
                    }
                  }}
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${
                    isTonePlaying
                      ? 'bg-rose-500 border-rose-400 text-white shadow-lg shadow-rose-500/30'
                      : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                  }`}
                >
                  {isTonePlaying ? <Square size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                </button>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed font-normal mb-4">
                {isEs ? preset.description : preset.descriptionEn}
              </p>

              {/* Benefits checklist */}
              <div className="space-y-1.5 pt-3 border-t border-white/10">
                <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">
                  {t.targetBenefits}
                </div>
                {(isEs ? preset.benefits : preset.benefitsEn).map((b, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-200 font-medium">
                    <CheckCircle2 size={13} className="shrink-0" style={{ color: preset.color }} />
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              {/* Footer info tag */}
              <div className="mt-4 flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-slate-400 pt-2 border-t border-white/5">
                <span>{t.recommendedTime} {isEs ? preset.recommendedDuration : preset.recommendedDurationEn}</span>
                {isTonePlaying && (
                  <span className="text-emerald-400 flex items-center gap-1 font-black animate-pulse">
                    <Waves size={12} /> {t.playing}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
      </div>
    </div>
  );
}
