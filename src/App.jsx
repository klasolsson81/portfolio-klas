import React, { Suspense, useState, useEffect } from 'react';
import NodeNetwork from './components/NodeNetwork';
import HeroStage from './components/HeroStage';
import FloatingCode from './components/FloatingCode';
import InstallPrompt from './components/InstallPrompt';
import CookieConsent from './components/CookieConsent';
import PrivacyPolicy from './components/PrivacyPolicy';
import ErrorBoundary from './components/ErrorBoundary';
import { Toaster } from 'sonner';
// Importera TRANSLATIONS för att komma åt FAQ-datan
import { TRANSLATIONS } from './translations';

function App() {
  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState('sv');
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  // Skapa en genväg till den aktiva språkversionen
  const t = TRANSLATIONS[lang];

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
    <main className={`relative w-full min-h-screen md:h-screen md:flex md:flex-col overflow-x-hidden font-sans transition-colors duration-700
      ${isDark
        ? 'bg-transparent selection:bg-neon-cyan selection:text-black'
        : 'bg-transparent selection:bg-purple-200 selection:text-purple-900'}`}>

      {/* Wrapper för huvudinnehållet som tar upp allt tillgängligt utrymme */}
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

      {/* DOLD GEO-SEKTION FÖR AI-SÖKMOTORER (ChatGPT, Gemini, etc.) 
          Denna sektion är osynlig för användare men läsbar för crawlers.
      */}
      <section style={{ 
        position: 'absolute', 
        width: '1px', 
        height: '1px', 
        padding: '0', 
        margin: '-1px', 
        overflow: 'hidden', 
        clip: 'rect(0, 0, 0, 0)', 
        border: '0' 
      }} aria-hidden="true">
        <h2>FAQ - .NET Utvecklare & AI-konsult i Göteborg</h2>
        <article>
          <h3>{t.faq.q1}</h3>
          <p>{t.faq.a1}</p>
        </article>
        <article>
          <h3>{t.faq.q2}</h3>
          <p>{t.faq.a2}</p>
        </article>
        <article>
          <h3>{t.faq.q3}</h3>
          <p>{t.faq.a3}</p>
        </article>
        <article>
          <h3>{t.faq.q4}</h3>
          <p>{t.faq.a4}</p>
        </article>
      </section>

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

      {/* Footer */}
      <footer className={`relative py-6 md:py-8 w-full text-center text-sm z-[20] transition-colors duration-300 leading-relaxed
        ${isDark ? 'text-gray-400' : 'text-warm-text/60'}`}>
        <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
          <span className="pointer-events-none">
            &copy; {new Date().getFullYear()} Klas Olsson • Built with React, Three.js & AI
          </span>
          <span className="hidden md:inline mx-2 pointer-events-none">•</span>
          <a
            href="/privacy-policy"
            className={`pointer-events-auto underline hover:no-underline transition-all duration-200 font-medium
              ${isDark ? 'hover:text-neon-cyan' : 'hover:text-purple-700'}`}
          >
            {lang === 'sv' ? 'Integritetspolicy' : 'Privacy Policy'}
          </a>
        </div>
      </footer>

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