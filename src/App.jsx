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
    // bg-warm-bg för light mode, neon-darkbg för dark mode
    <main className={`relative w-full min-h-screen overflow-hidden font-sans transition-colors duration-700 
      ${isDark 
        ? 'bg-neon-darkbg selection:bg-neon-cyan selection:text-black' 
        : 'bg-warm-bg selection:bg-purple-200 selection:text-purple-900'}`}>
      
      <Suspense fallback={<div className="fixed inset-0" />}>
        <NodeNetwork isDark={isDark} />
      </Suspense>

      <FloatingCode isDark={isDark} />
      
      <HeroStage isDark={isDark} toggleTheme={toggleTheme} />

      <div className={`fixed bottom-2 w-full text-center text-[10px] pointer-events-none z-20 transition-colors duration-300 
        ${isDark ? 'text-gray-600' : 'text-warm-subtle'}`}>
        &copy; {new Date().getFullYear()} Klas Olsson • Built with React, Three.js & AI
      </div>

      <Toaster 
        theme={isDark ? "dark" : "light"} 
        position="bottom-center"
        toastOptions={{
          style: isDark ? {} : {
            background: '#fffcf8',
            border: '1px solid #e8dfd3',
            color: '#4a4036',
          }
        }}
      />
    </main>
  );
}

export default App;