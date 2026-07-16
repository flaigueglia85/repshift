# RepShift

**Smart bodybuilding progression, built around the athlete.**

RepShift is an offline-first fitness application designed primarily for bodybuilding, structured workout planning and controlled long-term progression.

The goal is not to create another basic workout log. RepShift aims to help users build effective training plans, understand their performance and progress through informed adjustments to volume, intensity, recovery and progressive overload.

The application is planned as a multilingual product from the beginning, launching initially in **English** and **Italian**, with an architecture that allows additional languages to be added through simple translation dictionaries without changing application logic.

> Project status: early planning and architecture phase.

---

## Product vision

RepShift should act as a practical training companion for athletes who want more than a list of exercises.

The app is intended to help users:

- create personalized bodybuilding and resistance-training plans;
- organize exercises, sessions, weekly splits and training cycles;
- record sets, repetitions, load, effort and notes;
- monitor progress over time;
- apply progressive overload in a controlled way;
- identify stalls, excessive fatigue and inconsistent progression;
- receive clear suggestions without losing control of their own program.

The first release will prioritize a reliable local experience, simple onboarding and useful training intelligence without mandatory accounts, advertisements or subscriptions.

---

## Core principles

### Offline-first

Core features and user data must remain available without an internet connection.

### Local ownership of data

During the initial phase, profiles, plans, workout history, measurements and preferences will be stored locally on the device.

### No mandatory account

Users should be able to start training immediately without registration.

### Zero recurring infrastructure costs

The launch version should not depend on paid servers, remote databases or cloud services for its essential functions.

### Intelligent, not intrusive

RepShift should explain recommendations and leave the final decision to the athlete.

### Built for expansion

The architecture should support future optional features such as synchronization, backups, accounts, coaching tools and additional languages without requiring a complete rewrite.

---

## Planned features

The initial feature set is still being defined, but the product direction includes:

- local athlete profile;
- goals, experience level and training availability;
- exercise library;
- custom exercises;
- workout-plan builder;
- weekly split management;
- live workout logging;
- sets, repetitions, load, RIR or RPE and rest tracking;
- progressive overload guidance;
- workout history;
- performance charts and personal records;
- body measurements and progress tracking;
- fatigue, recovery and adherence checks;
- deload and progression suggestions;
- local backup and restore;
- English and Italian interface at launch;
- easy addition of further languages.

This list is a direction, not a final commitment for the first public version.

---

## Internationalization

Internationalization must be part of the foundation rather than added after the interface has already been built.

Application text should never be hard-coded directly inside pages or components. Every visible string should use a stable translation key.

Example:

```ts
t('workout.start')
t('exercise.addSet')
t('progress.weeklyVolume')
```

Planned dictionary structure:

```text
src/
  i18n/
    index.ts
    locales/
      en/
        common.json
        onboarding.json
        workout.json
        progress.json
        settings.json
      it/
        common.json
        onboarding.json
        workout.json
        progress.json
        settings.json
```

Example English dictionary:

```json
{
  "workout": {
    "start": "Start workout",
    "finish": "Finish workout"
  }
}
```

Example Italian dictionary:

```json
{
  "workout": {
    "start": "Inizia allenamento",
    "finish": "Termina allenamento"
  }
}
```

Adding a new language should mainly require:

1. creating a new locale folder;
2. copying the reference English dictionaries;
3. translating the values without changing the keys;
4. registering the locale in the language configuration.

The English dictionaries will act as the canonical reference and fallback language.

The localization system should also support:

- plural forms;
- variables and interpolation;
- dates and times;
- numbers and decimal separators;
- units of measurement;
- locale fallback;
- missing-key warnings during development.

Training data must remain language-independent. Exercise identifiers, workout records and internal values should use stable IDs, while translated names and descriptions should be resolved only in the interface.

---

## Technology direction

RepShift is planned as a modern web application packaged for Android through a native bridge such as Capacitor.

The final stack has not yet been selected. The current direction is:

- TypeScript;
- a modern component-based frontend framework;
- Capacitor for Android packaging and native integrations;
- a local database such as SQLite;
- a dedicated internationalization library;
- a modular domain-driven application structure;
- automated validation and testing where useful.

Technology choices will be documented before implementation and should prioritize maintainability, offline reliability, performance and a polished mobile experience.

---

## Data and privacy

The initial version is intended to keep essential user information on the device.

RepShift should follow these principles:

- collect only data required for the app to function;
- avoid analytics and tracking by default during the initial phase;
- provide clear local data deletion;
- provide export and restore options before data becomes business-critical;
- never store secrets directly in the repository;
- document any future external service before introducing it.

A complete privacy policy will be prepared before publication on Google Play.

---

## Proposed project structure

The exact structure will depend on the selected framework, but the application should keep interface, domain logic, persistence and translations separated.

```text
src/
  app/
  components/
  features/
    athlete/
    exercises/
    plans/
    workouts/
    progression/
    measurements/
  domain/
  data/
    database/
    repositories/
  i18n/
    locales/
  navigation/
  services/
  theme/
  utils/
  tests/
```

---

## Roadmap

### Phase 0 — Product definition

- define the target athlete;
- define the first release scope;
- map the complete user journey;
- choose the technical stack;
- define the local data model;
- define design and accessibility foundations;
- establish translation conventions.

### Phase 1 — Local foundation

- project initialization;
- navigation and application shell;
- English and Italian localization;
- local profile;
- exercise library;
- workout-plan creation;
- local database and migrations.

### Phase 2 — Training experience

- live workout execution;
- set and performance logging;
- timers and session notes;
- workout history;
- progression rules and recommendations.

### Phase 3 — Progress and release preparation

- charts and personal records;
- measurements and adherence indicators;
- backup and restore;
- accessibility and device testing;
- Android release build;
- privacy policy and Google Play preparation.

---

## Repository conventions

Until dedicated contribution guidelines are added:

- use English for code, file names, branches, commits and technical documentation;
- use stable translation keys for every user-facing string;
- do not commit credentials, signing files or environment secrets;
- keep business logic independent from translated text;
- prefer small, focused commits;
- document significant architectural decisions.

Example commit messages:

```text
feat: add local athlete profile
fix: preserve workout state after app resume
docs: describe localization structure
refactor: separate progression rules from UI
```

---

# Italiano

**Progressione intelligente nel bodybuilding, costruita intorno all'atleta.**

RepShift è un'applicazione fitness offline-first progettata principalmente per il bodybuilding, la pianificazione strutturata degli allenamenti e una progressione efficace e controllata nel tempo.

L'obiettivo non è realizzare l'ennesimo semplice diario di allenamento. RepShift vuole aiutare l'utente a costruire programmi efficaci, comprendere le proprie prestazioni e progredire attraverso modifiche ragionate a volume, intensità, recupero e sovraccarico progressivo.

L'applicazione nasce come prodotto multilingua. Le lingue iniziali saranno **inglese** e **italiano**, ma la struttura permetterà di aggiungerne altre tramite dizionari di traduzione separati, senza modificare la logica dell'app.

## Principi principali

- funzionamento offline per tutte le funzioni essenziali;
- profilo e dati salvati localmente durante la prima fase;
- nessun account obbligatorio;
- nessuna pubblicità nella fase di lancio;
- nessun costo infrastrutturale ricorrente per le funzioni principali;
- suggerimenti comprensibili e sempre controllabili dall'utente;
- architettura pronta per future funzioni opzionali.

## Obiettivo iniziale

La prima versione dovrà permettere di:

- creare un profilo atleta locale;
- organizzare esercizi, schede e suddivisioni settimanali;
- registrare serie, ripetizioni, carico, RIR o RPE e recuperi;
- consultare lo storico degli allenamenti;
- monitorare prestazioni e record personali;
- ricevere indicazioni sulla progressione;
- gestire inglese e italiano;
- aggiungere nuove lingue copiando e traducendo i dizionari esistenti;
- esportare e ripristinare i dati locali.

## Regole per le traduzioni

Nessun testo visibile dovrà essere scritto direttamente nelle schermate. Ogni stringa userà una chiave stabile, per esempio:

```ts
t('workout.start')
t('exercise.addSet')
t('progress.weeklyVolume')
```

L'inglese sarà la lingua di riferimento e di fallback. I dati di allenamento resteranno indipendenti dalla lingua: esercizi, sessioni e record useranno identificatori stabili, mentre nomi e descrizioni tradotte verranno risolti soltanto nell'interfaccia.

---

## License

No open-source license has been selected yet.

All rights are reserved unless a license is added to this repository in the future.
