import React, { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CookieConsent = ({ isDark, lang, onConsentChange }) => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already given/denied consent
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Show banner after 1 second delay (less intrusive)
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    } else {
      // Notify parent about existing consent
      onConsentChange(consent === 'accepted');
    }
  }, [onConsentChange]);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowBanner(false);
    if (onConsentChange) onConsentChange(true);
    // Reload to apply analytics (only happens once)
    window.location.reload();
  };

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setShowBanner(false);
    if (onConsentChange) onConsentChange(false);
    // No reload needed for rejection
  };

  const text = {
    sv: {
      title: 'Cookies & Integritet',
      description: 'Vi använder cookies för analytics (Vercel), prestanda (Speed Insights) och spam-skydd (reCAPTCHA). AI-chatten skickar frågor till OpenAI.',
      accept: 'Acceptera',
      reject: 'Endast nödvändiga',
      privacy: 'Integritetspolicy'
    },
    en: {
      title: 'Cookies & Privacy',
      description: 'We use cookies for analytics (Vercel), performance (Speed Insights), and spam protection (reCAPTCHA). AI chat sends questions to OpenAI.',
      accept: 'Accept',
      reject: 'Essential only',
      privacy: 'Privacy Policy'
    }
  };

  const t = text[lang] || text.sv;

  return (
    <AnimatePresence>
      {showBanner && (
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
                    ? 'bg-neon-cyan/20 text-neon-cyan'
                    : 'bg-purple-100 text-purple-600'}`}
              >
                <Cookie size={20} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3
                  className={`font-bold text-sm mb-1 ${isDark ? 'text-white' : 'text-purple-900'}`}
                >
                  {t.title}
                </h3>
                <p
                  className={`text-xs leading-relaxed mb-2 ${isDark ? 'text-gray-300' : 'text-purple-700'}`}
                >
                  {t.description}
                </p>

                {/* Privacy Policy Link */}
                <a
                  href="/privacy-policy"
                  className={`text-xs underline hover:no-underline transition-colors
                    ${isDark ? 'text-neon-cyan hover:text-white' : 'text-purple-600 hover:text-purple-800'}`}
                >
                  {t.privacy}
                </a>

                {/* Buttons */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleAccept}
                    className={`flex-1 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-md hover:shadow-lg
                      ${isDark
                        ? 'bg-neon-cyan text-black hover:bg-neon-purple hover:text-white shadow-neon-cyan/30 hover:shadow-neon-purple/30'
                        : 'bg-purple-600 text-white hover:bg-purple-700 shadow-purple-500/30 hover:shadow-purple-600/30'}`}
                  >
                    {t.accept}
                  </button>
                  <button
                    onClick={handleReject}
                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors
                      ${isDark
                        ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                        : 'bg-purple-100/50 text-purple-600 hover:bg-purple-100 hover:text-purple-700'}`}
                  >
                    {t.reject}
                  </button>
                </div>
              </div>

              {/* Close button (reject) */}
              <button
                onClick={handleReject}
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

export default CookieConsent;
