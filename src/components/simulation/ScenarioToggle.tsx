import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { ScenarioMode } from '../../data/failureLogics';
import { Volume2, VolumeX, RotateCcw, ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

export const ScenarioToggle: React.FC = () => {
  const {
    scenario,
    setScenario,
    overallStatus,
    isAudioMuted,
    toggleAudioMute,
    resetSimulation
  } = useSimulation();

  const scenarios: { id: ScenarioMode; label: string; desc: string }[] = [
    { id: 'normal', label: 'Normal Mode', desc: 'Standard operational baseline noise' },
    { id: 'overload', label: 'Overload Mode', desc: 'Sustained heavy traffic (+60% strain/vib)' },
    { id: 'damage', label: 'Damage Mode', desc: 'Structural crack shift (+120% & FFT frequency shift)' }
  ];

  const getStatusBanner = () => {
    switch (overallStatus) {
      case 'DANGER':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-400 font-bold text-xs led-red">
            <ShieldAlert className="w-4 h-4" />
            <span>RED ALERT: STRUCTURAL CRITICAL</span>
          </div>
        );
      case 'CAUTION':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold text-xs led-amber">
            <AlertTriangle className="w-4 h-4" />
            <span>YELLOW CAUTION: THRESHOLD ELEVATED</span>
          </div>
        );
      case 'SAFE':
      default:
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-xs led-emerald">
            <ShieldCheck className="w-4 h-4" />
            <span>GREEN SAFE: NOMINAL STABILITY</span>
          </div>
        );
    }
  };

  return (
    <div className="glass-panel p-3 rounded-xl flex flex-wrap items-center justify-between gap-3 w-full">
      {/* Status Banner */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
          System Status:
        </span>
        {getStatusBanner()}
      </div>

      {/* Scenario Mode Toggle */}
      <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-white/10 text-xs font-semibold">
        {scenarios.map((s) => (
          <button
            key={s.id}
            onClick={() => setScenario(s.id)}
            title={s.desc}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              scenario === s.id
                ? s.id === 'damage'
                  ? 'bg-rose-500 text-white shadow-lg font-bold'
                  : s.id === 'overload'
                  ? 'bg-amber-500 text-slate-950 shadow-lg font-bold'
                  : 'bg-cyan-500 text-white shadow-lg font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        {/* Audio Mute Button */}
        <button
          onClick={toggleAudioMute}
          title={isAudioMuted ? 'Unmute alert audio' : 'Mute alert audio'}
          className={`p-2 rounded-lg border transition-colors ${
            isAudioMuted
              ? 'bg-slate-800 text-slate-500 border-white/10'
              : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/30'
          }`}
        >
          {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Reset Simulation */}
        <button
          onClick={resetSimulation}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-white/10 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>
    </div>
  );
};
