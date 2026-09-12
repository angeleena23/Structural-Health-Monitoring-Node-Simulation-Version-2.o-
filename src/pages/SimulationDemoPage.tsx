import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { BridgeCanvas } from '../components/3d/BridgeCanvas';
import { LoadDragPanel } from '../components/simulation/LoadDragPanel';
import { LiveChart } from '../components/simulation/LiveChart';
import { LiveLogsTable } from '../components/simulation/LiveLogsTable';
import { NodeDetailModal } from '../components/ui/NodeDetailModal';
import { LoadType } from '../data/failureLogics';
import { ShieldCheck, ShieldAlert, AlertTriangle, Eye, Volume2, Bell } from 'lucide-react';

export const SimulationDemoPage: React.FC = () => {
  const {
    activeBridge,
    applyLoad,
    latestReadings,
    overallStatus,
    testYellowSound,
    testRedSound
  } = useSimulation();

  const [cameraPreset, setCameraPreset] = useState<'isometric' | 'top' | 'side'>('isometric');

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

  // Node A & Node B readings for top banner badges
  const sampleA = latestReadings[0];
  const sampleB = latestReadings[1];
  const valA = sampleA ? sampleA.filteredVibrationRms.toFixed(2) : '17.62';
  const valB = sampleB ? sampleB.filteredVibrationRms.toFixed(2) : '19.54';

  const getStatusBannerText = () => {
    switch (overallStatus) {
      case 'DANGER':
        return (
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs led-red">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
            <ShieldAlert className="w-4 h-4" />
            <span>CRITICAL ALERT: STRUCTURAL DANGER EXCEEDED</span>
          </div>
        );
      case 'CAUTION':
        return (
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs led-amber">
            <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
            <AlertTriangle className="w-4 h-4" />
            <span>CAUTION: STRUCTURAL THRESHOLD ELEVATED</span>
          </div>
        );
      case 'SAFE':
      default:
        return (
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs led-emerald">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <ShieldCheck className="w-4 h-4" />
            <span>SYSTEM NOMINAL: STRUCTURAL BOUNDS SAFE</span>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-16 max-w-7xl mx-auto">
      {/* Top Full-Width Status Banner matching Reference Screenshots */}
      <div className="glass-panel p-3 rounded-2xl border border-white/10 bg-slate-950/80 shadow-xl flex flex-wrap items-center justify-between gap-4 font-mono">
        <div className="flex items-center gap-3">
          {getStatusBannerText()}
        </div>

        <div className="flex items-center gap-3">
          {/* Test Sound triggers */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-xl border border-white/10 text-[10px]">
            <button
              onClick={testYellowSound}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-colors cursor-pointer"
            >
              <Volume2 className="w-3 h-3" /> Test Yellow Sound
            </button>
            <button
              onClick={testRedSound}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition-colors cursor-pointer"
            >
              <Bell className="w-3 h-3" /> Test Red Sound
            </button>
          </div>

          {/* Node A & Node B Reading Badges */}
          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-slate-900 text-cyan-300 border border-cyan-500/30 font-bold">
              Node A: <strong className="text-white">{valA} units</strong>
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-900 text-cyan-300 border border-cyan-500/30 font-bold">
              Node B: <strong className="text-white">{valB} units</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 3-Column Main Workbench Layout (Fixed height grid to prevent canvas resize on log addition) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Apply Structural Loads (Fixed height container) */}
        <div className="lg:col-span-3 flex flex-col h-[540px]">
          <LoadDragPanel />
        </div>

        {/* Center Column: 3D Interactive Bridge Model (Fixed height container: lg:h-[540px]) */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="lg:col-span-5 flex flex-col glass-panel p-3 rounded-2xl border border-cyan-500/40 bg-slate-950/60 shadow-2xl relative h-[540px]"
        >
          {/* Top Preset View Buttons: [Iso] [Top] [Side] */}
          <div className="absolute top-5 left-5 z-10 flex items-center gap-1 bg-slate-950/90 px-2 py-1 rounded-xl border border-white/10 text-xs backdrop-blur-md font-mono">
            <Eye className="w-3.5 h-3.5 text-cyan-400 mr-1" />
            {(['isometric', 'top', 'side'] as const).map((preset) => (
              <button
                key={preset}
                onClick={() => setCameraPreset(preset)}
                className={`px-2.5 py-1 rounded-lg capitalize font-bold transition-all cursor-pointer text-[10px] ${
                  cameraPreset === preset
                    ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {preset === 'isometric' ? 'Iso' : preset}
              </button>
            ))}
          </div>

          {/* 3D Canvas Container filling fixed height */}
          <div className="w-full h-full relative rounded-xl overflow-hidden border border-white/10">
            <BridgeCanvas cameraPreset={cameraPreset} showNodePins={true} />

            {/* Bottom Canvas Overlays matching reference screenshot */}
            <div className="absolute bottom-3 left-3 right-3 z-10 flex items-end justify-between pointer-events-none font-mono">
              <span className="text-[11px] text-slate-400/90 bg-slate-950/70 px-2.5 py-1 rounded-lg border border-white/10 backdrop-blur-md">
                Visual feedback: Bridge deforms & vibrates dynamically under strain.
              </span>

              <div className="text-right leading-tight bg-slate-950/70 px-3 py-1 rounded-lg border border-white/10 backdrop-blur-md">
                <span className="block text-cyan-400 font-bold text-xs uppercase tracking-wider">
                  {activeBridge.name.split(' ')[0]}
                </span>
                <span className="block text-blue-500 font-bold text-xs uppercase tracking-wider">
                  {activeBridge.name.split(' ').slice(1).join(' ') || 'Bridge'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Telemetry Charts & Telemetry Logs */}
        <div className="lg:col-span-4 flex flex-col gap-4 h-[540px]">
          <div className="h-[240px]">
            <LiveChart />
          </div>
          <div className="flex-1 h-[280px]">
            <LiveLogsTable />
          </div>
        </div>
      </div>

      <NodeDetailModal />
    </div>
  );
};
