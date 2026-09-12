import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSimulation } from '../../context/SimulationContext';

export const TrussBridge3D: React.FC = () => {
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

  const panelCount = 6;
  const panelWidth = 1.5;
  const trussHeight = 1.6;
  const startX = -((panelCount * panelWidth) / 2);

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Lower Deck Slab */}
      <mesh position={[0, -0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[panelCount * panelWidth + 0.5, 0.25, 1.4]} />
        <meshStandardMaterial color="#475569" roughness={0.5} />
      </mesh>

      {/* Side Truss Frameworks (Front & Back) */}
      {[-0.65, 0.65].map((z, k) => (
        <group key={k} position={[0, 0, z]}>
          {/* Bottom Chord */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[panelCount * panelWidth, 0.12, 0.1]} />
            <meshStandardMaterial color="#0f766e" metalness={0.7} roughness={0.3} />
          </mesh>

          {/* Top Chord */}
          <mesh position={[0, trussHeight, 0]}>
            <boxGeometry args={[panelCount * panelWidth, 0.12, 0.1]} />
            <meshStandardMaterial color="#0f766e" metalness={0.7} roughness={0.3} />
          </mesh>

          {/* Vertical Posts & Diagonal Web Members */}
          {Array.from({ length: panelCount + 1 }).map((_, i) => {
            const x = startX + i * panelWidth;

            return (
              <React.Fragment key={i}>
                {/* Vertical Post */}
                <mesh position={[x, trussHeight / 2, 0]}>
                  <cylinderGeometry args={[0.05, 0.05, trussHeight, 10]} />
                  <meshStandardMaterial color="#14b8a6" metalness={0.8} />
                </mesh>

                {/* Diagonal Web Brace */}
                {i < panelCount && (
                  <mesh
                    position={[x + panelWidth / 2, trussHeight / 2, 0]}
                    rotation={[0, 0, i % 2 === 0 ? Math.atan2(trussHeight, panelWidth) : -Math.atan2(trussHeight, panelWidth)]}
                  >
                    <cylinderGeometry args={[0.04, 0.04, Math.hypot(panelWidth, trussHeight), 10]} />
                    <meshStandardMaterial color="#0d9488" metalness={0.8} />
                  </mesh>
                )}
              </React.Fragment>
            );
          })}
        </group>
      ))}

      {/* Top Cross Bracing portal sway frames */}
      {Array.from({ length: panelCount + 1 }).map((_, i) => (
        <mesh key={i} position={[startX + i * panelWidth, trussHeight, 0]}>
          <boxGeometry args={[0.1, 0.1, 1.4]} />
          <meshStandardMaterial color="#0f766e" metalness={0.7} />
        </mesh>
      ))}

      {/* Support Piers */}
      {[-3.8, 3.8].map((x, i) => (
        <mesh key={i} position={[x, -1.6, 0]} castShadow>
          <boxGeometry args={[1.2, 2.8, 1.6]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
};
