const fs = require('fs');

// Update App.tsx to pass `language={profile.language}` to everyone
let app = fs.readFileSync('src/App.tsx', 'utf8');

// Replace the renderScreen switch
const renderScreenStr = `const renderScreen = () => {
    switch (screen) {
      case 'home':
        return <Home energy={energy} language={profile.language} onNavigate={setScreen} onOpenEnergy={() => setIsEnergyModalOpen(true)} />;
      case 'anchor':
        return <Anchor language={profile.language} profile={profile} onBack={() => setScreen('home')} />;
      case 'body':
        return <BodyScanner language={profile.language} profile={profile} onBack={() => setScreen('home')} />;
      case 'cave':
        return <Cave language={profile.language} onExit={() => setScreen('home')} />;
      case 'haptic':
        return <Haptic language={profile.language} onBack={() => setScreen('home')} />;
      case 'cards':
        return <Cards language={profile.language} onBack={() => setScreen('home')} onShowFull={setActiveCard} />;
      case 'meds':
        return <Meds language={profile.language} meds={meds} onConfirm={handleConfirmMed} onAdd={handleAddMed} onBack={() => setScreen('home')} />;
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
        return <SplashScreen />;
      case 'sos':
        return <SOSData language={profile.language} profile={profile} onBack={() => setScreen('home')} onCall={callEmergency} />;
      case 'ai':
        return <NeuralCortex language={profile.language} profile={profile} onBack={() => setScreen('home')} />;
      case 'debts':
        return <Debts language={profile.language} debts={debts} onUpdate={setDebts} onBack={() => setScreen('home')} />;
      case 'stealth':
        return <StealthMode language={profile.language} onBack={() => setScreen('home')} />;
      case 'companion':
        return <Companion language={profile.language} profile={profile} onBack={() => setScreen('home')} />;
      case 'settings':
        return (
          <Settings 
            language={profile.language}
            profile={profile}
            onUpdate={handleUpdateProfile}
            onToggleSensitivity={handleToggleSensitivity}
            onBack={() => setScreen('home')}
          />
        );
      default:
        return <Home energy={energy} language={profile.language} onNavigate={setScreen} onOpenEnergy={() => setIsEnergyModalOpen(true)} />;
    }
  };`;

app = app.replace(/const renderScreen = \(\) => \{[\s\S]*?return <Home[\s\S]*?\}\s*?\};\s*?return/m, renderScreenStr + '\n\  return');
fs.writeFileSync('src/App.tsx', app);
console.log('App.tsx updated');
