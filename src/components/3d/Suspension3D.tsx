import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSimulation } from '../../context/SimulationContext';

export const Suspension3D: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { latestReadings } = useSimulation();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime();
      const sus1 = latestReadings.find(r => r.nodeCode === 'SUS1');
      const vibRms = sus1 ? sus1.filteredVibrationRms : 0.18;

      // Vertical heave + wind sway lateral motion
      const vertAmp = Math.min(0.25, vibRms * 0.16);
      const swayAmp = Math.min(0.15, vibRms * 0.12);

      groupRef.current.position.y = Math.sin(t * 8) * vertAmp;
      groupRef.current.rotation.z = Math.sin(t * 5) * (swayAmp * 0.1);
    }
  });

  // Calculate catenary main cable profile points
  const cablePoints = React.useMemo(() => {
    const pts: [number, number, number][] = [];
    const count = 40;
    for (let i = 0; i <= count; i++) {
      const x = -6.5 + (i / count) * 13.0;
      let y = 0;
      if (x < -3.8) {
        // Left anchorage to left tower
        const t = (x + 6.5) / 2.7;
        y = -1.5 + t * 5.3;
      } else if (x > 3.8) {
        // Right tower to right anchorage
        const t = (x - 3.8) / 2.7;
        y = 3.8 - t * 5.3;
      } else {
        // Central span catenary dip y = a*x^2 + h
        y = 0.25 * (x * x) + 0.9;
      }
      pts.push([x, y, 0]);
    }
    return pts;
  }, []);

  return (
    <group ref={groupRef}>
      {/* Aerodynamic Box Girder Deck */}
      <mesh position={[0, -0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[13.5, 0.28, 1.6]} />
        <meshStandardMaterial color="#475569" roughness={0.4} />
      </mesh>

      {/* Main Steel Portal Towers (Left Tower & Right Tower) */}
      {[-3.8, 3.8].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          {/* Substructure Pier Foundation */}
          <mesh position={[0, -2.0, 0]} castShadow>
            <boxGeometry args={[1.4, 2.2, 2.0]} />
            <meshStandardMaterial color="#1e293b" roughness={0.8} />
          </mesh>

          {/* Tower Legs (Front & Back) */}
          {[-0.8, 0.8].map((z, j) => (
            <mesh key={j} position={[0, 1.8, z]} castShadow>
              <boxGeometry args={[0.4, 4.0, 0.35]} />
              <meshStandardMaterial color="#b91c1c" metalness={0.6} roughness={0.3} />
            </mesh>
          ))}

          {/* Upper Tower Cross-Beams */}
          <mesh position={[0, 3.2, 0]}>
            <boxGeometry args={[0.45, 0.3, 1.8]} />
            <meshStandardMaterial color="#991b1b" metalness={0.7} />
          </mesh>
          <mesh position={[0, 1.5, 0]}>
            <boxGeometry args={[0.4, 0.25, 1.8]} />
            <meshStandardMaterial color="#991b1b" metalness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Parabolic Main Catenary Cables (Front & Back) */}
      {[-0.8, 0.8].map((z, k) => (
        <group key={k} position={[0, 0, z]}>
          {cablePoints.map((pt, i) => {
            if (i === cablePoints.length - 1) return null;
            const nextPt = cablePoints[i + 1];
            const dx = nextPt[0] - pt[0];
            const dy = nextPt[1] - pt[1];
            const dist = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx);
            const midX = (pt[0] + nextPt[0]) / 2;
            const midY = (pt[1] + nextPt[1]) / 2;

            return (
              <mesh key={i} position={[midX, midY, 0]} rotation={[0, 0, angle]}>
                <cylinderGeometry args={[0.04, 0.04, dist + 0.02, 8]} />
                <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
              </mesh>
            );
          })}
        </group>
      ))}

      {/* Vertical Suspender Ropes */}
      {Array.from({ length: 17 }).map((_, i) => {
        const x = -3.4 + i * 0.425;
        const cableY = 0.25 * (x * x) + 0.9;
        const ropeHeight = cableY - (-0.05);
        if (ropeHeight <= 0.1) return null;

        return (
          <group key={i} position={[x, -0.05 + ropeHeight / 2, 0]}>
            {[-0.8, 0.8].map((z, j) => (
              <mesh key={j} position={[0, 0, z]}>
                <cylinderGeometry args={[0.015, 0.015, ropeHeight, 6]} />
                <meshStandardMaterial color="#e2e8f0" metalness={0.9} />
              </mesh>
            ))}
          </group>
        );
      })}

      {/* Gravity Anchor Blocks at Shore Lines */}
      {[-6.5, 6.5].map((x, i) => (
        <mesh key={i} position={[x, -1.5, 0]} castShadow>
          <boxGeometry args={[1.8, 2.0, 2.2]} />
          <meshStandardMaterial color="#334155" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
};
