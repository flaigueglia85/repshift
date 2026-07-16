import { FormEvent, useEffect, useMemo, useState } from 'react';
import { translate } from './i18n/messages';
import { loadLocale, loadProfile, saveLocale, saveProfile } from './storage/profileStorage';
import type { AthleteProfile, AthleteProfileDraft, Locale, UnitSystem } from './types/athlete';
import './styles.css';

type ThemePreference = 'system' | 'light' | 'dark';
const THEME_KEY = 'repshift.theme.v1';

const emptyDraft = (locale: Locale): AthleteProfileDraft => ({
  username: '', firstName: '', lastName: '', preferredName: '', displayName: '', birthDate: '',
  heightCm: 175, bodyWeightKg: 75, locale, unitSystem: 'metric',
});

function profileToDraft(profile: AthleteProfile): AthleteProfileDraft {
  const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, schemaVersion: _schemaVersion, revision: _revision, syncState: _syncState, ...draft } = profile;
  return draft;
}

const kgToLb = (kg: number) => Math.round(kg * 2.20462);
const lbToKg = (lb: number) => Math.round((lb / 2.20462) * 10) / 10;
const cmToFeetInches = (cm: number) => {
  const inches = Math.round(cm / 2.54);
  return { feet: Math.floor(inches / 12), inches: inches % 12 };
};

export default function App() {
  const initialProfile = useMemo(() => loadProfile(), []);
  const [locale, setLocale] = useState<Locale>(initialProfile?.locale ?? loadLocale());
  const [profile, setProfile] = useState<AthleteProfile | null>(initialProfile);
  const [editing, setEditing] = useState(!initialProfile);
  const [draft, setDraft] = useState<AthleteProfileDraft>(() => initialProfile ? profileToDraft(initialProfile) : emptyDraft(locale));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<ThemePreference>(() => (localStorage.getItem(THEME_KEY) as ThemePreference) || 'system');

  const t = (key: Parameters<typeof translate>[1], variables?: Record<string, string>) => translate(locale, key, variables);
  const coachName = profile?.preferredName.trim() || profile?.firstName.trim() || profile?.username || '';

  useEffect(() => {
    const root = document.documentElement;
    const resolved = theme === 'system' ? (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark') : theme;
    root.dataset.theme = resolved;
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const changeLocale = (nextLocale: Locale) => {
    setLocale(nextLocale); saveLocale(nextLocale);
    setDraft((current) => ({ ...current, locale: nextLocale }));
  };

  const updateField = <K extends keyof AthleteProfileDraft>(key: K, value: AthleteProfileDraft[K]) => {
    setSaved(false); setDraft((current) => ({ ...current, [key]: value }));
  };

  const changeUnits = (unitSystem: UnitSystem) => updateField('unitSystem', unitSystem);

  const adjustHeight = (delta: number) => updateField('heightCm', Math.min(230, Math.max(120, (draft.heightCm ?? 175) + delta)));
  const adjustWeight = (delta: number) => updateField('bodyWeightKg', Math.round(Math.min(250, Math.max(35, (draft.bodyWeightKg ?? 75) + delta)) * 10) / 10);

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!draft.username.trim()) nextErrors.username = t('required');
    else if (!/^[a-zA-Z0-9_]{3,20}$/.test(draft.username.trim())) nextErrors.username = t('invalidUsername');
    if (!draft.firstName.trim()) nextErrors.firstName = t('required');
    if (!draft.birthDate) nextErrors.birthDate = t('required');
    return nextErrors;
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validate(); setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    const normalizedDraft: AthleteProfileDraft = {
      ...draft,
      username: draft.username.trim(), firstName: draft.firstName.trim(), lastName: draft.lastName.trim(),
      preferredName: draft.preferredName.trim(), displayName: draft.displayName.trim() || draft.username.trim(), locale,
    };
    const nextProfile = saveProfile(normalizedDraft, profile);
    setProfile(nextProfile); setDraft(profileToDraft(nextProfile)); setEditing(false); setSaved(true);
  };

  const heightLabel = draft.unitSystem === 'metric'
    ? `${draft.heightCm ?? 175} ${t('cm')}`
    : (() => { const value = cmToFeetInches(draft.heightCm ?? 175); return `${value.feet}′ ${value.inches}″`; })();
  const weightLabel = draft.unitSystem === 'metric'
    ? `${draft.bodyWeightKg ?? 75} ${t('kg')}`
    : `${kgToLb(draft.bodyWeightKg ?? 75)} ${t('lb')}`;

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-lockup"><div className="brand-mark">RS</div><strong>RepShift</strong></div>
        <button className="icon-button" aria-label={t('menu')} onClick={() => setMenuOpen(true)}><span></span><span></span><span></span></button>
      </header>

      {!editing && profile ? (
        <section className="hero-card home-card">
          <span className="eyebrow">REPSHIFT</span>
          <h1>{t('greeting', { name: coachName })}</h1>
          <p>{t('homeMessage')}</p>
          <div className="profile-summary">
            <div><span>@{profile.username}</span><small>{profile.firstName} {profile.lastName}</small></div>
            <div><span>{profile.unitSystem === 'metric' ? `${profile.bodyWeightKg} kg` : `${kgToLb(profile.bodyWeightKg ?? 0)} lb`}</span><small>{profile.unitSystem === 'metric' ? `${profile.heightCm} cm` : (() => { const h = cmToFeetInches(profile.heightCm ?? 0); return `${h.feet}′ ${h.inches}″`; })()}</small></div>
          </div>
          {saved && <div className="success-message">✓ {t('saved')}</div>}
          <button className="primary-button" onClick={() => setEditing(true)}>{t('editProfile')}</button>
        </section>
      ) : (
        <section className="hero-card">
          <span className="eyebrow">{t('profileSetup')}</span>
          <h1>{t('welcomeTitle')}</h1><p>{t('welcomeBody')}</p>
          <form onSubmit={submit} noValidate>
            <div className="form-grid">
              <label><span>{t('username')} *</span><input value={draft.username} autoComplete="username" placeholder="athlete_01" onChange={(e) => updateField('username', e.target.value)} />{errors.username && <small className="error">{errors.username}</small>}</label>
              <label><span>{t('firstName')} *</span><input value={draft.firstName} autoComplete="given-name" onChange={(e) => updateField('firstName', e.target.value)} />{errors.firstName && <small className="error">{errors.firstName}</small>}</label>
              <label><span>{t('lastName')}</span><input value={draft.lastName} autoComplete="family-name" onChange={(e) => updateField('lastName', e.target.value)} /></label>
              <label><span>{t('preferredName')}</span><input value={draft.preferredName} onChange={(e) => updateField('preferredName', e.target.value)} /></label>
              <label><span>{t('birthDate')} *</span><input type="date" value={draft.birthDate} onChange={(e) => updateField('birthDate', e.target.value)} />{errors.birthDate && <small className="error">{errors.birthDate}</small>}</label>
            </div>

            <div className="section-label">{t('units')}</div>
            <div className="segmented-control">
              <button type="button" className={draft.unitSystem === 'metric' ? 'active' : ''} onClick={() => changeUnits('metric')}>{t('metric')}<small>kg · cm</small></button>
              <button type="button" className={draft.unitSystem === 'imperial' ? 'active' : ''} onClick={() => changeUnits('imperial')}>{t('imperial')}<small>lb · ft</small></button>
            </div>

            <div className="measurement-grid">
              <div className="measurement-card">
                <span>{t('height')}</span><strong>{heightLabel}</strong>
                <input aria-label={t('height')} type="range" min="120" max="230" value={draft.heightCm ?? 175} onChange={(e) => updateField('heightCm', Number(e.target.value))} />
                <div className="stepper"><button type="button" onClick={() => adjustHeight(-1)}>−</button><button type="button" onClick={() => adjustHeight(1)}>+</button></div>
              </div>
              <div className="measurement-card">
                <span>{t('weight')}</span><strong>{weightLabel}</strong>
                <input aria-label={t('weight')} type="range" min="35" max="250" step="0.5" value={draft.bodyWeightKg ?? 75} onChange={(e) => updateField('bodyWeightKg', Number(e.target.value))} />
                <div className="stepper"><button type="button" onClick={() => adjustWeight(draft.unitSystem === 'metric' ? -0.5 : -lbToKg(1))}>−</button><button type="button" onClick={() => adjustWeight(draft.unitSystem === 'metric' ? 0.5 : lbToKg(1))}>+</button></div>
              </div>
            </div>
            <p className="privacy-note">{t('privacyNote')}</p>
            <button className="primary-button" type="submit">{profile ? t('updateProfile') : t('saveProfile')}</button>
          </form>
        </section>
      )}

      {menuOpen && <div className="sheet-backdrop" onClick={() => setMenuOpen(false)}>
        <section className="settings-sheet" onClick={(e) => e.stopPropagation()}>
          <div className="sheet-handle"></div><div className="sheet-title"><h2>{t('settings')}</h2><button onClick={() => setMenuOpen(false)}>×</button></div>
          <div className="setting-block"><span>{t('language')}</span><div className="option-list"><button className={locale === 'it' ? 'selected' : ''} onClick={() => changeLocale('it')}>Italiano</button><button className={locale === 'en' ? 'selected' : ''} onClick={() => changeLocale('en')}>English</button></div></div>
          <div className="setting-block"><span>{t('appearance')}</span><div className="option-list"><button className={theme === 'system' ? 'selected' : ''} onClick={() => setTheme('system')}>{t('themeSystem')}</button><button className={theme === 'light' ? 'selected' : ''} onClick={() => setTheme('light')}>{t('themeLight')}</button><button className={theme === 'dark' ? 'selected' : ''} onClick={() => setTheme('dark')}>{t('themeDark')}</button></div></div>
        </section>
      </div>}
    </main>
  );
}
