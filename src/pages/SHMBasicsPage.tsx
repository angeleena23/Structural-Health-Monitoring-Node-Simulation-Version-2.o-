import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { ShieldCheck, Activity, AlertTriangle, Cpu, ArrowRight, DollarSign, Clock, Layers } from 'lucide-react';

export const SHMBasicsPage: React.FC = () => {
  const { setActiveScreen } = useSimulation();

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
          <Activity className="w-3.5 h-3.5" />
          <span>SHM Fundamentals & Risk Mitigation</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100">Structural Health Monitoring Basics</h1>
        <p className="text-sm text-slate-400 max-w-3xl">
          Learn why continuous, low-cost sensor telemetry is essential for preserving critical transportation infrastructure and preventing catastrophic failures.
        </p>
      </div>

      {/* Grid of Key Concepts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-100">Continuous Telemetry vs Periodic Inspection</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Visual inspections occur only 1-2 times per year and cannot detect internal micro-cracks or dynamic fatigue under heavy overload. SHM provides 24/7 continuous data feeds.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-100">Early Warning Detection</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Elevated strain ($\mu\epsilon$) and vibration shifts alert operators days or weeks before structural deflection reaches material yield limits.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-100">Cost Savings & Life Extension</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Targeted maintenance based on real sensor metrics eliminates emergency bridge closures and extends bridge operational lifespan by 25-40%.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="glass-panel p-8 rounded-2xl border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold text-slate-100">Test the 3D Digital Twin Simulation</h3>
          <p className="text-xs text-slate-400 mt-1">
            Pick a bridge, apply simulated vehicle and wind loads, and observe live sensor readings respond in real-time.
          </p>
        </div>
        <button
          onClick={() => setActiveScreen('bridge-select')}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs shadow-lg transition-all cursor-pointer whitespace-nowrap"
        >
          <span>Select Bridge Type</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
