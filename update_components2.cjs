const fs = require('fs');

let cards = `import Header from '../Header';
import { motion } from 'motion/react';
import { AACCard, Language } from '../../types';
import { i18n } from '../../i18n';

interface CardsProps {
  language: Language;
  onBack: () => void;
  onShowFull: (card: AACCard) => void;
}

export default function Cards({ language, onBack, onShowFull }: CardsProps) {
  const t = i18n[language].cards;
  const AAC_CARDS = i18n[language].aacCards;
  
  return (
    <div className="flex flex-col h-full bg-transparent overflow-y-auto no-scrollbar pb-12">
      <Header title={t.title} onBack={onBack} titleColor="#94a3b8" />
      <div className="p-6 text-center text-slate-400 font-bold text-xs tracking-widest uppercase mb-2 opacity-80">
        {t.subtitle}
      </div>
      <div className="grid grid-cols-2 gap-4 px-6">
        {AAC_CARDS.map(card => (
          <motion.div 
            key={card.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onShowFull(card)}
            className="bg-white/5 border border-white/10 rounded-[32px] p-5 flex flex-col items-center justify-center text-center gap-3 cursor-pointer hover:bg-white/10 transition-colors shadow-2xl h-40"
          >
            <div className="text-4xl">{card.icon}</div>
            <div className="font-black tracking-tight text-white leading-tight">{card.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
`;
fs.writeFileSync('src/components/screens/Cards.tsx', cards);

let meds = `import Header from '../Header';
import { motion } from 'motion/react';
import { Med, Language } from '../../types';
import { i18n } from '../../i18n';

interface MedsProps {
  meds: Med[];
  language: Language;
  onConfirm: (index: number) => void;
  onAdd: (med: Med) => void;
  onBack: () => void;
}

export default function Meds({ meds, language, onConfirm, onAdd, onBack }: MedsProps) {
  const t = i18n[language].meds;

  return (
    <div className="flex flex-col h-full bg-transparent overflow-y-auto no-scrollbar pb-12">
      <Header title={t.title} onBack={onBack} titleColor="#fde047" />
      <div className="p-6 text-center text-yellow-400 font-bold text-xs tracking-widest uppercase mb-2 opacity-80">
        {t.subtitle}
      </div>
      
      <div className="space-y-4 px-6">
        {meds.length === 0 ? (
          <div className="text-center text-slate-500 font-bold mt-10">{t.none}</div>
        ) : (
          meds.map((med, idx) => (
            <div key={idx} className={\`p-6 rounded-[32px] border \${med.confirmed ? 'bg-emerald-950/20 border-emerald-500/20' : 'bg-yellow-500/10 border-yellow-500/30'} flex flex-col gap-4 shadow-2xl transition-colors\`}>
              <div className="flex justify-between items-start">
                <div>
                  <div className={\`font-black text-xl tracking-tight \${med.confirmed ? 'text-emerald-400' : 'text-yellow-400'}\`}>{med.name}</div>
                  <div className="text-white font-bold opacity-80">{med.dosage}</div>
                </div>
                <div className="text-xl">💊</div>
              </div>
              <div className="text-xs text-slate-400 font-bold tracking-widest uppercase">{med.schedule}</div>
              {!med.confirmed ? (
                <button 
                  onClick={() => onConfirm(idx)}
                  className="w-full bg-yellow-500 text-yellow-950 font-black tracking-widest uppercase py-4 rounded-2xl active:scale-95 transition-transform"
                >
                  {t.confirm}
                </button>
              ) : (
                <div className="w-full bg-emerald-500/20 text-emerald-400 font-black tracking-widest uppercase py-4 rounded-2xl text-center border border-emerald-500/20">
                  {t.taken}
                </div>
              )}
            </div>
          ))
        )}

        <button onClick={() => onAdd({ name: 'SOS Med', dosage: '1mg', schedule: 'When needed', confirmed: false })} className="w-full border-2 border-dashed border-white/20 text-white/50 font-bold uppercase tracking-widest py-6 rounded-[32px] hover:bg-white/5 hover:text-white transition-colors mt-8">
          {t.add}
        </button>
      </div>
    </div>
  );
}
`;
fs.writeFileSync('src/components/screens/Meds.tsx', meds);

console.log("Updated Cards, Meds");
