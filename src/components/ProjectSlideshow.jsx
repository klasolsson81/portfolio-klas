import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Terminal, Lightbulb, AlertTriangle, BookOpen } from 'lucide-react';

const ProjectSlideshow = ({ isOpen, onClose, slides, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Nollställ index när modalen öppnas
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
    }
  }, [isOpen, title]);

  const nextSlide = useCallback(() => {
    if (slides && currentIndex < slides.length - 1) setCurrentIndex(prev => prev + 1);
  }, [currentIndex, slides]);

  const prevSlide = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  }, [currentIndex]);

  // --- NYTT: Tangentbordsnavigering (A11y) ---
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, nextSlide, prevSlide, onClose]);

  if (!isOpen || !slides) return null;

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
    // role="dialog" och aria-modal berättar för skärmläsare att detta är en popup
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-2 md:p-4" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="slideshow-title"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-6xl bg-[#0a0b1e] border border-white/10 rounded-xl md:rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[95vh] md:h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        
        <div className="p-4 md:p-6 border-b border-white/10 flex justify-between items-center bg-black/30">
          <div>
            <h2 id="slideshow-title" className="text-lg md:text-2xl font-bold text-white tracking-tight truncate max-w-[250px] md:max-w-none">{title}</h2>
            <p className="text-xs text-gray-400 uppercase tracking-wider mt-1 font-mono">
              Sida {currentIndex + 1} / {slides.length}
            </p>
          </div>
          
          {/* NYTT: aria-label för stäng-knappen */}
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
            aria-label="Stäng fönstret"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col gap-6"
            >
              <div className="flex flex-col gap-4 w-full">
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

              {currentSlide.image && (
                <div className="w-full flex justify-center bg-black/20 rounded-xl border border-white/5 p-2 md:p-4 mt-2">
                  <img 
                    src={currentSlide.image} 
                    alt={`Screenshot för ${currentSlide.title}`} // Bättre alt-text
                    className="w-full max-w-4xl h-auto object-contain rounded-lg shadow-lg" 
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="p-4 md:p-6 border-t border-white/10 bg-black/30 flex justify-between items-center gap-4">
          
          {/* NYTT: aria-label för navigeringsknappar */}
          <button 
            onClick={prevSlide} 
            disabled={currentIndex === 0}
            className="flex items-center justify-center gap-2 p-4 md:px-5 md:py-2.5 rounded-full md:rounded-lg bg-white/10 md:bg-transparent hover:bg-white/20 md:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-gray-300 transition-all"
            aria-label="Föregående bild"
          >
            <ChevronLeft className="w-8 h-8 md:w-5 md:h-5" />
            <span className="hidden md:inline font-medium">Föregående</span>
          </button>

          <div className="flex gap-1.5 md:gap-2 shrink-0" aria-hidden="true">
            {slides.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-neon-cyan w-6 md:w-8' : 'bg-white/20 w-1.5 md:w-2'}`}
              />
            ))}
          </div>

          <button 
            onClick={nextSlide} 
            disabled={currentIndex === slides.length - 1}
            className="flex items-center justify-center gap-2 p-4 md:px-5 md:py-2.5 rounded-full md:rounded-lg bg-neon-purple text-white shadow-lg shadow-neon-purple/30 hover:bg-neon-cyan hover:text-black hover:shadow-neon-cyan/30 disabled:opacity-30 disabled:cursor-not-allowed disabled:bg-transparent disabled:border-transparent disabled:text-gray-500 transition-all"
            aria-label="Nästa bild"
          >
            <span className="hidden md:inline font-bold">Nästa</span>
            <ChevronRight className="w-8 h-8 md:w-5 md:h-5" />
          </button>
        </div>

      </motion.div>
    </div>
  );
};

export default ProjectSlideshow;