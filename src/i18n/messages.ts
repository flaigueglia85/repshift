import type { Locale } from '../types/athlete';

export const messages = {
  en: {
    brandTagline: 'Shift your training forward.',
    welcomeTitle: 'Build your athlete profile',
    welcomeBody: 'RepShift starts locally on this device. Your profile will guide future plans, progression and coaching.',
    language: 'Language',
    username: 'Username',
    firstName: 'First name',
    lastName: 'Last name',
    preferredName: 'What should RepShift call you?',
    birthDate: 'Date of birth',
    height: 'Height (cm)',
    weight: 'Body weight (kg)',
    saveProfile: 'Create local profile',
    updateProfile: 'Save changes',
    required: 'This field is required.',
    invalidUsername: 'Use 3–20 letters, numbers or underscores.',
    savedLocally: 'Saved locally on this device.',
    greeting: 'Welcome back, {name}.',
    homeMessage: 'Your foundation is ready. The next slice will build your training setup.',
    editProfile: 'Edit profile',
    localBadge: 'LOCAL-FIRST',
    privacyNote: 'No account, cloud upload or public profile is created at this stage.',
  },
  it: {
    brandTagline: 'Porta avanti il tuo allenamento.',
    welcomeTitle: 'Crea il tuo profilo atleta',
    welcomeBody: 'RepShift parte in locale su questo dispositivo. Il profilo guiderà piani, progressioni e coaching futuri.',
    language: 'Lingua',
    username: 'Username',
    firstName: 'Nome',
    lastName: 'Cognome',
    preferredName: 'Come deve chiamarti RepShift?',
    birthDate: 'Data di nascita',
    height: 'Altezza (cm)',
    weight: 'Peso corporeo (kg)',
    saveProfile: 'Crea profilo locale',
    updateProfile: 'Salva modifiche',
    required: 'Questo campo è obbligatorio.',
    invalidUsername: 'Usa 3–20 lettere, numeri o underscore.',
    savedLocally: 'Salvato localmente su questo dispositivo.',
    greeting: 'Bentornato, {name}.',
    homeMessage: 'Le fondamenta sono pronte. La prossima slice costruirà il tuo setup di allenamento.',
    editProfile: 'Modifica profilo',
    localBadge: 'LOCAL-FIRST',
    privacyNote: 'In questa fase non vengono creati account, upload cloud o profili pubblici.',
  },
} as const;

export type MessageKey = keyof typeof messages.en;

export function translate(locale: Locale, key: MessageKey, variables?: Record<string, string>): string {
  let value: string = messages[locale]?.[key] ?? messages.en[key];

  if (variables) {
    Object.entries(variables).forEach(([name, replacement]) => {
      value = value.replaceAll(`{${name}}`, replacement);
    });
  }

  return value;
}
