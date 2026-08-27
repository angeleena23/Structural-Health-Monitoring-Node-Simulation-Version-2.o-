import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { ShieldAlert, ShieldCheck, AlertTriangle, Download } from 'lucide-react';

export const LiveLogsTable: React.FC = () => {
  const { logs } = useSimulation();

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
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 led-red">
            <ShieldAlert className="w-3 h-3" /> DANGER
          </span>
        );
      case 'CAUTION':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 led-amber">
            <AlertTriangle className="w-3 h-3" /> CAUTION
          </span>
        );
      case 'SAFE':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-3 h-3" /> SAFE
          </span>
        );
    }
  };

  return (
    <div className="glass-panel p-4 rounded-xl flex flex-col gap-3 h-full overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <h3 className="text-sm font-bold tracking-wider uppercase flex items-center gap-2 text-slate-200">
          Live Structural Diagnostic Log
        </h3>
        <button
          onClick={exportCsv}
          disabled={logs.length === 0}
          className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-white/10 transition-colors disabled:opacity-40"
        >
          <Download className="w-3.5 h-3.5" /> CSV
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        {logs.length === 0 ? (
          <div className="h-32 flex items-center justify-center text-xs text-slate-500 font-mono">
            Awaiting diagnostic telemetry events...
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-[10px] text-slate-400 uppercase tracking-wider">
                <th className="py-1.5 px-2">Time</th>
                <th className="py-1.5 px-2">Node</th>
                <th className="py-1.5 px-2">Vib (m/s²)</th>
                <th className="py-1.5 px-2">Strain (µε)</th>
                <th className="py-1.5 px-2">Status</th>
                <th className="py-1.5 px-2">Diagnostic Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.map((log, index) => (
                <tr key={index} className="hover:bg-white/5 transition-colors">
                  <td className="py-1.5 px-2 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                  <td className="py-1.5 px-2 font-bold text-cyan-400">{log.nodeCode}</td>
                  <td className="py-1.5 px-2 text-slate-300">{log.readingVibration.toFixed(2)}</td>
                  <td className="py-1.5 px-2 text-slate-300">{log.readingStrain}</td>
                  <td className="py-1.5 px-2">{getStatusBadge(log.status)}</td>
                  <td className="py-1.5 px-2 text-slate-300 font-sans text-xs">{log.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
