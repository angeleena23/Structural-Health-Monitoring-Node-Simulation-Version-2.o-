import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { BridgeCanvas } from '../components/3d/BridgeCanvas';
import { ArrowRight, ArrowLeft, Clock, Hammer, ShieldAlert, Eye, MousePointer } from 'lucide-react';

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

export const BridgeInfoFrame: React.FC = () => {
  const { activeBridge, setActiveScreen } = useSimulation();
  const [cameraPreset, setCameraPreset] = useState<'isometric' | 'top' | 'side' | 'bottom'>('isometric');

  const subTitle = BRIDGE_SUBTITLES[activeBridge.id] || activeBridge.tagline;
  const shortDesc = SHORT_DESCS[activeBridge.id] || activeBridge.description;

  return (
    <div className="flex flex-col gap-6 pb-16 max-w-7xl mx-auto">
      {/* Header Bar matching Image 2 */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-cyan-400 block mb-1">
            SCREEN 3 OF 5 — STRUCTURAL OVERVIEW
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            {activeBridge.name} Architecture
          </h1>
        </div>

        {/* Top-Right Next Pill Button */}
        <button
          onClick={() => setActiveScreen('sensor-placement')}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-xl shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
        >
          <span>Next: Sensor Placement</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main 2-Column Layout matching Image 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch min-h-[520px]">
        {/* Left Column: 3D Interactive Canvas & Views Bar */}
        <div className="lg:col-span-7 flex flex-col gap-3 glass-panel p-4 rounded-2xl border border-white/10 bg-slate-950/60 shadow-2xl relative">
          {/* Views Selector Bar overlay */}
          <div className="flex items-center justify-between z-10 px-2 py-1 bg-slate-900/80 rounded-xl border border-white/10 text-xs backdrop-blur-md">
            <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1.5 font-bold">
              <Eye className="w-3.5 h-3.5 text-cyan-400" /> Views:
            </span>

            <div className="flex gap-1 font-mono text-[10px]">
              {(['isometric', 'top', 'side', 'bottom'] as const).map((preset) => (
                <button
                  key={preset}
                  onClick={() => setCameraPreset(preset)}
                  className={`px-3 py-1 rounded-lg capitalize font-bold transition-all cursor-pointer ${
                    cameraPreset === preset
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* 3D Canvas Box */}
          <div className="flex-1 w-full min-h-[360px] relative rounded-xl overflow-hidden border border-white/10">
            <BridgeCanvas cameraPreset={cameraPreset} showNodePins={false} />
          </div>

          {/* Bottom Mouse Instruction Caption matching Image 2 */}
          <div className="text-[11px] font-mono text-slate-400 flex items-center justify-center gap-2 pt-1">
            <MousePointer className="w-3.5 h-3.5 text-cyan-400" />
            <span>Use mouse to rotate, zoom, and pan around the 3D bridge structure.</span>
          </div>
        </div>

        {/* Right Column: Engineering Metadata Card matching Image 2 */}
        <div className="lg:col-span-5 glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 bg-slate-900/80 shadow-2xl flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div>
              <span className="text-xs font-bold font-mono text-cyan-400 block mb-1">
                {subTitle}
              </span>
              <h2 className="text-2xl font-extrabold text-white">
                {activeBridge.name} Overview
              </h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {shortDesc}
              </p>
            </div>

            {/* Metrics Pills Row matching Image 2 */}
            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="bg-slate-950/80 p-3 rounded-xl border border-white/10 space-y-1">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" /> Construction
                </span>
                <p className="font-bold text-white text-sm">{activeBridge.constructionDuration}</p>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-xl border border-white/10 space-y-1">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Hammer className="w-3 h-3 text-emerald-400" /> Lifespan
                </span>
                <p className="font-bold text-white text-sm">{activeBridge.typicalLifespan}</p>
              </div>
            </div>

            {/* Construction Materials Badges matching Image 2 */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                CONSTRUCTION MATERIALS
              </span>
              <div className="flex flex-wrap gap-2">
                {activeBridge.typicalMaterials.map((mat, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-lg text-xs font-mono font-semibold bg-cyan-950/40 text-cyan-300 border border-cyan-500/30"
                  >
                    {mat}
                  </span>
                ))}
              </div>
            </div>

            {/* Common Failure Modes Bullet List matching Image 2 */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" /> COMMON STRUCTURAL FAILURE MODES
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {activeBridge.commonFailureModes.map((mode, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{mode}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Action Buttons matching Image 2 */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/10">
            <button
              onClick={() => setActiveScreen('bridge-select')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-white/10 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400" />
              <span>Choose another bridge</span>
            </button>

            <button
              onClick={() => setActiveScreen('sensor-placement')}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-all cursor-pointer"
            >
              <span>Next Frame</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
