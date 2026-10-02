import { useState, useEffect, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, Smartphone } from 'lucide-react';
import { Language } from '../types';
import { i18n } from '../i18n';
import { usePWA } from '../utils/usePWA';

interface PWAInstallBannerProps {
  language: Language;
  onOpenModal: () => void;
}

export default function PWAInstallBanner({ language, onOpenModal }: PWAInstallBannerProps) {
  const t = i18n[language].pwa;
  const { isInstalled, isInstallable } = usePWA();
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('pwa_banner_dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  if (isInstalled || isDismissed || !isInstallable) {
    return null;
  }

  const handleDismiss = (e: MouseEvent) => {
    e.stopPropagation();
    setIsDismissed(true);
    sessionStorage.setItem('pwa_banner_dismissed', 'true');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        onClick={onOpenModal}
        className="w-full mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-purple-950/70 to-slate-900/70 border border-indigo-500/30 backdrop-blur-xl shadow-lg flex items-center justify-between gap-3 cursor-pointer group hover:border-indigo-400/50 transition-all shrink-0"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0 group-hover:scale-105 transition-transform">
            <Download size={17} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white tracking-tight truncate">
              {t.installTitle}
            </p>
            <p className="text-[10px] text-indigo-200/80 font-medium truncate">
              {t.bannerText}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-2.5 py-1 rounded-lg bg-indigo-600 group-hover:bg-indigo-500 text-white font-bold text-[10px] uppercase tracking-wider shadow">
            {t.installNow}
          </span>
          <button
            onClick={handleDismiss}
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X size={13} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
