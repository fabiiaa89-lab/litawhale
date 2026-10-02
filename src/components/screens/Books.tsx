import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from '../Header';
import { Language } from '../../types';
import { 
  BookOpen, 
  ExternalLink, 
  Copy, 
  Check, 
  Settings2, 
  Sparkles, 
  ShoppingBag,
  Info,
  Bookmark,
  Share2,
  Tag
} from 'lucide-react';
import { hapticEngine } from '../../utils/hapticEngine';

interface BooksProps {
  language: Language;
  onBack: () => void;
}

interface BookItem {
  id: string;
  title: string;
  author: string;
  platforms: ('amazon' | 'hotmart')[];
  coverEmoji: string;
  tagline: string;
  description: string;
  keyTakeaway: string;
  amazonSearchTerm: string;
  hotmartDefaultUrl: string;
  format: string;
}

export default function Books({ language, onBack }: BooksProps) {
  const isEs = language === 'es';

  // Affiliate configuration stored in localStorage
  const amazonTag = localStorage.getItem('ns_amazon_tag') || '';
  const hotmartTag = localStorage.getItem('ns_hotmart_tag') || '';
  const [platformFilter, setPlatformFilter] = useState<'all' | 'amazon' | 'hotmart'>('all');

  const books: BookItem[] = [
    {
      id: 'unmasking-autism',
      title: isEs ? 'Desenmascarando el Autismo (Unmasking Autism)' : 'Unmasking Autism',
      author: 'Dr. Devon Price',
      platforms: ['amazon'],
      coverEmoji: '🎭',
      tagline: isEs ? 'El libro imprescindible sobre masking y burnout' : 'The definitive guide on unmasking and reclaiming identity',
      description: isEs 
        ? 'Una guía compasiva y rigurosa para desmantelar el camuflaje social, sanar el agotamiento crónico y abrazar la neurodivergencia real.'
        : 'A compassionate guide to peeling back the mask, healing burnout, and living authentically.',
      keyTakeaway: isEs 
        ? 'Aprende a reconocer el coste biológico del enmascaramiento y reconectar con tus necesidades sensoriales.'
        : 'Identify the biological cost of masking and honor your sensory profile.',
      amazonSearchTerm: 'Unmasking Autism Devon Price',
      hotmartDefaultUrl: '',
      format: isEs ? 'Libro físico · Kindle · Audiolibro' : 'Paperback · Kindle · Audiobook'
    },
    {
      id: 'guia-desescalada-hotmart',
      title: isEs ? 'Manual Maestro: Desescalada de Meltdowns & Crisis Sensoriales' : 'Master Guide: Meltdown & Sensory Crisis De-escalation',
      author: 'Lita-Whale Editorial / Especialistas TEA',
      platforms: ['hotmart'],
      coverEmoji: '🛡️',
      tagline: isEs ? 'Guía digital descargable en Hotmart con protocolos imprimibles' : 'Downloadable digital manual with printable sensory crisis protocols',
      description: isEs 
        ? 'Protocolos de emergencia paso a paso para personas adultas en el espectro autista y sus redes de apoyo. Incluye guiones para emergencias médicas.'
        : 'Actionable emergency step-by-step protocols for autistic adults and caregivers.',
      keyTakeaway: isEs 
        ? 'Protocolos listos para imprimir y llevar en la cartera ante colapsos en la vía pública o el trabajo.'
        : 'Printable emergency cards and calm somatic grounding checklists.',
      amazonSearchTerm: '',
      hotmartDefaultUrl: 'https://hotmart.com/es/marketplace',
      format: isEs ? 'Ebook PDF + Fichas Imprimibles (Hotmart)' : 'PDF Ebook + Printable Tools (Hotmart)'
    },
    {
      id: 'el-cerebro-autista',
      title: isEs ? 'El Cerebro Autista: Pensar en imágenes' : 'The Autistic Brain',
      author: 'Dra. Temple Grandin & Richard Panek',
      platforms: ['amazon'],
      coverEmoji: '🧠',
      tagline: isEs ? 'Neurociencia clara y validación sensorial' : 'Groundbreaking neuroscience on neurodivergent cognition',
      description: isEs 
        ? 'Grandin combina su experiencia personal como mujer autista con los últimos escáneres cerebrales y avances en neurobiología sensorial.'
        : 'Combines personal memoir with neuroimaging to explain sensory processing patterns.',
      keyTakeaway: isEs 
        ? 'Valida por qué ciertos estímulos provocan dolor físico en el sistema nervioso autista.'
        : 'Validates why sensory stimuli cause neurological distress.',
      amazonSearchTerm: 'El cerebro autista Temple Grandin',
      hotmartDefaultUrl: '',
      format: isEs ? 'Libro tapa blanda · Ebook' : 'Paperback · Kindle'
    },
    {
      id: 'mujeres-autismo',
      title: isEs ? 'Mujeres y Autismo: La Guía de la Condición Invisible' : 'Women and Autism: The Invisible Spectrum',
      author: 'Clara Ferrer & Red Neurodivergente',
      platforms: ['amazon', 'hotmart'],
      coverEmoji: '✨',
      tagline: isEs ? 'Diagnóstico tardío, hipersensibilidad y hormonas' : 'Late diagnosis, sensory sensitivity, and masking',
      description: isEs 
        ? 'Explora las características del fenotipo femenino de autismo, la sobrecarga sensorial ligada a ciclos hormonales y la reconstrucción de la autoestima.'
        : 'Focuses on the female autism phenotype, hormone-sensory interactions, and post-diagnosis recovery.',
      keyTakeaway: isEs 
        ? 'Estrategias para gestionar la fluctuación de cucharas y el masking social acumulado por años.'
        : 'Actionable tips for fluctuating spoons and cumulative masking.',
      amazonSearchTerm: 'Mujeres y autismo diagnostico tardio',
      hotmartDefaultUrl: 'https://hotmart.com/es/marketplace',
      format: isEs ? 'Libro físico (Amazon) & Curso Digital (Hotmart)' : 'Book (Amazon) & Digital Course (Hotmart)'
    },
    {
      id: 'cuaderno-cucharas-hotmart',
      title: isEs ? 'Cuaderno Práctico: Gestión de Cucharas & Energía Somática' : 'Spoon Theory Practical Workbook',
      author: 'Lita-Whale Wellbeing',
      platforms: ['hotmart'],
      coverEmoji: '🥄',
      tagline: isEs ? 'Workbook interactivo en Hotmart con plantillas de registro' : 'Interactive Hotmart workbook with somatic pacing templates',
      description: isEs 
        ? 'Plantillas guiadas para auditar tus drenadores de energía diarios, calcular tu umbral de sobrecarga y organizar tu semana sin colapsar.'
        : 'Guided templates to audit energy drains, track threshold limits, and prevent burnout.',
      keyTakeaway: isEs 
        ? 'Aprende a presupuestar cucharas como si fueran recursos no renovables.'
        : 'Budget your daily spoons like non-renewable neurological resources.',
      amazonSearchTerm: '',
      hotmartDefaultUrl: 'https://hotmart.com/es/marketplace',
      format: isEs ? 'Cuaderno digital editable + Imprimibles (Hotmart)' : 'Digital Workbook + Notion Template (Hotmart)'
    },
    {
      id: 'neurotribes',
      title: isEs ? 'NeuroTribes: El legado del autismo y el futuro de la neurodiversidad' : 'NeuroTribes: The Legacy of Autism',
      author: 'Steve Silberman',
      platforms: ['amazon'],
      coverEmoji: '🌍',
      tagline: isEs ? 'La obra maestra ganadora del Premio Samuel Johnson' : 'The definitive history of autism and neurodiversity',
      description: isEs 
        ? 'La historia monumental que demostró que el autismo no es una enfermedad moderna, sino una variación natural y milenaria del cableado humano.'
        : 'A sweeping history tracing autism as a natural variation of human cognition.',
      keyTakeaway: isEs 
        ? 'Un pilar fundamental para erradicar el estigma y comprender la cultura neurodivergente.'
        : 'Essential foundational context for autism culture and acceptance.',
      amazonSearchTerm: 'Neurotribes Steve Silberman espanol',
      hotmartDefaultUrl: '',
      format: isEs ? 'Libro · Tapa dura · Digital' : 'Hardcover · Paperback · Kindle'
    },
    {
      id: 'lenguaje-sentidos',
      title: isEs ? 'Percepción Sensorial en el Espectro Autista' : 'Sensory Perceptual Issues in Autism',
      author: 'Dra. Olga Bogdashina',
      platforms: ['amazon'],
      coverEmoji: '👁️',
      tagline: isEs ? 'La biblia de los 7 sentidos en el autismo' : 'The gold standard on the 7 sensory systems in autism',
      description: isEs 
        ? 'Analiza con precisión clínica la propiocepción, el sistema vestibular, la interocepción y la sinestesia en las personas autistas.'
        : 'In-depth clinical analysis of proprioception, vestibular, and interoception in ASD.',
      keyTakeaway: isEs 
        ? 'Te ayuda a identificar exactamente qué sentido se está sobrecargando en cada momento.'
        : 'Helps identify exact sensory triggers across all sensory modalities.',
      amazonSearchTerm: 'Percepcion sensorial en el autismo Olga Bogdashina',
      hotmartDefaultUrl: '',
      format: isEs ? 'Libro especializado' : 'Specialized reference book'
    }
  ];

  const handleSaveAffiliates = () => {
    const aTrim = tempAmazon.trim();
    const hTrim = tempHotmart.trim();
    setAmazonTag(aTrim);
    setHotmartTag(hTrim);
    localStorage.setItem('ns_amazon_tag', aTrim);
    localStorage.setItem('ns_hotmart_tag', hTrim);
    setShowConfig(false);
    hapticEngine.triggerImpact('light');
  };

  const getAmazonUrl = (book: BookItem) => {
    const base = 'https://www.amazon.com/s';
    const query = encodeURIComponent(book.amazonSearchTerm);
    if (amazonTag) {
      return `${base}?k=${query}&tag=${encodeURIComponent(amazonTag)}`;
    }
    return `${base}?k=${query}`;
  };

  const getHotmartUrl = (book: BookItem) => {
    if (hotmartTag) {
      // If user pasted a full hotmart link or an affiliate ID:
      if (hotmartTag.startsWith('http')) return hotmartTag;
      return `${book.hotmartDefaultUrl}?ref=${encodeURIComponent(hotmartTag)}`;
    }
    return book.hotmartDefaultUrl;
  };

  const handleCopyLink = (book: BookItem, platform: 'amazon' | 'hotmart') => {
    const url = platform === 'amazon' ? getAmazonUrl(book) : getHotmartUrl(book);
    navigator.clipboard?.writeText(url).then(() => {
      setCopiedId(`${book.id}-${platform}`);
      hapticEngine.triggerImpact('light');
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const filteredBooks = books.filter(b => {
    if (platformFilter === 'all') return true;
    return b.platforms.includes(platformFilter);
  });

  return (
    <div className="flex flex-col h-full overflow-hidden bg-transparent">
      <Header 
        title={isEs ? 'Libros sobre Autismo' : 'Autism Books'} 
        onBack={onBack} 
      />

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-4 pb-20 space-y-4">
        {/* Top Banner */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-900/30 via-slate-900/60 to-indigo-900/30 border border-purple-500/20 backdrop-blur-xl relative overflow-hidden">
          <span className="text-[10px] uppercase font-black tracking-widest text-purple-400 block mb-1">
            {isEs ? 'BIBLIOTECA NEURODIVERGENTE' : 'NEURODIVERGENT LIBRARY'}
          </span>
          <h3 className="text-base font-bold text-white leading-tight">
            {isEs ? 'Lecturas esenciales sobre autismo' : 'Essential books & guides on autism'}
          </h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {isEs 
              ? 'Obras fundamentales y guías prácticas seleccionadas para comprender el masking, regular la sobrecarga y validar la experiencia neurodivergente.'
              : 'Foundational works and practical guides to understand masking, manage sensory overload, and honor the neurodivergent experience.'}
          </p>
        </div>

        {/* Platform Filters */}
        <div className="flex items-center gap-1.5 py-1">
          <button
            onClick={() => {
              setPlatformFilter('all');
              hapticEngine.triggerImpact('light');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              platformFilter === 'all'
                ? 'bg-purple-500 text-white font-black shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
            }`}
          >
            {isEs ? 'Todos los Libros' : 'All Books'}
          </button>
          <button
            onClick={() => {
              setPlatformFilter('amazon');
              hapticEngine.triggerImpact('light');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              platformFilter === 'amazon'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
            }`}
          >
            <span>🛒 Amazon</span>
          </button>
          <button
            onClick={() => {
              setPlatformFilter('hotmart');
              hapticEngine.triggerImpact('light');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              platformFilter === 'hotmart'
                ? 'bg-orange-500 text-white font-black shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
            }`}
          >
            <span>🔥 Hotmart</span>
          </button>
        </div>

        {/* Book Cards */}
        <div className="space-y-4">
          {filteredBooks.map((book) => {
            const hasAmazon = book.platforms.includes('amazon');
            const hasHotmart = book.platforms.includes('hotmart');

            return (
              <motion.div
                key={book.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-3xl bg-slate-900/60 border border-white/10 hover:border-purple-500/30 transition-all backdrop-blur-xl relative overflow-hidden group shadow-xl space-y-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-14 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-purple-400/30 flex items-center justify-center text-3xl shrink-0 shadow-lg">
                    {book.coverEmoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      {hasAmazon && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold uppercase tracking-wider">
                          🛒 Amazon
                        </span>
                      )}
                      {hasHotmart && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-300 font-bold uppercase tracking-wider">
                          🔥 Hotmart
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 font-medium">
                        {book.format}
                      </span>
                    </div>

                    <h4 className="text-base font-black text-white tracking-tight leading-snug">
                      {book.title}
                    </h4>
                    <p className="text-xs text-purple-300 font-semibold mt-0.5">
                      {book.author}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {book.description}
                </p>

                {/* Key Takeaway */}
                <div className="p-2.5 rounded-2xl bg-purple-950/30 border border-purple-500/20 text-[11px] text-purple-200/90 leading-relaxed flex items-start gap-2">
                  <Sparkles size={15} className="text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-purple-300">
                      {isEs ? 'Por qué leerlo: ' : 'Key takeaway: '}
                    </span>
                    {book.keyTakeaway}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-2">
                  {hasAmazon && (
                    <a
                      href={getAmazonUrl(book)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => hapticEngine.triggerImpact('light')}
                      className="flex-1 min-w-[140px] py-3 px-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all"
                    >
                      <span>{isEs ? 'Ver en Amazon' : 'Amazon'}</span>
                      <ExternalLink size={13} />
                    </a>
                  )}

                  {hasHotmart && (
                    <a
                      href={getHotmartUrl(book)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => hapticEngine.triggerImpact('light')}
                      className="flex-1 min-w-[140px] py-3 px-3 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all"
                    >
                      <span>{isEs ? 'Adquirir en Hotmart' : 'Hotmart'}</span>
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
