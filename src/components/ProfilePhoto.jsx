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
      // ÄNDRING 1: Ännu mindre basstorlek (w-32) för att ge plats åt menyn på laptops.
      // Växer till w-64 på XL-skärmar.
      className="relative w-32 h-32 md:w-48 md:h-48 xl:w-64 xl:h-64 mx-auto md:mx-0 rounded-[2rem] shadow-2xl transition-all duration-500 group cursor-pointer z-10"
    >
      {/* Motion Glow */}
      {!disableMotion && (
        <div className="absolute -inset-4 bg-gradient-to-br from-neon-purple via-neon-cyan to-neon-purple blur-2xl opacity-60 animate-pulse-slow rounded-full z-0"></div>
      )}
      
      {disableMotion && (
        <div className="absolute -inset-1 bg-neon-purple/20 blur-md rounded-[2rem] z-0"></div>
      )}

      {/* Bildcontainer med bakgrundsfärg som matchar sidan */}
      <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-[#0a0b1e] z-10">
        <motion.img
          src={profileImg}
          alt="Klas Olsson"
          animate={{ scale: isHovered && !disableMotion ? 1.1 : 1 }}
          transition={{ duration: 0.5 }}
          // ÄNDRING 2: Bytte 'black' mot 'transparent' i masken för mjukare övergång.
          // Lade till mix-blend-luminosity (valfritt, testa utan om det blir för mörkt) för att tona in färgerna.
          className="w-full h-full object-cover [mask-image:radial-gradient(circle_at_center,white_35%,transparent_90%)]"
        />
        
        {/* ÄNDRING 3: En tonad overlay i sidans mörkblåa färg (#0a0b1e) som ligger i kanterna */}
        <div className="absolute inset-0 rounded-[2rem] ring-inset ring-[20px] ring-[#0a0b1e]/80 blur-xl pointer-events-none"></div>
        
        {/* Liten lila tint för att matcha temat */}
        <div className="absolute inset-0 bg-neon-purple/10 mix-blend-overlay pointer-events-none"></div>
      </div>
    </motion.div>
  );
};

export default ProfilePhoto;