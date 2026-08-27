import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSimulation } from '../../context/SimulationContext';

export const ArchBridge3D: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { latestReadings } = useSimulation();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime();
      const a1 = latestReadings.find(r => r.nodeCode === 'A1');
      const vibRms = a1 ? a1.filteredVibrationRms : 0.1;
      const amp = Math.min(0.2, vibRms * 0.12);
      groupRef.current.position.y = Math.sin(t * 10) * amp;
    }
  });

  // Render parabolic arch rib points
  const archRibPoints = React.useMemo(() => {
    const points: [number, number, number][] = [];
    const count = 30;
    for (let i = 0; i <= count; i++) {
      const x = -4.5 + (i / count) * 9.0;
      // Parabola equation y = -a*x^2 + h
      const y = -0.16 * (x * x) + 2.8;
      points.push([x, y, 0]);
    }
    return points;
  }, []);

  return (
    <group ref={groupRef}>
      {/* Horizontal Deck Slab */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[9.5, 0.3, 1.4]} />
        <meshStandardMaterial color="#64748b" roughness={0.4} />
      </mesh>

      {/* Main Steel Arch Rib (Front & Back Dual Ribs) */}
      {[-0.6, 0.6].map((z, k) => (
        <group key={k} position={[0, 0, z]}>
          {archRibPoints.map((pt, i) => {
            if (i === archRibPoints.length - 1) return null;
            const nextPt = archRibPoints[i + 1];
            const dx = nextPt[0] - pt[0];
            const dy = nextPt[1] - pt[1];
            const dist = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx);
            const midX = (pt[0] + nextPt[0]) / 2;
            const midY = (pt[1] + nextPt[1]) / 2;

            return (
              <mesh key={i} position={[midX, midY, 0]} rotation={[0, 0, angle]} castShadow>
                <boxGeometry args={[dist + 0.05, 0.25, 0.2]} />
                <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.3} />
              </mesh>
            );
          })}
        </group>
      ))}

      {/* Vertical Spandrel Columns linking Arch Rib to Deck */}
      {[-3, -1.8, -0.6, 0.6, 1.8, 3].map((x, i) => {
        const archY = -0.16 * (x * x) + 2.8;
        const columnHeight = archY - 0.2;
        if (columnHeight <= 0.1) return null;
        const midY = 0.2 + columnHeight / 2;

        return (
          <group key={i} position={[x, midY, 0]}>
            {[-0.6, 0.6].map((z, j) => (
              <mesh key={j} position={[0, 0, z]} castShadow>
                <cylinderGeometry args={[0.08, 0.08, columnHeight, 12]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.6} />
              </mesh>
            ))}
          </group>
        );
      })}

      {/* Concrete Abutments at Arch Springing */}
      {[-4.4, 4.4].map((x, i) => (
        <mesh key={i} position={[x, -1.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 2.5, 1.8]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
};
