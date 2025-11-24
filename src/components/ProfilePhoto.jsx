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
      // ÄNDRING 1: Tillbaka till rounded-[2rem] (mjuk rektangel).
      // STORLEK: w-28 (112px) på laptop för att spara plats. w-56 på stor skärm.
      className="relative w-28 h-28 xl:w-56 xl:h-56 mx-auto md:mx-0 rounded-[2rem] shadow-2xl transition-all duration-500 group cursor-pointer z-10"
    >
      {/* GLOW BAKOM */}
      {!disableMotion && (
        <div className="absolute -inset-5 bg-gradient-to-br from-neon-purple via-neon-cyan to-neon-purple blur-3xl opacity-50 animate-pulse-slow rounded-[2.5rem] z-0"></div>
      )}
      {disableMotion && (
        <div className="absolute -inset-1 bg-neon-purple/20 blur-md rounded-[2rem] z-0"></div>
      )}

      {/* BILDCONTAINER */}
      <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-[#0a0b1e] z-10">
        
        <motion.img
          src={profileImg}
          alt="Klas Olsson"
          animate={{ scale: isHovered && !disableMotion ? 1.1 : 1 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full object-cover"
        />
        
        {/* ÄNDRING 2: Aggressiv toning/vinjett som smälter in i bakgrunden */}
        {/* En mörkblå 'ring' som täcker kanterna och tonar ut mot mitten */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,#0a0b1e_95%)] pointer-events-none"></div>
        
        {/* Extra lila tint för att matcha temat */}
        <div className="absolute inset-0 bg-neon-purple/10 mix-blend-overlay pointer-events-none rounded-[2rem]"></div>
      </div>
    </motion.div>
  );
};

export default ProfilePhoto;