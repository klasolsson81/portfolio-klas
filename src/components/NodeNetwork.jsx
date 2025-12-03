import React, { useMemo } from 'react';

// =====================================================
// STAR COMPONENT - Kors-formad stjärna med glow
// =====================================================
const Star = ({ x, y, size, delay, duration, isDark }) => {
  // Färger baserat på tema
  const coreColor = isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(124, 58, 237, 0.7)';
  const glowColor = isDark ? 'rgba(0, 243, 255, 0.6)' : 'rgba(167, 139, 250, 0.5)';
  const rayColor = isDark ? 'rgba(0, 243, 255, 0.4)' : 'rgba(124, 58, 237, 0.3)';

  return (
    <div
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        animation: `starPulse ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      {/* Kärna - ljuspunkten */}
      <div
        className="absolute rounded-full"
        style={{
          width: size * 0.3,
          height: size * 0.3,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: coreColor,
          boxShadow: `0 0 ${size * 0.5}px ${glowColor}`,
        }}
      />
      
      {/* Horisontell stråle */}
      <div
        className="absolute"
        style={{
          width: size,
          height: size * 0.08,
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          background: `linear-gradient(90deg, transparent 0%, ${rayColor} 50%, transparent 100%)`,
        }}
      />
      
      {/* Vertikal stråle */}
      <div
        className="absolute"
        style={{
          width: size * 0.08,
          height: size,
          left: '50%',
          top: 0,
          transform: 'translateX(-50%)',
          background: `linear-gradient(180deg, transparent 0%, ${rayColor} 50%, transparent 100%)`,
        }}
      />
      
      {/* Diagonal stråle 1 (45°) - kortare */}
      <div
        className="absolute"
        style={{
          width: size * 0.7,
          height: size * 0.05,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%) rotate(45deg)',
          background: `linear-gradient(90deg, transparent 0%, ${rayColor} 50%, transparent 100%)`,
          opacity: 0.6,
        }}
      />
      
      {/* Diagonal stråle 2 (-45°) - kortare */}
      <div
        className="absolute"
        style={{
          width: size * 0.7,
          height: size * 0.05,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%) rotate(-45deg)',
          background: `linear-gradient(90deg, transparent 0%, ${rayColor} 50%, transparent 100%)`,
          opacity: 0.6,
        }}
      />
    </div>
  );
};

// =====================================================
// SMALL TWINKLE DOT - Mindre ljuspunkter utan strålar
// =====================================================
const TwinkleDot = ({ x, y, size, delay, duration, isDark }) => {
  const color = isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(124, 58, 237, 0.4)';
  const glowColor = isDark ? 'rgba(0, 243, 255, 0.3)' : 'rgba(167, 139, 250, 0.3)';

  return (
    <div
      className="absolute rounded-full"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        backgroundColor: color,
        boxShadow: `0 0 ${size * 2}px ${glowColor}`,
        animation: `starPulse ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  );
};

// =====================================================
// MAIN COMPONENT
// =====================================================
const NodeNetwork = ({ isDark }) => {
  // Generera stjärnor en gång
  const stars = useMemo(() => {
    const result = [];
    
    // Stora korsstjärnor (8-12 st)
    for (let i = 0; i < 10; i++) {
      result.push({
        type: 'star',
        x: Math.random() * 90 + 5,
        y: Math.random() * 85 + 5,
        size: Math.random() * 20 + 15, // 15-35px
        delay: Math.random() * 8,
        duration: Math.random() * 4 + 6, // 6-10 sekunder
      });
    }
    
    // Mellanstora stjärnor (15-20 st)
    for (let i = 0; i < 18; i++) {
      result.push({
        type: 'star',
        x: Math.random() * 95 + 2.5,
        y: Math.random() * 90 + 5,
        size: Math.random() * 10 + 8, // 8-18px
        delay: Math.random() * 10,
        duration: Math.random() * 5 + 7, // 7-12 sekunder
      });
    }
    
    // Små twinkling dots (30-40 st)
    for (let i = 0; i < 35; i++) {
      result.push({
        type: 'dot',
        x: Math.random() * 98 + 1,
        y: Math.random() * 95 + 2.5,
        size: Math.random() * 2 + 1, // 1-3px
        delay: Math.random() * 12,
        duration: Math.random() * 6 + 8, // 8-14 sekunder
      });
    }
    
    return result;
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* CSS Animation Keyframes */}
      <style>{`
        @keyframes starPulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
      
      {/* Rendera stjärnor */}
      {stars.map((star, index) => (
        star.type === 'star' ? (
          <Star
            key={`star-${index}`}
            x={star.x}
            y={star.y}
            size={star.size}
            delay={star.delay}
            duration={star.duration}
            isDark={isDark}
          />
        ) : (
          <TwinkleDot
            key={`dot-${index}`}
            x={star.x}
            y={star.y}
            size={star.size}
            delay={star.delay}
            duration={star.duration}
            isDark={isDark}
          />
        )
      ))}
      
      {/* Subtila glödande områden i bakgrunden */}
      <div 
        className={`absolute w-96 h-96 rounded-full blur-3xl transition-colors duration-700
          ${isDark ? 'bg-neon-purple/5' : 'bg-purple-400/5'}`}
        style={{ 
          top: '10%', 
          left: '10%',
          animation: 'starPulse 15s ease-in-out infinite',
        }}
      />
      <div 
        className={`absolute w-80 h-80 rounded-full blur-3xl transition-colors duration-700
          ${isDark ? 'bg-neon-cyan/5' : 'bg-amber-300/5'}`}
        style={{ 
          bottom: '20%', 
          right: '15%',
          animation: 'starPulse 18s ease-in-out infinite',
          animationDelay: '5s',
        }}
      />
    </div>
  );
};

export default NodeNetwork;