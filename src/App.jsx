import React, { Suspense, useState, useEffect } from 'react';
import NodeNetwork from './components/NodeNetwork';
import HeroStage from './components/HeroStage';
import FloatingCode from './components/FloatingCode';
import InstallPrompt from './components/InstallPrompt';
import CookieConsent from './components/CookieConsent';
import PrivacyPolicy from './components/PrivacyPolicy';
import ErrorBoundary from './components/ErrorBoundary';
import { Toaster } from 'sonner';

// FIX: Ändrad sökväg för att matcha din filstruktur i image_25d109.png
import { TRANSLATIONS } from './components/data/translations.js';

function App() {
  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState('sv');
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  // Språkhantering baserat på translations.js
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    const userLang = navigator.language || navigator.userLanguage;
    if (!userLang.startsWith('sv')) {
      setLang('en');
    }
  }, []);

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
    <main className={`relative w-full min-h-screen md:h-screen md:flex md:flex-col overflow-x-hidden font-sans transition-colors duration-700
      ${isDark ? 'bg-transparent selection:bg-neon-cyan selection:text-black' : 'bg-transparent selection:bg-purple-200 selection:text-purple-900'}`}>

      <div className="flex-1 relative flex flex-col min-h-0">
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
      </div>

      {/* DOLD GEO-SEKTION FÖR AI-SÖKMOTORER */}
      <section style={{ position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', border: '0' }} aria-hidden="true">
        <h2>FAQ - .NET Utvecklare & AI-konsult i Göteborg</h2>
        <article><h3>{t.faq.q1}</h3><p>{t.faq.a1}</p></article>
        <article><h3>{t.faq.q2}</h3><p>{t.faq.a2}</p></article>
        <article><h3>{t.faq.q3}</h3><p>{t.faq.a3}</p></article>
        <article><h3>{t.faq.q4}</h3><p>{t.faq.a4}</p></article>
      </section>

      <InstallPrompt isDark={isDark} lang={lang} />
      <CookieConsent isDark={isDark} lang={lang} />
      <PrivacyPolicy isOpen={showPrivacyPolicy} onClose={() => setShowPrivacyPolicy(false)} isDark={isDark} lang={lang} />


      <footer className={`relative py-6 md:py-8 w-full text-center text-sm z-[20] transition-colors duration-300
        ${isDark ? 'text-gray-400' : 'text-warm-text/60'}`}>
        <div className="flex items-center justify-center gap-2">
          <span>&copy; {new Date().getFullYear()} Klas Olsson</span>
          <span className="mx-1 opacity-50">•</span>
          <a 
            href="/privacy-policy" 
            className={`underline hover:no-underline transition-colors duration-200
              ${isDark ? 'hover:text-neon-cyan' : 'hover:text-purple-700'}`}
          >
            {lang === 'sv' ? 'Integritetspolicy' : 'Privacy Policy'}
          </a>
        </div>
      </footer>

      <Toaster theme={isDark ? "dark" : "light"} position="bottom-center" />
    </main>
  );
}

export default App;