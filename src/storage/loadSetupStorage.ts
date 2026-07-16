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
    const parsed = JSON.parse(raw) as LoadSetupProfile & { machineIncrementKg?: number; schemaVersion?: number; adjustableDumbbellHandleKg?: number };

    if (parsed.schemaVersion === 3) return parsed;
    if (parsed.schemaVersion === 1 || parsed.schemaVersion === 2) {
      return {
        ...parsed,
        machineConfigs: parsed.machineConfigs ?? [],
        cableIncrementKg: parsed.cableIncrementKg ?? 2.5,
        adjustableDumbbellHandleKg: parsed.adjustableDumbbellHandleKg ?? 2.5,
        schemaVersion: 3,
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
    schemaVersion: 3,
  };
  localStorage.setItem(LOAD_SETUP_KEY, JSON.stringify(next));
  return next;
}

export function createMachineConfig(equipmentId: string, loadingMode: MachineLoadConfig['loadingMode']): MachineLoadConfig {
  return { equipmentId, loadingMode, incrementKg: 5, startingResistanceKg: 0 };
}

function calculateSymmetricLoad(targetKg: number, baseWeightKg: number, plates: PlateInventoryItem[], requiredCopiesPerPlate: number): PlateSolution {
  const targetPerSide = Math.max(0, (targetKg - baseWeightKg) / 2);
  const available = plates
    .filter((plate) => plate.quantity >= requiredCopiesPerPlate)
    .sort((a, b) => b.weightKg - a.weightKg)
    .flatMap((plate) => Array(Math.floor(plate.quantity / requiredCopiesPerPlate)).fill(plate.weightKg));

  const perSide: number[] = [];
  let remaining = targetPerSide;
  available.forEach((weight) => {
    if (weight <= remaining + 0.0001) {
      perSide.push(weight);
      remaining -= weight;
    }
  });

  const achievedKg = baseWeightKg + perSide.reduce((sum, weight) => sum + weight * 2, 0);
  return { perSide, achievedKg, differenceKg: Math.round((targetKg - achievedKg) * 100) / 100 };
}

export function calculatePlateSolution(targetKg: number, barbellWeightKg: number, plates: PlateInventoryItem[]): PlateSolution {
  return calculateSymmetricLoad(targetKg, barbellWeightKg, plates, 2);
}

export function calculateDumbbellPlateSolution(targetPerDumbbellKg: number, handleWeightKg: number, plates: PlateInventoryItem[]): PlateSolution {
  return calculateSymmetricLoad(targetPerDumbbellKg, handleWeightKg, plates, 4);
}
