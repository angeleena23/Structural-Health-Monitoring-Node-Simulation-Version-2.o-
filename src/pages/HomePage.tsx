import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Cpu, Activity, Radio, ShieldCheck, Layers, ArrowRight } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { setActiveScreen } = useSimulation();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-12 px-4 text-center max-w-6xl mx-auto space-y-10">
      {/* Top Conceptual Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/40 text-cyan-400 text-xs font-mono font-bold tracking-wider shadow-lg">
        <Cpu className="w-4 h-4 text-cyan-400" />
        <span>STM32-BASED CONCEPTUAL IOT SENSOR NETWORK</span>
      </div>

      {/* Main Title & Headline */}
      <div className="space-y-4 max-w-4xl">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
          Structural Health Monitoring <br />
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            Simulation Node
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
          Continuous real-time telemetry simulating STM32 sensor nodes (MPU6050, BME280, Strain Gauge). Detect early flexural fatigue, seismic vibration, and load anomalies before failure occurs.
        </p>
      </div>

      {/* 4 Feature Cards Grid matching Image 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full pt-4">
        {/* Card 1 */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 text-left space-y-3 hover:border-cyan-500/40 transition-all shadow-xl bg-slate-900/60">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-100">6 Bridge Archetypes</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            3D representations for Beam, Arch, Truss, Cantilever, Suspension, and Cable-Stayed bridges.
          </p>
        </div>

        {/* Card 2 */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 text-left space-y-3 hover:border-cyan-500/40 transition-all shadow-xl bg-slate-900/60">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Radio className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-100">Dual-Node Monitoring</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Independent Node A (mid-span) and Node B (support) sensor streams with moving-average filtering.
          </p>
        </div>

        {/* Card 3 */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 text-left space-y-3 hover:border-cyan-500/40 transition-all shadow-xl bg-slate-900/60">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-100">Interactive Loads</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Apply vehicles, wind, seismic tremors, thermal fires, and ship collisions to observe live decay curves.
          </p>
        </div>

        {/* Card 4 */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 text-left space-y-3 hover:border-cyan-500/40 transition-all shadow-xl bg-slate-900/60">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-100">Web Audio Alerts</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Synthesized 1s yellow caution beeps & 5s red danger buzzers with real-time log diagnosis.
          </p>
        </div>
      </div>

      {/* Action CTA Buttons matching Image 1 */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <button
          onClick={() => setActiveScreen('bridge-select')}
          className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
        >
          <span>Start Interactive Simulation</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => setActiveScreen('system-arch')}
          className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-sm border border-white/10 transition-all cursor-pointer shadow-lg"
        >
          <span>View System Architecture</span>
        </button>
      </div>
    </div>
  );
};
