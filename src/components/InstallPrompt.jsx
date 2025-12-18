import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InstallPrompt = ({ isDark, lang }) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show our custom install prompt
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA install accepted');
    } else {
      console.log('PWA install dismissed');
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Store dismissal in localStorage to not show again for 7 days
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Check if user dismissed recently (within 7 days)
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - dismissedTime < sevenDays) {
        setShowPrompt(false);
      }
    }
  }, []);

  const text = {
    sv: {
      title: 'Installera Appen',
      description: 'Lägg till min portfolio på din hemskärm för snabb åtkomst offline!',
      install: 'Installera',
      later: 'Senare'
    },
    en: {
      title: 'Install App',
      description: 'Add my portfolio to your home screen for quick offline access!',
      install: 'Install',
      later: 'Later'
    }
  };

  const t = text[lang] || text.sv;

  return (
    <AnimatePresence>
      {showPrompt && deferredPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50"
        >
          <div
            className={`rounded-xl p-4 shadow-2xl border backdrop-blur-xl transition-colors duration-300
              ${isDark
                ? 'bg-[#1a1b2e]/95 border-white/10 shadow-neon-purple/20'
                : 'bg-white/95 border-purple-200/50 shadow-purple-500/20'}`}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0
                  ${isDark
                    ? 'bg-neon-purple/20 text-neon-purple'
                    : 'bg-purple-100 text-purple-600'}`}
              >
                <Download size={20} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3
                  className={`font-bold text-sm mb-1 ${isDark ? 'text-white' : 'text-purple-900'}`}
                >
                  {t.title}
                </h3>
                <p
                  className={`text-xs leading-relaxed ${isDark ? 'text-gray-300' : 'text-purple-700'}`}
                >
                  {t.description}
                </p>

                {/* Buttons */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleInstall}
                    className={`flex-1 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-md hover:shadow-lg
                      ${isDark
                        ? 'bg-neon-purple text-white hover:bg-neon-cyan hover:text-black shadow-neon-purple/30 hover:shadow-neon-cyan/30'
                        : 'bg-purple-600 text-white hover:bg-purple-700 shadow-purple-500/30 hover:shadow-purple-600/30'}`}
                  >
                    {t.install}
                  </button>
                  <button
                    onClick={handleDismiss}
                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors
                      ${isDark
                        ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                        : 'bg-purple-100/50 text-purple-600 hover:bg-purple-100 hover:text-purple-700'}`}
                  >
                    {t.later}
                  </button>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={handleDismiss}
                className={`shrink-0 p-1 rounded-full transition-colors
                  ${isDark
                    ? 'text-gray-500 hover:text-white hover:bg-white/10'
                    : 'text-purple-400 hover:text-purple-700 hover:bg-purple-100'}`}
                aria-label={lang === 'sv' ? 'Stäng' : 'Close'}
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstallPrompt;
