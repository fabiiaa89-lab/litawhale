import React, { useState } from 'react';
import { AMAZON_TAG } from '../../constants';
import { motion } from 'motion/react';
import Header from '../Header';
import { Language } from '../../types';
import { getAmazonDomainForCountry } from '../../utils/currency';
import { 
  Headphones, 
  Layers, 
  Eye, 
  Sparkles, 
  Moon, 
  ExternalLink, 
  ShieldCheck,
  Check
} from 'lucide-react';
import { hapticEngine } from '../../utils/hapticEngine';

interface KitProps {
  language: Language;
  onBack: () => void;
}

interface SensoryTool {
  id: string;
  name: string;
  category: 'audio' | 'pressure' | 'visual' | 'fidget' | 'comfort';
  categoryLabel: string;
  description: string;
  neuroBenefit: string;
  searchTerm: string;
  recommendedModel: string;
  rating: string;
}

export default function Kit({ language, onBack }: KitProps) {
  const isEs = language === 'es';

  // Affiliate tag set by the developer or stored
  const affiliateTag = localStorage.getItem('ns_amazon_tag') || AMAZON_TAG;
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const tools: SensoryTool[] = [
    {
      id: 'loop-earplugs',
      name: 'Loop Earplugs (Quiet 2 / Engage)',
      category: 'audio',
      categoryLabel: isEs ? 'Acústico' : 'Audio',
      description: isEs 
        ? 'Atenuadores acústicos ergonómicos con reducción pasiva de 16 a 27 dB sin distorsionar el habla.'
        : 'Ergonomic acoustic dampeners reducing 16 to 27 dB without speech distortion.',
      neuroBenefit: isEs 
        ? 'Frena la sobrecarga coclear y el agotamiento de cucharas en supermercados, transporte y oficinas.'
        : 'Prevents cochlear overload and spoon exhaustion in crowded noisy spaces.',
      searchTerm: 'Loop Earplugs Quiet 2 Engage',
      recommendedModel: 'Loop Quiet 2 / Experience Pro',
      rating: '4.9 ★'
    },
    {
      id: 'weighted-blanket',
      name: isEs ? 'Manta Pesada (Presión Profunda DTP)' : 'Weighted Blanket (Deep Touch)',
      category: 'pressure',
      categoryLabel: isEs ? 'Presión Profunda' : 'Deep Touch',
      description: isEs 
        ? 'Manta terapéutica con microperlas de vidrio no tóxicas, peso distribuido (7-9 kg).'
        : 'Therapeutic blanket with non-toxic glass microbeads for deep sensory input.',
      neuroBenefit: isEs 
        ? 'Estimula el sistema parasimpático liberando serotonina y reduciendo el cortisol durante o tras un shutdown.'
        : 'Stimulates parasympathetic nervous system, lowering cortisol during shutdowns.',
      searchTerm: 'weighted blanket adults 15 lbs glass beads',
      recommendedModel: isEs ? 'Manta de 6 a 9 kg transpirable' : '15-20 lbs breathable cotton',
      rating: '4.8 ★'
    },
    {
      id: 'fl41-glasses',
      name: 'Gafas FL-41 (Filtro Fotofobia & Migrañas)',
      category: 'visual',
      categoryLabel: isEs ? 'Filtro Visual' : 'Visual Filter',
      description: isEs 
        ? 'Lentes terapéuticas de tinte rosa/ámbar que bloquean el espectro de 480-520 nm de luz fluorescente y pantallas.'
        : 'Therapeutic rose-tinted lenses blocking 480-520 nm blue/green glare.',
      neuroBenefit: isEs 
        ? 'Elimina el micro-parpadeo de luces de oficina y supermercados que dispara crisis visuales y migrañas.'
        : 'Eliminates fluorescent flicker and digital eye strain triggering visual meltdowns.',
      searchTerm: 'FL-41 glasses migraine photophobia light sensitivity',
      recommendedModel: 'FL-41 Anti-Glare / TheraSpecs style',
      rating: '4.9 ★'
    },
    {
      id: 'ono-roller',
      name: 'ONO Roller & Fidget Silencioso',
      category: 'fidget',
      categoryLabel: isEs ? 'Stimming' : 'Stimming',
      description: isEs 
        ? 'Herramienta háptica de rotación fluida fabricada en aluminio anodizado para regulación motora discreta.'
        : 'Silent friction-free rolling tool in aircraft-grade aluminum for discrete motor stimming.',
      neuroBenefit: isEs 
        ? 'Canaliza la inquietud propioceptiva motora y el exceso de cortisol sin generar ruido en reuniones.'
        : 'Channels motor restlessness and excess energy silently in quiet environments.',
      searchTerm: 'ono roller handheld sensory fidget tool adults silent',
      recommendedModel: 'ONO Roller Original / Junior',
      rating: '4.9 ★'
    },
    {
      id: 'anc-headphones',
      name: 'Auriculares Over-Ear ANC',
      category: 'audio',
      categoryLabel: isEs ? 'Cancelación Activa' : 'Active Noise Cancelling',
      description: isEs 
        ? 'Cancelación activa de ruido híbrida para crear un escudo acústico de aislamiento inmediato.'
        : 'Hybrid active noise cancellation for immediate acoustic sanctuary.',
      neuroBenefit: isEs 
        ? 'Herramienta de rescate de emergencia en crisis cuando el entorno supera el umbral de tolerancia auditiva.'
        : 'Emergency rescue tool when environmental decibels exceed sensory tolerance.',
      searchTerm: 'noise cancelling headphones active ANC over ear',
      recommendedModel: 'Sony WH-1000XM4/XM5 or Soundcore Space One',
      rating: '4.8 ★'
    },
    {
      id: 'weighted-vest-lap',
      name: isEs ? 'Almohadilla de Peso para Regazo' : 'Weighted Lap Pad / Collar',
      category: 'pressure',
      categoryLabel: isEs ? 'Presión Somática' : 'Somatic Pressure',
      description: isEs 
        ? 'Almohadilla compacta de 2 a 3.5 kg para colocar en el regazo o sobre los hombros mientras trabajas.'
        : 'Compact 5-7 lbs weighted lap pad for grounded sitting at desk.',
      neuroBenefit: isEs 
        ? 'Anclaje gravitacional somático que ayuda a mantener el foco y calma la desregulación postural.'
        : 'Gravitational somatic anchoring aiding focus and calming postural distress.',
      searchTerm: 'weighted lap pad for adults office sensory',
      recommendedModel: isEs ? 'Almohadilla suave de microperlas' : 'Soft velvet weighted lap pad',
      rating: '4.8 ★'
    },
    {
      id: 'sensory-eye-mask',
      name: isEs ? 'Antifaz con Peso / Apagón Total' : 'Weighted Blackout Eye Mask',
      category: 'comfort',
      categoryLabel: isEs ? 'Apagón Sensorial' : 'Sensory Blackout',
      description: isEs 
        ? 'Antifaz 100% oscurecimiento total con presión suave sobre el hueso frontal y esferas de gel.'
        : 'Total blackout eye mask with gentle weighted pressure on brow line.',
      neuroBenefit: isEs 
        ? 'Facilita la entrada en Modo Cueva induciendo un apagón sensorial que reinicia el sistema visual.'
        : 'Enables Cave Mode immersion with total sensory blackout.',
      searchTerm: 'weighted eye mask blackout sensory compression',
      recommendedModel: 'Weighted Sleep Mask with cooling insert',
      rating: '4.9 ★'
    }
  ];

  const getToolIcon = (category: string) => {
    switch (category) {
      case 'audio':
        return <Headphones size={22} className="text-cyan-400" />;
      case 'pressure':
        return <Layers size={22} className="text-indigo-400" />;
      case 'visual':
        return <Eye size={22} className="text-purple-400" />;
      case 'fidget':
        return <Sparkles size={22} className="text-amber-400" />;
      case 'comfort':
        return <Moon size={22} className="text-teal-400" />;
      default:
        return <ShieldCheck size={22} className="text-cyan-400" />;
    }
  };

  const getAmazonUrl = (tool: SensoryTool) => {
    let country: string | undefined;
    try {
      const p = localStorage.getItem('ns_profile');
      if (p) country = JSON.parse(p)?.country;
    } catch {}
    const domain = getAmazonDomainForCountry(country);
    const base = `https://${domain}/s`;
    const query = encodeURIComponent(tool.searchTerm);
    if (affiliateTag) {
      return `${base}?k=${query}&tag=${encodeURIComponent(affiliateTag)}`;
    }
    return `${base}?k=${query}`;
  };

  const categories = [
    { id: 'all', label: isEs ? 'Todos' : 'All' },
    { id: 'audio', label: isEs ? 'Acústico' : 'Audio' },
    { id: 'pressure', label: isEs ? 'Presión' : 'Pressure' },
    { id: 'visual', label: isEs ? 'Visual' : 'Visual' },
    { id: 'fidget', label: isEs ? 'Stimming' : 'Stimming' },
    { id: 'comfort', label: isEs ? 'Apagón' : 'Blackout' },
  ];

  const filteredTools = selectedCategory === 'all' 
    ? tools 
    : tools.filter(t => t.category === selectedCategory);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-transparent">
      <Header 
        title={isEs ? 'Kit Sensorial Somático' : 'Somatic Sensory Kit'} 
        onBack={onBack} 
      />

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 sm:px-6 pt-3 pb-[max(5rem,calc(env(safe-area-inset-bottom,0px)+3.5rem))] space-y-4">
        {/* Intro Sanctuary Banner */}
        <div className="p-4 sm:p-5 rounded-3xl bg-cyan-500/10 dark:bg-cyan-500/10 light:bg-white border border-cyan-400/25 dark:border-cyan-400/25 light:border-cyan-200 shadow-md">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-black tracking-widest text-cyan-400 dark:text-cyan-400 light:text-cyan-700">
              {isEs ? 'REGULACIÓN SENSORIAL SOMÁTICA' : 'SOMATIC SENSORY REGULATION'}
            </span>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white dark:text-white light:text-slate-900 leading-snug">
            {isEs ? 'Herramientas de protección y recarga' : 'Protective & recharging tools'}
          </h3>
          <p className="text-[11px] text-cyan-200/90 dark:text-cyan-200/90 light:text-slate-600 mt-1 leading-relaxed font-medium">
            {isEs 
              ? 'Dispositivos probados científicamente para amortiguar sobrecargas y preservar tus cucharas.'
              : 'Scientifically validated sensory dampeners to preserve your cognitive spoons.'}
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setSelectedCategory(cat.id);
                hapticEngine.triggerImpact('light');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-white/5 dark:bg-white/5 light:bg-white hover:bg-white/10 text-slate-300 dark:text-slate-300 light:text-slate-700 border border-white/10 dark:border-white/10 light:border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Tool Cards */}
        <div className="space-y-3.5">
          {filteredTools.map((tool) => {
            const amazonUrl = getAmazonUrl(tool);

            return (
              <motion.div
                key={tool.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 sm:p-5 rounded-3xl bg-white/[0.04] dark:bg-white/[0.04] light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 shadow-md transition-all relative overflow-hidden group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-200 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                    {getToolIcon(tool.category)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 dark:text-cyan-300 light:text-cyan-800 font-bold uppercase tracking-wider">
                        {tool.categoryLabel}
                      </span>
                      <span className="text-[10px] text-amber-300 dark:text-amber-300 light:text-amber-700 font-bold">
                        {tool.rating}
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-white dark:text-white light:text-slate-900 tracking-tight leading-snug">
                      {tool.name}
                    </h4>
                  </div>
                </div>

                <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-600 mt-2 leading-relaxed">
                  {tool.description}
                </p>

                {/* Neurological Benefit Box */}
                <div className="mt-3 p-3 rounded-2xl bg-cyan-950/25 dark:bg-cyan-950/25 light:bg-cyan-50/70 border border-cyan-500/20 text-[11px] text-cyan-200 dark:text-cyan-200 light:text-slate-700 leading-relaxed flex items-start gap-2">
                  <ShieldCheck size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-cyan-300 dark:text-cyan-300 light:text-cyan-800">
                      {isEs ? 'Beneficio neurológico: ' : 'Sensory benefit: '}
                    </span>
                    {tool.neuroBenefit}
                  </div>
                </div>

                {/* Action Link Button */}
                <div className="mt-3.5 pt-3 border-t border-white/10 dark:border-white/10 light:border-slate-200">
                  <a
                    href={amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => hapticEngine.triggerImpact('light')}
                    className="w-full py-3 px-4 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all"
                  >
                    <span>{isEs ? 'Ver detalles y disponibilidad' : 'View details & availability'}</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {affiliateTag && (
          <p className="text-[10px] text-slate-400 dark:text-slate-400 light:text-slate-500 text-center pb-2">
            {isEs
              ? 'Como afiliado de Amazon, gano comisión por compras que califican.'
              : 'As an Amazon Associate I earn from qualifying purchases.'}
          </p>
        )}
      </div>
    </div>
  );
}
