import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// HÄR ÄR ÄNDRINGEN: Vi importerar den nya bilden
import profileImg from '../assets/klas-olsson-profil2.jpg'; 

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
    <div className="relative z-10" onMouseMove={handleMouseMove} onMouseEnter={() => setIsHovered(true)} onMouseLeave={handleMouseLeave}>
      
      {/* --- DEN LEVANDE BAKGRUNDEN (Aura) --- */}
      {!disableMotion && (
        <>
            {/* En stor, mjuk, pulserande glöd bakom allt */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] bg-gradient-to-tr from-neon-purple/60 via-neon-cyan/40 to-neon-purple/60 blur-3xl rounded-full animate-pulse-slow -z-20"></div>
            
            {/* En skarpare, roterande ring närmare bilden för mer liv */}
            <div className="absolute inset-0 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-purple rounded-full blur-md opacity-70 animate-spin-slow -z-10"></div>
        </>
      )}

      {/* --- BILDCONTAINER MED 3D-EFFEKT --- */}
      <motion.div
        style={{
          perspective: 1000,
          rotateX: disableMotion ? 0 : rotateX,
          rotateY: disableMotion ? 0 : rotateY,
          scale: isHovered && !disableMotion ? 1.02 : 1,
        }}
        // STORLEK: w-32 (128px) på laptop. w-64 (256px) på stor skärm.
        className="relative w-32 h-32 xl:w-64 xl:h-64 mx-auto md:mx-0 rounded-full shadow-[0_0_30px_rgba(189,0,255,0.3)] transition-all duration-500 group cursor-pointer z-0"
      >
        {/* Själva bilden - Rent och snyggt utan filter */}
        <motion.img
          src={profileImg}
          alt="Klas Olsson"
          animate={{ scale: isHovered && !disableMotion ? 1.05 : 1 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full object-cover rounded-full border-2 border-white/5"
        />
      </motion.div>
    </div>
  );
};

export default ProfilePhoto;