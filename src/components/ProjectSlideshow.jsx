import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Terminal, Lightbulb, AlertTriangle, BookOpen } from 'lucide-react';

const ProjectSlideshow = ({ isOpen, onClose, slides, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isOpen || !slides) return null;

  const nextSlide = () => {
    if (currentIndex < slides.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const prevSlide = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const currentSlide = slides[currentIndex];

  // Ikon-väljare baserat på slide-typ
  const getIcon = (type) => {
    switch(type) {
      case 'problem': return <AlertTriangle className="text-red-400" size={24} />;
      case 'solution': return <Lightbulb className="text-yellow-400" size={24} />;
      case 'code': return <Terminal className="text-neon-cyan" size={24} />;
      case 'learning': return <BookOpen className="text-neon-purple" size={24} />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-5xl bg-[#0a0b1e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh]"
        onClick={e => e.stopPropagation()}
      >
        
        {/* --- HEADER --- */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/20">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">{title}</h2>
            <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">
              Slide {currentIndex + 1} / {slides.length}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* --- CONTENT AREA --- */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 relative">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col gap-6"
            >
              {/* Slide Titel & Ikon */}
              <div className="flex items-center gap-3 mb-2">
                {getIcon(currentSlide.type)}
                <h3 className={`text-2xl font-bold ${currentSlide.type === 'problem' ? 'text-red-400' : currentSlide.type === 'solution' ? 'text-yellow-400' : 'text-neon-cyan'}`}>
                  {currentSlide.title}
                </h3>
              </div>

              {/* Textinnehåll */}
              <div className="text-gray-300 text-lg leading-relaxed space-y-4">
                {currentSlide.content}
              </div>

              {/* Kodblock (Om det finns) */}
              {currentSlide.code && (
                <div className="bg-black/50 border border-white/10 rounded-xl p-4 font-mono text-sm overflow-x-auto custom-scrollbar text-gray-300 shadow-inner">
                  <pre>{currentSlide.code}</pre>
                </div>
              )}

              {/* Bild (Om det finns - Platshållare för dina screenshots) */}
              {currentSlide.image && (
                <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg mt-4">
                  <img src={currentSlide.image} alt="Project Screenshot" className="w-full h-auto object-cover" />
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* --- FOOTER CONTROLS --- */}
        <div className="p-6 border-t border-white/10 bg-black/20 flex justify-between items-center">
          <button 
            onClick={prevSlide} 
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed text-gray-300 transition-colors"
          >
            <ChevronLeft size={20} /> Föregående
          </button>

          {/* Dots Indicator */}
          <div className="flex gap-2">
            {slides.map((_, idx) => (
              <div 
                key={idx} 
                className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-neon-cyan w-6' : 'bg-white/20'}`}
              />
            ))}
          </div>

          <button 
            onClick={nextSlide} 
            disabled={currentIndex === slides.length - 1}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neon-purple/20 hover:bg-neon-purple/40 text-neon-cyan border border-neon-purple/50 disabled:opacity-30 disabled:cursor-not-allowed disabled:bg-transparent disabled:border-transparent disabled:text-gray-500 transition-all"
          >
            Nästa <ChevronRight size={20} />
          </button>
        </div>

      </motion.div>
    </div>
  );
};

export default ProjectSlideshow;