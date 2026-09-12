import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSimulation } from '../../context/SimulationContext';

export const CableStayed3D: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { overallStatus } = useSimulation();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime();
      let amp = 0.015;
      let freq = 2.5;

      if (overallStatus === 'DANGER') {
        amp = 0.07;
        freq = 7.0;
      } else if (overallStatus === 'CAUTION') {
        amp = 0.035;
        freq = 4.5;
      }

      groupRef.current.position.set(0, Math.sin(t * freq) * amp, 0);
      groupRef.current.rotation.set(0, 0, Math.cos(t * (freq * 0.5)) * (amp * 0.05));
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Deck Girder */}
      <mesh position={[0, -0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[13.5, 0.3, 1.6]} />
        <meshStandardMaterial color="#475569" roughness={0.4} />
      </mesh>

      {/* Main A-Frame Pylon Tower */}
      <group position={[0, 1.4, 0]}>
        {/* Left Pylon Leg */}
        <mesh position={[0, 0, 0.7]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.5, 5.2, 0.4]} />
          <meshStandardMaterial color="#0284c7" metalness={0.6} />
        </mesh>
        {/* Right Pylon Leg */}
        <mesh position={[0, 0, -0.7]} rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[0.5, 5.2, 0.4]} />
          <meshStandardMaterial color="#0284c7" metalness={0.6} />
        </mesh>
        {/* Pylon Crest Cap */}
        <mesh position={[0, 2.5, 0]}>
          <boxGeometry args={[0.6, 0.5, 0.6]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* Diagonal Stay Cables Fan Array */}
      {[-0.6, 0.6].map((zPos, zIdx) => (
        <group key={zIdx}>
          {[-5.4, -4.0, -2.6, -1.2, 1.2, 2.6, 4.0, 5.4].map((deckX, i) => {
            const towerHeight = 3.6;
            const dx = deckX;
            const dy = towerHeight - (-0.4);
            const dist = Math.hypot(dx, dy);
            const angle = Math.atan2(dy, dx);

            return (
              <mesh
                key={i}
                position={[deckX / 2, (-0.4 + towerHeight) / 2, zPos]}
                rotation={[0, 0, angle - Math.PI / 2]}
              >
                <cylinderGeometry args={[0.02, 0.02, dist, 8]} />
                <meshStandardMaterial color="#38bdf8" metalness={0.9} roughness={0.1} />
              </mesh>
            );
          })}
        </group>
      ))}

      {/* Substructure Pier Foundation */}
      <mesh position={[0, -2.4, 0]} castShadow>
        <boxGeometry args={[1.8, 2.8, 2.2]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>
    </group>
  );
};
