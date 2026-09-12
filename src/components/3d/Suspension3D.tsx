import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSimulation } from '../../context/SimulationContext';

export const Suspension3D: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { overallStatus } = useSimulation();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime();
      let amp = 0.02;
      let freq = 2.0;

      if (overallStatus === 'DANGER') {
        amp = 0.10;
        freq = 6.0;
      } else if (overallStatus === 'CAUTION') {
        amp = 0.05;
        freq = 4.0;
      }

      // Lock position strictly at X=0, Z=0 and oscillate centered around Y=0
      groupRef.current.position.set(0, Math.sin(t * freq) * amp, 0);
      groupRef.current.rotation.set(0, 0, Math.cos(t * (freq * 0.5)) * (amp * 0.08));
    }
  });

  const getDeckColor = () => {
    if (overallStatus === 'DANGER') return '#ef4444';
    if (overallStatus === 'CAUTION') return '#f59e0b';
    return '#334155';
  };

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Aerodynamic Box Girder Deck */}
      <mesh position={[0, -0.4, 0]}>
        <boxGeometry args={[14.0, 0.3, 1.8]} />
        <meshStandardMaterial color={getDeckColor()} metalness={0.4} roughness={0.5} />
      </mesh>

      {/* Main Left Pylon Tower */}
      <group position={[-3.8, 0.7, 0]}>
        <mesh position={[-0.4, 0, 0.8]}>
          <boxGeometry args={[0.4, 6.2, 0.4]} />
          <meshStandardMaterial color="#475569" metalness={0.6} />
        </mesh>
        <mesh position={[-0.4, 0, -0.8]}>
          <boxGeometry args={[0.4, 6.2, 0.4]} />
          <meshStandardMaterial color="#475569" metalness={0.6} />
        </mesh>
        <mesh position={[-0.4, 3.6, 0]}>
          <boxGeometry args={[0.4, 0.4, 2.0]} />
          <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* Main Right Pylon Tower */}
      <group position={[3.8, 0.7, 0]}>
        <mesh position={[0.4, 0, 0.8]}>
          <boxGeometry args={[0.4, 6.2, 0.4]} />
          <meshStandardMaterial color="#475569" metalness={0.6} />
        </mesh>
        <mesh position={[0.4, 0, -0.8]}>
          <boxGeometry args={[0.4, 6.2, 0.4]} />
          <meshStandardMaterial color="#475569" metalness={0.6} />
        </mesh>
        <mesh position={[0.4, 3.6, 0]}>
          <boxGeometry args={[0.4, 0.4, 2.0]} />
          <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* Main Catenary Cable Curves */}
      {[-0.8, 0.8].map((zPos, idx) => (
        <mesh key={idx} position={[0, 1.8, zPos]}>
          <torusGeometry args={[4.2, 0.08, 16, 64, Math.PI]} />
          <meshStandardMaterial color="#38bdf8" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* Vertical Hanger Cables */}
      {Array.from({ length: 17 }).map((_, i) => {
        const x = -3.4 + i * 0.425;
        const distFromCenter = Math.abs(x) / 3.8;
        const hangerHeight = 0.5 + Math.pow(distFromCenter, 2) * 2.8;

        return (
          <group key={i} position={[x, -0.25 + hangerHeight / 2, 0]}>
            <mesh position={[0, 0, 0.8]}>
              <cylinderGeometry args={[0.02, 0.02, hangerHeight, 8]} />
              <meshStandardMaterial color="#38bdf8" />
            </mesh>
            <mesh position={[0, 0, -0.8]}>
              <cylinderGeometry args={[0.02, 0.02, hangerHeight, 8]} />
              <meshStandardMaterial color="#38bdf8" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};
