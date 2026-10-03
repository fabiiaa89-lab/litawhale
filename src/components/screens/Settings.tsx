import { useRef, ChangeEvent, useState } from 'react';
import { Profile, SensitivityProfile, AppTheme } from '../../types';
import Header from '../Header';
import { motion, AnimatePresence } from 'motion/react';
import { i18n as translations } from '../../i18n';
import { User, Shield, Pill, Apple, Sliders, Image as ImageIcon, HeartPulse, Brain, Zap, Target, Upload, Trash2, Camera, Check, Globe, Coins, ChevronDown, Download, Share2, Sparkles, Copy, Sun, Moon } from 'lucide-react';
import { COUNTRIES, getCountryByCode, getCountryByName } from '../../utils/currency';
import WhaleLogo from '../WhaleLogo';
import { downloadSvgFile, downloadPngFromSvg, SVG_LOGO_RAW } from '../../utils/exportLogo';
import { compressImageFile } from '../../utils/imageCompressor';

interface SettingsProps {
  profile: Profile;
  theme?: AppTheme;
  onUpdate: (updates: Partial<Profile>) => void;
  onToggleSensitivity: () => void;
  onToggleTheme?: () => void;
  onBack: () => void;
  onOpenInstallModal?: () => void;
}

export default function Settings({ profile, theme = 'dark', onUpdate, onToggleSensitivity, onToggleTheme, onBack, onOpenInstallModal }: SettingsProps) {
  const t = translations[profile.language].settings;
  const isSpanish = profile.language === 'es';
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [exportingType, setExportingType] = useState<string | null>(null);

  const handleCopySvg = async () => {
    try {
      await navigator.clipboard.writeText(SVG_LOGO_RAW);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadPng = async (darkBg: boolean, label: string) => {
    setExportingType(label);
    try {
      await downloadPngFromSvg(
        2048, 
        darkBg, 
        darkBg ? 'lita-whale-avatar-2048.png' : 'lita-whale-transparent-2048.png'
      );
    } catch (e) {
      console.error(e);
    } finally {
      setExportingType(null);
    }
  };

  const handleCountrySelect = (code: string) => {
    const country = COUNTRIES.find(c => c.code === code);
    if (country) {
      const countryName = profile.language === 'es' ? country.nameEs : country.nameEn;
      onUpdate({
        country: countryName,
        currency: country.currencyCode,
        currencySymbol: country.currencySymbol
      });
    }
    setIsCountryDropdownOpen(false);
  };

  const updateContact = (name: string, phone: string, relationship?: string) => {
    onUpdate({ contacts: [{ name, phone, relationship }] });
  };

  const toggleLanguage = () => {
    onUpdate({ language: profile.language === 'es' ? 'en' : 'es' });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-transparent">
      <Header title={t.title} onBack={onBack} />

      <p className="mx-6 mt-3 text-[11px] text-amber-300">
        {profile.language === 'es'
          ? 'Esta app es un apoyo y no reemplaza la atención de un profesional de salud.'
          : 'This app is a support tool and does not replace care from a health professional.'}
      </p>
      
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-6 mt-4 space-y-8 safe-area-bottom pb-12">
        {/* Sistema */}
        <div className="glass-card rounded-[32px] p-6 space-y-4">
          <SectionHeader icon={<Sliders size={14} />} title={t.system} />
          
          <div className="space-y-4">
            {/* Visual Theme Mode (Claro / Oscuro) */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
              <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 block">
                {isSpanish ? "MODO VISUAL / TEMA" : "VISUAL THEME"}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (onToggleTheme && theme !== 'dark') onToggleTheme();
                    onUpdate({ theme: 'dark' });
                  }}
                  className={`py-3 px-3 rounded-xl flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md font-bold'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  <Moon size={16} className={theme === 'dark' ? 'text-cyan-400' : 'text-slate-400'} />
                  <span className="text-xs font-bold">{isSpanish ? "Modo Oscuro" : "Dark Mode"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (onToggleTheme && theme !== 'light') onToggleTheme();
                    onUpdate({ theme: 'light' });
                  }}
                  className={`py-3 px-3 rounded-xl flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                    theme === 'light'
                      ? 'bg-amber-500/20 border-amber-400 text-slate-900 shadow-md font-bold'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  <Sun size={16} className={theme === 'light' ? 'text-amber-500' : 'text-slate-400'} />
                  <span className="text-xs font-bold">{isSpanish ? "Modo Claro" : "Light Mode"}</span>
                </button>
              </div>
            </div>

            <button 
              onClick={toggleLanguage}
              className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 transition-all border border-white/10 text-white font-black flex justify-between px-6 items-center shadow-lg cursor-pointer"
            >
              <span className="text-[10px] uppercase tracking-widest text-slate-400">{t.lang}</span>
              <span className="text-cyan-400 text-sm uppercase">{profile.language}</span>
            </button>

            {/* Perfil de Sensibilidad Sensorial Clarificado */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
              <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 block">
                {t.sensoryMode}
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'HIPER', label: isSpanish ? 'Hipersensible' : 'Hypersensitive', sub: isSpanish ? 'Alta sensibilidad' : 'High sensitivity' },
                  { id: 'MED', label: isSpanish ? 'Media' : 'Medium', sub: isSpanish ? 'Equilibrada' : 'Balanced' },
                  { id: 'HIPO', label: isSpanish ? 'Hiposensible' : 'Hyposensitive', sub: isSpanish ? 'Buscador estímulo' : 'Stimulus seeker' },
                ].map(mode => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => onUpdate({ sensitivity: mode.id as SensitivityProfile })}
                    className={`py-3 px-2 rounded-xl text-center border transition-all cursor-pointer ${
                      profile.sensitivity === mode.id
                        ? 'bg-cyan-500/25 border-cyan-400 text-white shadow-md font-black'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-xs font-black block">{mode.label}</span>
                    <span className="text-[9px] text-cyan-300/80 block mt-0.5">{mode.sub}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-300/90 leading-relaxed pt-1">
                {profile.sensitivity === 'HIPER' && `🛡️ ${t.hiper}`}
                {profile.sensitivity === 'MED' && `⚖️ ${t.med}`}
                {profile.sensitivity === 'HIPO' && `⚡ ${t.hipo}`}
              </p>
            </div>
          </div>
        </div>

        {/* Identidad y Ubicación */}
        <div className="glass-card rounded-[32px] p-6 space-y-4">
          <SectionHeader icon={<User size={14} />} title={t.identity} />
          <InputField 
            label={t.name} 
            value={profile.name} 
            onChange={(val: string) => onUpdate({ name: val })} 
            placeholder={t.placeholders?.name || "Ej: Alex Doe"}
          />

          {/* País de Residencia y Moneda */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1.5">
              <Globe size={11} className="text-cyan-400" />
              <span>{t.country || "PAÍS DE RESIDENCIA"}</span>
            </label>
            
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-left flex items-center justify-between text-sm text-white font-bold hover:bg-white/10 transition-colors"
              >
                <span className={profile.country ? 'text-white' : 'text-slate-500'}>
                  {profile.country || (t.countryPlaceholder || "Selecciona tu país")}
                </span>
                <div className="flex items-center gap-2">
                  {profile.currency && (
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-black border border-cyan-500/30">
                      {profile.currencySymbol || '$'} ({profile.currency})
                    </span>
                  )}
                  <ChevronDown size={16} className={`text-slate-400 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>

              <AnimatePresence>
                {isCountryDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#1e2030] border border-white/20 rounded-2xl p-2 shadow-2xl max-h-60 overflow-y-auto no-scrollbar space-y-1"
                  >
                    {COUNTRIES.map((c) => {
                      const cName = profile.language === 'es' ? c.nameEs : c.nameEn;
                      const isSelected = profile.country === cName;
                      return (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => handleCountrySelect(c.code)}
                          className={`w-full p-3 rounded-xl flex items-center justify-between text-left text-xs font-bold transition-colors ${isSelected ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-300 hover:bg-white/10'}`}
                        >
                          <span>{cName}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                            {c.currencySymbol} ({c.currencyCode})
                          </span>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Custom Currency Override */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <InputField 
                label={t.currency || "MONEDA LOCAL (CÓDIGO)"} 
                value={profile.currency || ''} 
                onChange={(val: string) => onUpdate({ currency: val.toUpperCase() })} 
                placeholder="Ej: EUR, MXN, USD"
                icon={<Coins size={14} />}
              />
              <InputField 
                label="SÍMBOLO DE MONEDA" 
                value={profile.currencySymbol || ''} 
                onChange={(val: string) => onUpdate({ currencySymbol: val })} 
                placeholder="Ej: €, $, S/."
              />
            </div>
            <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/25 mt-2">
              <p className="text-xs sm:text-sm text-cyan-200/90 font-medium leading-relaxed">
                💡 {t.currencyHint || "La moneda de tu país permite calcular y gestionar tus compromisos futuros y deudas directamente en tu economía real, facilitando la serenidad financiera."}
              </p>
            </div>
          </div>

          <ImageUploadField 
            label={t.userImg} 
            value={profile.userImage} 
            onChange={(val: string) => onUpdate({ userImage: val })} 
            uploadText={t.placeholders?.uploadImg || "Subir imagen"}
            changeText={t.placeholders?.changeImg || "Cambiar imagen"}
            removeText={t.placeholders?.removeImg || "Eliminar"}
            imgLoadedText={t.placeholders?.imgLoaded || "Imagen cargada"}
          />
          <InputField 
            label={t.address} 
            value={profile.address} 
            onChange={(val: string) => onUpdate({ address: val })} 
            placeholder={t.placeholders?.address || "Calle, ciudad, instrucciones"}
          />
        </div>

        {/* Perfil Médico SOS */}
        <div className="glass-card rounded-[32px] p-6 space-y-4">
          <SectionHeader icon={<HeartPulse size={14} />} title={t.medicalSos} />
          <div className="grid grid-cols-2 gap-3">
            <InputField 
              label={t.bloodType} 
              value={profile.bloodType} 
              onChange={(val: string) => onUpdate({ bloodType: val })} 
              placeholder={t.placeholders?.blood || "Ej: O+"}
            />
            <InputField 
              label={t.allergies} 
              value={profile.allergies} 
              onChange={(val: string) => onUpdate({ allergies: val })} 
              placeholder={t.placeholders?.allergies || "Medicamentos, comida"}
            />
          </div>
        </div>

        {/* Perfil Sensorial Avanzado */}
        <div className="glass-card rounded-[32px] p-6 space-y-4">
          <SectionHeader icon={<Brain size={14} />} title={t.sensoryProfile} />
          <InputField 
            label={t.hyper} 
            value={profile.hypersensitivities} 
            onChange={(val: string) => onUpdate({ hypersensitivities: val })} 
            placeholder={t.placeholders?.hyper || "Ej: Luces fuertes, ruidos agudos"}
          />
          <InputField 
            label={t.hypo} 
            value={profile.hyposensitivities} 
            onChange={(val: string) => onUpdate({ hyposensitivities: val })} 
            placeholder={t.placeholders?.hypo || "Ej: Necesidad de presión"}
          />
          <InputField 
            label={t.triggers} 
            value={profile.triggers} 
            onChange={(val: string) => onUpdate({ triggers: val })} 
            placeholder={t.placeholders?.triggers || "Lo que más me molesta"}
            icon={<Zap size={14} />}
          />
          <InputField 
            label={t.interests} 
            value={profile.interests} 
            onChange={(val: string) => onUpdate({ interests: val })} 
            placeholder={t.placeholders?.interests || "Temas que me apasionan/calman"}
            icon={<Target size={14} />}
          />
          <InputField 
            label={t.supportEntity} 
            value={profile.supportEntity || ''} 
            onChange={(val: string) => onUpdate({ supportEntity: val })} 
            placeholder={t.placeholders?.supportEntity || "Ej: Mi gato, Peluche dino, Manta"}
            icon={<HeartPulse size={14} />}
          />
        </div>

        {/* Contacto de Emergencia & Red de Seguridad */}
        <div className="glass-card rounded-[32px] p-6 space-y-4">
          <SectionHeader icon={<Shield size={14} />} title={t.support} />
          <InputField 
            label={t.contactName} 
            value={profile.contacts?.[0]?.name || ''} 
            onChange={(val: string) => updateContact(val, profile.contacts?.[0]?.phone || '', profile.contacts?.[0]?.relationship || '')} 
            placeholder={t.placeholders?.contactName || "Nombre del contacto"}
          />
          <InputField 
            label={t.relationship || (isSpanish ? "VÍNCULO / RELACIÓN" : "RELATIONSHIP")} 
            value={profile.contacts?.[0]?.relationship || ''} 
            onChange={(val: string) => updateContact(profile.contacts?.[0]?.name || '', profile.contacts?.[0]?.phone || '', val)} 
            placeholder={isSpanish ? "Ej: Madre, Pareja, Hermano/a, Terapeuta, Amigo/a" : "e.g. Mother, Partner, Therapist, Friend"}
          />
          <InputField 
            label={t.phone} 
            value={profile.contacts?.[0]?.phone || ''} 
            onChange={(val: string) => updateContact(profile.contacts?.[0]?.name || '', val, profile.contacts?.[0]?.relationship || '')} 
            placeholder={t.placeholders?.phone || "Teléfono"}
            type="tel"
          />
          <ImageUploadField 
            label={t.contactImg} 
            value={profile.contactImage} 
            onChange={(val: string) => onUpdate({ contactImage: val })} 
            uploadText={t.placeholders?.uploadImg || "Subir imagen"}
            changeText={t.placeholders?.changeImg || "Cambiar imagen"}
            removeText={t.placeholders?.removeImg || "Eliminar"}
            imgLoadedText={t.placeholders?.imgLoaded || "Imagen cargada"}
          />
        </div>

        {/* Medicación y Supervivencia */}
        <div className="glass-card rounded-[32px] p-6 space-y-4">
          <SectionHeader icon={<Pill size={14} />} title={t.pharmacology} />
          <InputField 
            label={t.sosMed} 
            value={profile.crisisMed} 
            onChange={(val: string) => onUpdate({ crisisMed: val })} 
            placeholder={t.placeholders?.sosMed || "Ej: Clonazepam 2mg"}
          />
          <InputField 
            label={t.dailyMed} 
            value={profile.dailyMed} 
            onChange={(val: string) => onUpdate({ dailyMed: val })} 
            placeholder={t.placeholders?.dailyMed || "Ej: Sertralina"}
          />
          <SectionHeader icon={<Apple size={14} />} title={t.regulation} className="mt-6" />
          <InputField 
            label={t.safeFood} 
            value={profile.safeFood} 
            onChange={(val: string) => onUpdate({ safeFood: val })} 
            placeholder={t.placeholders?.safeFood || "Ej: Yogurt, Frutos secos"}
          />
        </div>

        {/* Logo para usar si te gusta & Redes Sociales de Lita Whale */}
        <div className="glass-card rounded-[32px] p-6 space-y-5 border-cyan-500/20 shadow-xl">
          <SectionHeader icon={<Share2 size={14} />} title={isSpanish ? "LOGO PARA USAR SI TE GUSTA" : "LOGO TO USE IF YOU LIKE"} />
          
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#121020] border border-cyan-500/30 p-2 shrink-0 flex items-center justify-center shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-purple-500/10" />
              <WhaleLogo className="w-full h-full scale-110 relative z-10" glow={true} />
            </div>

            <div className="space-y-1.5 text-center sm:text-left min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="font-black text-white text-sm">Lita-Whale Vector Logo</span>
                <span className="text-[10px] font-black text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded-full">SVG / HD</span>
              </div>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                {isSpanish 
                  ? "Logo oficial de la ballena azul de Lita-Whale libre para usar y compartir si te gusta el proyecto."
                  : "Official Lita-Whale blue whale logo free to use and share if you like the sanctuary."}
              </p>
            </div>
          </div>

          {/* Social Media & Contact Links */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <span className="text-[10px] uppercase font-black tracking-widest text-cyan-400 block">
              {isSpanish ? "REDES SOCIALES Y CONTACTO OFICIAL" : "OFFICIAL SOCIAL CHANNELS & CONTACT"}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <a
                href="https://instagram.com/lita.whale"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 text-pink-200 flex items-center justify-between font-bold transition-all"
              >
                <div className="flex items-center gap-2">
                  <span>📸</span>
                  <span>Instagram</span>
                </div>
                <span className="text-pink-400 font-mono text-[11px]">@lita.whale</span>
              </a>

              <a
                href="https://facebook.com/litawhale"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-200 flex items-center justify-between font-bold transition-all"
              >
                <div className="flex items-center gap-2">
                  <span>👥</span>
                  <span>Facebook</span>
                </div>
                <span className="text-blue-400 font-mono text-[11px]">Lita Whale</span>
              </a>

              <a
                href="https://pinterest.com/litawhale"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-200 flex items-center justify-between font-bold transition-all"
              >
                <div className="flex items-center gap-2">
                  <span>📌</span>
                  <span>Pinterest</span>
                </div>
                <span className="text-rose-400 font-mono text-[11px]">litawhale</span>
              </a>

              <a
                href="mailto:litawhale@gmail.com"
                className="p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-200 flex items-center justify-between font-bold transition-all"
              >
                <div className="flex items-center gap-2">
                  <span>✉️</span>
                  <span>Email</span>
                </div>
                <span className="text-emerald-400 font-mono text-[11px] break-all">litawhale@gmail.com</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {/* Download SVG */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => downloadSvgFile('lita-whale-logo-vector.svg')}
              className="py-3 px-4 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 active:scale-95 border border-cyan-500/30 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer text-center"
            >
              <Download size={15} className="shrink-0" />
              <span>{isSpanish ? "Descargar Vector (SVG)" : "Download Vector (SVG)"}</span>
            </motion.button>

            {/* Download PNG 2048px with dark background */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDownloadPng(true, 'avatar')}
              disabled={exportingType === 'avatar'}
              className="py-3 px-4 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 active:scale-95 border border-indigo-500/30 text-indigo-300 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 cursor-pointer text-center"
            >
              <Download size={15} className="shrink-0" />
              <span>{exportingType === 'avatar' ? (isSpanish ? "Generando..." : "Generating...") : (isSpanish ? "Descargar Avatar HD (PNG)" : "Download HD Avatar (PNG)")}</span>
            </motion.button>

            {/* Download PNG transparent */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDownloadPng(false, 'transparent')}
              disabled={exportingType === 'transparent'}
              className="py-3 px-4 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 active:scale-95 border border-purple-500/30 text-purple-300 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 cursor-pointer text-center"
            >
              <Download size={15} className="shrink-0" />
              <span>{exportingType === 'transparent' ? (isSpanish ? "Generando..." : "Generating...") : (isSpanish ? "PNG Fondo Transparente" : "Transparent PNG")}</span>
            </motion.button>

            {/* Copy SVG code */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleCopySvg}
              className="py-3 px-4 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer text-center"
            >
              {isCopied ? <Check size={15} className="text-emerald-400 shrink-0" /> : <Copy size={15} className="shrink-0" />}
              <span>{isCopied ? (isSpanish ? "¡Código Copiado!" : "Code Copied!") : (isSpanish ? "Copiar Código SVG (Figma)" : "Copy SVG Code")}</span>
            </motion.button>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="w-full py-6 rounded-[32px] bg-cyan-500 hover:bg-cyan-400 hover:shadow-cyan-500/20 text-slate-900 font-black tracking-widest uppercase text-xs shadow-2xl h-[80px] transition-all mt-4"
        >
          {t.save}
        </motion.button>
        
        <div className="mt-8 mb-4 text-center opacity-60">
          <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Developed by</p>
          <p className="text-xs text-slate-400 font-bold tracking-tight mt-1 uppercase">Fabiola Aponte</p>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ icon, title, className = "" }: any) {
  return (
    <div className={`flex items-center gap-2 mb-4 ${className}`}>
      <span className="text-cyan-400">{icon}</span>
      <h3 className="text-[10px] uppercase tracking-[4px] text-slate-500 font-black">{title}</h3>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder = "", type = "text", icon = null }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative">
        <input 
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold text-sm focus:border-cyan-500/50 outline-none transition-all placeholder:text-slate-500"
        />
        {icon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

function ImageUploadField({ 
  label, 
  value, 
  onChange, 
  uploadText = "Subir imagen",
  changeText = "Cambiar imagen",
  removeText = "Eliminar",
  imgLoadedText = "Imagen cargada"
}: { 
  label: string; 
  value: string; 
  onChange: (val: string) => void;
  uploadText?: string;
  changeText?: string;
  removeText?: string;
  imgLoadedText?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedDataUrl = await compressImageFile(file, 500, 500, 0.85);
        if (compressedDataUrl) {
          onChange(compressedDataUrl);
        }
      } catch (err) {
        console.error("Image compression error:", err);
      }
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      
      {value ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img 
              src={value} 
              alt="Preview" 
              className="w-12 h-12 rounded-xl object-cover border border-white/20 shrink-0 shadow-md" 
              referrerPolicy="no-referrer"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                <Check size={14} className="text-emerald-400 shrink-0" />
                <span>{imgLoadedText}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 active:scale-95 text-xs text-cyan-300 font-bold transition-all flex items-center gap-1.5 border border-cyan-500/20"
            >
              <Upload size={13} />
              <span>{changeText}</span>
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 active:scale-95 text-rose-400 transition-all border border-rose-500/20"
              title={removeText}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full bg-white/5 hover:bg-white/10 border border-dashed border-white/20 hover:border-cyan-400/50 rounded-2xl p-4 flex items-center justify-center gap-3 text-slate-300 font-bold text-xs tracking-wider uppercase transition-all cursor-pointer group active:scale-[0.99] shadow-sm"
        >
          <div className="w-8 h-8 rounded-xl bg-white/5 group-hover:bg-cyan-500/20 text-cyan-400 flex items-center justify-center transition-colors">
            <Camera size={16} />
          </div>
          <span className="font-bold text-slate-300 group-hover:text-white transition-colors">{uploadText}</span>
        </button>
      )}
    </div>
  );
}
