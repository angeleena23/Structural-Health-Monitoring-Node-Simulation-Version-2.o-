import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { LoadType } from '../../data/failureLogics';
import { Car, Truck, Wind, Activity, Flame, Anchor, Play, Sliders } from 'lucide-react';

interface LoadItem {
  id: LoadType;
  label: string;
  category: string;
  icon: React.FC<{ className?: string }>;
  color: string;
  description: string;
}

const LOAD_ITEMS: LoadItem[] = [
  { id: 'car', label: 'Passenger Vehicles', category: 'Normal traffic flow (cars & SUVs). Moderate...', icon: Car, color: 'from-blue-500 to-cyan-500', description: 'Standard light vehicle traffic transient' },
  { id: 'truck', label: 'Heavy Freight Truck', category: 'Heavy 40-tonne semi-trailer passage. High...', icon: Truck, color: 'from-indigo-500 to-blue-600', description: 'Heavy axle freight passage' },
  { id: 'wind', label: 'Gale Crosswind', category: '80 km/h sustained crosswind gusts. Triggers...', icon: Wind, color: 'from-sky-400 to-teal-500', description: 'Sustained aerodynamic crosswind' },
  { id: 'earthquake', label: 'Seismic Shock', category: 'Magnitude 5.8 earthquake tremor. Severe multi...', icon: Activity, color: 'from-amber-500 to-orange-600', description: 'Seismic ground tremor acceleration' },
  { id: 'fire', label: 'Thermal Fire Event', category: 'Tanker vehicle fire on deck. Rapid localized...', icon: Flame, color: 'from-rose-500 to-red-600', description: 'Thermal expansion & high temp pulse' },
  { id: 'collision', label: 'Ship Pier Collision', category: 'Barge collision with pier foundation. High...', icon: Anchor, color: 'from-purple-600 to-rose-600', description: 'Substructure pier vessel impact' }
];

export const LoadDragPanel: React.FC = () => {
  const { applyLoad, loadSeverity, setLoadSeverity } = useSimulation();

  const handleDragStart = (e: React.DragEvent, loadType: LoadType) => {
    e.dataTransfer.setData('text/plain', loadType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="glass-panel p-4 rounded-2xl flex flex-col gap-3 h-full bg-slate-900/90 border border-white/10 shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <h3 className="text-xs font-bold tracking-wider uppercase flex items-center gap-2 text-cyan-400 font-mono">
          <Sliders className="w-4 h-4" /> Apply Structural Loads
        </h3>
        <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded font-mono">Drag or Click</span>
      </div>

      <p className="text-[11px] text-slate-400 leading-tight">
        Drag a load icon onto the 3D bridge canvas or click a button to simulate physical dynamic impacts.
      </p>

      {/* Load Severity Slider matching screenshot */}
      <div className="space-y-1 bg-slate-950 p-2.5 rounded-xl border border-white/10 text-xs">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-300">Load Severity:</span>
          <span className="font-bold text-amber-400">{loadSeverity} / 10</span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={loadSeverity}
          onChange={(e) => setLoadSeverity(parseInt(e.target.value))}
          className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
        />
      </div>

      {/* 6 Load Cards matching screenshot */}
      <div className="flex flex-col gap-2 overflow-y-auto pr-1 flex-1 max-h-[380px]">
        {LOAD_ITEMS.map((item) => {
          const IconComp = item.icon;
          return (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, item.id)}
              onClick={() => applyLoad(item.id)}
              className="group cursor-grab active:cursor-grabbing p-2.5 rounded-xl bg-slate-950/80 border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-950/20 transition-all flex items-center justify-between shadow-md"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-white shrink-0 shadow-md group-hover:scale-105 transition-transform`}>
                  <IconComp className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 truncate">
                    {item.label}
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate">{item.category}</p>
                </div>
              </div>

              <button
                type="button"
                className="p-1 rounded text-slate-400 group-hover:text-cyan-300 transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>
          );
        })}
      </div>

      {/* STM32 Telemetry Specs Footer Box matching screenshot */}
      <div className="pt-2 border-t border-white/10 text-[10px] font-mono text-slate-400 space-y-0.5 bg-slate-950 p-2 rounded-xl border border-white/5">
        <strong className="text-slate-300 block">STM32 Telemetry Specs:</strong>
        <div>• Sampling: 1.0 Hz loop tick</div>
        <div>• DSP Filter: 5-sample Moving Avg</div>
        <div>• Baseline Safe: 0-22 units</div>
      </div>
    </div>
  );
};
