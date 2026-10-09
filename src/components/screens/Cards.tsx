import React, { useState } from 'react';
import Header from '../Header';
import { motion, AnimatePresence } from 'motion/react';
import { AACCard, Language } from '../../types';
import { i18n } from '../../i18n';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Sparkles, 
  X, 
  SlidersHorizontal, 
  ChevronDown, 
  RotateCcw, 
  EyeOff,
  MessageSquareOff,
  ShieldAlert,
  Hourglass,
  HeartHandshake,
  HeartPulse,
  MessageSquareHeart,
  VolumeX,
  Hand,
  Droplets,
  Utensils,
  Bed,
  Moon,
  Volume2
} from 'lucide-react';

interface CardsProps {
  language: Language;
  cards: AACCard[];
  onUpdateCards: (cards: AACCard[]) => void;
  onBack: () => void;
  onShowFull: (card: AACCard) => void;
}

const VECTOR_PRESETS = [
  { id: 'noverbal', iconName: 'MessageSquareOff', labelEs: 'No verbal', labelEn: 'Non-verbal' },
  { id: 'meltdown', iconName: 'ShieldAlert', labelEs: 'Sobrecarga', labelEn: 'Overload' },
  { id: 'noise', iconName: 'VolumeX', labelEs: 'Ruido', labelEn: 'Noise' },
  { id: 'space', iconName: 'Hand', labelEs: 'Espacio', labelEn: 'Space' },
  { id: 'water', iconName: 'Droplets', labelEs: 'Agua', labelEn: 'Water' },
  { id: 'food', iconName: 'Utensils', labelEs: 'Comida', labelEn: 'Food' },
  { id: 'rest', iconName: 'Bed', labelEs: 'Descanso', labelEn: 'Rest' },
  { id: 'slow', iconName: 'Hourglass', labelEs: 'Tiempo', labelEn: 'Time' },
  { id: 'dissoc', iconName: 'EyeOff', labelEs: 'Disociación', labelEn: 'Dissociation' },
  { id: 'cave', iconName: 'Moon', labelEs: 'Cueva', labelEn: 'Cave' },
  { id: 'bathroom', iconName: 'Sparkles', labelEs: 'Baño', labelEn: 'Restroom' },
  { id: 'med', iconName: 'HeartPulse', labelEs: 'Médico', labelEn: 'Medical' },
];

export default function Cards({ language, cards, onUpdateCards, onBack, onShowFull }: CardsProps) {
  const isEs = language === 'es';
  const t = i18n[language].cards;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<AACCard | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [manageMode, setManageMode] = useState<'edit' | 'delete' | null>(null);
  const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);
  const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState(false);

  // Form states
  const [formIcon, setFormIcon] = useState('MessageSquareOff');
  const [formLabel, setFormLabel] = useState('');
  const [formText, setFormText] = useState('');

  // Dynamically resolve default cards according to active language
  const resolveCard = (card: AACCard): AACCard => {
    if (card.isCustom) return card;
    const defaultCard = i18n[language].aacCards.find(c => c.id === card.id);
    if (defaultCard) {
      return { ...card, label: defaultCard.label, text: defaultCard.text, icon: defaultCard.icon };
    }
    return card;
  };

  const openAddModal = () => {
    setEditingCard(null);
    setFormIcon('MessageSquareOff');
    setFormLabel('');
    setFormText('');
    setIsModalOpen(true);
  };

  const openEditModal = (card: AACCard) => {
    setEditingCard(card);
    setFormIcon(card.icon || 'MessageSquareOff');
    setFormLabel(card.label);
    setFormText(card.text);
    setIsModalOpen(true);
  };

  const handleDeleteCard = (id: string) => {
    setDeleteCandidateId(id);
  };

  const confirmDeleteCard = () => {
    if (deleteCandidateId) {
      onUpdateCards(cards.filter(c => c.id !== deleteCandidateId));
      setDeleteCandidateId(null);
    }
  };

  const handleRestoreDefaults = () => {
    setIsRestoreConfirmOpen(true);
  };

  const confirmRestoreDefaults = () => {
    onUpdateCards(i18n[language].aacCards);
    setIsRestoreConfirmOpen(false);
  };

  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formLabel.trim() || !formText.trim()) return;

    if (editingCard) {
      // Update existing
      const updated = cards.map(c => 
        c.id === editingCard.id 
          ? { ...c, icon: formIcon || 'MessageSquareOff', label: formLabel.trim(), text: formText.trim(), isCustom: true } 
          : c
      );
      onUpdateCards(updated);
    } else {
      // Create new
      const newCard: AACCard = {
        id: 'custom-' + Date.now(),
        icon: formIcon || 'MessageSquareOff',
        label: formLabel.trim(),
        text: formText.trim(),
        isCustom: true
      };
      onUpdateCards([...cards, newCard]);
    }

    setIsModalOpen(false);
  };

  // Dedicated Vector Lucide Duotone Icon Resolver for AAC Cards
  const renderCardIcon = (card: AACCard) => {
    // Check known IDs or icon names
    const target = card.id || card.icon;

    switch (target) {
      case 'noverbal':
      case 'MessageSquareOff':
        return (
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-purple-500/20 dark:bg-purple-500/20 light:bg-purple-100 border border-purple-400/35 dark:border-purple-400/35 light:border-purple-300 flex items-center justify-center text-purple-300 dark:text-purple-300 light:text-purple-700 shadow-sm">
            <MessageSquareOff size={26} />
          </div>
        );
      case 'meltdown':
      case 'ShieldAlert':
        return (
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-rose-500/20 dark:bg-rose-500/20 light:bg-rose-100 border border-rose-400/35 dark:border-rose-400/35 light:border-rose-300 flex items-center justify-center text-rose-300 dark:text-rose-300 light:text-rose-700 shadow-sm">
            <ShieldAlert size={26} />
          </div>
        );
      case 'noise':
      case 'VolumeX':
        return (
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-blue-500/20 dark:bg-blue-500/20 light:bg-blue-100 border border-blue-400/35 dark:border-blue-400/35 light:border-blue-300 flex items-center justify-center text-blue-300 dark:text-blue-300 light:text-blue-700 shadow-sm">
            <VolumeX size={26} />
          </div>
        );
      case 'space':
      case 'Hand':
        return (
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-amber-500/20 dark:bg-amber-500/20 light:bg-amber-100 border border-amber-400/35 dark:border-amber-400/35 light:border-amber-300 flex items-center justify-center text-amber-300 dark:text-amber-300 light:text-amber-800 shadow-sm">
            <Hand size={26} />
          </div>
        );
      case 'water':
      case 'Droplets':
        return (
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-cyan-500/20 dark:bg-cyan-500/20 light:bg-cyan-100 border border-cyan-400/35 dark:border-cyan-400/35 light:border-cyan-300 flex items-center justify-center text-cyan-300 dark:text-cyan-300 light:text-cyan-800 shadow-sm">
            <Droplets size={26} />
          </div>
        );
      case 'food':
      case 'Utensils':
        return (
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-emerald-500/20 dark:bg-emerald-500/20 light:bg-emerald-100 border border-emerald-400/35 dark:border-emerald-400/35 light:border-emerald-300 flex items-center justify-center text-emerald-300 dark:text-emerald-300 light:text-emerald-800 shadow-sm">
            <Utensils size={26} />
          </div>
        );
      case 'rest':
      case 'Bed':
        return (
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-indigo-500/20 dark:bg-indigo-500/20 light:bg-indigo-100 border border-indigo-400/35 dark:border-indigo-400/35 light:border-indigo-300 flex items-center justify-center text-indigo-300 dark:text-indigo-300 light:text-indigo-700 shadow-sm">
            <Bed size={26} />
          </div>
        );
      case 'slow':
      case 'Hourglass':
        return (
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-amber-500/20 dark:bg-amber-500/20 light:bg-amber-100 border border-amber-400/35 dark:border-amber-400/35 light:border-amber-300 flex items-center justify-center text-amber-300 dark:text-amber-300 light:text-amber-800 shadow-sm">
            <Hourglass size={26} />
          </div>
        );
      case 'dissoc':
      case 'EyeOff':
        return (
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-indigo-500/20 dark:bg-indigo-500/20 light:bg-indigo-100 border border-indigo-400/35 dark:border-indigo-400/35 light:border-indigo-300 flex items-center justify-center text-indigo-300 dark:text-indigo-300 light:text-indigo-700 shadow-sm">
            <EyeOff size={26} />
          </div>
        );
      case 'cave':
      case 'Moon':
        return (
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-slate-700/40 dark:bg-slate-700/40 light:bg-slate-200 border border-slate-500/35 dark:border-slate-500/35 light:border-slate-300 flex items-center justify-center text-sky-300 dark:text-sky-300 light:text-slate-800 shadow-sm">
            <Moon size={26} />
          </div>
        );
      case 'bathroom':
      case 'Sparkles':
        return (
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-teal-500/20 dark:bg-teal-500/20 light:bg-teal-100 border border-teal-400/35 dark:border-teal-400/35 light:border-teal-300 flex items-center justify-center text-teal-300 dark:text-teal-300 light:text-teal-800 shadow-sm">
            <Sparkles size={26} />
          </div>
        );
      case 'med':
      case 'HeartPulse':
        return (
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-rose-500/20 dark:bg-rose-500/20 light:bg-rose-100 border border-rose-400/35 dark:border-rose-400/35 light:border-rose-300 flex items-center justify-center text-rose-300 dark:text-rose-300 light:text-rose-700 shadow-sm">
            <HeartPulse size={26} />
          </div>
        );
      default:
        return (
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-cyan-500/20 dark:bg-cyan-500/20 light:bg-cyan-100 border border-cyan-400/35 dark:border-cyan-400/35 light:border-cyan-300 flex items-center justify-center text-2xl shadow-sm">
            {card.icon}
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">
      <Header title={t.title} onBack={onBack} />

      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-4 sm:px-6 pt-3 pb-[max(5rem,calc(env(safe-area-inset-bottom,0px)+3.5rem))] space-y-4">
        
        {/* Intro Sanctuary Card & Action Controls */}
        <div className="p-4 rounded-3xl bg-teal-500/10 dark:bg-teal-500/10 light:bg-white border border-teal-400/25 dark:border-teal-400/25 light:border-teal-200 shadow-md flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 dark:bg-teal-500/20 light:bg-teal-100 border border-teal-400/30 dark:border-teal-400/30 light:border-teal-300 flex items-center justify-center shrink-0">
              <MessageSquareHeart size={20} className="text-teal-400 dark:text-teal-400 light:text-teal-700" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-white dark:text-white light:text-slate-900 tracking-tight leading-tight">
                {isEs ? 'Comunicador CAA Expresivo' : 'Expressive AAC Communicator'}
              </h2>
              <p className="text-[11px] text-teal-300/90 dark:text-teal-300/90 light:text-slate-600 font-medium leading-snug truncate">
                {isEs ? 'Toca cualquier tarjeta para pantalla completa y voz' : 'Tap any card for full-screen voice'}
              </p>
            </div>
          </div>

          {/* Manage Actions Dropdown */}
          <div className="relative shrink-0">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="px-3 py-2 rounded-xl bg-white/10 dark:bg-white/10 light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-300 text-slate-200 dark:text-slate-200 light:text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <SlidersHorizontal size={14} className="text-teal-400 dark:text-teal-400 light:text-teal-600" />
              <span>{isEs ? 'Gestionar' : 'Manage'}</span>
              <ChevronDown size={14} className={`transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
              {isMenuOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsMenuOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-52 bg-slate-900 dark:bg-slate-900 light:bg-white border border-white/15 dark:border-white/15 light:border-slate-200 rounded-2xl p-1.5 shadow-2xl z-40 flex flex-col gap-1 backdrop-blur-2xl"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setManageMode(null);
                        openAddModal();
                      }}
                      className="w-full px-3 py-2 rounded-xl text-left text-xs font-medium text-slate-200 dark:text-slate-200 light:text-slate-800 hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-slate-100 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <Plus size={15} className="text-teal-400 dark:text-teal-400 light:text-teal-600" />
                      <span>{isEs ? 'Crear tarjeta' : 'Create card'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setManageMode('edit');
                      }}
                      className="w-full px-3 py-2 rounded-xl text-left text-xs font-medium text-slate-200 dark:text-slate-200 light:text-slate-800 hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-slate-100 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <Edit2 size={14} className="text-indigo-400 dark:text-indigo-400 light:text-indigo-600" />
                      <span>{isEs ? 'Editar tarjeta' : 'Edit card'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setManageMode('delete');
                      }}
                      className="w-full px-3 py-2 rounded-xl text-left text-xs font-medium text-rose-300 dark:text-rose-300 light:text-rose-700 hover:bg-rose-500/10 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} className="text-rose-400 dark:text-rose-400 light:text-rose-600" />
                      <span>{isEs ? 'Eliminar tarjeta' : 'Delete card'}</span>
                    </button>
                    <div className="h-px bg-white/10 dark:bg-white/10 light:bg-slate-200 my-0.5" />
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setManageMode(null);
                        handleRestoreDefaults();
                      }}
                      className="w-full px-3 py-2 rounded-xl text-left text-xs font-medium text-slate-400 dark:text-slate-400 light:text-slate-600 hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-slate-100 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <RotateCcw size={13} className="text-slate-400" />
                      <span>{isEs ? 'Restaurar originales' : 'Restore defaults'}</span>
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Action banner when in edit or delete mode */}
        <AnimatePresence>
          {manageMode && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className={`p-3 rounded-2xl flex items-center justify-between text-xs font-medium border ${
                manageMode === 'edit'
                  ? 'bg-indigo-950/60 dark:bg-indigo-950/60 light:bg-indigo-50 border-indigo-500/40 text-indigo-200 dark:text-indigo-200 light:text-indigo-900'
                  : 'bg-rose-950/60 dark:bg-rose-950/60 light:bg-rose-50 border-rose-500/40 text-rose-200 dark:text-rose-200 light:text-rose-900'
              }`}
            >
              <div className="flex items-center gap-2">
                {manageMode === 'edit' ? <Edit2 size={14} className="text-indigo-400" /> : <Trash2 size={14} className="text-rose-400" />}
                <span>
                  {manageMode === 'edit'
                    ? (isEs ? 'Toca la tarjeta que deseas editar' : 'Tap the card you want to edit')
                    : (isEs ? 'Toca la tarjeta que deseas eliminar' : 'Tap the card you want to delete')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setManageMode(null)}
                className="px-2.5 py-1 rounded-xl bg-white/10 dark:bg-white/10 light:bg-slate-200 text-white dark:text-white light:text-slate-900 text-[11px] font-semibold transition-colors cursor-pointer"
              >
                {isEs ? 'Cancelar' : 'Cancel'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cards Grid: Clean, Unified, Option A Oceanic Styling */}
        <div className="grid grid-cols-2 gap-3.5">
          {cards.map(rawCard => {
            const card = resolveCard(rawCard);
            const isEditSelectable = manageMode === 'edit';
            const isDeleteSelectable = manageMode === 'delete';

            return (
              <motion.div 
                key={card.id}
                layout
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  if (manageMode === 'edit') {
                    openEditModal(card);
                    setManageMode(null);
                  } else if (manageMode === 'delete') {
                    handleDeleteCard(card.id);
                    setManageMode(null);
                  } else {
                    onShowFull(card);
                  }
                }}
                className={`group rounded-3xl p-4 sm:p-5 flex flex-col items-center justify-between text-center gap-2.5 cursor-pointer transition-all shadow-md min-h-[175px] border ${
                  isEditSelectable
                    ? 'bg-indigo-500/20 border-2 border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.25)]'
                    : isDeleteSelectable
                    ? 'bg-rose-500/20 border-2 border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.25)]'
                    : 'bg-white/[0.04] dark:bg-white/[0.04] light:bg-white hover:bg-white/[0.07] border-white/10 dark:border-white/10 light:border-slate-200'
                }`}
              >
                {/* Category kicker */}
                <div className="w-full flex items-center justify-between">
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 dark:bg-white/5 light:bg-slate-100 text-slate-400 dark:text-slate-400 light:text-slate-600 font-bold uppercase tracking-wider">
                    {card.isCustom ? (isEs ? 'Personal' : 'Custom') : 'CAA'}
                  </span>
                  {manageMode === 'edit' && (
                    <span className="text-[10px] text-indigo-400 font-bold flex items-center gap-1">
                      <Edit2 size={10} /> {isEs ? 'Editar' : 'Edit'}
                    </span>
                  )}
                  {manageMode === 'delete' && (
                    <span className="text-[10px] text-rose-400 font-bold flex items-center gap-1">
                      <Trash2 size={10} /> {isEs ? 'Borrar' : 'Delete'}
                    </span>
                  )}
                </div>

                {/* Vector Duotone Icon Badge */}
                <div className="my-1 group-hover:scale-106 transition-transform">
                  {renderCardIcon(card)}
                </div>

                {/* Label & Text */}
                <div className="w-full">
                  <span className="font-bold tracking-tight text-white dark:text-white light:text-slate-900 text-xs sm:text-sm leading-snug line-clamp-2 block">
                    {card.label}
                  </span>
                  <p className="text-[10px] text-slate-300 dark:text-slate-300 light:text-slate-600 line-clamp-2 mt-1 leading-snug font-medium">
                    {card.text}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* Add / Edit Card Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ y: 50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 50, scale: 0.95 }}
              className="bg-slate-900 dark:bg-slate-900 light:bg-white border border-white/20 dark:border-white/20 light:border-slate-300 rounded-[32px] p-6 w-full max-w-md shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <div className="flex items-center justify-between border-b border-white/10 dark:border-white/10 light:border-slate-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-teal-500/20 text-teal-400 dark:text-teal-400 light:text-teal-700 flex items-center justify-center border border-teal-500/30">
                    <Sparkles size={18} />
                  </div>
                  <h3 className="font-bold text-white dark:text-white light:text-slate-900 text-base">
                    {editingCard 
                      ? (isEs ? 'Editar Tarjeta CAA' : 'Edit AAC Card') 
                      : (isEs ? 'Nueva Tarjeta CAA' : 'New AAC Card')}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveCard} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 dark:text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
                    {isEs ? 'Ícono Vectorial Recomendado' : 'Recommended Vector Icon'}
                  </label>
                  <div className="grid grid-cols-4 gap-2 p-2.5 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-200 max-h-36 overflow-y-auto no-scrollbar">
                    {VECTOR_PRESETS.map((preset) => {
                      const isSelected = formIcon === preset.id || formIcon === preset.iconName;
                      return (
                        <button
                          type="button"
                          key={preset.id}
                          onClick={() => setFormIcon(preset.id)}
                          className={`p-2 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-teal-500/30 border-2 border-teal-400 shadow-sm' 
                              : 'hover:bg-white/10'
                          }`}
                        >
                          <span className="text-teal-300 dark:text-teal-300 light:text-teal-700">
                            {renderCardIcon({ id: preset.id, icon: preset.iconName, label: '', text: '' })}
                          </span>
                          <span className="text-[9px] font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700 truncate w-full text-center">
                            {isEs ? preset.labelEs : preset.labelEn}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 dark:text-slate-300 light:text-slate-700 uppercase tracking-wider mb-1.5">
                    {isEs ? 'Título corto' : 'Short title'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formLabel}
                    onChange={e => setFormLabel(e.target.value)}
                    placeholder={isEs ? 'Ej. Necesito silencio' : 'e.g., I need silence'}
                    className="w-full px-4 py-3 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-300 text-white dark:text-white light:text-slate-900 text-sm focus:outline-none focus:border-teal-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 dark:text-slate-300 light:text-slate-700 uppercase tracking-wider mb-1.5">
                    {isEs ? 'Mensaje completo' : 'Full message'}
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formText}
                    onChange={e => setFormText(e.target.value)}
                    placeholder={isEs ? 'Explica lo que necesitas de forma clara y respetuosa...' : 'Explain what you need clearly...'}
                    className="w-full px-4 py-3 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-300 text-white dark:text-white light:text-slate-900 text-sm focus:outline-none focus:border-teal-400 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="py-3 px-4 rounded-xl bg-white/5 dark:bg-white/5 light:bg-slate-100 hover:bg-white/10 text-slate-300 dark:text-slate-300 light:text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    {isEs ? 'Cancelar' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="py-3 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-colors shadow-lg shadow-teal-500/20 cursor-pointer"
                  >
                    {isEs ? 'Guardar' : 'Save'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteCandidateId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[130] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 dark:bg-slate-900 light:bg-white border border-rose-500/30 rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
                <Trash2 size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900">
                  {isEs ? '¿Eliminar esta tarjeta?' : 'Delete this card?'}
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mt-1">
                  {isEs ? 'Esta acción no se puede deshacer.' : 'This action cannot be undone.'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteCandidateId(null)}
                  className="py-3 px-4 rounded-xl bg-white/5 dark:bg-white/5 light:bg-slate-100 hover:bg-white/10 text-slate-300 dark:text-slate-300 light:text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  {isEs ? 'Cancelar' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteCard}
                  className="py-3 px-4 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs uppercase tracking-wider transition-colors shadow-lg shadow-rose-500/20 cursor-pointer"
                >
                  {isEs ? 'Eliminar' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Restore Defaults Confirmation Modal */}
        {isRestoreConfirmOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[130] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 dark:bg-slate-900 light:bg-white border border-teal-500/30 rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mx-auto text-teal-400">
                <RotateCcw size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900">
                  {isEs ? '¿Restaurar tarjetas originales?' : 'Restore default cards?'}
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mt-1">
                  {isEs 
                    ? 'Se restablecerán las 12 tarjetas de comunicación estándar.' 
                    : 'The 12 standard communication cards will be restored.'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRestoreConfirmOpen(false)}
                  className="py-3 px-4 rounded-xl bg-white/5 dark:bg-white/5 light:bg-slate-100 hover:bg-white/10 text-slate-300 dark:text-slate-300 light:text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  {isEs ? 'Cancelar' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={confirmRestoreDefaults}
                  className="py-3 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-colors shadow-lg shadow-teal-500/20 cursor-pointer"
                >
                  {isEs ? 'Restaurar' : 'Restore'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
