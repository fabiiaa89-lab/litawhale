/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Screen, EnergyLevel, Profile, Med, AACCard, SensitivityProfile, Language, Debt } from './types';
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
import Header from './components/Header';
import { AnimatePresence } from 'motion/react';
import { i18n } from './i18n';

import Settings from './components/screens/Settings';
import SplashScreen from './components/SplashScreen';
import SOSData from './components/screens/SOSData';
import NeuralCortex from './components/screens/NeuralCortex';
import Debts from './components/screens/Debts';
import StealthMode from './components/screens/StealthMode';
import Companion from './components/screens/Companion';
import IsochronicTones from './components/screens/IsochronicTones';
import HamburgerMenu from './components/HamburgerMenu';
import PWAInstallModal from './components/PWAInstallModal';
import SpoonWidget from './components/SpoonWidget';
import Kit from './components/screens/Kit';
import Books from './components/screens/Books';
import SensoryLog from './components/screens/SensoryLog';
import Premium from './components/screens/Premium';

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');
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
      country: detectedLang === 'es' ? 'España' : 'United States',
      currency: detectedLang === 'es' ? 'EUR' : 'USD',
      currencySymbol: detectedLang === 'es' ? '€' : '$'
    };
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.language !== 'es' && parsed.language !== 'en') {
        parsed.language = detectedLang;
      }
      return { ...defaultProfile, ...parsed };
    }
    return defaultProfile;
  });

  const [cards, setCards] = useState<AACCard[]>(() => {
    const saved = localStorage.getItem('ns_cards');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return i18n[profile.language].aacCards;
  });

  const [meds, setMeds] = useState<Med[]>(() => {
    const saved = localStorage.getItem('ns_meds');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      {
        id: 'med-1',
        name: 'Clonazepam / SOS Med',
        dose: '0.5mg',
        time: '🚨 En Crisis / SOS',
        confirmed: false,
        icon: 'sos'
      },
      {
        id: 'med-2',
        name: 'Sertralina / Diaria',
        dose: '50mg',
        time: '🌅 Mañana · 08:00',
        confirmed: false,
        icon: 'capsule'
      }
    ];
  });

  const [debts, setDebts] = useState<Debt[]>(() => {
    const saved = localStorage.getItem('ns_debts');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setScreen('home');
    }, 2500); // ~2 seconds splash
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('ns_profile', JSON.stringify(profile));
    } catch (e) {
      console.warn("Could not save profile to localStorage:", e);
    }
    document.body.setAttribute('data-sensitivity', profile.sensitivity);
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('ns_cards', JSON.stringify(cards));
    } catch (e) {
      console.warn("Could not save cards to localStorage:", e);
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
    }
  }, [meds]);

  useEffect(() => {
    try {
      localStorage.setItem('ns_debts', JSON.stringify(debts));
    } catch (e) {
      console.warn("Could not save debts to localStorage:", e);
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
      alert("Configura un contacto de emergencia.");
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
            onNavigate={setScreen} 
            onOpenEnergy={() => setIsEnergyModalOpen(true)} 
            onOpenMenu={() => setIsMenuOpen(true)}
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
            onUpdate={handleUpdateProfile}
            onToggleSensitivity={handleToggleSensitivity}
            onBack={() => setScreen('home')}
            onOpenInstallModal={() => setIsInstallModalOpen(true)}
          />
        );
      default:
        return (
          <Home 
            energy={energy} 
            language={profile.language} 
            onNavigate={setScreen} 
            onOpenEnergy={() => setIsEnergyModalOpen(true)} 
            onOpenMenu={() => setIsMenuOpen(true)}
          />
        );
    }
  };
  return (
    <div className="h-[100dvh] w-full bg-gradient-to-br from-[#1a1c2c] via-[#4a192c] to-[#121212] text-slate-200 font-sans overflow-hidden select-none flex flex-col">
      <AnimatePresence mode="wait">
        <div key={screen} className="flex-1 h-full overflow-hidden w-full max-w-md mx-auto relative flex flex-col">
          {renderScreen()}
        </div>
      </AnimatePresence>

      <AnimatePresence>
        {isMenuOpen && (
          <HamburgerMenu 
            isOpen={isMenuOpen} 
            onClose={() => setIsMenuOpen(false)} 
            profile={profile} 
            energy={energy} 
            onNavigate={setScreen} 
            onOpenEnergy={() => setIsEnergyModalOpen(true)} 
            onToggleLanguage={handleToggleLanguage}
          />
        )}
        {isEnergyModalOpen && (
          <EnergyModal language={profile.language} onSetEnergy={handleSetEnergy} onClose={() => setIsEnergyModalOpen(false)} 
          />
        )}
        {activeCard && (
          <FullCardOverlay language={profile.language} card={activeCard} onClose={() => setActiveCard(null)} 
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
