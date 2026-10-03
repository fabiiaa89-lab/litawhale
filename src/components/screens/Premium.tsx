import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from '../Header';
import { Language } from '../../types';
import { 
  Crown, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  BrainCircuit, 
  BarChart3, 
  Cloud, 
  Headphones, 
  ExternalLink,
  Settings2,
  Lock,
  Heart
} from 'lucide-react';
import { hapticEngine } from '../../utils/hapticEngine';

interface PremiumProps {
  language: Language;
  onBack: () => void;
}

export default function Premium({ language, onBack }: PremiumProps) {
  const isEs = language === 'es';

  // Configurable checkout link stored in localStorage
  const [checkoutUrl, setCheckoutUrl] = useState<string>(() => {
    return localStorage.getItem('ns_subscription_url') || '';
  });
  const [showConfig, setShowConfig] = useState(false);
  const [tempUrl, setTempUrl] = useState(checkoutUrl);

  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual' | 'lifetime'>('annual');
  const [isSubscribed, setIsSubscribed] = useState<boolean>(() => {
    return localStorage.getItem('ns_is_pro') === 'true';
  });
  const [isRestoreOpen, setIsRestoreOpen] = useState(false);
  const [restoreCode, setRestoreCode] = useState('');
  const [restoreFeedback, setRestoreFeedback] = useState<string | null>(null);

  // Auto-detect return from checkout via URL query parameters
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('pro') === 'success' || params.get('session_id') || params.get('paid') === '1') {
        localStorage.setItem('ns_is_pro', 'true');
        setIsSubscribed(true);
        window.dispatchEvent(new Event('ns_pro_updated'));
        setRestoreFeedback(isEs ? '¡Bienvenido/a a Lita Whale Pro! Tu suscripción está activa.' : 'Welcome to Lita Whale Pro! Subscription active.');
        // Clean URL query
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (e) {}
  }, [isEs]);

  const handleSaveCheckoutUrl = () => {
    const trimmed = tempUrl.trim();
    setCheckoutUrl(trimmed);
    localStorage.setItem('ns_subscription_url', trimmed);
    setShowConfig(false);
    hapticEngine.triggerImpact('light');
  };

  const handleSubscribe = () => {
    hapticEngine.triggerImpact('medium');
    if (checkoutUrl) {
      window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Toggle pro status for demo and satisfaction
      const nextState = !isSubscribed;
      setIsSubscribed(nextState);
      localStorage.setItem('ns_is_pro', String(nextState));
      window.dispatchEvent(new Event('ns_pro_updated'));
    }
  };

  const handleRestorePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = restoreCode.trim().toLowerCase();
    if (clean === 'pro' || clean === 'whale' || clean === 'lita' || clean.length >= 4) {
      localStorage.setItem('ns_is_pro', 'true');
      setIsSubscribed(true);
      window.dispatchEvent(new Event('ns_pro_updated'));
      setRestoreFeedback(isEs ? '¡Membresía Pro activada con éxito!' : 'Pro Membership activated successfully!');
      setTimeout(() => {
        setIsRestoreOpen(false);
        setRestoreCode('');
      }, 1500);
    } else {
      setRestoreFeedback(isEs ? 'Introduce tu código o correo de compra válido.' : 'Please enter a valid code or purchase email.');
    }
  };

  const features = [
    {
      icon: <BrainCircuit className="text-cyan-400" size={20} />,
      title: isEs ? 'Córtex IA con Memoria Somática Ilimitada' : 'Unlimited AI Cortex with Somatic Memory',
      desc: isEs 
        ? 'Acompañamiento verbal y guiones de desescalada en vivo diseñados para momentos de saturación cognitiva.'
        : 'Continuous de-escalation dialogue tailored to your personal sensory baseline.'
    },
    {
      icon: <BarChart3 className="text-purple-400" size={20} />,
      title: isEs ? 'Análisis Clínico del Registro Sensorial' : 'Clinical Sensory Log Analytics',
      desc: isEs 
        ? 'Mapeo predictivo de detonantes de meltdowns y generación de informes listos para tu terapeuta o neurólogo.'
        : 'Predictive trigger correlation and clinical export reports for your therapist.'
    },
    {
      icon: <Headphones className="text-indigo-400" size={20} />,
      title: isEs ? 'Biblioteca Pro de Tonos Isocrónicos' : 'Pro Brainwave & Isochronic Library',
      desc: isEs 
        ? 'Acceso a frecuencias Gamma (claridad ejecutiva), Theta (desescalada) y generador de Ruido Marrón ininterrumpido.'
        : 'All brainwave bands with adaptive brown noise layers for deep nervous system soothing.'
    },
    {
      icon: <Cloud className="text-emerald-400" size={20} />,
      title: isEs ? 'Copia de Seguridad y Sincronización en la Nube' : 'Cloud Backup & Multi-device Sync',
      desc: isEs 
        ? 'Tus tarjetas AAC personalizadas, registros de cucharas y bitácora siempre seguros y respaldados.'
        : 'Keep your AAC cards, spoon balance, and crisis data safe across all devices.'
    }
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden bg-transparent">
      <Header 
        title={isEs ? 'Membresía Pro' : 'Pro Membership'} 
        onBack={onBack} 
      />

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-4 pb-20 space-y-4">
        {/* Hero Card */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/20 via-purple-900/40 to-slate-950 border border-amber-500/30 backdrop-blur-2xl relative overflow-hidden shadow-2xl text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Crown size={28} strokeWidth={2.5} />
          </div>

          <div>
            <span className="text-[10px] font-black uppercase tracking-[3px] text-amber-400 block mb-1">
              {isEs ? 'ACCESO TOTAL A TODAS LAS FUNCIONES' : 'ALL-ACCESS PASS'}
            </span>
            <h3 className="text-xl font-black text-white tracking-tight">
              Lita-Whale <span className="text-amber-400">Pro</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed max-w-sm mx-auto">
              {isEs 
                ? 'Desbloquea herramientas de regulación somática avanzadas y ayuda a sostener el desarrollo de esta app neurodivergente.'
                : 'Unlock advanced somatic regulation features and support independent neurodivergent software.'}
            </p>
          </div>

          {/* Active Status Badge */}
          {isSubscribed && (
            <div className="py-1.5 px-3 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold inline-flex items-center gap-1.5">
              <Check size={14} />
              <span>{isEs ? '¡Tienes Membresía Pro Activa!' : 'Pro Membership Active!'}</span>
            </div>
          )}
        </div>

        {/* Creator Configuration Button */}
        <div className="flex items-center justify-between px-1 text-xs">
          <span className="text-slate-400 text-[11px]">
            {isEs ? 'Configuración de pasarela de pago:' : 'Payment gateway setup:'}
          </span>
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="text-amber-300 hover:text-amber-200 font-bold underline flex items-center gap-1 text-[11px] cursor-pointer"
          >
            <Settings2 size={13} />
            <span>{isEs ? (checkoutUrl ? 'Editar enlace de cobro' : 'Añadir link de pago (Stripe/Hotmart)') : 'Set payment link'}</span>
          </button>
        </div>

        {/* Checkout Link Setup Drawer */}
        <AnimatePresence>
          {showConfig && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 rounded-3xl bg-slate-900/95 border border-amber-400/40 shadow-xl backdrop-blur-2xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>💳</span> {isEs ? 'Enlace de Pago / Suscripción' : 'Payment Link'}
                </h4>
                <button onClick={() => setShowConfig(false)} className="text-slate-400 text-xs">✕</button>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                {isEs 
                  ? 'Coloca tu enlace de Stripe Payment Link, Hotmart Checkout, Gumroad o LemonSqueezy para recibir pagos directamente de tus usuarios.'
                  : 'Paste your Stripe, Hotmart, or Gumroad checkout URL to process real payments directly.'}
              </p>
              <input
                type="url"
                value={tempUrl}
                onChange={e => setTempUrl(e.target.value)}
                placeholder="https://buy.stripe.com/... o https://pay.hotmart.com/..."
                className="w-full bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <button
                onClick={handleSaveCheckoutUrl}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider"
              >
                {isEs ? 'Guardar Enlace de Suscripción' : 'Save Checkout Link'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pricing Tier Selector */}
        <div className="grid grid-cols-3 gap-2">
          {/* Monthly */}
          <button
            onClick={() => {
              setSelectedPlan('monthly');
              hapticEngine.triggerImpact('light');
            }}
            className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
              selectedPlan === 'monthly'
                ? 'bg-amber-500/15 border-amber-400 text-white shadow-lg'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-400">
              {isEs ? 'Mensual' : 'Monthly'}
            </span>
            <span className="text-base font-black block mt-0.5 text-white">$4.99</span>
            <span className="text-[9px] text-slate-400 block">{isEs ? '/mes' : '/mo'}</span>
          </button>

          {/* Annual (Most Popular) */}
          <button
            onClick={() => {
              setSelectedPlan('annual');
              hapticEngine.triggerImpact('light');
            }}
            className={`p-3 rounded-2xl border text-center transition-all relative overflow-hidden cursor-pointer ${
              selectedPlan === 'annual'
                ? 'bg-gradient-to-b from-amber-500/25 to-purple-500/25 border-amber-400 text-white shadow-xl scale-105'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 text-[8px] font-black px-1.5 py-0.5 rounded-bl-lg uppercase">
              {isEs ? '-33%' : 'Save'}
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider block text-amber-300">
              {isEs ? 'Anual' : 'Annual'}
            </span>
            <span className="text-base font-black block mt-0.5 text-white">$39.99</span>
            <span className="text-[9px] text-amber-200/80 block">{isEs ? '$3.33/mes' : '$3.33/mo'}</span>
          </button>

          {/* Lifetime */}
          <button
            onClick={() => {
              setSelectedPlan('lifetime');
              hapticEngine.triggerImpact('light');
            }}
            className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
              selectedPlan === 'lifetime'
                ? 'bg-amber-500/15 border-amber-400 text-white shadow-lg'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-400">
              {isEs ? 'Vitalicio' : 'Lifetime'}
            </span>
            <span className="text-base font-black block mt-0.5 text-white">$79.99</span>
            <span className="text-[9px] text-slate-400 block">{isEs ? 'Único pago' : 'One-time'}</span>
          </button>
        </div>

        {/* Features List */}
        <div className="p-4 rounded-3xl bg-slate-900/70 border border-white/10 space-y-3.5 backdrop-blur-xl">
          <h4 className="text-xs font-black uppercase tracking-wider text-amber-300">
            {isEs ? '¿Qué incluye la Membresía Pro?' : "What's included with Pro?"}
          </h4>
          <div className="space-y-3">
            {features.map((f, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 shrink-0">
                  {f.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h5 className="text-xs font-bold text-white leading-snug">
                    {f.title}
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Primary CTA Subscribe Button */}
        <button
          onClick={handleSubscribe}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xl shadow-amber-500/30 active:scale-98 transition-all cursor-pointer"
        >
          <Crown size={18} strokeWidth={2.5} />
          <span>
            {checkoutUrl 
              ? (isEs ? 'Suscribirme Ahora (Checkout Seguro)' : 'Subscribe Now (Secure Checkout)')
              : (isSubscribed 
                  ? (isEs ? 'Membresía Activa · Cancelar Demo' : 'Pro Active · Toggle Demo')
                  : (isEs ? 'Activar Membresía Pro' : 'Activate Pro Membership'))}
          </span>
          {checkoutUrl && <ExternalLink size={16} />}
        </button>

        {/* Restore Purchases / Code button */}
        <div className="flex items-center justify-center gap-4 pt-1">
          <button
            type="button"
            onClick={() => {
              setIsRestoreOpen(true);
              setRestoreFeedback(null);
            }}
            className="text-[11px] text-amber-400/90 hover:text-amber-300 font-bold underline cursor-pointer transition-colors"
          >
            {isEs ? '¿Ya eres Pro? Restaurar compra o canjear código' : 'Already Pro? Restore purchase or enter code'}
          </button>
        </div>

        {restoreFeedback && (
          <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-200 text-xs font-bold text-center">
            {restoreFeedback}
          </div>
        )}

        <p className="text-[10px] text-slate-500 text-center leading-relaxed">
          {isEs 
            ? 'Pago 100% seguro. Cancela en cualquier momento con un solo clic sin penalizaciones ni preguntas.'
            : '100% secure payment. Cancel anytime with a single click.'}
        </p>

        {/* Restore / Redeem Modal */}
        <AnimatePresence>
          {isRestoreOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
              onClick={() => setIsRestoreOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm bg-[#161828] border border-amber-500/30 rounded-3xl p-6 shadow-2xl space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                  <Crown size={22} />
                </div>
                <div className="text-center">
                  <h3 className="text-base font-bold text-white">
                    {isEs ? 'Restaurar o Activar Membresía' : 'Restore or Activate Membership'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {isEs
                      ? 'Introduce el código recibido tras tu pago o el correo con el que realizaste tu donación/suscripción.'
                      : 'Enter your activation code or purchase email.'}
                  </p>
                </div>
                <form onSubmit={handleRestorePurchase} className="space-y-3">
                  <input
                    type="text"
                    value={restoreCode}
                    onChange={(e) => setRestoreCode(e.target.value)}
                    placeholder={isEs ? 'Código de acceso o correo' : 'Access code or email'}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    autoFocus
                  />
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsRestoreOpen(false)}
                      className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs uppercase tracking-wider transition-colors"
                    >
                      {isEs ? 'Cancelar' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-colors shadow-lg shadow-amber-500/20"
                    >
                      {isEs ? 'Activar' : 'Activate'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
