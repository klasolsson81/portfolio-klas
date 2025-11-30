import React, { Suspense, useState, useEffect } from 'react';
import NodeNetwork from './components/NodeNetwork';
import HeroStage from './components/HeroStage';
import FloatingCode from './components/FloatingCode';
import { Toaster } from 'sonner';

function App() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    // Transition på bakgrundsfärgen för mjuk övergång
    <main className={`relative w-full min-h-screen overflow-hidden font-sans selection:bg-neon-cyan selection:text-black transition-colors duration-700 ${isDark ? 'bg-[#0a0b1e]' : 'bg-[#f3f4f6]'}`}>
      
      {/* 3D Bakgrund (Nu aktiv i BÅDA lägen, skickar med isDark) */}
      <Suspense fallback={<div className="fixed inset-0" />}>
        <NodeNetwork isDark={isDark} />
      </Suspense>

      <FloatingCode isDark={isDark} />
      
      <HeroStage isDark={isDark} toggleTheme={toggleTheme} />

      <div className={`fixed bottom-2 w-full text-center text-[10px] pointer-events-none z-10 transition-colors duration-300 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
        &copy; {new Date().getFullYear()} Klas Olsson • Built with React, Three.js & AI
      </div>

      <Toaster theme={isDark ? "dark" : "light"} position="bottom-center" />
    </main>
  );
}

export default App;