export interface PlateInventoryItem {
  weightKg: number;
  quantity: number;
}

export interface LoadSetupProfile {
  id: string;
  barbellWeightKg: number;
  plates: PlateInventoryItem[];
  dumbbellMode: 'fixed' | 'adjustable' | 'both';
  dumbbellStepKg: number;
  maxDumbbellKg: number;
  machineIncrementKg: number;
  cableIncrementKg: number;
  createdAt: string;
  updatedAt: string;
  revision: number;
  schemaVersion: 1;
}

export interface PlateSolution {
  perSide: number[];
  achievedKg: number;
  differenceKg: number;
}
