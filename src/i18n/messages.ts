import type { Locale } from '../types/athlete';

export const messages = {
  en: {
    brandTagline: 'Shift your training forward.', welcomeTitle: 'Let’s build your profile', welcomeBody: 'A few details help RepShift shape training around your body, experience and preferences.',
    language: 'Language', username: 'Username', firstName: 'First name', lastName: 'Last name', preferredName: 'What should RepShift call you?', birthDate: 'Date of birth',
    height: 'Height', weight: 'Body weight', units: 'Units', metric: 'Metric', imperial: 'Imperial', kg: 'kg', lb: 'lb', cm: 'cm', ftIn: 'ft / in',
    saveProfile: 'Continue', updateProfile: 'Save changes', required: 'This field is required.', invalidUsername: 'Use 3–20 letters, numbers or underscores.', saved: 'Changes saved.',
    greeting: 'Welcome back, {name}.', homeMessage: 'Your profile is ready. Build your equipment setup so every future plan fits the way you actually train.', editProfile: 'Edit profile', profileSetup: 'ATHLETE PROFILE',
    privacyNote: 'Your personal details remain private unless you choose to share them in future community features.', menu: 'Menu', settings: 'Settings', appearance: 'Appearance', themeSystem: 'Use device setting', themeLight: 'Light', themeDark: 'Dark', close: 'Close',
    equipmentSetup: 'Equipment setup', equipmentTitle: 'Where do you train?', equipmentBody: 'Choose a starting setup, then fine-tune the equipment that is really available to you.',
    commercialGym: 'Commercial gym', commercialGymHint: 'Full machine and free-weight access', homeGym: 'Home gym', homeGymHint: 'Rack, bench and selected weights', minimalSetup: 'Minimal setup', minimalSetupHint: 'A few versatile essentials',
    availableEquipment: 'Available equipment', selectedCount: '{count} selected', saveEquipment: 'Save equipment', editEquipment: 'Edit equipment', equipmentReady: 'Your training environment is ready.', back: 'Back',
    categoryFreeWeights: 'Free weights', categoryMachines: 'Machines', categoryCables: 'Cables', categoryBodyweight: 'Bodyweight', categoryAccessories: 'Accessories',
    equipmentBarbell: 'Barbell', equipmentDumbbells: 'Dumbbells', equipmentAdjustableDumbbells: 'Adjustable dumbbells', equipmentBench: 'Bench', equipmentRack: 'Rack', equipmentCableStation: 'Cable station', equipmentLatPulldown: 'Lat pulldown', equipmentLegPress: 'Leg press', equipmentLegExtension: 'Leg extension', equipmentLegCurl: 'Leg curl', equipmentPullupBar: 'Pull-up bar', equipmentBands: 'Resistance bands',
  },
  it: {
    brandTagline: 'Porta avanti il tuo allenamento.', welcomeTitle: 'Costruiamo il tuo profilo', welcomeBody: 'Pochi dettagli aiutano RepShift a modellare l’allenamento sul tuo corpo e sulle tue preferenze.',
    language: 'Lingua', username: 'Username', firstName: 'Nome', lastName: 'Cognome', preferredName: 'Come deve chiamarti RepShift?', birthDate: 'Data di nascita',
    height: 'Altezza', weight: 'Peso corporeo', units: 'Unità di misura', metric: 'Metriche', imperial: 'Imperiali', kg: 'kg', lb: 'lb', cm: 'cm', ftIn: 'piedi / pollici',
    saveProfile: 'Continua', updateProfile: 'Salva modifiche', required: 'Questo campo è obbligatorio.', invalidUsername: 'Usa 3–20 lettere, numeri o underscore.', saved: 'Modifiche salvate.',
    greeting: 'Bentornato, {name}.', homeMessage: 'Il profilo è pronto. Configura le tue attrezzature così ogni piano futuro rispetterà il modo in cui ti alleni davvero.', editProfile: 'Modifica profilo', profileSetup: 'PROFILO ATLETA',
    privacyNote: 'I tuoi dati personali restano privati, salvo tua scelta nelle future funzioni community.', menu: 'Menu', settings: 'Impostazioni', appearance: 'Aspetto', themeSystem: 'Segui il dispositivo', themeLight: 'Chiaro', themeDark: 'Scuro', close: 'Chiudi',
    equipmentSetup: 'Configura attrezzatura', equipmentTitle: 'Dove ti alleni?', equipmentBody: 'Scegli una configurazione di partenza, poi indica cosa hai davvero a disposizione.',
    commercialGym: 'Palestra completa', commercialGymHint: 'Macchinari e pesi liberi completi', homeGym: 'Home gym', homeGymHint: 'Rack, panca e pesi selezionati', minimalSetup: 'Setup essenziale', minimalSetupHint: 'Pochi strumenti versatili',
    availableEquipment: 'Attrezzatura disponibile', selectedCount: '{count} selezionati', saveEquipment: 'Salva attrezzatura', editEquipment: 'Modifica attrezzatura', equipmentReady: 'Il tuo ambiente di allenamento è pronto.', back: 'Indietro',
    categoryFreeWeights: 'Pesi liberi', categoryMachines: 'Macchinari', categoryCables: 'Cavi', categoryBodyweight: 'Corpo libero', categoryAccessories: 'Accessori',
    equipmentBarbell: 'Bilanciere', equipmentDumbbells: 'Manubri', equipmentAdjustableDumbbells: 'Manubri regolabili', equipmentBench: 'Panca', equipmentRack: 'Rack', equipmentCableStation: 'Stazione cavi', equipmentLatPulldown: 'Lat machine', equipmentLegPress: 'Leg press', equipmentLegExtension: 'Leg extension', equipmentLegCurl: 'Leg curl', equipmentPullupBar: 'Sbarra trazioni', equipmentBands: 'Elastici',
  },
} as const;

export type MessageKey = keyof typeof messages.en;
export function translate(locale: Locale, key: MessageKey, variables?: Record<string, string>): string {
  let value: string = messages[locale]?.[key] ?? messages.en[key];
  if (variables) Object.entries(variables).forEach(([name, replacement]) => { value = value.replaceAll(`{${name}}`, replacement); });
  return value;
}
