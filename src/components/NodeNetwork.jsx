import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 50; // Lagom antal
const CONNECT_DISTANCE = 6; 

function Network({ isDark }) {
  // Mörka noder i ljust läge (Mörkblå/Lila) för kontrast
  const pointColor = isDark ? "#00f3ff" : "#1e3a8a"; 
  const lineColor = isDark ? "#bd00ff" : "#4f46e5";
  const opacity = isDark ? 0.6 : 0.4; 

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
        <lineBasicMaterial color={lineColor} transparent opacity={opacity * 0.5} linewidth={2} />
      </lineSegments>
    </group>
  );
}

export default function NodeNetwork({ isDark }) {
  return (
    // VIKTIGT: z-[-1] lägger den bakom allt. Ingen bakgrundsfärg här!
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 15], fov: 75 }} gl={{ alpha: true }}> 
        {/* Ingen dimma i ljust läge för maximal synlighet */}
        {isDark && <fog attach="fog" args={['#0a0b1e', 5, 30]} />}
        <Network isDark={isDark} />
      </Canvas>
    </div>
  );
}