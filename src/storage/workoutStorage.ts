import type { WorkoutSession, WorkoutTemplate } from '../types/workout';

const TEMPLATE_KEY = 'repshift.workout.templates.v1';
const SESSION_KEY = 'repshift.workout.sessions.v1';
const ACTIVE_KEY = 'repshift.workout.active.v1';

const read = <T,>(key: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(key) ?? '') as T; } catch { return fallback; }
};

export const loadWorkoutTemplates = () => read<WorkoutTemplate[]>(TEMPLATE_KEY, []);
export const saveWorkoutTemplates = (templates: WorkoutTemplate[]) => { localStorage.setItem(TEMPLATE_KEY, JSON.stringify(templates)); return templates; };
export const loadWorkoutSessions = () => read<WorkoutSession[]>(SESSION_KEY, []);
export const saveWorkoutSessions = (sessions: WorkoutSession[]) => { localStorage.setItem(SESSION_KEY, JSON.stringify(sessions)); return sessions; };
export const loadActiveWorkoutSession = () => read<WorkoutSession | null>(ACTIVE_KEY, null);
export const saveActiveWorkoutSession = (session: WorkoutSession | null) => {
  if (session) localStorage.setItem(ACTIVE_KEY, JSON.stringify(session));
  else localStorage.removeItem(ACTIVE_KEY);
  return session;
};
