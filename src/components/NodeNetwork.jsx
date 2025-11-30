import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// =====================================================
// PERFORMANCE HOOKS (inbyggda för att undvika extra import)
// =====================================================
const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < breakpoint);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  return isMobile;
};

const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
};

// =====================================================
// SIMPLE FALLBACK (för mobil / reduced motion)
// =====================================================
const SimpleFallback = ({ isDark }) => (
  <div className={`fixed inset-0 z-0 pointer-events-none transition-colors duration-700 ${
    isDark ? 'bg-neon-darkbg' : 'bg-warm-bg'
  }`}>
    {/* Subtila glödande orbs som CSS-animation */}
    <div className="absolute inset-0 overflow-hidden opacity-30">
      <div 
        className={`absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl animate-pulse ${
          isDark ? 'bg-neon-purple' : 'bg-purple-300'
        }`} 
        style={{ animationDuration: '4s' }}
      />
      <div 
        className={`absolute top-1/2 right-1/4 w-48 h-48 rounded-full blur-3xl animate-pulse ${
          isDark ? 'bg-neon-cyan' : 'bg-cyan-300'
        }`} 
        style={{ animationDuration: '5s', animationDelay: '1s' }}
      />
      <div 
        className={`absolute bottom-1/4 left-1/3 w-56 h-56 rounded-full blur-3xl animate-pulse ${
          isDark ? 'bg-neon-purple/50' : 'bg-purple-200'
        }`} 
        style={{ animationDuration: '6s', animationDelay: '2s' }}
      />
    </div>
  </div>
);

// =====================================================
// 3D NETWORK (original, med dynamiskt partikelantal)
// =====================================================
const CONNECT_DISTANCE = 6;

function Network({ isDark, particleCount }) {
  // Mörkare noder i ljust läge för kontrast
  const pointColor = isDark ? "#00f3ff" : "#1e3a8a"; 
  const lineColor = isDark ? "#bd00ff" : "#4f46e5";
  const opacity = isDark ? 0.6 : 0.4; 

  const points = useMemo(() => {
    return new Array(particleCount).fill(0).map(() => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 15
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        0
      )
    }));
  }, [particleCount]);

  const linesGeometry = useRef();

  useFrame(({ mouse }) => {
    points.forEach(p => {
      p.position.add(p.velocity);
      if (Math.abs(p.position.x) > 18) p.velocity.x *= -1;
      if (Math.abs(p.position.y) > 18) p.velocity.y *= -1;
    });

    const positions = [];
    const mouseVec = new THREE.Vector3(mouse.x * 15, mouse.y * 15, 0);

    for (let i = 0; i < particleCount; i++) {
      for (let j = i + 1; j < particleCount; j++) {
        const dist = points[i].position.distanceTo(points[j].position);
        const distToMouse = points[i].position.distanceTo(mouseVec);
        
        if (dist < CONNECT_DISTANCE || (dist < CONNECT_DISTANCE * 1.8 && distToMouse < 5)) {
          positions.push(
            points[i].position.x, points[i].position.y, points[i].position.z,
            points[j].position.x, points[j].position.y, points[j].position.z
          );
        }
      }
    }

    if (linesGeometry.current) {
      linesGeometry.current.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(positions, 3)
      );
    }
  });

  return (
    <group>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={points.length}
            array={new Float32Array(points.flatMap(p => [p.position.x, p.position.y, p.position.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.2} color={pointColor} transparent opacity={opacity} sizeAttenuation={true} />
      </points>
      <lineSegments>
        <bufferGeometry ref={linesGeometry} />
        <lineBasicMaterial color={lineColor} transparent opacity={opacity * 0.5} linewidth={2} />
      </lineSegments>
    </group>
  );
}

// =====================================================
// MAIN EXPORT (med smart fallback)
// =====================================================
export default function NodeNetwork({ isDark }) {
  const isMobile = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion();
  
  // På mobil eller reduced motion: visa enkel CSS-fallback
  if (isMobile || prefersReducedMotion) {
    return <SimpleFallback isDark={isDark} />;
  }

  // Desktop: full 3D-upplevelse
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 15], fov: 75 }} gl={{ alpha: true }}> 
        {isDark && <fog attach="fog" args={['#0a0b1e', 5, 30]} />}
        <Network isDark={isDark} particleCount={50} />
      </Canvas>
    </div>
  );
}