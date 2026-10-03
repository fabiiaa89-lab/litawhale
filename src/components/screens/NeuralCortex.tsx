/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Profile, Language, Screen } from '../../types';
import Header from '../Header';
import { motion, AnimatePresence } from 'motion/react';
import { Send, BrainCircuit, Sparkles, User, Crown, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { askNeuralCortex } from '../../services/geminiService';
import { i18n } from '../../i18n';
import { hapticEngine } from '../../utils/hapticEngine';

interface NeuralCortexProps {
  profile: Profile;
  language: Language;
  onBack: () => void;
  onNavigate?: (screen: Screen) => void;
}

export default function NeuralCortex({ profile, language, onBack, onNavigate }: NeuralCortexProps) {
  const isEs = language === 'es';
  const t = i18n[language].ai;
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [loading, setLoading] = useState(false);

  const [isPro, setIsPro] = useState<boolean>(() => {
    return localStorage.getItem('ns_is_pro') === 'true';
  });
  const [demoAllowed, setDemoAllowed] = useState(false);
  const [aiConsent, setAiConsent] = useState<boolean>(() => localStorage.getItem('ns_ai_consent') === 'true');

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const response = await askNeuralCortex(userMsg, profile, language);
    setMessages(prev => [...prev, { role: 'ai', text: response }]);
    setLoading(false);
  };

  const handleActivatePro = () => {
    hapticEngine.triggerImpact('medium');
    if (onNavigate) {
      onNavigate('premium');
    } else {
      setIsPro(true);
      localStorage.setItem('ns_is_pro', 'true');
    }
  };

  // If user is not Pro and hasn't unlocked demo, show Pro gatekeeper
  if (!isPro && !demoAllowed) {
    return (
      <div className="flex flex-col h-full bg-black">
        <Header title={t.title} onBack={onBack} />
        
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 flex flex-col justify-center items-center text-center space-y-5 pb-16">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center shadow-2xl shadow-amber-500/20">
            <Crown size={36} strokeWidth={2.5} />
          </div>

          <div className="space-y-2 max-w-sm">
            <span className="text-[10px] font-black uppercase tracking-[3px] text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full inline-block">
              {isEs ? 'SECCIÓN EXCLUSIVA PRO' : 'EXCLUSIVE PRO SECTION'}
            </span>
            <h3 className="text-2xl font-black text-white tracking-tight">
              {isEs ? 'Córtex Neural IA' : 'AI Neural Cortex'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isEs 
                ? 'El Córtex Neural utiliza Inteligencia Artificial terapéutica adaptada a tu perfil sensorial para desescalada de sobrecarga, anclaje verbal y análisis en vivo.'
                : 'Neural Cortex uses therapeutic AI adapted to your sensory profile for overload de-escalation, verbal grounding, and live analysis.'}
            </p>
          </div>

          {/* Pro Capabilities Box */}
          <div className="w-full max-w-sm p-4 rounded-3xl bg-white/5 border border-amber-500/20 text-left space-y-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-300">
              {isEs ? 'Funciones Pro Incluidas:' : 'Included Pro Features:'}
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-cyan-400 shrink-0" />
                <span>{isEs ? 'Desescalada personalizada sin juicios' : 'Tailored non-judgmental de-escalation'}</span>
              </div>
              <div className="flex items-center gap-2">
                <BrainCircuit size={16} className="text-indigo-400 shrink-0" />
                <span>{isEs ? 'Memoria y respuestas según tu umbral sensorial' : 'Responses tuned to your sensory threshold'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-purple-400 shrink-0" />
                <span>{isEs ? 'Guiones para emergencias y comunicación social' : 'Scripts for emergencies and public relief'}</span>
              </div>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="w-full max-w-sm space-y-2.5 pt-2">
            <button
              onClick={handleActivatePro}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/30 active:scale-98 transition-all cursor-pointer"
            >
              <Crown size={16} strokeWidth={2.5} />
              <span>{isEs ? 'Desbloquear Córtex con Membresía Pro' : 'Unlock Cortex with Pro'}</span>
              <ArrowRight size={14} />
            </button>

            <button
              onClick={() => {
                setDemoAllowed(true);
                hapticEngine.triggerImpact('light');
              }}
              className="w-full py-2.5 text-slate-400 hover:text-white text-xs font-bold underline cursor-pointer"
            >
              {isEs ? 'Probar demo gratuita de 1 consulta' : 'Try 1 free demo question'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!aiConsent) {
    return (
      <div className="flex flex-col h-full bg-black">
        <Header title={t.title} onBack={onBack} />
        <div className="flex-1 p-6 flex flex-col justify-center items-center text-center gap-4">
          <ShieldCheck size={36} className="text-cyan-400" />
          <p className="text-sm text-slate-200 max-w-sm">
            {isEs
              ? 'Para responderte, tus mensajes y los datos sensoriales de tu perfil se envían a un servicio de IA de Google. No envíes datos que no quieras compartir. La IA no reemplaza a un profesional de salud.'
              : 'To answer you, your messages and the sensory data in your profile are sent to a Google AI service. Do not send anything you do not want to share. The AI does not replace a health professional.'}
          </p>
          <button
            onClick={() => { localStorage.setItem('ns_ai_consent', 'true'); setAiConsent(true); }}
            className="px-6 py-3 rounded-2xl bg-cyan-500 text-slate-950 font-bold cursor-pointer"
          >
            {isEs ? 'Entiendo y acepto' : 'I understand and agree'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black">
      <Header title={t.title} onBack={onBack} />
      
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-6 space-y-6 pb-[max(6rem,calc(env(safe-area-inset-bottom,0px)+5.5rem))]">
        {/* Pro Active Banner */}
        <div className="bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 border border-amber-500/30 rounded-[32px] p-5 text-center shadow-lg">
          <div className="flex items-center justify-center gap-1.5 mb-1.5">
            <Crown size={18} className="text-amber-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
              {isEs ? 'SECCIÓN PRO DESBLOQUEADA' : 'PRO SECTION UNLOCKED'}
            </span>
          </div>
          <p className="text-xs text-white font-bold uppercase tracking-wider">{t.companionMode}</p>
          <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{t.companionModeSub}</p>
        </div>

        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] p-5 rounded-[28px] ${
              m.role === 'user' 
                ? 'bg-indigo-600/20 border border-indigo-500/30 text-white rounded-tr-none' 
                : 'bg-white/5 border border-white/10 text-indigo-100 rounded-tl-none'
            }`}>
               <p className="text-sm font-medium leading-relaxed">{m.text}</p>
            </div>
          </motion.div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 p-5 rounded-[28px] rounded-tl-none">
               <div className="flex gap-1">
                 <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                 <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                 <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
               </div>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 px-6 pt-4 pb-[max(1.25rem,calc(env(safe-area-inset-bottom,0px)+0.75rem))] bg-gradient-to-t from-black via-black/95 to-transparent">
        <div className="relative">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t.placeholder}
            className="w-full bg-white/10 border border-white/10 rounded-[28px] py-5 px-6 pr-16 text-white text-sm font-medium outline-none focus:border-indigo-500/50 transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="absolute right-2 top-2 bottom-2 w-12 rounded-full bg-indigo-500 flex items-center justify-center text-white active:scale-90 transition-transform cursor-pointer"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
