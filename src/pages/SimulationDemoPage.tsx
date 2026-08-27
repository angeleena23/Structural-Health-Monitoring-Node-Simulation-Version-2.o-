import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { BridgeCanvas } from '../components/3d/BridgeCanvas';
import { LoadDragPanel } from '../components/simulation/LoadDragPanel';
import { LiveChart } from '../components/simulation/LiveChart';
import { LiveLogsTable } from '../components/simulation/LiveLogsTable';
import { ScenarioToggle } from '../components/simulation/ScenarioToggle';
import { NodeDetailModal } from '../components/ui/NodeDetailModal';
import { LoadType } from '../data/failureLogics';
import { RotateCcw, ArrowLeft, X, Eye, Info } from 'lucide-react';

export const SimulationDemoPage: React.FC = () => {
  const { activeBridge, setActiveScreen, applyLoad, resetSimulation } = useSimulation();
  const [cameraPreset, setCameraPreset] = useState<'isometric' | 'top' | 'side' | 'bottom'>('isometric');

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const loadType = e.dataTransfer.getData('text/plain') as LoadType;
    if (loadType) {
      applyLoad(loadType);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col gap-5 pb-16 max-w-7xl mx-auto">
      {/* Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-cyan-400 block mb-1">
            SCREEN 5 OF 5 — LIVE SIMULATION WORKBENCH
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {activeBridge.name} Live Simulation
          </h1>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={resetSimulation}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" /> Reset State
          </button>

          <button
            onClick={() => setActiveScreen('bridge-select')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" /> Choose Bridge
          </button>

          <button
            onClick={() => setActiveScreen('home')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold border border-rose-500/30 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" /> Exit
          </button>
        </div>
      </div>

      {/* Scenario Mode & Status Banner Toolbar */}
      <ScenarioToggle />

      {/* 3-Panel Main Workbench Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch min-h-[580px]">
        {/* Left Panel: Drag & Drop Structural Loads */}
        <div className="lg:col-span-3 flex flex-col">
          <LoadDragPanel />
        </div>

        {/* Center Panel: 3D Bridge Digital Twin Canvas (Drag & Drop Target) */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="lg:col-span-5 flex flex-col gap-2 glass-panel p-3 rounded-2xl border border-cyan-500/40 bg-slate-950/60 shadow-2xl relative min-h-[460px]"
        >
          {/* Top Camera Angle Selector Toolbar overlay */}
          <div className="flex items-center justify-between z-10 px-3 py-1.5 bg-slate-900/80 rounded-xl border border-white/10 text-xs backdrop-blur-md">
            <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1 font-bold">
              <Eye className="w-3.5 h-3.5 text-cyan-400" /> 3D View:
            </span>

            <div className="flex gap-1 font-mono text-[10px]">
              {(['isometric', 'top', 'side', 'bottom'] as const).map((preset) => (
                <button
                  key={preset}
                  onClick={() => setCameraPreset(preset)}
                  className={`px-2.5 py-1 rounded-md capitalize font-bold transition-all cursor-pointer ${
                    cameraPreset === preset
                      ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Prominent 3D Bridge Canvas Container */}
          <div className="flex-1 w-full min-h-[380px] relative rounded-xl overflow-hidden border border-white/10">
            <BridgeCanvas cameraPreset={cameraPreset} showNodePins={true} />
          </div>

          {/* Bottom Drop Zone Instruction Overlay */}
          <div className="text-[11px] font-mono text-cyan-300 flex items-center justify-center gap-1.5 py-1 px-2 bg-cyan-950/40 rounded-lg border border-cyan-500/20">
            <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Drop load icon or click load cards to observe live bridge physics deformation.</span>
          </div>
        </div>

        {/* Right Panel: Real-Time Charts & Diagnostic Log Table */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Recharts Live Sensor Plots */}
          <LiveChart />

          {/* Time-Stamped Live Logs Table */}
          <div className="flex-1 min-h-[260px]">
            <LiveLogsTable />
          </div>
        </div>
      </div>

      <NodeDetailModal />
    </div>
  );
};
