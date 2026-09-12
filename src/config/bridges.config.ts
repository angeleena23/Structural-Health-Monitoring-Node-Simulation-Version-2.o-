export interface SensorNodeConfig {
  id: string;
  code: string;
  name: string;
  roleTag: string; // "Node A (Mid-Span)", "Node B (Support)", etc.
  nodeTypeId: 'V-Node' | 'S-Node' | 'L-Node';
  mcuModel: string;
  sensors: string[];
  purpose: string;
  locationDescription: string;
  position3D: [number, number, number];
  baselines: {
    vibrationRms: number; // m/s^2
    strainMicro: number;   // µε
    temperature: number;   // °C
  };
  warningThresholds: {
    vibrationRms: number;
    strainMicro: number;
  };
  criticalThresholds: {
    vibrationRms: number;
    strainMicro: number;
  };
}

export interface BridgeConfig {
  id: string;
  name: string;
  category: string;
  spanRange: string;
  baselineUnitsDisplay: number; // e.g. 20, 22, 25, 28, 30, 26
  tagline: string;
  description: string;
  constructionDuration: string;
  typicalMaterials: string[];
  typicalLifespan: string;
  commonFailureModes: string[];
  applications: string[];
  nodes: SensorNodeConfig[];
}

export const BRIDGES_CONFIG: Record<string, BridgeConfig> = {
  'beam': {
    id: 'beam',
    name: 'Beam Bridge',
    category: 'Short to Medium Span Structures',
    spanRange: '10 – 80 meters',
    baselineUnitsDisplay: 20,
    tagline: 'Classic Girder & Pier Support Architecture',
    description: 'Highway overpasses, short river crossings, urban railway spans (10m - 80m). Stress is dominated by vertical bending moment at mid-span and shear stress at supports.',
    constructionDuration: '6 to 18 months',
    typicalMaterials: ['Prestressed Concrete', 'Structural Steel I-Beams', 'Reinforced Concrete Piers'],
    typicalLifespan: '50 – 75 Years',
    commonFailureModes: [
      'Mid-span flexural cracking under overload',
      'Pier foundation scour & settlement',
      'Fatigue in steel flange welded joints'
    ],
    applications: ['Highway Overpasses', 'Short River Crossings', 'Elevated Railway Sections'],
    nodes: [
      {
        id: 'B1',
        code: 'B1',
        name: 'Mid-Span Girder (Node A)',
        roleTag: 'Node A (Mid-Span)',
        nodeTypeId: 'S-Node',
        mcuModel: 'STM32F429ZI',
        sensors: ['Wheatstone Strain Gauge + HX711 (24-bit ADC)', 'MPU6050 (3-Axis IMU)', 'BME280 (Temp/Hum)'],
        purpose: 'Monitors maximum bending micro-strain, fatigue accumulation, and deck temperature expansion.',
        locationDescription: 'Bottom flange at center of main span (maximum bending moment zone)',
        position3D: [0, -0.4, 0],
        baselines: { vibrationRms: 0.12, strainMicro: 210, temperature: 24.5 },
        warningThresholds: { vibrationRms: 0.35, strainMicro: 450 },
        criticalThresholds: { vibrationRms: 0.65, strainMicro: 700 }
      },
      {
        id: 'B2',
        code: 'B2',
        name: 'Pier Bearing Pad (Node B)',
        roleTag: 'Node B (Support)',
        nodeTypeId: 'V-Node',
        mcuModel: 'STM32F411RE',
        sensors: ['MPU6050 (3-Axis Accelerometer)', 'BME280 (Temp/Pressure/Hum)'],
        purpose: 'Detects elastomeric bearing wear, shear settlement, and high-frequency support chatter.',
        locationDescription: 'Girder seating directly above left elastomeric bearing pad',
        position3D: [-3.6, -0.3, 0.4],
        baselines: { vibrationRms: 0.08, strainMicro: 85, temperature: 23.8 },
        warningThresholds: { vibrationRms: 0.28, strainMicro: 220 },
        criticalThresholds: { vibrationRms: 0.50, strainMicro: 400 }
      },
      {
        id: 'B3',
        code: 'B3',
        name: 'Sub-structure Pier Node',
        roleTag: 'Node C (Pier)',
        nodeTypeId: 'L-Node',
        mcuModel: 'STM32L432KC',
        sensors: ['LSM6DS3 Low-Power IMU', 'BME280 Sensor'],
        purpose: 'Monitors pier foundation settlement, riverbed scour, and tilt angle.',
        locationDescription: 'Concrete pier cap wall near water line',
        position3D: [-3.8, -2.2, -0.4],
        baselines: { vibrationRms: 0.04, strainMicro: 40, temperature: 21.0 },
        warningThresholds: { vibrationRms: 0.18, strainMicro: 120 },
        criticalThresholds: { vibrationRms: 0.38, strainMicro: 250 }
      },
      {
        id: 'B4',
        code: 'B4',
        name: 'Deck Surface Node',
        roleTag: 'Node D (Deck)',
        nodeTypeId: 'V-Node',
        mcuModel: 'STM32F411RE',
        sensors: ['MPU6050 (High-G IMU)', 'BME280 (Ambient)'],
        purpose: 'Tracks traffic-induced impact vibration, vehicle speed signatures, and pavement roughness.',
        locationDescription: 'Top deck slab centerline at 3/4 span location',
        position3D: [2.5, 0.25, 0],
        baselines: { vibrationRms: 0.15, strainMicro: 150, temperature: 26.0 },
        warningThresholds: { vibrationRms: 0.42, strainMicro: 350 },
        criticalThresholds: { vibrationRms: 0.75, strainMicro: 600 }
      }
    ]
  },
  'arch': {
    id: 'arch',
    name: 'Arch Bridge',
    category: 'Medium to Long Compression Structures',
    spanRange: '50 – 300 meters',
    baselineUnitsDisplay: 22,
    tagline: 'Compressive Curve Structural Rib Architecture',
    description: 'Valleys, deep gorges, historical urban waterways (50m - 300m). Arch bridges carry loads primarily through axial compression forces along the curved rib.',
    constructionDuration: '18 to 36 months',
    typicalMaterials: ['Structural Steel Box Ribs', 'High-Strength Cast Concrete', 'Granite Masonry Abutments'],
    typicalLifespan: '100+ Years',
    commonFailureModes: [
      'Arch crown crushing or micro-buckling under overload',
      'Abutment sliding & rotation due to horizontal thrust',
      'Spandrel column joint shear'
    ],
    applications: ['Deep Canyon Crossings', 'Scenic River Valley Bridges', 'Heavy Freight Rail Arches'],
    nodes: [
      {
        id: 'A1',
        code: 'A1',
        name: 'Arch Apex (Crown Node A)',
        roleTag: 'Node A (Crown)',
        nodeTypeId: 'S-Node',
        mcuModel: 'STM32H743VI',
        sensors: ['Multi-Direction Strain Gauges + HX711', 'MPU6050 (IMU)', 'BME280 (Temp/Hum)'],
        purpose: 'Detects micro-cracking, abnormal axial compression/tension reversal at apex of the arch.',
        locationDescription: 'Highest apex point of main steel arch rib (Crown)',
        position3D: [0, 2.6, 0],
        baselines: { vibrationRms: 0.10, strainMicro: 340, temperature: 25.0 },
        warningThresholds: { vibrationRms: 0.32, strainMicro: 600 },
        criticalThresholds: { vibrationRms: 0.60, strainMicro: 900 }
      },
      {
        id: 'A2',
        code: 'A2',
        name: 'Springing Line Abutment (Node B)',
        roleTag: 'Node B (Abutment)',
        nodeTypeId: 'S-Node',
        mcuModel: 'STM32F429ZI',
        sensors: ['Wheatstone Strain Gauges', 'MPU6050 (3-Axis IMU)', 'BME280 Sensor'],
        purpose: 'Tracks thrust support settlement, rib rotation, and load transfer to abutments.',
        locationDescription: 'Base connection where arch rib springs from concrete abutment',
        position3D: [-3.8, -1.2, 0.4],
        baselines: { vibrationRms: 0.07, strainMicro: 280, temperature: 21.5 },
        warningThresholds: { vibrationRms: 0.25, strainMicro: 520 },
        criticalThresholds: { vibrationRms: 0.48, strainMicro: 800 }
      },
      {
        id: 'A3',
        code: 'A3',
        name: 'Deck Mid-span Node',
        roleTag: 'Node C (Deck)',
        nodeTypeId: 'V-Node',
        mcuModel: 'STM32F411RE',
        sensors: ['MPU6050 (3-Axis IMU)', 'BME280 Sensor'],
        purpose: 'Monitors live vehicle traffic vibration and relative motion between suspended deck and arch.',
        locationDescription: 'Center suspended deck platform',
        position3D: [0, 0.1, 0],
        baselines: { vibrationRms: 0.14, strainMicro: 180, temperature: 26.2 },
        warningThresholds: { vibrationRms: 0.40, strainMicro: 380 },
        criticalThresholds: { vibrationRms: 0.70, strainMicro: 620 }
      },
      {
        id: 'A4',
        code: 'A4',
        name: 'Abutment Thrust Node',
        roleTag: 'Node D (Footing)',
        nodeTypeId: 'L-Node',
        mcuModel: 'STM32L432KC',
        sensors: ['Low-Power IMU', 'BME280 Environmental'],
        purpose: 'Monitors foundation movement, embankment sliding, and thermal ground shifts.',
        locationDescription: 'Anchored into main concrete abutment footing block',
        position3D: [4.2, -2.4, -0.4],
        baselines: { vibrationRms: 0.03, strainMicro: 50, temperature: 19.8 },
        warningThresholds: { vibrationRms: 0.15, strainMicro: 150 },
        criticalThresholds: { vibrationRms: 0.32, strainMicro: 280 }
      }
    ]
  },
  'truss': {
    id: 'truss',
    name: 'Truss Bridge',
    category: 'Medium to Heavy Duty Frameworks',
    spanRange: '100 – 500 meters',
    baselineUnitsDisplay: 25,
    tagline: 'Triangular Strut Lattice Load Distribution',
    description: 'Heavy rail freight lines, wide river crossings, mountain gorges (100m - 500m). Truss structures distribute heavy loads across connected triangular elements.',
    constructionDuration: '14 to 30 months',
    typicalMaterials: ['ASTM A572 Grade 50 Steel', 'Gusset Plate Connections', 'High-Strength Structural Rivets/Bolts'],
    typicalLifespan: '75 – 100 Years',
    commonFailureModes: [
      'Gusset plate connection distortion',
      'Fatigue cracking in tension diagonals under overload',
      'Member buckling & rivet corrosion'
    ],
    applications: ['Heavy Cargo Railway Bridges', 'Long River Highway Trusses', 'Industrial Haul Corridors'],
    nodes: [
      {
        id: 'T1',
        code: 'T1',
        name: 'Critical Diagonal Member (Node A)',
        roleTag: 'Node A (Diagonal)',
        nodeTypeId: 'S-Node',
        mcuModel: 'STM32F429ZI',
        sensors: ['Strain Gauge Array + HX711', 'MPU6050 IMU', 'BME280 Sensor'],
        purpose: 'Fatigue cycle monitoring in high-stress tension/compression diagonal member.',
        locationDescription: 'Mid-height of central diagonal web truss member',
        position3D: [-0.5, 0.8, 0.5],
        baselines: { vibrationRms: 0.16, strainMicro: 310, temperature: 24.0 },
        warningThresholds: { vibrationRms: 0.45, strainMicro: 580 },
        criticalThresholds: { vibrationRms: 0.80, strainMicro: 850 }
      },
      {
        id: 'T2',
        code: 'T2',
        name: 'Joint / Gusset Plate (Node B)',
        roleTag: 'Node B (Gusset)',
        nodeTypeId: 'V-Node',
        mcuModel: 'STM32F411RE',
        sensors: ['MPU6050 (High Frequency IMU)', 'Simulated Acoustic Emission Sensor'],
        purpose: 'Detects bolt loosening and joint fretting wear via shift in structural resonance.',
        locationDescription: 'Lower chord main gusset plate joint assembly',
        position3D: [1.8, -0.4, 0.5],
        baselines: { vibrationRms: 0.11, strainMicro: 140, temperature: 23.5 },
        warningThresholds: { vibrationRms: 0.36, strainMicro: 320 },
        criticalThresholds: { vibrationRms: 0.65, strainMicro: 550 }
      },
      {
        id: 'T3',
        code: 'T3',
        name: 'Support Bearing Node',
        roleTag: 'Node C (Support)',
        nodeTypeId: 'V-Node',
        mcuModel: 'STM32F411RE',
        sensors: ['MPU6050 (3-Axis IMU)', 'BME280 Sensor'],
        purpose: 'Tracks expansion roller bearing motion, binding, and support settlement.',
        locationDescription: 'Rocker/roller bearing interface at left pier top',
        position3D: [-4.0, -0.6, 0.5],
        baselines: { vibrationRms: 0.09, strainMicro: 90, temperature: 22.0 },
        warningThresholds: { vibrationRms: 0.30, strainMicro: 240 },
        criticalThresholds: { vibrationRms: 0.52, strainMicro: 420 }
      },
      {
        id: 'T4',
        code: 'T4',
        name: 'Pier Foundation Node',
        roleTag: 'Node D (Pier)',
        nodeTypeId: 'L-Node',
        mcuModel: 'STM32L432KC',
        sensors: ['Ultra-Low Power IMU', 'BME280 Sensor'],
        purpose: 'Monitors underwater caisson pier tilt, scour, and seismic ground motion.',
        locationDescription: 'Reinforced concrete pier cap base',
        position3D: [4.0, -2.5, -0.5],
        baselines: { vibrationRms: 0.04, strainMicro: 45, temperature: 20.2 },
        warningThresholds: { vibrationRms: 0.18, strainMicro: 140 },
        criticalThresholds: { vibrationRms: 0.35, strainMicro: 260 }
      }
    ]
  },
  'cantilever': {
    id: 'cantilever',
    name: 'Cantilever Bridge',
    category: 'Balanced High-Moment Structures',
    spanRange: '150 – 550 meters',
    baselineUnitsDisplay: 28,
    tagline: 'Balanced Arm Counterweight Structure',
    description: 'Balanced cantilever spans, deep river channels (150m - 550m). Cantilever bridges feature anchor arms and cantilever arms protruding outward from main towers.',
    constructionDuration: '24 to 48 months',
    typicalMaterials: ['High-Yield Structural Alloy Steel', 'Heavy Pin-Connected Joints', 'Prestressed Concrete Caissons'],
    typicalLifespan: '80 – 120 Years',
    commonFailureModes: [
      'Tension arm member overload at extreme fiber',
      'Pin-joint corrosion seizure & fracture',
      'Expansion joint binding'
    ],
    applications: ['Wide Deep Navigation Channels', 'Heavy Freight Railway Bridges', 'Multi-lane Highway Estuary Crossings'],
    nodes: [
      {
        id: 'C1',
        code: 'C1',
        name: 'Free Arm Tip (Node A)',
        roleTag: 'Node A (Free Tip)',
        nodeTypeId: 'S-Node',
        mcuModel: 'STM32H743VI',
        sensors: ['Wheatstone Strain Gauges', 'MPU6050 IMU', 'BME280 Sensor'],
        purpose: 'Tracks maximum vertical deflection amplitude, tip sway oscillation, and peak outer fiber strain.',
        locationDescription: 'Tip extremity of cantilever arm where suspended span connects',
        position3D: [0, 0.4, 0.4],
        baselines: { vibrationRms: 0.18, strainMicro: 380, temperature: 25.5 },
        warningThresholds: { vibrationRms: 0.48, strainMicro: 680 },
        criticalThresholds: { vibrationRms: 0.85, strainMicro: 1050 }
      },
      {
        id: 'C2',
        code: 'C2',
        name: 'Anchor Arm Pier Bearing (Node B)',
        roleTag: 'Node B (Pier Root)',
        nodeTypeId: 'S-Node',
        mcuModel: 'STM32F429ZI',
        sensors: ['Strain Gauge Array + HX711', 'MPU6050 IMU', 'BME280 Sensor'],
        purpose: 'Monitors maximum bending moment region above main pier, tracking micro-crack initiation.',
        locationDescription: 'Upper chord directly over main vertical pier support (Root)',
        position3D: [-3.2, 1.8, 0.4],
        baselines: { vibrationRms: 0.13, strainMicro: 360, temperature: 24.2 },
        warningThresholds: { vibrationRms: 0.38, strainMicro: 620 },
        criticalThresholds: { vibrationRms: 0.72, strainMicro: 950 }
      },
      {
        id: 'C3',
        code: 'C3',
        name: 'Expansion Joint Node',
        roleTag: 'Node C (Joint)',
        nodeTypeId: 'V-Node',
        mcuModel: 'STM32F411RE',
        sensors: ['MPU6050 IMU', 'Simulated Linear Displacement Sensor'],
        purpose: 'Detects expansion joint locking, thermal movement bounds, and shear misalignment.',
        locationDescription: 'Hinged expansion joint bearing at suspended span junction',
        position3D: [2.0, 0.2, 0.4],
        baselines: { vibrationRms: 0.12, strainMicro: 160, temperature: 26.8 },
        warningThresholds: { vibrationRms: 0.38, strainMicro: 340 },
        criticalThresholds: { vibrationRms: 0.68, strainMicro: 580 }
      },
      {
        id: 'C4',
        code: 'C4',
        name: 'Main Pier Footing Node',
        roleTag: 'Node D (Footing)',
        nodeTypeId: 'L-Node',
        mcuModel: 'STM32L432KC',
        sensors: ['Ultra-Low Power IMU', 'BME280 Sensor'],
        purpose: 'Monitors deep caisson foundation settlement, scour, and leaning.',
        locationDescription: 'Concrete caisson cap below water line',
        position3D: [-3.2, -2.4, -0.4],
        baselines: { vibrationRms: 0.05, strainMicro: 50, temperature: 19.5 },
        warningThresholds: { vibrationRms: 0.20, strainMicro: 150 },
        criticalThresholds: { vibrationRms: 0.40, strainMicro: 290 }
      }
    ]
  },
  'suspension': {
    id: 'suspension',
    name: 'Suspension Bridge',
    category: 'Ultra-Long Span Cable Structures',
    spanRange: '500 – 2000+ meters',
    baselineUnitsDisplay: 30,
    tagline: 'Main Cable Catenary & Deck Hanger System',
    description: 'Long oceanic straits, deep sea bays, long-span corridors (500m - 2000m+). Suspension bridges span vast distances using high-tensile steel main cables draped over tall towers.',
    constructionDuration: '36 to 72 months',
    typicalMaterials: ['Galvanized High-Tensile Steel Wire Cables', 'Aerodynamic Steel Box Girders', 'Massive Gravity Anchor Blocks'],
    typicalLifespan: '100 – 150 Years',
    commonFailureModes: [
      'Wind-induced flutter & vortex shedding buffeting',
      'Main cable wire corrosion fatigue',
      'Tower top saddle binding'
    ],
    applications: ['Major Oceanic Strait Crossings', 'Wide Sea Bay Bridges', 'Iconic Long-Span Corridors'],
    nodes: [
      {
        id: 'SUS1',
        code: 'SUS1',
        name: 'Main Cable Mid-Span (Node A)',
        roleTag: 'Node A (Cable Center)',
        nodeTypeId: 'S-Node',
        mcuModel: 'STM32H743VI',
        sensors: ['High-G Accelerometer (Cable Modal)', 'Simulated Tensometer', 'BME280 Sensor'],
        purpose: 'Detects cable tension loss, wind-induced galloping/flutter, and acoustic wire breaks.',
        locationDescription: 'Lowest dip point of main catenary cable at center span',
        position3D: [0, 1.2, 1.2],
        baselines: { vibrationRms: 0.22, strainMicro: 420, temperature: 25.0 },
        warningThresholds: { vibrationRms: 0.55, strainMicro: 750 },
        criticalThresholds: { vibrationRms: 0.95, strainMicro: 1150 }
      },
      {
        id: 'SUS2',
        code: 'SUS2',
        name: 'Main Tower Saddle Apex (Node B)',
        roleTag: 'Node B (Tower Saddle)',
        nodeTypeId: 'S-Node',
        mcuModel: 'STM32F429ZI',
        sensors: ['MPU6050 IMU', 'Simulated Tension Sensor', 'BME280 Sensor'],
        purpose: 'Compares cable behavior near rigid saddle support versus flexible mid-span.',
        locationDescription: 'Main cable seating saddle atop left main tower',
        position3D: [-3.8, 3.7, 1.2],
        baselines: { vibrationRms: 0.15, strainMicro: 350, temperature: 23.8 },
        warningThresholds: { vibrationRms: 0.42, strainMicro: 620 },
        criticalThresholds: { vibrationRms: 0.78, strainMicro: 920 }
      },
      {
        id: 'SUS3',
        code: 'SUS3',
        name: 'Tower Top Sway Node',
        roleTag: 'Node C (Tower Crest)',
        nodeTypeId: 'V-Node',
        mcuModel: 'STM32F429ZI',
        sensors: ['MPU6050 (Precision 3-Axis IMU)', 'Simulated Ultrasonic Anemometer', 'BME280'],
        purpose: 'Tracks high-altitude tower top wind sway, tilt, and vortex shedding response.',
        locationDescription: 'Cross-beam crest between left tower legs',
        position3D: [-3.8, 3.8, 0],
        baselines: { vibrationRms: 0.19, strainMicro: 220, temperature: 22.0 },
        warningThresholds: { vibrationRms: 0.50, strainMicro: 450 },
        criticalThresholds: { vibrationRms: 0.88, strainMicro: 720 }
      },
      {
        id: 'SUS4',
        code: 'SUS4',
        name: 'Deck Mid-span Node',
        roleTag: 'Node D (Deck Center)',
        nodeTypeId: 'S-Node',
        mcuModel: 'STM32F429ZI',
        sensors: ['Strain Gauge Array + HX711', 'MPU6050 IMU', 'BME280 Sensor'],
        purpose: 'Monitors traffic & wind-induced deck torsional twisting, bending, and vertical heave.',
        locationDescription: 'Aerodynamic deck box girder center point',
        position3D: [0, -0.2, 0],
        baselines: { vibrationRms: 0.20, strainMicro: 390, temperature: 26.5 },
        warningThresholds: { vibrationRms: 0.52, strainMicro: 700 },
        criticalThresholds: { vibrationRms: 0.90, strainMicro: 1080 }
      },
      {
        id: 'SUS5',
        code: 'SUS5',
        name: 'Anchorage Block Node',
        roleTag: 'Node E (Anchorage)',
        nodeTypeId: 'L-Node',
        mcuModel: 'STM32L432KC',
        sensors: ['Ultra-Low Power IMU', 'Corrosion/Humidity Probe', 'BME280'],
        purpose: 'Tracks concrete anchorage block sliding motion, cable strand corrosion environment.',
        locationDescription: 'Inside gravity anchor chamber at shore connection',
        position3D: [-6.5, -1.8, 1.2],
        baselines: { vibrationRms: 0.03, strainMicro: 60, temperature: 18.5 },
        warningThresholds: { vibrationRms: 0.16, strainMicro: 180 },
        criticalThresholds: { vibrationRms: 0.32, strainMicro: 320 }
      }
    ]
  },
  'cable-stayed': {
    id: 'cable-stayed',
    name: 'Cable-Stayed Bridge',
    category: 'Modern Efficient Cable Structures',
    spanRange: '200 – 1100 meters',
    baselineUnitsDisplay: 26,
    tagline: 'Direct Diagonal Stay Cable Support Fan',
    description: 'Harbor entrances, wide urban rivers, high-speed rail bridges (200m - 1100m). Cable-stayed bridges use multiple diagonal stays anchored directly to rigid towers.',
    constructionDuration: '24 to 48 months',
    typicalMaterials: ['Parallel Steel Wire Stay Strands', 'Prestressed Concrete Deck Girders', 'Slip-Formed Concrete Pylons'],
    typicalLifespan: '80 – 120 Years',
    commonFailureModes: [
      'Stay cable rain-wind vibration fatigue',
      'Stay anchorage dampener degradation',
      'Pylon bending under unbalanced live load'
    ],
    applications: ['Harbor Entrance Channels', 'Wide Urban River Crossings', 'High-Speed Rail Bridges'],
    nodes: [
      {
        id: 'CS1',
        code: 'CS1',
        name: 'Mid-Span Deck Stay Anchor (Node A)',
        roleTag: 'Node A (Stay Anchor)',
        nodeTypeId: 'S-Node',
        mcuModel: 'STM32H743VI',
        sensors: ['Accelerometer (Modal Frequency)', 'Simulated Tension Load Cell', 'BME280'],
        purpose: 'Monitors stay cable fundamental vibration frequency, detecting loss of tension and damper failure.',
        locationDescription: 'Mid-length sheath of longest diagonal stay cable',
        position3D: [1.8, 1.6, 0.6],
        baselines: { vibrationRms: 0.17, strainMicro: 360, temperature: 24.8 },
        warningThresholds: { vibrationRms: 0.46, strainMicro: 650 },
        criticalThresholds: { vibrationRms: 0.82, strainMicro: 980 }
      },
      {
        id: 'CS2',
        code: 'CS2',
        name: 'Tower Pylon Crest (Node B)',
        roleTag: 'Node B (Pylon Crest)',
        nodeTypeId: 'V-Node',
        mcuModel: 'STM32F429ZI',
        sensors: ['MPU6050 (3-Axis IMU)', 'Simulated Anemometer', 'BME280 Sensor'],
        purpose: 'Tracks pylon sway under lateral wind forces and unbalanced cable pull.',
        locationDescription: 'Top apex of main concrete A-frame pylon',
        position3D: [0, 3.8, 0],
        baselines: { vibrationRms: 0.14, strainMicro: 240, temperature: 22.5 },
        warningThresholds: { vibrationRms: 0.40, strainMicro: 480 },
        criticalThresholds: { vibrationRms: 0.75, strainMicro: 750 }
      },
      {
        id: 'CS3',
        code: 'CS3',
        name: 'Deck Near Pylon Node',
        roleTag: 'Node C (Pylon Base)',
        nodeTypeId: 'S-Node',
        mcuModel: 'STM32F429ZI',
        sensors: ['Wheatstone Strain Gauges', 'MPU6050 IMU', 'BME280 Sensor'],
        purpose: 'Monitors high-stress compression zone where stay forces transfer into deck slab near pylon base.',
        locationDescription: 'Deck girder adjacent to pylon foundation',
        position3D: [0.6, -0.2, 0.4],
        baselines: { vibrationRms: 0.12, strainMicro: 310, temperature: 25.8 },
        warningThresholds: { vibrationRms: 0.38, strainMicro: 560 },
        criticalThresholds: { vibrationRms: 0.68, strainMicro: 860 }
      },
      {
        id: 'CS4',
        code: 'CS4',
        name: 'Deck Mid-span Node',
        roleTag: 'Node D (Deck Mid)',
        nodeTypeId: 'V-Node',
        mcuModel: 'STM32F411RE',
        sensors: ['MPU6050 IMU', 'BME280 Sensor'],
        purpose: 'Tracks general deck vibration, traffic bounce, and longitudinal expansion.',
        locationDescription: 'Center midpoint of deck between towers',
        position3D: [3.2, -0.2, 0],
        baselines: { vibrationRms: 0.16, strainMicro: 230, temperature: 26.2 },
        warningThresholds: { vibrationRms: 0.44, strainMicro: 440 },
        criticalThresholds: { vibrationRms: 0.78, strainMicro: 700 }
      },
      {
        id: 'CS5',
        code: 'CS5',
        name: 'Pylon Pier Foundation Node',
        roleTag: 'Node E (Foundation)',
        nodeTypeId: 'L-Node',
        mcuModel: 'STM32L432KC',
        sensors: ['Low-Power IMU', 'BME280 Environmental'],
        purpose: 'Monitors deep pile foundation settlement, scour around pylon base, and tilt.',
        locationDescription: 'Submerged pylon footing cap block',
        position3D: [0, -2.4, 0],
        baselines: { vibrationRms: 0.04, strainMicro: 45, temperature: 20.0 },
        warningThresholds: { vibrationRms: 0.17, strainMicro: 140 },
        criticalThresholds: { vibrationRms: 0.34, strainMicro: 270 }
      }
    ]
  }
};
