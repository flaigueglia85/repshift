export interface PlateInventoryItem {
  weightKg: number;
  quantity: number;
}

export type MachineLoadingMode = 'weight_stack' | 'plate_loaded';

export interface MachineLoadConfig {
  equipmentId: string;
  loadingMode: MachineLoadingMode;
  incrementKg: number;
  startingResistanceKg: number;
}

export interface LoadSetupProfile {
  id: string;
  barbellWeightKg: number;
  plates: PlateInventoryItem[];
  dumbbellMode: 'fixed' | 'adjustable' | 'both';
  dumbbellStepKg: number;
  maxDumbbellKg: number;
  adjustableDumbbellHandleKg: number;
  cableIncrementKg: number;
  machineConfigs: MachineLoadConfig[];
  createdAt: string;
  updatedAt: string;
  revision: number;
  schemaVersion: 3;
}

export interface PlateSolution {
  perSide: number[];
  achievedKg: number;
  differenceKg: number;
}
