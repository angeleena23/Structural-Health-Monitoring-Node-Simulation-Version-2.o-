import { BridgeNode } from '../data/bridgeData';
import { LoadType, ScenarioMode, AlertStatus } from '../data/failureLogics';

export interface SensorReadingSample {
  nodeId: string;
  nodeCode: string;
  rawVibrationRms: number;
  filteredVibrationRms: number;
  rawStrainMicro: number;
  filteredStrainMicro: number;
  temperature: number;
  status: AlertStatus;
  timestamp: string;
}

export interface ActiveLoadState {
  type: LoadType;
  appliedAt: number; // timestamp ms
  durationMs: number;
  decayRate: number;
  impactVibration: number;
  impactStrain: number;
  impactTemp: number;
}

export class SensorEngine {
  private previousFiltered: Record<string, { vibration: number; strain: number }> = {};
  private activeLoads: ActiveLoadState[] = [];
  private alpha: number = 0.35; // EMA smoothing factor

  public applyLoad(type: LoadType, severity: number = 6) {
    const sevMult = severity / 5; // Severity scale: 1=0.2x, 5=1.0x, 6=1.2x, 10=2.0x

    let baseVib = 0.3;
    let baseStrain = 180;
    let baseTemp = 0;

    switch (type) {
      case 'car':
        baseVib = 0.22;
        baseStrain = 110;
        break;
      case 'truck':
        baseVib = 0.48;
        baseStrain = 310;
        break;
      case 'wind':
        baseVib = 0.38;
        baseStrain = 220;
        break;
      case 'earthquake':
        baseVib = 0.85;
        baseStrain = 540;
        break;
      case 'fire':
        baseVib = 0.15;
        baseStrain = 280;
        baseTemp = 24.0;
        break;
      case 'collision':
        baseVib = 0.95;
        baseStrain = 620;
        break;
    }

    this.activeLoads.push({
      type,
      appliedAt: Date.now(),
      durationMs: 5000,
      decayRate: 0.65,
      impactVibration: baseVib * sevMult,
      impactStrain: baseStrain * sevMult,
      impactTemp: baseTemp * sevMult
    });
  }

  public getActiveLoads(): ActiveLoadState[] {
    const now = Date.now();
    this.activeLoads = this.activeLoads.filter(l => now - l.appliedAt < l.durationMs);
    return this.activeLoads;
  }

  public clearLoads() {
    this.activeLoads = [];
    this.previousFiltered = {};
  }

  public computeTick(
    nodes: BridgeNode[],
    scenario: ScenarioMode
  ): SensorReadingSample[] {
    const nowMs = Date.now();
    const timeStr = new Date().toLocaleTimeString();

    let totalLoadVib = 0;
    let totalLoadStrain = 0;
    let totalLoadTemp = 0;

    this.activeLoads = this.activeLoads.filter(load => {
      const elapsedSec = (nowMs - load.appliedAt) / 1000;
      if (elapsedSec >= load.durationMs / 1000) return false;

      const factor = Math.exp(-elapsedSec * 0.7);
      totalLoadVib += load.impactVibration * factor;
      totalLoadStrain += load.impactStrain * factor;
      totalLoadTemp += load.impactTemp * factor;
      return true;
    });

    return nodes.map(node => {
      const b = node.baselines;

      let scenarioVibMult = 1.0;
      let scenarioStrainMult = 1.0;

      if (scenario === 'overload') {
        scenarioVibMult = 1.65;
        scenarioStrainMult = 1.75;
      } else if (scenario === 'damage') {
        scenarioVibMult = 2.45;
        scenarioStrainMult = 2.60;
      }

      const vibNoise = (Math.random() - 0.5) * 0.04 * b.vibrationRms;
      const strainNoise = (Math.random() - 0.5) * 12;
      const tempNoise = (Math.random() - 0.5) * 0.4;

      const rawVib = Math.max(0.01, b.vibrationRms * scenarioVibMult + totalLoadVib + vibNoise);
      const rawStrain = Math.max(10, b.strainMicro * scenarioStrainMult + totalLoadStrain + strainNoise);
      const rawTemp = b.temperature + totalLoadTemp + tempNoise;

      const prev = this.previousFiltered[node.id] || { vibration: rawVib, strain: rawStrain };
      const filteredVib = this.alpha * rawVib + (1 - this.alpha) * prev.vibration;
      const filteredStrain = this.alpha * rawStrain + (1 - this.alpha) * prev.strain;

      this.previousFiltered[node.id] = { vibration: filteredVib, strain: filteredStrain };

      let status: AlertStatus = 'SAFE';
      const isVibWarn = filteredVib >= node.warningThresholds.vibrationRms;
      const isVibCrit = filteredVib >= node.criticalThresholds.vibrationRms;
      const isStrainWarn = filteredStrain >= node.warningThresholds.strainMicro;
      const isStrainCrit = filteredStrain >= node.criticalThresholds.strainMicro;

      if (isVibCrit || isStrainCrit) {
        status = 'DANGER';
      } else if (isVibWarn || isStrainWarn) {
        status = 'CAUTION';
      }

      return {
        nodeId: node.id,
        nodeCode: node.code,
        rawVibrationRms: Number(rawVib.toFixed(3)),
        filteredVibrationRms: Number(filteredVib.toFixed(3)),
        rawStrainMicro: Math.round(rawStrain),
        filteredStrainMicro: Math.round(filteredStrain),
        temperature: Number(rawTemp.toFixed(1)),
        status,
        timestamp: timeStr
      };
    });
  }
}

export const sensorEngine = new SensorEngine();
