import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { LoadType } from '../../data/failureLogics';
import { Car, Truck, Wind, Activity, Flame, Anchor } from 'lucide-react';

interface LoadItem {
  id: LoadType;
  label: string;
  category: string;
  icon: React.FC<{ className?: string }>;
  color: string;
  description: string;
}

const LOAD_ITEMS: LoadItem[] = [
  { id: 'car', label: 'Passenger Car', category: 'Light Traffic', icon: Car, color: 'from-blue-500 to-cyan-500', description: 'Standard vehicle live load transient (1.5 Tons)' },
  { id: 'truck', label: 'Freight Truck', category: 'Heavy Axle', icon: Truck, color: 'from-indigo-500 to-blue-600', description: 'Heavy multi-axle freight load (40 Tons)' },
  { id: 'wind', label: 'Wind Gale', category: 'Aerodynamic', icon: Wind, color: 'from-sky-400 to-teal-500', description: 'Lateral aerodynamic gusts (80 km/h)' },
  { id: 'earthquake', label: 'Seismic Wave', category: 'Ground Motion', icon: Activity, color: 'from-amber-500 to-orange-600', description: 'Sub-structure seismic acceleration wave' },
  { id: 'fire', label: 'Deck Fire', category: 'Thermal Stress', icon: Flame, color: 'from-rose-500 to-red-600', description: 'Thermal expansion & high temperature pulse' },
  { id: 'collision', label: 'Ship Collision', category: 'Impact Shock', icon: Anchor, color: 'from-purple-600 to-rose-600', description: 'Substructure pier vessel impact deceleration' }
];

export const LoadDragPanel: React.FC = () => {
  const { applyLoad } = useSimulation();

  const handleDragStart = (e: React.DragEvent, loadType: LoadType) => {
    e.dataTransfer.setData('text/plain', loadType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="glass-panel p-4 rounded-xl flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <h3 className="text-sm font-bold tracking-wider uppercase flex items-center gap-2 text-cyan-400">
          <Activity className="w-4 h-4" /> Apply Structural Loads
        </h3>
        <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">Drag or Click</span>
      </div>

      <p className="text-xs text-slate-400">
        Drag a load icon onto the 3D bridge canvas or click any card to simulate dynamic environmental stress.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 overflow-y-auto pr-1">
        {LOAD_ITEMS.map((item) => {
          const IconComp = item.icon;
          return (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, item.id)}
              onClick={() => applyLoad(item.id)}
              className="group cursor-grab active:cursor-grabbing glass-card p-3 rounded-lg border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-950/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-between shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  <IconComp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-cyan-300">{item.label}</h4>
                  <p className="text-[10px] text-slate-400">{item.category}</p>
                </div>
              </div>
              <button
                type="button"
                className="opacity-0 group-hover:opacity-100 text-[10px] px-2 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded font-semibold transition-opacity"
              >
                Apply
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
