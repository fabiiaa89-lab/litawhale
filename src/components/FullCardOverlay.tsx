import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AACCard, Language } from '../types';
import { i18n } from '../i18n';
import { speakLatinAmericanText } from '../utils/speech';
import { 
  EyeOff, 
  MessageSquareOff, 
  ShieldAlert, 
  Hourglass, 
  HeartHandshake, 
  HeartPulse,
  VolumeX,
  Hand,
  Droplets,
  Utensils,
  Bed,
  Moon,
  Sparkles,
  X,
  Volume2,
  VolumeX as VolumeMute
} from 'lucide-react';

interface FullCardOverlayProps {
  language: Language;
  card: AACCard;
  onClose: () => void;
}

export default function FullCardOverlay({ card, language, onClose }: FullCardOverlayProps) {
  const isEs = language === 'es';
  const t = i18n[language].cards;
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Resolve localized text for default cards if app language is switched
  const resolvedCard: AACCard = !card.isCustom 
    ? (i18n[language].aacCards.find(c => c.id === card.id) || card) 
    : card;

  const handleSpeak = () => {
    if (isSpeaking) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      return;
    }

    speakLatinAmericanText(
      `${resolvedCard.label}. ${resolvedCard.text}`,
      isEs ? 'es' : 'en',
      {
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      }
    );
  };

  const renderLargeVisual = () => {
    const target = resolvedCard.id || resolvedCard.icon;

    switch (target) {
      case 'noverbal':
      case 'MessageSquareOff':
        return (
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-purple-500/20 dark:bg-purple-500/20 light:bg-purple-100 border-2 border-purple-400/50 dark:border-purple-400/50 light:border-purple-300 flex items-center justify-center text-purple-300 dark:text-purple-300 light:text-purple-700 shadow-[0_0_35px_rgba(168,85,247,0.3)]">
            <MessageSquareOff size={56} />
          </div>
        );
      case 'meltdown':
      case 'ShieldAlert':
        return (
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-rose-500/20 dark:bg-rose-500/20 light:bg-rose-100 border-2 border-rose-400/50 dark:border-rose-400/50 light:border-rose-300 flex items-center justify-center text-rose-300 dark:text-rose-300 light:text-rose-700 shadow-[0_0_35px_rgba(244,63,94,0.3)]">
            <ShieldAlert size={56} />
          </div>
        );
      case 'noise':
      case 'VolumeX':
        return (
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-blue-500/20 dark:bg-blue-500/20 light:bg-blue-100 border-2 border-blue-400/50 dark:border-blue-400/50 light:border-blue-300 flex items-center justify-center text-blue-300 dark:text-blue-300 light:text-blue-700 shadow-[0_0_35px_rgba(59,130,246,0.3)]">
            <VolumeX size={56} />
          </div>
        );
      case 'space':
      case 'Hand':
        return (
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-amber-500/20 dark:bg-amber-500/20 light:bg-amber-100 border-2 border-amber-400/50 dark:border-amber-400/50 light:border-amber-300 flex items-center justify-center text-amber-300 dark:text-amber-300 light:text-amber-800 shadow-[0_0_35px_rgba(245,158,11,0.3)]">
            <Hand size={56} />
          </div>
        );
      case 'water':
      case 'Droplets':
        return (
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-cyan-500/20 dark:bg-cyan-500/20 light:bg-cyan-100 border-2 border-cyan-400/50 dark:border-cyan-400/50 light:border-cyan-300 flex items-center justify-center text-cyan-300 dark:text-cyan-300 light:text-cyan-800 shadow-[0_0_35px_rgba(6,182,212,0.3)]">
            <Droplets size={56} />
          </div>
        );
      case 'food':
      case 'Utensils':
        return (
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-emerald-500/20 dark:bg-emerald-500/20 light:bg-emerald-100 border-2 border-emerald-400/50 dark:border-emerald-400/50 light:border-emerald-300 flex items-center justify-center text-emerald-300 dark:text-emerald-300 light:text-emerald-800 shadow-[0_0_35px_rgba(16,185,129,0.3)]">
            <Utensils size={56} />
          </div>
        );
      case 'rest':
      case 'Bed':
        return (
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-indigo-500/20 dark:bg-indigo-500/20 light:bg-indigo-100 border-2 border-indigo-400/50 dark:border-indigo-400/50 light:border-indigo-300 flex items-center justify-center text-indigo-300 dark:text-indigo-300 light:text-indigo-700 shadow-[0_0_35px_rgba(99,102,241,0.3)]">
            <Bed size={56} />
          </div>
        );
      case 'slow':
      case 'Hourglass':
        return (
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-amber-500/20 dark:bg-amber-500/20 light:bg-amber-100 border-2 border-amber-400/50 dark:border-amber-400/50 light:border-amber-300 flex items-center justify-center text-amber-300 dark:text-amber-300 light:text-amber-800 shadow-[0_0_35px_rgba(245,158,11,0.3)]">
            <Hourglass size={56} />
          </div>
        );
      case 'dissoc':
      case 'EyeOff':
        return (
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-indigo-500/20 dark:bg-indigo-500/20 light:bg-indigo-100 border-2 border-indigo-400/50 dark:border-indigo-400/50 light:border-indigo-300 flex items-center justify-center text-indigo-300 dark:text-indigo-300 light:text-indigo-700 shadow-[0_0_35px_rgba(99,102,241,0.3)]">
            <EyeOff size={56} />
          </div>
        );
      case 'cave':
      case 'Moon':
        return (
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-700/40 dark:bg-slate-700/40 light:bg-slate-200 border-2 border-slate-500/50 dark:border-slate-500/50 light:border-slate-300 flex items-center justify-center text-sky-300 dark:text-sky-300 light:text-slate-800 shadow-[0_0_35px_rgba(148,163,184,0.3)]">
            <Moon size={56} />
          </div>
        );
      case 'bathroom':
      case 'Sparkles':
        return (
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-teal-500/20 dark:bg-teal-500/20 light:bg-teal-100 border-2 border-teal-400/50 dark:border-teal-400/50 light:border-teal-300 flex items-center justify-center text-teal-300 dark:text-teal-300 light:text-teal-800 shadow-[0_0_35px_rgba(20,184,166,0.3)]">
            <Sparkles size={56} />
          </div>
        );
      case 'med':
      case 'HeartPulse':
        return (
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-rose-500/20 dark:bg-rose-500/20 light:bg-rose-100 border-2 border-rose-400/50 dark:border-rose-400/50 light:border-rose-300 flex items-center justify-center text-rose-300 dark:text-rose-300 light:text-rose-700 shadow-[0_0_35px_rgba(244,63,94,0.3)]">
            <HeartPulse size={56} />
          </div>
        );
      default:
        return (
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-cyan-500/20 dark:bg-cyan-500/20 light:bg-cyan-100 border-2 border-cyan-400/50 dark:border-cyan-400/50 light:border-cyan-300 flex items-center justify-center text-4xl shadow-[0_0_35px_rgba(6,182,212,0.3)]">
            {resolvedCard.icon}
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] bg-slate-950/95 dark:bg-slate-950/95 light:bg-slate-50/95 backdrop-blur-3xl flex flex-col items-center justify-between p-6 sm:p-8 text-center"
    >
      {/* Top Banner Notice */}
      <div className="w-full flex items-center justify-between max-w-md">
        <span className="text-[10px] font-black uppercase tracking-widest text-teal-300 dark:text-teal-300 light:text-teal-800 bg-teal-500/15 dark:bg-teal-500/15 light:bg-teal-100 border border-teal-400/30 px-3.5 py-1 rounded-full">
          {isEs ? 'COMUNICACIÓN NO VERBAL' : 'NON-VERBAL COMMUNICATION'}
        </span>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-2xl bg-white/10 dark:bg-white/10 light:bg-slate-200 hover:bg-white/20 border border-white/15 dark:border-white/15 light:border-slate-300 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label={t.close}
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Focus Area with Dignified Typography */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center max-w-md w-full my-auto space-y-5"
      >
        <div className="mb-2">
          {renderLargeVisual()}
        </div>

        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-teal-300 dark:text-teal-300 light:text-teal-700 tracking-tight leading-tight">
            {resolvedCard.label}
          </h2>

          <div className="text-2xl sm:text-3xl font-black text-white dark:text-white light:text-slate-900 leading-snug whitespace-pre-wrap max-w-md drop-shadow-xl tracking-tight">
            {resolvedCard.text}
          </div>
        </div>

        {/* Read aloud Speech button */}
        <button
          type="button"
          onClick={handleSpeak}
          className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md ${
            isSpeaking 
              ? 'bg-teal-500 text-slate-950 animate-pulse' 
              : 'bg-white/10 dark:bg-white/10 light:bg-slate-200 border border-white/20 dark:border-white/20 light:border-slate-300 text-slate-200 dark:text-slate-200 light:text-slate-800 hover:bg-white/20'
          }`}
        >
          <Volume2 size={16} />
          <span>{isSpeaking ? (isEs ? 'Reproduciendo audio...' : 'Speaking...') : (isEs ? 'Pronunciar en voz alta' : 'Read aloud')}</span>
        </button>
      </motion.div>

      {/* Dismiss Button */}
      <div className="w-full max-w-md pt-4">
        <button
          type="button"
          onClick={onClose}
          className="w-full py-4 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-teal-500/20"
        >
          {t.close}
        </button>
      </div>
    </motion.div>
  );
}
