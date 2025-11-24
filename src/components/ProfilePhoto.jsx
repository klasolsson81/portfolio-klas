import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import profileImg from '../assets/klas-olsson-profil.jpg'; 

const ProfilePhoto = ({ disableMotion }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(y, [-100, 100], [5, -5]), springConfig); // Mildare rotation
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
      // HÄR: Tillbaka till fasta proportioner så den inte blir en bred banner
      className="relative w-48 h-48 md:w-64 md:h-64 mx-auto md:mx-0 rounded-[2.5rem] shadow-2xl transition-all duration-500 group cursor-pointer z-10"
    >
      {/* Bakgrundsglow (Energin) */}
      <div className="absolute -inset-1 bg-gradient-to-br from-neon-purple/50 via-transparent to-neon-cyan/40 blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500 rounded-[3rem]"></div>

      {/* Bildcontainer med mjuk maskning */}
      <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden bg-[#0a0b1e]">
        <motion.img
          src={profileImg}
          alt="Klas Olsson"
          animate={{ scale: isHovered && !disableMotion ? 1.05 : 1 }}
          transition={{ duration: 0.5 }}
          // HÄR: En mjukare mask som inte klipper för mycket av ansiktet
          // 'mask-image' gör att kanterna tonas ut mot transparent
          className="w-full h-full object-cover [mask-image:radial-gradient(circle_at_center,black_50%,transparent_100%)]"
        />
        
        {/* Scanline-effekt (valfritt, ger lite tech-känsla) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20 mix-blend-overlay"></div>
      </div>
    </motion.div>
  );
};

export default ProfilePhoto;