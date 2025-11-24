import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingCode = () => {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState(10); // Startposition Y (höjd)

  useEffect(() => {
    // Starta en loop som visar texten var 12:e sekund
    const interval = setInterval(() => {
      // Slumpa en höjd (mellan 10% och 80% av skärmen)
      const randomTop = Math.floor(Math.random() * 70) + 10;
      setPosition(randomTop);
      setShow(true);

      // Dölj den efter animationen är klar (ca 8 sek)
      setTimeout(() => setShow(false), 8000);
    }, 12000); // Intervall: Hur ofta den dyker upp

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ x: "100vw", opacity: 0 }}
            animate={{ x: "-100%", opacity: [0, 1, 1, 0] }} // Tona in och ut
            transition={{ duration: 10, ease: "linear" }} // Långsam svepning
            className="absolute font-mono text-4xl font-bold text-neon-cyan/10 whitespace-nowrap"
            style={{ top: `${position}%` }}
          >
            Console.WriteLine("Hello World");
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingCode;