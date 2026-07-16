# Local-First, Cloud-Ready Architecture

RepShift launches without mandatory accounts or recurring backend costs, but user data must remain portable to a future cloud platform.

## Core rule

The local database is the primary source of truth for the first releases.

Feature code must depend on repository interfaces rather than directly on SQLite, IndexedDB or a future HTTP API.

```text
Feature / use case
        ↓
Domain repository interface
        ↓
Local repository implementation
        ↓
Web storage or native SQLite
```

A future synchronization layer is added alongside the local repository:

```text
Feature / use case
        ↓
Domain repository interface
        ↓
Local repository
        ↓
Sync outbox / sync engine
        ↓
Remote API
```

The user should continue to train and record sessions when the network is unavailable.

## Identity model

### Local installation identity

The first application launch generates a random `localOwnerId` UUID.

This identifies ownership inside the local installation before an account exists.

### Portable entity identity

Every user-owned record receives a UUID at creation time.

Do not use database row numbers as public or synchronization identities.

### Future account linking

When the athlete creates or signs into a cloud account:

1. the account receives a remote user ID;
2. the existing local profile is linked to that account;
3. local entities retain their UUIDs;
4. unsynchronized entities are uploaded;
5. the server returns remote IDs and revisions where required;
6. the local application remains usable offline.

Account creation must not generate a second empty athlete profile unless the user explicitly chooses to keep profiles separate.

## Required metadata

Every user-owned entity includes:

- UUID;
- creation timestamp;
- update timestamp;
- optional deletion timestamp;
- schema version;
- revision number;
- optional remote ID;
- synchronization state.

Soft-deletion tombstones are important because a deleted local record may need to be deleted remotely later.

## Repository boundaries

Examples:

```ts
interface AthleteRepository {
  getActiveProfile(): Promise<AthleteProfile | null>;
  save(profile: AthleteProfile): Promise<void>;
}

interface WorkoutRepository {
  getSession(id: string): Promise<WorkoutSession | null>;
  listSessions(query: WorkoutQuery): Promise<WorkoutSession[]>;
  saveSession(session: WorkoutSession): Promise<void>;
}
```

UI components must not contain SQL queries, IndexedDB operations or network calls.

## Storage adapters

### Web preview

During initial browser development, RepShift may use IndexedDB through a typed persistence adapter.

`localStorage` should only be used for small preferences such as theme or the last selected locale, not for workout history.

### Android

The Capacitor build should use SQLite or another durable native database adapter suitable for structured history and migrations.

### Shared behavior

Both adapters must pass the same repository contract tests. This reduces the risk of browser and Android builds behaving differently.

## Sync outbox

A future synchronization implementation should use an outbox rather than attempting remote writes directly from feature code.

```ts
interface SyncOutboxItem {
  id: string;
  entityType: string;
  entityId: string;
  operation: 'upsert' | 'delete';
  localRevision: number;
  createdAt: string;
  attemptCount: number;
  lastError?: string;
}
```

Saving a user entity and adding its outbox item should happen atomically where supported.

## Conflict strategy

Different data types need different policies.

### Prefer append-only history

Completed workout sessions and sets should rarely be overwritten. They are historical events and should normally be merged by entity ID.

### Last-write-wins only for low-risk preferences

Examples:

- selected language;
- theme;
- default timer sound.

### Explicit conflict resolution for meaningful edits

Examples:

- the same active plan edited independently on two devices;
- profile data changed offline on multiple devices;
- a session edited after synchronization.

The system should retain both revisions until a deterministic or user-confirmed resolution is made.

## Catalog data versus athlete data

Exercise definitions, standard equipment definitions, muscle taxonomy and default progression rules are versioned application catalog data.

Athlete-created records reference catalog IDs but preserve snapshots where history requires stability.

For example, a completed workout must still display correctly if an exercise tip or display name changes in a later catalog release.

## Data migration

Every database schema and stored entity has a version.

Migrations must be:

- incremental;
- testable;
- non-destructive where possible;
- backed by export/import tests;
- safe when the application is closed during migration.

A user must never lose years of training history because the app was updated.

## Backup before cloud accounts

Before the remote platform exists, RepShift should support local export and import.

Recommended first format:

```text
repshift-backup-YYYY-MM-DD.json
```

The export should contain:

- format version;
- application version;
- exported timestamp;
- user-owned entities;
- integrity information.

Images and catalog assets should not be duplicated in each backup unless they are user-created.

## Privacy preparation

Even during local-only operation:

- collect only data required by the feature;
- make sensitive fields optional;
- separate health limitations from future public profile fields;
- do not embed analytics identifiers into domain entities;
- document export and deletion behavior;
- never make future social visibility the default.

## Future global platform

The architecture should later allow independent services for:

- authentication;
- profile and backup synchronization;
- challenge definitions;
- challenge participation;
- leaderboard aggregation;
- shared plans;
- coach relationships;
- notifications.

These services must consume the same stable entity IDs and event history created by the local application.

## Testing without a PC

During early development, every merged feature should produce a browser-testable deployment.

The minimum mobile test loop is:

1. push or merge changes to GitHub;
2. automated checks run;
3. a preview deployment is generated;
4. open the preview URL on Android;
5. test touch layout, persistence and language switching;
6. report issues with screenshots and device details.

Android packaging is introduced only when native storage, lifecycle or device APIs become necessary.