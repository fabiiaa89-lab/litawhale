import { useState, useEffect, ReactNode } from 'react';
import { Profile, Language } from '../../types';
import Header from '../Header';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Phone, Droplets, AlertOctagon, Zap, Send, MapPin, Check, User } from 'lucide-react';
import { i18n } from '../../i18n';
import { buildWhatsAppEmergencyUrl } from '../../utils/emergency';

interface SOSDataProps {
  profile: Profile;
  language: Language;
  onBack: () => void;
  onCall: () => void;
}

export default function SOSData({ profile, language, onBack, onCall }: SOSDataProps) {
  const t = i18n[language].sos;
  const isSpanish = language === 'es';
  const [showWhatsAppConsent, setShowWhatsAppConsent] = useState(false);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setGpsCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.warn(err)
      );
    }
  }, []);

  const emergencyContact = profile.contacts?.[0];

  const handleConfirmWhatsApp = () => {
    if (!emergencyContact?.phone) return;
    const url = buildWhatsAppEmergencyUrl(
      emergencyContact.phone,
      gpsCoords?.lat,
      gpsCoords?.lng,
      profile.address,
      language
    );
    window.open(url, '_blank');
    setShowWhatsAppConsent(false);
  };
  
  return (
    <div className="absolute inset-0 z-[150] bg-slate-950 dark:bg-slate-950 light:bg-slate-50 flex flex-col overflow-hidden">
      {/* Background ambient medical glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-rose-950/40 via-transparent to-black/60 dark:from-rose-950/40 dark:to-black/60 light:from-rose-100/60 light:to-slate-100 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col h-full bg-transparent overflow-hidden">
        <Header title={t.title} onBack={onBack} />
        
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-4 sm:px-6 pt-4 pb-[max(5rem,calc(env(safe-area-inset-bottom,0px)+3.5rem))] flex flex-col items-center space-y-4">
          
          {/* Beacon Header Card */}
          <div className="w-full p-4 sm:p-5 rounded-3xl bg-rose-500/10 dark:bg-rose-500/10 light:bg-white border-2 border-rose-500/35 dark:border-rose-500/35 light:border-rose-300 shadow-xl flex items-center gap-4 text-left">
            <motion.div
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-rose-500/25 border-2 border-rose-500/60 flex items-center justify-center shadow-[0_0_25px_rgba(244,63,94,0.45)] shrink-0"
            >
              <ShieldAlert size={32} className="text-rose-400 dark:text-rose-400 light:text-rose-600" />
            </motion.div>

            <div className="flex-1 min-w-0">
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-rose-400 dark:text-rose-400 light:text-rose-700 block">
                {t.badge || (isSpanish ? 'IDENTIDAD NEURODIVERGENTE & APOYO' : 'NEURODIVERGENT IDENTITY & SUPPORT')}
              </span>
              <h1 className="text-base sm:text-lg font-black text-white dark:text-white light:text-slate-900 tracking-tight leading-snug mt-1 whitespace-pre-line">
                {t.alert}
              </h1>
              <p className="text-[11px] sm:text-xs text-rose-200/90 dark:text-rose-200/90 light:text-slate-700 font-medium leading-relaxed mt-2">
                {isSpanish 
                  ? 'Muestra esta pantalla ante sobrecarga sensorial, crisis o mutismo. Diseñado para adultos autistas y TDAH.'
                  : 'Show this card during sensory overload, meltdown, or non-verbal states. Designed for autistic and ADHD adults.'}
              </p>
            </div>
          </div>

          {/* Vitals Data Cards with Refined Neuro-Accessible Typography */}
          <div className="w-full space-y-3">
            <SOSCard 
              icon={<Droplets size={24} className="text-rose-400" />} 
              badgeBg="bg-rose-500/20 border-rose-400/30"
              label={t.bloodType} 
              value={profile.bloodType ? profile.bloodType.toUpperCase() : (t.notSpecified || (isSpanish ? 'No especificado' : 'Not specified'))} 
            />
            <SOSCard 
              icon={<AlertOctagon size={24} className="text-amber-400" />} 
              badgeBg="bg-amber-500/20 border-amber-400/30"
              label={t.allergies} 
              value={profile.allergies || t.none} 
            />
            <SOSCard 
              icon={<Zap size={24} className="text-cyan-400" />} 
              badgeBg="bg-cyan-500/20 border-cyan-400/30"
              label={t.sensitivity} 
              value={`${t.avoid}${profile.hypersensitivities || t.defaultAvoid}`} 
            />
          </div>

          {/* Emergency Safe Contact Card */}
          <div className="w-full rounded-3xl p-5 border-2 border-emerald-500/40 bg-emerald-950/20 dark:bg-emerald-950/20 light:bg-emerald-50/80 space-y-4 shadow-xl">
             <div className="flex items-center gap-3.5 text-left">
                {profile.contactImage ? (
                  <img 
                    src={profile.contactImage} 
                    alt="Contact" 
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-400/40 shrink-0 cursor-pointer hover:opacity-90 transition-opacity shadow-md" 
                    onClick={() => setEnlargedImage(profile.contactImage!)}
                    referrerPolicy="no-referrer"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/35 flex items-center justify-center text-emerald-400 shrink-0 shadow-md">
                    <User size={26} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black text-emerald-400 dark:text-emerald-400 light:text-emerald-800 uppercase tracking-widest block">
                    {t.urgent}
                  </span>
                  <p className="text-base sm:text-lg font-black text-white dark:text-white light:text-slate-900 uppercase tracking-tight leading-snug break-words">
                    {emergencyContact?.name || t.noContact}
                  </p>
                  <p className="text-emerald-300 dark:text-emerald-300 light:text-emerald-700 font-mono font-bold text-xs leading-snug break-all mt-0.5">
                    {emergencyContact?.phone || ""}
                  </p>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-3 pt-1">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onCall}
                  className="py-3.5 px-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 cursor-pointer transition-all"
                >
                  <Phone size={17} />
                  <span>{isSpanish ? 'Llamar' : 'Call'}</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowWhatsAppConsent(true)}
                  className="py-3.5 px-3 rounded-2xl bg-emerald-600/80 hover:bg-emerald-600 border border-emerald-400/50 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all"
                >
                  <Send size={17} />
                  <span>WhatsApp</span>
                </motion.button>
             </div>
          </div>

          {/* Exit / Return Button with Accessible Touch Size */}
          <button 
            type="button"
            onClick={onBack}
            className="w-full py-4 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-slate-200 border border-white/10 dark:border-white/10 light:border-slate-300 text-rose-300 dark:text-rose-300 light:text-slate-700 font-black tracking-wider uppercase text-xs active:scale-95 hover:bg-white/10 transition-all cursor-pointer"
          >
            {t.exit}
          </button>
        </div>
      </div>

      {/* WhatsApp Real-time Location Consent & Confirmation Modal */}
      <AnimatePresence>
        {showWhatsAppConsent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center p-5 text-left"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#121c24] border border-emerald-500/40 rounded-[32px] p-6 w-full max-w-md shadow-2xl space-y-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
                  <Send size={24} />
                </div>
                <div>
                  <h3 className="font-black text-white text-base leading-tight">
                    {isSpanish ? 'Compartir Ubicación por WhatsApp' : 'Share Location via WhatsApp'}
                  </h3>
                  <p className="text-xs text-emerald-400 font-bold">
                    {emergencyContact?.name} ({emergencyContact?.phone})
                  </p>
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-2 text-emerald-100 text-xs leading-relaxed font-medium">
                <div className="font-black text-emerald-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <MapPin size={13} className="text-emerald-400" />
                  <span>{isSpanish ? 'AVISO DE PRIVACIDAD & SEGURIDAD' : 'PRIVACY & SAFETY NOTICE'}</span>
                </div>
                <p>
                  {isSpanish 
                    ? 'Al compartir tu ubicación por WhatsApp, también estás permitiendo que WhatsApp comparta tu ubicación en tiempo real con tu contacto de emergencia seguro.'
                    : 'By sharing your location via WhatsApp, you are also allowing WhatsApp to share your real-time location with your safe emergency contact.'}
                </p>
              </div>

              {gpsCoords && (
                <div className="text-[11px] font-mono text-cyan-300 bg-white/5 p-3 rounded-xl border border-white/10 flex items-center gap-2">
                  <Check size={14} className="text-emerald-400" />
                  <span>GPS: {gpsCoords.lat.toFixed(5)}, {gpsCoords.lng.toFixed(5)}</span>
                </div>
              )}

              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleConfirmWhatsApp}
                  className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send size={16} />
                  <span>{isSpanish ? 'Abrir WhatsApp con mi Ubicación' : 'Open WhatsApp with my Location'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowWhatsAppConsent(false)}
                  className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  {isSpanish ? 'Cancelar' : 'Cancel'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {enlargedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEnlargedImage(null)}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6 cursor-pointer"
          >
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={enlargedImage}
              alt="Enlarged"
              className="max-w-full max-h-full rounded-[32px] object-contain shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SOSCard({ 
  icon, 
  badgeBg = "bg-rose-500/20 border-rose-400/30", 
  label, 
  value 
}: { 
  icon: ReactNode; 
  badgeBg?: string; 
  label: string; 
  value: string; 
}) {
  return (
    <div className="w-full p-4 rounded-2xl sm:rounded-3xl border border-white/10 dark:border-white/10 light:border-slate-200 bg-white/[0.04] dark:bg-white/[0.04] light:bg-white flex items-center gap-4 text-left shadow-md">
      <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 shadow-sm ${badgeBg}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-[11px] font-extrabold text-slate-400 dark:text-slate-400 light:text-slate-500 uppercase tracking-wider block">
          {label}
        </span>
        <p className="text-base sm:text-lg font-black text-white dark:text-white light:text-slate-900 tracking-tight leading-snug break-words mt-0.5">
          {value}
        </p>
      </div>
    </div>
  );
}
