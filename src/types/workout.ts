export interface WorkoutExerciseDraft {
  id: string;
  exerciseId: string;
  sets: number;
  targetReps: number;
  targetLoadKg: number;
  restSeconds: number;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: WorkoutExerciseDraft[];
  createdAt: string;
  updatedAt: string;
}

export interface CompletedSet {
  setNumber: number;
  reps: number;
  loadKg: number;
  rir: number | null;
  completedAt: string;
}

export interface WorkoutSessionExercise {
  exerciseId: string;
  plannedSets: number;
  targetReps: number;
  targetLoadKg: number;
  restSeconds: number;
  completedSets: CompletedSet[];
}

export interface WorkoutSession {
  id: string;
  templateId: string;
  templateName: string;
  startedAt: string;
  completedAt: string | null;
  status: 'active' | 'completed' | 'interrupted';
  exercises: WorkoutSessionExercise[];
}
