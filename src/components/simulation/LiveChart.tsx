import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { useSimulation } from '../../context/SimulationContext';
import { useTheme } from '../../context/ThemeContext';

const NODE_COLORS = ['#38bdf8', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

export const LiveChart: React.FC = () => {
  const { activeBridge, vibrationHistory, strainHistory } = useSimulation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [metric, setMetric] = useState<'vibration' | 'strain'>('vibration');

  const historyData = metric === 'vibration' ? vibrationHistory : strainHistory;

  return (
    <div className="glass-panel p-4 rounded-xl flex flex-col gap-3 h-64 w-full">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <h3 className="text-sm font-bold tracking-wider uppercase text-slate-200">
            Real-Time Node Telemetry
          </h3>
        </div>

        {/* Metric Toggle */}
        <div className="flex bg-slate-900/80 p-0.5 rounded-lg border border-white/10 text-xs font-semibold">
          <button
            onClick={() => setMetric('vibration')}
            className={`px-3 py-1 rounded-md transition-colors ${
              metric === 'vibration'
                ? 'bg-cyan-500 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Vibration (m/s²)
          </button>
          <button
            onClick={() => setMetric('strain')}
            className={`px-3 py-1 rounded-md transition-colors ${
              metric === 'strain'
                ? 'bg-cyan-500 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Strain (µε)
          </button>
        </div>
      </div>

      <div className="w-full h-full text-xs">
        {historyData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 font-mono">
            Initializing live telemetry stream...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'} />
              <XAxis dataKey="time" stroke={isDark ? '#64748b' : '#94a3b8'} tick={{ fontSize: 10 }} />
              <YAxis stroke={isDark ? '#64748b' : '#94a3b8'} tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#0f172a' : '#ffffff',
                  borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
                  borderRadius: '8px',
                  color: isDark ? '#f8fafc' : '#0f172a',
                  fontSize: '11px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />

              {activeBridge.nodes.map((node, index) => (
                <Line
                  key={node.code}
                  type="monotone"
                  dataKey={node.code}
                  name={`${node.code} (${node.nodeTypeId})`}
                  stroke={NODE_COLORS[index % NODE_COLORS.length]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
