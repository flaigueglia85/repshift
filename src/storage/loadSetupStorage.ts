import type { LoadSetupProfile, MachineLoadConfig, PlateInventoryItem, PlateSolution } from '../types/loadSetup';

const LOAD_SETUP_KEY = 'repshift.loadSetup.v1';

export const defaultPlates: PlateInventoryItem[] = [
  { weightKg: 20, quantity: 4 },
  { weightKg: 10, quantity: 4 },
  { weightKg: 5, quantity: 4 },
  { weightKg: 2.5, quantity: 4 },
  { weightKg: 1.25, quantity: 4 },
];

export function loadLoadSetup(): LoadSetupProfile | null {
  try {
    const raw = localStorage.getItem(LOAD_SETUP_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LoadSetupProfile & { machineIncrementKg?: number; schemaVersion?: number };

    if (parsed.schemaVersion === 2) return parsed;
    if (parsed.schemaVersion === 1) {
      return {
        ...parsed,
        machineConfigs: [],
        cableIncrementKg: parsed.cableIncrementKg ?? 2.5,
        schemaVersion: 2,
      } as LoadSetupProfile;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveLoadSetup(
  draft: Omit<LoadSetupProfile, 'id' | 'createdAt' | 'updatedAt' | 'revision' | 'schemaVersion'>,
  current?: LoadSetupProfile | null,
): LoadSetupProfile {
  const now = new Date().toISOString();
  const next: LoadSetupProfile = {
    ...draft,
    id: current?.id ?? crypto.randomUUID(),
    createdAt: current?.createdAt ?? now,
    updatedAt: now,
    revision: (current?.revision ?? 0) + 1,
    schemaVersion: 2,
  };
  localStorage.setItem(LOAD_SETUP_KEY, JSON.stringify(next));
  return next;
}

export function createMachineConfig(
  equipmentId: string,
  loadingMode: MachineLoadConfig['loadingMode'],
): MachineLoadConfig {
  return {
    equipmentId,
    loadingMode,
    incrementKg: loadingMode === 'plate_loaded' ? 5 : 5,
    startingResistanceKg: 0,
  };
}

export function calculatePlateSolution(targetKg: number, barbellWeightKg: number, plates: PlateInventoryItem[]): PlateSolution {
  const targetPerSide = Math.max(0, (targetKg - barbellWeightKg) / 2);
  const available = plates
    .filter((plate) => plate.quantity >= 2)
    .sort((a, b) => b.weightKg - a.weightKg)
    .flatMap((plate) => Array(Math.floor(plate.quantity / 2)).fill(plate.weightKg));

  const perSide: number[] = [];
  let remaining = targetPerSide;
  available.forEach((weight) => {
    if (weight <= remaining + 0.0001) {
      perSide.push(weight);
      remaining -= weight;
    }
  });

  const achievedKg = barbellWeightKg + perSide.reduce((sum, weight) => sum + weight * 2, 0);
  return { perSide, achievedKg, differenceKg: Math.round((targetKg - achievedKg) * 100) / 100 };
}
