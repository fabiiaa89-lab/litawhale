import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from '../Header';
import { Language } from '../../types';
import { 
  Package, 
  ExternalLink, 
  Copy, 
  Check, 
  Settings2, 
  Sparkles, 
  SlidersHorizontal, 
  Info, 
  ShieldCheck,
  Heart,
  Share2
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
  icon: string;
  searchTerm: string;
  recommendedModel: string;
  customUrl?: string;
  rating: string;
}

export default function Kit({ language, onBack }: KitProps) {
  const isEs = language === 'es';

  // Affiliate tag set by the developer or stored
  const affiliateTag = localStorage.getItem('ns_amazon_tag') || '';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const tools: SensoryTool[] = [
    {
      id: 'loop-earplugs',
      name: 'Loop Earplugs (Quiet 2 / Engage)',
      category: 'audio',
      categoryLabel: isEs ? '🎧 Acústico' : '🎧 Audio',
      description: isEs 
        ? 'Atenuadores acústicos ergonómicos con reducción pasiva de 16 a 27 dB sin distorsionar el habla.'
        : 'Ergonomic acoustic dampeners reducing 16 to 27 dB without speech distortion.',
      neuroBenefit: isEs 
        ? 'Frena la sobrecarga coclear y el agotamiento de cucharas en supermercados, transporte y oficinas.'
        : 'Prevents cochlear overload and spoon exhaustion in crowded noisy spaces.',
      icon: '👂',
      searchTerm: 'Loop Earplugs Quiet 2 Engage',
      recommendedModel: 'Loop Quiet 2 / Experience Pro',
      rating: '4.9 ★'
    },
    {
      id: 'weighted-blanket',
      name: isEs ? 'Manta Pesada (Presión Profunda DTP)' : 'Weighted Blanket (Deep Touch)',
      category: 'pressure',
      categoryLabel: isEs ? '🪨 Presión Profunda' : '🪨 Deep Touch',
      description: isEs 
        ? 'Manta terapéutica con microperlas de vidrio no tóxicas, peso distribuido (7-9 kg).'
        : 'Therapeutic blanket with non-toxic glass microbeads for deep sensory input.',
      neuroBenefit: isEs 
        ? 'Estimula el sistema parasimpático liberando serotonina y reduciendo el cortisol durante o tras un shutdown.'
        : 'Stimulates parasympathetic nervous system, lowering cortisol during shutdowns.',
      icon: '🛌',
      searchTerm: 'weighted blanket adults 15 lbs glass beads',
      recommendedModel: isEs ? 'Manta de 6 a 9 kg transpirable' : '15-20 lbs breathable cotton',
      rating: '4.8 ★'
    },
    {
      id: 'fl41-glasses',
      name: 'Gafas FL-41 (Filtro Fotofobia & Migrañas)',
      category: 'visual',
      categoryLabel: isEs ? '👓 Filtro Visual' : '👓 Visual Filter',
      description: isEs 
        ? 'Lentes terapéuticas de tinte rosa/ámbar que bloquean el espectro de 480-520 nm de luz fluorescente y pantallas.'
        : 'Therapeutic rose-tinted lenses blocking 480-520 nm blue/green glare.',
      neuroBenefit: isEs 
        ? 'Elimina el micro-parpadeo de luces de oficina y supermercados que dispara crisis visuales y migrañas.'
        : 'Eliminates fluorescent flicker and digital eye strain triggering visual meltdowns.',
      icon: '🕶️',
      searchTerm: 'FL-41 glasses migraine photophobia light sensitivity',
      recommendedModel: 'FL-41 Anti-Glare / TheraSpecs style',
      rating: '4.9 ★'
    },
    {
      id: 'ono-roller',
      name: 'ONO Roller & Fidget de Metal Silencioso',
      category: 'fidget',
      categoryLabel: isEs ? '🌀 Fidget / Stimming' : '🌀 Fidget / Stimming',
      description: isEs 
        ? 'Dispositivo de autorregulación propioceptiva manual, silencioso, suave y de peso reconfortante.'
        : 'Silent sensory hand roller providing smooth proprioceptive stimming.',
      neuroBenefit: isEs 
        ? 'Canaliza la inquietud motora y el stimming táctil discretamente en el trabajo, reuniones o clases.'
        : 'Channels motor restlessness and tactile stimming discreetly in public.',
      icon: '⚙️',
      searchTerm: 'ONO roller handheld fidget silent metal',
      recommendedModel: 'ONO Roller Original / Junior',
      rating: '4.9 ★'
    },
    {
      id: 'anc-headphones',
      name: isEs ? 'Auriculares ANC Cancelación Activa' : 'Active Noise Cancelling Headphones',
      category: 'audio',
      categoryLabel: isEs ? '🎧 Acústico' : '🎧 Audio',
      description: isEs 
        ? 'Cancelación activa de ruido híbrida para crear un escudo acústico de aislamiento inmediato.'
        : 'Hybrid active noise cancellation for immediate acoustic sanctuary.',
      neuroBenefit: isEs 
        ? 'Herramienta de rescate de emergencia en crisis cuando el entorno supera el umbral de tolerancia auditiva.'
        : 'Emergency rescue tool when environmental decibels exceed sensory tolerance.',
      icon: '🎧',
      searchTerm: 'noise cancelling headphones active ANC over ear',
      recommendedModel: 'Sony WH-1000XM4/XM5 or Soundcore Space One',
      rating: '4.8 ★'
    },
    {
      id: 'chewelry-sensory',
      name: isEs ? 'Mordedores Sensoriales (Chewelry)' : 'Sensory Chewelry (Oral Stimming)',
      category: 'fidget',
      categoryLabel: isEs ? '🌀 Fidget / Stimming' : '🌀 Stimming',
      description: isEs 
        ? 'Collares y accesorios de silicona médica libre de BPA para masticación y regulación mandibular.'
        : 'Food-grade silicone pendants for safe oral stimming and jaw tension relief.',
      neuroBenefit: isEs 
        ? 'Alivia el bruxismo diurno y la tensión propioceptiva craneal mediante estimulación oral segura.'
        : 'Relieves daytime bruxism and cranial tension through safe oral regulation.',
      icon: '💎',
      searchTerm: 'sensory chew necklace adults silicone chewelry',
      recommendedModel: isEs ? 'Silicona grado médico firme' : 'Medical grade silicone stick',
      rating: '4.7 ★'
    },
    {
      id: 'weighted-vest-lap',
      name: isEs ? 'Almohadilla de Peso para Regazo' : 'Weighted Lap Pad / Collar',
      category: 'pressure',
      categoryLabel: isEs ? '🪨 Presión Profunda' : '🪨 Deep Touch',
      description: isEs 
        ? 'Almohadilla compacta de 2 a 3.5 kg para colocar en el regazo o sobre los hombros mientras trabajas.'
        : 'Compact 5-7 lbs weighted lap pad for grounded sitting at desk.',
      neuroBenefit: isEs 
        ? 'Anclaje gravitacional somático que ayuda a mantener el foco y calma la desregulación postural.'
        : 'Gravitational somatic anchoring aiding focus and calming postural distress.',
      icon: '🧘',
      searchTerm: 'weighted lap pad for adults office sensory',
      recommendedModel: isEs ? 'Almohadilla suave de microperlas' : 'Soft velvet weighted lap pad',
      rating: '4.8 ★'
    },
    {
      id: 'sunset-lamp',
      name: isEs ? 'Lámpara de Luz Roja / Atardecer Sin Parpadeo' : 'Sunset / Red Light Flicker-Free Lamp',
      category: 'visual',
      categoryLabel: isEs ? '👓 Filtro Visual' : '👓 Visual Filter',
      description: isEs 
        ? 'Iluminación cálida libre de parpadeo a 660nm o luz ámbar circadiana sin emisión azul.'
        : 'Zero-flicker warm sunset or red ambient lamp for evening sensory wind-down.',
      neuroBenefit: isEs 
        ? 'Permite a los ojos descansar tras el trabajo sensorialmente hostil y favorece la producción de melatonina.'
        : 'Allows ocular rest after harsh lighting and promotes melatonin synthesis.',
      icon: '🌅',
      searchTerm: 'red light therapy lamp night light flicker free sleep',
      recommendedModel: isEs ? 'Luz ámbar cálida continua' : 'Warm amber eye-safe night lamp',
      rating: '4.7 ★'
    },
    {
      id: 'sensory-eye-mask',
      name: isEs ? 'Antifaz con Peso / Terapia Frío-Calor' : 'Weighted Cooling / Heat Eye Mask',
      category: 'comfort',
      categoryLabel: isEs ? '🛌 Apagón' : '🛌 Blackout',
      description: isEs 
        ? 'Antifaz 100% oscurecimiento total con presión suave sobre el hueso frontal y esferas de gel.'
        : 'Total blackout eye mask with gentle weighted pressure on brow line.',
      neuroBenefit: isEs 
        ? 'Facilita la entrada en Modo Cueva induciendo un apagón sensorial que reinicia el sistema visual.'
        : 'Enables Cave Mode immersion with total sensory blackout.',
      icon: '🌑',
      searchTerm: 'weighted eye mask blackout sensory compression',
      recommendedModel: 'Weighted Sleep Mask with cooling insert',
      rating: '4.9 ★'
    }
  ];

  const getAmazonUrl = (tool: SensoryTool) => {
    const base = 'https://www.amazon.com/s';
    const query = encodeURIComponent(tool.searchTerm);
    if (affiliateTag) {
      return `${base}?k=${query}&tag=${encodeURIComponent(affiliateTag)}`;
    }
    return `${base}?k=${query}`;
  };

  const categories = [
    { id: 'all', label: isEs ? 'Todos' : 'All' },
    { id: 'audio', label: isEs ? '🎧 Acústico' : '🎧 Audio' },
    { id: 'pressure', label: isEs ? '🪨 Presión' : '🪨 Pressure' },
    { id: 'visual', label: isEs ? '👓 Visual' : '👓 Visual' },
    { id: 'fidget', label: isEs ? '🌀 Fidgets' : '🌀 Fidgets' },
    { id: 'comfort', label: isEs ? '🛌 Apagón' : '🛌 Blackout' },
  ];

  const filteredTools = selectedCategory === 'all' 
    ? tools 
    : tools.filter(t => t.category === selectedCategory);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-transparent">
      <Header 
        title={isEs ? 'Kit de Supervivencia' : 'Sensory Survival Kit'} 
        onBack={onBack} 
      />

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-4 pb-20 space-y-4">
        {/* Intro Banner */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-900/30 via-slate-900/60 to-cyan-900/30 border border-cyan-500/20 backdrop-blur-xl relative overflow-hidden">
          <span className="text-[10px] uppercase font-black tracking-widest text-cyan-400 block mb-1">
            {isEs ? 'REGULACIÓN SENSORIAL SOMÁTICA' : 'SOMATIC SENSORY REGULATION'}
          </span>
          <h3 className="text-base font-bold text-white leading-tight">
            {isEs ? 'Herramientas esenciales anti-colapso' : 'Essential anti-overload tools'}
          </h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {isEs 
              ? 'Dispositivos probados para reducir sobrecarga acústica, lumínica y táctil, y proteger tus cucharas disponibles.'
              : 'Tested tools to reduce sensory overload and protect your available spoons.'}
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                hapticEngine.triggerImpact('light');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-black scale-105'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
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
            const isCopied = copiedId === tool.id;

            return (
              <motion.div
                key={tool.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-3xl bg-slate-900/60 border border-white/10 hover:border-cyan-500/30 transition-all backdrop-blur-xl relative overflow-hidden group shadow-xl"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                    {tool.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-bold uppercase tracking-wider">
                        {tool.categoryLabel}
                      </span>
                      <span className="text-[10px] text-amber-300 font-bold">
                        {tool.rating}
                      </span>
                    </div>
                    <h4 className="text-base font-black text-white tracking-tight leading-snug">
                      {tool.name}
                    </h4>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                  {tool.description}
                </p>

                {/* Neurological Benefit Box */}
                <div className="mt-2.5 p-2.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-[11px] text-cyan-200/90 leading-relaxed flex items-start gap-2">
                  <ShieldCheck size={15} className="text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-cyan-300">
                      {isEs ? 'Alivio neurológico: ' : 'Sensory benefit: '}
                    </span>
                    {tool.neuroBenefit}
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-3.5 pt-3 border-t border-white/10">
                  <a
                    href={amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => hapticEngine.triggerImpact('light')}
                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all"
                  >
                    <span>{isEs ? 'Ver en Amazon' : 'View on Amazon'}</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
