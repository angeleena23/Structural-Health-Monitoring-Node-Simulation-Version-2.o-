import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSimulation } from '../../context/SimulationContext';

export const CableStayed3D: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { latestReadings } = useSimulation();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime();
      const cs1 = latestReadings.find(r => r.nodeCode === 'CS1');
      const vibRms = cs1 ? cs1.filteredVibrationRms : 0.15;
      const amp = Math.min(0.2, vibRms * 0.14);
      groupRef.current.position.y = Math.sin(t * 11) * amp;
    }
  });

  const pylonApexY = 3.8;
  const pylonBaseX = 0;

  // Diagonal stay cable anchoring positions along deck
  const stayDeckPositions = [-4.5, -3.6, -2.7, -1.8, -0.9, 0.9, 1.8, 2.7, 3.6, 4.5];

  return (
    <group ref={groupRef}>
      {/* Central Deck Girder */}
      <mesh position={[0, -0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[11, 0.3, 1.5]} />
        <meshStandardMaterial color="#64748b" roughness={0.4} />
      </mesh>

      {/* Main A-Frame Concrete Pylon Tower */}
      <group position={[pylonBaseX, 0, 0]}>
        {/* Pier Foundation Footing */}
        <mesh position={[0, -2.2, 0]} castShadow>
          <boxGeometry args={[1.6, 2.4, 2.0]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>

        {/* Left Pylon Leg */}
        <mesh position={[-0.45, 1.0, 0]} rotation={[0, 0, -Math.PI / 18]} castShadow>
          <cylinderGeometry args={[0.2, 0.35, 4.4, 16]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.3} />
        </mesh>

        {/* Right Pylon Leg */}
        <mesh position={[0.45, 1.0, 0]} rotation={[0, 0, Math.PI / 18]} castShadow>
          <cylinderGeometry args={[0.2, 0.35, 4.4, 16]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.3} />
        </mesh>

        {/* Upper Apex Cap */}
        <mesh position={[0, pylonApexY, 0]}>
          <boxGeometry args={[0.5, 0.4, 0.6]} />
          <meshStandardMaterial color="#0284c7" metalness={0.8} />
        </mesh>
      </group>

      {/* Fan-Arranged Diagonal Stay Cables (Front & Back Cable Planes) */}
      {[-0.6, 0.6].map((z, k) => (
        <group key={k} position={[0, 0, z]}>
          {stayDeckPositions.map((x, i) => {
            // Anchor height on pylon increases with distance
            const stayTowerY = 2.0 + (Math.abs(x) / 5.0) * 1.6;
            const dx = x - pylonBaseX;
            const dy = -0.2 - stayTowerY;
            const dist = Math.hypot(dx, dy);
            const angle = Math.atan2(dy, dx);
            const midX = (x + pylonBaseX) / 2;
            const midY = (-0.2 + stayTowerY) / 2;

            return (
              <mesh key={i} position={[midX, midY, 0]} rotation={[0, 0, angle]}>
                <cylinderGeometry args={[0.025, 0.025, dist, 8]} />
                <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.2} />
              </mesh>
            );
          })}
        </group>
      ))}

      {/* Substructure Support Piers at Ends */}
      {[-4.8, 4.8].map((x, i) => (
        <mesh key={i} position={[x, -1.6, 0]} castShadow>
          <boxGeometry args={[1.0, 2.5, 1.5]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
};
