import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { BridgeCanvas } from '../components/3d/BridgeCanvas';
import { NodeDetailModal } from '../components/ui/NodeDetailModal';
import { ArrowRight, MapPin, Cpu, Info } from 'lucide-react';

export const SensorPlacementFrame: React.FC = () => {
  const { activeBridge, setSelectedNode, setActiveScreen, nextFrameTimerTriggered } = useSimulation();

  return (
    <div className="flex flex-col gap-6 pb-16 max-w-7xl mx-auto">
      {/* Header Bar matching Reference Site Screen 4 */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-cyan-400 block mb-1">
            SCREEN 4 OF 5 — STM32 NODE PLACEMENT
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            {activeBridge.name} Node Placement
          </h1>
        </div>

        {/* Top-Right Next Pill Button */}
        <button
          onClick={() => setActiveScreen('simulation')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs shadow-xl transition-all cursor-pointer ${
            nextFrameTimerTriggered
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white animate-bounce'
              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/25'
          }`}
        >
          <span>Next: Live Simulation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch min-h-[500px]">
        {/* 3D Model with Interactive Node Pins */}
        <div className="lg:col-span-8 glass-panel p-3 rounded-2xl border border-cyan-500/30 shadow-2xl relative flex flex-col min-h-[420px]">
          <div className="flex-1 w-full relative rounded-xl overflow-hidden border border-white/10">
            <BridgeCanvas cameraPreset="isometric" showNodePins={true} />
          </div>
          <div className="mt-2 text-[11px] font-mono text-cyan-300 flex items-center justify-center gap-2 py-1 px-3 bg-cyan-950/40 rounded-lg border border-cyan-500/20">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Click any 3D node pin marker on the bridge to inspect MCU & sensor specs.</span>
          </div>
        </div>

        {/* Node List Cards Column */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" /> Deployed STM32 Nodes ({activeBridge.nodes.length})
          </h3>

          <div className="flex flex-col gap-2 flex-1 max-h-[440px] overflow-y-auto pr-1">
            {activeBridge.nodes.map((node) => (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className="group glass-card p-4 rounded-xl border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-950/20 transition-all cursor-pointer space-y-2 bg-slate-900/80"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono font-bold text-xs flex items-center justify-center border border-cyan-500/30">
                      {node.code}
                    </span>
                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-300">
                      {node.name}
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-cyan-300 border border-white/10">
                    {node.nodeTypeId}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center gap-2 font-mono">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" /> {node.mcuModel}
                </div>

                <p className="text-[11px] text-slate-300 line-clamp-2">
                  {node.purpose}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <NodeDetailModal />
    </div>
  );
};
