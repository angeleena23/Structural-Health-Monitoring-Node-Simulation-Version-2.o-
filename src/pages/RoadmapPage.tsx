import React from 'react';
import { Rocket, Brain, Sun, Radio, Cloud, Activity, CheckCircle2 } from 'lucide-react';

export const RoadmapPage: React.FC = () => {
  const roadmapItems = [
    {
      title: 'Distributed Multi-Node Sensor Grids',
      category: 'Node Scalability',
      icon: Activity,
      status: 'Planned v3.0',
      description: 'Expanding node network capacity from 4-5 nodes per bridge to dense 50+ node arrays with automated mesh auto-discovery.'
    },
    {
      title: 'Cloud Dashboard Stack (MQTT + InfluxDB + Grafana)',
      category: 'IoT Infrastructure',
      icon: Cloud,
      status: 'In Architecture Phase',
      description: 'Production integration with EMQX MQTT brokers, InfluxDB v2.7 time-series storage, and custom Grafana alert dashboards.'
    },
    {
      title: 'AI/ML Anomaly Detection at the Edge',
      category: 'Edge AI',
      icon: Brain,
      status: 'R&D Phase',
      description: 'Deploying TinyML Autoencoder models directly on STM32H7 (Cortex-M7) for unsupervised vibration anomaly detection without cloud dependency.'
    },
    {
      title: 'Predictive Maintenance & Cumulative Fatigue Modeling',
      category: 'Structural Analytics',
      icon: Rocket,
      status: 'Planned',
      description: 'Rainflow cycle-counting algorithms driving real-time remaining useful life (RUL) estimation for steel girders and stay cables.'
    },
    {
      title: 'Energy Harvesting Solar Autonomous Nodes',
      category: 'Power Management',
      icon: Sun,
      status: 'Prototype Phase',
      description: 'Solar micro-panel PMIC charging circuits paired with supercapacitors and STM32L4 sub-300nA Stop 2 sleep modes.'
    },
    {
      title: 'Hardware-in-the-Loop Real LoRa Radio Uplink',
      category: 'Hardware Integration',
      icon: Radio,
      status: 'Planned',
      description: 'Swapping software simulated JSON telemetry for real SX1276 LoRaWAN SPI modules transmitting to ChirpStack LNS.'
    }
  ];

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
          <Rocket className="w-3.5 h-3.5" />
          <span>Section 13 — Industrial Roadmap & Future Scope</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100">Future Scope & Technology Roadmap</h1>
        <p className="text-sm text-slate-400 max-w-3xl">
          Architectural roadmap for transitioning from client-side simulation to production-grade hardware deployment, edge ML, and cloud IoT integration.
        </p>
      </div>

      {/* Grid of Roadmap Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roadmapItems.map((item, index) => {
          const IconComp = item.icon;
          return (
            <div key={index} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3 hover:border-cyan-500/50 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-white/10">
                    {item.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-100">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
              </div>

              <div className="pt-3 border-t border-white/10 text-[11px] font-mono text-cyan-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> {item.category}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
