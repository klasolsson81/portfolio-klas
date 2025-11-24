import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ÖKAT ANTAL OCH TYDLIGHET
const PARTICLE_COUNT = 100; // Fler punkter
const CONNECT_DISTANCE = 4;

function Network() {
  const points = useMemo(() => {
    return new Array(PARTICLE_COUNT).fill(0).map(() => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 35, // Större spridning
        (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 15
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.02, // Lite snabbare rörelse
        (Math.random() - 0.5) * 0.02,
        0
      )
    }));
  }, []);

  const linesGeometry = useRef();

  useFrame(({ mouse }) => {
    points.forEach(p => {
      p.position.add(p.velocity);
      // Studsa mot väggarna
      if (Math.abs(p.position.x) > 18) p.velocity.x *= -1;
      if (Math.abs(p.position.y) > 18) p.velocity.y *= -1;
    });

    const positions = [];
    // Mus-interaktion (gör den starkare)
    const mouseVec = new THREE.Vector3(mouse.x * 15, mouse.y * 15, 0);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const dist = points[i].position.distanceTo(points[j].position);
        const distToMouse = points[i].position.distanceTo(mouseVec);
        
        // Rita linje om de är nära varandra ELLER nära musen
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
        {/* Starkare färg och mindre transparens */}
        <pointsMaterial size={0.2} color="#00f3ff" transparent opacity={0.8} sizeAttenuation={true} />
      </points>
      <lineSegments>
        <bufferGeometry ref={linesGeometry} />
        {/* Tydligare linjer (lila/blå) */}
        <lineBasicMaterial color="#bd00ff" transparent opacity={0.3} linewidth={2} />
      </lineSegments>
    </group>
  );
}

export default function NodeNetwork() {
  return (
    // Lägg till en mörkblå/lila gradient i botten
    <div className="fixed inset-0 z-[-1] bg-gradient-radial from-neon-darkbg to-neon-darkerbg">
      <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
        <fog attach="fog" args={['#0a0b1e', 5, 30]} /> {/* Dimma för djup */}
        <Network />
      </Canvas>
    </div>
  );
}