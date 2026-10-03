import { useEffect, useState } from 'react';
import Header from '../Header';
import { Profile, Language } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  MapPin, 
  RotateCw, 
  Navigation, 
  ExternalLink, 
  Share2, 
  Check, 
  Phone, 
  Map, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { i18n } from '../../i18n';

interface AnchorProps {
  profile: Profile;
  language: Language;
  onBack: () => void;
}

export default function Anchor({ profile, language, onBack }: AnchorProps) {
  const t = i18n[language].anchor;
  const [now, setNow] = useState(new Date());

  const [locationText, setLocationText] = useState<string>(() => profile.address || t.locationVal);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'locating' | 'success' | 'error'>('idle');
  const [showMapEmbed, setShowMapEmbed] = useState<boolean>(true);
  const [copied, setCopied] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const fetchGPSLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      if (profile.address) setLocationText(profile.address);
      return;
    }

    setLocationStatus('locating');
    setLocationText(t.locating || 'Buscando satélites GPS...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy: acc } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        setAccuracy(Math.round(acc));
        setLocationStatus('success');

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            { headers: { 'Accept-Language': language === 'es' ? 'es' : 'en' } }
          );
          if (res.ok) {
            const data = await res.json();
            if (data && data.address) {
              const addr = data.address;
              const street = addr.road || addr.pedestrian || addr.suburb || addr.neighbourhood || '';
              const number = addr.house_number ? ` ${addr.house_number}` : '';
              const city = addr.city || addr.town || addr.village || addr.municipality || addr.county || '';
              const state = addr.state || '';
              
              const formatted = [street ? `${street}${number}` : '', city, state].filter(Boolean).join(', ');
              if (formatted) {
                setLocationText(`${formatted} (GPS ±${Math.round(acc)}m)`);
                return;
              }
            }
            if (data && data.display_name) {
              const shortName = data.display_name.split(',').slice(0, 3).join(',');
              setLocationText(`${shortName} (GPS ±${Math.round(acc)}m)`);
              return;
            }
          }
        } catch (err) {
          console.warn('Reverse geocoding error:', err);
        }

        // Formato de coordenadas si no hay conexión para geocodificación
        const latStr = `${Math.abs(latitude).toFixed(4)}° ${latitude >= 0 ? 'N' : 'S'}`;
        const lngStr = `${Math.abs(longitude).toFixed(4)}° ${longitude >= 0 ? 'E' : 'W'}`;
        setLocationText(`${latStr}, ${lngStr} • ${t.gpsDetected || 'GPS'} (±${Math.round(acc)}m)`);
      },
      (err) => {
        console.warn('Geolocation failed:', err);
        setLocationStatus('error');
        if (profile.address) {
          setLocationText(profile.address);
        } else {
          setLocationText(t.locationVal);
        }
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }
    );
  };

  // Intentar geolocalización automática al entrar
  useEffect(() => {
    fetchGPSLocation();
  }, [profile.address, language]);

  const callEmergency = () => {
    if (profile.contacts?.[0]?.phone) {
      window.location.href = `tel:${profile.contacts[0].phone}`;
    }
  };

  const handleShareLocation = async () => {
    const locQuery = coords 
      ? `https://maps.google.com/?q=${coords.lat},${coords.lng}`
      : (profile.address ? `https://maps.google.com/?q=${encodeURIComponent(profile.address)}` : locationText);

    const shareData = {
      title: 'Mi Ubicación - Lita Whale SOS',
      text: `Estoy aquí: ${locationText}. ${locQuery}`,
      url: locQuery,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (e) {
        // User cancelled or share failed, fallback to copy
      }
    }

    try {
      await navigator.clipboard.writeText(`${shareData.text}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.warn('Clipboard write failed:', e);
    }
  };
  
  const getLocale = () => language === 'es' ? 'es-ES' : 'en-US';

  const mapQuery = coords 
    ? `${coords.lat},${coords.lng}` 
    : encodeURIComponent(profile.address || 'Madrid');
  
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
  const appleMapsUrl = `https://maps.apple.com/?q=${mapQuery}`;
  const embedMapUrl = coords 
    ? `https://maps.google.com/maps?q=${coords.lat},${coords.lng}&hl=${language}&z=15&output=embed`
    : (profile.address ? `https://maps.google.com/maps?q=${encodeURIComponent(profile.address)}&hl=${language}&z=15&output=embed` : `https://maps.google.com/maps?q=${encodeURIComponent(profile.country || 'Madrid')}&hl=${language}&z=13&output=embed`);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-transparent">
      <Header title={t.title} onBack={onBack} />
      
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar pb-[max(5rem,calc(env(safe-area-inset-bottom,0px)+3.5rem))]">
      {/* Identity Master Card */}
      <div className="mx-6 mt-6 p-8 rounded-[40px] bg-white/5 backdrop-blur-2xl border border-white/20 text-center mb-6 shadow-2xl relative group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-indigo-500/5 to-transparent opacity-60" />
        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            {profile.userImage ? (
              <img 
                src={profile.userImage} 
                alt={profile.name} 
                className="w-24 h-24 rounded-[32px] object-cover border-2 border-white/20 shadow-2xl cursor-pointer hover:opacity-90 transition-opacity" 
                onClick={() => setEnlargedImage(profile.userImage!)}
                referrerPolicy="no-referrer" 
              />
            ) : (
              <div className="w-24 h-24 rounded-[32px] bg-white/10 flex items-center justify-center border-2 border-white/20 shadow-2xl">
                <User size={48} className="text-white/70" />
              </div>
            )}
          </div>
          <div className="text-[10px] text-cyan-400 font-black uppercase tracking-[3px] mb-1 flex items-center justify-center gap-1.5">
            <Sparkles size={12} />
            <span>{language === 'es' ? 'YO SOY' : 'I AM'}</span>
          </div>
          <div className="text-3xl font-black tracking-tighter text-white drop-shadow-lg uppercase">
            {profile.name || (language === 'es' ? 'Usuario' : 'User')}
          </div>
          <div className="text-[10px] text-cyan-400 mt-2 font-black uppercase tracking-[3px] opacity-80">
            {now.toLocaleDateString(getLocale(), { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
          {profile.address && (
            <div className="text-xs text-slate-400 mt-5 px-4 font-bold tracking-tight opacity-70 italic">
              {profile.address}
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Reality Anchor Context Box */}
      <div className="mx-6 bg-black/40 backdrop-blur-3xl rounded-[32px] p-6 sm:p-8 mb-6 border border-white/10 shadow-inner space-y-4">
        {/* Dynamic Location Line */}
        <div className="border-b border-white/10 pb-4">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <MapPin size={13} className="text-cyan-400" />
              <span className="text-[10px] font-black text-cyan-400 tracking-[3px] uppercase">
                {t.location}
              </span>
            </div>
            
            <button
              onClick={fetchGPSLocation}
              disabled={locationStatus === 'locating'}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-[10px] font-bold uppercase tracking-wider active:scale-95 transition-all cursor-pointer border border-cyan-500/20"
              title={t.refreshLocation || "Actualizar GPS"}
            >
              <RotateCw size={11} className={locationStatus === 'locating' ? 'animate-spin' : ''} />
              <span>{locationStatus === 'locating' ? (language === 'es' ? 'Buscando...' : 'Locating...') : (t.refreshLocation || 'GPS')}</span>
            </button>
          </div>

          <div className="text-white font-bold tracking-tight text-sm sm:text-base leading-snug">
            {locationText}
          </div>

          {coords && accuracy && (
            <div className="text-[10px] text-cyan-300/80 font-mono mt-1 flex items-center gap-2">
              <span>{coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}</span>
              <span>•</span>
              <span>{t.accuracy || 'Precisión:'} ±{accuracy}m</span>
            </div>
          )}

          {locationStatus === 'error' && !profile.address && (
            <div className="text-[11px] text-amber-300/80 mt-1 flex items-center gap-1">
              <AlertCircle size={12} />
              <span>{t.gpsError || 'GPS no disponible'}</span>
            </div>
          )}
        </div>

        {/* Chronos Line */}
        <ContextLine 
          label={t.cronos} 
          value={`${now.toLocaleTimeString(getLocale(), { hour: '2-digit', minute: '2-digit' })} — ${now.toLocaleDateString(getLocale(), { weekday: 'long' })}`} 
        />

        {/* Neurological Status */}
        <ContextLine label={t.status} value={t.statusVal} />
      </div>

      {/* Interactive Live Map Section */}
      <div className="mx-6 mb-6 rounded-[32px] bg-slate-900/60 backdrop-blur-2xl border border-white/15 overflow-hidden shadow-2xl">
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
              <Navigation size={16} />
            </div>
            <div>
              <h4 className="text-xs font-black tracking-wider text-white uppercase">
                {t.interactiveMap || (language === 'es' ? 'MAPA DE ENTORNO' : 'ENVIRONMENT MAP')}
              </h4>
              <p className="text-[10px] text-slate-400 font-medium">
                {coords ? (t.gpsDetected || 'GPS en vivo') : (profile.address || t.locationVal)}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowMapEmbed(!showMapEmbed)}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
          >
            <span>{showMapEmbed ? (language === 'es' ? 'Ocultar' : 'Hide') : (language === 'es' ? 'Mostrar' : 'Show')}</span>
            {showMapEmbed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Embedded Iframe Map */}
        <AnimatePresence>
          {showMapEmbed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 220, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full relative overflow-hidden bg-slate-950"
            >
              <iframe
                title="Location Map"
                src={embedMapUrl}
                className="w-full h-full border-0 filter saturate-150 contrast-125"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 text-[9px] font-bold text-cyan-300 tracking-wider uppercase pointer-events-none">
                {coords ? 'GPS Live' : 'Map View'}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* External Map Action Links */}
        <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-3 gap-2 bg-black/30">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 active:scale-95 transition-all flex items-center justify-center gap-2 text-white font-bold text-xs border border-white/10 text-center"
          >
            <Map size={14} className="text-cyan-400 shrink-0" />
            <span className="whitespace-nowrap">Google Maps</span>
            <ExternalLink size={11} className="text-slate-400 shrink-0" />
          </a>

          <a
            href={appleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 active:scale-95 transition-all flex items-center justify-center gap-2 text-white font-bold text-xs border border-white/10 text-center"
          >
            <Navigation size={14} className="text-blue-400 shrink-0" />
            <span className="whitespace-nowrap">Apple Maps</span>
            <ExternalLink size={11} className="text-slate-400 shrink-0" />
          </a>

          <button
            onClick={handleShareLocation}
            className="p-3 rounded-2xl bg-cyan-600/20 hover:bg-cyan-600/30 active:scale-95 transition-all flex items-center justify-center gap-2 text-cyan-200 font-bold text-xs border border-cyan-500/30 cursor-pointer"
          >
            {copied ? (
              <>
                <Check size={14} className="text-emerald-400 shrink-0" />
                <span className="text-emerald-300 font-bold whitespace-nowrap">{language === 'es' ? '¡Copiado!' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Share2 size={14} className="text-cyan-400 shrink-0" />
                <span className="whitespace-nowrap">{language === 'es' ? 'Compartir Ubicación' : 'Share Location'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Needs & Anchoring Presets */}
      <div className="px-6 mb-8 grid grid-cols-2 gap-4">
        <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-3xl p-5 text-center shadow-lg">
          <div className="text-xl mb-1">🍔</div>
          <div className="text-[9px] text-emerald-400 font-black tracking-widest mb-1 uppercase">{t.food}</div>
          <div className="text-sm text-white font-bold">{profile.safeFood || (language === 'es' ? 'Comida segura' : 'Safe food')}</div>
        </div>
        <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-3xl p-5 text-center shadow-lg">
          <div className="text-xl mb-1">💊</div>
          <div className="text-[9px] text-indigo-400 font-black tracking-widest mb-1 uppercase">{t.daily}</div>
          <div className="text-sm text-white font-bold">{profile.dailyMed || (language === 'es' ? 'Medicación al día' : 'Daily medication')}</div>
        </div>
      </div>

      {/* Safety Contact & Direct Action */}
      <div className="px-6 mb-8 space-y-4">
        <div className="text-[10px] text-slate-500 font-black tracking-[4px] uppercase ml-4">{t.security}</div>
        
        {profile.contacts?.[0] && (
          <div className="glass-card p-5 rounded-[32px] flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-4">
              {profile.contactImage ? (
                <img src={profile.contactImage} alt="Contact" className="w-12 h-12 rounded-2xl object-cover border border-white/20 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setEnlargedImage(profile.contactImage!)} referrerPolicy="no-referrer" />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-xl">👤</div>
              )}
              <div>
                <div className="text-[9px] text-emerald-400 font-black tracking-widest uppercase">{t.safePerson}</div>
                <div className="text-white font-bold">{profile.contacts[0].name}</div>
                {profile.contacts[0].phone && (
                  <div className="text-xs text-slate-400">{profile.contacts[0].phone}</div>
                )}
              </div>
            </div>
            <button 
              onClick={callEmergency} 
              className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 active:bg-emerald-500/40 transition-colors shadow-lg cursor-pointer"
            >
              <Phone size={20} />
            </button>
          </div>
        )}

        {/* Big Refresh / Map Action Button */}
        <motion.button 
          whileTap={{ scale: 0.98 }}
          onClick={fetchGPSLocation}
          className="w-full glass-card p-6 rounded-[32px] flex items-center justify-center gap-3 text-cyan-300 font-black tracking-widest text-xs active:bg-white/10 transition-colors cursor-pointer border border-cyan-500/30 shadow-xl"
        >
          <RotateCw size={16} className={locationStatus === 'locating' ? 'animate-spin' : ''} />
          <span>{t.map}</span>
        </motion.button>
      </div>
      </div>

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

function ContextLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
      <div className="text-[9px] font-black text-cyan-600 mb-1 tracking-[3px] uppercase">{label}</div>
      <div className="text-white font-bold tracking-tight text-sm sm:text-base leading-snug">{value}</div>
    </div>
  );
}
