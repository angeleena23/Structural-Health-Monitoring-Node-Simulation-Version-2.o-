import React from 'react';
import { Network, Cpu, Server, Lock, Bell, Wifi, ArrowRight, ShieldCheck } from 'lucide-react';

export const SystemArchPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
          <Network className="w-3.5 h-3.5" />
          <span>Section 2 — Industrial IoT System Architecture</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100">3-Layer End-to-End System Architecture</h1>
        <p className="text-sm text-slate-400 max-w-3xl">
          Clean separation between physical Edge Sensor Nodes, the Edge Gateway Aggregator, and the Cloud Dashboard — linked by industrial communication protocols.
        </p>
      </div>

      {/* 3-Layer Interactive Architectural Diagram */}
      <div className="glass-panel p-8 rounded-2xl border border-cyan-500/30 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Layer 1: Edge Nodes */}
          <div className="glass-card p-6 rounded-2xl border border-cyan-500/40 bg-cyan-950/20 space-y-4 relative group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                LAYER 1 — EDGE
              </span>
              <Cpu className="w-6 h-6 text-cyan-400" />
            </div>

            <h3 className="text-lg font-bold text-slate-100">Edge Sensor Nodes</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              STM32 microcontrollers (F411, F429, H743, L432) deployed at critical structural zones. Performs 200 Hz sensor sampling, EMA filtering, and DSP thresholding.
            </p>

            <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-300">
                <span>V-Nodes</span>
                <span className="text-cyan-400">STM32F411RE</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>S-Nodes</span>
                <span className="text-indigo-400">STM32F429 / H743</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>L-Nodes</span>
                <span className="text-emerald-400">STM32L432KC</span>
              </div>
            </div>

            <div className="text-[10px] text-cyan-300 font-mono bg-cyan-900/40 p-2 rounded border border-cyan-500/30">
              Sensor Bus: I2C (MPU6050/BME280) · SPI (HX711 24-bit ADC)
            </div>
          </div>

          {/* Connection Arrow 1 */}
          <div className="hidden md:flex flex-col items-center justify-center -mx-3 z-10">
            <div className="px-2.5 py-1 rounded bg-slate-900 border border-white/10 text-[10px] font-mono text-amber-400 shadow-md">
              LoRa / Wi-Fi / UART
            </div>
            <ArrowRight className="w-6 h-6 text-cyan-400 mt-2" />
          </div>

          {/* Layer 2: Gateway */}
          <div className="glass-card p-6 rounded-2xl border border-indigo-500/40 bg-indigo-950/20 space-y-4 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                LAYER 2 — GATEWAY
              </span>
              <Wifi className="w-6 h-6 text-indigo-400" />
            </div>

            <h3 className="text-lg font-bold text-slate-100">Edge Gateway Aggregator</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Industrial Gateway (ESP32 / STM32H7 / Raspberry Pi) collecting wireless payload packets from all bridge nodes, packing JSON telemetry, and pushing to cloud.
            </p>

            <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-300">
                <span>Concentrator</span>
                <span className="text-indigo-300">ESP32 / STM32H7</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Inbound Comms</span>
                <span className="text-slate-400">SX1276 LoRa / BLE 5.0</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Outbound Uplink</span>
                <span className="text-indigo-400">Cellular 4G / Ethernet</span>
              </div>
            </div>

            <div className="text-[10px] text-indigo-300 font-mono bg-indigo-900/40 p-2 rounded border border-indigo-500/30">
              Protocol: MQTT over TLS v1.3 (Port 8883)
            </div>
          </div>

          {/* Connection Arrow 2 */}
          <div className="hidden md:flex flex-col items-center justify-center -mx-3 z-10">
            <div className="px-2.5 py-1 rounded bg-slate-900 border border-white/10 text-[10px] font-mono text-amber-400 shadow-md">
              MQTT / Cellular / TLS
            </div>
            <ArrowRight className="w-6 h-6 text-indigo-400 mt-2" />
          </div>

          {/* Layer 3: Cloud & Dashboard */}
          <div className="glass-card p-6 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 space-y-4 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                LAYER 3 — CLOUD & DASHBOARD
              </span>
              <Server className="w-6 h-6 text-emerald-400" />
            </div>

            <h3 className="text-lg font-bold text-slate-100">Cloud & Digital Twin Twin</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              MQTT Broker (EMQX/Mosquitto), Time-Series Database (InfluxDB / TimescaleDB), and React Digital Twin Dashboard delivering live plots, logs, and alerts.
            </p>

            <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-300">
                <span>Broker</span>
                <span className="text-emerald-300">MQTT Broker (EMQX)</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Time-Series DB</span>
                <span className="text-slate-400">InfluxDB v2.7</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Frontend UI</span>
                <span className="text-emerald-400">React + Three.js + Recharts</span>
              </div>
            </div>

            <div className="text-[10px] text-emerald-300 font-mono bg-emerald-900/40 p-2 rounded border border-emerald-500/30">
              Output: Live 3D Twin · SMS/Email Alerts · Grafana
            </div>
          </div>
        </div>
      </div>

      {/* Section 9 Extra Industrial System Elements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security Consideration */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-100">Industrial Security Consideration</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            All node communications utilize TLS 1.3 secured MQTT with X.509 client certificate authentication. Hardened AES-128 payload encryption ensures integrity against spoofed sensor telemetry.
          </p>
          <div className="text-[11px] font-mono text-cyan-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> TLS-Secured MQTT · Authenticated Edge Nodes
          </div>
        </div>

        {/* Remote Alerting */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Bell className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-100">Remote Multi-Channel Alerting</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            When structural strain or RMS vibration exceeds critical thresholds for N consecutive sampling windows, the cloud backend dispatches automated Email, SMS, and Telegram operator webhooks.
          </p>
          <div className="text-[11px] font-mono text-amber-400 flex items-center gap-1.5">
            <Bell className="w-4 h-4" /> SMS / Email / Telegram Dispatch Active
          </div>
        </div>
      </div>
    </div>
  );
};
