export type TrainingGoal = 'hypertrophy' | 'strength' | 'recomposition';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export interface GuidedPlanPreferences {
  goal: TrainingGoal;
  daysPerWeek: 2 | 3 | 4 | 5 | 6;
  sessionMinutes: 30 | 45 | 60 | 75 | 90;
  experience: ExperienceLevel;
}

export interface GuidedPlanSummary {
  id: string;
  name: string;
  createdAt: string;
  preferences: GuidedPlanPreferences;
  templateIds: string[];
}
