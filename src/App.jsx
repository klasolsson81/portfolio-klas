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
    <main className="relative w-full min-h-screen overflow-hidden font-sans selection:bg-neon-cyan selection:text-black transition-colors duration-500">
      
      {/* MÖRK BAKGRUND (3D) */}
      {isDark && (
        <Suspense fallback={<div className="fixed inset-0 bg-neon-darkbg" />}>
          <NodeNetwork />
        </Suspense>
      )}
      
      {/* LJUS BAKGRUND (Animerad Gradient) */}
      {!isDark && (
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-100 via-blue-50 to-white -z-10 animate-pulse-slow" />
      )}

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