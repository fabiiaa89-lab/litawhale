import { useState, useEffect } from 'react';

export interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  isSafari: boolean;
  installApp: () => Promise<'accepted' | 'dismissed' | 'show_ios_guide' | 'unsupported'>;
}

let deferredPromptGlobal: any = null;

export function usePWA(): PWAState {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed)
    const checkStandalone = () => {
      const isStandaloneMode = 
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://');
      
      setIsInstalled(isStandaloneMode);
    };

    checkStandalone();

    // Device detection
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isSafariBrowser = /safari/.test(userAgent) && !/chrome|crios|fxios|edg/.test(userAgent);

    setIsIOS(isIosDevice);
    setIsSafari(isSafariBrowser);

    // If on iOS and not installed, it is installable via Safari manual action
    if (isIosDevice && !isInstalled) {
      setIsInstallable(true);
    }

    // Capture beforeinstallprompt for Chrome / Android / Edge / Desktop
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPromptGlobal = e;
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      deferredPromptGlobal = null;
      setIsInstalled(true);
      setIsInstallable(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

  const installApp = async (): Promise<'accepted' | 'dismissed' | 'show_ios_guide' | 'unsupported'> => {
    if (deferredPromptGlobal) {
      try {
        deferredPromptGlobal.prompt();
        const choiceResult = await deferredPromptGlobal.userChoice;
        if (choiceResult.outcome === 'accepted') {
          deferredPromptGlobal = null;
          setIsInstallable(false);
          setIsInstalled(true);
          return 'accepted';
        } else {
          return 'dismissed';
        }
      } catch (err) {
        console.error('PWA install error:', err);
      }
    }

    if (isIOS) {
      return 'show_ios_guide';
    }

    return 'unsupported';
  };

  return {
    isInstallable,
    isInstalled,
    isIOS,
    isSafari,
    installApp,
  };
}
