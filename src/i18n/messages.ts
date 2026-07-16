import type { Locale } from '../types/athlete';

export const messages = {
  en: {
    brandTagline: 'Shift your training forward.',
    welcomeTitle: 'Let’s build your profile',
    welcomeBody: 'A few details help RepShift shape training around your body, experience and preferences.',
    language: 'Language',
    username: 'Username',
    firstName: 'First name',
    lastName: 'Last name',
    preferredName: 'What should RepShift call you?',
    birthDate: 'Date of birth',
    height: 'Height',
    weight: 'Body weight',
    units: 'Units',
    metric: 'Metric',
    imperial: 'Imperial',
    kg: 'kg',
    lb: 'lb',
    cm: 'cm',
    ftIn: 'ft / in',
    saveProfile: 'Continue',
    updateProfile: 'Save changes',
    required: 'This field is required.',
    invalidUsername: 'Use 3–20 letters, numbers or underscores.',
    saved: 'Profile updated.',
    greeting: 'Welcome back, {name}.',
    homeMessage: 'Your profile is ready. Next, we’ll tailor RepShift to your training environment.',
    editProfile: 'Edit profile',
    profileSetup: 'ATHLETE PROFILE',
    privacyNote: 'Your personal details remain private unless you choose to share them in future community features.',
    menu: 'Menu',
    settings: 'Settings',
    appearance: 'Appearance',
    themeSystem: 'Use device setting',
    themeLight: 'Light',
    themeDark: 'Dark',
    close: 'Close',
  },
  it: {
    brandTagline: 'Porta avanti il tuo allenamento.',
    welcomeTitle: 'Costruiamo il tuo profilo',
    welcomeBody: 'Pochi dettagli aiutano RepShift a modellare l’allenamento sul tuo corpo e sulle tue preferenze.',
    language: 'Lingua',
    username: 'Username',
    firstName: 'Nome',
    lastName: 'Cognome',
    preferredName: 'Come deve chiamarti RepShift?',
    birthDate: 'Data di nascita',
    height: 'Altezza',
    weight: 'Peso corporeo',
    units: 'Unità di misura',
    metric: 'Metriche',
    imperial: 'Imperiali',
    kg: 'kg',
    lb: 'lb',
    cm: 'cm',
    ftIn: 'piedi / pollici',
    saveProfile: 'Continua',
    updateProfile: 'Salva modifiche',
    required: 'Questo campo è obbligatorio.',
    invalidUsername: 'Usa 3–20 lettere, numeri o underscore.',
    saved: 'Profilo aggiornato.',
    greeting: 'Bentornato, {name}.',
    homeMessage: 'Il profilo è pronto. Ora personalizzeremo RepShift sul tuo ambiente di allenamento.',
    editProfile: 'Modifica profilo',
    profileSetup: 'PROFILO ATLETA',
    privacyNote: 'I tuoi dati personali restano privati, salvo tua scelta nelle future funzioni community.',
    menu: 'Menu',
    settings: 'Impostazioni',
    appearance: 'Aspetto',
    themeSystem: 'Segui il dispositivo',
    themeLight: 'Chiaro',
    themeDark: 'Scuro',
    close: 'Chiudi',
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
