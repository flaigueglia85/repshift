import { FormEvent, useMemo, useState } from 'react';
import { translate } from './i18n/messages';
import { loadLocale, loadProfile, saveLocale, saveProfile } from './storage/profileStorage';
import type { AthleteProfile, AthleteProfileDraft, Locale } from './types/athlete';
import './styles.css';

const emptyDraft = (locale: Locale): AthleteProfileDraft => ({
  username: '',
  firstName: '',
  lastName: '',
  preferredName: '',
  displayName: '',
  birthDate: '',
  heightCm: null,
  bodyWeightKg: null,
  locale,
  unitSystem: 'metric',
});

function profileToDraft(profile: AthleteProfile): AthleteProfileDraft {
  const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, schemaVersion: _schemaVersion, revision: _revision, syncState: _syncState, ...draft } = profile;
  return draft;
}

export default function App() {
  const initialProfile = useMemo(() => loadProfile(), []);
  const [locale, setLocale] = useState<Locale>(initialProfile?.locale ?? loadLocale());
  const [profile, setProfile] = useState<AthleteProfile | null>(initialProfile);
  const [editing, setEditing] = useState(!initialProfile);
  const [draft, setDraft] = useState<AthleteProfileDraft>(() => initialProfile ? profileToDraft(initialProfile) : emptyDraft(locale));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const t = (key: Parameters<typeof translate>[1], variables?: Record<string, string>) => translate(locale, key, variables);
  const coachName = profile?.preferredName.trim() || profile?.firstName.trim() || profile?.username || '';

  const changeLocale = (nextLocale: Locale) => {
    setLocale(nextLocale);
    saveLocale(nextLocale);
    setDraft((current) => ({ ...current, locale: nextLocale }));
  };

  const updateField = <K extends keyof AthleteProfileDraft>(key: K, value: AthleteProfileDraft[K]) => {
    setSaved(false);
    setDraft((current) => ({ ...current, [key]: value }));
  };

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
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const normalizedDraft: AthleteProfileDraft = {
      ...draft,
      username: draft.username.trim(),
      firstName: draft.firstName.trim(),
      lastName: draft.lastName.trim(),
      preferredName: draft.preferredName.trim(),
      displayName: draft.displayName.trim() || draft.username.trim(),
      locale,
    };

    const nextProfile = saveProfile(normalizedDraft, profile);
    setProfile(nextProfile);
    setDraft(profileToDraft(nextProfile));
    setEditing(false);
    setSaved(true);
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">RS</div>
          <div>
            <strong>RepShift</strong>
            <span>{t('brandTagline')}</span>
          </div>
        </div>
        <div className="language-switch" aria-label={t('language')}>
          <button className={locale === 'it' ? 'active' : ''} onClick={() => changeLocale('it')}>IT</button>
          <button className={locale === 'en' ? 'active' : ''} onClick={() => changeLocale('en')}>EN</button>
        </div>
      </header>

      {!editing && profile ? (
        <section className="hero-card home-card">
          <span className="eyebrow">{t('localBadge')}</span>
          <h1>{t('greeting', { name: coachName })}</h1>
          <p>{t('homeMessage')}</p>
          <div className="profile-summary">
            <div><span>@{profile.username}</span><small>{profile.firstName} {profile.lastName}</small></div>
            {profile.bodyWeightKg && <div><span>{profile.bodyWeightKg} kg</span><small>{profile.heightCm ? `${profile.heightCm} cm` : '—'}</small></div>}
          </div>
          {saved && <div className="success-message">✓ {t('savedLocally')}</div>}
          <button className="primary-button" onClick={() => setEditing(true)}>{t('editProfile')}</button>
        </section>
      ) : (
        <section className="hero-card">
          <span className="eyebrow">{t('localBadge')}</span>
          <h1>{t('welcomeTitle')}</h1>
          <p>{t('welcomeBody')}</p>

          <form onSubmit={submit} noValidate>
            <div className="form-grid">
              <label>
                <span>{t('username')} *</span>
                <input value={draft.username} autoComplete="username" placeholder="athlete_01" onChange={(e) => updateField('username', e.target.value)} />
                {errors.username && <small className="error">{errors.username}</small>}
              </label>
              <label>
                <span>{t('firstName')} *</span>
                <input value={draft.firstName} autoComplete="given-name" onChange={(e) => updateField('firstName', e.target.value)} />
                {errors.firstName && <small className="error">{errors.firstName}</small>}
              </label>
              <label>
                <span>{t('lastName')}</span>
                <input value={draft.lastName} autoComplete="family-name" onChange={(e) => updateField('lastName', e.target.value)} />
              </label>
              <label>
                <span>{t('preferredName')}</span>
                <input value={draft.preferredName} onChange={(e) => updateField('preferredName', e.target.value)} />
              </label>
              <label>
                <span>{t('birthDate')} *</span>
                <input type="date" value={draft.birthDate} onChange={(e) => updateField('birthDate', e.target.value)} />
                {errors.birthDate && <small className="error">{errors.birthDate}</small>}
              </label>
              <label>
                <span>{t('height')}</span>
                <input type="number" inputMode="decimal" min="80" max="260" value={draft.heightCm ?? ''} onChange={(e) => updateField('heightCm', e.target.value ? Number(e.target.value) : null)} />
              </label>
              <label>
                <span>{t('weight')}</span>
                <input type="number" inputMode="decimal" min="20" max="400" step="0.1" value={draft.bodyWeightKg ?? ''} onChange={(e) => updateField('bodyWeightKg', e.target.value ? Number(e.target.value) : null)} />
              </label>
            </div>
            <p className="privacy-note">{t('privacyNote')}</p>
            <button className="primary-button" type="submit">{profile ? t('updateProfile') : t('saveProfile')}</button>
          </form>
        </section>
      )}
    </main>
  );
}
