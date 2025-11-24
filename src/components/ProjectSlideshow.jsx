import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Terminal, Lightbulb, AlertTriangle, BookOpen } from 'lucide-react';

const ProjectSlideshow = ({ isOpen, onClose, slides, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
    }
  }, [isOpen, title]);

  if (!isOpen || !slides) return null;

  const nextSlide = () => {
    if (currentIndex < slides.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const prevSlide = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const currentSlide = slides[currentIndex] || slides[0];

  const getIcon = (type) => {
    switch(type) {
      case 'problem': return <AlertTriangle className="text-red-400" size={28} />;
      case 'solution': return <Lightbulb className="text-yellow-400" size={28} />;
      case 'code': return <Terminal className="text-neon-cyan" size={28} />;
      case 'learning': return <BookOpen className="text-neon-purple" size={28} />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-2 md:p-4" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-6xl bg-[#0a0b1e] border border-white/10 rounded-xl md:rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[95vh] md:h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-white/10 flex justify-between items-center bg-black/30">
          <div>
            <h2 className="text-lg md:text-2xl font-bold text-white tracking-tight truncate max-w-[250px] md:max-w-none">{title}</h2>
            <p className="text-xs text-gray-400 uppercase tracking-wider mt-1 font-mono">
              Sida {currentIndex + 1} / {slides.length}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className={`h-full flex flex-col gap-6 md:gap-8 ${currentSlide.image ? 'lg:flex-row lg:items-start' : ''}`}
            >
              
              {/* Text & Kod */}
              <div className={`flex flex-col gap-4 md:gap-6 ${currentSlide.image ? 'lg:w-1/2' : 'w-full'}`}>
                <div className="flex items-center gap-3 border-b border-white/10 pb-3 md:pb-4">
                  {getIcon(currentSlide.type)}
                  <h3 className={`text-xl md:text-3xl font-bold ${currentSlide.type === 'problem' ? 'text-red-400' : currentSlide.type === 'solution' ? 'text-yellow-400' : 'text-neon-cyan'}`}>
                    {currentSlide.title}
                  </h3>
                </div>

                <div className="text-gray-300 text-sm md:text-lg leading-relaxed space-y-4">
                  {currentSlide.content}
                </div>

                {currentSlide.code && (
                  <div className="bg-black/60 border border-white/10 rounded-xl p-3 md:p-4 font-mono text-xs md:text-sm overflow-x-auto custom-scrollbar text-gray-300 shadow-inner">
                    <pre>{currentSlide.code}</pre>
                  </div>
                )}
              </div>

              {/* Bild */}
              {currentSlide.image && (
                <div className="lg:w-1/2 flex items-center justify-center bg-black/20 rounded-xl border border-white/5 p-2 md:p-4 min-h-[250px] md:h-full">
                  <img 
                    src={currentSlide.image} 
                    alt="Project Screenshot" 
                    className="w-full h-full object-contain rounded-lg shadow-lg" 
                  />
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* --- FOOTER CONTROLS (HÄR ÄR ÄNDRINGARNA) --- */}
        <div className="p-4 md:p-6 border-t border-white/10 bg-black/30 flex justify-between items-center gap-4">
          
          {/* KNAPP: FÖREGÅENDE */}
          <button 
            onClick={prevSlide} 
            disabled={currentIndex === 0}
            aria-label="Föregående slide"
            // ÄNDRING: På mobil (default): Stor, rund knapp med bakgrund (p-4, rounded-full, bg-white/10). 
            // På desktop (md:): Avlång knapp utan bakgrund (md:px-5, md:py-2.5, md:rounded-lg, md:bg-transparent).
            className="flex items-center justify-center gap-2 p-4 md:px-5 md:py-2.5 rounded-full md:rounded-lg bg-white/10 md:bg-transparent hover:bg-white/20 md:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-gray-300 transition-all"
          >
            {/* ÄNDRING: Stor ikon på mobil (w-8 h-8), mindre på desktop (md:w-5 md:h-5) */}
            <ChevronLeft className="w-8 h-8 md:w-5 md:h-5" />
            {/* ÄNDRING: Texten visas bara på desktop (hidden md:inline) */}
            <span className="hidden md:inline font-medium">Föregående</span>
          </button>

          {/* Dots Indicator */}
          <div className="flex gap-1.5 md:gap-2 shrink-0">
            {slides.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-neon-cyan w-6 md:w-8' : 'bg-white/20 w-1.5 md:w-2'}`}
              />
            ))}
          </div>

          {/* KNAPP: NÄSTA */}
          <button 
            onClick={nextSlide} 
            disabled={currentIndex === slides.length - 1}
            aria-label="Nästa slide"
            // ÄNDRING: Samma princip här. Stor rund knapp på mobil.
            className="flex items-center justify-center gap-2 p-4 md:px-5 md:py-2.5 rounded-full md:rounded-lg bg-neon-purple text-white shadow-lg shadow-neon-purple/30 hover:bg-neon-cyan hover:text-black hover:shadow-neon-cyan/30 disabled:opacity-30 disabled:cursor-not-allowed disabled:bg-transparent disabled:border-transparent disabled:text-gray-500 transition-all"
          >
            {/* ÄNDRING: Texten visas bara på desktop */}
            <span className="hidden md:inline font-bold">Nästa</span>
            {/* ÄNDRING: Stor ikon på mobil */}
            <ChevronRight className="w-8 h-8 md:w-5 md:h-5" />
          </button>
        </div>

      </motion.div>
    </div>
  );
};

export default ProjectSlideshow;