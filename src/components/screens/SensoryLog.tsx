import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from '../Header';
import { Language, SensoryLogEntry } from '../../types';
import { 
  ClipboardList, 
  Plus, 
  Trash2, 
  Sparkles, 
  AlertTriangle, 
  Check, 
  Calendar, 
  Clock, 
  Flame, 
  Activity, 
  ShieldAlert, 
  BarChart3, 
  Download, 
  X,
  FileText,
  Filter
} from 'lucide-react';
import { hapticEngine } from '../../utils/hapticEngine';

interface SensoryLogProps {
  language: Language;
  onBack: () => void;
}

const COMMON_TRIGGERS = [
  { id: 'noise', label: '🔊 Ruido fuerte / solapado', labelEn: '🔊 Loud / overlapping noise' },
  { id: 'lights', label: '💡 Luces fluorescentes / parpadeo', labelEn: '💡 Fluorescent / flickering lights' },
  { id: 'crowds', label: '👥 Multitudes / invasión de espacio', labelEn: '👥 Crowds / close proximity' },
  { id: 'clothing', label: '👔 Texturas de ropa / calor / etiquetas', labelEn: '👔 Clothing textures / heat / tags' },
  { id: 'unexpected', label: '⏳ Cambio imprevisto de planes', labelEn: '⏳ Unexpected change of plans' },
  { id: 'masking', label: '💬 Masking prolongado / socialización', labelEn: '💬 Prolonged masking / socializing' },
  { id: 'exhaustion', label: '🔋 Agotamiento de cucharas / insomnio', labelEn: '🔋 Spoon depletion / poor sleep' },
  { id: 'hunger_smell', label: '🍽️ Olores fuertes / hambre / comida no segura', labelEn: '🍽️ Strong smells / hunger / unsafe food' },
  { id: 'demands', label: '📋 Sobrecarga de demandas ejecutivas', labelEn: '📋 Executive function overload' }
];

const COMMON_RELIEF = [
  { id: 'cave', label: '🌑 Modo Cueva / Oscuridad total', labelEn: '🌑 Cave Mode / Total darkness' },
  { id: 'silence', label: '🎧 Silencio absoluto / Loops / ANC', labelEn: '🎧 Absolute silence / Loops / ANC' },
  { id: 'blanket', label: '🛌 Manta pesada / Presión profunda', labelEn: '🛌 Weighted blanket / Deep pressure' },
  { id: 'alone', label: '🚪 Aislarse a solas sin hablar', labelEn: '🚪 Solitude with zero speaking' },
  { id: 'sleep', label: '😴 Dormir / Apagar sentidos', labelEn: '😴 Sleeping / sensory reset' },
  { id: 'stimming', label: '🌀 Stimming libre / mecerse / fidgets', labelEn: '🌀 Free stimming / rocking / fidgets' },
  { id: 'safe_person', label: '🤝 Apoyo de persona segura en silencio', labelEn: '🤝 Silent support from safe person' },
];

export default function SensoryLog({ language, onBack }: SensoryLogProps) {
  const isEs = language === 'es';

  const [entries, setEntries] = useState<SensoryLogEntry[]>(() => {
    const saved = localStorage.getItem('ns_sensory_logs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    // Default initial mock seed to immediately demonstrate analytics value
    return [
      {
        id: 'seed-1',
        date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
        time: '18:30',
        type: 'meltdown',
        intensity: 4,
        triggers: ['🔊 Ruido fuerte / solapado', '💡 Luces fluorescentes / parpadeo', '👥 Multitudes / invasión de espacio'],
        sensations: ['Zumbido en oídos', 'Llanto incontrolable', 'Tensión mandibular'],
        reliefStrategies: ['🌑 Modo Cueva / Oscuridad total', '🎧 Silencio absoluto / Loops / ANC'],
        notes: isEs ? 'Supermercado en hora punta con música alta y luces led.' : 'Rush hour grocery store with loud music.'
      },
      {
        id: 'seed-2',
        date: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
        time: '14:15',
        type: 'shutdown',
        intensity: 3,
        triggers: ['💬 Masking prolongado / socialización', '⏳ Cambio imprevisto de planes'],
        sensations: ['Mutismo selectivo', 'Pesadez motora', 'Desconexión'],
        reliefStrategies: ['🚪 Aislarse a solas sin hablar', '🛌 Manta pesada / Presión profunda'],
        notes: isEs ? 'Reunión de trabajo extendida sin aviso previo.' : 'Unplanned extended work meeting.'
      }
    ];
  });

  const [activeTab, setActiveTab] = useState<'log' | 'analytics'>('log');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [copiedReport, setCopiedReport] = useState(false);

  // Form state
  const [formDate, setFormDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formTime, setFormTime] = useState(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  });
  const [formType, setFormType] = useState<'meltdown' | 'shutdown' | 'overload' | 'burnout'>('meltdown');
  const [formIntensity, setFormIntensity] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [formTriggers, setFormTriggers] = useState<string[]>([]);
  const [customTrigger, setCustomTrigger] = useState('');
  const [formRelief, setFormRelief] = useState<string[]>([]);
  const [formNotes, setFormNotes] = useState('');

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ns_sensory_logs', JSON.stringify(entries));
    } catch (e) {
      console.warn("Could not save sensory logs:", e);
    }
  }, [entries]);

  const handleToggleTrigger = (label: string) => {
    setFormTriggers(prev => 
      prev.includes(label) ? prev.filter(t => t !== label) : [...prev, label]
    );
    hapticEngine.triggerImpact('light');
  };

  const handleToggleRelief = (label: string) => {
    setFormRelief(prev => 
      prev.includes(label) ? prev.filter(r => r !== label) : [...prev, label]
    );
    hapticEngine.triggerImpact('light');
  };

  const handleAddCustomTrigger = () => {
    const trimmed = customTrigger.trim();
    if (!trimmed) return;
    if (!formTriggers.includes(trimmed)) {
      setFormTriggers(prev => [...prev, trimmed]);
    }
    setCustomTrigger('');
  };

  const handleSaveEntry = (e: FormEvent) => {
    e.preventDefault();
    const newEntry: SensoryLogEntry = {
      id: `log-${Date.now()}`,
      date: formDate,
      time: formTime,
      type: formType,
      intensity: formIntensity,
      triggers: formTriggers,
      sensations: [],
      reliefStrategies: formRelief,
      notes: formNotes.trim()
    };

    setEntries(prev => [newEntry, ...prev]);
    setIsModalOpen(false);
    hapticEngine.triggerImpact('medium');

    // Reset form
    setFormTriggers([]);
    setFormRelief([]);
    setFormNotes('');
  };

  const handleDeleteEntry = (id: string) => {
    if (window.confirm(isEs ? '¿Deseas eliminar este registro de la bitácora?' : 'Delete this log entry?')) {
      setEntries(prev => prev.filter(e => e.id !== id));
      hapticEngine.triggerImpact('light');
    }
  };

  // Compute Analytics
  const totalEntries = entries.length;
  const meltdownsCount = entries.filter(e => e.type === 'meltdown').length;
  const shutdownsCount = entries.filter(e => e.type === 'shutdown').length;
  const overloadsCount = entries.filter(e => e.type === 'overload' || e.type === 'burnout').length;

  const triggerFrequency: Record<string, number> = {};
  entries.forEach(e => {
    e.triggers.forEach(t => {
      triggerFrequency[t] = (triggerFrequency[t] || 0) + 1;
    });
  });

  const sortedTriggers = Object.entries(triggerFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const reliefFrequency: Record<string, number> = {};
  entries.forEach(e => {
    e.reliefStrategies.forEach(r => {
      reliefFrequency[r] = (reliefFrequency[r] || 0) + 1;
    });
  });

  const sortedRelief = Object.entries(reliefFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const handleExportReport = () => {
    let text = isEs 
      ? `=== INFORME DE REGISTRO SENSORIAL — LITA-WHALE ===\n`
      : `=== SENSORY LOG REPORT — LITA-WHALE ===\n`;
    text += `${isEs ? 'Fecha de generación:' : 'Generated on:'} ${new Date().toLocaleDateString()}\n`;
    text += `${isEs ? 'Total de episodios registrados:' : 'Total episodes:'} ${totalEntries}\n`;
    text += `• Meltdowns: ${meltdownsCount} (${totalEntries ? Math.round((meltdownsCount / totalEntries) * 100) : 0}%)\n`;
    text += `• Shutdowns: ${shutdownsCount} (${totalEntries ? Math.round((shutdownsCount / totalEntries) * 100) : 0}%)\n\n`;
    
    text += isEs ? `--- PRINCIPALES DESENCADENANTES DETECTADOS ---\n` : `--- TOP IDENTIFIED TRIGGERS ---\n`;
    sortedTriggers.forEach(([t, count], idx) => {
      text += `${idx + 1}. ${t}: ${count} ${isEs ? 'veces' : 'times'}\n`;
    });

    text += isEs ? `\n--- DETALLE DE EVENTOS ---\n` : `\n--- EVENT DETAILS ---\n`;
    entries.forEach((e, idx) => {
      text += `[${e.date} ${e.time}] ${e.type.toUpperCase()} (Intensidad: ${e.intensity}/5)\n`;
      text += `  Detonantes: ${e.triggers.join(', ') || 'N/A'}\n`;
      text += `  Alivio: ${e.reliefStrategies.join(', ') || 'N/A'}\n`;
      if (e.notes) text += `  Notas: ${e.notes}\n`;
      text += `\n`;
    });

    navigator.clipboard?.writeText(text).then(() => {
      setCopiedReport(true);
      hapticEngine.triggerImpact('light');
      setTimeout(() => setCopiedReport(false), 2500);
    });
  };

  const filteredEntries = filterType === 'all' 
    ? entries 
    : entries.filter(e => e.type === filterType);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-transparent">
      <Header 
        title={isEs ? 'Registro Sensorial' : 'Sensory Log'} 
        onBack={onBack} 
      />

      {/* Segmented Top Bar: Bitácora vs Patrones */}
      <div className="flex items-center justify-between px-5 pt-3 pb-2 gap-2 border-b border-white/5">
        <div className="flex rounded-2xl bg-white/5 p-1 border border-white/10 flex-1">
          <button
            onClick={() => {
              setActiveTab('log');
              hapticEngine.triggerImpact('light');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'log' 
                ? 'bg-cyan-500 text-slate-950 font-black shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ClipboardList size={15} />
            <span>{isEs ? 'Bitácora' : 'Journal'}</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('analytics');
              hapticEngine.triggerImpact('light');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'analytics' 
                ? 'bg-cyan-500 text-slate-950 font-black shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 size={15} />
            <span>{isEs ? 'Patrones' : 'Patterns'}</span>
          </button>
        </div>

        <button
          onClick={() => {
            setIsModalOpen(true);
            hapticEngine.triggerImpact('medium');
          }}
          className="p-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase flex items-center gap-1.5 shadow-lg active:scale-95 transition-all cursor-pointer shrink-0"
          title={isEs ? 'Registrar crisis' : 'Log episode'}
        >
          <Plus size={16} strokeWidth={3} />
          <span className="hidden sm:inline">{isEs ? 'Registrar' : 'Log'}</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-3 pb-20 space-y-4">
        {activeTab === 'log' ? (
          <>
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pl-1">
                {isEs ? 'FILTRAR:' : 'FILTER:'}
              </span>
              {[
                { id: 'all', label: isEs ? 'Todos' : 'All' },
                { id: 'meltdown', label: '💥 Meltdown' },
                { id: 'shutdown', label: '🌑 Shutdown' },
                { id: 'overload', label: '⚡ Sobrecarga' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => {
                    setFilterType(f.id);
                    hapticEngine.triggerImpact('light');
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    filterType === f.id
                      ? 'bg-white/20 text-white border border-cyan-400/50'
                      : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Entries List */}
            {filteredEntries.length === 0 ? (
              <div className="p-8 text-center rounded-3xl bg-white/5 border border-white/10 my-4 space-y-3">
                <div className="text-3xl">📝</div>
                <h4 className="text-sm font-bold text-white">
                  {isEs ? 'No hay registros en esta categoría' : 'No entries found'}
                </h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  {isEs 
                    ? 'Pulsa en "+ Registrar" cada vez que sientas una sobrecarga o hayas salido de un colapso para mapear tus patrones.'
                    : 'Tap "+ Log" whenever you recover from sensory overload to track patterns.'}
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs uppercase"
                >
                  {isEs ? 'Crear primer registro' : 'Create first log'}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredEntries.map(entry => {
                  const isMeltdown = entry.type === 'meltdown';
                  const isShutdown = entry.type === 'shutdown';
                  
                  return (
                    <motion.div
                      key={entry.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-3xl border backdrop-blur-xl relative overflow-hidden shadow-lg space-y-3 ${
                        isMeltdown 
                          ? 'bg-rose-950/20 border-rose-500/30' 
                          : isShutdown 
                          ? 'bg-indigo-950/20 border-indigo-500/30' 
                          : 'bg-slate-900/60 border-white/10'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">
                            {isMeltdown ? '💥' : isShutdown ? '🌑' : '⚡'}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-black text-white uppercase tracking-wider">
                                {entry.type === 'meltdown' && 'Meltdown'}
                                {entry.type === 'shutdown' && 'Shutdown'}
                                {entry.type === 'overload' && (isEs ? 'Sobrecarga' : 'Overload')}
                                {entry.type === 'burnout' && 'Burnout'}
                              </h4>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-bold">
                                {isEs ? `Intensidad: ${entry.intensity}/5` : `Intensity: ${entry.intensity}/5`}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                              <Calendar size={12} /> {entry.date} · <Clock size={12} /> {entry.time}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="p-2 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                          title={isEs ? 'Eliminar' : 'Delete'}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Triggers identified */}
                      {entry.triggers.length > 0 && (
                        <div>
                          <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider block mb-1">
                            {isEs ? 'DESENCADENANTES:' : 'TRIGGERS:'}
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {entry.triggers.map((t, idx) => (
                              <span
                                key={idx}
                                className="text-xs px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 font-medium"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Relief that helped */}
                      {entry.reliefStrategies.length > 0 && (
                        <div>
                          <span className="text-[10px] font-black uppercase text-emerald-300 tracking-wider block mb-1">
                            {isEs ? 'QUÉ AYUDÓ A SALIR:' : 'WHAT HELPED:'}
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {entry.reliefStrategies.map((r, idx) => (
                              <span
                                key={idx}
                                className="text-xs px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 font-medium"
                              >
                                {r}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Notes */}
                      {entry.notes && (
                        <div className="pt-2 border-t border-white/5 text-xs text-slate-300 italic leading-relaxed">
                          "{entry.notes}"
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          /* Analytics & Pattern Insights Tab */
          <div className="space-y-4">
            {/* Overview Stats Cards */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
                <span className="text-2xl font-black text-cyan-400 block">{totalEntries}</span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{isEs ? 'Registros' : 'Logs'}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center">
                <span className="text-2xl font-black text-rose-400 block">{meltdownsCount}</span>
                <span className="text-[10px] uppercase font-bold text-rose-300 tracking-wider">Meltdowns</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-center">
                <span className="text-2xl font-black text-indigo-400 block">{shutdownsCount}</span>
                <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider">Shutdowns</span>
              </div>
            </div>

            {/* Pattern Discovery Card */}
            <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-900/90 to-cyan-950/40 border border-cyan-500/30 backdrop-blur-xl space-y-3 shadow-xl">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-cyan-400" />
                <h4 className="text-sm font-black text-white uppercase tracking-wider">
                  {isEs ? 'Patrones Desencadenantes Detectados' : 'Top Detected Overload Patterns'}
                </h4>
              </div>

              {sortedTriggers.length === 0 ? (
                <p className="text-xs text-slate-400">
                  {isEs 
                    ? 'Aún no hay suficientes registros para calcular patrones con precisión.' 
                    : 'Not enough data logged yet to compute patterns.'}
                </p>
              ) : (
                <div className="space-y-2 pt-1">
                  {sortedTriggers.map(([trigger, count], idx) => {
                    const percentage = totalEntries ? Math.round((count / totalEntries) * 100) : 0;
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-white font-medium truncate pr-2">{trigger}</span>
                          <span className="text-cyan-300 font-bold shrink-0">{count}x ({percentage}%)</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full" 
                            style={{ width: `${Math.min(100, percentage)}%` }} 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <p className="text-[11px] text-cyan-200/80 leading-relaxed pt-2 border-t border-white/10">
                💡 {isEs 
                  ? 'Conocer tus detonantes principales te permite anticiparte y proteger tus cucharas antes de alcanzar el punto de no retorno.'
                  : 'Identifying your top triggers helps you intervene before reaching sensory burnout.'}
              </p>
            </div>

            {/* What Helps Most Card */}
            {sortedRelief.length > 0 && (
              <div className="p-4 rounded-3xl bg-slate-900/70 border border-emerald-500/20 backdrop-blur-xl space-y-2.5">
                <h4 className="text-xs font-black uppercase text-emerald-400 tracking-wider">
                  {isEs ? 'Tus Mejores Estrategias de Desescalada' : 'Most Effective Recovery Tools'}
                </h4>
                <div className="space-y-1.5">
                  {sortedRelief.map(([relief, count], idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-white/5 last:border-none">
                      <span className="text-slate-200">{relief}</span>
                      <span className="text-emerald-400 font-bold">{count} {isEs ? 'veces' : 'times'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Export Report Button */}
            <button
              onClick={handleExportReport}
              className="w-full py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 shadow-md"
            >
              {copiedReport ? (
                <>
                  <Check size={16} className="text-emerald-400" />
                  <span className="text-emerald-400">{isEs ? '¡Informe copiado al portapapeles!' : 'Report copied!'}</span>
                </>
              ) : (
                <>
                  <Download size={16} className="text-cyan-400" />
                  <span>{isEs ? 'Exportar Informe para Terapeuta / Psicólogo' : 'Export Clinical Report'}</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* New Entry Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full max-w-lg bg-[#141624] border-t sm:border border-white/15 rounded-t-[32px] sm:rounded-3xl p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-base">
                    📝
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {isEs ? 'Registrar Evento Sensorial' : 'Log Sensory Event'}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {isEs ? 'Bitácora para detectar patrones de crisis' : 'Journal to track crisis patterns'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveEntry} className="space-y-4">
                {/* Type Selection */}
                <div>
                  <label className="text-[11px] font-black uppercase text-cyan-300 tracking-wider block mb-1.5">
                    {isEs ? 'TIPO DE EPISODIO' : 'EPISODE TYPE'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'meltdown', label: '💥 Meltdown', sub: isEs ? 'Sobrecarga explosiva' : 'Explosive overload' },
                      { id: 'shutdown', label: '🌑 Shutdown', sub: isEs ? 'Mutismo e implosión' : 'Internal freeze' },
                      { id: 'overload', label: '⚡ Sobrecarga', sub: isEs ? 'Alerta sensorial' : 'Pre-crisis alert' },
                      { id: 'burnout', label: '🪫 Burnout', sub: isEs ? 'Agotamiento acumulado' : 'Chronic depletion' },
                    ].map(t => (
                      <button
                        type="button"
                        key={t.id}
                        onClick={() => {
                          setFormType(t.id as any);
                          hapticEngine.triggerImpact('light');
                        }}
                        className={`p-2.5 rounded-2xl text-left border transition-all cursor-pointer ${
                          formType === t.id
                            ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <span className="text-xs font-bold block">{t.label}</span>
                        <span className="text-[10px] text-slate-400 block">{t.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Intensity Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-black uppercase text-cyan-300 tracking-wider">
                      {isEs ? 'INTENSIDAD DE LA CRISIS' : 'INTENSITY'}
                    </label>
                    <span className="text-xs font-bold text-amber-400">
                      {formIntensity === 1 && (isEs ? '1 · Leve' : '1 · Mild')}
                      {formIntensity === 2 && (isEs ? '2 · Moderada' : '2 · Moderate')}
                      {formIntensity === 3 && (isEs ? '3 · Fuerte' : '3 · Strong')}
                      {formIntensity === 4 && (isEs ? '4 · Severa' : '4 · Severe')}
                      {formIntensity === 5 && (isEs ? '5 · Extrema / Emergencia' : '5 · Extreme')}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(lvl => (
                      <button
                        type="button"
                        key={lvl}
                        onClick={() => {
                          setFormIntensity(lvl as any);
                          hapticEngine.triggerImpact('light');
                        }}
                        className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          formIntensity >= lvl
                            ? 'bg-amber-500 text-slate-950 font-black'
                            : 'bg-white/10 text-slate-400'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      {isEs ? 'Fecha' : 'Date'}
                    </label>
                    <input
                      type="date"
                      value={formDate}
                      onChange={e => setFormDate(e.target.value)}
                      className="w-full bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      {isEs ? 'Hora aproximada' : 'Approximate time'}
                    </label>
                    <input
                      type="time"
                      value={formTime}
                      onChange={e => setFormTime(e.target.value)}
                      className="w-full bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Triggers */}
                <div>
                  <label className="text-[11px] font-black uppercase text-amber-300 tracking-wider block mb-1.5">
                    {isEs ? '¿CUÁL FUE EL DESENCADENANTE? (Selecciona varios)' : 'TRIGGERS INVOLVED'}
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {COMMON_TRIGGERS.map(trig => {
                      const label = isEs ? trig.label : trig.labelEn;
                      const selected = formTriggers.includes(label);
                      return (
                        <button
                          type="button"
                          key={trig.id}
                          onClick={() => handleToggleTrigger(label)}
                          className={`text-xs px-2.5 py-1.5 rounded-xl border transition-all text-left cursor-pointer ${
                            selected 
                              ? 'bg-amber-500/25 border-amber-400 text-white font-bold'
                              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom trigger input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customTrigger}
                      onChange={e => setCustomTrigger(e.target.value)}
                      placeholder={isEs ? 'Añadir otro detonante personalizado...' : 'Add custom trigger...'}
                      className="flex-1 bg-black/30 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomTrigger}
                      className="px-3 py-1.5 rounded-xl bg-white/10 text-cyan-300 text-xs font-bold"
                    >
                      {isEs ? '+ Añadir' : '+ Add'}
                    </button>
                  </div>
                </div>

                {/* Relief Strategies */}
                <div>
                  <label className="text-[11px] font-black uppercase text-emerald-300 tracking-wider block mb-1.5">
                    {isEs ? '¿QUÉ TE AYUDÓ A SALIR O RECUPERARTE?' : 'WHAT HELPED YOU RECOVER?'}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {COMMON_RELIEF.map(rel => {
                      const label = isEs ? rel.label : rel.labelEn;
                      const selected = formRelief.includes(label);
                      return (
                        <button
                          type="button"
                          key={rel.id}
                          onClick={() => handleToggleRelief(label)}
                          className={`text-xs px-2.5 py-1.5 rounded-xl border transition-all text-left cursor-pointer ${
                            selected 
                              ? 'bg-emerald-500/25 border-emerald-400 text-white font-bold'
                              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    {isEs ? 'Notas / Reflexión adicional (opcional)' : 'Notes / Reflection (optional)'}
                  </label>
                  <textarea
                    rows={2}
                    value={formNotes}
                    onChange={e => setFormNotes(e.target.value)}
                    placeholder={isEs ? 'Dónde estabas, qué sentiste antes de colapsar...' : 'Context, sensations prior to overload...'}
                    className="w-full bg-black/40 border border-white/20 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl active:scale-98 transition-all cursor-pointer"
                >
                  {isEs ? 'Guardar en mi Bitácora' : 'Save to Journal'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
