import { BRIDGES_CONFIG, BridgeConfig, SensorNodeConfig } from '../config/bridges.config';

export type BridgeSpec = BridgeConfig;
export type BridgeNode = SensorNodeConfig;

export const BRIDGES = BRIDGES_CONFIG;
