# RepShift Development Roadmap

This roadmap keeps the project testable as a web application from the earliest stage and delays Android packaging until the core experience is stable.

## Development strategy

Each phase should produce a usable vertical slice that can be opened in a mobile browser.

The initial workflow is:

```text
GitHub repository
→ automated web preview
→ mobile browser testing
→ iterative UI and logic validation
→ Capacitor Android project
→ APK/AAB testing
```

A native APK is not required during the first phases. The web application must remain responsive and touch-friendly from the first screen.

## Phase 0 — Product and architecture foundation

### Deliverables

- product vision;
- development roadmap;
- domain model;
- local-first/cloud-ready architecture;
- coding conventions;
- initial backlog.

### Exit criteria

The main entities, responsibilities and boundaries are documented before implementation begins.

## Phase 1 — Web application foundation

### Scope

- React;
- TypeScript;
- Vite;
- responsive mobile layout;
- application routing;
- theme tokens;
- reusable UI primitives;
- animation foundation;
- English and Italian localization;
- fallback locale behavior;
- basic local persistence adapter;
- automated lint, type-check and build.

### Testing target

A public or protected web preview that can be tested directly from an Android browser.

### Exit criteria

- application opens on mobile;
- language can be changed between English and Italian;
- theme and navigation work;
- CI build passes;
- no feature stores translated text directly in business data.

## Phase 2 — Local athlete profile

### Scope

- local profile creation;
- units: kg/lb;
- experience level;
- primary goal;
- training availability;
- preferred workout duration;
- optional anthropometric data;
- coaching tone;
- local profile editing;
- stable UUID identity.

### Cloud-readiness requirement

The profile uses a local UUID and synchronization metadata even before accounts exist.

### Exit criteria

The athlete can create, close, reopen and edit a profile without losing data.

## Phase 3 — Equipment and load setup

### Scope

- equipment categories;
- available machines and tools;
- loading system classification;
- barbells and their weights;
- plate inventory and quantities;
- adjustable dumbbells;
- machine increments;
- load calculator;
- nearest achievable load;
- per-side loading instructions.

### Exit criteria

The athlete can configure a home gym or commercial gym setup and receive valid loading instructions.

## Phase 4 — Exercise library foundation

### Scope

- muscle taxonomy;
- movement patterns;
- equipment requirements;
- primary and secondary muscle involvement;
- estimated involvement percentages;
- tips and common mistakes;
- exercise alternatives;
- initial proprietary visual assets;
- first curated exercise pack.

### Initial content target

Approximately 60–80 high-value exercises rather than a shallow database of hundreds.

### Exit criteria

Exercises can be filtered by muscle, equipment, movement and availability.

## Phase 5 — Workout logging vertical slice

### Scope

- create a simple workout;
- start a live session;
- log sets, reps and load;
- optional RIR;
- rest timer;
- recent performance display;
- complete or interrupt a session;
- workout history.

### Exit criteria

A complete workout can be recorded from start to finish on a phone browser.

## Phase 6 — Guided plan builder

### Scope

- days per week;
- session duration;
- available equipment;
- muscle priorities;
- split selection;
- exercise slot generation;
- anchor exercises;
- rotating accessory slots;
- manual replacement;
- validation of weekly balance.

### Exit criteria

The app can generate an explainable, editable plan compatible with the athlete's equipment.

## Phase 7 — Adaptive workout day

### Scope

- available time input;
- readiness input;
- discomfort flags;
- full, compact, essential and recovery versions;
- exercise prioritization;
- sensible volume reduction;
- compatible supersets;
- clear explanation of changes.

### Exit criteria

The same planned day can be transformed coherently for different time and readiness conditions.

## Phase 8 — Progression engine

### Scope

- double progression;
- repetition targets;
- RIR-aware decisions;
- minimum available increment;
- plateau detection;
- load, rep and set recommendations;
- exercise rotation suggestions;
- consolidation and deload signals;
- supportive, direct and hard-coach tone.

### Exit criteria

Recommendations are deterministic, testable and accompanied by a reason.

## Phase 9 — Analytics and intelligent diary

### Scope

- weekly hard sets;
- estimated muscle distribution;
- volume trends;
- performance trends;
- personal records;
- consistency;
- average session duration;
- plateau alerts;
- weekly coach summary.

### Exit criteria

The athlete receives a useful weekly overview without needing to interpret raw tables.

## Phase 10 — Reward layer

### Scope

- Shift Score;
- Momentum;
- meaningful milestones;
- session completion feedback;
- progression celebrations;
- comeback rewards;
- cycle completion;
- restrained visual transitions.

### Exit criteria

Rewards encourage useful behavior and do not pressure the athlete to train when recovery is needed.

## Phase 11 — Android packaging

### Scope

- Capacitor integration;
- Android project;
- SQLite native adapter where appropriate;
- storage migration tests;
- app lifecycle handling;
- offline behavior;
- APK internal testing;
- AAB production build.

### Exit criteria

The same athlete data and core workflows behave consistently in web and Android builds.

## Phase 12 — Release preparation

### Scope

- local backup/export;
- import and recovery;
- privacy policy;
- onboarding refinement;
- accessibility review;
- device testing;
- crash reporting decision;
- Play Store assets;
- closed beta;
- free launch.

## Future platform phase

Only after the local product is stable:

- optional account creation;
- cloud backup;
- synchronization engine;
- conflict handling;
- remote profile portability;
- challenges;
- leaderboards;
- social and coach features.

The future network layer must be added through adapters and synchronization services, not by replacing local repositories or changing feature-level business logic.