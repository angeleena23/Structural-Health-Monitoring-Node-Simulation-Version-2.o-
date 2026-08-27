import React from 'react';
import { BRIDGES } from '../data/bridgeData';
import { NODE_TEMPLATES } from '../data/nodeTemplates';
import { MCU_CATALOG, SUMMARY_CALLOUT } from '../data/mcuCatalog';
import { Printer, FileText, CheckCircle } from 'lucide-react';

export const ReportPage: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-8 pb-16 max-w-5xl mx-auto">
      {/* Printable Action Toolbar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 print:hidden">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
            <FileText className="w-3.5 h-3.5" />
            <span>Formal Design Report</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 mt-1">
            Structural Health Monitoring Engineering Document
          </h1>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" /> Print / Export PDF
        </button>
      </div>

      {/* Report Document Content */}
      <div className="glass-panel p-8 sm:p-12 rounded-2xl border border-white/10 space-y-8 text-slate-200 print:bg-white print:text-black print:p-0">
        {/* Title Header */}
        <div className="border-b border-white/10 pb-6 space-y-2">
          <h1 className="text-3xl font-black text-slate-100 print:text-black">
            Structural Health Monitoring Node – Simulation [Version 2.o]
          </h1>
          <p className="text-sm text-cyan-400 print:text-blue-700 font-bold font-mono">
            Digital Twin Architectural Rationale & Sensor Node Topology Specifications
          </p>
          <div className="text-xs text-slate-400 print:text-gray-600 font-mono pt-2">
            Author: Embedded Structural Health Monitoring Team | Revision: 2.0 | Platform: STM32 Microcontrollers
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-cyan-300 print:text-blue-800 border-b border-white/10 pb-1">
            1. Executive Summary & Problem Statement
          </h2>
          <p className="text-xs text-slate-300 print:text-gray-800 leading-relaxed">
            Bridges are critical civil infrastructure typically subjected to manual inspection only once or twice per year. Micro-cracks, unexpected support settlement, and cumulative strain fatigue often remain undetected until sudden catastrophic failure occurs. This project presents a client-side digital twin simulation for low-cost STM32 microcontroller sensor node networks, establishing continuous 24/7 structural health monitoring across six distinct bridge types.
          </p>
        </section>

        {/* Section 2: MCU Selection Matrix */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-cyan-300 print:text-blue-800 border-b border-white/10 pb-1">
            2. Microcontroller (MCU) Hardware Decision Matrix
          </h2>
          <div className="bg-cyan-950/30 print:bg-gray-100 p-4 rounded-xl border border-cyan-500/20 text-xs font-semibold text-cyan-200 print:text-gray-900">
            "{SUMMARY_CALLOUT}"
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs print:text-gray-900">
              <thead>
                <tr className="border-b border-white/10 print:border-gray-300 font-mono text-[10px] text-slate-400 print:text-gray-700">
                  <th className="p-2">MCU Part</th>
                  <th className="p-2">Core</th>
                  <th className="p-2">Clock</th>
                  <th className="p-2">Target Node Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 print:divide-gray-200 font-mono">
                {MCU_CATALOG.map((mcu) => (
                  <tr key={mcu.id}>
                    <td className="p-2 font-bold text-cyan-400 print:text-blue-900">{mcu.family}</td>
                    <td className="p-2">{mcu.core}</td>
                    <td className="p-2">{mcu.maxClock}</td>
                    <td className="p-2">{mcu.recommendedNodes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: Standard Node Templates */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-cyan-300 print:text-blue-800 border-b border-white/10 pb-1">
            3. Standardized Node Templates (V / S / L Nodes)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {Object.values(NODE_TEMPLATES).map((tmpl) => (
              <div key={tmpl.id} className="glass-card p-4 rounded-xl border border-white/10 print:border-gray-300 print:bg-white">
                <h3 className="font-bold text-slate-100 print:text-black">{tmpl.id} — {tmpl.name}</h3>
                <p className="text-[11px] text-slate-400 print:text-gray-600 mt-1 font-mono">MCU: {tmpl.mcu.model}</p>
                <ul className="list-disc list-inside text-[11px] text-slate-300 print:text-gray-800 mt-2 space-y-1">
                  {tmpl.keyFunctions.slice(0, 3).map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Per-Bridge Sensor Node Maps */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-cyan-300 print:text-blue-800 border-b border-white/10 pb-1">
            4. Per-Bridge Sensor Deployment Maps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {Object.values(BRIDGES).map((bridge) => (
              <div key={bridge.id} className="glass-card p-4 rounded-xl border border-white/10 print:border-gray-300 print:bg-white space-y-2">
                <h3 className="font-bold text-slate-100 print:text-black">{bridge.name} ({bridge.spanRange})</h3>
                <div className="space-y-1 font-mono text-[11px]">
                  {bridge.nodes.map((node) => (
                    <div key={node.id} className="flex items-center justify-between text-slate-300 print:text-gray-800">
                      <span className="font-bold text-cyan-400 print:text-blue-700">{node.code} ({node.nodeTypeId})</span>
                      <span>{node.mcuModel}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Conclusion */}
        <section className="space-y-2 border-t border-white/10 pt-4">
          <h2 className="text-lg font-bold text-slate-100 print:text-black">5. Engineering Verification Conclusion</h2>
          <p className="text-xs text-slate-300 print:text-gray-800 leading-relaxed">
            The simulated STM32 SHM digital twin demonstrates that deploying heterogeneous sensor nodes (V-Node, S-Node, L-Node) with localized moving-average filtering provides immediate early detection of structural anomalies long before catastrophic collapse occurs.
          </p>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 print:text-green-700 font-bold pt-2">
            <CheckCircle className="w-4 h-4" /> Design Document Validated & Runnable
          </div>
        </section>
      </div>
    </div>
  );
};
