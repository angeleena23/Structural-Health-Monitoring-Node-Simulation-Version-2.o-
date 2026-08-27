export interface SensorNodeTemplate {
  id: 'V-Node' | 'S-Node' | 'L-Node';
  name: string;
  tagline: string;
  typicalUses: string[];
  mcu: {
    model: string;
    series: string;
    core: string;
    clockSpeed: string;
    flashRam: string;
    reasons: string[];
  };
  sensors: {
    name: string;
    protocol: string;
    purpose: string;
  }[];
  comms: {
    module: string;
    protocol: string;
    range: string;
  };
  power: {
    source: string;
    consumption: string;
    mode: string;
  };
  keyFunctions: string[];
  blockDiagramSteps: {
    source: string;
    bus: string;
    target: string;
    description: string;
  }[];
}

export const NODE_TEMPLATES: Record<string, SensorNodeTemplate> = {
  'V-Node': {
    id: 'V-Node',
    name: 'Vibration + Environment Node',
    tagline: 'High-frequency structural motion and environmental telemetry node',
    typicalUses: ['Bridge Deck', 'Girder Sections', 'Support Piers', 'Tower Walls'],
    mcu: {
      model: 'STM32F411RE',
      series: 'STM32F4 High-Performance Series',
      core: 'ARM Cortex-M4 with FPU',
      clockSpeed: '100 MHz',
      flashRam: '512 KB Flash / 128 KB RAM',
      reasons: [
        'Integrated Hardware Floating Point Unit (FPU) for real-time DSP',
        'Multi-channel I2C and SPI buses for concurrent sensor reads',
        'Cost-effective mainstream standard for wide structural deployment'
      ]
    },
    sensors: [
      { name: 'MPU6050', protocol: 'I2C (400 kHz Fast Mode)', purpose: '3-Axis Accelerometer + Gyroscope for vibration RMS & peak detection' },
      { name: 'BME280', protocol: 'I2C (Address 0x76)', purpose: 'Ambient Temperature, Humidity, and Barometric Pressure' },
      { name: 'SW-420 / Piezo', protocol: 'GPIO / ADC Interrupt', purpose: 'Instantaneous shock & impact impulse trigger' }
    ],
    comms: {
      module: 'ESP-01 / ESP32 or SX1276 LoRa',
      protocol: 'UART (AT commands) or SPI',
      range: '100m (Wi-Fi) / Up to 10km (LoRa sub-GHz)'
    },
    power: {
      source: '5V USB Lab / 3.7V LiFePO4 with 2W Solar Panel',
      consumption: '~45 mA continuous active mode',
      mode: 'Continuous 100-200 Hz Sampling'
    },
    keyFunctions: [
      'Continuous 100–200 Hz accelerometer sampling via DMA / Timer interrupt',
      'Real-time windowed Root Mean Square (RMS) & Peak acceleration math',
      'Local threshold comparison & emergency buzzer/LED GPIO activation',
      'Time-stamped telemetry packet payload framing & UART transmit'
    ],
    blockDiagramSteps: [
      { source: 'MPU6050 IMU', bus: 'I2C Bus 1', target: 'STM32F411RE MCU', description: 'Raw 3-axis acceleration stream @ 200 Hz' },
      { source: 'BME280 Sensor', bus: 'I2C Bus 2', target: 'STM32F411RE MCU', description: 'Environmental metrics sampled @ 1 Hz' },
      { source: 'STM32F411RE MCU', bus: 'UART 2 / SPI', target: 'Wireless Gateway', description: 'Filtered RMS vibration & status frame payload' }
    ]
  },
  'S-Node': {
    id: 'S-Node',
    name: 'Strain-Critical Structural Node',
    tagline: '24-bit high-precision micro-strain deformation & fatigue analyzer',
    typicalUses: ['Mid-Span Girders', 'Arch Crown', 'Critical Truss Members', 'Cable Anchorages'],
    mcu: {
      model: 'STM32F429ZI / STM32H743VI',
      series: 'STM32F4 / STM32H7 Advanced DSP Series',
      core: 'ARM Cortex-M4 / Cortex-M7 with FPU',
      clockSpeed: '180 MHz / 480 MHz',
      flashRam: '2 MB Flash / 1 MB RAM',
      reasons: [
        'Ultra-fast DSP execution for high-resolution strain waveform analysis',
        'Dedicated FMC bus and dual 24-bit ADC timing support',
        'Large SRAM headroom for storing cumulative fatigue cycle histograms'
      ]
    },
    sensors: [
      { name: 'Wheatstone Strain Gauges', protocol: 'Analog Differential (4-wire)', purpose: 'Micro-strain (µε) material elongation and bending stress' },
      { name: 'HX711 / ADS1232', protocol: 'SPI / 2-Wire Serial (24-bit ADC)', purpose: 'Sub-micro-strain resolution differential amplification' },
      { name: 'MPU6050', protocol: 'I2C', purpose: 'Structural tilt and 3-axis motion' },
      { name: 'BME280', protocol: 'I2C', purpose: 'Thermal expansion calibration compensation' }
    ],
    comms: {
      module: 'ESP32 Wi-Fi / Industrial LoRaWAN Module',
      protocol: 'SPI / High-Speed UART',
      range: 'Industrial Mesh Network / Long Range Gateway'
    },
    power: {
      source: '5V Regulated / Dual Solar-LiPo Backed Supply',
      consumption: '~85 mA active with Wheatstone excitation',
      mode: 'High-Precision Synchronous Sampling'
    },
    keyFunctions: [
      '24-bit differential ADC conversion of Wheatstone bridge strain voltage',
      'Rainflow-counting algorithm for cumulative structural fatigue estimation',
      'Thermal compensation calculations using BME280 surface temperature',
      'Immediate alert dispatch upon micro-strain threshold violation'
    ],
    blockDiagramSteps: [
      { source: 'Strain Gauge Bridge', bus: 'Analog Signal', target: 'HX711 24-bit ADC', description: 'Deformation voltage micro-differential signal' },
      { source: 'HX711 ADC', bus: 'SPI Interface', target: 'STM32F429/H7 MCU', description: 'High-resolution digital strain counts' },
      { source: 'MPU6050 & BME280', bus: 'I2C Bus', target: 'STM32F429/H7 MCU', description: 'Vibration & thermal compensation data' },
      { source: 'STM32F429/H7 MCU', bus: 'UART / Wireless', target: 'Gateway Box', description: 'Deformation & fatigue telemetry frame' }
    ]
  },
  'L-Node': {
    id: 'L-Node',
    name: 'Low-Power Remote Autonomous Node',
    tagline: 'Ultra-low-power, battery-solar operated long-term pier & anchorage monitor',
    typicalUses: ['Sub-structure Piers', 'Abutments', 'Remote Anchor Blocks', 'Scour Zones'],
    mcu: {
      model: 'STM32L432KC / STM32L476RG',
      series: 'STM32L4 Ultra-Low-Power Series',
      core: 'ARM Cortex-M4 with FlexPowerControl',
      clockSpeed: '80 MHz (Dynamic Scaling down to 2 MHz)',
      flashRam: '256 KB Flash / 64 KB RAM',
      reasons: [
        'Extremely low Stop/Standby current (< 300 nA with RTC retaining state)',
        'Wake-up from sleep in under 5 microseconds upon IMU shock interrupt',
        'Autonomous peripheral operation (BAM mode) reducing CPU awake time'
      ]
    },
    sensors: [
      { name: 'LSM6DS3 / Ultra-low-power IMU', protocol: 'I2C / SPI (Low-power mode)', purpose: 'Tilt angle monitoring & shock motion wake-up interrupt' },
      { name: 'BME280 / SHT31', protocol: 'I2C (Single-shot mode)', purpose: 'Periodic temperature and humidity checking' }
    ],
    comms: {
      module: 'SX1262 LoRa / BLE 5.0 Module',
      protocol: 'SPI / Low-Power UART',
      range: 'Up to 15 km Line-of-Sight'
    },
    power: {
      source: '3.6V Primary Lithium Thionyl Battery or Small 0.5W Solar Cell',
      consumption: 'Average < 50 µA in sleep/duty cycle',
      mode: 'Duty-Cycled Sleep with Shock Interrupt'
    },
    keyFunctions: [
      'Deep sleep (Stop 2 mode) for 99% of operating operational lifetime',
      'Wake on internal RTC timer every 15–60 minutes for periodic heartbeat',
      'Hardware interrupt wake-on-motion when structural tilt/vibration exceeds 0.05g',
      'Ultra-compact binary LoRaWAN packet transmission before returning to sleep'
    ],
    blockDiagramSteps: [
      { source: 'Low-Power IMU', bus: 'GPIO Interrupt', target: 'STM32L432KC MCU', description: 'Motion threshold shock interrupt triggers MCU wake' },
      { source: 'BME280 Sensor', bus: 'I2C Single Shot', target: 'STM32L432KC MCU', description: 'Quick thermal & humidity metric read' },
      { source: 'STM32L432KC MCU', bus: 'SPI Bus', target: 'SX1262 LoRa Radio', description: 'Transmit compact LoRa packet and re-enter Stop mode' }
    ]
  }
};
