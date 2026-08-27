import React from 'react';
import { MCU_CATALOG, SUMMARY_CALLOUT } from '../data/mcuCatalog';
import { Cpu, CheckCircle2, XCircle, Info, Zap } from 'lucide-react';

export const MCUGuidePage: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
          <Cpu className="w-3.5 h-3.5" />
          <span>Section 3 — Microcontroller Hardware Decision Matrix</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100">STM32 MCU Selection Guide</h1>
        <p className="text-sm text-slate-400 max-w-3xl">
          Engineering rationale detailing why specific ARM Cortex-M microcontrollers were selected for vibration DSP, 24-bit strain acquisition, and ultra-low-power pier monitoring.
        </p>
      </div>

      {/* Summary Callout Banner (Prompt Section 3 Requirement) */}
      <div className="glass-panel p-5 rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/40 via-sky-950/30 to-indigo-950/40 flex items-start gap-4 shadow-xl">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0">
          <Info className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">
            Engineering Recommendation Summary
          </h3>
          <p className="text-sm font-semibold text-slate-100 mt-1 leading-relaxed">
            "{SUMMARY_CALLOUT}"
          </p>
        </div>
      </div>

      {/* MCU Comparison Table */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Zap className="w-5 h-5 text-cyan-400" /> STM32 Product Family Comparison
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-mono uppercase text-[10px] bg-slate-900/60">
                <th className="p-3">MCU Model</th>
                <th className="p-3">Core & FPU</th>
                <th className="p-3">Max Clock</th>
                <th className="p-3">Flash / RAM</th>
                <th className="p-3">Power Mode</th>
                <th className="p-3">Recommended Node</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {MCU_CATALOG.map((mcu) => (
                <tr key={mcu.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3 font-bold text-cyan-300">{mcu.family}</td>
                  <td className="p-3 text-slate-300">{mcu.core}</td>
                  <td className="p-3 text-slate-200">{mcu.maxClock}</td>
                  <td className="p-3 text-slate-300">{mcu.flash} / {mcu.sram}</td>
                  <td className="p-3 text-slate-400">{mcu.powerConsumption}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {mcu.recommendedNodes}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Individual MCU Family Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MCU_CATALOG.map((mcu) => (
          <div key={mcu.id} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-100">{mcu.family}</h3>
                <span className="text-xs font-mono text-cyan-400">{mcu.core}</span>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-slate-800 text-slate-200 border border-white/10">
                {mcu.maxClock}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-cyan-400">Rationale:</strong> {mcu.rationale}
            </p>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-emerald-400 flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Advantages
                </span>
                <ul className="list-disc list-inside text-slate-400 space-y-1 text-[11px]">
                  {mcu.pros.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-rose-400 flex items-center gap-1 text-[11px]">
                  <XCircle className="w-3.5 h-3.5" /> Constraints
                </span>
                <ul className="list-disc list-inside text-slate-400 space-y-1 text-[11px]">
                  {mcu.cons.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 text-xs">
              <span className="text-slate-400 font-bold block mb-1">Target Locations:</span>
              <div className="flex flex-wrap gap-1.5">
                {mcu.targetLocations.map((loc, i) => (
                  <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-white/5 font-mono">
                    {loc}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
