import { motion } from 'motion/react';
import { AACCard, Language } from '../types';
import { i18n } from '../i18n';

interface FullCardOverlayProps {
  language: Language;
  card: AACCard;
  onClose: () => void;
}

export default function FullCardOverlay({ card, language, onClose }: FullCardOverlayProps) {
  const t = i18n[language].cards;
  
  // Resolve localized text for default cards if app language is switched
  const resolvedCard: AACCard = !card.isCustom 
    ? (i18n[language].aacCards.find(c => c.id === card.id) || card) 
    : card;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-3xl flex flex-col items-center justify-center p-8 text-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center max-w-md w-full max-h-[70vh]"
      >
        <div className="text-[120px] mb-8 leading-none drop-shadow-[0_20px_50px_rgba(255,255,255,0.2)]">{resolvedCard.icon}</div>
        <div className="text-xl md:text-2xl font-black text-white leading-relaxed whitespace-pre-wrap max-w-sm drop-shadow-lg uppercase tracking-tight overflow-y-auto no-scrollbar pb-4">
          {resolvedCard.text}
        </div>
      </motion.div>

      <button
        onClick={onClose}
        className="absolute bottom-[max(2rem,calc(env(safe-area-inset-bottom,0px)+1.5rem))] px-12 py-6 rounded-[28px] bg-white/10 backdrop-blur-xl border border-white/20 text-white font-bold shadow-2xl tracking-widest uppercase text-xs active:scale-95 transition-transform cursor-pointer"
      >
        {t.close}
      </button>
    </motion.div>
  );
}
