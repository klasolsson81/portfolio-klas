import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// =====================================================
// PERFORMANCE HOOKS
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
  <div className={`fixed inset-0 z-0 pointer-events-none transition-colors duration-700`}>
    {/* Subtila glödande stjärnor som CSS */}
    <div className="absolute inset-0 overflow-hidden">
      {/* Stjärnor */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className={`absolute rounded-full animate-pulse ${
            isDark ? 'bg-white' : 'bg-purple-600'
          }`}
          style={{
            width: Math.random() * 3 + 1 + 'px',
            height: Math.random() * 3 + 1 + 'px',
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
            opacity: isDark ? 0.6 : 0.4,
            animationDuration: (Math.random() * 3 + 2) + 's',
            animationDelay: Math.random() * 2 + 's',
            boxShadow: isDark 
              ? '0 0 6px 2px rgba(0, 243, 255, 0.5)' 
              : '0 0 6px 2px rgba(124, 58, 237, 0.4)',
          }}
        />
      ))}
      {/* Glödande orbs */}
      <div 
        className={`absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl animate-pulse ${
          isDark ? 'bg-neon-purple/20' : 'bg-purple-400/20'
        }`} 
        style={{ animationDuration: '4s' }}
      />
      <div 
        className={`absolute top-1/2 right-1/4 w-48 h-48 rounded-full blur-3xl animate-pulse ${
          isDark ? 'bg-neon-cyan/20' : 'bg-orange-300/20'
        }`} 
        style={{ animationDuration: '5s', animationDelay: '1s' }}
      />
    </div>
  </div>
);

// =====================================================
// STAR SHADER MATERIAL (för glow-effekt)
// =====================================================
const StarMaterial = ({ isDark }) => {
  const materialRef = useRef();
  
  useFrame(({ clock }) => {
    if (materialRef.current) {
      // Pulsera opaciteten för "twinkling" effekt
      materialRef.current.opacity = 0.6 + Math.sin(clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <pointsMaterial
      ref={materialRef}
      size={isDark ? 0.15 : 0.12}
      color={isDark ? "#ffffff" : "#5B21B6"}
      transparent
      opacity={0.8}
      sizeAttenuation={true}
      blending={THREE.AdditiveBlending}
      depthWrite={false}
    />
  );
};

// =====================================================
// ANIMATED CONNECTIONS (linjer som "hoppar")
// =====================================================
function AnimatedConnections({ points, isDark, particleCount }) {
  const linesRef = useRef();
  const lineColorRef = useRef();
  const activeConnections = useRef([]);
  const lastUpdateTime = useRef(0);
  
  // Färger
  const lineColor = isDark ? "#00f3ff" : "#7C3AED";
  
  useFrame(({ clock, mouse }) => {
    const time = clock.elapsedTime;
    
    // Uppdatera aktiva connections var 0.5 sekund
    if (time - lastUpdateTime.current > 0.5) {
      lastUpdateTime.current = time;
      
      // Välj slumpmässiga par att koppla
      activeConnections.current = [];
      const numConnections = Math.floor(particleCount * 0.3); // 30% av partiklar kopplade
      
      for (let i = 0; i < numConnections; i++) {
        const from = Math.floor(Math.random() * particleCount);
        let to = Math.floor(Math.random() * particleCount);
        while (to === from) {
          to = Math.floor(Math.random() * particleCount);
        }
        
        // Kolla avstånd
        const dist = points[from].position.distanceTo(points[to].position);
        if (dist < 8) {
          activeConnections.current.push({ from, to, progress: 0 });
        }
      }
    }
    
    // Animera linjer
    const positions = [];
    const colors = [];
    
    const mouseVec = new THREE.Vector3(mouse.x * 15, mouse.y * 15, 0);
    
    activeConnections.current.forEach(conn => {
      // Öka progress för "hoppande" effekt
      conn.progress = Math.min(conn.progress + 0.05, 1);
      
      const fromPos = points[conn.from].position;
      const toPos = points[conn.to].position;
      
      // Interpolera positionen baserat på progress
      const currentEnd = new THREE.Vector3().lerpVectors(fromPos, toPos, conn.progress);
      
      positions.push(
        fromPos.x, fromPos.y, fromPos.z,
        currentEnd.x, currentEnd.y, currentEnd.z
      );
      
      // Färg med fade baserat på avstånd till mus
      const distToMouse = fromPos.distanceTo(mouseVec);
      const intensity = distToMouse < 5 ? 1 : 0.5;
      
      if (isDark) {
        colors.push(0, intensity, 1, intensity * 0.7, 0, 1); // Cyan till lila
      } else {
        colors.push(intensity * 0.5, 0.2, intensity, intensity * 0.3, 0.1, 0.5); // Lila toner
      }
    });
    
    // Lägg till permanenta kopplingar nära musen
    for (let i = 0; i < particleCount; i++) {
      for (let j = i + 1; j < particleCount; j++) {
        const dist = points[i].position.distanceTo(points[j].position);
        const distToMouse = points[i].position.distanceTo(mouseVec);
        
        if (dist < 4 && distToMouse < 6) {
          positions.push(
            points[i].position.x, points[i].position.y, points[i].position.z,
            points[j].position.x, points[j].position.y, points[j].position.z
          );
          
          if (isDark) {
            colors.push(0, 1, 1, 0.7, 0, 1);
          } else {
            colors.push(0.5, 0.2, 0.9, 0.3, 0.1, 0.5);
          }
        }
      }
    }
    
    if (linesRef.current) {
      linesRef.current.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(positions, 3)
      );
      linesRef.current.setAttribute(
        'color',
        new THREE.Float32BufferAttribute(colors, 3)
      );
    }
  });

  return (
    <lineSegments>
      <bufferGeometry ref={linesRef} />
      <lineBasicMaterial 
        vertexColors 
        transparent 
        opacity={isDark ? 0.6 : 0.4} 
        linewidth={1}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

// =====================================================
// STAR FIELD (levande stjärnor med twinkling)
// =====================================================
function StarField({ isDark, particleCount }) {
  const pointsRef = useRef();
  const sizesRef = useRef();
  
  // Skapa stjärnor med individuella egenskaper
  const stars = useMemo(() => {
    return new Array(particleCount).fill(0).map(() => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 20
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.015,
        (Math.random() - 0.5) * 0.015,
        0
      ),
      baseSize: Math.random() * 0.1 + 0.05,
      twinkleSpeed: Math.random() * 2 + 1,
      twinkleOffset: Math.random() * Math.PI * 2,
    }));
  }, [particleCount]);

  // Skapa initial geometri
  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const siz = new Float32Array(particleCount);
    
    stars.forEach((star, i) => {
      pos[i * 3] = star.position.x;
      pos[i * 3 + 1] = star.position.y;
      pos[i * 3 + 2] = star.position.z;
      siz[i] = star.baseSize;
    });
    
    return [pos, siz];
  }, [stars, particleCount]);

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    
    stars.forEach((star, i) => {
      // Rörelse
      star.position.add(star.velocity);
      
      // Studsa vid kanter
      if (Math.abs(star.position.x) > 20) star.velocity.x *= -1;
      if (Math.abs(star.position.y) > 20) star.velocity.y *= -1;
      
      // Uppdatera position i geometrin
      if (pointsRef.current) {
        const posArray = pointsRef.current.attributes.position.array;
        posArray[i * 3] = star.position.x;
        posArray[i * 3 + 1] = star.position.y;
        posArray[i * 3 + 2] = star.position.z;
      }
      
      // Twinkling effekt
      if (sizesRef.current) {
        const sizeArray = sizesRef.current.array;
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
        sizeArray[i] = star.baseSize * (1 + twinkle * 0.5);
      }
    });
    
    if (pointsRef.current) {
      pointsRef.current.attributes.position.needsUpdate = true;
    }
    if (sizesRef.current) {
      sizesRef.current.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Huvudstjärnor */}
      <points>
        <bufferGeometry ref={pointsRef}>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            ref={sizesRef}
            attach="attributes-size"
            count={particleCount}
            array={sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isDark ? 0.2 : 0.15}
          color={isDark ? "#ffffff" : "#6D28D9"}
          transparent
          opacity={isDark ? 0.9 : 0.7}
          sizeAttenuation={true}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      
      {/* Glow-layer (större, mer transparent) */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isDark ? 0.5 : 0.35}
          color={isDark ? "#00f3ff" : "#A78BFA"}
          transparent
          opacity={isDark ? 0.3 : 0.2}
          sizeAttenuation={true}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      
      {/* Animerade kopplingar */}
      <AnimatedConnections points={stars} isDark={isDark} particleCount={particleCount} />
    </group>
  );
}

// =====================================================
// MAIN EXPORT
// =====================================================
export default function NodeNetwork({ isDark }) {
  const isMobile = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion();
  
  // På mobil eller reduced motion: visa enkel CSS-fallback
  if (isMobile || prefersReducedMotion) {
    return <SimpleFallback isDark={isDark} />;
  }

  // Desktop: full 3D-upplevelse med stjärnor
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 15], fov: 75 }} 
        gl={{ alpha: true, antialias: true }}
      > 
        {isDark && <fog attach="fog" args={['#0a0b1e', 8, 35]} />}
        <StarField isDark={isDark} particleCount={60} />
      </Canvas>
    </div>
  );
}