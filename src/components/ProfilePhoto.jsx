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
      // HÄR ÄR ÄNDRINGEN: w-48 (192px) istället för w-64. Behåller stor storlek på XL-skärmar.
      className="relative w-48 h-48 md:w-48 md:h-48 xl:w-64 xl:h-64 mx-auto md:mx-0 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 group cursor-pointer z-10"
    >
      {/* Base Image */}
      <img 
        src={profileImg} 
        alt="Klas Olsson" 
        className="w-full h-full object-cover z-10 relative"
      />

      {/* Overlay Pupils */}
      {!disableMotion && (
        <>
           <motion.div 
             className="absolute w-2 h-2 bg-black/60 rounded-full blur-[1px] pointer-events-none z-20 mix-blend-multiply"
             style={{ top: '42.5%', left: '33.5%' }} 
             animate={{ x: 0, y: 0 }} // Förenklat för nu, pupillerna rörde sig för mycket
           />
           <motion.div 
             className="absolute w-2 h-2 bg-black/60 rounded-full blur-[1px] pointer-events-none z-20 mix-blend-multiply"
             style={{ top: '41.5%', left: '63.5%' }} 
             animate={{ x: 0, y: 0 }} 
           />
        </>
      )}
      
      {/* Den levande ramen (Animerad) */}
      <div className={`absolute inset-0 pointer-events-none z-30 ${disableMotion ? '' : 'organic-border'}`} />
      
      {/* Hover Glow Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-neon-purple/20 to-neon-cyan/20 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none z-40" />
    </motion.div>
  );
};

export default ProfilePhoto;