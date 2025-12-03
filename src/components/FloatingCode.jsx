import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Tar emot isDark prop för tema-anpassning
const FloatingCode = ({ isDark }) => {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState(10);

  useEffect(() => {
    // Starta en loop som visar texten var 12:e sekund
    const interval = setInterval(() => {
      // Slumpa en höjd (mellan 10% och 80% av skärmen)
      const randomTop = Math.floor(Math.random() * 70) + 10;
      setPosition(randomTop);
      setShow(true);

      // Dölj den efter animationen är klar (ca 8 sek)
      setTimeout(() => setShow(false), 8000);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ x: "100vw", opacity: 0 }}
            animate={{ x: "-100%", opacity: [0, 1, 1, 0] }}
            transition={{ duration: 10, ease: "linear" }}
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