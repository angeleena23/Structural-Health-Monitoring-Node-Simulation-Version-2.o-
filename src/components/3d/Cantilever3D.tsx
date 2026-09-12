import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSimulation } from '../../context/SimulationContext';

export const Cantilever3D: React.FC = () => {
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
      {/* Central Suspended Deck Span */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.5, 0.3, 1.4]} />
        <meshStandardMaterial color="#64748b" roughness={0.4} />
      </mesh>

      {/* Cantilever Arm Superstructures (Left & Right Balanced Anchors) */}
      {[-3.6, 3.6].map((pierX, idx) => (
        <group key={idx} position={[pierX, 0, 0]}>
          {/* Main Tower Pier */}
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[0.8, 4.2, 1.6]} />
            <meshStandardMaterial color="#475569" roughness={0.5} />
          </mesh>

          {/* Cantilever Arm Tapered Trusses */}
          {[-0.65, 0.65].map((z, k) => (
            <group key={k} position={[0, 0, z]}>
              <mesh position={[-1.6, 0.8, 0]} rotation={[0, 0, 0.25]}>
                <boxGeometry args={[3.2, 0.12, 0.1]} />
                <meshStandardMaterial color="#0284c7" metalness={0.7} />
              </mesh>
              <mesh position={[1.6, 0.8, 0]} rotation={[0, 0, -0.25]}>
                <boxGeometry args={[3.2, 0.12, 0.1]} />
                <meshStandardMaterial color="#0284c7" metalness={0.7} />
              </mesh>
            </group>
          ))}

          {/* Concrete Footing */}
          <mesh position={[0, -2.4, 0]} castShadow>
            <boxGeometry args={[1.6, 0.6, 1.8]} />
            <meshStandardMaterial color="#334155" roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
