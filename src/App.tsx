/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, lazy, Suspense } from 'react';
import { Screen, EnergyLevel, Profile, Med, AACCard, SensitivityProfile, Language, Debt, AppTheme } from './types';
import Home from './components/screens/Home';
import Anchor from './components/screens/Anchor';
import BodyScanner from './components/screens/BodyScanner';
import Cave from './components/screens/Cave';
import Haptic from './components/screens/Haptic';
import Cards from './components/screens/Cards';
import Meds from './components/screens/Meds';
import Crisis from './components/screens/Crisis';
import EnergyModal from './components/EnergyModal';
import FullCardOverlay from './components/FullCardOverlay';
import { AnimatePresence, motion } from 'motion/react';
import { i18n } from './i18n';

import Settings from './components/screens/Settings';
import SplashScreen from './components/SplashScreen';
import SOSData from './components/screens/SOSData';
import Debts from './components/screens/Debts';
import StealthMode from './components/screens/StealthMode';
import IsochronicTones from './components/screens/IsochronicTones';
import HamburgerMenu from './components/HamburgerMenu';
import PWAInstallModal from './components/PWAInstallModal';
import SpoonWidget from './components/SpoonWidget';
import SensoryLog from './components/screens/SensoryLog';

const NeuralCortex = lazy(() => import('./components/screens/NeuralCortex'));
const Companion = lazy(() => import('./components/screens/Companion'));
const Kit = lazy(() => import('./components/screens/Kit'));
const Books = lazy(() => import('./components/screens/Books'));
const Premium = lazy(() => import('./components/screens/Premium'));

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [storageFull, setStorageFull] = useState(false);
  const [emergencyWarning, setEmergencyWarning] = useState(false);

  const [theme, setTheme] = useState<AppTheme>(() => {
    try {
      const saved = localStorage.getItem('ns_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {}
    return 'dark'; // Calming dark mode default
  });

  const [energy, setEnergy] = useState<EnergyLevel>(() => {
    try {
      const savedSpoons = localStorage.getItem('ns_spoons');
      if (savedSpoons) {
        const parsed = JSON.parse(savedSpoons);
        if (typeof parsed.remaining === 'number') {
          const s = parsed.remaining;
          if (s <= 2) return 1;
          if (s <= 5) return 2;
          if (s <= 8) return 3;
          if (s <= 10) return 4;
          return 5;
        }
      }
      const saved = localStorage.getItem('ns_energy');
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (parsed >= 1 && parsed <= 5) return parsed as EnergyLevel;
      }
    } catch (e) {}
    return 5;
  });

  const [isEnergyModalOpen, setIsEnergyModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [activeCard, setActiveCard] = useState<AACCard | null>(null);
  
  const [profile, setProfile] = useState<Profile>(() => {
    const saved = localStorage.getItem('ns_profile');
    
    // Language detection
    let detectedLang: Language = 'en';
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'es') {
      detectedLang = 'es';
    }

    const defaultProfile: Profile = { 
      name: '', 
      address: '', 
      contacts: [], 
      sensitivity: 'MED',
      crisisMed: '',
      dailyMed: '',
      safeFood: '',
      userImage: '',
      contactImage: '',
      language: detectedLang,
      bloodType: '',
      allergies: '',
      hypersensitivities: '',
      hyposensitivities: '',
      triggers: '',
      interests: '',
      country: '',
      currency: detectedLang === 'es' ? 'EUR' : 'USD',
      currencySymbol: detectedLang === 'es' ? '€' : '$',
      theme: 'dark'
    };
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.language !== 'es' && parsed.language !== 'en') {
          parsed.language = detectedLang;
        }
        return { ...defaultProfile, ...parsed };
      } catch {
        // perfil dañado: se usa el predeterminado
      }
    }
    return defaultProfile;
  });

  const [cards, setCards] = useState<AACCard[]>(() => {
    const defaultCards = i18n[profile.language].aacCards;
    const saved = localStorage.getItem('ns_cards');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 12) return parsed;
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Preserve any custom cards and append new 12 standard cards
          const customCards = parsed.filter((c: AACCard) => c.isCustom);
          return [...defaultCards, ...customCards];
        }
      } catch (e) {}
    }
    return defaultCards;
  });

  const [meds, setMeds] = useState<Med[]>(() => {
    const saved = localStorage.getItem('ns_meds');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [];
  });

  const [debts, setDebts] = useState<Debt[]>(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem('ns_debts') || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // Apply Theme to DOM
  useEffect(() => {
    try {
      localStorage.setItem('ns_theme', theme);
    } catch (e) {}
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      document.body.style.backgroundColor = '#f4f6fb';
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
      document.body.style.backgroundColor = '#0b0e1b';
    }
    window.dispatchEvent(new CustomEvent('ns_theme_updated', { detail: theme }));
  }, [theme]);

  // Listen for open energy modal custom events
  useEffect(() => {
    const handleOpenEnergyModal = () => setIsEnergyModalOpen(true);
    window.addEventListener('ns_open_energy_modal', handleOpenEnergyModal);
    return () => window.removeEventListener('ns_open_energy_modal', handleOpenEnergyModal);
  }, []);

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setScreen(prev => (prev === 'splash' ? 'home' : prev));
    }, 2400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('ns_profile', JSON.stringify(profile));
    } catch (e) {
      console.warn("Could not save profile to localStorage:", e);
      setStorageFull(true);
    }
    document.body.setAttribute('data-sensitivity', profile.sensitivity);
    document.documentElement.lang = profile.language;
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('ns_cards', JSON.stringify(cards));
    } catch (e) {
      console.warn("Could not save cards to localStorage:", e);
      setStorageFull(true);
    }
  }, [cards]);

  // Synchronize default AAC cards with active language
  useEffect(() => {
    setCards(prev => prev.map(c => {
      if (c.isCustom) return c;
      const found = i18n[profile.language].aacCards.find(def => def.id === c.id);
      return found ? { ...c, label: found.label, text: found.text, icon: found.icon } : c;
    }));
  }, [profile.language]);

  useEffect(() => {
    try {
      localStorage.setItem('ns_meds', JSON.stringify(meds));
    } catch (e) {
      console.warn("Could not save meds to localStorage:", e);
      setStorageFull(true);
    }
  }, [meds]);

  useEffect(() => {
    try {
      localStorage.setItem('ns_debts', JSON.stringify(debts));
    } catch (e) {
      console.warn("Could not save debts to localStorage:", e);
      setStorageFull(true);
    }
  }, [debts]);

  useEffect(() => {
    try {
      localStorage.setItem('ns_energy', String(energy));
    } catch (e) {}
  }, [energy]);

  // Keep energy in sync when spoons are adjusted in SpoonWidget or EnergyModal
  useEffect(() => {
    const handleSpoonSync = () => {
      try {
        const saved = localStorage.getItem('ns_spoons');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (typeof parsed.remaining === 'number') {
            const s = parsed.remaining;
            let lvl: EnergyLevel = 5;
            if (s <= 2) lvl = 1;
            else if (s <= 5) lvl = 2;
            else if (s <= 8) lvl = 3;
            else if (s <= 10) lvl = 4;
            setEnergy(lvl);
          }
        }
      } catch (err) {}
    };

    window.addEventListener('ns_spoons_updated', handleSpoonSync);
    window.addEventListener('storage', handleSpoonSync);
    return () => {
      window.removeEventListener('ns_spoons_updated', handleSpoonSync);
      window.removeEventListener('storage', handleSpoonSync);
    };
  }, []);

  const handleSetEnergy = (level: EnergyLevel) => {
    setEnergy(level);
    if (level === 1) {
      setIsEnergyModalOpen(false);
      setScreen('cave');
    } else {
      setIsEnergyModalOpen(false);
    }
  };

  const handleUpdateProfile = (updates: Partial<Profile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const handleConfirmMed = (index: number) => {
    setMeds(prev => prev.map((m, i) => i === index ? { ...m, confirmed: true } : m));
  };

  const handleAddMed = (med: Med) => {
    setMeds(prev => [...prev, med]);
  };

  const handleToggleSensitivity = () => {
    const next: SensitivityProfile[] = ['HIPO', 'MED', 'HIPER'];
    const current = next.indexOf(profile.sensitivity);
    const nextVal = next[(current + 1) % 3];
    handleUpdateProfile({ sensitivity: nextVal });
  };

  const callEmergency = () => {
    if (profile.contacts?.[0]?.phone) {
      window.location.href = `tel:${profile.contacts[0].phone}`;
    } else {
      setEmergencyWarning(true);
      setTimeout(() => setEmergencyWarning(false), 5000);
    }
  };

  const handleToggleLanguage = () => {
    handleUpdateProfile({ language: profile.language === 'es' ? 'en' : 'es' });
  };

  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return (
          <Home 
            energy={energy} 
            language={profile.language} 
            theme={theme}
            onNavigate={setScreen} 
            onOpenEnergy={() => setIsEnergyModalOpen(true)} 
            onOpenMenu={() => setIsMenuOpen(true)}
            onToggleTheme={handleToggleTheme}
            onOpenInstallModal={() => setIsInstallModalOpen(true)}
          />
        );
      case 'anchor':
        return <Anchor language={profile.language} profile={profile} onBack={() => setScreen('home')} />;
      case 'body':
        return <BodyScanner language={profile.language} profile={profile} onBack={() => setScreen('home')} />;
      case 'cave':
        return <Cave language={profile.language} onExit={() => setScreen('home')} />;
      case 'haptic':
        return <Haptic language={profile.language} onBack={() => setScreen('home')} />;
      case 'cards':
        return (
          <Cards 
            language={profile.language} 
            cards={cards}
            onUpdateCards={setCards}
            onBack={() => setScreen('home')} 
            onShowFull={setActiveCard} 
          />
        );
      case 'meds':
        return (
          <Meds 
            language={profile.language} 
            meds={meds} 
            onUpdateMeds={setMeds} 
            onConfirm={handleConfirmMed} 
            onAdd={handleAddMed} 
            onBack={() => setScreen('home')} 
          />
        );
      case 'crisis':
        return (
          <Crisis 
            language={profile.language}
            profile={profile}
            onBack={() => setScreen('home')} 
            onActivateCave={() => setScreen('cave')}
            onCallEmergency={callEmergency}
            onShowCard={setActiveCard}
            onNavigateHaptic={() => setScreen('haptic')}
          />
        );
      case 'splash':
        return <SplashScreen language={profile.language} />;
      case 'sos':
        return <SOSData language={profile.language} profile={profile} onBack={() => setScreen('home')} onCall={callEmergency} />;
      case 'ai':
        return <NeuralCortex language={profile.language} profile={profile} onBack={() => setScreen('home')} onNavigate={setScreen} />;
      case 'debts':
        return (
          <Debts 
            language={profile.language} 
            profile={profile} 
            debts={debts} 
            onUpdate={setDebts} 
            onBack={() => setScreen('home')} 
          />
        );
      case 'stealth':
        return <StealthMode language={profile.language} onBack={() => setScreen('home')} onNavigate={setScreen} />;
      case 'companion':
        return <Companion language={profile.language} profile={profile} onBack={() => setScreen('home')} />;
      case 'isochronic':
        return <IsochronicTones language={profile.language} onBack={() => setScreen('home')} />;
      case 'kit':
        return <Kit language={profile.language} onBack={() => setScreen('home')} />;
      case 'books':
        return <Books language={profile.language} onBack={() => setScreen('home')} />;
      case 'sensory-log':
        return <SensoryLog language={profile.language} onBack={() => setScreen('home')} />;
      case 'premium':
        return <Premium language={profile.language} onBack={() => setScreen('home')} />;
      case 'settings':
        return (
          <Settings 
            profile={profile}
            theme={theme}
            onUpdate={handleUpdateProfile}
            onToggleSensitivity={handleToggleSensitivity}
            onToggleTheme={handleToggleTheme}
            onBack={() => setScreen('home')}
            onOpenInstallModal={() => setIsInstallModalOpen(true)}
          />
        );
      default:
        return (
          <Home 
            energy={energy} 
            language={profile.language} 
            theme={theme}
            onNavigate={setScreen} 
            onOpenEnergy={() => setIsEnergyModalOpen(true)} 
            onOpenMenu={() => setIsMenuOpen(true)}
            onToggleTheme={handleToggleTheme}
            onOpenInstallModal={() => setIsInstallModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-transparent text-slate-100 font-sans overflow-hidden select-none flex flex-col transition-colors">
      {storageFull && (
        <div role="alert" className="fixed top-0 inset-x-0 z-[180] bg-amber-500 text-slate-950 text-xs font-bold p-3 text-center shadow-lg">
          {profile.language === 'es'
            ? 'No se pudo guardar: el almacenamiento del dispositivo está lleno. Borra fotos o datos que no uses.'
            : 'Could not save: device storage is full. Remove photos or data you do not use.'}
          <button onClick={() => setStorageFull(false)} className="ml-3 underline cursor-pointer">OK</button>
        </div>
      )}

      {emergencyWarning && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-3 inset-x-4 max-w-sm mx-auto z-[190] bg-rose-950/95 border border-rose-500/50 p-4 rounded-2xl text-white shadow-2xl flex items-center justify-between gap-3"
        >
          <div className="text-xs">
            <p className="font-bold text-rose-300">
              {profile.language === 'es' ? 'Contacto no configurado' : 'No contact configured'}
            </p>
            <p className="text-[11px] text-slate-300 mt-0.5">
              {profile.language === 'es' ? 'Por favor ingresa un contacto en Ajustes.' : 'Please add a contact in Settings.'}
            </p>
          </div>
          <button
            onClick={() => {
              setEmergencyWarning(false);
              setScreen('settings');
            }}
            className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs shrink-0 cursor-pointer"
          >
            {profile.language === 'es' ? 'Configurar' : 'Configure'}
          </button>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        <div key={screen} className="flex-1 h-full overflow-hidden w-full max-w-md mx-auto relative flex flex-col">
          <Suspense fallback={null}>{renderScreen()}</Suspense>
        </div>
      </AnimatePresence>

      <AnimatePresence>
        {isMenuOpen && (
          <HamburgerMenu 
            isOpen={isMenuOpen} 
            onClose={() => setIsMenuOpen(false)} 
            profile={profile} 
            energy={energy} 
            theme={theme}
            onNavigate={setScreen} 
            onOpenEnergy={() => setIsEnergyModalOpen(true)} 
            onToggleLanguage={handleToggleLanguage}
            onToggleTheme={handleToggleTheme}
          />
        )}
        {isEnergyModalOpen && (
          <EnergyModal 
            language={profile.language} 
            onSetEnergy={handleSetEnergy} 
            onClose={() => setIsEnergyModalOpen(false)} 
          />
        )}
        {activeCard && (
          <FullCardOverlay 
            language={profile.language} 
            card={activeCard} 
            onClose={() => setActiveCard(null)} 
          />
        )}
      </AnimatePresence>

      <PWAInstallModal 
        isOpen={isInstallModalOpen} 
        onClose={() => setIsInstallModalOpen(false)} 
        language={profile.language} 
      />

      {screen !== 'splash' && screen !== 'cave' && (
        <SpoonWidget 
          language={profile.language} 
          onNavigate={setScreen}
          onActivateCave={() => setScreen('cave')}
        />
      )}
    </div>
  );
}
