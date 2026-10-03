/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Debt, Profile, Language } from '../../types';
import Header from '../Header';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Check, Trash2, Calendar, User, DollarSign, Edit2, X, Coins, Sparkles } from 'lucide-react';
import { i18n } from '../../i18n';

interface DebtsProps {
  debts: Debt[];
  language: Language;
  profile: Profile;
  onUpdate: (debts: Debt[]) => void;
  onBack: () => void;
}

export default function Debts({ debts, language, profile, onUpdate, onBack }: DebtsProps) {
  const t = i18n[language].debts;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);
  const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);

  // Form inputs
  const [creditor, setCreditor] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');

  const currencySymbol = profile.currencySymbol || '$';
  const currencyCode = profile.currency || 'USD';
  const isUsdDefault = currencyCode === 'USD';

  const openAddModal = () => {
    setEditingDebt(null);
    setCreditor('');
    setAmount('');
    setDueDate('');
    setIsModalOpen(true);
  };

  const openEditModal = (debt: Debt, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingDebt(debt);
    setCreditor(debt.creditor);
    setAmount(debt.amount);
    setDueDate(debt.dueDate || '');
    setIsModalOpen(true);
  };

  const handleSaveDebt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!creditor.trim() || !amount.trim()) return;

    if (editingDebt) {
      onUpdate(debts.map(d => d.id === editingDebt.id ? {
        ...d,
        creditor: creditor.trim(),
        amount: amount.trim(),
        dueDate: dueDate.trim()
      } : d));
    } else {
      const newDebt: Debt = {
        id: crypto.randomUUID(),
        creditor: creditor.trim(),
        amount: amount.trim(),
        dueDate: dueDate.trim(),
        isPaid: false
      };
      onUpdate([...debts, newDebt]);
    }

    setIsModalOpen(false);
    setEditingDebt(null);
  };

  const togglePaid = (id: string) => {
    onUpdate(debts.map(d => d.id === id ? { ...d, isPaid: !d.isPaid } : d));
  };

  const removeDebt = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDeleteCandidateId(id);
  };

  const confirmDelete = () => {
    if (deleteCandidateId) {
      onUpdate(debts.filter(d => d.id !== deleteCandidateId));
      setDeleteCandidateId(null);
    }
  };

  // Helper to accurately parse number supporting both dot and comma decimals
  const parseAmountToNumber = (val: string): number => {
    let clean = val.trim();
    if (clean.includes(',') && clean.includes('.')) {
      if (clean.lastIndexOf(',') > clean.lastIndexOf('.')) {
        clean = clean.replace(/\./g, '').replace(',', '.');
      } else {
        clean = clean.replace(/,/g, '');
      }
    } else if (clean.includes(',')) {
      clean = clean.replace(',', '.');
    }
    return parseFloat(clean.replace(/[^0-9.]/g, ''));
  };

  // Helper to format currency display
  const formatAmounts = (val: string) => {
    const numeric = parseAmountToNumber(val);
    if (isNaN(numeric)) {
      return { local: `${val} ${currencySymbol}`, usd: `${val} USD` };
    }
    const localFormatted = `${currencySymbol} ${numeric.toLocaleString(language === 'es' ? 'es-ES' : 'en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
    return {
      local: localFormatted,
      usd: isUsdDefault ? undefined : `$ ${numeric.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} USD`
    };
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-transparent">
      <Header title={t.title} onBack={onBack} />
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar pb-[max(5rem,calc(env(safe-area-inset-bottom,0px)+3.5rem))]">

      <div className="px-6 mt-6">
        {/* Logical Reinforcement Message */}
        <div className="glass-card rounded-[32px] p-6 mb-6 border-indigo-500/30 bg-indigo-950/20 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-50" />
          <p className="relative z-10 text-sm italic text-indigo-200 leading-relaxed font-medium">
            {t.quote}
          </p>
        </div>

        {/* Currency & Country Info banner */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-300 text-xs font-bold">
            <Coins size={15} className="text-cyan-400" />
            <span>
              {profile.country ? `${profile.country} · ` : ''}
              <span className="text-cyan-300">{currencySymbol} ({currencyCode})</span>
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold text-slate-400 px-2 py-0.5 rounded-lg bg-white/5">
            {language === 'es' ? 'Moneda local + USD' : 'Local + USD'}
          </span>
        </div>

        {/* List Header & Add Button */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[10px] uppercase tracking-[3px] text-slate-400 font-black">
            {t.history} ({debts.length})
          </h3>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={openAddModal}
            className="px-4 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 flex items-center gap-2 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
          >
            <Plus size={16} className="stroke-[3]" />
            <span>{t.add || 'Nuevo'}</span>
          </motion.button>
        </div>

        {/* Debts List */}
        <div className="space-y-4">
          {debts.length === 0 ? (
            <div className="text-center py-12 opacity-40">
              <p className="text-sm">{t.noDebts}</p>
            </div>
          ) : (
            [...debts].sort((a, b) => (a.isPaid === b.isPaid ? 0 : a.isPaid ? 1 : -1)).map((debt) => {
              const formatted = formatAmounts(debt.amount);
              return (
                <motion.div
                  key={debt.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`glass-card rounded-[28px] p-5 border-white/10 transition-all duration-300 ${
                    debt.isPaid ? 'opacity-40 grayscale bg-white/[0.02]' : 'shadow-xl bg-white/5 hover:border-cyan-500/30'
                  }`}
                >
                  <div className="flex justify-between items-start gap-3">
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className={`text-base font-black tracking-tight uppercase truncate ${debt.isPaid ? 'line-through text-slate-400' : 'text-white'}`}>
                          {debt.creditor}
                        </h4>
                        {debt.isPaid && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                            {t.statusPaid || 'Pagado'}
                          </span>
                        )}
                      </div>

                      {/* Amounts Display (Local Currency + USD) */}
                      <div className="flex flex-wrap items-center gap-2.5 mt-2.5">
                        {/* Local Currency */}
                        <div className="flex items-center gap-1 text-xs font-black text-cyan-300 px-2.5 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                          <Coins size={12} className="text-cyan-400" />
                          <span>{formatted.local}</span>
                        </div>

                        {/* USD Currency if different */}
                        {formatted.usd && (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 px-2 py-1 rounded-xl bg-white/5 border border-white/10">
                            <DollarSign size={10} className="text-emerald-400" />
                            <span>{formatted.usd}</span>
                          </div>
                        )}

                        {/* Due Date */}
                        {debt.dueDate && (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            <Calendar size={11} className="text-slate-400" />
                            <span>{debt.dueDate}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Edit */}
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={(e) => openEditModal(debt, e)}
                        className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-cyan-300 flex items-center justify-center border border-white/10 transition-colors"
                        title={t.edit || 'Editar'}
                      >
                        <Edit2 size={14} />
                      </motion.button>

                      {/* Toggle Paid */}
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => togglePaid(debt.id)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                          debt.isPaid 
                            ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20' 
                            : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/15'
                        }`}
                        title={debt.isPaid ? 'Marcar pendiente' : 'Marcar pagado'}
                      >
                        <Check size={16} className={debt.isPaid ? 'stroke-[3]' : ''} />
                      </motion.button>

                      {/* Delete */}
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={(e) => removeDebt(debt.id, e)}
                        className="w-9 h-9 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/20 transition-colors"
                        title={t.delete || 'Eliminar'}
                      >
                        <Trash2 size={14} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
      </div>

      {/* Add / Edit Commitment Modal */}
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
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-base">
                      {editingDebt ? (t.editTitle || 'Editar Compromiso') : (t.register || 'Nuevo Compromiso')}
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      {language === 'es' ? 'Gestiona montos y fechas límite con serenidad' : 'Manage amounts and due dates calmly'}
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
              <form onSubmit={handleSaveDebt} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block flex items-center gap-1.5">
                    <User size={12} className="text-cyan-400" />
                    <span>{t.who}</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={creditor}
                    onChange={(e) => setCreditor(e.target.value)}
                    placeholder={t.whoPlaceholder}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm font-bold focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Amount with Local Currency Prefix */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block flex items-center gap-1.5">
                      <Coins size={12} className="text-cyan-400" />
                      <span>{t.amount} ({currencySymbol})</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder={t.amountPlaceholder}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm font-bold focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>

                  {/* Due Date */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block flex items-center gap-1.5">
                      <Calendar size={12} className="text-cyan-400" />
                      <span>{t.date}</span>
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm font-bold focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="p-3 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-400">{t.currencyLocal || 'Moneda activa'}:</span>
                  <span className="text-cyan-300 font-bold">{currencySymbol} {currencyCode} · USD $</span>
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold uppercase tracking-wider text-xs transition-colors"
                  >
                    {t.cancel || 'Cancelar'}
                  </button>
                  <button
                    type="submit"
                    className="py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black uppercase tracking-wider text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Check size={16} className="stroke-[3]" />
                    <span>{editingDebt ? (t.update || 'Guardar') : (t.register || 'Registrar')}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
        {/* Custom Non-blocking Confirmation Modal */}
        {deleteCandidateId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setDeleteCandidateId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-[#161828] border border-rose-500/30 rounded-3xl p-6 shadow-2xl text-center space-y-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
                <Trash2 size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {language === 'es' ? '¿Eliminar este compromiso?' : 'Delete this commitment?'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {t.deleteConfirm || (language === 'es' ? 'Esta acción quitará el compromiso de tu lista sin culpa.' : 'This action will remove the commitment without guilt.')}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteCandidateId(null)}
                  className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  {t.cancel || 'Cancelar'}
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="py-3 px-4 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-colors shadow-lg shadow-rose-500/20"
                >
                  {language === 'es' ? 'Eliminar' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
