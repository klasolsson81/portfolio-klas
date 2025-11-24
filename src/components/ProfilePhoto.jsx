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
      // ÄNDRING 1: Dynamisk storlek. 
      // 'w-40 h-40' på laptop/standard (mindre än förut för att spara plats).
      // 'xl:w-64 xl:h-64' på riktigt stora skärmar.
      className="relative w-40 h-40 xl:w-64 xl:h-64 mx-auto md:mx-0 rounded-[2.5rem] shadow-2xl transition-all duration-500 group cursor-pointer z-10"
    >
      {/* ÄNDRING 2: Starkare bakgrundsglow (Motion) */}
      {/* Om motion är PÅ (!disableMotion): Visa stark animerad blob */}
      {!disableMotion && (
        <div className="absolute -inset-4 bg-gradient-to-br from-neon-purple via-neon-cyan to-neon-purple blur-2xl opacity-60 animate-pulse-slow rounded-full z-0"></div>
      )}
      
      {/* Om motion är AV: Visa svagare statisk glow */}
      {disableMotion && (
        <div className="absolute -inset-1 bg-neon-purple/20 blur-md rounded-[2.5rem] z-0"></div>
      )}

      {/* Bildcontainer */}
      <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden bg-[#0a0b1e] z-10">
        <motion.img
          src={profileImg}
          alt="Klas Olsson"
          animate={{ scale: isHovered && !disableMotion ? 1.1 : 1 }}
          transition={{ duration: 0.5 }}
          // ÄNDRING 3: Aggressivare maskning (Vinjett)
          // 'black_40%' betyder att bara 40% i mitten är helt synligt, sen tonas det ut snabbt.
          className="w-full h-full object-cover [mask-image:radial-gradient(circle_at_center,black_40%,transparent_90%)]"
        />
        
        {/* Scanlines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] pointer-events-none opacity-30 mix-blend-overlay"></div>
      </div>
    </motion.div>
  );
};

export default ProfilePhoto;