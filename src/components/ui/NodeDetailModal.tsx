import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { NODE_TEMPLATES } from '../../data/nodeTemplates';
import { X, Cpu, Radio, Zap, Shield, MapPin, Activity } from 'lucide-react';

export const NodeDetailModal: React.FC = () => {
  const { selectedNode, setSelectedNode } = useSimulation();

  if (!selectedNode) return null;

  const template = NODE_TEMPLATES[selectedNode.nodeTypeId];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-cyan-500/30 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => setSelectedNode(null)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/60 rounded-full hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 border-b border-white/10 pb-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-lg font-black shadow-lg font-mono">
            {selectedNode.code}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-100">{selectedNode.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                {selectedNode.nodeTypeId}
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {selectedNode.locationDescription}
            </p>
          </div>
        </div>

        {/* Purpose Callout */}
        <div className="bg-cyan-950/30 border border-cyan-500/20 p-3 rounded-xl mb-4 text-xs text-slate-300">
          <strong className="text-cyan-400 font-bold block mb-0.5">Engineering Purpose:</strong>
          {selectedNode.purpose}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* MCU Specs */}
          <div className="glass-card p-4 rounded-xl border border-white/10 space-y-2">
            <h3 className="font-bold text-slate-200 flex items-center gap-2 border-b border-white/10 pb-1 text-sm text-cyan-400">
              <Cpu className="w-4 h-4 text-cyan-400" /> Microcontroller (MCU)
            </h3>
            <p><strong className="text-slate-400">Model:</strong> <span className="font-mono font-semibold text-cyan-300">{selectedNode.mcuModel}</span></p>
            <p><strong className="text-slate-400">Core:</strong> {template.mcu.core}</p>
            <p><strong className="text-slate-400">Clock:</strong> {template.mcu.clockSpeed}</p>
            <p><strong className="text-slate-400">Memory:</strong> {template.mcu.flashRam}</p>
          </div>

          {/* Comms & Power */}
          <div className="glass-card p-4 rounded-xl border border-white/10 space-y-2">
            <h3 className="font-bold text-slate-200 flex items-center gap-2 border-b border-white/10 pb-1 text-sm text-indigo-400">
              <Radio className="w-4 h-4 text-indigo-400" /> Wireless & Power
            </h3>
            <p><strong className="text-slate-400">Wireless Comms:</strong> {template.comms.module} ({template.comms.protocol})</p>
            <p><strong className="text-slate-400">Range:</strong> {template.comms.range}</p>
            <p><strong className="text-slate-400">Power Source:</strong> {template.power.source}</p>
            <p><strong className="text-slate-400">Operating Mode:</strong> {template.power.mode}</p>
          </div>
        </div>

        {/* Sensor Suite */}
        <div className="mt-4 glass-card p-4 rounded-xl border border-white/10">
          <h3 className="font-bold text-slate-200 flex items-center gap-2 border-b border-white/10 pb-2 text-sm text-emerald-400 mb-2">
            <Zap className="w-4 h-4 text-emerald-400" /> Onboard Sensor Array
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {template.sensors.map((s, i) => (
              <div key={i} className="bg-slate-900/60 p-2.5 rounded-lg border border-white/5">
                <div className="font-bold text-slate-200 flex items-center justify-between">
                  <span>{s.name}</span>
                  <span className="text-[10px] font-mono text-emerald-400">{s.protocol}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{s.purpose}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Baseline Thresholds */}
        <div className="mt-4 glass-card p-4 rounded-xl border border-white/10">
          <h3 className="font-bold text-slate-200 flex items-center gap-2 border-b border-white/10 pb-2 text-sm text-amber-400 mb-2">
            <Activity className="w-4 h-4 text-amber-400" /> Calibrated Baselines & Thresholds
          </h3>
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="bg-slate-900/60 p-2 rounded-lg border border-white/5">
              <span className="text-[10px] text-slate-400 block">Baseline Vib</span>
              <span className="font-bold text-cyan-300">{selectedNode.baselines.vibrationRms} m/s²</span>
            </div>
            <div className="bg-slate-900/60 p-2 rounded-lg border border-white/5">
              <span className="text-[10px] text-slate-400 block">Caution Vib Threshold</span>
              <span className="font-bold text-amber-400">{selectedNode.warningThresholds.vibrationRms} m/s²</span>
            </div>
            <div className="bg-slate-900/60 p-2 rounded-lg border border-white/5">
              <span className="text-[10px] text-slate-400 block">Danger Vib Threshold</span>
              <span className="font-bold text-rose-400">{selectedNode.criticalThresholds.vibrationRms} m/s²</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setSelectedNode(null)}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs shadow-lg transition-all"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
