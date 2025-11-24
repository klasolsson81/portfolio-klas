import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
// VIKTIGT: Vi använder din ORIGINALBILD här
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
      // STORLEK: w-32 (128px) på laptop, w-64 på stor skärm
      className="relative w-32 h-32 xl:w-64 xl:h-64 mx-auto md:mx-0 rounded-[2rem] transition-all duration-500 group cursor-pointer z-10"
    >
      {/* BAKGRUNDSEFFEKT (Glow) */}
      {!disableMotion && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-neon-purple via-neon-cyan to-neon-purple blur-3xl opacity-50 animate-pulse-slow rounded-full z-0"></div>
      )}
      
      {/* BILDCONTAINER */}
      <div className="relative w-full h-full rounded-[2rem] overflow-hidden z-10">
        <motion.img
          src={profileImg}
          alt="Klas Olsson"
          animate={{ scale: isHovered && !disableMotion ? 1.1 : 1 }}
          transition={{ duration: 0.5 }}
          // HÄR ÄR MAGIN: 'mask-image'
          // Detta CSS-kommando gör kanterna genomskinliga så bilden smälter in
          className="w-full h-full object-cover [mask-image:radial-gradient(circle_at_center,black_40%,transparent_85%)]"
        />
        
        {/* Extra mörk toning i kanterna för att matcha bakgrunden perfekt */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#0a0b1e_90%)] pointer-events-none"></div>
      </div>
    </motion.div>
  );
};

export default ProfilePhoto;