import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Share, PlusSquare, CheckCircle2, X, Smartphone, Globe, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { i18n } from '../i18n';
import { usePWA } from '../utils/usePWA';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export default function PWAInstallModal({ isOpen, onClose, language }: PWAInstallModalProps) {
  const t = i18n[language].pwa;
  const { isInstalled, isIOS, installApp } = usePWA();
  const [installStatus, setInstallStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    const result = await installApp();
    if (result === 'accepted') {
      setInstallStatus('success');
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 260 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-[#0e101c] border-t sm:border border-white/20 rounded-t-[36px] sm:rounded-[36px] p-6 pb-[max(2rem,calc(env(safe-area-inset-bottom,0px)+1.5rem))] shadow-[0_-10px_40px_rgba(0,0,0,0.8)] overflow-hidden relative text-white"
        >
          {/* Background Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer active:scale-90 transition-transform z-10"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3.5 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 p-0.5 shadow-lg shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-[#0e101c] rounded-[14px] flex items-center justify-center">
                <Download size={22} className="text-indigo-400" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight text-slate-100">
                {t.installTitle}
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                {t.installSubtitle}
              </p>
            </div>
          </div>

          {/* Already Installed View */}
          {isInstalled ? (
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center my-4 space-y-2">
              <CheckCircle2 size={32} className="text-emerald-400 mx-auto" />
              <h4 className="font-bold text-emerald-200 text-sm">{t.installed}</h4>
              <p className="text-xs text-emerald-300/80 leading-relaxed">{t.installedDesc}</p>
            </div>
          ) : isIOS ? (
            /* iOS Safari Step-by-Step Guide */
            <div className="space-y-4 my-2">
              <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                <p className="text-xs font-bold text-indigo-300">
                  {t.iosSubtitle}
                </p>
              </div>

              {/* Steps List */}
              <div className="space-y-3">
                {/* Step 1 */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0 text-blue-300">
                    <Share size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-500/30 text-blue-200 uppercase">1</span>
                      <span className="text-sm font-bold text-white">{t.iosStep1}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{t.iosStep1Sub}</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center shrink-0 text-purple-300">
                    <PlusSquare size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-500/30 text-purple-200 uppercase">2</span>
                      <span className="text-sm font-bold text-white">{t.iosStep2}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{t.iosStep2Sub}</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0 text-emerald-300">
                    <Sparkles size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-200 uppercase">3</span>
                      <span className="text-sm font-bold text-white">{t.iosStep3}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{t.iosStep3Sub}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm tracking-wide uppercase shadow-lg shadow-indigo-600/30 active:scale-98 transition-all cursor-pointer mt-3"
              >
                {t.iosGotIt}
              </button>
            </div>
          ) : (
            /* Chrome / Android / Edge / Desktop View */
            <div className="space-y-4 my-3">
              <div className="p-4 rounded-2xl bg-indigo-600/10 border border-indigo-400/20 text-center space-y-2">
                <Smartphone size={28} className="text-indigo-400 mx-auto" />
                <p className="text-xs text-indigo-200 font-medium leading-relaxed">
                  {t.chromeTip}
                </p>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleNativeInstall}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-sm tracking-wider uppercase shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Download size={18} />
                <span>{t.installBtn}</span>
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
