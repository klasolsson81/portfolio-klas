import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// SÄNK DENNA FRÅN 100 TILL 45 FÖR PRESTANDA
const PARTICLE_COUNT = 45; 
const CONNECT_DISTANCE = 5.5; 

function Network({ isDark }) {
  // ÄNDRING: Mörkare färger i ljust läge för bättre synlighet
  const pointColor = isDark ? "#00f3ff" : "#6366f1"; // Cyan (Mörk) vs Indigo-600 (Ljus)
  const lineColor = isDark ? "#bd00ff" : "#9333ea";  // Lila (Mörk) vs Purple-600 (Ljus)
  const opacity = isDark ? 0.8 : 0.6; // Lite starkare i ljust läge

  const points = useMemo(() => {
    return new Array(PARTICLE_COUNT).fill(0).map(() => ({
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
  }, []);

  const linesGeometry = useRef();

  useFrame(({ mouse }) => {
    points.forEach(p => {
      p.position.add(p.velocity);
      if (Math.abs(p.position.x) > 18) p.velocity.x *= -1;
      if (Math.abs(p.position.y) > 18) p.velocity.y *= -1;
    });

    const positions = [];
    const mouseVec = new THREE.Vector3(mouse.x * 15, mouse.y * 15, 0);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
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
        <lineBasicMaterial color={lineColor} transparent opacity={isDark ? 0.3 : 0.2} linewidth={2} />
      </lineSegments>
    </group>
  );
}

export default function NodeNetwork({ isDark }) {
  return (
    <div className="fixed inset-0 z-[-1]">
      <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
        {/* ÄNDRING: Tar bort dimman i ljust läge så noderna syns skarpt */}
        {isDark && <fog attach="fog" args={['#0a0b1e', 5, 30]} />}
        <Network isDark={isDark} />
      </Canvas>
    </div>
  );
}