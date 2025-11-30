import React, { Suspense, useState, useEffect } from 'react';
import NodeNetwork from './components/NodeNetwork';
import HeroStage from './components/HeroStage';
import FloatingCode from './components/FloatingCode';
import { Toaster } from 'sonner';

function App() {
  // State för tema (dark = true som standard)
  const [isDark, setIsDark] = useState(true);

  // Effekt som sätter klassen på <html>
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <main className="relative w-full min-h-screen overflow-hidden font-sans selection:bg-neon-cyan selection:text-black transition-colors duration-300">
      
      {/* 3D Bakgrund - Visas bara i mörkt läge för prestanda/stil */}
      {isDark && (
        <Suspense fallback={<div className="fixed inset-0 bg-neon-darkbg" />}>
          <NodeNetwork />
        </Suspense>
      )}
      
      {/* Ljus bakgrund (enkel gradient) */}
      {!isDark && (
        <div className="fixed inset-0 bg-gradient-to-br from-gray-100 to-gray-300 -z-10" />
      )}

      <FloatingCode isDark={isDark} />
      
      {/* Skicka ner toggle-funktionen till HeroStage */}
      <HeroStage isDark={isDark} toggleTheme={toggleTheme} />

      {/* Footer */}
      <div className={`fixed bottom-2 w-full text-center text-[10px] pointer-events-none z-10 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
        &copy; {new Date().getFullYear()} Klas Olsson • Built with React, Three.js & AI
      </div>

      <Toaster theme={isDark ? "dark" : "light"} position="bottom-center" />
    </main>
  );
}

export default App;