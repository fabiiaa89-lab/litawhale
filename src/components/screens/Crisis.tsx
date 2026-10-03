import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from '../Header';
import { AACCard, Profile, Language } from '../../types';
import { i18n } from '../../i18n';
import { 
  Phone, 
  Moon, 
  Activity, 
  MessageSquare, 
  AlertTriangle, 
  ShieldAlert, 
  X, 
  HeartHandshake, 
  Waves, 
  Sparkles,
  LifeBuoy,
  MapPin,
  Send,
  Globe,
  Check
} from 'lucide-react';
import { getHelplineByCountry, detectCountryByGPS, buildWhatsAppEmergencyUrl } from '../../utils/emergency';

interface CrisisProps {
  profile: Profile;
  language: Language;
  onBack: () => void;
  onActivateCave: () => void;
  onCallEmergency: () => void;
  onShowCard: (card: AACCard) => void;
  onNavigateHaptic: () => void;
}

export default function Crisis({ 
  profile, 
  language, 
  onBack, 
  onActivateCave, 
  onCallEmergency, 
  onShowCard, 
  onNavigateHaptic 
}: CrisisProps) {
  const t = i18n[language].crisis;
  const [isIdeationModalOpen, setIsIdeationModalOpen] = useState(false);
  const [showWhatsAppConsent, setShowWhatsAppConsent] = useState(false);
  const [noContactAlert, setNoContactAlert] = useState(false);
  const [detectedCountry, setDetectedCountry] = useState<string | null>(null);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const emergencyContact = profile.contacts?.[0];
  const isSpanish = language === 'es';

  // Una sola solicitud de GPS al abrir la pantalla
  useEffect(() => {
    let isMounted = true;
    setIsLocating(true);
    detectCountryByGPS().then(({ country, lat, lng }) => {
      if (!isMounted) return;
      if (lat !== undefined && lng !== undefined) setGpsCoords({ lat, lng });
      if (country) setDetectedCountry(country);
      setIsLocating(false);
    });
    return () => { isMounted = false; };
  }, []);

  const helpline = getHelplineByCountry(detectedCountry || profile.country, language);

  const handleOpenWhatsApp = () => {
    if (!emergencyContact?.phone) {
      setNoContactAlert(true);
      return;
    }
    setShowWhatsAppConsent(true);
  };

  const handleConfirmWhatsApp = () => {
    if (!emergencyContact?.phone) return;
    const url = buildWhatsAppEmergencyUrl(
      emergencyContact.phone,
      gpsCoords?.lat,
      gpsCoords?.lng,
      profile.address,
      language
    );
    window.location.href = url;
    setShowWhatsAppConsent(false);
  };

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">
      <Header title={t.title} onBack={onBack} />
      
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-6 mt-4 space-y-5 safe-area-bottom pb-12">
        {/* Step 1 */}
        <CrisisStep 
          number={1} 
          title={t.step1}
          text={t.step1Text}
          bg="bg-rose-950/25 border-rose-500/30"
          textColor="text-rose-200"
          subColor="text-rose-300/90"
        />

        {/* Step 2 */}
        <CrisisStep 
          number={2} 
          title={t.step2}
          text={t.step2Text}
          bg="bg-slate-900/40 border-slate-700/50"
          textColor="text-slate-200"
          subColor="text-slate-400"
        />

        {/* Step 3 */}
        <CrisisStep 
          number={3} 
          title={t.step3}
          text={t.step3Text}
          bg="bg-slate-900/40 border-slate-700/50"
          textColor="text-slate-200"
          subColor="text-slate-400"
        />

        {/* Ideation Protocol Banner (Interactive Button) */}
        <motion.button 
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsIdeationModalOpen(true)}
          className="w-full text-left bg-gradient-to-br from-rose-600 via-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 rounded-[32px] p-6 flex flex-col items-center justify-center gap-3 cursor-pointer shadow-[0_0_35px_rgba(225,29,72,0.35)] border border-rose-400/50 active:scale-[0.98] transition-all"
        >
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
            <ShieldAlert size={28} className="stroke-[2.5]" />
          </div>
          <div className="text-xl font-black text-white tracking-widest uppercase text-center drop-shadow">
            {t.ideationTitle}
          </div>
          <div className="text-center text-rose-100 text-xs sm:text-sm font-medium px-2 leading-relaxed opacity-95">
            {t.ideationText}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-rose-200 bg-black/20 px-3.5 py-1 rounded-full border border-white/10 mt-1">
            {isSpanish ? 'Pulsa para activar protocolo de seguridad' : 'Tap to open safety protocol'}
          </span>
        </motion.button>

        {/* S.O.S Pharmacology if configured */}
        {profile.crisisMed && (
          <div className="bg-rose-950/30 border border-rose-500/30 rounded-3xl p-5 shadow-lg">
            <div className="text-rose-400 font-bold uppercase tracking-widest text-xs mb-2 flex items-center gap-2">
              <Sparkles size={14} />
              <span>{t.sosTitle}</span>
            </div>
            <div className="text-xl font-black text-rose-100">{t.sosText}{profile.crisisMed}</div>
          </div>
        )}

        {/* 4 Bottom Action Buttons with EXACTLY ONE ICON EACH */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          {/* Emergency Contact */}
          <motion.button 
            whileTap={{ scale: 0.93 }}
            onClick={onCallEmergency} 
            className="glass-card hover:bg-white/10 p-5 rounded-[28px] flex flex-col items-center justify-center gap-2.5 active:scale-95 transition-all text-center border-white/10 shadow-xl group min-h-[110px]"
          >
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Phone size={20} className="stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-200 leading-tight">
              {t.emergency}
            </span>
          </motion.button>

          {/* Cave Mode */}
          <motion.button 
            whileTap={{ scale: 0.93 }}
            onClick={onActivateCave} 
            className="glass-card hover:bg-white/10 p-5 rounded-[28px] flex flex-col items-center justify-center gap-2.5 active:scale-95 transition-all text-center border-white/10 shadow-xl group min-h-[110px]"
          >
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Moon size={20} className="stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-200 leading-tight">
              {t.cave}
            </span>
          </motion.button>

          {/* Regulatory Vibration */}
          <motion.button 
            whileTap={{ scale: 0.93 }}
            onClick={onNavigateHaptic} 
            className="glass-card hover:bg-white/10 p-5 rounded-[28px] flex flex-col items-center justify-center gap-2.5 active:scale-95 transition-all text-center border-white/10 shadow-xl group min-h-[110px]"
          >
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Activity size={20} className="stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-200 leading-tight">
              {t.haptic}
            </span>
          </motion.button>

          {/* Show Meltdown AAC Card */}
          <motion.button 
            whileTap={{ scale: 0.93 }}
            onClick={() => onShowCard({ 
              id: 'crisis-meltdown', 
              icon: '🗣️', 
              label: isSpanish ? 'CRISIS SENSORIAL' : 'SENSORY OVERLOAD', 
              text: isSpanish 
                ? 'ESTOY EN CRISIS SENSORIAL / MELTDOWN.\n\nPOR FAVOR, DAME SILENCIO, ESPACIO Y NO ME TOQUES.' 
                : 'I AM EXPERIENCING SENSORY OVERLOAD / MELTDOWN.\n\nPLEASE GIVE ME SILENCE, SPACE AND DO NOT TOUCH ME.' 
            })} 
            className="glass-card hover:bg-white/10 p-5 rounded-[28px] flex flex-col items-center justify-center gap-2.5 active:scale-95 transition-all text-center border-white/10 shadow-xl group min-h-[110px]"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageSquare size={20} className="stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-200 leading-tight">
              {t.showCard}
            </span>
          </motion.button>
        </div>
      </div>

      {/* Comprehensive Ideation Safety Protocol Modal */}
      <AnimatePresence>
        {isIdeationModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-black/85 backdrop-blur-lg flex items-end sm:items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ y: 60, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 60, scale: 0.95 }}
              className="bg-[#191528] border border-rose-500/40 rounded-[32px] p-6 w-full max-w-lg shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto no-scrollbar"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-rose-500/20 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30 shrink-0">
                    <HeartHandshake size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-base leading-tight">
                      {t.ideationModal?.title || 'Protocolo de Seguridad & Desescalada'}
                    </h3>
                    <p className="text-[11px] font-bold text-rose-400 uppercase tracking-wider mt-0.5 flex items-center gap-1.5">
                      <MapPin size={12} className="text-cyan-400" />
                      <span>
                        {helpline.country ? `${isSpanish ? 'Ubicación GPS' : 'GPS Location'}: ${helpline.country}` : (isSpanish ? 'Sobrecarga Detectada' : 'Overload Detected')}
                      </span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsIdeationModalOpen(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Neurological Truth Statement */}
              <div className="bg-rose-950/40 border border-rose-500/30 rounded-2xl p-4.5 space-y-2">
                <div className="text-[10px] font-black text-rose-300 uppercase tracking-widest flex items-center gap-1.5">
                  <AlertTriangle size={13} className="text-rose-400 shrink-0" />
                  <span>{t.ideationModal?.truthTitle || 'RECUERDA ESTA VERDAD NEUROLÓGICA:'}</span>
                </div>
                <p className="text-xs sm:text-sm text-rose-100 font-medium leading-relaxed">
                  {t.ideationModal?.truthText || 'Tu cerebro está experimentando una sobrecarga sensorial y emocional máxima. Tu sistema nervioso busca desconectarse del dolor, no del valor de tu vida. Esto es un estado temporal y va a ceder.'}
                </p>
              </div>

              {/* Step by step sensory de-escalation */}
              <div className="space-y-2.5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {t.ideationModal?.actionStepsTitle || 'PASOS DE RESCATE INMEDIATO'}
                </p>
                
                <div className="space-y-2 text-xs text-slate-200">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5">
                    <Waves size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                    <div>{t.ideationModal?.stepA}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5">
                    <Moon size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                    <div>{t.ideationModal?.stepB}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5">
                    <LifeBuoy size={16} className="text-rose-400 shrink-0 mt-0.5" />
                    <div>{t.ideationModal?.stepC}</div>
                  </div>
                </div>
              </div>

              {/* Contact Actions: Call or WhatsApp */}
              <div className="space-y-2.5 pt-2">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {isSpanish ? 'CONTACTAR APOYO SEGURO' : 'SAFE SUPPORT CONTACT'}
                </div>

                {emergencyContact?.phone ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Call Option */}
                    <a
                      href={`tel:${emergencyContact.phone}`}
                      className="py-3.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 active:scale-95 transition-all"
                    >
                      <Phone size={16} />
                      <span>{isSpanish ? 'Llamada' : 'Call'} ({emergencyContact.name})</span>
                    </a>

                    {/* WhatsApp Option */}
                    <button
                      onClick={handleOpenWhatsApp}
                      className="py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 active:scale-95 transition-all"
                    >
                      <Send size={16} />
                      <span>WhatsApp (GPS)</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={onCallEmergency}
                    className="w-full py-3.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 active:scale-95 transition-all"
                  >
                    <Phone size={18} />
                    <span>{t.ideationModal?.callContact || 'Llamar a Contacto de Apoyo'}</span>
                  </button>
                )}

                {!detectedCountry && !profile.country && (
                  <p className="text-[11px] text-amber-300 px-1">
                    {isSpanish
                      ? 'Elige tu país en Ajustes para ver tu línea de ayuda local, o busca una en findahelpline.com.'
                      : 'Choose your country in Settings to see your local helpline, or search at findahelpline.com.'}
                  </p>
                )}

                {/* Localized Helpline button matching user's GPS country */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold text-cyan-400 px-1">
                    <span className="flex items-center gap-1 uppercase tracking-widest">
                      <Globe size={11} />
                      {isSpanish ? 'Línea del País (GPS)' : 'Country Hotline (GPS)'}: {helpline.country}
                    </span>
                    {isLocating && <span className="animate-pulse text-slate-400">{isSpanish ? 'Detectando...' : 'Detecting...'}</span>}
                  </div>

                  <a
                    href={`tel:${helpline.number.replace(/[^0-9]/g, '') || helpline.number}`}
                    className="w-full py-3.5 px-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-cyan-500/30 text-white font-bold text-xs flex items-center justify-between active:scale-95 transition-all shadow-md"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <LifeBuoy size={18} className="text-cyan-400 shrink-0" />
                      <div className="text-left min-w-0 flex-1">
                        <div className="font-bold text-white text-xs leading-tight">{helpline.name}</div>
                        <div className="text-[10px] text-cyan-300 font-medium leading-tight mt-0.5">
                          {isSpanish ? 'Emergencia congruente con tu ubicación GPS' : 'Emergency line matched to your GPS location'}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-black text-cyan-300 bg-cyan-500/20 px-3 py-1 rounded-xl border border-cyan-500/30 shrink-0 ml-2">
                      {helpline.number}
                    </span>
                  </a>
                </div>

                {/* Shortcuts: Cave & Haptic */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    onClick={() => {
                      setIsIdeationModalOpen(false);
                      onActivateCave();
                    }}
                    className="py-3 px-3 rounded-2xl bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-500/30 text-indigo-200 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Moon size={14} className="text-indigo-400" />
                    <span>{t.ideationModal?.openCave || 'Modo Cueva'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsIdeationModalOpen(false);
                      onNavigateHaptic();
                    }}
                    className="py-3 px-3 rounded-2xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-200 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Activity size={14} className="text-cyan-400" />
                    <span>{t.ideationModal?.openHaptic || 'Vibración'}</span>
                  </button>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setIsIdeationModalOpen(false)}
                  className="w-full mt-2 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs uppercase tracking-wider transition-colors border border-white/5"
                >
                  {t.ideationModal?.close || 'Entendido / Me mantengo a salvo'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp Real-time Location Consent & Confirmation Modal */}
      <AnimatePresence>
        {showWhatsAppConsent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center p-5"
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
        {/* No Contact Alert Modal */}
        {noContactAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setNoContactAlert(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-[#161828] border border-rose-500/30 rounded-3xl p-6 shadow-2xl text-center space-y-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {isSpanish ? 'Sin contacto registrado' : 'No emergency contact'}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {isSpanish
                    ? 'No has guardado un teléfono de emergencia todavía. Puedes configurarlo en cualquier momento desde Ajustes.'
                    : 'You have not saved an emergency contact phone yet. You can add one in Settings.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setNoContactAlert(false)}
                className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors"
              >
                {isSpanish ? 'Entendido' : 'Got it'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CrisisStep({ 
  number, 
  title, 
  text, 
  bg, 
  textColor, 
  subColor 
}: { 
  number: number; 
  title: string; 
  text: string; 
  bg: string; 
  textColor: string; 
  subColor: string; 
}) {
  return (
    <div className={`${bg} border backdrop-blur-xl rounded-3xl p-5 relative overflow-hidden shadow-lg`}>
      <div className="absolute -right-4 -top-8 text-8xl font-black opacity-5 italic select-none">{number}</div>
      <div className="flex items-center gap-3 mb-2 relative z-10">
        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0">
          {number}
        </div>
        <div className={`text-sm font-black tracking-widest uppercase ${textColor}`}>
          {title}
        </div>
      </div>
      <p className={`text-xs sm:text-sm font-medium leading-relaxed relative z-10 ${subColor}`}>
        {text}
      </p>
    </div>
  );
}
