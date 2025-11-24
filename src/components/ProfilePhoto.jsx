import React from 'react';
import { motion } from 'framer-motion';
import profileImg from '../assets/klas-olsson-profil.jpg'; 

const ProfilePhoto = ({ disableMotion }) => {
  return (
    <div className="relative inline-block">
      {/* DEN LEVANDE RAMEN (Bakgrunden)
          - Om Motion är PÅ (!disableMotion): Visa .organic-border (Animerad)
          - Om Motion är AV (disableMotion): Visa en stilla, svag lila cirkel
      */}
      <div 
        className={`absolute -inset-3 rounded-full z-0 transition-all duration-500
          ${disableMotion 
            ? 'bg-neon-purple/20 opacity-50 blur-md'  // Stilla läge
            : 'organic-border'                        // Animerat läge (från index.css)
          }`}
      ></div>
      
      {/* SJÄLVA BILDEN */}
      <motion.div
        className="relative w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden z-10 border-2 border-white/10 shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
      >
        <img src={profileImg} alt="Klas Olsson" className="w-full h-full object-cover" />
        
        {/* Subtil overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b1e]/60 to-transparent pointer-events-none"></div>
      </motion.div>
    </div>
  );
};

export default ProfilePhoto;