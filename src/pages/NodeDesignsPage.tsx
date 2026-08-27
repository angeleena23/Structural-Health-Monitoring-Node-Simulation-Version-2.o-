import React, { useState } from 'react';
import { NODE_TEMPLATES } from '../data/nodeTemplates';
import { Cpu, Zap, Radio, Code2, ArrowRight } from 'lucide-react';

const FIRMWARE_PSEUDOCODE = `/* ============================================================================
 * STM32 Structural Health Monitoring (SHM) Node Firmware Outline
 * Node Type: V-Node (Vibration + Environment) | MCU: STM32F411RE
 * Core: ARM Cortex-M4 with FPU @ 100 MHz
 * Peripherals: TIM2 (200Hz ADC/IMU sampling), I2C1 (MPU6050), I2C2 (BME280), UART2 (Wi-Fi/LoRa)
 * ============================================================================ */

#include "stm32f4xx_hal.h"
#include "mpu6050.h"
#include "bme280.h"

#define SAMPLING_FREQ_HZ   200
#define WINDOW_SIZE_SAMPLES 200 // 1-second RMS window
#define VIB_THRESH_WARN    0.35f // m/s^2 RMS warning
#define VIB_THRESH_CRIT    0.65f // m/s^2 RMS critical

typedef struct {
    float accel_x, accel_y, accel_z;
    float rms_vibration;
    float peak_vibration;
    float temperature_c;
    uint8_t alert_flag; // 0=SAFE, 1=CAUTION, 2=DANGER
} SHM_TelemetryPacket_t;

static SHM_TelemetryPacket_t g_telemetry;
static float g_accel_buffer[WINDOW_SIZE_SAMPLES];
static uint16_t g_sample_idx = 0;

void System_Init(void) {
    HAL_Init();
    SystemClock_Config_100MHz();
    
    // Configure I2C1 for MPU6050 IMU & I2C2 for BME280
    MX_I2C1_Init();
    MX_I2C2_Init();
    
    // Configure UART2 for Wireless Gateway telemetry
    MX_USART2_UART_Init();
    
    // Calibrate sensor zero offsets
    MPU6050_Init(&hi2c1);
    MPU6050_CalibrateOffsets();
    BME280_Init(&hi2c2);
    
    // Start TIM2 Hardware Interrupt at 200 Hz
    HAL_TIM_Base_Start_IT(&htim2);
}

/* 200 Hz Timer Interrupt Callback */
void HAL_TIM_PeriodElapsedCallback(TIM_HandleTypeDef *htim) {
    if (htim->Instance == TIM2) {
        float ax, ay, az;
        MPU6050_ReadAccel_g(&ax, &ay, &az);
        
        // Magnitude vector: sqrt(ax^2 + ay^2 + az^2)
        float mag = sqrtf(ax * ax + ay * ay + az * az) * 9.81f; // Convert g to m/s^2
        g_accel_buffer[g_sample_idx++] = mag;
        
        if (g_sample_idx >= WINDOW_SIZE_SAMPLES) {
            g_sample_idx = 0;
            Process_1Sec_Window();
        }
    }
}

void Process_1Sec_Window(void) {
    float sum_sq = 0.0f;
    float peak = 0.0f;
    
    for (int i = 0; i < WINDOW_SIZE_SAMPLES; i++) {
        float val = g_accel_buffer[i] - 9.81f; // Subtract static gravity offset
        sum_sq += (val * val);
        if (fabsf(val) > peak) peak = fabsf(val);
    }
    
    g_telemetry.rms_vibration = sqrtf(sum_sq / WINDOW_SIZE_SAMPLES);
    g_telemetry.peak_vibration = peak;
    g_telemetry.temperature_c = BME280_ReadTemperature();
    
    // Compare against baseline thresholds
    if (g_telemetry.rms_vibration >= VIB_THRESH_CRIT) {
        g_telemetry.alert_flag = 2; // DANGER
        HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_SET); // Red LED
        HAL_GPIO_WritePin(GPIOA, GPIO_PIN_5, GPIO_PIN_SET);  // Buzzer ON
    } else if (g_telemetry.rms_vibration >= VIB_THRESH_WARN) {
        g_telemetry.alert_flag = 1; // CAUTION
        HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_SET); // Yellow LED
        HAL_GPIO_WritePin(GPIOA, GPIO_PIN_5, GPIO_PIN_RESET);
    } else {
        g_telemetry.alert_flag = 0; // SAFE
        HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_RESET);
        HAL_GPIO_WritePin(GPIOA, GPIO_PIN_5, GPIO_PIN_RESET);
    }
    
    // Transmit UART Frame to Edge Gateway
    uint8_t payload[32];
    sprintf((char*)payload, "$SHM,V1,%0.3f,%0.3f,%0.1f,%d*\\r\\n",
            g_telemetry.rms_vibration, g_telemetry.peak_vibration,
            g_telemetry.temperature_c, g_telemetry.alert_flag);
    HAL_UART_Transmit(&huart2, payload, strlen((char*)payload), 100);
}
`;

export const NodeDesignsPage: React.FC = () => {
  const [selectedNodeTab, setSelectedNodeTab] = useState<'V-Node' | 'S-Node' | 'L-Node'>('V-Node');
  const activeNode = NODE_TEMPLATES[selectedNodeTab];

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Page Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-100">Standard Node Templates & Architecture</h1>
        <p className="text-sm text-slate-400 max-w-3xl">
          Three standardized hardware templates deployed across all six bridge types to balance compute performance, 24-bit strain precision, and battery life.
        </p>
      </div>

      {/* Node Type Selector Tabs */}
      <div className="flex bg-slate-900/80 p-1 rounded-2xl border border-white/10 w-fit font-bold text-xs">
        {Object.keys(NODE_TEMPLATES).map((key) => (
          <button
            key={key}
            onClick={() => setSelectedNodeTab(key as 'V-Node' | 'S-Node' | 'L-Node')}
            className={`px-6 py-2.5 rounded-xl transition-all ${
              selectedNodeTab === key
                ? 'bg-cyan-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {key} — {NODE_TEMPLATES[key].name}
          </button>
        ))}
      </div>

      {/* Active Node Specifications Card */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-6">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono">
            {activeNode.id}
          </span>
          <h2 className="text-2xl font-bold text-slate-100 mt-2">{activeNode.name}</h2>
          <p className="text-xs text-slate-400 mt-1">{activeNode.tagline}</p>
        </div>

        {/* 3-Column Spec Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* MCU */}
          <div className="glass-card p-4 rounded-xl border border-white/10 space-y-2">
            <h3 className="font-bold text-cyan-400 flex items-center gap-2 text-sm border-b border-white/10 pb-1">
              <Cpu className="w-4 h-4" /> MCU Selection
            </h3>
            <p><strong className="text-slate-400">Part Number:</strong> <span className="font-mono text-cyan-300 font-bold">{activeNode.mcu.model}</span></p>
            <p><strong className="text-slate-400">Series:</strong> {activeNode.mcu.series}</p>
            <p><strong className="text-slate-400">Core:</strong> {activeNode.mcu.core}</p>
            <p><strong className="text-slate-400">Clock:</strong> {activeNode.mcu.clockSpeed}</p>
            <ul className="list-disc list-inside text-[11px] text-slate-400 pt-1 space-y-1">
              {activeNode.mcu.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>

          {/* Sensors */}
          <div className="glass-card p-4 rounded-xl border border-white/10 space-y-2">
            <h3 className="font-bold text-emerald-400 flex items-center gap-2 text-sm border-b border-white/10 pb-1">
              <Zap className="w-4 h-4" /> Sensor Array
            </h3>
            {activeNode.sensors.map((s, i) => (
              <div key={i} className="bg-slate-900/60 p-2 rounded border border-white/5 space-y-0.5">
                <span className="font-bold text-slate-200 block">{s.name}</span>
                <span className="text-[10px] text-emerald-400 font-mono block">{s.protocol}</span>
                <p className="text-[11px] text-slate-400">{s.purpose}</p>
              </div>
            ))}
          </div>

          {/* Comms & Power */}
          <div className="glass-card p-4 rounded-xl border border-white/10 space-y-2">
            <h3 className="font-bold text-indigo-400 flex items-center gap-2 text-sm border-b border-white/10 pb-1">
              <Radio className="w-4 h-4" /> Comms & Power
            </h3>
            <p><strong className="text-slate-400">Radio Module:</strong> {activeNode.comms.module}</p>
            <p><strong className="text-slate-400">Bus Protocol:</strong> {activeNode.comms.protocol}</p>
            <p><strong className="text-slate-400">Comms Range:</strong> {activeNode.comms.range}</p>
            <p><strong className="text-slate-400">Power Supply:</strong> {activeNode.power.source}</p>
            <p><strong className="text-slate-400">Power Mode:</strong> {activeNode.power.mode}</p>
          </div>
        </div>

        {/* Hardware Block Diagram Flow */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            Hardware Interconnect Block Diagram
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
            {activeNode.blockDiagramSteps.map((step, i) => (
              <div key={i} className="bg-slate-900/80 p-3 rounded-xl border border-white/10 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-cyan-400 font-bold">{step.source}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-indigo-400 font-bold">{step.target}</span>
                </div>
                <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 inline-block">
                  {step.bus}
                </span>
                <p className="text-[11px] text-slate-400 font-sans mt-1">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Firmware Pseudocode Viewer (Section 10 Requirement) */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-slate-100">
              Section 10 — STM32 Firmware Pseudocode Flow
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-800 px-3 py-1 rounded-lg border border-white/10">
            HAL C/C++ Implementation
          </span>
        </div>

        <p className="text-xs text-slate-400">
          Conceptual C/C++ firmware outline for V-Node (STM32F411RE) showing clock init, 200 Hz hardware timer interrupt, windowed RMS acceleration math, threshold alerts, and UART packet framing.
        </p>

        <div className="bg-slate-950 p-4 rounded-xl border border-white/10 overflow-x-auto text-xs font-mono leading-relaxed text-emerald-400 max-h-[420px] overflow-y-auto">
          <pre>{FIRMWARE_PSEUDOCODE}</pre>
        </div>
      </div>
    </div>
  );
};
