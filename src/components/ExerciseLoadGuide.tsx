import { exerciseCatalog } from '../data/exerciseCatalog';
import { buildLoadGuidance, buildTransitionInstruction } from '../domain/loadGuidance';
import type { LoadSetupProfile } from '../types/loadSetup';

interface Props {
  exerciseId: string;
  targetKg: number;
  loadSetup: LoadSetupProfile | null;
  locale: 'it' | 'en';
  previousExerciseId?: string;
  previousTargetKg?: number;
  compact?: boolean;
}

export default function ExerciseLoadGuide({ exerciseId, targetKg, loadSetup, locale, previousExerciseId, previousTargetKg, compact = false }: Props) {
  const exercise = exerciseCatalog.find((item) => item.id === exerciseId);
  const guidance = buildLoadGuidance(exercise, targetKg, loadSetup);
  const previous = previousExerciseId ? buildLoadGuidance(exerciseCatalog.find((item) => item.id === previousExerciseId), previousTargetKg ?? 0, loadSetup) : null;
  const transition = buildTransitionInstruction(previous, guidance, locale);
  const summary = locale === 'it' ? guidance.summaryIt : guidance.summaryEn;
  const note = locale === 'it' ? guidance.noteIt : guidance.noteEn;

  return <aside className={compact ? 'exercise-load-guide compact' : 'exercise-load-guide'}>
    <div className="load-guide-title"><span>◉</span><div><small>{locale === 'it' ? 'MONTAGGIO CARICO' : 'LOAD SETUP'}</small><strong>{guidance.achievedKg > 0 ? `${guidance.achievedKg} kg` : locale === 'it' ? 'Corpo libero' : 'Bodyweight'}</strong></div>{guidance.exact && guidance.kind !== 'bodyweight' && <b>✓</b>}</div>
    <p>{summary}</p>
    {note && <em>{note}</em>}
    {transition && <div className="load-transition"><small>{locale === 'it' ? 'CAMBIO DAL PRECEDENTE' : 'CHANGE FROM PREVIOUS'}</small><strong>{transition}</strong></div>}
  </aside>;
}
