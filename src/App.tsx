import { FormEvent, useEffect, useMemo, useState } from 'react';
import { equipmentCatalog, equipmentPresets } from './data/equipmentCatalog';
import { translate } from './i18n/messages';
import { loadEquipmentProfile, saveEquipmentProfile } from './storage/equipmentStorage';
import { loadLocale, loadProfile, saveLocale, saveProfile } from './storage/profileStorage';
import type { AthleteProfile, AthleteProfileDraft, Locale, UnitSystem } from './types/athlete';
import type { EquipmentCategory, EquipmentProfile } from './types/equipment';
import './styles.css';

type ThemePreference = 'system' | 'light' | 'dark';
type View = 'home' | 'profile' | 'equipment';
const THEME_KEY = 'repshift.theme.v1';

const emptyDraft = (locale: Locale): AthleteProfileDraft => ({ username: '', firstName: '', lastName: '', preferredName: '', displayName: '', birthDate: '', heightCm: 175, bodyWeightKg: 75, locale, unitSystem: 'metric' });
function profileToDraft(profile: AthleteProfile): AthleteProfileDraft { const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, schemaVersion: _schemaVersion, revision: _revision, syncState: _syncState, ...draft } = profile; return draft; }
const kgToLb = (kg: number) => Math.round(kg * 2.20462);
const lbToKg = (lb: number) => Math.round((lb / 2.20462) * 10) / 10;
const cmToFeetInches = (cm: number) => { const inches = Math.round(cm / 2.54); return { feet: Math.floor(inches / 12), inches: inches % 12 }; };

export default function App() {
  const initialProfile = useMemo(() => loadProfile(), []);
  const initialEquipment = useMemo(() => loadEquipmentProfile(), []);
  const [locale, setLocale] = useState<Locale>(initialProfile?.locale ?? loadLocale());
  const [profile, setProfile] = useState<AthleteProfile | null>(initialProfile);
  const [equipmentProfile, setEquipmentProfile] = useState<EquipmentProfile | null>(initialEquipment);
  const [view, setView] = useState<View>(initialProfile ? 'home' : 'profile');
  const [draft, setDraft] = useState<AthleteProfileDraft>(() => initialProfile ? profileToDraft(initialProfile) : emptyDraft(locale));
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(initialEquipment?.selectedEquipmentIds ?? []);
  const [environment, setEnvironment] = useState<EquipmentProfile['environment']>(initialEquipment?.environment ?? 'commercial_gym');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<ThemePreference>(() => (localStorage.getItem(THEME_KEY) as ThemePreference) || 'system');

  const t = (key: Parameters<typeof translate>[1], variables?: Record<string, string>) => translate(locale, key, variables);
  const coachName = profile?.preferredName.trim() || profile?.firstName.trim() || profile?.username || '';

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme === 'system' ? (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark') : theme;
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const changeLocale = (nextLocale: Locale) => { setLocale(nextLocale); saveLocale(nextLocale); setDraft((current) => ({ ...current, locale: nextLocale })); };
  const updateField = <K extends keyof AthleteProfileDraft>(key: K, value: AthleteProfileDraft[K]) => { setSaved(false); setDraft((current) => ({ ...current, [key]: value })); };
  const changeUnits = (unitSystem: UnitSystem) => updateField('unitSystem', unitSystem);
  const adjustHeight = (delta: number) => updateField('heightCm', Math.min(230, Math.max(120, (draft.heightCm ?? 175) + delta)));
  const adjustWeight = (delta: number) => updateField('bodyWeightKg', Math.round(Math.min(250, Math.max(35, (draft.bodyWeightKg ?? 75) + delta)) * 10) / 10);

  const submitProfile = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!draft.username.trim()) nextErrors.username = t('required'); else if (!/^[a-zA-Z0-9_]{3,20}$/.test(draft.username.trim())) nextErrors.username = t('invalidUsername');
    if (!draft.firstName.trim()) nextErrors.firstName = t('required'); if (!draft.birthDate) nextErrors.birthDate = t('required');
    setErrors(nextErrors); if (Object.keys(nextErrors).length) return;
    const nextProfile = saveProfile({ ...draft, username: draft.username.trim(), firstName: draft.firstName.trim(), lastName: draft.lastName.trim(), preferredName: draft.preferredName.trim(), displayName: draft.displayName.trim() || draft.username.trim(), locale }, profile);
    setProfile(nextProfile); setDraft(profileToDraft(nextProfile)); setView('home'); setSaved(true);
  };

  const selectPreset = (nextEnvironment: EquipmentProfile['environment']) => {
    setEnvironment(nextEnvironment);
    setSelectedEquipment([...equipmentPresets[nextEnvironment]]);
  };
  const toggleEquipment = (id: string) => setSelectedEquipment((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const saveEquipment = () => { const next = saveEquipmentProfile(selectedEquipment, environment, equipmentProfile); setEquipmentProfile(next); setView('home'); setSaved(true); };

  const heightLabel = draft.unitSystem === 'metric' ? `${draft.heightCm ?? 175} ${t('cm')}` : (() => { const value = cmToFeetInches(draft.heightCm ?? 175); return `${value.feet}′ ${value.inches}″`; })();
  const weightLabel = draft.unitSystem === 'metric' ? `${draft.bodyWeightKg ?? 75} ${t('kg')}` : `${kgToLb(draft.bodyWeightKg ?? 75)} ${t('lb')}`;
  const categories: EquipmentCategory[] = ['free_weights', 'machines', 'cables', 'bodyweight', 'accessories'];
  const categoryKey: Record<EquipmentCategory, Parameters<typeof translate>[1]> = { free_weights: 'categoryFreeWeights', machines: 'categoryMachines', cables: 'categoryCables', bodyweight: 'categoryBodyweight', accessories: 'categoryAccessories' };

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="brand-lockup" onClick={() => profile && setView('home')}><div className="brand-mark">RS</div><strong>RepShift</strong></button>
        <button className="icon-button" aria-label={t('menu')} onClick={() => setMenuOpen(true)}><span></span><span></span><span></span></button>
      </header>

      {view === 'home' && profile && <section className="hero-card home-card">
        <span className="eyebrow">REPSHIFT</span><h1>{t('greeting', { name: coachName })}</h1><p>{t('homeMessage')}</p>
        <div className="profile-summary"><div><span>@{profile.username}</span><small>{profile.firstName} {profile.lastName}</small></div><div><span>{profile.unitSystem === 'metric' ? `${profile.bodyWeightKg} kg` : `${kgToLb(profile.bodyWeightKg ?? 0)} lb`}</span><small>{profile.unitSystem === 'metric' ? `${profile.heightCm} cm` : (() => { const h = cmToFeetInches(profile.heightCm ?? 0); return `${h.feet}′ ${h.inches}″`; })()}</small></div></div>
        {equipmentProfile ? <button className="feature-card complete" onClick={() => setView('equipment')}><span className="feature-icon">⌑</span><div><strong>{t('equipmentReady')}</strong><small>{t('selectedCount', { count: String(equipmentProfile.selectedEquipmentIds.length) })}</small></div><b>›</b></button> : <button className="feature-card" onClick={() => setView('equipment')}><span className="feature-icon">⌑</span><div><strong>{t('equipmentSetup')}</strong><small>{t('equipmentBody')}</small></div><b>›</b></button>}
        {saved && <div className="success-message">✓ {t('saved')}</div>}
        <button className="text-button" onClick={() => setView('profile')}>{t('editProfile')}</button>
      </section>}

      {view === 'profile' && <section className="hero-card"><button className="back-button" onClick={() => profile ? setView('home') : undefined}>‹ {t('back')}</button><span className="eyebrow">{t('profileSetup')}</span><h1>{t('welcomeTitle')}</h1><p>{t('welcomeBody')}</p>
        <form onSubmit={submitProfile} noValidate><div className="form-grid">
          <label><span>{t('username')} *</span><input value={draft.username} autoComplete="username" placeholder="athlete_01" onChange={(e) => updateField('username', e.target.value)} />{errors.username && <small className="error">{errors.username}</small>}</label>
          <label><span>{t('firstName')} *</span><input value={draft.firstName} autoComplete="given-name" onChange={(e) => updateField('firstName', e.target.value)} />{errors.firstName && <small className="error">{errors.firstName}</small>}</label>
          <label><span>{t('lastName')}</span><input value={draft.lastName} autoComplete="family-name" onChange={(e) => updateField('lastName', e.target.value)} /></label>
          <label><span>{t('preferredName')}</span><input value={draft.preferredName} onChange={(e) => updateField('preferredName', e.target.value)} /></label>
          <label><span>{t('birthDate')} *</span><input type="date" value={draft.birthDate} onChange={(e) => updateField('birthDate', e.target.value)} />{errors.birthDate && <small className="error">{errors.birthDate}</small>}</label>
        </div><div className="section-label">{t('units')}</div><div className="segmented-control"><button type="button" className={draft.unitSystem === 'metric' ? 'active' : ''} onClick={() => changeUnits('metric')}>{t('metric')}<small>kg · cm</small></button><button type="button" className={draft.unitSystem === 'imperial' ? 'active' : ''} onClick={() => changeUnits('imperial')}>{t('imperial')}<small>lb · ft</small></button></div>
        <div className="measurement-grid"><div className="measurement-card"><span>{t('height')}</span><strong>{heightLabel}</strong><input aria-label={t('height')} type="range" min="120" max="230" value={draft.heightCm ?? 175} onChange={(e) => updateField('heightCm', Number(e.target.value))} /><div className="stepper"><button type="button" onClick={() => adjustHeight(-1)}>−</button><button type="button" onClick={() => adjustHeight(1)}>+</button></div></div><div className="measurement-card"><span>{t('weight')}</span><strong>{weightLabel}</strong><input aria-label={t('weight')} type="range" min="35" max="250" step="0.5" value={draft.bodyWeightKg ?? 75} onChange={(e) => updateField('bodyWeightKg', Number(e.target.value))} /><div className="stepper"><button type="button" onClick={() => adjustWeight(draft.unitSystem === 'metric' ? -0.5 : -lbToKg(1))}>−</button><button type="button" onClick={() => adjustWeight(draft.unitSystem === 'metric' ? 0.5 : lbToKg(1))}>+</button></div></div></div>
        <p className="privacy-note">{t('privacyNote')}</p><button className="primary-button" type="submit">{profile ? t('updateProfile') : t('saveProfile')}</button></form></section>}

      {view === 'equipment' && <section className="hero-card equipment-screen"><button className="back-button" onClick={() => setView('home')}>‹ {t('back')}</button><span className="eyebrow">{t('equipmentSetup')}</span><h1>{t('equipmentTitle')}</h1><p>{t('equipmentBody')}</p>
        <div className="preset-grid">{(['commercial_gym','home_gym','minimal'] as const).map((preset) => <button key={preset} className={environment === preset ? 'preset-card selected' : 'preset-card'} onClick={() => selectPreset(preset)}><span>{preset === 'commercial_gym' ? '◫' : preset === 'home_gym' ? '⌂' : '◆'}</span><strong>{t(preset === 'commercial_gym' ? 'commercialGym' : preset === 'home_gym' ? 'homeGym' : 'minimalSetup')}</strong><small>{t(preset === 'commercial_gym' ? 'commercialGymHint' : preset === 'home_gym' ? 'homeGymHint' : 'minimalSetupHint')}</small></button>)}</div>
        <div className="equipment-heading"><strong>{t('availableEquipment')}</strong><span>{t('selectedCount', { count: String(selectedEquipment.length) })}</span></div>
        {categories.map((category) => <div className="equipment-category" key={category}><h3>{t(categoryKey[category])}</h3><div className="equipment-grid">{equipmentCatalog.filter((item) => item.category === category).map((item) => <button key={item.id} className={selectedEquipment.includes(item.id) ? 'equipment-card selected' : 'equipment-card'} onClick={() => toggleEquipment(item.id)}><span className="equipment-symbol">{item.icon}</span><strong>{t(item.nameKey as Parameters<typeof translate>[1])}</strong><span className="checkmark">✓</span></button>)}</div></div>)}
        <button className="primary-button sticky-action" onClick={saveEquipment}>{t('saveEquipment')}</button>
      </section>}

      {menuOpen && <div className="sheet-backdrop" onClick={() => setMenuOpen(false)}><section className="settings-sheet" onClick={(e) => e.stopPropagation()}><div className="sheet-handle"></div><div className="sheet-title"><h2>{t('settings')}</h2><button onClick={() => setMenuOpen(false)}>×</button></div><div className="setting-block"><span>{t('language')}</span><div className="option-list"><button className={locale === 'it' ? 'selected' : ''} onClick={() => changeLocale('it')}>Italiano</button><button className={locale === 'en' ? 'selected' : ''} onClick={() => changeLocale('en')}>English</button></div></div><div className="setting-block"><span>{t('appearance')}</span><div className="option-list"><button className={theme === 'system' ? 'selected' : ''} onClick={() => setTheme('system')}>{t('themeSystem')}</button><button className={theme === 'light' ? 'selected' : ''} onClick={() => setTheme('light')}>{t('themeLight')}</button><button className={theme === 'dark' ? 'selected' : ''} onClick={() => setTheme('dark')}>{t('themeDark')}</button></div></div></section></div>}
    </main>
  );
}
