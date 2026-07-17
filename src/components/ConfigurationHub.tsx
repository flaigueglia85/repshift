import { useState } from 'react';
import ExerciseLibraryScreen from './ExerciseLibraryScreen';
import type { Locale } from '../types/athlete';
import type { EquipmentProfile } from '../types/equipment';
import type { LoadSetupProfile } from '../types/loadSetup';
import type { MessageKey } from '../i18n/messages';

interface Props {
  locale: Locale;
  t: (key: MessageKey, variables?: Record<string, string>) => string;
  equipmentProfile: EquipmentProfile | null;
  loadSetupProfile: LoadSetupProfile | null;
  onProfile: () => void;
  onEquipment: () => void;
  onLoads: () => void;
  onLocale: (locale: Locale) => void;
  theme: 'system' | 'light' | 'dark';
  onTheme: (theme: 'system' | 'light' | 'dark') => void;
}

export default function ConfigurationHub({ locale, t, equipmentProfile, loadSetupProfile, onProfile, onEquipment, onLoads, onLocale, theme, onTheme }: Props) {
  const [libraryOpen, setLibraryOpen] = useState(false);
  const completed = 1 + (equipmentProfile ? 1 : 0) + (loadSetupProfile ? 1 : 0);
  if (libraryOpen) return <section className="library-route"><div className="library-route-header"><button onClick={() => setLibraryOpen(false)}>‹</button><div><small>{locale === 'it' ? 'ESERCIZI' : 'EXERCISES'}</small><strong>{locale === 'it' ? 'Libreria esercizi' : 'Exercise library'}</strong></div><span /></div><ExerciseLibraryScreen locale={locale} equipmentProfile={equipmentProfile} /></section>;
  return <section className="configuration-hub">
    <div className="configuration-hero">
      <div><span className="eyebrow">{t('configuration')}</span><h1>{t('configurationTitle')}</h1><p>{t('configurationBody')}</p></div>
      <div className="configuration-score"><strong>{completed}/3</strong><small>{t('configurationProgress')}</small></div>
    </div>

    <button className="library-launch-card" onClick={() => setLibraryOpen(true)}><span>↗</span><div><small>{locale === 'it' ? 'LIBRERIA INTELLIGENTE' : 'SMART LIBRARY'}</small><strong>{locale === 'it' ? 'Esplora gli esercizi' : 'Explore exercises'}</strong><em>{locale === 'it' ? 'Filtrati sul tuo setup reale' : 'Filtered by your real setup'}</em></div><b>›</b></button>

    <div className="config-section-label">{t('trainingSetup')}</div>
    <div className="config-stack">
      <button className="config-card complete" onClick={onProfile}><span className="config-icon">●</span><div><strong>{t('profileSetup')}</strong><small>{t('profileReady')}</small></div><b>›</b></button>
      <button className={equipmentProfile ? 'config-card complete' : 'config-card'} onClick={onEquipment}><span className="config-icon">⌑</span><div><strong>{t('equipmentSetup')}</strong><small>{equipmentProfile ? t('selectedCount',{count:String(equipmentProfile.selectedEquipmentIds.length)}) : t('equipmentBody')}</small></div><b>›</b></button>
      <button className={loadSetupProfile ? 'config-card complete' : 'config-card'} onClick={onLoads}><span className="config-icon">◉</span><div><strong>{t('loadSetup')}</strong><small>{loadSetupProfile ? `${loadSetupProfile.barbellWeightKg} kg · ${loadSetupProfile.plates.reduce((sum, plate) => sum + plate.quantity / 2, 0)} ${t('pairs')}` : t('loadSetupBody')}</small></div><b>›</b></button>
    </div>

    <div className="config-section-label">{t('generalPreferences')}</div>
    <div className="preference-card">
      <div className="preference-row"><div><strong>{t('language')}</strong><small>{locale === 'it' ? 'Italiano' : 'English'}</small></div><div className="compact-choice"><button className={locale === 'it' ? 'active' : ''} onClick={() => onLocale('it')}>IT</button><button className={locale === 'en' ? 'active' : ''} onClick={() => onLocale('en')}>EN</button></div></div>
      <div className="preference-row"><div><strong>{t('appearance')}</strong><small>{theme === 'system' ? t('themeSystem') : theme === 'light' ? t('themeLight') : t('themeDark')}</small></div><div className="compact-choice three"><button className={theme === 'system' ? 'active' : ''} onClick={() => onTheme('system')}>A</button><button className={theme === 'light' ? 'active' : ''} onClick={() => onTheme('light')}>☀</button><button className={theme === 'dark' ? 'active' : ''} onClick={() => onTheme('dark')}>☾</button></div></div>
    </div>
  </section>;
}
