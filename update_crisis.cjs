const fs = require('fs');

const code = `import { motion } from 'motion/react';
import Header from '../Header';
import { AACCard, Profile, Language } from '../../types';
import { i18n } from '../../i18n';

interface CrisisProps {
  profile: Profile;
  language: Language;
  onBack: () => void;
  onActivateCave: () => void;
  onCallEmergency: () => void;
  onShowCard: (card: AACCard) => void;
  onNavigateHaptic: () => void;
}

export default function Crisis({ profile, language, onBack, onActivateCave, onCallEmergency, onShowCard, onNavigateHaptic }: CrisisProps) {
  const t = i18n[language].crisis;

  return (
    <div className="flex flex-col h-full bg-transparent overflow-y-auto no-scrollbar pb-24">
      <Header title={t.title} onBack={onBack} titleColor="#fca5a5" />
      
      <div className="space-y-6 px-6 mt-6">
        <CrisisStep 
            number={1} 
            title={t.step1}
            text={t.step1Text}
            bg="bg-rose-950/20 border-rose-500/30"
            textColor="text-rose-200"
            subColor="text-rose-400"
        />

        <CrisisStep 
            number={2} 
            title={t.step2}
            text={t.step2Text}
            bg="bg-slate-900/40 border-slate-700/50"
            textColor="text-slate-200"
            subColor="text-slate-400"
        />

        <CrisisStep 
            number={3} 
            title={t.step3}
            text={t.step3Text}
            bg="bg-slate-900/40 border-slate-700/50"
            textColor="text-slate-200"
            subColor="text-slate-400"
        />

        <motion.div 
            whileTap={{ scale: 0.98 }}
            onClick={onCallEmergency}
            className="w-full bg-rose-600 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer shadow-[0_0_30px_rgba(225,29,72,0.3)] border border-rose-400/50"
        >
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                🚨
            </div>
            <div className="text-xl font-black text-white tracking-widest text-center">{t.ideationTitle}</div>
            <div className="text-center text-rose-200 text-sm font-medium px-4">
                {t.ideationText}
            </div>
        </motion.div>

        {profile.crisisMed && (
            <div className="bg-rose-950/30 border-2 border-rose-500/20 rounded-3xl p-5">
                <div className="text-rose-400 font-bold uppercase tracking-widest text-xs mb-2 flex items-center gap-2">
                    <span>💊</span> {t.sosTitle}
                </div>
                <div className="text-xl font-black text-rose-100">{t.sosText}{profile.crisisMed}</div>
            </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-4">
            <button onClick={onCallEmergency} className="glass-card p-4 rounded-3xl flex flex-col items-center gap-3 active:scale-95 transition-transform">
                <span className="text-2xl">📞</span>
                <span className="text-[10px] font-black uppercase text-slate-300 text-center">{t.emergency}</span>
            </button>
            <button onClick={onActivateCave} className="glass-card p-4 rounded-3xl flex flex-col items-center gap-3 active:scale-95 transition-transform">
                <span className="text-2xl">🌑</span>
                <span className="text-[10px] font-black uppercase text-slate-300 text-center">{t.cave}</span>
            </button>
            <button onClick={onNavigateHaptic} className="glass-card p-4 rounded-3xl flex flex-col items-center gap-3 active:scale-95 transition-transform">
                <span className="text-2xl">〰️</span>
                <span className="text-[10px] font-black uppercase text-slate-300 text-center">{t.haptic}</span>
            </button>
            <button onClick={() => onShowCard({ id: 'crisis', icon: '💬', text: 'I AM HAVING A MELTDOWN. I NEED QUIET.', bgColor: 'bg-rose-600', color: 'text-white' })} className="glass-card p-4 rounded-3xl flex flex-col items-center gap-3 active:scale-95 transition-transform">
                <span className="text-2xl">💬</span>
                <span className="text-[10px] font-black uppercase text-slate-300 text-center">{t.showCard}</span>
            </button>
        </div>
      </div>
    </div>
  );
}

function CrisisStep({ number, title, text, bg, textColor, subColor }: { number: number, title: string, text: string, bg: string, textColor: string, subColor: string }) {
    return (
        <div className={\`\${bg} border backdrop-blur-xl rounded-3xl p-5 relative overflow-hidden\`}>
            <div className="absolute -right-4 -top-8 text-8xl font-black opacity-5 italic">{number}</div>
            <div className="flex items-center gap-3 mb-3 relative z-10">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0">
                    {number}
                </div>
                <div className={\`text-sm font-black tracking-widest uppercase \${textColor}\`}>
                    {title}
                </div>
            </div>
            <p className={\`text-sm font-medium leading-relaxed relative z-10 \${subColor}\`}>
                {text}
            </p>
        </div>
    )
}
`;
fs.writeFileSync('src/components/screens/Crisis.tsx', code);
