import { useState, useEffect } from 'react';
import Header from '../Header';
import { getCompanionMessage } from '../../services/geminiService';
import { motion } from 'motion/react';
import { HeartPulse, Loader2 } from 'lucide-react';
import { Profile } from '../../types';

import { Language } from '../../types';
import { i18n } from '../../i18n';
interface CompanionProps {
  profile: Profile;
  language: Language;
  onBack: () => void;
}

export default function Companion({ profile, language, onBack }: CompanionProps) {
  const t = i18n[language].companion;
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchCompanion = async () => {
    if (!profile.supportEntity) return;
    setIsLoading(true);
    const msg = await getCompanionMessage(profile.supportEntity, language);
    setMessage(msg);
    setIsLoading(false);
  };

  useEffect(() => {
    if (profile.supportEntity) {
      fetchCompanion();
    }
  }, [profile.supportEntity]);

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-hidden">
      <Header title={t.title} onBack={onBack} />
      
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar safe-area-bottom flex flex-col items-center p-8 text-center">
        {!profile.supportEntity ? (
          <div className="glass-card p-6 rounded-3xl border border-rose-500/20 bg-rose-500/5">
            <HeartPulse className="w-12 h-12 text-rose-400 mx-auto mb-4 opacity-50" />
            <p className="text-white font-bold leading-relaxed">
              {t.noEntity}
            </p>
            <p className="text-slate-400 text-sm mt-2">
              {t.goConfig}
            </p>
          </div>
        ) : (
          <div className="w-full max-w-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.15)] mb-8 relative"
            >
              <HeartPulse className={`w-12 h-12 text-indigo-400 ${isLoading ? 'animate-pulse' : ''}`} />
              {isLoading && (
                <div className="absolute inset-0 rounded-full border-t-2 border-indigo-400 animate-spin opacity-50" />
              )}
            </motion.div>

            <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-8">
              {profile.supportEntity}
            </h3>

            <div className="min-h-[120px]">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center text-indigo-400/50 space-y-4">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <p className="text-xs font-bold uppercase tracking-widest">{t.connecting}</p>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent" />
                  <p className="relative z-10 text-lg leading-relaxed text-slate-200 font-medium italic">
                    "{message}"
                  </p>
                </motion.div>
              )}
            </div>

            {!isLoading && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={fetchCompanion}
                className="mt-12 px-8 py-4 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 text-xs font-black uppercase tracking-widest hover:bg-indigo-500/20 transition-colors"
              >
                {t.newInteraction}
              </motion.button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
