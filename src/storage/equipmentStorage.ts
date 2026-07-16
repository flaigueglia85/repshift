import type { EquipmentProfile } from '../types/equipment';

const EQUIPMENT_KEY = 'repshift.equipmentProfile.v1';

export function loadEquipmentProfile(): EquipmentProfile | null {
  try {
    const raw = localStorage.getItem(EQUIPMENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as EquipmentProfile;
    if (parsed.schemaVersion !== 1 || !parsed.id || !Array.isArray(parsed.selectedEquipmentIds)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveEquipmentProfile(
  selectedEquipmentIds: string[],
  environment: EquipmentProfile['environment'],
  current?: EquipmentProfile | null,
): EquipmentProfile {
  const now = new Date().toISOString();
  const profile: EquipmentProfile = {
    id: current?.id ?? crypto.randomUUID(),
    selectedEquipmentIds,
    environment,
    createdAt: current?.createdAt ?? now,
    updatedAt: now,
    schemaVersion: 1,
    revision: (current?.revision ?? 0) + 1,
  };
  localStorage.setItem(EQUIPMENT_KEY, JSON.stringify(profile));
  return profile;
}
