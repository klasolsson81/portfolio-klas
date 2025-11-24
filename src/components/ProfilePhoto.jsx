import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import profileImg from '../assets/klas-olsson-profil.jpg'; 

const ProfilePhoto = ({ disableMotion }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(y, [-100, 100], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(x, [-100, 100], [-5, 5]), springConfig);

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
      // ÄNDRING 1: DYNAMISK STORLEK (Responsiv)
      // w-24 (96px) = Liten & kompakt på små laptops/mobiler
      // md:w-32 (128px) = Lite större på mediumskärmar
      // xl:w-56 (224px) = Stor och maffig på 27-tumsskärmar
      className="relative w-24 h-24 md:w-32 md:h-32 xl:w-56 xl:h-56 mx-auto md:mx-0 rounded-full shadow-2xl transition-all duration-500 group cursor-pointer z-10"
    >
      
      {/* ÄNDRING 2: SUPER-GLOW (Mer levande) */}
      {!disableMotion && (
        <>
            {/* Lager 1: Stor, pulserande aura (Större spread: -inset-8) */}
            <div className="absolute -inset-8 bg-gradient-to-tr from-neon-purple/60 via-neon-cyan/30 to-neon-purple/60 blur-3xl rounded-full animate-pulse-slow opacity-70 z-0"></div>
            
            {/* Lager 2: Roterande energiring (Snurrar runt bilden) */}
            <div className="absolute -inset-1 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-purple rounded-full blur-md opacity-80 animate-spin-slow z-0"></div>
        </>
      )}
      
      {disableMotion && (
        <div className="absolute -inset-2 bg-neon-purple/20 blur-xl rounded-full z-0"></div>
      )}

      {/* BILDCONTAINER */}
      <div className="relative w-full h-full rounded-full overflow-hidden bg-[#0a0b1e] z-10 border border-white/5">
        
        {/* Bilden */}
        <motion.img
          src={profileImg}
          alt="Klas Olsson"
          animate={{ scale: isHovered && !disableMotion ? 1.1 : 1 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full object-cover"
        />
        
        {/* Mörk toning i kanterna (Vinjett) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#0a0b1e_95%)] pointer-events-none"></div>
        
        {/* Extra lila tint */}
        <div className="absolute inset-0 bg-neon-purple/10 mix-blend-overlay pointer-events-none rounded-full"></div>
      </div>
    </motion.div>
  );
};

export default ProfilePhoto;