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
      // ÄNDRING 1: Mycket mindre basstorlek (w-28 = 112px).
      // Växer lite på mediumskärmar (w-32) och blir stor först på XL-skärmar.
      className="relative w-28 h-28 md:w-32 md:h-32 xl:w-60 xl:h-60 mx-auto md:mx-0 rounded-[2rem] shadow-2xl transition-all duration-500 group cursor-pointer z-10"
    >
      {/* Motion Glow */}
      {!disableMotion && (
        <div className="absolute -inset-4 bg-gradient-to-br from-neon-purple via-neon-cyan to-neon-purple blur-2xl opacity-50 animate-pulse-slow rounded-full z-0"></div>
      )}
      
      {disableMotion && (
        <div className="absolute -inset-1 bg-neon-purple/20 blur-md rounded-[2rem] z-0"></div>
      )}

      {/* Bildcontainer */}
      <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-[#0a0b1e] z-10">
        <motion.img
          src={profileImg}
          alt="Klas Olsson"
          animate={{ scale: isHovered && !disableMotion ? 1.1 : 1 }}
          transition={{ duration: 0.5 }}
          // Maskning för att tona ut kanterna
          className="w-full h-full object-cover [mask-image:radial-gradient(circle_at_center,white_40%,transparent_95%)]"
        />
        
        {/* ÄNDRING 2: Färgad overlay för att "döda" det gråa i fotot */}
        {/* Detta lägger en mörkblå/lila ton över kanterna så det smälter in i bakgrunden */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0b1e] via-transparent to-[#0a0b1e] mix-blend-multiply opacity-90 pointer-events-none"></div>
        <div className="absolute inset-0 bg-neon-purple/10 mix-blend-overlay pointer-events-none rounded-[2rem]"></div>
        
        {/* Extra mörk ring i kanten för att sudda ut gränsen helt */}
        <div className="absolute inset-0 rounded-[2rem] ring-inset ring-[15px] ring-[#0a0b1e]/80 blur-md pointer-events-none"></div>
      </div>
    </motion.div>
  );
};

export default ProfilePhoto;