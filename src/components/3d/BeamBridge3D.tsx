import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSimulation } from '../../context/SimulationContext';

export const BeamBridge3D: React.FC = () => {
  const bridgeGroupRef = useRef<THREE.Group>(null);
  const { overallStatus, latestReadings } = useSimulation();

  // Dynamic vibration & bending displacement physics
  useFrame(({ clock }) => {
    if (bridgeGroupRef.current) {
      const t = clock.getElapsedTime();
      const b1 = latestReadings.find(r => r.nodeCode === 'B1');
      const vibRms = b1 ? b1.filteredVibrationRms : 0.1;

      // Vertical vibration oscillation
      const amp = Math.min(0.25, vibRms * 0.15);
      bridgeGroupRef.current.position.y = Math.sin(t * 12) * amp;

      // Color stress response under high vibration
      if (overallStatus === 'DANGER') {
        bridgeGroupRef.current.rotation.z = Math.sin(t * 18) * 0.02;
      } else {
        bridgeGroupRef.current.rotation.z = 0;
      }
    }
  });

  return (
    <group ref={bridgeGroupRef}>
      {/* Main Horizontal Concrete Deck Box Girder */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[9, 0.4, 1.6]} />
        <meshStandardMaterial color="#64748b" roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Asphalt Roadway Top Slab */}
      <mesh position={[0, 0.21, 0]} receiveShadow>
        <boxGeometry args={[9, 0.04, 1.4]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>

      {/* Roadway Centerline Dash Markers */}
      {[-3, -1.5, 0, 1.5, 3].map((x, i) => (
        <mesh key={i} position={[x, 0.24, 0]}>
          <boxGeometry args={[0.6, 0.01, 0.08]} />
          <meshBasicMaterial color="#facc15" />
        </mesh>
      ))}

      {/* Guardrails */}
      {[-0.72, 0.72].map((z, i) => (
        <mesh key={i} position={[0, 0.35, z]}>
          <boxGeometry args={[9, 0.25, 0.05]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* Elastomeric Bearing Pads at Piers */}
      {[-3.6, 3.6].map((x, i) => (
        <group key={i} position={[x, -0.3, 0]}>
          {[-0.4, 0.4].map((z, j) => (
            <mesh key={j} position={[0, 0, z]}>
              <boxGeometry args={[0.5, 0.2, 0.4]} />
              <meshStandardMaterial color="#0f172a" roughness={0.8} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Concrete Piers (Substructure) */}
      {[-3.8, 3.8].map((x, i) => (
        <group key={i} position={[x, -1.8, 0]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.45, 0.55, 2.8, 16]} />
            <meshStandardMaterial color="#475569" roughness={0.7} />
          </mesh>
          {/* Concrete Footing Cap */}
          <mesh position={[0, -1.3, 0]} castShadow>
            <boxGeometry args={[1.4, 0.4, 1.4]} />
            <meshStandardMaterial color="#334155" roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
