# RepShift Initial Domain Model

This document defines the first stable domain boundaries. The implementation may evolve, but entity identifiers and ownership rules should remain migration-friendly.

## Shared entity metadata

Every user-owned entity should include:

```ts
interface EntityMetadata {
  id: string;              // UUID generated locally
  createdAt: string;       // ISO 8601 UTC
  updatedAt: string;       // ISO 8601 UTC
  deletedAt?: string;      // soft-delete tombstone for future sync
  schemaVersion: number;
  revision: number;        // incremented on every meaningful change
  syncState?: 'local' | 'pending' | 'synced' | 'conflict';
  remoteId?: string;       // absent during local-only operation
}
```

No user-owned entity should depend on an auto-increment database ID as its portable identity.

## Athlete profile

```ts
interface AthleteProfile extends EntityMetadata {
  localOwnerId: string;

  // Identity and personalization
  username: string;
  firstName: string;
  lastName?: string;
  preferredName?: string;  // name used by the coach and personalized UI
  displayName: string;     // public-facing name if community features are enabled

  // Regional preferences
  locale: string;
  unitSystem: 'metric' | 'imperial';

  // Personal data used by planning and recommendations
  birthDate?: string;      // ISO 8601 calendar date: YYYY-MM-DD
  sex?: 'female' | 'male' | 'other' | 'prefer_not_to_say';
  heightCm?: number;
  bodyWeightKg?: number;

  // Training profile
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  primaryGoal: 'hypertrophy' | 'strength_hypertrophy' | 'general_fitness';
  coachingTone: 'supportive' | 'direct' | 'hard_coach';
  availableDaysPerWeek: number;
  preferredSessionMinutes: number;
}
```

`preferredName` should be used for greetings, coaching messages and workout feedback. If it is absent, the application falls back to `firstName`, then `username`.

Age must be derived from `birthDate` at runtime rather than stored as a separate mutable field. This avoids stale age data and supports age-aware planning rules.

During local-only operation, `username` identifies the athlete inside the device and does not need global uniqueness. When cloud accounts are introduced, the backend will validate and reserve a globally unique username. Local profile IDs remain the authoritative link to existing plans and history during account migration.

Identity data, private personal data and future public profile data must remain logically separated. Birth date, body measurements and health information must never become public by default.

Body weight in the profile represents the latest known value for quick access. Long-term body-weight progression should be stored as dated measurements rather than overwriting historical values.

```ts
interface BodyMeasurement extends EntityMetadata {
  localOwnerId: string;
  measuredAt: string;
  bodyWeightKg?: number;
  heightCm?: number;
  bodyFatPercent?: number;
  notes?: string;
}
```

Health and limitation information should be optional, explicit and stored separately from public-facing profile data if cloud features are later introduced.

## Equipment profile

```ts
interface EquipmentItem extends EntityMetadata {
  localOwnerId: string;
  catalogEquipmentId?: string;
  customName?: string;
  category: string;
  loadingType:
    | 'bodyweight'
    | 'fixed_weight'
    | 'free_plates'
    | 'plate_loaded'
    | 'weight_stack'
    | 'selectorized'
    | 'cable_stack'
    | 'assisted';
  available: boolean;
  notes?: string;
}
```

## Barbell and plate inventory

```ts
interface Barbell extends EntityMetadata {
  localOwnerId: string;
  name: string;
  weightKg: number;
  sleeveCapacityKg?: number;
}

interface PlateInventoryItem extends EntityMetadata {
  localOwnerId: string;
  weightKg: number;
  quantity: number;
}
```

Quantities represent individual plates, not pairs. The UI may present pairs for convenience.

## Muscle taxonomy

```ts
interface MuscleDefinition {
  id: string;
  parentId?: string;
  nameKey: string;
  bodyRegion: string;
}
```

Initial taxonomy includes chest, upper chest, lats, upper back, traps, lower back, front delts, side delts, rear delts, biceps, triceps, forearms, quads, hamstrings, glutes, calves, abs, adductors and abductors.

## Exercise catalog

Catalog content is shipped with the application and is not owned by a user.

```ts
interface ExerciseDefinition {
  id: string;
  slug: string;
  nameKey: string;
  descriptionKey?: string;
  movementPattern: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  requiredEquipmentIds: string[];
  loadingType: string;
  muscleInvolvement: MuscleInvolvement[];
  tipKeys: string[];
  commonMistakeKeys: string[];
  alternativeExerciseIds: string[];
  assetId: string;
  defaultRepRanges: RepRange[];
  schemaVersion: number;
}

interface MuscleInvolvement {
  muscleId: string;
  role: 'primary' | 'secondary' | 'stabilizer';
  estimatedPercent: number;
}
```

Estimated percentages are product heuristics for planning and analytics, not claims of exact physiological measurement.

## Training plan

```ts
interface TrainingPlan extends EntityMetadata {
  localOwnerId: string;
  name: string;
  goal: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  startDate?: string;
  plannedWeeks: number;
  days: TrainingDayTemplate[];
  progressionPolicyId: string;
}

interface TrainingDayTemplate {
  id: string;
  nameKey?: string;
  customName?: string;
  targetDurationMinutes: number;
  slots: ExerciseSlot[];
}

interface ExerciseSlot {
  id: string;
  role: 'anchor' | 'rotation' | 'optional';
  movementPattern: string;
  targetMuscleIds: string[];
  selectedExerciseId?: string;
  candidateExerciseIds: string[];
  targetSets: number;
  repRange: RepRange;
  targetRir?: number;
  rotationPolicy?: RotationPolicy;
}
```

## Workout session

A completed session must preserve what actually happened, even if the plan later changes.

```ts
interface WorkoutSession extends EntityMetadata {
  localOwnerId: string;
  trainingPlanId?: string;
  trainingDayTemplateId?: string;
  startedAt: string;
  completedAt?: string;
  status: 'active' | 'completed' | 'interrupted' | 'discarded';
  availableMinutes?: number;
  readinessScore?: number;
  adaptationMode?: 'full' | 'compact' | 'essential' | 'recovery';
  exercises: WorkoutExercise[];
  notes?: string;
}

interface WorkoutExercise {
  id: string;
  exerciseId: string;
  equipmentItemId?: string;
  orderIndex: number;
  plannedSets?: number;
  sets: WorkoutSet[];
  replacementReason?: string;
}

interface WorkoutSet {
  id: string;
  setIndex: number;
  loadKg?: number;
  repetitions?: number;
  rir?: number;
  rpe?: number;
  completedAt?: string;
  setType: 'warmup' | 'working' | 'backoff' | 'drop' | 'failure';
  discomfort?: number;
  notes?: string;
}
```

## Progression recommendation

```ts
interface ProgressionRecommendation extends EntityMetadata {
  localOwnerId: string;
  exerciseId: string;
  sourceSessionIds: string[];
  recommendationType:
    | 'increase_load'
    | 'increase_reps'
    | 'add_set'
    | 'maintain'
    | 'reduce_load'
    | 'rotate_exercise'
    | 'deload'
    | 'technique_reset';
  targetLoadKg?: number;
  targetRepRange?: RepRange;
  reasonCode: string;
  explanationKey: string;
  status: 'proposed' | 'accepted' | 'rejected' | 'expired';
}
```

Recommendations store reason codes and source data so they remain explainable and auditable.

## Reward state

```ts
interface AthleteRewardState extends EntityMetadata {
  localOwnerId: string;
  shiftScore: number;
  momentum: number;
  unlockedMilestoneIds: string[];
  lastEvaluatedAt: string;
}
```

Reward definitions are catalog content; unlock state is user-owned data.

## Localization rule

Catalog entities never store visible translated strings as canonical values.

They store keys such as:

```text
exercise.barbellBenchPress.name
exercise.barbellBenchPress.tip.keepScapulaeStable
muscle.sideDelts.name
```

English is the canonical fallback locale. Italian is included at launch. New locale dictionaries can be added without changing entity IDs or business logic.

## Ownership boundaries

### Application catalog data

- exercises;
- equipment definitions;
- muscle definitions;
- movement patterns;
- default tips;
- progression rule definitions;
- reward definitions.

### User-owned data

- athlete profile;
- identity and personalization preferences;
- body measurements;
- available equipment;
- plate inventory;
- plans;
- sessions;
- sets;
- preferences;
- recommendations and decisions;
- reward progress.

Keeping these boundaries separate allows catalog updates without overwriting athlete history.