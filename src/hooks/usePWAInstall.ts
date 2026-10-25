import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // 1. Detect standalone mode (already running as installed PWA on iPhone Home Screen or Android)
    const checkIsStandalone = () => {
      const isStandaloneMedia =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(display-mode: standalone)').matches;

      const isIOSStandalone =
        typeof window !== 'undefined' &&
        (window.navigator as unknown as { standalone?: boolean }).standalone === true;

      const isSavedAsInstalled =
        typeof window !== 'undefined' &&
        localStorage.getItem('zone_app_installed') === 'true';

      return Boolean(isStandaloneMedia || isIOSStandalone || isSavedAsInstalled);
    };

    setIsInstalled(checkIsStandalone());

    // Listen for display mode changes (e.g. user installs and launches)
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(display-mode: standalone)');
      const handleMediaChange = (e: MediaQueryListEvent) => {
        if (e.matches) {
          setIsInstalled(true);
          try {
            localStorage.setItem('zone_app_installed', 'true');
          } catch {}
        }
      };
      mediaQuery.addEventListener('change', handleMediaChange);

      // Detect iOS devices (iPhone, iPad, iPod)
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
      setIsIOS(isIOSDevice);

      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
      };

      const handleAppInstalled = () => {
        setIsInstalled(true);
        setDeferredPrompt(null);
        try {
          localStorage.setItem('zone_app_installed', 'true');
        } catch {}
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);

      return () => {
        mediaQuery.removeEventListener('change', handleMediaChange);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }
  }, []);

  const markAsInstalled = () => {
    setIsInstalled(true);
    setDeferredPrompt(null);
    try {
      localStorage.setItem('zone_app_installed', 'true');
    } catch {}
  };

  const install = async () => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      markAsInstalled();
      return true;
    }
    return false;
  };

  return {
    isInstallable: !!deferredPrompt,
    isInstalled,
    isIOS,
    install,
    markAsInstalled,
  };
}
