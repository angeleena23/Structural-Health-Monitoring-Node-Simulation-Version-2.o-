export type LoadType = 'car' | 'truck' | 'wind' | 'earthquake' | 'fire' | 'collision';
export type ScenarioMode = 'normal' | 'overload' | 'damage';
export type AlertStatus = 'SAFE' | 'CAUTION' | 'DANGER';

export interface DiagnosticLog {
  timestamp: string;
  bridgeId: string;
  nodeCode: string;
  nodeName: string;
  readingVibration: number;
  readingStrain: number;
  readingTemp: number;
  status: AlertStatus;
  message: string;
}

export function getDiagnosticMessage(
  bridgeId: string,
  nodeCode: string,
  status: AlertStatus,
  activeLoad: LoadType | null,
  scenario: ScenarioMode,
  vibrationRms: number,
  strainMicro: number
): string {
  if (status === 'SAFE') {
    if (scenario === 'normal' && !activeLoad) {
      return `Baseline structural equilibrium maintained. RMS vibration ${vibrationRms.toFixed(2)} m/s², Strain ${Math.round(strainMicro)} µε.`;
    }
    if (activeLoad === 'car') {
      return `Standard light vehicle traffic pulse absorbed cleanly. Dynamic strain transient within nominal envelope.`;
    }
    return `Filtered sensor readings within acceptable structural thresholds. Operational mode normal.`;
  }

  const isDanger = status === 'DANGER';

  // Contextual messages per bridge & node
  if (bridgeId === 'beam') {
    if (nodeCode === 'B1') {
      return isDanger
        ? `CRITICAL BENDING EXCEEDED: Extreme mid-span flexural strain (${Math.round(strainMicro)} µε). High risk of girder tension cracking & fatigue failure.`
        : `ELEVATED FLEXURE: Mid-span bending strain rising under load. Monitor micro-strain rate of change.`;
    }
    if (nodeCode === 'B2') {
      return isDanger
        ? `BEARING FAILURE RISK: Support vibration (${vibrationRms.toFixed(2)} m/s²) indicates bearing pad lockup or elastomeric destruction!`
        : `BEARING CHATTER: Elevated vibration at support seating. Bearing alignment check advised.`;
    }
    if (nodeCode === 'B3') {
      return isDanger
        ? `FOUNDATION SCOUR ALERT: Pier L-Node detected structural tilt & foundation displacement pattern!`
        : `PIER MOTION: Minor sub-structure tilt variation detected at foundation footing.`;
    }
    if (nodeCode === 'B4') {
      return isDanger
        ? `DECK SLAB IMPACT SEVERE: Pavement impact vibration spiking (${vibrationRms.toFixed(2)} m/s²). Heavy axle overload detected.`
        : `DECK ROUGHNESS: Traffic bounce transient exceeding typical baseline limits.`;
    }
  }

  if (bridgeId === 'arch') {
    if (nodeCode === 'A1') {
      return isDanger
        ? `ARCH CROWN COMPRESSION CRITICAL: Rib apex strain (${Math.round(strainMicro)} µε) approaching concrete crushing / steel buckling limit!`
        : `CROWN STRESS WARNING: Arch apex axial compression elevated under asymmetric loading.`;
    }
    if (nodeCode === 'A2') {
      return isDanger
        ? `ARCH SPRINGING SHEAR HAZARD: High rotation and shear force detected at arch abutment hinge.`
        : `SPRINGING ROTATION: Support thrust moment shifting outside nominal envelope.`;
    }
  }

  if (bridgeId === 'truss') {
    if (nodeCode === 'T1') {
      return isDanger
        ? `TRUSS DIAGONAL OVERLOAD: Tensile strain (${Math.round(strainMicro)} µε) in diagonal member T1 exceeds yield safety margin!`
        : `DIAGONAL FATIGUE: High tension cycles detected in critical web truss member.`;
    }
    if (nodeCode === 'T2') {
      return isDanger
        ? `GUSSET PLATE DISTORTION: High-frequency resonance shift at node T2 indicates bolt loosening or plate fretting!`
        : `JOINT CHATTER: Acoustic energy spike at gusset plate connection.`;
    }
  }

  if (bridgeId === 'cantilever') {
    if (nodeCode === 'C1') {
      return isDanger
        ? `CANTILEVER TIP DEFLECTION SEVERE: Free arm extremity sway (${vibrationRms.toFixed(2)} m/s²) & peak fiber strain endanger stability!`
        : `TIP OSCILLATION: Cantilever arm tip vibration elevated under wind/live load.`;
    }
    if (nodeCode === 'C2') {
      return isDanger
        ? `CANTILEVER ROOT MOMENT CRITICAL: Peak negative bending moment above pier C2 risking top flange cracking!`
        : `ROOT MOMENT ELEVATED: Bending strain above pier support rising.`;
    }
  }

  if (bridgeId === 'suspension') {
    if (nodeCode === 'SUS1') {
      return isDanger
        ? `MAIN CABLE TENSION HAZARD: Mid-span cable vibration (${vibrationRms.toFixed(2)} m/s²) indicates severe wind flutter / tension drop!`
        : `CABLE OSCILLATION: Wind-induced modal oscillation rising on main catenary cable.`;
    }
    if (nodeCode === 'SUS3') {
      return isDanger
        ? `TOWER CREST SWAY EXTREME: High-altitude tower sway (${vibrationRms.toFixed(2)} m/s²) under aerodynamic wind shear!`
        : `TOWER MOTION: Aerodynamic wind response detected at tower saddle level.`;
    }
  }

  if (bridgeId === 'cable-stayed') {
    if (nodeCode === 'CS1') {
      return isDanger
        ? `STAY CABLE MODAL ANOMALY: Frequency shift & tension loss detected on stay cable CS1. Rain-wind galloping risk!`
        : `STAY VIBRATION: Cable vibration amplitude exceeding dampener nominal threshold.`;
    }
    if (nodeCode === 'CS2') {
      return isDanger
        ? `PYLON BENDING UNBALANCED: Tower pylon top bending moment imbalanced between left/right stay arrays!`
        : `PYLON SWAY: Lateral pylon deflection rising under asymmetric traffic live load.`;
    }
  }

  // Load-specific fallbacks
  if (activeLoad === 'earthquake') {
    return isDanger
      ? `SEISMIC EMERGENCY: Severe ground motion acceleration (${vibrationRms.toFixed(2)} m/s²). Structural emergency stop!`
      : `SEISMIC TREMOR: Ground acceleration wave propagating through foundation substructure.`;
  }
  if (activeLoad === 'wind') {
    return isDanger
      ? `AERODYNAMIC GALE FORCE: High wind shear causing cross-sectional aerodynamic instability & buffeting.`
      : `WIND BUFFETING: Lateral wind gusts inducing structural sway.`;
  }
  if (activeLoad === 'fire') {
    return isDanger
      ? `THERMAL EMERGENCY: Rapid temperature rise causing severe thermal expansion stress & material softening!`
      : `THERMAL ELEVATION: Surface temperature rising above normal operating range.`;
  }
  if (activeLoad === 'collision') {
    return isDanger
      ? `VESSEL IMPACT ALARM: High-G shock impulse detected at pier substructure! Immediate structural inspection required.`
      : `IMPACT SHOCK DETECTED: Instantaneous deceleration transient registered on IMU sensors.`;
  }

  return isDanger
    ? `CRITICAL THRESHOLD EXCEEDED at ${nodeCode}. Immediate maintenance intervention required.`
    : `WARNING LEVEL REACHED at ${nodeCode}. Filtered readings exceeding safe baseline limits.`;
}
