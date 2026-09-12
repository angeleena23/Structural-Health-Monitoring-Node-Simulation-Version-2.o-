import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useSimulation } from '../../context/SimulationContext';
import { useTheme } from '../../context/ThemeContext';
import { BRIDGES, BridgeNode } from '../../data/bridgeData';

import { BeamBridge3D } from './BeamBridge3D';
import { ArchBridge3D } from './ArchBridge3D';
import { TrussBridge3D } from './TrussBridge3D';
import { Cantilever3D } from './Cantilever3D';
import { Suspension3D } from './Suspension3D';
import { CableStayed3D } from './CableStayed3D';

// Camera Controller Helper Hook to handle camera preset updates
const CameraController: React.FC<{ cameraPreset: string }> = ({ cameraPreset }) => {
  const { camera } = useThree();

  useEffect(() => {
    let targetPos: [number, number, number] = [7, 4.5, 8.5];
    if (cameraPreset === 'top') {
      targetPos = [0, 14, 0.01];
    } else if (cameraPreset === 'side') {
      targetPos = [0, 1, 11];
    } else if (cameraPreset === 'bottom') {
      targetPos = [0, -7, 9];
    } else {
      targetPos = [7, 4.5, 8.5];
    }

    camera.position.set(...targetPos);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [cameraPreset, camera]);

  return null;
};

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

  return (
    <group position={node.position3D}>
      {/* Wireframe glowing sphere pin marker */}
      <mesh ref={meshRef} onClick={(e) => { e.stopPropagation(); onClick(); }}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial
          color={getLedColor()}
          emissive={getLedColor()}
          emissiveIntensity={status === 'DANGER' ? 1.5 : 0.8}
          wireframe
        />
      </mesh>

      {/* Styled 3D Pin Bubble Label matching reference */}
      <Html distanceFactor={11} zIndexRange={[100, 0]}>
        <div
          onClick={onClick}
          className="group flex flex-col items-center p-2 rounded-xl bg-slate-950/80 backdrop-blur-md border border-cyan-500/40 shadow-2xl text-[10px] font-mono cursor-pointer transition-all transform hover:scale-110 min-w-[100px] text-center"
        >
          <div className="flex items-center gap-1">
            <span className="font-bold text-cyan-300">{node.code}</span>
            <span className="text-slate-300">({node.roleTag || node.name.split('(')[0].trim()})</span>
          </div>
        </div>
      </Html>
    </group>
  );
};

// 3D Scene Environment & Cyan Blueprint Grid Floor
const SceneEnvironment: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <>
      <color attach="background" args={[isDark ? '#050b14' : '#f1f5f9']} />
      <ambientLight intensity={isDark ? 0.9 : 1.3} />
      <directionalLight position={[12, 18, 12]} intensity={isDark ? 1.3 : 1.6} castShadow />
      <pointLight position={[-10, 10, -10]} intensity={0.6} color="#38bdf8" />
      <pointLight position={[10, -5, 10]} intensity={0.4} color="#10b981" />

      {/* Cyan Blueprint Grid Floor */}
      <gridHelper
        args={[36, 36, '#0284c7', isDark ? '#072444' : '#cbd5e1']}
        position={[0, -2.5, 0]}
      />
    </>
  );
};

interface BridgeCanvasProps {
  bridgeId?: string;
  cameraPreset?: 'isometric' | 'orbit' | 'top' | 'side' | 'bottom';
  showNodePins?: boolean;
}

export const BridgeCanvas: React.FC<BridgeCanvasProps> = ({
  bridgeId,
  cameraPreset = 'isometric',
  showNodePins = true
}) => {
  const { activeBridge: contextBridge, latestReadings, setSelectedNode } = useSimulation();

  const targetBridgeId = bridgeId || contextBridge.id;
  const currentBridge = BRIDGES[targetBridgeId] || contextBridge;

  const renderBridge3DModel = () => {
    switch (targetBridgeId) {
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
    <div className="w-full h-full min-h-[280px] relative rounded-xl overflow-hidden shadow-2xl bg-[#050b14]">
      <Canvas
        camera={{ position: [7, 4.5, 8.5], fov: 48 }}
        shadows
        gl={{ antialias: true, alpha: false }}
        style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
      >
        <CameraController cameraPreset={cameraPreset} />
        <SceneEnvironment />

        {renderBridge3DModel()}

        {showNodePins &&
          currentBridge.nodes.map((node) => {
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
