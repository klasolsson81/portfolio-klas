import React, { Suspense, useState, useEffect } from 'react';
import NodeNetwork from './components/NodeNetwork';
import HeroStage from './components/HeroStage';
import FloatingCode from './components/FloatingCode';
import InstallPrompt from './components/InstallPrompt';
import CookieConsent from './components/CookieConsent';
import PrivacyPolicy from './components/PrivacyPolicy';
import ErrorBoundary from './components/ErrorBoundary';
import { Toaster } from 'sonner';

function App() {
  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState('sv');
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  // Theme management
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Language detection
  useEffect(() => {
    const userLang = navigator.language || navigator.userLanguage;
    if (!userLang.startsWith('sv')) {
      setLang('en');
    }
  }, []);

  // Handle privacy policy links
  useEffect(() => {
    const handlePrivacyClick = (e) => {
      if (e.target.getAttribute('href') === '/privacy-policy') {
        e.preventDefault();
        setShowPrivacyPolicy(true);
      }
    };

    document.addEventListener('click', handlePrivacyClick);
    return () => document.removeEventListener('click', handlePrivacyClick);
  }, []);

  const toggleTheme = () => setIsDark(!isDark);
  const toggleLang = () => setLang(l => l === 'sv' ? 'en' : 'sv');

  return (
    // BG-TRANSPARENT för BÅDA teman - låter body CSS visa gradient-bakgrunden
    <main className={`relative w-full min-h-screen overflow-hidden font-sans transition-colors duration-700
      ${isDark
        ? 'bg-transparent selection:bg-neon-cyan selection:text-black'
        : 'bg-transparent selection:bg-purple-200 selection:text-purple-900'}`}>

      <ErrorBoundary componentName="NodeNetwork" isDark={isDark}>
        <Suspense fallback={<div className="fixed inset-0" />}>
          <NodeNetwork isDark={isDark} />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary componentName="FloatingCode" isDark={isDark}>
        <FloatingCode isDark={isDark} />
      </ErrorBoundary>

      <ErrorBoundary componentName="HeroStage" isDark={isDark} showHomeButton>
        <HeroStage isDark={isDark} toggleTheme={toggleTheme} lang={lang} toggleLang={toggleLang} />
      </ErrorBoundary>

      {/* PWA Install Prompt */}
      <InstallPrompt isDark={isDark} lang={lang} />

      {/* GDPR Cookie Consent */}
      <CookieConsent isDark={isDark} lang={lang} />

      {/* Privacy Policy Modal */}
      <PrivacyPolicy
        isOpen={showPrivacyPolicy}
        onClose={() => setShowPrivacyPolicy(false)}
        isDark={isDark}
        lang={lang}
      />

      <div className={`fixed bottom-2 w-full text-center text-[10px] z-20 transition-colors duration-300
        ${isDark ? 'text-gray-600' : 'text-warm-text/40'}`}>
        <span className="pointer-events-none">
          &copy; {new Date().getFullYear()} Klas Olsson • Built with React, Three.js & AI
        </span>
        <span className="mx-2 pointer-events-none">•</span>
        <a
          href="/privacy-policy"
          className={`pointer-events-auto underline hover:no-underline transition-colors
            ${isDark ? 'hover:text-neon-cyan' : 'hover:text-purple-700'}`}
        >
          {lang === 'sv' ? 'Integritetspolicy' : 'Privacy Policy'}
        </a>
      </div>

      <Toaster 
        theme={isDark ? "dark" : "light"} 
        position="bottom-center"
        toastOptions={{
          style: isDark ? {} : {
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            color: '#1A1E29',
          }
        }}
      />
    </main>
  );
}

export default App;