import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// Importera din bild
import myPhoto from '../assets/klas-olsson-profil.jpg';

const ProfilePhoto = ({ disableMotion }) => {
  // ... (All logik för 3D-effekten är kvar)
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), springConfig);

  const handleMouseMove = (e) => {
    if (disableMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      style={{
        perspective: 1000,
        rotateX: disableMotion ? 0 : rotateX,
        rotateY: disableMotion ? 0 : rotateY,
        scale: isHovered && !disableMotion ? 1.02 : 1,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      // ÄNDRING 1: Tog bort den hårda ramen (border-2 border-white/10)
      // ÄNDRING 2: Gjorde hörnen mycket mjukare (rounded-[3rem] istället för rounded-3xl)
      className="relative w-full aspect-square rounded-[3rem] overflow-hidden shadow-2xl transition-all duration-500 group cursor-pointer z-10"
    >
      {/* Den glödande bakgrundseffekten (gjord lite mjukare med blur-xl) */}
      <motion.div
        animate={{
          opacity: isHovered ? 0.8 : 0.5,
          scale: isHovered ? 1.1 : 1,
        }}
        className="absolute inset-0 bg-gradient-to-br from-neon-purple/40 via-transparent to-neon-cyan/30 animate-pulse-slow blur-xl z-0"
      />

      {/* Själva bilden */}
      <motion.img
        src={myPhoto}
        alt="Klas Olsson"
        animate={{
          scale: isHovered && !disableMotion ? 1.05 : 1,
        }}
        transition={{ duration: 0.5 }}
        // ÄNDRING 3: Mjukare hörn även här
        // ÄNDRING 4 (MAGIN): Lade till en 'mask-image' som tonar ut kanterna
        className="relative z-10 w-full h-full object-cover rounded-[3rem] transition-transform duration-500 [mask-image:radial-gradient(circle_at_center,black_30%,transparent_95%)]"
      />

      {/* "Scanline" effekt ovanpå */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] pointer-events-none z-20 opacity-30 mix-blend-overlay"></div>
    </motion.div>
  );
};

export default ProfilePhoto;