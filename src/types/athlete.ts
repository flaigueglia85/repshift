export type Locale = 'en' | 'it';
export type UnitSystem = 'metric' | 'imperial';

export interface AthleteProfile {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  preferredName: string;
  displayName: string;
  birthDate: string;
  heightCm: number | null;
  bodyWeightKg: number | null;
  locale: Locale;
  unitSystem: UnitSystem;
  createdAt: string;
  updatedAt: string;
  schemaVersion: number;
  revision: number;
  syncState: 'local';
}

export type AthleteProfileDraft = Omit<
  AthleteProfile,
  'id' | 'createdAt' | 'updatedAt' | 'schemaVersion' | 'revision' | 'syncState'
>;
