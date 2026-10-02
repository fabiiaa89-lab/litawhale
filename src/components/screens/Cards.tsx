import React, { useState } from 'react';
import Header from '../Header';
import { motion, AnimatePresence } from 'motion/react';
import { AACCard, Language } from '../../types';
import { i18n } from '../../i18n';
import { Plus, Edit2, Trash2, Sparkles, X, SlidersHorizontal, ChevronDown, RotateCcw, Check } from 'lucide-react';

interface CardsProps {
  language: Language;
  cards: AACCard[];
  onUpdateCards: (cards: AACCard[]) => void;
  onBack: () => void;
  onShowFull: (card: AACCard) => void;
}

const EMOJI_PRESETS = [
  '🗣️', '🛑', '🤫', '⏳', '🎧', '💧', '🧠', '⚡', 
  '🆘', '🫂', '🏠', '🧘', '🧱', '🚫', '🚪', '💤', 
  '🥤', '💊', '👂', '👁️', '🩹', '🧩', '🕯️', '🌿'
];

export default function Cards({ language, cards, onUpdateCards, onBack, onShowFull }: CardsProps) {
  const t = i18n[language].cards;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<AACCard | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [manageMode, setManageMode] = useState<'edit' | 'delete' | null>(null);

  // Form states
  const [formIcon, setFormIcon] = useState('🗣️');
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
    setFormIcon('🗣️');
    setFormLabel('');
    setFormText('');
    setIsModalOpen(true);
  };

  const openEditModal = (card: AACCard) => {
    setEditingCard(card);
    setFormIcon(card.icon);
    setFormLabel(card.label);
    setFormText(card.text);
    setIsModalOpen(true);
  };

  const handleDeleteCard = (id: string) => {
    if (confirm(t.deleteConfirm || (language === 'es' ? '¿Deseas eliminar esta tarjeta?' : 'Do you want to delete this card?'))) {
      onUpdateCards(cards.filter(c => c.id !== id));
    }
  };

  const handleRestoreDefaults = () => {
    if (confirm(language === 'es' ? '¿Restaurar las tarjetas predeterminadas originales?' : 'Restore original default cards?')) {
      onUpdateCards(i18n[language].aacCards);
    }
  };

  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formLabel.trim() || !formText.trim()) return;

    if (editingCard) {
      // Update existing
      const updated = cards.map(c => 
        c.id === editingCard.id 
          ? { ...c, icon: formIcon || '🗣️', label: formLabel.trim(), text: formText.trim(), isCustom: true } 
          : c
      );
      onUpdateCards(updated);
    } else {
      // Create new
      const newCard: AACCard = {
        id: 'custom-' + Date.now(),
        icon: formIcon || '🗣️',
        label: formLabel.trim(),
        text: formText.trim(),
        isCustom: true
      };
      onUpdateCards([...cards, newCard]);
    }

    setIsModalOpen(false);
    setEditingCard(null);
  };

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">
      <Header title={t.title} onBack={onBack} />
      
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar pb-[max(5rem,calc(env(safe-area-inset-bottom,0px)+3.5rem))]">
      {/* Subtitle & Manage Dropdown Action */}
      <div className="px-6 mt-4 flex items-center justify-between gap-3">
        <div className="min-w-0 pr-2">
          <p className="text-xs text-slate-300 font-normal leading-relaxed">
            {language === 'es' 
              ? 'Toca cualquier tarjeta para comunicarte en pantalla completa.' 
              : 'Tap any card to communicate in full screen.'}
          </p>
        </div>

        {/* Dropdown Menu Button */}
        <div className="relative shrink-0">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-slate-200 hover:text-white text-xs font-medium flex items-center gap-2 backdrop-blur-xl transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <SlidersHorizontal size={14} className="text-cyan-400" />
            <span>{language === 'es' ? 'Gestionar' : 'Manage'}</span>
            <ChevronDown size={14} className={`text-slate-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
          </motion.button>

          <AnimatePresence>
            {isMenuOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setIsMenuOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-52 bg-[#161826] border border-white/15 rounded-2xl p-1.5 shadow-2xl z-40 flex flex-col gap-1 backdrop-blur-2xl"
                >
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setManageMode(null);
                      openAddModal();
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left text-xs font-medium text-slate-200 hover:text-white hover:bg-white/10 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <Plus size={15} className="text-cyan-400" />
                    <span>{language === 'es' ? 'Crear tarjeta' : 'Create card'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setManageMode('edit');
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left text-xs font-medium text-slate-200 hover:text-white hover:bg-white/10 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <Edit2 size={14} className="text-indigo-400" />
                    <span>{language === 'es' ? 'Editar tarjeta' : 'Edit card'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setManageMode('delete');
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left text-xs font-medium text-rose-300 hover:text-rose-200 hover:bg-rose-500/10 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <Trash2 size={14} className="text-rose-400" />
                    <span>{language === 'es' ? 'Eliminar tarjeta' : 'Delete card'}</span>
                  </button>
                  <div className="h-px bg-white/10 my-0.5" />
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setManageMode(null);
                      handleRestoreDefaults();
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw size={13} className="text-slate-400" />
                    <span>{language === 'es' ? 'Restaurar originales' : 'Restore defaults'}</span>
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
            className={`mx-6 mt-3 p-3 rounded-2xl flex items-center justify-between text-xs font-medium border ${
              manageMode === 'edit'
                ? 'bg-indigo-950/50 border-indigo-500/40 text-indigo-200'
                : 'bg-rose-950/50 border-rose-500/40 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {manageMode === 'edit' ? <Edit2 size={14} className="text-indigo-400" /> : <Trash2 size={14} className="text-rose-400" />}
              <span>
                {manageMode === 'edit'
                  ? (language === 'es' ? 'Toca la tarjeta que deseas editar' : 'Tap the card you want to edit')
                  : (language === 'es' ? 'Toca la tarjeta que deseas eliminar' : 'Tap the card you want to delete')}
              </span>
            </div>
            <button
              onClick={() => setManageMode(null)}
              className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition-colors cursor-pointer"
            >
              {language === 'es' ? 'Cancelar' : 'Cancel'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cards Grid: Clean, minimalist, and uncluttered */}
      <div className="grid grid-cols-2 gap-3.5 px-6 mt-4">
        {cards.map(rawCard => {
          const card = resolveCard(rawCard);
          const isEditSelectable = manageMode === 'edit';
          const isDeleteSelectable = manageMode === 'delete';

          return (
            <motion.div 
              key={card.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
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
              className={`group relative rounded-3xl p-4 flex flex-col items-center justify-between text-center gap-2 cursor-pointer transition-all shadow-md min-h-[160px] border ${
                isEditSelectable
                  ? 'bg-indigo-500/15 border-indigo-400/50 hover:border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.25)] ring-1 ring-indigo-400/30'
                  : isDeleteSelectable
                  ? 'bg-rose-500/15 border-rose-400/50 hover:border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.25)] ring-1 ring-rose-400/30'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 hover:border-white/20'
              }`}
            >
              {/* Top subtle category tag */}
              <div className="w-full flex items-center justify-between">
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 font-medium">
                  {card.isCustom ? (language === 'es' ? 'Personalizada' : 'Custom') : 'AAC'}
                </span>
                {manageMode === 'edit' && (
                  <span className="text-[10px] text-indigo-400 font-bold flex items-center gap-1">
                    <Edit2 size={10} /> {language === 'es' ? 'Editar' : 'Edit'}
                  </span>
                )}
                {manageMode === 'delete' && (
                  <span className="text-[10px] text-rose-400 font-bold flex items-center gap-1">
                    <Trash2 size={10} /> {language === 'es' ? 'Borrar' : 'Delete'}
                  </span>
                )}
              </div>

              {/* Icon */}
              <div className="text-4xl my-1 group-hover:scale-110 transition-transform drop-shadow">
                {card.icon}
              </div>

              {/* Label & Text */}
              <div className="w-full">
                <div className="font-bold tracking-tight text-white text-xs sm:text-sm leading-snug line-clamp-2">
                  {card.label}
                </div>
                <p className="text-[10px] text-slate-400 line-clamp-2 mt-1 font-normal opacity-75">
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
              className="bg-[#1a1c2c] border border-white/20 rounded-[32px] p-6 w-full max-w-md shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg tracking-tight">
                      {editingCard ? (t.edit || 'Editar Tarjeta') : (t.add || 'Crear Tarjeta')}
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5 font-normal">
                      {language === 'es' ? 'Configura el texto para mostrar a otras personas' : 'Configure the text to show to others'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSaveCard} className="space-y-5">
                {/* Emoji Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-200 block">
                    {t.modal?.iconLabel || 'Icono / Emoji'}
                  </label>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-3xl shrink-0 shadow-inner">
                      {formIcon || '🗣️'}
                    </div>
                    <input
                      type="text"
                      value={formIcon}
                      onChange={(e) => setFormIcon(e.target.value)}
                      placeholder="Icono"
                      maxLength={4}
                      className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center text-xl text-white font-bold w-24 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  {/* Preset Emojis */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {EMOJI_PRESETS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setFormIcon(emoji)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all ${formIcon === emoji ? 'bg-cyan-500/30 border-2 border-cyan-400 scale-110' : 'bg-white/5 hover:bg-white/15 border border-white/10'}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title / Label */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-200 block">
                    {t.modal?.titleLabel || 'Título / Etiqueta'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formLabel}
                    onChange={(e) => setFormLabel(e.target.value)}
                    placeholder={t.modal?.titlePlaceholder || 'Ej: Sobrecarga Sensorial, Necesito Silencio'}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 text-white text-sm font-medium focus:outline-none focus:border-cyan-400 transition-colors placeholder:text-slate-500"
                  />
                </div>

                {/* Full Message */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-200 block">
                    {t.modal?.textLabel || 'Mensaje para Pantalla Completa'}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formText}
                    onChange={(e) => setFormText(e.target.value)}
                    placeholder={t.modal?.textPlaceholder || 'Ej: Estoy experimentando una crisis sensorial. Por favor, no me hables ni me toques. Necesito 15 minutos de silencio.'}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 text-white text-sm font-normal focus:outline-none focus:border-cyan-400 transition-colors resize-none leading-relaxed placeholder:text-slate-500"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    {language === 'es' ? 'Este texto se mostrará en tamaño gigante al tocar la tarjeta.' : 'This text will be shown in large font when the card is tapped.'}
                  </p>
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-semibold text-sm transition-colors cursor-pointer"
                  >
                    {t.cancel || 'Cancelar'}
                  </button>
                  <button
                    type="submit"
                    className="py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Check size={16} className="stroke-[2.5]" />
                    <span>{editingCard ? (t.update || 'Guardar') : (t.save || 'Crear')}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
