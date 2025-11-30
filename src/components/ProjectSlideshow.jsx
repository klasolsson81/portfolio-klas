import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Terminal, Lightbulb, AlertTriangle, BookOpen } from 'lucide-react';

// NYTT: Tar emot isDark
const ProjectSlideshow = ({ isOpen, onClose, slides, title, isDark }) => {
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
      case 'problem': return <AlertTriangle className="text-red-500" size={28} />;
      case 'solution': return <Lightbulb className="text-yellow-500" size={28} />;
      case 'code': return <Terminal className="text-neon-cyan" size={28} />;
      case 'learning': return <BookOpen className="text-neon-purple" size={28} />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 md:p-4" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.95 }}
        // ÄNDRING: Dynamiska färger för bakgrund och border
        className={`relative w-full max-w-6xl xl:max-w-7xl rounded-xl md:rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[95vh] md:h-[90vh] border transition-colors duration-300
          ${isDark 
            ? 'bg-[#0a0b1e] border-white/10' 
            : 'bg-[#fffbf5] border-stone-200 text-stone-800'}`}
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className={`p-4 md:p-6 border-b flex justify-between items-center transition-colors
          ${isDark ? 'bg-black/30 border-white/10' : 'bg-stone-100/50 border-stone-200'}`}>
          <div>
            <h2 className={`text-lg md:text-2xl font-bold tracking-tight truncate max-w-[250px] md:max-w-none ${isDark ? 'text-white' : 'text-stone-900'}`}>{title}</h2>
            <p className={`text-xs uppercase tracking-wider mt-1 font-mono ${isDark ? 'text-gray-400' : 'text-stone-500'}`}>
              Sida {currentIndex + 1} / {slides.length}
            </p>
          </div>
          <button onClick={onClose} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-stone-200 text-stone-500 hover:text-stone-900'}`}>
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
              className={`h-full flex flex-col gap-6 md:gap-8 ${currentSlide.image ? 'lg:flex-col' : ''}`}
            >
              
              {/* Text & Kod */}
              <div className="flex flex-col gap-4 w-full">
                <div className={`flex items-center gap-3 border-b pb-3 md:pb-4 ${isDark ? 'border-white/10' : 'border-stone-200'}`}>
                  {getIcon(currentSlide.type)}
                  <h3 className={`text-xl md:text-3xl font-bold ${currentSlide.type === 'problem' ? 'text-red-500' : currentSlide.type === 'solution' ? 'text-yellow-500' : 'text-neon-cyan'}`}>
                    {currentSlide.title}
                  </h3>
                </div>

                <div className={`text-sm md:text-lg leading-relaxed space-y-4 ${isDark ? 'text-gray-300' : 'text-stone-700'}`}>
                  {currentSlide.content}
                </div>

                {currentSlide.code && (
                  <div className={`rounded-xl p-3 md:p-4 font-mono text-xs md:text-sm overflow-x-auto custom-scrollbar shadow-inner border
                    ${isDark ? 'bg-black/60 border-white/10 text-gray-300' : 'bg-stone-100 border-stone-200 text-stone-800'}`}>
                    <pre>{currentSlide.code}</pre>
                  </div>
                )}
              </div>

              {/* Bild */}
              {currentSlide.image && (
                <div className={`w-full flex justify-center rounded-xl border p-2 md:p-4 mt-2
                  ${isDark ? 'bg-black/20 border-white/5' : 'bg-white border-stone-200 shadow-sm'}`}>
                  <img 
                    src={currentSlide.image} 
                    alt="Project Screenshot" 
                    className="w-full max-w-4xl h-auto object-contain rounded-lg shadow-lg" 
                  />
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Controls */}
        <div className={`p-4 md:p-6 border-t flex justify-between items-center gap-4
          ${isDark ? 'bg-black/30 border-white/10' : 'bg-stone-100/50 border-stone-200'}`}>
          
          <button 
            onClick={prevSlide} 
            disabled={currentIndex === 0}
            className={`flex items-center justify-center gap-2 p-4 md:px-5 md:py-2.5 rounded-full md:rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all
              ${isDark 
                ? 'bg-white/10 md:bg-transparent hover:bg-white/20 text-gray-300' 
                : 'bg-stone-200 md:bg-transparent hover:bg-stone-200 text-stone-600'}`}
          >
            <ChevronLeft className="w-8 h-8 md:w-5 md:h-5" />
            <span className="hidden md:inline font-medium">Föregående</span>
          </button>

          <div className="flex gap-1.5 md:gap-2 shrink-0">
            {slides.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 md:h-2 rounded-full transition-all duration-300 
                  ${idx === currentIndex 
                    ? 'bg-neon-cyan w-6 md:w-8' 
                    : (isDark ? 'bg-white/20 w-1.5 md:w-2' : 'bg-stone-300 w-1.5 md:w-2')}`}
              />
            ))}
          </div>

          <button 
            onClick={nextSlide} 
            disabled={currentIndex === slides.length - 1}
            className="flex items-center justify-center gap-2 p-4 md:px-5 md:py-2.5 rounded-full md:rounded-lg bg-neon-purple text-white shadow-lg shadow-neon-purple/30 hover:bg-neon-cyan hover:text-black hover:shadow-neon-cyan/30 disabled:opacity-30 disabled:cursor-not-allowed disabled:bg-transparent disabled:border-transparent disabled:text-gray-500 transition-all"
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