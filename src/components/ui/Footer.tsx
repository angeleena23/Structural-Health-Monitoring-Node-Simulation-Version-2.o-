import React from 'react';
import { Activity, Cpu, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-slate-950/60 py-8 px-4 lg:px-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-slate-200">Structural Health Monitoring Node Simulation [Version 2.o]</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 font-mono text-[11px]">
          <span className="flex items-center gap-1 text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" /> STM32 Cortex-M Series
          </span>
          <span className="flex items-center gap-1 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Web Audio API Alert Engine
          </span>
          <span>Three.js + R3F Digital Twin</span>
        </div>

        <div className="text-[11px] text-slate-500">
          Client-Side Interactive Simulation • No External Backend Required
        </div>
      </div>
    </footer>
  );
};
