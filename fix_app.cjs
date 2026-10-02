const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `  return (
    <div className="h-screen bg-black flex items-center justify-center select-none font-sans overflow-hidden">
      <div className="w-full h-full sm:h-[90vh] max-w-md sm:rounded-[40px] shadow-2xl relative bg-gradient-to-br from-[#1a1c2c] via-[#4a192c] to-[#121212] text-slate-200 overflow-hidden sm:border border-white/10 flex flex-col">
        <AnimatePresence mode="wait">
          <div key={screen} className="flex-1 h-full overflow-hidden">
            {renderScreen()}
          </div>
        </AnimatePresence>

        <AnimatePresence>
          {isEnergyModalOpen && (
            <EnergyModal 
              onSetEnergy={handleSetEnergy} 
              onClose={() => setIsEnergyModalOpen(false)} 
            />
          )}
          {activeCard && (
            <FullCardOverlay 
              card={activeCard} 
              onClose={() => setActiveCard(null)} 
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );`;

const newStr = `  return (
    <div className="h-[100dvh] w-full bg-gradient-to-br from-[#1a1c2c] via-[#4a192c] to-[#121212] text-slate-200 font-sans overflow-hidden select-none flex flex-col">
      <AnimatePresence mode="wait">
        <div key={screen} className="flex-1 h-full overflow-hidden w-full max-w-md mx-auto relative flex flex-col">
          {renderScreen()}
        </div>
      </AnimatePresence>

      <AnimatePresence>
        {isEnergyModalOpen && (
          <EnergyModal 
            onSetEnergy={handleSetEnergy} 
            onClose={() => setIsEnergyModalOpen(false)} 
          />
        )}
        {activeCard && (
          <FullCardOverlay 
            card={activeCard} 
            onClose={() => setActiveCard(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );`;

// Let's do a more robust replace by slicing everything after return (
const returnIndex = content.lastIndexOf("  return (");
const beforeReturn = content.slice(0, returnIndex);
fs.writeFileSync('src/App.tsx', beforeReturn + newStr + '\n}\n');
