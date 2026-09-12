import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { useSimulation } from '../../context/SimulationContext';
import { useTheme } from '../../context/ThemeContext';

const NODE_COLORS: Record<string, string> = {
  'B1 (Filt)': '#38bdf8',
  'B1 (Raw)': '#0284c7',
  'B2 (Filt)': '#10b981',
  'B2 (Raw)': '#059669',
  'A1 (Filt)': '#38bdf8',
  'A1 (Raw)': '#0284c7',
  'A2 (Filt)': '#10b981',
  'A2 (Raw)': '#059669',
  'T1 (Filt)': '#38bdf8',
  'T1 (Raw)': '#0284c7',
  'T2 (Filt)': '#10b981',
  'T2 (Raw)': '#059669',
  'C1 (Filt)': '#38bdf8',
  'C1 (Raw)': '#0284c7',
  'C2 (Filt)': '#10b981',
  'C2 (Raw)': '#059669',
  'SUS1 (Filt)': '#38bdf8',
  'SUS1 (Raw)': '#0284c7',
  'SUS2 (Filt)': '#10b981',
  'SUS2 (Raw)': '#059669',
  'CS1 (Filt)': '#38bdf8',
  'CS1 (Raw)': '#0284c7',
  'CS2 (Filt)': '#10b981',
  'CS2 (Raw)': '#059669'
};

const DEFAULT_LINE_COLORS = ['#38bdf8', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

export const LiveChart: React.FC = () => {
  const { activeBridge, vibrationHistory, strainHistory } = useSimulation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [metric, setMetric] = useState<'vibration' | 'strain'>('vibration');

  const historyData = metric === 'vibration' ? vibrationHistory : strainHistory;

  // Node A baseline & thresholds for reference line display
  const nodeA = activeBridge.nodes[0];
  const nodeABaseline = metric === 'vibration' ? nodeA.baselines.vibrationRms : nodeA.baselines.strainMicro;
  const nodeAWarn = metric === 'vibration' ? nodeA.warningThresholds.vibrationRms : nodeA.warningThresholds.strainMicro;
  const nodeACrit = metric === 'vibration' ? nodeA.criticalThresholds.vibrationRms : nodeA.criticalThresholds.strainMicro;

  return (
    <div className="glass-panel p-4 rounded-xl flex flex-col gap-3 h-64 w-full">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <h3 className="text-xs font-bold tracking-wider uppercase text-slate-200 font-mono">
            Real-Time Node Telemetry
          </h3>
        </div>

        {/* Metric Switcher */}
        <div className="flex bg-slate-900/80 p-0.5 rounded-lg border border-white/10 text-xs font-semibold">
          <button
            onClick={() => setMetric('vibration')}
            className={`px-3 py-1 rounded-md transition-colors ${
              metric === 'vibration'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Accel RMS (m/s²)
          </button>
          <button
            onClick={() => setMetric('strain')}
            className={`px-3 py-1 rounded-md transition-colors ${
              metric === 'strain'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Strain (µε)
          </button>
        </div>
      </div>

      <div className="w-full h-full text-xs">
        {historyData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-500 font-mono">
            Initializing live 1Hz telemetry sampling stream...
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
              <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '2px' }} />

              {/* Reference Lines for Baseline, Caution, Danger */}
              <ReferenceLine y={nodeABaseline} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'Baseline', fill: '#10b981', fontSize: 9 }} />
              <ReferenceLine y={nodeAWarn} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'Caution', fill: '#f59e0b', fontSize: 9 }} />
              <ReferenceLine y={nodeACrit} stroke="#f43f5e" strokeDasharray="2 2" label={{ value: 'Danger', fill: '#f43f5e', fontSize: 9 }} />

              {/* Dynamic Telemetry Lines */}
              {activeBridge.nodes.slice(0, 2).map((node, index) => {
                const filtKey = `${node.code} (Filt)`;
                const rawKey = `${node.code} (Raw)`;
                const colorFilt = NODE_COLORS[filtKey] || DEFAULT_LINE_COLORS[index % DEFAULT_LINE_COLORS.length];

                return (
                  <React.Fragment key={node.code}>
                    <Line
                      type="monotone"
                      dataKey={filtKey}
                      name={`${node.code} (EMA Filtered)`}
                      stroke={colorFilt}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey={rawKey}
                      name={`${node.code} (Raw Sensor)`}
                      stroke={colorFilt}
                      strokeWidth={1}
                      strokeDasharray="2 2"
                      strokeOpacity={0.5}
                      dot={false}
                    />
                  </React.Fragment>
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
