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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-6xl bg-[#0a0b1e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/30">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">{title}</h2>
            <p className="text-xs text-gray-400 uppercase tracking-wider mt-1 font-mono">
              Sida {currentIndex + 1} / {slides.length}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Content Area - Nu med flex-row för bild/text split */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 relative custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className={`h-full flex flex-col gap-8 ${currentSlide.image ? 'lg:flex-row lg:items-start' : ''}`}
            >
              
              {/* Vänster: Text & Kod (Tar 50% bredd om bild finns, annars 100%) */}
              <div className={`flex flex-col gap-6 ${currentSlide.image ? 'lg:w-1/2' : 'w-full'}`}>
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  {getIcon(currentSlide.type)}
                  <h3 className={`text-2xl md:text-3xl font-bold ${currentSlide.type === 'problem' ? 'text-red-400' : currentSlide.type === 'solution' ? 'text-yellow-400' : 'text-neon-cyan'}`}>
                    {currentSlide.title}
                  </h3>
                </div>

                <div className="text-gray-300 text-base md:text-lg leading-relaxed space-y-4">
                  {currentSlide.content}
                </div>

                {currentSlide.code && (
                  <div className="bg-black/60 border border-white/10 rounded-xl p-4 font-mono text-sm overflow-x-auto custom-scrollbar text-gray-300 shadow-inner">
                    <pre>{currentSlide.code}</pre>
                  </div>
                )}
              </div>

              {/* Höger: Bild (Om den finns) */}
              {currentSlide.image && (
                <div className="lg:w-1/2 flex items-center justify-center bg-black/20 rounded-xl border border-white/5 p-4 h-full min-h-[300px]">
                  {/* HÄR: object-contain ser till att HELA bilden syns, ingen crop! */}
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

        {/* Footer Controls */}
        <div className="p-6 border-t border-white/10 bg-black/30 flex justify-between items-center">
          <button 
            onClick={prevSlide} 
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-gray-300 transition-colors font-medium"
          >
            <ChevronLeft size={20} /> Föregående
          </button>

          <div className="flex gap-2">
            {slides.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-neon-cyan w-8' : 'bg-white/20 w-2'}`}
              />
            ))}
          </div>

          <button 
            onClick={nextSlide} 
            disabled={currentIndex === slides.length - 1}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-neon-purple text-white shadow-lg shadow-neon-purple/20 hover:bg-neon-cyan hover:text-black hover:shadow-neon-cyan/20 disabled:opacity-30 disabled:cursor-not-allowed disabled:bg-transparent disabled:border-transparent disabled:text-gray-500 transition-all font-bold"
          >
            Nästa <ChevronRight size={20} />
          </button>
        </div>

      </motion.div>
    </div>
  );
};

export default ProjectSlideshow;