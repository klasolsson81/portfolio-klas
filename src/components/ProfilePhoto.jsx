import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import profileImg from '../assets/klas-olsson-profil.jpg'; 

// Tar emot isDark prop och small för mobil
const ProfilePhoto = ({ disableMotion, isDark, small }) => {
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

  // Om small=true, fyll containern helt (för mobil header)
  const sizeClasses = small 
    ? 'w-full h-full' 
    : 'w-32 h-32 xl:w-56 xl:h-56 mx-auto md:mx-0';

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
      className={`relative rounded-full shadow-2xl transition-all duration-500 group cursor-pointer z-10 ${sizeClasses}`}
    >
      {/* GLOW BAKOM - Dölj på small för renare look */}
      {!disableMotion && !small && (
        <div className={`absolute -inset-6 blur-3xl animate-pulse-slow rounded-full z-0 transition-opacity duration-300
          ${isDark 
            ? 'bg-gradient-to-br from-neon-purple via-neon-cyan to-neon-purple opacity-50' 
            : 'bg-gradient-to-br from-neon-purple/40 via-neon-cyan/40 to-neon-purple/40 opacity-30'}`}></div>
      )}
      {disableMotion && !small && (
        <div className={`absolute -inset-2 blur-xl rounded-full z-0 transition-colors
          ${isDark ? 'bg-neon-purple/20' : 'bg-neon-purple/10'}`}></div>
      )}

      {/* BILDCONTAINER */}
      <div className={`relative w-full h-full rounded-full overflow-hidden z-10 border transition-colors duration-300
        ${isDark ? 'bg-[#0a0b1e] border-white/5' : 'bg-white border-gray-200'}`}>
        
        <motion.img
          src={profileImg}
          alt="Klas Olsson - Systemutvecklare .NET"
          loading="lazy"
          decoding="async"
          animate={{ scale: isHovered && !disableMotion ? 1.1 : 1 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full object-cover object-center"
        />
        
        {/* VINJETT - Dölj på small */}
        {!small && (
          <div className={`absolute inset-0 pointer-events-none transition-colors duration-300
            ${isDark 
              ? 'bg-[radial-gradient(circle_at_center,transparent_45%,#0a0b1e_95%)]' 
              : 'bg-[radial-gradient(circle_at_center,transparent_55%,#ffffff_95%)] opacity-60'}`}></div>
        )}
        
        {/* LILA TINT - Dölj på small */}
        {!small && (
          <div className={`absolute inset-0 pointer-events-none rounded-full mix-blend-overlay transition-opacity
            ${isDark ? 'bg-neon-purple/10 opacity-100' : 'bg-neon-purple/5 opacity-50'}`}></div>
        )}
      </div>
    </motion.div>
  );
};

export default ProfilePhoto;