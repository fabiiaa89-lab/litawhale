import { useState, useRef, useEffect, FormEvent } from 'react';
import Header from '../Header';
import { motion, AnimatePresence } from 'motion/react';
import { Med, Language } from '../../types';
import { i18n } from '../../i18n';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Check, 
  RotateCcw, 
  Sparkles, 
  Clock, 
  Droplets, 
  X, 
  Zap, 
  Sun, 
  Moon, 
  HelpCircle,
  AlertTriangle
} from 'lucide-react';

import { hapticEngine } from '../../utils/hapticEngine';

interface MedsProps {
  meds: Med[];
  language: Language;
  onUpdateMeds?: (meds: Med[]) => void;
  onConfirm?: (index: number) => void;
  onAdd?: (med: Med) => void;
  onBack: () => void;
}

const PRESET_ICONS = [
  { id: 'capsule', label: '💊 Cápsula / Pill', emoji: '💊' },
  { id: 'tablet', label: '⚪ Comprimido / Tablet', emoji: '⚪' },
  { id: 'drops', label: '💧 Gotas / Liquid', emoji: '💧' },
  { id: 'supplement', label: '🌿 Natural / Supp', emoji: '🌿' },
  { id: 'sos', label: '🚨 SOS Rápido', emoji: '🚨' },
];

export default function Meds({ meds, language, onUpdateMeds, onConfirm, onAdd, onBack }: MedsProps) {
  const t = i18n[language].meds;

  const [activeModal, setActiveModal] = useState<'add' | 'edit' | null>(null);
  const [editingMed, setEditingMed] = useState<Med | null>(null);
  const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);
  const [celebratingMedId, setCelebratingMedId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    dose: '',
    time: '',
    icon: 'capsule'
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      dose: '',
      time: language === 'es' ? 'Mañana · 08:00' : 'Morning · 08:00',
      icon: 'capsule'
    });
    setActiveModal('add');
  };

  const handleOpenEdit = (med: Med) => {
    setEditingMed(med);
    setFormData({
      name: med.name,
      dose: med.dose,
      time: med.time,
      icon: med.icon || 'capsule'
    });
    setActiveModal('edit');
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (activeModal === 'add') {
      const newMed: Med = {
        id: 'med-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        name: formData.name.trim(),
        dose: formData.dose.trim() || '1 dosis',
        time: formData.time.trim() || (language === 'es' ? 'Cuando sea necesario' : 'When needed'),
        confirmed: false,
        icon: formData.icon
      };

      if (onUpdateMeds) {
        onUpdateMeds([...meds, newMed]);
      } else if (onAdd) {
        onAdd(newMed);
      }
    } else if (activeModal === 'edit' && editingMed) {
      const updated = meds.map(m => m.id === editingMed.id ? {
        ...m,
        name: formData.name.trim(),
        dose: formData.dose.trim() || '1 dosis',
        time: formData.time.trim() || m.time,
        icon: formData.icon
      } : m);

      if (onUpdateMeds) {
        onUpdateMeds(updated);
      }
    }

    setActiveModal(null);
    setEditingMed(null);
  };

  const handleDelete = (id: string) => {
    const updated = meds.filter(m => m.id !== id);
    if (onUpdateMeds) {
      onUpdateMeds(updated);
    }
    setDeleteCandidateId(null);
  };

  const handleConfirmIntake = (id: string) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString(language === 'es' ? 'es-ES' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

    // Sensory haptic feedback
    hapticEngine.triggerImpact('heavy');

    setCelebratingMedId(id);
    setTimeout(() => setCelebratingMedId(null), 3000);

    const updated = meds.map((m, idx) => {
      if (m.id === id || (!m.id && idx.toString() === id)) {
        return {
          ...m,
          confirmed: true,
          takenAt: timeString
        };
      }
      return m;
    });

    if (onUpdateMeds) {
      onUpdateMeds(updated);
    } else if (onConfirm) {
      const index = meds.findIndex(m => m.id === id);
      if (index !== -1) onConfirm(index);
    }
  };

  const handleUndoIntake = (id: string) => {
    const updated = meds.map(m => {
      if (m.id === id) {
        return {
          ...m,
          confirmed: false,
          takenAt: undefined
        };
      }
      return m;
    });

    if (onUpdateMeds) {
      onUpdateMeds(updated);
    }
  };

  const getEmoji = (iconType?: string) => {
    switch (iconType) {
      case 'tablet': return '⚪';
      case 'drops': return '💧';
      case 'supplement': return '🌿';
      case 'sos': return '🚨';
      default: return '💊';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0f18] overflow-hidden relative">
      <Header title={t.title} onBack={onBack} />
      
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar pb-[max(5rem,calc(env(safe-area-inset-bottom,0px)+3.5rem))]">
      {/* Top Banner with Sensory Guidance */}
      <div className="px-6 pt-3 pb-2">
        <div className="bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-purple-950/40 border border-cyan-500/20 rounded-2xl p-4 shadow-lg flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 text-cyan-300">
            <Droplets size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-black text-cyan-300 uppercase tracking-wider">
              {language === 'es' ? 'Ritual de Ingesta & Hidratación' : 'Intake & Hydration Ritual'}
            </p>
            <p className="text-[11px] text-slate-400 font-semibold tracking-tight mt-0.5 leading-snug">
              {t.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Medication Cards List */}
      <div className="space-y-4 px-6 mt-3 flex-1">
        {meds.length === 0 ? (
          <div className="bg-white/5 border border-dashed border-white/10 rounded-3xl p-8 text-center my-6">
            <div className="w-16 h-16 rounded-2xl bg-white/5 mx-auto flex items-center justify-center text-3xl mb-4">
              💊
            </div>
            <p className="text-sm font-bold text-slate-400 mb-2">{t.none}</p>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mb-6">
              {language === 'es' 
                ? 'Agrega tus medicamentos diarios o de crisis para llevar un registro seguro y amigable.' 
                : 'Add your daily or crisis medications to keep a safe and friendly sensory log.'}
            </p>
            <button
              onClick={handleOpenAdd}
              className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider transition-all inline-flex items-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <Plus size={16} />
              <span>{t.add}</span>
            </button>
          </div>
        ) : (
          meds.map((med, idx) => {
            const medId = med.id || `med-${idx}`;
            const isCelebrating = celebratingMedId === medId;

            return (
              <motion.div
                key={medId}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`relative rounded-3xl border transition-all duration-300 p-5 shadow-xl overflow-hidden ${
                  med.confirmed
                    ? 'bg-gradient-to-br from-[#0e2a22]/80 via-[#112620]/60 to-[#0e1f1c]/90 border-emerald-500/40 shadow-emerald-950/30'
                    : 'bg-gradient-to-br from-[#161a2b]/90 via-[#1a1e33]/80 to-[#121524]/95 border-white/15 hover:border-cyan-500/40'
                }`}
              >
                {/* Celebration Overlay */}
                <AnimatePresence>
                  {isCelebrating && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-emerald-950/90 backdrop-blur-md z-20 flex flex-col items-center justify-center p-4 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1.2, rotate: 0 }}
                        transition={{ type: 'spring', damping: 12 }}
                        className="text-4xl mb-2"
                      >
                        ✨ 💧 ✨
                      </motion.div>
                      <p className="text-sm font-black text-emerald-300 uppercase tracking-wider">
                        {t.sensorySuccess}
                      </p>
                      <p className="text-[11px] text-emerald-400/80 font-bold mt-1">
                        {t.takenAt} {med.takenAt || 'ahora'}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Card Header: Info + Actions */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 border shadow-inner ${
                      med.confirmed 
                        ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300' 
                        : 'bg-cyan-500/15 border-cyan-400/30 text-cyan-300'
                    }`}>
                      {getEmoji(med.icon)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`font-black text-base uppercase tracking-tight truncate ${
                          med.confirmed ? 'text-emerald-300' : 'text-white'
                        }`}>
                          {med.name}
                        </h3>
                        {med.confirmed && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[9px] font-black text-emerald-300 uppercase tracking-widest flex items-center gap-1">
                            <Check size={10} />
                            <span>{t.taken}</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs font-bold text-slate-300 bg-white/5 px-2.5 py-0.5 rounded-lg border border-white/10">
                          {med.dose}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                          <Clock size={11} className="text-cyan-400 shrink-0" />
                          <span>{med.time}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Edit & Delete Buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(med)}
                      className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 active:scale-95 text-slate-400 hover:text-cyan-300 flex items-center justify-center transition-all border border-white/10"
                      title={t.edit}
                      aria-label={t.edit}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteCandidateId(medId)}
                      className="w-8 h-8 rounded-xl bg-white/5 hover:bg-rose-500/20 active:scale-95 text-slate-400 hover:text-rose-400 flex items-center justify-center transition-all border border-white/10"
                      title={t.delete}
                      aria-label={t.delete}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Intake Confirmation Body: Creative Neurodivergent Mechanism */}
                <div className="mt-5 pt-4 border-t border-white/10">
                  {med.confirmed ? (
                    <div className="flex items-center justify-between gap-3 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-3.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                          <Check size={16} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-emerald-300 uppercase tracking-tight truncate">
                            {t.taken}
                          </p>
                          <p className="text-[10px] text-emerald-400/80 font-bold">
                            {med.takenAt ? `${t.takenAt} ${med.takenAt}` : (language === 'es' ? 'Completado hoy' : 'Completed today')}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleUndoIntake(medId)}
                        className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 text-[10px] font-bold text-slate-300 hover:text-white transition-all flex items-center gap-1.5 border border-white/10 shrink-0"
                        title={t.undo}
                      >
                        <RotateCcw size={12} />
                        <span>{t.undo}</span>
                      </button>
                    </div>
                  ) : (
                    <SensoryIntakeSlider
                      language={language}
                      medName={med.name}
                      onConfirm={() => handleConfirmIntake(medId)}
                    />
                  )}
                </div>
              </motion.div>
            );
          })
        )}

        {/* Add Medication Button at bottom */}
        {meds.length > 0 && (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleOpenAdd}
            className="w-full py-4 px-6 rounded-3xl border-2 border-dashed border-cyan-500/30 hover:border-cyan-400 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-300 font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-cyan-950/20 mt-4 cursor-pointer"
          >
            <Plus size={18} />
            <span>{t.add}</span>
          </motion.button>
        )}
      </div>
      </div>

      {/* MODAL: Add / Edit Medication */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 22, stiffness: 260 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#141726] border border-white/20 rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center border border-cyan-500/30">
                    {activeModal === 'add' ? <Plus size={18} /> : <Pencil size={16} />}
                  </div>
                  <h3 className="font-black text-base text-white uppercase tracking-tight">
                    {activeModal === 'add' ? t.modal.addTitle : t.modal.editTitle}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 flex items-center justify-center transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
                    {t.modal.name} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t.modal.namePlaceholder}
                    className="w-full bg-white/5 border border-white/15 focus:border-cyan-400 rounded-2xl p-3.5 text-white text-sm font-bold outline-none transition-all placeholder:text-slate-500"
                    autoFocus
                  />
                </div>

                {/* Dose */}
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
                    {t.modal.dose}
                  </label>
                  <input
                    type="text"
                    value={formData.dose}
                    onChange={(e) => setFormData({ ...formData, dose: e.target.value })}
                    placeholder={t.modal.dosePlaceholder}
                    className="w-full bg-white/5 border border-white/15 focus:border-cyan-400 rounded-2xl p-3.5 text-white text-sm font-bold outline-none transition-all placeholder:text-slate-500"
                  />
                </div>

                {/* Time & Preset chips */}
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
                    {t.modal.time}
                  </label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder={t.modal.timePlaceholder}
                    className="w-full bg-white/5 border border-white/15 focus:border-cyan-400 rounded-2xl p-3.5 text-white text-sm font-bold outline-none transition-all placeholder:text-slate-500 mb-2"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      t.modal.presetMorning,
                      t.modal.presetAfternoon,
                      t.modal.presetNight,
                      t.modal.presetSos
                    ].map((preset, pIdx) => (
                      <button
                        type="button"
                        key={pIdx}
                        onClick={() => setFormData({ ...formData, time: preset })}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all border ${
                          formData.time === preset
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50'
                            : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Icon selector */}
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
                    {t.modal.iconLabel}
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {PRESET_ICONS.map((ic) => (
                      <button
                        type="button"
                        key={ic.id}
                        onClick={() => setFormData({ ...formData, icon: ic.id })}
                        className={`py-3 rounded-2xl flex flex-col items-center justify-center gap-1 border transition-all text-xl ${
                          formData.icon === ic.id
                            ? 'bg-cyan-500/20 border-cyan-400 text-white scale-105 shadow-md shadow-cyan-500/20'
                            : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <span>{ic.emoji}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="flex-1 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs uppercase tracking-wider transition-all border border-white/10"
                  >
                    {t.modal.cancel}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-cyan-500/25 active:scale-98"
                  >
                    {activeModal === 'add' ? t.modal.save : t.modal.update}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Alert */}
      <AnimatePresence>
        {deleteCandidateId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setDeleteCandidateId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xs bg-[#16131c] border border-rose-500/30 rounded-3xl p-6 shadow-2xl text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto mb-3">
                <AlertTriangle size={22} />
              </div>
              <h4 className="text-sm font-black text-white uppercase tracking-tight mb-1">
                {t.deleteConfirm}
              </h4>
              <p className="text-xs text-slate-400 mb-5">
                {language === 'es' ? 'Esta acción eliminará el registro de este medicamento.' : 'This will remove this medication from your schedule.'}
              </p>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setDeleteCandidateId(null)}
                  className="flex-1 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs uppercase tracking-wider"
                >
                  {t.modal.cancel}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(deleteCandidateId)}
                  className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-rose-600/30"
                >
                  {t.delete}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Creative Sensory Intake Slider / Press Interaction:
 * Provides a tactile water-stream slide track where the user drags the floating pill capsule
 * across water waves to safely confirm intake with calming audio/haptic cues.
 */
function SensoryIntakeSlider({
  language,
  medName,
  onConfirm
}: {
  language: Language;
  medName: string;
  onConfirm: () => void;
}) {
  const t = i18n[language].meds;
  const [slideProgress, setSlideProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Press & Hold Handler
  useEffect(() => {
    if (isHolding) {
      const startTime = Date.now();
      const DURATION = 1200; // 1.2s hold

      holdIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const p = Math.min(100, Math.round((elapsed / DURATION) * 100));
        setHoldProgress(p);

        if (p >= 100) {
          if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
          setIsHolding(false);
          setHoldProgress(0);
          onConfirm();
        }
      }, 30);
    } else {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
      setHoldProgress(0);
    }

    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, [isHolding, onConfirm]);

  return (
    <div className="space-y-3">
      {/* Visual Interactive Slider Track */}
      <div className="relative w-full h-14 bg-black/40 rounded-2xl border border-cyan-500/25 p-1.5 flex items-center overflow-hidden group shadow-inner">
        {/* Glowing Water Flow Background with dynamic width */}
        <motion.div
          className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-cyan-600/40 via-sky-500/50 to-emerald-500/50 backdrop-blur-sm rounded-2xl"
          style={{ width: `${Math.max(slideProgress, holdProgress)}%` }}
        />

        {/* Ambient Prompt in track center */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4">
          <span className="text-[11px] font-black text-cyan-300/80 uppercase tracking-widest flex items-center gap-1.5 drop-shadow-sm">
            <span>{t.slidePrompt}</span>
            <span className="animate-pulse">➔</span>
          </span>
        </div>

        {/* Right Destination Goal: Water Cup */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 pointer-events-none">
          <Droplets size={16} className="text-cyan-400 animate-bounce" />
        </div>

        {/* Native Touch & Drag Range Input for 100% Mobile/Desktop Responsiveness */}
        <input
          type="range"
          min="0"
          max="100"
          value={slideProgress}
          onChange={(e) => {
            const val = Number(e.target.value);
            setSlideProgress(val);
            if (val >= 90) {
              setSlideProgress(0);
              onConfirm();
            }
          }}
          onMouseUp={() => {
            if (slideProgress < 90) setSlideProgress(0);
          }}
          onTouchEnd={() => {
            if (slideProgress < 90) setSlideProgress(0);
          }}
          className="w-full h-full opacity-0 absolute inset-0 z-10 cursor-grab active:cursor-grabbing"
          aria-label={t.slidePrompt}
        />

        {/* Draggable Capsule Indicator */}
        <motion.div
          className="relative z-0 h-11 w-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/40 border border-cyan-200 pointer-events-none"
          style={{
            marginLeft: `calc(${slideProgress}% * 0.82)`
          }}
        >
          <span className="text-base select-none">💊</span>
        </motion.div>
      </div>

      {/* Alternative Quick Water Sip Button with Hold Animation */}
      <div className="flex items-center gap-2">
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onMouseDown={() => setIsHolding(true)}
          onMouseUp={() => setIsHolding(false)}
          onMouseLeave={() => setIsHolding(false)}
          onTouchStart={() => setIsHolding(true)}
          onTouchEnd={() => setIsHolding(false)}
          onClick={() => {
            // Instant click fallback
            onConfirm();
          }}
          className="relative w-full py-3 px-4 rounded-2xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 text-cyan-300 font-black text-xs uppercase tracking-wider overflow-hidden transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
        >
          {/* Progress fill on hold */}
          <div
            className="absolute left-0 top-0 bottom-0 bg-cyan-500/30 transition-all"
            style={{ width: `${holdProgress}%` }}
          />

          <Droplets size={15} className="text-cyan-400 shrink-0" />
          <span className="relative z-10">{t.drinkWater}</span>
        </motion.button>
      </div>
    </div>
  );
}
