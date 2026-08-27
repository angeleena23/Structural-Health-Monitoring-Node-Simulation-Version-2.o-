import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { BRIDGES, BridgeSpec, BridgeNode } from '../data/bridgeData';
import { LoadType, ScenarioMode, AlertStatus, DiagnosticLog, getDiagnosticMessage } from '../data/failureLogics';
import { sensorEngine, SensorReadingSample } from '../engine/sensorEngine';
import { audioEngine } from '../engine/audioEngine';

export type ScreenView =
  | 'home'
  | 'bridge-select'
  | 'bridge-info'
  | 'sensor-placement'
  | 'simulation'
  | 'node-designs'
  | 'system-arch'
  | 'mcu-guide'
  | 'report'
  | 'roadmap';

export interface TimeSeriesPoint {
  time: string;
  [nodeCode: string]: number | string;
}

interface SimulationContextType {
  activeScreen: ScreenView;
  setActiveScreen: (screen: ScreenView) => void;
  activeBridgeId: string;
  setActiveBridgeId: (id: string) => void;
  activeBridge: BridgeSpec;
  selectedNode: BridgeNode | null;
  setSelectedNode: (node: BridgeNode | null) => void;
  scenario: ScenarioMode;
  setScenario: (mode: ScenarioMode) => void;
  latestReadings: SensorReadingSample[];
  vibrationHistory: TimeSeriesPoint[];
  strainHistory: TimeSeriesPoint[];
  logs: DiagnosticLog[];
  overallStatus: AlertStatus;
  isAudioMuted: boolean;
  toggleAudioMute: () => void;
  applyLoad: (type: LoadType) => void;
  resetSimulation: () => void;
  nextFrameTimerTriggered: boolean;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeScreen, setActiveScreen] = useState<ScreenView>('home');
  const [activeBridgeId, setActiveBridgeId] = useState<string>('beam');
  const [selectedNode, setSelectedNode] = useState<BridgeNode | null>(null);
  const [scenario, setScenario] = useState<ScenarioMode>('normal');
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [nextFrameTimerTriggered, setNextFrameTimerTriggered] = useState<boolean>(false);

  const activeBridge = BRIDGES[activeBridgeId] || BRIDGES['beam'];

  const [latestReadings, setLatestReadings] = useState<SensorReadingSample[]>([]);
  const [vibrationHistory, setVibrationHistory] = useState<TimeSeriesPoint[]>([]);
  const [strainHistory, setStrainHistory] = useState<TimeSeriesPoint[]>([]);
  const [logs, setLogs] = useState<DiagnosticLog[]>([]);
  const [overallStatus, setOverallStatus] = useState<AlertStatus>('SAFE');

  const lastStatusRef = useRef<AlertStatus>('SAFE');
  const activeLoadRef = useRef<LoadType | null>(null);

  // Auto-next timer trigger for screens 3 and 4 (3 seconds delay)
  useEffect(() => {
    setNextFrameTimerTriggered(false);
    if (activeScreen === 'bridge-info' || activeScreen === 'sensor-placement') {
      const timer = setTimeout(() => {
        setNextFrameTimerTriggered(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [activeScreen, activeBridgeId]);

  // Helper for computing combined status severity
  const updateSeverity = (current: AlertStatus, next: AlertStatus): AlertStatus => {
    if (current === 'DANGER' || next === 'DANGER') return 'DANGER';
    if (current === 'CAUTION' || next === 'CAUTION') return 'CAUTION';
    return 'SAFE';
  };

  // Main 1Hz simulation tick loop
  useEffect(() => {
    const tick = () => {
      const currentNodes = activeBridge.nodes;
      const samples = sensorEngine.computeTick(currentNodes, scenario);
      setLatestReadings(samples);

      const timeStr = new Date().toLocaleTimeString().slice(3, 8); // MM:SS format

      // 1. Build Time Series Points for Recharts & calculate max severity via reduce
      const vibPoint: TimeSeriesPoint = { time: timeStr };
      const strainPoint: TimeSeriesPoint = { time: timeStr };

      const maxSeverity = samples.reduce<AlertStatus>((acc, sample) => {
        vibPoint[sample.nodeCode] = sample.filteredVibrationRms;
        strainPoint[sample.nodeCode] = sample.filteredStrainMicro;
        return updateSeverity(acc, sample.status);
      }, 'SAFE');

      setOverallStatus(maxSeverity);

      // Trigger Audio alerts on status transition or sustained danger
      if (maxSeverity === 'DANGER') {
        audioEngine.playRedAlarm();
      } else if (maxSeverity === 'CAUTION' && lastStatusRef.current === 'SAFE') {
        audioEngine.playYellowBeep();
      }
      lastStatusRef.current = maxSeverity;

      // 2. Append to history buffer (keep last 20 seconds)
      setVibrationHistory(prev => [...prev.slice(-19), vibPoint]);
      setStrainHistory(prev => [...prev.slice(-19), strainPoint]);

      // 3. Generate diagnostic logs for elevated samples or periodic baseline
      const activeLoads = sensorEngine.getActiveLoads();
      const currentActiveLoad = activeLoads.length > 0 ? activeLoads[0].type : null;
      activeLoadRef.current = currentActiveLoad;

      samples.forEach(sample => {
        // Add log entry if non-safe or every 5 seconds for normal
        if (sample.status !== 'SAFE' || Math.random() < 0.15) {
          const msg = getDiagnosticMessage(
            activeBridgeId,
            sample.nodeCode,
            sample.status,
            currentActiveLoad,
            scenario,
            sample.filteredVibrationRms,
            sample.filteredStrainMicro
          );

          const newLog: DiagnosticLog = {
            timestamp: new Date().toLocaleTimeString(),
            bridgeId: activeBridgeId,
            nodeCode: sample.nodeCode,
            nodeName: sample.nodeId,
            readingVibration: sample.filteredVibrationRms,
            readingStrain: sample.filteredStrainMicro,
            readingTemp: sample.temperature,
            status: sample.status,
            message: msg
          };

          setLogs(prev => [newLog, ...prev.slice(0, 49)]); // keep latest 50 logs
        }
      });
    };

    tick(); // immediate initial tick
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [activeBridgeId, activeBridge, scenario]);

  const applyLoad = (type: LoadType) => {
    sensorEngine.applyLoad(type);
    activeLoadRef.current = type;
  };

  const resetSimulation = () => {
    sensorEngine.clearLoads();
    setVibrationHistory([]);
    setStrainHistory([]);
    setLogs([]);
    setScenario('normal');
    setOverallStatus('SAFE');
    lastStatusRef.current = 'SAFE';
    audioEngine.stopRedAlarm();
  };

  const toggleAudioMute = () => {
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    audioEngine.setMuted(nextMuted);
  };

  return (
    <SimulationContext.Provider
      value={{
        activeScreen,
        setActiveScreen,
        activeBridgeId,
        setActiveBridgeId,
        activeBridge,
        selectedNode,
        setSelectedNode,
        scenario,
        setScenario,
        latestReadings,
        vibrationHistory,
        strainHistory,
        logs,
        overallStatus,
        isAudioMuted,
        toggleAudioMute,
        applyLoad,
        resetSimulation,
        nextFrameTimerTriggered
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
