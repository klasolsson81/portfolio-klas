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
    // ÄNDRING: bg-transparent i light mode - låter body CSS visa gradient-bakgrunden
    <main className={`relative w-full min-h-screen overflow-hidden font-sans transition-colors duration-700 
      ${isDark 
        ? 'bg-neon-darkbg selection:bg-neon-cyan selection:text-black' 
        : 'bg-transparent selection:bg-purple-200 selection:text-purple-900'}`}>
      
      <Suspense fallback={<div className="fixed inset-0" />}>
        <NodeNetwork isDark={isDark} />
      </Suspense>

      <FloatingCode isDark={isDark} />
      
      <HeroStage isDark={isDark} toggleTheme={toggleTheme} />

      <div className={`fixed bottom-2 w-full text-center text-[10px] pointer-events-none z-20 transition-colors duration-300 
        ${isDark ? 'text-gray-600' : 'text-warm-text/40'}`}>
        &copy; {new Date().getFullYear()} Klas Olsson • Built with React, Three.js & AI
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