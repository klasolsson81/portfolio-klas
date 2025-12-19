import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Terminal, Lightbulb, AlertTriangle, BookOpen } from 'lucide-react';

const ProjectSlideshow = ({ isOpen, onClose, slides, title, isDark }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const modalRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      // Focus the modal when it opens for keyboard navigation
      setTimeout(() => modalRef.current?.focus(), 100);
    }
  }, [isOpen, title]);

  // Add keyboard navigation (Escape, Arrow keys)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (currentIndex < slides.length - 1) setCurrentIndex(currentIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, currentIndex, slides.length]);

  // Touch/swipe gesture handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const minSwipeDistance = 50; // Minimum distance in pixels to trigger swipe
    const swipeDistance = touchStartX.current - touchEndX.current;

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        // Swiped left -> Next slide
        if (currentIndex < slides.length - 1) setCurrentIndex(currentIndex + 1);
      } else {
        // Swiped right -> Previous slide
        if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
      }
    }

    // Reset touch positions
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

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
      case 'code': return <Terminal className={isDark ? 'text-neon-cyan' : 'text-purple-600'} size={28} />;
      case 'learning': return <BookOpen className={isDark ? 'text-neon-purple' : 'text-purple-700'} size={28} />;
      default: return null;
    }
  };

  return (
    <div
      className="fixed inset-0 z-[50] flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 md:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="slideshow-title"
    >
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`relative w-full max-w-6xl xl:max-w-7xl rounded-xl md:rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[95vh] md:h-[90vh] border transition-colors duration-300
          ${isDark
            ? 'bg-[#0a0b1e] border-white/10'
            : 'bg-white/80 backdrop-blur-xl border-purple-200/50'}`}
        onClick={e => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        tabIndex={-1}
      >
        
        {/* Header */}
        <div className={`p-4 md:p-6 border-b flex justify-between items-center transition-colors
          ${isDark ? 'bg-black/30 border-white/10' : 'bg-white/50 border-purple-200/50'}`}>
          <div>
            <h2 id="slideshow-title" className={`text-lg md:text-2xl font-bold tracking-tight truncate max-w-[250px] md:max-w-none ${isDark ? 'text-white' : 'text-purple-900'}`}>{title}</h2>
            <p className={`text-xs uppercase tracking-wider mt-1 font-mono ${isDark ? 'text-gray-400' : 'text-purple-500'}`}>
              Sida {currentIndex + 1} / {slides.length}
            </p>
            <p className={`text-[9px] mt-1 hidden md:block ${isDark ? 'text-gray-500' : 'text-purple-400'}`}>
              ⌨️ Använd piltangenter eller swipe
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-purple-100 text-purple-500 hover:text-purple-900'}`}
            aria-label="Stäng dialog"
          >
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
                <div className={`flex items-center gap-3 border-b pb-3 md:pb-4 ${isDark ? 'border-white/10' : 'border-purple-200/50'}`}>
                  {getIcon(currentSlide.type)}
                  <h3 className={`text-xl md:text-3xl font-bold ${
                    currentSlide.type === 'problem' ? 'text-red-500' : 
                    currentSlide.type === 'solution' ? 'text-yellow-500' : 
                    (isDark ? 'text-neon-cyan' : 'text-purple-700')
                  }`}>
                    {currentSlide.title}
                  </h3>
                </div>

                <div className={`text-sm md:text-lg leading-relaxed space-y-4 ${isDark ? 'text-gray-300' : 'text-purple-800'}`}>
                  {currentSlide.content}
                </div>

                {currentSlide.code && (
                  <div className={`rounded-xl p-3 md:p-4 font-mono text-xs md:text-sm overflow-x-auto custom-scrollbar shadow-inner border
                    ${isDark ? 'bg-black/60 border-white/10 text-gray-300' : 'bg-purple-50/50 border-purple-200/50 text-purple-900'}`}>
                    <pre>{currentSlide.code}</pre>
                  </div>
                )}
              </div>

              {/* Bild */}
              {currentSlide.image && (
                <div className={`w-full flex justify-center rounded-xl border p-2 md:p-4 mt-2
                  ${isDark ? 'bg-black/20 border-white/5' : 'bg-white/40 border-purple-200/50 shadow-sm'}`}>
                  <img
                    src={currentSlide.image}
                    alt={`${title} - ${currentSlide.title}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full max-w-4xl h-auto object-contain rounded-lg shadow-lg"
                  />
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Controls */}
        <div className={`p-4 md:p-6 border-t flex justify-between items-center gap-4
          ${isDark ? 'bg-black/30 border-white/10' : 'bg-white/50 border-purple-200/50'}`}>
          
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className={`flex items-center justify-center gap-2 p-4 md:px-5 md:py-2.5 rounded-full md:rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all
              ${isDark
                ? 'bg-white/10 md:bg-transparent hover:bg-white/20 text-gray-300'
                : 'bg-purple-100/50 md:bg-transparent hover:bg-purple-100 text-purple-600'}`}
            aria-label="Föregående sida"
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
                    ? (isDark ? 'bg-neon-cyan' : 'bg-purple-600') + ' w-6 md:w-8' 
                    : (isDark ? 'bg-white/20' : 'bg-purple-200') + ' w-1.5 md:w-2'}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            disabled={currentIndex === slides.length - 1}
            className={`flex items-center justify-center gap-2 p-4 md:px-5 md:py-2.5 rounded-full md:rounded-lg shadow-lg disabled:opacity-30 disabled:cursor-not-allowed disabled:bg-transparent disabled:border-transparent disabled:text-gray-500 transition-all
              ${isDark
                ? 'bg-neon-purple text-white shadow-neon-purple/30 hover:bg-neon-cyan hover:text-black hover:shadow-neon-cyan/30'
                : 'bg-purple-600 text-white shadow-purple-500/30 hover:bg-purple-700 hover:shadow-purple-600/30'}`}
            aria-label="Nästa sida"
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