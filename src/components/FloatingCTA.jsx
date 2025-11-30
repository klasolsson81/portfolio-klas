import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import aiKlasImage from '../assets/aiklas.png';

const FloatingCTA = ({ isDark, onNavigateToHire, currentSection }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenDismissed, setHasBeenDismissed] = useState(false);

  // Visa knappen efter 3 sekunder, men inte om vi redan är på "hire"
  useEffect(() => {
    if (currentSection === 'hire') {
      setIsVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      if (!hasBeenDismissed) {
        setIsVisible(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentSection, hasBeenDismissed]);

  const handleClick = () => {
    onNavigateToHire();
    setIsVisible(false);
    setHasBeenDismissed(true);
  };

  const handleDismiss = (e) => {
    e.stopPropagation();
    setIsVisible(false);
    setHasBeenDismissed(true);
  };

  if (currentSection === 'hire') return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-40 flex items-center gap-2"
        >
          {/* Dismiss button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={handleDismiss}
            className={`p-1.5 rounded-full transition-colors ${
              isDark 
                ? 'bg-black/50 text-gray-400 hover:text-white' 
                : 'bg-warm-card/80 text-warm-subtle hover:text-warm-text shadow-sm'
            }`}
            aria-label="Stäng"
          >
            <X size={14} />
          </motion.button>

          {/* Main CTA button */}
          <motion.button
            onClick={handleClick}
            className="relative group"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {/* Animated glow ring */}
            <span className={`absolute inset-0 rounded-full blur-md animate-pulse ${
              isDark 
                ? 'bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-purple' 
                : 'bg-gradient-to-r from-purple-500 via-cyan-400 to-purple-500'
            } opacity-50 group-hover:opacity-70 transition-opacity`} />
            
            {/* Secondary glow */}
            <span className={`absolute inset-[-2px] rounded-full ${
              isDark 
                ? 'bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-cyan' 
                : 'bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400'
            } opacity-30 animate-spin-slow`} />

            {/* Button content */}
            <span className={`relative flex items-center gap-3 pl-1.5 pr-4 py-1.5 rounded-full font-bold text-sm transition-all duration-300 ${
              isDark 
                ? 'bg-neon-darkbg text-white border border-neon-purple/50 group-hover:border-neon-cyan' 
                : 'bg-warm-card text-warm-text border border-purple-300 group-hover:border-warm-accent shadow-lg'
            }`}>
              {/* AI Avatar */}
              <div className="relative">
                <img 
                  src={aiKlasImage} 
                  alt="AI Klas"
                  className={`w-9 h-9 rounded-full object-cover border-2 transition-colors ${
                    isDark 
                      ? 'border-neon-cyan/50 group-hover:border-neon-cyan' 
                      : 'border-purple-300 group-hover:border-warm-accent'
                  }`}
                />
                {/* Online indicator */}
                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 animate-pulse ${
                  isDark 
                    ? 'bg-green-400 border-neon-darkbg' 
                    : 'bg-green-500 border-warm-card'
                }`} />
              </div>
              
              {/* Text - alltid synlig */}
              <span className="whitespace-nowrap">Anlita mig</span>
            </span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingCTA;