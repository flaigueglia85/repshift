export type MuscleGroup = 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps' | 'quadriceps' | 'hamstrings' | 'glutes' | 'calves' | 'core';
export type MovementPattern = 'horizontal_push' | 'horizontal_pull' | 'vertical_push' | 'vertical_pull' | 'squat' | 'hinge' | 'lunge' | 'isolation' | 'carry' | 'core';

export interface ExerciseVisualStage {
  id: 'setup' | 'execution' | 'finish';
  title: { it: string; en: string };
  cue: { it: string; en: string };
  assetKey: string;
}

export interface ExerciseDefinition {
  id: string;
  nameKey: string;
  primaryMuscle: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  movementPattern: MovementPattern;
  requiredEquipment: string[];
  optionalEquipment?: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  icon: string;
  tipKey: string;
  mistakeKey: string;
  alternativeIds: string[];
}