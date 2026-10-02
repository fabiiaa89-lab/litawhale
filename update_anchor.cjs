const fs = require('fs');

const code = `import { useEffect, useState } from 'react';
import Header from '../Header';
import { Profile, Language } from '../../types';
import { motion } from 'motion/react';
import { i18n } from '../../i18n';

interface AnchorProps {
  profile: Profile;
  language: Language;
  onBack: () => void;
}

export default function Anchor({ profile, language, onBack }: AnchorProps) {
  const t = i18n[language].anchor;
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const requestLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(pos => {
      const url = \`https://maps.google.com/?q=\${pos.coords.latitude},\${pos.coords.longitude}\`;
      window.open(url, '_blank');
    });
  };

  const callEmergency = () => {
    if (profile.contacts?.[0]?.phone) {
      window.location.href = \`tel:\${profile.contacts[0].phone}\`;
    }
  };
  
  const getLocale = () => language === 'es' ? 'es-ES' : 'en-US';

  return (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar pb-16 bg-transparent">
      <Header title={t.title} onBack={onBack} />

      <div className="mx-6 mt-6 p-8 rounded-[40px] bg-white/5 backdrop-blur-2xl border border-white/20 text-center mb-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-transparent opacity-50" />
        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            {profile.userImage ? (
              <img src={profile.userImage} alt={profile.name} className="w-24 h-24 rounded-[32px] object-cover border-2 border-white/20 shadow-2xl" referrerPolicy="no-referrer" />
            ) : (
              <div className="text-7xl drop-shadow-[0_10px_30px_rgba(255,255,255,0.2)]">👤</div>
            )}
          </div>
          <div className="text-3xl font-black tracking-tighter text-white drop-shadow-lg uppercase">{profile.name || t.identity}</div>
          <div className="text-[10px] text-cyan-400 mt-2 font-black uppercase tracking-[3px] opacity-80">
            {now.toLocaleDateString(getLocale(), { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
          <div className="text-xs text-slate-400 mt-6 px-4 font-bold tracking-tight opacity-70 italic">{profile.address}</div>
        </div>
      </div>

      <div className="mx-6 bg-black/40 backdrop-blur-3xl rounded-[32px] p-8 mb-8 border border-white/10 shadow-inner space-y-4">
        <ContextLine label={t.location} value={t.locationVal} />
        <ContextLine 
          label={t.cronos} 
          value={\`\${now.toLocaleTimeString(getLocale(), { hour: '2-digit', minute: '2-digit' })} — \${now.toLocaleDateString(getLocale(), { weekday: 'long' })}\`} 
        />
        <ContextLine label={t.status} value={t.statusVal} />
      </div>

      <div className="px-6 mb-8 grid grid-cols-2 gap-4">
        <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-3xl p-5 text-center">
            <div className="text-xl mb-1">🍔</div>
            <div className="text-[9px] text-emerald-400 font-black tracking-widest mb-1">{t.food}</div>
            <div className="text-sm text-white font-bold">{profile.safeFood}</div>
        </div>
        <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-3xl p-5 text-center">
            <div className="text-xl mb-1">💊</div>
            <div className="text-[9px] text-indigo-400 font-black tracking-widest mb-1">{t.daily}</div>
            <div className="text-sm text-white font-bold">{profile.dailyMed}</div>
        </div>
      </div>

      <div className="px-6 space-y-4">
        <div className="text-[10px] text-slate-500 font-black tracking-[4px] uppercase ml-4">{t.security}</div>
        
        {profile.contacts?.[0] && (
            <div className="glass-card p-5 rounded-[32px] flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {profile.contactImage ? (
                        <img src={profile.contactImage} alt="Contact" className="w-12 h-12 rounded-2xl object-cover" />
                    ) : (
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-xl">👤</div>
                    )}
                    <div>
                        <div className="text-[9px] text-emerald-400 font-black tracking-widest">{t.safePerson}</div>
                        <div className="text-white font-bold">{profile.contacts[0].name}</div>
                    </div>
                </div>
                <button onClick={callEmergency} className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 active:bg-emerald-500/30 transition-colors">
                    📞
                </button>
            </div>
        )}

        <button 
            onClick={requestLocation}
            className="w-full glass-card p-6 rounded-[32px] flex items-center justify-center gap-3 text-cyan-300 font-black tracking-widest text-xs active:bg-white/5 transition-colors"
        >
            {t.map}
        </button>
      </div>
    </div>
  );
}

function ContextLine({ label, value }: { label: string, value: string }) {
    return (
        <div className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
            <div className="text-[9px] font-black text-cyan-600 mb-1 tracking-[3px] uppercase">{label}</div>
            <div className="text-white font-bold tracking-tight text-sm">{value}</div>
        </div>
    )
}
`;
fs.writeFileSync('src/components/screens/Anchor.tsx', code);
