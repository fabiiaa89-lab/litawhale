import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import WhaleLogo from './WhaleLogo';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  titleColor?: string;
}

export default function Header({ title, onBack }: HeaderProps) {
  return (
    <div className="flex-none relative z-50 flex items-center gap-4 px-5 pt-[max(1.25rem,calc(env(safe-area-inset-top,0px)+0.75rem))] pb-4 shrink-0 glass-dark border-b border-white/5">
      {onBack && (
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-200 hover:text-white hover:bg-white/10 cursor-pointer backdrop-blur-xl shadow-lg ring-1 ring-white/5 shrink-0 transition-colors"
          aria-label="Volver"
        >
          <ArrowLeft size={20} />
        </motion.button>
      )}
      {!onBack && (
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-white/10 shrink-0 p-2 bg-white/5 flex items-center justify-center">
          <WhaleLogo className="w-full h-full scale-110" glow={false} />
        </div>
      )}
      <h2 className="text-xl font-bold text-slate-100 tracking-tight truncate">
        {title}
      </h2>
    </div>
  );
}
