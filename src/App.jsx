import React, { Suspense } from 'react';
import NodeNetwork from './components/NodeNetwork';
import HeroStage from './components/HeroStage';
import FloatingCode from './components/FloatingCode';
import { Toaster } from 'sonner';

function App() {
  return (
    <main className="relative w-full min-h-screen overflow-hidden font-sans selection:bg-neon-cyan selection:text-black">
      
      {/* 3D Background */}
      <Suspense fallback={<div className="fixed inset-0 bg-neon-darkbg" />}>
        <NodeNetwork />
      </Suspense>

      {/* NYHET: Hello World Animation */}
      <FloatingCode />

      {/* Main Content */}
      <HeroStage />

      {/* Footer */}
      <div className="fixed bottom-2 w-full text-center text-[10px] text-gray-600 pointer-events-none z-10">
        &copy; {new Date().getFullYear()} Klas Olsson • Built with React, Three.js & AI
      </div>
      <Toaster theme="dark" position="bottom-center" />
    </main>
  );
}

export default App;