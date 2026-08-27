import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSimulation } from '../../context/SimulationContext';

export const Cantilever3D: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { latestReadings } = useSimulation();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime();
      const c1 = latestReadings.find(r => r.nodeCode === 'C1');
      const vibRms = c1 ? c1.filteredVibrationRms : 0.14;
      const amp = Math.min(0.22, vibRms * 0.15);
      groupRef.current.position.y = Math.sin(t * 11) * amp;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Continuous Deck Box Girder */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[10, 0.35, 1.4]} />
        <meshStandardMaterial color="#64748b" roughness={0.4} />
      </mesh>

      {/* Main Vertical Pier Towers (Left Pier & Right Pier) */}
      {[-3.2, 3.2].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          {/* Main Pier Column */}
          <mesh position={[0, -1.5, 0]} castShadow>
            <boxGeometry args={[1.2, 2.6, 1.6]} />
            <meshStandardMaterial color="#334155" roughness={0.8} />
          </mesh>

          {/* Tower Superstructure above pier root (High moment zone) */}
          {[-0.6, 0.6].map((z, j) => (
            <group key={j} position={[0, 0, z]}>
              {/* Vertical Tower Post */}
              <mesh position={[0, 1.0, 0]}>
                <boxGeometry args={[0.3, 2.0, 0.12]} />
                <meshStandardMaterial color="#4f46e5" metalness={0.7} />
              </mesh>
              {/* Left Tapered Anchor Arm */}
              <mesh position={[-0.9, 0.5, 0]} rotation={[0, 0, -Math.PI / 8]}>
                <boxGeometry args={[1.8, 0.15, 0.1]} />
                <meshStandardMaterial color="#4338ca" metalness={0.7} />
              </mesh>
              {/* Right Tapered Cantilever Arm */}
              <mesh position={[0.9, 0.5, 0]} rotation={[0, 0, Math.PI / 8]}>
                <boxGeometry args={[1.8, 0.15, 0.1]} />
                <meshStandardMaterial color="#4338ca" metalness={0.7} />
              </mesh>
            </group>
          ))}
        </group>
      ))}

      {/* Expansion Joint Hinges */}
      {[-1.4, 1.4].map((x, i) => (
        <mesh key={i} position={[x, 0, 0.72]}>
          <cylinderGeometry args={[0.08, 0.08, 0.3, 12]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} />
        </mesh>
      ))}
    </group>
  );
};
