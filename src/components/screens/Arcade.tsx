import React, { useState, useEffect, useRef } from 'react';
import Header from '../Header';
import { Language, Screen } from '../../types';
import { i18n } from '../../i18n';
import { motion, AnimatePresence } from 'motion/react';
import { hapticEngine } from '../../utils/hapticEngine';
import { 
  Sparkles, 
  RotateCw, 
  Grid3X3, 
  Gamepad2, 
  Check, 
  RefreshCw,
  Trophy,
  Waves,
  Volume2
} from 'lucide-react';

interface ArcadeProps {
  language: Language;
  onBack: () => void;
  onNavigate?: (screen: Screen) => void;
}

type ArcadeTab = 'spinner' | 'sudoku' | 'words';

export default function Arcade({ language, onBack }: ArcadeProps) {
  const isEs = language === 'es';
  const t = i18n[language].arcade;
  const [tab, setTab] = useState<ArcadeTab>('spinner');

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">
      <Header title={t.title} onBack={onBack} />

      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-4 sm:px-6 pt-3 pb-[max(5rem,calc(env(safe-area-inset-bottom,0px)+3.5rem))] space-y-4">
        {/* Intro Card */}
        <div className="p-4 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-blue-900/30 to-purple-950/40 border border-cyan-400/30 shadow-lg flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shrink-0">
            <Gamepad2 size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold text-white dark:text-white light:text-slate-900 tracking-tight leading-tight">
              {t.title}
            </h2>
            <p className="text-[11px] text-cyan-200/90 dark:text-cyan-200/90 light:text-slate-600 font-medium leading-snug mt-0.5">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="p-1 rounded-2xl bg-slate-900/60 dark:bg-white/5 light:bg-slate-200/80 border border-white/10 dark:border-white/10 light:border-slate-300 flex items-center gap-1">
          <button
            type="button"
            onClick={() => setTab('spinner')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              tab === 'spinner'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-white'
            }`}
          >
            <RotateCw size={14} className={tab === 'spinner' ? 'animate-spin' : ''} />
            <span className="truncate">{t.tabSpinner}</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('sudoku')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              tab === 'sudoku'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-white'
            }`}
          >
            <Grid3X3 size={14} />
            <span className="truncate">{t.tabSudoku}</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('words')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              tab === 'words'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-white'
            }`}
          >
            <Sparkles size={14} />
            <span className="truncate">{t.tabWords}</span>
          </button>
        </div>

        {/* Active Content */}
        <AnimatePresence mode="wait">
          {tab === 'spinner' && (
            <motion.div
              key="spinner"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <FidgetSpinnerView language={language} t={t} />
            </motion.div>
          )}

          {tab === 'sudoku' && (
            <motion.div
              key="sudoku"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ZenSudokuView language={language} t={t} />
            </motion.div>
          )}

          {tab === 'words' && (
            <motion.div
              key="words"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <WordBubblesView language={language} t={t} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 1. FIDGET SPINNER SOMÁTICO (PHYSICS & HAPTICS)
// -------------------------------------------------------------
function FidgetSpinnerView({ language, t }: { language: Language; t: any }) {
  const [rotation, setRotation] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [totalSpins, setTotalSpins] = useState(0);
  const lastTouchRef = useRef<{ y: number; time: number } | null>(null);
  const animRef = useRef<number | null>(null);
  const lastHapticAngleRef = useRef(0);

  // Inertial spin loop with friction
  useEffect(() => {
    let prevTime = performance.now();

    const loop = (time: number) => {
      const dt = (time - prevTime) / 1000;
      prevTime = time;

      setVelocity(v => {
        if (Math.abs(v) < 0.15) return 0;
        // Natural air resistance
        return v * 0.982;
      });

      setRotation(r => {
        const next = r + velocity * dt * 60;
        
        // Haptic pulse every 120 degrees (each wing pass)
        const angleDiff = Math.abs(next - lastHapticAngleRef.current);
        if (angleDiff >= 120 && Math.abs(velocity) > 1.5) {
          lastHapticAngleRef.current = next;
          setTotalSpins(s => s + 1);
          hapticEngine.playTactilePulse(35);
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            try { navigator.vibrate(25); } catch (e) {}
          }
        }
        return next;
      });

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [velocity]);

  const handlePointerDown = (e: React.PointerEvent) => {
    lastTouchRef.current = { y: e.clientY, time: performance.now() };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!lastTouchRef.current) return;
    const dy = e.clientY - lastTouchRef.current.y;
    const dt = Math.max(16, performance.now() - lastTouchRef.current.time);
    const speed = (dy / dt) * 35;

    setVelocity(prev => Math.min(80, Math.max(-80, prev + (speed !== 0 ? speed : 25))));
    hapticEngine.playTactilePulse(60);
    lastTouchRef.current = null;
  };

  const handleQuickSpin = (boost: number) => {
    setVelocity(v => Math.min(90, Math.max(-90, v + boost)));
    hapticEngine.playTactilePulse(75);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(50); } catch (e) {}
    }
  };

  const handleBrake = () => {
    setVelocity(0);
    hapticEngine.playTactilePulse(110);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate([40, 40]); } catch (e) {}
    }
  };

  return (
    <div className="rounded-3xl p-6 bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 shadow-xl space-y-6 text-center select-none">
      <div className="space-y-1">
        <h3 className="text-sm font-black text-white dark:text-white light:text-slate-900 uppercase tracking-wider">
          {t.spinnerTitle}
        </h3>
        <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-600 font-medium leading-relaxed">
          {t.spinnerDesc}
        </p>
      </div>

      {/* Interactive Spinner Canvas Area */}
      <div 
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        className="w-64 h-64 mx-auto relative flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
      >
        {/* Glow Aura */}
        <div 
          className="absolute w-52 h-52 rounded-full blur-2xl transition-opacity duration-300 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,0.3) 0%, rgba(99,102,241,0.15) 60%, transparent 80%)',
            opacity: Math.min(1, Math.abs(velocity) / 20)
          }}
        />

        {/* Triple Wing Fidget Spinner SVG */}
        <div 
          style={{ transform: `rotate(${rotation}deg)` }}
          className="w-56 h-56 relative flex items-center justify-center transition-transform"
        >
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]">
            <defs>
              <linearGradient id="spinnerGrad" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>

            {/* Center Circle */}
            <circle cx="100" cy="100" r="28" fill="#0f172a" stroke="#38bdf8" strokeWidth="4" />
            <circle cx="100" cy="100" r="16" fill="url(#spinnerGrad)" />

            {/* Wing 1 (Top, 0 deg) */}
            <g transform="rotate(0, 100, 100)">
              <path d="M86 85 C84 55 68 35 100 30 C132 35 116 55 114 85 Z" fill="url(#spinnerGrad)" />
              <circle cx="100" cy="45" r="18" fill="#0f172a" stroke="#38bdf8" strokeWidth="3.5" />
              <circle cx="100" cy="45" r="9" fill="#38bdf8" />
            </g>

            {/* Wing 2 (120 deg) */}
            <g transform="rotate(120, 100, 100)">
              <path d="M86 85 C84 55 68 35 100 30 C132 35 116 55 114 85 Z" fill="url(#spinnerGrad)" />
              <circle cx="100" cy="45" r="18" fill="#0f172a" stroke="#38bdf8" strokeWidth="3.5" />
              <circle cx="100" cy="45" r="9" fill="#38bdf8" />
            </g>

            {/* Wing 3 (240 deg) */}
            <g transform="rotate(240, 100, 100)">
              <path d="M86 85 C84 55 68 35 100 30 C132 35 116 55 114 85 Z" fill="url(#spinnerGrad)" />
              <circle cx="100" cy="45" r="18" fill="#0f172a" stroke="#38bdf8" strokeWidth="3.5" />
              <circle cx="100" cy="45" r="9" fill="#38bdf8" />
            </g>
          </svg>
        </div>
      </div>

      {/* Metrics & Control Buttons */}
      <div className="flex items-center justify-around text-xs font-mono font-bold text-slate-300 dark:text-slate-300 light:text-slate-700 bg-black/20 dark:bg-black/20 light:bg-slate-100 p-3 rounded-2xl border border-white/10 dark:border-white/10 light:border-slate-300">
        <div>
          <span className="block text-[10px] text-cyan-400 dark:text-cyan-400 light:text-cyan-700 uppercase font-black font-sans">{t.spinnerSpeed}</span>
          <span className="text-base font-black tabular-nums">{Math.abs(Math.round(velocity * 10))} RPM</span>
        </div>
        <div className="w-px h-8 bg-white/10 dark:bg-white/10 light:bg-slate-300" />
        <div>
          <span className="block text-[10px] text-cyan-400 dark:text-cyan-400 light:text-cyan-700 uppercase font-black font-sans">{t.spinnerRevs}</span>
          <span className="text-base font-black tabular-nums">{Math.floor(totalSpins / 3)}</span>
        </div>
      </div>

      {/* Direct Controls */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <button
          onClick={() => handleQuickSpin(35)}
          className="py-3 px-4 rounded-2xl bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
        >
          <RotateCw size={15} />
          <span>{language === 'es' ? 'Giro Suave' : 'Gentle Spin'}</span>
        </button>

        <button
          onClick={handleBrake}
          className="py-3 px-4 rounded-2xl bg-white/10 dark:bg-white/10 light:bg-slate-200 hover:bg-white/15 text-slate-300 dark:text-slate-300 light:text-slate-800 font-bold text-xs uppercase tracking-wider transition-all border border-white/10 dark:border-white/10 light:border-slate-300 cursor-pointer"
        >
          {t.spinnerStop}
        </button>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 2. MINI SUDOKU ZEN (4x4)
// -------------------------------------------------------------
const SUDOKU_OCEAN_SYMBOLS = ['🐬', '🫧', '🌊', '🐚'];

const SUDOKU_PUZZLES = [
  {
    initial: [
      [1, 0, 0, 4],
      [0, 4, 1, 0],
      [0, 1, 4, 0],
      [4, 0, 0, 1]
    ],
    solution: [
      [1, 2, 3, 4],
      [3, 4, 1, 2],
      [2, 1, 4, 3],
      [4, 3, 2, 1]
    ]
  },
  {
    initial: [
      [0, 2, 3, 0],
      [3, 0, 0, 2],
      [2, 0, 0, 3],
      [0, 3, 2, 0]
    ],
    solution: [
      [4, 2, 3, 1],
      [3, 1, 4, 2],
      [2, 4, 1, 3],
      [1, 3, 2, 4]
    ]
  }
];

function ZenSudokuView({ language, t }: { language: Language; t: any }) {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [symbolMode, setSymbolMode] = useState<'numbers' | 'ocean'>('ocean');
  const [grid, setGrid] = useState<number[][]>(() => SUDOKU_PUZZLES[0].initial.map(row => [...row]));
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null);
  const [isSolved, setIsSolved] = useState(false);

  const resetPuzzle = () => {
    const nextIdx = (puzzleIndex + 1) % SUDOKU_PUZZLES.length;
    setPuzzleIndex(nextIdx);
    setGrid(SUDOKU_PUZZLES[nextIdx].initial.map(row => [...row]));
    setSelectedCell(null);
    setIsSolved(false);
    hapticEngine.playTactilePulse(50);
  };

  const handleCellClick = (r: number, c: number) => {
    // If it was part of the initial puzzle, don't allow modification
    if (SUDOKU_PUZZLES[puzzleIndex].initial[r][c] !== 0) return;
    setSelectedCell({ r, c });
    hapticEngine.playTactilePulse(30);
  };

  const handleInputVal = (val: number) => {
    if (!selectedCell) return;
    const { r, c } = selectedCell;

    const newGrid = grid.map(row => [...row]);
    newGrid[r][c] = val;
    setGrid(newGrid);
    hapticEngine.playTactilePulse(45);

    // Verify if completed
    const sol = SUDOKU_PUZZLES[puzzleIndex].solution;
    let correct = true;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (newGrid[i][j] !== sol[i][j]) {
          correct = false;
          break;
        }
      }
    }

    if (correct) {
      setIsSolved(true);
      hapticEngine.playTactilePulse(160);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try { navigator.vibrate([60, 40, 80, 40, 120]); } catch (e) {}
      }
    }
  };

  return (
    <div className="rounded-3xl p-6 bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 shadow-xl space-y-5 text-center select-none">
      <div className="space-y-1">
        <h3 className="text-sm font-black text-white dark:text-white light:text-slate-900 uppercase tracking-wider">
          {t.sudokuTitle}
        </h3>
        <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-600 font-medium leading-relaxed">
          {t.sudokuDesc}
        </p>
      </div>

      {/* Mode Selector (Ocean Symbols vs Numbers) */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setSymbolMode('ocean')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            symbolMode === 'ocean'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'bg-white/5 dark:bg-white/5 light:bg-slate-100 text-slate-400 hover:text-white'
          }`}
        >
          {t.sudokuModeOcean}
        </button>
        <button
          onClick={() => setSymbolMode('numbers')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            symbolMode === 'numbers'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'bg-white/5 dark:bg-white/5 light:bg-slate-100 text-slate-400 hover:text-white'
          }`}
        >
          {t.sudokuModeNumbers}
        </button>
      </div>

      {/* 4x4 Grid Board */}
      <div className="max-w-[280px] mx-auto bg-black/30 dark:bg-black/30 light:bg-slate-100 p-2 rounded-3xl border border-white/15 dark:border-white/15 light:border-slate-300 grid grid-cols-4 gap-1.5 shadow-inner">
        {grid.map((row, r) =>
          row.map((val, c) => {
            const isInitial = SUDOKU_PUZZLES[puzzleIndex].initial[r][c] !== 0;
            const isSelected = selectedCell?.r === r && selectedCell?.c === c;

            const display = val === 0 
              ? '' 
              : symbolMode === 'ocean' 
              ? SUDOKU_OCEAN_SYMBOLS[val - 1] 
              : val;

            return (
              <button
                key={`${r}-${c}`}
                type="button"
                onClick={() => handleCellClick(r, c)}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/30 border-2 border-cyan-400 text-white shadow-md scale-95'
                    : isInitial
                    ? 'bg-white/10 dark:bg-white/10 light:bg-white text-cyan-300 dark:text-cyan-300 light:text-cyan-700 font-black border border-white/10 dark:border-white/10 light:border-slate-200'
                    : val !== 0
                    ? 'bg-white/5 dark:bg-white/5 light:bg-white/80 text-white dark:text-white light:text-slate-900 border border-white/10 dark:border-white/10 light:border-slate-200'
                    : 'bg-transparent border border-white/5 dark:border-white/5 light:border-slate-200 hover:bg-white/5'
                }`}
              >
                {display}
              </button>
            );
          })
        )}
      </div>

      {/* Input Pad for Selected Cell */}
      <div className="flex justify-center gap-2 pt-1">
        {[1, 2, 3, 4].map(num => (
          <button
            key={num}
            type="button"
            onClick={() => handleInputVal(num)}
            className="w-12 h-12 rounded-2xl bg-cyan-600/20 hover:bg-cyan-600/30 active:scale-95 border border-cyan-400/40 text-cyan-200 text-lg font-bold flex items-center justify-center transition-all cursor-pointer shadow-sm"
          >
            {symbolMode === 'ocean' ? SUDOKU_OCEAN_SYMBOLS[num - 1] : num}
          </button>
        ))}
      </div>

      {/* Success Notification */}
      {isSolved && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <Trophy size={16} className="text-emerald-400" />
          <span>{t.sudokuSolved}</span>
        </motion.div>
      )}

      {/* Reset Board */}
      <button
        onClick={resetPuzzle}
        className="w-full py-3 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-slate-200 hover:bg-white/10 text-slate-300 dark:text-slate-300 light:text-slate-800 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer border border-white/10 dark:border-white/10 light:border-slate-300"
      >
        <RefreshCw size={14} />
        <span>{t.sudokuReset}</span>
      </button>
    </div>
  );
}

// -------------------------------------------------------------
// 3. BURBUJAS DE PALABRAS DE AUTORREGULACIÓN
// -------------------------------------------------------------
const CALMING_WORDS_ES = ['CALMA', 'PAZ', 'RESPIRA', 'SEGURA', 'ANCLAJE', 'SILENCIO'];
const CALMING_WORDS_EN = ['CALM', 'PEACE', 'BREATHE', 'SAFE', 'ANCHOR', 'SERENE'];

function WordBubblesView({ language, t }: { language: Language; t: any }) {
  const isEs = language === 'es';
  const wordList = isEs ? CALMING_WORDS_ES : CALMING_WORDS_EN;
  const [wordIdx, setWordIdx] = useState(0);
  const targetWord = wordList[wordIdx];
  const [currentInput, setCurrentInput] = useState<string>('');
  const [solvedCount, setSolvedCount] = useState(0);
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);

  useEffect(() => {
    // Scramble letters with 2 random filler letters for pleasant stimulating puzzle
    const letters = targetWord.split('');
    const fillers = ['A', 'E', 'O', 'S', 'L', 'R'];
    const extra = fillers[Math.floor(Math.random() * fillers.length)];
    const mixed = [...letters, extra].sort(() => Math.random() - 0.5);
    setScrambledLetters(mixed);
    setCurrentInput('');
  }, [wordIdx, targetWord]);

  const handleLetterTap = (char: string) => {
    const next = currentInput + char;
    setCurrentInput(next);
    hapticEngine.playTactilePulse(40);

    if (next === targetWord) {
      setSolvedCount(s => s + 1);
      hapticEngine.playTactilePulse(150);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try { navigator.vibrate([60, 50, 100]); } catch (e) {}
      }
      setTimeout(() => {
        setWordIdx((wordIdx + 1) % wordList.length);
      }, 900);
    }
  };

  const handleClear = () => {
    setCurrentInput('');
    hapticEngine.playTactilePulse(30);
  };

  return (
    <div className="rounded-3xl p-6 bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 shadow-xl space-y-6 text-center select-none">
      <div className="space-y-1">
        <h3 className="text-sm font-black text-white dark:text-white light:text-slate-900 uppercase tracking-wider">
          {t.wordsTitle}
        </h3>
        <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-600 font-medium leading-relaxed">
          {t.wordsDesc}
        </p>
      </div>

      {/* Target Word & Formed Word Banner */}
      <div className="space-y-3">
        <span className="text-[10px] text-cyan-400 dark:text-cyan-400 light:text-cyan-700 uppercase font-black tracking-widest block">
          {t.wordsTarget} {targetWord}
        </span>

        {/* Current assembled word display */}
        <div className="min-h-[56px] px-6 py-2 rounded-2xl bg-black/20 dark:bg-black/20 light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-300 flex items-center justify-center tracking-[8px] font-black text-2xl text-cyan-300 dark:text-cyan-300 light:text-cyan-800">
          {currentInput || '...'}
        </div>
      </div>

      {/* Floating Letter Bubbles */}
      <div className="flex flex-wrap justify-center gap-3 py-2">
        {scrambledLetters.map((char, i) => (
          <motion.button
            key={`${char}-${i}`}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleLetterTap(char)}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-600/30 to-blue-500/20 hover:from-cyan-500/40 hover:to-blue-400/30 border-2 border-cyan-400/40 text-white dark:text-white light:text-slate-900 text-xl font-black flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
          >
            {char}
          </motion.button>
        ))}
      </div>

      {/* Progress & Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handleClear}
          className="px-4 py-2 rounded-xl bg-white/10 dark:bg-white/10 light:bg-slate-200 text-slate-300 dark:text-slate-300 light:text-slate-700 text-xs font-bold transition-all cursor-pointer"
        >
          {language === 'es' ? 'Borrar' : 'Clear'}
        </button>

        <span className="text-xs font-mono font-bold text-cyan-400 dark:text-cyan-400 light:text-cyan-700">
          {t.wordsScore}: {solvedCount}
        </span>
      </div>
    </div>
  );
}
