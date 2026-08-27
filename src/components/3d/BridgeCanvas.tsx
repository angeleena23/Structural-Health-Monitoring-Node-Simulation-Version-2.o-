import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useSimulation } from '../../context/SimulationContext';
import { useTheme } from '../../context/ThemeContext';
import { BridgeNode } from '../../data/bridgeData';

import { BeamBridge3D } from './BeamBridge3D';
import { ArchBridge3D } from './ArchBridge3D';
import { TrussBridge3D } from './TrussBridge3D';
import { Cantilever3D } from './Cantilever3D';
import { Suspension3D } from './Suspension3D';
import { CableStayed3D } from './CableStayed3D';

interface NodePinProps {
  node: BridgeNode;
  status: 'SAFE' | 'CAUTION' | 'DANGER';
  onClick: () => void;
}

const NodePinMarker: React.FC<NodePinProps> = ({ node, status, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 1.5;
    }
  });

  const getLedColor = () => {
    if (status === 'DANGER') return '#f43f5e';
    if (status === 'CAUTION') return '#f59e0b';
    return '#10b981';
  };

  const getLedClass = () => {
    if (status === 'DANGER') return 'led-red bg-rose-500 text-white';
    if (status === 'CAUTION') return 'led-amber bg-amber-500 text-slate-950';
    return 'led-emerald bg-emerald-500 text-white';
  };

  return (
    <group position={node.position3D}>
      <mesh ref={meshRef} onClick={(e) => { e.stopPropagation(); onClick(); }}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial
          color={getLedColor()}
          emissive={getLedColor()}
          emissiveIntensity={status === 'DANGER' ? 1.5 : 0.8}
          roughness={0.2}
        />
      </mesh>

      <Html distanceFactor={12} zIndexRange={[100, 0]}>
        <button
          onClick={onClick}
          className={`group flex items-center gap-1.5 px-2 py-1 rounded-md shadow-xl text-xs font-semibold backdrop-blur-md border border-white/20 transition-all transform hover:scale-110 cursor-pointer ${getLedClass()}`}
        >
          <span className="w-2 h-2 rounded-full bg-current animate-ping" />
          <span className="font-mono">{node.code}</span>
          <span className="text-[10px] opacity-80 hidden group-hover:inline">{node.nodeTypeId}</span>
        </button>
      </Html>
    </group>
  );
};

// 3D Scene Environment & Cyan Grid Floor matching screenshots
const SceneEnvironment: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <>
      <color attach="background" args={[isDark ? '#050b14' : '#f1f5f9']} />
      <ambientLight intensity={isDark ? 0.8 : 1.3} />
      <directionalLight position={[12, 18, 12]} intensity={isDark ? 1.3 : 1.6} castShadow />
      <pointLight position={[-10, 10, -10]} intensity={0.6} color="#38bdf8" />
      <pointLight position={[10, -5, 10]} intensity={0.4} color="#10b981" />

      {/* Cyan Blueprint Grid Floor */}
      <gridHelper
        args={[36, 36, isDark ? '#0284c7' : '#0284c7', isDark ? '#072444' : '#cbd5e1']}
        position={[0, -2.5, 0]}
      />
    </>
  );
};

interface BridgeCanvasProps {
  cameraPreset?: 'isometric' | 'orbit' | 'top' | 'side' | 'bottom';
  showNodePins?: boolean;
}

export const BridgeCanvas: React.FC<BridgeCanvasProps> = ({
  cameraPreset = 'isometric',
  showNodePins = true
}) => {
  const { activeBridge, latestReadings, setSelectedNode } = useSimulation();

  const getCameraPos = (): [number, number, number] => {
    switch (cameraPreset) {
      case 'top':
        return [0, 12, 0.01];
      case 'side':
        return [0, 1, 11];
      case 'bottom':
        return [0, -6, 9];
      case 'isometric':
      case 'orbit':
      default:
        return [7, 4.5, 8.5];
    }
  };

  const renderBridge3DModel = () => {
    switch (activeBridge.id) {
      case 'beam':
        return <BeamBridge3D />;
      case 'arch':
        return <ArchBridge3D />;
      case 'truss':
        return <TrussBridge3D />;
      case 'cantilever':
        return <Cantilever3D />;
      case 'suspension':
        return <Suspension3D />;
      case 'cable-stayed':
        return <CableStayed3D />;
      default:
        return <BeamBridge3D />;
    }
  };

  return (
    <div className="w-full h-full min-h-[300px] relative rounded-xl overflow-hidden shadow-2xl bg-[#050b14]">
      <Canvas
        camera={{ position: getCameraPos(), fov: 48 }}
        shadows
        gl={{ antialias: true, alpha: false }}
        style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
      >
        <SceneEnvironment />

        {renderBridge3DModel()}

        {showNodePins &&
          activeBridge.nodes.map((node) => {
            const sample = latestReadings.find((r) => r.nodeCode === node.code);
            const status = sample ? sample.status : 'SAFE';
            return (
              <NodePinMarker
                key={node.id}
                node={node}
                status={status}
                onClick={() => setSelectedNode(node)}
              />
            );
          })}

        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          maxPolarAngle={Math.PI / 2 + 0.15}
          minDistance={3}
          maxDistance={28}
        />
      </Canvas>
    </div>
  );
};
