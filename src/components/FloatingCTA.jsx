import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, X, Sparkles } from 'lucide-react';

const FloatingCTA = ({ isDark, onNavigateToHire, currentSection }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
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

  // Expandera texten efter ytterligare 2 sekunder
  useEffect(() => {
    if (isVisible && !isExpanded) {
      const expandTimer = setTimeout(() => {
        setIsExpanded(true);
      }, 2000);
      return () => clearTimeout(expandTimer);
    }
  }, [isVisible]);

  // Kollapsa texten efter 5 sekunder
  useEffect(() => {
    if (isExpanded) {
      const collapseTimer = setTimeout(() => {
        setIsExpanded(false);
      }, 5000);
      return () => clearTimeout(collapseTimer);
    }
  }, [isExpanded]);

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
                : 'bg-warm-card/80 text-warm-subtle hover:text-warm-text'
            }`}
            aria-label="Stäng"
          >
            <X size={14} />
          </motion.button>

          {/* Main CTA button */}
          <motion.button
            onClick={handleClick}
            className="relative group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Animated glow ring */}
            <span className={`absolute inset-0 rounded-full blur-md animate-pulse ${
              isDark 
                ? 'bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-purple' 
                : 'bg-gradient-to-r from-purple-500 via-cyan-400 to-purple-500'
            } opacity-60 group-hover:opacity-80 transition-opacity`} />
            
            {/* Secondary glow */}
            <span className={`absolute inset-[-2px] rounded-full ${
              isDark 
                ? 'bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-cyan' 
                : 'bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400'
            } opacity-40 animate-spin-slow`} />

            {/* Button content */}
            <span className={`relative flex items-center gap-2 px-4 py-3 rounded-full font-bold text-sm transition-all duration-300 ${
              isDark 
                ? 'bg-neon-darkbg text-white border border-neon-purple/50 group-hover:border-neon-cyan' 
                : 'bg-warm-card text-warm-text border border-purple-300 group-hover:border-warm-accent shadow-lg'
            }`}>
              <Briefcase size={18} className={isDark ? 'text-neon-cyan' : 'text-warm-accent'} />
              
              <AnimatePresence mode="wait">
                {isExpanded && (
                  <motion.span
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 'auto', opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    Anlita mig
                  </motion.span>
                )}
              </AnimatePresence>

              <Sparkles size={14} className={`${isDark ? 'text-neon-purple' : 'text-purple-400'} animate-pulse`} />
            </span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingCTA;