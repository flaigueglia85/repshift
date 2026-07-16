import type { AthleteProfile, AthleteProfileDraft, Locale } from '../types/athlete';

const PROFILE_KEY = 'repshift.athleteProfile.v1';
const LOCALE_KEY = 'repshift.locale.v1';

export function loadProfile(): AthleteProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as AthleteProfile;
    if (parsed.schemaVersion !== 1 || !parsed.id || !parsed.username) return null;

    return parsed;
  } catch {
    return null;
  }
}

export function saveProfile(draft: AthleteProfileDraft, current?: AthleteProfile | null): AthleteProfile {
  const now = new Date().toISOString();
  const profile: AthleteProfile = {
    ...draft,
    id: current?.id ?? crypto.randomUUID(),
    createdAt: current?.createdAt ?? now,
    updatedAt: now,
    schemaVersion: 1,
    revision: (current?.revision ?? 0) + 1,
    syncState: 'local',
  };

  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  saveLocale(profile.locale);
  return profile;
}

export function loadLocale(): Locale {
  const saved = localStorage.getItem(LOCALE_KEY);
  if (saved === 'it' || saved === 'en') return saved;
  return navigator.language.toLowerCase().startsWith('it') ? 'it' : 'en';
}

export function saveLocale(locale: Locale): void {
  localStorage.setItem(LOCALE_KEY, locale);
}
