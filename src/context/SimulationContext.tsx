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
  | 'hal-programs'
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
  loadSeverity: number;
  setLoadSeverity: (sev: number) => void;
  latestReadings: SensorReadingSample[];
  vibrationHistory: TimeSeriesPoint[];
  strainHistory: TimeSeriesPoint[];
  logs: DiagnosticLog[];
  overallStatus: AlertStatus;
  isAudioMuted: boolean;
  toggleAudioMute: () => void;
  audioVolume: number;
  setAudioVolume: (vol: number) => void;
  testYellowSound: () => void;
  testRedSound: () => void;
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
  const [loadSeverity, setLoadSeverity] = useState<number>(6); // 1 to 10
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [audioVolume, setAudioVolumeState] = useState<number>(0.8);
  const [nextFrameTimerTriggered, setNextFrameTimerTriggered] = useState<boolean>(false);

  const activeBridge = BRIDGES[activeBridgeId] || BRIDGES['beam'];

  const [latestReadings, setLatestReadings] = useState<SensorReadingSample[]>([]);
  const [vibrationHistory, setVibrationHistory] = useState<TimeSeriesPoint[]>([]);
  const [strainHistory, setStrainHistory] = useState<TimeSeriesPoint[]>([]);
  const [logs, setLogs] = useState<DiagnosticLog[]>([]);
  const [overallStatus, setOverallStatus] = useState<AlertStatus>('SAFE');

  const lastStatusRef = useRef<AlertStatus>('SAFE');
  const activeLoadRef = useRef<LoadType | null>(null);

  useEffect(() => {
    setNextFrameTimerTriggered(false);
    if (activeScreen === 'bridge-info' || activeScreen === 'sensor-placement') {
      const timer = setTimeout(() => {
        setNextFrameTimerTriggered(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [activeScreen, activeBridgeId]);

  const updateSeverity = (current: AlertStatus, next: AlertStatus): AlertStatus => {
    if (current === 'DANGER' || next === 'DANGER') return 'DANGER';
    if (current === 'CAUTION' || next === 'CAUTION') return 'CAUTION';
    return 'SAFE';
  };

  useEffect(() => {
    const tick = () => {
      const currentNodes = activeBridge.nodes;
      const samples = sensorEngine.computeTick(currentNodes, scenario);
      setLatestReadings(samples);

      const timeStr = new Date().toLocaleTimeString().slice(3, 8);

      const vibPoint: TimeSeriesPoint = { time: timeStr };
      const strainPoint: TimeSeriesPoint = { time: timeStr };

      const maxSeverity = samples.reduce<AlertStatus>((acc, sample) => {
        vibPoint[`${sample.nodeCode} (Filt)`] = sample.filteredVibrationRms;
        vibPoint[`${sample.nodeCode} (Raw)`] = sample.rawVibrationRms;
        strainPoint[`${sample.nodeCode} (Filt)`] = sample.filteredStrainMicro;
        strainPoint[`${sample.nodeCode} (Raw)`] = sample.rawStrainMicro;
        return updateSeverity(acc, sample.status);
      }, 'SAFE');

      setOverallStatus(maxSeverity);

      if (maxSeverity === 'DANGER') {
        audioEngine.playRedAlarm();
      } else if (maxSeverity === 'CAUTION' && lastStatusRef.current === 'SAFE') {
        audioEngine.playYellowBeep();
      }
      lastStatusRef.current = maxSeverity;

      setVibrationHistory(prev => [...prev.slice(-19), vibPoint]);
      setStrainHistory(prev => [...prev.slice(-19), strainPoint]);

      const activeLoads = sensorEngine.getActiveLoads();
      const currentActiveLoad = activeLoads.length > 0 ? activeLoads[0].type : null;
      activeLoadRef.current = currentActiveLoad;

      samples.forEach(sample => {
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

          setLogs(prev => [newLog, ...prev.slice(0, 49)]);
        }
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [activeBridgeId, activeBridge, scenario]);

  const applyLoad = (type: LoadType) => {
    sensorEngine.applyLoad(type, loadSeverity);
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

  const setAudioVolume = (vol: number) => {
    setAudioVolumeState(vol);
    audioEngine.setVolume(vol);
  };

  const testYellowSound = () => {
    audioEngine.playYellowBeep();
  };

  const testRedSound = () => {
    audioEngine.playRedAlarm();
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
        loadSeverity,
        setLoadSeverity,
        latestReadings,
        vibrationHistory,
        strainHistory,
        logs,
        overallStatus,
        isAudioMuted,
        toggleAudioMute,
        audioVolume,
        setAudioVolume,
        testYellowSound,
        testRedSound,
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
