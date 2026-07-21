export interface ExerciseSourceReference {
  source: 'free-exercise-db' | 'wger';
  sourceId: string;
  license: string;
  referenceOnly: boolean;
  imageUrls: string[];
}

const freeDbImage = (exerciseId: string, index: number) =>
  `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${exerciseId}/${index}.jpg`;

const freeDb = (sourceId: string): ExerciseSourceReference => ({
  source: 'free-exercise-db',
  sourceId,
  license: 'Unlicense / public domain dedication',
  referenceOnly: true,
  imageUrls: [freeDbImage(sourceId, 0), freeDbImage(sourceId, 1)],
});

/**
 * External visual references matched to RepShift's curated exercise IDs.
 *
 * These images are intentionally marked referenceOnly. They can be shown during
 * development and used to plan RepShift's proprietary illustrations, but should
 * not silently become the final branded asset set.
 */
export const exerciseSourceReferences: Partial<Record<string, ExerciseSourceReference>> = {
  barbell_bench_press: freeDb('Barbell_Bench_Press_-_Medium_Grip'),
  dumbbell_bench_press: freeDb('Dumbbell_Bench_Press'),
  push_up: freeDb('Pushups'),
  overhead_press: freeDb('Military_Press'),
  dumbbell_shoulder_press: freeDb('Dumbbell_Shoulder_Press'),
  lateral_raise: freeDb('Side_Lateral_Raise'),
  pull_up: freeDb('Pullups'),
  lat_pulldown: freeDb('Wide-Grip_Lat_Pulldown'),
  barbell_row: freeDb('Bent_Over_Barbell_Row'),
  one_arm_dumbbell_row: freeDb('One-Arm_Dumbbell_Row'),
  cable_row: freeDb('Seated_Cable_Rows'),
  barbell_squat: freeDb('Barbell_Squat'),
  goblet_squat: freeDb('Goblet_Squat'),
  leg_press: freeDb('Leg_Press'),
  romanian_deadlift: freeDb('Romanian_Deadlift'),
  dumbbell_romanian_deadlift: freeDb('Dumbbell_Stiff_Leg_Deadlift'),
  leg_curl: freeDb('Lying_Leg_Curls'),
  leg_extension: freeDb('Leg_Extensions'),
  dumbbell_lunge: freeDb('Dumbbell_Lunges'),
  barbell_curl: freeDb('Barbell_Curl'),
  dumbbell_curl: freeDb('Dumbbell_Bicep_Curl'),
  cable_triceps_pushdown: freeDb('Triceps_Pushdown_-_Rope_Attachment'),
  standing_calf_raise: freeDb('Standing_Calf_Raises'),
  plank: freeDb('Plank'),
};
