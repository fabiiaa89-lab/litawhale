import { useState, useEffect } from 'react';
import { Profile, Language } from '../../types';
import Header from '../Header';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Phone, Droplets, Octagon, Zap, Send, MapPin, Check } from 'lucide-react';
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
    <div className="absolute inset-0 z-[150] bg-rose-950 flex flex-col overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-rose-600/20 to-black/80 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col h-full bg-transparent overflow-hidden">
        <Header title={t.title} onBack={onBack} />
        
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-6 flex flex-col items-center text-center space-y-6 pb-12">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 rounded-full bg-rose-500 flex items-center justify-center shadow-[0_0_40px_rgba(244,63,94,0.6)] shrink-0"
          >
            <ShieldAlert size={40} className="text-white" />
          </motion.div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black text-white tracking-tighter leading-none whitespace-pre-wrap">
              {t.alert}
            </h1>
          </div>

          <div className="w-full space-y-3">
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
              value={`${t.avoid}${profile.hypersensitivities || t.defaultAvoid}`} 
            />
          </div>

          {/* Contact Box with Phone Call and WhatsApp buttons */}
          <div className="w-full glass-card rounded-[32px] p-5 border-emerald-500/30 bg-emerald-950/20 space-y-4">
             <div className="flex items-center gap-3 text-left">
                {profile.contactImage ? (
                  <img 
                    src={profile.contactImage} 
                    alt="Contact" 
                    className="w-14 h-14 rounded-2xl object-cover border border-white/20 shrink-0 cursor-pointer hover:opacity-90 transition-opacity" 
                    onClick={() => setEnlargedImage(profile.contactImage!)}
                    referrerPolicy="no-referrer"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-rose-400 text-2xl shrink-0">👤</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-0.5">{t.urgent}</p>
                  <p className="text-base sm:text-lg font-black text-white uppercase tracking-tight leading-snug break-words">{emergencyContact?.name || t.noContact}</p>
                  <p className="text-emerald-400 font-bold text-xs leading-snug break-all">{emergencyContact?.phone || ""}</p>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-3 pt-1">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onCall}
                  className="py-3 px-3 rounded-2xl bg-emerald-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <Phone size={18} />
                  <span>{isSpanish ? 'Llamar' : 'Call'}</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowWhatsAppConsent(true)}
                  className="py-3 px-3 rounded-2xl bg-emerald-600/80 hover:bg-emerald-600 border border-emerald-400/40 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <Send size={18} />
                  <span>WhatsApp</span>
                </motion.button>
             </div>
          </div>

          <button 
            onClick={onBack}
            className="w-full py-5 rounded-[32px] bg-white/5 border border-white/10 text-rose-200 font-black tracking-widest uppercase text-xs active:scale-95 transition-all"
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

              {/* Explicit User Notice mandated by prompt */}
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
                  onClick={handleConfirmWhatsApp}
                  className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send size={16} />
                  <span>{isSpanish ? 'Abrir WhatsApp con mi Ubicación' : 'Open WhatsApp with my Location'}</span>
                </button>

                <button
                  onClick={() => setShowWhatsAppConsent(false)}
                  className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-bold text-xs uppercase tracking-wider transition-colors"
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

function SOSCard({ icon, label, value }: any) {
  return (
    <div className="glass-card rounded-[24px] p-4 border-rose-500/20 bg-rose-950/20 flex flex-col items-center text-center">
      <div className="mb-1.5">{icon}</div>
      <p className="text-[9px] font-black text-rose-400 uppercase tracking-[3px] mb-0.5">{label}</p>
      <p className="text-base font-black text-white uppercase tracking-tight leading-tight">{value}</p>
    </div>
  );
}
