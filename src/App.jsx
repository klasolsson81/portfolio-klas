import React, { Suspense, useState, useEffect, lazy } from 'react';
import HeroStage from './components/HeroStage';
import { Toaster } from 'sonner';
import { TRANSLATIONS } from './components/data/translations.js';
import ErrorBoundary from './components/ErrorBoundary';

// LAZY LOADING: Vi laddar tunga delar i bakgrunden för att fixa INP (Interaction to Next Paint)
const NodeNetwork = lazy(() => import('./components/NodeNetwork'));
const FloatingCode = lazy(() => import('./components/FloatingCode'));
const InstallPrompt = lazy(() => import('./components/InstallPrompt'));
const CookieConsent = lazy(() => import('./components/CookieConsent'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));

function App() {
  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState('sv');
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  
  // SENSOR: Känner av om användaren är på en svag mobil (viktigt för Indien/Bangladesh-trafik)
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    // Detektera långsamma nätverk (2G/3G) eller "Spara Data"-läge
    const isSlowConnection = navigator.connection && (navigator.connection.saveData || /2g|3g/.test(navigator.connection.effectiveType));
    // Detektera om användaren vill ha minskad rörelse
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Detektera äldre mobiler (en enkel koll)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isSlowConnection || prefersReducedMotion || (isMobile && !window.chrome)) {
      setIsLowPowerMode(true);
    }
  }, []);

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

      <div className="hero-card-container flex-1 relative flex flex-col min-h-0">
        {/* Ladda bara 3D-bakgrunden om enheten orkar med det */}
        {!isLowPowerMode && (
          <Suspense fallback={<div className="fixed inset-0" />}>
            <ErrorBoundary componentName="NodeNetwork" isDark={isDark}>
              <NodeNetwork isDark={isDark} />
            </ErrorBoundary>
          </Suspense>
        )}

        <Suspense fallback={null}>
          <ErrorBoundary componentName="FloatingCode" isDark={isDark}>
            <FloatingCode isDark={isDark} />
          </ErrorBoundary>
        </Suspense>

        <ErrorBoundary componentName="HeroStage" isDark={isDark} showHomeButton>
          {/* Vi skickar med isLowPowerMode så HeroStage kan anpassa sig */}
          <HeroStage isDark={isDark} toggleTheme={toggleTheme} lang={lang} toggleLang={toggleLang} isLowPowerMode={isLowPowerMode} />
        </ErrorBoundary>
      </div>

      {/* DOLD SEO-TEXT FÖR GOOGLE & AI-BOTAR */}
      <section style={{ position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', border: '0' }} aria-hidden="true">
        <h2>FAQ - .NET Utvecklare & AI-konsult i Göteborg</h2>
        <article><h3>{t.faq.q1}</h3><p>{t.faq.a1}</p></article>
        <article><h3>{t.faq.q2}</h3><p>{t.faq.a2}</p></article>
        <article><h3>{t.faq.q3}</h3><p>{t.faq.a3}</p></article>
        <article><h3>{t.faq.q4}</h3><p>{t.faq.a4}</p></article>
      </section>

      <Suspense fallback={null}>
        <InstallPrompt isDark={isDark} lang={lang} />
        <CookieConsent isDark={isDark} lang={lang} />
        <PrivacyPolicy isOpen={showPrivacyPolicy} onClose={() => setShowPrivacyPolicy(false)} isDark={isDark} lang={lang} />
      </Suspense>

      <footer className={`relative py-3 md:py-4 w-full text-center text-xs z-[20] transition-colors duration-300
        ${isDark ? 'text-gray-400' : 'text-warm-text/60'}`}>
        <div className="flex items-center justify-center gap-4">
          <span className="opacity-80">&copy; {new Date().getFullYear()} Klas Olsson</span>
          <span className="opacity-30">•</span>
          <a href="/privacy-policy" className={`underline hover:no-underline transition-colors duration-200 font-medium ${isDark ? 'hover:text-neon-cyan' : 'hover:text-purple-700'}`}>
            {lang === 'sv' ? 'Integritetspolicy' : 'Privacy Policy'}
          </a>
        </div>
      </footer>

      <Toaster theme={isDark ? "dark" : "light"} position="bottom-center" />
    </main>
  );
}

export default App;