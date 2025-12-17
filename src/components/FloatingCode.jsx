import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UI } from '../../lib/config/constants';

// Tar emot isDark prop för tema-anpassning
const FloatingCode = ({ isDark }) => {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState(UI.FLOATING_CODE.MIN_TOP_POSITION);

  useEffect(() => {
    // Starta en loop som visar texten med konfigurerat intervall
    const interval = setInterval(() => {
      // Slumpa en höjd baserat på konfigurerade constraints
      const randomTop = Math.floor(Math.random() * UI.FLOATING_CODE.MAX_TOP_RANGE) + UI.FLOATING_CODE.MIN_TOP_POSITION;
      setPosition(randomTop);
      setShow(true);

      // Dölj den efter konfigurerad display-tid
      setTimeout(() => setShow(false), UI.ANIMATION.FLOATING_CODE_DISPLAY);
    }, UI.ANIMATION.FLOATING_CODE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ x: "100vw", opacity: 0 }}
            animate={{ x: "-100%", opacity: [0, 1, 1, 0] }}
            transition={{ duration: UI.ANIMATION.FLOATING_CODE_DURATION, ease: "linear" }}
            className={`absolute font-mono text-4xl font-bold whitespace-nowrap
              ${isDark 
                ? 'text-neon-cyan/20' 
                : 'text-purple-700/25'}`}
            style={{ 
              top: `${position}%`,
              textShadow: isDark 
                ? '0 0 20px rgba(0, 243, 255, 0.3)' 
                : '0 0 15px rgba(124, 58, 237, 0.2)'
            }}
          >
            Console.WriteLine("Hello World");
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingCode;