export interface MCUInfo {
  id: string;
  family: string;
  core: string;
  maxClock: string;
  flash: string;
  sram: string;
  fpu: boolean;
  powerConsumption: string;
  recommendedNodes: string;
  rationale: string;
  keyPeripherals: string[];
  pros: string[];
  cons: string[];
  targetLocations: string[];
}

export const MCU_CATALOG: MCUInfo[] = [
  {
    id: 'stm32f411re',
    family: 'STM32F4 Series (Mainstream DSP)',
    core: 'ARM Cortex-M4 with Single-Precision FPU',
    maxClock: '100 MHz',
    flash: '512 KB',
    sram: '128 KB',
    fpu: true,
    powerConsumption: '100 µA/MHz in run mode',
    recommendedNodes: 'V-Node (Vibration + Environment Node)',
    rationale: 'Balanced compute performance, built-in FPU for real-time FFT/RMS acceleration processing, low bill of materials cost, and robust I2C/SPI DMA interfaces.',
    keyPeripherals: ['12-bit ADC (2.4 MSPS)', '3x I2C', '5x SPI', '3x USART', '16-bit & 32-bit Timers'],
    pros: ['FPU accelerates continuous RMS acceleration math', 'Wide Nucleo ecosystem availability', 'Cost-effective for high-density node grids'],
    cons: ['Higher power consumption than STM32L4', 'No hardware dual-core'],
    targetLocations: ['Deck Surface', 'Bearing Pads', 'Standard Girders', 'Truss Joints']
  },
  {
    id: 'stm32f429zi',
    family: 'STM32F4 Advanced Series',
    core: 'ARM Cortex-M4 with FPU & Chrom-ART',
    maxClock: '180 MHz',
    flash: '2 MB',
    sram: '256 KB',
    fpu: true,
    powerConsumption: '226 µA/MHz active',
    recommendedNodes: 'S-Node (Strain-Critical Node)',
    rationale: 'Higher clock speed and larger RAM suited for handling multi-channel 24-bit ADC strain gauges and cumulative fatigue cycle history.',
    keyPeripherals: ['Flexible Memory Controller (FMC)', '12-bit ADC (3x)', '3x SPI', '6x USART', 'Dual CAN'],
    pros: ['High RAM for local strain buffers', 'Multiple ADC channels for strain arrays', 'Integrated FMC'],
    cons: ['Higher active power requirements', 'Larger LQFP package size'],
    targetLocations: ['Mid-Span Girders', 'Arch Springing', 'Truss Diagonal Members', 'Deck Cantilever Root']
  },
  {
    id: 'stm32l432kc',
    family: 'STM32L4 Ultra-Low-Power Series',
    core: 'ARM Cortex-M4 with FlexPowerControl',
    maxClock: '80 MHz',
    flash: '256 KB',
    sram: '64 KB',
    fpu: true,
    powerConsumption: '84 µA/MHz run mode, 280 nA Stop 2 mode',
    recommendedNodes: 'L-Node (Low-Power Remote Node)',
    rationale: 'Engineered specifically for solar and long-life battery operation at isolated substructures like piers and abutments with fast sub-5µs wake times.',
    keyPeripherals: ['Low-Power UART (LPUART)', 'Low-Power Timers (LPTIM)', 'Internal ultra-low-power RC oscillator', '12-bit ADC'],
    pros: ['Sub-microamp sleep mode', 'Fast hardware interrupt wake on IMU shock', 'Compact Nucleo-32 footprint'],
    cons: ['Lower clock speed ceiling (80 MHz)', 'Limited RAM for complex DSP'],
    targetLocations: ['Sub-structure Piers', 'Abutments', 'Cable Anchor Blocks', 'Scour Zones']
  },
  {
    id: 'stm32h743vi',
    family: 'STM32H7 High-Performance Series',
    core: 'ARM Cortex-M7 with Double-Precision FPU',
    maxClock: '480 MHz',
    flash: '2 MB Dual-Bank',
    sram: '1 MB (including 128 KB TCM RAM)',
    fpu: true,
    powerConsumption: '280 µA/MHz active at full 480 MHz',
    recommendedNodes: 'S-Node (High-Performance Long-Span Critical)',
    rationale: 'Unmatched raw compute headroom (1027 DMIPS) and 1 MB RAM allowing multi-channel high-rate FFTs, edge ML anomaly detection, and long cable stay modal analysis.',
    keyPeripherals: ['Dual-precision FPU', '16-bit ADC (up to 3.6 MSPS)', 'DSP Instructions', 'HRTIM', 'FD-CAN'],
    pros: ['Double-precision FPU for precise structural modeling', '1 MB RAM for long time-series data', '480 MHz top clock'],
    cons: ['Highest unit cost', 'Requires robust heat dissipation and power supply'],
    targetLocations: ['Arch Crown', 'Suspension Main Cable Mid-Span', 'Cantilever Free Tip', 'Cable-Stayed Main Stay Cable']
  },
  {
    id: 'stm32f103c8',
    family: 'STM32F1 Mainstream ("Blue Pill")',
    core: 'ARM Cortex-M3',
    maxClock: '72 MHz',
    flash: '64 KB',
    sram: '20 KB',
    fpu: false,
    powerConsumption: '36 mA run mode @ 72 MHz',
    recommendedNodes: 'Entry-Level Lab Demo Nodes',
    rationale: 'Extremely budget-friendly entry-level option widely used in educational labs for basic tilt and vibration monitoring.',
    keyPeripherals: ['12-bit ADC', '2x I2C', '2x SPI', '3x USART', 'CAN 2.0B'],
    pros: ['Ubiquitous $2 board cost', 'Simple architecture for entry-level learning'],
    cons: ['No hardware FPU (software math slower)', 'No low-power sleep modes'],
    targetLocations: ['Educational Demos', 'Basic Auxiliary Tilt Sensors']
  }
];

export const SUMMARY_CALLOUT = "For most SHM nodes we recommend STM32F4. For battery-powered remote nodes, STM32L4. For critical high-stress locations on long-span bridges, STM32H7.";
