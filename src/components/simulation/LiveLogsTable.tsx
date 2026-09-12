import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Download, Trash2, ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

export const LiveLogsTable: React.FC = () => {
  const { logs, resetSimulation } = useSimulation();
  const [filterNode, setFilterNode] = useState<string>('all');

  const filteredLogs = filterNode === 'all'
    ? logs
    : logs.filter(l => l.nodeCode.toLowerCase().includes(filterNode.toLowerCase()));

  const exportCsv = () => {
    if (logs.length === 0) return;
    const headers = 'Timestamp,NodeCode,NodeName,VibrationRMS,StrainMicro,Temperature,Status,Message\n';
    const rows = logs
      .map(
        l =>
          `"${l.timestamp}","${l.nodeCode}","${l.nodeName}",${l.readingVibration},${l.readingStrain},${l.readingTemp},"${l.status}","${l.message.replace(/"/g, '""')}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shm_telemetry_logs_${Date.now()}.csv`;
    a.click();
  };

  const getStatusBadge = (status: 'SAFE' | 'CAUTION' | 'DANGER') => {
    switch (status) {
      case 'DANGER':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 led-red">
            <ShieldAlert className="w-3 h-3" /> DANGER
          </span>
        );
      case 'CAUTION':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 led-amber">
            <AlertTriangle className="w-3 h-3" /> CAUTION
          </span>
        );
      case 'SAFE':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <ShieldCheck className="w-3 h-3" /> SAFE
          </span>
        );
    }
  };

  const getCardBorder = (status: 'SAFE' | 'CAUTION' | 'DANGER') => {
    switch (status) {
      case 'DANGER':
        return 'border-l-4 border-l-rose-500 border-rose-500/30 bg-rose-950/20';
      case 'CAUTION':
        return 'border-l-4 border-l-amber-500 border-amber-500/30 bg-amber-950/20';
      case 'SAFE':
      default:
        return 'border-l-4 border-l-cyan-500 border-white/10 bg-slate-950/80';
    }
  };

  return (
    <div className="glass-panel p-4 rounded-xl flex flex-col gap-3 h-full overflow-hidden bg-slate-900/90 border border-white/10 shadow-2xl">
      {/* Header matching screenshot */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2 font-mono">
          <h3 className="text-xs font-bold tracking-wider uppercase text-slate-200">
            Live Telemetry Logs
          </h3>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-cyan-300 border border-white/10">
            {filteredLogs.length} entries
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <select
            value={filterNode}
            onChange={(e) => setFilterNode(e.target.value)}
            className="bg-slate-950 text-slate-300 text-[10px] font-mono px-2 py-1 rounded border border-white/10 cursor-pointer"
          >
            <option value="all">All Nodes</option>
            <option value="node a">Node A</option>
            <option value="node b">Node B</option>
          </select>

          <button
            onClick={exportCsv}
            disabled={logs.length === 0}
            title="Download CSV Log"
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 transition-colors disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={resetSimulation}
            title="Clear Logs"
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Log Entry Cards matching screenshot */}
      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 min-h-0">
        {filteredLogs.length === 0 ? (
          <div className="h-32 flex items-center justify-center text-xs text-slate-500 font-mono">
            Awaiting live telemetry events...
          </div>
        ) : (
          filteredLogs.map((log, index) => (
            <div
              key={index}
              className={`p-2.5 rounded-xl border text-xs font-mono transition-all ${getCardBorder(log.status)}`}
            >
              <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-1 mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-cyan-300">[{log.nodeCode}]</span>
                  <span className="font-bold text-slate-100">{log.readingVibration.toFixed(2)} units</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                  {getStatusBadge(log.status)}
                </div>
              </div>
              <p className="text-[11px] text-slate-300 font-sans leading-tight mt-1">
                {log.message}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
