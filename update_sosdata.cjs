const fs = require('fs');

const code = `import { Profile, Language } from '../../types';
import Header from '../Header';
import { motion } from 'motion/react';
import { ShieldAlert, Phone, Droplets, Octagon, Zap } from 'lucide-react';
import { i18n } from '../../i18n';

interface SOSDataProps {
  profile: Profile;
  language: Language;
  onBack: () => void;
  onCall: () => void;
}

export default function SOSData({ profile, language, onBack, onCall }: SOSDataProps) {
  const t = i18n[language].sos;
  
  return (
    <div className="absolute inset-0 z-[150] bg-rose-950 flex flex-col overflow-y-auto no-scrollbar">
      <div className="absolute inset-0 bg-gradient-to-b from-rose-600/20 to-black/80 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col h-full bg-transparent">
        <Header title={t.title} onBack={onBack} titleColor="#fecaca" />
        
        <div className="p-8 flex flex-col items-center text-center space-y-8">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-24 h-24 rounded-full bg-rose-500 flex items-center justify-center shadow-[0_0_40px_rgba(244,63,94,0.6)]"
          >
            <ShieldAlert size={48} className="text-white" />
          </motion.div>

          <div className="space-y-4">
            <h1 className="text-4xl font-black text-white tracking-tighter leading-none whitespace-pre-wrap">
              {t.alert}
            </h1>
          </div>

          <div className="w-full space-y-4">
            <SOSCard 
              icon={<Droplets className="text-rose-400" />} 
              label={t.bloodType} 
              value={profile.bloodType || "N/A"} 
            />
            <SOSCard 
              icon={<Octagon className="text-rose-400" />} 
              label={t.allergies} 
              value={profile.allergies || t.none} 
            />
            <SOSCard 
              icon={<Zap className="text-rose-400" />} 
              label={t.sensitivity} 
              value={\`\${t.avoid}\${profile.hypersensitivities || t.defaultAvoid}\`} 
            />
          </div>

          <div className="w-full glass-card rounded-[32px] p-6 border-emerald-500/30 bg-emerald-950/20">
             <div className="flex items-center gap-4 text-left">
                {profile.contactImage ? (
                  <img src={profile.contactImage} alt="Contact" className="w-16 h-16 rounded-2xl object-cover border border-white/20" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-rose-400 text-3xl">👤</div>
                )}
                <div className="flex-1">
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">{t.urgent}</p>
                  <p className="text-xl font-black text-white uppercase tracking-tight">{profile.contacts?.[0]?.name || t.noContact}</p>
                  <p className="text-emerald-400 font-bold text-sm">{profile.contacts?.[0]?.phone || ""}</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onCall}
                  className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg"
                >
                  <Phone size={24} />
                </motion.button>
             </div>
          </div>

          <button 
            onClick={onBack}
            className="w-full py-6 rounded-[32px] bg-white/5 border border-white/10 text-rose-200 font-black tracking-widest uppercase text-xs"
          >
            {t.exit}
          </button>
        </div>
      </div>
    </div>
  );
}

function SOSCard({ icon, label, value }: any) {
  return (
    <div className="glass-card rounded-[24px] p-5 border-rose-500/20 bg-rose-950/20 flex flex-col items-center text-center">
      <div className="mb-2">{icon}</div>
      <p className="text-[9px] font-black text-rose-400 uppercase tracking-[3px] mb-1">{label}</p>
      <p className="text-lg font-black text-white uppercase tracking-tight leading-tight">{value}</p>
    </div>
  );
}
`;
fs.writeFileSync('src/components/screens/SOSData.tsx', code);
