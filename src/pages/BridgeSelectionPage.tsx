import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { BRIDGES } from '../data/bridgeData';
import { BridgeCanvas } from '../components/3d/BridgeCanvas';
import { Activity, ChevronRight } from 'lucide-react';

const BASE_UNITS: Record<string, number> = {
  beam: 20,
  arch: 22,
  truss: 25,
  cantilever: 28,
  suspension: 30,
  'cable-stayed': 26
};

const BRIDGE_SUBTITLES: Record<string, string> = {
  beam: 'Classic Girder & Pier Support Architecture',
  arch: 'Compressive Curve Structural Rib Architecture',
  truss: 'Triangular Strut Lattice Load Distribution',
  cantilever: 'Balanced Arm Counterweight Structure',
  suspension: 'Main Cable Catenary & Deck Hanger System',
  'cable-stayed': 'Direct Diagonal Stay Cable Support Fan'
};

const SHORT_DESCS: Record<string, string> = {
  beam: 'Highway overpasses, short river crossings, urban railway spans (10m - 80m).',
  arch: 'Valleys, deep gorges, historical urban waterways (50m - 400m).',
  truss: 'Heavy rail freight lines, wide river crossings, mountain gorges (40m - 250m).',
  cantilever: 'Balanced cantilever spans, deep river channels (150m - 550m).',
  suspension: 'Long oceanic straits, deep sea bays, long-span corridors (500m - 2000m+).',
  'cable-stayed': 'Harbor entrances, wide urban rivers, high-speed rail bridges (200m - 1100m).'
};

export const BridgeSelectionPage: React.FC = () => {
  const { setActiveBridgeId, setActiveScreen } = useSimulation();

  const handleSelectBridge = (bridgeId: string) => {
    setActiveBridgeId(bridgeId);
    setActiveScreen('bridge-info'); // Advance to Screen 3 (Info)
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 pb-16 pt-4 text-center max-w-7xl mx-auto">
      {/* Page Title & Subtitle */}
      <div className="space-y-3 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Select Bridge Archetype
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Choose a structural model to explore sensor node placement, physical metadata, and run real-time stress simulations.
        </p>
      </div>

      {/* Grid of 6 Bridge Cards matching Image 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full text-left">
        {Object.values(BRIDGES).map((bridge) => {
          const baseUnits = BASE_UNITS[bridge.id] || 20;
          const subTitle = BRIDGE_SUBTITLES[bridge.id] || bridge.tagline;
          const shortDesc = SHORT_DESCS[bridge.id] || bridge.description;

          return (
            <div
              key={bridge.id}
              onClick={() => handleSelectBridge(bridge.id)}
              className="group glass-card rounded-2xl border border-white/10 hover:border-cyan-500/50 overflow-hidden shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between bg-slate-900/80"
            >
              {/* 3D Mini Canvas Preview */}
              <div className="h-52 w-full relative bg-[#050b14] overflow-hidden">
                <BridgeCanvas cameraPreset="isometric" showNodePins={false} />

                {/* Base Units Top-Right Badge matching Image 3 */}
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full backdrop-blur-md bg-slate-950/80 border border-cyan-500/40 text-[11px] font-mono font-bold text-cyan-300 flex items-center gap-1.5 shadow-lg">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Base: {baseUnits} units</span>
                </div>
              </div>

              {/* Card Metadata Section */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-extrabold text-white group-hover:text-cyan-400 transition-colors">
                    {bridge.name}
                  </h3>
                  <p className="text-xs font-bold text-cyan-400 mt-0.5">
                    {subTitle}
                  </p>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-2">
                    {shortDesc}
                  </p>
                </div>

                {/* Card Footer matching Image 3 */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">
                    Lifespan: <strong className="text-slate-200">{bridge.typicalLifespan}</strong>
                  </span>

                  <span className="text-cyan-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                    Explore <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
